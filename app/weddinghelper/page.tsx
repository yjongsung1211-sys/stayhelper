'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, Sparkles, Upload, ArrowRight, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, Gem, Calendar,
  Share2, Download, RefreshCw, X, ExternalLink, Music2, Flower2,
  Phone, MessageCircle, Copy, ChevronDown, ChevronUp, Volume2, VolumeX, Clock, CreditCard,
  Edit3, Music, Camera, Check, Eye, SlidersHorizontal
} from 'lucide-react';
import { WEDDING_12_PRESETS, WeddingThemePreset, WeddingProduct } from '@/lib/wedding-presets';
import { MOBILE_INVITATION_10_TEMPLATES, MobileInvitationTemplate } from '@/lib/mobile-invitation-templates';

// 5 Curated BGM Soundtracks for Mobile Invitation
const BGM_PLAYLIST = [
  { id: 'piano-canon', title: 'Romantic Piano (Canon in D)', mood: 'Classic & Elegant', icon: '🎹' },
  { id: 'acoustic-love', title: 'Sweet Acoustic (A Thousand Years)', mood: 'Warm & Emotional', icon: '🎸' },
  { id: 'orchestra-royal', title: 'Majestic Royal Symphony', mood: 'Grand & Noble', icon: '🎻' },
  { id: 'jazz-waltz', title: 'Gentle Jazz Romance (She)', mood: 'Chic & Cozy', icon: '🎷' },
  { id: 'silent', title: 'No Music (무음 모드)', mood: 'Silent Reading', icon: '🔇' },
];

// 5 Curated Luxury English Invitation Letter Presets (미국 명품 감성 5대 영문 모시는 글)
const INVITATION_MESSAGE_PRESETS = [
  {
    title: 'Classic & Elegant',
    badge: 'Timeless',
    text: `Together with our families,\nwe joyfully invite you to celebrate our marriage.\nAs we exchange our sacred vows,\nyour love and blessing would mean the world to us.`
  },
  {
    title: 'Romantic & Poetic',
    badge: 'Emotional',
    text: `Two lives, two hearts, joined in friendship,\nunited forever in love.\nPlease join us under the stars\nas we celebrate the most breathtaking day of our lives.`
  },
  {
    title: 'Modern & Joyful',
    badge: 'Chic Party',
    text: `We’ve decided on forever!\nWith full hearts, laughter, and champagne,\nwe invite you to join us for an unforgettable evening\nof vows, exquisite dining, and dancing.`
  },
  {
    title: 'Intimate & Sincere',
    badge: 'Heartfelt',
    text: `Because you have enriched our lives\nwith your warmth, love, and friendship,\nwe would be deeply honored to have you beside us\nas we begin our new life as husband and wife.`
  },
  {
    title: 'Sanctuary Destination',
    badge: 'Extraordinary',
    text: `Surrounded by sacred beauty and the ones we cherish most,\nwe invite you to witness our union\nand celebrate an extraordinary weekend of love and timeless memories.`
  }
];

