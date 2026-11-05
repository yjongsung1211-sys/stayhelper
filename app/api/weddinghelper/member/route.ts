import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MEMBERS_FILE = path.join(process.cwd(), "data", "weddinghelper_members.json");

function getMembers(): Record<string, any> {
  try {
    if (!fs.existsSync(MEMBERS_FILE)) {
      fs.writeFileSync(MEMBERS_FILE, JSON.stringify({}), "utf-8");
      return {};
    }
    const data = fs.readFileSync(MEMBERS_FILE, "utf-8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.error("[WeddingHelper Member DB Read Error]", err);
    return {};
  }
}

function saveMembers(members: Record<string, any>) {
  try {
    fs.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2), "utf-8");
  } catch (err) {
    console.error("[WeddingHelper Member DB Write Error]", err);
  }
}

// GET: Check if email is an active paid VIP member
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email query param required" }, { status: 400 });
    }

    const members = getMembers();
    const member = members[email];

    if (member && (member.plan === "grand" || member.isVip)) {
      return NextResponse.json({
        exists: true,
        isVip: true,
        plan: member.plan || "grand",
        member,
      });
    }

    return NextResponse.json({
      exists: false,
      isVip: false,
      plan: null,
    });
  } catch (err: any) {
    console.error("[WeddingHelper Member GET Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Activate & record VIP purchase linked to email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, plan = "grand", orderId, weddingDate } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const members = getMembers();

    const paidAt = new Date().toISOString();
    // 1-year default or wedding date + 60 days
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    const memberRecord = {
      email: normalizedEmail,
      isVip: true,
      plan: plan || "grand",
      orderId: orderId || `WH_VIP_${Date.now()}`,
      paidAt,
      expiresAt,
      weddingDate: weddingDate || "Saturday, November 14, 2026",
      updatedAt: new Date().toISOString(),
    };

    members[normalizedEmail] = memberRecord;
    saveMembers(members);

    console.log(`[WeddingHelper] VIP Pass Linked to Account: ${normalizedEmail} (Plan: ${plan})`);

    return NextResponse.json({
      success: true,
      member: memberRecord,
    });
  } catch (err: any) {
    console.error("[WeddingHelper Member POST Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
