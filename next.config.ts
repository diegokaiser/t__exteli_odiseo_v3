import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://extranjeriagrv.es',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://extranjeriagrv.es",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
