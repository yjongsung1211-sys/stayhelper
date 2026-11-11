'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { GraphData } from '@/lib/secondbrain-kernel/types';

interface Props {
  graph: GraphData | null;
  selectedId: string | null;
  onSelect: (docId: string) => void;
  height?: number;
}

interface SimNode {
  id: string;
  title: string;
  group: string;
  degree: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const PALETTE = ['#2563eb', '#d97706', '#059669', '#db2777', '#7c3aed', '#0891b2', '#65a30d', '#dc2626'];
const MAX_NODES = 180;

/**
 * 지식 그래프 미니맵 — 캔버스 위 자체 구현 force 레이아웃(반발 + 스프링 + 중심 인력).
 * 180노드 이하로 잘라 O(n²) 반발 계산을 프레임 예산 안에 넣고, 에너지가 식으면 rAF 루프를 멈춘다.
 */
export default function GraphMinimap({ graph, selectedId, onSelect, height = 300 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const [width, setWidth] = useState(320);
  const [hover, setHover] = useState<string | null>(null);

  const model = useMemo(() => {
    const nodes = (graph?.nodes ?? []).slice(0, MAX_NODES);
    const index = new Map(nodes.map((n, i) => [n.id, i]));
    const edges: Array<[number, number]> = [];
    for (const [a, b] of graph?.edges ?? []) {
      const ia = index.get(a);
      const ib = index.get(b);
      if (ia !== undefined && ib !== undefined) edges.push([ia, ib]);
    }
    const groups = Array.from(new Set(nodes.map((n) => n.group))).sort();
    const color = new Map(groups.map((g, i) => [g, PALETTE[i % PALETTE.length]]));
    return { nodes, edges, index, groups, color };
  }, [graph]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0].contentRect.width);
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const previous = new Map(nodesRef.current.map((n) => [n.id, n]));
    nodesRef.current = model.nodes.map((n, i) => {
      const old = previous.get(n.id);
      const angle = (i / Math.max(1, model.nodes.length)) * Math.PI * 2;
      const radius = 40 + (i % 7) * 14;
      return {
        id: n.id,
        title: n.title,
        group: n.group,
        degree: n.degree,
        x: old?.x ?? width / 2 + Math.cos(angle) * radius,
        y: old?.y ?? height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      };
    });
  }, [model, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const nodes = nodesRef.current;
    const { edges, index, color } = model;
    const neighbors = new Set<number>();
    const focusIndex = index.get(hover ?? selectedId ?? '');
    if (focusIndex !== undefined) {
      for (const [a, b] of edges) {
        if (a === focusIndex) neighbors.add(b);
        if (b === focusIndex) neighbors.add(a);
      }
    }

    let alpha = 1;
    let frame = 0;
    const tick = () => {
      const n = nodes.length;
      if (alpha > 0.02) {
        for (let i = 0; i < n; i += 1) {
          const a = nodes[i];
          for (let j = i + 1; j < n; j += 1) {
            const b = nodes[j];
            let dx = a.x - b.x;
            let dy = a.y - b.y;
            let d2 = dx * dx + dy * dy;
            if (d2 < 0.01) {
              dx = (i % 3) - 1 || 0.5;
              dy = (j % 3) - 1 || 0.5;
              d2 = 1;
            }
            const force = (520 * alpha) / d2;
            const d = Math.sqrt(d2);
            const fx = (dx / d) * force;
            const fy = (dy / d) * force;
            a.vx += fx;
            a.vy += fy;
            b.vx -= fx;
            b.vy -= fy;
          }
        }
        for (const [ia, ib] of edges) {
          const a = nodes[ia];
          const b = nodes[ib];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const pull = (d - 46) * 0.02 * alpha;
          const fx = (dx / d) * pull;
          const fy = (dy / d) * pull;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
        for (const node of nodes) {
          node.vx += (width / 2 - node.x) * 0.012 * alpha;
          node.vy += (height / 2 - node.y) * 0.012 * alpha;
          node.vx *= 0.82;
          node.vy *= 0.82;
          node.x = Math.max(8, Math.min(width - 8, node.x + node.vx));
          node.y = Math.max(8, Math.min(height - 8, node.y + node.vy));
        }
        alpha *= 0.985;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      for (const [ia, ib] of edges) {
        const lit = focusIndex !== undefined && (ia === focusIndex || ib === focusIndex);
        ctx.strokeStyle = lit ? 'rgba(17,17,17,0.55)' : 'rgba(17,17,17,0.10)';
        ctx.beginPath();
        ctx.moveTo(nodes[ia].x, nodes[ia].y);
        ctx.lineTo(nodes[ib].x, nodes[ib].y);
        ctx.stroke();
      }
      nodes.forEach((node, i) => {
        const focused = i === focusIndex;
        const dim = focusIndex !== undefined && !focused && !neighbors.has(i);
        const r = Math.min(9, 2.5 + Math.sqrt(node.degree) * 1.3) + (focused ? 2 : 0);
        ctx.globalAlpha = dim ? 0.25 : 1;
        ctx.fillStyle = color.get(node.group) ?? '#6b7280';
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (focused) {
          ctx.strokeStyle = '#111111';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      });
      ctx.globalAlpha = 1;
      if (focusIndex !== undefined && nodes[focusIndex]) {
        const node = nodes[focusIndex];
        const label = node.title.length > 26 ? `${node.title.slice(0, 26)}…` : node.title;
        ctx.font = '600 11px system-ui, sans-serif';
        const w = ctx.measureText(label).width + 10;
        const lx = Math.max(2, Math.min(width - w - 2, node.x - w / 2));
        const ly = node.y > 28 ? node.y - 26 : node.y + 12;
        ctx.fillStyle = 'rgba(17,17,17,0.92)';
        ctx.fillRect(lx, ly, w, 18);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, lx + 5, ly + 13);
      }
      if (alpha > 0.02) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [model, width, height, selectedId, hover]);

  const pick = (e: React.MouseEvent<HTMLCanvasElement>): string | null => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let best: string | null = null;
    let bestD = 14 * 14;
    for (const node of nodesRef.current) {
      const d = (node.x - x) ** 2 + (node.y - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = node.id;
      }
    }
    return best;
  };

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height }}
        className="block cursor-pointer rounded-xl bg-[#FAFAF7]"
        role="img"
        aria-label={`지식 그래프: 노드 ${model.nodes.length}개, 연결 ${model.edges.length}개`}
        onMouseMove={(e) => setHover(pick(e))}
        onMouseLeave={() => setHover(null)}
        onClick={(e) => {
          const id = pick(e);
          if (id) onSelect(id);
        }}
      />
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-black/55">
        {model.groups.slice(0, 8).map((g) => (
          <span key={g} className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: model.color.get(g) }} />
            {g}
          </span>
        ))}
        {graph && (
          <span className="ml-auto">
            노드 {model.nodes.length} · 연결 {model.edges.length} · 고립 {graph.orphans}
          </span>
        )}
      </div>
    </div>
  );
}
