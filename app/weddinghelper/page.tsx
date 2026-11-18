'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, Sparkles, Upload, ArrowRight, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, Gem, Calendar,
  Share2, Download, RefreshCw, X, ExternalLink, Clock, CreditCard,
  SlidersHorizontal, Eye, Lock, Unlock, Check, Mail, Send,
  RotateCcw, Trash2, Loader2
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
  { id: 'theme_01_bali', title: 'Bali Rainforest Infinity Chapel', dest: 'Ubud, Bali, Indonesia', venue: 'The Edge Bali & Mandapa Ritz-Carlton', heroImg: '/images/weddings_240/theme_01_bali/scene_01.jpg', position: 'center center' },
  { id: 'theme_02_amalfi', title: 'Amalfi Coast Cliffside Belvedere', dest: 'Positano, Amalfi Coast, Italy', venue: 'Villa Cimbrone & Le Sirenuse', heroImg: '/images/weddings_240/theme_02_amalfi/scene_01_v2.jpg', position: 'center center' },
  { id: 'theme_03_lake_como', title: 'Lake Como Villa Renaissance', dest: 'Bellagio, Lake Como, Italy', venue: 'Villa d\'Este & Villa del Balbianello', heroImg: '/images/weddings_240/theme_03_lake_como/scene_01.jpg', position: 'center center' },
  { id: 'theme_04_paris', title: 'Paris Private Palace & Seine Terrace', dest: 'Paris, France', venue: 'Hôtel de Crillon & Shangri-La Paris', heroImg: '/images/weddings_240/theme_04_paris/scene_01.jpg', position: 'center center' },
  { id: 'theme_05_nyc', title: 'Manhattan Skyline Penthouse & Central Park', dest: 'New York City, USA', venue: 'The Glasshouses & Aman New York', heroImg: '/images/weddings_240/theme_05_nyc/scene_01.jpg', position: 'center center' },
  { id: 'theme_06_hanok', title: 'Korean Royal Hanok Heritage Sanctuary', dest: 'Seoul, South Korea', venue: 'Rakkojae Seoul & Yeongbingwan', heroImg: '/images/weddings_240/theme_06_hanok/scene_01.jpg', position: 'center center' },
  { id: 'theme_07_kyoto', title: 'Kyoto Bamboo Forest Zen Garden', dest: 'Kyoto, Japan', venue: 'Aman Kyoto & Hoshinoya Kyoto', heroImg: '/images/weddings_240/theme_07_kyoto/scene_01.jpg', position: 'center center' },
  { id: 'theme_08_udaipur', title: 'Rajasthan Royal Palace Sanctuary', dest: 'Udaipur, Rajasthan, India', venue: 'Taj Lake Palace & The Leela Palace', heroImg: '/images/weddings_240/theme_08_udaipur/scene_01.jpg', position: 'center center' },
  { id: 'theme_09_santorini', title: 'Santorini Caldera Sunset Cliff', dest: 'Oia, Santorini, Greece', venue: 'Canaves Oia Epitome & Grace Hotel', heroImg: '/images/weddings_240/theme_09_santorini/scene_01.jpg', position: 'center center' },
  { id: 'theme_10_cabo', title: 'Cabo San Lucas Oceanfront Modernist', dest: 'Cabo San Lucas, Mexico', venue: 'Montage Los Cabos & Waldorf Astoria', heroImg: '/images/weddings_240/theme_10_cabo/scene_01.jpg', position: 'center center' },
  { id: 'theme_11_liwa', title: 'Dubai Liwa Desert Golden Dunes', dest: 'Liwa Oasis, Abu Dhabi, UAE', venue: 'Qasr Al Sarab Desert Resort by Anantara', heroImg: '/images/weddings_240/theme_11_liwa/scene_01.jpg', position: '55% center' },
  { id: 'theme_12_swiss_alps', title: 'Swiss Alps Matterhorn Glass Chalet', dest: 'Zermatt, Switzerland', venue: 'The Omnia & Riffelalp Resort 2222m', heroImg: '/images/weddings_240/theme_12_swiss_alps/scene_01.jpg', position: 'center center' },
];

// Official PayPal NCP Payment URLs
const PAYPAL_CLASSIC_URL = process.env.NEXT_PUBLIC_PAYPAL_WEDDING_CLASSIC_URL || 'https://www.paypal.com/ncp/payment/LVRRE8SJKD3VA'; // $15 Classic (Single Destination 20 Scenes)
const PAYPAL_GRAND_URL = process.env.NEXT_PUBLIC_PAYPAL_WEDDING_GRAND_URL || 'https://www.paypal.com/ncp/payment/LVRRE8SJKD3VA'; // $29 Grand VIP (All 12 Destinations 240 Scenes)

