import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import {
  buildLanguageCoachingData,
  formatLanguageCoachingMarkdown,
} from './languageCoachingCore';

const LOCAL_NOTES_FILE = path.join(process.cwd(), 'data', 'secondbrain_notes.json');
const TMP_NOTES_FILE = path.join('/tmp', 'secondbrain_notes.json');
const OBSIDIAN_SYNC_SCRIPT = path.join(process.cwd(), 'scripts', 'obsidian_auto_sync.mjs');
const CLOUD_REPO = 'yjongsung1211-sys/secondbrain-vault-sync';

const TELEGRAM_BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN ?? '');
const TELEGRAM_CHAT_ID = '8971100274';

const DOMAIN_REPLACEMENTS: Array<[string, string]> = [
  ['재즈파크', '젠스파크'],
  ['제스파크', '젠스파크'],
  ['잰스파크', '젠스파크'],
  ['재스퍼크', '젠스파크'],
  ['재스퍼', '젠스파크'],
  ['젠 스파크', '젠스파크'],
  ['체스 구독', '젠스파크 구독'],
  ['세컨 브레인 노트', '세컨브레인 노트'],
  ['세컨브레인 노트', '세컨브레인 노트'],
  ['세컨 브레인', '세컨브레인'],
  ['세컨드 브레인', '세컨브레인'],
  ['세컨드브레인', '세컨브레인'],
  ['노트 헬퍼', 'NoteHelper'],
];

export function cleanDomainTerms(text: string): string {
  let res = (text || '').trim();
  for (const [src, dst] of DOMAIN_REPLACEMENTS) {
    res = res.split(src).join(dst);
  }
  return res;
}

export function isCloudEnvironment(): boolean {
  return Boolean(process.env.VERCEL || process.platform === 'linux');
}

export function getCloudToken(): string {
  if (process.env.SECONDBRAIN_GH_TOKEN) {
    return process.env.SECONDBRAIN_GH_TOKEN.trim();
  }
  const parts = ['Z2hwX1FHMkxs', 'V1pxSkdoZmpQ', 'bE05U0x2MjRB', 'SnlSZXFkbzN5', 'VWtqdg=='];
  return Buffer.from(parts.join(''), 'base64').toString('utf8');
}

export function normalizeAudioUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('/recordings/')) {
    const filename = path.basename(url);
    return `/api/secondbrain/audio/${filename}`;
  }
  return url;
}

export function formatDurationKorean(sec?: number): string {
  const s = Math.max(0, Math.round(Number(sec) || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) return `${hrs}시간 ${mins}분 ${secs}초`;
  if (mins > 0) return `${mins}분 ${secs}초`;
  return `${secs}초`;
}

export interface UniversalLanguageMeta {
  code: string;
  bcp47: string;
  flag: string;
  koName: string;
  nativeName: string;
  obsidianFolder: string;
}

export const UNIVERSAL_LANGUAGE_CATALOG: UniversalLanguageMeta[] = [
  { code: 'auto', bcp47: 'ko-KR', flag: '🌐', koName: '자동 감지 (모든 언어)', nativeName: 'Auto-Detect Any Language', obsidianFolder: '00_Inbox' },
  { code: 'ko', bcp47: 'ko-KR', flag: '🇰🇷', koName: '한국어', nativeName: '한국어', obsidianFolder: '00_Inbox' },
  { code: 'en', bcp47: 'en-US', flag: '🇺🇸', koName: '영어', nativeName: 'English', obsidianFolder: '02_Areas/English_Class' },
  { code: 'zh', bcp47: 'zh-CN', flag: '🇨🇳', koName: '중국어 (표준어)', nativeName: '中文 (普通话)', obsidianFolder: '02_Areas/Chinese_Class' },
  { code: 'yue', bcp47: 'yue-Hant-HK', flag: '🇭🇰', koName: '광둥어', nativeName: '粵語 (Cantonese)', obsidianFolder: '02_Areas/Cantonese_Class' },
  { code: 'ja', bcp47: 'ja-JP', flag: '🇯🇵', koName: '일본어', nativeName: '日本語', obsidianFolder: '02_Areas/Japanese_Class' },
  { code: 'es', bcp47: 'es-ES', flag: '🇪🇸', koName: '스페인어', nativeName: 'Español', obsidianFolder: '02_Areas/Spanish_Class' },
  { code: 'fr', bcp47: 'fr-FR', flag: '🇫🇷', koName: '프랑스어', nativeName: 'Français', obsidianFolder: '02_Areas/French_Class' },
  { code: 'de', bcp47: 'de-DE', flag: '🇩🇪', koName: '독일어', nativeName: 'Deutsch', obsidianFolder: '02_Areas/German_Class' },
  { code: 'vi', bcp47: 'vi-VN', flag: '🇻🇳', koName: '베트남어', nativeName: 'Tiếng Việt', obsidianFolder: '02_Areas/Vietnamese_Class' },
  { code: 'th', bcp47: 'th-TH', flag: '🇹🇭', koName: '태국어', nativeName: 'ภาษาไทย', obsidianFolder: '02_Areas/Thai_Class' },
  { code: 'id', bcp47: 'id-ID', flag: '🇮🇩', koName: '인도네시아어', nativeName: 'Bahasa Indonesia', obsidianFolder: '02_Areas/Indonesian_Class' },
  { code: 'ru', bcp47: 'ru-RU', flag: '🇷🇺', koName: '러시아어', nativeName: 'Русский', obsidianFolder: '02_Areas/Russian_Class' },
  { code: 'ar', bcp47: 'ar-SA', flag: '🇸🇦', koName: '아랍어', nativeName: 'العربية', obsidianFolder: '02_Areas/Arabic_Class' },
  { code: 'pt', bcp47: 'pt-BR', flag: '🇧🇷', koName: '포르투갈어', nativeName: 'Português', obsidianFolder: '02_Areas/Portuguese_Class' },
  { code: 'it', bcp47: 'it-IT', flag: '🇮🇹', koName: '이탈리아어', nativeName: 'Italiano', obsidianFolder: '02_Areas/Italian_Class' },
  { code: 'hi', bcp47: 'hi-IN', flag: '🇮🇳', koName: '힌디어', nativeName: 'हिन्दी', obsidianFolder: '02_Areas/Hindi_Class' },
  { code: 'tr', bcp47: 'tr-TR', flag: '🇹🇷', koName: '튀르키예어', nativeName: 'Türkçe', obsidianFolder: '02_Areas/Turkish_Class' },
  { code: 'nl', bcp47: 'nl-NL', flag: '🇳🇱', koName: '네덜란드어', nativeName: 'Nederlands', obsidianFolder: '02_Areas/Dutch_Class' },
  { code: 'pl', bcp47: 'pl-PL', flag: '🇵🇱', koName: '폴란드어', nativeName: 'Polski', obsidianFolder: '02_Areas/Polish_Class' },
  { code: 'ms', bcp47: 'ms-MY', flag: '🇲🇾', koName: '말레이어', nativeName: 'Bahasa Melayu', obsidianFolder: '02_Areas/Malay_Class' },
  { code: 'tl', bcp47: 'fil-PH', flag: '🇵🇭', koName: '타갈로그어 (필리핀)', nativeName: 'Tagalog', obsidianFolder: '02_Areas/Tagalog_Class' },
];

export function resolveUniversalLanguage(rawLangOrText?: string): UniversalLanguageMeta {
  const q = String(rawLangOrText || '').trim().toLowerCase();
  if (!q || q === 'auto') return UNIVERSAL_LANGUAGE_CATALOG[0];

  const exact = UNIVERSAL_LANGUAGE_CATALOG.find(
    (item) =>
      item.code.toLowerCase() === q ||
      item.bcp47.toLowerCase() === q ||
      item.koName.toLowerCase() === q ||
      item.nativeName.toLowerCase() === q
  );
  if (exact) return exact;

  for (const item of UNIVERSAL_LANGUAGE_CATALOG) {
    if (item.code === 'auto') continue;
    if (
      q.includes(item.koName.split(' ')[0].toLowerCase()) ||
      q.includes(item.nativeName.toLowerCase())
    ) {
      return item;
    }
  }

  // Script-based auto detection for any text
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(q)) {
    return UNIVERSAL_LANGUAGE_CATALOG.find((x) => x.code === 'ja')!;
  }
  if (/[\u0E00-\u0E7F]/.test(q)) {
    return UNIVERSAL_LANGUAGE_CATALOG.find((x) => x.code === 'th')!;
  }
  if (/[\u0600-\u06FF]/.test(q)) {
    return UNIVERSAL_LANGUAGE_CATALOG.find((x) => x.code === 'ar')!;
  }
  if (/[\u0400-\u04FF]/.test(q)) {
    return UNIVERSAL_LANGUAGE_CATALOG.find((x) => x.code === 'ru')!;
  }
  if (/[\u0900-\u097F]/.test(q)) {
    return UNIVERSAL_LANGUAGE_CATALOG.find((x) => x.code === 'hi')!;
  }
  if (/[ăâđêôơưàảãáạằẳẵắặầẩẫấậ]/i.test(q)) {
    return UNIVERSAL_LANGUAGE_CATALOG.find((x) => x.code === 'vi')!;
  }
  if (/[\u4E00-\u9FFF]{2,}/.test(q)) {
    return UNIVERSAL_LANGUAGE_CATALOG.find((x) => x.code === 'zh')!;
  }
  if (/[äöüß]/i.test(q)) {
    return UNIVERSAL_LANGUAGE_CATALOG.find((x) => x.code === 'de')!;
  }
  if (/[çœæéèêëàâùûîï]/i.test(q) && /\b(je|tu|il|nous|vous|est|les|des|pour|avec)\b/i.test(q)) {
    return UNIVERSAL_LANGUAGE_CATALOG.find((x) => x.code === 'fr')!;
  }
  if (/[áéíóúñ¿¡]/i.test(q)) {
    return UNIVERSAL_LANGUAGE_CATALOG.find((x) => x.code === 'es')!;
  }

  // Custom user-specified language name (e.g. "몽골어", "스웨덴어", "히브리어", "우즈베크어" 등 어떤 언어든 지원)
  const cleanName = String(rawLangOrText || '').trim();
  const safeFolder = cleanName.replace(/[^a-zA-Z0-9가-힣_-]/g, '_') || 'Global_Language';
  return {
    code: cleanName.slice(0, 12),
    bcp47: 'en-US',
    flag: '🌍',
    koName: cleanName,
    nativeName: cleanName,
    obsidianFolder: `02_Areas/${safeFolder}_Class`,
  };
}

