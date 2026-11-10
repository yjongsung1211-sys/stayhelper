import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NoteHelper (노트헬퍼) · 스마트폰 회의록 정리 & AI 다국어 어학 공부 앱',
  description:
    '별도 기기 없이 스마트폰 하나로 회의록 자동 요약·액션아이템 정리부터 전 세계 모든 외국어 회화 수업 1:1 문법 교정·복습까지 도와주는 AI 보이스 노트 앱',
  manifest: '/secondbrain-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NoteHelper',
  },
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'NoteHelper (노트헬퍼) — 스마트폰 회의록 정리 & AI 다국어 어학 공부 앱',
    description:
      '별도 기기 없이 휴대폰 녹음만으로 회의록 핵심 정리 및 전 세계 모든 외국어 회화 공부를 도와주는 AI 노트 앱.',
    url: 'https://secondbrain-note.vercel.app',
    siteName: 'NoteHelper (노트헬퍼)',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'NoteHelper (노트헬퍼) — 스마트폰 회의록 정리 & AI 다국어 어학 공부 앱',
    description:
      '별도 기기 없이 휴대폰 녹음만으로 회의록 핵심 정리 및 전 세계 모든 외국어 회화 공부를 도와주는 AI 노트 앱.',
  },
};

export default function NoteHelperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
