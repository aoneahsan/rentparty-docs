import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/** The docs site's own address. `static/CNAME` holds the same host for GitHub Pages. */
const SITE_URL = 'https://rentparty-docs.aoneahsan.com';

/** The game itself. Every "go and do it" link on the site points here. */
const APP_URL = 'https://rentparty.aoneahsan.com';

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
  trailingSlash: false,

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

  headTags: clarityTags,

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
          onInlineAuthors: 'throw',
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
          lastmod: 'date',
          changefreq: 'weekly',
          priority: null,
          filename: 'sitemap.xml',
          ignorePatterns: ['/tags/**', '/blog/tags/**', '/blog/archive', '/blog/authors/**', '/search'],
        },
        ...(GA_MEASUREMENT_ID ? { gtag: { trackingID: GA_MEASUREMENT_ID, anonymizeIP: true } } : {}),
      } satisfies Preset.Options,
    ],
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
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    metadata: [
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
          title: 'Docs',
          items: [
            { label: 'Getting started', to: '/' },
            { label: 'How to play', to: '/how-to-play' },
            { label: 'Online play', to: '/online-play' },
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
          // Files written after the pages are built (feeds, sitemap, llms.txt) are invisible to the link
          // checker, so they use `pathname://`, which links to the file as it is without routing.
          items: [
            { label: 'What’s new', to: '/blog' },
            { label: 'RSS feed', href: 'pathname:///blog/rss.xml' },
            { label: 'Atom feed', href: 'pathname:///blog/atom.xml' },
            { label: 'Sitemap', href: 'pathname:///sitemap.xml' },
            { label: 'llms.txt', href: 'pathname:///llms.txt' },
          ],
        },
      ],
      copyright: 'Made by the Rent Party team.',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
