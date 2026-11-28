/** Blocks release builds that still carry a copied English player guide or blog post. */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import type { LoadContext, Plugin } from '@docusaurus/types';

const GROUPS = [
  ['docusaurus-plugin-content-docs/current', 'docs'],
  ['docusaurus-plugin-content-blog', 'blog'],
] as const;

function articles(folder: string): string[] {
  if (!existsSync(folder)) return [];
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(folder, entry.name);
    if (entry.isDirectory()) return articles(name);
    return /\.mdx?$/.test(entry.name) ? [name] : [];
  });
}

/** Prose blocks large enough to be authored copy, excluding front matter and fenced examples. */
function proseBlocks(markdown: string): Set<string> {
  const body = markdown
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/```[\s\S]*?```/g, '');
  return new Set(body.split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim().replace(/\s+/g, ' '))
    .filter((block) => block.length >= 60 &&
      (block.match(/[A-Za-z]{3,}/g)?.length ?? 0) >= 8 &&
      !/^(?:import\s|<|\||\{|#)/.test(block)));
}

/** Titles and descriptions are indexed copy, even when the body has been translated. */
function copiedMetadata(source: string, translated: string): string | null {
  const frontMatter = (text: string): string => /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? '';
  const english = frontMatter(source);
  const target = frontMatter(translated);
  for (const field of ['title', 'description', 'sidebar_label']) {
    const pattern = new RegExp(`^${field}:[ \\t]*(.+)$`, 'm');
    const plain = (value: string | undefined): string | undefined =>
      value?.trim().replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, '$1$2');
    const original = plain(pattern.exec(english)?.[1]);
    const answer = plain(pattern.exec(target)?.[1]);
    if (original === undefined || answer === undefined || original !== answer) continue;
    if (original.length >= 25 && (original.match(/[A-Za-z]{3,}/g)?.length ?? 0) >= 4) return field;
  }
  return null;
}

/** Each current locale is checked independently, so a translator can build its own completed locale. */
export default function localeProof(context: LoadContext): Plugin {
  return {
    name: 'locale-proof',
    async loadContent() {
      const locale = context.i18n.currentLocale;
      if (locale === context.i18n.defaultLocale) return null;
      for (const [translatedPart, sourcePart] of GROUPS) {
        const sourceFolder = path.join(context.siteDir, sourcePart);
        const targetFolder = path.join(context.siteDir, 'i18n', locale, translatedPart);
        for (const source of articles(sourceFolder)) {
          const relative = path.relative(sourceFolder, source);
          if (sourcePart === 'docs' &&
              (relative === 'MANUAL-TASKS.md' || relative.startsWith(`search-consoles${path.sep}`))) continue;
          const target = path.join(targetFolder, relative);
          if (!existsSync(target)) throw new Error(`locale-proof: ${locale} is missing ${relative}`);
          const english = readFileSync(source, 'utf8');
          const translation = readFileSync(target, 'utf8');
          if (translation === english) {
            throw new Error(`locale-proof: ${locale}/${relative} is still the English source`);
          }
          const metadata = copiedMetadata(english, translation);
          if (metadata !== null) {
            throw new Error(`locale-proof: ${locale}/${relative} keeps the English ${metadata}`);
          }
          const targetBlocks = proseBlocks(translation);
          if ([...proseBlocks(english)].some((block) => targetBlocks.has(block))) {
            throw new Error(`locale-proof: ${locale}/${relative} still contains an English prose block`);
          }
        }
      }
      return null;
    },
  };
}
