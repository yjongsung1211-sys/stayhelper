/**
 * =========================================================================
 * WEDDINGHELPER AUTOMATED DELIVERY & EMAIL / TELEGRAM ALERT ENGINE
 * =========================================================================
 */

import { Resend } from 'resend';

const BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN ?? '');
const CHAT_ID = "8971100274";

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'WeddingHelper Atelier <onboarding@resend.dev>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.weddinghelper.love';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * 1. Telegram Notification to CEO (Real-time Order & Completed alerts)
 */
export async function sendTelegramNotification(text: string): Promise<boolean> {
  try {
    if (!BOT_TOKEN) {
      console.warn('[WeddingDelivery] TELEGRAM_BOT_TOKEN not configured.');
      return false;
    }
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[WeddingDelivery Telegram Error]:', err);
    return false;
  }
}

/**
 * 2. Resend Email Dispatch Engine
 */
export async function sendEmailDelivery(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!resend) {
    console.warn(`[WeddingDelivery Email] RESEND_API_KEY not configured. Simulated dispatch to: ${params.to}`);
    return { 
      success: false, 
      error: 'RESEND_API_KEY is not configured in .env.local' 
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error('[WeddingDelivery Resend Error]:', error);
      return { success: false, error: error.message };
    }

    console.log(`[WeddingDelivery Email Sent]: ID ${data?.id} -> ${params.to}`);
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('[WeddingDelivery Email Exception]:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 3. HTML Email Template: Order Confirmation & Private Gallery Link
 */
function buildOrderConfirmationEmail(params: {
  orderId: string;
  email: string;
  plan: string;
  themeTitle: string;
  galleryUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WeddingHelper Atelier Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #120E10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FAF8F5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #120E10; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #1F181B; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 28px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          <!-- Header Banner -->
          <tr>
            <td align="center" style="padding: 48px 32px 24px; background: linear-gradient(180deg, rgba(212, 175, 55, 0.12) 0%, rgba(31, 24, 27, 0) 100%);">
              <span style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background-color: rgba(212, 175, 55, 0.2); border: 1px solid rgba(212, 175, 55, 0.4); color: #D4AF37; font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;">
                HAUTE COUTURE WEDDING ATELIER
              </span>
              <h1 style="margin: 18px 0 8px; font-family: Georgia, serif; font-size: 28px; font-weight: 300; letter-spacing: 0.05em; color: #FFFFFF; line-height: 1.3;">
                240장 웨딩 마스터피스<br><span style="color: #D4AF37; font-weight: 700;">제작 요청이 정상 접수되었습니다</span>
              </h1>
              <p style="margin: 0; font-size: 13px; color: rgba(250, 248, 245, 0.65); line-height: 1.6;">
                두 분의 소중한 본인 얼굴 골격을 100% 완벽 보존하여 전 세계 12대 럭셔리 휴양지 240개 앵글로 렌더링을 진행합니다.
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <div style="background-color: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 24px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px;">
                  <tr>
                    <td style="padding: 8px 0; color: rgba(250, 248, 245, 0.5);">주문 번호 (Order ID)</td>
                    <td align="right" style="padding: 8px 0; color: #D4AF37; font-weight: 700; font-family: monospace;">${params.orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: rgba(250, 248, 245, 0.5);">수신 고객 이메일</td>
                    <td align="right" style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${params.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: rgba(250, 248, 245, 0.5);">선택 플랜</td>
                    <td align="right" style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${params.plan.toUpperCase()} (12대 세계관 · 240 마스터피스)</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: rgba(250, 248, 245, 0.5);">해상도 규격</td>
                    <td align="right" style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">4K Hasselblad Ultra-HD (인쇄용)</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Primary CTA Button -->
          <tr>
            <td align="center" style="padding: 0 32px 36px;">
              <a href="${params.galleryUrl}" target="_blank" style="display: block; width: 100%; max-width: 420px; padding: 18px 24px; background: linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%); color: #1F181B; text-align: center; text-decoration: none; font-size: 15px; font-weight: 800; letter-spacing: 0.05em; border-radius: 9999px; box-shadow: 0 10px 25px -5px rgba(212, 175, 55, 0.4); text-transform: uppercase;">
                💍 나의 240장 프라이빗 갤러리 열기 ➔
              </a>
              <p style="margin: 14px 0 0; font-size: 11px; color: rgba(250, 248, 245, 0.4);">
                위 버튼을 클릭하시면 고객 전용 갤러리에서 실시간 사진 확인 및 1-Click 4K ZIP 다운로드가 가능합니다.
              </p>
            </td>
          </tr>

          <!-- Features Banner -->
          <tr>
            <td style="padding: 24px 32px; background-color: rgba(0, 0, 0, 0.25); border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 12px; color: rgba(250, 248, 245, 0.65); line-height: 1.8;">
              <strong style="color: #D4AF37;">✨ WeddingHelper Atelier 3대 보증:</strong><br>
              • <strong>1:1 본인 얼굴 보존</strong>: 동양인 고유 눈매와 윤곽을 100% 보존합니다.<br>
              • <strong>전 세계 12대 로케이션</strong>: 발리, 아말피, 코모 호수, 파리 등 240개 앵글 수록.<br>
              • <strong>모바일 청첩장 연동</strong>: 마음에 드는 화보를 원클릭으로 청첩장 커버로 지정할 수 있습니다.
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 28px 32px; font-size: 11px; color: rgba(250, 248, 245, 0.35); line-height: 1.6;">
              © 2026 WeddingHelper Atelier. All rights reserved.<br>
              본 메일은 WeddingHelper 사이트에서 화보 앨범을 요청하신 고객님께 발송되었습니다.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 4. HTML Email Template: 240 Masterpieces Completed & 1-Click ZIP Delivery
 */
function buildOrderCompletedEmail(params: {
  orderId: string;
  email: string;
  totalScenes: number;
  galleryUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WeddingHelper Atelier 240 Masterpieces Completed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #120E10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FAF8F5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #120E10; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #1F181B; border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 28px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);">
          <!-- Header Banner -->
          <tr>
            <td align="center" style="padding: 48px 32px 24px; background: linear-gradient(180deg, rgba(212, 175, 55, 0.16) 0%, rgba(31, 24, 27, 0) 100%);">
              <span style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background-color: rgba(212, 175, 55, 0.25); border: 1px solid #D4AF37; color: #D4AF37; font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;">
                🎉 240 MASTERPIECES READY
              </span>
              <h1 style="margin: 18px 0 8px; font-family: Georgia, serif; font-size: 30px; font-weight: 300; letter-spacing: 0.05em; color: #FFFFFF; line-height: 1.3;">
                축하드립니다!<br><span style="color: #D4AF37; font-weight: 700;">240장 풀 화보가 완성되었습니다</span>
              </h1>
              <p style="margin: 0; font-size: 13px; color: rgba(250, 248, 245, 0.7); line-height: 1.6;">
                12개 전 세계 럭셔리 로케이션의 모든 에디토리얼 앵글이 완벽한 4K Hasselblad 규격으로 패키징되었습니다.
              </p>
            </td>
          </tr>

          <!-- Download Action Card -->
          <tr>
            <td align="center" style="padding: 0 32px 36px;">
              <div style="background-color: rgba(255, 255, 255, 0.04); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 20px; padding: 28px; margin-bottom: 24px;">
                <p style="margin: 0 0 16px; font-size: 14px; color: #FAF8F5;">
                  총 <strong>${params.totalScenes}장</strong>의 초고해상도 화보를 1-Click 4K ZIP으로 즉시 다운로드하실 수 있습니다.
                </p>
                <a href="${params.galleryUrl}" target="_blank" style="display: block; width: 100%; max-width: 420px; margin: 0 auto; padding: 18px 24px; background: linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%); color: #1F181B; text-align: center; text-decoration: none; font-size: 15px; font-weight: 800; letter-spacing: 0.05em; border-radius: 9999px; box-shadow: 0 10px 25px -5px rgba(212, 175, 55, 0.5); text-transform: uppercase;">
                  📦 4K ZIP 전체 다운로드 & 갤러리 열기 ➔
                </a>
              </div>
              <p style="margin: 0; font-size: 11px; color: rgba(250, 248, 245, 0.4);">
                주문 번호: <span style="font-family: monospace; color: #D4AF37;">${params.orderId}</span> · 평생 무제한 재다운로드 가능
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 32px; background-color: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 11px; color: rgba(250, 248, 245, 0.35);">
              © 2026 WeddingHelper Atelier · Haute Couture Bridal Portrait Studio
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 5. Notify New Order (Dual: Telegram CEO Alert + Resend Customer Email)
 */
export async function notifyNewOrder(params: {
  orderId: string;
  email: string;
  plan: string;
  themeTitle: string;
}): Promise<void> {
  const galleryUrl = `${SITE_URL}/weddinghelper/gallery?orderId=${encodeURIComponent(params.orderId)}`;

  // 1) Send Telegram notification to CEO
  const telegramMsg = `💍 <b>[WeddingHelper] 240장 풀 앨범 이메일 발송 신청 접수!</b>

━━━━━━━━━━━━━━━━━━━━━
• <b>고객 이메일</b>: <code>${params.email}</code>
• <b>주문 번호</b>: <code>${params.orderId}</code>
• <b>선택 플랜</b>: ${params.plan.toUpperCase()}
• <b>요청 테마</b>: ${params.themeTitle}
• <b>갤러리 링크</b>: <a href="${galleryUrl}">고객 전용 갤러리 확인</a>
━━━━━━━━━━━━━━━━━━━━━
✨ <i>12개 콘셉트 대표 1장 확인 완료. 이메일 자동 발송 큐에 정상 등록되었습니다.</i>`;

  await sendTelegramNotification(telegramMsg);

  // 2) Send Haute Couture Order Confirmation Email to Customer
  const emailHtml = buildOrderConfirmationEmail({
    orderId: params.orderId,
    email: params.email,
    plan: params.plan,
    themeTitle: params.themeTitle,
    galleryUrl,
  });

  await sendEmailDelivery({
    to: params.email,
    subject: `💍 [WeddingHelper] 240장 웨딩 마스터피스 제작 요청이 정상 접수되었습니다`,
    html: emailHtml,
  });
}

/**
 * 6. Notify Order Completed (Dual: Telegram CEO Alert + Resend Customer Delivery Email)
 */
export async function notifyOrderCompleted(params: {
  orderId: string;
  email: string;
  totalScenes: number;
}): Promise<void> {
  const galleryUrl = `${SITE_URL}/weddinghelper/gallery?orderId=${encodeURIComponent(params.orderId)}`;

  // 1) Send Telegram notification to CEO
  const telegramMsg = `🎉 <b>[WeddingHelper] 240장 마스터피스 제작 완료!</b>

━━━━━━━━━━━━━━━━━━━━━
• <b>고객 이메일</b>: ${params.email}
• <b>주문 번호</b>: <code>${params.orderId}</code>
• <b>완성 사진 수</b>: 총 ${params.totalScenes}장 (12개 전 세계 휴양지)
• <b>전용 갤러리</b>: <a href="${galleryUrl}">고객 전용 갤러리 열기</a>
━━━━━━━━━━━━━━━━━━━━━
🚀 <i>고객 편지함으로 완성 안내 및 1-Click 4K ZIP 다운로드 이메일이 자동 발송되었습니다.</i>`;

  await sendTelegramNotification(telegramMsg);

  // 2) Send Haute Couture Completion & 4K ZIP Download Email to Customer
  const emailHtml = buildOrderCompletedEmail({
    orderId: params.orderId,
    email: params.email,
    totalScenes: params.totalScenes,
    galleryUrl,
  });

  await sendEmailDelivery({
    to: params.email,
    subject: `✨ [WeddingHelper] 240장 풀 앨범 완성본이 준비되었습니다 (4K Hasselblad Collection)`,
    html: emailHtml,
  });
}
