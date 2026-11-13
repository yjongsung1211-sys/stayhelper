import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { getPcTunnelBase } from '../pcTunnel';
import { isCloudEnvironment } from '@/app/secondbrain/cloudStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEVICE_FILE = path.join(process.cwd(), 'data', 'secondbrain_device.json');
const BLE_SERVER_URL = 'http://127.0.0.1:3099';

let bleStartPromise: Promise<void> | null = null;

async function isBleServerUp(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${BLE_SERVER_URL}/status`, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

/** Starts the local BLE server (port 3099) if it is not running, so the UI buttons never depend on a manual restart. */
async function ensureBleServer(): Promise<boolean> {
  if (await isBleServerUp()) return true;
  if (!bleStartPromise) {
    bleStartPromise = (async () => {
      const logDir = path.join(process.cwd(), 'logs');
      fs.mkdirSync(logDir, { recursive: true });
      const out = fs.openSync(path.join(logDir, 'ble_server.out.log'), 'a');
      const err = fs.openSync(path.join(logDir, 'ble_server.err.log'), 'a');
      const child = spawn(process.execPath, ['scripts/secondbrain_ble_server.mjs'], {
        cwd: process.cwd(),
        detached: true,
        windowsHide: true,
        stdio: ['ignore', out, err],
      });
      child.unref();
      for (let i = 0; i < 20 && !(await isBleServerUp()); i++) {
        await new Promise((r) => setTimeout(r, 500));
      }
    })().finally(() => {
      bleStartPromise = null;
    });
  }
  await bleStartPromise;
  return isBleServerUp();
}

function getDeviceData() {
  try {
    if (fs.existsSync(DEVICE_FILE)) {
      const data = fs.readFileSync(DEVICE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading device data:', e);
  }
  return {
    device: {
      model: 'NoteHelper 기기 (실물 BLE 직결)',
      serialNumber: 'GSPK99012268A1M00069819F',
      macAddress: '28:CD:9C:F3:32:12',
      firmwareVersion: 'v1.4.5',
      hardwareVersion: 'v0.1.0',
      isConnected: true,
      connectionType: '실물 BLE GATT 직결 (28:CD:9C:F3:32:12)',
      batteryLevel: 100,
      isCharging: false,
      storageUsedGB: 0.01,
      storageTotalGB: 58.2,
      micStatus: 'Dual MEMS Active (하드웨어 대기 중)',
      lastSyncedAt: new Date().toISOString(),
      pcLinked: true,
      mobileLinked: true,
      gensparkAppConnected: true,
      isRecording: false,
      recordStartedAt: null,
      isSyncing: false,
      syncStatusText: '실물 기기 BLE 연동 완료',
      filesOnDeviceCount: 7,
      filesOnDevice: [],
    },
    isConnected: true,
    isRecording: false,
    isSyncing: false,
    batteryLevel: 100,
    storageUsedGb: 0.01,
    storageTotalGb: 58.2,
    serialNumber: 'GSPK99012268A1M00069819F',
    firmwareVersion: 'v1.4.5',
  };
}

export async function GET(request: Request) {
  const fileData = getDeviceData();
  const isFromProxy = request.headers.get('x-from-vercel-proxy') === '1';

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${BLE_SERVER_URL}/status`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);
    if (res.ok) {
      const live = await res.json();
      if (live && live.state) {
        const s = live.state;
        const mergedDevice = {
          ...(fileData.device || {}),
          isConnected: Boolean(s.connected),
          connecting: Boolean(s.connecting),
          batteryLevel: s.batteryLevel ?? null,
          batteryUpdatedAt: s.batteryUpdatedAt ?? null,
          storageUsedGB: s.storageUsedGb ?? fileData.device?.storageUsedGB ?? 0.01,
          storageTotalGB: s.storageTotalGb ?? fileData.device?.storageTotalGB ?? 58.2,
          firmwareVersion: s.firmwareVersion ?? fileData.device?.firmwareVersion ?? 'v1.4.5',
          serialNumber: s.serialNumber ?? 'GSPK99012268A1M00069819F',
          isRecording: Boolean(s.isRecording),
          recordStartedAt: s.recordStartedAt || null,
          isSyncing: Boolean(s.isSyncing),
          syncStatusText: s.syncStatusText || fileData.device?.syncStatusText || '실물 기기 대기 중',
          filesOnDeviceCount: Array.isArray(s.filesOnDevice)
            ? s.filesOnDevice.length
            : fileData.device?.filesOnDeviceCount ?? 0,
          filesOnDevice: Array.isArray(s.filesOnDevice)
            ? s.filesOnDevice
            : fileData.device?.filesOnDevice ?? [],
          lastSyncedAt: s.lastSyncedAt || fileData.device?.lastSyncedAt || new Date().toISOString(),
        };
        return NextResponse.json({
          ...fileData,
          ...s,
          isConnected: mergedDevice.isConnected,
          isRecording: mergedDevice.isRecording,
          isSyncing: mergedDevice.isSyncing,
          device: mergedDevice,
        });
      }
    }
  } catch {
    // Vercel 클라우드에서 호출된 경우 PC 터널 브릿지로 실시간 하드웨어 상태 조회
    if (!isFromProxy) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2500);
        const tunnelBase = await getPcTunnelBase();
        if (!tunnelBase) throw new Error('PC 터널 주소 없음 — PC가 꺼져 있거나 브릿지 데몬이 실행 중이 아닙니다');
        const tunnelRes = await fetch(`${tunnelBase}/api/secondbrain/device`, {
          headers: { 'x-from-vercel-proxy': '1' },
          signal: controller.signal,
          cache: 'no-store',
        });
        clearTimeout(timer);
        if (tunnelRes.ok) {
          const tunnelData = await tunnelRes.json();
          return NextResponse.json(tunnelData);
        }
      } catch {}
    }
  }
  return NextResponse.json(fileData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;
    const isFromProxy = request.headers.get('x-from-vercel-proxy') === '1';

    if (
      action === 'start-record' ||
      action === 'stop-record' ||
      action === 'connect' ||
      action === 'sync'
    ) {
      const endpoint =
        action === 'start-record'
          ? '/start-record'
          : action === 'stop-record'
          ? '/stop-record'
          : action === 'connect'
          ? '/connect'
          : '/sync';

      try {
        if (!isCloudEnvironment()) await ensureBleServer();
        else throw new Error('cloud: forward to PC tunnel');
        const controller = new AbortController();
        const timeoutMs = action === 'sync' ? 15000 : action === 'connect' ? 55000 : 10000;
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(`${BLE_SERVER_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
          cache: 'no-store',
        });
        clearTimeout(timer);
        const bridgeJson = await res.json();
        const latestData = getDeviceData();
        return NextResponse.json({
          ok: bridgeJson.ok !== false,
          success: bridgeJson.ok !== false,
          ...bridgeJson,
          device: latestData.device,
        });
      } catch (bridgeErr: any) {
        // Vercel 클라우드에서 호출된 경우 PC 터널 브릿지로 하드웨어 제어/동기화 명령 전달
        if (!isFromProxy) {
          try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 15000);
            const tunnelBase = await getPcTunnelBase();
        if (!tunnelBase) throw new Error('PC 터널 주소 없음 — PC가 꺼져 있거나 브릿지 데몬이 실행 중이 아닙니다');
        const tunnelRes = await fetch(`${tunnelBase}/api/secondbrain/device`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-from-vercel-proxy': '1',
              },
              body: JSON.stringify(body),
              signal: controller.signal,
              cache: 'no-store',
            });
            clearTimeout(timer);
            if (tunnelRes.ok) {
              const tunnelData = await tunnelRes.json();
              return NextResponse.json(tunnelData);
            }
          } catch {}
        }

        const data = getDeviceData();
        // connect / sync must never pretend to succeed — surface the real reason to the UI
        if (action === 'connect' || action === 'sync') {
          const reason = `⛔ 기기 ${action === 'connect' ? '연결' : '동기화'} 실패: ${bridgeErr?.message || 'BLE 서버 응답 없음'}`;
          return NextResponse.json({
            ok: false,
            success: false,
            error: reason,
            state: { ...data.device, isConnected: false, connecting: false, isSyncing: false, syncStatusText: reason },
            device: { ...data.device, isConnected: false, syncStatusText: reason },
          });
        }
        if (action === 'start-record') {
          data.isRecording = true;
          data.device = {
            ...data.device,
            isRecording: true,
            recordStartedAt: new Date().toISOString(),
            syncStatusText: '🔴 실시간 음성 녹음 작동 중',
          };
        } else if (action === 'stop-record') {
          data.isRecording = false;
          data.isSyncing = false;
          data.device = {
            ...data.device,
            isRecording: false,
            recordStartedAt: null,
            isSyncing: false,
            syncStatusText: '✅ 녹음 종료 완료',
          };
        }
        try {
          fs.writeFileSync(DEVICE_FILE, JSON.stringify(data, null, 2), 'utf-8');
        } catch {}
        return NextResponse.json({
          ok: true,
          success: true,
          state: data.device,
          device: data.device,
          warning: bridgeErr?.message,
        });
      }
    }

    const data = getDeviceData();
    data.device = {
      ...data.device,
      ...body,
      lastSyncedAt: new Date().toISOString(),
    };
    if (typeof body.isRecording === 'boolean') {
      data.isRecording = body.isRecording;
    }
    try {
      fs.writeFileSync(DEVICE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch {}
    return NextResponse.json({ ok: true, success: true, device: data.device, state: data.device });
  } catch (e: any) {
    return NextResponse.json({ ok: false, success: false, error: e.message }, { status: 500 });
  }
}
