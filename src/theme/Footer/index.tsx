import React, { type ReactNode } from 'react';
import OriginalFooter from '@theme-original/Footer';
import { EcosystemShowcase } from '@site/src/components/EcosystemDirectory';

/** Every docs page keeps the usual footer, with the other Zaions products directly ahead of it. */
export default function Footer(): ReactNode {
  return <><EcosystemShowcase /><OriginalFooter /></>;
}
