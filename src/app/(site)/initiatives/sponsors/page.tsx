import type { Metadata } from 'next';
import { Band, ButtonLink, Col, Intro, TwoCol } from '@/components/ui';
import { getLinks } from '@/lib/cms';
import { SPONSORS } from '@/content/site';

export const metadata: Metadata = { title: 'Sponsors' };

export default async function SponsorsPage() {
  const links = await getLinks();
  return (
    <>
      <Intro title="Sponsors" lead="The organisations that have backed our work. Thank you." />
      <Band>
        <h2 className="h2">Past sponsors</h2>
        <ul className="sponsor-grid">
          {SPONSORS.map((s) => (
            <li key={s.name}>
              <span className="sponsor-grid__name">{s.name}</span>
              <span className="sponsor-grid__note">{s.note}</span>
            </li>
          ))}
          <li className="sponsor-grid__yours">
            <span style={{ fontSize: 16, fontWeight: 600 }}>Your organisation</span>
            <a href="#partner" className="sponsor-grid__note">
              See how to partner with us below
            </a>
          </li>
        </ul>
      </Band>
      <Band white>
        <h2 id="partner" className="h2">
          Partner with us
        </h2>
        <TwoCol>
          <Col>
            <p className="prose">
              MLC Africa is more than a training community. Our members publish at venues like ACL, Interspeech and MICCAI
              workshops, build products that win hackathons and raise funding, and work on problems that matter to the
              continent.
            </p>
          </Col>
          <Col>
            <ul className="bullets">
              <li>Sponsor a challenge or hackathon</li>
              <li>Fund members’ travel to conferences</li>
              <li>Offer compute or API credits</li>
              <li>Host interns from our community</li>
              <li>Speak at a Sunday Special</li>
            </ul>
            <div className="btn-row">
              <ButtonLink href={`mailto:${links.email}`}>Email us</ButtonLink>
            </div>
          </Col>
        </TwoCol>
      </Band>
    </>
  );
}
