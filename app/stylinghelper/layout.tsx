import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://stylinghelper.com'),
  title: 'StylingHelper US — Click Any Look, Shop the Outfit | Curated Seoul K-Styling',
  description:
    'Discover curated Seoul street aesthetics & Korean styling formulas. Shop 3,521+ verified 100% in-stock US retail garments from Zara US, Nordstrom, COS, Mango, and SSENSE.',
  keywords: [
    'Korean Fashion',
    'K-Style',
    'Seoul Streetwear',
    'Seongsu Core',
    'Quiet Luxury',
    'Zara US',
    'Nordstrom',
    'SSENSE',
    'COS',
    'Fashion Lookbook',
    'AI Stylist',
  ],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'StylingHelper US — Click Any Look, Shop the Outfit',
    description:
      'Curated Seoul K-Fashion aesthetics with 1:1 real US retail items. Tap any garment pin to shop directly on Zara US, Nordstrom & SSENSE.',
    url: 'https://stylinghelper.com',
    siteName: 'StylingHelper US',
    images: [
      {
        url: '/images/looks/look_seongsu_leather_01.jpg',
        width: 1200,
        height: 630,
        alt: 'StylingHelper Seoul K-Fashion Editorial Lookbook',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StylingHelper US — Click Any Look, Shop the Outfit',
    description:
      'Curated Seoul K-Fashion aesthetics with 1:1 real US retail items. Tap any garment pin to shop directly on Zara US, Nordstrom & SSENSE.',
    images: ['/images/looks/look_seongsu_leather_01.jpg'],
  },
};

export default function StylingHelperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
