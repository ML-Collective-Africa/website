import type { Metadata } from 'next';
import { PaperForm } from '@/components/admin/PaperForm';
import { AdminHead } from '@/components/admin/ui';
import { TOPICS } from '@/content/site';
import { readCollection } from '@/lib/store';

export const metadata: Metadata = { title: 'Add a paper' };

export default async function NewPaperPage() {
  const papers = await readCollection('papers');
  const topics = Array.from(new Set([...TOPICS, ...papers.map((p) => p.topic)]));
  return (
    <>
      <AdminHead crumbs={[{ label: 'Published papers', href: '/admin/papers' }, { label: 'Add' }]} title="Add a paper" />
      <PaperForm topics={topics} />
    </>
  );
}
