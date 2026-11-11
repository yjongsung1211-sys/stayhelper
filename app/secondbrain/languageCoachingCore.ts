export interface GrammarCorrectionItem {
  timeStr?: string;
  timeSec?: number;
  myWrongSentence: string;
  correctedSentence: string;
  pronunciation: string;
  grammarPoint: string;
}

export interface BetterResponseItem {
  situation: string;
  betterSentence: string;
  pronunciation: string;
  koreanMeaning: string;
  nuanceTip: string;
}

export interface BetterQuestionItem {
  context: string;
  questionSentence: string;
  pronunciation: string;
  koreanMeaning: string;
}

export interface ScenarioTurn {
  role: 'Tutor' | 'Me';
  speakerLabel: string;
  foreignText: string;
  pronunciation: string;
  koreanText: string;
}

export interface LanguageCoachingData {
  lang: string;
  langBadge: string;
  ttsLang: string;
  grammarCorrections: GrammarCorrectionItem[];
  betterAnswers: BetterResponseItem[];
  betterQuestions: BetterQuestionItem[];
  scenarioTitle: string;
  scenarioContext: string;
  scenarioTurns: ScenarioTurn[];
}

export const GLOBAL_COACHING_LANGUAGES = [
  { code: 'zh', bcp47: 'zh-CN', flag: '🇨🇳', label: '중국어 (中文)' },
  { code: 'en', bcp47: 'en-US', flag: '🇺🇸', label: '영어 (English)' },
  { code: 'ja', bcp47: 'ja-JP', flag: '🇯🇵', label: '일본어 (日本語)' },
  { code: 'es', bcp47: 'es-ES', flag: '🇪🇸', label: '스페인어 (Español)' },
  { code: 'fr', bcp47: 'fr-FR', flag: '🇫🇷', label: '프랑스어 (Français)' },
  { code: 'de', bcp47: 'de-DE', flag: '🇩🇪', label: '독일어 (Deutsch)' },
  { code: 'vi', bcp47: 'vi-VN', flag: '🇻🇳', label: '베트남어 (Tiếng Việt)' },
  { code: 'th', bcp47: 'th-TH', flag: '🇹🇭', label: '태국어 (ภาษาไทย)' },
  { code: 'id', bcp47: 'id-ID', flag: '🇮🇩', label: '인도네시아어 (Bahasa)' },
  { code: 'ru', bcp47: 'ru-RU', flag: '🇷🇺', label: '러시아어 (Русский)' },
  { code: 'ar', bcp47: 'ar-SA', flag: '🇸🇦', label: '아랍어 (العربية)' },
  { code: 'pt', bcp47: 'pt-BR', flag: '🇧🇷', label: '포르투갈어 (Português)' },
  { code: 'it', bcp47: 'it-IT', flag: '🇮🇹', label: '이탈리아어 (Italiano)' },
  { code: 'hi', bcp47: 'hi-IN', flag: '🇮🇳', label: '힌디어 (हिन्दी)' },
  { code: 'tr', bcp47: 'tr-TR', flag: '🇹🇷', label: '튀르키예어 (Türkçe)' },
  { code: 'yue', bcp47: 'yue-Hant-HK', flag: '🇭🇰', label: '광둥어 (粵語)' },
] as const;

export function detectNoteLanguageCode(note: any): string | null {
  if (!note) return null;
  if (note.aiCoaching && note.aiCoaching.lang) {
    return String(note.aiCoaching.lang);
  }
  if (note.targetLang && note.targetLang !== 'auto' && note.targetLang !== 'ko') {
    return String(note.targetLang);
  }

  const titleAndCat = `${note.title || ''} ${note.categoryLabel || ''} ${note.categoryFolder || ''}`.toLowerCase();
  const body = `${note.structuredSummary || ''} ${note.transcript || ''}`;

  if (/프랑스어|불어|french|français|bonjour/i.test(titleAndCat + ' ' + body)) return 'fr';
  if (/독일어|독어|german|deutsch|guten tag/i.test(titleAndCat + ' ' + body)) return 'de';
  if (/베트남어|vietnamese|tiếng việt|xin chào/i.test(titleAndCat + ' ' + body)) return 'vi';
  if (/태국어|thai|ภาษาไทย|[\u0E00-\u0E7F]{3,}/i.test(titleAndCat + ' ' + body)) return 'th';
  if (/인도네시아어|indonesian|bahasa indonesia/i.test(titleAndCat + ' ' + body)) return 'id';
  if (/러시아어|russian|русский|[\u0400-\u04FF]{4,}/i.test(titleAndCat + ' ' + body)) return 'ru';
  if (/아랍어|arabic|العربية|[\u0600-\u06FF]{4,}/i.test(titleAndCat + ' ' + body)) return 'ar';
  if (/포르투갈어|portuguese|português/i.test(titleAndCat + ' ' + body)) return 'pt';
  if (/이탈리아어|이태리어|italian|italiano/i.test(titleAndCat + ' ' + body)) return 'it';
  if (/힌디어|hindi|हिन्दी|[\u0900-\u097F]{4,}/i.test(titleAndCat + ' ' + body)) return 'hi';
  if (/튀르키예어|터키어|turkish|türkçe/i.test(titleAndCat + ' ' + body)) return 'tr';
  if (/광둥어|cantonese|粵語/i.test(titleAndCat + ' ' + body)) return 'yue';

  if (
    titleAndCat.includes('중국어') ||
    titleAndCat.includes('중문') ||
    titleAndCat.includes('chinese') ||
    /[\u4e00-\u9fff]{6,}/.test(body)
  ) {
    return 'zh';
  }
  if (
    titleAndCat.includes('일본어') ||
    titleAndCat.includes('japanese') ||
    /[\u3040-\u30ff]{4,}/.test(body)
  ) {
    return 'ja';
  }
  if (
    titleAndCat.includes('스페인어') ||
    titleAndCat.includes('spanish') ||
    titleAndCat.includes('español') ||
    /\b(hola|español|gracias|buenos días)\b/i.test(body)
  ) {
    return 'es';
  }
  if (
    titleAndCat.includes('영어') ||
    titleAndCat.includes('english') ||
    /[A-Za-z]{4,}\s+[A-Za-z]{4,}\s+[A-Za-z]{4,}\s+[A-Za-z]{4,}/.test(body)
  ) {
    return 'en';
  }
  return null;
}

