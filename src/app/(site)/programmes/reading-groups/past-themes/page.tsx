import type { Metadata } from 'next';
import { Pager } from '@/components/Pager';
import { ArrowLink } from '@/components/ui';
import { getReading } from '@/lib/content';
import { pageParam, paginate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Reading Groups, past themes' };
export const dynamic = 'force-dynamic';

export default async function PastThemesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const { past } = await getReading();
  const { items, pages, current } = paginate(past, pageParam(page), 4);
  return (
    <>
      <section className="wrap intro intro--tight">
        <ArrowLink href="/programmes/reading-groups" back>
          Reading Groups
        </ArrowLink>
        <h1 className="h1">Past themes</h1>
        <p className="lead">
          Every month we pick a theme and read four or five papers on it. Here’s what we’ve covered, with the slides from
          each session.
        </p>
      </section>
      {items.map((m, i) => (
        <section key={m.key} className={`band${i % 2 === 0 ? ' band--white' : ''}`}>
          <div className="wrap theme">
            <div className="stack-8">
              <span className="eyebrow">{m.label}</span>
              <h2 className="theme__title">{m.theme}</h2>
            </div>
            <ul className="theme__list">
              {m.papers.map((p) => (
                <li key={p.id} className="lift">
                  <span>{p.title}</span>
                  {p.slides && <a href={p.slides}>Slides</a>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
      {items.length === 0 && (
        <section className="band">
          <div className="wrap band__inner">
            <p className="prose">No past themes yet.</p>
          </div>
        </section>
      )}
      <section className="band">
        <div className="wrap" style={{ paddingBottom: 56 }}>
          <Pager label="Past themes pages" page={current} pages={pages} hrefFor={(n) => `/programmes/reading-groups/past-themes?page=${n}`} />
        </div>
      </section>
    </>
  );
}
