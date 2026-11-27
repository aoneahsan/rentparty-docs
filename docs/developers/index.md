---
title: Rent Party for developers
sidebar_label: Overview
sidebar_position: 1
description: Three ways to take your Rent Party record somewhere else, from a script with an access token, an AI assistant through MCP, or your own server through webhooks, and what none of them can ever do.
topics: [account]
last_update:
  date: 2026-11-19
---

Your games leave a trail: wins, ratings, badges, the saves you haven’t finished. This section is for taking that trail somewhere else. A spreadsheet of every game night. A bot in your group chat that posts the winner. An AI assistant that can tell you how your last ten games went.

There are three ways in, and you open each one yourself under **Settings → Other apps**.

## Which one do you need? {#which-one}

| You want to | Use | It can | Start here |
|---|---|---|---|
| Pull your stats and results into your own code | An access token and the API | Read what the token’s scopes allow | [Access tokens](./authentication.md), then [the API](./api.md) |
| Ask Claude, ChatGPT, Claude Code or Cursor about your games | The MCP server | Read what you approved on the consent page | [AI assistants](./mcp.md) |
| Hear about it the moment a game ends | Webhooks | Receive events, nothing more | [Webhooks](./webhooks.md) |

## What can it reach? {#what-it-reaches}

Your own records, and only yours:

- your profile and stats;
- the results of games that have finished;
- your badges and your rating over time;
- your saved games, which you can read and also remove.

That’s the whole list. Nothing here can roll a die, make a bid or touch a game that’s still on the table. The game itself stays the only one who moves pieces.

## What stays true whichever way you use? {#ground-rules}

- **Nothing’s open until you open it.** A new account has no token, no connected app and no webhook.
- **Removing is never implied.** Reading is one permission. Removing a saved game is a separate one, off until you tick it, and an AI assistant can’t remove anything until you confirm it inside Rent Party.
- **It’s your seat and nobody else’s.** Every request is answered as you, by the same rules the game uses. Another player’s private data is out of reach, and so is anything they haven’t made public.
- **You can see every way in.** Settings → Other apps lists every token, connected app and webhook, with when each was last used.

Turning on [two-step sign-in](./two-step-sign-in.md) guards all of it: showing a token again or approving a new connection then asks for a code.

## What changed lately? {#changes}

Every change to the API, the MCP server and webhooks goes in the [developer changelog](./changelog.md).
