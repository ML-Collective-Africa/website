import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { PaperForm } from '@/components/admin/PaperForm';
import { AdminHead } from '@/components/admin/ui';
import { TOPICS } from '@/content/site';
import { deletePaper } from '@/lib/actions/admin';
import { readCollection } from '@/lib/store';
import { shortDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Edit a paper' };

export default async function EditPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const papers = await readCollection('papers');
  const paper = papers.find((p) => p.id === id);
  if (!paper) notFound();
  const topics = Array.from(new Set([...TOPICS, ...papers.map((p) => p.topic)]));
  return (
    <>
      <AdminHead
        crumbs={[{ label: 'Published papers', href: '/admin/papers' }, { label: 'Edit' }]}
        title="Edit paper"
        sub={
          paper.updatedAt ? (
            `Last changed by ${paper.updatedBy} on ${shortDate(paper.updatedAt)}.`
          ) : (
            <>
              From the original list. <Link href={`/research/papers/${paper.slug}`}>See it on the site</Link>.
            </>
          )
        }
      />
      <PaperForm paper={paper} topics={topics} />
      <form action={deletePaper}>
        <input type="hidden" name="id" value={paper.id} />
        <ConfirmButton message={`Delete “${paper.title}”? You can undo this from Activity.`} className="a-link-danger">
          Delete this paper
        </ConfirmButton>
      </form>
    </>
  );
}
