import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { WEDDING_12_PRESETS } from '@/lib/wedding-presets';

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
    } = body;

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

[1. GROOM HAIRSTYLE: REGAL UPWARD-STYLED HAIR WITH MAXIMUM LOWERED HAIRLINE & NARROW FOREHEAD (이마를 훤히 올린 스타일 + 헤어라인을 최대한 밑으로 내려 좁고 아담한 이마)]
- UPWARD REGENT / POMPADOUR WEDDING STYLING (이마를 가리지 않고 단정하고 세련되게 올린 스타일):
  * The groom's hair must be styled UPWARD and neatly groomed away from the face (단정하고 기품 있게 위로 넘긴 클래식 포마드 / 가르마 리젠트 스타일).
  * DO NOT cover the forehead with hanging bangs or fringe. The forehead must be cleanly open, exposed, confident, and aristocratic.
- DRAMATICALLY LOWERED HAIRLINE (헤어라인을 최대한 밑으로 대폭 하향 조정):
  * Lower the hairline significantly down toward the eyebrows so that the exposed forehead vertical height is very NARROW, COMPACT, AND SMALL (헤어라인을 최대한 아래로 끌어내려 이마 상하 길이를 아주 좁고 아담하게 연출).
  * The forehead height must be short and compact (황금비율 이마 축소 효과, 눈썹과 헤어라인 사이 간격이 좁음).
  * Rich, dense hair roots along the newly lowered, natural hairline with full temples and clean sideburns.
  * ZERO receding hairline, ZERO high forehead, ZERO M-shaped recession, ZERO bare scalp.
- FORBIDDEN: NO COVERED FOREHEAD, NO FORWARD-HANGING BANGS (앞머리로 이마 덮지 말 것 - 올린 스타일 엄수). NO TALL EXPANSIVE FOREHEAD, NO HIGH HAIRLINE, NO RECEDING TEMPLES, NO BALDNESS (넓고 높은 이마 절대 금지 - 헤어라인 최대한 밑으로 내릴 것).

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

    if (apiKey) {
      const candidateModels = [
        'gemini-3-pro-image-preview',
        'gemini-3-pro-image',
        'gemini-3.1-flash-image-preview',
        'gemini-3.1-flash-image',
        'gemini-2.5-flash-image',
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
              signal: AbortSignal.timeout(52000),
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
            console.warn(`[WeddingHelper ${currentModel} Error]:`, response.status, errText);
          }
        } catch (geminiErr: any) {
          console.warn(`[WeddingHelper ${currentModel} Fallback]:`, geminiErr?.message);
        }
      }
    }

    const isAiGenerated = Boolean(generatedImageUrl && generatedImageUrl.startsWith('data:image/'));

    if (!isAiGenerated) {
      return NextResponse.json({
        success: false,
        isAiGenerated: false,
        error: 'Gemini synthesis timed out or rate-limited. Please retry this angle.',
        fallbackImageUrl: targetSceneImage || preset.heroImage,
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
    }

    return NextResponse.json({
      success: true,
      isAiGenerated: true,
      modelUsed,
      visualizedImageUrl: generatedImageUrl,
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
