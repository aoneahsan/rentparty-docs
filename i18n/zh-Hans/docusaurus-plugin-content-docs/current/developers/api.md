---
title: Rent Party API
sidebar_label: API
sidebar_position: 3
description: Rent Party REST API的基本地址、可读取的数据、默认每页20条且最多50条的游标分页，以及描述全部路由和字段的OpenAPI文件。
topics: [account]
last_update:
  date: 2026-11-19
---

Rent Party API是一个统一地址的REST API。它可以读取你自己的记录，并在你授权时删除已保存的游戏。OpenAPI文件描述了每条路由和每个字段，是完整的参考资料。本页介绍文件地址和所有列表共用的规则。

## 基本地址是什么？ {#base-address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1
```

末尾的`v1`是API版本。每次请求都需要令牌或已连接应用。见[访问令牌](./authentication.md)。

```bash
curl -H "Authorization: Bearer $RENTPARTY_TOKEN" \
  https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json
```

## 可以读取什么？ {#resources}

| 你的记录 | 读取 | 删除 |
|---|---|---|
| 个人资料与统计 | 可以 | 不可以 |
| 已结束游戏的结果 | 可以 | 不可以 |
| 徽章与评分历史 | 可以 | 不可以 |
| 已保存游戏 | 可以 | 获得删除权限后可以 |

正在进行的游戏不会出现在API中；API也不能改变任何一步行动、结果或评分。结果只显示游戏结束时同桌玩家看到的信息，不会泄露其他玩家的私密资料。

## 完整参考资料在哪里？ {#reference}

| 文件 | 地址 | 打开方式 |
|---|---|---|
| OpenAPI 3.1 JSON | [`/v1/openapi.json`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json) | Swagger UI、Redocly、Postman、Insomnia或客户端生成器等OpenAPI工具 |
| 相同内容的Markdown版 | [`/v1/openapi.md`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.md) | 浏览器、文本编辑器，或粘贴给AI助手 |

两份文件与API使用同一数据来源，因此不会列出不存在的路由，也不会漏掉现有路由。

文件的四个部分能解答多数问题：

- **`paths`：**各路由、请求方法及所需权限范围。
- **`components.schemas`：**响应可能包含的字段及类型。未列出的字段不会发送。
- **`components.securitySchemes`：**两种认证方式：Bearer令牌和OAuth。
- **错误响应：**按路由列出[错误格式](./authentication.md#errors)可能返回的`code`。

## 分页怎样运作？ {#pagination}

每个列表都分页返回：

- 默认**每页20条**，最多**50条**。
- 如果还有下一页，响应会带有`next_cursor`。下一次请求传回该值即可。
- 如果没有`next_cursor`，说明已到最后一页。

游标是书签，不是页码。即使脚本读取结果时又结束了一局游戏，条目也不会错位。每条列表路由的页大小和游标参数都写在OpenAPI文件中。

## 请求上限和错误呢？ {#limits-and-errors}

所有路由使用相同规则，详见[访问令牌](./authentication.md#rate-limits)页面。
