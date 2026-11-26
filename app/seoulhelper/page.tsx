'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import curatedData from '@/data/seoulhelper_curated.json';

type Lang = 'en' | 'es' | 'kr';

interface District {
  id: string;
  nameEn: string;
  nameEs: string;
  nameKr: string;
  vibe: string;
  subway: string;
  dailyBudgetKrw: number;
  highlightsEn: string[];
  highlightsEs: string[];
  highlightsKr: string[];
  helperLink: string;
  helperLabelEn: string;
  helperLabelEs: string;
  helperLabelKr: string;
}

interface Essential {
  id: string;
  badge: string;
  titleEn: string;
  titleEs: string;
  titleKr: string;
  priceNote: string;
  descEn: string;
  descEs: string;
  descKr: string;
  provider: string;
  url: string;
}

const FX = curatedData.fxKrwPerUsd;
const DISTRICTS: District[] = curatedData.districts as District[];
const ESSENTIALS: Essential[] = curatedData.essentials as Essential[];

// District-specific Dancheong & Seoul heritage accent bars
const DISTRICT_ACCENTS: Record<string, { bar: string; chipBg: string; chipText: string }> = {
  seongsu: { bar: 'bg-[#B83B2A]', chipBg: 'bg-[#FDF1EE]', chipText: 'text-[#9A2F20]' },
  myeongdong: { bar: 'bg-[#C6923A]', chipBg: 'bg-[#FBF5E8]', chipText: 'text-[#8C631D]' },
  bukchon: { bar: 'bg-[#1F5C4E]', chipBg: 'bg-[#EBF5F2]', chipText: 'text-[#17483D]' },
  hongdae: { bar: 'bg-[#36557A]', chipBg: 'bg-[#EDF3F9]', chipText: 'text-[#243E5C]' },
  gangnam: { bar: 'bg-[#7A3B4E]', chipBg: 'bg-[#F8EEF1]', chipText: 'text-[#612C3C]' },
  hannam: { bar: 'bg-[#2E6B5E]', chipBg: 'bg-[#ECF6F3]', chipText: 'text-[#1E4F45]' },
};

function estimateKoreaVatRefund(krw: number): number {
  if (krw < 15000) return 0;
  if (krw < 30000) return 1000;
  if (krw < 50000) return 2000;
  if (krw < 75000) return 3500;
  if (krw < 100000) return 5000;
  if (krw < 200000) return Math.round((krw * 0.068) / 500) * 500;
  return Math.round((krw * 0.075) / 1000) * 1000;
}

