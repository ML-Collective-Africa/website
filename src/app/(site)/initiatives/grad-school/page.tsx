import type { Metadata } from 'next';
import Link from 'next/link';
import { GradRoll } from '@/components/GradRoll';
import { Band, Col, Intro, TextLink, TwoCol } from '@/components/ui';
import { LINKS } from '@/content/links';
import { GRADS } from '@/content/site';

export const metadata: Metadata = { title: 'Grad school support' };

export default function GradSchoolPage() {
  return (
    <>
      <Intro
        title="Grad school support"
        lead="We’re a hands-on research community first. Our goal is to build research skills and get you working on interesting projects. Use MLC well, and things like grad school and internships tend to follow."
      >
        <p className="note">
          Support runs through a separate Discord group and the mailing list during application season. Ask in the main
          Discord to join.
        </p>
      </Intro>
      <Band white>
        <TwoCol>
          <Col>
            <h2 className="h2">Who it’s for</h2>
            <p className="prose">
              Support is selective. We prioritise active members who have research to show, made mainly through MLC, like
              a focus group paper.
            </p>
          </Col>
          <Col>
            <h2 className="h2">Getting there</h2>
            <p className="prose">
              If you’re not there yet, the usual route is <Link href="/programmes/cs197">CS197</Link>, then a{' '}
              <Link href="/programmes/focus-groups">focus group</Link>, then a workshop paper.
            </p>
            <div className="btn-row">
              <TextLink href={LINKS.feasibilityGuide}>Find a project worth working on first</TextLink>
              <TextLink href={LINKS.affiliationGuide}>Read the grad school and authorship guide</TextLink>
            </div>
          </Col>
        </TwoCol>
      </Band>
      <Band>
        <TwoCol>
          <Col>
            <h2 className="h2">What we help with</h2>
            <ul className="bullets">
              <li>Feedback on statements of purpose and CVs</li>
              <li>Choosing programmes and supervisors</li>
              <li>Mock interviews and application workshops</li>
              <li>Recommendation letters from people who’ve worked with you here</li>
              <li>Application fee waivers. In 2025 we set aside about $10,000 for these.</li>
              <li>A grad school handbook, in the works</li>
            </ul>
          </Col>
          <Col>
            <h2 className="h2">What committees look for</h2>
            <ul className="bullets">
              <li>Whether you can drive research on your own</li>
              <li>At least one first author conference paper, plus a workshop or second author paper or two</li>
              <li>A clear answer to “what exactly did you do on this paper?”</li>
              <li>Strong letters from people you’ve done research with</li>
            </ul>
          </Col>
        </TwoCol>
      </Band>
      <GradRoll people={GRADS} />
    </>
  );
}
