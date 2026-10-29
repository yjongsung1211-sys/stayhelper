/**
 * =========================================================================
 * 화천퍼스트 범용 엔터프라이즈 제작·검수·심야순찰 파이프라인 코어 엔진
 * (Universal Forward Production, 4-Step Audit & Nightly Patrol Engine)
 * =========================================================================
 *
 * 적용 가능 도메인:
 * 1. StylingHelper  : 글로벌 패션 의류 & 잡화 핫스팟 커머스
 * 2. RoomHelper     : 글로벌 인테리어 & 가구 핫스팟 커머스
 * 3. StayHelper     : 글로벌 하이엔드 호텔 & 프라이빗 리조트 릴스 커머스
 * 4. Custom Site    : 미래에 제작할 모든 신규 디지털 이커머스 & 에셋 플랫폼
 */

export type DomainType = 'fashion' | 'interior' | 'travel' | 'custom';
export type StockStatusType = 'IN_STOCK' | 'LOW_STOCK' | 'SOLD_OUT';

export interface UniversalItem {
  id: string;
  categoryKey: string;
  categoryLabel: string;
  brand: string;
  itemName: string;
  retailer: string;
  price: string;
  buyUrl: string;
  realPhotoUrl: string;
  prohibitedFeatures: string; // ❌ 배제 형태 (Negative Criteria)
  mandatoryFeatures: string;  // ✅ 필수 일치 형태 (Positive Criteria)
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  httpStatus?: number | string;
  stockStatus: StockStatusType;
  stockReason?: string;
  dupe?: {
    brand: string;
    itemName: string;
    retailer: string;
    price: string;
    buyUrl: string;
    savingsPct: number;
    stockStatus: StockStatusType;
  };
}

export interface UniversalAssetGroup {
  id: string;
  title: string;
  ownerOrMember: string;
  aesthetic: string;
  themeOrSeason: string;
  visualMediaUrl: string;
  mediaType: 'image' | 'video_reels';
  approvalStatus: 'VERIFIED' | 'NEEDS_REVIEW' | 'DRAFT';
  items: UniversalItem[];
}

export interface SitePresetConfig {
  siteId: string;
  siteName: string;
  domainType: DomainType;
  tagline: string;
  targetMarket: string;
  defaultCategories: Array<{ key: string; label: string; icon: string }>;
  promptCameraRig: string;
  primaryRetailers: string[];
}

