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
  ChevronUp,
  LogOut
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
  activeDeal?: {
    title: string;
    tag: string;
    desc: string;
  };
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
    image: "/images/stayhelper/amangiri_wide_hero.jpg",
    wideHero: "/images/stayhelper/amangiri_wide_hero.jpg",
    videoSrc: "/videos/StayHelperAmangiri_v1_MasterReel.mp4",
    posterSrc: "/images/stayhelper/amangiri_wide_hero.jpg",
    bookingUrl: "https://www.aman.com/resorts/amangiri",
    status: "STREAMING",
    story: [
      "Discreetly hidden across 600 pristine acres of the southern Utah desert, Amangiri is an architectural triumph that blends seamlessly into raw 165-million-year-old Navajo sandstone escarpments. Here, minimalist concrete geometry and untamed geological formations unite to create an oasis of unearthly silence and monumental beauty.",
      "At the resort’s heart, a legendary rock-carved swimming pool curves organically around a colossal natural mesa. Private pavilion suites frame boundless canyon sunsets through floor-to-ceiling glass, opening onto private outdoor plunge pools and fire terraces beneath star-saturated desert skies."
    ],
    features: [
      { title: "Monolithic Rock Escarpment Pool", desc: "Sculpted directly around a dramatic 165M-year sandstone monolith" },
      { title: "Mesa View Pavilion Suites", desc: "Private desert courtyards with open-air fire pits and daybeds" },
      { title: "Navajo Hydrotherapy Spa", desc: "Water Pavilion with private outdoor flotation therapy and sauna" }
    ],
    activeDeal: {
      title: "Fora Reserve VIP Inclusions",
      tag: "FULL BOARD + AIRPORT VIP",
      desc: "Full-board dining for 2 + Page private airport transfer & $100 Navajo spa credit"
    }
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
    image: "/images/stayhelper/kayon_jungle_wide_hero.jpg",
    wideHero: "/images/stayhelper/kayon_jungle_wide_hero.jpg",
    videoSrc: "/videos/StayHelperBaliVilla_v10_GrandFinaleMaster.mp4",
    posterSrc: "/images/stayhelper/kayon_jungle_wide_hero.jpg",
    bookingUrl: "https://thekayonjungleresort.com/",
    status: "STREAMING",
    story: [
      "Perched dramatically above the sacred Cerapu River valley in Ubud, The Kayon Jungle Resort is an exclusive adults-only haven inspired by the geometric terraces of ancient Balinese rice fields.",
      "Framed by an emerald virgin rainforest canopy, its iconic three-tiered infinity pool cascades like terraced water mirrors down the ravine. Handcrafted volcanic stone pavilions and thatched alang-alang villas envelop guests in mist, birdsong, and restorative spiritual tranquility."
    ],
    features: [
      { title: "3-Tiered Canyon Infinity Pools", desc: "Cascading organic pools suspended over the sacred river valley" },
      { title: "Traditional Alang-Alang Villas", desc: "Private hillside villas with personal infinity plunges" },
      { title: "Serayu Forest Spa Sanctuary", desc: "Open-air therapeutic treatment decks facing the rainforest canopy" }
    ],
    activeDeal: {
      title: "Valley Escape · 20% Early Bird",
      tag: "SAVE 20% + AFTERNOON TEA",
      desc: "Complimentary daily high tea overlooking jungle valley + 20% advance booking discount"
    }
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
    videoSrc: "/videos/bulgari/firstmotion_bulgari_dubai_master.mp4?v=20261031_sunset_resonance",
    posterSrc: "/images/stayhelper/bulgari_01_arrival.jpg",
    bookingUrl: "https://www.bulgarihotels.com/en_US/dubai",
    status: "STREAMING",
    story: [
      "Carved into the tranquil waters of Jumeira Bay Island, Bulgari Resort Dubai marries Mediterranean coastal grace with visionary Italian craftsmanship, designed by legendary architectural studio ACPV ARCHITECTS.",
      "Featuring pristine white-sand private coves, a world-exclusive 46-boat superyacht marina, and culinary artistry by Michelin-starred Chef Niko Romito, it offers an enclave of absolute privacy against the golden Arabian Gulf horizon."
    ],
    features: [
      { title: "Private Superyacht Marina", desc: "46-berth exclusive harbor with members-only yacht club" },
      { title: "Il Ristorante - Niko Romito", desc: "Two Michelin-starred contemporary Italian gastronomy" },
      { title: "Secluded Oceanfront Mansions", desc: "Private beach gardens, temperature-controlled pools and butler service" }
    ],
    activeDeal: {
      title: "Marina Penthouse Exclusive Credit",
      tag: "$200 LUXURY CREDIT",
      desc: "Double resort credit ($200 USD) toward Il Ristorante Niko Romito + daily ocean breakfast"
    }
  },
  {
    id: "stay-04",
    numeral: "IV",
    name: "Four Seasons Resort Koh Samui",
    subtitle: "Cliffside Bill Bensley Villas Overlooking the Azure Gulf of Thailand",
    location: "Laem Yai Bay, Koh Samui",
    country: "Koh Samui, Thailand",
    badge: "COLLECTION № 04 · KOH SAMUI, THAILAND",
    rating: "4.98",
    reviews: "1,240+",
    pricePerNight: "From $1,450",
    priceAmount: "$1,450",
    seasonalRange: "Regular $1,450+ · Peak $2,400+",
    rateInclusions: "Daily Champagne breakfast, private infinity pool & Secret Garden Spa ritual",
    forbesTier: "Forbes Travel Guide Five-Star Resort",
    image: "/images/stayhelper/fs_kohsamui_wide_hero.jpg",
    wideHero: "/images/stayhelper/fs_kohsamui_wide_hero.jpg",
    videoSrc: "/videos/StayHelperKohSamui_v2_NaturalClean_Live.mp4",
    posterSrc: "/images/stayhelper/fs_kohsamui_poster.jpg",
    bookingUrl: "https://www.fourseasons.com/kohsamui/",
    status: "STREAMING",
    story: [
      "Cascading down a lush tropical hillside to a secluded private white-sand beach on Laem Yai Bay, Four Seasons Resort Koh Samui is the ultimate sanctuary of island serenity.",
      "Sixty handcrafted cliffside villas designed by Bill Bensley feature private turquoise infinity pools, open-air Secret Garden Spa sanctuaries, and effortless barefoot luxury amidst swaying coconut palms."
    ],
    features: [
      { title: "Cliffside Infinity Pool Villas", desc: "Private plunge pools with panoramic views across the Gulf of Thailand" },
      { title: "The Secret Garden Spa", desc: "Open-air teak treatment pavilions nestled in dense tropical rainforest" },
      { title: "Secluded Private Bay & CoCo Rum", desc: "Powder-soft white sands with beachfront dining and sunset mixology" }
    ],
    activeDeal: {
      title: "Stay Longer · 20% Off",
      tag: "SAVE 20% (4+ NIGHTS)",
      desc: "Stay 4 nights or more and enjoy 20% off room rates + $100 Resort Credit & Daily Breakfast"
    }
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
    image: "/images/stayhelper/soneva_jani_wide_hero.jpg",
    wideHero: "/images/stayhelper/soneva_jani_wide_hero.jpg",
    videoSrc: "/videos/StayHelperSonevaJani_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/soneva_jani_poster.jpg",
    bookingUrl: "https://soneva.com/resorts/soneva-jani/",
    status: "STREAMING",
    story: [
      "Perched within a massive 5-kilometer turquoise lagoon in the tranquil Noonu Atoll, Soneva Jani defines the pinnacle of barefoot sustainable luxury. Curved wooden boardwalks stretch over transparent, shallow azure waters teeming with marine life.",
      "Each iconic multi-story Water Reserve features its own spiraling slide directly into the Indian Ocean lagoon, expansive catamaran netting daybeds, and a master bedroom with an automated retractable roof that glides open to unveil the starlit equatorial sky."
    ],
    features: [
      { title: "Lagoon Overwater Slides", desc: "Curved private water slides plunging directly into the azure Indian Ocean" },
      { title: "Retractable Starlight Ceiling", desc: "Master bedroom roof opens at the touch of a button for stargazing in bed" },
      { title: "The Gathering Sanctuary", desc: "Three-story open-air timber dining and astronomical observatory over water" }
    ],
    activeDeal: {
      title: "The Great Escape · 4th Night Free",
      tag: "STAY 4, PAY 3 (1 NIGHT FREE)",
      desc: "Book 3 consecutive nights and receive the 4th night complimentary + $100 Resort Credit"
    }
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
    videoSrc: "/videos/StayHelperChediAndermatt_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/chedi_andermatt_poster.jpg",
    bookingUrl: "https://www.thechediandermatt.com/",
    status: "STREAMING",
    story: [
      "Nestled amidst the snow-blanketed peaks of the Urseren Valley, The Chedi Andermatt marries classic Swiss alpine warmth with sleek Asian Zen minimalism, masterfully envisioned by legendary architect Jean-Michel Gathy.",
      "Dramatic dark timber beams, open stone fireplaces, and floor-to-ceiling glass pavilions frame breathtaking alpine winterscapes. The resort’s centerpiece 2,400-square-meter spa features a 35-meter indoor pool and steaming outdoor thermal baths where guests soak under falling mountain snow."
    ],
    features: [
      { title: "Heated Alpine Thermal Pool", desc: "35-meter indoor pool and outdoor thermal pool surrounded by snowy peaks" },
      { title: "Jean-Michel Gathy Alpine Design", desc: "Striking dark woods, soft leather, and monumental granite fireplaces" },
      { title: "Michelin Japanese Gastronomy", desc: "The Japanese Restaurant with an authentic 9-seat Omakase and sake bar" }
    ],
    activeDeal: {
      title: "Alpine Sanctuary · 3rd Night Complimentary",
      tag: "STAY 3, PAY 2 (1 NIGHT FREE)",
      desc: "Book 2 nights and receive your 3rd night on us with daily breakfast buffet & $100 spa credit"
    }
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
    image: "/images/stayhelper/monastero_santa_rosa_wide_hero.jpg",
    wideHero: "/images/stayhelper/monastero_santa_rosa_wide_hero.jpg",
    videoSrc: "/videos/StayHelperMonastero_Master_Reel.mp4",
    posterSrc: "/stays/monastero_santa_rosa/act1.jpg",
    bookingUrl: "https://monasterosantarosa.com/",
    status: "STREAMING",
    story: [
      "Clinging dramatically to a vertical limestone cliff soaring above the sapphire Tyrrhenian Sea, Monastero Santa Rosa is an exquisite restoration of a 17th-century Dominican convent along Italy's most storied coast.",
      "Cascading multi-level terraced gardens fragrant with rosemary and lemon blossoms lead to an elliptical infinity pool that appears suspended directly between sky and ocean. Ancient vaulted monastery corridors now shelter luxurious guest rooms celebrating authentic Italian heritage."
    ],
    features: [
      { title: "Amalfi Sheer Cliff Infinity Pool", desc: "Suspended high over the sapphire sea with panoramic bay vistas" },
      { title: "Historic Monastery Heritage", desc: "Preserved vaulted ceilings, rustic stone arches, and aromatic herb gardens" },
      { title: "Thermal Roman Bath Circuit", desc: "Hydrotherapy pool, tepidarium, crushed-ice fountain, and sauna" }
    ],
    activeDeal: {
      title: "Cliffside Respite · 4th Night Free",
      tag: "STAY 4, PAY 3 (1 NIGHT FREE)",
      desc: "Complimentary 4th night on cliffside suite bookings + €100 thermal baths spa credit"
    }
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
    image: "/images/stayhelper/aman_kyoto_wide_hero.jpg",
    wideHero: "/images/stayhelper/aman_kyoto_wide_hero.jpg",
    videoSrc: "/videos/StayHelperAmanKyoto_Master_Reel.mp4",
    posterSrc: "/stays/aman_kyoto/act1.jpg",
    bookingUrl: "https://www.aman.com/resorts/aman-kyoto",
    status: "STREAMING",
    story: [
      "Concealed within 79 acres of secluded cedar and maple forest at the foot of Kyoto’s sacred Takagamine mountains, Aman Kyoto is an ethereal architectural homage to classical Japanese ryokan aesthetics and Kerry Hill's timeless minimalism.",
      "Moss-carpeted stone pathways and ancient granite staircases weave past babbling mountain brooks into private cedarwood pavilions. Scented hinoki wood onsen baths fed by pure local mineral springs offer complete spiritual rejuvenation enveloped in tranquil forest mist."
    ],
    features: [
      { title: "Living Moss Garden Estate", desc: "Ancient stone pathways winding through Japanese maples and cedar groves" },
      { title: "Natural Thermal Spring Onsen", desc: "Healing outdoor and indoor onsen baths drawing from local mineral springs" },
      { title: "Authentic Hinoki Wood Pavilions", desc: "Minimalist cedar suites framing floor-to-ceiling forest tranquility" }
    ],
    activeDeal: {
      title: "Discover Aman Kyoto · Cultural Inclusions",
      tag: "COMPLIMENTARY TEA CEREMONY + $100",
      desc: "Private Zen rock garden matcha ceremony + $100 dining credit and daily Japanese breakfast"
    }
  },
  {
    id: "stay-09",
    numeral: "IX",
    name: "Singita Sasakwa Lodge",
    subtitle: "Majestic Edwardian Manor Perched Above the Boundless Plains of the Serengeti",
    location: "Grumeti Reserves, Serengeti Ecosystem",
    country: "Serengeti, Tanzania",
    badge: "COLLECTION № 09 · SERENGETI SAFARI",
    rating: "4.99",
    reviews: "640+",
    pricePerNight: "From $2,850",
    priceAmount: "$2,850",
    seasonalRange: "Low $2,400+ · Migration Peak $4,200+",
    rateInclusions: "All-inclusive private game drives, sommelier wine cellar, full safari bush board",
    forbesTier: "World's #1 Safari Lodge & Condé Nast Gold List",
    image: "/images/stayhelper/singita_sasakwa_wide_hero.jpg",
    wideHero: "/images/stayhelper/singita_sasakwa_wide_hero.jpg",
    videoSrc: "/videos/StayHelperSingita_Master_Reel.mp4",
    posterSrc: "/stays/singita_sasakwa/act1.jpg",
    bookingUrl: "https://singita.com/lodge/singita-sasakwa-lodge/",
    status: "STREAMING",
    story: [
      "Perched high on Sasakwa Hill overlooking the endless golden savanna of the Serengeti, Singita Sasakwa Lodge captures the grandeur of a classic Edwardian manor amidst 350,000 acres of private protected wilderness.",
      "Each secluded hillside cottage features an expansive private infinity plunge pool with front-row panoramas of migrating wildebeest herds and roaming elephant families. Intimate fireside dining and sunset game drives deliver Africa’s most iconic safari experience."
    ],
    features: [
      { title: "Cliffside Savanna Infinity Pools", desc: "Private plunge pools commanding 360-degree vistas across the boundless Serengeti" },
      { title: "Private Grumeti Game Drives", desc: "Exclusive access to 350,000 untamed acres tracking the Big Five and Great Migration" },
      { title: "Bespoke Bush Dining & Cellar", desc: "Bush breakfasts under acacia trees paired with rare vintage African wines" }
    ],
    activeDeal: {
      title: "Serengeti Migration Special",
      tag: "FREE PRIVATE GAME DRIVE",
      desc: "Includes twice-daily private Land Cruiser safaris + full board and vintage cellar wines"
    }
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
    image: "/images/stayhelper/eden_roc_wide_hero.jpg",
    wideHero: "/images/stayhelper/eden_roc_wide_hero.jpg",
    videoSrc: "/videos/StayHelperEdenRoc_Master_Reel.mp4",
    posterSrc: "/stays/eden_roc/act1.jpg",
    bookingUrl: "https://www.oetkercollection.com/hotels/hotel-du-cap-eden-roc/",
    status: "STREAMING",
    story: [
      "Commanding the southern tip of Cap d’Antibes since 1870, Hôtel du Cap-Eden-Roc stands as the timeless crown jewel of the French Riviera, long cherished by European royalty, literary titans, and cinema royalty during the Cannes Film Festival.",
      "Surrounded by thirty-three acres of majestic Aleppo pine groves and fragrant rose gardens, its world-famous seawater pool is carved directly into white coastal limestone rocks, offering private cabanas and peerless Mediterranean glamour."
    ],
    features: [
      { title: "Iconic Cliff Seawater Pool", desc: "Carved into sheer coastal basalt rocks directly above the Mediterranean waves" },
      { title: "Century-Old Private Pine Groves", desc: "33 acres of immaculate gardens hosting royalty, artists, and screen legends" },
      { title: "Dior Spa Eden-Roc", desc: "Holistic Mediterranean wellness treatments in open-air coastal cabanas" }
    ],
    activeDeal: {
      title: "Oetker Pearl Partner VIP Upgrade",
      tag: "PRIORITY UPGRADE AT BOOKING",
      desc: "Priority room upgrade at confirmation + €100 culinary credit at Eden-Roc Restaurant"
    }
  },
  {
    id: "stay-11",
    numeral: "XI",
    name: "Villa d'Este",
    subtitle: "16th-Century Renaissance Royal Palace & Legendary Floating Pool on Lake Como",
    location: "Cernobbio, Lake Como",
    country: "Lake Como, Italy",
    badge: "COLLECTION № 11 · LAKE COMO, ITALY",
    rating: "4.99",
    reviews: "920+",
    pricePerNight: "From $1,950",
    priceAmount: "$1,950",
    seasonalRange: "Spring $1,600+ · Summer Grand Prix $3,400+",
    rateInclusions: "Includes lakeside artisan breakfast, floating pool pass & private gardens access",
    forbesTier: "Leading Hotels of the World & Forbes 5-Star",
    image: "/images/stayhelper/villa_deste_wide_hero.jpg",
    wideHero: "/images/stayhelper/villa_deste_wide_hero.jpg",
    videoSrc: "/videos/StayHelperVillaDEste_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/villa_deste_wide_hero.jpg",
    bookingUrl: "https://www.villadeste.com/",
    status: "STREAMING",
    story: [
      "Originally commissioned in 1568 as a summer residence for Cardinal Tolomeo Gallio, Villa d’Este is widely celebrated as the timeless grand dame of Lake Como. Nestled within twenty-five acres of Renaissance botanical gardens, majestic cypress alleys, and baroque fountains, it preserves an atmosphere of regal grandeur once favored by European royalty, aristocracy, and literary icons.",
      "The estate’s crown jewel is its world-famous floating swimming pool, built directly into the dark blue waters of Lake Como with a private sunbathing pontoon facing misty mountain peaks. Gilded chandeliers, Murano glass, and Como silk furnishings frame private balcony vistas over passing wooden Riva motorboats."
],
    features: [
      {
            "title": "Iconic Floating Lake Pool",
            "desc": "Pioneering pontoon heated swimming pool suspended directly upon Lake Como"
      },
      {
            "title": "25-Acre Renaissance Gardens",
            "desc": "Historic 16th-century baroque nymphaeum and centennial pine tree promenades"
      },
      {
            "title": "Veranda Lakeside Gastronomy",
            "desc": "Fine Italian dining with floor-to-ceiling glass pavilions opening onto the water"
      }
],
    activeDeal: {
      title: "Lake Como Heritage · 4th Night Free",
      tag: "STAY 4, PAY 3 (1 NIGHT FREE)",
      desc: "Enjoy a complimentary 4th night amidst Renaissance private gardens + daily lakefront breakfast"
    }
  },
  {
    id: "stay-12",
    numeral: "XII",
    name: "Post Ranch Inn",
    subtitle: "Cliffside Architectural Masterpiece Perched 1,200 Feet Above the Boundless Pacific",
    location: "Big Sur, Highway 1, California",
    country: "California, United States",
    badge: "COLLECTION № 12 · BIG SUR, USA",
    rating: "4.99",
    reviews: "840+",
    pricePerNight: "From $2,450",
    priceAmount: "$2,450",
    seasonalRange: "Fall $2,100+ · Summer Fog Peak $3,800+",
    rateInclusions: "Includes gourmet Big Sur breakfast, daily morning yoga & guided nature hikes",
    forbesTier: "Forbes Travel Guide 5-Star Hotel",
    image: "/images/stayhelper/post_ranch_inn_wide_hero.jpg",
    wideHero: "/images/stayhelper/post_ranch_inn_wide_hero.jpg",
    videoSrc: "/videos/StayHelperPostRanchInn_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/post_ranch_inn_wide_hero.jpg",
    bookingUrl: "https://www.postranchinn.com/",
    status: "STREAMING",
    story: [
      "Perched dramatically on the rugged cliffs of Big Sur twelve hundred feet above the crashing Pacific Ocean, Post Ranch Inn is an organic architectural triumph designed by Mickey Muennig. Built entirely with reclaimed redwood, local stone, and curved sod roofs, the resort harmonizes flawlessly with the wild California coastal ecosystem.",
      "Freestanding cliff house sanctuaries and triangular treehouses elevated nine feet off the forest floor offer wood-burning fireplaces, private outdoor soaking tubs, and telescope observatories framing migrating humpback whales and starlit cosmic skies."
],
    features: [
      {
            "title": "Cliffside Jade Soaking Spas",
            "desc": "104-degree infinity soaking pools perched directly on sheer ocean precipices"
      },
      {
            "title": "Elevated Treehouse Sanctuaries",
            "desc": "Architectural stilt pavilions built amidst ancient coastal redwood canopies"
      },
      {
            "title": "Sierra Mar Gastronomy",
            "desc": "Michelin-recognized coastal cuisine paired with a 15,000-bottle Grand Award cellar"
      }
],
    activeDeal: {
      title: "Big Sur Coastal Escape · $100 Credit",
      tag: "$100 SPA & WINE CREDIT",
      desc: "Complimentary $100 cliffside spa credit + daily gourmet breakfast at Sierra Mar"
    }
  },
  {
    id: "stay-13",
    numeral: "XIII",
    name: "Cheval Blanc Randheli",
    subtitle: "LVMH’s Ultimate Haute Couture Island Maison with Private Marina and Infinity Sanctuaries",
    location: "Noonu Atoll, Republic of Maldives",
    country: "Maldives",
    badge: "COLLECTION № 13 · MALDIVES ATOLL",
    rating: "4.99",
    reviews: "710+",
    pricePerNight: "From $3,800",
    priceAmount: "$3,800",
    seasonalRange: "Low $3,200+ · Festive Holiday $6,800+",
    rateInclusions: "Includes customized twin-otter seaplane transfers, private majordome butler service",
    forbesTier: "World's 50 Best Luxury Hotels & Forbes 5-Star",
    image: "/images/stayhelper/cheval_blanc_wide_hero.jpg",
    wideHero: "/images/stayhelper/cheval_blanc_wide_hero.jpg",
    videoSrc: "/videos/StayHelperChevalBlanc_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/cheval_blanc_wide_hero.jpg",
    bookingUrl: "https://www.chevalblanc.com/en/maison/randheli/",
    status: "STREAMING",
    story: [
      "Conceived by Jean-Michel Gathy for luxury conglomerate LVMH, Cheval Blanc Randheli represents the absolute pinnacle of contemporary island elegance in the secluded Noonu Atoll. Rising from crystalline lagoons, soaring 7-meter-high cathedral wooden doors, graphic yellow pop accents, and bespoke art installations define this exclusive haute couture retreat.",
      "Forty-six monumental overwater and island villas feature 12.5-meter private infinity pools, secluded private white-sand beaches, and dedicated Majordome butlers catering to every bespoke whim. Guests arrive via the Maison's signature taupe-and-yellow customized private seaplane."
],
    features: [
      {
            "title": "Monumental 12.5m Private Pools",
            "desc": "Every single villa features a private heated infinity pool extending into the lagoon"
      },
      {
            "title": "Cheval Blanc Spa Island",
            "desc": "A dedicated private island accessible only by traditional wooden dhoni boat"
      },
      {
            "title": "Le 1947 Haute Gastronomy",
            "desc": "French 12-course fine dining paired with legendary Château Cheval Blanc vintages"
      }
],
    activeDeal: {
      title: "Maison Maldivian Escape · 5th Night Free",
      tag: "STAY 5, PAY 4 (1 NIGHT FREE)",
      desc: "Book 4 nights and enjoy your 5th night complimentary + Cheval Blanc welcome champagne"
    }
  },
  {
    id: "stay-14",
    numeral: "XIV",
    name: "Belmond Hotel Caruso",
    subtitle: "11th-Century Palatial Cliffside Sanctuary Suspended Between Sky and Sea in Ravello",
    location: "Ravello, Amalfi Coast",
    country: "Amalfi Coast, Italy",
    badge: "COLLECTION № 14 · AMALFI COAST",
    rating: "4.98",
    reviews: "880+",
    pricePerNight: "From $1,980",
    priceAmount: "$1,980",
    seasonalRange: "Spring $1,550+ · Summer Peak $3,200+",
    rateInclusions: "Includes cliff-top terrace breakfast, daily sunset cruise on private wooden gozzo boat",
    forbesTier: "Condé Nast Traveler Gold List & Forbes 5-Star",
    image: "/images/stayhelper/belmond_caruso_wide_hero.jpg",
    wideHero: "/images/stayhelper/belmond_caruso_wide_hero.jpg",
    videoSrc: "/videos/StayHelperBelmondCaruso_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/belmond_caruso_wide_hero.jpg",
    bookingUrl: "https://www.belmond.com/hotels/europe/italy/amalfi-coast/belmond-hotel-caruso/",
    status: "STREAMING",
    story: [
      "Perched high on a limestone bluff 350 meters above the azure Amalfi Coast in medieval Ravello, Belmond Hotel Caruso is an exquisitely restored 11th-century palace originally built by a wealthy Roman patrician family. Its historic colonnades, fragrant lemon terraces, and original frescoes transport guests into an era of aristocratic Mediterranean leisure.",
      "The hotel’s crown jewel is its world-renowned cliff-edge heated infinity pool, famously dubbed the pool in the clouds. Seeming to float magically in mid-air over the Gulf of Salerno, it offers uninterrupted 360-degree vistas across dramatic coastal cliffs, pastel villages, and sapphire seas."
],
    features: [
      {
            "title": "The Infinity Pool in the Clouds",
            "desc": "Suspended 350 meters above the Mediterranean with 360-degree Amalfi gulf vistas"
      },
      {
            "title": "11th-Century Historic Colonnades",
            "desc": "Preserved vaulted stone arches, baroque garden pergolas and authentic frescoed suites"
      },
      {
            "title": "Belvedere Cliffside Dining",
            "desc": "Neapolitan haute gastronomy prepared with fresh vegetables from the hotel's own garden"
      }
],
    activeDeal: {
      title: "Bellini Club Exclusive · $200 Credit",
      tag: "$200 RESORT CREDIT",
      desc: "Complimentary $200 USD Bellini experience credit + cliffside infinity pool cabana priority"
    }
  },
  {
    id: "stay-15",
    numeral: "XV",
    name: "Aman Tokyo",
    subtitle: "Monumental Washi Paper Lantern Atrium & Basalt Stone Sanctuary Above Otemachi",
    location: "The Otemachi Tower, Tokyo",
    country: "Tokyo, Japan",
    badge: "COLLECTION № 15 · TOKYO, JAPAN",
    rating: "4.99",
    reviews: "1,120+",
    pricePerNight: "From $2,250",
    priceAmount: "$2,250",
    seasonalRange: "Winter $1,850+ · Cherry Blossom Peak $3,900+",
    rateInclusions: "Includes traditional Japanese seasonal breakfast, private onsen spa bath access",
    forbesTier: "Forbes Travel Guide 5-Star Hotel",
    image: "/images/stayhelper/aman_tokyo_wide_hero.jpg",
    wideHero: "/images/stayhelper/aman_tokyo_wide_hero.jpg",
    videoSrc: "/videos/StayHelperAmanTokyo_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/aman_tokyo_wide_hero.jpg",
    bookingUrl: "https://www.aman.com/hotels/aman-tokyo",
    status: "STREAMING",
    story: [
      "Occupying the top six floors of the prestigious Otemachi Tower, Aman Tokyo is a monument to urban Zen serenity envisioned by master architect Kerry Hill. At its core lies a breathtaking monumental lobby atrium rising thirty meters high, crafted from delicate textured washi paper that glows like a colossal Japanese lantern against the Tokyo skyline.",
      "Framing panoramic vistas across the Imperial Palace Gardens and Mount Fuji on clear mornings, the hotel blends classical ryokan aesthetics—shoji paper screens, camphor wood, and black basalt stone—with refined urban tranquility. The 30-meter black granite swimming pool offers an ethereal sanctuary far above the metropolis."
],
    features: [
      {
            "title": "30-Meter Washi Lantern Atrium",
            "desc": "Soaring architectural lobby evoking the interior of a traditional Japanese paper shoji"
      },
      {
            "title": "30m Black Basalt Pool",
            "desc": "Monumental heated indoor pool overlooking the Imperial Palace gardens and skyline"
      },
      {
            "title": "Authentic Ryokan Cedar Onsen",
            "desc": "Mineral-rich Japanese public and private onsen hot stone bath pavilion"
      }
],
    activeDeal: {
      title: "Oeno & Dining Experience · $100 Credit",
      tag: "$100 DINING CREDIT + SAKE TASTING",
      desc: "Complimentary 33rd floor sommelier tasting + $100 hotel credit and daily breakfast"
    }
  },
  {
    id: "stay-16",
    numeral: "XVI",
    name: "Royal Mansour Marrakech",
    subtitle: "Palatial Masterpiece Commissioned by the King with Private Multi-Story Riads & Starlight Pools",
    location: "Rue Abou Abbas El Sebti, Marrakech",
    country: "Marrakech, Morocco",
    badge: "COLLECTION № 16 · MARRAKECH, MOROCCO",
    rating: "4.99",
    reviews: "950+",
    pricePerNight: "From $2,200",
    priceAmount: "$2,200",
    seasonalRange: "Summer $1,750+ · Winter Festive $3,800+",
    rateInclusions: "Includes fast-track VIP airport transfers, personal butler, traditional Moroccan breakfast",
    forbesTier: "Forbes 5-Star & World's Most Lavish Urban Palace",
    image: "/images/stayhelper/royal_mansour_wide_hero.jpg",
    wideHero: "/images/stayhelper/royal_mansour_wide_hero.jpg",
    videoSrc: "/videos/StayHelperRoyalMansour_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/royal_mansour_wide_hero.jpg",
    bookingUrl: "https://www.royalmansour.com/marrakech/",
    status: "STREAMING",
    story: [
      "Commissioned by His Majesty King Mohammed VI to showcase the very pinnacle of Moroccan craftsmanship, Royal Mansour Marrakech is a palatial city within a city. Instead of conventional hotel rooms or suites, guests reside in fifty-three private three-story riads, each with its own open-air courtyard, private elevator, and rooftop terrace featuring a heated plunge pool and starlight fireplace.",
      "Over 1,500 master artisans spent five years hand-carving intricate cedarwood ceilings, geometric zellij tilework, and sculpted plaster arabesques. An ingenious subterranean tunnel network allows personal butlers to serve guests with complete discretion, preserving absolute privacy amidst fragrant orange blossoms and palatial courtyards."
],
    features: [
      {
            "title": "53 Private Multi-Story Riads",
            "desc": "Exclusive 3-story private residences with open courtyards and personal rooftop pools"
      },
      {
            "title": "Secret Subterranean Tunnels",
            "desc": "Underground staff labyrinth ensuring total discretion and invisible butler service"
      },
      {
            "title": "All-White Marble Hammam Spa",
            "desc": "Iconic birdcage-like white wrought-iron atrium offering royal Moroccan rhassoul rituals"
      }
],
    activeDeal: {
      title: "Medina Riad Experience · 4th Night Free",
      tag: "STAY 4, PAY 3 (1 NIGHT FREE)",
      desc: "Stay 4 nights in a private multi-story riad, pay for 3 + traditional hammam experience for 2"
    }
  },
  {
    id: "stay-17",
    numeral: "XVII",
    name: "COMO Laucala Island",
    subtitle: "Ultra-Exclusive 3,000-Acre Private Island Sanctuary with Iconic Glass-Cube Lap Pool",
    location: "Laucala Island, Cakaudrove",
    country: "Fiji, South Pacific",
    badge: "COLLECTION № 17 · FIJI ISLANDS",
    rating: "4.99",
    reviews: "520+",
    pricePerNight: "From $5,600",
    priceAmount: "$5,600",
    seasonalRange: "All-Inclusive $5,600+ · Peak Holiday $9,200+",
    rateInclusions: "Fully inclusive of all private dining, sommelier wines, DeepFlight submarine dives & golf",
    forbesTier: "World's Most Exclusive Private Island Resort",
    image: "/images/stayhelper/como_laucala_wide_hero.jpg",
    wideHero: "/images/stayhelper/como_laucala_wide_hero.jpg",
    videoSrc: "/videos/StayHelperComoLaucala_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/como_laucala_wide_hero.jpg",
    bookingUrl: "https://www.comohotels.com/fiji/como-laucala-island",
    status: "STREAMING",
    story: [
      "Spanning three thousand pristine acres of private South Pacific paradise in northern Fiji, COMO Laucala Island is an extraordinary ultra-luxury resort once owned by Malcolm Forbes and Red Bull founder Dietrich Mateschitz. Featuring twenty-five standalone presidential villas, its own private airstrip, and organic farms producing 85% of all estate food, it defines absolute ecological privacy.",
      "The island’s architectural triumph is its 25-meter clear-glass cube lap pool, suspended inside a massive 2,000-square-meter lagoon pool framed by coconut palms and white beaches. Guests enjoy private submarine diving on virgin barrier reefs, equestrian trails, and world-class 18-hole championship golf."
],
    features: [
      {
            "title": "25m Transparent Glass Cube Pool",
            "desc": "World-famous submerged acrylic glass lap pool set inside an organic lagoon"
      },
      {
            "title": "DeepFlight Super Falcon Submarine",
            "desc": "Private two-person high-tech submarine exploration across pristine coral atolls"
      },
      {
            "title": "Self-Sustaining Organic Farm",
            "desc": "Farm-to-table gastronomy powered by 240 acres of private organic hydroponic farms"
      }
],
    activeDeal: {
      title: "Private Island All-Inclusive Sanctuary",
      tag: "ALL-INCLUSIVE ISLAND RETREAT",
      desc: "All gourmet dining, private chef services, golf, horseback riding & watersports 100% included"
    }
  },
  {
    id: "stay-18",
    numeral: "XVIII",
    name: "Badrutt's Palace Hotel",
    subtitle: "Legendary 128-Year-Old Fairy-Tale Alpine Castle Overlooking Lake St. Moritz",
    location: "Via Serlas, St. Moritz",
    country: "Engadin, Switzerland",
    badge: "COLLECTION № 18 · SWISS ALPS",
    rating: "4.98",
    reviews: "1,180+",
    pricePerNight: "From $1,750",
    priceAmount: "$1,750",
    seasonalRange: "Summer $1,250+ · Winter Ski Peak $3,600+",
    rateInclusions: "Includes Rolls-Royce train station transfers, gourmet Engadin breakfast, Palace Spa access",
    forbesTier: "Forbes Travel Guide 5-Star Hotel",
    image: "/images/stayhelper/badrutts_palace_wide_hero.jpg",
    wideHero: "/images/stayhelper/badrutts_palace_wide_hero.jpg",
    videoSrc: "/videos/StayHelperBadruttsPalace_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/badrutts_palace_wide_hero.jpg",
    bookingUrl: "https://badruttspalace.com/",
    status: "STREAMING",
    story: [
      "Reigning over the sparkling alpine waters of Lake St. Moritz since 1896, Badrutt’s Palace Hotel is the birthplace of winter tourism and European high-society alpine glamour. Its iconic neo-Gothic tower and monumental stone arches have hosted everyone from Audrey Hepburn and Alfred Hitchcock to international royalty and tastemakers.",
      "Guests arrive in vintage Rolls-Royce limousines, stepping into the legendary Grand Hall with soaring timber ceilings and panoramic vistas across snow-draped Engadin mountains. The glass-fronted Palace Spa features an indoor granite pool with views of frozen Lake St. Moritz and outdoor steaming thermal whirlpools."
],
    features: [
      {
            "title": "Lakeview Infinity Indoor Pool",
            "desc": "Glass-walled granite pool with seamless views across snow-draped Lake St. Moritz"
      },
      {
            "title": "Vintage Rolls-Royce Transfers",
            "desc": "Chauffeured arrival from St. Moritz railway station in bespoke classic limousines"
      },
      {
            "title": "Le Grand Hall & King's Social House",
            "desc": "Legendary Engadin salon and Switzerland's oldest and most prestigious nightclub"
      }
],
    activeDeal: {
      title: "St. Moritz Ski Pass Included",
      tag: "COMPLIMENTARY SKI PASS + $100",
      desc: "Free Engadin ski pass for all guests staying 2+ nights + $100 Palace wellness credit"
    }
  },
  {
    id: "stay-19",
    numeral: "XIX",
    name: "Capella Ubud",
    subtitle: "Bill Bensley’s Mystical Rainforest Tented Camp Sanctuary Above Sacred Wos River",
    location: "Tegallalang, Ubud, Bali",
    country: "Bali, Indonesia",
    badge: "COLLECTION № 19 · BALI JUNGLE",
    rating: "4.99",
    reviews: "940+",
    pricePerNight: "From $1,350",
    priceAmount: "$1,350",
    seasonalRange: "Regular $1,150+ · High Season $2,200+",
    rateInclusions: "Includes bespoke camp breakfast, afternoon tea, camp duffel bag & 24hr Culturist service",
    forbesTier: "Travel + Leisure World's #1 Hotel",
    image: "/images/stayhelper/capella_ubud_wide_hero.jpg",
    wideHero: "/images/stayhelper/capella_ubud_wide_hero.jpg",
    videoSrc: "/videos/StayHelperCapellaUbud_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/capella_ubud_wide_hero.jpg",
    bookingUrl: "https://capellahotels.com/en/capella-ubud",
    status: "STREAMING",
    story: [
      "Hidden within the sacred rainforest canopy of Keliki valley in Ubud, Capella Ubud is a visionary tribute to 19th-century European explorers created by eccentric architect Bill Bensley. Twenty-two ultra-luxury tented retreats and a two-bedroom lodge sit balanced delicately on stilts amidst dense jungle terrain without cutting down a single tree.",
      "Each tented sanctuary features an outdoor copper and teak salt-water plunge pool, handcrafted hammered brass bathtubs, and bespoke antique decor. At night, guests gather around the open-air Camp Fire for roasted marshmallows, hot chocolate, and silent vintage films under the stars."
],
    features: [
      {
            "title": "Salt-Water Plunge Pool Retreats",
            "desc": "Handcrafted outdoor plunge pools overlooking dense virgin jungle canopies"
      },
      {
            "title": "Zero-Impact Eco Architecture",
            "desc": "Built without cutting a single tree, preserving the Keliki rainforest valley"
      },
      {
            "title": "The Camp Fire Starlight Ritual",
            "desc": "Nightly fireside gatherings with acoustic music, artisan chocolate and ghost stories"
      }
],
    activeDeal: {
      title: "Rainforest Retreat · 3rd Night Complimentary",
      tag: "STAY 3, PAY 2 (1 NIGHT FREE)",
      desc: "Stay 3 nights for the price of 2 + $100 dining credit and daily tented camp breakfast"
    }
  },
  {
    id: "stay-20",
    numeral: "XX",
    name: "Jade Mountain Resort",
    subtitle: "Architectural Masterpiece with Open 4th Wall Framing the Iconic Volcanic Pitons",
    location: "Soufrière, St. Lucia",
    country: "St. Lucia, Caribbean",
    badge: "COLLECTION № 20 · CARIBBEAN",
    rating: "4.99",
    reviews: "1,040+",
    pricePerNight: "From $2,850",
    priceAmount: "$2,850",
    seasonalRange: "Summer $2,250+ · Winter Peak $4,600+",
    rateInclusions: "Includes personal Major-Domo butler, organic estate dining & catamaran sailing pass",
    forbesTier: "World's Top Architectural Resort & Conde Nast Traveler #1",
    image: "/images/stayhelper/jade_mountain_wide_hero.jpg",
    wideHero: "/images/stayhelper/jade_mountain_wide_hero.jpg",
    videoSrc: "/videos/StayHelperJadeMountain_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/jade_mountain_wide_hero.jpg",
    bookingUrl: "https://www.jademountain.com/",
    status: "STREAMING",
    story: [
      "Rising like a monumental eco-futuristic ziggurat above the sapphire Caribbean Sea, Jade Mountain is an organic architectural triumph conceived by architect-owner Nick Troubetzkoy. Connected by dramatic suspended stone bridges hovering in mid-air, the resort is celebrated for its revolutionary open fourth wall design concept.",
      "In each palatial Sanctuary, the bedroom, living space, and a private multi-colored glass tile infinity pool glide seamlessly into the tropical trade winds, framing uninterrupted, jaw-dropping panoramas of St. Lucia’s UNESCO World Heritage Piton volcanic spires. There are no clocks, no televisions, and no walls separating guests from the sublime Caribbean panorama."
],
    features: [
      {
            "title": "Private Infinity Pool Sanctuaries",
            "desc": "Cantilevered floating pools ranging from 400 to 900 sq ft with glowing iridescent tiles"
      },
      {
            "title": "Open 4th-Wall Architecture",
            "desc": "Revolutionary structural design opening bedrooms completely to panoramic Piton views"
      },
      {
            "title": "Suspended Stone Sky Bridges",
            "desc": "Dramatic private skybridges leading individually to each private architectural sanctuary"
      }
],
    activeDeal: {
      title: "Caribbean Escape · 5th Night Free",
      tag: "STAY 5, PAY 4 (1 NIGHT FREE)",
      desc: "Book an open-air infinity sanctuary for 4 nights, receive 5th night on us + $100 credit"
    }
  }
