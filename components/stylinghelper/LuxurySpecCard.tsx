'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, RefreshCw, ShieldCheck, X } from 'lucide-react';
import {
  boutiqueLabel,
  formatKrw,
  formatMoney,
  stockBadge,
  swatchHex,
  type BadgeTone,
  type BoutiqueOffer,
  type LuxuryStateResponse,
  type NormalizedLuxurySKU,
} from '@/lib/luxury-sku';

/** 화보 위 핀. page.tsx 의 HotspotPin 과 구조적으로 호환된다. */
export interface ShowroomPin {
  id: string;
  /** 화보 기준 % 좌표 */
  x: number;
  y: number;
  category: string;
  title: string;
  brand: string;
  price: number;
  retailer: string;
  buyUrl: string;
  sku?: string;
  colorway?: string;
}

const POLL_MS = 60_000;

const TONE_CLASS: Record<BadgeTone, { chip: string; dot: string; ring: string }> = {
  live: {
    chip: 'border-emerald-600/30 bg-emerald-50 text-emerald-800',
    dot: 'bg-emerald-600',
    ring: 'ring-emerald-600/40',
  },
  low: {
    chip: 'border-amber-600/35 bg-amber-50 text-amber-800',
    dot: 'bg-amber-600',
    ring: 'ring-amber-600/45',
  },
  sold: {
    chip: 'border-rose-600/30 bg-rose-50 text-rose-800',
    dot: 'bg-rose-600',
    ring: 'ring-rose-600/40',
  },
  pending: {
    chip: 'border-slate-300 bg-slate-100 text-slate-700',
    dot: 'bg-slate-500',
    ring: 'ring-slate-400/40',
  },
};

/**
 * 엔진 스냅샷 구독. SKU ID 목록이 바뀌거나 60초마다 다시 읽는다.
 * 실패하면 빈 맵을 유지한다 → 모든 배지가 "STOCK UNVERIFIED" 로 떨어진다.
 */
