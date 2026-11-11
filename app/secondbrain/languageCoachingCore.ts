function parseTimeStrToSec(timeStr?: string): number | null {
  if (!timeStr) return null;
  const clean = timeStr.replace(/[\[\]]/g, '').trim();
  const parts = clean.split(':').map((p) => parseInt(p, 10));
  if (parts.some((n) => isNaN(n))) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
}

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

  // Exclude pure Korean business M&A meetings or hardware test memos unless explicitly tagged
  if (
    titleAndCat.includes('킥오프 회의') ||
    titleAndCat.includes('전략 회의') ||
    titleAndCat.includes('실시간 전사 시스템 구축') ||
    titleAndCat.includes('신규 제작 및 모바일 실시간 테스트')
  ) {
    return null;
  }

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
    /\b(hola|español|inteligencia artificial|ahorrar|enseñar)\b/i.test(body)
  ) {
    return 'es';
  }
  if (
    titleAndCat.includes('영어') ||
    titleAndCat.includes('english') ||
    titleAndCat.includes('discussion') ||
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

  const id = String(note.id || '');
  const title = String(note.title || '');
  const text = `${note.structuredSummary || ''}\n${note.transcript || ''}`;

  // 1. 🇨🇳 중국어 수업 노트 맞춤 문법 교정 · 더 좋은 대답/질문 · 시나리오
  if (lang === 'zh') {
    if (id.includes('chn-class-2')) {
      return {
        lang: 'zh',
        langBadge: '🇨🇳 비즈니스 중국어 1:1 코칭',
        ttsLang: 'zh-CN',
        grammarCorrections: [
          {
            myWrongSentence: '我在上海体育大学学习了武术，现在做AI工作。 (한국식 단순 나열)',
            correctedSentence: '我毕业于上海体育学院武术专业，目前在经营一家AI自动化一人企业。',
            pronunciation: 'Wǒ bìyè yú Shànghǎi Tǐyù Xuéyuàn wǔshù zhuānyè, mùqián zài jīngyíng yì jiā AI zìdònghuà yìrén qǐyè.',
            grammarPoint: '대학 출신을 말할 때는 단순 "学习了(배웠다)"보다 "毕业于 ~ 专业(~ 전공을 졸업했다)"가 훨씬 격식 있고 자연스러우며, 사업 운영은 "做工作" 대신 동사 "经营(운영하다)"을 씁니다.',
          },
          {
            myWrongSentence: '中国的CXMT半导体公司最近很大。 (형용사 술어문 어색함)',
            correctedSentence: '最近中国的长鑫存储（CXMT）在内存芯片领域发展得非常快。',
            pronunciation: 'Zuìjìn Zhōngguó de Chángxīn Cúnchǔ (CXMT) zài nèicún xīnpiàn lǐngyù fāzhǎn de fēicháng kuài.',
            grammarPoint: '기업이 성장한다는 뜻으로 "很大(크다)"를 쓰면 규모만 뜻하게 됩니다. 정도보어 구조인 "发展得非常快(발전 속도가 매우 빠르다)" 또는 "势头很猛(기세가 무섭다)"으로 교정해야 정확합니다.',
          },
          {
            myWrongSentence: '我的家人会说四个国家的话。 ("네 나라 말" 직역)',
            correctedSentence: '我们全家人加起来一共会说四门外语。',
            pronunciation: 'Wǒmen quánjiārén jiā qǐlái yígòng huì shuō sì mén wàiyǔ.',
            grammarPoint: '언어를 세는 양사는 "个"가 아니라 "门(mén)"을 사용하며("四门语言 / 四门外语"), 가족 구성원의 능력을 합쳐 말할 때는 "加起来(합쳐서)"를 넣으면 원어민처럼 매끄러워집니다.',
          },
        ],
        betterAnswers: [
          {
            situation: '선생님이 상해 유학 시절과 현재 AI 사업의 연결고리를 물었을 때',
            betterSentence: '以前练散打培养了我的耐力和抗压能力，这对现在做AI创业非常有帮助。',
            pronunciation: 'Yǐqián liàn sǎndǎ péiyǎng le wǒ de nàilì hé kàngyā nénglì, zhè duì xiànzài zuò AI chuàngyè fēicháng yǒu bāngzhù.',
            koreanMeaning: '과거 산타 선수 훈련이 제 지구력과 스트레스 저항력을 길러주었고, 이것이 지금 AI 창업에 큰 도움이 됩니다.',
            nuanceTip: '"培养了 ~ 能力(~ 능력을 길러주었다)"와 "抗压能力(압박을 견디는 힘)"를 쓰면 설득력이 2배 높아집니다.',
          },
          {
            situation: '테슬라 FSD(자율주행)와 피지컬 AI 트렌드를 설명할 때',
            betterSentence: '随着算力中心的扩建，自动驾驶和具身智能（Physical AI）正在彻底改变制造业。',
            pronunciation: 'Suízhe suànlì zhōngxīn de kuòjiàn, zìdòng jiàshǐ hé jùshēn zhìnéng (Physical AI) zhèngzài chèdǐ gǎibiàn zhìzàoyè.',
            koreanMeaning: 'AI 연산 데이터센터(算力中心)가 확충됨에 따라 자율주행과 피지컬 AI(具身智能)가 제조업을 뿌리째 바꾸고 있습니다.',
            nuanceTip: '중국 테크 업계에서 Physical AI는 공식 용어로 "具身智能(jùshēn zhìnéng)"이라 부릅니다.',
          },
        ],
        betterQuestions: [
          {
            context: '중국 현지에서 테슬라 FSD나 자율주행 전기차 체감이 어떤지 역질문할 때',
            questionSentence: '现在中国国内用智驾（智能驾驶）的人多吗？大家的反馈怎么样？',
            pronunciation: 'Xiànzài Zhōngguó guónèi yòng zhìjià (zhìnéng jiàshǐ) de rén duō ma? Dàjiā de fǎnkuì zěnmeyàng?',
            koreanMeaning: '현재 중국 국내에서 스마트 자율주행(智驾)을 쓰는 사람이 많나요? 대중들의 반응(피드백)은 어떤가요?',
          },
          {
            context: '선생님께 중국의 AI 에이전트 활용 트렌드를 물어볼 때',
            questionSentence: '在中国，像我这样用AI做“一人公司”的创业者多不多？',
            pronunciation: 'Zài Zhōngguó, xiàng wǒ zhèyàng yòng AI zuò “yìrén gōngsī” de chuàngyèzhě duō bu duō?',
            koreanMeaning: '중국에서도 저처럼 AI를 활용해 "1인 기업"을 운영하는 창업자가 많은가요?',
          },
        ],
        scenarioTitle: '상해 유학 경험 & 한·중 반도체·AI 자율주행 비즈니스 대담',
        scenarioContext: '중국어 원어민 선생님(또는 중국 테크 파트너)과 첫인사 후 유학 배경과 AI·반도체 트렌드를 자연스럽게 주고받는 실전 시나리오입니다.',
        scenarioTurns: [
          {
            role: 'Tutor',
            speakerLabel: '중국어 선생님',
            foreignText: '听说您以前在上海留学过，当时学的是什么专业呢？',
            pronunciation: 'Tīngshuō nín yǐqián zài Shànghǎi liúxué guo, dāngshí xué de shì shénme zhuānyè ne?',
            koreanText: '예전에 상해에서 유학하셨다고 들었는데, 당시 어떤 전공을 공부하셨나요?',
          },
          {
            role: 'Me',
            speakerLabel: '윤종성 대표',
            foreignText: '我毕业于上海体育学院武术散打专业，那段经历培养了我持之以恒的耐力。',
            pronunciation: 'Wǒ bìyè yú Shànghǎi Tǐyù Xuéyuàn wǔshù sǎndǎ zhuānyè, nà duàn jīnglì péiyǎng le wǒ chízhīyǐhéng de nàilì.',
            koreanText: '상해체육학원 우슈 산타 전공을 졸업했는데, 그 경험이 끝까지 지속하는 지구력을 길러주었습니다.',
          },
          {
            role: 'Tutor',
            speakerLabel: '중국어 선생님',
            foreignText: '太厉害了！那您现在主要做什么行业的工作呢？',
            pronunciation: 'Tài lìhai le! Nà nín xiànzài zhǔyào zuò shénme hángyè de gōngzuò ne?',
            koreanText: '대단하시네요! 그럼 지금은 주로 어떤 업계의 일을 하고 계신가요?',
          },
          {
            role: 'Me',
            speakerLabel: '윤종성 대표',
            foreignText: '我现在经营一家AI自动化一人企业，同时也在关注AI算力中心和长鑫存储等半导体动态。在中国用AI做一人公司的创业者多吗？',
            pronunciation: 'Wǒ xiànzài jīngyíng yì jiā AI zìdònghuà yìrén qǐyè, tóngshí yě zài guānzhù AI suànlì zhōngxīn hé Chángxīn Cúnchǔ děng bàndǎotǐ dòngtài. Zài Zhōngguó yòng AI zuò yìrén gōngsī de chuàngyèzhě duō ma?',
            koreanText: '현재 AI 자동화 1인 기업을 운영하면서 AI 데이터센터와 창신메모리(CXMT) 같은 반도체 동향도 주시하고 있습니다. 중국에서도 AI로 1인 기업을 하는 창업자가 많나요?',
          },
        ],
      };
    }

    // Default / 60-min hardware Chinese class (note-hw-9-252967126) & chn-class-1
    return {
      lang: 'zh',
      langBadge: '🇨🇳 비즈니스 중국어 1:1 코칭 (60분 수업 실전 교정)',
      ttsLang: 'zh-CN',
      grammarCorrections: [
        {
          timeStr: '10:15',
          timeSec: 615,
          myWrongSentence: '如果他们离婚的话，公司有 Owner Risk… 中文怎么说？ (오너 리스크 표현 부재)',
          correctedSentence: '如果管理层出现私人问题，公司可能会面临严重的“舆情危机”，导致股价下跌。',
          pronunciation: 'Rúguǒ guǎnlǐcéng chūxiàn sīrén wèntí, gōngsī kěnéng huì miànlín yánzhòng de “yúqíng wēijī”, dǎozhì gǔjià xiàdiē.',
          grammarPoint: '경영진의 사생활·가십 등 본업 외 이슈로 기업 평판과 주가가 흔들리는 "오너 리스크"는 중국어로 "舆情危机(여론 위기)"라고 합니다. (내부 경영 문제는 管理危机, 재무 문제는 经济危机).',
        },
        {
          timeStr: '15:40',
          timeSec: 940,
          myWrongSentence: '我的脑子没有别的地方，只有AI和我的女儿。 (한국어 "머릿속에 다른 공간이 없다" 직역)',
          correctedSentence: '我现在满脑子都是AI数据中心和我的女儿，没有精力想别的事情。',
          pronunciation: 'Wǒ xiànzài mǎnnǎozi dōu shì AI shùjù zhōngxīn hé wǒ de nǚ’ér, méiyǒu jīnglì xiǎng bié de shìqing.',
          grammarPoint: '"머릿속에 공간이 없다(脑子没有地方)"는 중국어에서 어색한 직역입니다. 한 가지 생각으로 머릿속이 꽉 찼을 때는 관용구 "满脑子都是 ~(머릿속이 온통 ~뿐이다)"를 쓰면 원어민처럼 자연스럽습니다.',
        },
        {
          timeStr: '17:04',
          timeSec: 1024,
          myWrongSentence: '我每天生产上传的视频，还有运营四个YouTube。 ("영상을 생산하다" 동사 호응 오류)',
          correctedSentence: '我目前经营四个YouTube频道，每天坚持制作要上传的视频。',
          pronunciation: 'Wǒ mùqián jīngyíng sì gè YouTube píndào, měitiān jiānchí zhìzuò yào shàngchuán de shìpín.',
          grammarPoint: '"生产(생산하다)"은 공장에서 공산품·반도체를 대량 생산할 때만 씁니다. 영상·콘텐츠를 만들 때는 반드시 "制作(제작하다)"을 써야 하며, 유튜브 뒤에 "频道(채널)"를 붙여야 문법이 완성됩니다.',
        },
        {
          timeStr: '35:25',
          timeSec: 2125,
          myWrongSentence: '我妻子今天用AI做网页，几个小时把 Token 都用完了。 (Token 중국어 공식 용어 및 처치문 교정)',
          correctedSentence: '我妻子今天刚入门AI编程，没想到才几个小时就把账号里的“词元（Token）”全花完了！',
          pronunciation: 'Wǒ qīzi jīntiān gāng rùmén AI biānchéng, méi xiǎngdào cái jǐ gè xiǎoshí jiù bǎ zhànghào lǐ de “cíyuán” quán huā wán le!',
          grammarPoint: 'AI의 Token은 중국어 공식 용어로 "词元(cíyuán)"이라 부르며, "겨우 몇 시간 만에 다 써버렸다"는 반전 뉘앙스를 살리려면 "才几个小时就把 ~ 全花完了" 바(把)자문을 쓰는 것이 가장 정확합니다.',
        },
        {
          timeStr: '48:35',
          timeSec: 2915,
          myWrongSentence: '我妻子的父母有日本的定住权，还有我不抓朋友的约定。 ("영주권" 어휘 혼동 & "약속을 잡다" 한국식 직역)',
          correctedSentence: '我的丈人和丈母娘有日本的永住权。而且为了帮妻子带孩子，我平时都不好意思约朋友。',
          pronunciation: 'Wǒ de zhàngrén hé zhàngmuniáng yǒu Rìběn de yǒngzhùquán. Érqiě wèile bāng qīzi dài háizi, wǒ píngshí dōu bù hǎoyìsi yuē péngyou.',
          grammarPoint: '일본 영주권은 "定住权"이 아니라 "永住权(yǒngzhùquán)"이며, 한국어 "약속을 잡다"를 "抓约定"으로 직역하면 중국인이 이해하지 못합니다. 동사 하나만 써서 "约朋友(친구와 약속을 잡다)"라고 해야 합니다.',
        },
      ],
      betterAnswers: [
        {
          situation: '유튜브 신규 채널 구독자는 아직 적지만 조회수(播放量)가 잘 나온다고 답할 때',
          betterSentence: '虽然新频道的订阅者还不到一百人，但每条视频的播放量都破千了，我在耐心等待算法推荐。',
          pronunciation: 'Suīrán xīn píndào de dìngyuèzhě hái búdào yìbǎi rén, dàn měi tiáo shìpín de bōfàngliàng dōu pòqiān le, wǒ zài nàixīn děngdài suànfǎ tuījiàn.',
          koreanMeaning: '비록 신규 채널 구독자는 아직 100명 미만이지만 영상마다 조회수가 1,000회를 돌파해서, 인내심을 갖고 알고리즘 추천을 기다리고 있습니다.',
          nuanceTip: '"1,000회를 넘기다"를 "一천 이상(一千以上)" 대신 "破千(pòqiān)"으로 표현하면 중국 크리에이터들이 쓰는 진짜 실전 표현이 됩니다.',
        },
        {
          situation: 'AI 시대에 학교 교육이 어떻게 바뀌어야 하는지 소신을 밝힐 때',
          betterSentence: 'AI时代不应该只考死记硬背的封闭问题，而应该培养学生的主体意识、想象力和给AI下达指示词的能力。',
          pronunciation: 'AI shídài bù yīnggāi zhǐ kǎo sǐjìyìngbèi de fēngbì wèntí, ér yīnggāi péiyǎng xuésheng de zhǔtǐ yìshí, xiǎngxiànglì hé gěi AI xiàdá zhǐshìcí de nénglì.',
          koreanMeaning: 'AI 시대에는 무조건 외우는 폐쇄형 문제만 시험 볼 것이 아니라, 학생들의 주체의식(오너십)과 상상력, 그리고 AI에게 프롬프트를 내리는 능력을 길러줘야 합니다.',
          nuanceTip: '단순 암기("背的东西")를 사자성어 "死记硬背(기계적 암기)"로 바꾸고 "下达指示词(프롬프트 지시를 내리다)"를 쓰면 최고급 논리 표현이 됩니다.',
        },
        {
          situation: 'AI로 동시에 7~8가지 프로젝트를 지휘하는 업무 방식을 설명할 때',
          betterSentence: '以前一次只能做一件事，现在我同时给七八个AI分配任务，我只需要跳到别的页面确认结果就行。',
          pronunciation: 'Yǐqián yícì zhǐnéng zuò yí jiàn shì, xiànzài wǒ tóngshí gěi qī bā gè AI fēnpèi rènwu, wǒ zhǐ xūyào tiàodào bié de yèmiàn quèrèn jiéguǒ jiù xíng.',
          koreanMeaning: '예전엔 한 번에 한 가지 일만 할 수 있었지만, 지금은 7~8개 AI에게 동시에 임무를 배분해 두고 다른 탭으로 넘어가 결과만 컨펌하면 됩니다.',
          nuanceTip: '"일을 시키다"를 "分配任务(업무를 할당하다)"로 표현하면 CEO의 오케스트레이션 뉘앙스가 명확히 살아납니다.',
        },
      ],
      betterQuestions: [
        {
          context: '엔비디아(NVIDIA) 여론 위기나 빅테크 CEO 뉴스에 대해 선생님의 의견을 물을 때',
          questionSentence: '在中国，如果大公司的创始人出现这种舆情危机，一般会对公司股价产生多大的影响？',
          pronunciation: 'Zài Zhōngguó, rúguǒ dà gōngsī de chuàngshǐrén chūxiàn zhè zhǒng yúqíng wēijī, yìbān huì duì gōngsī gǔjià chǎnshēng duō dà de yǐngxiǎng?',
          koreanMeaning: '중국에서는 대기업 창업자에게 이런 여론 위기(오너 리스크)가 터지면 보통 회사 주가에 어느 정도 영향을 미치나요?',
        },
        {
          context: 'AI 시대 중국의 학교 교육이나 부모들의 교육열 변화가 궁금할 때',
          questionSentence: '现在生成式AI这么普及，中国的学校教育有没有开始改革，多问一些发散性的问题？',
          pronunciation: 'Xiànzài shēngchéngshì AI zhème pǔjí, Zhōngguó de xuéxiào jiàoyù yǒu méiyǒu kāishǐ gǎigé, duō wèn yìxiē fāsànxìng de wèntí?',
          koreanMeaning: '지금 생성형 AI가 이렇게 보편화되었는데, 중국 학교 교육도 발산형(열린) 질문을 더 많이 묻는 방향으로 개혁을 시작했나요?',
        },
        {
          context: '일본 비자 정책 강화 이야기를 나누며 선생님의 해외 체류·여행 계획을 물을 때',
          questionSentence: '最近日本的签证和永住权政策收紧了很多，您以后有去日本旅游或者旅居的打算吗？',
          pronunciation: 'Zuìjìn Rìběn de qiānzhèng hé yǒngzhùquán zhèngcè shōujǐn le hěn duō, nín yǐhòu yǒu qù Rìběn lǚyóu huòzhě lǚjū de dǎsuàn ma?',
          koreanMeaning: '최근 일본 비자와 영주권 정책이 많이 까다로워졌는데, 선생님께서는 향후 일본 여행이나 한 달 살기(단기 거주) 계획이 있으신가요?',
        },
      ],
      scenarioTitle: 'AI 1인 기업 오케스트레이션 · 아내의 토큰(词元) 소진 · 육아 근황 실전 대화',
      scenarioContext: '60분 수업에서 교정받은 핵심 표현(满脑子, 制作视频, 播放量, 词元, 主体意识, 跳到别的页面确认)을 모두 자연스럽게 써먹는 다음 수업 오프닝 롤플레이 시나리오입니다.',
      scenarioTurns: [
        {
          role: 'Tutor',
          speakerLabel: '중국어 선생님',
          foreignText: '这几天您忙什么呢？您的YouTube频道和AI项目进展得怎么样？',
          pronunciation: 'Zhè jǐ tiān nín máng shénme ne? Nín de YouTube píndào hé AI xiàngmù jìnzhǎn de zěnmeyàng?',
          koreanText: '요 며칠 어떤 일로 바쁘셨나요? 유튜브 채널과 AI 프로젝트는 어떻게 진행되고 있나요?',
        },
        {
          role: 'Me',
          speakerLabel: '윤종성 대표',
          foreignText: '我最近满脑子都是AI数据中心和YouTube频道。我每天坚持制作要上传的视频，新频道的播放量已经破千了，正在耐心等待算法推荐。',
          pronunciation: 'Wǒ zuìjìn mǎnnǎozi dōu shì AI shùjù zhōngxīn hé YouTube píndào. Wǒ měitiān jiānchí zhìzuò yào shàngchuán de shìpín, xīn píndào de bōfàngliàng yǐjīng pòqiān le, zhèngzài nàixīn děngdài suànfǎ tuījiàn.',
          koreanText: '요즘 머릿속이 온통 AI 데이터센터와 유튜브 채널 생각뿐입니다. 매일 꾸준히 업로드할 영상을 제작하고 있는데 신규 채널 조회수가 이미 1,000회를 돌파해서 인내심을 갖고 알고리즘 추천을 기다리고 있습니다.',
        },
        {
          role: 'Tutor',
          speakerLabel: '중국어 선생님',
          foreignText: '太棒了！听说您还教太太用AI编程做网页了，她学得顺利吗？',
          pronunciation: 'Tài bàng le! Tīngshuō nín hái jiāo tàitai yòng AI biānchéng zuò wǎngyè le, tā xué de shùnlì ma?',
          koreanText: '멋지네요! 사모님께도 AI 코딩으로 웹페이지 만드는 법을 알려주셨다고 들었는데, 잘 배우셨나요?',
        },
        {
          role: 'Me',
          speakerLabel: '윤종성 대표',
          foreignText: '她适应得特别快！没想到才几个小时就把账号里的词元全花完了，所以我把容量大的账号分享给她了。',
          pronunciation: 'Tā shìyìng de tèbié kuài! Méi xiǎngdào cái jǐ gè xiǎoshí jiù bǎ zhànghào lǐ de cíyuán quán huā wán le, suǒyǐ wǒ bǎ róngliàng dà de zhànghào fēnxiǎng gěi tā le.',
          koreanText: '적응이 엄청 빨랐어요! 뜻밖에도 몇 시간 만에 계정 안의 토큰(词元)을 전부 다 써버려서, 제 대용량 계정을 공유해 주었습니다.',
        },
        {
          role: 'Tutor',
          speakerLabel: '중국어 선생님',
          foreignText: '哈哈，看来她也完全迷上AI了！那您平时怎么平衡工作和带孩子呢？',
          pronunciation: 'Hāhā, kànlái tā yě wánquán míshàng AI le! Nà nín píngshí zěnme pínghéng gōngzuò hé dài háizi ne?',
          koreanText: '하하, 사모님도 AI에 완전히 푹 빠지셨군요! 그럼 평소 업무와 육아는 어떻게 균형을 맞추시나요?',
        },
        {
          role: 'Me',
          speakerLabel: '윤종성 대표',
          foreignText: '我给AI指示词，同时做七八个事情，只需要跳到别的页面确认结果。而且为了帮妻子照顾18个月大的女儿，我平时都不好意思约朋友。',
          pronunciation: 'Wǒ gěi AI zhǐshìcí, tóngshí zuò qī bā gè shìqing, zhǐ xūyào tiàodào bié de yèmiàn quèrèn jiéguǒ. Érqiě wèile bāng qīzi zhàogù shíbā gè yuè dà de nǚ’ér, wǒ píngshí dōu bù hǎoyìsi yuē péngyou.',
          koreanText: 'AI에게 프롬프트를 내려 동시에 7~8가지 일을 처리하고 다른 탭으로 넘어가 결과만 확인합니다. 그리고 아내가 18개월 딸을 돌보는 걸 돕기 위해 평소 친구 약속 잡기도 미안해서 가정에 집중하고 있습니다.',
        },
      ],
    };
  }

  // 2. 🇯🇵 일본어 수업 노트 맞춤 문법 교정 · 더 좋은 대답/질문 · 시나리오
  if (lang === 'ja') {
    return {
      lang: 'ja',
      langBadge: '🇯🇵 실전 일본어 1:1 코칭 (문법 교정 · 고급 대답 · 롤플레이)',
      ttsLang: 'ja-JP',
      grammarCorrections: [
        {
          myWrongSentence: 'ストレスがないで3回読みます。 ("~없이" 조사/부정형 연결 오류)',
          correctedSentence: 'ストレスなしで（無理に暗記しようとせず）3回繰り返して読むだけで自然に身につきます。',
          pronunciation: '스토레스 나시데 (무리니 암키시요토 세즈) 산카이 쿠리카에시테 요무 다케데 시젠니 미니츠키마스.',
          grammarPoint: '명사 뒤에 "없이"를 붙일 때는 "がないで"가 아니라 "なしで(스토레스 나시데)"를 씁니다. 또한 언어가 몸에 배다/습득되다는 "身につく(미니츠쿠)"를 쓰면 원어민 수준이 됩니다.',
        },
        {
          myWrongSentence: '妻は神戸大学で学会を行きました。 (자동사 "行く"의 목적격 조사 오류)',
          correctedSentence: '妻が神戸大学で開催された学会に参加した時、一緒に京都の宇治へ旅行に行きました。',
          pronunciation: '츠마가 코베다이가쿠데 카이사이사레타 각카이니 산카시타 토키, 잇쇼니 쿄토노 우지에 료코니 이키마시타.',
          grammarPoint: '"학회에 가다/참석하다"는 목적격 조사 "を"를 쓸 수 없고 "学会に参加する(학회에 참가하다)" 또는 "学会に出席する(출석하다)"를 써야 자연스럽습니다.',
        },
        {
          myWrongSentence: 'セブでジンベエザメを見ることが良かったです。 ("~한 것이 좋았다" 어색한 직역)',
          correctedSentence: 'セブ島でジンベエザメと一緒に泳いだのが、一番印象に残っています。',
          pronunciation: '세부토데 진베에자메토 잇쇼니 오요이다노가, 이치반 인쇼니 노콧테 이마스.',
          grammarPoint: '여행 경험을 말할 때 단순한 "見ることが良かった" 대신 "~したのが一番印象に残っています(~한 것이 가장 인상에 남아 있습니다)"를 쓰면 훨씬 세련된 회화가 됩니다.',
        },
      ],
      betterAnswers: [
        {
          situation: '대표님만의 "무스트레스 3회독 외국어 학습법"을 튜터에게 설명할 때',
          betterSentence: '1回目は声に出して読み、2回目は場面を思い浮かべ、3回目は見ずに話す「3回反復法」を実践しています。',
          pronunciation: '잇카이메와 코에니 다시테 요미, 니카이메와 바멘오 오모이우카베, 산카이메와 미즈니 하나스 「산카이 한푸쿠호」오 짓센시테 이마스.',
          koreanMeaning: '1회독은 소리 내어 읽고, 2회독은 장면을 떠올리고, 3회독은 안 보고 말하는 "3회 반복법"을 실천하고 있습니다.',
          nuanceTip: '"声に出して読む(소리 내어 읽다)", "場面を思い浮かべる(상황을 떠올리다)", "見ずに話す(안 보고 말하다)" 3단 구성을 그대로 외워두시면 언제든 쓰실 수 있습니다.',
        },
        {
          situation: '그리스 산토리니보다 로드스섬이 더 좋았던 이유를 말할 때',
          betterSentence: 'サントリーニ島も綺麗でしたが、中世の城壁が残るロードス島の方が静かで魅力的でした。',
          pronunciation: '산토리니토모 키레이데시타가, 추세노 조헤키가 노코루 로도스토노 호가 시즈카데 미료쿠테키데시타.',
          koreanMeaning: '산토리니섬도 예뻤지만, 중세 성벽이 남아 있는 로드스섬 쪽이 더 조용하고 매력적이었습니다.',
          nuanceTip: '두 여행지를 비교할 때는 "~も良かったですが、…の方が〜でした(~도 좋았지만 ...쪽이 더 ~했습니다)" 패턴이 가장 깔끔합니다.',
        },
      ],
      betterQuestions: [
        {
          context: '독일에 거주 중인 일본인 튜터에게 현지 생활과 여행지를 역질문할 때',
          questionSentence: '先生はドイツにお住まいですが、ヨーロッパの中で一番おすすめの旅行先はどこですか？',
          pronunciation: '센세와 도이츠니 오스마이데스가, 요롯파노 나카데 이치반 오스스메노 료코사키와 도코데스카?',
          koreanMeaning: '선생님께서는 독일에 거주하고 계신데, 유럽 중에서 가장 추천하시는 여행지는 어디인가요?',
        },
        {
          context: '최근 일본 비자·영주권 심사 강화에 대해 일본 현지 분위기를 물을 때',
          questionSentence: '最近日本の永住権やビザの審査が厳しくなったと聞きましたが、日本国内でも話題になっていますか？',
          pronunciation: '사이킨 니혼노 에이주켄야 비자노 신사가 키비시쿠 낫타토 키키마시타가, 니혼 코쿠나이데모 와다이니 낫테 이마스카?',
          koreanMeaning: '최근 일본 영주권이나 비자 심사가 까다로워졌다고 들었는데, 일본 국내에서도 화제가 되고 있나요?',
        },
      ],
      scenarioTitle: '교토 우지 여행 추억 & 무스트레스 3회독 다국어 학습법 롤플레이',
      scenarioContext: '일본어 튜터와 여행지 비교 및 대표님의 4개 국어 3회독 학습 비법을 자연스럽게 대화하는 시나리오입니다.',
      scenarioTurns: [
        {
          role: 'Tutor',
          speakerLabel: '일본어 튜터',
          foreignText: '今まで行った日本の都市の中で、どこが一番気に入りましたか？',
          pronunciation: '이마마데 잇타 니혼노 토시노 나카데, 도코가 이치반 키니 이리마시타카?',
          koreanText: '지금까지 가보신 일본 도시 중에서 어디가 가장 마음에 드셨나요?',
        },
        {
          role: 'Me',
          speakerLabel: '윤종성 대표',
          foreignText: '妻が神戸大学の学会に参加した時、一緒に行った京都の宇治が一番印象に残っています。抹茶も美味しくて静かな街でした。',
          pronunciation: '츠마가 코베다이가쿠노 각카이니 산카시타 토키, 잇쇼니 잇타 쿄토노 우지가 이치반 인쇼니 노콧테 이마스. 맛차모 오이시쿠테 시즈카나 마치데시타.',
          koreanText: '아내가 고베대 학회에 참석했을 때 함께 갔던 교토 우지가 가장 인상에 남아 있습니다. 말차도 맛있고 고즈넉한 도시였습니다.',
        },
        {
          role: 'Tutor',
          speakerLabel: '일본어 튜터',
          foreignText: '宇治は本当に素敵ですよね！ところで、4ヶ国語を同時に勉強するのは大変じゃないですか？',
          pronunciation: '우지와 혼토니 스테키데스요네! 토코로데, 욘카코쿠고오 도지니 벤쿄스루노와 타이헨자 나이데스카?',
          koreanText: '우지는 정말 멋진 곳이죠! 그런데 4개 국어를 동시에 공부하는 건 힘들지 않으신가요?',
        },
        {
          role: 'Me',
          speakerLabel: '윤종성 대표',
          foreignText: '無理に暗記しようとせず、ストレスなしで3回繰り返して読むだけで自然に身につきます。先生もヨーロッパでおすすめの旅行先があれば教えてください！',
          pronunciation: '무리니 암키시요토 세즈, 스토레스 나시데 산카이 쿠리카에시테 요무 다케데 시젠니 미니츠키마스. 센세모 요롯파데 오스스메노 료코사키가 아레바 오시에테 쿠다사이!',
          koreanText: '억지로 외우려 하지 않고 스트레스 없이 3번 반복해 읽기만 해도 자연스럽게 몸에 뱁니다. 선생님께서도 유럽에서 추천하시는 여행지가 있다면 알려주세요!',
        },
      ],
    };
  }

  // 3. 🇪🇸 스페인어 수업 노트 맞춤 문법 교정 · 더 좋은 대답/질문 · 시나리오
  if (lang === 'es') {
    return {
      lang: 'es',
      langBadge: '🇪🇸 실전 스페인어 1:1 코칭 (성수일치·동사원형 문법 교정 & 시나리오)',
      ttsLang: 'es-ES',
      grammarCorrections: [
        {
          myWrongSentence: 'El IA es muy bueno para mi trabajo. ("인공지능" 명사 성수일치 오류)',
          correctedSentence: 'La inteligencia artificial (la IA) es muy buena para automatizar mi trabajo.',
          pronunciation: '라 인텔리헨시아 아르티피시알 (라 이아) 에스 무이 부에나 파라 아우토마티사르 미 트라바호.',
          grammarPoint: '"Inteligencia(지능)"는 여성명사이므로 정관사도 "el"이 아니라 "la IA", 형용사도 여성형 "buena"로 성수일치(Concordancia)시켜야 합니다.',
        },
        {
          myWrongSentence: 'Hoy enseñé mi esposa crear páginas web. (간접목적격 전치사 a 및 enseñar a + 동사원형 누락)',
          correctedSentence: 'Hoy le enseñé a mi esposa a programar páginas web con la IA.',
          pronunciation: '오이 레 엔세녜 아 미 에스포사 아 프로그라마르 파히나스 웹 콘 라 이아.',
          grammarPoint: '스페인어에서 사람 목적어 앞에는 반드시 전치사 "a"("a mi esposa")와 중복 대명사 "le"를 써야 하며, "누구에게 ~하는 법을 가르치다"는 "enseñar a + 동사원형" 공식이 필수입니다.',
        },
        {
          myWrongSentence: 'En el doce de diciembre es mi cumpleaños. (날짜 앞 전치사 en 중복 오류)',
          correctedSentence: 'Mi cumpleaños es el once de diciembre, y en Corea ahora hace bastante frío.',
          pronunciation: '미 쿰플레아뇨스 에스 엘 온세 데 디시엠브레, 이 엔 코레아 아오라 아세 바스탄테 프리오.',
          grammarPoint: '영어의 "on December 11" 영향으로 스페인어 날짜 앞에 "en"을 쓰기 쉬우나, 스페인어 특정 날짜 앞에는 전치사 없이 정관사 "el"("el once de diciembre")만 씁니다.',
        },
      ],
      betterAnswers: [
        {
          situation: 'AI를 활용해 어떻게 1인 기업을 운영하는지 스페인어로 멋지게 답할 때',
          betterSentence: 'Dirijo una empresa unipersonal y uso agentes de IA para ahorrar tiempo y crear contenido todos los días.',
          pronunciation: '디리호 우나 엠프레사 우니페르소날 이 우소 아헨테스 데 이아 파라 아오라르 티엠포 이 크레아르 콘테니도 토도스 로스 디아스.',
          koreanMeaning: '1인 기업(empresa unipersonal)을 운영하며, 시간을 절약하고 매일 콘텐츠를 만들기 위해 AI 에이전트를 활용합니다.',
          nuanceTip: '"1인 기업"은 스페인어로 "empresa unipersonal"이라고 하면 매우 전문적인 비즈니스 표현이 됩니다.',
        },
        {
          situation: '한국의 사계절과 요즘 날씨를 설명할 때',
          betterSentence: 'Corea tiene cuatro estaciones bien marcadas, y prefiero el otoño porque el clima es muy agradable.',
          pronunciation: '코레아 티에네 쿠아트로 에스타시오네스 비엔 마르카다스, 이 프레피에로 엘 오토뇨 포르케 엘 클리마 에스 무이 아그라다블레.',
          koreanMeaning: '한국은 사계절이 뚜렷하며(bien marcadas), 날씨가 매우 쾌적해서 가을을 가장 좋아합니다.',
          nuanceTip: '"사계절이 뚜렷하다"는 "tener cuatro estaciones bien marcadas"라고 표현합니다.',
        },
      ],
      betterQuestions: [
        {
          context: '튜터에게 스페인어권에서 AI나 챗GPT를 어떻게 활용하는지 물어볼 때',
          questionSentence: '¿Cómo utilizas tú la inteligencia artificial en tu vida diaria o en tus clases?',
          pronunciation: '코모 우틸리사스 투 라 인텔리헨시아 아르티피시알 엔 투 비다 디아리아 오 엔 투스 클라세스?',
          koreanMeaning: '선생님은 일상생활이나 수업에서 인공지능(AI)을 어떻게 활용하시나요?',
        },
        {
          context: '베네수엘라/중남미 튜터에게 현지 날씨와 좋아하는 계절을 물을 때',
          questionSentence: '¿Qué tiempo hace hoy en tu ciudad y cuál es tu estación favorita del año?',
          pronunciation: '케 티엠포 아세 오이 엔 투 시우다드 이 쿠알 에스 투 에스타시온 파보리타 델 아뇨?',
          koreanMeaning: '오늘 선생님 계신 도시의 날씨는 어떤가요? 그리고 일 년 중 가장 좋아하는 계절은 무엇인가요?',
        },
      ],
      scenarioTitle: '스페인어로 소개하는 AI 1인 기업 자동화 & 가족 일상 롤플레이',
      scenarioContext: '스페인어 튜터와 날씨 인사를 나눈 뒤, AI를 활용한 5개 웹사이트·4개 유튜브 제작과 아내에게 AI를 가르쳐 준 근황을 대화하는 시나리오입니다.',
      scenarioTurns: [
        {
          role: 'Tutor',
          speakerLabel: '스페인어 튜터',
          foreignText: '¡Hola! ¿Qué tal tu día hoy y qué tiempo hace ahora en Seúl?',
          pronunciation: '올라! 케 탈 투 디아 오이 이 케 티엠포 아세 아오라 엔 세울?',
          koreanText: '안녕하세요! 오늘 하루 어떠셨나요? 지금 서울 날씨는 어떤가요?',
        },
        {
          role: 'Me',
          speakerLabel: '윤종성 대표',
          foreignText: '¡Hola! Hoy hace un poco de frío en Seúl, pero tuve un día excelente trabajando desde casa.',
          pronunciation: '올라! 오이 아세 운 포코 데 프리오 엔 세울, 페로 투베 운 디아 엑셀렌테 트라바한도 데스데 카사.',
          koreanText: '안녕하세요! 오늘 서울은 조금 춥지만, 재택근무를 하며 아주 훌륭한 하루를 보냈습니다.',
        },
        {
          role: 'Tutor',
          speakerLabel: '스페인어 튜터',
          foreignText: '¡Qué bien! ¿Y qué proyectos nuevos estás haciendo con la inteligencia artificial?',
          pronunciation: '케 비엔! 이 케 프로젝토스 누에보스 에스타스 아시엔도 콘 라 인텔리헨시아 아르티피시알?',
          koreanText: '좋네요! 인공지능(AI)으로 어떤 새로운 프로젝트를 진행하고 계신가요?',
        },
        {
          role: 'Me',
          speakerLabel: '윤종성 대표',
          foreignText: 'Uso la IA para ahorrar tiempo y crear cinco páginas web y cuatro canales de YouTube. Además, hoy le enseñé a mi esposa a programar con la IA. ¿Y tú, cómo utilizas la IA en tu vida diaria?',
          pronunciation: '우소 라 이아 파라 아오라르 티엠포 이 크레아르 싱코 파히나스 웹 이 쿠아트로 카날레스 데 유투브. 아데마스, 오이 레 엔세녜 아 미 에스포사 아 프로그라마르 콘 라 이아. 이 투, 코모 우틸리사스 라 이아 엔 투 비다 디아리아?',
          koreanText: '시간을 아끼고 5개 웹페이지와 4개 유튜브 채널을 만들기 위해 AI를 씁니다. 게다가 오늘 아내에게 AI로 코딩하는 법을 가르쳐 주었어요. 선생님은 일상에서 AI를 어떻게 쓰시나요?',
        },
      ],
    };
  }

  // 4. 🇺🇸 영어 수업 노트 맞춤 문법 교정 · 더 좋은 대답/질문 · 시나리오
  return {
    lang: 'en',
    langBadge: '🇺🇸 비즈니스 & 실전 영어 1:1 코칭 (문법 교정 · 고급 대답 · 롤플레이)',
    ttsLang: 'en-US',
    grammarCorrections: [
      {
        myWrongSentence: 'I made five websites and four YouTube channels for one month. (기간 전치사 for vs in 및 완료 시제 교정)',
        correctedSentence: "I've built five luxury websites and launched four YouTube channels in just a month using AI agents.",
        pronunciation: '아이브 빌트 파이브 럭셔리 웹사이트 앤 런치드 포 유투브 채널스 인 저스트 어 먼스 유징 에이아이 에이전츠.',
        grammarPoint: '"불과 한 달 만에 해냈다"는 성취 기간을 말할 때는 "for one month"가 아니라 "in just a month"와 현재완료("I\'ve built / launched")를 써야 정확한 원어민 문법이 됩니다.',
      },
      {
        myWrongSentence: 'My wife used all tokens in a few hours because she liked make websites. (like 뒤 목적어 형태 & 구동사 교정)',
        correctedSentence: 'My wife got so hooked on building websites with AI that she burned through all her tokens in just a few hours.',
        pronunciation: '마이 와이프 갓 소 훅트 온 빌딩 웹사이트 위드 에이아이 댓 쉬 번드 스루 올 허 토큰스 인 저스트 어 퓨 아워스.',
        grammarPoint: '"~에 푹 빠지다"는 "get hooked on + 동명사(-ing)"를 쓰고, 할당량이나 토큰을 순식간에 다 써버렸다는 표현은 "burn through all her tokens"를 쓰면 훨씬 생동감 있습니다.',
      },
      {
        myWrongSentence: 'Instead of do one work, I order seven or eight works to AI at the same time. (전치사 of 뒤 동명사 & 불가산명사 work 교정)',
        correctedSentence: 'Instead of handling one task at a time, I delegate seven or eight projects to multiple AI agents simultaneously.',
        pronunciation: '인스테드 오브 핸들링 원 태스크 앳 어 타임, 아이 델리게이트 세븐 오어 에잇 프로젝트 투 멀티플 에이아이 에이전츠 사이멀테이니슬리.',
        grammarPoint: '"Instead of" 뒤에는 반드시 동명사("handling")가 와야 하며, "work"는 불가산명사이므로 복수형("works") 대신 가산명사 "tasks" 또는 "projects"를 쓰고 "시킴/위임"은 "delegate"를 씁니다.',
      },
    ],
    betterAnswers: [
      {
        situation: '튜터가 "AI 덕분에 하루 일과가 어떻게 달라졌나요?"라고 물었을 때',
        betterSentence: "I act more like an orchestra conductor now—I give high-level prompts to my AI agents and just review their final deliverables.",
        pronunciation: '아이 액트 모어 라이크 언 오케스트라 컨덕터 나우 — 아이 기브 하이레벨 프롬프츠 투 마이 에이아이 에이전츠 앤 저스트 리뷰 데어 파이널 딜리버러블스.',
        koreanMeaning: '이제는 오케스트라 지휘자처럼 일합니다. AI 에이전트들에게 핵심 프롬프트를 내리고 저는 최종 산출물(deliverables)만 검토합니다.',
        nuanceTip: '"오케스트라 지휘자(orchestra conductor)" 비유와 "최종 산출물(final deliverables)" 어휘를 쓰면 C-Level 비즈니스 영어로 즉시 격상됩니다.',
      },
      {
        situation: '한국 반도체(삼성·SK하이닉스)와 AI 데이터센터(AIDC) 전력 인프라 시장을 설명할 때',
        betterSentence: 'As AI data centers scale up globally, securing reliable power grid equipment and cooling infrastructure has become the biggest bottleneck.',
        pronunciation: '애즈 에이아이 데이터센터스 스케일 업 글로벌리, 시큐어링 릴라이어블 파워 그리드 이큅먼트 앤 쿨링 인프라스트럭처 해즈 비컴 더 비기스트 보틀넥.',
        koreanMeaning: '전 세계적으로 AI 데이터센터가 대형화되면서, 안정적인 전력망 설비와 냉각 인프라를 확보하는 것이 가장 큰 병목(핵심 승부처)이 되었습니다.',
        nuanceTip: '"scale up(규모가 커지다)"과 "bottleneck(병목/핵심 과제)"은 미국 실리콘밸리·월가에서 매일 쓰는 핵심 표현입니다.',
      },
    ],
    betterQuestions: [
      {
        context: '튜터에게 AI가 미래 학교 교육과 아이들의 일자리를 어떻게 바꿀지 의견을 물을 때',
        questionSentence: 'How do you think school education should evolve now that AI can answer any memorization question in seconds?',
        pronunciation: '하우 두 유 씽크 스쿨 에듀케이션 슈드 이볼브 나우 댓 에이아이 캔 앤서 애니 메모라이제이션 퀘스천 인 세컨즈?',
        koreanMeaning: '이제 AI가 암기형 질문은 몇 초 만에 답할 수 있는데, 앞으로 학교 교육이 어떻게 진화해야 한다고 생각하시나요?',
      },
      {
        context: '튜터가 사는 나라의 전력·물가·AI 체감 트렌드를 자연스럽게 역질문할 때',
        questionSentence: 'Have you noticed people around you using AI tools more actively in their daily work lately?',
        pronunciation: '해브 유 노티스트 피플 어라운드 유 유징 에이아이 툴스 모어 액티블리 인 데어 데일리 워크 레이틀리?',
        koreanMeaning: '최근 주변 사람들이 일상 업무에서 AI 도구를 더 적극적으로 활용하는 걸 체감하시나요?',
      },
    ],
    scenarioTitle: 'AI 멀티 에이전트 1인 기업 CEO 근황 & AIDC 인프라 프리토킹 시나리오',
    scenarioContext: '원어민 튜터와 인사 후 5대 웹사이트·4개 유튜브 자동화, 아내의 AI 바이브 코딩 입문, AI 시대의 교육을 영어로 막힘없이 대화하는 롤플레이 시나리오입니다.',
    scenarioTurns: [
      {
        role: 'Tutor',
        speakerLabel: 'English Tutor',
        foreignText: "Good morning! How have your AI projects and YouTube channels been going this week?",
        pronunciation: '굿 모닝! 하우 해브 유어 에이아이 프로젝트 앤 유투브 채널스 빈 고잉 디스 위크?',
        koreanText: '좋은 아침입니다! 이번 주 AI 프로젝트와 유튜브 채널들은 어떻게 진행되고 있나요?',
      },
      {
        role: 'Me',
        speakerLabel: '윤종성 대표 (Me)',
        foreignText: "Things are going great! Instead of handling one task at a time, I delegate seven or eight tasks to my AI agents simultaneously and just review their deliverables.",
        pronunciation: '씽즈 아 고잉 그레이트! 인스테드 오브 핸들링 원 태스크 앳 어 타임, 아이 델리게이트 세븐 오어 에잇 태스크스 투 마이 에이아이 에이전츠 사이멀테이니슬리 앤 저스트 리뷰 데어 딜리버러블스.',
        koreanText: '아주 순조롭습니다! 한 번에 한 가지 일만 처리하는 대신 7~8가지 업무를 AI 에이전트들에게 동시에 위임하고 저는 결과물만 검토합니다.',
      },
      {
        role: 'Tutor',
        speakerLabel: 'English Tutor',
        foreignText: "That's amazing productivity! Did you mention you also taught your wife how to use AI for coding?",
        pronunciation: '댓츠 어메이징 프로덕티비티! 디드 유 멘션 유 올소 토트 유어 와이프 하우 투 유즈 에이아이 포 코딩?',
        koreanText: '놀라운 생산성이네요! 아내분께도 AI로 코딩하는 법을 알려주셨다고 하지 않으셨나요?',
      },
      {
        role: 'Me',
        speakerLabel: '윤종성 대표 (Me)',
        foreignText: "Yes! She got so hooked on building websites with AI that she burned through all her tokens in just a few hours, so I shared my high-capacity account with her. How do you think education should evolve in this AI era?",
        pronunciation: '예스! 쉬 갓 소 훅트 온 빌딩 웹사이트 위드 에이아이 댓 쉬 번드 스루 올 허 토큰스 인 저스트 어 퓨 아워스, 소 아이 쉐어드 마이 하이캐패시티 어카운트 위드 허. 하우 두 유 씽크 에듀케이션 슈드 이볼브 인 디스 에이아이 에라?',
        koreanText: '네! 아내가 AI로 웹사이트 만드는 데 푹 빠져서 몇 시간 만에 토큰을 다 써버리는 바람에 제 대용량 계정을 공유해 주었습니다. 선생님께서는 이런 AI 시대에 교육이 어떻게 진화해야 한다고 보시나요?',
      },
    ],
  };
}

