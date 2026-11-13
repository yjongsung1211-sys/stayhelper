import { NextResponse } from 'next/server';
import {
  loadNotesData,
  saveNotesData,
  normalizeAudioUrl,
  detectNoteCategory,
  sendSecondBrainTelegramBriefing,
  isCloudEnvironment,
} from '@/app/secondbrain/cloudStore';
import { getPcTunnelBase } from '../pcTunnel';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  const data = await loadNotesData();
  let notes = data.notes;

  // The PC is the source of truth for fresh BLE recordings. Merge its live note
  // list into the cloud list so read-only cloud credentials do not block display.
  if (isCloudEnvironment() && request.headers.get('x-from-pc-tunnel') !== '1') {
    try {
      const tunnelBase = await getPcTunnelBase();
      if (tunnelBase) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        try {
          const pcRes = await fetch(`${tunnelBase}/api/secondbrain/notes`, {
            headers: { 'x-from-pc-tunnel': '1' },
            signal: controller.signal,
            cache: 'no-store',
          });
          if (pcRes.ok) {
            const pcData = await pcRes.json();
            if (Array.isArray(pcData?.notes)) {
              const merged = new Map<string, any>();
              const noteKey = (note: any) =>
                note?.hardwareSn != null
                  ? `hardware:${note.hardwareSn}:${note.hardwareCrc || note.hardwareFileName || ''}`
                  : `id:${note?.id || ''}`;
              for (const note of notes) merged.set(noteKey(note), note);
              for (const note of pcData.notes) merged.set(noteKey(note), note);
              notes = Array.from(merged.values());
            }
          }
        } finally {
          clearTimeout(timer);
        }
      }
    } catch {
      // Keep the cloud list available if the PC tunnel is offline.
    }
  }

  let filtered = notes;

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

    const cat = detectNoteCategory(body);
    const mergedTags = Array.from(
      new Set([...(Array.isArray(body.tags) ? body.tags : ['음성녹음']), ...cat.autoTags])
    );

    const newNote = {
      id: `sbn-note-${Date.now()}`,
      title: body.title || `녹음 기록 - ${new Date().toLocaleDateString('ko-KR')}`,
      recordedAt: new Date().toISOString(),
      durationSeconds: body.durationSeconds || 10,
      audioUrl: normalizeAudioUrl(body.audioUrl),
      source: body.source || 'device_hardware',
      targetLang: body.targetLang || undefined,
      aiCoaching: body.aiCoaching || undefined,
      deviceModel: body.deviceModel || 'NoteHelper',
      speakers: body.speakers || ['담당자'],
      tags: mergedTags,
      categoryLabel: cat.categoryLabel,
      categoryFolder: cat.obsidianFolder,
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

    // 1. 텔레그램 즉시 브리핑 발송 (녹음 완료 즉시 대표님 텔레그램으로 핵심 요약 3줄 + 전사본 발송)
    await sendSecondBrainTelegramBriefing(newNote, 'new_note');

    return NextResponse.json({ success: true, note: newNote });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      summary,
      structuredSummary,
      transcript,
      audioUrl,
      durationSeconds,
      actionOutputs,
    } = body;
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
    if (actionOutputs !== undefined) note.actionOutputs = actionOutputs;
    if (body.targetLang !== undefined) note.targetLang = body.targetLang;
    if (body.aiCoaching !== undefined) note.aiCoaching = body.aiCoaching;

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
    const target = data.notes.find((n: any) => n.id === id);
    const extraTombstones: string[] = [id];
    if (target?.hardwareSn !== undefined) {
      extraTombstones.push(`hw-sn-${target.hardwareSn}`);
    }
    if (target?.hardwareFileName) {
      extraTombstones.push(`hw-file-${target.hardwareFileName}`);
    }

    data.deletedIds = Array.from(new Set([...(data.deletedIds || []), ...extraTombstones]));
    data.notes = data.notes.filter((n: any) => n.id !== id);
    await saveNotesData(data);

    return NextResponse.json({
      success: true,
      deletedId: id,
      deletedIds: data.deletedIds,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
