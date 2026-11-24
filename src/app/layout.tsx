import type { Metadata, Viewport } from 'next';
import { Libre_Franklin, Literata } from 'next/font/google';
import './globals.css';
import '@/styles/home.css';
import '@/styles/pages.css';
import '@/styles/admin.css';

const franklin = Libre_Franklin({ subsets: ['latin', 'latin-ext'], variable: '--font-franklin', display: 'swap' });
const literata = Literata({ subsets: ['latin', 'latin-ext'], axes: ['opsz'], variable: '--font-literata', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'ML Collective Africa', template: '%s · ML Collective Africa' },
  description:
    'An open research community for ML researchers across Africa. Reading groups, study groups, focus groups and a weekly community call, all free and run by volunteers.',
  icons: { icon: '/logo.svg' },
};

export const viewport: Viewport = { themeColor: '#FBFBFA' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${franklin.variable} ${literata.variable}`}>
      <body>{children}</body>
    </html>
  );
}
