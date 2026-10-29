'use client';

import React from 'react';
import { ShieldCheck, Network, Scale, Workflow, CheckCircle } from 'lucide-react';
import { TabKey } from '@/types/navigation';

interface StrengthsSectionProps {
  onNavigate?: (tab: TabKey) => void;
}

export const StrengthsSection: React.FC<StrengthsSectionProps> = ({ onNavigate }) => {
  const strengths = [
    {
      icon: Network,
      title: '금융·부동산과 테크의 융합',
      subtitle: 'Hybrid Expertise',
      description:
        '단순 중개나 컨설팅에 머무르지 않고, 복잡한 PF 금융 구조와 고전력 AI 인프라 기술을 동시에 이해하고 기획할 수 있는 독보적인 하이브리드 실행력을 보유합니다.',
    },
    {
      icon: Scale,
      title: '정책 및 제도 변화 선제 대응',
      subtitle: 'Regulatory Insight',
      description:
        '2027년 PF 자기자본비율 상향(20%) 및 중기부 M&A 정책 등 급변하는 규제 환경을 사업 초기 설계부터 철저히 반영하여 리스크를 사전에 차단합니다.',
    },
    {
      icon: Workflow,
      title: '전 과정 원스톱 프로젝트 관리',
      subtitle: 'End-to-End PM Execution',
      description:
        '타겟 발굴부터 정밀 가치평가, 실사, 송배전 계통 협의, 자금 구조화 및 인수 후 통합(PMI)까지 일관된 체계로 완결성을 보장합니다.',
    },
    {
      icon: ShieldCheck,
      title: '투명하고 책임 있는 각자대표 체제',
      subtitle: 'Trust & Governance',
      description:
        '전문 분야별 독립성과 기동성을 겸비한 각자대표 체제와 이사회 거버넌스를 통해 고객사와 파트너에게 흔들리지 않는 신뢰를 제공합니다.',
    },
  ];

  return (
    <section id="strengths" className="relative pt-36 pb-24 min-h-[88vh] bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 tracking-wider uppercase mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            Why Hwacheon First
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight break-keep">
            화천퍼스트만의 <span className="text-gold-gradient">차별화된 경쟁력</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal break-keep">
            시장 변동성 속에서도 견고한 가치를 실현하는 전문 역량과 신뢰의 네트워크
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {strengths.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="card-clean-luxury p-8 sm:p-9 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-amber-700 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-amber-700 tracking-wider uppercase font-semibold">
                        {item.subtitle}
                      </span>
                      <h3 className="text-xl font-bold text-slate-950">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mt-3 break-keep">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="font-mono">CORE ADVANTAGE 0{index + 1}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Page Switcher Footer */}
        {onNavigate && (
          <div className="mt-16 pt-8 border-t border-slate-200/80 flex items-center justify-between">
            <button
              onClick={() => onNavigate('simulator')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <span>← 이전: 진단 시뮬레이터</span>
            </button>
            <button
              onClick={() => onNavigate('roadmap')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
            >
              <span>다음: 단계별 성장 로드맵 →</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
