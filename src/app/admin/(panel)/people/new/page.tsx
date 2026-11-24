import type { Metadata } from 'next';
import { PersonForm } from '@/components/admin/PersonForm';
import { AdminHead } from '@/components/admin/ui';
import type { PersonGroup } from '@/lib/types';

export const metadata: Metadata = { title: 'Add someone' };

export default async function NewPersonPage({ searchParams }: { searchParams: Promise<{ group?: string }> }) {
  const { group } = await searchParams;
  const g: PersonGroup = group === 'advisor' || group === 'torchbearer' ? group : 'organiser';
  return (
    <>
      <AdminHead crumbs={[{ label: 'People', href: `/admin/people?group=${g}` }, { label: 'Add someone' }]} title="Add someone" />
      <PersonForm group={g} />
    </>
  );
}
