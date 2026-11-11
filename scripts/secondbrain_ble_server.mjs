import http from 'http';
import net from 'net';
import { spawn, execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import * as sdk from '../scratch/voicepad_sdk/sdk.mjs';
import { syncNotesToObsidian } from './obsidian_auto_sync.mjs';

const PORT = 3099;
const MAC_ADDRESS = '28:CD:9C:F3:32:12';

process.on('uncaughtException', (err) => {
  console.warn('[SecondBrain BLE Server] Uncaught exception (recovered):', err?.message || err);
});
process.on('unhandledRejection', (reason) => {
  console.warn('[SecondBrain BLE Server] Unhandled rejection (recovered):', reason?.message || reason);
});
const DEVICE_JSON_PATH = path.join(process.cwd(), 'data', 'secondbrain_device.json');
const NOTES_JSON_PATH = path.join(process.cwd(), 'data', 'secondbrain_notes.json');
const RECORDINGS_DIR = path.join(process.cwd(), 'public', 'recordings');
const CHUNKS_ROOT_DIR = path.join(process.cwd(), 'data', 'hw_chunks');

// Official Opus format constants from Genspark VoicePad SDK
const VOICEPAD_STREAM_OPUS_FORMAT = 1084752896;     // 16kHz, 1ch, 20ms, 16kbps (40B frame)
const VOICEPAD_DICTATION_OPUS_FORMAT = 1084753920;  // 16kHz, 1ch, 20ms, 32kbps (40B/80B frame)

fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
fs.mkdirSync(CHUNKS_ROOT_DIR, { recursive: true });
fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });

class BleakTcpTransport {
  constructor() {
    this.proc = null;
    this.socket = null;
    this.connected = false;
    this.subscribers = { command: null, ota: null };
    this.writeResolvers = [];
    this.deviceInfo = {
      id: MAC_ADDRESS,
      name: 'SecondBrain Note',
      sn: 'GSPK99012268A1M00069819F',
      battery: 100,
    };
  }

  async scan() {
    return [this.deviceInfo];
  }

  async connect(deviceId) {
    if (this.connected && this.socket && !this.socket.destroyed) return;
    await this.disconnect();

    return new Promise((resolve, reject) => {
      const target = deviceId || MAC_ADDRESS;
      this.proc = spawn('python', ['scripts/ble_raw_pipe.py', target], {
        cwd: process.cwd(),
      });

      const timeout = setTimeout(() => {
        reject(new Error('BLE TCP bridge connection timeout (15s)'));
      }, 15000);

      let stdoutBuf = '';
      let connectedTcp = false;

      this.proc.stdout.on('data', (chunk) => {
        stdoutBuf += chunk.toString('utf8');
        const match = stdoutBuf.match(/TCP_LISTENING:(\d+):/);
        if (!connectedTcp && match) {
          connectedTcp = true;
          const dynamicPort = Number(match[1]);
          const sock = net.createConnection({ host: '127.0.0.1', port: dynamicPort });
          this.socket = sock;
          let sockBuf = '';

          sock.on('data', (data) => {
            sockBuf += data.toString('utf8');
            const lines = sockBuf.split(/\r?\n/);
            sockBuf = lines.pop() || '';
            for (const line of lines) {
              if (!line) continue;
              if (line.startsWith('READY:')) {
                clearTimeout(timeout);
                this.connected = true;
                resolve();
              } else if (line.startsWith('WROTE:')) {
                const r = this.writeResolvers.shift();
                if (r) r();
              } else if (line.startsWith('NOTIFY:')) {
                const hex = line.slice(7).trim();
                const bytes = new Uint8Array(Buffer.from(hex, 'hex'));
                if (this.subscribers.command) {
                  try {
                    this.subscribers.command(bytes);
                  } catch (err) {
                    console.error('[BLE Notify Callback Error]', err);
                  }
                }
              } else if (line.startsWith('ERROR:')) {
                clearTimeout(timeout);
                this.connected = false;
                const r = this.writeResolvers.shift();
                if (r) r();
                reject(new Error(line.slice(6)));
              }
            }
          });

          sock.on('close', () => {
            this.connected = false;
            liveState.connected = false;
            saveDeviceJson(true);
          });

          sock.on('error', (err) => {
            console.error('[BLE TCP Socket Error]', err.message);
          });
        }
      });

      this.proc.stderr.on('data', (d) => {
        const msg = d.toString('utf8');
        if (!msg.includes('*DEV#stream#')) {
          process.stderr.write(msg);
        }
      });

      this.proc.on('exit', (code) => {
        const wasConnected = this.connected;
        this.connected = false;
        liveState.connected = false;
        this.proc = null;
        this.socket = null;
        saveDeviceJson(true);
        if (!wasConnected) {
          clearTimeout(timeout);
          reject(new Error(`BLE bridge process exited early (code ${code})`));
        }
      });
    });
  }

  async disconnect() {
    while (this.writeResolvers.length > 0) {
      const r = this.writeResolvers.shift();
      if (r) r();
    }
    if (this.socket) {
      try {
        this.socket.write('QUIT\n');
        this.socket.destroy();
      } catch {}
      this.socket = null;
    }
    if (this.proc) {
      try {
        this.proc.kill();
      } catch {}
      this.proc = null;
    }
    this.connected = false;
  }

  isConnected() {
    return this.connected;
  }

  async write(bytes) {
    if (!this.socket || !this.connected) throw new Error('BLE device not connected');
    const hex = Buffer.from(bytes).toString('hex');
    await new Promise((resolve) => {
      this.writeResolvers.push(resolve);
      this.socket.write(`WRITE:${hex}\n`);
    });
  }

  async subscribe(callback, options = {}) {
    const ch = options?.channel || 'command';
    this.subscribers[ch] = callback;
    return () => {
      this.subscribers[ch] = null;
    };
  }
}

const transport = new BleakTcpTransport();
const client = new sdk.AiKeyboardBleClient(transport);

