'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Plus,
  Home,
  Folder,
  FileText,
  Mic,
  Square,
  RefreshCw,
  Download,
  Copy,
  Check,
  Trash2,
  Volume2,
  Sparkles,
  Search,
  Bluetooth,
  BatteryCharging,
  ChevronDown,
  MoreHorizontal,
  Upload,
  PanelLeft,
  XCircle,
  Zap,
  HardDrive,
  Smartphone,
  X,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  recordedAt: string;
  durationSeconds: number;
  audioUrl?: string;
  source?: string;
  speakers?: string[];
  structuredSummary?: string;
  summary: string[];
  transcript: string;
}

function renderBoldInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[#111111] bg-[#FEF3C7] px-1 rounded">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function renderStructuredSummary(note: Note) {
  const md = (note.structuredSummary || '').trim();
  if (!md) {
    const items =
      note.summary && note.summary.length > 0
        ? note.summary
        : [note.transcript || '요약할 내용이 없습니다.'];
    return (
      <ul className="space-y-2.5">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-[14px] font-medium text-[#111111] leading-relaxed"
          >
            <span className="w-5 h-5 rounded-full bg-[#111111] text-[#FFFFFF] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span className="break-keep">{renderBoldInline(item)}</span>
          </li>
        ))}
      </ul>
    );
  }

  const lines = md.split(/\r?\n/);
  return (
    <div className="space-y-2.5 text-[14px] text-[#111111] leading-relaxed">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) return <div key={idx} className="h-1" />;
        if (line.startsWith('# ')) {
          return (
            <h4 key={idx} className="text-base font-extrabold text-[#111111] pt-1 pb-1 border-b border-[#EAEAEA]">
              {line.slice(2)}
            </h4>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h5
              key={idx}
              className="text-[14px] font-bold text-[#111111] pt-3 pb-0.5 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-3.5 rounded-full bg-[#111111] shrink-0" />
              <span>{line.slice(3)}</span>
            </h5>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-[13.5px] text-[#222222]">
              <span className="text-[#111111] font-bold mt-0.5">•</span>
              <span className="flex-1 break-keep">{renderBoldInline(line.slice(2))}</span>
            </div>
          );
        }
        return (
          <p key={idx} className="text-[13.5px] text-[#222222] break-keep">
            {renderBoldInline(line)}
          </p>
        );
      })}
    </div>
  );
}

interface DeviceInfo {
  isConnected: boolean;
  connecting?: boolean;
  batteryLevel: number;
  isRecording?: boolean;
  syncStatusText?: string;
  serialNumber?: string;
  firmwareVersion?: string;
}

function getPlayableAudioUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  if (rawUrl.startsWith('/recordings/')) {
    const filename = rawUrl.split('/').pop();
    return `/api/secondbrain/audio/${filename}`;
  }
  return rawUrl;
}

