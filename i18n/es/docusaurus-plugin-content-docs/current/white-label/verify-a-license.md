---
title: Verificar una licencia
sidebar_label: Verificar una licencia
description: Cómo comprobar si una versión de Rent Party con marca blanca tiene licencia, mediante su clave o su dominio, y qué significa cada respuesta.
topics: [white-label]
sidebar_position: 5
last_update:
  date: 2026-11-13
---

Cualquier persona puede comprobar una versión de Rent Party con marca blanca en la [página Verificar una licencia](https://rentparty.aoneahsan.com/verify-license). La comprobación la realiza nuestro servicio de licencias.

## ¿Cómo compruebo una clave? {#by-key}

Ingresa la clave de licencia. Las claves empiezan por `RENTPARTY-WL-`. La respuesta indica si la licencia está activa, en proceso de configuración o revocada. También muestra sus datos públicos: titular, dominios, plataformas y fecha en que terminan las actualizaciones. Nunca muestra el correo ni el precio.

## ¿Cómo compruebo un dominio? {#by-domain}

Ingresa el dominio, por ejemplo, `play.yourbrand.com`. Cada implementación con licencia publica un archivo en `/.well-known/rentparty-white-label-license.json`. La comprobación lee ese archivo y la licencia que indica.

## ¿Qué significa cada respuesta? {#answers}

| Respuesta | Significado |
|---|---|
| Activa | La licencia es válida. |
| En configuración | La licencia ya se emitió, pero la implementación aún no está disponible. |
| Revocada | La licencia terminó por un uso contrario a sus condiciones. |
| Dominio no incluido | El dominio tiene un archivo de licencia, pero esa licencia no lo cubre. |
| Sin archivo de licencia | El dominio no publica un archivo de licencia de Rent Party. |
