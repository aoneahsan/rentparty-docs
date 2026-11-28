---
title: Tokens de acesso e login para aplicativos
sidebar_label: Tokens de acesso
sidebar_position: 2
description: "Como seu código comprova que pode ler seus registros do Rent Party: tokens de acesso e escopos, regra de dez minutos para revelar um token, vencimento, OAuth para aplicativos, limites de requisições e formato dos erros."
topics: [account]
last_update:
  date: 2026-11-19
---

Um token de acesso é um segredo longo que seu código envia em toda solicitação como `Authorization: Bearer <token>`. Você o cria em **Configurações → Outros aplicativos**, escolhe o que ele pode ler e quando expira, e pode revogá-lo quando quiser. Um aplicativo conectado por você usa OAuth, então você não precisa entregar um token a ele.

## Como criar um token? {#make-a-token}

1. Abra **Configurações → Outros aplicativos → Tokens de acesso** e escolha **Novo token**.
2. Dê um nome que faça sentido daqui a um mês. *Planilha das noites de jogos* é melhor que *token 1*.
3. Escolha os escopos e a validade.
4. O token aparece uma vez, com botão para copiar. Guarde-o em um local seguro antes de fechar o painel.

Depois, a lista mostra o nome e os escopos de cada token, seus primeiros caracteres, quando foi criado e quando foi usado pela última vez. Nunca mostra o token inteiro. Você recebe um e-mail sempre que um token é criado; assim, um token desconhecido não passa despercebido.

## Posso ver um token novamente? {#reveal}

Sim, até **dez minutos após entrar na conta**. Escolha **Revelar** na linha do token:

| Quando | O que acontece |
|---|---|
| Você entrou há menos de dez minutos | O token aparece. |
| Você entrou há mais tempo | O Rent Party avisa e oferece **Entrar novamente**, que leva você de volta à mesma linha. |
| A verificação em duas etapas está ativa | Você também informa um código do aplicativo autenticador, mesmo dentro dos dez minutos. |

Por que esse cuidado? Ficar conectado por semanas é prático, mas um celular emprestado também pode estar conectado. Um login recente confirma que é você quem está pedindo. Você pode revelar tokens dez vezes por hora; cada revelação fica registrada na conta, e um token nunca é enviado por e-mail.

## O que significam os escopos? {#scopes}

Cada parte do seu registro tem um escopo de leitura. Partidas salvas têm mais um:

| Escopo | O que permite ao token |
|---|---|
| `<part>:read` | Ler seu perfil e estatísticas, resultados de partidas concluídas, conquistas e histórico de avaliação ou partidas salvas |
| `saved_games:delete` | Remover uma das suas partidas salvas |

Nenhum escopo altera uma partida, perfil ou resultado. Os nomes exatos estão no [arquivo OpenAPI](./api.md#reference).

**Remover exige permissão própria.** Ler partidas salvas não permite removê-las. O escopo de remoção aparece separado na tela e fica desativado até você marcá-lo. Os escopos de um token não aumentam depois da criação. Se precisar de mais acesso, crie outro token e revogue o antigo. Nenhum token pode receber permissão de equipe.

## Por quanto tempo um token vale? {#expiry}

Você escolhe **30, 90 ou 365 dias**. O Rent Party envia um e-mail sete dias antes do vencimento. Depois dessa data, todas as solicitações feitas com o token recebem `401`.

## Como substituir ou revogar um token? {#rotate-and-revoke}

- **Girar** cria um token novo. O antigo continua funcionando por 24 horas para você atualizar seu código; depois, é revogado. Ambos aparecem na lista até lá.
- **Revogar** encerra imediatamente o acesso do token. A próxima solicitação recebe `401`. Toque duas vezes para confirmar. Não há caixa de diálogo.

Excluir sua conta Rent Party também revoga todos os tokens, aplicativos conectados e webhooks.

## Como um aplicativo se conecta sem token? {#oauth}

Por OAuth 2.1, o mesmo login usado por assistentes de IA. O aplicativo leva você à página de consentimento do Rent Party em `https://rentparty.aoneahsan.com/oauth/consent`, que mostra:

- o nome do aplicativo e o endereço ao qual você voltará;
- a conta Rent Party que ele acessará;
- o que está pedindo, em frases simples, com leitura e remoção em grupos separados e caixas de seleção próprias; a remoção começa desmarcada;
- **Aprovar** e **Negar**, lado a lado.

Com a verificação em duas etapas ativada, Aprovar pede um código. Depois, o aplicativo aparece em **Configurações → Outros aplicativos → Aplicativos conectados**, onde você pode renomeá-lo ou revogá-lo. A revogação encerra o acesso já na próxima solicitação. Saiba mais em [Assistentes de IA](./mcp.md#consent).

## Quantas solicitações posso enviar? {#rate-limits}

Cada token e cada aplicativo conectado pode fazer **120 solicitações por minuto**. Acima disso, há um total diário para sua conta, definido pelo plano. Todos os seus tokens e aplicativos compartilham esse total; criar mais tokens não aumenta o limite. Configurações → Outros aplicativos mostra os números do seu plano ao lado da contagem de hoje.

Toda resposta traz três cabeçalhos:

| Cabeçalho | Significado |
|---|---|
| `RateLimit-Limit` | Número de solicitações permitido nesta janela |
| `RateLimit-Remaining` | Solicitações restantes |
| `RateLimit-Reset` | Segundos até a janela reiniciar |

Se ultrapassar o limite, você recebe `429` com o cabeçalho `Retry-After`. Espere esse número de segundos e tente novamente.

Se enviar muitas solicitações no mesmo instante, a plataforma de hospedagem pode responder `546` antes mesmo de elas chegarem ao Rent Party. Envie uma após a outra ou em pequenos grupos e tente novamente após um segundo se receber `546`.

## Como é um erro? {#errors}

Todos os erros, em todas as rotas, seguem o mesmo formato:

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

Trate `code` no seu programa. `message` é para pessoas e pode mudar. Vai nos escrever sobre uma solicitação que falhou? Informe o `correlation_id`. Ele nos ajuda a localizar aquela solicitação específica.

| Status | Geralmente significa |
|---|---|
| `401` | Token ausente, incorreto, revogado ou vencido |
| `403` | O token não tem um escopo necessário (`details` informa qual) ou é preciso entrar novamente |
| `404` | Não existe um registro com esse identificador nos seus dados, inclusive quando ele pertence a outra pessoa |
| `429` | Limite de solicitações atingido. Veja `Retry-After` |

A lista completa de códigos está no [arquivo OpenAPI](./api.md#reference).
