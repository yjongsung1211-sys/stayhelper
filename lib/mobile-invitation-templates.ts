/**
 * =========================================================================
 * WEDDINGHELPER 10 LUXURY BESPOKE MOBILE INVITATION TEMPLATES
 * =========================================================================
 * Radically Distinct, Atmospheric, High-Concept Architectural Layouts
 * Each template features a completely unique color world, authentic cultural
 * motifs, specialized textures, and bespoke section styling.
 */

export interface MobileInvitationTemplate {
  id: string;
  name: string;
  subtitle: string;
  category: 'heritage' | 'editorial' | 'vintage' | 'cathedral' | 'celestial' | 'floral' | 'minimal' | 'riviera' | 'aegean' | 'botanical';
  headerStyle: 
    | 'royal_crest' 
    | 'vogue_magazine' 
    | 'wax_seal' 
    | 'cathedral_gothic' 
    | 'celestial_dark' 
    | 'floral_wreath' 
    | 'minimal_polaroid' 
    | 'golden_sunset' 
    | 'aegean_resort' 
    | 'botanical_glass';
  tagline: string;
  themeColor: string;
  accentColor: string;
  bgGradient: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  subTextColor: string;
  fontFamily: 'serif' | 'sans';
  frameShape: 'rounded' | 'arch' | 'classic' | 'sharp';
  badgeLabel: string;
  heartColor: string;
  isDarkMode: boolean;
  monogramText: string;
  ornamentSymbol: string;
  quoteIntro: string;
  koreanBadge?: string;
  accentGlow?: string;
}

