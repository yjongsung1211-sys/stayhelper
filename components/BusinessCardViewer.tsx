'use client';

import React, { useState } from 'react';
import { RotateCw, Phone, Mail, MapPin, Building, Sparkles } from 'lucide-react';
import { LogoHF } from './LogoHF';

export const BusinessCardViewer: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      {/* Decorative soft executive glow behind card */}
      <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/20 via-sky-400/10 to-amber-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Flip Prompt Badge */}
      <div className="flex items-center justify-between mb-3 px-1 text-xs">
        <span className="flex items-center gap-1.5 font-bold text-amber-900 tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          공식 명함 샘플 (3D 인터랙티브)
        </span>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-amber-900 bg-white hover:bg-amber-50 border border-slate-300 px-2.5 py-1 rounded-full transition-all shadow-sm"
        >
          <RotateCw className="w-3 h-3 text-amber-600" />
          {isFlipped ? '앞면 보기' : '뒷면 보기'}
        </button>
      </div>

      {/* 3D Card Container */}
      <div
        className="w-full aspect-[1.75/1] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-700 transform-style-preserve-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT SIDE (Luxury Dark Navy & Gold Foil) */}
          <div className="absolute inset-0 backface-hidden rounded-xl bg-[#0B132B] border-2 border-[#D4AF37]/70 shadow-2xl p-4 md:p-6 flex flex-col justify-between overflow-hidden">
            {/* Fine Inner Gold Border (Double border matching card) */}
            <div className="absolute inset-2 md:inset-3 border border-[#D4AF37]/40 rounded-lg pointer-events-none" />
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

            {/* Subtle background radial texture */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/60 via-transparent to-black/80 pointer-events-none" />

            {/* Center Logo & Title */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2 text-center my-auto">
              <LogoHF size={48} showWordmark={false} />
              <div className="mt-1">
                <h3 className="text-xl md:text-2xl font-bold tracking-widest text-[#FFF2D0] drop-shadow-[0_1px_4px_rgba(212,175,55,0.5)]">
                  화천퍼스트
                </h3>
                <p className="text-[10px] md:text-xs font-serif tracking-[0.3em] text-[#D4AF37] mt-0.5 uppercase">
                  HWACHEON FIRST
                </p>
              </div>
            </div>

            {/* Bottom: Representative Name */}
            <div className="relative z-10 flex items-center justify-between text-xs pt-1 border-t border-amber-400/25">
              <div className="text-slate-200">
                <span className="font-semibold text-slate-100 text-sm">윤지원 · 윤종성</span>
                <span className="text-[11px] text-amber-300 ml-2">각자대표이사 · CEO</span>
              </div>
              <span className="text-[10px] text-slate-400 font-serif">EST. 2025</span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-[#0B132B] border-2 border-[#D4AF37]/70 shadow-2xl p-4 md:p-6 flex flex-col justify-between overflow-hidden">
            {/* Fine Inner Gold Border */}
            <div className="absolute inset-2 md:inset-3 border border-[#D4AF37]/40 rounded-lg pointer-events-none" />

            {/* Top Brand */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LogoHF size={28} showWordmark={false} />
                <span className="text-xs font-serif tracking-[0.25em] text-[#D4AF37] font-semibold">
                  HWACHEON FIRST
                </span>
              </div>
              <span className="text-[10px] text-slate-300">화천퍼스트 법인 공식</span>
            </div>

            {/* Contact details */}
            <div className="relative z-10 space-y-2 text-xs md:text-sm text-slate-200 my-auto pl-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono text-slate-200">02-0000-0000</span>
                <span className="text-slate-500">|</span>
                <span className="font-mono text-slate-200">010-0000-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono text-amber-300 font-bold">ceo@hwacheonfirst.com</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] md:text-xs text-slate-200 leading-tight">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p>서울특별시 양천구 목동중앙남로16나길 82, 3층</p>
                  <p className="text-slate-400 text-[10px]">(목동 646-6, 지원빌딩 3층)</p>
                </div>
              </div>
            </div>

            {/* Bottom Business Registry Tag */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-amber-400/25">
              <span>사업자등록번호: 891-87-03781</span>
              <span className="text-amber-300 font-medium">hwacheonfirst.com</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-500 mt-2 font-medium">
        💡 명함을 클릭하시면 앞면과 뒷면이 3D로 회전합니다.
      </p>
    </div>
  );
};