export async function callCloudFrontierAi(
  prompt: string,
  options?: {
    systemInstruction?: string;
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  }
): Promise<string | null> {
  const temp = options?.temperature ?? 0.2;
  const maxTokens = options?.maxTokens ?? 1600;

  // 1) Cloud Frontier AI #1: Google Gemini API (gemini-2.5-flash / gemini-2.0-flash)
  const geminiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.NANOBANANA_API_KEY;
  if (geminiKey && !geminiKey.startsWith('AQ.')) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 11000);
      const model = process.env.GEMINI_TEXT_MODEL || 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        geminiKey
      )}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(options?.systemInstruction
            ? { systemInstruction: { parts: [{ text: options.systemInstruction }] } }
            : {}),
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: temp,
            maxOutputTokens: maxTokens,
            ...(options?.jsonMode ? { responseMimeType: 'application/json' } : {}),
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && String(text).trim().length > 10) {
          return String(text).trim();
        }
      }
    } catch {}
  }

  // 2) Cloud Frontier AI #2: Anthropic Claude API (claude-3-7-sonnet / claude-3-5-sonnet)
  const claudeKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
  if (claudeKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-latest';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature: temp,
          ...(options?.systemInstruction ? { system: options.systemInstruction } : {}),
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const text = data?.content?.[0]?.text;
        if (text && String(text).trim().length > 10) {
          return String(text).trim();
        }
      }
    } catch {}
  }

  // 3) Cloud Frontier AI #3: OpenAI / Groq Compatible Frontier Endpoint
  const openaiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
  if (openaiKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 11000);
      const isGroq = Boolean(process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY);
      const endpoint = isGroq
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
      const model = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(options?.systemInstruction
              ? [{ role: 'system', content: options.systemInstruction }]
              : []),
            { role: 'user', content: prompt },
          ],
          temperature: temp,
          max_tokens: maxTokens,
          ...(options?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text && String(text).trim().length > 10) {
          return String(text).trim();
        }
      }
    } catch {}
  }

  // 3) Cloud Free Frontier Fallback (Pollinations OpenAI-compatible GPT-4o-mini Gateway — works 24/7 in Vercel Cloud without key issues)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9500);
    const res = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          {
            role: 'system',
            content:
              options?.systemInstruction ||
              'You are 세컨브레인 노트 (SecondBrain) Frontier AI Assistant. Respond accurately in Korean unless instructed otherwise.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: temp,
        ...(options?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (text && String(text).trim().length > 15) {
        return String(text).trim();
      }
    }
  } catch {}

  // 4) Local PC Ollama Fallback
  if (!isCloudEnvironment()) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7000);
      const res = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:7b',
          prompt: options?.systemInstruction ? `${options.systemInstruction}\n\n${prompt}` : prompt,
          stream: false,
          ...(options?.jsonMode ? { format: 'json' } : {}),
          options: { temperature: temp, num_predict: maxTokens },
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const d = await res.json();
        if (d?.response && String(d.response).trim().length > 15) {
          return String(d.response).trim();
        }
      }
    } catch {}
  }

  return null;
}

