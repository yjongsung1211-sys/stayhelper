import type { KernelDoc } from './types';

export interface LocalHit {
  doc: KernelDoc;
  score: number;
  title: string;
  subtitle: string;
}

interface Haystack {
  title: string;
  tags: string;
  text: string;
}

const cache = new WeakMap<KernelDoc, Haystack>();

function str(v: unknown): string {
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string').join(' ');
  return '';
}

function haystack(doc: KernelDoc): Haystack {
  let h = cache.get(doc);
  if (!h) {
    const f = doc.fields;
    h = {
      title: str(f.title).toLowerCase(),
      tags: `${str(f.tags)} ${str(f.projects)} ${str(f.people)} ${str(f.path)}`.toLowerCase(),
      text: `${str(f.excerpt)} ${str(f.summary)} ${str(f.text)} ${str(f.rawSnippet)} ${str(f.dueTag)} ${str(
        f.participantOrPlace
      )}`.toLowerCase(),
    };
    cache.set(doc, h);
  }
  return h;
}

export function docTitle(doc: KernelDoc): string {
  return str(doc.fields.title) || str(doc.fields.path) || doc.id;
}

function subtitleOf(doc: KernelDoc): string {
  const f = doc.fields;
  if (doc.kind === 'note') return str(f.path);
  if (doc.kind === 'todo') return `할 일 · ${str(f.dueTag) || '기한 미정'}${f.done === true ? ' · 완료' : ''}`;
  if (doc.kind === 'event') return `일정 · ${str(f.date) || str(f.day)} ${str(f.time)}`.trim();
  return '전송 대기 중인 메모';
}

/**
 * 메모리 내 즉시 검색. 문서 객체는 변경 시 새로 만들어지므로 WeakMap 캐시가 자동 무효화된다.
 * 수천 건 규모에서 키 입력마다 1ms 안쪽으로 끝난다 — 본문 전체 검색은 서버 FTS(searchRemote)가 보완한다.
 */
export function searchLocal(docs: ReadonlyMap<string, KernelDoc>, query: string, limit = 12): LocalHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const hits: LocalHit[] = [];
  docs.forEach((doc) => {
    const h = haystack(doc);
    let score = 0;
    for (const t of terms) {
      if (h.title.startsWith(t)) score += 100;
      else if (h.title.includes(t)) score += 60;
      else if (h.tags.includes(t)) score += 30;
      else if (h.text.includes(t)) score += 10;
      else return;
    }
    if (terms.length === 0) score = doc.kind === 'note' ? 1 : 2;
    if (doc.pending) score += 1;
    hits.push({ doc, score, title: docTitle(doc), subtitle: subtitleOf(doc) });
  });
  hits.sort((a, b) => b.score - a.score || a.title.length - b.title.length);
  return hits.slice(0, limit);
}
