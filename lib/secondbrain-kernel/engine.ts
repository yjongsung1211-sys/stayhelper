/**
 * Local-First 낙관적 동기화 엔진.
 *
 *  - 읽기: 항상 메모리(view)에서 동기적으로 — 네트워크를 기다리는 읽기가 없다.
 *  - 쓰기: mutate() 가 view 에 즉시 반영하고(낙관적), Op 를 IndexedDB 큐에 넣은 뒤 백그라운드로 push.
 *  - 수렴: 서버가 내려주는 Op 를 필드 단위 LWW 로 confirmed 에 적용하고, 그 위에 미확정 Op 를 다시 얹는다(rebase).
 *  - 오프라인: 큐는 디스크에 남고, 온라인 복귀·포커스·백오프 타이머에 재전송된다. Op 는 멱등이라 중복 전송이 안전하다.
 */
import { Hlc } from './hlc';
import { createDefaultStorage, type KernelStorage, type StoredDoc } from './storage';
import type {
  CaptureResult,
  DocKind,
  EngineSnapshot,
  GraphData,
  KernelDoc,
  PendingCapture,
  PendingOp,
  PullResponse,
  PushResponse,
  RemoteSearchHit,
  SnapshotResponse,
  SyncPhase,
  WireOp,
} from './types';

export class KernelUnreachableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KernelUnreachableError';
  }
}

export interface EngineOptions {
  baseUrl?: string;
  storage?: KernelStorage;
  fetchFn?: typeof fetch;
  wall?: () => number;
  /** 주기적 델타 풀 간격(ms). 0 이면 끈다. */
  pollMs?: number;
  /** false 면 window 이벤트/타이머를 걸지 않는다 (테스트용). */
  attachBrowserEvents?: boolean;
}

const EMPTY_DOCS: ReadonlyMap<string, KernelDoc> = new Map();

export const SERVER_SNAPSHOT: EngineSnapshot = {
  version: 0,
  phase: 'booting',
  docs: EMPTY_DOCS,
  pendingCount: 0,
  cursor: 0,
  lastSyncedAt: null,
  lastError: null,
  lastCapture: null,
  conflicts: [],
};

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

function maxClock(clocks: Record<string, string>): string {
  let m = '';
  for (const k in clocks) if (clocks[k] > m) m = clocks[k];
  return m;
}

/** 서버 Op 를 confirmed 문서에 필드 단위 LWW 로 적용한다. 적용 순서와 무관하게 같은 결과가 된다. */
export function applyWireOp(prev: StoredDoc | undefined, op: WireOp): StoredDoc {
  const doc: StoredDoc = prev
    ? { ...prev, fields: { ...prev.fields }, clocks: { ...prev.clocks } }
    : { id: op.docId, kind: op.kind, fields: {}, clocks: {}, deletedClock: '', deleted: false };
  for (const field of Object.keys(op.patch)) {
    const clock = op.clocks?.[field] ?? op.clock;
    if (clock > (doc.clocks[field] ?? '')) {
      doc.fields[field] = op.patch[field];
      doc.clocks[field] = clock;
    }
  }
  if (op.clocks) {
    for (const field of Object.keys(op.clocks)) {
      if (!(field in op.patch) && op.clocks[field] > (doc.clocks[field] ?? '')) {
        doc.clocks[field] = op.clocks[field];
      }
    }
  }
  if (op.deleted && op.clock > doc.deletedClock) doc.deletedClock = op.clock;
  doc.deleted = doc.deletedClock !== '' && doc.deletedClock > maxClock(doc.clocks);
  return doc;
}

export class KernelEngine {
  private readonly baseUrl: string;
  private readonly storage: KernelStorage;
  private readonly fetchFn: typeof fetch;
  private readonly wall: () => number;
  private readonly pollMs: number;
  private readonly attachBrowserEvents: boolean;

  private hlc = new Hlc('web-boot');
  private confirmed = new Map<string, StoredDoc>();
  private pending: PendingOp[] = [];
  private captures: PendingCapture[] = [];
  private cursor = 0;
  private epoch = '';
  private phase: SyncPhase = 'booting';
  private lastSyncedAt: number | null = null;
  private lastError: string | null = null;
  private lastCapture: CaptureResult | null = null;
  private conflicts: string[] = [];

  private snapshot: EngineSnapshot = SERVER_SNAPSHOT;
  private version = 0;
  private listeners = new Set<() => void>();

