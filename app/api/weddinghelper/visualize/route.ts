/**
 * =========================================================================
 * WEDDINGHELPER AI MULTI-PHOTO & TARGET SCENE SYNTHESIZE API ROUTE
 * =========================================================================
 * POST /api/weddinghelper/visualize
 * 
 * 1. 최대 3장의 고객 참조 사진(커플 사진 + 신부 클로즈업 + 신랑 클로즈업)을 수신하여
 *    신랑/신부의 동양인(한국인) 고유 이목구비, 쌍꺼풀, 보조개, 눈매, 미소 등 
 *    3D 안면 기하학을 인종 변조(Caucasianize/Westernize) 없이 100% 정밀 보존.
 * 2. 각도별 카드의 원본 콘셉트 사진(targetSceneImage)을 함께 로드하여,
 *    해당 카드의 원래 배경, 카메라 앵글, 포즈(착석/키스/포옹 등), 조명을 100% 보존하면서
 *    고객의 실제 얼굴과 슬림한 체형, 도자기 물광 피부로 정밀 합성 렌더링합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { WEDDING_12_PRESETS } from '@/lib/wedding-presets';

const DEST_TO_THEME_MAP: Record<string, string> = {
  'theme_01_bali': 'bali-jungle',
  'theme_02_amalfi': 'amalfi-cliff',
  'theme_03_lake_como': 'lake-como',
  'theme_04_paris': 'paris-palace',
  'theme_05_nyc': 'nyc-penthouse',
  'theme_06_hanok': 'korean-hanok',
  'theme_07_kyoto': 'kyoto-zen',
  'theme_08_udaipur': 'rajasthan-palace',
  'theme_09_santorini': 'santorini-cliff',
  'theme_10_cabo': 'cabo-ocean',
  'theme_11_liwa': 'dubai-mirage',
  'theme_12_swiss_alps': 'swiss-alps',
};

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function parseBase64(imgString: string): { mimeType: string; data: string } | null {
  if (!imgString) return null;
  if (imgString.startsWith('data:')) {
    const match = imgString.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return { mimeType: match[1], data: match[2] };
    }
  } else if (imgString.startsWith('/')) {
    try {
      const localPath = path.join(process.cwd(), 'public', imgString.replace(/^\//, ''));
      if (fs.existsSync(localPath)) {
        const buf = fs.readFileSync(localPath);
        const ext = path.extname(localPath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        return { mimeType, data: buf.toString('base64') };
      }
    } catch (e) {
      console.error('Error reading local image:', imgString, e);
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      images,
      targetSceneImage,
      themeId = 'bali-jungle',
      coupleNames = 'The Couple',
      clientId = 'guest',
      groomHeight = '180',
      groomWeight = '75',
      brideHeight = '165',
      brideWeight = '50',
      angleTitle = 'Ceremonial Altar Vows',
    } = body;

    // Collect user photos (support array of up to 3 photos or single legacy image)
    const rawUserImages: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      rawUserImages.push(...images.filter(Boolean));
    } else if (image && typeof image === 'string') {
      rawUserImages.push(image);
    }

    if (rawUserImages.length === 0) {
      return NextResponse.json(
        { error: 'At least one couple photograph is required to synthesize your luxury wedding.' },
        { status: 400 }
      );
    }

    const resolvedThemeId = DEST_TO_THEME_MAP[themeId] || themeId;
    const preset = WEDDING_12_PRESETS[resolvedThemeId] || WEDDING_12_PRESETS[themeId] || WEDDING_12_PRESETS['bali-jungle'];

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
        { error: 'Failed to process uploaded photographs.' },
        { status: 400 }
      );
    }

    // 2. Process Target Scene Concept Image (if provided)
    let targetScenePart: { inlineData: { mimeType: string; data: string } } | null = null;
    if (targetSceneImage && typeof targetSceneImage === 'string') {
      targetScenePart = parseBase64(targetSceneImage) ? { inlineData: parseBase64(targetSceneImage)! } : null;
    }

    // 3. Construct Bulletproof Multimodal Prompt with Strict East Asian / Korean Identity Lock
    const numUserPhotos = userImageParts.length;
    const hasTargetScene = targetScenePart !== null;

    let promptText = '';
    if (hasTargetScene) {
      promptText = `You are a world-class master celebrity bridal photographer and portrait artist specializing in ultra-luxury Asian and Korean celebrity weddings (Cheongdam-dong top atelier standard).

[INPUT IMAGES SPECIFICATION]
- Images 1 to ${numUserPhotos}: REAL CLIENT REFERENCE PHOTOS of the REAL COUPLE (Bride and Groom).
- Image ${numUserPhotos + 1} (Final Image): TARGET SCENE CONCEPT REFERENCE IMAGE ("${angleTitle}" at ${preset.venueName}).

[CRITICAL RULE 0: 100% ABSOLUTE ETHNICITY & FACIAL IDENTITY LOCK - ZERO ALTERATION]
- The couple in Reference Images 1 to ${numUserPhotos} are EAST ASIAN (KOREAN).
- You MUST 100% PRESERVE THEIR EXACT EAST ASIAN ETHNIC HERITAGE, FACIAL BONE STRUCTURE, AND AUTHENTIC LIKENESS.
- DO NOT Caucasianize, Westernize, or replace them with foreign-looking models. Absolutely NO European noses, foreign eyelid creases, or altered bone structures!
- BRIDE: 100% preserve her authentic East Asian eye contours, her natural deep double eyelids, delicate nose bridge, cute cheek dimple, gentle lips, and exact authentic facial proportions. Elevate her with celebrity bridal glow: soft dewy rose lips, fluttery lashes, and pristine porcelain skin.
- GROOM: 100% preserve his authentic East Asian eyes, eyebrows, clean masculine jawline, and handsome genuine smile.
- Their friends and family MUST immediately recognize them without any doubt: "That is 100% our bride and groom!"

[CRITICAL RULE 1: EXACT SCENE & COMPOSITION LOCK FROM TARGET SCENE IMAGE]
- Look at Image ${numUserPhotos + 1} (Target Scene Image).
- Maintain the EXACT background venue, setting, architecture, camera angle, distance, lighting, and mood shown in that Target Scene Image.
- The couple MUST adopt the EXACT pose, posture, and seating/standing configuration shown in the Target Scene (e.g. if sitting together by the coastal fireplace, they MUST be sitting together by that fireplace).
- Seamlessly replace the faces of the models in the Target Scene with the authentic faces of the real Bride and Groom.

[CRITICAL RULE 2: FLAWLESS KOREAN LUXURY PORCELAIN GLASS-SKIN]
- Flawless, luminous, Korean luxury aesthetic clinic porcelain glass-skin (수분 물광 피부).
- Dewy, micro-refined complexion, healthy natural radiance, zero blemishes.

[CRITICAL RULE 3: UNCONDITIONALLY SLIM & STATUESQUE HIGH-FASHION BODY SILHOUETTES]
- BRIDE: Slender, tall, elegant hourglass figure with sculpted collarbones, slim toned arms, graceful swan neck, and tiny snatched waist in haute couture bridal attire.
- GROOM: Tall, athletic lean slim build with broad square shoulders, flat stomach, and sharp tapered waist in bespoke Italian tuxedo.

[CRITICAL RULE 4: 8K CINEMATIC WEDDING QUALITY]
- 8K Hasselblad resolution, filmic romantic lighting, natural bokeh, breathtaking Vogue Weddings cover masterpiece.`;
    } else {
      promptText = `You are a world-class master celebrity bridal photographer and portrait artist specializing in ultra-luxury Asian and Korean celebrity weddings (Cheongdam-dong top atelier standard).

[INPUT IMAGES SPECIFICATION]
- Images 1 to ${numUserPhotos}: REAL CLIENT REFERENCE PHOTOS of the REAL COUPLE (Bride and Groom).
- Concept: "${angleTitle}" at ${preset.venueName} (${preset.destination}).

[CRITICAL RULE 0: 100% ABSOLUTE ETHNICITY & FACIAL IDENTITY LOCK - ZERO ALTERATION]
- The couple in Reference Images 1 to ${numUserPhotos} are EAST ASIAN (KOREAN).
- You MUST 100% PRESERVE THEIR EXACT EAST ASIAN ETHNIC HERITAGE, FACIAL BONE STRUCTURE, AND AUTHENTIC LIKENESS.
- DO NOT Caucasianize, Westernize, or replace them with foreign-looking models. Absolutely NO European noses, foreign eyelid creases, or altered bone structures!
- BRIDE: 100% preserve her authentic East Asian eye contours, her natural deep double eyelids, delicate nose bridge, cute cheek dimple, gentle lips, and exact authentic facial proportions.
- GROOM: 100% preserve his authentic East Asian eyes, eyebrows, clean masculine jawline, and handsome genuine smile.
- Their friends and family MUST immediately recognize them without any doubt: "That is 100% our bride and groom!"

[CRITICAL RULE 1: FLAWLESS KOREAN LUXURY PORCELAIN GLASS-SKIN]
- Flawless, luminous, Korean luxury aesthetic clinic porcelain glass-skin (수분 물광 피부).
- Dewy, micro-refined complexion, healthy natural radiance, zero blemishes.

[CRITICAL RULE 2: UNCONDITIONALLY SLIM & HIGH-FASHION SILHOUETTES]
- Bride: Slender, tall, elegant hourglass figure, sculpted collarbones, slim arms, tiny waist.
- Groom: Tall, athletic lean slim build, broad square shoulders, tapered waist in bespoke tuxedo.

[CRITICAL RULE 3: BREATHTAKING EDITORIAL ATMOSPHERE]
- Romantic chemistry, golden hour rim-lighting, 8K Hasselblad clarity, Vogue Weddings cover quality.`;
    }

    // 4. Assemble API payload parts
    const requestParts: any[] = [{ text: promptText }];
    // Add all user reference photos
    for (const uPart of userImageParts) {
      requestParts.push(uPart);
    }
    // Add target scene image if available
    if (targetScenePart) {
      requestParts.push(targetScenePart);
    }

    const key = process.env.GEMINI_API_KEY || '';
    const preferredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash-image';
    const modelsToTry = [preferredModel, 'gemini-3.1-flash-image', 'gemini-2.5-flash-image'].filter((v, i, a) => a.indexOf(v) === i);

    let generatedImageUrl = '';

    if (key) {
      for (const currentModel of modelsToTry) {
        if (generatedImageUrl) break;
        try {
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${key}`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
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
          });

          if (response.ok) {
            const data = await response.json();
            const candidate = data.candidates?.[0];
            const parts = candidate?.content?.parts || [];
            for (const part of parts) {
              const inline = part.inlineData || part.inline_data;
              if (inline?.data) {
                const resMime = inline.mimeType || inline.mime_type || 'image/jpeg';
                generatedImageUrl = `data:${resMime};base64,${inline.data}`;
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

    // Verification: ONLY mark as AI generated when Gemini actually returned a new image
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
        venueBookingUrl: preset.stayHelperRef 
          ? `https://stayhelper.com/stays/${preset.stayHelperRef}` 
          : `https://stayhelper.com?destination=${encodeURIComponent(preset.destination)}`,
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      isAiGenerated: true,
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
      inStockGuaranteed: true,
      venueBookingUrl: preset.stayHelperRef 
        ? `https://stayhelper.com/stays/${preset.stayHelperRef}` 
        : `https://stayhelper.com?destination=${encodeURIComponent(preset.destination)}`,
    });
  } catch (error: any) {
    console.error('Error in /api/weddinghelper/visualize:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to visualize wedding.' },
      { status: 500 }
    );
  }
}
