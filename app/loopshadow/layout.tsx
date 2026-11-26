import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LoopShadow — 100% Free Korean Shadowing for Seoul Travel & K-Culture',
  description:
    'Practice real Seoul Korean in 1 minute with 0.75x/1.0x browser audio and live mic shadowing—100% free forever, no login required, with English & Spanish toggle.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LoopShadow',
  url: 'https://personalcolorhelper.com/loopshadow',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    '100% free browser-based Korean shadowing trainer with 0.75x/1.0x audio and live speech recognition for Seoul travel and K-Culture.',
};

export default function LoopShadowLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