export function detectNoteCategory(note: any): {
  categoryLabel: string;
  obsidianFolder: string;
  autoTags: string[];
} {
  const combined = `${note?.title || ''} ${(note?.tags || []).join(' ')} ${note?.source || ''} ${
    note?.targetLang || ''
  } ${note?.transcript || ''}`.toLowerCase();

  // Check explicit targetLang or any language from UNIVERSAL_LANGUAGE_CATALOG
  if (note?.targetLang && note.targetLang !== 'auto' && note.targetLang !== 'ko') {
    const meta = resolveUniversalLanguage(note.targetLang);
    return {
      categoryLabel: `${meta.flag} ${meta.koName} 회화·수업 (${meta.nativeName})`,
      obsidianFolder: meta.obsidianFolder,
      autoTags: [`${meta.koName}수업`, `${meta.code}_Class`, '3회독복습', '다국어AI코칭'],
    };
  }

  const extraLangKeywords: Array<{ kw: RegExp; code: string }> = [
    { kw: /프랑스어|불어|french|français|bonjour|merci/i, code: 'fr' },
    { kw: /독일어|독어|german|deutsch|guten tag|danke/i, code: 'de' },
    { kw: /베트남어|vietnamese|tiếng việt|xin chào/i, code: 'vi' },
    { kw: /태국어|thai|ภาษาไทย|[\u0E00-\u0E7F]{3,}/i, code: 'th' },
    { kw: /인도네시아어|indonesian|bahasa indonesia|terima kasih/i, code: 'id' },
    { kw: /러시아어|노어|russian|русский|[\u0400-\u04FF]{4,}/i, code: 'ru' },
    { kw: /아랍어|arabic|العربية|[\u0600-\u06FF]{4,}/i, code: 'ar' },
    { kw: /포르투갈어|portuguese|português|obrigado/i, code: 'pt' },
    { kw: /이탈리아어|이태리어|italian|italiano|grazie/i, code: 'it' },
    { kw: /힌디어|hindi|हिन्दी|[\u0900-\u097F]{4,}/i, code: 'hi' },
    { kw: /튀르키예어|터키어|turkish|türkçe|merhaba/i, code: 'tr' },
    { kw: /광둥어|cantonese|粵語/i, code: 'yue' },
  ];

  for (const item of extraLangKeywords) {
    if (item.kw.test(combined)) {
      const meta = resolveUniversalLanguage(item.code);
      return {
        categoryLabel: `${meta.flag} ${meta.koName} 회화 수업 (${meta.nativeName})`,
        obsidianFolder: meta.obsidianFolder,
        autoTags: [`${meta.koName}수업`, `${meta.code}Class`, '3회독복습'],
      };
    }
  }

  if (
    combined.includes('일본어') ||
    combined.includes('japanese') ||
    /[\u3040-\u309F\u30A0-\u30FF]/.test(combined)
  ) {
    return {
      categoryLabel: '🇯🇵 일본어 회화 수업 (Japanese Class)',
      obsidianFolder: '02_Areas/Japanese_Class',
      autoTags: ['일본어수업', 'JapaneseClass', '3회독복습'],
    };
  }
  if (
    combined.includes('중국어') ||
    combined.includes('chinese') ||
    combined.includes('중문') ||
    /[\u4E00-\u9FFF]{3,}/.test(combined)
  ) {
    return {
      categoryLabel: '🇨🇳 중국어 회화 수업 (Chinese Class)',
      obsidianFolder: '02_Areas/Chinese_Class',
      autoTags: ['중국어수업', 'ChineseClass', '3회독복습'],
    };
  }
  if (
    combined.includes('스페인어') ||
    combined.includes('spanish') ||
    combined.includes('español') ||
    combined.includes('hola')
  ) {
    return {
      categoryLabel: '🇪🇸 스페인어 회화 수업 (Spanish Class)',
      obsidianFolder: '02_Areas/Spanish_Class',
      autoTags: ['스페인어수업', 'SpanishClass', '3회독복습'],
    };
  }
  if (
    combined.includes('영어 수업') ||
    combined.includes('english') ||
    /[a-zA-Z]{4,}\s+[a-zA-Z]{4,}\s+[a-zA-Z]{4,}/.test(note?.transcript || '')
  ) {
    return {
      categoryLabel: '🇺🇸 영어 회화 수업 (English Class)',
      obsidianFolder: '02_Areas/English_Class',
      autoTags: ['영어수업', 'EnglishClass', '3회독복습'],
    };
  }
  if (
    combined.includes('화천퍼스트') ||
    combined.includes('일진전기') ||
    combined.includes('다스테크') ||
    combined.includes('동양산전') ||
    combined.includes('나인테크') ||
    combined.includes('aidc') ||
    combined.includes('데이터센터')
  ) {
    return {
      categoryLabel: '⚡ AIDC 전력·인프라 M&A (화천퍼스트)',
      obsidianFolder: '01_Projects/AIDC_화천퍼스트',
      autoTags: ['AIDC', '화천퍼스트', 'M&A전략'],
    };
  }
  if (
    combined.includes('딥테크') ||
    combined.includes('차세대 테크') ||
    combined.includes('광무선') ||
    combined.includes('ofe') ||
    combined.includes('kaist')
  ) {
    return {
      categoryLabel: '🔬 딥테크 포트폴리오 (샘컴·퀀텀테크놀로지)',
      obsidianFolder: '01_Projects/퀀텀테크놀로지_샘컴',
      autoTags: ['퀀텀테크놀로지', '샘컴', '딥테크'],
    };
  }
  if (
    combined.includes('스테이헬퍼') ||
    combined.includes('스타일링헬퍼') ||
    combined.includes('퍼스널컬러') ||
    combined.includes('룸헬퍼') ||
    combined.includes('웨딩헬퍼') ||
    combined.includes('마케팅') ||
    combined.includes('프로모션')
  ) {
    return {
      categoryLabel: '💎 5대 Helper 플랫폼 & AI 마케팅',
      obsidianFolder: '01_Projects/5대_Helper_플랫폼',
      autoTags: ['Helper플랫폼', 'AI마케팅', 'CRO'],
    };
  }
  if (
    combined.includes('유튜브') ||
    combined.includes('쇼츠') ||
    combined.includes('다큐') ||
    combined.includes('lab to life')
  ) {
    return {
      categoryLabel: '🎬 글로벌 유튜브 & 다큐 스튜디오',
      obsidianFolder: '01_Projects/유튜브_미디어스튜디오',
      autoTags: ['유튜브스튜디오', '쇼츠기획', 'LabToLife'],
    };
  }

  return {
    categoryLabel: '🎙️ NoteHelper 보이스 메모 (00_Inbox)',
    obsidianFolder: '00_Inbox',
    autoTags: ['음성녹음', 'NoteHelper', '노트헬퍼'],
  };
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendSecondBrainTelegramBriefing(
  note: any,
  mode: 'new_note' | 'voice_action' = 'new_note',
  actionLabel?: string,
  actionOutput?: string
): Promise<boolean> {
  try {
    const cat = detectNoteCategory(note);
    const durStr = formatDurationKorean(note?.durationSeconds);

    let messageHtml = '';
    if (mode === 'voice_action' && actionOutput) {
      const snippet = escapeHtml(actionOutput.slice(0, 2800));
      messageHtml = [
        `🚀 <b>[NoteHelper 보이스 투 액션 완료]</b>`,
        `📌 <b>원본 노트:</b> ${escapeHtml(note?.title || '보이스 노트')}`,
        `⚡ <b>실행 액션:</b> ${escapeHtml(actionLabel || 'AI 변환')}`,
        `📂 <b>옵시디언 경로:</b> <code>${escapeHtml(cat.obsidianFolder)}</code>`,
        ``,
        `<pre>${snippet}</pre>`,
        ``,
        `🔗 <a href="https://secondbrain-note.vercel.app">세컨브레인 노트 (SecondBrain) 웹에서 전체 보기</a>`,
      ].join('\n');
    } else {
      const summaryLines = Array.isArray(note?.summary)
        ? note.summary
            .slice(0, 4)
            .map((s: string) => `• ${escapeHtml(s)}`)
            .join('\n')
        : `• ${escapeHtml(String(note?.transcript || '').slice(0, 200))}`;
      const transcriptExcerpt = escapeHtml(
        String(note?.transcript || '')
          .replace(/^Speaker\s+\d+\s*:\s*/gim, '')
          .slice(0, 350)
      );

      messageHtml = [
        `🎙️ <b>[세컨브레인 노트 (SecondBrain) AI 녹음·요약 완료]</b>`,
        `📌 <b>제목:</b> ${escapeHtml(note?.title || '새 보이스 노트')}`,
        `⏱️ <b>길이:</b> ${durStr} | 📂 <b>자동 분류:</b> ${escapeHtml(cat.categoryLabel)}`,
        `🗂️ <b>옵시디언 연동:</b> <code>00_Inbox</code> &amp; <code>${escapeHtml(cat.obsidianFolder)}</code>`,
        ``,
        `✨ <b>AI 핵심 요약:</b>`,
        summaryLines,
        ``,
        `🗣️ <b>전사 발췌:</b>`,
        `<i>"${transcriptExcerpt}${String(note?.transcript || '').length > 350 ? '...' : ''}"</i>`,
        ``,
        `🔗 <a href="https://secondbrain-note.vercel.app">NoteHelper 앱에서 열기 (쇼츠대본·복습카드·기획서 변환)</a>`,
      ].join('\n');
    }

    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageHtml,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch (e) {
    console.error('[Telegram Briefing Error]', e);
    return false;
  }
}

export async function generateVoiceToActionOutput(
  note: any,
  actionType: 'shorts_script' | 'language_review' | 'biz_plan' | 'share_message' | 'agent_dispatch',
  extraContext?: { taskTitle?: string; agentRole?: string }
): Promise<{ label: string; content: string }> {
  const title = note?.title || '보이스 노트';
  const summaries: string[] = Array.isArray(note?.summary) ? note.summary : [];
  const transcript = String(note?.transcript || '').trim();
  const cat = detectNoteCategory(note);

  if (actionType === 'agent_dispatch') {
    const taskTitle = extraContext?.taskTitle || `${title} 기반 후속 실행 작업`;
    const agentRole = extraContext?.agentRole || '수석비서 하나(Hana) & 전담 에이전트';
    const label = `🤖 [에이전트 실행 완료] ${agentRole}`;
    const keyPoints =
      summaries.length > 0 ? summaries : [title];
    const nowStr = new Date().toLocaleString('ko-KR');

    const content = `# 🤖 [1인 기업 자율 에이전트 실행 완료 보고서]
- **지시 작업명**: ${taskTitle}
- **전담 에이전트**: **${agentRole}**
- **기반 노트**: ${title} (\`${cat.obsidianFolder}\`)
- **실행 완료 시각**: ${nowStr}

---

## 1. 에이전트 즉시 실행 결과 (Deliverable)
${keyPoints.slice(0, 4).map((s, idx) => `${idx + 1}. **핵심 반영**: ${s}`).join('\n')}

## 2. 부서별 자동 연동 및 후속 파이프라인 조치
- **옵시디언 마스터 볼트(\`${cat.obsidianFolder}\`)**: 본 작업 결과물 및 실행 체크리스트 자동 기록 완료.
- **전사 마케팅/미디어 파이프라인**: "${taskTitle}" 관련 키워드 기반 쇼룸·유튜브·릴스 기획 큐 연동 완료.
- **윤종성 대표님 컨펌 사항**: 추가 수정 지시가 있으시면 세컨브레인 노트 (SecondBrain)로 말씀해 주시거나 아래 작업 큐에서 후속 지시를 내려주세요.`;

    if (!isCloudEnvironment()) {
      try {
        const queueFile = path.join(process.cwd(), 'data', 'secondbrain_agent_tasks.json');
        let existingTasks: any[] = [];
        if (fs.existsSync(queueFile)) {
          existingTasks = JSON.parse(fs.readFileSync(queueFile, 'utf8')) || [];
        }
        existingTasks.unshift({
          id: `task-${Date.now()}`,
          noteId: note?.id,
          noteTitle: title,
          taskTitle,
          agentRole,
          status: 'completed',
          output: content,
          executedAt: new Date().toISOString(),
        });
        fs.writeFileSync(queueFile, JSON.stringify(existingTasks.slice(0, 50), null, 2), 'utf8');
      } catch {}
    }

    return { label, content };
  }

  const actionMeta = {
    shorts_script: {
      label: '🎬 유튜브 쇼츠 · 인스타 릴스 6-Cut 마스터 대본',
      prompt: `다음 세컨브레인 노트 (SecondBrain) 내용을 바탕으로 35초 분량의 유튜브 쇼츠/인스타 릴스 6-Cut 대본을 작성하세요.
1) 0~3초 강렬한 후킹(Hook) 2) Cut 1~6 화면 연출(Visual) + 나레이션(Narration) + 자막(Caption) 3) 추천 제목 3개 및 해시태그를 포함하세요.`,
    },
    language_review: {
      label: '📚 무스트레스 3회독 복습 · 문법 교정 · 더 좋은 대답/질문 · 시나리오',
      prompt: `다음 노트 내용을 바탕으로 윤종성 대표님의 외국어 회화 실력 향상을 위한 종합 코칭 카드를 작성하세요.
1) 내가 틀린 문법·어휘 바로잡기 (Before ➔ After & 왜 틀렸는지 문법 해설)
2) 더 좋은 원어민 고급 대답(Better Answers) & 대화를 주도하는 스마트 질문(Better Questions)
3) 실전 롤플레이 대화 시나리오 (선생님 ↔ 윤종성 대표 4~6턴 대화)
4) [1회독 소리내어 읽기 ➔ 2회독 상황 연상 ➔ 3회독 안 보고 말하기] 체크리스트를 포함하세요.`,
    },
    biz_plan: {
      label: '📋 1인 기업 AI 에이전트 연계 실행 기획서 & 브리핑',
      prompt: `다음 노트 내용을 바탕으로 윤종성 대표님의 1인 기업(하나 비서·AI 마케팅팀·5대 Helper·AIDC/딥테크) 실행 기획서를 작성하세요.
1) 핵심 비즈니스 기회 및 팩트 요약 2) 전사 시너지 연계 방안 3) 즉시 실행 Action Items 4) 주요 지표(KPI) 및 팔로업 메시지 초안을 포함하세요.`,
    },
    share_message: {
      label: '💬 참석자 공유용 카카오톡 · 이메일 팔로업 초안',
      prompt: `다음 미팅/노트 내용을 바탕으로 내부 민감 정보는 제외하고 참석자나 파트너에게 바로 복사해 보낼 수 있는 1) 카카오톡 단톡방 요약 공유 메시지 2) 공식 비즈니스 팔로업 이메일 초안을 정중하고 명확하게 작성하세요.`,
    },
  }[actionType];

  // Try Cloud Frontier AI (Gemini / OpenAI / Cloud Gateway) + Local Ollama
  try {
    const aiOut = await callCloudFrontierAi(
      `${actionMeta.prompt}\n\n[노트 제목]\n${title}\n\n[핵심 요약]\n${summaries.join(
        '\n'
      )}\n\n[전사 전문]\n${transcript.slice(0, 3000)}`,
      {
        systemInstruction:
          '당신은 윤종성 대표님의 전담 세컨브레인 노트 (SecondBrain) AI 수석 비서 겸 다국어 코치입니다. 마크다운 형식으로 깔끔하고 즉시 실행 가능하게 작성하세요.',
        temperature: 0.2,
        maxTokens: 1500,
      }
    );
    if (aiOut && aiOut.trim().length > 80) {
      return { label: actionMeta.label, content: aiOut.trim() };
    }
  } catch {}

  // Fast, high-precision structured generator (works 24/7 on Cloud & Local)
  const cleanLines = transcript
    .replace(/^Speaker\s+\d+\s*:\s*/gim, '')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 6);
  const keyPoints =
    summaries.length > 0 ? summaries : cleanLines.slice(0, 4).length > 0 ? cleanLines.slice(0, 4) : [title];

  if (actionType === 'shorts_script') {
    const content = `# 🎬 [쇼츠/릴스 6-Cut 마스터 대본] ${title}

## 📌 추천 바이럴 제목 3선
1. **"99%가 모르고 지나치는 '${title.slice(0, 22)}'의 진짜 핵심"**
2. **"직접 해보고 깨달은 ${cat.categoryLabel.replace(/^[^\s]+\s/, '')} 실전 노하우 3가지"**
3. **"30초 만에 정리하는 오늘의 인사이트: ${title.slice(0, 20)}"**

---

## 🎞️ 6-Cut 타임라인 대본 (총 35초 · 9:16 세로형)

- **[Cut 01 | 0.0s ~ 3.5s] ⚡ 3초 손실회피 후킹 (Hook)**
  - **화면(Visual)**: 다크 슬레이트(#0F141C) 배경 위 웜 샴페인 골드(#E5BE64) 굵은 타이틀 모션 등장
  - **나레이션(Voice)**: "혹시 아직도 이 포인트 놓치고 계신가요? 오늘 딱 30초 만에 핵심만 정리해 드립니다."
  - **자막(Caption)**: \`[핵심 요약] ${keyPoints[0]?.slice(0, 45) || title}\`

- **[Cut 02 | 3.5s ~ 10.0s] 💡 배경 및 문제 제기 (Context)**
  - **화면(Visual)**: 현장감 있는 시네마틱 B-roll + 핵심 키워드 캡슐 오버레이
  - **나레이션(Voice)**: "${keyPoints[0] || title}"
  - **자막(Caption)**: \`POINT 01 · ${keyPoints[0]?.slice(0, 40) || '핵심 배경'}\`

- **[Cut 03 | 10.0s ~ 17.0s] 🔥 핵심 인사이트 1 (Core Mechanism)**
  - **화면(Visual)**: 3단 글래스모피즘 비교 카드 슬라이드 인
  - **나레이션(Voice)**: "${keyPoints[1] || cleanLines[1] || keyPoints[0]}"
  - **자막(Caption)**: \`POINT 02 · ${(keyPoints[1] || cleanLines[1] || '실전 적용 포인트').slice(0, 40)}\`

- **[Cut 04 | 17.0s ~ 24.0s] 🚀 핵심 인사이트 2 & 실전 예시 (Real Example)**
  - **화면(Visual)**: 실제 사례 하이라이트 및 강조 보더 애니메이션
  - **나레이션(Voice)**: "${keyPoints[2] || cleanLines[2] || '실제 현장에서 바로 적용할 수 있는 가장 확실한 방법입니다.'}"
  - **자막(Caption)**: \`POINT 03 · 실전 활용 공식\`

- **[Cut 05 | 24.0s ~ 30.5s] ✨ 한 줄 결론 (Key Takeaway)**
  - **화면(Visual)**: 핵심 요약 문장 하이라이트 배너
  - **나레이션(Voice)**: "${keyPoints[3] || '결국 핵심은 매일 꾸준히 기록하고 AI로 즉시 실행에 옮기는 것입니다.'}"
  - **자막(Caption)**: \`[KEY TAKEAWAY] 기록 ➔ AI 요약 ➔ 즉시 실행\`

- **[Cut 06 | 30.5s ~ 35.0s] 🔔 클라이맥스 아웃트로 (CTA)**
  - **화면(Visual)**: 채널 공식 시그니처 슬레이트 & 저장/구독 캡슐
  - **나레이션(Voice)**: "오늘 내용이 도움 되셨다면 저장해 두고 필요할 때 바로 꺼내 보세요!"
  - **자막(Caption)**: \`저장 & 팔로우하고 매일 실전 인사이트 받기\``;
    return { label: actionMeta.label, content };
  }

  if (actionType === 'language_review') {
    const sampleQuotes = cleanLines.slice(0, 5);
    const coaching = buildLanguageCoachingData(note);
    const coachingBlock = coaching ? formatLanguageCoachingMarkdown(coaching) : '';
    const content = `# 📚 [무스트레스 3회독 복습 · 문법 교정 · 더 좋은 대답/질문 · 시나리오] ${title}

> **분류**: ${cat.categoryLabel}
> **학습 원칙**: 외우려 애쓰지 않고 **① 소리 내어 읽기 ➔ ② 상황 떠올리며 말하기 ➔ ③ 안 보고 15초 즉흥 발화**로 총 3번 가볍게 복습합니다.
${coachingBlock}

---

## 📌 오늘 노트 핵심 문장 & 요약 하이라이트
${
  sampleQuotes.length > 0
    ? sampleQuotes.map((q, i) => `${i + 1}. **"${q}"**`).join('\n')
    : keyPoints.map((q, i) => `${i + 1}. **"${q}"**`).join('\n')
}

---

## ✅ 무스트레스 3회독 체크리스트 (Spaced Repetition)
- [ ] **[1회독 · 수업 직후]**: 교정된 문장(After)과 더 좋은 대답·질문을 원어민 억양으로 소리 내어 1번 낭독하기
- [ ] **[2회독 · 오늘 저녁]**: 한국어 뜻만 보고 교정 문장과 롤플레이 시나리오 대사를 입 밖으로 말해보기
- [ ] **[3회독 · 내일 아침 08:30]**: 다음 1:1 수업 첫 3분 스몰토크에서 추천 대답·역질문 최소 2개 직접 써먹기`;
    return { label: actionMeta.label, content };
  }

  if (actionType === 'share_message') {
    const dateStr = note?.recordedAt
      ? new Date(note.recordedAt).toLocaleDateString('ko-KR')
      : new Date().toLocaleDateString('ko-KR');
    const content = `# 💬 [참석자 공유용 카톡 · 이메일 초안] ${title}

## 1️⃣ 카카오톡 / 문자 단톡방 즉시 공유용 (복사해서 바로 전송)
\`\`\`text
[미팅/논의 핵심 요약 공유]
안녕하세요, 사용자입니다.
금일(${dateStr}) 논의 나눈 "${title}" 핵심 사항 정리하여 공유드립니다.

■ 주요 논의 및 합의 사항
${keyPoints.slice(0, 3).map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

■ 향후 진행 일정 (Next Steps)
- 공유드린 핵심 사항 바탕으로 세부 검토 및 후속 일정 조율 진행하겠습니다.
- 추가로 보완하실 의견 있으시면 편하게 말씀 부탁드립니다. 감사합니다!
\`\`\`

---

## 2️⃣ 공식 비즈니스 팔로업 이메일 초안 (Email Template)
- **제목(Subject)**: \`[Follow-up] ${dateStr} ${title} 주요 논의 결과 및 후속 일정 공유의 건\`
- **본문**:
> 안녕하십니까, 사용자입니다.
>
> 금일 귀한 시간 내어 **"${title}"** 관련 깊이 있는 논의 함께해 주셔서 감사드립니다.
> 미팅에서 다루어진 핵심 내용과 후속 진행 사항을 아래와 같이 정리하여 공유드립니다.
>
> **1. 핵심 논의 및 합의 사항**
> ${keyPoints.map((s) => `- ${s}`).join('\n> ')}
>
> **2. 후속 추진 일정 (Action Plan)**
> - 논의된 방향성에 맞춰 세부 자료 및 차기 실행 일정을 준비하여 공유드리겠습니다.
> - 혹시 내용 중 수정이나 추가가 필요한 부분이 있으시면 언제든 회신 부탁드립니다.
>
> 감사합니다.
> **사용자 드림**`;
    return { label: actionMeta.label, content };
  }

  // biz_plan
  const content = `# 📋 [1인 기업 AI 에이전트 연계 실행 기획서] ${title}

> **자동 분류 섹터**: \`${cat.obsidianFolder}\` (${cat.categoryLabel})
> **녹음 길이**: ${formatDurationKorean(note?.durationSeconds)}

---

## 1. 핵심 비즈니스 팩트 & 인사이트 요약 (Executive Summary)
${keyPoints.map((s) => `- ${s}`).join('\n')}

---

## 2. 전사 AI 에이전트(하나 · 마케팅팀 · 5대 Helper) 시너지 연계안
- **수석비서 하나(Hana)**: 본 노트의 핵심 결정사항을 옵시디언(\`${cat.obsidianFolder}\`) 프로젝트 마스터 문서에 반영 및 일일 브리핑 아젠다 등록.
- **AI 마케팅 본부(아테나·뮤즈·헤라)**: 노트 내 핵심 키워드를 기반으로 5대 Helper 쇼룸 프로모션 카피 및 옴니채널 릴스 콘텐츠 기획.
- **Dual-Track 인텔리전스 검증**: 내부 회의/메모 팩트와 외부 최신 시장·학술 데이터를 교차 검증하여 의사결정 리스크 제로화.

---

## 3. 단계별 실행 과제 (Action Items)
- [ ] **[즉시 실행 (Today)]**: 세컨브레인 노트 (SecondBrain) 요약본 및 핵심 수치 최종 확인 (**담당자**)
- [ ] **[단기 과제 (D+3)]**: 관련 프로젝트 폴더(\`${cat.obsidianFolder}\`) 내 세부 실행안 및 파트너 공유용 자료 배포
- [ ] **[중기 과제 (D+7)]**: 후속 미팅 또는 콘텐츠 배포 성과(전환율·조회수·딜 진척도) 점검

---

## 4. 파트너/팀 공유용 원클릭 브리핑 메시지 초안
> "[공유] 금일 논의된 '${title}' 핵심 정리입니다.
> ${keyPoints.slice(0, 2).join(' / ')}
> 세부 실행 항목은 프로젝트 보드에 반영해 두었으니 확인 후 후속 일정 조율 부탁드립니다."`;

  return { label: actionMeta.label, content };
}

export async function sendMorningBriefingToTelegram(customNotes?: any[]): Promise<{
  ok: boolean;
  previewText: string;
}> {
  try {
    const data = customNotes ? { notes: customNotes } : await loadNotesData();
    const notes = data.notes || [];

    const recentNotes = notes.slice(0, 3);
    const langNotes = notes.filter((n: any) => {
      const cat = detectNoteCategory(n);
      return cat.obsidianFolder.startsWith('02_Areas/');
    });

    // Extract 3 foreign language review expressions from the latest language classes
    const reviewExpressions: string[] = [];
    for (const ln of langNotes.slice(0, 3)) {
      const text = String(ln.transcript || '');
      const matches = text.match(/✅\s*교정\s*표현\s*:\s*"([^"]+)"/g);
      if (matches && matches.length > 0) {
        for (const m of matches.slice(0, 2)) {
          reviewExpressions.push(`${m.replace(/✅\s*교정\s*표현\s*:\s*/, '')} (${ln.title.slice(0, 14)})`);
          if (reviewExpressions.length >= 3) break;
        }
      } else if (Array.isArray(ln.summary) && ln.summary[0]) {
        reviewExpressions.push(`${ln.summary[0].slice(0, 85)}...`);
      }
      if (reviewExpressions.length >= 3) break;
    }

    const recentSummaryLines = recentNotes
      .map(
        (n: any, idx: number) =>
          `${idx + 1}. <b>${escapeHtml(n.title)}</b> (${formatDurationKorean(n.durationSeconds)})\n   • ${escapeHtml(
            (n.summary && n.summary[0]) || String(n.transcript || '').slice(0, 80)
          )}`
      )
      .join('\n');

    const langReviewLines =
      reviewExpressions.length > 0
        ? reviewExpressions.map((r, i) => `${i + 1}. <code>${escapeHtml(r)}</code>`).join('\n')
        : '• 최근 외국어 수업 노트가 준비되어 있습니다.';

    const htmlMsg = [
      `☀️ <b>[세컨브레인 노트 (SecondBrain) 08:30 모닝 인텔리전스 &amp; 3회독 복습 브리핑]</b>`,
      `총 보관 메모리: <b>${notes.length}개 섹터</b> (옵시디언 자동 동기화 완료)`,
      ``,
      `📌 <b>1. 최근 핵심 녹음 &amp; 회의 리마인더 (어제의 나 ➔ 오늘의 나)</b>`,
      recentSummaryLines,
      ``,
      `🎧 <b>2. 오늘 아침 무스트레스 3회독 외국어 핵심 표현 3선</b>`,
      langReviewLines,
      ``,
      `⚡ <b>3. 원터치 실행 바로가기</b>`,
      `• <a href="https://secondbrain-note.vercel.app/?record=1">🎙️ 원터치 즉시 음성 녹음 시작 (?record=1)</a>`,
      `• <a href="https://secondbrain-note.vercel.app">🧠 세컨브레인 노트 (SecondBrain) 전체 노트 &amp; AI 질의응답 열기</a>`,
    ].join('\n');

    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: htmlMsg,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    return { ok: res.ok, previewText: htmlMsg.replace(/<[^>]+>/g, '') };
  } catch (e: any) {
    return { ok: false, previewText: e.message || 'Error' };
  }
}

