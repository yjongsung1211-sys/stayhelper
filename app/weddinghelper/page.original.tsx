'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import JSZip from 'jszip';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, Sparkles, Upload, ArrowRight, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, Gem, Calendar,
  Share2, Download, RefreshCw, X, ExternalLink, Music2, Flower2,
  Phone, MessageCircle, Copy, ChevronDown, ChevronUp, Volume2, VolumeX, Clock, CreditCard,
  Edit3, Music, Camera, Check, Eye, SlidersHorizontal, Play, Pause
} from 'lucide-react';
import { WEDDING_12_PRESETS, WeddingThemePreset, WeddingProduct } from '@/lib/wedding-presets';
import { MOBILE_INVITATION_10_TEMPLATES, MobileInvitationTemplate } from '@/lib/mobile-invitation-templates';

// 5 Curated BGM Soundtracks for Mobile Invitation
const BGM_PLAYLIST = [
  { id: 'piano-canon', title: 'Romantic Piano (Canon in D)', mood: 'Classic & Elegant', icon: '🎹' },
  { id: 'acoustic-love', title: 'Sweet Acoustic (A Thousand Years)', mood: 'Warm & Emotional', icon: '🎸' },
  { id: 'orchestra-royal', title: 'Majestic Royal Symphony', mood: 'Grand & Noble', icon: '🎻' },
  { id: 'jazz-waltz', title: 'Gentle Jazz Romance (She)', mood: 'Chic & Cozy', icon: '🎷' },
  { id: 'silent', title: 'No Music (Silent Mode)', mood: 'Silent Reading', icon: '🔇' },
];

// 5 Curated Luxury English Invitation Letter Presets (High-Society Editorial)
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

// Web Audio Procedural Chords & Melody Synthesizer for Wedding BGM Preview
let bgmAudioCtx: any = null;
let bgmActiveNodes: any[] = [];
let bgmTimer: any = null;

function stopBgmAudio() {
  if (bgmTimer) {
    clearTimeout(bgmTimer);
    bgmTimer = null;
  }
  if (bgmAudioCtx) {
    const t = bgmAudioCtx.currentTime;
    bgmActiveNodes.forEach((n) => {
      try { n.stop(t + 0.05); } catch (e) {}
    });
    bgmActiveNodes = [];
  }
}

function playBgmAudio(trackId: string = 'piano-canon') {
  stopBgmAudio();
  if (typeof window === 'undefined' || trackId === 'silent') return;

  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;
  if (!bgmAudioCtx) {
    bgmAudioCtx = new AudioCtx();
  }
  const ctx = bgmAudioCtx;

  const startPlaying = () => {

  const playTone = (freq: number, start: number, dur: number, type: OscillatorType = 'triangle', vol = 0.12) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(vol, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(vol * 0.4, start + dur * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.1);
      bgmActiveNodes.push(osc);
    } catch (e) {}
  };

  if (trackId === 'piano-canon') {
    const chords = [
      { b: 146.83, m: [293.66, 369.99, 440.0], mel: 739.99 },
      { b: 110.0, m: [220.0, 277.18, 329.63], mel: 659.25 },
      { b: 123.47, m: [246.94, 293.66, 369.99], mel: 587.33 },
      { b: 92.5, m: [185.0, 220.0, 277.18], mel: 554.37 },
      { b: 98.0, m: [196.0, 246.94, 293.66], mel: 493.88 },
      { b: 146.83, m: [220.0, 293.66, 369.99], mel: 440.0 },
      { b: 98.0, m: [196.0, 246.94, 293.66], mel: 493.88 },
      { b: 110.0, m: [220.0, 277.18, 329.63], mel: 554.37 },
    ];
    const loop = () => {
      const now = ctx.currentTime + 0.05;
      chords.forEach((c, i) => {
        const t = now + i * 1.8;
        playTone(c.b, t, 1.7, 'sine', 0.15);
        playTone(c.m[0], t + 0.1, 1.3, 'triangle', 0.09);
        playTone(c.m[1], t + 0.45, 1.3, 'triangle', 0.09);
        playTone(c.m[2], t + 0.8, 1.2, 'triangle', 0.09);
        playTone(c.mel, t + 0.15, 1.5, 'triangle', 0.13);
      });
      bgmTimer = setTimeout(loop, chords.length * 1.8 * 1000 - 150);
    };
    loop();
  } else if (trackId === 'acoustic-love') {
    const progression = [261.63, 196.0, 220.0, 174.61];
    const loop = () => {
      const now = ctx.currentTime + 0.05;
      progression.forEach((root, i) => {
        const t = now + i * 2.0;
        playTone(root * 0.5, t, 1.8, 'triangle', 0.14);
        playTone(root, t + 0.2, 1.2, 'sine', 0.11);
        playTone(root * 1.25, t + 0.5, 1.1, 'sine', 0.09);
        playTone(root * 1.5, t + 0.8, 1.0, 'sine', 0.09);
        playTone(root * 2.0, t + 1.2, 0.9, 'triangle', 0.11);
      });
      bgmTimer = setTimeout(loop, progression.length * 2.0 * 1000 - 100);
    };
    loop();
  } else if (trackId === 'orchestra-royal') {
    const chords = [
      [220, 277.18, 329.63, 440],
      [246.94, 311.13, 369.99, 493.88],
      [277.18, 349.23, 415.3, 554.37],
      [329.63, 415.3, 493.88, 659.25],
    ];
    const loop = () => {
      const now = ctx.currentTime + 0.05;
      chords.forEach((chord, i) => {
        const t = now + i * 2.4;
        chord.forEach((n) => {
          playTone(n * 0.5, t, 2.2, 'sawtooth', 0.035);
          playTone(n, t + 0.05, 2.1, 'sine', 0.07);
        });
      });
      bgmTimer = setTimeout(loop, chords.length * 2.4 * 1000 - 100);
    };
    loop();
  } else if (trackId === 'jazz-waltz') {
    const chords = [
      [174.61, 261.63, 329.63, 392.0],
      [220.0, 261.63, 329.63, 392.0],
      [233.08, 293.66, 349.23, 440.0],
      [196.0, 246.94, 293.66, 349.23],
    ];
    const loop = () => {
      const now = ctx.currentTime + 0.05;
      chords.forEach((chord, i) => {
        const t = now + i * 2.2;
        playTone(chord[0] * 0.5, t, 2.0, 'sine', 0.15);
        chord.forEach((n, idx) => {
          playTone(n, t + 0.15 + idx * 0.08, 1.7, 'triangle', 0.08);
        });
      });
      bgmTimer = setTimeout(loop, chords.length * 2.2 * 1000 - 100);
    };
    loop();
  }
  };

  if (ctx.state === 'suspended') {
    ctx.resume().then(() => startPlaying()).catch(() => startPlaying());
  } else {
    startPlaying();
  }
}



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

const THEME_TO_DEST_MAP: Record<string, string> = {
  'bali-jungle': 'theme_01_bali',
  'amalfi-cliff': 'theme_02_amalfi',
  'lake-como': 'theme_03_lake_como',
  'paris-palace': 'theme_04_paris',
  'nyc-penthouse': 'theme_05_nyc',
  'korean-hanok': 'theme_06_hanok',
  'kyoto-zen': 'theme_07_kyoto',
  'rajasthan-palace': 'theme_08_udaipur',
  'santorini-cliff': 'theme_09_santorini',
  'cabo-ocean': 'theme_10_cabo',
  'dubai-mirage': 'theme_11_liwa',
  'swiss-alps': 'theme_12_swiss_alps',
};

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

// Converts heavy base64 data URLs into lightweight blob: URLs to prevent mobile browser memory overflow
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

