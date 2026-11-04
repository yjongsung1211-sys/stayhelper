/**
 * =========================================================================
 * WEDDINGHELPER 10 LUXURY MOBILE INVITATION TEMPLATES
 * =========================================================================
 * Inspired by Barunson Card (바른손카드 레터비/디얼디어) & Bojagi Card (보자기카드)
 * 10 distinctive aesthetic skins for mobile wedding invitations.
 */

export interface MobileInvitationTemplate {
  id: string;
  name: string;
  koreanName: string;
  category: 'minimal' | 'floral' | 'heritage' | 'editorial' | 'luxury' | 'classic';
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
}

export const MOBILE_INVITATION_10_TEMPLATES: MobileInvitationTemplate[] = [
  {
    id: 'modern-ivory',
    name: 'Modern Ivory Silk',
    koreanName: '바른손 레터비 모던 실크',
    category: 'minimal',
    tagline: 'Clean, understated editorial minimalism with warm ivory silk tones',
    themeColor: '#C87870',
    accentColor: '#D4AF37',
    bgGradient: 'from-[#FFFDFB] via-[#FAF6F2] to-[#FFFDFB]',
    cardBg: '#FFFFFF',
    borderColor: '#EBDCD3',
    textColor: '#1F181B',
    subTextColor: '#7C6E6D',
    fontFamily: 'serif',
    frameShape: 'rounded',
    badgeLabel: 'MODERN MINIMAL',
    heartColor: '#C87870'
  },
  {
    id: 'blooming-peony',
    name: 'Blooming Peony Garden',
    koreanName: '보자기 플로럴 피오니 가든',
    category: 'floral',
    tagline: 'Lush pastel blush peonies, English garden roses & romantic rose-gold',
    themeColor: '#D9756C',
    accentColor: '#E8A598',
    bgGradient: 'from-[#FFF9F8] via-[#FDF2F0] to-[#FFF5F3]',
    cardBg: '#FFFDFD',
    borderColor: '#F3D8D4',
    textColor: '#2E1A1D',
    subTextColor: '#8C676A',
    fontFamily: 'serif',
    frameShape: 'rounded',
    badgeLabel: 'FLORAL ROMANCE',
    heartColor: '#D9756C'
  },
  {
    id: 'royal-heritage',
    name: 'Royal Korean Heritage',
    koreanName: '바른손 궁중 자수 & 노리개',
    category: 'heritage',
    tagline: 'Traditional Joseon royal court motifs, 24K gold foil & celadon jade elegance',
    themeColor: '#8C6D1F',
    accentColor: '#C49746',
    bgGradient: 'from-[#FAF6EE] via-[#F4ECE0] to-[#FAF6EE]',
    cardBg: '#FFFDF9',
    borderColor: '#E2D1BC',
    textColor: '#261E16',
    subTextColor: '#736150',
    fontFamily: 'serif',
    frameShape: 'classic',
    badgeLabel: 'ROYAL HERITAGE',
    heartColor: '#8C6D1F'
  },
  {
    id: 'vogue-editorial',
    name: 'Vogue Haute Editorial',
    koreanName: '디얼디어 시네마틱 매거진',
    category: 'editorial',
    tagline: 'High-fashion editorial layout, bold typographic masthead & black-tie chic',
    themeColor: '#1A1517',
    accentColor: '#9E6F28',
    bgGradient: 'from-[#F8F7F6] via-[#F2EFEA] to-[#F8F7F6]',
    cardBg: '#FFFFFF',
    borderColor: '#DED8D2',
    textColor: '#110D0F',
    subTextColor: '#635956',
    fontFamily: 'serif',
    frameShape: 'sharp',
    badgeLabel: 'EDITORIAL VOGUE',
    heartColor: '#1A1517'
  },
  {
    id: 'golden-sunset',
    name: 'Golden Sunset Glow',
    koreanName: '보자기 골든 선셋 앰비언스',
    category: 'luxury',
    tagline: 'Warm terracotta twilight, champagne candlelight & golden hour glow',
    themeColor: '#B85E55',
    accentColor: '#E09267',
    bgGradient: 'from-[#FFF8F3] via-[#FAF0E6] to-[#FFF6EE]',
    cardBg: '#FFFAF5',
    borderColor: '#ECD8C7',
    textColor: '#291811',
    subTextColor: '#826555',
    fontFamily: 'serif',
    frameShape: 'rounded',
    badgeLabel: 'GOLDEN HOUR',
    heartColor: '#B85E55'
  },
  {
    id: 'cathedral-arch',
    name: 'Sacred Cathedral Arch',
    koreanName: '바른손 클래식 캐서드럴 아치',
    category: 'classic',
    tagline: 'Curved cathedral gothic arch frames, gold filigree & sacred chapel vows',
    themeColor: '#9C7A3C',
    accentColor: '#D8B86D',
    bgGradient: 'from-[#FAF8F5] via-[#F5EFE6] to-[#FAF8F5]',
    cardBg: '#FFFDF9',
    borderColor: '#E6D7C3',
    textColor: '#241D14',
    subTextColor: '#706250',
    fontFamily: 'serif',
    frameShape: 'arch',
    badgeLabel: 'SACRED CHAPEL',
    heartColor: '#9C7A3C'
  },
  {
    id: 'vintage-monogram',
    name: 'Vintage Wax Seal Monogram',
    koreanName: '보자기 앤틱 실링왁스 모노그램',
    category: 'classic',
    tagline: 'Hand-pressed sealing wax stamp, antique parchment grain & cursive vows',
    themeColor: '#8A4A42',
    accentColor: '#C27B72',
    bgGradient: 'from-[#FDF7F4] via-[#F7EDE7] to-[#FDF7F4]',
    cardBg: '#FFF9F5',
    borderColor: '#EAD5CB',
    textColor: '#291614',
    subTextColor: '#785A56',
    fontFamily: 'serif',
    frameShape: 'classic',
    badgeLabel: 'VINTAGE SEAL',
    heartColor: '#8A4A42'
  },
  {
    id: 'midnight-celestial',
    name: 'Midnight Celestial Starlight',
    koreanName: '바른손 미드나잇 스타 나이트',
    category: 'luxury',
    tagline: 'Deep obsidian twilight, shimmering golden stardust & constellation gala',
    themeColor: '#D4AF37',
    accentColor: '#F3E5AB',
    bgGradient: 'from-[#14121A] via-[#1C1826] to-[#121017]',
    cardBg: '#1E1929',
    borderColor: '#3B334D',
    textColor: '#F8F6FA',
    subTextColor: '#B3A8C7',
    fontFamily: 'serif',
    frameShape: 'rounded',
    badgeLabel: 'CELESTIAL GALA',
    heartColor: '#D4AF37'
  },
  {
    id: 'mediterranean-breeze',
    name: 'Mediterranean Blue Breeze',
    koreanName: '보자기 에게해 코발트 브리즈',
    category: 'luxury',
    tagline: 'Cobalt Aegean ocean, whitewashed Cycladic arches & fresh olive branches',
    themeColor: '#28587B',
    accentColor: '#639FAB',
    bgGradient: 'from-[#F4F9FD] via-[#EBF3FA] to-[#F4F9FD]',
    cardBg: '#FFFFFF',
    borderColor: '#D4E4F2',
    textColor: '#0E2433',
    subTextColor: '#54728A',
    fontFamily: 'sans',
    frameShape: 'rounded',
    badgeLabel: 'AEGEAN BREEZE',
    heartColor: '#28587B'
  },
  {
    id: 'botanical-glasshouse',
    name: 'Botanical Glasshouse Sanctuary',
    koreanName: '바른손 유칼립투스 온실 가든',
    category: 'floral',
    tagline: 'Fresh silver-dollar eucalyptus, frosted glass cards & organic garden bliss',
    themeColor: '#4A6B53',
    accentColor: '#8FA895',
    bgGradient: 'from-[#F5F8F6] via-[#EDF3EF] to-[#F5F8F6]',
    cardBg: '#FDFFFE',
    borderColor: '#D6E4DB',
    textColor: '#1A291E',
    subTextColor: '#5E7866',
    fontFamily: 'serif',
    frameShape: 'rounded',
    badgeLabel: 'BOTANICAL GLASSHOUSE',
    heartColor: '#4A6B53'
  }
];
