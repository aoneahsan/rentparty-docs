---
title: Tokens de acceso e inicio de sesión de aplicaciones
sidebar_label: Tokens de acceso
sidebar_position: 2
description: Cómo autorizar a tu código para consultar tus datos de Rent Party. Tokens y permisos, plazo de diez minutos para volver a mostrarlos, caducidad, OAuth, límites y errores.
topics: [account]
last_update:
  date: 2026-11-19
---

Un token de acceso es una clave secreta larga que tu código envía en cada solicitud como `Authorization: Bearer <token>`. Lo creas en **Ajustes → Otras aplicaciones**, eliges qué puede leer y cuándo caduca, y puedes revocarlo cuando quieras. Una aplicación que se conecta en tu nombre usa OAuth; así no tienes que entregarle un token.

## ¿Cómo creas un token? {#make-a-token}

1. Abre **Ajustes → Otras aplicaciones → Tokens de acceso** y selecciona **Nuevo token**.
2. Ponle un nombre que reconozcas dentro de un mes. *Hoja de partidas del viernes* dice más que *token 1*.
3. Elige sus permisos y su duración.
4. El token se muestra una vez, con un botón para copiarlo. Guárdalo en un lugar seguro antes de cerrar el panel.

La lista muestra el nombre y los permisos de cada token, sus primeros caracteres, cuándo se creó y cuándo se usó por última vez. Nunca muestra el token completo. Recibes un correo cada vez que se crea uno para que puedas detectar uno que no hayas creado.

## ¿Puedes volver a ver un token? {#reveal}

Sí, dentro de los **10 minutos posteriores al inicio de sesión**. Selecciona **Mostrar** en su fila:

| Cuándo | Qué sucede |
|---|---|
| Iniciaste sesión hace menos de 10 minutos | Se muestra el token. |
| Iniciaste sesión hace más tiempo | Rent Party te avisa y ofrece **Iniciar sesión de nuevo**, que te devuelve a la misma fila. |
| Tienes verificación en dos pasos | También debes ingresar un código de tu aplicación de autenticación, incluso dentro de esos diez minutos. |

¿Por qué? Mantener una sesión abierta durante semanas es cómodo, pero un teléfono prestado se ve igual. Un inicio de sesión reciente confirma que eres tú quien lo pide. Puedes mostrar un token hasta diez veces por hora; cada consulta queda registrada en tu cuenta y el token nunca se envía por correo.

## ¿Qué significan los permisos? {#scopes}

Cada parte de tus datos tiene un permiso de lectura. Las partidas guardadas tienen uno adicional:

| Permiso | Permite al token |
|---|---|
| `<part>:read` | Leer tu perfil y estadísticas, resultados de partidas terminadas, insignias e historial de clasificación, o partidas guardadas. |
| `saved_games:delete` | Eliminar una de tus partidas guardadas. |

Ningún permiso permite modificar una partida, un perfil o un resultado. Los nombres exactos están en el [archivo OpenAPI](./api.md#reference).

**Eliminar requiere un permiso aparte.** Leer partidas guardadas no permite borrarlas. La casilla de eliminación aparece separada y desmarcada. Los permisos de un token nunca aumentan después de crearlo: si necesitas otros, crea uno nuevo y revoca el anterior. Ningún token puede tener permisos de equipo.

## ¿Cuánto dura un token? {#expiry}

Eliges **30, 90 o 365 días**. Rent Party te envía un correo siete días antes de que caduque. Después de esa fecha, todas las solicitudes hechas con él reciben `401`.

## ¿Cómo sustituyes o revocas un token? {#rotate-and-revoke}

- **Rotar** crea un token nuevo. El anterior sigue funcionando durante 24 horas mientras lo cambias en tu código; después se revoca. Ambos aparecen en la lista hasta entonces.
- **Revocar** desactiva el token inmediatamente. La siguiente solicitud recibe `401`. Púlsalo dos veces para confirmar; no aparece ningún diálogo.

Al eliminar tu cuenta de Rent Party, también se revocan todos tus tokens, aplicaciones conectadas y webhooks.

## ¿Cómo se conecta una aplicación sin token? {#oauth}

Mediante OAuth 2.1, el mismo inicio de sesión que usa un asistente de IA. La aplicación te envía a la página de consentimiento de Rent Party, `https://rentparty.aoneahsan.com/oauth/consent`, donde ves:

- el nombre de la aplicación y la dirección a la que volverás;
- la cuenta de Rent Party a la que solicita acceso;
- lo que solicita, explicado claramente, con lectura y eliminación separadas en casillas propias y eliminación desmarcada;
- **Aprobar** y **Denegar**, uno junto al otro.

Si tienes verificación en dos pasos, al aprobar se pide un código. La aplicación aparece después en **Ajustes → Otras aplicaciones → Aplicaciones conectadas**, donde puedes cambiarle el nombre o revocarla. La revocación surte efecto en su próxima solicitud. Consulta también [Asistentes de IA](./mcp.md#consent).

## ¿Cuántas solicitudes puedes hacer? {#rate-limits}

Cada token y aplicación conectada admite **120 solicitudes por minuto**. Además, hay un total diario para toda tu cuenta según tu plan. Todos tus tokens y aplicaciones lo comparten: crear más tokens no aumenta el límite. Ajustes → Otras aplicaciones muestra el total de tu plan junto al uso de hoy.

Cada respuesta incluye tres encabezados:

| Encabezado | Significado |
|---|---|
| `RateLimit-Limit` | Solicitudes permitidas durante este intervalo. |
| `RateLimit-Remaining` | Solicitudes que quedan. |
| `RateLimit-Reset` | Segundos hasta que se reinicie el intervalo. |

Si superas el límite, recibes `429` con un encabezado `Retry-After`. Espera esa cantidad de segundos antes de intentarlo otra vez.

Si envías muchas solicitudes a la vez, la plataforma de alojamiento puede responder `546` antes de que Rent Party las reciba. Envíalas una tras otra, o en grupos pequeños, y reintenta un `546` después de un segundo.

## ¿Cómo es un error? {#errors}

Todos los errores, en todas las rutas, siguen la misma estructura:

```json
{
  "error": {
    "code": "reauth_required",
    "message": "Sign in again to see this token.",
    "details": { "max_age_seconds": 600 },
    "correlation_id": "…"
  }
}
```

Programa según `code`. `message` está pensado para las personas y su redacción puede cambiar. Si nos escribes por una solicitud fallida, incluye el `correlation_id`: nos permite encontrar esa solicitud sin más datos.

| Estado | Suele significar |
|---|---|
| `401` | Falta el token, es incorrecto o está revocado o caducado. |
| `403` | Le falta un permiso al token (`details` lo indica), o necesitas iniciar sesión otra vez. |
| `404` | No existe ese identificador en tus datos; también cubre los datos de otras personas. |
| `429` | Llegaste al límite. Consulta `Retry-After`. |

La lista completa de códigos está en el [archivo OpenAPI](./api.md#reference).
