import type {
  GrammarCorrectionItem,
  BetterResponseItem,
  BetterQuestionItem,
  ScenarioTurn,
  ScenarioModule,
  LanguageCoachingData,
} from './languageCoachingCore';
import { COACHING_OVERRIDES } from './coachingOverrides';

const T = (
  role: 'Tutor' | 'Me',
  foreignText: string,
  pronunciation: string,
  koreanText: string,
  keyExpression?: string,
  speakingTip?: string
): ScenarioTurn => ({
  role,
  speakerLabel: role === 'Tutor' ? 'English Tutor' : '윤종성 대표 (Me)',
  foreignText,
  pronunciation,
  koreanText,
  keyExpression,
  speakingTip,
});

/* ───────── 오늘 58분 영어 수업 (note-hw-10) 풍부화 데이터 ───────── */

/* 녹취록의 "윤종성 대표:" 확정 발화만 사용한 교정 (실제 발화 → 더 자연스러운 표현) */
const R = (
  timeStr: string,
  said: string,
  type: '문법 오류' | '어색한 표현' | '더 자연스럽게' | '문장 미완성',
  fixed: string,
  pron: string,
  point: string,
  keyPattern: string,
  alts: Array<[string, string, string, string]>
): GrammarCorrectionItem => {
  const [m, sec] = timeStr.split(':').map(Number);
  return {
    timeStr,
    timeSec: m * 60 + sec,
    myWrongSentence: `"${said}" (실제 발화 ${timeStr} · ${type})`,
    correctedSentence: fixed,
    pronunciation: pron,
    grammarPoint: point,
    keyPattern,
    alternativeExpressions: alts.map(([label, sentence, pronunciation, nuance]) => ({ label, sentence, pronunciation, nuance })),
  };
};

