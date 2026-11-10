import type { Metadata, Viewport } from 'next';
import SecondBrainLayout from '@/app/secondbrain/layout';

export const metadata: Metadata = {
  title: 'NoteHelper (노트헬퍼) | 스마트폰 회의록 정리 & AI 다국어 어학 공부 앱',
  description:
    '별도 기기 없이 휴대폰 녹음만으로 회의록 자동 정리 및 전 세계 모든 외국어 문법 교정·더 좋은 대답·롤플레이 시나리오 공부를 도와주는 AI 앱',
  manifest: '/secondbrain-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NoteHelper',
  },
  openGraph: {
    title: 'NoteHelper (노트헬퍼) · 스마트폰 회의록 정리 & AI 다국어 어학 공부 앱',
    description:
      '별도 기기 없이 휴대폰으로만 녹음하여 회의록 정리와 전 세계 모든 외국어 공부를 도와주는 AI 노트 앱',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#111827',
};

export default SecondBrainLayout;
