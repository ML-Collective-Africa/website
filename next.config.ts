import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Uploaded gallery images can be up to 10 MB each.
  experimental: { serverActions: { bodySizeLimit: '25mb' } },
};

export default nextConfig;
