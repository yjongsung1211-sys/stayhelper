'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { KernelEngine } from '@/lib/secondbrain-kernel/engine';
import { searchLocal } from '@/lib/secondbrain-kernel/search';
import type { EngineSnapshot, RemoteSearchHit } from '@/lib/secondbrain-kernel/types';

interface PaletteItem {
  key: string;
  kind: 'doc' | 'deep' | 'capture';
  title: string;
  subtitle: string;
  docId?: string;
  badge: string;
}

interface Props {
  engine: KernelEngine;
  snapshot: EngineSnapshot;
  open: boolean;
  onClose: () => void;
  onOpenDoc: (docId: string) => void;
}

const KIND_BADGE: Record<string, string> = { note: '노트', todo: '할 일', event: '일정', memo: '메모' };

/**
 * Instant Command Palette (Cmd/Ctrl+K).
 * 1단: 메모리 인덱스 즉시 검색(키 입력과 같은 프레임) → 2단: 서버 FTS 본문 검색(120ms 디바운스, 도착하면 덧붙임).
 * `>` 로 시작하거나 결과가 없으면 Enter 로 바로 메모 캡처.
 */
export default function CommandPalette({ engine, snapshot, open, onClose, onOpenDoc }: Props) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [deep, setDeep] = useState<{ query: string; hits: RemoteSearchHit[] }>({ query: '', hits: [] });
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isCapture = query.trimStart().startsWith('>');
  const text = isCapture ? query.trimStart().slice(1).trim() : query.trim();

  const local = useMemo(
    () => (isCapture ? [] : searchLocal(snapshot.docs, text, 10)),
    [snapshot.docs, text, isCapture]
  );

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
    setDeep({ query: '', hits: [] });
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open || isCapture || text.length < 2) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      engine
        .searchRemote(text, 8)
        .then((hits) => {
          if (!cancelled) setDeep({ query: text, hits });
        })
        .catch(() => undefined); // 오프라인이면 로컬 결과만으로 충분하다
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [engine, open, text, isCapture]);

  const items = useMemo<PaletteItem[]>(() => {
    const out: PaletteItem[] = local.map((h) => ({
      key: `doc-${h.doc.id}`,
      kind: 'doc',
      title: h.title,
      subtitle: h.subtitle,
      docId: h.doc.id,
      badge: (h.doc.pending ? '● ' : '') + (KIND_BADGE[h.doc.kind] ?? h.doc.kind),
    }));
    if (!isCapture && deep.query === text) {
      const seen = new Set(local.map((h) => h.doc.id));
      for (const hit of deep.hits) {
        if (seen.has(hit.id)) continue;
        out.push({
          key: `deep-${hit.id}`,
          kind: 'deep',
          title: hit.title,
          subtitle: hit.snippet,
          docId: hit.id,
          badge: '본문',
        });
      }
    }
    if (text) {
      out.push({
        key: 'capture',
        kind: 'capture',
        title: `메모로 캡처: “${text.length > 48 ? `${text.slice(0, 48)}…` : text}”`,
        subtitle: '프로젝트 분류 · 할 일/일정 추출 · 백링크까지 자동 처리',
        badge: '↵ 캡처',
      });
    }
    return out;
  }, [local, deep, text, isCapture]);

  useEffect(() => {
    setCursor((c) => Math.min(c, Math.max(0, items.length - 1)));
  }, [items.length]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  if (!open) return null;

  const run = (item: PaletteItem | undefined) => {
    if (!item) return;
    if (item.kind === 'capture') engine.capture(text, 'command_palette');
    else if (item.docId) onOpenDoc(item.docId);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // 한글 조합 중 Enter 는 무시
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (items.length ? (c + 1) % items.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (items.length ? (c - 1 + items.length) % items.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(items[cursor]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/40 px-3 pt-[12vh] backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="세컨드브레인 명령 팔레트"
        className="w-full max-w-[620px] overflow-hidden rounded-2xl border border-black/10 bg-white text-[#111111] shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-black/10 px-4">
          <span className="text-[13px] font-semibold text-black/40">⌘K</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="노트·할 일·일정 검색, 또는 > 로 시작해 바로 메모"
            className="h-12 w-full bg-transparent text-[15px] outline-none placeholder:text-black/35"
            aria-label="검색어"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="shrink-0 text-[11px] text-black/40">
            {snapshot.phase === 'offline' ? '오프라인' : `${snapshot.docs.size}건`}
          </span>
        </div>
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-1" role="listbox">
          {items.length === 0 && (
            <p className="px-4 py-6 text-center text-[13px] text-black/45">
              검색어를 입력하세요. 결과가 없으면 Enter 로 메모가 됩니다.
            </p>
          )}
          {items.map((item, i) => (
            <button
              key={item.key}
              type="button"
              role="option"
              aria-selected={i === cursor}
              data-index={i}
              onMouseEnter={() => setCursor(i)}
              onClick={() => run(item)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left ${
                i === cursor ? 'bg-[#111111] text-white' : 'text-[#111111]'
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{item.title}</span>
                <span className={`block truncate text-[12px] ${i === cursor ? 'text-white/65' : 'text-black/45'}`}>
                  {item.subtitle}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] ${
                  i === cursor ? 'bg-white/15 text-white' : 'bg-black/5 text-black/55'
                }`}
              >
                {item.badge}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-black/10 px-4 py-2 text-[11px] text-black/45">
          <span>↑↓ 이동 · ↵ 열기 · esc 닫기</span>
          <span>{snapshot.pendingCount > 0 ? `동기화 대기 ${snapshot.pendingCount}건` : '로컬-퍼스트'}</span>
        </div>
      </div>
    </div>
  );
}
