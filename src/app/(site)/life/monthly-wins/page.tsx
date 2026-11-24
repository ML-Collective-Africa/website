import type { Metadata } from 'next';
import Link from 'next/link';
import { WithTitles } from '@/components/ui';
import { getPublishedWinMonths } from '@/lib/cms';
import { WIN_GROUPS } from '@/lib/wins';

export const metadata: Metadata = { title: 'Monthly wins' };

export default async function MonthlyWinsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month } = await searchParams;
  const months = await getPublishedWinMonths();
  const sel = months.find((m) => m.key === month) ?? months[0];
  const byYear = months.reduce<Record<string, typeof months>>((acc, m) => {
    const y = m.key.slice(0, 4);
    (acc[y] ||= []).push(m);
    return acc;
  }, {});
  const groups = sel
    ? WIN_GROUPS.map((g) => ({ title: g.title, items: sel.wins.filter((w) => (g.kinds as readonly string[]).includes(w.kind)) })).filter((g) => g.items.length)
    : [];

  return (
    <div className="wrap wins-page">
      <div className="col">
        <h1 className="h1">Monthly wins</h1>
        <p className="lead" style={{ fontSize: 18, maxWidth: 640 }}>
          Every month we celebrate what members have achieved, big or small. New internships, accepted papers, awards,
          talks and first contributions all count.
        </p>
      </div>

      <div className="wins-layout">
        <nav aria-label="Wins by month" className="wins-months">
          {Object.entries(byYear)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([year, list]) => (
              <div key={year} style={{ display: 'contents' }}>
                <span className="wins-months__year">{year}</span>
                {list.map((m) => (
                  <Link
                    key={m.key}
                    href={`/life/monthly-wins?month=${m.key}`}
                    className="wins-months__item"
                    aria-current={m.key === sel?.key ? 'page' : undefined}
                    scroll={false}
                  >
                    <span>{m.label.split(' ')[0]}</span>
                    <span className="wins-months__count">{m.wins.length}</span>
                  </Link>
                ))}
              </div>
            ))}
        </nav>

        <article aria-labelledby="u-h" className="wins-month">
          {sel ? (
            <>
              <div className="stack-8" style={{ gap: 10 }}>
                <h2 id="u-h" style={{ margin: 0, fontSize: 30, fontWeight: 700 }}>
                  {sel.label}
                </h2>
                {sel.note && <p className="prose">{sel.note}</p>}
              </div>
              {groups.length > 0 ? (
                <div className="col" style={{ gap: 28 }}>
                  {groups.map((g) => (
                    <section key={g.title} className="stack-8" style={{ gap: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{g.title}</h3>
                      <ul className="wins-list">
                        {g.items.map((w) => (
                          <li key={w.id}>
                            <WithTitles text={w.text} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="wins-none">
                  <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5 }}>We didn’t post wins for this month.</p>
                  <p style={{ margin: 0, fontSize: 15, color: 'var(--text-2)' }}>
                    Talks from that month may still be in <Link href="/research">Research</Link>.
                  </p>
                </div>
              )}
            </>
          ) : (
            <h2 id="u-h" style={{ margin: 0, fontSize: 24 }}>
              No wins posted yet
            </h2>
          )}
          <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--text-2)' }}>
            Had a win this month, or know someone who did? Reply to Steven’s monthly wins email thread and it’ll go into the
            next round.
          </p>
        </article>
      </div>
    </div>
  );
}