const EN_REAL_CORRECTIONS: GrammarCorrectionItem[] = [
  R('04:55', 'I connected my laptop to two monitors.', '더 자연스럽게',
    "I hooked my laptop up to two monitors, so now I have a dual-monitor setup.",
    '아이 훅트 마이 랩탑 업 투 투 모니터스, 소 나우 아이 해브 어 듀얼 모니터 셋업.',
    "문법은 맞습니다. 다만 장비 연결은 구어에서 'hook up ~ to ~'를 많이 쓰고, 결과를 'dual-monitor setup'으로 묶으면 한 문장에 정보가 완성됩니다.",
    'hook A up to B · dual-monitor setup',
    [['비즈니스', 'I run my workstation on a dual-monitor configuration.', '아이 런 마이 워크스테이션 온 어 듀얼 모니터 컨피규레이션.', 'configuration은 업무/공식 문맥용.']]),
  R('06:39', 'The main actresses (Heroines).', '어색한 표현',
    'The female leads.',
    '더 피메일 리즈.',
    "영화에서 '여자 주연들'은 heroine보다 'female leads' 또는 'the leads'가 일반적입니다. heroine은 고전적·서사적 의미(여주인공)가 강합니다.",
    'the lead / the female lead · supporting cast(조연)',
    [['캐주얼', 'The women who star in it.', '더 위민 후 스타 인 잇.', "star in ~ = ~에 주연으로 출연하다."]]),
  R('08:18', "Compared to Ocean's Eleven, it's just the same story.", '더 자연스럽게',
    "Compared to Ocean's Eleven, it follows pretty much the same story, so it felt repetitive.",
    '컴페어드 투 오션스 일레븐, 잇 팔로우즈 프리티 머치 더 세임 스토리, 소 잇 펠트 리피티티브.',
    "'just the same story'도 통하지만, 'follow the same story/formula'와 느낌을 덧붙이는 'felt repetitive'가 평론에 더 어울립니다. (원문은 영화가 지루하다는 감상을 말하던 맥락)",
    'follow the same formula · pretty much · feel repetitive',
    [['캐주얼', "It's basically a remake in disguise.", '잇츠 베이식클리 어 리메이크 인 디스가이즈.', 'in disguise = 겉만 바꾼.'], ['평론가', 'It was too derivative for my taste.', '잇 워즈 투 디리버티브 포 마이 테이스트.', 'derivative = 독창성 부족.']]),
  R('13:12', 'Vampire Diaries or something on old TV.', '문장 미완성',
    'It reminds me of The Vampire Diaries or some other old TV show.',
    '잇 리마인즈 미 오브 더 뱀파이어 다이어리즈 오어 썸 아더 올드 티비 쇼.',
    "명사만 나열하면 무엇에 대한 말인지 상대가 놓칩니다. 'remind A of B(A를 보면 B가 떠오른다)'로 연결해 주세요.",
    'remind A of B · or some other + 명사',
    [['캐주얼', 'It has the same vibe as The Vampire Diaries.', '잇 해즈 더 세임 바이브 애즈 더 뱀파이어 다이어리즈.', 'vibe = 분위기.']]),
  R('14:16', 'Looking at the poster of the movie,', '문장 미완성',
    "Judging by the poster, it looks like a dark comedy thriller.",
    '저징 바이 더 포스터, 잇 룩스 라이크 어 다크 코미디 스릴러.',
    "'Looking at ~,'로 시작하면 뒷문장 주어가 'I'여야 합니다(분사구문 일치). 포스터를 근거로 추측하는 말은 'Judging by ~'가 자연스럽습니다. (이 발화는 문장이 끝나지 않았습니다)",
    'Judging by ~, it looks like ~',
    [['캐주얼', "From the poster alone, I'd say it's a thriller.", '프롬 더 포스터 얼론, 아이드 세이 잇츠 어 스릴러.', "I'd say ~ = ~인 것 같아요(부드러운 추측).", ]]),
  R('15:41', 'Is it on Disney Plus?', '더 자연스럽게',
    'Is it streaming on Disney+?',
    '이즈 잇 스트리밍 온 디즈니 플러스?',
    "틀린 문장은 아닙니다. OTT에서 볼 수 있는지는 'streaming on ~' 또는 'available on ~'가 가장 흔합니다.",
    'streaming on ~ · available on ~',
    [['정중', 'Is it available on Disney+, by any chance?', '이즈 잇 어베일러블 온 디즈니 플러스, 바이 에니 챈스?', 'by any chance = 혹시.']]),
  R('30:04', 'I turn off the video and stop watching.', '더 자연스럽게',
    'I turn it off and stop watching.',
    '아이 턴 잇 오프 앤 스탑 워칭.',
    "앞에서 영화를 이미 언급했으니 'the video'로 반복하지 않고 대명사 'it'을 씁니다. 대명사는 구동사 사이에 들어갑니다(turn it off, ✕turn off it).",
    'turn it off · 대명사는 구동사 사이에',
    [['캐주얼', "I just bail on it.", '아이 저스트 베일 온 잇.', 'bail on ~ = ~를 그만두고 떠나다.']]),
  R('30:33', 'If plausibility (개연성) is weak, it is hard to focus.', '더 자연스럽게',
    "If the plot isn't plausible, it's hard to stay engaged.",
    '이프 더 플롯 이즌트 플로저블, 잇츠 하드 투 스테이 인게이지드.',
    "'plausibility is weak'도 이해되지만, 형용사 plausible로 풀고 'focus' 대신 'stay engaged(몰입을 유지하다)'를 쓰면 영화 대화에 맞습니다. (plausibility 발음: 플로저-빌-리티, 'bil'에 강세)",
    "If + 주어 + isn't plausible · stay engaged",
    [['캐주얼', "If the story doesn't add up, I can't get into it.", '이프 더 스토리 더즌트 애드 업, 아이 캔트 겟 인투 잇.', "doesn't add up = 앞뒤가 안 맞다."]]),
  R('31:55', 'If it is too predictable, I lose interest in watching.', '어색한 표현',
    "If it's too predictable, I lose interest.",
    '이프 잇츠 투 프리딕터블, 아이 루즈 인터레스트.',
    "'lose interest in watching'은 어색합니다. 'lose interest'만으로 충분하고, 대상을 붙이려면 'lose interest in the movie'처럼 명사를 씁니다.",
    'lose interest (in + 명사)',
    [['캐주얼', "If I can see the ending coming, I check out.", '이프 아이 캔 씨 디 엔딩 커밍, 아이 체크 아웃.', 'see ~ coming = 예상하다, check out = 몰입이 끊기다.']]),
  R('32:04', "I don't like that, I can't keep watching.", '문법 오류',
    "I don't like that, so I can't keep watching.",
    '아이 돈트 라이크 댓, 소 아이 캔트 킵 워칭.',
    "쉼표만으로 두 절을 잇는 것(comma splice)은 문법 오류입니다. 이유-결과 관계이면 'so'로 연결하세요.",
    '절 + , so + 절 (comma splice 피하기)',
    [['캐주얼', "That's a dealbreaker for me—I can't keep watching.", '댓츠 어 딜브레이커 포 미 — 아이 캔트 킵 워칭.', 'dealbreaker = 결정적 걸림돌.']]),
  R('34:58', 'I run YouTube channels, so I make many videos.', '더 자연스럽게',
    'I run several YouTube channels, so I produce a lot of videos.',
    '아이 런 세버럴 유튜브 채널스, 소 아이 프로듀스 어 랏 오브 비디오스.',
    "문법은 맞습니다. 채널 수를 'several'로 알려주고, 'many'는 긍정문에서 격식체라 구어에서는 'a lot of'가 자연스럽습니다. 영상 제작은 make보다 produce가 전문적입니다.",
    'a lot of (구어) / many (격식) · produce content',
    [['피칭', 'I manage four YouTube channels and publish content daily.', '아이 매니지 포 유튜브 채널스 앤 퍼블리시 콘텐트 데일리.', 'manage / publish = 비즈니스 어조.']]),
  R('38:13', "Actually I don't mind, but I don't need to show my face.", '어색한 표현',
    "I don't mind being on camera, but there's no need for me to show my face.",
    '아이 돈트 마인드 비잉 온 카메라, 벗 데어즈 노 니드 포 미 투 쇼 마이 페이스.',
    "'I don't mind' 뒤에는 동명사(-ing)가 와야 의미가 완성됩니다. '필요 없다'는 'I don't need to'보다 'there's no need for me to'가 이유를 더 부드럽게 전합니다.",
    "don't mind + -ing · there's no need for me to ~",
    [['유머', "I'd rather stay behind the camera.", '아이드 래더 스테이 비하인드 더 카메라.', "I'd rather ~ = 차라리 ~하겠다.", ]]),
  R('44:34', 'About one hundred US dollars ($100) per month.', '더 자연스럽게',
    "It costs about a hundred dollars a month.",
    '잇 코스츠 어바웃 어 헌드레드 달러스 어 먼스.',
    "말할 때는 'US dollars ($100)'처럼 괄호를 읽지 않고 'a hundred dollars'로 말합니다. 'per month'는 구어에서 'a month'. 단독 구절보다 'It costs ~'로 문장을 만들어야 합니다.",
    'It costs + 금액 + a month',
    [['캐주얼', "It's around a hundred bucks a month.", '잇츠 어라운드 어 헌드레드 벅스 어 먼스.', 'buck = 달러(구어).']]),
  R('56:31', 'Manual editing takes too much time and makes people tired.', '더 자연스럽게',
    'Manual editing is time-consuming and exhausting.',
    '매뉴얼 에디팅 이즈 타임 컨슈밍 앤 이그조스팅.',
    "'takes too much time'과 'makes people tired'는 형용사 time-consuming, exhausting 두 개로 압축하면 훨씬 간결합니다. tired는 단순 피곤, exhausting은 '지치게 하는'.",
    'time-consuming · exhausting (사물 주어 + -ing 형용사)',
    [['캐주얼', "Editing by hand is a huge time sink.", '에디팅 바이 핸드 이즈 어 휴즈 타임 싱크.', 'time sink = 시간 잡아먹는 일.']]),
];

