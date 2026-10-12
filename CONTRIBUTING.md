# Contributing to the Rent Party docs

Thanks for helping. This repository is the source of [rentparty-docs.aoneahsan.com](https://rentparty-docs.aoneahsan.com), the player docs for Rent Party. Every change here ends up on the public site, so this guide covers how to report a problem, how the site is built, the writing rules every page follows, and how a pull request gets merged.

**🧭 Contents**

- [Ways to help](#ways-to-help)
- [Reporting a problem](#reporting-a-problem)
- [How this repository is governed](#how-this-repository-is-governed)
- [Setting up locally](#setting-up-locally)
- [How the site is organized](#how-the-site-is-organized)
- [Writing a page](#writing-a-page)
- [Voice and words](#voice-and-words)
- [Checking your change](#checking-your-change)
- [Pull requests](#pull-requests)
- [Becoming a contributor](#becoming-a-contributor)
- [What never goes in this repository](#what-never-goes-in-this-repository)
- [Getting help](#getting-help)
- [Supporting the team](#supporting-the-team)
- [Code of conduct](#code-of-conduct)

<a id="ways-to-help"></a>
## 🙌 Ways to help&nbsp;[#](#ways-to-help)

- **Fix a mistake.** A page says something the game doesn't do, a link is broken, or a sentence trips you up.
- **Fill a gap.** Players keep asking something the docs don't answer.
- **Make a page clearer.** Shorter sentences, a better example, a table instead of a paragraph.

This repository holds the docs only. The game's own code isn't here, so:

- a problem with a game, your account or a plan goes to the game's [Help page](https://rentparty.aoneahsan.com/help);
- an idea for the game itself goes there too, under "An idea".

<a id="reporting-a-problem"></a>
## 🐞 Reporting a problem&nbsp;[#](#reporting-a-problem)

[Open an issue](https://github.com/aoneahsan/rentparty-docs/issues/new/choose) and pick the form that fits:

| Form | Use it when |
|---|---|
| Something in the docs is wrong | A page disagrees with the game, a link is broken, or a sentence is unclear. |
| Something is missing from the docs | You looked for an answer and couldn't find it here. |

Give the page's address and quote the sentence when you can. "The Jail section says 2 tries, the game gives 3" is quicker to fix than "Jail is wrong".

<a id="how-this-repository-is-governed"></a>
## 🛡️ How this repository is governed&nbsp;[#](#how-this-repository-is-governed)

- **`main` is protected.** A ruleset blocks deleting the branch and force-pushing to it.
- **The Rent Party team maintains `main`** and pushes to it directly.
- **Everyone else contributes through a fork and a pull request.** That needs no access, and [Pull requests](#pull-requests) has the steps.
- **Every push to `main` redeploys the site**, through `.github/workflows/deploy-pages.yml`.

<a id="setting-up-locally"></a>
## 💻 Setting up locally&nbsp;[#](#setting-up-locally)

You need Node.js 20 or newer and Corepack, which ships with Node and provides the Yarn version pinned in `package.json`.

```bash
corepack enable
yarn install
yarn start
```

| Command | What it does |
|---|---|
| `yarn start` | Serves the site locally and reloads as you edit. |
| `yarn build` | Builds the production site into `build/`. It fails on any broken link, anchor, image or unknown tag. |
| `yarn serve` | Serves the last build, to check it the way visitors will see it. |
| `yarn typecheck` | Type-checks `docusaurus.config.ts`, `sidebars.ts`, the local plugin in `plugins/` and the components in `src/`. |
| `yarn clear` | Clears Docusaurus's caches when a build behaves oddly. |

This repository uses Yarn only. Please don't commit a `package-lock.json` or `pnpm-lock.yaml`.

<a id="how-the-site-is-organized"></a>
## 🗂️ How the site is organized&nbsp;[#](#how-the-site-is-organized)

| Path | Holds |
|---|---|
| `docs/intro.md` | Getting started, the site's home page. |
| `docs/how-to-play/` | The rules, house rules, pausing, the CPU characters and the names list. `_category_.json` sets the folder's label, position and index page. |
| `docs/*.md` | Online play, your account, plans and pricing, help, and privacy and terms. |
| `docs/tags.yml` | Every tag a page may use. |
| `docs/MANUAL-TASKS.md` | The maintainers' checklist of publishing steps. The site's settings leave it out of the build, so it is never a page. |
| `blog/` | What's-new posts. Every post is signed by `team` from `blog/authors.yml`. |
| `src/css/custom.css` | The theme. |
| `static/` | Files served as they are: `CNAME`, `robots.txt`, `llms.txt`, the logo. |
| `docusaurus.config.ts` | Site settings, search, feeds and the sitemap. |

The sidebar builds itself from the folders: a page's place comes from its `sidebar_position`, and a folder's from its `_category_.json`. A new page needs no sidebar edit.

<a id="writing-a-page"></a>
## ✍️ Writing a page&nbsp;[#](#writing-a-page)

Every page starts with front matter like this:

```yaml
---
title: How sealed bids work
description: One or two sentences that say what the page answers. This is the search snippet and the page's description.
sidebar_position: 3
tags: [online]
---
```

- **`title` and `description` are required.** Without them a page has no useful search snippet.
- **`tags` come from `docs/tags.yml` only.** The build fails on a tag that isn't defined there; add it to the file first if a new one is needed.
- **Headings are the questions players ask**, in sentence case: "How does Jail work?", not "Jail mechanics". Never skip a level.
- **Every second-level heading carries an explicit id**, like `## How does Jail work? {#jail}`, so links to it survive when the wording changes.
- **Answer first.** The first sentence under a heading answers it; the detail follows.
- **Link between docs pages with relative file links**, like `[Jail](./rules.md#jail)`, so the build can check them. Link into the game with its full address, like `https://rentparty.aoneahsan.com/help`.
- **Numbers the team can change stay on the game's pages.** Prices and plan limits are never copied here; link to [Pricing](https://rentparty.aoneahsan.com/pricing) instead. A page that quotes a game setting, such as a turn timer, carries the "Numbers on this page" note that links to the game's own page.
- **Anything you can list goes in a table**, and notes use Docusaurus admonitions such as `:::note[Title]`.

<a id="voice-and-words"></a>
## 🗣️ Voice and words&nbsp;[#](#voice-and-words)

The docs sound like the game: a warm host and a fair referee. In practice:

- **Talk to the reader.** Second person, contractions, short sentences. US spelling. At most one exclamation mark on a page, and only for a real game moment.
- **Write numbers in digits** inside the game: 3 houses, 200 bucks.
- **Rent Party is two words**, both capitalized.
- **Use the game's own names.** Street, deed, station, utility, Start, Jail, just passing by, Town Square, Go to jail, Lucky Break, Neighborhood Mail, Jail pass, bucks, coins and CPU characters. The [names page](https://rentparty-docs.aoneahsan.com/how-to-play/names) lists them.
- **Never use another board game's names**: its brand, its streets, its tokens or its card decks.
- **No gambling words.** Bucks are play money; never bet, wager, jackpot or cash out.
- **Say earn or collect**, never unlock. The computer opponents are CPU characters, never bots.
- **The docs speak as the Rent Party team**, never as one person. No personal names on pages, in posts or in bylines.
- **Plan and payment pages state facts** and link to the game's Pricing and Terms pages. They never restate the Terms, and they never add warnings or conditions of their own.
- **A card payment goes through "our payment partner".** The docs don't name the company; the game's Terms and Privacy pages do.
- **Every claim must match the game.** Don't describe a feature, number or limit the game doesn't have. Unsure? Ask in the issue before writing it.

<a id="checking-your-change"></a>
## ✅ Checking your change&nbsp;[#](#checking-your-change)

1. Run `yarn build`. It must finish with no errors and no warnings. It is the link checker, so a broken link, a missing anchor, an unknown tag or a blog post without a `<!-- truncate -->` marker fails it.
2. Run `yarn serve` and read the page in the built site, in light and dark mode, at a phone width and a desktop width.
3. Search for a word from your change with the search box, to confirm the page is found.

<a id="pull-requests"></a>
## 🔀 Pull requests&nbsp;[#](#pull-requests)

1. Fork the repository and branch from `main`.
2. Keep each pull request to one topic: a fix, a new answer or one page's rewrite.
3. Write commit messages as [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): a type, a colon, then what changed, like `docs: fix the Jail exit rule on the rules page`. Use `docs` for page content, `fix` for something broken on the site and `chore` for upkeep.
4. In the pull request, say what changed and why, and link the issue it closes.
5. The team reviews every pull request. Once it's merged, the site redeploys from `main` on its own.

<a id="becoming-a-contributor"></a>
## 🔑 Becoming a contributor&nbsp;[#](#becoming-a-contributor)

- **Fork and open a pull request.** Anyone can, and it needs no access. This is how most changes arrive.
- **Ask for collaborator access** if you plan to help regularly. [Open an issue](https://github.com/aoneahsan/rentparty-docs/issues/new/choose), pick the "Contributor access request" form and say what you'd like to work on. The team decides each request.

Collaborators send their changes as pull requests too.

<a id="what-never-goes-in-this-repository"></a>
## 🔒 What never goes in this repository&nbsp;[#](#what-never-goes-in-this-repository)

This repository is public, so anything committed here is public at once, and deleting it later doesn't take it back.

- **No secrets.** No `.env` file, keys, tokens or passwords. `.env.example` lists the optional settings with empty values; real values live only in the repository's Actions secrets.
- **No personal data**, yours or anyone else's.
- **No internal notes or plans.** The docs describe the game as it is.

<a id="getting-help"></a>
## 💬 Getting help&nbsp;[#](#getting-help)

- Questions about a game, your account or a plan: the game's [Help page](https://rentparty.aoneahsan.com/help).
- Questions about these docs or this guide: [open an issue](https://github.com/aoneahsan/rentparty-docs/issues/new/choose).

<a id="supporting-the-team"></a>
## 💖 Supporting the team&nbsp;[#](#supporting-the-team)

Like the docs? You can support the Rent Party team at [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=rent-party&project-identifier=com.aoneahsan.rentparty).

<a id="code-of-conduct"></a>
## 🤝 Code of conduct&nbsp;[#](#code-of-conduct)

Be kind and assume good intent. The rules for what you can say in the game's names, rooms and chat, in the [Terms](https://rentparty.aoneahsan.com/terms), apply to issues and pull requests here too. The team may close or lock anything that breaks them.
