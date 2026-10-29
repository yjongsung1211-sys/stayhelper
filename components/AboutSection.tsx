'use client';

import React from 'react';
import { Building2, Users2, Shield, Award, Calendar, Landmark, FileText } from 'lucide-react';
import { LogoHF } from './LogoHF';

export const AboutSection: React.FC = () => {
  const corporateDetails = [
    { label: '회사명', value: '주식회사 화천퍼스트 (Hwacheon First Co., Ltd.)' },
    { label: '설립일 / 개업일', value: '2025년 8월 19일 설립 · 2026년 10월 1일 개업' },
    { label: '경영진', value: '대표이사 윤지원 · 윤종성 (각자대표)' },
    { label: '사업자등록번호', value: '891-87-03781' },
    { label: '법인등록번호', value: '110111-0934914' },
    { label: '자본금 / 주식', value: '5,000,000원 (보통주 1,000주 · 1주 5,000원)' },
    { label: '본점 소재지', value: '서울특별시 양천구 목동중앙남로16나길 82, 3층(지원빌딩)' },
    { label: '공고방법', value: '아시아경제신문 게재' },
  ];

  const historySteps = [
    {
      date: '2025년 08월',
      title: '법인 설립 (서울 목동)',
      desc: '부동산 매매·임대, 개발·공급, 관리 및 투자 자문 등 부동산 목적 11개로 출발',
      tag: '법인 창립',
    },
    {
      date: '2026년 05월',
      title: '대표이사 윤지원 취임',
      desc: '사내이사 겸 대표이사로 취임, 경영 총괄 체제 확립',
      tag: '경영진 보강',
    },
    {
      date: '2026년 09월',
      title: '대표이사 윤종성 취임 & 사업목적 15개 추가',
      desc: '각자대표 윤종성 취임. 경영컨설팅·M&A 자문, AI 데이터센터, NPL 자산유동화 등 사업목적 총 26개로 대폭 확장',
      tag: '영역 확장',
    },
    {
      date: '2026년 10월',
      title: '사업자등록 발급 및 본격 영업 개시',
      desc: '경영컨설팅·M&A 자문, AI 데이터센터 개발·운영, PM 및 자문 등 3대 핵심 종목으로 영업 개시',
      tag: '영업 개시',
    },
  ];

  return (
    <section id="about" className="relative py-24 bg-[#FAFBFD] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-amber-300 text-xs font-bold text-amber-800 tracking-wider font-serif uppercase mb-3 shadow-sm">
            About Hwacheon First
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            신뢰와 투명 경영의 <span className="text-gold-gradient">화천퍼스트</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
            풍부한 실무 경험과 네트워크를 겸비한 각자대표 체제를 바탕으로 책임 있는 자문과 개발을 실행합니다.
          </p>
        </div>

        {/* 2-Columns: Left (Overview Table) & Right (Timeline) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Corporate Info & Leadership */}
          <div className="lg:col-span-6 space-y-8">
            {/* Corporate Info Card */}
            <div className="card-gold-border rounded-2xl p-6 sm:p-8 bg-white shadow-md">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-200">
                <LogoHF size={36} showWordmark={false} />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">회사 개요 (Corporate Profile)</h3>
                  <p className="text-xs text-amber-700 font-serif font-bold">법인 등기 및 사업자 공시 정보</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                {corporateDetails.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="text-slate-500 font-medium sm:w-1/3">{item.label}</span>
                    <span className="text-slate-900 font-semibold sm:w-2/3 text-left sm:text-right break-keep">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership Overview */}
            <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-md">
              <div className="flex items-center gap-2 text-amber-800 mb-3 text-sm font-bold">
                <Users2 className="w-4 h-4 text-amber-600" />
                <span>경영진 구성 (각자대표 체제)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors">
                  <div className="text-xs text-amber-700 font-serif tracking-wider font-bold">CO-REPRESENTATIVE</div>
                  <div className="text-base font-bold text-slate-900 mt-1">윤지원 대표이사</div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    부동산 개발 및 자산 운용 전략 총괄, 안정적 법인 인프라 구축
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors">
                  <div className="text-xs text-amber-700 font-serif tracking-wider font-bold">CO-REPRESENTATIVE</div>
                  <div className="text-base font-bold text-slate-900 mt-1">윤종성 대표이사</div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    경영컨설팅·M&A 자문 및 AI 데이터센터 신사업 기획 총괄
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                ※ 각자대표이사 2인 외 사내이사 1인, 감사 1인으로 책임 있고 투명한 이사회 의사결정 체계를 가동하고 있습니다.
              </p>
            </div>
          </div>

          {/* Right Column: History Timeline */}
          <div className="lg:col-span-6">
            <div className="card-gold-border rounded-2xl p-6 sm:p-8 bg-white shadow-md">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-slate-900">주요 연혁 (History)</h3>
                </div>
                <span className="text-xs text-amber-800 font-serif font-bold">2025 ~ 2026</span>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-amber-400 before:via-amber-300 before:to-slate-200">
                {historySteps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-500 group-hover:scale-125 group-hover:bg-amber-500 transition-all shadow-sm" />

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-amber-800">{step.date}</span>
                      <span className="text-[10px] text-slate-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                        {step.tag}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {step.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1.5 leading-relaxed break-keep">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Legal Notice Note */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
                <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  주식회사 화천퍼스트의 모든 등기사항 및 사업자등록은 서울남부지방법원 등기국 및 양천세무서에 적법하게 등록·공시되어 있습니다.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