const EN_EXTRA_ANSWERS: BetterResponseItem[] = [
  {
    situation: '“요즘 어떻게 지내요?”라는 일상 질문에 근황+영화 얘기로 확장할 때 (00:30)',
    betterSentence: "Pretty good! I just finished setting up my office, and I've been catching up on some movies in the evenings.",
    pronunciation: '프리티 굿! 아이 저스트 피니시트 셋팅 업 마이 오피스, 앤 아이브 빈 캐칭 업 온 썸 무비스 인 디 이브닝스.',
    koreanMeaning: '아주 좋아요! 방금 사무실 세팅을 마쳤고, 저녁마다 밀린 영화들을 보고 있어요.',
    nuanceTip: "'catch up on ~'(밀린 걸 따라잡다)는 영화·뉴스·일에 두루 씁니다.",
    followUpCombo: "Have you seen anything good lately? I'm looking for a thriller recommendation.",
  },
  {
    situation: '영화가 마음에 들지 않았던 이유를 정중하게 설명할 때 (08:40)',
    betterSentence: "It wasn't bad, but the plot felt a little formulaic, so it didn't really grab me.",
    pronunciation: '잇 워즌트 배드, 벗 더 플롯 펠트 어 리틀 포뮬래익, 소 잇 디든트 리얼리 그랩 미.',
    koreanMeaning: '나쁘진 않았지만 줄거리가 다소 공식 같아서 크게 와닿지 않았어요.',
    nuanceTip: "'didn't grab me'는 'I hated it' 보다 훨씬 세련되고 안전한 부정 표현입니다.",
    followUpCombo: "That said, the cast was great. Did it work for you?",
  },
  {
    situation: '4개 유튜브 채널 운영 비결을 물었을 때 (45:00)',
    betterSentence: "The key is building a repeatable system—I script with AI, automate the editing, and batch-upload on a schedule.",
    pronunciation: '더 키 이즈 빌딩 어 리피터블 시스템 — 아이 스크립트 위드 에이아이, 오토메이트 디 에디팅, 앤 배치 업로드 온 어 스케줄.',
    koreanMeaning: '비결은 반복 가능한 시스템을 만드는 것입니다. AI로 대본을 쓰고 편집을 자동화한 뒤 일정에 맞춰 일괄 업로드합니다.',
    nuanceTip: "'repeatable system'과 'batch-upload'는 크리에이터/창업가 인터뷰의 정석 어휘입니다.",
    followUpCombo: "Consistency beats intensity, honestly. What's your upload routine like?",
  },
];

