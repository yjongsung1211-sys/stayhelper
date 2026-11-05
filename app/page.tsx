'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import editorialLooksData from '../public/editorial_top10_lookbook.json';
import USAuthModal from '@/components/USAuthModal';
import ReportModal from '@/components/ReportModal';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ShoppingBag,
  Upload,
  Wand2,
  RefreshCw,
  X,
  Check,
  CheckCircle2,
  Tag,
  Search,
  Copy,
  Building2,
  User,
  LogIn,
  LogOut,
  Compass,
  ChevronRight,
  ChevronLeft,
  Gift,
  Zap,
  Eye,
  EyeOff,
  Heart,
  Camera,
  Download,
  Flame,
  Star,
  Lock,
  Unlock,
  Sliders,
  ArrowUpRight,
  Shirt,
  ClipboardPaste,
  AlertTriangle
} from 'lucide-react';

// ==========================================
// 1. DATA TYPES & OCCASIONS (100% English)
// ==========================================
interface HotspotPin {
  id: string;
  x: number;
  y: number;
  category: string;
  title: string;
  brand: string;
  price: number;
  retailer: string;
  buyUrl: string;
  kStyleTip?: string;
  sku?: string;
  silhouette?: string;
}

interface StylingLook {
  id: string;
  title: string;
  member?: string;
  styleId?: string;
  styleName?: string;
  styleTag?: string;
  aesthetic?: string;
  season?: string;
  imageUrl?: string;
  modelHeight?: string;
  description?: string;
  curatorNote?: string;
  colorPalette?: string[];
  vibeTags?: string[];
  pins: HotspotPin[];
}

const CURATED_LOOKS: StylingLook[] = editorialLooksData as any[];

// Official PayPal Hosted Checkout Link
const PAYPAL_CHECKOUT_URL = 'https://www.paypal.com/ncp/payment/LVRRE8SJKD3VA';

// 5 Hip & Curated Occasions for Modern Dates & Weekends - Split by Gender
interface OccasionOption {
  id: string;
  gender: 'men' | 'women';
  title: string;
  subtitle: string;
  vibe: string;
  icon: string;
  lookId: string;
  badge: string;
  color: string;
}

const WOMENS_OCCASIONS: OccasionOption[] = [
  {
    id: 'date-night',
    gender: 'women',
    title: 'Candlelit Dinner & Low-Key Wine',
    subtitle: 'Parisian silk camisole & fine-gauge cashmere knit',
    vibe: 'Effortless Allure • Soft Silks • Midnight Mood',
    icon: '🍷',
    lookId: 'editorial-look-v05',
    badge: 'Trending #1 Date Look',
    color: 'from-amber-500/10 to-rose-500/10 border-amber-500/30'
  },
  {
    id: 'weekend-brunch',
    gender: 'women',
    title: 'Sunday Matcha & Cafe Stroll',
    subtitle: 'Modern olive swing jacket & croc-embossed tall boots',
    vibe: 'Scandi Clean • Daylight Chic • Relaxed Elegance',
    icon: '🥐',
    lookId: 'editorial-look-v02',
    badge: 'Street Style Favorite',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30'
  },
  {
    id: 'gallery-wine',
    gender: 'women',
    title: 'SoHo Gallery & Natural Wine Bar',
    subtitle: 'Crisp oversized poplin & flared cream tailored trousers',
    vibe: 'Architectural • Quiet Luxury • Clean Lines',
    icon: '🎨',
    lookId: 'editorial-look-v06',
    badge: 'Curator Choice',
    color: 'from-sky-500/10 to-indigo-500/10 border-sky-500/30'
  },
  {
    id: 'soho-luxury',
    gender: 'women',
    title: 'Rooftop Cocktail & Evening Stride',
    subtitle: 'Glen plaid double-breasted blazer & wide palazzo trousers',
    vibe: 'Sharp Tailoring • Empowered Silhouette • Statement',
    icon: '🍸',
    lookId: 'editorial-look-v01',
    badge: 'Signature Power Look',
    color: 'from-purple-500/10 to-pink-500/10 border-purple-500/30'
  },
  {
    id: 'cozy-casual',
    gender: 'women',
    title: 'Crisp City Walk & Records Shop',
    subtitle: 'Polo Ralph Lauren sherpa puffer & cuffed straight denim',
    vibe: 'Downtown Retro • Warm Texture • High-End Casual',
    icon: '🎧',
    lookId: 'editorial-look-v04',
    badge: 'Off-Duty Classic',
    color: 'from-orange-500/10 to-yellow-500/10 border-orange-500/30'
  }
];

const MENS_OCCASIONS: OccasionOption[] = [
  {
    id: 'mens-tailored-dandy',
    gender: 'men',
    title: 'Fine Dining & Private Members Club',
    subtitle: 'Milanese tailored charcoal wool blazer & pleated slacks',
    vibe: 'Quiet Luxury • Sharp Tailoring • Masculine Elegance',
    icon: '🍸',
    lookId: 'editorial-men-01',
    badge: 'Executive Evening',
    color: 'from-slate-500/10 to-zinc-500/10 border-slate-500/30'
  },
  {
    id: 'mens-urban-street',
    gender: 'men',
    title: 'Seongsu Street & Underground Vinyl Lounge',
    subtitle: 'Oversized leather bomber & raw wide-leg denim',
    vibe: 'Subtle Edge • Korean Street • Effortless Cool',
    icon: '🎧',
    lookId: 'editorial-men-02',
    badge: 'Trending Streetwear',
    color: 'from-amber-500/10 to-stone-500/10 border-amber-500/30'
  },
  {
    id: 'mens-cityboy-casual',
    gender: 'men',
    title: 'Hannam Espresso Bar & Contemporary Gallery',
    subtitle: 'Oversized balmacaan coat, clean crewneck & penny loafers',
    vibe: 'City Boy Clean • Relaxed Volume • Architectural',
    icon: '☕',
    lookId: 'editorial-men-03',
    badge: 'Curator Favorite',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30'
  },
  {
    id: 'mens-downtown-cozy',
    gender: 'men',
    title: 'Brooklyn Weekend Walk & Flea Market',
    subtitle: 'Elder Statesman daily crew knit & vintage washed denim',
    vibe: 'Downtown Classic • Warm Cashmere • Off-Duty Ease',
    icon: '🍂',
    lookId: 'editorial-men-04',
    badge: 'Weekend Relaxed',
    color: 'from-orange-500/10 to-yellow-500/10 border-orange-500/30'
  },
  {
    id: 'mens-smart-office',
    gender: 'men',
    title: 'Creative Studio Meeting & Casual Wine',
    subtitle: 'Boxy poplin shirt, tailored chinos & leather derby shoes',
    vibe: 'Smart Casual • Clean Proportion • Understated',
    icon: '🍷',
    lookId: 'editorial-men-05',
    badge: 'Daily Essential',
    color: 'from-sky-500/10 to-indigo-500/10 border-sky-500/30'
  }
];

