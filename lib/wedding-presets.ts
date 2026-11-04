/**
 * =========================================================================
 * WEDDINGHELPER 12 GRAND MASTER LUXURY THEMES PRESETS
 * =========================================================================
 * 12대 글로벌 럭셔리 웨딩 테마별 베뉴, 디자이너 착장, 실시간 구매 링크 및 AI 프롬프트
 */

export interface WeddingProduct {
  id: string;
  name: string;
  type: 'dress' | 'tuxedo' | 'jewelry' | 'shoes' | 'accessory';
  brand: string;
  price: number;
  currency: 'USD';
  buyUrl: string;
  imageUrl?: string;
  inStock: boolean;
}

export interface WeddingThemePreset {
  id: string;
  number: number;
  category: 'western' | 'heritage' | 'global_killer';
  title: string;
  subtitle: string;
  destination: string;
  venueName: string;
  stayHelperRef?: string;
  heroImage: string;
  badge: string;
  description: string;
  brideAttire: string;
  groomAttire: string;
  promptDescription: string;
  products: WeddingProduct[];
}

export const WEDDING_12_PRESETS: Record<string, WeddingThemePreset> = {
  // 1. 발리 우붓
  'bali-jungle': {
    id: 'bali-jungle',
    number: 1,
    category: 'western',
    title: 'Bali Rainforest Infinity Chapel',
    subtitle: 'Emerald canyon abyss, floating bamboo altar & tropical orchids',
    destination: 'Ubud, Bali, Indonesia',
    venueName: 'The Kayon Jungle Resort & Mandapa Reserve',
    stayHelperRef: 'kayon-jungle-ubud',
    heroImage: '/images/weddings/bali-jungle.jpg',
    badge: '🌿 Sanctuary',
    description: 'Suspended over the Petanu River canyon with magnificent cascading orchid arches, floating white lotus blossoms, and fragrant tropical gardenia runners.',
    brideAttire: 'Backless organic silk crepe slip gown with embroidered frangipani chapel train & lush gardenia bouquet.',
    groomAttire: 'Sand-washed linen tailored single-breasted tuxedo with white silk lapels & orchid boutonnière.',
    promptDescription: 'Couple in love getting married under a colossal, fragrant floral arch overflowing with white orchids, blush hibiscus, and jungle foliage suspended above the emerald Petanu valley.',
    products: [
      {
        id: 'galia-lahav-silk-gown',
        name: 'Galia Lahav Backless Silk Crepe Bridal Gown',
        type: 'dress',
        brand: 'Galia Lahav',
        price: 7200,
        currency: 'USD',
        buyUrl: 'https://www.net-a-porter.com/en-us/shop/designer/galia-lahav',
        inStock: true
      },
      {
        id: 'brioni-linen-tux',
        name: 'Brioni Sand Washed Linen Tuxedo Jacket',
        type: 'tuxedo',
        brand: 'Brioni',
        price: 4900,
        currency: 'USD',
        buyUrl: 'https://www.saksfifthavenue.com/c/men/apparel/suits-tuxedos',
        inStock: true
      },
      {
        id: 'tiffany-victoria-earrings',
        name: 'Tiffany Victoria Vine Diamond Drop Earrings',
        type: 'jewelry',
        brand: 'Tiffany & Co.',
        price: 16500,
        currency: 'USD',
        buyUrl: 'https://www.tiffany.com/jewelry/earrings/',
        inStock: true
      }
    ]
  },

  // 2. 이탈리아 아말피
  'amalfi-cliffside': {
    id: 'amalfi-cliffside',
    number: 2,
    category: 'western',
    title: 'Amalfi Coast Cliffside Romance',
    subtitle: 'Cobalt Tyrrhenian sea, fragrant lemon groves & sun-kissed terracotta',
    destination: 'Positano & Ravello, Italy',
    venueName: 'Le Sirenuse & Belmond Hotel Caruso',
    stayHelperRef: 'belmond-caruso-amalfi',
    heroImage: '/images/weddings/amalfi-cliff.jpg',
    badge: '🍋 Old Money',
    description: 'Dramatic limestone cliffs meeting azure waters with vibrant bougainvillea terraces.',
    brideAttire: 'Sculptural floral macramé lace corset gown with sheer tulle flutter sleeves.',
    groomAttire: 'Tailored ivory dinner jacket in Italian barathea wool with midnight trousers.',
    promptDescription: 'Couple standing on a sun-drenched private cliffside terrace overlooking Positano colorful hillside villas and the deep cobalt Mediterranean sea.',
    products: [
      {
        id: 'oscar-de-la-renta-lace',
        name: 'Oscar de la Renta Macramé Lace Bustier Gown',
        type: 'dress',
        brand: 'Oscar de la Renta',
        price: 11900,
        currency: 'USD',
        buyUrl: 'https://www.saksfifthavenue.com',
        inStock: true
      },
      {
        id: 'tom-ford-ivory-jacket',
        name: 'Tom Ford Shelton Silk-Wool Dinner Jacket',
        type: 'tuxedo',
        brand: 'Tom Ford',
        price: 5450,
        currency: 'USD',
        buyUrl: 'https://www.net-a-porter.com/en-us/shop/mens',
        inStock: true
      }
    ]
  },

  // 3. 이탈리아 코모 호수
  'lake-como': {
    id: 'lake-como',
    number: 3,
    category: 'western',
    title: 'Lake Como Historic Villa & Riva Boat',
    subtitle: '18th-century baroque frescoes, floating water stage & vintage mahogany',
    destination: 'Lake Como, Lombardy, Italy',
    venueName: "Villa d'Este & Passalacqua Lake Como",
    heroImage: '/images/weddings/lake-como.jpg',
    badge: '🏰 Aristocratic',
    description: 'Neoclassical lakeside palace gardens with classic Riva mahogany speedboats cruising across glass-like alpine waters.',
    brideAttire: 'Architectural mikado silk ballgown with dramatic cathedral train and diamond tiara.',
    groomAttire: 'Bespoke English midnight-blue grosgrain peak-lapel tuxedo.',
    promptDescription: 'Royal aristocratic wedding beside historic Lake Como palace terrace with statues and vintage mahogany wooden boat.',
    products: [
      {
        id: 'monique-lhuillier-ballgown',
        name: 'Monique Lhuillier Majestic Silk Mikado Ballgown',
        type: 'dress',
        brand: 'Monique Lhuillier',
        price: 14500,
        currency: 'USD',
        buyUrl: 'https://www.saksfifthavenue.com',
        inStock: true
      },
      {
        id: 'cartier-solitaire-ring',
        name: 'Cartier 1895 Solitaire Diamond Ring (Platinum)',
        type: 'jewelry',
        brand: 'Cartier',
        price: 28400,
        currency: 'USD',
        buyUrl: 'https://www.cartier.com',
        inStock: true
      }
    ]
  },

  // 4. 프랑스 파리 샤토
  'paris-chateau': {
    id: 'paris-chateau',
    number: 4,
    category: 'western',
    title: 'Paris Private Château & Tuileries Garden',
    subtitle: 'Gilded age chandeliers, Versailles topiaries & haute couture elegance',
    destination: 'Chantilly & Paris, France',
    venueName: 'Château de Chantilly & Hôtel de Crillon',
    heroImage: '/images/weddings/paris-palace.jpg',
    badge: '🥐 Haute Couture',
    description: 'Grand French neoclassical ballroom opening into sculpted parterre gardens.',
    brideAttire: 'Hand-pleated Chantilly lace A-line gown layered with whisper-weight French tulle.',
    groomAttire: 'French cut jet-black tuxedo with satin shawl collar and silk cummerbund.',
    promptDescription: 'High fashion editorial wedding inside an opulent Parisian historic palace grand salon with floor-to-ceiling gilded mirrors and crystal chandeliers.',
    products: [
      {
        id: 'elieb-saab-couture-dress',
        name: 'Elie Saab Haute Couture Pleated Chantilly Gown',
        type: 'dress',
        brand: 'Elie Saab',
        price: 18000,
        currency: 'USD',
        buyUrl: 'https://www.net-a-porter.com',
        inStock: true
      }
    ]
  },

  // 5. 미국 뉴욕 맨해튼 펜트하우스
  'manhattan-skyline': {
    id: 'manhattan-skyline',
    number: 5,
    category: 'western',
    title: 'Manhattan Skyline Glass Penthouse',
    subtitle: 'Central Park panoramic dusk, warm amber glow & architectural black-tie',
    destination: 'New York City, USA',
    venueName: 'The Mark Hotel & Aman New York',
    heroImage: '/images/weddings/nyc-terrace.jpg',
    badge: '🏙️ Metropolitan',
    description: 'Sleek floor-to-ceiling glass terrace overlooking illuminated Manhattan skyscrapers at golden hour.',
    brideAttire: 'Clean square-neck tailored crepe sheath dress with dramatic pearl capelet.',
    groomAttire: 'Modern slim-cut tuxedo with black grosgrain bow tie and patent leather oxfords.',
    promptDescription: 'Modern chic couple at an ultra-luxury Manhattan glass penthouse rooftop terrace overlooking the New York City skyline at dusk.',
    products: [
      {
        id: 'kaviar-gauche-sheath',
        name: 'Minimalist Crepe Column Gown with Cape',
        type: 'dress',
        brand: 'Kaviar Gauche',
        price: 4800,
        currency: 'USD',
        buyUrl: 'https://www.net-a-porter.com',
        inStock: true
      }
    ]
  },

  // 6. 한국 궁중 한복 로열 헤리티지
  'korean-royal-hanbok': {
    id: 'korean-royal-hanbok',
    number: 6,
    category: 'heritage',
    title: 'Korean Royal Hanbok Heritage',
    subtitle: 'Natural silk dang-ui, 24K gold foil stamp & historic hanok courtyard',
    destination: 'Seoul, South Korea',
    venueName: 'The Shilla Yeong Bin Gwan & Bukchon Royal Hanok',
    heroImage: '/images/weddings/hanok-palace.jpg',
    badge: '🇰🇷 Royal Heritage',
    description: 'Timeless curves of Korean royal hanok eaves adorned with towering arrangements of fresh white peonies (모란), peach blossoms, fragrant wild bellflowers, and candlelit celadon lanterns.',
    brideAttire: 'Natural dyed jade-and-coral court Dang-ui (唐衣) with 24K gold leaf embroidery, fresh white peony hair comb, and jade norigae.',
    groomAttire: 'Imperial midnight blue silk Danryeong (團領) with hand-embroidered silver crane rank badge and traditional official belt.',
    promptDescription: 'Noble aristocratic couple getting married in traditional Korean royal court Hanbok standing before a grand floral screen of blooming royal peonies and peach blossoms in a sunlit stone courtyard.',
    products: [
      {
        id: 'royal-silk-dangui',
        name: 'Master Craftsman Handwoven Pure Silk Dang-ui & Chima',
        type: 'dress',
        brand: 'Chosun Royal Heritage',
        price: 8500,
        currency: 'USD',
        buyUrl: 'https://stayhelper.com/wedding/heritage/hanbok',
        inStock: true
      },
      {
        id: 'jade-binyeo-ornament',
        name: 'Natural Imperial Green Jade Binyeo & Cloisonné Norigae',
        type: 'jewelry',
        brand: 'Yeongbin Heritage Jewelry',
        price: 6200,
        currency: 'USD',
        buyUrl: 'https://stayhelper.com/wedding/heritage/jewelry',
        inStock: true
      }
    ]
  },

  // 7. 일본 교토 젠 신토 기모노
  'japanese-zen-shrine': {
    id: 'japanese-zen-shrine',
    number: 7,
    category: 'heritage',
    title: 'Kyoto Zen Shrine & Pure Silk Shiromuku',
    subtitle: 'Bamboo groves, moss gardens & thousand-year-old shinto sanctuary',
    destination: 'Kyoto, Japan',
    venueName: 'Aman Kyoto & Hoshinoya Kyoto Sanctuary',
    heroImage: '/images/weddings/kyoto-zen.jpg',
    badge: '🇯🇵 Zen Aristocracy',
    description: 'Serene forested pavilions nestled beneath towering cedar and maple canopies in ancient Kyoto.',
    brideAttire: '100% Habutae silk pristine white Shiromuku (白無垢) with woven gold crane motifs and Wataboshi hood.',
    groomAttire: 'Black Habutae silk Montsuki Haori with family crest and pleated Sendai striped Hakama trousers.',
    promptDescription: 'Peaceful Japanese couple in authentic white Shiromuku and black Montsuki kimono walking together through a mist-filled Kyoto moss rock garden.',
    products: [
      {
        id: 'kyoto-pure-shiromuku',
        name: 'Kyoto Nishijin-ori Woven Silk Shiromuku Gown',
        type: 'dress',
        brand: 'Nishijin Artisan Guild',
        price: 12500,
        currency: 'USD',
        buyUrl: 'https://stayhelper.com/wedding/heritage/kimono',
        inStock: true
      }
    ]
  },

  // 8. 인도 마하라자 궁전 럭셔리 혼례
  'indian-royal-palace': {
    id: 'indian-royal-palace',
    number: 8,
    category: 'heritage',
    title: 'Indian Royal Palace Extravaganza',
    subtitle: '24K gold zardozi embroidery, 10,000 candles & marble lake palace',
    destination: 'Udaipur & Jaipur, Rajasthan, India',
    venueName: 'Taj Lake Palace & The Oberoi Rajvilas',
    heroImage: '/images/weddings/udaipur-palace.jpg',
    badge: '🇮🇳 The Big Fat Wedding',
    description: 'Floating marble palace across Lake Pichola blanketed in hundreds of thousands of fragrant red roses, marigold floral curtains, floating lotus blossoms, and 10,000 brass diya candles.',
    brideAttire: 'Sabyasachi ruby velvet Lehenga hand-embroidered with 24K gold zardozi threads, holding a bouquet of red velvety roses & uncut Kundan polki diamond choker.',
    groomAttire: 'Royal ivory raw silk Sherwani with gem-encrusted buttons, maroon pashmina shawl, and royal safa turban with kalgi feather jewel.',
    promptDescription: 'Magnificent Indian royal couple walking down an opulent aisle carpeted in rose petals surrounded by cascading marigold and jasmine floral waterfalls under marble arches at Taj Lake Palace.',
    products: [
      {
        id: 'sabyasachi-zardozi-lehenga',
        name: 'Sabyasachi Heritage 24K Gold Embroidered Bridal Lehenga',
        type: 'dress',
        brand: 'Sabyasachi Couture',
        price: 24000,
        currency: 'USD',
        buyUrl: 'https://stayhelper.com/wedding/heritage/lehenga',
        inStock: true
      },
      {
        id: 'kundan-polki-choker',
        name: 'Royal Heritage Kundan Polki Diamond & Zambian Emerald Choker',
        type: 'jewelry',
        brand: 'Maharaja Heritage Jewels',
        price: 48000,
        currency: 'USD',
        buyUrl: 'https://stayhelper.com/wedding/heritage/kundan',
        inStock: true
      }
    ]
  },

  // 9. 그리스 산토리니 에게해 절벽
  'santorini-caldera': {
    id: 'santorini-caldera',
    number: 9,
    category: 'global_killer',
    title: 'Santorini Aegean White Caldera',
    subtitle: 'Blinding white cliffside village, cobalt waters & 10ft sunset cathedral veil',
    destination: 'Santorini, Cyclades, Greece',
    venueName: 'Grace Hotel (Auberge Resorts) & Katikies',
    heroImage: '/images/weddings/santorini-caldera.jpg',
    badge: '🇬🇷 Ultimate Dream',
    description: 'Suspended 1,000 feet above the Aegean caldera beneath a breathtaking floral arch of blooming blush peonies, ivory baby’s breath clouds, and white delphiniums against the endless blue sea.',
    brideAttire: 'Weightless silk chiffon mermaid gown with sheer illusion back and 12-foot windswept cathedral veil & white peony bouquet.',
    groomAttire: 'Crisp Mediterranean white linen blazer paired with ocean-navy tailored trousers.',
    promptDescription: 'Breathtaking bride with 12ft cathedral veil blowing in the sea breeze standing under an immense blooming white and blush floral arch on a Santorini whitewashed terrace with Aegean sunset.',
    products: [
      {
        id: 'berta-aegean-gown',
        name: 'Berta Sirene Illusion Chiffon Gown',
        type: 'dress',
        brand: 'Berta Bridal',
        price: 9800,
        currency: 'USD',
        buyUrl: 'https://www.saksfifthavenue.com',
        inStock: true
      }
    ]
  },

  // 10. 멕시코 카보 오션뷰 코스탈
  'cabo-oceanfront': {
    id: 'cabo-oceanfront',
    number: 10,
    category: 'global_killer',
    title: 'Cabo Oceanfront Desert & Pacific Waves',
    subtitle: 'Pacific surf crashing on golden sand, bonfire arches & barefoot chic',
    destination: 'Cabo San Lucas, Mexico',
    venueName: 'One&Only Palmilla & Las Ventanas al Paraíso',
    stayHelperRef: 'stay-34-oneandonly-palmilla',
    heroImage: '/images/weddings/cabo-pedregal.jpg',
    badge: '🇲🇽 Celebrity #1',
    description: 'Where the rugged Baja desert meets rolling Pacific waves in legendary barefoot luxury.',
    brideAttire: 'Bohemian handcrafted crochet macramé gown with open-toe satin block heels and turquoise gold cuffs.',
    groomAttire: 'Oatmeal textured linen unlined suit with relaxed button-down collar.',
    promptDescription: 'Romantic barefoot couple standing under a floral driftwood arch on a private Cabo San Lucas sandy beach at sunset with Pacific ocean waves crashing.',
    products: [
      {
        id: 'zimmermann-boho-gown',
        name: 'Zimmermann Luminary Handcrafted Crochet Gown',
        type: 'dress',
        brand: 'Zimmermann',
        price: 3950,
        currency: 'USD',
        buyUrl: 'https://www.net-a-porter.com',
        inStock: true
      }
    ]
  },

  // 11. 아랍 사막 듄 & 오아시스
  'arabian-desert-dunes': {
    id: 'arabian-desert-dunes',
    number: 11,
    category: 'global_killer',
    title: 'Arabian Desert Mirage & Golden Dunes',
    subtitle: 'Empty quarter terracotta dunes, 5,000 brass lanterns & royal silk canopies',
    destination: 'Abu Dhabi & Dubai, UAE',
    venueName: 'Qasr Al Sarab Desert Resort by Anantara',
    heroImage: '/images/weddings/liwa-desert.jpg',
    badge: '🇦🇪 Royal Mirage',
    description: 'Immense red sand dunes of the Liwa Desert offering an ethereal, otherworldly romantic setting.',
    brideAttire: '24K gold filigree embroidered cape gown with emerald-studded royal tiara.',
    groomAttire: 'Champagne gold raw silk tuxedo jacket with dark velvet cummerbund.',
    promptDescription: 'Extravagant royal wedding setup atop sweeping golden desert sand dunes at twilight surrounded by hundreds of flickering lanterns.',
    products: [
      {
        id: 'zuhair-murad-gold-gown',
        name: 'Zuhair Murad Gold Metallic Embellished Cape Gown',
        type: 'dress',
        brand: 'Zuhair Murad',
        price: 22000,
        currency: 'USD',
        buyUrl: 'https://www.net-a-porter.com',
        inStock: true
      }
    ]
  },

  // 12. 스위스 알프스 윈터 샬레
  'swiss-alpine-winter': {
    id: 'swiss-alpine-winter',
    number: 12,
    category: 'global_killer',
    title: 'Swiss Alpine Glacier & Winter Chalet',
    subtitle: 'Snow-capped Matterhorn vistas, crackling log fires & pure cashmere warmth',
    destination: 'St. Moritz & Zermatt, Switzerland',
    venueName: "The Chedi Andermatt & Badrutt's Palace",
    heroImage: '/images/weddings/st-moritz-alps.jpg',
    badge: '🇨🇭 Old Money Winter',
    description: 'Majestic frosted pine forests and snow-draped alpine peaks viewed from a private glass heated terrace.',
    brideAttire: 'Ivory cashmere floor-length cape layered over a tailored mikado mermaid gown with subtle feather trims.',
    groomAttire: 'Heavy black velvet peak lapel tuxedo with silver cufflinks and cashmere scarf.',
    promptDescription: 'Stunning winter wedding couple on a private snow-covered wooden chalet balcony overlooking majestic Swiss alpine peaks and glowing warm fireplaces.',
    products: [
      {
        id: 'loro-piana-bridal-cape',
        name: 'Loro Piana Pure White Cashmere Bridal Cape',
        type: 'dress',
        brand: 'Loro Piana',
        price: 6800,
        currency: 'USD',
        buyUrl: 'https://www.net-a-porter.com',
        inStock: true
      }
    ]
  }
};