const EN_EXTRA_QUESTIONS: BetterQuestionItem[] = [
  {
    context: '튜터가 말한 영화의 결말이 궁금하지만 스포일러는 피하고 싶을 때',
    questionSentence: "Without spoiling anything, would you say the ending is worth the build-up?",
    pronunciation: '위드아웃 스포일링 에니씽, 우드 유 세이 디 엔딩 이즈 워스 더 빌드 업?',
    koreanMeaning: '스포 없이, 결말이 그 전개를 감수할 만한 가치가 있다고 보시나요?',
    nuanceTip: "'Without spoiling anything'은 영화/책 대화의 예의 바른 서두입니다.",
    followUpCombo: "And if you had to rate it out of ten, what would it get?",
  },
  {
    context: '튜터의 아기 영상·여행 영상 편집 고민에 도움을 주며 대화를 이어갈 때',
    questionSentence: "What's the most time-consuming part of editing for you—cutting clips, adding captions, or color grading?",
    pronunciation: '왓츠 더 모스트 타임 컨슈밍 파트 오브 에디팅 포 유 — 커팅 클립스, 애딩 캡션스, 오어 컬러 그레이딩?',
    koreanMeaning: '편집에서 가장 시간이 오래 걸리는 부분은 무엇인가요? 컷 편집, 자막, 색보정 중에서요.',
    nuanceTip: '선택지를 3개 제시하면 상대가 답하기 쉬워 대화가 길어집니다.',
    followUpCombo: "If I could automate just one of those, which would save you the most time?",
  },
  {
    context: '튜터의 다음 여행 계획에서 대화를 개인적으로 확장할 때',
    questionSentence: "Is this trip more about relaxing, or are you planning to film a lot of content?",
    pronunciation: '이즈 디스 트립 모어 어바웃 릴랙싱, 오어 아 유 플래닝 투 필름 어 랏 오브 콘텐트?',
    koreanMeaning: '이번 여행은 휴식이 목적인가요, 아니면 콘텐츠 촬영을 많이 하실 계획인가요?',
    nuanceTip: "'Is it more about A, or B?' 구조는 의도를 묻는 만능 질문 틀입니다.",
    followUpCombo: "Either way, you'll want a good stabilizer. Have you tried a gimbal?",
  },
];

