import { NextResponse } from 'next/server';
import {
  loadNotesData,
  isCloudEnvironment,
  formatDurationKorean,
  detectNoteCategory,
  callCloudFrontierAi,
} from '@/app/secondbrain/cloudStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawQuery = String(body.query || body.message || '').trim();
    if (!rawQuery) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const data = await loadNotesData();
    const notes = data.notes || [];
    const qLower = rawQuery.toLowerCase();

    // Extract meaningful search tokens
    const tokens = qLower
      .replace(/[?.,!~"'()\[\]]/g, ' ')
      .split(/\s+/)
      .map((w) => w.replace(/(은|는|이|가|을|를|의|에|에서|로|으로|과|와|도|만|까지|부터|란|이란|뭐야|알려줘|보여줘|정리해줘|요약해줘)$/g, ''))
      .filter((w) => w.length >= 2);

    // Score each note by relevance
    const scored = notes.map((n: any) => {
      const hayTitle = String(n.title || '').toLowerCase();
      const haySum = Array.isArray(n.summary) ? n.summary.join(' ').toLowerCase() : '';
      const hayStruct = String(n.structuredSummary || '').toLowerCase();
      const hayTrans = String(n.transcript || '').toLowerCase();
      const hayTags = Array.isArray(n.tags) ? n.tags.join(' ').toLowerCase() : '';

      let score = 0;
      for (const tk of tokens) {
        if (hayTitle.includes(tk)) score += 6;
        if (hayTags.includes(tk)) score += 5;
        if (haySum.includes(tk)) score += 4;
        if (hayStruct.includes(tk)) score += 3;
        if (hayTrans.includes(tk)) score += 2;
      }

      if (
        (qLower.includes('화천') || qLower.includes('일진') || qLower.includes('데이터센터') || qLower.includes('aidc') || qLower.includes('m&a')) &&
        (hayTitle.includes('화천') || hayTitle.includes('aidc') || hayTitle.includes('데이터센터'))
      ) {
        score += 15;
      }
      if (
        (qLower.includes('교정') || qLower.includes('표현') || qLower.includes('외국어') || qLower.includes('영어') || qLower.includes('일본어') || qLower.includes('중국어') || qLower.includes('스페인어')) &&
        (hayTitle.includes('수업') || hayTrans.includes('교정 표현'))
      ) {
        score += 12;
      }
      return { note: n, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const matched = scored.filter((x) => x.score > 0).map((x) => x.note);
    const targetNotes = matched.length > 0 ? matched.slice(0, 5) : notes.slice(0, 4);

    const citations = targetNotes.map((n: any) => ({
      id: n.id,
      title: n.title,
      date: new Date(n.recordedAt).toLocaleDateString('ko-KR'),
      duration: formatDurationKorean(n.durationSeconds),
      category: detectNoteCategory(n).categoryLabel,
    }));

    // 1) Try Cloud Frontier AI (Gemini / OpenAI / Cloud Gateway) + Local Ollama RAG
    try {
      const contextBlock = targetNotes
        .slice(0, 4)
        .map(
          (n: any, idx: number) =>
            `[노트 #${idx + 1}: ${n.title} (${new Date(n.recordedAt).toLocaleDateString('ko-KR')}) | 분류: ${
              detectNoteCategory(n).categoryLabel
            }]\n요약:\n${(n.summary || []).join('\n')}\n본문 발췌:\n${String(
              n.transcript || ''
            ).slice(0, 1100)}`
        )
        .join('\n\n---\n\n');

      const aiAnswer = await callCloudFrontierAi(
        `아래 [검색된 NoteHelper (노트헬퍼) 기록]을 근거로 윤종성 대표님의 질문에 대해 핵심 수치, 날짜, 외국어 표현(어떤 언어든 원문+발음+해석 포함), 출처 노트를 명시하여 명확하고 정중하게 답변하세요.\n\n[질문]\n${rawQuery}\n\n[검색된 NoteHelper (노트헬퍼) 기록]\n${contextBlock}`,
        {
          systemInstruction:
            '당신은 윤종성 대표님의 전용 NoteHelper (노트헬퍼) 프론티어 AI 지식 비서입니다. 대표님의 회의록(AIDC 전력 M&A, 샘컴·퀀텀테크놀로지 딥테크), 5대 Helper 플랫폼, 전 세계 모든 외국어 회화 수업 및 보이스 메모를 기반으로 정확하게 답변합니다.',
          temperature: 0.15,
          maxTokens: 1100,
        }
      );

      if (aiAnswer && aiAnswer.trim().length > 40) {
        return NextResponse.json({
          success: true,
          reply: aiAnswer.trim(),
          citations,
          engine: 'Cloud Frontier AI',
          timestamp: new Date().toISOString(),
        });
      }
    } catch {}

    // Cloud & Fallback Cross-Note Intelligence Synthesizer
    let replyText = '';

    if (
      qLower.includes('교정') ||
      qLower.includes('틀린') ||
      qLower.includes('틀렸') ||
      qLower.includes('표현') ||
      qLower.includes('복습')
    ) {
      const langNotes = notes.filter((n: any) => detectNoteCategory(n).obsidianFolder.startsWith('02_Areas/'));
      const extractedCorrections: string[] = [];
      for (const ln of langNotes.slice(0, 6)) {
        const lines = String(ln.transcript || '').split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('✅ 교정 표현') || lines[i].includes('💬 대표님 표현')) {
            extractedCorrections.push(`• **[${ln.title.slice(0, 14)}]** ${lines[i].trim()}`);
            if (extractedCorrections.length >= 10) break;
          }
        }
        if (extractedCorrections.length >= 10) break;
      }

      replyText = [
        `🧠 **[Ask NoteHelper] 다국어 수업 핵심 교정 표현 통합 인출 (${langNotes.length}개 수업 분석)**`,
        ``,
        extractedCorrections.length > 0
          ? extractedCorrections.join('\n')
          : langNotes
              .slice(0, 4)
              .map((n: any) => `• **${n.title}**\n  - ${(n.summary && n.summary[0]) || ''}`)
              .join('\n\n'),
        ``,
        `💡 *팁: 각 수업 노트를 클릭하신 뒤 상단의 **[🔊 원어민 발음 쉐도잉 듣기]** 버튼을 누르시면 위 문장들을 원어민 음성으로 연속 청취하실 수 있습니다.*`,
      ].join('\n');
    } else if (
      qLower.includes('액션') ||
      qLower.includes('할 일') ||
      qLower.includes('과제') ||
      qLower.includes('일정')
    ) {
      const actionLines: string[] = [];
      for (const n of notes) {
        if (Array.isArray(n.actionItems) && n.actionItems.length > 0) {
          for (const a of n.actionItems) {
            actionLines.push(
              `• **[${a.assignee || '윤종성 대표'}]** ${a.task} *(출처: ${n.title.slice(0, 28)}...)*`
            );
          }
        } else if (n.structuredSummary && String(n.structuredSummary).includes('## Action Items')) {
          const sec = String(n.structuredSummary).split('## Action Items')[1]?.split('##')[0]?.trim();
          if (sec) {
            actionLines.push(`• **[${n.title.slice(0, 26)}]**\n  ${sec.split('\n')[0]}`);
          }
        }
      }

      replyText = [
        `🧠 **[Ask NoteHelper] 전체 노트 Action Items & 핵심 실행 과제 종합**`,
        ``,
        actionLines.slice(0, 8).join('\n\n'),
        ``,
        `총 **${notes.length}개** NoteHelper (노트헬퍼) 메모리에서 추출된 실행 과제입니다.`,
      ].join('\n');
    } else {
      const blocks = targetNotes.map((n: any, idx: number) => {
        const dateStr = new Date(n.recordedAt).toLocaleDateString('ko-KR');
        const sumList = Array.isArray(n.summary) ? n.summary.slice(0, 3) : [];
        // Find matching line in transcript if tokens exist
        let matchingQuote = '';
        if (tokens.length > 0 && n.transcript) {
          const tLines = String(n.transcript)
            .split('\n')
            .map((l) => l.trim())
            .filter((l) => l.length > 10);
          const found = tLines.find((l) => tokens.some((tk) => l.toLowerCase().includes(tk)));
          if (found) matchingQuote = `\n  - 💬 **원문 발언**: *"${found.slice(0, 140)}"*`;
        }
        return [
          `### ${idx + 1}. ${n.title} (${dateStr} · ${formatDurationKorean(n.durationSeconds)})`,
          ...sumList.map((s: string) => `- ${s}`),
          matchingQuote,
        ]
          .filter(Boolean)
          .join('\n');
      });

      replyText = [
        `🧠 **[Ask NoteHelper] "${rawQuery}" 통합 메모리 검색 결과 (총 ${notes.length}개 노트 중 상위 ${targetNotes.length}건 매칭)**`,
        ``,
        blocks.join('\n\n'),
      ].join('\n');
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      citations,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
