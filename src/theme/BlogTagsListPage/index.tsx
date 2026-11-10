/**
 * Wraps the theme's BlogTagsListPage to add `noindex, follow` (src/components/NoIndex): the page is a listing the sitemap
 * leaves out (search audit 2026-11-10, SA-RENTPARTY-005). Recheck on every Docusaurus upgrade.
 */
import React, {type ReactNode} from 'react';
import BlogTagsListPage from '@theme-original/BlogTagsListPage';
import type BlogTagsListPageType from '@theme/BlogTagsListPage';
import type {WrapperProps} from '@docusaurus/types';
import NoIndex from '@site/src/components/NoIndex';

type Props = WrapperProps<typeof BlogTagsListPageType>;

export default function BlogTagsListPageWrapper(props: Props): ReactNode {
  return (
    <>
      <NoIndex />
      <BlogTagsListPage {...props} />
    </>
  );
}
