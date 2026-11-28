---
title: واجهة API في Rent Party
sidebar_label: واجهة API
sidebar_position: 3
description: "واجهة REST في Rent Party: عنوانها الأساسي وما تقرؤه وتقسيم النتائج بمؤشر، 20 صفًا افتراضيًا و50 كحد أقصى، وملف OpenAPI الذي يصف كل مسار وحقل."
topics: [account]
last_update:
  date: 2026-11-19
---

واجهة Rent Party من نوع REST ولها عنوان أساسي واحد. تقرأ سجلاتك، ويمكنها إزالة لعبة محفوظة إذا سمحت بذلك. يصف ملف OpenAPI كل مسار وحقل، وهو المرجع التفصيلي. توضح هذه الصفحة مكانه وقواعد القوائم.

## ما العنوان الأساسي؟ {#base-address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1
```

`v1` في نهايته رقم إصدار الواجهة. يحتاج كل طلب إلى مفتاح أو تطبيق متصل. انظر [مفاتيح الوصول](./authentication.md).

```bash
curl -H "Authorization: Bearer $RENTPARTY_TOKEN" \
  https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json
```

## ماذا يمكنك قراءة؟ {#resources}

| جزء سجلك | القراءة | الإزالة |
|---|---|---|
| الملف الشخصي والإحصاءات | نعم | لا |
| نتائج الألعاب المنتهية | نعم | لا |
| الشارات وسجل التصنيف | نعم | لا |
| الألعاب المحفوظة | نعم | نعم، بصلاحية الإزالة |

لا تظهر اللعبة الجارية في API، ولا يستطيع شيء فيه تغيير حركة أو نتيجة أو تصنيف. تعرض النتائج ما رأته الطاولة عند النهاية، دون تفاصيل لاعب آخر الخاصة.

## أين المرجع الكامل؟ {#reference}

| الملف | العنوان | افتحه باستخدام |
|---|---|---|
| OpenAPI 3.1 بصيغة JSON | [`/v1/openapi.json`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json) | أداة OpenAPI مثل Swagger UI أو Redocly أو Postman أو Insomnia أو مولد عميل |
| الملف نفسه بصيغة Markdown | [`/v1/openapi.md`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.md) | متصفح أو محرر نصوص أو مساعد ذكاء اصطناعي تلصقه فيه |

يُنتج الملفان من المصدر نفسه الذي يبني API، فلا يذكر أحدهما مسارًا غير موجود أو يغفل مسارًا موجودًا.

تجيب أربعة أجزاء عن معظم الأسئلة:

- **`paths`**: كل مسار وطريقته والصلاحية المطلوبة.
- **`components.schemas`**: كل حقل قد يظهر في الجواب ونوعه. لا يُرسل حقل غير مذكور.
- **`components.securitySchemes`**: طريقتا الدخول، مفتاح Bearer وOAuth.
- **ردود الأخطاء**: كل `code` قد يحمله [شكل الخطأ](./authentication.md#errors)، بحسب المسار.

## كيف تعمل الصفحات؟ {#pagination}

تأتي كل قائمة في صفحات:

- **20 صفًا في الصفحة** افتراضيًا، و**50 كحد أقصى**.
- تحمل الصفحة التي تليها بيانات قيمة `next_cursor`. أرسلها لطلب الصفحة التالية.
- الصفحة التي لا تحمل `next_cursor` هي الأخيرة.

المؤشر علامة موضع، لا رقم صفحة. إذا انتهت لعبة أثناء وصول شفرتك إلى منتصف النتائج، فلن تنزاح الصفوف. يذكر ملف OpenAPI معاملات حجم الصفحة والمؤشر لكل مسار قائمة.

## ماذا عن الحدود والأخطاء؟ {#limits-and-errors}

القواعد نفسها على كل مسار، وتجدها في [صفحة مفاتيح الوصول](./authentication.md#rate-limits).
