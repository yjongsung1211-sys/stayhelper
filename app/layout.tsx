import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';

  if (
    host.includes('secondbrain') ||
    host.includes('trycloudflare') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1')
  ) {
    return {
      metadataBase: new URL('https://secondbrain-note.vercel.app'),
      title: 'SecondBrain AI 노트 · 세컨브레인 보이스 메모 & 옵시디언 자동 동기화',
      description:
        '실시간 음성 녹음 · AI 핵심 요약 · 옵시디언(00_Inbox) 24시간 자동 동기화 보이스 노트 허브',
      icons: {
        icon: '/icon.svg',
      },
      openGraph: {
        title: 'SecondBrain AI 노트 — 세컨브레인 보이스 메모 & 옵시디언 자동 동기화',
        description:
          '스마트폰·하드웨어 음성 녹음 즉시 한국어 전체 전사, AI 핵심 요약 및 옵시디언(00_Inbox) 자동 동기화.',
        url: 'https://secondbrain-note.vercel.app',
        siteName: 'SecondBrain AI 노트',
        locale: 'ko_KR',
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: 'SecondBrain AI 노트 — 세컨브레인 보이스 메모 & 옵시디언 자동 동기화',
        description:
          '스마트폰·하드웨어 음성 녹음 즉시 한국어 전체 전사, AI 핵심 요약 및 옵시디언(00_Inbox) 자동 동기화.',
      },
    };
  }

  if (host.includes('weddinghelper') || host.includes('wedding')) {
    return {
      metadataBase: new URL('https://www.weddinghelper.love'),
      title: 'WeddingHelper · Global AI Destination Wedding Photoshoot & Haute Mobile Invitation',
      description:
        'Transform one couple photo into breathtaking Lake Como, Paris Chateau & Bali 12 luxury destination wedding photoshoots in 3 seconds. Create bespoke digital wedding invitations with live BGM & RSVP.',
      keywords: [
        'WeddingHelper',
        'AI Wedding Photoshoot',
        'Destination Wedding',
        'Lake Como Wedding',
        'Paris Chateau Wedding',
        'Luxury Mobile Invitation',
        'Digital Wedding Invitation',
        'Bespoke RSVP',
        'Virtual Bridal Fitting'
      ],
      icons: {
        icon: '/icon.svg',
      },
      openGraph: {
        title: 'WeddingHelper — AI Destination Wedding Photoshoot & Luxury Mobile Invitation',
        description:
          '12 Global Luxury Destination Themes in 3 Seconds. Haute Couture Bridal Attire & Bespoke Mobile Invitations with Real BGM.',
        url: 'https://www.weddinghelper.love',
        siteName: 'WeddingHelper Global',
        images: [
          {
            url: '/images/weddings/lake-como.jpg',
            width: 1200,
            height: 630,
            alt: 'WeddingHelper 12 Grand Master Luxury Wedding Themes',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'WeddingHelper — AI Destination Wedding Photoshoot & Luxury Mobile Invitation',
        description:
          'Transform your couple photo into breathtaking Lake Como & Paris Chateau wedding photoshoots in 3 seconds.',
        images: ['/images/weddings/lake-como.jpg'],
      },
    };
  }

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Guaranteed Full Tailwind CSS Engine (Zero 404 Chunk Issues) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    fontFamily: {
                      sans: ['"Pretendard Variable"', 'Pretendard', 'Inter', '"Noto Sans KR"', '"Noto Sans SC"', '"Noto Sans JP"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                      mono: ['"Pretendard Variable"', 'Pretendard', 'Inter', '"Noto Sans KR"', '"Noto Sans SC"', '"Noto Sans JP"', 'sans-serif'],
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
              if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                var s = document.createElement('script');
                s.defer = true;
                s.src = '/_vercel/insights/script.js';
                document.head.appendChild(s);
              }
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#FDFCFB] text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white font-sans"
      >
        {children}
      </body>
    </html>
  );
}