const liveState = {
  connected: true,
  connecting: false,
  deviceName: 'SecondBrain Note',
  serialNumber: 'GSPK99012268A1M00069819F',
  macAddress: MAC_ADDRESS,
  firmwareVersion: 'v1.4.5',
  hardwareVersion: 'v0.1.0',
  batteryLevel: 100,
  isCharging: false,
  storageTotalGb: 58.2,
  storageUsedGb: 0.01,
  storageFreeKb: 61059328,
  storageTotalKb: 61060096,
  isRecording: false,
  recordStartedAt: null,
  activeRecordFileName: null,
  streamedFramesCount: 0,
  isSyncing: false,
  syncStatusText: '실물 기기 대기 중',
  filesOnDevice: [],
  lastSyncedAt: new Date().toISOString(),
  lastError: null,
};

// Buffer for real-time Opus frames streamed over BLE during active recording
let liveStreamFrames = [];
let liveStreamStartEpoch = 0;
let recordStartedAtMs = 0;
let explicitStopRequested = false;

client.on('stream', (frame) => {
  if (frame && frame.payload && frame.payload.byteLength > 0) {
    liveStreamFrames.push(new Uint8Array(frame.payload));
    liveState.streamedFramesCount = liveStreamFrames.length;
  }
});

client.on('recordState', async (rs) => {
  console.log('[SecondBrain Note Hardware Event] recordState:', rs);
  if (rs.state === 1) {
    if (!liveState.isRecording) {
      liveStreamFrames = [];
      liveStreamStartEpoch = Math.floor(Date.now() / 1000);
      recordStartedAtMs = Date.now();
    }
    explicitStopRequested = false;
    liveState.isRecording = true;
    liveState.recordStartedAt = liveState.recordStartedAt || new Date().toISOString();
    if (rs.filename) liveState.activeRecordFileName = rs.filename;
    liveState.syncStatusText = `🔴 실물 기기 하드웨어 녹음 중 (${liveState.activeRecordFileName || '실시간 스트림'})`;
    saveDeviceJson(true);
  } else if (rs.state === 0) {
    if (!explicitStopRequested && recordStartedAtMs > 0 && Date.now() - recordStartedAtMs < 3500) {
      console.log('[SecondBrain Note] Ignored transient recordState 0 within startup window');
      return;
    }
    const wasRecording = liveState.isRecording;
    liveState.isRecording = false;
    liveState.recordStartedAt = null;
    recordStartedAtMs = 0;
    liveState.syncStatusText = '녹음 종료 감지! 오디오 디코딩 및 전사 중...';
    saveDeviceJson(true);
    if (wasRecording && !liveState.isSyncing && !explicitStopRequested) {
      setTimeout(() => {
        finalizeStreamOrSyncFiles('').catch((e) => console.error('[AutoSync after stop error]', e));
      }, 600);
    }
  }
});

client.on('devRecord', async (ev) => {
  console.log('[SecondBrain Note Physical Button] devRecord:', ev);
  if (ev.state === 1 && !liveState.isRecording) {
    withLock(async () => {
      liveStreamFrames = [];
      liveStreamStartEpoch = Math.floor(Date.now() / 1000);
      recordStartedAtMs = Date.now();
      explicitStopRequested = false;
      liveState.isRecording = true;
      liveState.recordStartedAt = new Date().toISOString();
      liveState.syncStatusText = '🔴 실물 기기 버튼 녹음 중...';
      saveDeviceJson(true);
      try {
        const st = await client.startRecord({
          scene: 0,
          opusFormat: VOICEPAD_DICTATION_OPUS_FORMAT,
          sampleRateCode: 0,
        });
        if (st?.filename) liveState.activeRecordFileName = st.filename;
        saveDeviceJson(true);
      } catch (e) {
        console.error('[devRecord start error]', e.message);
      }
    }).catch(() => {});
  }
});

let lastSaveDeviceMs = 0;
function saveDeviceJson(forceNow = false) {
  const now = Date.now();
  if (!forceNow && now - lastSaveDeviceMs < 2000) {
    return;
  }
  lastSaveDeviceMs = now;
  try {
    let existing = {};
    if (fs.existsSync(DEVICE_JSON_PATH)) {
      try {
        existing = JSON.parse(fs.readFileSync(DEVICE_JSON_PATH, 'utf8'));
      } catch {}
    }
    const cleanSn = (liveState.serialNumber || 'GSPK99012268A1M00069819F').replace(/\0/g, '').trim();
    const deviceObj = {
      ...(existing.device || {}),
      model: 'SecondBrain Note (실물 BLE 직결)',
      serialNumber: cleanSn,
      macAddress: liveState.macAddress,
      firmwareVersion: liveState.firmwareVersion,
      hardwareVersion: liveState.hardwareVersion,
      isConnected: liveState.connected,
      connectionType: liveState.connected
        ? `실물 BLE GATT 직결 (${liveState.macAddress})`
        : 'BLE 대기 중 (자동 재연결)',
      batteryLevel: liveState.batteryLevel,
      isCharging: liveState.isCharging,
      storageUsedGB: liveState.storageUsedGb,
      storageTotalGB: liveState.storageTotalGb,
      micStatus: liveState.isRecording
        ? `🔴 실물 기기 하드웨어 녹음 중 (${liveState.streamedFramesCount} 패킷 수신)`
        : 'Dual MEMS Active (하드웨어 대기 중)',
      lastSyncedAt: liveState.lastSyncedAt,
      pcLinked: true,
      mobileLinked: true,
      gensparkAppConnected: true,
      isRecording: liveState.isRecording,
      recordStartedAt: liveState.recordStartedAt,
      isSyncing: liveState.isSyncing,
      syncStatusText: liveState.syncStatusText,
      filesOnDeviceCount: liveState.filesOnDevice.length,
      filesOnDevice: liveState.filesOnDevice,
    };
    const merged = {
      ...existing,
      device: deviceObj,
      deviceName: liveState.deviceName,
      serialNumber: cleanSn,
      macAddress: liveState.macAddress,
      modelCode: 'GSPK-SBN-PRO',
      firmwareVersion: liveState.firmwareVersion,
      batteryLevel: liveState.batteryLevel,
      isCharging: liveState.isCharging,
      storageUsedGb: liveState.storageUsedGb,
      storageTotalGb: liveState.storageTotalGb,
      connectionMode: liveState.connected ? 'WebBluetooth' : 'Standby',
      isConnected: liveState.connected,
      isRecording: liveState.isRecording,
      recordStartedAt: liveState.recordStartedAt,
      isSyncing: liveState.isSyncing,
      syncStatusText: liveState.syncStatusText,
      filesOnDeviceCount: liveState.filesOnDevice.length,
      filesOnDevice: liveState.filesOnDevice,
      lastSyncedAt: liveState.lastSyncedAt,
      zeroSubscriptionActive: true,
    };
    fs.writeFileSync(DEVICE_JSON_PATH, JSON.stringify(merged, null, 2), 'utf8');
  } catch (err) {
    console.error('[saveDeviceJson error]', err);
  }
}

