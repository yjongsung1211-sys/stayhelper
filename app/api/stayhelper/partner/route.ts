import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import https from "https";

const BOT_TOKEN = "8728900069:AAGQ1TiV7sPBXNwmfAs1GxxMnN0UTLgPZxs";
const CHAT_ID = "8971100274";

function sendTelegramMessage(text: string): Promise<boolean> {
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
    const {
      propertyName,
      propertyType,
      destination,
      contactName,
      contactEmail,
      contactPhone,
      partnershipType,
      notes
    } = body;

    if (!propertyName || !contactEmail) {
      return NextResponse.json(
        { error: "Property name and email are required" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const leadRecord = {
      id: `lead_${Date.now()}`,
      timestamp,
      propertyName,
      propertyType,
      destination,
      contactName,
      contactEmail,
      contactPhone,
      partnershipType,
      notes: notes || ""
    };

    // 1. Save to backup JSON database
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const leadsFile = path.join(dataDir, "stayhelper_leads.json");
      let leads = [];
      if (fs.existsSync(leadsFile)) {
        try {
          leads = JSON.parse(fs.readFileSync(leadsFile, "utf-8"));
        } catch {
          leads = [];
        }
      }
      leads.unshift(leadRecord);
      fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), "utf-8");
    } catch (fsErr) {
      console.error("[Lead Storage Error]", fsErr);
    }

    // 2. Dispatch instant notification to Representative via Telegram
    const telegramMessage = `🛎️ <b>[StayHelper] 신규 호텔 파트너십 제휴 신청 접수</b>

대표님, StayHelper B2B 호텔 파트너십 신청이 실시간 접수되었습니다.

━━━━━━━━━━━━━━━━━━
🏨 <b>호텔/리조트명</b>: <code>${propertyName}</code>
🏷️ <b>카테고리</b>: ${propertyType || "Luxury Pool Villa"}
📍 <b>위치/목적지</b>: ${destination || "Global"}

👤 <b>담당자/직함</b>: ${contactName || "미입력"}
📧 <b>이메일</b>: <code>${contactEmail}</code>
📱 <b>연락처</b>: <code>${contactPhone || "미입력"}</code>

🤝 <b>제휴 분야</b>: ${partnershipType || "8K Cinematic Reel Production"}
📝 <b>상세 요청사항</b>:
${notes ? notes : "(남겨진 상세 메모 없음)"}
━━━━━━━━━━━━━━━━━━
⏰ <b>접수 시간</b>: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
💾 <b>백업 파일</b>: <code>data/stayhelper_leads.json</code>`;

    await sendTelegramMessage(telegramMessage);

    return NextResponse.json({
      success: true,
      message: "Partnership inquiry successfully submitted and notified."
    });
  } catch (err: any) {
    console.error("[StayHelper Partner API Error]", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message },
      { status: 500 }
    );
  }
}