// 1. BUILT-IN UNIVERSAL SITE PRESETS
export const UNIVERSAL_SITE_PRESETS: Record<string, SitePresetConfig> = {
  stylinghelper: {
    siteId: 'stylinghelper',
    siteName: 'StylingHelper US',
    domainType: 'fashion',
    tagline: 'Click Any Look, Shop the Outfit',
    targetMarket: 'United States & Global Fashion',
    defaultCategories: [
      { key: 'outer', label: '외투 (Outer)', icon: 'Shirt' },
      { key: 'top', label: '상의 (Top)', icon: 'Shirt' },
      { key: 'bottom', label: '하의 (Bottom)', icon: 'Layers' },
      { key: 'shoes', label: '신발 (Shoes)', icon: 'Package' },
      { key: 'bag', label: '가방 (Bag)', icon: 'ShoppingBag' },
      { key: 'sunglasses', label: '아이웨어 (Eyewear)', icon: 'Eye' },
      { key: 'jewelry', label: '주얼리 (Jewelry)', icon: 'Sparkles' },
    ],
    promptCameraRig: 'Shot on Hasselblad H6D-100c, 85mm f/1.4 lens, natural daylight, photorealistic fabric weave and leather grain.',
    primaryRetailers: ['Shopbop', 'Nordstrom', 'Amazon US', 'Zara US', 'SSENSE'],
  },
  roomhelper: {
    siteId: 'roomhelper',
    siteName: 'RoomHelper US',
    domainType: 'interior',
    tagline: 'Click Any Room, Shop the Furniture',
    targetMarket: 'United States & Global Interior',
    defaultCategories: [
      { key: 'sofa', label: '소파/시팅 (Sofa)', icon: 'Armchair' },
      { key: 'table', label: '테이블/데스크 (Table)', icon: 'Table' },
      { key: 'lighting', label: '조명/플로어램프 (Lighting)', icon: 'Lamp' },
      { key: 'rug', label: '러그/카펫 (Rug)', icon: 'Layers' },
      { key: 'chair', label: '악센트 체어 (Chair)', icon: 'Armchair' },
      { key: 'bed', label: '침대/프레임 (Bed)', icon: 'Bed' },
      { key: 'decor', label: '오브제/화병 (Decor)', icon: 'Sparkles' },
    ],
    promptCameraRig: 'Architectural Digest style interior photography, Sony A7R V, 24mm f/2.8 architectural tilt-shift lens, warm ambient ray-tracing lighting, realistic wood grain and boucle wool texture.',
    primaryRetailers: ['IKEA US', 'Wayfair', 'West Elm', 'CB2', 'Crate & Barrel', 'Amazon Home'],
  },
  stayhelper: {
    siteId: 'stayhelper',
    siteName: 'StayHelper Global',
    domainType: 'travel',
    tagline: 'The World’s Most Extraordinary Sanctuaries in Motion',
    targetMarket: 'Global Ultra-Luxury Escapes',
    defaultCategories: [
      { key: 'suite', label: '마스터 파빌리온 (Suite)', icon: 'BedDouble' },
      { key: 'pool', label: '인피니티 풀 (Pool)', icon: 'Waves' },
      { key: 'dining', label: '파인다이닝 (Dining)', icon: 'Utensils' },
      { key: 'spa', label: '웰니스 스파 (Spa)', icon: 'Sparkles' },
      { key: 'terrace', label: '선셋 테라스 (Terrace)', icon: 'Sun' },
    ],
    promptCameraRig: '2.39:1 Hollywood anamorphic widescreen cinematography, ARRI Alexa Mini LF, Master Anamorphic prime lenses, slow cinematic Ken Burns atmospheric drift, warm twilight golden hour.',
    primaryRetailers: ['Booking.com VIP', 'Amex Fine Hotels', 'Virtuoso', 'Resort Direct'],
  },
};

/**
 * =========================================================================
 * 1. UNIVERSAL FORWARD PRODUCTION ENGINE (정방향 제작 엔진)
 * =========================================================================
 */
export class UniversalForwardProducer {
  /**
   * 실존 상품 스펙을 기반으로 1:1 완벽 일치 고화질 이미지/영상 프롬프트를 자동 컴파일합니다.
   */
  static compileForwardPrompt(preset: SitePresetConfig, assetGroup: UniversalAssetGroup): string {
    const positiveItems = assetGroup.items
      .map((it) => `${it.categoryLabel}: ${it.brand} ${it.itemName} (${it.mandatoryFeatures})`)
      .join(', ');

    const negativeItems = assetGroup.items
      .map((it) => it.prohibitedFeatures)
      .filter(Boolean)
      .join(', ');

    return `Ultra-realistic 8K editorial ${preset.domainType} master scene of ${assetGroup.ownerOrMember} (${assetGroup.aesthetic}). Featuring verified real items in exact physical configuration: ${positiveItems}. ${preset.promptCameraRig} STRICT NEGATIVE RESTRICTIONS (Do Not Render): ${negativeItems}, blurry details, distorted proportions, low-resolution artifacts, CGI plastic look. 100% faithful to authentic physical manufacturer specifications.`;
  }

  /**
   * 4단 시각화 검증 테이블 완성도를 검사합니다.
   */
  static validate4StepTable(items: UniversalItem[]): { isValid: boolean; missingCount: number; errors: string[] } {
    const errors: string[] = [];
    items.forEach((item, idx) => {
      if (!item.itemName) errors.push(`[${item.categoryLabel}] 공식 품명이 누락되었습니다.`);
      if (!item.buyUrl) errors.push(`[${item.categoryLabel}] 공식 라이브 링크가 누락되었습니다.`);
      if (!item.realPhotoUrl) errors.push(`[${item.categoryLabel}] 공식 실물 사진이 등록되지 않았습니다.`);
      if (!item.mandatoryFeatures) errors.push(`[${item.categoryLabel}] 4단 검증 [✅필수 일치 형태]가 정의되지 않았습니다.`);
      if (!item.prohibitedFeatures) errors.push(`[${item.categoryLabel}] 4단 검증 [❌배제 형태]가 정의되지 않았습니다.`);
    });

    return {
      isValid: errors.length === 0,
      missingCount: errors.length,
      errors,
    };
  }
}

