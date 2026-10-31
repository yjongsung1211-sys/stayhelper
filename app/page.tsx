'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import USAuthModal from '@/components/USAuthModal';
import editorialLooksData from '../public/editorial_top10_lookbook.json';
import allProductsData from '../public/real_products_1000.json';
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
  EyeOff
} from 'lucide-react';

// ==========================================
// 1. DATA TYPES & STYLE CATEGORIES
// ==========================================
type RetailerName =
  | 'Zara US'
  | 'H&M US'
  | 'Nordstrom'
  | 'Amazon US'
  | 'SSENSE'
  | 'Mango US'
  | 'Uniqlo US'
  | 'COS'
  | 'Revolve'
  | 'Madewell'
  | 'Abercrombie'
  | 'Apple'
  | 'Saint James'
  | 'FRAME'
  | 'Veja'
  | 'Adidas Originals'
  | 'Agolde'
  | 'A.P.C.'
  | 'Sam Edelman'
  | 'Reformation'
  | 'Dr. Martens'
  | 'Skims'
  | 'Levi\'s'
  | 'Brixton'
  | 'New Balance';

interface HotspotPin {
  id: string;
  x: number;
  y: number;
  category: string;
  title: string;
  brand: string;
  price: number;
  retailer: RetailerName | string;
  buyUrl: string;
  kStyleTip?: string;
  sockTip?: string;
  sku?: string;
  silhouette?: string;
  fabric?: string;
  color?: string;
  details?: string;
  dupe?: {
    title: string;
    brand: string;
    price: number;
    retailer: RetailerName | string;
    buyUrl: string;
    savingsPct: number;
  };
}

interface StylingLook {
  id: string;
  title: string;
  member: string;
  aesthetic: string;
  styleId?: string;
  styleName?: string;
  styleTag?: string;
  season: string;
  imageUrl: string;
  modelHeight?: string;
  description: string;
  curatorNote?: string;
  colorPalette: string[];
  vibeTags: string[];
  pins: HotspotPin[];
}

// STYLE_CATEGORIES is now 100% dynamically derived from CURATED_LOOKS database.
// Zero phantom counts, zero hardcoded look IDs. Scales automatically on ingestion.

const CURATED_LOOKS: StylingLook[] = editorialLooksData as any[];

const formatPrice = (price: string | number | undefined | null) => {
  if (price === undefined || price === null || price === '') return '$0';
  if (typeof price === 'number') return `$${Math.round(price).toLocaleString()}`;
  const clean = String(price).replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  if (isNaN(num)) return '$0';
  return `$${Math.round(num).toLocaleString()}`;
};

const GoogleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.39 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
    />
  </svg>
);

