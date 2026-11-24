import type { Metadata } from 'next';
import { Band, ButtonLink, Col, Intro, TwoCol } from '@/components/ui';
import { getAnnouncements, getLinks } from '@/lib/cms';
import { shortDate, watLabel } from '@/lib/utils';

export const metadata: Metadata = { title: 'Sunday Specials' };

export default async function SundaySpecialsPage() {
  const links = await getLinks();
  // Special sessions come from Announcements. A session counts as upcoming until the end of its day.
  const sessions = (await getAnnouncements()).filter((a) => a.kind === 'special-session');
  const cutoff = new Date(Date.now() - 6 * 3600e3).toISOString();
  const upcoming = [...sessions].reverse().find((s) => s.startsAt >= cutoff);
  const earlier = sessions.filter((s) => s.startsAt < cutoff);

  return (
    <>
      <Intro
        title="Sunday Specials"
        lead="Our weekly community call, every Sunday at 8pm WAT. Members present their work, then we catch up on community news."
      >
        <div className="btn-row">
          <ButtonLink href={links.calendar}>Add the MLC calendar to yours</ButtonLink>
        </div>
      </Intro>

      <Band white>
        <TwoCol>
          <Col>
            <h2 className="h2">What happens on a call</h2>
            <p className="prose">
              Members present what they’ve been working on, with questions and feedback after each one. Then we share
              community news and opportunities. It’s friendly, and nobody expects polished work.
            </p>
          </Col>
          <Col>
            <h2 className="h2">Recordings and notes</h2>
            <p className="prose">
              After each session, the recording and the Google Meet notes go on the MLC calendar. Add it to your own
              calendar and you’ll always have the call link, plus everything you need to catch up if you miss one.
            </p>
          </Col>
        </TwoCol>
      </Band>

      <section className="band">
        <div className="wrap band__inner">
          <div className="two-col">
            <Col>
              <h2 className="h2">Special sessions</h2>
              <p className="prose">
                Every now and then we give a whole Sunday to one topic, like internships, grad school or careers. We’ll
                announce it on Discord and the mailing list.
              </p>
            </Col>
            <div className="col" style={{ gap: 20 }}>
              {upcoming && (
                <div className="next-special">
                  <span className="next-special__when">Next special session · {watLabel(upcoming.startsAt)}</span>
                  <span className="next-special__title">{upcoming.title}</span>
                  {upcoming.details && <span className="next-special__detail">{upcoming.details}</span>}
                  <a href={links.calendar} className="text-link" style={{ marginTop: 4 }}>
                    Add it to your calendar
                  </a>
                </div>
              )}
              {earlier.length > 0 && (
                <div className="stack-8" style={{ gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)' }}>Earlier special sessions</span>
                  <ul className="plain-lines">
                    {earlier.map((s) => (
                      <li key={s.id}>
                        {s.title}, {shortDate(s.startsAt)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Band white>
        <TwoCol>
          <Col>
            <h2 className="h2">Present at a Sunday Special</h2>
            <p className="prose">
              Finished a paper, stuck on an experiment, or just started something new? All of it is welcome. Request a
              slot and we’ll find you a Sunday.
            </p>
          </Col>
          <Col>
            <div className="btn-row">
              <ButtonLink href={links.sundaySlotForm}>Request a slot</ButtonLink>
            </div>
          </Col>
        </TwoCol>
      </Band>
    </>
  );
}
