import type { Metadata } from 'next';
import { SubmitForm } from '@/components/research/SubmitForm';

export const metadata: Metadata = { title: 'Submit your research' };

export default async function SubmitPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  return <SubmitForm initialType={type === 'Product' ? 'Product' : 'Paper'} />;
}