  private bootPromise: Promise<void> | null = null;
  private syncing = false;
  private syncAgain = false;
  private backoffMs = 1000;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private detach: Array<() => void> = [];

  constructor(options: EngineOptions = {}) {
    this.baseUrl = (options.baseUrl ?? '/api/secondbrain/kernel').replace(/\/$/, '');
    this.storage = options.storage ?? createDefaultStorage();
    this.fetchFn = options.fetchFn ?? ((input, init) => fetch(input, init));
    this.wall = options.wall ?? (() => Date.now());
    this.pollMs = options.pollMs ?? 20000;
    this.attachBrowserEvents = options.attachBrowserEvents ?? typeof window !== 'undefined';
  }

  // ── 구독 (useSyncExternalStore 계약) ──────────────────────────────────────
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): EngineSnapshot => this.snapshot;

  getServerSnapshot = (): EngineSnapshot => SERVER_SNAPSHOT;

  private emit(): void {
    this.version += 1;
    const view = new Map<string, KernelDoc>();
    this.confirmed.forEach((doc, id) => {
      if (!doc.deleted) view.set(id, doc);
    });
    for (const op of this.pending) {
      const base = view.get(op.docId) ?? this.confirmed.get(op.docId);
      if (op.deleted) {
        view.delete(op.docId);
        continue;
      }
      view.set(op.docId, {
        id: op.docId,
        kind: op.kind,
        fields: { ...(base?.fields ?? {}), ...op.patch },
        clocks: base?.clocks ?? {},
        deletedClock: base?.deletedClock ?? '',
        deleted: false,
        pending: true,
      });
    }
    for (const cap of this.captures) {
      view.set(`memo:${cap.clientId}`, {
        id: `memo:${cap.clientId}`,
        kind: 'memo',
        fields: { title: cap.text.slice(0, 42), text: cap.text, capturedAt: cap.createdAt },
        clocks: {},
        deletedClock: '',
        deleted: false,
        pending: true,
      });
    }
    this.snapshot = {
      version: this.version,
      phase: this.phase,
      docs: view,
      pendingCount: this.pending.length + this.captures.length,
      cursor: this.cursor,
      lastSyncedAt: this.lastSyncedAt,
      lastError: this.lastError,
      lastCapture: this.lastCapture,
      conflicts: this.conflicts,
    };
    this.listeners.forEach((l) => l());
  }

  // ── 부팅 ─────────────────────────────────────────────────────────────────
  boot(): Promise<void> {
    if (!this.bootPromise) this.bootPromise = this.doBoot();
    return this.bootPromise;
  }

  private async doBoot(): Promise<void> {
    let nodeId = '';
    try {
      const state = await this.storage.loadAll();
      this.confirmed = new Map(state.docs.map((d) => [d.id, d]));
      this.pending = state.pending;
      this.captures = state.captures;
      this.cursor = Number(state.meta.cursor ?? '0') || 0;
      this.epoch = state.meta.epoch ?? '';
      nodeId = state.meta.nodeId ?? '';
    } catch (e) {
      this.lastError = e instanceof Error ? e.message : String(e);
    }
    if (!nodeId) {
      nodeId = `web-${randomId().slice(0, 8)}`;
      void this.storage.setMeta('nodeId', nodeId).catch(() => undefined);
    }
    this.hlc = new Hlc(nodeId, this.wall);
    for (const op of this.pending) this.hlc.observe(op.clock);
    this.emit(); // 디스크에 있던 상태를 네트워크보다 먼저 화면에 올린다

    if (this.attachBrowserEvents && typeof window !== 'undefined') {
      const onOnline = () => void this.sync();
      const onVisible = () => {
        if (document.visibilityState === 'visible') void this.sync();
      };
      window.addEventListener('online', onOnline);
      document.addEventListener('visibilitychange', onVisible);
      this.detach.push(() => window.removeEventListener('online', onOnline));
      this.detach.push(() => document.removeEventListener('visibilitychange', onVisible));
      if (this.pollMs > 0) {
        this.pollTimer = setInterval(() => {
          if (document.visibilityState === 'visible' && this.phase !== 'offline') void this.sync();
        }, this.pollMs);
      }
    }
    await this.sync();
  }

  dispose(): void {
    this.detach.forEach((fn) => fn());
    this.detach = [];
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.pollTimer = null;
    this.retryTimer = null;
  }

  // ── 낙관적 쓰기 ───────────────────────────────────────────────────────────
  mutate(
    docId: string,
    kind: DocKind,
    patch: Record<string, unknown>,
    options: { deleted?: boolean; baseSha?: string } = {}
  ): string {
    const op: PendingOp = {
      opId: `${this.hlc.node}-${randomId()}`,
      docId,
      kind,
      patch,
      clock: this.hlc.now(),
      node: this.hlc.node,
      createdAt: this.wall(),
      ...(options.deleted ? { deleted: true } : {}),
      ...(options.baseSha ? { baseSha: options.baseSha } : {}),
    };
    this.pending.push(op);
    this.emit(); // 0ms: 화면은 여기서 이미 바뀌었다
    void this.storage
      .putPending(op)
      .catch((e: unknown) => {
        this.lastError = e instanceof Error ? e.message : String(e);
      })
      .then(() => this.sync());
    return op.opId;
  }

  create(kind: DocKind, fields: Record<string, unknown>): string {
    const docId = `${kind}:${randomId().slice(0, 16)}`;
    this.mutate(docId, kind, fields);
    return docId;
  }

  remove(docId: string, kind: DocKind): void {
    this.mutate(docId, kind, {}, { deleted: true });
  }

  /** 메모 한 줄 캡처. 즉시 '대기 중' 메모로 보이고, 커널이 구조화한 노트·할 일·일정이 델타로 돌아온다. */
  capture(text: string, source = 'web'): string {
    const capture: PendingCapture = { clientId: randomId(), text: text.trim(), source, createdAt: this.wall() };
    if (!capture.text) return '';
    this.captures.push(capture);
    this.emit();
    void this.storage
      .putCapture(capture)
      .catch(() => undefined)
      .then(() => this.sync());
    return capture.clientId;
  }

  // ── 네트워크 ──────────────────────────────────────────────────────────────
  private async api<T>(path: string, body?: unknown): Promise<T> {
    let res: Response;
    try {
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      if (typeof localStorage !== 'undefined') {
        const key = localStorage.getItem('sbk_proxy_key');
        if (key) headers['x-sbk-key'] = key;
      }
      res = await this.fetchFn(`${this.baseUrl}/${path}`, {
        method: body === undefined ? 'GET' : 'POST',
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: 'no-store',
      });
    } catch (e) {
      throw new KernelUnreachableError(e instanceof Error ? e.message : 'network error');
    }
    if (res.status === 502 || res.status === 503 || res.status === 504) {
      throw new KernelUnreachableError(`kernel unreachable (${res.status})`);
    }
    const json = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
    if (!res.ok || json === null) {
      throw new Error(json?.error ?? `kernel request failed (${res.status})`);
    }
    return json;
  }

  sync(): Promise<void> {
    if (this.syncing) {
      this.syncAgain = true;
      return Promise.resolve();
    }
    return this.runSync();
  }

  private async runSync(): Promise<void> {
    this.syncing = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.phase !== 'syncing') {
      this.phase = 'syncing';
      this.emit();
    }
    try {
      await this.flushCaptures();
      await this.flushOps();
      await this.pull();
      this.phase = 'idle';
      this.lastSyncedAt = this.wall();
      this.lastError = null;
      this.backoffMs = 1000;
    } catch (e) {
      this.phase = 'offline';
      this.lastError = e instanceof Error ? e.message : String(e);
      if (this.attachBrowserEvents) {
        this.retryTimer = setTimeout(() => void this.sync(), this.backoffMs);
        this.backoffMs = Math.min(this.backoffMs * 2, 60000);
      }
    } finally {
      this.syncing = false;
      this.emit();
    }
    if (this.syncAgain) {
      this.syncAgain = false;
      if (this.phase !== 'offline') await this.runSync();
    }
  }

  private async flushCaptures(): Promise<void> {
    while (this.captures.length > 0) {
      const cap = this.captures[0];
      const result = await this.api<CaptureResult>('capture', {
        text: cap.text,
        source: cap.source,
        clientId: cap.clientId,
      });
      this.captures = this.captures.filter((c) => c.clientId !== cap.clientId);
      this.lastCapture = result;
      await this.storage.deleteCapture(cap.clientId).catch(() => undefined);
    }
  }

  private async flushOps(): Promise<void> {
    while (this.pending.length > 0) {
      const batch = this.pending.slice(0, 100);
      const response = await this.api<PushResponse>('sync/push', {
        ops: batch.map(({ createdAt: _createdAt, ...op }) => op),
      });
      const acked = new Set<string>();
      const won = new Set<string>();
      for (const result of response.results) {
        acked.add(result.opId);
        if (result.status === 'applied' || result.status === 'duplicate') won.add(result.opId);
        if (result.status === 'rejected') {
          this.lastError = result.error ?? 'op rejected';
        } else if (result.status === 'conflict' && result.conflictCopy) {
          this.conflicts = [...this.conflicts.slice(-9), result.conflictCopy.path];
        }
      }
      if (acked.size === 0) throw new Error('push returned no acknowledgements');
      // 서버가 받아들인 Op 는 pull 로 내려올 때까지 view 가 깜빡이지 않도록 confirmed 에 먼저 반영한다.
      // stale·conflict·merged 는 서버 결과가 진실이므로 반영하지 않고 뒤따르는 pull 에 맡긴다.
      const touched: StoredDoc[] = [];
      for (const op of batch) {
        if (!won.has(op.opId)) continue;
        const next = applyWireOp(this.confirmed.get(op.docId), op);
        this.confirmed.set(op.docId, next);
        touched.push(next);
      }
      this.pending = this.pending.filter((op) => !acked.has(op.opId));
      await this.storage.putDocs(touched).catch(() => undefined);
      await this.storage.deletePending(Array.from(acked)).catch(() => undefined);
    }
  }

  private async bootstrap(): Promise<void> {
    const snap = await this.api<SnapshotResponse>('snapshot?lite=1');
    this.confirmed = new Map(snap.docs.map((d) => [d.id, d]));
    this.cursor = snap.cursor;
    if (snap.epoch) {
      this.epoch = snap.epoch;
      await this.storage.setMeta('epoch', snap.epoch).catch(() => undefined);
    }
    await this.storage.replaceDocs(snap.docs).catch(() => undefined);
    await this.storage.setMeta('cursor', String(this.cursor)).catch(() => undefined);
  }

  private async pull(): Promise<void> {
    if (this.cursor === 0 && this.confirmed.size === 0) {
      await this.bootstrap();
      return;
    }
    for (let page = 0; page < 200; page += 1) {
      const res = await this.api<PullResponse>(`sync/pull?cursor=${this.cursor}&limit=500&lite=1`);
      if (res.resync || (res.epoch !== undefined && this.epoch !== '' && res.epoch !== this.epoch)) {
        await this.bootstrap(); // 로그가 압축됐거나 다른 DB — 캐시를 버리고 다시 받는다 (미전송 큐는 유지)
        return;
      }
      if (res.epoch && this.epoch === '') {
        this.epoch = res.epoch;
        await this.storage.setMeta('epoch', res.epoch).catch(() => undefined);
      }
      const touched = new Map<string, StoredDoc>();
      for (const op of res.ops) {
        this.hlc.observe(op.clock);
        const next = applyWireOp(this.confirmed.get(op.docId), op);
        this.confirmed.set(op.docId, next);
        touched.set(op.docId, next);
      }
      this.cursor = res.cursor;
      if (touched.size > 0) {
        await this.storage.putDocs(Array.from(touched.values())).catch(() => undefined);
        await this.storage.setMeta('cursor', String(this.cursor)).catch(() => undefined);
      }
      if (!res.hasMore) return;
    }
  }

  // ── 온디맨드 조회 (본문·심층 검색·그래프) ─────────────────────────────────
  async fetchBody(docId: string): Promise<{ body: string; bodySha: string }> {
    const res = await this.api<{ fields: Record<string, unknown> }>(`doc?id=${encodeURIComponent(docId)}`);
    return { body: String(res.fields.body ?? ''), bodySha: String(res.fields.bodySha ?? '') };
  }

  async searchRemote(query: string, limit = 12): Promise<RemoteSearchHit[]> {
    const res = await this.api<{ results: RemoteSearchHit[] }>(
      `search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return res.results;
  }

  async fetchGraph(limit = 220): Promise<GraphData> {
    return this.api<GraphData>(`graph?limit=${limit}`);
  }
}

let singleton: KernelEngine | null = null;

export function getKernelEngine(): KernelEngine {
  if (!singleton) singleton = new KernelEngine();
  return singleton;
}
