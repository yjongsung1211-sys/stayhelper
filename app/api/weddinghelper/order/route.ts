import { NextRequest, NextResponse } from 'next/server';
import { createWeddingOrder, getWeddingOrder, findOrderByEmail } from '@/lib/wedding-order-store';
import { notifyNewOrder, notifyOrderCompleted } from '@/lib/wedding-delivery';

export const dynamic = 'force-dynamic';

// GET /api/weddinghelper/order?orderId=... or ?email=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');

    if (orderId) {
      const order = getWeddingOrder(orderId);
      if (order) {
        return NextResponse.json({ success: true, order });
      }
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (email) {
      const order = findOrderByEmail(email);
      if (order) {
        return NextResponse.json({ success: true, order });
      }
      return NextResponse.json({ success: false, error: 'No order found for email' }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: 'orderId or email required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/weddinghelper/order (Create new order upon payment)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, plan = 'grand', selectedTheme = 'theme_01_bali', proportions, clientImages, sendCompletionEmail = true } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email required' }, { status: 400 });
    }

    const order = createWeddingOrder({
      email,
      plan,
      selectedTheme,
      proportions,
      clientImages,
    });

    // 1) Send Telegram notification & order acknowledgment to CEO in background
    notifyNewOrder({
      orderId: order.orderId,
      email: order.email,
      plan: order.plan,
      themeTitle: order.selectedTheme,
    }).catch((e) => console.warn('Telegram notify error:', e));

    // 2) Immediately deliver full 240 album access & 4K ZIP link to customer email
    if (sendCompletionEmail) {
      notifyOrderCompleted({
        orderId: order.orderId,
        email: order.email,
        totalScenes: 240,
      }).catch((e) => console.warn('Order completed notify error:', e));
    }

    return NextResponse.json({ success: true, orderId: order.orderId, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
