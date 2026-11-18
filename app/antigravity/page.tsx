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
  Paperclip,
  Image as ImageIcon,
  FileUp,
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
    id: 'upload_file',
    title: '사진·파일 PC 전송',
    subtitle: '스마트폰 갤러리·파일 ➔ 내 PC 직송',
    icon: ImageIcon,
    badge: 'DIRECT PC',
  },
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

interface CellHanaPromoItem {
  id: string;
  service: string;
  name: string;
  sub: string;
  badge: string;
  color: string;
  postTitle: string;
  postBody: string;
}

const CELLHANA_PROMOTIONS: CellHanaPromoItem[] = [
  {
    id: 'wedding',
    service: 'WeddingHelper',
    name: '💍 웨딩헬퍼 1-Touch 홍보',
    sub: 'SideProject',
    badge: 'WEDDING',
    color: 'from-amber-600 to-amber-700',
    postTitle: 'I built an atelier web tool with Gemini 2.5 to stop AI from turning destination wedding photos into generic Western strangers (Preserves 100% Asian monolid/eye contours)',
    postBody: `Hey everyone! 👋

I started building this after seeing so many couples get frustrated by destination wedding costs. A pre-wedding photoshoot in Lake Como or Amalfi easily tops $5,000–$8,000 with flights and photographer fees, but existing "AI face swap" apps turn authentic facial bone structures into plastic generic Caucasian stock models that look nothing like the real couple.

Over the past few months, I built **WeddingHelper** (https://weddinghelper.love) using Next.js 14 and Gemini 2.5 Flash Image.

📸 What the pipeline does:
1. Multi-Photo Biometric Geometry Lock: Preserves exact monolid/hooded eye contours, nasal curves, natural jawlines, and authentic smile geometry (Zero Westernization).
2. Aristocratic Regent Hair Makeover: Completely sweeps up the groom's casual straight bangs into a red-carpet pompadour with a compact youthful hairline.
3. 12 Global Luxury Destinations: 240 distinct scenes across Bali, Amalfi, Lake Como, Paris, Kyoto, Swiss Alps, and Korean Royal Hanok.
4. Two-Tier Scope:
   • Classic Pass ($15): 20 high-res photos for 1 chosen destination.
   • Grand VIP ($29): Complete 240-scene album across all 12 destinations + 1-Click 4K ZIP + digital mobile invitation studio.

I'd love your honest feedback on the mobile UX flow and facial rendering naturalness!

🔗 Live web atelier: https://weddinghelper.love (runs directly in your browser)`,
  },
  {
    id: 'color',
    service: 'PersonalColorHelper',
    name: '🎨 퍼스널컬러 1-Touch 홍보',
    sub: 'SideProject',
    badge: 'COLOR',
    color: 'from-purple-600 to-indigo-700',
    postTitle: 'I coded an interactive 12-season virtual personal color draping tool with side-by-side Warm vs Cool split view to recreate the Seoul salon experience',
    postBody: `Hey everyone! 👋

Like many of you, I've always loved Korean personal color analysis, but seeing Cheongdam-dong studios charge $200+ with 3-month waitlists felt crazy for anyone living outside Korea.

Physical fabric draping works because seeing real undertones directly against your jawline reveals whether your skin brightens up or turns dull. Most mobile filter apps just slap a generic badge on your photo without letting you *see* the fabric interaction yourself.

So I coded an interactive virtual draping tool in Next.js:

✨ Key Features:
1. Real-time seasonal fabric drapes (Spring, Summer, Autumn, Winter) placed under your selfie or webcam.
2. Side-by-Side Split View: Left side gets warm tones, right side gets cool tones simultaneously to spot yellowing vs dullness in 1 second.
3. 12-Tone Fine Sub-Matrix: Light, Bright, Mute, and Deep sub-tones instead of basic 4 seasons.
4. Instant 4-Model Presets: Test all features on 4 pre-loaded seasonal models without uploading your own photo first.

Supports English and Japanese as well.

I would genuinely love your honest feedback on the palette accuracy!

🔗 Test it free: https://personalcolorhelper.com/?lang=en (runs in browser, no app download needed)`,
  },
  {
    id: 'styling',
    service: 'StylingHelper',
    name: '✨ 스타일링헬퍼 1-Touch 홍보',
    sub: 'SideProject',
    badge: 'LUXURY',
    color: 'from-rose-600 to-pink-700',
    postTitle: 'I built an automated luxury price-drop and in-stock tracker for timeless designer staple pieces (Celine, Max Mara) across authorized US department stores',
    postBody: `Hey everyone! 👋

I've always been frustrated by how difficult it is to track legitimate flash markdowns on classic investment pieces across authorized department stores (Nordstrom, Shopbop, Saks) without getting lured into gray-market counterfeit risks.

So I built **StylingHelper** (https://stylinghelper.com) to automatically track:
1. Verified in-stock checkout status (\`In Stock\` & \`Add to Bag\` verified)
2. Live flash markdown radar on classic capsule wardrobe items (Celine Triomphe, Max Mara Manuela, etc.)
3. 1:1 direct routing to verified authorized merchants

Would love to get feedback on the UI and which luxury brands/stores I should add next!

🔗 Live tracker: https://stylinghelper.com`,
  },
  {
    id: 'stay',
    service: 'StayHelper',
    name: '🏨 스테이헬퍼 1-Touch 홍보',
    sub: 'SideProject',
    badge: 'HOTEL',
    color: 'from-emerald-600 to-teal-700',
    postTitle: 'We built a 4K luxury hotel portal comparing guaranteed upgrades and $200 hotel credits across Aman, Four Seasons, and Bulgari properties',
    postBody: `Having stayed across ultra-luxury properties in Asia and Europe, booking directly through public retail rack rates often leaves hundreds of dollars in amenities on the table.

We built **StayHelper** (https://www.thestayhelper.com) featuring:
1. 6-Act 4K cinematic walkthroughs of suites, wellness spas, and dining
2. Guaranteed late checkout and $100–$200 food & beverage / spa credits
3. Direct partner VIP booking routing for properties like Aman Tokyo, Villa d'Este Lake Como, and Bulgari Rome.

Would love any thoughts from fellow luxury travelers on property curation!

🔗 Walkthrough directory: https://www.thestayhelper.com`,
  },
];

