import type { Metadata, Viewport } from 'next';
import { Libre_Franklin, Literata } from 'next/font/google';
import './globals.css';
import '@/styles/home.css';
import '@/styles/pages.css';
import '@/styles/admin.css';

const franklin = Libre_Franklin({ subsets: ['latin', 'latin-ext'], variable: '--font-franklin', display: 'swap' });
const literata = Literata({ subsets: ['latin', 'latin-ext'], axes: ['opsz'], variable: '--font-literata', display: 'swap' });

const DESCRIPTION =
  'An open research community for ML researchers across Africa. Reading groups, study groups, focus groups and a weekly community call, all free and run by volunteers.';

/* Share previews need full URLs. Use NEXT_PUBLIC_SITE_URL once there's a custom
   domain; until then Vercel's production address, or localhost in development. */
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'ML Collective Africa', template: '%s · ML Collective Africa' },
  description: DESCRIPTION,
  icons: { icon: '/logo.svg' },
  // Pages share under their own title and description; the image comes from opengraph-image.tsx.
  openGraph: { type: 'website', siteName: 'ML Collective Africa', locale: 'en' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#FBFBFA' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${franklin.variable} ${literata.variable}`}>
      <body>{children}</body>
    </html>
  );
}
