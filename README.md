<div align="center">

<img src="./static/img/logo.svg" alt="Rent Party" width="96" />

<h1>Rent Party docs</h1>

**The player docs for Rent Party, a property-trading party game for friends and family.**

[Docs site](https://rentparty-docs.aoneahsan.com) · [Play Rent Party](https://rentparty.aoneahsan.com) · [Contributing](./CONTRIBUTING.md) · [Support the team](https://aoneahsan.com/payment?project-id=rent-party&project-identifier=com.aoneahsan.rentparty)

</div>

This repository is the source of the Rent Party docs: the rules, house rules, pausing, online play, your account, plans and help. It's a [Docusaurus](https://docusaurus.io) site, published to GitHub Pages.

The game's own code isn't here. For help with a game, your account or a plan, use the game's [Help page](https://rentparty.aoneahsan.com/help).

<a id="documentation"></a>
## 📚 Documentation&nbsp;[#](#documentation)

Read the docs at [rentparty-docs.aoneahsan.com](https://rentparty-docs.aoneahsan.com). AI agents can start from [llms.txt](https://rentparty-docs.aoneahsan.com/llms.txt), a short index of every page.

<a id="requirements"></a>
## 📋 Requirements&nbsp;[#](#requirements)

- Node.js 20 or newer. The deploy builds on Node 24.
- Corepack, which provides the Yarn version pinned in `package.json`. This repository uses Yarn only.

<a id="quick-start"></a>
## 🚀 Quick Start&nbsp;[#](#quick-start)

```bash
corepack enable
yarn install --immutable
yarn start
```

`yarn start` serves the site locally while you edit. Before you open a pull request, run the typecheck and build:

```bash
yarn typecheck
yarn build
```

The build fails on any broken link, anchor or image, so a green build is also the link check.

<a id="repository"></a>
## 🗂️ Repository&nbsp;[#](#repository)

| Path | Holds |
|---|---|
| `docs/` | Every docs page, as Markdown. The sidebar order comes from each page's `sidebar_position` and each folder's `_category_.json`. |
| `docs/tags.yml` | The tags a page may use. |
| `blog/` | The what's-new posts, and `authors.yml`. |
| `src/css/custom.css` | The theme: the game's colors and typefaces, light and dark. |
| `src/fonts/` | The two self-hosted typefaces, beside their OFL licences. |
| `static/` | Files served as they are: `CNAME`, `robots.txt`, `llms.txt` and the logo. |
| `docusaurus.config.ts` | Site settings, search, feeds and the sitemap. |
| `.github/workflows/deploy-pages.yml` | Builds and deploys the site on every push to `main`. |

<a id="contributing"></a>
## 🤝 Contributing&nbsp;[#](#contributing)

Corrections and missing answers are welcome.

- A ruleset protects `main` against deletion and force-pushes.
- The Rent Party team maintains `main` and pushes to it directly.
- Everyone else contributes through a fork and a pull request, which needs no access.

[CONTRIBUTING.md](./CONTRIBUTING.md) covers reporting a problem, the writing rules, pull requests and asking for collaborator access.

<a id="support"></a>
## 💬 Support&nbsp;[#](#support)

- A mistake in the docs, or an answer that's missing: [open an issue](https://github.com/aoneahsan/rentparty-docs/issues/new/choose).
- A game, your account or a plan: the game's [Help page](https://rentparty.aoneahsan.com/help).
- To support the Rent Party team: [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=rent-party&project-identifier=com.aoneahsan.rentparty).

<a id="links"></a>
## 🔗 Links&nbsp;[#](#links)

[Docs](https://rentparty-docs.aoneahsan.com) · [Rent Party](https://rentparty.aoneahsan.com) · [How to play](https://rentparty.aoneahsan.com/how-to-play) · [Pricing](https://rentparty.aoneahsan.com/pricing) · [Privacy](https://rentparty.aoneahsan.com/privacy) · [Terms](https://rentparty.aoneahsan.com/terms)
