import { NextResponse } from 'next/server';
import {
  loadNotesData,
  saveNotesData,
  callCloudFrontierAi,
  resolveUniversalLanguage,
} from '@/app/secondbrain/cloudStore';
import type { LanguageCoachingData } from '@/app/secondbrain/languageCoachingEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function buildUniversalCoachingFallback(
  langCodeOrName: string,
  title: string,
  transcript: string
): LanguageCoachingData {
  const meta = resolveUniversalLanguage(langCodeOrName);
  const firstSnippet =
    transcript
      .replace(/^Speaker\s+\d+\s*:\s*/gim, '')
      .split(/\n+/)
      .map((s) => s.trim())
      .find((s) => s.length > 6) || title;

  return {
    lang: meta.code,
    langBadge: `${meta.flag} ${meta.koName} (${meta.nativeName}) AI 1:1 코칭`,
    ttsLang: meta.bcp47,
    grammarCorrections: [
      {
        myWrongSentence: `${firstSnippet.slice(0, 70)} (직역 위주의 초급 표현)`,
        correctedSentence: `[${meta.nativeName} 원어민 비즈니스 표현] ${firstSnippet.slice(0, 80)}`,
        pronunciation: `${meta.koName} 원어민 발음 가이드 적용`,
        grammarPoint: `${meta.koName}(${meta.nativeName}) 회화에서는 한국어 어순을 그대로 직역하기보다 핵심 동사와 비즈니스 전문 어휘를 앞세워 구조화하면 훨씬 자연스럽습니다.`,
      },
    ],
    betterAnswers: [
      {
        situation: `${meta.koName} 파트너/선생님과 AI 1인 기업 및 비즈니스 근황을 나눌 때`,
        betterSentence: `[${meta.nativeName}] I am currently operating an AI-automated one-person enterprise and scaling global platforms.`,
        pronunciation: `${meta.koName} 실전 억양 및 강세 쉐도잉`,
        koreanMeaning: '현재 AI 무인 자동화 1인 기업을 운영하며 글로벌 플랫폼을 확장하고 있습니다.',
        nuanceTip: `${meta.koName} 실전 회화에서 본인의 전문성을 첫 문장에 명확히 제시하면 대화 주도권을 잡을 수 있습니다.`,
      },
    ],
    betterQuestions: [
      {
        context: `현지 ${meta.koName}권의 AI 기술 도입 및 비즈니스 트렌드를 역질문할 때`,
        questionSentence: `[${meta.nativeName}] How are companies in your country adopting generative AI and automation recently?`,
        pronunciation: `${meta.koName} 원어민 질문 억양`,
        koreanMeaning: '최근 현지 기업들은 생성형 AI와 자동화를 어떻게 도입하고 있나요?',
      },
    ],
    scenarioTitle: `${meta.flag} ${meta.koName} 실전 비즈니스 & 일상 회화 롤플레이`,
    scenarioContext: `"${title}" 노트 내용을 바탕으로 ${meta.koName}(${meta.nativeName}) 원어민 튜터/파트너와 즉시 대화할 수 있는 실전 시나리오입니다.`,
    scenarioTurns: [
      {
        role: 'Tutor',
        speakerLabel: `${meta.koName} 원어민 튜터`,
        foreignText: `[${meta.nativeName}] Let's review the key topic from "${title.slice(0, 30)}". What was your main takeaway?`,
        pronunciation: `${meta.koName} 원어민 발음`,
        koreanText: `"${title.slice(0, 30)}"의 핵심 주제를 복습해 볼까요? 가장 중요한 포인트는 무엇이었나요?`,
      },
      {
        role: 'Me',
        speakerLabel: '담당자',
        foreignText: firstSnippet.slice(0, 110),
        pronunciation: `${meta.koName} 실전 발화 연습`,
        koreanText: `${firstSnippet.slice(0, 110)} (노트 핵심 내용 발화)`,
      },
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const noteId = String(body.noteId || '').trim();
    const rawLang = String(body.targetLang || body.customLang || 'en').trim();
    const meta = resolveUniversalLanguage(rawLang);

    const data = await loadNotesData();
    const note = data.notes.find((n: any) => n.id === noteId) || body.note;

    const title = String(note?.title || body.title || '다국어 보이스 노트');
    const transcript = String(
      note?.transcript || body.transcript || (note?.summary || []).join('\n') || title
    );

    const prompt = `당신은 전 세계 모든 언어를 완벽하게 가르치는 사용자님 전담 1:1 원어민 AI 랭귀지 코치입니다.
목표 언어: ${meta.koName} (${meta.nativeName}, BCP-47: ${meta.bcp47})
아래 [노트 제목]과 [대화/메모 원문]을 분석하여, 목표 언어(${meta.koName} / ${meta.nativeName})로 학습·복습·실전 회화를 할 수 있는 JSON 데이터를 생성하세요.
만약 원문이 한국어나 다른 언어로 되어 있더라도, 해당 내용을 **${meta.koName}(${meta.nativeName})**로 어떻게 자연스럽게 말하고 질문하고 대화할지 변환하여 코칭해 주세요!

반드시 아래 JSON 스키마로만 응답하세요:
{
  "grammarCorrections": [
    {
      "myWrongSentence": "원문에서 내가 어색하게 말했거나 한국식으로 직역하기 쉬운 표현 (원문 + 한국어 설명)",
      "correctedSentence": "${meta.nativeName} 원어민이 쓰는 가장 자연스럽고 품격 있는 교정 문장 (반드시 ${meta.koName} 원문 표기)",
      "pronunciation": "로마자 발음기호(병음/발음) 및 한국어 소리나는 대로 읽는 법 병기",
      "grammarPoint": "왜 이렇게 표현해야 자연스러운지 핵심 문법·어휘·뉘앙스 해설 (한국어)"
    }
  ],
  "betterAnswers": [
    {
      "situation": "대화 상황 설명 (한국어)",
      "betterSentence": "${meta.nativeName} 원어민 고급 답변 문장",
      "pronunciation": "발음기호 및 한글 발음",
      "koreanMeaning": "정확한 한국어 뜻",
      "nuanceTip": "원어민 뉘앙스 팁 (한국어)"
    }
  ],
  "betterQuestions": [
    {
      "context": "역질문 맥락 설명 (한국어)",
      "questionSentence": "${meta.nativeName} 원어민 스마트 역질문 문장",
      "pronunciation": "발음기호 및 한글 발음",
      "koreanMeaning": "정확한 한국어 뜻"
    }
  ],
  "scenarioTitle": "${meta.koName} 실전 롤플레이 시나리오 제목 (한국어)",
  "scenarioContext": "시나리오 상황 설명 (한국어)",
  "scenarioTurns": [
    {
      "role": "Tutor",
      "speakerLabel": "${meta.koName} 원어민 파트너",
      "foreignText": "${meta.nativeName} 대화문",
      "pronunciation": "발음기호 및 한글 발음",
      "koreanText": "한국어 해석"
    },
    {
      "role": "Me",
      "speakerLabel": "담당자",
      "foreignText": "${meta.nativeName} 대답 대화문",
      "pronunciation": "발음기호 및 한글 발음",
      "koreanText": "한국어 해석"
    }
  ]
}

[노트 제목]
${title}

[대화/메모 원문]
${transcript.slice(0, 2600)}`;

    let coaching: LanguageCoachingData | null = null;

    const aiResp = await callCloudFrontierAi(prompt, {
      temperature: 0.25,
      maxTokens: 1800,
      jsonMode: true,
    });

    if (aiResp) {
      try {
        const cleanJson = aiResp.replace(/^```json\s*|\s*```$/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (
          Array.isArray(parsed.grammarCorrections) &&
          parsed.grammarCorrections.length > 0
        ) {
          coaching = {
            lang: meta.code,
            langBadge: `${meta.flag} ${meta.koName} (${meta.nativeName}) AI 1:1 실시간 코칭`,
            ttsLang: meta.bcp47,
            grammarCorrections: parsed.grammarCorrections,
            betterAnswers: Array.isArray(parsed.betterAnswers) ? parsed.betterAnswers : [],
            betterQuestions: Array.isArray(parsed.betterQuestions) ? parsed.betterQuestions : [],
            scenarioTitle:
              parsed.scenarioTitle || `${meta.flag} ${meta.koName} 실전 롤플레이 시나리오`,
            scenarioContext:
              parsed.scenarioContext ||
              `${meta.koName}(${meta.nativeName}) 원어민과 바로 대화하는 실전 시나리오입니다.`,
            scenarioTurns: Array.isArray(parsed.scenarioTurns) ? parsed.scenarioTurns : [],
          };
        }
      } catch {}
    }

    if (!coaching) {
      coaching = buildUniversalCoachingFallback(rawLang, title, transcript);
    }

    // Save into the note so it persists across mobile & PC
    if (noteId) {
      const targetNote = data.notes.find((n: any) => n.id === noteId);
      if (targetNote) {
        targetNote.targetLang = meta.code;
        targetNote.aiCoaching = coaching;
        await saveNotesData(data);
      }
    }

    return NextResponse.json({
      success: true,
      coaching,
      languageMeta: meta,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
