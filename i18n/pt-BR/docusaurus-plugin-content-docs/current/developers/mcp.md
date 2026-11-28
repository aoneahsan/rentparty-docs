---
title: Conectar um assistente de IA (MCP)
sidebar_label: Assistentes de IA (MCP)
sidebar_position: 4
description: Conecte Claude, ChatGPT, Claude Code ou Cursor aos seus registros do Rent Party pelo servidor MCP. Veja o endereço, as permissões da página de consentimento, a confirmação para remover uma partida salva e como desconectar.
topics: [account]
last_update:
  date: 2026-11-19
---

O servidor MCP do Rent Party permite que um assistente de IA leia seus registros quando você pedir. *“Quantas das minhas últimas dez partidas eu venci?”* *“Quais partidas salvas não abro há um mês?”* Informe um endereço ao assistente, entre no Rent Party e escolha na página de consentimento o que ele poderá ver. Funciona com Claude, ChatGPT, Claude Code, Cursor e outros assistentes compatíveis com MCP.

## Qual é o endereço? {#address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp
```

Ele também aparece em **Configurações → Outros aplicativos → Conectar um assistente de IA**, com um botão para copiar. Você nunca cola um token no assistente. Ele descobre a página de login do Rent Party a partir desse endereço e leva você até ela.

## Como conectar cada assistente? {#connect}

Os menus desses aplicativos mudam entre versões. Se uma etapa não corresponder à sua tela, procure **Connectors** nas configurações do aplicativo.

### Claude {#claude}

1. No Claude, abra **Settings → Connectors** e adicione um conector personalizado.
2. Cole o endereço acima.
3. Entre no Rent Party quando solicitado e aprove na página de consentimento.

### ChatGPT {#chatgpt}

1. No ChatGPT, abra **Settings → Connectors**. Algumas contas precisam ativar o modo de desenvolvedor na primeira vez.
2. Adicione um conector com o endereço acima.
3. Entre no Rent Party quando solicitado e aprove na página de consentimento.

### Claude Code {#claude-code}

```bash
claude mcp add --transport http rentparty https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp
```

Depois, execute `/mcp` no Claude Code, escolha **rentparty** e entre na conta pela janela do navegador que ele abrir.

### Cursor {#cursor}

Adicione Rent Party ao seu `mcp.json`:

```json
{
  "mcpServers": {
    "rentparty": {
      "url": "https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp"
    }
  }
}
```

O Cursor pedirá login na primeira vez que usar a conexão.

## O que a página de consentimento pergunta? {#consent}

Antes que um assistente veja qualquer dado, o Rent Party mostra em `https://rentparty.aoneahsan.com/oauth/consent`:

- **qual aplicativo está pedindo acesso** e o endereço ao qual você voltará;
- **qual conta Rent Party** será acessada, algo para conferir se você usa mais de uma conta do Google;
- **o que o aplicativo poderá fazer**, em frases simples, com leitura e remoção separadas e cada uma com sua caixa de seleção. A remoção começa desmarcada;
- **Aprovar** e **Negar**, lado a lado.

Com a [verificação em duas etapas](./two-step-sign-in.md) ativada, Aprovar pede um código. Nada é aprovado em seu nome. Toda nova conexão passa por essa página.

O assistente recebe apenas as ferramentas permitidas pelas opções marcadas. Se você permitir só leitura, ele não terá como remover nada.

## Como funciona a remoção de uma partida salva? {#removing}

Um assistente pode **preparar** uma remoção. Somente você pode **concluí-la**. Ao pedir que ele exclua uma partida antiga, você verá qual partida seria removida e um link para o Rent Party. Confirme no jogo em até dez minutos; caso contrário, a partida salva permanece.

Por isso, uma frase escondida em uma página web ou mensagem colada não consegue fazer o assistente apagar suas partidas: ele não pode confirmar o próprio pedido.

Sem a permissão de remoção marcada na página de consentimento, o assistente não consegue nem preparar a ação.

## Como desconectar um assistente? {#disconnect}

Abra **Configurações → Outros aplicativos → Aplicativos conectados** e escolha **Revogar** na linha correspondente. O acesso termina na próxima solicitação feita pelo aplicativo. A lista mostra as permissões de cada aplicativo, a data da conexão e a do último uso. Uma conexão nova aparece assim que você a aprova. O Rent Party também envia um e-mail quando um aplicativo é conectado.

## Por que não está funcionando? {#troubleshooting}

| O que você vê | O que fazer |
|---|---|
| O assistente pede login novamente | A sessão dele expirou. Entre no Rent Party outra vez a partir do assistente. |
| Ele diz que falta uma permissão | Essa permissão não foi concedida. Desconecte, conecte novamente e marque-a na página de consentimento. |
| O Rent Party sumiu das ferramentas ou todas as chamadas falham | O acesso foi revogado. Confira **Aplicativos conectados** e conecte novamente se quiser. |
| Uma partida salva que ele disse que removeria ainda está lá | A ação não foi confirmada no Rent Party em até dez minutos. Peça novamente. |
| Você quer saber quando ele foi usado | **Aplicativos conectados** mostra quando cada aplicativo foi usado pela última vez. |