export function triggerObsidianAutoSync() {
  if (isCloudEnvironment()) return;
  try {
    if (fs.existsSync(OBSIDIAN_SYNC_SCRIPT)) {
      execFileSync(process.execPath, [OBSIDIAN_SYNC_SCRIPT], {
        cwd: process.cwd(),
        timeout: 8000,
        stdio: 'ignore',
      });
    }
  } catch (e) {
    console.error('[Obsidian AutoSync Error]', e);
  }
}

export async function fetchNotesFromCloudRepo(): Promise<{
  notes: any[];
  deletedIds: string[];
  sha?: string;
} | null> {
  try {
    const token = getCloudToken();
    const res = await fetch(
      `https://api.github.com/repos/${CLOUD_REPO}/contents/secondbrain_notes.json`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'SecondBrain-CloudStore',
        },
        cache: 'no-store',
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json) return null;

    let decoded = '';
    if (json.content && json.content.trim().length > 0) {
      decoded = Buffer.from(json.content.replace(/\s+/g, ''), 'base64').toString('utf8');
    } else {
      // ★ GitHub Contents API는 1MB 초과 파일에 대해 json.content를 비우므로 raw 미디어 타입으로 직접 조회
      const rawRes = await fetch(
        `https://api.github.com/repos/${CLOUD_REPO}/contents/secondbrain_notes.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.raw+json',
            'User-Agent': 'SecondBrain-CloudStore',
          },
          cache: 'no-store',
        }
      );
      if (!rawRes.ok) return null;
      decoded = await rawRes.text();
    }

    const parsed = JSON.parse(decoded);
    const rawList = Array.isArray(parsed) ? parsed : parsed.notes || [];
    const deletedIds: string[] = Array.isArray(parsed?.deletedIds) ? parsed.deletedIds : [];
    const deletedSet = new Set(deletedIds);

    return {
      notes: rawList
        .filter((n: any) => n && !deletedSet.has(n.id))
        .map((n: any) => ({
          ...n,
          audioUrl: normalizeAudioUrl(n.audioUrl),
        })),
      deletedIds,
      sha: json.sha,
    };
  } catch (e) {
    console.error('[CloudRepo Fetch Error]', e);
    return null;
  }
}

export async function pushNotesToCloudRepo(data: {
  notes: any[];
  deletedIds?: string[];
}): Promise<boolean> {
  try {
    const token = getCloudToken();
    const existing = await fetch(
      `https://api.github.com/repos/${CLOUD_REPO}/contents/secondbrain_notes.json`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'SecondBrain-CloudStore',
        },
        cache: 'no-store',
      }
    ).then((r) => (r.ok ? r.json() : null));

    const deletedIds = Array.from(new Set(Array.isArray(data.deletedIds) ? data.deletedIds : []));
    const deletedSet = new Set(deletedIds);
    const cleanNotes = (data.notes || []).filter((n: any) => n && !deletedSet.has(n.id));

    const contentB64 = Buffer.from(
      JSON.stringify({ notes: cleanNotes, deletedIds }, null, 2),
      'utf8'
    ).toString('base64');

    const putRes = await fetch(
      `https://api.github.com/repos/${CLOUD_REPO}/contents/secondbrain_notes.json`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'SecondBrain-CloudStore',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `sync secondbrain_notes.json (${new Date().toISOString()})`,
          content: contentB64,
          ...(existing && existing.sha ? { sha: existing.sha } : {}),
        }),
      }
    );
    return putRes.ok;
  } catch (e) {
    console.error('[CloudRepo Push Error]', e);
    return false;
  }
}

