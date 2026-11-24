import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, Intro } from '@/components/ui';
import { LINKS } from '@/content/links';
import { INTERNS, INTERNSHIP_PANELS } from '@/content/site';

export const metadata: Metadata = { title: 'Internships' };

export default function InternshipsPage() {
  const panels = INTERNSHIP_PANELS.filter((p) => p.href);
  return (
    <>
      <Intro
        title="Internships"
        lead="A running list of open research internships, kept up to date by members. We also help each other apply to programmes like Google Summer of Code and Outreachy."
      />
      <Band white>
        <h2 className="h2">Open opportunities</h2>
        <div className="doc-embed">
          <div className="doc-embed__bar">
            <a href={LINKS.opportunitiesDoc} className="text-link" style={{ fontSize: 14 }}>
              Open in Google Docs
            </a>
          </div>
          <div className="doc-embed__frame">
            <div className="doc-embed__fallback">
              <strong>The live Google Doc shows here</strong>
              <span>If it doesn’t load, use Open in Google Docs above.</span>
            </div>
            <iframe title="Research internship opportunities" src={LINKS.opportunitiesEmbed} loading="lazy" />
          </div>
        </div>
        <p className="note">Seen an internship that isn’t here? Add it to the doc so everyone can find it.</p>
      </Band>
      <section className="band">
        <div className="wrap band__inner" style={{ gap: 32 }}>
          <div className="stack-8" style={{ gap: 10 }}>
            <h2 className="h2">Our interns</h2>
            <p className="prose">
              Members who’ve gone on to research internships. Fellowships have{' '}
              <Link href="/programmes/fellowships">their own page</Link>.
            </p>
          </div>
          {INTERNS.map((y) => (
            <div key={y.year} className="year-group">
              <h3 className="year-group__year">{y.year}</h3>
              <ul className="tile-list">
                {y.people.map((p, i) => (
                  <li key={`${p.name}-${i}`}>
                    <strong>{p.name}</strong>
                    <span>{p.where}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {panels.length > 0 && (
            <div className="stack-8" style={{ gap: 10, marginTop: 12 }}>
              {panels.map((p) => (
                <a key={p.date} href={p.href} className="call">
                  <span className="stack-8" style={{ gap: 2 }}>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>{p.title}</span>
                    <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{p.date}</span>
                  </span>
                  <span className="call__cta">
                    Recording <span aria-hidden="true">→</span>
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
