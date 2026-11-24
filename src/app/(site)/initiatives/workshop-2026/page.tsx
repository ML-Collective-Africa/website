import type { Metadata } from 'next';
import { PlayIcon } from '@/components/icons';
import { Band, Col, Intro, PlaceholderMedia, TwoCol } from '@/components/ui';
import { LINKS } from '@/content/links';
import { SPONSORS } from '@/content/site';

export const metadata: Metadata = { title: 'Whose Intelligence? 2026 Workshop' };

export default function WorkshopPage() {
  return (
    <>
      <Intro
        title={
          <>
            <span aria-hidden="true" className="indaba-rule" />
            <span className="indaba-eyebrow">2026 Workshop</span>
            <h1 className="h1">Whose Intelligence?</h1>
          </>
        }
        lead="Building agentic AI in Africa without depending on frontier models. A 90 minute workshop we hosted at the Deep Learning Indaba 2026 in Lagos, where researchers, builders and policymakers talked about how Africa can move from adopting AI to owning it."
      >
        <div className="btn-row">
          <a href={LINKS.workshopSite} className="btn btn--fill btn--indaba">
            Visit the workshop site
          </a>
          <a href={LINKS.workshopChallenge} className="btn btn--outline btn--indaba-outline">
            See the challenge winners
          </a>
        </div>
      </Intro>
      <Band white>
        <h2 className="h2">Watch</h2>
        <div className="video-grid">
          {[
            ['Workshop highlights video', 'Workshop highlights, 3 minutes. Captions available.'],
            ['Community booth video', 'Our community booth at the Indaba, 2 minutes. Captions available.'],
          ].map(([label, caption]) => (
            <figure key={label} className="video">
              <PlaceholderMedia label={label} ratio="16 / 9">
                <span aria-hidden="true" className="video__play">
                  <PlayIcon />
                </span>
              </PlaceholderMedia>
              <figcaption>{caption}</figcaption>
            </figure>
          ))}
        </div>
      </Band>
      <Band>
        <TwoCol>
          <Col>
            <h2 className="h2">The preprint</h2>
            <p className="prose">
              Everything discussed at the workshop is being written up as an open preprint, with a community position on
              building AI in Africa.
            </p>
          </Col>
          <Col>
            <div className="soon">
              <span className="soon__title">Coming soon</span>
              <span className="soon__sub">The preprint will get its own page here once it’s out.</span>
            </div>
          </Col>
        </TwoCol>
      </Band>
      <Band white>
        <h2 className="h2">Sponsors</h2>
        <div className="logo-row">
          {SPONSORS.map((s) => (
            <div key={s.name} className="logo-tile">
              {s.name}
            </div>
          ))}
        </div>
        <p className="note">Thank you to Intron for partnering on the voice AI challenge, and to Adaption Labs for compute credits.</p>
      </Band>
    </>
  );
}
