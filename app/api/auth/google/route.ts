import { NextRequest, NextResponse } from "next/server";

interface GoogleUserInfo {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: string | boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential, code, redirectUri } = body;

    let userInfo: GoogleUserInfo | null = null;

    // 1. Case A: Google Identity Services JWT (id_token / credential)
    if (credential) {
      const verifyRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
        { method: "GET" }
      );

      if (!verifyRes.ok) {
        return NextResponse.json(
          { ok: false, error: "Invalid Google credential token" },
          { status: 401 }
        );
      }

      const tokenData = await verifyRes.json();
      userInfo = {
        sub: tokenData.sub,
        email: tokenData.email,
        name: tokenData.name || tokenData.email.split("@")[0],
        picture: tokenData.picture,
        email_verified: tokenData.email_verified,
      };
    }
    // 2. Case B: Authorization Code Exchange (OAuth 2.0 Code Flow)
    else if (code) {
      const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return NextResponse.json(
          { ok: false, error: "Server missing GOOGLE_CLIENT_SECRET" },
          { status: 500 }
        );
      }

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri || `${req.nextUrl.origin}/api/auth/callback/google`,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        return NextResponse.json(
          { ok: false, error: tokenData.error_description || "Failed to exchange code" },
          { status: 400 }
        );
      }

      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userRes.ok) {
        return NextResponse.json(
          { ok: false, error: "Failed to fetch Google profile" },
          { status: 400 }
        );
      }

      userInfo = await userRes.json();
    } else {
      return NextResponse.json(
        { ok: false, error: "No Google credential or code provided" },
        { status: 400 }
      );
    }

    if (!userInfo || !userInfo.email) {
      return NextResponse.json(
        { ok: false, error: "Could not retrieve email from Google" },
        { status: 400 }
      );
    }

    // VIP Member user object
    const vipUser = {
      id: `usr_g_${userInfo.sub || Date.now()}`,
      email: userInfo.email,
      name: userInfo.name || userInfo.email.split("@")[0],
      picture: userInfo.picture,
      role: "vip",
      region: "US",
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    // Send Telegram VIP notification (Async non-blocking)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChatId) {
      const msg = `👑 [StayHelper] 구글 공식 로그인 완료\n` +
        `👤 회원: ${vipUser.name}\n` +
        `📧 계정: ${vipUser.email}\n` +
        `🔑 인증: Google OAuth 2.0 Verified\n` +
        `🕒 일시: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`;

      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChatId, text: msg }),
      }).catch(() => {});
    }

    // Set HTTP-only / Lax cookie for seamless session sync
    const res = NextResponse.json({ ok: true, user: vipUser });
    res.cookies.set("stayhelper_user", JSON.stringify(vipUser), {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
      httpOnly: false, // Accessible to client-side hydration
    });

    return res;
  } catch (err: any) {
    console.error("Google Auth Error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal server error during Google auth" },
      { status: 500 }
    );
  }
}
