import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#FFFBF9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ColorHelper · AI 퍼스널 컬러 진단 & 12톤 뷰티 큐레이션",
  description:
    "내 얼굴에 꼭 맞는 인생 컬러를 3초 만에 찾는 AI 퍼스널 컬러 진단실. 12톤 정밀 색채학 매트릭스, 가상 드레이핑 체험, 인생 립스틱 및 패션 스타일링 큐레이션 제공.",
  keywords: [
    "퍼스널 컬러",
    "퍼스널 컬러 자가진단",
    "AI 퍼스널컬러",
    "ColorHelper",
    "컬러헬퍼",
    "봄웜톤",
    "여름쿨톤",
    "가을웜톤",
    "겨울쿨톤",
    "가상 드레이핑",
    "인생 립스틱",
    "StylingHelper",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ColorHelper — AI 퍼스널 컬러 진단실",
    description:
      "나만의 12톤 퍼스널 컬러와 인생 립스틱, 가상 드레이핑을 지금 바로 무료로 체험해보세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function ColorHelperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#1E1B18] antialiased selection:bg-[#E07A5F] selection:text-white font-sans">
      {children}
    </div>
  );
}
