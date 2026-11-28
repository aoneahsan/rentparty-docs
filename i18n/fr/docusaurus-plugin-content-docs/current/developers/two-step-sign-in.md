---
title: "Connexion en deux étapes"
sidebar_position: 6
description: "Protégez votre compte Rent Party avec une application d'authentification, des codes de secours et, si vous le souhaitez, un navigateur mémorisé pendant 7 jours."
topics: [account]
last_update:
  date: 2026-11-19
---

Après votre connexion avec Google, la connexion en deux étapes demande un code à six chiffres produit par une application d'authentification. Même si une autre personne accède à votre compte Google, elle ne pourra pas prendre votre place, vos pièces ou vos sauvegardes sans ce code. Vous choisissez de l'activer pour votre compte. Les comptes administrateurs Rent Party, eux, doivent l'utiliser.

## Comment l'activer ? {#turn-on}

1. Ouvrez **Paramètres → Sécurité → Connexion en deux étapes**.
2. Scannez le code QR avec une application telle que Google Authenticator, Microsoft Authenticator, 1Password ou Bitwarden, ou toute autre application qui produit des codes à six chiffres. Si le scan échoue, saisissez la clé affichée sous le code.
3. Saisissez le code affiché par votre application. Lorsque Rent Party l'accepte, la protection est active.

## À quoi servent les codes de secours ? {#recovery-codes}

L'activation affiche **10 codes de secours**, une seule fois. Ils permettent d'accéder à votre compte si vous perdez votre téléphone. Téléchargez-les ou conservez-en une copie ailleurs que sur ce téléphone.

- Chaque code remplace une fois le code de l'application.
- La connexion en deux étapes reste active après l'utilisation d'un code de secours. Un nouveau code est demandé à la connexion suivante.
- **Créer de nouveaux codes** remplace toute la série et invalide les anciens. Un code actuel est requis avant cette opération.

## Que fait « Mémoriser ce navigateur » ? {#remember-browser}

Après avoir saisi un code, vous pouvez cocher **Mémoriser ce navigateur pendant 7 jours**. La case est décochée au départ.

| Votre choix | À la prochaine connexion |
|---|---|
| Case décochée | Rent Party redemande un code. |
| Case cochée | Ce navigateur, sur cet appareil, ne demande pas de code pendant 7 jours. Les autres navigateurs et appareils en demandent toujours un. |

La déconnexion met fin à cette confiance pour ce navigateur. **Paramètres → Sécurité → Navigateurs de confiance** les liste tous, avec les dates de mémorisation et d'expiration. **Oublier** en retire un, **Tout oublier** les retire tous ; désactiver la connexion en deux étapes les oublie également.

Même mémorisé, un navigateur demande un code pour révéler un jeton d'accès ou un secret de webhook, modifier la connexion en deux étapes et accéder à l'administration.

## Quelles autres actions demandent un code ? {#other-codes}

- **Réafficher un jeton ou un secret.** Voir [Jetons d'accès](./authentication.md#reveal).
- **Approuver une nouvelle application ou un assistant IA** sur la page de consentement. Voir [Assistants IA](./mcp.md#consent).
- **Désactiver la connexion en deux étapes.** Un code actuel est nécessaire.

## J'ai perdu mon téléphone et mes codes : que faire ? {#lost-everything}

Écrivez-nous depuis [Aide](https://rentparty.aoneahsan.com/help). Avant de désactiver cette protection, l'équipe vérifie que le compte vous appartient. Cette procédure prend volontairement plus de temps qu'un code de secours : elle doit aussi résister à une demande faite par un inconnu.

## Les administrateurs doivent-ils l'utiliser ? {#admins}

Oui. L'accès aux écrans d'administration exige un code saisi pendant la session ; un navigateur mémorisé ne suffit pas.
