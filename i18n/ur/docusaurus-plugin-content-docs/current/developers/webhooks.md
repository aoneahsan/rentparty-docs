---
title: ویب ہکس
sidebar_position: 5
description: Rent Party ویب ہکس آپ کے سرور کو کھیل ختم ہونے، بیج ملنے، یا محفوظ کھیل کے بننے اور ہٹنے پر بتاتے ہیں۔ Standard Webhooks دستخط، ایک دن سے کچھ زیادہ کی دوبارہ کوششیں، اور Node، Python اور PHP میں جانچ کا کوڈ۔
topics: [account]
last_update:
  date: 2026-11-19
---

ویب ہک Rent Party کی طرف سے آپ کے پتے پر بھیجی گئی دستخط شدہ `POST` درخواست ہے، جو آپ کے اکاؤنٹ پر کوئی واقعہ ہوتے ہی بھیجی جاتی ہے۔ آخری کھلاڑی دیوالیہ ہوا تو آپ کے سرور کو فاتح کی خبر ملتی ہے۔ **ترتیبات ← دوسری ایپس ← ویب ہکس** میں پتہ شامل کریں، واقعات چنیں، اور ہر درخواست کے دستخط جانچیں تاکہ یقین ہو کہ یہ ہماری طرف سے آئی ہے۔

## کون سے واقعات ہیں؟ {#events}

| واقعہ | کب بھیجا جاتا ہے |
|---|---|
| `game.finished` | آپ کے کھیلے ہوئے کھیل کا اختتام |
| `achievement.earned` | آپ کو بیج ملنا |
| `saved_game.created` | کھیل آپ کے اکاؤنٹ میں محفوظ ہونا |
| `saved_game.deleted` | آپ کا محفوظ کھیل ہٹنا |
| `webhook.test` | آپ کا **آزمائشی واقعہ بھیجیں** دبانا |

ہر واقعے کا پورا payload [OpenAPI فائل](./api.md#reference) میں ہے۔ ہم اسے یہاں نقل نہیں کرتے تاکہ دونوں کی معلومات الگ نہ ہو جائیں۔

## کون سے پتے قبول ہوتے ہیں؟ {#addresses}

- صرف `https://`، پورٹ 443 یا 8443 پر، پتے میں صارف نام یا پاس ورڈ کے بغیر۔
- نجی یا مقامی پتہ کبھی نہیں: `localhost`، `127.0.0.1`، `10.x.x.x`، `192.168.x.x`، link-local پتے، یا ان کی طرف اشارہ کرنے والا نام۔ پتہ محفوظ کرتے وقت اور ہر بار بھیجنے سے پہلے جانچ ہوتی ہے۔ نجی پتے کی طرف redirect بھی رد ہوتا ہے۔
- جواب دینے کے لیے آپ کے سرور کو 10 سیکنڈ ملتے ہیں۔

## درخواست میں کیا آتا ہے؟ {#headers}

Rent Party [Standard Webhooks](https://www.standardwebhooks.com/) کے مطابق بھیجتا ہے۔ ہر درخواست میں تین headers ہیں:

| Header | اس میں کیا ہے |
|---|---|
| `webhook-id` | واقعے کی شناخت۔ ہر دوبارہ کوشش پر یہی رہتی ہے، اس لیے دہرائی ہوئی درخواست پہچان سکتے ہیں۔ |
| `webhook-timestamp` | بھیجنے کا وقت، 1970 سے سیکنڈوں میں۔ |
| `webhook-signature` | `v1,` کے ساتھ base64 HMAC-SHA256 دستخط۔ کئی دستخط ہوں تو خالی جگہ سے جدا ہوتے ہیں۔ |

دستخط کی خفیہ کلید `whsec_` سے شروع ہوتی ہے۔ ٹوکن کی طرح [10 منٹ کے قاعدے](./authentication.md#reveal) کے تحت دوبارہ دیکھ سکتے ہیں۔ **بدلیں** نئی کلید جاری کرتا ہے اور 24 گھنٹے دونوں کلیدوں سے دستخط کرتا ہے، تاکہ وصول کرنے والا نظام نئی کلید لگانے کے دوران بھی چلتا رہے۔

## درخواست کیسے جانچیں؟ {#verify}

پہلے دستخط جانچیں، پھر متن پڑھیں؛ اور وصول ہونے والے اصل bytes ہی جانچیں۔ JSON پڑھ کر دوبارہ لکھنے سے اس کے دستخط نہیں ملیں گے۔

نیچے کی libraries Standard Webhooks کی ہیں: npm اور PyPI پر `standardwebhooks` 1.3.0، اور Packagist پر `standard-webhooks/standard-webhooks` 1.3.0، جنہیں 19 نومبر 2026 کو جانچا گیا۔

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

### کوئی بھی زبان {#any-language}

1. `secret = base64decode(the whsec value without its "whsec_" prefix)`۔
2. `signed = webhook-id + "." + webhook-timestamp + "." + raw body`؛ یعنی موصول ہونے والے عین bytes۔
3. `expected = base64(HMAC_SHA256(secret, signed))`۔
4. `expected` کو `webhook-signature` کی ہر `v1,` قدر سے constant time میں ملائیں۔ کوئی ایک مل جائے تو درخواست درست ہے۔
5. `|now − webhook-timestamp| > 300` ہو تو درخواست رد کریں۔

## سرور جواب نہ دے تو؟ {#retries}

کوئی بھی `2xx` جواب ترسیل کی کامیابی ہے۔ دوسرا status، وقت ختم ہونا یا کنکشن رد ہونا ناکام کوشش ہے؛ Rent Party پھر کوشش کرتا ہے:

| کوشش | کب |
|---|---|
| 1 | فوراً |
| 2 | 5 سیکنڈ بعد |
| 3 | 5 منٹ بعد |
| 4 | 30 منٹ بعد |
| 5 | 2 گھنٹے بعد |
| 6 | 5 گھنٹے بعد |
| 7 | 10 گھنٹے بعد |
| 8 | مزید 10 گھنٹے بعد |

تین صورتوں میں پتہ بند ہوتا ہے:

- **`410 Gone`،** فوراً۔ جان بوجھ کر پتہ بند کیا ہو تو یہی جواب دیں۔
- **ایک واقعے کی آٹھوں کوششیں ناکام** ہوں۔
- **اسی پتے پر مسلسل 5 دن ترسیل ناکام** رہے۔

پتہ بند ہونے پر Rent Party آخری خرابی اور دوبارہ چالو کرنے کے لنک کے ساتھ ای میل بھیجتا ہے۔

## آزمائش اور دوبارہ بھیجنا کیسے ہے؟ {#test-and-replay}

- **آزمائشی واقعہ بھیجیں** ابھی اسی پتے پر `webhook.test` بھیجتا ہے۔
- ہر پتے کا **ترسیل ریکارڈ** ہر کوشش کی حالت، کوشش نمبر، جواب کا کوڈ، دورانیہ اور اگلی کوشش کا وقت دکھاتا ہے۔ یہ ترسیل کے ساتھ خود تازہ ہوتا ہے، صفحہ دوبارہ کھولنے کی ضرورت نہیں۔
- **دوبارہ بھیجیں** ایک ترسیل کو اسی `webhook-id` کے ساتھ دوبارہ بھیجتا ہے۔ نظام بند رہنے کے بعد اپنے منتخب وقت سے چھوٹی ہوئی 1,000 تک ترسیلیں ایک ساتھ دوبارہ بھیجیں۔
- **روکیں** آپ کے دوبارہ شروع کرنے تک اس پتے کو ترسیل بند رکھتا ہے۔
