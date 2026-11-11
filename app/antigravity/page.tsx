'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Volume2,
  VolumeX,
  Download,
  Terminal,
  Zap,
  Globe,
  FileText,
  Layers,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  Smartphone,
  Radio,
  Compass,
  TrendingUp,
  Newspaper,
  Video,
  Users,
  BookmarkPlus,
  Search,
  BookOpen,
  X,
  Copy,
  Check,
  Folder,
  ArrowRight,
} from 'lucide-react';

interface VaultDocItem {
  id: string;
  filename: string;
  title: string;
  category: string;
  subCategory?: string;
  date: string;
  mtime: number;
  length: number;
  tags: string[];
  preview: string;
  content?: string;
}

interface SharedArrival {
  text: string;
  title?: string;
  status: 'processing' | 'success' | 'error';
  message: string;
  url?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  tag?: string;
  citations?: Array<{ id: string; title: string; date: string; category: string }>;
  executedBy?: string;
}

interface CommandItem {
  id: string;
  action: string;
  prompt: string;
  status: 'queued' | 'running' | 'completed' | 'error';
  result?: string;
  createdAt: string;
  completedAt?: string;
  executedBy?: string;
}

interface PcStatus {
  online: boolean;
  lastHeartbeat: string;
  tunnelUrl?: string;
  hostname: string;
  activeDaemons: string[];
  skillsCount: number;
  vaultDocsCount: number;
  notesCount?: number;
}

const QUICK_ACTIONS = [
  {
    id: 'status',
    title: '실시간 전사 관제',
    subtitle: '7대 사업 트랙 & 6대 데몬 상태',
    icon: Cpu,
    badge: 'LIVE',
  },
  {
    id: 'patrol',
    title: '24/7 쇼룸 딥 순찰',
    subtitle: '5대 Helper 재고·누끼·DOM 점검',
    icon: ShieldCheck,
    badge: 'AUTO-HEAL',
  },
  {
    id: 'daily_paper',
    title: '오늘의 CEO 신문',
    subtitle: '핵심 브리핑 & 외국어 3회독 복습',
    icon: Newspaper,
    badge: 'BRIEFING',
  },
  {
    id: 'incubate',
    title: '신사업 6챕터 기획',
    subtitle: 'YC gstack 규격 즉시 인큐베이팅',
    icon: Compass,
    badge: 'STRATEGY',
    needsTopic: true,
    placeholder: '기획할 신사업 아이디어나 주제를 입력하세요',
  },
  {
    id: 'pricing',
    title: '세일·환율 레이더',
    subtitle: '미국 백화점 기습 세일 & 아비트라지',
    icon: TrendingUp,
    badge: 'ARBITRAGE',
  },
  {
    id: 'youtube',
    title: '4대 유튜브 큐 관리',
    subtitle: 'JinaWorld & 3대 외국어 5일 버퍼',
    icon: Video,
    badge: 'MEDIA OPS',
  },
  {
    id: 'marketing',
    title: 'AI 마케팅 본부 소집',
    subtitle: '아테나·그로스·뮤즈·헤라 4인 회의',
    icon: Users,
    badge: '0원 마케팅',
    needsTopic: true,
    placeholder: '마케팅 집중 안건 (예: StayHelper VIP 전환율)',
  },
  {
    id: 'reddit',
    title: '레딧 글로벌 바이럴',
    subtitle: '영문 커뮤니티 네이티브 칼럼 초안',
    icon: Globe,
    badge: 'GLOBAL',
    needsTopic: true,
    placeholder: '바이럴 테마 (예: Longevity & Quiet Luxury)',
  },
];

const SUGGESTED_PROMPTS = [
  '오늘 전사 7대 사업 핵심 체크포인트 브리핑해줘',
  '샘컴·퀀텀테크놀로지 딥테크 최근 회의 내용 정리해줘',
  '화천퍼스트 연합 AIDC 전력 M&A 핵심 현황 요약해줘',
  '최근 외국어 회화 수업 교정 표현 3회독 복습 카드 보여줘',
];

