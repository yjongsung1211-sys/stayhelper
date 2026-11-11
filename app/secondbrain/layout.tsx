import type { Metadata } from 'next';
import KernelPaletteMount from '@/components/secondbrain-kernel/KernelPaletteMount';

export const metadata: Metadata = {
  title: '세컨브레인 노트 · AI 보이스 메모 & 옵시디언 자동 동기화',
  description:
    '윤종성 대표 전용 AI 보이스 메모 허브 — 실시간 한국어 음성 녹음 · AI 핵심 요약 · 1:1 어학 코칭 · 옵시디언(00_Inbox) 24/7 자동 동기화',
  manifest: '/secondbrain-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '세컨브레인 노트',
  },
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: '세컨브레인 노트 — AI 보이스 메모 & 옵시디언 자동 동기화',
    description:
      '스마트폰·하드웨어 음성 녹음 즉시 한국어 전체 전사, AI 핵심 요약 및 옵시디언(00_Inbox) 24/7 자동 동기화.',
    url: 'https://secondbrain-note.vercel.app',
    siteName: '세컨브레인 노트',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '세컨브레인 노트 — AI 보이스 메모 & 옵시디언 자동 동기화',
    description:
      '스마트폰·하드웨어 음성 녹음 즉시 한국어 전체 전사, AI 핵심 요약 및 옵시디언(00_Inbox) 24/7 자동 동기화.',
  },
};

export default function NoteHelperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <KernelPaletteMount />
    </>
  );
}
