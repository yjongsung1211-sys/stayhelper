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
    // BeautyHelper (100% Free K-Beauty 12-Season & US Lowest Price Tracker)
    {
      url: 'https://personalcolorhelper.com/beautyhelper',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // LoopShadow Global (100% Free Korean Shadowing EN/ES)
    {
      url: 'https://personalcolorhelper.com/loopshadow',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // LoopShadow KR (100% Free 5-Language Shadowing for Koreans)
    {
      url: 'https://personalcolorhelper.com/loopshadow/kr',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];
}
