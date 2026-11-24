import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

/* The picture shown when a link to the site is shared (Discord, WhatsApp,
   LinkedIn, X). Generated once at build time and used for every page. */

export const alt = 'ML Collective Africa, an open research community for ML researchers across Africa';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const root = process.cwd();
  const [bold, medium, logo] = await Promise.all([
    readFile(path.join(root, 'src/assets/fonts/LibreFranklin-700.ttf')),
    readFile(path.join(root, 'src/assets/fonts/LibreFranklin-500.ttf')),
    readFile(path.join(root, 'public/logo.svg')),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#FBFBFA',
          color: '#17161C',
          fontFamily: 'Libre Franklin',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 88px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={99} height={132} alt="" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.05 }}>
                ML Collective Africa
              </span>
              <span style={{ fontSize: 26, fontWeight: 500, color: '#57545F', marginTop: 10 }}>A chapter of ML Collective</span>
            </div>
          </div>
          <span style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.3, color: '#2F2D36', marginTop: 56, maxWidth: 940 }}>
            An open research community for ML researchers across Africa.
          </span>
        </div>
        <div
          style={{
            height: 96,
            background: '#971AF7',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 88px',
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          <span>Reading groups · Study groups · Focus groups · Sunday Specials</span>
          <span>Free to join</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Libre Franklin', data: bold, weight: 700, style: 'normal' },
        { name: 'Libre Franklin', data: medium, weight: 500, style: 'normal' },
      ],
    },
  );
}
