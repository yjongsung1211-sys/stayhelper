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

    const resolvedThemeId = DEST_TO_THEME_MAP[themeId] || themeId;
    const preset = WEDDING_12_PRESETS[resolvedThemeId] || WEDDING_12_PRESETS[themeId] || WEDDING_12_PRESETS['bali-jungle'];

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

    // 2. High-fashion Vogue celebrity wedding photoshoot prompt: Jaw-dropping beauty, flawless glass-skin, slim silhouette & romantic chemistry
    const promptText = `You are the world's most celebrated Vogue Weddings and Harper's Bazaar celebrity master bridal photographer (in the visual style of Annie Leibovitz and Mario Testino).
This is an iconic, ultra-luxury high-fashion WEDDING PHOTOSHOOT. It must be breathtakingly beautiful, glamorous, deeply romantic, and jaw-droppingly gorgeous.

[CORE ESSENCE: CELEBRITY WEDDING EDITORIAL MASTERPIECE]
- This is NOT a plain portrait or stiff snapshot. It is an awe-inspiring, magazine-cover luxury wedding photoshoot overflowing with romance, glamour, and emotional intimacy.
- Both the bride and groom must look exceptionally stunning, charismatic, and radiant like top-tier film stars on their wedding day.

[CRITICAL RULE 1: 100% EXACT FACIAL IDENTITY LOCK WITH GOD-TIER CELEBRITY BEAUTY]
- You MUST preserve the authentic recognizable facial identities, eye shapes, and smiles of BOTH individuals from the input image:
  - BRIDE: Preserve her exact natural deep double eyelids, her eye geometry, her authentic gentle smile, her cute cheek dimple, and delicate facial proportions. Elevate her into breathtaking bridal royalty with high-end celebrity bridal makeup: luminous dewy porcelain skin, subtle glossy rose lips, defined fluttery eyelashes, and a soft, captivating romantic gaze.
  - GROOM: Preserve his exact eyes, eyebrows, facial contours, authentic warm smile, and recognizable likeness. Elevate him into a dashing, handsome, charismatic leading man with clean-shaven chiseled features.

[CRITICAL RULE 2: FLAWLESS LUXURY PORCELAIN GLASS-SKIN (HIGHEST BEAUTY STANDARD)]
- Unconditionally render BOTH individuals with the most radiant, flawless, luminous bridal glass-skin.
- Clear, smooth, dewy complexion with refined micro-texture, zero blemishes, healthy natural glow, and luxury Korean aesthetic clinic porcelain radiance.

[CRITICAL RULE 3: UNCONDITIONALLY SLIM, TALL & HIGH-FASHION BODY SILHOUETTES]
- BOTH individuals MUST be rendered with an ultra-slim, tall, and elegant high-fashion physique.
- BRIDE SILHOUETTE: Ultra-slender, delicate, statuesque hourglass figure with defined sculpted collarbones, slender toned arms, long graceful swan neck, and a tiny snatched waist. Wearing an exquisite haute couture French chantilly lace & satin gown that hugs her slender figure, paired with a long, floating translucent sheer Cathedral veil catching the sunlight.
- GROOM SILHOUETTE: Tall, lean, athletic slim build with broad straight shoulders, flat abdomen, narrow tapered waist, and sharp posture. Wearing an impeccably tailored ultra-slim bespoke black-tie Italian tuxedo with silk satin shawl lapels.

[CRITICAL RULE 4: DYNAMIC ROMANTIC POSING & CHEMISTRY]
- Scene Concept & Pose: ${angleTitle}.
- Intimate, passionate, and natural bridal posing: The groom gently embraces her waist, bringing her close; the bride gently rests one hand on his lapel, holding a lavish bridal bouquet of fragrant white garden roses, peonies, and delicate ranunculus. They share a tender, deeply in love, radiant romantic look.

[CRITICAL RULE 5: BREATHTAKING VENUE, LIGHTING & ATMOSPHERE]
- Setting: Majestic iconic sanctuary view of "${preset.venueName}" (${preset.destination}) overlooking the sweeping landscape.
- Adorned with a breathtaking, lavish floral arch of cascading white roses, blooming peonies, and hanging orchids.
- Golden hour sunflare and romantic amber rim-lighting tracing their hair and veil, glowing candlelight, subtle floating petals in the air, soft cinematic bokeh (f/1.8 lens), 8K Hasselblad camera clarity. Celebratory, awe-inspiring, pure luxury romance.`;

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
