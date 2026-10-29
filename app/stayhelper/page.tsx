"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import USAuthModal from "@/components/USAuthModal";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  MapPin,
  Star,
  ArrowUpRight,
  Calendar,
  Compass,
  Gem,
  Award,
  Lock,
  Unlock,
  X,
  Mail,
  User,
  Check,
  ShieldCheck
} from "lucide-react";

interface StayInfo {
  id: string;
  numeral: string;
  name: string;
  subtitle: string;
  location: string;
  country: string;
  badge: string;
  rating: string;
  reviews: string;
  pricePerNight: string;
  priceAmount: string;
  seasonalRange: string;
  rateInclusions: string;
  image: string;
  videoSrc: string;
  posterSrc: string;
  bookingUrl: string;
  status: "STREAMING" | "COMING_SOON";
  forbesTier: string;
  story: string[];
  features: { title: string; desc: string }[];
}

const ALL_STAYS: StayInfo[] = [
  {
    id: "stay-01",
    numeral: "I",
    name: "Amangiri Canyon Pavilion",
    subtitle: "A Monolithic Architectural Sanctuary Carved into 165-Million-Year Navajo Sandstone",
    location: "Canyon Point, Southern Utah",
    country: "Utah, United States",
    badge: "COLLECTION № 01 · UTAH DESERT",
    rating: "4.99",
    reviews: "890+",
    pricePerNight: "From $3,450",
    priceAmount: "$3,450",
    seasonalRange: "Low $3,450+ · Peak $5,800+",
    rateInclusions: "Includes full-board dining for 2 & Page airport transfers",
    forbesTier: "Forbes Travel Guide 5-Star",
    image: "/images/stayhelper/amangiri_canyon.jpg",
    videoSrc: "/videos/StayHelperAmangiri_v1_MasterReel.mp4",
    posterSrc: "/images/stayhelper/amangiri_01_arrival.jpg",
    bookingUrl: "https://www.trip.com/hotels/kane-county-hotel-detail-690559/amangiri/",
    status: "STREAMING",
    story: [
      "Discreetly hidden across 600 pristine acres of the southern Utah desert, Amangiri is an architectural triumph that blends seamlessly into raw 165-million-year-old Navajo sandstone escarpments. Here, minimalist concrete geometry and untamed geological formations unite to create an oasis of unearthly silence and monumental beauty.",
      "At the resort’s heart, a legendary rock-carved swimming pool curves organically around a colossal natural mesa. Private pavilion suites frame boundless canyon sunsets through floor-to-ceiling glass, opening onto private outdoor plunge pools and fire terraces beneath star-saturated desert skies."
    ],
    features: [
      { title: "Monolithic Rock Escarpment Pool", desc: "Sculpted directly around a dramatic 165M-year sandstone monolith" },
      { title: "Mesa View Pavilion Suites", desc: "Private desert courtyards with open-air fire pits and daybeds" },
      { title: "Navajo Hydrotherapy Spa", desc: "Water Pavilion with private outdoor flotation therapy and sauna" }
    ]
  },
  {
    id: "stay-02",
    numeral: "II",
    name: "The Kayon Jungle Resort",
    subtitle: "Three-Tiered Valley Infinity Pool Sanctuary Above the Sacred Ubud Rainforest",
    location: "Bresela, Payangan, Ubud, Bali",
    country: "Bali, Indonesia",
    badge: "COLLECTION № 02 · BALI CANYON",
    rating: "4.98",
    reviews: "1,240+",
    pricePerNight: "From $480",
    priceAmount: "$480",
    seasonalRange: "Low $420+ · High $680+",
    rateInclusions: "Includes gourmet valley breakfast & afternoon tea",
    forbesTier: "Condé Nast Traveler Gold List",
    image: "/images/stayhelper/scene_01_infinity_pool.png",
    videoSrc: "/videos/StayHelperBaliVilla_v10_GrandFinaleMaster.mp4",
    posterSrc: "/images/stayhelper/scene_01_infinity_pool.png",
    bookingUrl: "https://www.trip.com/hotels/bali-hotel-detail-22019000/the-kayon-jungle-resort-adult-only/",
    status: "STREAMING",
    story: [
      "Perched dramatically above the sacred Cerapu River valley in Ubud, The Kayon Jungle Resort is an exclusive adults-only haven inspired by the geometric terraces of ancient Balinese rice fields.",
      "Framed by an emerald virgin rainforest canopy, its iconic three-tiered infinity pool cascades like terraced water mirrors down the ravine. Handcrafted volcanic stone pavilions and thatched alang-alang villas envelop guests in mist, birdsong, and restorative spiritual tranquility."
    ],
    features: [
      { title: "3-Tiered Canyon Infinity Pools", desc: "Cascading organic pools suspended over the sacred river valley" },
      { title: "Traditional Alang-Alang Villas", desc: "Private hillside villas with personal infinity plunges" },
      { title: "Serayu Forest Spa Sanctuary", desc: "Open-air therapeutic treatment decks facing the rainforest canopy" }
    ]
  },
  {
    id: "stay-03",
    numeral: "III",
    name: "Bulgari Resort & Mansions",
    subtitle: "Mediterranean Maritime Opulence on a Private Seahorse-Shaped Island",
    location: "Jumeira Bay Island, Dubai",
    country: "Dubai, UAE",
    badge: "COLLECTION № 03 · DUBAI ISLAND",
    rating: "4.97",
    reviews: "950+",
    pricePerNight: "From $1,750",
    priceAmount: "$1,750",
    seasonalRange: "Summer $1,100+ · Winter Peak $2,400+",
    rateInclusions: "Includes Mediterranean breakfast & private yacht marina access",
    forbesTier: "World's 50 Best Luxury Stays",
    image: "/images/stayhelper/bulgari_01_arrival.jpg",
    videoSrc: "/videos/StayHelperBulgari_v1_CinematicMaster.mp4",
    posterSrc: "/images/stayhelper/bulgari_01_arrival.jpg",
    bookingUrl: "https://www.trip.com/hotels/dubai-hotel-detail-2189035/bulgari-resort-dubai/",
    status: "STREAMING",
    story: [
      "Carved into the tranquil waters of Jumeira Bay Island, Bulgari Resort Dubai marries Mediterranean coastal grace with visionary Italian craftsmanship, designed by legendary architectural studio ACPV ARCHITECTS.",
      "Featuring pristine white-sand private coves, a world-exclusive 46-boat superyacht marina, and culinary artistry by Michelin-starred Chef Niko Romito, it offers an enclave of absolute privacy against the golden Arabian Gulf horizon."
    ],
    features: [
      { title: "Private Superyacht Marina", desc: "46-berth exclusive harbor with members-only yacht club" },
      { title: "Il Ristorante - Niko Romito", desc: "Two Michelin-starred contemporary Italian gastronomy" },
      { title: "Secluded Oceanfront Mansions", desc: "Private beach gardens, temperature-controlled pools and butler service" }
    ]
  },
  {
    id: "stay-04",
    numeral: "IV",
    name: "Four Seasons Tented Camp",
    subtitle: "Romantic 19th-Century Safari Luxury in the Mist-Shrouded Bamboo Jungle",
    location: "Golden Triangle, Chiang Rai",
    country: "Chiang Rai, Thailand",
    badge: "COLLECTION № 04 · GOLDEN TRIANGLE",
    rating: "4.96",
    reviews: "680+",
    pricePerNight: "From $2,450",
    priceAmount: "$2,450",
    seasonalRange: "Regular $2,450+ · Peak $3,200+",
    rateInclusions: "All-inclusive: meals, drinks & ethical elephant experience",
    forbesTier: "Architectural Digest Top 10 World Retreats",
    image: "/images/stayhelper/tented_01_arrival.jpg",
    videoSrc: "/videos/StayHelperFourSeasons_v1_CinematicMaster.mp4",
    posterSrc: "/images/stayhelper/tented_01_arrival.jpg",
    bookingUrl: "https://www.trip.com/hotels/chiang-saen-hotel-detail-489234/four-seasons-tented-camp-golden-triangle/",
    status: "STREAMING",
    story: [
      "Tucked within dense bamboo forest where Thailand, Laos, and Myanmar meet along the Ruak River, Four Seasons Tented Camp Golden Triangle resurrects the adventurous romance of 19th-century luxury expeditions.",
      "Fifteen handcrafted safari tents showcase bespoke copper soaking tubs, river-view sundecks, and ethical morning encounters with rescued Asian elephants amidst the tranquil jungle mist."
    ],
    features: [
      { title: "Ruak River Safari Pavilions", desc: "Tailored canvas lodges with custom hammer-crafted copper bathtubs" },
      { title: "Ethical Elephant Encounters", desc: "Dawn walks and natural habitat immersion with dedicated handlers" },
      { title: "Jungle-To-River Expeditions", desc: "Private longtail river cruises and candlelit forest dining" }
    ]
  }
];

