import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SeoulHelper — 100% Free Seoul Trip Budget, Tax-Free Refund & District Planner',
  description:
    'Calculate instant Korea VAT tax-free refunds, plan your Seoul itinerary across Seongsu, Myeongdong, Hongdae & Gangnam, and compare eSIM & AREX essentials—100% free forever.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SeoulHelper',
  url: 'https://personalcolorhelper.com/seoulhelper',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    '100% free Seoul travel utility featuring an instant Korea Tax-Free VAT refund calculator, 6-district itinerary budget planner, and eSIM/AREX essentials.',
};

export default function SeoulHelperLayout({ children }: { children: React.ReactNode }) {
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
