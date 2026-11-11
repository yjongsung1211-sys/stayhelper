'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Calendar,
    Plus,
    Search,
    PanelLeft,
    Trash2,
    CheckSquare,
    Mail,
    Link2,
    Upload,
    Clock,
    MapPin,
    X,
    ExternalLink,
    Download,
    Smartphone,
} from 'lucide-react';

export type SourceChannel = 'kakao' | 'wechat' | 'whatsapp' | 'kakao_cal' | 'gmail';
export type DayKey = '월' | '화' | '수' | '목' | '금' | '토' | '일' | '미정';

export interface ScheduleEventItem {
    id: string;
    source: SourceChannel;
    day: DayKey;
    time: string;
    title: string;
    participantOrPlace: string;
    rawSnippet: string;
    category: 'routine' | 'tutoring' | 'meeting';
    createdAt: string;
}

export interface TodoTaskItem {
    id: string;
    source: SourceChannel;
    title: string;
    dueTag: string;
    priority: 'urgent' | 'high' | 'normal';
    done: boolean;
    rawSnippet: string;
    createdAt: string;
}

export interface ConnectedEmailItem {
    id: string;
    email: string;
    provider: string;
    imapHost?: string;
    status: 'connected' | 'pending';
    lastSyncedAt: string;
}

const CHANNEL_META: Record<SourceChannel, { label: string; badge: string; placeholder: string }> = {
    gmail: {
        label: '이메일 (Gmail)',
        badge: '이메일',
        placeholder:
            '지메일에 도착한 과외 수업 알림이나 비즈니스 미팅 메일 본문을 붙여넣으세요.\n예) 수요일 16:00 비즈니스 영어 미팅 / 목요일 10:00 글로벌 프로젝트 콜',
    },
    kakao: {
        label: '카카오톡 대화',
        badge: '카카오톡',
        placeholder:
            '카카오톡 대화 내용을 붙여넣으세요.\n예) [김팀장] 목요일 오후 3시에 강남에서 미팅 가능하신가요? 수요일까지 자료 보내드리겠습니다.',
    },
    wechat: {
        label: '위챗 (WeChat)',
        badge: '위챗',
        placeholder:
            '위챗(WeChat) 대화를 붙여넣으세요.\n예) Let’s have a call this Friday at 4pm KST. Please send the spec sheet before Thursday.',
    },
    whatsapp: {
        label: '와츠앱 (WhatsApp)',
        badge: '와츠앱',
        placeholder:
            '와츠앱(WhatsApp) 대화를 붙여넣으세요.\n예) Meeting confirmed for Wednesday 11:00 AM. Don’t forget to review the NDA draft.',
    },
    kakao_cal: {
        label: '카카오 캘린더',
        badge: '캘린더',
        placeholder: '카카오 캘린더 .ics 파일을 업로드하거나 일정 텍스트를 붙여넣으세요.',
    },
};

// 루미너스 화이트 & 라이트 파스텔(스카이블루 · 아쿠아민트 · 웜앰버) 톤
const CATEGORY_TONE: Record<
    'routine' | 'tutoring' | 'meeting',
    {
        label: string;
        cardBg: string;
        leftBar: string;
        badgeClass: string;
        timePill: string;
    }
> = {
    tutoring: {
        label: '어학 과외',
        cardBg: 'bg-[#F5F8FF] border-[#DCE7FE]',
        leftBar: 'border-l-4 border-l-[#4F46E5]',
        badgeClass: 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]',
        timePill: 'bg-white text-[#3730A3] border border-[#DCE7FE] shadow-sm',
    },
    routine: {
        label: '고정 루틴',
        cardBg: 'bg-[#F0FDF9] border-[#CCFBF1]',
        leftBar: 'border-l-4 border-l-[#14B8A6]',
        badgeClass: 'bg-[#E6FFFA] text-[#0F766E] border border-[#99F6E4]',
        timePill: 'bg-white text-[#0F766E] border border-[#CCFBF1] shadow-sm',
    },
    meeting: {
        label: '미팅 · 약속',
        cardBg: 'bg-[#FFFBEB] border-[#FDE68A]',
        leftBar: 'border-l-4 border-l-[#F59E0B]',
        badgeClass: 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]',
        timePill: 'bg-white text-[#B45309] border border-[#FDE68A] shadow-sm',
    },
};

function getWeekDaysList(): { key: DayKey; dateStr: string; fullLabel: string; isToday?: boolean }[] {
    const now = new Date();
    const currentDayIdx = now.getDay(); // 0 is Sun, 1 is Mon
    const mondayOffset = currentDayIdx === 0 ? -6 : 1 - currentDayIdx;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);

    const orderedKeys: DayKey[] = ['월', '화', '수', '목', '금', '토', '일'];
    return orderedKeys.map((key, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const mStr = String(d.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d.getDate()).padStart(2, '0');
        const isToday = d.toDateString() === now.toDateString();
        return {
            key,
            dateStr: `${mStr}/${dayStr}`,
            fullLabel: `${d.getMonth() + 1}월 ${d.getDate()}일 (${key})`,
            isToday,
        };
    });
}

const DAYS_INFO = getWeekDaysList();
const DAYS_ORDER: DayKey[] = ['월', '화', '수', '목', '금', '토', '일'];

const INITIAL_VERIFIED_EVENTS: ScheduleEventItem[] = [
    {
        id: 'demo-mon-kickoff',
        source: 'gmail',
        day: '월',
        time: '10:00 ~ 11:30',
        title: '글로벌 비즈니스 킥오프 미팅',
        participantOrPlace: 'Zoom 화상회의',
        rawSnippet: 'Monday 10:00 Global Business Kickoff Meeting',
        category: 'meeting',
        createdAt: '2026-11-10T10:00:00Z',
    },
    {
        id: 'demo-tue-routine',
        source: 'kakao_cal',
        day: '화',
        time: '06:30 ~ 07:30',
        title: '모닝 러닝 & 스트레칭 루틴',
        participantOrPlace: '피트니스 센터',
        rawSnippet: '화·목·토 아침 6시 30분 운동',
        category: 'routine',
        createdAt: '2026-11-10T06:30:00Z',
    },
    {
        id: 'demo-wed-english',
        source: 'gmail',
        day: '수',
        time: '16:00 ~ 17:00',
        title: '1:1 비즈니스 영어 프레젠테이션 코칭',
        participantOrPlace: '온라인 화상 세션',
        rawSnippet: 'Wednesday 16:00 Business English Presentation',
        category: 'tutoring',
        createdAt: '2026-11-10T16:00:00Z',
    },
    {
        id: 'demo-thu-spanish',
        source: 'gmail',
        day: '목',
        time: '10:00 ~ 11:00',
        title: '스페인어 회화 스터디 (글로벌 팀)',
        participantOrPlace: 'Google Meet',
        rawSnippet: 'Thursday 10:00 Spanish Conversation Study',
        category: 'tutoring',
        createdAt: '2026-11-10T10:00:00Z',
    },
    {
        id: 'demo-fri-review',
        source: 'gmail',
        day: '금',
        time: '15:00 ~ 16:30',
        title: '주간 스프린트 회고 및 차주 기획',
        participantOrPlace: '컨퍼런스 룸 / 온라인',
        rawSnippet: 'Friday 15:00 Sprint Review & Next Week Plan',
        category: 'meeting',
        createdAt: '2026-11-10T15:00:00Z',
    },
    {
        id: 'demo-sat-swim',
        source: 'kakao_cal',
        day: '토',
        time: '07:00 ~ 08:30',
        title: '주말 수영 & 리커버리 세션',
        participantOrPlace: '스포츠센터',
        rawSnippet: '주말 아침 수영 세션',
        category: 'routine',
        createdAt: '2026-11-10T07:00:00Z',
    },
    {
        id: 'demo-sun-planning',
        source: 'gmail',
        day: '일',
        time: '20:00 ~ 21:00',
        title: '주간 플래닝 & 목표 정렬 세션',
        participantOrPlace: '개인 서재',
        rawSnippet: 'Sunday 20:00 Weekly Planning',
        category: 'routine',
        createdAt: '2026-11-10T20:00:00Z',
    },
];

