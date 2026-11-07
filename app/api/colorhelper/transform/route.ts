import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      toneId = 'spring-light',
      seasonName = 'Spring Warm Light',
      bestColorName = 'Peach Coral',
      bestColorHex = '#FFA07A',
      lipName = 'Dior Coral Glow',
      lipHex = '#E07A5F',
      hairName = 'Warm Chestnut Brown',
      gender = 'unisex',
    } = body;

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'An image photograph is required to synthesize personal color styling.' },
        { status: 400 }
      );
    }

    // 1. Separate base64 data
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
        const localPath = path.join(process.cwd(), 'public', image.replace(/^\//, ''));
        if (fs.existsSync(localPath)) {
          const buf = fs.readFileSync(localPath);
          base64Data = buf.toString('base64');
          mimeType = image.endsWith('.png') ? 'image/png' : 'image/jpeg';
        }
      } catch (e) {
        console.error('Error reading local sample image:', e);
      }
    }

    // 2. High-fashion Beauty Studio Prompt for Gemini 2.5 Flash Image / Nano Banana
    const promptText = `You are the world's most elite personal color stylist, celebrity makeup artist, and Vogue beauty director.
Your mission is to perform a HIGH-END PERSONAL COLOR MAKEOVER on the individual in the input photograph.

[CRITICAL REQUIREMENT 1: 100% IDENTICAL FACIAL IDENTITY LOCK]
- You MUST preserve the exact authentic facial features, facial structure, eye shape, nose shape, lip shape, age, and natural likeness of the person in the photograph.
- The person must be instantly and 100% recognizable as themselves, but looking their absolute healthiest, most radiant, and beautifully styled best.

[CRITICAL REQUIREMENT 2: TAILORED BEST PERSONAL COLOR HAIR STYLING]
- Apply a salon-grade, lustrous, healthy hair color makeover perfectly harmonized with their personal color palette: "${seasonName}".
- Hair Color: "${hairName}".
- Render silky, voluminous, glossy hair with subtle dimensional light reflections, natural hair roots, and zero artificial wig appearance.

[CRITICAL REQUIREMENT 3: TAILORED LUXURY MAKEUP SYNTHESIS]
- Apply professional high-definition celebrity makeup tailored specifically to their skin undertone:
  - LIPS: Flawless, hydrated, sheer-to-medium glossy tint in the signature shade "${lipName}" (${lipHex}). Soft gradient blending, natural lip texture.
  - EYES & BROWS: Neatly groomed eyebrows. Subtle, flattering eyeshadow contouring matching their "${seasonName}" palette, soft lash definition, zero clumpy makeup.
  - COMPLEXION: Dewy, luminous Korean glass-skin finish. Smooth, radiant, healthy porcelain glow that makes their face look vibrant and youthful.

[CRITICAL REQUIREMENT 4: TAILORED LUXURY WARDROBE DRAPERY]
- Dress the individual in a sophisticated, minimalist luxury cashmere/silk top or tailored blazer in their absolute best signature color: "${bestColorName}" (${bestColorHex}).
- Elegant neckline (subtle crew neck or tailored V-lapel) that flatters their jawline and makes their complexion pop with radiance.

[PHOTOGRAPHY STANDARD]
- High-end beauty editorial studio lighting (soft diffused key light, subtle hair rim light).
- Crisp 8K Hasselblad portrait camera clarity, shallow depth of field (f/2.0), neutral clean studio background.
- Clean, realistic, jaw-dropping personal color transformation.`;

    const key = process.env.GEMINI_API_KEY || '';
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-image';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

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
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          const parts = candidate?.content?.parts || [];

          for (const part of parts) {
            if (part.inlineData?.data) {
              const resMime = part.inlineData.mimeType || 'image/jpeg';
              const resultBase64 = `data:${resMime};base64,${part.inlineData.data}`;
              return NextResponse.json({
                success: true,
                transformedImage: resultBase64,
                seasonName,
                bestColorName,
                hairName,
                lipName,
              });
            }
          }
        } else {
          const errText = await response.text();
          console.error('Gemini API transform error:', response.status, errText);
        }
      } catch (err) {
        console.error('Gemini API fetch exception:', err);
      }
    }

    // Fallback: If API key is not set or rate limited, return intelligent fallback
    return NextResponse.json({
      success: false,
      message: 'Gemini synthesis processed with fallback visual preview',
      seasonName,
      bestColorName,
    });
  } catch (error: any) {
    console.error('Personal Color Transform API critical error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error during Gemini styling transformation.' },
      { status: 500 }
    );
  }
}
