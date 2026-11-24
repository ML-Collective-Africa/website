import Link from 'next/link';
import { LINKS } from '@/content/links';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__desk">
        <p>
          ML Collective Africa is part of <a href={LINKS.mlc}>ML Collective</a>.
        </p>
        <div className="site-footer__links">
          <a href={LINKS.wiki}>Community wiki</a>
          <a href={LINKS.calendar}>MLC calendar</a>
          <a href={`mailto:${LINKS.email}`} className="site-footer__email">
            {LINKS.email}
          </a>
        </div>
      </div>
      <div className="site-footer__mobile">
        <p>
          ML Collective Africa is part of <a href={LINKS.mlc}>ML Collective</a>, an independent, volunteer run non-profit.
        </p>
        <div className="site-footer__grid">
          <Link href="/about">About</Link>
          <a href={LINKS.wiki}>Community wiki</a>
          <Link href="/research">Research</Link>
          <a href={LINKS.calendar}>MLC calendar</a>
          <Link href="/programmes">Programmes</Link>
          <a href={LINKS.projectLibrary}>Project library</a>
        </div>
        <a href={`mailto:${LINKS.email}`} style={{ fontWeight: 500, fontSize: 13 }}>
          {LINKS.email}
        </a>
      </div>
    </footer>
  );
}
