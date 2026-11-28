---
title: La API de Rent Party
sidebar_label: La API
sidebar_position: 3
description: Dirección base de la API REST de Rent Party, datos que permite leer, paginación con cursor de 20 filas por defecto y 50 como máximo, y archivo OpenAPI de referencia.
topics: [account]
last_update:
  date: 2026-11-19
---

La API de Rent Party es una API REST con una sola dirección base. Permite leer tus datos y eliminar una partida guardada cuando lo hayas autorizado. Un archivo OpenAPI describe todas las rutas y campos: esa es la referencia completa. Aquí encontrarás dónde está y cómo funcionan las listas.

## ¿Cuál es la dirección base? {#base-address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1
```

El `v1` final indica la versión. Cada solicitud necesita un token o una aplicación conectada. Consulta [Tokens de acceso](./authentication.md).

```bash
curl -H "Authorization: Bearer $RENTPARTY_TOKEN" \
  https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json
```

## ¿Qué puedes leer? {#resources}

| Parte de tus datos | Leer | Eliminar |
|---|---|---|
| Perfil y estadísticas | Sí | No |
| Resultados de partidas terminadas | Sí | No |
| Insignias e historial de clasificación | Sí | No |
| Partidas guardadas | Sí | Sí, con el permiso de eliminación |

La API no incluye partidas en curso. Tampoco permite cambiar movimientos, resultados ni clasificaciones. Los resultados muestran lo que vio la mesa al terminar, nunca los datos privados de otro jugador.

## ¿Dónde está la referencia completa? {#reference}

| Archivo | Dirección | Con qué abrirlo |
|---|---|---|
| OpenAPI 3.1, JSON | [`/v1/openapi.json`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json) | Una herramienta OpenAPI: Swagger UI, Redocly, Postman, Insomnia o un generador de clientes. |
| El mismo contenido en Markdown | [`/v1/openapi.md`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.md) | Un navegador, editor de texto o asistente de IA al que se lo pegues. |

Ambos se generan desde la misma fuente que la API: no pueden enumerar una ruta inexistente ni omitir una que sí existe.

El [registro de cambios para desarrolladores](./changelog.md) indica cuándo se añadieron la API, MCP y los webhooks. Para los detalles de cada ruta, consulta OpenAPI.

Si tu código necesita un aviso cuando termina una partida en vez de volver a consultar la API, los [webhooks](./webhooks.md) explican las entregas firmadas y los reintentos.

Cuatro partes del archivo responden la mayoría de las preguntas:

- **`paths`**: todas las rutas, sus métodos y los permisos necesarios.
- **`components.schemas`**: los campos que puede contener una respuesta y sus tipos. Un campo ausente no se envía.
- **`components.securitySchemes`**: las dos formas de autenticación, token bearer y OAuth.
- **Respuestas de error**: todos los valores de `code` posibles en la [estructura de errores](./authentication.md#errors), por ruta.

## ¿Cómo funciona la paginación? {#pagination}

Todas las listas se entregan por páginas:

- **20 filas por página** por defecto; **50 como máximo**.
- Si hay más resultados, la respuesta incluye `next_cursor`. Envía ese valor para pedir la página siguiente.
- Si no hay `next_cursor`, llegaste a la última página.

Un cursor es un marcador, no un número de página. Si termina una partida mientras tu programa recorre los resultados, las filas no se desplazan una posición. Cada ruta de lista indica sus parámetros de tamaño y cursor en el archivo OpenAPI.

## ¿Y los límites y errores? {#limits-and-errors}

Son los mismos en todas las rutas. Consulta [Tokens de acceso](./authentication.md#rate-limits).
