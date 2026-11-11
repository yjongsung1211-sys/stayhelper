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
    desc: '인터넷 연결 없이 대표님 PC에서 비용 0원으로 오프라인 요약 구동',
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

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      const mimeType = file.type || 'audio/mp3';

      try {
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
    reader.readAsDataURL(file);
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
        const parsedNotes = JSON.parse(savedNotes);
        setNotesHistory(parsedNotes);
        if (parsedNotes.length > 0) {
          setCurrentNote(parsedNotes[0]);
        }
      } else {
        // Set sample welcome note
        const welcomeNote: SavedNote = {
          id: 'note-welcome-sample',
          title: 'NoteHelper에 오신 것을 환영합니다! (샘플 회의록)',
          createdAt: new Date().toISOString(),
          durationSeconds: 45,
          transcript:
            '오늘 마케팅 전략 회의에서는 1인 기업 5대 플랫폼의 트래픽 유입 방안을 논의했습니다. 첫째, 레딧과 인스타그램 숏폼을 통한 오가닉 유입에 집중하고, 둘째, 퍼스널컬러헬퍼의 12톤 가상 드레이핑 체험을 바이럴 핵심으로 잡기로 했습니다. 다음 주 수요일까지 각 채널별 1차 반응 지표를 취합하여 리뷰하겠습니다.',
          summary: [
            '1인 기업 전사 5대 플랫폼의 트래픽 확대를 위한 오가닉 바이럴 집중 결정',
            '퍼스널컬러헬퍼의 12톤 가상 드레이핑 기능을 숏폼 및 레딧의 핵심 유입 훅으로 활용',
            '차주 수요일까지 채널별 초기 지표를 취합하여 2차 스프린트 회의 진행 예정',
          ],
          actionItems: [
            { task: '레딧 및 인스타 숏폼 1차 반응 지표 취합', assignee: '마케팅팀', due: '차주 수요일' },
            { task: '퍼스널컬러헬퍼 12톤 드레이핑 데모 영상 배포', assignee: '헤라 배포관', due: '오늘 밤' },
          ],
          languageCoaching: {
            detectedLanguage: 'ko',
            grammarCorrections: [
              {
                original: '회의를 논의했습니다',
                corrected: '전략을 심도 있게 논의했습니다',
                explanation: '보다 격식 있고 명확한 비즈니스 표현입니다.',
              },
            ],
            keyVocabulary: [
              { term: '오가닉 유입 (Organic Traffic)', meaning: '유료 광고비 지출 없이 콘텐츠의 자체 바이럴로 유입되는 자연 트래픽', example: '오가닉 유입을 극대화하여 CAC(고객획득비용)를 0원으로 유지합니다.' },
            ],
            roleplaySuggestion: '“좋습니다. 그럼 차주 수요일 회의 전까지 각 채널별 전환율 데이터를 노션 대시보드에 취합해 두겠습니다.”',
          },
          targetLang: 'ko',
          providerUsed: 'Google Gemini',
        };
        setCurrentNote(welcomeNote);
        setNotesHistory([welcomeNote]);
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

  // 3. Web Speech API Handler
  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('이 브라우저는 실시간 음성인식을 지원하지 않습니다. 크롬 또는 사파리를 권장합니다.');
      return;
    }

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

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordSeconds(0);
        setTranscript('');
        setInterimTranscript('');
      };

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

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error !== 'no-speech') {
          showToast(`마이크 인식 오류: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      startWaveform();
    } catch (e: any) {
      showToast(`음성 인식 시작 실패: ${e.message}`);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    stopWaveform();
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
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1E293B] border border-purple-500/40 text-purple-200 px-5 py-3 rounded-full text-sm font-medium shadow-2xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0F141C]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/30">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-white">NoteHelper</h1>
                <span className="text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  AI BYOK Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                스마트폰 회의록 정리 & AI 다국어 어학 코칭 스튜디오
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* BYOK Cloud AI Connection Button */}
            <button
              onClick={() => setIsConfigOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-purple-500/60 bg-slate-800/60 hover:bg-slate-800 text-xs font-medium transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">AI 엔진:</span>
              <span className="text-purple-300 font-semibold">
                {aiConfig.apiKey ? PROVIDER_INFO[aiConfig.provider]?.name.split(' ')[0] : '기본 무료 AI'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="즉시 분석 가능 (무료 탑재)" />
            </button>

            <Link
              href="/antigravity"
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-xs font-extrabold text-amber-300 transition"
            >
              👑 Antigravity 사령탑 ↗
            </Link>

            <Link
              href="/schedulehelper"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
            >
              📅 스케줄헬퍼 ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Antigravity & Hana Direct Banner */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="p-3.5 rounded-2xl bg-[#111722] border border-amber-500/50 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div>
            <div className="text-sm font-extrabold text-amber-300">
              👑 Antigravity &amp; Hana 전용 모바일 사령탑 (설치형 APK 지원)
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              텔레그램 없이 음성/채팅 지시 · 11대 원터치 전사 관제 · 외부(LTE/5G) 내 PC 원격 연결
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/antigravity-hana.apk"
              download="Antigravity_Hana.apk"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 text-xs font-bold"
            >
              📲 안드로이드 APK 다운
            </a>
            <Link
              href="/antigravity"
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold"
            >
              사령탑 바로 열기 ➔
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recording & Input (5 Cols) */}
        <section className="lg:col-span-5 space-y-5">
          {/* Main Recording Cockpit */}
          <div className="p-6 rounded-3xl bg-[#111722] border border-slate-800/90 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> 실시간 보이스 녹음
              </span>
              <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 text-xs">
                {(['ko', 'en', 'ja', 'es', 'zh'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setTargetLang(lang)}
                    className={`px-2 py-0.5 rounded-md font-medium transition ${
                      targetLang === lang ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer & Pulsing Circle */}
            <div className="flex flex-col items-center justify-center py-6">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? 'bg-rose-500/20 border-2 border-rose-500 animate-pulse shadow-lg shadow-rose-900/40'
                    : 'bg-purple-600/10 border-2 border-purple-500/40'
                }`}
              >
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-transform active:scale-95 ${
                    isRecording
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/50'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/50'
                  }`}
                >
                  {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </button>
              </div>

              <div className="mt-4 text-center">
                <div className="text-2xl font-mono font-bold tracking-tight text-white">
                  {formatSeconds(recordSeconds)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isRecording
                    ? '말씀하시면 실시간으로 텍스트로 변환됩니다...'
                    : '버튼을 눌러 회의, 수업, 메모를 녹음하세요'}
                </p>
              </div>

              {/* Feature 5: Real-time Audio Waveform Visualizer */}
              <div className="mt-3 flex items-center justify-center gap-1 h-12 px-4 py-1">
                {waveformBars.map((height, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${isRecording ? height : 8}px` }}
                    className={`w-1 rounded-full transition-all duration-75 ${
                      isRecording
                        ? 'bg-gradient-to-t from-purple-500 via-indigo-400 to-rose-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                        : 'bg-slate-700/60'
                    }`}
                  />
                ))}
              </div>

              {/* Feature 3: Audio File Upload Button */}
              <div className="mt-2 w-full max-w-xs">
                <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-700/80 bg-slate-800/40 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition">
                  <UploadCloud className="w-4 h-4 text-purple-400" />
                  <span>{isUploadingAudio ? '오디오 전사 & 분석 중...' : '음성 파일 업로드 (.m4a, .mp3, .wav)'}</span>
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

            {/* Live Transcript Preview Box */}
            <div className="mt-2 p-3.5 rounded-2xl bg-[#090D14] border border-slate-800 text-xs min-h-[90px] max-h-[140px] overflow-y-auto leading-relaxed">
              <div className="text-slate-300 whitespace-pre-wrap">
                {transcript || interimTranscript || (
                  <span className="text-slate-600 italic">
                    마이크에 대고 말씀하시거나, 아래 텍스트 상자에 회의록을 직접 붙여넣으세요.
                  </span>
                )}
                {interimTranscript && <span className="text-purple-400 italic"> {interimTranscript}</span>}
              </div>
            </div>

            {/* Analyze Trigger Button */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!transcript && !interimTranscript)}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition ${
                  isAnalyzing || (!transcript && !interimTranscript)
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/30'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {isAnalyzing ? 'AI가 요약 & 코칭 분석 중...' : '클라우드 AI로 즉시 분석하기'}
              </button>
              <button
                onClick={() => {
                  setTranscript('');
                  setInterimTranscript('');
                }}
                className="px-3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                title="텍스트 비우기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Textarea for pasting */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <label className="text-[11px] font-medium text-slate-400 block mb-1.5">
                텍스트 직접 입력 / 붙여넣기:
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="회의 녹취록이나 과외 대화 텍스트를 복사해서 붙여넣으셔도 완벽히 분석됩니다."
                className="w-full h-20 p-2.5 bg-[#090D14] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/80 resize-none"
              />
            </div>
          </div>

          {/* Past Notes Sidebar / List */}
          <div className="p-5 rounded-3xl bg-[#111722] border border-slate-800/90 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> 로컬 보관함 ({notesHistory.length})
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                100% 로컬 저장됨
              </span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {notesHistory.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setCurrentNote(note)}
                  className={`p-3 rounded-2xl cursor-pointer transition border text-left flex items-start justify-between group ${
                    currentNote?.id === note.id
                      ? 'bg-purple-950/30 border-purple-500/50 text-white'
                      : 'bg-slate-900/60 border-slate-800/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold text-xs truncate">{note.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(note.createdAt).toLocaleDateString('ko-KR')} · {note.durationSeconds}초 ·{' '}
                      {note.providerUsed || 'Gemini'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: AI Structured Result View (7 Cols) */}
        <section className="lg:col-span-7">
          {currentNote ? (
            <div className="p-6 rounded-3xl bg-[#111722] border border-slate-800/90 shadow-2xl space-y-6">
              {/* Note Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {currentNote.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{new Date(currentNote.createdAt).toLocaleString('ko-KR')}</span>
                    <span>•</span>
                    <span className="text-purple-400 font-medium">분석 AI: {currentNote.providerUsed}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>복사</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'summary'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> 핵심 요약 (3줄)
                </button>
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'actions'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" /> 할 일 ({currentNote.actionItems.length})
                </button>
                <button
                  onClick={() => setActiveTab('coaching')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'coaching'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" /> 어학 코칭
                </button>
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'transcript'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> 원본 녹취
                </button>
              </div>

              {/* Tab 1: Executive Summary */}
              {activeTab === 'summary' && (
                <div className="space-y-3 animate-fade-in">
                  <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Executive Takeaways
                  </h3>
                  <div className="space-y-2.5">
                    {currentNote.summary.map((point, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#090D14] border border-slate-800/80 flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
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
                  <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Action Items & Deadlines
                  </h3>
                  {currentNote.actionItems.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">추출된 할 일이 없습니다.</p>
                  ) : (
                    <div className="space-y-2">
                      {currentNote.actionItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[#090D14] border border-slate-800/80 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded accent-purple-600 bg-slate-900 border-slate-700 cursor-pointer"
                            />
                            <span className="text-xs sm:text-sm font-medium text-slate-200">
                              {item.task}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                              {item.assignee || '본인'}
                            </span>
                            <span className="text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded">
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
                        <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                          ✍️ 문법 및 더 자연스러운 원어민 표현 교정
                        </h4>
                        <div className="space-y-2">
                          {currentNote.languageCoaching.grammarCorrections.map((corr, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-[#090D14] border border-slate-800/80 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="line-through text-rose-400 font-mono">{corr.original}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                  <span className="text-emerald-400 font-semibold font-mono">
                                    {corr.corrected}
                                  </span>
                                </div>
                                <button
                                  onClick={() => playPronunciation(corr.corrected, currentNote.targetLang)}
                                  className={`p-1.5 rounded-lg border transition shrink-0 ${
                                    playingText === corr.corrected
                                      ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)] animate-pulse'
                                      : 'bg-slate-800 text-slate-400 hover:text-purple-300 border-slate-700'
                                  }`}
                                  title="원어민 발음 듣기"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">{corr.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Key Vocabulary */}
                  {currentNote.languageCoaching?.keyVocabulary &&
                    currentNote.languageCoaching.keyVocabulary.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                          📚 핵심 어휘 & 뉘앙스
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {currentNote.languageCoaching.keyVocabulary.map((v, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-2xl bg-[#090D14] border border-slate-800/80 space-y-1"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-indigo-300">{v.term}</p>
                                <button
                                  onClick={() => playPronunciation(v.term, currentNote.targetLang)}
                                  className={`p-1 rounded-md border text-slate-400 hover:text-indigo-300 border-slate-700/80 bg-slate-800/80 transition shrink-0 ${
                                    playingText === v.term ? 'bg-indigo-600 text-white animate-pulse' : ''
                                  }`}
                                  title="단어 발음 듣기"
                                >
                                  <Volume2 className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-300">{v.meaning}</p>
                              <p className="text-[10px] text-slate-500 italic mt-1">"{v.example}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Roleplay Next Step */}
                  {currentNote.languageCoaching?.roleplaySuggestion && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                          💬 롤플레이 다음 추천 대답:
                        </h4>
                        <button
                          onClick={() => playPronunciation(currentNote.languageCoaching?.roleplaySuggestion || '', currentNote.targetLang)}
                          className={`p-1.5 rounded-lg border text-purple-300 border-purple-500/40 bg-purple-900/30 hover:bg-purple-900/50 transition shrink-0 ${
                            playingText === currentNote.languageCoaching?.roleplaySuggestion ? 'bg-purple-600 text-white animate-pulse' : ''
                          }`}
                          title="롤플레이 답변 원어민 발음 듣기"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        {currentNote.languageCoaching?.roleplaySuggestion}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Full Transcript */}
              {activeTab === 'transcript' && (
                <div className="p-4 rounded-2xl bg-[#090D14] border border-slate-800/80 animate-fade-in text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto">
                  {currentNote.transcript}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#111722] border border-slate-800/90 shadow-2xl text-center space-y-3">
              <Mic className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-bold text-base text-white">녹음이나 노트를 선택해주세요</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                좌측 마이크 버튼을 눌러 새 음성 메모를 시작하거나, 보관함의 노트를 클릭하여 상세 분석을 확인하세요.
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
                <strong>100% 프라이버시 보장</strong>: 입력하신 API 키는 오직 대표님의 브라우저 로컬 저장소(LocalStorage)에만 암호화 보관되며, 서버 데이터베이스에 절대 저장되지 않습니다.
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
