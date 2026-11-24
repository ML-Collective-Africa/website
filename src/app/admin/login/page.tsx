import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { Logo } from '@/components/Logo';
import { getCurrentAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Sign in · MLC Africa admin', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect('/admin');
  return (
    <div className="admin login">
      <main id="content" className="login__card">
        <Logo className="login__logo" />
        <div className="stack-8" style={{ gap: 6 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>Sign in to MLC Africa admin</h1>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--text-2)' }}>To get access, contact the admin.</p>
        </div>
        <LoginForm />
      </main>
    </div>
  );
}
