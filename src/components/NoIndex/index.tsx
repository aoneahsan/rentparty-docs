/**
 * The robots rule for the listing pages the sitemap leaves out (`docusaurus.config.ts`, `sitemap.ignorePatterns`): the tag
 * indexes and tag pages of the docs and the blog, the blog archive and the author pages. They only repeat titles that
 * live on their own pages, so they say `noindex, follow`: search engines skip them and still follow their links. They
 * are never Disallowed in robots.txt, or crawlers could not read the rule (search audit 2026-11-10, SA-RENTPARTY-005).
 */
import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';

export default function NoIndex(): ReactNode {
  return (
    <Head>
      <meta name="robots" content="noindex, follow" />
    </Head>
  );
}
