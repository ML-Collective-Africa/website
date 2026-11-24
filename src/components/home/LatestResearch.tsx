'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ResearchList, ViewToggle, type View } from '@/components/ResearchList';
import type { Paper } from '@/lib/types';

export function LatestResearch({ papers }: { papers: Paper[] }) {
  const [view, setView] = useState<View>('list');
  return (
    <section aria-labelledby="research-h" className="band band--white">
      <div className="wrap home-block">
        <div className="home-block__head">
          <div className="stack-8" style={{ maxWidth: 640 }}>
            <h2 id="research-h" className="h2 h2--section">
              Latest from members
            </h2>
            <p className="home-block__sub">Papers, talks and projects by MLC Africa members, newest first.</p>
          </div>
          <div className="home-block__tools">
            <span className="hide-mobile">
              <ViewToggle view={view} onChange={setView} withIcons />
            </span>
            <Link href="/research" className="text-link hide-mobile">
              All research
            </Link>
          </div>
        </div>
        <ResearchList papers={papers} view={view} />
        <Link href="/research" className="btn btn--outline show-mobile">
          All research
        </Link>
      </div>
    </section>
  );
}
