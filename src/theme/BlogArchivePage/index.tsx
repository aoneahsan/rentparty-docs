/**
 * Wraps the theme's BlogArchivePage to add `noindex, follow` (src/components/NoIndex): the page is a listing the sitemap
 * leaves out (search audit 2026-11-10, SA-RENTPARTY-005). Recheck on every Docusaurus upgrade.
 */
import React, {type ReactNode} from 'react';
import BlogArchivePage from '@theme-original/BlogArchivePage';
import type BlogArchivePageType from '@theme/BlogArchivePage';
import type {WrapperProps} from '@docusaurus/types';
import NoIndex from '@site/src/components/NoIndex';

type Props = WrapperProps<typeof BlogArchivePageType>;

export default function BlogArchivePageWrapper(props: Props): ReactNode {
  return (
    <>
      <NoIndex />
      <BlogArchivePage {...props} />
    </>
  );
}
