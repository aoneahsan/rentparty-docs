---
title: "Jetons d'accès et connexion des applications"
sidebar_label: "Jetons d'accès"
sidebar_position: 2
description: "Créez et gérez un jeton d'accès à vos données Rent Party : permissions, réaffichage pendant 10 minutes, expiration, OAuth, limites et erreurs."
topics: [account]
last_update:
  date: 2026-11-19
---

Un jeton d'accès est un long secret que votre code envoie avec chaque requête, sous la forme `Authorization: Bearer <token>`. Vous le créez dans **Paramètres → Autres applications**, choisissez les données qu'il peut lire et sa date d'expiration, puis pouvez le révoquer à tout moment. Une application qui se connecte à votre place utilise OAuth : vous n'avez pas à lui remettre de jeton.

## Comment créer un jeton ? {#make-a-token}

1. Ouvrez **Paramètres → Autres applications → Jetons d'accès**, puis choisissez **Nouveau jeton**.
2. Donnez-lui un nom reconnaissable dans quelques mois. *Tableau des soirées jeux* est plus clair que *jeton 1*.
3. Choisissez ses permissions et sa durée de validité.
4. Le jeton s'affiche une seule fois, avec un bouton de copie. Conservez-le en lieu sûr avant de fermer le panneau.

La liste affiche ensuite son nom, ses permissions, ses premiers caractères, sa date de création et sa dernière utilisation, jamais le jeton entier. Vous recevez un e-mail à chaque création : un jeton créé à votre insu sera visible.

## Puis-je réafficher un jeton ? {#reveal}

Oui, pendant les **10 minutes qui suivent votre connexion**. Choisissez **Afficher** sur sa ligne :

| Situation | Résultat |
|---|---|
| Connexion il y a moins de 10 minutes | Le jeton s'affiche. |
| Connexion plus ancienne | Rent Party propose **Se reconnecter**, puis vous ramène à la même ligne. |
| Connexion en deux étapes activée | Vous saisissez aussi un code de votre application d'authentification, même pendant ces 10 minutes. |

Pourquoi cette précaution ? Rester connecté pendant des semaines est pratique, mais un téléphone emprunté peut l'être aussi. Une connexion récente confirme que la demande vient de vous. Vous pouvez réafficher un jeton dix fois par heure ; chaque affichage est enregistré sur votre compte. Le jeton n'est jamais envoyé par e-mail.

## Que signifient les permissions ? {#scopes}

Chaque partie de vos données possède une permission de lecture. Les sauvegardes en possèdent une autre :

| Permission | Ce qu'elle autorise |
|---|---|
| `<part>:read` | Lire votre profil et vos statistiques, les résultats des parties terminées, vos badges et l'évolution de votre classement, ou vos sauvegardes. |
| `saved_games:delete` | Supprimer l'une de vos parties sauvegardées. |

Aucune permission ne permet de modifier une partie, un profil ou un résultat. Les noms exacts figurent dans le [fichier OpenAPI](./api.md#reference).

**La suppression n'est jamais implicite.** Lire une sauvegarde ne permet pas de la supprimer. Sa permission est présentée séparément et reste décochée tant que vous ne l'activez pas. Les permissions d'un jeton ne s'élargissent jamais après sa création : créez-en un nouveau, puis révoquez l'ancien. Aucun jeton ne peut posséder une permission réservée à l'équipe.

## Combien de temps dure un jeton ? {#expiry}

Vous choisissez **30, 90 ou 365 jours**. Rent Party vous envoie un e-mail sept jours avant son expiration. Passé cette date, chaque requête avec ce jeton reçoit `401`.

## Comment remplacer ou révoquer un jeton ? {#rotate-and-revoke}

- **Remplacer** crée un nouveau jeton. L'ancien fonctionne encore pendant 24 heures pour vous laisser mettre à jour votre code, puis il est révoqué. Les deux apparaissent dans la liste pendant ce délai.
- **Révoquer** arrête immédiatement un jeton. La requête suivante reçoit `401`. Appuyez une deuxième fois pour confirmer, sans boîte de dialogue.

La suppression de votre compte Rent Party révoque également tous vos jetons, applications connectées et webhooks.

## Comment une application se connecte-t-elle sans jeton ? {#oauth}

Avec OAuth 2.1, comme un assistant IA. L'application vous dirige vers la page de consentement de Rent Party à `https://rentparty.aoneahsan.com/oauth/consent`, qui montre :

- son nom et l'adresse où elle vous renverra ;
- le compte Rent Party auquel elle demande accès ;
- ses demandes en phrases claires, lecture et suppression séparées, avec des cases distinctes et la suppression décochée ;
- **Approuver** et **Refuser**, côte à côte.

Si la connexion en deux étapes est active, l'approbation demande un code. L'application apparaît ensuite sous **Paramètres → Autres applications → Applications connectées** ; vous pouvez la renommer ou la révoquer. La révocation prend effet dès sa prochaine requête. Voir aussi [Assistants IA](./mcp.md#consent).

## Combien de requêtes puis-je envoyer ? {#rate-limits}

Chaque jeton et chaque application connectée dispose de **120 requêtes par minute**. Votre compte possède aussi un total quotidien, fixé par votre formule. Tous vos jetons et applications le partagent : en créer davantage ne l'augmente pas. Paramètres → Autres applications montre le quota de votre formule et votre utilisation du jour.

Chaque réponse contient trois en-têtes :

| En-tête | Signification |
|---|---|
| `RateLimit-Limit` | Requêtes autorisées pendant cette période. |
| `RateLimit-Remaining` | Requêtes restantes. |
| `RateLimit-Reset` | Secondes avant la prochaine période. |

Si vous dépassez la limite, la réponse est `429` avec l'en-tête `Retry-After`. Attendez le nombre de secondes indiqué avant de réessayer.

Si vous envoyez beaucoup de requêtes au même instant, la plateforme d'hébergement peut répondre `546` avant même que Rent Party ne les reçoive. Envoyez-les successivement ou par petits groupes, puis réessayez une réponse `546` après une seconde.

## À quoi ressemble une erreur ? {#errors}

Toutes les routes utilisent le même format :

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

Dans votre code, utilisez `code`. Le champ `message` s'adresse aux personnes et sa formulation peut changer. Si vous nous signalez une requête échouée, transmettez son `correlation_id` : il nous permet de retrouver cette requête précise.

| Statut | Signification habituelle |
|---|---|
| `401` | Jeton absent, erroné, révoqué ou expiré. |
| `403` | Permission manquante, précisée dans `details`, ou nouvelle connexion nécessaire. |
| `404` | Aucune donnée avec cet identifiant dans votre compte, y compris si elle appartient à quelqu'un d'autre. |
| `429` | Limite de requêtes atteinte. Consultez `Retry-After`. |

La liste complète des codes se trouve dans le [fichier OpenAPI](./api.md#reference).
