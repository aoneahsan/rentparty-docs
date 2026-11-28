/** Follow Rent Party, the owner's projects and their listings; mark outside references as nofollow. */
import ecosystem from '../../../data/ecosystem.json';
import { PLATFORMS } from '../../../data/platforms';

const OWN_HOSTS = new Set(['aoneahsan.com', 'zaions.com']);
const OWNER_PATHS = [
  ['github.com', '/aoneahsan'],
  ['www.linkedin.com', '/in/aoneahsan'],
  ['linkedin.com', '/in/aoneahsan'],
  ['www.npmjs.com', '/~aoneahsan'],
  ['www.upwork.com', '/freelancers/aoneahsan'],
  ['orcid.org', '/0009-0006-2311-8687'],
] as const;

const listed = ecosystem.products.flatMap((product) => [
  product.liveUrl,
  product.docsUrl,
  ...Object.values(product.platforms),
]).concat(PLATFORMS.map((platform) => platform.href))
  .filter((value): value is string => typeof value === 'string' && value !== '');

function within(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix.replace(/\/$/, '')}/`);
}

/** Public owned destinations use a normal followed link, even on an app or store host. */
export function follows(href: string | undefined): boolean {
  if (!href || href.startsWith('#') || href.startsWith('/')) return true;
  let url: URL;
  try { url = new URL(href); } catch { return false; }
  if (url.protocol !== 'https:') return false;
  if ([...OWN_HOSTS].some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) return true;
  if (OWNER_PATHS.some(([host, path]) => url.hostname === host && within(url.pathname, path))) return true;
  return listed.some((address) => {
    try {
      const own = new URL(address);
      if (url.origin !== own.origin || !within(url.pathname, own.pathname)) return false;
      for (const [key, value] of own.searchParams) {
        if (url.searchParams.get(key) !== value) return false;
      }
      return true;
    } catch { return false; }
  });
}
