import type { Metadata } from 'next';
import { PeopleGrid } from '@/components/PeopleGrid';
import { Band, Banner, Intro } from '@/components/ui';
import { getPeople } from '@/lib/content';

export const metadata: Metadata = { title: 'Torchbearers' };
export const dynamic = 'force-dynamic';

export default async function TorchbearersPage() {
  const people = await getPeople('torchbearer');
  return (
    <>
      <Intro
        title="Torchbearers"
        lead="The people who carried the torch before us. They built much of what you see here and have since moved on to new things. Thank you."
      />
      <Band>
        <PeopleGrid people={people} past />
      </Band>
      <Banner
        title="There’s a seat for you here. Come say hello at our next Sunday Special."
        cta="How to join"
        href="/join"
      />
    </>
  );
}