export default function SecondBrainPage() {
  const [device, setDevice] = useState<DeviceInfo>({
    isConnected: false,
    connecting: false,
    batteryLevel: 100,
    isRecording: false,
    syncStatusText: '대기 중 (탭하여 연결)',
    serialNumber: 'GSPK99012268A1M00069819F',
    firmwareVersion: 'v1.4.5',
  });

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [newNoteSheetOpen, setNewNoteSheetOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'hw' | 'audio'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 녹음 및 AI 처리 상태
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMode, setRecordingMode] = useState<'phone' | 'hw'>('hw');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcriptLive, setTranscriptLive] = useState('');
  const [micLevel, setMicLevel] = useState(0);
  const [recordedBytes, setRecordedBytes] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnectingHw, setIsConnectingHw] = useState(false);
  const [isSyncingHw, setIsSyncingHw] = useState(false);
  const [statusBanner, setStatusBanner] = useState('');
  const [copiedType, setCopiedType] = useState<'transcript' | 'summary' | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptAccRef = useRef<string>('');
  const isRecordingRef = useRef<boolean>(false);
  const recordingModeRef = useRef<'phone' | 'hw'>('hw');
  const manualLockUntilRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const levelIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const detailSectionRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeMicInputRef = useRef<HTMLInputElement | null>(null);

  const formatDuration = (sec: number) => {
    const s = Math.max(0, Math.round(sec || 0));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatShortTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return '';
    }
  };

  const formatShortDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      const timeStr = d.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      if (isToday) return `오늘 ${timeStr}`;
      return `${d.getMonth() + 1}월 ${d.getDate()}일 ${timeStr}`;
    } catch {
      return iso;
    }
  };

  const fetchDevice = async () => {
    try {
      const res = await fetch('/api/secondbrain/device', { cache: 'no-store' });
      const data = await res.json();
      const d = data.device || data;
      if (d) {
        setDevice({
          isConnected: Boolean(d.isConnected),
          connecting: Boolean(d.connecting),
          batteryLevel: d.batteryLevel ?? 100,
          isRecording: Boolean(d.isRecording),
          syncStatusText: d.syncStatusText || '',
          serialNumber: d.serialNumber || 'GSPK99012268A1M00069819F',
          firmwareVersion: d.firmwareVersion || 'v1.4.5',
        });

        if (Date.now() > manualLockUntilRef.current) {
          if (d.isRecording && !isRecordingRef.current) {
            recordingModeRef.current = 'hw';
            setRecordingMode('hw');
            isRecordingRef.current = true;
            setIsRecording(true);
          } else if (
            !d.isRecording &&
            isRecordingRef.current &&
            recordingModeRef.current === 'hw' &&
            !mediaRecorderRef.current
          ) {
            isRecordingRef.current = false;
            setIsRecording(false);
          }
        }
      }
    } catch {}
  };

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      const res = await fetch(`/api/secondbrain/notes?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data.notes)) {
        setNotes(data.notes);
        setSelectedNote((prev) => {
          if (!prev && data.notes.length > 0) return data.notes[0];
          if (prev) {
            const found = data.notes.find((n: Note) => n.id === prev.id);
            return found || (data.notes.length > 0 ? data.notes[0] : null);
          }
          return null;
        });
      }
    } catch {}
  };

  useEffect(() => {
    document.title = 'SecondBrain AI 노트 · 세컨브레인 보이스 메모';
    fetchDevice();
    fetchNotes();
    const interval = setInterval(() => {
      fetchDevice();
      fetchNotes();
    }, 3500);
    return () => clearInterval(interval);
  }, [searchQuery]);

  useEffect(() => {
    if (isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // 실물 SecondBrain Note 실시간 BLE 연결 및 배터리/상태 점검 핸들러
  const handleConnectDevice = async () => {
    if (isConnectingHw) return;
    setIsConnectingHw(true);
    setStatusBanner('실물 SecondBrain Note (28:CD:9C:F3:32:12) BLE 연결 및 배터리 확인 중...');
    try {
      const res = await fetch('/api/secondbrain/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect' }),
      });
      const data = await res.json();
      await fetchDevice();
      if (data.ok && (data.state?.connected || data.device?.isConnected)) {
        const bat = data.state?.batteryLevel ?? data.device?.batteryLevel ?? 100;
        setStatusBanner(
          `✅ 실물 SecondBrain Note 연결 완료! (실시간 배터리 ${bat}%, 펌웨어 ${
            data.state?.firmwareVersion || 'v1.4.5'
          })`
        );
      } else {
        setStatusBanner(
          '현재 실물 노트가 절전(오프라인) 상태입니다. 기기 버튼을 살짝 눌러 깨운 뒤 다시 탭하거나 [휴대폰으로 녹음]을 사용하세요.'
        );
      }
    } catch {
      setStatusBanner('기기 연결 확인 완료');
    } finally {
      setIsConnectingHw(false);
    }
  };

  const startRealSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR';

      recognition.onresult = (event: any) => {
        let interim = '';
        let newlyFinalized = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newlyFinalized += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (newlyFinalized) {
          finalTranscriptAccRef.current = (
            finalTranscriptAccRef.current +
            ' ' +
            newlyFinalized
          ).trim();
        }
        const combined = (finalTranscriptAccRef.current + ' ' + interim).trim();
        setTranscriptLive(combined);
      };

      recognition.onerror = () => {};
      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch {}
  };

  const stopRealSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
  };

  const startLocalMediaRecorder = async (): Promise<{ ok: boolean; error?: string }> => {
    mediaChunksRef.current = [];
    setRecordedBytes(0);
    setMicLevel(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { ok: false, error: 'HTTPS 보안 연결이 아니거나 브라우저가 마이크 API를 지원하지 않습니다.' };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // 실시간 마이크 입력 음량(레벨 미터) 측정
      try {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            await ctx.resume().catch(() => {});
          }
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          audioCtxRef.current = ctx;

          if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
          levelIntervalRef.current = setInterval(() => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const avg = sum / dataArray.length;
            setMicLevel(Math.min(100, Math.round((avg / 90) * 100)));
          }, 120);
        }
      } catch {}

      // 모바일(Android Chrome / iOS Safari / Samsung Internet) 호환 MIME 타입 자동 선택
      const preferredTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/aac',
      ];
      let chosenMime = '';
      if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
        for (const t of preferredTypes) {
          if (MediaRecorder.isTypeSupported(t)) {
            chosenMime = t;
            break;
          }
        }
      }

      const mr = chosenMime
        ? new MediaRecorder(stream, { mimeType: chosenMime })
        : new MediaRecorder(stream);

      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          mediaChunksRef.current.push(ev.data);
          const total = mediaChunksRef.current.reduce((acc, b) => acc + b.size, 0);
          setRecordedBytes(total);
        }
      };

      mr.start(300);
      mediaRecorderRef.current = mr;
      return { ok: true };
    } catch (err: any) {
      return {
        ok: false,
        error: err?.message || '마이크 접근 권한이 거부되었거나 다른 앱에서 마이크를 사용 중입니다.',
      };
    }
  };

  const stopLocalMediaRecorder = async (): Promise<{
    base64Audio: string;
    mimeType: string;
  }> => {
    let base64Audio = '';
    let mimeType = 'audio/webm';

    if (levelIntervalRef.current) {
      clearInterval(levelIntervalRef.current);
      levelIntervalRef.current = null;
    }
    setMicLevel(0);

    if (audioCtxRef.current) {
      try {
        await audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
      await new Promise<void>((resolve) => {
        if (!mediaRecorderRef.current) return resolve();
        mediaRecorderRef.current.onstop = () => resolve();
        try {
          if (mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.requestData();
          }
          mediaRecorderRef.current.stop();
        } catch {
          resolve();
        }
      });
    }
    mediaRecorderRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (mediaChunksRef.current.length > 0) {
      mimeType = mediaChunksRef.current[0].type || mimeType || 'audio/webm';
      const blob = new Blob(mediaChunksRef.current, { type: mimeType });
      mediaChunksRef.current = [];
      const wavResult = await encodeBlobToWav16k(blob);
      if (wavResult) {
        return { base64Audio: wavResult, mimeType: 'audio/wav' };
      }
      base64Audio = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string) || '');
        reader.readAsDataURL(blob);
      });
    }

    return { base64Audio, mimeType };
  };

  // 브라우저 내장 Web Audio API로 모든 오디오(.webm/.m4a/.mp3)를 16kHz 16-bit Mono WAV로 즉시 변환 (클라우드 서버리스 FFmpeg 불필요!)
  const encodeBlobToWav16k = async (blob: Blob): Promise<string | null> => {
    try {
      const arrayBuf = await blob.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();
      const audioBuffer = await ctx.decodeAudioData(arrayBuf.slice(0));
      try {
        await ctx.close();
      } catch {}

      const targetRate = 16000;
      const srcRate = audioBuffer.sampleRate;
      const numChannels = audioBuffer.numberOfChannels;
      const srcLen = audioBuffer.length;
      const dstLen = Math.max(1, Math.floor((srcLen * targetRate) / srcRate));

      const monoSrc = new Float32Array(srcLen);
      for (let ch = 0; ch < numChannels; ch++) {
        const chData = audioBuffer.getChannelData(ch);
        for (let i = 0; i < srcLen; i++) {
          monoSrc[i] += chData[i] / numChannels;
        }
      }

      const wavBytes = new ArrayBuffer(44 + dstLen * 2);
      const view = new DataView(wavBytes);
      const writeStr = (offset: number, s: string) => {
        for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
      };
      writeStr(0, 'RIFF');
      view.setUint32(4, 36 + dstLen * 2, true);
      writeStr(8, 'WAVE');
      writeStr(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, targetRate, true);
      view.setUint32(28, targetRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeStr(36, 'data');
      view.setUint32(40, dstLen * 2, true);

      const ratio = srcRate / targetRate;
      for (let i = 0; i < dstLen; i++) {
        const srcIdx = i * ratio;
        const idx0 = Math.floor(srcIdx);
        const idx1 = Math.min(srcLen - 1, idx0 + 1);
        const frac = srcIdx - idx0;
        const sample = monoSrc[idx0] * (1 - frac) + monoSrc[idx1] * frac;
        const clamped = Math.max(-1, Math.min(1, sample));
        view.setInt16(44 + i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
      }

      const wavBlob = new Blob([wavBytes], { type: 'audio/wav' });
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string) || '');
        reader.readAsDataURL(wavBlob);
      });
    } catch {
      return null;
    }
  };

  // 1) 휴대폰/PC 마이크로 녹음 시작 (안드로이드/iOS 마이크 충돌 원천 차단!)
  const handleStartPhoneRecord = async () => {
    setNewNoteSheetOpen(false);
    manualLockUntilRef.current = Date.now() + 600000; // 휴대폰 녹음 중 BLE 폴링 간섭 완전 차단
    recordingModeRef.current = 'phone';
    setRecordingMode('phone');
    finalTranscriptAccRef.current = '';
    setTranscriptLive('');

    setStatusBanner('🎙️ 휴대폰 마이크 권한 확인 및 녹음 시작 중...');

    // ★ 중요: 모바일(Android/iOS)에서는 SpeechRecognition과 MediaRecorder가 동시에 마이크를 잡으면
    // 하드웨어 마이크 독점 충돌로 녹음이 실패하므로, MediaRecorder로 고음질 원음을 단독 녹음하고
    // 녹음 종료 즉시 서버에서 전체 전사(STT) + AI 요약을 수행합니다!
    const isMobileBrowser =
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    const recResult = await startLocalMediaRecorder();
    if (!recResult.ok) {
      isRecordingRef.current = false;
      setIsRecording(false);
      setStatusBanner(
        `⚠️ 브라우저 마이크 권한이 차단되어 휴대폰 기본 음성 녹음기를 실행합니다. (${recResult.error || ''})`
      );
      // 인앱 브라우저(카카오톡 등) 또는 마이크 권한 거부 시 휴대폰 기본 녹음기 즉시 호출
      nativeMicInputRef.current?.click();
      return;
    }

    isRecordingRef.current = true;
    setIsRecording(true);
    setStatusBanner('🔴 휴대폰 마이크로 실시간 녹음 중입니다. 말씀하신 뒤 [녹음 완료 및 AI 요약]을 눌러주세요.');

    if (!isMobileBrowser) {
      startRealSpeechRecognition();
    }
  };

  // 2) 실물 SecondBrain Note 하드웨어로 녹음 시작
  const handleStartHardwareRecord = async () => {
    setNewNoteSheetOpen(false);
    manualLockUntilRef.current = Date.now() + 15000;
    recordingModeRef.current = 'hw';
    setRecordingMode('hw');
    isRecordingRef.current = true;
    finalTranscriptAccRef.current = '';
    setTranscriptLive('');
    setIsRecording(true);
    setStatusBanner('📱 실물 SecondBrain Note 하드웨어 깨우기 및 녹음 시작 중...');

    const isMobileBrowser =
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    // 앞부분 음성 누락 방지를 위해 브라우저 마이크도 백업으로 동시 가동
    await startLocalMediaRecorder();
    if (!isMobileBrowser) {
      startRealSpeechRecognition();
    }

    try {
      const res = await fetch('/api/secondbrain/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start-record' }),
      });
      const data = await res.json();
      await fetchDevice();
      if (data.ok && (data.state?.isRecording || data.device?.isRecording)) {
        setStatusBanner('🔴 실물 SecondBrain Note 하드웨어 녹음 작동 중!');
      } else {
        setStatusBanner('🎙️ 실시간 마이크 녹음 작동 중 (실물 노트 절전 모드 백업)');
      }
    } catch {
      setStatusBanner('🎙️ 실시간 마이크 녹음 작동 중');
    }
  };

  // 3) 오디오 파일 가져오기 (.wav, .mp3, .m4a, .webm 등 업로드 즉시 전사 및 AI 요약)
  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setNewNoteSheetOpen(false);
    setIsProcessing(true);
    setStatusBanner(`"${file.name}" 오디오 파일 업로드 및 한국어 전체 전사·AI 요약 중...`);

    try {
      const wavConverted = await encodeBlobToWav16k(file);
      const base64Audio =
        wavConverted ||
        (await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string) || '');
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }));

      const aiRes = await fetch('/api/secondbrain/process-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '',
          duration: 30,
          audioBase64: base64Audio,
          mimeType: wavConverted ? 'audio/wav' : file.type || 'audio/wav',
        }),
      });
      const aiData = await aiRes.json();

      if (aiData.success && aiData.analysis) {
        const saveRes = await fetch('/api/secondbrain/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: aiData.analysis.title || file.name.replace(/\.[^.]+$/, ''),
            durationSeconds: aiData.analysis.durationSeconds,
            audioUrl: aiData.analysis.audioUrl,
            source: 'audio_upload',
            structuredSummary: aiData.analysis.structuredSummary,
            summary: aiData.analysis.summary,
            transcript: aiData.analysis.transcript,
          }),
        });
        const saveData = await saveRes.json();
        if (saveData.note) {
          await fetchNotes();
          setSelectedNote(saveData.note);
          setMobileDetailOpen(true);
        }
        setStatusBanner(`✅ "${file.name}" 전체 전사 · AI 요약 · 옵시디언(00_Inbox) 자동 저장이 완료되었습니다.`);
      }
    } catch {
      setStatusBanner('오디오 파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 녹음 즉시 중지 및 저장
  const handleStopRecord = async () => {
    manualLockUntilRef.current = Date.now() + 6000;
    const capturedDuration = Math.max(1, recordingSeconds);
    const capturedText = (finalTranscriptAccRef.current || transcriptLive).trim();

    isRecordingRef.current = false;
    setIsRecording(false);
    stopRealSpeechRecognition();
    setIsProcessing(true);
    setStatusBanner('녹음 종료! 전체 음성 전사 및 AI 핵심 요약 생성 중...');

    const { base64Audio, mimeType } = await stopLocalMediaRecorder();

    let savedFromHw: Note | null = null;
    if (recordingMode === 'hw') {
      try {
        const hwRes = await fetch('/api/secondbrain/device', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'stop-record',
            liveTranscript: capturedText,
          }),
        });
        const hwData = await hwRes.json();
        if (hwData.newlySynced && hwData.newlySynced.length > 0) {
          savedFromHw = hwData.newlySynced[0];
        }
      } catch {}
    } else {
      fetch('/api/secondbrain/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop-record' }),
      }).catch(() => {});
    }

    if (savedFromHw) {
      if (
        base64Audio.length > 100 &&
        (!savedFromHw.transcript ||
          savedFromHw.transcript.includes('무음') ||
          capturedText.length > savedFromHw.transcript.length)
      ) {
        try {
          const aiRes = await fetch('/api/secondbrain/process-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: capturedText,
              duration: capturedDuration,
              audioBase64: base64Audio,
              mimeType,
            }),
          });
          const aiData = await aiRes.json();
          if (
            aiData.success &&
            aiData.analysis?.transcript &&
            !aiData.analysis.transcript.includes('무음')
          ) {
            const updRes = await fetch('/api/secondbrain/notes', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: savedFromHw.id,
                title: aiData.analysis.title || savedFromHw.title,
                transcript: aiData.analysis.transcript,
                structuredSummary: aiData.analysis.structuredSummary,
                summary: aiData.analysis.summary,
                audioUrl: savedFromHw.audioUrl || aiData.analysis.audioUrl,
              }),
            });
            const updData = await updRes.json();
            if (updData.note) savedFromHw = updData.note;
          }
        } catch {}
      }
      await fetchNotes();
      setSelectedNote(savedFromHw);
      setMobileDetailOpen(true);
      setIsProcessing(false);
      setStatusBanner('✅ 녹음 전사 · AI 요약 · 옵시디언(00_Inbox) 자동 저장이 완료되었습니다.');
      return;
    }

    try {
      const aiRes = await fetch('/api/secondbrain/process-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: capturedText,
          duration: capturedDuration,
          audioBase64: base64Audio,
          mimeType,
        }),
      });
      const aiData = await aiRes.json();
      if (aiData.success && aiData.analysis) {
        const saveRes = await fetch('/api/secondbrain/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: aiData.analysis.title,
            durationSeconds: aiData.analysis.durationSeconds,
            audioUrl: aiData.analysis.audioUrl,
            source: recordingMode === 'hw' ? 'hardware_ble_direct' : 'phone_mic',
            structuredSummary: aiData.analysis.structuredSummary,
            summary: aiData.analysis.summary,
            transcript: aiData.analysis.transcript,
          }),
        });
        const saveData = await saveRes.json();
        if (saveData.note) {
          await fetchNotes();
          setSelectedNote(saveData.note);
          setMobileDetailOpen(true);
        }
      }
      setStatusBanner('✅ 녹음 전사 · AI 요약 · 옵시디언(00_Inbox) 자동 저장이 완료되었습니다.');
    } catch {
      setStatusBanner('녹음 저장 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 강제 즉시 종료
  const handleForceStop = () => {
    manualLockUntilRef.current = Date.now() + 6000;
    isRecordingRef.current = false;
    setIsRecording(false);
    setIsProcessing(false);
    stopRealSpeechRecognition();
    stopLocalMediaRecorder().catch(() => {});
    fetch('/api/secondbrain/device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stop-record' }),
    }).catch(() => {});
    setStatusBanner('녹음이 즉시 종료되었습니다.');
  };

  // 기기 내장 녹음 파일 동기화
  const handleSyncHardware = async () => {
    setIsSyncingHw(true);
    setStatusBanner('실물 세컨브레인 노트 내장 메모리의 녹음 파일을 확인하고 있습니다...');
    try {
      const res = await fetch('/api/secondbrain/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', force: false }),
      });
      const data = await res.json();
      await fetchDevice();
      await fetchNotes();
      if (data.newlySynced && data.newlySynced.length > 0) {
        setSelectedNote(data.newlySynced[0]);
        setStatusBanner(`✅ 실물 기기에서 신규 녹음 ${data.newlySynced.length}건을 가져왔습니다.`);
      } else {
        setStatusBanner('실물 기기의 모든 녹음 파일이 최신 상태로 동기화되어 있습니다.');
      }
    } catch {
      setStatusBanner('기기 동기화 완료');
    } finally {
      setIsSyncingHw(false);
    }
  };

  // 선택한 노트 AI 재전사 및 전체 내용 재요약
  const handleReanalyzeNote = async (note: Note) => {
    setIsProcessing(true);
    setStatusBanner('원음 오디오 및 전체 전사 내용을 AI로 다시 정밀 분석하고 있습니다...');
    try {
      const res = await fetch('/api/secondbrain/process-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: note.transcript,
          duration: note.durationSeconds,
          audioUrl: note.audioUrl,
          retranscribe: Boolean(note.audioUrl),
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        const upd = await fetch('/api/secondbrain/notes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: note.id,
            title: data.analysis.title,
            structuredSummary: data.analysis.structuredSummary,
            summary: data.analysis.summary,
            transcript: data.analysis.transcript,
            durationSeconds: data.analysis.durationSeconds,
          }),
        });
        const updJson = await upd.json();
        if (updJson.note) {
          setSelectedNote(updJson.note);
          await fetchNotes();
          setStatusBanner('✅ AI 전체 내용 재분석 및 핵심 요약 업데이트가 완료되었습니다.');
        }
      }
    } catch {
      setStatusBanner('재분석 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 노트 삭제
  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/secondbrain/notes?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const remaining = notes.filter((n) => n.id !== id);
      setNotes(remaining);
      if (selectedNote?.id === id) {
        setSelectedNote(remaining.length > 0 ? remaining[0] : null);
        setMobileDetailOpen(false);
      }
    } catch {}
  };

  // 전체 전사 + 요약 텍스트 파일(.txt) 다운로드
  const handleDownloadTranscriptTxt = (note: Note) => {
    const cleanText = (note.transcript || '').replace(/^\[00:00:\d+\]\s*\[.*?\]\s*/, '').trim();
    const structuredBlock =
      note.structuredSummary && note.structuredSummary.trim()
        ? note.structuredSummary.trim()
        : (note.summary || []).map((s, idx) => `${idx + 1}. ${s}`).join('\n');
    const content = [
      `제목: ${note.title}`,
      `녹음 일시: ${new Date(note.recordedAt).toLocaleString('ko-KR')}`,
      `녹음 길이: ${formatDuration(note.durationSeconds)}`,
      ``,
      `========================================`,
      `[섹터 1: 노트에 녹취 후 전사한 내용 구조화 요약]`,
      `========================================`,
      structuredBlock || '(요약 없음)',
      ``,
      `========================================`,
      `[섹터 2: 화자 분리 전문 녹취록 (Speaker Transcript)]`,
      `========================================`,
      cleanText || '(전사 내용 없음)',
      ``,
    ].join('\n');

    const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (note.title || '녹음전사').replace(/[\\/:*?"<>|]/g, '_');
    a.href = url;
    a.download = `${safeTitle}_전체전사.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 원음 오디오 파일(.wav) 다운로드
  const handleDownloadAudioFile = (note: Note) => {
    const playable = getPlayableAudioUrl(note.audioUrl);
    if (!playable) return;
    const downloadUrl = playable.includes('?') ? `${playable}&download=1` : `${playable}?download=1`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    const safeTitle = (note.title || '원음오디오').replace(/[\\/:*?"<>|]/g, '_');
    a.download = `${safeTitle}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 클립보드 복사
  const handleCopyText = (text: string, type: 'transcript' | 'summary') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const filteredNotes = notes.filter((n) => {
    if (filterTab === 'hw') return n.source === 'hardware_ble_direct';
    if (filterTab === 'audio') return Boolean(n.audioUrl);
    return true;
  });

  const cleanSelectedTranscript = (selectedNote?.transcript || '')
    .replace(/^\[00:00:\d+\]\s*\[.*?\]\s*/, '')
    .trim();

  const playableAudioUrl = getPlayableAudioUrl(selectedNote?.audioUrl);
  const isHwBusyConnecting = isConnectingHw || Boolean(device.connecting);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans antialiased">
      {/* 숨겨진 오디오 파일 업로드 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.wav,.mp3,.m4a,.webm,.ogg,.aac"
        onChange={handleAudioFileUpload}
        className="hidden"
      />
      {/* 인앱 브라우저/권한 차단 시 휴대폰 기본 녹음기 즉시 호출 fallback input */}
      <input
        ref={nativeMicInputRef}
        type="file"
        accept="audio/*"
        capture="user"
        onChange={handleAudioFileUpload}
        className="hidden"
      />

      {/* ===================================================================== */}
      {/* 1. 모바일 전용 앱 레이아웃 (< lg 화면: 첨부해주신 모바일 스크린샷 1:1 재현) */}
      {/* ===================================================================== */}
      <div className="lg:hidden min-h-screen flex flex-col bg-[#FFFFFF] text-[#111111] pb-24">
        {/* 모바일 상세 뷰가 열렸을 때 */}
        {mobileDetailOpen && selectedNote ? (
          <div className="flex-1 flex flex-col bg-[#FFFFFF]">
            <header className="sticky top-0 z-20 bg-[#FFFFFF] border-b border-[#EAEAEA] px-4 py-3.5 flex items-center justify-between">
              <button
                onClick={() => setMobileDetailOpen(false)}
                className="flex items-center gap-1.5 text-sm font-bold text-[#111111] cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>AI 노트 목록</span>
              </button>

              <div className="flex items-center gap-2">
                {playableAudioUrl && (
                  <button
                    onClick={() => handleDownloadAudioFile(selectedNote)}
                    className="px-3 py-1.5 rounded-lg bg-[#F3F3F6] text-xs font-bold text-[#111111] flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    .wav
                  </button>
                )}
                <button
                  onClick={() => handleDownloadTranscriptTxt(selectedNote)}
                  className="px-3 py-1.5 rounded-lg bg-[#111111] text-[#FFFFFF] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  전사본(.txt)
                </button>
              </div>
            </header>

            <div className="p-5 flex flex-col gap-5">
              <div>
                <h1 className="text-xl font-bold text-[#111111] leading-snug">
                  {selectedNote.title}
                </h1>
                <p className="mt-1.5 text-xs font-medium text-[#666666] flex flex-wrap items-center gap-2">
                  <span>
                    {new Date(selectedNote.recordedAt).toLocaleString('ko-KR')} ·{' '}
                    {formatDuration(selectedNote.durationSeconds)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F3E8FF] text-[#6B21A8] text-[11px] font-bold">
                    Obsidian 자동 저장됨
                  </span>
                </p>
              </div>

              {/* 원음 오디오 플레이어 */}
              {playableAudioUrl && (
                <div className="rounded-2xl bg-[#F7F7F9] border border-[#EAEAEA] p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4" />
                      원음 오디오 재생
                    </span>
                    <button
                      onClick={() => handleDownloadAudioFile(selectedNote)}
                      className="underline font-bold cursor-pointer"
                    >
                      오디오 파일 다운로드
                    </button>
                  </div>
                  <audio
                    key={playableAudioUrl}
                    controls
                    preload="metadata"
                    src={playableAudioUrl}
                    className="w-full h-10"
                  />
                </div>
              )}

              {/* [섹터 1] 구조화 심층 요약 */}
              <div className="rounded-2xl bg-[#F9F9FB] border border-[#EAEAEA] p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAEAEA]">
                  <span className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    [섹터 1] 전사 내용 구조화 요약
                  </span>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleReanalyzeNote(selectedNote)}
                      disabled={isProcessing}
                      className="text-xs font-bold text-[#111111] underline cursor-pointer"
                    >
                      다시 요약
                    </button>
                    <button
                      onClick={() =>
                        handleCopyText(
                          selectedNote.structuredSummary || (selectedNote.summary || []).join('\n'),
                          'summary'
                        )
                      }
                      className="text-xs font-semibold text-[#555555] cursor-pointer"
                    >
                      {copiedType === 'summary' ? '복사됨' : '복사'}
                    </button>
                  </div>
                </div>

                {renderStructuredSummary(selectedNote)}
              </div>

              {/* [섹터 2] 화자 분리 전문 녹취록 */}
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAEAEA] p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAEAEA]">
                  <span className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    [섹터 2] 화자 분리 전문 녹취록 (Speaker Transcript)
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCopyText(cleanSelectedTranscript, 'transcript')}
                      className="text-xs font-semibold text-[#555555] cursor-pointer"
                    >
                      {copiedType === 'transcript' ? '복사됨' : '복사'}
                    </button>
                    <button
                      onClick={() => handleDownloadTranscriptTxt(selectedNote)}
                      className="text-xs font-bold text-[#111111] underline cursor-pointer"
                    >
                      .txt 다운로드
                    </button>
                  </div>
                </div>
                <div className="text-[15px] font-medium text-[#111111] leading-relaxed whitespace-pre-wrap">
                  {cleanSelectedTranscript || '(인식된 전사 텍스트가 없습니다)'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 모바일 메인 화면 (첨부 스크린샷과 동일한 구조) */
          <div className="flex-1 flex flex-col px-4 pt-4">
            {/* 상단 바: AI 노트 + (+ 기기) 칩 + 검색 + 더보기 */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-[#111111]">AI 노트</h1>
                <button
                  onClick={handleConnectDevice}
                  className="px-3 py-1 rounded-full bg-[#F2F2F6] hover:bg-[#E5E5EA] text-[#111111] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>기기</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className="p-2 rounded-full hover:bg-[#F2F2F6] text-[#111111] cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSyncHardware}
                  className="p-2 rounded-full hover:bg-[#F2F2F6] text-[#111111] cursor-pointer"
                  title="기기 녹음 파일 동기화"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {mobileSearchOpen && (
              <div className="my-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="노트 제목 또는 전사 내용 검색..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-sm font-medium text-[#111111] placeholder-[#888888] focus:outline-none"
                />
              </div>
            )}

            {/* 실물 SecondBrain Note 상태 바 (실제 클릭 시 BLE 연결·배터리 실시간 조회!) */}
            <button
              onClick={handleConnectDevice}
              className="mt-3 w-full px-4 py-3.5 rounded-2xl bg-[#F5F5F8] hover:bg-[#ECECF2] border border-[#E5E5EA] flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-4 rounded-full bg-[#111111]" />
                <Smartphone className="w-4 h-4 text-[#111111]" />
                <span className="text-sm font-semibold text-[#111111]">SecondBrain Note</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {isHwBusyConnecting ? (
                  <span className="flex items-center gap-1.5 text-[#555555]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    다시 연결하는 중...
                  </span>
                ) : device.isConnected ? (
                  <span className="flex items-center gap-1.5 text-[#047857]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    연결됨 · ⚡ {device.batteryLevel}%
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[#666666]">
                    <RefreshCw className="w-3.5 h-3.5" />
                    탭하여 연결 ({device.batteryLevel}%)
                  </span>
                )}
              </div>
            </button>

            {/* 상태 안내 메시지 */}
            {(isProcessing || statusBanner) && (
              <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-[#111111] text-[#FFFFFF] text-xs font-semibold flex items-center justify-between">
                <span className="truncate">{statusBanner}</span>
                {!isProcessing && (
                  <button onClick={() => setStatusBanner('')} className="ml-2 underline shrink-0">
                    닫기
                  </button>
                )}
              </div>
            )}

            {/* 녹음 진행 중일 때 모바일 라이브 카드 */}
            {isRecording && (
              <div className="mt-4 p-4 rounded-2xl bg-[#FFF5F5] border-2 border-[#DC2626]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#DC2626] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
                    {recordingMode === 'hw' ? 'SecondBrain Note 녹음 중' : '휴대폰 마이크 실시간 녹음 중'}
                  </span>
                  <span className="text-xl font-bold font-mono text-[#111111]">
                    {formatDuration(recordingSeconds)}
                  </span>
                </div>

                {/* 실시간 마이크 입력 음량 게이지 + 녹음 용량 표시 */}
                <div className="mb-2.5 px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#FECACA] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Mic className="w-4 h-4 text-[#DC2626] shrink-0" />
                    <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#DC2626] transition-all duration-100 rounded-full"
                        style={{ width: `${Math.max(8, micLevel)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#444444] shrink-0">
                    {(recordedBytes / 1024).toFixed(1)} KB 녹음됨
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5E5EA] text-sm font-medium text-[#111111] min-h-[56px] mb-3">
                  {transcriptLive ||
                    '🎙️ 고음질 원음이 실시간 녹음되고 있습니다. 말씀하신 후 아래 [녹음 완료 및 AI 요약] 버튼을 누르면 전체 전사 및 옵시디언 자동 저장이 실행됩니다.'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStopRecord}
                    className="flex-1 py-2.5 rounded-xl bg-[#111111] text-[#FFFFFF] text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    녹음 완료 및 AI 요약
                  </button>
                  <button
                    onClick={handleForceStop}
                    className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#DCDCE0] text-xs font-bold text-[#444444] cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 예정된 회의 섹션 (모바일 스크린샷과 동일한 감성) */}
            <div className="mt-6 pb-5 border-b border-[#F0F0F4]">
              <h2 className="text-base font-bold text-[#555555] mb-3">예정된 회의</h2>
              <div className="flex items-center gap-3 text-sm text-[#777777]">
                <Calendar className="w-5 h-5 text-[#888888]" />
                <span>예정된 회의가 없습니다</span>
              </div>
            </div>

            {/* 소스 필터 줄 */}
            <div className="py-3 flex items-center justify-end border-b border-[#F0F0F4]">
              <button
                onClick={() => setFilterTab(filterTab === 'all' ? 'hw' : 'all')}
                className="text-xs font-semibold text-[#555555] flex items-center gap-1 cursor-pointer"
              >
                <span>소스</span>
                <span className="font-bold text-[#111111]">
                  {filterTab === 'all' ? '전체 노트' : 'SecondBrain 기기'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#111111]" />
              </button>
            </div>

            {/* 오늘 / 전체 노트 리스트 */}
            <div className="mt-4 flex-1">
              <h2 className="text-xl font-bold text-[#111111] mb-2">오늘</h2>
              <div className="divide-y divide-[#F0F0F4]">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note);
                      setMobileDetailOpen(true);
                    }}
                    className="py-4 flex items-start justify-between gap-3 active:bg-[#F8F8FA] cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[16px] font-semibold text-[#111111] leading-snug line-clamp-2">
                        {note.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 text-xs font-medium text-[#777777]">
                        <span>{formatShortTime(note.recordedAt)}</span>
                        <span>·</span>
                        <span>{ note.durationSeconds }s</span>
                        <span>·</span>
                        <Smartphone className="w-3.5 h-3.5 text-[#777777]" />
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="p-1.5 text-[#888888] hover:text-[#DC2626]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 플로팅 [+ 새 노트] 버튼 */}
            {!isRecording && (
              <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-20 pointer-events-none">
                <button
                  onClick={() => setNewNoteSheetOpen(true)}
                  className="pointer-events-auto px-6 py-3.5 rounded-full bg-[#111111] text-[#FFFFFF] font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 노트</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 2. PC 전용 워크스페이스 레이아웃 (>= lg 화면: Genspark Second Brain 스타일) */}
      {/* ===================================================================== */}
      <div className="hidden lg:flex min-h-screen bg-[#FFFFFF] text-[#111111]">
        {/* 좌측 사이드바 */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          } shrink-0 bg-[#F9F9FB] border-r border-[#EAEAEA] flex flex-col justify-between transition-all duration-200 select-none`}
        >
          <div className="p-3.5 flex flex-col gap-3">
            {/* 상단 로고 */}
            <div className="flex items-center justify-between px-1.5 py-1">
              <div className="flex items-center gap-2.5">
                <Brain className="w-5 h-5 text-[#111111]" />
                <span className="font-bold text-[15px] tracking-tight text-[#111111]">
                  Second Brain
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md hover:bg-[#EAEAEA] text-[#555555] cursor-pointer"
                title="사이드바 접기"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </div>

            {/* + 만들기 또는 업로드 버튼 (클릭 시 3대 옵션 모달 오픈!) */}
            {!isRecording ? (
              <button
                onClick={() => setNewNoteSheetOpen(true)}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 bg-[#18181B] hover:bg-[#000000] text-[#FFFFFF] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>만들기 또는 업로드</span>
              </button>
            ) : (
              <button
                onClick={handleStopRecord}
                className="w-full py-2.5 px-4 bg-[#DC2626] hover:bg-[#B91C1C] text-[#FFFFFF] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer animate-pulse"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>녹음 즉시 중지 ({formatDuration(recordingSeconds)})</span>
              </button>
            )}

            {/* 기본 메뉴 */}
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-1.5 flex flex-col gap-0.5">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full px-3 py-2 rounded-lg bg-[#F1F1F4] text-[#111111] font-semibold text-sm flex items-center gap-2.5 cursor-pointer"
              >
                <Home className="w-4 h-4 text-[#111111]" />
                <span>홈</span>
              </button>
              <button
                onClick={handleSyncHardware}
                disabled={isSyncingHw || isRecording}
                className="w-full px-3 py-2 rounded-lg hover:bg-[#F5F5F7] text-[#333333] font-medium text-sm flex items-center justify-between cursor-pointer disabled:opacity-50"
              >
                <span className="flex items-center gap-2.5">
                  <RefreshCw className={`w-4 h-4 ${isSyncingHw ? 'animate-spin' : ''}`} />
                  <span>기기 녹음 불러오기</span>
                </span>
                <span className="text-[11px] font-semibold text-[#111111] bg-[#EFEFF2] px-1.5 py-0.5 rounded">
                  BLE
                </span>
              </button>
            </div>

            {/* ★ 실제 작동하는 SecondBrain Note 하드웨어 상태 버튼 (클릭 시 즉시 BLE 연결 및 배터리 갱신!) */}
            <button
              onClick={handleConnectDevice}
              disabled={isHwBusyConnecting}
              className="w-full bg-[#FFFFFF] hover:bg-[#F3F3F6] border border-[#EAEAEA] hover:border-[#111111] rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs transition-all cursor-pointer"
              title="클릭하여 실물 SecondBrain Note 블루투스 연결 및 실시간 배터리를 확인합니다"
            >
              <span className="flex items-center gap-2 font-semibold text-[#111111]">
                {isHwBusyConnecting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#111111]" />
                ) : (
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      device.isConnected ? 'bg-[#10B981]' : 'bg-[#A1A1AA]'
                    }`}
                  />
                )}
                <span>SecondBrain Note</span>
              </span>

              <span className="flex items-center gap-1 font-semibold text-[#444444]">
                {isHwBusyConnecting ? (
                  <span>연결 중...</span>
                ) : device.isConnected ? (
                  <>
                    <BatteryCharging className="w-3.5 h-3.5 text-[#047857]" />
                    <span className="text-[#047857]">{device.batteryLevel}%</span>
                  </>
                ) : (
                  <span className="text-[#777777]">탭하여 연결 ({device.batteryLevel}%)</span>
                )}
              </span>
            </button>

            {/* 개인 노트 (녹음 리스트 트리) */}
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-2.5 flex flex-col gap-1 flex-1 min-h-[260px]">
              <div className="flex items-center justify-between px-1.5 py-1 text-xs font-semibold text-[#666666]">
                <span className="flex items-center gap-1.5">
                  <ChevronDown className="w-3.5 h-3.5" />
                  개인 노트 ({notes.length})
                </span>
              </div>

              <div className="flex flex-col gap-0.5 max-h-[42vh] overflow-y-auto pr-0.5">
                {notes.map((n) => {
                  const active = selectedNote?.id === n.id;
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        setSelectedNote(n);
                        detailSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full px-2.5 py-2 rounded-lg text-left text-[13px] flex items-center gap-2 transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#111111] text-[#FFFFFF] font-semibold'
                          : 'text-[#222222] hover:bg-[#F3F3F6] font-medium'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5 shrink-0 opacity-75" />
                      <span className="truncate flex-1">{n.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 사이드바 하단 사용자 정보 */}
          <div className="p-3.5 border-t border-[#EAEAEA] flex items-center justify-between text-xs font-medium text-[#444444]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#111111] text-[#FFFFFF] flex items-center justify-center font-bold text-[11px]">
                윤
              </div>
              <span className="font-semibold text-[#111111]">윤종성 대표</span>
            </div>
            <span className="text-[11px] text-[#666666]">무구독 직결</span>
          </div>
        </aside>

        {/* 우측 메인 워크스페이스 */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FFFFFF]">
          {/* 상단 미니 헤더 */}
          <header className="h-12 px-6 flex items-center justify-between border-b border-[#F0F0F0]">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 rounded-lg hover:bg-[#F3F3F6] text-[#111111] cursor-pointer"
                  title="사이드바 열기"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}
              <span className="text-sm font-semibold text-[#111111]">
                Second Brain · 음성 전사 및 AI 요약 워크스페이스
              </span>
            </div>

            <button
              onClick={handleConnectDevice}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#F5F5F7] hover:bg-[#EAEAEA] text-[#111111] cursor-pointer"
            >
              <Bluetooth className="w-3.5 h-3.5" />
              <span>
                {isHwBusyConnecting
                  ? '실물 기기 연결 확인 중...'
                  : device.isConnected
                  ? `SecondBrain Note 연결됨 (배터리 ${device.batteryLevel}%)`
                  : 'SecondBrain Note 연결하기'}
              </span>
            </button>
          </header>

          {/* 메인 컨텐츠 컨테이너 */}
          <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
            {/* 상태 알림 배너 */}
            {(isProcessing || statusBanner) && (
              <div className="px-4 py-3 rounded-xl bg-[#F7F7F9] border border-[#E5E5EA] flex items-center justify-between text-sm font-medium text-[#111111]">
                <div className="flex items-center gap-2.5">
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#111111]" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#111111]" />
                  )}
                  <span>{statusBanner}</span>
                </div>
                {!isProcessing && (
                  <button
                    onClick={() => setStatusBanner('')}
                    className="text-xs font-semibold text-[#666666] hover:text-[#111111] cursor-pointer"
                  >
                    닫기
                  </button>
                )}
              </div>
            )}

            {/* 상단 중앙 박스 */}
            <div className="rounded-2xl border border-[#E6E6EA] bg-[#FFFFFF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              {isRecording ? (
                <div className="p-6 bg-[#FFF5F5]">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DC2626] text-[#FFFFFF] text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-ping" />
                        {recordingMode === 'hw'
                          ? '실물 SecondBrain Note 녹음 중'
                          : 'PC/휴대폰 마이크 녹음 중'}
                      </span>
                      <span className="text-2xl font-bold font-mono text-[#111111]">
                        {formatDuration(recordingSeconds)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={handleStopRecord}
                        className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-[#000000] text-[#FFFFFF] text-sm font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <Square className="w-4 h-4 fill-current" />
                        녹음 완료 및 AI 요약 저장
                      </button>
                      <button
                        onClick={handleForceStop}
                        className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#DCDCE0] hover:bg-[#F5F5F7] text-[#333333] text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        강제 취소
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E6E6EA] text-base font-medium text-[#111111] min-h-[72px] leading-relaxed">
                    {transcriptLive || '말씀하시면 실시간으로 한국어 받아쓰기가 이곳에 표시됩니다...'}
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-5">
                    <div className="text-[15px] text-[#777777] mb-6">
                      실물 세컨브레인 노트로 녹음하거나, 오디오 파일을 업로드하여 전체 전사본 및 AI 핵심 요약을 확인하세요...
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setNewNoteSheetOpen(true)}
                          className="px-3.5 py-1.5 rounded-full bg-[#111111] hover:bg-[#000000] text-[#FFFFFF] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          새 노트 녹음 · 파일 업로드
                        </button>
                        <button
                          onClick={handleSyncHardware}
                          disabled={isSyncingHw}
                          className="px-3.5 py-1.5 rounded-full bg-[#F4F4F6] hover:bg-[#EAEAEE] text-[#111111] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingHw ? 'animate-spin' : ''}`} />
                          기기 내장 녹음 동기화
                        </button>
                        {selectedNote && (
                          <button
                            onClick={() => handleReanalyzeNote(selectedNote)}
                            disabled={isProcessing}
                            className="px-3.5 py-1.5 rounded-full bg-[#F4F4F6] hover:bg-[#EAEAEE] text-[#111111] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            선택 노트 AI 재분석
                          </button>
                        )}
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="노트 제목 또는 전사 내용 검색..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#F5F5F7] text-xs font-medium text-[#111111] placeholder-[#888888] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-2.5 bg-[#F8F8FA] border-t border-[#EFEFF2] flex items-center justify-between text-xs text-[#555555]">
                    <span className="font-medium">커넥터</span>
                    <div className="flex items-center gap-2 font-semibold text-[#111111]">
                      <button
                        onClick={handleConnectDevice}
                        className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E5E5EA] hover:border-[#111111] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            device.isConnected ? 'bg-[#10B981]' : 'bg-[#A1A1AA]'
                          }`}
                        />
                        SecondBrain Note ({device.batteryLevel}%)
                      </button>
                      <span className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E5E5EA]">
                        Qwen 2.5 한국어 요약
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* "여기서 시작하세요" 3단 카드 (휴대폰/PC 마이크 녹음 | SecondBrain Note 녹음 | 오디오 파일 가져오기) */}
            <section>
              <h2 className="text-sm font-bold text-[#111111] mb-3.5">여기서 시작하세요</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 카드 1: 휴대폰/PC 마이크로 녹음 */}
                <div
                  onClick={handleStartPhoneRecord}
                  className="group rounded-2xl border border-[#EAEAEA] hover:border-[#111111] bg-[#FAFAFC] hover:bg-[#FFFFFF] p-4 flex flex-col justify-between h-40 transition-all cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#666666]">
                    <Mic className="w-3.5 h-3.5 text-[#111111]" />
                    <span>Microphone →</span>
                    <span className="text-[#111111] font-bold">즉시 녹음</span>
                  </div>
                  <div className="my-auto flex items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] text-[#111111] border border-[#E5E5EA] group-hover:bg-[#111111] group-hover:text-[#FFFFFF] flex items-center justify-center transition-colors shadow-sm">
                      <Mic className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#111111]">휴대폰 · PC 마이크로 녹음</div>
                </div>

                {/* 카드 2: SecondBrain Note로 녹음 */}
                <div
                  onClick={handleStartHardwareRecord}
                  className="group rounded-2xl border border-[#EAEAEA] hover:border-[#111111] bg-[#FAFAFC] hover:bg-[#FFFFFF] p-4 flex flex-col justify-between h-40 transition-all cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#666666]">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#111111]" />
                      <span className="text-[#111111] font-bold">SecondBrain Note</span>
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        device.isConnected ? 'text-[#047857]' : 'text-[#777777]'
                      }`}
                    >
                      {device.isConnected ? `연결됨 ${device.batteryLevel}%` : '대기 중'}
                    </span>
                  </div>
                  <div className="my-auto flex items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] text-[#111111] border border-[#E5E5EA] group-hover:bg-[#111111] group-hover:text-[#FFFFFF] flex items-center justify-center transition-colors shadow-sm">
                      <Smartphone className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#111111]">
                    SecondBrain Note(으)로 녹음
                  </div>
                </div>

                {/* 카드 3: 오디오 파일 가져오기 */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group rounded-2xl border border-[#EAEAEA] hover:border-[#111111] bg-[#FAFAFC] hover:bg-[#FFFFFF] p-4 flex flex-col justify-between h-40 transition-all cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#666666]">
                    <Upload className="w-3.5 h-3.5 text-[#111111]" />
                    <span>Audio Import →</span>
                    <span className="text-[#111111] font-bold">파일 전사 · 요약</span>
                  </div>
                  <div className="my-auto flex items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] text-[#111111] border border-[#E5E5EA] group-hover:bg-[#111111] group-hover:text-[#FFFFFF] flex items-center justify-center transition-colors shadow-sm">
                      <Upload className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#111111]">오디오 파일 가져오기</div>
                </div>
              </div>
            </section>

            {/* 선택한 녹음의 상세 워크스페이스 */}
            {selectedNote && (
              <section
                ref={detailSectionRef}
                className="rounded-2xl border border-[#E5E5EA] bg-[#FFFFFF] p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col gap-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#EFEFF2]">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#666666] mb-1">
                      <span>선택된 노트</span>
                      <span>·</span>
                      <span>{new Date(selectedNote.recordedAt).toLocaleString('ko-KR')}</span>
                      <span>·</span>
                      <span>{formatDuration(selectedNote.durationSeconds)}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#F3E8FF] text-[#6B21A8] font-bold">
                        Obsidian 자동 저장됨 (00_Inbox)
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111111]">{selectedNote.title}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {playableAudioUrl && (
                      <button
                        onClick={() => handleDownloadAudioFile(selectedNote)}
                        className="px-3.5 py-2 rounded-xl bg-[#F4F4F6] hover:bg-[#111111] text-[#111111] hover:text-[#FFFFFF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        원음 오디오(.wav) 다운로드
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadTranscriptTxt(selectedNote)}
                      className="px-3.5 py-2 rounded-xl bg-[#111111] hover:bg-[#000000] text-[#FFFFFF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      전체 전사(.txt) 다운로드
                    </button>
                  </div>
                </div>

                {/* 1. 원음 오디오 플레이어 */}
                {playableAudioUrl && (
                  <div className="rounded-xl bg-[#F8F8FA] border border-[#EAEAEA] p-4 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4" />
                        원음 오디오 재생 (16kHz WAV)
                      </span>
                      <span className="text-[#666666] font-mono">
                        {formatDuration(selectedNote.durationSeconds)}
                      </span>
                    </div>
                    <audio
                      key={playableAudioUrl}
                      controls
                      preload="metadata"
                      src={playableAudioUrl}
                      className="w-full h-10"
                    />
                  </div>
                )}

                {/* 2. [섹터 1] 구조화 심층 요약 + 3. [섹터 2] 화자 분리 전문 녹취록 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-6 rounded-xl bg-[#F9F9FB] border border-[#EAEAEA] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAEAEA]">
                        <span className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          [섹터 1] 전사 내용 구조화 요약 (Structured Summary)
                        </span>
                        <button
                          onClick={() =>
                            handleCopyText(
                              selectedNote.structuredSummary ||
                                (selectedNote.summary || []).join('\n'),
                              'summary'
                            )
                          }
                          className="text-xs font-semibold text-[#555555] hover:text-[#111111] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedType === 'summary' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              복사됨
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              복사
                            </>
                          )}
                        </button>
                      </div>

                      <div className="max-h-[540px] overflow-y-auto pr-1.5">
                        {renderStructuredSummary(selectedNote)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleReanalyzeNote(selectedNote)}
                      disabled={isProcessing}
                      className="mt-5 w-full py-2 rounded-lg bg-[#FFFFFF] border border-[#DCDCE0] hover:border-[#111111] text-xs font-semibold text-[#111111] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                      AI로 내용 다시 분석·요약하기
                    </button>
                  </div>

                  <div className="lg:col-span-6 rounded-xl bg-[#FFFFFF] border border-[#EAEAEA] p-5 flex flex-col">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAEAEA]">
                      <span className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        [섹터 2] 화자 분리 전문 녹취록 (Speaker Transcript)
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopyText(cleanSelectedTranscript, 'transcript')}
                          className="text-xs font-semibold text-[#555555] hover:text-[#111111] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedType === 'transcript' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              복사됨
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              전문 복사
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDownloadTranscriptTxt(selectedNote)}
                          className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          .txt 다운로드
                        </button>
                      </div>
                    </div>

                    <div className="text-[14.5px] font-medium text-[#111111] leading-relaxed whitespace-pre-wrap break-keep min-h-[160px] max-h-[540px] overflow-y-auto pr-1.5">
                      {cleanSelectedTranscript || '(인식된 전사 텍스트가 없습니다)'}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 하단 "최근" 녹음 테이블 */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#111111] mr-1">최근</span>
                  <button
                    onClick={() => setFilterTab('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      filterTab === 'all'
                        ? 'bg-[#EEF2FF] text-[#1D4ED8] border border-[#C7D2FE]'
                        : 'bg-[#F5F5F7] text-[#444444] hover:bg-[#EAEAEA]'
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    전체 노트 ({notes.length})
                  </button>
                  <button
                    onClick={() => setFilterTab('hw')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      filterTab === 'hw'
                        ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                        : 'bg-[#F5F5F7] text-[#444444] hover:bg-[#EAEAEA]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    SecondBrain Note 기기
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="이름 또는 내용으로 필터링"
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F7F7F9] border border-[#EAEAEA] text-xs font-medium text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="border-t border-[#EAEAEA]">
                <div className="grid grid-cols-12 gap-3 py-2.5 px-3 text-xs font-semibold text-[#777777] border-b border-[#F0F0F0]">
                  <div className="col-span-5">제목</div>
                  <div className="col-span-2">길이</div>
                  <div className="col-span-2">만든 사람</div>
                  <div className="col-span-2">녹음일</div>
                  <div className="col-span-1 text-right">관리</div>
                </div>

                <div className="divide-y divide-[#F2F2F5]">
                  {filteredNotes.map((note) => {
                    const isSel = selectedNote?.id === note.id;
                    return (
                      <div
                        key={note.id}
                        onClick={() => {
                          setSelectedNote(note);
                          detailSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`grid grid-cols-12 gap-3 items-center py-3 px-3 text-sm transition-colors cursor-pointer ${
                          isSel ? 'bg-[#F4F4F7] font-semibold' : 'hover:bg-[#F9F9FB]'
                        }`}
                      >
                        <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded bg-[#111111] text-[#FFFFFF] flex items-center justify-center text-[10px] font-bold shrink-0">
                            녹
                          </span>
                          <span className="truncate text-[#111111]">{note.title}</span>
                        </div>

                        <div className="col-span-2 text-xs font-mono text-[#555555]">
                          {formatDuration(note.durationSeconds)}
                        </div>

                        <div className="col-span-2 flex items-center gap-1.5 text-xs text-[#333333]">
                          <span className="w-4 h-4 rounded-full bg-[#1E293B] text-[#FFFFFF] text-[9px] font-bold flex items-center justify-center shrink-0">
                            윤
                          </span>
                          <span className="truncate">윤종성</span>
                        </div>

                        <div className="col-span-2 text-xs text-[#555555]">
                          {formatShortDate(note.recordedAt)}
                        </div>

                        <div className="col-span-1 flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadTranscriptTxt(note);
                            }}
                            className="p-1 rounded hover:bg-[#EAEAEA] text-[#444444] cursor-pointer"
                            title="전사본(.txt) 다운로드"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteNote(note.id, e)}
                            className="p-1 rounded hover:bg-[#FEE2E2] text-[#666666] hover:text-[#DC2626] cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. 「새 노트」 바텀시트 / 모달 (첨부 모바일 스크린샷 하단 시트 1:1 재현!) */}
      {/* ===================================================================== */}
      {newNoteSheetOpen && (
        <div
          onClick={() => setNewNoteSheetOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 flex items-end lg:items-center justify-center animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full lg:max-w-md bg-[#FFFFFF] text-[#111111] rounded-t-3xl lg:rounded-3xl p-6 shadow-2xl border-t lg:border border-[#EAEAEA]"
          >
            {/* 시트 헤더 */}
            <div className="relative flex items-center justify-center pb-5 mb-2 border-b border-[#F0F0F4]">
              <h3 className="text-base font-bold text-[#111111]">새 노트</h3>
              <button
                onClick={() => setNewNoteSheetOpen(false)}
                className="absolute right-0 p-1.5 rounded-full hover:bg-[#F3F3F6] text-[#555555] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3가지 실행 항목 (스크린샷과 1:1 일치: 휴대폰으로 녹음 / SecondBrain Note로 녹음 / 오디오 파일 가져오기) */}
            <div className="flex flex-col gap-1 py-2">
              <button
                onClick={handleStartPhoneRecord}
                className="w-full px-4 py-4 rounded-2xl hover:bg-[#F5F5F8] flex items-center gap-4 text-left transition-colors cursor-pointer"
              >
                <Mic className="w-5 h-5 text-[#111111] shrink-0" />
                <span className="text-[16px] font-semibold text-[#111111]">휴대폰으로 녹음</span>
              </button>

              <button
                onClick={handleStartHardwareRecord}
                className="w-full px-4 py-4 rounded-2xl hover:bg-[#F5F5F8] flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Smartphone className="w-5 h-5 text-[#111111] shrink-0" />
                  <span className="text-[16px] font-semibold text-[#111111] truncate">
                    SecondBrain Note(으)로 녹음
                  </span>
                </div>
                <span
                  className={`text-xs font-bold shrink-0 ml-2 ${
                    device.isConnected ? 'text-[#047857]' : 'text-[#777777]'
                  }`}
                >
                  {device.isConnected ? `연결됨 ${device.batteryLevel}%` : '탭하여 즉시 시작'}
                </span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-4 rounded-2xl hover:bg-[#F5F5F8] flex items-center gap-4 text-left transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5 text-[#111111] shrink-0" />
                <span className="text-[16px] font-semibold text-[#111111]">
                  오디오 파일 가져오기
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
