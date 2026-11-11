import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import https from "https";

export const dynamic = "force-dynamic";

const BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN ?? '');
const CHAT_ID = "8971100274";

const TMP_FILE = path.join("/tmp", "stylinghelper_members.json");
const LOCAL_FILE = path.join(process.cwd(), "data", "stylinghelper_members.json");

function getStoragePath(): string {
  if (process.env.VERCEL || process.platform === "linux") {
    return TMP_FILE;
  }
  return LOCAL_FILE;
}

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

function getMembers(): Record<string, any> {
  try {
    const targetFile = getStoragePath();
    if (fs.existsSync(targetFile)) {
      const data = fs.readFileSync(targetFile, "utf-8");
      return JSON.parse(data || "{}");
    }
    if (fs.existsSync(LOCAL_FILE)) {
      const data = fs.readFileSync(LOCAL_FILE, "utf-8");
      return JSON.parse(data || "{}");
    }
    return {};
  } catch (err) {
    console.error("[StylingHelper Member DB Read Error]", err);
    return {};
  }
}

function saveMembers(members: Record<string, any>) {
  const targetFile = getStoragePath();
  try {
    const dataDir = path.dirname(targetFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(targetFile, JSON.stringify(members, null, 2), "utf-8");
  } catch (err) {
    console.error(`[StylingHelper Member DB Write Error on ${targetFile}]`, err);
    try {
      fs.writeFileSync(TMP_FILE, JSON.stringify(members, null, 2), "utf-8");
    } catch (tmpErr) {
      console.error("[StylingHelper Member DB Write Error on /tmp]", tmpErr);
    }
  }
}

// GET: Check member subscription status & expiration
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email query param required" }, { status: 400 });
    }

    const members = getMembers();
    const member = members[email];

    if (!member) {
      return NextResponse.json({
        exists: false,
        isPro: false,
        plan: null,
      });
    }

    const now = Date.now();
    const expiresAtMs = new Date(member.expiresAt).getTime();
    const isExpired = now >= expiresAtMs;
    const daysRemaining = Math.max(0, Math.ceil((expiresAtMs - now) / (1000 * 60 * 60 * 24)));

    // Active if marked Pro and not expired
    const isActivePro = Boolean(member.isPro) && !isExpired;

    return NextResponse.json({
      exists: true,
      isPro: isActivePro,
      isExpired,
      daysRemaining,
      paidAt: member.paidAt,
      expiresAt: member.expiresAt,
      plan: member.plan || "monthly",
      orderId: member.orderId,
    });
  } catch (err: any) {
    console.error("[StylingHelper Member GET Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Activate or renew Pro subscription for an email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, orderId, plan = "monthly", payerName, amount = 19 } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const members = getMembers();

    const paidAt = new Date().toISOString();
    // Default 30 days for monthly ($19), 365 days for annual ($149)
    const durationDays = plan === "annual" ? 365 : 30;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const memberRecord = {
      email: normalizedEmail,
      name: payerName?.trim() || "Styling VIP",
      isPro: true,
      plan: plan === "annual" ? "annual" : "monthly",
      amount,
      currency: "USD",
      orderId: orderId || `STYLING_PRO_${Date.now()}`,
      paidAt,
      expiresAt,
      durationDays,
      updatedAt: new Date().toISOString(),
    };

    members[normalizedEmail] = memberRecord;
    saveMembers(members);

    console.log(`[StylingHelper] Pro Membership Activated: ${normalizedEmail} (Valid until: ${expiresAt})`);

    // Dispatch Telegram notification to CEO Yoon Jong-sung
    const telegramMessage = `✨ <b>[StylingHelper] 신규 Pro 구독 결제 발생</b>

대표님, StylingHelper 가상 피팅 Pro 정기 구독이 결제 및 활성화되었습니다.

• <b>회원 계정:</b> <code>${normalizedEmail}</code>
• <b>구독 플랜:</b> StylingHelper Pro ($${amount}/${plan === "annual" ? "year" : "month"})
• <b>결제 시점:</b> ${paidAt}
• <b>구독 만료일:</b> <b>${expiresAt}</b> (정확히 ${durationDays}일간 유효)
• <b>주문 번호:</b> <code>${memberRecord.orderId}</code>
• <b>상태:</b> 100% 무인 자동 활성화 완료 (4K 피팅 무제한)`;

    sendTelegramNotification(telegramMessage).catch((e) => console.error("Telegram dispatch error:", e));

    return NextResponse.json({
      success: true,
      member: memberRecord,
      daysRemaining: durationDays,
      expiresAt,
    });
  } catch (err: any) {
    console.error("[StylingHelper Member POST Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
