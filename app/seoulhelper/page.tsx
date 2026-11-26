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

// Standard Korea tourist VAT refund tiers (simplified accurate bracket table, min ₩15,000)
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
  const [selectedIds, setSelectedIds] = useState<string[]>(['seongsu', 'myeongdong', 'bukchon']);

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
      badge: '100% Free Forever · No Login · Seoul Travel Utility',
      h1: 'Plan Seoul Smarter. Calculate Instant Tax-Free Refunds.',
      sub: `Explore ${DISTRICTS.length} curated Seoul neighborhoods, estimate your exact Korea VAT refund at Olive Young & boutiques, and book verified essentials in seconds.`,
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
      badge: '100% Gratis Siempre · Sin Registro · Utilidad Viaje Seúl',
      h1: 'Planifica Seúl Inteligente. Calcula tu Reembolso Tax-Free.',
      sub: `Explora ${DISTRICTS.length} barrios clave de Seúl, calcula tu devolución de IVA en Olive Young y reserva tus esenciales en segundos.`,
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
      badge: '100% 영구 무료 · 회원가입 없음 · 서울 여행 통합 계산기',
      h1: '서울 여행 예산 · 택스프리 환급액 1초 계산기',
      sub: `성수·명동·홍대·강남·북촌·한남 ${DISTRICTS.length}대 핵심 권역 동선과 실시간 부가세(VAT) 환급액을 한눈에 확인하세요.`,
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
    <div className="min-h-screen bg-white text-neutral-950 selection:bg-neutral-900 selection:text-white">
      {/* Top Minimal Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">SEOULHELPER</span>
            <span className="hidden rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 sm:inline-block">
              {copy.badge}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {(['en', 'es', 'kr'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition ${
                  lang === l
                    ? 'bg-neutral-950 text-white'
                    : 'border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-neutral-100 bg-neutral-50/70">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            SEOUL TRAVEL UTILITY &middot; LIVE FX ₩{FX.toLocaleString()} / $1
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-neutral-950 md:text-5xl">
            {copy.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            {copy.sub}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-14 px-5 py-10">
        {/* 1. Tax-Free Calculator */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-950">{copy.calcTitle}</h2>
              <p className="mt-1 text-xs text-neutral-500">{copy.calcSub}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[50000, 150000, 300000, 500000, 1000000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSpendKrw(preset)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    spendKrw === preset
                      ? 'bg-neutral-950 text-white'
                      : 'border border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-900'
                  }`}
                >
                  ₩{(preset / 1000).toLocaleString()}k
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {copy.inputLabel}
              </label>
              <input
                type="number"
                min={0}
                step={10000}
                value={spendKrw}
                onChange={(e) => setSpendKrw(Math.max(0, Number(e.target.value) || 0))}
                className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-lg font-bold text-neutral-950 outline-none focus:border-neutral-950"
              />
              <p className="mt-1.5 text-xs text-neutral-500">
                ≈ ${(spendKrw / FX).toFixed(2)} USD
              </p>
            </div>

            <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {copy.refundLabel}
              </p>
              <p className="mt-2 text-2xl font-bold">₩{refundKrw.toLocaleString()}</p>
              <p className="mt-1 text-xs text-neutral-300">
                ≈ ${(refundKrw / FX).toFixed(2)} USD ({refundPct}% back)
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {copy.netLabel}
              </p>
              <p className="mt-2 text-2xl font-bold text-neutral-950">₩{netKrw.toLocaleString()}</p>
              <p className="mt-1 text-xs text-neutral-600">
                ≈ ${(netKrw / FX).toFixed(2)} USD
              </p>
            </div>
          </div>
        </section>

        {/* 2. 6-District Planner */}
        <section>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-950">{copy.planTitle}</h2>
              <p className="mt-1 text-xs text-neutral-500">{copy.planSub}</p>
            </div>
            <div className="rounded-xl border border-neutral-900 bg-neutral-950 px-5 py-3 text-white">
              <p className="text-[11px] uppercase tracking-wider text-neutral-400">
                {copy.selectedLabel}: {tripStats.days} {copy.daysUnit}
              </p>
              <p className="text-lg font-bold">
                ₩{tripStats.totalKrw.toLocaleString()}{' '}
                <span className="text-sm font-normal text-neutral-300">
                  (≈ ${tripStats.totalUsd.toLocaleString()} USD)
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DISTRICTS.map((d) => {
              const active = selectedIds.includes(d.id);
              const name = lang === 'kr' ? d.nameKr : lang === 'es' ? d.nameEs : d.nameEn;
              const highlights =
                lang === 'kr' ? d.highlightsKr : lang === 'es' ? d.highlightsEs : d.highlightsEn;
              const helperLabel =
                lang === 'kr' ? d.helperLabelKr : lang === 'es' ? d.helperLabelEs : d.helperLabelEn;

              return (
                <div
                  key={d.id}
                  onClick={() => toggleDistrict(d.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition ${
                    active
                      ? 'border-neutral-950 bg-neutral-50 shadow-sm'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-neutral-950">{name}</h3>
                      <p className="mt-0.5 text-xs text-neutral-500">{d.vibe}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        active ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {active ? '✓ Added' : '+ Add'}
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-medium text-neutral-700">🚇 {d.subway}</p>

                  <ul className="mt-3 space-y-1.5 text-xs text-neutral-600">
                    {highlights.map((h) => (
                      <li key={h}>• {h}</li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-3">
                    <span className="text-xs font-bold text-neutral-900">
                      ₩{d.dailyBudgetKrw.toLocaleString()} / day (${Math.round(d.dailyBudgetKrw / FX)})
                    </span>
                    <Link
                      href={d.helperLink}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-semibold text-neutral-950 underline underline-offset-4 hover:text-neutral-600"
                    >
                      {helperLabel} &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. High-Commission Travel Essentials */}
        <section>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">{copy.essTitle}</h2>
          <p className="mt-1 text-xs text-neutral-500">{copy.essSub}</p>

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
                  className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-950"
                >
                  <div>
                    <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700">
                      {item.badge}
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-neutral-950">{title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">{desc}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs">
                    <span className="font-semibold text-neutral-900">{item.priceNote}</span>
                    <span className="font-bold text-neutral-950 group-hover:underline">
                      {item.provider} &rarr;
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* 4. Helper Family Cross-Promo Hub */}
        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-700">
            {copy.crossTitle}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'BeautyHelper', desc: '50 K-Beauty Shades & Lowest US Prices', href: '/beautyhelper' },
              { name: 'LoopShadow', desc: '30 Free Seoul Korean Shadowing Phrases', href: '/loopshadow' },
              { name: 'ColorHelper', desc: 'Free 12-Season Virtual Color Draping', href: '/' },
              { name: 'StayHelper', desc: '5-Star Luxury Hotels & VIP Credits', href: 'https://thestayhelper.com' },
            ].map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className="rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-950"
              >
                <p className="text-sm font-bold text-neutral-950">{s.name} &rarr;</p>
                <p className="mt-1 text-xs text-neutral-600">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
