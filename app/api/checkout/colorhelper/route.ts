import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      orderId,
      payerEmail,
      amount = 1000,
      currency = "KRW",
      ticketType = "single", // "single" (1회 1,000원) | "triple" (3회 2,500원)
      paymentMethod = "paypal",
    } = body;

    const tickets = ticketType === "triple" ? 3 : 1;

    console.log("[ColorHelper Payment Completed]", {
      orderId: orderId || `COLOR_${Date.now()}`,
      payerEmail: payerEmail || "customer@paypal.com",
      amount,
      currency,
      tickets,
      paymentMethod,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderId: orderId || `COLOR_${Date.now()}`,
      amount,
      currency,
      ticketsAdded: tickets,
      activatedAt: new Date().toISOString(),
      message: "1회 정밀 진단 리포트가 성공적으로 해금되었습니다.",
    });
  } catch (error: any) {
    console.error("[ColorHelper Payment Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Payment processing failed" },
      { status: 500 }
    );
  }
}
