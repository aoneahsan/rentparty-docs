/**
 * Wraps the theme's BlogAuthorsPostsPage to add `noindex, follow` (src/components/NoIndex): the page is a listing the sitemap
 * leaves out (search audit 2026-11-10, SA-RENTPARTY-005). Recheck on every Docusaurus upgrade.
 */
import React, {type ReactNode} from 'react';
import BlogAuthorsPostsPage from '@theme-original/Blog/Pages/BlogAuthorsPostsPage';
import type BlogAuthorsPostsPageType from '@theme/Blog/Pages/BlogAuthorsPostsPage';
import type {WrapperProps} from '@docusaurus/types';
import NoIndex from '@site/src/components/NoIndex';

type Props = WrapperProps<typeof BlogAuthorsPostsPageType>;

export default function BlogAuthorsPostsPageWrapper(props: Props): ReactNode {
  return (
    <>
      <NoIndex />
      <BlogAuthorsPostsPage {...props} />
    </>
  );
}