const INITIAL_VERIFIED_TODOS: TodoTaskItem[] = [
    {
        id: 'demo-td-proposal',
        source: 'gmail',
        title: '글로벌 파트너사 제휴 제안서 초안 검토 및 승인',
        dueTag: '수요일까지',
        priority: 'high',
        done: false,
        rawSnippet: 'Review partnership proposal draft',
        createdAt: '2026-11-10T21:00:00Z',
    },
    {
        id: 'demo-td-release',
        source: 'kakao',
        title: '신규 웹 서비스 릴리즈 체크리스트 점검',
        dueTag: '이번 주 내',
        priority: 'high',
        done: false,
        rawSnippet: 'Release checklist verification',
        createdAt: '2026-11-10T21:00:00Z',
    },
    {
        id: 'demo-td-speech',
        source: 'gmail',
        title: '영어 프레젠테이션 스크립트 발음 교정 녹음',
        dueTag: '금요일 전',
        priority: 'normal',
        done: false,
        rawSnippet: 'English speech script audio review',
        createdAt: '2026-11-10T21:00:00Z',
    },
    {
        id: 'demo-td-infra',
        source: 'kakao_cal',
        title: '주간 클라우드 인프라 리소스 모니터링 리포트 확인',
        dueTag: '완료됨',
        priority: 'normal',
        done: true,
        rawSnippet: 'Cloud infrastructure health check',
        createdAt: '2026-11-10T21:00:00Z',
    },
];

function exportEventsToICS(eventsList: ScheduleEventItem[]) {
    if (!eventsList || eventsList.length === 0) {
        alert('내보낼 일정이 없습니다.');
        return;
    }
    const now = new Date();
    const nowTimestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dayMap: Record<DayKey, number> = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '미정': 1 };
    const currentDay = now.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);

    const ics: string[] = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ScheduleHelper//Smart Schedule Planner//KO',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:ScheduleHelper 캘린더',
        'X-WR-TIMEZONE:Asia/Seoul',
    ];

    eventsList.forEach((ev, idx) => {
        const offset = dayMap[ev.day] !== undefined ? (dayMap[ev.day] === 0 ? 6 : dayMap[ev.day] - 1) : 0;
        const targetDate = new Date(monday);
        targetDate.setDate(monday.getDate() + offset);

        let startH = 9, startM = 0, endH = 10, endM = 0;
        const parts = ev.time.split('~');
        if (parts[0]) {
            const m = parts[0].trim().match(/(\d{1,2}):(\d{2})/);
            if (m) {
                startH = parseInt(m[1], 10);
                startM = parseInt(m[2], 10);
                endH = startH + 1;
                endM = startM;
            }
        }
        if (parts[1]) {
            const m = parts[1].trim().match(/(\d{1,2}):(\d{2})/);
            if (m) {
                endH = parseInt(m[1], 10);
                endM = parseInt(m[2], 10);
            }
        }

        const y = targetDate.getFullYear();
        const mon = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const dtStart = `${y}${mon}${day}T${String(startH).padStart(2, '0')}${String(startM).padStart(2, '0')}00`;
        const dtEnd = `${y}${mon}${day}T${String(endH).padStart(2, '0')}${String(endM).padStart(2, '0')}00`;

        ics.push(
            'BEGIN:VEVENT',
            `UID:event-${Date.now()}-${idx}@schedulehelper.com`,
            `DTSTAMP:${nowTimestamp}`,
            `DTSTART:${dtStart}`,
            `DTEND:${dtEnd}`,
            `SUMMARY:${ev.title.replace(/[,;]/g, ' ')}`,
            `LOCATION:${(ev.participantOrPlace || '').replace(/[,;]/g, ' ')}`,
            `DESCRIPTION:${(ev.rawSnippet || '').replace(/[,;]/g, ' ')} [카테고리: ${ev.category}]`,
            'STATUS:CONFIRMED',
            'END:VEVENT'
        );
    });

    ics.push('END:VCALENDAR');
    const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ScheduleHelper_${now.toISOString().slice(0, 10)}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function detectDayFromLine(line: string): DayKey {
    if (/(월요일|월욜|\bMon(day)?\b|周1|周一|星期一)/i.test(line)) return '월';
    if (/(화요일|화욜|\bTue(sday)?\b|周2|周二|星期二)/i.test(line)) return '화';
    if (/(수요일|수욜|\bWed(nesday)?\b|周3|周三|星期三)/i.test(line)) return '수';
    if (/(목요일|목욜|\bThu(rsday)?\b|周4|周四|星期四)/i.test(line)) return '목';
    if (/(금요일|금욜|\bFri(day)?\b|周5|周五|星期五)/i.test(line)) return '금';
    if (/(토요일|토욜|\bSat(urday)?\b|周6|周六|星期六)/i.test(line)) return '토';
    if (/(일요일|일욜|\bSun(day)?\b|周日|星期日|星期天)/i.test(line)) return '일';
    if (/(11월\s*9일|11\/0?9|11-0?9|\bNov(ember)?\s*9\b)/i.test(line)) return '월';
    if (/(11월\s*10일|11\/10|11-10|\bNov(ember)?\s*10\b)/i.test(line)) return '화';
    if (/(11월\s*11일|11\/11|11-11|\bNov(ember)?\s*11\b)/i.test(line)) return '수';
    if (/(11월\s*12일|11\/12|11-12|\bNov(ember)?\s*12\b)/i.test(line)) return '목';
    if (/(11월\s*13일|11\/13|11-13|\bNov(ember)?\s*13\b)/i.test(line)) return '금';
    if (/(11월\s*14일|11\/14|11-14|\bNov(ember)?\s*14\b)/i.test(line)) return '토';
    if (/(11월\s*15일|11\/15|11-15|\bNov(ember)?\s*15\b)/i.test(line)) return '일';
    return '미정';
}