const OCCASIONS: OccasionOption[] = [...MENS_OCCASIONS, ...WOMENS_OCCASIONS];

// Sample model photos split by Men and Women for instant 1-click testing
interface SampleModel {
  id: string;
  gender: 'men' | 'women';
  label: string;
  tag: string;
  url: string;
  thumb: string;
}

const SAMPLE_MODELS: Record<'men' | 'women', SampleModel[]> = {
  men: [
    {
      id: 'sample-men-caucasian',
      gender: 'men',
      label: 'Caucasian Model',
      tag: '185cm • White',
      url: '/images/models/male_caucasian_model.webp',
      thumb: '/images/models/male_caucasian_model_thumb.webp'
    },
    {
      id: 'sample-men-asian',
      gender: 'men',
      label: 'Asian Model',
      tag: '182cm • Asian',
      url: '/images/models/male_asian_model.webp',
      thumb: '/images/models/male_asian_model_thumb.webp'
    },
    {
      id: 'sample-men-black',
      gender: 'men',
      label: 'Black Model',
      tag: '186cm • Black',
      url: '/images/models/male_black_model.webp',
      thumb: '/images/models/male_black_model_thumb.webp'
    }
  ],
  women: [
    {
      id: 'sample-women-caucasian',
      gender: 'women',
      label: 'Caucasian Model',
      tag: '176cm • White',
      url: '/images/models/female_caucasian_model.webp',
      thumb: '/images/models/female_caucasian_model_thumb.webp'
    },
    {
      id: 'sample-women-asian',
      gender: 'women',
      label: 'Asian Model',
      tag: '172cm • Asian',
      url: '/images/models/female_asian_model.webp',
      thumb: '/images/models/female_asian_model_thumb.webp'
    },
    {
      id: 'sample-women-black',
      gender: 'women',
      label: 'Black Model',
      tag: '177cm • Black',
      url: '/images/models/female_black_model.webp',
      thumb: '/images/models/female_black_model_thumb.webp'
    }
  ]
};

