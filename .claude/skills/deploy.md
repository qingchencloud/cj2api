# 部署 Deploy

部署到 Cloudflare Workers。

## 流程

1. 检查是否已安装依赖（node_modules 是否存在），未安装则执行 `npm install`
2. 执行 `npm run deploy`（即 `wrangler deploy`）
3. 输出部署结果：Worker URL、部署状态

## 本地预览

如需本地测试，执行 `npm run dev`（即 `wrangler dev`），默认监听 `http://localhost:8787`。

## 搭配 cftunnel

本地开发时可用 `cftunnel quick 8787` 生成临时公网地址，方便远程调试。