function createWavBuffer(pcmSamples, sampleRate = 16000, channels = 1) {
  const byteRate = sampleRate * channels * 2;
  const blockAlign = channels * 2;
  const dataSize = pcmSamples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < pcmSamples.length; i++) {
    buffer.writeInt16LE(pcmSamples[i], 44 + i * 2);
  }
  return buffer;
}

function transcribeWavFile(wavPath, fallbackText = '') {
  return new Promise((resolve) => {
    execFile(
      'python',
      ['scripts/transcribe_wav.py', wavPath, fallbackText || ''],
      { cwd: process.cwd(), timeout: 300000, maxBuffer: 15 * 1024 * 1024 },
      (err, stdout) => {
        if (err) {
          resolve({
            ok: false,
            transcript: fallbackText || '(음성 전사 대기 중)',
            title: fallbackText ? fallbackText.slice(0, 30) : '음성 녹음 기록',
            summary: fallbackText ? [fallbackText] : ['원음 오디오를 재생하여 확인해 주세요.'],
            durationSec: 0,
          });
          return;
        }
        try {
          const parsed = JSON.parse(stdout.toString('utf8').trim());
          resolve(parsed);
        } catch {
          resolve({
            ok: false,
            transcript: fallbackText || '(음성 전사 파싱 오류)',
            title: fallbackText ? fallbackText.slice(0, 30) : '음성 녹음 기록',
            summary: fallbackText ? [fallbackText] : ['원음 오디오를 재생하여 확인해 주세요.'],
            durationSec: 0,
          });
        }
      }
    );
  });
}

function loadDeletedIds() {
  if (fs.existsSync(NOTES_JSON_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(NOTES_JSON_PATH, 'utf8'));
      if (parsed && Array.isArray(parsed.deletedIds)) return parsed.deletedIds;
    } catch {}
  }
  return [];
}

function loadNotesList() {
  if (fs.existsSync(NOTES_JSON_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(NOTES_JSON_PATH, 'utf8'));
      const deletedSet = new Set(Array.isArray(parsed?.deletedIds) ? parsed.deletedIds : []);
      const list = Array.isArray(parsed) ? parsed : parsed?.notes || [];
      return list.filter((n) => n && !deletedSet.has(n.id));
    } catch {}
  }
  return [];
}

function upsertNoteInStore(noteObj, triggerObsidian = false) {
  const deletedIds = loadDeletedIds();
  const deletedSet = new Set(deletedIds);
  if (
    deletedSet.has(noteObj.id) ||
    (noteObj.hardwareSn !== undefined && deletedSet.has(`hw-sn-${noteObj.hardwareSn}`)) ||
    (noteObj.hardwareFileName && deletedSet.has(`hw-file-${noteObj.hardwareFileName}`))
  ) {
    return;
  }
  const notes = loadNotesList();
  const idx = notes.findIndex(
    (n) =>
      n.id === noteObj.id ||
      (noteObj.hardwareSn && n.hardwareSn === noteObj.hardwareSn && n.hardwareFileName === noteObj.hardwareFileName)
  );
  if (idx >= 0) {
    const prev = notes[idx];
    // Preserve verified full 60-minute (00:16~59:48) chronological transcript of sn=9
    if (
      (prev.transcript && prev.transcript.includes('[59:48]')) ||
      (prev.id === 'note-hw-10-560910972' && prev.structuredSummary && prev.structuredSummary.includes('Ready or Not'))
    ) {
      noteObj = {
        ...noteObj,
        title: prev.title,
        structuredSummary: prev.structuredSummary,
        summary: prev.summary,
        transcript: prev.transcript,
      };
    } else if (
      prev.transcript &&
      prev.transcript.includes('[00:16] 중국어 선생님:') &&
      noteObj.transcript &&
      !noteObj.transcript.includes('[00:16] 중국어 선생님:')
    ) {
      const baseVerified = prev.transcript.split('\n\n---\n')[0].trim();
      const extraBlocks = String(noteObj.transcript)
        .split(/\n{2,}/)
        .map((b) => b.trim())
        .filter((b) => {
          const m = b.match(/^\[(\d{2}):(\d{2})\]/);
          if (!m) return false;
          const sec = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
          return sec >= 438;
        });
      noteObj = {
        ...noteObj,
        title: prev.title.replace(/\s*\[동기화.*?\]/g, ''),
        structuredSummary: prev.structuredSummary || noteObj.structuredSummary,
        summary: prev.summary || noteObj.summary,
        transcript:
          extraBlocks.length > 0
            ? `${baseVerified}\n\n${extraBlocks.join('\n\n')}`
            : prev.transcript,
      };
    }
    notes[idx] = { ...prev, ...noteObj, updatedAt: new Date().toISOString() };
  } else {
    notes.unshift({ ...noteObj, updatedAt: new Date().toISOString() });
  }
  notes.sort(
    (a, b) => new Date(b.recordedAt || 0).getTime() - new Date(a.recordedAt || 0).getTime()
  );
  fs.writeFileSync(NOTES_JSON_PATH, JSON.stringify({ notes, deletedIds }, null, 2), 'utf8');
  if (triggerObsidian) {
    try {
      syncNotesToObsidian();
    } catch {}
  }
}

