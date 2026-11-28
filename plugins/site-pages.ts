/**
 * The site-pages plugin: the pages people use to find everything on the site (`/sitemap`, `/feed`), and the feed
 * file machines read at the site root (`/feed.xml`).
 *
 * - `allContentLoaded` reads what the docs and blog plugins loaded (each page's title, description and tags, the
 *   sidebar's order, the posts), writes it once as JSON and adds both routes. Docusaurus prerenders them, so every
 *   card and post is in the built HTML before any script runs.
 * - `postBuild` copies the blog's RSS feed to `/feed.xml` with its own self link, so the two never disagree.
 * - `withLastmod` gives every sitemap URL a date; the sitemap plugin's `createSitemapItems` calls it.
 */
import { readFileSync } from 'node:fs';
import { access, copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import type { BlogContent } from '@docusaurus/plugin-content-blog';
import type { LoadedContent as DocsContent } from '@docusaurus/plugin-content-docs';
import type { AllContent, LoadContext, Plugin, PluginModule } from '@docusaurus/types';
import { APPS_LASTMOD } from '../src/data/platforms';
import { writeLlmsFull } from './llms-full';

/** One page as its `/sitemap` card shows it: its own title, description and tag labels. */
export interface SitePage {
  readonly permalink: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
}

/** A blog post, with the day it was published (`YYYY-MM-DD`, UTC). */
export interface SitePost extends SitePage {
  readonly date: string;
}

/**
 * Pages in sidebar order. The sidebar's top-level pages share one group (`kind: 'docs'`); each top-level category
 * is its own group and carries the category's own label.
 */
export type SiteGroup =
  | { readonly kind: 'docs'; readonly key: string; readonly pages: readonly SitePage[] }
  | {
      readonly kind: 'category';
      readonly key: string;
      readonly label: string;
      readonly pages: readonly SitePage[];
    };

/** What `/sitemap` and `/feed` draw, written once per build. */
export interface SitePagesData {
  readonly groups: readonly SiteGroup[];
  /** The blog's list page. */
  readonly blog: SitePage;
  /** Every listed post, newest first. */
  readonly posts: readonly SitePost[];
}

export interface SitePagesOptions {
  /** The blog's route from the site root, with a leading slash: the blog plugin's `routeBasePath`. */
  readonly blogPath: string;
}

type DocsVersion = DocsContent['loadedVersions'][number];
type DocMetadata = DocsVersion['docs'][number];
type SidebarItem = DocsVersion['sidebars'][string][number];
type SidebarCategory = Extract<SidebarItem, { type: 'category' }>;

const DOCS_PLUGIN = 'docusaurus-plugin-content-docs';
const BLOG_PLUGIN = 'docusaurus-plugin-content-blog';
const ATOM_NAMESPACE = 'http://www.w3.org/2005/Atom';

/** How long `postBuild` waits for the blog plugin's RSS file, and how often it looks. */
const RSS_WAIT_MS = 30_000;
const RSS_POLL_MS = 25;

const SITE_LOCALES = ['en', 'zh-Hans', 'hi', 'es', 'ar', 'fr', 'pt-BR', 'ru', 'ja', 'ur'] as const;
const LOCALE_RELEASE_DAY = '2026-11-28';
const LOCALE_FLAG = process.argv.indexOf('--locale');
const singleLocale = LOCALE_FLAG < 0 ? process.argv.find((arg) => arg.startsWith('--locale='))?.slice(9)
  : process.argv[LOCALE_FLAG + 1];

/**
 * Full builds prefix translated URLs. Docusaurus omits that prefix for a single `--locale` build, so its
 * immutable CLI argument supplies the locale in that case. Parallel builds never share a mutable locale value.
 */
function localeOf(address: string): string {
  const first = new URL(address).pathname.split('/')[1];
  return SITE_LOCALES.find((locale) => locale !== 'en' && locale === first) ??
    SITE_LOCALES.find((locale) => locale === singleLocale) ?? 'en';
}

/** The same docs route in every language, from the active build's URL. */
function localeUrl(address: string, locale: string): string {
  const url = new URL(address);
  const current = localeOf(address);
  const currentPrefix = current === 'en' ? '' : `/${current}`;
  const route = currentPrefix && url.pathname.startsWith(`${currentPrefix}/`)
    ? url.pathname.slice(currentPrefix.length)
    : url.pathname;
  url.pathname = locale === 'en' ? route : `/${locale}${route}`;
  return url.href;
}

/** Native Docusaurus sitemap items enriched with reciprocal language links. */
export function withLocaleAlternates<Item extends { readonly url: string; readonly lastmod?: string | null }>(
  items: readonly Item[],
): (Item & { readonly links: readonly { readonly lang: string; readonly url: string }[] })[] {
  return items.flatMap((item) => {
    const links = SITE_LOCALES.map((locale) => ({ lang: locale, url: localeUrl(item.url, locale) }));
    const variants = [...links, { lang: 'x-default', url: localeUrl(item.url, 'en') }];
    if (localeOf(item.url) !== 'en') return [{ ...item, links: variants }];
    return SITE_LOCALES.map((locale) => ({
      ...item,
      url: localeUrl(item.url, locale),
      lastmod: locale === 'en' ? item.lastmod : LOCALE_RELEASE_DAY,
      links: variants,
    }));
  });
}

/**
 * A doc as its card shows it.
 *
 * @param doc - the docs plugin's metadata for one page
 * @returns the page's permalink, title, description and tag labels
 */
function docPage(doc: DocMetadata): SitePage {
  return {
    permalink: doc.permalink,
    title: doc.title,
    description: doc.description,
    // Topics are front matter, not tag routes: the /tags/* pages were retired (rentparty-docs#1, SA-P32).
    tags: topicsOf(doc.frontMatter),
  };
}

/**
 * Reads the sidebar into groups in the order a reader meets them: the top-level pages together, each top-level
 * category apart (its index page first, then its pages, nested categories included). A listed doc that no sidebar
 * shows still joins the top-level group, so every doc in `sitemap.xml` has a card.
 *
 * @param version - the docs version the site shows
 * @returns the non-empty groups, each page once
 */
function docsGroups(version: DocsVersion): SiteGroup[] {
  const docsById = new Map(version.docs.filter((doc) => !doc.unlisted).map((doc) => [doc.id, doc]));
  const seen = new Set<string>();
  const groups: SiteGroup[] = [];
  let topLevel: SitePage[] | undefined;

  const topLevelPages = (): SitePage[] => {
    if (topLevel === undefined) {
      topLevel = [];
      groups.push({ kind: 'docs', key: 'docs', pages: topLevel });
    }
    return topLevel;
  };
  const add = (page: SitePage, into: SitePage[]): void => {
    if (seen.has(page.permalink)) return;
    seen.add(page.permalink);
    into.push(page);
  };
  const addDoc = (id: string, into: SitePage[]): void => {
    const doc = docsById.get(id);
    if (doc !== undefined) add(docPage(doc), into);
  };
  const addCategory = (category: SidebarCategory, into: SitePage[]): void => {
    const { link } = category;
    if (link?.type === 'generated-index') {
      add(
        {
          permalink: link.permalink,
          title: link.title ?? category.label,
          description: link.description ?? '',
          tags: [],
        },
        into
      );
    } else if (link?.type === 'doc') {
      addDoc(link.id, into);
    }
    for (const item of category.items) {
      if (item.type === 'doc') addDoc(item.id, into);
      else if (item.type === 'category') addCategory(item, into);
    }
  };

  for (const sidebar of Object.values(version.sidebars)) {
    for (const item of sidebar) {
      if (item.type === 'doc') {
        addDoc(item.id, topLevelPages());
      } else if (item.type === 'category') {
        const pages: SitePage[] = [];
        addCategory(item, pages);
        const first = pages[0];
        if (first !== undefined) {
          groups.push({ kind: 'category', key: first.permalink, label: item.label, pages });
        }
      }
    }
  }
  for (const doc of docsById.values()) {
    if (!seen.has(doc.permalink)) add(docPage(doc), topLevelPages());
  }
  return groups.filter((group) => group.pages.length > 0);
}

/**
 * Collects what both pages draw from the docs and blog plugins' content.
 *
 * @param allContent - every plugin's loaded content
 * @param blogPermalink - the blog list page's permalink
 * @returns the groups, the blog's list page and the posts, newest first
 * @throws when the docs or blog plugin is off: both pages list their pages
 */
function collect(allContent: AllContent, blogPermalink: string): SitePagesData {
  const docs = allContent[DOCS_PLUGIN]?.['default'] as DocsContent | undefined;
  const blog = allContent[BLOG_PLUGIN]?.['default'] as BlogContent | undefined;
  if (docs === undefined || blog === undefined) {
    throw new Error('site-pages: /sitemap and /feed list the docs and the blog, so both plugins (id "default") must be on.');
  }
  const version = docs.loadedVersions.find((loaded) => loaded.isLast) ?? docs.loadedVersions[0];
  const posts = blog.blogPosts
    .filter((post) => !post.metadata.unlisted)
    .map(({ metadata }) => ({
      permalink: metadata.permalink,
      title: metadata.title,
      description: metadata.description,
      tags: [],
      date: metadata.date.toISOString().slice(0, 10),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
  return {
    groups: version === undefined ? [] : docsGroups(version),
    blog: { permalink: blogPermalink, title: blog.blogTitle, description: blog.blogDescription, tags: [] },
    posts,
  };
}

/**
 * Whether an error is a missing file's.
 *
 * @param error - anything a file read rejected with
 * @returns true for `ENOENT`
 */
function isMissingFile(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}

/**
 * Reads the blog's RSS file once it is written in full. Docusaurus runs every plugin's `postBuild` at the same time,
 * so the blog plugin may still be writing it. The build starts by clearing its output folder, so a complete file
 * (one that ends with `</rss>`) is this build's.
 *
 * @param file - absolute path of the blog's `rss.xml` in the build output
 * @returns the file's text
 * @throws when the file is not complete within {@link RSS_WAIT_MS}
 */
async function readWrittenRss(file: string): Promise<string> {
  const deadline = Date.now() + RSS_WAIT_MS;
  for (;;) {
    const text = await readFile(file, 'utf8').catch((error: unknown) => {
      if (isMissingFile(error)) return '';
      throw error;
    });
    if (text.trimEnd().endsWith('</rss>')) return text;
    if (Date.now() >= deadline) {
      throw new Error(
        `site-pages: ${file} was not written within ${RSS_WAIT_MS / 1000} s. The blog's RSS feed (feedOptions.type) must stay on.`
      );
    }
    await delay(RSS_POLL_MS);
  }
}

/**
 * Escapes a value for an XML attribute in double quotes.
 *
 * @param value - the raw value
 * @returns the escaped value
 */
function escapeXmlAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

/**
 * The blog's RSS feed, made to live at the site root: a stylesheet reference relative to the blog folder (which would
 * miss from the root) made absolute, the Atom namespace declared, and one `atom:link rel="self"` naming the file's
 * own address. Items, dates and categories stay exactly as the blog plugin wrote them.
 *
 * @param params.rss - the blog's `rss.xml`
 * @param params.selfUrl - the root feed's absolute address
 * @param params.stylesheetDir - the blog folder's path from the site root, ending in `/`
 * @returns the root feed
 * @throws when the feed is not in the shape this copy expects, so a broken `feed.xml` is never written
 */
export function rootFeed({
  rss,
  selfUrl,
  stylesheetDir,
}: {
  readonly rss: string;
  readonly selfUrl: string;
  readonly stylesheetDir: string;
}): string {
  const selfLink = `<atom:link href="${escapeXmlAttribute(selfUrl)}" rel="self" type="application/rss+xml"/>`;
  const withStylesheet = rss.replace(
    /(<\?xml-stylesheet\b[^?]*?\bhref=)(["'])(.*?)\2/g,
    (_match, head: string, quote: string, href: string) =>
      `${head}${quote}${/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(href) ? href : stylesheetDir + href}${quote}`
  );
  const withNamespace = /<rss\b[^>]*\bxmlns:atom=/.test(withStylesheet)
    ? withStylesheet
    : withStylesheet.replace(/<rss\b([^>]*)>/, `<rss$1 xmlns:atom="${ATOM_NAMESPACE}">`);
  const feed = withNamespace
    .replace(/\s*<atom:link\b[^>]*\brel="self"[^>]*\/>/g, '')
    .replace(/<channel>/, `<channel>\n        ${selfLink}`);
  const selfLinks = feed.match(/<atom:link\b[^>]*\brel="self"/g) ?? [];
  if (selfLinks.length !== 1 || !feed.includes(selfLink) || !/<rss\b[^>]*\bxmlns:atom=/.test(feed)) {
    throw new Error('site-pages: the blog RSS feed is not in the shape feed.xml is copied from; feed.xml was not written.');
  }
  return feed;
}

/**
 * Gives every sitemap URL a lastmod. A page dated by git keeps its own date; a page that lists others takes the newest
 * date of what it lists: `/sitemap` every page, `/feed` and the blog's list pages the posts, and any other page (a
 * category index) the pages under its path.
 *
 * @param items - the sitemap plugin's entries (`lastmod` as `YYYY-MM-DD`)
 * @param blogPath - the blog's route from the site root, with a leading slash
 * @returns the same entries, each with a lastmod
 * @throws naming the URL, when an entry is still undated
 */
/**
 * A pathname without its trailing slash (`/` stays `/`): under `trailingSlash: true` sitemap URLs end in `/`, and the
 * date lookups compare routes in this one form.
 *
 * @param pathname - a pathname
 * @returns the same route, slashless
 */
export function routeKey(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

/** Topic key → label, from `docs/topics.yml` (`key:` then an indented `label: …`). */
const TOPIC_LABELS: ReadonlyMap<string, string> = (() => {
  const labels = new Map<string, string>();
  let key = '';
  for (const line of readFileSync(path.join(process.cwd(), 'docs', 'topics.yml'), 'utf8').split('\n')) {
    key = /^([^\s#][^:]*):\s*$/.exec(line)?.[1] ?? key;
    const label = /^\s+label:\s*"?(.*?)"?\s*$/.exec(line)?.[1];
    if (label !== undefined && key) labels.set(key, label);
  }
  return labels;
})();

/**
 * A doc's topic labels from its `topics:` front matter.
 *
 * @param frontMatter - the doc's front matter
 * @returns the labels, falling back to the key
 */
function topicsOf(frontMatter: object): string[] {
  const topics = (frontMatter as {topics?: unknown}).topics;
  return Array.isArray(topics) ? topics.map((topic) => TOPIC_LABELS.get(String(topic)) ?? String(topic)) : [];
}

export function withLastmod<Item extends { readonly url: string; readonly lastmod?: string | null }>(
  items: readonly Item[],
  blogPath: string
): Item[] {
  const paths = items.map((item) => routeKey(new URL(item.url).pathname));
  const localizedBlog = paths.find((pathname) => pathname.endsWith(blogPath)) ?? blogPath;
  const prefix = localizedBlog.slice(0, -blogPath.length);
  const dated = items.flatMap((item) =>
    item.lastmod ? [{ path: routeKey(new URL(item.url).pathname), lastmod: item.lastmod }] : []
  );
  const newest = (inside: (pathname: string) => boolean): string | undefined =>
    dated
      .filter((entry) => inside(entry.path))
      .reduce<string | undefined>((max, entry) => (max === undefined || entry.lastmod > max ? entry.lastmod : max), undefined);
  const isPost = (pathname: string): boolean => pathname.startsWith(`${localizedBlog}/`);

  return items.map((item) => {
    if (item.lastmod) {
      return localeOf(item.url) === 'en' || item.lastmod >= LOCALE_RELEASE_DAY
        ? item
        : { ...item, lastmod: LOCALE_RELEASE_DAY };
    }
    const pathname = routeKey(new URL(item.url).pathname);
    let lastmod: string | undefined;
    if (pathname === `${prefix}/sitemap`) lastmod = newest(() => true);
    // `/apps` lists the released surfaces; it changes when their proof date does.
    else if (pathname === `${prefix}/apps`) lastmod = APPS_LASTMOD;
    else if (pathname === `${prefix}/feed` || pathname === localizedBlog || isPost(pathname)) lastmod = newest(isPost);
    else lastmod = newest((other) => other.startsWith(`${pathname}/`));
    // Newly added translated files have no git date until their first commit. The first release day is recorded
    // here, and later edits take their own git last-change date like the English source.
    if (localeOf(item.url) !== 'en' && (lastmod === undefined || lastmod < LOCALE_RELEASE_DAY)) {
      lastmod = LOCALE_RELEASE_DAY;
    }
    if (lastmod === undefined) {
      throw new Error(`site-pages: ${item.url} has no lastmod, and no page it lists has one.`);
    }
    return { ...item, lastmod };
  });
}

/**
 * The plugin, set up for this site's blog route.
 *
 * @param options.blogPath - the blog's route from the site root, e.g. `/blog`
 * @returns the plugin module Docusaurus loads
 */
export default function sitePages({ blogPath }: SitePagesOptions): PluginModule {
  return function sitePagesPlugin(context: LoadContext): Plugin {
    const base = context.baseUrl.replace(/\/$/, '');
    let hasPosts = false;
    let siteData: SitePagesData | null = null;
    return {
      name: 'site-pages',

      async allContentLoaded({ allContent, actions }) {
        const data = collect(allContent, `${base}${blogPath}`);
        siteData = data;
        hasPosts = data.posts.length > 0;
        const dataFile = await actions.createData('site-pages.json', JSON.stringify(data));
        // The route registry ships each module path in the client bundle; an absolute path would publish this
        // machine's folders and give every machine different chunk names, so pass it through the @generated alias.
        const site = `@generated/${path.relative(context.generatedFilesDir, dataFile).split(path.sep).join('/')}`;
        actions.addRoute({
          path: `${base}/sitemap`,
          component: '@site/src/components/SitemapPage',
          exact: true,
          modules: { site },
        });
        actions.addRoute({
          path: `${base}/feed`,
          component: '@site/src/components/FeedPage',
          exact: true,
          modules: { site },
        });
      },

      async postBuild({ outDir, siteConfig }) {
        if (siteData === null) throw new Error('site-pages: no loaded docs data for public text files.');
        await writeLlmsFull(outDir, base, siteConfig.url, siteData);
        const pages = siteData.groups.flatMap((group) => group.pages);
        const pricing = pages.find((page) => routeKey(page.permalink).endsWith('/plans-and-pricing'));
        if (pricing === undefined) throw new Error('site-pages: the pricing guide is missing.');
        await writeFile(path.join(outDir, 'pricing.md'), [
          `# ${pricing.title}`,
          '',
          `> ${pricing.description}`,
          '',
          `- [${pricing.title}](${new URL(pricing.permalink, siteConfig.url).href})`,
          `- [Rent Party](https://rentparty.aoneahsan.com${base}/pricing.md)`,
          '',
        ].join('\n'), 'utf8');
        if (context.i18n.currentLocale !== 'en') {
          const intro = pages.find((page) => routeKey(page.permalink) === (base || '/'));
          const grouped = siteData.groups.map((group) => [
            `## ${group.kind === 'category' ? group.label : 'Rent Party'}`,
            '',
            ...group.pages.map((page) => `- [${page.title}](${new URL(page.permalink, siteConfig.url).href}): ${page.description}`),
          ].join('\n')).join('\n\n');
          const posts = siteData.posts.map((post) => `- [${post.title}](${new URL(post.permalink, siteConfig.url).href}): ${post.description}`).join('\n');
          await writeFile(path.join(outDir, 'llms.txt'), [
            '# Rent Party',
            '',
            ...(intro === undefined ? [] : [`> ${intro.description}`, '']),
            grouped,
            '',
            `## ${siteData.blog.title}`,
            '',
            posts,
            '',
            '## llms-full.txt',
            '',
            `- [llms-full.txt](${siteConfig.url}${base}/llms-full.txt)`,
            '',
          ].join('\n'), 'utf8');
        }
        // With no post the blog writes no feed, so there is nothing to copy.
        if (!hasPosts) return;
        const rssPath = path.join(outDir, blogPath, 'rss.xml');
        const originalRss = await readWrittenRss(rssPath);
        const language = context.i18n.currentLocale === 'en' ? 'en-US' : context.i18n.currentLocale;
        const rss = originalRss.replace(/<language>[^<]*<\/language>/, `<language>${language}</language>`);
        if (rss === originalRss && !originalRss.includes(`<language>${language}</language>`)) {
          throw new Error('site-pages: RSS channel has no language field.');
        }
        if (rss !== originalRss) await writeFile(rssPath, rss, 'utf8');
        const feed = rootFeed({
          rss,
          selfUrl: new URL(`${base}/feed.xml`, siteConfig.url).href,
          stylesheetDir: `${base}${blogPath}/`,
        });
        await writeFile(path.join(outDir, 'feed.xml'), feed, 'utf8');
        // The feed's stylesheet loads its CSS by a relative address, which from the root feed reads the root: give it
        // the blog's copy there, so /feed.xml opened in a browser is styled as /blog/rss.xml is.
        const css = path.join(outDir, blogPath, 'rss.css');
        const hasCss = await access(css).then(() => true, () => false);
        if (hasCss) await copyFile(css, path.join(outDir, 'rss.css'));
      },
    };
  };
}
