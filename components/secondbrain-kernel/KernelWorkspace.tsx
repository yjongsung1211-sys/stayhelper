'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useKernel } from '@/lib/secondbrain-kernel/hooks';
import { docTitle } from '@/lib/secondbrain-kernel/search';
import type { EngineSnapshot, GraphData, KernelDoc } from '@/lib/secondbrain-kernel/types';
import CommandPalette from './CommandPalette';
import GraphMinimap from './GraphMinimap';

const PHASE_LABEL: Record<EngineSnapshot['phase'], { text: string; dot: string }> = {
  booting: { text: '로컬 캐시 로드 중', dot: 'bg-black/30' },
  syncing: { text: '동기화 중', dot: 'bg-amber-500' },
  idle: { text: '동기화 완료', dot: 'bg-emerald-500' },
  offline: { text: '오프라인 — 변경은 큐에 보관', dot: 'bg-rose-500' },
};

function field(doc: KernelDoc, key: string): string {
  const v = doc.fields[key];
  return typeof v === 'string' ? v : '';
}

function list(doc: KernelDoc, key: string): string[] {
  const v = doc.fields[key];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

export default function KernelWorkspace() {
  const { engine, snapshot } = useKernel();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [body, setBody] = useState<{ id: string; text: string; sha: string } | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [bodyError, setBodyError] = useState<string | null>(null);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get('doc');
    if (initial) setSelectedId(initial);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 그래프는 동기화 커서가 움직였을 때만 다시 받는다
  useEffect(() => {
    if (snapshot.phase === 'booting') return;
    let cancelled = false;
    engine
      .fetchGraph()
      .then((g) => {
        if (!cancelled) setGraph(g);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [engine, snapshot.cursor, snapshot.phase === 'booting']);

  const { todos, events, notes, memos } = useMemo(() => {
    const t: KernelDoc[] = [];
    const e: KernelDoc[] = [];
    const n: KernelDoc[] = [];
    const m: KernelDoc[] = [];
    snapshot.docs.forEach((doc) => {
      if (doc.kind === 'todo') t.push(doc);
      else if (doc.kind === 'event') e.push(doc);
      else if (doc.kind === 'memo') m.push(doc);
      else n.push(doc);
    });
    t.sort((a, b) => Number(a.fields.done === true) - Number(b.fields.done === true) || field(b, 'createdAt').localeCompare(field(a, 'createdAt')));
    e.sort((a, b) => (field(a, 'date') || 'z').localeCompare(field(b, 'date') || 'z') || field(a, 'time').localeCompare(field(b, 'time')));
    n.sort((a, b) => field(b, 'capturedAt').localeCompare(field(a, 'capturedAt')));
    return { todos: t, events: e, notes: n, memos: m };
  }, [snapshot.docs]);

  const selected = selectedId ? snapshot.docs.get(selectedId) ?? null : null;
  const selectedSha = selected ? field(selected, 'bodySha') : '';

  useEffect(() => {
    setDraft(null);
    setBodyError(null);
    if (!selectedId || !selected || selected.kind !== 'note') {
      setBody(null);
      return;
    }
    let cancelled = false;
    engine
      .fetchBody(selectedId)
      .then((res) => {
        if (!cancelled) setBody({ id: selectedId, text: res.body, sha: res.bodySha });
      })
      .catch(() => {
        if (!cancelled) setBodyError('본문은 커널 연결 후 불러옵니다. 요약과 메타데이터는 로컬 캐시에서 표시 중입니다.');
      });
    return () => {
      cancelled = true;
    };
    // selectedSha 가 바뀌면(다른 기기의 수정이 도착) 본문을 다시 받는다
  }, [engine, selectedId, selectedSha, selected?.kind]);

  const submitMemo = useCallback(() => {
    if (!memo.trim()) return;
    engine.capture(memo, 'web_quick_capture');
    setMemo('');
  }, [engine, memo]);

  const saveDraft = () => {
    if (!selected || draft === null || !body) return;
    engine.mutate(selected.id, 'note', { body: draft }, { baseSha: body.sha });
    setBody({ ...body, text: draft });
    setDraft(null);
  };

  const phase = PHASE_LABEL[snapshot.phase];
  const capture = snapshot.lastCapture;

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-[#111111]">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-black/10 bg-[#F4F3EE]/90 px-4 py-3 backdrop-blur">
        <h1 className="text-[16px] font-bold">SecondBrain Kernel</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] text-black/70">
          <span className={`inline-block h-2 w-2 rounded-full ${phase.dot}`} />
          {phase.text}
          {snapshot.pendingCount > 0 && <b className="font-semibold"> · 대기 {snapshot.pendingCount}</b>}
        </span>
        <span className="text-[12px] text-black/45">
          노트 {notes.length} · 할 일 {todos.length} · 일정 {events.length} · seq {snapshot.cursor}
        </span>
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="ml-auto rounded-lg border border-black/15 bg-white px-3 py-1.5 text-[13px] text-black/60 hover:border-black/40"
        >
          검색 · 명령 <kbd className="ml-1 rounded bg-black/5 px-1 text-[11px]">Ctrl/⌘ K</kbd>
        </button>
      </header>

      <main className="mx-auto grid max-w-[1280px] gap-4 p-4 lg:grid-cols-[340px_minmax(0,1fr)_340px]">
        <section className="space-y-4">
          <div className="rounded-2xl bg-white p-4">
            <label htmlFor="sbk-memo" className="text-[13px] font-semibold">
              메모 한 줄
            </label>
            <textarea
              id="sbk-memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitMemo();
              }}
              rows={3}
              placeholder="내일 오후 3시 김 대표와 실사 미팅. 금요일까지 LOI 초안 검토."
              className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[#FAFAF7] p-3 text-[14px] outline-none focus:border-black/40"
            />
            <button
              type="button"
              onClick={submitMemo}
              disabled={!memo.trim()}
              className="mt-2 w-full rounded-xl bg-[#111111] py-2 text-[13px] font-semibold text-white disabled:opacity-30"
            >
              캡처 (Ctrl/⌘ + Enter)
            </button>
            {memos.map((m) => (
              <p key={m.id} className="mt-2 truncate rounded-lg bg-amber-50 px-2 py-1 text-[12px] text-amber-800">
                전송 대기: {field(m, 'text')}
              </p>
            ))}
            {capture && (
              <div className="mt-3 rounded-xl bg-[#FAFAF7] p-3 text-[12px] leading-relaxed text-black/70">
                <p className="font-semibold text-[#111111]">
                  방금 구조화됨{capture.confidential ? ' · 🔒 로컬 AI 전용' : ''}
                </p>
                {capture.projects.length > 0 && <p>프로젝트: {capture.projects.map((p) => p.label).join(', ')}</p>}
                <p>
                  할 일 {capture.todos.length} · 일정 {capture.events.length} · 백링크 {capture.links.length}
                </p>
                <button type="button" className="mt-1 underline" onClick={() => setSelectedId(capture.noteId)}>
                  노트 열기
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-4">
            <h2 className="text-[13px] font-semibold">할 일</h2>
            <ul className="mt-2 space-y-1">
              {todos.length === 0 && <li className="text-[12px] text-black/40">추출된 할 일이 없습니다.</li>}
              {todos.slice(0, 30).map((t) => {
                const done = t.fields.done === true;
                return (
                  <li key={t.id} className="flex items-start gap-2 rounded-lg px-1 py-1 hover:bg-black/[0.03]">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => engine.mutate(t.id, 'todo', { done: !done })}
                      className="mt-1 h-4 w-4 accent-[#111111]"
                      aria-label={`${docTitle(t)} 완료`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[13px] ${done ? 'text-black/35 line-through' : ''}`}>{docTitle(t)}</span>
                      <span className="block text-[11px] text-black/45">
                        {field(t, 'dueTag')}
                        {t.pending ? ' · 전송 대기' : ''}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <h2 className="text-[13px] font-semibold">일정</h2>
            <ul className="mt-2 space-y-1.5">
              {events.length === 0 && <li className="text-[12px] text-black/40">추출된 일정이 없습니다.</li>}
              {events.slice(0, 20).map((e) => (
                <li key={e.id} className="text-[13px]">
                  <span className="mr-2 inline-block min-w-[92px] text-[11px] tabular-nums text-black/50">
                    {field(e, 'date') || field(e, 'day')} {field(e, 'time').slice(0, 5)}
                  </span>
                  {docTitle(e)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="min-h-[420px] rounded-2xl bg-white p-5">
          {!selected && (
            <div className="text-[13px] text-black/50">
              <p className="text-[15px] font-semibold text-[#111111]">최근 노트</p>
              <ul className="mt-3 divide-y divide-black/5">
                {notes.slice(0, 14).map((n) => (
                  <li key={n.id}>
                    <button type="button" onClick={() => setSelectedId(n.id)} className="w-full py-2 text-left">
                      <span className="block truncate text-[14px] font-medium text-[#111111]">{docTitle(n)}</span>
                      <span className="block truncate text-[12px] text-black/45">{field(n, 'path')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selected && (
            <article>
              <button type="button" onClick={() => setSelectedId(null)} className="text-[12px] text-black/45 underline">
                ← 목록
              </button>
              <h2 className="mt-2 text-[20px] font-bold leading-snug">{docTitle(selected)}</h2>
              <p className="mt-1 break-all text-[12px] text-black/45">{field(selected, 'path')}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {[...list(selected, 'projects'), ...list(selected, 'tags')].slice(0, 12).map((tag) => (
                  <span key={tag} className="rounded-md bg-black/5 px-1.5 py-0.5 text-[11px] text-black/60">
                    #{tag}
                  </span>
                ))}
              </div>
              {selected.kind === 'note' && (
                <div className="mt-4">
                  {draft === null ? (
                    <>
                      <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#FAFAF7] p-4 font-sans text-[13px] leading-relaxed">
                        {body?.id === selected.id ? body.text : field(selected, 'excerpt')}
                      </pre>
                      {bodyError && <p className="mt-2 text-[12px] text-rose-600">{bodyError}</p>}
                      <button
                        type="button"
                        disabled={body?.id !== selected.id}
                        onClick={() => setDraft(body?.text ?? '')}
                        className="mt-3 rounded-lg border border-black/15 px-3 py-1.5 text-[13px] disabled:opacity-30"
                      >
                        편집
                      </button>
                    </>
                  ) : (
                    <>
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="h-[56vh] w-full rounded-xl border border-black/15 bg-[#FAFAF7] p-4 font-mono text-[13px] leading-relaxed outline-none focus:border-black/40"
                        aria-label="노트 본문"
                      />
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={saveDraft} className="rounded-lg bg-[#111111] px-3 py-1.5 text-[13px] font-semibold text-white">
                          저장 (볼트에 즉시 반영)
                        </button>
                        <button type="button" onClick={() => setDraft(null)} className="rounded-lg border border-black/15 px-3 py-1.5 text-[13px]">
                          취소
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </article>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl bg-white p-4">
            <h2 className="mb-2 text-[13px] font-semibold">지식 그래프</h2>
            <GraphMinimap graph={graph} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          {snapshot.conflicts.length > 0 && (
            <div className="rounded-2xl bg-white p-4 text-[12px]">
              <h2 className="text-[13px] font-semibold">충돌 사본</h2>
              <p className="mt-1 text-black/55">동시에 같은 줄을 고쳐 자동 병합하지 못한 버전을 볼트에 따로 보존했습니다.</p>
              <ul className="mt-2 space-y-1">
                {snapshot.conflicts.map((p) => (
                  <li key={p} className="break-all text-black/70">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {snapshot.lastError && snapshot.phase === 'offline' && (
            <p className="rounded-2xl bg-white p-4 text-[12px] text-black/55">
              커널에 연결할 수 없습니다. PC 에서 <code className="rounded bg-black/5 px-1">python scripts/secondbrain_sync_kernel.py serve</code> 가
              실행 중인지 확인하세요. 그동안의 입력은 이 기기에 저장되며 연결되면 자동 전송됩니다.
            </p>
          )}
        </section>
      </main>

      <CommandPalette
        engine={engine}
        snapshot={snapshot}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenDoc={setSelectedId}
      />
    </div>
  );
}