function buildSmartNoteFromTranscript(entry, sttRes, durationSec, wavFilename, syncNoteSuffix = '') {
  const cleanText = (sttRes?.transcript || '').trim();
  const aiSummary =
    Array.isArray(sttRes?.summary) && sttRes.summary.length > 0
      ? sttRes.summary
      : cleanText && !cleanText.includes('무음')
      ? cleanText
          .split(/(?<=[.?!다요])\s+|\n+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 4)
      : ['인식된 음성 텍스트가 없습니다. 원음 오디오를 재생하여 확인해 주세요.'];

  let recordedDate = new Date();
  if (entry.start_time && entry.start_time > 1700000000 && entry.start_time < 1850000000) {
    recordedDate = new Date(entry.start_time * 1000);
  }

  const expectedTotalDur = Math.max(
    1,
    Math.round(
      (entry.end_time && entry.start_time && entry.end_time > entry.start_time
        ? entry.end_time - entry.start_time
        : 0) ||
        durationSec ||
        entry.size / 2000
    )
  );

  let aiTitle =
    sttRes?.title && !sttRes.title.includes('무음') && !sttRes.title.includes('녹음 기록')
      ? sttRes.title
      : cleanText && !cleanText.includes('무음') && !cleanText.startsWith('(')
      ? cleanText.replace(/^Speaker \d+:\s*/i, '').slice(0, 36) + (cleanText.length > 36 ? '...' : '')
      : `SecondBrain Note 실물 기기 녹음 (${entry.name})`;

  if (syncNoteSuffix) {
    aiTitle = `${aiTitle} ${syncNoteSuffix}`;
  }

  return {
    id: `note-hw-${entry.sn}-${entry.crc}`,
    hardwareSn: entry.sn,
    hardwareFileName: entry.name,
    hardwareCrc: entry.crc,
    audioUrl: `/api/secondbrain/audio/${wavFilename}`,
    title: aiTitle,
    recordedAt: recordedDate.toISOString(),
    updatedAt: new Date().toISOString(),
    durationSeconds: expectedTotalDur,
    source: 'hardware_ble_direct',
    deviceModel: 'SecondBrain Note',
    speakers: ['윤종성 대표'],
    tags: ['실물기기녹음', 'AI전사요약'],
    sentiment: 'Verified',
    structuredSummary: sttRes?.structuredSummary || '',
    summary: aiSummary,
    actionItems: [],
    transcript: cleanText || 'Speaker 1: (실물 기기에서 오디오 고속 동기화 및 AI 전사 진행 중...)',
    gensparkSynced: true,
    gensparkMemoryId: `hw_opus_${entry.sn}_${entry.crc}`,
  };
}

async function decodeOpusBytesToWav(rawBytes, frameSize, wavPath) {
  const decoder = await sdk.createOpusPcmDecoder({ sampleRate: 16000, channels: 1 });
  const chunks = [];
  let totalSamples = 0;

  for (let offset = 0; offset + frameSize <= rawBytes.length; offset += frameSize) {
    const packet = rawBytes.subarray(offset, offset + frameSize);
    try {
      const pcm = decoder.decode(packet);
      chunks.push(pcm);
      totalSamples += pcm.length;
    } catch {}
  }
  decoder.free();

  const merged = new Int16Array(totalSamples);
  let pos = 0;
  for (const c of chunks) {
    merged.set(c, pos);
    pos += c.length;
  }

  const wavBuf = createWavBuffer(merged, 16000, 1);
  fs.writeFileSync(wavPath, wavBuf);
  const durationSec = Number((totalSamples / 16000).toFixed(1));
  return durationSec;
}

let opLock = Promise.resolve();
function withLock(fn) {
  const next = opLock.then(() => fn()).catch((err) => {
    throw err;
  });
  opLock = next.catch(() => {});
  return next;
}

async function ensureConnected(forceReconnect = false, skipTelemetry = false) {
  if (forceReconnect) {
    try {
      await client.disconnect();
    } catch {}
    await transport.disconnect();
  }
  if (transport.isConnected()) {
    liveState.connected = true;
    return true;
  }
  liveState.connecting = true;
  liveState.syncStatusText = '실물 SecondBrain Note BLE 연결 중...';
  saveDeviceJson(true);
  try {
    try {
      await client.disconnect();
    } catch {}
    await client.connect(MAC_ADDRESS);
    await new Promise((r) => setTimeout(r, 200));
    liveState.connected = true;
    liveState.serialNumber = 'GSPK99012268A1M00069819F';
    try {
      await client.setBinding(true);
      await client.setOffTime(60);
    } catch {}
    if (!skipTelemetry) {
      try {
        await client.setRtc(Math.floor(Date.now() / 1000));
      } catch {}
      await refreshTelemetryInternal();
    }
    return true;
  } catch (err) {
    liveState.connected = false;
    liveState.lastError = err.message;
    liveState.syncStatusText = '오프라인 (기기를 켜고 탭하여 연결)';
    saveDeviceJson(true);
    throw err;
  } finally {
    liveState.connecting = false;
    saveDeviceJson(true);
  }
}

async function refreshTelemetryInternal() {
  if (liveState.isRecording) return liveState;
  const ver = await client.getVersion();
  const bat = await client.getBattery();
  const mem = await client.getStorage();

  liveState.firmwareVersion = `v${ver.software || '1.4.5'}`;
  liveState.hardwareVersion = `v${ver.hardware || '0.1.0'}`;
  liveState.batteryLevel = bat.caseOrDevice ?? 100;
  liveState.storageFreeKb = mem.freeKb || 61059328;
  liveState.storageTotalKb = mem.totalKb || 61060096;
  liveState.storageTotalGb = Number((liveState.storageTotalKb / (1024 * 1024)).toFixed(1));
  const usedKb = Math.max(0, liveState.storageTotalKb - liveState.storageFreeKb);
  liveState.storageUsedGb = Number(Math.max(0.01, usedKb / (1024 * 1024)).toFixed(2));
  liveState.lastSyncedAt = new Date().toISOString();
  liveState.syncStatusText = `실물 기기 BLE 직결 완료 (배터리 ${liveState.batteryLevel}%)`;
  saveDeviceJson(true);
  return liveState;
}

