'use client';

import { useMemo, useState } from 'react';
import type { GradStudent } from '@/content/site';
import { paginate } from '@/lib/utils';
import { Pager } from './Pager';

const ALL = 'All years';

export function GradRoll({ people }: { people: GradStudent[] }) {
  const years = useMemo(() => Array.from(new Set(people.map((p) => p.year))).sort().reverse(), [people]);
  const tabs = years.length > 1 ? [...years, ALL] : years;
  const [year, setYear] = useState(years[0] ?? ALL);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return people.filter(
      (p) =>
        (year === ALL || p.year === year) &&
        (!s || p.name.toLowerCase().includes(s) || p.school.toLowerCase().includes(s) || p.course.toLowerCase().includes(s)),
    );
  }, [people, year, q]);
  const { items, pages, current } = paginate(list, page, 10);

  return (
    <section aria-labelledby="gs-h" className="band band--white">
      <div className="wrap band__inner" style={{ gap: 24 }}>
        <div className="home-block__head" style={{ alignItems: 'flex-end' }}>
          <div className="stack-8">
            <h2 id="gs-h" className="h2">
              Our members in grad school
            </h2>
            <p className="prose">Where members are studying, by the year they started.</p>
          </div>
          <div className="field" style={{ width: 280, maxWidth: '100%' }}>
            <label htmlFor="gs-q" className="field__label field__label--sm">
              Find someone or a school
            </label>
            <input
              id="gs-q"
              type="search"
              className="input input--sm"
              placeholder="For example, Oxford"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div role="tablist" aria-label="Year started" className="tabs">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              className="tab"
              aria-selected={t === year}
              onClick={() => {
                setYear(t);
                setPage(1);
              }}
            >
              {t} <span className="tab__count">{t === ALL ? people.length : people.filter((p) => p.year === t).length}</span>
            </button>
          ))}
        </div>
        <div role="tabpanel" aria-label={year}>
          {items.length > 0 ? (
            <ul className="name-cols">
              {items.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong>
                  <span>{p.course ? `${p.degree}, ${p.course}` : p.degree}</span>
                  <span>{p.school}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, fontSize: 16, color: 'var(--text-2)' }}>No one matches that yet. Try another name or school.</p>
          )}
          <Pager label="Grad school pages" page={current} pages={pages} onPage={setPage} />
        </div>
      </div>
    </section>
  );
}
