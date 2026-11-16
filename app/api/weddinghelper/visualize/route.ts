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

[SUPREME CORE MANDATE: THIS IS A ONCE-IN-A-LIFETIME DREAM WEDDING PHOTO! (이건 평생 간직할 웨딩사진이다!)]
Wedding clients demand the absolute PEAK OF BEAUTY, SLIMNESS, GLAMOUR, AND YOUTH. Even if the reference photo shows flaws, thinning hair, skin blemishes, or extra weight, YOU MUST DRAMATICALLY ENHANCE THEM TO BE AS HANDSOME, GORGEOUS, SLENDER, AND RADIANT AS TOP-TIER KOREAN CELEBRITY LEADS, while retaining core self-recognition!${multiPhotoInstruction}

[1. GROOM HAIRSTYLE: FORWARD-FALLING DANDY BANGS & COMPACT FOREHEAD (앞머리를 차분히 내려 이마를 덮는 훈남 댄디컷)]
- CRITICAL HAIRSTYLE OVERHAUL: DO NOT STYLE THE GROOM'S HAIR UPWARD OR BACKWARD.
- THE GROOM MUST WEAR A KOREAN CELEBRITY DANDY CUT / TEXTURED LEAF CUT WITH FORWARD-FALLING BANGS (앞머리를 차분하고 풍성하게 앞으로 내려서 이마를 70% 이상 가려주는 세련된 댄디컷 헤어스타일).
- The bangs and fringe must gracefully fall forward and downward, resting right above the groom's eyebrows, completely covering the tall forehead and receding hairline (이마를 덮어 이마 면적이 전혀 넓어 보이지 않게 아담하고 갸름한 동안 소두 얼굴형 완성).
- The bangs have rich volume, soft natural texture, and slight separation (공기감 있는 시스루 댄디뱅 / 내린 가르마 애즈펌).
- ZERO POMPADOUR, ZERO SLICKED-BACK HAIR, ZERO UPWARD COMBED HAIR, ZERO EXPOSED HIGH BARE FOREHEAD (올린 머리, 깐머리, 노출된 높은 이마 100% 절대 금지).
- Rich, thick, dense hair roots and voluminous sides and temples. ZERO bald spots, ZERO thinning, ZERO high receding forehead, ZERO bare scalp.
- FORBIDDEN: NO BALDNESS, NO THINNING HAIR, NO HIGH HAIRLINE, NO EXPANSIVE FOREHEAD, NO TALL BARE FOREHEAD, NO SLICKED-BACK RECEDING HAIR, NO M-SHAPED RECEDING TEMPLES (탈모, 높은 이마, 넓은 이마, M자 이마, 올린 머리 절대 금지).

[2. FLAWLESS PORCELAIN AIRBRUSH MAKEUP (피부가 안 좋아도 화장한 것처럼 완벽한 깐달걀 피부)]
- HIGH-COVERAGE CELEBRITY STUDIO MAKEUP: Even if the groom or bride has blemishes, rough texture, acne scars, brown sun spots, freckles, melasma, redness, or enlarged pores, AIRBRUSH IT COMPLETELY AWAY 100%.
- Both must have silky-smooth, poreless, creamy, luminous porcelain glass-skin with an ethereal dewy hydration glow (청담동 최고급 샵에서 신부화장/신랑화장 베이스를 완벽하게 받은 무결점 피부).
- ZERO BEARD SHADOW / ZERO STUBBLE: 100% clean-shaven, baby-smooth porcelain chin, jaw, and philtrum with zero dark hair roots, zero blue-gray undertones, and zero 5 o'clock shadow.
- GROOM MAKEUP: Densely defined, darker, crisply groomed masculine eyebrows; healthy rosy-coral hydrated tinted lips; subtle high-definition studio contouring.

[3. DRAMATIC DIET & SLIMMING CONTOURING (다이어트 성공한 듯 날씬하고 날렵한 V라인)]
- SLIM, CHISELED, ATHLETIC JAWLINE: Slim down the groom's facial contour by 20% (다이어트 -10kg 효과). Eliminate all cheek puffiness, facial bloating, double chin, and neck heaviness.
- Sculpt a razor-sharp, masculine, photogenic V-to-U jawline with a crisp mandibular line that separates cleanly and gracefully from the shirt collar.
- BRIDE SLIMNESS: Slender, graceful V-oval face, delicate chin, elegant swan-like neck, beautifully toned shoulders and collarbones.

[4. EXPRESSIONS & EYES (기품 있고 다정한 눈빛과 미소)]
- Groom: Warm, clear, charismatic open eyes with sparkling studio catchlights. NO SQUINTING, NO SLEEPY SLIT EYES. Calm, confident, noble closed-mouth smile. NO AWKWARD TEETH GRIMACE.
- Bride: Breathtakingly beautiful, gentle loving gaze, soft petal-pink smile.
- Retain both individuals' unique facial identity and core bone structure so they instantly recognize themselves at their absolute dream best.

[5. CRITICAL NEGATIVE CONSTRAINTS - STRICTLY FORBIDDEN]
- FORBIDDEN ON GROOM: NO BALDNESS, NO THINNING HAIR, NO RECEDING HAIRLINE, NO HIGH BARE FOREHEAD. NO SQUINTING, NO HALF-CLOSED TIRED EYES, NO ACCIDENTAL BLINK (게슴츠레한 실눈 절대 금지). NO AWKWARD HORIZONTAL TEETH-SHOWING GRIMACE, NO SQUINTING GRIN, NO DEEP NASOLABIAL SMILE LINES. NO DOUBLE CHIN, NO PUFFY ROUND CHEEKS, NO BLUNT JAWLINE. NO BEARD, NO MUSTACHE, NO GOATEE, NO 5 O'CLOCK SHADOW, NO STUBBLE, NO DARK FOLLICLE DOTS, NO BLUE-GRAY OR ASHY CHIN SHADOW. NO FAINT OR INVISIBLE EYEBROWS. NO PALE, DRY, OR PURPLISH CHAPPED LIPS.
- FORBIDDEN ON BOTH: NO ROUGH PORES, NO BLEMISHES, NO ACNE, NO UNFLATTERING FACIAL DISTORTIONS, NO ARTIFICIAL CHALK-WHITE HORSE TEETH, NO EXAGGERATED MOUTH OPENINGS. Both wear tender, gentle, natural closed-mouth smiles.

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
