# CJ2API

将 [ChatJimmy](https://chatjimmy.ai) 转换为 OpenAI 兼容 API 的 Cloudflare Worker。

一键部署到 Cloudflare Workers，即可获得标准的 `/v1/chat/completions` 接口，兼容所有支持 OpenAI API 的客户端和框架。

## 特性

- **OpenAI 兼容** — 标准 Chat Completions API 格式，支持流式 (SSE) 和非流式响应
- **零成本部署** — 运行在 Cloudflare Workers 免费套餐上
- **自带测试页** — 访问根路径即可在线测试，附带 cURL / Python / Node.js 示例
- **Token 统计** — 响应中包含 `usage` 字段，测试页实时显示输出速度
- **极简代码** — 纯 TypeScript，无任何第三方运行时依赖

## 工作原理

```
客户端 (OpenAI SDK / curl / 任意 HTTP)
  │
  │  POST /v1/chat/completions
  │  标准 OpenAI 请求格式
  ▼
┌─────────────────────────┐
│   Cloudflare Worker      │
│                         │
│  1. 解析请求体           │
│  2. 提取 system 消息     │
│  3. 转换为上游格式       │
│  4. 转发到 ChatJimmy     │
│  5. 解析响应 + stats     │
│  6. 封装为 OpenAI 格式   │
└─────────────────────────┘
  │
  │  ChatJimmy 私有协议
  ▼
┌─────────────────────────┐
│   chatjimmy.ai/api/chat │
│   返回纯文本 + stats 块  │
└─────────────────────────┘
```

### 协议转换细节

**请求转换：** 客户端发送标准 OpenAI 格式，Worker 将其转换为 ChatJimmy 的私有格式：

- `messages` 中的 `system` 角色消息被提取为 `chatOptions.systemPrompt`
- `model` 映射到 `chatOptions.selectedModel`
- `top_k` 映射到 `chatOptions.topK`

**响应解析：** ChatJimmy 返回纯文本，末尾附带统计块：

```
这是回复内容...<|stats|>{"prefill_tokens":12,"decode_tokens":85,"total_tokens":97}<|/stats|>
```

Worker 解析出内容和统计信息，封装为标准 OpenAI 响应格式。

**模拟流式输出：** 上游不支持真正的 SSE 流式，Worker 采用"伪流式"策略 — 先获取完整响应，再将内容按自然断点（空格、标点、换行）拆分为小块，逐块以 SSE `data:` 事件推送给客户端。

## 快速部署

### 前置条件

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare 账号](https://dash.cloudflare.com/sign-up)（免费即可）

### 步骤

```bash
# 克隆仓库
git clone https://github.com/qingchencloud/cj2api.git
cd cj2api

# 安装依赖
npm install

# 本地开发
npm run dev

# 部署到 Cloudflare Workers
npm run deploy
```

部署完成后，Wrangler 会输出你的 Worker URL，形如 `https://cj2api.<你的子域>.workers.dev`。

## API 接口

### POST `/v1/chat/completions`

标准 OpenAI Chat Completions 接口，支持流式和非流式响应。

**请求体：**

```json
{
  "model": "llama3.1-8B",
  "messages": [
    { "role": "system", "content": "你是一个有帮助的助手" },
    { "role": "user", "content": "你好" }
  ],
  "stream": false,
  "top_k": 8
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 否 | 模型名称，默认 `llama3.1-8B` |
| `messages` | array | 是 | 消息列表，支持 `system` / `user` / `assistant` 角色 |
| `stream` | boolean | 否 | 是否启用流式输出，默认 `false` |
| `top_k` | number | 否 | Top-K 采样参数，默认 `8` |

**非流式响应：**

```json
{
  "id": "chatcmpl-xxxx",
  "object": "chat.completion",
  "created": 1740000000,
  "model": "llama3.1-8B",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "你好！有什么可以帮助你的吗？" },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 85,
    "total_tokens": 97
  }
}
```

**流式响应 (SSE)：**

当 `stream: true` 时，返回 `text/event-stream` 格式：

```
data: {"id":"chatcmpl-xxxx","object":"chat.completion.chunk","created":1740000000,"model":"llama3.1-8B","choices":[{"index":0,"delta":{"role":"assistant","content":"你好"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxxx","object":"chat.completion.chunk","created":1740000000,"model":"llama3.1-8B","choices":[{"index":0,"delta":{"content":"！"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxxx","object":"chat.completion.chunk","created":1740000000,"model":"llama3.1-8B","choices":[{"index":0,"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":12,"completion_tokens":85,"total_tokens":97}}

data: [DONE]
```

### GET `/v1/models`

返回可用模型列表。

```json
{
  "object": "list",
  "data": [
    { "id": "llama3.1-8B", "object": "model", "owned_by": "system" }
  ]
}
```

## 使用示例

### cURL

```bash
curl -X POST https://your-domain/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
  "model": "llama3.1-8B",
  "messages": [{"role": "user", "content": "你好"}],
  "stream": false
}'
```

### Python

```python
import requests

resp = requests.post(
    "https://your-domain/v1/chat/completions",
    json={
        "model": "llama3.1-8B",
        "messages": [{"role": "user", "content": "你好"}],
        "stream": False
    }
)
print(resp.json()["choices"][0]["message"]["content"])
```

### Node.js

```javascript
const resp = await fetch("https://your-domain/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3.1-8B",
    messages: [{ role: "user", content: "你好" }],
    stream: false
  })
});
const data = await resp.json();
console.log(data.choices[0].message.content);
```

### OpenAI SDK（Python）

由于完全兼容 OpenAI API 格式，可以直接使用官方 SDK：

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://your-domain/v1",
    api_key="any-string"  # 无需真实 API Key
)

response = client.chat.completions.create(
    model="llama3.1-8B",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

## 项目结构

```
cj2api/
├── src/
│   ├── index.ts        # 入口，路由分发
│   ├── chat.ts         # Chat Completions 处理（流式/非流式）
│   ├── models.ts       # 模型列表端点
│   ├── upstream.ts     # 上游 ChatJimmy 请求转换
│   ├── page.ts         # 内置测试页面
│   ├── types.ts        # TypeScript 类型定义
│   └── utils.ts        # 工具函数（ID生成、响应解析等）
├── wrangler.toml       # Cloudflare Workers 配置
├── tsconfig.json       # TypeScript 配置
├── package.json
└── README.md
```

## 搭配 cftunnel 使用

本地开发时，可以搭配 [cftunnel](https://github.com/qingchencloud/cftunnel) 将本地服务暴露到公网，方便远程调试或分享给他人测试。

### 快速体验（临时公网地址）

```bash
# 启动本地开发服务器
npm run dev
# 默认监听 http://localhost:8787

# 另开终端，用 cftunnel 生成临时公网地址
cftunnel quick 8787
# 输出类似: https://xxx-xxx-xxx.trycloudflare.com
```

拿到公网地址后，直接替换示例中的 `https://your-domain` 即可调用。

### 绑定自有域名（持久化）

```bash
cftunnel init
cftunnel create my-api
cftunnel add api 8787 --domain api.example.com
cftunnel up
```

这样你的 API 就可以通过 `https://api.example.com/v1/chat/completions` 稳定访问了。

## 免责声明

本项目仅供**学习研究和技术测试**使用，请勿用于任何商业用途。

- 本项目是对 [ChatJimmy](https://chatjimmy.ai) 公开接口的协议转换封装，不提供任何模型能力本身
- 使用者应遵守 ChatJimmy 的服务条款和使用政策
- 请勿将本项目用于大规模请求、自动化爬取或任何可能对上游服务造成负担的行为
- 上游服务的可用性、响应质量和模型能力均由 ChatJimmy 提供，与本项目无关
- 作者不对因使用本项目产生的任何直接或间接损失承担责任
- 如上游服务条款发生变更导致本项目不可用，作者不承担任何义务

## License

[MIT](LICENSE) © QingChen Cloud