export default function AntigravityMobilePage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'vault' | 'deck' | 'bridge' | 'apk'>('chat');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [commandQueue, setCommandQueue] = useState<CommandItem[]>([]);
  const [pcStatus, setPcStatus] = useState<PcStatus>({
    online: true,
    lastHeartbeat: new Date().toISOString(),
    hostname: 'LAPTOP-BLLUP729',
    activeDaemons: [
      'hermes_master_pipeline (전사 마스터 데몬)',
      'patrol_daemon (24/7 5대 쇼룸 순찰)',
      'auto_drain_daemon (3대 외국어 유튜브 큐)',
      'ollama_serve (로컬 Qwen 2.5 AI 엔진)',
      'secondbrain_cloud_sync (옵시디언 볼트 동기화)',
      'antigravity_mobile_daemon (모바일 전용 브릿지)',
    ],
    skillsCount: 587,
    vaultDocsCount: 214,
    notesCount: 24,
  });

  const [inputText, setInputText] = useState('');
  const [dispatchToPc, setDispatchToPc] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [quickMemoText, setQuickMemoText] = useState('');
  const [memoSavedToast, setMemoSavedToast] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. 스마트폰 '공유하기(Share Target)' 실시간 수신 상태
  const [sharedArrival, setSharedArrival] = useState<SharedArrival | null>(null);

  // 2. 세컨브레인 Vault 전용 모바일 스포트라이트 상태
  const [vaultDocs, setVaultDocs] = useState<VaultDocItem[]>([]);
  const [vaultTotal, setVaultTotal] = useState(165);
  const [vaultQuery, setVaultQuery] = useState('');
  const [vaultCategory, setVaultCategory] = useState<string>('전체');
  const [isVaultLoading, setIsVaultLoading] = useState(false);
  const [selectedVaultDoc, setSelectedVaultDoc] = useState<VaultDocItem | null>(null);
  const [isReadingFullDoc, setIsReadingFullDoc] = useState(false);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);

  // 1-1. 스마트폰 공유 수신 처리 핸들러 (Web Share Target & Android Intent)
  const handleIncomingShare = async (sharedRaw: string, sharedTitle?: string) => {
    if (!sharedRaw) return;
    setSharedArrival({
      text: sharedRaw,
      title: sharedTitle || '스마트폰 공유 콘텐츠',
      status: 'processing',
      message: '스마트폰에서 공유된 기사/링크를 감지하여 00_Inbox에 자동 스크랩 및 편철 중입니다...',
    });

    try {
      const res = await fetch('/api/antigravity/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sharedRaw,
          url: sharedRaw,
          title: sharedTitle || '',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSharedArrival({
          text: sharedRaw,
          title: sharedTitle || '기사 자동 스크랩 완료',
          status: 'success',
          message: data.message || '기사가 성공적으로 스크랩되어 세컨브레인 00_Inbox에 영구 보관되었습니다.',
          url: data.url,
        });

        // 챗 히스토리에 수신 보고 추가
        const newMsg: ChatMessage = {
          id: `share-${Date.now()}`,
          role: 'assistant',
          text: `📥 **[스마트폰 공유 기사 즉시 저장 완료]**\n\n${data.message || '공유해주신 기사 내용이 세컨브레인 Vault 00_Inbox에 성공적으로 스크랩 편철되었습니다.'}`,
          timestamp: new Date().toISOString(),
          tag: 'SMARTPHONE SHARE TARGET',
          executedBy: 'Antigravity Share Engine',
        };
        setChatHistory((prev) => [...prev, newMsg]);
        fetchVaultDocs(vaultQuery, vaultCategory);
      } else {
        setSharedArrival({
          text: sharedRaw,
          status: 'error',
          message: data.error || '공유 처리 중 오류가 발생했습니다.',
        });
      }
    } catch (e: any) {
      setSharedArrival({
        text: sharedRaw,
        status: 'error',
        message: e.message || '네트워크 통신 중 오류가 발생했습니다.',
      });
    }
  };

  // 2-1. 세컨브레인 문서 검색 및 로드 핸들러
  const fetchVaultDocs = async (query = '', cat = '전체') => {
    setIsVaultLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (cat && cat !== '전체') params.set('category', cat);
      const res = await fetch(`/api/antigravity/vault?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVaultDocs(data.docs || []);
        if (data.total) setVaultTotal(data.total);
      }
    } catch (e) {
      console.error('Failed to fetch vault docs:', e);
    } finally {
      setIsVaultLoading(false);
    }
  };

  // 2-2. 문서 상세 열기 (모바일 인스턴트 리더기)
  const openDocReader = async (doc: VaultDocItem) => {
    setSelectedVaultDoc(doc);
    setIsReadingFullDoc(true);
    try {
      const res = await fetch(`/api/antigravity/vault?doc_id=${encodeURIComponent(doc.id)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.doc) {
          setSelectedVaultDoc(data.doc);
        }
      }
    } catch {}
  };

  // 2-3. 이 문서 관련 AI 비서에게 질문하기
  const askAiAboutDoc = (doc: VaultDocItem) => {
    setIsReadingFullDoc(false);
    setActiveTab('chat');
    setInputText(`[${doc.title}] 문서 내용 요약하고 앞으로의 사업 실행 전략 3가지 알려줘`);
  };

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

  const fetchBridgeData = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const res = await fetch('/api/antigravity', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.chatHistory) && data.chatHistory.length > 0) {
          setChatHistory(data.chatHistory);
        }
        if (Array.isArray(data.commandQueue)) {
          setCommandQueue(data.commandQueue);
        }
        if (data.pcStatus) {
          setPcStatus((prev) => ({ ...prev, ...data.pcStatus }));
        }
      }
    } catch {
      // ignore network jitter
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => {
          for (const reg of regs) {
            if (reg.active?.scriptURL?.includes('secondbrain')) {
              reg.unregister().catch(() => {});
            }
          }
        })
        .catch(() => {});
    }
    fetchBridgeData();
    fetchVaultDocs();

    // 스마트폰 공유하기(Web Share Target & Android Intent) 파라미터 감지
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get('shared_text') || params.get('url') || params.get('text');
      const title = params.get('shared_title') || params.get('title') || '';
      if (shared) {
        handleIncomingShare(shared, title);
        window.history.replaceState({}, '', '/antigravity');
      }
    }

    const timer = setInterval(() => {
      fetchBridgeData(true);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory.length, activeTab]);

  const toggleVoiceInput = async () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      recognitionRef.current = null;

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        await new Promise<void>((resolve) => {
          if (!mediaRecorderRef.current) return resolve();
          mediaRecorderRef.current.onstop = () => resolve();
          try {
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
      setIsListening(false);

      if (mediaChunksRef.current.length > 0) {
        const mime = mediaChunksRef.current[0]?.type || 'audio/webm';
        const blob = new Blob(mediaChunksRef.current, { type: mime });
        mediaChunksRef.current = [];
        try {
          const wavDataUrl = await encodeBlobToWav16k(blob);
          if (wavDataUrl) {
            const res = await fetch('/api/secondbrain/process-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: '',
                duration: 5,
                audioBase64: wavDataUrl,
                mimeType: 'audio/wav',
                targetLang: 'ko',
              }),
            });
            const data = await res.json();
            const sttText = (data?.analysis?.refinedTranscript || data?.rawTranscript || '')
              .replace(/^Speaker\s+\d+\s*:\s*/gim, '')
              .trim();
            if (sttText && !sttText.includes('무음')) {
              setInputText((prev) => (prev ? `${prev} ${sttText}` : sttText));
            }
          }
        } catch {}
      }
      return;
    }

    mediaChunksRef.current = [];
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const preferredTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
        let chosenMime = '';
        if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
          for (const t of preferredTypes) {
            if (MediaRecorder.isTypeSupported(t)) {
              chosenMime = t;
              break;
            }
          }
        }
        const mr = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);
        mr.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) {
            mediaChunksRef.current.push(ev.data);
          }
        };
        mr.start(300);
        mediaRecorderRef.current = mr;
        setIsListening(true);
        return;
      }
    } catch {}

    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      alert('마이크 접근 권한을 허용해 주시거나 키보드 마이크 버튼을 사용해 주세요.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const toggleSpeakMessage = (msg: ChatMessage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingMsgId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = msg.text
      .replace(/\*\*/g, '')
      .replace(/[#*`•]/g, '')
      .slice(0, 1200);
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'ko-KR';
    utter.rate = 1.05;
    utter.onend = () => setSpeakingMsgId(null);
    utter.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msg.id);
    window.speechSynthesis.speak(utter);
  };

  const handleSendChat = async (overrideQuery?: string) => {
    const q = (overrideQuery ?? inputText).trim();
    if (!q || isLoading) return;
    if (!overrideQuery) setInputText('');
    setIsLoading(true);
    setActiveTab('chat');

    const optimisticUser: ChatMessage = {
      id: `temp-u-${Date.now()}`,
      role: 'user',
      text: q,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, optimisticUser]);

    try {
      const res = await fetch('/api/antigravity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          query: q,
          dispatchToPc,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.chatHistory)) {
        setChatHistory(data.chatHistory);
      }
      if (Array.isArray(data.commandQueue)) {
        setCommandQueue(data.commandQueue);
      }
    } catch (e: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: `연결 상태를 확인 중입니다. 잠시 후 다시 시도해 주십시오. (${e?.message || 'Network notice'})`,
          timestamp: new Date().toISOString(),
          tag: 'NOTICE',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteQuickAction = async (actionId: string, topicStr = '') => {
    if (isLoading) return;
    setIsLoading(true);
    setSelectedActionId(null);
    setCustomTopic('');
    setActiveTab('chat');

    const optimisticUser: ChatMessage = {
      id: `temp-act-${Date.now()}`,
      role: 'user',
      text: topicStr ? `⚡ [원터치 실행: ${actionId}] ${topicStr}` : `⚡ [원터치 실행: ${actionId}]`,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, optimisticUser]);

    try {
      const res = await fetch('/api/antigravity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'quick_action',
          action: actionId,
          topic: topicStr,
          dispatchToPc,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.chatHistory)) {
        setChatHistory(data.chatHistory);
      }
      if (Array.isArray(data.commandQueue)) {
        setCommandQueue(data.commandQueue);
      }
    } catch {
      // handled gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuickMemo = async () => {
    const t = quickMemoText.trim();
    if (!t || isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/antigravity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'memo', text: t }),
      });
      const data = await res.json();
      if (data.success) {
        setQuickMemoText('');
        setMemoSavedToast('✅ Antigravity 전용 보관함 및 옵시디언 00_Inbox에 즉시 저장되었습니다.');
        if (Array.isArray(data.chatHistory)) {
          setChatHistory(data.chatHistory);
        }
        setTimeout(() => setMemoSavedToast(''), 4000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    const res = await fetch('/api/antigravity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'clear_chat' }),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.chatHistory)) setChatHistory(data.chatHistory);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-[#0B0F17] text-slate-100 overflow-hidden border-x border-slate-800/60 shadow-2xl">
      {/* Top Luxury Executive Header */}
      <header className="shrink-0 px-4 pt-3 pb-2.5 bg-[#0F141C]/95 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5BE64] to-[#B68D38] flex items-center justify-center shadow-lg shadow-[#E5BE64]/15">
            <Sparkles className="w-5 h-5 text-[#0B0F17]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight text-white">ANTIGRAVITY</h1>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#E5BE64]/15 text-[#E5BE64] border border-[#E5BE64]/30">
                &amp; HANA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {pcStatus.hostname} 직결 · {pcStatus.skillsCount || 587} 스킬 가동
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fetchBridgeData(false)}
            className="p-2 rounded-lg bg-[#18202E] hover:bg-slate-800 border border-slate-700/70 text-slate-300 transition"
            title="실시간 동기화"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#E5BE64]' : ''}`} />
          </button>
          <a
            href="/antigravity-hana.apk"
            download="Antigravity_Hana.apk"
            className="px-2.5 py-1.5 rounded-lg bg-[#E5BE64]/15 hover:bg-[#E5BE64]/25 border border-[#E5BE64]/40 text-[#E5BE64] text-xs font-semibold flex items-center gap-1 transition"
          >
            <Download className="w-3.5 h-3.5" />
            APK
          </a>
        </div>
      </header>

      {/* Smart Share Target Floating Arrival Banner */}
      {sharedArrival && (
        <div className="shrink-0 mx-3 mt-2 p-3 rounded-2xl bg-[#18202E] border border-[#E5BE64]/60 shadow-2xl flex flex-col gap-1.5 animate-fadeIn z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {sharedArrival.status === 'processing' ? (
                <RefreshCw className="w-4 h-4 text-[#E5BE64] animate-spin shrink-0" />
              ) : sharedArrival.status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Terminal className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className="text-xs font-bold text-[#E5BE64]">
                {sharedArrival.title || '스마트폰 공유 기사 수신'}
              </span>
            </div>
            <button
              onClick={() => setSharedArrival(null)}
              className="text-slate-400 hover:text-slate-200 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed break-all">
            {sharedArrival.message}
          </p>
          {sharedArrival.status === 'success' && (
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => {
                  setActiveTab('vault');
                  setVaultCategory('00_Inbox');
                }}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#E5BE64] text-[#0B0F17] hover:bg-[#F3D382] transition cursor-pointer"
              >
                00_Inbox에서 확인하기
              </button>
              <button
                onClick={() => setSharedArrival(null)}
                className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
        {/* TAB 1: COMMAND CHAT */}
        {activeTab === 'chat' && (
          <div className="flex flex-col space-y-3 pb-2">
            {/* PC Remote Execution Toggle Bar */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#18202E]/90 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${dispatchToPc ? 'text-[#E5BE64]' : 'text-slate-400'}`} />
                <span className="text-slate-200 font-medium">
                  외부(LTE/5G) ↔ 내 PC 실시간 브릿지 동기화
                </span>
              </div>
              <button
                onClick={() => setDispatchToPc(!dispatchToPc)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                  dispatchToPc
                    ? 'bg-[#E5BE64] text-[#0B0F17]'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {dispatchToPc ? 'ON (PC 연동)' : '클라우드 단독'}
              </button>
            </div>

            {/* Suggested One-Tap Prompts */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(prompt)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-[#18202E] hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 hover:text-[#E5BE64] transition"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Conversation Stream */}
            <div className="space-y-3">
              {chatHistory.length === 0 && (
                <div className="p-4 rounded-2xl bg-[#18202E]/90 border border-[#E5BE64]/30 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E5BE64]/15 text-[#E5BE64] border border-[#E5BE64]/30">
                      ANTIGRAVITY &amp; HANA READY
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      ● 실시간 브릿지 정상
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    윤종성 대표님, 안티그래비티 &amp; 수석비서 하나 모바일 사령탑입니다. 상단 추천 명령을 터치하시거나 하단 마이크·채팅창으로 무엇이든 지시해 주세요.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setActiveTab('deck')}
                      className="px-3 py-2 rounded-xl bg-[#0B0F17] border border-slate-700/80 text-xs font-semibold text-slate-200 text-center hover:border-[#E5BE64] transition cursor-pointer"
                    >
                      ⚡ 원터치 사령탑 열기
                    </button>
                    <button
                      onClick={() => setActiveTab('apk')}
                      className="px-3 py-2 rounded-xl bg-[#0B0F17] border border-[#E5BE64]/40 text-xs font-semibold text-[#E5BE64] text-center hover:bg-[#E5BE64]/10 transition cursor-pointer"
                    >
                      📥 안티그래비티 APK 설치
                    </button>
                  </div>
                </div>
              )}
              {chatHistory.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-3.5 py-3 text-[13px] leading-relaxed shadow-md ${
                        isUser
                          ? 'bg-gradient-to-br from-[#E5BE64] to-[#C89D42] text-[#0B0F17] font-medium rounded-br-xs'
                          : 'bg-[#18202E]/95 border border-slate-800/90 text-slate-100 rounded-bl-xs'
                      }`}
                    >
                      {!isUser && (
                        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-800/80">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E5BE64]/15 text-[#E5BE64] border border-[#E5BE64]/30">
                              {msg.tag || 'ANTIGRAVITY'}
                            </span>
                            {msg.executedBy && (
                              <span className="text-[10px] text-slate-400 truncate max-w-[160px]">
                                {msg.executedBy}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => toggleSpeakMessage(msg)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-[#E5BE64] transition"
                            title="음성으로 듣기"
                          >
                            {speakingMsgId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-[#E5BE64]" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap break-words">{msg.text}</div>

                      {!isUser && msg.citations && msg.citations.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                          <p className="text-[10px] font-semibold text-[#E5BE64]">
                            📚 참조된 Antigravity 전용 지식 볼트:
                          </p>
                          {msg.citations.map((cit) => (
                            <div
                              key={cit.id}
                              className="text-[11px] text-slate-400 bg-[#0F141C] px-2 py-1 rounded border border-slate-800/70 truncate"
                            >
                              • [{cit.category}] {cit.title} ({cit.date})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#18202E]/90 border border-[#E5BE64]/30 text-xs text-[#E5BE64]">
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>
                    안티그래비티(Antigravity) &amp; 하나가 세컨드브레인과 PC 파이프라인을 실행 중입니다...
                  </span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          </div>
        )}

        {/* TAB 2: SECOND BRAIN VAULT SPOTLIGHT & READER */}
        {activeTab === 'vault' && (
          <div className="space-y-3 pb-4">
            {/* Top Search & Filter Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#18202E] to-[#0F141C] border border-[#E5BE64]/30 space-y-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#E5BE64] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  세컨브레인 Vault 스포트라이트
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5BE64]/20 text-[#E5BE64] border border-[#E5BE64]/30">
                  {vaultTotal}개 전사 문서
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                대표님의 회의록, 딥테크 M&amp;A, 어학 수업, 스크랩 기사를 0.05초 만에 검색하고 읽습니다.
              </p>

              {/* Instant Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={vaultQuery}
                  onChange={(e) => {
                    setVaultQuery(e.target.value);
                    fetchVaultDocs(e.target.value, vaultCategory);
                  }}
                  placeholder="단어 검색 (예: 샘컴, 일진전기, 중국어, 과외, NPU)"
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0B0F17] border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E5BE64]"
                />
                {vaultQuery && (
                  <button
                    onClick={() => {
                      setVaultQuery('');
                      fetchVaultDocs('', vaultCategory);
                    }}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
                {[
                  { id: '전체', label: '전체' },
                  { id: '00_Inbox', label: '📥 00_Inbox' },
                  { id: '01_Projects', label: '💼 사업·M&A' },
                  { id: '02_Areas', label: '🎓 과외·회화' },
                  { id: '03_Resources', label: '🔬 논문·특허' },
                  { id: '05_Daily_Notes', label: '📅 데일리' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setVaultCategory(cat.id);
                      fetchVaultDocs(vaultQuery, cat.id);
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                      vaultCategory === cat.id
                        ? 'bg-[#E5BE64] text-[#0B0F17]'
                        : 'bg-[#0B0F17] text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Count Info Bar */}
            <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
              <span>
                {vaultCategory === '전체' ? '전체 문서' : vaultCategory}: <b>{vaultDocs.length}</b>건 검색됨
              </span>
              <button
                onClick={() => fetchVaultDocs(vaultQuery, vaultCategory)}
                className="flex items-center gap-1 text-[10px] text-[#E5BE64] hover:underline cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isVaultLoading ? 'animate-spin' : ''}`} />
                새로고침
              </button>
            </div>

            {/* Document Cards List */}
            {isVaultLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-[#E5BE64]" />
                <span>문서 인덱스를 검색하고 있습니다...</span>
              </div>
            ) : vaultDocs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                검색된 세컨브레인 문서가 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {vaultDocs.map((doc) => {
                  const getCategoryBadgeClass = (c: string) => {
                    if (c.includes('Inbox')) return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
                    if (c.includes('Projects')) return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
                    if (c.includes('Areas')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                    if (c.includes('Resources')) return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
                    return 'bg-slate-700/30 text-slate-300 border-slate-600/40';
                  };

                  return (
                    <div
                      key={doc.id}
                      onClick={() => openDocReader(doc)}
                      className="p-3.5 rounded-2xl bg-[#18202E]/90 hover:bg-[#1E293B] border border-slate-800 hover:border-[#E5BE64]/50 transition cursor-pointer space-y-2 group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-bold text-slate-100 group-hover:text-[#E5BE64] transition line-clamp-2 leading-snug">
                          {doc.title}
                        </h3>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${getCategoryBadgeClass(
                            doc.category
                          )}`}
                        >
                          {doc.subCategory || doc.category}
                        </span>
                      </div>

                      {doc.preview && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {doc.preview}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {doc.date}
                        </span>
                        <div className="flex items-center gap-1 text-[#E5BE64] group-hover:translate-x-0.5 transition font-semibold">
                          <span>열람하기</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: 11 EXECUTIVE ONE-TOUCH DECK */}
        {activeTab === 'deck' && (
          <div className="space-y-3.5 pb-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#18202E] to-[#0F141C] border border-[#E5BE64]/30">
              <h2 className="text-sm font-bold text-[#E5BE64] flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                원터치 전사 사령탑 (One-Touch Executive Deck)
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                텔레그램 명령어 입력 없이 카드를 터치하면 안티그래비티와 하나가 즉시 실행하여 보고합니다.
              </p>
            </div>

            {selectedActionId && (
              <div className="p-3.5 rounded-2xl bg-[#18202E] border border-[#E5BE64] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E5BE64]">
                    🎯 상세 주제 / 타겟 입력 ({selectedActionId})
                  </span>
                  <button
                    onClick={() => setSelectedActionId(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    닫기
                  </button>
                </div>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder={
                    QUICK_ACTIONS.find((a) => a.id === selectedActionId)?.placeholder ||
                    '주제를 입력하세요 (비워두면 기본 추천 주제로 실행)'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#E5BE64]"
                />
                <button
                  onClick={() => handleExecuteQuickAction(selectedActionId, customTopic)}
                  className="w-full py-2 rounded-xl bg-[#E5BE64] text-[#0B0F17] font-bold text-xs hover:bg-[#d8b052] transition"
                >
                  즉시 실행하기
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.needsTopic) {
                        setSelectedActionId(item.id);
                      } else {
                        handleExecuteQuickAction(item.id);
                      }
                    }}
                    className="flex flex-col items-start p-3.5 rounded-2xl bg-[#18202E]/90 hover:bg-[#1E293B] border border-slate-800 hover:border-[#E5BE64]/50 text-left transition group"
                  >
                    <div className="w-full flex items-center justify-between mb-2">
                      <div className="p-2 rounded-xl bg-[#0F141C] border border-slate-800 text-[#E5BE64] group-hover:scale-105 transition">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#E5BE64]/10 text-[#E5BE64] border border-[#E5BE64]/20">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white group-hover:text-[#E5BE64] transition">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PC BRIDGE & LIVE TASK QUEUE */}
        {activeTab === 'bridge' && (
          <div className="space-y-3.5 pb-4">
            <div className="p-4 rounded-2xl bg-[#18202E] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#E5BE64]" />
                  <h2 className="text-sm font-bold text-white">내 PC 원격 브릿지 관제</h2>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ● ONLINE ({pcStatus.hostname})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#0F141C] border border-slate-800/80">
                  <p className="text-[10px] text-slate-400">활성 스킬</p>
                  <p className="text-sm font-bold text-[#E5BE64] mt-0.5">
                    {pcStatus.skillsCount || 587}개
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0F141C] border border-slate-800/80">
                  <p className="text-[10px] text-slate-400">볼트/노트</p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {pcStatus.vaultDocsCount || 214}문서
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0F141C] border border-slate-800/80">
                  <p className="text-[10px] text-slate-400">무인 데몬</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">6대 가동</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-slate-300">
                  ⚡ 부팅 시 100% 무음 가동 중인 백그라운드 데몬:
                </p>
                {(pcStatus.activeDaemons || []).map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0F141C] border border-slate-800/70 text-[11px]"
                  >
                    <span className="text-slate-300">{d}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Remote Command Queue History */}
            <div className="p-4 rounded-2xl bg-[#18202E] border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#E5BE64] flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  외부(LTE/5G) ➔ 내 PC 원격 작업 실행 큐
                </h3>
                <button
                  onClick={handleClearChat}
                  className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> 대화 초기화
                </button>
              </div>

              {commandQueue.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  현재 대기 중인 원격 작업이 없습니다. 채팅창이나 원터치 사령탑에서 명령을 내리시면 즉시 실행됩니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {commandQueue
                    .slice()
                    .reverse()
                    .slice(0, 8)
                    .map((cmd) => (
                      <div
                        key={cmd.id}
                        className="p-2.5 rounded-xl bg-[#0F141C] border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#E5BE64]">
                            [{cmd.action}] {cmd.prompt}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              cmd.status === 'completed'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-amber-500/15 text-amber-400'
                            }`}
                          >
                            {cmd.status === 'completed' ? '실행 완료' : 'PC 실행 대기'}
                          </span>
                        </div>
                        {cmd.result && (
                          <p className="text-[11px] text-slate-300 line-clamp-3 whitespace-pre-wrap">
                            {cmd.result}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: QUICK MEMO & ANDROID APK INSTALLER */}
        {activeTab === 'apk' && (
          <div className="space-y-3.5 pb-4">
            {/* Quick 1-Second Obsidian Memo */}
            <div className="p-4 rounded-2xl bg-[#18202E] border border-slate-800 space-y-2.5">
              <h2 className="text-sm font-bold text-[#E5BE64] flex items-center gap-1.5">
                <BookmarkPlus className="w-4 h-4" />
                1초 Antigravity &amp; 옵시디언 전용 메모
              </h2>
              <p className="text-xs text-slate-400">
                이동 중 떠오른 아이디어나 지시사항을 적으시면 내 PC 옵시디언 볼트(00_Inbox)와 Antigravity 전용 보관함에 즉시 저장됩니다.
              </p>
              <textarea
                rows={3}
                value={quickMemoText}
                onChange={(e) => setQuickMemoText(e.target.value)}
                placeholder="메모할 내용을 입력하거나 음성으로 말씀하세요..."
                className="w-full p-3 rounded-xl bg-[#0B0F17] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#E5BE64]"
              />
              {memoSavedToast && (
                <p className="text-xs text-emerald-400 font-medium">{memoSavedToast}</p>
              )}
              <button
                onClick={handleSaveQuickMemo}
                disabled={isLoading || !quickMemoText.trim()}
                className="w-full py-2.5 rounded-xl bg-[#E5BE64] disabled:opacity-40 text-[#0B0F17] font-bold text-xs hover:bg-[#d8b052] transition"
              >
                Antigravity &amp; 옵시디언 볼트에 즉시 저장
              </button>
            </div>

            {/* Dedicated Android APK Download Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#18202E] to-[#0F141C] border border-[#E5BE64]/50 space-y-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#E5BE64]/15 border border-[#E5BE64]/40 text-[#E5BE64]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    안드로이드 전용 설치형 앱 (APK)
                  </h2>
                  <p className="text-[11px] text-[#E5BE64]">
                    패키지: com.yoonjongsung.antigravity (v2.1 정식 서명판)
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                스마트폰에 독립 앱으로 설치하면 브라우저 주소창 없이 1초 만에 실행되며, 외부(LTE/5G)에서도 클라우드-PC 보안 브릿지를 통해 집/사무실 PC의 안티그래비티와 하나를 그대로 사용하실 수 있습니다.
              </p>

              <a
                href="/antigravity-hana.apk"
                download="Antigravity_Hana.apk"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5BE64] to-[#C89D42] text-[#0B0F17] font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition"
              >
                <Download className="w-4 h-4" />
                안티그래비티 &amp; 하나 전용 APK 다운로드 (Antigravity_Hana.apk)
              </a>

              <div className="p-3 rounded-xl bg-[#0B0F17]/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-200">💡 휴대폰 설치 방법 (30초 완료):</p>
                <p>1. 위 골드 버튼을 눌러 `Antigravity_Hana.apk` 파일을 다운로드합니다.</p>
                <p>2. 다운로드 완료 알림을 터치해 [설치]를 누릅니다. (최초 1회 &apos;출처를 알 수 없는 앱 허용&apos; 클릭)</p>
                <p>3. 바탕화면에 생성된 **Antigravity** 아이콘을 터치해 언제 어디서나 편하게 사용하세요!</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Chat Input Bar (Visible on Chat Tab) */}
      {activeTab === 'chat' && (
        <div className="shrink-0 px-3 py-2.5 bg-[#0F141C] border-t border-slate-800/90">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl border transition shrink-0 ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-[#18202E] border-slate-700 text-slate-300 hover:text-[#E5BE64]'
              }`}
              title="음성으로 지시하기"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChat();
                }
              }}
              placeholder={
                isListening
                  ? '듣고 있습니다... 말씀해 주세요'
                  : '안티그래비티 & 하나에게 무엇이든 지시하세요...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#18202E] border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E5BE64]"
            />

            <button
              type="button"
              onClick={() => handleSendChat()}
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-[#E5BE64] disabled:opacity-40 text-[#0B0F17] font-bold hover:bg-[#d8b052] transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom 5-Tab Native App Dock */}
      <nav className="shrink-0 grid grid-cols-5 bg-[#0B0F17] border-t border-slate-800/90 py-1.5 px-1.5 z-20">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'chat' ? 'text-[#E5BE64]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-1">대화·지시</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('vault');
            fetchVaultDocs(vaultQuery, vaultCategory);
          }}
          className={`flex flex-col items-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'vault' ? 'text-[#E5BE64]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-1">세컨브레인</span>
        </button>

        <button
          onClick={() => setActiveTab('deck')}
          className={`flex flex-col items-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'deck' ? 'text-[#E5BE64]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-1">원터치사령탑</span>
        </button>

        <button
          onClick={() => setActiveTab('bridge')}
          className={`flex flex-col items-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'bridge' ? 'text-[#E5BE64]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-1">내PC브릿지</span>
        </button>

        <button
          onClick={() => setActiveTab('apk')}
          className={`flex flex-col items-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'apk' ? 'text-[#E5BE64]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-1">설정·APK</span>
        </button>
      </nav>

      {/* Luxury Slide-Up Modal: Mobile Instant Document Reader */}
      {isReadingFullDoc && selectedVaultDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end animate-fadeIn">
          <div className="bg-[#0F141C] border-t border-[#E5BE64]/40 rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E5BE64]/20 text-[#E5BE64] border border-[#E5BE64]/30 shrink-0">
                  {selectedVaultDoc.category}
                </span>
                <h3 className="text-xs font-bold text-slate-100 truncate">
                  {selectedVaultDoc.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedVaultDoc.content || selectedVaultDoc.preview || '');
                    setCopiedDocId(selectedVaultDoc.id);
                    setTimeout(() => setCopiedDocId(null), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-[#18202E] text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                  title="본문 복사"
                >
                  {copiedDocId === selectedVaultDoc.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsReadingFullDoc(false);
                    setSelectedVaultDoc(null);
                  }}
                  className="p-1.5 rounded-lg bg-[#18202E] text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Full Markdown Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed text-slate-200">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedVaultDoc.date}
                </span>
                <span>분량: {selectedVaultDoc.length?.toLocaleString()}자</span>
              </div>

              {selectedVaultDoc.tags && selectedVaultDoc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pb-1">
                  {selectedVaultDoc.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#18202E] text-[#E5BE64] border border-[#E5BE64]/20"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed space-y-2 pt-1 select-text">
                {selectedVaultDoc.content || selectedVaultDoc.preview}
              </div>
            </div>

            {/* Modal Footer: Action Button */}
            <div className="p-3 bg-[#0B0F17] border-t border-slate-800 flex items-center gap-2 shrink-0">
              <button
                onClick={() => askAiAboutDoc(selectedVaultDoc)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#E5BE64] to-[#C99C38] text-[#0B0F17] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#E5BE64]/15 hover:opacity-95 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>이 문서 기반으로 AI에게 질문하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
