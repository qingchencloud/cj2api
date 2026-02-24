---
name: release
description: 版本发布：bump 版本号 → npm publish → git tag → push
license: MIT
metadata:
  version: "1.0.0"
  author: QingChen Cloud
  tags: ["npm", "release", "publish"]
---
# 发版 Release

发布新版本到 npm 并推送到 GitHub。

## 流程

1. 确认当前工作区干净（无未提交变更）
2. 询问版本号类型：patch / minor / major
3. 执行 `npm version <type>` 自动更新 package.json 并创建 git tag
4. 执行 `npm publish` 发布到 npm
5. 执行 `git push && git push --tags` 推送代码和标签到 GitHub
6. 输出发布摘要：版本号、npm 地址、GitHub tag 地址

## 注意事项

- npm 包名为 `@qingchencloud/cj2api`，scoped public 包
- 发布前确保 `npm whoami` 已登录且属于 `@qingchencloud` 组织
- 如果有 TypeScript 编译错误，先修复再发版
