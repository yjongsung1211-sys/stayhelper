'use client';

import React, { useState } from 'react';
import { TrendingUp, Cpu, Building, CheckCircle2, Sparkles } from 'lucide-react';
import { TabKey } from '@/types/navigation';

interface BusinessSectionProps {
  onNavigate?: (tab: TabKey) => void;
}

export const BusinessSection: React.FC<BusinessSectionProps> = ({ onNavigate }) => {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'aidc' | 'mna' | 'realestate'>('aidc');

  const businessAreas = [
    {
      id: 'mna',
      badge: '주종목 · 사업자등록',
      title: '경영컨설팅 & M&A 자문',
      engTitle: 'Management Consulting & M&A Advisory',
      description:
        '국내 중소·중견기업의 지속 성장을 위한 기업승계형 M&A 전 과정 자문과 종합 경영 솔루션을 제공합니다.',
      icon: TrendingUp,
      accent: 'text-amber-700 bg-amber-50 border-amber-200/70',
      marketStat: {
        number: '21만 개사',
        label: '국내 기업승계 M&A 잠재 수요',
        sub: '국내 M&A 중 중소·벤처 비중 78.6%',
      },
      points: [
        '중소·중견기업 가업승계 및 승계형 M&A 전 과정 자문',
        '정밀 기업가치평가(Valuation) 및 재무·법률 사전 실사(Due Diligence)',
        '인수 후 통합(PMI) 전략 수립 및 경영 효율화 컨설팅',
        '중소벤처기업부 「M&A 지원사업」 연계 자문 및 딜 매칭',
      ],
      tags: ['가치평가', '실사자문', 'PMI', '기업승계', '정부지원사업'],
    },
    {
      id: 'aidc',
      badge: '부종목 · 신성장동력',
      title: 'AI 데이터센터 개발 & PM',
      engTitle: 'AI Data Center Development & PM',
      description:
        '급증하는 초거대 AI 컴퓨팅 수요와 수도권 전력 공급 제약을 대응하는 전력 인프라 연계형 데이터센터 개발을 실행합니다.',
      icon: Cpu,
      accent: 'text-sky-700 bg-sky-50 border-sky-200/70',
      marketStat: {
        number: '1.2 GW',
        label: '국내 AI DC 개발 파이프라인',
        sub: '기존 725MW 대비 급성장세 · 정부 GPU 확보 연계',
      },
      points: [
        '수도권 전력망 및 송배전 계통 여유를 고려한 최적 입지 분석',
        '인공지능 데이터센터 프로젝트 매니저(PM) 및 개발 총괄',
        '고전력 밀도(Rack당 40kW+) 코로케이션 및 차세대 액체·액침 냉각 솔루션 기획',
        '초기 자금조달 구조 설계 및 금융·투자 자문',
      ],
      tags: ['전력인프라', 'DC PM', '코로케이션', 'GPU렌탈', '냉각솔루션'],
    },
    {
      id: 'pf',
      badge: '등기목적 · 자산재편',
      title: '부동산 개발 & PF 재구조화',
      engTitle: 'Real Estate & PF Restructuring',
      description:
        'PF 정상화 국면의 부실우려 사업장을 발굴하여 시장 수요가 검증된 고수익 대체자산으로의 전환 및 구조화를 추진합니다.',
      icon: Building,
      accent: 'text-slate-700 bg-slate-100 border-slate-200',
      marketStat: {
        number: '16.5조원',
        label: '부동산 PF 정리·재구조화 대상',
        sub: '총 익스포져 177.9조원 중 정상화 타겟',
      },
      points: [
        '부실우려 PF 사업장 매입 타당성 분석 및 자산 실사',
        '데이터센터, 첨단 물류, 복합업무시설 등 대체자산(Alternative) 용도 전환',
        'NPL 자산유동화 및 에쿼티 재투자 구조화 설계',
        '2027년 PF 자기자본비율 강화 규제에 선제 대응하는 표준화 금융 구조화',
      ],
      tags: ['PF재구조화', '대체자산전환', 'NPL유동화', '자본설계', '개발기획'],
    },
  ];

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
        'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80',
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

  const currentInteractive = showcaseData[activeInteractiveTab];

  return (
    <section id="business" className="relative pt-36 pb-24 min-h-[88vh] bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* ========================================================
            PART 1: 3대 핵심 사업 영역 개요 (Core Domains Overview)
           ======================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 tracking-wider uppercase mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            Core Business Domains
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight break-keep">
            화천퍼스트의 <span className="text-gold-gradient">3대 핵심 사업 영역</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal break-keep">
            시대적 변화를 주도하는 세 가지 핵심 축을 중심으로 전문 자문과 실물 개발을 총괄합니다.
          </p>
        </div>

        {/* 3 Core Business Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {businessAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.id}
                className="card-clean-luxury p-8 sm:p-9 flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                      {area.badge}
                    </span>
                    <div className={`p-3 rounded-xl border ${area.accent} shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Titles */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-950 group-hover:text-amber-800 transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-sans mt-1">
                      {area.engTitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal break-keep">
                    {area.description}
                  </p>

                  {/* Market Stat Pill */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      {area.marketStat.label}
                    </div>
                    <div className="text-2xl font-black text-slate-950 font-sans tracking-tight">
                      {area.marketStat.number}
                    </div>
                    <div className="text-[11px] text-slate-600 break-keep">
                      {area.marketStat.sub}
                    </div>
                  </div>

                  {/* Key Execution Points */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      주요 수행 영역
                    </div>
                    {area.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug break-keep">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Tags */}
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {area.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        {/* ========================================================
            PART 2: 인터랙티브 솔루션 심층 분석 (Interactive Deep-Dive)
           ======================================================== */}
        <div className="pt-16 border-t border-slate-200/80">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 tracking-wider uppercase mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Interactive Solution Showcase
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight break-keep">
              실물 비주얼 & <span className="text-gold-gradient">심층 실행 솔루션</span>
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal break-keep">
              아래 탭을 클릭하여 각 사업 영역의 현장 비주얼, 시장 데이터 및 단계별 세부 실행 플랜을 직접 확인해 보세요.
            </p>
          </div>

          {/* Apple-style Clean Segmented Tab Control */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/90 shadow-inner">
              <button
                onClick={() => setActiveInteractiveTab('aidc')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeInteractiveTab === 'aidc'
                    ? 'bg-white text-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Cpu className="w-4 h-4 text-sky-600" />
                <span>AI 데이터센터 & 전력 인프라</span>
              </button>

              <button
                onClick={() => setActiveInteractiveTab('mna')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeInteractiveTab === 'mna'
                    ? 'bg-white text-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>경영컨설팅 & 기업승계 M&A</span>
              </button>

              <button
                onClick={() => setActiveInteractiveTab('realestate')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeInteractiveTab === 'realestate'
                    ? 'bg-white text-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Building className="w-4 h-4 text-slate-700" />
                <span>부동산 PF & 대체자산 전환</span>
              </button>
            </div>
          </div>

          {/* Interactive Showcase Display Frame */}
          <div className="card-clean-luxury p-7 sm:p-10 bg-slate-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Solution Details */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-bold text-amber-800 tracking-wider uppercase">
                    {currentInteractive.category}
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1 break-keep">
                    {currentInteractive.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal leading-relaxed break-keep">
                    {currentInteractive.subtitle}
                  </p>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {currentInteractive.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm"
                    >
                      <div className="text-[11px] text-slate-500 font-medium leading-tight break-keep">{m.label}</div>
                      <div className="text-sm sm:text-base font-black text-slate-950 font-sans tracking-tight mt-0.5 break-keep">
                        {m.val}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-medium break-keep leading-snug">
                        {m.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checklist Points */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    핵심 실행 역량 & 지원 프로세스
                  </div>
                  {currentInteractive.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-normal leading-relaxed break-keep">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Visual Preview with Floating HUD */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] aspect-[4/3] group">
                  {/* Background Image */}
                  <img
                    src={currentInteractive.imageUrl}
                    alt={currentInteractive.title}
                    className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 filter brightness-95 contrast-105"
                  />

                  {/* Soft Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/15" />

                  {/* Top Benchmark Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{currentInteractive.badge}</span>
                  </div>

                  {/* Image Bottom HUD Strip */}
                  <div className="absolute bottom-4 inset-x-4 z-10 space-y-2">
                    <div className="text-[11px] text-white font-medium bg-slate-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 flex items-center justify-between">
                      <span>{currentInteractive.imageCaption}</span>
                      <span className="text-amber-300 font-bold tracking-wider text-[10px]">ACTIVE HUD</span>
                    </div>

                    {/* 3 Floating Stat Counters */}
                    <div className="grid grid-cols-3 gap-2">
                      {currentInteractive.hudStats.map((stat, i) => (
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
        </div>

        {/* Page Switcher Footer */}
        {onNavigate && (
          <div className="mt-16 pt-8 border-t border-slate-200/80 flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <span>← 메인 홈으로</span>
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
            >
              <span>다음: 진단 시뮬레이터 →</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
