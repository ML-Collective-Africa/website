import { SubNav } from '@/components/SubNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-section="life">
      <SubNav section="life" />
      <main id="content">{children}</main>
    </div>
  );
}
