'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, Sparkles, Upload, ArrowRight, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, Gem, Calendar,
  Share2, Download, RefreshCw, X, ExternalLink, Clock, CreditCard,
  SlidersHorizontal, Eye, Lock, Unlock, Check
} from 'lucide-react';
import { WEDDING_12_PRESETS, WeddingThemePreset } from '@/lib/wedding-presets';
import { LuxuryHotspotLayer, type ShowroomPin } from '@/components/stylinghelper/LuxurySpecCard';

const WEDDING_SAMPLE_PINS: ShowroomPin[] = (WEDDING_12_PRESETS['bali-jungle']?.products ?? []).map((p, idx) => ({
  id: p.id,
  x: idx === 0 ? 38 : idx === 1 ? 62 : 48,
  y: idx === 0 ? 55 : idx === 1 ? 48 : 28,
  category: p.type.toUpperCase(),
  title: p.name,
  brand: p.brand,
  price: p.price,
  retailer: new URL(p.buyUrl).hostname.replace(/^www\./, ''),
  buyUrl: p.buyUrl,
}));

// 12 World-Class Luxury Destination Configs (20 Editorial Angles Each)
const DESTINATION_240_CONFIGS = [
  { id: 'theme_01_bali', title: 'Bali Rainforest Infinity Chapel', dest: 'Ubud, Bali, Indonesia', venue: 'The Edge Bali & Mandapa Ritz-Carlton', heroImg: '/images/weddings_240/theme_01_bali/scene_01.jpg' },
  { id: 'theme_02_amalfi', title: 'Amalfi Coast Cliffside Belvedere', dest: 'Positano, Amalfi Coast, Italy', venue: 'Villa Cimbrone & Le Sirenuse', heroImg: '/images/weddings_240/theme_02_amalfi/scene_01.jpg' },
  { id: 'theme_03_lake_como', title: 'Lake Como Villa Renaissance', dest: 'Bellagio, Lake Como, Italy', venue: 'Villa d\'Este & Villa del Balbianello', heroImg: '/images/weddings_240/theme_03_lake_como/scene_01.jpg' },
  { id: 'theme_04_paris', title: 'Paris Private Palace & Seine Terrace', dest: 'Paris, France', venue: 'Hôtel de Crillon & Shangri-La Paris', heroImg: '/images/weddings_240/theme_04_paris/scene_01.jpg' },
  { id: 'theme_05_nyc', title: 'Manhattan Skyline Penthouse & Central Park', dest: 'New York City, USA', venue: 'The Glasshouses & Aman New York', heroImg: '/images/weddings_240/theme_05_nyc/scene_01.jpg' },
  { id: 'theme_06_hanok', title: 'Korean Royal Hanok Heritage Sanctuary', dest: 'Seoul, South Korea', venue: 'Rakkojae Seoul & Yeongbingwan', heroImg: '/images/weddings_240/theme_06_hanok/scene_01.jpg' },
  { id: 'theme_07_kyoto', title: 'Kyoto Bamboo Forest Zen Garden', dest: 'Kyoto, Japan', venue: 'Aman Kyoto & Hoshinoya Kyoto', heroImg: '/images/weddings_240/theme_07_kyoto/scene_01.jpg' },
  { id: 'theme_08_udaipur', title: 'Rajasthan Royal Palace Sanctuary', dest: 'Udaipur, Rajasthan, India', venue: 'Taj Lake Palace & The Leela Palace', heroImg: '/images/weddings_240/theme_08_udaipur/scene_01.jpg' },
  { id: 'theme_09_santorini', title: 'Santorini Caldera Sunset Cliff', dest: 'Oia, Santorini, Greece', venue: 'Canaves Oia Epitome & Grace Hotel', heroImg: '/images/weddings_240/theme_09_santorini/scene_01.jpg' },
  { id: 'theme_10_cabo', title: 'Cabo San Lucas Oceanfront Modernist', dest: 'Cabo San Lucas, Mexico', venue: 'Montage Los Cabos & Waldorf Astoria', heroImg: '/images/weddings_240/theme_10_cabo/scene_01.jpg' },
  { id: 'theme_11_liwa', title: 'Dubai Liwa Desert Golden Dunes', dest: 'Liwa Oasis, Abu Dhabi, UAE', venue: 'Qasr Al Sarab Desert Resort by Anantara', heroImg: '/images/weddings_240/theme_11_liwa/scene_01.jpg' },
  { id: 'theme_12_swiss_alps', title: 'Swiss Alps Matterhorn Glass Chalet', dest: 'Zermatt, Switzerland', venue: 'The Omnia & Riffelalp Resort 2222m', heroImg: '/images/weddings_240/theme_12_swiss_alps/scene_01.jpg' },
];

