---
title: "Webhooks"
sidebar_position: 5
description: "Les webhooks Rent Party avertissent votre serveur lorsqu'une partie se termine, qu'un badge est gagné ou qu'une sauvegarde change. Signature et reprises automatiques."
topics: [account]
last_update:
  date: 2026-11-19
---

Un webhook est une requête `POST` signée, envoyée par Rent Party à une adresse qui vous appartient lorsqu'un événement se produit sur votre compte. Après la dernière faillite, votre serveur apprend qui a gagné. Ajoutez l'adresse sous **Paramètres → Autres applications → Webhooks**, choisissez les événements et vérifiez la signature de chaque requête pour confirmer son origine.

## Quels événements sont disponibles ? {#events}

| Événement | Quand est-il envoyé ? |
|---|---|
| `game.finished` | Une partie à laquelle vous avez participé se termine. |
| `achievement.earned` | Vous gagnez un badge. |
| `saved_game.created` | Une partie est sauvegardée sur votre compte. |
| `saved_game.deleted` | L'une de vos sauvegardes est supprimée. |
| `webhook.test` | Vous appuyez sur **Envoyer un événement test**. |

La charge utile complète de chaque événement figure dans le [fichier OpenAPI](./api.md#reference). Nous ne la recopions pas ici pour éviter une documentation périmée.

## Quelles adresses sont acceptées ? {#addresses}

- Une adresse `https://` uniquement, sur le port 443 ou 8443, sans nom d'utilisateur ni mot de passe dans l'URL.
- Jamais d'adresse privée ou locale : `localhost`, `127.0.0.1`, `10.x.x.x`, `192.168.x.x`, adresse locale de lien ou nom qui pointe vers l'une d'elles. La vérification a lieu à l'enregistrement, puis avant chaque envoi. Une redirection vers une adresse privée est également refusée.
- Votre serveur dispose de dix secondes pour répondre.

## Que contient une requête ? {#headers}

Rent Party suit la spécification [Standard Webhooks](https://www.standardwebhooks.com/). Chaque requête contient trois en-têtes :

| En-tête | Contenu |
|---|---|
| `webhook-id` | Identifiant de l'événement, identique à chaque nouvelle tentative. Utilisez-le pour ignorer les doublons. |
| `webhook-timestamp` | Heure d'envoi, en secondes depuis 1970. |
| `webhook-signature` | `v1,` suivi d'une signature HMAC-SHA256 encodée en base64. Plusieurs signatures peuvent être séparées par des espaces. |

Le secret de signature commence par `whsec_`. Vous pouvez le réafficher avec la même [règle des dix minutes](./authentication.md#reveal) qu'un jeton. **Remplacer** crée un nouveau secret et signe avec l'ancien et le nouveau pendant 24 heures, pour laisser le temps de mettre à jour votre serveur.

## Comment vérifier une requête ? {#verify}

Vérifiez avant d'analyser le JSON, avec les octets exacts reçus. Un JSON analysé puis réécrit ne correspond plus à la signature.

Les bibliothèques ci-dessous suivent Standard Webhooks : `standardwebhooks` 1.3.0 sur npm et PyPI, et `standard-webhooks/standard-webhooks` 1.3.0 sur Packagist, versions vérifiées le 19 novembre 2026.

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

### Dans tout langage {#any-language}

1. `secret = base64decode(the whsec value without its "whsec_" prefix)`.
2. `signed = webhook-id + "." + webhook-timestamp + "." + raw body` (les octets exacts reçus).
3. `expected = base64(HMAC_SHA256(secret, signed))`.
4. Comparez `expected` à chaque valeur `v1,` de `webhook-signature` en temps constant. Une correspondance suffit.
5. Refusez la requête si `|now − webhook-timestamp| > 300`.

## Que se passe-t-il si mon serveur ne répond pas ? {#retries}

Toute réponse `2xx` confirme la livraison. Un autre statut, un dépassement de délai ou une connexion refusée comptent comme un échec. Rent Party réessaie :

| Tentative | Envoi |
|---|---|
| 1 | Immédiatement |
| 2 | 5 secondes plus tard |
| 3 | 5 minutes plus tard |
| 4 | 30 minutes plus tard |
| 5 | 2 heures plus tard |
| 6 | 5 heures plus tard |
| 7 | 10 heures plus tard |
| 8 | 10 heures plus tard |

Trois situations désactivent une adresse :

- **`410 Gone`**, immédiatement. Renvoyez ce statut si vous avez retiré l'adresse volontairement.
- **Les huit tentatives échouent** pour un événement.
- **Cinq jours consécutifs d'échecs de livraison** pour cette adresse.

Après désactivation, Rent Party vous envoie un e-mail avec la dernière erreur et un lien pour réactiver l'adresse.

## Comment tester et relancer une livraison ? {#test-and-replay}

- **Envoyer un événement test** envoie immédiatement `webhook.test` à l'adresse.
- Le **journal des livraisons** indique chaque tentative : statut, numéro, code de réponse, durée et date de la prochaine tentative. Il se met à jour sans recharger la page.
- **Relancer** renvoie une livraison avec le même `webhook-id`. Après une panne, vous pouvez relancer jusqu'à 1 000 livraisons manquées depuis une date choisie.
- **Mettre en pause** suspend les envois vers une adresse jusqu'à leur reprise.
