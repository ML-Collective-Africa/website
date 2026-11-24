'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Pager } from '@/components/Pager';
import { ResearchList, ViewToggle, type View } from '@/components/ResearchList';
import type { Paper } from '@/lib/types';
import { paginate } from '@/lib/utils';

const PER_PAGE = 5;
const ALL_TOPICS = 'All topics';
const ALL_YEARS = 'All years';

export function ResearchBrowser({ papers, topics, years }: { papers: Paper[]; topics: string[]; years: string[] }) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState(ALL_TOPICS);
  const [year, setYear] = useState(ALL_YEARS);
  const [view, setView] = useState<View>('list');
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return papers.filter(
      (p) =>
        (topic === ALL_TOPICS || p.topic === topic) &&
        (year === ALL_YEARS || p.year === year) &&
        (!q || p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q) || p.venue.toLowerCase().includes(q)),
    );
  }, [papers, query, topic, year]);

  const { pages, current, items } = paginate(results, page, PER_PAGE);
  const hasFilters = topic !== ALL_TOPICS || year !== ALL_YEARS || query.trim() !== '';
  const clear = () => {
    setQuery('');
    setTopic(ALL_TOPICS);
    setYear(ALL_YEARS);
    setPage(1);
  };
  const goTo = (n: number) => {
    setPage(n);
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section aria-label="Filter research" className="wrap research-filters">
        <div className="research-filters__bar">
          <div className="field" style={{ flex: '1 1 280px' }}>
            <label htmlFor="q" className="field__label field__label--sm">
              Search titles and authors
            </label>
            <input
              id="q"
              type="search"
              className="input input--sm"
              value={query}
              placeholder="For example, MICCAI or Oladepo"
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="research-filters__selects">
            <div className="field">
              <label htmlFor="topic" className="field__label field__label--sm">
                Topic
              </label>
              <select
                id="topic"
                className="select select--sm"
                style={{ minWidth: 200 }}
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setPage(1);
                }}
              >
                {[ALL_TOPICS, ...topics].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="year" className="field__label field__label--sm">
                Year
              </label>
              <select
                id="year"
                className="select select--sm"
                style={{ minWidth: 120 }}
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setPage(1);
                }}
              >
                {[ALL_YEARS, ...years].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="research-filters__status">
          <div className="btn-row" style={{ flexDirection: 'row', alignItems: 'center' }}>
            <p aria-live="polite" style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
              {results.length === 1 ? '1 result' : `${results.length} results`}
            </p>
            {hasFilters && (
              <button type="button" className="small-outline" onClick={clear}>
                Clear filters
              </button>
            )}
          </div>
          <span className="hide-mobile">
            <ViewToggle view={view} onChange={setView} />
          </span>
        </div>
      </section>

      <section id="results" aria-label="Results" className="wrap research-results">
        {results.length === 0 ? (
          <div className="empty-state">
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Nothing matches these filters</h2>
            <p>
              Try another topic or year, or check the spelling of a name. If a member’s work is missing, it may not be in
              the library yet.
            </p>
            <div className="btn-row" style={{ gap: 16 }}>
              <button type="button" className="btn btn--fill" onClick={clear}>
                Clear filters
              </button>
              <Link href="/research/submit" className="text-link">
                Submit your research
              </Link>
            </div>
          </div>
        ) : (
          <ResearchList papers={items} view={view} heading="h2" />
        )}
        <Pager label="Research pages" page={current} pages={pages} onPage={goTo} />
        <Link href="/research/submit" className="btn btn--outline show-mobile" style={{ marginTop: 24 }}>
          Submit your research
        </Link>
      </section>
    </>
  );
}