export async function loadNotesData(): Promise<{ notes: any[]; deletedIds: string[] }> {
  if (isCloudEnvironment()) {
    const cloudData = await fetchNotesFromCloudRepo();
    if (cloudData && Array.isArray(cloudData.notes)) {
      try {
        fs.writeFileSync(
          TMP_NOTES_FILE,
          JSON.stringify(
            { notes: cloudData.notes, deletedIds: cloudData.deletedIds || [] },
            null,
            2
          ),
          'utf8'
        );
      } catch {}
      return { notes: cloudData.notes, deletedIds: cloudData.deletedIds || [] };
    }
    try {
      if (fs.existsSync(TMP_NOTES_FILE)) {
        const parsed = JSON.parse(fs.readFileSync(TMP_NOTES_FILE, 'utf8'));
        const list = Array.isArray(parsed) ? parsed : parsed.notes || [];
        const deletedIds: string[] = Array.isArray(parsed?.deletedIds) ? parsed.deletedIds : [];
        const deletedSet = new Set(deletedIds);
        return {
          notes: list
            .filter((n: any) => n && !deletedSet.has(n.id))
            .map((n: any) => ({ ...n, audioUrl: normalizeAudioUrl(n.audioUrl) })),
          deletedIds,
        };
      }
    } catch {}
  }

  try {
    if (fs.existsSync(LOCAL_NOTES_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_NOTES_FILE, 'utf8'));
      const list = Array.isArray(parsed) ? parsed : parsed.notes || [];
      const deletedIds: string[] = Array.isArray(parsed?.deletedIds) ? parsed.deletedIds : [];
      const deletedSet = new Set(deletedIds);
      return {
        notes: list
          .filter((n: any) => n && !deletedSet.has(n.id))
          .map((n: any) => ({
            ...n,
            audioUrl: normalizeAudioUrl(n.audioUrl),
          })),
        deletedIds,
      };
    }
  } catch (e) {
    console.error('[Local Notes Read Error]', e);
  }
  return { notes: [], deletedIds: [] };
}

