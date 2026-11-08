import React from "react";
import type { Metadata } from "next";
import ServiceComingSoon from "@/components/ServiceComingSoon";

export const metadata: Metadata = {
  title: "RoomHelper • 마무리 작업 진행 중 (곧 돌아오겠습니다)",
  description:
    "룸헬퍼는 사이트 공개를 잠시 중단하고 모든 마무리 작업을 완료한 후 다시 공개할 예정입니다. 곧 돌아오겠습니다.",
};

export default function RoomHelperPage() {
  return (
    <ServiceComingSoon
      serviceId="stay"
      brandNameKo="룸헬퍼"
      brandNameEn="RoomHelper"
      categoryBadge="Curated World-Class Luxury Stays & Suites"
      tagline="전 세계 5성급 럭셔리 스위트룸 큐레이션과 시네마틱 예약 경험을 위해 모든 마무리 작업을 진행하고 있습니다."
      description="현재 룸헬퍼(RoomHelper)는 사이트 공개를 잠시 중단하고 모든 마무리 작업을 완료한 후 다시 공개될 예정입니다. 차원이 다른 완벽한 휴식과 감동으로 곧 돌아오겠습니다."
      accentColor="amber"
      completionTasks={[
        "글로벌 5성급 럭셔리 리조트 및 스위트룸 프로모션 진위 검증 체계 고도화",
        "호텔 공식 VIP 특전 및 룸 큐레이션 데이터 무결점 동기화",
        "시네마틱 투어 비디오 플레이어 및 고속 스트리밍 인프라 최종 점검",
      ]}
    />
  );
}
