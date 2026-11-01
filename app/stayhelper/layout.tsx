import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thestayhelper.com"),
  title: "StayHelper · The Private Luxury Stay Dossier & Master Reels",
  description:
    "Curated editorial collection of the world's most extraordinary 5-star sanctuaries and pavilions. Direct reservation with verified VIP perks via Fora Reserve.",
  keywords: [
    "Luxury Hotels",
    "StayHelper",
    "Fora Reserve",
    "5 Star Sanctuaries",
    "Ultra Luxury Resorts",
    "Aman Resorts",
    "Four Seasons",
    "Hotel Du Cap-Eden-Roc",
    "Luxury Travel Advisor"
  ],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "StayHelper — The Private Luxury Stay Dossier",
    description:
      "Curated editorial collection of the world's most extraordinary 5-star sanctuaries and pavilions. Master reels & verified VIP partner perks.",
    url: "https://www.thestayhelper.com",
    siteName: "StayHelper",
    images: [
      {
        url: "/images/stayhelper/fs_kohsamui_poster.jpg",
        width: 1200,
        height: 630,
        alt: "StayHelper Luxury Hotel Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StayHelper — The Private Luxury Stay Dossier",
    description:
      "Curated editorial collection of the world's most extraordinary 5-star sanctuaries and pavilions.",
    images: ["/images/stayhelper/fs_kohsamui_poster.jpg"],
  },
};

export default function StayHelperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#070707] text-[#F3EFE6] min-h-screen">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: #070707 !important;
          color: #F3EFE6 !important;
        }
        .font-luxury-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .font-luxury-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}} />
      {children}
    </div>
  );
}