function detectTimeFromLine(line: string): string {
    const ampmKr = line.match(/(오전|오후|아침|저녁|밤)\s*(\d{1,2})\s*시(\s*(\d{1,2})\s*분|반)?/);
    if (ampmKr) {
        const period = ampmKr[1];
        let hour = parseInt(ampmKr[2], 10);
        const min = ampmKr[3] ? (ampmKr[3].includes('반') ? '30' : (ampmKr[4] || '00').padStart(2, '0')) : '00';
        if ((period === '오후' || period === '저녁' || period === '밤') && hour < 12) hour += 12;
        if (period === '오전' && hour === 12) hour = 0;
        return `${String(hour).padStart(2, '0')}:${min}`;
    }
    const colonTime = line.match(/\b(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?\b/);
    if (colonTime) {
        let hour = parseInt(colonTime[1], 10);
        const min = colonTime[2];
        const mer = (colonTime[3] || '').toUpperCase();
        if (mer === 'PM' && hour < 12) hour += 12;
        if (mer === 'AM' && hour === 12) hour = 0;
        return `${String(hour).padStart(2, '0')}:${min}`;
    }
    const enHour = line.match(/\b(\d{1,2})\s*(am|pm|AM|PM)\b/);
    if (enHour) {
        let hour = parseInt(enHour[1], 10);
        const mer = enHour[2].toUpperCase();
        if (mer === 'PM' && hour < 12) hour += 12;
        if (mer === 'AM' && hour === 12) hour = 0;
        return `${String(hour).padStart(2, '0')}:00`;
    }
    const krHour = line.match(/(\d{1,2})\s*시(\s*(\d{1,2})\s*분|반)?/);
    if (krHour) {
        const hour = parseInt(krHour[1], 10);
        const min = krHour[2] ? (krHour[2].includes('반') ? '30' : (krHour[3] || '00').padStart(2, '0')) : '00';
        return `${String(hour).padStart(2, '0')}:${min}`;
    }
    return '시간 미정';
}

function parseInputToScheduleAndTodos(
    rawText: string,
    channel: SourceChannel
): { newEvents: ScheduleEventItem[]; newTodos: TodoTaskItem[] } {
    const newEvents: ScheduleEventItem[] = [];
    const newTodos: TodoTaskItem[] = [];
    const nowIso = new Date().toISOString();

    if (rawText.includes('BEGIN:VEVENT')) {
        const blocks = rawText.split('BEGIN:VEVENT').slice(1);
        blocks.forEach((b, idx) => {
            const summary = b.match(/SUMMARY[^:]*:([^\r\n]+)/)?.[1]?.trim() || '캘린더 일정';
            const location = b.match(/LOCATION[^:]*:([^\r\n]+)/)?.[1]?.trim() || '카카오 캘린더';
            const dtStart = b.match(/DTSTART[^:]*:(\d{8}T?\d{0,6})/)?.[1] || '';
            let day: DayKey = '미정';
            let time = '시간 미정';
            if (dtStart.length >= 8) {
                const y = parseInt(dtStart.slice(0, 4), 10);
                const m = parseInt(dtStart.slice(4, 6), 10) - 1;
                const d = parseInt(dtStart.slice(6, 8), 10);
                const dateObj = new Date(y, m, d);
                const mapDay: DayKey[] = ['일', '월', '화', '수', '목', '금', '토'];
                day = mapDay[dateObj.getDay()] || '미정';
                if (dtStart.includes('T') && dtStart.length >= 13) {
                    time = `${dtStart.slice(9, 11)}:${dtStart.slice(11, 13)}`;
                }
            }
            const isTutoring =
                /(과외|수업|영어|스페인어|일본어|중국어|회화|튜터|lesson|tutor|class|preply|italki|cambly|amazingtalker)/i.test(
                    summary
                );
            newEvents.push({
                id: `ics-${Date.now()}-${idx}`,
                source: channel,
                day,
                time,
                title: summary,
                participantOrPlace: location,
                rawSnippet: `${summary} (${dtStart})`,
                category: isTutoring ? 'tutoring' : 'meeting',
                createdAt: nowIso,
            });
        });
        return { newEvents, newTodos };
    }

    const lines = rawText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 2);

    lines.forEach((line, idx) => {
        const clean = line.replace(/^\[[^\]]+\]\s*(\[[^\]]+\]\s*)?/, '').trim();
        if (!clean) return;

        const isTutoringKeyword =
            /(과외|수업|영어|스페인어|일본어|중국어|회화|튜터|선생님|lesson|tutor|class|preply|italki|cambly|amazingtalker|spanish|english|japanese|chinese)/i.test(
                clean
            );
        const isScheduleKeyword =
            isTutoringKeyword ||
            /(미팅|약속|회의|식사|점심|저녁|만나|뵙|수영|운동|콜|통화|줌|zoom|meet|call|meeting|appointment|schedule|시\s*반|\d{1,2}시|\d{1,2}:\d{2})/i.test(
                clean
            );
        const isTodoKeyword =
            /(해야|할\s*일|숙제|복습|보내|전송|작성|검토|확인|준비|공유|요청|제출|마감|까지|todo|please|need\s+to|send|review|prepare|homework)/i.test(
                clean
            );

        const day = detectDayFromLine(clean);
        const time = detectTimeFromLine(clean);

        if (isScheduleKeyword && (day !== '미정' || time !== '시간 미정' || isTutoringKeyword)) {
            const placeMatch = clean.match(
                /@\s*([^\s,]+)|([가-힣A-Za-z0-9]+(역|센터|호텔|오피스|강남|판교|여의도|줌|Zoom|Meet|italki))/
            );
            newEvents.push({
                id: `ext-ev-${Date.now()}-${idx}`,
                source: channel,
                day,
                time,
                title: clean.slice(0, 72),
                participantOrPlace: placeMatch ? placeMatch[0].replace(/^@\s*/, '') : CHANNEL_META[channel].badge,
                rawSnippet: line,
                category: isTutoringKeyword ? 'tutoring' : 'meeting',
                createdAt: nowIso,
            });
        }

        if (isTodoKeyword) {
            const isUrgent = /(긴급|오늘|즉시|당장|필수|마감|asap|urgent)/i.test(clean);
            newTodos.push({
                id: `ext-td-${Date.now()}-${idx}`,
                source: channel,
                title: clean.slice(0, 80),
                dueTag: day !== '미정' ? `${day}요일까지` : '이번 주 내',
                priority: isUrgent ? 'urgent' : 'high',
                done: false,
                rawSnippet: line,
                createdAt: nowIso,
            });
        }
    });

    if (newEvents.length === 0 && newTodos.length === 0 && lines.length > 0) {
        lines.forEach((line, idx) => {
            const day = detectDayFromLine(line);
            const time = detectTimeFromLine(line);
            const isTutoring = /(과외|수업|영어|스페인어|일본어|중국어|lesson|tutor|class)/i.test(line);
            if (day !== '미정' || time !== '시간 미정' || isTutoring || channel === 'gmail') {
                newEvents.push({
                    id: `ext-fallback-ev-${Date.now()}-${idx}`,
                    source: channel,
                    day,
                    time,
                    title: line.slice(0, 72),
                    participantOrPlace: CHANNEL_META[channel].badge,
                    rawSnippet: line,
                    category: isTutoring ? 'tutoring' : 'meeting',
                    createdAt: nowIso,
                });
            } else {
                newTodos.push({
                    id: `ext-fallback-td-${Date.now()}-${idx}`,
                    source: channel,
                    title: line.slice(0, 80),
                    dueTag: '이번 주 내',
                    priority: 'normal',
                    done: false,
                    rawSnippet: line,
                    createdAt: nowIso,
                });
            }
        });
    }

    return { newEvents, newTodos };
}