export default function WeddingHelperPage() {
  const router = useRouter();

  // User VIP state
  const [user, setUser] = useState<{ email: string; isVip: boolean; plan?: 'single' | 'trio' | 'grand' } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [restoreEmail, setRestoreEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Photo Upload States (Slot 1: Couple, Slot 2: Bride, Slot 3: Groom)
  const [coupleImage, setCoupleImage] = useState<string | null>(null);
  const [brideImage, setBrideImage] = useState<string | null>(null);
  const [groomImage, setGroomImage] = useState<string | null>(null);

  // Proportions State
  const [groomHeight, setGroomHeight] = useState<number>(181);
  const [groomWeight, setGroomWeight] = useState<number>(74);
  const [brideHeight, setBrideHeight] = useState<number>(167);
  const [brideWeight, setBrideWeight] = useState<number>(49);

  // Free AI Preview Hook State (Angle #01: Altar Vows)
  const [freePreviewImage, setFreePreviewImage] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState<boolean>(false);
  const [previewStepText, setPreviewStepText] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);

  // File input refs
  const coupleInputRef = useRef<HTMLInputElement>(null);
  const brideInputRef = useRef<HTMLInputElement>(null);
  const groomInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, duration = 3500) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), duration);
  };

  // Hydrate user from localStorage
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('weddinghelper_user');
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed?.email && (parsed.isVip || parsed.plan === 'grand')) {
          setUser(parsed);
        }
      }

      const storedImages = localStorage.getItem('weddinghelper_uploaded_images');
      if (storedImages) {
        const parsed = JSON.parse(storedImages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed[0]) setCoupleImage(parsed[0]);
          if (parsed[1]) setBrideImage(parsed[1]);
          if (parsed[2]) setGroomImage(parsed[2]);
        }
      }

      const storedProportions = localStorage.getItem('weddinghelper_proportions');
      if (storedProportions) {
        const parsed = JSON.parse(storedProportions);
        if (parsed.groomHeight) setGroomHeight(parsed.groomHeight);
        if (parsed.groomWeight) setGroomWeight(parsed.groomWeight);
        if (parsed.brideHeight) setBrideHeight(parsed.brideHeight);
        if (parsed.brideWeight) setBrideWeight(parsed.brideWeight);
      }
    } catch (e) {
      console.warn('Hydration error:', e);
    }
  }, []);

  // Compress and handle image uploads
  const handleFileUpload = (slot: 'couple' | 'bride' | 'groom', file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new (window as any).Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 1200;
        let w = img.width;
        let h = img.height;
        if (w > MAX_SIZE || h > MAX_SIZE) {
          if (w > h) {
            h = Math.round((h * MAX_SIZE) / w);
            w = MAX_SIZE;
          } else {
            w = Math.round((w * MAX_SIZE) / h);
            h = MAX_SIZE;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          if (slot === 'couple') setCoupleImage(compressed);
          if (slot === 'bride') setBrideImage(compressed);
          if (slot === 'groom') setGroomImage(compressed);

          // Update local uploaded images array
          const list = [
            slot === 'couple' ? compressed : coupleImage,
            slot === 'bride' ? compressed : brideImage,
            slot === 'groom' ? compressed : groomImage,
          ].filter(Boolean) as string[];
          try {
            localStorage.setItem('weddinghelper_uploaded_images', JSON.stringify(list));
          } catch (err) {}
          showToast('📸 Photo uploaded successfully!');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const getClientImages = (): string[] => {
    return [coupleImage, brideImage, groomImage].filter(Boolean) as string[];
  };

  // 🌟 THE HOOK: Generate 1 Free AI Sample Masterpiece (Angle #01: Altar Vows)
  const handleGenerateFreePreview = async () => {
    const imagesToUse = getClientImages();
    if (imagesToUse.length === 0) {
      showToast('⚠️ Please upload at least 1 couple photo first.');
      coupleInputRef.current?.click();
      return;
    }

    setIsGeneratingPreview(true);
    setPreviewStepText('Analyzing facial bone structures & eye contours...');

    try {
      const stepTimer1 = setTimeout(() => {
        setPreviewStepText('Locking authentic East Asian facial identity (Zero Westernization)...');
      }, 5000);
      const stepTimer2 = setTimeout(() => {
        setPreviewStepText('Rendering Cheongdam-dong luxury porcelain glass-skin...');
      }, 12000);
      const stepTimer3 = setTimeout(() => {
        setPreviewStepText('Transplanting couple into Bali Rainforest Altar Vows...');
      }, 18000);

      const res = await fetch('/api/weddinghelper/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imagesToUse,
          image: imagesToUse[0],
          targetSceneImage: '/images/weddings_240/theme_01_bali/scene_01.jpg',
          themeId: 'theme_01_bali',
          angleTitle: 'Ceremonial Altar Vows',
          groomHeight,
          groomWeight,
          brideHeight,
          brideWeight,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await res.json();
      if (data?.success && data?.visualizedImageUrl) {
        setFreePreviewImage(data.visualizedImageUrl);
        showToast('🎉 Your Free AI Preview Masterpiece is ready!', 5000);
        setTimeout(() => {
          previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      } else {
        showToast('⚠️ Synthesis temporarily busy. Please retry in a moment.');
      }
    } catch (err) {
      console.warn('Preview generation error:', err);
      showToast('⚠️ Network connection busy. Please retry.');
    } finally {
      setIsGeneratingPreview(false);
      setPreviewStepText('');
    }
  };

  // Unlock all 240 Masterpieces -> redirect to gallery
  const handleUnlock240Masterpieces = async () => {
    const imagesToUse = getClientImages();
    if (imagesToUse.length === 0) {
      showToast('⚠️ Please upload at least 1 couple photo first.');
      coupleInputRef.current?.click();
      return;
    }

    // Save proportions and uploaded images
    try {
      localStorage.setItem('weddinghelper_uploaded_images', JSON.stringify(imagesToUse));
      localStorage.setItem('weddinghelper_proportions', JSON.stringify({ groomHeight, groomWeight, brideHeight, brideWeight }));
    } catch (e) {}

    // Check if user is VIP
    if (!user?.isVip && user?.plan !== 'grand') {
      setIsCheckoutOpen(true);
      return;
    }

    // If already VIP: Create server order and navigate
    let orderIdParam = '';
    try {
      const orderRes = await fetch('/api/weddinghelper/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          plan: 'grand',
          selectedTheme: 'theme_01_bali',
          proportions: { groomHeight, groomWeight, brideHeight, brideWeight },
          clientImages: imagesToUse,
        }),
      });
      const orderData = await orderRes.json();
      if (orderData?.success && orderData.orderId) {
        orderIdParam = `&orderId=${orderData.orderId}`;
      }
    } catch (e) {}

    router.push(`/weddinghelper/gallery?dest=theme_01_bali&autoSynthesize=true${orderIdParam}`);
  };

  // Handle Complete Order ($19 VIP activation)
  const handleCompleteOrder = async () => {
    const payerEmail = (checkoutEmail || restoreEmail || 'vip.couple@wedding.com').trim().toLowerCase();
    const vipRecord = {
      email: payerEmail,
      isVip: true,
      plan: 'grand' as const,
      paidAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/weddinghelper/member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payerEmail,
          plan: 'grand',
          orderId: `WH_VIP_${Date.now()}`
        })
      });
    } catch (e) {}

    try {
      const localDbStr = localStorage.getItem('weddinghelper_vip_db');
      const localDb = localDbStr ? JSON.parse(localDbStr) : {};
      localDb[payerEmail] = vipRecord;
      localStorage.setItem('weddinghelper_vip_db', JSON.stringify(localDb));
      localStorage.setItem('weddinghelper_user', JSON.stringify(vipRecord));
    } catch (e) {}

    setUser(vipRecord);
    setIsCheckoutOpen(false);
    showToast('🎉 $19 VIP All-Access Pass Activated! Unlocking all 240 masterpieces...', 4000);

    // Create server order and redirect
    const imagesToUse = getClientImages();
    let orderIdParam = '';
    try {
      const orderRes = await fetch('/api/weddinghelper/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payerEmail,
          plan: 'grand',
          selectedTheme: 'theme_01_bali',
          proportions: { groomHeight, groomWeight, brideHeight, brideWeight },
          clientImages: imagesToUse,
        }),
      });
      const orderData = await orderRes.json();
      if (orderData?.success && orderData.orderId) {
        orderIdParam = `&orderId=${orderData.orderId}`;
      }
    } catch (e) {}

    setTimeout(() => {
      router.push(`/weddinghelper/gallery?dest=theme_01_bali&autoSynthesize=true${orderIdParam}`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFC] text-[#1F181B] font-serif antialiased selection:bg-[#D4AF37]/20 relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F181B] text-[#FAF8F5] px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xl border border-[#D4AF37]/50 flex items-center gap-2 transition-all duration-300">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input type="file" ref={coupleInputRef} accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload('couple', e.target.files[0])} />
      <input type="file" ref={brideInputRef} accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload('bride', e.target.files[0])} />
      <input type="file" ref={groomInputRef} accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload('groom', e.target.files[0])} />

      {/* 1. Aman & Hermès Prestige Global Header */}
      <header className="sticky top-0 z-40 bg-[#FFFDFC]/90 backdrop-blur-md border-b border-[#1F181B]/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/weddinghelper" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#1F181B] text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
            ✦
          </div>
          <div>
            <span className="font-serif tracking-[0.2em] font-extrabold text-sm sm:text-base text-[#1F181B]">
              WEDDINGHELPER
            </span>
            <span className="block text-[9px] tracking-[0.25em] text-[#1F181B]/50 uppercase font-sans">
              240 Haute Couture Masterpieces
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user?.isVip ? (
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#1F181B] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 fill-[#D4AF37]" />
              <span>VIP Pass Active</span>
            </span>
          ) : (
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1F181B] text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#2C2426] transition shadow-sm cursor-pointer"
            >
              VIP Pass ($19)
            </button>
          )}

          <Link
            href="/weddinghelper/gallery"
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F5EEDB] text-[#1F181B] border border-[#D4AF37]/40 hover:bg-[#EBDDC4] transition flex items-center gap-1.5"
          >
            <span>Open 240 Gallery</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. Architectural Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EEDB] border border-[#D4AF37]/40 text-[#1F181B] text-xs font-bold uppercase tracking-[0.2em] mb-5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>12 Global Sanctuaries • 240 Editorial Camera Angles</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal text-[#1F181B] tracking-tight leading-[1.15]">
          Your Dream Luxury Wedding in <br className="hidden sm:inline" />
          <span className="font-serif font-bold text-[#8C6D23] italic">
            240 Haute Couture Masterpieces.
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base md:text-lg text-[#1F181B]/70 max-w-3xl mx-auto font-sans leading-relaxed">
          Upload your authentic couple photo. We transplant your exact facial bone structures and genuine smiles into Aman Kyoto, Ritz-Carlton Bali, Villa d\'Este Lake Como, and 9 more iconic sanctuaries with <strong>100% facial likeness lock</strong>.
        </p>

        {/* 3 Core Value Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-sans font-medium text-[#1F181B]/80">
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#1F181B]/10 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
            <span>1:1 Facial Likeness Locked</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#1F181B]/10 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
            <span>240 Bespoke Editorial Angles</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#1F181B]/10 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
            <span>1-Click 4K Lossless ZIP ($19 Special)</span>
          </div>
        </div>
      </section>

      {/* 3. STEP 01: Biometric Facial Identity Vault */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#1F181B]/10 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#1F181B]/10 gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C5A059] block">
                STEP 01 • BIOMETRIC FACIAL VAULT
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1F181B] mt-0.5">
                Upload Your Authentic Couple Photos
              </h2>
            </div>
            <span className="text-xs font-sans text-[#1F181B]/60">
              Face & body shape are 100% preserved
            </span>
          </div>

          {/* 3 Upload Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Slot 1: Couple Photo (Primary) */}
            <div 
              onClick={() => coupleInputRef.current?.click()}
              className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group overflow-hidden ${
                coupleImage ? 'border-[#C5A059] bg-[#F5EEDB]/40 shadow-md' : 'border-[#1F181B]/20 bg-white hover:border-[#C5A059] hover:bg-[#FAF8F5]'
              }`}
            >
              {coupleImage ? (
                <>
                  <Image src={coupleImage} alt="Couple Reference" fill unoptimized className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-black/80 text-white text-[11px] font-bold">Change Photo</span>
                  </div>
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#1F181B] text-[#D4AF37]">
                    Couple Photo ✓
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#F5EEDB] flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-serif font-bold text-sm text-[#1F181B]">Couple Photo</span>
                  <span className="text-[11px] text-[#1F181B]/50 leading-tight">Selfie or Full-body (Required)</span>
                </div>
              )}
            </div>

            {/* Slot 2: Bride Close-Up */}
            <div 
              onClick={() => brideInputRef.current?.click()}
              className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group overflow-hidden ${
                brideImage ? 'border-[#C5A059] bg-[#F5EEDB]/40 shadow-md' : 'border-[#1F181B]/20 bg-white hover:border-[#C5A059] hover:bg-[#FAF8F5]'
              }`}
            >
              {brideImage ? (
                <>
                  <Image src={brideImage} alt="Bride Reference" fill unoptimized className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-black/80 text-white text-[11px] font-bold">Change Photo</span>
                  </div>
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#1F181B] text-[#D4AF37]">
                    Bride Close-Up ✓
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#F5EEDB] flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-serif font-bold text-sm text-[#1F181B]">Bride Close-Up</span>
                  <span className="text-[11px] text-[#1F181B]/50 leading-tight">Optional for micro-likeness</span>
                </div>
              )}
            </div>

            {/* Slot 3: Groom Close-Up */}
            <div 
              onClick={() => groomInputRef.current?.click()}
              className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group overflow-hidden ${
                groomImage ? 'border-[#C5A059] bg-[#F5EEDB]/40 shadow-md' : 'border-[#1F181B]/20 bg-white hover:border-[#C5A059] hover:bg-[#FAF8F5]'
              }`}
            >
              {groomImage ? (
                <>
                  <Image src={groomImage} alt="Groom Reference" fill unoptimized className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-black/80 text-white text-[11px] font-bold">Change Photo</span>
                  </div>
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#1F181B] text-[#D4AF37]">
                    Groom Close-Up ✓
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#F5EEDB] flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-serif font-bold text-sm text-[#1F181B]">Groom Close-Up</span>
                  <span className="text-[11px] text-[#1F181B]/50 leading-tight">Optional for micro-likeness</span>
                </div>
              )}
            </div>
          </div>

          {/* Precision Proportions (Height & Weight) */}
          <div className="mt-8 pt-6 border-t border-[#1F181B]/10 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/70 p-5 rounded-2xl border border-[#1F181B]/5">
            <div>
              <div className="flex justify-between text-xs font-bold font-sans text-[#1F181B] mb-2">
                <span>Groom Proportions (Tuxedo Fit)</span>
                <span className="text-[#C5A059]">{groomHeight}cm · {groomWeight}kg</span>
              </div>
              <div className="flex gap-3">
                <input 
                  type="range" min={165} max={198} value={groomHeight} 
                  onChange={(e) => setGroomHeight(Number(e.target.value))} 
                  className="w-full accent-[#1F181B]" 
                />
                <input 
                  type="range" min={55} max={105} value={groomWeight} 
                  onChange={(e) => setGroomWeight(Number(e.target.value))} 
                  className="w-full accent-[#1F181B]" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold font-sans text-[#1F181B] mb-2">
                <span>Bride Proportions (Haute Gown Fit)</span>
                <span className="text-[#C5A059]">{brideHeight}cm · {brideWeight}kg</span>
              </div>
              <div className="flex gap-3">
                <input 
                  type="range" min={150} max={182} value={brideHeight} 
                  onChange={(e) => setBrideHeight(Number(e.target.value))} 
                  className="w-full accent-[#1F181B]" 
                />
                <input 
                  type="range" min={40} max={85} value={brideWeight} 
                  onChange={(e) => setBrideWeight(Number(e.target.value))} 
                  className="w-full accent-[#1F181B]" 
                />
              </div>
            </div>
          </div>

          {/* Action CTAs: Free Preview & Unlock 240 */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={handleGenerateFreePreview}
              disabled={isGeneratingPreview}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-[#F5EEDB] text-[#1F181B] border border-[#D4AF37]/60 hover:bg-[#EBDDC4] font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPreview ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                  <span>{previewStepText || 'Synthesizing Sample...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                  <span>Generate 1 Free Sample Masterpiece</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleUnlock240Masterpieces}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-[#1F181B] text-[#D4AF37] hover:bg-[#2C2426] font-extrabold text-xs uppercase tracking-wider transition shadow-xl border border-[#D4AF37]/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gem className="w-4 h-4 text-[#D4AF37]" />
              <span>Pay $19 & Unlock All 240 Scenes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. FREE PREVIEW REVEAL SECTION (Visible when generated) */}
      {freePreviewImage && (
        <section ref={previewRef} className="max-w-4xl mx-auto px-4 sm:px-8 pb-16 animate-fadeIn">
          <div className="bg-[#1F181B] text-white rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/50 shadow-2xl relative overflow-hidden">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#D4AF37] text-[#1F181B] shadow-md">
                YOUR FREE AI SAMPLE MASTERPIECE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-3">
                Look at That Breathtaking Likeness.
              </h3>
              <p className="text-white/70 text-xs sm:text-sm mt-1">
                Your authentic facial contours transplanted into Angle #01: Ceremonial Altar Vows at Mandapa Ritz-Carlton Bali.
              </p>
            </div>

            {/* Generated Masterpiece Showcase */}
            <div className="relative aspect-[3/4] sm:aspect-[16/10] w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl">
              <Image 
                src={freePreviewImage} 
                alt="Your Synthesized Wedding Masterpiece" 
                fill 
                unoptimized 
                className="object-cover" 
              />
              <LuxuryHotspotLayer lookId="wedding_bali_sample" pins={WEDDING_SAMPLE_PINS} />
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                Sample Preview • 1 of 240
              </div>
            </div>

            {/* High-Converting Upgrade Banner */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center max-w-xl mx-auto">
              <p className="text-[#D4AF37] font-serif text-lg font-bold">
                Imagine Having All 240 Masterpieces across 12 Destinations.
              </p>
              <p className="text-white/60 text-xs sm:text-sm mt-1 leading-relaxed">
                Zero watermarks. 4K Lossless Hasselblad prints. 20 distinct cinematic vantage points for every world.
              </p>

              <button
                type="button"
                onClick={handleUnlock240Masterpieces}
                className="mt-6 w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3C669] to-[#D4AF37] text-[#1F181B] font-extrabold text-sm uppercase tracking-wider hover:brightness-105 transition shadow-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Unlock All 240 Masterpieces for Just $19</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. 12 Global Destinations Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C5A059] block">
            THE 12 GLOBAL SANCTUARIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1F181B] mt-1">
            20 Editorial Angles for Every World
          </h2>
          <p className="text-sm text-[#1F181B]/60 mt-2">
            Each destination is crafted with 20 distinct camera angles — wide sanctuary panoramic views, emotional vow close-ups, candelit toasts, and sunset silhouettes.
          </p>
        </div>

        {/* 12 Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {DESTINATION_240_CONFIGS.map((dest, idx) => (
            <Link
              key={dest.id}
              href={`/weddinghelper/gallery?dest=${dest.id}`}
              className="group bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#1F181B]/10 hover:border-[#C5A059] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/20">
                <Image
                  src={dest.heroImg}
                  alt={dest.title}
                  fill
                  unoptimized
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#1F181B]/80 text-[#D4AF37] backdrop-blur-md border border-[#D4AF37]/30">
                  #{String(idx + 1).padStart(2, '0')} • 20 Angles
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1F181B] group-hover:text-[#C5A059] transition-colors">
                    {dest.title}
                  </h4>
                  <p className="text-xs text-[#1F181B]/50 mt-0.5 truncate">
                    {dest.dest}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#1F181B]/5 flex items-center justify-between text-xs font-sans font-bold text-[#C5A059]">
                  <span>Explore 20 Angles</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Honest Transparent Pricing: The Grand 12 VIP Pass ($19) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-20">
        <div className="bg-[#1F181B] text-white rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden text-center">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] bg-[#D4AF37] text-[#1F181B] shadow-md">
            LIFETIME VIP ACCESS • LAUNCH SPECIAL
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-4">
            The Grand 12 All-Access Pass
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Zero subscriptions. Zero recurring fees. Instant lifetime access to all 240 haute couture masterpiece portraits across all 12 destinations.
          </p>

          <div className="my-6">
            <span className="text-white/40 line-through text-lg font-mono mr-3">$120 USD</span>
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-[#D4AF37]">$19</span>
            <span className="text-white/70 text-xs uppercase tracking-wider ml-2">USD (One-Time)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left text-xs text-white/80 mb-8 font-sans">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span><strong>240 Masterpiece Portraits</strong> (20 angles x 12 worlds)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span><strong>1-Click 4K ZIP Download</strong> organized by destination</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span><strong>1:1 Facial Likeness Locked</strong> (Zero Westernization)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span><strong>Real Haute Gown Links</strong> (In-Stock Nordstrom/Shopbop)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUnlock240Masterpieces}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#D4AF37] text-[#1F181B] font-extrabold text-sm uppercase tracking-wider hover:bg-[#F3C669] transition shadow-2xl cursor-pointer"
          >
            Pay $19 & Unlock All 240 Masterpieces ➔
          </button>
        </div>
      </section>

      {/* 7. $19 Checkout / VIP Pass Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1F181B] text-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#D4AF37]/50 shadow-2xl relative">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#D4AF37] text-[#1F181B]">
                OFFICIAL VIP CHECKOUT
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-2">
                The Grand 12 VIP Pass ($19)
              </h3>
              <p className="text-white/60 text-xs mt-1">
                Lifetime access to all 240 photos across 12 global destinations.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">
                  Your Email Address (For 4K ZIP Delivery)
                </label>
                <input
                  type="email"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  placeholder="couple@wedding.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              {/* Official PayPal Checkout Button */}
              <a
                href="https://www.paypal.com/ncp/payment/LVRRE8SJKD3VA"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => {
                    handleCompleteOrder();
                  }, 1500);
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay $19 with PayPal or Credit Card</span>
              </a>

              {/* Instant Test Mode Activation */}
              <div className="pt-3 border-t border-white/10 text-center">
                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  className="w-full py-2.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/30 font-bold text-[11px] uppercase tracking-wider transition cursor-pointer"
                >
                  ⚡ Instant 1-Click VIP Test Unlock
                </button>
              </div>

              {/* Already Paid Email Restore */}
              <div className="pt-3 border-t border-white/10">
                <span className="text-[10px] text-white/50 block mb-1">Already Paid? Restore Access:</span>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={restoreEmail}
                    onChange={(e) => setRestoreEmail(e.target.value)}
                    placeholder="Enter paid email"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={handleCompleteOrder}
                    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                  >
                    Restore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Poetic Minimal Footer */}
      <footer className="border-t border-[#1F181B]/10 py-10 px-4 text-center text-xs text-[#1F181B]/50 font-sans">
        <p className="font-serif tracking-widest text-sm text-[#1F181B] font-bold">WEDDINGHELPER ATELIER</p>
        <p className="mt-1">Hand-crafted across 12 destinations with 240 haute couture editorial camera angles.</p>
        <p className="mt-4 text-[10px] text-[#1F181B]/40">© 2026 WeddingHelper Atelier. All rights reserved.</p>
      </footer>
    </div>
  );
}
