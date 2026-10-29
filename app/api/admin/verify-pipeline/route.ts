import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, urls, items, lookData } = body;

    // 1. Action: Batch Link Health & Basic Status Check
    if (action === 'check-links') {
      const results: Record<string, { status: number | string; ok: boolean; latencyMs: number }> = {};
      const urlList: string[] = urls || [];

      const checkPromises = urlList.slice(0, 15).map(async (url) => {
        const start = Date.now();
        try {
          const res = await fetch(url, {
            method: 'HEAD',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            signal: AbortSignal.timeout(4000),
          });
          const latency = Date.now() - start;
          results[url] = {
            status: res.status,
            ok: res.status >= 200 && res.status < 400,
            latencyMs: latency,
          };
        } catch (err: any) {
          const latency = Date.now() - start;
          results[url] = {
            status: err.name === 'TimeoutError' ? 'TIMEOUT' : 'ERR_NETWORK',
            ok: false,
            latencyMs: latency,
          };
        }
      });

      await Promise.allSettled(checkPromises);
      return NextResponse.json({ success: true, results });
    }

    // 2. Action: Nightly Stock & Seasonality Inventory Patrol (심야 품절 & 사이즈 고갈 자동 검수)
    if (action === 'check-stock') {
      const itemsToCheck: Array<{ id: string; buyUrl: string; brand: string; productName: string }> = items || [];
      const stockResults: Record<
        string,
        {
          stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'SOLD_OUT';
          httpStatus: number | string;
          reason: string;
          checkedAt: string;
        }
      > = {};

      const stockPromises = itemsToCheck.slice(0, 10).map(async (it) => {
        const checkedAt = new Date().toLocaleTimeString('ko-KR');
        try {
          const res = await fetch(it.buyUrl, {
            method: 'GET',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            signal: AbortSignal.timeout(5000),
          });

          if (res.status === 404 || res.status === 410) {
            stockResults[it.id] = {
              stockStatus: 'SOLD_OUT',
              httpStatus: res.status,
              reason: '페이지 404 단종/삭제 감지',
              checkedAt,
            };
            return;
          }

          const html = await res.text();
          const lowerHtml = html.toLowerCase();

          // Sold Out Patterns
          const soldOutPatterns = [
            'out of stock',
            'currently unavailable',
            'sold out',
            'no longer available',
            'item is not available',
            'temporarily out of stock',
            '품절',
            '판매 종료',
          ];

          // Low Stock / Few Left Patterns
          const lowStockPatterns = [
            'only 1 left',
            'only 2 left',
            'few left in stock',
            'low stock',
            'almost gone',
            'limited availability',
          ];

          const isSoldOut = soldOutPatterns.some((p) => lowerHtml.includes(p));
          const isLowStock = lowStockPatterns.some((p) => lowerHtml.includes(p));

          if (isSoldOut) {
            stockResults[it.id] = {
              stockStatus: 'SOLD_OUT',
              httpStatus: res.status,
              reason: '전체 품절/재고 없음 감지 (Sold Out)',
              checkedAt,
            };
          } else if (isLowStock) {
            stockResults[it.id] = {
              stockStatus: 'LOW_STOCK',
              httpStatus: res.status,
              reason: '사이즈/색상 극소량 남음 (Only Few Left in Stock)',
              checkedAt,
            };
          } else {
            stockResults[it.id] = {
              stockStatus: 'IN_STOCK',
              httpStatus: res.status,
              reason: '정상 재고 판매 중 (In Stock)',
              checkedAt,
            };
          }
        } catch (err: any) {
          stockResults[it.id] = {
            stockStatus: 'LOW_STOCK',
            httpStatus: 'ERR_TIMEOUT',
            reason: '네트워크 응답 지연 (수동 확인 권장)',
            checkedAt,
          };
        }
      });

      await Promise.allSettled(stockPromises);
      return NextResponse.json({
        success: true,
        summary: {
          total: itemsToCheck.length,
          soldOutCount: Object.values(stockResults).filter((s) => s.stockStatus === 'SOLD_OUT').length,
          lowStockCount: Object.values(stockResults).filter((s) => s.stockStatus === 'LOW_STOCK').length,
          inStockCount: Object.values(stockResults).filter((s) => s.stockStatus === 'IN_STOCK').length,
        },
        stockResults,
      });
    }

    // 3. Action: Zero-Duplicate Check across items
    if (action === 'check-duplicates') {
      const allItems: Array<{ member: string; lookId: string; title: string; buyUrl: string; sku?: string }> =
        items || [];

      const urlMap: Record<string, string[]> = {};
      const skuMap: Record<string, string[]> = {};
      const duplicates: Array<{ type: string; identifier: string; appearances: string[] }> = [];

      allItems.forEach((it) => {
        const label = `${it.member} / ${it.lookId}`;
        if (it.buyUrl) {
          urlMap[it.buyUrl] = urlMap[it.buyUrl] || [];
          urlMap[it.buyUrl].push(label);
        }
        if (it.sku) {
          skuMap[it.sku] = skuMap[it.sku] || [];
          skuMap[it.sku].push(label);
        }
      });

      Object.entries(urlMap).forEach(([url, apps]) => {
        if (apps.length > 1) {
          duplicates.push({ type: 'URL (동일 구매 링크)', identifier: url, appearances: apps });
        }
      });

      Object.entries(skuMap).forEach(([sku, apps]) => {
        if (apps.length > 1) {
          duplicates.push({ type: 'SKU / ASIN (동일 제품 품번)', identifier: sku, appearances: apps });
        }
      });

      return NextResponse.json({
        success: true,
        zeroDuplicatePassed: duplicates.length === 0,
        duplicateCount: duplicates.length,
        duplicates,
      });
    }

    // 4. Action: Save / Sync Approved Look to Database JSON
    if (action === 'sync-look') {
      if (!lookData || !lookData.id) {
        return NextResponse.json({ success: false, error: '유효한 룩 데이터가 제공되지 않았습니다.' }, { status: 400 });
      }

      const filePath = path.join(process.cwd(), 'public', 'editorial_top10_lookbook.json');
      let currentData: any[] = [];
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        currentData = JSON.parse(content);
      }

      const index = currentData.findIndex((item: any) => item.id === lookData.id);
      if (index >= 0) {
        currentData[index] = lookData;
      } else {
        currentData.push(lookData);
      }

      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf-8');

      return NextResponse.json({
        success: true,
        message: `룩 '${lookData.id}'이(가) 서비스 데이터베이스에 안전하게 동기화되었습니다.`,
        totalLooks: currentData.length,
      });
    }

    return NextResponse.json({ success: false, error: '알 수 없는 요청 액션입니다.' }, { status: 400 });
  } catch (err: any) {
    console.error('Pipeline API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
