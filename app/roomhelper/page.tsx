import React from "react";
import type { Metadata } from "next";
import ServiceComingSoon from "@/components/ServiceComingSoon";

export const metadata: Metadata = {
  title: "RoomHelper • Pre-Launch Final Polish (Back Soon)",
  description:
    "RoomHelper is temporarily paused while we complete final refinements and quality audits. We will be back soon with an elevated experience.",
};

export default function RoomHelperPage() {
  return (
    <ServiceComingSoon
      serviceId="room"
      brandName="RoomHelper"
      categoryBadge="AI Virtual Staging & Curated Living Space Studio"
      tagline="We are finalizing our AI virtual staging engine and curated luxury interior product collections."
      description="Public access is temporarily paused while we complete final rendering calibration and real-time product inventory sync. We will be back soon to transform your living spaces."
      accentColor="amber"
      completionTasks={[
        "AI virtual interior staging lighting & realistic material rendering engine",
        "Curated designer furniture and authentic retail inventory sync",
        "Interactive room comparison slider and ultra-responsive layout testing",
      ]}
    />
  );
}
