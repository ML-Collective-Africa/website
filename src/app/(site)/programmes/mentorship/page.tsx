import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, ButtonLink, Col, Intro, TwoCol } from '@/components/ui';
import { LINKS } from '@/content/links';

export const metadata: Metadata = { title: 'Mentorship' };

export default function MentorshipPage() {
  return (
    <>
      <Intro
        title="Mentorship"
        lead="Once you have a workshop paper accepted, we can pair you with a PhD student, postdoc or researcher who can help you think through what comes next."
      >
        {(LINKS.menteeApply || LINKS.mentorApply) && (
          <div className="btn-row">
            <ButtonLink href={LINKS.menteeApply}>Apply as a mentee</ButtonLink>
            <ButtonLink href={LINKS.mentorApply} variant="outline">
              Become a mentor
            </ButtonLink>
          </div>
        )}
      </Intro>
      <Band white>
        <TwoCol>
          <Col>
            <h2 className="h2">How it works</h2>
            <p className="prose">
              Mentors give focused guidance: sharpening your question, planning experiments and deciding where to submit.
              They don’t do the work for you. Many members find mentors themselves, and the leads also recruit mentors
              and make matches.
            </p>
          </Col>
          <Col>
            <h2 className="h2">Who can apply</h2>
            <p className="prose">
              Active members, usually with early results accepted at a workshop and ready to grow them into a conference
              paper. We read every application before matching. If you’re not there yet, a focus group is the usual way
              to get there.
            </p>
            <div className="btn-row">
              <Link href="/programmes/focus-groups" className="text-link">
                Focus Groups
              </Link>
            </div>
          </Col>
        </TwoCol>
      </Band>
      <Band>
        <h2 className="h2">Reaching out to mentors outside MLC</h2>
        <p className="note">
          <a href={LINKS.mentorOutreach}>Read the full guide, with email templates</a>
        </p>
        <TwoCol>
          <Col>
            <ul className="bullets">
              <li>Be specific. Show you’ve read their work and ask a real technical question.</li>
              <li>Keep the first ask small, like a 15 minute call, not “will you mentor me”.</li>
              <li>Show momentum. Mention what you’ve already done, like a workshop paper.</li>
            </ul>
          </Col>
          <Col>
            <ul className="bullets">
              <li>Write to each person separately. No mass emails.</li>
              <li>Don’t promise authorship upfront. Talk about it only if their help becomes substantial.</li>
              <li>If there’s no reply after a week, follow up once, then let it go.</li>
            </ul>
          </Col>
        </TwoCol>
      </Band>
    </>
  );
}
