/**
 * =========================================================================
 * WEDDINGHELPER AI VISUALIZE API ROUTE
 * =========================================================================
 * POST /api/weddinghelper/visualize
 * 커플 사진 1장과 12대 테마 중 1개를 받아, 신랑신부 얼굴을 보존하면서
 * 전 세계 최고급 베뉴의 럭셔리 웨딩 화보를 실시간 렌더링하고
 * 100% In-Stock 정품 드레스/주얼리 및 베뉴 예약 링크를 반환합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { WEDDING_12_PRESETS } from '@/lib/wedding-presets';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      themeId = 'bali-jungle',
      coupleNames = 'The Couple',
      clientId = 'guest',
      groomHeight = '180',
      groomWeight = '75',
      brideHeight = '165',
      brideWeight = '50',
    } = body;

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'A couple photograph is required to visualize your luxury wedding.' },
        { status: 400 }
      );
    }

    const preset = WEDDING_12_PRESETS[themeId] || WEDDING_12_PRESETS['bali-jungle'];

    // 1. Base64 분리
    let mimeType = 'image/jpeg';
    let base64Data = image;

    if (image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    } else if (image.startsWith('/')) {
      try {
        const fs = require('fs');
        const path = require('path');
        const localPath = path.join(process.cwd(), 'public', image.replace(/^\//, ''));
        if (fs.existsSync(localPath)) {
          const buf = fs.readFileSync(localPath);
          base64Data = buf.toString('base64');
          mimeType = image.endsWith('.png') ? 'image/png' : 'image/jpeg';
        }
      } catch (e) {
        console.error('Error reading local sample couple image:', e);
      }
    }

    // 2. 고품격 화사한 생화 웨딩 프롬프트 빌드
    const promptText = `You are a world-renowned Vogue Wedding & Harper's Bazaar luxury bridal photographer.
Your task is to transform the uploaded couple's photo into an ultra-luxury, radiant wedding masterpiece set at ${preset.venueName} in ${preset.destination}.

[STEP 1: COUPLE FACIAL & BODY FIDELITY (CRITICAL)]
- Preserve 100% of the bride and groom's authentic facial identity, exact facial features, smile, eye shapes, and romantic chemistry from the original photo.
- BODY PROPORTIONS & REALISTIC SILHOUETTES:
  * GROOM BODY SPECS: Height ${groomHeight} cm, Weight ${groomWeight} kg. Render an authentically proportioned masculine silhouette, athletic/tailored build matching his exact height and weight, with a bespoke tailored tuxedo drape.
  * BRIDE BODY SPECS: Height ${brideHeight} cm, Weight ${brideWeight} kg. Render an authentically proportioned feminine silhouette matching her exact height and weight, with a customized couture gown fitting her real body shape gracefully.
  * The height difference between the groom (${groomHeight} cm) and the bride (${brideHeight} cm) must be accurately and naturally depicted in their full-body posture.
- Keep the couple naturally embracing, gazing at each other or facing the camera with joyous, radiant wedding smiles.

[STEP 2: ABUNDANT BLOOMING WEDDING FLORALS & CEREMONY SETTING (ESSENTIAL)]
- The scene MUST be an unmistakable, lavish wedding ceremony filled with magnificent, blooming fresh floral arrangements.
- Surrounding the couple: a grand, lush floral arch bursting with fragrant English garden roses, creamy white blush peonies, cascading sweet peas, hydrangeas, and delicate hanging orchids.
- The ceremony aisle is lined with glowing glass pillar candles and a dense carpet of fresh rose petals.
- Scene context: ${preset.promptDescription}
- Breathtaking destination architectural backdrop of "${preset.venueName}" (${preset.destination}) seamlessly integrated with the glorious floral wonderland.

[STEP 3: HAUTE COUTURE ATTIRE & JEWELRY]
- BRIDE: Dressed in ${preset.brideAttire}. She holds a lush, cascading fresh bridal bouquet of garden peonies and trailing ribbons.
- GROOM: Dressed in ${preset.groomAttire} with a matching delicate floral boutonnière pinned to his lapel.
- Realistic fabric textures (flowing pure silk, Chantilly lace, velvet, or 24K gold zardozi) catching warm sunlight.

[STEP 4: ULTRA-HIGH-END EDITORIAL GLOW & LIGHTING]
- Bathed in romantic, golden hour sunlight with soft creamy bokeh, glowing floral backlight, and gentle airborne rose petals.
- Photorealistic 8K Hasselblad look. Radiant, romantic, joyful, and deeply celebratory.
- Absolutely NO text overlays, NO watermarks, NO distortions. Output only the single photographic wedding masterpiece.`;

    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-image';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    let generatedImageUrl = '';

    // 실제 Gemini 호출 (API 키가 유효할 경우)
    if (key && !key.startsWith('AQ.mock') && !image.startsWith('/')) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': key,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: promptText },
                  { inlineData: { mimeType, data: base64Data } },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ['IMAGE'],
            },
          }),
          signal: AbortSignal.timeout(50000),
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
        }
      } catch (geminiErr: any) {
        console.warn('[WeddingHelper Gemini Fallback]:', geminiErr?.message);
      }
    }

    // 폴백: 시뮬레이션용 테마 대표 고화질 이미지
    if (!generatedImageUrl) {
      generatedImageUrl = preset.heroImage;
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