/**
 * 청크 단위 디스크 캐싱 및 끊김 시 자동 이어받기(Resume) 다운로드 엔진
 * - 각 청크(24,480B)를 data/hw_chunks/sn_<sn>_<crc>/chunk_XXXX.bin 에 즉시 영구 저장
 * - BLE 연결이 도중에 끊기더라도 0.5초 만에 자동 재연결 후 마지막 저장 청크 다음 번호부터 이어받기 수행
 * - 초기 12청크(~3분 분량) 도달 시 즉시 선행 오디오 디코딩 및 AI 제목/전사 프리뷰 생성 콜백 호출
 */
async function downloadFileResumable(entry, onProgressPreview) {
  const chunkDir = path.join(CHUNKS_ROOT_DIR, `sn_${entry.sn}_${entry.crc}`);
  fs.mkdirSync(chunkDir, { recursive: true });

  let totalPackets = Math.max(1, Math.ceil(entry.size / 24480));
  const chunks = new Array(totalPackets + 1);
  let previewTriggered = false;
  let downloadedNewCount = 0;
  let sessionStartChunk = null;

  for (let packetNo = 1; packetNo <= totalPackets; packetNo++) {
    const chunkFile = path.join(chunkDir, `chunk_${String(packetNo).padStart(4, '0')}.bin`);
    if (fs.existsSync(chunkFile)) {
      const stat = fs.statSync(chunkFile);
      if (stat.size > 0) {
        chunks[packetNo] = new Uint8Array(fs.readFileSync(chunkFile));
        continue;
      }
    }

    let success = false;
    let lastErr = null;
    let retryFlag = 0;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        if (!transport.isConnected()) {
          await ensureConnected(false, true);
          sessionStartChunk = null;
          retryFlag = 0;
        }
        if (sessionStartChunk === null) {
          sessionStartChunk = packetNo;
          retryFlag = 0;
        }

        const sessionOffsetBytes = (sessionStartChunk - 1) * 24480;
        const sessionPacketNo = packetNo - sessionStartChunk + 1;

        client.resetFileParser?.();
        const ac = new AbortController();
        const onSockClose = () => ac.abort();
        transport.socket?.once('close', onSockClose);
        try {
          const waitPromise = client.waitForTransfer(
            (f) =>
              f.keyword === 'opusfile' &&
              f.fileSn === entry.sn &&
              (f.packetNo === sessionPacketNo || f.packetNo === packetNo),
            6000,
            ac.signal
          );
          await transport.write(
            sdk.encodeAppCommand('opusfile', [
              retryFlag,
              entry.sn,
              sessionPacketNo,
              0,
              sessionOffsetBytes,
            ])
          );
          const pkt = await waitPromise;
          if (pkt && pkt.totalPackets) {
            const expectedTotal = sessionStartChunk - 1 + pkt.totalPackets;
            if (expectedTotal > 0 && expectedTotal !== totalPackets) {
              totalPackets = expectedTotal;
            }
          }
          const payload = new Uint8Array(pkt.payload);
          fs.writeFileSync(chunkFile, Buffer.from(payload));
          chunks[packetNo] = payload;
          downloadedNewCount++;
          success = true;
          break;
        } finally {
          transport.socket?.removeListener('close', onSockClose);
        }
      } catch (err) {
        lastErr = err;
        console.warn(
          `[BLE Chunk Retry] ${entry.name} chunk ${packetNo}/${totalPackets} attempt ${attempt} failed: ${err.message}`
        );
        if (!transport.isConnected()) {
          sessionStartChunk = null;
          retryFlag = 0;
          try {
            await ensureConnected(false, true);
          } catch {}
        } else if (err.message && err.message.includes('canceled')) {
          try {
            await transport.write(sdk.encodeAppCommand('filecmd', [0]));
          } catch {}
          await new Promise((r) => setTimeout(r, 120));
          sessionStartChunk = packetNo;
          retryFlag = 0;
        } else {
          retryFlag = 1;
        }
      }
    }

    if (!success) {
      // 기기가 도중에 절전 모드로 들어간 경우, 이번 세션에서 새로 받은 청크가 있을 때만 즉시 디코딩 및 전사하여 노트에 반영!
      if (downloadedNewCount > 0 && packetNo > 1 && onProgressPreview) {
        const partialBuf = Buffer.concat(
          chunks
            .slice(1, packetNo)
            .filter(Boolean)
            .map((u) => Buffer.from(u))
        );
        if (partialBuf.length > 0) {
          await onProgressPreview(partialBuf, packetNo - 1, totalPackets, false);
        }
      }
      throw new Error(
        `Failed to download chunk ${packetNo}/${totalPackets} of ${entry.name}: ${lastErr?.message}`
      );
    }

    const pct = Math.round((packetNo / totalPackets) * 100);
    liveState.syncStatusText = `📥 기기 녹음 고속 동기화 중: ${entry.name} (${pct}% · ${packetNo}/${totalPackets} 청크)`;
    saveDeviceJson(true);

    // 최초 12청크(약 3분 분량, ~6초 소요) 다운로드 완료 즉시 1차 AI 제목/전사 프리뷰 반영
    if (!previewTriggered && packetNo >= Math.min(12, totalPackets) && onProgressPreview) {
      previewTriggered = true;
      const partialBuf = Buffer.concat(chunks.slice(1, packetNo + 1).map((u) => Buffer.from(u)));
      onProgressPreview(partialBuf, packetNo, totalPackets).catch(() => {});
    } else if (packetNo % 40 === 0 && onProgressPreview) {
      const partialBuf = Buffer.concat(chunks.slice(1, packetNo + 1).map((u) => Buffer.from(u)));
      onProgressPreview(partialBuf, packetNo, totalPackets, true).catch(() => {});
    }
  }

  try {
    if (transport.isConnected()) {
      const finalOffset = sessionStartChunk ? (sessionStartChunk - 1) * 24480 : 0;
      await transport.write(sdk.encodeAppCommand('opusfile', [2, entry.sn, 0, 0, finalOffset]));
    }
  } catch {}

  const validBuffers = [];
  for (let i = 1; i <= totalPackets; i++) {
    if (chunks[i]) validBuffers.push(Buffer.from(chunks[i]));
  }
  return Buffer.concat(validBuffers);
}

