import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, details, plan = 'monthly' } = body;

    const amount = plan === 'annual' ? 149 : 19;

    console.log('[StylingHelper PayPal Order Completed]', {
      orderId: orderId || 'PAYPAL_ORDER_' + Date.now(),
      payer: details?.payer?.email_address || 'customer@paypal.com',
      amount,
      plan,
      service: 'StylingHelper Pro',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderId: orderId || 'PAYPAL_ORDER_' + Date.now(),
      amount,
      plan: `StylingHelper Pro ($${amount}/${plan === 'annual' ? 'year' : 'month'})`,
      activatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('PayPal record error:', error);
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}
