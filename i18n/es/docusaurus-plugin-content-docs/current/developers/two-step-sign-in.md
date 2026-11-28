---
title: Verificación en dos pasos
sidebar_position: 6
description: Activa la verificación en dos pasos de Rent Party con una aplicación de autenticación, guarda tus códigos de recuperación y decide si recordar este navegador durante siete días.
topics: [account]
last_update:
  date: 2026-11-19
---

La verificación en dos pasos pide un código de seis dígitos de una aplicación de autenticación después de iniciar sesión con Google. Si alguien entra en tu cuenta de Google, aún necesita tu teléfono para acceder a tu puesto, tus monedas y tus partidas guardadas. Activarla en tu cuenta es decisión tuya. Para las cuentas de administración de Rent Party es obligatoria.

## ¿Cómo se activa? {#turn-on}

1. Abre **Ajustes → Seguridad → Verificación en dos pasos**.
2. Escanea el código QR con una aplicación de autenticación, como Google Authenticator, Microsoft Authenticator, 1Password o Bitwarden, o cualquier otra que genere códigos de seis dígitos. Si no puedes escanearlo, escribe la clave que aparece debajo.
3. Ingresa el código de la aplicación. En cuanto Rent Party lo acepte, la verificación quedará activada.

## ¿Para qué sirven los códigos de recuperación? {#recovery-codes}

Al activarla, aparecen **10 códigos de recuperación** una sola vez. Son una llave de reserva si pierdes el teléfono. Descárgalos o cópialos en un lugar que no sea ese teléfono.

- Cada código te permite iniciar sesión una vez en lugar de usar el código de la aplicación.
- La verificación en dos pasos sigue activa después de utilizar uno. El siguiente inicio de sesión vuelve a pedir un código.
- **Crear códigos nuevos** sustituye todo el conjunto y deja sin validez los anteriores. Primero se solicita un código vigente.

## ¿Qué hace «Recordar este navegador»? {#remember-browser}

Tras ingresar el código, la pantalla ofrece **Recordar este navegador durante 7 días**. La casilla empieza desmarcada y solo se activa si tú la marcas.

| Si la dejas | En el siguiente inicio de sesión |
|---|---|
| Desmarcada | Rent Party volverá a pedir un código. |
| Marcada | Este navegador en este dispositivo no lo pedirá durante siete días. Los demás navegadores y dispositivos sí. |

Al cerrar sesión, el recuerdo termina para ese navegador. **Ajustes → Seguridad → Navegadores de confianza** muestra los navegadores recordados, cuándo se añadieron y cuándo vence el plazo. **Olvidar** elimina uno; **Olvidar todos**, todos. Si desactivas la verificación, también se olvidan todos.

Incluso en un navegador recordado se pide un código para mostrar un token de acceso o el secreto de un webhook, cambiar la verificación en dos pasos o abrir las pantallas de administración.

## ¿En qué otros casos se pide un código? {#other-codes}

- **Al volver a mostrar un token o secreto.** Consulta [Tokens de acceso](./authentication.md#reveal).
- **Al aprobar una aplicación o asistente de IA nuevos** en la página de consentimiento. Consulta [Asistentes de IA](./mcp.md#consent).
- **Al desactivar la verificación en dos pasos.** Necesitas un código vigente.

## ¿Perdiste el teléfono y los códigos? {#lost-everything}

Escríbenos desde [Ayuda](https://rentparty.aoneahsan.com/help). Antes de desactivar la verificación de una cuenta, el equipo comprueba que realmente sea tuya. Ese proceso tarda más que usar un código de recuperación a propósito: una persona desconocida tendría que superar la misma comprobación.

## ¿Los administradores deben usarla? {#admins}

Sí. Nadie puede abrir las pantallas de administración sin ingresar un código durante esa sesión. Un navegador recordado no sustituye ese requisito.
