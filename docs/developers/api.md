---
title: The Rent Party API
sidebar_label: The API
sidebar_position: 3
description: The Rent Party REST API. Its base address, what it reads, cursor pagination at 20 rows by default and 50 at most, and the OpenAPI file that describes every route and field.
tags: [account]
last_update:
  date: 2026-11-19
---

:::warning[Not switched on yet (19 November 2026)]

The API arrives with an upcoming Rent Party release. The addresses below won’t answer until then.

:::

The Rent Party API is a REST API at one address. It reads your own records, and it can remove a saved game when you’ve allowed that. Every route and field is described in an OpenAPI file, and that file is the reference. This page tells you where it lives and the rules every list follows.

## What’s the base address? {#base-address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1
```

The `v1` on the end is the API’s version. Every request needs a token or a connected app. See [Access tokens](./authentication.md).

```bash
curl -H "Authorization: Bearer $RENTPARTY_TOKEN" \
  https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json
```

## What can you read? {#resources}

| Part of your record | Read | Remove |
|---|---|---|
| Profile and stats | Yes | No |
| Finished game results | Yes | No |
| Badges and rating history | Yes | No |
| Saved games | Yes | Yes, with the remove scope |

A game that’s still being played isn’t in the API, and nothing in it can change a move, a result or a rating. Results show what the table saw at the end, never another player’s private details.

## Where’s the full reference? {#reference}

| File | Address | Open it with |
|---|---|---|
| OpenAPI 3.1, JSON | [`/v1/openapi.json`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json) | Any OpenAPI tool: Swagger UI, Redocly, Postman, Insomnia, or a client generator |
| The same, as Markdown | [`/v1/openapi.md`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.md) | A browser, a text editor, or an AI assistant you paste it into |

Both come from the same source as the API, so neither can list a route that doesn’t exist or miss one that does.

Four parts of the file answer most questions:

- **`paths`**: every route, its method, and the scope it needs.
- **`components.schemas`**: every field an answer can carry, with its type. A field that isn’t there is never sent.
- **`components.securitySchemes`**: the two ways in, a bearer token and OAuth.
- **The error responses**: every `code` the [error shape](./authentication.md#errors) can carry, route by route.

## How does paging work? {#pagination}

Every list comes in pages:

- **20 rows a page** by default, **50 at most**.
- A page with more after it carries a `next_cursor`. Send that value back for the next page.
- A page without a `next_cursor` is the last one.

A cursor is a bookmark, not a page number. Finish a game while your script is halfway through your results, and nothing shifts by one. Each list route names its page-size and cursor parameters in the OpenAPI file.

## What about limits and errors? {#limits-and-errors}

They’re the same on every route, and they live on the [Access tokens](./authentication.md#rate-limits) page.
