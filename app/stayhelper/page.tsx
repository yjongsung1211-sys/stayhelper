import React from "react";
import type { Metadata } from "next";
import ServiceComingSoon from "@/components/ServiceComingSoon";

export const metadata: Metadata = {
  title: "StayHelper • Pre-Launch Final Polish (Back Soon)",
  description:
    "StayHelper is temporarily paused while we complete final refinements and quality audits. We will be back soon with an elevated experience.",
};

export default function StayHelperPage() {
  return (
    <ServiceComingSoon
      serviceId="stay"
      brandName="StayHelper"
      categoryBadge="Curated World-Class Luxury Stays & Suites"
      tagline="We are putting the finishing touches on our curated world-class 5-star luxury resort and suite experience."
      description="Public access is temporarily paused while we finalize VIP privilege partnerships and cinematic booking interfaces. We will be back soon with an unparalleled sanctuary journey."
      accentColor="amber"
      completionTasks={[
        "Global 5-star luxury resort promotion authenticity verification engine",
        "Official hotel VIP privileges and suite curation database synchronization",
        "Cinematic 4K architectural tour player and high-speed streaming infrastructure",
      ]}
    />
  );
}
