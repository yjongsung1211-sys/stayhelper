import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.weddinghelper.love"),
  title: "WeddingHelper · Where Forever Begins | Curated Luxury Weddings & Master Scenes",
  description:
    "Curated luxury destination wedding photography, couture bridal styling, and bespoke mobile wedding invitations. 12 global romantic themes & 240 master scenes.",
  keywords: [
    "WeddingHelper",
    "Luxury Weddings",
    "Destination Wedding",
    "Bridal Couture",
    "Mobile Wedding Invitation",
    "Paris Wedding",
    "Amalfi Wedding",
    "Kyoto Wedding",
    "Santorini Wedding"
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "WeddingHelper · Where Forever Begins | Curated Luxury Weddings",
    description:
      "Curated luxury destination wedding photography & bespoke mobile wedding invitations.",
    url: "https://www.weddinghelper.love",
    siteName: "WeddingHelper",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeddingHelper · Where Forever Begins | Curated Luxury Weddings",
    description:
      "Curated luxury destination wedding photography & bespoke mobile wedding invitations.",
  },
};

export default function WeddingHelperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