export default function WeddingHelperPage() {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('bali-jungle');
  const [filterCategory, setFilterCategory] = useState<'all' | 'western' | 'heritage' | 'global_killer'>('all');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; isVip: boolean; plan?: 'single' | 'trio' | 'grand' } | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'trio' | 'grand'>('grand');

  // Groom & Bride Precision Height and Weight Proportions
  const [groomHeight, setGroomHeight] = useState<string>('180');
  const [groomWeight, setGroomWeight] = useState<string>('75');
  const [brideHeight, setBrideHeight] = useState<string>('165');
  const [brideWeight, setBrideWeight] = useState<string>('50');

  // Bojagi Card & Barunson 10 Luxury Mobile Invitation States
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('blooming-peony');
  const [activeAccountTab, setActiveAccountTab] = useState<'groom' | 'bride' | null>('groom');
  const [activeGalleryPhoto, setActiveGalleryPhoto] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [mealChoice, setMealChoice] = useState<'dinner' | 'ceremony_only'>('dinner');
  const [rsvpStatus, setRsvpStatus] = useState<string>('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState<boolean>(false);
  const [rsvpName, setRsvpName] = useState<string>('');
  const [copyToast, setCopyToast] = useState<string>('');
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(true);
  const [invitationEditorTab, setInvitationEditorTab] = useState<'couple' | 'datetime_venue' | 'media_bgm' | 'letter'>('letter');
  const [invitationViewMode, setInvitationViewMode] = useState<'both' | 'editor' | 'preview'>('both');
  const [uploadTargetIndex, setUploadTargetIndex] = useState<number | 'cover'>('cover');

  // Guestbook list (Bojagi Card format)
  const [guestbookList, setGuestbookList] = useState<Array<{ id: number; name: string; message: string; date: string }>>([
    { id: 1, name: '고영수 & 황성순 (혼주)', message: '사랑하는 우리 아들 지현아, 두 사람이 함께 걸어갈 앞날에 항상 축복과 행복만이 가득하길 바란다. 사랑한다.', date: '2026.11.01' },
    { id: 2, name: '정성현 & 김선자 (혼주)', message: '예쁜 우리 딸 세영아, 서로 아끼고 배려하며 세상에서 가장 따뜻하고 아름다운 가정을 만들어가렴.', date: '2026.11.02' },
    { id: 3, name: '친구 일동 (Friends)', message: '지현아 세영아 드디어 결혼하는구나! 진심으로 축하해! 가장 눈부시고 행복한 날 되길! 💍✨', date: '2026.11.03' }
  ]);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestMsg, setNewGuestMsg] = useState('');

  // Comprehensive Customer Editable Invitation State (신랑신부, 일시, 장소, 사진, 노래, 계좌 실시간 편집)
  const [invitationData, setInvitationData] = useState({
    groomName: '고지현',
    groomPhone: '010-3849-2810',
    groomFather: '고영수',
    groomMother: '황성순',
    groomRelation: '장남',
    groomParentPhone: '010-2918-3819',
    groomBank: '국민은행',
    groomAccount: '123-456-789012',
    groomHolder: '고지현',
    groomKakaoPay: 'https://qr.kakaopay.com',

    brideName: '정세영',
    bridePhone: '010-9182-4729',
    brideFather: '정성현',
    brideMother: '김선자',
    brideRelation: '장녀',
    brideParentPhone: '010-5819-2849',
    brideBank: '신한은행',
    brideAccount: '987-654-321098',
    brideHolder: '정세영',
    brideKakaoPay: 'https://qr.kakaopay.com',

    weddingDate: '2026. 11. 08 SUN',
    weddingTime: '낮 10:50',
    weddingDayNum: 8,
    venueName: '전주 아름다운컨벤션센터',
    venueHall: '2층 컨벤션홀',
    venueAddress: '전북특별자치도 전주시 덕진구 온고을로 291',
    venueTraffic: '호남고속도로 전주IC 10분, 전주역 셔틀버스 15분 간격 운행',
    venueParking: '본관 지하 1~3층 및 야외 주차장 1,000대 무료 주차',
    welcomeMessage: `Together with our families,\nwe joyfully invite you to celebrate our marriage.\nAs we exchange our sacred vows,\nyour love and blessing would mean the world to us.`,
    
    bgmId: 'piano-canon',
    bgmTitle: 'Romantic Piano (Canon in D)',
    coverPhoto: '/images/weddings/bali-jungle.jpg',
    galleryPhotos: [
      '/images/weddings/bali-jungle.jpg',
      '/images/weddings/amalfi-cliff.jpg',
      '/images/weddings/lake-como.jpg',
      '/images/weddings/paris-palace.jpg',
      '/images/weddings/nyc-terrace.jpg',
      '/images/weddings/santorini-caldera.jpg',
    ]
  });

  const [visualizedResult, setVisualizedResult] = useState<{
    imageUrl: string;
    theme: WeddingThemePreset;
    products: WeddingProduct[];
    venueBookingUrl: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoUploadInputRef = useRef<HTMLInputElement>(null);

  const currentTheme = WEDDING_12_PRESETS[selectedThemeId] || WEDDING_12_PRESETS['bali-jungle'];

  // Category filtering
  const themeList = Object.values(WEDDING_12_PRESETS).filter(t => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  // Photo upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mobile Invitation Custom Photo Upload Handler (Cover or Gallery)
  const handleInvitationPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (uploadTargetIndex === 'cover') {
          setInvitationData(prev => ({ ...prev, coverPhoto: resultUrl }));
        } else if (typeof uploadTargetIndex === 'number') {
          setInvitationData(prev => {
            const nextPhotos = [...prev.galleryPhotos];
            nextPhotos[uploadTargetIndex] = resultUrl;
            return { ...prev, galleryPhotos: nextPhotos };
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Wedding Visualization execution
  const handleGenerateWedding = async () => {
    if (!uploadedImage) {
      fileInputRef.current?.click();
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Preserving your loving glances & smiles...');

    try {
      setTimeout(() => setGenerationStep(`Blossoming thousands of fresh floral arches at ${currentTheme.venueName}...`), 1400);
      setTimeout(() => setGenerationStep(`Weaving haute couture silk gown & romantic candlelight...`), 2800);

      const res = await fetch('/api/weddinghelper/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          themeId: selectedThemeId,
          groomHeight,
          groomWeight,
          brideHeight,
          brideWeight,
        })
      });

      const data = await res.json();
      if (data.success) {
        setVisualizedResult({
          imageUrl: data.visualizedImageUrl,
          theme: currentTheme,
          products: data.products,
          venueBookingUrl: data.venueBookingUrl,
        });
      } else {
        alert(data.error || 'Failed to visualize wedding.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDFC] text-[#2C2426] font-serif antialiased selection:bg-[#E8A598]/30 relative overflow-hidden">
      {/* 🌸 Floating Romantic Petals Overlay & Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Breathing Ambient Lights */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1300px] h-[750px] bg-gradient-to-b from-[#FCEBE7]/80 via-[#FFF1E0]/50 to-transparent blur-[140px]" />
        <div className="absolute top-[28%] -right-48 w-[700px] h-[700px] bg-gradient-to-br from-[#FEE5DF]/60 via-[#FFF7ED]/40 to-transparent blur-[150px]" />
        <div className="absolute top-[60%] -left-48 w-[800px] h-[800px] bg-gradient-to-tr from-[#FCEBE7]/60 via-[#FFF3E8]/40 to-transparent blur-[160px]" />

        {/* Gentle Rose Petal Silhouettes */}
        <div className="absolute top-[12%] left-[8%] text-[#E8A598]/30 animate-pulse text-2xl">🌸</div>
        <div className="absolute top-[22%] right-[10%] text-[#D4AF37]/30 animate-bounce duration-1000 text-xl">✨</div>
        <div className="absolute top-[45%] left-[5%] text-[#E8A598]/25 text-3xl">🪷</div>
        <div className="absolute top-[70%] right-[7%] text-[#E8A598]/30 animate-pulse text-2xl">🌸</div>
      </div>

      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#FFFDFC]/85 backdrop-blur-xl border-b border-[#F4EBE3] shadow-[0_4px_30px_rgba(200,130,117,0.06)] font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/weddinghelper" className="flex items-center gap-3 group">
              <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E8A598] via-[#F3E5AB] to-[#D4AF37] flex items-center justify-center text-white font-serif font-bold text-base shadow-[0_4px_16px_rgba(232,165,152,0.45)] group-hover:scale-105 transition">
                W
              </span>
              <div>
                <span className="text-xl font-serif tracking-[0.22em] text-[#1E1719] font-normal block leading-none">
                  WEDDING<span className="text-[#C87870] font-medium">HELPER</span>
                </span>
                <span className="text-[9px] tracking-[0.35em] text-[#9E8B88] uppercase block mt-1 font-medium font-sans">
                  Where Forever Begins • Curated Luxury
                </span>
              </div>
            </Link>

            {/* Helper Ecosystem Switcher */}
            <nav className="hidden lg:flex items-center gap-4 text-xs tracking-wider text-[#8A7977] border-l border-[#EDE3DC] pl-6 font-medium">
              <Link href="/stayhelper" className="hover:text-[#C87870] transition">StayHelper (Venues)</Link>
              <span className="text-[#E0D2CB]">/</span>
              <Link href="/" className="hover:text-[#C87870] transition">StylingHelper (Fashion)</Link>
              <span className="text-[#E0D2CB]">/</span>
              <a href="https://roomhelper.vercel.app" target="_blank" rel="noreferrer" className="hover:text-[#C87870] transition">RoomHelper (Home)</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (user?.plan === 'grand') {
                  setIsInvitationOpen(true);
                } else {
                  setSelectedPlan('grand');
                  setIsCheckoutOpen(true);
                }
              }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border border-[#E8DCD4] text-[#8C6D1F] hover:bg-[#FAF3EF] hover:border-[#D4AF37] transition flex items-center gap-1.5 bg-white shadow-sm"
            >
              {user?.plan === 'grand' ? (
                <>
                  <Flower2 className="w-3.5 h-3.5 text-[#C87870]" />
                  <span>Mobile Invitation (VIP)</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF0E6] text-[#B85E55] font-bold">🔒 $79 VIP</span>
                  <span>Mobile Invitation</span>
                </>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-[#FAF3EF] border border-[#E8DCD4] text-xs font-semibold text-[#8C6D1F] flex items-center gap-1.5">
                  <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {user.isVip ? 'Royal VIP' : 'Member'}
                </span>
                <button 
                  onClick={() => setUser(null)}
                  className="text-xs text-[#8A7977] hover:text-[#C87870] underline ml-1"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full border border-[#D8C7BD] text-[#4A3B39] hover:bg-[#FAF3EF] hover:border-[#C87870] transition bg-white shadow-sm"
              >
                Log In
              </button>
            )}

            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-[#C87870] via-[#D89BA6] to-[#C87870] text-white hover:opacity-95 transition shadow-[0_4px_18px_rgba(200,120,112,0.35)] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{user?.isVip ? 'VIP Active' : 'Get VIP Pass'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Romantic Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        {/* Poetic Ribbon Badge */}
        <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-[#E8A598]/60 bg-white/90 text-[#B85E55] text-xs font-serif italic tracking-wider mb-8 shadow-[0_4px_20px_rgba(232,165,152,0.2)]">
          <Flower2 className="w-4 h-4 text-[#C87870]" />
          <span>A Love Story Written in Fragrant Blooms & Eternal Vows</span>
          <span className="text-[#D4AF37]">✦</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-[#1F181B] tracking-tight max-w-5xl mx-auto leading-[1.18]">
          Two Hearts, One Eternal Glance <br />
          <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#B85E55] via-[#C58968] to-[#9E6F28]">
            Amidst a Million Blooming Florals
          </span>
        </h1>

        <p className="mt-7 text-base sm:text-lg text-[#6E5D5C] max-w-2xl mx-auto font-light leading-relaxed font-sans">
          Upload just one candid photo of the one you love. Our AI preserves your real loving expressions while weaving an unforgettable editorial masterpiece inside the world&apos;s most breathtaking sanctuary chapels.
        </p>

        {/* Romantic Upload Altar Box (Grand Scale) */}
        <div className="mt-12 max-w-3xl mx-auto p-8 sm:p-12 rounded-[42px] bg-white/95 border border-[#F2E5DC] shadow-[0_35px_90px_rgba(200,120,112,0.15)] backdrop-blur-md relative font-sans">
          {/* Subtle Golden Floral Corner Accents */}
          <div className="absolute top-6 left-6 text-[#D4AF37]/50 text-sm">❦</div>
          <div className="absolute top-6 right-6 text-[#D4AF37]/50 text-sm">❦</div>
          <div className="absolute bottom-6 left-6 text-[#D4AF37]/50 text-sm">❦</div>
          <div className="absolute bottom-6 right-6 text-[#D4AF37]/50 text-sm">❦</div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {!uploadedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#EBDCD3] hover:border-[#C87870] rounded-[32px] p-12 sm:p-16 cursor-pointer transition duration-300 text-center group bg-[#FFFDFB]"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#FCEBE7] to-[#FFF4E8] group-hover:scale-110 flex items-center justify-center text-[#B85E55] transition shadow-inner">
                <Heart className="w-10 h-10 fill-[#C87870]/20 stroke-[#C87870]" />
              </div>
              <h4 className="mt-6 text-xl sm:text-2xl font-serif text-[#1F181B] tracking-wide">
                Drop your couple photograph here, or <span className="text-[#C87870] underline font-medium">choose from album</span>
              </h4>
              <p className="mt-3 text-sm text-[#8C7A78] max-w-md mx-auto">
                JPG, PNG, HEIC up to 20MB. A warm candid selfie or vacation portrait where both faces are clearly smiling.
              </p>
            </div>
          ) : (
            <div className="relative rounded-[32px] overflow-hidden bg-white border border-[#E8DCD4] shadow-md">
              <div className="relative h-80 sm:h-96 w-full">
                <Image 
                  src={uploadedImage} 
                  alt="Couple preview" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-5 bg-[#FAF5F1] flex items-center justify-between text-sm">
                <span className="text-[#5C4D4D] font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C87870]" /> Your Love Story is Ready
                </span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#C87870] font-bold hover:underline"
                >
                  Choose Another Photo
                </button>
              </div>
            </div>
          )}

          {/* Precision Couple Height & Weight Proportions */}
          <div className="mt-7 pt-6 border-t border-[#F2E5DC] text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B85E55] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Tailored Body Proportions & Fit
              </span>
              <span className="text-[11px] text-[#9E8B88]">
                Exact 1:1 Silhouette Matching
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Groom Proportions */}
              <div className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#EBDCD3] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F181B] flex items-center gap-1.5">
                    🤵 Groom Silhouette
                  </span>
                  <span className="text-[10px] text-[#A89895] uppercase">Tuxedo Proportions</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-[#8C7A78] block mb-1 font-medium">Height (cm)</label>
                    <input 
                      type="number"
                      value={groomHeight}
                      onChange={e => setGroomHeight(e.target.value)}
                      placeholder="180"
                      className="w-full py-2 px-3 rounded-xl border border-[#E0D2CB] text-xs font-semibold text-[#1F181B] focus:outline-none focus:border-[#C87870] bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8C7A78] block mb-1 font-medium">Weight (kg)</label>
                    <input 
                      type="number"
                      value={groomWeight}
                      onChange={e => setGroomWeight(e.target.value)}
                      placeholder="75"
                      className="w-full py-2 px-3 rounded-xl border border-[#E0D2CB] text-xs font-semibold text-[#1F181B] focus:outline-none focus:border-[#C87870] bg-white text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Bride Proportions */}
              <div className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#EBDCD3] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F181B] flex items-center gap-1.5">
                    👰 Bride Silhouette
                  </span>
                  <span className="text-[10px] text-[#A89895] uppercase">Couture Gown Fit</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-[#8C7A78] block mb-1 font-medium">Height (cm)</label>
                    <input 
                      type="number"
                      value={brideHeight}
                      onChange={e => setBrideHeight(e.target.value)}
                      placeholder="165"
                      className="w-full py-2 px-3 rounded-xl border border-[#E0D2CB] text-xs font-semibold text-[#1F181B] focus:outline-none focus:border-[#C87870] bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8C7A78] block mb-1 font-medium">Weight (kg)</label>
                    <input 
                      type="number"
                      value={brideWeight}
                      onChange={e => setBrideWeight(e.target.value)}
                      placeholder="50"
                      className="w-full py-2 px-3 rounded-xl border border-[#E0D2CB] text-xs font-semibold text-[#1F181B] focus:outline-none focus:border-[#C87870] bg-white text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Large Grand Button with Heart Pulse */}
          <button
            onClick={handleGenerateWedding}
            disabled={isGenerating}
            className={`mt-8 w-full py-5 sm:py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm sm:text-base flex items-center justify-center gap-3 transition shadow-xl ${
              isGenerating 
                ? 'bg-[#EAE2DC] text-[#9A8A87] cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#B85E55] via-[#C58968] to-[#9E6F28] text-white hover:opacity-95 shadow-[0_12px_40px_rgba(184,94,85,0.45)]'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span className="font-serif italic capitalize text-base">{generationStep}</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white" />
                <span>Step Into {currentTheme.title}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="mt-5 flex items-center justify-center gap-5 text-xs text-[#8C7A78]">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#C87870]" /> 100% Free 1st Masterpiece</span>
            <span>•</span>
            <span>No Studio Booking Needed</span>
            <span>•</span>
            <span>Zero Dead Links</span>
          </div>
        </div>
      </section>

      {/* 3. The Grand 12 Cathedral Arch Worlds */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F2E5DC] z-10 relative">
        <div className="mb-12 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-sans font-bold tracking-[0.3em] text-[#C87870] uppercase block mb-2">
                Curated Sanctuary Chapels & Sanctuaries
              </span>
              <h2 className="text-3xl sm:text-5xl font-light text-[#1F181B]">
                The Grand 12 Sacred Wedding Worlds
              </h2>
            </div>
            <p className="text-xs font-sans text-[#8C7A78] max-w-sm">
              Explore 12 iconic wedding destinations with 1:1 tailored attire, authentic venue chapels, and real florist styling.
            </p>
          </div>

          {/* Category Tabs - Fully Visible Responsive Wrap (Never Cut Off) */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 pb-4 border-b border-[#F2E5DC] font-sans">
            {[
              { key: 'all', label: 'All 12 Worlds' },
              { key: 'western', label: 'Classic European & Resort (5)' },
              { key: 'heritage', label: 'Royal Heritage (3)' },
              { key: 'global_killer', label: 'Exotic & Winter (4)' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterCategory(tab.key as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition ${
                  filterCategory === tab.key 
                    ? 'bg-[#C87870] text-white font-bold shadow-[0_4px_14px_rgba(200,120,112,0.3)]' 
                    : 'bg-white border border-[#EBDCD3] text-[#7C6E6D] hover:text-[#1F181B] hover:border-[#C87870]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 12 Cathedral Arch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {themeList.map(theme => {
            const isSelected = selectedThemeId === theme.id;
            return (
              <div 
                key={theme.id}
                onClick={() => setSelectedThemeId(theme.id)}
                className={`group relative rounded-t-[90px] rounded-b-[32px] overflow-hidden bg-white border transition duration-500 cursor-pointer flex flex-col ${
                  isSelected 
                    ? 'border-[#C87870] shadow-[0_20px_50px_rgba(200,120,112,0.25)] ring-2 ring-[#C87870]' 
                    : 'border-[#F2E5DC] hover:border-[#DEB9B3] shadow-sm hover:shadow-xl'
                }`}
              >
                {/* Cathedral Arch Image Box */}
                <div className="relative h-72 w-full overflow-hidden bg-[#FAF3EF]">
                  <Image 
                    src={theme.heroImage} 
                    alt={theme.title} 
                    fill 
                    unoptimized
                    priority={theme.number <= 6}
                    className="object-cover group-hover:scale-108 transition duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="px-4 py-1.5 rounded-full text-[11px] font-sans font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-[#B85E55] border border-[#E8A598]/50 shadow-md">
                      {theme.badge}
                    </span>
                    <span className="px-2.5 py-1.5 rounded-full text-[10px] font-sans font-semibold tracking-wider uppercase bg-black/40 backdrop-blur-md text-white">
                      #{theme.number}
                    </span>
                  </div>

                  {/* Destination Tag */}
                  <div className="absolute bottom-4 left-6 flex items-center gap-1.5 text-xs text-white font-sans font-medium drop-shadow-lg">
                    <MapPin className="w-3.5 h-3.5 text-[#F3E5AB]" />
                    <span>{theme.destination}</span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl text-[#1F181B] font-normal group-hover:text-[#B85E55] transition">
                      {theme.title}
                    </h3>
                    <p className="text-xs text-[#B85E55] mt-1.5 italic font-medium">
                      Sanctuary: {theme.venueName}
                    </p>
                    <p className="text-xs font-sans text-[#7C6E6D] mt-3.5 line-clamp-2 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  {/* Attire preview */}
                  <div className="mt-6 pt-5 border-t border-[#F7EFE9] space-y-3 text-xs font-sans leading-relaxed">
                    <div className="text-[#6E5E5D] break-words">
                      <span className="text-[#1F181B] font-semibold">Gown:</span> {theme.brideAttire}
                    </div>
                    <div className="text-[#6E5E5D] break-words">
                      <span className="text-[#1F181B] font-semibold">Tuxedo:</span> {theme.groomAttire}
                    </div>
                  </div>

                  {/* Action Selection & Studio Inclusion */}
                  <div className="mt-7 flex flex-col gap-2">
                    <button 
                      className={`w-full py-3.5 rounded-2xl text-xs font-sans font-bold uppercase tracking-wider transition ${
                        isSelected
                          ? 'bg-[#C87870] text-white shadow-md'
                          : 'bg-[#FAF5F1] text-[#7C6E6D] group-hover:text-[#1F181B] group-hover:bg-[#F3E8E1]'
                      }`}
                    >
                      {isSelected ? '✓ Selected Sanctuary' : 'Select This World'}
                    </button>
                    <div className="py-1 text-center flex items-center justify-center gap-1.5 text-[11px] font-sans text-[#8C7A78]">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>20 Bespoke AI Editorial Angles Included</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Haute Studio Reassurance Banner (Zero Prompt Leak) */}
        <div className="mt-16 p-8 sm:p-12 rounded-[40px] bg-gradient-to-r from-[#FAF5F1] via-[#FFF9F6] to-[#FAF3EF] border border-[#E8DCD4] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D4AF37]/30 text-[#8C6D1F] text-[10px] font-sans font-bold tracking-widest uppercase shadow-xs mb-3">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Proprietary 8K AI Haute Studio Engine</span>
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#1F181B] font-light">
              Bespoke 20-Angle Haute Wedding Collection
            </h3>
            <p className="text-xs font-sans text-[#7C6E6D] mt-2.5 leading-relaxed">
              Every ceremonial render automatically synthesizes 20 distinct cinematic vantage points — wide architectural panoramic shots, emotional vow close-ups, candlelit receptions, and intimate sunset silhouettes — precision-tailored to your exact groom & bride proportions.
            </p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
            className="px-8 py-4 rounded-full bg-[#1F181B] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#C87870] transition shadow-md flex items-center gap-2.5 whitespace-nowrap"
          >
            <span>Create Your Dream Wedding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Visualized Masterpiece Modal */}
      {visualizedResult && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative max-w-4xl w-full bg-white border border-[#E8DCD4] rounded-[36px] overflow-hidden shadow-2xl my-8">
            {/* Close Button */}
            <button 
              onClick={() => setVisualizedResult(null)}
              className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition border border-white/30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Visualizer Hero Image */}
            <div className="relative h-[500px] sm:h-[600px] w-full bg-[#FAF5F1]">
              <Image 
                src={visualizedResult.imageUrl} 
                alt="Visualized Wedding" 
                fill 
                className="object-contain"
              />

              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest bg-white/95 backdrop-blur-md text-[#B85E55] border border-[#E8A598]/50 flex items-center gap-2 shadow-lg">
                  <Flower2 className="w-4 h-4 text-[#C87870]" />
                  {visualizedResult.theme.title}
                </span>
              </div>
            </div>

            {/* Bottom Panel */}
            <div className="p-7 sm:p-10 space-y-7 bg-white font-sans">
              <div>
                <h3 className="text-3xl sm:text-4xl font-serif text-[#1F181B] font-light">
                  Your Sacred Vows at {visualizedResult.theme.venueName}
                </h3>
                <p className="text-sm text-[#9E8B88] mt-1.5 font-serif italic">
                  {visualizedResult.theme.destination} • 100% Photorealistic Editorial with Grand Blooming Florals
                </p>
              </div>

              {/* 100% In-Stock Wearable Products */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#B85E55] flex items-center gap-2">
                  <Gem className="w-3.5 h-3.5" />
                  Shop the Wearable Attire (100% Live In-Stock Guarantee)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {visualizedResult.products.map(prod => (
                    <a
                      key={prod.id}
                      href={prod.buyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#F2E5DC] hover:border-[#C87870] flex items-center justify-between group transition shadow-sm hover:shadow-md"
                    >
                      <div>
                        <span className="text-[10px] tracking-wider uppercase text-[#9E8B88] block font-medium">
                          {prod.brand} • {prod.type}
                        </span>
                        <span className="text-xs font-semibold text-[#1F181B] group-hover:text-[#B85E55] transition line-clamp-1">
                          {prod.name}
                        </span>
                        <span className="text-xs text-[#9E6F28] font-bold mt-1 block">
                          ${prod.price.toLocaleString()} USD
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#B5A5A2] group-hover:text-[#B85E55] transition" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Venue Booking & Consultation */}
              <div className="pt-5 border-t border-[#F2E5DC] flex flex-col sm:flex-row items-center justify-between gap-5">
                <div>
                  <span className="text-xs text-[#9E8B88] block">Sanctuary Venue Buyout & Packages:</span>
                  <span className="text-sm font-semibold text-[#1F181B]">
                    3~5 Days Private Sanctuary Takeover Available
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (user?.plan === 'grand') {
                        setIsInvitationOpen(true);
                      } else {
                        setSelectedPlan('grand');
                        setIsCheckoutOpen(true);
                      }
                    }}
                    className="flex-1 sm:flex-none px-6 py-4 rounded-full border-2 border-[#C87870] bg-white text-[#C87870] font-bold uppercase tracking-wider text-xs hover:bg-[#FAF3EF] transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    {user?.plan === 'grand' ? (
                      <>
                        <Flower2 className="w-4 h-4 text-[#C87870]" />
                        <span>Open Mobile Invitation (VIP)</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF0E6] text-[#B85E55] font-bold">🔒 $79 VIP</span>
                        <span>Create Mobile Invitation</span>
                      </>
                    )}
                  </button>

                  <a
                    href={visualizedResult.venueBookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-7 py-4 rounded-full bg-gradient-to-r from-[#B85E55] to-[#9E6F28] text-white font-bold uppercase tracking-wider text-xs hover:opacity-95 transition flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(184,94,85,0.35)]"
                  >
                    <span>Reserve Private Sanctuary Venue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Mobile Wedding Invitation Kit Modal (Gated for $79 The Grand 12 VIP Pass) */}
      {isInvitationOpen && (() => {
        const isUnlocked = user?.plan === 'grand';
        const currentSkin = MOBILE_INVITATION_10_TEMPLATES.find(t => t.id === selectedTemplateId) || MOBILE_INVITATION_10_TEMPLATES[0];

        // 6 gallery sample photos from wedding worlds
        const galleryPhotos = [
          '/images/weddings/bali-jungle.jpg',
          '/images/weddings/amalfi-cliff.jpg',
          '/images/weddings/lake-como.jpg',
          '/images/weddings/paris-palace.jpg',
          '/images/weddings/nyc-terrace.jpg',
          '/images/weddings/santorini-caldera.jpg',
        ];

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* If NOT Unlocked: Show VIP Gated Lock Screen with 10-Skin Showcase */}
            {!isUnlocked ? (
              <div className="relative max-w-xl w-full bg-white border border-[#E8DCD4] rounded-[40px] shadow-2xl p-6 sm:p-8 font-sans my-8 text-center">
                <button 
                  onClick={() => setIsInvitationOpen(false)}
                  className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF5F1] hover:bg-[#F2E5DC] text-[#7C6E6D] flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#C87870] to-[#9E6F28] text-white flex items-center justify-center mx-auto shadow-md mb-4">
                  <Gem className="w-7 h-7" />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B85E55] block">
                  Exclusive $79 VIP Pass Feature
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#1F181B] mt-1">
                  Mobile Wedding Invitation Kit
                </h3>
                <p className="text-xs text-[#7C6E6D] mt-2 max-w-md mx-auto leading-relaxed">
                  모바일 청첩장은 <strong>$79 The Grand 12 VIP 패스</strong> 결제 회원에게만 단독 제공되는 프리미엄 기능입니다. 바른손카드 & 보자기카드 스타일의 10대 명품 스킨과 실시간 RSVP, D-Day 캘린더를 모두 잠금 해제하세요.
                </p>

                {/* 10 Template Preview Pills */}
                <div className="mt-6 p-4 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A78] block mb-2.5">
                    ✨ Included 10 Luxury Design Templates (10대 명품 스킨 포함)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-xs">
                    {MOBILE_INVITATION_10_TEMPLATES.map((tmpl, idx) => (
                      <div key={tmpl.id} className="p-2.5 rounded-xl bg-white border border-[#E8DCD4] flex items-center justify-between">
                        <span className="font-medium text-[#1F181B]">{idx + 1}. {tmpl.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAF3EF] text-[#B85E55] font-bold">VIP</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => {
                      setIsInvitationOpen(false);
                      setSelectedPlan('grand');
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C87870] via-[#D89BA6] to-[#C87870] text-white font-bold uppercase tracking-widest text-xs hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Unlock with $79 VIP Pass (100% Unlocked)</span>
                  </button>
                </div>

                <p className="text-[10px] text-[#A89895] mt-3">
                  Includes 240 4K Masterpieces, 8K Canvas Print-Ready Lossless Files & Real Gown In-Stock Links.
                </p>
              </div>
            ) : (
              /* When Unlocked: Full Interactive Customer Editable Studio & Live Mobile Device Mockup */
              <div className="relative max-w-6xl w-full bg-[#FFFDFB] border border-[#E8DCD4] rounded-[40px] shadow-2xl overflow-hidden font-sans my-4 flex flex-col max-h-[92vh]">
                {/* Hidden File Input for Image Uploads */}
                <input
                  type="file"
                  ref={photoUploadInputRef}
                  accept="image/*"
                  onChange={handleInvitationPhotoUpload}
                  className="hidden"
                />

                {/* Studio Master Top Bar: Template Switcher & Audio/View Controls */}
                <div className="p-4 sm:p-5 bg-white/95 backdrop-blur-md border-b border-[#F0E6DE] sticky top-0 z-30 font-sans">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3.5">
                    {/* Studio Badge & Title */}
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#2E7D32] animate-pulse shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B85E55] bg-[#FAF3EF] px-2 py-0.5 rounded-full">
                            VIP Custom Studio
                          </span>
                          <span className="text-[10px] text-[#8C7A78] hidden sm:inline">
                            · Live Sync (0.1s)
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#1F181B] font-serif">
                          모바일 청첩장 맞춤 제작 & 실시간 고객 편집기
                        </h3>
                      </div>
                    </div>

                    {/* BGM Player & View Mode Switcher */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                      {/* BGM Quick Pill */}
                      <button 
                        onClick={() => setIsBgmPlaying(!isBgmPlaying)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition border ${
                          isBgmPlaying 
                            ? 'bg-[#FAF3EF] text-[#B85E55] border-[#E8A598] shadow-xs' 
                            : 'bg-white text-[#9E8B88] border-[#E8DCD4]'
                        }`}
                        title={isBgmPlaying ? 'Pause BGM' : 'Play BGM'}
                      >
                        {isBgmPlaying ? <Volume2 className="w-3.5 h-3.5 text-[#B85E55] animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span className="max-w-[130px] truncate text-[11px]">{invitationData.bgmTitle}</span>
                      </button>

                      {/* View Mode Switcher (Visible on mobile/tablet or for full focus) */}
                      <div className="flex items-center p-1 rounded-full bg-[#FAF5F1] border border-[#E8DCD4]">
                        <button
                          onClick={() => setInvitationViewMode('both')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition hidden lg:block ${
                            invitationViewMode === 'both' ? 'bg-[#1F181B] text-white' : 'text-[#7C6E6D] hover:text-[#1F181B]'
                          }`}
                        >
                          스플릿 뷰
                        </button>
                        <button
                          onClick={() => setInvitationViewMode('editor')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition flex items-center gap-1 ${
                            invitationViewMode === 'editor' ? 'bg-[#1F181B] text-white' : 'text-[#7C6E6D] hover:text-[#1F181B]'
                          }`}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>편집하기</span>
                        </button>
                        <button
                          onClick={() => setInvitationViewMode('preview')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition flex items-center gap-1 ${
                            invitationViewMode === 'preview' ? 'bg-[#1F181B] text-white' : 'text-[#7C6E6D] hover:text-[#1F181B]'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>미리보기</span>
                        </button>
                      </div>

                      {/* Close Studio Button */}
                      <button 
                        onClick={() => setIsInvitationOpen(false)}
                        className="w-8 h-8 rounded-full bg-white hover:bg-[#F2E5DC] text-[#7C6E6D] flex items-center justify-center transition border border-[#E8DCD4] shadow-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 10 Template Selector Bar (Barunson & Bojagi Luxury Skins) */}
                  <div className="pt-2 border-t border-[#F2E5DC]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A78] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        <span>10대 명품 디자인 스킨 (원클릭 스타일 변경)</span>
                      </span>
                      <span className="text-[10px] text-[#A89895]">
                        현재 적용: <strong className="text-[#B85E55]">{currentSkin.koreanName}</strong>
                      </span>
                    </div>

                    <div className="overflow-x-auto pb-1 flex items-center gap-2 scrollbar-thin">
                      {MOBILE_INVITATION_10_TEMPLATES.map((tmpl) => {
                        const isSelected = selectedTemplateId === tmpl.id;
                        return (
                          <button
                            key={tmpl.id}
                            onClick={() => setSelectedTemplateId(tmpl.id)}
                            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium transition flex items-center gap-1.5 shrink-0 border ${
                              isSelected
                                ? 'bg-[#1F181B] text-white font-bold border-[#1F181B] shadow-xs'
                                : 'bg-[#FAF5F1] text-[#7C6E6D] hover:bg-[#F0E4DC] border-transparent'
                            }`}
                          >
                            <span 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: tmpl.themeColor }}
                            />
                            <span>{tmpl.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Studio Body: Split Grid (Left: Live Editor / Right: Live Mobile Renderer) */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* LEFT COLUMN: Customer Live Editor Panel (lg:col-span-7) */}
                  {(invitationViewMode === 'both' || invitationViewMode === 'editor') && (
                    <div className={`overflow-y-auto p-5 sm:p-7 border-r border-[#EFE5DE] bg-white flex flex-col justify-between ${
                      invitationViewMode === 'editor' ? 'lg:col-span-12' : 'lg:col-span-7'
                    }`}>
                      <div>
                        {/* Editor Category Tabs */}
                        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-[#FAF5F1] border border-[#EAE0D7] mb-6">
                          <button
                            onClick={() => setInvitationEditorTab('couple')}
                            className={`py-2 rounded-xl text-xs font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                              invitationEditorTab === 'couple'
                                ? 'bg-white text-[#1F181B] shadow-xs font-bold'
                                : 'text-[#7C6E6D] hover:text-[#1F181B]'
                            }`}
                          >
                            <span>1. 신랑·신부</span>
                          </button>
                          <button
                            onClick={() => setInvitationEditorTab('datetime_venue')}
                            className={`py-2 rounded-xl text-xs font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                              invitationEditorTab === 'datetime_venue'
                                ? 'bg-white text-[#1F181B] shadow-xs font-bold'
                                : 'text-[#7C6E6D] hover:text-[#1F181B]'
                            }`}
                          >
                            <span>2. 일시·장소</span>
                          </button>
                          <button
                            onClick={() => setInvitationEditorTab('media_bgm')}
                            className={`py-2 rounded-xl text-xs font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                              invitationEditorTab === 'media_bgm'
                                ? 'bg-white text-[#1F181B] shadow-xs font-bold'
                                : 'text-[#7C6E6D] hover:text-[#1F181B]'
                            }`}
                          >
                            <span>3. 사진·노래</span>
                          </button>
                          <button
                            onClick={() => setInvitationEditorTab('letter')}
                            className={`py-2 rounded-xl text-xs font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                              invitationEditorTab === 'letter'
                                ? 'bg-white text-[#1F181B] shadow-xs font-bold'
                                : 'text-[#7C6E6D] hover:text-[#1F181B]'
                            }`}
                          >
                            <span>4. 모시는 글</span>
                          </button>
                        </div>

                        {/* TAB 1: 신랑 · 신부 & 양가 혼주 정보 */}
                        {invitationEditorTab === 'couple' && (
                          <div className="space-y-6 text-xs animate-fade-in">
                            {/* Groom Side Box */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-2">
                                <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                  <span>🤵 신랑측 정보</span>
                                </h4>
                                <span className="text-[10px] text-[#8C7A78]">신랑 및 혼주 연락처</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    신랑 성함
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.groomName}
                                    onChange={(e) => setInvitationData({ ...invitationData, groomName: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] focus:border-[#C87870] outline-none"
                                    placeholder="고지현"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    신랑 연락처 (전화걸기 연동)
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.groomPhone}
                                    onChange={(e) => setInvitationData({ ...invitationData, groomPhone: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] focus:border-[#C87870] outline-none"
                                    placeholder="010-0000-0000"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 pt-1">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    아버지 성함
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.groomFather}
                                    onChange={(e) => setInvitationData({ ...invitationData, groomFather: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                    placeholder="고영수"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    어머니 성함
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.groomMother}
                                    onChange={(e) => setInvitationData({ ...invitationData, groomMother: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                    placeholder="황성순"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    관계 (서열)
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.groomRelation}
                                    onChange={(e) => setInvitationData({ ...invitationData, groomRelation: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                    placeholder="장남"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                  혼주(신랑 부모님) 대표 전화번호
                                </label>
                                <input
                                  type="text"
                                  value={invitationData.groomParentPhone}
                                  onChange={(e) => setInvitationData({ ...invitationData, groomParentPhone: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                  placeholder="010-0000-0000"
                                />
                              </div>
                            </div>

                            {/* Bride Side Box */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-2">
                                <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                  <span>👰 신부측 정보</span>
                                </h4>
                                <span className="text-[10px] text-[#8C7A78]">신부 및 혼주 연락처</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    신부 성함
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.brideName}
                                    onChange={(e) => setInvitationData({ ...invitationData, brideName: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] focus:border-[#C87870] outline-none"
                                    placeholder="정세영"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    신부 연락처 (전화걸기 연동)
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.bridePhone}
                                    onChange={(e) => setInvitationData({ ...invitationData, bridePhone: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] focus:border-[#C87870] outline-none"
                                    placeholder="010-0000-0000"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 pt-1">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    아버지 성함
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.brideFather}
                                    onChange={(e) => setInvitationData({ ...invitationData, brideFather: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                    placeholder="정성현"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    어머니 성함
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.brideMother}
                                    onChange={(e) => setInvitationData({ ...invitationData, brideMother: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                    placeholder="김선자"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    관계 (서열)
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.brideRelation}
                                    onChange={(e) => setInvitationData({ ...invitationData, brideRelation: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                    placeholder="장녀"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                  혼주(신부 부모님) 대표 전화번호
                                </label>
                                <input
                                  type="text"
                                  value={invitationData.brideParentPhone}
                                  onChange={(e) => setInvitationData({ ...invitationData, brideParentPhone: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs outline-none"
                                  placeholder="010-0000-0000"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 2: 예식 일시 & 예식장 장소 */}
                        {invitationEditorTab === 'datetime_venue' && (
                          <div className="space-y-5 text-xs animate-fade-in">
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <h4 className="font-serif font-bold text-sm text-[#1F181B] border-b border-[#E8DCD4] pb-2">
                                📅 예식 일시 및 캘린더 설정
                              </h4>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    예식 날짜 (표시용 텍스트)
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.weddingDate}
                                    onChange={(e) => setInvitationData({ ...invitationData, weddingDate: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                    placeholder="2026. 11. 08 SUN"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    캘린더 하트 날짜 (일)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={invitationData.weddingDayNum}
                                    onChange={(e) => setInvitationData({ ...invitationData, weddingDayNum: parseInt(e.target.value) || 8 })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                    placeholder="8"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                  예식 시간
                                </label>
                                <input
                                  type="text"
                                  value={invitationData.weddingTime}
                                  onChange={(e) => setInvitationData({ ...invitationData, weddingTime: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                  placeholder="낮 10:50 / 오전 11:30"
                                />
                              </div>
                            </div>

                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-2">
                                <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4 text-[#4285F4]" />
                                  <span>📍 예식장 위치 & Google Maps 길찾기 연동</span>
                                </h4>
                                <span className="text-[10px] text-[#4285F4] font-bold">US & Global Maps</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    Venue Name (예식장 명칭)
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.venueName}
                                    onChange={(e) => setInvitationData({ ...invitationData, venueName: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none focus:border-[#4285F4]"
                                    placeholder="The Plaza Hotel / 전주 아름다운컨벤션"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    Hall / Floor (상세 층 / 홀수)
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.venueHall}
                                    onChange={(e) => setInvitationData({ ...invitationData, venueHall: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none focus:border-[#4285F4]"
                                    placeholder="The Grand Ballroom / 2층 컨벤션홀"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1 flex items-center justify-between">
                                  <span>Full Street Address (도로명 주소 - Google Maps 실시간 길찾기 연동)</span>
                                  <span className="text-[10px] text-[#8C7A78]">1-클릭 복사 자동 지원</span>
                                </label>
                                <input
                                  type="text"
                                  value={invitationData.venueAddress}
                                  onChange={(e) => setInvitationData({ ...invitationData, venueAddress: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none focus:border-[#4285F4]"
                                  placeholder="768 5th Ave, New York, NY 10019 / 온고을로 291"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                  Transit & Shuttle (대중교통 / 셔틀 안내)
                                </label>
                                <input
                                  type="text"
                                  value={invitationData.venueTraffic}
                                  onChange={(e) => setInvitationData({ ...invitationData, venueTraffic: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none focus:border-[#4285F4]"
                                  placeholder="Subway N/R/W at 5th Ave-59th St, JFK/EWR Airport Shuttle"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                  Parking & Valet (주차장 / 발렛파킹 안내)
                                </label>
                                <input
                                  type="text"
                                  value={invitationData.venueParking}
                                  onChange={(e) => setInvitationData({ ...invitationData, venueParking: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none focus:border-[#4285F4]"
                                  placeholder="Complimentary Valet Parking & On-Site Garage Available (24/7)"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 3: 대표 사진 & 갤러리 6컷 & BGM 배경음악 */}
                        {invitationEditorTab === 'media_bgm' && (
                          <div className="space-y-6 text-xs animate-fade-in">
                            {/* Main Cover Photo Selection */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-2">
                                <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                  <Camera className="w-4 h-4 text-[#C87870]" />
                                  <span>메인 커버 사진 설정</span>
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUploadTargetIndex('cover');
                                    photoUploadInputRef.current?.click();
                                  }}
                                  className="px-3 py-1.5 rounded-full bg-white border border-[#C87870] text-[#C87870] font-bold text-[11px] hover:bg-[#FAF3EF] transition flex items-center gap-1 shadow-xs"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>내 사진 직접 업로드</span>
                                </button>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="relative w-20 h-28 rounded-2xl overflow-hidden border-2 border-[#C87870] shrink-0 shadow-sm">
                                  <Image
                                    src={invitationData.coverPhoto}
                                    alt="Cover preview"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <span className="text-[11px] font-bold text-[#1F181B]">현재 적용된 대표 커버 화보</span>
                                  <p className="text-[10px] text-[#7C6E6D] leading-relaxed">
                                    스마트폰 첫 화면에 노출되는 아치형 또는 라운드형 대형 메인 포트레이트입니다. 아래 12대 월드 화보를 클릭하거나 직접 촬영한 웨딩 사진을 업로드하세요.
                                  </p>
                                </div>
                              </div>

                              {/* 12 Presets Quick Switcher for Cover */}
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A78] block mb-2">
                                  ✨ 12대 AI 명품 웨딩 화보에서 원클릭 선택:
                                </span>
                                <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
                                  {Object.values(WEDDING_12_PRESETS).map((preset) => {
                                    const isCurr = invitationData.coverPhoto === preset.heroImage;
                                    return (
                                      <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => setInvitationData(prev => ({ ...prev, coverPhoto: preset.heroImage }))}
                                        className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition group ${
                                          isCurr ? 'border-[#C87870] ring-2 ring-[#C87870]/40' : 'border-[#E8DCD4] opacity-80 hover:opacity-100'
                                        }`}
                                      >
                                        <Image src={preset.heroImage} alt={preset.title} fill unoptimized className="object-cover" />
                                        <span className="absolute bottom-1 left-1 right-1 text-[8px] bg-black/60 text-white rounded px-0.5 truncate font-sans text-center">
                                          #{preset.number}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* 6-Photo Gallery Customization */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <h4 className="font-serif font-bold text-sm text-[#1F181B] border-b border-[#E8DCD4] pb-2">
                                🖼️ 갤러리 6컷 사진 개별 설정
                              </h4>
                              <p className="text-[10px] text-[#7C6E6D]">
                                청첩장 내부 갤러리에 들어가는 6장의 사진입니다. 각 슬롯을 클릭하여 '내 사진 업로드'로 교체할 수 있습니다.
                              </p>

                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                                {invitationData.galleryPhotos.map((src, idx) => (
                                  <div key={idx} className="space-y-1 text-center">
                                    <div className="relative aspect-square rounded-xl overflow-hidden border border-[#D8C7BD] shadow-xs group">
                                      <Image src={src} alt={`Slot ${idx + 1}`} fill unoptimized className="object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setUploadTargetIndex(idx);
                                          photoUploadInputRef.current?.click();
                                        }}
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition"
                                      >
                                        사진 변경
                                      </button>
                                    </div>
                                    <span className="text-[10px] font-semibold text-[#8C7A78]">컷 #{idx + 1}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* BGM Soundtrack Selection */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-2">
                                <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                  <Music className="w-4 h-4 text-[#C87870]" />
                                  <span>배경음악 (BGM) 사운드트랙 선택</span>
                                </h4>
                                <span className="text-[10px] text-[#8C7A78]">하객 감동 앰비언스</span>
                              </div>

                              <div className="space-y-2">
                                {BGM_PLAYLIST.map((bgm) => {
                                  const isSelected = invitationData.bgmId === bgm.id;
                                  return (
                                    <div
                                      key={bgm.id}
                                      onClick={() => setInvitationData(prev => ({ ...prev, bgmId: bgm.id, bgmTitle: bgm.title }))}
                                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                                        isSelected
                                          ? 'bg-white border-[#C87870] shadow-xs'
                                          : 'bg-white/60 border-[#E8DCD4] hover:bg-white'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="text-lg">{bgm.icon}</span>
                                        <div>
                                          <span className="font-bold text-xs text-[#1F181B] block">{bgm.title}</span>
                                          <span className="text-[10px] text-[#8C7A78]">{bgm.mood}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {isSelected && (
                                          <span className="px-2 py-0.5 rounded-full bg-[#FAF3EF] text-[#B85E55] text-[10px] font-bold">
                                            선택됨 ✓
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 4: 모시는 글 (Invitation Letter) 단독 전담 에디터 */}
                        {invitationEditorTab === 'letter' && (
                          <div className="space-y-6 text-xs animate-fade-in">
                            <div className="p-4 sm:p-6 rounded-3xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-4">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-3">
                                <div>
                                  <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                    <span>💌 모시는 글 (Wedding Invitation Letter)</span>
                                  </h4>
                                  <p className="text-[11px] text-[#7C6E6D] mt-0.5">
                                    하객들에게 전하는 사랑과 감사의 초대 메시지입니다. 아래 5가지 영문 명품 템플릿 중 하나를 선택하거나 직접 자유롭게 작성하세요.
                                  </p>
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-[#FAF3EF] text-[#B85E55] text-[10px] font-bold shrink-0">
                                  5 Presets Included
                                </span>
                              </div>

                              {/* 5 Curated English Presets */}
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A78] block mb-2.5">
                                  ✨ 5 Curated English Invitation Presets (원클릭 자동 채우기):
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                                  {INVITATION_MESSAGE_PRESETS.map((preset, pIdx) => {
                                    const isSelected = invitationData.welcomeMessage === preset.text;
                                    return (
                                      <button
                                        key={pIdx}
                                        type="button"
                                        onClick={() => setInvitationData(prev => ({ ...prev, welcomeMessage: preset.text }))}
                                        className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                                          isSelected
                                            ? 'bg-white border-[#C87870] shadow-sm ring-2 ring-[#C87870]/20'
                                            : 'bg-white/80 border-[#D8C7BD] hover:border-[#C87870] hover:bg-white'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-bold text-xs text-[#1F181B]">{preset.title}</span>
                                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAF5F1] text-[#8C7A78] font-medium">
                                            {preset.badge}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-[#7C6E6D] line-clamp-2 leading-relaxed italic">
                                          "{preset.text.split('\n')[0]}"
                                        </p>
                                        <span className="text-[9px] text-[#B85E55] font-semibold mt-2 block">
                                          {isSelected ? '✓ 현재 적용됨' : '+ 클릭하여 적용'}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Direct Custom Editor */}
                              <div className="pt-2 border-t border-[#E8DCD4]">
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="text-[11px] font-bold text-[#1F181B]">
                                    직접 편집 & 작성 (Custom Invitation Text)
                                  </label>
                                  <span className="text-[10px] text-[#8C7A78]">
                                    실시간 모바일 폰에 즉시 동기화됩니다
                                  </span>
                                </div>
                                <textarea
                                  rows={7}
                                  value={invitationData.welcomeMessage}
                                  onChange={(e) => setInvitationData({ ...invitationData, welcomeMessage: e.target.value })}
                                  className="w-full p-4 rounded-2xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] leading-relaxed outline-none focus:border-[#C87870] shadow-xs font-serif italic"
                                  placeholder="Type or customize your wedding invitation message here..."
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Editor Action Bottom Bar */}
                      <div className="mt-8 pt-4 border-t border-[#F0E6DE] flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-[#2E7D32]">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>모든 편집 내용이 실시간 자동 동기화되었습니다</span>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setCopyToast('모바일 청첩장 고유 링크가 클립보드에 복사되었습니다! (카톡 전송 가능)');
                              setTimeout(() => setCopyToast(''), 3000);
                            }}
                            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1F181B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C87870] transition shadow-sm flex items-center justify-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>완성 링크 복사하기</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RIGHT COLUMN: Real-Time Mobile Device Mockup (lg:col-span-5) */}
                  {(invitationViewMode === 'both' || invitationViewMode === 'preview') && (
                    <div className={`overflow-y-auto p-4 sm:p-8 bg-[#FAF5F1] flex items-center justify-center ${
                      invitationViewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-5'
                    }`}>
                      {/* Realistic Smartphone Mockup Body */}
                      <div className="relative w-full max-w-[380px] bg-[#FFFDFB] border-[8px] border-[#2C2426] rounded-[52px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden font-serif flex flex-col max-h-[78vh]">
                        {/* Dynamic Island / Speaker Notch Bar */}
                        <div className="sticky top-0 z-40 bg-black pt-3 pb-2 px-6 flex items-center justify-between text-white text-[10px] font-sans">
                          <span className="font-semibold tracking-wider">10:50</span>
                          {/* Dynamic Island Pill */}
                          <div className="w-20 h-4 rounded-full bg-[#1F181B] flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-[#3B82F6]/60 animate-ping" />
                          </div>
                          <div className="flex items-center gap-1.5 opacity-80">
                            <span>5G</span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* Mobile Invitation Content Scroll Body */}
                <div 
                  className={`overflow-y-auto flex-1 transition-colors duration-500 bg-gradient-to-b ${currentSkin.bgGradient}`}
                  style={{ color: currentSkin.textColor }}
                >
                  {/* Phone Status Bar Aesthetic */}
                  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-sans opacity-70 tracking-widest">
                    <span>10:50 AM</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* 1. Cover Hero */}
                  <div className="p-6 text-center">
                    <div 
                      className="inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.25em] uppercase font-sans font-bold mb-4 shadow-xs border"
                      style={{ 
                        backgroundColor: currentSkin.cardBg, 
                        borderColor: currentSkin.borderColor,
                        color: currentSkin.themeColor 
                      }}
                    >
                      {currentSkin.badgeLabel}
                    </div>

                    <div className="space-y-1 mb-5">
                      <span className="text-[10px] tracking-[0.35em] uppercase font-sans block opacity-70">
                        Wedding Invitation
                      </span>
                      <h2 className="text-3xl font-serif tracking-tight">
                        {invitationData.groomName} <span style={{ color: currentSkin.themeColor }}>♡</span> {invitationData.brideName}
                      </h2>
                    </div>

                    {/* Master Wedding Portrait Frame */}
                    <div 
                      className={`relative aspect-[3/4] w-full overflow-hidden shadow-xl border-4 ${
                        currentSkin.frameShape === 'arch' ? 'rounded-t-[120px] rounded-b-2xl' : 'rounded-3xl'
                      }`}
                      style={{ borderColor: currentSkin.cardBg }}
                    >
                      <Image 
                        src={invitationData.coverPhoto} 
                        alt="Couple Wedding Portrait"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-0 right-0 text-white font-sans text-center">
                        <p className="text-xs tracking-widest uppercase font-light">
                          {invitationData.weddingDate}
                        </p>
                        <p className="text-sm font-serif italic drop-shadow-md">
                          Forever & Always
                        </p>
                      </div>
                    </div>

                    {/* Date & Sanctuary Header */}
                    <div className="mt-5 py-3 border-y border-black/10 space-y-1 font-sans">
                      <p className="text-sm font-serif font-bold tracking-wide">
                        {invitationData.weddingDate} · {invitationData.weddingTime}
                      </p>
                      <p className="text-xs opacity-75">
                        {invitationData.venueName} {invitationData.venueHall}
                      </p>
                    </div>
                  </div>

                  {/* 2. Invitation Greeting (모시는 글 & 부모님 성함) */}
                  <div className="p-6 text-center space-y-6">
                    <div>
                      <span 
                        className="text-[10px] tracking-[0.25em] uppercase font-sans font-bold block mb-3"
                        style={{ color: currentSkin.themeColor }}
                      >
                        Invitation Letter
                      </span>
                      <p className="text-xs font-serif leading-loose whitespace-pre-line italic px-2">
                        {invitationData.welcomeMessage}
                      </p>
                    </div>

                    {/* Family Parent Relationships (Bojagi Card Standard) */}
                    <div 
                      className="p-5 rounded-2xl border font-sans text-xs space-y-3"
                      style={{ backgroundColor: currentSkin.cardBg, borderColor: currentSkin.borderColor }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <span className="opacity-70">{invitationData.groomFather} · {invitationData.groomMother}</span>의 {invitationData.groomRelation} <strong className="font-bold">{invitationData.groomName}</strong>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a href={`tel:${invitationData.groomPhone}`} className="p-1.5 rounded-full bg-[#FAF5F1] text-[#7C6E6D] hover:text-[#C87870]">
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a href={`sms:${invitationData.groomPhone}`} className="p-1.5 rounded-full bg-[#FAF5F1] text-[#7C6E6D] hover:text-[#C87870]">
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <div className="h-px bg-black/5" />

                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <span className="opacity-70">{invitationData.brideFather} · {invitationData.brideMother}</span>의 {invitationData.brideRelation} <strong className="font-bold">{invitationData.brideName}</strong>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a href={`tel:${invitationData.bridePhone}`} className="p-1.5 rounded-full bg-[#FAF5F1] text-[#7C6E6D] hover:text-[#C87870]">
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a href={`sms:${invitationData.bridePhone}`} className="p-1.5 rounded-full bg-[#FAF5F1] text-[#7C6E6D] hover:text-[#C87870]">
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Wedding Calendar & Live D-Day */}
                  <div className="p-6 font-sans">
                    <div 
                      className="p-6 rounded-3xl border text-center shadow-xs"
                      style={{ backgroundColor: currentSkin.cardBg, borderColor: currentSkin.borderColor }}
                    >
                      <span className="text-[10px] tracking-[0.25em] uppercase font-bold block mb-1" style={{ color: currentSkin.themeColor }}>
                        Wedding Calendar
                      </span>
                      <h4 className="text-lg font-serif mb-4">
                        {invitationData.weddingDate}
                      </h4>

                      {/* Mini Monthly Calendar */}
                      <div className="grid grid-cols-7 gap-1 text-[11px] mb-5">
                        <span className="text-[#C87870] font-bold">일</span>
                        <span className="opacity-60">월</span>
                        <span className="opacity-60">화</span>
                        <span className="opacity-60">수</span>
                        <span className="opacity-60">목</span>
                        <span className="opacity-60">금</span>
                        <span className="opacity-60">토</span>

                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(day => {
                          const isWeddingDay = day === invitationData.weddingDayNum;
                          return (
                            <div 
                              key={day}
                              className={`py-1 text-center font-medium ${
                                isWeddingDay 
                                  ? 'rounded-full text-white font-bold shadow-sm flex items-center justify-center'
                                  : day % 7 === 1 ? 'text-[#C87870]' : 'opacity-70'
                              }`}
                              style={isWeddingDay ? { backgroundColor: currentSkin.heartColor } : undefined}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>

                      {/* D-Day Live Countdown */}
                      <div className="pt-4 border-t border-black/5">
                        <p className="text-xs font-serif italic mb-3">
                          {invitationData.groomName} ♡ {invitationData.brideName}의 예식이 <span className="font-bold" style={{ color: currentSkin.themeColor }}>4일</span> 남았습니다
                        </p>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="p-2 rounded-xl bg-[#FAF5F1]"><strong className="block text-sm font-bold">04</strong><span className="text-[9px] opacity-70 uppercase">Days</span></div>
                          <div className="p-2 rounded-xl bg-[#FAF5F1]"><strong className="block text-sm font-bold">02</strong><span className="text-[9px] opacity-70 uppercase">Hours</span></div>
                          <div className="p-2 rounded-xl bg-[#FAF5F1]"><strong className="block text-sm font-bold">15</strong><span className="text-[9px] opacity-70 uppercase">Mins</span></div>
                          <div className="p-2 rounded-xl bg-[#FAF5F1]"><strong className="block text-sm font-bold">30</strong><span className="text-[9px] opacity-70 uppercase">Secs</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. 6-Shot Wedding Gallery */}
                  <div className="p-6 font-sans">
                    <div className="text-center mb-4">
                      <span className="text-[10px] tracking-[0.25em] uppercase font-bold block" style={{ color: currentSkin.themeColor }}>
                        Gallery
                      </span>
                      <h4 className="text-lg font-serif">Wedding Moments</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {invitationData.galleryPhotos.map((src, i) => (
                        <div 
                          key={i} 
                          onClick={() => setActiveGalleryPhoto(src)}
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-xs hover:scale-105 transition"
                        >
                          <Image src={src} alt={`Gallery photo ${i+1}`} fill unoptimized className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Venue Location & Map Navigation (오시는 길) */}
                  <div className="p-6 font-sans">
                    <div 
                      className="p-6 rounded-3xl border shadow-xs text-left space-y-4"
                      style={{ backgroundColor: currentSkin.cardBg, borderColor: currentSkin.borderColor }}
                    >
                      <div>
                        <span className="text-[10px] tracking-[0.25em] uppercase font-bold block mb-1" style={{ color: currentSkin.themeColor }}>
                          Location
                        </span>
                        <h4 className="text-base font-serif font-bold text-[#1F181B]">
                          {invitationData.venueName} {invitationData.venueHall}
                        </h4>
                        <p className="text-xs opacity-75 mt-1">
                          {invitationData.venueAddress}
                        </p>
                      </div>

                      {/* Copy Address Button */}
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(invitationData.venueAddress);
                          setCopyToast('주소가 클립보드에 복사되었습니다. (Address copied!)');
                          setTimeout(() => setCopyToast(''), 2500);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#FAF5F1] hover:bg-[#F2E5DC] text-xs font-semibold text-[#5C4D4D] flex items-center justify-center gap-1.5 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address (주소 복사하기)</span>
                      </button>

                      {/* Google Maps & US Live Navigation Links */}
                      <div className="space-y-2 pt-2 border-t border-black/5">
                        {/* Primary: Google Maps Directions */}
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(invitationData.venueAddress)}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full py-3 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                        >
                          <MapPin className="w-4 h-4 text-white" />
                          <span>Google Maps 길찾기 (Open in Google Maps)</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                        </a>

                        {/* Secondary: Apple Maps & Waze */}
                        <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold">
                          <a 
                            href={`https://maps.apple.com/?daddr=${encodeURIComponent(invitationData.venueAddress)}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="py-2.5 rounded-xl bg-[#1F181B] hover:bg-black text-white transition flex items-center justify-center gap-1"
                          >
                            <span>Apple Maps</span>
                          </a>
                          <a 
                            href={`https://waze.com/ul?q=${encodeURIComponent(invitationData.venueAddress)}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="py-2.5 rounded-xl bg-[#33CCFF] hover:bg-[#22BBEB] text-[#1F181B] font-bold transition flex items-center justify-center gap-1"
                          >
                            <span>Waze</span>
                          </a>
                        </div>
                      </div>

                      {/* Transportation Details */}
                      <div className="pt-2 text-[11px] opacity-75 space-y-1">
                        <p>• <strong>대중교통 / Transit:</strong> {invitationData.venueTraffic}</p>
                        <p>• <strong>주차안내 / Parking:</strong> {invitationData.venueParking}</p>
                      </div>
                    </div>
                  </div>

                  {/* 6. Congratulatory Bank Accounts (마음 전하실 곳) */}
                  <div className="p-6 font-sans">
                    <div 
                      className="p-6 rounded-3xl border shadow-xs text-left space-y-3"
                      style={{ backgroundColor: currentSkin.cardBg, borderColor: currentSkin.borderColor }}
                    >
                      <div className="text-center mb-2">
                        <span className="text-[10px] tracking-[0.25em] uppercase font-bold block" style={{ color: currentSkin.themeColor }}>
                          Account
                        </span>
                        <h4 className="text-base font-serif">마음 전하실 곳</h4>
                        <p className="text-[11px] opacity-70 mt-0.5">
                          참석이 어려우신 분들을 위해 계좌번호를 안내해 드립니다.
                        </p>
                      </div>

                      {/* Groom Side Accordion */}
                      <div className="border border-[#EBDCD3] rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setActiveAccountTab(activeAccountTab === 'groom' ? null : 'groom')}
                          className="w-full p-3.5 bg-[#FAF5F1] flex items-center justify-between text-xs font-bold text-[#1F181B]"
                        >
                          <span>신랑측 계좌번호 보기</span>
                          {activeAccountTab === 'groom' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {activeAccountTab === 'groom' && (
                          <div className="p-4 bg-white space-y-2 text-xs">
                            <p><strong>{invitationData.groomBank}</strong> {invitationData.groomAccount} (예금주: {invitationData.groomHolder})</p>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setCopyToast('신랑측 계좌번호가 복사되었습니다.');
                                  setTimeout(() => setCopyToast(''), 2500);
                                }}
                                className="flex-1 py-2 rounded-xl bg-[#FAF5F1] text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-[#F2E5DC]"
                              >
                                <Copy className="w-3 h-3" />
                                <span>계좌번호 복사</span>
                              </button>
                              <a
                                href={invitationData.groomKakaoPay}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 rounded-xl bg-[#FEE500] text-[11px] font-bold text-[#191919] flex items-center justify-center"
                              >
                                카카오페이 송금
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bride Side Accordion */}
                      <div className="border border-[#EBDCD3] rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setActiveAccountTab(activeAccountTab === 'bride' ? null : 'bride')}
                          className="w-full p-3.5 bg-[#FAF5F1] flex items-center justify-between text-xs font-bold text-[#1F181B]"
                        >
                          <span>신부측 계좌번호 보기</span>
                          {activeAccountTab === 'bride' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {activeAccountTab === 'bride' && (
                          <div className="p-4 bg-white space-y-2 text-xs">
                            <p><strong>{invitationData.brideBank}</strong> {invitationData.brideAccount} (예금주: {invitationData.brideHolder})</p>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setCopyToast('신부측 계좌번호가 복사되었습니다.');
                                  setTimeout(() => setCopyToast(''), 2500);
                                }}
                                className="flex-1 py-2 rounded-xl bg-[#FAF5F1] text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-[#F2E5DC]"
                              >
                                <Copy className="w-3 h-3" />
                                <span>계좌번호 복사</span>
                              </button>
                              <a
                                href={invitationData.brideKakaoPay}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 rounded-xl bg-[#FEE500] text-[11px] font-bold text-[#191919] flex items-center justify-center"
                              >
                                카카오페이 송금
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 7. Interactive RSVP (참석 여부 전달) */}
                  <div className="p-6 font-sans">
                    <div 
                      className="p-6 rounded-3xl border shadow-xs text-left space-y-4"
                      style={{ backgroundColor: currentSkin.cardBg, borderColor: currentSkin.borderColor }}
                    >
                      <div className="text-center mb-1">
                        <span className="text-[10px] tracking-[0.25em] uppercase font-bold block" style={{ color: currentSkin.themeColor }}>
                          RSVP
                        </span>
                        <h4 className="text-base font-serif">참석 여부 전달</h4>
                        <p className="text-[11px] opacity-70 mt-0.5">
                          원활한 예식 및 식사 준비를 위해 참석 여부를 전달해 주세요.
                        </p>
                      </div>

                      {rsvpSubmitted ? (
                        <div className="p-4 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold text-center space-y-1">
                          <CheckCircle2 className="w-5 h-5 mx-auto" />
                          <p>참석 여부가 신랑신부에게 소중히 전달되었습니다!</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                            <button
                              onClick={() => setRsvpStatus('attending')}
                              className={`py-3 rounded-xl border transition ${
                                rsvpStatus === 'attending' 
                                  ? 'bg-[#1F181B] text-white border-[#1F181B]' 
                                  : 'bg-[#FAF5F1] text-[#7C6E6D] border-[#E8DCD4]'
                              }`}
                            >
                              참석합니다
                            </button>
                            <button
                              onClick={() => setRsvpStatus('declining')}
                              className={`py-3 rounded-xl border transition ${
                                rsvpStatus === 'declining' 
                                  ? 'bg-[#1F181B] text-white border-[#1F181B]' 
                                  : 'bg-[#FAF5F1] text-[#7C6E6D] border-[#E8DCD4]'
                              }`}
                            >
                              마음으로 축하합니다
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="참석자 성함"
                            value={rsvpName}
                            onChange={e => setRsvpName(e.target.value)}
                            className="w-full p-3 rounded-xl border border-[#E0D2CB] text-xs focus:outline-none focus:border-[#C87870] bg-white"
                          />

                          <div className="grid grid-cols-3 gap-1.5 text-xs text-center">
                            {[1, 2, 3].map(cnt => (
                              <button
                                key={cnt}
                                onClick={() => setGuestCount(cnt)}
                                className={`py-2 rounded-lg border text-[11px] transition ${
                                  guestCount === cnt 
                                    ? 'bg-[#FAF3EF] border-[#C87870] text-[#B85E55] font-bold' 
                                    : 'bg-white border-[#E8DCD4] text-[#7C6E6D]'
                                }`}
                              >
                                {cnt === 3 ? '3인 이상' : `${cnt}인`}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => {
                              if (rsvpName) setRsvpSubmitted(true);
                            }}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C87870] to-[#9E6F28] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95 transition"
                          >
                            참석 정보 제출하기
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 8. Live Guestbook (축하 메시지 방명록) */}
                  <div className="p-6 font-sans">
                    <div 
                      className="p-6 rounded-3xl border shadow-xs text-left space-y-4"
                      style={{ backgroundColor: currentSkin.cardBg, borderColor: currentSkin.borderColor }}
                    >
                      <div className="text-center mb-1">
                        <span className="text-[10px] tracking-[0.25em] uppercase font-bold block" style={{ color: currentSkin.themeColor }}>
                          Guestbook
                        </span>
                        <h4 className="text-base font-serif">축하 메시지</h4>
                      </div>

                      {/* Guestbook Submission Form */}
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="작성자 성함"
                          value={newGuestName}
                          onChange={e => setNewGuestName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#E0D2CB] text-xs focus:outline-none focus:border-[#C87870] bg-white"
                        />
                        <textarea
                          placeholder="신랑 신부에게 따뜻한 축하의 한마디를 남겨주세요."
                          rows={2}
                          value={newGuestMsg}
                          onChange={e => setNewGuestMsg(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#E0D2CB] text-xs focus:outline-none focus:border-[#C87870] bg-white resize-none"
                        />
                        <button
                          onClick={() => {
                            if (newGuestName && newGuestMsg) {
                              setGuestbookList([
                                { id: Date.now(), name: newGuestName, message: newGuestMsg, date: '2026.11.04' },
                                ...guestbookList
                              ]);
                              setNewGuestName('');
                              setNewGuestMsg('');
                            }
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#1F181B] text-white text-xs font-bold transition hover:bg-[#3A3335]"
                        >
                          축하 메시지 등록
                        </button>
                      </div>

                      {/* Guestbook Feed */}
                      <div className="space-y-2.5 max-h-48 overflow-y-auto pt-2 border-t border-black/5">
                        {guestbookList.map(item => (
                          <div key={item.id} className="p-3 rounded-xl bg-[#FAF5F1] text-xs space-y-1">
                            <div className="flex items-center justify-between text-[#8C7A78]">
                              <strong className="text-[#1F181B]">{item.name}</strong>
                              <span className="text-[10px]">{item.date}</span>
                            </div>
                            <p className="text-[#5C4D4D] leading-relaxed">{item.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 9. Share Footer */}
                  <div className="p-6 pt-2 font-sans space-y-2.5 pb-12">
                    <button
                      onClick={() => {
                        setCopyToast('카카오톡 공유 링크가 준비되었습니다.');
                        setTimeout(() => setCopyToast(''), 2500);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-[#FEE500] text-[#191919] font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>카카오톡으로 공유하기</span>
                    </button>
                    <button
                      onClick={() => {
                        setCopyToast('청첩장 링크가 클립보드에 복사되었습니다.');
                        setTimeout(() => setCopyToast(''), 2500);
                      }}
                      className="w-full py-3 rounded-2xl bg-white border border-[#E0D2CB] text-[#5C4D4D] font-semibold text-xs flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>청첩장 링크 복사하기</span>
                    </button>
                    </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Toast Notification */}
                {copyToast && (
                  <div className="absolute bottom-6 left-6 right-6 z-50 p-3 rounded-2xl bg-[#1F181B]/95 text-white text-xs font-sans font-medium text-center shadow-2xl animate-fade-in">
                    {copyToast}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* 6. Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white border border-[#E8DCD4] rounded-[32px] p-8 shadow-2xl font-sans">
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF5F1] hover:bg-[#F2E5DC] text-[#7C6E6D] flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E8A598] via-[#F3E5AB] to-[#D4AF37] inline-flex items-center justify-center text-white font-serif font-bold text-lg shadow-md mb-4">
                W
              </span>
              <h3 className="text-2xl font-serif font-light text-[#1F181B]">
                Welcome to WeddingHelper
              </h3>
              <p className="text-xs text-[#8C7A78] mt-1.5 font-light">
                Sign in to save your dream wedding visualizations & unlock VIP booking perks.
              </p>
            </div>

            <div className="mt-8 space-y-3.5">
              {/* Google 1-Click Login */}
              <button
                onClick={() => {
                  setUser({ email: 'vip.couple@gmail.com', isVip: false });
                  setIsLoginOpen(false);
                }}
                className="w-full py-3.5 px-4 rounded-2xl border border-[#E0D2CB] hover:border-[#C87870] bg-[#FFFDFB] hover:bg-[#FAF5F1] flex items-center justify-center gap-3 transition shadow-sm text-xs font-semibold text-[#2C2426]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-[#EADED7]" />
                <span className="text-[10px] text-[#A89895] uppercase tracking-wider">or email</span>
                <div className="flex-1 h-px bg-[#EADED7]" />
              </div>

              <input 
                type="email" 
                placeholder="bride.groom@example.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border border-[#E0D2CB] text-xs focus:outline-none focus:border-[#C87870] bg-[#FFFDFB]"
              />

              <button
                onClick={() => {
                  if (loginEmail) {
                    setUser({ email: loginEmail, isVip: false });
                    setIsLoginOpen(false);
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-[#2C2426] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A1517] transition shadow-md"
              >
                Send Magic Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Checkout / VIP Pass Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white border border-[#E8DCD4] rounded-[36px] p-8 sm:p-10 shadow-2xl font-sans">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF5F1] hover:bg-[#F2E5DC] text-[#7C6E6D] flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF3EF] border border-[#E8DCD4] text-[11px] font-bold text-[#8C6D1F] uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                VIP Wedding Studio Membership
              </span>
              <h3 className="text-3xl font-serif font-light text-[#1F181B]">
                Unlock Unlimited Dream Weddings
              </h3>
              <p className="text-xs text-[#8C7A78] mt-2 font-light max-w-md mx-auto">
                Generate high-resolution 4K masterpieces across all 12 sacred worlds with direct sanctuary bookings & personal styling.
              </p>
            </div>

            {/* 3-Tier Luxury Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-8">
              {/* Plan 1: Single World */}
              <div 
                onClick={() => setSelectedPlan('single')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  selectedPlan === 'single' 
                    ? 'border-[#C87870] bg-[#FFFBF9] ring-2 ring-[#C87870]' 
                    : 'border-[#EADED7] hover:border-[#D8BFB5] bg-[#FFFDFB]'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A78] block">
                    Single World
                  </span>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-2xl font-serif font-bold text-[#1F181B]">$29</span>
                    <span className="text-[10px] text-[#A89895]">/ 1 theme</span>
                  </div>
                  <ul className="mt-3.5 space-y-1.5 text-[11px] text-[#5C4D4D]">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C87870]" /> 20 4K Masterpieces (1 Theme)</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C87870]" /> 1 Sanctuary Venue Link</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C87870]" /> Real Gown In-Stock Links</li>
                  </ul>
                </div>
              </div>

              {/* Plan 2: Trio Worlds */}
              <div 
                onClick={() => setSelectedPlan('trio')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  selectedPlan === 'trio' 
                    ? 'border-[#C87870] bg-[#FFFBF9] ring-2 ring-[#C87870]' 
                    : 'border-[#EADED7] hover:border-[#D8BFB5] bg-[#FFFDFB]'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A78] block">
                    Trio Worlds
                  </span>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-2xl font-serif font-bold text-[#1F181B]">$59</span>
                    <span className="text-[10px] text-[#A89895]">/ 3 themes</span>
                  </div>
                  <ul className="mt-3.5 space-y-1.5 text-[11px] text-[#5C4D4D]">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C87870]" /> 60 4K Masterpieces (3 Themes)</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C87870]" /> 3 Sanctuary Venues Direct Booking</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C87870]" /> Real Gown In-Stock Links</li>
                  </ul>
                </div>
              </div>

              {/* Plan 3: The Grand 12 (Best Value) */}
              <div 
                onClick={() => setSelectedPlan('grand')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between relative ${
                  selectedPlan === 'grand' 
                    ? 'border-[#C87870] bg-[#FFFBF9] ring-2 ring-[#C87870] shadow-md' 
                    : 'border-[#EADED7] hover:border-[#D8BFB5] bg-[#FFFDFB]'
                }`}
              >
                <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#B85E55] to-[#9E6F28] text-white shadow-sm">
                  Best Value
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85E55] block">
                    The Grand 12
                  </span>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-2xl font-serif font-bold text-[#1F181B]">$79</span>
                    <span className="text-[10px] text-[#A89895]">/ all worlds</span>
                  </div>
                  <ul className="mt-3.5 space-y-1.5 text-[11px] text-[#5C4D4D]">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C87870]" /> 240 Masterpieces (All 12 Themes)</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C87870]" /> 8K Canvas Print-Ready (5 Best Picks)</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C87870]" /> Mobile Invitation Kit (RSVP Included)</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C87870]" /> Real Gown In-Stock Links</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] text-[#9E8B88] font-sans italic">
              * 8K UltraHD 300 DPI lossless files are provided for your top 5 favorite altar & frame portraits.
            </p>

            {/* Instant Checkout Button */}
            <button
              onClick={() => {
                setUser({ email: 'vip.couple@wedding.com', isVip: true, plan: selectedPlan });
                setIsCheckoutOpen(false);
                if (selectedPlan === 'grand') {
                  setIsInvitationOpen(true);
                  alert('🎉 The Grand 12 VIP Pass Activated ($79)! Your 10-Skin Mobile Wedding Invitation Kit is now unlocked!');
                } else {
                  alert(`VIP Pass Activated! You selected the ${selectedPlan === 'trio' ? 'Trio Worlds ($59)' : 'Single World ($29)'} plan.`);
                }
              }}
              className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-[#C87870] via-[#D89BA6] to-[#C87870] text-white font-bold uppercase tracking-widest text-xs hover:opacity-95 transition shadow-[0_6px_25px_rgba(200,120,112,0.4)] flex items-center justify-center gap-2"
            >
              <Gem className="w-4 h-4" />
              <span>Complete Order with 1-Click Pay (${selectedPlan === 'grand' ? '79' : selectedPlan === 'trio' ? '59' : '29'} USD)</span>
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-[#A89895]">
              <span>🔒 256-Bit SSL Encrypted</span>
              <span>•</span>
              <span>Stripe / Apple Pay / PayPal</span>
              <span>•</span>
              <span>Instant Digital Access</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Poetic Footer */}
      <footer className="mt-24 border-t border-[#F2E5DC] bg-[#FAF5F1] py-14 px-4 text-center text-xs text-[#8A7977] font-sans relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 text-[#1F181B] font-serif tracking-widest font-normal text-sm">
            <span className="w-6 h-6 rounded-full bg-[#C87870] text-white font-bold text-xs flex items-center justify-center">W</span>
            WEDDINGHELPER
          </div>
          <p className="font-serif italic text-sm text-[#6E5D5C]">
            &ldquo;Every love story is beautiful, but yours should be timeless.&rdquo;
          </p>
          <div className="flex items-center gap-5 text-[#8A7977]">
            <Link href="/stayhelper" className="hover:text-[#1F181B]">StayHelper</Link>
            <Link href="/" className="hover:text-[#1F181B]">StylingHelper</Link>
            <a href="https://roomhelper.vercel.app" target="_blank" rel="noreferrer" className="hover:text-[#1F181B]">RoomHelper</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
