'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import curatedData from '@/data/seoulhelper_curated.json';

type Lang = 'en' | 'es' | 'kr';

interface District {
  id: string;
  image: string;
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

interface ForaHotel {
  id: string;
  image: string;
  rank: string;
  program: string;
  areaEn: string;
  areaEs: string;
  areaKr: string;
  nameEn: string;
  nameEs: string;
  nameKr: string;
  perksEn: string[];
  perksEs: string[];
  perksKr: string[];
  url: string;
}

const FX = curatedData.fxKrwPerUsd;
const DISTRICTS: District[] = curatedData.districts as District[];
const ESSENTIALS: Essential[] = curatedData.essentials as Essential[];
const FORA_HOTELS: ForaHotel[] = curatedData.foraHotels as ForaHotel[];
const FORA_VIP_INTAKE_URL = 'https://secure.foratravel.com/intake/VXwROA88te';

function getDefaultDates() {
  const d1 = new Date();
  d1.setDate(d1.getDate() + 14);
  const d2 = new Date(d1);
  d2.setDate(d2.getDate() + 3);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { checkin: fmt(d1), checkout: fmt(d2) };
}

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
  const [activeHotel, setActiveHotel] = useState<ForaHotel | null>(null);
  const defaultDates = useMemo(() => getDefaultDates(), []);
  const [checkIn, setCheckIn] = useState<string>(defaultDates.checkin);
  const [checkOut, setCheckOut] = useState<string>(defaultDates.checkout);
  const [guests, setGuests] = useState<number>(2);

  const nights = useMemo(() => {
    const t1 = Date.parse(checkIn);
    const t2 = Date.parse(checkOut);
    if (isNaN(t1) || isNaN(t2) || t2 <= t1) return 1;
    return Math.round((t2 - t1) / 86400000);
  }, [checkIn, checkOut]);

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
      foraKicker: 'FORA PREFERRED PARTNER × STAYHELPER VIP',
      foraTitle: '5 Seoul 5-Star Hotels with Free Fora VIP Perks',
      foraSub: 'Pay the exact same public flexible rate—and unlock complimentary daily breakfast for 2, $100 hotel credit, room upgrades & Stay 3 Pay 2 promos via our Fora Advisor desk.',
      foraCta: 'Search Live Rates & VIP',
      modalCheckIn: 'Check-in',
      modalCheckOut: 'Check-out',
      modalGuests: 'Guests',
      modalSearchBtn: 'Search Live Room Rates Now',
      modalForaBtn: 'Request Free Fora VIP Booking ($100 Credit + Breakfast)',
      modalTrust: '$0 Advisor Fee · Pay Hotel Directly · Earn 100% Marriott/Hyatt Points',
      modalNote: 'Opens live date-matched rates for this exact hotel, or lock free Fora Advisor VIP perks directly.',
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
      foraKicker: 'FORA PREFERRED PARTNER × STAYHELPER VIP',
      foraTitle: '5 Hoteles 5 Estrellas en Seúl con Beneficios VIP Fora',
      foraSub: 'Misma tarifa oficial flexible, pero con desayuno diario para 2, $100 de crédito, upgrade de habitación y promos 3ª noche gratis vía StayHelper.',
      foraCta: 'Buscar Tarifas y VIP',
      modalCheckIn: 'Entrada',
      modalCheckOut: 'Salida',
      modalGuests: 'Huéspedes',
      modalSearchBtn: 'Buscar Tarifas en Vivo Ahora',
      modalForaBtn: 'Solicitar Reserva VIP Fora Gratis ($100 + Desayuno)',
      modalTrust: '$0 Comisión · Pago Directo al Hotel · 100% Puntos Marriott/Hyatt',
      modalNote: 'Abre tarifas en vivo para tus fechas exactas o solicita beneficios VIP Fora gratis.',
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
      essSub: 'eSIM · 공항철도 AREX · 한복 대여 · Fora VIP 호텔 바로가기',
      foraKicker: 'FORA PREFERRED PARTNER × STAYHELPER VIP',
      foraTitle: 'Fora 연계 서울 5대 특급호텔 무료 VIP 특전',
      foraSub: '호텔 공식 공시가 그대로 예약하면서 2인 무료 조식 + $100 크레딧 + 객실 업그레이드 + 3박 2요금 프로모션까지 StayHelper × Fora 어드바이저로 무료 적용받으세요.',
      foraCta: '실시간 요금 검색 · VIP',
      modalCheckIn: '체크인',
      modalCheckOut: '체크아웃',
      modalGuests: '인원',
      modalSearchBtn: '실시간 객실·최저가 바로 검색',
      modalForaBtn: 'Fora VIP 무료 특전 예약 신청 (조식 + $100 크레딧)',
      modalTrust: '수수료 0원 · 호텔 현장 직접 결제 · 메리어트/하얏트 포인트 100% 적립',
      modalNote: '선택한 날짜로 해당 호텔 실시간 객실 요금을 바로 검색하거나, Fora 어드바이저 무료 VIP 특전을 신청할 수 있습니다.',
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