export function useLuxuryState(skuIds: string[]): {
  skus: Record<string, NormalizedLuxurySKU>;
  loading: boolean;
  generatedAt: string | null;
} {
  const key = useMemo(() => [...skuIds].sort().join(','), [skuIds]);
  const [state, setState] = useState<{ skus: Record<string, NormalizedLuxurySKU>; generatedAt: string | null }>({
    skus: {},
    generatedAt: null,
  });
  const [loading, setLoading] = useState<boolean>(Boolean(key));

  useEffect(() => {
    if (!key) {
      setState({ skus: {}, generatedAt: null });
      setLoading(false);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(`/api/luxury-state?ids=${encodeURIComponent(key)}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(String(res.status));
        const body = (await res.json()) as LuxuryStateResponse;
        if (!cancelled) setState({ skus: body.skus ?? {}, generatedAt: body.generatedAt });
      } catch {
        if (!cancelled && !controller.signal.aborted) setState({ skus: {}, generatedAt: null });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    setLoading(true);
    void load();
    const timer = window.setInterval(() => void load(), POLL_MS);
    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(timer);
    };
  }, [key]);

  return { skus: state.skus, loading, generatedAt: state.generatedAt };
}

function StockChip({ tone, label }: { tone: BadgeTone; label: string }) {
  const cls = TONE_CLASS[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] ${cls.chip}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {tone === 'live' && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${cls.dot}`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${cls.dot}`} />
      </span>
      {label}
    </span>
  );
}

function OfferRow({ offer, best }: { offer: BoutiqueOffer; best: boolean }) {
  const krw = formatKrw(offer.priceKrw);
  const state =
    offer.status === 'IN_STOCK' ? 'In stock' : offer.status === 'LOW_STOCK' ? 'Low stock' : offer.status === 'SOLD_OUT' ? 'Sold out' : 'Unverified';
  return (
    <li className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0F172A]">
          <span className="truncate">{boutiqueLabel(offer.boutique, offer.url)}</span>
          {best && (
            <span className="rounded bg-[#0F172A] px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-white">
              Best
            </span>
          )}
        </div>
        <div className={`text-[10.5px] ${offer.buyable ? 'text-slate-600' : 'text-slate-400'}`}>
          {state}
          {offer.dutiesIncluded ? ' · duties incl.' : ''}
          {offer.discountPct ? ` · −${offer.discountPct}%` : ''}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className={`text-[12.5px] font-semibold tabular-nums ${offer.buyable ? 'text-[#0F172A]' : 'text-slate-400 line-through'}`}>
          {formatMoney(offer.priceFinal)}
        </div>
        {krw && offer.priceFinal?.currency !== 'KRW' && (
          <div className="text-[10.5px] tabular-nums text-slate-500">≈ {krw}</div>
        )}
      </div>
    </li>
  );
}

export interface LuxurySpecCardProps {
  pin: ShowroomPin;
  sku: NormalizedLuxurySKU | null;
  loading?: boolean;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 플로팅 제품 스펙 카드 (클린 화이트·블랙 미니멀 표준 규격).
 * - 엔진 데이터가 있으면: 확정 재고 배지 · 컬러웨이 · 부티크별 가격 비교 · 최저가 직구 링크
 * - SOLD_OUT 이고 검증된 대체재가 있으면: 대체재 링크로 전환
 * - 엔진 데이터가 없으면: 큐레이션 링크를 "미확인" 배지와 함께 그대로 보여준다 (재고를 꾸며내지 않는다)
 */
export function LuxurySpecCard({ pin, sku, loading = false, onClose, className = '', style }: LuxurySpecCardProps) {
  const badge = stockBadge(sku);
  const best = sku?.bestOffer ?? null;
  const swap = sku?.stockStatus === 'SOLD_OUT' ? sku.activeSwap : null;
  const colorLabel = sku?.colorwayLabel ?? best?.colorwayLabel ?? pin.colorway ?? null;
  const hex = swatchHex(colorLabel);
  const offers = useMemo(() => {
    const list = [...(sku?.offers ?? [])];
    return list.sort((a, b) => Number(b.buyable) - Number(a.buyable) || (a.priceKrw ?? Infinity) - (b.priceKrw ?? Infinity));
  }, [sku]);

  const headlinePrice = best?.priceFinal ? formatMoney(best.priceFinal) : formatMoney({ amount: pin.price, currency: 'USD' });
  const headlineKrw = best && best.priceFinal?.currency !== 'KRW' ? formatKrw(best.priceKrw) : null;

  let cta: { href: string; label: string; primary: boolean };
  if (swap) {
    cta = { href: swap.to.url, label: `Shop verified alternative · ${swap.to.brand}`, primary: true };
  } else if (best) {
    cta = { href: best.url, label: `Shop at ${boutiqueLabel(best.boutique, best.url)}`, primary: true };
  } else if (sku?.stockStatus === 'SOLD_OUT') {
    cta = { href: pin.buyUrl, label: 'View product page', primary: false };
  } else {
    cta = { href: pin.buyUrl, label: `View at ${pin.retailer}`, primary: false };
  }

  return (
    <div
      role="dialog"
      aria-label={`${pin.brand} ${pin.title}`}
      style={style}
      className={`w-[300px] max-w-[calc(100vw-32px)] rounded-2xl border border-slate-200 bg-white/95 p-4 text-left text-[#0F172A] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-3">
        {loading && !sku ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-slate-600">
            <RefreshCw className="h-3 w-3 animate-spin" /> CHECKING
          </span>
        ) : (
          <StockChip tone={badge.tone} label={badge.label} />
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product card"
          className="-mr-1 -mt-1 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0F172A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{sku?.brand || pin.brand}</div>
        <h4 className="mt-1 text-[14px] font-semibold leading-snug text-[#0F172A] [text-wrap:balance]">
          {sku?.modelName || pin.title}
        </h4>
        <div className="mt-1 text-[10.5px] uppercase tracking-wider text-slate-400">{pin.category}</div>
      </div>

      {colorLabel && (
        <div className="mt-3 flex items-center gap-2 text-[11.5px] text-slate-700">
          <span
            aria-hidden
            className="h-4 w-4 rounded-full border border-slate-300"
            style={hex ? { backgroundColor: hex } : { backgroundImage: 'repeating-linear-gradient(45deg,#cbd5e1 0 3px,#f8fafc 3px 6px)' }}
          />
          <span className="capitalize">{colorLabel}</span>
          {best?.colorMatch === true && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
              <ShieldCheck className="h-3 w-3" /> colour matched
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-baseline justify-between border-t border-slate-200 pt-3">
        <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{best ? 'Lowest verified' : 'Listed price'}</span>
        <span className="text-right">
          <span className="text-[18px] font-bold tabular-nums text-[#0F172A]">{headlinePrice}</span>
          {headlineKrw && <span className="block text-[10.5px] tabular-nums text-slate-500">≈ {headlineKrw}</span>}
        </span>
      </div>

      {offers.length > 1 && (
        <ul className="mt-2 divide-y divide-slate-100 border-t border-slate-200">
          {offers.map((o) => (
            <OfferRow key={o.url} offer={o} best={best?.url === o.url} />
          ))}
        </ul>
      )}

      {swap && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">Verified alternative</div>
          <div className="mt-1 text-[12.5px] font-semibold text-[#0F172A]">
            {swap.to.brand} · {swap.to.modelName}
          </div>
          <div className="mt-0.5 text-[11px] tabular-nums text-slate-500">
            {formatMoney(swap.offer.priceFinal)}
            {formatKrw(swap.offer.priceKrw) && swap.offer.priceFinal?.currency !== 'KRW' ? ` · ≈ ${formatKrw(swap.offer.priceKrw)}` : ''}
          </div>
        </div>
      )}

      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`mt-4 flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A] focus-visible:ring-offset-2 ${
          cta.primary
            ? 'bg-[#0F172A] text-white hover:bg-[#1E293B] active:scale-[0.98]'
            : 'border border-slate-300 bg-white text-[#0F172A] hover:border-[#0F172A] hover:bg-slate-50'
        }`}
      >
        <span className="truncate">{cta.label}</span>
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
      </a>

      <p className="mt-2.5 text-[10px] leading-relaxed text-slate-500">
        {sku
          ? `Stock checked ${new Date(sku.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} across ${sku.offers.length} boutique${sku.offers.length === 1 ? '' : 's'}.`
          : 'Live stock for this piece has not been verified yet. Availability is confirmed on the boutique page.'}
      </p>
    </div>
  );
}

export interface LuxuryHotspotLayerProps {
  /** 핀 ID 를 엔진 SKU ID 로 바꿀 때 붙이는 네임스페이스 (보통 룩 ID) */
  lookId: string;
  pins: ShowroomPin[];
  /** 기본값: `${lookId}:${pin.id}` (엔진 레지스트리의 sku_id 와 같은 규칙) */
  skuIdFor?: (pin: ShowroomPin) => string;
  className?: string;
}

/**
 * 화보 컨테이너(position: relative) 안에 깔리는 핫스팟 레이어.
 * 핀 클릭 → 핀 위치에 맞춰 좌/우·상/하로 뒤집히는 스펙 카드. Esc·바깥 클릭으로 닫힌다.
 */
export function LuxuryHotspotLayer({ lookId, pins, skuIdFor, className = '' }: LuxuryHotspotLayerProps) {
  const resolveId = useCallback(
    (pin: ShowroomPin) => (skuIdFor ? skuIdFor(pin) : `${lookId}:${pin.id}`),
    [lookId, skuIdFor],
  );
  const skuIds = useMemo(() => pins.map(resolveId), [pins, resolveId]);
  const { skus, loading } = useLuxuryState(skuIds);
  const [openId, setOpenId] = useState<string | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpenId(null), [lookId]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    const onDown = (e: MouseEvent) => {
      if (layerRef.current && !layerRef.current.contains(e.target as Node)) setOpenId(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [openId]);

  return (
    <div ref={layerRef} className={`pointer-events-none absolute inset-0 z-10 ${className}`}>
      {pins.map((pin, idx) => {
        const skuId = resolveId(pin);
        const sku = skus[skuId] ?? null;
        const tone = stockBadge(sku).tone;
        const open = openId === pin.id;
        const flipX = pin.x > 55;
        const flipY = pin.y > 58;
        return (
          <div
            key={pin.id || idx}
            className={`absolute ${open ? 'z-30' : 'z-10'}`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <button
              type="button"
              aria-label={`${pin.brand} ${pin.title} — product details`}
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : pin.id)}
              className={`pointer-events-auto relative -ml-3.5 -mt-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-[#0F172A]/80 bg-white/95 text-[10px] font-bold text-[#0F172A] shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A] motion-reduce:transition-none ${
                open ? `scale-110 ring-2 ${TONE_CLASS[tone].ring}` : ''
              }`}
            >
              {!open && (
                <span className="absolute inset-0 animate-ping rounded-full border border-[#0F172A]/40 motion-reduce:hidden" />
              )}
              <span className="relative">{idx + 1}</span>
              <span className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white ${TONE_CLASS[tone].dot}`} />
            </button>
            {open && (
              <LuxurySpecCard
                pin={pin}
                sku={sku}
                loading={loading}
                onClose={() => setOpenId(null)}
                className="pointer-events-auto absolute"
                style={{
                  [flipX ? 'right' : 'left']: 18,
                  [flipY ? 'bottom' : 'top']: 18,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LuxuryHotspotLayer;
