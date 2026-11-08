import React from "react";
import type { Metadata } from "next";
import ServiceComingSoon from "@/components/ServiceComingSoon";

export const metadata: Metadata = {
  title: "WeddingHelper Gallery • 마무리 작업 진행 중 (곧 돌아오겠습니다)",
  description:
    "웨딩헬퍼 갤러리는 사이트 공개를 잠시 중단하고 모든 마무리 작업을 완료한 후 다시 공개할 예정입니다. 곧 돌아오겠습니다.",
};

export default function WeddingHelperGalleryPage() {
  return (
    <ServiceComingSoon
      serviceId="wedding"
      brandNameKo="웨딩헬퍼 갤러리"
      brandNameEn="WeddingHelper Gallery"
      categoryBadge="Haute Destination Wedding Showcase"
      tagline="12대 럭셔리 데스티네이션 웨딩 화보 갤러리의 완성도를 높이기 위해 마무리 작업을 진행 중입니다."
      description="현재 웨딩헬퍼 갤러리는 사이트 공개를 잠시 중단하고 모든 마무리 작업을 완료한 후 다시 공개할 예정입니다. 곧 돌아오겠습니다."
      accentColor="rose"
      completionTasks={[
        "초고화질 럭셔리 웨딩 화보 렌더링 품질 최종 전수 검사",
        "웨딩 베일 및 주얼리 디테일 강화 알고리즘 적용 완료",
        "갤러리 큐레이션 및 글로벌 CDN 고속 로딩 최적화",
      ]}
    />
  );
}
