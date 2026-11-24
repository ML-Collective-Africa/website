import { SubNav } from '@/components/SubNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-section="about">
      <SubNav section="about" />
      <main id="content">{children}</main>
    </div>
  );
}
