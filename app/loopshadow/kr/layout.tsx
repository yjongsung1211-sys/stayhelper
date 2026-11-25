import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '루프쉐도우 (LoopShadow KR) — 출퇴근 1분 5개국어 무료 쉐도잉',
  description:
    '영어·일본어·중국어·스페인어·인도네시아어 여행 및 실전 회화를 브라우저에서 무료로 따라 말하고 발음을 즉시 체크하세요.',
};

export default function LoopShadowKrLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
