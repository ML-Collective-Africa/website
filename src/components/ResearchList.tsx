import Link from 'next/link';
import type { Paper } from '@/lib/types';
import { GridIcon, ListIcon } from './icons';

export type View = 'list' | 'grid';

export function paperHref(p: Pick<Paper, 'slug'>) {
  return `/research/papers/${p.slug}`;
}

/** Published papers as rule-separated rows or as a grid. Headings use the given level. */
export function ResearchList({ papers, view, heading = 'h3' }: { papers: Paper[]; view: View; heading?: 'h2' | 'h3' }) {
  const H = heading;
  if (view === 'grid') {
    return (
      <ul className="entry-grid">
        {papers.map((p) => (
          <li key={p.id}>
            <span className="meta" style={{ color: 'var(--text-2)' }}>
              Paper / {p.venue}
            </span>
            <H>
              <Link className="row-title" href={paperHref(p)}>
                {p.title}
              </Link>
            </H>
            <p className="row__authors">{p.authors}</p>
            <div>
              <span className="tag">{p.topic}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="rule-list">
      {papers.map((p) => (
        <li key={p.id} className="row row--260">
          <div className="row__main">
            <H className="row__title">
              <Link className="row-title" href={paperHref(p)}>
                {p.title}
              </Link>
            </H>
            <p className="row__authors">{p.authors}</p>
          </div>
          <div className="row__side" style={{ gap: 10 }}>
            <span className="meta">Paper / {p.venue}</span>
            <span className="tag">{p.topic}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ViewToggle({ view, onChange, withIcons }: { view: View; onChange: (v: View) => void; withIcons?: boolean }) {
  return (
    <div role="group" aria-label="Layout" className="seg">
      <button type="button" aria-pressed={view === 'list'} onClick={() => onChange('list')}>
        {withIcons && <ListIcon />}List
      </button>
      <button type="button" aria-pressed={view === 'grid'} onClick={() => onChange('grid')}>
        {withIcons && <GridIcon />}Grid
      </button>
    </div>
  );
}
