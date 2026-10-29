import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import https from "https";

interface QuickUser {
  id: string;
  email: string;
  name: string;
  role: string;
  region: string;
  provider: string;
  createdAt: string;
  lastLoginAt: string;
}

const BOT_TOKEN = "8728900069:AAGQ1TiV7sPBXNwmfAs1GxxMnN0UTLgPZxs";
const CHAT_ID = "8971100274";

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

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (e) {
    console.error("Error ensuring users file:", e);
  }
}

function saveUser(user: QuickUser) {
  try {
    ensureDataFile();
    let users: QuickUser[] = [];
    if (fs.existsSync(USERS_FILE)) {
      try {
        users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8")) || [];
      } catch {
        users = [];
      }
    }
    const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user, lastLoginAt: new Date().toISOString() };
    } else {
      users.unshift(user);
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");

    // Also sync to stayhelper_members.json for backward compatibility
    const membersFile = path.join(DATA_DIR, "stayhelper_members.json");
    let members: any[] = [];
    if (fs.existsSync(membersFile)) {
      try {
        members = JSON.parse(fs.readFileSync(membersFile, "utf-8")) || [];
      } catch {
        members = [];
      }
    }
    const memberIdx = members.findIndex((m: any) => m.email?.toLowerCase() === user.email.toLowerCase());
    const memberObj = {
      id: user.id,
      timestamp: user.createdAt,
      name: user.name,
      email: user.email,
      provider: user.provider,
      tier: "VIP_COMPLIMENTARY",
    };
    if (memberIdx >= 0) {
      members[memberIdx] = { ...members[memberIdx], ...memberObj };
    } else {
      members.unshift(memberObj);
    }
    fs.writeFileSync(membersFile, JSON.stringify(members, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving user:", e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, provider = "email" } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName =
      name && typeof name === "string" && name.trim()
        ? name.trim()
        : cleanEmail.split("@")[0];

    const now = new Date().toISOString();
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const userObj: QuickUser = {
      id: userId,
      email: cleanEmail,
      name: cleanName,
      role: "user",
      region: "US",
      provider,
      createdAt: now,
      lastLoginAt: now,
    };

    saveUser(userObj);

    // Send Telegram Notification
    const telegramMessage = `👑 <b>[StayHelper] 신규 VIP 회원 가입 / 로그인</b>
━━━━━━━━━━━━━━━━━━
👤 <b>회원 이름</b>: <code>${userObj.name}</code>
📧 <b>이메일</b>: <code>${userObj.email}</code>
🔑 <b>인증 수단</b>: ${provider.toUpperCase()} 1-Click
💎 <b>회원 등급</b>: VIP Private Member
━━━━━━━━━━━━━━━━━━
⏰ <b>일시</b>: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`;

    await sendTelegramNotification(telegramMessage);

    const response = NextResponse.json({
      ok: true,
      message: "Successfully authenticated",
      user: userObj,
    });

    response.cookies.set(
      "stayhelper_user",
      JSON.stringify({
        id: userObj.id,
        email: userObj.email,
        name: userObj.name,
      }),
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      }
    );

    return response;
  } catch (error: any) {
    console.error("Quick auth error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