export function buildUniversalFallbackCoaching(note: any, langCode: string): LanguageCoachingData {
  const found = GLOBAL_COACHING_LANGUAGES.find((x) => x.code === langCode);
  const label = found ? `${found.flag} ${found.label}` : `🌍 ${langCode} 다국어`;
  const bcp47 = found ? found.bcp47 : 'en-US';
  const baseCoaching = buildLanguageCoachingData(note, langCode);
  if (baseCoaching && baseCoaching.lang === langCode) return baseCoaching;

  const samplePresets: Record<string, Partial<LanguageCoachingData>> = {
    fr: {
      langBadge: '🇫🇷 프랑스어 (Français) AI 1:1 코칭',
      ttsLang: 'fr-FR',
      grammarCorrections: [
        {
          myWrongSentence: "Je fais une entreprise d'IA tout seul. (직역형 단순 문장)",
          correctedSentence: "Je dirige actuellement une entreprise unipersonnelle entièrement automatisée par l'IA.",
          pronunciation: '쥬 디히쥬 악뛰엘망 윈 앙트흐프히즈 위니페흐쏘넬 앙띠에흐망 오또마띠제 빠흐 리아.',
          grammarPoint: '"회사를 운영하다"는 단순 "faire" 대신 "diriger(지휘·운영하다)" 또는 "gérer"를 쓰면 최고급 비즈니스 프랑스어가 됩니다.',
        },
      ],
      betterAnswers: [
        {
          situation: '프랑스어 파트너/튜터에게 AI 에이전트 동시 지휘 방식을 설명할 때',
          betterSentence: "Je délègue sept ou huit missions simultanément à mes agents IA et je valide simplement les résultats.",
          pronunciation: '쥬 델레그 쎄뚜 위 미씨옹 씨뮐따네망 아 메 자장 이아 에 쥬 발리드 쌍플르망 레 헤쥘따.',
          koreanMeaning: '7~8가지 임무를 AI 에이전트들에게 동시에 위임하고 저는 결과물만 승인합니다.',
          nuanceTip: '"위임하다(déléguer)"와 "승인하다(valider)"를 조합하면 대표님의 오케스트레이션 철학이 정확히 전달됩니다.',
        },
      ],
      betterQuestions: [
        {
          context: '프랑스/유럽 현지의 생성형 AI 도입 분위기를 역질문할 때',
          questionSentence: "Comment les entreprises en France intègrent-elles l'intelligence artificielle générative aujourd'hui ?",
          pronunciation: '꼬망 레 장트흐프히즈 앙 프항스 앵떼그흐뗄 랭뗄리장스 아흐띠피씨엘 제네하띠브 오주흐뒤?',
          koreanMeaning: '오늘날 프랑스 기업들은 생성형 AI를 어떻게 도입하고 있나요?',
        },
      ],
      scenarioTitle: '🇫🇷 프랑스어 AI 1인 기업 & 글로벌 비즈니스 실전 대담',
      scenarioContext: '프랑스어 원어민 파트너/선생님과 AI 자동화 경영 방식을 나누는 롤플레이입니다.',
      scenarioTurns: [
        {
          role: 'Tutor',
          speakerLabel: 'Professeur Français',
          foreignText: "Bonjour ! Comment avancent vos projets d'intelligence artificielle cette semaine ?",
          pronunciation: '봉주흐! 꼬망 따방스 보 프호제 댕뗄리장스 아흐띠피씨엘 쎗 쓰멘?',
          koreanText: '안녕하세요! 이번 주 AI 프로젝트들은 어떻게 진행되고 있나요?',
        },
        {
          role: 'Me',
          speakerLabel: '윤종성 대표 (Me)',
          foreignText: "Tout avance très bien ! Je dirige mes agents IA en parallèle pour maximiser notre productivité.",
          pronunciation: '뚜 따방스 트헤 비앙! 쥬 디히쥬 메 자장 이아 앙 빠할렐 뿌흐 막씨미제 노트흐 프호뒥띠비떼.',
          koreanText: '아주 순조롭습니다! 생산성을 극대화하기 위해 AI 에이전트들을 병렬로 지휘하고 있습니다.',
        },
      ],
    },
    de: {
      langBadge: '🇩🇪 독일어 (Deutsch) AI 1:1 코칭',
      ttsLang: 'de-DE',
      grammarCorrections: [
        {
          myWrongSentence: 'Ich mache eine KI-Firma allein. (초급 표현)',
          correctedSentence: 'Ich leite derzeit ein KI-gestütztes Ein-Personen-Unternehmen.',
          pronunciation: '이히 라이테 데어차이트 아인 카이-게슈튀츠테스 아인-페어조넨-운터네멘.',
          grammarPoint: '기업을 경영할 때는 "machen" 대신 "leiten(이끌다)"이나 "führen"을 사용하고, "KI-gestützt(AI 기반)"를 붙이면 전문성이 살아납니다.',
        },
      ],
      betterAnswers: [
        {
          situation: '독일어 수업/미팅에서 AI 데이터센터(AIDC)와 딥테크 비전을 설명할 때',
          betterSentence: 'Wir konzentrieren uns auf KI-Rechenzentren und optische drahtlose Kommunikation der nächsten Generation.',
          pronunciation: '비어 콘첸트리어렌 운스 아우프 카이-레헨첸트렌 운트 옵티셰 드라틀로제 코무니카치온 데어 낵스텐 게네라치온.',
          koreanMeaning: '저희는 AI 데이터센터와 차세대 광무선 통신 기술에 집중하고 있습니다.',
          nuanceTip: '독일어권 테크 미팅에서 AI 데이터센터는 "KI-Rechenzentrum"이라고 표현합니다.',
        },
      ],
      betterQuestions: [
        {
          context: '독일 현지의 산업용 AI 및 자동화 트렌드를 물어볼 때',
          questionSentence: 'Wie stark wird künstliche Intelligenz mittlerweile im deutschen Mittelstand eingesetzt?',
          pronunciation: '비 슈타크 비어트 퀸스틀리히 인텔리겐츠 미틀러바일레 임 도이첸 미텔슈탄트 아인게제츠트?',
          koreanMeaning: '현재 독일 강소기업(Mittelstand)에서는 인공지능이 얼마나 활발히 도입되고 있나요?',
        },
      ],
      scenarioTitle: '🇩🇪 독일어 AI 1인 기업 & 딥테크 비즈니스 회화',
      scenarioContext: '독일어 원어민과 AI 자동화 및 데이터센터 인프라 트렌드를 대화하는 시나리오입니다.',
      scenarioTurns: [
        {
          role: 'Tutor',
          speakerLabel: 'Deutsch Tutor',
          foreignText: 'Guten Tag! Woran arbeiten Sie gerade mit Ihren KI-Agenten?',
          pronunciation: '구텐 탁! 보란 아르바이텐 지 게라데 미트 이어렌 카이-아겐텐?',
          koreanText: '안녕하세요! 지금 AI 에이전트들과 어떤 작업을 진행하고 계신가요?',
        },
        {
          role: 'Me',
          speakerLabel: '윤종성 대표 (Me)',
          foreignText: 'Ich koordiniere gleichzeitig sieben bis acht KI-Agenten und überprüfe nur noch die Endergebnisse.',
          pronunciation: '이히 코오르디니어레 글라이히차이티히 지벤 비스 아흐트 카이-아겐텐 운트 위버프뤼페 누어 노흐 디 엔트에어게브니세.',
          koreanText: '동시에 7~8개의 AI 에이전트를 조율하고 저는 최종 결과물만 검수합니다.',
        },
      ],
    },
    vi: {
      langBadge: '🇻🇳 베트남어 (Tiếng Việt) AI 1:1 코칭',
      ttsLang: 'vi-VN',
      grammarCorrections: [
        {
          myWrongSentence: 'Tôi làm công ty AI một mình. (단순 구어)',
          correctedSentence: 'Hiện tại tôi đang điều hành một doanh nghiệp một người tự động hóa bằng AI.',
          pronunciation: '히엔 따이 또이 당 디에우 하인 못 조아인 응이엡 못 응어이 뜨 동 호아 방 에이아이.',
          grammarPoint: '"회사를 경영하다"는 "làm công ty" 대신 "điều hành doanh nghiệp"을 쓰면 격식 있는 대표님의 표현이 됩니다.',
        },
      ],
      betterAnswers: [
        {
          situation: '베트남 파트너에게 AI 무인 자동화 시스템을 소개할 때',
          betterSentence: 'Nhờ hệ thống AI tự động 24/7, tôi có thể quản lý nhiều nền tảng toàn cầu cùng một lúc.',
          pronunciation: '녀 헤 통 에이아이 뜨 동 하이므어이본 짼 바이, 또이 꺼 테 꾸안 리 니에우 넨 땅 또안 꺼우 꿍 못 룩.',
          koreanMeaning: '24/7 무인 AI 시스템 덕분에 여러 글로벌 플랫폼을 동시에 관리할 수 있습니다.',
          nuanceTip: '"Nhờ ~(덕분에)"와 "cùng một lúc(동시에)"를 결합하면 설득력이 높아집니다.',
        },
      ],
      betterQuestions: [
        {
          context: '베트남 현지 젊은 창업자들의 AI 활용도를 물어볼 때',
          questionSentence: 'Ở Việt Nam hiện nay có nhiều nhà sáng lập ứng dụng AI để khởi nghiệp một mình không?',
          pronunciation: '어 비엣 남 히엔 나이 꺼 니에우 냐 상 럽 응 중 에이아이 데 커이 응이엡 못 민 콩?',
          koreanMeaning: '현재 베트남에서도 AI를 활용해 1인 창업을 하는 창업자가 많은가요?',
        },
      ],
      scenarioTitle: '🇻🇳 베트남어 AI 비즈니스 & 글로벌 플랫폼 대담',
      scenarioContext: '베트남어 튜터/파트너와 AI 1인 기업 운영 노하우를 나누는 실전 회화입니다.',
      scenarioTurns: [
        {
          role: 'Tutor',
          speakerLabel: 'Giáo viên Tiếng Việt',
          foreignText: 'Chào anh! Công việc kinh doanh với AI của anh dạo này thế nào rồi?',
          pronunciation: '짜오 아인! 꽁 비엑 낀 조아인 버이 에이아이 꾸아 아인 자오 나이 테 나오 조이?',
          koreanText: '안녕하세요 대표님! 요즘 AI 비즈니스 업무는 어떠신가요?',
        },
        {
          role: 'Me',
          speakerLabel: '윤종성 대표 (Me)',
          foreignText: 'Mọi thứ đang phát triển rất tốt! Tôi giao việc cho các tác nhân AI và chỉ kiểm tra kết quả cuối cùng.',
          pronunciation: '모이 트 당 팟 찌엔 젓 똣! 또이 자오 비엑 쩌 깍 딱 년 에이아이 바 찌 끼엠 짜 껫 꾸아 꾸오이 꿍.',
          koreanText: '모든 것이 아주 잘 발전하고 있습니다! AI 에이전트들에게 업무를 맡기고 최종 결과만 확인합니다.',
        },
      ],
    },
  };

  if (samplePresets[langCode]) {
    const p = samplePresets[langCode];
    return {
      lang: langCode,
      langBadge: p.langBadge || label,
      ttsLang: p.ttsLang || bcp47,
      grammarCorrections: p.grammarCorrections || [],
      betterAnswers: p.betterAnswers || [],
      betterQuestions: p.betterQuestions || [],
      scenarioTitle: p.scenarioTitle || `${label} 실전 대화 시나리오`,
      scenarioContext: p.scenarioContext || '',
      scenarioTurns: p.scenarioTurns || [],
    };
  }

  return {
    lang: langCode,
    langBadge: `${label} AI 1:1 맞춤 코칭`,
    ttsLang: bcp47,
    grammarCorrections: [
      {
        myWrongSentence: `"${String(note?.title || '오늘의 노트').slice(0, 45)}" 내용을 ${label}로 말할 때 직역하기 쉬운 표현`,
        correctedSentence: `상단의 [✨ AI 실시간 다국어 코칭 생성] 버튼을 누르시면 클라우드 프론티어 AI가 이 노트를 ${label} 원어민 표현으로 즉시 변환·교정해 드립니다!`,
        pronunciation: `${label} 원어민 발음 및 억양 지원`,
        grammarPoint: `어떤 언어든 제한 없이 실시간 문법 교정, 원어민 고급 대답, 스마트 역질문, 실전 롤플레이 시나리오를 즉시 생성할 수 있습니다.`,
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