interface MemberData {
  name: string;
  email: string;
  signedUpAt?: string;
}

export default function StayHelperLuxuryShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedStayId, setSelectedStayId] = useState<string>("stay-01");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isEnded, setIsEnded] = useState<boolean>(false);

  // VIP Membership State
  const [member, setMember] = useState<MemberData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [inputName, setInputName] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);

  // Read member status from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("stayhelper_member");
      if (stored) {
        setMember(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Local storage load error", e);
    }
  }, []);

  const currentStay = ALL_STAYS.find((s) => s.id === selectedStayId) || ALL_STAYS[0];

  const handleSelectStay = (id: string) => {
    setSelectedStayId(id);
    setIsEnded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isEnded) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setIsEnded(false);
      return;
    }
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setIsEnded(false);
  };

  // Handle Booking Button Click (Requires VIP Membership Sign-up)
  const handleBookingAction = (targetUrl: string) => {
    if (member) {
      // Already a member -> Direct forward to Trip.com
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    } else {
      // Unregistered user -> Open Luxury Sign-Up Modal to capture first-party data
      setPendingRedirectUrl(targetUrl);
      setIsAuthModalOpen(true);
    }
  };

  // Submit VIP Sign-Up Form
  const handleMemberSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail || !inputEmail.includes("@")) {
      setAuthError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setAuthError("");

    try {
      const res = await fetch("/api/stayhelper/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inputName.trim() || "Private Member",
          email: inputEmail.trim(),
          interestedHotel: currentStay.name,
          destination: currentStay.country
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register membership");
      }

      const newMember: MemberData = {
        name: data.member?.name || inputName.trim() || "Private Member",
        email: data.member?.email || inputEmail.trim()
      };

      // Save locally
      localStorage.setItem("stayhelper_member", JSON.stringify(newMember));
      setMember(newMember);
      setIsAuthModalOpen(false);

      // Open the intended booking destination immediately
      const target = pendingRedirectUrl || currentStay.bookingUrl;
      window.open(target, "_blank", "noopener,noreferrer");
      setPendingRedirectUrl(null);
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#292524] selection:bg-[#E8DCC4] selection:text-[#1C1917] font-luxury-sans">
      {/* LUXURY AMBIENT BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#F2E8D5]/60 via-[#FAF7F2]/40 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[400px] right-0 w-[500px] h-[500px] bg-[#EFE3CD]/40 rounded-full blur-3xl opacity-50" />
      </div>

      {/* 1. REFINED LUXURY TOP BAR */}
      <div className="bg-[#1C1917] text-[#FAF7F2] py-2 px-4 text-center border-b border-[#2E2824]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-luxury-sans tracking-widest uppercase">
          <span className="hidden sm:inline-block text-[#B89B72]">
            StayHelper Private Collection · Curated Ultra-Luxury Escapes
          </span>
          <span className="mx-auto sm:mx-0 flex items-center gap-1.5 text-stone-300">
            <Gem className="w-3 h-3 text-[#D4AF37]" />
            Direct Premier Reservation Link · Zero Service Fees
          </span>
          <span className="hidden sm:inline-block text-stone-400 font-mono">
            8K CINEMATOGRAPHY
          </span>
        </div>
      </div>

      {/* 2. MAIN EDITORIAL HEADER */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E7DEC8]/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 sm:h-24 flex items-center justify-between">
          <Link href="/stayhelper" className="flex items-center space-x-3.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2E2824] to-[#1C1917] flex items-center justify-center text-[#E8D5B5] font-luxury-serif font-semibold text-xl shadow-md border border-[#C5A880]/30 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-luxury-serif tracking-[0.18em] font-medium text-[#1C1917] uppercase">
                  STAYHELPER
                </span>
                <span className="text-[9px] tracking-widest font-mono px-2 py-0.5 rounded-full bg-[#EFE7D8] text-[#8F703C] font-semibold border border-[#DFCFA9]">
                  PRIVATE COLLECTION
                </span>
              </div>
              <span className="block text-[10px] tracking-[0.25em] text-[#8F703C] uppercase font-luxury-sans font-medium mt-0.5">
                The World’s Most Extraordinary Sanctuaries
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {member ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7D8] border border-[#DFCFA9] text-xs font-luxury-sans text-[#8F703C] font-medium shadow-sm">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Private Member: <strong className="text-[#1C1917]">{member.name}</strong></span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setPendingRedirectUrl(currentStay.bookingUrl);
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 rounded-full border border-[#DFCFA9] hover:border-[#8F703C] bg-white/80 hover:bg-white text-xs font-luxury-sans font-medium text-[#8F703C] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-[#8F703C]" />
                <span>Join Private Club</span>
              </button>
            )}

            <button
              onClick={() => handleBookingAction(currentStay.bookingUrl)}
              className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-black text-[#F4E8D4] text-xs font-luxury-sans font-medium tracking-wider transition-all duration-300 shadow-md shadow-stone-900/10 flex items-center gap-2 border border-[#C5A880]/40 group"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Let's Book Your Stay ↗</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. FIRST-SCREEN CURATED CAPSULE SELECTOR (ABOVE-THE-FOLD GALLERY) */}
      <section className="border-b border-[#E7DEC8]/80 bg-gradient-to-b from-[#F7F2E9]/70 to-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#8F703C]" />
              <h3 className="text-xs sm:text-sm font-luxury-serif tracking-[0.2em] font-semibold text-[#1C1917] uppercase">
                Curated Luxury Lineup
              </h3>
            </div>
            <span className="text-[11px] font-luxury-sans text-[#78716C] tracking-wide hidden sm:inline-block">
              Select any destination to switch 8K Master Reel and architectural story
            </span>
          </div>

          {/* 4 Architectural Collection Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {ALL_STAYS.map((stay) => {
              const isSelected = stay.id === selectedStayId;
              return (
                <button
                  key={stay.id}
                  onClick={() => handleSelectStay(stay.id)}
                  className={`text-left p-3 rounded-2xl transition-all duration-300 relative flex items-center gap-3.5 group overflow-hidden ${
                    isSelected
                      ? "bg-white border-[#B89B72] ring-2 ring-[#B89B72]/30 shadow-lg shadow-[#B89B72]/10"
                      : "bg-white/70 border border-[#E7DEC8] hover:border-[#C5A880] hover:bg-white"
                  }`}
                >
                  <div className="relative w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200 shadow-sm">
                    <Image
                      src={stay.image}
                      alt={stay.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute top-1 left-1.5 text-[9px] font-luxury-serif font-bold text-[#F4E8D4]">
                      {stay.numeral}
                    </span>
                    {stay.status === "STREAMING" && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[8px] font-mono text-[#E8D5B5] border border-[#C5A880]/40">
                        8K
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] tracking-wider text-[#8F703C] uppercase font-luxury-sans font-medium truncate">
                      {stay.country}
                    </span>
                    <h4
                      className={`text-sm sm:text-[15px] font-luxury-serif font-semibold truncate leading-snug mt-0.5 transition-colors ${
                        isSelected ? "text-[#1C1917]" : "text-[#44403C] group-hover:text-[#1C1917]"
                      }`}
                    >
                      {stay.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-xs font-luxury-sans font-semibold text-[#1C1917]">
                        {stay.pricePerNight}
                      </span>
                      <span className="text-[10px] text-stone-400 font-luxury-sans">/ night</span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#B89B72]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. MAIN CINEMATIC EXHIBIT: 8K MASTER REEL & EDITORIAL DOSSIER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Haute-Couture 9:16 Vertical Reel Player */}
          <div className="lg:col-span-5 flex justify-center sticky lg:top-28">
            <div className="relative w-full max-w-[430px] xl:max-w-[440px]">
              {/* Warm Golden Halo Backdrop Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#D4AF37]/20 via-[#B89B72]/15 to-transparent blur-3xl -z-10 rounded-full" />

              {/* Museum-Grade Showcase Chassis */}
              <div className="relative aspect-[9/16] rounded-[32px] overflow-hidden shadow-2xl shadow-stone-900/20 border-[3px] border-[#1C1917] bg-[#0E0D0C] ring-1 ring-[#C5A880]/50 group">
                <video
                  ref={videoRef}
                  key={currentStay.id}
                  src={currentStay.videoSrc}
                  poster={currentStay.posterSrc}
                  playsInline
                  autoPlay
                  muted={isMuted}
                  onEnded={() => {
                    setIsPlaying(false);
                    setIsEnded(true);
                  }}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => handleBookingAction(currentStay.bookingUrl)}
                  title="Click to check live rates and reserve"
                />

                {/* Option B: Final VIP Lockup Replay & Conversion Overlay */}
                {isEnded && (
                  <div
                    onClick={() => handleBookingAction(currentStay.bookingUrl)}
                    className="absolute inset-0 bg-black/55 backdrop-blur-[3px] z-30 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#FDE047] text-[11px] font-mono uppercase tracking-widest mb-3">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>Reel Complete · Live Rate Available</span>
                    </div>
                    <div className="text-2xl font-luxury-serif font-medium text-white mb-1">
                      {currentStay.name}
                    </div>
                    <div className="text-sm font-luxury-sans text-[#E8D5B5] mb-5">
                      {currentStay.priceAmount} USD / night · Trip.com Live Partner Link
                    </div>

                    {/* High-Converting CTA Button ("부킹하러 가자!" 감성 반영) */}
                    <div className="w-full max-w-[290px] py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#FDE047] hover:brightness-110 text-black font-luxury-sans font-bold text-sm flex items-center justify-center gap-2 shadow-2xl transition-transform hover:scale-105 mb-3">
                      <Calendar className="w-4 h-4 text-black" />
                      <span>Let's Book Your Stay ↗</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        restartVideo();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/80 hover:bg-black text-stone-300 hover:text-white text-xs font-mono border border-white/20 shadow-lg transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Replay Video (다시보기)</span>
                    </button>
                  </div>
                )}

                {/* Hover Invitation Overlay */}
                {!isEnded && (
                  <div
                    onClick={() => handleBookingAction(currentStay.bookingUrl)}
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-10"
                  >
                    <div className="px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-md border border-[#C5A880]/70 text-[#F4E8D4] text-xs font-luxury-sans font-medium flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Let's Book Your Stay ↗</span>
                    </div>
                  </div>
                )}

                {/* Top Video Cinema Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.2 rounded-full border border-white/20 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#F4E8D4] tracking-wider uppercase font-semibold">
                      8K Master Reel
                    </span>
                  </div>
                  <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-luxury-sans text-[#E8D5B5] flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="font-semibold">{currentStay.rating}</span>
                  </div>
                </div>

                {/* Bottom Video Controls Bar */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-[#E8D5B5] transition p-1"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-[#E8D5B5] transition p-1"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
                    </button>
                    <span className="text-[11px] font-mono text-stone-300">
                      {isMuted ? "Muted" : "Audio On"}
                    </span>
                  </div>
                  {isEnded && (
                    <button
                      onClick={restartVideo}
                      className="text-stone-300 hover:text-white transition flex items-center gap-1.5 text-[11px] font-mono"
                      title="Replay video"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Replay</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Dossier & Direct Affiliate Monetization */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Curated Sanctuary Identity */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7D8] border border-[#DFCFA9] text-[#8F703C] text-xs font-luxury-sans font-semibold tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#8F703C]" />
                <span>{currentStay.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-luxury-serif font-medium text-[#1C1917] tracking-tight leading-[1.08]">
                {currentStay.name}
              </h1>

              <p className="text-base sm:text-lg italic font-luxury-serif text-[#785D2E] mt-2 leading-snug">
                {currentStay.subtitle}
              </p>

              {/* Geographic and Recognition Badges */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-stone-600">
                <span className="flex items-center gap-1.5 text-stone-800 font-medium">
                  <MapPin className="w-4 h-4 text-[#8F703C]" />
                  <span>{currentStay.location}</span>
                </span>
                <span className="text-stone-300">•</span>
                <div className="flex items-center gap-1 text-[#8F703C]">
                  <Star className="w-4 h-4 fill-[#8F703C]" />
                  <span className="font-semibold text-stone-900">{currentStay.rating}</span>
                  <span className="text-xs text-stone-500">({currentStay.reviews} Verified Guest Reviews)</span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1.5 text-stone-800 font-medium font-luxury-sans">
                  <Award className="w-4 h-4 text-[#8F703C]" />
                  <span>{currentStay.forbesTier}</span>
                </span>
              </div>
            </div>

            {/* Editorial Review & Architectural Narrative */}
            <div className="space-y-4 text-base sm:text-lg text-[#44403C] font-luxury-serif leading-relaxed pt-4 border-t border-[#E7DEC8]">
              {currentStay.story.map((paragraph, idx) => (
                <p key={idx} className="tracking-wide">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Signature Architectural Highlights (3 Capsules) */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-luxury-sans tracking-widest text-[#8F703C] uppercase font-semibold">
                Signature Architectural Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentStay.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-[#E7DEC8] shadow-sm hover:border-[#C5A880] transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-luxury-sans font-bold text-[#1C1917]">
                      <span className="text-[#8F703C]">✦</span>
                      <span>{feat.title}</span>
                    </div>
                    <p className="text-[11px] font-luxury-sans text-stone-500 mt-1 leading-snug">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ★ LUXURY BOOKING SUITE (COMMISSION MONETIZATION ENGINE) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-[#FCFAF7] to-[#F7F2E8] border border-[#DFCFA9] shadow-lg shadow-[#B89B72]/10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DEC8] pb-4">
                <div>
                  <span className="block text-[11px] tracking-widest font-luxury-sans uppercase text-[#8F703C] font-semibold">
                    Premier Booking Link
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-luxury-serif font-bold text-[#1C1917]">
                      {currentStay.priceAmount}
                    </span>
                    <span className="text-xs text-stone-500 font-luxury-sans">
                      USD / night · Trip.com Live Rate
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {member ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-luxury-sans font-medium text-emerald-800">
                      <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Member Access Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DFCFA9] text-xs font-luxury-sans font-medium text-[#8F703C]">
                      <Lock className="w-3.5 h-3.5 text-[#8F703C]" />
                      <span>Complimentary Sign-up Required</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Seasonal Range & Inclusions Pill */}
              <div className="rounded-2xl bg-[#FAF7F2] border border-[#E7DEC8] p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-luxury-sans text-[#8F703C]">
                  <span>🗓️</span>
                  <span className="font-semibold text-[#1C1917]">Seasonal Estimate:</span>
                  <span className="text-stone-700 font-medium">{currentStay.seasonalRange}</span>
                </div>
                {currentStay.rateInclusions && (
                  <div className="text-[11px] font-luxury-sans text-stone-500 flex items-center gap-2 pl-0.5">
                    <span>✨</span>
                    <span>{currentStay.rateInclusions}</span>
                  </div>
                )}
              </div>

              {/* Primary Affiliate Conversion Button */}
              <div>
                <button
                  onClick={() => handleBookingAction(currentStay.bookingUrl)}
                  className="w-full py-4 px-6 rounded-2xl bg-[#1C1917] hover:bg-black text-[#F4E8D4] font-luxury-sans font-semibold text-base tracking-wide transition-all duration-300 shadow-xl shadow-stone-900/15 flex items-center justify-center gap-3 border border-[#C5A880]/50 group"
                >
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  <span>Let's Book Your Stay ↗</span>
                  <ArrowUpRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>

                {/* Honest, transparent single note */}
                <p className="text-center text-xs text-stone-500 font-luxury-sans mt-3">
                  Zero StayHelper service or membership fees · Direct booking with official partner
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 5. EDITORIAL FOOTER & DISCLOSURE */}
      <footer className="border-t border-[#E7DEC8] bg-[#F7F2E9] py-10 px-4 sm:px-8 text-xs text-[#78716C]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-luxury-serif text-lg font-bold text-[#1C1917] tracking-wider uppercase">
                STAYHELPER
              </span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                The Private Luxury Collection · 8K AI Physical Cinematics
              </p>
            </div>
            <div className="text-right text-[11px] text-stone-500 font-luxury-sans">
              <span>© {new Date().getFullYear()} StayHelper Private Collection. All Rights Reserved.</span>
            </div>
          </div>

          <div className="border-t border-[#E7DEC8]/80 pt-4 text-[11px] text-stone-500 font-luxury-sans leading-relaxed">
            <p>
              StayHelper is an independent luxury hospitality curation platform. We partner with world-renowned official booking engines (including Trip.com) to provide seamless reservation access. When you reserve through our verified links, we may earn an affiliate commission at zero additional cost to you.
            </p>
          </div>
        </div>
      </footer>

      {/* 6. ★ COMPLIMENTARY LUXURY MEMBERSHIP MODAL (ROOMHELPER-IDENTICAL 1-CLICK AUTH) */}
      <USAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="StayHelper Private Club"
        subtitle="Complimentary private membership. Join to unlock direct partner reservation links, live room rates, and 8K sanctuary cinematics."
        onSuccess={(user) => {
          const newMember: MemberData = {
            name: user.name || user.email.split("@")[0],
            email: user.email,
            signedUpAt: new Date().toISOString(),
          };
          setMember(newMember);
          setIsAuthModalOpen(false);
          const target = pendingRedirectUrl || currentStay.bookingUrl;
          window.open(target, "_blank", "noopener,noreferrer");
          setPendingRedirectUrl(null);
        }}
      />
    </div>
  );
}
