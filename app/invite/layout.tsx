import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.weddinghelper.love"),
  title: "Wedding Invitation | WeddingHelper Bespoke Mobile Invitation",
  description: "You are cordially invited to celebrate our wedding. View our luxury mobile wedding invitation, RSVP, location, and photo gallery.",
  openGraph: {
    title: "Wedding Invitation | WeddingHelper Bespoke Mobile Invitation",
    description: "You are cordially invited to celebrate our wedding.",
    url: "https://www.weddinghelper.love/invite",
    siteName: "WeddingHelper",
    type: "website",
  },
};

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
