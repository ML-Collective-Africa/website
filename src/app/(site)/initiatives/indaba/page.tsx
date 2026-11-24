import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, Banner, Intro, PlaceholderMedia } from '@/components/ui';
import { INDABA_YEARS } from '@/content/site';

export const metadata: Metadata = { title: 'Indaba presence' };

export default function IndabaPage() {
  return (
    <>
      <Intro
        title={
          <>
            <span aria-hidden="true" className="indaba-rule" />
            <span className="indaba-eyebrow">Deep Learning Indaba</span>
            <h1 className="h1">Indaba presence</h1>
          </>
        }
        lead="We’ve shown up at the Deep Learning Indaba every year since 2022, as speakers, poster presenters, hackathon builders and organisers."
      />
      <Band>
        {INDABA_YEARS.map((y) => (
          <article key={y.year} className="indaba-year">
            <div className="col" style={{ gap: 12 }}>
              <div className="indaba-year__head">
                <h2 className="indaba-year__year">{y.year}</h2>
                {y.place && <span className="indaba-year__place">{y.place}</span>}
              </div>
              <ul className="label-list">
                {y.items.map((it) => (
                  <li key={it.label}>
                    <span className="label-list__label">{it.label}</span>
                    <span className="label-list__text">
                      {it.link && (
                        <>
                          Hosted{' '}
                          <Link href={it.link.href} className="indaba-link">
                            {it.link.text}
                          </Link>
                        </>
                      )}
                      {it.text.split('\n').map((line, i) => (
                        <span key={i}>
                          {i > 0 && <br />}
                          {line}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <PlaceholderMedia label={y.photo} />
          </article>
        ))}
      </Band>
      <Banner variant="indaba" title="See photos and videos from every Indaba in the gallery." cta="Open the gallery" href="/life/gallery" />
    </>
  );
}