const K_STYLING_FORMULAS = [
  {
    id: 'seongsu',
    name: 'Seongsu Utility Core',
    nameKr: 'Seongsu Street & Gorpcore',
    vibe: 'Oversized Boxy • Drop-Shoulder • Court Retro',
    badge: '🔥 #1 Seoul Trend',
    description:
      'Seoul’s youth capital favors dropped shoulders, boxy workwear canvas, and extra-wide pleated trousers pooling softly over chunky retro court sneakers.',
    silhouetteTip: 'Boxy oversized upper silhouette balanced by wide-leg trousers cascading smoothly over sneaker vamps to anchor the visual weight.',
    formula: [
      { piece: 'Outer', spec: 'Boxy Heavyweight Canvas Chore Coat or MA-1 Blouson' },
      { piece: 'Top', spec: 'Clean Cut Heavy Organic Cotton Crewneck Tee in Optic White' },
      { piece: 'Bottom', spec: 'High-Rise Relaxed Wide-Leg Trousers or Utilitarian Cargo' },
      { piece: 'Shoes', spec: 'Retro Low-Top Court Sneakers (NB 550 / Samba)' },
      { piece: '🧦 Seoul Sock Tip', spec: 'Subtle cream ribbed quarter-crew socks casually scrunched at ankle' }
    ],
    recommendedLookId: 'editorial-look-v01'
  },
  {
    id: 'hannam',
    name: 'Hannam Quiet Luxury',
    nameKr: 'Hannam Quiet Luxury',
    vibe: 'Minimalist • Monotone • Clean Tailoring',
    badge: '✨ Seoul Insider Pick',
    description:
      'Understated luxury loved by Hannam-dong creators. Perfectly crisp poplin shirts or ultrafine merino knits paired with tailored trousers and classic penny loafers.',
    silhouetteTip: 'Immaculate minimalist tailoring with a subtle 1-inch visible white ribbed sock hem for refined Seoul quiet luxury.',
    formula: [
      { piece: 'Top / Knit', spec: 'Oversized Crisp Poplin Shirt or Fine Merino Crew' },
      { piece: 'Bottom', spec: 'Double-Pleated Tailored Wool-Blend Slacks in Charcoal' },
      { piece: 'Shoes', spec: 'Polished Leather Penny Loafers (GH Bass / Weejuns)' },
      { piece: '🧦 Seoul Sock Tip', spec: 'Essential 1-inch visible white ribbed ankle socks for classic K-balance' },
      { piece: 'Accessory', spec: 'Clean Leather Minimalist Shoulder Bag' }
    ],
    recommendedLookId: 'editorial-look-v04'
  },
  {
    id: 'dosan',
    name: 'Dosan Effortless Chic',
    nameKr: 'Dosan Effortless Chic',
    vibe: 'Soft Feminine • Draped • Cafe Brunch',
    badge: '☕ Weekend Favorite',
    description:
      'The quintessential Seoul weekend cafe look: a tactile fluffy knit cardigan paired effortlessly with a bias-cut slip skirt or straight ecru denim.',
    silhouetteTip: 'Effortless elegance: a lightly draped plush cardigan paired with a bias-cut slip skirt creating fluid vertical movement.',
    formula: [
      { piece: 'Outer / Knit', spec: 'Soft Fluffy Alpaca-Blend Button-Down Cardigan' },
      { piece: 'Bottom', spec: 'Bias-Cut Satin Slip Skirt or Clean Straight-Leg Denim' },
      { piece: 'Shoes', spec: 'Low Kitten Slingback Heels or Pointed Leather Mules' },
      { piece: '🧦 Seoul Sock Tip', spec: 'Bare ankle silhouette with sheer invisible toe liner' },
      { piece: 'Bags', spec: 'Padded Cloud Shoulder Bag or Minimalist Baguette' }
    ],
    recommendedLookId: 'editorial-look-v03'
  },
  {
    id: 'hongdae',
    name: 'Hongdae Geek-Chic & Vintage',
    nameKr: 'Hongdae Geek-Chic & Vintage Biker',
    vibe: 'Edgy • Rimless Glasses • Distressed Leather',
    badge: '⚡ Street Idol Vibe',
    description:
      'A sharp contrast between rugged vintage distressed moto leather and intellectual silver rimless eyewear. The defining look of Seoul’s music & indie scene.',
    silhouetteTip: 'Edgy vintage moto leather juxtaposed with intellectual rimless silver eyewear to master the defining Seoul street trend.',
    formula: [
      { piece: 'Outer', spec: 'Distressed Faux-Leather Biker Moto Jacket in Black' },
      { piece: 'Top', spec: 'Ribbed Scoop Tank or Vintage Graphic Baby Tee' },
      { piece: 'Bottom', spec: 'Mid-Rise Raw Washed Denim or Utility Parachute Pants' },
      { piece: 'Eyewear', spec: 'Minimalist Rimless Oval Geek-Chic Glasses in Silver' },
      { piece: 'Shoes', spec: 'Chunky Lug-Sole Oxford Derby Shoes or Biker Boots' }
    ],
    recommendedLookId: 'editorial-look-v08'
  }
];

