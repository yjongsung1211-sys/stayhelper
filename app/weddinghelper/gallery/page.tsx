'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  Download,
  Eye,
  Heart,
  RefreshCw,
  Clock,
  X,
  ArrowLeft,
  CheckCircle2,
  Gem,
  ExternalLink,
  ShieldCheck,
  Lock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  Mail
} from 'lucide-react';
import JSZip from 'jszip';

// ==========================================
// 240 HAUTE COUTURE MASTERPIECE SCENES MANIFEST
// 12 Destinations x 20 Ultra-HD Editorial Camera Angles
// ==========================================
interface Wedding240Scene {
  id: string;
  themeId: string;
  themeTitle: string;
  destination: string;
  venueName: string;
  angleNum: number;
  angleTitle: string;
  imagePath: string;
}

const DESTINATION_240_CONFIGS = [
  { id: 'theme_01_bali', title: 'Bali Rainforest Infinity Chapel', dest: 'Ubud, Bali, Indonesia', venue: 'The Edge Bali & Mandapa Ritz-Carlton' },
  { id: 'theme_02_amalfi', title: 'Amalfi Coast Cliffside Romance', dest: 'Positano & Ravello, Italy', venue: 'Villa Cimbrone & Belmond Caruso' },
  { id: 'theme_03_lake_como', title: 'Lake Como Historic Villa & Riva Boat', dest: 'Lake Como, Lombardy, Italy', venue: 'Villa del Balbianello & Grand Hotel Tremezzo' },
  { id: 'theme_04_paris', title: 'Paris Private Château & Tuileries Garden', dest: 'Chantilly & Paris, France', venue: 'Shangri-La Paris & Château de Chantilly' },
  { id: 'theme_05_nyc', title: 'Manhattan Skyline Glass Penthouse', dest: 'New York City, USA', venue: 'The Plaza Hotel & Rainbow Room' },
  { id: 'theme_06_hanok', title: 'Korean Royal Hanbok Heritage', dest: 'Seoul, South Korea', venue: 'The Shilla Seoul & Yeong Bin Gwan' },
  { id: 'theme_07_kyoto', title: 'Kyoto Zen Shrine & Pure Silk Shiromuku', dest: 'Kyoto, Japan', venue: 'Hoshinoya Kyoto & Kamigamo Shrine' },
  { id: 'theme_08_udaipur', title: 'Indian Royal Palace Extravaganza', dest: 'Udaipur, Rajasthan, India', venue: 'Taj Lake Palace & The Leela Palace' },
  { id: 'theme_09_santorini', title: 'Santorini Aegean White Caldera', dest: 'Santorini, Greece', venue: 'Canaves Oia Epitome & Grace Hotel' },
  { id: 'theme_10_cabo', title: 'Cabo Oceanfront Desert & Pacific Waves', dest: 'Cabo San Lucas, Mexico', venue: 'Las Ventanas al Paraíso & Waldorf Astoria' },
  { id: 'theme_11_liwa', title: 'Arabian Desert Mirage & Golden Dunes', dest: 'Abu Dhabi & Dubai, UAE', venue: 'Qasr Al Sarab Desert Resort' },
  { id: 'theme_12_swiss_alps', title: 'Swiss Alpine Glacier & Winter Chalet', dest: 'St. Moritz, Switzerland', venue: 'Badrutt’s Palace & The Chedi Andermatt' },
];

const ANGLE_20_TITLES = [
  'Ceremonial Altar Vows',
  'Cathedral Arch Golden Kiss',
  'Sunset Terrace Champagne Toast',
  'Panoramic Botanical Sanctuary',
  'Grand Aisle Processional',
  'Intimate Forehead Touch',
  'Couture Silk Train Cascade',
  'Twilight Candlelit Vow Exchange',
  'Architectural Glass Dome Vista',
  'Private Balcony Horizon',
  'Romantic Veil Wind Gust',
  'First Dance Under Chandelier',
  'Vintage Convertible Getaway',
  'Golden Hour Sunburst Embrace',
  'Secret Garden Rose Archway',
  'Black-Tie Formal Altar Portrait',
  'Whispering Promises Silhouette',
  'Cascading Water Wall Reflections',
  'Midnight Sparkler Send-Off',
  '8K Heritage Canvas Masterpiece'
];

const ATELIER_STAGES = [
  'Reading facial bone contours & eye alignment...',
  'Sculpting Cheongdam Haute Couture glass-skin...',
  'Rendering 4K Hasselblad Masterpiece Canvas...',
];

const WEDDING_240_SCENES: Wedding240Scene[] = DESTINATION_240_CONFIGS.flatMap((dest) => {
  return Array.from({ length: 20 }, (_, idx) => {
    const angleNum = idx + 1;
    const padNum = String(angleNum).padStart(2, '0');
    return {
      id: `${dest.id}_scene_${padNum}`,
      themeId: dest.id,
      themeTitle: dest.title,
      destination: dest.dest,
      venueName: dest.venue,
      angleNum,
      angleTitle: ANGLE_20_TITLES[idx] || `Angle #${padNum}`,
      imagePath: `/images/weddings_240/${dest.id}/scene_${padNum}.jpg`,
    };
  });
});

function dataUrlToBlobUrl(dataUrl: string): string {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    return URL.createObjectURL(blob);
  } catch (e) {
    return dataUrl;
  }
}

