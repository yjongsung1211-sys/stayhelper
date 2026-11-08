import React from "react";
import type { Metadata } from "next";
import ServiceComingSoon from "@/components/ServiceComingSoon";

export const metadata: Metadata = {
  title: "WeddingHelper Gallery • Pre-Launch Final Polish (Back Soon)",
  description:
    "WeddingHelper Gallery is temporarily paused while we complete final refinements and quality audits. We will be back soon with an elevated experience.",
};

export default function WeddingHelperGalleryPage() {
  return (
    <ServiceComingSoon
      serviceId="wedding"
      brandName="WeddingHelper Gallery"
      categoryBadge="Haute Destination Wedding Showcase"
      tagline="We are elevating the showcase of our 12 world-class luxury destination wedding galleries."
      description="Public access is temporarily paused while we complete final image mastering and high-dynamic-range display tuning. We will be back soon."
      accentColor="rose"
      completionTasks={[
        "Ultra-high resolution bridal portrait master rendering verification",
        "Fine jewelry and veil detail enhancement filter integration",
        "Global edge delivery and zero-buffer media streaming optimization",
      ]}
    />
  );
}
