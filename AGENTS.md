# AGENTS.md · Rent Party docs

This guide exists twice at the repository root, as two mirrored files: only line 1 differs. Change both in the same commit.

**Last Updated:** 2026-10-12

## What this repository is

The source of [rentparty-docs.aoneahsan.com](https://rentparty-docs.aoneahsan.com), the player docs for Rent Party: a Docusaurus site published to GitHub Pages. This repository is public.

It is not the game. The game's code lives elsewhere, and nothing here builds or changes it. The game runs at [rentparty.aoneahsan.com](https://rentparty.aoneahsan.com).

## Commands

Yarn only, at the version pinned in `package.json`. Run `corepack enable` once.

| Command | What it does |
|---|---|
| `yarn install --immutable` | Installs exactly what `yarn.lock` records. |
| `yarn typecheck` | Type-checks `docusaurus.config.ts`, `sidebars.ts`, the local plugin in `plugins/` and the components in `src/`. |
| `yarn build` | Builds the site into `build/`. It is also the link checker, and it must end with no error and no warning. |
| `yarn serve` | Serves the last build, to read it the way a visitor will. |
| `yarn clear` | Clears Docusaurus's caches. |

A change is done once it builds, and the changed page has been read in the served build, in light and dark, at a phone width and a desktop width.

## Content rules that bind every edit

- **Approved words only.** Every sentence about the game comes from the game's own published pages (How to play, Pricing, Help, Privacy, Terms, Permissions, Delete account) and its own screens. Describe nothing the game doesn't do, and invent no number, limit or feature.
- **Numbers the team can change stay on the game's pages.** Never copy a price or a plan limit; link to the game's Pricing page.
- **Plans and legal pages summarize and link out.** They never restate the Terms or the Privacy page.
- **No sentence about refunds on any docs page.** A page may link to the Terms and say nothing more.
- **Nothing that reads as a warning beside a description of paying.** Plan pages state facts.
- **A card payment goes through "our payment partner".** The docs never name the company.
- **The docs speak as the Rent Party team**, never as one person: no personal name on a page, in a post or in a byline.
- **No other board game's names**: not its brand, its streets, its tokens or its card decks. Use the game's own words, which the docs' names page lists.
- **Every page carries `title`, `description` and `tags` front matter**, question headings with explicit ids, and relative links between docs pages.

[CONTRIBUTING.md](./CONTRIBUTING.md) is the full writing guide.

## The standard this repository keeps

- `static/CNAME` holds exactly `rentparty-docs.aoneahsan.com`, and `url` in `docusaurus.config.ts` matches it.
- One workflow, `.github/workflows/deploy-pages.yml`, builds and deploys the site. There is no other host and no other deploy script.
- The docs plugin's `exclude` list in `docusaurus.config.ts` restates the defaults and adds `MANUAL-TASKS.md` and `story/**`, so `docs/MANUAL-TASKS.md` is never a page. Keep both entries.
- No secret ever enters this repository: no `.env` file, key, token or password. `.env.example` lists the optional settings with empty values, and a build never needs one.
- `plugins/site-pages.ts` builds `/sitemap` and `/feed` from the docs and posts, writes `/feed.xml` as a copy of `blog/rss.xml`, and gives every `sitemap.xml` URL a lastmod. `src/theme/BlogListPage` is ejected only to give the blog list its one `<h1>` (the theme draws none); recheck it on every Docusaurus upgrade.
- A ruleset protects `main` against deletion and force-pushes. The Rent Party team pushes to it directly, and everyone else contributes through a fork and a pull request.

## How it deploys

A push to `main` runs the workflow, which builds the site and publishes it to GitHub Pages. Nothing else deploys it.

## Analytics and the first-visit notice

Analytics is off: both IDs in `.env.example` stay unset, so no analytics script loads. The site has no account and shows no first-visit legal notice. Switching analytics on requires the first-visit legal notice bar in the same change: one quiet bar at the foot of the page, shown once, never a dialog.