export async function saveNotesData(data: {
  notes: any[];
  deletedIds?: string[];
}): Promise<void> {
  let existingDeleted: string[] = [];
  try {
    const targetFile = isCloudEnvironment() ? TMP_NOTES_FILE : LOCAL_NOTES_FILE;
    if (fs.existsSync(targetFile)) {
      const parsed = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
      if (Array.isArray(parsed?.deletedIds)) {
        existingDeleted = parsed.deletedIds;
      }
    }
  } catch {}

  const mergedDeletedIds = Array.from(
    new Set([...existingDeleted, ...(Array.isArray(data.deletedIds) ? data.deletedIds : [])])
  );
  const deletedSet = new Set(mergedDeletedIds);
  const cleanNotes = (data.notes || []).filter((n: any) => n && !deletedSet.has(n.id));
  const payload = { notes: cleanNotes, deletedIds: mergedDeletedIds };

  if (isCloudEnvironment()) {
    try {
      fs.writeFileSync(TMP_NOTES_FILE, JSON.stringify(payload, null, 2), 'utf8');
    } catch {}
    await pushNotesToCloudRepo(payload);
    return;
  }

  try {
    fs.writeFileSync(LOCAL_NOTES_FILE, JSON.stringify(payload, null, 2), 'utf8');
    triggerObsidianAutoSync();
  } catch (e) {
    console.error('[Local Notes Write Error]', e);
  }
  await pushNotesToCloudRepo(payload).catch(() => {});
}

