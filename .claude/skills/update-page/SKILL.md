---
name: update-page
description: 维护内置测试页面（page.ts）
license: MIT
metadata:
  version: "1.0.0"
  author: QingChen Cloud
  tags: ["frontend", "page", "ui"]
---
# 更新测试页面 Update Page

修改内置测试页面（src/page.ts）。

## 页面结构

- 头部：标题 + 版本徽章 + ChatJimmy 链接 + API Key 提示
- 接口端点卡片：POST /v1/chat/completions、GET /v1/models
- 四个 Tab：测试面板、cURL 示例、Python 示例、Node.js 示例
- 响应结果区 + 统计栏（耗时、Token 数、输出速度）

## 注意事项

- 代码示例中的域名通过 JS 自动替换为 `window.location.origin`，无需硬编码
- 页面为纯 HTML/CSS/JS 内联在 TypeScript 模板字符串中
- CSS 使用暗色主题，极简风格
- 修改后需确保 TypeScript 编译通过：模板字符串中的 `${` 需要是合法的 TS 插值
