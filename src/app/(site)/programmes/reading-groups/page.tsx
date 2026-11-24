import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLink, Band, Col, Intro, TextLink, TwoCol } from '@/components/ui';
import { LINKS } from '@/content/links';
import { getReading } from '@/lib/cms';

export const metadata: Metadata = { title: 'Saturday Reading Groups' };

export default async function ReadingGroupsPage() {
  const { current, past } = await getReading();
  return (
    <>
      <Intro
        title="Saturday Reading Groups"
        lead="A good way to get comfortable reading papers. Each month has a theme, and every Saturday we read one paper on it together, with everyone taking a part in the discussion."
      />
      {current && (
        <Band id="this-month">
          <h2 className="h2">This month: {current.theme.charAt(0).toLowerCase() + current.theme.slice(1)}</h2>
          <ul className="rule-list">
            {current.papers.map((p, i) => (
              <li key={p.id} className="row">
                <div className="row__main">
                  <h3 className="row__title">{p.title}</h3>
                  {(p.note || i === 0) && (
                    <p className="row__desc">
                      {p.note || 'The first Saturday of each month is a survey paper, to set up the theme.'}
                    </p>
                  )}
                </div>
                <div className="row__side">
                  <span className="row__meta">{p.date}</span>
                  {p.slides && <a href={p.slides}>Slides</a>}
                </div>
              </li>
            ))}
          </ul>
        </Band>
      )}
      <Band white>
        <TwoCol>
          <Col>
            <h2 className="h2">How the discussion works</h2>
            <p className="prose">
              We use a role playing format. Each person takes a role, like the reviewer who judges the paper, the
              archaeologist who finds the older work it builds on, or the researcher who proposes a follow up project.
            </p>
            <p className="prose">
              If you take a role, you bring a few slides or a short code demo. If you’d rather just listen, that’s fine too.
            </p>
            <div className="btn-row">
              <TextLink href={LINKS.readingFormat}>Read about the format</TextLink>
              <TextLink href={LINKS.readingSchedule}>See the full schedule</TextLink>
            </div>
          </Col>
          {past.length > 0 && (
            <Col>
              <h2 className="h2">Past themes</h2>
              <p className="prose">Missed a month? Every past theme is saved with its papers and slides.</p>
              <ArrowLink href="/programmes/reading-groups/past-themes">See past themes</ArrowLink>
            </Col>
          )}
        </TwoCol>
      </Band>
      {!current && (
        <Band>
          <p className="prose">
            This month’s reading list isn’t up yet. Check the <Link href={LINKS.readingSchedule}>full schedule</Link>.
          </p>
        </Band>
      )}
    </>
  );
}
