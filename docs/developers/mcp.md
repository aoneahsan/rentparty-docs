---
title: Connect an AI assistant (MCP)
sidebar_label: AI assistants (MCP)
sidebar_position: 4
description: Connect Claude, ChatGPT, Claude Code or Cursor to your Rent Party records through the MCP server. The address, what the consent page asks, how removing a saved game is confirmed, and how to disconnect.
tags: [account]
last_update:
  date: 2026-11-19
---

:::warning[Not switched on yet (19 November 2026)]

The MCP server arrives with an upcoming Rent Party release. The address below won’t answer until then.

:::

The Rent Party MCP server lets an AI assistant read your records when you ask. *“How many of my last ten games did I win?”* *“Which saved games haven’t I touched in a month?”* Give the assistant one address, sign in to Rent Party, and choose on the consent page what it may see. It works with Claude, ChatGPT, Claude Code, Cursor and any other assistant that speaks MCP.

## What’s the address? {#address}

```text
https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp
```

It’s also under **Settings → Other apps → Connect an AI assistant**, with a copy button. You never paste a token into an assistant. It finds Rent Party’s sign-in from this address and sends you there.

## How do you connect each assistant? {#connect}

These apps move their menus around between releases. If a step doesn’t match your screen, look for **Connectors** in the app’s settings.

### Claude {#claude}

1. In Claude, open **Settings → Connectors** and add a custom connector.
2. Paste the address above.
3. Sign in to Rent Party when asked, then approve on the consent page.

### ChatGPT {#chatgpt}

1. In ChatGPT, open **Settings → Connectors**. Some accounts need developer mode on first.
2. Add a connector with the address above.
3. Sign in to Rent Party when asked, then approve on the consent page.

### Claude Code {#claude-code}

```bash
claude mcp add --transport http rentparty https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp
```

Then run `/mcp` inside Claude Code, choose **rentparty**, and sign in in the browser window it opens.

### Cursor {#cursor}

Add Rent Party to your `mcp.json`:

```json
{
  "mcpServers": {
    "rentparty": {
      "url": "https://bgajltrjcqnchwhewouc.supabase.co/functions/v1/mcp"
    }
  }
}
```

Cursor asks you to sign in the first time it uses it.

## What does the consent page ask? {#consent}

Before an assistant sees anything, Rent Party shows you, at `https://rentparty.aoneahsan.com/oauth/consent`:

- **which app is asking**, and the address it’ll send you back to;
- **which Rent Party account** it’s about to reach, worth a look if you have more than one Google account;
- **what it may do**, in plain sentences, read and remove grouped apart, each with its own tick box. Remove starts unticked;
- **Approve** and **Deny**, side by side.

With [two-step sign-in](./two-step-sign-in.md) on, Approve asks for a code. Nothing gets approved for you. Every new connection comes through this page.

The assistant only gets the tools your ticks allow. Tick read alone and it has no way to remove anything.

## How is removing a saved game handled? {#removing}

An assistant can **line up** a removal. Only you can **carry it out**. Ask it to clear an old save and it shows you which game would go, with a link into Rent Party. Confirm there within 10 minutes, or the save stays put.

That’s also why a sentence buried in a web page or a pasted message can’t talk the assistant into clearing your saves: it can’t confirm its own request.

Without the remove permission ticked on the consent page, the assistant can’t even line one up.

## How do you disconnect an assistant? {#disconnect}

Open **Settings → Other apps → Connected apps** and choose **Revoke** on its row. Its access ends on the next request it makes. The list shows each app’s permissions, when it connected and when it was last used, and a new one appears the moment you approve it. Rent Party also emails you whenever an app connects.

## Why isn’t it working? {#troubleshooting}

| You see | What to do |
|---|---|
| The assistant wants you to sign in again | Its sign-in ran out. Sign in to Rent Party again from the assistant. |
| It says it’s missing a permission | It wasn’t given that one. Disconnect, reconnect, and tick it on the consent page. |
| Rent Party is gone from its tools, or every call fails | It was revoked. Check **Connected apps**, then reconnect if you want it back. |
| A saved game it said it would clear is still there | It wasn’t confirmed in Rent Party within 10 minutes. Ask again. |
| You want to know what it’s been up to | **Connected apps** shows when each app was last used. |