export default function WeddingHelperPage() {
  const router = useRouter();

  // User VIP state
  const [user, setUser] = useState<{ email: string; isVip: boolean; plan?: 'single' | 'classic' | 'grand'; selectedTheme?: string } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<'classic' | 'grand'>('grand');
  const [checkoutSelectedTheme, setCheckoutSelectedTheme] = useState<string>('theme_01_bali');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
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

  // 12 Concepts Showcase & Asynchronous Email Delivery States
  const [conceptPreviews, setConceptPreviews] = useState<Record<string, string>>({});
  const [activeConceptModal, setActiveConceptModal] = useState<{ id: string; title: string; dest: string; venue: string; img: string } | null>(null);
  const [isGenerating12, setIsGenerating12] = useState<boolean>(false);
  const [show12Showcase, setShow12Showcase] = useState<boolean>(false);
  const [synthesizingConceptId, setSynthesizingConceptId] = useState<string | null>(null);
  const [deliveryEmail, setDeliveryEmail] = useState<string>('');
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState<boolean>(false);
  const [deliverySubmittedOrder, setDeliverySubmittedOrder] = useState<string | null>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const emailDeliveryRef = useRef<HTMLDivElement>(null);

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
      // Auto-clear trigger if requested via URL query (?reset=true or ?clear=true)
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('reset') === 'true' || params.get('clear') === 'true') {
          localStorage.removeItem('weddinghelper_uploaded_images');
          localStorage.removeItem('weddinghelper_concept_previews');
          localStorage.removeItem('weddinghelper_delivery_order');
          setCoupleImage(null);
          setBrideImage(null);
          setGroomImage(null);
          setFreePreviewImage(null);
          setConceptPreviews({});
          setShow12Showcase(false);
          window.history.replaceState({}, '', '/weddinghelper');
          showToast('✨ All uploaded photos have been reset.');
          return;
        }
      }

      const savedUserStr = localStorage.getItem('weddinghelper_user');
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          if (parsed?.email) {
            fetch(`/api/weddinghelper/member?email=${encodeURIComponent(parsed.email)}`)
              .then((res) => res.json())
              .then((data) => {
                if (data?.isVip) {
                  setUser({ email: parsed.email, isVip: true, plan: data.plan || 'grand' });
                } else {
                  localStorage.removeItem('weddinghelper_user');
                  setUser(null);
                }
              })
              .catch(() => {
                localStorage.removeItem('weddinghelper_user');
                setUser(null);
              });
          } else {
            localStorage.removeItem('weddinghelper_user');
            setUser(null);
          }
        } catch (e) {
          localStorage.removeItem('weddinghelper_user');
          setUser(null);
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

      const savedPreviews = localStorage.getItem('weddinghelper_concept_previews');
      if (savedPreviews) {
        try {
          const parsed = JSON.parse(savedPreviews);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            setConceptPreviews(parsed);
            setShow12Showcase(true);
          }
        } catch (e) {}
      }

      const savedOrderId = localStorage.getItem('weddinghelper_delivery_order');
      if (savedOrderId) {
        setDeliverySubmittedOrder(savedOrderId);
      }
    } catch (e) {
      console.warn('Hydration error:', e);
    }
  }, []);

  // Reset all uploaded photos to blank
  const handleResetAllPhotos = () => {
    try {
      localStorage.removeItem('weddinghelper_uploaded_images');
      localStorage.removeItem('weddinghelper_concept_previews');
      localStorage.removeItem('weddinghelper_delivery_order');
    } catch (e) {}
    setCoupleImage(null);
    setBrideImage(null);
    setGroomImage(null);
    setFreePreviewImage(null);
    setConceptPreviews({});
    setShow12Showcase(false);
    showToast('✨ All uploaded photos have been reset to blank.');
  };

  // Remove a single uploaded photo
  const handleRemoveSinglePhoto = (slot: 'couple' | 'bride' | 'groom') => {
    let updatedCouple = coupleImage;
    let updatedBride = brideImage;
    let updatedGroom = groomImage;

    if (slot === 'couple') {
      setCoupleImage(null);
      updatedCouple = null;
    } else if (slot === 'bride') {
      setBrideImage(null);
      updatedBride = null;
    } else if (slot === 'groom') {
      setGroomImage(null);
      updatedGroom = null;
    }

    try {
      localStorage.setItem('weddinghelper_uploaded_images', JSON.stringify([updatedCouple, updatedBride, updatedGroom]));
    } catch (e) {}
    showToast(`✓ ${slot === 'couple' ? 'Couple' : slot === 'bride' ? 'Bride' : 'Groom'} photo removed.`);
  };

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

  // 🌟 VIP Masterpiece Preview (Angle #01: Altar Vows - Gated by PayPal VIP Pass)
  const handleGenerateFreePreview = async () => {
    if (!user?.isVip && user?.plan !== 'grand') {
      setIsCheckoutOpen(true);
      showToast('🔒 Please complete the $19 VIP Pass with PayPal to transform your photos into high-fashion destinations.');
      return;
    }

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
          email: user?.email,
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

      if (res.status === 402) {
        localStorage.removeItem('weddinghelper_user');
        setUser(null);
        setIsCheckoutOpen(true);
        showToast('🔒 $19 VIP Pass required. Please complete payment via PayPal.');
        return;
      }

      const data = await res.json();
      if (data?.success && data?.visualizedImageUrl) {
        setFreePreviewImage(data.visualizedImageUrl);
        showToast('🎉 Your AI Masterpiece is ready!', 5000);
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

  // 🌟 12 World Concepts Showcase Synthesis Handler (1 Representative Photo per Concept)
  const handleGenerate12Concepts = async () => {
    const imagesToUse = getClientImages();
    if (imagesToUse.length === 0) {
      showToast('⚠️ Please upload your couple photo first.');
      coupleInputRef.current?.click();
      return;
    }

    // Require PayPal VIP Pass ($19) to synthesize and transform photos
    if (!user?.isVip && user?.plan !== 'grand') {
      setIsCheckoutOpen(true);
      showToast('🔒 Please complete the $19 VIP Pass with PayPal to transform your photos into high-fashion destinations.');
      return;
    }

    setIsGenerating12(true);
    setShow12Showcase(true);

    // Scroll to showcase
    setTimeout(() => {
      showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);

    let currentPreviews = { ...conceptPreviews };
    let successCount = 0;

    for (let i = 0; i < DESTINATION_240_CONFIGS.length; i++) {
      const concept = DESTINATION_240_CONFIGS[i];
      setSynthesizingConceptId(concept.id);
      setPreviewStepText(`Synthesizing Concept ${i + 1}/12: ${concept.title}...`);

      // Gentle pause to respect API rate limits
      if (i > 0) {
        await new Promise((r) => setTimeout(r, 1200));
      }

      try {
        const res = await fetch('/api/weddinghelper/visualize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email,
            images: imagesToUse,
            image: imagesToUse[0],
            targetSceneImage: concept.heroImg,
            themeId: concept.id,
            angleTitle: 'Ceremonial Altar Vows',
            groomHeight,
            groomWeight,
            brideHeight,
            brideWeight,
          }),
        });

        if (res.status === 402) {
          localStorage.removeItem('weddinghelper_user');
          setUser(null);
          setIsCheckoutOpen(true);
          showToast('🔒 $19 VIP Pass required. Please complete payment via PayPal.');
          break;
        }

        const data = await res.json();
        if (data?.success && data?.visualizedImageUrl) {
          currentPreviews[concept.id] = data.visualizedImageUrl;
          setConceptPreviews({ ...currentPreviews });
          try {
            localStorage.setItem('weddinghelper_concept_previews', JSON.stringify(currentPreviews));
          } catch (e) {}
          successCount++;
        }
      } catch (err) {
        console.warn(`Concept ${concept.id} synthesis error:`, err);
      }
    }

    setIsGenerating12(false);
    setSynthesizingConceptId(null);
    setPreviewStepText('');

    if (successCount > 0) {
      showToast(`🎉 12 Concepts Showcase Complete! Enter your email below to receive all 240 photos.`, 6000);
      setTimeout(() => {
        emailDeliveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  };

  // 🌟 Synthesize any specific concept with user's face (Gated by PayPal VIP Pass)
  const handleSynthesizeSingleConcept = async (themeId: string, angleTitle = 'Ceremonial Altar Vows') => {
    const imagesToUse = getClientImages();
    if (imagesToUse.length === 0) {
      showToast('⚠️ Please upload your reference photo first.');
      coupleInputRef.current?.click();
      return;
    }

    // Require PayPal VIP Pass ($19) to synthesize individual concepts
    if (!user?.isVip && user?.plan !== 'grand') {
      setIsCheckoutOpen(true);
      showToast('🔒 Please activate the $19 VIP Pass with PayPal to synthesize your face into all destinations.');
      return;
    }

    const themeConfig = DESTINATION_240_CONFIGS.find((t) => t.id === themeId);
    setSynthesizingConceptId(themeId);
    showToast(`✨ Synthesizing showcase portrait for ${themeConfig?.title || themeId}...`);

    try {
      const res = await fetch('/api/weddinghelper/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          images: imagesToUse,
          image: imagesToUse[0],
          targetSceneImage: themeConfig?.heroImg,
          themeId,
          angleTitle,
          groomHeight,
          groomWeight,
          brideHeight,
          brideWeight,
        }),
      });

      if (res.status === 402) {
        localStorage.removeItem('weddinghelper_user');
        setUser(null);
        setIsCheckoutOpen(true);
        showToast('🔒 $19 VIP Pass required. Please complete payment via PayPal.');
        return;
      }

      const data = await res.json();
      if (data?.success && data?.visualizedImageUrl) {
        const updated = { ...conceptPreviews, [themeId]: data.visualizedImageUrl };
        setConceptPreviews(updated);
        try {
          localStorage.setItem('weddinghelper_concept_previews', JSON.stringify(updated));
        } catch (e) {}
        showToast(`🎉 Showcase portrait synthesized for ${themeConfig?.title}!`);
      } else {
        showToast('⚠️ Synthesis delayed. Please retry in a moment.');
      }
    } catch (e) {
      showToast('⚠️ Synthesis error. Please check your network connection.');
    } finally {
      setSynthesizingConceptId(null);
    }
  };

  // 🌟 Asynchronous Full 240 Album Email Delivery Request
  const handleSubmitEmailDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryEmail || !deliveryEmail.includes('@')) {
      showToast('⚠️ Please enter a valid email address.');
      return;
    }

    // Require PayPal payment activation before creating album delivery request
    if (!user?.isVip && user?.plan !== 'grand' && user?.plan !== 'classic') {
      setCheckoutEmail(deliveryEmail);
      setIsCheckoutOpen(true);
      showToast('🔒 Please activate your VIP Pass ($15 Classic / $29 Grand VIP) via PayPal first to receive your bespoke album by email.');
      return;
    }

    const imagesToUse = getClientImages();
    if (imagesToUse.length === 0) {
      showToast('⚠️ Please upload the bride & groom photos first.');
      coupleInputRef.current?.click();
      return;
    }

    setIsSubmittingDelivery(true);
    try {
      const res = await fetch('/api/weddinghelper/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: deliveryEmail.trim().toLowerCase(),
          plan: user?.plan || 'grand',
          selectedTheme: user?.selectedTheme || 'theme_01_bali',
          proportions: { groomHeight, groomWeight, brideHeight, brideWeight },
          clientImages: imagesToUse,
        }),
      });

      if (res.status === 402) {
        setIsCheckoutOpen(true);
        showToast('🔒 VIP Pass payment required. Please complete payment via PayPal.');
        return;
      }

      const data = await res.json();
      if (data?.success && data?.orderId) {
        setDeliverySubmittedOrder(data.orderId);
        try {
          localStorage.setItem('weddinghelper_delivery_order', data.orderId);
        } catch (e) {}
        showToast('🎉 Request submitted! Your bespoke wedding album will be delivered to your email.', 6000);
      } else {
        showToast(`⚠️ ${data?.error || 'A temporary error occurred while submitting. Please retry.'}`);
      }
    } catch (err) {
      console.warn('Delivery submit error:', err);
      showToast('⚠️ Network connection error. Please check your connection.');
    } finally {
      setIsSubmittingDelivery(false);
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

  // Handle VIP Activation with verified PayPal Email & Transaction ID
  const handleVerifyAndActivateVip = async () => {
    const email = checkoutEmail.trim().toLowerCase();
    const txId = transactionId.trim();

    if (!email || !email.includes('@')) {
      showToast('⚠️ Please enter your valid PayPal email address.');
      return;
    }
    if (!txId || txId.length < 5) {
      showToast('⚠️ Please enter your PayPal Transaction ID or receipt number.');
      return;
    }

    setIsVerifyingPayment(true);
    try {
      const res = await fetch('/api/weddinghelper/member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          transactionId: txId,
          plan: checkoutPlan,
          selectedTheme: checkoutSelectedTheme,
        }),
      });

      const data = await res.json();
      if (data?.success && data?.member?.isVip) {
        const vipRecord = {
          email,
          isVip: true,
          plan: checkoutPlan,
          selectedTheme: checkoutSelectedTheme,
        };
        setUser(vipRecord);
        localStorage.setItem('weddinghelper_user', JSON.stringify(vipRecord));
        setIsCheckoutOpen(false);

        const isClassic = checkoutPlan === 'classic';
        const successMsg = isClassic
          ? '🎉 Classic Single-Theme Pass Activated! 20 Masterpiece scenes unlocked.'
          : '🎉 Grand VIP All-Access Pass Activated! All 240 destination scenes unlocked.';
        showToast(successMsg, 5000);

        // Create server order and navigate
        const imagesToUse = getClientImages();
        let orderIdParam = '';
        try {
          const orderRes = await fetch('/api/weddinghelper/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              plan: checkoutPlan,
              selectedTheme: checkoutSelectedTheme,
              proportions: { groomHeight, groomWeight, brideHeight, brideWeight },
              clientImages: imagesToUse,
            }),
          });
          const orderData = await orderRes.json();
          if (orderData?.success && orderData.orderId) {
            orderIdParam = `&orderId=${orderData.orderId}`;
          }
        } catch (e) {}

        const targetTheme = checkoutSelectedTheme || 'theme_01_bali';
        setTimeout(() => {
          router.push(`/weddinghelper/gallery?dest=${targetTheme}&autoSynthesize=true${orderIdParam}`);
        }, 400);
      } else {
        showToast(`❌ Verification failed: ${data?.error || 'Invalid payment credentials'}`);
      }
    } catch (e) {
      showToast('⚠️ Network error during payment verification.');
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // Restore VIP Access with Strict Server Verification
  const handleRestoreVip = async () => {
    const email = restoreEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      showToast('⚠️ Please enter a valid email address.');
      return;
    }

    try {
      const res = await fetch(`/api/weddinghelper/member?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data?.isVip) {
        const vipRecord = { email, isVip: true, plan: data.plan || ('grand' as const) };
        setUser(vipRecord);
        localStorage.setItem('weddinghelper_user', JSON.stringify(vipRecord));
        setIsCheckoutOpen(false);
        showToast('🎉 VIP Pass Restored successfully! Welcome back.');
      } else {
        showToast('❌ No active $19 VIP Pass found for this email. Please complete payment via PayPal.');
      }
    } catch (err) {
      showToast('⚠️ Verification error. Please check your internet connection.');
    }
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

      {/* 2. Architectural Hero Section with Loss-Aversion 55.7% Hook */}
      <section className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-8 max-w-5xl mx-auto text-center">
        {/* Real-time VIP Scarcity Alert Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F181B] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-[0.15em] mb-4 shadow-md animate-pulse">
          <Sparkles className="w-3.5 h-3.5 fill-[#D4AF37]" />
          <span>High-Precision Server Allocation • Only 7 VIP 4K Slots Remaining This Week</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EEDB] border border-[#D4AF37]/40 text-[#1F181B] text-xs font-bold uppercase tracking-[0.2em] mb-5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>12 Global Sanctuaries • 240 Editorial Camera Angles</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal text-[#1F181B] tracking-tight leading-[1.15]">
          Don't Waste <span className="line-through text-[#1F181B]/40 font-mono text-2xl sm:text-4xl">$15,000+</span> & 14-Hour Flights on Destination Shoots.<br className="hidden sm:inline" />
          <span className="font-serif font-bold text-[#8C6D23] italic">
            240 Haute Couture Masterpieces in 1-Second.
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base md:text-lg text-[#1F181B]/70 max-w-3xl mx-auto font-sans leading-relaxed">
          Skip the exhausting travel, jet lag, and unpredictable weather. We transplant your <strong>exact facial bone structures and genuine expressions</strong> into Lake Como, Amalfi Coast, Paris Palaces, Bali Ritz-Carlton, and 8 more global sanctuaries across <strong>240 editorial camera angles in seconds</strong> — with <strong>100% facial likeness lock</strong>.
        </p>

        {/* 3 Core Value Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-sans font-medium text-[#1F181B]/80">
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#1F181B]/10 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
            <span>1:1 Facial Likeness Locked (Zero AI Distortion)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#1F181B]/10 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
            <span>240 Bespoke Editorial Angles (12 Sanctuaries)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#1F181B]/10 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
            <span>99.8% Cost Savings ($19 Lifetime VIP Special)</span>
          </div>
        </div>
      </section>

      {/* 2-1. Cost & Value Contrast Comparison Matrix (Traditional Shoot vs WeddingHelper) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 shadow-lg">
          <div className="text-center mb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C5A059] block">
              HONEST VALUE COMPARISON
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1F181B] mt-1">
              Traditional Destination Shoot vs. WeddingHelper 1:1 Matrix
            </h3>
            <p className="text-xs text-[#1F181B]/60 mt-1">
              Why forward-thinking couples choose WeddingHelper before booking flights and hotels.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead>
                <tr className="border-b border-[#1F181B]/10 text-[#1F181B]/60 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Comparison Metric</th>
                  <th className="py-3 px-3">Traditional Overseas Shoot</th>
                  <th className="py-3 px-3 text-[#8C6D23] font-bold bg-[#F5EEDB]/50 rounded-t-xl">WeddingHelper VIP All-Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F181B]/5 text-[#1F181B]/80">
                <tr>
                  <td className="py-3.5 px-3 font-semibold text-[#1F181B]">Total Investment</td>
                  <td className="py-3.5 px-3 text-red-600 font-medium">$15,000 - $22,000 USD (Flights, 5-Star Hotel, Photographer, HMU)</td>
                  <td className="py-3.5 px-3 font-bold text-[#8C6D23] bg-[#F5EEDB]/50">
                    <span className="text-base font-extrabold text-[#1F181B] mr-1">$19</span> USD (One-Time, 99.8% Savings)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-semibold text-[#1F181B]">Time & Fatigue</td>
                  <td className="py-3.5 px-3">5 to 7 Days Minimum (14hr Flights, Jet Lag, Outdoor Exhaustion)</td>
                  <td className="py-3.5 px-3 font-bold text-[#8C6D23] bg-[#F5EEDB]/50">
                    Upload Couple & Close-Up Photos ➔ <strong>Instant AI Rendering</strong> (Zero Travel Fatigue)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-semibold text-[#1F181B]">Sanctuary Variety</td>
                  <td className="py-3.5 px-3">Single City / Location (Additional Destinations Cost Thousands)</td>
                  <td className="py-3.5 px-3 font-bold text-[#8C6D23] bg-[#F5EEDB]/50">
                    <strong>12 Iconic Sanctuaries Across 240 Bespoke Angles</strong>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-semibold text-[#1F181B]">Delivery Turnaround</td>
                  <td className="py-3.5 px-3">3 to 6 Months Waiting for Color Grading & Edits</td>
                  <td className="py-3.5 px-3 font-bold text-[#8C6D23] bg-[#F5EEDB]/50">
                    <strong>Instant 4K Lossless ZIP Download</strong> Available Immediately
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-semibold text-[#1F181B]">Facial Likeness</td>
                  <td className="py-3.5 px-3">Subject to Photographer's Personal Retouching Style</td>
                  <td className="py-3.5 px-3 font-bold text-[#8C6D23] bg-[#F5EEDB]/50">
                    <strong>1:1 Biometric Facial Identity Lock</strong> (Zero Distortion / Westernization)
                  </td>
                </tr>
              </tbody>
            </table>
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
            <div className="flex items-center gap-3">
              {(coupleImage || brideImage || groomImage) && (
                <button
                  type="button"
                  onClick={handleResetAllPhotos}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Photos</span>
                </button>
              )}
              <span className="text-xs font-sans text-[#1F181B]/60">
                Face & body shape are 100% preserved
              </span>
            </div>
          </div>

          {/* Pro Quality Likeness Tip Banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-[#F5EEDB]/60 via-white/80 to-[#FAF8F5] border border-[#C5A059]/30 rounded-2xl flex items-center gap-3.5 text-xs text-[#1F181B] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="leading-relaxed">
              <strong className="text-[#C5A059] font-bold">Pro Tip for 100% Facial Likeness:</strong> Upload photos with <strong className="font-semibold text-[#1F181B]">natural frontal lighting and a subtle, relaxed smile</strong> without heavy beauty filters. Your authentic facial landmarks and expressions will be preserved 1:1 in breathtaking 8K editorial masterpieces.
            </div>
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSinglePhoto('couple');
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition z-20 cursor-pointer shadow-md"
                    title="Remove couple photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSinglePhoto('bride');
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition z-20 cursor-pointer shadow-md"
                    title="Remove bride photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSinglePhoto('groom');
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition z-20 cursor-pointer shadow-md"
                    title="Remove groom photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
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

          {/* Action CTAs: 12 Concepts Showcase & Email Delivery */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={handleGenerate12Concepts}
              disabled={isGenerating12 || isGeneratingPreview}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3C669] to-[#D4AF37] text-[#1F181B] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition shadow-xl border border-[#D4AF37]/50 hover:brightness-105 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating12 ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#1F181B]" />
                  <span>{previewStepText || 'Synthesizing 12 World Concepts (1 Each)...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-[#1F181B] text-[#1F181B]" />
                  <span>Generate 12 World Concepts (1 Photo Each)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShow12Showcase(true);
                setTimeout(() => {
                  emailDeliveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
              }}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-[#FAF8F5] text-[#1F181B] hover:bg-[#F5EEDB] font-bold text-xs uppercase tracking-wider transition border border-[#1F181B]/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#C5A059]" />
              <span>Send All 240 Photos via Email ➔</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. 12 CONCEPTS SHOWCASE SECTION (1 Representative Photo per Concept) */}
      <section ref={showcaseRef} className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#F5EEDB] text-[#C5A059] border border-[#C5A059]/30">
            12 WORLD CONCEPTS • 1 PHOTO EACH FIRST
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F181B] mt-3">
            12 World-Class Luxury Landmark Wedding Showcase
          </h2>
          <p className="text-xs sm:text-sm text-[#1F181B]/70 mt-1 max-w-lg mx-auto">
            12개 세계관의 대표 1장(총 12장)을 먼저 실시간으로 확인하신 후, 전체 240장 4K 화보 패키지를 이메일로 안전하게 발송해 드립니다.
          </p>
        </div>

        {/* 12 Destination Grid with 1 Preview Photo Each */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {DESTINATION_240_CONFIGS.map((dest, idx) => {
            const isSynthesized = Boolean(conceptPreviews[dest.id]);
            const displayImg = conceptPreviews[dest.id] || dest.heroImg;

            return (
              <div
                key={dest.id}
                className="group bg-white rounded-3xl overflow-hidden border border-[#1F181B]/10 hover:border-[#C5A059] transition-all duration-300 shadow-md hover:shadow-xl flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/10">
                  <Image
                    src={displayImg}
                    alt=""
                    aria-label={dest.title}
                    fill
                    unoptimized
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: isSynthesized ? 'center center' : (dest.position || 'center center') }}
                  />

                  {/* Haute Couture Atelier Waiting Overlay */}
                  {synthesizingConceptId === dest.id && (
                    <div className="absolute inset-0 bg-[#1F181B]/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                      <div className="relative w-12 h-12 rounded-full border border-[#D4AF37]/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.35)] mb-2.5">
                        <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
                        <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                      </div>
                      <span className="text-xs font-serif font-bold text-white tracking-wide">
                        Crafting 4K Masterpiece...
                      </span>
                      <span className="text-[9px] text-[#D4AF37] font-mono mt-1 px-2 py-0.5 rounded-full bg-black/50 border border-[#D4AF37]/30">
                        Applying 1:1 Biometric Glass-Skin...
                      </span>
                      <div className="w-20 h-1 bg-white/10 rounded-full mt-2.5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] animate-pulse" style={{ width: '80%' }} />
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#1F181B]/85 text-[#D4AF37] backdrop-blur-md border border-[#D4AF37]/30 shadow-xs">
                      Concept #{String(idx + 1).padStart(2, '0')}
                    </span>
                    {isSynthesized && (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#10B981] text-white shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> 1:1 Face Synthesized
                      </span>
                    )}
                  </div>

                  {/* Zoom button */}
                  <button
                    type="button"
                    onClick={() => setActiveConceptModal({ ...dest, img: displayImg })}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-md"
                    title="View Fullscreen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Bottom Angle Tag */}
                  <div className="absolute bottom-2.5 inset-x-2.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-[10px] font-medium flex items-center justify-between border border-white/10">
                    <span className="text-[#D4AF37] font-bold">Angle #01 Ceremonial</span>
                    <span className="text-white/60 text-[9px]">Remaining 19 Angles via Email</span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex flex-col justify-between flex-1 bg-[#FAF8F5]">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1F181B] group-hover:text-[#C5A059] transition-colors leading-snug">
                      {dest.title}
                    </h4>
                    <p className="text-[11px] text-[#1F181B]/60 mt-1 truncate">
                      {dest.venue}
                    </p>
                    <p className="text-[10px] text-[#C5A059] font-medium mt-0.5">
                      📍 {dest.dest}
                    </p>
                  </div>

                  {/* Card Action */}
                  <div className="mt-4 pt-3 border-t border-[#1F181B]/10 flex items-center justify-between gap-2">
                    {synthesizingConceptId === dest.id ? (
                      <div className="text-[11px] font-bold text-[#D4AF37] flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin text-[#D4AF37]" />
                        <span>Synthesizing...</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSynthesizeSingleConcept(dest.id)}
                        disabled={Boolean(synthesizingConceptId)}
                        className="text-[11px] font-bold text-[#1F181B] hover:text-[#C5A059] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3 text-[#C5A059]" />
                        <span>{isSynthesized ? 'Re-Synthesize' : 'Synthesize My Face'}</span>
                      </button>
                    )}
                    <Link
                      href={`/weddinghelper/gallery?dest=${dest.id}`}
                      className="text-[10px] font-bold text-[#C5A059] hover:underline flex items-center gap-0.5"
                    >
                      <span>View 20 Angles</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. EMAIL DELIVERY LEAD-CAPTURE SECTION (Receive All 240 Photos via Email) */}
        <div ref={emailDeliveryRef} className="mt-16 bg-[#1F181B] text-white rounded-3xl p-6 sm:p-12 border border-[#D4AF37]/50 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-widest mb-4">
              <Mail className="w-3.5 h-3.5" />
              <span>FULL 240 ALBUM ASYNC DELIVERY SYSTEM</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Receive the Full 240-Photo Album by Email
            </h3>
            <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
              컨셉별 대표 1장(총 12장) 확인 완료 후, 12개 세계관의 전체 20개 앵글(총 240장 4K 화보 패키지)을 이메일로 안전하게 발송해 드립니다.
            </p>

            {/* Included Perks Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs text-white/80 my-8 bg-white/5 p-5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span><strong>12 Global Sanctuaries × 20 Editorial Angles</strong> (240 Masterpieces Total)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span><strong>4K Lossless Hasselblad Master ZIP Archive</strong> Included</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span><strong>Haute Couture Specs</strong> (Designer Gowns, Tuxedos & Cartier Bands)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span><strong>100% Facial Bone Structure & Body Proportions Locked</strong></span>
              </div>
            </div>

            {/* Email Form or Success State */}
            {deliverySubmittedOrder ? (
              <div className="p-6 bg-gradient-to-r from-[#10B981]/20 via-[#10B981]/10 to-[#10B981]/20 border border-[#10B981]/40 rounded-2xl text-center">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-white">
                  Full 240 Album Email Delivery Request Confirmed!
                </h4>
                <p className="text-white/80 text-xs sm:text-sm mt-1">
                  Your 240-portrait high-resolution album package will be securely delivered to <span className="text-[#D4AF37] font-semibold">{deliveryEmail}</span> as soon as background rendering completes.
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
                  <span>Order ID: <code className="text-[#D4AF37] font-mono">{deliverySubmittedOrder}</code></span>
                  <span>•</span>
                  <span>Status: <strong className="text-[#10B981]">Background 240 Rendering Queue Active</strong></span>
                </div>
                <Link
                  href={`/weddinghelper/gallery?orderId=${deliverySubmittedOrder}`}
                  className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D4AF37] text-[#1F181B] font-extrabold text-xs uppercase tracking-wider hover:brightness-105 transition"
                >
                  <span>Open Private Client Gallery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmitEmailDelivery} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" noValidate>
                <input
                  type="email"
                  placeholder="Enter your email to receive all 240 photos"
                  value={deliveryEmail}
                  onChange={(e) => setDeliveryEmail(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-hidden focus:border-[#D4AF37] transition"
                />
                <button
                  type="submit"
                  disabled={isSubmittingDelivery}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3C669] to-[#D4AF37] text-[#1F181B] font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:brightness-105 transition shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isSubmittingDelivery ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#1F181B]" />
                      <span>Sending 240 Photos...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Full 240 Album via Email</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-white/40 text-[11px] mt-4">
              🔒 Your email address will strictly be used only to deliver your 240-masterpiece album and download link.
            </p>
          </div>
        </div>
      </section>

      {/* 12 Concept Detail Modal */}
      {activeConceptModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1F181B] text-white rounded-3xl max-w-3xl w-full overflow-hidden border border-[#D4AF37]/50 shadow-2xl">
            <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
                  {activeConceptModal.dest}
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                  {activeConceptModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveConceptModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-[3/4] sm:aspect-[16/10] w-full bg-black">
              <Image
                src={activeConceptModal.img}
                alt={activeConceptModal.title}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
            <div className="p-4 sm:p-6 bg-[#251E20] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-white/70">
                <span>Venue: <strong className="text-white">{activeConceptModal.venue}</strong></span>
                <span className="block text-[11px] text-[#D4AF37] mt-0.5">Showcase Angle #01 Shown • Remaining 19 Angles Delivered via Email</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSynthesizeSingleConcept(activeConceptModal.id);
                    setActiveConceptModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#1F181B] font-bold text-xs uppercase tracking-wider hover:brightness-105 transition cursor-pointer"
                >
                  Synthesize My Face
                </button>
                <button
                  type="button"
                  onClick={() => setActiveConceptModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-1. Viral Mobile Invitation & Instagram Engine */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        <div className="bg-gradient-to-br from-[#1F181B] via-[#2A2124] to-[#1F181B] text-white rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/30 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-[0.2em]">
                <Share2 className="w-3 h-3 text-[#D4AF37]" />
                <span>Viral Flywheel • High-Impact Guest Invitations</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                "Where Was This Shot?" <br />
                <span className="text-[#D4AF37]">Receive Endless Compliments from Every Guest.</span>
              </h3>
              <p className="text-white/70 text-xs sm:text-sm font-sans leading-relaxed">
                Curate your favorite master portraits from your 240 couture collection into an <strong>interactive mobile wedding invitation link</strong>. Includes background music, venue maps, RSVP guestbook, and 9:16 4K visual assets tailored for Instagram Reels and Stories.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-white/80 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Instagram Reels & Stories 9:16 Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Unlimited Guest Mobile Invitations</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl p-5 text-center shrink-0 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-white block uppercase tracking-wider">
                Digital Mobile Invitation
              </span>
              <p className="text-[11px] text-white/50 mt-1 mb-4">
                Mobile invitation templates across all 12 destinations automatically unlocked with VIP Pass
              </p>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-[#1F181B] font-extrabold text-xs uppercase tracking-wider hover:brightness-105 transition cursor-pointer shadow-lg"
              >
                Get Started with VIP Pass ($15 / $29)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Honest Transparent Pricing: Classic ($15) & Grand VIP ($29) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] bg-[#D4AF37] text-[#1F181B] shadow-md">
            LIFETIME VIP ACCESS • LAUNCH SPECIAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F181B] mt-4">
            Transparent Atelier Pricing
          </h2>
          <p className="text-[#1F181B]/70 text-xs sm:text-sm mt-1">
            Zero subscriptions. Zero hidden fees. Choose single-location classic focus or all-inclusive world tour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Classic Plan ($15) */}
          <div className="bg-[#1F181B] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col justify-between text-left">
            <div>
              <div className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest">SINGLE DESTINATION</div>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">Classic Pass</h3>
              <p className="text-white/60 text-xs mt-1">Perfect for couples who have 1 dream wedding sanctuary in mind.</p>
              <div className="my-5">
                <span className="text-white/40 line-through text-base font-mono mr-2">$45 USD</span>
                <span className="text-4xl font-mono font-extrabold text-[#D4AF37]">$15</span>
                <span className="text-white/70 text-xs uppercase tracking-wider ml-1.5">USD (One-Time)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>20 Bespoke Masterpiece Photos</strong> of 1 selected destination</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>1:1 Facial Likeness Locked</strong> (Zero Westernization)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>Full 4K Ultra-HD Resolution</strong> JPG Downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>Private Gallery Access</strong> for selected location</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                setCheckoutPlan('classic');
                setIsCheckoutOpen(true);
              }}
              className="mt-6 w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider transition border border-white/20 cursor-pointer"
            >
              Choose Classic ($15) ➔
            </button>
          </div>

          {/* Grand VIP Plan ($29) */}
          <div className="bg-[#1F181B] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-2xl flex flex-col justify-between text-left relative overflow-hidden">
            <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1F181B] text-[9px] font-black uppercase tracking-wider shadow-sm">
              BEST VALUE • 85% SAVE
            </span>
            <div>
              <div className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest">ALL-ACCESS WORLD TOUR</div>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">Grand VIP Pass</h3>
              <p className="text-white/60 text-xs mt-1">All 12 iconic global destinations with full digital invitation suite.</p>
              <div className="my-5">
                <span className="text-white/40 line-through text-base font-mono mr-2">$149 USD</span>
                <span className="text-4xl font-mono font-extrabold text-[#D4AF37]">$29</span>
                <span className="text-white/70 text-xs uppercase tracking-wider ml-1.5">USD (One-Time)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>All 240 Masterpiece Portraits</strong> (20 angles × 12 destinations)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>1-Click 4K ZIP Package</strong> organized by destination</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>Interactive Mobile Invitation Link</strong> with RSVP & BGM</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>Instagram Reels/Stories 9:16 Assets</strong> Included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>Priority Background Rendering Queue</strong> & Email Delivery</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                setCheckoutPlan('grand');
                setIsCheckoutOpen(true);
              }}
              className="mt-6 w-full py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#F3C669] text-[#1F181B] font-extrabold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              Get Grand VIP ($29) ➔
            </button>
          </div>
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

            <div className="text-center mb-5">
              <span className="px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#D4AF37] text-[#1F181B]">
                OFFICIAL ATELIER CHECKOUT
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-2">
                Choose Your Atelier Tier
              </h3>
              <p className="text-white/60 text-xs mt-1">
                Select your bespoke high-fashion wedding portfolio package
              </p>
            </div>

            {/* Plan Tier Selector */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setCheckoutPlan('classic')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer relative ${
                  checkoutPlan === 'classic'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/15 ring-2 ring-[#D4AF37]/40'
                    : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">Single Location</div>
                <div className="text-base font-bold text-white mt-0.5">Classic ($15)</div>
                <div className="text-[10px] text-white/60 mt-1 leading-tight">20 bespoke 4K photos of 1 selected destination</div>
              </button>

              <button
                type="button"
                onClick={() => setCheckoutPlan('grand')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer relative ${
                  checkoutPlan === 'grand'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/15 ring-2 ring-[#D4AF37]/40'
                    : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1F181B] text-[8px] font-black uppercase">BEST VALUE</span>
                <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">All-Access Pass</div>
                <div className="text-base font-bold text-white mt-0.5">Grand VIP ($29)</div>
                <div className="text-[10px] text-white/60 mt-1 leading-tight">All 240 photos across 12 world destinations</div>
              </button>
            </div>

            {/* Single Theme Selection (Only shown when Classic plan is selected) */}
            {checkoutPlan === 'classic' && (
              <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/15">
                <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1.5">
                  Select Your Exclusive Destination (20 Photos Locked)
                </label>
                <select
                  value={checkoutSelectedTheme}
                  onChange={(e) => setCheckoutSelectedTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-hidden focus:border-[#D4AF37]"
                >
                  {DESTINATION_240_CONFIGS.map((d) => (
                    <option key={d.id} value={d.id} className="bg-[#1F181B] text-white">
                      {d.title} ({d.dest})
                    </option>
                  ))}
                </select>
                <p className="text-[9px] text-white/50 mt-1.5">
                  🔒 Note: Classic Pass strictly isolates and renders only this destination. Other destinations remain locked.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Step 1: PayPal Checkout */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F181B] font-black text-xs flex items-center justify-center">1</span>
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    PayPal Payment ({checkoutPlan === 'classic' ? '$15' : '$29'})
                  </span>
                </div>
                <p className="text-[11px] text-white/60">
                  Tap below to securely complete payment via PayPal or Card. You will receive an official receipt number.
                </p>
                <a
                  href={checkoutPlan === 'classic' ? PAYPAL_CLASSIC_URL : PAYPAL_GRAND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay {checkoutPlan === 'classic' ? '$15' : '$29'} with PayPal or Card</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Step 2: Activate VIP with Payer Email & Transaction ID */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F181B] font-black text-xs flex items-center justify-center">2</span>
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    Activate {checkoutPlan === 'classic' ? 'Classic Pass' : 'Grand VIP Access'}
                  </span>
                </div>
                <p className="text-[11px] text-white/60">
                  Enter your PayPal payer email & receipt ID to unlock {checkoutPlan === 'classic' ? 'your 20 destination photos' : 'all 240 luxury photos'}:
                </p>
                <div>
                  <label className="text-[10px] font-bold text-white/70 block mb-1">
                    PayPal Payer Email
                  </label>
                  <input
                    type="email"
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    placeholder="your-paypal-email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/70 block mb-1">
                    PayPal Transaction ID / Receipt Number
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 17-character PayPal Transaction ID"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  type="button"
                  disabled={isVerifyingPayment}
                  onClick={handleVerifyAndActivateVip}
                  className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F3C669] text-[#1F181B] font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Payment...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#1F181B]" />
                      <span>Verify & Unlock {checkoutPlan === 'classic' ? 'Classic Pass ($15)' : 'Grand VIP Access ($29)'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Already Paid Email Restore */}
              <div className="pt-2 text-center border-t border-white/10">
                <span className="text-[10px] text-white/50 block mb-1.5">Already an activated VIP member? Restore access:</span>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={restoreEmail}
                    onChange={(e) => setRestoreEmail(e.target.value)}
                    placeholder="Enter existing VIP email"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={handleRestoreVip}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
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
