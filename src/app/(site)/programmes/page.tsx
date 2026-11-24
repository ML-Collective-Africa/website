import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, Banner, Intro } from '@/components/ui';
import { PROGRAMMES } from '@/content/site';

export const metadata: Metadata = { title: 'Programmes' };

export default function ProgrammesPage() {
  return (
    <>
      <Intro
        title="Programmes"
        lead="Everything here is free and run by volunteers. Pick whatever fits where you are right now, and move on when you’re ready."
      />
      <Band>
        <ul className="rule-list">
          {PROGRAMMES.map((p) => (
            <li key={p.href} className="row">
              <div className="row__main">
                <h2 className="row__title">
                  <Link className="row-title" href={p.href}>
                    {p.name}
                  </Link>
                </h2>
                <p className="row__desc">{p.body}</p>
              </div>
              <div className="row__side">
                <span className="row__meta">{p.when}</span>
                <Link href={p.href} aria-label={`Learn more about ${p.name}`}>
                  Learn more
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Band>
      <Banner title="The easiest first step is our Sunday Special, every Sunday at 8pm WAT." cta="How to join" href="/join" />
    </>
  );
}
