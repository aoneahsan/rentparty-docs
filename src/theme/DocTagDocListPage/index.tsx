/**
 * Wraps the theme's DocTagDocListPage to add `noindex, follow` (src/components/NoIndex): the page is a listing the sitemap
 * leaves out (search audit 2026-11-10, SA-RENTPARTY-005). Recheck on every Docusaurus upgrade.
 */
import React, {type ReactNode} from 'react';
import DocTagDocListPage from '@theme-original/DocTagDocListPage';
import type DocTagDocListPageType from '@theme/DocTagDocListPage';
import type {WrapperProps} from '@docusaurus/types';
import NoIndex from '@site/src/components/NoIndex';

type Props = WrapperProps<typeof DocTagDocListPageType>;

export default function DocTagDocListPageWrapper(props: Props): ReactNode {
  return (
    <>
      <NoIndex />
      <DocTagDocListPage {...props} />
    </>
  );
}
