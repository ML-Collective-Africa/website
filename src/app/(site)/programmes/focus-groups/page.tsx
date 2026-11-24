import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, ButtonLink, Col, Intro, TwoCol } from '@/components/ui';
import { LINKS } from '@/content/links';

export const metadata: Metadata = { title: 'Focus Groups' };

export default function FocusGroupsPage() {
  return (
    <>
      <Intro
        title="Focus Groups"
        lead="Bring a research idea, or join others to come up with one, and work toward a publication as a small, focused team of three to five."
      >
        <div className="btn-row">
          <ButtonLink href={LINKS.focusGroupGuide}>Read the Focus Group Guide</ButtonLink>
          <ButtonLink href={LINKS.activeGroupsSlides} variant="outline">
            Browse active groups
          </ButtonLink>
        </div>
      </Intro>

      <Band white>
        <TwoCol>
          <Col>
            <h2 className="h2">Before you start</h2>
            <ul className="bullets">
              <li>Plan for 4 to 12 hours a week. Groups move fast, so steady time matters more than big bursts.</li>
              <li>
                New to research? Do the <Link href="/programmes/cs197">CS197 Study Group</Link> first. It covers most of
                what you’ll need.
              </li>
              <li>To start a new group you need at least three committed people and a clear research question.</li>
              <li>Each group shares its progress on the Sunday Special, so the community can give feedback early.</li>
            </ul>
          </Col>
          <Col>
            <h2 className="h2">No group in your area?</h2>
            <p className="prose">
              Find two or three people who care about the same problem and propose a new group. We’ll help you sharpen
              the idea and find mentors.
            </p>
            <p className="note">The Focus Group Guide explains how to join, start or lead a group.</p>
            <div className="btn-row">
              <ButtonLink href={LINKS.focusGroupGuide} variant="outline">
                Focus Group Guide
              </ButtonLink>
            </div>
          </Col>
        </TwoCol>
      </Band>

      <Band>
        <TwoCol>
          <Col>
            <h2 className="h2">How a focus group runs</h2>
            <p className="prose">
              Aim for a first workshop submission within three to six months. If you reach eight months without one,
              rethink the scope or change direction.
            </p>
            <p className="prose">
              After the workshop, use the feedback to find an outside mentor and grow the work into a conference paper.
              That’s the real goal.
            </p>
          </Col>
          <Col>
            <ul className="bullets">
              <li>
                Upload to arXiv after every workshop submission, even if it’s rejected. If it’s your first time on arXiv
                and you need an endorsement, MLC can help.
              </li>
              <li>Present your finished work at a Sunday Special, with the arXiv link.</li>
              <li>Keep a shared doc where everyone logs what they did each week.</li>
            </ul>
          </Col>
        </TwoCol>
      </Band>

      <Band white>
        <h2 className="h2">Guides for your project</h2>
        <ul className="bullets">
          <li>
            <a href={LINKS.feasibilityGuide}>Check if your idea is feasible as a research project</a>
          </li>
          <li>
            <a href={LINKS.experimentsGuide}>Running experiments, academic writing and choosing where to publish</a>
          </li>
          <li>
            <a href={LINKS.affiliationGuide}>Paper ownership, authorship and using the MLC affiliation</a>
          </li>
          <li>
            <a href={LINKS.mentorOutreach}>Reaching out to mentors outside MLC</a>, with email templates
          </li>
        </ul>
      </Band>

      <Band>
        <h2 id="authorship" className="h2">
          Authorship, in short
        </h2>
        <TwoCol>
          <Col>
            <ul className="bullets">
              <li>Whoever did the work gets the credit.</li>
              <li>
                Writing code, running experiments and writing the paper earn authorship. An idea on its own earns an
                acknowledgement.
              </li>
              <li>
                The first author is usually the person who drove the project: most of the implementation and writing, and
                the key decisions when things got stuck.
              </li>
            </ul>
          </Col>
          <Col>
            <ul className="bullets">
              <li>Agree on what counts for authorship before you start, and check in as you go.</li>
              <li>Two to five authors is ideal. Nine or more is a red flag unless the project is really large.</li>
              <li>If you disagree, talk to each other first, then to the focus group moderators or MLC leads.</li>
            </ul>
          </Col>
        </TwoCol>
      </Band>

      <Band white>
        <h2 className="h2">Using the MLC affiliation</h2>
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
              If MLC helped but nobody from MLC worked on the paper, add a line to your acknowledgements instead, like “We
              thank the ML Collective community for feedback and support.”
            </p>
          </Col>
        </TwoCol>
      </Band>

      <Band>
        <TwoCol>
          <Col>
            <h2 id="present" className="h2">
              Present your project to the community
            </h2>
            <p className="prose">
              Working on something on your own? Present it at a Sunday Special and get feedback from the whole community.
              Fill in the form and a focus group moderator will find you a slot.
            </p>
          </Col>
          <Col>
            <div className="btn-row">
              <ButtonLink href={LINKS.sundaySlotForm}>Request a slot</ButtonLink>
            </div>
            <p className="note">Questions about focus groups? Ask the moderators in the #focus-groups channel on Discord.</p>
          </Col>
        </TwoCol>
      </Band>
    </>
  );
}
