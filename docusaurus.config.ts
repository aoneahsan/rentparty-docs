import type { Config } from '@docusaurus/types';
import { seoRedirects } from './plugins/seo-redirects.mts';
import type * as Preset from '@docusaurus/preset-classic';
import sitePages, { withLastmod } from './plugins/site-pages';
import { OTHER_PLATFORMS, platformHref } from './src/data/platforms';

/** The docs site's own address. `static/CNAME` holds the same host for GitHub Pages. */
const SITE_URL = 'https://rentparty-docs.aoneahsan.com';

/** The game itself. Every "go and do it" link on the site points here. */
const APP_URL = platformHref('web');

/** The blog's route: the blog plugin's `routeBasePath` below, with its leading slash. */
const BLOG_PATH = '/blog';

/**
 * Analytics stay off unless the build environment names an ID, and each provider is skipped entirely when its
 * value is empty or malformed: no script tag, nothing loaded. A build never needs a secret to succeed.
 */
const GA_MEASUREMENT_ID = readId(process.env.GA_MEASUREMENT_ID, /^G-[A-Z0-9]+$/);
const CLARITY_PROJECT_ID = readId(process.env.CLARITY_PROJECT_ID, /^[a-z0-9]+$/i);

/**
 * Returns a trimmed analytics ID when it matches the provider's format, or an empty string.
 *
 * @param value - the raw environment value, possibly unset
 * @param format - the pattern a valid ID matches
 * @returns the ID, or `''` when the provider must stay off
 */
function readId(value: string | undefined, format: RegExp): string {
  const id = value?.trim() ?? '';
  return format.test(id) ? id : '';
}

