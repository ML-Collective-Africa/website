import type { Metadata } from 'next';
import { Band, ButtonLink, Col, Intro, TwoCol } from '@/components/ui';
import { LINKS } from '@/content/links';

export const metadata: Metadata = { title: 'ML Systems Study Group' };

export default function MLSystemsPage() {
  return (
    <>
      <Intro
        title="ML Systems Study Group"
        lead="Learn how machine learning systems are built and run, from training to deployment. We work through the Machine Learning Systems textbook together, week by week."
      >
        <div className="btn-row">
          <ButtonLink href={LINKS.mlSystemsCurriculum}>Read the curriculum</ButtonLink>
          <ButtonLink href={LINKS.calendar} variant="outline">
            Add the calendar
          </ButtonLink>
        </div>
      </Intro>
      <Band white>
        <TwoCol>
          <Col>
            <h2 className="h2">What we use</h2>
            <p className="prose">
              Machine Learning Systems, Volume I, by Vijay Janapa Reddi, published by Harvard and MIT Press in 2026. The
              book is free to read. Alongside it we use TinyTorch for hands on labs, plus the book’s lecture slides.
            </p>
          </Col>
          <Col>
            <h2 className="h2">How it runs</h2>
            <p className="prose">
              Volume I takes 26 weeks, after a short setup week. Each week covers one part of the book, with a lab to try
              before the session. We meet on Thursdays at 9pm WAT.
            </p>
          </Col>
        </TwoCol>
      </Band>
      <Band>
        <h2 className="h2">Who it’s for</h2>
        <p className="prose">
          Anyone who wants to understand what happens beyond the model: data pipelines, training at scale, and getting
          models to run on real hardware. Some Python and machine learning helps.
        </p>
      </Band>
    </>
  );
}
