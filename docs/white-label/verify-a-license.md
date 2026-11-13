---
title: Verify a license
sidebar_label: Verify a license
description: How to check whether a white-label Rent Party is licensed, by its license key or by the domain it runs on, and what each answer means.
tags: [white-label]
sidebar_position: 5
last_update:
  date: 2026-11-13
---

Anyone can check a white-label Rent Party on the [Check a license page](https://rentparty.aoneahsan.com/verify-license). Verification is run by our licensing service.

## How do I check by key? {#by-key}

Enter the license key. Keys start with `RENTPARTY-WL-`. The answer says whether the license is active, being set up or revoked, and shows its public details: who holds it, its domains, its platforms and when its updates end. It never shows an email or a price.

## How do I check by domain? {#by-domain}

Enter the domain, like `play.yourbrand.com`. Every licensed deployment serves a license file at `/.well-known/rentparty-white-label-license.json`, and the check reads that file and the license it names.

## What do the answers mean? {#answers}

| Answer | Meaning |
|---|---|
| Active | The license is valid. |
| Being set up | The license is issued and its deployment isn't live yet. |
| Revoked | The license was ended for use outside its terms. |
| Domain not covered | The domain has a license file, but its license doesn't cover that domain. |
| No license file | The domain serves no Rent Party license file. |
