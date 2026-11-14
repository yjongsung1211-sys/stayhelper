/**
 * =========================================================================
 * WEDDINGHELPER AUTOMATED DELIVERY & TELEGRAM ALERT ENGINE
 * =========================================================================
 */

const BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN ?? '');
const CHAT_ID = "8971100274";

export async function sendTelegramNotification(text: string): Promise<boolean> {
  try {
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

export async function notifyNewOrder(params: {
  orderId: string;
  email: string;
  plan: string;
  themeTitle: string;
}): Promise<void> {
  const msg = `💍 <b>[WeddingHelper] 240장 풀 앨범 이메일 발송 신청 접수!</b>

━━━━━━━━━━━━━━━━━━━━━
• <b>고객 이메일</b>: <code>${params.email}</code>
• <b>주문 번호</b>: <code>${params.orderId}</code>
• <b>선택 플랜</b>: ${params.plan.toUpperCase()} (12콘셉트 대표 확인 후 240장 앨범 신청)
• <b>요청 테마</b>: ${params.themeTitle}
• <b>갤러리 링크</b>: <a href="https://www.weddinghelper.love/weddinghelper/gallery?orderId=${params.orderId}">고객 전용 갤러리 확인</a>
━━━━━━━━━━━━━━━━━━━━━
✨ <i>12개 콘셉트 대표 1장 확인 완료. 나머지 228장 비동기 렌더링 및 이메일 발송 큐에 정상 등록되었습니다.</i>`;

  await sendTelegramNotification(msg);
}

export async function notifyOrderCompleted(params: {
  orderId: string;
  email: string;
  totalScenes: number;
}): Promise<void> {
  const msg = `🎉 <b>[WeddingHelper] 240장 마스터피스 제작 완료!</b>

━━━━━━━━━━━━━━━━━━━━━
• <b>고객 이메일</b>: ${params.email}
• <b>주문 번호</b>: <code>${params.orderId}</code>
• <b>완성 사진 수</b>: 총 ${params.totalScenes}장 (12개 전 세계 휴양지)
• <b>전용 갤러리</b>: <a href="https://www.weddinghelper.love/gallery?orderId=${params.orderId}">고객 전용 갤러리 열기</a>
━━━━━━━━━━━━━━━━━━━━━
🚀 <i>고객 전용 갤러리에서 1-Click 4K ZIP 다운로드가 활성화되었습니다.</i>`;

  await sendTelegramNotification(msg);
}
