import { SubNav } from '@/components/SubNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-section="research">
      <SubNav section="research" />
      <main id="content">{children}</main>
    </div>
  );
}
