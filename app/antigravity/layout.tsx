import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Antigravity & Hana | 대표님 전용 모바일 사령탑',
  description: '윤종성 대표님 전용 안티그래비티(Antigravity) & AI 수석 비서 하나(Hana) 안드로이드 모바일 앱',
  manifest: '/antigravity-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Antigravity',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B0F17',
};

export default function AntigravityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-[#E5BE64]/30 selection:text-[#E5BE64]">
      {children}
    </div>
  );
}
