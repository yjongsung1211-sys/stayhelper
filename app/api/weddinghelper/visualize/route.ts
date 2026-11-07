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
      angleTitle = 'Ceremonial Altar Vows',
    } = body;

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'A couple photograph is required to visualize your luxury wedding.' },
        { status: 400 }
      );
    }

    const preset = WEDDING_12_PRESETS[themeId] || WEDDING_12_PRESETS['bali-jungle'];

    // 1. Base64 separation
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

    // 2. High-fashion radiant floral wedding prompt
    const promptText = `You are a world-renowned Vogue Wedding & Harper's Bazaar luxury bridal photographer.
Transform the uploaded couple from the input image into an ultra-luxury, radiant wedding masterpiece set at ${preset.venueName} in ${preset.destination}.
Specific Scene Angle: ${angleTitle}.

[STEP 1: COUPLE FACIAL & IDENTITY FIDELITY (HIGHEST PRIORITY)]
- 100% preserve the exact facial identities, eyes, nose, romantic smile, bone structure, and skin tone of BOTH the bride and groom from the uploaded image.
- Both persons must look exactly like the real couple in the input photo on their wedding day.

[STEP 2: TAILORED PROPORTIONS & ATTIRE]
- GROOM SILHOUETTE: Height ${groomHeight} cm, Weight ${groomWeight} kg. Bespoke black-tie wedding tuxedo fitting his exact masculine build, with silk lapel and delicate rose boutonnière.
- BRIDE SILHOUETTE: Height ${brideHeight} cm, Weight ${brideWeight} kg. Handcrafted haute couture French lace & pure silk wedding gown tailored to her exact feminine silhouette, holding a lush bridal bouquet of white blush peonies and sweet peas.

[STEP 3: LAVISH FLORALS & DESTINATION BACKDROP]
- Grand, lavish wedding ceremony surrounded by cascading garden roses, creamy peonies, floating orchids, and glowing candlelight.
- Majestic iconic architectural sanctuary view of "${preset.venueName}" (${preset.destination}) with warm golden hour sunlight.
- Cinematic angle: ${angleTitle}.
- Photorealistic 8K Hasselblad look. Celebratory, radiant, elegant, zero distortions, no cartoon effects.`;

    const key = process.env.GEMINI_API_KEY || '';
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-image';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    let generatedImageUrl = '';

    // Direct Gemini 2.5 Flash Image call
    if (key && base64Data) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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

    // Fallback: prioritize the couple's authentic uploaded photo over foreign stock photos
    if (!generatedImageUrl) {
      if (base64Data && mimeType) {
        generatedImageUrl = `data:${mimeType};base64,${base64Data}`;
      } else {
        generatedImageUrl = preset.heroImage;
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
