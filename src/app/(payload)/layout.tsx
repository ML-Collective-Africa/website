/* Root layout for the admin at /admin. Payload renders its own page shell. */
import config from '@payload-config';
import '@payloadcms/next/css';
import type { ServerFunctionClient } from 'payload';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import { Libre_Franklin } from 'next/font/google';
import type React from 'react';
import { importMap } from './admin/importMap.js';
import './custom.css';

const franklin = Libre_Franklin({ subsets: ['latin', 'latin-ext'], variable: '--font-franklin', display: 'swap' });

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction} htmlProps={{ className: franklin.variable }}>
      {children}
    </RootLayout>
  );
}
