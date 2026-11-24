import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Don't write AGENTS.md into the project on every dev start.
  agentRules: false,
  // Submitted figures can be up to 5 MB.
  experimental: { serverActions: { bodySizeLimit: '10mb' } },
};

export default withPayload(nextConfig);
