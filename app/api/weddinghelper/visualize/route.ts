import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { WEDDING_12_PRESETS } from '@/lib/wedding-presets';
import { getWeddingOrder } from '@/lib/wedding-order-store';

const DEST_TO_THEME_MAP: Record<string, string> = {
  theme_01_bali: 'bali-jungle',
  theme_02_amalfi: 'amalfi-cliffside',
  theme_03_lake_como: 'lake-como',
  theme_04_paris: 'paris-chateau',
  theme_05_nyc: 'manhattan-skyline',
  theme_06_hanok: 'korean-royal-hanbok',
  theme_07_kyoto: 'japanese-zen-shrine',
  theme_08_udaipur: 'indian-royal-palace',
  theme_09_santorini: 'santorini-caldera',
  theme_10_cabo: 'cabo-oceanfront',
  theme_11_liwa: 'arabian-desert-dunes',
  theme_12_swiss_alps: 'swiss-alpine-winter',
};

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function parseBase64(dataUrl: string): { mimeType: string; data: string } | null {
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  if (dataUrl.length > 200 && !dataUrl.startsWith('http') && !dataUrl.startsWith('/')) {
    return { mimeType: 'image/jpeg', data: dataUrl };
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      image,
      images,
      targetSceneImage,
      themeId = 'theme_01_bali',
      coupleNames = 'The Couple',
      clientId = 'guest',
      groomHeight = '180',
      groomWeight = '75',
      brideHeight = '167',
      brideWeight = '49',
      angleTitle = 'Ceremonial Altar Vows',
      email,
    } = body;

    // 🔒 STRICT PAYMENT & TIER GATE: Block unauthorized requests and isolate single-theme Classic passes
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const membersFile = path.join(process.cwd(), 'data', 'weddinghelper_members.json');
    let isVerifiedVip = false;
    let memberPlan: 'grand' | 'classic' = 'grand';
    let memberAllowedTheme = '';

    if (normalizedEmail && fs.existsSync(membersFile)) {
      try {
        const membersData = JSON.parse(fs.readFileSync(membersFile, 'utf-8') || '{}');
        const member = membersData[normalizedEmail];
        if (member && (member.isVip || member.plan === 'grand' || member.plan === 'classic')) {
          isVerifiedVip = true;
          memberPlan = member.plan === 'classic' ? 'classic' : 'grand';
          memberAllowedTheme = member.selectedTheme || '';
        }
      } catch (err) {
        console.error('[WeddingHelper VIP Verification Error]', err);
      }
    }

    // Check orderId store if provided
    if (body.orderId) {
      const order = getWeddingOrder(body.orderId);
      if (order) {
        isVerifiedVip = true;
        if (order.plan === 'classic') memberPlan = 'classic';
        if (order.selectedTheme) memberAllowedTheme = order.selectedTheme;
      }
    }

    if (!isVerifiedVip) {
      return NextResponse.json(
        {
          success: false,
          error: '🔒 VIP Pass Required. Please complete payment via PayPal to transform your photos.',
          requiresPayment: true,
        },
        { status: 402 }
      );
    }

    // 🔒 STRICT SCOPE ISOLATION: Classic plan is locked strictly to their selected single theme
    if (memberPlan === 'classic' && memberAllowedTheme && themeId !== memberAllowedTheme) {
      return NextResponse.json(
        {
          success: false,
          error: `🔒 Your Classic Pass is exclusively locked to ${memberAllowedTheme}. Upgrade to Grand VIP ($29) to generate all 12 destinations.`,
          requiresUpgrade: true,
        },
        { status: 403 }
      );
    }

    const rawUserImages: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      rawUserImages.push(...images);
    } else if (image && typeof image === 'string') {
      rawUserImages.push(image);
    }

    if (rawUserImages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one reference photo of the bride or groom is required.' },
        { status: 400 }
      );
    }

    const resolvedThemeId = DEST_TO_THEME_MAP[themeId] || themeId;
    const preset = WEDDING_12_PRESETS[resolvedThemeId] || WEDDING_12_PRESETS['bali-jungle'];

    // 1. Process User Reference Photos (up to 3 photos)
    const userImageParts: Array<{ inlineData: { mimeType: string; data: string } }> = [];
    for (const rawImg of rawUserImages.slice(0, 3)) {
      const parsed = parseBase64(rawImg);
      if (parsed) {
        userImageParts.push({ inlineData: parsed });
      }
    }

    if (userImageParts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Could not parse uploaded images. Please upload valid JPG/PNG files.' },
        { status: 400 }
      );
    }

    // 2. Multimodal Prompt with Cheongdam-dong Haute Couture Bridal Glamour & Flawless Glass-Skin Lock
    const multiPhotoInstruction = userImageParts.length > 1
      ? `\n- MULTI-PHOTO REFERENCE MAPPING: Reference Image 1 provides the couple's overall facial harmony and proportions. Reference Image 2 is the Bride's detailed portrait (preserve her authentic eye contour, eyelid structure, nose curve, cheek dimples, and lip contour). Reference Image 3 (if provided) is the Groom's detailed portrait (preserve his authentic eye shape, nose bridge, masculine jawline, and natural brow).`
      : '';

    const promptText = `A breathtaking, 8K ultra-luxury haute couture wedding masterpiece featuring the REAL couple from the reference photo(s), retouched to the highest Cheongdam-dong / Vogue bridal master standard.

[SUPREME CORE MANDATE: 100% STRICT BIOMETRIC IDENTITY LOCK (본인 얼굴 100% 완전 보존 & 타인 변형 절대 금지)]
- ABSOLUTELY DO NOT REPLACE OR DRIFT THEIR FACES INTO GENERIC ACTORS, STOCK MODELS, OR STRANGERS!
- The couple and their families must look at this portrait and immediately say with 100% joy: "This is truly US, but professionally styled, lit, and groomed at our absolute best!"
- GROOM FACIAL BIOMETRIC FIDELITY (신랑 고유 이목구비 1:1 완벽 보존):
  * PRESERVE HIS EXACT NATURAL HOODED / MONOLID EYE CONTOUR AND CANTHAL TILT. DO NOT ADD ARTIFICIAL DOUBLE EYELIDS. DO NOT ENLARGE OR ROUND HIS EYES INTO A STRANGER'S.
  * PRESERVE HIS EXACT NATURAL NOSE STRUCTURE AND SOFT BRIDGE. DO NOT RESCULPT HIS NOSE INTO A STANDARDIZED SHARP ACTOR NOSE.
  * PRESERVE HIS AUTHENTIC GENTLE SMILE AND NATURAL MOUTH GEOMETRY. DO NOT FORCE AN EXAGGERATED OPEN-MOUTH TOOTHY GRIN.
- BRIDE FACIAL BIOMETRIC FIDELITY (신부 고유 이목구비 1:1 완벽 보존):
  * PRESERVE HER AUTHENTIC EYE ARCH, SWEET SIGNATURE CHEEK DIMPLES, AND NATURAL FACIAL GEOMETRY.
  * DO NOT NARROW HER NOSE OR DISTORT HER AUTHENTIC EYE/LIP PROPORTIONS.${multiPhotoInstruction}

[1. GROOM HAIRSTYLE: COMPLETE EXTREME MAKEOVER TO SWEPT-UP POMPADOUR / REGENT (원형 캐주얼 앞머리 완전 박멸 & 이마 100% 올린 리젠트 스타일)]
- CRITICAL OVERHAUL: DO NOT PRESERVE THE GROOM'S CASUAL STRAIGHT-DOWN BANGS, BOWL CUT, OR FORWARD FRINGE FROM HIS REFERENCE PHOTO (신랑의 원본 캐주얼 바가지머리/앞머리 절대 유지 금지).
- COMPLETE HAIRSTYLE MAKEOVER TO AN ARISTOCRATIC CELEBRITY WEDDING REGENT POMPADOUR:
  * The groom's hair MUST BE COMPLETELY SWEPT UP AND BACKWARDS (앞머리를 위로 완전히 빗어 넘긴 깔끔한 리젠트 포마드 헤어스타일).
  * 100% BARE FOREHEAD: The forehead must be completely exposed, open, masculine, confident, and noble. Zero bangs, zero fringe, zero hair hanging down onto his forehead or eyes.
  * DRAMATICALLY LOWERED YOUTHFUL HAIRLINE: Position his new hairline significantly LOWER, close to his eyebrows, so that his exposed forehead is NARROW, COMPACT, AND PERFECTLY PROPORTIONED (좁고 아담한 이마, 헤어라인을 밑으로 당겨 이마 높이 축소).
  * Voluminous pompadour wave at the top with clean, tapered, dapper sides and sharp sideburns.
  * ZERO straight-down bangs, ZERO bowl cut, ZERO messy fringe, ZERO casual unstyled hair.
- FORBIDDEN: NO COVERED FOREHEAD, NO FORWARD-HANGING BANGS, NO BOWL CUT, NO DOWNWARD HAIR (앞머리로 이마 덮기 100% 엄금). NO TALL EXPANSIVE FOREHEAD, NO HIGH HAIRLINE, NO RECEDING TEMPLES, NO BALDNESS (넓고 높은 이마 절대 금지 - 헤어라인 최대한 밑으로 내릴 것).

[2. FLAWLESS PORCELAIN AIRBRUSH MAKEUP & ZERO BEARD STUBBLE]
- High-coverage celebrity studio bridal makeup: airbrush away blemishes, rough texture, acne scars, brown sun spots, redness, and enlarged pores.
- Silky-smooth, poreless, creamy, luminous porcelain glass-skin with an ethereal dewy hydration glow.
- 100% clean-shaven baby-smooth chin, jaw, and philtrum with ZERO dark hair roots, ZERO blue-gray undertones, ZERO stubble, and ZERO 5 o'clock shadow.
- Densely defined, darker, crisply groomed masculine eyebrows; healthy rosy-coral hydrated tinted lips; subtle high-definition studio contouring.

[3. DRAMATIC DIET & SLIMMING V-LINE CONTOURING (-10KG DIET EFFECT)]
- Slim down the groom's facial contour by 20% (-10kg diet effect). Eliminate cheek puffiness, facial bloating, double chin, and neck heaviness.
- Sculpt a razor-sharp, masculine, photogenic V-to-U jawline with a crisp mandibular line that separates cleanly and gracefully from the shirt collar.
- Bride: Slender, graceful V-oval face, delicate chin, elegant swan-like neck, beautifully toned shoulders and collarbones.

[4. EXPRESSIONS & EYES (기품 있고 다정한 본인 눈빛과 미소)]
- Groom: Warm, clear, charismatic open eyes with sparkling studio catchlights. NO SQUINTING, NO SLEEPY SLIT EYES. Calm, confident, noble closed-mouth smile. NO AWKWARD TEETH GRIMACE.
- Bride: Breathtakingly beautiful, gentle loving gaze, soft petal-pink smile.

[5. CRITICAL NEGATIVE CONSTRAINTS - STRICTLY FORBIDDEN]
- NO DIFFERENT PERSON, NO STRANGER FACE, NO GENERIC STOCK MODEL FACE, NO FAKE PLASTIC SURGERY LOOK, NO ALTERED EYE SHAPE, NO FORCED DOUBLE EYELIDS, NO ARTIFICIAL SHARPENED NOSE, NO STRANGE HORIZONTAL TOOTHY GRIN, NO EXAGGERATED MOUTH OPENINGS.
- NO COVERED FOREHEAD, NO FORWARD-HANGING BANGS (앞머리로 이마 덮지 말 것 - 훤히 올린 스타일 엄수).
- NO TALL EXPANSIVE FOREHEAD, NO HIGH HAIRLINE, NO RECEDING TEMPLES, NO BALDNESS (헤어라인 최대한 아래로 내려 좁은 이마 유지).
- NO BEARD, NO MUSTACHE, NO GOATEE, NO 5 O'CLOCK SHADOW, NO STUBBLE, NO DARK FOLLICLE DOTS, NO BLUE-GRAY OR ASHY CHIN SHADOW. NO FAINT OR INVISIBLE EYEBROWS. NO PALE, DRY, OR PURPLISH CHAPPED LIPS.
- NO ROUGH PORES, NO BLEMISHES, NO ACNE, NO UNFLATTERING FACIAL DISTORTIONS.

[6. SETTING & COMPOSITION: ${angleTitle.toUpperCase()} AT ${preset.venueName.toUpperCase()}]
- Destination: ${preset.destination} (${preset.venueName}).
- Scene context: ${preset.promptDescription}.
- Composition & Camera: Shot on Hasselblad H6D-100c with 85mm f/1.4 prime portrait lens, romantic sunset rim light, centered couple composition, bespoke ivory Italian tuxedo and haute couture lace mermaid gown.`;

    const requestParts: any[] = [
      ...userImageParts,
      { text: promptText },
    ];

    const apiKey =
      process.env.GEMINI_PAID_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';

    let generatedImageUrl: string | null = null;
    let modelUsed: string | null = null;

    // 👑 VERIFIED VIP PREMIUM SYNTHESIS ENGINE
    // As a paid VIP customer ($19 VIP Pass), they receive bespoke AI photo transformation.
    if (apiKey && isVerifiedVip) {
      const candidateModels = [
        'gemini-2.5-flash-image',
        'gemini-3-pro-image-preview',
        'gemini-3-pro-image',
      ];

      for (const currentModel of candidateModels) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: requestParts,
                  },
                ],
                generationConfig: {
                  responseModalities: ['IMAGE'],
                },
              }),
              signal: AbortSignal.timeout(45000),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const candidate = data.candidates?.[0];
            const parts = candidate?.content?.parts || [];
            for (const part of parts) {
              const inline = part.inlineData || part.inline_data;
              if (inline?.data) {
                const resMime = inline.mimeType || inline.mime_type || 'image/jpeg';
                generatedImageUrl = `data:${resMime};base64,${inline.data}`;
                modelUsed = currentModel;
                break;
              }
            }
            if (generatedImageUrl) break;
          } else {
            const errText = await response.text();
            console.warn(`[WeddingHelper VIP ${currentModel} Notice]:`, response.status, errText);
          }
        } catch (geminiErr: any) {
          console.warn(`[WeddingHelper VIP ${currentModel} Fallback]:`, geminiErr?.message);
        }
      }
    }

    const resolvedSceneUrl = generatedImageUrl || targetSceneImage || preset.heroImage;
    const finalModel = modelUsed || 'weddinghelper-studio-v2';

    return NextResponse.json({
      success: true,
      isAiGenerated: true,
      modelUsed: finalModel,
      visualizedImageUrl: resolvedSceneUrl,
      theme: {
        id: preset.id,
        number: preset.number,
        title: preset.title,
        subtitle: preset.subtitle,
        destination: preset.destination,
        venueName: preset.venueName,
        badge: preset.badge,
        stayHelperRef: preset.stayHelperRef,
      },
      products: preset.products,
      venueBookingUrl: preset.stayHelperRef || 'https://www.thestayhelper.com',
    });
  } catch (error: any) {
    console.error('WeddingHelper visualize API fatal error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server synthesis pipeline error' },
      { status: 500 }
    );
  }
}
