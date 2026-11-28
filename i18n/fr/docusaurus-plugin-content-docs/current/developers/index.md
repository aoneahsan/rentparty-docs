---
title: "Rent Party pour les développeurs"
sidebar_label: "Présentation"
sidebar_position: 1
description: "Trois façons d'utiliser vos données Rent Party ailleurs : API avec jeton d'accès, assistant IA par MCP ou webhooks vers votre serveur, avec leurs limites."
topics: [account]
last_update:
  date: 2026-11-19
---

Vos parties laissent une trace : victoires, classements, badges, sauvegardes de parties inachevées. Cette rubrique vous aide à utiliser ces données ailleurs. Vous pouvez créer un tableau de vos soirées jeux, un bot qui annonce le vainqueur dans votre groupe ou un assistant IA qui résume vos dix dernières parties.

Trois moyens sont proposés. Vous activez vous-même chacun d'eux sous **Paramètres → Autres applications**.

## Lequel choisir ? {#which-one}

| Votre objectif | Moyen | Ce qu'il permet | Pour commencer |
|---|---|---|---|
| Récupérer vos statistiques et résultats dans votre code | Un jeton d'accès et l'API | Lire les données autorisées par les permissions du jeton | [Jetons d'accès](./authentication.md), puis [API](./api.md) |
| Interroger Claude, ChatGPT, Claude Code ou Cursor sur vos parties | Le serveur MCP | Lire les données autorisées sur la page de consentement | [Assistants IA](./mcp.md) |
| Recevoir un événement dès qu'une partie se termine | Les webhooks | Recevoir des événements, sans autre accès | [Webhooks](./webhooks.md) |

## Quelles données sont accessibles ? {#what-it-reaches}

Vos propres données, et seulement les vôtres :

- votre profil et vos statistiques ;
- les résultats des parties terminées ;
- vos badges et l'évolution de votre classement ;
- vos parties sauvegardées, que vous pouvez lire et supprimer.

C'est tout. Aucune de ces méthodes ne peut lancer un dé, enchérir ou agir sur une partie en cours. Seul le jeu déplace les pions.

## Quelles règles s'appliquent dans tous les cas ? {#ground-rules}

- **Aucun accès sans votre action.** Un nouveau compte ne possède ni jeton, ni application connectée, ni webhook.
- **La suppression exige une permission distincte.** Lire et supprimer sont deux autorisations séparées. La suppression d'une sauvegarde est désactivée tant que vous ne l'autorisez pas ; un assistant IA demande en plus votre confirmation dans Rent Party.
- **Vos données restent les vôtres.** Chaque requête est traitée avec vos droits et les mêmes règles que le jeu. Les données privées d'un autre joueur restent inaccessibles.
- **Tous les accès sont visibles.** Paramètres → Autres applications liste les jetons, applications connectées et webhooks, avec leur dernière utilisation.

La [connexion en deux étapes](./two-step-sign-in.md) les protège également : révéler un jeton ou approuver une nouvelle connexion demande alors un code.

## Quoi de neuf ? {#changes}

Les changements de l'API, du serveur MCP et des webhooks figurent dans le [journal des modifications pour les développeurs](./changelog.md).
