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
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface StayInfo {
  wideHero?: string;
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
    wideHero: "/images/stayhelper/bulgari_01_arrival.jpg",
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
    wideHero: "/images/stayhelper/tented_01_arrival.jpg",
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
  },
  {
    id: "stay-05",
    numeral: "V",
    name: "Soneva Jani Water Reserve",
    subtitle: "Overwater Lagoon Villas with Spiral Water Slides & Retractable Starlight Pavilions",
    location: "Medhufaru Island, Noonu Atoll",
    country: "Maldives",
    badge: "COLLECTION № 05 · MALDIVES ATOLL",
    rating: "4.99",
    reviews: "1,150+",
    pricePerNight: "From $3,200",
    priceAmount: "$3,200",
    seasonalRange: "Low $2,800+ · Festive $5,400+",
    rateInclusions: "Includes scenic seaplane flight transfers & barefoot private island dining",
    forbesTier: "World's 50 Best Luxury Hotels",
    image: "/images/stayhelper/soneva_jani_01_water_retreat.jpg",
    videoSrc: "/videos/StayHelperSonevaJani_v1_CinematicMaster.mp4",
    posterSrc: "/images/stayhelper/soneva_jani_01_water_retreat.jpg",
    bookingUrl: "https://www.trip.com/hotels/noonu-atoll-hotel-detail-7009366/soneva-jani/",
    status: "STREAMING",
    story: [
      "Perched within a massive 5-kilometer turquoise lagoon in the tranquil Noonu Atoll, Soneva Jani defines the pinnacle of barefoot sustainable luxury. Curved wooden boardwalks stretch over transparent, shallow azure waters teeming with marine life.",
      "Each iconic multi-story Water Reserve features its own spiraling slide directly into the Indian Ocean lagoon, expansive catamaran netting daybeds, and a master bedroom with an automated retractable roof that glides open to unveil the starlit equatorial sky."
    ],
    features: [
      { title: "Lagoon Overwater Slides", desc: "Curved private water slides plunging directly into the azure Indian Ocean" },
      { title: "Retractable Starlight Ceiling", desc: "Master bedroom roof opens at the touch of a button for stargazing in bed" },
      { title: "The Gathering Sanctuary", desc: "Three-story open-air timber dining and astronomical observatory over water" }
    ]
  },
  {
    id: "stay-06",
    numeral: "VI",
    name: "The Chedi Andermatt",
    subtitle: "Monumental Alpine Grandeur & Steaming Thermal Pools in the Heart of the Swiss Alps",
    location: "Andermatt, Canton of Uri",
    country: "Swiss Alps, Switzerland",
    badge: "COLLECTION № 06 · SWISS ALPS",
    rating: "4.98",
    reviews: "790+",
    pricePerNight: "From $1,450",
    priceAmount: "$1,450",
    seasonalRange: "Summer $1,100+ · Ski Peak $2,600+",
    rateInclusions: "Includes alpine artisan breakfast buffet & comprehensive thermal spa access",
    forbesTier: "Forbes Travel Guide 5-Star Hotel",
    image: "/images/stayhelper/chedi_andermatt_wide_hero.jpg",
    wideHero: "/images/stayhelper/chedi_andermatt_wide_hero.jpg",
    videoSrc: "/videos/StayHelperChediAndermatt_v1_CinematicMaster.mp4",
    posterSrc: "/images/stayhelper/chedi_andermatt_01_alpine_pool.jpg",
    bookingUrl: "https://www.trip.com/hotels/andermatt-hotel-detail-1628174/the-chedi-andermatt/",
    status: "STREAMING",
    story: [
      "Nestled amidst the snow-blanketed peaks of the Urseren Valley, The Chedi Andermatt marries classic Swiss alpine warmth with sleek Asian Zen minimalism, masterfully envisioned by legendary architect Jean-Michel Gathy.",
      "Dramatic dark timber beams, open stone fireplaces, and floor-to-ceiling glass pavilions frame breathtaking alpine winterscapes. The resort’s centerpiece 2,400-square-meter spa features a 35-meter indoor pool and steaming outdoor thermal baths where guests soak under falling mountain snow."
    ],
    features: [
      { title: "Heated Alpine Thermal Pool", desc: "35-meter indoor pool and outdoor thermal pool surrounded by snowy peaks" },
      { title: "Jean-Michel Gathy Alpine Design", desc: "Striking dark woods, soft leather, and monumental granite fireplaces" },
      { title: "Michelin Japanese Gastronomy", desc: "The Japanese Restaurant with an authentic 9-seat Omakase and sake bar" }
    ]
  },
  {
    id: "stay-07",
    numeral: "VII",
    name: "Monastero Santa Rosa Hotel & Spa",
    subtitle: "17th-Century Dominican Monastery & Cliff-Edge Infinity Sanctuary Over the Amalfi Gulf",
    location: "Conca dei Marini, Amalfi Coast",
    country: "Amalfi Coast, Italy",
    badge: "COLLECTION № 07 · AMALFI COAST",
    rating: "4.99",
    reviews: "620+",
    pricePerNight: "From $1,850",
    priceAmount: "$1,850",
    seasonalRange: "Spring $1,400+ · Summer Peak $2,700+",
    rateInclusions: "Includes cliffside terrace breakfast & full thermal Roman bath suite",
    forbesTier: "Condé Nast Traveler Readers' Choice #1 Hotel",
    image: "/images/stayhelper/monastero_santa_rosa_01_amalfi_infinity.jpg",
    videoSrc: "/videos/StayHelperMonastero_v1_CinematicMaster.mp4",
    posterSrc: "/images/stayhelper/monastero_santa_rosa_01_amalfi_infinity.jpg",
    bookingUrl: "https://www.trip.com/hotels/conca-dei-marini-hotel-detail-2180876/monastero-santa-rosa-hotel-spa/",
    status: "STREAMING",
    story: [
      "Clinging dramatically to a vertical limestone cliff soaring above the sapphire Tyrrhenian Sea, Monastero Santa Rosa is an exquisite restoration of a 17th-century Dominican convent along Italy's most storied coast.",
      "Cascading multi-level terraced gardens fragrant with rosemary and lemon blossoms lead to an elliptical infinity pool that appears suspended directly between sky and ocean. Ancient vaulted monastery corridors now shelter luxurious guest rooms celebrating authentic Italian heritage."
    ],
    features: [
      { title: "Amalfi Sheer Cliff Infinity Pool", desc: "Suspended high over the sapphire sea with panoramic bay vistas" },
      { title: "Historic Monastery Heritage", desc: "Preserved vaulted ceilings, rustic stone arches, and aromatic herb gardens" },
      { title: "Thermal Roman Bath Circuit", desc: "Hydrotherapy pool, tepidarium, crushed-ice fountain, and sauna" }
    ]
  },
  {
    id: "stay-08",
    numeral: "VIII",
    name: "Aman Kyoto Secret Garden",
    subtitle: "A Hidden Moss Garden & Mineral Onsen Sanctuary in Kyoto’s Ancient Cedar Forest",
    location: "Takagamine, Kita Ward, Kyoto",
    country: "Kyoto, Japan",
    badge: "COLLECTION № 08 · KYOTO FOREST",
    rating: "4.99",
    reviews: "540+",
    pricePerNight: "From $2,600",
    priceAmount: "$2,600",
    seasonalRange: "Winter $2,200+ · Autumn Foliage $3,800+",
    rateInclusions: "Includes bespoke seasonal Kaiseki breakfast & private onsen bath session",
    forbesTier: "Architectural Digest World Architectural Triumph",
    image: "/images/stayhelper/aman_kyoto_01_secret_garden.jpg",
    videoSrc: "/videos/StayHelperAmanKyoto_v1_CinematicMaster.mp4",
    posterSrc: "/images/stayhelper/aman_kyoto_01_secret_garden.jpg",
    bookingUrl: "https://www.trip.com/hotels/kyoto-hotel-detail-43750875/aman-kyoto/",
    status: "STREAMING",
    story: [
      "Concealed within 79 acres of secluded cedar and maple forest at the foot of Kyoto’s sacred Takagamine mountains, Aman Kyoto is an ethereal architectural homage to classical Japanese ryokan aesthetics and Kerry Hill's timeless minimalism.",
      "Moss-carpeted stone pathways and ancient granite staircases weave past babbling mountain brooks into private cedarwood pavilions. Scented hinoki wood onsen baths fed by pure local mineral springs offer complete spiritual rejuvenation enveloped in tranquil forest mist."
    ],
    features: [
      { title: "Living Moss Garden Estate", desc: "Ancient stone pathways winding through Japanese maples and cedar groves" },
      { title: "Natural Thermal Spring Onsen", desc: "Healing outdoor and indoor onsen baths drawing from local mineral springs" },
      { title: "Authentic Hinoki Wood Pavilions", desc: "Minimalist cedar suites framing floor-to-ceiling forest tranquility" }
    ]
  },
  {
    id: "stay-09",
    numeral: "IX",
    name: "Capella Ubud Rainforest Retreat",
    subtitle: "Bill Bensley Ultra-Luxury Tented Sanctuaries Nestled in the Sacred Keliki Gorge",
    location: "Keliki, Tegallalang, Ubud, Bali",
    country: "Bali, Indonesia",
    badge: "COLLECTION № 09 · UBUD CANYON",
    rating: "4.98",
    reviews: "820+",
    pricePerNight: "From $1,150",
    priceAmount: "$1,150",
    seasonalRange: "Low $950+ · High $1,650+",
    rateInclusions: "Includes camp breakfast, afternoon tea, camp captain & campfire s'mores",
    forbesTier: "Travel + Leisure World's Best Resort Hotel",
    image: "/images/stayhelper/capella_ubud_01_rainforest_tent.jpg",
    videoSrc: "/videos/StayHelperCapellaUbud_v1_CinematicMaster.mp4",
    posterSrc: "/images/stayhelper/capella_ubud_01_rainforest_tent.jpg",
    bookingUrl: "https://www.trip.com/hotels/bali-hotel-detail-16982635/capella-ubud-bali/",
    status: "STREAMING",
    story: [
      "Hidden deep in the lush, untamed rainforest canopy of Ubud’s sacred Keliki Valley, Capella Ubud is a visionary tribute to early 19th-century European explorers, masterfully crafted without cutting down a single indigenous tree.",
      "Twenty-two bespoke one-bedroom tented retreats feature opulent antique furnishings, handcrafted hammered copper bathtubs, and private saltwater plunge pools perched above emerald ravines. Nightly campfires under starry Balinese skies evoke timeless jungle romance."
    ],
    features: [
      { title: "Bespoke Bensley Tented Lodges", desc: "One-of-a-kind antique furnishings, custom copper tubs, and private decks" },
      { title: "Private Saltwater Plunge Pools", desc: "Individual plunge pools cantilevered over lush tropical rainforest ravines" },
      { title: "Api Jiwa Live Charcoal Dining", desc: "Intimate open-fire chef’s counter crafting seasonal Robatayaki-style menus" }
    ]
  },
  {
    id: "stay-10",
    numeral: "X",
    name: "Hôtel du Cap-Eden-Roc",
    subtitle: "The Riviera’s Ultimate Legendary Palace with Basalt Cliff Seawater Pool",
    location: "Cap d'Antibes, Côte d'Azur",
    country: "French Riviera, France",
    badge: "COLLECTION № 10 · FRENCH RIVIERA",
    rating: "4.99",
    reviews: "1,450+",
    pricePerNight: "From $2,100",
    priceAmount: "$2,100",
    seasonalRange: "Low $1,650+ · Summer Grand Prix $3,900+",
    rateInclusions: "Includes seafront buffet breakfast & private coastal cabana day pass",
    forbesTier: "Palace Distinction & Condé Nast Gold List",
    image: "/images/stayhelper/eden_roc_01_riviera_pool.jpg",
    videoSrc: "/videos/StayHelperEdenRoc_v1_CinematicMaster.mp4",
    posterSrc: "/images/stayhelper/eden_roc_01_riviera_pool.jpg",
    bookingUrl: "https://www.trip.com/hotels/antibes-hotel-detail-2195021/hotel-du-cap-eden-roc/",
    status: "STREAMING",
    story: [
      "Commanding the southern tip of Cap d’Antibes since 1870, Hôtel du Cap-Eden-Roc stands as the timeless crown jewel of the French Riviera, long cherished by European royalty, literary titans, and cinema royalty during the Cannes Film Festival.",
      "Surrounded by thirty-three acres of majestic Aleppo pine groves and fragrant rose gardens, its world-famous seawater pool is carved directly into white coastal limestone rocks, offering private cabanas and peerless Mediterranean glamour."
    ],
    features: [
      { title: "Iconic Cliff Seawater Pool", desc: "Carved into sheer coastal basalt rocks directly above the Mediterranean waves" },
      { title: "Century-Old Private Pine Groves", desc: "33 acres of immaculate gardens hosting royalty, artists, and screen legends" },
      { title: "Dior Spa Eden-Roc", desc: "Holistic Mediterranean wellness treatments in open-air coastal cabanas" }
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
  const dockScrollRef = useRef<HTMLDivElement>(null);
  
  const [selectedStayId, setSelectedStayId] = useState<string>("stay-06"); // The Chedi Andermatt default
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isEnded, setIsEnded] = useState<boolean>(false);

  // VIP Membership State
  const [member, setMember] = useState<MemberData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
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
  const currentIndex = ALL_STAYS.findIndex((s) => s.id === selectedStayId);
  const heroBackground = currentStay.wideHero || currentStay.posterSrc;

  // Auto-scroll active item into view in the dock
  useEffect(() => {
    if (dockScrollRef.current) {
      const activeEl = dockScrollRef.current.querySelector(`[data-dock-id="${selectedStayId}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [selectedStayId]);

  const handlePrevStay = () => {
    const prevIdx = (currentIndex - 1 + ALL_STAYS.length) % ALL_STAYS.length;
    handleSelectStay(ALL_STAYS[prevIdx].id);
  };

  const handleNextStay = () => {
    const nextIdx = (currentIndex + 1) % ALL_STAYS.length;
    handleSelectStay(ALL_STAYS[nextIdx].id);
  };

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

  const handleBookingAction = (targetUrl: string) => {
    if (member) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    } else {
      setPendingRedirectUrl(targetUrl);
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F3EFE6] selection:bg-[#B89B72]/30 selection:text-white font-luxury-sans">
      
      {/* ============================================================== */}
      {/* 1. CONCEPT 3: FULL-BLEED ARCHITECTURAL CINEMA HERO STAGE     */}
      {/* ============================================================== */}
      <section id="sanctuary-stage" className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black">
        
        {/* Full-Bleed High-Definition Widescreen Scenery (Z-0) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={heroBackground}
            src={heroBackground}
            alt={currentStay.name}
            className="w-full h-full object-cover object-center scale-[1.01] transition-opacity duration-700 ease-out"
          />
          {/* Subtle Atmospheric Darkening (Vibrant Scenery Preserved 100%) */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden lg:block" />
        </div>

        {/* 1.1 MINIMALIST FLOATING HEADER (EXACT MOCKUP MATCH) */}
        <header className="relative z-30 w-full px-6 sm:px-14 pt-6 sm:pt-8 flex items-center justify-between pointer-events-auto">
          {/* Brand Logo */}
          <Link href="/stayhelper" className="flex items-center space-x-3 group">
            <span className="text-xl sm:text-2xl font-luxury-serif tracking-[0.26em] text-white uppercase font-light drop-shadow-md">
              STAYHELPER
            </span>
          </Link>

          {/* Minimalist Editorial Links */}
          <nav className="hidden md:flex items-center gap-6 text-[11px] font-mono tracking-[0.24em] text-white/80 uppercase drop-shadow">
            <a href="#sanctuary-stage" className="hover:text-white transition-colors">Portfolio</a>
            <span className="text-white/30">—</span>
            <a href="#architectural-dossier" className="hover:text-white transition-colors">Philosophy</a>
            <span className="text-white/30">—</span>
            <a href="#reserve-section" className="hover:text-white transition-colors">Inquire</a>
          </nav>

          {/* Right Direct Action */}
          <div className="flex items-center gap-3">
            {member ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 text-xs font-mono text-[#E8D5B5] backdrop-blur-md">
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">{member.name}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPendingRedirectUrl(currentStay.bookingUrl);
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-block px-4 py-1.5 rounded-full border border-white/25 hover:border-white/50 bg-black/40 hover:bg-black/60 text-xs font-mono text-stone-200 transition-all backdrop-blur-md cursor-pointer"
              >
                Join Private Club
              </button>
            )}

            <button
              type="button"
              onClick={() => handleBookingAction(currentStay.bookingUrl)}
              className="px-5 py-2 rounded-full bg-white hover:bg-[#F3EFE6] text-black text-xs font-luxury-sans font-medium tracking-wider transition-all duration-300 shadow-xl shadow-black/60 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>Let's Book Your Stay ↗</span>
            </button>
          </div>
        </header>

        {/* 1.2 OPEN LANDSCAPE BODY: LOWER-LEFT LABEL & RIGHT FLOATING 9:16 REEL */}
        <div className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-14 flex-1 flex flex-col lg:flex-row items-end justify-between gap-8 py-8 sm:py-12 my-auto">
          
          {/* Lower-Left: Discreet Architectural Label */}
          <div className="space-y-3 max-w-xl text-left drop-shadow-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[#E8D5B5] text-[11px] font-mono tracking-widest uppercase">
              <span>№ {String(currentIndex + 1).padStart(2, "0")}</span>
              <span className="text-white/40">·</span>
              <span>{currentStay.numeral}</span>
              <span className="text-white/40">·</span>
              <span className="text-white font-medium">{currentStay.country}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-luxury-serif font-light text-white tracking-tight leading-[1.05] drop-shadow-xl">
              {currentStay.name}
            </h1>

            <p className="text-xs sm:text-sm font-luxury-sans text-stone-200 tracking-[0.2em] uppercase font-light drop-shadow">
              {currentStay.location} · {currentStay.pricePerNight} / night
            </p>

            <p className="text-sm sm:text-base italic font-luxury-serif text-[#E8D5B5]/90 leading-relaxed font-light line-clamp-2 sm:line-clamp-none drop-shadow">
              "{currentStay.subtitle}"
            </p>
          </div>

          {/* Right Side: Floating 9:16 Haute-Couture Master Reel (Exact Inset Placement) */}
          <div className="shrink-0 flex justify-center lg:justify-end">
            <div className="relative w-[280px] sm:w-[320px] lg:w-[340px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl shadow-black border-2 border-white/35 bg-black ring-1 ring-white/20 group">
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

              {/* Video Top Pill */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
                <div className="flex items-center gap-2 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-[#E8D5B5] animate-pulse" />
                  <span className="text-[9px] font-mono text-white tracking-widest uppercase">
                    Cinematic Master Reel
                  </span>
                </div>
                <div className="bg-black/65 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 text-[10px] font-mono text-[#E8D5B5]">
                  {currentStay.numeral}
                </div>
              </div>

              {/* Replay Overlay on Video End */}
              {isEnded && (
                <div
                  onClick={() => handleBookingAction(currentStay.bookingUrl)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-[4px] z-30 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300"
                >
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#E8D5B5] mb-2">
                    Master Reel Complete
                  </span>
                  <h3 className="text-xl font-luxury-serif font-light text-white mb-1">
                    {currentStay.name}
                  </h3>
                  <p className="text-xs font-mono text-stone-300 mb-5">
                    {currentStay.priceAmount} USD / night · Direct Partner Link
                  </p>

                  <div className="w-full max-w-[240px] py-2.5 px-4 rounded-full bg-white hover:bg-[#F3EFE6] text-black font-luxury-sans font-medium text-xs flex items-center justify-center gap-2 shadow-2xl transition-transform hover:scale-105 mb-3">
                    <span>Let's Book Your Stay ↗</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      restartVideo();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black text-stone-300 hover:text-white text-xs font-mono border border-white/20 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#E8D5B5]" />
                    <span>Replay</span>
                  </button>
                </div>
              )}

              {/* Bottom Video Controls */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-xl"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="text-white hover:text-[#E8D5B5] transition p-1"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-white hover:text-[#E8D5B5] transition p-1"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#E8D5B5]" />}
                  </button>
                  <span className="text-[9px] font-mono text-stone-300">
                    {isMuted ? "Muted" : "Audio"}
                  </span>
                </div>
                {isEnded && (
                  <button
                    type="button"
                    onClick={restartVideo}
                    className="text-stone-300 hover:text-white transition flex items-center gap-1 text-[9px] font-mono"
                  >
                    <RotateCcw className="w-3 h-3 text-[#E8D5B5]" />
                    <span>Replay</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* 1.3 FLOATING FROSTED GLASS DOCK (THE 10-SANCTUARY TIMELINE) */}
        <div className="relative z-30 w-full px-6 sm:px-14 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
          
          {/* Centered Frosted Glass Timeline Capsule */}
          <div className="bg-black/60 backdrop-blur-2xl border border-white/20 rounded-xl px-3 sm:px-6 py-2 shadow-2xl flex items-center gap-2 sm:gap-4 max-w-4xl mx-auto sm:mx-0">
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={handlePrevStay}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shrink-0 active:scale-95 cursor-pointer"
              title="Previous Sanctuary"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-[#E8D5B5]" />
            </button>

            {/* Timeline Track */}
            <div
              ref={dockScrollRef}
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-1 flex-1 text-center"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {ALL_STAYS.map((stay, idx) => {
                const isActive = stay.id === selectedStayId;
                const shortName = stay.name.split(" ")[0].toUpperCase();
                return (
                  <button
                    key={stay.id}
                    type="button"
                    data-dock-id={stay.id}
                    onClick={() => handleSelectStay(stay.id)}
                    className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <span className={isActive ? "text-stone-600 font-bold" : "text-stone-500"}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNextStay}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shrink-0 active:scale-95 cursor-pointer"
              title="Next Sanctuary"
            >
              <ChevronRight className="w-3.5 h-3.5 text-[#E8D5B5]" />
            </button>
          </div>

          {/* Right: Request Sanctuary Dossier Link */}
          <a
            href="#architectural-dossier"
            className="text-xs font-luxury-sans text-stone-200 hover:text-white transition-colors underline underline-offset-4 tracking-wider uppercase shrink-0"
          >
            Request Sanctuary Dossier ↗
          </a>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 2. CURATED ARCHITECTURAL DOSSIER (BELOW THE FOLD)              */}
      {/* ============================================================== */}
      <section id="architectural-dossier" className="relative z-30 bg-[#0E0D0C] border-t border-white/10 py-20 sm:py-28 px-6 sm:px-12">
        <div className="max-w-[1440px] mx-auto space-y-16">
          
          {/* Curatorial Header */}
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#C5A880]">
              Architectural Provenance & Curation
            </span>
            <h2 className="text-3xl sm:text-5xl font-luxury-serif font-light text-white tracking-tight leading-tight">
              {currentStay.name}
            </h2>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed font-light">
              {currentStay.story.join(" ")}
            </p>
          </div>

          {/* 3-Column Haute Specification Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 hover:border-white/25 transition-colors">
              <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest">
                01 · Spatial Signature
              </span>
              <h3 className="text-xl font-luxury-serif font-medium text-white">
                {currentStay.features[0]?.title}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                {currentStay.features[0]?.desc}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 hover:border-white/25 transition-colors">
              <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest">
                02 · Master Experience
              </span>
              <h3 className="text-xl font-luxury-serif font-medium text-white">
                {currentStay.features[1]?.title}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                {currentStay.features[1]?.desc}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 hover:border-white/25 transition-colors">
              <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest">
                03 · Inclusions & Privilege
              </span>
              <h3 className="text-xl font-luxury-serif font-medium text-white">
                {currentStay.features[2]?.title}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                {currentStay.rateInclusions} · {currentStay.seasonalRange}
              </p>
            </div>

          </div>

          {/* Master Reservation Lockup */}
          <div id="reserve-section" className="rounded-3xl bg-gradient-to-r from-stone-900/80 via-black to-stone-900/80 border border-white/15 p-8 sm:p-14 text-center space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
              Direct Premier Partnership
            </span>
            <h3 className="text-2xl sm:text-4xl font-luxury-serif font-light text-white tracking-tight max-w-xl mx-auto">
              Reserve Your Private Sanctuary at {currentStay.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto font-light leading-relaxed">
              Experience unparalleled hospitality with direct live partner rates, verified availability, and zero service fees.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleBookingAction(currentStay.bookingUrl)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#F3EFE6] text-black text-xs font-luxury-sans font-medium tracking-wider transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
              >
                <span>Let's Book Your Stay ↗</span>
              </button>
              {!member && (
                <button
                  type="button"
                  onClick={() => {
                    setPendingRedirectUrl(currentStay.bookingUrl);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 text-xs font-luxury-sans text-stone-300 transition-all cursor-pointer"
                >
                  <span>Join Private Club</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 3. EDITORIAL COLOPHON FOOTER */}
      <footer className="border-t border-white/10 bg-black py-12 px-6 sm:px-12 text-center">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] font-mono text-stone-500 uppercase tracking-widest">
          <div>
            STAYHELPER · PRIVATE ARCHITECTURAL COLLECTION
          </div>
          <div>
            THE WORLD'S MOST EXTRAORDINARY SANCTUARIES
          </div>
          <div>
            CURATED WITH SILENT LUXURY
          </div>
        </div>
      </footer>

      {/* 4. US FAST 1-CLICK AUTH MODAL */}
      <USAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title={`Join StayHelper Private Club · ${currentStay.name}`}
        subtitle="Unlock direct verified partner booking links, live room rates, and cinematic master reels."
        onSuccess={(userData) => {
          const newMember = {
            name: userData.name,
            email: userData.email,
            signedUpAt: new Date().toISOString()
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
