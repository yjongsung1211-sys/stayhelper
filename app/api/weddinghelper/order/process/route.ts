import { NextRequest, NextResponse } from 'next/server';
import { getWeddingOrder, updateWeddingOrder } from '@/lib/wedding-order-store';
import { notifyOrderCompleted } from '@/lib/wedding-delivery';

export const dynamic = 'force-dynamic';

// POST /api/weddinghelper/order/process
// Update order progress or save synthesized scenes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, sceneId, sceneImageUrl, isFinished = false } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required' }, { status: 400 });
    }

    const order = getWeddingOrder(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const completedScenes = { ...order.completedScenes };
    if (sceneId && sceneImageUrl) {
      completedScenes[sceneId] = sceneImageUrl;
    }

    const completedCount = Object.keys(completedScenes).length;
    const newStatus = isFinished || completedCount >= 240 ? 'completed' : 'processing';

    const updated = updateWeddingOrder(orderId, {
      completedScenes,
      currentStep: completedCount,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
    });

    if (newStatus === 'completed' && order.status !== 'completed') {
      notifyOrderCompleted({
        orderId,
        email: order.email,
        totalScenes: completedCount,
      }).catch((e) => console.warn('Order completed notify error:', e));
    }

    return NextResponse.json({
      success: true,
      orderId,
      currentStep: completedCount,
      totalSteps: 240,
      status: newStatus,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
