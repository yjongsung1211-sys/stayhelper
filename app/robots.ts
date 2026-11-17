import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: [
      'https://www.weddinghelper.love/sitemap.xml',
      'https://www.stylinghelper.com/sitemap.xml',
      'https://thestayhelper.com/sitemap.xml',
      'https://personalcolorhelper.com/sitemap.xml',
    ],
  };
}
