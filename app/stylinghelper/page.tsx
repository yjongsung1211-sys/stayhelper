import React from "react";
import type { Metadata } from "next";
import ServiceComingSoon from "@/components/ServiceComingSoon";

export const metadata: Metadata = {
  title: "StylingHelper • 마무리 작업 진행 중 (곧 돌아오겠습니다)",
  description:
    "스타일헬퍼는 사이트 공개를 잠시 중단하고 모든 마무리 작업을 완료한 후 다시 공개할 예정입니다. 곧 돌아오겠습니다.",
};

export default function StylingHelperPage() {
  return (
    <ServiceComingSoon
      serviceId="styling"
      brandNameKo="스타일헬퍼"
      brandNameEn="StylingHelper"
      categoryBadge="AI Luxury Fashion Styling & Smart Wardrobe"
      tagline="하이엔드 럭셔리 패션 스타일링과 스마트 워드로브 큐레이션의 완성도를 극대화하기 위해 마무리 점검을 진행하고 있습니다."
      description="현재 스타일헬퍼(StylingHelper)는 사이트 공개를 잠시 중단하고 모든 마무리 작업을 완료한 후 다시 공개될 예정입니다. 가장 독보적인 스타일 제안으로 곧 돌아오겠습니다."
      accentColor="emerald"
      completionTasks={[
        "글로벌 럭셔리 정품 3대 앵커 아이템 실시간 재고 연동 시스템 점검",
        "AI 가상 피팅 및 퍼스널 스타일링 알고리즘 최종 튜닝",
        "스마트 옷장 데이터베이스 무결점 동기화 및 렌더링 최적화",
      ]}
    />
  );
}
