---
title: "Vérifier une licence"
sidebar_label: "Vérifier une licence"
description: "Vérifiez la licence d'une version en marque blanche de Rent Party par sa clé ou son domaine, et comprenez chaque réponse."
topics: [white-label]
sidebar_position: 5
last_update:
  date: 2026-11-13
---

Tout le monde peut vérifier une version en marque blanche de Rent Party sur la [page de vérification des licences](https://rentparty.aoneahsan.com/verify-license). Notre service de licences effectue cette vérification.

## Comment vérifier une clé ? {#by-key}

Saisissez la clé de licence. Elle commence par `RENTPARTY-WL-`. Le résultat indique si la licence est active, en cours de mise en place ou révoquée. Il affiche ses informations publiques : titulaire, domaines, plateformes et date de fin des mises à jour. Il n'affiche ni adresse e-mail ni prix.

## Comment vérifier un domaine ? {#by-domain}

Saisissez le domaine, par exemple `play.yourbrand.com`. Chaque version sous licence publie un fichier à l'adresse `/.well-known/rentparty-white-label-license.json`. La vérification lit ce fichier et la licence qu'il désigne.

## Que signifient les réponses ? {#answers}

| Réponse | Signification |
|---|---|
| Active | La licence est valide. |
| En cours de mise en place | La licence a été délivrée, mais sa version n'est pas encore en ligne. |
| Révoquée | La licence a pris fin à cause d'un usage contraire à ses conditions. |
| Domaine non couvert | Le domaine publie un fichier de licence, mais cette licence ne couvre pas ce domaine. |
| Aucun fichier de licence | Le domaine ne publie aucun fichier de licence Rent Party. |
