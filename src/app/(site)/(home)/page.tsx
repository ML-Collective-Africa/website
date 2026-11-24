import Link from 'next/link';
import { LatestResearch } from '@/components/home/LatestResearch';
import { MembersMap } from '@/components/home/MembersMap';
import { ThisWeek } from '@/components/home/ThisWeek';
import { WithTitles } from '@/components/ui';
import { PATHS } from '@/content/site';
import { getFeaturedPapers, getHomepageAnnouncement, getLinks, getMapPlaces, getPublishedWinMonths, getThisWeek } from '@/lib/cms';
import { watLabel } from '@/lib/utils';


export default async function HomePage() {
  const [papers, months, special, week, places, links] = await Promise.all([
    getFeaturedPapers(4),
    getPublishedWinMonths(),
    getHomepageAnnouncement(),
    getThisWeek(),
    getMapPlaces(),
    getLinks(),
  ]);
  const latest = months[0];
  const wins = latest
    ? [...latest.wins.filter((w) => w.highlight), ...latest.wins.filter((w) => !w.highlight)].slice(0, 4)
    : [];

  return (
    <main id="content">
      <section aria-labelledby="intro-h" className="wrap home-hero">
        <div className="home-hero__text">
          <h1 id="intro-h" className="h1 h1--hero">
            An open research community for ML researchers across Africa.
          </h1>
          <p className="lead" style={{ maxWidth: 560 }}>
            Research can feel lonely when you don’t have a lab or a supervisor down the hall. Here, you don’t do it
            alone. We read papers together every week, work on projects in small groups, and share what we’ve learned
            about internships and grad school.
            <span className="hide-mobile"> Whether your work is in code, cells or languages, there’s a seat for you.</span>
          </p>
          <div className="btn-row" style={{ paddingTop: 6 }}>
            <Link className="btn btn--purple" href="/join">
              Join the community
            </Link>
            <Link className="btn btn--outline btn--lg" href="/research">
              Browse member research
            </Link>
          </div>
        </div>
        <ThisWeek sessions={week} calendar={links.calendar} />
      </section>

      {special && (
        <section aria-label={special.kind === 'event' ? 'Event' : 'Special session'} className="special">
          <div className="wrap special__inner">
            <div className="special__text">
              <span className="special__when">
                {special.kind === 'event' ? 'Event' : 'Special session'} · {watLabel(special.startsAt)}
              </span>
              <span className="special__title">{special.title}</span>
            </div>
            {special.linkUrl ? (
              <a href={special.linkUrl} className="arrow-link">
                {special.linkLabel || (special.kind === 'event' ? 'Register' : 'Find out more')} <span aria-hidden="true">→</span>
              </a>
            ) : (
              special.kind === 'special-session' && (
                <Link href="/programmes/sunday-specials" className="arrow-link">
                  See what’s planned <span aria-hidden="true">→</span>
                </Link>
              )
            )}
          </div>
        </section>
      )}

      <LatestResearch papers={papers} />

      <MembersMap places={places} />

      <section aria-labelledby="paths-h" className="band">
        <div className="wrap home-block" style={{ gap: 32 }}>
          <div className="stack-8" style={{ maxWidth: 640 }}>
            <h2 id="paths-h" className="h2 h2--section">
              Where to start
            </h2>
            <p className="home-block__sub">Pick the one that matches where you are. You can move between them.</p>
          </div>
          <div className="paths">
            {PATHS.map((p) => (
              <div key={p.name} className="paths__item">
                <span className="paths__who">{p.who}</span>
                <h3 className="paths__name">{p.name}</h3>
                <p className="paths__body">{p.body}</p>
                <Link href={p.href} className="text-link" style={{ marginTop: 4 }}>
                  {p.link}
                </Link>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 16, color: 'var(--body)' }}>
            We also run mentorship, internship support, grad school support and more.{' '}
            <Link href="/programmes" style={{ fontWeight: 600 }}>
              See all programmes
            </Link>
          </p>
        </div>
      </section>

      {latest && (
        <section aria-labelledby="update-h" className="band band--white">
          <div className="wrap home-wins">
            <div className="home-wins__intro">
              <span style={{ fontWeight: 500, fontSize: 13, color: 'var(--muted)' }}>Monthly wins</span>
              <h2 id="update-h" className="h2 h2--section">
                {latest.label}
              </h2>
              <p className="home-block__sub" style={{ margin: '8px 0 0', fontSize: 15 }}>
                Every month we celebrate what members have achieved, big or small. New wins go up on the first Sunday of
                the month.
              </p>
              <div className="home-wins__links">
                <Link href={`/life/monthly-wins?month=${latest.key}`}>
                  See all of {latest.label.split(' ')[0]}’s wins
                </Link>
                {months.length > 1 && <Link href="/life/monthly-wins">Past months</Link>}
              </div>
            </div>
            <ul className="home-wins__list">
              {wins.map((w) => (
                <li key={w.id}>
                  <span className="home-wins__kind">{w.kind}</span>
                  <span>
                    <WithTitles text={w.text} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="join-h" className="join-band">
        <div className="wrap join-band__inner">
          <h2 id="join-h" className="h2 h2--section">
            Join in three steps
          </h2>
          <ol className="join-band__steps">
            <li>
              <a href={links.discord}>Join the Discord</a>
              <span>Say hello, ask questions, and find people working on what you care about.</span>
            </li>
            <li>
              <a href={links.mailingList}>Request the mailing list</a>
              <span>So you never miss updates from the community.</span>
            </li>
            <li>
              <Link href="/join">Join our Sunday Special</Link>
              <span>Sundays, 8pm WAT. Come listen, meet everyone, and share your own work.</span>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}
