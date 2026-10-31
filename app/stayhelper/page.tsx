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
    ]
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
    ]
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
    ]
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
]
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
]
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
]
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
]
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
]
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
]
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
]
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
]
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
]
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
  
  const [selectedStayId, setSelectedStayId] = useState<string>("stay-04"); // Four Seasons Resort Koh Samui default (Active Spotlight)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isEnded, setIsEnded] = useState<boolean>(false);

  // VIP Membership State
  const [member, setMember] = useState<MemberData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);

  // Read member status from localStorage on mount and sync on auth change
  useEffect(() => {
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
    return () => window.removeEventListener("stayhelper_auth_changed", syncMember);
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

        {/* 1.1 MINIMALIST FLOATING HEADER (RESPONSIVE NO-OVERLAP) */}
        <header className="relative z-30 w-full px-4 sm:px-8 xl:px-14 pt-5 sm:pt-7 flex items-center justify-between gap-4 pointer-events-auto">
          {/* Brand Logo */}
          <Link href="/stayhelper" className="flex items-center space-x-3 group shrink-0">
            <span className="text-lg sm:text-xl xl:text-2xl font-luxury-serif tracking-[0.2em] sm:tracking-[0.26em] text-white uppercase font-light drop-shadow-md whitespace-nowrap">
              STAYHELPER
            </span>
          </Link>

          {/* Minimalist Editorial Links (Only on wide screens where ample space exists) */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-8 text-[11px] font-mono tracking-[0.24em] text-white/80 uppercase drop-shadow shrink-0">
            <a href="#sanctuary-stage" className="hover:text-white transition-colors">Portfolio</a>
            <span className="text-white/30">—</span>
            <a href="#architectural-dossier" className="hover:text-white transition-colors">Philosophy</a>
            <span className="text-white/30">—</span>
            <a href="#reserve-section" className="hover:text-white transition-colors">Inquire</a>
          </nav>

          {/* Right Direct Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {member ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-xs font-mono text-[#E8D5B5] backdrop-blur-md shrink-0 shadow-lg">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="max-w-[100px] sm:max-w-[140px] truncate">{member.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out of Private Club"
                  className="px-2.5 sm:px-3 py-1.5 rounded-full bg-black/40 hover:bg-rose-950/40 border border-white/15 hover:border-rose-400/40 text-[11px] font-mono text-stone-300 hover:text-rose-200 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <LogOut className="w-3 h-3 text-[#E8D5B5]" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setPendingRedirectUrl(currentStay.bookingUrl);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 bg-black/30 hover:bg-black/50 text-[11px] sm:text-xs font-mono text-stone-300 hover:text-white transition-all backdrop-blur-md cursor-pointer shrink-0"
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
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-[#DFCFA9]/40 hover:border-[#DFCFA9] bg-[#DFCFA9]/10 hover:bg-[#DFCFA9]/20 text-[11px] sm:text-xs font-mono text-[#E8D5B5] transition-all backdrop-blur-md cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Join Private Club</span>
                  <span className="sm:hidden">Join Club</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleBookingAction(currentStay.bookingUrl)}
              className="px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A880] hover:brightness-110 text-black text-xs font-luxury-sans font-semibold tracking-wider transition-all duration-300 shadow-xl shadow-black/60 flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span>Book with VIP Perks ✨</span>
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
              {currentStay.location} · {currentStay.forbesTier.toUpperCase()}
            </p>

            <p className="text-sm sm:text-base italic font-luxury-serif text-[#E8D5B5]/90 leading-relaxed font-light line-clamp-2 sm:line-clamp-none drop-shadow">
              "{currentStay.subtitle}"
            </p>
          </div>

          {/* Right Side: Floating 9:16 Haute-Couture Master Reel (Exact Inset Placement) */}
          <div className="shrink-0 flex flex-col items-center lg:items-end justify-center">
            
            {/* Subtle Minimalist Architectural Inset Header */}
            <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] flex items-center justify-between text-[10px] font-mono text-[#E8D5B5]/80 tracking-[0.22em] uppercase px-2 mb-2.5 drop-shadow">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8D5B5] animate-pulse" />
                Live Motion Inset
              </span>
              <span className="text-white/40 font-light">№ {String(currentIndex + 1).padStart(2, "0")}</span>
            </div>

            {/* Architectural Window with Soft Ambient Glow & Glassmorphism */}
            <div className="relative group">
              
              {/* Soft Ambient Light Halo (Blends naturally with background snow & chalets) */}
              <div className="absolute -inset-2.5 bg-gradient-to-tr from-[#D4AF37]/20 via-[#B89B72]/15 to-transparent rounded-[30px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Main Architectural Motion Frame (No phone chassis, seamless glass bevel) */}
              <div className="relative w-[280px] sm:w-[320px] lg:w-[340px] aspect-[9/16] rounded-[22px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-white/20 bg-black/40 backdrop-blur-xs transition-transform duration-500 group-hover:scale-[1.01]">
                <video
                  ref={videoRef}
                  key={`${currentStay.id}-${currentStay.videoSrc}`}
                  src={currentStay.videoSrc}
                  poster={currentStay.posterSrc}
                  playsInline
                  autoPlay
                  muted={isMuted}
                  onEnded={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.pause();
                    }
                    setIsPlaying(false);
                    setIsEnded(true);
                  }}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => {
                    if (isEnded) {
                      restartVideo();
                    } else {
                      handleBookingAction(currentStay.bookingUrl);
                    }
                  }}
                  title={isEnded ? "Click to replay video" : "Click to check live rates and reserve"}
                />

                {/* Soft Edge Vignette Overlay (Gently blends the frame inward) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                {/* Hover Invitation Overlay */}
                {!isEnded && (
                  <div
                    onClick={() => handleBookingAction(currentStay.bookingUrl)}
                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-10"
                  >
                    <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A880] text-black text-xs font-luxury-sans font-bold flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span>Book with VIP Perks (Breakfast + $100 Credit) ✨</span>
                    </div>
                  </div>
                )}

                {/* Seamless First-Frame Freeze with Subtle Replay Badge (0 Black Screen, Vibrant Initial Scene Preserved) */}
                {isEnded && (
                  <div
                    onClick={restartVideo}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer p-4"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        restartVideo();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 hover:bg-black/80 text-stone-200 hover:text-white text-xs font-mono border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#E8D5B5]" />
                      <span>Replay Reel</span>
                    </button>
                  </div>
                )}

                {/* Minimalist Floating Controls (Softly Fades in on Hover, completely hidden otherwise) */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="text-white hover:text-[#E8D5B5] transition p-1 cursor-pointer"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="text-white hover:text-[#E8D5B5] transition p-1 cursor-pointer"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#E8D5B5]" />}
                    </button>
                    <span className="text-[9px] font-mono text-stone-300">
                      {isMuted ? "Muted" : "Audio On"}
                    </span>
                  </div>
                  {isEnded && (
                    <button
                      type="button"
                      onClick={restartVideo}
                      className="text-stone-300 hover:text-white transition flex items-center gap-1 text-[9px] font-mono cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 text-[#E8D5B5]" />
                      <span>Replay</span>
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* 1.3 FLOATING FROSTED GLASS DOCK (THE 10-SANCTUARY TIMELINE) */}
        <div className="relative z-30 w-full px-4 sm:px-8 xl:px-12 pb-7 flex flex-col lg:flex-row items-center justify-between gap-4 pointer-events-auto">
          
          {/* Expanded Dynamic Timeline Dock (Stretches smoothly on large screens) */}
          <div className="bg-black/60 backdrop-blur-2xl border border-white/20 rounded-xl px-2.5 sm:px-4 py-2 shadow-2xl flex items-center gap-2 sm:gap-3 w-full lg:flex-1 lg:max-w-[calc(100%-250px)] xl:max-w-[calc(100%-270px)] min-w-0">
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
                const fullName = stay.name.toUpperCase();
                return (
                  <button
                    key={stay.id}
                    type="button"
                    data-dock-id={stay.id}
                    onClick={() => handleSelectStay(stay.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-white text-black font-semibold shadow-md ring-1 ring-white/30"
                        : "text-stone-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={isActive ? "text-stone-700 font-bold" : "text-stone-500"}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{fullName}</span>
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
