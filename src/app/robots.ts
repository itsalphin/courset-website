import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile/', '/cart/', '/login/'],
    },
    sitemap: 'https://courset.com/sitemap.xml',
  };
}
