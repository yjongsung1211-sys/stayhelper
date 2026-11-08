import React from "react";
import type { Metadata } from "next";
import ServiceComingSoon from "@/components/ServiceComingSoon";

export const metadata: Metadata = {
  title: "WeddingHelper • 마무리 작업 진행 중 (곧 돌아오겠습니다)",
  description:
    "웨딩헬퍼는 사이트 공개를 잠시 중단하고 모든 마무리 작업을 완료한 후 다시 공개할 예정입니다. 곧 돌아오겠습니다.",
};

export default function WeddingHelperPage() {
  return (
    <ServiceComingSoon
      serviceId="wedding"
      brandNameKo="웨딩헬퍼"
      brandNameEn="WeddingHelper"
      categoryBadge="Global AI Destination Wedding & Mobile Invitation"
      tagline="세계 최고의 12대 럭셔리 휴양지 웨딩 화보와 모바일 청첩장을 가장 완벽한 퀄리티로 선보이기 위해 마지막 마무리 작업을 진행하고 있습니다."
      description="현재 웨딩헬퍼는 사이트 공개를 잠시 중단하고 모든 마무리 작업을 완료한 후 다시 공개할 예정입니다. 생애 가장 눈부신 순간을 담아낼 최고의 모습으로 곧 돌아오겠습니다."
      accentColor="rose"
      completionTasks={[
        "12대 글로벌 럭셔리 데스티네이션 웨딩 화보 엔진 최종 캘리브레이션",
        "인터랙티브 모바일 청첩장 실시간 BGM 및 RSVP 연동 무결점 검수",
        "웨딩 갤러리 프리미엄 쇼케이스 및 클라우드 안정화 완료",
      ]}
    />
  );
}
