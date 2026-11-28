---
title: Webhook
sidebar_position: 5
description: Rent Party通过Webhook通知你的服务器游戏结束、获得徽章或存档增删。请求使用Standard Webhooks签名，失败后重试一天多，并提供Node、Python和PHP验证示例。
topics: [account]
last_update:
  date: 2026-11-19
---

Webhook是Rent Party在你的账号发生事件时，向你自己的地址发送的带签名`POST`请求。最后一位玩家破产，你的服务器就会得知赢家。请在**设置 → 其他应用 → Webhook**中添加地址、选择事件，并验证每次请求的签名，确认确实由我们发出。

## 有哪些事件？ {#events}

| 事件 | 发送时机 |
|---|---|
| `game.finished` | 你参加的一局游戏结束 |
| `achievement.earned` | 你获得徽章 |
| `saved_game.created` | 游戏保存到你的账号 |
| `saved_game.deleted` | 你的一份存档被删除 |
| `webhook.test` | 你选择**发送测试事件** |

各事件的完整载荷见[OpenAPI文件](./api.md#reference)。本页不复制它们，以免内容过时。

## 接受哪些地址？ {#addresses}

- 只接受`https://`，端口为443或8443，地址中不能包含用户名或密码。
- 不能使用私有或本地地址，例如`localhost`、`127.0.0.1`、`10.x.x.x`、`192.168.x.x`、链路本地地址，或解析到这些地址的域名。保存地址时及每次发送前都会检查；重定向到私有地址也会被拒绝。
- 你的服务器须在10秒内响应。

## 请求包含什么？ {#headers}

Rent Party遵循[Standard Webhooks](https://www.standardwebhooks.com/)规范。每次请求都有三个标头：

| 标头 | 内容 |
|---|---|
| `webhook-id` | 事件ID。重试时保持相同，可用于跳过重复事件 |
| `webhook-timestamp` | 发送时间，以1970年起的秒数表示 |
| `webhook-signature` | 以`v1,`开头的base64 HMAC-SHA256签名。可能有多个，用空格分隔 |

签名密钥以`whsec_`开头。和令牌一样，可以按[十分钟规则](./authentication.md#reveal)重新查看。选择**轮换**会发放新密钥，接下来的24小时同时用新旧密钥签名，让接收端在切换期间继续工作。

## 怎样验证请求？ {#verify}

先验证，再解析；验证时使用收到的原始字节。把JSON解析后重新序列化，签名就不会匹配。

以下使用Standard Webhooks的库：npm和PyPI上的`standardwebhooks` 1.3.0，以及Packagist上的`standard-webhooks/standard-webhooks` 1.3.0；版本于2026年11月19日核查。

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

### 任何语言 {#any-language}

1. `secret = base64decode(the whsec value without its "whsec_" prefix)`。
2. `signed = webhook-id + "." + webhook-timestamp + "." + raw body`（收到的原始字节）。
3. `expected = base64(HMAC_SHA256(secret, signed))`。
4. 以恒定时间将`expected`与`webhook-signature`中的每个`v1,`值比较。任一匹配即验证通过。
5. 当`|now − webhook-timestamp| > 300`时拒绝请求。

## 服务器没有响应怎么办？ {#retries}

任何`2xx`都算送达。其他状态码、超时或拒绝连接都算本次未送达，Rent Party会重试：

| 次数 | 发送时间 |
|---|---|
| 1 | 立即 |
| 2 | 5秒后 |
| 3 | 5分钟后 |
| 4 | 30分钟后 |
| 5 | 2小时后 |
| 6 | 5小时后 |
| 7 | 10小时后 |
| 8 | 再过10小时 |

以下三种情况会关闭这个地址：

- 返回**`410 Gone`**时立即关闭。若你主动停用了地址，可以用它响应。
- 同一事件的**八次尝试全部失败**。
- 该地址连续**5天未能送达**。

地址被关闭时，Rent Party会发邮件告知最后一次错误，并附上重新开启的链接。

## 怎样测试与重放？ {#test-and-replay}

- **发送测试事件**会立即向该地址发送`webhook.test`。
- 每个地址的**发送日志**列出每次尝试：状态、尝试次数、响应代码、耗时及下次重试时间。日志会随发送实时更新，无需刷新页面。
- **重放**会再次发送一项记录，沿用相同的`webhook-id`。服务恢复后，你可以从自选时间起重放所有未送达事件，一次最多1,000项。
- **暂停**会保留待发送内容，直到你恢复该地址。
