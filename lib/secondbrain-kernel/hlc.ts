/** Hybrid Logical Clock — 서버(scripts/secondbrain_sync_kernel.py)와 동일한 직렬화 형식. */

export function packClock(wallMs: number, counter: number, node: string): string {
  return `${String(wallMs).padStart(13, '0')}-${String(counter).padStart(5, '0')}-${node}`;
}

export function unpackClock(clock: string): { wall: number; counter: number; node: string } | null {
  const m = /^(\d{13})-(\d{5})-(.+)$/.exec(clock);
  if (!m) return null;
  return { wall: Number(m[1]), counter: Number(m[2]), node: m[3] };
}

export class Hlc {
  private l = 0;
  private c = 0;

  constructor(
    public readonly node: string,
    private readonly wall: () => number = () => Date.now()
  ) {}

  now(): string {
    const pt = this.wall();
    if (pt > this.l) {
      this.l = pt;
      this.c = 0;
    } else {
      this.c += 1;
    }
    return packClock(this.l, this.c, this.node);
  }

  /** 서버 시계를 관측해, 이후 발급하는 로컬 시계가 항상 그보다 뒤에 오게 한다. */
  observe(clock: string): void {
    const r = unpackClock(clock);
    if (!r) return;
    const pt = this.wall();
    if (pt > this.l && pt > r.wall) {
      this.l = pt;
      this.c = 0;
    } else if (r.wall > this.l) {
      this.l = r.wall;
      this.c = r.counter + 1;
    } else if (r.wall === this.l) {
      this.c = Math.max(this.c, r.counter) + 1;
    } else {
      this.c += 1;
    }
  }
}
