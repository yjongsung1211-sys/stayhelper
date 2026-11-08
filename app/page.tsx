import React from "react";
import type { Metadata } from "next";
import ServiceComingSoon from "@/components/ServiceComingSoon";

export const metadata: Metadata = {
  title: "PersonalColorHelper • 마무리 작업 진행 중 (곧 돌아오겠습니다)",
  description:
    "퍼스널컬러 헬퍼는 사이트 공개를 잠시 중단하고 모든 마무리 작업을 완료한 후 다시 공개할 예정입니다. 곧 돌아오겠습니다.",
};

export default function HomePage() {
  return (
    <ServiceComingSoon
      serviceId="personalcolor"
      brandNameKo="퍼스널컬러 헬퍼"
      brandNameEn="PersonalColorHelper"
      categoryBadge="AI 12-Season Colorimetry Studio"
      tagline="보다 정밀하고 독보적인 퍼스널 컬러 진단 경험을 위해 모든 마무리 작업을 진행하고 있습니다."
      description="현재 퍼스널컬러 헬퍼는 사이트 공개를 잠시 중단하고 모든 마무리 작업을 완료한 후 다시 공개될 예정입니다. 최고의 진단 정확도와 완성도로 곧 돌아오겠습니다."
      accentColor="gold"
      completionTasks={[
        "12시즌 정밀 측색 매트릭스 및 가상 드레이핑 엔진 캘리브레이션",
        "실시간 피부톤 조명 보정 및 베스트 립스틱 매칭 고도화",
        "서버 인프라 최적화 및 보안 무결점 점검 완료",
      ]}
    />
  );
}
