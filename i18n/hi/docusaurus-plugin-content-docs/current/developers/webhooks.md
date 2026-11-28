---
title: वेबहुक
sidebar_position: 5
description: Rent Party वेबहुक आपके सर्वर को खेल खत्म होने, बैज मिलने या सेव किए खेल के बनने और हटने की खबर देते हैं। Standard Webhooks हस्ताक्षर, एक दिन से अधिक समय तक दोबारा कोशिश और Node, Python व PHP में जाँच का कोड।
topics: [account]
last_update:
  date: 2026-11-19
---

वेबहुक, Rent Party से आपके पते पर भेजा गया हस्ताक्षरित `POST` अनुरोध है। आपके खाते में घटना होते ही यह पहुँचता है। आखिरी खिलाड़ी दिवालिया हुआ और आपका सर्वर जान गया कि कौन जीता। **सेटिंग → अन्य ऐप → वेबहुक** में पता जोड़ें, घटनाएँ चुनें और हर अनुरोध का हस्ताक्षर जाँचें, ताकि पता हो कि वह सचमुच हमसे आया है।

## कौन-सी घटनाएँ मिलती हैं? {#events}

| घटना | कब भेजी जाती है |
|---|---|
| `game.finished` | आपके खेले किसी खेल के खत्म होने पर |
| `achievement.earned` | आपको बैज मिलने पर |
| `saved_game.created` | कोई खेल आपके खाते में सेव होने पर |
| `saved_game.deleted` | आपका सेव किया खेल हटने पर |
| `webhook.test` | आपके **परीक्षण इवेंट भेजें** दबाने पर |

हर घटना का पूरा पेलोड [OpenAPI फ़ाइल](./api.md#reference) में है। यहाँ उसकी नकल नहीं रखी गई, ताकि विवरण पुराना न पड़े।

## कौन-से पते स्वीकार होते हैं? {#addresses}

- केवल `https://`, पोर्ट 443 या 8443 पर; पते में उपयोगकर्ता नाम या पासवर्ड नहीं होना चाहिए।
- निजी या स्थानीय पता कभी नहीं: `localhost`, `127.0.0.1`, `10.x.x.x`, `192.168.x.x`, लिंक-लोकल पता या उनकी ओर जाने वाला नाम। पता सेव करते समय और हर बार भेजने से पहले जाँच होती है। निजी पते पर रीडायरेक्ट भी अस्वीकार होता है।
- आपके सर्वर को 10 सेकंड में जवाब देना होता है।

## अनुरोध में क्या आता है? {#headers}

Rent Party [Standard Webhooks](https://www.standardwebhooks.com/) विनिर्देश मानता है। हर अनुरोध में तीन हेडर होते हैं:

| हेडर | उसमें क्या है |
|---|---|
| `webhook-id` | घटना की id। हर दोबारा कोशिश में वही रहती है; इसी से दोहराया अनुरोध पहचानें |
| `webhook-timestamp` | भेजने का समय, 1970 से सेकंड में |
| `webhook-signature` | `v1,` और base64 HMAC-SHA256 हस्ताक्षर। एक से अधिक हस्ताक्षर स्पेस से अलग हो सकते हैं |

हस्ताक्षर करने वाला सीक्रेट `whsec_` से शुरू होता है। उसे टोकन वाले [10 मिनट के नियम](./authentication.md#reveal) के तहत फिर देख सकते हैं। **बदलें** नया सीक्रेट देता है और अगले 24 घंटे दोनों से हस्ताक्षर करता है। इस बीच किसी एक को स्वीकार करने वाला रिसीवर चलता रहता है।

## अनुरोध कैसे जाँचें? {#verify}

पहले हस्ताक्षर जाँचें, फिर डेटा पार्स करें। ठीक वही बाइट जाँचें जो मिली हैं। JSON को पार्स करके फिर लिखने से उसका हस्ताक्षर मेल नहीं खाएगा।

नीचे Standard Webhooks की लाइब्रेरी हैं: npm और PyPI पर `standardwebhooks` 1.3.0, और Packagist पर `standard-webhooks/standard-webhooks` 1.3.0; 19 नवंबर 2026 को जाँची गई थीं।

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

### किसी भी भाषा में {#any-language}

1. `secret = base64decode(the whsec value without its "whsec_" prefix)`।
2. `signed = webhook-id + "." + webhook-timestamp + "." + raw body` (प्राप्त हुई ठीक वही बाइट)।
3. `expected = base64(HMAC_SHA256(secret, signed))`।
4. `expected` को `webhook-signature` के हर `v1,` मान से नियत समय में मिलाएँ। कोई एक मेल पर्याप्त है।
5. `|now − webhook-timestamp| > 300` हो तो अनुरोध अस्वीकार करें।

## सर्वर जवाब न दे तो? {#retries}

कोई भी `2xx` सफल डिलीवरी है। दूसरा स्थिति कोड, समय सीमा पूरी होना या कनेक्शन अस्वीकार होना—सब असफल प्रयास हैं। Rent Party फिर कोशिश करता है:

| प्रयास | कब भेजा जाता है |
|---|---|
| 1 | तुरंत |
| 2 | 5 सेकंड बाद |
| 3 | 5 मिनट बाद |
| 4 | 30 मिनट बाद |
| 5 | 2 घंटे बाद |
| 6 | 5 घंटे बाद |
| 7 | 10 घंटे बाद |
| 8 | 10 घंटे बाद |

तीन स्थितियों में पता बंद हो जाता है:

- **`410 Gone`**, तुरंत। जानबूझकर पता बंद किया हो तो इसी से जवाब दें।
- एक घटना के **आठों प्रयास असफल** हों।
- उस पते पर लगातार **5 दिन की डिलीवरी असफल** हो।

पता बंद होने पर Rent Party आखिरी त्रुटि और उसे फिर चालू करने का लिंक ईमेल करता है।

## परीक्षण और दोबारा भेजना कैसे करें? {#test-and-replay}

- **परीक्षण इवेंट भेजें** अभी उस पते पर `webhook.test` भेजता है।
- हर पते का **डिलीवरी लॉग** हर प्रयास की स्थिति, प्रयास संख्या, जवाब का कोड, लगा समय और अगली कोशिश का समय दिखाता है। डिलीवरी होते ही यह बदलता है; पेज फिर से लोड नहीं करना पड़ता।
- **दोबारा भेजें** उसी `webhook-id` से एक डिलीवरी फिर भेजता है। सेवा में रुकावट के बाद अपनी चुनी तारीख से छूटी डिलीवरी फिर भेजें, एक बार में अधिकतम 1,000।
- **रोकें** पते पर भेजना तब तक रोकता है जब तक आप फिर शुरू न करें।
