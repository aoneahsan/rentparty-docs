/** Build the long AEO document from the guide pages Docusaurus actually rendered. */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SitePage, SitePagesData } from './site-pages';

function decode(html: string): string {
  const named: Readonly<Record<string, string>> = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  };
  return html.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code.startsWith('#')) {
      const value = code[1]?.toLowerCase() === 'x'
        ? Number.parseInt(code.slice(2), 16)
        : Number.parseInt(code.slice(1), 10);
      return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : whole;
    }
    return named[code.toLowerCase()] ?? whole;
  });
}

/** Preserve the article's headings and list boundaries while dropping Docusaurus's markup. */
function articleText(html: string): string {
  const article = /<article\b[^>]*>([\s\S]*?)<\/article>/i.exec(html)?.[1]
    ?? /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1];
  if (article === undefined) throw new Error('llms-full: a public page has no article or main content.');
  return decode(article
    .replace(/<(script|style|svg|nav)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<h2\b[^>]*>/gi, '\n\n### ')
    .replace(/<h3\b[^>]*>/gi, '\n\n#### ')
    .replace(/<h4\b[^>]*>/gi, '\n\n##### ')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/(?:h[1-6]|p|li|tr|section|article|table|div|blockquote)>/gi, '\n')
    .replace(/<\/(?:th|td)>/gi, ' · ')
    .replace(/<[^>]+>/g, ''))
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Every indexed guide and blog page contributes its rendered full text, in its built locale. */
export async function writeLlmsFull(
  outDir: string,
  base: string,
  siteUrl: string,
  data: SitePagesData,
): Promise<void> {
  const pages: SitePage[] = [
    ...data.groups.flatMap((group) => group.pages),
    data.blog,
    ...data.posts,
  ];
  const chunks = await Promise.all(pages.map(async (page) => {
    const url = new URL(page.permalink, siteUrl);
    const route = base && url.pathname.startsWith(`${base}/`)
      ? url.pathname.slice(base.length)
      : url.pathname;
    const file = path.join(outDir, route.replace(/^\/+|\/+$/g, ''), 'index.html');
    const body = articleText(await readFile(file, 'utf8'));
    return [`## ${page.title}`, '', `[${url.href}](${url.href})`, '', page.description, '', body, ''].join('\n');
  }));
  await writeFile(path.join(outDir, 'llms-full.txt'), [
    '# Rent Party docs',
    '',
    ...chunks,
  ].join('\n'), 'utf8');
}