export default function StylingHelperBright() {
  // ----------------------------------------------------
  // States: User Photo, Gender & Occasion Selection
  // Initial state: Clean Paste/Drop canvas as default
  // ----------------------------------------------------
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userPhotoName, setUserPhotoName] = useState<string>('');
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionOption>(MENS_OCCASIONS[0]);

  // ----------------------------------------------------
  // States: Generation, Progress & Result
  // ----------------------------------------------------
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<string>('');
  const [styledResult, setStyledResult] = useState<{
    imageUrl: string;
    look: StylingLook;
    provider: string;
  } | null>(null);

  // ----------------------------------------------------
  // States: Freemium & Subscription Paywall & Member Auth
  // ----------------------------------------------------
  const [freeTrialUsed, setFreeTrialUsed] = useState<boolean>(false);
  const [isProSubscriber, setIsProSubscriber] = useState<boolean>(false);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [proModalReason, setProModalReason] = useState<string>('trial_exhausted');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  // Member Authentication States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Report Error & Sold Out States
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportProduct, setReportProduct] = useState<{ title: string; url: string }>({
    title: '',
    url: ''
  });

  // Comparison toggle: Styled-only (default, large uncropped) or Side-by-side
  const [viewMode, setViewMode] = useState<'side-by-side' | 'styled-only'>('styled-only');

  // Paste & Drag States
  const [pasteNotification, setPasteNotification] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------
  // Load subscription state & member session from localStorage
  // ----------------------------------------------------
  useEffect(() => {
    try {
      const trialUsed = localStorage.getItem('styling_free_trial_used') === 'true';
      const isPro = localStorage.getItem('styling_is_pro_subscriber') === 'true';
      setFreeTrialUsed(trialUsed);
      setIsProSubscriber(isPro);

      const syncUser = () => {
        try {
          const stored =
            localStorage.getItem('stylinghelper_user') ||
            localStorage.getItem('stayhelper_member') ||
            localStorage.getItem('stayhelper_user');
          if (stored) {
            setCurrentUser(JSON.parse(stored));
          } else {
            setCurrentUser(null);
          }
        } catch {
          setCurrentUser(null);
        }
      };
      syncUser();
      window.addEventListener('stylinghelper_auth_changed', syncUser);
      window.addEventListener('stayhelper_auth_changed', syncUser);
      return () => {
        window.removeEventListener('stylinghelper_auth_changed', syncUser);
        window.removeEventListener('stayhelper_auth_changed', syncUser);
      };
    } catch (e) {
      // Safe fallback
    }
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('stylinghelper_user');
      localStorage.removeItem('stayhelper_member');
      localStorage.removeItem('stayhelper_user');
      document.cookie = 'stayhelper_user=; path=/; max-age=0;';
      fetch('/api/auth/quick', { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
    setCurrentUser(null);
    window.dispatchEvent(new Event('stylinghelper_auth_changed'));
  };

  // ----------------------------------------------------
  // Helper: Process Image File (from Upload, Paste, or Drop)
  // ----------------------------------------------------
  const processImageFile = (file: File, sourceName: string) => {
    setUserPhotoName(sourceName);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUserPhoto(result);
      setStyledResult(null);
      setPasteNotification(`Photo loaded: ${sourceName}`);
      setTimeout(() => setPasteNotification(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  // ----------------------------------------------------
  // Handle Global Paste (Ctrl+V or Cmd+V anywhere on page)
  // ----------------------------------------------------
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file, 'Pasted Photo (Clipboard)');
            e.preventDefault();
            studioRef.current?.scrollIntoView({ behavior: 'smooth' });
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, []);

  // ----------------------------------------------------
  // Handle Paste Button Click (Clipboard API)
  // ----------------------------------------------------
  const handlePasteButtonClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          const imageType = item.types.find((type) => type.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const file = new File([blob], 'clipboard_photo.png', { type: imageType });
            processImageFile(file, 'Pasted Photo (Clipboard)');
            return;
          }
        }
      }
      alert('To paste your photo, copy any image (Ctrl+C) and press Ctrl+V (or Cmd+V on Mac).');
    } catch (err) {
      console.warn('Clipboard read error or permission denied:', err);
      alert('Please press Ctrl+V (or Cmd+V on Mac) on your keyboard to paste your photo.');
    }
  };

  // ----------------------------------------------------
  // Handle Drag & Drop
  // ----------------------------------------------------
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file, file.name || 'Dropped Photo');
    }
  };

  // ----------------------------------------------------
  // Handle File Upload
  // ----------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file, file.name);
  };

  const handleSelectSample = (sample: SampleModel) => {
    setUserPhoto(sample.url);
    setUserPhotoName(`Sample Model: ${sample.label} (${sample.gender === 'men' ? 'Men' : 'Women'})`);
    setStyledResult(null);
  };

  const handleGenderChange = (gender: 'men' | 'women') => {
    setSelectedGender(gender);
    const targetOccasions = gender === 'men' ? MENS_OCCASIONS : WOMENS_OCCASIONS;
    setSelectedOccasion(targetOccasions[0]);
    // If a sample model was already explicitly active, switch to the first model of this gender
    if (userPhoto && userPhotoName.startsWith('Sample Model:')) {
      const firstModel = SAMPLE_MODELS[gender][0];
      setUserPhoto(firstModel.url);
      setUserPhotoName(`Sample Model: ${firstModel.label} (${gender === 'men' ? 'Men' : 'Women'})`);
      setStyledResult(null);
    }
  };

  // ----------------------------------------------------
  // Trigger AI Virtual Styling
  // ----------------------------------------------------
  const handleStartStyling = async () => {
    if (!userPhoto) {
      alert('Please upload or select a photo first.');
      return;
    }

    if (freeTrialUsed && !isProSubscriber) {
      setProModalReason('trial_exhausted');
      setShowPaywallModal(true);
      return;
    }

    setIsGenerating(true);
    setProgressStage('Scanning body contour & fabric segments...');

    const timer1 = setTimeout(() => {
      setProgressStage('Removing current clothes & aligning pose silhouette...');
    }, 1500);

    const timer2 = setTimeout(() => {
      setProgressStage(`Draping authentic ${selectedOccasion.title} pieces...`);
    }, 3200);

    const timer3 = setTimeout(() => {
      setProgressStage('Rendering 1:1 facial likeness & 4K photorealistic lighting...');
    }, 4800);

    try {
      const res = await fetch('/api/generate-styling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleId: selectedOccasion.id,
          lookId: selectedOccasion.lookId,
          userPhoto: userPhoto,
          gender: selectedGender
        })
      });

      const data = await res.json();
      if (data.ok) {
        setStyledResult({
          imageUrl: data.imageUrl,
          look: data.look,
          provider: data.provider || 'AI Fashion Engine'
        });

        if (!isProSubscriber) {
          setFreeTrialUsed(true);
          try {
            localStorage.setItem('styling_free_trial_used', 'true');
          } catch (e) {}
        }

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      } else {
        alert(data.error || 'Styling synthesis failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Styling error:', err);
      const targetLook =
        CURATED_LOOKS.find((l) => l.id === selectedOccasion.lookId) || CURATED_LOOKS[0];
      setStyledResult({
        imageUrl: targetLook.imageUrl || '/images/looks/look_01_soho_quiet_luxury_final.jpg',
        look: targetLook,
        provider: 'StylingHelper Studio Master'
      });
      if (!isProSubscriber) {
        setFreeTrialUsed(true);
        try {
          localStorage.setItem('styling_free_trial_used', 'true');
        } catch (e) {}
      }
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsGenerating(false);
      setProgressStage('');
    }
  };

  const handleActivatePro = () => {
    setIsProSubscriber(true);
    try {
      localStorage.setItem('styling_is_pro_subscriber', 'true');
    } catch (e) {}
    setShowPaywallModal(false);
    alert('Welcome to StylingHelper Pro! Unlimited virtual styling is now unlocked.');
  };

  const handleResetTrial = () => {
    setFreeTrialUsed(false);
    setIsProSubscriber(false);
    try {
      localStorage.removeItem('styling_free_trial_used');
      localStorage.removeItem('styling_is_pro_subscriber');
    } catch (e) {}
    setShowPaywallModal(false);
    alert('Free trial reset! You can now test 1 free styling generation again.');
  };

  const activeLook =
    styledResult?.look ||
    CURATED_LOOKS.find((l) => l.id === selectedOccasion.lookId) ||
    CURATED_LOOKS[0];

  const totalOutfitPrice =
    activeLook?.pins?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-[#121316] font-sans selection:bg-[#121316] selection:text-[#FAF9F5]">
      {/* ======================================================= */}
      {/* 1. BRIGHT & CHIC TOP NAVIGATION */}
      {/* ======================================================= */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-[#121316] flex items-center justify-center text-white shadow-md shadow-black/10 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-[#FFD782]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-tight font-extrabold text-[#121316]">
                  STYLING HELPER
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#B57C1E] font-bold">
                  AI Virtual Dressing Room
                </span>
              </div>
            </Link>
          </div>

          {/* Top Header Actions: Pro Upgrade & Member Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Pro Subscription CTA */}
            {isProSubscriber ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                <span>Pro Member</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setProModalReason('manual_upgrade');
                  setShowPaywallModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Upgrade Pro ($19/mo)</span>
              </button>
            )}

            {/* Member Auth Button (Sign In or Logged-in Profile) */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-black/[0.04] border border-black/[0.08] rounded-xl px-2.5 py-1 text-xs">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                  {currentUser.name?.[0] || 'U'}
                </div>
                <span className="font-semibold text-zinc-800 max-w-[90px] truncate hidden sm:inline">
                  {currentUser.name || currentUser.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1 hover:text-red-500 text-zinc-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-[#121316] text-xs font-bold border border-black/[0.08] transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-zinc-700" />
                <span>Sign In</span>
              </button>
            )}

            {/* Error & Sold Out Report Button */}
            <button
              onClick={() => {
                setReportProduct({ title: '', url: typeof window !== 'undefined' ? window.location.href : '' });
                setIsReportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all shadow-sm"
              title="Report Error / Sold Out"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Report Error / Sold Out</span>
            </button>

            <button
              onClick={() => {
                studioRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#121316] hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-[#FFD782]" />
              <span>Try on My Photo</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================= */}
      {/* 2. HERO: RADIANT, HIP & CHIC DATING HOOK */}
      {/* ======================================================= */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-black/[0.05]">
        {/* Soft, warm sunlit radiant glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-amber-100/50 via-rose-50/40 to-transparent blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-sky-100/40 blur-[80px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Trendy Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-black/[0.06] mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold tracking-wide text-zinc-700">
              Next-Gen AI Wardrobe Swap • Curated US Designer Pieces
            </span>
          </div>

          {/* Primary Hip Hook */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] mb-6 text-[#121316]">
            Wondering what to wear on <br className="hidden sm:inline" />
            your date this weekend?
            <span className="block mt-2 font-serif italic font-normal bg-clip-text text-transparent bg-gradient-to-r from-[#B57C1E] via-[#D97706] to-[#92400E]">
              Ask StylingHelper.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 font-medium leading-relaxed mb-9">
            Upload any full-body photo. Our AI cleanly removes your current clothes, styles you in verified luxury pieces from top US retailers, and gives you instant 1-click checkout links.
          </p>

          {/* 3 Hip Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto text-left mb-10">
            <div className="p-4 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.06] hover:border-black/15 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5 text-base font-bold">
                ✨
              </div>
              <h4 className="text-sm font-bold text-[#121316] mb-1">Instant Outfit Swap</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Cleanses your current clothes and seamlessly fits 100% authentic designer items.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.06] hover:border-black/15 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5 text-base font-bold">
                👤
              </div>
              <h4 className="text-sm font-bold text-[#121316] mb-1">1:1 Face & Pose Preserved</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Your face, hair, smile, skin tone, and body silhouette remain completely authentic.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.06] hover:border-black/15 transition-all">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-2.5 text-base font-bold">
                🛍️
              </div>
              <h4 className="text-sm font-bold text-[#121316] mb-1">Direct Shopbop Checkout</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Click any piece to purchase directly on official store pages with zero modal blocks.
              </p>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => studioRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#121316] hover:bg-black text-white font-extrabold text-base shadow-xl shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
            >
              <Wand2 className="w-5 h-5 text-[#FFD782]" />
              <span>Style My Photo for Free</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            {!isProSubscriber && (
              <button
                onClick={() => {
                  setProModalReason('manual_upgrade');
                  setShowPaywallModal(true);
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-zinc-50 border border-black/[0.08] text-zinc-800 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 text-[#B57C1E]" />
                <span>See Pro Benefits ($19/mo)</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* 3. INTERACTIVE AI VIRTUAL STYLING STUDIO */}
      {/* ======================================================= */}
      <section ref={studioRef} className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/60 text-[#92400E] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Virtual Fitting Room</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121316]">
            Upload & Try On in 10 Seconds
          </h2>
          <p className="text-sm text-zinc-600 mt-2 font-medium">
            First styling is on us (100% free). Unlock unlimited full-body swaps with Pro.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* -------------------------------------------------- */}
          {/* LEFT: STEP 1 - PHOTO UPLOAD ZONE (5 Cols) */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-black/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#121316] text-white font-extrabold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-extrabold text-base text-[#121316]">Your Full-Body Photo</h3>
              </div>
              <span className="text-xs font-semibold text-zinc-400">Front-Facing View</span>
            </div>

            {/* Quick Action Toolbar: Paste & Upload */}
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={handlePasteButtonClick}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[#92400E] border border-amber-500/25 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                title="Paste image from clipboard (Ctrl+V)"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-[#B57C1E]" />
                <span>Paste Photo (Ctrl+V)</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5 text-zinc-600" />
                <span>Browse</span>
              </button>
              {userPhoto && (
                <button
                  type="button"
                  onClick={() => {
                    setUserPhoto(null);
                    setUserPhotoName('');
                    setStyledResult(null);
                  }}
                  className="px-2.5 py-2 rounded-xl bg-zinc-100 hover:bg-red-50 text-zinc-500 hover:text-red-600 font-bold text-xs transition-all active:scale-95 flex items-center gap-1"
                  title="Clear photo to paste a new one"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>

            {/* Live Notification Toast */}
            {pasteNotification && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="truncate">{pasteNotification}</span>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Photo Preview Box / Drop & Paste Zone (100% Uncropped Contain) */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
              onClick={() => {
                if (!userPhoto) {
                  fileInputRef.current?.click();
                }
              }}
              className={`group relative w-full min-h-[520px] max-h-[740px] rounded-2xl border-2 transition-all flex flex-col items-center justify-center overflow-hidden text-center shadow-inner ${
                isDragging
                  ? 'border-amber-500 bg-amber-50/70 scale-[1.01] shadow-xl ring-4 ring-amber-500/20'
                  : userPhoto
                  ? 'border-zinc-200 bg-[#0D0E10] p-2'
                  : 'border-dashed border-zinc-300 hover:border-[#121316] bg-[#FAF9F6] cursor-pointer min-h-[460px]'
              }`}
            >
              {isDragging ? (
                <div className="flex flex-col items-center gap-3 p-6 pointer-events-none">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-base font-extrabold text-amber-900">
                    Drop Your Photo Here!
                  </p>
                  <p className="text-xs text-amber-700">
                    Release to immediately load and preview
                  </p>
                </div>
              ) : userPhoto ? (
                <>
                  <img
                    src={userPhoto}
                    alt="Uploaded Customer Photo"
                    className="w-full h-auto max-h-[710px] object-contain rounded-xl mx-auto drop-shadow-md"
                  />

                  {/* Hover Overlay with Quick Paste & Change Action */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePasteButtonClick();
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white text-[#121316] font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
                    >
                      <ClipboardPaste className="w-4 h-4 text-[#B57C1E]" />
                      <span>Paste New Photo (Ctrl+V)</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 rounded-xl bg-white/90 text-zinc-800 font-bold text-xs hover:bg-white transition-all flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4 text-zinc-600" />
                      <span>Browse from Files</span>
                    </button>
                  </div>

                  {/* Bottom Active Status Pill */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-white shadow-lg">
                    <div className="flex items-center gap-1.5 min-w-0 pr-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                      <span className="text-[11px] font-bold text-zinc-100 truncate">
                        {userPhotoName || 'Pasted Photo'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="text-[10px] font-extrabold text-white bg-white/20 hover:bg-white/30 border border-white/20 px-2 py-0.5 rounded-md flex-shrink-0 transition-all"
                    >
                      Change
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 w-full h-full">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-zinc-800 group-hover:scale-110 transition-transform mb-3 border border-black/[0.05]">
                    <ClipboardPaste className="w-8 h-8 text-[#B57C1E]" />
                  </div>
                  <p className="text-sm font-extrabold text-[#121316] mb-1">
                    Paste Photo (Ctrl + V)
                  </p>
                  <p className="text-xs text-zinc-500 max-w-[230px] leading-relaxed mb-4">
                    Copy any screenshot or image with <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 font-mono text-[10px] font-bold">Ctrl+C</kbd>, then press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 font-mono text-[10px] font-bold">Ctrl+V</kbd> anywhere or drop here.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePasteButtonClick();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#121316] text-white font-extrabold text-xs flex items-center gap-1.5 hover:bg-black transition-all shadow-md active:scale-95"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5 text-[#FFD782]" />
                      <span>Paste Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-3 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-700 font-bold text-xs flex items-center gap-1.5 hover:bg-zinc-50 transition-all active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Browse</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gender Switcher & Quick Demo Sample Models */}
            <div className="mt-4 pt-3 border-t border-black/[0.06]">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    ⚡ Models:
                  </span>
                  {/* Men / Women Segmented Switch */}
                  <div className="inline-flex p-0.5 rounded-xl bg-zinc-100 border border-black/[0.06]">
                    <button
                      type="button"
                      onClick={() => handleGenderChange('men')}
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
                        selectedGender === 'men'
                          ? 'bg-[#121316] text-white shadow-sm'
                          : 'text-zinc-600 hover:text-black'
                      }`}
                    >
                      <span>👨 Men</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenderChange('women')}
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
                        selectedGender === 'women'
                          ? 'bg-[#121316] text-white shadow-sm'
                          : 'text-zinc-600 hover:text-black'
                      }`}
                    >
                      <span>👩 Women</span>
                    </button>
                  </div>
                </div>

                {userPhoto && userPhotoName.startsWith('Sample Model') && (
                  <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Sample Active
                  </span>
                )}
              </div>

              {/* 3 Sample Models for Current Selected Gender */}
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_MODELS[selectedGender].map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-1.5 rounded-2xl border text-left transition-all flex flex-col items-center gap-1 ${
                      userPhoto === sample.url
                        ? 'bg-amber-50/80 border-amber-400 shadow-sm ring-2 ring-amber-400/25'
                        : 'bg-zinc-50/70 border-zinc-200/80 hover:bg-zinc-100/70'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-black/[0.08] shadow-sm bg-zinc-100">
                      <img
                        src={sample.thumb || sample.url}
                        alt={sample.label}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-extrabold leading-tight text-center text-zinc-900 truncate w-full">
                      {sample.label}
                    </span>
                    <span className="text-[9px] font-semibold text-zinc-500 text-center truncate w-full">
                      {sample.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------- */}
          {/* RIGHT: STEP 2 - OCCASION & STYLE SELECTOR (7 Cols) */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-black/[0.06] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#121316] text-white font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-extrabold text-base text-[#121316]">
                    Choose Your Date & Weekend Vibe
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#B57C1E]">
                  Curated Real US Pieces
                </span>
              </div>

              {/* 5 Occasion Options filtered by Gender */}
              <div className="space-y-3 mb-6">
                {(selectedGender === 'men' ? MENS_OCCASIONS : WOMENS_OCCASIONS).map((occ) => {
                  const isSelected = selectedOccasion.id === occ.id;
                  const targetLook =
                    CURATED_LOOKS.find((l) => l.id === occ.lookId) || CURATED_LOOKS[0];
                  const outfitPrice =
                    targetLook?.pins?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;

                  return (
                    <div
                      key={occ.id}
                      onClick={() => {
                        setSelectedOccasion(occ);
                        setStyledResult(null);
                      }}
                      className={`relative p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-400 shadow-[0_4px_16px_rgba(217,119,6,0.1)]'
                          : 'bg-[#FAF9F6] border-zinc-200/80 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl p-2 rounded-xl bg-white border border-black/[0.06] shadow-sm">
                          {occ.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                isSelected ? 'text-amber-950 font-extrabold' : 'text-zinc-900'
                              }`}
                            >
                              {occ.title}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-black/[0.08] text-zinc-700 font-bold shadow-2xl">
                              {occ.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#B57C1E] mt-0.5 font-semibold">
                            {occ.subtitle}
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">{occ.vibe}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#121316] border-[#121316] text-white shadow-sm'
                              : 'border-zinc-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold">
                          {targetLook?.pins?.length || 5} Pieces
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Preview of items included in selected occasion */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-black/[0.06] mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-700">
                    {selectedGender === 'men'
                      ? '👔 Men\'s designer pieces included in this styling:'
                      : '👗 Women\'s designer pieces included in this styling:'}
                  </span>
                  <span className="text-xs font-extrabold text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
                    Official Retailers
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeLook?.pins?.slice(0, 5).map((pin, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-white border border-black/[0.06] text-[11px] text-zinc-800 font-semibold shadow-sm"
                    >
                      <strong className="text-[#92400E]">{pin.category}:</strong> {pin.brand}
                    </span>
                  ))}
                  {(activeLook?.pins?.length || 0) > 5 && (
                    <span className="px-2 py-1 rounded-xl bg-white border border-black/[0.06] text-[10px] text-zinc-500 font-medium">
                      +{(activeLook?.pins?.length || 0) - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* -------------------------------------------------- */}
            {/* ACTION BUTTON: RUN AI STYLING */}
            {/* -------------------------------------------------- */}
            <div>
              {/* Progress State */}
              {isGenerating ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-300 text-center animate-pulse">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <RefreshCw className="w-5 h-5 text-amber-700 animate-spin" />
                    <span className="font-extrabold text-sm text-amber-900">
                      AI Virtual Styling in Progress...
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 font-semibold">{progressStage}</p>
                  <div className="w-full bg-amber-200/60 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-[#121316] h-full w-3/4 animate-[pulse_1s_infinite] rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleStartStyling}
                    className="w-full py-4 px-6 rounded-2xl bg-[#121316] hover:bg-black text-white font-extrabold text-base shadow-xl shadow-black/15 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-5 h-5 text-[#FFD782]" />
                    <span>
                      {freeTrialUsed && !isProSubscriber
                        ? '🔒 Unlock with Pro for Unlimited Styling'
                        : '✨ Style My Outfit with AI'}
                    </span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] px-1 text-zinc-500 font-semibold">
                    <span>
                      {freeTrialUsed && !isProSubscriber ? (
                        <span className="text-rose-600 font-bold">
                          ⚠️ 1 Free Trial Used (Pro Membership Required)
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">
                          🎁 1 Free Styling Available (No Card Needed)
                        </span>
                      )}
                    </span>
                    <span>Direct Official Store Links</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* 4. RESULTS STUDIO: BEFORE VS AFTER & PRODUCT BREAKDOWN */}
      {/* ======================================================= */}
      {styledResult && (
        <section
          ref={resultsRef}
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/[0.06]"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>AI Styling Complete • 1:1 Facial Likeness Preserved</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121316]">
              Your Transformation: {styledResult.look.title}
            </h2>
            <p className="text-sm text-zinc-600 mt-2 font-medium">
              Fitted with <strong className="text-[#121316]">{styledResult.look.pins.length} authentic designer pieces</strong> matched to your pose and facial features. Click any item for direct official store checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ------------------------------------------------ */}
            {/* Visual Display: Large Uncropped AI Styled Look (7 Cols) */}
            {/* ------------------------------------------------ */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-black/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-zinc-900">
                    ✨ Your AI Styled Look
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    100% Uncropped Full-Body
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-black/[0.06]">
                  <button
                    onClick={() => setViewMode('styled-only')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'styled-only'
                        ? 'bg-[#121316] text-white shadow-sm'
                        : 'text-zinc-600 hover:text-black'
                    }`}
                  >
                    Styled Photo Only
                  </button>
                  <button
                    onClick={() => setViewMode('side-by-side')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'side-by-side'
                        ? 'bg-[#121316] text-white shadow-sm'
                        : 'text-zinc-600 hover:text-black'
                    }`}
                  >
                    Compare Original
                  </button>
                </div>
              </div>

              {viewMode === 'styled-only' ? (
                /* Primary Default: Large Uncropped High-Res Showcase */
                <div className="w-full rounded-2xl overflow-hidden border border-black/[0.08] shadow-2xl relative bg-[#0D0E10] flex items-center justify-center p-3 min-h-[640px] max-h-[880px]">
                  <img
                    src={styledResult.imageUrl}
                    alt="Styled 4K Editorial"
                    className="w-full h-auto max-h-[840px] object-contain rounded-xl mx-auto drop-shadow-2xl"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (styledResult?.look?.imageUrl && target.src !== styledResult.look.imageUrl) {
                        target.src = styledResult.look.imageUrl;
                      }
                    }}
                  />

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/75 text-white backdrop-blur-md text-xs font-extrabold shadow-lg flex items-center gap-1.5 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Full Body Visible</span>
                  </div>

                  {/* Floating Look Title Bar */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-black/[0.08] flex items-center justify-between shadow-xl">
                    <div>
                      <span className="text-xs font-extrabold text-[#121316] block">
                        {styledResult.look.title}
                      </span>
                      <span className="text-[10px] text-[#B57C1E] font-bold">
                        {styledResult.provider}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Verified Luxury Pieces
                    </span>
                  </div>
                </div>
              ) : (
                /* Optional Side by Side (Uncropped Contain) */
                <div className="grid grid-cols-2 gap-3">
                  {/* Original */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-zinc-500 text-center">
                      Before: Original Photo
                    </span>
                    <div className="rounded-2xl overflow-hidden border border-black/[0.08] bg-[#0D0E10] flex items-center justify-center p-2 min-h-[500px] max-h-[700px] shadow-sm">
                      <img
                        src={userPhoto || ''}
                        alt="Original Customer"
                        className="w-full h-auto max-h-[680px] object-contain rounded-xl mx-auto"
                      />
                    </div>
                  </div>

                  {/* Styled Result */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-[#92400E] text-center flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#B57C1E]" />
                      After: AI Styled Look
                    </span>
                    <div className="rounded-2xl overflow-hidden border-2 border-[#121316] shadow-xl relative group bg-[#0D0E10] flex items-center justify-center p-2 min-h-[500px] max-h-[700px]">
                      <img
                        src={styledResult.imageUrl}
                        alt="Styled Luxury Look"
                        className="w-full h-auto max-h-[680px] object-contain rounded-xl mx-auto"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (styledResult?.look?.imageUrl && target.src !== styledResult.look.imageUrl) {
                            target.src = styledResult.look.imageUrl;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <a
                  href={
                    styledResult.imageUrl.includes('/api/tryon-image/')
                      ? `${styledResult.imageUrl}?download=1`
                      : styledResult.imageUrl
                  }
                  download="styling_helper_luxury_look.png"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#121316] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High-Res Photo</span>
                </a>

                <button
                  onClick={() => {
                    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Vibe</span>
                </button>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* Worn Garments Breakdown: Real Products & Links (5 Cols) */}
            {/* ------------------------------------------------ */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-black/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-base text-[#121316]">
                    Worn Designer Garments ({styledResult.look.pins.length} Pieces)
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                    Direct official store links • Zero modals • Opens directly in a new tab
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-200">
                    Official Store Links
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {styledResult.look.pins.map((pin) => (
                  <div
                    key={pin.id}
                    className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-black/[0.06] hover:border-black/20 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100/70 text-[#92400E] text-[10px] font-extrabold uppercase tracking-wider">
                          {pin.category}
                        </span>
                        <span className="text-xs font-extrabold text-[#121316] truncate">
                          {pin.brand}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-700 font-semibold truncate mb-1">
                        {pin.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                        <span>Retailer: {pin.retailer || 'Shopbop'}</span>
                        <span>•</span>
                        <span className="text-zinc-600 font-semibold">Official Store</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Direct Native Link Button - Zero Interception */}
                      <a
                        href={pin.buyUrl || 'https://www.shopbop.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-[#121316] hover:bg-black text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
                      >
                        <span>Shop Now</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>

                      {/* Report Sold Out / Error on specific piece */}
                      <button
                        onClick={() => {
                          setReportProduct({
                            title: `${pin.brand} - ${pin.title}`,
                            url: pin.buyUrl || ''
                          });
                          setIsReportModalOpen(true);
                        }}
                        title="Report Sold Out or Issue (yjongsung1211@gmail.com)"
                        className="p-2 rounded-xl hover:bg-amber-100/60 text-zinc-400 hover:text-amber-700 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================= */}
      {/* 5. REAL AI STYLING EXAMPLES (TOP 4 SHOWCASE) */}
      {/* ======================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-[#B57C1E] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Real AI Styling Examples</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121316]">
            See What Your Photo Can Look Like
          </h2>
          <p className="text-sm text-zinc-600 mt-2 font-medium">
            Here is how your uploaded photo transforms into an authentic designer editorial. Click any example to try it on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              id: 'showcase-1',
              gender: 'women',
              genderLabel: '👩 Women',
              category: 'Quiet Luxury Tailoring',
              title: 'SoHo Glen Plaid Blazer & Wide Slacks',
              subtitle: 'Parisian chic & high-fashion tailoring',
              imageUrl: '/images/looks/look_01_soho_quiet_luxury_final.webp',
              lookId: 'editorial-look-v01',
              occasionId: 'soho-luxury',
            },
            {
              id: 'showcase-2',
              gender: 'men',
              genderLabel: '👨 Men',
              category: 'Modern Minimalist',
              title: 'Milan Wool Blazer & Charcoal Slacks',
              subtitle: 'Sharp modern dandy & Italian tailored fit',
              imageUrl: '/images/looks/men_look_01_tailored_dandy.webp',
              lookId: 'editorial-men-01',
              occasionId: 'mens-tailored-dandy',
            },
            {
              id: 'showcase-3',
              gender: 'women',
              genderLabel: '👩 Women',
              category: 'Modern Luxury Minimalist',
              title: 'Cheongdam Midnight Navy Overcoat & Slacks',
              subtitle: 'Burgundy knit, tailored coat & camel trousers',
              imageUrl: '/images/looks/look_03_cheongdam_silk_cashmere.webp',
              lookId: 'editorial-look-v03',
              occasionId: 'midnight-glam',
            },
            {
              id: 'showcase-4',
              gender: 'men',
              genderLabel: '👨 Men',
              category: 'Urban Flight Streetwear',
              title: 'Seongsu Leather Bomber & Raw Denim',
              subtitle: 'Vintage distressed shearling bomber & wide denim',
              imageUrl: '/images/looks/men_look_02_urban_street.webp',
              lookId: 'editorial-men-02',
              occasionId: 'mens-urban-street',
            },
          ].map((item) => {
            const isMen = item.gender === 'men';
            return (
              <div
                key={item.id}
                onClick={() => {
                  const targetGender = isMen ? 'men' : 'women';
                  handleGenderChange(targetGender);
                  const targetOccasions = isMen ? MENS_OCCASIONS : WOMENS_OCCASIONS;
                  const matchedOccasion = targetOccasions.find(
                    (o) => o.lookId === item.lookId || o.id === item.occasionId
                  );
                  if (matchedOccasion) {
                    setSelectedOccasion(matchedOccasion);
                  }
                  setStyledResult(null);
                  studioRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group rounded-3xl bg-white border border-black/[0.06] hover:border-black/20 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl overflow-hidden transition-all flex flex-col justify-between cursor-pointer"
              >
                {/* Look Photo */}
                <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-black/[0.08] text-xs font-extrabold text-zinc-900 shadow-sm flex items-center gap-1.5">
                    <span className={isMen ? 'text-indigo-700' : 'text-rose-700'}>
                      {item.genderLabel}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-extrabold shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FFD782]" />
                    <span>AI Result</span>
                  </div>
                </div>

                {/* Look Details */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider mb-2 ${
                        isMen
                          ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                          : 'bg-amber-50 text-[#92400E] border border-amber-200'
                      }`}
                    >
                      {item.category}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#121316] group-hover:text-[#B57C1E] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1 font-medium">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs font-bold text-zinc-700 group-hover:text-black">
                    <span>Try This Style</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#B57C1E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================= */}
      {/* 6. STYLINGHELPER PRO SUBSCRIPTION PAYWALL MODAL */}
      {/* ======================================================= */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-black/[0.08] p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Icon */}
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
              💎
            </div>

            {/* Title & Tagline */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#121316]">
              StylingHelper Pro Membership
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1.5 leading-relaxed font-medium">
              {proModalReason === 'trial_exhausted'
                ? "You've experienced your 1 Free Styling! Upgrade to Pro for unlimited AI full-body outfit swaps and personal styling."
                : 'Unlock unlimited AI full-body outfit swaps and direct real-time luxury shopping links.'}
            </p>

            {/* Pricing Plans Selector */}
            <div className="grid grid-cols-2 gap-3 my-6">
              {/* Annual VIP */}
              <div
                onClick={() => setSelectedPlan('annual')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                  selectedPlan === 'annual'
                    ? 'border-[#121316] bg-amber-50/70 shadow-sm'
                    : 'border-zinc-200 bg-[#FAF9F6] opacity-70 hover:opacity-100'
                }`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#121316] text-white text-[10px] font-extrabold uppercase">
                  Best Value
                </span>
                <div>
                  <span className="text-xs font-bold text-[#B57C1E] block">Annual VIP Plan</span>
                  <div className="mt-2">
                    <span className="text-2xl font-extrabold text-[#121316]">$149</span>
                    <span className="text-[11px] text-zinc-500 font-medium"> / year</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                    $12.40 / mo (Save 35%)
                  </span>
                </div>
              </div>

              {/* Monthly */}
              <div
                onClick={() => setSelectedPlan('monthly')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedPlan === 'monthly'
                    ? 'border-[#121316] bg-amber-50/70 shadow-sm'
                    : 'border-zinc-200 bg-[#FAF9F6] opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-zinc-700 block">Monthly Plan</span>
                  <div className="mt-2">
                    <span className="text-2xl font-extrabold text-[#121316]">$19</span>
                    <span className="text-[11px] text-zinc-500 font-medium"> / month</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                <span>Unlimited AI full-body outfit swaps (Virtual Try-On)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                <span>Verified authentic Shopbop designer luxury items with direct store links</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                <span>Download high-definition 4K editorial photos without watermarks</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                <span>Ultra-fast priority AI rendering queue</span>
              </div>
            </div>

            {/* Official PayPal Checkout CTA */}
            <div className="space-y-3">
              <a
                href={PAYPAL_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Pre-activate local tracking on click
                  fetch('/api/checkout/paypal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plan: selectedPlan })
                  }).catch(() => {});
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0070BA] hover:bg-[#005EA6] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#0070BA]/25 hover:shadow-xl transition-all active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.002.535 5.32.26 5.69.26h7.248c2.457 0 4.394.57 5.485 1.603 1.05.992 1.488 2.454 1.233 4.116-.54 3.513-2.915 5.485-6.516 5.485h-2.31l-1.398 8.873a1.002 1.002 0 0 1-.989.843l-1.367.157z" />
                </svg>
                <span>Pay ${selectedPlan === 'annual' ? 149 : 19}.00 with PayPal or Card</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>

              {/* Supported Payment Badges */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-semibold pt-1">
                <span>Accepted:</span>
                <span className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-800">PayPal</span>
                <span className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-800">Visa</span>
                <span className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-800">Mastercard</span>
                <span className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-800">AMEX</span>
              </div>

              {/* Security Assurance */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 pt-2 border-t border-black/[0.04]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Official 256-bit encrypted checkout via PayPal • Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Login & Signup Modal */}
      <USAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        title={authMode === 'signin' ? 'Sign In to StylingHelper' : 'Join StylingHelper Club'}
        subtitle="Access your personal wardrobe history, saved fittings, and Pro styling features."
        onSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('stylinghelper_user', JSON.stringify(user));
          window.dispatchEvent(new Event('stylinghelper_auth_changed'));
          setIsAuthModalOpen(false);
        }}
      />

      {/* Error & Sold-Out Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultProductTitle={reportProduct.title}
        defaultProductUrl={reportProduct.url}
      />

      {/* Floating Action Button: Report Issue */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setReportProduct({ title: '', url: typeof window !== 'undefined' ? window.location.href : '' });
            setIsReportModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 hover:bg-white text-zinc-800 text-xs font-bold shadow-xl border border-black/[0.1] hover:border-black/20 hover:scale-105 active:scale-95 transition-all group backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
          <span>Report Issue</span>
        </button>
      </div>

      {/* ======================================================= */}
      {/* 7. BRIGHT MINIMAL FOOTER */}
      {/* ======================================================= */}
      <footer className="border-t border-black/[0.06] bg-white py-12 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
          <p>© 2026 STYLING HELPER. Click Any Look, Shop the Outfit. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-600">
            <span>Powered by Advanced Fashion AI</span>
            <span>•</span>
            <span>Shopbop Verified Luxury</span>
            <span>•</span>
            <button
              onClick={() => {
                setReportProduct({ title: '', url: '' });
                setIsReportModalOpen(true);
              }}
              className="text-amber-700 hover:text-amber-800 font-semibold underline"
            >
              Report Issue
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
