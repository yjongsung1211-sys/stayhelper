export interface ColorSwatch {
  name: string;
  hex: string;
  note: string;
}

export interface SeasonFaq {
  q: string;
  a: string;
}

export interface SeasonGuide {
  slug: string;
  seasonName: string;
  undertone: 'Warm Undertone' | 'Cool Undertone' | 'Warm & Cool (All 12 Seasons)';
  subTones: string[];
  seoTitle: string;
  seoDescription: string;
  heroHeadline: string;
  heroSub: string;
  bestSwatches: ColorSwatch[];
  worstSwatches: ColorSwatch[];
  lipShades: string[];
  wardrobeTips: {
    outerwear: string;
    metals: string;
    fabrics: string;
  };
  faq: SeasonFaq[];
}

export const COLORHELPER_SEASONS: SeasonGuide[] = [
  {
    slug: 'autumn-warm-colors',
    seasonName: 'Autumn Warm',
    undertone: 'Warm Undertone',
    subTones: ['Soft Autumn', 'True Autumn', 'Deep Autumn'],
    seoTitle: 'Autumn Warm Personal Color Palette: Best Lip Colors & Outfits | ColorHelper',
    seoDescription:
      'Discover your Autumn Warm personal color palette, best terracotta and brick lip shades, worst colors to avoid, and try free instant virtual draping online.',
    heroHeadline: 'Autumn Warm Personal Color Guide: Best Lip Shades & Wardrobe Palette',
    heroSub:
      'Warm, earthy, and muted tones bring out natural radiance in Autumn Warm skin. See which shades brighten your complexion—and test them live with free virtual draping.',
    bestSwatches: [
      { name: 'Terracotta', hex: '#C26A4A', note: 'Signature warm lip & knitwear tone' },
      { name: 'Camel Beige', hex: '#C19A6B', note: 'Effortless coat & trench neutral' },
      { name: 'Olive Moss', hex: '#6B7048', note: 'Balances golden undertones cleanly' },
      { name: 'Warm Espresso', hex: '#4B3621', note: 'Richer alternative to stark black' },
      { name: 'Muted Rust', hex: '#A44A3F', note: 'Adds depth without harsh contrast' },
      { name: 'Cream Ivory', hex: '#F3EAD8', note: 'Softens the face vs. optic white' },
    ],
    worstSwatches: [
      { name: 'Icy Blue', hex: '#B8E1FF', note: 'Can make warm skin look sallow' },
      { name: 'Neon Magenta', hex: '#FF1E8E', note: 'Overpowers muted warmth' },
      { name: 'Stark Optic White', hex: '#FFFFFF', note: 'Creates harsh undertone clash' },
      { name: 'Cool Silver Gray', hex: '#A7B0BA', note: 'Dulls natural golden glow' },
    ],
    lipShades: [
      'Muted Terracotta & Brick Red (matte or velvet finish)',
      'Warm Cinnamon Nude & Spiced Rose',
      'Burnt Peach & Caramel MLBB (My Lips But Better)',
    ],
    wardrobeTips: {
      outerwear: 'Camel wool coats, chocolate leather jackets, and olive utility trenches.',
      metals: 'Brushed gold, antique brass, and warm bronze jewelry.',
      fabrics: 'Suede, brushed cashmere, heavyweight twill, and textured knits.',
    },
    faq: [
      {
        q: 'How do I know if I am Autumn Warm or Spring Warm?',
        a: 'Both share warm golden undertones, but Autumn Warm looks best in muted, earthy depth (camel, olive, terracotta), whereas Spring Warm shines in clearer, brighter warm tones (coral, warm ivory, clear peach).',
      },
      {
        q: 'Can Autumn Warm wear black?',
        a: 'Stark jet black near the face can cast shadows on Soft and True Autumn skin. Deep espresso brown, warm charcoal, or pairing black with a camel scarf works much better.',
      },
      {
        q: 'Is the virtual personal color draping on ColorHelper free?',
        a: 'Yes. You can test warm vs. cool drapes live in your browser for $0 with no login required, and unlock a full 12-season report anytime.',
      },
    ],
  },
  {
    slug: 'summer-cool-colors',
    seasonName: 'Summer Cool',
    undertone: 'Cool Undertone',
    subTones: ['Light Summer', 'True Summer', 'Soft Summer'],
    seoTitle: 'Summer Cool Personal Color Palette: Best Makeup & Soft Pastels | ColorHelper',
    seoDescription:
      'Explore the Summer Cool personal color palette: dusty rose lipsticks, soft lavender and slate neutrals, colors to avoid, plus free online virtual draping.',
    heroHeadline: 'Summer Cool Personal Color Guide: Soft Pastels, Rose Lips & Neutrals',
    heroSub:
      'Cool, soft, and lightly muted tones clarify Summer Cool skin without harsh contrast. Check your best palette and test real drapes side-by-side for free.',
    bestSwatches: [
      { name: 'Dusty Rose', hex: '#C98A97', note: 'Universally flattering cheek & lip shade' },
      { name: 'Soft Lavender', hex: '#B9B3D6', note: 'Brightens cool pink undertones' },
      { name: 'Powder Blue', hex: '#9BB7D4', note: 'Clean everyday shirting staple' },
      { name: 'Cool Slate Navy', hex: '#3D4F63', note: 'Refined dark neutral instead of black' },
      { name: 'Mauve Plum', hex: '#8E6C88', note: 'Polished evening & knit accent' },
      { name: 'Dove Gray', hex: '#CBD0D6', note: 'Soft monochrome base layer' },
    ],
    worstSwatches: [
      { name: 'Warm Mustard', hex: '#C8962E', note: 'Pulls redness and dulls complexion' },
      { name: 'Bright Orange', hex: '#F26419', note: 'Clashes directly with cool undertones' },
      { name: 'Warm Camel', hex: '#C68B59', note: 'Looks muddy next to cool skin' },
      { name: 'Neon Lime', hex: '#B7F000', note: 'Too high-chroma and yellow-heavy' },
    ],
    lipShades: [
      'Dusty Rose & Cool Mauve Pink',
      'Sheer Berry Tint & Soft Raspberry',
      'Muted Plum MLBB with satin or dewy finish',
    ],
    wardrobeTips: {
      outerwear: 'Dove gray wool coats, slate navy blazers, and soft taupe trench coats.',
      metals: 'Silver, white gold, platinum, and cool pearl accents.',
      fabrics: 'Matte silk, fine merino, crisp cotton poplin, and soft linen blends.',
    },
    faq: [
      {
        q: 'What is the difference between Summer Cool and Winter Cool?',
        a: 'Summer Cool thrives in soft, low-to-medium contrast pastels and muted tones (dusty rose, slate blue). Winter Cool needs high contrast and crisp saturation (pure white, jet black, true crimson).',
      },
      {
        q: 'What is the best neutral instead of beige for Summer Cool?',
        a: 'Choose cool taupe, dove gray, soft cocoa, or slate navy instead of yellow-based beige or warm camel.',
      },
      {
        q: 'How can I confirm my Summer Cool subtype at home?',
        a: 'Use ColorHelper’s free virtual draping tool in natural daylight to compare peach (warm) vs. lavender (cool) drapes directly beneath your jawline.',
      },
    ],
  },
  {
    slug: 'spring-warm-colors',
    seasonName: 'Spring Warm',
    undertone: 'Warm Undertone',
    subTones: ['Light Spring', 'True Spring', 'Bright Spring'],
    seoTitle: 'Spring Warm Personal Color Palette: Coral Lips & Bright Neutrals | ColorHelper',
    seoDescription:
      'Find your Spring Warm personal color palette: fresh coral and peach lip shades, warm ivory neutrals, colors to skip, and free instant virtual draping.',
    heroHeadline: 'Spring Warm Personal Color Guide: Clear Warmth, Coral Lips & Wardrobe',
    heroSub:
      'Fresh, luminous, and clear warm hues make Spring Warm complexions glow immediately. Review your core palette and test drapes live in seconds.',
    bestSwatches: [
      { name: 'Warm Coral', hex: '#F27961', note: 'Instant complexion-brightening hero tone' },
      { name: 'Soft Peach', hex: '#F7B799', note: 'Natural blush & knitwear staple' },
      { name: 'Warm Ivory', hex: '#FBF5E6', note: 'Clean, radiant light neutral' },
      { name: 'Golden Sand', hex: '#DFC29B', note: 'Lighter, fresher alternative to dark brown' },
      { name: 'Fresh Mint Aqua', hex: '#76C7B7', note: 'Clear cool-accent balance' },
      { name: 'Buttercup Yellow', hex: '#F5D061', note: 'Lifts light-to-bright warm skin' },
    ],
    worstSwatches: [
      { name: 'Dusty Charcoal', hex: '#52565E', note: 'Feels heavy and drains brightness' },
      { name: 'Cool Burgundy', hex: '#5D1F34', note: 'Too dark and blue-based' },
      { name: 'Ashy Mauve', hex: '#9D8992', note: 'Mutes clear Spring radiance' },
      { name: 'Jet Black', hex: '#0A0A0A', note: 'Overpowers light warm contrast' },
    ],
    lipShades: [
      'Juicy Coral & Glossy Peach Pink',
      'Warm Grapefruit Red (sheer or glossy finish)',
      'Apricot Nude with luminous sheen',
    ],
    wardrobeTips: {
      outerwear: 'Warm ivory tailored jackets, light sand trenches, and clear navy blazers.',
      metals: 'Polished light gold, champagne gold, and delicate rose gold.',
      fabrics: 'Lightweight cotton, crisp satin, fine gauge knits, and airy linen.',
    },
    faq: [
      {
        q: 'Why do muted earthy colors look dull on Spring Warm skin?',
        a: 'Spring Warm requires clarity and brightness. Heavily muted or dusty tones (like dark olive or charcoal) flatten the natural luminosity of Spring skin.',
      },
      {
        q: 'What dark neutral works best for Spring Warm?',
        a: 'Warm milk chocolate brown or bright marine navy looks much fresher near the face than stark black or cool charcoal.',
      },
      {
        q: 'Can I test Spring Warm vs. Autumn Warm drapes online?',
        a: 'Yes—open the free ColorHelper virtual draping studio to compare clear coral/ivory against muted terracotta/olive on your own photo.',
      },
    ],
  },
  {
    slug: 'winter-cool-colors',
    seasonName: 'Winter Cool',
    undertone: 'Cool Undertone',
    subTones: ['True Winter', 'Deep Winter', 'Bright Winter'],
    seoTitle: 'Winter Cool Personal Color Palette: Jewel Tones, Berry Lips & Contrast | ColorHelper',
    seoDescription:
      'Master the Winter Cool personal color palette: crisp black and white, sapphire and ruby jewel tones, berry lip shades, plus free virtual draping.',
    heroHeadline: 'Winter Cool Personal Color Guide: High-Contrast Neutrals & Jewel Tones',
    heroSub:
      'Crisp, cool, and high-contrast shades sharpen Winter Cool features instantly. See your strongest colors and verify them with free online draping.',
    bestSwatches: [
      { name: 'Pure Optic White', hex: '#FFFFFF', note: 'Creates sharp, luminous contrast' },
      { name: 'Jet Black', hex: '#111317', note: 'Anchors Winter’s signature sleekness' },
      { name: 'Royal Sapphire', hex: '#1D4ED8', note: 'High-clarity cool statement tone' },
      { name: 'True Crimson', hex: '#B91C3C', note: 'Blue-based power red for lips & coats' },
      { name: 'Emerald Pine', hex: '#0F6B54', note: 'Rich cool jewel green' },
      { name: 'Icy Silver', hex: '#D8E1EB', note: 'Crisp icy pastel highlight' },
    ],
    worstSwatches: [
      { name: 'Warm Orange', hex: '#E86A17', note: 'Clashes heavily with cool undertones' },
      { name: 'Muted Mustard', hex: '#B88A2E', note: 'Makes skin appear tired or uneven' },
      { name: 'Warm Terracotta', hex: '#B85D43', note: 'Too earthy and yellow-based' },
      { name: 'Warm Beige', hex: '#D6BE9C', note: 'Washes out high-contrast features' },
    ],
    lipShades: [
      'Blue-Based True Red & Ruby Crimson',
      'Deep Berry, Black Cherry & Cool Fuchsia',
      'Crisp Cool Rose Pink (satin or velvet finish)',
    ],
    wardrobeTips: {
      outerwear: 'Structured jet black coats, optic white shirting, and crisp charcoal tailoring.',
      metals: 'Polished silver, platinum, white gold, and icy diamond/crystal accents.',
      fabrics: 'Smooth structured wool, crisp poplin, sleek leather, and satin.',
    },
    faq: [
      {
        q: 'Why can Winter Cool wear pure black and optic white so effortlessly?',
        a: 'Winter Cool naturally carries high contrast between skin, hair, and eyes, so crisp black-and-white pairings mirror that contrast rather than overpowering the face.',
      },
      {
        q: 'Are pastels off-limits for Winter Cool?',
        a: 'Dusty or warm pastels can wash Winter out, but crisp icy pastels (icy blue, icy pink, pure silver-white) work well—especially paired with dark neutrals.',
      },
      {
        q: 'How do I check if I am True Winter or Deep Autumn?',
        a: 'Compare optic white vs. cream ivory and cool berry vs. warm rust using ColorHelper’s free virtual draping tool in natural light.',
      },
    ],
  },
  {
    slug: 'bright-spring-lipstick-shades',
    seasonName: 'Bright Spring',
    undertone: 'Warm Undertone',
    subTones: ['Bright Spring', 'Clear Spring', 'High-Chroma Warm'],
    seoTitle: 'Bright Spring Lipstick Shades That Pop Without Clashing',
    seoDescription:
      'The bright spring lipsticks that stay vivid on warm skin, plus which finishes to avoid if you burn through color fast.',
    heroHeadline: 'Bright Spring Lipstick Shades That Pop Without Clashing',
    heroSub:
      'Bright Spring lips thrive on clear, luminous saturation—warm coral reds, poppy pinks, and glossy tangerine tints that light up high-contrast warm skin instead of turning muddy.',
    bestSwatches: [
      { name: 'Poppy Coral Red', hex: '#F04A3A', note: 'Signature high-clarity warm red lip' },
      { name: 'Juicy Watermelon', hex: '#F45B69', note: 'Bright neutral-warm pink for daily wear' },
      { name: 'Clear Apricot Gloss', hex: '#F98B60', note: 'Fresh daytime wash without chalkiness' },
      { name: 'Warm Hibiscus', hex: '#E63963', note: 'Evening statement shade with crisp chroma' },
      { name: 'Bright Mango Tint', hex: '#FA7921', note: 'Energetic sheer lip oil tone' },
      { name: 'Clear Peach Nude', hex: '#F29C7E', note: 'Clean MLBB that never looks beige-flat' },
    ],
    worstSwatches: [
      { name: 'Dusty Greige Nude', hex: '#A9968F', note: 'Flattens Bright Spring clarity immediately' },
      { name: 'Muted Mauve', hex: '#9E7B86', note: 'Looks dull and gray against warm contrast' },
      { name: 'Deep Burgundy Plum', hex: '#581F2E', note: 'Too dark and cool-heavy' },
      { name: 'Chalky Pastel Pink', hex: '#EAB8C7', note: 'Sits milky on vivid skin tones' },
    ],
    lipShades: [
      'Poppy Coral & Warm Watermelon Red (glossy or satin finish)',
      'Sheer Tangerine & Clear Mango Lip Tints',
      'Luminous Peach-Pink MLBB (avoid ultra-matte powdery textures)',
    ],
    wardrobeTips: {
      outerwear: 'Warm ivory blazers, crisp navy jackets, and clear camel coats.',
      metals: 'Polished yellow gold, bright rose gold, and luminous champagne accents.',
      fabrics: 'Smooth cotton poplin, silk satin, fine crisp knits, and structured twill.',
    },
    faq: [
      {
        q: 'Why do matte nude lipsticks look washed out on Bright Spring?',
        a: 'Bright Spring relies on clarity and light reflection. Powdery matte nudes add grayness that dulls the natural brightness of Bright Spring features.',
      },
      {
        q: 'Can Bright Spring wear true red lipstick?',
        a: 'Yes—choose a clear tomato, poppy, or warm cherry red rather than a muted brick or dark blue-based burgundy.',
      },
      {
        q: 'How can I test Bright Spring vs. Bright Winter lip shades?',
        a: 'Open ColorHelper’s free virtual draping tool in daylight and compare warm coral-red against cool fuchsia directly beneath your jawline.',
      },
    ],
  },
  {
    slug: 'bright-winter-lipstick-shades',
    seasonName: 'Bright Winter',
    undertone: 'Cool Undertone',
    subTones: ['Bright Winter', 'Clear Winter', 'High-Contrast Cool'],
    seoTitle: 'Bright Winter Lipstick Shades for Cool Undertones',
    seoDescription:
      'Bright winter lipsticks in fuchsia, cherry and true red, tested against cool undertones and high contrast faces.',
    heroHeadline: 'Bright Winter Lipstick Shades for Cool Undertones',
    heroSub:
      'High-contrast cool features come alive in crisp blue-based reds, electric fuchsia, and clear cherry tints. Skip muted terracotta and test your exact winter chroma for free.',
    bestSwatches: [
      { name: 'Electric Fuchsia', hex: '#D81B60', note: 'Hallmark Bright Winter power pink' },
      { name: 'Cool Cherry Red', hex: '#C8102E', note: 'Blue-based red that brightens teeth' },
      { name: 'Clear Raspberry', hex: '#B81D5A', note: 'Polished berry-pink for work or dinner' },
      { name: 'Icy Rose Gloss', hex: '#E06C9F', note: 'Sheer cool pink for effortless daily wear' },
      { name: 'Crisp Magenta Berry', hex: '#9E1946', note: 'Bold velvet lip with zero muddiness' },
      { name: 'Cool Ruby Stain', hex: '#A4133C', note: 'Long-wear tint for high-contrast faces' },
    ],
    worstSwatches: [
      { name: 'Warm Terracotta', hex: '#C26A4A', note: 'Clashes directly with cool undertones' },
      { name: 'Peach Coral', hex: '#F48C72', note: 'Turns orange and separates from the face' },
      { name: 'Warm Caramel Nude', hex: '#B98362', note: 'Makes cool skin look tired or sallow' },
      { name: 'Muted Dusty Brown', hex: '#8A6D63', note: 'Drains Bright Winter sharpness' },
    ],
    lipShades: [
      'Blue-Based True Red & Crisp Cherry (satin or velvet finish)',
      'Electric Fuchsia & Clear Cool Raspberry',
      'Sheer Icy Rose or Cool Berry Lip Oil for low-key days',
    ],
    wardrobeTips: {
      outerwear: 'Jet black tailored coats, pure optic white shirting, and icy charcoal wool.',
      metals: 'Polished silver, platinum, white gold, and clear crystal jewelry.',
      fabrics: 'Sleek wool gabardine, crisp poplin, structured leather, and silk satin.',
    },
    faq: [
      {
        q: 'What is the best everyday lipstick for Bright Winter?',
        a: 'A sheer cool raspberry tint or icy rose gloss gives crisp color without feeling overly formal, while keeping the blue undertone intact.',
      },
      {
        q: 'Why does orange-red clash on Bright Winter skin?',
        a: 'Yellow-orange pigments pull against cool blue skin undertones, emphasizing redness or under-eye shadows instead of brightening the face.',
      },
      {
        q: 'How do I tell Bright Winter from True Winter?',
        a: 'Bright Winter sits closer to Spring and handles slightly brighter, clearer magentas and glossy finishes; True Winter leans purely icy and cool.',
      },
    ],
  },
  {
    slug: 'light-summer-lipstick-shades',
    seasonName: 'Light Summer',
    undertone: 'Cool Undertone',
    subTones: ['Light Summer', 'Pastel Cool', 'Low-Contrast Summer'],
    seoTitle: 'Light Summer Lipstick Shades for Soft Cool Skin',
    seoDescription:
      'Light summer lipsticks in rose, mauve and berry, with the finishes that keep low contrast faces from disappearing.',
    heroHeadline: 'Light Summer Lipstick Shades for Soft Cool Skin',
    heroSub:
      'Light Summer features shine in airy cool pinks, soft rosewater, and sheer mauve-berry tints—delicate enough never to overpower low contrast, yet clear enough to keep skin luminous.',
    bestSwatches: [
      { name: 'Soft Rosewater', hex: '#D98CA3', note: 'Effortless cool pink MLBB daily staple' },
      { name: 'Sheer Cool Mauve', hex: '#B98BA0', note: 'Refined neutral pink for office wear' },
      { name: 'Petal Pink Gloss', hex: '#E8A5BC', note: 'Light-reflecting pastel without chalkiness' },
      { name: 'Watermelon Sorbet', hex: '#DE6E89', note: 'Fresh summer lift for bright days' },
      { name: 'Soft Berry Stain', hex: '#A95C78', note: 'Buildable evening depth that stays airy' },
      { name: 'Cool Orchid Pink', hex: '#C77DA4', note: 'Clarifies light cool undertones cleanly' },
    ],
    worstSwatches: [
      { name: 'Deep Vampy Plum', hex: '#4B1D34', note: 'Too dark and heavy for light contrast' },
      { name: 'Warm Brick Orange', hex: '#C45A3B', note: 'Clashes harshly with cool pink skin' },
      { name: 'Toasted Caramel', hex: '#A87452', note: 'Feels muddy and overly yellow' },
      { name: 'Neon Fuchsia', hex: '#FF1493', note: 'Overpowers soft delicate features' },
    ],
    lipShades: [
      'Rosewater Pink & Sheer Cool Petal (balm, gloss, or satin finish)',
      'Soft Mauve MLBB & Light Dusty Rose',
      'Sheer Raspberry Sorbet Tint (blotted for a soft edge)',
    ],
    wardrobeTips: {
      outerwear: 'Dove gray cashmere coats, powder blue trenches, and soft cocoa blazers.',
      metals: 'Brushed silver, white gold, and soft cool pearls.',
      fabrics: 'Airy linen, matte silk, fine merino knits, and lightweight cotton.',
    },
    faq: [
      {
        q: 'Which lipstick finish works best for Light Summer?',
        a: 'Satin, balm, and sheer glossy finishes mirror Light Summer’s airy lightness far better than heavy, opaque matte liquid lipsticks.',
      },
      {
        q: 'Can Light Summer wear red lipstick?',
        a: 'Yes—opt for a blotted, sheer watermelon-rose or soft raspberry stain rather than a heavy opaque crimson or warm brick red.',
      },
      {
        q: 'How do I confirm Light Summer vs. Light Spring?',
        a: 'Compare soft rose-pink vs. warm peach drapes next to your face using ColorHelper’s free virtual draping tool in window light.',
      },
    ],
  },
  {
    slug: 'warm-autumn-lipstick-shades',
    seasonName: 'Warm Autumn',
    undertone: 'Warm Undertone',
    subTones: ['Warm Autumn', 'True Autumn', 'Golden Earthy Warm'],
    seoTitle: 'Warm Autumn Lipstick Shades for Every Skin Depth',
    seoDescription:
      'Ten warm autumn lipstick shades that read rich instead of orange, with drugstore and luxury picks from fair to deep skin.',
    heroHeadline: 'Warm Autumn Lipstick Shades That Read Rich, Never Orange',
    heroSub:
      'True and Warm Autumn skin glows in spiced terracotta, roasted cinnamon, and warm brick reds—earthy pigments with golden depth that harmonize effortlessly from fair to deep complexions.',
    bestSwatches: [
      { name: 'Spiced Terracotta', hex: '#B85A3E', note: 'Hero True Autumn everyday statement' },
      { name: 'Roasted Cinnamon', hex: '#9E543C', note: 'Rich warm brown-rose MLBB' },
      { name: 'Warm Brick Red', hex: '#9F372B', note: 'Timeless Autumn red with zero neon' },
      { name: 'Burnt Peach Nude', hex: '#CF7E62', note: 'Natural warm daytime neutral' },
      { name: 'Maple Rose', hex: '#B46257', note: 'Soft muted warmth for office looks' },
      { name: 'Deep Chestnut Berry', hex: '#7A352C', note: 'Evening richness for medium-to-deep skin' },
    ],
    worstSwatches: [
      { name: 'Cool Bubblegum Pink', hex: '#F18CB9', note: 'Clashes directly with golden undertones' },
      { name: 'Icy Mauve Lavender', hex: '#B596B8', note: 'Makes warm skin look gray or ashy' },
      { name: 'Blue-Based Fuchsia', hex: '#C71585', note: 'Sits starkly on top of earthy warmth' },
      { name: 'Pale Chalky Beige', hex: '#DEC7B2', note: 'Erases natural lip warmth' },
    ],
    lipShades: [
      'Spiced Terracotta & Warm Brick Red (velvet matte or creamy satin)',
      'Roasted Cinnamon, Toasted Caramel & Maple Rose MLBB',
      'Warm Chili Red & Burnt Peach Tints',
    ],
    wardrobeTips: {
      outerwear: 'Rich camel coats, olive utility jackets, and warm chocolate suede.',
      metals: 'Warm yellow gold, antique brass, copper, and tortoise accents.',
      fabrics: 'Brushed wool, suede, corduroy, heavyweight cashmere, and textured linen.',
    },
    faq: [
      {
        q: 'Why do some warm lipsticks turn bright orange on Warm Autumn?',
        a: 'Clear Spring corals lack earthy brown-red muting. Choosing terracotta, brick, or cinnamon undertones keeps the shade grounded and sophisticated.',
      },
      {
        q: 'What is the best MLBB lipstick tone for Warm Autumn?',
        a: 'Look for spiced rose, toasted peach-brown, or warm cinnamon nude that matches your natural lip depth with a golden-brown base.',
      },
      {
        q: 'How do I know if I am Warm Autumn or Soft Autumn?',
        a: 'Warm Autumn handles richer spice tones (rust, mustard, terracotta), while Soft Autumn needs noticeably lighter, dustier muting.',
      },
    ],
  },
  {
    slug: 'soft-autumn-wardrobe-colors',
    seasonName: 'Soft Autumn',
    undertone: 'Warm Undertone',
    subTones: ['Soft Autumn', 'Muted Autumn', 'Neutral-Warm Soft'],
    seoTitle: 'Soft Autumn Wardrobe Colors: 12 Outfits That Work',
    seoDescription:
      'See the exact soft autumn wardrobe colors that flatter warm muted skin, plus 12 outfit formulas you can copy from your own closet.',
    heroHeadline: 'Soft Autumn Wardrobe Colors: Effortless Muted Outfit Formulas',
    heroSub:
      'Soft Autumn sits on the gentle border between Autumn and Summer. Build a cohesive capsule around oatmeal, sage green, warm taupe, and muted terracotta that flatters low-contrast warmth.',
    bestSwatches: [
      { name: 'Warm Oatmeal', hex: '#D9CDBF', note: 'Softer daily base than optic white' },
      { name: 'Muted Sage', hex: '#8F9B82', note: 'Signature Soft Autumn knit & shirt tone' },
      { name: 'Warm Taupe', hex: '#9A8B7A', note: 'Effortless trouser and blazer neutral' },
      { name: 'Soft Terracotta', hex: '#BD7964', note: 'Gentle earthy accent without harshness' },
      { name: 'Dusty Petrol Teal', hex: '#557576', note: 'Balanced cool-leaning depth for coats' },
      { name: 'Espresso Cocoa', hex: '#59463B', note: 'Soft dark neutral instead of jet black' },
    ],
    worstSwatches: [
      { name: 'Jet Black', hex: '#0D0D0D', note: 'Creates heavy shadows under low-contrast eyes' },
      { name: 'Optic White', hex: '#FFFFFF', note: 'Too stark next to muted warm skin' },
      { name: 'Electric Royal Blue', hex: '#1D4ED8', note: 'Overpowers soft muted harmony' },
      { name: 'Neon Coral', hex: '#FF5E4D', note: 'Too high-chroma and loud' },
    ],
    lipShades: [
      'Muted Spiced Rose & Soft Peach-Brown MLBB',
      'Dusty Terracotta & Sheer Warm Fig',
      'Velvet Chai Nude (soft matte or natural satin)',
    ],
    wardrobeTips: {
      outerwear: 'Oatmeal wool wrap coats, warm taupe trenches, and muted olive suede jackets.',
      metals: 'Brushed matte gold, soft champagne gold, and antique bronze.',
      fabrics: 'Brushed cashmere, soft suede, washed silk, slub linen, and heather knits.',
    },
    faq: [
      {
        q: 'What are the easiest Soft Autumn outfit combinations to copy?',
        a: 'Pair warm oatmeal knitwear with muted sage trousers and espresso leather loafers, or layer a warm taupe trench over cream ivory and dusty teal.',
      },
      {
        q: 'How is Soft Autumn different from Soft Summer?',
        a: 'Both share low contrast and muting, but Soft Autumn leans gently golden (oatmeal, sage, warm taupe) while Soft Summer leans cool (dove gray, dusty rose, slate blue).',
      },
      {
        q: 'Can Soft Autumn wear denim?',
        a: 'Yes—mid-wash vintage blue, muted ecru, and soft charcoal denim blend naturally with Soft Autumn tops.',
      },
    ],
  },
  {
    slug: 'free-personal-color-quiz',
    seasonName: '12-Season Personal Color',
    undertone: 'Warm & Cool (All 12 Seasons)',
    subTones: ['Spring Warm', 'Summer Cool', 'Autumn Warm', 'Winter Cool'],
    seoTitle: 'Free Personal Color Analysis Quiz (2 Minutes)',
    seoDescription:
      'Take a free two minute personal color quiz, then see the palette, lipstick and wardrobe colors that follow from it.',
    heroHeadline: 'Free Personal Color Analysis Quiz & Live Virtual Draping',
    heroSub:
      'Skip guesswork vein tests. Compare real warm vs. cool color drapes directly beneath your jawline in natural window light—100% free in your browser with zero login required.',
    bestSwatches: [
      { name: 'Spring Warm Coral', hex: '#F27961', note: 'Tests clear golden warmth & brightness' },
      { name: 'Summer Cool Rose', hex: '#C98A97', note: 'Tests soft cool pink undertone harmony' },
      { name: 'Autumn Warm Terracotta', hex: '#C26A4A', note: 'Tests earthy muted golden depth' },
      { name: 'Winter Cool Sapphire', hex: '#1D4ED8', note: 'Tests crisp high-contrast cool clarity' },
      { name: 'Warm Cream Ivory', hex: '#F3EAD8', note: 'Warm neutral benchmark vs. pure white' },
      { name: 'Pure Optic White', hex: '#FFFFFF', note: 'Cool neutral benchmark for Winter clarity' },
    ],
    worstSwatches: [
      { name: 'Yellow Bathroom Light', hex: '#E8C574', note: 'Skews every face artificially warm' },
      { name: 'Heavy Makeup Base', hex: '#D9A78B', note: 'Hides your true natural undertone' },
      { name: 'Auto-Filter Camera', hex: '#C9B2C4', note: 'Shifts skin contrast and chroma' },
      { name: 'Dark Backlit Room', hex: '#374151', note: 'Creates false shadows along the jaw' },
    ],
    lipShades: [
      'Warm Peach vs. Cool Pink lip test reveals undertone in 10 seconds',
      'Terracotta vs. Berry test separates muted Autumn from crisp Winter',
      'Explore matched lipsticks immediately after draping on BeautyHelper',
    ],
    wardrobeTips: {
      outerwear: 'Use your white test (cream ivory vs. optic white) before investing in coats.',
      metals: 'Compare brushed gold vs. cool silver near bare skin in indirect window daylight.',
      fabrics: 'Match fabric sheen to clarity: crisp satin/poplin for clear seasons, suede/cashmere for soft seasons.',
    },
    faq: [
      {
        q: 'How accurate is an online personal color quiz?',
        a: 'Text-only quizzes miss skin chroma and contrast. Live virtual draping—placing warm and cool color blocks directly under your bare jawline in daylight—gives far clearer visual proof.',
      },
      {
        q: 'Do I need to create an account or pay to try ColorHelper?',
        a: 'No. Instant virtual draping on ColorHelper is 100% free ($0) with no login required. Optional 12-season deep reports are available if you want full shade breakdowns.',
      },
      {
        q: 'What lighting should I use for the best result?',
        a: 'Face an indirect natural daylight window with bare skin and hair pulled back. Avoid overhead yellow bulbs or direct afternoon sunlight.',
      },
    ],
  },
];

export function getSeasonGuide(slug: string): SeasonGuide | undefined {
  return COLORHELPER_SEASONS.find((s) => s.slug === slug);
}
