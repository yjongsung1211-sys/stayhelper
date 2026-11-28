import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const host = (headers().get('x-forwarded-host') || headers().get('host') || '').toLowerCase();

  if (host.includes('weddinghelper')) {
    return [
      { url: 'https://www.weddinghelper.love', lastModified: now, changeFrequency: 'daily', priority: 1.0 },
      { url: 'https://www.weddinghelper.love/gallery', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    ];
  }

  if (host.includes('stylinghelper')) {
    return [
      { url: 'https://www.stylinghelper.com', lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    ];
  }

  if (host.includes('thestayhelper') || host.includes('stayhelper')) {
    return [
      { url: 'https://thestayhelper.com', lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    ];
  }

  // Default: personalcolorhelper.com (ColorHelper + BeautyHelper + LoopShadow + SeoulHelper)
  return [
    { url: 'https://personalcolorhelper.com', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://personalcolorhelper.com/seoulhelper', lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://personalcolorhelper.com/beautyhelper', lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://personalcolorhelper.com/loopshadow', lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://personalcolorhelper.com/loopshadow/kr', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ];
}
