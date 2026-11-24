import type { Metadata } from 'next';
import Link from 'next/link';
import { PeopleGrid } from '@/components/PeopleGrid';
import { Band, Col, Intro, TwoCol } from '@/components/ui';
import { getPeople, getLinks } from '@/lib/cms';

export const metadata: Metadata = { title: 'Organisers' };

export default async function OrganisersPage() {
  const links = await getLinks();
  const [organisers, advisors] = await Promise.all([getPeople('organiser'), getPeople('advisor')]);
  return (
    <>
      <Intro
        title="Organisers"
        lead="The people who keep MLC Africa running. Everyone here is a volunteer, giving evenings and weekends to the community."
      />
      <Band id="current">
        <h2 className="h2">Current organisers</h2>
        <PeopleGrid people={organisers} />
      </Band>
      {advisors.length > 0 && (
        <Band id="advisors" white>
          <h2 className="h2">Advisors</h2>
          <p className="note">Advisors guide the community and connect members with the wider ML Collective.</p>
          <PeopleGrid people={advisors} />
        </Band>
      )}
      <Band>
        <TwoCol>
          <Col>
            <h2 className="h2">Want to help run things?</h2>
          </Col>
          <Col>
            <p className="note">
              We’re always looking for people to help with reading groups, focus groups and events. Say hello in the
              Discord and tell us what you’d like to help with.
            </p>
            <div className="btn-row">
              <a href={links.discord} className="btn btn--outline">
                Join the Discord
              </a>
              <Link href="/about/torchbearers" className="text-link">
                Meet the Torchbearers
              </Link>
            </div>
          </Col>
        </TwoCol>
      </Band>
    </>
  );
}