const EN_SCENARIOS: ScenarioModule[] = [
  {
    id: 'en-s1', badge: '시나리오 1 · 심층 복습',
    title: '스릴러 개연성 토론 — 수업 주제 완벽 재현',
    context: '오늘 수업의 영화 취향 토론을 막힘없이 티키타카로 완주하는 8턴 복습 시나리오입니다.',
    turns: [
      T('Tutor', "Let's talk movies. Have you seen anything good lately?", '렛츠 톡 무비스. 해브 유 씬 에니씽 굿 레이틀리?', '영화 얘기 해볼까요? 최근에 괜찮은 거 보셨나요?', 'Have you seen anything good lately?', '"anything good"에 강세, lately는 끝을 올려 가볍게.'),
      T('Me', "Yes, I rewatched Ocean's Eleven, but Ocean's Eight felt like a copy-paste of the original, so it didn't really grab me.", '예스, 아이 리워치트 오션스 일레븐, 벗 오션스 에이트 펠트 라이크 어 카피 페이스트 오브 디 오리지널, 소 잇 디든트 리얼리 그랩 미.', '네, 오션스 일레븐을 다시 봤는데 오션스 에이트는 원작을 복붙한 느낌이라 크게 와닿지 않았어요.', "didn't really grab me", "'copy-paste'는 한 호흡으로, 'grab me'에서 힘을 빼며 마무리."),
      T('Tutor', "Fair enough. What matters most to you when you pick a movie—the cast, the action, or the story?", '페어 이너프. 왓 매터즈 모스트 투 유 웬 유 픽 어 무비 — 더 캐스트, 디 액션, 오어 더 스토리?', '그럴 수 있죠. 영화를 고를 때 배우, 액션, 스토리 중 뭐가 가장 중요한가요?', 'What matters most to you ~', "'cast, action, story' 나열은 내림 억양(↘), 마지막 항목에서 확실히 내리기."),
      T('Me', "For pure action movies, I don't mind a simple plot. But when it comes to thrillers, plausibility is crucial for me.", '포 퓨어 액션 무비스, 아이 돈트 마인드 어 심플 플롯. 벗 웬 잇 컴즈 투 스릴러스, 플로저빌리티 이즈 크루셜 포 미.', '순수 액션 영화는 단순한 줄거리도 괜찮지만, 스릴러는 개연성이 정말 중요해요.', 'when it comes to ~ / plausibility is crucial', "'plausibility'는 plau-zi-BIL-i-ty, 세 번째 음절 'BIL'에 강세를 둡니다."),
      T('Tutor', 'Interesting! So what makes a thriller fall apart for you?', '인터레스팅! 소 왓 메이크스 어 스릴러 폴 어파트 포 유?', '흥미롭네요! 그럼 스릴러가 무너지는 순간은 언제인가요?', 'fall apart', "'fall apart' 두 단어를 이어서 '폴러파트'처럼 연음."),
      T('Me', "If I can see the ending coming within the first thirty minutes, I lose interest and turn it off.", '이프 아이 캔 씨 디 엔딩 커밍 위딘 더 퍼스트 써티 미니츠, 아이 루즈 인터레스트 앤 턴 잇 오프.', '초반 30분 안에 결말이 눈에 보이면 흥미를 잃고 꺼버려요.', 'see the ending coming', "'turn it off'는 'turn-ih-off'로 연음. 'thirty'의 t는 가볍게."),
      T('Tutor', "Ha! Then you'd love Ready or Not. It's dark, funny, and really hard to predict.", '하! 덴 유드 러브 레디 오어 낫. 잇츠 다크, 퍼니, 앤 리얼리 하드 투 프리딕트.', '하! 그럼 Ready or Not 좋아하실 거예요. 어둡고 웃기고 예측하기 정말 어렵거든요.', 'hard to predict', "형용사 나열(dark, funny)은 리듬감 있게 끊어 읽기."),
      T('Me', "That sounds right up my alley! Without spoiling anything, what hooked you the most—the humor or the suspense?", '댓 사운즈 라이트 업 마이 앨리! 위드아웃 스포일링 에니씽, 왓 훅트 유 더 모스트 — 더 휴머 오어 더 서스펜스?', '딱 제 취향이네요! 스포 없이, 가장 사로잡은 건 유머였나요, 서스펜스였나요?', 'right up my alley / hooked you', "'humor' 의 h는 약하게, 'or'은 약세로 'er'처럼."),
    ],
  },
  {
    id: 'en-s2', badge: '시나리오 2 · 비즈니스 응용',
    title: '해외 투자자에게 4대 유튜브 채널 & AI 영상 자동화 피칭',
    context: '미팅에서 채널 포트폴리오와 자동화 효율(3시간 → 30분)을 숫자로 설득하는 8턴 시나리오입니다.',
    turns: [
      T('Tutor', 'Thanks for meeting. Could you give me a quick overview of your channels?', '땡스 포 미팅. 쿠드 유 기브 미 어 퀵 오버뷰 오브 유어 채널스?', '만나주셔서 감사합니다. 채널들을 간단히 소개해 주시겠어요?', 'give me a quick overview', '"overview"는 첫 음절 O에 강세.'),
      T('Me', 'Sure. I run four channels: a family vlog with over 10K subscribers, and three language-learning channels.', '슈어. 아이 런 포 채널스: 어 패밀리 브이로그 위드 오버 텐 케이 섭스크라이버스, 앤 쓰리 랭귀지 러닝 채널스.', '물론이죠. 채널 네 개를 운영합니다. 구독자 1만 명 넘는 가족 브이로그와 어학 채널 세 개예요.', 'I run ~ / over 10K subscribers', "'10K'는 '텐 케이'로 또박또박."),
      T('Tutor', "Impressive. How do you keep up with that much content?", '임프레시브. 하우 두 유 킵 업 위드 댓 머치 콘텐트?', '인상적이네요. 그 많은 콘텐츠를 어떻게 따라가세요?', 'keep up with', "'keep up with'는 'keep-up-with'를 한 덩어리로."),
      T('Me', "The key is a repeatable system. I script with AI, automate the editing, and batch-upload on a schedule.", '더 키 이즈 어 리피터블 시스템. 아이 스크립트 위드 에이아이, 오토메이트 디 에디팅, 앤 배치 업로드 온 어 스케줄.', '핵심은 반복 가능한 시스템입니다. AI로 대본을 쓰고 편집을 자동화하고 일정에 맞춰 일괄 업로드해요.', 'repeatable system / batch-upload', '세 동사(script, automate, batch-upload)를 같은 톤으로 나열.'),
      T('Tutor', 'What kind of time savings are we talking about?', '왓 카인드 오브 타임 세이빙스 아 위 토킹 어바웃?', '어느 정도의 시간 절감을 말씀하시는 건가요?', 'What kind of ~ are we talking about?', "'talking about' 에서 about을 살짝 올려 구체 수치를 유도."),
      T('Me', "If I edited manually, each video would take over three hours. With Gemini, it's down to thirty minutes—about an 85% reduction.", '이프 아이 에디티드 매뉴얼리, 이치 비디오 우드 테이크 오버 쓰리 아워스. 위드 제미나이, 잇츠 다운 투 써티 미니츠 — 어바웃 언 에이티파이브 퍼센트 리덕션.', '수작업이면 영상당 3시간 넘게 걸리지만 제미나이로는 30분, 약 85% 절감입니다.', 'would take ~ / down to ~ / reduction', "'three hours'와 'thirty minutes'의 th/ty 발음 구분 주의."),
      T('Tutor', 'And does quality hold up with automation?', '앤 더즈 퀄리티 홀드 업 위드 오토메이션?', '자동화해도 품질은 유지되나요?', 'hold up', "'hold up'은 '버티다/유지되다'."),
      T('Me', "Yes. I automate the rough cuts and captions, but I still review every final deliverable myself.", '예스. 아이 오토메이트 더 러프 컷츠 앤 캡션스, 벗 아이 스틸 리뷰 에브리 파이널 딜리버러블 마이셀프.', '네. 러프컷과 자막은 자동화하지만 최종 결과물은 제가 직접 검토합니다.', 'rough cuts / final deliverable', "'deliverable'은 디-리-버-러-블, 강세는 두 번째 음절."),
    ],
  },
  {
    id: 'en-s3', badge: '시나리오 3 · 꼬리질문 디펜스',
    title: '“Why?” “Can you elaborate?” — 돌발 꼬리질문 방어',
    context: '튜터가 깊게 파고드는 질문을 던질 때 이유-예시-결론 구조로 논리적으로 답하는 8턴 시나리오입니다.',
    turns: [
      T('Tutor', "You said plausibility is crucial. Why does it matter so much to you?", '유 세드 플로저빌리티 이즈 크루셜. 와이 더즈 잇 매터 소 머치 투 유?', '개연성이 중요하다고 하셨죠. 왜 그렇게 중요한가요?', 'Why does it matter so much?', "'Why' 질문에는 'Because'로 시작하지 말고 'Well, ~'로 완충."),
      T('Me', "Well, a thriller's whole appeal is the puzzle. If the logic breaks, the tension collapses.", '웰, 어 스릴러스 홀 어필 이즈 더 퍼즐. 이프 더 로직 브레익스, 더 텐션 컬랩시스.', '스릴러의 매력은 퍼즐이니까요. 논리가 깨지면 긴장감이 무너집니다.', "appeal is ~ / tension collapses", "'Well,'로 한 박자 쉬며 생각하는 느낌을 줍니다."),
      T('Tutor', 'Can you give me a specific example?', '캔 유 기브 미 어 스페시픽 이그잼플?', '구체적인 예를 들어주실 수 있나요?', 'Can you give me a specific example?', '예시 요청에는 "For instance," 로 즉시 시작.'),
      T('Me', "For instance, when a character makes an obviously silly decision just to move the plot forward, I immediately stop believing the story.", '포 인스턴스, 웬 어 캐릭터 메익스 언 오비어슬리 실리 디시전 저스트 투 무브 더 플롯 포워드, 아이 이미디어틀리 스탑 빌리빙 더 스토리.', '예를 들어 인물이 줄거리를 진행시키려고 뻔히 어리석은 결정을 하면, 곧바로 이야기를 믿지 않게 돼요.', 'For instance, ~ / move the plot forward', "'obviously silly'에서 감정을 실어 강조."),
      T('Tutor', "But isn't predictability sometimes comforting?", '벗 이즌트 프리딕터빌리티 썸타임스 컴퍼팅?', '그래도 예측 가능한 게 때로는 편안하지 않나요?', "isn't ~ sometimes ~?", "부정 의문문에는 동의하면 'Yes', 반대면 'Not for me'로 명확히."),
      T('Me', "Fair point—for action or comfort movies, yes. But for thrillers, I'd rather be surprised than comforted.", '페어 포인트 — 포 액션 오어 컴퍼트 무비스, 예스. 벗 포 스릴러스, 아이드 래더 비 서프라이즈드 댄 컴퍼티드.', '맞는 말이에요. 액션이나 힐링 영화는 그렇죠. 하지만 스릴러는 위로받기보다 놀라고 싶어요.', 'Fair point / I\'d rather A than B', "'Fair point'로 상대를 인정한 뒤 반박하는 것이 가장 세련된 디베이트 화법."),
      T('Tutor', 'So how does that apply to your own video content?', '소 하우 더즈 댓 어플라이 투 유어 오운 비디오 콘텐트?', '그럼 그게 대표님 영상 콘텐츠에는 어떻게 적용되나요?', 'How does that apply to ~?', "'apply to'를 부드럽게 연음."),
      T('Me', "I use the same principle: hook viewers early, keep the pacing tight, and never waste their time. That's why I automate the boring parts and focus on the story.", '아이 유즈 더 세임 프린서펄: 훅 뷰어스 얼리, 킵 더 페이싱 타이트, 앤 네버 웨이스트 데어 타임. 댓츠 와이 아이 오토메이트 더 보링 파츠 앤 포커스 온 더 스토리.', '같은 원칙을 씁니다. 초반에 시청자를 사로잡고 속도감을 유지하고 시간을 낭비하지 않죠. 그래서 지루한 부분은 자동화하고 이야기에 집중해요.', "hook viewers early / That's why ~", "결론 문장 'That\'s why ~'는 속도를 늦추고 또박또박 마무리."),
    ],
  },
];