      {/* Gyeongbokgung Royal Palace Editorial Photo Hero */}
      <section className="relative overflow-hidden border-b border-[#DFD2BC] bg-[#1B3A34] text-[#FAF6EE]">
        <img
          src="/images/seoulhelper/hero_gyeongbokgung.jpg"
          alt="Gyeongbokgung Palace Geunjeongjeon in Seoul at Golden Hour"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#162D28]/90 via-[#1B3A34]/75 to-[#1E242B]/55" />

        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E9CA8B]/60 bg-[#142B26]/80 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F2D99B] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E05A47]" />
            GYEONGBOKGUNG EDITION &middot; LIVE FX ₩{FX.toLocaleString()} / $1
          </div>
          <h1
            className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-[#FFFBF2] drop-shadow-sm md:text-5xl"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif" }}
          >
            {copy.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#F1E8D8] md:text-base">
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
                  className={`group cursor-pointer overflow-hidden rounded-2xl border transition ${
                    active
                      ? 'border-[#B83B2A] bg-[#FFFDF9] shadow-md'
                      : 'border-[#E5DAC6] bg-[#FFFDF9] hover:border-[#C6923A] hover:shadow-md'
                  }`}
                >
                  <div className={`h-1.5 w-full ${accent.bar}`} />
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE2D3]">
                    <img
                      src={d.image}
                      alt={name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E242B]/70 via-transparent to-transparent" />
                    <span
                      className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold shadow-sm ${
                        active
                          ? 'bg-[#B83B2A] text-[#FAF6EE]'
                          : 'bg-[#FAF6EE]/95 text-[#1E242B]'
                      }`}
                    >
                      {active ? '✓ Added' : '+ Add'}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base font-bold drop-shadow-sm">{name}</h3>
                      <p className="text-[11px] text-[#F1E8D8]">{d.vibe}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium text-[#1F5C4E]">🚇 {d.subway}</p>

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

        {/* 3.5. 5 Fora-Partnered Seoul Luxury Hotels Showcase (StayHelper × Fora) */}
        <section
          id="fora-seoul-hotels"
          className="overflow-hidden rounded-2xl border border-[#D4C29E] bg-gradient-to-br from-[#1B3A34] via-[#1E3F39] to-[#232A32] text-[#FAF6EE] shadow-md"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-[#C6923A] via-[#B83B2A] to-[#1F5C4E]" />
          <div className="p-6 md:p-8">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#C6923A]/50 bg-[#142A25]/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#E9CA8B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E05A47]" />
                  {copy.foraKicker}
                </span>
                <h2
                  className="mt-3 text-2xl font-bold tracking-tight text-[#FFFBF2] md:text-3xl"
                  style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif" }}
                >
                  {copy.foraTitle}
                </h2>
                <p className="mt-2 max-w-3xl text-xs leading-relaxed text-[#DFD6C5] md:text-sm">
                  {copy.foraSub}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveHotel(FORA_HOTELS[0])}
                className="shrink-0 rounded-full bg-[#B83B2A] px-5 py-2.5 text-xs font-bold text-[#FFFDF9] shadow-sm transition hover:bg-[#C6923A] hover:text-[#1E242B]"
              >
                🔍 {copy.foraCta} &rarr;
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {FORA_HOTELS.map((h) => {
                const name = lang === 'kr' ? h.nameKr : lang === 'es' ? h.nameEs : h.nameEn;
                const area = lang === 'kr' ? h.areaKr : lang === 'es' ? h.areaEs : h.areaEn;
                const perks = lang === 'kr' ? h.perksKr : lang === 'es' ? h.perksEs : h.perksEn;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActiveHotel(h)}
                    className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#C6923A]/40 bg-[#FAF6EE] text-left text-[#1E242B] transition hover:-translate-y-1 hover:border-[#E9CA8B] hover:bg-white hover:shadow-xl"
                  >
                    <div className="w-full">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#232A32]">
                        <img
                          src={h.image}
                          alt={name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14221F]/70 via-transparent to-transparent" />
                        <span className="absolute left-2.5 top-2.5 rounded bg-[#B83B2A] px-2 py-0.5 text-[10px] font-bold text-[#FAF6EE] shadow-sm">
                          #{h.rank}
                        </span>
                        <span className="absolute bottom-2 left-2.5 right-2.5 truncate text-[10px] font-bold uppercase tracking-wide text-[#F2D99B]">
                          {h.program}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold leading-snug text-[#1E242B]">
                          {name}
                        </h3>
                        <p className="mt-1 text-[11px] font-medium text-[#7A6B55]">{area}</p>
                        <ul className="mt-3 space-y-1 text-[11px] text-[#3F3A34]">
                          {perks.map((pk) => (
                            <li key={pk} className="flex items-start gap-1.5">
                              <span className="mt-0.5 text-[#1F5C4E]">✓</span>
                              <span>{pk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="w-full border-t border-[#E5DAC6] px-4 py-2.5 text-xs font-bold text-[#B83B2A] group-hover:text-[#1F5C4E]">
                      🔍 {copy.foraCta} &rarr;
                    </div>
                  </button>
                );
              })}
            </div>
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

      {/* Direct Hotel Live Rate Search & Fora VIP Modal */}
      {activeHotel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#14221F]/75 p-4 backdrop-blur-sm"
          onClick={() => setActiveHotel(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#C6923A]/60 bg-[#FAF6EE] text-[#1E242B] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 w-full overflow-hidden bg-[#1E242B]">
              <img
                src={activeHotel.image}
                alt={activeHotel.nameEn}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14221F]/90 via-[#14221F]/35 to-transparent" />
              <button
                type="button"
                onClick={() => setActiveHotel(null)}
                aria-label="Close modal"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1E242B]/80 text-sm font-bold text-white hover:bg-[#B83B2A]"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="inline-block rounded bg-[#B83B2A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FAF6EE]">
                  {activeHotel.program}
                </span>
                <h3
                  className="mt-1 text-xl font-bold leading-tight text-[#FFFBF2]"
                  style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif" }}
                >
                  {lang === 'kr'
                    ? activeHotel.nameKr
                    : lang === 'es'
                    ? activeHotel.nameEs
                    : activeHotel.nameEn}
                </h3>
                <p className="text-xs text-[#E3DAC9]">
                  {lang === 'kr'
                    ? activeHotel.areaKr
                    : lang === 'es'
                    ? activeHotel.areaEs
                    : activeHotel.areaEn}
                </p>
              </div>
            </div>

            <div className="p-5">
              {/* Hotel Quick Switcher */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {FORA_HOTELS.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActiveHotel(h)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                      activeHotel.id === h.id
                        ? 'bg-[#1F5C4E] text-[#FAF6EE]'
                        : 'border border-[#D8C9AE] bg-white text-[#4E463C] hover:border-[#1F5C4E]'
                    }`}
                  >
                    #{h.rank} {lang === 'kr' ? h.nameKr.split(' ')[0] : h.nameEn.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Date & Guest Live Search Inputs */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-xl border border-[#DFD2BC] bg-white p-2.5">
                  <label className="block text-[10px] font-bold uppercase text-[#6B6256]">
                    {copy.modalCheckIn}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-1 w-full bg-transparent text-xs font-bold text-[#1E242B] outline-none"
                  />
                </div>
                <div className="rounded-xl border border-[#DFD2BC] bg-white p-2.5">
                  <label className="block text-[10px] font-bold uppercase text-[#6B6256]">
                    {copy.modalCheckOut}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1 w-full bg-transparent text-xs font-bold text-[#1E242B] outline-none"
                  />
                </div>
                <div className="rounded-xl border border-[#DFD2BC] bg-white p-2.5">
                  <label className="block text-[10px] font-bold uppercase text-[#6B6256]">
                    {copy.modalGuests} ({nights}N)
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-1 w-full bg-transparent text-xs font-bold text-[#1E242B] outline-none"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} {lang === 'kr' ? '명' : 'Adults'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Included Free Perks */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {(lang === 'kr'
                  ? activeHotel.perksKr
                  : lang === 'es'
                  ? activeHotel.perksEs
                  : activeHotel.perksEn
                ).map((pk) => (
                  <span
                    key={pk}
                    className="rounded-full border border-[#CBE0D9] bg-[#EBF5F2] px-2.5 py-0.5 text-[11px] font-semibold text-[#17483D]"
                  >
                    ✓ {pk}
                  </span>
                ))}
              </div>

              {/* Zero-Risk Trust Bar */}
              <div className="mt-4 rounded-xl border border-[#DFD2BC] bg-[#F3ECE0] px-3 py-2 text-center text-[11px] font-bold text-[#1F5C4E]">
                🛡️ {copy.modalTrust}
              </div>

              {/* Direct Search + Fora VIP Buttons */}
              <div className="mt-5 space-y-2.5">
                <a
                  href={`https://www.google.com/travel/hotels?q=${encodeURIComponent(
                    `${activeHotel.nameEn} Seoul`
                  )}&checkin=${encodeURIComponent(checkIn)}&checkout=${encodeURIComponent(
                    checkOut
                  )}&adults=${guests}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-xl bg-[#B83B2A] px-4 py-3 text-sm font-bold text-[#FFFDF9] shadow-sm transition hover:bg-[#9A2F20]"
                >
                  🔍 {copy.modalSearchBtn} ({nights}N) &rarr;
                </a>
                <a
                  href={FORA_VIP_INTAKE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-xl border border-[#1F5C4E] bg-[#1F5C4E] px-4 py-2.5 text-xs font-bold text-[#FAF6EE] transition hover:bg-[#17443A]"
                >
                  👑 {copy.modalForaBtn} &rarr;
                </a>
              </div>

              <p className="mt-3 text-center text-[11px] text-[#6B6256]">{copy.modalNote}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
