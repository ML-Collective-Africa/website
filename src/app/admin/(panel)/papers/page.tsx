import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminHead, Notice, Pill } from '@/components/admin/ui';
import { Pager } from '@/components/Pager';
import { readCollection } from '@/lib/store';
import { pageParam, paginate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Published papers' };

type Search = { q?: string; topic?: string; year?: string; status?: string; page?: string; saved?: string; deleted?: string };

export default async function AdminPapersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const papers = (await readCollection('papers')).sort((a, b) => b.order - a.order);
  const topics = Array.from(new Set(papers.map((p) => p.topic))).sort();
  const years = Array.from(new Set(papers.map((p) => p.year).filter(Boolean))).sort().reverse();
  const q = (sp.q ?? '').trim().toLowerCase();
  const filtered = papers.filter(
    (p) =>
      (!q || p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q) || p.venue.toLowerCase().includes(q)) &&
      (!sp.topic || p.topic === sp.topic) &&
      (!sp.year || p.year === sp.year) &&
      (!sp.status || (sp.status === 'Published' ? p.visible : !p.visible)),
  );
  const { items, pages, current } = paginate(filtered, pageParam(sp.page), 10);
  const hrefFor = (n: number) => {
    const params = new URLSearchParams(Object.entries({ q: sp.q, topic: sp.topic, year: sp.year, status: sp.status }).filter(([, v]) => v) as [string, string][]);
    params.set('page', String(n));
    return `/admin/papers?${params}`;
  };

  return (
    <>
      <AdminHead
        title="Published papers"
        sub="Everything on the Published research page. Hidden papers stay saved but don’t show on the site."
        action={
          <Link href="/admin/papers/new" className="a-btn">
            Add a paper
          </Link>
        }
      />
      {sp.saved && <Notice>Saved. The Published research page is up to date.</Notice>}
      {sp.deleted && <Notice>Paper deleted. You can undo it from Activity.</Notice>}

      <form method="get" className="a-filters">
        <div className="a-field" style={{ flex: '1 1 280px' }}>
          <label htmlFor="s" className="a-field__label">
            Search papers
          </label>
          <input id="s" name="q" type="search" defaultValue={sp.q} className="a-input" />
        </div>
        <div className="a-field">
          <label htmlFor="t" className="a-field__label">
            Topic
          </label>
          <select id="t" name="topic" defaultValue={sp.topic ?? ''} className="a-select">
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="a-field">
          <label htmlFor="y" className="a-field__label">
            Year
          </label>
          <select id="y" name="year" defaultValue={sp.year ?? ''} className="a-select">
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="a-field">
          <label htmlFor="st" className="a-field__label">
            Status
          </label>
          <select id="st" name="status" defaultValue={sp.status ?? ''} className="a-select">
            <option value="">Any status</option>
            <option>Published</option>
            <option>Hidden</option>
          </select>
        </div>
        <button type="submit" className="a-btn a-btn--ghost">
          Filter
        </button>
      </form>

      <div className="a-table-wrap">
        <table className="a-table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Authors</th>
              <th scope="col">Venue</th>
              <th scope="col">Year</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link className="rowlink" href={`/admin/papers/${p.id}`}>
                    {p.title}
                  </Link>
                  {p.featured && (
                    <span style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>On the homepage</span>
                  )}
                </td>
                <td>{p.authors}</td>
                <td>{p.venue}</td>
                <td>{p.year}</td>
                <td>{p.visible ? <Pill tone="ok">Published</Pill> : <Pill tone="muted">Hidden</Pill>}</td>
                <td>
                  <Link href={`/admin/papers/${p.id}`} className="text-link" aria-label={`Edit ${p.title}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} style={{ color: 'var(--text-2)' }}>
                  No papers match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-2)' }}>
        Showing {items.length} of {filtered.length} papers.
      </p>
      <Pager label="Paper pages" page={current} pages={pages} hrefFor={hrefFor} />
    </>
  );
}
