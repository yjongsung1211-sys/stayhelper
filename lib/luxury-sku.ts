/**
 * =========================================================================
 * Normalized Luxury SKU Schema (TypeScript)
 * =========================================================================
 * scripts/luxury_state_engine.py 의 Pydantic 모델과 1:1 로 대응한다.
 * 엔진이 data/luxury_state_snapshot.json 에 camelCase 로 직렬화한 값을 그대로 읽는다.
 * 필드를 바꿀 때는 양쪽을 함께 바꾼다 (원장: docs/luxury_engine_obligation_ledger.md §2).
 */

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'SOLD_OUT' | 'UNKNOWN';
export type VerificationLayer = 'TRANSPORT' | 'STATE_TREE' | 'SCHEMA_GRAPH' | 'DOM_PINPOINT';
export type LayerVote = 'POSITIVE' | 'LOW' | 'NEGATIVE' | 'ABSENT';
export type FallbackTier = 'identical' | 'equivalent' | 'dupe';

export interface Money {
  amount: number;
  /** ISO 4217 */
  currency: string;
}

export interface SizeVariant {
  size: string;
  sku: string | null;
  status: StockStatus;
  quantity: number | null;
  color: string | null;
}

export interface LayerSignal {
  layer: VerificationLayer;
  vote: LayerVote;
  primaryId: string | null;
  detail: string;
}

/** 화보 이미지 기준 % 좌표 (0–100) */
export interface HotspotPinCoord {
  x: number;
  y: number;
}

export interface FallbackCandidate {
  skuId: string;
  brand: string;
  modelName: string;
  boutique: string | null;
  url: string;
  colorwayLabel: string | null;
  tier: FallbackTier;
}

export interface BoutiqueOffer {
  boutique: string;
  url: string;
  finalUrl: string | null;
  productId: string | null;
  brand: string | null;
  name: string | null;
  status: StockStatus;
  /** IN_STOCK 또는 LOW_STOCK 으로 확정된 경우에만 true */
  buyable: boolean;
  confidence: number;
  reasonCodes: string[];
  priceFinal: Money | null;
  priceFull: Money | null;
  discountPct: number | null;
  /** 엔진이 실시간 환율로 환산한 값. 환율을 못 구하면 null (추정값을 넣지 않는다) */
  priceKrw: number | null;
  dutiesIncluded: boolean | null;
  colorwayLabel: string | null;
  colorMatch: boolean | null;
  /** 핀의 브랜드와 페이지의 브랜드가 같은지. false 면 링크가 다른 상품을 가리킨다 */
  brandMatch: boolean | null;
  sizes: SizeVariant[];
  totalQuantity: number | null;
  carouselProductsIgnored: number;
  signals: LayerSignal[];
  httpStatus: number | null;
  fetchMs: number | null;
  parseMs: number | null;
  verifiedAt: string;
}

export interface SwapDecision {
  fromSkuId: string;
  to: FallbackCandidate;
  offer: BoutiqueOffer;
  reason: string;
  decidedAt: string;
}

export interface NormalizedLuxurySKU {
  skuId: string;
  platform: string;
  brand: string;
  modelName: string;
  category: string;
  colorwayId: string | null;
  colorwayLabel: string | null;
  /** 누끼 이미지 파일의 sha256 ("sha256:…"). 파일이 없으면 null */
  cutoutHash: string | null;
  stockStatus: StockStatus;
  /** 구매 가능한 오퍼만으로 계산한 통화별 최저가 */
  lowestPriceByCurrency: Record<string, number>;
  bestOffer: BoutiqueOffer | null;
  offers: BoutiqueOffer[];
  hotspot: HotspotPinCoord | null;
  fallbackQueue: FallbackCandidate[];
  activeSwap: SwapDecision | null;
  verifiedAt: string;
}

export interface FxSnapshot {
  base: string;
  rates: Record<string, number>;
  fetchedAt: string | null;
  stale: boolean;
  source: string;
}

export interface LuxuryStateSnapshot {
  engineVersion: string;
  generatedAt: string;
  durationMs: number;
  fx: FxSnapshot;
  stats: Record<string, number>;
  skus: NormalizedLuxurySKU[];
}