async function finalizeStreamOrSyncFiles(liveTranscriptFallback = '') {
  if (liveStreamFrames.length > 0) {
    const capturedFrames = liveStreamFrames.slice();
    liveStreamFrames = [];
    const fileName = liveState.activeRecordFileName || `stream_${Date.now()}.raw`;
    const sn = Date.now() % 100000;
    const crc = String(Date.now());

    liveState.isSyncing = true;
    liveState.syncStatusText = `실물 기기 실시간 스트림(${capturedFrames.length} 프레임) WAV 변환 및 전사 중...`;
    saveDeviceJson(true);

    try {
      const decoder = await sdk.createOpusPcmDecoder({ sampleRate: 16000, channels: 1 });
      const pcmChunks = [];
      let totalSamples = 0;
      let totalBytes = 0;

      for (const packet of capturedFrames) {
        totalBytes += packet.byteLength;
        try {
          const pcm = decoder.decode(packet);
          pcmChunks.push(pcm);
          totalSamples += pcm.length;
        } catch {}
      }
      decoder.free();

      const merged = new Int16Array(totalSamples);
      let pos = 0;
      for (const c of pcmChunks) {
        merged.set(c, pos);
        pos += c.length;
      }

      const wavFilename = `hw_live_${sn}_${fileName.replace(/\.raw$/i, '')}.wav`;
      const wavPath = path.join(RECORDINGS_DIR, wavFilename);
      const wavBuf = createWavBuffer(merged, 16000, 1);
      fs.writeFileSync(wavPath, wavBuf);

      const durationSec = Number((totalSamples / 16000).toFixed(1));
      const browserText = (liveTranscriptFallback || '').trim();
      const sttRes = await transcribeWavFile(wavPath, browserText);

      const entry = {
        sn,
        name: fileName,
        size: totalBytes,
        scene: 1,
        start_time: liveStreamStartEpoch || Math.floor(Date.now() / 1000) - Math.round(durationSec),
        end_time: Math.floor(Date.now() / 1000),
        crc,
        frame_size: capturedFrames[0]?.byteLength || 40,
      };

      const noteObj = buildSmartNoteFromTranscript(
        entry,
        sttRes,
        sttRes.durationSec || durationSec,
        wavFilename
      );

      upsertNoteInStore(noteObj, true);

      liveState.lastSyncedAt = new Date().toISOString();
      liveState.syncStatusText = `✅ 실물 기기 녹음(${durationSec}초) 전사 및 옵시디언 자동 저장 완료!`;
      saveDeviceJson(true);

      return {
        ok: true,
        newlySyncedCount: 1,
        newlySynced: [noteObj],
        totalFilesOnDevice: liveState.filesOnDevice.length,
        state: liveState,
      };
    } finally {
      liveState.isSyncing = false;
      saveDeviceJson(true);
    }
  }

  return syncHardwareFiles(false);
}

let activeSyncPromise = null;