,
  {
    id: "stay-21",
    numeral: "XXI",
    name: "Grace Hotel, Auberge Resorts Collection",
    subtitle: "Whitewashed Cycladic Clifftop Cave Suites Overlooking Skaros Rock & World-Renowned Sunsets",
    location: "Imerovigli, Santorini",
    country: "Santorini, Greece",
    badge: "COLLECTION № 21 · SANTORINI, GREECE",
    rating: "4.99",
    reviews: "1,320+",
    pricePerNight: "From $1,850",
    priceAmount: "$1,850",
    seasonalRange: "Low $1,350+ · Summer Grand $3,400+",
    rateInclusions: "Includes private airport limousine transfer, daily Champagne breakfast & caldera spa access",
    forbesTier: "Forbes Travel Guide 5-Star & World's Best Clifftop Hotel",
    image: "/images/stayhelper/grace_santorini_wide_hero.jpg",
    wideHero: "/images/stayhelper/grace_santorini_wide_hero.jpg",
    videoSrc: "/videos/StayHelperGraceSantorini_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/grace_santorini_wide_hero.jpg",
    bookingUrl: "https://aubergeresorts.com/gracehotel/",
    status: "STREAMING",
    story: [
      "Perched high above the azure Aegean Sea, Grace Hotel, Auberge Resorts Collection is an ethereal clifftop sanctuary carved directly into Santorini's dramatic volcanic caldera in peaceful Imerovigli.",
      "Cascading whitewashed terraces, handcrafted Cycladic cave suites, and the island's most iconic heated infinity pool offer front-row, private seats to the world's most celebrated sunsets over Skaros Rock."
],
    features: [
      {
            "title": "Suspended Caldera Infinity Pool",
            "desc": "Santorini's premier heated infinity pool cantilevered 300 meters above the Aegean"
      },
      {
            "title": "Sculpted Volcanic Cave Suites",
            "desc": "Minimalist organic Cycladic architecture with private plunge pools facing the sea"
      },
      {
            "title": "Varoulko Santorini Gastronomy",
            "desc": "Michelin-starred Greek seafood dining by renowned Chef Lefteris Lazarou"
      }
],
    activeDeal: {
      title: "Santorini Escape · 4th Night Complimentary",
      tag: "STAY 4, PAY 3 (1 NIGHT FREE)",
      desc: "Enjoy a complimentary 4th night + Private Santorini Airport/Port roundtrip limousine transfer"
    }
  },
  {
    id: "stay-22",
    numeral: "XXII",
    name: "Hôtel Plaza Athénée",
    subtitle: "The Haute Couture Crown Jewel of Avenue Montaigne with Private Eiffel Tower Balconies",
    location: "Avenue Montaigne, 8th Arr.",
    country: "Paris, France",
    badge: "COLLECTION № 22 · PARIS, FRANCE",
    rating: "4.99",
    reviews: "2,150+",
    pricePerNight: "From $2,400",
    priceAmount: "$2,400",
    seasonalRange: "Low $1,900+ · Fashion Week $4,800+",
    rateInclusions: "Includes daily American breakfast for two, Dior Spa priority access & House of Dior welcome",
    forbesTier: "French Distinction Palace & Forbes 5-Star",
    image: "/images/stayhelper/plaza_athenee_wide_hero.jpg",
    wideHero: "/images/stayhelper/plaza_athenee_wide_hero.jpg",
    videoSrc: "/videos/StayHelperPlazaAthenee_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/plaza_athenee_wide_hero.jpg",
    bookingUrl: "https://www.dorchestercollection.com/paris/hotel-plaza-athenee",
    status: "STREAMING",
    story: [
      "Commanding the prestigious Avenue Montaigne since 1913, Hôtel Plaza Athénée is the legendary heart of Parisian haute couture, surrounded by the world's greatest fashion houses and cherished by cinema legends.",
      "Cascading with nearly two thousand signature scarlet geraniums, its Haussmannian suites feature private wrought-iron balconies opening directly onto full-frame, magical vistas of the Eiffel Tower."
],
    features: [
      {
            "title": "Signature Eiffel Balconies",
            "desc": "Wrought-iron private balconies framing the ultimate direct view of the Eiffel Tower"
      },
      {
            "title": "The Dior Spa Plaza Athénée",
            "desc": "Haute-couture holistic treatments developed exclusively by the House of Dior"
      },
      {
            "title": "Cour Jardin Courtyard",
            "desc": "Historic ivy-draped courtyard adorned with thousands of signature red geraniums"
      }
],
    activeDeal: {
      title: "Guaranteed Eiffel Upgrade & Double Credit",
      tag: "GUARANTEED UPGRADE AT CONFIRMATION",
      desc: "Guaranteed room upgrade at booking + €200 double culinary & spa credit"
    }
  },
  {
    id: "stay-23",
    numeral: "XXIII",
    name: "The St. Regis Bora Bora Resort",
    subtitle: "French Polynesia’s Largest Overwater Villas with Glass Floor Panels & Mount Otemanu Views",
    location: "Motu Tupei, Bora Bora",
    country: "Bora Bora, French Polynesia",
    badge: "COLLECTION № 23 · BORA BORA",
    rating: "4.99",
    reviews: "1,410+",
    pricePerNight: "From $2,650",
    priceAmount: "$2,650",
    seasonalRange: "Low $2,100+ · Festive Season $5,200+",
    rateInclusions: "Includes 24-hour St. Regis Butler service, scenic lagoon boat transfers & gourmet breakfast",
    forbesTier: "World's Best Overwater Resort & Condé Nast Gold List",
    image: "/images/stayhelper/st_regis_bora_bora_wide_hero.jpg",
    wideHero: "/images/stayhelper/st_regis_bora_bora_wide_hero.jpg",
    videoSrc: "/videos/StayHelperStRegisBoraBora_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/st_regis_bora_bora_wide_hero.jpg",
    bookingUrl: "https://www.marriott.com/en-us/hotels/bobxr-the-st-regis-bora-bora-resort/overview/",
    status: "STREAMING",
    story: [
      "Spanning forty-four lush tropical acres on a private motu in French Polynesia, The St. Regis Bora Bora Resort represents the zenith of South Pacific barefoot luxury.",
      "The resort boasts the largest overwater villas in the South Pacific starting at 1,500 square feet, equipped with private glass floor viewing panels looking into living coral gardens and plunge pools facing Mount Otemanu."
],
    features: [
      {
            "title": "Largest Overwater Villas in Polynesia",
            "desc": "Expansive 1,500+ sq ft villas with private glass viewing floors to the lagoon"
      },
      {
            "title": "St. Regis Signature Butler Service",
            "desc": "Unrivaled 24-hour bespoke attention for packing, unpacking and private dining"
      },
      {
            "title": "Private Iridium Spa Islet",
            "desc": "13,000 sq ft spa sanctuary on its own private lagoon island using native monoi"
      }
],
    activeDeal: {
      title: "Bora Bora Paradise · 5th Night Free",
      tag: "STAY 5, PAY 4 (1 NIGHT FREE)",
      desc: "Enjoy a complimentary 5th night + Private roundtrip airport boat transfer & 24hr Butler Service"
    }
  },
  {
    id: "stay-24",
    numeral: "XXIV",
    name: "Taj Lake Palace",
    subtitle: "18th-Century Floating White Marble Royal Water Palace in the Center of Lake Pichola",
    location: "Lake Pichola, Udaipur, Rajasthan",
    country: "Udaipur, India",
    badge: "COLLECTION № 24 · UDAIPUR, INDIA",
    rating: "4.99",
    reviews: "1,880+",
    pricePerNight: "From $1,250",
    priceAmount: "$1,250",
    seasonalRange: "Summer $950+ · Royal Peak $2,900+",
    rateInclusions: "Includes private ceremonial royal barge transfers, traditional welcome ritual & Mewar breakfast",
    forbesTier: "World's Most Romantic Palace & Condé Nast Traveler Top 10",
    image: "/images/stayhelper/taj_lake_palace_wide_hero.jpg",
    wideHero: "/images/stayhelper/taj_lake_palace_wide_hero.jpg",
    videoSrc: "/videos/StayHelperTajLakePalace_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/taj_lake_palace_wide_hero.jpg",
    bookingUrl: "https://www.tajhotels.com/en-in/taj/taj-lake-palace-udaipur/",
    status: "STREAMING",
    story: [
      "Built in 1746 by Maharana Jagat Singh II as a royal summer pleasure palace, Taj Lake Palace floats like an ethereal white marble mirage on the tranquil waters of Lake Pichola.",
      "Arriving aboard a handcrafted private royal barge showered with rose petals, guests experience authentic Mewar royal hospitality with hand-painted frescoes, stained glass arches, and serene lily ponds."
],
    features: [
      {
            "title": "Pure Marble Floating Architecture",
            "desc": "Four-acre island palace of pure white marble rising directly out of Lake Pichola"
      },
      {
            "title": "Jiva Spa Boat Rituals",
            "desc": "Signature Ayurvedic treatments aboard a private heritage wooden spa boat on the lake"
      },
      {
            "title": "Mewar Royal Grand Heritage Suites",
            "desc": "Original royal chambers with ornate stained glass, carved jali screens and lake views"
      }
],
    activeDeal: {
      title: "Royal Heritage Special · 3rd Night Free",
      tag: "STAY 3, PAY 2 (1 NIGHT FREE)",
      desc: "Complimentary 3rd night + Private Lake Pichola sunset champagne cruise on the historic royal barge"
    }
  },
  {
    id: "stay-25",
    numeral: "XXV",
    name: "Bürgenstock Hotel & Alpine Spa",
    subtitle: "500-Meter Sheer Clifftop Wonder with World-Famous Cantilevered Heated Infinity Spa",
    location: "Bürgenberg, Obbürgen",
    country: "Lake Lucerne, Switzerland",
    badge: "COLLECTION № 25 · SWITZERLAND",
    rating: "4.99",
    reviews: "1,190+",
    pricePerNight: "From $1,750",
    priceAmount: "$1,750",
    seasonalRange: "Autumn $1,350+ · Winter Ski Peak $3,100+",
    rateInclusions: "Includes MS Bürgenstock lake catamaran shuttle, 1888 cliff funicular pass & 10,000 sqm spa access",
    forbesTier: "Forbes Travel Guide 5-Star & Europe's #1 Alpine Spa",
    image: "/images/stayhelper/burgenstock_wide_hero.jpg",
    wideHero: "/images/stayhelper/burgenstock_wide_hero.jpg",
    videoSrc: "/videos/StayHelperBurgenstock_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/burgenstock_wide_hero.jpg",
    bookingUrl: "https://burgenstockresort.com/",
    status: "STREAMING",
    story: [
      "Perched on a monumental ridge 500 meters vertically above Lake Lucerne, Bürgenstock Resort is an architectural tour de force combining historic Swiss alpine heritage with cutting-edge modernist design.",
      "The resort features Europe's largest alpine spa spanning 10,000 square meters, highlighted by its world-famous cantilevered outdoor infinity pool hovering directly over the misty lake abyss."
],
    features: [
      {
            "title": "Cantilevered Clifftop Infinity Pool",
            "desc": "Outdoor heated thermal pool hovering 500 meters directly over Lake Lucerne"
      },
      {
            "title": "10,000 sqm Alpine Spa Sanctuary",
            "desc": "Three levels of panoramic saunas, saline floating pools, and private alpine gardens"
      },
      {
            "title": "Historic 1888 Cliff Funicular",
            "desc": "Private direct lake catamaran connection and historic funicular railway ascent"
      }
],
    activeDeal: {
      title: "Swiss Alpine Escape · 4th Night Free",
      tag: "STAY 4, PAY 3 (1 NIGHT FREE)",
      desc: "Complimentary 4th night + Unlimited MS Bürgenstock lake catamaran & historic funicular pass"
    }
  },
  {
    id: "stay-26",
    numeral: "XXVI",
    name: "The Silo Hotel",
    subtitle: "Thomas Heatherwick’s Pillowed Glass Architectural Triumph Above V&A Waterfront",
    location: "V&A Waterfront, Cape Town",
    country: "Cape Town, South Africa",
    badge: "COLLECTION № 26 · CAPE TOWN",
    rating: "4.99",
    reviews: "890+",
    pricePerNight: "From $1,650",
    priceAmount: "$1,650",
    seasonalRange: "Low $1,250+ · Summer Peak $3,200+",
    rateInclusions: "Includes gourmet table breakfast, private Zeitz MOCAA museum pass & rooftop access",
    forbesTier: "Architectural Digest Global Icon & The Royal Portfolio",
    image: "/images/stayhelper/the_silo_wide_hero.jpg",
    wideHero: "/images/stayhelper/the_silo_wide_hero.jpg",
    videoSrc: "/videos/StayHelperTheSilo_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/the_silo_wide_hero.jpg",
    bookingUrl: "https://www.theroyalportfolio.com/the-silo/",
    status: "STREAMING",
    story: [
      "Soaring above the historic grain elevator complex of Cape Town's V&A Waterfront, The Silo Hotel is a breathtaking architectural masterpiece designed by visionary architect Thomas Heatherwick.",
      "Crowned with monumental 5.5-meter convex, pillowed geometric glass windows, the hotel houses museum-grade contemporary African art and offers an exclusive 11th-floor rooftop pool with 360-degree vistas of Table Mountain."
],
    features: [
      {
            "title": "Thomas Heatherwick Pillowed Windows",
            "desc": "5.5-meter multi-faceted convex glass panels reflecting Cape Town's harbor and sky"
      },
      {
            "title": "Table Mountain Rooftop Sky Pool",
            "desc": "11th-floor transparent swimming pool directly framed by the silhouette of Table Mountain"
      },
      {
            "title": "Zeitz MOCAA Art Integration",
            "desc": "Built directly above Africa’s largest museum of contemporary art with private curator access"
      }
],
    activeDeal: {
      title: "Stay Longer · 25% Off (4+ Nights)",
      tag: "SAVE 25% (4+ NIGHTS)",
      desc: "25% off room rates for 4+ nights + Private Zeitz MOCAA art museum tour & private wine tasting"
    }
  },
  {
    id: "stay-27",
    numeral: "XXVII",
    name: "Museum Hotel Cappadocia",
    subtitle: "Turkey’s Sole Relais & Châteaux with Roman Infinity Pool Facing Daily Hot Air Balloons",
    location: "Uchisar, Nevsehir",
    country: "Cappadocia, Turkey",
    badge: "COLLECTION № 27 · CAPPADOCIA",
    rating: "4.99",
    reviews: "1,120+",
    pricePerNight: "From $980",
    priceAmount: "$980",
    seasonalRange: "Low $750+ · Balloon Peak $1,950+",
    rateInclusions: "Includes organic farm-to-table breakfast, museum registered antique curation & valley transfers",
    forbesTier: "Relais & Châteaux Exclusive & Europe's Best Historic Hotel",
    image: "/images/stayhelper/museum_hotel_wide_hero.jpg",
    wideHero: "/images/stayhelper/museum_hotel_wide_hero.jpg",
    videoSrc: "/videos/StayHelperMuseumHotel_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/museum_hotel_wide_hero.jpg",
    bookingUrl: "https://www.museumhotel.com.tr/",
    status: "STREAMING",
    story: [
      "Carved into the ancient volcanic slopes of Uchisar, Museum Hotel Cappadocia is Turkey’s only Relais & Châteaux hotel, meticulously restored from thousands of years of Byzantine and Roman cave dwellings.",
      "Decorated with registered historical antiques, its centerpiece is the heated Roman outdoor pool, where guests float at dawn as hundreds of vibrantly colored hot air balloons rise into the sunrise sky over the fairy chimneys."
],
    features: [
      {
            "title": "Balloon Sunrise Roman Pool",
            "desc": "Heated Roman outdoor pool perfectly situated beneath the daily hot air balloon flight path"
      },
      {
            "title": "Living Museum Cave Heritage",
            "desc": "Restored authentic cave suites filled with registered museum-grade Turkish antiques"
      },
      {
            "title": "Lil'a Fine Dining Gastronomy",
            "desc": "Michelin-recommended modern Anatolian cuisine with ingredients from the hotel's organic farm"
      }
],
    activeDeal: {
      title: "Guaranteed Cave Suite Upgrade",
      tag: "GUARANTEED CAVE SUITE UPGRADE",
      desc: "Guaranteed upgrade to Imperial Cave Suite for 3+ nights + Complimentary 4-course dinner for 2 at Lil'a"
    }
  },
  {
    id: "stay-28",
    numeral: "XXVIII",
    name: "The Retreat at Blue Lagoon",
    subtitle: "Subterranean Geothermal Sanctuary Carved into an 800-Year-Old Volcanic Lava Field",
    location: "Grindavík, Reykjanes Peninsula",
    country: "Grindavík, Iceland",
    badge: "COLLECTION № 28 · ICELAND",
    rating: "4.99",
    reviews: "980+",
    pricePerNight: "From $1,950",
    priceAmount: "$1,950",
    seasonalRange: "Low $1,550+ · Aurora Peak $3,200+",
    rateInclusions: "Includes unlimited Retreat Lagoon access, private host, Blue Lagoon Ritual & Icelandic breakfast",
    forbesTier: "Forbes Travel Guide 5-Star & Time Magazine World's Greatest Places",
    image: "/images/stayhelper/retreat_blue_lagoon_wide_hero.jpg",
    wideHero: "/images/stayhelper/retreat_blue_lagoon_wide_hero.jpg",
    videoSrc: "/videos/StayHelperRetreatBlueLagoon_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/retreat_blue_lagoon_wide_hero.jpg",
    bookingUrl: "https://www.bluelagoon.com/accommodation/retreat-hotel",
    status: "STREAMING",
    story: [
      "Nestled within an 800-year-old volcanic lava flow in a UNESCO Global Geopark, The Retreat at Blue Lagoon is an extraordinary sanctuary of Nordic minimalism and geothermal wellness.",
      "Its suites feature private terraces stepping directly into secluded geothermal waters, while subterranean lava spa chambers offer transformative rituals with silica, algae, and pure volcanic minerals beneath the Northern Lights."
],
    features: [
      {
            "title": "Private Stepping-Stone Lagoon",
            "desc": "Suites with private stone terraces stepping directly into private mineral-rich waters"
      },
      {
            "title": "Subterranean Lava Spa Ritual",
            "desc": "Underground spa chambers carved into raw basalt offering 4-step geothermal mineral therapy"
      },
      {
            "title": "Midnight Aurora Viewing",
            "desc": "Float in steaming 38°C geothermal waters under dancing green Northern Lights"
      }
],
    activeDeal: {
      title: "In-Water Spa Ritual Special",
      tag: "FREE IN-WATER MASSAGE FOR 2",
      desc: "Includes complimentary signature 4-step Blue Lagoon Ritual & private in-water geothermal massage for 2"
    }
  },
  {
    id: "stay-29",
    numeral: "XXIX",
    name: "Belmond Hotel Cipriani",
    subtitle: "The Ultimate Venetian Aristocratic Hideaway on Giudecca Island with Olympic Seawater Pool",
    location: "Giudecca Island, Venice",
    country: "Venice, Italy",
    badge: "COLLECTION № 29 · VENICE, ITALY",
    rating: "4.99",
    reviews: "1,670+",
    pricePerNight: "From $2,250",
    priceAmount: "$2,250",
    seasonalRange: "Low $1,750+ · Biennale/Film Festival $4,500+",
    rateInclusions: "Includes 24hr private mahogany launch Shirley, gourmet Venetian buffet breakfast & Casanova gardens pass",
    forbesTier: "Leading Hotels of the World & Forbes Travel Guide 5-Star",
    image: "/images/stayhelper/belmond_cipriani_wide_hero.jpg",
    wideHero: "/images/stayhelper/belmond_cipriani_wide_hero.jpg",
    videoSrc: "/videos/StayHelperBelmondCipriani_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/belmond_cipriani_wide_hero.jpg",
    bookingUrl: "https://www.belmond.com/hotels/europe/italy/venice/belmond-hotel-cipriani/",
    status: "STREAMING",
    story: [
      "Set across the lagoon on the peaceful eastern tip of Giudecca Island, Belmond Hotel Cipriani has reigned as the timeless haven of royalty, Hollywood icons, and literary figures since 1958.",
      "Just five minutes by private mahogany launch from St. Mark's Square, it offers Venice's only Olympic-sized heated saltwater pool, historic Casanova botanical gardens, and the birthplace of the legendary white peach Bellini."
],
    features: [
      {
            "title": "Private Launch 'Shirley'",
            "desc": "24-hour private varnished mahogany speedboat crossing to St. Mark's Square in 5 minutes"
      },
      {
            "title": "Olympic-Sized Saltwater Pool",
            "desc": "Venice's only heated Olympic seawater pool set within fragrant private botanical gardens"
      },
      {
            "title": "The Historic Gabbiano Bar",
            "desc": "Birthplace of the original white peach Bellini overlooking sunset reflections on the lagoon"
      }
],
    activeDeal: {
      title: "Bellini Double Credit & Private Launch",
      tag: "DOUBLE RESORT CREDIT ($200)",
      desc: "$200 Bellini Club hotel credit + 24hr private mahogany launch service 'Shirley' across St. Mark's Square"
    }
  },
  {
    id: "stay-30",
    numeral: "XXX",
    name: "Tierra Patagonia Hotel & Spa",
    subtitle: "Organic Wind-Sculpted Lenga Lodge Framing Panoramic Horns of Torres del Paine",
    location: "Torres del Paine, Magallanes",
    country: "Patagonia, Chile",
    badge: "COLLECTION № 30 · PATAGONIA",
    rating: "4.99",
    reviews: "920+",
    pricePerNight: "From $2,400",
    priceAmount: "$2,400",
    seasonalRange: "Spring $1,950+ · Expedition Peak $3,800+",
    rateInclusions: "All-inclusive: daily private naturalist excursions, full board gourmet dining, premium open bar & Uma spa",
    forbesTier: "National Geographic Unique Lodge & Condé Nast Traveler Gold List",
    image: "/images/stayhelper/tierra_patagonia_wide_hero.jpg",
    wideHero: "/images/stayhelper/tierra_patagonia_wide_hero.jpg",
    videoSrc: "/videos/StayHelperTierraPatagonia_Master_Reel.mp4",
    posterSrc: "/images/stayhelper/tierra_patagonia_wide_hero.jpg",
    bookingUrl: "https://tierrahotels.com/patagonia/",
    status: "STREAMING",
    story: [
      "Emerging effortlessly from the golden Patagonian steppe on the shores of Lake Sarmiento, Tierra Patagonia is an organic architectural masterpiece sculpted from native lenga wood by architect Cazú Zegers.",
      "The lodge blends invisibly into the wind-swept landscape, with every guest room and the glass-enclosed Uma Spa pool framing unobstructed, awe-inspiring views of the granite towers of Torres del Paine National Park."
],
    features: [
      {
            "title": "Wind-Sculpted Organic Architecture",
            "desc": "Curved native lenga wood lodge harmonizing seamlessly with the Patagonian prairie"
      },
      {
            "title": "Glass-Enclosed Uma Spa Pool",
            "desc": "Heated indoor pool with floor-to-ceiling glass framing dramatic mountain horns"
      },
      {
            "title": "Private Naturalist Expeditions",
            "desc": "Small-group hiking, horseback riding and glacier treks guided by expert local naturalists"
      }
],
    activeDeal: {
      title: "Patagonia All-Inclusive · Stay 4, Pay 3",
      tag: "STAY 4, PAY 3 (ALL-INCLUSIVE)",
      desc: "Complimentary 4th night + Daily private excursions with naturalist guides & premium open bar"
    }
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
  
  const [selectedStayId, setSelectedStayId] = useState<string>("stay-04"); // Four Seasons Resort Koh Samui default (Active Spotlight)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);

  // VIP Membership State
  const [member, setMember] = useState<MemberData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);

  // Read member status and randomize initial stay on mount + unmuted autoplay
  useEffect(() => {
    // 1. Randomize starting sanctuary on every visitor load across all 20 stays
    const randomIndex = Math.floor(Math.random() * ALL_STAYS.length);
    setSelectedStayId(ALL_STAYS[randomIndex].id);

    // 2. Sync member
    const syncMember = () => {
      try {
        const stored =
          localStorage.getItem("stayhelper_member") ||
          localStorage.getItem("stayhelper_user") ||
          localStorage.getItem("sh_member_user");
        if (stored) {
          setMember(JSON.parse(stored));
        } else {
          setMember(null);
        }
      } catch (e) {
        console.error("Local storage load error", e);
      }
    };
    syncMember();
    window.addEventListener("stayhelper_auth_changed", syncMember);

    // 3. Luxury Unmuted Autoplay: Start unmuted audio on web & mobile immediately
    const startAutoplay = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          // If strict browser policy temporarily blocks unmuted autoplay before first touch
          console.log("Unmuted autoplay restricted by browser policy, falling back to instant gesture unlock:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    };
    startAutoplay();

    // First touch/click anywhere on screen immediately unlocks full luxury audio
    const unlockSoundOnTouch = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", unlockSoundOnTouch, { once: true });
    window.addEventListener("touchstart", unlockSoundOnTouch, { once: true });
    window.addEventListener("click", unlockSoundOnTouch, { once: true });

    return () => {
      window.removeEventListener("stayhelper_auth_changed", syncMember);
      window.removeEventListener("pointerdown", unlockSoundOnTouch);
      window.removeEventListener("touchstart", unlockSoundOnTouch);
      window.removeEventListener("click", unlockSoundOnTouch);
    };
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem("stayhelper_member");
      localStorage.removeItem("stayhelper_user");
      localStorage.removeItem("sh_member_user");
      document.cookie = "stayhelper_user=; path=/; max-age=0;";
      fetch("/api/auth/quick", { method: "DELETE" }).catch(() => {});
    } catch (e) {
      console.error("Sign out error", e);
    }
    setMember(null);
    window.dispatchEvent(new Event("stayhelper_auth_changed"));
  };

  const currentStay = ALL_STAYS.find((s) => s.id === selectedStayId) || ALL_STAYS[0];
  const currentIndex = ALL_STAYS.findIndex((s) => s.id === selectedStayId);
  const heroBackground = currentStay.wideHero || currentStay.posterSrc;

  // Auto-scroll active item horizontally into view in the dock without scrolling window
  useEffect(() => {
    if (dockScrollRef.current) {
      const activeEl = dockScrollRef.current.querySelector(`[data-dock-id="${selectedStayId}"]`) as HTMLElement;
      if (activeEl) {
        const container = dockScrollRef.current;
        const scrollTarget = activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;
        container.scrollTo({ left: scrollTarget, behavior: "smooth" });
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
      videoRef.current.muted = isMuted;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
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

    // Touch swipe detection for mobile reels
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaTime = Date.now() - (touchStartTime.current || 0);

    // If swipe was deliberate (within 600ms and threshold > 45px)
    if (deltaTime < 600) {
      if (deltaY < -45 || deltaX < -50) {
        // Swiped UP or LEFT -> Next Stay!
        handleNextStay();
      } else if (deltaY > 45 || deltaX > 50) {
        // Swiped DOWN or RIGHT -> Previous Stay!
        handlePrevStay();
      }
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  const FORA_VIP_INTAKE_URL = "https://secure.foratravel.com/intake/VXwROA88te";

  const handleBookingAction = (_targetUrl?: string) => {
    // Direct 1-Click to CEO's Official Fora Travel VIP Perks Booking Portal
    window.open(FORA_VIP_INTAKE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F3EFE6] selection:bg-[#B89B72]/30 selection:text-white font-luxury-sans">
      
      {/* ============================================================== */}
      {/* 1. CONCEPT 3: FULL-BLEED ARCHITECTURAL CINEMA HERO STAGE     */}
      {/* ============================================================== */}
      {/* 1. CONCEPT 3: 100% IMMERSIVE FULL-BLEED REELS STAGE (RESPONSIVE SEPARATION) */}
      {/* ============================================================================== */}
      <section id="sanctuary-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="relative h-[100dvh] w-full overflow-hidden bg-black select-none">
        
        {/* ========================================================= */}
        {/* [MOBILE ONLY: lg:hidden] 100% IMMERSIVE FULL-SCREEN REELS */}
        {/* ========================================================= */}
        <div className="lg:hidden absolute inset-0 w-full h-full z-0 overflow-hidden">
          {/* 100% Full-Bleed Video Background */}
          <video
            ref={videoRef}
            key={`mobile-${currentStay.id}-${currentStay.videoSrc}`}
            src={currentStay.videoSrc}
            poster={currentStay.posterSrc}
            playsInline
            autoPlay
            muted={isMuted}
            onEnded={() => handleNextStay()}
            className="w-full h-full object-cover"
            onClick={() => {
              if (isEnded) restartVideo();
              else handleBookingAction(currentStay.bookingUrl);
            }}
          />

          {/* Top Contrast Vignette */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
          
          {/* Bottom Contrast Vignette */}
          <div className="absolute bottom-0 inset-x-0 h-[480px] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

          {/* Mobile Top Floating Header */}
          <div className="absolute top-0 inset-x-0 z-20 px-4 pt-4 flex items-center justify-between pointer-events-auto">
            <Link href="/stayhelper" className="text-lg font-luxury-serif tracking-[0.22em] text-white uppercase font-light drop-shadow-lg">
              STAYHELPER
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
                className="px-2.5 py-1.5 rounded-full bg-black/60 border border-white/20 text-white text-[11px] font-mono flex items-center gap-1 backdrop-blur-md"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#E8D5B5]" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={() => handleBookingAction(currentStay.bookingUrl)}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A880] text-black text-[11px] font-luxury-sans font-semibold tracking-wider shadow-lg active:scale-95"
              >
                VIP Perks ✨
              </button>
            </div>
          </div>

          {/* Mobile Bottom Content Overlay (Instagram Reels Style - Hidden on stay-04 which has burned-in Remotion typography) */}
          <div className="absolute bottom-16 inset-x-4 z-20 space-y-1.5 text-left drop-shadow-2xl pointer-events-auto">
            {/* Native Swipe Cue */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-[#E8D5B5]/30 text-[#E8D5B5] text-[9px] font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Swipe up / down for next stay</span>
            </div>

            {/* Stay Meta */}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[#E8D5B5] text-[10px] font-mono tracking-widest uppercase">
                <span>№ {String(currentIndex + 1).padStart(2, "0")}</span>
                <span className="text-white/40">·</span>
                <span>{currentStay.numeral}</span>
                <span className="text-white/40">·</span>
                <span className="text-white font-medium">{currentStay.country}</span>
              </div>
            </div>

            {/* Hotel Title */}
            <h1 className="text-2xl sm:text-3xl font-luxury-serif font-light text-white tracking-tight leading-tight drop-shadow-2xl">
              {currentStay.name}
            </h1>

            {/* Subtitle */}
            <p className="text-xs italic font-luxury-serif text-[#E8D5B5]/95 leading-snug line-clamp-2">
              "{currentStay.subtitle}"
            </p>

            {/* Active Promotion Badge */}
            {currentStay.activeDeal && (
              <div className="pt-0.5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/35 via-[#F3E5AB]/25 to-[#D4AF37]/15 border border-[#D4AF37]/70 backdrop-blur-md shadow-xl">
                  <span className="text-amber-300 animate-pulse text-xs">✨</span>
                  <div className="text-left">
                    <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-[#F3E5AB] block">
                      PROMOTION · {currentStay.activeDeal.tag}
                    </span>
                    <span className="text-[11px] font-luxury-sans text-white font-medium">
                      {currentStay.activeDeal.desc}
                    </span>
                  </div>
                </div>
              </div>

            )}

          </div>

          {/* Mobile Bottom Mini Switcher Dock */}
          <div className="absolute bottom-3 inset-x-4 z-20 flex items-center justify-between gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={handlePrevStay}
              className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white text-xs font-mono flex items-center gap-1 backdrop-blur-md active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-[#E8D5B5]" />
              <span>PREV</span>
            </button>
            <div className="text-[10px] font-mono text-white/70 tracking-widest uppercase">
              № {String(currentIndex + 1).padStart(2, "0")} / {ALL_STAYS.length}
            </div>
            <button
              type="button"
              onClick={handleNextStay}
              className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white text-xs font-mono flex items-center gap-1 backdrop-blur-md active:scale-95"
            >
              <span>NEXT</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#E8D5B5]" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* [DESKTOP ONLY: hidden lg:flex] EDITORIAL MAGAZINE LAYOUT   */}
        {/* ========================================================= */}
        <div className="hidden lg:flex flex-col justify-between h-full w-full relative z-10">
          
          {/* Desktop Widescreen Scenery Background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`desktop-hero-${heroBackground}`}
              src={heroBackground}
              alt={currentStay.name}
              className="w-full h-full object-cover object-center scale-[1.01] transition-opacity duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </div>

          {/* Desktop Header */}
          <header className="relative z-30 w-full px-8 xl:px-14 pt-7 flex items-center justify-between gap-4 pointer-events-auto">
            <Link href="/stayhelper" className="flex items-center space-x-3 group shrink-0">
              <span className="text-2xl font-luxury-serif tracking-[0.26em] text-white uppercase font-light drop-shadow-md">
                STAYHELPER
              </span>
            </Link>

            <nav className="flex items-center gap-6 xl:gap-8 text-[11px] font-mono tracking-[0.24em] text-white/80 uppercase drop-shadow">
              <a href="#sanctuary-stage" className="hover:text-white transition-colors">Portfolio</a>
              <span className="text-white/30">—</span>
              <a href="#architectural-dossier" className="hover:text-white transition-colors">Philosophy</a>
              <span className="text-white/30">—</span>
              <a href="#reserve-section" className="hover:text-white transition-colors">Inquire</a>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              {member ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-xs font-mono text-[#E8D5B5] backdrop-blur-md shadow-lg">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{member.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-rose-950/40 border border-white/15 text-[11px] font-mono text-stone-300 transition-all flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3 text-[#E8D5B5]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signin");
                      setPendingRedirectUrl(currentStay.bookingUrl);
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-full border border-white/20 bg-black/30 hover:bg-black/50 text-xs font-mono text-stone-300 transition-all backdrop-blur-md"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setPendingRedirectUrl(currentStay.bookingUrl);
                      setIsAuthModalOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-full border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-xs font-mono text-[#F3E5AB] transition-all backdrop-blur-md"
                  >
                    Join Private Club
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={toggleMute}
                className="px-3.5 py-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/25 text-xs font-mono text-white flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-transform active:scale-95"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#E8D5B5]" />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Sound On</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleBookingAction(currentStay.bookingUrl)}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A880] hover:brightness-110 text-black text-xs font-luxury-sans font-semibold tracking-wider transition-all duration-300 shadow-xl shadow-black/60 flex items-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>Book with VIP Perks ✨</span>
              </button>
            </div>
          </header>

          {/* Desktop Body: Left Typography & Right 9:16 Video Frame */}
          <div className="relative z-20 max-w-[1440px] mx-auto w-full px-8 xl:px-14 flex-1 flex flex-row items-end justify-between gap-12 py-10 my-auto pointer-events-auto">
            {/* Left Label */}
            <div className="space-y-3 max-w-xl text-left drop-shadow-lg shrink-0">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[#E8D5B5] text-[11px] font-mono tracking-widest uppercase">
                  <span>№ {String(currentIndex + 1).padStart(2, "0")}</span>
                  <span className="text-white/40">·</span>
                  <span>{currentStay.numeral}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white font-medium">{currentStay.country}</span>
                </div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-luxury-serif font-light text-white tracking-tight leading-[1.05] drop-shadow-xl">
                {currentStay.name}
              </h1>

              <p className="text-sm font-luxury-sans text-stone-200 tracking-[0.2em] uppercase font-light drop-shadow">
                {currentStay.location} · {currentStay.forbesTier.toUpperCase()}
              </p>

              <p className="text-base italic font-luxury-serif text-[#E8D5B5]/90 leading-relaxed font-light drop-shadow">
                "{currentStay.subtitle}"
              </p>

              {/* Active Promotion Badge */}
              {currentStay.activeDeal && (
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37]/25 via-[#F3E5AB]/20 to-[#D4AF37]/10 border border-[#D4AF37]/60 backdrop-blur-md shadow-lg shadow-black/40">
                    <span className="text-amber-300 animate-pulse text-sm">✨</span>
                    <div className="text-left">
                      <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-[#F3E5AB] block">
                        ACTIVE PROMOTION · {currentStay.activeDeal.tag}
                      </span>
                      <span className="text-sm font-luxury-sans text-white/95 font-medium">
                        {currentStay.activeDeal.desc}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Video Card (Desktop Native) */}
            <div className="shrink-0 flex flex-col items-end justify-center">
              <div className="w-full max-w-[340px] flex items-center justify-between text-[10px] font-mono text-[#E8D5B5]/80 tracking-[0.22em] uppercase px-2 mb-2 drop-shadow">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8D5B5] animate-pulse" />
                  Live Motion Reel
                </span>
                <span className="text-white/40 font-light">№ {String(currentIndex + 1).padStart(2, "0")}</span>
              </div>

              <div className="relative group">
                <div className="absolute -inset-2.5 bg-gradient-to-tr from-[#D4AF37]/20 via-[#B89B72]/15 to-transparent rounded-[30px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative w-[340px] aspect-[9/16] rounded-[22px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-white/20 bg-black/60 backdrop-blur-xs transition-transform duration-500 group-hover:scale-[1.01]">
                  <video
                    key={`desktop-${currentStay.id}-${currentStay.videoSrc}`}
                    src={currentStay.videoSrc}
                    poster={currentStay.posterSrc}
                    playsInline
                    autoPlay
                    muted={isMuted}
                    onEnded={() => handleNextStay()}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      if (isEnded) restartVideo();
                      else handleBookingAction(currentStay.bookingUrl);
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                  <div
                    onClick={() => handleBookingAction(currentStay.bookingUrl)}
                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-10"
                  >
                    <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A880] text-black text-xs font-luxury-sans font-bold flex items-center gap-2 shadow-2xl">
                      <span>Book with VIP Perks ✨</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Timeline Dock */}
          <div className="relative z-30 w-full px-8 xl:px-12 pb-7 flex flex-row items-center justify-between gap-4 pointer-events-auto">
            <div className="bg-black/60 backdrop-blur-2xl border border-white/20 rounded-xl px-4 py-2 shadow-2xl flex items-center gap-3 w-full max-w-[calc(100%-250px)] xl:max-w-[calc(100%-270px)] min-w-0">
              <button
                type="button"
                onClick={handlePrevStay}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shrink-0 active:scale-95 cursor-pointer"
                title="Previous Sanctuary"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#E8D5B5]" />
              </button>

              <div
                ref={dockScrollRef}
                className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-1 flex-1 text-center"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {ALL_STAYS.map((stay, idx) => {
                  const isActive = stay.id === selectedStayId;
                  const fullName = stay.name.toUpperCase();
                  return (
                    <button
                      key={stay.id}
                      type="button"
                      data-dock-id={stay.id}
                      onClick={() => handleSelectStay(stay.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-white text-black font-semibold shadow-lg shadow-white/20 scale-[1.02]"
                          : "text-stone-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span className={isActive ? "text-stone-700" : "text-stone-500"}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{fullName}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNextStay}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shrink-0 active:scale-95 cursor-pointer"
                title="Next Sanctuary"
              >
                <ChevronRight className="w-3.5 h-3.5 text-[#E8D5B5]" />
              </button>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <a
                href="#reserve-section"
                className="px-5 py-2.5 rounded-xl border border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/70 text-xs font-mono tracking-wider text-[#E8D5B5] hover:text-white transition-all duration-300 backdrop-blur-md flex items-center gap-2"
              >
                <span>REQUEST SANCTUARY DOSSIER</span>
                <span className="text-[#E8D5B5]">↗</span>
              </a>
            </div>
          </div>
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
                {currentStay.rateInclusions}
              </p>
            </div>

          </div>

          {/* Master Reservation Lockup */}
          <div id="reserve-section" className="rounded-3xl bg-gradient-to-r from-stone-900/90 via-black to-stone-900/90 border border-[#D4AF37]/30 p-8 sm:p-14 text-center space-y-6 shadow-2xl shadow-black/80">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E8D5B5] text-[10px] font-mono uppercase tracking-[0.25em]">
              <span>Official Fora & Virtuoso Partner Privileges</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-luxury-serif font-light text-white tracking-tight max-w-xl mx-auto">
              Reserve Your Private Sanctuary at {currentStay.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto font-light leading-relaxed">
              Book at official hotel rates and receive exclusive VIP privileges: <strong className="text-[#E8D5B5] font-normal">Daily Complimentary Breakfast for 2</strong>, <strong className="text-[#E8D5B5] font-normal">$100 Resort / Spa Credit</strong>, and <strong className="text-[#E8D5B5] font-normal">Room Upgrade Priority</strong>.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleBookingAction(currentStay.name)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A880] hover:brightness-110 text-black text-xs font-luxury-sans font-bold tracking-wider transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Reserve with VIP Perks (Breakfast + $100 Credit) 🥂</span>
              </button>
              <a
                href={currentStay.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 text-xs font-luxury-sans text-stone-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Official Hotel Website ↗</span>
              </a>
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
        initialMode={authMode}
        title={
          authMode === "signin"
            ? `Sign In to Private Club · ${currentStay.name}`
            : `Join StayHelper Private Club · ${currentStay.name}`
        }
        subtitle={
          authMode === "signin"
            ? "Enter your registered email to resume your complimentary VIP sanctuary dossier access."
            : "Unlock direct verified partner booking links, live room rates, and cinematic master reels."
        }
        onSuccess={(userData) => {
          const newMember = {
            name: userData.name,
            email: userData.email,
            signedUpAt: new Date().toISOString()
          };
          setMember(newMember);
          setIsAuthModalOpen(false);
          if (pendingRedirectUrl) {
            window.open(pendingRedirectUrl, "_blank", "noopener,noreferrer");
            setPendingRedirectUrl(null);
          }
        }}
      />

    </div>
  );
}
