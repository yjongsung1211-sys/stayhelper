import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SecondBrain AI 노트 · 세컨브레인 보이스 메모 & 옵시디언 자동 동기화',
  description:
    '실물 SecondBrain Note 하드웨어 및 스마트폰 실시간 음성 녹음, 한국어 고정밀 전사(STT), AI 구조화 요약 및 옵시디언(Obsidian) 자동 저장 워크스페이스.',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'SecondBrain AI 노트',
    description: '세컨브레인 보이스 메모 & 옵시디언 자동 동기화 워크스페이스',
    siteName: 'SecondBrain AI 노트',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function SecondBrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
