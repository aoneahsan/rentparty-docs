---
title: Access tokens and sign-in for apps
sidebar_label: Access tokens
sidebar_position: 2
description: How your own code proves it may read your Rent Party records. Access tokens and their scopes, the 10-minute rule for seeing one again, expiry, OAuth for apps, rate limits and the error shape.
tags: [account]
last_update:
  date: 2026-11-19
---

An access token is a long secret your code sends with every request, as `Authorization: Bearer <token>`. You make it under **Settings → Other apps**, pick what it may read and when it runs out, and revoke it whenever you like. An app that connects for you uses OAuth instead, so you never hand it a token.

## How do you make a token? {#make-a-token}

1. Open **Settings → Other apps → Access tokens** and choose **New token**.
2. Name it so you’ll know it in a month. *Game-night spreadsheet* beats *token 1*.
3. Pick its scopes and how long it lasts.
4. The token shows once, with a copy button. Put it somewhere safe before you close the panel.

The list then shows each token’s name, scopes, first few characters, when it was made and when it was last used. Never the whole thing. You get an email every time a token is made, so one you didn’t make won’t slip past you.

## Can you see a token again? {#reveal}

Yes, within **10 minutes of signing in**. Choose **Reveal** on its row:

| When | What happens |
|---|---|
| You signed in under 10 minutes ago | The token shows. |
| You signed in longer ago | Rent Party says so and offers **Sign in again**, which brings you back to the same row. |
| Two-step sign-in is on | You also enter a code from your authenticator app, even inside the 10 minutes. |

Why the fuss? Staying signed in for weeks is handy, and it’s also exactly what a borrowed phone looks like. A fresh sign-in proves it’s you asking. Reveal works 10 times an hour, every reveal is noted on your account, and a token never travels by email.

## What do the scopes mean? {#scopes}

Every part of your record has a read scope. Saved games have one more:

| Scope | Lets the token |
|---|---|
| `<part>:read` | Read your profile and stats, finished game results, badges and rating history, or saved games |
| `saved_games:delete` | Remove one of your saved games |

There’s no scope that changes a game, a profile or a result. The exact scope names are in the [OpenAPI file](./api.md#reference).

**Removing is never implied.** Reading saved games doesn’t let a token remove them. The remove scope sits apart on the screen, off until you tick it. A token’s scopes never grow once it’s made: need more, make a new token and revoke the old one. No token can hold a team permission, ever.

## How long does a token last? {#expiry}

You pick **30, 90 or 365 days**. Rent Party emails you 7 days before it runs out. After that date, every request with it answers `401`.

## How do you replace or revoke a token? {#rotate-and-revoke}

- **Rotate** makes a new token. The old one keeps working for 24 hours while you swap it into your code, then it’s revoked. Both sit in the list until then.
- **Revoke** stops a token at once. The next request with it answers `401`. Press it twice to confirm. There’s no dialog.

Deleting your Rent Party account revokes every token, connected app and webhook along with it.

## How does an app connect without a token? {#oauth}

Through OAuth 2.1, the same sign-in an AI assistant uses. The app sends you to Rent Party’s consent page at `https://rentparty.aoneahsan.com/oauth/consent`, which shows:

- the app’s name, and the address it’ll send you back to;
- the Rent Party account it’s about to reach;
- what it’s asking for, in plain sentences, read and remove grouped apart, each with its own tick box, remove unticked;
- **Approve** and **Deny**, side by side.

With two-step sign-in on, Approve asks for a code. The app then shows under **Settings → Other apps → Connected apps**, where you can rename or revoke it. Revoking ends its access on its very next request. More on that page: [AI assistants](./mcp.md#consent).

## How many requests can you send? {#rate-limits}

Each token and each connected app gets **120 requests a minute**. Above that sits a daily total for your whole account, set by your plan. Every token and app you have shares it, so making more tokens doesn’t raise it. Settings → Other apps shows your plan’s numbers beside today’s count.

Every answer carries three headers:

| Header | Means |
|---|---|
| `RateLimit-Limit` | Requests allowed in this window |
| `RateLimit-Remaining` | Requests left in it |
| `RateLimit-Reset` | Seconds until the window starts over |

Go past the limit and you get `429` with a `Retry-After` header. Wait that many seconds, then try again.

Fire a pile of requests at the same instant and the hosting platform may answer `546` before Rent Party even sees them. Send them one after another, or a few at a time, and retry a `546` after a second.

## What does an error look like? {#errors}

Every error, on every route, has one shape:

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

Program against `code`. The `message` is for people and may change its wording. Writing to us about a failed request? Quote the `correlation_id`. It’s how we find that one request, and nothing else.

| Status | Usually means |
|---|---|
| `401` | No token, a wrong one, or one that’s revoked or expired |
| `403` | The token lacks a scope (`details` names it), or a fresh sign-in is needed |
| `404` | Nothing with that id in your record, and that includes anything that’s someone else’s |
| `429` | Rate limit reached. See `Retry-After` |

The full list of codes is in the [OpenAPI file](./api.md#reference).