export function enrichCoaching(data: LanguageCoachingData, note: any): LanguageCoachingData {
  if (!data) return data;
  const id = String(note?.id || '');
  const override = COACHING_OVERRIDES[id];
  if (override && data.lang === override.lang && (!note?.aiCoaching || data !== note.aiCoaching))
    return { ...data, ...override } as LanguageCoachingData;
  if (data.scenarios?.length) return data;
  const title = String(note?.title || '');
  const isTodayEnglish = data.lang === 'en' && (id.includes('note-hw-10') || title.includes('Ready or Not'));
  if (!isTodayEnglish) return data;

  const merged = EN_REAL_CORRECTIONS;

  const answers = data.betterAnswers.map((a) => a);
  const followUps = [
    "Have you seen anything good lately? I'm looking for a thriller recommendation.",
    "Honestly, formulas are fine—but only if the execution feels fresh.",
    "Did it make a difference in how fast you could publish?",
  ];
  answers.forEach((a, i) => {
    if (!a.followUpCombo) a.followUpCombo = followUps[i];
  });

  return {
    ...data,
    grammarCorrections: merged,
    betterAnswers: [...answers, ...EN_EXTRA_ANSWERS],
    betterQuestions: [...data.betterQuestions, ...EN_EXTRA_QUESTIONS],
    scenarios: EN_SCENARIOS,
  };
}
