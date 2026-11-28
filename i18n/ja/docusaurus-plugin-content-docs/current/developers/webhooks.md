---
title: Webhook
sidebar_position: 5
description: Rent PartyのWebhookはゲーム終了、バッジ獲得、保存ゲームの追加・削除を自分のサーバーに知らせます。Standard Webhooksで署名され、1日強にわたって再試行されます。Node、Python、PHPでの検証例を紹介します。
topics: [account]
last_update:
  date: 2026-11-19
---

Webhookは、あなたのアカウントで何かが起きたときに、Rent Partyから所有するアドレスへ送る署名付きの`POST`です。最後のプレイヤーが破産したら、サーバーは勝者をすぐに知ることができます。**設定 → その他のアプリ → Webhook**でアドレスとイベントを選び、受け取るたびに署名を確認してください。

## どんなイベントがありますか？ {#events}

| イベント | 送信されるとき |
|---|---|
| `game.finished` | 参加したゲームが終了したとき |
| `achievement.earned` | バッジを獲得したとき |
| `saved_game.created` | ゲームがアカウントに保存されたとき |
| `saved_game.deleted` | 保存ゲームが削除されたとき |
| `webhook.test` | **テストイベントを送信**を押したとき |

各イベントのペイロード全体は[OpenAPIファイル](./api.md#reference)にあります。ここには重複して載せず、最新の定義を参照できます。

## どんなアドレスを登録できますか？ {#addresses}

- `https://`のみで、ポートは443または8443。アドレスにユーザー名やパスワードを含められません。
- 非公開またはローカルのアドレスは使えません。`localhost`、`127.0.0.1`、`10.x.x.x`、`192.168.x.x`、リンクローカルアドレス、それらを指すホスト名も対象です。登録時と各送信前に確認し、非公開アドレスへのリダイレクトも拒否します。
- サーバーは10秒以内に応答してください。

## リクエストには何が含まれますか？ {#headers}

Rent Partyは[Standard Webhooks](https://www.standardwebhooks.com/)仕様に従います。各リクエストに3つのヘッダーがあります。

| ヘッダー | 内容 |
|---|---|
| `webhook-id` | イベントID。再試行でも同じなので、重複処理を避けるために使えます。 |
| `webhook-timestamp` | 1970年からの秒数で表した送信時刻。 |
| `webhook-signature` | `v1,`とbase64のHMAC-SHA256署名。複数ある場合はスペースで区切られます。 |

署名用のシークレットは`whsec_`で始まります。トークンと同じ[10分間のルール](./authentication.md#reveal)で再表示できます。**再発行**すると新しいシークレットを発行し、24時間は両方で署名するため、受信側を切り替える間も動きます。

## リクエストを検証するには？ {#verify}

まず検証し、その後で解析してください。受け取ったバイト列をそのまま使います。一度解析して書き出し直したJSONでは署名が一致しません。

以下はStandard Webhooksのライブラリです。2026年11月19日に確認したバージョンは、npmとPyPIの`standardwebhooks` 1.3.0、Packagistの`standard-webhooks/standard-webhooks` 1.3.0です。

### Node {#node}

```js
import { Webhook } from 'standardwebhooks';

const wh = new Webhook(process.env.RENTPARTY_WEBHOOK_SECRET); // the whsec_… value

app.post('/hooks/rentparty', express.raw({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    event = wh.verify(req.body, req.headers); // throws on a bad signature or a stale timestamp
  } catch {
    return res.sendStatus(400);
  }
  if (seenBefore(req.headers['webhook-id'])) return res.sendStatus(200);
  queue.add(event); // answer quickly, do the work afterwards
  res.sendStatus(200);
});
```

### Python {#python}

```python
from standardwebhooks.webhooks import Webhook
wh = Webhook(os.environ["RENTPARTY_WEBHOOK_SECRET"])
payload = wh.verify(request.get_data(), dict(request.headers))
```

### PHP {#php}

```php
$wh = new \StandardWebhooks\Webhook(getenv('RENTPARTY_WEBHOOK_SECRET'));
$payload = $wh->verify(file_get_contents('php://input'), getallheaders());
```

### ほかの言語 {#any-language}

1. `secret = base64decode(the whsec value without its "whsec_" prefix)`。
2. `signed = webhook-id + "." + webhook-timestamp + "." + raw body`。受信した正確なバイト列を使います。
3. `expected = base64(HMAC_SHA256(secret, signed))`。
4. `webhook-signature`の各`v1,`値を`expected`と一定時間比較します。どれか1つでも一致すれば有効です。
5. `|now − webhook-timestamp| > 300`なら拒否します。

## サーバーが応答しない場合は？ {#retries}

`2xx`なら配達済みです。それ以外のステータス、時間切れ、接続拒否はいずれも失敗として、Rent Partyが再試行します。

| 試行 | 送信時刻 |
|---|---|
| 1 | 直ちに |
| 2 | 5秒後 |
| 3 | 5分後 |
| 4 | 30分後 |
| 5 | 2時間後 |
| 6 | 5時間後 |
| 7 | 10時間後 |
| 8 | 10時間後 |

次の3つの場合に送信先が停止します。

- **`410 Gone`**が返ると直ちに停止します。意図的に廃止したアドレスで使ってください。
- 1つのイベントで**8回すべて失敗**した場合。
- そのアドレスへの配達が**5日間連続で失敗**した場合。

停止時には、最後のエラーと再開用リンクをメールで知らせます。

## テストと再送は？ {#test-and-replay}

- **テストイベントを送信**すると、今すぐ`webhook.test`を送ります。
- 各アドレスの**配達履歴**には、状態、試行回数、応答コード、所要時間、次回の再試行時刻が表示されます。配達に合わせて更新され、再読み込みは不要です。
- **再送**は同じ`webhook-id`で1件を送り直します。障害から復旧したら、選んだ時刻以降の失敗分を最大1,000件まとめて再送できます。
- **一時停止**で送信を止め、後で再開できます。