interface UploadingFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  b64Content?: string;
}

export default function AntigravityMobilePage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'vault' | 'deck' | 'bridge' | 'memo'>('chat');
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

  // 셀하나(CellHana) 사진·파일 ➔ 내 PC 즉송 상태
  const [attachedFiles, setAttachedFiles] = useState<UploadingFileItem[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [inputText, setInputText] = useState('');
  const [dispatchToPc, setDispatchToPc] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [quickMemoText, setQuickMemoText] = useState('');
  const [memoSavedToast, setMemoSavedToast] = useState('');
  const [promoToast, setPromoToast] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // 🚀 셀하나 1-Touch 무인 홍보 발사 핸들러 (제목/본문 자동 채움 레딧 다이렉트 링크)
  const handleLaunchPromotion = async (item: CellHanaPromoItem) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(item.postTitle + '\n\n' + item.postBody);
      }
    } catch {}
    const submitUrl = `https://www.reddit.com/r/${item.sub}/submit?title=${encodeURIComponent(item.postTitle)}&text=${encodeURIComponent(item.postBody)}`;
    setPromoToast(`🎉 [${item.service}] 레딧 작성창이 자동 완성되었습니다. [Post]만 누르면 즉시 배포됩니다!`);
    window.open(submitUrl, '_blank');
    setTimeout(() => setPromoToast(''), 6000);
  };

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

  // 셀하나(CellHana) 클라이언트 이미지 최적화 및 파일 가공
  const processSelectedFile = async (file: File): Promise<UploadingFileItem> => {
    let b64 = '';
    let previewUrl: string | undefined = undefined;

    if (file.type.startsWith('image/')) {
      b64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const rawB64 = reader.result as string;
          if (file.size < 1.5 * 1024 * 1024) {
            resolve(rawB64);
            return;
          }
          try {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let { width, height } = img;
              const maxDim = 1920;
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            img.onerror = () => resolve(rawB64);
            img.src = rawB64;
          } catch {
            resolve(rawB64);
          }
        };
        reader.readAsDataURL(file);
      });
      previewUrl = b64;
    } else {
      b64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    return {
      id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      previewUrl,
      b64Content: b64,
    };
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingFiles(true);
    setUploadProgressText('파일 처리 및 최적화 중...');
    try {
      const processed: UploadingFileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 25 * 1024 * 1024) {
          alert(`파일 "${files[i].name}"이 25MB를 초과하여 제외되었습니다.`);
          continue;
        }
        const item = await processSelectedFile(files[i]);
        processed.push(item);
      }
      setAttachedFiles((prev) => [...prev, ...processed]);
      setActiveTab('chat');
    } catch (err) {
      console.error('File load error', err);
    } finally {
      setIsUploadingFiles(false);
      setUploadProgressText('');
      e.target.value = '';
    }
  };

  const handleRemoveAttached = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSendChat = async (overrideQuery?: string) => {
    const q = (overrideQuery ?? inputText).trim();
    if ((!q && attachedFiles.length === 0) || isLoading || isUploadingFiles) return;

    // 셀하나 첨부 파일 ➔ 내 PC 직송 처리
    if (attachedFiles.length > 0) {
      setIsLoading(true);
      setUploadProgressText(`셀하나 ➔ 내 PC로 파일 전송 중 (${attachedFiles.length}건)...`);
      try {
        for (let i = 0; i < attachedFiles.length; i++) {
          const f = attachedFiles[i];
          const res = await fetch('/api/antigravity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: 'file_upload',
              fileName: f.name,
              fileType: f.type,
              fileSize: f.size,
              content: f.b64Content,
              caption: q,
            }),
          });
          const data = await res.json();
          if (Array.isArray(data.chatHistory)) {
            setChatHistory(data.chatHistory);
          }
        }
        setAttachedFiles([]);
        if (!overrideQuery) setInputText('');
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
        setUploadProgressText('');
      }
      return;
    }

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
    if (actionId === 'upload_file') {
      imageInputRef.current?.click();
      return;
    }
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
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-slate-50 text-slate-900 overflow-hidden border-x border-slate-200 shadow-xl">
      {/* Top Eye-Comfort Executive Header */}
      <header className="shrink-0 px-3.5 pt-3 pb-2.5 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between gap-2 z-20 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight text-slate-950 whitespace-nowrap flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />셀하나 (CellHana)</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 whitespace-nowrap">
                &amp; HANA
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-0.5 truncate">
              <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">{pcStatus.hostname} 직결 · {pcStatus.skillsCount || 587} 스킬</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/secondbrain"
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 whitespace-nowrap shrink-0 transition cursor-pointer shadow-xs"
            title="세컨브레인 노트 열기"
          >
            <FileText className="w-3.5 h-3.5 text-white shrink-0" />
            <span>세컨브레인 노트</span>
          </Link>
          <Link
            href="/secondbrain/kernel"
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0F172A] text-xs font-bold flex items-center gap-1 whitespace-nowrap shrink-0 transition cursor-pointer shadow-2xs"
            title="Local-First 동기화 커널 & 지식 그래프"
          >
            <Layers className="w-3.5 h-3.5 text-[#0F172A] shrink-0" />
            <span className="hidden sm:inline">커널·그래프</span>
          </Link>
          <button
            onClick={() => fetchBridgeData(false)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition cursor-pointer shrink-0"
            title="실시간 동기화"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-slate-900' : ''}`} />
          </button>
          <button
            onClick={() => setActiveTab('memo')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 text-xs font-bold flex items-center gap-1 whitespace-nowrap shrink-0 transition cursor-pointer shadow-2xs"
            title="빠른 메모"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-slate-800 shrink-0" />
            <span>메모</span>
          </button>
        </div>
      </header>

      {/* 🚀 Promo Toast Notification */}
      {promoToast && (
        <div className="fixed top-16 left-4 right-4 z-50 p-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center justify-between animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2 text-xs font-bold leading-relaxed">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{promoToast}</span>
          </div>
          <button onClick={() => setPromoToast('')} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Smart Share Target Floating Arrival Banner */}
      {sharedArrival && (
        <div className="shrink-0 mx-3.5 mt-2.5 p-4 rounded-2xl bg-white border border-slate-300 shadow-lg flex flex-col gap-2 animate-fadeIn z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {sharedArrival.status === 'processing' ? (
                <RefreshCw className="w-4 h-4 text-slate-800 animate-spin shrink-0" />
              ) : sharedArrival.status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Terminal className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="text-sm font-bold text-slate-950">
                {sharedArrival.title || '스마트폰 공유 기사 수신'}
              </span>
            </div>
            <button
              onClick={() => setSharedArrival(null)}
              className="text-slate-400 hover:text-slate-800 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed break-all font-medium">
            {sharedArrival.message}
          </p>
          {sharedArrival.status === 'success' && (
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => {
                  setActiveTab('vault');
                  setVaultCategory('00_Inbox');
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
              >
                00_Inbox에서 확인하기
              </button>
              <button
                onClick={() => setSharedArrival(null)}
                className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 bg-slate-50">
        {/* TAB 1: COMMAND CHAT */}
        {activeTab === 'chat' && (
          <div className="flex flex-col space-y-3 pb-2">
            {/* PC Remote Execution Toggle Bar */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${dispatchToPc ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className="text-slate-900 font-semibold">
                  외부(LTE/5G) ↔ 내 PC 실시간 브릿지 동기화
                </span>
              </div>
              <button
                onClick={() => setDispatchToPc(!dispatchToPc)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  dispatchToPc
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {dispatchToPc ? 'ON (PC 연동)' : '클라우드 단독'}
              </button>
            </div>

            {/* Suggested One-Tap Prompts */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="shrink-0 px-3.5 py-2 rounded-full bg-slate-900 text-white border border-slate-900 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition cursor-pointer shadow-xs"
                title="스마트폰 사진·파일을 내 PC로 즉시 전송"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>📸 사진·파일 PC 전송</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('deck')}
                className="shrink-0 px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-500 text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer shadow-xs"
                title="레딧 1-Touch 무인 홍보 발사대로 이동"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>🚀 1-Touch 레딧 홍보</span>
              </button>
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(prompt)}
                  className="shrink-0 px-3.5 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 hover:text-slate-950 font-semibold transition cursor-pointer shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Conversation Stream */}
            <div className="space-y-3">
              {chatHistory.length === 0 && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                      👑 셀하나 (CellHana) 사령탑 가동 중
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">
                      ● 실시간 브릿지 정상
                    </span>
                  </div>
                  <p className="text-[13.5px] text-slate-800 leading-relaxed font-medium">
                    윤종성 대표님, 스마트폰 전용 **셀하나(CellHana)** 모바일 사령탑입니다. 스마트폰 갤러리의 사진이나 문서를 [사진/파일 첨부] 버튼으로 내 PC에 즉시 보내실 수 있으며, 음성 지시 및 세컨브레인 검색을 24시간 언제 어디서나 수행합니다.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setActiveTab('deck')}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 text-center hover:bg-slate-100 transition cursor-pointer"
                    >
                      ⚡ 원터치 사령탑 열기
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('vault');
                        fetchVaultDocs(vaultQuery, vaultCategory);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-900 text-xs font-bold text-white text-center hover:bg-slate-800 transition cursor-pointer shadow-2xs"
                    >
                      📚 세컨브레인 열람
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
                      className={`max-w-[92%] rounded-2xl px-4 py-3.5 text-[14.5px] leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-slate-900 text-white font-normal rounded-tr-xs'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs font-normal'
                      }`}
                    >
                      {!isUser && (
                        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                              {msg.tag || 'ANTIGRAVITY'}
                            </span>
                            {msg.executedBy && (
                              <span className="text-xs text-slate-600 truncate max-w-[160px] font-medium">
                                {msg.executedBy}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => toggleSpeakMessage(msg)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                            title="음성으로 듣기"
                          >
                            {speakingMsgId === msg.id ? (
                              <VolumeX className="w-4 h-4 text-slate-950" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap break-words">{msg.text}</div>

                      {!isUser && msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                          <p className="text-xs font-bold text-slate-900">
                            📚 참조된 Antigravity 전용 지식 볼트:
                          </p>
                          {msg.citations.map((cit) => (
                            <div
                              key={cit.id}
                              className="text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 truncate font-medium"
                            >
                              • [{cit.category}] {cit.title} ({cit.date})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 mt-1 px-1 font-medium">
                      {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 font-medium shadow-xs">
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-900 shrink-0" />
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
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-slate-900" />
                  세컨브레인 Vault 스포트라이트
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                  {vaultTotal}개 전사 문서
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                대표님의 회의록, 딥테크 M&amp;A, 어학 수업, 스크랩 기사를 0.05초 만에 검색하고 읽습니다.
              </p>

              {/* Instant Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={vaultQuery}
                  onChange={(e) => {
                    setVaultQuery(e.target.value);
                    fetchVaultDocs(e.target.value, vaultCategory);
                  }}
                  placeholder="단어 검색 (예: 샘컴, 일진전기, 중국어, 과외, NPU)"
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white"
                />
                {vaultQuery && (
                  <button
                    onClick={() => {
                      setVaultQuery('');
                      fetchVaultDocs('', vaultCategory);
                    }}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
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
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      vaultCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Count Info Bar */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-600 font-medium">
              <span>
                {vaultCategory === '전체' ? '전체 문서' : vaultCategory}: <b>{vaultDocs.length}</b>건 검색됨
              </span>
              <button
                onClick={() => fetchVaultDocs(vaultQuery, vaultCategory)}
                className="flex items-center gap-1.5 text-xs text-slate-900 hover:underline cursor-pointer font-bold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVaultLoading ? 'animate-spin' : ''}`} />
                새로고침
              </button>
            </div>

            {/* Document Cards List */}
            {isVaultLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-600 text-sm gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-slate-900" />
                <span>문서 인덱스를 검색하고 있습니다...</span>
              </div>
            ) : vaultDocs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm font-medium">
                검색된 세컨브레인 문서가 없습니다.
              </div>
            ) : (
              <div className="space-y-2.5">
                {vaultDocs.map((doc) => {
                  const getCategoryBadgeClass = (c: string) => {
                    if (c.includes('Inbox')) return 'bg-amber-100 text-amber-900 border-amber-300';
                    if (c.includes('Projects')) return 'bg-indigo-100 text-indigo-900 border-indigo-300';
                    if (c.includes('Areas')) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
                    if (c.includes('Resources')) return 'bg-sky-100 text-sky-900 border-sky-300';
                    return 'bg-slate-100 text-slate-800 border-slate-300';
                  };

                  return (
                    <div
                      key={doc.id}
                      onClick={() => openDocReader(doc)}
                      className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition cursor-pointer space-y-2.5 group shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-slate-950 group-hover:text-black transition line-clamp-2 leading-snug">
                          {doc.title}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${getCategoryBadgeClass(
                            doc.category
                          )}`}
                        >
                          {doc.subCategory || doc.category}
                        </span>
                      </div>

                      {doc.preview && (
                        <p className="text-[13px] text-slate-700 line-clamp-2 leading-relaxed font-normal">
                          {doc.preview}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1.5 border-t border-slate-100 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {doc.date}
                        </span>
                        <div className="flex items-center gap-1 text-slate-900 group-hover:translate-x-0.5 transition font-bold">
                          <span>열람하기</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
            {/* 🚀 셀하나 1-Touch 레딧 무인 홍보 발사대 */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-indigo-900/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  🔥 REDDIT 1-TOUCH LAUNCHPAD
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">
                  ● r/SideProject 공식 쇼케이스
                </span>
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-400" />
                셀하나 1-Touch 글로벌 무인 홍보 발사대
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                클라우드플레어 차단이나 봇 검증 없이, 대표님의 스마트폰 레딧 세션으로 <strong>제목·본문이 100% 자동 채워진 작성창</strong>이 열립니다. 아래 카드를 터치하고 레딧에서 <strong>[Post]</strong> 버튼만 누르면 0초 배포 완료!
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1.5">
                {CELLHANA_PROMOTIONS.map((promo) => (
                  <button
                    key={promo.id}
                    onClick={() => handleLaunchPromotion(promo)}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex flex-col justify-between cursor-pointer group active:scale-95 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">
                          {promo.badge}
                        </span>
                        <span className="text-[10px] text-indigo-300 font-medium">
                          r/{promo.sub}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-200 line-clamp-1">
                        {promo.name}
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-indigo-300 font-bold">
                      <span>1-Touch 발사</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                <Zap className="w-5 h-5 text-slate-900" />
                원터치 전사 사령탑 (One-Touch Executive Deck)
              </h2>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-medium">
                텔레그램 명령어 입력 없이 카드를 터치하면 안티그래비티와 하나가 즉시 실행하여 보고합니다.
              </p>
            </div>

            {selectedActionId && (
              <div className="p-4 rounded-2xl bg-white border border-slate-300 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-950">
                    🎯 상세 주제 / 타겟 입력 ({selectedActionId})
                  </span>
                  <button
                    onClick={() => setSelectedActionId(null)}
                    className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer font-bold"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white"
                />
                <button
                  onClick={() => handleExecuteQuickAction(selectedActionId, customTopic)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shadow-xs"
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
                    className="flex flex-col items-start p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-left transition group shadow-xs cursor-pointer"
                  >
                    <div className="w-full flex items-center justify-between mb-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 group-hover:scale-105 transition">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-950 group-hover:text-black transition leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-normal">
                      {item.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PC BRIDGE & LIVE TASK QUEUE */}
        {activeTab === 'bridge' && (
          <div className="space-y-3.5 pb-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-slate-900" />
                  <h2 className="text-base font-bold text-slate-950">내 PC 원격 브릿지 관제</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                  ● ONLINE ({pcStatus.hostname})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-600 font-medium">활성 스킬</p>
                  <p className="text-base font-bold text-slate-950 mt-0.5">
                    {pcStatus.skillsCount || 587}개
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-600 font-medium">볼트/노트</p>
                  <p className="text-base font-bold text-slate-950 mt-0.5">
                    {pcStatus.vaultDocsCount || 214}문서
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-600 font-medium">무인 데몬</p>
                  <p className="text-base font-bold text-emerald-800 mt-0.5">6대 가동</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-xs font-bold text-slate-900">
                  ⚡ 부팅 시 100% 무음 가동 중인 백그라운드 데몬:
                </p>
                {(pcStatus.activeDaemons || []).map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <span className="text-slate-800 font-medium">{d}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Remote Command Queue History */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-900" />
                  외부(LTE/5G) ➔ 내 PC 원격 작업 실행 큐
                </h3>
                <button
                  onClick={handleClearChat}
                  className="text-xs text-slate-600 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 대화 초기화
                </button>
              </div>

              {commandQueue.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center font-medium">
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
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-950 text-xs">
                            [{cmd.action}] {cmd.prompt}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-bold border ${
                              cmd.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            {cmd.status === 'completed' ? '실행 완료' : 'PC 실행 대기'}
                          </span>
                        </div>
                        {cmd.result && (
                          <p className="text-xs text-slate-700 line-clamp-3 whitespace-pre-wrap leading-relaxed font-normal">
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

        {/* TAB 5: QUICK MEMO & NOTE KEEPER */}
        {activeTab === 'memo' && (
          <div className="space-y-3.5 pb-4">
            {/* Quick 1-Second Obsidian Memo */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <BookmarkPlus className="w-5 h-5 text-slate-900" />
                  1초 빠른 메모 &amp; 옵시디언 동기화
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                  00_Inbox 직결
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                이동 중 떠오른 아이디어나 지시사항을 적으시면 내 PC 옵시디언 볼트(00_Inbox)와 Antigravity 전용 보관함에 즉시 안전하게 저장됩니다.
              </p>
              <textarea
                rows={6}
                value={quickMemoText}
                onChange={(e) => setQuickMemoText(e.target.value)}
                placeholder="메모할 내용을 입력하거나 음성으로 말씀하세요..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white leading-relaxed"
              />
              {memoSavedToast && (
                <p className="text-xs text-emerald-800 font-bold">{memoSavedToast}</p>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveQuickMemo}
                  disabled={isLoading || !quickMemoText.trim()}
                  className="flex-1 py-3 rounded-xl bg-slate-900 disabled:opacity-40 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shadow-xs"
                >
                  Antigravity &amp; 옵시디언 볼트에 즉시 저장
                </button>
                {quickMemoText && (
                  <button
                    onClick={() => setQuickMemoText('')}
                    className="px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    지우기
                  </button>
                )}
              </div>
            </div>

            {/* Quick Mobile Tips Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs text-slate-700 shadow-xs">
              <h3 className="font-bold text-slate-950 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-slate-800" />
                스마트폰 활용 가이드
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                설치된 <b>Antigravity</b> 앱에서 웹 기사의 [공유하기]를 누르면 자동으로 세컨브레인 00_Inbox에 스크랩 저장됩니다.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Chat Input Bar (Visible on Chat Tab) */}
      {activeTab === 'chat' && (
        <div className="shrink-0 bg-white border-t border-slate-200 shadow-md">
          {/* Hidden File & Image Pickers */}
          <input
            ref={imageInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelected}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.xlsx,.csv"
            onChange={handleFileSelected}
            className="hidden"
          />

          {/* Attached Files Preview Strip */}
          {attachedFiles.length > 0 && (
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-700 shrink-0">
                📎 내 PC 전송 대기 ({attachedFiles.length}):
              </span>
              {attachedFiles.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1 shrink-0 shadow-2xs text-xs"
                >
                  {item.previewUrl ? (
                    <img src={item.previewUrl} alt={item.name} className="w-5 h-5 rounded object-cover" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-slate-700" />
                  )}
                  <span className="font-semibold text-slate-900 max-w-[110px] truncate">{item.name}</span>
                  <span className="text-[10px] text-slate-500">
                    {item.size > 1024 * 1024
                      ? `${(item.size / (1024 * 1024)).toFixed(1)}MB`
                      : `${Math.round(item.size / 1024)}KB`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttached(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploadProgressText && (
            <div className="px-3.5 py-1 bg-emerald-50 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>{uploadProgressText}</span>
            </div>
          )}

          <div className="px-3.5 py-2.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl border transition shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              }`}
              title="음성으로 지시하기"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploadingFiles}
              className="p-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 transition shrink-0 cursor-pointer shadow-2xs"
              title="스마트폰 사진·카메라 찍어서 내 PC로 보내기"
            >
              <ImageIcon className="w-4 h-4 text-slate-800" />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingFiles}
              className="p-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 transition shrink-0 cursor-pointer shadow-2xs"
              title="스마트폰 문서·파일 내 PC로 보내기"
            >
              <Paperclip className="w-4 h-4 text-slate-800" />
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
                attachedFiles.length > 0
                  ? '사진·파일에 남길 메모(선택사항)를 입력하거나 전송을 누르세요...'
                  : isListening
                  ? '듣고 있습니다... 말씀해 주세요'
                  : '셀하나에게 지시하거나 사진·파일을 내 PC로 보내세요...'
              }
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white"
            />

            <button
              type="button"
              onClick={() => handleSendChat()}
              disabled={isLoading || isUploadingFiles || (!inputText.trim() && attachedFiles.length === 0)}
              className="p-2.5 rounded-xl bg-slate-900 disabled:opacity-40 text-white font-bold hover:bg-slate-800 transition shrink-0 cursor-pointer shadow-2xs"
              title="전송"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom 5-Tab Native App Dock */}
      <nav className="shrink-0 grid grid-cols-5 bg-white border-t border-slate-200 py-2 px-1.5 z-20 shadow-xs">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'chat' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4.5 h-4.5" />
          <span className="text-xs font-semibold mt-1">셀하나</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('vault');
            fetchVaultDocs(vaultQuery, vaultCategory);
          }}
          className={`flex flex-col items-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'vault' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          <span className="text-xs font-semibold mt-1">세컨브레인</span>
        </button>

        <button
          onClick={() => setActiveTab('deck')}
          className={`flex flex-col items-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'deck' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4.5 h-4.5" />
          <span className="text-xs font-semibold mt-1">원터치사령탑</span>
        </button>

        <button
          onClick={() => setActiveTab('bridge')}
          className={`flex flex-col items-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'bridge' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4.5 h-4.5" />
          <span className="text-xs font-semibold mt-1">내PC브릿지</span>
        </button>

        <button
          onClick={() => setActiveTab('memo')}
          className={`flex flex-col items-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'memo' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookmarkPlus className="w-4.5 h-4.5" />
          <span className="text-xs font-semibold mt-1">빠른메모</span>
        </button>
      </nav>

      {/* Eye-Comfort Slide-Up Modal: Mobile Instant Document Reader */}
      {isReadingFullDoc && selectedVaultDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex flex-col justify-end animate-fadeIn">
          <div className="bg-white border-t border-slate-200 rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                  {selectedVaultDoc.category}
                </span>
                <h3 className="text-sm font-bold text-slate-950 truncate">
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
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
                  title="본문 복사"
                >
                  {copiedDocId === selectedVaultDoc.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsReadingFullDoc(false);
                    setSelectedVaultDoc(null);
                  }}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Full Markdown Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs leading-relaxed text-slate-900">
              <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedVaultDoc.date}
                </span>
                <span>분량: {selectedVaultDoc.length?.toLocaleString()}자</span>
              </div>

              {selectedVaultDoc.tags && selectedVaultDoc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {selectedVaultDoc.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="whitespace-pre-wrap font-sans text-[15px] text-slate-900 leading-relaxed space-y-2.5 pt-1 select-text font-normal">
                {selectedVaultDoc.content || selectedVaultDoc.preview}
              </div>
            </div>

            {/* Modal Footer: Action Button */}
            <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <button
                onClick={() => askAiAboutDoc(selectedVaultDoc)}
                className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-slate-800 transition cursor-pointer"
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
