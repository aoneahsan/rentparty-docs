/**
 * Wraps the theme's BlogTagsPostsPage to add `noindex, follow` (src/components/NoIndex): the page is a listing the sitemap
 * leaves out (search audit 2026-11-10, SA-RENTPARTY-005). Recheck on every Docusaurus upgrade.
 */
import React, {type ReactNode} from 'react';
import BlogTagsPostsPage from '@theme-original/BlogTagsPostsPage';
import type BlogTagsPostsPageType from '@theme/BlogTagsPostsPage';
import type {WrapperProps} from '@docusaurus/types';
import NoIndex from '@site/src/components/NoIndex';

type Props = WrapperProps<typeof BlogTagsPostsPageType>;

export default function BlogTagsPostsPageWrapper(props: Props): ReactNode {
  return (
    <>
      <NoIndex />
      <BlogTagsPostsPage {...props} />
    </>
  );
}
