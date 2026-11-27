import React, { type ReactNode } from 'react';
import Head from '@docusaurus/Head';
import roster from '@site/src/data/ecosystem.json';

const SITE = 'https://rentparty-docs.aoneahsan.com';
const PERSON = 'https://aoneahsan.com/#person';
const ORGANIZATION = 'https://zaions.com/#organization';
const products = roster.products.filter((product) => product.id !== roster.currentProductId);

function breadcrumb(items: readonly { name: string; url: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
  };
}

/** Page-specific data mirrors the visible roster facts and the dated owner page. */
export default function EcosystemSchema({ id }: { id?: string }): ReactNode {
  const product = products.find((item) => item.id === id);
  const graph: Record<string, unknown>[] = id === 'about-developer'
    ? [
        { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Who built Rent Party?', url: `${SITE}/about-developer/`, about: { '@id': PERSON }, publisher: { '@id': ORGANIZATION } },
        breadcrumb([{ name: 'Rent Party docs', url: `${SITE}/` }, { name: 'About the developer', url: `${SITE}/about-developer/` }]),
      ]
    : product === undefined
      ? [
          { '@context': 'https://schema.org', '@type': 'ItemList', name: 'More from Zaions', itemListElement: products.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `${SITE}/ecosystem/${item.id}/` })) },
          breadcrumb([{ name: 'Rent Party docs', url: `${SITE}/` }, { name: 'More from Zaions', url: `${SITE}/ecosystem/` }]),
        ]
      : [
          { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: product.name, url: product.liveUrl, mainEntityOfPage: `${SITE}/ecosystem/${product.id}/`, applicationCategory: product.category, description: product.angle, creator: { '@id': ORGANIZATION } },
          breadcrumb([{ name: 'Rent Party docs', url: `${SITE}/` }, { name: 'More from Zaions', url: `${SITE}/ecosystem/` }, { name: product.name, url: `${SITE}/ecosystem/${product.id}/` }]),
        ];
  return <Head><script type="application/ld+json">{JSON.stringify(graph).replace(/</g, '\\u003c')}</script></Head>;
}
