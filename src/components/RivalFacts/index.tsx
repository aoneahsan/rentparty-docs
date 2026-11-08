import React, { type ReactNode } from 'react';
import facts from '@site/src/data/compare-facts.json';
import styles from './styles.module.css';

/**
 * The dated fact table on a "Moving to Rent Party" page. Its data is `src/data/compare-facts.json`, a copy of the game
 * repository's competitor file without its internal evidence; the game's contract test holds the two equal. Every link
 * to another product is `nofollow`: it is there so a reader can check us.
 */

type Row = { readonly status: string; readonly source?: string };
type Price = {
  readonly plan: string;
  readonly amount: number | null;
  readonly period: string;
  readonly note: string;
  readonly source: string;
  readonly checkedOn: string;
};
type Rival = {
  readonly slug: string;
  readonly name: string;
  readonly officialUrl: string;
  readonly lastChecked: string;
  readonly prices: readonly Price[];
  readonly features: Readonly<Record<string, Row>>;
};

const RIVALS = facts.competitors as unknown as readonly Rival[];
const OURS = facts.ours as Readonly<Record<string, Row>>;

/** A rival's silence is never printed as a no. */
const CALLS: Readonly<Record<string, string>> = {
  yes: 'Yes',
  no: 'No',
  partial: 'Partly',
  'not-stated': 'Not stated on the pages we checked',
};

/** A day as the page prints it. */
const printed = (day: string): string =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${day}T00:00:00Z`)
  );

/** A price as their page states it. */
function amount({ amount: value, period }: Price): string {
  if (value === null) return 'No price shown';
  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
  if (period === 'month') return `${money} a month`;
  if (period === 'year') return `${money} a year`;
  return money;
}

/** A link out to another product: a new tab, no opener or referrer, and never followed. */
function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow">
      {children}
    </a>
  );
}

/**
 * The prices and the rows for one rival, with their sources and the day they were read. `hideNotStated` drops the
 * side-by-side rows their pages did not state; the guide then says once which those were.
 */
export default function RivalFacts({
  slug,
  hideNotStated = false,
}: {
  slug: string;
  hideNotStated?: boolean;
}): ReactNode {
  const rival = RIVALS.find((candidate) => candidate.slug === slug);
  if (rival === undefined) throw new Error(`No rival named ${slug} in compare-facts.json.`);
  return (
    <div className={styles.facts}>
      <p>
        Last checked <time dateTime={rival.lastChecked}>{printed(rival.lastChecked)}</time>.{' '}
        <Out href={rival.officialUrl}>Check {rival.name} yourself</Out>. If their page says
        something different now, believe their page.
      </p>
      <h3 id="their-prices">{rival.name}’s prices</h3>
      <div className={styles.scroll}>
        <table>
          <thead>
            <tr>
              <th scope="col">Plan</th>
              <th scope="col">Price</th>
              <th scope="col">Their note</th>
              <th scope="col">Read on</th>
            </tr>
          </thead>
          <tbody>
            {rival.prices.map((price) => (
              <tr key={price.plan}>
                <th scope="row">{price.plan}</th>
                <td>{amount(price)}</td>
                <td>{price.note}</td>
                <td>
                  <Out href={price.source}>{printed(price.checkedOn)}</Out>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Our own prices and limits are on the{' '}
        <a href="https://rentparty.aoneahsan.com/pricing">Pricing page</a>, with the date they were
        set.
      </p>
      <h3 id="side-by-side">Side by side</h3>
      <div className={styles.scroll}>
        <table>
          <thead>
            <tr>
              <th scope="col">At the table</th>
              <th scope="col">Rent Party</th>
              <th scope="col">{rival.name}</th>
              <th scope="col">Where we read it</th>
            </tr>
          </thead>
          <tbody>
            {facts.features.map(({ key, label }) => {
              const theirs = rival.features[key] ?? { status: 'not-stated' };
              if (hideNotStated && theirs.status === 'not-stated') return null;
              return (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  <td>{CALLS[OURS[key]?.status ?? 'no']}</td>
                  <td>{CALLS[theirs.status]}</td>
                  <td>{theirs.source === undefined ? null : <Out href={theirs.source}>Their page</Out>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
