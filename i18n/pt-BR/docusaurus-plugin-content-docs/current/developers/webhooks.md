---
title: Webhooks
sidebar_position: 5
description: Os webhooks do Rent Party avisam seu servidor quando uma partida termina, uma conquista é obtida ou uma partida salva é criada ou removida. Assinados conforme Standard Webhooks, com novas tentativas por pouco mais de um dia e exemplos de verificação em Node, Python e PHP.
topics: [account]
last_update:
  date: 2026-11-19
---

Um webhook é uma solicitação `POST` assinada que o Rent Party envia a um endereço seu assim que algo acontece na sua conta. O último jogador declara falência, e seu servidor recebe a notícia de quem venceu. Adicione o endereço em **Configurações → Outros aplicativos → Webhooks**, escolha os eventos e verifique a assinatura de cada solicitação para confirmar que veio de nós.

## Quais eventos existem? {#events}

| Evento | Quando é enviado |
|---|---|
| `game.finished` | Uma partida da qual você participou termina |
| `achievement.earned` | Você recebe uma conquista |
| `saved_game.created` | Uma partida é salva na sua conta |
| `saved_game.deleted` | Uma das suas partidas salvas é removida |
| `webhook.test` | Você toca em **Enviar evento de teste** |

O conteúdo completo de cada evento está no [arquivo OpenAPI](./api.md#reference). Não o repetimos aqui para que esta página não fique desatualizada.

## Quais endereços são aceitos? {#addresses}

- Apenas `https://`, nas portas 443 ou 8443, sem nome de usuário nem senha no endereço.
- Nunca endereços privados ou locais: `localhost`, `127.0.0.1`, `10.x.x.x`, `192.168.x.x`, endereços link-local ou nomes que apontem para algum deles. A verificação acontece ao salvar o endereço e antes de cada envio. Redirecionamentos para endereços privados também são recusados.
- Seu servidor tem dez segundos para responder.

## O que vem na solicitação? {#headers}

O Rent Party segue a especificação [Standard Webhooks](https://www.standardwebhooks.com/). Toda solicitação tem três cabeçalhos:

| Cabeçalho | Conteúdo |
|---|---|
| `webhook-id` | Identificador do evento. Permanece igual em todas as tentativas; use-o para ignorar repetições. |
| `webhook-timestamp` | Momento do envio, em segundos desde 1970. |
| `webhook-signature` | `v1,` seguido de uma assinatura HMAC-SHA256 em base64. Pode haver várias, separadas por espaços. |

O segredo de assinatura começa com `whsec_`. Você pode vê-lo novamente seguindo a mesma [regra de dez minutos](./authentication.md#reveal) usada para tokens. **Girar segredo** emite um novo e assina com os dois durante 24 horas, para que um destinatário que aceite qualquer um continue funcionando enquanto você troca o segredo.

## Como verificar uma solicitação? {#verify}

Verifique primeiro, interprete depois, usando exatamente os bytes recebidos. Um JSON interpretado e escrito novamente não corresponde à assinatura original.

As bibliotecas abaixo são as do Standard Webhooks: `standardwebhooks` 1.3.0 no npm e PyPI e `standard-webhooks/standard-webhooks` 1.3.0 no Packagist, conforme verificado em 19 de novembro de 2026.

### Node {#node}

```js
import { Webhook } from 'standardwebhooks';

const wh = new Webhook(process.env.RENTPARTY_WEBHOOK_SECRET); // the whsec_… value

app.post('/hooks/rentparty', express.raw({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    event = wh.verify(req.body, req.headers); // throws on a bad signature or a stale timestamp
  } catch {
    return res.sendStatus(400);
  }
  if (seenBefore(req.headers['webhook-id'])) return res.sendStatus(200);
  queue.add(event); // answer quickly, do the work afterwards
  res.sendStatus(200);
});
```

### Python {#python}

```python
from standardwebhooks.webhooks import Webhook
wh = Webhook(os.environ["RENTPARTY_WEBHOOK_SECRET"])
payload = wh.verify(request.get_data(), dict(request.headers))
```

### PHP {#php}

```php
$wh = new \StandardWebhooks\Webhook(getenv('RENTPARTY_WEBHOOK_SECRET'));
$payload = $wh->verify(file_get_contents('php://input'), getallheaders());
```

### Qualquer linguagem {#any-language}

1. `secret = base64decode(the whsec value without its "whsec_" prefix)`.
2. `signed = webhook-id + "." + webhook-timestamp + "." + raw body` (os bytes exatos recebidos).
3. `expected = base64(HMAC_SHA256(secret, signed))`.
4. Compare `expected` com cada valor `v1,` de `webhook-signature` em tempo constante. Qualquer correspondência é válida.
5. Recuse se `|now − webhook-timestamp| > 300`.

## E se meu servidor não responder? {#retries}

Qualquer resposta `2xx` conta como entrega. Outro status, tempo esgotado ou conexão recusada conta como tentativa perdida. O Rent Party tenta novamente:

| Tentativa | Envio |
|---|---|
| 1 | Imediatamente |
| 2 | Cinco segundos depois |
| 3 | Cinco minutos depois |
| 4 | 30 minutos depois |
| 5 | Duas horas depois |
| 6 | Cinco horas depois |
| 7 | Dez horas depois |
| 8 | Dez horas depois |

Três situações desativam um endereço:

- **`410 Gone`**, imediatamente. Responda com esse código quando você desativar o endereço de propósito.
- **Todas as oito tentativas falham** para um evento.
- **Cinco dias consecutivos de entregas perdidas** no endereço.

Quando um endereço é desativado, o Rent Party envia um e-mail com o último erro e um link para reativá-lo.

## Como testar e reenviar? {#test-and-replay}

- **Enviar evento de teste** envia `webhook.test` ao endereço imediatamente.
- O **registro de entregas** de cada endereço lista todas as tentativas: status, número da tentativa, código de resposta, duração e horário da próxima tentativa. Ele se atualiza conforme as entregas acontecem, sem precisar recarregar.
- **Reenviar** faz uma nova entrega com o mesmo `webhook-id`. Voltou de uma falha? Reenvie todas as entregas perdidas desde o horário escolhido, até mil de uma vez.
- **Pausar** suspende os envios a um endereço até você retomá-los.
