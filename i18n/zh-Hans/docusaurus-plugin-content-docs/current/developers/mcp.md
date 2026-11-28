---
title: 连接AI助手（MCP）
sidebar_label: AI助手（MCP）
sidebar_position: 4
description: 通过MCP服务器让Claude、ChatGPT、Claude Code或Cursor访问你的Rent Party记录。了解地址、授权页面、删除存档时的确认步骤，以及如何断开连接。
topics: [account]
last_update:
  date: 2026-11-19
---

Rent Party MCP服务器让AI助手在你提出请求时读取你的记录。*“最近十局我赢了几局？”* *“哪些存档已经一个月没碰了？”* 给助手一个地址，登录Rent Party，再在授权页面选择它可查看什么。Claude、ChatGPT、Claude Code、Cursor及其他支持MCP的助手都能连接。

## 地址是什么？ {#address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp
```

地址也在**设置 → 其他应用 → 连接AI助手**中，旁边有复制按钮。你无需把令牌粘贴到助手中。助手会从这个地址找到Rent Party的登录入口，并带你过去。

## 怎样连接各个助手？ {#connect}

这些应用会在版本更新时调整菜单。如果步骤和你看到的不一样，请到应用设置中寻找**连接器**。

### Claude {#claude}

1. 在Claude中打开**设置 → 连接器**，添加自定义连接器。
2. 粘贴上面的地址。
3. 按提示登录Rent Party，再在授权页面批准。

### ChatGPT {#chatgpt}

1. 在ChatGPT中打开**设置 → 连接器**。部分账号首次使用时需要开启开发者模式。
2. 用上面的地址添加连接器。
3. 按提示登录Rent Party，再在授权页面批准。

### Claude Code {#claude-code}

```bash
claude mcp add --transport http rentparty https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp
```

然后在Claude Code中运行`/mcp`，选择**rentparty**，并在打开的浏览器窗口中登录。

### Cursor {#cursor}

在`mcp.json`中添加Rent Party：

```json
{
  "mcpServers": {
    "rentparty": {
      "url": "https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp"
    }
  }
}
```

Cursor第一次使用时会要求登录。

## 授权页面会询问什么？ {#consent}

助手读取任何内容前，Rent Party会在`https://rentparty.aoneahsan.com/oauth/consent`向你展示：

- **哪个应用在请求访问**，以及授权后返回的地址；
- **将访问哪个Rent Party账号**，如果你有多个Google账号，请仔细核对；
- **可以做什么**，用清楚的语句说明，读取和删除分别成组、各有勾选框。删除默认不勾选；
- 并排的**批准**和**拒绝**按钮。

开启[两步登录](./two-step-sign-in.md)后，批准时还需输入验证码。页面不会替你批准；每个新连接都要经过这里。

助手只能使用你勾选的工具。只勾选读取，它就没有删除能力。

## 删除存档怎样确认？ {#removing}

助手可以**提出**删除，但只有你能**执行**。你让它清理旧存档时，它会显示将被删除的游戏和一个Rent Party链接。你需在10分钟内进入游戏确认，否则存档会留在原处。

因此，网页中夹带的一句话或粘贴的消息也无法诱导助手清除存档：它不能自行确认请求。

如果授权页面上没有勾选删除权限，助手连删除请求都不能提出。

## 怎样断开助手连接？ {#disconnect}

打开**设置 → 其他应用 → 已连接应用**，在对应行选择**撤销**。它的下一次请求就会失去访问权。列表会显示每个应用的权限、连接时间和最近使用时间；批准后，新应用会立即出现。每当有应用连接，Rent Party也会发邮件通知你。

## 为什么无法使用？ {#troubleshooting}

| 你看到的情况 | 处理方式 |
|---|---|
| 助手要求重新登录 | 连接已过期。请从助手再次登录Rent Party。 |
| 提示缺少权限 | 此连接未获该权限。断开后重新连接，并在授权页面勾选。 |
| Rent Party从工具列表消失，或所有调用都失败 | 连接已撤销。检查**已连接应用**，想继续用就重新连接。 |
| 助手说要清理的存档还在 | 没有在10分钟内于Rent Party确认，请重新提出请求。 |
| 想知道助手最近做了什么 | **已连接应用**会显示每个应用的最近使用时间。 |
