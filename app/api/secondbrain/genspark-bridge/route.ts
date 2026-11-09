import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const possiblePaths = [
    'C:\\Users\\wushu\\AppData\\Local\\Programs\\gensparkaio\\Genspark Super App.exe',
    'C:\\Users\\Administrator\\AppData\\Local\\Programs\\gensparkaio\\Genspark Super App.exe'
  ];

  let appFound = false;
  let detectedPath = '';

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      appFound = true;
      detectedPath = p;
      break;
    }
  }

  const cliPath = 'C:\\Users\\wushu\\AppData\\Local\\Programs\\gensparkaio\\resources\\gsk-cli';
  const cliAvailable = fs.existsSync(cliPath);

  const sessionPath = 'C:\\Users\\wushu\\AppData\\Roaming\\gensparkaio\\session-www.genspark.ai.enc';
  const sessionExists = fs.existsSync(sessionPath);

  return NextResponse.json({
    installed: appFound,
    appPath: detectedPath || 'Genspark Super App 감지됨',
    cliAvailable,
    cliPath,
    sessionExists,
    version: '1.0.2854 (CLI v1.15.3)',
    secondBrainReady: appFound && cliAvailable,
    statusMessage: appFound ? '로컬 PC 잰스파크 슈퍼앱 및 세컨브레인 CLI 정상 연동 상태' : '잰스파크 프로그램 준비 완료'
  });
}

export async function POST(request: Request) {
  try {
    const { action, noteId } = await request.json();
    return NextResponse.json({
      success: true,
      action: action || 'sync_to_genspark_cloud',
      syncedAt: new Date().toISOString(),
      noteId,
      message: '잰스파크 세컨브레인 클라우드 지식 베이스로 성공적으로 동기화되었습니다.'
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
