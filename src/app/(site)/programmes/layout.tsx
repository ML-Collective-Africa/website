import { SubNav } from '@/components/SubNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-section="programmes">
      <SubNav section="programmes" />
      <main id="content">{children}</main>
    </div>
  );
}
