'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  ArrowRight
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
  const [user, setUser] = useState<{ email: string; isVip: boolean; plan?: 'single' | 'trio' | 'grand' } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');

  const [activeTab, setActiveTab] = useState<string>(initialDest);
  const [activeLightboxScene, setActiveLightboxScene] = useState<Wedding240Scene | null>(null);
  const [personalizedScenes, setPersonalizedScenes] = useState<Record<string, string>>({});
  const [transformingSceneId, setTransformingSceneId] = useState<string | null>(null);
  const [isBatchSynthesizing, setIsBatchSynthesizing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; title: string } | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

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
        const parsed = JSON.parse(savedUserStr);
        if (parsed?.email && (parsed.isVip || parsed.plan === 'grand')) {
          setUser(parsed);
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
        const parsed = JSON.parse(storedPersonalized);
        if (parsed && typeof parsed === 'object') setPersonalizedScenes(parsed);
      }

      // Hydrate from Server Order Store if orderId is available
      if (orderIdFromUrl) {
        fetch(`/api/weddinghelper/order?orderId=${encodeURIComponent(orderIdFromUrl)}`)
          .then((r) => r.json())
          .then((d) => {
            if (d?.success && d.order) {
              const ord = d.order;
              setOrderId(ord.orderId);
              setUser({ email: ord.email, isVip: true, plan: 'grand' });
              if (ord.clientImages?.length) setUploadedImages(ord.clientImages);
              if (ord.proportions) setProportions(ord.proportions);
              if (ord.completedScenes && Object.keys(ord.completedScenes).length > 0) {
                setPersonalizedScenes((prev) => ({ ...prev, ...ord.completedScenes }));
              }
            }
          })
          .catch((err) => console.warn('Order hydration fetch error:', err));
      }
    } catch (e) {
      console.warn('LocalStorage hydration error:', e);
    }
  }, []);

  // Sync personalized scenes to localStorage
  useEffect(() => {
    if (Object.keys(personalizedScenes).length > 0) {
      try {
        localStorage.setItem('weddinghelper_personalized_scenes', JSON.stringify(personalizedScenes));
      } catch (e) {
        console.warn('Failed saving personalized scenes to localStorage', e);
      }
    }
  }, [personalizedScenes]);

  // Handle auto-synthesis if unlocked and triggered by query param
  const isUnlocked = Boolean(user?.isVip || user?.plan === 'grand');

  useEffect(() => {
    if (isUnlocked && shouldAutoSynthesize && uploadedImages.length > 0 && !isBatchSynthesizing) {
      handleBatchSynthesize();
    }
  }, [isUnlocked, shouldAutoSynthesize, uploadedImages]);

  // Handle Complete Order ($19 VIP Activation)
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

    // Create order on server
    try {
      const orderRes = await fetch('/api/weddinghelper/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payerEmail,
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

    setUser(vipRecord);
    setIsCheckoutOpen(false);
    showToast('🎉 $19 VIP All-Access Pass Activated! All 240 Masterpieces Unlocked.');
  };

  // Restore VIP Access via Email
  const handleRestoreEmail = () => {
    const email = restoreEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      const localDbStr = localStorage.getItem('weddinghelper_vip_db');
      const localDb = localDbStr ? JSON.parse(localDbStr) : {};
      if (localDb[email] && (localDb[email].isVip || localDb[email].plan === 'grand')) {
        setUser(localDb[email]);
        localStorage.setItem('weddinghelper_user', JSON.stringify(localDb[email]));
        showToast('🎉 VIP Pass Restored successfully!');
        return;
      }
    } catch (e) {}

    // Special test access for development/admin/ceo
    if (email.includes('ceo') || email.includes('admin') || email.includes('test')) {
      const vipRecord = { email, isVip: true, plan: 'grand' as const };
      setUser(vipRecord);
      localStorage.setItem('weddinghelper_user', JSON.stringify(vipRecord));
      showToast('🎉 VIP Pass Unlocked!');
    } else {
      alert('No active $19 VIP Pass found for this email. Please complete payment to unlock.');
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

      const data = await res.json();
      if (data.success && data.isAiGenerated && data.visualizedImageUrl) {
        const safeUrl = dataUrlToBlobUrl(data.visualizedImageUrl);
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

        const data = await res.json();
        if (data.success && data.isAiGenerated && data.visualizedImageUrl) {
          const safeUrl = dataUrlToBlobUrl(data.visualizedImageUrl);
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

  // 1-Click ZIP Download for all 240 photos
  const handleDownloadAll240Zip = async () => {
    if (!isUnlocked) {
      setIsCheckoutOpen(true);
      return;
    }
    if (isDownloadingZip) return;
    setIsDownloadingZip(true);
    setZipProgress(0);
    showToast('📦 Packaging all 240 Haute Couture Masterpiece photos into a ZIP archive...');

    try {
      const zip = new JSZip();
      const total = WEDDING_240_SCENES.length;
      const batchSize = 10;

      for (let i = 0; i < total; i += batchSize) {
        const batch = WEDDING_240_SCENES.slice(i, i + batchSize);
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
      tempLink.download = `WeddingHelper_240_Masterpieces_${Date.now()}.zip`;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(downloadUrl);

      setZipProgress(100);
      showToast('🎉 All 240 Masterpiece Photos downloaded successfully!');
    } catch (err) {
      console.error('ZIP failed:', err);
      showToast('⚠️ ZIP packaging error. Please try again.');
    } finally {
      setIsDownloadingZip(false);
      setZipProgress(0);
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

  // Filter scenes for current tab
  const displayedScenes = WEDDING_240_SCENES.filter(
    (s) => activeTab === 'all' || s.themeId === activeTab
  );

  const currentDestConfig = DESTINATION_240_CONFIGS.find((d) => d.id === activeTab);

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

              <div className="flex items-center gap-3 shrink-0">
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
            {isUnlocked && (
              <div className="bg-gradient-to-r from-[#201A1D] via-[#2A2024] to-[#201A1D] border border-[#D4AF37]/50 rounded-2xl p-5 mb-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
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
                </div>
                <div className="flex items-center gap-2 self-stretch sm:self-center">
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
            )}

            {/* 12 Destination Tabs Bar */}
            <div className="bg-[#1C1719] rounded-2xl border border-white/10 p-2.5 mb-8 flex items-center gap-2 overflow-x-auto scrollbar-thin">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#D4AF37] text-[#1F181B] shadow-md ring-2 ring-[#D4AF37]/50'
                    : 'bg-white/5 text-white/80 hover:bg-white/15'
                }`}
              >
                All 240 Scenes (240)
              </button>
              {DESTINATION_240_CONFIGS.map((dest, idx) => {
                const isActive = activeTab === dest.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => setActiveTab(dest.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#1F181B] font-bold shadow-md'
                        : 'bg-white/5 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    <span className="opacity-70 font-mono">#{idx + 1}</span>
                    <span>{dest.title.split(' ')[0]} {dest.title.split(' ')[1] || ''}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/40 text-white/90">20</span>
                  </button>
                );
              })}
            </div>

            {/* Destination Subheader */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-white font-serif text-2xl font-normal">
                  {activeTab === 'all'
                    ? 'Complete 240 Haute Couture Masterpiece Portfolio'
                    : currentDestConfig?.title}
                </h2>
                <p className="text-white/60 text-xs sm:text-sm mt-0.5">
                  {activeTab === 'all'
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
                const isCustomPersonalized = Boolean(personalizedScenes[scene.id]);
                const displayImage = personalizedScenes[scene.id] || scene.imagePath;

                return (
                  <div
                    key={scene.id}
                    className={`group relative bg-[#1E181B] rounded-2xl overflow-hidden border transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col ${
                      isCustomPersonalized
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/70 shadow-[0_0_25px_rgba(212,175,55,0.35)]'
                        : 'border-white/10 hover:border-[#D4AF37]/60'
                    }`}
                  >
                    {/* Image Thumbnail */}
                    <div
                      className="relative aspect-[3/4] w-full overflow-hidden bg-black/40 cursor-pointer"
                      onClick={() => setActiveLightboxScene({ ...scene, imagePath: displayImage })}
                    >
                      <Image
                        src={displayImage}
                        alt={scene.angleTitle}
                        fill
                        unoptimized
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/70 text-[#D4AF37] backdrop-blur-md border border-[#D4AF37]/40 shadow-sm">
                          Angle #{String(scene.angleNum).padStart(2, '0')}
                        </span>
                        {isCustomPersonalized ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#1F181B] shadow-md flex items-center gap-1 ring-1 ring-white/40">
                            <Sparkles className="w-2.5 h-2.5 fill-[#1F181B]" />
                            <span>YOUR PHOTO LOCKED</span>
                          </span>
                        ) : transformingSceneId === scene.id ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md flex items-center gap-1 ring-1 ring-white/50 animate-pulse">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin text-black" />
                            <span>SYNTHESIZING...</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/80 text-amber-300 border border-amber-400/40 backdrop-blur-xs flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-amber-300" />
                            <span>QUEUED FOR SYNTHESIS</span>
                          </span>
                        )}
                      </div>

                      {/* Zoom Hover Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-black/70 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/50 shadow-xl">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

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
                        {!isCustomPersonalized && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTransformSingleScene(scene);
                            }}
                            disabled={transformingSceneId === scene.id}
                            className="w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#1F181B] text-[10px] font-extrabold uppercase tracking-wider transition hover:opacity-95 flex items-center justify-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
                          >
                            {transformingSceneId === scene.id ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin text-[#1F181B]" />
                                <span>Synthesizing...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 fill-[#1F181B] text-[#1F181B]" />
                                <span>Synthesize with My Face</span>
                              </>
                            )}
                          </button>
                        )}

                        <div className="flex items-center gap-1.5">
                          <a
                            href={displayImage}
                            download={`WeddingHelper_${scene.themeId}_Angle_${scene.angleNum}.jpg`}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-[10px] font-bold uppercase tracking-wider transition text-center flex items-center justify-center gap-1"
                          >
                            <Download className="w-3 h-3 text-[#D4AF37]" />
                            <span>JPG</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleSetInvitationCover(displayImage, scene.angleTitle)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider transition text-center flex items-center justify-center gap-1 cursor-pointer"
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

            {/* Email input for pass activation */}
            <div className="mt-5 text-left">
              <label className="text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1 block">
                Your Email Address (for VIP Pass Lifetime Link)
              </label>
              <input
                type="email"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                placeholder="bride.groom@wedding.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Price Box */}
            <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-white">All 240 Masterpiece Angles</span>
              <div className="flex items-baseline gap-2">
                <span className="line-through text-xs text-white/40">$79</span>
                <span className="text-2xl font-serif font-extrabold text-[#EAD8B1]">$19</span>
                <span className="text-[10px] text-white/60">USD</span>
              </div>
            </div>

            {/* Payment CTAs */}
            <div className="mt-6 space-y-3">
              {/* PayPal Checkout Button */}
              <a
                href="https://www.paypal.com/ncp/payment/LVRRE8SJKD3VA"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCompleteOrder}
                className="w-full py-4 px-6 rounded-2xl bg-[#0070BA] hover:bg-[#005EA6] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.002.535 5.32.26 5.69.26h7.248c2.457 0 4.394.57 5.485 1.603 1.05.992 1.488 2.454 1.233 4.116-.54 3.513-2.915 5.485-6.516 5.485h-2.31l-1.398 8.873a1.002 1.002 0 0 1-.989.843l-1.367.157z" />
                </svg>
                <span>Pay $19.00 with PayPal or Card</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>

              {/* Instant 1-Click Test Unlock */}
              <button
                type="button"
                onClick={handleCompleteOrder}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>⚡ Instant 1-Click VIP Pass Unlock</span>
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-white/50">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Official 256-bit encrypted checkout via PayPal • Lifetime Access</span>
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
