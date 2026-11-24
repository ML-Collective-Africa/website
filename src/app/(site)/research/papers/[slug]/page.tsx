import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalIcon } from '@/components/icons';
import { paperHref } from '@/components/ResearchList';
import { getPaper, getPublishedPapers } from '@/lib/content';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paper = await getPaper((await params).slug);
  return { title: paper?.title ?? 'Paper not found', description: paper?.summary };
}

export default async function PaperPage({ params }: Props) {
  const paper = await getPaper((await params).slug);
  if (!paper) notFound();

  const related = (await getPublishedPapers()).filter((p) => p.topic === paper.topic && p.id !== paper.id).slice(0, 3);
  const links = [
    { label: 'Read the paper', href: paper.links.paper },
    { label: 'Code', href: paper.links.code },
    { label: 'Slides', href: paper.links.slides },
    { label: 'Recording', href: paper.links.recording },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href));
  const facts = [
    { dt: 'Published at', dd: paper.venue },
    paper.date ? { dt: 'Date', dd: paper.date } : null,
    { dt: 'Topic', dd: paper.topic },
  ].filter((f): f is { dt: string; dd: string } => f !== null);

  return (
    <article>
      <header className="wrap entry-head">
        <Link href="/research" className="arrow-link">
          <span aria-hidden="true">←</span> Published research
        </Link>
        <h1 className="h1 entry-head__title">{paper.title}</h1>
        <p className="entry-head__authors">{paper.authors}</p>
        <dl className="facts">
          {facts.map((f) => (
            <div key={f.dt}>
              <dt>{f.dt}</dt>
              <dd>{f.dd}</dd>
            </div>
          ))}
        </dl>
        {links.length > 0 && (
          <div className="btn-row" style={{ marginTop: 6 }}>
            {links.map((l, i) => (
              <a key={l.label} href={l.href} className={`btn ${i === 0 ? 'btn--fill' : 'btn--outline'}`}>
                {l.label} <ExternalIcon />
              </a>
            ))}
          </div>
        )}
      </header>

      {(paper.summary || paper.abstract || paper.figure) && (
        <section className="band band--white">
          <div className="wrap band__inner">
            <div className="col" style={{ gap: 18, maxWidth: 760 }}>
              {paper.summary && (
                <>
                  <h2 className="h2" style={{ fontSize: 24 }}>
                    In short
                  </h2>
                  <p className="prose" style={{ fontSize: 19 }}>
                    {paper.summary}
                  </p>
                </>
              )}
              {paper.figure && (
                <figure style={{ margin: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={paper.figure.src} alt={paper.figure.alt} style={{ display: 'block', width: '100%', height: 'auto' }} />
                </figure>
              )}
              {paper.abstract && (
                <details className="abstract">
                  <summary>Read the abstract</summary>
                  <p>{paper.abstract}</p>
                </details>
              )}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="band">
          <div className="wrap band__inner" style={{ paddingBottom: 64, gap: 20 }}>
            <div className="related__head">
              <h2 className="h2" style={{ fontSize: 24 }}>
                More in {paper.topic}
              </h2>
              <Link href="/research" className="text-link">
                All published research
              </Link>
            </div>
            <ul className="related">
              {related.map((p) => (
                <li key={p.id}>
                  <Link href={paperHref(p)} className="card related__card">
                    <span className="related__venue">{p.venue}</span>
                    <span className="related__title">{p.title}</span>
                    <span className="related__authors">{p.authors}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
