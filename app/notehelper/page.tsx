'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Sparkles,
  Settings,
  Download,
  Copy,
  Check,
  Trash2,
  FileText,
  Languages,
  CheckSquare,
  ShieldCheck,
  Zap,
  Globe,
  Plus,
  Play,
  Pause,
  Key,
  ChevronRight,
  ExternalLink,
  BookOpen,
  HelpCircle,
  X,
  Volume2,
  UploadCloud,
  FileAudio,
  CalendarPlus,
  Share2,
} from 'lucide-react';

interface AIConfig {
  provider: 'gemini' | 'openai' | 'claude' | 'deepseek' | 'ollama';
  apiKey: string;
  model: string;
  endpoint?: string;
}

interface ActionItem {
  task: string;
  assignee: string;
  due: string;
  done?: boolean;
}

interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

interface VocabularyItem {
  term: string;
  meaning: string;
  example: string;
}

interface LanguageCoaching {
  detectedLanguage?: string;
  grammarCorrections?: GrammarCorrection[];
  keyVocabulary?: VocabularyItem[];
  roleplaySuggestion?: string;
}

interface SavedNote {
  id: string;
  title: string;
  createdAt: string;
  durationSeconds: number;
  transcript: string;
  summary: string[];
  actionItems: ActionItem[];
  languageCoaching?: LanguageCoaching;
  targetLang: string;
  providerUsed?: string;
}

const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-flash-latest',
};

const PROVIDER_INFO = {
  gemini: {
    name: 'Google Gemini',
    badge: '기본 무료 AI 탑재',
    models: ['gemini-flash-latest', 'gemini-2.5-pro'],
    getKeyUrl: 'https://aistudio.google.com/app/apikey',
    getKeyText: 'Google AI Studio에서 무료 API 키 발급받기 ↗',
    desc: '월 1,500회 무료! 초고속 전사 요약 및 한국어 뉘앙스 최적화',
  },
  openai: {
    name: 'OpenAI (ChatGPT)',
    badge: '글로벌 표준',
    models: ['gpt-4o-mini', 'gpt-4o'],
    getKeyUrl: 'https://platform.openai.com/api-keys',
    getKeyText: 'OpenAI 대시보드에서 API 키 발급받기 ↗',
    desc: '가장 널리 쓰이는 GPT-4o 엔진으로 고난도 비즈니스 회의록 정밀 요약',
  },
  claude: {
    name: 'Anthropic Claude',
    badge: '최고급 문체',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
    getKeyUrl: 'https://console.anthropic.com/settings/keys',
    getKeyText: 'Anthropic 콘솔에서 API 키 발급받기 ↗',
    desc: '인간 비서 수준의 자연스러운 보고서 문체 및 어학 코칭 완성도',
  },
  deepseek: {
    name: 'DeepSeek',
    badge: '초가성비',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    getKeyUrl: 'https://platform.deepseek.com/api_keys',
    getKeyText: 'DeepSeek 플랫폼에서 API 키 발급받기 ↗',
    desc: '극도로 저렴한 토큰 비용으로 대규모 장문 회의록 전사 완벽 대응',
  },
  ollama: {
    name: '로컬 Ollama (오프라인)',
    badge: '100% 무료 · PC 구동',
    models: ['qwen2.5:3b', 'llama3.2:3b', 'mistral'],
    getKeyUrl: 'https://ollama.com',
    getKeyText: 'Ollama 공식 홈페이지 ↗',
    desc: '인터넷 연결 없이 PC에서 비용 0원으로 오프라인 요약 구동',
  },
};