export function isLanguageStudyNote(note: any): boolean {
  return detectNoteLanguageCode(note) !== null;
}

export function buildLanguageCoachingData(
  note: any,
  overrideLang?: string
): LanguageCoachingData | null {
  if (!note) return null;
  if (note.aiCoaching && (!overrideLang || note.aiCoaching.lang === overrideLang)) {
    return note.aiCoaching as LanguageCoachingData;
  }
  const lang = overrideLang || detectNoteLanguageCode(note);
  if (!lang) return null;
  return buildUniversalFallbackCoaching(note, lang);
}

export function buildUniversalFallbackCoaching(note: any, langCode: string): LanguageCoachingData {
  if (note?.aiCoaching && note.aiCoaching.lang === langCode) {
    return note.aiCoaching as LanguageCoachingData;
  }
  const found = GLOBAL_COACHING_LANGUAGES.find((x) => x.code === langCode);
  const label = found ? `${found.flag} ${found.label}` : `🌍 ${langCode} 다국어`;
  const bcp47 = found ? found.bcp47 : 'en-US';

  return {
    lang: langCode,
    langBadge: `${label} AI 1:1 맞춤 코칭`,
    ttsLang: bcp47,
    grammarCorrections: [
      {
        myWrongSentence: `"${String(note?.title || '녹음된 음성 노트').slice(0, 45)}" 발화 문장 분석 대기 중`,
        correctedSentence: `상단의 [✨ AI 실시간 다국어 코칭 생성] 버튼을 누르시면 녹음된 전사 원문을 바탕으로 ${label} 원어민 표현 교정을 즉시 생성합니다.`,
        pronunciation: `${label} 원어민 발음 및 억양 가이드`,
        grammarPoint: `녹음된 대화 원문을 기반으로 실시간 문법 교정, 원어민 추천 대답, 역질문, 롤플레이 시나리오를 생성할 수 있습니다.`,
      },
    ],
    betterAnswers: [],
    betterQuestions: [],
    scenarioTitle: `${label} 실전 롤플레이 시나리오`,
    scenarioContext: `[✨ AI 실시간 다국어 코칭 생성]을 클릭하면 현재 노트 내용을 기반으로 ${label} 대화가 자동 완성됩니다.`,
    scenarioTurns: [],
  };
}

export function formatLanguageCoachingMarkdown(data: LanguageCoachingData): string {
  const corrLines = data.grammarCorrections
    .map(
      (c, i) =>
        `### 교정 ${i + 1}${c.timeStr ? ` (${c.timeStr})` : ''}\n- **❌ 내가 한 말 (Before)**: ${
          c.myWrongSentence
        }\n- **✅ 바른 원어민 문장 (After)**: **${c.correctedSentence}**\n- **🗣️ 발음 가이드**: \`${
          c.pronunciation
        }\`\n- **💡 핵심 문법·어법 해설**: ${c.grammarPoint}`
    )
    .join('\n\n');

  const ansLines = data.betterAnswers
    .map(
      (a, i) =>
        `${i + 1}. **[상황: ${a.situation}]**\n   - **🌟 더 좋은 원어민 대답**: **${
          a.betterSentence
        }**\n   - **🗣️ 발음**: \`${a.pronunciation}\`\n   - **🇰🇷 뜻**: ${
          a.koreanMeaning
        }\n   - **📌 뉘앙스 팁**: ${a.nuanceTip}`
    )
    .join('\n\n');

  const qLines = data.betterQuestions
    .map(
      (q, i) =>
        `${i + 1}. **[맥락: ${q.context}]**\n   - **❓ 추천 역질문**: **${
          q.questionSentence
        }**\n   - **🗣️ 발음**: \`${q.pronunciation}\`\n   - **🇰🇷 뜻**: ${q.koreanMeaning}`
    )
    .join('\n\n');

  const scenLines = data.scenarioTurns
    .map(
      (t) =>
        `- **${t.speakerLabel}**: **${t.foreignText}**\n  - 발음: \`${t.pronunciation}\`\n  - 해석: (${t.koreanText})`
    )
    .join('\n');

  return `\n\n---\n\n## 🎓 [언어 학습 전담 AI 코칭] 1. 내가 틀린 문법 바로잡기 (Before ➔ After)\n\n${corrLines}\n\n## 💬 2. 더 좋은 대답(Better Answers) & 대화를 주도하는 스마트 질문(Better Questions)\n\n### 🌟 A. 한 단계 수준 높은 원어민 대답 추천\n${ansLines}\n\n### ❓ B. 선생님께 역질문하여 대화를 이끄는 질문 추천\n${qLines}\n\n## 🎭 3. 실전 롤플레이 대화 시나리오: ${data.scenarioTitle}\n> ${data.scenarioContext}\n\n${scenLines}`;
}
