'use client';

import React, { useState } from 'react';
import { Cpu, TrendingUp, Building, CheckCircle2 } from 'lucide-react';
import { TabKey } from '@/types/navigation';

interface InteractiveShowcaseProps {
  onNavigate?: (tab: TabKey) => void;
}

export const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'aidc' | 'mna' | 'realestate'>('aidc');

  const showcaseData = {
    aidc: {
      category: '신성장 인프라 · 부종목',
      title: 'AI 데이터센터 개발 & PM',
      subtitle: '초거대 AI 시대, 수도권 전력 공급 제약을 돌파하는 맞춤형 인프라 솔루션',
      badge: '하이퍼스케일 인프라 모델',
      imageUrl:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
      imageCaption: '초고성능 GPU 랙 & 차세대 데이터센터 전력 계통 설계',
      hudStats: [
        { label: '국내 개발 파이프라인', val: '1.2 GW' },
        { label: '전력 수전 목표 계통', val: '154 kV 변전' },
        { label: '설계 PUE 목표', val: '1.15 이하' },
      ],
      metrics: [
        { label: '시장 기회', val: '725MW → 1.2GW', desc: '국내 운영 및 파이프라인 급성장세' },
        { label: '정부 지원', val: '1.46조원', desc: '국가 첨단 GPU 인프라 확보 추경 예산' },
        { label: '핵심 전략', val: 'PM & 자문', desc: '초기 시설 무보유 진입 후 개발 확대' },
      ],
      details: [
        '수도권 송배전 계통 여유도 사전 정밀 분석 및 한전 협의 자문',
        '인공지능(AI) 데이터센터 부지 인허가, 설계, 시공 총괄 PM',
        '고전력 밀도(Rack당 40kW+) 코로케이션 및 액체·액침 냉각 솔루션 기획',
        '국내외 인프라 펀드 및 기관 투자자 연계 자금조달(Financial Structuring)',
      ],
    },
    mna: {
      category: '기업 가치 극대화 · 주종목',
      title: '경영컨설팅 & 기업인수합병(M&A)',
      subtitle: '21만 개 중소·중견기업 가업승계 고민을 해결하는 맞춤형 자문 파트너',
      badge: '글로벌 M&A 자문 스탠다드',
      imageUrl:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
      imageCaption: '기업가치평가(Valuation) 및 사전 정밀 실사(Due Diligence) 회의실',
      hudStats: [
        { label: '국내 승계 잠재수요', val: '210,000+ 개사' },
        { label: '중소·벤처 M&A 비중', val: '78.6%' },
        { label: '자문 프로세스', val: '가치평가·실사·PMI' },
      ],
      metrics: [
        { label: '잠재 시장', val: '21만 개사', desc: '베이비부머 CEO 은퇴 승계 수요' },
        { label: '패키지 지원', val: '원스톱', desc: '가치평가 + 세무 + 법률 실사 원스톱' },
        { label: '정책 연계', val: '중기부 사업', desc: '정부 중기부 M&A 지원사업 매칭' },
      ],
      details: [
        '승계자 부재 또는 지분 승계 세부담 고민 기업을 위한 M&A 최적 솔루션',
        '현금흐름할인법(DCF), 시장배수법 기반 정밀 기업가치평가(Valuation)',
        '잠재적 리스크를 사전에 식별하는 회계·세무·법률 사전 정밀 실사',
        '인수 후 기업문화 및 시스템 융합을 돕는 PMI(Post-Merger Integration) 지원',
      ],
    },
    realestate: {
      category: '자산 재편 & 가치 제고',
      title: '부동산 개발 & PF 재구조화',
      subtitle: 'PF 정상화 국면의 부실우려 사업장을 발굴하여 고수익 대체자산으로 전환',
      badge: '대체자산 재구조화 모델',
      imageUrl:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      imageCaption: '도심 스카이라인 및 상업용·대체자산 재구조화 개발 현장',
      hudStats: [
        { label: '정리·재구조화 시장', val: '16.5조원' },
        { label: 'PF 자기자본비율 목표', val: '20% 규제 대응' },
        { label: '전환 타겟', val: '데이터센터·물류' },
      ],
      metrics: [
        { label: 'PF 익스포져', val: '177.9조원', desc: '국내 부동산 PF 총 잔액' },
        { label: '규제 대응', val: '5% → 20%', desc: '2027년 자기자본비율 상향 대비' },
        { label: '자산 전환', val: '대체자산', desc: '주거/상업에서 첨단 DC로 전환' },
      ],
      details: [
        '본PF 지연 및 브릿지론 연장 곤란 사업장의 이해관계자 권리 조정',
        '인허가 변경을 통한 데이터센터, 첨단 물류, 업무시설 등 대체자산 전환',
        '부실채권(NPL) 자산유동화 및 에쿼티 재투자 구조 설계',
        '2027년 강화되는 PF 건전성 제도에 부합하는 표준화 금융 구조화',
      ],
    },
  };

  const current = showcaseData[activeTab];

  return (
    <section id="showcase" className="relative pt-36 pb-24 min-h-[88vh] bg-[#F8FAFC] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 tracking-wider uppercase mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            Interactive Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight break-keep">
            화천퍼스트의 <span className="text-gold-gradient">입체적 비즈니스 솔루션</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal break-keep">
            아래 탭을 클릭하여 각 사업 영역의 실물 비주얼, 시장 데이터 및 핵심 실행 역량을 직접 확인해 보세요.
          </p>
        </div>

        {/* Apple-style Clean Segmented Tab Control */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/60 border border-slate-200/80 shadow-inner">
            <button
              onClick={() => setActiveTab('aidc')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'aidc'
                  ? 'bg-white text-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Cpu className="w-4 h-4 text-sky-600" />
              <span>AI 데이터센터 & 전력 인프라</span>
            </button>

            <button
              onClick={() => setActiveTab('mna')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'mna'
                  ? 'bg-white text-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>경영컨설팅 & 기업승계 M&A</span>
            </button>

            <button
              onClick={() => setActiveTab('realestate')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'realestate'
                  ? 'bg-white text-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Building className="w-4 h-4 text-emerald-600" />
              <span>부동산 개발 & PF 재구조화</span>
            </button>
          </div>
        </div>

        {/* Large Split-Screen Showcase Display */}
        <div className="card-clean-luxury p-8 sm:p-12 overflow-hidden bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-7">
              <div>
                <span className="text-xs font-semibold text-amber-800 tracking-wider uppercase bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full">
                  {current.category}
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 mt-3 leading-tight break-keep">
                  {current.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-2.5 font-normal leading-relaxed break-keep">
                  {current.subtitle}
                </p>
              </div>

              {/* 3 Metric Pills with Clean Typography */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {current.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col justify-between min-h-[102px]"
                  >
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">{m.label}</div>
                      <div className="text-lg sm:text-xl font-black text-slate-950 tracking-tight mt-0.5 whitespace-nowrap">
                        {m.val}
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 mt-1.5 leading-snug break-keep">
                      {m.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bullet Checklist */}
              <div className="space-y-3.5 pt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  화천퍼스트 핵심 실행 역량
                </div>
                <div className="space-y-2.5">
                  {current.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-normal leading-relaxed break-keep">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Visual Column (Cinematic Image with Clean Frosted HUD Badges) */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] aspect-[4/3] group">
                {/* Background Image */}
                <img
                  src={current.imageUrl}
                  alt={current.title}
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 filter brightness-95 contrast-105"
                />

                {/* Soft Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/15" />

                {/* Top Benchmark Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{current.badge}</span>
                </div>

                {/* Image Bottom HUD Strip */}
                <div className="absolute bottom-4 inset-x-4 z-10 space-y-2">
                  <div className="text-[11px] text-white font-medium bg-slate-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 flex items-center justify-between">
                    <span>{current.imageCaption}</span>
                    <span className="text-amber-300 font-bold tracking-wider text-[10px]">ACTIVE HUD</span>
                  </div>

                  {/* 3 Floating Stat Counters */}
                  <div className="grid grid-cols-3 gap-2">
                    {current.hudStats.map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white/95 backdrop-blur-md p-2.5 rounded-lg border border-slate-200 text-center shadow-sm"
                      >
                        <div className="text-[10px] text-slate-500 font-medium leading-tight break-keep">{stat.label}</div>
                        <div className="text-xs sm:text-sm font-black text-slate-950 tracking-tight mt-0.5 whitespace-nowrap">
                          {stat.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Switcher Footer */}
        {onNavigate && (
          <div className="mt-16 pt-8 border-t border-slate-200/80 flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <span>← 홈으로 돌아가기</span>
            </button>
            <button
              onClick={() => onNavigate('business')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
            >
              <span>다음: 3대 핵심 사업 영역 →</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
