import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, Banner, ButtonLink, Col, Intro, TextLink, TwoCol } from '@/components/ui';
import { LINKS } from '@/content/links';
import { CS197_ASSIGNMENTS } from '@/content/site';
import { getCs197 } from '@/lib/cms';

export const metadata: Metadata = { title: 'CS197 Study Group' };

export default async function CS197Page() {
  const cohort = await getCs197();
  return (
    <>
      <Intro
        title="CS197 Study Group"
        lead="If you’re new to research, you can start here. We go through Harvard’s AI Research Experiences course together, one assignment at a time, with people learning right alongside you."
      >
        {cohort.show && cohort.title && (
          <div className="callout">
            <div className="callout__text">
              <span className="callout__title">{cohort.title}</span>
              {cohort.sub && <span className="callout__sub">{cohort.sub}</span>}
            </div>
            <ButtonLink href={cohort.href}>{cohort.cta}</ButtonLink>
          </div>
        )}
      </Intro>

      <Band white>
        <TwoCol>
          <Col>
            <h2 className="h2">How it works</h2>
            <p className="prose">
              We meet on Fridays at 8pm WAT. A new cohort starts every four months, so there are three a year. Each one
              works through six assignments and a final project, and most people spend 3 to 8 hours a week on it. Along
              the way you learn how to read papers, run experiments and write up what you found, the same things you’ll
              do in a focus group.
            </p>
          </Col>
          <Col>
            <h2 className="h2">What you need</h2>
            <p className="prose">Comfort with Python and a little machine learning. You don’t need any research experience.</p>
            <div className="btn-row">
              <TextLink href={LINKS.cs197Course}>See the course</TextLink>
            </div>
          </Col>
        </TwoCol>
      </Band>

      <Band>
        <h2 className="h2">What you’ll work through</h2>
        <ol className="steps">
          {CS197_ASSIGNMENTS.map((a, i) => (
            <li key={a.name}>
              <span className="steps__label">Assignment {i + 1}</span>
              <span className="steps__name">
                <span className="hide-mobile">{i + 1}. </span>
                {a.name}
              </span>
              <span className="steps__body">{a.body}</span>
            </li>
          ))}
        </ol>
        <h3 className="h3">The final project</h3>
        <p className="prose">
          You finish with a small research project of your own. You write it up as a short technical report and present it
          to the cohort with a few slides.
        </p>
      </Band>

      <Band white>
        <h2 className="h2">After the course</h2>
        <p className="prose">
          Most people move on to a focus group to work on their first paper, or join the Saturday reading group to keep
          reading.
        </p>
        <div className="btn-row">
          <Link href="/programmes/focus-groups" className="btn btn--outline">
            Focus Groups
          </Link>
          <Link href="/programmes/reading-groups" className="btn btn--outline">
            Reading Groups
          </Link>
        </div>
      </Band>

      <div className="show-mobile" style={{ flexDirection: 'column' }}>
        <Banner title="There’s a seat for you here. Come say hello at our next Sunday Special." cta="How to join" href="/join" />
      </div>
    </>
  );
}
