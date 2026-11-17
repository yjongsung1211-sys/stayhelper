import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // WeddingHelper
    {
      url: 'https://www.weddinghelper.love',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://www.weddinghelper.love/gallery',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // StylingHelper
    {
      url: 'https://www.stylinghelper.com',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // StayHelper
    {
      url: 'https://thestayhelper.com',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // PersonalColorHelper
    {
      url: 'https://personalcolorhelper.com',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