export default function SeoulHelperPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [spendKrw, setSpendKrw] = useState<number>(150000);
  const [selectedIds, setSelectedIds] = useState<string[]>(['bukchon', 'seongsu', 'myeongdong']);

  const toggleDistrict = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const refundKrw = useMemo(() => estimateKoreaVatRefund(spendKrw), [spendKrw]);
  const netKrw = Math.max(0, spendKrw - refundKrw);
  const refundPct = spendKrw > 0 ? ((refundKrw / spendKrw) * 100).toFixed(1) : '0.0';

  const tripStats = useMemo(() => {
    const chosen = DISTRICTS.filter((d) => selectedIds.includes(d.id));
    const totalKrw = chosen.reduce((sum, d) => sum + d.dailyBudgetKrw, 0);
    return {
      days: chosen.length,
      totalKrw,
      totalUsd: Math.round(totalKrw / FX),
    };
  }, [selectedIds]);

  const copy = {
    en: {
      badge: '100% Free Forever · Royal Heritage Seoul Guide',
      h1: 'Plan Seoul Smarter. Calculate Instant Tax-Free Refunds.',
      sub: `From Gyeongbokgung Palace to Seongsu & Myeongdong—explore ${DISTRICTS.length} curated neighborhoods, calculate your exact Korea VAT refund, and book verified essentials.`,
      calcTitle: 'Korea Tax-Free (VAT) Instant Refund Calculator',
      calcSub: 'Minimum eligible purchase: ₩15,000 (~$11) with passport at Tax-Free shops.',
      inputLabel: 'Shopping Amount (KRW ₩)',
      refundLabel: 'Est. VAT Refund',
      netLabel: 'Final Net Cost',
      planTitle: `Seoul ${DISTRICTS.length}-District Interactive Budget Planner`,
      planSub: 'Tap neighborhoods to build your custom Seoul itinerary & daily spend estimate.',
      selectedLabel: 'Selected Itinerary',
      daysUnit: 'Days',
      essTitle: '4 Verified Seoul Travel Essentials',
      essSub: 'Direct official partner links for instant airport arrival & transit.',
      crossTitle: 'More 100% Free Tools by Helper Family',
    },
    es: {
      badge: '100% Gratis Siempre · Guía Real de Seúl',
      h1: 'Planifica Seúl Inteligente. Calcula tu Reembolso Tax-Free.',
      sub: `Desde el Palacio Gyeongbokgung hasta Seongsu y Myeongdong—explora ${DISTRICTS.length} barrios clave, calcula tu IVA y reserva tus esenciales.`,
      calcTitle: 'Calculadora Instantánea Tax-Free (IVA) en Corea',
      calcSub: 'Compra mínima elegible: ₩15,000 (~$11) mostrando tu pasaporte.',
      inputLabel: 'Monto de Compra (KRW ₩)',
      refundLabel: 'Reembolso Estimado',
      netLabel: 'Costo Neto Final',
      planTitle: `Planificador de Presupuesto (${DISTRICTS.length} Zonas de Seúl)`,
      planSub: 'Selecciona barrios para calcular tus días y presupuesto estimado en Seúl.',
      selectedLabel: 'Itinerario Seleccionado',
      daysUnit: 'Días',
      essTitle: '4 Esenciales Verificados para Viajar a Seúl',
      essSub: 'Enlaces directos de socios para llegar conectado y sin esperas.',
      crossTitle: 'Más Herramientas 100% Gratis de Helper Family',
    },
    kr: {
      badge: '100% 영구 무료 · 경복궁 모던 헤리티지 서울 가이드',
      h1: '서울 여행 예산 · 택스프리 환급액 1초 계산기',
      sub: `경복궁·북촌부터 성수·명동·강남까지 ${DISTRICTS.length}대 핵심 권역 동선과 실시간 부가세(VAT) 환급액을 한눈에 확인하세요.`,
      calcTitle: '한국 외국인 택스프리(VAT) 즉시 환급 계산기',
      calcSub: '면세 가맹점(올리브영·백화점 등) 15,000원 이상 구매 시 여권 제시 기준.',
      inputLabel: '결제 예정 금액 (원 KRW)',
      refundLabel: '예상 환급액',
      netLabel: '실제 체감 결제액',
      planTitle: `서울 핵심 ${DISTRICTS.length}대 권역 여행 예산 플래너`,
      planSub: '방문할 권역을 클릭하면 추천 일수 및 총 예상 경비가 실시간 합산됩니다.',
      selectedLabel: '선택한 일정',
      daysUnit: '일 코스',
      essTitle: '서울 여행 필수 예약 4선 (공식 파트너)',
      essSub: 'eSIM · 공항철도 AREX · 한복 대여 · 역세권 호텔 바로가기',
      crossTitle: 'Helper 패밀리 100% 무료 연동 도구',
    },
  }[lang];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1E242B] selection:bg-[#B83B2A] selection:text-[#FAF6EE]">
      {/* Dancheong 3-Band Royal Heritage Top Trim */}
      <div className="flex h-1.5 w-full">
        <div className="w-1/3 bg-[#1F5C4E]" />
        <div className="w-1/3 bg-[#C6923A]" />
        <div className="w-1/3 bg-[#B83B2A]" />
      </div>

      {/* Top Royal Hanji Header */}
      <header className="sticky top-0 z-30 border-b border-[#E5DAC6] bg-[#FAF6EE]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            {/* Korean Royal Seal Stamp (낙관) */}
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#B83B2A] bg-[#B83B2A] text-[11px] font-bold leading-none text-[#FAF6EE] shadow-sm">
              서울
            </div>
            <div>
              <span
                className="text-lg font-bold tracking-tight text-[#1E242B]"
                style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif" }}
              >
                SEOULHELPER
              </span>
              <span className="ml-2.5 hidden rounded-full border border-[#D8C9AE] bg-[#F3ECE0] px-2.5 py-0.5 text-[11px] font-medium text-[#5A4E3C] sm:inline-block">
                {copy.badge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {(['en', 'es', 'kr'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition ${
                  lang === l
                    ? 'bg-[#B83B2A] text-[#FAF6EE] shadow-sm'
                    : 'border border-[#D8C9AE] bg-[#FFFDF9] text-[#4E463C] hover:border-[#1F5C4E] hover:text-[#1F5C4E]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Gyeongbokgung Royal Palace Hero Section */}
      <section className="relative overflow-hidden border-b border-[#DFD2BC] bg-gradient-to-br from-[#1B3A34] via-[#1F4A41] to-[#273038] text-[#FAF6EE]">
        {/* Subtle Traditional Korean Lattice Pattern Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, #E2C38B 1px, transparent 1px), linear-gradient(to bottom, #E2C38B 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        {/* Gyeongbokgung Geunjeongjeon Roofline Silhouette SVG */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 220"
          className="pointer-events-none absolute bottom-0 right-0 h-44 w-auto opacity-20 md:h-56"
          fill="none"
        >
          <path
            d="M120 220 L120 155 L260 155 L260 110 L170 110 C260 95 340 72 410 42 L790 42 C860 72 940 95 1030 110 L940 110 L940 155 L1080 155 L1080 220 Z"
            fill="#E2C38B"
          />
          <path
            d="M340 42 C430 28 510 14 600 4 C690 14 770 28 860 42 Z"
            fill="#C6923A"
          />
          <rect x="295" y="120" width="22" height="100" fill="#B83B2A" />
          <rect x="440" y="120" width="22" height="100" fill="#B83B2A" />
          <rect x="589" y="120" width="22" height="100" fill="#B83B2A" />
          <rect x="738" y="120" width="22" height="100" fill="#B83B2A" />
          <rect x="883" y="120" width="22" height="100" fill="#B83B2A" />
        </svg>

        <div className="relative mx-auto max-w-6xl px-5 py-12 md:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6923A]/50 bg-[#142B26]/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E9CA8B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E05A47]" />
            GYEONGBOKGUNG EDITION &middot; LIVE FX ₩{FX.toLocaleString()} / $1
          </div>
          <h1
            className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-[#FFFBF2] md:text-5xl"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif" }}
          >
            {copy.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#E3DAC9] md:text-base">
            {copy.sub}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-14 px-5 py-10">
        {/* 1. Tax-Free Calculator (Dancheong Jade + Brass + Hanji) */}
        <section className="overflow-hidden rounded-2xl border border-[#DFD2BC] bg-[#FFFDF9] shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-[#1F5C4E] via-[#C6923A] to-[#B83B2A]" />
          <div className="p-6 md:p-8">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#B83B2A]">
                  TAX-FREE REFUND CALCULATOR
                </span>
                <h2
                  className="mt-1 text-xl font-bold tracking-tight text-[#1E242B] md:text-2xl"
                  style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif" }}
                >
                  {copy.calcTitle}
                </h2>
                <p className="mt-1 text-xs text-[#6B6256]">{copy.calcSub}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[50000, 150000, 300000, 500000, 1000000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setSpendKrw(preset)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      spendKrw === preset
                        ? 'bg-[#B83B2A] text-[#FAF6EE]'
                        : 'border border-[#DDD0B8] bg-[#F6EFE2] text-[#4E4539] hover:border-[#B83B2A]'
                    }`}
                  >
                    ₩{(preset / 1000).toLocaleString()}k
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-xl border border-[#E5DAC6] bg-[#FAF6EE] p-4">
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#6B6256]">
                  {copy.inputLabel}
                </label>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={spendKrw}
                  onChange={(e) => setSpendKrw(Math.max(0, Number(e.target.value) || 0))}
                  className="mt-2 w-full rounded-lg border border-[#D4C4A8] bg-white px-3 py-2 text-lg font-bold text-[#1E242B] outline-none focus:border-[#1F5C4E]"
                />
                <p className="mt-1.5 text-xs font-medium text-[#6B6256]">
                  ≈ ${(spendKrw / FX).toFixed(2)} USD
                </p>
              </div>

              {/* Dancheong Jade Highlight Card */}
              <div className="rounded-xl border border-[#194A3F] bg-gradient-to-br from-[#1F5C4E] to-[#17443A] p-4 text-[#FAF6EE] shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#BCE3D8]">
                  {copy.refundLabel}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#FFFDF7]">
                  ₩{refundKrw.toLocaleString()}
                </p>
                <p className="mt-1 text-xs font-medium text-[#E9CA8B]">
                  ≈ ${(refundKrw / FX).toFixed(2)} USD ({refundPct}% back)
                </p>
              </div>

              <div className="rounded-xl border border-[#E5DAC6] bg-[#FAF6EE] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6256]">
                  {copy.netLabel}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#1E242B]">
                  ₩{netKrw.toLocaleString()}
                </p>
                <p className="mt-1 text-xs font-medium text-[#B83B2A]">
                  ≈ ${(netKrw / FX).toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 6-District Royal Heritage Planner */}
        <section>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F5C4E]">
                CURATED SEOUL DISTRICTS
              </span>
              <h2
                className="mt-1 text-xl font-bold tracking-tight text-[#1E242B] md:text-2xl"
                style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif" }}
              >
                {copy.planTitle}
              </h2>
              <p className="mt-1 text-xs text-[#6B6256]">{copy.planSub}</p>
            </div>

            {/* Royal Vermilion Summary Pill */}
            <div className="rounded-xl border border-[#962D1F] bg-gradient-to-r from-[#B83B2A] to-[#9A2F20] px-5 py-3 text-[#FAF6EE] shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#F7D7C4]">
                {copy.selectedLabel}: {tripStats.days} {copy.daysUnit}
              </p>
              <p className="text-lg font-bold">
                ₩{tripStats.totalKrw.toLocaleString()}{' '}
                <span className="text-sm font-normal text-[#FBE9DF]">
                  (≈ ${tripStats.totalUsd.toLocaleString()} USD)
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DISTRICTS.map((d) => {
              const active = selectedIds.includes(d.id);
              const accent = DISTRICT_ACCENTS[d.id] || DISTRICT_ACCENTS.bukchon;
              const name = lang === 'kr' ? d.nameKr : lang === 'es' ? d.nameEs : d.nameEn;
              const highlights =
                lang === 'kr' ? d.highlightsKr : lang === 'es' ? d.highlightsEs : d.highlightsEn;
              const helperLabel =
                lang === 'kr' ? d.helperLabelKr : lang === 'es' ? d.helperLabelEs : d.helperLabelEn;

              return (
                <div
                  key={d.id}
                  onClick={() => toggleDistrict(d.id)}
                  className={`cursor-pointer overflow-hidden rounded-2xl border transition ${
                    active
                      ? 'border-[#B83B2A] bg-[#FFFDF9] shadow-md'
                      : 'border-[#E5DAC6] bg-[#FFFDF9] hover:border-[#C6923A]'
                  }`}
                >
                  <div className={`h-1.5 w-full ${accent.bar}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-[#1E242B]">{name}</h3>
                        <p className="mt-0.5 text-xs text-[#6B6256]">{d.vibe}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          active
                            ? 'bg-[#B83B2A] text-[#FAF6EE]'
                            : `${accent.chipBg} ${accent.chipText}`
                        }`}
                      >
                        {active ? '✓ Added' : '+ Add'}
                      </span>
                    </div>

                    <p className="mt-3 text-xs font-medium text-[#1F5C4E]">🚇 {d.subway}</p>

                    <ul className="mt-3 space-y-1.5 text-xs text-[#4A443C]">
                      {highlights.map((h) => (
                        <li key={h}>• {h}</li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-center justify-between border-t border-[#ECE2D0] pt-3">
                      <span className="text-xs font-bold text-[#1E242B]">
                        ₩{d.dailyBudgetKrw.toLocaleString()} / day (${Math.round(d.dailyBudgetKrw / FX)})
                      </span>
                      <Link
                        href={d.helperLink}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-[#B83B2A] underline underline-offset-4 hover:text-[#1F5C4E]"
                      >
                        {helperLabel} &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. High-Commission Travel Essentials */}
        <section>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C6923A]">
            OFFICIAL TRAVEL PARTNERS
          </span>
          <h2
            className="mt-1 text-xl font-bold tracking-tight text-[#1E242B] md:text-2xl"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif" }}
          >
            {copy.essTitle}
          </h2>
          <p className="mt-1 text-xs text-[#6B6256]">{copy.essSub}</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ESSENTIALS.map((item) => {
              const title = lang === 'kr' ? item.titleKr : lang === 'es' ? item.titleEs : item.titleEn;
              const desc = lang === 'kr' ? item.descKr : lang === 'es' ? item.descEs : item.descEn;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-2xl border border-[#E5DAC6] bg-[#FFFDF9] p-5 transition hover:border-[#1F5C4E] hover:shadow-md"
                >
                  <div>
                    <span className="inline-block rounded-full border border-[#D9C7A3] bg-[#FBF5E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#8C631D]">
                      {item.badge}
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-[#1E242B]">{title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#5D554B]">{desc}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#EFE6D6] pt-3 text-xs">
                    <span className="font-semibold text-[#1E242B]">{item.priceNote}</span>
                    <span className="font-bold text-[#1F5C4E] group-hover:text-[#B83B2A] group-hover:underline">
                      {item.provider} &rarr;
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* 4. Helper Family Cross-Promo Hub (Warm Palace Courtyard Panel) */}
        <section className="rounded-2xl border border-[#DFD2BC] bg-[#F3ECE0] p-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#5A4E3C]">
            {copy.crossTitle}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'BeautyHelper', desc: '50 K-Beauty Shades & Lowest US Prices', href: '/beautyhelper', dot: 'bg-[#B83B2A]' },
              { name: 'LoopShadow', desc: '30 Free Seoul Korean Shadowing Phrases', href: '/loopshadow', dot: 'bg-[#1F5C4E]' },
              { name: 'ColorHelper', desc: 'Free 12-Season Virtual Color Draping', href: '/', dot: 'bg-[#C6923A]' },
              { name: 'StayHelper', desc: '5-Star Luxury Hotels & VIP Credits', href: 'https://thestayhelper.com', dot: 'bg-[#36557A]' },
            ].map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className="rounded-xl border border-[#E2D6C0] bg-[#FFFDF9] p-4 transition hover:border-[#B83B2A] hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <p className="text-sm font-bold text-[#1E242B]">{s.name} &rarr;</p>
                </div>
                <p className="mt-1 text-xs text-[#6B6256]">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
