import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.weddinghelper.love"),
  title: "You're Invited · Bespoke Luxury Wedding Invitation & AI Dossier",
  description: "Together with our families, we cordially invite you to celebrate our marriage. Experience our curated wedding dossier, interactive RSVP, live BGM soundtrack, and gallery.",
  keywords: [
    "Wedding Invitation",
    "Luxury Mobile Invitation",
    "Digital Wedding Invite",
    "WeddingHelper",
    "Destination Wedding",
    "Lake Como Wedding",
    "Bespoke RSVP"
  ],
  openGraph: {
    title: "Wedding Invitation · You Are Cordially Invited",
    description: "View our luxury digital wedding invitation, interactive venue map, RSVP, and ceremony gallery.",
    url: "https://www.weddinghelper.love/invite",
    siteName: "WeddingHelper Haute Edition",
    images: [
      {
        url: "/images/weddings/lake-como.jpg",
        width: 1200,
        height: 630,
        alt: "WeddingHelper Luxury Destination Wedding Invitation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Invitation · You Are Cordially Invited",
    description: "Experience our luxury mobile wedding invitation, ceremony gallery, and live BGM soundtrack.",
    images: ["/images/weddings/lake-como.jpg"],
  },
};

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