/** /api/luxury-state 응답 */
export interface LuxuryStateResponse {
  available: boolean;
  generatedAt: string | null;
  fx: Pick<FxSnapshot, 'fetchedAt' | 'stale'> & { usdKrw: number | null };
  skus: Record<string, NormalizedLuxurySKU>;
}

/** 이 시간보다 오래된 검증은 "LIVE" 로 표시하지 않는다 */
export const LIVE_FRESHNESS_MS = 45 * 60 * 1000;

export type BadgeTone = 'live' | 'low' | 'sold' | 'pending';

export interface StockBadge {
  tone: BadgeTone;
  label: string;
}

export function isFresh(verifiedAt: string | null | undefined, now: number = Date.now()): boolean {
  if (!verifiedAt) return false;
  const t = Date.parse(verifiedAt);
  return Number.isFinite(t) && now - t <= LIVE_FRESHNESS_MS;
}

/**
 * 배지 규칙: 엔진이 확정했고 검증이 신선할 때만 LIVE 를 붙인다.
 * 데이터 없음·UNKNOWN·오래된 검증은 전부 "확인 중" 이다.
 */
export function stockBadge(sku: NormalizedLuxurySKU | null | undefined, now: number = Date.now()): StockBadge {
  if (!sku) return { tone: 'pending', label: 'STOCK UNVERIFIED' };
  if (sku.stockStatus === 'SOLD_OUT') return { tone: 'sold', label: 'SOLD OUT' };
  if (!isFresh(sku.verifiedAt, now)) return { tone: 'pending', label: 'RE-VERIFYING' };
  if (sku.stockStatus === 'IN_STOCK') return { tone: 'live', label: 'LIVE IN STOCK' };
  if (sku.stockStatus === 'LOW_STOCK') return { tone: 'low', label: 'LOW STOCK' };
  return { tone: 'pending', label: 'STOCK UNVERIFIED' };
}

export function formatMoney(money: Money | null | undefined): string {
  if (!money) return '—';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: money.currency,
      maximumFractionDigits: money.currency === 'KRW' || money.currency === 'JPY' ? 0 : 2,
    }).format(money.amount);
  } catch {
    return `${money.amount.toLocaleString('en-US')} ${money.currency}`;
  }
}

export function formatKrw(amount: number | null | undefined): string | null {
  if (amount == null || !Number.isFinite(amount)) return null;
  return `₩${Math.round(amount).toLocaleString('ko-KR')}`;
}

const BOUTIQUE_LABELS: Record<string, string> = {
  farfetch: 'FARFETCH',
  ssense: 'SSENSE',
  mytheresa: 'Mytheresa',
  'net-a-porter': 'NET-A-PORTER',
};

export function boutiqueLabel(key: string, url?: string): string {
  if (BOUTIQUE_LABELS[key]) return BOUTIQUE_LABELS[key];
  if (url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      /* fall through */
    }
  }
  return key;
}

const SWATCH_HEX: Record<string, string> = {
  black: '#0E0E10', white: '#F7F7F5', ivory: '#EFE7D6', beige: '#D8C7A9', camel: '#B98A55',
  brown: '#6B4630', burgundy: '#5E1A28', red: '#B3202A', pink: '#E7A6B5', orange: '#C96A2B',
  yellow: '#D9B13B', green: '#48603F', blue: '#2F5D9B', navy: '#1B2742', purple: '#5B4A8A',
  grey: '#8A8D91', gray: '#8A8D91', silver: '#C4C7CC', gold: '#E5BE64',
  블랙: '#0E0E10', 화이트: '#F7F7F5', 브라운: '#6B4630', 베이지: '#D8C7A9', 네이비: '#1B2742',
};

/** 컬러웨이 라벨 → 스와치 색. 모르는 라벨은 null (엉뚱한 기본색을 칠하지 않는다) */
export function swatchHex(label: string | null | undefined): string | null {
  if (!label) return null;
  for (const token of label.toLowerCase().split(/[\s/,&-]+/)) {
    if (SWATCH_HEX[token]) return SWATCH_HEX[token];
  }
  return null;
}
