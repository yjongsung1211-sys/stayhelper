import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STORE_PATH = path.join(process.cwd(), 'data', 'schedulehelper_store.json');

export interface ConnectedEmailAccount {
    id: string;
    email: string;
    provider: string;
    imapHost?: string;
    status: 'connected' | 'pending';
    lastSyncedAt: string;
}

export interface ScheduleStoreData {
    noteHelperLinked: boolean;
    connectedEmails?: ConnectedEmailAccount[];
    events: any[];
    todos: any[];
    updatedAt: string;
}

function readStore(): ScheduleStoreData {
    try {
        if (fs.existsSync(STORE_PATH)) {
            const raw = fs.readFileSync(STORE_PATH, 'utf-8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.error('[ScheduleHelper API] read error:', e);
    }
    return {
        noteHelperLinked: false,
        connectedEmails: [],
        events: [],
        todos: [],
        updatedAt: new Date().toISOString(),
    };
}

function writeStore(data: ScheduleStoreData) {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
    const data = readStore();
    return NextResponse.json({
        ok: true,
        data,
        bridgeInfo: {
            app: 'ScheduleHelper',
            version: '1.1.0',
            noteHelperLinked: data.noteHelperLinked,
            endpoint: '/api/schedulehelper',
            description: 'Independent Schedule & To-Do Hub with Multi-Email & NoteHelper Bridge',
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const store = readStore();

        if (body.action === 'save_all') {
            // SecondBrain 커널이 꽂은 항목 중 이 클라이언트가 아직 못 본 것은 통째 덮어쓰기에서 살려 둔다.
            // 사용자가 명시적으로 지운 항목(removedIds)만 실제로 제거한다 — lost update 방지.
            const removed = new Set<string>(Array.isArray(body.removedIds) ? body.removedIds.map(String) : []);
            const keepUnseen = (incoming: any[], current: any[]) => {
                const have = new Set(incoming.map((it) => it?.id));
                return current.filter(
                    (it) => it?.source === 'secondbrain' && !have.has(it.id) && !removed.has(String(it.id))
                );
            };
            if (Array.isArray(body.events)) {
                store.events = [...body.events, ...keepUnseen(body.events, store.events || [])];
            }
            if (Array.isArray(body.todos)) {
                store.todos = [...keepUnseen(body.todos, store.todos || []), ...body.todos];
            }
            if (typeof body.noteHelperLinked === 'boolean') {
                store.noteHelperLinked = body.noteHelperLinked;
            }
            if (Array.isArray(body.connectedEmails)) {
                store.connectedEmails = body.connectedEmails;
            }
            writeStore(store);
            return NextResponse.json({ ok: true, data: store });
        }

        if (body.action === 'add_email_account') {
            const list = Array.isArray(store.connectedEmails) ? store.connectedEmails : [];
            const newAcc: ConnectedEmailAccount = {
                id: `email-${Date.now()}`,
                email: String(body.email || '').trim(),
                provider: String(body.provider || 'IMAP 메일'),
                imapHost: String(body.imapHost || ''),
                status: 'connected',
                lastSyncedAt: new Date().toISOString(),
            };
            store.connectedEmails = [...list, newAcc];
            writeStore(store);
            return NextResponse.json({ ok: true, data: store });
        }

        if (body.action === 'remove_email_account') {
            const list = Array.isArray(store.connectedEmails) ? store.connectedEmails : [];
            store.connectedEmails = list.filter((a) => a.id !== body.id);
            writeStore(store);
            return NextResponse.json({ ok: true, data: store });
        }

        if (body.action === 'toggle_bridge') {
            store.noteHelperLinked = Boolean(body.noteHelperLinked);
            writeStore(store);
            return NextResponse.json({ ok: true, noteHelperLinked: store.noteHelperLinked, data: store });
        }

        if (body.action === 'external_ingest') {
            if (!store.noteHelperLinked && body.sourceApp === 'notehelper') {
                return NextResponse.json(
                    {
                        ok: false,
                        reason: 'NoteHelper 연동이 현재 OFF 상태입니다. ScheduleHelper 상단에서 [NoteHelper 연동 브릿지]를 켜면 수신됩니다.',
                    },
                    { status: 403 }
                );
            }
            if (Array.isArray(body.newEvents)) {
                store.events = [...store.events, ...body.newEvents];
            }
            if (Array.isArray(body.newTodos)) {
                store.todos = [...body.newTodos, ...store.todos];
            }
            writeStore(store);
            return NextResponse.json({ ok: true, data: store });
        }

        return NextResponse.json({ ok: false, error: 'Unknown action' }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 });
    }
}
