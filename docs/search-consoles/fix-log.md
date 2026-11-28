# Search-console fix log — rentparty-docs

Fixed path in every repo (`aoneahsan-cccs-search-issue-remediation`). Newest first. Not published: excluded in
`docusaurus.config.ts`. The audit session retests with the commands under **Retest**.

## 2026-11-28 source pass for rentparty-docs#1

The eleven comparison guides now each link to a relevant peer, so each has the hub plus a contextual inbound
route. The competitors' own pricing and feature pages were refreshed on 2026-11-27 in the shared data; the old
11-07 refresh warning below is historical. The docs home, account, online play, first-game guide, help, apps,
licensing pages and API reference now link to related guides with descriptive anchors. `new-versions.md` now
explains the product's normal and urgent release behavior, browser and Android update paths, and where to get
help. All ten locale guides and UI catalogues are pushed at `cf9c15a`. The full Docusaurus build and
`yarn typecheck` passed; `yarn seo:contract` re-ran on 2026-11-28 and passed all ten locales. The new output
has not passed the 1440/390 browser render gate, been published, or been checked in Search Console, so the issue
remains open.

## rentparty-docs#1 — URL-level indexing + AEO fix list · 2026-11-27 · commit: see `git log -- docs/search-consoles/fix-log.md`

Status: boxes 4, 5, 7 and 8 plus the slash switch fixed; 1, 2 and 6 Pending; 3 answered by owner law. `yarn build`
(zero warnings) ends with `yarn seo:contract` (`plugins/seo-contract.mts`), which failed on a planted noindex on the home
page, then passed. Rendered `/sitemap/` at 1440 (topic chips intact). Live-verified, google-pending (commit `d745d64`, gh-pages
`0c083a9`, IndexNow 200): Person, Organization and WebSite on every page; `/blog/archive/` carries no noindex; old tag
and author URLs land; 0 unslashed sitemap URLs.

| Box | SA | What was wrong (evidence) | Root fix (file) | Contract | Live proof |
|---|---|---|---|---|---|
| found · slashed URLs 404 | P26 | `trailingSlash: false` wrote `x.html` | `docusaurus.config.ts` `trailingSlash: true`; ignore patterns gain slashed forms; `plugins/site-pages.ts` dates routes slashless (`routeKey`) | fails on any `x.html` page, unslashed canonical or sitemap URL | see Retest |
| 4 · 8 tag pages | P32 / P24 | generated lists, and seven theme wrappers (`src/theme/*Tag*`, `*Authors*`, `BlogArchivePage`, via `src/components/NoIndex`) forced `noindex` on public pages, an older audit decision (SA-RENTPARTY-005, 2026-11-10) the link law now overrides | tags → `topics:` in 47 docs, `docs/tags.yml` → `docs/topics.yml` (the `/sitemap` chips read its labels); blog tags and `authors.yml` removed, the team written inline as author; the seven wrappers and `NoIndex` deleted; every old tag and author URL redirects (`plugins/seo-redirects.mts`, new dependency `@docusaurus/plugin-client-redirects`). `/search/` keeps its noindex (`src/theme/SearchPage`) | no public noindex; each redirect and target checked | see Retest |
| 7, 8 · no publisher entity, no sameAs | SA-P20 | none on the site | `docusaurus.config.ts` `headTags`: a `@graph` on every page — Person `https://aoneahsan.com/#person` with the sameAs list from `owner-profile.json` (= aoneahsan.com's), Organization Zaions, WebSite with publisher, author and the Rent Party SoftwareApplication | JSON-LD must parse | see Retest |
| 5 · feeds / llms.txt / sitemap | P33 | machine files; no `.md` mirrors | none needed | — | — |
| 3 · white-label pages | P32 | audit asked for noindex | overruled (owner, 2026-11-27: public pages are never noindexed) | contract: no noindex | — |

### Pending

| Box | Why not done | Who | Next action |
|---|---|---|---|
| 2 · 10 compare pages | competitor facts were refreshed in source on 2026-11-27; the new guides are not published | Rent Party terminal | render, publish, then verify the live guides and dated facts |
| 1 · home not indexed | new source links and localized home are not published; Google's decision still needs a fresh console report | Rent Party terminal + desktop session | render and publish, then inspect the home URL in Search Console |
| 6 · 30 other pages | descriptive internal links and ten-locale source are not published; indexing remains unconfirmed | Rent Party terminal + desktop session | render and publish, check live route links, then inspect the affected URLs in Search Console |
| Google re-crawl and Validate fix | console | daily audit | Validate fix |

### Retest

```bash
H=https://rentparty-docs.aoneahsan.com
for p in /learn-the-game /tags/basics/ /blog/authors/team/; do printf '%s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$H$p")"; done
curl -s "$H/" | grep -oE '"@type":"(Person|Organization|WebSite)"' | sort -u
curl -s "$H/blog/archive/" | grep -c noindex   # 0
curl -s "$H/sitemap.xml" | grep -oE '<loc>[^<]*</loc>' | grep -vc '/</loc>'   # 0
```
