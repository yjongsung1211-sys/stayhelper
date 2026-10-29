'use client';

import React, { useState } from 'react';
import { Sliders, ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';
import { TabKey } from '@/types/navigation';

interface SimulatorWidgetProps {
  onNavigate?: (tab: TabKey) => void;
}

export const SimulatorWidget: React.FC<SimulatorWidgetProps> = ({ onNavigate }) => {
  const [projectType, setProjectType] = useState<'mna' | 'aidc' | 'pf'>('aidc');
  const [scale, setScale] = useState<number>(2);

  const solutions = {
    aidc: {
      scaleLabels: ['10MW 미만 (소형 DC)', '20MW ~ 40MW (중대형 DC)', '50MW 이상 (하이퍼스케일)'],
      title: 'AI 데이터센터 전력 계통 및 인허가 PM 솔루션',
      phases: [
        { step: '1단계', time: '1~2개월', name: '한전 154kV 송배전 여유도 사전 정밀 분석 및 입지 타당성 검토' },
        { step: '2단계', time: '3~4개월', name: '지자체 데이터센터 개발행위허가 및 고전력 코로케이션 설계 기획' },
        { step: '3단계', time: '5~6개월', name: '국내외 인프라 사모펀드(PE) 및 기관 연계 금융구조화(PF/Equity)' },
      ],
      estimatedTime: '총 소요 기간: 약 6~12개월',
      keyPoint: '수도권 전력망 규제 하에서 안정적 수전 인입권을 조기에 확보하는 것이 사업 성패의 80%를 결정합니다.',
    },
    mna: {
      scaleLabels: ['연매출 50억~150억', '연매출 150억~500억', '연매출 500억 이상 중견기업'],
      title: '승계형 M&A 가치평가 및 원스톱 매각 자문 솔루션',
      phases: [
        { step: '1단계', time: '1개월', name: 'DCF 및 유사기업비교법 기반 정밀 기업가치평가(Valuation) 보고서 작성' },
        { step: '2단계', time: '2~3개월', name: '원매자(SI/FI) 롱리스트 발굴 및 중기부 M&A 지원사업 매칭 신청' },
        { step: '3단계', time: '4~5개월', name: '사전 실사(Due Diligence) 조율, SPA 계약 체결 및 PMI 통합 플랜 수립' },
      ],
      estimatedTime: '총 소요 기간: 약 4~6개월',
      keyPoint: '가업승계 세부담 완화와 경영권 프리미엄을 온전히 인정받는 최적의 거래 구조를 사전에 설계합니다.',
    },
    pf: {
      scaleLabels: ['대출 300억 미만', '대출 300억~1,000억', '대출 1,000억 이상 대형 사업장'],
      title: 'PF 부실우려 사업장 재구조화 & 대체자산 전환 솔루션',
      phases: [
        { step: '1단계', time: '1개월', name: '대주단 권리관계 및 담보가치 재평가, 이해관계자 사전 조율' },
        { step: '2단계', time: '2~3개월', name: '용도변경(데이터센터/첨단물류/복합업무) 인허가 시뮬레이션 및 사업성 분석' },
        { step: '3단계', time: '4~5개월', name: '2027 PF 자기자본비율 규제 대응 신규 에쿼티 유치 및 공사 재개 구조화' },
      ],
      estimatedTime: '총 소요 기간: 약 4~8개월',
      keyPoint: '단순 대출 만기 연장이 아닌, 시장 수요가 검증된 대체자산으로의 확실한 용도 전환이 핵심입니다.',
    },
  };

  const currentSol = solutions[projectType];

  return (
    <section id="simulator" className="relative pt-36 pb-24 min-h-[88vh] bg-[#F8FAFC] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 tracking-wider uppercase mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Advisory Feasibility Simulator
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight break-keep">
            프로젝트 <span className="text-gold-gradient">맞춤형 진단 시뮬레이터</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal break-keep">
            고객사의 사업 유형과 규모를 선택하시면, 화천퍼스트의 단계별 추천 실행 로드맵을 즉시 확인하실 수 있습니다.
          </p>
        </div>

        {/* Clean Dashboard Container */}
        <div className="card-clean-luxury p-8 sm:p-12 max-w-5xl mx-auto bg-white">
          {/* Step 1: Project Type Selection */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              1. 상담 및 자문 희망 프로젝트 분야를 선택하세요
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'aidc', label: 'AI 데이터센터 / 전력 인프라' },
                { id: 'mna', label: '경영컨설팅 / 기업승계 M&A' },
                { id: 'pf', label: '부동산 PF 재구조화 / 대체자산' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setProjectType(btn.id as any)}
                  className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                    projectType === btn.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Scale Selector */}
          <div className="mb-8 p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. 프로젝트 예상 규모 또는 대상 기업 규모
              </label>
              <span className="text-xs font-extrabold text-amber-800 font-sans">
                {currentSol.scaleLabels[scale - 1]}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={1}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2.5">
              <span>{currentSol.scaleLabels[0]}</span>
              <span>{currentSol.scaleLabels[1]}</span>
              <span>{currentSol.scaleLabels[2]}</span>
            </div>
          </div>

          {/* Output: Tailored Solution Display */}
          <div className="p-7 sm:p-9 rounded-2xl bg-slate-50/60 border border-slate-200/90">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
              <div>
                <span className="text-[11px] text-amber-800 tracking-wider uppercase font-bold">
                  RECOMMENDED EXECUTION PLAN
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-950 mt-1 break-keep">
                  {currentSol.title}
                </h4>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 shrink-0 font-medium shadow-sm">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentSol.estimatedTime}</span>
              </div>
            </div>

            {/* 3 Step Roadmap */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              {currentSol.phases.map((ph, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700">{ph.step}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                      {ph.time}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal break-keep">{ph.name}</p>
                </div>
              ))}
            </div>

            {/* Strategic Advice Callout */}
            <div className="p-4.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
              <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="break-keep">
                <strong className="text-amber-950 font-bold">화천퍼스트 자문 코멘트:</strong>{' '}
                {currentSol.keyPoint}
              </div>
            </div>

            {/* Direct CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-200/80">
              <span className="text-xs text-slate-500">
                선택하신 조건에 기반한 사전 실무 검토 및 체계적인 사업 자문을 제공합니다.
              </span>
              <button
                onClick={() => onNavigate ? onNavigate('roadmap') : (window.location.hash = 'roadmap')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all font-sans cursor-pointer"
              >
                <span>중장기 사업 로드맵 확인</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Switcher Footer */}
        {onNavigate && (
          <div className="mt-16 pt-8 border-t border-slate-200/80 flex items-center justify-between max-w-5xl mx-auto">
            <button
              onClick={() => onNavigate('business')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <span>← 이전: 사업 영역 & 솔루션</span>
            </button>
            <button
              onClick={() => onNavigate('strengths')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
            >
              <span>다음: 핵심 경쟁력 →</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
