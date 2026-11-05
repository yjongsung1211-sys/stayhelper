import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host') || '';

  if (host.includes('thestayhelper') || host.includes('stayhelper')) {
    return {
      metadataBase: new URL('https://www.thestayhelper.com'),
      title: 'StayHelper · The Private Luxury Stay Dossier & Master Reels',
      description:
        "Curated editorial collection of the world's most extraordinary 5-star sanctuaries and pavilions. Direct reservation with verified VIP perks via Fora Reserve.",
      keywords: [
        'Luxury Hotels',
        'StayHelper',
        'Fora Reserve',
        '5 Star Sanctuaries',
        'Ultra Luxury Resorts',
        'Aman Resorts',
        'Four Seasons',
        'Hotel Du Cap-Eden-Roc',
        'Luxury Travel Advisor'
      ],
      icons: {
        icon: '/icon.svg',
      },
      openGraph: {
        title: 'StayHelper — The Private Luxury Stay Dossier',
        description:
          "Curated editorial collection of the world's most extraordinary 5-star sanctuaries and pavilions. Master reels & verified VIP partner perks.",
        url: 'https://www.thestayhelper.com',
        siteName: 'StayHelper',
        images: [
          {
            url: '/images/stayhelper/fs_kohsamui_poster.jpg',
            width: 1200,
            height: 630,
            alt: 'StayHelper Luxury Hotel Collection',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'StayHelper — The Private Luxury Stay Dossier',
        description:
          "Curated editorial collection of the world's most extraordinary 5-star sanctuaries and pavilions.",
        images: ['/images/stayhelper/fs_kohsamui_poster.jpg'],
      },
    };
  }

  if (host.includes('stylinghelper')) {
    return {
      metadataBase: new URL('https://stylinghelper.com'),
      title: 'StylingHelper US — Click Any Look, Shop the Outfit | Curated Seoul K-Styling',
      description:
        'Discover curated Seoul street aesthetics & Korean styling formulas. Shop 3,521+ verified 100% in-stock US retail garments from Zara US, Nordstrom, COS, Mango, and SSENSE.',
      keywords: [
        'Korean Fashion',
        'K-Style',
        'Seoul Streetwear',
        'Seongsu Core',
        'Quiet Luxury',
        'Zara US',
        'Nordstrom',
        'SSENSE',
        'COS',
        'Fashion Lookbook',
        'AI Stylist'
      ],
      icons: {
        icon: '/icon.svg',
      },
      openGraph: {
        title: 'StylingHelper US — Click Any Look, Shop the Outfit',
        description:
          'Curated Seoul K-Fashion aesthetics with 1:1 real US retail items. Tap any garment pin to shop directly on Zara US, Nordstrom & SSENSE.',
        url: 'https://stylinghelper.com',
        siteName: 'StylingHelper US',
        images: [
          {
            url: '/images/looks/look_seongsu_leather_01.jpg',
            width: 1200,
            height: 630,
            alt: 'StylingHelper Seoul K-Fashion Editorial Lookbook',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'StylingHelper US — Click Any Look, Shop the Outfit',
        description:
          'Curated Seoul K-Fashion aesthetics with 1:1 real US retail items. Tap any garment pin to shop directly on Zara US, Nordstrom & SSENSE.',
        images: ['/images/looks/look_seongsu_leather_01.jpg'],
      },
    };
  }

  // DEFAULT: 퍼스널컬러헬퍼 (PersonalColorHelper)
  return {
    metadataBase: new URL('https://personalcolorhelper.com'),
    title: '퍼스널컬러헬퍼 (PersonalColorHelper) · AI 퍼스널 컬러 진단 & 12톤 뷰티 큐레이션',
    description:
      '내 얼굴에 꼭 맞는 인생 컬러를 3초 만에 찾는 AI 퍼스널컬러헬퍼. 12톤 정밀 색채학 매트릭스, 가상 드레이핑 체험, 인생 립스틱 및 패션 스타일링 큐레이션 제공.',
    keywords: [
      '퍼스널컬러헬퍼',
      'PersonalColorHelper',
      '퍼스널 컬러',
      '퍼스널 컬러 자가진단',
      'AI 퍼스널컬러',
      '봄웜톤',
      '여름쿨톤',
      '가을웜톤',
      '겨울쿨톤',
      '가상 드레이핑',
      '인생 립스틱',
      'StylingHelper',
    ],
    icons: {
      icon: '/favicon.ico',
    },
    openGraph: {
      title: '퍼스널컬러헬퍼 (PersonalColorHelper) — AI 퍼스널 컬러 진단실',
      description:
        '나만의 12톤 퍼스널 컬러와 인생 립스틱, 가상 드레이핑을 지금 바로 무료로 체험해보세요.',
      url: 'https://personalcolorhelper.com',
      siteName: '퍼스널컬러헬퍼',
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '퍼스널컬러헬퍼 (PersonalColorHelper) — AI 퍼스널 컬러 진단실',
      description:
        '나만의 12톤 퍼스널 컬러와 인생 립스틱, 가상 드레이핑을 지금 바로 무료로 체험해보세요.',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Guaranteed Full Tailwind CSS Engine (Zero 404 Chunk Issues) */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    fontFamily: {
                      sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                    }
                  }
                }
              }
            `,
          }}
        />
        {/* Vercel Web Analytics Engine with Multi-Site Domain Routing */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
              window.va('beforeSend', function (event) {
                try {
                  var host = window.location.hostname || '';
                  var site = 'personalcolorhelper';
                  if (host.indexOf('stylinghelper') !== -1) site = 'stylinghelper';
                  else if (host.indexOf('stayhelper') !== -1) site = 'stayhelper';
                  else if (host.indexOf('weddinghelper') !== -1) site = 'weddinghelper';
                  else if (host.indexOf('roomhelper') !== -1) site = 'roomhelper';
                  else if (host.indexOf('personalcolorhelper') !== -1) site = 'personalcolorhelper';

                  if (event && event.url) {
                    var p = event.url;
                    var tag = '/[' + site + ']';
                    if (p.indexOf(tag) !== 0) {
                      event.url = tag + (p === '/' ? '' : p);
                    }
                  }
                } catch (e) {}
                return event;
              });
            `,
          }}
        />
        <script defer src="/_vercel/insights/script.js"></script>
      </head>
      <body className="min-h-screen bg-[#FDFCFB] text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
