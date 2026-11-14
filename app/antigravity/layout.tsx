import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '셀하나 (CellHana) · 윤종성 대표님 전용 모바일 사령탑',
  description: '윤종성 대표님 전용 스마트폰 AI 비서 셀하나(CellHana) - 24/7 사진·파일 PC 즉송 및 세컨브레인 사령탑',
  manifest: '/antigravity-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '셀하나 (CellHana)',
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
