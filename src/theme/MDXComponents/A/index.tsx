import type { ComponentProps } from 'react';
import OriginalLink from '@theme-original/MDXComponents/A';
import { follows } from './link-policy';

/** MDX links obey the same owned/third-party policy as the game site. */
export default function DocsLink(props: ComponentProps<typeof OriginalLink>) {
  if (!props.href || props.href.startsWith('#') || props.href.startsWith('/')) return <OriginalLink {...props} />;
  return <OriginalLink {...props} rel={follows(props.href) ? 'noopener' : 'noopener nofollow'} />;
}