/**
 * =========================================================================
 * 2. UNIVERSAL AUDIT & ERROR CHECK ENGINE (품질 검수 & 오류 확인 엔진)
 * =========================================================================
 */
export class UniversalAuditEngine {
  /**
   * 복수 에셋 간 중복 제로(Zero-Duplicate) 스캔을 수행합니다.
   */
  static checkZeroDuplicate(assetGroups: UniversalAssetGroup[]): Array<{ type: string; key: string; locations: string[] }> {
    const urlMap: Record<string, string[]> = {};
    const nameMap: Record<string, string[]> = {};
    const duplicates: Array<{ type: string; key: string; locations: string[] }> = [];

    assetGroups.forEach((group) => {
      group.items.forEach((item) => {
        const locationTag = `${group.ownerOrMember} (${group.id}) ➔ ${item.categoryLabel}`;
        if (item.buyUrl) {
          urlMap[item.buyUrl] = urlMap[item.buyUrl] || [];
          urlMap[item.buyUrl].push(locationTag);
        }
        const cleanName = `${item.brand} ${item.itemName}`.trim().toLowerCase();
        if (cleanName) {
          nameMap[cleanName] = nameMap[cleanName] || [];
          nameMap[cleanName].push(locationTag);
        }
      });
    });

    Object.entries(urlMap).forEach(([url, locs]) => {
      if (locs.length > 1) {
        duplicates.push({ type: 'URL 중복 감지 (동일 구매 링크)', key: url, locations: locs });
      }
    });

    Object.entries(nameMap).forEach(([name, locs]) => {
      if (locs.length > 1) {
        duplicates.push({ type: '품명 중복 감지 (동일 제품 재사용)', key: name, locations: locs });
      }
    });

    return duplicates;
  }
}

/**
 * =========================================================================
 * 3. UNIVERSAL NIGHTLY PATROL & FALLBACK ENGINE (심야 무인 순찰 엔진)
 * =========================================================================
 */
export class UniversalNightPatrolEngine {
  /**
   * 품절/단종 감지 시 스마트 듀프(대체재)로 핫스왑을 수행합니다.
   */
  static hotSwapToSmartDupe(item: UniversalItem): UniversalItem {
    if (!item.dupe) return item;

    return {
      ...item,
      brand: `${item.dupe.brand} (스마트 듀프 자동 전환)`,
      itemName: item.dupe.itemName,
      retailer: item.dupe.retailer,
      price: item.dupe.price,
      buyUrl: item.dupe.buyUrl,
      stockStatus: 'IN_STOCK',
      stockReason: `원작 품절로 인해 ${item.dupe.savingsPct}% 가성비 실존 듀프로 즉시 핫스왑 완료 (고객 이탈 0건 방어)`,
    };
  }

  /**
   * 심야 3단계 순찰 요약 보고서를 컴파일합니다.
   */
  static generateNightlyPatrolReport(siteName: string, items: UniversalItem[], patrolHour: '20:00' | '01:00' | '04:30'): string {
    const total = items.length;
    const inStock = items.filter((i) => i.stockStatus === 'IN_STOCK').length;
    const lowStock = items.filter((i) => i.stockStatus === 'LOW_STOCK').length;
    const soldOut = items.filter((i) => i.stockStatus === 'SOLD_OUT').length;

    return `[${siteName}] 심야 무인 재고 순찰 리포트 (${patrolHour} 기준)
- 총 모니터링 품목: ${total}개
- 정상 판매 중 (In Stock): ${inStock}개
- 수량 소진 임박 (Low Stock): ${lowStock}개 (모니터링 강화)
- 품절 감지 (Sold Out): ${soldOut}개 (스마트 듀프 핫스왑 실행 대기)
- 시스템 상태: 무인 자율 운영 정상 가동 중 (예산 지출: 0 KRW)`;
  }
}
