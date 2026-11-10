/**
 * Wraps the theme's BlogAuthorsListPage to add `noindex, follow` (src/components/NoIndex): the page is a listing the sitemap
 * leaves out (search audit 2026-11-10, SA-RENTPARTY-005). Recheck on every Docusaurus upgrade.
 */
import React, {type ReactNode} from 'react';
import BlogAuthorsListPage from '@theme-original/Blog/Pages/BlogAuthorsListPage';
import type BlogAuthorsListPageType from '@theme/Blog/Pages/BlogAuthorsListPage';
import type {WrapperProps} from '@docusaurus/types';
import NoIndex from '@site/src/components/NoIndex';

type Props = WrapperProps<typeof BlogAuthorsListPageType>;

export default function BlogAuthorsListPageWrapper(props: Props): ReactNode {
  return (
    <>
      <NoIndex />
      <BlogAuthorsListPage {...props} />
    </>
  );
}
