import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BeautyHelper — Free K-Beauty 12-Season Shade & Lowest US Price Tracker',
  description:
    'Match your exact 12-season Seoul personal color to 28+ K-Beauty bestsellers and compare live prices across Olive Young Global, YesStyle, and Amazon US—100% free forever.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BeautyHelper',
  url: 'https://personalcolorhelper.com/beautyhelper',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    '100% free 12-season K-Beauty shade matcher and US lowest price comparison across Olive Young Global, YesStyle, and Amazon US.',
};

export default function BeautyHelperLayout({ children }: { children: React.ReactNode }) {
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
