import { getCloudToken } from '@/app/secondbrain/cloudStore';

// The PC daemon (scripts/antigravity_mobile_daemon.py) opens a Cloudflare quick tunnel to the
// local Next server and publishes its URL to pcStatus.tunnelUrl in the bridge repo.
// Quick-tunnel URLs change on every restart, so never hardcode them.
const BRIDGE_API =
  'https://api.github.com/repos/yjongsung1211-sys/secondbrain-vault-sync/contents/antigravity_bridge.json';
const CACHE_MS = 30_000;

let cached: { url: string; at: number } | null = null;

export async function getPcTunnelBase(): Promise<string | null> {
  if (process.env.PC_TUNNEL_URL) return process.env.PC_TUNNEL_URL.replace(/\/$/, '');
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.url || null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(BRIDGE_API, {
      headers: {
        Authorization: `Bearer ${getCloudToken()}`,
        Accept: 'application/vnd.github.raw+json',
        'User-Agent': 'SecondBrain-Web',
      },
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);
    if (!res.ok) return cached?.url || null;
    const bridge = await res.json();
    const url = String(bridge?.pcStatus?.tunnelUrl || '').replace(/\/$/, '');
    cached = { url, at: Date.now() };
    return url.startsWith('https://') ? url : null;
  } catch {
    return cached?.url || null;
  }
}
