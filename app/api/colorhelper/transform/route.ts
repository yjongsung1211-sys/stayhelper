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

    // 2. High-precision Personal Color Styling Prompt for Gemini 2.5 Flash Image / Nano Banana
    const promptText = `[TASK: REALISTIC PERSONAL COLOR STYLING EDIT - STRICT 1:1 FACIAL IDENTITY PRESERVATION]
Edit the input portrait of this exact individual to demonstrate their best personal color styling.

[CRITICAL IDENTITY RULES - 100% IDENTICAL LIKENESS LOCK]:
1. EXACT FACE PRESERVATION: You MUST keep the EXACT SAME person. Do NOT replace them with an idealized model, K-pop idol, or stranger. Their authentic age, facial bone structure, jawline width, cheekbones, exact eye shape (monolid/eyelid contours, eye spacing, eye gaze), nose shape (bridge height, nostril width), and lip shape MUST remain 100% IDENTICAL to the input photograph.
2. NO PLASTIC BEAUTY FILTER: Do NOT smooth out the face into an artificial anime, CGI, or plastic doll face. Retain authentic human skin texture, natural pores, and their genuine facial characteristics.
3. HAIR STYLING: Keep their natural hairline and head geometry. Style their hair neatly in a sophisticated, flattering professional cut harmonized with their signature personal color tone: "${hairName}".
4. WARDROBE TRANSFORMATION: Replace their casual clothes with a premium luxury tailored blazer or cashmere knitwear in their absolute best signature color: "${bestColorName}" (${bestColorHex}).
5. GROOMING & REFINEMENT: Apply subtle, professional grooming: clean, even complexion with healthy natural radiance, neatly groomed eyebrows, and natural healthy lips (${lipName} ${lipHex}).
6. PHOTOGRAPHY STANDARD: Clean high-end portrait studio lighting (soft key light, subtle rim light), crisp 8K DSLR portrait clarity, neutral studio background.

The final image MUST be unmistakably the same person looking their absolute sharpest, most confident, and best styled self in their personal color!`;

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
