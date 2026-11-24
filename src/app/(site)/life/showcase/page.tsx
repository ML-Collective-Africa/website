import type { Metadata } from 'next';
import Link from 'next/link';
import { NotesIcon } from '@/components/icons';
import { Pager } from '@/components/Pager';
import { Intro } from '@/components/ui';
import { LINKS } from '@/content/links';
import { getShowcase } from '@/lib/content';
import { dayLabel, pageParam, paginate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Research showcase' };
export const dynamic = 'force-dynamic';

export default async function ShowcasePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const { items, pages, current } = paginate(await getShowcase(), pageParam(page), 3);
  return (
    <>
      <Intro
        title="Research showcase"
        lead={
          <>
            Every Sunday, selected members present their work. Check out what they talked about. Recordings and notes are
            on the <a href={LINKS.calendar}>MLC calendar</a>.
          </>
        }
      >
        <div className="btn-row">
          <Link href="/programmes/sunday-specials" className="btn btn--fill">
            Present your work
          </Link>
        </div>
      </Intro>
      <section className="band">
        <div className="wrap band__inner" style={{ gap: 40 }}>
          {items.map((s) => (
            <article key={s.id} className="session">
              <div className="stack-8">
                <h2 className="session__date">{dayLabel(s.date, true)}</h2>
                {s.notes && (
                  <>
                    <a href={s.notes} className="arrow-link">
                      <NotesIcon />
                      Meeting notes
                    </a>
                    <span className="session__notes-sub">Gemini notes from the call</span>
                  </>
                )}
              </div>
              <ol className="session__talks">
                {s.talks.map((t) => (
                  <li key={t.title}>
                    <span className="session__speaker">{t.speaker}</span>
                    <h3 className="session__title">{t.title}</h3>
                    <p className="session__summary">{t.summary}</p>
                    {t.slides && (
                      <a href={t.slides} className="text-link">
                        Slides
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </article>
          ))}
          <Pager label="Showcase pages" page={current} pages={pages} hrefFor={(n) => `/life/showcase?page=${n}`} />
        </div>
      </section>
    </>
  );
}
