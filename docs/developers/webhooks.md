---
title: Webhooks
sidebar_position: 5
description: Rent Party webhooks tell your own server when a game finishes, a badge is earned or a saved game comes and goes. Signed with Standard Webhooks, retried for just over a day, with checking code for Node, Python and PHP.
tags: [account]
last_update:
  date: 2026-11-19
---

:::warning[Not switched on yet (19 November 2026)]

Webhooks arrive with an upcoming Rent Party release. This page describes them as they’ll work.

:::

A webhook is a signed `POST` from Rent Party to an address you own, sent the moment something happens on your account. The last bankruptcy lands, and your server hears who won. Add the address under **Settings → Other apps → Webhooks**, pick its events, and check the signature on every request so you know it really came from us.

## Which events are there? {#events}

| Event | Sent when |
|---|---|
| `game.finished` | A game you played in ends |
| `achievement.earned` | You earn a badge |
| `saved_game.created` | A game is saved to your account |
| `saved_game.deleted` | One of your saved games is removed |
| `webhook.test` | You press **Send test event** |

Each event’s full payload is in the [OpenAPI file](./api.md#reference). This page doesn’t copy it, so it can’t fall behind.

## Which addresses are accepted? {#addresses}

- `https://` only, on port 443 or 8443, with no user name or password in the address.
- Never a private or local address: `localhost`, `127.0.0.1`, `10.x.x.x`, `192.168.x.x`, link-local addresses, or a name that points at any of them. The check runs when you save the address and again before every send. A redirect to a private address is refused too.
- Your server gets 10 seconds to answer.

## What does a request carry? {#headers}

Rent Party follows the [Standard Webhooks](https://www.standardwebhooks.com/) spec. Every request has three headers:

| Header | Holds |
|---|---|
| `webhook-id` | The event’s id. It stays the same on every retry, so use it to skip a repeat |
| `webhook-timestamp` | When it was sent, in seconds since 1970 |
| `webhook-signature` | `v1,` and a base64 HMAC-SHA256 signature. There can be more than one, separated by spaces |

The signing secret starts `whsec_`. You can see it again under the same [10-minute rule](./authentication.md#reveal) as a token. **Rotate** issues a new secret and signs with both for 24 hours, so a receiver that accepts either keeps working while you swap it in.

## How do you check a request? {#verify}

Check first, parse second, and check the exact bytes you received. JSON that’s been parsed and written out again won’t match its signature.

The libraries below are the Standard Webhooks ones: `standardwebhooks` 1.3.0 on npm and PyPI, and `standard-webhooks/standard-webhooks` 1.3.0 on Packagist, as checked on 19 November 2026.

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

### Any language {#any-language}

1. `secret = base64decode(the whsec value without its "whsec_" prefix)`.
2. `signed = webhook-id + "." + webhook-timestamp + "." + raw body` (the exact bytes received).
3. `expected = base64(HMAC_SHA256(secret, signed))`.
4. Compare `expected` with each `v1,` value in `webhook-signature`, in constant time. Any match passes.
5. Refuse it when `|now − webhook-timestamp| > 300`.

## What if your server doesn’t answer? {#retries}

Any `2xx` counts as delivered. Anything else, whether another status, a timeout or a refused connection, is a missed attempt, and Rent Party tries again:

| Attempt | Sent |
|---|---|
| 1 | Right away |
| 2 | 5 seconds later |
| 3 | 5 minutes later |
| 4 | 30 minutes later |
| 5 | 2 hours later |
| 6 | 5 hours later |
| 7 | 10 hours later |
| 8 | 10 hours later |

Three things switch an address off:

- **`410 Gone`**, at once. Answer with it when you’ve retired the address on purpose.
- **All eight attempts missing** for one event.
- **5 days of missed deliveries** in a row on the address.

When an address is switched off, Rent Party emails you its last error and a link to switch it back on.

## How do you test and replay? {#test-and-replay}

- **Send test event** sends `webhook.test` to the address now.
- The **delivery log** on each address lists every attempt: status, attempt number, response code, how long it took and when the next retry is due. It updates as deliveries happen, no reload needed.
- **Replay** sends one delivery again, with the same `webhook-id`. Back from an outage? Replay every missed delivery since a time you choose, up to 1,000 at once.
- **Pause** holds sends to an address until you resume it.
