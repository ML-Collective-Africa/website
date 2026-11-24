import type { Metadata } from 'next';
import { Band, Banner, Intro } from '@/components/ui';
import { FUNDRAISERS } from '@/content/site';

export const metadata: Metadata = { title: 'Fundraisers' };

export default function FundraisersPage() {
  return (
    <>
      <Intro
        title="Fundraisers"
        lead="Every year since 2022 we’ve raised money so members can attend the Deep Learning Indaba. Thank you to everyone who has given."
      />
      <Band>
        <ul className="rule-list">
          {FUNDRAISERS.map((f) => (
            <li key={f.title} className="row">
              <div className="row__main">
                <h2 className="row__title">{f.title}</h2>
                <p className="row__desc">{f.body}</p>
              </div>
              <div className="row__side">
                {f.meta.length > 0 && (
                  <span className="row__meta">
                    {f.meta.map((m, i) => (
                      <span key={m}>
                        {i > 0 && <br />}
                        {m}
                      </span>
                    ))}
                  </span>
                )}
                {f.href && <a href={f.href}>View fundraiser</a>}
              </div>
            </li>
          ))}
        </ul>
      </Band>
      <Banner title="Want to help a member get to the next Indaba?" cta="Partner with us" href="/initiatives/sponsors#partner" />
    </>
  );
}
