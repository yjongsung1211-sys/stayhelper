import { NextResponse } from 'next/server';
import {
  loadNotesData,
  saveNotesData,
  generateVoiceToActionOutput,
  sendSecondBrainTelegramBriefing,
  sendMorningBriefingToTelegram,
} from '@/app/secondbrain/cloudStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const noteId = body.noteId as string;
    const actionType = (body.actionType || 'shorts_script') as
      | 'shorts_script'
      | 'language_review'
      | 'biz_plan'
      | 'share_message'
      | 'agent_dispatch'
      | 'morning_briefing';
    const taskTitle = body.taskTitle as string | undefined;
    const agentRole = body.agentRole as string | undefined;

    const data = await loadNotesData();

    if (actionType === 'morning_briefing') {
      const res = await sendMorningBriefingToTelegram(data.notes);
      return NextResponse.json({
        success: res.ok,
        actionType: 'morning_briefing',
        label: '☀️ NoteHelper (노트헬퍼) 모닝 인텔리전스 & 3회독 복습 브리핑',
        content: res.previewText,
      });
    }

    const note = data.notes.find((n: any) => n.id === noteId) || body.note;

    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }

    // 1. Voice-to-Action 결과 생성 (쇼츠 대본 / 3회독 복습 카드 / 실행 기획서 / 카톡·이메일 공유 초안 / 에이전트 작업 발주)
    const { label, content } = await generateVoiceToActionOutput(note, actionType, {
      taskTitle,
      agentRole,
    });

    // 2. 노트 내 actionOutputs에 영구 저장 + 옵시디언 및 클라우드 동기화
    const targetNote = data.notes.find((n: any) => n.id === note.id);
    if (targetNote) {
      targetNote.actionOutputs = {
        ...(targetNote.actionOutputs || {}),
        [actionType]: {
          label,
          content,
          updatedAt: new Date().toISOString(),
        },
      };
      await saveNotesData(data);
    }

    // 3. 대표님 텔레그램으로 변환 결과 즉시 전송
    await sendSecondBrainTelegramBriefing(targetNote || note, 'voice_action', label, content);

    return NextResponse.json({
      success: true,
      actionType,
      label,
      content,
      note: targetNote || note,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
