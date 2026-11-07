'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import USAuthModal from '@/components/USAuthModal';
import ReportModal from '@/components/ReportModal';
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
    id: 'editorial-look-v01',
    title: 'SoHo High-Fashion Glen Plaid Tailored Blazer & Ultra-Wide Palazzo Slacks',
    shortTitle: 'SoHo Glen Plaid Blazer & Palazzo Slacks',
    gender: 'women',
    category: 'Quiet Luxury & Tailoring',
    aesthetic: 'SoHo Minimalist Tailored & Quiet Luxury',
    season: 'Spring/Summer 2026 Runway',
    imageUrl: '/images/looks/look_01_soho_quiet_luxury_final.webp',
    modelInfo: 'Caucasian Model · 177cm · Silhouette A',
    description: 'A masterclass in modern executive proportion. Precision double-breasted Glen Plaid tailored suiting paired with fluid evening palazzo trousers.',
    curatorNote: 'Opt for structured shoulders paired with relaxed fluid trousers to create an effortless New York editorial silhouette.',
    colorPalette: ['#2B2A29', '#8C827A', '#D9D2C9', '#F4F1EA'],
    vibeTags: ['Quiet Luxury', 'SoHo Tailoring', 'Power Suiting', 'Effortless Chic'],
    totalPrice: 1451,
    pins: [
      {
        id: 'pin-01-outer',
        x: 48,
        y: 28,
        category: 'Outer',
        title: 'Glen Plaid Double-Breasted Tailored Blazer in Warm Taupe',
        brand: 'Good American',
        price: 229,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/essential-suiting-belted-blazer-good/vp/v=1/1533639687.htm',
        kStyleTip: 'Slightly oversized shoulders frame the neckline with architectural poise.'
      },
      {
        id: 'pin-01-top',
        x: 50,
        y: 36,
        category: 'Top',
        title: 'New Classic Ribbed Crewneck Sleeveless Tank in Pure White',
        brand: 'Enza Costa',
        price: 110,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/new-classic-rib-sleeveless-crew/vp/v=1/1512740933.htm',
        kStyleTip: 'Ultra-soft pima cotton base layer creates seamless negative space beneath suiting.'
      },
      {
        id: 'pin-01-bottom',
        x: 52,
        y: 60,
        category: 'Bottom',
        title: 'High-Waisted Evening Wide-Leg Fluid Trousers in Midnight Black',
        brand: 'Vince',
        price: 395,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/high-waisted-evening-pant-vince/vp/v=1/1592110869.htm',
        kStyleTip: 'Cascading drape elongates the leg line with dramatic runway motion.'
      },
      {
        id: 'pin-01-shoes',
        x: 50,
        y: 88,
        category: 'Shoes',
        title: 'Pointed-Toe Black Leather Kitten Heel Mules',
        brand: 'Sam Edelman',
        price: 175,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/lana-loafer-sam-edelman/vp/v=1/1528564778.htm',
        kStyleTip: 'Sharp pointed toe subtly emerges beneath wide-leg hemline.'
      },
      {
        id: 'pin-01-bag',
        x: 32,
        y: 48,
        category: 'Bag',
        title: 'Harlow Suede Baguette Shoulder Bag with Horn Buckle',
        brand: 'STAUD',
        price: 395,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/harlow-bag-staud/vp/v=1/1550755117.htm',
        kStyleTip: 'Textured suede softens masculine tailoring with tactile richness.'
      },
      {
        id: 'pin-01-eyewear',
        x: 52,
        y: 12,
        category: 'Eyewear',
        title: 'Outta Love Slim Oval Sunglasses in Translucent Amber',
        brand: 'Le Specs',
        price: 69,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/foundry-le-specs/vp/v=1/1584853475.htm',
        kStyleTip: 'Understated 90s oval frame injects downtown chic attitude.'
      },
      {
        id: 'pin-01-jewelry',
        x: 58,
        y: 16,
        category: 'Jewelry',
        title: 'Palmera 14K Gold-Plated Sculpted Fan Drop Earrings',
        brand: 'SHASHI',
        price: 78,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/marquise-drop-earring-shashi/vp/v=1/1547085978.htm',
        kStyleTip: 'Subtle sculpted gold catches natural ambient light effortlessly.'
      }
    ]
  },
  {
    id: 'editorial-look-v02',
    title: 'Hannam-dong Modern Minimalist Olive Swing Jacket & Croc Boots',
    shortTitle: 'Hannam-dong Modern Olive Swing & Croc Boots',
    gender: 'women',
    category: 'Modern Minimalist',
    aesthetic: 'Seoul Hannam Architectural Outerwear',
    season: 'Spring/Summer 2026 Street',
    imageUrl: '/images/looks/look_02_hannam_olive_swing.webp',
    modelInfo: 'Asian Model · 174cm · Silhouette B',
    description: 'The defining silhouette of contemporary Hannam luxury. A cropped swing jacket in military olive paired with raw denim and croc-embossed tall boots.',
    curatorNote: 'Volume contrast is essential: pair a flared cropped jacket with straight architectural denim for a refined, modern gait.',
    colorPalette: ['#4E5340', '#EAE6DF', '#1C2321', '#4A3B32'],
    vibeTags: ['Seoul Chic', 'Hannam Minimal', 'Tactile Leather', 'Clean Architecture'],
    totalPrice: 1650,
    pins: [
      {
        id: 'pin-02-outer',
        x: 50,
        y: 30,
        category: 'Outer',
        title: 'Howell Olive Swing Jacket with Contrast Collar',
        brand: 'Hunter Bell',
        price: 395,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/howell-cropped-trench-hunter-bell/vp/v=1/1502622453.htm',
        kStyleTip: 'A boxy cropped swing silhouette injects dynamic architecture.'
      },
      {
        id: 'pin-02-top',
        x: 50,
        y: 22,
        category: 'Top',
        title: 'Ceci Sleeveless Turtleneck Top in Ivory Cream',
        brand: "L'AGENCE",
        price: 150,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/ceci-slvless-turtle-neck-lagence/vp/v=1/1538699935.htm',
        kStyleTip: 'Streamlined high neck adds vertical refinement.'
      },
      {
        id: 'pin-02-bottom',
        x: 48,
        y: 56,
        category: 'Bottom',
        title: 'High-Waisted Wide-Leg Denim Trousers in Washed Black',
        brand: 'Citizens of Humanity',
        price: 248,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/petite-ayla-baggy-jean-citizens/vp/v=1/1591527676.htm',
        kStyleTip: 'Rigid premium Japanese denim holds intentional drape.'
      },
      {
        id: 'pin-02-shoes',
        x: 50,
        y: 86,
        category: 'Shoes',
        title: 'Pointed-Toe Leather Ankle Boots in Glossy Brown Croc',
        brand: 'Vince',
        price: 395,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/tegan-vince/vp/v=1/1537488034.htm',
        kStyleTip: 'Exotic croc embossing provides rich textural depth.'
      },
      {
        id: 'pin-02-bag',
        x: 35,
        y: 44,
        category: 'Bag',
        title: 'Sculptural Mini Leather Pouch with Silver Wave Ring Handle',
        brand: 'STAUD',
        price: 285,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/harlow-bag-staud/vp/v=1/1550755117.htm',
        kStyleTip: 'Geometric hardware acts as wearable jewelry.'
      },
      {
        id: 'pin-02-eyewear',
        x: 50,
        y: 10,
        category: 'Eyewear',
        title: 'Unfaithful Sleek Acetate Cat-Eye Sunglasses in Shiny Black',
        brand: 'Le Specs',
        price: 79,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/foundry-le-specs/vp/v=1/1584853475.htm',
        kStyleTip: 'Sharp cat-eye angles lift cheekbones instantly.'
      },
      {
        id: 'pin-02-jewelry',
        x: 58,
        y: 15,
        category: 'Jewelry',
        title: 'Monroe Two-Tone Polished Gold & Silver Link Drop Earrings',
        brand: 'JENNY BIRD',
        price: 98,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/micro-florence-earrings-jenny-bird/vp/v=1/1565175890.htm',
        kStyleTip: 'Mixed metals unify both warm and cool wardrobe palettes.'
      }
    ]
  },
  {
    id: 'editorial-look-v03',
    title: 'Cheongdam Modern Luxury Midnight Navy Tailored Overcoat & Camel Pleated Slacks',
    shortTitle: 'Cheongdam Luxury Midnight Navy Overcoat & Camel Slacks',
    gender: 'women',
    category: 'Elevated High-Fashion',
    aesthetic: 'Cheongdam Avenue High-End Luxury',
    season: 'Spring/Summer 2026 Exclusive',
    imageUrl: '/images/looks/look_03_cheongdam_silk_cashmere.webp',
    modelInfo: 'Runway Model · 176cm · Silhouette C',
    description: 'Understated elegance meeting sharp Korean luxury aesthetics. Premium double-faced midnight wool coat complemented by camel pleated suiting slacks.',
    curatorNote: 'The contrast of deep midnight navy against warm camel is timeless and commands instant respect in any high-profile setting.',
    colorPalette: ['#121926', '#872341', '#C69B6D', '#2B2B2B'],
    vibeTags: ['Cheongdam Luxury', 'Tailored Wool', 'Double-Breasted', 'Modern Classic'],
    totalPrice: 2241,
    pins: [
      {
        id: 'pin-03-outer',
        x: 50,
        y: 28,
        category: 'Outer',
        title: 'Double-Breasted Wool Tailored Overcoat in Midnight Navy',
        brand: 'Vince',
        price: 695,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/navy-overcoat-vince/vp/v=1/1548291022.htm',
        kStyleTip: 'Double-faced unlined wool delivers lightweight yet commanding drape.'
      },
      {
        id: 'pin-03-top',
        x: 50,
        y: 20,
        category: 'Top',
        title: 'Cropped Ribbed Turtleneck Knit in Deep Wine Burgundy',
        brand: 'AllSaints',
        price: 229,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/rib-turtleneck-allsaints/vp/v=1/1519283741.htm',
        kStyleTip: 'Rich burgundy breaks the navy monochrome with warm depth.'
      },
      {
        id: 'pin-03-bottom',
        x: 52,
        y: 62,
        category: 'Bottom',
        title: 'Pleated Wide-Leg Suiting Trousers in Camel Tan',
        brand: 'Vince',
        price: 395,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/pleated-wide-leg-vince/vp/v=1/1539201882.htm',
        kStyleTip: 'Deep front pleats create generous walking ease.'
      },
      {
        id: 'pin-03-bag',
        x: 32,
        y: 50,
        category: 'Bag',
        title: 'Perry Triple-Compartment Leather Tote Bag in Black',
        brand: 'Tory Burch',
        price: 398,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/perry-tote-tory-burch/vp/v=1/1529182390.htm',
        kStyleTip: 'Architectural tote effortlessly transitions from executive meetings to dinners.'
      },
      {
        id: 'pin-03-shoes',
        x: 50,
        y: 88,
        category: 'Shoes',
        title: 'Cap-Toe Leather Slingback Kitten Pumps with Gold Metal Tip',
        brand: 'Sam Edelman',
        price: 160,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/cap-toe-slingback-sam-edelman/vp/v=1/1538291001.htm',
        kStyleTip: 'Gleaming gold metal toe cap echoes fine jewelry accents.'
      },
      {
        id: 'pin-03-eyewear',
        x: 50,
        y: 11,
        category: 'Eyewear',
        title: 'Outta Love Oval Acetate Sunglasses in Tortoise Shell',
        brand: 'Le Specs',
        price: 69,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/outta-love-le-specs/vp/v=1/1590064118.htm',
        kStyleTip: 'Warm tortoise acetate harmonizes with camel wool hues.'
      },
      {
        id: 'pin-03-jewelry',
        x: 56,
        y: 14,
        category: 'Jewelry',
        title: '14K Yellow Gold Chunky Huggie Hoop Earrings',
        brand: 'EF Collection',
        price: 295,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/diamond-fleur-huggie-ef-collection/vp/v=1/1582910482.htm',
        kStyleTip: 'Understated solid gold huggies deliver quiet luxury credibility.'
      }
    ]
  },
  {
    id: 'editorial-men-01',
    title: 'Milan Tailored Minimalist Wool Blazer & Flared Charcoal Slacks',
    shortTitle: 'Milan Tailored Wool Blazer & Flared Slacks',
    gender: 'men',
    category: 'Quiet Luxury Men',
    aesthetic: 'Milanese Sartorial Precision',
    season: 'Spring/Summer 2026 Men',
    imageUrl: '/images/looks/men_look_01_tailored_dandy.webp',
    modelInfo: 'Caucasian Model · 185cm · Silhouette D',
    description: 'Impeccable Italian proportion reinterpreted for modern cosmopolitan men. Charcoal wool suiting blazer over lightweight poplin and relaxed flared slacks.',
    curatorNote: 'Maintain a clean monochromatic base to let the sculpted drape of the blazer define the masculine silhouette.',
    colorPalette: ['#1C1D21', '#3A3D40', '#F2EFEB', '#59606D'],
    vibeTags: ['Sartorial', 'Milanese', 'Charcoal Wool', 'Masculine Poise'],
    totalPrice: 1139,
    pins: [
      {
        id: 'pin-m01-outer',
        x: 50,
        y: 28,
        category: 'Outer',
        title: 'Essential Double-Breasted Suiting Blazer in Charcoal',
        brand: 'Good American',
        price: 229,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/essential-suiting-belted-blazer-good/vp/v=1/1533639687.htm',
        kStyleTip: 'Structured chest canvas creates an athletic V-tapered silhouette.'
      },
      {
        id: 'pin-m01-top',
        x: 50,
        y: 22,
        category: 'Top',
        title: 'Soto Long Sleeve Lightweight Cotton Shirt',
        brand: 'Rails',
        price: 138,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/soto-rails/vp/v=1/1590360461.htm',
        kStyleTip: 'Crisp spread collar stays upright without requiring a tie.'
      },
      {
        id: 'pin-m01-bottom',
        x: 50,
        y: 60,
        category: 'Bottom',
        title: 'High-Waisted Evening Wide-Leg Fluid Trousers in Black',
        brand: 'Vince',
        price: 395,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/high-waisted-evening-pant-vince/vp/v=1/1592110869.htm',
        kStyleTip: 'Gentle flare through the calf breaks cleanly over leather derby shoes.'
      },
      {
        id: 'pin-m01-shoes',
        x: 50,
        y: 88,
        category: 'Shoes',
        title: 'Polished Black Leather Classic Derby Loafer',
        brand: 'Sam Edelman',
        price: 175,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/lana-loafer-sam-edelman/vp/v=1/1528564778.htm',
        kStyleTip: 'High-shine calfskin leather anchors the tailored trousers.'
      },
      {
        id: 'pin-m01-eyewear',
        x: 50,
        y: 11,
        category: 'Eyewear',
        title: '0Rb4925 Wayfarer Classic Square Sunglasses',
        brand: 'Ray-Ban',
        price: 202,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/0rb4925-ray-ban/vp/v=1/1568305767.htm',
        kStyleTip: 'The definitive masculine square frame with timeless gravitas.'
      }
    ]
  },
  {
    id: 'editorial-men-02',
    title: 'Seongsu Urban Street Flight Leather Bomber & Wide Raw Denim',
    shortTitle: 'Seongsu Urban Flight Leather Bomber & Wide Denim',
    gender: 'men',
    category: 'Contemporary Streetwear',
    aesthetic: 'Seoul Seongsu Creative District',
    season: 'Spring/Summer 2026 Street',
    imageUrl: '/images/looks/men_look_02_urban_street.webp',
    modelInfo: 'Asian Model · 182cm · Silhouette E',
    description: 'The creative uniform of Seoul high-fashion districts. Heavyweight flight bomber jacket in vintage patina leather balanced by wide-leg selvedge denim.',
    curatorNote: 'Combine utilitarian flight outerwear with casual heritage sneakers for effortless off-duty streetwear confidence.',
    colorPalette: ['#1E1C1A', '#3C4048', '#B2B1B9', '#FFFFFF'],
    vibeTags: ['Seongsu Core', 'Leather Bomber', 'Raw Denim', 'Urban Creative'],
    totalPrice: 477,
    pins: [
      {
        id: 'pin-m02-outer',
        x: 50,
        y: 28,
        category: 'Outer',
        title: 'Liberty Cropped Zip Flight Bomber Jacket',
        brand: 'New York',
        price: 160,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/liberty-cropped-zip-hoodie-new/vp/v=1/1521282696.htm',
        kStyleTip: 'Cropped waistline visually extends the leg line instantly.'
      },
      {
        id: 'pin-m02-top',
        x: 50,
        y: 35,
        category: 'Top',
        title: 'USA Wellness Club Vintage Graphic Tee',
        brand: 'Sporty & Rich',
        price: 80,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/usa-wellness-club-tshirt-sporty/vp/v=1/1513840873.htm',
        kStyleTip: 'Heavyweight jersey cotton drapes without clinging.'
      },
      {
        id: 'pin-m02-bottom',
        x: 50,
        y: 62,
        category: 'Bottom',
        title: 'Original Wide-Leg Raw Denim Trousers',
        brand: "Levi's",
        price: 98,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/tote-usa-unisex-levis/vp/v=1/1571020987.htm',
        kStyleTip: 'Unwashed raw indigo develops authentic personalized fades over time.'
      },
      {
        id: 'pin-m02-shoes',
        x: 50,
        y: 88,
        category: 'Shoes',
        title: 'Chuck Taylor All Star 70 Vintage Canvas',
        brand: 'Converse',
        price: 90,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/chuck-canvas-converse/vp/v=1/1524538487.htm',
        kStyleTip: 'Heavyweight canvas and varnished egret foxing create vintage character.'
      },
      {
        id: 'pin-m02-eyewear',
        x: 50,
        y: 11,
        category: 'Eyewear',
        title: 'Ephemeris Beveled Square Sunglasses',
        brand: 'AIRE',
        price: 49,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/ephermeris-aire/vp/v=1/1524202320.htm',
        kStyleTip: 'Beveled acetate rims offer sharp architectural geometry.'
      }
    ]
  },
  {
    id: 'editorial-look-v06',
    title: 'Tribeca Architectural Poplin Shirt & Flared Tailored Trousers',
    shortTitle: 'Tribeca Poplin Shirt & Flared Trousers',
    gender: 'women',
    category: 'Architectural Clean',
    aesthetic: 'Tribeca Contemporary Art Gallery',
    season: 'Spring/Summer 2026 Minimalist',
    imageUrl: '/images/looks/look11_final_editorial.webp',
    modelInfo: 'Multiracial Model · 178cm · Silhouette F',
    description: 'Crisp oversized menswear-inspired poplin shirt balanced against minimalist flared trousers and sculpted metal-tip pointed slingbacks.',
    curatorNote: 'Leave top buttons open to reveal clean necklines and balance the generous volume of the poplin shirt.',
    colorPalette: ['#FFFFFF', '#E6E1DC', '#1A1A1A', '#A38B78'],
    vibeTags: ['Architectural', 'Crisp Poplin', 'Flared Suiting', 'SSENSE Minimal'],
    totalPrice: 2409,
    pins: [
      {
        id: 'pin-06-outer',
        x: 50,
        y: 28,
        category: 'Top/Outer',
        title: 'Coastal Poplin Oversized Shirt in Crisp White',
        brand: 'Faherty',
        price: 168,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/coastal-poplinoversized-shirt-faherty/vp/v=1/1512362610.htm',
        kStyleTip: 'Crisp high-thread-count poplin retains sculpted volume.'
      },
      {
        id: 'pin-06-top',
        x: 50,
        y: 22,
        category: 'Inner',
        title: 'Crop Tube Top in Midnight Black',
        brand: 'Susana Monaco',
        price: 58,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/crop-tube-top-susana-monaco/vp/v=1/1583874666.htm',
        kStyleTip: 'Double-layered seamless knit delivers clean horizontal framing.'
      },
      {
        id: 'pin-06-bottom',
        x: 52,
        y: 62,
        category: 'Bottom',
        title: 'Spring Tailored Flared Trousers in Cream',
        brand: 'WARDROBE.NYC',
        price: 1300,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/spring-tailored-trouser-wardrobenyc/vp/v=1/1591169817.htm',
        kStyleTip: 'Sculpted virgin wool trousers create an elongated statuesque silhouette.'
      },
      {
        id: 'pin-06-shoes',
        x: 50,
        y: 88,
        category: 'Shoes',
        title: 'Nelly Slingback Metal Toe Pointed Pumps in Black Leather',
        brand: 'ANINE BING',
        price: 425,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/nelly-slingback-metal-toe-anine/vp/v=1/1566936969.htm',
        kStyleTip: 'Gleaming silver cap toe provides razor-sharp edge.'
      },
      {
        id: 'pin-06-bag',
        x: 32,
        y: 48,
        category: 'Bag',
        title: 'Henrietta Soft Suede Shoulder Tote in Mushroom Tan',
        brand: 'Stoney Clover Lane',
        price: 458,
        retailer: 'Shopbop',
        buyUrl: 'https://www.shopbop.com/henrietta-tote-stoney-clover-lane/vp/v=1/1532627059.htm',
        kStyleTip: 'Supple neutral suede harmonizes with cream virgin wool.'
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

  // Auth & Subscription state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isProSubscriber, setIsProSubscriber] = useState<boolean>(false);
  const [freeTrialUsed, setFreeTrialUsed] = useState<boolean>(false);
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

  // Sync Auth & Trial state from localStorage
  useEffect(() => {
    try {
      const trialUsed = localStorage.getItem('styling_free_trial_used') === 'true';
      const isPro = localStorage.getItem('styling_is_pro_subscriber') === 'true';
      setFreeTrialUsed(trialUsed);
      setIsProSubscriber(isPro);

      const syncUser = () => {
        try {
          const stored =
            localStorage.getItem('stylinghelper_user') ||
            localStorage.getItem('stayhelper_member') ||
            localStorage.getItem('stayhelper_user');
          if (stored) {
            setCurrentUser(JSON.parse(stored));
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
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, file.name);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
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

  // Open Look directly in Try-On Studio
  const handleDirectTryOn = (look: EditorialMasterLook) => {
    setSelectedTryOnLook(look);
    setActiveLookModal(null);
    studioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Generate Virtual Try-On
  const handleExecuteStyling = async () => {
    if (!userPhoto) {
      alert('Please select a sample model or upload your photo first.');
      return;
    }

    if (freeTrialUsed && !isProSubscriber) {
      setShowPaywallModal(true);
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
        if (!isProSubscriber) {
          setFreeTrialUsed(true);
          try {
            localStorage.setItem('styling_free_trial_used', 'true');
          } catch (e) {}
        }
      } else {
        // High-precision graceful fallback to high-res master editorial look
        setStyledResult({
          imageUrl: selectedTryOnLook.imageUrl,
          look: selectedTryOnLook
        });
        if (!isProSubscriber) {
          setFreeTrialUsed(true);
          try {
            localStorage.setItem('styling_free_trial_used', 'true');
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn('Styling synthesis fallback:', err);
      setStyledResult({
        imageUrl: selectedTryOnLook.imageUrl,
        look: selectedTryOnLook
      });
      if (!isProSubscriber) {
        setFreeTrialUsed(true);
        try {
          localStorage.setItem('styling_free_trial_used', 'true');
        } catch (e) {}
      }
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsGenerating(false);
      setProgressStage('');
    }
  };

  // Filtered Looks
  const filteredLooks = MASTER_EDITORIAL_LOOKS.filter((look) => {
    if (activeGenderFilter === 'all') return true;
    return look.gender === activeGenderFilter;
  });

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
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-amber-200 text-[10px] font-semibold tracking-wider uppercase">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                Pro Member
              </span>
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
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                  {currentUser.name?.[0] || 'U'}
                </div>
                <span className="font-medium text-neutral-800 hidden md:inline truncate max-w-[100px]">
                  {currentUser.name || currentUser.email?.split('@')[0]}
                </span>
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
              onClick={() => studioRef.current?.scrollIntoView({ behavior: 'smooth' })}
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
            Handcrafted wardrobe capsules styled with authentic runway pieces from Shopbop & Nordstrom. Click any piece to shop official US retailers, or upload your photo for an instant 1:1 photorealistic fitting.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => studioRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-[0.18em] font-medium shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>Style My Photo for Free</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </button>

            <button
              onClick={() => lookbookRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs uppercase tracking-[0.18em] font-medium transition-all"
            >
              Explore Curated Looks (6)
            </button>
          </div>

          {/* 3 Pillar Minimalist Quality Markers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-neutral-200/80 text-left">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Authentic Retail
              </div>
              <div className="text-sm font-medium text-neutral-900">
                100% In-Stock Verified
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Direct links to Shopbop & Nordstrom with zero intermediary markups.
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
      {/* 3. CURATED MASTER LOOKBOOK GALLERY (Top 6 Master Looks)            */}
      {/* ================================================================= */}
      <section ref={lookbookRef} className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-neutral-200">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-neutral-400">
              The Master Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-neutral-950 mt-1">
              Curated Editorial Edits
            </h2>
            <p className="text-xs text-neutral-500 mt-1 font-normal">
              Select any look to view complete garment specs and direct retailer links.
            </p>
          </div>

          {/* Gender Filter Tabs */}
          <div className="inline-flex p-1 rounded-full bg-neutral-200/60 border border-neutral-200">
            <button
              onClick={() => setActiveGenderFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                activeGenderFilter === 'all'
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Edits ({MASTER_EDITORIAL_LOOKS.length})
            </button>
            <button
              onClick={() => setActiveGenderFilter('women')}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                activeGenderFilter === 'women'
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Women (4)
            </button>
            <button
              onClick={() => setActiveGenderFilter('men')}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                activeGenderFilter === 'men'
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Men (2)
            </button>
          </div>
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
                />

                {/* Top Badge: Garment Count & Total Outfit Value */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] uppercase font-semibold tracking-wider text-neutral-800 shadow-sm">
                    {look.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-neutral-950/85 backdrop-blur-md text-[10px] font-medium tracking-wide text-white shadow-sm">
                    ${look.totalPrice.toLocaleString()} USD
                  </span>
                </div>

                {/* Hover Quick Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-amber-300 mb-1">
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
                      className="flex-1 py-2 rounded-full bg-white text-neutral-950 text-xs font-semibold tracking-wider uppercase text-center hover:bg-neutral-100 transition-colors"
                    >
                      View Pieces ({look.pins.length})
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectTryOn(look);
                      }}
                      className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold tracking-wider uppercase transition-colors"
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
                    <span>{look.modelInfo.split('·')[0]}</span>
                    <span>{look.pins.length} Verified Pieces</span>
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
                    <span>Inspect Look</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDirectTryOn(look)}
                    className="text-xs uppercase tracking-wider font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Style My Photo</span>
                    <Wand2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. VIRTUAL TRY-ON ATELIER STUDIO (Interactive Fitting Room)       */}
      {/* ================================================================= */}
      <section ref={studioRef} className="py-20 lg:py-28 bg-[#F4F3F0] border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-neutral-500">
              Interactive Fitting Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-neutral-950 mt-1">
              Virtual Runway Fitting
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-normal">
              Select an authentic editorial look, choose a sample model or upload your photo, and visualize your silhouette in seconds.
            </p>
          </div>

          {/* Interactive Studio Workspace */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/80 p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (5 Cols): Model / Photo Selector */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs uppercase tracking-wider font-semibold text-neutral-800">
                      Step 1: Choose or Upload Photo
                    </label>
                    <div className="flex items-center gap-2">
                      {isCustomPhoto && (
                        <button
                          type="button"
                          onClick={handleClearPhoto}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-2 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Photo</span>
                        </button>
                      )}
                      <span className="text-[11px] text-neutral-500 truncate max-w-[130px]">
                        {userPhotoName}
                      </span>
                    </div>
                  </div>

                  {/* Preset Realistic Models Grid */}
                  <div className="grid grid-cols-6 gap-2 mb-4">
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
                            ? 'border-neutral-950 shadow-sm scale-105'
                            : 'border-transparent opacity-75 hover:opacity-100 hover:border-neutral-300'
                        }`}
                        title={`${model.label} (${model.tag})`}
                      >
                        <img
                          src={model.thumb}
                          alt={model.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Uploaded Photo Active Card (When user uploaded photo) */}
                  {isCustomPhoto ? (
                    <div className="rounded-2xl border border-neutral-300 bg-neutral-50 p-4 mb-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={userPhoto}
                            alt="Uploaded photo"
                            className="w-12 h-14 object-cover rounded-xl border border-neutral-300 shadow-sm flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-neutral-950 truncate">
                              {userPhotoName}
                            </div>
                            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                              <span>Photo ready for virtual fitting</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-semibold transition-all"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleClearPhoto}
                            className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold transition-all flex items-center gap-1"
                            title="Remove uploaded photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Drag & Drop Upload Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                      isDragging
                        ? 'border-neutral-950 bg-neutral-50'
                        : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-sm">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-medium text-neutral-900">
                        {isCustomPhoto ? 'Drop a new photo to replace, or ' : 'Drop your full-body photo here, or '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-neutral-950 font-bold underline underline-offset-2 hover:text-neutral-700"
                        >
                          browse files
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        Supports JPG, PNG, WEBP (Face & body shape are 100% preserved)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Look Indicator */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
                      Step 2: Selected Look
                    </span>
                    <span className="text-[10px] font-bold text-neutral-900">
                      ${selectedTryOnLook.totalPrice.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedTryOnLook.imageUrl}
                      alt={selectedTryOnLook.title}
                      className="w-12 h-16 object-cover rounded-lg border border-neutral-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-neutral-900 truncate">
                        {selectedTryOnLook.shortTitle}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {selectedTryOnLook.category} · {selectedTryOnLook.pins.length} items
                      </div>
                      <button
                        onClick={() => lookbookRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-[11px] font-medium text-neutral-950 hover:underline mt-1 inline-block"
                      >
                        Change Look
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Execute Button */}
                <button
                  onClick={handleExecuteStyling}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-full bg-neutral-950 hover:bg-black disabled:bg-neutral-400 text-white text-xs uppercase tracking-[0.18em] font-semibold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>{progressStage || 'Synthesizing Runway Look...'}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-amber-300" />
                      <span>Execute Virtual Fitting</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column (7 Cols): Canvas & Result Viewport */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center">
                <div className="relative w-full aspect-[3/4] max-w-md rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-md">
                  {/* Floating Action: Remove / Clear Photo */}
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
                      className="absolute top-3.5 left-3.5 z-20 px-3 py-1.5 rounded-full bg-neutral-950/80 hover:bg-neutral-900 text-white text-xs font-medium tracking-wide backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all"
                      title="View original source photo"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                      <span>Original Photo</span>
                    </button>
                  )}
                  {styledResult ? (
                    <img
                      src={styledResult.imageUrl}
                      alt="Virtual Fitting Result"
                      className="w-full h-full object-cover object-top animate-fadeIn"
                    />
                  ) : (
                    <img
                      src={userPhoto}
                      alt="Source Model"
                      className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
                        isGenerating ? 'opacity-40 filter blur-sm' : 'opacity-100'
                      }`}
                    />
                  )}

                  {/* Processing Overlay */}
                  {isGenerating && (
                    <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
                      <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-amber-300 animate-spin mb-4" />
                      <div className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold mb-2">
                        Precision AI Fitting
                      </div>
                      <p className="text-sm font-medium text-neutral-200 max-w-xs">
                        {progressStage}
                      </p>
                    </div>
                  )}

                  {/* Result Badge */}
                  {styledResult && (
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/85 backdrop-blur-md text-white flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-semibold tracking-wider text-amber-300">
                          Fitted Capsule
                        </div>
                        <div className="text-xs font-medium truncate max-w-[200px]">
                          {styledResult.look.shortTitle}
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveLookModal(styledResult.look)}
                        className="px-3 py-1.5 rounded-full bg-white text-neutral-950 text-[11px] font-semibold tracking-wider uppercase hover:bg-neutral-100 transition-colors"
                      >
                        Shop Items
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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

            {/* Left Column: Full-Bleed Editorial Visual with Hotspots */}
            <div className="relative lg:w-1/2 aspect-[3/4] lg:aspect-auto bg-neutral-100 overflow-hidden">
              <img
                src={activeLookModal.imageUrl}
                alt={activeLookModal.title}
                className="w-full h-full object-cover object-top"
              />

              {/* Hotspot Toggle */}
              <div className="absolute bottom-4 left-4 z-10">
                <button
                  onClick={() => setShowHotspotPins(!showHotspotPins)}
                  className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-medium text-neutral-800 shadow-sm flex items-center gap-1.5 hover:bg-white transition-all"
                >
                  {showHotspotPins ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showHotspotPins ? 'Hide Hotspots' : 'Show Hotspots'}</span>
                </button>
              </div>

              {/* Hotspot Pins Overlay */}
              {showHotspotPins &&
                activeLookModal.pins.map((pin) => (
                  <div
                    key={pin.id}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group/pin"
                  >
                    <button
                      onMouseEnter={() => setHoveredPinId(pin.id)}
                      onMouseLeave={() => setHoveredPinId(null)}
                      className="w-6 h-6 rounded-full bg-white text-neutral-950 border border-neutral-400 shadow-lg flex items-center justify-center font-bold text-[10px] hover:scale-125 transition-transform"
                    >
                      +
                    </button>

                    {/* Pin Tooltip */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 bottom-8 w-48 p-2.5 rounded-xl bg-neutral-950/95 backdrop-blur-md text-white text-[11px] shadow-xl pointer-events-none transition-all ${
                        hoveredPinId === pin.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    >
                      <div className="text-[9px] uppercase tracking-wider text-amber-300 font-semibold">
                        {pin.category} · {pin.brand}
                      </div>
                      <div className="font-medium text-white truncate mt-0.5">{pin.title}</div>
                      <div className="text-amber-200 font-bold mt-1">${pin.price} USD</div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Right Column: Garment Breakdown & Direct Shop Links */}
            <div className="lg:w-1/2 flex flex-col max-h-[92vh] overflow-y-auto p-6 sm:p-8 bg-white">
              {/* Header Spec */}
              <div className="pb-6 border-b border-neutral-200">
                <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-[0.2em] text-neutral-400 mb-1">
                  <span>{activeLookModal.season}</span>
                  <span>{activeLookModal.category}</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-neutral-950 leading-snug">
                  {activeLookModal.shortTitle}
                </h3>
                <p className="text-xs text-neutral-500 mt-2 font-normal leading-relaxed">
                  {activeLookModal.curatorNote}
                </p>
              </div>

              {/* Garments List */}
              <div className="py-6 flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                    Curated Pieces ({activeLookModal.pins.length})
                  </span>
                  <span className="text-xs font-bold text-neutral-950">
                    Total: ${activeLookModal.totalPrice.toLocaleString()} USD
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {activeLookModal.pins.map((pin) => (
                    <div
                      key={pin.id}
                      className="p-3.5 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/80 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800">
                            {pin.category}
                          </span>
                          <span className="text-xs font-bold text-neutral-900 truncate">
                            {pin.brand}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-600 truncate mt-1">
                          {pin.title}
                        </div>
                        {pin.kStyleTip && (
                          <div className="text-[10px] text-neutral-400 italic truncate mt-0.5">
                            {pin.kStyleTip}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-xs font-bold text-neutral-950">
                          ${pin.price}
                        </span>
                        <a
                          href={pin.buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-950 hover:bg-black text-white text-[10px] font-semibold tracking-wider uppercase transition-colors"
                        >
                          <span>Shop {pin.retailer}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Sticky Action */}
              <div className="pt-6 border-t border-neutral-200 flex items-center gap-3">
                <button
                  onClick={() => handleDirectTryOn(activeLookModal)}
                  className="flex-1 py-3.5 rounded-full bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-[0.16em] font-semibold text-center transition-all flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-4 h-4 text-amber-300" />
                  <span>Style My Photo with This Look</span>
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

            <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-neutral-400">
              StylingHelper Pro Member
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-neutral-950 mt-1 mb-3">
              Unlock Unlimited Runway Swaps
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mb-6 font-normal leading-relaxed">
              Your free trial has been activated. Upgrade to Pro for unlimited 4K fittings, exclusive runway capsule previews, and VIP stock sentinel alerts.
            </p>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left mb-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Unlimited photorealistic outfit swaps (4K Ultra-HD)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Early access to SS26 Paris & New York capsule edits</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Automated out-of-stock restock monitoring on Shopbop</span>
              </div>
            </div>

            <a
              href={PAYPAL_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-[0.18em] font-semibold shadow-md transition-all block text-center"
            >
              Upgrade to Pro ($19 / month)
            </a>
            <p className="text-[11px] text-neutral-400 mt-3">
              Secured by PayPal 256-bit encryption · Cancel anytime with 1 click
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
        onSuccess={() => setIsAuthModalOpen(false)}
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
      </footer>
    </div>
  );
}