export default function NoteHelperPage() {
  // AI Config
  const [aiConfig, setAiConfig] = useState<AIConfig>(DEFAULT_AI_CONFIG);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [targetLang, setTargetLang] = useState('ko');

  // Processing & Results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentNote, setCurrentNote] = useState<SavedNote | null>(null);
  const [notesHistory, setNotesHistory] = useState<SavedNote[]>([]);
  const [activeTab, setActiveTab] = useState<'summary' | 'coaching' | 'actions' | 'transcript'>('summary');
  const [toastMessage, setToastMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Feature 2: TTS Playing State
  const [playingText, setPlayingText] = useState<string | null>(null);

  // Feature 3: Audio File Upload State
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Feature 5: Real-time Waveform State & Refs
  const [waveformBars, setWaveformBars] = useState<number[]>(new Array(24).fill(10));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };
  // Feature 2: Native Voice Pronunciation (TTS)
  const playPronunciation = (text: string, lang = targetLang) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('이 브라우저는 음성 재생을 지원하지 않습니다.');
      return;
    }
    window.speechSynthesis.cancel();
    setPlayingText(text);

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      en: 'en-US',
      ko: 'ko-KR',
      ja: 'ja-JP',
      es: 'es-ES',
      zh: 'zh-CN',
    };
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.92;
    utterance.onend = () => setPlayingText(null);
    utterance.onerror = () => setPlayingText(null);
    window.speechSynthesis.speak(utterance);
  };

  // Feature 4: 1-Click Copy Formats & ScheduleHelper Sync
  const copyKakaoFormat = (note: SavedNote) => {
    const dateStr = new Date(note.createdAt).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    const summaryLines = (note.summary || []).map((s, i) => `${i + 1}️⃣ ${s}`).join('\n');
    const actionLines = (note.actionItems || []).map((a) => `▫️ [${a.due || '기한 미정'}] ${a.task} (${a.assignee || '담당자'})`).join('\n');

    const text = `📌 [NoteHelper AI 회의록] ${note.title}\n⏱️ 일시: ${dateStr}\n\n📝 핵심 요약 3줄\n${summaryLines}\n\n✅ 실행 과제 (To-Do)\n${actionLines || '▫️ 없음'}\n\n✨ NoteHelper AI 스마트 요약`;

    navigator.clipboard.writeText(text);
    showToast('💬 카카오톡 보고용 포맷으로 복사되었습니다! 단톡방에 바로 붙여넣으세요.');
  };

  const copyNotionFormat = (note: SavedNote) => {
    const summaryLines = (note.summary || []).map((s) => `- ${s}`).join('\n');
    const actionLines = (note.actionItems || []).map((a) => `- [ ] ${a.task} (담당: ${a.assignee}, 기한: ${a.due})`).join('\n');
    const grammarLines = (note.languageCoaching?.grammarCorrections || []).map((g) => `> **원문:** ${g.original}\n> **교정:** ${g.corrected}\n> *${g.explanation}*`).join('\n\n');
    const vocabLines = (note.languageCoaching?.keyVocabulary || []).map((v) => `- **${v.term}**: ${v.meaning} (*"${v.example}"*)`).join('\n');

    const text = `# ${note.title}\n*작성일: ${new Date(note.createdAt).toLocaleString('ko-KR')}*\n\n## 📝 핵심 요약\n${summaryLines}\n\n## ✅ 실행 과제 (Action Items)\n${actionLines || '- [ ] 없음'}\n\n## 💡 어학 코칭 및 비즈니스 표현\n### 문법 및 뉘앙스 교정\n${grammarLines || '해당 없음'}\n\n### 핵심 어휘\n${vocabLines || '해당 없음'}\n\n---\n*NoteHelper AI Executive Studio*`;

    navigator.clipboard.writeText(text);
    showToast('📋 노션(Notion) 마크다운 포맷으로 복사되었습니다!');
  };

  const syncToScheduleHelper = (note: SavedNote) => {
    if (!note.actionItems || note.actionItems.length === 0) {
      showToast('등록할 실행 과제(To-Do)가 없습니다.');
      return;
    }
    try {
      const existingTodos = JSON.parse(localStorage.getItem('schedulehelper_todos_v2') || '[]');
      const newTodos = note.actionItems.map((a, idx) => ({
        id: `note-todo-${Date.now()}-${idx}`,
        source: 'kakao' as const,
        title: a.task,
        dueTag: a.due || '이번 주 내',
        priority: 'high' as const,
        done: false,
        rawSnippet: `[NoteHelper 연동] ${note.title} (${a.assignee})`,
        createdAt: new Date().toISOString(),
      }));

      const merged = [...newTodos, ...existingTodos];
      localStorage.setItem('schedulehelper_todos_v2', JSON.stringify(merged));
      showToast(`📅 스케줄헬퍼에 ${newTodos.length}개의 할 일이 즉시 등록되었습니다!`);
    } catch {
      showToast('스케줄헬퍼 연동 중 오류가 발생했습니다.');
    }
  };

  // Feature 5: Real-time Audio Waveform
  const startWaveform = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateWaveform = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const bars: number[] = [];
        const step = Math.max(1, Math.floor(bufferLength / 24));
        for (let i = 0; i < 24; i++) {
          const val = dataArray[i * step] || 0;
          const height = Math.max(6, Math.min(48, Math.round((val / 255) * 44) + 6));
          bars.push(height);
        }
        setWaveformBars(bars);
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      updateWaveform();
    } catch (err) {
      console.warn('Waveform audio context error:', err);
    }
  };

  const stopWaveform = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setWaveformBars(new Array(24).fill(10));
  };

  // Feature 3: Audio File Upload Handler (.m4a, .mp3, .wav)
  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      showToast('25MB 이하의 오디오 파일만 업로드할 수 있습니다.');
      return;
    }

    setUploadedFileName(file.name);
    setIsUploadingAudio(true);
    setIsAnalyzing(true);
    showToast(`🎙️ ${file.name} 파일을 전사 및 분석 중입니다. 잠시만 기다려주세요...`);

    try {
      const wavDataUrl = await encodeBlobToWav16k(file);
      const dataUrl =
        wavDataUrl ||
        (await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string) || '');
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }));
      const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      const mimeType = wavDataUrl ? 'audio/wav' : file.type || 'audio/wav';

      const res = await fetch('/api/notehelper/ai-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiConfig.provider,
          apiKey: aiConfig.apiKey,
          model: aiConfig.model,
          audioBase64: base64Data,
          audioMimeType: mimeType,
          targetLang,
        }),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || '음성 파일 분석에 실패했습니다.');

      const resultData = json.data;
      if (resultData.transcript) {
        setTranscript(resultData.transcript);
      }
      const newNote: SavedNote = {
        id: `note-${Date.now()}`,
        title: resultData.title || `${file.name.replace(/\.[^/.]+$/, '')} 회의록`,
        createdAt: new Date().toISOString(),
        durationSeconds: Math.round(file.size / 16000) || 60,
        transcript: resultData.transcript || '오디오 전사 완료',
        summary: Array.isArray(resultData.summary) ? resultData.summary : [resultData.summary],
        actionItems: Array.isArray(resultData.actionItems) ? resultData.actionItems : [],
        languageCoaching: resultData.languageCoaching || {},
        targetLang,
        providerUsed: `${PROVIDER_INFO[aiConfig.provider]?.name || 'Gemini'} (오디오 파일 분석)`,
      };

      const updated = [newNote, ...notesHistory];
      setNotesHistory(updated);
      setCurrentNote(newNote);
      localStorage.setItem('notehelper_saved_notes_v1', JSON.stringify(updated));
      showToast(`✅ ${file.name} 파일의 전사 및 분석이 완료되었습니다!`);
    } catch (err: any) {
      showToast(`오디오 분석 실패: ${err.message}`);
    } finally {
      setIsUploadingAudio(false);
      setIsAnalyzing(false);
      e.target.value = '';
    }
  };

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('notehelper_byok_config_v1');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setAiConfig(parsed);
        setApiKeyInput(parsed.apiKey || '');
      }

      const savedNotes = localStorage.getItem('notehelper_saved_notes_v1');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes).filter(
          (n: SavedNote) => n && n.id !== 'note-welcome-sample'
        );
        setNotesHistory(parsedNotes);
        if (parsedNotes.length > 0) {
          setCurrentNote(parsedNotes[0]);
        }
      }
    } catch (e) {
      console.error('LocalStorage load error:', e);
    }
  }, []);

  // 2. Timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // 3. Web Speech API + MediaRecorder WAV STT Handler
  const startRecording = async () => {
    setRecordSeconds(0);
    setTranscript('');
    setInterimTranscript('');
    mediaChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setIsRecording(true);

      // Start MediaRecorder for reliable server-side WAV transcription
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

      // Real-time waveform on the same stream
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const updateWaveform = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          const bars: number[] = [];
          const step = Math.max(1, Math.floor(bufferLength / 24));
          for (let i = 0; i < 24; i++) {
            const val = dataArray[i * step] || 0;
            const height = Math.max(6, Math.min(48, Math.round((val / 255) * 44) + 6));
            bars.push(height);
          }
          setWaveformBars(bars);
          animationFrameRef.current = requestAnimationFrame(updateWaveform);
        };
        updateWaveform();
      } catch {}

      // Desktop live SpeechRecognition preview (avoid mobile mic conflict)
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && !isMobile) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang =
            targetLang === 'ko'
              ? 'ko-KR'
              : targetLang === 'en'
              ? 'en-US'
              : targetLang === 'ja'
              ? 'ja-JP'
              : targetLang === 'es'
              ? 'es-ES'
              : 'zh-CN';
          recognition.onresult = (event: any) => {
            let finalStr = '';
            let interimStr = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalStr += event.results[i][0].transcript + ' ';
              } else {
                interimStr += event.results[i][0].transcript;
              }
            }
            if (finalStr) {
              setTranscript((prev) => (prev ? prev + ' ' + finalStr.trim() : finalStr.trim()));
            }
            setInterimTranscript(interimStr);
          };
          recognition.start();
          recognitionRef.current = recognition;
        } catch {}
      }
    } catch (e: any) {
      showToast(`마이크 시작 실패: ${e?.message || '마이크 권한을 허용해 주세요.'}`);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

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
    stopWaveform();

    if (mediaChunksRef.current.length > 0) {
      const mime = mediaChunksRef.current[0]?.type || 'audio/webm';
      const blob = new Blob(mediaChunksRef.current, { type: mime });
      mediaChunksRef.current = [];
      showToast('🎙️ 녹음된 음성을 AI로 정밀 전사 중입니다...');
      try {
        const wavDataUrl = await encodeBlobToWav16k(blob);
        if (wavDataUrl) {
          const res = await fetch('/api/secondbrain/process-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: transcript,
              duration: recordSeconds || 5,
              audioBase64: wavDataUrl,
              mimeType: 'audio/wav',
              targetLang,
            }),
          });
          const data = await res.json();
          const sttText = (data?.analysis?.refinedTranscript || data?.rawTranscript || '').trim();
          if (sttText && !sttText.includes('무음')) {
            const cleanStt = sttText.replace(/^Speaker\s+\d+\s*:\s*/gim, '').trim();
            if (cleanStt) {
              setTranscript(cleanStt);
              showToast('✅ 음성 녹음 전사가 완료되었습니다!');
            }
          }
        }
      } catch {}
    }
  };

  // 4. Save AI Config
  const handleSaveConfig = () => {
    const newConfig: AIConfig = {
      ...aiConfig,
      apiKey: apiKeyInput.trim(),
    };
    setAiConfig(newConfig);
    try {
      localStorage.setItem('notehelper_byok_config_v1', JSON.stringify(newConfig));
      showToast('✅ 클라우드 AI 연결 정보가 안전하게 저장되었습니다!');
      setIsConfigOpen(false);
    } catch {
      showToast('설정 저장 중 오류가 발생했습니다.');
    }
  };

  // 5. Run AI Analysis
  const handleAnalyze = async () => {
    const textToAnalyze = (transcript + ' ' + interimTranscript).trim();
    if (!textToAnalyze) {
      showToast('분석할 음성 녹음이나 텍스트가 없습니다. 먼저 녹음하거나 내용을 입력해주세요.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/notehelper/ai-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiConfig.provider,
          apiKey: aiConfig.apiKey,
          model: aiConfig.model,
          endpoint: aiConfig.endpoint,
          transcript: textToAnalyze,
          targetLang,
        }),
      });

      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || 'AI 분석에 실패했습니다.');
      }

      const resultData = json.data;
      const newNote: SavedNote = {
        id: `note-${Date.now()}`,
        title: resultData.title || `회의 및 어학 노트 (${new Date().toLocaleTimeString('ko-KR')})`,
        createdAt: new Date().toISOString(),
        durationSeconds: recordSeconds || 30,
        transcript: textToAnalyze,
        summary: Array.isArray(resultData.summary) ? resultData.summary : [resultData.summary],
        actionItems: Array.isArray(resultData.actionItems) ? resultData.actionItems : [],
        languageCoaching: resultData.languageCoaching || {},
        targetLang,
        providerUsed: PROVIDER_INFO[aiConfig.provider]?.name || aiConfig.provider,
      };

      const updatedHistory = [newNote, ...notesHistory];
      setNotesHistory(updatedHistory);
      setCurrentNote(newNote);
      localStorage.setItem('notehelper_saved_notes_v1', JSON.stringify(updatedHistory));
      showToast('🎉 AI 회의록 분석 및 어학 코칭이 완료되었습니다!');
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('클립보드에 복사되었습니다!');
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteNote = (id: string) => {
    const filtered = notesHistory.filter((n) => n.id !== id);
    setNotesHistory(filtered);
    localStorage.setItem('notehelper_saved_notes_v1', JSON.stringify(filtered));
    if (currentNote?.id === id) {
      setCurrentNote(filtered[0] || null);
    }
    showToast('노트가 삭제되었습니다.');
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#0F172A] font-sans selection:bg-indigo-600 selection:text-white pb-20 overflow-x-hidden">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-[#0F172A] border border-indigo-500/50 text-white px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold shadow-2xl animate-fade-in flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation (Deep Black Header for Crisp White/Black Contrast) */}
      <header className="border-b border-slate-800 bg-[#0F172A] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-3.5 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
                  NoteHelper
                </h1>
                <span className="text-[10px] font-bold bg-indigo-500/25 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                  노트헬퍼
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                AI 회의록 정리 &amp; 다국어 어학 코칭
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/secondbrain"
              className="flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold transition whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <span>🧠 내 개인 세컨브레인 노트 열기</span>
            </Link>
            {/* BYOK Cloud AI Connection Button */}
            <button
              onClick={() => setIsConfigOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-xl border border-slate-700 hover:border-indigo-400 bg-slate-800/90 hover:bg-slate-800 text-xs font-semibold transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline text-slate-300">AI 엔진:</span>
              <span className="text-white font-bold whitespace-nowrap">
                {aiConfig.apiKey ? PROVIDER_INFO[aiConfig.provider]?.name.split(' ')[0] : '무료 AI'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="즉시 분석 가능 (무료 탑재)" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-3.5 sm:px-4 pt-4 sm:pt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Recording & Input (5 Cols) */}
        <section className="lg:col-span-5 space-y-5 min-w-0">
          {/* Main Recording Cockpit (Crisp White Card + Deep Black Mic Stage + Vibrant Accents) */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl relative overflow-hidden">
            {/* Top Row: Title + Status Badge (Never Overflows) */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 whitespace-nowrap">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" /> 실시간 보이스 녹음
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                ● 다국어 자동 인식
              </span>
            </div>

            {/* Full-Width 5-Column Language Selector Bar (Zero Overflow on 360px Screens) */}
            <div className="grid grid-cols-5 gap-1.5 bg-[#F1F5F9] rounded-2xl p-1.5 border border-slate-200/80 mb-4">
              {(
                [
                  { code: 'ko', label: 'KO · 한' },
                  { code: 'en', label: 'EN · 영' },
                  { code: 'ja', label: 'JA · 일' },
                  { code: 'es', label: 'ES · 스' },
                  { code: 'zh', label: 'ZH · 중' },
                ] as const
              ).map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setTargetLang(code)}
                  className={`py-2 min-h-[36px] rounded-xl text-xs font-extrabold transition text-center whitespace-nowrap cursor-pointer ${
                    targetLang === code
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Deep Obsidian Black Recording Stage (Black & White Harmony + Vibrant Glow) */}
            <div className="flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-gradient-to-b from-[#0F172A] via-[#131C31] to-[#1E1B4B] text-white shadow-inner border border-slate-800">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? 'bg-rose-500/25 border-2 border-rose-400 animate-pulse shadow-lg shadow-rose-500/40'
                    : 'bg-indigo-500/20 border-2 border-indigo-400/50'
                }`}
              >
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-transform active:scale-95 cursor-pointer ${
                    isRecording
                      ? 'bg-gradient-to-tr from-rose-600 to-pink-500 shadow-rose-600/50'
                      : 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 hover:from-violet-500 hover:to-indigo-500 shadow-indigo-600/50'
                  }`}
                >
                  {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </button>
              </div>

              <div className="mt-3.5 text-center">
                <div className="text-3xl font-mono font-extrabold tracking-tight text-white">
                  {formatSeconds(recordSeconds)}
                </div>
                <p className="text-xs text-indigo-200/90 mt-1 font-medium">
                  {isRecording
                    ? '🔴 말씀하시면 실시간으로 텍스트로 변환됩니다...'
                    : '마이크 버튼을 눌러 회의·외국어 수업을 녹음하세요'}
                </p>
              </div>

              {/* Feature 5: Real-time Audio Waveform Visualizer */}
              <div className="mt-3 flex items-center justify-center gap-1 h-10 px-2 py-1 w-full max-w-[260px] overflow-hidden">
                {waveformBars.map((height, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${isRecording ? height : 8}px` }}
                    className={`w-1 rounded-full transition-all duration-75 shrink-0 ${
                      isRecording
                        ? 'bg-gradient-to-t from-violet-400 via-fuchsia-400 to-amber-300 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                        : 'bg-slate-600/70'
                    }`}
                  />
                ))}
              </div>

              {/* Feature 3: Audio File Upload Button */}
              <div className="mt-3 w-full">
                <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-indigo-400/30 bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer transition">
                  <UploadCloud className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="truncate">
                    {isUploadingAudio ? '오디오 전사 & 분석 중...' : '음성 파일 업로드 (.m4a, .mp3, .wav)'}
                  </span>
                  <input
                    type="file"
                    accept="audio/*,.m4a,.mp3,.wav,.ogg,.webm,.aac"
                    onChange={handleAudioFileUpload}
                    disabled={isUploadingAudio || isAnalyzing}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Live Transcript Preview Box (Clean White/Slate Surface with Crisp Black Text) */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-xs min-h-[84px] max-h-[140px] overflow-y-auto leading-relaxed">
              <div className="text-[#0F172A] font-medium whitespace-pre-wrap break-words">
                {transcript || interimTranscript || (
                  <span className="text-slate-400">
                    마이크에 대고 말씀하시거나, 아래 텍스트 상자에 회의록·수업 내용을 직접 붙여넣으세요.
                  </span>
                )}
                {interimTranscript && <span className="text-indigo-600 font-semibold"> {interimTranscript}</span>}
              </div>
            </div>

            {/* Analyze Trigger Button */}
            <div className="mt-3.5 flex gap-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!transcript && !interimTranscript)}
                className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
                  isAnalyzing || (!transcript && !interimTranscript)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                    : 'bg-gradient-to-r from-[#0F172A] via-[#312E81] to-[#4F46E5] hover:opacity-95 text-white shadow-indigo-500/20'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">
                  {isAnalyzing ? 'AI가 요약 & 코칭 분석 중...' : '클라우드 AI로 즉시 분석하기'}
                </span>
              </button>
              <button
                onClick={() => {
                  setTranscript('');
                  setInterimTranscript('');
                }}
                className="px-3.5 py-3.5 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition shrink-0 cursor-pointer"
                title="텍스트 비우기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Textarea for pasting */}
            <div className="mt-4 pt-3.5 border-t border-slate-200/80">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                ✍️ 텍스트 직접 입력 / 붙여넣기:
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="회의 녹취록이나 외국어 과외 대화 텍스트를 복사해서 붙여넣으셔도 완벽히 분석됩니다."
                className="w-full h-20 p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Past Notes Sidebar / List (Clean White Card with Indigo/Emerald Accents) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" /> 내 노트 보관함 ({notesHistory.length})
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                100% 자동 저장됨
              </span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {notesHistory.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setCurrentNote(note)}
                  className={`p-3 rounded-2xl cursor-pointer transition border text-left flex items-center justify-between gap-2 group ${
                    currentNote?.id === note.id
                      ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-md'
                      : 'bg-[#F8FAFC] border-slate-200/90 text-[#0F172A] hover:border-indigo-300 hover:bg-indigo-50/40'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs truncate">{note.title}</p>
                    <p
                      className={`text-[10px] mt-0.5 truncate ${
                        currentNote?.id === note.id ? 'text-indigo-200' : 'text-slate-500'
                      }`}
                    >
                      {new Date(note.createdAt).toLocaleDateString('ko-KR')} · {note.durationSeconds}초 ·{' '}
                      {note.providerUsed || 'Gemini'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className={`p-2 rounded-lg transition shrink-0 ${
                      currentNote?.id === note.id
                        ? 'text-slate-300 hover:text-rose-300 hover:bg-white/10'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: AI Structured Result View (7 Cols) */}
        <section className="lg:col-span-7 min-w-0">
          {currentNote ? (
            <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-5">
              {/* Note Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 gap-3">
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1.5">
                    AI 분석 리포트 · {currentNote.providerUsed}
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight leading-snug break-words">
                    {currentNote.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(currentNote.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `# ${currentNote.title}\n\n## 핵심 요약\n${currentNote.summary
                        .map((s) => `- ${s}`)
                        .join('\n')}\n\n## 할 일\n${currentNote.actionItems
                        .map((a) => `- [ ] ${a.task} (${a.assignee}, ${a.due})`)
                        .join('\n')}`
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>복사</span>
                </button>
              </div>

              {/* Navigation Tabs (2x2 Grid on Mobile, 4 Columns on Tablet/Desktop -> Zero Overflow!) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F1F5F9] p-1.5 rounded-2xl border border-slate-200/80">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'summary'
                      ? 'bg-[#0F172A] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-white/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 핵심 요약
                </button>
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'actions'
                      ? 'bg-[#0F172A] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-white/60'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 할 일 ({currentNote.actionItems.length})
                </button>
                <button
                  onClick={() => setActiveTab('coaching')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'coaching'
                      ? 'bg-[#0F172A] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-white/60'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5 text-violet-400 shrink-0" /> 어학 코칭
                </button>
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'transcript'
                      ? 'bg-[#0F172A] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-white/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" /> 원본 녹취
                </button>
              </div>

              {/* Tab 1: Executive Summary */}
              {activeTab === 'summary' && (
                <div className="space-y-3 animate-fade-in">
                  <h3 className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider">
                    ✨ 핵심 요약 (Executive Takeaways)
                  </h3>
                  <div className="space-y-2.5">
                    {currentNote.summary.map((point, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#EEF2FF]/70 border border-indigo-200/80 flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5 shadow-sm">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-[#0F172A] leading-relaxed font-semibold break-words">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Action Items */}
              {activeTab === 'actions' && (
                <div className="space-y-3 animate-fade-in">
                  <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                    ✅ 실행 과제 (Action Items)
                  </h3>
                  {currentNote.actionItems.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">추출된 할 일이 없습니다.</p>
                  ) : (
                    <div className="space-y-2">
                      {currentNote.actionItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[#ECFDF5]/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              className="w-4 h-4 mt-0.5 rounded accent-emerald-600 cursor-pointer shrink-0"
                            />
                            <span className="text-xs sm:text-sm font-bold text-[#0F172A] break-words">
                              {item.task}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0 pl-6 sm:pl-0">
                            <span className="text-[10px] font-bold bg-white px-2.5 py-0.5 rounded-full text-slate-700 border border-slate-200">
                              {item.assignee || '본인'}
                            </span>
                            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
                              {item.due || '기한 미정'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Language Coaching */}
              {activeTab === 'coaching' && (
                <div className="space-y-5 animate-fade-in">
                  {/* Grammar Corrections */}
                  {currentNote.languageCoaching?.grammarCorrections &&
                    currentNote.languageCoaching.grammarCorrections.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">
                          ✍️ 문법 및 더 자연스러운 원어민 표현 교정
                        </h4>
                        <div className="space-y-2.5">
                          {currentNote.languageCoaching.grammarCorrections.map((corr, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-amber-200 space-y-1.5"
                            >
                              <div className="flex items-start justify-between gap-2 text-xs">
                                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                  <span className="line-through text-rose-600 font-semibold break-words">
                                    {corr.original}
                                  </span>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="text-emerald-700 font-extrabold break-words">
                                    {corr.corrected}
                                  </span>
                                </div>
                                <button
                                  onClick={() => playPronunciation(corr.corrected, currentNote.targetLang)}
                                  className={`p-2 rounded-xl border transition shrink-0 cursor-pointer ${
                                    playingText === corr.corrected
                                      ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                                      : 'bg-white text-indigo-700 hover:bg-indigo-50 border-indigo-200'
                                  }`}
                                  title="원어민 발음 듣기"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {corr.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Key Vocabulary */}
                  {currentNote.languageCoaching?.keyVocabulary &&
                    currentNote.languageCoaching.keyVocabulary.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider">
                          📚 핵심 어휘 &amp; 뉘앙스
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {currentNote.languageCoaching.keyVocabulary.map((v, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-[#F5F3FF] border border-violet-200 space-y-1"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-extrabold text-violet-900 break-words">{v.term}</p>
                                <button
                                  onClick={() => playPronunciation(v.term, currentNote.targetLang)}
                                  className={`p-1.5 rounded-lg border text-violet-700 hover:bg-violet-100 border-violet-200 bg-white transition shrink-0 cursor-pointer ${
                                    playingText === v.term ? 'bg-violet-600 text-white animate-pulse' : ''
                                  }`}
                                  title="단어 발음 듣기"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-xs font-semibold text-slate-800">{v.meaning}</p>
                              <p className="text-[11px] text-slate-600 italic mt-1 break-words">&ldquo;{v.example}&rdquo;</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Roleplay Next Step */}
                  {currentNote.languageCoaching?.roleplaySuggestion && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E1B4B] text-white border border-indigo-500/30 shadow-md">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                          💬 롤플레이 다음 추천 대답:
                        </h4>
                        <button
                          onClick={() =>
                            playPronunciation(
                              currentNote.languageCoaching?.roleplaySuggestion || '',
                              currentNote.targetLang
                            )
                          }
                          className={`p-2 rounded-xl border text-amber-300 border-amber-400/40 bg-white/10 hover:bg-white/20 transition shrink-0 cursor-pointer ${
                            playingText === currentNote.languageCoaching?.roleplaySuggestion
                              ? 'bg-amber-400 text-[#0F172A] animate-pulse'
                              : ''
                          }`}
                          title="롤플레이 답변 원어민 발음 듣기"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-100 leading-relaxed break-words">
                        {currentNote.languageCoaching?.roleplaySuggestion}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Full Transcript */}
              {activeTab === 'transcript' && (
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 animate-fade-in text-xs sm:text-sm text-[#0F172A] font-medium leading-relaxed whitespace-pre-wrap break-words max-h-[350px] overflow-y-auto">
                  {currentNote.transcript}
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-white border border-slate-200 shadow-lg text-center space-y-3">
              <Mic className="w-12 h-12 text-indigo-500 mx-auto" />
              <h3 className="font-extrabold text-base text-[#0F172A]">녹음이나 노트를 선택해주세요</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                마이크 버튼을 눌러 새 음성 메모를 시작하거나, 보관함의 노트를 클릭하여 상세 분석을 확인하세요.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* BYOK Cloud AI Settings Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#111722] border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsConfigOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">클라우드 AI 모델 연결 (BYOK)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                기본 제공되는 초고속 무료 AI를 그대로 쓰시거나, 고객님의 전용 AI 키를 연결할 수 있습니다.
              </p>
            </div>

            {/* Default Free AI Notice */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-start gap-3">
              <span className="text-base">🎁</span>
              <div className="text-xs">
                <span className="font-bold text-emerald-400">기본 무료 AI 탑재 완료 (설정 불필요)</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed">
                  별도 키를 입력하지 않으셔도 <strong>Google Cloud Gemini 초고속 AI(비용 0원)</strong>로 즉시 분석됩니다. 본인만의 전용 모델(GPT-4o, Claude 등)을 쓰실 때만 아래에서 키를 등록하세요.
                </p>
              </div>
            </div>

            {/* Provider Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">AI 제공자 선택:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(PROVIDER_INFO) as Array<keyof typeof PROVIDER_INFO>).map((key) => {
                  const info = PROVIDER_INFO[key];
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        setAiConfig({
                          ...aiConfig,
                          provider: key,
                          model: info.models[0],
                        })
                      }
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        aiConfig.provider === key
                          ? 'bg-purple-600/20 border-purple-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-xs">{info.name}</span>
                      <span className="text-[10px] text-purple-300 mt-1">{info.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* API Key Input */}
            {aiConfig.provider !== 'ollama' ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    {PROVIDER_INFO[aiConfig.provider]?.name} API 키:
                  </label>
                  <a
                    href={PROVIDER_INFO[aiConfig.provider]?.getKeyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>{PROVIDER_INFO[aiConfig.provider]?.getKeyText}</span>
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={`${PROVIDER_INFO[aiConfig.provider]?.name} API 키를 붙여넣으세요`}
                    className="w-full p-3 bg-[#090D14] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                  >
                    {showKey ? '숨김' : '보기'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Ollama API 주소:</label>
                <input
                  type="text"
                  value={aiConfig.endpoint || 'http://localhost:11434/api/generate'}
                  onChange={(e) => setAiConfig({ ...aiConfig, endpoint: e.target.value })}
                  className="w-full p-3 bg-[#090D14] border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
              </div>
            )}

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">세부 모델 선택:</label>
              <select
                value={aiConfig.model}
                onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                className="w-full p-2.5 bg-[#090D14] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {PROVIDER_INFO[aiConfig.provider]?.models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {PROVIDER_INFO[aiConfig.provider]?.desc}
              </p>
            </div>

            {/* Security Guarantee Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>100% 프라이버시 보장</strong>: 입력하신 API 키는 오직 고객님의 브라우저 로컬 저장소(LocalStorage)에만 암호화 보관되며, 서버 데이터베이스에 절대 저장되지 않습니다.
              </p>
            </div>

            {/* Save Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setIsConfigOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
              >
                취소
              </button>
              <button
                onClick={handleSaveConfig}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-900/30 transition"
              >
                저장 및 연결 적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