export const MOBILE_INVITATION_10_TEMPLATES: MobileInvitationTemplate[] = [
  {
    id: 'royal-heritage',
    name: 'Korean Royal Hanbok Heritage',
    subtitle: '조선 왕실 궁중 가례첩 · 24K 순금 봉황 문양',
    category: 'heritage',
    headerStyle: 'royal_crest',
    tagline: 'Imperial Crimson Silk fabric, 24K gold foil phoenix crest & traditional Dancheong lattice',
    themeColor: '#D4AF37',
    accentColor: '#FFDF78',
    bgGradient: 'from-[#1C0508] via-[#2F0A0F] to-[#120305]',
    cardBg: '#24080C',
    borderColor: '#7A1C23',
    textColor: '#FFF6E5',
    subTextColor: '#D9B88F',
    fontFamily: 'serif',
    frameShape: 'classic',
    badgeLabel: '百年佳約 · 鳳凰之盟',
    koreanBadge: '조선 왕실 가례첩 (국빈 의전용)',
    heartColor: '#D4AF37',
    isDarkMode: true,
    monogramText: '李 ⚜ 朴',
    ornamentSymbol: '👑',
    quoteIntro: '천년의 인연으로 맺어진 두 사람이 한 길을 걷고자 합니다',
    accentGlow: 'rgba(212, 175, 55, 0.35)'
  },
  {
    id: 'vogue-editorial',
    name: 'Vogue Haute Editorial',
    subtitle: 'New York High-Fashion Magazine Cover',
    category: 'editorial',
    headerStyle: 'vogue_magazine',
    tagline: 'High-fashion editorial layout, bold Vogue masthead, barcode & vibrant couture color',
    themeColor: '#FFFFFF',
    accentColor: '#D4AF37',
    bgGradient: 'from-[#0A0A0C] via-[#121215] to-[#050506]',
    cardBg: '#131316',
    borderColor: '#2A2A30',
    textColor: '#FFFFFF',
    subTextColor: '#9C9CA6',
    fontFamily: 'serif',
    frameShape: 'sharp',
    badgeLabel: 'THE WEDDING ISSUE · VOL. XXIV',
    koreanBadge: '보그 뉴욕 하이패션 에디토리얼',
    heartColor: '#FFFFFF',
    isDarkMode: true,
    monogramText: 'L & E',
    ornamentSymbol: '✦',
    quoteIntro: 'AN EDITORIAL CELEBRATION OF SACRED COUTURE LOVE',
    accentGlow: 'rgba(255, 255, 255, 0.25)'
  },
  {
    id: 'vintage-monogram',
    name: 'Lake Como Vintage Parchment',
    subtitle: '이탈리아 코모 호수 빈티지 양피지 & 버건디 실링왁스',
    category: 'vintage',
    headerStyle: 'wax_seal',
    tagline: 'Deckled edge Italian parchment, 3D crimson wax seal & antique cursive script',
    themeColor: '#8A2D2A',
    accentColor: '#C49746',
    bgGradient: 'from-[#EDE3D2] via-[#E2D5BE] to-[#D5C6AA]',
    cardBg: '#FAF5EC',
    borderColor: '#C8B293',
    textColor: '#2C1D18',
    subTextColor: '#6E5347',
    fontFamily: 'serif',
    frameShape: 'classic',
    badgeLabel: 'LAKE COMO VILLA MONOGRAM',
    koreanBadge: '이탈리아 코모 호수 빈티지 양피지',
    heartColor: '#8A2D2A',
    isDarkMode: false,
    monogramText: 'L ⚜ E',
    ornamentSymbol: '⚜',
    quoteIntro: 'By Special Proclamation of Solemn Matrimony at Villa Balbianello',
    accentGlow: 'rgba(138, 45, 42, 0.3)'
  },
  {
    id: 'cathedral-arch',
    name: 'Sacred Cathedral Arch',
    subtitle: '세이크리드 고딕 대성당 아치 & 촛불 스테인드글라스',
    category: 'cathedral',
    headerStyle: 'cathedral_gothic',
    tagline: 'Gothic stone arches, warm sacred candlelight, hymnal Latin script & holy vows',
    themeColor: '#D8B86D',
    accentColor: '#F5DE9C',
    bgGradient: 'from-[#110F18] via-[#1E1A29] to-[#0D0B13]',
    cardBg: '#191523',
    borderColor: '#3D344E',
    textColor: '#F5EFE6',
    subTextColor: '#B3A698',
    fontFamily: 'serif',
    frameShape: 'arch',
    badgeLabel: 'SACRED SANCTUARY BASILICA',
    koreanBadge: '세이크리드 고딕 대성당 아치',
    heartColor: '#D8B86D',
    isDarkMode: true,
    monogramText: 'L † E',
    ornamentSymbol: '⛪',
    quoteIntro: 'Beneath the Sacred Arches of Holy Matrimony · In Aeternum Amor',
    accentGlow: 'rgba(216, 184, 109, 0.35)'
  },
  {
    id: 'midnight-celestial',
    name: 'Midnight Celestial Starlight',
    subtitle: '미드나잇 은하수 별자리 성도 & 골든 스타더스트',
    category: 'celestial',
    headerStyle: 'celestial_dark',
    tagline: 'Deep cosmic obsidian, shimmering celestial constellation map & starlight gala',
    themeColor: '#F5D061',
    accentColor: '#FFF1B0',
    bgGradient: 'from-[#04040A] via-[#0B091C] to-[#030208]',
    cardBg: '#0F0D24',
    borderColor: '#2D2752',
    textColor: '#FFFFFF',
    subTextColor: '#AEA4C9',
    fontFamily: 'serif',
    frameShape: 'rounded',
    badgeLabel: 'CELESTIAL BLACK TIE GALA',
    koreanBadge: '미드나잇 은하수 별자리 갈라',
    heartColor: '#F5D061',
    isDarkMode: true,
    monogramText: 'L ✧ E',
    ornamentSymbol: '✨',
    quoteIntro: 'Written in the Constellations Under a Thousand Shimmering Stars',
    accentGlow: 'rgba(245, 208, 97, 0.45)'
  },
  {
    id: 'blooming-peony',
    name: 'Blooming Peony Garden',
    subtitle: '잉글리시 핑크 작약 수채화 리스 & 로즈골드',
    category: 'floral',
    headerStyle: 'floral_wreath',
    tagline: 'Lush pastel blush peonies, English garden roses, gold foil laurels & romantic vows',
    themeColor: '#D9536F',
    accentColor: '#E87D94',
    bgGradient: 'from-[#FFF0F3] via-[#FCE4E9] to-[#FAD4DC]',
    cardBg: '#FFFFFF',
    borderColor: '#F3BAC5',
    textColor: '#3A1B22',
    subTextColor: '#824E58',
    fontFamily: 'serif',
    frameShape: 'rounded',
    badgeLabel: 'ENGLISH PEONY BOTANICAL',
    koreanBadge: '잉글리시 핑크 작약 정원',
    heartColor: '#D9536F',
    isDarkMode: false,
    monogramText: 'L ❀ E',
    ornamentSymbol: '🌸',
    quoteIntro: 'Where Flowers Bloom in May, So Does Eternal Love',
    accentGlow: 'rgba(217, 83, 111, 0.25)'
  },
  {
    id: 'modern-ivory',
    name: 'Kinfolk Modernist Silk',
    subtitle: '스위스 건축 그리드 미니멀리즘 & 오트밀 리넨',
    category: 'minimal',
    headerStyle: 'minimal_polaroid',
    tagline: 'Clean Swiss typography, oatmeal linen texture, polaroid photo clips & pure modernism',
    themeColor: '#1A1A1A',
    accentColor: '#786F66',
    bgGradient: 'from-[#F5F2EB] via-[#EAE5DC] to-[#DED8CC]',
    cardBg: '#FFFFFF',
    borderColor: '#D4CEBF',
    textColor: '#1A1817',
    subTextColor: '#635D56',
    fontFamily: 'sans',
    frameShape: 'sharp',
    badgeLabel: 'SWISS ARCHITECTURAL MINIMAL',
    koreanBadge: '킨포크 스위스 아키텍처 미니멀',
    heartColor: '#1A1A1A',
    isDarkMode: false,
    monogramText: 'L / E',
    ornamentSymbol: '■',
    quoteIntro: 'Two Lives, One Minimalist Architectural Masterpiece',
    accentGlow: 'rgba(26, 26, 26, 0.15)'
  },
  {
    id: 'golden-sunset',
    name: 'Amalfi Golden Sunset Riviera',
    subtitle: '이탈리아 아말피 골든아워 & 테라코타 리비에라',
    category: 'riviera',
    headerStyle: 'golden_sunset',
    tagline: 'Warm burnt terracotta, cliffside golden hour glow, champagne aperitivo & sunset vows',
    themeColor: '#E6683B',
    accentColor: '#FFA07A',
    bgGradient: 'from-[#2B1008] via-[#451B0E] to-[#1E0904]',
    cardBg: '#210C06',
    borderColor: '#632817',
    textColor: '#FFF2EA',
    subTextColor: '#DDB6A2',
    fontFamily: 'serif',
    frameShape: 'rounded',
    badgeLabel: 'AMALFI CLIFFSIDE GOLDEN HOUR',
    koreanBadge: '아말피 골든 선셋 리비에라',
    heartColor: '#E6683B',
    isDarkMode: true,
    monogramText: 'L ☼ E',
    ornamentSymbol: '☼',
    quoteIntro: 'Sun-Drenched Love Over the Mediterranean Horizon',
    accentGlow: 'rgba(230, 104, 59, 0.4)'
  },
  {
    id: 'mediterranean-breeze',
    name: 'Santorini Aegean Breeze',
    subtitle: '그리스 산토리니 코발트블루 에게해 & 화이트 돔',
    category: 'aegean',
    headerStyle: 'aegean_resort',
    tagline: 'Deep Aegean cobalt ocean, whitewashed Cycladic arches & Greek key mosaic',
    themeColor: '#00ADB5',
    accentColor: '#70E3EA',
    bgGradient: 'from-[#08182B] via-[#0E2C4D] to-[#05111F]',
    cardBg: '#0A2038',
    borderColor: '#184777',
    textColor: '#F5FAFF',
    subTextColor: '#A0BED9',
    fontFamily: 'sans',
    frameShape: 'rounded',
    badgeLabel: 'SANTORINI CALDERA AZURE',
    koreanBadge: '산토리니 에게해 아주르 블루',
    heartColor: '#00ADB5',
    isDarkMode: true,
    monogramText: 'L ◈ E',
    ornamentSymbol: '◈',
    quoteIntro: 'High Above the Endless Cobalt Sea · Santorini',
    accentGlow: 'rgba(0, 173, 181, 0.4)'
  },
  {
    id: 'botanical-glasshouse',
    name: 'Bali Emerald Glasshouse Sanctuary',
    subtitle: '발리 열대우림 에메랄드 온실 & 빈티지 황동 프레임',
    category: 'botanical',
    headerStyle: 'botanical_glass',
    tagline: 'Deep rainforest emerald, vintage brass glasshouse conservatory & lush botanical ferns',
    themeColor: '#52B788',
    accentColor: '#95D5B2',
    bgGradient: 'from-[#06160D] via-[#0C2417] to-[#040F08]',
    cardBg: '#091C12',
    borderColor: '#194A2D',
    textColor: '#F0F9F3',
    subTextColor: '#9DC2AA',
    fontFamily: 'serif',
    frameShape: 'rounded',
    badgeLabel: 'BALI CONSERVATORY BOTANICAL',
    koreanBadge: '발리 에메랄드 온실 보태니컬',
    heartColor: '#52B788',
    isDarkMode: true,
    monogramText: 'L 🌿 E',
    ornamentSymbol: '🌿',
    quoteIntro: 'Surrounded by Sacred Greenery & Lush Tropical Eternity',
    accentGlow: 'rgba(82, 183, 136, 0.35)'
  }
];