function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialDest = searchParams.get('dest') || 'theme_01_bali';
  const shouldAutoSynthesize = searchParams.get('autoSynthesize') === 'true';
  const orderIdFromUrl = searchParams.get('orderId');
  const [orderId, setOrderId] = useState<string | null>(orderIdFromUrl);

  // VIP Membership State (Default null = locked until paid)
  const [user, setUser] = useState<{ email: string; isVip: boolean; plan?: 'single' | 'classic' | 'grand'; selectedTheme?: string } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const [activeTab, setActiveTab] = useState<string>(initialDest);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [activeLightboxScene, setActiveLightboxScene] = useState<Wedding240Scene | null>(null);
  const [personalizedScenes, setPersonalizedScenes] = useState<Record<string, string>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [transformingSceneId, setTransformingSceneId] = useState<string | null>(null);
  const [isBatchSynthesizing, setIsBatchSynthesizing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; title: string } | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [atelierStepTicker, setAtelierStepTicker] = useState(0);

  // Proportions and uploaded photos from localStorage
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [proportions, setProportions] = useState({
    groomHeight: 181,
    groomWeight: 74,
    brideHeight: 167,
    brideWeight: 49,
  });

  const showToast = (msg: string, duration = 3500) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), duration);
  };

  // Hydrate user data from localStorage
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('weddinghelper_user');
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          if (parsed?.email) {
            fetch(`/api/weddinghelper/member?email=${encodeURIComponent(parsed.email)}`)
              .then((res) => res.json())
              .then((data) => {
                if (data?.isVip) {
                  const resolvedPlan = data.plan || parsed.plan || 'grand';
                  const resolvedTheme = data.selectedTheme || parsed.selectedTheme || 'theme_01_bali';
                  setUser({ email: parsed.email, isVip: true, plan: resolvedPlan, selectedTheme: resolvedTheme });
                  if (resolvedPlan === 'classic') {
                    setActiveTab(resolvedTheme);
                  }
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
          setUploadedImages(parsed);
        }
      }

      const storedProportions = localStorage.getItem('weddinghelper_proportions');
      if (storedProportions) {
        const parsed = JSON.parse(storedProportions);
        if (parsed.groomHeight) setProportions(parsed);
      }

      const storedPersonalized = localStorage.getItem('weddinghelper_personalized_scenes');
      if (storedPersonalized) {
        try {
          const parsed = JSON.parse(storedPersonalized);
          if (parsed && typeof parsed === 'object') {
            const cleaned: Record<string, string> = {};
            for (const [k, v] of Object.entries(parsed)) {
              if (typeof v === 'string' && !v.startsWith('blob:') && v.length > 20) {
                cleaned[k] = v;
              }
            }
            setPersonalizedScenes(cleaned);
          }
        } catch (e) {}
      }

      // Hydrate from Server Order Store if orderId is available
      if (orderIdFromUrl) {
        fetch(`/api/weddinghelper/order?orderId=${encodeURIComponent(orderIdFromUrl)}`)
          .then((r) => r.json())
          .then((d) => {
            if (d?.success && d.order) {
              const ord = d.order;
              setOrderId(ord.orderId);
              const resolvedPlan = ord.plan || 'grand';
              const resolvedTheme = ord.selectedTheme || 'theme_01_bali';
              setUser({ email: ord.email, isVip: true, plan: resolvedPlan, selectedTheme: resolvedTheme });
              if (resolvedPlan === 'classic') {
                setActiveTab(resolvedTheme);
              }
              if (ord.clientImages?.length) setUploadedImages(ord.clientImages);
              if (ord.proportions) setProportions(ord.proportions);
              if (ord.completedScenes && Object.keys(ord.completedScenes).length > 0) {
                const cleaned: Record<string, string> = {};
                for (const [k, v] of Object.entries(ord.completedScenes)) {
                  if (typeof v === 'string' && !v.startsWith('blob:') && v.length > 20) {
                    cleaned[k] = v;
                  }
                }
                setPersonalizedScenes((prev) => ({ ...prev, ...cleaned }));
              }
            }
          })
          .catch((err) => console.warn('Order hydration fetch error:', err));
      }
    } catch (e) {
      console.warn('LocalStorage hydration error:', e);
    }
  }, []);

  // Cycle atelier steps for dynamic waiting animation
  useEffect(() => {
    const timer = setInterval(() => {
      setAtelierStepTicker((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Live real-time polling for order updates (when orderId is active)
  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;
    const pollTimer = setInterval(async () => {
      try {
        const res = await fetch(`/api/weddinghelper/order?orderId=${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (isMounted && data?.success && data.order?.completedScenes) {
          const incoming = data.order.completedScenes;
          if (Object.keys(incoming).length > 0) {
            setPersonalizedScenes((prev) => {
              let updated = false;
              const next = { ...prev };
              for (const [k, v] of Object.entries(incoming)) {
                if (typeof v === 'string' && !v.startsWith('blob:') && next[k] !== v) {
                  next[k] = v;
                  updated = true;
                }
              }
              return updated ? next : prev;
            });
          }
        }
      } catch (e) {
        // silent polling failure catch
      }
    }, 4500);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
    };
  }, [orderId]);

  // Sync valid personalized scenes to localStorage (excluding temporary blob URLs)
  useEffect(() => {
    if (Object.keys(personalizedScenes).length > 0) {
      try {
        const toSave: Record<string, string> = {};
        for (const [k, v] of Object.entries(personalizedScenes)) {
          if (typeof v === 'string' && !v.startsWith('blob:') && v.length > 20) {
            toSave[k] = v;
          }
        }
        localStorage.setItem('weddinghelper_personalized_scenes', JSON.stringify(toSave));
      } catch (e) {
        console.warn('Failed saving personalized scenes to localStorage', e);
      }
    }
  }, [personalizedScenes]);

  const handleImageError = (sceneId: string) => {
    setFailedImages((prev) => ({ ...prev, [sceneId]: true }));
    setPersonalizedScenes((prev) => {
      const next = { ...prev };
      delete next[sceneId];
      return next;
    });
  };

  // Handle auto-synthesis if unlocked and triggered by query param
  const isUnlocked = Boolean(user?.isVip || user?.plan === 'grand');

  useEffect(() => {
    if (isUnlocked && shouldAutoSynthesize && uploadedImages.length > 0 && !isBatchSynthesizing) {
      handleBatchSynthesize();
    }
  }, [isUnlocked, shouldAutoSynthesize, uploadedImages]);

  // Handle VIP Activation with verified PayPal Email & Transaction ID
  const handleVerifyAndActivateVip = async () => {
    const email = (checkoutEmail || restoreEmail).trim().toLowerCase();
    const txId = transactionId.trim();

    if (!email || !email.includes('@')) {
      alert('Please enter your valid PayPal email address.');
      return;
    }
    if (!txId || txId.length < 5) {
      alert('Please enter your PayPal Transaction ID or receipt number.');
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
          plan: 'grand',
        }),
      });

      const data = await res.json();
      if (data?.success && data?.member?.isVip) {
        const vipRecord = {
          email,
          isVip: true,
          plan: 'grand' as const,
        };
        setUser(vipRecord);
        localStorage.setItem('weddinghelper_user', JSON.stringify(vipRecord));
        setIsCheckoutOpen(false);
        showToast('🎉 $19 VIP All-Access Pass Activated! All 240 Masterpieces Unlocked.');

        // Create order on server
        try {
          const orderRes = await fetch('/api/weddinghelper/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              plan: 'grand',
              selectedTheme: activeTab,
              proportions,
              clientImages: uploadedImages,
            }),
          });
          const orderData = await orderRes.json();
          if (orderData?.success && orderData.orderId) {
            setOrderId(orderData.orderId);
            window.history.replaceState(null, '', `?orderId=${orderData.orderId}&dest=${activeTab}`);
          }
        } catch (orderErr) {
          console.warn('Order create err on gallery:', orderErr);
        }
      } else {
        alert(`Verification failed: ${data?.error || 'Invalid payment credentials'}`);
      }
    } catch (e) {
      alert('Network error during payment verification.');
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // Restore VIP Access via Server Verified Email
  const handleRestoreEmail = async () => {
    const email = restoreEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
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
        alert('No active $19 VIP Pass found for this email. Please complete payment via PayPal to unlock.');
      }
    } catch (err) {
      alert('Verification error. Please check your internet connection.');
    }
  };

  // Transform a single scene
  const handleTransformSingleScene = async (scene: Wedding240Scene) => {
    if (!isUnlocked) {
      setIsCheckoutOpen(true);
      return;
    }
    if (transformingSceneId) return;
    const imagesToUse = uploadedImages.length > 0 ? uploadedImages : [];
    if (imagesToUse.length === 0) {
      showToast('⚠️ Please upload your couple photo in the Atelier Studio first.');
      return;
    }

    setTransformingSceneId(scene.id);
    showToast(`✨ Synthesizing "${scene.angleTitle}" with your authentic faces...`);

    try {
      const res = await fetch('/api/weddinghelper/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          images: imagesToUse,
          image: imagesToUse[0],
          targetSceneImage: scene.imagePath,
          themeId: scene.themeId,
          angleTitle: scene.angleTitle,
          groomHeight: proportions.groomHeight,
          groomWeight: proportions.groomWeight,
          brideHeight: proportions.brideHeight,
          brideWeight: proportions.brideWeight,
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
      if (data.success && data.isAiGenerated && data.visualizedImageUrl) {
        const safeUrl = data.visualizedImageUrl;
        setFailedImages((prev) => {
          const next = { ...prev };
          delete next[scene.id];
          return next;
        });
        setPersonalizedScenes((prev) => ({
          ...prev,
          [scene.id]: safeUrl,
        }));
        showToast(`🎉 "${scene.angleTitle}" successfully synthesized with your authentic faces!`);
      } else {
        showToast(`⚠️ Gemini AI rate-limited for this angle. Tap to retry in a moment.`);
      }
    } catch (e) {
      console.warn('Angle transform error:', e);
      showToast('⚠️ Network timeout. Please retry in a moment.');
    } finally {
      setTransformingSceneId(null);
    }
  };

  // Batch synthesize scenes of the currently active destination
  const handleBatchSynthesize = async () => {
    if (!isUnlocked) {
      setIsCheckoutOpen(true);
      return;
    }
    if (isBatchSynthesizing) {
      setIsBatchSynthesizing(false);
      setBatchProgress(null);
      showToast('🛑 Batch synthesis paused.');
      return;
    }

    const imagesToUse = uploadedImages.length > 0 ? uploadedImages : [];
    if (imagesToUse.length === 0) {
      showToast('⚠️ Please upload your couple photo in the Atelier Studio first.');
      return;
    }

    const targetScenes = WEDDING_240_SCENES.filter(
      (s) => activeTab === 'all' || s.themeId === activeTab
    );
    if (targetScenes.length === 0) return;

    setIsBatchSynthesizing(true);
    showToast(`✨ Synthesizing ${targetScenes.length} scenes in this destination with your authentic faces...`);

    for (let i = 0; i < targetScenes.length; i++) {
      const scene = targetScenes[i];
      setBatchProgress({
        current: i + 1,
        total: targetScenes.length,
        title: scene.angleTitle,
      });

      // 2.5s safe cooldown to respect Gemini Free Tier rate-limit
      if (i > 0) {
        await new Promise((r) => setTimeout(r, 2500));
      }

      try {
        const res = await fetch('/api/weddinghelper/visualize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email,
            images: imagesToUse,
            image: imagesToUse[0],
            targetSceneImage: scene.imagePath,
            themeId: scene.themeId,
            angleTitle: scene.angleTitle,
            groomHeight: proportions.groomHeight,
            groomWeight: proportions.groomWeight,
            brideHeight: proportions.brideHeight,
            brideWeight: proportions.brideWeight,
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
        if (data.success && data.isAiGenerated && data.visualizedImageUrl) {
          const safeUrl = data.visualizedImageUrl;
          setFailedImages((prev) => {
            const next = { ...prev };
            delete next[scene.id];
            return next;
          });
          setPersonalizedScenes((prev) => ({
            ...prev,
            [scene.id]: safeUrl,
          }));

          // Async sync to server order store
          if (orderId) {
            fetch('/api/weddinghelper/order/process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                sceneId: scene.id,
                sceneImageUrl: data.visualizedImageUrl,
                isFinished: i === targetScenes.length - 1,
              }),
            }).catch((err) => console.warn('Order sync error:', err));
          }
        }
      } catch (err) {
        console.warn(`Failed batch scene ${scene.id}:`, err);
      }
    }

    setIsBatchSynthesizing(false);
    setBatchProgress(null);
    showToast(`🎉 All ${targetScenes.length} scenes synthesized with your authentic faces!`, 6000);
  };

  // 1-Click ZIP Download (Strictly respects Classic 20 scenes vs Grand 240 scenes)
  const handleDownloadAll240Zip = async () => {
    if (!isUnlocked) {
      setIsCheckoutOpen(true);
      return;
    }
    if (isDownloadingZip) return;
    setIsDownloadingZip(true);
    setZipProgress(0);

    const scenesToPack = displayedScenes;
    const total = scenesToPack.length;
    const isClassic = isClassicPlan || total <= 20;
    const zipTitle = isClassic ? `your 20 ${currentDestConfig?.title || 'destination'}` : 'all 240 Haute Couture Masterpiece';
    showToast(`📦 Packaging ${zipTitle} photos into a 4K ZIP archive...`);

    try {
      const zip = new JSZip();
      const batchSize = 10;

      for (let i = 0; i < total; i += batchSize) {
        const batch = scenesToPack.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (scene) => {
            const destFolder = zip.folder(scene.themeTitle.replace(/[/\\?%*:|"<>]/g, '_')) || zip;
            const photoUrl = personalizedScenes[scene.id] || scene.imagePath;

            try {
              const res = await fetch(photoUrl);
              if (res.ok) {
                const blob = await res.blob();
                const padNum = String(scene.angleNum).padStart(2, '0');
                const cleanAngle = scene.angleTitle.replace(/[/\\?%*:|"<>]/g, '_');
                destFolder.file(`Angle_${padNum}_${cleanAngle}.jpg`, blob);
              }
            } catch (err) {
              console.warn(`ZIP skip ${scene.id}:`, err);
            }
          })
        );
        const currentProgress = Math.min(Math.round(((i + batch.length) / total) * 90), 90);
        setZipProgress(currentProgress);
      }

      setZipProgress(95);
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const downloadUrl = URL.createObjectURL(zipBlob);
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      const downloadFilename = isClassic
        ? `WeddingHelper_${allowedTheme}_20_Photos_${Date.now()}.zip`
        : `WeddingHelper_240_Masterpieces_${Date.now()}.zip`;
      tempLink.download = downloadFilename;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(downloadUrl);

      setZipProgress(100);
      showToast(`🎉 ${total} Masterpiece Photos downloaded successfully!`);
    } catch (err) {
      console.error('ZIP failed:', err);
      showToast('⚠️ ZIP packaging error. Please try again.');
    } finally {
      setIsDownloadingZip(false);
      setZipProgress(0);
    }
  };

  // Send photos via email (Strictly respects Classic 20 scenes vs Grand 240 scenes)
  const handleSendAllToEmail = async () => {
    let targetEmail = user?.email;
    const isClassic = isClassicPlan;
    const countLabel = isClassic ? '선택하신 20장' : '240장 풀';

    if (!targetEmail) {
      targetEmail = window.prompt(`${countLabel} 화보를 수신할 이메일 주소를 입력해 주세요:`) || '';
    }
    if (!targetEmail || !targetEmail.includes('@')) {
      showToast('⚠️ 올바른 이메일 주소를 입력해 주세요.');
      return;
    }

    setIsSendingEmail(true);
    showToast(`✉️ ${countLabel} 화보 앨범을 ${targetEmail}로 발송 중입니다...`);
    try {
      const res = await fetch('/api/weddinghelper/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail.trim().toLowerCase(),
          plan: isClassic ? 'classic' : 'grand',
          selectedTheme: isClassic ? allowedTheme : 'all_12_themes',
          proportions,
          sendCompletionEmail: true,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast(`🎉 ${countLabel} 화보 앨범 및 4K 다운로드 링크가 ${targetEmail}로 발송되었습니다!`, 6000);
      } else {
        showToast('⚠️ 이메일 발송 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (e) {
      showToast('⚠️ 네트워크 연결을 확인해 주세요.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Set photo as invitation cover and redirect
  const handleSetInvitationCover = (photoUrl: string, title: string) => {
    try {
      const invDataStr = localStorage.getItem('weddinghelper_invitation_data');
      const invData = invDataStr ? JSON.parse(invDataStr) : {};
      invData.coverPhoto = photoUrl;
      localStorage.setItem('weddinghelper_invitation_data', JSON.stringify(invData));
      showToast(`💌 Set "${title}" as your Digital Invitation Cover! Redirecting...`);
      setTimeout(() => {
        router.push('/invite');
      }, 1200);
    } catch (e) {
      router.push('/invite');
    }
  };

  // Strict Scope Isolation for Classic Pass (Single theme only)
  const isClassicPlan = user?.plan === 'classic';
  const allowedTheme = user?.selectedTheme || 'theme_01_bali';
  const effectiveTab = isClassicPlan ? allowedTheme : activeTab;

  // Filter scenes for current tab (Classic plan is strictly isolated to its single selected theme)
  const displayedScenes = WEDDING_240_SCENES.filter(
    (s) => (effectiveTab === 'all' && !isClassicPlan) || s.themeId === effectiveTab
  );

  const currentDestConfig = DESTINATION_240_CONFIGS.find((d) => d.id === effectiveTab);

  return (
    <div className="min-h-screen bg-[#120E10] text-white font-sans selection:bg-[#C5A059]/30 relative overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#1C1719] border border-[#C5A059] text-[#EAD8B1] text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Luxury Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#161214]/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/weddinghelper"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#EAD8B1] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Atelier Studio</span>
              <span className="sm:hidden">Studio</span>
            </Link>

            <div className="border-l border-white/10 pl-4 sm:pl-6">
              <span className="text-base sm:text-lg font-serif tracking-[0.2em] text-white font-normal block leading-none">
                WEDDING<span className="text-[#C5A059] font-medium">HELPER</span>
              </span>
              <span className="text-[9px] tracking-[0.3em] text-white/50 uppercase block mt-1 font-medium">
                The 240 Masterpiece Gallery
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#EAD8B1] text-xs font-bold uppercase tracking-wider">
                <Gem className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="hidden sm:inline">VIP All-Access Active</span>
                <span className="sm:hidden">VIP</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#1F181B] font-extrabold text-xs uppercase tracking-wider hover:opacity-95 shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Gem className="w-3.5 h-3.5" />
                <span>Unlock Pass · $19</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadAll240Zip}
              disabled={isDownloadingZip}
              className="px-4 sm:px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDownloadingZip ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                  <span>ZIP ({zipProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#C5A059]" />
                  <span className="hidden sm:inline">Download All 240 (ZIP)</span>
                  <span className="sm:hidden">ZIP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Gallery Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* If NOT Unlocked: Show Luxury Aman/Hermes VIP Gated Paywall */}
        {!isUnlocked ? (
          <div className="relative min-h-[75vh] flex items-center justify-center p-4">
            {/* Background Curated Blurred Showcase */}
            <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-25 blur-md pointer-events-none overflow-hidden">
              {DESTINATION_240_CONFIGS.slice(0, 8).map((dest) => (
                <div key={dest.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src={`/images/weddings_240/${dest.id}/scene_01.jpg`}
                    alt={dest.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Paywall Card */}
            <div className="relative max-w-xl w-full bg-[#181315]/95 border-2 border-[#C5A059] rounded-[36px] p-8 sm:p-12 shadow-[0_20px_60px_rgba(197,160,89,0.25)] text-center z-20 backdrop-blur-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B85E55] flex items-center justify-center mx-auto shadow-lg mb-4 text-white">
                <Lock className="w-8 h-8 text-[#FAF3EF]" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-xs font-bold uppercase tracking-widest text-[#EAD8B1] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>VIP MEMBERSHIP REQUIRED</span>
              </span>

              <h1 className="text-3xl sm:text-4xl font-serif text-white font-light mt-1">
                Unlock All 240 Masterpieces
              </h1>

              <p className="text-xs sm:text-sm text-white/70 mt-3 leading-relaxed max-w-md mx-auto">
                This high-resolution portfolio is exclusively available to couples with an active VIP Pass. Unlock all 20 Ultra-HD camera angles across 12 global destinations, bespoke facial synthesis, 8K canvas print downloads, and complete Digital Invitation Studio.
              </p>

              {/* Price Banner */}
              <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs text-white/50 uppercase tracking-wider block">The Grand 12 VIP Pass</span>
                  <span className="text-sm font-bold text-white">Lifetime Couple Access</span>
                </div>
                <div className="text-right">
                  <span className="line-through text-xs text-white/40 font-mono mr-2">$79</span>
                  <span className="text-3xl font-serif font-extrabold text-[#EAD8B1]">$19</span>
                  <span className="text-[10px] text-white/60 block">USD / Single Pay</span>
                </div>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 text-left text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>240 Masterpiece Portraits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>All 12 Iconic Destinations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>8K Canvas Print-Ready JPGs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>1-Click 240-Photo ZIP Download</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-[#1F181B] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition active:scale-[0.99] cursor-pointer hover:opacity-95"
                >
                  <Sparkles className="w-5 h-5 text-[#1F181B]" />
                  <span>PAY $19 & UNLOCK 240 MASTERPIECES</span>
                  <ArrowRight className="w-4 h-4 text-[#1F181B]" />
                </button>

                {/* Email Restore Form */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="email"
                    value={restoreEmail}
                    onChange={(e) => setRestoreEmail(e.target.value)}
                    placeholder="Already paid? Enter your email"
                    className="flex-1 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={handleRestoreEmail}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer whitespace-nowrap"
                  >
                    Restore Pass
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-white/40">
                <span>🔒 256-Bit SSL Encrypted</span>
                <span>•</span>
                <span>PayPal / Visa / Mastercard</span>
                <span>•</span>
                <span>Instant Digital Access</span>
              </div>
            </div>
          </div>
        ) : (
          /* Full Unlocked 240 Masterpiece Gallery */
          <>
            {/* Title Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#EAD8B1] text-xs font-bold uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>240 HAUTE COUTURE MASTERPIECE COLLECTION</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-wide">
                  240 Editorial Camera Angles Across 12 Destinations
                </h1>
                <p className="text-white/60 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
                  Explore all 20 cinematic angles for each destination world. Select any scene to synthesize with your authentic faces, download 4K prints, or set directly as your Digital Invitation Cover.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleSendAllToEmail}
                  disabled={isSendingEmail}
                  className="px-5 py-3 rounded-full font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg bg-white/10 hover:bg-white/20 border border-[#D4AF37]/50 text-[#EAD8B1] cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isSendingEmail ? 'Sending...' : 'Email All 240 Photos'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBatchSynthesize}
                  disabled={isBatchSynthesizing}
                  className={`px-5 py-3 rounded-full font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg cursor-pointer ${
                    isBatchSynthesizing
                      ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                      : 'bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-[#1F181B] hover:opacity-95'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isBatchSynthesizing
                      ? `Pause Batch (${batchProgress?.current}/${batchProgress?.total})`
                      : `✨ Synthesize All ${displayedScenes.length} Scenes`}
                  </span>
                </button>
              </div>
            </div>

            {/* VIP Atelier Production & Safe Tab Closure Reassurance Banner */}
            {isUnlocked && (() => {
              const totalReady = Object.keys(personalizedScenes).filter((id) => !failedImages[id]).length;
              const pct = Math.max(5, Math.min(100, Math.round((totalReady / 240) * 100)));
              return (
                <div className="bg-gradient-to-r from-[#201A1D] via-[#2A2024] to-[#201A1D] border border-[#D4AF37]/50 rounded-2xl p-5 mb-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#D4AF37]">
                      <Sparkles className="w-3.5 h-3.5 fill-[#D4AF37]" />
                      <span>High-Speed Atelier Production Active • Order #{orderId ? orderId.replace('WH_', '') : 'VIP-GRAND'}</span>
                    </div>
                    <h3 className="text-white font-serif text-base sm:text-lg font-bold mt-1">
                      Your First Masterpieces Are Unlocked Below
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm mt-1 leading-relaxed">
                      All 240 bespoke editorial angles across 12 destinations are currently hand-crafting in the background. 
                      <strong className="text-amber-200 ml-1">You can safely close this browser window anytime.</strong> 
                      Your complete 4K gallery link and ZIP download are permanently saved and will be delivered to <span className="text-[#D4AF37] font-mono">{user?.email || 'your email'}</span>.
                    </p>

                    {/* Live Atelier Progress Bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-black/40 border border-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F3C669] to-[#D4AF37] transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#D4AF37] font-bold shrink-0">
                        {totalReady} / 240 Scenes Ready ({pct}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={handleSendAllToEmail}
                      disabled={isSendingEmail}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#D4AF37]/50 text-[#EAD8B1] font-extrabold text-xs uppercase tracking-wider transition shadow-md whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{isSendingEmail ? 'Sending...' : 'Email All 240 Photos ✉️'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/weddinghelper/gallery${orderId ? `?orderId=${orderId}` : ''}` : '';
                        navigator.clipboard.writeText(shareUrl);
                        showToast('📋 Private Gallery Link copied to clipboard!');
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#D4AF37] text-[#1F181B] font-extrabold text-xs uppercase tracking-wider hover:bg-[#F3C669] transition shadow-md whitespace-nowrap cursor-pointer"
                    >
                      Copy Gallery Link 🔗
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 12 Destination Tabs Bar with Left/Right Navigation */}
            <div className="relative mb-8 group/tabs">
              {/* Left Arrow Button */}
              <button
                type="button"
                aria-label="Scroll tabs left"
                onClick={() => {
                  if (tabsScrollRef.current) {
                    tabsScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
                  }
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#1F181B]/95 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1F181B] transition shadow-xl flex items-center justify-center cursor-pointer backdrop-blur-md"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                aria-label="Scroll tabs right"
                onClick={() => {
                  if (tabsScrollRef.current) {
                    tabsScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#1F181B]/95 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1F181B] transition shadow-xl flex items-center justify-center cursor-pointer backdrop-blur-md"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Scrollable Tabs Container */}
              <div
                ref={tabsScrollRef}
                className="bg-[#1C1719] rounded-2xl border border-white/10 p-2.5 px-12 flex items-center gap-2 overflow-x-auto scroll-smooth select-none cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                onWheel={(e) => {
                  if (e.deltaY !== 0 && tabsScrollRef.current) {
                    tabsScrollRef.current.scrollLeft += e.deltaY;
                  }
                }}
              >
                {/* All 240 Scenes Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (isClassicPlan) {
                      showToast('🔒 Classic Pass includes 20 photos for your chosen destination. Upgrade to Grand VIP ($29) for all 12 destinations!');
                      setIsUpgradeModalOpen(true);
                      return;
                    }
                    setActiveTab('all');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    effectiveTab === 'all' && !isClassicPlan
                      ? 'bg-[#D4AF37] text-[#1F181B] shadow-md ring-2 ring-[#D4AF37]/50'
                      : isClassicPlan
                      ? 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
                      : 'bg-white/5 text-white/80 hover:bg-white/15'
                  }`}
                >
                  {isClassicPlan && <span className="text-[11px]">🔒</span>}
                  <span>All 240 Scenes (240)</span>
                  {isClassicPlan && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold">VIP ONLY</span>}
                </button>

                {/* Individual Destination Tabs */}
                {DESTINATION_240_CONFIGS.map((dest, idx) => {
                  const isDestinationLocked = isClassicPlan && dest.id !== allowedTheme;
                  const isActive = effectiveTab === dest.id;

                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => {
                        if (isDestinationLocked) {
                          showToast(`🔒 ${dest.title} is locked. Upgrade to Grand VIP ($29) to unlock all 12 destinations!`);
                          setIsUpgradeModalOpen(true);
                          return;
                        }
                        setActiveTab(dest.id);
                      }}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider whitespace-nowrap transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#D4AF37] text-[#1F181B] font-bold shadow-md'
                          : isDestinationLocked
                          ? 'bg-white/5 text-white/35 hover:bg-white/10 cursor-not-allowed'
                          : 'bg-white/5 text-white/70 hover:bg-white/15'
                      }`}
                    >
                      <span className="opacity-70 font-mono">
                        {isDestinationLocked ? '🔒' : `#${idx + 1}`}
                      </span>
                      <span>{dest.title.split(' ')[0]} {dest.title.split(' ')[1] || ''}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/40 text-white/90">20</span>
                      {isActive && isClassicPlan && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/60 text-[#D4AF37] font-bold">YOUR PASS</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Destination Subheader */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-white font-serif text-2xl font-normal">
                  {effectiveTab === 'all' && !isClassicPlan
                    ? 'Complete 240 Haute Couture Masterpiece Portfolio'
                    : isClassicPlan
                    ? `${currentDestConfig?.title} (Classic Pass • 20 Photos)`
                    : currentDestConfig?.title}
                </h2>
                <p className="text-white/60 text-xs sm:text-sm mt-0.5">
                  {effectiveTab === 'all' && !isClassicPlan
                    ? 'Showing all 240 ultra-high definition editorial angles across 12 destinations'
                    : `${currentDestConfig?.venue} · ${currentDestConfig?.dest}`}
                </p>
              </div>

              <div className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
                {displayedScenes.length} Masterpiece Scenes
              </div>
            </div>

            {/* Batch Synthesis Progress Bar */}
            {isBatchSynthesizing && batchProgress && (
              <div className="mb-8 p-4 rounded-2xl bg-[#1E1719] border border-[#D4AF37] shadow-xl">
                <div className="flex items-center justify-between text-xs text-white mb-2">
                  <span className="font-bold text-[#D4AF37] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-[#D4AF37]" />
                    Synthesizing Scene {batchProgress.current} of {batchProgress.total}: &quot;{batchProgress.title}&quot;
                  </span>
                  <span className="font-mono text-[#D4AF37]">
                    {Math.round((batchProgress.current / batchProgress.total) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all duration-300"
                    style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* 20-Scene Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
              {displayedScenes.map((scene) => {
                const isCustomPersonalized = Boolean(personalizedScenes[scene.id]) && !failedImages[scene.id];
                const isActivelySynthesizing = transformingSceneId === scene.id || (isBatchSynthesizing && batchProgress?.title === scene.angleTitle);
                const isBatchQueued = isBatchSynthesizing && !isCustomPersonalized && !isActivelySynthesizing;
                const displayImage = isCustomPersonalized ? personalizedScenes[scene.id] : scene.imagePath;

                return (
                  <div
                    key={scene.id}
                    className={`group relative bg-[#1A1417] rounded-2xl overflow-hidden border transition-all duration-500 shadow-lg flex flex-col ${
                      isCustomPersonalized
                        ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/70 shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                        : isActivelySynthesizing
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.35)]'
                        : 'border-white/10 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {/* Image Thumbnail Container */}
                    {isActivelySynthesizing ? (
                      /* Haute Couture Atelier Live Synthesis View */
                      <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-[#181316] via-[#22181C] to-[#181316] flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                        {/* Ambient radial gold glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2)_0%,transparent_70%)] animate-pulse pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-20">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/80 text-[#D4AF37] backdrop-blur-md border border-[#D4AF37]/40 shadow-sm">
                            Angle #{String(scene.angleNum).padStart(2, '0')}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-[#1F181B] shadow-md flex items-center gap-1 ring-1 ring-white/50 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 fill-[#1F181B]" />
                            <span>CRAFTING 4K MASTERPIECE</span>
                          </span>
                        </div>

                        {/* Center Animated Atelier Ring */}
                        <div className="relative w-14 h-14 rounded-full border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.35)] mb-3 z-10">
                          <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
                          <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />
                        </div>

                        {/* Live Step Text */}
                        <span className="text-[11px] font-serif font-bold text-[#FAF3EF] tracking-wide z-10 block">
                          {scene.angleTitle}
                        </span>
                        <span className="text-[9px] text-[#D4AF37] font-mono tracking-wider mt-1.5 z-10 px-2.5 py-0.5 rounded-full bg-black/60 border border-[#D4AF37]/30 backdrop-blur-xs transition-all duration-300">
                          {ATELIER_STAGES[atelierStepTicker]}
                        </span>

                        {/* Mini gold shimmer bar */}
                        <div className="w-28 h-1 bg-white/10 rounded-full mt-3 overflow-hidden z-10">
                          <div className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F3C669] to-[#D4AF37] animate-pulse" style={{ width: '85%' }} />
                        </div>
                      </div>
                    ) : (
                      /* Standard / Personalized Image View */
                      <div
                        className="relative aspect-[3/4] w-full overflow-hidden bg-black/40 cursor-pointer"
                        onClick={() => setActiveLightboxScene({ ...scene, imagePath: displayImage })}
                      >
                        <Image
                          src={displayImage}
                          alt=""
                          aria-label={scene.angleTitle}
                          fill
                          unoptimized
                          loading="lazy"
                          onError={() => handleImageError(scene.id)}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

                        {/* If Batch Queued: Luxury Frosted Veil Overlay */}
                        {isBatchQueued && (
                          <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center z-10 pointer-events-none">
                            <div className="px-3 py-1.5 rounded-full bg-black/80 border border-[#D4AF37]/40 text-[#EAD8B1] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                              <Clock className="w-3 h-3 text-[#D4AF37]" />
                              <span>Queued for Synthesis</span>
                            </div>
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-20 pointer-events-none">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/75 text-[#D4AF37] backdrop-blur-md border border-[#D4AF37]/40 shadow-sm">
                            Angle #{String(scene.angleNum).padStart(2, '0')}
                          </span>
                          {isCustomPersonalized ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#1F181B] shadow-md flex items-center gap-1 ring-1 ring-white/40">
                              <Sparkles className="w-2.5 h-2.5 fill-[#1F181B]" />
                              <span>YOUR PHOTO LOCKED</span>
                            </span>
                          ) : isBatchQueued ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/80 text-amber-300 border border-amber-400/40 backdrop-blur-xs flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-amber-300" />
                              <span>ATELIER QUEUE</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-wider bg-black/60 text-white/70 border border-white/20 backdrop-blur-xs">
                              Haute Couture Angle
                            </span>
                          )}
                        </div>

                        {/* Zoom Hover Icon */}
                        {!isBatchQueued && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="w-10 h-10 rounded-full bg-black/70 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/50 shadow-xl">
                              <Eye className="w-5 h-5" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="p-3 bg-[#1A1517] border-t border-white/5 flex flex-col justify-between flex-1">
                      <div>
                        <p className="text-white font-medium text-xs truncate" title={scene.angleTitle}>
                          {scene.angleTitle}
                        </p>
                        <p className="text-white/50 text-[10px] truncate mt-0.5">
                          {scene.themeTitle.split(' ')[0]} · {scene.destination.split(',')[0]}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 mt-2.5 pt-2 border-t border-white/5">
                        {isActivelySynthesizing ? (
                          <div className="w-full py-1.5 px-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 animate-pulse">
                            <RefreshCw className="w-3 h-3 animate-spin text-[#D4AF37]" />
                            <span>Synthesizing Face...</span>
                          </div>
                        ) : isBatchQueued ? (
                          <div className="w-full py-1.5 px-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed">
                            <Clock className="w-3 h-3 text-white/40" />
                            <span>Waiting in Atelier Queue</span>
                          </div>
                        ) : !isCustomPersonalized ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTransformSingleScene(scene);
                            }}
                            disabled={transformingSceneId === scene.id}
                            className="w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#1F181B] text-[10px] font-extrabold uppercase tracking-wider transition hover:opacity-95 flex items-center justify-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3 h-3 fill-[#1F181B] text-[#1F181B]" />
                            <span>Synthesize with My Face</span>
                          </button>
                        ) : null}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          <a
                            href={displayImage}
                            download={`WeddingHelper_${scene.themeId}_Angle_${scene.angleNum}.jpg`}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition text-center flex items-center justify-center gap-1 ${
                              isActivelySynthesizing || isBatchQueued
                                ? 'bg-white/5 text-white/30 cursor-not-allowed pointer-events-none'
                                : isCustomPersonalized
                                ? 'bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                                : 'bg-white/10 hover:bg-white/20 text-white/90'
                            }`}
                          >
                            <Download className="w-3 h-3 text-[#D4AF37]" />
                            <span>JPG</span>
                          </a>

                          <button
                            type="button"
                            disabled={isActivelySynthesizing || isBatchQueued}
                            onClick={() => handleSetInvitationCover(displayImage, scene.angleTitle)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition text-center flex items-center justify-center gap-1 ${
                              isActivelySynthesizing || isBatchQueued
                                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                : 'bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] cursor-pointer'
                            }`}
                            title="Set as Invitation Cover"
                          >
                            <Heart className="w-3 h-3 fill-[#D4AF37]" />
                            <span>Invite</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Lightbox Zoom Modal */}
      {activeLightboxScene && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setActiveLightboxScene(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/20 z-20 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full h-[85vh] flex flex-col items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={activeLightboxScene.imagePath}
                alt={activeLightboxScene.angleTitle}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full px-4 text-white">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  Angle #{String(activeLightboxScene.angleNum).padStart(2, '0')} · {activeLightboxScene.themeTitle}
                </span>
                <h3 className="text-lg font-serif">{activeLightboxScene.angleTitle}</h3>
                <p className="text-xs text-white/60">
                  {activeLightboxScene.venueName} · {activeLightboxScene.destination}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={activeLightboxScene.imagePath}
                  download={`WeddingHelper_${activeLightboxScene.themeId}_Angle_${activeLightboxScene.angleNum}.jpg`}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 border border-white/20"
                >
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>Download JPG</span>
                </a>
                <button
                  type="button"
                  onClick={() =>
                    handleSetInvitationCover(activeLightboxScene.imagePath, activeLightboxScene.angleTitle)
                  }
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B85E55] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Set as Invitation Cover</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* $19 VIP All-Access Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-[#181315] border-2 border-[#C5A059] rounded-[36px] p-6 sm:p-10 shadow-2xl font-sans text-center">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-xs font-bold uppercase tracking-widest text-[#EAD8B1] mb-3">
              <Gem className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>THE GRAND 12 VIP ALL-ACCESS PASS</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif text-white font-light">
              Unlock 240 Masterpiece Gallery
            </h3>
            <p className="text-xs text-white/60 mt-1.5">
              One-time payment • Lifetime access to all 12 destinations & Digital Invitation Studio
            </p>

            {/* Step 1: PayPal Checkout */}
            <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C5A059] text-[#1F181B] font-black text-xs flex items-center justify-center">1</span>
                <span className="text-xs font-bold text-white tracking-wide uppercase">Official PayPal Payment</span>
              </div>
              <p className="text-[11px] text-white/60">
                Complete your $19 payment via PayPal or Credit/Debit Card in the secure window.
              </p>
              <a
                href="https://www.paypal.com/ncp/payment/LVRRE8SJKD3VA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay $19.00 with PayPal or Card</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            {/* Step 2: Activate VIP with Payer Email & Transaction ID */}
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C5A059] text-[#1F181B] font-black text-xs flex items-center justify-center">2</span>
                <span className="text-xs font-bold text-white tracking-wide uppercase">Activate VIP Pass</span>
              </div>
              <p className="text-[11px] text-white/60">
                Enter your PayPal payer email & transaction ID to unlock all 240 high-fashion destination transformations:
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-hidden focus:border-[#C5A059]"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>
              <button
                type="button"
                disabled={isVerifyingPayment}
                onClick={handleVerifyAndActivateVip}
                className="w-full py-3 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#1F181B] font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifyingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Payment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#1F181B]" />
                    <span>Verify & Unlock 240 Scenes ($19)</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <span className="text-[10px] text-white/50 block mb-1">Already an activated VIP member?</span>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={restoreEmail}
                  onChange={(e) => setRestoreEmail(e.target.value)}
                  placeholder="Enter existing VIP email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-hidden focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={handleRestoreEmail}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
                >
                  Restore
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-white/50">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Official 256-bit encrypted checkout via PayPal • Lifetime Access</span>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade to Grand VIP Modal for Classic Pass holders */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-[#181315] border-2 border-[#D4AF37] rounded-[36px] p-6 sm:p-8 shadow-2xl font-sans text-center">
            <button
              onClick={() => setIsUpgradeModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
              <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>GRAND VIP UPGRADE ($29)</span>
            </span>

            <h3 className="text-2xl font-serif text-white font-light mt-1">
              Unlock All 12 Destinations (240 Photos)
            </h3>
            <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
              Your Classic Pass includes 20 photos for your selected location. Upgrade to Grand VIP to access all 12 global luxury destinations, complete 240-scene album, and 1-Click 4K ZIP download.
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left">
              <p className="text-xs text-white/70 leading-relaxed">
                • <strong className="text-[#D4AF37]">240 Haute Couture Masterpieces</strong>: Bali, Amalfi, Lake Como, Paris, NYC, Hanok, Kyoto, Udaipur, Santorini, Cabo, Liwa, Swiss Alps.<br />
                • <strong className="text-[#D4AF37]">Full 4K ZIP Packaging</strong>: Instant download & complete email delivery.<br />
                • <strong className="text-[#D4AF37]">Lifetime Digital Invitation Studio</strong>: Unlimited luxury cover selections.
              </p>
              <a
                href="https://www.paypal.com/ncp/payment/LVRRE8SJKD3VA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#F3C669] text-[#1F181B] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#1F181B]" />
                <span>Upgrade to Grand VIP ($29) via PayPal</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#120E10] text-white flex items-center justify-center">Loading 240 Masterpiece Gallery...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
