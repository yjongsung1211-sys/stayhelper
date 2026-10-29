import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import https from "https";

const BOT_TOKEN = "8728900069:AAGQ1TiV7sPBXNwmfAs1GxxMnN0UTLgPZxs";
const CHAT_ID = "8971100274";

function sendTelegramNotification(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "HTML"
    });

    const options = {
      hostname: "api.telegram.org",
      port: 443,
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, interestedHotel, destination } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const memberRecord = {
      id: `member_${Date.now()}`,
      timestamp,
      name: name?.trim() || "Private Member",
      email: email.trim().toLowerCase(),
      interestedHotel: interestedHotel || "All Sanctuaries",
      destination: destination || "Global",
      tier: "VIP_COMPLIMENTARY"
    };

    // 1. Save to members database (data/stayhelper_members.json)
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const membersFile = path.join(dataDir, "stayhelper_members.json");
      let members = [];
      if (fs.existsSync(membersFile)) {
        try {
          members = JSON.parse(fs.readFileSync(membersFile, "utf-8"));
        } catch {
          members = [];
        }
      }

      // Check if email already registered, update or prepend
      const existingIdx = members.findIndex(
        (m: any) => m.email === memberRecord.email
      );
      if (existingIdx >= 0) {
        members[existingIdx] = { ...members[existingIdx], ...memberRecord };
      } else {
        members.unshift(memberRecord);
      }

      fs.writeFileSync(membersFile, JSON.stringify(members, null, 2), "utf-8");
    } catch (fsErr) {
      console.error("[Member Storage Error]", fsErr);
    }

    // 2. Dispatch real-time Telegram notification to CEO
    const telegramMessage = `👑 <b>[StayHelper] 신규 프라이빗 VIP 회원 가입 알림</b>

대표님, StayHelper 프라이빗 컬렉션에 신규 회원이 가입했습니다.

━━━━━━━━━━━━━━━━━━
👤 <b>회원 이름</b>: <code>${memberRecord.name}</code>
📧 <b>이메일</b>: <code>${memberRecord.email}</code>
🏨 <b>관심 호텔</b>: <code>${memberRecord.interestedHotel}</code>
📍 <b>목적지</b>: ${memberRecord.destination}
💎 <b>회원 등급</b>: VIP Complimentary Member
━━━━━━━━━━━━━━━━━━
⏰ <b>가입 일시</b>: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
💾 <b>DB 저장 위치</b>: <code>data/stayhelper_members.json</code>`;

    await sendTelegramNotification(telegramMessage);

    return NextResponse.json({
      success: true,
      member: {
        id: memberRecord.id,
        name: memberRecord.name,
        email: memberRecord.email
      }
    });
  } catch (err: any) {
    console.error("[StayHelper Member API Error]", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message },
      { status: 500 }
    );
  }
}
