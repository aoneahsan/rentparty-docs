---
title: Rent Party para desarrolladores
sidebar_label: Descripción general
sidebar_position: 1
description: Tres formas de consultar tus datos de Rent Party desde otro lugar, mediante la API, un asistente de IA con MCP o webhooks, y los límites de cada una.
topics: [account]
last_update:
  date: 2026-11-19
---

Tus partidas dejan un rastro: victorias, clasificación, insignias y partidas guardadas que aún no terminas. Esta sección explica cómo llevar esos datos a otro lugar. Una hoja de cálculo con tus noches de juego. Un bot del chat que anuncia quién ganó. Un asistente de IA que resume tus últimas diez partidas.

Hay tres formas de hacerlo y tú activas cada una en **Ajustes → Otras aplicaciones**.

## ¿Cuál necesitas? {#which-one}

| Quieres | Usa | Puede | Empieza aquí |
|---|---|---|---|
| Leer tus estadísticas y resultados desde tu código | Un token de acceso y la API | Leer lo que permitan los ámbitos del token | [Tokens de acceso](./authentication.md) y después [la API](./api.md) |
| Preguntar a Claude, ChatGPT, Claude Code o Cursor por tus partidas | El servidor MCP | Leer lo que autorices en la página de consentimiento | [Asistentes de IA](./mcp.md) |
| Saberlo en cuanto termine una partida | Webhooks | Recibir eventos y nada más | [Webhooks](./webhooks.md) |

## ¿A qué datos puede acceder? {#what-it-reaches}

A tus propios datos, y solo a ellos:

- tu perfil y estadísticas;
- resultados de partidas terminadas;
- tus insignias y la evolución de tu clasificación;
- tus partidas guardadas, que puedes consultar y también eliminar.

Esa es la lista completa. Ninguna de estas opciones puede tirar los dados, pujar ni intervenir en una partida en curso. Solo el juego mueve las piezas.

## ¿Qué reglas se mantienen en todos los casos? {#ground-rules}

- **Nada queda abierto hasta que tú lo activas.** Una cuenta nueva no tiene tokens, aplicaciones conectadas ni webhooks.
- **Eliminar requiere un permiso aparte.** Leer es un permiso. Eliminar una partida guardada es otro, desactivado hasta que lo marques. Un asistente de IA tampoco puede eliminar nada hasta que lo confirmes dentro de Rent Party.
- **Solo acceden a tu puesto.** Cada solicitud se atiende en tu nombre y sigue las mismas reglas del juego. Los datos privados de otro jugador y todo lo que no haya hecho público quedan fuera de alcance.
- **Puedes revisar todos los accesos.** Ajustes → Otras aplicaciones muestra los tokens, aplicaciones conectadas y webhooks, con la fecha de su último uso.

La [verificación en dos pasos](./two-step-sign-in.md) protege estos accesos: al volver a mostrar un token o aprobar una conexión nueva, se pedirá un código.

## ¿Qué ha cambiado recientemente? {#changes}

Los cambios de la API, el servidor MCP y los webhooks se publican en el [registro de cambios para desarrolladores](./changelog.md).
