---
title: API do Rent Party
sidebar_label: API
sidebar_position: 3
description: "A API REST do Rent Party: endereço base, dados disponíveis, paginação por cursor com 20 linhas por padrão e 50 no máximo, e o arquivo OpenAPI que descreve todas as rotas e campos."
topics: [account]
last_update:
  date: 2026-11-19
---

A API do Rent Party é uma API REST com um único endereço. Ela lê seus próprios registros e pode remover uma partida salva quando você autorizar essa ação. Todas as rotas e campos estão descritos em um arquivo OpenAPI, que serve como referência. Esta página mostra onde encontrá-lo e as regras seguidas por todas as listas.

## Qual é o endereço base? {#base-address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1
```

O `v1` no final é a versão da API. Toda solicitação precisa de um token ou aplicativo conectado. Veja [Tokens de acesso](./authentication.md).

```bash
curl -H "Authorization: Bearer $RENTPARTY_TOKEN" \
  https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json
```

## Quais dados posso ler? {#resources}

| Parte do seu registro | Ler | Remover |
|---|---|---|
| Perfil e estatísticas | Sim | Não |
| Resultados de partidas concluídas | Sim | Não |
| Conquistas e histórico de avaliação | Sim | Não |
| Partidas salvas | Sim | Sim, com o escopo de remoção |

Uma partida em andamento não aparece na API, que não pode alterar jogadas, resultados ou avaliações. Os resultados mostram o que a mesa viu ao fim da partida, nunca os dados privados de outro jogador.

## Onde está a referência completa? {#reference}

| Arquivo | Endereço | Abra com |
|---|---|---|
| OpenAPI 3.1, JSON | [`/v1/openapi.json`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json) | Qualquer ferramenta OpenAPI: Swagger UI, Redocly, Postman, Insomnia ou um gerador de cliente |
| A mesma referência em Markdown | [`/v1/openapi.md`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.md) | Navegador, editor de texto ou assistente de IA no qual você cole o conteúdo |

Ambos são gerados da mesma fonte da API, portanto não podem listar uma rota inexistente nem deixar de fora uma rota existente.

Quatro partes do arquivo respondem à maioria das perguntas:

- **`paths`**: cada rota, seu método e o escopo necessário.
- **`components.schemas`**: cada campo que uma resposta pode trazer, com seu tipo. Um campo ausente não é enviado.
- **`components.securitySchemes`**: as duas formas de acesso, token bearer e OAuth.
- **Respostas de erro**: cada `code` que o [formato de erro](./authentication.md#errors) pode trazer, rota por rota.

## Como funciona a paginação? {#pagination}

Todas as listas vêm em páginas:

- **20 linhas por página** por padrão, **50 no máximo**.
- Uma página com mais resultados inclui `next_cursor`. Envie esse valor na solicitação seguinte.
- Uma página sem `next_cursor` é a última.

Um cursor é um marcador de posição, não um número de página. Se uma partida terminar enquanto seu script percorre os resultados, os registros não se deslocarão uma posição. O arquivo OpenAPI indica os parâmetros de tamanho e cursor de cada rota de lista.

## E os limites e erros? {#limits-and-errors}

São iguais em todas as rotas e estão na página [Tokens de acesso](./authentication.md#rate-limits).
