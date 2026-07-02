import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '0' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()' },
  ...(isDev ? [] : [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        // No 'unsafe-eval' — React/Next don't use eval() in production, so
        // blocking it kills a whole class of injected-payload execution.
        // 'wasm-unsafe-eval' narrowly permits WebAssembly (e.g. a Three.js
        // decoder) without re-opening JS eval. 'unsafe-inline' remains only
        // because removing it requires nonce/SRI, which forces every page into
        // dynamic rendering (loses static generation + CDN caching) — a poor
        // trade for a catalog site. Revisit with SRI if stricter CSP is needed.
        "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https:",
        "media-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
    },
  ]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [75, 85, 90],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
