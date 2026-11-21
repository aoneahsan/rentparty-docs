/**
 * Every place Rent Party is released — the ONLY place a store or surface URL lives in this docs site
 * (standard aoneahsan-cccs-platform-links). Each surface passed its release proof on `verified`:
 * the web app and this site answered 200; Google Play lists com.aoneahsan.rentparty on the owner's CanyonDigital
 * developer page (2026-11-21).
 */
export type PlatformId = 'web' | 'android' | 'docs';

export interface Platform {
  id: PlatformId;
  /** Store or surface name (a proper name, not copy). */
  name: string;
  href: string;
  /** What this surface is for, in Rent Party's words. */
  title: string;
  text: string;
  cta: string;
  primary?: boolean;
  verified: string;
}

export const PLATFORMS: readonly Platform[] = [
  {id: 'web', name: 'Rent Party web app', href: 'https://rentparty.aoneahsan.com', title: 'In your browser', text: 'Play online with friends, pass one phone around the couch, or take on the CPU characters. It installs to your home screen too.', cta: 'Start a game', primary: true, verified: '2026-11-20'},
  {id: 'android', name: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.aoneahsan.rentparty', title: 'On Android', text: 'The same game on your home screen, with a buzz when it’s your turn online. Your account and saved games come with you.', cta: 'Get it on Google Play', verified: '2026-11-21'},
  {id: 'docs', name: 'Documentation', href: 'https://rentparty-docs.aoneahsan.com', title: 'These docs', text: 'The rules, the house rules, online rooms, coins and plans, one page each.', cta: 'Read the docs', verified: '2026-11-20'},
];

export const APPS_PAGE = {
  title: 'Get Rent Party',
  description: 'Every place Rent Party is released: the web app, the Android app on Google Play and these docs.',
  lead: 'Game night runs in your browser or the Android app. Keep the rules a tab away.',
} as const;

/** This site is the docs surface. */
export const CURRENT_SURFACE: PlatformId = 'docs';
export const OTHER_PLATFORMS: readonly Platform[] = PLATFORMS.filter((platform) => platform.id !== CURRENT_SURFACE);
export const PRIMARY_PLATFORM: Platform = PLATFORMS.find((platform) => platform.primary) ?? PLATFORMS[0];
export function platformHref(id: PlatformId): string {
  const found = PLATFORMS.find((platform) => platform.id === id);
  if (!found) throw new Error(`Unknown platform: ${id}`);
  return found.href;
}
/** `/apps` changes only when this list does: its sitemap date is the newest proof date. */
export const APPS_LASTMOD: string = PLATFORMS.map((platform) => platform.verified).sort().at(-1) ?? '2026-11-20';
