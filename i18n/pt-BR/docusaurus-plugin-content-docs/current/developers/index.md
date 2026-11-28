---
title: Rent Party para desenvolvedores
sidebar_label: Visão geral
sidebar_position: 1
description: Três maneiras de usar seus registros do Rent Party em outro lugar — um script com token de acesso, um assistente de IA por MCP ou seu servidor por webhooks — e o que nenhuma delas pode fazer.
topics: [account]
last_update:
  date: 2026-11-19
---

Suas partidas deixam um histórico: vitórias, avaliações, conquistas e partidas salvas ainda não concluídas. Esta seção mostra como usar esse histórico em outro lugar. Uma planilha de todas as noites de jogos. Um bot no bate-papo do grupo que anuncia o vencedor. Um assistente de IA que explica como foram suas últimas dez partidas.

Há três formas de acesso. Você ativa cada uma em **Configurações → Outros aplicativos**.

## Qual delas você precisa? {#which-one}

| Você quer | Use | O que permite | Comece aqui |
|---|---|---|---|
| Consultar estatísticas e resultados no seu código | Um token de acesso e a API | Ler o que os escopos do token permitirem | [Tokens de acesso](./authentication.md), depois [a API](./api.md) |
| Perguntar a Claude, ChatGPT, Claude Code ou Cursor sobre suas partidas | O servidor MCP | Ler o que você aprovou na página de consentimento | [Assistentes de IA](./mcp.md) |
| Receber um aviso assim que uma partida terminar | Webhooks | Receber eventos e nada mais | [Webhooks](./webhooks.md) |

## A quais dados o acesso chega? {#what-it-reaches}

Apenas aos seus próprios registros:

- seu perfil e suas estatísticas;
- os resultados de partidas concluídas;
- suas conquistas e seu histórico de avaliação;
- suas partidas salvas, que você pode ler e também remover.

Essa é a lista completa. Nada aqui pode rolar dados, fazer ofertas ou alterar uma partida em andamento. Somente o próprio jogo movimenta as peças.

## O que vale para todas as formas de acesso? {#ground-rules}

- **Nada fica aberto até você ativar.** Uma conta nova não tem token, aplicativo conectado nem webhook.
- **A remoção exige permissão própria.** Ler é uma permissão; remover uma partida salva é outra, desativada até você marcá-la. Um assistente de IA só pode remover algo depois que você confirmar no Rent Party.
- **Acesso apenas ao seu lugar.** Cada solicitação é respondida em seu nome, seguindo as mesmas regras do jogo. Os dados privados de outro jogador ficam fora de alcance, assim como qualquer informação que ele não tenha tornado pública.
- **Todos os acessos ficam visíveis.** Configurações → Outros aplicativos lista tokens, aplicativos conectados e webhooks, com a data do último uso de cada um.

Ativar a [verificação em duas etapas](./two-step-sign-in.md) também protege esses acessos: para mostrar um token novamente ou aprovar uma nova conexão, será necessário informar um código.

## O que mudou recentemente? {#changes}

Todas as alterações da API, do servidor MCP e dos webhooks aparecem no [histórico de alterações para desenvolvedores](./changelog.md).
