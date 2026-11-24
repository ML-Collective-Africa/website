import type { Metadata } from 'next';
import Link from 'next/link';
import { Banner, Band, Col, PlaceholderMedia, TwoCol } from '@/components/ui';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <>
      <section className="wrap about-hero">
        <div className="col" style={{ gap: 18 }}>
          <h1 className="h1">About MLC Africa</h1>
          <p className="lead">
            We’re a community of ML and AI researchers across Africa, and one of the most operationally active research
            communities on the continent. We started in 2023 as ML Collective Nigeria and opened up to the whole
            continent at the end of 2025.
          </p>
          <p className="lead" style={{ fontSize: 18 }}>
            We believe research should be open. Our reading lists, guides and papers are public, members get credit for
            their work, and joining is free. You’ll find people here working in biology, linguistics, medicine and the
            humanities, not just computer science.
          </p>
        </div>
        <PlaceholderMedia label="Community photo, for example members at the Deep Learning Indaba" soft ratio="auto" />
      </section>

      <section aria-labelledby="mlc-h" className="band band--white">
        <div className="wrap about-split">
          <h2 id="mlc-h" className="h2">
            Part of ML Collective
          </h2>
          <div className="col about-split__body" style={{ gap: 16 }}>
            <p className="prose">
              ML Collective is an independent, volunteer run non-profit founded by Rosanne Liu and Jason Yosinski. It
              exists so that research collaboration and mentorship are free and open to anyone.
            </p>
            <p className="prose">
              We share MLC’s calendar, wiki and project library, and we run our own study groups, focus groups, Sunday
              Specials and mentorship. If you publish with us, here’s{' '}
              <a href="#publishing">how to list MLC as your affiliation</a>.
            </p>
          </div>
        </div>
      </section>

      <Band>
        <h2 id="publishing" className="h2">
          Publishing with MLC
        </h2>
        <TwoCol>
          <Col>
            <p className="prose">
              List ML Collective as an affiliation if the project started in a focus group, you learned through CS197 or
              the reading groups, or you used MLC resources like compute grants, feedback or mentors you met here. You can
              list your primary institution, if you have one and it’s relevant to your work, alongside ML Collective.
            </p>
          </Col>
          <Col>
            <p className="prose">
              If MLC helped but nobody from MLC worked on the paper, thank us in your acknowledgements instead. For
              authorship, the rule is simple: whoever did the work gets the credit.
            </p>
            <div className="btn-row">
              <Link href="/programmes/focus-groups#authorship" className="text-link">
                Read the authorship guide
              </Link>
            </div>
          </Col>
        </TwoCol>
      </Band>

      <Band white>
        <TwoCol>
          <Col>
            <h2 className="h2">The people behind it</h2>
            <p className="prose">MLC Africa is run by volunteers, with advice from ML Collective’s founders.</p>
          </Col>
          <Col>
            <div className="btn-row">
              <Link href="/about/organisers" className="btn btn--outline">
                Meet the organisers
              </Link>
              <Link href="/about/torchbearers" className="text-link">
                Torchbearers
              </Link>
            </div>
          </Col>
        </TwoCol>
      </Band>

      <Banner
        title="There’s a seat for you here. Come say hello at our next Sunday Special."
        cta="How to join"
        href="/join"
      />
    </>
  );
}
