---
title: Webhooks
sidebar_position: 5
description: Los webhooks de Rent Party avisan a tu servidor al terminar una partida, ganar una insignia o crear o borrar una partida guardada. Firma, reintentos y ejemplos de verificación.
topics: [account]
last_update:
  date: 2026-11-19
---

Un webhook es una solicitud `POST` firmada que Rent Party envía a una dirección tuya cuando sucede algo en tu cuenta. Termina una partida y tu servidor se entera de quién ganó. Añade la dirección en **Ajustes → Otras aplicaciones → Webhooks**, elige los eventos y comprueba la firma de cada solicitud para confirmar que procede de Rent Party.

## ¿Qué eventos hay? {#events}

| Evento | Cuándo se envía |
|---|---|
| `game.finished` | Termina una partida en la que participaste. |
| `achievement.earned` | Ganas una insignia. |
| `saved_game.created` | Se guarda una partida en tu cuenta. |
| `saved_game.deleted` | Se elimina una de tus partidas guardadas. |
| `webhook.test` | Pulsas **Enviar evento de prueba**. |

El contenido completo de cada evento está en el [archivo OpenAPI](./api.md#reference). No lo duplicamos aquí para que esta página no quede desactualizada.

## ¿Qué direcciones se admiten? {#addresses}

- Solo `https://` en el puerto 443 u 8443, sin nombre de usuario ni contraseña en la dirección.
- Nunca una dirección privada o local: `localhost`, `127.0.0.1`, `10.x.x.x`, `192.168.x.x`, direcciones de enlace local ni nombres que apunten a ellas. Se comprueba al guardar la dirección y antes de cada envío. También se rechazan las redirecciones a direcciones privadas.
- Tu servidor tiene diez segundos para responder.

## ¿Qué lleva una solicitud? {#headers}

Rent Party sigue la especificación de [Standard Webhooks](https://www.standardwebhooks.com/). Cada solicitud lleva tres encabezados:

| Encabezado | Contenido |
|---|---|
| `webhook-id` | Identificador del evento. No cambia entre reintentos; úsalo para ignorar duplicados. |
| `webhook-timestamp` | Hora de envío en segundos desde 1970. |
| `webhook-signature` | `v1,` seguido de una firma HMAC-SHA256 en base64. Puede haber varias, separadas por espacios. |

El secreto de firma empieza con `whsec_`. Puedes volver a verlo bajo la misma [regla de diez minutos](./authentication.md#reveal) que se aplica a un token. **Rotar** crea un secreto nuevo y firma con ambos durante 24 horas. Así puedes cambiarlo en el receptor sin interrumpir los envíos.

## ¿Cómo verificas una solicitud? {#verify}

Comprueba primero la firma y después interpreta el contenido. Usa los bytes exactos recibidos: analizar el JSON y volver a escribirlo cambia la firma.

Los ejemplos usan las bibliotecas de Standard Webhooks: `standardwebhooks` 1.3.0 en npm y PyPI y `standard-webhooks/standard-webhooks` 1.3.0 en Packagist, comprobadas el 19 de noviembre de 2026.

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

### Cualquier lenguaje {#any-language}

1. `secret = base64decode(the whsec value without its "whsec_" prefix)`.
2. `signed = webhook-id + "." + webhook-timestamp + "." + raw body` (los bytes exactos recibidos).
3. `expected = base64(HMAC_SHA256(secret, signed))`.
4. Compara `expected` con cada valor `v1,` de `webhook-signature` en tiempo constante. Cualquier coincidencia es válida.
5. Rechaza la solicitud cuando `|now − webhook-timestamp| > 300`.

## ¿Qué ocurre si tu servidor no responde? {#retries}

Cualquier respuesta `2xx` cuenta como entrega. Otro estado, un tiempo de espera agotado o una conexión rechazada cuentan como intento fallido. Rent Party vuelve a intentarlo:

| Intento | Envío |
|---|---|
| 1 | Inmediatamente. |
| 2 | Cinco segundos después. |
| 3 | Cinco minutos después. |
| 4 | Treinta minutos después. |
| 5 | Dos horas después. |
| 6 | Cinco horas después. |
| 7 | Diez horas después. |
| 8 | Diez horas después. |

Una dirección se desactiva en tres casos:

- Responde **`410 Gone`**: se desactiva inmediatamente. Úsalo si has retirado la dirección deliberadamente.
- Fallan **los ocho intentos** de un mismo evento.
- Se acumulan **cinco días de entregas fallidas** en esa dirección.

Al desactivarse, Rent Party te envía un correo con el último error y un enlace para reactivarla.

## ¿Cómo pruebas y repites envíos? {#test-and-replay}

- **Enviar evento de prueba** envía `webhook.test` a la dirección de inmediato.
- El **registro de entregas** de cada dirección muestra cada intento: estado, número de intento, código de respuesta, duración y hora del próximo reintento. Se actualiza sin recargar la página.
- **Repetir** vuelve a enviar una entrega con el mismo `webhook-id`. Después de una interrupción, puedes repetir las entregas fallidas desde la hora que elijas, hasta 1000 a la vez.
- **Pausar** detiene los envíos a una dirección hasta que los reanudes.
