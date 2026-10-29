'use client';

import React from 'react';
import { Mail, Phone, MapPin, Building, ExternalLink, Clock, ShieldCheck, Navigation, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="location" className="relative py-24 bg-[#FAFBFD] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-amber-300 text-xs font-bold text-amber-800 tracking-wider font-serif uppercase mb-3 shadow-sm">
            Location & Contact
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            화천퍼스트 <span className="text-gold-gradient">본점 안내</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal break-keep max-w-2xl mx-auto leading-relaxed">
            서울특별시 양천구 목동 지원빌딩에 위치하고 있으며, 유선 전화 및 이메일을 통해 신속하게 상담을 도와드립니다.
          </p>
        </div>

        {/* Centered Luxury Corporate Location Card */}
        <div className="max-w-4xl mx-auto">
          <div className="card-gold-border rounded-3xl p-8 sm:p-12 bg-white shadow-xl space-y-10">
            {/* Top Building & Address Highlight Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0 mt-1 shadow-sm">
                  <Building className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-serif tracking-widest text-amber-700 font-bold uppercase">
                      HWACHEON FIRST HEADQUARTERS
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      본점 소재지
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    목동 지원빌딩 3층
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">
                    서울특별시 양천구 목동중앙남로16나길 82 (목동 646-6)
                  </p>
                </div>
              </div>

              {/* Fast Map External Link Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="https://map.naver.com/v5/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EC%96%91%EC%83%81%EA%B5%AC%20%EB%AA%A9%EB%8F%99%EC%A4%91%EC%95%99%EB%82%A8%EB%A1%9C16%EB%82%98%EA%B8%B8%2082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-sm transition-all"
                >
                  <span>네이버 지도</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="https://map.kakao.com/link/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EC%96%91%EC%83%81%EA%B5%AC%20%EB%AA%A9%EB%8F%99%EC%A4%91%EC%95%99%EB%82%A8%EB%A1%9C16%EB%82%98%EA%B8%B8%2082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-sm transition-all"
                >
                  <span>카카오맵</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Stylized Visual Location & Transport Guide */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-slate-50 border border-amber-200/80 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-4">
                <Navigation className="w-4 h-4 text-amber-600" />
                <span>교통 및 위치 상세 안내</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-sm">
                  <span className="text-[11px] font-bold text-amber-700 font-serif">SUBWAY</span>
                  <div className="font-bold text-slate-900">지하철 9호선 이용 시</div>
                  <p className="text-slate-600 text-xs">
                    등촌역 또는 염창역 인근 목3동 주거·업무지구 지원빌딩 3층
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-sm">
                  <span className="text-[11px] font-bold text-amber-700 font-serif">PARKING & VISIT</span>
                  <div className="font-bold text-slate-900">자가용 및 내방 안내</div>
                  <p className="text-slate-600 text-xs">
                    내비게이션에 [목동중앙남로16나길 82] 또는 [목동 646-6] 검색
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Details Grid (Phone, Email, Hours, Official Registration) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-amber-400 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>대표 연락처</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                  02-0000-0000 / 010-0000-0000
                </div>
                <p className="text-[11px] text-slate-500">전화 연결 및 대면 상담 사전 조율</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-amber-400 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>공식 이메일</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-amber-800 font-mono">
                  ceo@hwacheonfirst.com
                </div>
                <p className="text-[11px] text-slate-500">24시간 상시 접수 및 서면 검토</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-amber-400 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>업무 시간</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900">
                  평일 09:00 ~ 18:00
                </div>
                <p className="text-[11px] text-slate-500">토·일요일 및 법정 공휴일 휴무</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-amber-400 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>공식 인허가 등록 정보</span>
                </div>
                <div className="text-xs text-slate-800 font-medium space-y-0.5">
                  <div>사업자등록번호: 891-87-03781 (양천세무서)</div>
                  <div>법인등록번호: 110111-0934914 (서울남부지법)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
