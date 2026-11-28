---
title: Verificar uma licença
sidebar_label: Verificar uma licença
description: Como verificar se um Rent Party com marca própria tem licença pela chave ou pelo domínio, e o significado de cada resposta.
topics: [white-label]
sidebar_position: 5
last_update:
  date: 2026-11-13
---

Qualquer pessoa pode verificar um Rent Party com marca própria na [página Verificar uma licença](https://rentparty.aoneahsan.com/verify-license). Nosso serviço de licenciamento realiza a verificação.

## Como verificar pela chave? {#by-key}

Informe a chave de licença. As chaves começam com `RENTPARTY-WL-`. A resposta indica se a licença está ativa, em configuração ou revogada, e mostra seus dados públicos: titular, domínios, plataformas e data de término das atualizações. Ela nunca mostra e-mail nem preço.

## Como verificar pelo domínio? {#by-domain}

Informe o domínio, como `play.yourbrand.com`. Toda instalação licenciada disponibiliza um arquivo em `/.well-known/rentparty-white-label-license.json`. A verificação consulta esse arquivo e a licença indicada nele.

## O que significam as respostas? {#answers}

| Resposta | Significado |
|---|---|
| Ativa | A licença é válida. |
| Em configuração | A licença foi emitida, mas a instalação ainda não está no ar. |
| Revogada | A licença foi encerrada por uso fora dos seus termos. |
| Domínio não coberto | O domínio tem um arquivo de licença, mas essa licença não cobre o domínio. |
| Arquivo de licença ausente | O domínio não disponibiliza um arquivo de licença do Rent Party. |
