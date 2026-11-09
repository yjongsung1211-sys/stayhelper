import { NextResponse } from 'next/server';
import {
  loadNotesData,
  saveNotesData,
  normalizeAudioUrl,
} from '@/app/secondbrain/cloudStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  const data = await loadNotesData();
  let filtered = data.notes;

  if (q) {
    filtered = filtered.filter(
      (n: any) =>
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.transcript && n.transcript.toLowerCase().includes(q)) ||
        (n.summary && n.summary.some((s: string) => s.toLowerCase().includes(q)))
    );
  }

  filtered.sort(
    (a: any, b: any) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  );

  return NextResponse.json({ notes: filtered, total: filtered.length });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await loadNotesData();

    const newNote = {
      id: `sbn-note-${Date.now()}`,
      title: body.title || `녹음 기록 - ${new Date().toLocaleDateString('ko-KR')}`,
      recordedAt: new Date().toISOString(),
      durationSeconds: body.durationSeconds || 10,
      audioUrl: normalizeAudioUrl(body.audioUrl),
      source: body.source || 'device_hardware',
      deviceModel: body.deviceModel || 'SecondBrain Note',
      speakers: body.speakers || ['윤종성 대표'],
      tags: body.tags || ['음성녹음'],
      sentiment: body.sentiment || 'Verified',
      structuredSummary: body.structuredSummary || '',
      summary:
        Array.isArray(body.summary) && body.summary.length > 0
          ? body.summary
          : [body.transcript || '음성 녹음 요약'],
      actionItems: body.actionItems || [],
      transcript: body.transcript || '(무음 또는 인식된 음성 없음)',
      gensparkSynced: true,
      gensparkMemoryId: `mem_sb_${Date.now()}`,
    };

    data.notes.unshift(newNote);
    await saveNotesData(data);

    return NextResponse.json({ success: true, note: newNote });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, summary, structuredSummary, transcript, audioUrl, durationSeconds } = body;
    const data = await loadNotesData();

    const note = data.notes.find((n: any) => n.id === id);
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }

    if (title !== undefined) note.title = title;
    if (Array.isArray(summary)) note.summary = summary;
    if (structuredSummary !== undefined) note.structuredSummary = structuredSummary;
    if (transcript !== undefined) note.transcript = transcript;
    if (audioUrl !== undefined) note.audioUrl = normalizeAudioUrl(audioUrl);
    if (durationSeconds !== undefined) note.durationSeconds = durationSeconds;

    await saveNotesData(data);
    return NextResponse.json({ success: true, note });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    const data = await loadNotesData();
    data.notes = data.notes.filter((n: any) => n.id !== id);
    await saveNotesData(data);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
