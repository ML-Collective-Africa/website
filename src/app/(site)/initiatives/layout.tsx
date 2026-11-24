import { SubNav } from '@/components/SubNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-section="initiatives">
      <SubNav section="initiatives" />
      <main id="content">{children}</main>
    </div>
  );
}
