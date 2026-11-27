import React, { useEffect, useState, type FocusEvent, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { useQueryString } from '@docusaurus/theme-common';
import cards from '@site/src/data/ecosystem-cards.json';
import styles from './styles.module.css';

type Product = (typeof cards)[number];
type View = 'grid' | 'list' | 'table';
const CATEGORY: Readonly<Record<string, string>> = {
  'web-app': 'Web app',
  'mobile-app': 'Mobile app',
  package: 'Package',
  'wordpress-plugin-saas': 'WordPress plugin',
  'desktop-app-cli': 'Desktop app',
  'saas-package': 'Software package',
  'browser-extension': 'Browser extension',
};

/** One product's real mark, Rent Party angle and two followed ways forward. */
function ProductCard({ product, first = false }: { product: Product; first?: boolean }): ReactNode {
  return (
    <article className={styles.card}>
      <img src={product.logo} width={56} height={56} alt="" loading={first ? 'eager' : 'lazy'} className={styles.mark} />
      <span className={styles.category}>{CATEGORY[product.category] ?? product.category}</span>
      <h3>{product.name}</h3>
      <p>{product.angle}</p>
      <div className={styles.actions}>
        <a href={product.liveUrl} target="_blank" rel="noopener" className="button button--primary">Visit {product.name}<span className="sr-only"> (opens in a new tab)</span></a>
        <Link to={`/ecosystem/${product.id}`} className="button button--secondary">Details</Link>
      </div>
    </article>
  );
}

/** The docs index keeps the three arrangements in the address, including Back and Forward. */
export default function EcosystemDirectory(): ReactNode {
  const [raw, setView] = useQueryString('view');
  const view: View = raw === 'list' || raw === 'table' ? raw : 'grid';
  const choices: readonly View[] = ['grid', 'list', 'table'];
  return (
    <section aria-label="Other Zaions products">
      <div className={styles.controls} role="group" aria-label="Choose how to view the products">
        {choices.map((choice) => (
          <button key={choice} type="button" aria-pressed={view === choice} onClick={() => setView(choice === 'grid' ? '' : choice)}>
            {choice[0]?.toUpperCase()}{choice.slice(1)}
          </button>
        ))}
      </div>
      {view === 'table' ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th scope="col">Product</th><th scope="col">Why take a look</th><th scope="col">Open</th></tr></thead>
            <tbody>{cards.map((product) => (
              <tr key={product.id}>
                <th scope="row">{product.name}</th>
                <td>{product.angle}</td>
                <td className={styles.tableActions}><a href={product.liveUrl} target="_blank" rel="noopener">Visit {product.name}</a> · <Link to={`/ecosystem/${product.id}`}>Details</Link></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className={view === 'grid' ? styles.grid : styles.list}>
          {cards.map((product, index) => <ProductCard key={product.id} product={product} first={index === 0} />)}
        </div>
      )}
    </section>
  );
}

/** One carousel before the Docusaurus footer, on every public docs page. */
export function EcosystemShowcase(): ReactNode {
  const [first, setFirst] = useState(0);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden);
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const visibility = () => setHidden(document.hidden);
    const preference = () => setReduced(motion.matches);
    motion.addEventListener('change', preference);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      motion.removeEventListener('change', preference);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => {
    if (paused || engaged || hidden || reduced) return undefined;
    const timer = window.setTimeout(() => setFirst((current) => (current + 1) % cards.length), 10_000);
    return () => window.clearTimeout(timer);
  }, [engaged, first, hidden, paused, reduced]);
  const visible = Array.from({ length: Math.min(3, cards.length) }, (_, offset) => cards[(first + offset) % cards.length]).filter((product): product is Product => product !== undefined);
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false);
  };
  return (
    <section className={styles.showcase} aria-labelledby="docs-ecosystem-heading" onMouseEnter={() => setEngaged(true)} onMouseLeave={() => setEngaged(false)} onFocusCapture={() => setEngaged(true)} onBlurCapture={onBlur}>
      <div className="container">
        <div className={styles.showcaseHead}>
          <div><p className={styles.kicker}>The table gets bigger</p><h2 id="docs-ecosystem-heading">More from Zaions</h2></div>
          <Link to="/ecosystem">See all products from Zaions</Link>
        </div>
        <div className={styles.stage}>{visible.map((product, offset) => <ProductCard key={product.id} product={product} first={offset === 0} />)}</div>
        <div className={styles.controls} role="group" aria-label="More from Zaions controls">
          <button type="button" onClick={() => setFirst((current) => (current - 1 + cards.length) % cards.length)}>Previous products</button>
          <button type="button" onClick={() => setPaused((current) => !current)}>{paused ? 'Play slides' : 'Pause slides'}</button>
          <button type="button" onClick={() => setFirst((current) => (current + 1) % cards.length)}>Next products</button>
          <span className={styles.count} aria-live="polite">{first + 1} of {cards.length}</span>
        </div>
      </div>
    </section>
  );
}
