import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, Banner, Intro } from '@/components/ui';
import { LINKS } from '@/content/links';
import { getFocusGroups } from '@/lib/content';

export const metadata: Metadata = { title: 'Ongoing research' };
export const dynamic = 'force-dynamic';

export default async function OngoingPage() {
  const groups = await getFocusGroups();
  return (
    <>
      <Intro
        title="Ongoing research"
        lead="What our focus groups are working on right now. Each group is a small team of three to five members working toward a paper."
      >
        <div className="btn-row">
          <Link href="/programmes/focus-groups" className="btn btn--fill">
            Start or join a focus group
          </Link>
          <a href={LINKS.focusGroupUpdateForm} className="btn btn--outline">
            Update your group’s details
          </a>
        </div>
      </Intro>
      <Band>
        <ul className="rule-list">
          {groups.map((g) => (
            <li key={g.id} className="row">
              <div className="row__main">
                <h2 className="row__title">
                  {g.name}&nbsp; <span className="tag" style={{ fontWeight: 600, verticalAlign: 'middle' }}>{g.topic}</span>
                </h2>
                <p className="row__desc">{g.status}</p>
              </div>
              <div className="row__side">
                <span className="row__meta">{g.members}</span>
                {g.slides && <a href={g.slides}>Slides</a>}
              </div>
            </li>
          ))}
        </ul>
      </Band>
      <Banner title="Have an idea for a project, or want to join one?" cta="How focus groups work" href="/programmes/focus-groups" />
    </>
  );
}
