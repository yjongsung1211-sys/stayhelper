import React from "react";
import type { Metadata } from "next";
import ServiceComingSoon from "@/components/ServiceComingSoon";

export const metadata: Metadata = {
  title: "PersonalColorHelper • Pre-Launch Final Polish (Back Soon)",
  description:
    "PersonalColorHelper is temporarily paused while we complete final refinements and quality audits. We will be back soon with an elevated experience.",
};

export default function PersonalColorComingSoonPage() {
  return (
    <ServiceComingSoon
      serviceId="personalcolor"
      brandName="PersonalColorHelper"
      categoryBadge="AI 12-Season Colorimetry Studio"
      tagline="We are putting the final touches on our 12-season colorimetry precision engine and virtual fabric draping studio."
      description="Public access is temporarily paused while we complete final performance enhancements and quality assurance. We will be back soon with unmatched diagnostic accuracy and a seamless experience."
      accentColor="gold"
      completionTasks={[
        "12-Season colorimetric matrix & virtual fabric draping calibration",
        "Real-time skin tone lighting correction & lipstick match tuning",
        "Cloud server optimization and zero-latency security audit",
      ]}
    />
  );
}
