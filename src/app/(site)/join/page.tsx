import type { Metadata } from 'next';
import { FaqColours } from '@/components/FaqColours';
import { getLinks } from '@/lib/cms';
import { FAQ, JOIN_STEPS } from '@/content/site';

export const metadata: Metadata = { title: 'Join' };

export default async function JoinPage() {
  const links = await getLinks();
  return (
    <main id="content">
      <section className="wrap intro" style={{ paddingBottom: 40, gap: 14 }}>
        <h1 className="h1">Join MLC Africa</h1>
        <p className="lead" style={{ fontSize: 18, maxWidth: 640 }}>
          Joining is free and there’s nothing to apply for. You don’t need research experience, just an interest in
          problems that matter to the continent, wherever you’re based.
        </p>
      </section>

      <section aria-labelledby="steps-h" className="wrap" style={{ paddingBottom: 56 }}>
        <h2 id="steps-h" className="sr-only">
          Steps to join
        </h2>
        <ol className="join-steps">
          {JOIN_STEPS.map((step, i) => ({ ...step, href: [links.discord, links.mailingList, links.calendar][i] ?? step.href })).map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <a href={s.href} className={`btn ${s.solid ? 'btn--fill' : 'btn--outline'}`}>
                {s.cta}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="faq-h" className="band band--white">
        <div className="wrap faq-layout">
          <div className="stack-8">
            <h2 id="faq-h" className="h2">
              Questions
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--text-2)', lineHeight: 1.5 }}>
              For anything else, email{' '}
              <a href={`mailto:${links.email}`} style={{ fontWeight: 600, color: 'var(--ink)' }}>
                {links.email}
              </a>{' '}
              or ask in the Discord.
            </p>
          </div>
          <FaqColours className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </FaqColours>
        </div>
      </section>
    </main>
  );
}
