import React from "react";
import type { Metadata } from "next";
import ServiceComingSoon from "@/components/ServiceComingSoon";

export const metadata: Metadata = {
  title: "WeddingHelper • Pre-Launch Final Polish (Back Soon)",
  description:
    "WeddingHelper is temporarily paused while we complete final refinements and quality audits. We will be back soon with an elevated experience.",
};

export default function WeddingHelperPage() {
  return (
    <ServiceComingSoon
      serviceId="wedding"
      brandName="WeddingHelper"
      categoryBadge="Global AI Destination Wedding & Mobile Invitation"
      tagline="We are perfecting our 12 world-class luxury destination wedding photoshoots and haute mobile invitations."
      description="Public access is temporarily paused while we complete final production refinements and audio-visual synchronization. We will be back soon to deliver your most breathtaking wedding moments."
      accentColor="rose"
      completionTasks={[
        "Lake Como, Paris Chateau & Bali 12 luxury destination photoshoot engine calibration",
        "Haute digital mobile invitation real-time synthesizer & RSVP audit",
        "Ultra-high resolution bridal print standards and CDN optimization",
      ]}
    />
  );
}
