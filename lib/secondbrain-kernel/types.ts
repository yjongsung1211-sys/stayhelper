/**
 * SecondBrain Sync Kernel — 클라이언트/서버 공용 프로토콜 계약.
 * 서버 구현: scripts/secondbrain_sync_kernel.py
 */

export type DocKind = 'note' | 'todo' | 'event' | 'memo';

export interface KernelDoc {
  id: string;
  kind: DocKind;
  fields: Record<string, unknown>;
  /** 필드별 HLC 시계 — 더 큰 시계가 이긴다 (필드 단위 LWW) */
  clocks: Record<string, string>;
  deletedClock: string;
  deleted: boolean;
  /** 아직 서버 확인을 받지 못한 낙관적 변경이 얹혀 있음 */
  pending?: boolean;
}

export interface WireOp {
  opId: string;
  docId: string;
  kind: DocKind;
  patch: Record<string, unknown>;
  clock: string;
  node: string;
  deleted?: boolean;
  /** 노트 본문 수정 시, 편집을 시작한 버전의 해시 (서버 3-way 병합 기준점) */
  baseSha?: string;
  /** 서버가 내려주는 Op 에만 존재: 필드별 확정 시계 */
  clocks?: Record<string, string>;
  seq?: number;
}

export interface PendingOp extends WireOp {
  createdAt: number;
}

export interface PendingCapture {
  clientId: string;
  text: string;
  source: string;
  createdAt: number;
}

export type OpStatus = 'applied' | 'merged' | 'duplicate' | 'stale' | 'conflict' | 'rejected';

export interface PushResult {
  opId: string;
  status: OpStatus;
  seq?: number;
  error?: string;
  conflictCopy?: { path: string; seq?: number };
}

export interface PushResponse {
  results: PushResult[];
  cursor: number;
}

export interface PullResponse {
  ops: WireOp[];
  cursor: number;
  hasMore: boolean;
  resync?: boolean;
  /** 커널 DB 의 정체성. 캐시한 값과 다르면 다른(새) DB 이므로 스냅샷부터 다시 받는다. */
  epoch?: string;
}

export interface SnapshotResponse {
  docs: Array<Omit<KernelDoc, 'pending'>>;
  cursor: number;
  epoch?: string;
}

export interface CaptureProject {
  key: string;
  label: string;
  group: string;
  confidential: boolean;
}

export interface CaptureResult {
  ok: boolean;
  noteId: string;
  path: string;
  title: string;
  projects: CaptureProject[];
  people: string[];
  summary: string[];
  todos: Array<{ id: string; title: string; dueTag: string; new: boolean }>;
  events: Array<{ id: string; title: string; date: string; day: string; time: string; new: boolean }>;
  links: Array<{ id: string; path: string; title: string; why: string }>;
  confidential: boolean;
  duplicate?: boolean;
}

export interface GraphNode {
  id: string;
  title: string;
  path: string;
  group: string;
  degree: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: Array<[string, string]>;
  orphans: number;
}

export interface RemoteSearchHit {
  id: string;
  title: string;
  snippet: string;
  path: string;
}

/**
 * 동기화 상태 머신
 *   booting ─▶ syncing ─▶ idle ◀──▶ syncing
 *                 │                    │
 *                 └──▶ offline ◀───────┘   (네트워크/커널 불가 — 큐 유지, 지수 백오프 재시도)
 */
export type SyncPhase = 'booting' | 'idle' | 'syncing' | 'offline';

export interface EngineSnapshot {
  version: number;
  phase: SyncPhase;
  docs: ReadonlyMap<string, KernelDoc>;
  pendingCount: number;
  cursor: number;
  lastSyncedAt: number | null;
  lastError: string | null;
  lastCapture: CaptureResult | null;
  conflicts: string[];
}
