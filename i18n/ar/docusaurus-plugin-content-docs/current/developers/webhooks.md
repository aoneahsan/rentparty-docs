---
title: خطافات الويب
sidebar_position: 5
description: تُبلغ خطافات الويب في Rent Party خادمك عند انتهاء لعبة أو الحصول على شارة أو إنشاء لعبة محفوظة أو حذفها. تُوقَّع وفق معيار Standard Webhooks ويُعاد إرسالها لمدة تزيد قليلًا على يوم، مع أمثلة للتحقق في Node وPython وPHP.
topics: [account]
last_update:
  date: 2026-11-19
---

خطاف الويب هو طلب `POST` موقَّع ترسله Rent Party إلى عنوان تملكه فور حدوث أمر في حسابك. عند إفلاس آخر لاعب، يعرف خادمك من فاز. أضف العنوان من **الإعدادات ← تطبيقات أخرى ← خطافات الويب**، واختر الأحداث، ثم تحقّق من توقيع كل طلب لتتأكد أنه وصل منا.

## ما الأحداث المتاحة؟ {#events}

| الحدث | وقت إرساله |
|---|---|
| `game.finished` | عند انتهاء لعبة شاركت فيها |
| `achievement.earned` | عند حصولك على شارة |
| `saved_game.created` | عند حفظ لعبة في حسابك |
| `saved_game.deleted` | عند حذف إحدى ألعابك المحفوظة |
| `webhook.test` | عند الضغط على **إرسال حدث تجريبي** |

تجد الحمولة الكاملة لكل حدث في [ملف OpenAPI](./api.md#reference). لا نكررها هنا حتى تظل المواصفات هي المرجع الأحدث.

## ما العناوين المقبولة؟ {#addresses}

- يجب أن يبدأ العنوان بـ`https://` وأن يستخدم المنفذ 443 أو 8443، من دون اسم مستخدم أو كلمة مرور في العنوان.
- لا يُقبل عنوان خاص أو محلي، مثل `localhost` أو `127.0.0.1` أو `10.x.x.x` أو `192.168.x.x` أو عناوين الربط المحلي، ولا اسم يشير إلى أي منها. يجري التحقق عند حفظ العنوان ومرة أخرى قبل كل إرسال. ويُرفض أيضًا أي تحويل إلى عنوان خاص.
- أمام خادمك 10 ثوانٍ للرد.

## ماذا يحمل الطلب؟ {#headers}

تتبع Rent Party مواصفة [Standard Webhooks](https://www.standardwebhooks.com/). ويحمل كل طلب ثلاث ترويسات:

| الترويسة | محتواها |
|---|---|
| `webhook-id` | معرّف الحدث. لا يتغير عند إعادة المحاولة، فاستخدمه لتجاهل التكرار |
| `webhook-timestamp` | وقت الإرسال بالثواني منذ عام 1970 |
| `webhook-signature` | القيمة `v1,` وتوقيع HMAC-SHA256 بترميز base64. وقد يتضمن عدة توقيعات تفصل بينها مسافات |

يبدأ سر التوقيع بـ`whsec_`. يمكنك عرضه مرة أخرى وفق [قاعدة الدقائق العشر](./authentication.md#reveal) نفسها التي تنطبق على الرموز. يُصدر خيار **تدوير السر** سرًا جديدًا ويوقّع بالسرين لمدة 24 ساعة، حتى يظل المستقبِل الذي يقبل أيًا منهما يعمل أثناء تحديثه.

## كيف تتحقق من الطلب؟ {#verify}

تحقّق أولًا ثم حلّل المحتوى، مستخدمًا البايتات التي وصلتك كما هي. لن يطابق التوقيع نص JSON إذا حلّلته ثم أعدت كتابته.

الأمثلة التالية تستخدم مكتبات Standard Webhooks: الإصدار 1.3.0 من `standardwebhooks` على npm وPyPI، والإصدار 1.3.0 من `standard-webhooks/standard-webhooks` على Packagist، وفق التحقق في 19 نوفمبر 2026.

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

### أي لغة {#any-language}

1. `secret = base64decode(the whsec value without its "whsec_" prefix)`.
2. `signed = webhook-id + "." + webhook-timestamp + "." + raw body`، باستخدام البايتات التي وصلتك كما هي.
3. `expected = base64(HMAC_SHA256(secret, signed))`.
4. قارِن `expected` بكل قيمة تبدأ بـ`v1,` في `webhook-signature` بمقارنة ثابتة الزمن. تكفي مطابقة واحدة.
5. ارفض الطلب إذا كانت `|now − webhook-timestamp| > 300`.

## ماذا لو لم يرد خادمك؟ {#retries}

تعني أي استجابة `2xx` أن التسليم تم. أما أي حالة أخرى، سواء كانت رمز حالة مختلفًا أو انتهاء مهلة أو رفض اتصال، فتُعد محاولة فائتة وتعيد Rent Party الإرسال:

| المحاولة | وقت الإرسال |
|---|---|
| 1 | فورًا |
| 2 | بعد 5 ثوانٍ |
| 3 | بعد 5 دقائق |
| 4 | بعد 30 دقيقة |
| 5 | بعد ساعتين |
| 6 | بعد 5 ساعات |
| 7 | بعد 10 ساعات |
| 8 | بعد 10 ساعات |

تتوقف عمليات الإرسال إلى العنوان في ثلاث حالات:

- **`410 Gone`**: فورًا. أعد هذه الاستجابة إذا أوقفت العنوان عن قصد.
- **فشل المحاولات الثماني كلها** لحدث واحد.
- **مرور 5 أيام متتالية من فشل التسليم** إلى العنوان.

إذا أُوقف العنوان، ترسل لك Rent Party رسالة بريد تتضمن آخر خطأ ورابطًا لإعادة تفعيله.

## كيف تختبر الإرسال وتعيده؟ {#test-and-replay}

- يرسل **إرسال حدث تجريبي** الحدث `webhook.test` إلى العنوان فورًا.
- يسرد **سجل التسليم** لكل عنوان جميع المحاولات: الحالة ورقم المحاولة ورمز الاستجابة والوقت المستغرق وموعد إعادة المحاولة التالية. يتحدث السجل مع وصول النتائج من دون إعادة تحميل.
- يرسل **إعادة الإرسال** محاولة تسليم مجددًا باستخدام `webhook-id` نفسه. إذا عاد خادمك بعد انقطاع، يمكنك إعادة كل عمليات التسليم الفائتة منذ وقت تختاره، حتى 1,000 عملية دفعة واحدة.
- يوقف **إيقاف مؤقت** الإرسال إلى العنوان حتى تستأنفه.