export default function ScheduleHelperPage() {
    const [events, setEvents] = useState<ScheduleEventItem[]>(INITIAL_VERIFIED_EVENTS);
    const [todos, setTodos] = useState<TodoTaskItem[]>(INITIAL_VERIFIED_TODOS);
    const [connectedEmails, setConnectedEmails] = useState<ConnectedEmailItem[]>([
        {
            id: 'email-demo-1',
            email: 'user@example.com',
            provider: 'Gmail',
            status: 'connected',
            lastSyncedAt: '오늘 09:00',
        },
    ]);
    const [noteHelperLinked, setNoteHelperLinked] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [mainTab, setMainTab] = useState<'schedule' | 'todos' | 'extractor'>('schedule');
    const [selectedDay, setSelectedDay] = useState<DayKey | 'ALL'>('ALL');
    const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'routine' | 'tutoring' | 'meeting'>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedChannel, setSelectedChannel] = useState<SourceChannel>('kakao');
    const [rawInput, setRawInput] = useState<string>('');
    const [statusBanner, setStatusBanner] = useState<string>('');
    const [showBridgeModal, setShowBridgeModal] = useState<boolean>(false);
    const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
    const [showQuickAddModal, setShowQuickAddModal] = useState<boolean>(false);
    const [showAppModal, setShowAppModal] = useState<boolean>(false);
    const [deferredPwaPrompt, setDeferredPwaPrompt] = useState<any>(null);

    const [newEmailAddr, setNewEmailAddr] = useState<string>('');
    const [newEmailProvider, setNewEmailProvider] = useState<string>('Naver 메일');

    const [quickType, setQuickType] = useState<'tutoring' | 'meeting' | 'routine'>('meeting');
    const [quickDay, setQuickDay] = useState<DayKey>('수');
    const [quickTime, setQuickTime] = useState<string>('14:00 ~ 15:00');
    const [quickTitle, setQuickTitle] = useState<string>('');
    const [quickPlace, setQuickPlace] = useState<string>('');
    const [newTodoTitle, setNewTodoTitle] = useState<string>('');
    const [newTodoDue, setNewTodoDue] = useState<string>('이번 주 내');

    const showToast = (msg: string) => {
        setStatusBanner(msg);
        setTimeout(() => setStatusBanner(''), 4000);
    };

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPwaPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallPwaApp = async () => {
        if (deferredPwaPrompt) {
            deferredPwaPrompt.prompt();
            const choice = await deferredPwaPrompt.userChoice;
            if (choice?.outcome === 'accepted') {
                showToast('ScheduleHelper 앱 설치가 완료되었습니다!');
                setShowAppModal(false);
            }
            setDeferredPwaPrompt(null);
        } else {
            showToast('브라우저 주소창 우측의 [앱 설치] 아이콘을 누르거나 아래 APK 파일을 다운로드하세요.');
        }
    };

    useEffect(() => {
        // 1. LocalStorage 우선 로드 (Zero-Server-Cost & 100% 프라이버시)
        try {
            const localEv = localStorage.getItem('schedulehelper_events_v2');
            const localTd = localStorage.getItem('schedulehelper_todos_v2');
            const localEm = localStorage.getItem('schedulehelper_emails_v2');
            const localBr = localStorage.getItem('schedulehelper_bridge_v2');

            if (localEv) {
                const parsed = JSON.parse(localEv);
                if (Array.isArray(parsed) && parsed.length > 0) setEvents(parsed);
            }
            if (localTd) {
                const parsed = JSON.parse(localTd);
                if (Array.isArray(parsed)) setTodos(parsed);
            }
            if (localEm) {
                const parsed = JSON.parse(localEm);
                if (Array.isArray(parsed) && parsed.length > 0) setConnectedEmails(parsed);
            }
            if (localBr !== null) {
                setNoteHelperLinked(localBr === 'true');
            }
        } catch {
            // ignore localStorage parsing errors
        }

        // 2. 로컬 개발 서버 API 데이터 보조 동기화
        async function loadData() {
            try {
                const res = await fetch('/api/schedulehelper');
                const json = await res.json();
                if (json?.ok && json.data) {
                    if (!localStorage.getItem('schedulehelper_events_v2') && Array.isArray(json.data.events) && json.data.events.length > 0) {
                        setEvents(json.data.events);
                    }
                    if (!localStorage.getItem('schedulehelper_todos_v2') && Array.isArray(json.data.todos)) {
                        setTodos(json.data.todos);
                    }
                    if (!localStorage.getItem('schedulehelper_emails_v2') && Array.isArray(json.data.connectedEmails) && json.data.connectedEmails.length > 0) {
                        setConnectedEmails(json.data.connectedEmails);
                    }
                    if (localStorage.getItem('schedulehelper_bridge_v2') === null) {
                        setNoteHelperLinked(Boolean(json.data.noteHelperLinked));
                    }
                }
            } catch {
                // fallback to initial verified data
            }
        }
        loadData();
    }, []);

    const persistAll = async (
        nextEvents: ScheduleEventItem[],
        nextTodos: TodoTaskItem[],
        nextLinked: boolean = noteHelperLinked,
        nextEmails: ConnectedEmailItem[] = connectedEmails
    ) => {
        setEvents(nextEvents);
        setTodos(nextTodos);
        setNoteHelperLinked(nextLinked);
        setConnectedEmails(nextEmails);

        try {
            localStorage.setItem('schedulehelper_events_v2', JSON.stringify(nextEvents));
            localStorage.setItem('schedulehelper_todos_v2', JSON.stringify(nextTodos));
            localStorage.setItem('schedulehelper_emails_v2', JSON.stringify(nextEmails));
            localStorage.setItem('schedulehelper_bridge_v2', String(nextLinked));
        } catch {
            // ignore localStorage quota error
        }

        try {
            await fetch('/api/schedulehelper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'save_all',
                    events: nextEvents,
                    todos: nextTodos,
                    noteHelperLinked: nextLinked,
                    connectedEmails: nextEmails,
                }),
            });
        } catch {
            // ignore network error
        }
    };

    const handleAddEmailAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmailAddr.trim()) return;
        const newAcc: ConnectedEmailItem = {
            id: `email-${Date.now()}`,
            email: newEmailAddr.trim(),
            provider: newEmailProvider,
            status: 'connected',
            lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const nextEmails = [...connectedEmails, newAcc];
        persistAll(events, todos, noteHelperLinked, nextEmails);
        setNewEmailAddr('');
        showToast(`${newAcc.email} 계정이 연결 목록에 추가되었습니다.`);
    };

    const handleRemoveEmailAccount = async (id: string) => {
        const nextEmails = connectedEmails.filter((item) => item.id !== id);
        persistAll(events, todos, noteHelperLinked, nextEmails);
        showToast('이메일 계정 연동이 해제되었습니다.');
    };

    const handleExtract = () => {
        if (!rawInput.trim()) {
            showToast('추출할 대화나 메일 본문을 입력해주세요.');
            return;
        }
        const { newEvents, newTodos } = parseInputToScheduleAndTodos(rawInput, selectedChannel);
        persistAll([...events, ...newEvents], [...newTodos, ...todos]);
        setRawInput('');
        setMainTab('schedule');
        showToast(
            `${CHANNEL_META[selectedChannel].badge}에서 일정 ${newEvents.length}건, 할 일 ${newTodos.length}건을 추출하여 반영했습니다.`
        );
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const content = String(reader.result || '');
            const ch: SourceChannel = file.name.endsWith('.ics') ? 'kakao_cal' : selectedChannel;
            const { newEvents, newTodos } = parseInputToScheduleAndTodos(content, ch);
            persistAll([...events, ...newEvents], [...newTodos, ...todos]);
            setMainTab('schedule');
            showToast(`파일(${file.name})에서 일정 ${newEvents.length}건, 할 일 ${newTodos.length}건을 추가했습니다.`);
        };
        reader.readAsText(file, 'utf-8');
        e.target.value = '';
    };

    const handleQuickAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickTitle.trim()) return;
        const item: ScheduleEventItem = {
            id: `manual-ev-${Date.now()}`,
            source: quickType === 'tutoring' ? 'gmail' : 'kakao_cal',
            day: quickDay,
            time: quickTime || '시간 미정',
            title: quickTitle.trim(),
            participantOrPlace: quickPlace.trim() || '직접 등록',
            rawSnippet: '직접 등록한 일정',
            category: quickType,
            createdAt: new Date().toISOString(),
        };
        persistAll([...events, item], todos);
        setQuickTitle('');
        setQuickPlace('');
        setShowQuickAddModal(false);
        showToast(`${quickDay}요일 ${quickTime} 일정이 등록되었습니다.`);
    };

    const handleQuickAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodoTitle.trim()) return;
        const item: TodoTaskItem = {
            id: `manual-td-${Date.now()}`,
            source: 'kakao',
            title: newTodoTitle.trim(),
            dueTag: newTodoDue,
            priority: 'high',
            done: false,
            rawSnippet: '직접 추가한 할 일',
            createdAt: new Date().toISOString(),
        };
        persistAll(events, [item, ...todos]);
        setNewTodoTitle('');
        showToast('새로운 할 일이 추가되었습니다.');
    };

    const toggleTodo = (id: string) => {
        const next = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
        persistAll(events, next);
    };

    const deleteTodo = (id: string) => {
        persistAll(
            events,
            todos.filter((t) => t.id !== id)
        );
    };

    const deleteEvent = (id: string) => {
        persistAll(
            events.filter((ev) => ev.id !== id),
            todos
        );
    };

    const toggleNoteHelperBridge = async () => {
        const nextState = !noteHelperLinked;
        await persistAll(events, todos, nextState);
        showToast(
            nextState
                ? 'NoteHelper 연동 브릿지가 켜졌습니다.'
                : 'NoteHelper 연동 브릿지가 꺼졌습니다 (회의록 분리 유지).'
        );
    };

    const filteredEvents = useMemo(() => {
        return events.filter((e) => {
            if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const hay = `${e.title} ${e.participantOrPlace} ${e.day}요일 ${e.time}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [events, categoryFilter, searchQuery]);

    const eventsByDay = useMemo(() => {
        const map: Record<DayKey, ScheduleEventItem[]> = {
            월: [],
            화: [],
            수: [],
            목: [],
            금: [],
            토: [],
            일: [],
            미정: [],
        };
        filteredEvents.forEach((ev) => {
            map[ev.day] = map[ev.day] || [];
            map[ev.day].push(ev);
        });
        Object.keys(map).forEach((k) => {
            map[k as DayKey].sort((a, b) => a.time.localeCompare(b.time));
        });
        return map;
    }, [filteredEvents]);

    const pendingTodos = useMemo(() => todos.filter((t) => !t.done), [todos]);
    const completedTodos = useMemo(() => todos.filter((t) => t.done), [todos]);

    return (
        <div className="min-h-screen bg-[#FAFBFD] text-slate-800 font-sans antialiased flex">
            {/* ===================================================================== */}
            {/* 좌측 사이드바 (눈부시게 깨끗한 화이트 & 소프트 파스텔 포인트) */}
            {/* ===================================================================== */}
            <aside
                className={`${
                    sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
                } hidden lg:flex shrink-0 bg-white border-r border-slate-100 flex-col justify-between transition-all duration-200 select-none shadow-[2px_0_16px_rgba(15,23,42,0.02)]`}
            >
                <div className="p-4 flex flex-col gap-3.5 flex-1 min-h-0">
                    {/* 상단 로고 */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-[#4F46E5]" />
                            </div>
                            <span className="font-bold text-base tracking-tight text-slate-900">
                                ScheduleHelper
                            </span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer"
                            title="사이드바 접기"
                        >
                            <PanelLeft className="w-4 h-4" />
                        </button>
                    </div>

                    {/* + 새 일정 등록 버튼 (무거운 검정 대신 화사한 인디고 블루) */}
                    <button
                        onClick={() => setShowQuickAddModal(true)}
                        className="w-full py-2.5 px-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-[0_4px_12px_rgba(79,70,229,0.22)] cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>새 일정 직접 등록</span>
                    </button>

                    {/* 검색창 */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="일정, 선생님, 요일 검색..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#6366F1]"
                        />
                    </div>

                    {/* 4단 분류 필터 */}
                    <div className="grid grid-cols-4 gap-1 bg-[#F4F6FB] p-1 rounded-xl">
                        {(
                            [
                                { key: 'ALL', label: `전체(${events.length})` },
                                { key: 'routine', label: '루틴' },
                                { key: 'tutoring', label: '과외' },
                                { key: 'meeting', label: '미팅' },
                            ] as const
                        ).map((f) => (
                            <button
                                key={f.key}
                                type="button"
                                onClick={() => setCategoryFilter(f.key)}
                                className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                    categoryFilter === f.key
                                        ? 'bg-white text-[#4F46E5] shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* 요일별 빠른 선택 리스트 */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-0">
                        <div
                            onClick={() => {
                                setSelectedDay('ALL');
                                setMainTab('schedule');
                            }}
                            className={`px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                selectedDay === 'ALL'
                                    ? 'bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]'
                                    : 'bg-white hover:bg-[#F8FAFC] text-slate-700 border-slate-100'
                            }`}
                        >
                            <div>
                                <div className="text-[13.5px] font-bold">이번 주 전체 보기 (월~일)</div>
                                <div className="text-[11px] mt-0.5 text-slate-500">
                                    {DAYS_INFO[0]?.dateStr} ~ {DAYS_INFO[6]?.dateStr} · 총 {filteredEvents.length}건
                                </div>
                            </div>
                        </div>

                        {DAYS_INFO.map(({ key: d, dateStr, isToday }) => {
                            const active = selectedDay === d;
                            const dayList = eventsByDay[d] || [];
                            return (
                                <div
                                    key={d}
                                    onClick={() => {
                                        setSelectedDay(d);
                                        setMainTab('schedule');
                                    }}
                                    className={`px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                                        active
                                            ? 'bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]'
                                            : isToday
                                              ? 'bg-[#F5F8FF] hover:bg-[#EEF2FF] text-slate-900 border-[#DCE7FE]'
                                              : 'bg-white hover:bg-[#F8FAFC] text-slate-800 border-slate-100'
                                    }`}
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-[13.5px] font-bold text-slate-900">
                                                {d}요일 ({dateStr})
                                            </span>
                                            {isToday && (
                                                <span className="px-1.5 py-0.5 rounded bg-[#4F46E5] text-white text-[10px] font-bold">
                                                    오늘
                                                </span>
                                            )}
                                        </div>
                                        {dayList.length === 0 ? (
                                            <div className="text-xs text-slate-400">일정 없음</div>
                                        ) : (
                                            <div className="space-y-0.5">
                                                {dayList.map((ev) => (
                                                    <div key={ev.id} className="text-xs truncate text-slate-600">
                                                        <strong className="mr-1 text-[#4338CA]">
                                                            {ev.time.split(' ')[0]}
                                                        </strong>
                                                        {ev.title}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                                            dayList.length > 0
                                                ? 'bg-[#EEF2FF] text-[#4338CA]'
                                                : 'bg-slate-50 text-slate-400'
                                        }`}
                                    >
                                        {dayList.length}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 하단 이메일 상태 바 */}
                <div className="p-3.5 border-t border-slate-100 bg-[#FAFBFD] flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-semibold text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>지메일 {connectedEmails.length}개 계정 연동됨</span>
                        </div>
                        <button
                            onClick={() => setShowEmailModal(true)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#6366F1] text-slate-700 text-[11px] font-semibold cursor-pointer"
                        >
                            관리
                        </button>
                    </div>
                </div>
            </aside>

            {/* ===================================================================== */}
            {/* 우측 메인 워크스페이스 (눈부시게 밝은 아이보리-화이트 캔버스) */}
            {/* ===================================================================== */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#FAFBFD]">
                {/* 상단 헤더 */}
                <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-100 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="hidden lg:inline-flex p-2 rounded-lg hover:bg-slate-50 text-slate-700 cursor-pointer"
                                title="사이드바 열기"
                            >
                                <PanelLeft className="w-4 h-4" />
                            </button>
                        )}

                        <div className="flex items-center gap-1 bg-[#F4F6FB] p-1 rounded-xl">
                            {(
                                [
                                    { key: 'schedule', label: '이번 주 일과표' },
                                    { key: 'todos', label: `해야 할 일 (${pendingTodos.length})` },
                                    { key: 'extractor', label: '카톡 · 위챗 · 메일 추출' },
                                ] as const
                            ).map((tab) => {
                                const active = mainTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setMainTab(tab.key)}
                                        className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                                            active
                                                ? 'bg-white text-[#4F46E5] shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAppModal(true)}
                            className="px-3.5 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>앱 설치 · APK</span>
                        </button>
                        <button
                            onClick={() => setShowEmailModal(true)}
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-slate-200/80 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                            <Mail className="w-3.5 h-3.5 text-[#4F46E5]" />
                            <span>이메일 ({connectedEmails.length})</span>
                        </button>
                        <button
                            onClick={() => setShowBridgeModal(true)}
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-slate-200/80 text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer"
                        >
                            <Link2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{noteHelperLinked ? 'NoteHelper 연동 ON' : 'NoteHelper 분리됨'}</span>
                        </button>
                        <Link
                            href="/notehelper"
                            className="px-3.5 py-2 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] border border-[#C7D2FE] text-xs font-bold flex items-center gap-1.5"
                        >
                            <span>NoteHelper</span>
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </header>

                {/* 본문 컨테이너 */}
                <main className="max-w-4xl w-full mx-auto px-4 lg:px-8 py-8 flex flex-col gap-6">
                    {/* 상태 알림 배너 */}
                    {statusBanner && (
                        <div className="px-4 py-3 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#3730A3] flex items-center justify-between text-sm font-semibold shadow-sm">
                            <span>{statusBanner}</span>
                            <button
                                onClick={() => setStatusBanner('')}
                                className="text-xs underline opacity-80 hover:opacity-100 cursor-pointer"
                            >
                                닫기
                            </button>
                        </div>
                    )}

                    {/* =============================================================== */}
                    {/* 탭 1: 이번 주 일과표 (화사한 퓨어 화이트 & 소프트 파스텔 톤) */}
                    {/* =============================================================== */}
                    {mainTab === 'schedule' && (
                        <>
                            {/* 상단 요약 헤더 카드 */}
                            <section className="rounded-2xl border border-slate-100 bg-white p-6 lg:p-7 shadow-[0_4px_24px_rgba(15,23,42,0.03)] flex flex-col gap-5">
                                <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-100">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold">
                                                WEEKLY OVERVIEW
                                            </span>
                                            <span>
                                                {DAYS_INFO[0]?.fullLabel} ~ {DAYS_INFO[6]?.fullLabel}
                                            </span>
                                        </div>
                                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight pt-0.5">
                                            이번 주 주요 일정 및 스마트 플래너
                                        </h1>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => exportEventsToICS(events)}
                                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-slate-200/80 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                                            title="구글 캘린더 / 애플 캘린더용 .ics 파일 다운로드"
                                        >
                                            <Download className="w-3.5 h-3.5 text-[#4F46E5]" />
                                            <span>캘린더 내보내기 (.ics)</span>
                                        </button>
                                        <button
                                            onClick={() => setShowQuickAddModal(true)}
                                            className="px-3.5 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>일정 추가</span>
                                        </button>
                                        <button
                                            onClick={() => setMainTab('extractor')}
                                            className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EEF2FF] border border-slate-200/80 text-slate-700 text-xs font-bold cursor-pointer"
                                        >
                                            + 카톡·메일 붙여넣기
                                        </button>
                                    </div>
                                </div>

                                {/* 오늘 & 예정 화사한 파스텔 요약 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* 오늘 카드: 맑고 화사한 스카이-인디고 파스텔 */}
                                    {(() => {
                                        const todayItem = DAYS_INFO.find((d) => d.isToday) || DAYS_INFO[1];
                                        const todayList = eventsByDay[todayItem.key] || [];
                                        return (
                                            <div className="rounded-2xl bg-gradient-to-br from-[#F5F8FF] via-white to-[#F0FDF9] border border-[#DCE7FE] p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="px-2.5 py-0.5 rounded-full bg-[#4F46E5] text-white text-xs font-bold">
                                                        오늘 · {todayItem.fullLabel}
                                                    </span>
                                                    <span className="text-xs font-bold text-[#4F46E5]">
                                                        {todayList.length}건
                                                    </span>
                                                </div>
                                                {todayList.length === 0 ? (
                                                    <div className="text-xs text-slate-400 py-2">
                                                        오늘 등록된 일정이 없습니다.
                                                    </div>
                                                ) : (
                                                    <ul className="space-y-2">
                                                        {todayList.map((ev) => (
                                                            <li
                                                                key={ev.id}
                                                                className="flex items-center gap-2.5 text-[13.5px] text-slate-800 bg-white border border-[#E0E7FF] rounded-xl px-3 py-2 shadow-[0_1px_4px_rgba(79,70,229,0.04)]"
                                                            >
                                                                <span className="font-extrabold tabular-nums text-xs px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#4338CA] shrink-0">
                                                                    {ev.time}
                                                                </span>
                                                                <span className="truncate font-semibold">{ev.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* 다가오는 일정 카드: 따스하고 화사한 피치-아이보리 파스텔 */}
                                    {(() => {
                                        const todayItem = DAYS_INFO.find((d) => d.isToday) || DAYS_INFO[1];
                                        const upcomingDays = DAYS_INFO.filter((d) => d.key !== todayItem.key).slice(0, 3);
                                        const upcomingEvents = upcomingDays.flatMap((d) => eventsByDay[d.key] || []);
                                        return (
                                            <div className="rounded-2xl bg-gradient-to-br from-[#FFFDF7] via-white to-[#FFF7ED] border border-[#FDE68A]/80 p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-xs font-bold">
                                                        다가오는 일정 ({upcomingDays[0]?.key}~{upcomingDays[upcomingDays.length - 1]?.key}요일)
                                                    </span>
                                                    <span className="text-xs font-bold text-amber-600">
                                                        {upcomingEvents.length}건
                                                    </span>
                                                </div>
                                                {upcomingEvents.length === 0 ? (
                                                    <div className="text-xs text-slate-400 py-2">
                                                        다가오는 일정이 없습니다.
                                                    </div>
                                                ) : (
                                                    <ul className="space-y-2">
                                                        {upcomingEvents.slice(0, 4).map((ev) => (
                                                            <li
                                                                key={ev.id}
                                                                className="flex items-center gap-2 text-[13.5px] text-slate-800 bg-white border border-[#FDE68A]/70 rounded-xl px-3 py-2 shadow-[0_1px_4px_rgba(245,158,11,0.04)]"
                                                            >
                                                                <span className="px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] text-[11px] font-bold shrink-0">
                                                                    {ev.day}
                                                                </span>
                                                                <span className="font-bold tabular-nums text-xs text-slate-600 shrink-0">
                                                                    {ev.time}
                                                                </span>
                                                                <span className="truncate font-semibold text-slate-800">
                                                                    {ev.title}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </section>

                            {/* 요일별 상세 타임라인 */}
                            <section className="rounded-2xl border border-slate-100 bg-white p-6 lg:p-7 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-5">
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg font-bold text-slate-900">
                                            {selectedDay === 'ALL'
                                                ? '요일별 일과표 (월요일 ~ 일요일)'
                                                : `${selectedDay}요일 일과표`}
                                        </h2>
                                        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F8FF] border border-[#DCE7FE] text-[#4338CA]">
                                                <span className="w-2 h-2 rounded-full bg-[#4F46E5]" /> 어학 과외
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDF9] border border-[#CCFBF1] text-[#0F766E]">
                                                <span className="w-2 h-2 rounded-full bg-[#14B8A6]" /> 고정 루틴
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309]">
                                                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> 미팅·약속
                                            </span>
                                        </div>
                                    </div>
                                    {selectedDay !== 'ALL' && (
                                        <button
                                            onClick={() => setSelectedDay('ALL')}
                                            className="text-xs font-bold text-[#4F46E5] underline cursor-pointer"
                                        >
                                            전체 요일 보기
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {DAYS_INFO.filter((d) => selectedDay === 'ALL' || selectedDay === d.key).map(
                                        ({ key: day, fullLabel, isToday }) => {
                                            const dayEvents = eventsByDay[day] || [];
                                            return (
                                                <div
                                                    key={day}
                                                    className={`rounded-2xl border p-4 transition ${
                                                        isToday
                                                            ? 'border-[#C7D2FE] bg-[#FCFDFF] shadow-[0_2px_12px_rgba(79,70,229,0.05)]'
                                                            : 'border-slate-100 bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base font-extrabold text-slate-900">
                                                                {fullLabel}
                                                            </span>
                                                            {isToday && (
                                                                <span className="px-2 py-0.5 rounded-full bg-[#4F46E5] text-white text-xs font-bold">
                                                                    오늘
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="px-2.5 py-0.5 rounded-full bg-[#F4F6FB] text-slate-600 text-xs font-bold">
                                                            {dayEvents.length}건
                                                        </span>
                                                    </div>

                                                    {dayEvents.length === 0 ? (
                                                        <div className="text-sm text-slate-400 py-1.5">
                                                            등록된 일정이 없습니다.
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2.5">
                                                            {dayEvents.map((ev) => {
                                                                const tone = CATEGORY_TONE[ev.category];
                                                                return (
                                                                    <div
                                                                        key={ev.id}
                                                                        className={`rounded-xl border ${tone.cardBg} ${tone.leftBar} px-4 py-3 flex flex-wrap items-center justify-between gap-3 transition group`}
                                                                    >
                                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 min-w-0 flex-1">
                                                                            <div
                                                                                className={`inline-flex items-center gap-1.5 text-xs font-extrabold tabular-nums px-2.5 py-1 rounded-lg w-fit sm:w-32 shrink-0 ${tone.timePill}`}
                                                                            >
                                                                                <Clock className="w-3.5 h-3.5 opacity-75" />
                                                                                <span>{ev.time}</span>
                                                                            </div>
                                                                            <div className="min-w-0 flex-1">
                                                                                <div className="text-[15px] font-bold text-slate-900 leading-snug">
                                                                                    {ev.title}
                                                                                </div>
                                                                                {ev.participantOrPlace && (
                                                                                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 font-medium">
                                                                                        <MapPin className="w-3 h-3" />
                                                                                        <span>{ev.participantOrPlace}</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-2 shrink-0">
                                                                            <span
                                                                                className={`px-2.5 py-1 rounded-full text-xs font-bold ${tone.badgeClass}`}
                                                                            >
                                                                                {tone.label}
                                                                            </span>
                                                                            <button
                                                                                onClick={() => deleteEvent(ev.id)}
                                                                                title="일정 삭제"
                                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </section>

                            {/* 하단 이번 주 해야 할 일 (화사한 스카이-화이트 톤) */}
                            <section className="rounded-2xl border border-slate-100 bg-white p-6 lg:p-7 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <CheckSquare className="w-5 h-5 text-[#4F46E5]" />
                                        <h2 className="text-lg font-bold text-slate-900">
                                            이번 주 해야 할 일 ({pendingTodos.length}건 남음)
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setMainTab('todos')}
                                        className="text-xs font-bold text-[#4F46E5] underline cursor-pointer"
                                    >
                                        전체 보기 →
                                    </button>
                                </div>

                                <form onSubmit={handleQuickAddTodo} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTodoTitle}
                                        onChange={(e) => setNewTodoTitle(e.target.value)}
                                        placeholder="새로운 할 일을 입력하고 Enter를 누르세요..."
                                        className="flex-1 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus:border-[#6366F1] focus:bg-white focus:outline-none px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400"
                                    />
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs cursor-pointer shrink-0 shadow-sm"
                                    >
                                        + 할 일 추가
                                    </button>
                                </form>

                                <div className="space-y-2">
                                    {todos.map((td) => (
                                        <div
                                            key={td.id}
                                            className={`rounded-xl border px-4 py-3 flex items-center justify-between gap-3 transition group ${
                                                td.done
                                                    ? 'bg-[#FAFBFD] border-slate-100 opacity-55'
                                                    : 'bg-[#F8FAFF] hover:bg-white border-[#E0E7FF] border-l-4 border-l-[#6366F1]'
                                            }`}
                                        >
                                            <label className="flex items-start gap-3 cursor-pointer flex-1">
                                                <input
                                                    type="checkbox"
                                                    checked={td.done}
                                                    onChange={() => toggleTodo(td.id)}
                                                    className="mt-1 w-4 h-4 accent-[#4F46E5] rounded cursor-pointer shrink-0"
                                                />
                                                <div className="space-y-1">
                                                    <div
                                                        className={`text-[14.5px] font-semibold leading-snug ${
                                                            td.done
                                                                ? 'line-through text-slate-400'
                                                                : 'text-slate-800'
                                                        }`}
                                                    >
                                                        {td.title}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded-md bg-white border border-[#DCE7FE] text-[#4338CA] text-[11px] font-bold">
                                                            기한: {td.dueTag}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 font-medium">
                                                            출처: {CHANNEL_META[td.source]?.badge || '이메일'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                            <button
                                                onClick={() => deleteTodo(td.id)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {/* =============================================================== */}
                    {/* 탭 2: 해야 할 일 체크리스트 */}
                    {/* =============================================================== */}
                    {mainTab === 'todos' && (
                        <section className="rounded-2xl border border-slate-100 bg-white p-7 lg:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-6">
                            <div className="pb-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <span className="px-2.5 py-0.5 rounded-full font-bold text-xs bg-[#EEF2FF] text-[#4F46E5]">
                                        TO-DO LIST
                                    </span>
                                    <h1 className="text-2xl font-bold text-slate-900 mt-2">
                                        이번 주 해야 할 일 체크리스트
                                    </h1>
                                </div>
                                <span className="px-3 py-1.5 rounded-xl bg-[#F5F8FF] border border-[#DCE7FE] text-[#4338CA] text-xs font-bold">
                                    남은 할 일 {pendingTodos.length}건 · 완료 {completedTodos.length}건
                                </span>
                            </div>

                            <form onSubmit={handleQuickAddTodo} className="flex flex-wrap gap-2">
                                <input
                                    type="text"
                                    value={newTodoTitle}
                                    onChange={(e) => setNewTodoTitle(e.target.value)}
                                    placeholder="이번 주 해야 할 일을 입력하세요..."
                                    className="flex-1 min-w-[220px] rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-[#6366F1] focus:bg-white focus:outline-none px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400"
                                />
                                <input
                                    type="text"
                                    value={newTodoDue}
                                    onChange={(e) => setNewTodoDue(e.target.value)}
                                    placeholder="기한 (예: 금요일까지)"
                                    className="w-36 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-[#6366F1] focus:bg-white focus:outline-none px-3.5 py-2.5 text-sm text-slate-800"
                                />
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm cursor-pointer"
                                >
                                    + 추가
                                </button>
                            </form>

                            <div className="space-y-2.5">
                                {todos.map((td) => (
                                    <div
                                        key={td.id}
                                        className={`rounded-xl border px-4 py-3.5 flex items-center justify-between gap-3 transition group ${
                                            td.done
                                                ? 'bg-[#FAFBFD] border-slate-100 opacity-55'
                                                : 'bg-[#F8FAFF] hover:bg-white border-[#E0E7FF] border-l-4 border-l-[#6366F1]'
                                        }`}
                                    >
                                        <label className="flex items-start gap-3 cursor-pointer flex-1">
                                            <input
                                                type="checkbox"
                                                checked={td.done}
                                                onChange={() => toggleTodo(td.id)}
                                                className="mt-1 w-4 h-4 accent-[#4F46E5] rounded cursor-pointer shrink-0"
                                            />
                                            <div className="space-y-1">
                                                <div
                                                    className={`text-[15px] font-semibold leading-snug ${
                                                        td.done ? 'line-through text-slate-400' : 'text-slate-800'
                                                    }`}
                                                >
                                                    {td.title}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-md bg-white border border-[#DCE7FE] text-[#4338CA] text-xs font-bold">
                                                        기한: {td.dueTag}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        출처: {CHANNEL_META[td.source]?.badge || '이메일'}
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                        <button
                                            onClick={() => deleteTodo(td.id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* =============================================================== */}
                    {/* 탭 3: 카톡 · 위챗 · 와츠앱 · 메일 추출 */}
                    {/* =============================================================== */}
                    {mainTab === 'extractor' && (
                        <section className="rounded-2xl border border-slate-100 bg-white p-7 lg:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-6">
                            <div className="pb-5 border-b border-slate-100">
                                <span className="px-2.5 py-0.5 rounded-full font-bold text-xs bg-[#EEF2FF] text-[#4F46E5]">
                                    SMART EXTRACTOR
                                </span>
                                <h1 className="text-2xl font-bold text-slate-900 mt-2">
                                    대화 · 이메일 텍스트로 일정/할 일 자동 등록
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    카카오톡, 위챗, 와츠앱 대화나 이메일 본문을 붙여넣으면 요일·시간과 할 일을 자동 분리합니다.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(['gmail', 'kakao', 'wechat', 'whatsapp', 'kakao_cal'] as SourceChannel[]).map(
                                    (ch) => {
                                        const active = selectedChannel === ch;
                                        return (
                                            <button
                                                key={ch}
                                                type="button"
                                                onClick={() => setSelectedChannel(ch)}
                                                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                                    active
                                                        ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                                                        : 'bg-[#F8FAFC] text-slate-600 border-slate-200 hover:border-[#6366F1]'
                                                }`}
                                            >
                                                {CHANNEL_META[ch].label}
                                            </button>
                                        );
                                    }
                                )}
                            </div>

                            <textarea
                                value={rawInput}
                                onChange={(e) => setRawInput(e.target.value)}
                                rows={7}
                                placeholder={CHANNEL_META[selectedChannel].placeholder}
                                className="w-full rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-[#6366F1] focus:bg-white focus:outline-none p-4 text-sm text-slate-800 leading-relaxed"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <label className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EEF2FF] border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-[#4F46E5]" />
                                    <span>파일 업로드 (.txt / .ics)</span>
                                    <input
                                        type="file"
                                        accept=".txt,.ics,.csv"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={handleExtract}
                                    className="px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm cursor-pointer shadow-sm"
                                >
                                    일정 및 할 일 추출하기
                                </button>
                            </div>
                        </section>
                    )}
                </main>
            </div>

            {/* ===================================================================== */}
            {/* 모달 1: 새 일정 직접 추가 */}
            {/* ===================================================================== */}
            {showQuickAddModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="max-w-md w-full rounded-2xl border border-slate-100 bg-white p-6 space-y-5 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">새 일정 직접 등록</h3>
                            <button
                                onClick={() => setShowQuickAddModal(false)}
                                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleQuickAddEvent} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">구분</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(
                                        [
                                            { k: 'tutoring', l: '어학 과외' },
                                            { k: 'meeting', l: '미팅 · 약속' },
                                            { k: 'routine', l: '운동 · 루틴' },
                                        ] as const
                                    ).map((item) => (
                                        <button
                                            key={item.k}
                                            type="button"
                                            onClick={() => setQuickType(item.k)}
                                            className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                                                quickType === item.k
                                                    ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                                                    : 'bg-[#F8FAFC] text-slate-600 border-slate-200'
                                            }`}
                                        >
                                            {item.l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">요일</label>
                                    <select
                                        value={quickDay}
                                        onChange={(e) => setQuickDay(e.target.value as DayKey)}
                                        className="w-full rounded-xl bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-sm text-slate-800 font-semibold"
                                    >
                                        {DAYS_ORDER.map((d) => (
                                            <option key={d} value={d}>
                                                {d}요일
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">시간</label>
                                    <input
                                        type="text"
                                        value={quickTime}
                                        onChange={(e) => setQuickTime(e.target.value)}
                                        placeholder="예: 14:00 ~ 15:00"
                                        className="w-full rounded-xl bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-sm text-slate-800"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">일정 제목</label>
                                <input
                                    type="text"
                                    value={quickTitle}
                                    onChange={(e) => setQuickTitle(e.target.value)}
                                    placeholder="예: 영어 회화 과외 / 강남 미팅"
                                    className="w-full rounded-xl bg-[#F8FAFC] border border-slate-200 px-3.5 py-2 text-sm text-slate-800"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                                    장소 또는 온라인 링크 (선택)
                                </label>
                                <input
                                    type="text"
                                    value={quickPlace}
                                    onChange={(e) => setQuickPlace(e.target.value)}
                                    placeholder="예: Zoom / italki / 강남역"
                                    className="w-full rounded-xl bg-[#F8FAFC] border border-slate-200 px-3.5 py-2 text-sm text-slate-800"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowQuickAddModal(false)}
                                    className="px-4 py-2 rounded-xl bg-[#F8FAFC] text-slate-600 text-xs font-bold cursor-pointer"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-bold cursor-pointer"
                                >
                                    등록하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===================================================================== */}
            {/* 모달 2: 이메일 계정 연동 관리 */}
            {/* ===================================================================== */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="max-w-lg w-full rounded-2xl border border-slate-100 bg-white p-6 space-y-5 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">연동된 이메일 계정 관리</h3>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {connectedEmails.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFF] px-4 py-3"
                                >
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{item.email}</div>
                                        <div className="text-xs text-slate-500">{item.provider} · 실시간 연동됨</div>
                                    </div>
                                    {item.id !== 'gmail-primary' && (
                                        <button
                                            onClick={() => handleRemoveEmailAccount(item.id)}
                                            className="text-xs text-slate-400 hover:text-slate-800 underline cursor-pointer"
                                        >
                                            해제
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAddEmailAccount} className="space-y-3 pt-2 border-t border-slate-100">
                            <div className="text-xs font-bold text-slate-500">추가 이메일 등록</div>
                            <div className="flex gap-2">
                                <select
                                    value={newEmailProvider}
                                    onChange={(e) => setNewEmailProvider(e.target.value)}
                                    className="rounded-xl bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800"
                                >
                                    <option value="Gmail">Gmail</option>
                                    <option value="Naver 메일">Naver 메일</option>
                                    <option value="Outlook">Outlook</option>
                                </select>
                                <input
                                    type="email"
                                    value={newEmailAddr}
                                    onChange={(e) => setNewEmailAddr(e.target.value)}
                                    placeholder="example@gmail.com"
                                    className="flex-1 rounded-xl bg-[#F8FAFC] border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-bold cursor-pointer"
                                >
                                    추가
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===================================================================== */}
            {/* 모달 3: NoteHelper 연동 브릿지 */}
            {/* ===================================================================== */}
            {showBridgeModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="max-w-md w-full rounded-2xl border border-slate-100 bg-white p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">
                                NoteHelper ↔ ScheduleHelper 연동 설정
                            </h3>
                            <button
                                onClick={() => setShowBridgeModal(false)}
                                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            과거 회의록이 이번 주 일정에 섞이지 않도록 기본값은 <strong>독립 분리(OFF)</strong> 상태입니다.
                            원하실 때만 브릿지를 켜서 연동할 수 있습니다.
                        </p>
                        <div className="flex items-center justify-between rounded-xl bg-[#F8FAFF] border border-[#DCE7FE] p-4">
                            <span className="text-sm font-bold text-slate-900">
                                현재 상태: {noteHelperLinked ? '연동 켜짐 (ON)' : '독립 분리됨 (OFF)'}
                            </span>
                            <button
                                onClick={toggleNoteHelperBridge}
                                className="px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-bold cursor-pointer"
                            >
                                {noteHelperLinked ? '연동 끄기' : '연동 켜기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================================================================== */}
            {/* 모달 4: ScheduleHelper 전용 앱 설치 & 안드로이드 APK 다운로드 */}
            {/* ===================================================================== */}
            {showAppModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="max-w-lg w-full rounded-2xl border border-slate-100 bg-white p-6 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                                    <Smartphone className="w-5 h-5 text-[#4F46E5]" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        ScheduleHelper 전용 앱 설치
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        안드로이드 APK 설치 파일 &amp; PC/모바일 독립 앱(PWA)
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAppModal(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* 1. 안드로이드 전용 APK 직접 다운로드 */}
                            <div className="rounded-2xl border border-[#DCE7FE] bg-[#F5F8FF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold">
                                            ANDROID APK
                                        </span>
                                        <span className="text-sm font-bold text-slate-900">
                                            안드로이드 전용 앱 (ScheduleHelper.apk)
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        갤럭시 등 안드로이드 스마트폰에 독립 앱으로 바로 설치됩니다.
                                    </p>
                                </div>
                                <a
                                    href="/schedulehelper.apk"
                                    download="ScheduleHelper.apk"
                                    className="px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>APK 다운로드</span>
                                </a>
                            </div>

                            {/* 2. PC 바탕화면 & 모바일 홈화면 PWA 앱 설치 */}
                            <div className="rounded-2xl border border-[#CCFBF1] bg-[#F0FDF9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-full bg-[#14B8A6] text-white text-[10px] font-bold">
                                            PC &amp; iOS · ANDROID PWA
                                        </span>
                                        <span className="text-sm font-bold text-slate-900">
                                            PC 바탕화면 / 스마트폰 홈 화면 앱 설치
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        주소창 없는 독립 앱 창으로 실행되며 작업표시줄·바탕화면에 고정됩니다.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleInstallPwaApp}
                                    className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>1클릭 앱 설치</span>
                                </button>
                            </div>

                            {/* 3. 스마트폰 QR 스캔 */}
                            <div className="rounded-2xl border border-slate-200/80 bg-[#F8FAFC] p-4 flex items-center gap-4">
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://secondbrain-note.vercel.app/schedulehelper"
                                    alt="ScheduleHelper 모바일 앱 QR"
                                    className="w-20 h-20 rounded-xl border border-slate-200 bg-white p-1.5 shrink-0"
                                />
                                <div className="space-y-1 text-xs text-slate-600">
                                    <div className="font-bold text-slate-900 text-sm">
                                        📱 스마트폰 카메라로 QR 스캔
                                    </div>
                                    <p className="leading-relaxed">
                                        휴대폰 카메라로 스캔하면 모바일 ScheduleHelper로 바로 접속하여 APK 설치 또는 홈 화면에 추가할 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================================================================== */}
            {/* 모바일 하단 앱 네비게이션 바 (스마트폰 / APK 실행 시 원터치 탭 전환) */}
            {/* ===================================================================== */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200/80 px-3 py-2 grid grid-cols-4 gap-1.5 shadow-[0_-4px_16px_rgba(15,23,42,0.04)]">
                <button
                    type="button"
                    onClick={() => setMainTab('schedule')}
                    className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                        mainTab === 'schedule' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-slate-500'
                    }`}
                >
                    <Calendar className="w-4 h-4" />
                    <span>주간 일과</span>
                </button>
                <button
                    type="button"
                    onClick={() => setMainTab('todos')}
                    className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                        mainTab === 'todos' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-slate-500'
                    }`}
                >
                    <CheckSquare className="w-4 h-4" />
                    <span>할 일 ({pendingTodos.length})</span>
                </button>
                <button
                    type="button"
                    onClick={() => setMainTab('extractor')}
                    className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                        mainTab === 'extractor' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-slate-500'
                    }`}
                >
                    <Upload className="w-4 h-4" />
                    <span>자동 추출</span>
                </button>
                <button
                    type="button"
                    onClick={() => setShowAppModal(true)}
                    className="py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 text-slate-500 cursor-pointer"
                >
                    <Smartphone className="w-4 h-4 text-[#4F46E5]" />
                    <span>앱 설치</span>
                </button>
            </nav>
        </div>
    );
}
