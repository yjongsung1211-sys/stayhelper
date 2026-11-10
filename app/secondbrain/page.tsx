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
import {
  renderInteractiveStructuredSummary,
  InteractiveTranscriptView,
  ScheduledMeetingsSection,
  ExpansionCommandHub,
  formatSecToMMSS,
} from './intelligenceEngines';
import {
  LanguageStudyCoachingPanel,
  buildLanguageCoachingData,
  formatLanguageCoachingMarkdown,
  GLOBAL_COACHING_LANGUAGES,
} from './languageCoachingEngine';

interface Note {
  id: string;
  title: string;
  recordedAt: string;
  durationSeconds: number;
  audioUrl?: string;
  source?: string;
  targetLang?: string;
  aiCoaching?: any;
  speakers?: string[];
  categoryLabel?: string;
  categoryFolder?: string;
  structuredSummary?: string;
  summary: string[];
  transcript: string;
  actionOutputs?: Record<
    string,
    {
      label: string;
      content: string;
      updatedAt: string;
    }
  >;
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
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(true);
  const [mobileCoachSubTab, setMobileCoachSubTab] = useState<'lesson' | 'dictionary'>('lesson');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [newNoteSheetOpen, setNewNoteSheetOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'hw' | 'audio' | 'lang' | 'biz'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 녹음 및 AI 처리 상태
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMode, setRecordingMode] = useState<'phone' | 'hw'>('hw');
  const [recordingLang, setRecordingLang] = useState<string>('auto');
  const [customRecLang, setCustomRecLang] = useState<string>('');
  const [appInstallModalOpen, setAppInstallModalOpen] = useState<boolean>(false);
  const [deferredPwaPrompt, setDeferredPwaPrompt] = useState<any>(null);
  const wakeLockRef = useRef<any>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcriptLive, setTranscriptLive] = useState('');
  const [micLevel, setMicLevel] = useState(0);
  const [recordedBytes, setRecordedBytes] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnectingHw, setIsConnectingHw] = useState(false);
  const [isSyncingHw, setIsSyncingHw] = useState(false);
  const [statusBanner, setStatusBanner] = useState('');
  const [copiedType, setCopiedType] = useState<'transcript' | 'summary' | 'action' | null>(null);
  const [activeActionType, setActiveActionType] = useState<
    'shorts_script' | 'language_review' | 'biz_plan' | 'share_message' | 'agent_dispatch'
  >('shorts_script');

  // 🎯 [1번 기능] 원음 오디오 실시간 타임스탬프 점프 & 현재 대화 하이라이트 상태
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const pcAudioRef = useRef<HTMLAudioElement | null>(null);
  const mobileAudioRef = useRef<HTMLAudioElement | null>(null);

  // 🧠 Ask My SecondBrain 통합 RAG 질의응답 상태
  const [askQuery, setAskQuery] = useState('');
  const [askReply, setAskReply] = useState('');
  const [askCitations, setAskCitations] = useState<{ id: string; title: string; date: string }[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  // 🎧 4개 국어 원어민 AI 쉐도잉 플레이어 상태
  const [isShadowing, setIsShadowing] = useState(false);
  const [shadowingSentence, setShadowingSentence] = useState('');
  const [isExpandedView, setIsExpandedView] = useState(false);
  // 🗂️ 페이지 길이 최적화: 상단/하단 메인 워크스페이스 탭 & 노트 상세 내부 서브탭 분리
  const [mainViewTab, setMainViewTab] = useState<
    'notes' | 'coaching' | 'schedule' | 'agents_crm' | 'ask'
  >('notes');
  const [noteDetailTab, setNoteDetailTab] = useState<
    'summary' | 'transcript' | 'coaching' | 'action' | 'split'
  >('summary');
  const [showQuickRecordCards, setShowQuickRecordCards] = useState(false);
  const autoRecordTriggeredRef = useRef<boolean>(false);
  const deletedNoteIdsRef = useRef<Set<string>>(new Set());

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
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) {
      return `${hrs}시간 ${mins}분 ${secs}초`;
    }
    if (mins > 0) {
      return `${mins}분 ${secs}초`;
    }
    return `${secs}초`;
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

  const callHardwareApi = async (
    action: 'status' | 'connect' | 'sync' | 'start-record' | 'stop-record',
    payload: Record<string, any> = {}
  ) => {
    const localEndpoint =
      action === 'status'
        ? 'http://127.0.0.1:3099/status'
        : `http://127.0.0.1:3099/${action}`;
    try {
      const controller = new AbortController();
      const timeoutMs = action === 'status' ? 1200 : action === 'sync' ? 12000 : 8000;
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(localEndpoint, {
        method: action === 'status' ? 'GET' : 'POST',
        ...(action !== 'status'
          ? {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }
          : {}),
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timer);
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    const res = await fetch('/api/secondbrain/device', {
      method: action === 'status' ? 'GET' : 'POST',
      ...(action !== 'status'
        ? {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...payload }),
          }
        : {}),
      cache: 'no-store',
    });
    return await res.json();
  };

  const fetchDevice = async () => {
    try {
      const data = await callHardwareApi('status');
      const d = data.state || data.device || data;
      if (d) {
        setDevice({
          isConnected: Boolean(d.connected ?? d.isConnected),
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
        const cleanList = data.notes.filter((n: Note) => !deletedNoteIdsRef.current.has(n.id));
        setNotes(cleanList);
        setSelectedNote((prev) => {
          if (!prev && cleanList.length > 0) return cleanList[0];
          if (prev && !deletedNoteIdsRef.current.has(prev.id)) {
            const found = cleanList.find((n: Note) => n.id === prev.id);
            return found || (cleanList.length > 0 ? cleanList[0] : null);
          }
          return cleanList.length > 0 ? cleanList[0] : null;
        });
      }
    } catch {
    } finally {
      setIsLoadingNotes(false);
    }
  };

  useEffect(() => {
    document.title = 'NoteHelper (노트헬퍼) · 스마트폰 회의록 정리 & AI 외국어 공부 앱';
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/secondbrain-sw.js').catch(() => {});
      }
      const onBeforeInstall = (e: any) => {
        e.preventDefault();
        setDeferredPwaPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', onBeforeInstall);
      return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    // 배터리 절약을 위해 상시 주기적 폴링(setInterval)을 제거하고,
    // 화면을 다시 열 때(visibilitychange) 또는 녹음/검색 시에만 온디맨드로 불러옵니다.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isRecordingRef.current) {
        fetchNotes();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [searchQuery]);

  useEffect(() => {
    if (isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // 모바일 화면 꺼짐 방지(WakeLock) & 잠금화면 컨트롤(MediaSession) 활성화
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
        (navigator as any).wakeLock
          .request('screen')
          .then((lock: any) => {
            wakeLockRef.current = lock;
          })
          .catch(() => {});
      }
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: '🎙️ NoteHelper (노트헬퍼) 실시간 AI 녹음 중',
            artist: 'NoteHelper Frontier AI',
            album: '전 세계 다국어 음성 전사 & 요약',
          });
        } catch {}
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
      if (wakeLockRef.current) {
        try {
          wakeLockRef.current.release();
        } catch {}
        wakeLockRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // 스마트폰 브라우저/앱에서 직접 WebBluetooth로 실물 VoicePad(NoteHelper) BLE 페어링
  const handleDirectMobileBlePair = async () => {
    if (typeof navigator === 'undefined' || !(navigator as any).bluetooth) {
      await handleConnectDevice();
      return;
    }
    try {
      setStatusBanner('📱 스마트폰 블루투스(BLE)로 실물 NoteHelper 기기를 직접 탐색합니다...');
      const bleDevice = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', '0000180f-0000-1000-8000-00805f9b34fb'],
      });
      if (bleDevice) {
        setDevice((prev) => ({
          ...prev,
          isConnected: true,
          syncStatusText: `스마트폰 직접 BLE 연결됨 (${bleDevice.name || 'NoteHelper'})`,
        }));
        setStatusBanner(
          `✅ 스마트폰 직접 블루투스 연결 완료: ${bleDevice.name || 'NoteHelper'} (클라우드 동기화 활성화)`
        );
      }
    } catch {
      await handleConnectDevice();
    }
  };

  // 실물 NoteHelper 실시간 BLE 연결 및 배터리/상태 점검 핸들러
  const handleConnectDevice = async () => {
    if (isConnectingHw) return;
    setIsConnectingHw(true);
    setStatusBanner('실물 NoteHelper 기기 (28:CD:9C:F3:32:12) BLE 연결 및 내장 녹음 파일 확인 중...');
    try {
      const data = await callHardwareApi('connect');
      await fetchDevice();
      await fetchNotes();
      if (data.ok && (data.state?.connected || data.device?.isConnected)) {
        const bat = data.state?.batteryLevel ?? data.device?.batteryLevel ?? 100;
        setStatusBanner(
          `✅ 실물 NoteHelper 기기 연결 완료! (실시간 배터리 ${bat}%, 내장 녹음 자동 동기화 가동)`
        );
      } else {
        setStatusBanner(
          '현재 실물 노트가 절전(오프라인) 상태입니다. 실물 기기 버튼을 한 번 살짝 눌러 깨우시면 자동으로 즉시 연결 및 동기화됩니다!'
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
      const foundLang = GLOBAL_COACHING_LANGUAGES.find((l) => l.code === recordingLang);
      recognition.lang = foundLang ? foundLang.bcp47 : 'ko-KR';

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

  // 2) 실물 NoteHelper 하드웨어로 녹음 시작
  const handleStartHardwareRecord = async () => {
    setNewNoteSheetOpen(false);
    manualLockUntilRef.current = Date.now() + 15000;
    recordingModeRef.current = 'hw';
    setRecordingMode('hw');
    isRecordingRef.current = true;
    finalTranscriptAccRef.current = '';
    setTranscriptLive('');
    setIsRecording(true);
    setStatusBanner('📱 실물 NoteHelper 하드웨어 깨우기 및 녹음 시작 중...');

    const isMobileBrowser =
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    // 앞부분 음성 누락 방지를 위해 브라우저 마이크도 백업으로 동시 가동
    await startLocalMediaRecorder();
    if (!isMobileBrowser) {
      startRealSpeechRecognition();
    }

    try {
      const data = await callHardwareApi('start-record');
      await fetchDevice();
      if (data.ok && (data.state?.isRecording || data.device?.isRecording)) {
        setStatusBanner('🔴 실물 NoteHelper 하드웨어 녹음 작동 중!');
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

      const activeTargetLang = customRecLang.trim() || recordingLang || 'auto';
      const aiRes = await fetch('/api/secondbrain/process-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '',
          duration: 30,
          audioBase64: base64Audio,
          mimeType: wavConverted ? 'audio/wav' : file.type || 'audio/wav',
          targetLang: activeTargetLang,
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
            targetLang: activeTargetLang !== 'auto' ? activeTargetLang : undefined,
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

  // 녹음 즉시 중지 및 저장 (휴대폰 마이크 전용)
  const handleStopRecord = async () => {
    manualLockUntilRef.current = Date.now() + 6000;
    const capturedDuration = Math.max(1, recordingSeconds);
    const capturedText = (finalTranscriptAccRef.current || transcriptLive).trim();

    isRecordingRef.current = false;
    setIsRecording(false);
    stopRealSpeechRecognition();
    setIsProcessing(true);
    setStatusBanner('녹음 종료! 전체 음성 전사 및 회의록 요약 · 외국어 코칭 생성 중...');

    const { base64Audio, mimeType } = await stopLocalMediaRecorder();

    try {
      const activeTargetLang = customRecLang.trim() || recordingLang || 'auto';
      const aiRes = await fetch('/api/secondbrain/process-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: capturedText,
          duration: capturedDuration,
          audioBase64: base64Audio,
          mimeType,
          targetLang: activeTargetLang,
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
            source: 'phone_mic',
            targetLang: activeTargetLang !== 'auto' ? activeTargetLang : undefined,
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
      setStatusBanner('✅ 휴대폰 녹음 전사 · 회의록/외국어 AI 요약이 완료되었습니다.');
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
    setStatusBanner('녹음이 취소되었습니다.');
  };

  // 기기 내장 녹음 파일 동기화
  const handleSyncHardware = async () => {
    setIsSyncingHw(true);
    setStatusBanner('실물 NoteHelper 내장 메모리의 녹음 파일을 확인하고 고속 동기화 중입니다...');
    try {
      const data = await callHardwareApi('sync', { force: false });
      await fetchDevice();
      await fetchNotes();
      if (data.backgroundSyncInProgress) {
        if (data.newlySynced && data.newlySynced.length > 0) {
          setSelectedNote(data.newlySynced[0]);
        }
        setStatusBanner(
          `📥 대용량 실물 기기 녹음 고속 동기화 진행 중입니다! (${
            data.state?.syncStatusText || '청크 단위 자동 이어받기 및 AI 전사 진행 중'
          })`
        );
      } else if (data.newlySynced && data.newlySynced.length > 0) {
        setSelectedNote(data.newlySynced[0]);
        setStatusBanner(`✅ 실물 기기에서 신규 녹음 ${data.newlySynced.length}건을 가져왔습니다.`);
      } else {
        setStatusBanner('실물 기기의 모든 녹음 파일이 최신 상태로 동기화되어 있습니다.');
      }
    } catch {
      setStatusBanner('기기 동기화 확인 완료');
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

  // 노트 삭제 (삭제 후 폴링/클라우드 동기화로 인한 재생성 원천 차단)
  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('이 노트를 삭제하시겠습니까?')) return;
    deletedNoteIdsRef.current.add(id);
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (selectedNote?.id === id) {
      setSelectedNote(remaining.length > 0 ? remaining[0] : null);
      setMobileDetailOpen(false);
    }
    setStatusBanner('🗑️ 노트를 영구 삭제하고 클라우드·옵시디언에 동기화했습니다.');
    try {
      await fetch(`/api/secondbrain/notes?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch {}
  };

  // 전체 전사 + 요약 텍스트 파일(.txt) 다운로드
  const handleDownloadTranscriptTxt = (note: Note) => {
    const cleanText = (note.transcript || '').replace(/^\[00:00:\d+\]\s*\[.*?\]\s*/, '').trim();
    const coaching = buildLanguageCoachingData(note);
    const baseStructured =
      note.structuredSummary && note.structuredSummary.trim()
        ? note.structuredSummary.trim()
        : (note.summary || []).map((s, idx) => `${idx + 1}. ${s}`).join('\n');
    const structuredBlock =
      coaching && !baseStructured.includes('[언어 학습 전담 AI 코칭]')
        ? `${baseStructured}${formatLanguageCoachingMarkdown(coaching)}`
        : baseStructured;
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
  const handleCopyText = (text: string, type: 'transcript' | 'summary' | 'action') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // 보이스 투 액션 (쇼츠 대본 / 3회독 복습 카드 / 실행 기획서 / 카톡·이메일 요약 초안 원클릭 변환 + 텔레그램 & 옵시디언 전송)
  const handleVoiceToAction = async (
    note: Note,
    actionType: 'shorts_script' | 'language_review' | 'biz_plan' | 'share_message'
  ) => {
    setActiveActionType(actionType);
    setIsProcessing(true);
    const labelMap = {
      shorts_script: '🎬 유튜브 쇼츠·릴스 6-Cut 대본',
      language_review: '📚 무스트레스 3회독 복습 카드',
      biz_plan: '📋 1인 기업 AI 실행 기획서',
      share_message: '💬 참석자 공유용 카톡·이메일 요약 초안',
    };
    setStatusBanner(`${labelMap[actionType]} 생성 및 텔레그램·옵시디언 자동 전송 중...`);
    try {
      const res = await fetch('/api/secondbrain/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId: note.id,
          actionType,
          note,
        }),
      });
      const data = await res.json();
      if (data.success && data.note) {
        setSelectedNote(data.note);
        await fetchNotes();
        setStatusBanner(`✅ ${labelMap[actionType]} 생성 완료! (텔레그램 & 옵시디언 자동 저장됨)`);
      } else {
        setStatusBanner('변환 중 일시적인 오류가 발생했습니다.');
      }
    } catch {
      setStatusBanner('변환 요청 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 🎯 [1번 기능] 타임스탬프 클릭 시 해당 초(秒)로 원음 오디오 즉시 점프 및 재생
  const handleSeekAudio = (sec: number, label?: string) => {
    const safeSec = Math.max(0, Number(sec) || 0);
    setCurrentAudioTime(safeSec);
    let played = false;
    for (const el of [pcAudioRef.current, mobileAudioRef.current]) {
      if (el) {
        try {
          el.currentTime = safeSec;
          el.play().catch(() => {});
          played = true;
        } catch {}
      }
    }
    if (played) {
      setStatusBanner(
        `🎯 [${formatSecToMMSS(safeSec)}] 시점 원음 오디오로 즉시 점프하여 재생합니다.${
          label ? ` (${label})` : ''
        }`
      );
    } else {
      setStatusBanner(
        `ℹ️ 현재 선택된 노트에는 원음 오디오 파일이 없거나 로드 중입니다. (${formatSecToMMSS(safeSec)})`
      );
    }
  };

  // 사전/CRM/일정 보드에서 특정 노트 선택 및 해당 타임스탬프 원음 즉시 점프
  const handleSelectNoteAndSeek = (noteId: string, sec?: number, label?: string) => {
    const found = notes.find((n) => n.id === noteId);
    if (found) {
      setSelectedNote(found);
      setMainViewTab('notes');
      if (sec !== undefined) {
        setNoteDetailTab('transcript');
      }
      setMobileDetailOpen(true);
      setTimeout(() => {
        detailSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (sec !== undefined) {
          handleSeekAudio(sec, label);
        }
      }, 280);
    }
  };

  // 🤖 [4번 기능] 음성 지시 → AI 에이전트 작업 큐(Task Queue) 원클릭 발주
  const handleDispatchAgentTask = async (taskTitle: string, agentRole: string) => {
    const targetNote = selectedNote || notes[0];
    if (!targetNote) return;
    setActiveActionType('agent_dispatch');
    setIsProcessing(true);
    setStatusBanner(`🤖 [${agentRole}] 에이전트에게 "${taskTitle.slice(0, 32)}..." 작업을 즉시 발주 중...`);
    try {
      const res = await fetch('/api/secondbrain/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId: targetNote.id,
          actionType: 'agent_dispatch',
          taskTitle,
          agentRole,
          note: targetNote,
        }),
      });
      const data = await res.json();
      if (data.success && data.note) {
        setSelectedNote(data.note);
        await fetchNotes();
        setStatusBanner(
          `✅ [${agentRole}] 작업 실행 완료! (옵시디언 & 텔레그램 보고 완료 · 아래 산출물에서 확인하세요)`
        );
      } else {
        setStatusBanner('에이전트 작업 발주 중 일시적인 오류가 발생했습니다.');
      }
    } catch {
      setStatusBanner('에이전트 작업 발주 요청 실패');
    } finally {
      setIsProcessing(false);
    }
  };

  // 🧠 Ask NoteHelper: 내 모든 회의·수업 통합 RAG 검색 & 질의응답
  const handleAskSecondBrain = async (customQuery?: string) => {
    const q = (customQuery ?? askQuery).trim();
    if (!q || isAsking) return;
    if (customQuery) setAskQuery(customQuery);
    setIsAsking(true);
    setStatusBanner(`🧠 "${q}"에 대해 저장된 전체 NoteHelper 노트를 교차 검색 중...`);
    try {
      const res = await fetch('/api/secondbrain/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (data.reply) {
        setAskReply(data.reply);
        setAskCitations(Array.isArray(data.citations) ? data.citations : []);
        setStatusBanner(`✅ NoteHelper 통합 검색 완료 (근거 노트 ${data.citations?.length || 0}건 참조)`);
      } else {
        setAskReply(data.error || '답변을 생성하지 못했습니다.');
      }
    } catch {
      setAskReply('질의응답 처리 중 일시적인 오류가 발생했습니다.');
    } finally {
      setIsAsking(false);
    }
  };

  // ☀️ 08:30 모닝 인텔리전스 & 3회독 복습 브리핑 텔레그램 즉시 발송
  const handleSendMorningBriefing = async () => {
    setIsProcessing(true);
    setStatusBanner('☀️ [모닝 인텔리전스 & 3회독 복습 브리핑]을 윤종성 대표님 텔레그램으로 발송 중...');
    try {
      const res = await fetch('/api/secondbrain/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'morning_briefing' }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusBanner('✅ 모닝 인텔리전스 & 외국어 3회독 복습 브리핑이 대표님 텔레그램으로 발송되었습니다!');
      } else {
        setStatusBanner('모닝 브리핑 발송 중 일시적인 오류가 발생했습니다.');
      }
    } catch {
      setStatusBanner('모닝 브리핑 발송 요청 실패');
    } finally {
      setIsProcessing(false);
    }
  };

  // 🎧 4개 국어 원어민 AI 쉐도잉 플레이어 (영어·일본어·중국어·스페인어·한국어 자동 감지 연속 발음)
  const handleToggleShadowing = (note: Note) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setStatusBanner('현재 브라우저는 원어민 음성 합성(TTS)을 지원하지 않습니다.');
      return;
    }

    if (isShadowing) {
      window.speechSynthesis.cancel();
      setIsShadowing(false);
      setShadowingSentence('');
      setStatusBanner('⏹️ 원어민 AI 쉐도잉 재생을 중지했습니다.');
      return;
    }

    const rawSource = [
      note.structuredSummary || '',
      note.actionOutputs?.language_review?.content || '',
      note.transcript || '',
    ].join('\n');

    const lines = rawSource
      .split(/\r?\n/)
      .map((l) =>
        l
          .replace(/^[#*\-•>\d.)\s]+/, '')
          .replace(/\[00:\d+:\d+\]\s*\[.*?\]\s*/g, '')
          .replace(/Speaker\s*\d+\s*:\s*/gi, '')
          .replace(/\*\*/g, '')
          .trim()
      )
      .filter((l) => l.length >= 4 && l.length <= 180);

    // 우선순위 1: 교정 표현 / 외국어 문장 추출
    const foreignOrCorrected = lines.filter(
      (l) =>
        l.includes('교정 표현') ||
        /[A-Za-z]{4,}/.test(l) ||
        /[\u3040-\u30ff]/.test(l) ||
        /[\u4e00-\u9fff]{2,}/.test(l) ||
        /[áéíóúñ¿¡]/i.test(l)
    );

    const targetSentences = (foreignOrCorrected.length > 0 ? foreignOrCorrected : lines)
      .map((l) => l.replace(/^✅\s*교정 표현\s*(\(원어민 표준\))?\s*:\s*/i, '').trim())
      .filter((l) => l.length >= 3)
      .slice(0, 8);

    if (targetSentences.length === 0) {
      setStatusBanner('쉐도잉할 문장이 없습니다.');
      return;
    }

    window.speechSynthesis.cancel();
    setIsShadowing(true);
    setStatusBanner(`🎧 원어민 AI 쉐도잉 시작 (총 ${targetSentences.length}문장 연속 발음)`);

    const detectLang = (text: string): string => {
      if (/[\u3040-\u30ff]/.test(text)) return 'ja-JP';
      if (/[\u4e00-\u9fff]{2,}/.test(text) && !/[가-힣\u3040-\u30ff]/.test(text)) return 'zh-CN';
      if (/[áéíóúñ¿¡]/i.test(text)) return 'es-ES';
      if (/[A-Za-z]{4,}/.test(text) && !/[가-힣]/.test(text)) return 'en-US';
      return 'ko-KR';
    };

    let idx = 0;
    const speakNext = () => {
      if (idx >= targetSentences.length) {
        setIsShadowing(false);
        setShadowingSentence('');
        setStatusBanner('✅ 원어민 AI 쉐도잉 1회독 듣기가 완료되었습니다!');
        return;
      }
      const sentence = targetSentences[idx++];
      setShadowingSentence(sentence);
      const utter = new SpeechSynthesisUtterance(sentence);
      utter.lang = detectLang(sentence);
      utter.rate = 0.92;
      utter.onend = () => {
        setTimeout(speakNext, 450);
      };
      utter.onerror = () => {
        setIsShadowing(false);
        setShadowingSentence('');
      };
      window.speechSynthesis.speak(utter);
    };

    speakNext();
  };

  // ⚡ 원터치 즉시 녹음 모드 (?record=1 접속 시 0.1초 만에 마이크 녹음 자동 시작!)
  useEffect(() => {
    if (typeof window === 'undefined' || autoRecordTriggeredRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('record') === '1') {
      autoRecordTriggeredRef.current = true;
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      setTimeout(() => {
        handleStartPhoneRecord();
      }, 300);
    }
  }, []);

  const filteredNotes = notes.filter((n) => {
    const isLang = Boolean(buildLanguageCoachingData(n));
    if (filterTab === 'lang' && !isLang) return false;
    if (filterTab === 'biz' && isLang) return false;
    if (filterTab === 'audio' && !n.audioUrl) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const hay = `${n.title || ''} ${n.structuredSummary || ''} ${n.transcript || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const cleanSelectedTranscript = (selectedNote?.transcript || '')
    .replace(/^\[00:00:\d+\]\s*\[.*?\]\s*/, '')
    .trim();

  const playableAudioUrl = getPlayableAudioUrl(selectedNote?.audioUrl);
  const isHwBusyConnecting = isConnectingHw || Boolean(device.connecting);
  const selectedNoteCoaching = selectedNote ? buildLanguageCoachingData(selectedNote) : null;
  const languageStudyNotes = notes.filter((n) => Boolean(buildLanguageCoachingData(n)));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans antialiased">
      {/* 숨겨진 안드로이드 오디오 파일 업로드 input (갤럭시 통화녹음 .m4a, .3ga, .amr 완벽 호환) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.m4a,.3ga,.amr,.3gp,.wav,.mp3,.webm,.ogg,.aac"
        onChange={handleAudioFileUpload}
        className="hidden"
      />
      {/* 안드로이드 기본 음성 녹음기 즉시 호출 input */}
      <input
        ref={nativeMicInputRef}
        type="file"
        accept="audio/*"
        capture="user"
        onChange={handleAudioFileUpload}
        className="hidden"
      />

      {/* ===================================================================== */}
      {/* 1. 모바일 전용 앱 레이아웃 (< lg 화면: 직관적인 3대 메뉴 & 깔끔한 문서 뷰) */}
      {/* ===================================================================== */}
      <div className="lg:hidden min-h-screen flex flex-col bg-[#F8FAFC] text-[#111827] pb-24">
        {mobileDetailOpen && selectedNote ? (
          <div className="flex-1 flex flex-col bg-[#FFFFFF]">
            <header className="sticky top-0 z-20 bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 py-3.5 flex items-center justify-between">
              <button
                onClick={() => setMobileDetailOpen(false)}
                className="flex items-center gap-1.5 text-sm font-bold text-[#111827] cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>노트 목록</span>
              </button>

              <div className="flex items-center gap-2">
                {playableAudioUrl && (
                  <button
                    onClick={() => handleDownloadAudioFile(selectedNote)}
                    className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-xs font-semibold text-[#1E293B] flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    원음
                  </button>
                )}
                <button
                  onClick={() => handleDownloadTranscriptTxt(selectedNote)}
                  className="px-3 py-1.5 rounded-lg bg-[#111827] text-[#FFFFFF] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  녹취록(.txt)
                </button>
              </div>
            </header>

            <div className="p-4 flex flex-col gap-5">
              <div>
                <p className="text-xs font-medium text-[#64748B] mb-1.5">
                  {new Date(selectedNote.recordedAt).toLocaleString('ko-KR')} ·{' '}
                  {formatDuration(selectedNote.durationSeconds)}
                </p>
                <h1 className="text-xl font-bold text-[#111827] leading-snug">
                  {selectedNote.title}
                </h1>
              </div>

              {/* 오디오 플레이어 */}
              {playableAudioUrl && (
                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-[#111827]" />
                      녹음 원음 듣기
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatSecToMMSS(currentAudioTime)} / {formatDuration(selectedNote.durationSeconds)}
                    </span>
                  </div>
                  <audio
                    ref={mobileAudioRef}
                    key={playableAudioUrl}
                    controls
                    preload="metadata"
                    src={playableAudioUrl}
                    onTimeUpdate={(e) => setCurrentAudioTime(e.currentTarget.currentTime)}
                    className="w-full h-10"
                  />
                </div>
              )}

              {/* 깔끔한 언더라인 4대 탭 */}
              <div className="flex items-center border-b border-[#E2E8F0] overflow-x-auto">
                {(
                  [
                    { key: 'summary', label: '핵심 요약' },
                    { key: 'transcript', label: '전체 대화 녹취록' },
                    {
                      key: 'coaching',
                      label: `어학 피드백 · 시나리오${selectedNoteCoaching ? ' ●' : ''}`,
                    },
                    { key: 'action', label: 'AI 변환 · 쉐도잉' },
                  ] as const
                ).map((t) => {
                  const active =
                    noteDetailTab === t.key || (t.key === 'summary' && noteDetailTab === 'split');
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setNoteDetailTab(t.key)}
                      className={`px-3.5 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                        active
                          ? 'border-[#111827] text-[#111827]'
                          : 'border-transparent text-[#64748B] hover:text-[#111827]'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* 탭 1: 핵심 요약 */}
              {(noteDetailTab === 'summary' || noteDetailTab === 'split') && (
                <div className="py-1">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F1F5F9]">
                    <span className="text-sm font-bold text-[#111827]">핵심 요약 노트</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReanalyzeNote(selectedNote)}
                        disabled={isProcessing}
                        className="text-xs font-semibold text-[#475569] underline cursor-pointer"
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
                        className="text-xs font-semibold text-[#475569] cursor-pointer"
                      >
                        {copiedType === 'summary' ? '복사됨' : '복사'}
                      </button>
                    </div>
                  </div>
                  {renderInteractiveStructuredSummary(selectedNote, handleSeekAudio, setStatusBanner)}
                </div>
              )}

              {/* 탭 2: 전체 대화 녹취록 */}
              {noteDetailTab === 'transcript' && (
                <div className="py-1">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F1F5F9]">
                    <span className="text-sm font-bold text-[#111827]">전체 대화 녹취록</span>
                    <button
                      onClick={() => handleCopyText(cleanSelectedTranscript, 'transcript')}
                      className="text-xs font-semibold text-[#475569] cursor-pointer"
                    >
                      {copiedType === 'transcript' ? '복사됨' : '전체 복사'}
                    </button>
                  </div>
                  <InteractiveTranscriptView
                    transcript={cleanSelectedTranscript}
                    currentAudioTime={currentAudioTime}
                    hasPlayableAudio={Boolean(playableAudioUrl)}
                    onSeekAudio={handleSeekAudio}
                    onStatus={setStatusBanner}
                  />
                </div>
              )}

              {/* 탭 3: 어학 문법 피드백 · 시나리오 (전 세계 모든 언어 AI 실시간 코칭 지원) */}
              {noteDetailTab === 'coaching' && (
                <div>
                  <LanguageStudyCoachingPanel
                    note={selectedNote}
                    onSeekAudio={handleSeekAudio}
                    onStatus={setStatusBanner}
                    forceShow={true}
                  />
                </div>
              )}

              {/* 탭 4: AI 변환 & 원어민 발음 쉐도잉 */}
              {noteDetailTab === 'action' && (
                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#111827]">
                      원하는 형태로 노트 변환하기
                    </span>
                    <button
                      onClick={() => handleToggleShadowing(selectedNote)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        isShadowing
                          ? 'bg-[#DC2626] text-[#FFFFFF]'
                          : 'bg-[#FFFFFF] border border-[#CBD5E1] text-[#111827]'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isShadowing ? '쉐도잉 중지' : '원어민 발음 연속 듣기'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handleVoiceToAction(selectedNote, 'shorts_script')}
                      disabled={isProcessing}
                      className="py-3 px-3 rounded-xl bg-[#111827] text-[#FFFFFF] text-xs font-bold cursor-pointer disabled:opacity-50"
                    >
                      🎬 쇼츠 대본 만들기
                    </button>
                    <button
                      onClick={() => handleVoiceToAction(selectedNote, 'language_review')}
                      disabled={isProcessing}
                      className="py-3 px-3 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] text-[#111827] text-xs font-bold cursor-pointer disabled:opacity-50"
                    >
                      📚 3회독 복습장 만들기
                    </button>
                    <button
                      onClick={() => handleVoiceToAction(selectedNote, 'biz_plan')}
                      disabled={isProcessing}
                      className="py-3 px-3 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] text-[#111827] text-xs font-bold cursor-pointer disabled:opacity-50"
                    >
                      📋 보고서·기획서 작성
                    </button>
                    <button
                      onClick={() => handleVoiceToAction(selectedNote, 'share_message')}
                      disabled={isProcessing}
                      className="py-3 px-3 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] text-[#111827] text-xs font-bold cursor-pointer disabled:opacity-50"
                    >
                      💬 카톡·이메일 요약본
                    </button>
                  </div>

                  {selectedNote.actionOutputs &&
                    Object.keys(selectedNote.actionOutputs).length > 0 && (
                      <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] p-4">
                        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#F1F5F9]">
                          <span className="text-xs font-bold text-[#111827]">
                            {(
                              selectedNote.actionOutputs[activeActionType] ||
                              Object.values(selectedNote.actionOutputs)[0]
                            )?.label || 'AI 변환 결과'}
                          </span>
                          <button
                            onClick={() =>
                              handleCopyText(
                                (
                                  selectedNote.actionOutputs?.[activeActionType] ||
                                  Object.values(selectedNote.actionOutputs || {})[0]
                                )?.content || '',
                                'action'
                              )
                            }
                            className="text-xs font-bold text-[#111827] underline cursor-pointer"
                          >
                            {copiedType === 'action' ? '복사됨' : '복사'}
                          </button>
                        </div>
                        <div className="text-sm text-[#1E293B] whitespace-pre-wrap leading-7 max-h-80 overflow-y-auto">
                          {
                            (
                              selectedNote.actionOutputs[activeActionType] ||
                              Object.values(selectedNote.actionOutputs)[0]
                            )?.content
                          }
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 모바일 메인 화면 */
          <div className="flex-1 flex flex-col px-4 pt-4">
            <div className="flex items-center justify-between gap-2 py-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-extrabold text-[#111827] tracking-tight whitespace-nowrap">
                    NoteHelper
                  </h1>
                  <span className="text-xs font-bold text-[#475569] whitespace-nowrap">
                    (노트헬퍼)
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-[#64748B] whitespace-nowrap">
                  AI 회의록 정리 · 전 세계 다국어 학습
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={async () => {
                    if (deferredPwaPrompt) {
                      try {
                        deferredPwaPrompt.prompt();
                        await deferredPwaPrompt.userChoice;
                        setDeferredPwaPrompt(null);
                        return;
                      } catch {}
                    }
                    setAppInstallModalOpen(true);
                  }}
                  className="px-2.5 py-2 min-h-[38px] rounded-xl bg-[#ECFDF5] border border-[#10B981] text-[#047857] text-xs font-extrabold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>앱 설치</span>
                </button>
                <button
                  onClick={() => setNewNoteSheetOpen(true)}
                  className="px-3 py-2 min-h-[38px] rounded-xl bg-[#111827] text-[#FFFFFF] text-xs font-bold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>새 녹음</span>
                </button>
              </div>
            </div>

            {/* 상태 배너 */}
            {(isProcessing || statusBanner) && (
              <div className="mt-2 px-3.5 py-2.5 rounded-xl bg-[#111827] text-[#FFFFFF] text-xs font-semibold flex items-center justify-between">
                <span className="truncate">{statusBanner}</span>
                {!isProcessing && (
                  <button onClick={() => setStatusBanner('')} className="ml-2 underline shrink-0">
                    닫기
                  </button>
                )}
              </div>
            )}

            {/* 녹음 중 카드 */}
            {isRecording && (
              <div className="mt-3 p-4 rounded-2xl bg-[#FEF2F2] border border-[#DC2626]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#DC2626] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
                    실시간 녹음 중
                  </span>
                  <span className="text-lg font-bold font-medium tabular-nums text-[#111827]">
                    {formatDuration(recordingSeconds)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#FECACA] text-sm text-[#1E293B] min-h-[48px] mb-3">
                  {transcriptLive || '말씀하신 내용이 녹음되고 있습니다...'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStopRecord}
                    className="flex-1 py-2.5 rounded-xl bg-[#111827] text-[#FFFFFF] text-sm font-bold cursor-pointer"
                  >
                    녹음 완료 및 요약 저장
                  </button>
                  <button
                    onClick={handleForceStop}
                    className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-bold text-[#475569] cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 모바일 탭 1: 내 노트 목록 */}
            {mainViewTab === 'notes' && (
              <div className="mt-3 flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="노트 제목·내용 검색..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-sm text-[#111827] placeholder-[#94A3B8] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(
                    [
                      { key: 'all', label: `전체 (${notes.length})` },
                      { key: 'lang', label: `어학 수업 (${languageStudyNotes.length})` },
                      { key: 'biz', label: `비즈니스·회의 (${notes.length - languageStudyNotes.length})` },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilterTab(f.key)}
                      className={`px-3.5 py-2.5 min-h-[38px] rounded-xl text-xs font-bold cursor-pointer ${
                        filterTab === f.key
                          ? 'bg-[#111827] text-[#FFFFFF]'
                          : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {isLoadingNotes && notes.length === 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {[1, 2, 3].map((k) => (
                      <div
                        key={k}
                        className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] animate-pulse space-y-2"
                      >
                        <div className="h-3.5 w-28 bg-[#E2E8F0] rounded" />
                        <div className="h-5 w-4/5 bg-[#F1F5F9] rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {filteredNotes.map((note) => {
                      const isLang = Boolean(buildLanguageCoachingData(note));
                      return (
                        <div
                          key={note.id}
                          onClick={() => {
                            setSelectedNote(note);
                            setMobileDetailOpen(true);
                          }}
                          className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-start justify-between gap-3 active:bg-[#F8FAFC] cursor-pointer"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  isLang
                                    ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                                    : 'bg-[#F1F5F9] text-[#475569]'
                                }`}
                              >
                                {isLang ? '어학 수업' : '회의 · 메모'}
                              </span>
                              <span className="text-xs text-[#64748B]">
                                {formatShortDate(note.recordedAt)} · {formatDuration(note.durationSeconds)}
                              </span>
                            </div>
                            <h3 className="text-[15.5px] font-bold text-[#111827] leading-snug line-clamp-2">
                              {note.title}
                            </h3>
                          </div>

                          <button
                            onClick={(e) => handleDeleteNote(note.id, e)}
                            className="p-2.5 min-w-[38px] min-h-[38px] flex items-center justify-center text-[#94A3B8] hover:text-[#DC2626] shrink-0"
                            title="노트 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 모바일 탭 2: 어학 단어장 & 수업 준비 (2단 서브탭 분리로 스크롤 피로도 60% 절감) */}
            {mainViewTab === 'coaching' && (
              <div className="mt-4 flex flex-col gap-3.5">
                <div className="grid grid-cols-2 gap-1.5 bg-[#E2E8F0]/70 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMobileCoachSubTab('lesson')}
                    className={`py-2.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                      mobileCoachSubTab === 'lesson'
                        ? 'bg-[#FFFFFF] text-[#111827] shadow-2xs'
                        : 'text-[#475569]'
                    }`}
                  >
                    🎯 수업별 문법·시나리오
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileCoachSubTab('dictionary')}
                    className={`py-2.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                      mobileCoachSubTab === 'dictionary'
                        ? 'bg-[#FFFFFF] text-[#111827] shadow-2xs'
                        : 'text-[#475569]'
                    }`}
                  >
                    📖 누적 단어장 · 5분 치트시트
                  </button>
                </div>

                {mobileCoachSubTab === 'lesson' ? (
                  <>
                    <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex flex-col gap-2.5">
                      <span className="text-sm font-bold text-[#111827]">
                        수업별 문법 교정 · 시나리오 보기
                      </span>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {languageStudyNotes.map((ln) => {
                          const active = selectedNote?.id === ln.id;
                          return (
                            <button
                              key={ln.id}
                              type="button"
                              onClick={() => setSelectedNote(ln)}
                              className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                                active
                                  ? 'bg-[#111827] text-[#FFFFFF]'
                                  : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155]'
                              }`}
                            >
                              {ln.title.slice(0, 22)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedNote && (
                      <LanguageStudyCoachingPanel
                        note={selectedNote}
                        onSeekAudio={handleSeekAudio}
                        onStatus={setStatusBanner}
                      />
                    )}
                  </>
                ) : (
                  <ExpansionCommandHub
                    notes={notes}
                    selectedNote={selectedNote}
                    isProcessing={isProcessing}
                    onSelectNoteAndSeek={handleSelectNoteAndSeek}
                    onDispatchAgentTask={handleDispatchAgentTask}
                    onStatus={setStatusBanner}
                    initialTab="vocab"
                  />
                )}
              </div>
            )}

            {/* 모바일 탭 3: AI 비서 · 일정 · 프로젝트 */}
            {(mainViewTab === 'ask' || mainViewTab === 'schedule' || mainViewTab === 'agents_crm') && (
              <div className="mt-4 flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#111827]">
                      전체 노트에 질문하기 (AI 비서)
                    </span>
                    <button
                      onClick={handleSendMorningBriefing}
                      disabled={isProcessing}
                      className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#334155] cursor-pointer"
                    >
                      ☀️ 모닝 브리핑
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={askQuery}
                      onChange={(e) => setAskQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAskSecondBrain();
                      }}
                      placeholder="궁금한 내용을 물어보세요..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#111827]"
                    />
                    <button
                      onClick={() => handleAskSecondBrain()}
                      disabled={isAsking}
                      className="px-4 py-2 rounded-xl bg-[#111827] text-[#FFFFFF] text-xs font-bold shrink-0 cursor-pointer"
                    >
                      {isAsking ? '검색 중...' : '질문'}
                    </button>
                  </div>

                  {askReply && (
                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#1E293B] whitespace-pre-wrap leading-7">
                      {askReply}
                    </div>
                  )}
                </div>

                <ScheduledMeetingsSection
                  notes={notes}
                  onSelectNote={(n) => {
                    setSelectedNote(n);
                    setMobileDetailOpen(true);
                  }}
                  onStartRecordForSchedule={() => handleStartPhoneRecord()}
                  onStatus={setStatusBanner}
                />

                <ExpansionCommandHub
                  notes={notes}
                  selectedNote={selectedNote}
                  isProcessing={isProcessing}
                  onSelectNoteAndSeek={handleSelectNoteAndSeek}
                  onDispatchAgentTask={handleDispatchAgentTask}
                  onStatus={setStatusBanner}
                  initialTab="agents"
                />
              </div>
            )}

            {/* 모바일 하단 3대 메뉴 바 */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFFFF] border-t border-[#E2E8F0] px-4 py-2 grid grid-cols-3 gap-2">
              {(
                [
                  { key: 'notes', label: '📝 내 노트' },
                  { key: 'coaching', label: '🎓 어학 단어장' },
                  { key: 'ask', label: '🧠 AI 비서 · 일정' },
                ] as const
              ).map((t) => {
                const active =
                  mainViewTab === t.key ||
                  (t.key === 'ask' && (mainViewTab === 'schedule' || mainViewTab === 'agents_crm'));
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setMainViewTab(t.key)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#111827] text-[#FFFFFF]'
                        : 'text-[#475569] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 2. PC 전용 워크스페이스 레이아웃 (>= lg 화면: 좌측 노트 목록 + 우측 깔끔한 문서 뷰) */}
      {/* ===================================================================== */}
      <div className="hidden lg:flex min-h-screen bg-[#F8FAFC] text-[#111827]">
        {/* 좌측 사이드바: 검색 + 카테고리 필터 + 깔끔한 단일 노트 목록 */}
        <aside
          className={`${
            sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
          } shrink-0 bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col justify-between transition-all duration-200 select-none`}
        >
          <div className="p-4 flex flex-col gap-3.5 flex-1 min-h-0">
            {/* 상단 로고 */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#111827]" />
                <span className="font-bold text-base tracking-tight text-[#111827]">
                  NoteHelper (노트헬퍼)
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer"
                title="사이드바 접기"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </div>

            {/* + 새 녹음 / 파일 업로드 버튼 */}
            {!isRecording ? (
              <button
                onClick={() => setNewNoteSheetOpen(true)}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 bg-[#111827] hover:bg-[#1E293B] text-[#FFFFFF] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>새 녹음 · 파일 업로드</span>
              </button>
            ) : (
              <button
                onClick={handleStopRecord}
                className="w-full py-2.5 px-4 bg-[#DC2626] hover:bg-[#B91C1C] text-[#FFFFFF] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>녹음 중지 ({formatDuration(recordingSeconds)})</span>
              </button>
            )}

            {/* 검색창 */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="노트 제목이나 내용 검색..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#111827] placeholder-[#94A3B8] focus:outline-none focus:border-[#111827]"
              />
            </div>

            {/* 직관적인 3단 분류 필터 (전체 / 어학 수업 / 회의·비즈니스) */}
            <div className="grid grid-cols-3 gap-1 bg-[#F1F5F9] p-1 rounded-xl">
              {(
                [
                  { key: 'all', label: `전체 (${notes.length})` },
                  { key: 'lang', label: `어학 (${languageStudyNotes.length})` },
                  { key: 'biz', label: `회의 (${notes.length - languageStudyNotes.length})` },
                ] as const
              ).map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilterTab(f.key)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filterTab === f.key
                      ? 'bg-[#FFFFFF] text-[#111827] shadow-2xs'
                      : 'text-[#64748B] hover:text-[#111827]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* 노트 리스트 (한눈에 들어오는 깔끔한 카드형 리스트 + 우측 삭제 버튼) */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-0">
              {filteredNotes.map((n) => {
                const active = selectedNote?.id === n.id;
                const isLang = Boolean(buildLanguageCoachingData(n));
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelectedNote(n);
                      setMainViewTab('notes');
                    }}
                    className={`group px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      active
                        ? 'bg-[#111827] text-[#FFFFFF] border-[#111827]'
                        : 'bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#111827] border-[#E2E8F0]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            active
                              ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]'
                              : isLang
                              ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                              : 'bg-[#F1F5F9] text-[#475569]'
                          }`}
                        >
                          {isLang ? '어학' : '회의'}
                        </span>
                        <span
                          className={`text-[11px] ${
                            active ? 'text-[#CBD5E1]' : 'text-[#64748B]'
                          }`}
                        >
                          {formatShortDate(n.recordedAt)} · {formatDuration(n.durationSeconds)}
                        </span>
                      </div>
                      <div className="text-[13.5px] font-semibold leading-snug line-clamp-2">
                        {n.title}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteNote(n.id, e)}
                      className={`p-1 rounded-md opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0 ${
                        active
                          ? 'text-[#CBD5E1] hover:text-[#FCA5A5] hover:bg-[#FFFFFF]/10'
                          : 'text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2]'
                      }`}
                      title="이 노트 영구 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 하단 스마트폰 클라우드 AI 동기화 상태 바 */}
          <div className="p-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#1E293B]">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>휴대폰 녹음 · 회의록 · 어학 AI</span>
              </div>

              <button
                onClick={() => fetchNotes()}
                disabled={isRecording}
                className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#111827] text-[#334155] text-[11px] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className="w-3 h-3" />
                <span>새로고침</span>
              </button>
            </div>
          </div>
        </aside>

        {/* 우측 메인 화면 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 상단 헤더: 이해하기 쉬운 3대 메뉴만 깔끔하게 배치 */}
          <header className="sticky top-0 z-20 bg-[#FFFFFF]/95 backdrop-blur border-b border-[#E2E8F0] px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#111827] cursor-pointer"
                  title="노트 목록 열기"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl">
                {(
                  [
                    { key: 'notes', label: '📝 내 노트 (요약 · 녹취록 · 코칭)' },
                    { key: 'coaching', label: '🎓 다국어 단어장 · 수업 준비' },
                    { key: 'ask', label: '🧠 AI 비서 · 일정 · 프로젝트' },
                  ] as const
                ).map((tab) => {
                  const active =
                    mainViewTab === tab.key ||
                    (tab.key === 'ask' &&
                      (mainViewTab === 'schedule' || mainViewTab === 'agents_crm'));
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setMainViewTab(tab.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#FFFFFF] text-[#111827] shadow-2xs'
                          : 'text-[#475569] hover:text-[#111827]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setAppInstallModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6B21A8] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>📲 모바일 앱 · 다국어 AI 허브</span>
              </button>
              <button
                onClick={handleSendMorningBriefing}
                disabled={isProcessing}
                className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#334155] cursor-pointer disabled:opacity-50"
              >
                ☀️ 모닝 브리핑 받기
              </button>
            </div>
          </header>

          {/* 본문 컨테이너 */}
          <main className="max-w-4xl w-full mx-auto px-8 py-8 flex flex-col gap-6">
            {/* 상태 안내 메시지 */}
            {(isProcessing || statusBanner) && (
              <div className="px-4 py-3 rounded-xl bg-[#111827] text-[#FFFFFF] flex items-center justify-between text-sm font-medium">
                <div className="flex items-center gap-2.5">
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>{statusBanner}</span>
                </div>
                {!isProcessing && (
                  <button
                    onClick={() => setStatusBanner('')}
                    className="text-xs underline opacity-80 hover:opacity-100 cursor-pointer"
                  >
                    닫기
                  </button>
                )}
              </div>
            )}

            {/* 녹음 진행 중 배너 */}
            {isRecording && (
              <div className="p-6 rounded-2xl border border-[#DC2626] bg-[#FEF2F2]">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DC2626] text-[#FFFFFF] text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-ping" />
                      녹음 중
                    </span>
                    <span className="text-2xl font-bold font-medium tabular-nums text-[#111827]">
                      {formatDuration(recordingSeconds)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleStopRecord}
                      className="px-5 py-2.5 rounded-xl bg-[#111827] text-[#FFFFFF] text-sm font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      녹음 완료 및 요약 저장
                    </button>
                    <button
                      onClick={handleForceStop}
                      className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] text-sm font-semibold cursor-pointer"
                    >
                      취소
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#FECACA] text-[15.5px] text-[#1E293B] min-h-[64px] leading-7">
                  {transcriptLive || '말씀하시면 실시간으로 받아쓰기가 표시됩니다...'}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* 메뉴 1: 📝 내 노트 (깔끔한 단일 문서 리더) */}
            {/* =============================================================== */}
            {mainViewTab === 'notes' && selectedNote && (
              <section
                ref={detailSectionRef}
                className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-7 lg:p-8 shadow-2xs flex flex-col gap-6"
              >
                {/* 노트 문서 헤더 */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                  <div className="space-y-2 flex-1 min-w-[260px]">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#64748B]">
                      <span
                        className={`px-2.5 py-0.5 rounded-md font-bold ${
                          selectedNoteCoaching
                            ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                            : 'bg-[#F1F5F9] text-[#334155]'
                        }`}
                      >
                        {selectedNoteCoaching ? '🎓 어학 수업 노트' : '📋 회의 · 비즈니스 노트'}
                      </span>
                      <span>{new Date(selectedNote.recordedAt).toLocaleString('ko-KR')}</span>
                      <span>·</span>
                      <span>녹음 길이 {formatDuration(selectedNote.durationSeconds)}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#111827] leading-snug">
                      {selectedNote.title}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {playableAudioUrl && (
                      <button
                        onClick={() => handleDownloadAudioFile(selectedNote)}
                        className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#334155] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        원음 파일(.wav)
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadTranscriptTxt(selectedNote)}
                      className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#334155] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      녹취록(.txt)
                    </button>
                    <button
                      onClick={(e) => handleDeleteNote(selectedNote.id, e)}
                      className="px-3 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FEF2F2] border border-[#E2E8F0] hover:border-[#FECACA] text-[#64748B] hover:text-[#DC2626] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="이 노트 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      삭제
                    </button>
                  </div>
                </div>

                {/* 오디오 재생 바 */}
                {playableAudioUrl && (
                  <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
                      <span className="flex items-center gap-1.5 text-[#111827]">
                        <Volume2 className="w-4 h-4" />
                        녹음 원음 재생 (본문의 시간 버튼을 누르면 해당 위치로 바로 이동합니다)
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatSecToMMSS(currentAudioTime)} / {formatDuration(selectedNote.durationSeconds)}
                      </span>
                    </div>
                    <audio
                      ref={pcAudioRef}
                      key={playableAudioUrl}
                      controls
                      preload="metadata"
                      src={playableAudioUrl}
                      onTimeUpdate={(e) => setCurrentAudioTime(e.currentTarget.currentTime)}
                      className="w-full h-10"
                    />
                  </div>
                )}

                {/* 깔끔한 4대 언더라인 탭 바 */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    {(
                      [
                        { key: 'summary', label: '핵심 요약' },
                        { key: 'transcript', label: '전체 대화 녹취록' },
                        {
                          key: 'coaching',
                          label: `어학 문법 · 표현 코칭${selectedNoteCoaching ? ' ●' : ''}`,
                        },
                        { key: 'action', label: 'AI 변환 · 쉐도잉' },
                      ] as const
                    ).map((t) => {
                      const active =
                        noteDetailTab === t.key || (t.key === 'summary' && noteDetailTab === 'split');
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setNoteDetailTab(t.key)}
                          className={`px-4 py-3 text-[15px] font-bold border-b-2 transition-colors cursor-pointer ${
                            active
                              ? 'border-[#111827] text-[#111827]'
                              : 'border-transparent text-[#64748B] hover:text-[#111827]'
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* 복사 / 다시 요약 보조 버튼 */}
                  {(noteDetailTab === 'summary' || noteDetailTab === 'split') && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReanalyzeNote(selectedNote)}
                        disabled={isProcessing}
                        className="text-xs font-semibold text-[#64748B] hover:text-[#111827] flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                        다시 요약
                      </button>
                      <button
                        onClick={() =>
                          handleCopyText(
                            selectedNote.structuredSummary ||
                              (selectedNote.summary || []).join('\n'),
                            'summary'
                          )
                        }
                        className="text-xs font-semibold text-[#64748B] hover:text-[#111827] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedType === 'summary' ? '복사됨' : '요약 복사'}
                      </button>
                    </div>
                  )}

                  {noteDetailTab === 'transcript' && (
                    <button
                      onClick={() => handleCopyText(cleanSelectedTranscript, 'transcript')}
                      className="text-xs font-semibold text-[#64748B] hover:text-[#111827] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedType === 'transcript' ? '복사됨' : '녹취록 전체 복사'}
                    </button>
                  )}
                </div>

                {/* 탭 1: 핵심 요약 */}
                {(noteDetailTab === 'summary' || noteDetailTab === 'split') && (
                  <div className="pt-1">
                    {renderInteractiveStructuredSummary(
                      selectedNote,
                      handleSeekAudio,
                      setStatusBanner
                    )}
                  </div>
                )}

                {/* 탭 2: 전체 대화 녹취록 */}
                {noteDetailTab === 'transcript' && (
                  <div className="pt-1">
                    <InteractiveTranscriptView
                      transcript={cleanSelectedTranscript}
                      currentAudioTime={currentAudioTime}
                      hasPlayableAudio={Boolean(playableAudioUrl)}
                      onSeekAudio={handleSeekAudio}
                      onStatus={setStatusBanner}
                    />
                  </div>
                )}

                {/* 탭 3: 어학 문법 · 표현 코칭 (전 세계 모든 언어 AI 코칭 지원) */}
                {noteDetailTab === 'coaching' && (
                  <div className="pt-1">
                    <LanguageStudyCoachingPanel
                      note={selectedNote}
                      onSeekAudio={handleSeekAudio}
                      onStatus={setStatusBanner}
                      forceShow={true}
                    />
                  </div>
                )}

                {/* 탭 4: AI 변환 & 원어민 쉐도잉 */}
                {noteDetailTab === 'action' && (
                  <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-[#111827]">
                          이 노트를 다른 문서로 변환하기
                        </h4>
                        <p className="text-sm text-[#64748B] mt-0.5">
                          버튼을 누르면 쇼츠 대본, 3회독 복습장, 기획 보고서, 카톡 공유 메시지로 자동 작성됩니다.
                        </p>
                      </div>

                      <button
                        onClick={() => handleToggleShadowing(selectedNote)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isShadowing
                            ? 'bg-[#DC2626] text-[#FFFFFF]'
                            : 'bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#111827] text-[#111827]'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>
                          {isShadowing ? '⏹️ 원어민 발음 중지' : '🔊 외국어 문장 연속 발음 듣기'}
                        </span>
                      </button>
                    </div>

                    {isShadowing && shadowingSentence && (
                      <div className="px-4 py-3 rounded-xl bg-[#111827] text-[#FFFFFF] text-sm font-medium flex items-center justify-between">
                        <span>🎧 발음 재생 중: &ldquo;{shadowingSentence}&rdquo;</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <button
                        onClick={() => handleVoiceToAction(selectedNote, 'shorts_script')}
                        disabled={isProcessing}
                        className="px-4 py-3 rounded-xl bg-[#111827] hover:bg-[#334155] text-[#FFFFFF] text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        🎬 유튜브 쇼츠 대본
                      </button>
                      <button
                        onClick={() => handleVoiceToAction(selectedNote, 'language_review')}
                        disabled={isProcessing}
                        className="px-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#111827] text-[#111827] text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        📚 3회독 복습 카드
                      </button>
                      <button
                        onClick={() => handleVoiceToAction(selectedNote, 'biz_plan')}
                        disabled={isProcessing}
                        className="px-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#111827] text-[#111827] text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        📋 사업계획 · 보고서
                      </button>
                      <button
                        onClick={() => handleVoiceToAction(selectedNote, 'share_message')}
                        disabled={isProcessing}
                        className="px-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#111827] text-[#111827] text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        💬 카톡 · 이메일 초안
                      </button>
                    </div>

                    {selectedNote.actionOutputs &&
                      Object.keys(selectedNote.actionOutputs).length > 0 && (
                        <div className="mt-1 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] p-5">
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F1F5F9]">
                            <div className="flex flex-wrap items-center gap-2">
                              {Object.entries(selectedNote.actionOutputs).map(([k, v]) => (
                                <button
                                  key={k}
                                  onClick={() => setActiveActionType(k as any)}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                                    activeActionType === k
                                      ? 'bg-[#111827] text-[#FFFFFF]'
                                      : 'bg-[#F1F5F9] text-[#475569]'
                                  }`}
                                >
                                  {v.label}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() =>
                                handleCopyText(
                                  (
                                    selectedNote.actionOutputs?.[activeActionType] ||
                                    Object.values(selectedNote.actionOutputs || {})[0]
                                  )?.content || '',
                                  'action'
                                )
                              }
                              className="text-xs font-bold text-[#111827] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              {copiedType === 'action' ? '복사됨' : '결과 복사'}
                            </button>
                          </div>
                          <div className="text-[15px] text-[#1E293B] whitespace-pre-wrap leading-7 max-h-96 overflow-y-auto">
                            {
                              (
                                selectedNote.actionOutputs[activeActionType] ||
                                Object.values(selectedNote.actionOutputs)[0]
                              )?.content
                            }
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </section>
            )}

            {/* =============================================================== */}
            {/* 메뉴 2: 🎓 4개국어 단어장 · 수업 준비 */}
            {/* =============================================================== */}
            {mainViewTab === 'coaching' && (
              <div className="flex flex-col gap-6">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#111827]">
                      수업별 1:1 문법 교정 · 더 좋은 대답/질문 · 실전 시나리오 ({languageStudyNotes.length}건)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMainViewTab('notes');
                        setNoteDetailTab('coaching');
                      }}
                      className="text-xs font-bold text-[#1D4ED8] hover:underline cursor-pointer"
                    >
                      노트 원음과 함께 보기 →
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {languageStudyNotes.map((ln) => {
                      const active = selectedNote?.id === ln.id;
                      return (
                        <button
                          key={ln.id}
                          type="button"
                          onClick={() => setSelectedNote(ln)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#111827] text-[#FFFFFF]'
                              : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] hover:border-[#111827]'
                          }`}
                        >
                          {ln.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedNote && (
                  <LanguageStudyCoachingPanel
                    note={selectedNote}
                    onSeekAudio={(sec, label) => handleSelectNoteAndSeek(selectedNote.id, sec, label)}
                    onStatus={setStatusBanner}
                  />
                )}

                <ExpansionCommandHub
                  notes={notes}
                  selectedNote={selectedNote}
                  isProcessing={isProcessing}
                  onSelectNoteAndSeek={handleSelectNoteAndSeek}
                  onDispatchAgentTask={handleDispatchAgentTask}
                  onStatus={setStatusBanner}
                  initialTab="vocab"
                />
              </div>
            )}

            {/* =============================================================== */}
            {/* 메뉴 3: 🧠 AI 비서 · 일정 · 프로젝트 */}
            {/* =============================================================== */}
            {(mainViewTab === 'ask' ||
              mainViewTab === 'schedule' ||
              mainViewTab === 'agents_crm') && (
              <div className="flex flex-col gap-6">
                {/* 1. 전체 노트 통합 질문 (Ask My SecondBrain) */}
                <section className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-[#111827]">
                        🧠 전체 노트에 질문하기 (AI 비서)
                      </h3>
                      <p className="text-sm text-[#64748B] mt-0.5">
                        저장된 회의록과 수업 노트를 한꺼번에 검색해 핵심 내용과 근거 노트를 찾아줍니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <input
                      type="text"
                      value={askQuery}
                      onChange={(e) => setAskQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAskSecondBrain();
                      }}
                      placeholder="예: 화천퍼스트 AIDC 회의 핵심 요약 알려줘 / 외국어 수업에서 교정받은 표현 정리해줘"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#111827] placeholder-[#94A3B8] focus:outline-none focus:border-[#111827]"
                    />
                    <button
                      onClick={() => handleAskSecondBrain()}
                      disabled={isAsking}
                      className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-[#334155] text-[#FFFFFF] text-sm font-bold shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isAsking ? '검색 중...' : '질문하기'}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#64748B]">자주 찾는 질문:</span>
                    <button
                      onClick={() =>
                        handleAskSecondBrain('화천퍼스트 AIDC 회의 핵심 요약과 결정 사항 알려줘')
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#111827] text-xs font-semibold text-[#334155] cursor-pointer"
                    >
                      ⚡ 화천퍼스트 · AIDC 핵심 요약
                    </button>
                    <button
                      onClick={() =>
                        handleAskSecondBrain(
                          '내가 외국어 수업에서 교정받은 표현 정리해줘'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#111827] text-xs font-semibold text-[#334155] cursor-pointer"
                    >
                      🌐 다국어 교정 표현 모음
                    </button>
                    <button
                      onClick={() =>
                        handleAskSecondBrain('전체 회의록에서 앞으로 해야 할 일과 액션 아이템 정리해줘')
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#111827] text-xs font-semibold text-[#334155] cursor-pointer"
                    >
                      ✅ 미완료 할 일 · 액션 아이템
                    </button>
                  </div>

                  {askReply && (
                    <div className="mt-1 p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                        <span className="text-xs font-bold text-[#111827]">AI 비서 답변</span>
                        <button
                          onClick={() => setAskReply('')}
                          className="text-xs font-semibold text-[#64748B] hover:text-[#111827] underline cursor-pointer"
                        >
                          닫기
                        </button>
                      </div>
                      <div className="text-[15px] text-[#1E293B] whitespace-pre-wrap leading-7 max-h-96 overflow-y-auto">
                        {askReply}
                      </div>
                      {askCitations.length > 0 && (
                        <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-[#64748B]">관련 노트:</span>
                          {askCitations.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => {
                                const found = notes.find((n) => n.id === c.id);
                                if (found) {
                                  setSelectedNote(found);
                                  setMainViewTab('notes');
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#111827] text-[#111827] text-xs font-semibold cursor-pointer"
                            >
                              📌 {c.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* 2. 예정된 회의 & 4개국어 수업 브리핑 */}
                <ScheduledMeetingsSection
                  notes={notes}
                  onSelectNote={(n) => {
                    setSelectedNote(n);
                    setMainViewTab('notes');
                  }}
                  onStartRecordForSchedule={() => handleStartPhoneRecord()}
                  onStatus={setStatusBanner}
                />

                {/* 3. AI 에이전트 작업 발주 & 프로젝트 CRM 보드 */}
                <ExpansionCommandHub
                  notes={notes}
                  selectedNote={selectedNote}
                  isProcessing={isProcessing}
                  onSelectNoteAndSeek={handleSelectNoteAndSeek}
                  onDispatchAgentTask={handleDispatchAgentTask}
                  onStatus={setStatusBanner}
                  initialTab="agents"
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. 「새 노트」 바텀시트 / 모달 (별도 기기 없이 휴대폰으로만 녹음 · 회의록 & 다국어 공부) */}
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
            <div className="relative flex items-center justify-center pb-4 mb-3 border-b border-[#F0F0F4]">
              <h3 className="text-base font-bold text-[#111111]">
                휴대폰 녹음 · 회의록 정리 &amp; 외국어 공부
              </h3>
              <button
                onClick={() => setNewNoteSheetOpen(false)}
                className="absolute right-0 p-1.5 rounded-full hover:bg-[#F3F3F6] text-[#555555] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 🌐 녹음·전사 언어 설정 (어느 언어든 제한 없이 지원!) */}
            <div className="p-3.5 mb-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#111827]">
                  🌐 회의록 / 외국어 공부 언어 선택 (모든 언어 지원)
                </span>
                <span className="text-[11px] font-bold text-[#6B21A8]">NoteHelper AI</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={recordingLang}
                  onChange={(e) => setRecordingLang(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-bold text-[#111827]"
                >
                  <option value="auto">🌐 자동 감지 (한국어 회의록 + 모든 외국어 수업)</option>
                  <option value="ko">🇰🇷 한국어 비즈니스 회의록 (Korean)</option>
                  {GLOBAL_COACHING_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.label} 회화 공부
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={customRecLang}
                onChange={(e) => setCustomRecLang(e.target.value)}
                placeholder="기타 외국어 직접 입력 (예: 몽골어, 우즈베크어, 스웨덴어, 히브리어...)"
                className="w-full px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-medium text-[#111827]"
              />
            </div>

            {/* 안드로이드 휴대폰 전용 실행 항목 (실시간 녹음 / 갤럭시 기본 녹음기 / 통화·음성 파일 불러오기) */}
            <div className="flex flex-col gap-2 py-1">
              <button
                onClick={handleStartPhoneRecord}
                className="w-full px-4 py-4 rounded-2xl bg-[#111827] hover:bg-[#1E293B] text-[#FFFFFF] flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <Mic className="w-5 h-5 text-[#FFFFFF] shrink-0" />
                  <div>
                    <div className="text-[15.5px] font-bold text-[#FFFFFF]">
                      안드로이드 마이크로 바로 녹음 시작
                    </div>
                    <div className="text-[11.5px] text-[#CBD5E1] mt-0.5">
                      Gemini · Claude 실시간 전사 · 회의록 요약 · 외국어 교정
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#FFFFFF]/15 text-[11px] font-bold text-[#FFFFFF] shrink-0">
                  즉시 녹음
                </span>
              </button>

              <button
                onClick={() => {
                  setNewNoteSheetOpen(false);
                  nativeMicInputRef.current?.click();
                }}
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <Smartphone className="w-5 h-5 text-[#047857] shrink-0" />
                  <div>
                    <div className="text-[14.5px] font-bold text-[#111827]">
                      갤럭시 · 안드로이드 기본 음성녹음기 실행
                    </div>
                    <div className="text-[11.5px] text-[#64748B] mt-0.5">
                      휴대폰 순정 녹음기로 장시간 녹음 완료 즉시 AI 자동 요약
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#047857] shrink-0">순정 녹음</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <Upload className="w-5 h-5 text-[#111827] shrink-0" />
                  <div>
                    <div className="text-[14.5px] font-bold text-[#111827]">
                      갤럭시 통화녹음 · 저장된 음성 파일 불러오기
                    </div>
                    <div className="text-[11.5px] text-[#64748B] mt-0.5">
                      안드로이드 녹음 파일 완벽 지원 (.m4a · .3ga · .amr · .mp3 · .wav)
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. 「🤖 안드로이드(갤럭시) 전용 앱 설치 & Gemini·Claude AI 연동」 모달 */}
      {/* ===================================================================== */}
      {appInstallModalOpen && (
        <div
          onClick={() => setAppInstallModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 flex items-end lg:items-center justify-center animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full lg:max-w-lg bg-[#FFFFFF] text-[#111827] rounded-t-3xl lg:rounded-3xl p-6 shadow-2xl border border-[#E2E8F0] flex flex-col gap-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#047857]" />
                <h3 className="text-base font-extrabold text-[#111827]">
                  🤖 NoteHelper 안드로이드(Android) 전용 앱 &amp; AI 연동
                </h3>
              </div>
              <button
                onClick={() => setAppInstallModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs text-[#334155]">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#111827]">
                  ⚡ Google Gemini &amp; Anthropic Claude 직결 엔진
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] font-bold">
                  ● Android 전용 가동 중
                </span>
              </div>
              <p className="leading-relaxed">
                • <strong>비즈니스 회의록 자동 정리</strong>: 갤럭시 마이크로 실시간 녹음하거나 <strong>갤럭시 통화녹음(.m4a)</strong> 파일을 불러오면 전체 대화 전사부터 핵심 요약, 주요 결정 사항, 할 일(Action Items), 카톡·이메일 공유 초안까지 자동으로 완성합니다.
              </p>
              <p className="leading-relaxed">
                • <strong>전 세계 모든 외국어 공부 도우미</strong>: 영어·중국어·일본어·스페인어·프랑스어·독일어·베트남어 등 어떤 외국어든 <strong>내가 틀린 문법 교정, 더 좋은 원어민 대답/질문, 실전 롤플레이 시나리오, 원어민 발음 쉐도잉</strong>을 생성합니다.
              </p>
            </div>

            {deferredPwaPrompt ? (
              <button
                type="button"
                onClick={async () => {
                  try {
                    deferredPwaPrompt.prompt();
                    await deferredPwaPrompt.userChoice;
                    setDeferredPwaPrompt(null);
                  } catch {}
                }}
                className="w-full py-4 px-4 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-[#FFFFFF] text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>📲 NoteHelper 안드로이드 전용 앱 지금 바로 설치하기</span>
              </button>
            ) : (
              <a
                href="intent://secondbrain-note.vercel.app/notehelper#Intent;scheme=https;package=com.android.chrome;end"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-[#FFFFFF] text-sm font-extrabold flex items-center justify-center gap-2 shadow-md text-center"
              >
                <Download className="w-4 h-4" />
                <span>🤖 갤럭시 Chrome으로 열어서 전용 앱 설치하기</span>
              </a>
            )}

            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#10B981]/40 space-y-2 text-xs">
              <div className="font-extrabold text-[#065F46] text-sm">
                📲 갤럭시 바탕화면에 NoteHelper 전용 앱 다운받는 3초 순서
              </div>
              <p className="text-[#064E3B] leading-relaxed font-medium">
                1️⃣ 위 초록색 <strong>[갤럭시 Chrome으로 열어서 전용 앱 설치하기]</strong> 버튼을 누르거나 Chrome에서 접속합니다.<br />
                2️⃣ Chrome 화면 <strong>우측 맨 위 점 3개 [⋮] 버튼</strong>을 터치합니다.<br />
                3️⃣ 메뉴에서 <strong>[앱 설치]</strong> 또는 <strong>[홈 화면에 추가]</strong> ➔ <strong>[설치]</strong>를 누르면 갤럭시 앱 서랍과 바탕화면에 <strong>NoteHelper 전용 어플</strong>이 즉시 다운로드·설치됩니다!
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => {
                  setAppInstallModalOpen(false);
                  setNewNoteSheetOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#111827] text-[#FFFFFF] text-xs font-bold cursor-pointer"
              >
                🎙️ 바로 안드로이드 AI 녹음 시작하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
