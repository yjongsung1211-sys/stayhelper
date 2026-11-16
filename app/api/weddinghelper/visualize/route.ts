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

[ESSENTIAL OBJECTIVE: BREATHTAKING BEAUTY & INSTANT SELF-RECOGNITION]
The couple must look undeniably like THEMSELVES, but at the absolute PEAK OF THEIR BEAUTY, YOUTH, AND CHARM (인생 최고의 수려함과 화사함).${multiPhotoInstruction}

[1. FLAWLESS PORCELAIN GLASS-SKIN & TOTAL BEARD-SHADOW ERADICATION (결점 없는 도자기 물광 피부 & 수염 자국 100% 완전 제거)]
- SILK-SMOOTH TEXTURE: Both bride and groom have perfectly smooth, radiant, poreless, creamy porcelain skin with an ethereal dewy hydration glow.
- ZERO IMPERFECTIONS: Zero rough texture, zero acne scars, zero enlarged pores, zero redness, zero gray/ashy undertones, zero dark under-eye circles, zero deep nasolabial creases.
- ZERO BEARD SHADOW / ZERO STUBBLE (수염 자국·푸르스름한 턱자국 100% 완전 제거):
  * The groom MUST be 100% completely clean-shaven, baby-smooth, and hairless on the chin, jawline, upper lip, philtrum, and neck.
  * Completely eliminate all 5 o'clock shadow, dark hair follicle roots, stubble dots, and blue-gray/green-gray undertones around the mouth, chin, and jawline.
  * Even if the groom's reference photo shows facial hair, mustache shadow, or beard stubble, YOU MUST COMPLETELY AIRBRUSH AND REMOVE IT. The groom's lower face (chin, jaw, upper lip) must have the exact same bright, creamy, luminous, silky-smooth porcelain skin tone as his forehead and cheeks—matching the highest Cheongdam-dong celebrity bridal studio grooming standard.
- STUDIO BEAUTY LIGHTING: Flattering, diffused high-key studio softbox lighting (Profoto beauty dish) that wraps gently around their faces, casting soft angelic highlights on cheekbones, forehead, and bridge of the nose.

[2. PROFESSIONAL CELEBRITY GROOM MAKEUP & SLIM JAWLINE SCULPTING (신랑 청담동 샵 풀 메이크업 & 갸름한 윤곽 리터칭)]
- GROOM: Dashing, noble, exceptionally handsome (귀티 나고 훤칠한 미남 신랑상). He must look as if professionally groomed and styled with full celebrity wedding makeup at Cheongdam-dong's premier bridal salon (화보 촬영을 위해 전문 샵에서 풀 메이크업과 윤곽 관리를 받은 훈남 배우 비주얼).
  * CRISP, DARKER, DENSELY FILLED-IN EYEBROWS (선명하고 짙은 훈남 눈썹): The groom's eyebrows must be noticeably darker, thicker, crisply defined, and filled in with clean micro-hair strokes (짙고 또렷한 훈남 눈썹). Neatly shaped masculine arch with a sharp tail. Zero faint, faded, or blurry brows. Sharp, handsome eyebrows that frame his eyes with dignity, charisma, and youthful sharpness.
  * VIBRANT, HEALTHY, NATURALLY TINTED LIPS (생기 넘치는 촉촉한 틴트 립): The groom's lips must NOT look pale, dry, chapped, or purplish. Give his lips unmistakable healthy romantic vitality with a subtle, natural rosy-coral / MLBB tinted moisture balm finish (생기 있고 촉촉한 자연스러운 틴티드 립). Supple, moisturized, youthful, healthy, and full of warm life.
  * SLIM, REFINED, CHISELED V-LINE CONTOURING (갸름하고 날렵하게 다듬어진 턱선과 윤곽 쉐이딩): Slim down and refine the groom's facial contour. Apply professional studio shading along the lower cheeks and jawline to eliminate puffiness, cheek roundness, and double chin. Sculpt a slim, photogenic, elegant V-to-U masculine jawline with a crisp, tapered chin (붓기와 볼살 정리, 갸름하고 날렵한 턱선). Keep his core facial bone identity 100% recognizable, but sculpt the silhouette to be visibly slimmer, photogenic, and sharp.
  * 100% Clean-shaven, baby-smooth porcelain chin and jaw with ZERO stubble, ZERO beard shadow, ZERO bluish tint, and ZERO visible follicle pores.
  * Retain his authentic eye contour, eyelid structure, nose slope, and smile.
  * Impeccable grooming: styled dapper hair, handsome charismatic aristocratic glow.
  * Proportions: Height ${groomHeight}cm, weight ${groomWeight}kg, dressed in ${preset.groomAttire || 'a bespoke tailored ivory-cream Italian linen tuxedo with a black silk bow tie'}.
