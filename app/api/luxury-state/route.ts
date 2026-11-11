import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { LuxuryStateResponse, LuxuryStateSnapshot, NormalizedLuxurySKU } from '@/lib/luxury-sku';

export const dynamic = 'force-dynamic';

const SNAPSHOT_PATH = path.join(process.cwd(), 'data', 'luxury_state_snapshot.json');
const FX_CACHE_PATH = path.join(process.cwd(), 'data', 'luxury_fx_cache.json');

let cache: { mtimeMs: number; snapshot: LuxuryStateSnapshot } | null = null;

function loadFallbackFx(): { fetchedAt: string | null; usdKrw: number | null } {
  try {
    const raw = JSON.parse(fs.readFileSync(FX_CACHE_PATH, 'utf-8'));
    const krw = typeof raw?.rates?.KRW === 'number' ? raw.rates.KRW : null;
    const fetchedAt = typeof raw?.fetched_at === 'string' ? raw.fetched_at : null;
    return { fetchedAt, usdKrw: krw };
  } catch {
    return { fetchedAt: null, usdKrw: null };
  }
}

function loadSnapshot(): LuxuryStateSnapshot | null {
  try {
    const stat = fs.statSync(SNAPSHOT_PATH);
    if (cache && cache.mtimeMs === stat.mtimeMs) return cache.snapshot;
    const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf-8')) as LuxuryStateSnapshot;
    if (!snapshot || !Array.isArray(snapshot.skus)) return null;
    cache = { mtimeMs: stat.mtimeMs, snapshot };
    return snapshot;
  } catch {
    return null;
  }
}

/**
 * GET /api/luxury-state?ids=look-01-bag,look-01-shoes
 * scripts/luxury_state_engine.py 가 쓴 스냅샷을 SKU ID 로 조회한다. ids 를 생략하면 전체.
 * 스냅샷이 없으면 available:false — 프런트는 이때 재고 배지를 "미확인" 으로 그린다.
 */
export async function GET(request: NextRequest) {
  const snapshot = loadSnapshot();
  const fallbackFx = loadFallbackFx();
  if (!snapshot) {
    const empty: LuxuryStateResponse = {
      available: false,
      generatedAt: null,
      fx: {
        fetchedAt: fallbackFx.fetchedAt,
        stale: !fallbackFx.usdKrw,
        usdKrw: fallbackFx.usdKrw,
      },
      skus: {},
    };
    return NextResponse.json(empty, { headers: { 'Cache-Control': 'no-store' } });
  }

  const idsParam = new URL(request.url).searchParams.get('ids');
  const wanted = idsParam ? new Set(idsParam.split(',').map((s) => s.trim()).filter(Boolean)) : null;
  const skus: Record<string, NormalizedLuxurySKU> = {};
  for (const sku of snapshot.skus) {
    if (!wanted || wanted.has(sku.skuId)) skus[sku.skuId] = sku;
  }

  const usdKrw = snapshot.fx?.rates?.KRW ?? fallbackFx.usdKrw ?? null;
  const fetchedAt = snapshot.fx?.fetchedAt ?? fallbackFx.fetchedAt ?? null;

  const body: LuxuryStateResponse = {
    available: true,
    generatedAt: snapshot.generatedAt,
    fx: {
      fetchedAt,
      stale: usdKrw === null ? true : (snapshot.fx?.stale ?? false),
      usdKrw,
    },
    skus,
  };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
}
