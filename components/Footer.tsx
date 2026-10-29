'use client';

import React from 'react';
import { LogoHF } from './LogoHF';
import { ArrowUp } from 'lucide-react';
import { TabKey } from '@/types/navigation';

interface FooterProps {
  onNavigate?: (tab: TabKey) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (tab: TabKey) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      window.location.hash = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#070D1E] text-slate-400 border-t border-slate-800 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer: Brand & Fast Nav */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          <div className="md:col-span-7 space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="brightness-125 text-left cursor-pointer focus:outline-none"
              aria-label="홈으로 이동"
            >
              <LogoHF size={38} />
            </button>
            <p className="text-xs text-slate-300 max-w-lg font-normal leading-relaxed break-keep">
              주식회사 화천퍼스트는 중소·중견기업 경영컨설팅 및 기업인수합병(M&A) 자문, 전력 인프라 연계형 AI 데이터센터 개발·PM, 부동산 PF 재구조화 투자를 선도하는 종합 전문 법인입니다.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col sm:flex-row gap-8 justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-100 tracking-wider uppercase">
                주요 사업 영역
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => handleNav('business')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    경영컨설팅 & M&A 자문
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('business')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    인공지능(AI) 데이터센터 개발·PM
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('business')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    부동산 개발 & PF 재구조화
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-100 tracking-wider uppercase">
                비즈니스 솔루션
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => handleNav('strengths')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    화천퍼스트 핵심 경쟁력
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('simulator')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    프로젝트 진단 시뮬레이터
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('roadmap')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    단계별 성장 로드맵
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Information */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-400">
          <div className="space-y-1.5 leading-relaxed">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-200 font-medium">
              <span>상호: 주식회사 화천퍼스트 (Hwacheon First Co., Ltd.)</span>
              <span className="text-slate-700">|</span>
              <span>각자대표이사: 윤지원 · 윤종성</span>
              <span className="text-slate-700">|</span>
              <span>개업일: 2026년 10월 1일</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400">
              <span>사업자등록번호: 891-87-03781</span>
              <span className="text-slate-700">|</span>
              <span>법인등록번호: 110111-0934914</span>
              <span className="text-slate-700">|</span>
              <span>공식 이메일: ceo@hwacheonfirst.com</span>
            </div>
            <div className="text-slate-400">
              <span>본점 소재지: 서울특별시 양천구 목동중앙남로16나길 82, 3층 (목동, 지원빌딩)</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Copyright © 2026 주식회사 화천퍼스트 (Hwacheon First Co., Ltd.) All rights reserved.
            </div>
          </div>

          {/* Top Button */}
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md group shrink-0 cursor-pointer"
            aria-label="맨 위로 이동"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