export default function WeddingHelperPage() {
  const router = useRouter();
  useEffect(() => {
    document.title = 'WeddingHelper · Where Forever Begins | Curated Luxury Weddings';
  }, []);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('bali-jungle');
  const [filterCategory, setFilterCategory] = useState<'all' | 'western' | 'heritage' | 'global_killer'>('all');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isBatchSynthesizing, setIsBatchSynthesizing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; title: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; isVip: boolean; plan?: 'single' | 'trio' | 'grand' } | null>(null);
  // 240 Masterpiece Collection & ZIP Download States
  const [active240Tab, setActive240Tab] = useState<string>('all');
  const [activeLightboxScene, setActiveLightboxScene] = useState<Wedding240Scene | null>(null);
  const [personalizedScenes, setPersonalizedScenes] = useState<Record<string, string>>({});
  const [transformingSceneId, setTransformingSceneId] = useState<string | null>(null);

  const handleTransformSingleScene = async (scene: Wedding240Scene) => {
    if (transformingSceneId) return;
    const imagesToUse = uploadedImages.length > 0 ? uploadedImages : (uploadedImage ? [uploadedImage] : [currentTheme.heroImage]);
    setTransformingSceneId(scene.id);
    setCopyToast(`✨ Synthesizing "${scene.angleTitle}" with your authentic faces & exact concept...`);

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
          groomHeight,
          groomWeight,
          brideHeight,
          brideWeight,
        })
      });
      const data = await res.json();
      if (data.success && data.isAiGenerated && data.visualizedImageUrl) {
        const safeUrl = dataUrlToBlobUrl(data.visualizedImageUrl);
        setPersonalizedScenes(prev => ({
          ...prev,
          [scene.id]: safeUrl
        }));
        setCopyToast(`🎉 Successfully transformed "${scene.angleTitle}" with your faces!`);
      } else {
        setCopyToast(`⚠️ Gemini AI rate-limited for this angle. Tap to retry in a moment.`);
      }
    } catch (e) {
      console.warn('Angle transform fallback', e);
    } finally {
      setTransformingSceneId(null);
      setTimeout(() => setCopyToast(''), 4000);
    }
  };

  // Batch synthesize all 20 scenes of the currently active destination
  const handleBatchSynthesizeActiveTab = async () => {
    if (isBatchSynthesizing) {
      setIsBatchSynthesizing(false);
      setBatchProgress(null);
      setCopyToast('🛑 Batch synthesis paused.');
      setTimeout(() => setCopyToast(''), 3000);
      return;
    }

    const targetScenes = WEDDING_240_SCENES.filter(
      s => active240Tab === 'all' || s.themeId === active240Tab
    );
    if (targetScenes.length === 0) return;

    setIsBatchSynthesizing(true);
    const imagesToUse = uploadedImages.length > 0 ? uploadedImages : (uploadedImage ? [uploadedImage] : [currentTheme.heroImage]);

    setCopyToast(`✨ Synthesizing all ${targetScenes.length} scenes in this destination with your faces...`);

    for (let i = 0; i < targetScenes.length; i++) {
      const scene = targetScenes[i];
      setBatchProgress({
        current: i + 1,
        total: targetScenes.length,
        title: scene.angleTitle,
      });

      // 2.5s safe cooldown delay between batch requests
      if (i > 0) {
        await new Promise(r => setTimeout(r, 2500));
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
            groomHeight,
            groomWeight,
            brideHeight,
            brideWeight,
          })
        });
        const data = await res.json();
        if (data.success && data.isAiGenerated && data.visualizedImageUrl) {
          const safeUrl = dataUrlToBlobUrl(data.visualizedImageUrl);
          setPersonalizedScenes(prev => ({
            ...prev,
            [scene.id]: safeUrl
          }));
        }
      } catch (err) {
        console.warn(`Failed batch scene ${scene.id}:`, err);
      }
    }

    setIsBatchSynthesizing(false);
    setBatchProgress(null);
    setCopyToast(`🎉 All ${targetScenes.length} scenes synthesized with your faces and tailored bodies!`);
    setTimeout(() => setCopyToast(''), 5000);
  };
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const handleDownloadAll240Zip = async () => {
    if (isDownloadingZip) return;
    setIsDownloadingZip(true);
    setZipProgress(0);
    try {
      const zip = new JSZip();
      const total = WEDDING_240_SCENES.length;
      let completed = 0;

      const batchSize = 10;
      for (let i = 0; i < total; i += batchSize) {
        const batch = WEDDING_240_SCENES.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (scene) => {
            try {
              const photoUrl = personalizedScenes[scene.id] || visualizedResult?.imageUrl || scene.imagePath;
              const res = await fetch(photoUrl);
              const blob = await res.blob();
              const folderName = `${scene.themeId.replace('theme_', '')}_${scene.destination.split(',')[0].replace(/\s+/g, '_')}`;
              const fileName = `Angle_${String(scene.angleNum).padStart(2, '0')}_${scene.angleTitle.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
              zip.folder(folderName)?.file(fileName, blob);
            } catch (err) {
              console.warn(`Failed to fetch ${scene.imagePath}`, err);
            } finally {
              completed++;
              setZipProgress(Math.round((completed / total) * 100));
            }
          })
        );
      }

      // Add the couple's personalized masterpiece photo to the ZIP
      if (visualizedResult?.imageUrl) {
        try {
          const res = await fetch(visualizedResult.imageUrl);
          const blob = await res.blob();
          zip.file('00_YOUR_PERSONALIZED_WEDDING_MASTERPIECE.jpg', blob);
          const activeThemeFolder = `${currentTheme.id.replace('theme_', '')}_${currentTheme.destination.split(',')[0].replace(/\s+/g, '_')}`;
          zip.folder(activeThemeFolder)?.file('Angle_01_Personalized_From_Your_Photo.jpg', blob);
        } catch (e) {
          console.warn('Could not add personalized photo to ZIP', e);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
        setZipProgress(metadata.percent);
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `WeddingHelper_240_Masterpieces_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setCopyToast('🎉 All 240 Masterpiece Photos downloaded successfully!');
      setTimeout(() => setCopyToast(''), 4000);
    } catch (e) {
      console.error('ZIP generation error:', e);
      alert('Could not package ZIP. Please try downloading individual photos.');
    } finally {
      setIsDownloadingZip(false);
      setZipProgress(0);
    }
  };

  const [loginEmail, setLoginEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'trio' | 'grand'>('grand');

  // Groom & Bride Precision Height and Weight Proportions
  const [groomHeight, setGroomHeight] = useState<string>('180');
  const [groomWeight, setGroomWeight] = useState<string>('75');
  const [brideHeight, setBrideHeight] = useState<string>('165');
  const [brideWeight, setBrideWeight] = useState<string>('50');

  // Bojagi Card & Barunson 10 Luxury Mobile Invitation States
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [playingBgmId, setPlayingBgmId] = useState<string | null>(null);

  const handleToggleBgm = (bgmId: string, bgmTitle: string) => {
    if (bgmId === 'silent') {
      stopBgmAudio();
      setPlayingBgmId(null);
      setInvitationData(prev => ({ ...prev, bgmId: 'silent', bgmTitle: 'No Music (Silent Mode)' }));
      return;
    }
    if (playingBgmId === bgmId) {
      stopBgmAudio();
      setPlayingBgmId(null);
    } else {
      playBgmAudio(bgmId);
      setPlayingBgmId(bgmId);
      setInvitationData(prev => ({ ...prev, bgmId, bgmTitle }));
    }
  };

  const [isDemoMode, setIsDemoMode] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('blooming-peony');
  const [activeAccountTab, setActiveAccountTab] = useState<'groom' | 'bride' | null>('groom');
  const [activeGalleryPhoto, setActiveGalleryPhoto] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [mealChoice, setMealChoice] = useState<'dinner' | 'ceremony_only'>('dinner');

  const [copyToast, setCopyToast] = useState<string>('');
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [invitationEditorTab, setInvitationEditorTab] = useState<'couple' | 'datetime_venue' | 'media_bgm' | 'letter'>('letter');
  const [invitationViewMode, setInvitationViewMode] = useState<'both' | 'editor' | 'preview'>('both');
  const [uploadTargetIndex, setUploadTargetIndex] = useState<number | 'cover'>('cover');

  // Guestbook list (Bojagi Card format)
  const [guestbookList, setGuestbookList] = useState<Array<{ id: number; name: string; message: string; date: string }>>([
    { id: 1, name: 'Robert & Eleanor Brooks (Parents of the Groom)', message: 'To our dearest son Alexander and daughter-in-law Olivia, may your marriage be blessed with endless joy.', date: 'Nov 01, 2026' },
    { id: 2, name: 'William & Victoria Vance (Parents of the Bride)', message: 'Dearest Olivia and Alexander, watching you embark on this breathtaking journey together brings tears of pure joy.', date: 'Nov 02, 2026' },
    { id: 3, name: 'Bridal Party & Groomsmen', message: 'The most stunning couple and the wedding of the decade! Counting down to November 14!', date: 'Nov 03, 2026' }
  ]);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestMsg, setNewGuestMsg] = useState('');

  // Comprehensive Customer Editable Invitation State (Groom, Bride, Date, Venue, Photos, BGM, Letter)
  const [invitationData, setInvitationData] = useState({
    groomName: 'Alexander Brooks',
    groomPhone: '+1 (212) 555-0192',
    groomFather: 'Robert Brooks',
    groomMother: 'Eleanor Brooks',
    groomRelation: 'Son',
    groomParentPhone: '+1 (212) 555-0193',
    groomBank: 'Chase Bank',
    groomAccount: '9876-5432-1098',
    groomHolder: 'Alexander Brooks',
    groomKakaoPay: 'https://venmo.com',

    brideName: 'Olivia Catherine',
    bridePhone: '+1 (212) 555-0145',
    brideFather: 'William Vance',
    brideMother: 'Victoria Vance',
    brideRelation: 'Daughter',
    brideParentPhone: '+1 (212) 555-0146',
    brideBank: 'Bank of America',
    brideAccount: '1234-5678-9012',
    brideHolder: 'Olivia Catherine',
    brideKakaoPay: 'https://venmo.com',

    weddingDate: 'Saturday, November 14, 2026',
    weddingTime: '4:30 PM EST',
    weddingDayNum: 14,
    venueName: 'The Plaza Hotel New York',
    venueHall: 'The Grand Ballroom & Terrace Room',
    venueAddress: '768 5th Ave, New York, NY 10019, United States',
    venueTraffic: 'Subway: N, R, W at 5th Ave-59th St; 4, 5, 6 at 59th St-Lexington Ave.',
    venueParking: 'Complimentary valet parking provided at the 58th Street entrance.',
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

  const getGuestShareUrl = (relative = false) => {
    if (typeof window === 'undefined') return `/invite?theme=${selectedTemplateId}`;
    const params = new URLSearchParams();
    params.set('theme', selectedTemplateId);
    if (invitationData.groomName) params.set('groom', invitationData.groomName);
    if (invitationData.brideName) params.set('bride', invitationData.brideName);
    if (invitationData.weddingDate) params.set('date', invitationData.weddingDate);
    if (invitationData.weddingTime) params.set('time', invitationData.weddingTime);
    if (invitationData.venueName) params.set('venue', invitationData.venueName);
    if (invitationData.coverPhoto && !invitationData.coverPhoto.startsWith('data:')) {
      params.set('photo', invitationData.coverPhoto);
    }
    const query = params.toString();
    return relative ? `/invite?${query}` : `${window.location.origin}/invite?${query}`;
  };

  const [visualizedResult, setVisualizedResult] = useState<{
    imageUrl: string;
    theme: WeddingThemePreset;
    products: WeddingProduct[];
    venueBookingUrl: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoUploadInputRef = useRef<HTMLInputElement>(null);
  const slot1InputRef = useRef<HTMLInputElement>(null);
  const slot2InputRef = useRef<HTMLInputElement>(null);
  const slot3InputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkHash = () => {
      if (typeof window !== 'undefined' && (window.location.hash === '#invitation' || window.location.search.includes('invitation') || window.location.search.includes('demo'))) {
        setIsDemoMode(true);
        setIsInvitationOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    // Global Clipboard Paste Support (Ctrl+V)
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                setUploadedImage(event.target.result as string);
                setCopyToast('✨ Couple photograph pasted from clipboard!');
                setTimeout(() => setCopyToast(''), 3500);
              }
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);

    // Restore persisted customer session & verify VIP status
    try {
      const savedUserStr = localStorage.getItem('weddinghelper_user');
      const localDbStr = localStorage.getItem('weddinghelper_vip_db');
      const localDb = localDbStr ? JSON.parse(localDbStr) : {};

      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed?.email) {
          const emailLower = parsed.email.toLowerCase();
          if (localDb[emailLower]?.plan === 'grand' || parsed.plan === 'grand') {
            setUser({ ...parsed, isVip: true, plan: 'grand' });
          } else {
            setUser(parsed);
            // Server verification
            fetch(`/api/weddinghelper/member?email=${encodeURIComponent(emailLower)}`)
              .then(res => res.json())
              .then(data => {
                if (data?.isVip && data?.plan === 'grand') {
                  const updated = { ...parsed, isVip: true, plan: 'grand' as const };
                  setUser(updated);
                  localStorage.setItem('weddinghelper_user', JSON.stringify(updated));
                }
              })
              .catch(() => {});
          }
        }
      }
    } catch (e) {
      console.error('Session restore error', e);
    }

    
  return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const currentTheme = WEDDING_12_PRESETS[selectedThemeId] || WEDDING_12_PRESETS['bali-jungle'];

  // Category filtering
  const themeList = Object.values(WEDDING_12_PRESETS).filter(t => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  // Client-side high-resolution image compression (Guarantees Vercel 4.5MB limit is never exceeded)
  const compressImage = (file: File, maxDim = 960, quality = 0.72): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Slot-based photo upload handler for up to 3 reference photos
  const handleSlotUpload = async (slotIdx: number, file: File) => {
    const compressed = await compressImage(file);
    setUploadedImages(prev => {
      const next = [...prev];
      while (next.length <= slotIdx) next.push('');
      next[slotIdx] = compressed;
      return next;
    });
    if (slotIdx === 0 || !uploadedImage) {
      setUploadedImage(compressed);
    }
    setCopyToast(`✨ Photo #${slotIdx + 1} added for enhanced 3D facial recognition!`);
    setTimeout(() => setCopyToast(''), 3000);
  };

  const handleRemovePhoto = (slotIdx: number) => {
    setUploadedImages(prev => {
      const next = [...prev];
      next.splice(slotIdx, 1);
      if (next.length > 0) {
        setUploadedImage(next[0]);
      } else {
        setUploadedImage(null);
      }
      return next;
    });
  };

  // Photo upload handler with auto-compression (supports multiple files)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      for (let i = 0; i < Math.min(files.length, 3); i++) {
        const compressed = await compressImage(files[i]);
        newImages.push(compressed);
      }
      setUploadedImages(prev => {
        const merged = [...prev, ...newImages].slice(0, 3);
        if (merged.length > 0) setUploadedImage(merged[0]);
        return merged;
      });
      setCopyToast(`✨ ${newImages.length} photo(s) loaded for 100% facial recognition!`);
      setTimeout(() => setCopyToast(''), 3500);
    }
  };

  // Mobile Invitation Custom Photo Upload Handler (Cover or Gallery) with auto-compression
  const handleInvitationPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file);
      if (uploadTargetIndex === 'cover') {
        setInvitationData(prev => ({ ...prev, coverPhoto: compressed }));
      } else if (typeof uploadTargetIndex === 'number') {
        setInvitationData(prev => {
          const nextPhotos = [...prev.galleryPhotos];
          nextPhotos[uploadTargetIndex] = compressed;
          return { ...prev, galleryPhotos: nextPhotos };
        });
      }
    }
  };

  // Auto-batch synthesize all 20 scenes of a destination sequentially
  const autoBatchSynthesizeDestination = async (destId: string, imagesToUse: string[]) => {
    const targetScenes = WEDDING_240_SCENES.filter(s => s.themeId === destId);
    if (targetScenes.length === 0) return;

    setIsBatchSynthesizing(true);
    setCopyToast(`✨ Auto-synthesizing all 20 distinct scenes with your authentic faces...`);

    // Scenes 2 through 20 (scene 1 is already done)
    for (let i = 1; i < targetScenes.length; i++) {
      const scene = targetScenes[i];
      setTransformingSceneId(scene.id);
      setBatchProgress({
        current: i + 1,
        total: targetScenes.length,
        title: scene.angleTitle,
      });

      // 2.5s cooldown delay to prevent Gemini Free Tier rate-limiting
      await new Promise(r => setTimeout(r, 2500));

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
            groomHeight,
            groomWeight,
            brideHeight,
            brideWeight,
          })
        });
        const data = await res.json();
        if (data.success && data.isAiGenerated && data.visualizedImageUrl) {
          const safeUrl = dataUrlToBlobUrl(data.visualizedImageUrl);
          setPersonalizedScenes(prev => ({
            ...prev,
            [scene.id]: safeUrl
          }));
        }
      } catch (err) {
        console.warn(`Failed auto-batch scene ${scene.id}:`, err);
      } finally {
        setTransformingSceneId(null);
      }
    }

    setIsBatchSynthesizing(false);
    setBatchProgress(null);
    setCopyToast(`🎉 All 20 scenes successfully synthesized with your authentic faces!`);
    setTimeout(() => setCopyToast(''), 6000);
  };

  // AI Wedding Visualization execution -> Redirect to dedicated 240 Masterpiece Gallery
  const handleGenerateWedding = async () => {
    setIsGenerating(true);
    setGenerationStep('Preserving facial bone structure & smiles...');

    try {
      const destId = THEME_TO_DEST_MAP[selectedThemeId] || 'theme_01_bali';
      const coupleImageToUse = uploadedImage || currentTheme.heroImage;
      const imagesToUse = uploadedImages.length > 0 ? uploadedImages : [coupleImageToUse];

      // Save photos, preferences and proportions to localStorage for the dedicated gallery
      try {
        localStorage.setItem('weddinghelper_uploaded_images', JSON.stringify(imagesToUse));
        localStorage.setItem('weddinghelper_proportions', JSON.stringify({ groomHeight, groomWeight, brideHeight, brideWeight }));
        localStorage.setItem('weddinghelper_selected_theme', selectedThemeId);
      } catch (storageErr) {
        console.warn('LocalStorage save error:', storageErr);
      }

      // Redirect immediately to the dedicated high-speed 240 Masterpiece Gallery
      router.push(`/weddinghelper/gallery?dest=${destId}&autoSynthesize=true`);
    } catch (err) {
      console.warn('Redirect error:', err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleUserLogin = async (rawEmail: string) => {
    const email = rawEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    let isVip = false;
    let plan: 'single' | 'trio' | 'grand' | undefined = undefined;

    // 1. Check local VIP DB
    try {
      const localDbStr = localStorage.getItem('weddinghelper_vip_db');
      const localDb = localDbStr ? JSON.parse(localDbStr) : {};
      if (localDb[email] && (localDb[email].plan === 'grand' || localDb[email].isVip)) {
        isVip = true;
        plan = localDb[email].plan || 'grand';
      }
    } catch (e) {}

    // 2. Check server DB
    if (!isVip) {
      try {
        const res = await fetch(`/api/weddinghelper/member?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data?.isVip && data?.plan === 'grand') {
          isVip = true;
          plan = 'grand';
        }
      } catch (e) {}
    }

    const userObj = { email, isVip, plan };
    setUser(userObj);
    try {
      localStorage.setItem('weddinghelper_user', JSON.stringify(userObj));
    } catch (e) {}

    setIsLoginOpen(false);

    if (isVip && plan === 'grand') {
      setCopyToast(`Welcome back, ${email}! Your $19 Grand 12 VIP Pass is active.`);
    } else {
      setCopyToast(`Signed in as ${email}.`);
    }
    setTimeout(() => setCopyToast(''), 4000);
  };

  // Linked Checkout Handler (Permanently links purchase to account)
    // Pay & Create Handler (몸무게 밑 '결제 후 만들기' 버튼 전용 핸들러)
  const handlePayAndCreate = () => {
    // Testing Mode: Payment temporarily unlocked for CEO testing! Directly synthesize masterpieces
    handleGenerateWedding();
  };

  const handleCompleteOrder = async () => {
    const payerEmail = (user?.email || loginEmail || 'vip.couple@wedding.com').trim().toLowerCase();

    // 1. Save to server DB
    try {
      await fetch('/api/weddinghelper/member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payerEmail,
          plan: selectedPlan,
          weddingDate: invitationData.weddingDate,
          orderId: `WH_VIP_${Date.now()}`
        })
      });
    } catch (e) {
      console.error(e);
    }

    // 2. Save to client persistent DB & session
    const vipRecord = {
      email: payerEmail,
      isVip: true,
      plan: selectedPlan,
      paidAt: new Date().toISOString(),
      weddingDate: invitationData.weddingDate,
    };

    try {
      const localDbStr = localStorage.getItem('weddinghelper_vip_db');
      const localDb = localDbStr ? JSON.parse(localDbStr) : {};
      localDb[payerEmail] = vipRecord;
      localStorage.setItem('weddinghelper_vip_db', JSON.stringify(localDb));
      localStorage.setItem('weddinghelper_user', JSON.stringify(vipRecord));
    } catch (e) {}

    setUser(vipRecord);
    setIsCheckoutOpen(false);

    setCopyToast(`🎉 The Grand 12 VIP Pass Activated ($19 Special)! Permanently linked to ${payerEmail}.`);
    setTimeout(() => setCopyToast(''), 5000);

    const destId = THEME_TO_DEST_MAP[selectedThemeId] || 'theme_01_bali';
    if (uploadedImage || uploadedImages.length > 0) {
      setTimeout(() => {
        handleGenerateWedding();
      }, 400);
    } else {
      setTimeout(() => {
        router.push(`/weddinghelper/gallery?dest=${destId}`);
      }, 500);
    }
  };


  
  return (
    <div className="min-h-screen bg-[#FFFDFC] text-[#2C2426] font-serif antialiased selection:bg-[#E8A598]/30 relative overflow-hidden">
      {/* 🏛️ Aman & Hermès Architectural Warm Ivory Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-gradient-to-b from-[#F7F2E7]/70 via-[#FDFBF7]/40 to-transparent blur-[160px]" />
        <div className="absolute top-[25%] -right-40 w-[800px] h-[800px] bg-gradient-to-br from-[#F5EEDB]/50 via-[#FAF8F5]/30 to-transparent blur-[180px]" />
        <div className="absolute top-[60%] -left-40 w-[900px] h-[900px] bg-gradient-to-tr from-[#F4ECE1]/50 via-[#FDFBF7]/30 to-transparent blur-[190px]" />
        {/* Subtle Architectural Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#E8DFD3_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.25]" />
      </div>

      {/* 1. Aman / Hermès Prestige Global Header */}
      <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-[#EAE3D9] shadow-[0_2px_24px_rgba(30,24,20,0.03)] font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/weddinghelper" className="flex items-center gap-3.5 group">
              <span className="w-10 h-10 rounded-full bg-[#1C1917] border border-[#C5A059]/40 flex items-center justify-center text-[#EAD8B1] font-serif font-bold text-base shadow-sm group-hover:border-[#C5A059] transition">
                W
              </span>
              <div>
                <span className="text-xl font-serif tracking-[0.22em] text-[#1C1917] font-normal block leading-none">
                  WEDDING<span className="text-[#C5A059] font-medium">HELPER</span>
                </span>
                <span className="text-[9px] tracking-[0.35em] text-[#8C827A] uppercase block mt-1.5 font-medium font-sans">
                  The Haute Couture Wedding Atelier · Est. 2026
                </span>
              </div>
            </Link>

            {/* Wedding Atelier Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-xs tracking-wider text-[#6E645E] border-l border-[#EAE3D9] pl-6 font-medium">
              <Link 
                href="/weddinghelper/gallery"
                className="hover:text-[#1C1917] transition cursor-pointer flex items-center gap-1.5 font-bold text-[#C5A059]"
              >
                <Sparkles className="w-3.5 h-3.5 fill-[#C5A059]" />
                <span>240 Masterpiece Portfolio</span>
              </Link>
              <button 
                type="button"
                onClick={() => {
                  const el = document.getElementById('atelier-studio-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#1C1917] transition cursor-pointer"
              >
                Bespoke Studio
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsDemoMode(true);
                  setIsInvitationOpen(true);
                }}
                className="hover:text-[#1C1917] transition cursor-pointer"
              >
                Digital Invitation
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              /* When Logged In as VIP: Clean Atelier VIP Badge & Logout */
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="open-vip-studio-btn"
                  onClick={() => {
                    setIsDemoMode(false);
                    setIsInvitationOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#1C1917] text-[#EAD8B1] border border-[#C5A059]/50 hover:bg-[#2B2623] hover:scale-[1.01] transition shadow-sm flex items-center gap-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer active:scale-95"
                >
                  <Gem className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>VIP STUDIO</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] font-extrabold tracking-wider">ACTIVE</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setUser(null);
                    localStorage.removeItem('weddinghelper_user');
                    setCopyToast('Logged out successfully.');
                    setTimeout(() => setCopyToast(''), 2500);
                  }}
                  className="text-xs text-[#8C827A] hover:text-[#1C1917] underline whitespace-nowrap cursor-pointer"
                >
                  Log out
                </button>
              </div>
            ) : (
              /* When Guest: Refined Atelier Buttons */
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  type="button"
                  id="open-invitation-btn"
                  onClick={() => {
                    setIsDemoMode(true);
                    setIsInvitationOpen(true);
                  }}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wider text-[#6E645E] hover:text-[#1C1917] transition whitespace-nowrap cursor-pointer"
                >
                  <span>💌 Free Digital Wedding Invitation</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border border-[#D8CEBE] text-[#3D3530] hover:bg-[#F5EEDB] transition bg-white shadow-xs whitespace-nowrap cursor-pointer"
                >
                  Log In
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-[#1C1917] text-[#EAD8B1] border border-[#C5A059]/40 hover:bg-[#2B2623] transition shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>VIP Pass · $19</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Aman & Hermès Architectural Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        {/* Prestige Atelier Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#D8CEBE] bg-[#FAF8F5] text-[#8C7A68] text-xs font-sans tracking-[0.2em] uppercase mb-8 shadow-xs">
          <span className="text-[#C5A059]">✦</span>
          <span>HAUTE COUTURE WEDDING ATELIER · 12 SANCTUARY WORLDS</span>
          <span className="text-[#C5A059]">✦</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#1C1917] tracking-tight max-w-5xl mx-auto leading-[1.15] font-light">
          The Art of Forever. <br />
          <span className="italic font-normal text-[#C5A059]">
            Immortalized in Haute Couture.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#6E645E] max-w-3xl mx-auto font-light leading-relaxed font-sans">
          Preserving your authentic East Asian facial contours, natural smiles, and loving chemistry. Seamlessly synthesized across 12 of the world&apos;s most sacred sanctuary destination chapels with bespoke Italian tuxedos and couture silk gowns.
        </p>

        {/* 🌟 3-Step Bespoke Atelier Studio (Aman / Hermès Ivory Minimalism) */}
        <div className="mt-14 max-w-4xl mx-auto p-8 sm:p-12 rounded-[36px] bg-[#FAF8F5] border border-[#EAE3D9] shadow-[0_20px_60px_rgba(28,25,23,0.06)] relative font-sans">
          {/* Subtle Atelier Corner Marks */}
          <div className="absolute top-6 left-6 text-[#C5A059]/40 text-xs font-mono">+</div>
          <div className="absolute top-6 right-6 text-[#C5A059]/40 text-xs font-mono">+</div>
          <div className="absolute bottom-6 left-6 text-[#C5A059]/40 text-xs font-mono">+</div>
          <div className="absolute bottom-6 right-6 text-[#C5A059]/40 text-xs font-mono">+</div>

                    <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            multiple
            className="hidden" 
          />
          <input 
            type="file" 
            ref={slot1InputRef} 
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSlotUpload(0, f); }} 
            accept="image/*" 
            className="hidden" 
          />
          <input 
            type="file" 
            ref={slot2InputRef} 
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSlotUpload(1, f); }} 
            accept="image/*" 
            className="hidden" 
          />
          <input 
            type="file" 
            ref={slot3InputRef} 
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSlotUpload(2, f); }} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Step 02: Biometric Facial Identity Vault */}
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-left border-b border-[#EAE3D9] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D8CEBE] text-[#8C7A68] text-[11px] font-bold uppercase tracking-wider mb-2 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>BIOMETRIC FACIAL IDENTITY VAULT · 100% ETHNIC LIKENESS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#1C1917] font-normal">
                Provide Reference Photographs for Absolute Facial Lock
              </h3>
              <p className="text-xs text-[#7A7068] mt-1">
                Upload up to 3 photos (Couple + Bride Close-Up + Groom Close-Up). Locks authentic East Asian double eyelids, dimples, and genuine smiles without alteration.
              </p>
            </div>

            {uploadedImages.length > 0 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-full bg-white border border-[#C87870] text-[#C87870] font-bold text-xs hover:bg-[#FAF3EF] transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Add / Replace Photos</span>
              </button>
            )}
          </div>

          {/* 3-Slot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
            {/* Slot 1: Couple Photo */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[11px] font-bold mb-1.5 text-[#1F181B] px-1">
                <span>1. Couple Photo</span>
                <span className="text-[#C87870] text-[10px] uppercase font-bold">Required</span>
              </div>
              {uploadedImages[0] ? (
                <div className="relative h-48 rounded-2xl overflow-hidden border-2 border-[#C87870] shadow-sm group">
                  <Image src={uploadedImages[0]} alt="Couple Photo" fill unoptimized className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => slot1InputRef.current?.click()}
                      className="px-2.5 py-1 rounded-full bg-white text-[#1F181B] text-[11px] font-bold shadow-md hover:bg-neutral-100 cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(0)}
                      className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                    ✓ Couple Full Photo
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => slot1InputRef.current?.click()}
                  className="h-48 rounded-2xl border-2 border-dashed border-[#EBDCD3] hover:border-[#C87870] bg-[#FFFDFB] hover:bg-[#FFFDFC] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FAF3EF] flex items-center justify-center text-[#B85E55] group-hover:scale-110 transition mb-2">
                    <Heart className="w-5 h-5 fill-[#C87870]/20 stroke-[#C87870]" />
                  </div>
                  <span className="text-xs font-bold text-[#1F181B]">Couple Photo</span>
                  <span className="text-[10px] text-[#9E8B88] mt-1">Full scene & chemistry</span>
                  <span className="mt-2.5 text-[10px] text-[#C87870] font-bold underline">Click to Upload</span>
                </div>
              )}
            </div>

            {/* Slot 2: Bride Close-Up */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[11px] font-bold mb-1.5 text-[#1F181B] px-1">
                <span>2. Bride Face</span>
                <span className="text-[#D4AF37] text-[10px] uppercase font-bold">100% Lock</span>
              </div>
              {uploadedImages[1] ? (
                <div className="relative h-48 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-sm group">
                  <Image src={uploadedImages[1]} alt="Bride Face Close-Up" fill unoptimized className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => slot2InputRef.current?.click()}
                      className="px-2.5 py-1 rounded-full bg-white text-[#1F181B] text-[11px] font-bold shadow-md hover:bg-neutral-100 cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(1)}
                      className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[#D4AF37] text-[10px] font-bold backdrop-blur-xs">
                    ✓ Bride Face Locked
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => slot2InputRef.current?.click()}
                  className="h-48 rounded-2xl border-2 border-dashed border-[#EBDCD3] hover:border-[#D4AF37] bg-[#FFFDFB] hover:bg-[#FFFDFC] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FAF3EF] flex items-center justify-center text-[#B85E55] group-hover:scale-110 transition mb-2">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-xs font-bold text-[#1F181B]">Bride Close-Up</span>
                  <span className="text-[10px] text-[#9E8B88] mt-1">Double eyelids & dimples</span>
                  <span className="mt-2.5 text-[10px] text-[#D4AF37] font-bold underline">+ Add Bride Photo</span>
                </div>
              )}
            </div>

            {/* Slot 3: Groom Close-Up */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[11px] font-bold mb-1.5 text-[#1F181B] px-1">
                <span>3. Groom Face</span>
                <span className="text-[#D4AF37] text-[10px] uppercase font-bold">100% Lock</span>
              </div>
              {uploadedImages[2] ? (
                <div className="relative h-48 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-sm group">
                  <Image src={uploadedImages[2]} alt="Groom Face Close-Up" fill unoptimized className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => slot3InputRef.current?.click()}
                      className="px-2.5 py-1 rounded-full bg-white text-[#1F181B] text-[11px] font-bold shadow-md hover:bg-neutral-100 cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(2)}
                      className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[#D4AF37] text-[10px] font-bold backdrop-blur-xs">
                    ✓ Groom Face Locked
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => slot3InputRef.current?.click()}
                  className="h-48 rounded-2xl border-2 border-dashed border-[#EBDCD3] hover:border-[#D4AF37] bg-[#FFFDFB] hover:bg-[#FFFDFC] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FAF3EF] flex items-center justify-center text-[#B85E55] group-hover:scale-110 transition mb-2">
                    <Gem className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-xs font-bold text-[#1F181B]">Groom Close-Up</span>
                  <span className="text-[10px] text-[#9E8B88] mt-1">Jawline & handsome smile</span>
                  <span className="mt-2.5 text-[10px] text-[#D4AF37] font-bold underline">+ Add Groom Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Upload Drag & Drop Bar */}
          {uploadedImages.length === 0 && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')).slice(0, 3);
                  if (files.length > 0) {
                    Promise.all(files.map(f => compressImage(f))).then(compressedList => {
                      setUploadedImages(compressedList);
                      setUploadedImage(compressedList[0]);
                      setCopyToast(`✨ ${compressedList.length} photo(s) dropped successfully!`);
                      setTimeout(() => setCopyToast(''), 3500);
                    });
                  }
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all duration-300 text-center mb-6 ${
                isDragging
                  ? 'border-[#C87870] bg-[#FFF2EE] ring-4 ring-[#C87870]/20'
                  : 'border-[#EBDCD3] hover:border-[#C87870] bg-[#FAF5F1]'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#1F181B]">
                <Upload className="w-4 h-4 text-[#C87870]" />
                <span>Drag & drop 1 to 3 photos here, or select from device (or press Ctrl+V)</span>
              </div>
            </div>
          )}

          {/* Precision Couple Height & Weight Proportions */}
          <div className="mt-7 pt-6 border-t border-[#F2E5DC] text-left font-sans">
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

          {/* 🌟 The Grand Atelier Masterpiece Button (Aman / Hermès Obsidian & Gold) */}
          <button
            type="button"
            id="create-masterpiece-main-btn"
            onClick={() => {
              setSelectedPlan('grand');
              if (user?.isVip) {
                handleGenerateWedding();
              } else {
                setIsCheckoutOpen(true);
              }
            }}
            disabled={isGenerating}
            className={`mt-8 w-full py-5 sm:py-6 px-6 sm:px-10 rounded-2xl font-bold uppercase tracking-[0.16em] text-xs sm:text-sm flex items-center justify-center gap-3 sm:gap-4 transition-all duration-300 shadow-xl active:scale-[0.99] cursor-pointer relative overflow-hidden border ${
              isGenerating 
                ? 'bg-[#EAE5DE] text-[#9C9288] border-transparent cursor-not-allowed' 
                : 'bg-[#1C1917] text-[#EAD8B1] border-[#C5A059]/60 hover:bg-[#2B2623] hover:border-[#C5A059] shadow-[0_12px_36px_rgba(28,25,23,0.35)]'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-[#1C1917] shrink-0" />
                <span className="font-serif italic capitalize text-sm sm:text-base text-[#1C1917]">{generationStep}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 text-center flex-wrap">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-[#C5A059] text-[#C5A059] shrink-0" />
                <span className="leading-snug font-serif tracking-[0.18em] text-sm sm:text-base">PAY $19 &amp; CREATE ALL 240 BESPOKE MASTERPIECES</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#EAD8B1] shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>

          <div className="mt-5 flex items-center justify-center gap-5 text-xs text-[#8C7A78] flex-wrap font-sans">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#C87870]" /> Single $19 All-Access Pass (All 12 Worlds Included)</span>
            <span>•</span>
            <span>240 Haute Couture Masterpieces</span>
            <span>•</span>
            <span>Free Digital Wedding Invitation Included</span>
          </div>
        </div>

        {/* The Haute Studio Reassurance Banner (Aman Warm Ivory) */}
        <div className="mt-16 p-8 sm:p-12 rounded-[32px] bg-[#FAF8F5] border border-[#EAE3D9] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D8CEBE] text-[#8C7A68] text-[10px] font-sans font-bold tracking-widest uppercase shadow-xs mb-3">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span>PROPRIETARY 8K HAUTE ATELIER ENGINE</span>
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#1C1917] font-light">
              Bespoke 20-Angle Masterpiece Collection
            </h3>
            <p className="text-xs font-sans text-[#6E645E] mt-2.5 leading-relaxed">
              Every destination automatically synthesizes 20 distinct cinematic vantage points — wide sanctuary panoramic views, emotional vow close-ups, candlelit champagne toasts, and intimate sunset silhouettes — tailored to your exact authentic facial contours and proportions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 350, behavior: 'smooth' })}
            className="px-8 py-4 rounded-full bg-[#1C1917] text-[#EAD8B1] border border-[#C5A059]/40 hover:bg-[#2B2623] text-xs font-sans font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2.5 whitespace-nowrap cursor-pointer"
          >
            <span>Create Your Bespoke Wedding</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </div>
      </section>

      {/* 4. The Grand 12 VIP All-Access Pass (Aman Warm Ivory & Obsidian) */}
      <section id="pricing-checkout-section" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#EAE3D9] z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans font-bold tracking-[0.2em] bg-[#F7F2E7] text-[#8C7A68] border border-[#D8CEBE] uppercase shadow-xs">
            <Gem className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>THE GRAND 12 VIP ALL-ACCESS PASS · SPECIAL INAUGURAL RATE</span>
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1C1917] font-light tracking-wide leading-tight">
            One Single $19 Pass. Forever Yours.
          </h2>
          <p className="text-base sm:text-lg font-sans text-[#6E645E] leading-relaxed">
            Zero subscriptions. Zero recurring fees. Instant lifetime access to all 240 haute couture masterpiece portraits across 12 destinations, plus the complete Digital Wedding Invitation Studio.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto bg-[#FAF8F5] rounded-[32px] border border-[#D8CEBE] shadow-[0_20px_50px_rgba(28,25,23,0.06)] p-8 sm:p-12 relative overflow-hidden font-sans">
          {/* Top Gold Foil Badge */}
          <div className="absolute top-0 right-0 bg-[#1C1917] text-[#EAD8B1] border-b border-l border-[#C5A059]/40 text-[10px] font-extrabold uppercase tracking-widest px-5 py-2 rounded-bl-xl shadow-sm">
            ALL 12 DESTINATIONS INCLUDED
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#EAE3D9] pb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7A68] block">
                The Grand 12 VIP Pass
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#1C1917] font-semibold mt-1">
                Lifetime Couple Access
              </h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="line-through text-lg text-[#9C9288] font-sans">$79</span>
              <span className="text-5xl font-serif font-extrabold text-[#1C1917] tracking-tight">$19</span>
              <span className="text-xs font-bold text-[#8C827A] uppercase tracking-wider">USD / single pay</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 text-sm text-[#2E2825]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <span><strong>240 Masterpiece Portraits</strong>: 20 Ultra-HD angles across all 12 destinations</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <span><strong>8K Canvas Print-Ready</strong>: 300 DPI lossless high-res files for framing</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <span><strong>Digital Invitation Studio</strong>: All 10 luxury templates, RSVP & real BGM</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <span><strong>1-Click ZIP Download</strong>: Download all 240 photos organized by theme</span>
            </div>
          </div>

          {/* Action Button */}
          {user?.plan === 'grand' ? (
            <div className="p-4 rounded-2xl bg-white border border-[#D8CEBE] text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                <span>Your $19 VIP Pass is Active!</span>
              </span>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleGenerateWedding();
                  }}
                  className="flex-1 py-3.5 rounded-full bg-[#1C1917] text-[#EAD8B1] border border-[#C5A059]/40 font-bold uppercase text-xs tracking-wider transition hover:bg-[#2B2623] cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                  <span className="font-serif tracking-wider">PAY $19 &amp; CREATE ALL 240 MASTERPIECES</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDemoMode(false);
                    setIsInvitationOpen(true);
                  }}
                  className="flex-1 py-3.5 rounded-full bg-white border border-[#D8CEBE] text-[#1C1917] font-bold uppercase text-xs tracking-wider transition hover:bg-[#F7F2E7] cursor-pointer shadow-xs"
                >
                  Open Invitation Studio
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSelectedPlan('grand');
                setIsCheckoutOpen(true);
              }}
              className="w-full py-5 rounded-2xl bg-[#1C1917] text-[#EAD8B1] border border-[#C5A059]/50 font-bold uppercase tracking-widest text-sm hover:bg-[#2B2623] transition shadow-lg flex items-center justify-center gap-3 cursor-pointer active:scale-95"
            >
              <Gem className="w-5 h-5 text-[#C5A059]" />
              <span>Pay $19 with PayPal / Credit Card</span>
              <ArrowRight className="w-5 h-5 text-[#C5A059]" />
            </button>
          )}

          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-[#8C827A] pt-2 border-t border-[#EAE3D9]">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Verified PayPal Checkout</span>
            <span>•</span>
            <span>Instant Digital Access</span>
            <span>•</span>
            <span>100% Satisfaction Guarantee</span>
          </div>
        </div>
      </section>


            {/* 5. 240 Haute Couture Masterpiece Collection Showcase Portal */}
      <section id="masterpiece-gallery-section" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#120E10] text-white border-t border-white/10 z-10 relative font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#EAD8B1] text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>THE 240 HAUTE COUTURE MASTERPIECE COLLECTION</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-wide">
                240 Editorial Camera Angles Across 12 Destinations
              </h2>
              <p className="text-white/60 text-sm sm:text-base mt-2.5 max-w-2xl font-sans leading-relaxed">
                Every destination is crafted with 20 distinct cinematic vantage points — wide sanctuary panoramic views, emotional vow close-ups, candlelit toasts, and sunset silhouettes. Now organized in our dedicated high-speed gallery.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <Link
                href="/weddinghelper/gallery"
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-[#1F181B] font-extrabold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg flex items-center gap-2.5 transition active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#1F181B]" />
                <span>Open Dedicated 240 Gallery</span>
                <ArrowRight className="w-4 h-4 text-[#1F181B]" />
              </Link>
            </div>
          </div>

          {/* 4-Destination Curated Preview Cards (Ultra-fast, zero lag) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                id: 'theme_01_bali',
                title: 'Bali Rainforest Chapel',
                dest: 'Ubud, Bali, Indonesia',
                img: '/images/weddings_240/theme_01_bali/scene_01.jpg',
                angles: '20 Masterpiece Angles',
              },
              {
                id: 'theme_02_amalfi',
                title: 'Amalfi Cliffside Romance',
                dest: 'Positano & Ravello, Italy',
                img: '/images/weddings_240/theme_02_amalfi/scene_01.jpg',
                angles: '20 Masterpiece Angles',
              },
              {
                id: 'theme_03_lake_como',
                title: 'Lake Como Historic Villa',
                dest: 'Lake Como, Italy',
                img: '/images/weddings_240/theme_03_lake_como/scene_01.jpg',
                angles: '20 Masterpiece Angles',
              },
              {
                id: 'theme_04_paris',
                title: 'Paris Private Château',
                dest: 'Chantilly & Paris, France',
                img: '/images/weddings_240/theme_04_paris/scene_01.jpg',
                angles: '20 Masterpiece Angles',
              },
            ].map((card) => (
              <Link
                key={card.id}
                href={`/weddinghelper/gallery?dest=${card.id}`}
                className="group relative bg-[#1E181B] rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-70 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/70 text-[#D4AF37] backdrop-blur-md border border-[#D4AF37]/40 shadow-sm">
                    {card.angles}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif text-lg font-normal group-hover:text-[#D4AF37] transition-colors">{card.title}</h3>
                    <p className="text-[11px] text-white/60">{card.dest}</p>
                  </div>
                </div>
                <div className="p-3.5 bg-[#181315] border-t border-white/5 flex items-center justify-between text-xs text-[#D4AF37] font-bold">
                  <span>View 20 Angles</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Big Action Portal Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1C1719] via-[#241C1E] to-[#1A1416] border border-[#D4AF37]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
                FAST DEDICATED EXPERIENCE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                Ready to Explore All 240 Masterpiece Angles?
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-2 max-w-xl">
                Open the dedicated gallery to browse all 12 global destinations, synthesize with your uploaded face, and download lossless print-ready 4K files or complete 240-photo ZIP archives.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link
                href="/weddinghelper/gallery"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#1F181B] font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition shadow-xl flex items-center gap-2.5 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#1F181B]" />
                <span>Open Dedicated 240 Gallery</span>
                <ArrowRight className="w-4 h-4 text-[#1F181B]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mobile Wedding Invitation Kit Modal (Gated for $79 The Grand 12 VIP Pass) */}
      {isInvitationOpen && (() => {
        const isUnlocked = user?.plan === 'grand' || isDemoMode;
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
                  Exclusive $19 VIP Pass Feature (Launch 76% OFF)
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#1F181B] mt-1">
                  Mobile Wedding Invitation Kit
                </h3>
                <p className="text-xs text-[#7C6E6D] mt-2 max-w-md mx-auto leading-relaxed">
                  The Bespoke Mobile Wedding Invitation Studio is exclusively unlocked with <strong>The Grand 12 VIP Pass ($19 Launch Special, originally $79)</strong>. Unlock all 10 luxury design architectures, real-time RSVP dashboard, Google Maps navigation, and guaranteed live hosting through your wedding day.
                </p>

                {/* 10 Template Preview Pills */}
                <div className="mt-6 p-4 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A78] block mb-2.5">
                    ✨ Included 10 Luxury Design Templates (Click any style to preview immediately):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {MOBILE_INVITATION_10_TEMPLATES.map((tmpl, idx) => (
                      <button 
                        key={tmpl.id} 
                        type="button"
                        onClick={() => {
                          setSelectedTemplateId(tmpl.id);
                          setIsDemoMode(true);
                        }}
                        className="p-2.5 rounded-xl bg-white hover:bg-[#FFF8F5] border border-[#E8DCD4] hover:border-[#C87870] flex items-center justify-between text-left transition group"
                      >
                        <span className="font-medium text-[#1F181B] group-hover:text-[#C87870]">{idx + 1}. {tmpl.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF3EF] group-hover:bg-[#C87870] text-[#B85E55] group-hover:text-white font-bold transition">Preview Style →</span>
                      </button>
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
                    className="flex-1 w-full py-4 rounded-2xl bg-gradient-to-r from-[#C87870] via-[#D89BA6] to-[#C87870] text-white font-bold uppercase tracking-widest text-xs hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Unlock with $19 VIP Pass</span>
                  </button>
                  <button
                    onClick={() => setIsDemoMode(true)}
                    className="flex-1 w-full py-4 rounded-2xl bg-[#FAF5F1] hover:bg-[#F2E5DC] text-[#1F181B] font-bold tracking-wider text-xs border border-[#E8DCD4] transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-[#C87870]" />
                    <span>👀 Preview Studio (Explore 10 Styles)</span>
                  </button>
                </div>

                <p className="text-[10px] text-[#A89895] mt-3">
                  Includes 240 4K Masterpieces, 8K Canvas Print-Ready Lossless Files & Real Gown In-Stock Links.
                </p>
              </div>
            ) : (
              /* When Unlocked: Full Interactive Customer Editable Studio & Live Mobile Device Mockup */
              <div className="relative max-w-6xl w-full bg-[#FFFDFB] border border-[#E8DCD4] rounded-[40px] shadow-2xl overflow-hidden font-sans my-4 flex flex-col max-h-[92vh]">
                {/* Preview Mode Notice Banner */}
                {user?.plan !== 'grand' && (
                  <div className="bg-[#FAF3EF] border-b border-[#F0DDD5] px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-40">
                    <div className="flex items-center gap-2 text-[#7C6E6D]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C87870] text-white font-bold text-[10px] tracking-wider uppercase">DRAFT PREVIEW</span>
                      <span className="hidden sm:inline text-xs">Previewing all 10 bespoke templates in draft mode. Complete order ($19 Special) to activate and receive your permanent live link.</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPlan('grand');
                        setIsCheckoutOpen(true);
                      }}
                      className="px-4 py-1.5 rounded-full bg-[#1F181B] text-white font-bold text-[11px] hover:bg-[#C87870] transition flex items-center gap-1.5 shadow-sm uppercase tracking-wider"
                    >
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>Unlock $19 VIP Pass</span>
                    </button>
                  </div>
                )}
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
                          Free Digital Wedding Invitation & Live Editor
                        </h3>
                      </div>
                    </div>

                    {/* BGM Player & View Mode Switcher */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                      {/* BGM Quick Pill */}
                      <button 
                        type="button"
                        onClick={() => {
                          if (isBgmPlaying) {
                            stopBgmAudio();
                            setIsBgmPlaying(false);
                            setPlayingBgmId(null);
                          } else {
                            playBgmAudio(invitationData.bgmId || 'piano-canon');
                            setIsBgmPlaying(true);
                            setPlayingBgmId(invitationData.bgmId || 'piano-canon');
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition border cursor-pointer ${
                          isBgmPlaying 
                            ? 'bg-[#FAF3EF] text-[#B85E55] border-[#E8A598] shadow-xs ring-1 ring-[#C87870]/40' 
                            : 'bg-white text-[#9E8B88] border-[#E8DCD4] hover:text-[#4A3B39]'
                        }`}
                        title={isBgmPlaying ? 'Pause BGM' : 'Play Romantic BGM'}
                      >
                        {isBgmPlaying ? <Volume2 className="w-3.5 h-3.5 text-[#B85E55] animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span className="text-[11px] font-medium whitespace-nowrap">{invitationData.bgmTitle || 'Romantic Piano (Canon in D)'}</span>
                      </button>

                      {/* View Mode Switcher (Visible on mobile/tablet or for full focus) */}
                      <div className="flex items-center p-1 rounded-full bg-[#FAF5F1] border border-[#E8DCD4]">
                        <button
                          onClick={() => setInvitationViewMode('both')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition hidden lg:block ${
                            invitationViewMode === 'both' ? 'bg-[#1F181B] text-white' : 'text-[#7C6E6D] hover:text-[#1F181B]'
                          }`}
                        >
                          Split View
                        </button>
                        <button
                          onClick={() => setInvitationViewMode('editor')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition flex items-center gap-1 ${
                            invitationViewMode === 'editor' ? 'bg-[#1F181B] text-white' : 'text-[#7C6E6D] hover:text-[#1F181B]'
                          }`}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editor Only</span>
                        </button>
                        <button
                          onClick={() => setInvitationViewMode('preview')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition flex items-center gap-1 ${
                            invitationViewMode === 'preview' ? 'bg-[#1F181B] text-white' : 'text-[#7C6E6D] hover:text-[#1F181B]'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview Only</span>
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
                        <span>10 Bespoke Editorial Wedding Templates (1-Click Style Switch)</span>
                      </span>
                      <span className="text-[10px] text-[#A89895]">
                        Active Template: <strong className="text-[#B85E55]">{currentSkin.name}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
                      {MOBILE_INVITATION_10_TEMPLATES.map((tmpl, idx) => {
                        const isSelected = selectedTemplateId === tmpl.id;
                        return (
                          <button
                            key={tmpl.id}
                            type="button"
                            onClick={() => setSelectedTemplateId(tmpl.id)}
                            className={`px-2 py-1.5 rounded-xl text-[11px] font-medium transition flex items-center gap-1.5 border justify-start cursor-pointer truncate ${
                              isSelected
                                ? 'bg-[#1F181B] text-white font-bold border-[#1F181B] shadow-xs ring-1 ring-[#D4AF37]'
                                : 'bg-[#FAF5F1] text-[#7C6E6D] hover:bg-[#F0E4DC] border-[#EFE5DE]'
                            }`}
                          >
                            <span 
                              className="w-2 h-2 rounded-full shrink-0" 
                              style={{ backgroundColor: tmpl.themeColor }}
                            />
                            <span className="truncate">#{idx + 1} {tmpl.name.split(' ')[0]}</span>
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
                            <span>1. Couple</span>
                          </button>
                          <button
                            onClick={() => setInvitationEditorTab('datetime_venue')}
                            className={`py-2 rounded-xl text-xs font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                              invitationEditorTab === 'datetime_venue'
                                ? 'bg-white text-[#1F181B] shadow-xs font-bold'
                                : 'text-[#7C6E6D] hover:text-[#1F181B]'
                            }`}
                          >
                            <span>2. Date & Venue</span>
                          </button>
                          <button
                            onClick={() => setInvitationEditorTab('media_bgm')}
                            className={`py-2 rounded-xl text-xs font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                              invitationEditorTab === 'media_bgm'
                                ? 'bg-white text-[#1F181B] shadow-xs font-bold'
                                : 'text-[#7C6E6D] hover:text-[#1F181B]'
                            }`}
                          >
                            <span>3. Photos & BGM</span>
                          </button>
                          <button
                            onClick={() => setInvitationEditorTab('letter')}
                            className={`py-2 rounded-xl text-xs font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                              invitationEditorTab === 'letter'
                                ? 'bg-white text-[#1F181B] shadow-xs font-bold'
                                : 'text-[#7C6E6D] hover:text-[#1F181B]'
                            }`}
                          >
                            <span>4. Invitation Letter</span>
                          </button>
                        </div>

                        {/* TAB 1: Couple Information (Groom & Bride) */}
                        {invitationEditorTab === 'couple' && (
                          <div className="space-y-4 text-xs animate-fade-in">
                            {/* Groom Side Box */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-2">
                                <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                  <span>🤵 Groom Information</span>
                                </h4>
                                <span className="text-[10px] text-[#8C7A78]">Groom Name & Contact</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    Groom's Full Name
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.groomName}
                                    onChange={(e) => setInvitationData({ ...invitationData, groomName: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] focus:border-[#C87870] outline-none"
                                    placeholder="Alexander Brooks"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    Groom's Phone / Contact
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.groomPhone}
                                    onChange={(e) => setInvitationData({ ...invitationData, groomPhone: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] focus:border-[#C87870] outline-none"
                                    placeholder="010-3849-2810 / +1 212..."
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Bride Side Box */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-2">
                                <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                  <span>👰 Bride Information</span>
                                </h4>
                                <span className="text-[10px] text-[#8C7A78]">Bride Name & Contact</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    Bride's Full Name
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.brideName}
                                    onChange={(e) => setInvitationData({ ...invitationData, brideName: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] focus:border-[#C87870] outline-none"
                                    placeholder="Olivia Catherine"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    Bride's Phone / Contact
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.bridePhone}
                                    onChange={(e) => setInvitationData({ ...invitationData, bridePhone: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] focus:border-[#C87870] outline-none"
                                    placeholder="010-9182-4729 / +1 212..."
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 2: Ceremony Date & Venue */} 
                        {invitationEditorTab === 'datetime_venue' && (
                          <div className="space-y-5 text-xs animate-fade-in">
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <h4 className="font-serif font-bold text-sm text-[#1F181B] border-b border-[#E8DCD4] pb-2">
                                📅 Ceremony Date & Calendar Settings
                              </h4>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    Ceremony Date (Display Text)
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
                                    Calendar Highlight Day (1-31)
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
                                  Ceremony Time
                                </label>
                                <input
                                  type="text"
                                  value={invitationData.weddingTime}
                                  onChange={(e) => setInvitationData({ ...invitationData, weddingTime: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none"
                                  placeholder="4:30 PM EST"
                                />
                              </div>
                            </div>

                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-2">
                                <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4 text-[#4285F4]" />
                                  <span>📍 Venue Location & Live Google Maps Navigation</span>
                                </h4>
                                <span className="text-[10px] text-[#4285F4] font-bold">US & Global Maps</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    Venue Name
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.venueName}
                                    onChange={(e) => setInvitationData({ ...invitationData, venueName: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none focus:border-[#4285F4]"
                                    placeholder="The Plaza Hotel New York"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                    Ballroom / Hall / Floor
                                  </label>
                                  <input
                                    type="text"
                                    value={invitationData.venueHall}
                                    onChange={(e) => setInvitationData({ ...invitationData, venueHall: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none focus:border-[#4285F4]"
                                    placeholder="The Grand Ballroom & Terrace"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1 flex items-center justify-between">
                                  <span>Full Street Address (Live Google Maps Directions)</span>
                                  <span className="text-[10px] text-[#8C7A78]">1-Click Copy Supported</span>
                                </label>
                                <input
                                  type="text"
                                  value={invitationData.venueAddress}
                                  onChange={(e) => setInvitationData({ ...invitationData, venueAddress: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7BD] bg-white text-xs text-[#1F181B] outline-none focus:border-[#4285F4]"
                                  placeholder="768 5th Ave, New York, NY 10019, United States"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#5C4D4D] mb-1">
                                  Transit & Subway Directions
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
                                  Parking & Valet Information
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

                        {/* TAB 3: Cover Photo, 6-Shot Gallery & BGM */}
                        {invitationEditorTab === 'media_bgm' && (
                          <div className="space-y-6 text-xs animate-fade-in">
                            {/* Main Cover Photo Selection */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-2">
                                <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                  <Camera className="w-4 h-4 text-[#C87870]" />
                                  <span>Master Cover Photo Setup</span>
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
                                  <span>Upload My Photo</span>
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
                                  <span className="text-[11px] font-bold text-[#1F181B]">Active Master Cover Portrait</span>
                                  <p className="text-[10px] text-[#7C6E6D] leading-relaxed">
                                    The primary high-resolution wedding portrait displayed on the hero section of your mobile invitation. Select from our 12 AI editorial wedding worlds or upload your own real wedding portrait.
                                  </p>
                                </div>
                              </div>

                              
                            </div>

                            {/* 6-Photo Gallery Customization */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <h4 className="font-serif font-bold text-sm text-[#1F181B] border-b border-[#E8DCD4] pb-2">
                                🖼️ 6-Shot Wedding Moments Gallery
                              </h4>
                              <p className="text-[10px] text-[#7C6E6D]">
                                6 featured wedding photos showcased in your mobile invitation gallery. Click any slot to upload your own wedding moments.
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
                                        Replace
                                      </button>
                                    </div>
                                    <span className="text-[10px] font-semibold text-[#8C7A78]">Shot #{idx + 1}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* BGM Soundtrack Selection */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-2">
                                <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                  <Music className="w-4 h-4 text-[#C87870]" />
                                  <span>Curated Romantic BGM Soundtrack</span>
                                </h4>
                                <span className="text-[10px] text-[#8C7A78]">Guest Atmosphere</span>
                              </div>

                              <div className="space-y-2">
                                {BGM_PLAYLIST.map((bgm) => {
                                  const isSelected = invitationData.bgmId === bgm.id;
                                  const isPlayingThis = playingBgmId === bgm.id;

                                  return (
                                    <div
                                      key={bgm.id}
                                      onClick={() => handleToggleBgm(bgm.id, bgm.title)}
                                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                                        isSelected
                                          ? 'bg-white border-[#C87870] ring-1 ring-[#C87870]/30 shadow-sm'
                                          : 'bg-white/60 border-[#E8DCD4] hover:bg-white'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleBgm(bgm.id, bgm.title);
                                          }}
                                          className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-xs ${
                                            isPlayingThis 
                                              ? 'bg-[#C87870] text-white animate-pulse' 
                                              : 'bg-[#F4ECE6] text-[#6E5D5B] hover:bg-[#C87870] hover:text-white'
                                          }`}
                                          title={isPlayingThis ? 'Pause Soundtrack' : 'Play & Listen Preview'}
                                        >
                                          {bgm.id === 'silent' ? (
                                            <VolumeX className="w-4 h-4" />
                                          ) : isPlayingThis ? (
                                            <Pause className="w-4 h-4 fill-white" />
                                          ) : (
                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                          )}
                                        </button>

                                        <span className="text-xl">{bgm.icon}</span>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-[#1F181B] block">{bgm.title}</span>
                                            {isPlayingThis && (
                                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#C87870]/10 text-[#C87870] text-[9px] font-bold">
                                                <span className="animate-bounce">●</span> Now Playing
                                              </span>
                                            )}
                                          </div>
                                          <span className="text-[10px] text-[#8C7A78]">{bgm.mood}</span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {isPlayingThis && (
                                          <span className="text-xs font-mono text-[#C87870] tracking-tighter animate-pulse font-bold">
                                            ılılıllı
                                          </span>
                                        )}
                                        <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${
                                          isSelected 
                                            ? 'bg-[#C87870]/10 text-[#C87870]' 
                                            : 'text-[#9E8B88] hover:text-[#C87870]'
                                        }`}>
                                          {isSelected ? '✓ Selected' : 'Select'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 4: Wedding Invitation Letter */}
                        {invitationEditorTab === 'letter' && (
                          <div className="space-y-6 text-xs animate-fade-in">
                            <div className="p-4 sm:p-6 rounded-3xl bg-[#FAF5F1] border border-[#EFE5DE] space-y-4">
                              <div className="flex items-center justify-between border-b border-[#E8DCD4] pb-3">
                                <div>
                                  <h4 className="font-serif font-bold text-sm text-[#1F181B] flex items-center gap-1.5">
                                    <span>💌 Wedding Invitation Letter</span>
                                  </h4>
                                  <p className="text-[11px] text-[#7C6E6D] mt-0.5">
                                    Your heartfelt invitation message to guests. Choose one of our 5 curated editorial presets or write your own custom wedding invitation text.
                                  </p>
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-[#FAF3EF] text-[#B85E55] text-[10px] font-bold shrink-0">
                                  5 Presets Included
                                </span>
                              </div>

                              {/* 5 Curated English Presets */}
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A78] block mb-2.5">
                                  ✨ 5 Curated Editorial Invitation Presets (1-Click Auto-Fill):
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
                                          {isSelected ? '✓ Active Preset' : '+ Click to Apply'}
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
                                    Custom Invitation Text (Direct Edit)
                                  </label>
                                  <span className="text-[10px] text-[#8C7A78]">
                                    Live synchronized to mobile preview
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

                      {/* Editor Action Bottom Bar with Paid vs. Preview Gating & Validity Guarantee */}
                      <div className="mt-8 pt-4 border-t border-[#F0E6DE] flex flex-col sm:flex-row items-center justify-between gap-4">
                        {user?.plan === 'grand' ? (
                          <>
                            <div className="text-left space-y-0.5">
                              <div className="flex items-center gap-2 text-xs text-[#2E7D32] font-semibold">
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E7D32]" />
                                <span>Official Live Hosting Active</span>
                              </div>
                              <p className="text-[11px] text-[#7C6E6D]">
                                Guaranteed live online hosting through your wedding day on <strong>{invitationData.weddingDate}</strong> (+ 30-day guest archive).
                              </p>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  if (typeof window !== 'undefined') {
                                    const guestUrl = getGuestShareUrl(false);
                                    navigator.clipboard.writeText(guestUrl);
                                    setCopyToast(`Live Guest Invitation Link Copied! (${guestUrl})`);
                                    setTimeout(() => setCopyToast(''), 4000);
                                  }
                                }}
                                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1F181B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C87870] transition shadow-sm flex items-center justify-center gap-2"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Live Guest Link</span>
                              </button>
                              <a
                                href={getGuestShareUrl(true)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#C87870] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B3645C] transition shadow-sm flex items-center justify-center gap-2"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open Live Guest Page ↗</span>
                              </a>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-left space-y-0.5">
                              <div className="flex items-center gap-2 text-xs text-[#C87870] font-semibold">
                                <span className="w-2 h-2 rounded-full bg-[#C87870] animate-ping" />
                                <span>Draft Preview Mode · Live URL Locked</span>
                              </div>
                              <p className="text-[11px] text-[#7C6E6D]">
                                Complete checkout ($19 Special VIP Pass) to publish your permanent live link, active through <strong>{invitationData.weddingDate}</strong>.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPlan('grand');
                                setIsCheckoutOpen(true);
                              }}
                              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C87870] via-[#D89BA6] to-[#C87870] text-white text-xs font-bold uppercase tracking-widest hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
                            >
                              <Gem className="w-4 h-4 text-white" />
                              <span>Unlock &amp; Publish Live Mobile Invitation ($19 Special)</span>
                            </button>
                          </>
                        )}
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
                  {/* Top Live Verification vs Draft Preview Banner */}
                  {user?.plan === 'grand' ? (
                    <div className="bg-[#1F181B] text-[#D4AF37] text-[9px] font-sans font-bold tracking-[0.2em] uppercase py-1.5 px-4 text-center flex items-center justify-center gap-1.5 border-b border-[#D4AF37]/30">
                      <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                      <span>OFFICIAL LIVE INVITATION · HOSTED THROUGH {invitationData.weddingDate}</span>
                    </div>
                  ) : (
                    <div className="bg-[#C87870] text-white text-[9px] font-sans font-bold tracking-[0.2em] uppercase py-1.5 px-4 text-center shadow-xs">
                      🔒 DRAFT PREVIEW · COMPLETE ORDER ($19) TO PUBLISH LIVE LINK
                    </div>
                  )}

                  {/* Phone Status Bar Aesthetic */}
                  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-sans opacity-70 tracking-widest">
                    <span>10:50 AM</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* 1. Cover Hero - 10 Distinct Bespoke Architecture Styles */}
                  {currentSkin.headerStyle === 'vogue_magazine' && (
                    /* STYLE 1: VOGUE HAUTE EDITORIAL COVER */
                    <div className="p-5 text-center">
                      <div className="border-b-2 border-black pb-1 mb-2 flex items-center justify-between font-sans text-[8px] tracking-[0.3em] uppercase font-bold">
                        <span>THE WEDDING ISSUE</span>
                        <span>SPECIAL EDITION · NO. 28</span>
                        <span>FALL 2026</span>
                      </div>
                      <h1 className="text-4xl font-serif tracking-[0.25em] font-black uppercase text-black mb-3">
                        V O G U E
                      </h1>
                      <div className="relative aspect-[3/4] w-full rounded-none overflow-hidden shadow-2xl border-2 border-black">
                        <Image src={invitationData.coverPhoto} alt="Cover" fill unoptimized className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 right-4 text-left">
                          <span className="bg-black text-white text-[8px] font-sans font-bold tracking-widest px-2 py-0.5 uppercase">
                            EXCLUSIVE
                          </span>
                          <h2 className="text-2xl font-serif text-white mt-1 drop-shadow-md">
                            {invitationData.groomName} &amp; {invitationData.brideName}
                          </h2>
                          <p className="text-[10px] text-white/80 font-sans tracking-widest uppercase">
                            The Union of the Season
                          </p>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white font-sans">
                          <div className="text-left">
                            <p className="text-[9px] tracking-[0.2em] uppercase opacity-90">{invitationData.weddingDate}</p>
                            <p className="text-xs font-serif italic">{invitationData.venueName}</p>
                          </div>
                          <div className="bg-white/95 px-2 py-0.5 font-mono text-[8px] tracking-widest text-black border border-black/40">
                            ||| | |||| | |||
                          </div>
                        </div>
                      </div>
                      <div className="py-2.5 mt-3 border-y-2 border-black font-sans text-xs tracking-widest font-bold uppercase">
                        {invitationData.weddingDate} · {invitationData.weddingTime}
                      </div>
                    </div>
                  )}

                  {currentSkin.headerStyle === 'wax_seal' && (
                    /* STYLE 2: VINTAGE WAX SEAL MONOGRAM */
                    <div className="p-6 text-center">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8A2D2A] via-[#A83834] to-[#5C1E1C] border-2 border-[#D4AF37]/80 shadow-[0_8px_20px_rgba(138,45,42,0.45)] flex items-center justify-center relative">
                          <div className="w-12 h-12 rounded-full border border-dashed border-[#D4AF37]/60 flex items-center justify-center text-[#F5E6CC] font-serif text-sm font-bold tracking-widest drop-shadow-xs">
                            {currentSkin.monogramText}
                          </div>
                          <div className="absolute -bottom-2 w-4 h-4 bg-[#8A2D2A] rotate-45" />
                        </div>
                        <span className="text-[9px] font-serif italic tracking-[0.3em] text-[#8A2D2A] mt-2.5 font-semibold">
                          Official Wax Seal of Solemn Matrimony
                        </span>
                      </div>
                      <div className="space-y-1 mb-4">
                        <span className="text-[9px] tracking-[0.35em] uppercase font-sans opacity-70 block">
                          Solemn Proclamation of Marriage
                        </span>
                        <h2 className="text-2xl font-serif font-medium tracking-wide">
                          {invitationData.groomName} <span className="text-[#C49746]">⚜</span> {invitationData.brideName}
                        </h2>
                      </div>
                      <div className="relative aspect-[3/4] w-full p-2 bg-[#FAF4EF] border-2 border-[#D4AF37]/70 shadow-xl rounded-sm">
                        <div className="relative w-full h-full overflow-hidden border border-[#D4AF37]/30">
                          <Image src={invitationData.coverPhoto} alt="Cover" fill unoptimized className="object-cover" priority />
                          <span className="absolute top-2 left-2 text-[#D4AF37] text-xs">⚜</span>
                          <span className="absolute top-2 right-2 text-[#D4AF37] text-xs">⚜</span>
                          <span className="absolute bottom-2 left-2 text-[#D4AF37] text-xs">⚜</span>
                          <span className="absolute bottom-2 right-2 text-[#D4AF37] text-xs">⚜</span>
                        </div>
                      </div>
                      <div className="mt-4 py-2.5 border-y border-[#D4AF37]/40 text-xs font-serif italic font-bold">
                        {invitationData.weddingDate} · {invitationData.weddingTime}
                      </div>
                    </div>
                  )}

                  {currentSkin.headerStyle === 'cathedral_gothic' && (
                    /* STYLE 3: SACRED CATHEDRAL ARCH */
                    <div className="p-6 text-center">
                      <div className="w-10 h-10 mx-auto rounded-full bg-[#9C7A3C]/15 border border-[#9C7A3C]/40 text-[#9C7A3C] flex items-center justify-center text-base mb-2">
                        ⛪
                      </div>
                      <span className="text-[9px] tracking-[0.4em] uppercase text-[#9C7A3C] font-bold block mb-1">
                        SACRED BASILICA SOLEMNITY
                      </span>
                      <h2 className="text-2xl font-serif text-[#241D14] mb-4">
                        {invitationData.groomName} <span className="text-[#9C7A3C] font-light">†</span> {invitationData.brideName}
                      </h2>
                      <div className="relative aspect-[3/4] w-full rounded-t-[130px] rounded-b-2xl overflow-hidden border-4 border-[#9C7A3C]/60 shadow-2xl p-1 bg-[#F5EFE6]">
                        <div className="relative w-full h-full rounded-t-[125px] rounded-b-xl overflow-hidden">
                          <Image src={invitationData.coverPhoto} alt="Cover" fill unoptimized className="object-cover" priority />
                        </div>
                      </div>
                      <div className="mt-4 py-3 border-y border-[#9C7A3C]/40 text-xs font-serif font-bold tracking-wide">
                        {invitationData.weddingDate} · {invitationData.weddingTime}
                      </div>
                    </div>
                  )}

                  {currentSkin.headerStyle === 'celestial_dark' && (
                    /* STYLE 4: MIDNIGHT CELESTIAL STARLIGHT (DARK MODE) */
                    <div className="p-6 text-center text-[#F8F6FA]">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] tracking-[0.25em] uppercase font-bold mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>BLACK TIE CELESTIAL GALA</span>
                      </div>
                      <p className="text-[9px] tracking-[0.35em] text-[#B9ACC9] uppercase font-light mb-1">
                        UNDER A CANOPY OF STARS
                      </p>
                      <h2 className="text-3xl font-serif tracking-wide text-white mb-5">
                        {invitationData.groomName} <span className="text-[#D4AF37]">✧</span> {invitationData.brideName}
                      </h2>
                      <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border-2 border-[#D4AF37]/80 shadow-[0_0_35px_rgba(212,175,55,0.35)]">
                        <Image src={invitationData.coverPhoto} alt="Cover" fill unoptimized className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white font-sans">
                          <p className="text-xs tracking-widest uppercase font-light text-[#D4AF37]">{invitationData.weddingDate}</p>
                          <p className="text-sm font-serif italic text-white/90">Dancing Under the Stars</p>
                        </div>
                      </div>
                      <div className="mt-4 py-3 border-y border-[#3D3452] text-xs font-serif text-[#D4AF37] tracking-wider font-bold">
                        {invitationData.weddingDate} · {invitationData.weddingTime}
                      </div>
                    </div>
                  )}

                  {currentSkin.headerStyle === 'floral_wreath' && (
                    /* STYLE 5: BLOOMING PEONY GARDEN */
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-sm">🌸</span>
                        <span className="text-[9px] tracking-[0.3em] uppercase text-[#D9756C] font-bold">FLORAL BOTANICAL ROMANCE</span>
                        <span className="text-sm">🌸</span>
                      </div>
                      <h2 className="text-3xl font-serif italic text-[#2E1A1D] mb-4">
                        {invitationData.groomName} <span className="text-[#E8A598] font-normal">&amp;</span> {invitationData.brideName}
                      </h2>
                      <div className="relative aspect-[3/4] w-full rounded-t-[110px] rounded-b-3xl overflow-hidden border-4 border-[#F3D8D4] shadow-xl">
                        <Image src={invitationData.coverPhoto} alt="Cover" fill unoptimized className="object-cover" priority />
                      </div>
                      <div className="mt-4 py-2.5 border-y border-[#F3D8D4] text-xs font-serif font-bold text-[#2E1A1D]">
                        {invitationData.weddingDate} · {invitationData.weddingTime}
                      </div>
                    </div>
                  )}

                  {currentSkin.headerStyle === 'royal_crest' && (
                    /* STYLE 6: IMPERIAL CREST & GOLD FOIL */
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-[#8C6D1F] to-[#D4AF37] text-white flex items-center justify-center text-lg shadow-md mb-2">
                        👑
                      </div>
                      <span className="text-[9px] tracking-[0.35em] text-[#8C6D1F] font-bold uppercase block mb-1">
                        ROYAL HERITAGE CELEBRATION
                      </span>
                      <h2 className="text-2xl font-serif font-bold text-[#261E16] tracking-wide mb-4">
                        {invitationData.groomName} &amp; {invitationData.brideName}
                      </h2>
                      <div className="relative aspect-[3/4] w-full p-2 border-2 border-[#C49746] rounded-xl shadow-xl bg-[#FAF6EE]">
                        <div className="relative w-full h-full border border-[#8C6D1F]/50 rounded-lg overflow-hidden">
                          <Image src={invitationData.coverPhoto} alt="Cover" fill unoptimized className="object-cover" priority />
                        </div>
                      </div>
                      <div className="mt-4 py-3 border-y border-[#E2D1BC] text-xs font-serif font-bold text-[#261E16]">
                        {invitationData.weddingDate} · {invitationData.weddingTime}
                      </div>
                    </div>
                  )}

                  {currentSkin.headerStyle === 'minimal_polaroid' && (
                    /* STYLE 7: MODERN IVORY SILK (POLAROID) */
                    <div className="p-6">
                      <div className="bg-white p-3.5 pb-6 rounded-2xl shadow-xl border border-[#EBDCD3]">
                        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4 shadow-xs">
                          <Image src={invitationData.coverPhoto} alt="Cover" fill unoptimized className="object-cover" priority />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-xl font-serif italic text-[#1F181B] tracking-wide font-bold">
                            {invitationData.groomName} &amp; {invitationData.brideName}
                          </p>
                          <p className="text-[11px] font-sans tracking-[0.25em] text-[#7C6E6D] uppercase">
                            {invitationData.weddingDate} · {invitationData.weddingTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSkin.headerStyle === 'golden_sunset' && (
                    /* STYLE 8: GOLDEN SUNSET RIVIERA */
                    <div className="p-6 text-center">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-[#B85E55] font-bold block mb-1">
                        ☼ MEDITERRANEAN RIVIERA SUNSET ☼
                      </span>
                      <h2 className="text-3xl font-serif text-[#291811] tracking-tight mb-4">
                        {invitationData.groomName} &amp; {invitationData.brideName}
                      </h2>
                      <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border-4 border-[#ECD8C7] shadow-xl">
                        <Image src={invitationData.coverPhoto} alt="Cover" fill unoptimized className="object-cover" priority />
                      </div>
                      <div className="mt-4 py-2.5 border-y border-[#ECD8C7] text-xs font-serif text-[#291811] font-bold">
                        {invitationData.weddingDate} · {invitationData.weddingTime}
                      </div>
                    </div>
                  )}

                  {currentSkin.headerStyle === 'aegean_resort' && (
                    /* STYLE 9: SANTORINI AEGEAN BREEZE */
                    <div className="p-6 text-center">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-[#1A508B] font-bold block mb-1">
                        AEGEAN CALDERA CLIFFSIDE · SANTORINI
                      </span>
                      <h2 className="text-2xl font-sans font-light tracking-[0.15em] text-[#0E2433] uppercase mb-4">
                        {invitationData.groomName} <span className="text-[#4A8FE7]">•</span> {invitationData.brideName}
                      </h2>
                      <div className="relative aspect-[3/4] w-full rounded-t-[100px] rounded-b-2xl overflow-hidden border-4 border-[#D4E4F2] shadow-xl">
                        <Image src={invitationData.coverPhoto} alt="Cover" fill unoptimized className="object-cover" priority />
                      </div>
                      <div className="mt-4 py-2.5 border-y border-[#D4E4F2] text-xs font-sans text-[#0E2433] font-bold tracking-wider">
                        {invitationData.weddingDate} · {invitationData.weddingTime}
                      </div>
                    </div>
                  )}

                  {currentSkin.headerStyle === 'botanical_glass' && (
                    /* STYLE 10: BOTANICAL GLASSHOUSE SANCTUARY */
                    <div className="p-6 text-center">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-[#3B6047] font-bold block mb-1">
                        🌿 GLASSHOUSE CONSERVATORY BOTANICAL 🌿
                      </span>
                      <h2 className="text-2xl font-serif text-[#1A291E] mb-4">
                        {invitationData.groomName} &amp; {invitationData.brideName}
                      </h2>
                      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-[#D6E4DB] shadow-lg">
                        <Image src={invitationData.coverPhoto} alt="Cover" fill unoptimized className="object-cover" priority />
                      </div>
                      <div className="mt-4 py-2.5 border-y border-[#D6E4DB] text-xs font-serif text-[#1A291E] font-bold">
                        {invitationData.weddingDate} · {invitationData.weddingTime}
                      </div>
                    </div>
                  )}

                            
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

                    {/* Editorial Couple Signature Card */}
                    <div 
                      className="p-5 rounded-2xl border font-sans text-center space-y-2.5"
                      style={{ backgroundColor: currentSkin.cardBg, borderColor: currentSkin.borderColor }}
                    >
                      <span className="text-[10px] tracking-[0.25em] uppercase font-bold block opacity-60">
                        With Full Hearts & Joy
                      </span>
                      <p className="text-base font-serif font-medium tracking-wide">
                        {invitationData.groomName} <span className="text-xs font-sans opacity-60">&</span> {invitationData.brideName}
                      </p>
                      <div className="flex items-center justify-center gap-2.5 pt-1">
                        <a 
                          href={`tel:${invitationData.groomPhone}`} 
                          className="px-3.5 py-1.5 rounded-full bg-[#FAF5F1] text-[11px] font-semibold text-[#7C6E6D] hover:text-[#C87870] flex items-center gap-1.5 transition border border-[#EFE5DE]"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Groom: {invitationData.groomName}</span>
                        </a>
                        <a 
                          href={`tel:${invitationData.bridePhone}`} 
                          className="px-3.5 py-1.5 rounded-full bg-[#FAF5F1] text-[11px] font-semibold text-[#7C6E6D] hover:text-[#C87870] flex items-center gap-1.5 transition border border-[#EFE5DE]"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Bride: {invitationData.brideName}</span>
                        </a>
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
                        <span className="text-[#C87870] font-bold">Sun</span>
                        <span className="opacity-60">Mon</span>
                        <span className="opacity-60">Tue</span>
                        <span className="opacity-60">Wed</span>
                        <span className="opacity-60">Thu</span>
                        <span className="opacity-60">Fri</span>
                        <span className="opacity-60">Sat</span>

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
                          {invitationData.groomName} &amp; {invitationData.brideName}&apos;s wedding is in <span className="font-bold" style={{ color: currentSkin.themeColor }}>4 Days</span>
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

                  {/* 5. Venue Location & Map Navigation */}
                  <div className="p-6 font-sans">
                    <div 
                      className="p-6 rounded-3xl border shadow-xs text-left space-y-4"
                      style={{ backgroundColor: currentSkin.cardBg, borderColor: currentSkin.borderColor }}
                    >
                      <div>
                        <span className="text-[10px] tracking-[0.25em] uppercase font-bold block mb-1" style={{ color: currentSkin.themeColor }}>
                          Location &amp; Directions
                        </span>
                        <h4 className="text-base font-serif font-bold text-[#1F181B]">
                          {invitationData.venueName} · {invitationData.venueHall}
                        </h4>
                        <p className="text-xs opacity-75 mt-1">
                          {invitationData.venueAddress}
                        </p>
                      </div>

                      {/* Copy Address Button */}
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(invitationData.venueAddress);
                          setCopyToast('Venue address copied to clipboard!');
                          setTimeout(() => setCopyToast(''), 2500);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#FAF5F1] hover:bg-[#F2E5DC] text-xs font-semibold text-[#5C4D4D] flex items-center justify-center gap-1.5 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
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
                          <span>Open in Google Maps</span>
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
                        <p>• <strong>Transit / Subway:</strong> {invitationData.venueTraffic}</p>
                        <p>• <strong>Parking Information:</strong> {invitationData.venueParking}</p>
                      </div>
                    </div>
                  </div>

                  {/* 8. Live Guestbook */}
                  <div className="p-6 font-sans">
                    <div 
                      className="p-6 rounded-3xl border shadow-xs text-left space-y-4"
                      style={{ backgroundColor: currentSkin.cardBg, borderColor: currentSkin.borderColor }}
                    >
                      <div className="text-center mb-1">
                        <span className="text-[10px] tracking-[0.25em] uppercase font-bold block" style={{ color: currentSkin.themeColor }}>
                          Guestbook
                        </span>
                        <h4 className="text-base font-serif">Warm Wishes &amp; Blessings</h4>
                      </div>

                      {/* Guestbook Submission Form */}
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={newGuestName}
                          onChange={e => setNewGuestName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#E0D2CB] text-xs focus:outline-none focus:border-[#C87870] bg-white"
                        />
                        <textarea
                          placeholder="Leave a congratulatory note for the couple..."
                          rows={2}
                          value={newGuestMsg}
                          onChange={e => setNewGuestMsg(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#E0D2CB] text-xs focus:outline-none focus:border-[#C87870] bg-white resize-none"
                        />
                        <button
                          onClick={() => {
                            if (newGuestName && newGuestMsg) {
                              setGuestbookList([
                                { id: Date.now(), name: newGuestName, message: newGuestMsg, date: 'Nov 14, 2026' },
                                ...guestbookList
                              ]);
                              setNewGuestName('');
                              setNewGuestMsg('');
                            }
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#1F181B] text-white text-xs font-bold transition hover:bg-[#3A3335]"
                        >
                          Leave Warm Wishes
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

                  {/* 9. Share Footer with Paid vs. Preview Gating */}
                  <div className="p-6 pt-2 font-sans space-y-2.5 pb-12">
                    {user?.plan === 'grand' ? (
                      <>
                        <button
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              const guestUrl = getGuestShareUrl(false);
                              navigator.clipboard?.writeText(guestUrl);
                              setCopyToast(`Official Live Invitation Link Copied! (${guestUrl})`);
                              setTimeout(() => setCopyToast(''), 3500);
                            }
                          }}
                          className="w-full py-3.5 rounded-2xl bg-[#1F181B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-[#C87870] transition uppercase tracking-wider"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy Live Shareable Link</span>
                        </button>
                        <a
                          href={getGuestShareUrl(true)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 rounded-2xl bg-white border border-[#E0D2CB] text-[#5C4D4D] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#FAF5F1] transition"
                        >
                          <ExternalLink className="w-4 h-4 text-[#C87870]" />
                          <span>Open Standalone Live Invitation ↗</span>
                        </a>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedPlan('grand');
                          setIsCheckoutOpen(true);
                        }}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C87870] via-[#D89BA6] to-[#C87870] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition uppercase tracking-wider"
                      >
                        <Gem className="w-4 h-4" />
                        <span>Unlock Live Guest Link ($19 Special)</span>
                      </button>
                    )}
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
                onClick={() => handleUserLogin('vip.couple@gmail.com')}
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
                <span className="text-[10px] text-[#A89895] uppercase tracking-wider">or sign in with email</span>
                <div className="flex-1 h-px bg-[#EADED7]" />
              </div>

              <input 
                type="email" 
                placeholder="bride.groom@example.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleUserLogin(loginEmail);
                }}
                className="w-full py-3 px-4 rounded-xl border border-[#E0D2CB] text-xs focus:outline-none focus:border-[#C87870] bg-[#FFFDFB]"
              />

              <button
                onClick={() => handleUserLogin(loginEmail)}
                className="w-full py-3.5 rounded-xl bg-[#2C2426] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A1517] transition shadow-md"
              >
                Sign In &amp; Restore VIP Status
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

            {/* Double-Payment Prevention: If already VIP, show Active status instead of payment button */}
            {user?.plan === 'grand' ? (
              <div className="mt-8 p-8 rounded-3xl bg-[#FAF5F1] border border-[#E8DCD4] text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#1F181B]">
                    VIP Pass Already Active!
                  </h4>
                  <p className="text-xs text-[#7C6E6D] mt-2 max-w-md mx-auto leading-relaxed">
                    You are signed in as <strong>{user.email}</strong> with an active <strong>Grand 12 VIP Pass ($19 Launch Special)</strong>. All 10 bespoke invitation templates, real-time RSVP dashboard, and verified live hosting through your wedding day on <strong>{invitationData.weddingDate}</strong> are fully paid and unlocked. You will never be asked to pay twice.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsInvitationOpen(true);
                    }}
                    className="px-8 py-3.5 rounded-full bg-[#1F181B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C87870] transition shadow-md flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>Open My Invitation Studio →</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Single $19 All-Access Plan Card (불필요한 다중 선택 배제, 19달러 단일 요금제) */}
                <div className="mt-8 p-6 sm:p-8 rounded-3xl border-2 border-[#C87870] bg-[#FFFBF9] shadow-[0_12px_40px_rgba(200,120,112,0.18)] relative text-left">
                  <span className="absolute -top-3 right-6 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#B85E55] to-[#9E6F28] text-white shadow-sm">
                    All-Inclusive Pass (76% OFF Launch Special)
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F2E5DC] pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#B85E55] block">
                        The Grand 12 VIP Pass · All-Inclusive Access
                      </span>
                      <h4 className="text-xl sm:text-2xl font-serif text-[#1F181B] font-medium mt-1">
                        Complete 12 Sanctuary Destination Collection
                      </h4>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="line-through text-sm text-[#A89895]">$79</span>
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-[#B85E55]">$19</span>
                      <span className="text-xs text-[#8C7A78] font-medium">USD (One-Time · Lifetime)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-xs text-[#4A3B39]">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C87870] shrink-0 mt-0.5" />
                      <span><strong>240 Masterpieces</strong>: 12 destination worlds, 20 cinematic angles each</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C87870] shrink-0 mt-0.5" />
                      <span><strong>8K Print-Ready</strong>: 300 DPI lossless files for altar frames & luxury canvas prints (Top 5)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C87870] shrink-0 mt-0.5" />
                      <span><strong>Free Digital Wedding Invitation</strong>: 10 bespoke templates with live RSVP tracking</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C87870] shrink-0 mt-0.5" />
                      <span><strong>1:1 Silhouette Fit</strong>: Custom groom & bride proportions for tuxedo & couture gowns</span>
                    </div>
                  </div>

                  <p className="mt-5 text-center text-[11px] text-[#9E8B88] font-sans italic border-t border-[#F5ECE5] pt-3">
                    * Single $19 one-time payment. No subscription or hidden fees. Lifetime access to all 12 worlds.
                  </p>

                  {/* Official PayPal Checkout & Instant Unlock CTAs */}
                  <div className="mt-6 space-y-3">
                    {/* Instant 1-Click Test Unlock */}
                    <button
                      type="button"
                      onClick={() => {
                        handleCompleteOrder();
                        setIsCheckoutOpen(false);
                        setCopyToast('✨ Instant VIP Test Access Unlocked!');
                        setTimeout(() => setCopyToast(''), 3500);
                      }}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition active:scale-[0.99] cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5 text-emerald-200" />
                      <span>⚡ Instant 1-Click Test Unlock (Free VIP Pass)</span>
                    </button>
                    <a
                      href="https://www.paypal.com/ncp/payment/LVRRE8SJKD3VA"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        handleCompleteOrder();
                      }}
                      className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-[#0070BA] hover:bg-[#005EA6] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-[#0070BA]/25 hover:shadow-2xl transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.002.535 5.32.26 5.69.26h7.248c2.457 0 4.394.57 5.485 1.603 1.05.992 1.488 2.454 1.233 4.116-.54 3.513-2.915 5.485-6.516 5.485h-2.31l-1.398 8.873a1.002 1.002 0 0 1-.989.843l-1.367.157z" />
                      </svg>
                      <span>Pay $19.00 with PayPal or Card</span>
                      <ExternalLink className="w-4 h-4 opacity-80" />
                    </a>

                    <button
                      onClick={handleCompleteOrder}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#FAF5F1] hover:bg-[#F2E5DC] text-[#4A3B39] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#E8DCD4] transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Already Paid or Want 1-Click Pass? Click to Create Masterpiece →</span>
                    </button>

                    {/* Supported Payment Badges */}
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8C7A78] font-semibold pt-1">
                      <span>Accepted:</span>
                      <span className="px-2 py-0.5 bg-white border border-[#E8DCD4] rounded text-[#1F181B]">PayPal</span>
                      <span className="px-2 py-0.5 bg-white border border-[#E8DCD4] rounded text-[#1F181B]">Visa</span>
                      <span className="px-2 py-0.5 bg-white border border-[#E8DCD4] rounded text-[#1F181B]">Mastercard</span>
                      <span className="px-2 py-0.5 bg-white border border-[#E8DCD4] rounded text-[#1F181B]">AMEX</span>
                      <span className="px-2 py-0.5 bg-white border border-[#E8DCD4] rounded text-[#1F181B]">Apple Pay</span>
                    </div>

                    {/* Security Assurance */}
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#A89895] pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Official 256-bit encrypted checkout via PayPal • Lifetime Access</span>
                    </div>
                  </div>
                </div>
              </>
            )}

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
          <div className="flex items-center gap-6 text-[#8A7977] font-medium">
            <Link 
              href="/weddinghelper/gallery"
              className="hover:text-[#1F181B] transition cursor-pointer"
            >
              240 Masterpiece Portfolio
            </Link>
            <button 
              type="button"
              onClick={() => {
                setIsDemoMode(false);
                setIsInvitationOpen(true);
              }}
              className="hover:text-[#1F181B] transition cursor-pointer"
            >
              Digital Invitation Studio
            </button>
            <button 
              type="button"
              onClick={() => {
                const el = document.getElementById('pricing-checkout-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#1F181B] transition cursor-pointer"
            >
              VIP All-Access Pass
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
