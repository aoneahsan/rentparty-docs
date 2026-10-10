# Manual tasks

Steps only the repository's owner can do. This file is the maintainers' checklist: `docusaurus.config.ts` leaves it out of the build, so it is never a page on the site.

**Last Updated:** 2026-10-10

## ⏳ Pending

| # | Task | Why only you | Detailed runbook | Status |
|---|---|---|---|---|
| 1 | Point the docs domain at GitHub Pages: on the `aoneahsan.com` zone, a CNAME record named `rentparty-docs` with the value `aoneahsan.github.io`. | The DNS zone is in your account. | [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) | ⏳ Pending. Found in place on 2026-10-10: the name answers with a CNAME to `aoneahsan.github.io`. Yours to move to Completed. |
| 2 | In [Settings → Pages](https://github.com/aoneahsan/rentparty-docs/settings/pages), confirm that the custom domain reads `rentparty-docs.aoneahsan.com` with its DNS check passed, and that **Enforce HTTPS** is ticked. | Both are set when the site is first published. This is the last look at them: GitHub issues the certificate some time after the domain is set, and Enforce HTTPS can't be ticked before the certificate exists. | [Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) | ⏳ Pending |

## ✅ Completed

Rows move here, with the date, once they're done.
