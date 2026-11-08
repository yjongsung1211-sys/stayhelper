import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import https from 'https';

export const dynamic = 'force-dynamic';

const BOT_TOKEN = "8728900069:AAGQ1TiV7sPBXNwmfAs1GxxMnN0UTLgPZxs";
const CHAT_ID = "8971100274";

const MEMBERS_FILE = path.join(process.cwd(), "data", "stylinghelper_members.json");

function sendTelegramNotification(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "HTML",
    });

    const options = {
      hostname: "api.telegram.org",
      port: 443,
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on("error", (err) => {
      console.error("[Telegram Error]", err);
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, details, plan = 'monthly', email: inputEmail } = body;

    const email = (inputEmail || details?.payer?.email_address || 'customer@paypal.com').trim().toLowerCase();
    const amount = plan === 'annual' ? 149 : 19;
    const durationDays = plan === 'annual' ? 365 : 30;

    const paidAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const memberRecord = {
      email,
      name: details?.payer?.name?.given_name ? `${details.payer.name.given_name} ${details.payer.name.surname || ''}`.trim() : 'PayPal Customer',
      isPro: true,
      plan,
      amount,
      currency: 'USD',
      orderId: orderId || details?.id || `PAYPAL_${Date.now()}`,
      paidAt,
      expiresAt,
      durationDays,
      updatedAt: new Date().toISOString(),
    };

    try {
      const dataDir = path.dirname(MEMBERS_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      let members: Record<string, any> = {};
      if (fs.existsSync(MEMBERS_FILE)) {
        members = JSON.parse(fs.readFileSync(MEMBERS_FILE, 'utf-8') || '{}');
      }
      members[email] = memberRecord;
      fs.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2), 'utf-8');
    } catch (fsErr) {
      console.error('[StylingHelper PayPal Member Save Error]', fsErr);
    }

    console.log('[StylingHelper PayPal Order Completed]', {
      email,
      orderId: memberRecord.orderId,
      amount,
      plan,
      durationDays,
      expiresAt,
    });

    // Notify CEO on Telegram
    const telegramMessage = `✨ <b>[StylingHelper] PayPal 결제 확인 및 Pro 활성화</b>

대표님, PayPal을 통한 StylingHelper Pro 결제가 승인되었습니다.

• <b>고객 계정:</b> <code>${email}</code>
• <b>결제 금액:</b> $${amount} USD (${plan === 'annual' ? '연간' : '월간'} 정기구독)
• <b>결제 시각:</b> ${paidAt}
• <b>구독 만료일:</b> <b>${expiresAt}</b> (결제일로부터 ${durationDays}일간)
• <b>주문 ID:</b> <code>${memberRecord.orderId}</code>`;

    sendTelegramNotification(telegramMessage).catch(() => {});

    return NextResponse.json({
      success: true,
      orderId: memberRecord.orderId,
      amount,
      plan: `StylingHelper Pro ($${amount}/${plan === 'annual' ? 'year' : 'month'})`,
      durationDays,
      paidAt,
      expiresAt,
    });
  } catch (error: any) {
    console.error('PayPal record error:', error);
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}
