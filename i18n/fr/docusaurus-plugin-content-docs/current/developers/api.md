---
title: "L'API Rent Party"
sidebar_label: "L'API"
sidebar_position: 3
description: "L'API REST Rent Party : adresse de base, données accessibles, pagination par curseur de 20 à 50 lignes et fichier OpenAPI de référence."
topics: [account]
last_update:
  date: 2026-11-19
---

L'API REST Rent Party possède une seule adresse. Elle lit vos propres données et peut supprimer une partie sauvegardée si vous l'avez autorisé. Un fichier OpenAPI décrit toutes les routes et tous les champs : il fait foi. Cette page indique où le trouver et explique les règles de pagination.

## Quelle est l'adresse de base ? {#base-address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1
```

Le `v1` final indique la version de l'API. Chaque requête exige un jeton ou une application connectée. Voir [Jetons d'accès](./authentication.md).

```bash
curl -H "Authorization: Bearer $RENTPARTY_TOKEN" \
  https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json
```

## Quelles données puis-je lire ? {#resources}

| Partie de vos données | Lecture | Suppression |
|---|---|---|
| Profil et statistiques | Oui | Non |
| Résultats des parties terminées | Oui | Non |
| Badges et historique du classement | Oui | Non |
| Parties sauvegardées | Oui | Oui, avec la permission de suppression |

Une partie en cours n'apparaît pas dans l'API. Aucune route ne peut modifier un coup, un résultat ou un classement. Les résultats montrent ce que la table a vu à la fin, jamais les données privées d'un autre joueur.

## Où trouver la référence complète ? {#reference}

| Fichier | Adresse | Ouvrir avec |
|---|---|---|
| OpenAPI 3.1, JSON | [`/v1/openapi.json`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.json) | Swagger UI, Redocly, Postman, Insomnia ou un générateur de client OpenAPI |
| Même contenu, en Markdown | [`/v1/openapi.md`](https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/api/v1/openapi.md) | Un navigateur, un éditeur de texte ou un assistant IA auquel vous le fournissez |

Les deux fichiers proviennent de la même source que l'API : ils décrivent ses routes réelles.

Quatre parties répondent à la plupart des questions :

- **`paths`** : chaque route, sa méthode et la permission requise.
- **`components.schemas`** : les champs possibles de chaque réponse, avec leur type. Un champ absent n'est jamais envoyé.
- **`components.securitySchemes`** : les deux modes d'accès, jeton porteur et OAuth.
- **Les réponses d'erreur** : les valeurs de `code` que le [format d'erreur](./authentication.md#errors) peut contenir pour chaque route.

## Comment fonctionne la pagination ? {#pagination}

Chaque liste est découpée en pages :

- **20 lignes par page** par défaut, **50 au maximum**.
- Si d'autres lignes suivent, la réponse contient un `next_cursor`. Renvoyez cette valeur pour obtenir la page suivante.
- Sans `next_cursor`, vous êtes à la dernière page.

Un curseur est un repère, pas un numéro de page. Si une partie se termine pendant que votre script parcourt les résultats, les lignes déjà lues ne se décalent pas. Le fichier OpenAPI nomme les paramètres de taille et de curseur de chaque liste.

## Et les limites et erreurs ? {#limits-and-errors}

Elles s'appliquent à toutes les routes et sont expliquées dans [Jetons d'accès](./authentication.md#rate-limits).