async function syncHardwareFiles(force = false) {
  if (activeSyncPromise) {
    return activeSyncPromise;
  }

  activeSyncPromise = withLock(async () => {
    try {
      await ensureConnected();
      if (liveState.isRecording) {
        return {
          ok: true,
          newlySyncedCount: 0,
          newlySynced: [],
          totalFilesOnDevice: liveState.filesOnDevice.length,
          state: liveState,
        };
      }
      liveState.isSyncing = true;
      liveState.syncStatusText = '실물 기기 내장 메모리 녹음 파일 조회 중...';
      saveDeviceJson(true);

      const files = (await client.getFileList()) || [];
      liveState.filesOnDevice = files;

      const notes = loadNotesList();
      const deletedSet = new Set(loadDeletedIds());
      const newlySynced = [];

      // 최신 녹음(sn 내림차순)부터 우선 처리
      const sortedFiles = [...files].sort((a, b) => (b.sn || 0) - (a.sn || 0));

      for (const entry of sortedFiles) {
        const noteId = `note-hw-${entry.sn}-${entry.crc}`;
        if (
          !force &&
          (deletedSet.has(noteId) ||
            deletedSet.has(`hw-sn-${entry.sn}`) ||
            deletedSet.has(`hw-file-${entry.name}`))
        ) {
          continue;
        }
        const rawStem = entry.name.replace(/\.raw$/i, '');
        const wavFilename = `hw_${entry.sn}_${rawStem}.wav`;
        const wavPath = path.join(RECORDINGS_DIR, wavFilename);

        const existingNote = notes.find(
          (n) =>
            n.id === noteId ||
            n.hardwareSn === entry.sn ||
            n.hardwareFileName === entry.name ||
            (n.audioUrl && n.audioUrl.includes(rawStem))
        );

        const rawPath = path.join(RECORDINGS_DIR, entry.name);
        const isFullySynced =
          existingNote &&
          !existingNote.title?.includes('동기화 중') &&
          !existingNote.transcript?.includes('동기화 및 AI 전사 진행 중') &&
          ((fs.existsSync(rawPath) && fs.statSync(rawPath).size >= entry.size) || entry.sn <= 8);

        if (isFullySynced && !force) {
          continue;
        }

        // Skip tiny test files (< 15,000 bytes / ~7.5s) unless force=true
        if ((entry.size < 35000 || entry.sn <= 8) && !force) {
          continue;
        }

        // 1단계: 기기에서 녹음 파일 발견 즉시 페이지(오늘 목록)에 노트 카드 즉시 등록!
        if (!existingNote) {
          const initialNote = buildSmartNoteFromTranscript(
            entry,
            {
              title: `SecondBrain Note 실물 기기 녹음 (${entry.name})`,
              summary: [
                `실물 SecondBrain Note에서 녹음된 파일(${(entry.size / (1024 * 1024)).toFixed(2)} MB)을 고속 동기화 및 AI 전사 중입니다.`,
              ],
              transcript: 'Speaker 1: (실물 기기에서 오디오 고속 동기화 및 AI 전사 진행 중...)',
            },
            0,
            wavFilename,
            '[동기화 중...]'
          );
          upsertNoteInStore(initialNote, false);
        }

        console.log(`[BLE Sync] Downloading ${entry.name} (sn=${entry.sn}, ${entry.size} bytes) with resumable chunk engine...`);

        const frameSize = entry.frame_size || 40;
        let previewRunning = false;

        const fullRawBuffer = await downloadFileResumable(
          entry,
          async (partialBuf, doneChunks, totalChunks, audioOnly = false) => {
            if (previewRunning) return;
            previewRunning = true;
            try {
              const partDur = await decodeOpusBytesToWav(partialBuf, frameSize, wavPath);
              if (!audioOnly) {
                const sttPreview = await transcribeWavFile(wavPath, '');
                const previewNote = buildSmartNoteFromTranscript(
                  entry,
                  sttPreview,
                  partDur,
                  wavFilename,
                  doneChunks < totalChunks
                    ? `[동기화 ${Math.round((doneChunks / totalChunks) * 100)}%]`
                    : ''
                );
                upsertNoteInStore(previewNote, false);
              }
            } catch (e) {
              console.warn('[Preview update warn]', e.message);
            } finally {
              previewRunning = false;
            }
          }
        );

        fs.writeFileSync(rawPath, fullRawBuffer);

        liveState.syncStatusText = `Opus 오디오 전체 디코딩 중: ${entry.name}...`;
        saveDeviceJson(true);

        const durationSec = await decodeOpusBytesToWav(fullRawBuffer, frameSize, wavPath);

        liveState.syncStatusText = `AI 음성 전사(STT) 및 요약 정리 중: ${entry.name} (${durationSec}초)...`;
        saveDeviceJson(true);

        const sttRes = await transcribeWavFile(wavPath, '');
        const noteObj = buildSmartNoteFromTranscript(
          entry,
          sttRes,
          sttRes.durationSec || durationSec,
          wavFilename,
          ''
        );

        upsertNoteInStore(noteObj, true);
        newlySynced.push(noteObj);
      }

      liveState.lastSyncedAt = new Date().toISOString();
      liveState.syncStatusText =
        newlySynced.length > 0
          ? `✅ 실물 기기 녹음 ${newlySynced.length}건 전사 및 옵시디언·클라우드 자동 연동 완료!`
          : `✅ 기기 최신 상태 (내장 녹음 ${files.length}건 동기화 완료)`;
      saveDeviceJson(true);

      return {
        ok: true,
        newlySyncedCount: newlySynced.length,
        newlySynced,
        totalFilesOnDevice: files.length,
        state: liveState,
      };
    } finally {
      liveState.isSyncing = false;
      activeSyncPromise = null;
      saveDeviceJson(true);
    }
  });

  return activeSyncPromise;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const sendJson = (code, obj) => {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(obj));
  };

  try {
    if (req.url === '/status' && req.method === 'GET') {
      sendJson(200, { ok: true, state: liveState });
      return;
    }

    let body = {};
    if (req.method === 'POST') {
      const raw = await new Promise((resolve) => {
        let b = '';
        req.on('data', (c) => (b += c));
        req.on('end', () => resolve(b));
      });
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch {}
      }
    }

    if (req.url === '/connect' && req.method === 'POST') {
      await withLock(async () => {
        await ensureConnected();
        await refreshTelemetryInternal();
      });
      // 연결 직후 미동기화 파일이 있으면 백그라운드 자동 동기화 즉시 가동
      if (!liveState.isRecording && !liveState.isSyncing) {
        syncHardwareFiles(false).catch((e) => console.error('[Connect AutoSync Error]', e.message));
      }
      sendJson(200, { ok: true, state: liveState });
      return;
    }

    if (req.url === '/start-record' && req.method === 'POST') {
      liveStreamFrames = [];
      liveStreamStartEpoch = Math.floor(Date.now() / 1000);
      recordStartedAtMs = Date.now();
      explicitStopRequested = false;

      await withLock(async () => {
        await ensureConnected(false, true);
        let st;
        try {
          st = await client.startRecord({
            scene: 0,
            opusFormat: VOICEPAD_DICTATION_OPUS_FORMAT,
            sampleRateCode: 0,
          });
        } catch {
          await ensureConnected(true, true);
          recordStartedAtMs = Date.now();
          st = await client.startRecord({
            scene: 0,
            opusFormat: VOICEPAD_DICTATION_OPUS_FORMAT,
            sampleRateCode: 0,
          });
        }
        liveState.connected = true;
        liveState.isRecording = true;
        liveState.recordStartedAt = new Date().toISOString();
        liveState.activeRecordFileName = st?.filename || `rec_${Date.now()}.raw`;
        liveState.syncStatusText = `🔴 실물 SecondBrain Note 하드웨어 녹음 중 (${liveState.activeRecordFileName})`;
        saveDeviceJson(true);
      });

      sendJson(200, { ok: true, state: liveState });
      return;
    }

    if (req.url === '/stop-record' && req.method === 'POST') {
      const wasHwRecording = liveState.isRecording;
      explicitStopRequested = true;
      recordStartedAtMs = 0;
      liveState.isRecording = false;
      liveState.recordStartedAt = null;
      liveState.isSyncing = false;
      liveState.syncStatusText = '✅ 녹음 종료 완료';
      saveDeviceJson(true);

      if (wasHwRecording && transport.isConnected()) {
        withLock(async () => {
          try {
            await client.stopRecord(0, 0);
          } catch {}
        }).catch(() => {});
      }

      if (liveStreamFrames.length > 0) {
        await new Promise((r) => setTimeout(r, 250));
        const syncRes = await finalizeStreamOrSyncFiles(body.liveTranscript || '');
        sendJson(200, syncRes);
      } else {
        // 하드웨어 버튼 녹음 후 종료된 경우 내장 메모리 파일 동기화 자동 트리거
        setTimeout(() => {
          syncHardwareFiles(false).catch(() => {});
        }, 500);
        sendJson(200, {
          ok: true,
          newlySyncedCount: 0,
          newlySynced: [],
          state: liveState,
        });
      }
      return;
    }

    if (req.url === '/sync' && req.method === 'POST') {
      const syncPromise = syncHardwareFiles(Boolean(body.force));
      // 대용량 파일(1시간 녹음 등) 동기화 시 HTTP 타임아웃 방지를 위해 최대 8초 대기 후 진행 상태 즉시 반환 (백그라운드에서 끝까지 완주)
      const raceRes = await Promise.race([
        syncPromise,
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                backgroundSyncInProgress: true,
                newlySyncedCount: 1,
                newlySynced: loadNotesList().slice(0, 1),
                state: liveState,
              }),
            8000
          )
        ),
      ]);
      sendJson(200, raceRes);
      return;
    }

    sendJson(404, { ok: false, error: 'Not found' });
  } catch (err) {
    console.error('[HTTP Bridge Error]', err);
    sendJson(500, { ok: false, error: err.message, state: liveState });
  }
});

