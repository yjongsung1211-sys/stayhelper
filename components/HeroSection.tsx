'use client';

import React from 'react';
import { ArrowUpRight, Cpu, Building2, TrendingUp, ChevronDown } from 'lucide-react';
import { LogoHF } from './LogoHF';
import dynamic from 'next/dynamic';

const FirstMotionCore = dynamic(
  () => import('./FirstMotionCore').then((mod) => mod.FirstMotionCore),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[180px] rounded-2xl bg-slate-950/90 border border-amber-500/30 flex items-center justify-center text-amber-300 text-xs font-mono">
        FIRSTMOVE™ 3D CORE 로딩 중...
      </div>
    ),
  }
);
import { TabKey } from '@/types/navigation';

interface HeroSectionProps {
  onNavigate?: (tab: TabKey) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const handleNav = (tab: TabKey) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      window.location.hash = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] pt-36 pb-20 flex flex-col justify-center overflow-hidden bg-[#FAFBFD]">
      {/* Crisp, Airy Architectural Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft Modern Glass Architecture Image */}
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
          alt="Modern Architectural Infrastructure"
          className="w-full h-full object-cover object-center opacity-6 filter contrast-105 saturate-0"
        />
        {/* Soft Radial Ambient Light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-amber-50/50 via-sky-50/20 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFBFD]/50 via-[#FAFBFD]/85 to-[#FAFBFD]" />

        {/* Minimal Grid Line Guide */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F020_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F020_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_30%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Bold Crisp Editorial Typography */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Top Prestige Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span className="text-xs font-semibold tracking-wider text-slate-700 uppercase font-sans">
                Hwacheon First Co., Ltd.
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.16]">
              신뢰와 전문성으로 완성하는 <br />
              <span className="text-gold-gradient">
                미래 자산과 기업 가치
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed break-keep">
              <strong className="text-slate-950 font-semibold">(주)화천퍼스트</strong>는 
              중소·중견기업 <span className="text-slate-900 font-medium">경영컨설팅 및 M&A 자문</span>, 
              초거대 AI 시대를 대비하는 <span className="text-slate-900 font-medium">AI 데이터센터 개발·PM</span>, 
              그리고 시장 재편기의 <span className="text-slate-900 font-medium">부동산 PF 재구조화 투자</span>를 총괄하는 하이브리드 종합 자문·개발 법인입니다.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => handleNav('business')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-[0_2px_10px_rgba(217,119,6,0.15)] hover:shadow-[0_4px_16px_rgba(217,119,6,0.25)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 font-sans cursor-pointer"
              >
                <span>사업 영역 & 솔루션 탐색</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNav('simulator')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] font-sans cursor-pointer"
              >
                <span>진단 시뮬레이터 실행</span>
              </button>
            </div>

            {/* Active Telemetry Status Strip */}
            <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-3 text-left">
              <button
                onClick={() => handleNav('business')}
                className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-amber-300 hover:bg-amber-50/20 transition-all text-left cursor-pointer"
              >
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  M&A 자문
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                  가업승계 & 실사
                </div>
              </button>

              <button
                onClick={() => handleNav('business')}
                className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-sky-300 hover:bg-sky-50/20 transition-all text-left cursor-pointer"
              >
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  AI 데이터센터
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                  154kV 전력 계통
                </div>
              </button>

              <button
                onClick={() => handleNav('business')}
                className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-amber-300 hover:bg-amber-50/20 transition-all text-left cursor-pointer"
              >
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  부동산 재구조화
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                  2027 PF 규제대응
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Clean Architectural Showcase Panel */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/90 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.06)] p-7 sm:p-8 space-y-6">
              {/* Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <LogoHF size={32} showWordmark={false} />
                  <div>
                    <span className="text-[11px] tracking-wider text-amber-700 font-semibold uppercase">
                      HWACHEON FIRST
                    </span>
                    <h3 className="text-base font-bold text-slate-950">핵심 사업 아키텍처</h3>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-800 font-medium bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                  운영 공식 법인
                </span>
              </div>

              {/* FirstMotion 3D Tech Core Interactive Viewport */}
              <FirstMotionCore height={180} theme="gold" />

              {/* 3 Core Pillar Clean Rows */}
              <div className="space-y-3">
                <button
                  onClick={() => handleNav('business')}
                  className="w-full text-left p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all flex items-start gap-3.5 cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-amber-700 shrink-0 shadow-sm">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">경영컨설팅 & 기업승계 M&A</h4>
                      <span className="text-[10px] text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded font-semibold">주종목</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug break-keep">
                      기업가치평가(DCF), 사전 정밀실사, PMI, 중기부 지원사업 매칭
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('business')}
                  className="w-full text-left p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all flex items-start gap-3.5 cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-sky-700 shrink-0 shadow-sm">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">AI 데이터센터 개발 & PM</h4>
                      <span className="text-[10px] text-sky-800 bg-sky-100/70 px-1.5 py-0.5 rounded font-semibold">부종목</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug break-keep">
                      154kV 전력 계통 인입, 고전력 코로케이션 및 프로젝트 매니징
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('business')}
                  className="w-full text-left p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all flex items-start gap-3.5 cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0 shadow-sm">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">부동산 개발 & PF 재구조화</h4>
                      <span className="text-[10px] text-slate-700 bg-slate-200/70 px-1.5 py-0.5 rounded font-semibold">등기목적</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug break-keep">
                      PF 정상화 부실사업장 전환, 2027 자기자본비율 규제 대응 구조화
                    </p>
                  </div>
                </button>
              </div>

              {/* Bottom Trust & Governance Bar */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>각자대표 윤지원 · 윤종성</span>
                <span className="text-slate-700 font-medium">사업자등록 891-87-03781</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Key Stats Bar - Minimalist and Pure */}
        <div className="mt-16 pt-10 border-t border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">26개</div>
            <div className="text-xs font-semibold text-slate-800 mt-1.5 break-keep">등기상 목적사업</div>
            <div className="text-[11px] text-slate-500 mt-0.5 break-keep">부동산·자문·AI DC 전방위</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">1.2 GW</div>
            <div className="text-xs font-semibold text-slate-800 mt-1.5 break-keep">국내 AI DC 파이프라인</div>
            <div className="text-[11px] text-slate-500 mt-0.5 break-keep">전력망 연계형 입지 PM</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">16.5조원</div>
            <div className="text-xs font-semibold text-slate-800 mt-1.5 break-keep">PF 재구조화 타겟 시장</div>
            <div className="text-[11px] text-slate-500 mt-0.5 break-keep">대체자산 전환 개발</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">각자대표</div>
            <div className="text-xs font-semibold text-slate-800 mt-1.5 break-keep">윤지원 · 윤종성</div>
            <div className="text-[11px] text-slate-500 mt-0.5 break-keep">독립적·책임있는 경영체제</div>
          </div>
        </div>
      </div>

      {/* Down arrow indicator to navigate to next tab */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => handleNav('business')}
          className="text-slate-400 hover:text-slate-700 transition-colors animate-bounce p-2 cursor-pointer focus:outline-none"
          aria-label="사업 영역 및 솔루션으로 이동"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
