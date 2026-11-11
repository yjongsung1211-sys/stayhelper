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

    // 2. Multimodal Prompt with Strict East Asian (Korean) Facial Identity Lock
    // IMPORTANT: We do NOT pass the Caucasian stock photo as an image to Gemini.
    // Instead, we pass ONLY the user's authentic reference photo(s), and rich, photographic art direction for the destination venue.
    const promptText = `A cinematic, ultra-photorealistic 8K wedding portrait of the REAL East Asian Korean couple in the reference photo(s).

[CRITICAL REQUIREMENT 1: 100% KOREAN FACIAL LIKENESS & ETHNIC IDENTITY LOCK]
- The man and woman in the reference photo(s) are the REAL BRIDE AND GROOM.
- GROOM: You MUST 100% PRESERVE his exact Korean facial bone structure, eye shape (monolid/natural contour), clean eyebrows, masculine jawline, and genuine warm smile. Groom height: ${groomHeight}cm, weight: ${groomWeight}kg. He is styled with clean modern dapper hair, dressed in ${preset.groomAttire || 'a bespoke tailored ivory-cream Italian linen tuxedo with a black silk bow tie'}.
- BRIDE: You MUST 100% PRESERVE her exact lovely Korean face, delicate eye contours, charming cheek dimples, refined nose bridge, and radiant genuine smile. Bride height: ${brideHeight}cm, weight: ${brideWeight}kg. Her hair is styled in an effortless romantic low chignon with delicate fresh bridal floral pins, dressed in ${preset.brideAttire || 'an exquisite haute couture backless mermaid lace bridal gown with an ethereal chapel train'}.
- Both have luminous Korean luxury porcelain glass-skin (수분 물광 피부), natural dewy complexion with zero blemishes.
- Zero Caucasianization, zero Westernization, zero replacement with stock models. Their friends and family MUST recognize them immediately: "That is 100% our bride and groom!"

[SETTING & COMPOSITION: ${angleTitle.toUpperCase()} AT ${preset.venueName.toUpperCase()}]
- Destination: ${preset.destination} (${preset.venueName}).
- Scene context: ${preset.promptDescription}.
- Composition & Camera: Shot on Hasselblad H6D-100c with prime portrait lens, beautiful natural golden hour rim light highlighting the veil lace and tuxedo fabric, perfect depth of field, pristine luxury bridal atelier standard.`;

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
        'gemini-2.5-flash-image',
        'gemini-3.1-flash-image',
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
