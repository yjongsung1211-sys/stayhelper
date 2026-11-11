import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import https from 'https';

const BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN ?? '');
const CHAT_ID = '8971100274';
const TARGET_EMAIL = 'yjongsung1211@gmail.com';

function sendTelegramAlert(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML',
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', (err) => {
      console.error('[Telegram Report Error]', err);
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportType, productTitle, productUrl, userEmail, description } = body;

    const reportItem = {
      id: `rep_${Date.now()}`,
      reportType: reportType || 'Sold Out / Error',
      productTitle: productTitle || 'N/A',
      productUrl: productUrl || 'N/A',
      userEmail: userEmail || 'Anonymous',
      description: description || 'N/A',
      targetRecipient: TARGET_EMAIL,
      reportedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'Unknown',
      ip: request.headers.get('x-forwarded-for') || 'Unknown',
    };

    // 1. Save to local reports JSON DB
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const reportsFile = path.join(reportsDir, 'user_bug_reports.json');
    let existingReports = [];
    if (fs.existsSync(reportsFile)) {
      try {
        existingReports = JSON.parse(fs.readFileSync(reportsFile, 'utf-8'));
      } catch {
        existingReports = [];
      }
    }
    existingReports.push(reportItem);
    fs.writeFileSync(reportsFile, JSON.stringify(existingReports, null, 2), 'utf-8');

    // 2. Send Real-Time Telegram Push Alert
    const typeEmoji = reportType?.includes('품절') || reportType?.includes('Sold Out') ? '🛒' : '⚠️';
    const telegramMessage = `
${typeEmoji} <b>[StylingHelper 오류 및 품절 신고 접수]</b>
────────────────────
• <b>수신 대상:</b> ${TARGET_EMAIL}
• <b>신고 유형:</b> ${reportType || '오류 신고'}
• <b>대상 제품/페이지:</b> ${productTitle || 'N/A'}
• <b>제품/링크 URL:</b> ${productUrl || 'N/A'}
• <b>신고자 이메일:</b> ${userEmail || '익명 고객'}
• <b>상세 내용:</b> ${description || '내용 없음'}
• <b>접수 시간:</b> ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
────────────────────
<i>* reports/user_bug_reports.json에 영구 기록되었습니다.</i>
    `.trim();

    await sendTelegramAlert(telegramMessage);

    return NextResponse.json({
      success: true,
      message: '신고가 정상 접수되었습니다. 담당자(yjongsung1211@gmail.com)에게 알림이 전송되었습니다.',
      reportId: reportItem.id,
      mailtoUrl: `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(
        `[StylingHelper 신고] ${reportType} - ${productTitle || '오류 접수'}`
      )}&body=${encodeURIComponent(
        `신고 유형: ${reportType}\n제품/페이지: ${productTitle}\n링크: ${productUrl}\n\n상세 내용:\n${description}\n\n신고자: ${userEmail}`
      )}`,
    });
  } catch (error: any) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { success: false, error: '신고 접수 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
