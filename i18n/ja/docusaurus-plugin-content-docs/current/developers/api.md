---
title: Rent Party API
sidebar_label: API
sidebar_position: 3
description: Rent PartyのREST API。ベースURL、読み取れる情報、初期値20件・最大50件のカーソルページング、全ルートとフィールドを記したOpenAPIファイル。
topics: [account]
last_update:
  date: 2026-11-19
---

Rent PartyのREST APIは1つのアドレスで提供されます。自分の記録を読み取れ、別途許可した場合は保存ゲームを削除できます。すべてのルートとフィールドはOpenAPIファイルが正式な参照先です。このページでは場所と共通の一覧取得ルールを説明します。

## ベースアドレスは？ {#base-address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1
```

末尾の`v1`がAPIのバージョンです。リクエストにはトークンか連携アプリが必要です。[アクセストークン](./authentication.md)をご覧ください。

```bash
curl -H "Authorization: Bearer $RENTPARTY_TOKEN" \
  https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json
```

## 読み取れるものは？ {#resources}

| 記録 | 読み取り | 削除 |
|---|---|---|
| プロフィールと統計 | 可 | 不可 |
| 終了したゲームの結果 | 可 | 不可 |
| バッジとレーティング履歴 | 可 | 不可 |
| 保存したゲーム | 可 | 削除権限があれば可 |

進行中のゲームはAPIに含まれません。手番、結果、レーティングは変更できません。結果に表示されるのは終了時にテーブルから見えた情報だけで、ほかの人の非公開情報は含まれません。

## 完全なリファレンスは？ {#reference}

| ファイル | アドレス | 開く方法 |
|---|---|---|
| OpenAPI 3.1のJSON | [`/v1/openapi.json`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json) | Swagger UI、Redocly、Postman、Insomnia、クライアント生成ツールなど |
| 同じ内容のMarkdown | [`/v1/openapi.md`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.md) | ブラウザー、テキストエディター、貼り付け先のAIアシスタント |

どちらもAPIと同じソースから生成されるため、存在しないルートが載ったり、存在するルートが抜けたりしません。

現在のAPI、MCP、Webhookが追加された日付は[開発者向け変更履歴](./changelog.md)をご覧ください。個別のルートはOpenAPIファイルで確認してください。

ゲーム終了時に知らせが必要なら、繰り返しAPIを読む代わりに[Webhook](./webhooks.md)で署名付き通知と再試行を利用できます。

主に確認するのは次の4項目です。

- **`paths`：** 各ルート、メソッド、必要な権限。
- **`components.schemas`：** 応答に含まれる各フィールドと型。記載のないフィールドは送られません。
- **`components.securitySchemes`：** BearerトークンとOAuthの2つの認証方法。
- **エラー応答：** [エラー形式](./authentication.md#errors)の`code`が取り得る値をルートごとに示します。

## ページングはどう動きますか？ {#pagination}

すべての一覧はページに分かれています。

- 初期値は**1ページ20件**、最大**50件**です。
- 続きがある場合は`next_cursor`が返ります。その値を次のリクエストに渡します。
- `next_cursor`がなければ最後のページです。

カーソルはページ番号ではなく、続きの位置を示すしおりです。取得中にゲームが終わっても、記録が1件ずつずれることはありません。各一覧ルートの件数とカーソルのパラメーターはOpenAPIファイルにあります。

## 制限とエラーは？ {#limits-and-errors}

全ルートで同じです。[アクセストークン](./authentication.md#rate-limits)のページをご覧ください。
