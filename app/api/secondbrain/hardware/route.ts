import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';

const BLE_SERVER_URL = 'http://127.0.0.1:3099';
const DEVICE_JSON_PATH = path.join(process.cwd(), 'data', 'secondbrain_device.json');

async function callBleServer(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: Record<string, unknown>) {
  try {
    const res = await fetch(`${BLE_SERVER_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
    return await res.json();
  } catch {
    // Auto-start BLE server if not running
    try {
      const child = spawn('node', ['scripts/secondbrain_ble_server.mjs'], {
        cwd: process.cwd(),
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
      await new Promise((r) => setTimeout(r, 2500));
      const retry = await fetch(`${BLE_SERVER_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store',
      });
      return await retry.json();
    } catch (err) {
      let fallbackState = {};
      if (fs.existsSync(DEVICE_JSON_PATH)) {
        try {
          fallbackState = JSON.parse(fs.readFileSync(DEVICE_JSON_PATH, 'utf8'));
        } catch {}
      }
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'BLE Server unreachable',
        state: fallbackState,
      };
    }
  }
}

export async function GET() {
  const data = await callBleServer('/status', 'GET');
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'status';

    if (action === 'connect') {
      const data = await callBleServer('/connect', 'POST');
      return NextResponse.json(data);
    }
    if (action === 'start-record') {
      const data = await callBleServer('/start-record', 'POST');
      return NextResponse.json(data);
    }
    if (action === 'stop-record') {
      const data = await callBleServer('/stop-record', 'POST', {
        liveTranscript: typeof body.liveTranscript === 'string' ? body.liveTranscript : '',
      });
      return NextResponse.json(data);
    }
    if (action === 'sync') {
      const data = await callBleServer('/sync', 'POST', { force: Boolean(body.force) });
      return NextResponse.json(data);
    }

    const data = await callBleServer('/status', 'GET');
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Hardware API error' },
      { status: 500 }
    );
  }
}
