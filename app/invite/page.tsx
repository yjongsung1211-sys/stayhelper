'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Heart, Sparkles, MapPin, CheckCircle2, Volume2, VolumeX,
  Phone, Copy, ExternalLink, Calendar, Music2, Share2, Check,
  Compass, Flame, Waves, Flower2, Star, ShieldCheck, Crown
} from 'lucide-react';
import { MOBILE_INVITATION_10_TEMPLATES, MobileInvitationTemplate } from '@/lib/mobile-invitation-templates';

// Web Audio Procedural Canon in D Synthesizer for Mobile Invitation
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

function playBgmAudio() {
  stopBgmAudio();
  if (typeof window === 'undefined') return;

  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;
  if (!bgmAudioCtx) {
    bgmAudioCtx = new AudioCtx();
  }
  if (bgmAudioCtx.state === 'suspended') {
    bgmAudioCtx.resume();
  }
  const ctx = bgmAudioCtx;

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
}

function InvitationContent() {
  const searchParams = useSearchParams();
  const initialTheme = searchParams.get('theme') || 'royal-heritage';
  const [activeTheme, setActiveTheme] = useState<string>(initialTheme);
  
  const currentSkin: MobileInvitationTemplate = 
    MOBILE_INVITATION_10_TEMPLATES.find(t => t.id === activeTheme) || 
    MOBILE_INVITATION_10_TEMPLATES[0]; // Royal Heritage default

  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [activeGalleryPhoto, setActiveGalleryPhoto] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string>('');

  useEffect(() => {
    if (isBgmPlaying) {
      playBgmAudio();
    } else {
      stopBgmAudio();
    }
    return () => {
      stopBgmAudio();
    };
  }, [isBgmPlaying]);

  // Gallery Photos matching all 10 bespoke themes
  const getThemeGallery = (themeId: string) => {
    switch (themeId) {
      case 'royal-heritage':
        return [
          '/images/hanbok_heritage/hanbok_01.jpg',
          '/images/hanbok_heritage/hanbok_02.jpg',
          '/images/hanbok_heritage/hanbok_03.jpg',
          '/images/hanbok_heritage/hanbok_04.jpg',
          '/images/hanbok_heritage/hanbok_06.jpg',
          '/images/hanbok_heritage/hanbok_07.jpg',
        ];
      case 'vogue-editorial':
        return [
          '/images/weddings_240/theme_04_paris/scene_01.jpg',
          '/images/weddings_240/theme_04_paris/scene_02.jpg',
          '/images/weddings_240/theme_04_paris/scene_03.jpg',
          '/images/weddings_240/theme_04_paris/scene_04.jpg',
          '/images/weddings_240/theme_04_paris/scene_05.jpg',
          '/images/weddings_240/theme_04_paris/scene_06.jpg',
        ];
      case 'vintage-monogram':
        return [
          '/images/weddings_240/theme_03_lake_como/scene_01.jpg',
          '/images/weddings_240/theme_03_lake_como/scene_02.jpg',
          '/images/weddings_240/theme_03_lake_como/scene_03.jpg',
          '/images/weddings_240/theme_03_lake_como/scene_04.jpg',
          '/images/weddings_240/theme_03_lake_como/scene_05.jpg',
          '/images/weddings_240/theme_03_lake_como/scene_06.jpg',
        ];
      case 'cathedral-arch':
        return [
          '/images/weddings_240/theme_04_paris/scene_16.jpg',
          '/images/weddings_240/theme_04_paris/scene_02.jpg',
          '/images/weddings_240/theme_04_paris/scene_04.jpg',
          '/images/weddings_240/theme_04_paris/scene_12.jpg',
          '/images/weddings_240/theme_03_lake_como/scene_16.jpg',
          '/images/weddings/paris-hotel.jpg',
        ];
      case 'midnight-celestial':
        return [
          '/images/weddings_240/theme_03_lake_como/scene_10.jpg',
          '/images/weddings_240/theme_01_bali/scene_09.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_08.jpg',
          '/images/weddings_240/theme_04_paris/scene_07.jpg',
          '/images/weddings_240/theme_04_paris/scene_15.jpg',
          '/images/weddings/liwa-desert.jpg',
        ];
      case 'blooming-peony':
        return [
          '/images/weddings_240/theme_02_amalfi/scene_19.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_02.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_04.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_06.jpg',
          '/images/weddings_240/theme_03_lake_como/scene_02.jpg',
          '/images/weddings/amalfi-cliff.jpg',
        ];
      case 'modern-ivory':
        return [
          '/images/weddings_240/theme_04_paris/scene_14.jpg',
          '/images/weddings_240/theme_03_lake_como/scene_06.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_12.jpg',
          '/images/weddings_240/theme_01_bali/scene_12.jpg',
          '/images/weddings_240/theme_04_paris/scene_06.jpg',
          '/images/weddings/nyc-penthouse.jpg',
        ];
      case 'golden-sunset':
        return [
          '/images/weddings_240/theme_02_amalfi/scene_07.jpg',
          '/images/weddings_240/theme_01_bali/scene_07.jpg',
          '/images/weddings_240/theme_03_lake_como/scene_07.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_18.jpg',
          '/images/weddings_240/theme_01_bali/scene_08.jpg',
          '/images/weddings/cabo-beach.jpg',
        ];
      case 'mediterranean-breeze':
        return [
          '/images/weddings_240/theme_02_amalfi/scene_01.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_02.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_03.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_04.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_05.jpg',
          '/images/weddings_240/theme_02_amalfi/scene_06.jpg',
        ];
      case 'botanical-glasshouse':
      default:
        return [
          '/images/weddings_240/theme_01_bali/scene_01.jpg',
          '/images/weddings_240/theme_01_bali/scene_02.jpg',
          '/images/weddings_240/theme_01_bali/scene_03.jpg',
          '/images/weddings_240/theme_01_bali/scene_04.jpg',
          '/images/weddings_240/theme_01_bali/scene_05.jpg',
          '/images/weddings_240/theme_01_bali/scene_06.jpg',
        ];
    }
  };

  const getDefaultCover = (themeId: string) => {
    switch (themeId) {
      case 'royal-heritage':
        return '/images/hanbok_heritage/hanbok_01.jpg';
      case 'vogue-editorial':
        return '/images/weddings_240/theme_04_paris/scene_01.jpg';
      case 'vintage-monogram':
        return '/images/weddings_240/theme_03_lake_como/scene_01.jpg';
      case 'cathedral-arch':
        return '/images/weddings_240/theme_04_paris/scene_16.jpg';
      case 'midnight-celestial':
        return '/images/weddings_240/theme_03_lake_como/scene_10.jpg';
      case 'blooming-peony':
        return '/images/weddings_240/theme_02_amalfi/scene_19.jpg';
      case 'modern-ivory':
        return '/images/weddings_240/theme_04_paris/scene_14.jpg';
      case 'golden-sunset':
        return '/images/weddings_240/theme_02_amalfi/scene_07.jpg';
      case 'mediterranean-breeze':
        return '/images/weddings_240/theme_02_amalfi/scene_01.jpg';
      case 'botanical-glasshouse':
      default:
        return '/images/weddings_240/theme_01_bali/scene_01.jpg';
    }
  };

  const invitationData = {
    groomName: searchParams.get('groom') || 'Liam Brooks',
    groomPhone: '+1 (212) 555-0192',
    brideName: searchParams.get('bride') || 'Emma Catherine',
    bridePhone: '+1 (212) 555-0184',
    weddingDate: searchParams.get('date') || 'Sunday, November 8, 2026',
    weddingTime: searchParams.get('time') || '4:00 PM (EST)',
    weddingDayNum: 8,
    venueName: searchParams.get('venue') || (
      activeTheme === 'royal-heritage'
        ? 'The Shilla Yeong Bin Gwan (신라호텔 영빈관)'
        : activeTheme === 'vintage-monogram'
        ? 'Villa Balbianello & Grand Hotel Tremezzo'
        : activeTheme === 'mediterranean-breeze'
        ? 'Belmond Hotel Caruso & Villa Cimbrone'
        : activeTheme === 'botanical-glasshouse'
        ? 'Mandapa, A Ritz-Carlton Reserve Bali'
        : activeTheme === 'vogue-editorial'
        ? 'Ritz Paris & Place Vendôme Salon'
        : activeTheme === 'cathedral-arch'
        ? 'The St. Patrick Cathedral Sanctuary'
        : 'The Plaza Hotel Grand Ballroom'
    ),
    venueHall: activeTheme === 'royal-heritage' ? 'Topaz & Emerald Imperial Hall' : 'The Grand Ballroom & Terrace',
    venueAddress: activeTheme === 'royal-heritage' 
      ? '249 Dongho-ro, Jung-gu, Seoul, South Korea' 
      : '768 Fifth Avenue, New York, NY 10019',
    venueTraffic: activeTheme === 'royal-heritage'
      ? '3 min from Dongguk Univ Station (Line 3), Exit 5'
      : 'Subway N/R/W at 5th Ave / 59th St (1 min walk)',
    venueParking: 'Complimentary VIP Valet Parking at main entrance',
    welcomeMessage: activeTheme === 'royal-heritage'
      ? `서로를 향한 존경과 사랑으로 평생을 함께할 약속을 맺습니다.\n저희 두 사람이 사랑과 믿음으로 새 가정을 이루는 뜻깊은 자리에\n귀하신 걸음으로 축복해 주시면 더없는 영광이겠습니다.`
      : `Together with our families,\nwe joyfully invite you to celebrate our marriage.\nAs we exchange our sacred vows,\nyour love and blessing would mean the world to us.`,
    coverPhoto: searchParams.get('photo') || getDefaultCover(activeTheme),
    galleryPhotos: getThemeGallery(activeTheme)
  };

  const copyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(invitationData.venueAddress);
      setCopyToast('Venue address copied to clipboard!');
      setTimeout(() => setCopyToast(''), 2500);
    }
  };

  const copyLink = () => {
    if (navigator.clipboard && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('theme', activeTheme);
      navigator.clipboard.writeText(url.toString());
      setCopyToast(`Invitation link (${currentSkin.name}) copied!`);
      setTimeout(() => setCopyToast(''), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#0D0B0E] py-3 sm:py-8 font-serif antialiased selection:bg-[#D4AF37]/30 text-white">
      {/* 10 Bespoke Styles Interactive Dock - Fixed/Sticky Top Switcher */}
      <div className="w-full max-w-[460px] px-2 mb-3 z-40 sticky top-2">
        <div className="bg-[#181318]/95 backdrop-blur-xl p-3 rounded-2xl border border-[#D4AF37]/40 shadow-2xl">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[11px] font-sans font-extrabold tracking-[0.16em] text-[#D4AF37] uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span>10 BESPOKE THEMES (원클릭 전환)</span>
            </span>
            <span className="text-[10px] text-amber-200/90 font-sans font-medium">
              선택: <strong className="text-white font-bold">{currentSkin.name}</strong>
            </span>
          </div>
          
          {/* Scrollable Horizontal 10-Theme Dock with visual indicators */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MOBILE_INVITATION_10_TEMPLATES.map((tmpl, idx) => {
              const isSelected = activeTheme === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTheme(tmpl.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-sans font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#FFDF78] to-[#C49746] text-[#1A0A0E] shadow-[0_0_15px_rgba(212,175,55,0.6)] font-extrabold scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span className="text-xs">{tmpl.ornamentSymbol}</span>
                  <span>#{idx + 1} {tmpl.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[10px] font-sans text-amber-100/70 mt-1.5 px-1 truncate">
            {currentSkin.subtitle} · {currentSkin.tagline}
          </p>
        </div>
      </div>

      {/* Smartphone Viewport Shell */}
      <div 
        className={`w-full max-w-[440px] min-h-screen sm:min-h-0 sm:rounded-[44px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative transition-all duration-700 bg-gradient-to-b ${currentSkin.bgGradient}`}
        style={{ color: currentSkin.textColor }}
      >
        {/* Top Verified Hosting & Validity Guarantee Bar */}
        <div 
          className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase py-2.5 px-4 flex items-center justify-between border-b z-20"
          style={{ 
            backgroundColor: currentSkin.isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
            borderColor: currentSkin.borderColor,
            color: currentSkin.themeColor 
          }}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: currentSkin.themeColor }} />
            <span>OFFICIAL LIVE INVITATION</span>
          </div>
          <span className="text-[9px] opacity-80 font-normal font-sans">
            VALID · 2026.11.08
          </span>
        </div>

        {/* Floating Audio Soundtrack Controller */}
        <div className="fixed sm:absolute top-14 sm:top-12 right-4 z-40">
          <button
            onClick={() => setIsBgmPlaying(!isBgmPlaying)}
            className="w-10 h-10 rounded-full backdrop-blur-md border shadow-xl flex items-center justify-center transition hover:scale-110"
            style={{ 
              backgroundColor: currentSkin.isDarkMode ? 'rgba(24,19,24,0.85)' : 'rgba(255,255,255,0.9)',
              borderColor: currentSkin.themeColor,
              color: currentSkin.themeColor
            }}
            title={isBgmPlaying ? 'Pause BGM' : 'Play Romantic Canon'}
          >
            {isBgmPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-60" />
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 1. TEN RADICALLY DISTINCT BESPOKE HERO ARCHITECTURES */}
        {/* ========================================================================= */}

        {/* ------------------------------------------------------------- */}
        {/* THEME #1: KOREAN ROYAL HANBOK HERITAGE (조선 왕실 궁중 가례첩) */}
        {/* ------------------------------------------------------------- */}
        {currentSkin.id === 'royal-heritage' && (
          <div className="p-6 text-center relative overflow-hidden">
            {/* Traditional Dancheong Window Lattice Borders */}
            <div className="absolute top-2 left-2 text-[#D4AF37]/40 text-xs font-serif">卍</div>
            <div className="absolute top-2 right-2 text-[#D4AF37]/40 text-xs font-serif">卍</div>
            <div className="absolute bottom-2 left-2 text-[#D4AF37]/40 text-xs font-serif">卍</div>
            <div className="absolute bottom-2 right-2 text-[#D4AF37]/40 text-xs font-serif">卍</div>

            {/* Imperial Phoenix Gold Crest */}
            <div className="flex flex-col items-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#D4AF37] via-[#FFDF78] to-[#99771F] p-0.5 shadow-[0_0_25px_rgba(212,175,55,0.5)]">
                <div className="w-full h-full rounded-full bg-[#1C0508] flex items-center justify-center border border-[#D4AF37]/60">
                  <span className="text-2xl drop-shadow-[0_2px_4px_rgba(212,175,55,0.8)]">👑</span>
                </div>
              </div>
              <span className="text-[10px] tracking-[0.35em] text-[#FFDF78] font-bold uppercase mt-2 block">
                百年佳約 · 鳳凰之盟
              </span>
              <span className="text-xs font-serif tracking-[0.2em] text-[#D4AF37] font-semibold mt-0.5">
                朝鮮 王室 嘉禮 (조선 왕실 국빈 가례)
              </span>
            </div>

            {/* Couple Royal Names */}
            <div className="space-y-1 mb-4">
              <h2 className="text-3xl font-serif font-extrabold tracking-widest text-[#FFF6E5]">
                {invitationData.groomName} <span className="text-[#D4AF37] text-xl font-normal">과</span> {invitationData.brideName}
              </h2>
              <p className="text-[11px] font-sans tracking-[0.25em] text-[#D9B88F] uppercase">
                Royal Matrimonial Ceremony
              </p>
            </div>

            {/* Royal Silk Museum Frame Photo */}
            <div className="relative aspect-[3/4] w-full p-2.5 rounded-2xl bg-gradient-to-b from-[#D4AF37] via-[#7A1C23] to-[#D4AF37] shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-[#FFDF78]/40">
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#D4AF37]/80">
                <Image src={invitationData.coverPhoto} alt="Royal Hanbok" fill unoptimized className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0508]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <span className="px-3 py-1 rounded-full bg-[#1C0508]/90 border border-[#D4AF37] text-[#FFDF78] text-[10px] font-serif font-bold tracking-widest uppercase">
                    國賓 嘉禮 · THE SHILLA PALACE
                  </span>
                </div>
              </div>
            </div>

            {/* Auspicious Time Banner */}
            <div className="mt-4 py-2.5 rounded-xl bg-[#24080C] border border-[#D4AF37]/50 text-xs font-serif text-[#FFDF78] font-bold tracking-widest flex items-center justify-center gap-2">
              <span>吉日</span>
              <span>·</span>
              <span>{invitationData.weddingDate} · {invitationData.weddingTime}</span>
              <span>·</span>
              <span>吉時</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* THEME #2: VOGUE HAUTE EDITORIAL (보그 하이패션 에디토리얼) */}
        {/* ------------------------------------------------------------- */}
        {currentSkin.id === 'vogue-editorial' && (
          <div className="p-5 text-center bg-[#0A0A0C] text-white">
            <div className="pt-2 pb-2.5 border-b-2 border-white flex items-center justify-between font-serif mb-4 px-1 gap-2">
              <span className="text-[8px] sm:text-[9px] tracking-[0.18em] font-sans font-black uppercase text-white/80 whitespace-nowrap shrink-0">
                THE WEDDING ISSUE
              </span>
              <span className="text-2xl sm:text-3xl font-serif tracking-[0.25em] font-black text-white whitespace-nowrap shrink-0 pl-1">
                VOGUE
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.18em] font-sans font-bold text-white/80 whitespace-nowrap shrink-0">
                VOL. XXIV
              </span>
            </div>

            <div className="relative aspect-[3/4] w-full border-2 border-white shadow-[0_20px_40px_rgba(0,0,0,0.9)] overflow-hidden mb-4">
              <Image src={invitationData.coverPhoto} alt="Vogue Cover" fill unoptimized className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
              
              <div className="absolute top-4 left-4 text-left">
                <span className="text-[9px] tracking-[0.35em] uppercase font-sans font-black bg-white text-black px-2.5 py-0.5 inline-block mb-1.5 shadow-sm">
                  PARIS HAUTE COUTURE
                </span>
                <h2 className="text-3xl font-serif italic tracking-wide font-black text-white drop-shadow-md">{invitationData.groomName}</h2>
                <h2 className="text-3xl font-serif italic tracking-wide font-black text-white drop-shadow-md">& {invitationData.brideName}</h2>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-sans">
                <div className="text-left text-white drop-shadow-md">
                  <p className="text-[9px] tracking-[0.25em] uppercase text-white/80 font-bold">SPECIAL CEREMONY ISSUE</p>
                  <p className="text-xs font-serif italic font-bold">{invitationData.venueName}</p>
                </div>
                <div className="bg-white px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-black border border-black shadow-sm">
                  ||| | |||| | |||
                </div>
              </div>
            </div>

            <div className="py-2.5 border-y-2 border-white font-sans text-xs tracking-widest font-black uppercase bg-white/5">
              {invitationData.weddingDate} · {invitationData.weddingTime}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* THEME #3: LAKE COMO VINTAGE PARCHMENT (이탈리아 코모 호수 빈티지 양피지) */}
        {/* ------------------------------------------------------------- */}
        {currentSkin.id === 'vintage-monogram' && (
          <div className="p-6 text-center text-[#2C1D18]">
            {/* 3D Burgundy Sealing Wax Stamp with Gold Dust */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-18 h-18 rounded-full bg-gradient-to-br from-[#8A2D2A] via-[#A83834] to-[#5C1E1C] p-1 border-2 border-[#C49746] shadow-[0_10px_25px_rgba(138,45,42,0.6)] flex items-center justify-center relative">
                <div className="w-14 h-14 rounded-full border border-dashed border-[#FFDF78]/70 flex items-center justify-center text-[#FFF2DC] font-serif text-base font-extrabold tracking-widest drop-shadow-md">
                  {currentSkin.monogramText}
                </div>
                <div className="absolute -bottom-2 w-4 h-4 bg-[#8A2D2A] rotate-45 border-r border-b border-[#C49746]/50" />
              </div>
              <span className="text-[9px] font-serif italic tracking-[0.3em] text-[#8A2D2A] mt-3 font-bold uppercase">
                Official Wax Seal of Matrimony · Villa Balbianello
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-[9px] tracking-[0.35em] uppercase font-sans text-[#6E5347] font-semibold block">
                Solemn Proclamation of Marriage
              </span>
              <h2 className="text-3xl font-serif font-bold tracking-wide text-[#2C1D18]">
                {invitationData.groomName} <span className="text-[#C49746]">⚜</span> {invitationData.brideName}
              </h2>
            </div>

            {/* Vintage Deckled Edge Photo Frame with Baroque Corners */}
            <div className="relative aspect-[3/4] w-full p-2.5 bg-[#FAF5EC] border-2 border-[#C8B293] shadow-2xl rounded-sm">
              <div className="relative w-full h-full overflow-hidden border border-[#C49746]/50">
                <Image src={invitationData.coverPhoto} alt="Vintage Como" fill unoptimized className="object-cover" priority />
                <span className="absolute top-2 left-2 text-[#C49746] text-sm drop-shadow-xs">⚜</span>
                <span className="absolute top-2 right-2 text-[#C49746] text-sm drop-shadow-xs">⚜</span>
                <span className="absolute bottom-2 left-2 text-[#C49746] text-sm drop-shadow-xs">⚜</span>
                <span className="absolute bottom-2 right-2 text-[#C49746] text-sm drop-shadow-xs">⚜</span>
              </div>
            </div>

            <div className="mt-4 py-2.5 border-y border-[#C49746]/60 text-xs font-serif italic font-bold text-[#8A2D2A]">
              {invitationData.weddingDate} · {invitationData.weddingTime}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* THEME #4: SACRED CATHEDRAL ARCH (세이크리드 고딕 대성당 아치) */}
        {/* ------------------------------------------------------------- */}
        {currentSkin.id === 'cathedral-arch' && (
          <div className="p-6 text-center text-[#F5EFE6]">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#D8B86D]/15 border-2 border-[#D8B86D]/60 text-[#D8B86D] flex items-center justify-center text-xl mb-2.5 shadow-[0_0_20px_rgba(216,184,109,0.3)]">
              ⛪
            </div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#D8B86D] font-bold block mb-1">
              SACRED BASILICA SOLEMNITY
            </span>
            <p className="text-[9px] tracking-[0.25em] font-serif italic text-[#B3A698] mb-3">
              In Aeternum Amor · Holy Matrimony
            </p>
            <h2 className="text-3xl font-serif text-[#F5EFE6] font-medium tracking-wide mb-4">
              {invitationData.groomName} <span className="text-[#D8B86D] font-light">†</span> {invitationData.brideName}
            </h2>

            {/* Gothic Arched Photo Frame with Stone Texture */}
            <div className="relative aspect-[3/4] w-full rounded-t-[140px] rounded-b-2xl overflow-hidden border-4 border-[#D8B86D]/70 shadow-[0_15px_35px_rgba(0,0,0,0.9)] p-1.5 bg-[#191523]">
              <div className="relative w-full h-full rounded-t-[130px] rounded-b-xl overflow-hidden">
                <Image src={invitationData.coverPhoto} alt="Cathedral Arch" fill unoptimized className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-[10px] font-serif italic text-[#F5DE9C] tracking-widest uppercase">
                    Sacred Cathedral Benediction
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 py-2.5 border-y border-[#D8B86D]/40 text-xs font-serif font-bold tracking-widest text-[#D8B86D]">
              {invitationData.weddingDate} · {invitationData.weddingTime}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* THEME #5: MIDNIGHT CELESTIAL STARLIGHT (미드나잇 은하수 별자리) */}
        {/* ------------------------------------------------------------- */}
        {currentSkin.id === 'midnight-celestial' && (
          <div className="p-6 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5D061]/20 border border-[#F5D061]/60 text-[#F5D061] text-[10px] tracking-[0.25em] uppercase font-bold mb-3 shadow-[0_0_15px_rgba(245,208,97,0.4)]">
              <Sparkles className="w-3.5 h-3.5 text-[#F5D061] animate-spin" />
              <span>BLACK TIE CELESTIAL GALA</span>
            </div>
            <p className="text-[10px] tracking-[0.35em] text-[#AEA4C9] uppercase font-light mb-1">
              WRITTEN IN THE STARS
            </p>
            <h2 className="text-3xl font-serif tracking-widest text-white font-bold mb-4 drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
              {invitationData.groomName} <span className="text-[#F5D061]">✧</span> {invitationData.brideName}
            </h2>

            {/* Glowing Celestial Constellation Frame */}
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border-2 border-[#F5D061] shadow-[0_0_40px_rgba(245,208,97,0.45)]">
              <Image src={invitationData.coverPhoto} alt="Celestial Cover" fill unoptimized className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04040A] via-transparent to-[#04040A]/40" />
              <div className="absolute top-3 right-3 text-[#F5D061] text-xs font-mono">✧ ✦ ✧</div>
              <div className="absolute bottom-4 left-0 right-0 text-center text-white font-sans">
                <p className="text-xs tracking-widest uppercase font-bold text-[#F5D061]">{invitationData.weddingDate}</p>
                <p className="text-sm font-serif italic text-white/90">Dancing Under a Thousand Shimmering Stars</p>
              </div>
            </div>

            <div className="mt-4 py-3 border-y border-[#2D2752] text-xs font-serif text-[#F5D061] tracking-widest font-bold">
              {invitationData.weddingDate} · {invitationData.weddingTime}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* THEME #6: BLOOMING PEONY GARDEN (블루밍 피오니 로맨틱 가든) */}
        {/* ------------------------------------------------------------- */}
        {currentSkin.id === 'blooming-peony' && (
          <div className="p-6 text-center text-[#3A1B22]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-base">🌸</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D9536F] font-extrabold">
                ENGLISH PEONY BOTANICAL GARDEN
              </span>
              <span className="text-base">🌸</span>
            </div>
            <h2 className="text-3xl font-serif italic font-bold text-[#3A1B22] mb-4">
              {invitationData.groomName} <span className="text-[#E87D94] font-normal">&</span> {invitationData.brideName}
            </h2>

            {/* Romantic Rose-Gold Arched Frame */}
            <div className="relative aspect-[3/4] w-full rounded-t-[120px] rounded-b-3xl overflow-hidden border-4 border-[#F3BAC5] shadow-[0_15px_30px_rgba(217,83,111,0.2)]">
              <Image src={invitationData.coverPhoto} alt="Peony Garden" fill unoptimized className="object-cover" priority />
            </div>

            <div className="mt-4 py-2.5 border-y border-[#F3BAC5] text-xs font-serif font-bold text-[#D9536F]">
              {invitationData.weddingDate} · {invitationData.weddingTime}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* THEME #7: KINFOLK MODERNIST SILK (스위스 건축 그리드 미니멀) */}
        {/* ------------------------------------------------------------- */}
        {currentSkin.id === 'modern-ivory' && (
          <div className="p-6 text-[#1A1817]">
            <div className="bg-white p-4 pb-6 rounded-2xl shadow-xl border border-[#D4CEBF]">
              {/* Washi Tape Graphic */}
              <div className="w-16 h-3 bg-[#EAE5DC] mx-auto -mt-6 mb-3 rounded-xs border-y border-[#D4CEBF]/60 rotate-1 shadow-xs" />
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4 shadow-sm">
                <Image src={invitationData.coverPhoto} alt="Modernist Silk" fill unoptimized className="object-cover" priority />
              </div>
              <div className="text-center space-y-1">
                <span className="text-[9px] tracking-[0.3em] font-sans font-extrabold uppercase text-[#786F66] block">
                  ARCHITECTURAL MINIMALISM
                </span>
                <p className="text-2xl font-sans tracking-tight text-[#1A1817] font-black uppercase">
                  {invitationData.groomName} / {invitationData.brideName}
                </p>
                <p className="text-[11px] font-sans tracking-[0.25em] text-[#635D56] uppercase font-bold">
                  {invitationData.weddingDate} · {invitationData.weddingTime}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* THEME #8: AMALFI GOLDEN SUNSET RIVIERA (아말피 골든 선셋) */}
        {/* ------------------------------------------------------------- */}
        {currentSkin.id === 'golden-sunset' && (
          <div className="p-6 text-center text-[#FFF2EA]">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#E6683B] font-extrabold block mb-1">
              ☼ AMALFI CLIFFSIDE GOLDEN HOUR ☼
            </span>
            <p className="text-[9px] tracking-[0.25em] text-[#DDB6A2] uppercase font-serif italic mb-3">
              Mediterranean Riviera Sunset
            </p>
            <h2 className="text-3xl font-serif text-[#FFF2EA] font-bold tracking-tight mb-4">
              {invitationData.groomName} <span className="text-[#E6683B] font-light">&</span> {invitationData.brideName}
            </h2>

            {/* Warm Terracotta Arched Frame */}
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border-4 border-[#632817] shadow-[0_15px_35px_rgba(230,104,59,0.3)]">
              <Image src={invitationData.coverPhoto} alt="Amalfi Sunset" fill unoptimized className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1008]/80 via-transparent to-transparent" />
            </div>

            <div className="mt-4 py-2.5 border-y border-[#632817] text-xs font-serif text-[#FFA07A] font-bold">
              {invitationData.weddingDate} · {invitationData.weddingTime}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* THEME #9: SANTORINI AEGEAN BREEZE (산토리니 에게해 아주르 블루) */}
        {/* ------------------------------------------------------------- */}
        {currentSkin.id === 'mediterranean-breeze' && (
          <div className="p-6 text-center text-[#F5FAFF]">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#00ADB5] font-extrabold block mb-1">
              SANTORINI CALDERA AZURE · GREECE
            </span>
            <p className="text-[9px] tracking-[0.25em] text-[#A0BED9] uppercase font-sans mb-3">
              Endless Cobalt Aegean Sea
            </p>
            <h2 className="text-3xl font-sans font-light tracking-[0.15em] text-[#F5FAFF] uppercase mb-4 font-bold">
              {invitationData.groomName} <span className="text-[#00ADB5]">•</span> {invitationData.brideName}
            </h2>

            {/* Cycladic Arch Frame with Deep Cobalt Sea Glow */}
            <div className="relative aspect-[3/4] w-full rounded-t-[120px] rounded-b-2xl overflow-hidden border-4 border-[#184777] shadow-[0_15px_35px_rgba(0,173,181,0.3)]">
              <Image src={invitationData.coverPhoto} alt="Santorini Breeze" fill unoptimized className="object-cover" priority />
            </div>

            <div className="mt-4 py-2.5 border-y border-[#184777] text-xs font-sans text-[#70E3EA] font-bold tracking-wider">
              {invitationData.weddingDate} · {invitationData.weddingTime}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* THEME #10: BALI EMERALD GLASSHOUSE SANCTUARY (발리 에메랄드 온실) */}
        {/* ------------------------------------------------------------- */}
        {currentSkin.id === 'botanical-glasshouse' && (
          <div className="p-6 text-center text-[#F0F9F3]">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#52B788] font-extrabold block mb-1">
              🌿 BALI CONSERVATORY BOTANICAL 🌿
            </span>
            <p className="text-[9px] tracking-[0.25em] text-[#9DC2AA] uppercase font-serif italic mb-3">
              Lush Tropical Rainforest Glasshouse
            </p>
            <h2 className="text-3xl font-serif text-[#F0F9F3] font-bold mb-4">
              {invitationData.groomName} <span className="text-[#52B788]">&</span> {invitationData.brideName}
            </h2>

            {/* Vintage Brass Glasshouse Frame */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-[#194A2D] shadow-[0_15px_35px_rgba(82,183,136,0.25)]">
              <Image src={invitationData.coverPhoto} alt="Bali Glasshouse" fill unoptimized className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06160D]/80 via-transparent to-transparent" />
            </div>

            <div className="mt-4 py-2.5 border-y border-[#194A2D] text-xs font-serif text-[#95D5B2] font-bold">
              {invitationData.weddingDate} · {invitationData.weddingTime}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EDITORIAL CHAPTER DIVIDER I */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center gap-3 py-4 px-8">
          <div className="h-[1px] flex-1 opacity-30" style={{ background: `linear-gradient(to right, transparent, ${currentSkin.themeColor}, transparent)` }} />
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-sans font-extrabold tracking-[0.25em] uppercase shadow-xs"
            style={{ 
              borderColor: currentSkin.borderColor, 
              color: currentSkin.themeColor, 
              backgroundColor: currentSkin.isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)' 
            }}
          >
            <span>{currentSkin.ornamentSymbol}</span>
            <span>CHAPTER I · THE INVITATION</span>
          </div>
          <div className="h-[1px] flex-1 opacity-30" style={{ background: `linear-gradient(to right, transparent, ${currentSkin.themeColor}, transparent)` }} />
        </div>

        {/* ========================================================================= */}
        {/* 2. THEME-INTEGRATED INVITATION LETTER */}
        {/* ========================================================================= */}
        <div className="px-6 pb-4 text-center space-y-6">
          <div 
            className="p-7 rounded-3xl border text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden backdrop-blur-xs"
            style={{ 
              backgroundColor: currentSkin.cardBg, 
              borderColor: currentSkin.borderColor,
              color: currentSkin.textColor
            }}
          >
            {/* Top Ornamental Watermark */}
            <div className="text-xl opacity-40 -mb-2" style={{ color: currentSkin.themeColor }}>
              {currentSkin.ornamentSymbol}
            </div>

            {/* Theme Badge */}
            <span 
              className="text-[10px] tracking-[0.35em] uppercase font-sans font-extrabold block"
              style={{ color: currentSkin.themeColor }}
            >
              {currentSkin.id === 'royal-heritage' ? '貴下를 丁重히 招待합니다 (초대의 글)' : 'INVITATION LETTER'}
            </span>
            
            <p 
              className="text-[11px] font-sans opacity-80 tracking-widest uppercase font-medium"
              style={{ color: currentSkin.subTextColor }}
            >
              {currentSkin.quoteIntro}
            </p>

            {/* Editorial Quotation Body */}
            <div className="relative py-2">
              <span className="text-3xl font-serif opacity-30 block -mb-3" style={{ color: currentSkin.themeColor }}>“</span>
              <p className="text-sm font-serif leading-[2.2] whitespace-pre-line italic px-3 tracking-wide">
                {invitationData.welcomeMessage}
              </p>
              <span className="text-3xl font-serif opacity-30 block -mt-1" style={{ color: currentSkin.themeColor }}>”</span>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: currentSkin.borderColor }}>
              <span className="text-[9px] tracking-[0.3em] uppercase font-bold block opacity-70 mb-1">
                WITH FULL HEARTS & ETERNAL JOY
              </span>
              <p className="text-2xl font-serif font-bold tracking-wide mt-1">
                {invitationData.groomName} <span className="text-xs font-sans opacity-60 px-1">&</span> {invitationData.brideName}
              </p>

              {/* Direct Calling Buttons */}
              <div className="flex items-center justify-center gap-3 pt-5">
                <a 
                  href={`tel:${invitationData.groomPhone}`} 
                  className="px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition border hover:scale-105 shadow-xs"
                  style={{
                    backgroundColor: currentSkin.isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    borderColor: currentSkin.borderColor,
                    color: currentSkin.textColor
                  }}
                >
                  <Phone className="w-3.5 h-3.5" style={{ color: currentSkin.themeColor }} />
                  <span>Call Groom</span>
                </a>
                <a 
                  href={`tel:${invitationData.bridePhone}`} 
                  className="px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition border hover:scale-105 shadow-xs"
                  style={{
                    backgroundColor: currentSkin.isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    borderColor: currentSkin.borderColor,
                    color: currentSkin.textColor
                  }}
                >
                  <Phone className="w-3.5 h-3.5" style={{ color: currentSkin.themeColor }} />
                  <span>Call Bride</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL CHAPTER DIVIDER II */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center gap-3 py-4 px-8">
          <div className="h-[1px] flex-1 opacity-30" style={{ background: `linear-gradient(to right, transparent, ${currentSkin.themeColor}, transparent)` }} />
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-sans font-extrabold tracking-[0.25em] uppercase shadow-xs"
            style={{ 
              borderColor: currentSkin.borderColor, 
              color: currentSkin.themeColor, 
              backgroundColor: currentSkin.isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)' 
            }}
          >
            <span>{currentSkin.ornamentSymbol}</span>
            <span>CHAPTER II · DATE & TIME</span>
          </div>
          <div className="h-[1px] flex-1 opacity-30" style={{ background: `linear-gradient(to right, transparent, ${currentSkin.themeColor}, transparent)` }} />
        </div>

        {/* ========================================================================= */}
        {/* 3. WEDDING CALENDAR & D-DAY COUNTDOWN */}
        {/* ========================================================================= */}
        <div className="px-6 pb-4 font-sans">
          <div 
            className="p-7 rounded-3xl border text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xs"
            style={{ 
              backgroundColor: currentSkin.cardBg, 
              borderColor: currentSkin.borderColor,
              color: currentSkin.textColor
            }}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5" style={{ color: currentSkin.themeColor }} />
              <span className="text-[10px] tracking-[0.25em] uppercase font-extrabold" style={{ color: currentSkin.themeColor }}>
                {currentSkin.id === 'royal-heritage' ? '吉日 吉時 (예식 일시)' : 'WEDDING CALENDAR'}
              </span>
            </div>

            <h4 className="text-lg font-serif font-bold mb-5">
              {invitationData.weddingDate}
            </h4>

            {/* 7 Days of the Week */}
            <div className="grid grid-cols-7 gap-1.5 text-[11px] mb-5">
              <span className="text-rose-400 font-bold uppercase text-[10px]">Sun</span>
              <span className="opacity-60 uppercase text-[10px]">Mon</span>
              <span className="opacity-60 uppercase text-[10px]">Tue</span>
              <span className="opacity-60 uppercase text-[10px]">Wed</span>
              <span className="opacity-60 uppercase text-[10px]">Thu</span>
              <span className="opacity-60 uppercase text-[10px]">Fri</span>
              <span className="opacity-60 uppercase text-[10px]">Sat</span>

              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(day => {
                const isWeddingDay = day === invitationData.weddingDayNum;
                return (
                  <div 
                    key={day}
                    className={`py-1.5 text-center font-medium transition-all ${
                      isWeddingDay 
                        ? 'rounded-full font-black shadow-lg ring-2 ring-offset-2 flex items-center justify-center scale-110'
                        : day % 7 === 1 ? 'text-rose-400' : 'opacity-70'
                    }`}
                    style={isWeddingDay ? { 
                      backgroundColor: currentSkin.themeColor, 
                      color: currentSkin.isDarkMode ? '#000000' : '#FFFFFF',
                      boxShadow: `0 0 15px ${currentSkin.themeColor}`
                    } : undefined}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* D-Day Live Countdown Styled as Editorial Glass Chips */}
            <div className="pt-5 border-t" style={{ borderColor: currentSkin.borderColor }}>
              <p className="text-xs font-serif italic mb-3 opacity-90">
                Counting down to our forever: <span className="font-bold tracking-wide" style={{ color: currentSkin.themeColor }}>"I Do"</span>
              </p>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div 
                  className="p-2.5 rounded-2xl border backdrop-blur-md shadow-xs"
                  style={{ 
                    backgroundColor: currentSkin.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                    borderColor: currentSkin.borderColor 
                  }}
                >
                  <strong className="block text-base font-extrabold font-serif" style={{ color: currentSkin.themeColor }}>04</strong>
                  <span className="text-[9px] opacity-70 uppercase font-sans tracking-widest font-bold">Days</span>
                </div>
                <div 
                  className="p-2.5 rounded-2xl border backdrop-blur-md shadow-xs"
                  style={{ 
                    backgroundColor: currentSkin.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                    borderColor: currentSkin.borderColor 
                  }}
                >
                  <strong className="block text-base font-extrabold font-serif" style={{ color: currentSkin.themeColor }}>02</strong>
                  <span className="text-[9px] opacity-70 uppercase font-sans tracking-widest font-bold">Hours</span>
                </div>
                <div 
                  className="p-2.5 rounded-2xl border backdrop-blur-md shadow-xs"
                  style={{ 
                    backgroundColor: currentSkin.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                    borderColor: currentSkin.borderColor 
                  }}
                >
                  <strong className="block text-base font-extrabold font-serif" style={{ color: currentSkin.themeColor }}>15</strong>
                  <span className="text-[9px] opacity-70 uppercase font-sans tracking-widest font-bold">Mins</span>
                </div>
                <div 
                  className="p-2.5 rounded-2xl border backdrop-blur-md shadow-xs"
                  style={{ 
                    backgroundColor: currentSkin.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                    borderColor: currentSkin.borderColor 
                  }}
                >
                  <strong className="block text-base font-extrabold font-serif" style={{ color: currentSkin.themeColor }}>30</strong>
                  <span className="text-[9px] opacity-70 uppercase font-sans tracking-widest font-bold">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL CHAPTER DIVIDER III */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center gap-3 py-4 px-8">
          <div className="h-[1px] flex-1 opacity-30" style={{ background: `linear-gradient(to right, transparent, ${currentSkin.themeColor}, transparent)` }} />
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-sans font-extrabold tracking-[0.25em] uppercase shadow-xs"
            style={{ 
              borderColor: currentSkin.borderColor, 
              color: currentSkin.themeColor, 
              backgroundColor: currentSkin.isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)' 
            }}
          >
            <span>{currentSkin.ornamentSymbol}</span>
            <span>CHAPTER III · TREASURED MOMENTS</span>
          </div>
          <div className="h-[1px] flex-1 opacity-30" style={{ background: `linear-gradient(to right, transparent, ${currentSkin.themeColor}, transparent)` }} />
        </div>

        {/* ========================================================================= */}
        {/* 4. BESPOKE MOMENTS GALLERY (EDITORIAL MAGAZINE LAYOUT) */}
        {/* ========================================================================= */}
        <div className="px-6 pb-4 font-sans">
          <div className="text-center mb-4">
            <span className="text-[10px] tracking-[0.3em] uppercase font-extrabold block" style={{ color: currentSkin.themeColor }}>
              {currentSkin.id === 'royal-heritage' ? '嘉禮 畵帖 (궁중 가례 화첩)' : 'EDITORIAL PHOTO SPREAD'}
            </span>
            <h4 className="text-xl font-serif tracking-wide mt-1">Treasured Moments</h4>
            <p className="text-[11px] opacity-60 font-serif italic mt-0.5">Click any photograph to view in high resolution</p>
          </div>
          
          {/* Layout: 1 Grand Master Feature Cut + 4 Curated Square Cuts */}
          <div className="space-y-2.5">
            {/* Grand Master Shot (Feature 1) */}
            {invitationData.galleryPhotos[0] && (
              <div 
                onClick={() => setActiveGalleryPhoto(invitationData.galleryPhotos[0])}
                className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden cursor-pointer shadow-xl group border transition-all duration-500 hover:scale-[1.01]"
                style={{ borderColor: currentSkin.borderColor }}
              >
                <Image 
                  src={invitationData.galleryPhotos[0]} 
                  alt="Master Portrait" 
                  fill 
                  unoptimized 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-sans font-bold tracking-widest text-white border border-white/20 uppercase">
                    FIG 01 · MASTER PORTRAIT
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white font-sans text-xs">
                  <span className="font-serif italic text-white/90">A Sacred Promise in Eternal Light</span>
                  <span className="text-[10px] opacity-75 uppercase tracking-widest font-semibold">TAP TO EXPAND</span>
                </div>
              </div>
            )}

            {/* 4 Curated Editorial Grid Cuts */}
            <div className="grid grid-cols-2 gap-2.5">
              {invitationData.galleryPhotos.slice(1, 5).map((src, i) => (
                <div 
                  key={i + 1} 
                  onClick={() => setActiveGalleryPhoto(src)}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md group border transition-all duration-500 hover:scale-[1.03]"
                  style={{ borderColor: currentSkin.borderColor }}
                >
                  <Image 
                    src={src} 
                    alt={`Moment ${i + 2}`} 
                    fill 
                    unoptimized 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-[8px] font-mono tracking-wider text-white border border-white/20">
                      0{i + 2}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL CHAPTER DIVIDER IV */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center gap-3 py-4 px-8">
          <div className="h-[1px] flex-1 opacity-30" style={{ background: `linear-gradient(to right, transparent, ${currentSkin.themeColor}, transparent)` }} />
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-sans font-extrabold tracking-[0.25em] uppercase shadow-xs"
            style={{ 
              borderColor: currentSkin.borderColor, 
              color: currentSkin.themeColor, 
              backgroundColor: currentSkin.isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)' 
            }}
          >
            <span>{currentSkin.ornamentSymbol}</span>
            <span>CHAPTER IV · THE SANCTUARY</span>
          </div>
          <div className="h-[1px] flex-1 opacity-30" style={{ background: `linear-gradient(to right, transparent, ${currentSkin.themeColor}, transparent)` }} />
        </div>

        {/* ========================================================================= */}
        {/* 5. VENUE & GOOGLE MAPS NAVIGATION */}
        {/* ========================================================================= */}
        <div className="px-6 pb-4 font-sans">
          <div 
            className="p-7 rounded-3xl border shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-left space-y-4 backdrop-blur-xs"
            style={{ 
              backgroundColor: currentSkin.cardBg, 
              borderColor: currentSkin.borderColor,
              color: currentSkin.textColor
            }}
          >
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-extrabold block mb-1" style={{ color: currentSkin.themeColor }}>
                LOCATION & DIRECTIONS
              </span>
              <h4 className="text-lg font-serif font-bold">
                {invitationData.venueName}
              </h4>
              <p className="text-xs opacity-80 mt-0.5" style={{ color: currentSkin.subTextColor }}>
                {invitationData.venueHall}
              </p>
              <p className="text-xs opacity-75 mt-1 font-mono">
                {invitationData.venueAddress}
              </p>
            </div>

            {/* Copy Address Button */}
            <button
              onClick={copyAddress}
              className="w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition hover:scale-101"
              style={{
                backgroundColor: currentSkin.isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                borderColor: currentSkin.borderColor,
                color: currentSkin.textColor
              }}
            >
              <Copy className="w-3.5 h-3.5" style={{ color: currentSkin.themeColor }} />
              <span>Copy Full Address</span>
            </button>

            {/* Google Maps Primary Navigation */}
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: currentSkin.borderColor }}>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(invitationData.venueAddress)}`}
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md hover:scale-101"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>Open in Google Maps (Live Navigation)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              {/* Secondary Navigation: Apple Maps & Waze */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold">
                <a 
                  href={`https://maps.apple.com/?daddr=${encodeURIComponent(invitationData.venueAddress)}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="py-2.5 rounded-xl bg-black hover:bg-neutral-900 text-white transition flex items-center justify-center gap-1 border border-white/20"
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

            {/* Transportation & Parking Details */}
            <div className="pt-2 text-[11px] opacity-80 space-y-1" style={{ color: currentSkin.subTextColor }}>
              <p>• <strong>Transit:</strong> {invitationData.venueTraffic}</p>
              <p>• <strong>Valet & Parking:</strong> {invitationData.venueParking}</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. EDITORIAL COLOPHON & FOOTER */}
        {/* ========================================================================= */}
        <div className="p-6 text-center space-y-4 pb-14 font-sans">
          <div className="flex items-center justify-center gap-3 py-2 px-8 mb-1">
            <div className="h-[1px] flex-1 opacity-25" style={{ background: `linear-gradient(to right, transparent, ${currentSkin.themeColor}, transparent)` }} />
            <span className="text-sm opacity-50">{currentSkin.ornamentSymbol}</span>
            <div className="h-[1px] flex-1 opacity-25" style={{ background: `linear-gradient(to right, transparent, ${currentSkin.themeColor}, transparent)` }} />
          </div>

          <button
            onClick={copyLink}
            className="w-full py-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition hover:scale-[1.01]"
            style={{
              backgroundColor: currentSkin.cardBg,
              borderColor: currentSkin.themeColor,
              color: currentSkin.textColor
            }}
          >
            <Share2 className="w-4 h-4" style={{ color: currentSkin.themeColor }} />
            <span>Share Invitation Link ({currentSkin.name})</span>
          </button>
          
          <div className="pt-2 opacity-50 space-y-1">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold">
              WEDDINGHELPER HAUTE EDITION
            </p>
            <p className="text-[9px] tracking-[0.15em] font-serif italic">
              Where Forever Begins · Handcrafted Luxury
            </p>
          </div>
        </div>

        {/* Gallery Lightbox Modal */}
        {activeGalleryPhoto && (
          <div 
            onClick={() => setActiveGalleryPhoto(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-lg w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2" style={{ borderColor: currentSkin.themeColor }}>
              <Image src={activeGalleryPhoto} alt="Full view" fill unoptimized className="object-cover" />
            </div>
          </div>
        )}

        {/* Toast Alert */}
        {copyToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#1F181B]/95 text-white text-xs font-sans font-semibold text-center shadow-2xl animate-fade-in border border-white/20">
            {copyToast}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobileInvitePage() {
  useEffect(() => {
    document.title = 'Wedding Invitation | WeddingHelper Bespoke Mobile Invitation';
  }, []);
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F181B] flex items-center justify-center text-white font-serif">Loading Luxury Invitation...</div>}>
      <InvitationContent />
    </Suspense>
  );
}
