import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { PersonForm } from '@/components/admin/PersonForm';
import { AdminHead } from '@/components/admin/ui';
import { deletePerson } from '@/lib/actions/admin';
import { readCollection } from '@/lib/store';

export const metadata: Metadata = { title: 'Edit a person' };

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = (await readCollection('people')).find((p) => p.id === id);
  if (!person) notFound();
  return (
    <>
      <AdminHead crumbs={[{ label: 'People', href: `/admin/people?group=${person.group}` }, { label: person.name }]} title={`Edit ${person.name}`} />
      <PersonForm person={person} group={person.group} />
      <form action={deletePerson}>
        <input type="hidden" name="id" value={person.id} />
        <ConfirmButton message={`Remove ${person.name} from the site? You can undo this from Activity.`} className="a-link-danger">
          Remove from the site
        </ConfirmButton>
      </form>
    </>
  );
}