- BRIDE: Stunningly gorgeous, elegant, pure, and radiant (여배우급 청순미와 화사한 미모의 신부).
  * Retain her authentic lovely eye shape, brow arch, and facial proportions.
  * Slim, elegant facial contour: graceful V-oval jawline, delicate chin, slender swan-like neck.
  * Eyes: Bright, sparkling, loving gaze with delicate natural lashes and subtle youthful aegyo-sal.
  * Lips: Petal-pink, naturally hydrated, soft lips with gently upturned smiling corners.
  * Proportions: Height ${brideHeight}cm, weight ${brideWeight}kg, styled with an effortless romantic low chignon with delicate fresh bridal floral pins, dressed in ${preset.brideAttire || 'an exquisite haute couture backless mermaid lace bridal gown with an ethereal chapel train'}.
- EXPRESSIONS: Gentle, warm, joyful, affectionate closed-mouth or subtle resting smile. DO NOT OPEN MOUTHS EXAGGERATEDLY. DO NOT RENDER ARTIFICIAL CHALK-WHITE TEETH. Lips rest together in a soft, tender, romantic smile.

[3. CRITICAL NEGATIVE CONSTRAINTS - STRICTLY FORBIDDEN]
- FORBIDDEN ON GROOM: NO BEARD, NO MUSTACHE, NO GOATEE, NO 5 O'CLOCK SHADOW, NO STUBBLE, NO DARK FOLLICLE DOTS, NO BLUE-GRAY OR ASHY CHIN SHADOW (수염, 수염 자국, 턱 푸른기 절대 금지). NO FAINT OR INVISIBLE EYEBROWS. NO PALE, DRY, OR PURPLISH CHAPPED LIPS. NO ROUND PUFFY CHEEKS OR DOUBLE CHIN (둥글넙적한 얼굴, 볼살 붓기 금지). The lower face must be completely hairless, smooth, clear, slim, and radiant.
- FORBIDDEN ON BOTH: NO ROUGH PORES, NO BLEMISHES, NO ACNE, NO UNFLATTERING FACIAL DISTORTIONS, NO ARTIFICIAL CHALK-WHITE HORSE TEETH, NO EXAGGERATED MOUTH OPENINGS. Both wear tender, gentle, natural closed-mouth smiles.

[4. IMMEDIATE SELF-RECOGNITION & WOW FACTOR]
When the couple and their loved ones view this portrait, their immediate joyful reaction must be: "Oh my gosh, that is 100% truly US, but looking like the most stunning, handsome, and radiant best versions of ourselves in our entire lives!"

[5. SETTING & COMPOSITION: ${angleTitle.toUpperCase()} AT ${preset.venueName.toUpperCase()}]
- Destination: ${preset.destination} (${preset.venueName}).
- Scene context: ${preset.promptDescription}.
- Composition & Camera: Shot on Hasselblad H6D-100c with 85mm f/1.4 prime portrait lens, beautiful natural golden hour rim light highlighting the veil lace and tuxedo fabric, perfect depth of field, pristine luxury bridal atelier standard.`;

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
