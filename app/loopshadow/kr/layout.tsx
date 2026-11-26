import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '루프쉐도우 (LoopShadow KR) — 출퇴근 1분 5개국어 무료 쉐도잉',
  description:
    '영어·일본어·중국어·스페인어·인도네시아어 실전 회화를 출퇴근길 1분 만에 0.75x/1.0x 음성과 마이크로 쉐도잉하세요. 회원가입 없는 100% 무료 연습장.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '루프쉐도우 (LoopShadow KR)',
  url: 'https://personalcolorhelper.com/loopshadow/kr',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  description:
    '한국인을 위한 영어·일본어·중국어·스페인어·인도네시아어 100% 무료 브라우저 쉐도잉 연습장.',
};

export default function LoopShadowKrLayout({ children }: { children: React.ReactNode }) {
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