/** Microsoft Clarity's official loader, emitted only when a project ID is set. */
const clarityTags: Config['headTags'] = CLARITY_PROJECT_ID
  ? [
      {
        tagName: 'script',
        attributes: { type: 'text/javascript' },
        innerHTML: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(CLARITY_PROJECT_ID)});`,
      },
    ]
  : [];

const config: Config = {
  title: 'Rent Party docs',
  tagline: 'The rules, online play, your account, plans and help for Rent Party.',
  favicon: 'img/logo.svg',

  url: SITE_URL,
  baseUrl: '/',
  organizationName: 'aoneahsan',
  projectName: 'rentparty-docs',
  // Every page is `<route>/index.html`: GitHub Pages then 301s `/x` to `/x/`. With `false` it served `x.html` and
  // 404ed every slashed link (rentparty-docs#1, SA-P26).
  trailingSlash: true,

  future: { v4: true },

  // The build is the link checker: a broken link, anchor or image fails it.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: { en: { htmlLang: 'en-US' } },
  },

  headTags: [
    // Publisher entity on every page (rentparty-docs#1 AEO 7-8): the owner and Zaions, with the profiles in
    // projects-finalization-record/ecosystem/owner-profile.json, which match aoneahsan.com.
    { tagName: 'script', attributes: { type: 'application/ld+json' }, innerHTML: JSON.stringify({"@context": "https://schema.org", "@graph": [{"@type": "Person", "@id": "https://aoneahsan.com/#person", "name": "Ahsan Mahmood", "alternateName": ["Ahsan", "aoneahsan", "a1ahsan", "A1 Ahsan", "AOne Ahsan"], "url": "https://aoneahsan.com", "jobTitle": "Founder and developer, Zaions", "worksFor": {"@id": "https://zaions.com/#organization"}, "sameAs": ["https://aoneahsan.com", "https://zaions.com", "https://github.com/aoneahsan", "https://www.linkedin.com/in/aoneahsan", "https://www.npmjs.com/~aoneahsan", "https://www.upwork.com/freelancers/aoneahsan", "https://orcid.org/0009-0006-2311-8687"]}, {"@type": "Organization", "@id": "https://zaions.com/#organization", "name": "Zaions", "alternateName": ["Zaions products", "Zaions projects"], "url": "https://zaions.com", "logo": "https://zaions.com/assets/logos/zaions-mark.png", "founder": {"@id": "https://aoneahsan.com/#person"}, "sameAs": ["https://zaions.com", "https://github.com/aoneahsan"]}, {"@type": "WebSite", "@id": "https://rentparty-docs.aoneahsan.com/#website", "name": "Rent Party Docs", "url": "https://rentparty-docs.aoneahsan.com/", "publisher": {"@id": "https://zaions.com/#organization"}, "author": {"@id": "https://aoneahsan.com/#person"}, "about": {"@type": "SoftwareApplication", "name": "Rent Party", "url": "https://rentparty.aoneahsan.com"}}]}) },
    ...(clarityTags ?? []),
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/aoneahsan/rentparty-docs/edit/main/',
          showLastUpdateTime: true,
          // The site speaks as the Rent Party team, so no person's name is shown on a page.
          showLastUpdateAuthor: false,
          onInlineTags: 'throw',
          // `exclude` replaces the plugin defaults, so they are restated before the internal files.
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            'MANUAL-TASKS.md',
            // docs/search-consoles/ is the fleet's fixed-path record of search-console work, never a page.
            'search-consoles/**',
            'story/**',
          ],
        },
        blog: {
          path: 'blog',
          routeBasePath: 'blog',
          blogTitle: 'What’s new in the Rent Party docs',
          blogDescription: 'Changes to the Rent Party docs, newest first.',
          blogSidebarTitle: 'Recent posts',
          showReadingTime: false,
          // A post's last update comes from git: shown under the post, and its sitemap lastmod. No name is shown.
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          // One author, the Rent Party team, written inline in each post: no authors file, so no author pages (SA-P32).
          onInlineAuthors: 'ignore',
          onInlineTags: 'throw',
          onUntruncatedBlogPosts: 'throw',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
            title: 'Rent Party docs: what’s new',
            description: 'Changes to the Rent Party docs, newest first.',
            copyright: 'Made by the Rent Party team.',
            language: 'en-US',
          },
        },
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          // Every URL carries a truthful lastmod and nothing else: search engines ignore changefreq and priority.
          lastmod: 'date',
          changefreq: null,
          priority: null,
          filename: 'sitemap.xml',
          // Slashed forms too: under `trailingSlash: true` routes end in `/`.
          ignorePatterns: ['/tags/**', '/blog/tags/**', '/blog/archive', '/blog/archive/', '/blog/authors/**', '/search', '/search/'],
          // A page git cannot date (the blog list, a category index, /sitemap, /feed) takes the newest date it lists.
          createSitemapItems: async ({ defaultCreateSitemapItems, ...params }) =>
            withLastmod(await defaultCreateSitemapItems(params), BLOG_PATH),
        },
        ...(GA_MEASUREMENT_ID ? { gtag: { trackingID: GA_MEASUREMENT_ID, anonymizeIP: true } } : {}),
      } satisfies Preset.Options,
    ],
  ],

  // `/sitemap` and `/feed` for people, and `/feed.xml` beside `/sitemap.xml` for machines.
  plugins: [
    sitePages({ blogPath: BLOG_PATH }),
    // Retired tag and author pages lead to real pages; plugins/seo-contract.mts re-checks every one after the build.
    ['@docusaurus/plugin-client-redirects', { redirects: seoRedirects(__dirname) }],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        indexDocs: true,
        indexBlog: true,
        indexPages: false,
        docsRouteBasePath: '/',
        blogRouteBasePath: '/blog',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 60,
      },
    ],
  ],

  themeConfig: {
    // The product's own 1200 x 630 share card (`rentparty/public/share/`), the og:image and twitter:image of every page.
    image: 'img/rent-party-share-1200x630.png',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    metadata: [
      { name: 'yandex-verification', content: 'bfb02722189028cf' },
      { name: 'theme-color', content: '#faf3f8', media: '(prefers-color-scheme: light)' },
      { name: 'theme-color', content: '#1e111b', media: '(prefers-color-scheme: dark)' },
    ],
    navbar: {
      title: 'Rent Party docs',
      logo: {
        alt: 'Rent Party',
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        { to: '/how-to-play', label: 'How to play', position: 'left' },
        { to: '/online-play', label: 'Online play', position: 'left' },
        { to: '/plans-and-pricing', label: 'Plans', position: 'left' },
        { to: '/help', label: 'Help', position: 'left' },
        {
          type: 'dropdown',
          label: 'Get Rent Party',
          position: 'right',
          items: [
            ...OTHER_PLATFORMS.map((platform) => ({ label: platform.name, href: platform.href })),
            { label: 'All apps', to: '/apps' },
          ],
        },
        { href: `${APP_URL}/play`, label: 'Start a game', position: 'right', className: 'navbar-cta' },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Get Rent Party',
          items: [
            ...OTHER_PLATFORMS.map((platform) => ({ label: platform.name, href: platform.href })),
            { label: 'All apps', to: '/apps' },
          ],
        },
        {
          title: 'Docs',
          items: [
            { label: 'Getting started', to: '/' },
            { label: 'How to play', to: '/how-to-play' },
            { label: 'Online play', to: '/online-play' },
            { label: 'Coins', to: '/coins' },
            { label: 'Your account', to: '/account' },
            { label: 'Plans and pricing', to: '/plans-and-pricing' },
            { label: 'Help and FAQ', to: '/help' },
          ],
        },
        {
          title: 'Play',
          items: [
            { label: 'Start a game', href: `${APP_URL}/play` },
            { label: 'Play online', href: `${APP_URL}/online` },
            { label: 'How to play', href: `${APP_URL}/how-to-play` },
            { label: 'Pricing', href: `${APP_URL}/pricing` },
            { label: 'Help', href: `${APP_URL}/help` },
          ],
        },
        {
          title: 'Legal',
          items: [
            { label: 'Privacy', href: `${APP_URL}/privacy` },
            { label: 'Terms', href: `${APP_URL}/terms` },
            { label: 'Permissions', href: `${APP_URL}/permissions` },
            { label: 'Delete account', href: `${APP_URL}/delete-account` },
          ],
        },
        {
          title: 'Site',
          // Three pages, then four files. Files written after the pages are built (feeds, sitemap, llms.txt) are
          // invisible to the link checker, so they use `pathname://`, which links to the file as it is without routing.
          items: [
            { label: 'More from Zaions', to: '/ecosystem' },
            { label: 'About the developer', to: '/about-developer' },
            { label: 'What’s new', to: BLOG_PATH },
            { label: 'Feed', to: '/feed' },
            { label: 'Sitemap', to: '/sitemap' },
            { label: 'RSS feed', href: `pathname://${BLOG_PATH}/rss.xml` },
            { label: 'Atom feed', href: `pathname://${BLOG_PATH}/atom.xml` },
            { label: 'sitemap.xml', href: 'pathname:///sitemap.xml' },
            { label: 'llms.txt', href: 'pathname:///llms.txt' },
          ],
        },
      ],
      copyright: 'developed with love by the Zaions team',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