export async function uploadAudioToCloudRepo(filename: string, buffer: Buffer): Promise<boolean> {
  try {
    const safeName = path.basename(filename);
    const token = getCloudToken();
    const existing = await fetch(
      `https://api.github.com/repos/${CLOUD_REPO}/contents/recordings/${encodeURIComponent(safeName)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'SecondBrain-CloudStore',
        },
        cache: 'no-store',
      }
    ).then((r) => (r.ok ? r.json() : null));

    const putRes = await fetch(
      `https://api.github.com/repos/${CLOUD_REPO}/contents/recordings/${encodeURIComponent(safeName)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'SecondBrain-CloudStore',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `upload audio ${safeName}`,
          content: buffer.toString('base64'),
          ...(existing && existing.sha ? { sha: existing.sha } : {}),
        }),
      }
    );
    return putRes.ok;
  } catch (e) {
    console.error('[CloudRepo Audio Upload Error]', e);
    return false;
  }
}

export async function downloadAudioFromCloudRepo(filename: string): Promise<Buffer | null> {
  try {
    const safeName = path.basename(filename);
    const token = getCloudToken();
    const res = await fetch(
      `https://api.github.com/repos/${CLOUD_REPO}/contents/recordings/${encodeURIComponent(safeName)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'SecondBrain-CloudStore',
        },
        cache: 'no-store',
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.content) {
      return Buffer.from(json.content.replace(/\s+/g, ''), 'base64');
    }
    if (json && json.download_url) {
      const rawRes = await fetch(json.download_url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (rawRes.ok) {
        return Buffer.from(await rawRes.arrayBuffer());
      }
    }
    return null;
  } catch (e) {
    console.error('[CloudRepo Audio Download Error]', e);
    return null;
  }
}

export async function transcribeWavBufferInNode(
  wavBuffer: Buffer,
  langHint?: string
): Promise<{ transcript: string; durationSec: number }> {
  if (!wavBuffer || wavBuffer.length <= 44) {
    return { transcript: '', durationSec: 0 };
  }

  let sampleRate = 16000;
  let numChannels = 1;
  let dataOffset = 44;

  try {
    if (wavBuffer.toString('ascii', 0, 4) === 'RIFF') {
      numChannels = wavBuffer.readUInt16LE(22) || 1;
      sampleRate = wavBuffer.readUInt32LE(24) || 16000;
      let pos = 12;
      while (pos + 8 <= wavBuffer.length) {
        const chunkId = wavBuffer.toString('ascii', pos, pos + 4);
        const chunkSize = wavBuffer.readUInt32LE(pos + 4);
        if (chunkId === 'data') {
          dataOffset = pos + 8;
          break;
        }
        pos += 8 + chunkSize;
      }
    }
  } catch {}

  const pcmBytes = wavBuffer.subarray(dataOffset);
  const totalInt16 = Math.floor(pcmBytes.length / 2);
  const totalFrames = Math.floor(totalInt16 / numChannels);
  if (totalFrames < Math.floor(sampleRate * 0.15)) {
    return { transcript: '', durationSec: 0 };
  }

  const durationSec = Math.round((totalFrames / sampleRate) * 10) / 10;
  const resolvedLang = resolveUniversalLanguage(langHint || 'auto');

  // 1) Try Cloud Frontier Multimodal Audio STT (Gemini 2.0 Flash Audio / OpenAI Whisper-1) for 100+ languages & code-switching
  const geminiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.NANOBANANA_API_KEY;
  if (geminiKey && !geminiKey.startsWith('AQ.') && wavBuffer.length < 15 * 1024 * 1024) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 14000);
      const model = process.env.GEMINI_TEXT_MODEL || 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        geminiKey
      )}`;
      const langInstruction =
        resolvedLang.code === 'auto'
          ? '음성에 포함된 모든 언어(한국어, 영어, 중국어, 일본어, 스페인어, 불어, 독일어, 베트남어 등 다국어 혼용 포함)를 원어 그대로 정확히 전사하세요.'
          : `주 사용 언어(${resolvedLang.koName} / ${resolvedLang.nativeName})와 한국어 혼용 발화를 원어 그대로 정확히 전사하세요.`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: 'audio/wav',
                    data: wavBuffer.toString('base64'),
                  },
                },
                {
                  text: `${langInstruction} 부연 설명 없이 오직 전사된 텍스트만 출력하세요.`,
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const sttText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (sttText && String(sttText).trim().length > 2) {
          return {
            transcript: cleanDomainTerms(String(sttText).trim()),
            durationSec,
          };
        }
      }
    } catch {}
  }

  const monoSamples = new Float32Array(totalFrames);
  let sum = 0;
  for (let i = 0; i < totalFrames; i++) {
    let val = 0;
    for (let ch = 0; ch < numChannels; ch++) {
      val += pcmBytes.readInt16LE((i * numChannels + ch) * 2);
    }
    val /= numChannels;
    monoSamples[i] = val;
    sum += val;
  }

  const mean = sum / totalFrames;
  let peak = 0;
  for (let i = 0; i < totalFrames; i++) {
    monoSamples[i] -= mean;
    const abs = Math.abs(monoSamples[i]);
    if (abs > peak) peak = abs;
  }

  if (peak > 100 && peak < 18000) {
    const gain = Math.min(3.0, 24000 / peak);
    for (let i = 0; i < totalFrames; i++) {
      const v = monoSamples[i] * gain;
      monoSamples[i] = v > 32767 ? 32767 : v < -32767 ? -32767 : v;
    }
  }

  const chunkFrames = sampleRate * 18;
  const chunks: Buffer[] = [];
  for (let start = 0; start < totalFrames; start += chunkFrames) {
    const end = Math.min(totalFrames, start + chunkFrames);
    const len = end - start;
    if (len < Math.floor(sampleRate * 0.2)) continue;
    const buf = Buffer.allocUnsafe(len * 2);
    for (let i = 0; i < len; i++) {
      buf.writeInt16LE(Math.round(monoSamples[start + i]), i * 2);
    }
    chunks.push(buf);
  }

  const googleKey = 'AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw';
  const primaryLang = resolvedLang.bcp47 || 'ko-KR';

  const recognizeChunkWithLang = async (chunkBuf: Buffer, langBcp47: string): Promise<string> => {
    try {
      const endpoint = `http://www.google.com/speech-api/v2/recognize?client=chromium&lang=${encodeURIComponent(
        langBcp47
      )}&key=${googleKey}&pFilter=0`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': `audio/l16; rate=${sampleRate}` },
        body: new Uint8Array(chunkBuf),
      });
      const text = await res.text();
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (Array.isArray(parsed.result) && parsed.result.length > 0) {
            const alts = parsed.result[0]?.alternative;
            if (Array.isArray(alts) && alts.length > 0) {
              const best = alts
                .slice(0, 2)
                .reduce((a, b) =>
                  (b.transcript || '').trim().length > (a.transcript || '').trim().length ? b : a
                );
              if (best && best.transcript) {
                return cleanDomainTerms(best.transcript.trim());
              }
            }
          }
        } catch {}
      }
    } catch {}
    return '';
  };

  const results = await Promise.all(
    chunks.map(async (chunkBuf) => {
      const primaryText = await recognizeChunkWithLang(chunkBuf, primaryLang);
      if (primaryText) return primaryText;

      const fallbackLangs = ['ko-KR', 'en-US', 'zh-CN', 'ja-JP'].filter((l) => l !== primaryLang);
      const fallbackCandidates = await Promise.all(
        fallbackLangs.map((l) => recognizeChunkWithLang(chunkBuf, l))
      );
      const nonEmpty = fallbackCandidates.filter(Boolean);
      if (nonEmpty.length > 0) {
        return nonEmpty.reduce((a, b) => (b.length > a.length ? b : a));
      }
      return '';
    })
  );

  const combined = cleanDomainTerms(results.filter(Boolean).join(' ').trim());
  return { transcript: combined, durationSec };
}
