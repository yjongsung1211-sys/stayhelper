import type { KernelDoc, PendingCapture, PendingOp } from './types';

export type StoredDoc = Omit<KernelDoc, 'pending'>;

export interface StoredState {
  docs: StoredDoc[];
  pending: PendingOp[];
  captures: PendingCapture[];
  meta: Record<string, string>;
}

/** 엔진이 요구하는 영속 계층. 브라우저는 IndexedDB, SSR·테스트는 메모리 구현을 쓴다. */
export interface KernelStorage {
  loadAll(): Promise<StoredState>;
  putDocs(docs: StoredDoc[]): Promise<void>;
  replaceDocs(docs: StoredDoc[]): Promise<void>;
  putPending(op: PendingOp): Promise<void>;
  deletePending(opIds: string[]): Promise<void>;
  putCapture(capture: PendingCapture): Promise<void>;
  deleteCapture(clientId: string): Promise<void>;
  setMeta(key: string, value: string): Promise<void>;
}

export class MemoryStorage implements KernelStorage {
  private docs = new Map<string, StoredDoc>();
  private pending = new Map<string, PendingOp>();
  private captures = new Map<string, PendingCapture>();
  private meta = new Map<string, string>();

  async loadAll(): Promise<StoredState> {
    return {
      docs: Array.from(this.docs.values()),
      pending: Array.from(this.pending.values()),
      captures: Array.from(this.captures.values()),
      meta: Object.fromEntries(this.meta),
    };
  }
  async putDocs(docs: StoredDoc[]): Promise<void> {
    for (const d of docs) this.docs.set(d.id, d);
  }
  async replaceDocs(docs: StoredDoc[]): Promise<void> {
    this.docs = new Map(docs.map((d) => [d.id, d]));
  }
  async putPending(op: PendingOp): Promise<void> {
    this.pending.set(op.opId, op);
  }
  async deletePending(opIds: string[]): Promise<void> {
    for (const id of opIds) this.pending.delete(id);
  }
  async putCapture(capture: PendingCapture): Promise<void> {
    this.captures.set(capture.clientId, capture);
  }
  async deleteCapture(clientId: string): Promise<void> {
    this.captures.delete(clientId);
  }
  async setMeta(key: string, value: string): Promise<void> {
    this.meta.set(key, value);
  }
}

const DB_NAME = 'secondbrain-kernel';
const DB_VERSION = 1;
const STORES = ['docs', 'pending', 'captures', 'meta'] as const;
type StoreName = (typeof STORES)[number];

function requestToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB request failed'));
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
  });
}

export class IndexedDbStorage implements KernelStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private open(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('docs')) db.createObjectStore('docs', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('pending')) db.createObjectStore('pending', { keyPath: 'opId' });
          if (!db.objectStoreNames.contains('captures')) db.createObjectStore('captures', { keyPath: 'clientId' });
          if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
      });
    }
    return this.dbPromise;
  }

  private async write(stores: StoreName[], fn: (tx: IDBTransaction) => void): Promise<void> {
    const db = await this.open();
    const tx = db.transaction(stores, 'readwrite');
    fn(tx);
    await txDone(tx);
  }

  async loadAll(): Promise<StoredState> {
    const db = await this.open();
    const tx = db.transaction([...STORES], 'readonly');
    const metaStore = tx.objectStore('meta');
    const [docs, pending, captures, metaKeys, metaValues] = await Promise.all([
      requestToPromise(tx.objectStore('docs').getAll() as IDBRequest<StoredDoc[]>),
      requestToPromise(tx.objectStore('pending').getAll() as IDBRequest<PendingOp[]>),
      requestToPromise(tx.objectStore('captures').getAll() as IDBRequest<PendingCapture[]>),
      requestToPromise(metaStore.getAllKeys()),
      requestToPromise(metaStore.getAll() as IDBRequest<string[]>),
    ]);
    const meta: Record<string, string> = {};
    metaKeys.forEach((k, i) => {
      meta[String(k)] = metaValues[i];
    });
    pending.sort((a, b) => a.createdAt - b.createdAt || (a.clock < b.clock ? -1 : 1));
    captures.sort((a, b) => a.createdAt - b.createdAt);
    return { docs, pending, captures, meta };
  }

  putDocs(docs: StoredDoc[]): Promise<void> {
    if (docs.length === 0) return Promise.resolve();
    return this.write(['docs'], (tx) => {
      const store = tx.objectStore('docs');
      for (const d of docs) store.put(d);
    });
  }

  replaceDocs(docs: StoredDoc[]): Promise<void> {
    return this.write(['docs'], (tx) => {
      const store = tx.objectStore('docs');
      store.clear();
      for (const d of docs) store.put(d);
    });
  }

  putPending(op: PendingOp): Promise<void> {
    return this.write(['pending'], (tx) => {
      tx.objectStore('pending').put(op);
    });
  }

  deletePending(opIds: string[]): Promise<void> {
    if (opIds.length === 0) return Promise.resolve();
    return this.write(['pending'], (tx) => {
      const store = tx.objectStore('pending');
      for (const id of opIds) store.delete(id);
    });
  }

  putCapture(capture: PendingCapture): Promise<void> {
    return this.write(['captures'], (tx) => {
      tx.objectStore('captures').put(capture);
    });
  }

  deleteCapture(clientId: string): Promise<void> {
    return this.write(['captures'], (tx) => {
      tx.objectStore('captures').delete(clientId);
    });
  }

  setMeta(key: string, value: string): Promise<void> {
    return this.write(['meta'], (tx) => {
      tx.objectStore('meta').put(value, key);
    });
  }
}

export function createDefaultStorage(): KernelStorage {
  if (typeof indexedDB !== 'undefined') return new IndexedDbStorage();
  return new MemoryStorage();
}
