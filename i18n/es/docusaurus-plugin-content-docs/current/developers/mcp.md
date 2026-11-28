---
title: Conectar un asistente de IA (MCP)
sidebar_label: Asistentes de IA (MCP)
sidebar_position: 4
description: Conecta Claude, ChatGPT, Claude Code o Cursor con tus datos de Rent Party mediante MCP. Dirección, consentimiento, confirmación para eliminar partidas guardadas y desconexión.
topics: [account]
last_update:
  date: 2026-11-19
---

El servidor MCP de Rent Party permite que un asistente de IA consulte tus datos cuando se lo pides. *«¿Cuántas de mis últimas diez partidas gané?»* *«¿Qué partidas guardadas no he tocado en un mes?»* Dale al asistente una dirección, inicia sesión en Rent Party y elige en la página de consentimiento lo que podrá ver. Funciona con Claude, ChatGPT, Claude Code, Cursor y otros asistentes compatibles con MCP.

## ¿Cuál es la dirección? {#address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp
```

También aparece en **Ajustes → Otras aplicaciones → Conectar un asistente de IA**, con un botón para copiarla. Nunca pegues un token en el asistente. A partir de esta dirección, encontrará el inicio de sesión de Rent Party y te llevará allí.

## ¿Cómo conectas cada asistente? {#connect}

Estas aplicaciones cambian de menú entre versiones. Si un paso no coincide con tu pantalla, busca **Conectores** en sus ajustes.

### Claude {#claude}

1. En Claude, abre **Ajustes → Conectores** y añade un conector personalizado.
2. Pega la dirección anterior.
3. Inicia sesión en Rent Party cuando se te pida y aprueba la conexión en la página de consentimiento.

### ChatGPT {#chatgpt}

1. En ChatGPT, abre **Ajustes → Conectores**. Algunas cuentas requieren activar antes el modo de desarrollador.
2. Añade un conector con la dirección anterior.
3. Inicia sesión en Rent Party y aprueba la conexión en la página de consentimiento.

### Claude Code {#claude-code}

```bash
claude mcp add --transport http rentparty https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp
```

Después, ejecuta `/mcp` dentro de Claude Code, selecciona **rentparty** e inicia sesión en la ventana del navegador que se abre.

### Cursor {#cursor}

Añade Rent Party a tu archivo `mcp.json`:

```json
{
  "mcpServers": {
    "rentparty": {
      "url": "https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp"
    }
  }
}
```

Cursor te pedirá iniciar sesión la primera vez que lo use.

## ¿Qué pregunta la página de consentimiento? {#consent}

Antes de que el asistente vea nada, Rent Party muestra en `https://rentparty.aoneahsan.com/oauth/consent`:

- **qué aplicación solicita acceso** y la dirección a la que volverás;
- **a qué cuenta de Rent Party** accederá, algo que conviene comprobar si tienes varias cuentas de Google;
- **qué puede hacer**, explicado sin jerga: lectura y eliminación aparecen separadas, cada una con su propia casilla. El permiso de eliminación empieza desmarcado;
- **Aprobar** y **Denegar**, uno junto al otro.

Si tienes [verificación en dos pasos](./two-step-sign-in.md), al aprobar se pide un código. Nadie aprueba una conexión por ti. Cada conexión nueva pasa por esta página.

El asistente solo recibe las herramientas que permiten las casillas marcadas. Si autorizas únicamente la lectura, no podrá eliminar nada.

## ¿Cómo se elimina una partida guardada? {#removing}

Un asistente puede **preparar** la eliminación. Solo tú puedes **confirmarla**. Si le pides borrar una partida antigua, te mostrará cuál sería y un enlace a Rent Party. Confírmala allí en un plazo de diez minutos; de lo contrario, se conservará.

Por eso una frase escondida en una página web o pegada en un mensaje no puede hacer que el asistente borre tus partidas: no puede confirmar su propia solicitud.

Sin el permiso de eliminación marcado en la página de consentimiento, ni siquiera puede prepararla.

## ¿Cómo desconectas un asistente? {#disconnect}

Abre **Ajustes → Otras aplicaciones → Aplicaciones conectadas** y selecciona **Revocar** en su fila. El acceso termina en la próxima solicitud. La lista muestra los permisos, la fecha de conexión y el último uso de cada aplicación. La nueva conexión aparece en cuanto la apruebas. Rent Party también te envía un correo cada vez que se conecta una aplicación.

## ¿Por qué no funciona? {#troubleshooting}

| Lo que ves | Qué hacer |
|---|---|
| El asistente pide iniciar sesión otra vez | La sesión caducó. Vuelve a iniciar sesión en Rent Party desde el asistente. |
| Dice que le falta un permiso | No se le concedió. Desconéctalo, vuelve a conectarlo y marca ese permiso en la página de consentimiento. |
| Rent Party desapareció de sus herramientas o fallan todas las solicitudes | Se revocó el acceso. Comprueba **Aplicaciones conectadas** y vuelve a conectarlo si quieres. |
| La partida que dijo que borraría sigue allí | No confirmaste la eliminación en Rent Party dentro de los diez minutos. Vuelve a pedirla. |
| Quieres saber cuándo lo usó | **Aplicaciones conectadas** muestra el último uso de cada aplicación. |
