# AGENTS.md — Rent Party public docs

**Last Updated:** 2026-10-20

| Context record | Value |
|---|---|
| Last optimized | 2026-10-20 |
| Next routine optimization eligible | 2026-11-19 |
| Guide bytes | 4726 B |

The `AGENTS.md` and `CLAUDE.md` pair are mirrors except for the first heading. Update both together.

## Repository boundary

This public repository is `aoneahsan/rentparty-docs`, branch `main`, remote `o`. It builds [rentparty-docs.aoneahsan.com](https://rentparty-docs.aoneahsan.com) with Docusaurus and GitHub Pages. The private game code is the sibling `../monopoly/` checkout and is never edited from a docs task.

Use the product's published pages and approved screens as facts. The approved voice, glossary, and public-surface rules live in `../docs/story/`. Never invent a feature, number, limit, quote, plan fact, or service behavior.

## Commands and done condition

Use the Yarn version pinned in `package.json`.

```bash
yarn install --immutable
yarn typecheck
yarn build
yarn serve
```

A docs change is ready only when typecheck and build pass without errors, the exact build has been read in controlled Chrome at desktop and phone widths in light and dark themes, links and anchors work, and `git diff --check` passes. A push to `main` runs `.github/workflows/deploy-pages.yml`; verify the Actions run and representative live routes after pushing.

## Content contract

- Every statement about the game must match the game's published pages or approved screens. Link to changing plan prices and limits instead of copying them.
- Plans and legal pages summarize and link to the product legal pages. No sentence about refunds appears in docs, pricing, checkout, or plan copy.
- Card payments are handled by “our payment partner” except where an already-approved legal surface names a processor.
- The docs speak as the Rent Party team. Do not use a personal byline or another board game's brand, streets, tokens, or card names.
- Every docs page has `title`, `description`, and `tags` front matter, answer-first question headings with explicit IDs, and relative links between docs pages. Follow `CONTRIBUTING.md`.
- `docs/MANUAL-TASKS.md` and `docs/story/**` remain excluded from published docs in `docusaurus.config.ts`.
- Public prose follows the approved Story Bible and content map. New or rewritten surfaces use the story workflow and its owner gates.

## Site and deployment contract

- `static/CNAME` contains exactly `rentparty-docs.aoneahsan.com`; `docusaurus.config.ts` uses the same canonical URL and `/` base path.
- `.github/workflows/deploy-pages.yml` is the only deploy workflow. Do not add another host or deploy script.
- `plugins/site-pages.ts` generates `/sitemap`, `/feed`, and `feed.xml`; it gives sitemap entries their last-modified date. `src/theme/BlogListPage` supplies the blog list's missing `<h1>` and must be checked after Docusaurus upgrades.
- Analytics stays disabled while `.env.example` IDs are empty. Enabling analytics requires the approved first-visit notice in the same change.
- Never commit an `.env`, key, token, password, product secret, private product source, or private operational record.
- The owner maintains `main` directly. Other contributors use forks and pull requests. Never force-push or weaken branch protection.
<!-- RULE:stop-work-git-gate v2026-10-20 -->
- **Stop-work Git gate:** Before ending any work session, audit the coordination root, `monopoly/`, and
  `rentparty-docs/`. Commit every legitimate change in its owning repository, push its designated branch to `o`,
  then verify all three worktrees are clean and each branch is 0 ahead and 0 behind. Never leave intended work only
  on disk; if a push is impossible, do not call the task complete and report the exact blocker.

## Route by task

| Need | Read |
|---|---|
| Writing, front matter, links, contribution flow | `CONTRIBUTING.md` |
| Site metadata, navigation, plugins | `docusaurus.config.ts` · `sidebars.ts` |
| Generated sitemap/feed behavior | `plugins/site-pages.ts` |
| Theme and components | matching file under `src/` |
| Player facts | matching published product page, then the smallest page in `docs/` |
| Product voice and names | `../docs/story/story-bible.md` · `voice-fingerprint.md` · `content-map.md` |
| Restore and ownership | `../RESTORE.md` |

Do not load generated `.docusaurus/` or `build/`, dependencies, or every docs page for orientation.

## Context record

Pass 1 audited repository root, docs, blog, plugins, theme/source, static files, workflow, and build output. The workspace + coordination root + docs guide chain remains below 32 KiB. Skip routine context optimization before 2026-11-19 unless the tree changes materially or a proven stale instruction risks incorrect work.
