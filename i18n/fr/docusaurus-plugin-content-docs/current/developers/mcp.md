---
title: "Connecter un assistant IA (MCP)"
sidebar_label: "Assistants IA (MCP)"
sidebar_position: 4
description: "Connectez Claude, ChatGPT, Claude Code ou Cursor à vos données Rent Party grâce au serveur MCP. Adresse, consentement, suppression et déconnexion."
topics: [account]
last_update:
  date: 2026-11-19
---

Le serveur MCP Rent Party permet à un assistant IA de lire vos données lorsque vous le lui demandez. *« Combien de mes dix dernières parties ai-je gagnées ? »* *« Quelles sauvegardes n'ai-je pas touchées depuis un mois ? »* Donnez-lui une adresse, connectez-vous à Rent Party et choisissez sur la page de consentement ce qu'il peut consulter. Il fonctionne avec Claude, ChatGPT, Claude Code, Cursor et tout autre assistant compatible MCP.

## Quelle est l'adresse ? {#address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp
```

Vous la trouverez aussi sous **Paramètres → Autres applications → Connecter un assistant IA**, avec un bouton de copie. Ne collez jamais de jeton dans un assistant : cette adresse lui permet de trouver la connexion Rent Party et de vous y envoyer.

## Comment connecter chaque assistant ? {#connect}

Les menus de ces applications peuvent changer. Si une étape ne correspond pas à votre écran, cherchez **Connectors** dans leurs paramètres.

### Claude {#claude}

1. Dans Claude, ouvrez **Settings → Connectors** et ajoutez un connecteur personnalisé.
2. Collez l'adresse ci-dessus.
3. Connectez-vous à Rent Party, puis approuvez l'accès sur la page de consentement.

### ChatGPT {#chatgpt}

1. Dans ChatGPT, ouvrez **Settings → Connectors**. Certains comptes doivent d'abord activer le mode développeur.
2. Ajoutez un connecteur avec l'adresse ci-dessus.
3. Connectez-vous à Rent Party, puis approuvez l'accès sur la page de consentement.

### Claude Code {#claude-code}

```bash
claude mcp add --transport http rentparty https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp
```

Lancez ensuite `/mcp` dans Claude Code, choisissez **rentparty** et connectez-vous dans la fenêtre de navigateur qui s'ouvre.

### Cursor {#cursor}

Ajoutez Rent Party à votre fichier `mcp.json` :

```json
{
  "mcpServers": {
    "rentparty": {
      "url": "https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp"
    }
  }
}
```

Cursor vous demande de vous connecter lors de la première utilisation.

## Que demande la page de consentement ? {#consent}

Avant de transmettre quoi que ce soit, Rent Party affiche à `https://rentparty.aoneahsan.com/oauth/consent` :

- **l'application qui demande l'accès** et l'adresse où elle vous renverra ;
- **le compte Rent Party concerné**, à vérifier si vous avez plusieurs comptes Google ;
- **les actions autorisées**, décrites clairement, avec lecture et suppression séparées et une case pour chacune. La suppression est décochée au départ ;
- **Approuver** et **Refuser**, côte à côte.

Si la [connexion en deux étapes](./two-step-sign-in.md) est active, l'approbation exige un code. Rien n'est approuvé à votre place ; chaque nouvelle connexion passe par cette page.

L'assistant ne reçoit que les outils correspondant aux cases cochées. Autoriser uniquement la lecture ne lui donne aucun moyen de supprimer une donnée.

## Comment la suppression d'une sauvegarde fonctionne-t-elle ? {#removing}

Un assistant peut **préparer** une suppression. Vous seul pouvez **la confirmer**. Si vous lui demandez d'effacer une ancienne sauvegarde, il indique la partie concernée et vous donne un lien vers Rent Party. Confirmez dans les dix minutes ; sinon, la sauvegarde reste intacte.

Ainsi, une phrase cachée dans une page Web ou un message collé ne peut pas pousser l'assistant à effacer vos sauvegardes : il ne peut pas confirmer sa propre demande.

Sans la permission de suppression cochée sur la page de consentement, il ne peut même pas préparer cette opération.

## Comment déconnecter un assistant ? {#disconnect}

Ouvrez **Paramètres → Autres applications → Applications connectées** et choisissez **Révoquer** sur sa ligne. L'accès prend fin dès sa prochaine requête. La liste indique les permissions, la date de connexion et la dernière utilisation de chaque application ; une nouvelle connexion y apparaît immédiatement après votre approbation. Rent Party vous envoie aussi un e-mail lorsqu'une application se connecte.

## Pourquoi cela ne fonctionne-t-il pas ? {#troubleshooting}

| Ce que vous voyez | Que faire |
|---|---|
| L'assistant demande une nouvelle connexion | Sa session a expiré. Reconnectez-vous à Rent Party depuis l'assistant. |
| Il indique une permission manquante | Déconnectez-le, reconnectez-le et cochez la permission sur la page de consentement. |
| Rent Party a disparu de ses outils ou toutes les requêtes échouent | L'accès a été révoqué. Vérifiez **Applications connectées**, puis reconnectez-le si vous le souhaitez. |
| Une sauvegarde annoncée comme supprimée est encore là | La demande n'a pas été confirmée dans Rent Party sous dix minutes. Recommencez. |
| Vous voulez savoir quand il a servi | **Applications connectées** indique la dernière utilisation de chaque application. |