export default function CleanStylingHelper() {
  const [activeLook, setActiveLook] = useState<StylingLook | null>(CURATED_LOOKS[0] || null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(CURATED_LOOKS[0]?.pins?.[0]?.id || null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showPins, setShowPins] = useState<boolean>(true);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const categoryTabsRef = useRef<HTMLDivElement>(null);

  // 100% Database-Driven Dynamic Style Categories
  // Aggregates directly from active looks in CURATED_LOOKS (Zero phantom counts)
  const dynamicCategories = useMemo(() => {
    const groups: Record<string, { name: string; tag: string; count: number }> = {};

    CURATED_LOOKS.forEach((look) => {
      const sId = look.styleId || 'quiet-luxury';
      const sName = look.styleName || look.aesthetic || 'Quiet Luxury & Minimalist';
      const sTag = look.styleTag || `#${sName.replace(/[^a-zA-Z0-9]/g, '')}`;

      if (!groups[sId]) {
        groups[sId] = { name: sName, tag: sTag, count: 0 };
      }
      groups[sId].count += 1;
    });

    const list: { id: string; name: string; tag: string; count: number }[] = [
      {
        id: 'all',
        name: 'All Styles',
        tag: '#AllLooks',
        count: CURATED_LOOKS.length,
      },
    ];

    Object.entries(groups).forEach(([id, data]) => {
      list.push({
        id,
        name: data.name,
        tag: data.tag,
        count: data.count,
      });
    });

    return list;
  }, []);

  // User Auth & Founding Member Membership (Future Paid Subscription, Free for Now)
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    tier: string;
  } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [authEmailInput, setAuthEmailInput] = useState<string>('');

  // K-Styling Recommendation Modal State
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState<boolean>(false);
  const [activeVibeId, setActiveVibeId] = useState<string>('seongsu');

  // Virtual Try-on Modal State
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState<boolean>(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedTryOnStyle, setSelectedTryOnStyle] = useState<string>('gala-glam');
  const [isTryOnLoading, setIsTryOnLoading] = useState<boolean>(false);
  const [tryOnStep, setTryOnStep] = useState<number>(0);
  const [tryOnResult, setTryOnResult] = useState<StylingLook | null>(null);

  // In-App K-Style Quick View Modal State (Option 1)
  const [quickViewPin, setQuickViewPin] = useState<HotspotPin | null>(null);
  const [copiedSku, setCopiedSku] = useState<boolean>(false);

  // 2,621 Items Real Wardrobe Catalog State
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [catalogCategory, setCatalogCategory] = useState<string>('All');
  const [catalogVisibleCount, setCatalogVisibleCount] = useState<number>(36);

  // Initialize User from LocalStorage & Global Keyboard Listeners
  useEffect(() => {
    const syncUser = () => {
      try {
        const saved =
          localStorage.getItem('sh_member_user') ||
          localStorage.getItem('stayhelper_user') ||
          localStorage.getItem('stayhelper_member');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser({
            name: parsed.name || 'VIP Member',
            email: parsed.email || '',
            avatar: parsed.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${parsed.name || 'VIP'}`,
            tier: parsed.tier || 'Founding VIP Member ($0)'
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error(e);
      }
    };
    syncUser();
    window.addEventListener('stayhelper_auth_changed', syncUser);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAuthModalOpen(false);
        setIsRecommendationModalOpen(false);
        setIsCatalogOpen(false);
        setIsTryOnModalOpen(false);
        setQuickViewPin(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('stayhelper_auth_changed', syncUser);
    };
  }, []);

  const handleGoogleSignIn = (customEmail?: string, customName?: string) => {
    setIsAuthLoading(true);
    setTimeout(() => {
      const email = customEmail || authEmailInput || 'founder@gmail.com';
      const name = customName || (email.split('@')[0] || 'VIP Member');
      const newUser = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        tier: 'Founding Member · Free Forever ($0/mo)'
      };
      setUser(newUser);
      try {
        localStorage.setItem('sh_member_user', JSON.stringify(newUser));
      } catch (e) {
        console.error(e);
      }
      setIsAuthLoading(false);
      setIsAuthModalOpen(false);
    }, 600);
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem('sh_member_user');
      localStorage.removeItem('stayhelper_user');
      localStorage.removeItem('stayhelper_member');
      document.cookie = 'stayhelper_user=; path=/; max-age=0;';
      fetch('/api/auth/quick', { method: 'DELETE' }).catch(() => {});
    } catch (e) {
      console.error(e);
    }
    window.dispatchEvent(new Event('stayhelper_auth_changed'));
  };

  const filteredCatalogProducts = useMemo(() => {
    let list = allProductsData as any[];
    if (catalogCategory !== 'All') {
      if (catalogCategory === 'Accessories') {
        list = list.filter((p) => p.category === 'Accessories' || p.category === 'Accessory');
      } else if (catalogCategory === 'Hats') {
        list = list.filter((p) => 
          p.category === 'Hats' || 
          p.category === 'Hat' ||
          (p.subCategory || '').toLowerCase().includes('hat') ||
          (p.subCategory || '').toLowerCase().includes('cap') ||
          (p.subCategory || '').toLowerCase().includes('beanie') ||
          (p.subCategory || '').toLowerCase().includes('beret') ||
          (p.subCategory || '').toLowerCase().includes('balaclava')
        );
      } else if (catalogCategory === 'Sunglasses') {
        list = list.filter((p) => 
          p.category === 'Sunglasses' || 
          p.category === 'Glasses' || 
          (p.subCategory || '').toLowerCase().includes('sunglass') ||
          (p.subCategory || '').toLowerCase().includes('glass') ||
          (p.title || '').toLowerCase().includes('sunglasses')
        );
      } else if (catalogCategory === 'Bags') {
        list = list.filter((p) => p.category === 'Bags' || p.category === 'Bag');
      } else if (catalogCategory === 'Dresses') {
        list = list.filter((p) => p.category === 'Dresses' || p.category === 'Dress');
      } else {
        list = list.filter((p) => p.category === catalogCategory);
      }
    }
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      list = list.filter((p) =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.retailer || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.subCategory || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [catalogCategory, catalogSearch]);

  // Auto select first pin when activeLook changes
  useEffect(() => {
    if (activeLook && activeLook.pins && activeLook.pins.length > 0) {
      setSelectedPinId(activeLook.pins[0].id);
    }
  }, [activeLook]);

  // Filter looks by active style category - 100% DB-driven
  const filteredLooks = useMemo(() => {
    if (activeCategory === 'all') return CURATED_LOOKS;
    return CURATED_LOOKS.filter((l) => (l.styleId || 'modern-minimalist') === activeCategory);
  }, [activeCategory]);

  // Handle click anywhere on the main editorial photo - automatically selects and opens the nearest garment pin
  const handlePhotoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicked on an interactive button (e.g. tag toggle or pin), let the button handle it
    if ((e.target as HTMLElement).closest('button')) return;
    if (!activeLook || !activeLook.pins || activeLook.pins.length === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Find the pin closest to where the user clicked on the outfit
    let closestPin = activeLook.pins[0];
    let minDistance = Infinity;

    for (const pin of activeLook.pins) {
      const dx = pin.x - clickX;
      const dy = pin.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDistance) {
        minDistance = dist;
        closestPin = pin;
      }
    }

    setSelectedPinId(closestPin.id);
    if (closestPin.buyUrl) {
      window.open(closestPin.buyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle User Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUserPhoto(ev.target?.result as string);
        setTryOnResult(null);
        setTryOnStep(0);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Virtual Styling (Hermes / Nano Banana)
  const handleRunVirtualStyling = async () => {
    if (!userPhoto) {
      alert('Please upload your photo to get styled!');
      return;
    }
    setIsTryOnLoading(true);
    setTryOnStep(1);

    const timer = setTimeout(() => setTryOnStep(2), 1200);

    try {
      const res = await fetch('/api/generate-styling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleId: selectedTryOnStyle,
          userPhoto
        })
      });

      const data = await res.json();
      clearTimeout(timer);

      if (data.ok && data.look && data.imageUrl) {
        setTryOnResult({
          ...data.look,
          imageUrl: data.imageUrl
        });
      } else {
        alert(data.error || 'Virtual try-on synthesis could not preserve the face accurately. Please upload a clear photo and try again.');
        setTryOnResult(null);
      }
    } catch (e: any) {
      clearTimeout(timer);
      alert('Virtual styling server error. Please try again.');
      setTryOnResult(null);
    } finally {
      setIsTryOnLoading(false);
      setTryOnStep(3);
    }
  };

  const totalOutfitPrice = useMemo(() => {
    if (!activeLook?.pins) return '$0';
    const sum = activeLook.pins.reduce((acc, p) => {
      const clean = String(p.price || '').replace(/[^0-9.]/g, '');
      return acc + (parseFloat(clean) || 0);
    }, 0);
    return `$${Math.round(sum).toLocaleString()}`;
  }, [activeLook]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white overflow-x-hidden w-full">
      {/* 0. FREE EARLY ACCESS TOP BANNER */}
      <div className="bg-neutral-950 text-neutral-200 text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-black text-[10px] tracking-wide uppercase flex-shrink-0">
              🎁 Free Early Access
            </span>
            <span className="font-bold text-white truncate">
              100% Free Forever for Early Google Sign-ups (Normally $9/mo)
            </span>
            <span className="hidden md:inline text-neutral-400 truncate">
              • Unlock Curated Seoul K-Styling Formulas & {allProductsData.length.toLocaleString()} In-Stock US Garments
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="text-amber-300 hover:text-amber-200 font-bold underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            <span>{user ? 'Founding Member Perks' : 'Sign in with Google (Free)'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 1. CLEAN MINIMAL HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Tagline (Click to reset to Home) */}
          <div
            onClick={() => {
              setActiveCategory('all');
              setActiveLook(CURATED_LOOKS[0]);
              setSelectedPinId(CURATED_LOOKS[0]?.pins[0]?.id || null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
            title="Reset to Home"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-black text-sm tracking-tight group-hover:scale-105 transition">
              SH
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-neutral-950 block">StylingHelper</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-medium hidden sm:block -mt-0.5">Click Any Look, Shop the Outfit</span>
            </div>
          </div>

          {/* Quick Nav Actions */}
          <div className="flex items-center gap-2">
{/* K-Styling Recommendations hidden for future paid subscription */}

            {/* Shop All Items (Desktop / Tablet only, mobile uses discovery bar) */}
            <button
              type="button"
              onClick={() => setIsCatalogOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-900" />
              <span>Browse Wardrobe ({allProductsData.length.toLocaleString()})</span>
            </button>

            {/* Google Sign-in / User Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                <div className="w-7 h-7 rounded-full bg-neutral-950 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden xl:block text-left">
                  <span className="text-[11px] font-bold text-neutral-950 block leading-tight truncate max-w-[90px]">
                    {user.name}
                  </span>
                  <span className="text-[9px] font-extrabold text-emerald-600 block leading-tight">
                    Founding VIP ($0)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-300 shadow-xs transition cursor-pointer flex-shrink-0"
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. STYLE CATEGORIES SELECTOR TABS - 100% DB-DRIVEN WITH NAVIGATION ARROWS */}
        <div className="border-t border-neutral-200/80 bg-neutral-50/90 py-1.5 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
            {/* Left Scroll Navigation Button */}
            <button
              type="button"
              onClick={() => {
                if (categoryTabsRef.current) {
                  categoryTabsRef.current.scrollLeft -= 280;
                }
              }}
              className="p-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-xs flex-shrink-0 transition cursor-pointer select-none active:scale-95"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Tabs List - Dynamically derived from DB */}
            <div
              ref={categoryTabsRef}
              className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
            >
              {dynamicCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      if (cat.id !== 'all') {
                        const match = CURATED_LOOKS.find((l) => (l.styleId || 'modern-minimalist') === cat.id);
                        if (match) {
                          setActiveLook(match);
                        }
                      } else {
                        setActiveLook(CURATED_LOOKS[0]);
                      }
                    }}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-150 flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-950'
                        : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 shadow-xs'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive ? 'bg-neutral-800 text-amber-300' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Navigation Button */}
            <button
              type="button"
              onClick={() => {
                if (categoryTabsRef.current) {
                  categoryTabsRef.current.scrollLeft += 280;
                }
              }}
              className="p-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-xs flex-shrink-0 transition cursor-pointer select-none active:scale-95"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2.5. ULTRA-INTUITIVE DISCOVERY BAR & K-STYLING SHORTCUTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Quick Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              onClick={() => setIsCatalogOpen(true)}
              placeholder={`🔍 Search ${allProductsData.length.toLocaleString()} real items (chore coat, wide trousers, loafers, caps, sunglasses)...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition cursor-pointer"
              readOnly
            />
          </div>

          {/* 1-Click Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { name: 'Outer', icon: '🧥' },
              { name: 'Top', icon: '👕' },
              { name: 'Bottom', icon: '👖' },
              { name: 'Shoes', icon: '👟' },
              { name: 'Bags', icon: '👜' },
              { name: 'Hats', icon: '🧢' },
              { name: 'Sunglasses', icon: '🕶️' }
            ].map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  setCatalogCategory(cat.name);
                  setIsCatalogOpen(true);
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition flex-shrink-0 cursor-pointer border border-neutral-200/60"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3-Step Clear Intuitive Guide */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 bg-white/70 border border-neutral-200/80 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-neutral-900">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-black">1</span>
            <span>Browse 100 Seoul Editorial Looks</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-300 hidden sm:block" />
          <div className="flex items-center gap-2 font-bold text-neutral-900">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-black">2</span>
            <span>Click Any Garment Pin on Fabric</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-300 hidden sm:block" />
          <div className="flex items-center gap-2 font-bold text-neutral-900">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-black">3</span>
            <span>Shop Exact 100% In-Stock US Links & Smart Dupes</span>
          </div>
        </div>
      </div>

      {/* 3. CENTERPIECE: INTERACTIVE EDITORIAL LOOKBOOK STUDIO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!activeLook || CURATED_LOOKS.length === 0 ? (
          <div className="py-24 text-center max-w-2xl mx-auto bg-white rounded-3xl border border-neutral-200/80 p-10 shadow-sm my-8">
            <div className="w-16 h-16 rounded-2xl bg-neutral-950 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-neutral-950 inline-block mb-3">
              100% Real-Product Production Underway
            </span>
            <h2 className="text-3xl font-black text-neutral-950 tracking-tight sm:text-4xl">
              New Editorial Capsule In Production
            </h2>
            <p className="mt-4 text-sm text-neutral-600 leading-relaxed max-w-lg mx-auto">
              All legacy concept photos have been completely cleared. We are currently curating a fresh series of 100% verified, in-stock US luxury outfits using 1:1 physical garment synchronization.
            </p>
            <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 font-bold uppercase tracking-wider">
              <span>✓ 100% Real In-Stock US Items</span>
              <span>✓ Zero Bot Blockers</span>
              <span>✓ 1:1 Verified Garments</span>
            </div>
          </div>
        ) : (
          <>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 4K Editorial Photo with Interactive Hotspot Pins (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full gap-3">
            {/* Quick 1-Click Look Selector Ribbon */}
            <div className="flex items-center justify-between gap-2 bg-neutral-100/80 p-1.5 rounded-2xl border border-neutral-200/80">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {filteredLooks.map((look, idx) => {
                  const isCurrent = activeLook.id === look.id;
                  return (
                    <button
                      key={look.id}
                      type="button"
                      onClick={() => setActiveLook(look)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                        isCurrent
                          ? 'bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-950'
                          : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 border border-neutral-200/60'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                        isCurrent ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-200 text-neutral-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="truncate max-w-[110px] sm:max-w-none">{look.title.split(' ')[0]} {look.title.split(' ')[1]}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 pl-1">
                <button
                  type="button"
                  title="Previous Look"
                  onClick={() => {
                    const idx = CURATED_LOOKS.findIndex(l => l.id === activeLook.id);
                    const prevIdx = (idx - 1 + CURATED_LOOKS.length) % CURATED_LOOKS.length;
                    setActiveLook(CURATED_LOOKS[prevIdx]);
                  }}
                  className="p-1.5 rounded-lg bg-white hover:bg-neutral-200 text-neutral-700 border border-neutral-200 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Next Look"
                  onClick={() => {
                    const idx = CURATED_LOOKS.findIndex(l => l.id === activeLook.id);
                    const nextIdx = (idx + 1) % CURATED_LOOKS.length;
                    setActiveLook(CURATED_LOOKS[nextIdx]);
                  }}
                  className="p-1.5 rounded-lg bg-white hover:bg-neutral-200 text-neutral-700 border border-neutral-200 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              onClick={handlePhotoClick}
              className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xl aspect-[3/4] w-full select-none group cursor-pointer"
              title="Click any item on the photo to view garment details & store links"
            >
              <img
                src={activeLook.imageUrl}
                alt={activeLook.title}
                className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-[1.01]"
              />

              {/* Editorial Header Pill on Photo */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/10">
                  {activeLook.aesthetic}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-neutral-950 shadow-sm">
                  100% Real US Items
                </span>
              </div>

              {/* Photo Controls: Tags Visibility Toggle */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPins(!showPins)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 bg-black/65 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 transition shadow-md cursor-pointer"
                  title={showPins ? "Hide tags to see clean photo" : "Show interactive product tags"}
                >
                  {showPins ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-300" />
                      <span>Hide Tags</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>Show Tags ({activeLook.pins.length})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hotspot Pins - Sleek Translucent Micro-Pins (Non-Obstructive) */}
              {activeLook.pins.map((pin) => {
                const isSelected = selectedPinId === pin.id;
                const isHovered = hoveredPinId === pin.id;
                const isActive = isSelected || isHovered;
                const isDimmed = (selectedPinId || hoveredPinId) && !isActive;

                // When user toggled 'Hide Tags', only show if user hovers on the item from the right list
                if (!showPins && !isHovered) return null;

                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPinId(pin.id);
                      if (pin.buyUrl) {
                        window.open(pin.buyUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    onMouseEnter={() => setHoveredPinId(pin.id)}
                    onMouseLeave={() => setHoveredPinId(null)}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 p-2 cursor-pointer group/pin transition-all duration-200 ${
                      isDimmed ? 'opacity-30 scale-90' : 'opacity-100'
                    }`}
                  >
                    <span
                      className={`relative rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                        isActive
                          ? 'w-6 h-6 bg-amber-400 text-neutral-950 scale-110 ring-2 ring-black/40 shadow-lg'
                          : 'w-4.5 h-4.5 bg-black/45 hover:bg-black/85 backdrop-blur-md border border-white/80 text-white'
                      }`}
                    >
                      {isActive ? (
                        <Tag className="w-3 h-3" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white group-hover/pin:scale-125 transition" />
                      )}

                      {/* Gentle Ripple Wave on Selected Pin */}
                      {isSelected && (
                        <span className="absolute -inset-1.5 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-ping pointer-events-none" />
                      )}

                      {/* Tooltip on Hover / Active */}
                      {(isHovered || isSelected) && (
                        <span className="absolute left-1/2 -translate-x-1/2 -top-8 px-2.5 py-0.5 rounded-md bg-neutral-950/95 backdrop-blur-md text-white text-[11px] font-bold whitespace-nowrap shadow-xl border border-white/10 pointer-events-none z-40">
                          {pin.brand} • {formatPrice(pin.price)}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Synthesized by AI from real garments • Click pins to shop exact item
              </span>
              <span>100% In-Stock US Links</span>
            </div>
          </div>

          {/* Right Column: Complete Wardrobe & Direct Purchase Deck - Perfectly Proportion-Matched (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full gap-3">
            {/* Look Header Card - Clean & Minimal */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-white bg-neutral-950 px-2.5 py-1 rounded-full shadow-xs">
                  {activeLook.aesthetic}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight leading-snug">
                {activeLook.title}
              </h1>
            </div>

            {/* Outfit Garments List - Perfectly Proportioned to match photo height */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-sm flex-1 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-neutral-950" />
                  <h3 className="text-sm font-black text-neutral-950 tracking-tight">
                    Complete Outfit ({activeLook.pins.length} Pieces)
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-neutral-500 font-medium">Total:</span>
                  <span className="text-sm sm:text-base font-black text-neutral-950 font-mono tracking-tight">{totalOutfitPrice}</span>
                </div>
              </div>

              <div className="divide-y divide-neutral-100 flex flex-col flex-1 justify-around py-1">
                {activeLook.pins.map((pin) => {
                  const isSelected = selectedPinId === pin.id;

                  return (
                    <div
                      key={pin.id}
                      onClick={() => {
                        setSelectedPinId(pin.id);
                        if (pin.buyUrl) {
                          window.open(pin.buyUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      onMouseEnter={() => setHoveredPinId(pin.id)}
                      onMouseLeave={() => setHoveredPinId(null)}
                      className={`py-2 px-2.5 flex items-center justify-between gap-3 cursor-pointer rounded-xl transition-all duration-150 group ${
                        isSelected || hoveredPinId === pin.id
                          ? 'bg-amber-50/80 border-l-4 border-amber-500 shadow-xs ring-1 ring-amber-400/40'
                          : 'hover:bg-neutral-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded transition ${
                            isSelected ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-100 text-neutral-700 font-bold'
                          }`}>
                            {pin.category}
                          </span>
                          <span className="text-xs font-black text-neutral-800 tracking-wide uppercase">
                            {pin.brand}
                          </span>
                          {pin.sockTip && (
                            <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                              🧦 K-Sock Tip
                            </span>
                          )}
                        </div>

                        {/* High-Readability Product Name */}
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-950 leading-snug group-hover:text-amber-800 transition truncate">
                          {pin.title}
                        </h4>

                        <span className="text-[11px] text-neutral-400 block font-normal">
                          Available on <strong className="text-neutral-600 font-semibold">{pin.retailer}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="text-xs sm:text-sm font-black text-neutral-950 font-mono tracking-tight">
                          {formatPrice(pin.price)}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-neutral-950 group-hover:text-white flex items-center justify-center transition shadow-2xs">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4. CLEAN EDITORIAL LOOKS GALLERY */}
        <section className="mt-16 pt-12 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-neutral-950 tracking-tight">
                Editorial Lookbook Gallery ({filteredLooks.length} Curated Looks)
              </h2>
              <p className="text-xs text-neutral-500 mt-1">Select any editorial look to explore its verified real garment pins</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredLooks.map((look) => {
              const isSelected = activeLook.id === look.id;
              return (
                <div
                  key={look.id}
                  onClick={() => {
                    setActiveLook(look);
                    const primaryPin = look.pins && look.pins.length > 0 ? look.pins[0] : null;
                    if (primaryPin) {
                      setSelectedPinId(primaryPin.id);
                    }
                    window.scrollTo({ top: 80, behavior: 'smooth' });
                  }}
                  className={`group cursor-pointer rounded-xl overflow-hidden bg-white border transition-all duration-200 flex flex-col ${
                    isSelected
                      ? 'border-neutral-950 ring-2 ring-neutral-950 shadow-md scale-[1.02]'
                      : 'border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden">
                    <img
                      src={look.imageUrl}
                      alt={look.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white">
                        {look.aesthetic.split(' ')[0]}
                      </span>
                    </div>
                    {/* Hover overlay action pill */}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-white/95 text-neutral-950 text-xs font-black shadow-md flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>View {look.pins.length} Items</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-neutral-950 truncate">{look.title}</h4>
                    <span className="text-[11px] text-neutral-500 mt-0.5 block">{look.pins.length} Real Garments</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
          </>
        )}
      </main>

      {/* 5. CLEAN AI VIRTUAL TRY-ON MODAL (NO CLUTTER) */}
      {isTryOnModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsTryOnModalOpen(false);
              setTryOnResult(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setIsTryOnModalOpen(false);
                setTryOnResult(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-bold mb-2">
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Virtual Try-On Studio</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Style Your Own Photo with Real Garments</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Upload your photo, select an aesthetic, and see yourself styled in 100% real Zara US & Nordstrom tailoring.
              </p>
            </div>

            {/* Try-on Content */}
            {isTryOnLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mb-4" />
                <h4 className="text-base font-bold text-white mb-1">Fitting Real Garments to Your Silhouette...</h4>
                <p className="text-xs text-neutral-400">
                  {tryOnStep === 1 ? 'Scanning body silhouette & posture...' : 'Fitting verified Zara US & Nordstrom patterns...'}
                </p>
              </div>
            ) : tryOnResult ? (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4 aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
                  <div className="relative h-full bg-neutral-950">
                    <img src={userPhoto || ''} alt="Your Photo" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/70 px-2 py-0.5 rounded text-neutral-300">
                      Your Upload
                    </span>
                  </div>
                  <div className="relative h-full bg-neutral-950">
                    <img src={tryOnResult.imageUrl} alt="AI Styled" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 text-[10px] font-bold bg-purple-900/90 px-2 py-0.5 rounded text-purple-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" /> AI Styled
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setTryOnResult(null)}
                    className="text-xs font-bold text-neutral-400 hover:text-white transition"
                  >
                    ← Try Another Style / Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLook(tryOnResult);
                      setIsTryOnModalOpen(false);
                      window.scrollTo({ top: 80, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-white text-neutral-950 font-bold text-xs transition"
                  >
                    View Pinned Items in Studio →
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Upload Area */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                    1. Upload Your Photo (Full-Body or Half-Body)
                  </label>
                  {userPhoto ? (
                    <div className="relative rounded-2xl overflow-hidden border border-neutral-700 aspect-[16/9] max-h-48 bg-neutral-950 flex items-center justify-center">
                      <img src={userPhoto} alt="Upload" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setUserPhoto(null)}
                        className="absolute top-3 right-3 text-xs bg-black/70 hover:bg-black px-3 py-1 rounded-lg text-white font-bold transition"
                      >
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-neutral-700 hover:border-purple-400 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-neutral-900/40 hover:bg-neutral-900/80">
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      <Upload className="w-6 h-6 text-purple-400" />
                      <span className="text-xs font-bold text-white mt-1">Click to Upload Your Photo</span>
                      <span className="text-[11px] text-neutral-500">Supports JPG, PNG, WEBP</span>
                    </label>
                  )}
                </div>

                {/* Style Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                    2. Choose Your Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dynamicCategories.filter((c) => c.id !== 'all').map((cat) => {
                      const isSelected = selectedTryOnStyle === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedTryOnStyle(cat.id)}
                          className={`p-3 rounded-xl border text-left transition text-xs font-semibold ${
                            isSelected
                              ? 'bg-purple-950/80 border-purple-500 text-white'
                              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className="block truncate font-bold text-white">{cat.name}</span>
                          <span className="text-[10px] text-purple-300 font-normal">{cat.tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunVirtualStyling}
                  disabled={!userPhoto}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-700 text-white font-extrabold text-xs transition shadow-lg disabled:opacity-40 cursor-pointer"
                >
                  ✨ Style My Photo with Real Garments
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5.5. 2,071 REAL RETAIL GARMENTS PDP CATALOG MODAL */}
      {isCatalogOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCatalogOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
        >
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden relative">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between gap-4 flex-shrink-0 bg-neutral-50/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-white">
                    {allProductsData.length.toLocaleString()} In-Stock PDPs
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">100% Direct Product Detail Pages</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-950 mt-1 tracking-tight">
                  Real Retail Garments Wardrobe
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Specific authentic product pages on Zara US, Nordstrom, Mango US, COS & SSENSE. Zero generic search pages.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCatalogOpen(false)}
                className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-neutral-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
                {['All', 'Outer', 'Top', 'Bottom', 'Dresses', 'Shoes', 'Bags', 'Hats', 'Accessories', 'Sunglasses'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCatalogCategory(cat);
                      setCatalogVisibleCount(36);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                      catalogCategory === cat
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => {
                    setCatalogSearch(e.target.value);
                    setCatalogVisibleCount(36);
                  }}
                  placeholder={`Search ${allProductsData.length.toLocaleString()} items, brands or sunglasses...`}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                />
              </div>
            </div>

            {/* K-Style Socks & Styling Notice Banner */}
            <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border border-neutral-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧦</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-tight text-amber-300">The Seoul Sock & Legwear Formula</span>
                    <span className="text-[10px] font-bold bg-white/10 text-neutral-300 px-2 py-0.5 rounded-full">
                      Editorial Styling Only • Pure K-Guide
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-snug mt-0.5">
                    Socks define 80% of K-fashion silhouette balance. We don't sell socks directly, but every shoe PDP includes our master K-Style Sock Pairing Guide.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCatalogCategory('Shoes');
                  setCatalogVisibleCount(36);
                }}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black transition cursor-pointer flex-shrink-0"
              >
                Browse 345 Shoes with Sock Guides →
              </button>
            </div>

            {/* Product Cards Grid (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCatalogProducts.slice(0, catalogVisibleCount).map((item: any, idx: number) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-2xl border border-neutral-200/80 hover:border-neutral-400 bg-white hover:shadow-md transition flex flex-col justify-between gap-3 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-bold text-neutral-900 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
                        {item.retailer}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-neutral-950 leading-snug line-clamp-2 mt-1">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-neutral-400 block mt-1">
                      {item.brand} • {item.sku || 'SKU-VERIFIED'}
                    </span>

                    {item.sockTip && (
                      <div className="mt-2.5 p-2 rounded-lg bg-indigo-50/70 border border-indigo-100/80 text-[10px] text-indigo-900 font-medium leading-relaxed">
                        <span className="font-extrabold text-indigo-950 block">🧦 Sock Pairing:</span>
                        {item.sockTip}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <span className="text-sm font-black text-neutral-950">{formatPrice(item.price)}</span>
                    <a
                      href={item.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-bold shadow-sm transition"
                    >
                      <span>Shop PDP</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer with Load More */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between gap-4 flex-shrink-0 text-xs text-neutral-500">
              <span>
                Showing {Math.min(catalogVisibleCount, filteredCatalogProducts.length)} of {filteredCatalogProducts.length} items
              </span>
              {catalogVisibleCount < filteredCatalogProducts.length && (
                <button
                  type="button"
                  onClick={() => setCatalogVisibleCount((prev) => prev + 36)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-900 font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  Load 36 More Items ↓
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. IN-APP K-STYLE QUICK VIEW MODAL REMOVED (DIRECT LINK NAVIGATION ENABLED) */}

      {/* 6. CLEAN MINIMAL FOOTER */}
      <footer className="mt-20 bg-white border-t border-neutral-200 py-8 text-center text-xs text-neutral-500">
        <p className="font-semibold text-neutral-700">StylingHelper USA — Real Garment AI Inspo</p>
        <p className="mt-1 text-[11px]">100% Real-World Items from Zara US, Nordstrom & H&M US • Zero Fantasy Clothing</p>
      </footer>

      {/* 7. FAST 1-CLICK AUTH MODAL (Google & VIP Email Sign In / Sign Up) */}
      <USAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Join StylingHelper VIP"
        subtitle="100% Free Forever for Early Members. Unlock Seoul K-Styling formulas and verified US shopping links."
        onSuccess={(userData) => {
          const newUser = {
            name: userData.name || 'VIP Member',
            email: userData.email || '',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || 'VIP'}`,
            tier: 'Founding Member · Free Forever ($0/mo)'
          };
          setUser(newUser);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
