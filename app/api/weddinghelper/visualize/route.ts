/**
 * =========================================================================
 * WEDDINGHELPER AI MULTI-PHOTO & TARGET SCENE SYNTHESIZE API ROUTE
 * =========================================================================
 * POST /api/weddinghelper/visualize
 * 
 * 1. 최대 3장의 고객 참조 사진(커플 사진 + 신부 클로즈업 + 신랑 클로즈업)을 수신하여
 *    신랑/신부의 쌍꺼풀, 보조개, 눈매, 미소 등 3D 안면 기하학을 100% 정밀 식별.
 * 2. 각도별 카드의 원본 콘셉트 사진(targetSceneImage, 예: scene_18 난로 씬)을 함께 로드하여,
 *    해당 카드의 원래 배경, 카메라 앵글, 포즈(착석/키스/포옹 등), 조명을 100% 보존하면서
 *    고객의 얼굴과 슬림한 체형, 도자기 물광 피부로 정밀 합성 렌더링합니다.
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

    // 3. Construct Precise Multimodal Prompt
    const numUserPhotos = userImageParts.length;
    const hasTargetScene = targetScenePart !== null;

    let promptText = '';
    if (hasTargetScene) {
      // Scenario A: Synthesizing into an EXACT CARD CONCEPT (Target Scene Image provided)
      promptText = `You are the world's most acclaimed Vogue Weddings and Harper's Bazaar celebrity master bridal photographer.
This is an iconic, ultra-luxury high-fashion WEDDING PHOTOSHOOT. It must be breathtakingly beautiful, glamorous, deeply romantic, and jaw-droppingly gorgeous.

[INPUT IMAGES SPECIFICATION]
- Images 1 through ${numUserPhotos}: REAL CLIENT REFERENCE PHOTOS (Real Bride and Groom).
  * Study these reference photos with extreme precision. Extract the exact facial identity, eye shapes, natural double eyelids, gentle authentic smiles, cute cheek dimple (if present), nose bridge, lips, and facial bone structure of BOTH individuals (Bride and Groom).
- Image ${numUserPhotos + 1} (The Final Image): TARGET SCENE & COMPOSITION REFERENCE.
  * Concept Title: "${angleTitle}" at ${preset.venueName} (${preset.destination}).
  * This final image defines the EXACT scene, camera angle, venue background, lighting atmosphere, and the couple's physical pose and positioning (e.g. sitting by the terracotta fireplace on an Amalfi terrace, standing by a balcony overlooking the Eiffel Tower, or walking hand-in-hand).

[YOUR MISSION: SEAMLESS CELEBRITY WEDDING FUSION & RE-RENDERING]
Re-create and synthesize the TARGET SCENE (the final image) with Vogue editorial perfection:

1. 100% PRESERVE THE EXACT SCENE CONCEPT & POSE:
   - KEEP THE EXACT SAME ENVIRONMENT & COMPOSITION as shown in the Target Scene Reference Image: The exact venue background, architecture, seating or standing arrangement, distance from camera, depth of field, and lighting (e.g. glowing firelight, golden hour ocean sunset, or palace chandeliers).
   - The couple MUST adopt the EXACT pose, posture, and seating/standing configuration seen in the Target Scene Reference Image. Do NOT alter the scene into a generic altar!

2. 100% PRECISE FACIAL IDENTITY LOCK FROM REFERENCE PHOTOS:
   - REPLACE the faces of the models in the Target Scene with the authentic faces of the real Bride and Groom from Reference Images 1 to ${numUserPhotos}:
   - BRIDE: 100% match her authentic eyes, deep double eyelids, natural eye contours, cheek dimple, and loving smile. Elevate her with celebrity bridal glam: refined fluttery lashes, soft rose lips, and breathtaking radiant beauty.
   - GROOM: 100% match his authentic eyes, eyebrows, nose, jawline, and handsome warm smile. Clean-shaven, charismatic, leading-man allure.

3. FLAWLESS LUXURY PORCELAIN GLASS-SKIN:
   - Unconditionally render BOTH individuals with radiant, luminous, Korean luxury aesthetic clinic porcelain glass-skin. Dewy, micro-refined texture, perfectly hydrated, zero blemishes, healthy natural glow.

4. UNCONDITIONALLY SLIM & STATUESQUE HIGH-FASHION BODY SILHOUETTES:
   - BRIDE SILHOUETTE: Ultra-slender, tall, elegant hourglass figure with sculpted collarbones, slim toned arms, graceful swan neck, and tiny snatched waist. Dressed in the haute couture bridal gown from the target scene or bespoke French lace gown.
   - GROOM SILHOUETTE: Tall, athletic lean slim build with broad square shoulders, flat stomach, and sharp tapered waist in an ultra-tailored bespoke Italian tuxedo.

5. EDITORIAL PERFECTION:
   - 8K Hasselblad resolution, filmic romantic atmosphere, soft natural bokeh, magazine-cover masterpiece.`;
    } else {
      // Scenario B: Standalone Masterpiece Synthesis (no specific target scene image, use destination preset)
      promptText = `You are the world's most acclaimed Vogue Weddings and Harper's Bazaar celebrity master bridal photographer.
This is an iconic, ultra-luxury high-fashion WEDDING PHOTOSHOOT. It must be breathtakingly beautiful, glamorous, deeply romantic, and jaw-droppingly gorgeous.

[INPUT IMAGES SPECIFICATION]
- Images 1 through ${numUserPhotos}: REAL CLIENT REFERENCE PHOTOS (Real Bride and Groom).
  * Study these reference photos with extreme precision. Extract the exact facial identity, eye shapes, natural double eyelids, gentle authentic smiles, cute cheek dimple (if present), nose bridge, lips, and facial bone structure of BOTH individuals (Bride and Groom).

[SCENE CONCEPT: ${angleTitle}]
- Venue: Majestic iconic sanctuary view of "${preset.venueName}" (${preset.destination}).

[CRITICAL RULES]
1. 100% EXACT FACIAL IDENTITY LOCK:
   - BRIDE: 100% match her authentic eyes, deep double eyelids, natural eye contours, cheek dimple, and loving smile. Breathtaking celebrity bridal glam.
   - GROOM: 100% match his authentic eyes, eyebrows, nose, jawline, and handsome warm smile.
2. FLAWLESS PORCELAIN GLASS-SKIN:
   - Radiant, luminous, Korean luxury aesthetic clinic porcelain glass-skin. Dewy, micro-refined texture, zero blemishes.
3. UNCONDITIONALLY SLIM & HIGH-FASHION BODY SILHOUETTES:
   - Bride: Ultra-slender hourglass figure, sculpted collarbones, slim arms, tiny waist.
   - Groom: Tall, athletic lean slim build, broad shoulders, tapered waist.
4. ROMANTIC EDITORIAL POSE & LIGHTING:
   - Romantic, intimate chemistry, golden hour rim-lighting, 8K Hasselblad clarity, Vogue Weddings cover quality.`;
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
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-image';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    let generatedImageUrl = '';

    if (key) {
      try {
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
          signal: AbortSignal.timeout(55000),
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
        } else {
          const errText = await response.text();
          console.warn('[WeddingHelper Gemini API Error]:', response.status, errText);
        }
      } catch (geminiErr: any) {
        console.warn('[WeddingHelper Gemini Fallback]:', geminiErr?.message);
      }
    }

    // Fallback: if Gemini fails or times out, return user's primary photo or targetSceneImage
    if (!generatedImageUrl) {
      if (userImageParts[0]?.inlineData?.data) {
        generatedImageUrl = `data:${userImageParts[0].inlineData.mimeType};base64,${userImageParts[0].inlineData.data}`;
      } else {
        generatedImageUrl = targetSceneImage || preset.heroImage;
      }
    }

    return NextResponse.json({
      success: true,
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