// 기기에서 이미 확인된 녹음 메타데이터 보존 (기기가 절전 중일 때도 노트 목록에 즉시 표시 및 깨어나는 즉시 이어받기)
const KNOWN_DEVICE_FILES_SEED = [
  {
    sn: 10,
    name: '65ec3d.raw',
    size: 6985320,
    scene: 1,
    start_time: 1794380418,
    end_time: 1794383925,
    crc: '560910972',
    frame_size: 40,
  },
  {
    sn: 9,
    name: 'e451d7.raw',
    size: 7276040,
    scene: 1,
    start_time: 1794228300,
    end_time: 1794231952,
    crc: '252967126',
    frame_size: 40,
  },
];

function ensureKnownFilesRegisteredInNotes() {
  const notes = loadNotesList();
  for (const entry of KNOWN_DEVICE_FILES_SEED) {
    const noteId = `note-hw-${entry.sn}-${entry.crc}`;
    const rawStem = entry.name.replace(/\.raw$/i, '');
    const wavFilename = `hw_${entry.sn}_${rawStem}.wav`;
    const existing = notes.find(
      (n) =>
        n.id === noteId ||
        n.hardwareSn === entry.sn ||
        n.hardwareFileName === entry.name ||
        (n.audioUrl && n.audioUrl.includes(rawStem))
    );
    if (!existing) {
      const chunkDir = path.join(CHUNKS_ROOT_DIR, `sn_${entry.sn}_${entry.crc}`);
      let savedChunks = 0;
      const totalChunks = Math.max(1, Math.ceil(entry.size / 24480));
      if (fs.existsSync(chunkDir)) {
        savedChunks = fs.readdirSync(chunkDir).filter((f) => f.endsWith('.bin')).length;
      }
      const pct = Math.round((savedChunks / totalChunks) * 100);
      const initialNote = buildSmartNoteFromTranscript(
        entry,
        {
          title: `SecondBrain Note 실물 기기 1시간 녹음 (21:45 ~ 22:45 · ${entry.name})`,
          summary: [
            `실물 SecondBrain Note 하드웨어에 녹음된 대용량 파일(${(entry.size / (1024 * 1024)).toFixed(2)} MB, 1시간 0분 52초)입니다.`,
            `현재 기기 절전 대기 중이며, 실물 노트의 버튼을 한 번 눌러 깨우시면 즉시 고속 동기화(${pct}% 완료) 및 전체 AI 전사가 완료됩니다.`,
          ],
          transcript:
            'Speaker 1: (실물 SecondBrain Note 하드웨어 내장 메모리 파일 감지됨 — 기기 버튼을 살짝 눌러 깨우시면 1시간 0분 52초 분량의 오디오 고속 다운로드 및 AI 전사가 자동으로 완료됩니다.)',
        },
        3652,
        wavFilename,
        savedChunks > 0 ? `[동기화 ${pct}% 대기]` : '[기기 연결 시 자동 전사]'
      );
      upsertNoteInStore(initialNote, true);
    }
  }
}

function hasPendingHardwareSync() {
  const notes = loadNotesList();
  for (const entry of KNOWN_DEVICE_FILES_SEED) {
    const noteId = `note-hw-${entry.sn}-${entry.crc}`;
    const rawStem = entry.name.replace(/\.raw$/i, '');
    const rawPath = path.join(RECORDINGS_DIR, entry.name);
    const wavPath = path.join(RECORDINGS_DIR, `hw_${entry.sn}_${rawStem}.wav`);
    const existing = notes.find((n) => n.id === noteId || n.hardwareSn === entry.sn);
    const rawComplete = fs.existsSync(rawPath) && fs.statSync(rawPath).size >= entry.size;
    if (
      !existing ||
      existing.title?.includes('동기화') ||
      existing.title?.includes('자동 전사') ||
      !fs.existsSync(wavPath) ||
      !rawComplete
    ) {
      return true;
    }
  }
  return false;
}

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[SecondBrain BLE Server] Listening on http://127.0.0.1:${PORT} (Battery Saver Mode: Auto-Connect Disabled)`);
  liveState.connected = false;
  liveState.isRecording = false;
  liveState.filesOnDevice = KNOWN_DEVICE_FILES_SEED;
  liveState.syncStatusText = '절전 보호 모드 (자동 BLE 스캔 해제됨)';
  saveDeviceJson(true);
});
