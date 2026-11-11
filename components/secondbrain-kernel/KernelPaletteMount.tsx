'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useKernel } from '@/lib/secondbrain-kernel/hooks';
import CommandPalette from './CommandPalette';

/**
 * 기존 /secondbrain 화면에 Cmd/Ctrl+K 팔레트만 얹는 마운트.
 * 처음 단축키를 누르기 전에는 엔진을 부팅하지 않아 기존 페이지 로딩에 영향을 주지 않는다.
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

  if (!ownsShortcut || !open) return null;
  return <ActivePalette onClose={() => setOpen(false)} />;
}
