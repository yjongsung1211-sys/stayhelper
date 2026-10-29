import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StayHelper · The Private Luxury Hotel Collection (Cinematic Master Reels)",
  description:
    "Discover the world's most extraordinary 5-star sanctuaries and pavilions through cinematic master reels. Direct reservation via official premier luxury booking partners.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function StayHelperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          .font-luxury-serif {
            font-family: 'Cormorant Garamond', Georgia, serif;
          }
          .font-luxury-sans {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          }
        `}} />
      </head>
      {children}
    </>
  );
}
