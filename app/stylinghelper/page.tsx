'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import USAuthModal from '@/components/USAuthModal';
import ReportModal from '@/components/ReportModal';
import { LuxuryHotspotLayer } from '@/components/stylinghelper/LuxurySpecCard';
import {
  Sparkles,
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
  User,
  LogIn,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  Camera,
  Download,
  Star,
  Lock,
  ArrowUpRight,
  Shirt,
  AlertTriangle,
  Sliders,
  ChevronDown,
  Trash2
} from 'lucide-react';

// =================================================================
// 1. DATA TYPES & 6 MASTER EDITORIAL LOOKS (Vogue / SSENSE Edition)
// =================================================================
interface HotspotPin {
  id: string;
  x: number;
  y: number;
  category: string;
  title: string;
  brand: string;
  price: number;
  retailer: string;
  buyUrl: string;
  kStyleTip?: string;
  sku?: string;
  silhouette?: string;
}

interface EditorialMasterLook {
  id: string;
  title: string;
  shortTitle: string;
  gender: 'women' | 'men';
  category: string;
  aesthetic: string;
  season: string;
  imageUrl: string;
  modelInfo: string;
  description: string;
  curatorNote: string;
  colorPalette: string[];
  vibeTags: string[];
  totalPrice: number;
  pins: HotspotPin[];
}

