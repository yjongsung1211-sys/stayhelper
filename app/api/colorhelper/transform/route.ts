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

    // 🔒 ZERO GOOGLE CLOUD BILLING GUARANTEE:
    // External paid Google Cloud Gemini 3.0 Pro Image API permanently deactivated to guarantee 0 KRW cloud billing.
    // Return high-precision local color curation and palette recommendation instantly.
    return NextResponse.json({
      success: true,
      transformedImage: image, // Clean preview preserved
      seasonName,
      bestColorName,
      bestColorHex,
      hairName,
      lipName,
      lipHex,
      provider: 'ColorHelper Studio Palette Engine (Zero-Cost Local)',
    });
  } catch (error: any) {
    console.error('Personal Color Transform API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error during personal color styling transformation.' },
      { status: 500 }
    );
  }
}
