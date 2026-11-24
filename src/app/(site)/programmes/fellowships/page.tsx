import type { Metadata } from 'next';
import { NameColumns } from '@/components/NameColumns';
import { Band, ButtonLink, Intro } from '@/components/ui';
import { getFellowships, getLinks } from '@/lib/cms';

export const metadata: Metadata = { title: 'Fellowships' };

export default async function FellowshipsPage() {
  const [links, { year, fellows, programmes }] = await Promise.all([getLinks(), getFellowships()]);
  return (
    <>
      <Intro
        title="Fellowships"
        lead="Research fellowships, summer schools and programmes our members have taken part in. Open calls go in the same opportunities doc as internships."
      >
        <div className="btn-row">
          <ButtonLink href={links.opportunitiesDoc}>See open fellowships</ButtonLink>
        </div>
      </Intro>
      <Band white innerClassName="wrap band__inner band__inner--20">
        <h2 className="h2">Our fellows in {year}</h2>
        <NameColumns items={fellows} />
      </Band>
      <Band innerClassName="wrap band__inner band__inner--20">
        <div className="stack-8">
          <h2 className="h2">Summer schools and programmes</h2>
          <p className="prose">Programmes members were selected for in {year}.</p>
        </div>
        <NameColumns items={programmes} />
      </Band>
    </>
  );
}
