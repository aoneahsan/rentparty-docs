---
title: Two-step sign-in
sidebar_position: 6
description: Turn on two-step sign-in for your Rent Party account with an authenticator app, keep your recovery codes safe, choose whether to remember a browser for 7 days, and what to do if you lose your phone.
topics: [account]
last_update:
  date: 2026-11-19
---

Two-step sign-in asks for a six-digit code from an authenticator app after you sign in with Google. If someone gets into your Google account, they still can’t take your seat, your coins or your saves without your phone. It’s your choice for your own account. The Rent Party team doesn’t get that choice: two-step is required on every admin account.

## How do you turn it on? {#turn-on}

1. Open **Settings → Security → Two-step sign-in**.
2. Scan the QR code with an authenticator app: Google Authenticator, Microsoft Authenticator, 1Password, Bitwarden, or any other that makes six-digit codes. Can’t scan? Type in the key shown under the code.
3. Enter the code your app shows. Once Rent Party accepts it, two-step is on.

## What are recovery codes for? {#recovery-codes}

Turning it on shows **10 recovery codes**, once. They’re your spare key for the day your phone goes missing. Download them, or copy them somewhere that isn’t your phone.

- Each code signs you in once, in place of a code from your app.
- Two-step stays on after you use one. The next sign-in asks for a code again.
- **Make new codes** replaces the whole set, and the old ones stop working. It asks for a current code first.

## What does “Remember this browser” do? {#remember-browser}

After you enter a code, the sign-in screen offers **Remember this browser for 7 days**. It starts unticked, and it stays that way unless you tick it.

| You leave it | Next time you sign in |
|---|---|
| Unticked | Rent Party asks for a code again. |
| Ticked | This browser on this device skips the code for 7 days. Any other browser or device still asks. |

Signing out ends it for that browser. **Settings → Security → Trusted browsers** lists every remembered browser, when it was remembered and when that runs out. **Forget** ends one, **Forget all** ends every one, and turning two-step off forgets them all.

A remembered browser still asks for a code to show an access token or a webhook secret, to change two-step sign-in itself, and to open the admin screens.

## Where else does it ask for a code? {#other-codes}

- **Showing a token or a secret again.** See [Access tokens](./authentication.md#reveal).
- **Approving a new app or AI assistant** on the consent page. See [AI assistants](./mcp.md#consent).
- **Turning two-step off.** It takes a current code to remove it.

## Lost your phone and your codes? {#lost-everything}

Write to us from [Help](https://rentparty.aoneahsan.com/help). Before switching two-step off on an account, the team checks that the account really is yours. That takes longer than a recovery code, on purpose: it’s the same check a stranger would have to get past.

## Do admins have to use it? {#admins}

Yes. Nobody opens Rent Party’s admin screens without a code entered in that session, and a remembered browser doesn’t count there.