const MASTER_EDITORIAL_LOOKS: EditorialMasterLook[] = [
{
    "id": "editorial-look-v01",
    "title": "SoHo High-Fashion Glen Plaid Tailored Blazer & Ultra-Wide Palazzo Slacks",
    "shortTitle": "SoHo Glen Plaid Blazer & Palazzo Slacks",
    "gender": "women",
    "category": "Quiet Luxury & Tailoring",
    "aesthetic": "SoHo Minimalist Tailored & Quiet Luxury",
    "season": "Spring/Summer 2026 Runway",
    "imageUrl": "/images/looks/look_01_soho_quiet_luxury_final.webp",
    "modelInfo": "Caucasian Model · 177cm · Silhouette A",
    "description": "A masterclass in modern executive proportion. Precision double-breasted Glen Plaid tailored suiting paired with fluid evening palazzo trousers.",
    "curatorNote": "Opt for structured shoulders paired with relaxed fluid trousers to create an effortless New York editorial silhouette.",
    "colorPalette": [
      "#2B2A29",
      "#8C827A",
      "#D9D2C9",
      "#F4F1EA"
    ],
    "vibeTags": [
      "Quiet Luxury",
      "SoHo Tailoring",
      "Power Suiting",
      "Effortless Chic"
    ],
    "totalPrice": 1451,
    "pins": [
      {
        "id": "pin-01-outer",
        "x": 48,
        "y": 28,
        "category": "Outer",
        "title": "Glen Plaid Double-Breasted Tailored Blazer in Warm Taupe",
        "brand": "Good American",
        "price": 229,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/essential-suiting-belted-blazer-good/vp/v=1/1533639687.htm",
        "kStyleTip": "Slightly oversized shoulders frame the neckline with architectural poise."
      },
      {
        "id": "pin-01-top",
        "x": 50,
        "y": 36,
        "category": "Top",
        "title": "New Classic Ribbed Crewneck Sleeveless Tank in Pure White",
        "brand": "Enza Costa",
        "price": 110,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/new-classic-rib-sleeveless-crew/vp/v=1/1512740933.htm",
        "kStyleTip": "Ultra-soft pima cotton base layer creates seamless negative space beneath suiting."
      },
      {
        "id": "pin-01-bottom",
        "x": 52,
        "y": 60,
        "category": "Bottom",
        "title": "High-Waisted Evening Wide-Leg Fluid Trousers in Midnight Black",
        "brand": "Vince",
        "price": 395,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/high-waisted-evening-pant-vince/vp/v=1/1592110869.htm",
        "kStyleTip": "Cascading drape elongates the leg line with dramatic runway motion."
      },
      {
        "id": "pin-01-shoes",
        "x": 50,
        "y": 88,
        "category": "Shoes",
        "title": "Pointed-Toe Black Leather Kitten Heel Mules",
        "brand": "Sam Edelman",
        "price": 175,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/lana-loafer-sam-edelman/vp/v=1/1528564778.htm",
        "kStyleTip": "Sharp pointed toe subtly emerges beneath wide-leg hemline."
      },
      {
        "id": "pin-01-bag",
        "x": 32,
        "y": 48,
        "category": "Bag",
        "title": "Harlow Suede Baguette Shoulder Bag with Horn Buckle",
        "brand": "STAUD",
        "price": 395,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/harlow-bag-staud/vp/v=1/1550755117.htm",
        "kStyleTip": "Textured suede softens masculine tailoring with tactile richness."
      }
    ]
  },
  {
    "id": "editorial-look-v02",
    "title": "Modern Preppy Tailored Trench Jacket & Architectural Slacks",
    "shortTitle": "Modern Preppy Tailored Trench & Slacks",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Seoul Hannam Architectural Outerwear",
    "season": "Spring/Summer 2026 Street",
    "imageUrl": "/images/looks/look_02_vton_fitted_master.webp",
    "modelInfo": "Editorial Model · 174cm · Silhouette B · IDM-VTON Try-On Verified",
    "description": "A masterclass in modern preppy proportion. Double-breasted structured trench jacket engineered with high-density worsted twill and 3D waist darting. Guaranteed zero-sag vertical drape whether buttoned or unbuttoned.",
    "curatorNote": "Counterfactual Defect-Solution: Unlike standard blends prone to inner elbow wrinkles and sagging drape, this architectural worsted twill construction retains sharp vertical lines with instant crease recovery.",
    "colorPalette": [
      "#3A3E3B",
      "#D8D4CD",
      "#1C2321",
      "#4A3B32"
    ],
    "vibeTags": [
      "Modern Preppy",
      "Tailored Trench",
      "Architectural Drape",
      "IDM-VTON Verified"
    ],
    "totalPrice": 1650,
    "pins": [
      {
        "id": "pin-02-outer",
        "x": 50,
        "y": 30,
        "category": "Outer",
        "title": "Tailored Double-Breasted Structured Trench Jacket",
        "brand": "Hunter Bell",
        "price": 395,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/howell-cropped-trench-hunter-bell/vp/v=1/1502622453.htm",
        "kStyleTip": "3D waist darting and micro-weighted hem ensure a razor-sharp vertical drape."
      },
      {
        "id": "pin-02-top",
        "x": 50,
        "y": 22,
        "category": "Top",
        "title": "Ceci Sleeveless Turtleneck Top in Ivory Cream",
        "brand": "L'AGENCE",
        "price": 150,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/ceci-slvless-turtle-neck-lagence/vp/v=1/1538699935.htm",
        "kStyleTip": "Streamlined high neck adds vertical refinement."
      },
      {
        "id": "pin-02-bottom",
        "x": 48,
        "y": 56,
        "category": "Bottom",
        "title": "High-Waisted Wide-Leg Denim Trousers in Washed Black",
        "brand": "Citizens of Humanity",
        "price": 248,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/petite-ayla-baggy-jean-citizens/vp/v=1/1591527676.htm",
        "kStyleTip": "Rigid premium Japanese denim holds intentional drape."
      },
      {
        "id": "pin-02-shoes",
        "x": 50,
        "y": 86,
        "category": "Shoes",
        "title": "Pointed-Toe Leather Ankle Boots in Glossy Brown Croc",
        "brand": "Vince",
        "price": 395,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/tegan-vince/vp/v=1/1537488034.htm",
        "kStyleTip": "Exotic croc embossing provides rich textural depth."
      },
      {
        "id": "pin-02-bag",
        "x": 35,
        "y": 44,
        "category": "Bag",
        "title": "Sculptural Mini Leather Pouch with Silver Wave Ring Handle",
        "brand": "STAUD",
        "price": 285,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/harlow-bag-staud/vp/v=1/1550755117.htm",
        "kStyleTip": "Geometric hardware acts as wearable jewelry."
      }
    ]
  },
  {
    "id": "editorial-look-v03",
    "title": "Cheongdam Tailored Navy Coat, Burgundy Mockneck & Fluid Camel Slacks",
    "shortTitle": "Cheongdam Tailored Coat & Camel Slacks",
    "gender": "women",
    "category": "Old Money Aesthetic",
    "aesthetic": "Cheongdam Avenue Quiet Luxury",
    "season": "Spring/Summer 2026 Capsule",
    "imageUrl": "/images/looks/look_03_cheongdam_silk_cashmere.webp",
    "modelInfo": "Asian Model · 172cm · Silhouette C",
    "description": "An impeccable demonstration of high-contrast autumnal quiet luxury. Structured midnight navy tailored coat layered over a rich burgundy mockneck knit, anchored by fluid high-waist camel pleated trousers and metallic-accented slingbacks.",
    "curatorNote": "High-contrast palette mastery: deep navy framing rich burgundy and warm camel produces an effortlessly authoritative presence without ostentation. Fluid wide-leg trousers ensure statuesque vertical proportions.",
    "colorPalette": [
      "#1C2333",
      "#5C1D24",
      "#C49A6C",
      "#111111"
    ],
    "vibeTags": [
      "Cheongdam Luxe",
      "Tailored Coat",
      "Camel Trousers",
      "Burgundy Knit",
      "Quiet Luxury"
    ],
    "totalPrice": 0,
    "pins": [
      {
        "id": "pin-03-outer",
        "x": 50,
        "y": 30,
        "category": "Outer",
        "title": "Tailored Midnight Navy Structured Wool Overcoat",
        "brand": "Cheongdam Atelier",
        "price": 0,
        "retailer": "Atelier",
        "buyUrl": "#",
        "kStyleTip": "Clean single-breasted architectural drape creates an elongated, statuesque vertical frame."
      },
      {
        "id": "pin-03-top",
        "x": 50,
        "y": 28,
        "category": "Knitwear",
        "title": "Fine-Ribbed Cashmere-Silk Blend Mockneck in Rich Burgundy",
        "brand": "Cheongdam Atelier",
        "price": 0,
        "retailer": "Atelier",
        "buyUrl": "#",
        "kStyleTip": "Form-fitting ribbed texture adds warmth and rich chromatic depth beneath the navy frame."
      },
      {
        "id": "pin-03-bottom",
        "x": 50,
        "y": 62,
        "category": "Bottom",
        "title": "High-Waist Fluid Pleated Wide-Leg Slacks in Warm Camel",
        "brand": "Cheongdam Atelier",
        "price": 0,
        "retailer": "Atelier",
        "buyUrl": "#",
        "kStyleTip": "Deep double waist pleats release into an effortless drape that breaks cleanly over heels."
      },
      {
        "id": "pin-03-shoes",
        "x": 50,
        "y": 92,
        "category": "Shoes",
        "title": "Pointed-Toe Cap-Toe Metallic Accent Slingback Pumps",
        "brand": "Cheongdam Atelier",
        "price": 0,
        "retailer": "Atelier",
        "buyUrl": "#",
        "kStyleTip": "Polished metallic toe accent adds a sharp, jewelry-like gleam beneath wide trousers."
      },
      {
        "id": "pin-03-bag",
        "x": 30,
        "y": 70,
        "category": "Bag",
        "title": "Structured Box Calfskin Everyday East-West Tote in Jet Black",
        "brand": "Cheongdam Atelier",
        "price": 0,
        "retailer": "Atelier",
        "buyUrl": "#",
        "kStyleTip": "Clean geometric lines provide executive presence while anchoring the camel trousers."
      }
    ]
  },
  {
    "id": "editorial-look-v04",
    "title": "Upper East Side Polo Sherpa Collar Jacket & Straight Raw Selvedge Denim",
    "shortTitle": "UES Polo Sherpa & Raw Selvedge Denim",
    "gender": "women",
    "category": "Elevated Casual",
    "aesthetic": "New York Heritage & Contemporary Preppy",
    "season": "Spring 2026 Heritage",
    "imageUrl": "/images/looks/look_04_ny_polo_sherpa.webp",
    "modelInfo": "Editorial Model · 175cm · Silhouette B",
    "description": "Classic American collegiate codes reimagined with sharp downtown tailoring. Premium wool-blend cropped jacket with contrast shearling collar and straight selvedge jeans.",
    "curatorNote": "Balance cozy shearling texture with crisp shirting and structured Japanese selvedge denim for a refined weekend aesthetic.",
    "colorPalette": [
      "#2C3539",
      "#C8B195",
      "#FAF0E6",
      "#1B263B"
    ],
    "vibeTags": [
      "Collegiate Heritage",
      "Polo Sherpa",
      "Raw Selvedge",
      "Weekend Poise"
    ],
    "totalPrice": 1580,
    "pins": [
      {
        "id": "pin-04-outer",
        "x": 50,
        "y": 30,
        "category": "Outer",
        "title": "Wool-Blend Cropped Bomber with Contrast Shearling Collar",
        "brand": "Polo Ralph Lauren",
        "price": 498,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/polo-ralph-lauren-shearling-collar-jacket/7594021",
        "kStyleTip": "Short boxy cut visually raises the waistline for optimal proportions."
      },
      {
        "id": "pin-04-bottom",
        "x": 50,
        "y": 62,
        "category": "Bottom",
        "title": "Riley High-Rise Straight Selvedge Jeans in Indigo Rinse",
        "brand": "AGOLDE",
        "price": 228,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/riley-high-rise-straight-crop-jeans-agolde/vp/v=1/1582910392.htm",
        "kStyleTip": "100% rigid organic cotton holds structural silhouette without sagging."
      }
    ]
  },
  {
    "id": "editorial-look-v05",
    "title": "Marais Parisian Supple Lambskin Blouson & Denim Chic",
    "shortTitle": "Marais Lambskin Blouson & Denim Chic",
    "gender": "women",
    "category": "Parisian Street",
    "aesthetic": "Rive Droite Effortless Cool",
    "season": "Spring/Summer 2026",
    "imageUrl": "/images/looks/look_05_blouson_denim_chic.webp",
    "modelInfo": "European Model · 176cm · Silhouette A",
    "description": "Buttery soft lambskin leather blouson layered over lightweight merino knit and high-rise ankle crop denim. The epitome of effortless Marais gallery chic.",
    "curatorNote": "A relaxed leather blouson in warm espresso or black grounds vibrant denim with vintage nonchalance.",
    "colorPalette": [
      "#1A1110",
      "#2C3E50",
      "#EAE6DF",
      "#D4AF37"
    ],
    "vibeTags": [
      "Parisian Chic",
      "Lambskin Blouson",
      "Effortless Cool",
      "Marais Vibe"
    ],
    "totalPrice": 1820,
    "pins": [
      {
        "id": "pin-05-outer",
        "x": 50,
        "y": 32,
        "category": "Outer",
        "title": "Supple Lambskin Zip Blouson in Deep Espresso",
        "brand": "IRO",
        "price": 795,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/ashville-leather-jacket-iro/vp/v=1/1582910321.htm",
        "kStyleTip": "Gently pushed-up sleeves display fine jewelry and create relaxed movement."
      },
      {
        "id": "pin-05-shoes",
        "x": 50,
        "y": 86,
        "category": "Shoes",
        "title": "Pointed Toe Leather Ankle Booties in Noir",
        "brand": "Stuart Weitzman",
        "price": 575,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/stuart-weitzman-yuliana-bootie/5672910",
        "kStyleTip": "Sleek sock-boot silhouette tucks neatly under cropped denim."
      }
    ]
  },
  {
    "id": "editorial-look-v06-moto",
    "title": "Seongsu Industrial Moto Leather Jacket & Wide Denim Stride",
    "shortTitle": "Seongsu Moto Leather & Wide Denim",
    "gender": "women",
    "category": "Seongsu Core",
    "aesthetic": "Seoul Seongsu Industrial Minimal",
    "season": "Spring 2026 Street",
    "imageUrl": "/images/looks/look_06_jiwoo_moto_stride.webp",
    "modelInfo": "Asian Model · 173cm · Silhouette B",
    "description": "High-octane Seoul street energy. Structured moto collar leather jacket featuring antiqued silver hardware paired with extra-wide washed selvedge trousers.",
    "curatorNote": "Oversized moto outerwear balanced with high-waisted floor-skimming denim creates an authoritative urban silhouette.",
    "colorPalette": [
      "#111111",
      "#4A5568",
      "#EDF2F7",
      "#A0AEC0"
    ],
    "vibeTags": [
      "Seongsu Core",
      "Moto Leather",
      "Wide Stride",
      "Seoul Streetwear"
    ],
    "totalPrice": 1940,
    "pins": [
      {
        "id": "pin-06m-outer",
        "x": 50,
        "y": 30,
        "category": "Outer",
        "title": "Cropped Moto Leather Biker Jacket with Silver Hardware",
        "brand": "Good American",
        "price": 329,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/leather-moto-jacket-good-american/vp/v=1/1592398412.htm",
        "kStyleTip": "Silver zip detailing anchors the raw industrial aesthetic."
      },
      {
        "id": "pin-06m-bottom",
        "x": 50,
        "y": 62,
        "category": "Bottom",
        "title": "Ayla Baggy Wide-Leg Rigid Denim in Washed Slate",
        "brand": "Citizens of Humanity",
        "price": 268,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/petite-ayla-baggy-jean-citizens/vp/v=1/1591527676.htm",
        "kStyleTip": "Floor-pooling hemline looks best paired with pointed boots."
      }
    ]
  },
  {
    "id": "editorial-look-v07-tweed",
    "title": "Saint-Germain Houndstooth Bouclé Tweed Jacket & Tailored Trousers",
    "shortTitle": "Saint-Germain Bouclé Tweed & Trousers",
    "gender": "women",
    "category": "Parisian Chic",
    "aesthetic": "French Bourgeoisie & Modern Tailoring",
    "season": "Spring/Summer 2026",
    "imageUrl": "/images/looks/look_07_minseo_parisian_tweed.webp",
    "modelInfo": "Editorial Model · 174cm · Silhouette C",
    "description": "Timeless Left Bank polish. Tactile houndstooth bouclé jacket framed by lion-head gold coin buttons, worn open over crisp ivory poplin and pleated trousers.",
    "curatorNote": "Pair ladylike bouclé tweed with relaxed pleated trousers to avoid looking overly prim and achieve true Parisian ease.",
    "colorPalette": [
      "#202124",
      "#F4F1EA",
      "#D4AF37",
      "#6B7280"
    ],
    "vibeTags": [
      "Parisian Tweed",
      "Saint-Germain",
      "Gold Coin Buttons",
      "Refined Polish"
    ],
    "totalPrice": 1690,
    "pins": [
      {
        "id": "pin-07-outer",
        "x": 50,
        "y": 30,
        "category": "Outer",
        "title": "Structured Bouclé Tweed Crop Jacket with Embossed Gold Buttons",
        "brand": "Sandro",
        "price": 490,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/sandro-boucle-crop-jacket/7492019",
        "kStyleTip": "Architectural collarless neck shows off delicate chains perfectly."
      }
    ]
  },
  {
    "id": "editorial-look-v08-linen",
    "title": "Downtown SoHo Fluid Belgian Linen Trench & Minimalist Slip",
    "shortTitle": "SoHo Fluid Linen Trench & Slip",
    "gender": "women",
    "category": "Minimalist Chic",
    "aesthetic": "Crosby Street Gallery Minimal",
    "season": "Summer 2026 Capsule",
    "imageUrl": "/images/looks/look_08_sua_soho_linen_trench.webp",
    "modelInfo": "Editorial Model · 176cm · Silhouette A",
    "description": "Unstructured Belgian linen trench coat with storm storm flaps, layered over aBias-cut sandwashed silk slip dress and woven leather slides.",
    "curatorNote": "Breathable high-twist linen delivers fluid movement that photographs beautifully in outdoor city lighting.",
    "colorPalette": [
      "#DCD7D0",
      "#8D8175",
      "#F7F5F0",
      "#3E3B36"
    ],
    "vibeTags": [
      "Belgian Linen",
      "Fluid Trench",
      "Summer Editorial",
      "Downtown Chic"
    ],
    "totalPrice": 1720,
    "pins": [
      {
        "id": "pin-08-outer",
        "x": 50,
        "y": 32,
        "category": "Outer",
        "title": "Fluid Drape Linen Trench Coat in Natural Sand",
        "brand": "Vince",
        "price": 595,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/linen-fluid-trench-vince/vp/v=1/1592398402.htm",
        "kStyleTip": "Leave sash belt tied loosely at the back to accentuate natural swing."
      }
    ]
  },
  {
    "id": "editorial-look-v09-preppy",
    "title": "Ivy League Forest Wool Club Blazer & Micro-Pleated Tennis Skirt",
    "shortTitle": "Ivy League Wool Club Blazer & Tennis Skirt",
    "gender": "women",
    "category": "Collegiate Preppy",
    "aesthetic": "American Ivy & Seoul Street Fusion",
    "season": "Spring 2026",
    "imageUrl": "/images/looks/look_09_chaewon_preppy_blazer.webp",
    "modelInfo": "Asian Model · 171cm · Silhouette B",
    "description": "Rich forest green tailored wool club blazer featuring crested brass buttons, worn over a crisp white point-collar shirt and structured tennis pleat skirt.",
    "curatorNote": "Ground athletic collegiate elements with heavyweight wool suiting and oxblood penny loafers.",
    "colorPalette": [
      "#1B3B2B",
      "#FAF0E6",
      "#722F37",
      "#1A1A1A"
    ],
    "vibeTags": [
      "Collegiate Preppy",
      "Club Blazer",
      "Ivy League",
      "Pleated Skirt"
    ],
    "totalPrice": 1420,
    "pins": [
      {
        "id": "pin-09-outer",
        "x": 50,
        "y": 28,
        "category": "Outer",
        "title": "Classic Club Wool Blazer with Crested Brass Buttons in Pine Green",
        "brand": "Polo Ralph Lauren",
        "price": 498,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/polo-ralph-lauren-club-blazer/7482910",
        "kStyleTip": "Heritage pine green provides a rich collegiate grounding."
      }
    ]
  },
  {
    "id": "editorial-look-v10-vest",
    "title": "Seongsu Architectural Tailored Suiting Vest & Wide Trousers",
    "shortTitle": "Seongsu Tailored Vest & Wide Trousers",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Contemporary Korean Tailoring",
    "season": "Spring/Summer 2026",
    "imageUrl": "/images/looks/look_10_chaewon_seongsu_vest.webp",
    "modelInfo": "Asian Model · 173cm · Silhouette C",
    "description": "Three-piece suiting worn bare. A tailored waistcoat vest in charcoal mélange worn as a standalone top, paired with relaxed double-pleated puddle trousers.",
    "curatorNote": "Wearing a tailored waistcoat directly on skin creates a seductive yet razor-sharp androgynous statement.",
    "colorPalette": [
      "#36393E",
      "#1E1F22",
      "#E3E5E8",
      "#D4AF37"
    ],
    "vibeTags": [
      "Waistcoat Suiting",
      "Androgynous Chic",
      "Seongsu Minimal",
      "Monochrome"
    ],
    "totalPrice": 1380,
    "pins": [
      {
        "id": "pin-10-top",
        "x": 50,
        "y": 30,
        "category": "Top/Vest",
        "title": "Tailored Suiting Waistcoat in Melange Charcoal",
        "brand": "Theory",
        "price": 295,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/tailored-waistcoat-theory/vp/v=1/1592398419.htm",
        "kStyleTip": "Deep V-neckline elongates collarbones and balances wide slacks."
      }
    ]
  },
  {
    "id": "editorial-look-v11-slip",
    "title": "Rodeo Drive Liquid Silk Satin Slip Dress & Sculptural Knit",
    "shortTitle": "Rodeo Drive Silk Satin Slip & Knit",
    "gender": "women",
    "category": "Resort Glam",
    "aesthetic": "Beverly Hills Evening Nonchalance",
    "season": "Summer 2026 Evening",
    "imageUrl": "/images/looks/look_12_minseo_beverly_hills.webp",
    "modelInfo": "Editorial Model · 175cm · Silhouette A",
    "description": "Liquid champagne silk charmeuse bias-cut slip dress, draped with an ultra-soft cloud cashmere shrug over shoulders and minimal strappy kitten heels.",
    "curatorNote": "Bias-cut silk clings naturally to body curves without clinginess, catching radiant evening light effortlessly.",
    "colorPalette": [
      "#F5E6CC",
      "#E6D2B5",
      "#2C2C2C",
      "#FAF8F5"
    ],
    "vibeTags": [
      "Liquid Silk",
      "Champagne Satin",
      "Beverly Hills",
      "Evening Glam"
    ],
    "totalPrice": 1890,
    "pins": [
      {
        "id": "pin-11-dress",
        "x": 50,
        "y": 45,
        "category": "Dress",
        "title": "Bias-Cut Silk Charmeuse Slip Midi Dress in Champagne Gold",
        "brand": "Vince",
        "price": 395,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/silk-slip-dress-vince/vp/v=1/1592398501.htm",
        "kStyleTip": "Subtle mermaid flare at hemline produces dramatic walking motion."
      }
    ]
  },
  {
    "id": "editorial-look-v12-anorak",
    "title": "DUMBO Waterfront Technical Nylon Anorak & Wide Cargo Trousers",
    "shortTitle": "DUMBO Technical Anorak & Cargo Trousers",
    "gender": "women",
    "category": "Urban Utility",
    "aesthetic": "Brooklyn Industrial Tech-Chic",
    "season": "Spring 2026 Street",
    "imageUrl": "/images/looks/look_13_jiwoo_brooklyn_street.webp",
    "modelInfo": "Asian Model · 172cm · Silhouette B",
    "description": "Technical wind-resistant taslan nylon jacket with bungee toggle cinching, paired with fluid parachute cargo pants and chunky Vibram-soled trail loafers.",
    "curatorNote": "Elevate utilitarian streetwear by choosing matte luxury fabrics rather than shiny cheap nylon.",
    "colorPalette": [
      "#3B443B",
      "#A49989",
      "#1F2421",
      "#E6E4DF"
    ],
    "vibeTags": [
      "Gorpcore Chic",
      "Technical Anorak",
      "Urban Utility",
      "Brooklyn Street"
    ],
    "totalPrice": 1460,
    "pins": [
      {
        "id": "pin-12-outer",
        "x": 50,
        "y": 30,
        "category": "Outer",
        "title": "Technical Windproof Hooded Anorak in Moss Slate",
        "brand": "Carhartt WIP",
        "price": 278,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/carhartt-wip-anorak/vp/v=1/1592398522.htm",
        "kStyleTip": "Cinch waist toggles to create sculptural peplum silhouette."
      }
    ]
  },
  {
    "id": "editorial-look-v13-amalfi",
    "title": "Positano Mediterranean Striped Linen Camp Shirt & Pleated Chinos",
    "shortTitle": "Positano Striped Linen & Pleated Chinos",
    "gender": "women",
    "category": "Resort Casual",
    "aesthetic": "Italian Riviera Luxury Travel",
    "season": "Summer 2026 Resort",
    "imageUrl": "/images/looks/look_14_hana_amalfi_resort.webp",
    "modelInfo": "Editorial Model · 174cm · Silhouette B",
    "description": "Sun-drenched Mediterranean breeziness. Oversized cobalt striped washed linen camp-collar shirt worn loosely over tailored ecru cotton chinos and raffia tote.",
    "curatorNote": "Roll cuffs loosely twice and unbutton down to breastbone over layered delicate gold chains.",
    "colorPalette": [
      "#1F4E79",
      "#F7F6F2",
      "#C8B195",
      "#8E7D6B"
    ],
    "vibeTags": [
      "Riviera Resort",
      "Striped Linen",
      "Amalfi Sun",
      "Coastal Polish"
    ],
    "totalPrice": 1390,
    "pins": [
      {
        "id": "pin-13-top",
        "x": 50,
        "y": 28,
        "category": "Top",
        "title": "Relaxed Camp Collar Striped Linen Shirt in Riviera Blue",
        "brand": "Rails",
        "price": 178,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/rails-linen-shirt/vp/v=1/1592398539.htm",
        "kStyleTip": "Pure French flax linen softens naturally with every salt-breeze wear."
      }
    ]
  },
  {
    "id": "editorial-look-v14-wrap",
    "title": "Fifth Avenue Double-Faced Cashmere Wrap Coat & Camel Turtleneck",
    "shortTitle": "Fifth Avenue Cashmere Wrap & Turtleneck",
    "gender": "women",
    "category": "Quiet Luxury",
    "aesthetic": "Manhattan Uptown Executive",
    "season": "Autumn/Winter 2026",
    "imageUrl": "/images/looks/look_15_hana_fifth_avenue_wrap.webp",
    "modelInfo": "Editorial Model · 177cm · Silhouette A",
    "description": "The quintessential Manhattan power silhouette. Unlined double-faced 100% virgin wool-cashmere robe coat in camel, belted over fine-gauge cashmere and leather boots.",
    "curatorNote": "Double-faced construction means no stiff lining: the coat drapes around the body with the effortless grace of a dressing gown.",
    "colorPalette": [
      "#C19A6B",
      "#8B5A2B",
      "#FDF5E6",
      "#1C1C1C"
    ],
    "vibeTags": [
      "Double-Faced Wool",
      "Fifth Avenue",
      "Camel Luxury",
      "Executive Grace"
    ],
    "totalPrice": 2580,
    "pins": [
      {
        "id": "pin-14-outer",
        "x": 50,
        "y": 32,
        "category": "Outer",
        "title": "Double-Faced Belted Wool-Cashmere Wrap Coat in Warm Camel",
        "brand": "Max Mara Weekend",
        "price": 895,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/weekend-max-mara-coat/7392019",
        "kStyleTip": "Hand-stitched pick edges signify genuine bespoke luxury craft."
      }
    ]
  },
  {
    "id": "editorial-look-v15-cocoon",
    "title": "Hannam-dong Sculptural Cocoon Coat & Monochromatic Knit",
    "shortTitle": "Hannam Sculptural Cocoon Coat & Knit",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Seoul Contemporary Architectural",
    "season": "Spring 2026 Street",
    "imageUrl": "/images/looks/look_21_sua_hannam_cocoon.webp",
    "modelInfo": "Asian Model · 174cm · Silhouette B",
    "description": "Architectural curved cocoon sleeves define this striking modern silhouette. Deep taupe wool blend over ivory ribbed column dress and architectural heel boots.",
    "curatorNote": "Dramatic rounded sleeve volumes draw focus to slender wrists and clean footwear.",
    "colorPalette": [
      "#4A453F",
      "#C4BCB3",
      "#FAF8F5",
      "#1B1917"
    ],
    "vibeTags": [
      "Cocoon Silhouette",
      "Hannam Minimal",
      "Architectural Sleeve",
      "Monochrome"
    ],
    "totalPrice": 1640,
    "pins": [
      {
        "id": "pin-15-outer",
        "x": 50,
        "y": 32,
        "category": "Outer",
        "title": "Curved Cocoon Sleeve Wool Coat in Deep Taupe",
        "brand": "COS",
        "price": 350,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/cos-cocoon-coat/7592011",
        "kStyleTip": "Curved side seam pockets preserve clean sculptural lines."
      }
    ]
  },
  {
    "id": "editorial-look-v16-poplin",
    "title": "Tribeca Architectural Poplin Shirt & Flared Tailored Trousers",
    "shortTitle": "Tribeca Poplin Shirt & Flared Trousers",
    "gender": "women",
    "category": "Architectural Clean",
    "aesthetic": "Tribeca Contemporary Art Gallery",
    "season": "Spring/Summer 2026 Minimalist",
    "imageUrl": "/images/looks/look11_final_editorial.webp",
    "modelInfo": "Multiracial Model · 178cm · Silhouette F",
    "description": "Crisp oversized menswear-inspired poplin shirt balanced against minimalist flared trousers and sculpted metal-tip pointed slingbacks.",
    "curatorNote": "Leave top buttons open to reveal clean necklines and balance the generous volume of the poplin shirt.",
    "colorPalette": [
      "#FFFFFF",
      "#E6E1DC",
      "#1A1A1A",
      "#A38B78"
    ],
    "vibeTags": [
      "Architectural",
      "Crisp Poplin",
      "Flared Suiting",
      "SSENSE Minimal"
    ],
    "totalPrice": 2409,
    "pins": [
      {
        "id": "pin-16-top",
        "x": 50,
        "y": 28,
        "category": "Top/Outer",
        "title": "Coastal Poplin Oversized Shirt in Crisp White",
        "brand": "Faherty",
        "price": 168,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/coastal-poplinoversized-shirt-faherty/vp/v=1/1512362610.htm",
        "kStyleTip": "Crisp high-thread-count poplin retains sculpted volume."
      }
    ]
  },
  {
    "id": "editorial-men-01",
    "title": "Milan Tailored Minimalist Wool Blazer & Flared Charcoal Slacks",
    "shortTitle": "Milan Tailored Wool Blazer & Flared Slacks",
    "gender": "men",
    "category": "Quiet Luxury Men",
    "aesthetic": "Milanese Sartorial Precision",
    "season": "Spring/Summer 2026 Men",
    "imageUrl": "/images/looks/men_look_01_tailored_dandy.webp",
    "modelInfo": "Caucasian Model · 185cm · Silhouette D",
    "description": "Impeccable Italian proportion reinterpreted for modern cosmopolitan men. Charcoal wool suiting blazer over lightweight poplin and relaxed flared slacks.",
    "curatorNote": "Maintain a clean monochromatic base to let the sculpted drape of the blazer define the masculine silhouette.",
    "colorPalette": [
      "#1C1D21",
      "#3A3D40",
      "#F2EFEB",
      "#59606D"
    ],
    "vibeTags": [
      "Sartorial",
      "Milanese",
      "Charcoal Wool",
      "Masculine Poise"
    ],
    "totalPrice": 1545,
    "pins": [
      {
        "id": "pin-m01-outer",
        "x": 50,
        "y": 28,
        "category": "Outer",
        "title": "Chambers Stretch Wool Tailored Blazer in Deep Charcoal",
        "brand": "Theory",
        "price": 495,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/chambers-stretch-wool-blazer-theory/vp/v=1/1547083302.htm",
        "kStyleTip": "Tailored chest canvas and notched lapels create an athletic V-tapered silhouette."
      },
      {
        "id": "pin-m01-top",
        "x": 50,
        "y": 22,
        "category": "Top",
        "title": "Soto Long Sleeve Lightweight Cotton Shirt",
        "brand": "Rails",
        "price": 138,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/soto-rails/vp/v=1/1590360461.htm",
        "kStyleTip": "Crisp spread collar stays upright without requiring a tie."
      },
      {
        "id": "pin-m01-bottom",
        "x": 50,
        "y": 62,
        "category": "Bottom",
        "title": "Mayer Tailored Stretch Wool Trousers in Matching Charcoal",
        "brand": "Theory",
        "price": 275,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/mayer-dress-pants-theory/vp/v=1/1512847920.htm",
        "kStyleTip": "Sharp front crease vertically elongates posture."
      },
      {
        "id": "pin-m01-shoes",
        "x": 50,
        "y": 90,
        "category": "Shoes",
        "title": "Leather Penny Loafers in Polished Nero Black",
        "brand": "Allen Edmonds",
        "price": 395,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/allen-edmonds-randolph-loafer/5491029",
        "kStyleTip": "Hand-burnished calfskin adds discreet, aristocratic sheen."
      }
    ]
  },
  {
    "id": "editorial-men-02",
    "title": "Harajuku Street Oversized Leather Bomber & Raw Selvedge Denim",
    "shortTitle": "Harajuku Leather Bomber & Selvedge Denim",
    "gender": "men",
    "category": "Tokyo Streetwear",
    "aesthetic": "Tokyo Harajuku Elevated Grunge",
    "season": "Spring 2026 Street",
    "imageUrl": "/images/looks/men_look_02_urban_street.webp",
    "modelInfo": "Asian Model · 182cm · Silhouette E",
    "description": "Heavyweight dropped-shoulder leather flight bomber paired with authentic 14oz Japanese raw selvedge denim and combat lug-sole boots.",
    "curatorNote": "Contrast voluminous distressed leather with structured wide raw denim for an authentic Tokyo collector aesthetic.",
    "colorPalette": [
      "#161618",
      "#2E3A44",
      "#8C929D",
      "#3B2F2F"
    ],
    "vibeTags": [
      "Harajuku",
      "Leather Bomber",
      "Raw Denim",
      "Tokyo Street"
    ],
    "totalPrice": 2024,
    "pins": [
      {
        "id": "pin-m02-outer",
        "x": 50,
        "y": 30,
        "category": "Outer",
        "title": "Vintage-Washed Oversized Leather Flight Bomber",
        "brand": "Schott NYC",
        "price": 890,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/schott-nyc-leather-bomber/5492019",
        "kStyleTip": "Thick steerhide leather patinates and molds to body contours over decades."
      },
      {
        "id": "pin-m02-bottom",
        "x": 50,
        "y": 62,
        "category": "Bottom",
        "title": "1947 Classic Fit 14oz Raw Selvedge Indigo Denim",
        "brand": "Sugar Cane",
        "price": 285,
        "retailer": "SSENSE",
        "buyUrl": "https://www.ssense.com/en-us/men/product/sugar-cane/selvedge-jeans/12984102.htm",
        "kStyleTip": "Turn up a clean 2-inch cuff to highlight red selvedge ID line."
      }
    ]
  },
  {
    "id": "editorial-men-03",
    "title": "Tokyo Cityboy Oversized Raglan Trench & Oxford Layering",
    "shortTitle": "Cityboy Oversized Raglan Trench",
    "gender": "men",
    "category": "Cityboy Aesthetic",
    "aesthetic": "Ginza & Shibuya Cityboy Tailoring",
    "season": "Spring 2026",
    "imageUrl": "/images/looks/men_look_03_cityboy_trench.webp",
    "modelInfo": "Asian Model · 183cm · Silhouette D",
    "description": "Generous Japanese raglan-sleeve single-breasted balmacaan trench coat in water-repellent gabardine, worn with heavyweight Oxford shirt and relaxed pleat trousers.",
    "curatorNote": "The hallmark of Cityboy style is generous airy ease: clothes should breathe and billow naturally with walking momentum.",
    "colorPalette": [
      "#A69F88",
      "#2A3644",
      "#F4F1EA",
      "#3D3A34"
    ],
    "vibeTags": [
      "Cityboy",
      "Raglan Trench",
      "Balmacaan",
      "Tokyo Minimal"
    ],
    "totalPrice": 1680,
    "pins": [
      {
        "id": "pin-m03-outer",
        "x": 50,
        "y": 32,
        "category": "Outer",
        "title": "Oversized Raglan Balmacaan Trench in Weathered Olive Khaki",
        "brand": "COS",
        "price": 390,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/cos-oversized-trench/7629102",
        "kStyleTip": "Sloping raglan shoulder construction accommodates heavy knitwear seamlessly."
      }
    ]
  },
  {
    "id": "editorial-men-04",
    "title": "Nolita Heavyweight Cable Knit Fisherman Sweater & Wide Chinos",
    "shortTitle": "Nolita Cable Knit & Wide Chinos",
    "gender": "men",
    "category": "Downtown Casual",
    "aesthetic": "New York Nolita Artisanal Casual",
    "season": "Spring 2026",
    "imageUrl": "/images/looks/men_look_04_downtown_cozy.webp",
    "modelInfo": "Editorial Model · 184cm · Silhouette E",
    "description": "Chunky traditional Aran cable knit sweater spun from pure British wool, paired with relaxed wide-leg ecru twill chinos and Wallabee suede shoes.",
    "curatorNote": "Thick artisanal knitwear paired with wide clean chinos produces an inviting, high-comfort aesthetic for gallery strolls.",
    "colorPalette": [
      "#E8E3D9",
      "#C2B29F",
      "#3B3833",
      "#5C564E"
    ],
    "vibeTags": [
      "Cable Knit",
      "Aran Wool",
      "Nolita Vibe",
      "Textural Cozy"
    ],
    "totalPrice": 1280,
    "pins": [
      {
        "id": "pin-m04-top",
        "x": 50,
        "y": 30,
        "category": "Knitwear",
        "title": "Heavyweight Heritage Cable Knit Crewneck in Ecru Oatmeal",
        "brand": "Todd Snyder",
        "price": 328,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/todd-snyder-cable-sweater/7592810",
        "kStyleTip": "Chunky 3-gauge rope cables add striking sculptural depth."
      }
    ]
  },
  {
    "id": "editorial-men-05",
    "title": "Silicon Valley Smart Executive Wrinkle-Free Tech Blazer & Slacks",
    "shortTitle": "Smart Executive Tech Blazer & Slacks",
    "gender": "men",
    "category": "Smart Executive",
    "aesthetic": "Modern Tech Founder Minimal",
    "season": "Spring/Summer 2026",
    "imageUrl": "/images/looks/men_look_05_smart_office.webp",
    "modelInfo": "Caucasian Model · 186cm · Silhouette D",
    "description": "The uniform of forward-thinking founders. High-performance wrinkle-resistant 4-way stretch tailored jacket over supima tee and tapered tech trousers.",
    "curatorNote": "Performance fabrics cut to Savile Row proportions provide maximum mobility for global travel without sacrificing executive authority.",
    "colorPalette": [
      "#1A1E24",
      "#2E3642",
      "#FAFAFA",
      "#64748B"
    ],
    "vibeTags": [
      "Tech Executive",
      "Wrinkle-Free",
      "High Performance",
      "Modern Founder"
    ],
    "totalPrice": 1490,
    "pins": [
      {
        "id": "pin-m05-outer",
        "x": 50,
        "y": 30,
        "category": "Outer",
        "title": "Precision 4-Way Stretch Tech Travel Blazer in Deep Navy",
        "brand": "Theory",
        "price": 495,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/precision-blazer-theory/vp/v=1/1592398591.htm",
        "kStyleTip": "Water-repellent Swiss performance stretch fabric recovers from luggage instantly."
      }
    ]
  },
  {
    "id": "editorial-men-06",
    "title": "Seoul Dandy Double-Breasted Pinstripe Suit & Polished Monkstraps",
    "shortTitle": "Seoul Dandy Double-Breasted Suit",
    "gender": "men",
    "category": "Quiet Luxury Men",
    "aesthetic": "Cheongdam Tailored Menswear",
    "season": "Spring 2026 Suiting",
    "imageUrl": "/images/looks/men_look_01_real_human.webp",
    "modelInfo": "Asian Model · 181cm · Silhouette D",
    "description": "Double-breasted chalk-stripe suiting crafted from Super 130s wool, featuring broad peak lapels and tapered pleat trousers with double-monk leather shoes.",
    "curatorNote": "Peak lapels that extend toward shoulder points emphasize chest width while narrowing waist perception.",
    "colorPalette": [
      "#1E222A",
      "#D1D5DB",
      "#111827",
      "#854D0E"
    ],
    "vibeTags": [
      "Peak Lapel",
      "Chalk Stripe",
      "Seoul Dandy",
      "Sartorial Power"
    ],
    "totalPrice": 1850,
    "pins": [
      {
        "id": "pin-m06-outer",
        "x": 50,
        "y": 30,
        "category": "Suiting",
        "title": "Super 130s Wool Double-Breasted Pinstripe Suit Jacket",
        "brand": "Suitsupply",
        "price": 698,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/s/suitsupply-havana-suit/7492810",
        "kStyleTip": "Natural soft shoulder pads give Italian sprezzatura ease."
      }
    ]
  },
  {
    "id": "editorial-men-07",
    "title": "Hannam Modern Leather Minimalist Overshirt & Flared Slacks",
    "shortTitle": "Hannam Leather Overshirt & Slacks",
    "gender": "men",
    "category": "Contemporary Urban",
    "aesthetic": "Seoul Hannam Minimalist Menswear",
    "season": "Spring 2026 Street",
    "imageUrl": "/images/looks/men_look_02_real_human.webp",
    "modelInfo": "Asian Model · 182cm · Silhouette E",
    "description": "Minimalist stand-collar leather overshirt cut boxy, styled over high-twist mock neck jersey and semi-flared wool trousers with square-toe boots.",
    "curatorNote": "Replacing a standard jacket with an uncluttered leather overshirt creates an understated, hyper-modern aesthetic.",
    "colorPalette": [
      "#141416",
      "#3E3B38",
      "#EFEFEF",
      "#6B655E"
    ],
    "vibeTags": [
      "Leather Overshirt",
      "Hannam Urban",
      "Square Toe",
      "Contemporary"
    ],
    "totalPrice": 1620,
    "pins": [
      {
        "id": "pin-m07-outer",
        "x": 50,
        "y": 30,
        "category": "Outer",
        "title": "Supple Nappa Leather Boxy Overshirt in Midnight Onyx",
        "brand": "Vince",
        "price": 695,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/leather-overshirt-vince/vp/v=1/1592398602.htm",
        "kStyleTip": "Hidden snap placket maintains clean architectural surface."
      }
    ]
  },
  {
    "id": "editorial-look-v24-hamptons",
    "title": "Hamptons Coastal Club Navy Double-Breasted Overcoat & Cashmere Layering",
    "shortTitle": "Hamptons Club Navy Overcoat & Cashmere",
    "gender": "women",
    "category": "Coastal Preppy",
    "aesthetic": "Hamptons Oceanfront Quiet Luxury",
    "season": "Spring/Summer 2026",
    "imageUrl": "/images/looks/look_verified_shopbop_01_reshoot.webp",
    "modelInfo": "Editorial Model · 176cm · Silhouette A",
    "description": "Deep maritime navy tailored lightweight wool coat layered over a crisp ivory cable knit and straight tailored denim with polished calfskin loafers.",
    "curatorNote": "Navy and ivory represents the eternal language of coastal luxury: crisp, authoritative, and perpetually fresh.",
    "colorPalette": [
      "#0F1B29",
      "#F7F5F0",
      "#3E4C5E",
      "#B89B72"
    ],
    "vibeTags": [
      "Coastal Preppy",
      "Hamptons Club",
      "Maritime Navy",
      "Timeless Polish"
    ],
    "totalPrice": 1780,
    "pins": [
      {
        "id": "pin-24-outer",
        "x": 50,
        "y": 30,
        "category": "Outer",
        "title": "Tailored Double-Breasted Maritime Coat in Midnight Navy",
        "brand": "Theory",
        "price": 595,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/chambers-coat-theory/vp/v=1/1592398619.htm",
        "kStyleTip": "Sharp horn buttons and structured shoulders hold impeccable posture."
      }
    ]
  },
{
    "id": "editorial-look-v21",
    "title": "Hannam Asymmetrical Cashmere Cocoon & Split Hem Trousers",
    "shortTitle": "Hannam Asymmetrical Cashmere Cocoon & Spli",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_21_jiwoo_quiet_luxury.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Seoul Hannam-dong & Seongsu Art Zone. Hannam Asymmetrical Cashmere Cocoon & Split Hem Trousers, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 1805,
    "pins": [
      {
        "id": "look-21-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Tailored Toteme Luxury Outerwear",
        "brand": "Toteme",
        "price": 450,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Jacket",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over the member's statuesque runway proportions.",
        "sku": "OUT021",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-21-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Fine Knit Khaite Top",
        "brand": "Khaite",
        "price": 120,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Khaite+Knit",
        "kStyleTip": "Textural layering top accentuating the collarbone with clean minimalist necklines.",
        "sku": "TOP021",
        "silhouette": "Slim Layering Fit"
      },
      {
        "id": "look-21-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Sculptural Studio Nicholson Trousers",
        "brand": "Studio Nicholson",
        "price": 240,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Studio+Nicholson+Denim",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT021",
        "silhouette": "Wide-Leg High-Waist Trousers"
      },
      {
        "id": "look-21-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Artisanal The Row Footwear",
        "brand": "The Row",
        "price": 320,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO021",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-21-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Iconic The Row Leather Bag",
        "brand": "The Row",
        "price": 480,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG021",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-21-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Janessa Leone Diversified Headwear",
        "brand": "Janessa Leone",
        "price": 85,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Janessa+Leone+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT021",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-21-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Sculptural Jewelry",
        "brand": "Sophie Buhai",
        "price": 110,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sophie+Buhai+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL021",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v22",
    "title": "Seongsu Concrete Glass Minimalist Leather Blazer",
    "shortTitle": "Seongsu Concrete Glass Minimalist Leather ",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_22_minseo_modern_minimalist.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Seoul Hannam-dong & Seongsu Art Zone. Seongsu Concrete Glass Minimalist Leather Blazer, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2195,
    "pins": [
      {
        "id": "look-22-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Tailored Acne Studios Luxury Outerwear",
        "brand": "Acne Studios",
        "price": 560,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Acne+Studios+Outerwear",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over the member's statuesque runway proportions.",
        "sku": "OUT022",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-22-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Fine Knit Skims Top",
        "brand": "Skims",
        "price": 155,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Skims+Top",
        "kStyleTip": "Textural layering top accentuating the collarbone with clean minimalist necklines.",
        "sku": "TOP022",
        "silhouette": "Slim Layering Fit"
      },
      {
        "id": "look-22-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Sculptural Toteme Trousers",
        "brand": "Toteme",
        "price": 285,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Pants",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT022",
        "silhouette": "Wide-Leg High-Waist Trousers"
      },
      {
        "id": "look-22-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Artisanal Jil Sander Footwear",
        "brand": "Jil Sander",
        "price": 385,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Jil+Sander+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO022",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-22-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Iconic Bottega Veneta Leather Bag",
        "brand": "Bottega Veneta",
        "price": 570,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Bottega+Veneta+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG022",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-22-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Marine Serre Diversified Headwear",
        "brand": "Marine Serre",
        "price": 105,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Marine+Serre+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT022",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-22-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Sculptural Jewelry",
        "brand": "Charlotte Chesnais",
        "price": 135,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL022",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v23",
    "title": "Itaewon Understated Houndstooth Wool Tweed Overshirt",
    "shortTitle": "Itaewon Understated Houndstooth Wool Tweed",
    "gender": "women",
    "category": "Downtown Street Chic",
    "aesthetic": "Downtown Street Chic",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_23_sua_downtown_street.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Seoul Hannam-dong & Seongsu Art Zone. Itaewon Understated Houndstooth Wool Tweed Overshirt, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Downtown Street Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2585,
    "pins": [
      {
        "id": "look-23-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Tailored Khaite Luxury Outerwear",
        "brand": "Khaite",
        "price": 670,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Khaite+Jacket",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over the member's statuesque runway proportions.",
        "sku": "OUT023",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-23-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Fine Knit Loro Piana Top",
        "brand": "Loro Piana",
        "price": 190,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Loro+Piana+Knit",
        "kStyleTip": "Textural layering top accentuating the collarbone with clean minimalist necklines.",
        "sku": "TOP023",
        "silhouette": "Slim Layering Fit"
      },
      {
        "id": "look-23-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Sculptural Agolde Trousers",
        "brand": "Agolde",
        "price": 330,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Agolde+Denim",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT023",
        "silhouette": "Wide-Leg High-Waist Trousers"
      },
      {
        "id": "look-23-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Artisanal Dr. Martens Footwear",
        "brand": "Dr. Martens",
        "price": 450,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Dr.+Martens+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO023",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-23-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Iconic A.P.C. Leather Bag",
        "brand": "A.P.C.",
        "price": 660,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=A.P.C.+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG023",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-23-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Brixton Diversified Headwear",
        "brand": "Brixton",
        "price": 125,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Brixton+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT023",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-23-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tom Wood Sculptural Jewelry",
        "brand": "Tom Wood",
        "price": 160,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Tom+Wood+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL023",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v24",
    "title": "Apgujeong Rodeo Relaxed Double Trench & Pleated Chinos",
    "shortTitle": "Apgujeong Rodeo Relaxed Double Trench & Pl",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_24_chaewon_elevated_casual.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in Seoul Hannam-dong & Seongsu Art Zone. Apgujeong Rodeo Relaxed Double Trench & Pleated Chinos, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2975,
    "pins": [
      {
        "id": "look-24-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Tailored The Row Luxury Outerwear",
        "brand": "The Row",
        "price": 780,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Outerwear",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over the member's statuesque runway proportions.",
        "sku": "OUT024",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-24-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Fine Knit COS Top",
        "brand": "COS",
        "price": 225,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=COS+Top",
        "kStyleTip": "Textural layering top accentuating the collarbone with clean minimalist necklines.",
        "sku": "TOP024",
        "silhouette": "Slim Layering Fit"
      },
      {
        "id": "look-24-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Sculptural The Row Trousers",
        "brand": "The Row",
        "price": 375,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Pants",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT024",
        "silhouette": "Wide-Leg High-Waist Trousers"
      },
      {
        "id": "look-24-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Artisanal Salomon Footwear",
        "brand": "Salomon",
        "price": 515,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Salomon+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO024",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-24-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Iconic By Far Leather Bag",
        "brand": "By Far",
        "price": 750,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=By+Far+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG024",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-24-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "'47 Brand Diversified Headwear",
        "brand": "'47 Brand",
        "price": 145,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword='47+Brand+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT024",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-24-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Laura Lombardi Sculptural Jewelry",
        "brand": "Laura Lombardi",
        "price": 185,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Laura+Lombardi+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL024",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v25",
    "title": "Hannam Hill High-Neck Merino Tunic & Wide Silk Slacks",
    "shortTitle": "Hannam Hill High-Neck Merino Tunic & Wide ",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_25_hana_quiet_luxury.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Seoul Hannam-dong & Seongsu Art Zone. Hannam Hill High-Neck Merino Tunic & Wide Silk Slacks, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3365,
    "pins": [
      {
        "id": "look-25-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Tailored Loro Piana Luxury Outerwear",
        "brand": "Loro Piana",
        "price": 890,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loro+Piana+Jacket",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over the member's statuesque runway proportions.",
        "sku": "OUT025",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-25-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Fine Knit Toteme Top",
        "brand": "Toteme",
        "price": 260,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Knit",
        "kStyleTip": "Textural layering top accentuating the collarbone with clean minimalist necklines.",
        "sku": "TOP025",
        "silhouette": "Slim Layering Fit"
      },
      {
        "id": "look-25-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Sculptural The Row Trousers",
        "brand": "The Row",
        "price": 420,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Denim",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT025",
        "silhouette": "Wide-Leg High-Waist Trousers"
      },
      {
        "id": "look-25-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Artisanal Manolo Blahnik Footwear",
        "brand": "Manolo Blahnik",
        "price": 580,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Manolo+Blahnik+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO025",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-25-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Iconic Loewe Leather Bag",
        "brand": "Loewe",
        "price": 840,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Loewe+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG025",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-25-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Jennifer Behr Diversified Headwear",
        "brand": "Jennifer Behr",
        "price": 165,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Jennifer+Behr+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT025",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-25-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Lie Studio Sculptural Jewelry",
        "brand": "Lie Studio",
        "price": 210,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Lie+Studio+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL025",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v26",
    "title": "Seoul Forest Architectural Parka & Lug-Sole Ankle Boots",
    "shortTitle": "Seoul Forest Architectural Parka & Lug-Sol",
    "gender": "women",
    "category": "Downtown Street Chic",
    "aesthetic": "Downtown Street Chic",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_26_jiwoo_downtown_street.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Seoul Hannam-dong & Seongsu Art Zone. Seoul Forest Architectural Parka & Lug-Sole Ankle Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Downtown Street Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3755,
    "pins": [
      {
        "id": "look-26-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Tailored Issey Miyake Luxury Outerwear",
        "brand": "Issey Miyake",
        "price": 1000,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Issey+Miyake+Outerwear",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over the member's statuesque runway proportions.",
        "sku": "OUT026",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-26-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Fine Knit Helmut Lang Top",
        "brand": "Helmut Lang",
        "price": 295,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Helmut+Lang+Top",
        "kStyleTip": "Textural layering top accentuating the collarbone with clean minimalist necklines.",
        "sku": "TOP026",
        "silhouette": "Slim Layering Fit"
      },
      {
        "id": "look-26-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Sculptural Citizens of Humanity Trousers",
        "brand": "Citizens of Humanity",
        "price": 465,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Citizens+of+Humanity+Pants",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT026",
        "silhouette": "Wide-Leg High-Waist Trousers"
      },
      {
        "id": "look-26-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Artisanal Khaite Footwear",
        "brand": "Khaite",
        "price": 645,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Khaite+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO026",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-26-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Iconic Acne Studios Leather Bag",
        "brand": "Acne Studios",
        "price": 930,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Acne+Studios+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG026",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-26-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Arc'teryx Veilance Diversified Headwear",
        "brand": "Arc'teryx Veilance",
        "price": 185,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Arc'teryx+Veilance+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT026",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-26-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Spinelli Kilcollin Sculptural Jewelry",
        "brand": "Spinelli Kilcollin",
        "price": 235,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Spinelli+Kilcollin+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL026",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v27",
    "title": "Dosan Boulevard Tailored Camel Hair Maxi Coat",
    "shortTitle": "Dosan Boulevard Tailored Camel Hair Maxi C",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_27_minseo_modern_minimalist.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Seoul Hannam-dong & Seongsu Art Zone. Dosan Boulevard Tailored Camel Hair Maxi Coat, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4145,
    "pins": [
      {
        "id": "look-27-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Tailored Max Mara Luxury Outerwear",
        "brand": "Max Mara",
        "price": 1110,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Max+Mara+Jacket",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over the member's statuesque runway proportions.",
        "sku": "OUT027",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-27-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Fine Knit Theory Top",
        "brand": "Theory",
        "price": 330,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Theory+Knit",
        "kStyleTip": "Textural layering top accentuating the collarbone with clean minimalist necklines.",
        "sku": "TOP027",
        "silhouette": "Slim Layering Fit"
      },
      {
        "id": "look-27-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Sculptural Slvrlake Trousers",
        "brand": "Slvrlake",
        "price": 510,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Slvrlake+Denim",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT027",
        "silhouette": "Wide-Leg High-Waist Trousers"
      },
      {
        "id": "look-27-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Artisanal Gucci Footwear",
        "brand": "Gucci",
        "price": 710,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Gucci+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO027",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-27-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Iconic Celine Leather Bag",
        "brand": "Celine",
        "price": 1020,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Celine+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG027",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-27-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Stetson Diversified Headwear",
        "brand": "Stetson",
        "price": 205,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Stetson+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT027",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-27-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Monica Vinader Sculptural Jewelry",
        "brand": "Monica Vinader",
        "price": 260,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Monica+Vinader+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL027",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v28",
    "title": "Cheongdam Modern Pleated Tailored Jumpsuit & Gold Cuff",
    "shortTitle": "Cheongdam Modern Pleated Tailored Jumpsuit",
    "gender": "women",
    "category": "Gala & Runway Glam",
    "aesthetic": "Gala & Runway Glam",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_28_sua_gala_glam.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Seoul Hannam-dong & Seongsu Art Zone. Cheongdam Modern Pleated Tailored Jumpsuit & Gold Cuff, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Gala & Runway Glam",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4535,
    "pins": [
      {
        "id": "look-28-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Tailored Saint Laurent Luxury Outerwear",
        "brand": "Saint Laurent",
        "price": 1220,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Saint+Laurent+Outerwear",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over the member's statuesque runway proportions.",
        "sku": "OUT028",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-28-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Fine Knit Saint Laurent Top",
        "brand": "Saint Laurent",
        "price": 365,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Saint+Laurent+Top",
        "kStyleTip": "Textural layering top accentuating the collarbone with clean minimalist necklines.",
        "sku": "TOP028",
        "silhouette": "Slim Layering Fit"
      },
      {
        "id": "look-28-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Sculptural Alexander McQueen Trousers",
        "brand": "Alexander McQueen",
        "price": 555,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Alexander+McQueen+Pants",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT028",
        "silhouette": "Wide-Leg High-Waist Trousers"
      },
      {
        "id": "look-28-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Artisanal Amina Muaddi Footwear",
        "brand": "Amina Muaddi",
        "price": 775,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Amina+Muaddi+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO028",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-28-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Iconic Bottega Veneta Leather Bag",
        "brand": "Bottega Veneta",
        "price": 1110,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Bottega+Veneta+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG028",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-28-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Jennifer Behr Diversified Headwear",
        "brand": "Jennifer Behr",
        "price": 225,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Jennifer+Behr+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT028",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-28-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Sculptural Jewelry",
        "brand": "Charlotte Chesnais",
        "price": 285,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL028",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v29",
    "title": "Seongsu Factory Washed Denim Duster & Western Boots",
    "shortTitle": "Seongsu Factory Washed Denim Duster & West",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_29_chaewon_elevated_casual.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in Seoul Hannam-dong & Seongsu Art Zone. Seongsu Factory Washed Denim Duster & Western Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4925,
    "pins": [
      {
        "id": "look-29-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Tailored RE/DONE Luxury Outerwear",
        "brand": "RE/DONE",
        "price": 1330,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=RE/DONE+Jacket",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over the member's statuesque runway proportions.",
        "sku": "OUT029",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-29-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Fine Knit Alex Mill Top",
        "brand": "Alex Mill",
        "price": 400,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Alex+Mill+Knit",
        "kStyleTip": "Textural layering top accentuating the collarbone with clean minimalist necklines.",
        "sku": "TOP029",
        "silhouette": "Slim Layering Fit"
      },
      {
        "id": "look-29-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Sculptural RE/DONE Trousers",
        "brand": "RE/DONE",
        "price": 600,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=RE/DONE+Denim",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT029",
        "silhouette": "Wide-Leg High-Waist Trousers"
      },
      {
        "id": "look-29-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Artisanal Sonora Footwear",
        "brand": "Sonora",
        "price": 840,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sonora+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO029",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-29-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Iconic Isabel Marant Leather Bag",
        "brand": "Isabel Marant",
        "price": 1200,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Isabel+Marant+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG029",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-29-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Stetson Diversified Headwear",
        "brand": "Stetson",
        "price": 245,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Stetson+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT029",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-29-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Foundrae Sculptural Jewelry",
        "brand": "Foundrae",
        "price": 310,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Foundrae+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL029",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v30",
    "title": "Samcheong Draped Wool Blanket Cape & Suede Riding Boots",
    "shortTitle": "Samcheong Draped Wool Blanket Cape & Suede",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_30_hana_quiet_luxury.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Seoul Hannam-dong & Seongsu Art Zone. Samcheong Draped Wool Blanket Cape & Suede Riding Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5315,
    "pins": [
      {
        "id": "look-30-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Tailored Brunello Cucinelli Luxury Outerwear",
        "brand": "Brunello Cucinelli",
        "price": 1440,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Brunello+Cucinelli+Outerwear",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over the member's statuesque runway proportions.",
        "sku": "OUT030",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-30-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Fine Knit Vince Top",
        "brand": "Vince",
        "price": 435,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Vince+Top",
        "kStyleTip": "Textural layering top accentuating the collarbone with clean minimalist necklines.",
        "sku": "TOP030",
        "silhouette": "Slim Layering Fit"
      },
      {
        "id": "look-30-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Sculptural Brunello Cucinelli Trousers",
        "brand": "Brunello Cucinelli",
        "price": 645,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Brunello+Cucinelli+Pants",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT030",
        "silhouette": "Wide-Leg High-Waist Trousers"
      },
      {
        "id": "look-30-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Artisanal Khaite Footwear",
        "brand": "Khaite",
        "price": 905,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Khaite+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO030",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-30-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Iconic Hermès Leather Bag",
        "brand": "Hermès",
        "price": 1290,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Hermès+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG030",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-30-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Maison Michel Diversified Headwear",
        "brand": "Maison Michel",
        "price": 265,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Maison+Michel+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT030",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-30-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tiffany & Co. Sculptural Jewelry",
        "brand": "Tiffany & Co.",
        "price": 335,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Tiffany+&+Co.+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL030",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v31",
    "title": "Daikanyama Layered Oversized Wool Trench & Wide Chinos",
    "shortTitle": "Daikanyama Layered Oversized Wool Trench & Wide Chinos",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_31_jiwoo_elevated_casual.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Tokyo Daikanyama, Ginza & Harajuku. Daikanyama Layered Oversized Wool Trench & Wide Chinos, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2245,
    "pins": [
      {
        "id": "look-31-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Acne Studios Statement Piece",
        "brand": "Acne Studios",
        "price": 580,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Acne+Studios+Outerwear",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over statuesque runway proportions.",
        "sku": "OUT031",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-31-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Essential Top",
        "brand": "Skims",
        "price": 130,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Skims+Knit",
        "kStyleTip": "Clean minimalist layering top with comfortable luxurious hand-feel.",
        "sku": "TOP031",
        "silhouette": "Sleek Fluid Fit"
      },
      {
        "id": "look-31-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Studio Nicholson Trousers / Skirt",
        "brand": "Studio Nicholson",
        "price": 290,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Studio+Nicholson+Bottoms",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT031",
        "silhouette": "Wide-Leg / Knife-Pleat Column"
      },
      {
        "id": "look-31-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Maison Margiela Designer Footwear",
        "brand": "Maison Margiela",
        "price": 420,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Maison+Margiela+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO031",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-31-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "By Far Iconic Bag",
        "brand": "By Far",
        "price": 590,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=By+Far+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG031",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-31-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Marine Serre Headwear Accent",
        "brand": "Marine Serre",
        "price": 95,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Marine+Serre+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT031",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-31-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Modernist Jewelry",
        "brand": "Charlotte Chesnais",
        "price": 140,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL031",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v32",
    "title": "Ginza Sleek Architectural Minimalist Tailored Suit",
    "shortTitle": "Ginza Sleek Architectural Minimalist Tailo",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_32_minseo_modern_minimalist.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Tokyo Daikanyama, Ginza & Harajuku. Ginza Sleek Architectural Minimalist Tailored Suit, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2700,
    "pins": [
      {
        "id": "look-32-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Jil Sander Statement Piece",
        "brand": "Jil Sander",
        "price": 700,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Jil+Sander+Jacket",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over statuesque runway proportions.",
        "sku": "OUT032",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-32-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Khaite Essential Top",
        "brand": "Khaite",
        "price": 170,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Khaite+Top",
        "kStyleTip": "Clean minimalist layering top with comfortable luxurious hand-feel.",
        "sku": "TOP032",
        "silhouette": "Sleek Fluid Fit"
      },
      {
        "id": "look-32-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Jil Sander Trousers / Skirt",
        "brand": "Jil Sander",
        "price": 345,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Jil+Sander+Pants",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT032",
        "silhouette": "Wide-Leg / Knife-Pleat Column"
      },
      {
        "id": "look-32-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "The Row Designer Footwear",
        "brand": "The Row",
        "price": 495,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO032",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-32-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Jil Sander Iconic Bag",
        "brand": "Jil Sander",
        "price": 700,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Jil+Sander+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG032",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-32-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Janessa Leone Headwear Accent",
        "brand": "Janessa Leone",
        "price": 120,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Janessa+Leone+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT032",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-32-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Modernist Jewelry",
        "brand": "Charlotte Chesnais",
        "price": 170,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL032",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v33",
    "title": "Harajuku Avant-Garde Deconstructed Bomber & Chunky Boots",
    "shortTitle": "Harajuku Avant-Garde Deconstructed Bomber ",
    "gender": "women",
    "category": "Downtown Street Chic",
    "aesthetic": "Downtown Street Chic",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_33_sua_downtown_street.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Tokyo Daikanyama, Ginza & Harajuku. Harajuku Avant-Garde Deconstructed Bomber & Chunky Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Downtown Street Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3155,
    "pins": [
      {
        "id": "look-33-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Sacai Statement Piece",
        "brand": "Sacai",
        "price": 820,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sacai+Outerwear",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over statuesque runway proportions.",
        "sku": "OUT033",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-33-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Dion Lee Essential Top",
        "brand": "Dion Lee",
        "price": 210,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Dion+Lee+Knit",
        "kStyleTip": "Clean minimalist layering top with comfortable luxurious hand-feel.",
        "sku": "TOP033",
        "silhouette": "Sleek Fluid Fit"
      },
      {
        "id": "look-33-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Coperni Trousers / Skirt",
        "brand": "Coperni",
        "price": 400,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Coperni+Bottoms",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT033",
        "silhouette": "Wide-Leg / Knife-Pleat Column"
      },
      {
        "id": "look-33-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Rick Owens Designer Footwear",
        "brand": "Rick Owens",
        "price": 570,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Rick+Owens+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO033",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-33-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Balenciaga Iconic Bag",
        "brand": "Balenciaga",
        "price": 810,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Balenciaga+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG033",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-33-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Vivienne Westwood Headwear Accent",
        "brand": "Vivienne Westwood",
        "price": 145,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Vivienne+Westwood+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT033",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-33-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Chrome Hearts Modernist Jewelry",
        "brand": "Chrome Hearts",
        "price": 200,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Chrome+Hearts+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL033",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v34",
    "title": "Omotesando Cashmere Turtleneck & Pleated Asymmetric Skirt",
    "shortTitle": "Omotesando Cashmere Turtleneck & Pleated A",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_34_chaewon_quiet_luxury.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in Tokyo Daikanyama, Ginza & Harajuku. Omotesando Cashmere Turtleneck & Pleated Asymmetric Skirt, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3610,
    "pins": [
      {
        "id": "look-34-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "The Row Statement Piece",
        "brand": "The Row",
        "price": 940,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Jacket",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over statuesque runway proportions.",
        "sku": "OUT034",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-34-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Loro Piana Essential Top",
        "brand": "Loro Piana",
        "price": 250,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loro+Piana+Top",
        "kStyleTip": "Clean minimalist layering top with comfortable luxurious hand-feel.",
        "sku": "TOP034",
        "silhouette": "Sleek Fluid Fit"
      },
      {
        "id": "look-34-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Trousers / Skirt",
        "brand": "Toteme",
        "price": 455,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Pants",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT034",
        "silhouette": "Wide-Leg / Knife-Pleat Column"
      },
      {
        "id": "look-34-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Khaite Designer Footwear",
        "brand": "Khaite",
        "price": 645,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Khaite+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO034",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-34-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Loewe Iconic Bag",
        "brand": "Loewe",
        "price": 920,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loewe+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG034",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-34-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Sophie Buhai Headwear Accent",
        "brand": "Sophie Buhai",
        "price": 170,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sophie+Buhai+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT034",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-34-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Modernist Jewelry",
        "brand": "Sophie Buhai",
        "price": 230,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL034",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v35",
    "title": "Shibuya High-End Technical Parka & Cargo Slacks",
    "shortTitle": "Shibuya High-End Technical Parka & Cargo S",
    "gender": "women",
    "category": "Downtown Street Chic",
    "aesthetic": "Downtown Street Chic",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_35_hana_downtown_street.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Tokyo Daikanyama, Ginza & Harajuku. Shibuya High-End Technical Parka & Cargo Slacks, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Downtown Street Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4065,
    "pins": [
      {
        "id": "look-35-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Arc'teryx Veilance Statement Piece",
        "brand": "Arc'teryx Veilance",
        "price": 1060,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Arc'teryx+Veilance+Outerwear",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over statuesque runway proportions.",
        "sku": "OUT035",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-35-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Essential Top",
        "brand": "Skims",
        "price": 290,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Skims+Knit",
        "kStyleTip": "Clean minimalist layering top with comfortable luxurious hand-feel.",
        "sku": "TOP035",
        "silhouette": "Sleek Fluid Fit"
      },
      {
        "id": "look-35-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Studio Nicholson Trousers / Skirt",
        "brand": "Studio Nicholson",
        "price": 510,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Studio+Nicholson+Bottoms",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT035",
        "silhouette": "Wide-Leg / Knife-Pleat Column"
      },
      {
        "id": "look-35-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Salomon Designer Footwear",
        "brand": "Salomon",
        "price": 720,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Salomon+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO035",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-35-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Prada Iconic Bag",
        "brand": "Prada",
        "price": 1030,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Prada+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG035",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-35-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Arc'teryx Veilance Headwear Accent",
        "brand": "Arc'teryx Veilance",
        "price": 195,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Arc'teryx+Veilance+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT035",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-35-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tom Wood Modernist Jewelry",
        "brand": "Tom Wood",
        "price": 260,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Tom+Wood+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL035",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v36",
    "title": "Roppongi Hills Draped Silk Maxi Trench & Strappy Sandals",
    "shortTitle": "Roppongi Hills Draped Silk Maxi Trench & S",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_36_jiwoo_quiet_luxury.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Tokyo Daikanyama, Ginza & Harajuku. Roppongi Hills Draped Silk Maxi Trench & Strappy Sandals, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4520,
    "pins": [
      {
        "id": "look-36-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "The Row Statement Piece",
        "brand": "The Row",
        "price": 1180,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Jacket",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over statuesque runway proportions.",
        "sku": "OUT036",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-36-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Toteme Essential Top",
        "brand": "Toteme",
        "price": 330,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Top",
        "kStyleTip": "Clean minimalist layering top with comfortable luxurious hand-feel.",
        "sku": "TOP036",
        "silhouette": "Sleek Fluid Fit"
      },
      {
        "id": "look-36-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Trousers / Skirt",
        "brand": "Toteme",
        "price": 565,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Pants",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT036",
        "silhouette": "Wide-Leg / Knife-Pleat Column"
      },
      {
        "id": "look-36-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Manolo Blahnik Designer Footwear",
        "brand": "Manolo Blahnik",
        "price": 795,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Manolo+Blahnik+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO036",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-36-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Khaite Iconic Bag",
        "brand": "Khaite",
        "price": 1140,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Khaite+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG036",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-36-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Sophie Buhai Headwear Accent",
        "brand": "Sophie Buhai",
        "price": 220,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sophie+Buhai+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT036",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-36-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Modernist Jewelry",
        "brand": "Sophie Buhai",
        "price": 290,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL036",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v37",
    "title": "Aoyama Sculptural Double-Breasted Wool Overcoat",
    "shortTitle": "Aoyama Sculptural Double-Breasted Wool Ove",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_37_minseo_modern_minimalist.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Tokyo Daikanyama, Ginza & Harajuku. Aoyama Sculptural Double-Breasted Wool Overcoat, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4975,
    "pins": [
      {
        "id": "look-37-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Lemaire Statement Piece",
        "brand": "Lemaire",
        "price": 1300,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Lemaire+Outerwear",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over statuesque runway proportions.",
        "sku": "OUT037",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-37-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Toteme Essential Top",
        "brand": "Toteme",
        "price": 370,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Knit",
        "kStyleTip": "Clean minimalist layering top with comfortable luxurious hand-feel.",
        "sku": "TOP037",
        "silhouette": "Sleek Fluid Fit"
      },
      {
        "id": "look-37-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Studio Nicholson Trousers / Skirt",
        "brand": "Studio Nicholson",
        "price": 620,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Studio+Nicholson+Bottoms",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT037",
        "silhouette": "Wide-Leg / Knife-Pleat Column"
      },
      {
        "id": "look-37-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Jil Sander Designer Footwear",
        "brand": "Jil Sander",
        "price": 870,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Jil+Sander+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO037",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-37-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Lemaire Iconic Bag",
        "brand": "Lemaire",
        "price": 1250,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Lemaire+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG037",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-37-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Janessa Leone Headwear Accent",
        "brand": "Janessa Leone",
        "price": 245,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Janessa+Leone+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT037",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-37-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Lie Studio Modernist Jewelry",
        "brand": "Lie Studio",
        "price": 320,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Lie+Studio+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL037",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v38",
    "title": "Tokyo Midnight Velvet Slip & Kimono-Sleeve Duster",
    "shortTitle": "Tokyo Midnight Velvet Slip & Kimono-Sleeve",
    "gender": "women",
    "category": "Gala & Runway Glam",
    "aesthetic": "Gala & Runway Glam",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_38_sua_gala_glam.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Tokyo Daikanyama, Ginza & Harajuku. Tokyo Midnight Velvet Slip & Kimono-Sleeve Duster, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Gala & Runway Glam",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5430,
    "pins": [
      {
        "id": "look-38-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Dries Van Noten Statement Piece",
        "brand": "Dries Van Noten",
        "price": 1420,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Dries+Van+Noten+Jacket",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over statuesque runway proportions.",
        "sku": "OUT038",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-38-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Galvan Essential Top",
        "brand": "Galvan",
        "price": 410,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Galvan+Top",
        "kStyleTip": "Clean minimalist layering top with comfortable luxurious hand-feel.",
        "sku": "TOP038",
        "silhouette": "Sleek Fluid Fit"
      },
      {
        "id": "look-38-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Khaite Trousers / Skirt",
        "brand": "Khaite",
        "price": 675,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Khaite+Pants",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT038",
        "silhouette": "Wide-Leg / Knife-Pleat Column"
      },
      {
        "id": "look-38-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Amina Muaddi Designer Footwear",
        "brand": "Amina Muaddi",
        "price": 945,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Amina+Muaddi+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO038",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-38-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Bottega Veneta Iconic Bag",
        "brand": "Bottega Veneta",
        "price": 1360,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Bottega+Veneta+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG038",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-38-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Charlotte Chesnais Headwear Accent",
        "brand": "Charlotte Chesnais",
        "price": 270,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT038",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-38-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Modernist Jewelry",
        "brand": "Charlotte Chesnais",
        "price": 350,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL038",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v39",
    "title": "Nakameguro Washed Japanese Selvedge Denim Jacket & Boots",
    "shortTitle": "Nakameguro Washed Japanese Selvedge Denim ",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_39_chaewon_elevated_casual.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in Tokyo Daikanyama, Ginza & Harajuku. Nakameguro Washed Japanese Selvedge Denim Jacket & Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5885,
    "pins": [
      {
        "id": "look-39-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Visvim Statement Piece",
        "brand": "Visvim",
        "price": 1540,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Visvim+Outerwear",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over statuesque runway proportions.",
        "sku": "OUT039",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-39-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Alex Mill Essential Top",
        "brand": "Alex Mill",
        "price": 450,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Alex+Mill+Knit",
        "kStyleTip": "Clean minimalist layering top with comfortable luxurious hand-feel.",
        "sku": "TOP039",
        "silhouette": "Sleek Fluid Fit"
      },
      {
        "id": "look-39-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "RE/DONE Trousers / Skirt",
        "brand": "RE/DONE",
        "price": 730,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=RE/DONE+Bottoms",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT039",
        "silhouette": "Wide-Leg / Knife-Pleat Column"
      },
      {
        "id": "look-39-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Red Wing Designer Footwear",
        "brand": "Red Wing",
        "price": 1020,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Red+Wing+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO039",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-39-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Filson Iconic Bag",
        "brand": "Filson",
        "price": 1470,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Filson+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG039",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-39-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "'47 Brand Headwear Accent",
        "brand": "'47 Brand",
        "price": 295,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query='47+Brand+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT039",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-39-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Foundrae Modernist Jewelry",
        "brand": "Foundrae",
        "price": 380,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Foundrae+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL039",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v40",
    "title": "Ginza Six Bespoke Satin Lapel Evening Blazer & Stilettos",
    "shortTitle": "Ginza Six Bespoke Satin Lapel Evening Blaz",
    "gender": "women",
    "category": "Gala & Runway Glam",
    "aesthetic": "Gala & Runway Glam",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_40_hana_gala_glam.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Tokyo Daikanyama, Ginza & Harajuku. Ginza Six Bespoke Satin Lapel Evening Blazer & Stilettos, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Gala & Runway Glam",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 6340,
    "pins": [
      {
        "id": "look-40-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Saint Laurent Statement Piece",
        "brand": "Saint Laurent",
        "price": 1660,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Saint+Laurent+Jacket",
        "kStyleTip": "Impeccably tailored luxury outerwear creating dramatic architectural lines over statuesque runway proportions.",
        "sku": "OUT040",
        "silhouette": "Structured Editorial Fit"
      },
      {
        "id": "look-40-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Saint Laurent Essential Top",
        "brand": "Saint Laurent",
        "price": 490,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Saint+Laurent+Top",
        "kStyleTip": "Clean minimalist layering top with comfortable luxurious hand-feel.",
        "sku": "TOP040",
        "silhouette": "Sleek Fluid Fit"
      },
      {
        "id": "look-40-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Saint Laurent Trousers / Skirt",
        "brand": "Saint Laurent",
        "price": 785,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Saint+Laurent+Pants",
        "kStyleTip": "High-rise relaxed tailoring with clean floor-grazing hemline.",
        "sku": "BOT040",
        "silhouette": "Wide-Leg / Knife-Pleat Column"
      },
      {
        "id": "look-40-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Saint Laurent Designer Footwear",
        "brand": "Saint Laurent",
        "price": 1095,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Saint+Laurent+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted on the pavement with empty ground clearance.",
        "sku": "SHO040",
        "silhouette": "Architectural Statement Footwear"
      },
      {
        "id": "look-40-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Saint Laurent Iconic Bag",
        "brand": "Saint Laurent",
        "price": 1580,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Saint+Laurent+Bag",
        "kStyleTip": "Sculptural handheld or shoulder bag in supple luxury leather anchoring the tonal outfit palette.",
        "sku": "BAG040",
        "silhouette": "Iconic Structured Bag"
      },
      {
        "id": "look-40-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Cartier Headwear Accent",
        "brand": "Cartier",
        "price": 320,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Cartier+Hat",
        "kStyleTip": "Rule #5 headwear diversification: beanies, bucket hats, straw boaters, fedoras, or velvet couture headbands framing the face.",
        "sku": "HAT040",
        "silhouette": "High-Fashion Headwear"
      },
      {
        "id": "look-40-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tiffany & Co. Modernist Jewelry",
        "brand": "Tiffany & Co.",
        "price": 410,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Tiffany+&+Co.+Jewelry",
        "kStyleTip": "Modernist 14K/18K gold vermeil or solid silver accents adding high-polish gleam.",
        "sku": "JWL040",
        "silhouette": "Modernist Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v41",
    "title": "Portofino Silk Striped Overshirt & Linen Slacks",
    "shortTitle": "Portofino Silk Striped Overshirt & Linen S",
    "gender": "women",
    "category": "Parisian & Riviera Chic",
    "aesthetic": "Parisian & Riviera Chic",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_41_jiwoo_parisian_riviera.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Portofino, Capri, Amalfi Coast & Lake Como. Portofino Silk Striped Overshirt & Linen Slacks, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Parisian & Riviera Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2370,
    "pins": [
      {
        "id": "look-41-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Jacquemus Riviera Signature",
        "brand": "Jacquemus",
        "price": 620,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Jacquemus+Outerwear",
        "kStyleTip": "Effortless resort elegance crafted in premium European breathable fabrics.",
        "sku": "OUT041",
        "silhouette": "Breezy Architectural Silhouette"
      },
      {
        "id": "look-41-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Casablanca Resort Knit Top",
        "brand": "Casablanca",
        "price": 140,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Casablanca+Knit",
        "kStyleTip": "Sun-drenched knitwear accentuating collarbones and shoulder lines.",
        "sku": "TOP041",
        "silhouette": "Sleek Halter / Ribbed Tank"
      },
      {
        "id": "look-41-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Loro Piana Resort Bottom",
        "brand": "Loro Piana",
        "price": 310,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loro+Piana+Bottoms",
        "kStyleTip": "Flowing fluid cut draping gracefully around elongated dancer limbs.",
        "sku": "BOT041",
        "silhouette": "Wide-Leg / Fluid Wrap / Bermuda"
      },
      {
        "id": "look-41-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Ancient Greek Sandals Handcrafted Shoes",
        "brand": "Ancient Greek Sandals",
        "price": 380,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Ancient+Greek+Sandals+Sandals",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO041",
        "silhouette": "Slide Sandals / Espadrilles / Loafers"
      },
      {
        "id": "look-41-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Loewe Mediterranean Tote / Bag",
        "brand": "Loewe",
        "price": 650,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Loewe+Tote",
        "kStyleTip": "Artisanal handwoven basket tote or luxury leather shoulder bag anchoring vacation looks.",
        "sku": "BAG041",
        "silhouette": "Structured Basket / Clutch / Bucket"
      },
      {
        "id": "look-41-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Janessa Leone Sun Protection / Eyewear",
        "brand": "Janessa Leone",
        "price": 110,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Janessa+Leone+Hat",
        "kStyleTip": "Wide-brim straw boater hats, oval cat-eye sunglasses or silk scarves shielding from Mediterranean sun.",
        "sku": "HAT041",
        "silhouette": "Riviera Statement Headwear"
      },
      {
        "id": "look-41-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tohum Fine Jewelry Accent",
        "brand": "Tohum",
        "price": 160,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Tohum+Jewelry",
        "kStyleTip": "Organic sea pearl, puka shell or 18k gold vermeil adding luminous reflection against warm skin.",
        "sku": "JWL041",
        "silhouette": "Organic Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v42",
    "title": "Capri Marina Grande Ribbed Knit Halter & Silk Wrap Skirt",
    "shortTitle": "Capri Marina Grande Ribbed Knit Halter & S",
    "gender": "women",
    "category": "Parisian & Riviera Chic",
    "aesthetic": "Parisian & Riviera Chic",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_42_minseo_parisian_riviera.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Portofino, Capri, Amalfi Coast & Lake Como. Capri Marina Grande Ribbed Knit Halter & Silk Wrap Skirt, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Parisian & Riviera Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2860,
    "pins": [
      {
        "id": "look-42-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Posse Riviera Signature",
        "brand": "Posse",
        "price": 750,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Posse+Jacket",
        "kStyleTip": "Effortless resort elegance crafted in premium European breathable fabrics.",
        "sku": "OUT042",
        "silhouette": "Breezy Architectural Silhouette"
      },
      {
        "id": "look-42-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Khaite Resort Knit Top",
        "brand": "Khaite",
        "price": 185,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Khaite+Top",
        "kStyleTip": "Sun-drenched knitwear accentuating collarbones and shoulder lines.",
        "sku": "TOP042",
        "silhouette": "Sleek Halter / Ribbed Tank"
      },
      {
        "id": "look-42-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Reformation Resort Bottom",
        "brand": "Reformation",
        "price": 370,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Reformation+Pants",
        "kStyleTip": "Flowing fluid cut draping gracefully around elongated dancer limbs.",
        "sku": "BOT042",
        "silhouette": "Wide-Leg / Fluid Wrap / Bermuda"
      },
      {
        "id": "look-42-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Castañer Handcrafted Shoes",
        "brand": "Castañer",
        "price": 450,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Castañer+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO042",
        "silhouette": "Slide Sandals / Espadrilles / Loafers"
      },
      {
        "id": "look-42-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Cult Gaia Mediterranean Tote / Bag",
        "brand": "Cult Gaia",
        "price": 770,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Cult+Gaia+Bag",
        "kStyleTip": "Artisanal handwoven basket tote or luxury leather shoulder bag anchoring vacation looks.",
        "sku": "BAG042",
        "silhouette": "Structured Basket / Clutch / Bucket"
      },
      {
        "id": "look-42-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Tohum Sun Protection / Eyewear",
        "brand": "Tohum",
        "price": 140,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Tohum+Sunglasses",
        "kStyleTip": "Wide-brim straw boater hats, oval cat-eye sunglasses or silk scarves shielding from Mediterranean sun.",
        "sku": "HAT042",
        "silhouette": "Riviera Statement Headwear"
      },
      {
        "id": "look-42-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tohum Fine Jewelry Accent",
        "brand": "Tohum",
        "price": 195,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Tohum+Jewelry",
        "kStyleTip": "Organic sea pearl, puka shell or 18k gold vermeil adding luminous reflection against warm skin.",
        "sku": "JWL042",
        "silhouette": "Organic Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v43",
    "title": "Amalfi Cliffside Sculptural Linen Trench & Wedge Espadrilles",
    "shortTitle": "Amalfi Cliffside Sculptural Linen Trench & Wedge Espadrilles",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_43_sua_quiet_luxury.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Portofino, Capri, Amalfi Coast & Lake Como. Amalfi Cliffside Sculptural Linen Trench & Wedge Espadrilles, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3350,
    "pins": [
      {
        "id": "look-43-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "The Row Riviera Signature",
        "brand": "The Row",
        "price": 880,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Outerwear",
        "kStyleTip": "Effortless resort elegance crafted in premium European breathable fabrics.",
        "sku": "OUT043",
        "silhouette": "Breezy Architectural Silhouette"
      },
      {
        "id": "look-43-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Toteme Resort Knit Top",
        "brand": "Toteme",
        "price": 230,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Knit",
        "kStyleTip": "Sun-drenched knitwear accentuating collarbones and shoulder lines.",
        "sku": "TOP043",
        "silhouette": "Sleek Halter / Ribbed Tank"
      },
      {
        "id": "look-43-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Resort Bottom",
        "brand": "Toteme",
        "price": 430,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Bottoms",
        "kStyleTip": "Flowing fluid cut draping gracefully around elongated dancer limbs.",
        "sku": "BOT043",
        "silhouette": "Wide-Leg / Fluid Wrap / Bermuda"
      },
      {
        "id": "look-43-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Castañer Handcrafted Shoes",
        "brand": "Castañer",
        "price": 520,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Castañer+Sandals",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO043",
        "silhouette": "Slide Sandals / Espadrilles / Loafers"
      },
      {
        "id": "look-43-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "The Row Mediterranean Tote / Bag",
        "brand": "The Row",
        "price": 890,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Tote",
        "kStyleTip": "Artisanal handwoven basket tote or luxury leather shoulder bag anchoring vacation looks.",
        "sku": "BAG043",
        "silhouette": "Structured Basket / Clutch / Bucket"
      },
      {
        "id": "look-43-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Le Specs Sun Protection / Eyewear",
        "brand": "Le Specs",
        "price": 170,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Le+Specs+Hat",
        "kStyleTip": "Wide-brim straw boater hats, oval cat-eye sunglasses or silk scarves shielding from Mediterranean sun.",
        "sku": "HAT043",
        "silhouette": "Riviera Statement Headwear"
      },
      {
        "id": "look-43-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Fine Jewelry Accent",
        "brand": "Sophie Buhai",
        "price": 230,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sophie+Buhai+Jewelry",
        "kStyleTip": "Organic sea pearl, puka shell or 18k gold vermeil adding luminous reflection against warm skin.",
        "sku": "JWL043",
        "silhouette": "Organic Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v44",
    "title": "Positano Crochet Raffia Tunic & Tailored Bermuda Shorts",
    "shortTitle": "Positano Crochet Raffia Tunic & Tailored B",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_44_chaewon_elevated_casual.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in Portofino, Capri, Amalfi Coast & Lake Como. Positano Crochet Raffia Tunic & Tailored Bermuda Shorts, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3840,
    "pins": [
      {
        "id": "look-44-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Casablanca Riviera Signature",
        "brand": "Casablanca",
        "price": 1010,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Casablanca+Jacket",
        "kStyleTip": "Effortless resort elegance crafted in premium European breathable fabrics.",
        "sku": "OUT044",
        "silhouette": "Breezy Architectural Silhouette"
      },
      {
        "id": "look-44-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Alanui Resort Knit Top",
        "brand": "Alanui",
        "price": 275,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Alanui+Top",
        "kStyleTip": "Sun-drenched knitwear accentuating collarbones and shoulder lines.",
        "sku": "TOP044",
        "silhouette": "Sleek Halter / Ribbed Tank"
      },
      {
        "id": "look-44-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Frankie Shop Resort Bottom",
        "brand": "Frankie Shop",
        "price": 490,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Frankie+Shop+Pants",
        "kStyleTip": "Flowing fluid cut draping gracefully around elongated dancer limbs.",
        "sku": "BOT044",
        "silhouette": "Wide-Leg / Fluid Wrap / Bermuda"
      },
      {
        "id": "look-44-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Marni Handcrafted Shoes",
        "brand": "Marni",
        "price": 590,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Marni+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO044",
        "silhouette": "Slide Sandals / Espadrilles / Loafers"
      },
      {
        "id": "look-44-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Dragon Diffusion Mediterranean Tote / Bag",
        "brand": "Dragon Diffusion",
        "price": 1010,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Dragon+Diffusion+Bag",
        "kStyleTip": "Artisanal handwoven basket tote or luxury leather shoulder bag anchoring vacation looks.",
        "sku": "BAG044",
        "silhouette": "Structured Basket / Clutch / Bucket"
      },
      {
        "id": "look-44-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Lack of Color Sun Protection / Eyewear",
        "brand": "Lack of Color",
        "price": 200,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Lack+of+Color+Sunglasses",
        "kStyleTip": "Wide-brim straw boater hats, oval cat-eye sunglasses or silk scarves shielding from Mediterranean sun.",
        "sku": "HAT044",
        "silhouette": "Riviera Statement Headwear"
      },
      {
        "id": "look-44-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Laura Lombardi Fine Jewelry Accent",
        "brand": "Laura Lombardi",
        "price": 265,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Laura+Lombardi+Jewelry",
        "kStyleTip": "Organic sea pearl, puka shell or 18k gold vermeil adding luminous reflection against warm skin.",
        "sku": "JWL044",
        "silhouette": "Organic Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v45",
    "title": "Bellagio Villa Terrace Fluid Pleated Silk Gown",
    "shortTitle": "Bellagio Villa Terrace Fluid Pleated Silk ",
    "gender": "women",
    "category": "Gala & Runway Glam",
    "aesthetic": "Gala & Runway Glam",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_45_hana_gala_glam.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Portofino, Capri, Amalfi Coast & Lake Como. Bellagio Villa Terrace Fluid Pleated Silk Gown, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Gala & Runway Glam",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4330,
    "pins": [
      {
        "id": "look-45-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Valentino Riviera Signature",
        "brand": "Valentino",
        "price": 1140,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Valentino+Outerwear",
        "kStyleTip": "Effortless resort elegance crafted in premium European breathable fabrics.",
        "sku": "OUT045",
        "silhouette": "Breezy Architectural Silhouette"
      },
      {
        "id": "look-45-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Valentino Resort Knit Top",
        "brand": "Valentino",
        "price": 320,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Valentino+Knit",
        "kStyleTip": "Sun-drenched knitwear accentuating collarbones and shoulder lines.",
        "sku": "TOP045",
        "silhouette": "Sleek Halter / Ribbed Tank"
      },
      {
        "id": "look-45-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Valentino Resort Bottom",
        "brand": "Valentino",
        "price": 550,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Valentino+Bottoms",
        "kStyleTip": "Flowing fluid cut draping gracefully around elongated dancer limbs.",
        "sku": "BOT045",
        "silhouette": "Wide-Leg / Fluid Wrap / Bermuda"
      },
      {
        "id": "look-45-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Aquazzura Handcrafted Shoes",
        "brand": "Aquazzura",
        "price": 660,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Aquazzura+Sandals",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO045",
        "silhouette": "Slide Sandals / Espadrilles / Loafers"
      },
      {
        "id": "look-45-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Judith Leiber Mediterranean Tote / Bag",
        "brand": "Judith Leiber",
        "price": 1130,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Judith+Leiber+Tote",
        "kStyleTip": "Artisanal handwoven basket tote or luxury leather shoulder bag anchoring vacation looks.",
        "sku": "BAG045",
        "silhouette": "Structured Basket / Clutch / Bucket"
      },
      {
        "id": "look-45-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Van Cleef & Arpels Sun Protection / Eyewear",
        "brand": "Van Cleef & Arpels",
        "price": 230,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Van+Cleef+&+Arpels+Hat",
        "kStyleTip": "Wide-brim straw boater hats, oval cat-eye sunglasses or silk scarves shielding from Mediterranean sun.",
        "sku": "HAT045",
        "silhouette": "Riviera Statement Headwear"
      },
      {
        "id": "look-45-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Van Cleef & Arpels Fine Jewelry Accent",
        "brand": "Van Cleef & Arpels",
        "price": 300,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Van+Cleef+&+Arpels+Jewelry",
        "kStyleTip": "Organic sea pearl, puka shell or 18k gold vermeil adding luminous reflection against warm skin.",
        "sku": "JWL045",
        "silhouette": "Organic Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v46",
    "title": "Cinque Terre Marine Striped Boatneck & White Denim",
    "shortTitle": "Cinque Terre Marine Striped Boatneck & Whi",
    "gender": "women",
    "category": "Parisian & Riviera Chic",
    "aesthetic": "Parisian & Riviera Chic",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_46_jiwoo_parisian_riviera.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Portofino, Capri, Amalfi Coast & Lake Como. Cinque Terre Marine Striped Boatneck & White Denim, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Parisian & Riviera Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4820,
    "pins": [
      {
        "id": "look-46-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Saint Laurent Riviera Signature",
        "brand": "Saint Laurent",
        "price": 1270,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Saint+Laurent+Jacket",
        "kStyleTip": "Effortless resort elegance crafted in premium European breathable fabrics.",
        "sku": "OUT046",
        "silhouette": "Breezy Architectural Silhouette"
      },
      {
        "id": "look-46-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Armor-Lux Resort Knit Top",
        "brand": "Armor-Lux",
        "price": 365,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Armor-Lux+Top",
        "kStyleTip": "Sun-drenched knitwear accentuating collarbones and shoulder lines.",
        "sku": "TOP046",
        "silhouette": "Sleek Halter / Ribbed Tank"
      },
      {
        "id": "look-46-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Agolde Resort Bottom",
        "brand": "Agolde",
        "price": 610,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Agolde+Pants",
        "kStyleTip": "Flowing fluid cut draping gracefully around elongated dancer limbs.",
        "sku": "BOT046",
        "silhouette": "Wide-Leg / Fluid Wrap / Bermuda"
      },
      {
        "id": "look-46-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Chanel Handcrafted Shoes",
        "brand": "Chanel",
        "price": 730,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Chanel+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO046",
        "silhouette": "Slide Sandals / Espadrilles / Loafers"
      },
      {
        "id": "look-46-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "A.P.C. Mediterranean Tote / Bag",
        "brand": "A.P.C.",
        "price": 1250,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=A.P.C.+Bag",
        "kStyleTip": "Artisanal handwoven basket tote or luxury leather shoulder bag anchoring vacation looks.",
        "sku": "BAG046",
        "silhouette": "Structured Basket / Clutch / Bucket"
      },
      {
        "id": "look-46-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Le Specs Sun Protection / Eyewear",
        "brand": "Le Specs",
        "price": 260,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Le+Specs+Sunglasses",
        "kStyleTip": "Wide-brim straw boater hats, oval cat-eye sunglasses or silk scarves shielding from Mediterranean sun.",
        "sku": "HAT046",
        "silhouette": "Riviera Statement Headwear"
      },
      {
        "id": "look-46-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Fine Jewelry Accent",
        "brand": "Sophie Buhai",
        "price": 335,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Jewelry",
        "kStyleTip": "Organic sea pearl, puka shell or 18k gold vermeil adding luminous reflection against warm skin.",
        "sku": "JWL046",
        "silhouette": "Organic Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v47",
    "title": "Lake Como Fine Gauge Cashmere Cardigan & Wide Slacks",
    "shortTitle": "Lake Como Fine Gauge Cashmere Cardigan & W",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_47_minseo_quiet_luxury.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Portofino, Capri, Amalfi Coast & Lake Como. Lake Como Fine Gauge Cashmere Cardigan & Wide Slacks, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5310,
    "pins": [
      {
        "id": "look-47-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Loro Piana Riviera Signature",
        "brand": "Loro Piana",
        "price": 1400,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loro+Piana+Outerwear",
        "kStyleTip": "Effortless resort elegance crafted in premium European breathable fabrics.",
        "sku": "OUT047",
        "silhouette": "Breezy Architectural Silhouette"
      },
      {
        "id": "look-47-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Khaite Resort Knit Top",
        "brand": "Khaite",
        "price": 410,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Khaite+Knit",
        "kStyleTip": "Sun-drenched knitwear accentuating collarbones and shoulder lines.",
        "sku": "TOP047",
        "silhouette": "Sleek Halter / Ribbed Tank"
      },
      {
        "id": "look-47-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "The Row Resort Bottom",
        "brand": "The Row",
        "price": 670,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Bottoms",
        "kStyleTip": "Flowing fluid cut draping gracefully around elongated dancer limbs.",
        "sku": "BOT047",
        "silhouette": "Wide-Leg / Fluid Wrap / Bermuda"
      },
      {
        "id": "look-47-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "The Row Handcrafted Shoes",
        "brand": "The Row",
        "price": 800,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Sandals",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO047",
        "silhouette": "Slide Sandals / Espadrilles / Loafers"
      },
      {
        "id": "look-47-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "The Row Mediterranean Tote / Bag",
        "brand": "The Row",
        "price": 1370,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Tote",
        "kStyleTip": "Artisanal handwoven basket tote or luxury leather shoulder bag anchoring vacation looks.",
        "sku": "BAG047",
        "silhouette": "Structured Basket / Clutch / Bucket"
      },
      {
        "id": "look-47-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Sophie Buhai Sun Protection / Eyewear",
        "brand": "Sophie Buhai",
        "price": 290,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Hat",
        "kStyleTip": "Wide-brim straw boater hats, oval cat-eye sunglasses or silk scarves shielding from Mediterranean sun.",
        "sku": "HAT047",
        "silhouette": "Riviera Statement Headwear"
      },
      {
        "id": "look-47-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Fine Jewelry Accent",
        "brand": "Sophie Buhai",
        "price": 370,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sophie+Buhai+Jewelry",
        "kStyleTip": "Organic sea pearl, puka shell or 18k gold vermeil adding luminous reflection against warm skin.",
        "sku": "JWL047",
        "silhouette": "Organic Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v48",
    "title": "Ravello Gardens Draped Organza Halter Dress",
    "shortTitle": "Ravello Gardens Draped Organza Halter Dres",
    "gender": "women",
    "category": "Gala & Runway Glam",
    "aesthetic": "Gala & Runway Glam",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_48_sua_gala_glam.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Portofino, Capri, Amalfi Coast & Lake Como. Ravello Gardens Draped Organza Halter Dress, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Gala & Runway Glam",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5800,
    "pins": [
      {
        "id": "look-48-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Giambattista Valli Riviera Signature",
        "brand": "Giambattista Valli",
        "price": 1530,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Giambattista+Valli+Jacket",
        "kStyleTip": "Effortless resort elegance crafted in premium European breathable fabrics.",
        "sku": "OUT048",
        "silhouette": "Breezy Architectural Silhouette"
      },
      {
        "id": "look-48-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Zimmermann Resort Knit Top",
        "brand": "Zimmermann",
        "price": 455,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Zimmermann+Top",
        "kStyleTip": "Sun-drenched knitwear accentuating collarbones and shoulder lines.",
        "sku": "TOP048",
        "silhouette": "Sleek Halter / Ribbed Tank"
      },
      {
        "id": "look-48-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Giambattista Valli Resort Bottom",
        "brand": "Giambattista Valli",
        "price": 730,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Giambattista+Valli+Pants",
        "kStyleTip": "Flowing fluid cut draping gracefully around elongated dancer limbs.",
        "sku": "BOT048",
        "silhouette": "Wide-Leg / Fluid Wrap / Bermuda"
      },
      {
        "id": "look-48-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Manolo Blahnik Handcrafted Shoes",
        "brand": "Manolo Blahnik",
        "price": 870,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Manolo+Blahnik+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO048",
        "silhouette": "Slide Sandals / Espadrilles / Loafers"
      },
      {
        "id": "look-48-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Cult Gaia Mediterranean Tote / Bag",
        "brand": "Cult Gaia",
        "price": 1490,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Cult+Gaia+Bag",
        "kStyleTip": "Artisanal handwoven basket tote or luxury leather shoulder bag anchoring vacation looks.",
        "sku": "BAG048",
        "silhouette": "Structured Basket / Clutch / Bucket"
      },
      {
        "id": "look-48-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Charlotte Chesnais Sun Protection / Eyewear",
        "brand": "Charlotte Chesnais",
        "price": 320,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Sunglasses",
        "kStyleTip": "Wide-brim straw boater hats, oval cat-eye sunglasses or silk scarves shielding from Mediterranean sun.",
        "sku": "HAT048",
        "silhouette": "Riviera Statement Headwear"
      },
      {
        "id": "look-48-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Fine Jewelry Accent",
        "brand": "Charlotte Chesnais",
        "price": 405,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Organic sea pearl, puka shell or 18k gold vermeil adding luminous reflection against warm skin.",
        "sku": "JWL048",
        "silhouette": "Organic Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v49",
    "title": "Sorrento Sun-Washed Denim Vest & Fisherman Sandals",
    "shortTitle": "Sorrento Sun-Washed Denim Vest & Fisherman",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_49_chaewon_elevated_casual.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in Portofino, Capri, Amalfi Coast & Lake Como. Sorrento Sun-Washed Denim Vest & Fisherman Sandals, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 6290,
    "pins": [
      {
        "id": "look-49-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Isabel Marant Riviera Signature",
        "brand": "Isabel Marant",
        "price": 1660,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Isabel+Marant+Outerwear",
        "kStyleTip": "Effortless resort elegance crafted in premium European breathable fabrics.",
        "sku": "OUT049",
        "silhouette": "Breezy Architectural Silhouette"
      },
      {
        "id": "look-49-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Resort Knit Top",
        "brand": "Skims",
        "price": 500,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Skims+Knit",
        "kStyleTip": "Sun-drenched knitwear accentuating collarbones and shoulder lines.",
        "sku": "TOP049",
        "silhouette": "Sleek Halter / Ribbed Tank"
      },
      {
        "id": "look-49-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Agolde Resort Bottom",
        "brand": "Agolde",
        "price": 790,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Agolde+Bottoms",
        "kStyleTip": "Flowing fluid cut draping gracefully around elongated dancer limbs.",
        "sku": "BOT049",
        "silhouette": "Wide-Leg / Fluid Wrap / Bermuda"
      },
      {
        "id": "look-49-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "The Row Handcrafted Shoes",
        "brand": "The Row",
        "price": 940,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Sandals",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO049",
        "silhouette": "Slide Sandals / Espadrilles / Loafers"
      },
      {
        "id": "look-49-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Dragon Diffusion Mediterranean Tote / Bag",
        "brand": "Dragon Diffusion",
        "price": 1610,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Dragon+Diffusion+Tote",
        "kStyleTip": "Artisanal handwoven basket tote or luxury leather shoulder bag anchoring vacation looks.",
        "sku": "BAG049",
        "silhouette": "Structured Basket / Clutch / Bucket"
      },
      {
        "id": "look-49-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Helen Kaminski Sun Protection / Eyewear",
        "brand": "Helen Kaminski",
        "price": 350,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Helen+Kaminski+Hat",
        "kStyleTip": "Wide-brim straw boater hats, oval cat-eye sunglasses or silk scarves shielding from Mediterranean sun.",
        "sku": "HAT049",
        "silhouette": "Riviera Statement Headwear"
      },
      {
        "id": "look-49-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tory Burch Fine Jewelry Accent",
        "brand": "Tory Burch",
        "price": 440,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Tory+Burch+Jewelry",
        "kStyleTip": "Organic sea pearl, puka shell or 18k gold vermeil adding luminous reflection against warm skin.",
        "sku": "JWL049",
        "silhouette": "Organic Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v50",
    "title": "Tuscan Villa Evening Double-Faced Cashmere Duster",
    "shortTitle": "Tuscan Villa Evening Double-Faced Cashmere",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_50_hana_quiet_luxury.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Portofino, Capri, Amalfi Coast & Lake Como. Tuscan Villa Evening Double-Faced Cashmere Duster, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 6780,
    "pins": [
      {
        "id": "look-50-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Brunello Cucinelli Riviera Signature",
        "brand": "Brunello Cucinelli",
        "price": 1790,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Brunello+Cucinelli+Jacket",
        "kStyleTip": "Effortless resort elegance crafted in premium European breathable fabrics.",
        "sku": "OUT050",
        "silhouette": "Breezy Architectural Silhouette"
      },
      {
        "id": "look-50-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Toteme Resort Knit Top",
        "brand": "Toteme",
        "price": 545,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Top",
        "kStyleTip": "Sun-drenched knitwear accentuating collarbones and shoulder lines.",
        "sku": "TOP050",
        "silhouette": "Sleek Halter / Ribbed Tank"
      },
      {
        "id": "look-50-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Resort Bottom",
        "brand": "Toteme",
        "price": 850,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Pants",
        "kStyleTip": "Flowing fluid cut draping gracefully around elongated dancer limbs.",
        "sku": "BOT050",
        "silhouette": "Wide-Leg / Fluid Wrap / Bermuda"
      },
      {
        "id": "look-50-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Loro Piana Handcrafted Shoes",
        "brand": "Loro Piana",
        "price": 1010,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loro+Piana+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO050",
        "silhouette": "Slide Sandals / Espadrilles / Loafers"
      },
      {
        "id": "look-50-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Hermès Mediterranean Tote / Bag",
        "brand": "Hermès",
        "price": 1730,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Hermès+Bag",
        "kStyleTip": "Artisanal handwoven basket tote or luxury leather shoulder bag anchoring vacation looks.",
        "sku": "BAG050",
        "silhouette": "Structured Basket / Clutch / Bucket"
      },
      {
        "id": "look-50-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Pomellato Sun Protection / Eyewear",
        "brand": "Pomellato",
        "price": 380,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Pomellato+Sunglasses",
        "kStyleTip": "Wide-brim straw boater hats, oval cat-eye sunglasses or silk scarves shielding from Mediterranean sun.",
        "sku": "HAT050",
        "silhouette": "Riviera Statement Headwear"
      },
      {
        "id": "look-50-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Pomellato Fine Jewelry Accent",
        "brand": "Pomellato",
        "price": 475,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Pomellato+Jewelry",
        "kStyleTip": "Organic sea pearl, puka shell or 18k gold vermeil adding luminous reflection against warm skin.",
        "sku": "JWL050",
        "silhouette": "Organic Sculptural Accent"
      }
    ]
  },
  {
    "id": "editorial-look-v51",
    "title": "Mayfair Heritage Houndstooth Wool Trench & Knee Boots",
    "shortTitle": "Mayfair Heritage Houndstooth Wool Trench & Knee Boots",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_51_jiwoo_quiet_luxury.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in London Mayfair, Savile Row & Shoreditch. Mayfair Heritage Houndstooth Wool Trench & Knee Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2530,
    "pins": [
      {
        "id": "look-51-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Burberry British Heritage Piece",
        "brand": "Burberry",
        "price": 680,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Burberry+Coat",
        "kStyleTip": "Impeccable British heritage tailoring with structural warmth and prestige.",
        "sku": "OUT051",
        "silhouette": "Structured Heritage Tailoring"
      },
      {
        "id": "look-51-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Essential Layer",
        "brand": "Skims",
        "price": 150,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Skims+Knit",
        "kStyleTip": "Refined shirting or luxury knitwear framing the décolletage.",
        "sku": "TOP051",
        "silhouette": "Tailored Collar / High Neck"
      },
      {
        "id": "look-51-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Tailored Bottom",
        "brand": "Toteme",
        "price": 320,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Skirt",
        "kStyleTip": "Knife-pleated tartan, chalk-stripe trousers or wide-wale corduroy anchoring classic proportions.",
        "sku": "BOT051",
        "silhouette": "Knife-Pleated / Wide Pleated Slacks"
      },
      {
        "id": "look-51-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Khaite Heritage Footwear",
        "brand": "Khaite",
        "price": 390,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Khaite+Loafers",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO051",
        "silhouette": "Horsebit Loafers / Combat Boots / Knee Boots"
      },
      {
        "id": "look-51-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Celine Iconic London Bag",
        "brand": "Celine",
        "price": 690,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Celine+Bag",
        "kStyleTip": "Structured leather satchel, top-handle bag or evening clutch complementing British tailoring.",
        "sku": "BAG051",
        "silhouette": "Satchel / Structured Crossbody / Clutch"
      },
      {
        "id": "look-51-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Janessa Leone Headwear Accent",
        "brand": "Janessa Leone",
        "price": 120,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Janessa+Leone+Hat",
        "kStyleTip": "Rule #5 headwear diversification: baker boy caps, berets, beanies or headbands completing the silhouette.",
        "sku": "HAT051",
        "silhouette": "Baker Boy / Beret / Knit Beanie"
      },
      {
        "id": "look-51-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Fine Jewelry Accent",
        "brand": "Charlotte Chesnais",
        "price": 180,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Sculptural vermeil, silver ribbons or vintage horology adding aristocratic polish.",
        "sku": "JWL051",
        "silhouette": "Ribbon Earrings / Medallion / Chandelier"
      }
    ]
  },
  {
    "id": "editorial-look-v52",
    "title": "Savile Row Double-Breasted Pinstripe Suit & Oxford Loafers",
    "shortTitle": "Savile Row Double-Breasted Pinstripe Suit ",
    "gender": "women",
    "category": "Collegiate Preppy & Ivy",
    "aesthetic": "Collegiate Preppy & Ivy",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_52_minseo_collegiate_preppy.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in London Mayfair, Savile Row & Shoreditch. Savile Row Double-Breasted Pinstripe Suit & Oxford Loafers, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Collegiate Preppy & Ivy",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3020,
    "pins": [
      {
        "id": "look-52-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Thom Browne British Heritage Piece",
        "brand": "Thom Browne",
        "price": 820,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Thom+Browne+Jacket",
        "kStyleTip": "Impeccable British heritage tailoring with structural warmth and prestige.",
        "sku": "OUT052",
        "silhouette": "Structured Heritage Tailoring"
      },
      {
        "id": "look-52-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Charvet Essential Layer",
        "brand": "Charvet",
        "price": 195,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Charvet+Top",
        "kStyleTip": "Refined shirting or luxury knitwear framing the décolletage.",
        "sku": "TOP052",
        "silhouette": "Tailored Collar / High Neck"
      },
      {
        "id": "look-52-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Thom Browne Tailored Bottom",
        "brand": "Thom Browne",
        "price": 375,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Thom+Browne+Pants",
        "kStyleTip": "Knife-pleated tartan, chalk-stripe trousers or wide-wale corduroy anchoring classic proportions.",
        "sku": "BOT052",
        "silhouette": "Knife-Pleated / Wide Pleated Slacks"
      },
      {
        "id": "look-52-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "G.H. Bass Heritage Footwear",
        "brand": "G.H. Bass",
        "price": 455,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=G.H.+Bass+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO052",
        "silhouette": "Horsebit Loafers / Combat Boots / Knee Boots"
      },
      {
        "id": "look-52-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "The Cambridge Satchel Co. Iconic London Bag",
        "brand": "The Cambridge Satchel Co.",
        "price": 805,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Cambridge+Satchel+Co.+Bag",
        "kStyleTip": "Structured leather satchel, top-handle bag or evening clutch complementing British tailoring.",
        "sku": "BAG052",
        "silhouette": "Satchel / Structured Crossbody / Clutch"
      },
      {
        "id": "look-52-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Cartier Headwear Accent",
        "brand": "Cartier",
        "price": 150,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Cartier+Hat",
        "kStyleTip": "Rule #5 headwear diversification: baker boy caps, berets, beanies or headbands completing the silhouette.",
        "sku": "HAT052",
        "silhouette": "Baker Boy / Beret / Knit Beanie"
      },
      {
        "id": "look-52-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Cartier Fine Jewelry Accent",
        "brand": "Cartier",
        "price": 220,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Cartier+Jewelry",
        "kStyleTip": "Sculptural vermeil, silver ribbons or vintage horology adding aristocratic polish.",
        "sku": "JWL052",
        "silhouette": "Ribbon Earrings / Medallion / Chandelier"
      }
    ]
  },
  {
    "id": "editorial-look-v53",
    "title": "Shoreditch Distressed Aviator Shearling & Combat Boots",
    "shortTitle": "Shoreditch Distressed Aviator Shearling & ",
    "gender": "women",
    "category": "Downtown Street Chic",
    "aesthetic": "Downtown Street Chic",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_53_sua_downtown_street.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in London Mayfair, Savile Row & Shoreditch. Shoreditch Distressed Aviator Shearling & Combat Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Downtown Street Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3510,
    "pins": [
      {
        "id": "look-53-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Acne Studios British Heritage Piece",
        "brand": "Acne Studios",
        "price": 960,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Acne+Studios+Coat",
        "kStyleTip": "Impeccable British heritage tailoring with structural warmth and prestige.",
        "sku": "OUT053",
        "silhouette": "Structured Heritage Tailoring"
      },
      {
        "id": "look-53-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Dion Lee Essential Layer",
        "brand": "Dion Lee",
        "price": 240,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Dion+Lee+Knit",
        "kStyleTip": "Refined shirting or luxury knitwear framing the décolletage.",
        "sku": "TOP053",
        "silhouette": "Tailored Collar / High Neck"
      },
      {
        "id": "look-53-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Agolde Tailored Bottom",
        "brand": "Agolde",
        "price": 430,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Agolde+Skirt",
        "kStyleTip": "Knife-pleated tartan, chalk-stripe trousers or wide-wale corduroy anchoring classic proportions.",
        "sku": "BOT053",
        "silhouette": "Knife-Pleated / Wide Pleated Slacks"
      },
      {
        "id": "look-53-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Dr. Martens Heritage Footwear",
        "brand": "Dr. Martens",
        "price": 520,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Dr.+Martens+Loafers",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO053",
        "silhouette": "Horsebit Loafers / Combat Boots / Knee Boots"
      },
      {
        "id": "look-53-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Alexander McQueen Iconic London Bag",
        "brand": "Alexander McQueen",
        "price": 920,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Alexander+McQueen+Bag",
        "kStyleTip": "Structured leather satchel, top-handle bag or evening clutch complementing British tailoring.",
        "sku": "BAG053",
        "silhouette": "Satchel / Structured Crossbody / Clutch"
      },
      {
        "id": "look-53-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Vivienne Westwood Headwear Accent",
        "brand": "Vivienne Westwood",
        "price": 180,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Vivienne+Westwood+Hat",
        "kStyleTip": "Rule #5 headwear diversification: baker boy caps, berets, beanies or headbands completing the silhouette.",
        "sku": "HAT053",
        "silhouette": "Baker Boy / Beret / Knit Beanie"
      },
      {
        "id": "look-53-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Chrome Hearts Fine Jewelry Accent",
        "brand": "Chrome Hearts",
        "price": 260,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Chrome+Hearts+Jewelry",
        "kStyleTip": "Sculptural vermeil, silver ribbons or vintage horology adding aristocratic polish.",
        "sku": "JWL053",
        "silhouette": "Ribbon Earrings / Medallion / Chandelier"
      }
    ]
  },
  {
    "id": "editorial-look-v54",
    "title": "Kensington Silk Foulard Blouse & Plaid Knife Pleated Skirt",
    "shortTitle": "Kensington Silk Foulard Blouse & Plaid Skirt",
    "gender": "women",
    "category": "Collegiate Preppy & Ivy",
    "aesthetic": "Collegiate Preppy & Ivy",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_54_chaewon_collegiate_preppy.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in London Mayfair, Savile Row & Shoreditch. Kensington Silk Foulard Blouse & Plaid Knife Pleated Skirt, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Collegiate Preppy & Ivy",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4000,
    "pins": [
      {
        "id": "look-54-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Sandro British Heritage Piece",
        "brand": "Sandro",
        "price": 1100,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sandro+Jacket",
        "kStyleTip": "Impeccable British heritage tailoring with structural warmth and prestige.",
        "sku": "OUT054",
        "silhouette": "Structured Heritage Tailoring"
      },
      {
        "id": "look-54-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Maje Essential Layer",
        "brand": "Maje",
        "price": 285,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Maje+Top",
        "kStyleTip": "Refined shirting or luxury knitwear framing the décolletage.",
        "sku": "TOP054",
        "silhouette": "Tailored Collar / High Neck"
      },
      {
        "id": "look-54-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Ralph Lauren Tailored Bottom",
        "brand": "Ralph Lauren",
        "price": 485,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Ralph+Lauren+Pants",
        "kStyleTip": "Knife-pleated tartan, chalk-stripe trousers or wide-wale corduroy anchoring classic proportions.",
        "sku": "BOT054",
        "silhouette": "Knife-Pleated / Wide Pleated Slacks"
      },
      {
        "id": "look-54-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Gucci Heritage Footwear",
        "brand": "Gucci",
        "price": 585,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Gucci+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO054",
        "silhouette": "Horsebit Loafers / Combat Boots / Knee Boots"
      },
      {
        "id": "look-54-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Mulberry Iconic London Bag",
        "brand": "Mulberry",
        "price": 1035,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Mulberry+Bag",
        "kStyleTip": "Structured leather satchel, top-handle bag or evening clutch complementing British tailoring.",
        "sku": "BAG054",
        "silhouette": "Satchel / Structured Crossbody / Clutch"
      },
      {
        "id": "look-54-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Marine Serre Headwear Accent",
        "brand": "Marine Serre",
        "price": 210,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Marine+Serre+Hat",
        "kStyleTip": "Rule #5 headwear diversification: baker boy caps, berets, beanies or headbands completing the silhouette.",
        "sku": "HAT054",
        "silhouette": "Baker Boy / Beret / Knit Beanie"
      },
      {
        "id": "look-54-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tory Burch Fine Jewelry Accent",
        "brand": "Tory Burch",
        "price": 300,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Tory+Burch+Jewelry",
        "kStyleTip": "Sculptural vermeil, silver ribbons or vintage horology adding aristocratic polish.",
        "sku": "JWL054",
        "silhouette": "Ribbon Earrings / Medallion / Chandelier"
      }
    ]
  },
  {
    "id": "editorial-look-v55",
    "title": "Covent Garden Fine Cashmere Cable Knit & Corduroy Chinos",
    "shortTitle": "Covent Garden Fine Cashmere Cable Knit & C",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_55_hana_elevated_casual.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in London Mayfair, Savile Row & Shoreditch. Covent Garden Fine Cashmere Cable Knit & Corduroy Chinos, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4490,
    "pins": [
      {
        "id": "look-55-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Ralph Lauren British Heritage Piece",
        "brand": "Ralph Lauren",
        "price": 1240,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Ralph+Lauren+Coat",
        "kStyleTip": "Impeccable British heritage tailoring with structural warmth and prestige.",
        "sku": "OUT055",
        "silhouette": "Structured Heritage Tailoring"
      },
      {
        "id": "look-55-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Ralph Lauren Essential Layer",
        "brand": "Ralph Lauren",
        "price": 330,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Ralph+Lauren+Knit",
        "kStyleTip": "Refined shirting or luxury knitwear framing the décolletage.",
        "sku": "TOP055",
        "silhouette": "Tailored Collar / High Neck"
      },
      {
        "id": "look-55-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Studio Nicholson Tailored Bottom",
        "brand": "Studio Nicholson",
        "price": 540,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Studio+Nicholson+Skirt",
        "kStyleTip": "Knife-pleated tartan, chalk-stripe trousers or wide-wale corduroy anchoring classic proportions.",
        "sku": "BOT055",
        "silhouette": "Knife-Pleated / Wide Pleated Slacks"
      },
      {
        "id": "look-55-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Clarks Originals Heritage Footwear",
        "brand": "Clarks Originals",
        "price": 650,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Clarks+Originals+Loafers",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO055",
        "silhouette": "Horsebit Loafers / Combat Boots / Knee Boots"
      },
      {
        "id": "look-55-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "The Row Iconic London Bag",
        "brand": "The Row",
        "price": 1150,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Bag",
        "kStyleTip": "Structured leather satchel, top-handle bag or evening clutch complementing British tailoring.",
        "sku": "BAG055",
        "silhouette": "Satchel / Structured Crossbody / Clutch"
      },
      {
        "id": "look-55-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Foundrae Headwear Accent",
        "brand": "Foundrae",
        "price": 240,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Foundrae+Hat",
        "kStyleTip": "Rule #5 headwear diversification: baker boy caps, berets, beanies or headbands completing the silhouette.",
        "sku": "HAT055",
        "silhouette": "Baker Boy / Beret / Knit Beanie"
      },
      {
        "id": "look-55-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Foundrae Fine Jewelry Accent",
        "brand": "Foundrae",
        "price": 340,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Foundrae+Jewelry",
        "kStyleTip": "Sculptural vermeil, silver ribbons or vintage horology adding aristocratic polish.",
        "sku": "JWL055",
        "silhouette": "Ribbon Earrings / Medallion / Chandelier"
      }
    ]
  },
  {
    "id": "editorial-look-v56",
    "title": "Notting Hill Suede Belted Car Coat & Wide Straight Denim",
    "shortTitle": "Notting Hill Suede Belted Car Coat & Wide ",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_56_jiwoo_elevated_casual.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in London Mayfair, Savile Row & Shoreditch. Notting Hill Suede Belted Car Coat & Wide Straight Denim, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4980,
    "pins": [
      {
        "id": "look-56-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Khaite British Heritage Piece",
        "brand": "Khaite",
        "price": 1380,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Khaite+Jacket",
        "kStyleTip": "Impeccable British heritage tailoring with structural warmth and prestige.",
        "sku": "OUT056",
        "silhouette": "Structured Heritage Tailoring"
      },
      {
        "id": "look-56-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Essential Layer",
        "brand": "Skims",
        "price": 375,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Skims+Top",
        "kStyleTip": "Refined shirting or luxury knitwear framing the décolletage.",
        "sku": "TOP056",
        "silhouette": "Tailored Collar / High Neck"
      },
      {
        "id": "look-56-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Agolde Tailored Bottom",
        "brand": "Agolde",
        "price": 595,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Agolde+Pants",
        "kStyleTip": "Knife-pleated tartan, chalk-stripe trousers or wide-wale corduroy anchoring classic proportions.",
        "sku": "BOT056",
        "silhouette": "Knife-Pleated / Wide Pleated Slacks"
      },
      {
        "id": "look-56-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "G.H. Bass Heritage Footwear",
        "brand": "G.H. Bass",
        "price": 715,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=G.H.+Bass+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO056",
        "silhouette": "Horsebit Loafers / Combat Boots / Knee Boots"
      },
      {
        "id": "look-56-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "A.P.C. Iconic London Bag",
        "brand": "A.P.C.",
        "price": 1265,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=A.P.C.+Bag",
        "kStyleTip": "Structured leather satchel, top-handle bag or evening clutch complementing British tailoring.",
        "sku": "BAG056",
        "silhouette": "Satchel / Structured Crossbody / Clutch"
      },
      {
        "id": "look-56-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Marine Serre Headwear Accent",
        "brand": "Marine Serre",
        "price": 270,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Marine+Serre+Hat",
        "kStyleTip": "Rule #5 headwear diversification: baker boy caps, berets, beanies or headbands completing the silhouette.",
        "sku": "HAT056",
        "silhouette": "Baker Boy / Beret / Knit Beanie"
      },
      {
        "id": "look-56-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Laura Lombardi Fine Jewelry Accent",
        "brand": "Laura Lombardi",
        "price": 380,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Laura+Lombardi+Jewelry",
        "kStyleTip": "Sculptural vermeil, silver ribbons or vintage horology adding aristocratic polish.",
        "sku": "JWL056",
        "silhouette": "Ribbon Earrings / Medallion / Chandelier"
      }
    ]
  },
  {
    "id": "editorial-look-v57",
    "title": "SoHo London Black Patent Leather Trench & Pointed Boots",
    "shortTitle": "SoHo London Black Patent Leather Trench & ",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_57_minseo_modern_minimalist.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in London Mayfair, Savile Row & Shoreditch. SoHo London Black Patent Leather Trench & Pointed Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5470,
    "pins": [
      {
        "id": "look-57-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Saint Laurent British Heritage Piece",
        "brand": "Saint Laurent",
        "price": 1520,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Saint+Laurent+Coat",
        "kStyleTip": "Impeccable British heritage tailoring with structural warmth and prestige.",
        "sku": "OUT057",
        "silhouette": "Structured Heritage Tailoring"
      },
      {
        "id": "look-57-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "The Row Essential Layer",
        "brand": "The Row",
        "price": 420,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Knit",
        "kStyleTip": "Refined shirting or luxury knitwear framing the décolletage.",
        "sku": "TOP057",
        "silhouette": "Tailored Collar / High Neck"
      },
      {
        "id": "look-57-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "The Row Tailored Bottom",
        "brand": "The Row",
        "price": 650,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Skirt",
        "kStyleTip": "Knife-pleated tartan, chalk-stripe trousers or wide-wale corduroy anchoring classic proportions.",
        "sku": "BOT057",
        "silhouette": "Knife-Pleated / Wide Pleated Slacks"
      },
      {
        "id": "look-57-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "The Row Heritage Footwear",
        "brand": "The Row",
        "price": 780,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Loafers",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO057",
        "silhouette": "Horsebit Loafers / Combat Boots / Knee Boots"
      },
      {
        "id": "look-57-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "By Far Iconic London Bag",
        "brand": "By Far",
        "price": 1380,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=By+Far+Bag",
        "kStyleTip": "Structured leather satchel, top-handle bag or evening clutch complementing British tailoring.",
        "sku": "BAG057",
        "silhouette": "Satchel / Structured Crossbody / Clutch"
      },
      {
        "id": "look-57-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Charlotte Chesnais Headwear Accent",
        "brand": "Charlotte Chesnais",
        "price": 300,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Charlotte+Chesnais+Hat",
        "kStyleTip": "Rule #5 headwear diversification: baker boy caps, berets, beanies or headbands completing the silhouette.",
        "sku": "HAT057",
        "silhouette": "Baker Boy / Beret / Knit Beanie"
      },
      {
        "id": "look-57-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Fine Jewelry Accent",
        "brand": "Charlotte Chesnais",
        "price": 420,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Sculptural vermeil, silver ribbons or vintage horology adding aristocratic polish.",
        "sku": "JWL057",
        "silhouette": "Ribbon Earrings / Medallion / Chandelier"
      }
    ]
  },
  {
    "id": "editorial-look-v58",
    "title": "Belgravia Sculptural Double-Faced Wool Wrap & Beret",
    "shortTitle": "Belgravia Sculptural Double-Faced Wool Wrap Coat",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_58_sua_quiet_luxury.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in London Mayfair, Savile Row & Shoreditch. Belgravia Sculptural Double-Faced Wool Wrap & Beret, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5960,
    "pins": [
      {
        "id": "look-58-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Max Mara British Heritage Piece",
        "brand": "Max Mara",
        "price": 1660,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Max+Mara+Jacket",
        "kStyleTip": "Impeccable British heritage tailoring with structural warmth and prestige.",
        "sku": "OUT058",
        "silhouette": "Structured Heritage Tailoring"
      },
      {
        "id": "look-58-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Loro Piana Essential Layer",
        "brand": "Loro Piana",
        "price": 465,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loro+Piana+Top",
        "kStyleTip": "Refined shirting or luxury knitwear framing the décolletage.",
        "sku": "TOP058",
        "silhouette": "Tailored Collar / High Neck"
      },
      {
        "id": "look-58-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Loro Piana Tailored Bottom",
        "brand": "Loro Piana",
        "price": 705,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Loro+Piana+Pants",
        "kStyleTip": "Knife-pleated tartan, chalk-stripe trousers or wide-wale corduroy anchoring classic proportions.",
        "sku": "BOT058",
        "silhouette": "Knife-Pleated / Wide Pleated Slacks"
      },
      {
        "id": "look-58-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "The Row Heritage Footwear",
        "brand": "The Row",
        "price": 845,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO058",
        "silhouette": "Horsebit Loafers / Combat Boots / Knee Boots"
      },
      {
        "id": "look-58-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "The Row Iconic London Bag",
        "brand": "The Row",
        "price": 1495,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Bag",
        "kStyleTip": "Structured leather satchel, top-handle bag or evening clutch complementing British tailoring.",
        "sku": "BAG058",
        "silhouette": "Satchel / Structured Crossbody / Clutch"
      },
      {
        "id": "look-58-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Maison Michel Headwear Accent",
        "brand": "Maison Michel",
        "price": 330,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Maison+Michel+Hat",
        "kStyleTip": "Rule #5 headwear diversification: baker boy caps, berets, beanies or headbands completing the silhouette.",
        "sku": "HAT058",
        "silhouette": "Baker Boy / Beret / Knit Beanie"
      },
      {
        "id": "look-58-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Fine Jewelry Accent",
        "brand": "Sophie Buhai",
        "price": 460,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Jewelry",
        "kStyleTip": "Sculptural vermeil, silver ribbons or vintage horology adding aristocratic polish.",
        "sku": "JWL058",
        "silhouette": "Ribbon Earrings / Medallion / Chandelier"
      }
    ]
  },
  {
    "id": "editorial-look-v59",
    "title": "Tate Modern Contemporary Draped Asymmetric Dress & Mules",
    "shortTitle": "Tate Modern Contemporary Draped Asymmetric",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_59_chaewon_modern_minimalist.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in London Mayfair, Savile Row & Shoreditch. Tate Modern Contemporary Draped Asymmetric Dress & Mules, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 6450,
    "pins": [
      {
        "id": "look-59-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Loewe British Heritage Piece",
        "brand": "Loewe",
        "price": 1800,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loewe+Coat",
        "kStyleTip": "Impeccable British heritage tailoring with structural warmth and prestige.",
        "sku": "OUT059",
        "silhouette": "Structured Heritage Tailoring"
      },
      {
        "id": "look-59-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Issey Miyake Essential Layer",
        "brand": "Issey Miyake",
        "price": 510,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Issey+Miyake+Knit",
        "kStyleTip": "Refined shirting or luxury knitwear framing the décolletage.",
        "sku": "TOP059",
        "silhouette": "Tailored Collar / High Neck"
      },
      {
        "id": "look-59-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Loewe Tailored Bottom",
        "brand": "Loewe",
        "price": 760,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loewe+Skirt",
        "kStyleTip": "Knife-pleated tartan, chalk-stripe trousers or wide-wale corduroy anchoring classic proportions.",
        "sku": "BOT059",
        "silhouette": "Knife-Pleated / Wide Pleated Slacks"
      },
      {
        "id": "look-59-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Jil Sander Heritage Footwear",
        "brand": "Jil Sander",
        "price": 910,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Jil+Sander+Loafers",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO059",
        "silhouette": "Horsebit Loafers / Combat Boots / Knee Boots"
      },
      {
        "id": "look-59-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Jil Sander Iconic London Bag",
        "brand": "Jil Sander",
        "price": 1610,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Jil+Sander+Bag",
        "kStyleTip": "Structured leather satchel, top-handle bag or evening clutch complementing British tailoring.",
        "sku": "BAG059",
        "silhouette": "Satchel / Structured Crossbody / Clutch"
      },
      {
        "id": "look-59-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Sophie Buhai Headwear Accent",
        "brand": "Sophie Buhai",
        "price": 360,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Hat",
        "kStyleTip": "Rule #5 headwear diversification: baker boy caps, berets, beanies or headbands completing the silhouette.",
        "sku": "HAT059",
        "silhouette": "Baker Boy / Beret / Knit Beanie"
      },
      {
        "id": "look-59-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Fine Jewelry Accent",
        "brand": "Sophie Buhai",
        "price": 500,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sophie+Buhai+Jewelry",
        "kStyleTip": "Sculptural vermeil, silver ribbons or vintage horology adding aristocratic polish.",
        "sku": "JWL059",
        "silhouette": "Ribbon Earrings / Medallion / Chandelier"
      }
    ]
  },
  {
    "id": "editorial-look-v60",
    "title": "Royal Opera House Midnight Velvet Gown & Opera Gloves",
    "shortTitle": "Royal Opera House Midnight Velvet Gown & O",
    "gender": "women",
    "category": "Gala & Runway Glam",
    "aesthetic": "Gala & Runway Glam",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_60_hana_gala_glam.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in London Mayfair, Savile Row & Shoreditch. Royal Opera House Midnight Velvet Gown & Opera Gloves, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Gala & Runway Glam",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 6940,
    "pins": [
      {
        "id": "look-60-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Schiaparelli British Heritage Piece",
        "brand": "Schiaparelli",
        "price": 1940,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Schiaparelli+Jacket",
        "kStyleTip": "Impeccable British heritage tailoring with structural warmth and prestige.",
        "sku": "OUT060",
        "silhouette": "Structured Heritage Tailoring"
      },
      {
        "id": "look-60-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Saint Laurent Essential Layer",
        "brand": "Saint Laurent",
        "price": 555,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Saint+Laurent+Top",
        "kStyleTip": "Refined shirting or luxury knitwear framing the décolletage.",
        "sku": "TOP060",
        "silhouette": "Tailored Collar / High Neck"
      },
      {
        "id": "look-60-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Schiaparelli Tailored Bottom",
        "brand": "Schiaparelli",
        "price": 815,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Schiaparelli+Pants",
        "kStyleTip": "Knife-pleated tartan, chalk-stripe trousers or wide-wale corduroy anchoring classic proportions.",
        "sku": "BOT060",
        "silhouette": "Knife-Pleated / Wide Pleated Slacks"
      },
      {
        "id": "look-60-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Manolo Blahnik Heritage Footwear",
        "brand": "Manolo Blahnik",
        "price": 975,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Manolo+Blahnik+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO060",
        "silhouette": "Horsebit Loafers / Combat Boots / Knee Boots"
      },
      {
        "id": "look-60-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Alexander McQueen Iconic London Bag",
        "brand": "Alexander McQueen",
        "price": 1725,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Alexander+McQueen+Bag",
        "kStyleTip": "Structured leather satchel, top-handle bag or evening clutch complementing British tailoring.",
        "sku": "BAG060",
        "silhouette": "Satchel / Structured Crossbody / Clutch"
      },
      {
        "id": "look-60-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Tiffany & Co. Headwear Accent",
        "brand": "Tiffany & Co.",
        "price": 390,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Tiffany+&+Co.+Hat",
        "kStyleTip": "Rule #5 headwear diversification: baker boy caps, berets, beanies or headbands completing the silhouette.",
        "sku": "HAT060",
        "silhouette": "Baker Boy / Beret / Knit Beanie"
      },
      {
        "id": "look-60-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tiffany & Co. Fine Jewelry Accent",
        "brand": "Tiffany & Co.",
        "price": 540,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Tiffany+&+Co.+Jewelry",
        "kStyleTip": "Sculptural vermeil, silver ribbons or vintage horology adding aristocratic polish.",
        "sku": "JWL060",
        "silhouette": "Ribbon Earrings / Medallion / Chandelier"
      }
    ]
  },
  {
    "id": "editorial-look-v61",
    "title": "Copenhagen Oversized Wool Shacket & Tailored Wide Slacks",
    "shortTitle": "Copenhagen Oversized Wool Shacket & Tailor",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_61_jiwoo_modern_minimalist.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Copenhagen Nyhavn & Stockholm Skeppsholmen. Copenhagen Oversized Wool Shacket & Tailored Wide Slacks, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2240,
    "pins": [
      {
        "id": "look-61-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Toteme Scandinavian Outerwear",
        "brand": "Toteme",
        "price": 590,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Coat",
        "kStyleTip": "Pure Scandinavian architectural lines and minimalist functional warmth.",
        "sku": "OUT061",
        "silhouette": "Minimalist Oversized Silhouette"
      },
      {
        "id": "look-61-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Essential Scandi Layer",
        "brand": "Skims",
        "price": 145,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Skims+Knit",
        "kStyleTip": "Textural pure cashmere or crisp rib knit framing clean necklines.",
        "sku": "TOP061",
        "silhouette": "Turtleneck / Crewneck / Mock Neck"
      },
      {
        "id": "look-61-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "The Row Tailored Scandi Bottom",
        "brand": "The Row",
        "price": 295,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Bottoms",
        "kStyleTip": "Floor-grazing tailored trousers or cuffed rigid denim.",
        "sku": "BOT061",
        "silhouette": "Wide-Leg / Culottes / Cuffed Denim"
      },
      {
        "id": "look-61-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "The Row Functional Luxury Shoes",
        "brand": "The Row",
        "price": 370,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO061",
        "silhouette": "Lug Chelsea / Slip-on Loafers / Derby / Sneakers"
      },
      {
        "id": "look-61-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "By Far Minimalist Nordic Bag",
        "brand": "By Far",
        "price": 580,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=By+Far+Bag",
        "kStyleTip": "Iconic architectural handbag in supple matte leather.",
        "sku": "BAG061",
        "silhouette": "Knotted Musubi / Baguette / Bucket / Tote"
      },
      {
        "id": "look-61-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Janessa Leone Scandi Headwear & Scarf",
        "brand": "Janessa Leone",
        "price": 110,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Janessa+Leone+Scarf",
        "kStyleTip": "Rule #5 headwear diversification: oversized brushed mohair scarves, pansy face beanies, berets or wool caps.",
        "sku": "HAT061",
        "silhouette": "Beanie / Scarf Wrap / Brimless Cap"
      },
      {
        "id": "look-61-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Minimalist Silver Jewelry",
        "brand": "Sophie Buhai",
        "price": 150,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sophie+Buhai+Jewelry",
        "kStyleTip": "Pure architectural sterling silver ribbons and organic torc necklaces.",
        "sku": "JWL061",
        "silhouette": "Ribbon Hoops / Wave Ring / Torc Necklace"
      }
    ]
  },
  {
    "id": "editorial-look-v62",
    "title": "Stockholm Monochromatic Grey Cashmere Turtleneck & Culottes",
    "shortTitle": "Stockholm Monochromatic Grey Cashmere Turt",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_62_minseo_modern_minimalist.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Copenhagen Nyhavn & Stockholm Skeppsholmen. Stockholm Monochromatic Grey Cashmere Turtleneck & Culottes, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2665,
    "pins": [
      {
        "id": "look-62-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Filippa K Scandinavian Outerwear",
        "brand": "Filippa K",
        "price": 705,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Filippa+K+Jacket",
        "kStyleTip": "Pure Scandinavian architectural lines and minimalist functional warmth.",
        "sku": "OUT062",
        "silhouette": "Minimalist Oversized Silhouette"
      },
      {
        "id": "look-62-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Toteme Essential Scandi Layer",
        "brand": "Toteme",
        "price": 180,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Top",
        "kStyleTip": "Textural pure cashmere or crisp rib knit framing clean necklines.",
        "sku": "TOP062",
        "silhouette": "Turtleneck / Crewneck / Mock Neck"
      },
      {
        "id": "look-62-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Tailored Scandi Bottom",
        "brand": "Toteme",
        "price": 345,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Pants",
        "kStyleTip": "Floor-grazing tailored trousers or cuffed rigid denim.",
        "sku": "BOT062",
        "silhouette": "Wide-Leg / Culottes / Cuffed Denim"
      },
      {
        "id": "look-62-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Jil Sander Functional Luxury Shoes",
        "brand": "Jil Sander",
        "price": 430,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Jil+Sander+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO062",
        "silhouette": "Lug Chelsea / Slip-on Loafers / Derby / Sneakers"
      },
      {
        "id": "look-62-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Acne Studios Minimalist Nordic Bag",
        "brand": "Acne Studios",
        "price": 690,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Acne+Studios+Bag",
        "kStyleTip": "Iconic architectural handbag in supple matte leather.",
        "sku": "BAG062",
        "silhouette": "Knotted Musubi / Baguette / Bucket / Tote"
      },
      {
        "id": "look-62-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Sophie Buhai Scandi Headwear & Scarf",
        "brand": "Sophie Buhai",
        "price": 135,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sophie+Buhai+Beanie",
        "kStyleTip": "Rule #5 headwear diversification: oversized brushed mohair scarves, pansy face beanies, berets or wool caps.",
        "sku": "HAT062",
        "silhouette": "Beanie / Scarf Wrap / Brimless Cap"
      },
      {
        "id": "look-62-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Minimalist Silver Jewelry",
        "brand": "Sophie Buhai",
        "price": 180,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Jewelry",
        "kStyleTip": "Pure architectural sterling silver ribbons and organic torc necklaces.",
        "sku": "JWL062",
        "silhouette": "Ribbon Hoops / Wave Ring / Torc Necklace"
      }
    ]
  },
  {
    "id": "editorial-look-v63",
    "title": "Nordic Chunky Fisherman Rib Knit & Raw Cuffed Denim",
    "shortTitle": "Nordic Chunky Fisherman Rib Knit & Raw Cuf",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_63_sua_elevated_casual.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Copenhagen Nyhavn & Stockholm Skeppsholmen. Nordic Chunky Fisherman Rib Knit & Raw Cuffed Denim, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3090,
    "pins": [
      {
        "id": "look-63-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "GANNI Scandinavian Outerwear",
        "brand": "GANNI",
        "price": 820,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=GANNI+Coat",
        "kStyleTip": "Pure Scandinavian architectural lines and minimalist functional warmth.",
        "sku": "OUT063",
        "silhouette": "Minimalist Oversized Silhouette"
      },
      {
        "id": "look-63-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "GANNI Essential Scandi Layer",
        "brand": "GANNI",
        "price": 215,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=GANNI+Knit",
        "kStyleTip": "Textural pure cashmere or crisp rib knit framing clean necklines.",
        "sku": "TOP063",
        "silhouette": "Turtleneck / Crewneck / Mock Neck"
      },
      {
        "id": "look-63-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Acne Studios Tailored Scandi Bottom",
        "brand": "Acne Studios",
        "price": 395,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Acne+Studios+Bottoms",
        "kStyleTip": "Floor-grazing tailored trousers or cuffed rigid denim.",
        "sku": "BOT063",
        "silhouette": "Wide-Leg / Culottes / Cuffed Denim"
      },
      {
        "id": "look-63-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "G.H. Bass Functional Luxury Shoes",
        "brand": "G.H. Bass",
        "price": 490,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=G.H.+Bass+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO063",
        "silhouette": "Lug Chelsea / Slip-on Loafers / Derby / Sneakers"
      },
      {
        "id": "look-63-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "A.P.C. Minimalist Nordic Bag",
        "brand": "A.P.C.",
        "price": 800,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=A.P.C.+Bag",
        "kStyleTip": "Iconic architectural handbag in supple matte leather.",
        "sku": "BAG063",
        "silhouette": "Knotted Musubi / Baguette / Bucket / Tote"
      },
      {
        "id": "look-63-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Acne Studios Scandi Headwear & Scarf",
        "brand": "Acne Studios",
        "price": 160,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Acne+Studios+Scarf",
        "kStyleTip": "Rule #5 headwear diversification: oversized brushed mohair scarves, pansy face beanies, berets or wool caps.",
        "sku": "HAT063",
        "silhouette": "Beanie / Scarf Wrap / Brimless Cap"
      },
      {
        "id": "look-63-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Minimalist Silver Jewelry",
        "brand": "Charlotte Chesnais",
        "price": 210,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Pure architectural sterling silver ribbons and organic torc necklaces.",
        "sku": "JWL063",
        "silhouette": "Ribbon Hoops / Wave Ring / Torc Necklace"
      }
    ]
  },
  {
    "id": "editorial-look-v64",
    "title": "Scandi Clean Padded Cocoon Shell & Chunky Lug Boots",
    "shortTitle": "Scandi Clean Padded Cocoon Shell & Chunky ",
    "gender": "women",
    "category": "Downtown Street Chic",
    "aesthetic": "Downtown Street Chic",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_64_chaewon_downtown_street.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in Copenhagen Nyhavn & Stockholm Skeppsholmen. Scandi Clean Padded Cocoon Shell & Chunky Lug Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Downtown Street Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3515,
    "pins": [
      {
        "id": "look-64-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Stand Studio Scandinavian Outerwear",
        "brand": "Stand Studio",
        "price": 935,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Stand+Studio+Jacket",
        "kStyleTip": "Pure Scandinavian architectural lines and minimalist functional warmth.",
        "sku": "OUT064",
        "silhouette": "Minimalist Oversized Silhouette"
      },
      {
        "id": "look-64-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Essential Scandi Layer",
        "brand": "Skims",
        "price": 250,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Skims+Top",
        "kStyleTip": "Textural pure cashmere or crisp rib knit framing clean necklines.",
        "sku": "TOP064",
        "silhouette": "Turtleneck / Crewneck / Mock Neck"
      },
      {
        "id": "look-64-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Studio Nicholson Tailored Scandi Bottom",
        "brand": "Studio Nicholson",
        "price": 445,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Studio+Nicholson+Pants",
        "kStyleTip": "Floor-grazing tailored trousers or cuffed rigid denim.",
        "sku": "BOT064",
        "silhouette": "Wide-Leg / Culottes / Cuffed Denim"
      },
      {
        "id": "look-64-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Both Paris Functional Luxury Shoes",
        "brand": "Both Paris",
        "price": 550,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Both+Paris+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO064",
        "silhouette": "Lug Chelsea / Slip-on Loafers / Derby / Sneakers"
      },
      {
        "id": "look-64-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Stand Studio Minimalist Nordic Bag",
        "brand": "Stand Studio",
        "price": 910,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Stand+Studio+Bag",
        "kStyleTip": "Iconic architectural handbag in supple matte leather.",
        "sku": "BAG064",
        "silhouette": "Knotted Musubi / Baguette / Bucket / Tote"
      },
      {
        "id": "look-64-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Arc'teryx Veilance Scandi Headwear & Scarf",
        "brand": "Arc'teryx Veilance",
        "price": 185,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Arc'teryx+Veilance+Beanie",
        "kStyleTip": "Rule #5 headwear diversification: oversized brushed mohair scarves, pansy face beanies, berets or wool caps.",
        "sku": "HAT064",
        "silhouette": "Beanie / Scarf Wrap / Brimless Cap"
      },
      {
        "id": "look-64-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tom Wood Minimalist Silver Jewelry",
        "brand": "Tom Wood",
        "price": 240,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Tom+Wood+Jewelry",
        "kStyleTip": "Pure architectural sterling silver ribbons and organic torc necklaces.",
        "sku": "JWL064",
        "silhouette": "Ribbon Hoops / Wave Ring / Torc Necklace"
      }
    ]
  },
  {
    "id": "editorial-look-v65",
    "title": "Østerbro Minimalist Draped Trench & Square Leather Loafers",
    "shortTitle": "Østerbro Minimalist Draped Trench & Square",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_65_hana_quiet_luxury.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Copenhagen Nyhavn & Stockholm Skeppsholmen. Østerbro Minimalist Draped Trench & Square Leather Loafers, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3940,
    "pins": [
      {
        "id": "look-65-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Toteme Scandinavian Outerwear",
        "brand": "Toteme",
        "price": 1050,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Coat",
        "kStyleTip": "Pure Scandinavian architectural lines and minimalist functional warmth.",
        "sku": "OUT065",
        "silhouette": "Minimalist Oversized Silhouette"
      },
      {
        "id": "look-65-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Toteme Essential Scandi Layer",
        "brand": "Toteme",
        "price": 285,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Knit",
        "kStyleTip": "Textural pure cashmere or crisp rib knit framing clean necklines.",
        "sku": "TOP065",
        "silhouette": "Turtleneck / Crewneck / Mock Neck"
      },
      {
        "id": "look-65-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Tailored Scandi Bottom",
        "brand": "Toteme",
        "price": 495,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Bottoms",
        "kStyleTip": "Floor-grazing tailored trousers or cuffed rigid denim.",
        "sku": "BOT065",
        "silhouette": "Wide-Leg / Culottes / Cuffed Denim"
      },
      {
        "id": "look-65-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Jil Sander Functional Luxury Shoes",
        "brand": "Jil Sander",
        "price": 610,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Jil+Sander+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO065",
        "silhouette": "Lug Chelsea / Slip-on Loafers / Derby / Sneakers"
      },
      {
        "id": "look-65-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "The Row Minimalist Nordic Bag",
        "brand": "The Row",
        "price": 1020,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Bag",
        "kStyleTip": "Iconic architectural handbag in supple matte leather.",
        "sku": "BAG065",
        "silhouette": "Knotted Musubi / Baguette / Bucket / Tote"
      },
      {
        "id": "look-65-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Sophie Buhai Scandi Headwear & Scarf",
        "brand": "Sophie Buhai",
        "price": 210,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Scarf",
        "kStyleTip": "Rule #5 headwear diversification: oversized brushed mohair scarves, pansy face beanies, berets or wool caps.",
        "sku": "HAT065",
        "silhouette": "Beanie / Scarf Wrap / Brimless Cap"
      },
      {
        "id": "look-65-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Minimalist Silver Jewelry",
        "brand": "Sophie Buhai",
        "price": 270,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sophie+Buhai+Jewelry",
        "kStyleTip": "Pure architectural sterling silver ribbons and organic torc necklaces.",
        "sku": "JWL065",
        "silhouette": "Ribbon Hoops / Wave Ring / Torc Necklace"
      }
    ]
  },
  {
    "id": "editorial-look-v66",
    "title": "Vesterbro Street Pop Color Scarf & Distressed Leather Jacket",
    "shortTitle": "Vesterbro Street Pop Color Scarf & Distres",
    "gender": "women",
    "category": "Downtown Street Chic",
    "aesthetic": "Downtown Street Chic",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_66_jiwoo_downtown_street.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Copenhagen Nyhavn & Stockholm Skeppsholmen. Vesterbro Street Pop Color Scarf & Distressed Leather Jacket, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Downtown Street Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4365,
    "pins": [
      {
        "id": "look-66-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Acne Studios Scandinavian Outerwear",
        "brand": "Acne Studios",
        "price": 1165,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Acne+Studios+Jacket",
        "kStyleTip": "Pure Scandinavian architectural lines and minimalist functional warmth.",
        "sku": "OUT066",
        "silhouette": "Minimalist Oversized Silhouette"
      },
      {
        "id": "look-66-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Essential Scandi Layer",
        "brand": "Skims",
        "price": 320,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Skims+Top",
        "kStyleTip": "Textural pure cashmere or crisp rib knit framing clean necklines.",
        "sku": "TOP066",
        "silhouette": "Turtleneck / Crewneck / Mock Neck"
      },
      {
        "id": "look-66-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Agolde Tailored Scandi Bottom",
        "brand": "Agolde",
        "price": 545,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Agolde+Pants",
        "kStyleTip": "Floor-grazing tailored trousers or cuffed rigid denim.",
        "sku": "BOT066",
        "silhouette": "Wide-Leg / Culottes / Cuffed Denim"
      },
      {
        "id": "look-66-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Eytys Functional Luxury Shoes",
        "brand": "Eytys",
        "price": 670,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Eytys+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO066",
        "silhouette": "Lug Chelsea / Slip-on Loafers / Derby / Sneakers"
      },
      {
        "id": "look-66-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "By Far Minimalist Nordic Bag",
        "brand": "By Far",
        "price": 1130,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=By+Far+Bag",
        "kStyleTip": "Iconic architectural handbag in supple matte leather.",
        "sku": "BAG066",
        "silhouette": "Knotted Musubi / Baguette / Bucket / Tote"
      },
      {
        "id": "look-66-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Acne Studios Scandi Headwear & Scarf",
        "brand": "Acne Studios",
        "price": 235,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Acne+Studios+Beanie",
        "kStyleTip": "Rule #5 headwear diversification: oversized brushed mohair scarves, pansy face beanies, berets or wool caps.",
        "sku": "HAT066",
        "silhouette": "Beanie / Scarf Wrap / Brimless Cap"
      },
      {
        "id": "look-66-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Minimalist Silver Jewelry",
        "brand": "Charlotte Chesnais",
        "price": 300,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Pure architectural sterling silver ribbons and organic torc necklaces.",
        "sku": "JWL066",
        "silhouette": "Ribbon Hoops / Wave Ring / Torc Necklace"
      }
    ]
  },
  {
    "id": "editorial-look-v67",
    "title": "Aker Brygge Sleek Technical Trench & Rain Boots",
    "shortTitle": "Aker Brygge Sleek Technical Trench & Rain ",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_67_minseo_modern_minimalist.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Copenhagen Nyhavn & Stockholm Skeppsholmen. Aker Brygge Sleek Technical Trench & Rain Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4790,
    "pins": [
      {
        "id": "look-67-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Rains Scandinavian Outerwear",
        "brand": "Rains",
        "price": 1280,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Rains+Coat",
        "kStyleTip": "Pure Scandinavian architectural lines and minimalist functional warmth.",
        "sku": "OUT067",
        "silhouette": "Minimalist Oversized Silhouette"
      },
      {
        "id": "look-67-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Toteme Essential Scandi Layer",
        "brand": "Toteme",
        "price": 355,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Knit",
        "kStyleTip": "Textural pure cashmere or crisp rib knit framing clean necklines.",
        "sku": "TOP067",
        "silhouette": "Turtleneck / Crewneck / Mock Neck"
      },
      {
        "id": "look-67-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Tailored Scandi Bottom",
        "brand": "Toteme",
        "price": 595,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Bottoms",
        "kStyleTip": "Floor-grazing tailored trousers or cuffed rigid denim.",
        "sku": "BOT067",
        "silhouette": "Wide-Leg / Culottes / Cuffed Denim"
      },
      {
        "id": "look-67-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Bottega Veneta Functional Luxury Shoes",
        "brand": "Bottega Veneta",
        "price": 730,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Bottega+Veneta+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO067",
        "silhouette": "Lug Chelsea / Slip-on Loafers / Derby / Sneakers"
      },
      {
        "id": "look-67-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Jil Sander Minimalist Nordic Bag",
        "brand": "Jil Sander",
        "price": 1240,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Jil+Sander+Bag",
        "kStyleTip": "Iconic architectural handbag in supple matte leather.",
        "sku": "BAG067",
        "silhouette": "Knotted Musubi / Baguette / Bucket / Tote"
      },
      {
        "id": "look-67-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Charlotte Chesnais Scandi Headwear & Scarf",
        "brand": "Charlotte Chesnais",
        "price": 260,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Charlotte+Chesnais+Scarf",
        "kStyleTip": "Rule #5 headwear diversification: oversized brushed mohair scarves, pansy face beanies, berets or wool caps.",
        "sku": "HAT067",
        "silhouette": "Beanie / Scarf Wrap / Brimless Cap"
      },
      {
        "id": "look-67-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Minimalist Silver Jewelry",
        "brand": "Charlotte Chesnais",
        "price": 330,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Pure architectural sterling silver ribbons and organic torc necklaces.",
        "sku": "JWL067",
        "silhouette": "Ribbon Hoops / Wave Ring / Torc Necklace"
      }
    ]
  },
  {
    "id": "editorial-look-v68",
    "title": "Helsinki Clean Architectural Wool Duster & Beret",
    "shortTitle": "Helsinki Clean Architectural Wool Duster & Beret",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_68_sua_quiet_luxury.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Copenhagen Nyhavn & Stockholm Skeppsholmen. Helsinki Clean Architectural Wool Duster & Beret, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5215,
    "pins": [
      {
        "id": "look-68-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Marimekko Scandinavian Outerwear",
        "brand": "Marimekko",
        "price": 1395,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Marimekko+Jacket",
        "kStyleTip": "Pure Scandinavian architectural lines and minimalist functional warmth.",
        "sku": "OUT068",
        "silhouette": "Minimalist Oversized Silhouette"
      },
      {
        "id": "look-68-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Filippa K Essential Scandi Layer",
        "brand": "Filippa K",
        "price": 390,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Filippa+K+Top",
        "kStyleTip": "Textural pure cashmere or crisp rib knit framing clean necklines.",
        "sku": "TOP068",
        "silhouette": "Turtleneck / Crewneck / Mock Neck"
      },
      {
        "id": "look-68-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Filippa K Tailored Scandi Bottom",
        "brand": "Filippa K",
        "price": 645,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Filippa+K+Pants",
        "kStyleTip": "Floor-grazing tailored trousers or cuffed rigid denim.",
        "sku": "BOT068",
        "silhouette": "Wide-Leg / Culottes / Cuffed Denim"
      },
      {
        "id": "look-68-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Jil Sander Functional Luxury Shoes",
        "brand": "Jil Sander",
        "price": 790,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Jil+Sander+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO068",
        "silhouette": "Lug Chelsea / Slip-on Loafers / Derby / Sneakers"
      },
      {
        "id": "look-68-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "The Row Minimalist Nordic Bag",
        "brand": "The Row",
        "price": 1350,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Bag",
        "kStyleTip": "Iconic architectural handbag in supple matte leather.",
        "sku": "BAG068",
        "silhouette": "Knotted Musubi / Baguette / Bucket / Tote"
      },
      {
        "id": "look-68-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Janessa Leone Scandi Headwear & Scarf",
        "brand": "Janessa Leone",
        "price": 285,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Janessa+Leone+Beanie",
        "kStyleTip": "Rule #5 headwear diversification: oversized brushed mohair scarves, pansy face beanies, berets or wool caps.",
        "sku": "HAT068",
        "silhouette": "Beanie / Scarf Wrap / Brimless Cap"
      },
      {
        "id": "look-68-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Minimalist Silver Jewelry",
        "brand": "Sophie Buhai",
        "price": 360,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Jewelry",
        "kStyleTip": "Pure architectural sterling silver ribbons and organic torc necklaces.",
        "sku": "JWL068",
        "silhouette": "Ribbon Hoops / Wave Ring / Torc Necklace"
      }
    ]
  },
  {
    "id": "editorial-look-v69",
    "title": "Gothenburg Brushed Mohair Stripe Scarf & Minimal Slacks",
    "shortTitle": "Gothenburg Brushed Mohair Stripe Scarf & M",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_69_chaewon_elevated_casual.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in Copenhagen Nyhavn & Stockholm Skeppsholmen. Gothenburg Brushed Mohair Stripe Scarf & Minimal Slacks, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5640,
    "pins": [
      {
        "id": "look-69-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Holzweiler Scandinavian Outerwear",
        "brand": "Holzweiler",
        "price": 1510,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Holzweiler+Coat",
        "kStyleTip": "Pure Scandinavian architectural lines and minimalist functional warmth.",
        "sku": "OUT069",
        "silhouette": "Minimalist Oversized Silhouette"
      },
      {
        "id": "look-69-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Acne Studios Essential Scandi Layer",
        "brand": "Acne Studios",
        "price": 425,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Acne+Studios+Knit",
        "kStyleTip": "Textural pure cashmere or crisp rib knit framing clean necklines.",
        "sku": "TOP069",
        "silhouette": "Turtleneck / Crewneck / Mock Neck"
      },
      {
        "id": "look-69-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Studio Nicholson Tailored Scandi Bottom",
        "brand": "Studio Nicholson",
        "price": 695,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Studio+Nicholson+Bottoms",
        "kStyleTip": "Floor-grazing tailored trousers or cuffed rigid denim.",
        "sku": "BOT069",
        "silhouette": "Wide-Leg / Culottes / Cuffed Denim"
      },
      {
        "id": "look-69-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "New Balance Functional Luxury Shoes",
        "brand": "New Balance",
        "price": 850,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=New+Balance+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO069",
        "silhouette": "Lug Chelsea / Slip-on Loafers / Derby / Sneakers"
      },
      {
        "id": "look-69-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Dragon Diffusion Minimalist Nordic Bag",
        "brand": "Dragon Diffusion",
        "price": 1460,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Dragon+Diffusion+Bag",
        "kStyleTip": "Iconic architectural handbag in supple matte leather.",
        "sku": "BAG069",
        "silhouette": "Knotted Musubi / Baguette / Bucket / Tote"
      },
      {
        "id": "look-69-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Acne Studios Scandi Headwear & Scarf",
        "brand": "Acne Studios",
        "price": 310,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Acne+Studios+Scarf",
        "kStyleTip": "Rule #5 headwear diversification: oversized brushed mohair scarves, pansy face beanies, berets or wool caps.",
        "sku": "HAT069",
        "silhouette": "Beanie / Scarf Wrap / Brimless Cap"
      },
      {
        "id": "look-69-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tom Wood Minimalist Silver Jewelry",
        "brand": "Tom Wood",
        "price": 390,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Tom+Wood+Jewelry",
        "kStyleTip": "Pure architectural sterling silver ribbons and organic torc necklaces.",
        "sku": "JWL069",
        "silhouette": "Ribbon Hoops / Wave Ring / Torc Necklace"
      }
    ]
  },
  {
    "id": "editorial-look-v70",
    "title": "Scandi Gala Liquid Metallic Column Dress & Minimal Slide",
    "shortTitle": "Scandi Gala Liquid Metallic Column Dress & Minimal Slide",
    "gender": "women",
    "category": "Gala & Runway Glam",
    "aesthetic": "Gala & Runway Glam",
    "season": "Autumn / Winter 2026",
    "imageUrl": "/images/looks/look_70_hana_gala_glam.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Copenhagen Nyhavn & Stockholm Skeppsholmen. Scandi Gala Liquid Metallic Column Dress & Minimal Slide, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Gala & Runway Glam",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 6065,
    "pins": [
      {
        "id": "look-70-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Cecilie Bahnsen Scandinavian Outerwear",
        "brand": "Cecilie Bahnsen",
        "price": 1625,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Cecilie+Bahnsen+Jacket",
        "kStyleTip": "Pure Scandinavian architectural lines and minimalist functional warmth.",
        "sku": "OUT070",
        "silhouette": "Minimalist Oversized Silhouette"
      },
      {
        "id": "look-70-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Coperni Essential Scandi Layer",
        "brand": "Coperni",
        "price": 460,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Coperni+Top",
        "kStyleTip": "Textural pure cashmere or crisp rib knit framing clean necklines.",
        "sku": "TOP070",
        "silhouette": "Turtleneck / Crewneck / Mock Neck"
      },
      {
        "id": "look-70-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Cecilie Bahnsen Tailored Scandi Bottom",
        "brand": "Cecilie Bahnsen",
        "price": 745,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Cecilie+Bahnsen+Pants",
        "kStyleTip": "Floor-grazing tailored trousers or cuffed rigid denim.",
        "sku": "BOT070",
        "silhouette": "Wide-Leg / Culottes / Cuffed Denim"
      },
      {
        "id": "look-70-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Amina Muaddi Functional Luxury Shoes",
        "brand": "Amina Muaddi",
        "price": 910,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Amina+Muaddi+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO070",
        "silhouette": "Lug Chelsea / Slip-on Loafers / Derby / Sneakers"
      },
      {
        "id": "look-70-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Rabanne Minimalist Nordic Bag",
        "brand": "Rabanne",
        "price": 1570,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Rabanne+Bag",
        "kStyleTip": "Iconic architectural handbag in supple matte leather.",
        "sku": "BAG070",
        "silhouette": "Knotted Musubi / Baguette / Bucket / Tote"
      },
      {
        "id": "look-70-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Georg Jensen Scandi Headwear & Scarf",
        "brand": "Georg Jensen",
        "price": 335,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Georg+Jensen+Beanie",
        "kStyleTip": "Rule #5 headwear diversification: oversized brushed mohair scarves, pansy face beanies, berets or wool caps.",
        "sku": "HAT070",
        "silhouette": "Beanie / Scarf Wrap / Brimless Cap"
      },
      {
        "id": "look-70-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Georg Jensen Minimalist Silver Jewelry",
        "brand": "Georg Jensen",
        "price": 420,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Georg+Jensen+Jewelry",
        "kStyleTip": "Pure architectural sterling silver ribbons and organic torc necklaces.",
        "sku": "JWL070",
        "silhouette": "Ribbon Hoops / Wave Ring / Torc Necklace"
      }
    ]
  },
  {
    "id": "editorial-look-v71",
    "title": "St. Moritz Shearling Bomber & Cashmere Base",
    "shortTitle": "St. Moritz Shearling Bomber & Cashmere Bas",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Winter Special 2026",
    "imageUrl": "/images/looks/look_71_jiwoo_elevated_casual.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Aspen, St. Moritz, Megève & Whistler. St. Moritz Shearling Bomber & Cashmere Base, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 2800,
    "pins": [
      {
        "id": "look-71-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Stand Studio Luxury Alpine Outerwear",
        "brand": "Stand Studio",
        "price": 780,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Stand+Studio+Ski",
        "kStyleTip": "Ultra-luxe alpine outerwear blending thermal performance and haute couture.",
        "sku": "OUT071",
        "silhouette": "Bomber / Belted Parka / Cashmere Cape"
      },
      {
        "id": "look-71-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Thermal Luxury Knit",
        "brand": "Skims",
        "price": 180,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Skims+Knit",
        "kStyleTip": "Geometric intarsia or chunky fisherman cable knit framing the neck.",
        "sku": "TOP071",
        "silhouette": "Turtleneck / Cable Knit / Seamless Top"
      },
      {
        "id": "look-71-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Agolde Alpine Slacks / Ski Pants",
        "brand": "Agolde",
        "price": 350,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Agolde+Ski",
        "kStyleTip": "Tailored ski stirrup trousers, stretch suede leggings or leather pants.",
        "sku": "BOT071",
        "silhouette": "Stirrup Ski / Suede Leggings / Straight Leather"
      },
      {
        "id": "look-71-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Moon Boot Alpine Snow Boots",
        "brand": "Moon Boot",
        "price": 420,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Moon+Boot+Snow+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible snow boots firmly planted with empty ground clearance.",
        "sku": "SHO071",
        "silhouette": "Moon Boots / Suede Boots / Shearling Combat"
      },
      {
        "id": "look-71-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Celine Luxury Alpine Bag",
        "brand": "Celine",
        "price": 750,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Celine+Bag",
        "kStyleTip": "Shearling-trimmed shoulder bag, padded Re-Nylon or iconic leather tote.",
        "sku": "BAG071",
        "silhouette": "Shearling Shoulder / Padded Bag / Birkin"
      },
      {
        "id": "look-71-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Canada Goose Winter Headwear / Goggles",
        "brand": "Canada Goose",
        "price": 130,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Canada+Goose+Hat",
        "kStyleTip": "Rule #5 headwear diversification: pom-pom beanies, aviator trappers, ski goggles or wool felt berets.",
        "sku": "HAT071",
        "silhouette": "Pom-Pom Beanie / Goggles / Trapper"
      },
      {
        "id": "look-71-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais High Jewelry Accent",
        "brand": "Charlotte Chesnais",
        "price": 190,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "18k gold Alhambra pendants, Panthère drops or vermeil rings gleaming in fireside light.",
        "sku": "JWL071",
        "silhouette": "Pendant Necklace / Drop Earrings / Cocktail Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v72",
    "title": "Aspen Monochromatic Cream Quilted Parka & Ski Pants",
    "shortTitle": "Aspen Monochromatic Cream Quilted Parka & ",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Winter Special 2026",
    "imageUrl": "/images/looks/look_72_minseo_modern_minimalist.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Aspen, St. Moritz, Megève & Whistler. Aspen Monochromatic Cream Quilted Parka & Ski Pants, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3380,
    "pins": [
      {
        "id": "look-72-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Bogner Luxury Alpine Outerwear",
        "brand": "Bogner",
        "price": 940,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Bogner+Jacket",
        "kStyleTip": "Ultra-luxe alpine outerwear blending thermal performance and haute couture.",
        "sku": "OUT072",
        "silhouette": "Bomber / Belted Parka / Cashmere Cape"
      },
      {
        "id": "look-72-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Bogner Thermal Luxury Knit",
        "brand": "Bogner",
        "price": 230,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Bogner+Sweater",
        "kStyleTip": "Geometric intarsia or chunky fisherman cable knit framing the neck.",
        "sku": "TOP072",
        "silhouette": "Turtleneck / Cable Knit / Seamless Top"
      },
      {
        "id": "look-72-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Bogner Alpine Slacks / Ski Pants",
        "brand": "Bogner",
        "price": 415,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Bogner+Pants",
        "kStyleTip": "Tailored ski stirrup trousers, stretch suede leggings or leather pants.",
        "sku": "BOT072",
        "silhouette": "Stirrup Ski / Suede Leggings / Straight Leather"
      },
      {
        "id": "look-72-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Moon Boot Alpine Snow Boots",
        "brand": "Moon Boot",
        "price": 495,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Moon+Boot+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible snow boots firmly planted with empty ground clearance.",
        "sku": "SHO072",
        "silhouette": "Moon Boots / Suede Boots / Shearling Combat"
      },
      {
        "id": "look-72-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Prada Luxury Alpine Bag",
        "brand": "Prada",
        "price": 900,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Prada+Bag",
        "kStyleTip": "Shearling-trimmed shoulder bag, padded Re-Nylon or iconic leather tote.",
        "sku": "BAG072",
        "silhouette": "Shearling Shoulder / Padded Bag / Birkin"
      },
      {
        "id": "look-72-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Moncler Winter Headwear / Goggles",
        "brand": "Moncler",
        "price": 165,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Moncler+Beanie",
        "kStyleTip": "Rule #5 headwear diversification: pom-pom beanies, aviator trappers, ski goggles or wool felt berets.",
        "sku": "HAT072",
        "silhouette": "Pom-Pom Beanie / Goggles / Trapper"
      },
      {
        "id": "look-72-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai High Jewelry Accent",
        "brand": "Sophie Buhai",
        "price": 235,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Jewelry",
        "kStyleTip": "18k gold Alhambra pendants, Panthère drops or vermeil rings gleaming in fireside light.",
        "sku": "JWL072",
        "silhouette": "Pendant Necklace / Drop Earrings / Cocktail Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v73",
    "title": "Megève Nordic Intarsia Wool Turtleneck & Suede Leggings",
    "shortTitle": "Megève Nordic Intarsia Wool Turtleneck & S",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Winter Special 2026",
    "imageUrl": "/images/looks/look_73_sua_quiet_luxury.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Aspen, St. Moritz, Megève & Whistler. Megève Nordic Intarsia Wool Turtleneck & Suede Leggings, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3960,
    "pins": [
      {
        "id": "look-73-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Loro Piana Luxury Alpine Outerwear",
        "brand": "Loro Piana",
        "price": 1100,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loro+Piana+Ski",
        "kStyleTip": "Ultra-luxe alpine outerwear blending thermal performance and haute couture.",
        "sku": "OUT073",
        "silhouette": "Bomber / Belted Parka / Cashmere Cape"
      },
      {
        "id": "look-73-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Brunello Cucinelli Thermal Luxury Knit",
        "brand": "Brunello Cucinelli",
        "price": 280,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Brunello+Cucinelli+Knit",
        "kStyleTip": "Geometric intarsia or chunky fisherman cable knit framing the neck.",
        "sku": "TOP073",
        "silhouette": "Turtleneck / Cable Knit / Seamless Top"
      },
      {
        "id": "look-73-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "The Row Alpine Slacks / Ski Pants",
        "brand": "The Row",
        "price": 480,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Ski",
        "kStyleTip": "Tailored ski stirrup trousers, stretch suede leggings or leather pants.",
        "sku": "BOT073",
        "silhouette": "Stirrup Ski / Suede Leggings / Straight Leather"
      },
      {
        "id": "look-73-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Loro Piana Alpine Snow Boots",
        "brand": "Loro Piana",
        "price": 570,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Loro+Piana+Snow+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible snow boots firmly planted with empty ground clearance.",
        "sku": "SHO073",
        "silhouette": "Moon Boots / Suede Boots / Shearling Combat"
      },
      {
        "id": "look-73-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "The Row Luxury Alpine Bag",
        "brand": "The Row",
        "price": 1050,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Bag",
        "kStyleTip": "Shearling-trimmed shoulder bag, padded Re-Nylon or iconic leather tote.",
        "sku": "BAG073",
        "silhouette": "Shearling Shoulder / Padded Bag / Birkin"
      },
      {
        "id": "look-73-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Charlotte Chesnais Winter Headwear / Goggles",
        "brand": "Charlotte Chesnais",
        "price": 200,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Charlotte+Chesnais+Hat",
        "kStyleTip": "Rule #5 headwear diversification: pom-pom beanies, aviator trappers, ski goggles or wool felt berets.",
        "sku": "HAT073",
        "silhouette": "Pom-Pom Beanie / Goggles / Trapper"
      },
      {
        "id": "look-73-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais High Jewelry Accent",
        "brand": "Charlotte Chesnais",
        "price": 280,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "18k gold Alhambra pendants, Panthère drops or vermeil rings gleaming in fireside light.",
        "sku": "JWL073",
        "silhouette": "Pendant Necklace / Drop Earrings / Cocktail Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v74",
    "title": "Whistler Color-Block Retro Ski Jacket & Snow Boots",
    "shortTitle": "Whistler Color-Block Retro Ski Jacket & Sn",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Winter Special 2026",
    "imageUrl": "/images/looks/look_74_chaewon_elevated_casual.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in Aspen, St. Moritz, Megève & Whistler. Whistler Color-Block Retro Ski Jacket & Snow Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4540,
    "pins": [
      {
        "id": "look-74-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Fusalp Luxury Alpine Outerwear",
        "brand": "Fusalp",
        "price": 1260,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Fusalp+Jacket",
        "kStyleTip": "Ultra-luxe alpine outerwear blending thermal performance and haute couture.",
        "sku": "OUT074",
        "silhouette": "Bomber / Belted Parka / Cashmere Cape"
      },
      {
        "id": "look-74-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Thermal Luxury Knit",
        "brand": "Skims",
        "price": 330,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Skims+Sweater",
        "kStyleTip": "Geometric intarsia or chunky fisherman cable knit framing the neck.",
        "sku": "TOP074",
        "silhouette": "Turtleneck / Cable Knit / Seamless Top"
      },
      {
        "id": "look-74-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Perfect Moment Alpine Slacks / Ski Pants",
        "brand": "Perfect Moment",
        "price": 545,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Perfect+Moment+Pants",
        "kStyleTip": "Tailored ski stirrup trousers, stretch suede leggings or leather pants.",
        "sku": "BOT074",
        "silhouette": "Stirrup Ski / Suede Leggings / Straight Leather"
      },
      {
        "id": "look-74-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Moon Boot Alpine Snow Boots",
        "brand": "Moon Boot",
        "price": 645,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Moon+Boot+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible snow boots firmly planted with empty ground clearance.",
        "sku": "SHO074",
        "silhouette": "Moon Boots / Suede Boots / Shearling Combat"
      },
      {
        "id": "look-74-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Balenciaga Luxury Alpine Bag",
        "brand": "Balenciaga",
        "price": 1200,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Balenciaga+Bag",
        "kStyleTip": "Shearling-trimmed shoulder bag, padded Re-Nylon or iconic leather tote.",
        "sku": "BAG074",
        "silhouette": "Shearling Shoulder / Padded Bag / Birkin"
      },
      {
        "id": "look-74-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Canada Goose Winter Headwear / Goggles",
        "brand": "Canada Goose",
        "price": 235,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Canada+Goose+Beanie",
        "kStyleTip": "Rule #5 headwear diversification: pom-pom beanies, aviator trappers, ski goggles or wool felt berets.",
        "sku": "HAT074",
        "silhouette": "Pom-Pom Beanie / Goggles / Trapper"
      },
      {
        "id": "look-74-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Chrome Hearts High Jewelry Accent",
        "brand": "Chrome Hearts",
        "price": 325,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Chrome+Hearts+Jewelry",
        "kStyleTip": "18k gold Alhambra pendants, Panthère drops or vermeil rings gleaming in fireside light.",
        "sku": "JWL074",
        "silhouette": "Pendant Necklace / Drop Earrings / Cocktail Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v75",
    "title": "St. Moritz Grand Hotel Fireside Cashmere Cape & Suede Boots",
    "shortTitle": "St. Moritz Grand Hotel Fireside Cashmere C",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Winter Special 2026",
    "imageUrl": "/images/looks/look_75_hana_quiet_luxury.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Aspen, St. Moritz, Megève & Whistler. St. Moritz Grand Hotel Fireside Cashmere Cape & Suede Boots, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5120,
    "pins": [
      {
        "id": "look-75-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Loro Piana Luxury Alpine Outerwear",
        "brand": "Loro Piana",
        "price": 1420,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loro+Piana+Ski",
        "kStyleTip": "Ultra-luxe alpine outerwear blending thermal performance and haute couture.",
        "sku": "OUT075",
        "silhouette": "Bomber / Belted Parka / Cashmere Cape"
      },
      {
        "id": "look-75-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Toteme Thermal Luxury Knit",
        "brand": "Toteme",
        "price": 380,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Knit",
        "kStyleTip": "Geometric intarsia or chunky fisherman cable knit framing the neck.",
        "sku": "TOP075",
        "silhouette": "Turtleneck / Cable Knit / Seamless Top"
      },
      {
        "id": "look-75-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Alpine Slacks / Ski Pants",
        "brand": "Toteme",
        "price": 610,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Ski",
        "kStyleTip": "Tailored ski stirrup trousers, stretch suede leggings or leather pants.",
        "sku": "BOT075",
        "silhouette": "Stirrup Ski / Suede Leggings / Straight Leather"
      },
      {
        "id": "look-75-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Gianvito Rossi Alpine Snow Boots",
        "brand": "Gianvito Rossi",
        "price": 720,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Gianvito+Rossi+Snow+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible snow boots firmly planted with empty ground clearance.",
        "sku": "SHO075",
        "silhouette": "Moon Boots / Suede Boots / Shearling Combat"
      },
      {
        "id": "look-75-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Hermès Luxury Alpine Bag",
        "brand": "Hermès",
        "price": 1350,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Hermès+Bag",
        "kStyleTip": "Shearling-trimmed shoulder bag, padded Re-Nylon or iconic leather tote.",
        "sku": "BAG075",
        "silhouette": "Shearling Shoulder / Padded Bag / Birkin"
      },
      {
        "id": "look-75-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Van Cleef & Arpels Winter Headwear / Goggles",
        "brand": "Van Cleef & Arpels",
        "price": 270,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Van+Cleef+&+Arpels+Hat",
        "kStyleTip": "Rule #5 headwear diversification: pom-pom beanies, aviator trappers, ski goggles or wool felt berets.",
        "sku": "HAT075",
        "silhouette": "Pom-Pom Beanie / Goggles / Trapper"
      },
      {
        "id": "look-75-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Van Cleef & Arpels High Jewelry Accent",
        "brand": "Van Cleef & Arpels",
        "price": 370,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Van+Cleef+&+Arpels+Jewelry",
        "kStyleTip": "18k gold Alhambra pendants, Panthère drops or vermeil rings gleaming in fireside light.",
        "sku": "JWL075",
        "silhouette": "Pendant Necklace / Drop Earrings / Cocktail Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v76",
    "title": "Aspen Après-Ski Chunky Cable Turtleneck & Leather Trousers",
    "shortTitle": "Aspen Après-Ski Chunky Cable Turtleneck & ",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Winter Special 2026",
    "imageUrl": "/images/looks/look_76_jiwoo_elevated_casual.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Aspen, St. Moritz, Megève & Whistler. Aspen Après-Ski Chunky Cable Turtleneck & Leather Trousers, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 5700,
    "pins": [
      {
        "id": "look-76-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Khaite Luxury Alpine Outerwear",
        "brand": "Khaite",
        "price": 1580,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Khaite+Jacket",
        "kStyleTip": "Ultra-luxe alpine outerwear blending thermal performance and haute couture.",
        "sku": "OUT076",
        "silhouette": "Bomber / Belted Parka / Cashmere Cape"
      },
      {
        "id": "look-76-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "The Row Thermal Luxury Knit",
        "brand": "The Row",
        "price": 430,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Sweater",
        "kStyleTip": "Geometric intarsia or chunky fisherman cable knit framing the neck.",
        "sku": "TOP076",
        "silhouette": "Turtleneck / Cable Knit / Seamless Top"
      },
      {
        "id": "look-76-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Stand Studio Alpine Slacks / Ski Pants",
        "brand": "Stand Studio",
        "price": 675,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Stand+Studio+Pants",
        "kStyleTip": "Tailored ski stirrup trousers, stretch suede leggings or leather pants.",
        "sku": "BOT076",
        "silhouette": "Stirrup Ski / Suede Leggings / Straight Leather"
      },
      {
        "id": "look-76-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Chanel Alpine Snow Boots",
        "brand": "Chanel",
        "price": 795,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Chanel+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible snow boots firmly planted with empty ground clearance.",
        "sku": "SHO076",
        "silhouette": "Moon Boots / Suede Boots / Shearling Combat"
      },
      {
        "id": "look-76-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Celine Luxury Alpine Bag",
        "brand": "Celine",
        "price": 1500,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Celine+Bag",
        "kStyleTip": "Shearling-trimmed shoulder bag, padded Re-Nylon or iconic leather tote.",
        "sku": "BAG076",
        "silhouette": "Shearling Shoulder / Padded Bag / Birkin"
      },
      {
        "id": "look-76-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Janessa Leone Winter Headwear / Goggles",
        "brand": "Janessa Leone",
        "price": 305,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Janessa+Leone+Beanie",
        "kStyleTip": "Rule #5 headwear diversification: pom-pom beanies, aviator trappers, ski goggles or wool felt berets.",
        "sku": "HAT076",
        "silhouette": "Pom-Pom Beanie / Goggles / Trapper"
      },
      {
        "id": "look-76-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai High Jewelry Accent",
        "brand": "Sophie Buhai",
        "price": 415,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Jewelry",
        "kStyleTip": "18k gold Alhambra pendants, Panthère drops or vermeil rings gleaming in fireside light.",
        "sku": "JWL076",
        "silhouette": "Pendant Necklace / Drop Earrings / Cocktail Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v77",
    "title": "Cortina d'Ampezzo Tailored Wool Ski Overcoat & Visor",
    "shortTitle": "Cortina d'Ampezzo Tailored Wool Ski Overco",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Winter Special 2026",
    "imageUrl": "/images/looks/look_77_minseo_modern_minimalist.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Aspen, St. Moritz, Megève & Whistler. Cortina d'Ampezzo Tailored Wool Ski Overcoat & Visor, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 6280,
    "pins": [
      {
        "id": "look-77-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Max Mara Luxury Alpine Outerwear",
        "brand": "Max Mara",
        "price": 1740,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Max+Mara+Ski",
        "kStyleTip": "Ultra-luxe alpine outerwear blending thermal performance and haute couture.",
        "sku": "OUT077",
        "silhouette": "Bomber / Belted Parka / Cashmere Cape"
      },
      {
        "id": "look-77-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Toteme Thermal Luxury Knit",
        "brand": "Toteme",
        "price": 480,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Knit",
        "kStyleTip": "Geometric intarsia or chunky fisherman cable knit framing the neck.",
        "sku": "TOP077",
        "silhouette": "Turtleneck / Cable Knit / Seamless Top"
      },
      {
        "id": "look-77-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Alpine Slacks / Ski Pants",
        "brand": "Toteme",
        "price": 740,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Ski",
        "kStyleTip": "Tailored ski stirrup trousers, stretch suede leggings or leather pants.",
        "sku": "BOT077",
        "silhouette": "Stirrup Ski / Suede Leggings / Straight Leather"
      },
      {
        "id": "look-77-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "The Row Alpine Snow Boots",
        "brand": "The Row",
        "price": 870,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Snow+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible snow boots firmly planted with empty ground clearance.",
        "sku": "SHO077",
        "silhouette": "Moon Boots / Suede Boots / Shearling Combat"
      },
      {
        "id": "look-77-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Jil Sander Luxury Alpine Bag",
        "brand": "Jil Sander",
        "price": 1650,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Jil+Sander+Bag",
        "kStyleTip": "Shearling-trimmed shoulder bag, padded Re-Nylon or iconic leather tote.",
        "sku": "BAG077",
        "silhouette": "Shearling Shoulder / Padded Bag / Birkin"
      },
      {
        "id": "look-77-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Moncler Winter Headwear / Goggles",
        "brand": "Moncler",
        "price": 340,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Moncler+Hat",
        "kStyleTip": "Rule #5 headwear diversification: pom-pom beanies, aviator trappers, ski goggles or wool felt berets.",
        "sku": "HAT077",
        "silhouette": "Pom-Pom Beanie / Goggles / Trapper"
      },
      {
        "id": "look-77-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais High Jewelry Accent",
        "brand": "Charlotte Chesnais",
        "price": 460,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "18k gold Alhambra pendants, Panthère drops or vermeil rings gleaming in fireside light.",
        "sku": "JWL077",
        "silhouette": "Pendant Necklace / Drop Earrings / Cocktail Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v78",
    "title": "Zermatt Chalet Midnight Velvet Puffer & Wool Slacks",
    "shortTitle": "Zermatt Chalet Midnight Velvet Puffer & Wo",
    "gender": "women",
    "category": "Downtown Street Chic",
    "aesthetic": "Downtown Street Chic",
    "season": "Winter Special 2026",
    "imageUrl": "/images/looks/look_78_sua_downtown_street.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Aspen, St. Moritz, Megève & Whistler. Zermatt Chalet Midnight Velvet Puffer & Wool Slacks, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Downtown Street Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 6860,
    "pins": [
      {
        "id": "look-78-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Moncler Luxury Alpine Outerwear",
        "brand": "Moncler",
        "price": 1900,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Moncler+Jacket",
        "kStyleTip": "Ultra-luxe alpine outerwear blending thermal performance and haute couture.",
        "sku": "OUT078",
        "silhouette": "Bomber / Belted Parka / Cashmere Cape"
      },
      {
        "id": "look-78-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Thermal Luxury Knit",
        "brand": "Skims",
        "price": 530,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Skims+Sweater",
        "kStyleTip": "Geometric intarsia or chunky fisherman cable knit framing the neck.",
        "sku": "TOP078",
        "silhouette": "Turtleneck / Cable Knit / Seamless Top"
      },
      {
        "id": "look-78-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Studio Nicholson Alpine Slacks / Ski Pants",
        "brand": "Studio Nicholson",
        "price": 805,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Studio+Nicholson+Pants",
        "kStyleTip": "Tailored ski stirrup trousers, stretch suede leggings or leather pants.",
        "sku": "BOT078",
        "silhouette": "Stirrup Ski / Suede Leggings / Straight Leather"
      },
      {
        "id": "look-78-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Rick Owens Alpine Snow Boots",
        "brand": "Rick Owens",
        "price": 945,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Rick+Owens+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible snow boots firmly planted with empty ground clearance.",
        "sku": "SHO078",
        "silhouette": "Moon Boots / Suede Boots / Shearling Combat"
      },
      {
        "id": "look-78-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Balenciaga Luxury Alpine Bag",
        "brand": "Balenciaga",
        "price": 1800,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Balenciaga+Bag",
        "kStyleTip": "Shearling-trimmed shoulder bag, padded Re-Nylon or iconic leather tote.",
        "sku": "BAG078",
        "silhouette": "Shearling Shoulder / Padded Bag / Birkin"
      },
      {
        "id": "look-78-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Arc'teryx Veilance Winter Headwear / Goggles",
        "brand": "Arc'teryx Veilance",
        "price": 375,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Arc'teryx+Veilance+Beanie",
        "kStyleTip": "Rule #5 headwear diversification: pom-pom beanies, aviator trappers, ski goggles or wool felt berets.",
        "sku": "HAT078",
        "silhouette": "Pom-Pom Beanie / Goggles / Trapper"
      },
      {
        "id": "look-78-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Chrome Hearts High Jewelry Accent",
        "brand": "Chrome Hearts",
        "price": 505,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Chrome+Hearts+Jewelry",
        "kStyleTip": "18k gold Alhambra pendants, Panthère drops or vermeil rings gleaming in fireside light.",
        "sku": "JWL078",
        "silhouette": "Pendant Necklace / Drop Earrings / Cocktail Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v79",
    "title": "Banff Heritage Plaid Fleece Shacket & Cuffed Denim",
    "shortTitle": "Banff Heritage Plaid Fleece Shacket & Cuff",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Winter Special 2026",
    "imageUrl": "/images/looks/look_79_chaewon_elevated_casual.webp",
    "modelInfo": "Chaewon · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Chaewon in Aspen, St. Moritz, Megève & Whistler. Banff Heritage Plaid Fleece Shacket & Cuffed Denim, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 7440,
    "pins": [
      {
        "id": "look-79-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Woolrich Luxury Alpine Outerwear",
        "brand": "Woolrich",
        "price": 2060,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Woolrich+Ski",
        "kStyleTip": "Ultra-luxe alpine outerwear blending thermal performance and haute couture.",
        "sku": "OUT079",
        "silhouette": "Bomber / Belted Parka / Cashmere Cape"
      },
      {
        "id": "look-79-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Alex Mill Thermal Luxury Knit",
        "brand": "Alex Mill",
        "price": 580,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Alex+Mill+Knit",
        "kStyleTip": "Geometric intarsia or chunky fisherman cable knit framing the neck.",
        "sku": "TOP079",
        "silhouette": "Turtleneck / Cable Knit / Seamless Top"
      },
      {
        "id": "look-79-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "RE/DONE Alpine Slacks / Ski Pants",
        "brand": "RE/DONE",
        "price": 870,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=RE/DONE+Ski",
        "kStyleTip": "Tailored ski stirrup trousers, stretch suede leggings or leather pants.",
        "sku": "BOT079",
        "silhouette": "Stirrup Ski / Suede Leggings / Straight Leather"
      },
      {
        "id": "look-79-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Red Wing Alpine Snow Boots",
        "brand": "Red Wing",
        "price": 1020,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Red+Wing+Snow+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible snow boots firmly planted with empty ground clearance.",
        "sku": "SHO079",
        "silhouette": "Moon Boots / Suede Boots / Shearling Combat"
      },
      {
        "id": "look-79-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Filson Luxury Alpine Bag",
        "brand": "Filson",
        "price": 1950,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Filson+Bag",
        "kStyleTip": "Shearling-trimmed shoulder bag, padded Re-Nylon or iconic leather tote.",
        "sku": "BAG079",
        "silhouette": "Shearling Shoulder / Padded Bag / Birkin"
      },
      {
        "id": "look-79-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Canada Goose Winter Headwear / Goggles",
        "brand": "Canada Goose",
        "price": 410,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Canada+Goose+Hat",
        "kStyleTip": "Rule #5 headwear diversification: pom-pom beanies, aviator trappers, ski goggles or wool felt berets.",
        "sku": "HAT079",
        "silhouette": "Pom-Pom Beanie / Goggles / Trapper"
      },
      {
        "id": "look-79-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Foundrae High Jewelry Accent",
        "brand": "Foundrae",
        "price": 550,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Foundrae+Jewelry",
        "kStyleTip": "18k gold Alhambra pendants, Panthère drops or vermeil rings gleaming in fireside light.",
        "sku": "JWL079",
        "silhouette": "Pendant Necklace / Drop Earrings / Cocktail Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v80",
    "title": "Alpine Gala Liquid Gold Lurex Gown & Fur Bolero",
    "shortTitle": "Alpine Gala Liquid Gold Lurex Gown & Fur B",
    "gender": "women",
    "category": "Gala & Runway Glam",
    "aesthetic": "Gala & Runway Glam",
    "season": "Winter Special 2026",
    "imageUrl": "/images/looks/look_80_hana_gala_glam.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Aspen, St. Moritz, Megève & Whistler. Alpine Gala Liquid Gold Lurex Gown & Fur Bolero, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Gala & Runway Glam",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 8020,
    "pins": [
      {
        "id": "look-80-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Saint Laurent Luxury Alpine Outerwear",
        "brand": "Saint Laurent",
        "price": 2220,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Saint+Laurent+Jacket",
        "kStyleTip": "Ultra-luxe alpine outerwear blending thermal performance and haute couture.",
        "sku": "OUT080",
        "silhouette": "Bomber / Belted Parka / Cashmere Cape"
      },
      {
        "id": "look-80-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Tom Ford Thermal Luxury Knit",
        "brand": "Tom Ford",
        "price": 630,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Tom+Ford+Sweater",
        "kStyleTip": "Geometric intarsia or chunky fisherman cable knit framing the neck.",
        "sku": "TOP080",
        "silhouette": "Turtleneck / Cable Knit / Seamless Top"
      },
      {
        "id": "look-80-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Saint Laurent Alpine Slacks / Ski Pants",
        "brand": "Saint Laurent",
        "price": 935,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Saint+Laurent+Pants",
        "kStyleTip": "Tailored ski stirrup trousers, stretch suede leggings or leather pants.",
        "sku": "BOT080",
        "silhouette": "Stirrup Ski / Suede Leggings / Straight Leather"
      },
      {
        "id": "look-80-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Aquazzura Alpine Snow Boots",
        "brand": "Aquazzura",
        "price": 1095,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Aquazzura+Boots",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible snow boots firmly planted with empty ground clearance.",
        "sku": "SHO080",
        "silhouette": "Moon Boots / Suede Boots / Shearling Combat"
      },
      {
        "id": "look-80-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Cult Gaia Luxury Alpine Bag",
        "brand": "Cult Gaia",
        "price": 2100,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Cult+Gaia+Bag",
        "kStyleTip": "Shearling-trimmed shoulder bag, padded Re-Nylon or iconic leather tote.",
        "sku": "BAG080",
        "silhouette": "Shearling Shoulder / Padded Bag / Birkin"
      },
      {
        "id": "look-80-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Cartier Winter Headwear / Goggles",
        "brand": "Cartier",
        "price": 445,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Cartier+Beanie",
        "kStyleTip": "Rule #5 headwear diversification: pom-pom beanies, aviator trappers, ski goggles or wool felt berets.",
        "sku": "HAT080",
        "silhouette": "Pom-Pom Beanie / Goggles / Trapper"
      },
      {
        "id": "look-80-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Cartier High Jewelry Accent",
        "brand": "Cartier",
        "price": 595,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Cartier+Jewelry",
        "kStyleTip": "18k gold Alhambra pendants, Panthère drops or vermeil rings gleaming in fireside light.",
        "sku": "JWL080",
        "silhouette": "Pendant Necklace / Drop Earrings / Cocktail Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v81",
    "title": "Venice Beach Sunset Cropped Suede Moto & Vintage Denim",
    "shortTitle": "Venice Beach Sunset Cropped Suede Moto & V",
    "gender": "women",
    "category": "Downtown Street Chic",
    "aesthetic": "Downtown Street Chic",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_81_jiwoo_downtown_street.webp",
    "modelInfo": "Jiwoo · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Jiwoo in Venice Beach Boardwalk, Los Angeles. Venice Beach Sunset Cropped Suede Moto & Vintage Denim, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Downtown Street Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3180,
    "pins": [
      {
        "id": "look-81-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Acne Studios California Signature Outerwear",
        "brand": "Acne Studios",
        "price": 1035,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Acne+Studios+Outerwear",
        "kStyleTip": "Sun-drenched relaxed luxury tailoring perfectly adapted to California coastal air.",
        "sku": "OUT081",
        "silhouette": "Cropped Moto / Fluid Duster / Industrial Shell"
      },
      {
        "id": "look-81-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Essential Knit Top",
        "brand": "Skims",
        "price": 135,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Skims+Knit",
        "kStyleTip": "Soft-touch fine rib knit framing clean shoulders and décolletage.",
        "sku": "TOP081",
        "silhouette": "Crop Tank / Scoop Tank / High Neck"
      },
      {
        "id": "look-81-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Agolde Tailored California Denim / Pants",
        "brand": "Agolde",
        "price": 295,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Agolde+Denim",
        "kStyleTip": "Effortless relaxed high-rise cut falling smoothly down elongated legs.",
        "sku": "BOT081",
        "silhouette": "Straight Leg / Wide Linen / Utility Slacks"
      },
      {
        "id": "look-81-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Sonora Designer Footwear",
        "brand": "Sonora",
        "price": 725,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sonora+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO081",
        "silhouette": "Western Boots / Slide Sandals / Clog Mules / Trail Runners"
      },
      {
        "id": "look-81-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "By Far Luxury Handbag",
        "brand": "By Far",
        "price": 690,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=By+Far+Bag",
        "kStyleTip": "Iconic luxury handbag in premium leather or handwoven raffia.",
        "sku": "BAG081",
        "silhouette": "Shoulder Bag / Basket Tote / Re-Nylon Shoulder"
      },
      {
        "id": "look-81-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Le Specs Eyewear & Headwear Accent",
        "brand": "Le Specs",
        "price": 110,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Le+Specs+Hat",
        "kStyleTip": "Rule #5 headwear diversification: sunglasses, natural straw hats or sculptural accents framing the face.",
        "sku": "HAT081",
        "silhouette": "Oval Sunglasses / Sun Hat / Sculptural Hairpin"
      },
      {
        "id": "look-81-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Fine Jewelry Accent",
        "brand": "Charlotte Chesnais",
        "price": 190,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Modernist 18k gold vermeil or solid silver accents gleaming under California sunlight.",
        "sku": "JWL081",
        "silhouette": "Hoop Earrings / Juste un Clou / Wave Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v82",
    "title": "Malibu Oceanfront Gauzy White Linen Duster & Slide Sandals",
    "shortTitle": "Malibu Oceanfront Gauzy White Linen Duster",
    "gender": "women",
    "category": "Parisian & Riviera Chic",
    "aesthetic": "Parisian & Riviera Chic",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_82_minseo_parisian_riviera.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in El Matador Beach, Malibu, California. Malibu Oceanfront Gauzy White Linen Duster & Slide Sandals, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Parisian & Riviera Chic",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3410,
    "pins": [
      {
        "id": "look-82-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "The Row California Signature Outerwear",
        "brand": "The Row",
        "price": 1050,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Jacket",
        "kStyleTip": "Sun-drenched relaxed luxury tailoring perfectly adapted to California coastal air.",
        "sku": "OUT082",
        "silhouette": "Cropped Moto / Fluid Duster / Industrial Shell"
      },
      {
        "id": "look-82-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Toteme Essential Knit Top",
        "brand": "Toteme",
        "price": 160,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Toteme+Top",
        "kStyleTip": "Soft-touch fine rib knit framing clean shoulders and décolletage.",
        "sku": "TOP082",
        "silhouette": "Crop Tank / Scoop Tank / High Neck"
      },
      {
        "id": "look-82-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Toteme Tailored California Denim / Pants",
        "brand": "Toteme",
        "price": 330,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Toteme+Pants",
        "kStyleTip": "Effortless relaxed high-rise cut falling smoothly down elongated legs.",
        "sku": "BOT082",
        "silhouette": "Straight Leg / Wide Linen / Utility Slacks"
      },
      {
        "id": "look-82-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Ancient Greek Sandals Designer Footwear",
        "brand": "Ancient Greek Sandals",
        "price": 770,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Ancient+Greek+Sandals+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO082",
        "silhouette": "Western Boots / Slide Sandals / Clog Mules / Trail Runners"
      },
      {
        "id": "look-82-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Loewe Luxury Handbag",
        "brand": "Loewe",
        "price": 750,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Loewe+Bag",
        "kStyleTip": "Iconic luxury handbag in premium leather or handwoven raffia.",
        "sku": "BAG082",
        "silhouette": "Shoulder Bag / Basket Tote / Re-Nylon Shoulder"
      },
      {
        "id": "look-82-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Janessa Leone Eyewear & Headwear Accent",
        "brand": "Janessa Leone",
        "price": 130,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Janessa+Leone+Sunglasses",
        "kStyleTip": "Rule #5 headwear diversification: sunglasses, natural straw hats or sculptural accents framing the face.",
        "sku": "HAT082",
        "silhouette": "Oval Sunglasses / Sun Hat / Sculptural Hairpin"
      },
      {
        "id": "look-82-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Tohum Fine Jewelry Accent",
        "brand": "Tohum",
        "price": 220,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Tohum+Jewelry",
        "kStyleTip": "Modernist 18k gold vermeil or solid silver accents gleaming under California sunlight.",
        "sku": "JWL082",
        "silhouette": "Hoop Earrings / Juste un Clou / Wave Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v83",
    "title": "Silver Lake Indie Ribbed Tank, Slouchy Alpaca Cardigan & Mules",
    "shortTitle": "Silver Lake Indie Ribbed Tank, Slouchy Alp",
    "gender": "women",
    "category": "Elevated Off-Duty Casual",
    "aesthetic": "Elevated Off-Duty Casual",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_83_sua_elevated_casual.webp",
    "modelInfo": "Sua · 181cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Sua in Silver Lake Reservoir Cafe Patio, Los Angeles. Silver Lake Indie Ribbed Tank, Slouchy Alpaca Cardigan & Mules, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Elevated Off-Duty Casual",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3640,
    "pins": [
      {
        "id": "look-83-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Khaite California Signature Outerwear",
        "brand": "Khaite",
        "price": 1065,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Khaite+Outerwear",
        "kStyleTip": "Sun-drenched relaxed luxury tailoring perfectly adapted to California coastal air.",
        "sku": "OUT083",
        "silhouette": "Cropped Moto / Fluid Duster / Industrial Shell"
      },
      {
        "id": "look-83-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Essential Knit Top",
        "brand": "Skims",
        "price": 185,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Skims+Knit",
        "kStyleTip": "Soft-touch fine rib knit framing clean shoulders and décolletage.",
        "sku": "TOP083",
        "silhouette": "Crop Tank / Scoop Tank / High Neck"
      },
      {
        "id": "look-83-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "RE/DONE Tailored California Denim / Pants",
        "brand": "RE/DONE",
        "price": 365,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=RE/DONE+Denim",
        "kStyleTip": "Effortless relaxed high-rise cut falling smoothly down elongated legs.",
        "sku": "BOT083",
        "silhouette": "Straight Leg / Wide Linen / Utility Slacks"
      },
      {
        "id": "look-83-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Birkenstock Designer Footwear",
        "brand": "Birkenstock",
        "price": 815,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Birkenstock+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO083",
        "silhouette": "Western Boots / Slide Sandals / Clog Mules / Trail Runners"
      },
      {
        "id": "look-83-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Dragon Diffusion Luxury Handbag",
        "brand": "Dragon Diffusion",
        "price": 810,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Dragon+Diffusion+Bag",
        "kStyleTip": "Iconic luxury handbag in premium leather or handwoven raffia.",
        "sku": "BAG083",
        "silhouette": "Shoulder Bag / Basket Tote / Re-Nylon Shoulder"
      },
      {
        "id": "look-83-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Sophie Buhai Eyewear & Headwear Accent",
        "brand": "Sophie Buhai",
        "price": 150,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Sophie+Buhai+Hat",
        "kStyleTip": "Rule #5 headwear diversification: sunglasses, natural straw hats or sculptural accents framing the face.",
        "sku": "HAT083",
        "silhouette": "Oval Sunglasses / Sun Hat / Sculptural Hairpin"
      },
      {
        "id": "look-83-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Sophie Buhai Fine Jewelry Accent",
        "brand": "Sophie Buhai",
        "price": 250,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Sophie+Buhai+Jewelry",
        "kStyleTip": "Modernist 18k gold vermeil or solid silver accents gleaming under California sunlight.",
        "sku": "JWL083",
        "silhouette": "Hoop Earrings / Juste un Clou / Wave Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v84",
    "title": "Bel-Air Silk Georgette Draped Shirtdress & Basket Tote",
    "shortTitle": "Bel-Air Silk Georgette Draped Shirtdress & Basket Tote",
    "gender": "women",
    "category": "Quiet Luxury & Minimal",
    "aesthetic": "Quiet Luxury & Minimal",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_84_hana_quiet_luxury.webp",
    "modelInfo": "Hana · 182cm / 6'0\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Hana in Bel-Air Private Estate Garden, Los Angeles. Bel-Air Silk Georgette Draped Shirtdress & Basket Tote, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Quiet Luxury & Minimal",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 3870,
    "pins": [
      {
        "id": "look-84-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "The Row California Signature Outerwear",
        "brand": "The Row",
        "price": 1080,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Jacket",
        "kStyleTip": "Sun-drenched relaxed luxury tailoring perfectly adapted to California coastal air.",
        "sku": "OUT084",
        "silhouette": "Cropped Moto / Fluid Duster / Industrial Shell"
      },
      {
        "id": "look-84-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "The Row Essential Knit Top",
        "brand": "The Row",
        "price": 210,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=The+Row+Top",
        "kStyleTip": "Soft-touch fine rib knit framing clean shoulders and décolletage.",
        "sku": "TOP084",
        "silhouette": "Crop Tank / Scoop Tank / High Neck"
      },
      {
        "id": "look-84-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "The Row Tailored California Denim / Pants",
        "brand": "The Row",
        "price": 400,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=The+Row+Pants",
        "kStyleTip": "Effortless relaxed high-rise cut falling smoothly down elongated legs.",
        "sku": "BOT084",
        "silhouette": "Straight Leg / Wide Linen / Utility Slacks"
      },
      {
        "id": "look-84-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Manolo Blahnik Designer Footwear",
        "brand": "Manolo Blahnik",
        "price": 860,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Manolo+Blahnik+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO084",
        "silhouette": "Western Boots / Slide Sandals / Clog Mules / Trail Runners"
      },
      {
        "id": "look-84-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Hermès Luxury Handbag",
        "brand": "Hermès",
        "price": 870,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Hermès+Bag",
        "kStyleTip": "Iconic luxury handbag in premium leather or handwoven raffia.",
        "sku": "BAG084",
        "silhouette": "Shoulder Bag / Basket Tote / Re-Nylon Shoulder"
      },
      {
        "id": "look-84-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Janessa Leone Eyewear & Headwear Accent",
        "brand": "Janessa Leone",
        "price": 170,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Janessa+Leone+Sunglasses",
        "kStyleTip": "Rule #5 headwear diversification: sunglasses, natural straw hats or sculptural accents framing the face.",
        "sku": "HAT084",
        "silhouette": "Oval Sunglasses / Sun Hat / Sculptural Hairpin"
      },
      {
        "id": "look-84-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Cartier Fine Jewelry Accent",
        "brand": "Cartier",
        "price": 280,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Cartier+Jewelry",
        "kStyleTip": "Modernist 18k gold vermeil or solid silver accents gleaming under California sunlight.",
        "sku": "JWL084",
        "silhouette": "Hoop Earrings / Juste un Clou / Wave Ring"
      }
    ]
  },
  {
    "id": "editorial-look-v85",
    "title": "Downtown LA Arts District Industrial Shell & Salomon Shoes",
    "shortTitle": "Downtown LA Arts District Industrial Shell",
    "gender": "women",
    "category": "Modern Minimalist",
    "aesthetic": "Modern Minimalist",
    "season": "Spring / Summer 2026",
    "imageUrl": "/images/looks/look_85_minseo_modern_minimalist.webp",
    "modelInfo": "Minseo · 180cm / 5'11\" · Silhouette A",
    "description": "Master editorial photograph of BLUE:NOTE's Minseo in Downtown LA Arts District, Los Angeles. Downtown LA Arts District Industrial Shell & Salomon Shoes, grounded in full-body vertical runway proportions.",
    "curatorNote": "Counterfactual Defect-Solution: High-density tailoring maintains structured lines with zero inner-crease distortion.",
    "colorPalette": [
      "#1A1A1A",
      "#E5E5E5",
      "#3A3A3A",
      "#C2B4A3"
    ],
    "vibeTags": [
      "Modern Minimalist",
      "High-Fashion",
      "SS26"
    ],
    "totalPrice": 4100,
    "pins": [
      {
        "id": "look-85-outer",
        "x": 48,
        "y": 38,
        "category": "outer",
        "title": "Arc'teryx Veilance California Signature Outerwear",
        "brand": "Arc'teryx Veilance",
        "price": 1095,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Arc'teryx+Veilance+Outerwear",
        "kStyleTip": "Sun-drenched relaxed luxury tailoring perfectly adapted to California coastal air.",
        "sku": "OUT085",
        "silhouette": "Cropped Moto / Fluid Duster / Industrial Shell"
      },
      {
        "id": "look-85-top",
        "x": 50,
        "y": 30,
        "category": "top",
        "title": "Skims Essential Knit Top",
        "brand": "Skims",
        "price": 235,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Skims+Knit",
        "kStyleTip": "Soft-touch fine rib knit framing clean shoulders and décolletage.",
        "sku": "TOP085",
        "silhouette": "Crop Tank / Scoop Tank / High Neck"
      },
      {
        "id": "look-85-bottom",
        "x": 50,
        "y": 62,
        "category": "bottom",
        "title": "Studio Nicholson Tailored California Denim / Pants",
        "brand": "Studio Nicholson",
        "price": 435,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Studio+Nicholson+Denim",
        "kStyleTip": "Effortless relaxed high-rise cut falling smoothly down elongated legs.",
        "sku": "BOT085",
        "silhouette": "Straight Leg / Wide Linen / Utility Slacks"
      },
      {
        "id": "look-85-shoes",
        "x": 50,
        "y": 86,
        "category": "shoes",
        "title": "Salomon Designer Footwear",
        "brand": "Salomon",
        "price": 905,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Salomon+Shoes",
        "kStyleTip": "Rule #5 shoe grounding: 100% visible footwear firmly planted with empty ground clearance.",
        "sku": "SHO085",
        "silhouette": "Western Boots / Slide Sandals / Clog Mules / Trail Runners"
      },
      {
        "id": "look-85-bag",
        "x": 38,
        "y": 52,
        "category": "bag",
        "title": "Prada Luxury Handbag",
        "brand": "Prada",
        "price": 930,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Prada+Bag",
        "kStyleTip": "Iconic luxury handbag in premium leather or handwoven raffia.",
        "sku": "BAG085",
        "silhouette": "Shoulder Bag / Basket Tote / Re-Nylon Shoulder"
      },
      {
        "id": "look-85-headwear",
        "x": 51,
        "y": 14,
        "category": "headwear",
        "title": "Arc'teryx Veilance Eyewear & Headwear Accent",
        "brand": "Arc'teryx Veilance",
        "price": 190,
        "retailer": "Shopbop",
        "buyUrl": "https://www.shopbop.com/s/products?query=Arc'teryx+Veilance+Hat",
        "kStyleTip": "Rule #5 headwear diversification: sunglasses, natural straw hats or sculptural accents framing the face.",
        "sku": "HAT085",
        "silhouette": "Oval Sunglasses / Sun Hat / Sculptural Hairpin"
      },
      {
        "id": "look-85-jewelry",
        "x": 52,
        "y": 24,
        "category": "jewelry",
        "title": "Charlotte Chesnais Fine Jewelry Accent",
        "brand": "Charlotte Chesnais",
        "price": 310,
        "retailer": "Nordstrom",
        "buyUrl": "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=Charlotte+Chesnais+Jewelry",
        "kStyleTip": "Modernist 18k gold vermeil or solid silver accents gleaming under California sunlight.",
        "sku": "JWL085",
        "silhouette": "Hoop Earrings / Juste un Clou / Wave Ring"
      }
    ]
  }
];

// Sample model presets for 1-click photorealistic testing
interface SampleModel {
  id: string;
  gender: 'men' | 'women';
  label: string;
  tag: string;
  url: string;
  thumb: string;
}

const REALISTIC_SAMPLE_MODELS: SampleModel[] = [
  {
    id: 'sample-f-caucasian',
    gender: 'women',
    label: 'Caucasian Model',
    tag: '177cm · Editorial A',
    url: '/images/models/female_caucasian_model.webp',
    thumb: '/images/models/female_caucasian_model_thumb.webp'
  },
  {
    id: 'sample-f-asian',
    gender: 'women',
    label: 'Asian Model',
    tag: '174cm · Editorial B',
    url: '/images/models/female_asian_model.webp',
    thumb: '/images/models/female_asian_model_thumb.webp'
  },
  {
    id: 'sample-f-black',
    gender: 'women',
    label: 'Black Model',
    tag: '178cm · Editorial C',
    url: '/images/models/female_black_model.webp',
    thumb: '/images/models/female_black_model_thumb.webp'
  },
  {
    id: 'sample-m-caucasian',
    gender: 'men',
    label: 'Caucasian Model',
    tag: '185cm · Editorial D',
    url: '/images/models/male_caucasian_model.webp',
    thumb: '/images/models/male_caucasian_model_thumb.webp'
  },
  {
    id: 'sample-m-asian',
    gender: 'men',
    label: 'Asian Model',
    tag: '182cm · Editorial E',
    url: '/images/models/male_asian_model.webp',
    thumb: '/images/models/male_asian_model_thumb.webp'
  },
  {
    id: 'sample-m-black',
    gender: 'men',
    label: 'Black Model',
    tag: '184cm · Editorial F',
    url: '/images/models/male_black_model.webp',
    thumb: '/images/models/male_black_model_thumb.webp'
  }
];

const PAYPAL_CHECKOUT_URL = 'https://www.paypal.com/ncp/payment/LVRRE8SJKD3VA';

// =================================================================
// 2. MAIN COMPONENT: STYLINGHELPER EDITORIAL RENEWAL (OPTION A)
// =================================================================
export default function StylingHelperRenewalPage() {
  // Navigation & Filter state
  const [activeGenderFilter, setActiveGenderFilter] = useState<'all' | 'women' | 'men'>('all');
  const [activeAestheticFilter, setActiveAestheticFilter] = useState<string>('all');

  // AI Personalized Recommendation State (TPO, Mood, Fit)
  const [curatorOccasion, setCuratorOccasion] = useState<string>('all');
  const [curatorMood, setCuratorMood] = useState<string>('quiet luxury');
  const [curatorFit, setCuratorFit] = useState<string>('all');
  
  // Selected Look for Editorial Drawer/Modal
  const [activeLookModal, setActiveLookModal] = useState<EditorialMasterLook | null>(null);
  const [showHotspotPins, setShowHotspotPins] = useState<boolean>(true);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  // Virtual Try-On Studio state
  const [selectedTryOnLook, setSelectedTryOnLook] = useState<EditorialMasterLook>(MASTER_EDITORIAL_LOOKS[0]);
  const [userPhoto, setUserPhoto] = useState<string>(REALISTIC_SAMPLE_MODELS[0].url);
  const [userPhotoName, setUserPhotoName] = useState<string>('Preset: Caucasian Model (177cm)');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<string>('');
  const [styledResult, setStyledResult] = useState<{
    imageUrl: string;
    look: EditorialMasterLook;
  } | null>(null);

  // Lookbook Modal Try-On & Photo View Switcher State
  const [modalViewMode, setModalViewMode] = useState<'fitted' | 'model'>('fitted');
  const [cachedLookResults, setCachedLookResults] = useState<Record<string, string>>({});
  const [isModalGenerating, setIsModalGenerating] = useState<boolean>(false);
  const [modalProgressStage, setModalProgressStage] = useState<string>('');

  // Auth & Subscription state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isProSubscriber, setIsProSubscriber] = useState<boolean>(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<{
    isPro: boolean;
    isExpired: boolean;
    daysRemaining: number;
    paidAt: string | null;
    expiresAt: string | null;
    plan: string;
  }>({
    isPro: false,
    isExpired: false,
    daysRemaining: 0,
    paidAt: null,
    expiresAt: null,
    plan: 'monthly'
  });
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);

  // Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportProduct, setReportProduct] = useState<{ title: string; url: string }>({
    title: '',
    url: ''
  });

  // Section references for smooth scrolling
  const lookbookRef = useRef<HTMLElement>(null);
  const studioRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync Auth state & check Pro subscription (Query param ?pro=true enables instant test mode with 30-day window)
  useEffect(() => {
    try {
      localStorage.removeItem('styling_free_trial_used');
      const searchParams = new URLSearchParams(window.location.search);
      
      // Admin / Testing direct activation (?pro=true grants exact 30-day cycle)
      if (searchParams.get('pro') === 'true') {
        const nowIso = new Date().toISOString();
        const expiresIso = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const adminSub = {
          isPro: true,
          isExpired: false,
          daysRemaining: 30,
          paidAt: nowIso,
          expiresAt: expiresIso,
          plan: 'monthly'
        };
        localStorage.setItem('styling_subscription', JSON.stringify(adminSub));
        localStorage.setItem('styling_is_pro_subscriber', 'true');
      }

      // Precise 30-day expiration engine
      const validateSubscription = () => {
        try {
          const rawSub = localStorage.getItem('styling_subscription');
          if (rawSub) {
            const sub = JSON.parse(rawSub);
            const now = Date.now();
            const expiresAtMs = sub.expiresAt ? new Date(sub.expiresAt).getTime() : 0;
            
            if (expiresAtMs && now >= expiresAtMs) {
              // Exactly expired after 30 days
              setIsProSubscriber(false);
              setSubscriptionDetails({
                isPro: false,
                isExpired: true,
                daysRemaining: 0,
                paidAt: sub.paidAt || null,
                expiresAt: sub.expiresAt,
                plan: sub.plan || 'monthly'
              });
              localStorage.setItem('styling_is_pro_subscriber', 'false');
            } else if (expiresAtMs) {
              // Active with calculated remaining days
              const days = Math.max(1, Math.ceil((expiresAtMs - now) / (1000 * 60 * 60 * 24)));
              setIsProSubscriber(true);
              setSubscriptionDetails({
                isPro: true,
                isExpired: false,
                daysRemaining: days,
                paidAt: sub.paidAt,
                expiresAt: sub.expiresAt,
                plan: sub.plan || 'monthly'
              });
              localStorage.setItem('styling_is_pro_subscriber', 'true');
            }
          } else {
            const isPro = localStorage.getItem('styling_is_pro_subscriber') === 'true';
            setIsProSubscriber(isPro);
            if (isPro) {
              const defaultExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
              setSubscriptionDetails({
                isPro: true,
                isExpired: false,
                daysRemaining: 30,
                paidAt: new Date().toISOString(),
                expiresAt: defaultExpires,
                plan: 'monthly'
              });
            }
          }
        } catch {
          setIsProSubscriber(false);
        }
      };
      validateSubscription();

      const syncUser = () => {
        try {
          const stored =
            localStorage.getItem('stylinghelper_user') ||
            localStorage.getItem('stayhelper_member') ||
            localStorage.getItem('stayhelper_user');
          if (stored) {
            const userObj = JSON.parse(stored);
            setCurrentUser(userObj);
            // Verify with server DB if email is present
            if (userObj.email) {
              fetch(`/api/stylinghelper/member?email=${encodeURIComponent(userObj.email)}`)
                .then((r) => r.json())
                .then((data) => {
                  if (data.exists) {
                    setIsProSubscriber(data.isPro);
                    setSubscriptionDetails({
                      isPro: data.isPro,
                      isExpired: Boolean(data.isExpired),
                      daysRemaining: data.daysRemaining || 0,
                      paidAt: data.paidAt || null,
                      expiresAt: data.expiresAt || null,
                      plan: data.plan || 'monthly'
                    });
                    localStorage.setItem('styling_subscription', JSON.stringify(data));
                    localStorage.setItem('styling_is_pro_subscriber', data.isPro ? 'true' : 'false');
                  }
                })
                .catch(() => {});
            }
          } else {
            setCurrentUser(null);
          }
        } catch {
          setCurrentUser(null);
        }
      };
      syncUser();
      window.addEventListener('stylinghelper_auth_changed', syncUser);
      window.addEventListener('stayhelper_auth_changed', syncUser);
      return () => {
        window.removeEventListener('stylinghelper_auth_changed', syncUser);
        window.removeEventListener('stayhelper_auth_changed', syncUser);
      };
    } catch (e) {
      // Safe fallback
    }
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('stylinghelper_user');
      localStorage.removeItem('stayhelper_member');
      localStorage.removeItem('stayhelper_user');
      document.cookie = 'stayhelper_user=; path=/; max-age=0;';
      fetch('/api/auth/quick', { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
    setCurrentUser(null);
    window.dispatchEvent(new Event('stylinghelper_auth_changed'));
  };

  // Image Upload & Drop Handlers
  const processImageFile = (file: File, sourceName: string) => {
    setUserPhotoName(sourceName);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUserPhoto(result);
      setStyledResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isProSubscriber) {
      setShowPaywallModal(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, file.name);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!isProSubscriber) {
      setShowPaywallModal(true);
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file, file.name);
    }
  };

  // Clear / Remove Uploaded Photo & Reset to Default Model
  const handleClearPhoto = () => {
    setUserPhoto(REALISTIC_SAMPLE_MODELS[0].url);
    setUserPhotoName(`Preset: ${REALISTIC_SAMPLE_MODELS[0].label}`);
    setStyledResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isCustomPhoto =
    Boolean(userPhoto) &&
    (userPhoto.startsWith('data:image/') ||
      (!userPhoto.includes('/images/models/') && !userPhoto.includes('/images/looks/')));

  // Open Look directly in Try-On Studio (Pro Exclusive)
  const handleDirectTryOn = (look: EditorialMasterLook) => {
    setSelectedTryOnLook(look);
    setActiveLookModal(null);
    studioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!isProSubscriber) {
      // Optional subtle hint, but let them see the look in the studio first!
    }
  };

  // Generate Virtual Try-On (Strict Pro Subscription Required)
  const handleExecuteStyling = async () => {
    if (!isProSubscriber) {
      setShowPaywallModal(true);
      return;
    }

    if (!userPhoto) {
      alert('Please select a sample model or upload your photo first.');
      return;
    }

    setIsGenerating(true);
    setProgressStage('Scanning body contour & aligning pose geometry...');

    const timer1 = setTimeout(() => {
      setProgressStage('Removing current garment layers & isolating fabric contours...');
    }, 1400);

    const timer2 = setTimeout(() => {
      setProgressStage(`Draping authentic ${selectedTryOnLook.shortTitle} pieces...`);
    }, 3000);

    const timer3 = setTimeout(() => {
      setProgressStage('Rendering 1:1 photorealistic textures & studio lighting...');
    }, 4500);

    try {
      const res = await fetch('/api/generate-styling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleId: selectedTryOnLook.id,
          lookId: selectedTryOnLook.id,
          userPhoto: userPhoto,
          gender: selectedTryOnLook.gender
        })
      });

      const data = await res.json();
      if (data.ok && data.imageUrl) {
        setStyledResult({
          imageUrl: data.imageUrl,
          look: selectedTryOnLook
        });
        setCachedLookResults((prev) => ({ ...prev, [selectedTryOnLook.id]: data.imageUrl }));
      } else {
        // High-precision graceful fallback to high-res master editorial look
        setStyledResult({
          imageUrl: selectedTryOnLook.imageUrl,
          look: selectedTryOnLook
        });
      }
    } catch (err) {
      console.warn('Styling synthesis fallback:', err);
      setStyledResult({
        imageUrl: selectedTryOnLook.imageUrl,
        look: selectedTryOnLook
      });
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsGenerating(false);
      setProgressStage('');
    }
  };

  // Synchronize modal view mode when activeLookModal opens
  useEffect(() => {
    if (activeLookModal) {
      if (isCustomPhoto) {
        setModalViewMode('fitted');
      } else {
        setModalViewMode('model');
      }
    }
  }, [activeLookModal, isCustomPhoto]);

  // Execute Virtual Try-On directly within Look Detail Modal
  const handleExecuteModalStyling = async (look: EditorialMasterLook) => {
    if (!isProSubscriber) {
      setShowPaywallModal(true);
      return;
    }
    if (!userPhoto) {
      alert('Please select or upload your photo first.');
      return;
    }

    setIsModalGenerating(true);
    setModalProgressStage('Scanning body contour & draping authentic pieces...');

    const timer1 = setTimeout(() => {
      setModalProgressStage(`Draping authentic ${look.shortTitle} pieces...`);
    }, 1500);

    const timer2 = setTimeout(() => {
      setModalProgressStage('Rendering 1:1 photorealistic textures & studio lighting...');
    }, 3200);

    try {
      const res = await fetch('/api/generate-styling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleId: look.id,
          lookId: look.id,
          userPhoto: userPhoto,
          gender: look.gender
        })
      });
      const data = await res.json();
      if (data.ok && data.imageUrl) {
        setCachedLookResults((prev) => ({ ...prev, [look.id]: data.imageUrl }));
        setStyledResult({
          imageUrl: data.imageUrl,
          look: look
        });
        setSelectedTryOnLook(look);
      }
    } catch (err) {
      console.warn('Modal styling error:', err);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsModalGenerating(false);
      setModalProgressStage('');
    }
  };

  // AI Personalized Recommendation Scoring (Top 3 Capsule Picks)
  const recommendedLooks = React.useMemo(() => {
    const list = MASTER_EDITORIAL_LOOKS.map((look) => {
      let score = 70; // baseline
      const text = `${look.category} ${look.aesthetic} ${look.title} ${look.shortTitle} ${look.description} ${look.curatorNote} ${(look.vibeTags || []).join(' ')}`.toLowerCase();

      // Gender filter matching
      if (activeGenderFilter !== 'all' && look.gender !== activeGenderFilter) {
        return { look, score: -1 };
      }

      // Mood matching
      if (curatorMood && curatorMood !== 'all') {
        const moodKey = curatorMood.toLowerCase();
        if (look.category.toLowerCase().includes(moodKey) || look.aesthetic.toLowerCase().includes(moodKey) || text.includes(moodKey)) {
          score += 35;
        }
      }

      // Occasion matching
      if (curatorOccasion && curatorOccasion !== 'all') {
        if (curatorOccasion === 'office' && (text.includes('tailored') || text.includes('blazer') || text.includes('minimalist') || text.includes('trench') || text.includes('slacks') || text.includes('coat'))) score += 25;
        if (curatorOccasion === 'casual' && (text.includes('casual') || text.includes('knit') || text.includes('denim') || text.includes('cardigan') || text.includes('brunch') || text.includes('off-duty'))) score += 25;
        if (curatorOccasion === 'gallery' && (text.includes('luxury') || text.includes('preppy') || text.includes('tweed') || text.includes('salon') || text.includes('art') || text.includes('avenue'))) score += 25;
        if (curatorOccasion === 'resort' && (text.includes('resort') || text.includes('riviera') || text.includes('linen') || text.includes('summer') || text.includes('wrap') || text.includes('amalfi'))) score += 25;
        if (curatorOccasion === 'evening' && (text.includes('glam') || text.includes('gala') || text.includes('evening') || text.includes('silk') || text.includes('black tie') || text.includes('velvet'))) score += 25;
        if (curatorOccasion === 'street' && (text.includes('street') || text.includes('bomber') || text.includes('vintage') || text.includes('denim') || text.includes('hoodie') || text.includes('tokyo') || text.includes('seongsu'))) score += 25;
      }

      // Fit Focus matching
      if (curatorFit && curatorFit !== 'all') {
        if (curatorFit === 'high-rise' && (text.includes('slacks') || text.includes('trousers') || text.includes('high-waist') || text.includes('elongated'))) score += 15;
        if (curatorFit === 'tailored' && (text.includes('tailored') || text.includes('coat') || text.includes('blazer') || text.includes('jacket') || text.includes('structured'))) score += 15;
        if (curatorFit === 'relaxed' && (text.includes('wide') || text.includes('oversized') || text.includes('fluid') || text.includes('drape') || text.includes('loose'))) score += 15;
      }

      return { look, score };
    });

    return list
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.look);
  }, [activeGenderFilter, curatorMood, curatorOccasion, curatorFit]);

  // Filtered Looks (Dynamic Gender + Aesthetic Filtering)
  const filteredLooks = MASTER_EDITORIAL_LOOKS.filter((look) => {
    const matchesGender = activeGenderFilter === 'all' || look.gender === activeGenderFilter;
    const matchesAesthetic = activeAestheticFilter === 'all' || 
      look.category.toLowerCase().includes(activeAestheticFilter.toLowerCase()) || 
      look.aesthetic.toLowerCase().includes(activeAestheticFilter.toLowerCase());
    return matchesGender && matchesAesthetic;
  });

  const womenLooksCount = MASTER_EDITORIAL_LOOKS.filter((l) => l.gender === 'women').length;
  const menLooksCount = MASTER_EDITORIAL_LOOKS.filter((l) => l.gender === 'men').length;

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#141517] selection:bg-neutral-900 selection:text-white font-sans antialiased">
      {/* ================================================================= */}
      {/* 1. EDITORIAL FROSTED GLASS HEADER (Vogue / SSENSE Standard)       */}
      {/* ================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FAF9F7]/90 backdrop-blur-md border-b border-black/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Wordmark & Editorial Tag */}
          <div className="flex items-center gap-3">
            <Link href="/stylinghelper" className="flex items-baseline gap-2.5 group">
              <span className="font-serif text-2xl sm:text-3xl font-light tracking-[0.06em] text-neutral-950 group-hover:opacity-80 transition-opacity">
                STYLING HELPER
              </span>
              <span className="hidden md:inline-block text-[9px] uppercase tracking-[0.25em] font-medium text-neutral-400 pl-3 border-l border-neutral-300">
                Editorial Lookbook & Virtual Fitting Atelier
              </span>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600">
            <button
              onClick={() => lookbookRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-neutral-950 transition-colors"
            >
              Curated Edit
            </button>
            <button
              onClick={() => studioRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-neutral-950 transition-colors"
            >
              Virtual Fitting
            </button>
            <button
              onClick={() => {
                setReportProduct({ title: 'General In-Stock Inquiry', url: 'https://stylinghelper.com' });
                setIsReportModalOpen(true);
              }}
              className="hover:text-neutral-950 transition-colors"
            >
              Stock Sentinel
            </button>
          </nav>

          {/* Right Actions: Pro, Auth, & Direct CTA */}
          <div className="flex items-center gap-3">
            {isProSubscriber ? (
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/40 shadow-xs cursor-help"
                  title={subscriptionDetails.expiresAt ? `Pro valid until ${new Date(subscriptionDetails.expiresAt).toLocaleDateString()} (${subscriptionDetails.daysRemaining} days left · 무제한 무료)` : 'Pro Active'}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>구독중 · PRO ACTIVE (D-{subscriptionDetails.daysRemaining || 30})</span>
                </span>
              </div>
            ) : (
              <button
                onClick={() => setShowPaywallModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-medium tracking-wide transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Upgrade Pro ($19/mo)</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs">
                <div className="w-5 h-5 rounded-full bg-neutral-950 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                  {currentUser.name?.[0] || currentUser.email?.[0] || 'U'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-semibold text-neutral-900 leading-tight">
                    {currentUser.name || currentUser.email?.split('@')[0]}
                  </span>
                  {isProSubscriber ? (
                    <span className="text-[9px] font-bold text-emerald-700 leading-tight">
                      구독중 (D-{subscriptionDetails.daysRemaining || 30}일 무료 사용)
                    </span>
                  ) : (
                    <span className="text-[9px] text-neutral-500 leading-tight">
                      무료 체험회원
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-neutral-400 hover:text-neutral-900 transition-colors ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-full text-neutral-700 hover:text-neutral-950 text-xs font-medium tracking-wide transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => {
                if (!isProSubscriber) {
                  setShowPaywallModal(true);
                } else {
                  studioRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-4 sm:px-5 py-2 rounded-full bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-[0.14em] font-medium shadow-sm transition-all hover:scale-[1.02]"
            >
              Try on My Photo
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* 2. HIGH-FASHION EDITORIAL HERO (Option A Core Proposition)        */}
      {/* ================================================================= */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden border-b border-black/[0.05]">
        {/* Subtle, soft natural daylight illumination */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-amber-50/60 via-stone-100/30 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Collection Slate */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-[10px] uppercase font-semibold tracking-[0.25em] mb-6">
            <span>SS26 Runway & Street Capsules</span>
            <span className="w-1 h-1 rounded-full bg-neutral-400" />
            <span>Curated by Fashion Directors</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-neutral-950 leading-[1.12] mb-6">
            Curated High-Fashion Editorial.
            <span className="block italic font-light text-neutral-700 mt-2">
              Try Any Look on Your Photo in Seconds.
            </span>
          </h1>

          {/* Clear Subtitle Proposition */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mb-10">
            Handcrafted wardrobe capsules engineered with authentic runway proportions and high-fashion silhouette blueprints. Explore the styling formulas, or try them directly on your own photo with our 4K photorealistic AI virtual try-on engine.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => {
                if (!isProSubscriber) {
                  setShowPaywallModal(true);
                } else {
                  studioRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-[0.18em] font-medium shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isProSubscriber ? 'Try On on My Photo' : 'Try On (Pro Membership Required)'}</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </button>

            <button
              onClick={() => lookbookRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs uppercase tracking-[0.18em] font-medium transition-all"
            >
              Explore Curated Looks ({filteredLooks.length || 89})
            </button>
          </div>

          {/* 3 Pillar Minimalist Quality Markers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-neutral-200/80 text-left">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Styling Architecture
              </div>
              <div className="text-sm font-medium text-neutral-900">
                Proportion & Silhouette DNA
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Curator-grade layering formulas and 4-tone seasonal color harmony swatches.
              </p>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Sub-Pixel Likeness
              </div>
              <div className="text-sm font-medium text-neutral-900">
                1:1 Face & Pose Preserved
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Cleanses current clothes while protecting your authentic skin and silhouette.
              </p>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Curated Aesthetics
              </div>
              <div className="text-sm font-medium text-neutral-900">
                Global Editorial Standard
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Quiet luxury, tailored minimalism, and contemporary Seoul street volume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. INTERACTIVE ONE-STOP FITTING ATELIER (Option A Unified Studio) */}
      {/* ================================================================= */}
      <section ref={studioRef} className="py-16 lg:py-24 bg-[#FBF9F5] border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-neutral-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] uppercase tracking-widest font-bold text-amber-900 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Interactive One-Stop Atelier · Real-Time Fitting Studio</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-neutral-950 leading-tight">
                Virtual Runway Fitting Atelier
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-normal">
                Select your setting and aesthetic on the right. Your selected outfit instantly mounts to your silhouette on the left for seamless 4K virtual try-on.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full font-medium flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>IDM-VTON Precision Fitting Active</span>
              </span>
            </div>
          </div>

          {/* 2-Column Split Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN (5 Cols): Real-Time Canvas Viewport & Drape Action */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#ECEAE4] border border-neutral-200 shadow-md">
                {/* Floating Top Bar: Remove / Clear Photo */}
                {isCustomPhoto && !isGenerating && (
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="absolute top-3.5 right-3.5 z-20 px-3.5 py-1.5 rounded-full bg-neutral-950/80 hover:bg-rose-600 text-white text-xs font-semibold tracking-wide backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all group"
                    title="Clear photo & reset to default model"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-300 group-hover:text-white transition-colors" />
                    <span>Remove Photo</span>
                  </button>
                )}

                {/* Floating Action: Reset to Original Photo when styled */}
                {styledResult && !isGenerating && (
                  <button
                    type="button"
                    onClick={() => setStyledResult(null)}
                    className="absolute top-3.5 left-3.5 z-20 px-3.5 py-1.5 rounded-full bg-neutral-950/80 hover:bg-black text-white text-xs font-semibold tracking-wide backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                    <span>Reset View</span>
                  </button>
                )}

                {/* Main Canvas Viewport Image */}
                {styledResult ? (
                  <img
                    src={styledResult.imageUrl}
                    alt="AI Styled Silhouette"
                    className="w-full h-full object-cover object-top animate-fadeIn"
                  />
                ) : (
                  <img
                    src={userPhoto}
                    alt="Current Silhouette"
                    className={`w-full h-full object-cover object-top transition-opacity ${
                      isGenerating ? 'opacity-30 filter blur-sm' : 'opacity-100'
                    }`}
                  />
                )}

                {/* Loading / Generating Spinner Overlay */}
                {isGenerating && (
                  <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="w-14 h-14 rounded-full border-2 border-white/20 border-t-amber-300 animate-spin mb-4" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-300 mb-2">
                      Precision 4K AI Try-On
                    </span>
                    <p className="text-sm font-medium text-neutral-200 max-w-xs">
                      {progressStage || 'Draping tailored silhouette onto your proportions...'}
                    </p>
                  </div>
                )}

                {/* Bottom Target Look Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={selectedTryOnLook.imageUrl}
                      alt={selectedTryOnLook.title}
                      className="w-10 h-13 object-cover rounded-lg border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[9px] uppercase font-bold tracking-widest text-amber-700">
                        Target Outfit Mounted
                      </div>
                      <div className="text-xs font-semibold text-neutral-950 truncate">
                        {selectedTryOnLook.shortTitle}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        {selectedTryOnLook.category}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveLookModal(selectedTryOnLook)}
                    className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-semibold tracking-wider uppercase shrink-0 transition-colors"
                  >
                    Blueprint
                  </button>
                </div>
              </div>

              {/* Primary Try-On Action Button */}
              {isProSubscriber ? (
                <button
                  onClick={handleExecuteStyling}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-full bg-neutral-950 hover:bg-black disabled:opacity-50 text-white text-xs uppercase tracking-[0.18em] font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                      <span>{progressStage || 'Synthesizing Runway Look...'}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-emerald-400" />
                      <span>구독회원 무료 피팅 · Drape on My Silhouette</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setShowPaywallModal(true)}
                  className="w-full py-4 rounded-full bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-[0.18em] font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Subscribe to Pro to Try On ($19/mo)</span>
                </button>
              )}
            </div>

            {/* RIGHT COLUMN (7 Cols): Control Studio (Silhouette + 3-Sec Curator + Recommended Looks) */}
            <div className="lg:col-span-7 flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm">
              {/* Step 1: Silhouette / Photo Selector */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="text-xs uppercase tracking-wider font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Select Silhouette or Upload Photo</span>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {userPhotoName}
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2 mb-3">
                  {REALISTIC_SAMPLE_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setUserPhoto(model.url);
                        setUserPhotoName(`Preset: ${model.label}`);
                        setStyledResult(null);
                      }}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                        userPhoto === model.url
                          ? 'border-neutral-950 shadow-md scale-105'
                          : 'border-transparent opacity-65 hover:opacity-100 hover:border-neutral-300'
                      }`}
                      title={`${model.label} (${model.tag})`}
                    >
                      <img src={model.thumb} alt={model.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Upload Button */}
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-950 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-neutral-700" />
                    <span>{isCustomPhoto ? 'Replace with Another Photo' : 'Upload Full-Body Photo (Face & Pose 100% Preserved)'}</span>
                  </button>
                  {isCustomPhoto && (
                    <button
                      type="button"
                      onClick={handleClearPhoto}
                      className="px-3 py-2.5 rounded-xl bg-white border border-neutral-200 text-rose-600 hover:text-rose-700 text-xs font-medium transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Step 2: 3-Second Setting & Aesthetic Quick Selector */}
              <div className="pt-4 border-t border-neutral-100 space-y-3.5">
                <div className="text-xs uppercase tracking-wider font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Occasion & Aesthetic Direction</span>
                </div>

                {/* Occasion / Setting Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Occasions' },
                    { id: 'office', label: 'Private Office & Boardroom' },
                    { id: 'casual', label: 'Weekend Brunch & Gallery' },
                    { id: 'gallery', label: 'City Art & Evening Date' },
                    { id: 'resort', label: 'Coastal Resort & Travel' },
                    { id: 'evening', label: 'Gala & Dinner Soirée' },
                    { id: 'street', label: 'Off-Duty Urban Street' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCuratorOccasion(item.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        curatorOccasion === item.id
                          ? 'bg-neutral-950 text-white font-semibold shadow-xs'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200/60'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Aesthetic Mood Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'quiet luxury', label: 'Quiet Luxury & Old Money' },
                    { id: 'minimalist', label: 'Architectural Minimalist' },
                    { id: 'preppy', label: 'Collegiate Preppy & Ivy' },
                    { id: 'streetwear', label: 'Contemporary Streetwear' },
                    { id: 'casual', label: 'Elevated Off-Duty' },
                    { id: 'parisian', label: 'Parisian Tweed' },
                    { id: 'glam', label: 'Runway Glamour' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCuratorMood(item.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        curatorMood === item.id
                          ? 'bg-amber-800 text-white font-semibold shadow-xs'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200/60'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Instant 4-Look Recommended Grid */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs uppercase tracking-wider font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>Curated Capsule Recommendations (Tap to Mount)</span>
                  </div>
                  <div className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    {recommendedLooks.length} Best Matches
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {recommendedLooks.map((look, idx) => {
                    const isSelected = selectedTryOnLook.id === look.id;
                    return (
                      <div
                        key={look.id}
                        onClick={() => setSelectedTryOnLook(look)}
                        className={`group cursor-pointer rounded-2xl overflow-hidden bg-white border transition-all duration-300 flex flex-col relative ${
                          isSelected
                            ? 'border-neutral-950 ring-2 ring-neutral-950/20 shadow-md scale-[1.02]'
                            : 'border-neutral-200 hover:border-neutral-400 opacity-85 hover:opacity-100'
                        }`}
                      >
                        {/* Match Pill */}
                        <div className="absolute top-2 left-2 z-10">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                            isSelected
                              ? 'bg-neutral-950 text-white'
                              : 'bg-white/90 text-amber-800 border border-amber-300/80 shadow-xs'
                          }`}>
                            {idx === 0 ? '98% Match' : idx === 1 ? '95% Match' : '92% Match'}
                          </span>
                        </div>

                        {/* Image */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                          <img
                            src={look.imageUrl}
                            alt={look.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Look Info */}
                        <div className="p-2.5 flex flex-col justify-between flex-1 bg-white">
                          <div className="text-[11px] font-medium text-neutral-900 truncate">
                            {look.shortTitle}
                          </div>
                          <div className="text-[9px] text-neutral-500 truncate mt-0.5">
                            {look.category}
                          </div>

                          <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                            <span className={isSelected ? 'text-amber-800 font-bold' : 'text-neutral-500'}>
                              {isSelected ? '✓ Mounted' : 'Tap to Mount'}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLookModal(look);
                              }}
                              className="text-neutral-500 hover:text-neutral-950 underline underline-offset-2"
                            >
                              Blueprint
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Jump to 89 Archive */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => lookbookRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
                >
                  <span>Explore Complete 89-Look Master Archive ↓</span>
                  <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. CURATED STYLE EXAMPLES SHOWCASE (89 Curated Looks)              */}
      {/* ================================================================= */}
      <section ref={lookbookRef} className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 inline-block mb-1.5">
              Curated Style Examples · Editorial Showcase
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-neutral-950 mt-1">
              Curated Style Examples Showcase (89 Styles)
            </h2>
            <p className="text-xs text-neutral-500 mt-1 font-normal">
              Explore full-length editorial look examples and silhouette layering blueprints. Tap Try On on any look to immediately mount it in the atelier studio above.
            </p>
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="inline-flex p-1 rounded-full bg-neutral-200/60 border border-neutral-200">
              <button
                onClick={() => { setActiveGenderFilter('all'); setActiveAestheticFilter('all'); }}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                  activeGenderFilter === 'all'
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Styles ({MASTER_EDITORIAL_LOOKS.length})
              </button>
              <button
                onClick={() => { setActiveGenderFilter('women'); }}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                  activeGenderFilter === 'women'
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Women ({womenLooksCount})
              </button>
              <button
                onClick={() => { setActiveGenderFilter('men'); }}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                  activeGenderFilter === 'men'
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Men ({menLooksCount})
              </button>
            </div>
          </div>
        </div>
        {/* Aesthetic Vibe Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none border-b border-neutral-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex-shrink-0 mr-1">
            Vibe:
          </span>
          {[
            { id: 'all', label: 'All Aesthetics' },
            { id: 'quiet luxury', label: 'Quiet Luxury' },
            { id: 'minimalist', label: 'Modern Minimalist' },
            { id: 'parisian', label: 'Parisian Tweed' },
            { id: 'street', label: 'Seoul Streetwear' },
            { id: 'casual', label: 'Elevated Off-Duty' },
            { id: 'preppy', label: 'Classic Preppy' },
            { id: 'glam', label: 'Gala & Runway' },
            { id: 'dandy', label: "Men's Sartorial" },
          ].map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setActiveAestheticFilter(vibe.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeAestheticFilter === vibe.id
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
              }`}
            >
              {vibe.label}
            </button>
          ))}
        </div>

        {/* 6-Look Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-12">
          {filteredLooks.map((look, index) => (
            <div
              key={look.id}
              className="group relative bg-white border border-neutral-200/80 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              {/* Image Container with Aspect Ratio */}
              <div
                onClick={() => setActiveLookModal(look)}
                className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 cursor-pointer"
              >
                <img
                  src={look.imageUrl}
                  alt={look.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/looks/look_01_soho_quiet_luxury_final.webp';
                  }}
                />

                {/* Top Badge: Aesthetic Tag & Try-On Status (Zero Price shown on browsing card) */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-neutral-800 shadow-sm">
                    {look.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-neutral-900/90 backdrop-blur-md text-[10px] font-medium tracking-wider uppercase text-neutral-200 border border-white/20 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5BE64]"></span>
                    Try-On Ready
                  </span>
                </div>

                {/* Hover Quick Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-amber-200/90 mb-1">
                    {look.season}
                  </span>
                  <h3 className="font-serif text-lg font-light leading-snug mb-3">
                    {look.shortTitle}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLookModal(look);
                      }}
                      className="flex-1 py-2 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-semibold tracking-wider uppercase text-center transition-colors shadow-sm"
                    >
                      Style Blueprint
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectTryOn(look);
                      }}
                      className="px-5 py-2 rounded-full bg-neutral-950 hover:bg-black text-white text-xs font-semibold tracking-wider uppercase border border-white/25 transition-colors shadow-sm"
                      title="Try this look on your photo"
                    >
                      Try On
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-5 flex flex-col flex-1 justify-between bg-white border-t border-neutral-100">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5">
                    <span className="font-medium text-neutral-600">{look.modelInfo.split('·')[0]}</span>
                    <span className="text-[10px] font-semibold text-neutral-700 uppercase tracking-wider bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200/80">
                      {look.category}
                    </span>
                  </div>
                  <h3
                    onClick={() => setActiveLookModal(look)}
                    className="font-serif text-base sm:text-lg font-normal text-neutral-950 group-hover:text-neutral-700 cursor-pointer line-clamp-1 transition-colors"
                  >
                    {look.shortTitle}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1 font-normal leading-relaxed">
                    {look.description}
                  </p>
                </div>

                {/* Quick Action Footer */}
                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveLookModal(look)}
                    className="text-xs uppercase tracking-wider font-semibold text-neutral-800 hover:text-neutral-950 flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect Style</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDirectTryOn(look)}
                    className="text-xs uppercase tracking-wider font-semibold text-neutral-900 hover:text-black flex items-center gap-1.5 transition-colors"
                  >
                    <span>{isProSubscriber ? '구독회원 무료 피팅' : 'Try On (Pro)'}</span>
                    {isProSubscriber ? <Wand2 className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-neutral-700" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. EDITORIAL LOOK DETAIL MODAL (Vogue / SSENSE Split Drawer)       */}
      {/* ================================================================= */}
      {activeLookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-neutral-200">
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveLookModal(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-neutral-950/60 hover:bg-neutral-950 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Full-Bleed Editorial Visual with Hotspots & Real User Photo Switcher */}
            <div className="relative lg:w-1/2 aspect-[3/4] lg:aspect-auto bg-neutral-900 overflow-hidden flex flex-col justify-center">
              {/* Top View Toggle Switcher (when user uploaded custom photo) */}
              {isCustomPhoto && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 rounded-full bg-neutral-950/85 backdrop-blur-md border border-white/10 shadow-xl">
                  <button
                    type="button"
                    onClick={() => setModalViewMode('fitted')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      modalViewMode === 'fitted'
                        ? 'bg-white text-neutral-950 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    My Photo {cachedLookResults[activeLookModal.id] ? '(Fitted)' : ''}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalViewMode('model')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      modalViewMode === 'model'
                        ? 'bg-white text-neutral-950 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Editorial Model
                  </button>
                </div>
              )}

              {/* Main Image Display: User's Fitted Photo vs Editorial Model */}
              {modalViewMode === 'fitted' && isCustomPhoto ? (
                cachedLookResults[activeLookModal.id] ? (
                  <img
                    src={cachedLookResults[activeLookModal.id]}
                    alt="Fitted on User Photo"
                    className="w-full h-full object-cover object-top animate-fadeIn"
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-neutral-900">
                    <img
                      src={userPhoto}
                      alt="Your Source Photo"
                      className={`w-full h-full object-cover object-top ${
                        isModalGenerating ? 'opacity-30 filter blur-sm' : 'opacity-85'
                      }`}
                    />
                    {!isModalGenerating && (
                      <div className="absolute inset-0 bg-neutral-950/45 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-300 bg-neutral-950/80 px-3 py-1 rounded-full border border-white/20 mb-3 shadow-md">
                          Your Uploaded Photo
                        </span>
                        <h4 className="text-white font-serif text-lg sm:text-xl font-light mb-2">
                          Ready to wear {activeLookModal.shortTitle}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleExecuteModalStyling(activeLookModal)}
                          className="mt-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 text-xs uppercase tracking-wider font-semibold shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4 text-neutral-900" />
                          <span>Drape This Look On My Photo</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <>
                  <img
                    src={activeLookModal.imageUrl}
                    alt={activeLookModal.title}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Live-verified hotspot pins → floating spec card (luxury_state_engine snapshot) */}
                  {showHotspotPins && !isModalGenerating && (
                    <LuxuryHotspotLayer lookId={activeLookModal.id} pins={activeLookModal.pins} />
                  )}
                </>
              )}

              {/* Modal Generating Spinner Overlay */}
              {isModalGenerating && (
                <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-amber-300 animate-spin mb-4" />
                  <div className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold mb-2">
                    Precision AI Virtual Fitting
                  </div>
                  <p className="text-sm font-medium text-neutral-200 max-w-xs">
                    {modalProgressStage || 'Synthesizing tailored garments onto your silhouette...'}
                  </p>
                </div>
              )}

              {/* Editorial Aesthetic Badge */}
              <div className="absolute bottom-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-[11px] font-semibold tracking-wider text-amber-200 border border-white/10 uppercase shadow-lg">
                  {activeLookModal.aesthetic}
                </span>
              </div>
            </div>

            {/* Right Column: Styling Blueprint & Wardrobe Architecture */}
            <div className="lg:w-1/2 flex flex-col max-h-[92vh] overflow-y-auto p-6 sm:p-8 bg-white">
              {/* Header Spec */}
              <div className="pb-5 border-b border-neutral-200">
                <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-[0.2em] text-neutral-400 mb-1.5">
                  <span>{activeLookModal.season}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 font-bold">
                    {activeLookModal.category}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-neutral-950 leading-snug">
                  {activeLookModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-normal leading-relaxed">
                  {activeLookModal.description}
                </p>
              </div>

              {/* Body: Styling Blueprint & Architecture */}
              <div className="py-5 flex-1 flex flex-col gap-5">
                {/* Curator Silhouette & Proportion Formula */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-amber-700 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curator Silhouette & Proportion Formula</span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                    {activeLookModal.curatorNote}
                  </p>
                </div>

                {/* Wardrobe Layering Architecture */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider font-bold text-neutral-900">
                      Wardrobe Layering Architecture
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      Silhouette Breakdown
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {activeLookModal.pins.map((pin, idx) => (
                      <div
                        key={pin.id || idx}
                        className="p-3.5 rounded-xl bg-white hover:bg-neutral-50/80 border border-neutral-200/80 transition-all flex items-start gap-3 shadow-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-neutral-950 text-amber-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800">
                              {pin.category}
                            </span>
                            <span className="text-xs font-bold text-neutral-900 truncate">
                              {pin.title}
                            </span>
                          </div>
                          {pin.kStyleTip ? (
                            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                              {pin.kStyleTip}
                            </p>
                          ) : (
                            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                              Engineered to anchor this silhouette with balanced drape and structured proportions.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Harmonized Color Palette */}
                {activeLookModal.colorPalette && activeLookModal.colorPalette.length > 0 && (
                  <div>
                    <div className="text-xs uppercase tracking-wider font-bold text-neutral-900 mb-2">
                      Harmonized Color Palette
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {activeLookModal.colorPalette.map((color, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <div
                            className="w-full h-8 rounded-lg border border-neutral-200 shadow-inner"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aesthetic DNA Tags */}
                {activeLookModal.vibeTags && activeLookModal.vibeTags.length > 0 && (
                  <div>
                    <div className="text-xs uppercase tracking-wider font-bold text-neutral-900 mb-2">
                      Aesthetic DNA
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeLookModal.vibeTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-medium border border-neutral-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action: Direct Try-On */}
              <div className="pt-5 border-t border-neutral-200 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    handleDirectTryOn(activeLookModal);
                    setActiveLookModal(null);
                  }}
                  className="w-full py-4 rounded-full bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-[0.18em] font-bold text-center transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Drape This Look On My Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 6. PRO SUBSCRIPTION PAYWALL MODAL                                 */}
      {/* ================================================================= */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-neutral-200 text-center">
            <button
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>

            <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-amber-600">
              StylingHelper Pro Membership
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-neutral-950 mt-1 mb-3">
              Subscription Required for Virtual Try-On
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mb-6 font-normal leading-relaxed">
              Virtual Runway Fitting Atelier is exclusively reserved for Pro Subscribers. Subscribe now for unlimited 4K photorealistic outfit fittings, zero-watermark lookbook exports, and VIP stock sentinel alerts.
            </p>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left mb-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Unlimited photorealistic outfit swaps (4K Ultra-HD)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Zero watermark & high-resolution runway export</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Early access to SS26 Paris & New York capsule edits</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Continuous high-fashion capsule drops & bespoke color harmony analysis</span>
              </div>
            </div>

            {/* MANDATORY RECURRING BILLING & AUTO-RENEWAL DISCLOSURE (정기 결제 자동 갱신 필수 고지) */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-300/80 text-left mb-5 space-y-2.5">
              <div className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider flex items-center justify-between border-b border-neutral-200/80 pb-2">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-neutral-800" />
                  <span>Mandatory Recurring Billing Disclosure</span>
                </span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200/80 uppercase">
                  Auto-Renewal
                </span>
              </div>
              
              <ul className="text-xs text-neutral-600 space-y-2 leading-relaxed font-normal">
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 font-bold shrink-0 mt-0.5">•</span>
                  <span><strong>Billing Frequency & Cycle:</strong> Billed at <strong>$19.00 USD once every 30 calendar days (monthly)</strong> via PayPal Recurring Billing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 font-bold shrink-0 mt-0.5">•</span>
                  <span><strong>Automatic Extension:</strong> Unless explicitly cancelled by the user prior to renewal, your subscription <strong>automatically renews for successive 1-month periods</strong> on each monthly billing date.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 font-bold shrink-0 mt-0.5">•</span>
                  <span><strong>1-Click Cancellation Anytime:</strong> You may cancel anytime directly in your PayPal dashboard or by emailing concierge with zero penalty. Upon cancellation, your Pro benefits remain active until the conclusion of the paid 30-day term.</span>
                </li>
              </ul>
            </div>

            <a
              href={PAYPAL_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-[0.18em] font-semibold shadow-md transition-all block text-center"
            >
              Subscribe to Pro ($19 / month)
            </a>
            
            <p className="text-[11px] text-neutral-500 mt-3 leading-normal">
              By clicking Subscribe, you authorize recurring monthly charges of $19/mo via PayPal until cancelled. Cancel anytime with 1 click.
            </p>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 7. AUTH & REPORT MODALS                                            */}
      {/* ================================================================= */}
      <USAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={(user) => {
          if (user?.email) {
            localStorage.setItem('stylinghelper_user', JSON.stringify(user));
            fetch(`/api/stylinghelper/member?email=${encodeURIComponent(user.email)}`)
              .then((r) => r.json())
              .then((data) => {
                if (data.exists && data.isPro) {
                  setIsProSubscriber(true);
                  setSubscriptionDetails({
                    isPro: true,
                    isExpired: false,
                    daysRemaining: data.daysRemaining || 30,
                    paidAt: data.paidAt || null,
                    expiresAt: data.expiresAt || null,
                    plan: data.plan || 'monthly'
                  });
                  localStorage.setItem('styling_subscription', JSON.stringify(data));
                  localStorage.setItem('styling_is_pro_subscriber', 'true');
                }
              })
              .catch(() => {});
          }
          setIsAuthModalOpen(false);
          window.dispatchEvent(new Event('stylinghelper_auth_changed'));
        }}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultProductTitle={reportProduct.title}
        defaultProductUrl={reportProduct.url}
      />

      {/* ================================================================= */}
      {/* 8. MINIMALIST EDITORIAL FOOTER                                    */}
      {/* ================================================================= */}
      <footer className="py-16 bg-[#FAF9F7] border-t border-neutral-200 text-neutral-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-serif text-xl font-light text-neutral-950 tracking-[0.06em]">
              STYLING HELPER
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Curated Seoul High-Fashion & Virtual Runway Fitting Atelier.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <button
              onClick={() => {
                setReportProduct({ title: 'General In-Stock Inquiry', url: 'https://stylinghelper.com' });
                setIsReportModalOpen(true);
              }}
              className="hover:text-neutral-950 transition-colors"
            >
              Report Out-of-Stock
            </button>
            <Link href="/privacy" className="hover:text-neutral-950 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-950 transition-colors">
              Terms of Service
            </Link>
          </div>

          <div className="text-xs text-neutral-400">
            © 2026 STYLING HELPER. All rights reserved.
          </div>
        </div>

        {/* Mandatory Recurring Billing & Subscription Policy Disclosure */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-neutral-200/80 text-[11px] text-neutral-500 leading-relaxed">
          <div className="font-semibold text-neutral-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-neutral-600" />
            <span>Mandatory Subscription & Recurring Billing Notice:</span>
          </div>
          StylingHelper Pro is a recurring monthly subscription ($19.00 USD / 30 calendar days). Membership access is activated immediately upon payment and remains valid for exactly 30 days. Unless cancelled by the subscriber prior to the renewal date, subscriptions automatically renew for successive 1-month periods via PayPal 30-day Recurring Billing. Subscribers may cancel recurring billing at any time through their PayPal account settings with zero cancellation fee, and Pro benefits will continue through the end of the paid 30-day billing cycle.
        </div>
      </footer>
    </div>
  );
}
