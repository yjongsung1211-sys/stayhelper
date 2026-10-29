'use client';

import React from 'react';
import { TabKey } from '@/types/navigation';

interface RoadmapSectionProps {
  onNavigate?: (tab: TabKey) => void;
}

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({ onNavigate }) => {
  const roadmapStages = [
    {
      quarter: '2026 Q4',
      badge: '현재 진행',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200/80',
      title: '초기 기반 수립 & 패키지 설계',
      description: '시장 진입 장벽이 낮은 PM 및 자문 중심 상품을 론칭하고 타겟 사업장을 발굴합니다.',
      items: [
        { domain: '경영컨설팅·M&A', text: '가치평가·실사·PMI 패키지 자문 상품 기획 완료' },
        { domain: 'AI 데이터센터', text: '시설 보유 없이 진입 가능한 PM·자문 첫 수임 추진' },
        { domain: '부동산 개발', text: 'PF 정상화 국면의 재구조화 대상 사업장 및 부지 발굴' },
      ],
    },
    {
      quarter: '2027 상반기',
      badge: '제도 연계',
      badgeColor: 'bg-sky-50 text-sky-900 border-sky-200/80',
      title: '정책 연계 & 인프라 정밀 검토',
      description: '정부 지원사업 연계 및 수도권 전력 공급 제약을 반영한 기술 검토를 실행합니다.',
      items: [
        { domain: '경영컨설팅·M&A', text: '중소벤처기업부 「M&A 지원사업」 공식 연계 신청' },
        { domain: 'AI 데이터센터', text: '수도권 전력망 여유 분석 기반 입지·전력·냉각 솔루션 확정' },
        { domain: '부동산 개발', text: 'PF 자기자본비율 5→20% 규제 상향에 맞춘 자본구조 표준화' },
      ],
    },
    {
      quarter: '2027 하반기',
      badge: '실행 착수',
      badgeColor: 'bg-indigo-50 text-indigo-900 border-indigo-200/80',
      title: '실행 착수 & 첫 딜 완결',
      description: '부동산 재구조화 1건 착수 및 승계형 M&A 딜의 성공적 수행을 달성합니다.',
      items: [
        { domain: '경영컨설팅·M&A', text: '중소기업 기업승계형 자문 딜 첫 수임 및 성공 수행' },
        { domain: 'AI 데이터센터', text: '데이터센터 개발 펀딩 및 자금조달 구조 확정' },
        { domain: '부동산 개발', text: '재구조화 사업장 1건 첫 개발 및 자산 전환 착수' },
      ],
    },
    {
      quarter: '2028년 이후',
      badge: '본격 확대',
      badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200/80',
      title: '개발·운영 확대 및 복합 시너지',
      description: '자문 레퍼런스를 바탕으로 개발 및 운영으로 확대하여 종합 인프라 기업으로 도약합니다.',
      items: [
        { domain: '경영컨설팅·M&A', text: '부동산·AI DC 연계 복합 대형 딜로 자문 포트폴리오 확대' },
        { domain: 'AI 데이터센터', text: '고전력 코로케이션 및 GPU 인프라 실물 개발·운영 개시' },
        { domain: '부동산 개발', text: '데이터센터 부지 등 고수익 대체자산(Alternative) 개발 본격화' },
      ],
    },
  ];

  return (
    <section id="roadmap" className="relative pt-36 pb-24 min-h-[88vh] bg-[#F8FAFC] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 tracking-wider uppercase mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            Strategic Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight break-keep">
            단계별 성장 <span className="text-gold-gradient">로드맵</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal break-keep">
            초기에는 PM·자문에 집중하여 전문성을 검증하고, 중장기적으로 직접 개발·운영으로 영역을 확대합니다.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadmapStages.map((stage, idx) => (
            <div
              key={idx}
              className="card-clean-luxury p-7 flex flex-col justify-between relative group"
            >
              <div>
                {/* Quarter & Badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xl font-black text-slate-950 tracking-tight font-sans">
                    {stage.quarter}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${stage.badgeColor}`}
                  >
                    {stage.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-950 mb-2 break-keep">
                  {stage.title}
                </h3>

                <p className="text-xs text-slate-600 font-normal leading-relaxed mb-6 break-keep">
                  {stage.description}
                </p>

                {/* Domain Items */}
                <div className="space-y-3.5 pt-4 border-t border-slate-100">
                  {stage.items.map((it, i) => (
                    <div key={i} className="text-xs space-y-1">
                      <div className="text-[11px] font-bold text-amber-800 tracking-wider uppercase">
                        [{it.domain}]
                      </div>
                      <div className="text-slate-700 font-normal leading-snug break-keep">
                        {it.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step indicator */}
              <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>PHASE 0{idx + 1}</span>
                <span className="text-amber-700 font-bold">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Page Switcher Footer */}
        {onNavigate && (
          <div className="mt-16 pt-8 border-t border-slate-200/80 flex items-center justify-between">
            <button
              onClick={() => onNavigate('strengths')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <span>← 이전: 핵심 경쟁력</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
            >
              <span>메인 홈으로 이동 →</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
