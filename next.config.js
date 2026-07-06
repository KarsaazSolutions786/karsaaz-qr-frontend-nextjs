const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

function originFromEnv(url) {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/** Build connect-src so junior devs on LAN IPs (e.g. 192.168.x.x) are not CSP-blocked in dev. */
function buildConnectSrc() {
  const sources = new Set(["'self'"]);

  [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:8000',
    'https://localhost:8000',
    'http://127.0.0.1:8000',
    'https://127.0.0.1:8000',
    'https://app.karsaazqr.com',
    'https://crmapp.karsaazebs.com',
    'https://accounts.google.com',
    'https://www.google.com',
  ].forEach((value) => {
    const origin = originFromEnv(value) || value;
    if (origin) sources.add(origin);
  });

  // Allow API calls to any LAN IP:port (team dev via shared machine IP).
  // NEXT_PUBLIC_ALLOW_LAN=true extends this to production builds run on a dev box.
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ALLOW_LAN === 'true') {
    sources.add('http:');
    sources.add('https:');
    sources.add('ws:');
    sources.add('wss:');
  }

  return Array.from(sources).join(' ');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ['app.karsaazqr.com', 'www.karsaazqr.com', 'karsaazqr.com', 'localhost', '127.0.0.1', 'picsum.photos'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_CANONICAL_URL: process.env.NEXT_PUBLIC_CANONICAL_URL || '',
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverActions: {
      bodySizeLimit: '5mb',
    },
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async redirects() {
    return [
      {
        source: '/og-default.png',
        destination: '/og-default.svg',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          ...(process.env.NODE_ENV === 'production'
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }]
            : []),
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''} https://accounts.google.com https://www.google.com https://www.gstatic.com https://cdn.jsdelivr.net https://challenges.cloudflare.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' data: https://fonts.gstatic.com",
              `connect-src ${buildConnectSrc()}`,
              "frame-src 'self' blob: https://accounts.google.com https://www.google.com https://www.paypal.com https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://accounts.google.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
}

module.exports = withBundleAnalyzer(nextConfig)
