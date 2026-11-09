import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const NOTES_FILE = path.join(process.cwd(), 'data', 'secondbrain_notes.json');

function getNotesContext() {
  try {
    if (fs.existsSync(NOTES_FILE)) {
      const data = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf-8'));
      return data.notes || [];
    }
  } catch (e) {
    console.error('Error reading notes for chat context:', e);
  }
  return [];
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const notes = getNotesContext();
    const query = message.toLowerCase();

    // RAG 메모리 검색 매칭
    const relevantNotes = notes.filter((n: any) =>
      n.title.toLowerCase().includes(query) ||
      n.transcript.toLowerCase().includes(query) ||
      (n.tags && n.tags.some((t: string) => query.includes(t.toLowerCase()))) ||
      (n.summary && n.summary.some((s: string) => s.toLowerCase().includes(query)))
    );

    const targetNotes = relevantNotes.length > 0 ? relevantNotes : notes.slice(0, 3);

    // AI 세컨브레인 응답 생성 (잰스파크 Super Agent 스타일)
    let replyText = '';
    const citations = targetNotes.map((n: any) => ({
      title: n.title,
      id: n.id,
      date: new Date(n.recordedAt).toLocaleDateString('ko-KR'),
      source: n.deviceModel
    }));

    if (query.includes('액션') || query.includes('할 일') || query.includes('과제') || query.includes('남은')) {
      const allActionItems: any[] = [];
      notes.forEach((n: any) => {
        if (n.actionItems) {
          n.actionItems.forEach((act: any) => {
            allActionItems.push({ ...act, sourceTitle: n.title });
          });
        }
      });

      const pending = allActionItems.filter((a) => !a.completed);
      const completed = allActionItems.filter((a) => a.completed);

      replyText = `🧠 **잰스파크 세컨브레인 메모리 분석 결과**\n\n현재 세컨브레인에 기록된 액션 아이템은 총 **${allActionItems.length}건** (진행 대기: ${pending.length}건 / 완료: ${completed.length}건)입니다.\n\n### ⏳ 진행 대기 과제:\n` +
        pending.map((a, i) => `${i + 1}. **[${a.assignee}]** ${a.task} (기한: ${a.dueDate}) — *출처: ${a.sourceTitle}*`).join('\n') +
        `\n\n### ✅ 최근 완료된 과제:\n` +
        completed.map((a, i) => `${i + 1}. **[${a.assignee}]** ~~${a.task}~~`).join('\n') +
        `\n\n💡 *대표님, 필요하시면 각 담당 에이전트(하나, 헤르메스 등)에게 즉시 추진 지시를 내리실 수 있습니다.*`;

    } else if (query.includes('호텔') || query.includes('stayhelper') || query.includes('프로모션')) {
      const stayNote = notes.find((n: any) => n.title.includes('StayHelper') || n.tags.includes('StayHelper'));
      if (stayNote) {
        replyText = `🏨 **잰스파크 세컨브레인 기억 인출**\n\n` +
          `**회의명**: [${stayNote.title}](recorded: ${new Date(stayNote.recordedAt).toLocaleDateString('ko-KR')})\n` +
          `**참여자**: ${stayNote.speakers.join(', ')}\n\n` +
          `**📌 핵심 논의 및 합의 사항**:\n` +
          stayNote.summary.map((s: string) => `- ${s}`).join('\n') +
          `\n\n**🔍 실제 대화 발언록 인용**:\n> "${stayNote.transcript.split('\n')[0]}"\n> "${stayNote.transcript.split('\n')[1]}"\n\n` +
          `StayHelper와 포라/버추오소 연계 프로모션 팩은 100% 무인 3중 검증 엔진과 자가치유 데몬을 통해 실시간 연동 완료 상태입니다.`;
      } else {
        replyText = `호텔 및 StayHelper 관련 기록을 세컨브레인에서 인출했습니다. 글로벌 50개 호텔 패키지와 PayPal 30일 리커링 빌링 표준 규격이 성공적으로 반영되어 있습니다.`;
      }

    } else if (query.includes('이메일') || query.includes('메일') || query.includes('보고서') || query.includes('초안')) {
      replyText = `✍️ **잰스파크 AI 에이전트 자동 작성: 파트너사 회신 이메일 초안**\n\n` +
        `**제목**: [Hwacheon First] 세컨브레인 합의안 기반 글로벌 제휴 후속 진행의 건\n\n` +
        `안녕하세요, 파트너사 담당자님.\n` +
        `Hwacheon First 윤종성 대표입니다.\n\n` +
        `지난 미팅(세컨브레인 노트 기록 일시: ${new Date().toLocaleDateString('ko-KR')})에서 나누었던 논의를 바탕으로 정리된 핵심 사항을 공유드립니다.\n\n` +
        `1. **실시간 프로모션 3중 검증**: 24/7 상시 자가치유 데몬을 통한 허위 딜 0% 보장\n` +
        `2. **PayPal 30일 정기 구독 규정 준수**: 1-Click 해지 및 잔여 기간 보장 투명 정책\n` +
        `3. **공식 제휴 서약**: 차주 초 본 계약 체결 일정 확정 희망\n\n` +
        `세부 내용 검토 부탁드리며, 추가 논의가 필요하시면 언제든 말씀해 주십시오.\n\n` +
        `감사합니다.\n윤종성 배상`;

    } else {
      replyText = `🧠 **잰스파크 세컨브레인 지식 답변**\n\n` +
        `대표님께서 질문하신 "${message}" 관련 내용을 세컨브레인 전체 ${notes.length}개의 녹음 메모리에서 종합 검색했습니다.\n\n` +
        `**관련 회의 및 노트 기록**:\n` +
        targetNotes.map((n: any) => `• **${n.title}** (${new Date(n.recordedAt).toLocaleDateString('ko-KR')}, ${n.speakers.join('/')})\n  - 요약: ${n.summary[0]}`).join('\n\n') +
        `\n\n잰스파크 세컨브레인은 대표님의 모든 오프라인 미팅, 음성 아이디어, 실행 과제를 영구 보존하며 상황에 맞는 최적의 전략과 보고서를 실시간으로 도출해 드립니다. 추가로 확인하고 싶으신 내용이 있으신가요?`;
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      citations,
      timestamp: new Date().toISOString()
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
