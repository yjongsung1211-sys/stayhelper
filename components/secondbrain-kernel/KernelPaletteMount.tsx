'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useKernel } from '@/lib/secondbrain-kernel/hooks';
import CommandPalette from './CommandPalette';

/**
 * 기존 /secondbrain 화면에 Cmd/Ctrl+K 팔레트 및 커널/그래프 직행 플로팅 도크를 얹는 마운트.
 * 처음 단축키나 검색 버튼을 누르기 전에는 엔진을 부팅하지 않아 기존 페이지 로딩에 영향을 주지 않는다.
 */
function ActivePalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { engine, snapshot } = useKernel();
  return (
    <CommandPalette
      engine={engine}
      snapshot={snapshot}
      open
      onClose={onClose}
      onOpenDoc={(id) => router.push(`/secondbrain/kernel?doc=${encodeURIComponent(id)}`)}
    />
  );
}

export default function KernelPaletteMount() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ownsShortcut = !pathname?.startsWith('/secondbrain/kernel'); // 커널 화면은 자체 팔레트를 가진다

  useEffect(() => {
    if (!ownsShortcut) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ownsShortcut]);

  if (!ownsShortcut) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-2.5 py-1.5 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-[#0F172A] transition hover:bg-slate-200 cursor-pointer"
          title="세컨드브레인 로컬 커널 즉시 검색 (Ctrl+K)"
        >
          <span>🔍 커널 검색</span>
          <kbd className="hidden sm:inline-block rounded border border-slate-300 bg-white px-1 py-0.5 font-mono text-[9px] text-slate-600">
            Ctrl+K
          </kbd>
        </button>
        <Link
          href="/secondbrain/kernel"
          className="flex items-center gap-1 rounded-full bg-[#0F172A] px-3 py-1 text-[11px] font-bold text-white transition hover:bg-[#1E293B]"
          title="Local-First 동기화 커널 & 지식 그래프 열기"
        >
          <span>⚡ 로컬 커널·그래프</span>
        </Link>
      </div>
      {open && <ActivePalette onClose={() => setOpen(false)} />}
    </>
  );
}
