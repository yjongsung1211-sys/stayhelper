import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/stayhelper?error=google_auth_failed", req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/stayhelper?error=missing_server_credentials", req.url));
  }

  try {
    const redirectUri = `${req.nextUrl.origin}/api/auth/callback/google`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.redirect(new URL("/stayhelper?error=token_exchange_failed", req.url));
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/stayhelper?error=userinfo_failed", req.url));
    }

    const userInfo = await userRes.json();
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

    // Telegram Alert
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChatId) {
      const msg = `👑 [StayHelper] 구글 웹 OAuth 2.0 성공\n` +
        `👤 회원: ${vipUser.name}\n` +
        `📧 계정: ${vipUser.email}\n` +
        `🕒 일시: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`;
      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChatId, text: msg }),
      }).catch(() => {});
    }

    // Redirect back to /stayhelper and set cookie
    const response = NextResponse.redirect(new URL("/stayhelper?auth=success", req.url));
    response.cookies.set("stayhelper_user", JSON.stringify(vipUser), {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(new URL("/stayhelper?error=internal_error", req.url));
  }
}
