'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { getKernelEngine, type KernelEngine } from './engine';
import type { EngineSnapshot } from './types';

/** 엔진 스냅샷을 구독한다. 읽기는 전부 메모리에서 동기적으로 일어난다. */
export function useKernel(autoBoot = true): { engine: KernelEngine; snapshot: EngineSnapshot } {
  const engine = getKernelEngine();
  const snapshot = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getServerSnapshot);
  useEffect(() => {
    if (autoBoot) void engine.boot();
  }, [engine, autoBoot]);
  return { engine, snapshot };
}
