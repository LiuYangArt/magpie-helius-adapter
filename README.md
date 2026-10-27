# Magpie Helius adapter

用于 Magpie 的本地网关中间件，处理 Helius 拒绝 `action.type = "other"` 导致请求失败的问题。

## 安装

需要已配置 Helius 的 Magpie，且版本支持网关中间件的 `onProvider` 钩子。供应商 ID 必须是 `helius`。

在 Magpie 的「插件」页面底部输入以下内容，点击「安装」：

```text
github:LiuYangArt/magpie-helius-adapter
```

也可使用命令行：

```sh
magpie plugin add github:LiuYangArt/magpie-helius-adapter
```

私有仓库需要仓库访问权限。若 Magpie 无法读取私有仓库，可先用已登录的 GitHub CLI 克隆，再在 Magpie 中选择本地目录安装：

```sh
gh repo clone LiuYangArt/magpie-helius-adapter
magpie plugin add ./magpie-helius-adapter
```

插件不包含凭据，不需要单独填写 API Key。启用后使用 Magpie 中已有的 Helius 配置。

## 处理范围

- 仅处理供应商 ID 为 `helius` 的 Responses 请求。
- 将 `input[].action.type` 中的 `other` 替换为 `search`。
- 其他供应商、协议和已有合法类型保持不变。

这是针对已观察到的历史搜索记录的兼容处理，不会还原丢失的搜索词，也不识别 `other` 的真实动作。当前实现检查所有顶层 input 项的 action，不额外判断记录类型。

## 验证与停用

```sh
node --test test.mjs
```

2026-10-24，本机原故障对话在启用后完成了网页搜索；这是历史验证记录，同事安装后仍需在自己的测试对话验证。

要停用，在 Magpie「插件 → 已安装」关闭或卸载本插件。本仓库仅提供网页搜索兼容中间件，不包含生图技能。
