---
title: Verificação em duas etapas
sidebar_position: 6
description: Ative a verificação em duas etapas na conta Rent Party usando um aplicativo autenticador, guarde os códigos de recuperação, decida se quer lembrar o navegador por sete dias e saiba o que fazer se perder o celular.
topics: [account]
last_update:
  date: 2026-11-19
---

A verificação em duas etapas pede um código de seis dígitos de um aplicativo autenticador depois que você entra com Google. Mesmo que alguém acesse sua conta do Google, essa pessoa não poderá tomar seu lugar, suas moedas ou suas partidas salvas sem seu celular. Você decide se quer ativá-la na sua conta. Para a equipe Rent Party, não há escolha: todas as contas de administração precisam dela.

## Como ativar? {#turn-on}

1. Abra **Configurações → Segurança → Verificação em duas etapas**.
2. Leia o código QR com um aplicativo autenticador: Google Authenticator, Microsoft Authenticator, 1Password, Bitwarden ou outro que gere códigos de seis dígitos. Não consegue ler o QR? Digite a chave mostrada abaixo dele.
3. Informe o código exibido no aplicativo. Após a confirmação do Rent Party, a verificação em duas etapas estará ativa.

## Para que servem os códigos de recuperação? {#recovery-codes}

Ao ativar o recurso, você recebe **dez códigos de recuperação**, mostrados uma única vez. Eles são sua chave reserva caso você perca o celular. Baixe-os ou copie-os para um lugar que não esteja no aparelho.

- Cada código permite entrar uma vez no lugar do código do aplicativo.
- A verificação em duas etapas continua ativa após o uso de um código. O próximo login pedirá um código novamente.
- **Gerar novos códigos** substitui todos os anteriores, que deixam de funcionar. Primeiro, é preciso informar um código atual.

## O que faz “Lembrar este navegador”? {#remember-browser}

Depois que você informa um código, a tela de login oferece **Lembrar este navegador por 7 dias**. A opção começa desmarcada e só muda se você marcá-la.

| Sua escolha | No próximo login |
|---|---|
| Desmarcada | O Rent Party pede um código novamente. |
| Marcada | Este navegador neste dispositivo dispensa o código por sete dias. Outros navegadores e dispositivos continuam pedindo. |

Sair da conta encerra a confiança naquele navegador. **Configurações → Segurança → Navegadores confiáveis** lista cada navegador lembrado, quando foi adicionado e quando a confiança expira. **Esquecer** remove um; **Esquecer todos** remove todos. Desativar a verificação em duas etapas também remove todos.

Mesmo em um navegador lembrado, você precisa informar um código para mostrar um token de acesso ou segredo de webhook, alterar a própria verificação em duas etapas e abrir telas de administração.

## Em que outras situações é pedido um código? {#other-codes}

- **Mostrar novamente um token ou segredo.** Veja [Tokens de acesso](./authentication.md#reveal).
- **Aprovar um aplicativo ou assistente de IA** na página de consentimento. Veja [Assistentes de IA](./mcp.md#consent).
- **Desativar a verificação em duas etapas.** É necessário um código atual.

## Perdeu o celular e os códigos? {#lost-everything}

Escreva para nós pela página de [Ajuda](https://rentparty.aoneahsan.com/help). Antes de desativar a verificação em duas etapas de uma conta, a equipe confirma que a conta realmente é sua. Isso demora mais do que usar um código de recuperação de propósito: é a mesma barreira que um desconhecido teria de superar.

## Administradores precisam usar a verificação? {#admins}

Sim. Ninguém acessa as telas de administração do Rent Party sem informar um código na sessão atual. Um navegador lembrado não substitui essa exigência.
