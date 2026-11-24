import type { Metadata } from 'next';
import Link from 'next/link';
import { ResearchBrowser } from '@/components/research/ResearchBrowser';
import { TOPICS } from '@/content/site';
import { getPublishedPapers } from '@/lib/content';

export const metadata: Metadata = { title: 'Published research' };
export const dynamic = 'force-dynamic';

export default async function ResearchPage() {
  const papers = await getPublishedPapers();
  const years = Array.from(new Set(papers.map((p) => p.year).filter(Boolean))).sort().reverse();
  const topics = Array.from(new Set([...TOPICS, ...papers.map((p) => p.topic)]));
  return (
    <>
      <section className="wrap research-intro">
        <div className="research-intro__top">
          <h1 className="h1">Published research</h1>
          <Link href="/research/submit" className="btn btn--fill hide-mobile">
            Submit your research
          </Link>
        </div>
        <p className="lead" style={{ fontSize: 18, maxWidth: 680 }}>
          Papers our members have published, newest first. Each entry links to the original work, and if yours is
          missing, you can <Link href="/research/submit">submit it here</Link>.
        </p>
      </section>
      <ResearchBrowser papers={papers} topics={topics} years={years} />
    </>
  );
}
