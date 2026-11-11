'use client';

import React from 'react';
import { Volume2, Play, Sparkles } from 'lucide-react';

export interface VocabEntry {
  id: string;
  lang: string;
  langLabel: string;
  expression: string;
  pronunciation: string;
  meaning: string;
  myIntent: string;
  timeStr?: string;
  timeSec?: number;
  noteId: string;
  noteTitle: string;
}

export interface AgentTaskItem {
  id: string;
  title: string;
  agentRole: string;
  badgeColor: string;
  category: string;
  noteId: string;
  noteTitle: string;
}

export interface DealCrmItem {
  id: string;
  track: 'aidc' | 'deeptech' | 'global';
  trackLabel: string;
  name: string;
  subtitle: string;
  statusBadge: string;
  keyPeople: string[];
  metrics: string[];
  summaryPoints: string[];
  linkedNotes: { id: string; title: string; recordedAt: string }[];
}

export interface ScheduledMeetingItem {
  id: string;
  title: string;
  timeLabel: string;
  durationLabel: string;
  type: 'zh' | 'en' | 'ja' | 'es' | 'aidc' | 'deeptech';
  badge: string;
  tutorOrPartner: string;
  relatedKeyword: string;
}

export function parseTimeStrToSec(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[\[\]()*]/g, '').trim();
  const m3 = cleaned.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
  if (m3) {
    return parseInt(m3[1], 10) * 3600 + parseInt(m3[2], 10) * 60 + parseInt(m3[3], 10);
  }
  const m2 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (m2) {
    return parseInt(m2[1], 10) * 60 + parseInt(m2[2], 10);
  }
  return null;
}

export function formatSecToMMSS(sec: number): string {
  const s = Math.max(0, Math.floor(sec || 0));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function detectTtsLang(text: string): string {
  if (/[\u3040-\u30ff]/.test(text)) return 'ja-JP';
  if (/[\u0E00-\u0E7F]/.test(text)) return 'th-TH';
  if (/[\u0600-\u06FF]/.test(text)) return 'ar-SA';
  if (/[\u0400-\u04FF]/.test(text)) return 'ru-RU';
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  if (/[ăâđêôơưàảãáạằẳẵắặầẩẫấậ]/i.test(text)) return 'vi-VN';
  if (/[\u4e00-\u9fff]{1,}/.test(text) && !/[가-힣\u3040-\u30ff]/.test(text)) return 'zh-CN';
  if (/[äöüß]/i.test(text)) return 'de-DE';
  if (/[çœæéèêëàâùûîï]/i.test(text) && /\b(je|tu|il|nous|vous|est|les|des|pour|avec)\b/i.test(text)) {
    return 'fr-FR';
  }
  if (/[áéíóúñ¿¡]/i.test(text)) return 'es-ES';
  if (/[A-Za-z]{3,}/.test(text) && !/[가-힣]/.test(text)) return 'en-US';
  if (/[\u4e00-\u9fff]{2,}/.test(text)) return 'zh-CN';
  return 'ko-KR';
}

export function speakNativePhrase(text: string, forcedLang?: string, onStatus?: (msg: string) => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const clean = text
    .replace(/\*\*|`/g, '')
    .replace(/\(.*?\)/g, '')
    .trim();
  if (!clean) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = forcedLang || detectTtsLang(clean);
  utter.rate = 0.92;
  if (onStatus) {
    onStatus(`🔊 원어민 발음 재생 (${utter.lang}): "${clean}"`);
  }
  window.speechSynthesis.speak(utter);
}

export interface TranscriptBlock {
  idx: number;
  timeStr: string;
  startSec: number;
  endSec: number;
  speaker: string;
  body: string;
  foreignSnippet?: string;
}

export function parseTranscriptToBlocks(rawTranscript: string): TranscriptBlock[] {
  const text = (rawTranscript || '').replace(/^\[00:00:\d+\]\s*\[.*?\]\s*/, '').trim();
  if (!text) return [];

  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const parsed: TranscriptBlock[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const blk = blocks[i];
    const m = blk.match(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:\n]+):\s*([\s\S]*)$/);
    if (m) {
      const timeStr = m[1];
      const startSec = parseTimeStrToSec(timeStr) ?? i * 15;
      const speaker = m[2].trim();
      const body = m[3].trim();
      const firstLine = body.split('\n')[0].trim();
      const hasForeign =
        /[\u4e00-\u9fff]{2,}|[\u3040-\u30ff]{2,}|[A-Za-z]{4,}|[áéíóúñ¿¡]/i.test(firstLine);
      parsed.push({
        idx: i,
        timeStr,
        startSec,
        endSec: startSec + 25,
        speaker,
        body,
        foreignSnippet: hasForeign ? firstLine : undefined,
      });
    } else {
      parsed.push({
        idx: i,
        timeStr: '',
        startSec: -1,
        endSec: -1,
        speaker: '',
        body: blk,
      });
    }
  }

  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i].startSec >= 0) {
      let nextStart = parsed[i].startSec + 25;
      for (let j = i + 1; j < parsed.length; j++) {
        if (parsed[j].startSec > parsed[i].startSec) {
          nextStart = parsed[j].startSec;
          break;
        }
      }
      parsed[i].endSec = nextStart;
    }
  }

  return parsed;
}

function renderInlineWithTimestamps(
  text: string,
  onSeekAudio?: (sec: number, label?: string) => void
) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\b\d{2}:\d{2}\b)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      const sec = parseTimeStrToSec(inner);
      if (sec !== null && onSeekAudio) {
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSeekAudio(sec, inner)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 mx-0.5 rounded-md bg-[#F1F5F9] hover:bg-[#111827] text-[#111827] hover:text-[#FFFFFF] text-xs font-medium tabular-nums font-bold transition-colors cursor-pointer"
            title={`${inner} 시점 원음 오디오 즉시 재생`}
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            {inner}
          </button>
        );
      }
      return (
        <strong key={i} className="font-bold text-[#111827]">
          {inner}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#334155] font-medium tabular-nums text-[13.5px] font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (/^\d{2}:\d{2}$/.test(part) && onSeekAudio) {
      const sec = parseTimeStrToSec(part);
      if (sec !== null) {
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSeekAudio(sec, part)}
            className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded-md bg-[#EFF6FF] hover:bg-[#1D4ED8] text-[#1D4ED8] hover:text-[#FFFFFF] text-xs font-medium tabular-nums font-bold transition-colors cursor-pointer"
            title={`${part} 시점 원음 재생`}
          >
            ▶ {part}
          </button>
        );
      }
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function renderInteractiveStructuredSummary(
  note: { structuredSummary?: string; summary?: string[]; transcript?: string },
  onSeekAudio?: (sec: number, label?: string) => void,
  onStatus?: (msg: string) => void
) {
  const rawMd = (note.structuredSummary || '').trim();
  const coachingIdx = rawMd.indexOf('## 🎓 [언어 학습 전담 AI 코칭]');
  const md = (
    coachingIdx >= 0
      ? rawMd.slice(0, coachingIdx).replace(/\n+---\s*$/, '')
      : rawMd
  ).trim();
  if (!md) {
    const items =
      note.summary && note.summary.length > 0
        ? note.summary
        : [note.transcript || '요약할 내용이 없습니다.'];
    return (
      <ul className="space-y-3.5">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 text-[15.5px] text-[#1E293B] leading-7"
          >
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#111827] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span className="break-keep">{renderInlineWithTimestamps(item, onSeekAudio)}</span>
          </li>
        ))}
      </ul>
    );
  }

  const lines = md.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Markdown Table block detection
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        const bodyRows = tableLines
          .slice(2)
          .map((r) =>
            r
              .split('|')
              .slice(1, -1)
              .map((c) => c.trim())
          )
          .filter((r) => r.length > 0);

        elements.push(
          <div
            key={`tbl-${i}`}
            className="my-5 overflow-x-auto rounded-xl border border-[#E2E8F0] bg-[#FFFFFF]"
          >
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#1E293B] font-bold">
                  {headerCells.map((hc, cIdx) => (
                    <th key={cIdx} className="py-3 px-4 whitespace-nowrap">
                      {hc}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {bodyRows.map((row, rIdx) => {
                  const firstCellClean = (row[0] || '').replace(/\*/g, '').trim();
                  const rowSec = parseTimeStrToSec(firstCellClean);
                  const exprCellClean = (row[2] || '').replace(/\*/g, '').trim();

                  return (
                    <tr key={rIdx} className="hover:bg-[#F8FAFC] transition-colors">
                      {row.map((cell, cIdx) => {
                        if (cIdx === 0 && rowSec !== null && onSeekAudio) {
                          return (
                            <td key={cIdx} className="py-3 px-4 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => onSeekAudio(rowSec, exprCellClean || firstCellClean)}
                                className="px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#111827] text-[#111827] hover:text-[#FFFFFF] font-medium tabular-nums text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                title="클릭 시 해당 시점 원음 즉시 재생"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                {firstCellClean}
                              </button>
                            </td>
                          );
                        }
                        if (cIdx === 2 && exprCellClean) {
                          return (
                            <td key={cIdx} className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#111827] text-[15px]">
                                  {exprCellClean}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => speakNativePhrase(exprCellClean, undefined, onStatus)}
                                  className="px-2 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#111827] text-[#334155] hover:text-[#FFFFFF] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                                  title="원어민 발음 즉시 듣기"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>발음</span>
                                </button>
                              </div>
                            </td>
                          );
                        }
                        return (
                          <td key={cIdx} className="py-3 px-4 text-[#334155] leading-relaxed">
                            {renderInlineWithTimestamps(cell, onSeekAudio)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    if (!line) {
      elements.push(<div key={i} className="h-2" />);
    } else if (line === '---') {
      elements.push(<hr key={i} className="my-5 border-[#E2E8F0]" />);
    } else if (line.startsWith('# ')) {
      elements.push(
        <h4
          key={i}
          className="text-lg font-bold text-[#111827] pt-2 pb-2.5 mb-2 border-b border-[#E2E8F0]"
        >
          {line.slice(2)}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h5
          key={i}
          className="text-[16.5px] font-bold text-[#111827] mt-6 mb-2.5 pb-1.5 border-b border-[#F1F5F9] flex items-center gap-2"
        >
          <span>{renderInlineWithTimestamps(line.slice(3), onSeekAudio)}</span>
        </h5>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2.5 pl-1 py-0.5 text-[15.5px] text-[#334155] leading-7">
          <span className="text-[#94A3B8] font-bold mt-0.5">•</span>
          <span className="flex-1 break-keep">
            {renderInlineWithTimestamps(line.slice(2), onSeekAudio)}
          </span>
        </div>
      );
    } else {
      elements.push(
        <p key={i} className="text-[15.5px] text-[#334155] leading-7 break-keep">
          {renderInlineWithTimestamps(line, onSeekAudio)}
        </p>
      );
    }
    i++;
  }

  return <div className="space-y-2 text-[15.5px] text-[#334155] leading-7">{elements}</div>;
}

export function extractMasterVocabFromNotes(notes: any[]): VocabEntry[] {
  const results: VocabEntry[] = [];
  const seen = new Set<string>();

  for (const note of notes) {
    const combinedTitle = `${note.title || ''} ${note.categoryLabel || ''}`;
    let defaultLang: 'zh' | 'en' | 'ja' | 'es' = 'en';
    let defaultLabel = '🇺🇸 영어';
    if (combinedTitle.includes('중국어') || combinedTitle.includes('중문')) {
      defaultLang = 'zh';
      defaultLabel = '🇨🇳 중국어';
    } else if (combinedTitle.includes('일본어')) {
      defaultLang = 'ja';
      defaultLabel = '🇯🇵 일본어';
    } else if (combinedTitle.includes('스페인어')) {
      defaultLang = 'es';
      defaultLabel = '🇪🇸 스페인어';
    }

    const md = `${note.structuredSummary || ''}\n${note.transcript || ''}`;
    const lines = md.split(/\r?\n/);

    // 1. Parse Markdown vocabulary tables (| 10:15 | 의도 | **표현** | 병음 | 뜻 |)
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('|') && line.endsWith('|') && !line.includes('---')) {
        const cols = line
          .split('|')
          .slice(1, -1)
          .map((c) => c.replace(/\*\*/g, '').trim());
        if (cols.length >= 4 && /^\d{2}:\d{2}$/.test(cols[0])) {
          const timeStr = cols[0];
          const myIntent = cols[1];
          const expression = cols[2];
          const pronunciation = cols[3];
          const meaning = cols[4] || cols[1];
          const key = `${defaultLang}:${expression}`;
          if (expression && !seen.has(key)) {
            seen.add(key);
            results.push({
              id: `v-${note.id}-${results.length}`,
              lang: defaultLang,
              langLabel: defaultLabel,
              expression,
              pronunciation,
              meaning,
              myIntent,
              timeStr,
              timeSec: parseTimeStrToSec(timeStr) ?? undefined,
              noteId: note.id,
              noteTitle: note.title,
            });
          }
        }
      }

      // 2. Parse ✅ 교정 표현 lines
      if (line.includes('교정 표현') || line.includes('원어민 표현')) {
        const m = line.match(/[:：]\s*"?([^"\n]+)"?/);
        if (m && m[1]) {
          const expr = m[1].replace(/\*\*/g, '').trim();
          const key = `${defaultLang}:${expr}`;
          if (expr.length >= 2 && expr.length <= 90 && !seen.has(key)) {
            seen.add(key);
            results.push({
              id: `v-corr-${note.id}-${results.length}`,
              lang: defaultLang,
              langLabel: defaultLabel,
              expression: expr,
              pronunciation: '원어민 수업 실전 교정 문장',
              meaning: `${note.title.slice(0, 28)} 핵심 교정 표현`,
              myIntent: '수업 중 실시간 문장 교정',
              noteId: note.id,
              noteTitle: note.title,
            });
          }
        }
      }
    }
  }

  return results;
}

export const PRE_CLASS_CHEAT_SHEETS: Record<
  'zh' | 'en' | 'ja' | 'es',
  {
    title: string;
    subtitle: string;
    openingTopics: {
      topic: string;
      sentence: string;
      pronunciation: string;
      korean: string;
    }[];
  }
> = {
  zh: {
    title: '🇨🇳 중국어 수업 5분 전 실전 치트시트',
    subtitle: '오늘 수업 첫 3분 스몰토크에서 바로 읽고 말할 수 있는 맞춤형 중문 문장',
    openingTopics: [
      {
        topic: '아내 AI 코딩 & 토큰(词元) 소진 에피소드',
        sentence: '我今天教妻子用AI编程做网页，没想到她几个小时就把词元全花完了！',
        pronunciation: 'Wǒ jīntiān jiāo qīzi yòng AI biānchéng zuò wǎngyè, méi xiǎngdào tā jǐ gè xiǎoshí jiù bǎ cíyuán quán huā wán le!',
        korean: '오늘 아내에게 AI 코딩으로 웹페이지 만드는 법을 알려줬는데, 몇 시간 만에 토큰(词元)을 다 써버렸어요!',
      },
      {
        topic: '5개 웹사이트 · 4개 유튜브 채널 & 알고리즘(算法)',
        sentence: '我现在经营五个网站和四个YouTube频道，每天坚持制作要上传的视频，耐心等待算法推荐。',
        pronunciation: 'Wǒ xiànzài jīngyíng wǔ gè wǎngzhàn hé sì gè YouTube píndào, měitiān jiānchí zhìzuò yào shàngchuán de shìpín, nàixīn děngdài suànfǎ tuījiàn.',
        korean: '현재 5개 웹사이트와 4개 유튜브 채널을 운영하며 매일 업로드할 영상을 제작하고 인내심을 갖고 알고리즘 추천을 기다리고 있습니다.',
      },
      {
        topic: '동시 7~8개 AI 프로젝트 지휘 & 18개월 딸 육아',
        sentence: '我给AI指示词，同时做七八个事情，剩下的时间就陪18个月大的女儿。',
        pronunciation: 'Wǒ gěi AI zhǐshìcí, tóngshí zuò qī bā gè shìqing, shèngxià de shíjiān jiù péi shíbā gè yuè dà de nǚ’ér.',
        korean: 'AI에게 프롬프트(지시어)를 내려 동시에 7~8가지 일을 처리하고, 남는 시간에는 18개월 된 딸과 시간을 보냅니다.',
      },
    ],
  },
  en: {
    title: '🇺🇸 영어 수업 5분 전 실전 치트시트',
    subtitle: '오늘 튜터와의 첫 3분 프리토킹을 주도할 대표님 맞춤형 영어 표현',
    openingTopics: [
      {
        topic: '동시 7~8개 AI 에이전트 지휘 (Multi-Agent CEO)',
        sentence: 'Instead of working on one thing at a time, I give prompts to seven or eight AI agents simultaneously and just review their outputs.',
        pronunciation: '인스테드 오브 워킹 온 원 씽 앳 어 타임, 아이 기브 프롬프츠 투 세븐 오어 에잇 에이아이 에이전츠 사이멀테이니슬리 앤 저스트 리뷰 데어 아웃풋츠.',
        korean: '한 번에 하나씩 일하는 대신, 7~8개의 AI 에이전트에게 동시에 프롬프트를 내리고 결과물만 컨펌합니다.',
      },
      {
        topic: '아내에게 AI 코딩 전수 & 토큰 소진 에피소드',
        sentence: 'I taught my wife how to build websites with AI today, and she got so into it that she burned through all her tokens in just a few hours!',
        pronunciation: '아이 토트 마이 와이프 하우 투 빌드 웹사이트 위드 에이아이 투데이, 앤 쉬 갓 소 인투 잇 댓 쉬 번드 스루 올 허 토큰스 인 저스트 어 퓨 아워스!',
        korean: '오늘 아내에게 AI로 웹사이트 만드는 법을 알려줬는데, 너무 몰입해서 몇 시간 만에 토큰을 전부 다 써버렸어요!',
      },
      {
        topic: 'AIDC 전력 인프라 M&A & 5대 사이트·4대 유튜브 운영',
        sentence: 'My mind is full of AI data center M&A deals, running five luxury helper websites, and growing four YouTube channels.',
        pronunciation: '마이 마인드 이즈 풀 오브 에이아이 데이터센터 엠앤에이 딜스, 러닝 파이브 럭셔리 헬퍼 웹사이트, 앤 그로잉 포 유투브 채널스.',
        korean: '요즘 머릿속이 온통 AI 데이터센터 M&A 딜과 5개 웹사이트, 4개 유튜브 채널 키우는 생각으로 가득 차 있습니다.',
      },
    ],
  },
  ja: {
    title: '🇯🇵 일본어 수업 5분 전 실전 치트시트',
    subtitle: '일본어 튜터에게 바로 말할 수 있는 최신 근황 & 비즈니스 일본어 3선',
    openingTopics: [
      {
        topic: '일본 비자·영주권 정책 강화와 내년 일본 이주 구상',
        sentence: '来年日本に移住したいのですが、最近日本のビザと永住権の政策がかなり厳しくなりましたね。',
        pronunciation: '라이넨 니혼니 이주시타이노 데스가, 사이킨 니혼노 비자토 에이주켄노 세이사쿠가 카나리 키비시쿠 나리마시타네.',
        korean: '내년에 일본으로 이주하고 싶은데, 최근 일본의 비자와 영주권 정책이 많이 까다로워졌네요.',
      },
      {
        topic: '5개 웹사이트 · 4개 유튜브 채널 & 동시 7~8개 AI 지휘',
        sentence: 'AIエージェントに指示を出して、5つのウェブサイトと4つのYouTubeチャンネルを同時に運営しています。',
        pronunciation: '에이아이 에젠토니 시지오 다시테, 이츠츠노 웨부사이토토 욧츠노 유추부 찬네루오 도지니 운에이 시테 이마스.',
        korean: 'AI 에이전트에게 지시를 내려 5개의 웹사이트와 4개의 유튜브 채널을 동시에 운영하고 있습니다.',
      },
      {
        topic: '18개월 딸 육아와 집안 분위기',
        sentence: '18ヶ月の娘が生まれてから、妻との共通の話題が増えて家の雰囲気がもっと明るくなりました。',
        pronunciation: '주하치카게츠노 무스메가 우마레테카라, 츠마토노 쿄츠노 와다이가 후에테 이에노 훈이키가 못토 아카루쿠 나리마시타.',
        korean: '18개월 된 딸이 태어난 후 아내와 공통 화제가 늘어나 집안 분위기가 한층 더 밝아졌습니다.',
      },
    ],
  },
  es: {
    title: '🇪🇸 스페인어 수업 5분 전 실전 치트시트',
    subtitle: '핵심 동사(ahorrar·crear·enseñar·dirigir)를 활용한 오늘의 스페인어 근황 토크',
    openingTopics: [
      {
        topic: 'AI로 시간 절약(ahorrar) & 5개 웹·4개 유튜브(crear)',
        sentence: 'Uso la IA para ahorrar tiempo y crear cinco páginas web y cuatro canales de YouTube.',
        pronunciation: '우소 라 이아 파라 아오라르 티엠포 이 크레아르 싱코 파히나스 웹 이 쿠아트로 카날레스 데 유투브.',
        korean: '시간을 절약하고 5개의 웹페이지와 4개의 유튜브 채널을 만들기 위해 AI를 사용합니다.',
      },
      {
        topic: '아내에게 AI 코딩 가르쳐주기(enseñar)',
        sentence: 'Hoy le enseñé a mi esposa a programar con IA y le gustó muchísimo.',
        pronunciation: '오이 레 엔세녜 아 미 에스포사 아 프로그라마르 콘 이아 이 레 구스토 무치시모.',
        korean: '오늘 아내에게 AI로 코딩하는 법을 가르쳐 주었는데 아내가 정말 좋아했습니다.',
      },
      {
        topic: '18개월 딸과 가족 시간 보내기',
        sentence: 'Mi hija tiene dieciocho meses y paso todo mi tiempo libre con mi familia.',
        pronunciation: '미 이하 티에네 디에시오초 메세스 이 파소 토도 미 티엠포 리브레 콘 미 파밀리아.',
        korean: '제 딸은 18개월이고, 저는 여가 시간을 전부 가족과 함께 보냅니다.',
      },
    ],
  },
};

export function extractAgentTasksFromNotes(selectedNote: any, allNotes: any[]): AgentTaskItem[] {
  const tasks: AgentTaskItem[] = [];
  const targetNotes = selectedNote ? [selectedNote, ...allNotes.slice(0, 4)] : allNotes.slice(0, 5);
  const seen = new Set<string>();

  for (const n of targetNotes) {
    if (!n) continue;
    const title = n.title || '';
    if (title.includes('중국어') && n.id === 'note-hw-9-252967126') {
      const hwTasks: Omit<AgentTaskItem, 'id'>[] = [
        {
          title: '중국어 수업 교정 어휘 28선(舆情危机·词元·主体意识 등) 3회독 암기 카드 & 모닝 퀴즈 세팅',
          agentRole: '🌐 다국어 코칭 에이전트 & 수석비서 하나(Hana)',
          badgeColor: 'bg-[#F3E8FF] text-[#6B21A8]',
          category: '외국어 코칭',
          noteId: n.id,
          noteTitle: n.title,
        },
        {
          title: '"AI 토큰(词元) 소진 에피소드 & AI 시대 주체의식 교육" 주제 유튜브 쇼츠/릴스 6-Cut 기획안 생성',
          agentRole: '🎬 유튜브·릴스 프로덕션 & 카피라이터 뮤즈(Muse)',
          badgeColor: 'bg-[#FEF3C7] text-[#92400E]',
          category: '유튜브·릴스',
          noteId: n.id,
          noteTitle: n.title,
        },
        {
          title: '중국 CXMT(장신메모리) 급성장 및 대만 TSMC·NVIDIA 자본 투자 동향 글로벌 반도체 브리핑 리포트 작성',
          agentRole: '⚡ 듀얼트랙 마켓 인텔리전스 분석팀',
          badgeColor: 'bg-[#DBEAFE] text-[#1E40AF]',
          category: '마켓 인텔리전스',
          noteId: n.id,
          noteTitle: n.title,
        },
      ];
      for (const ht of hwTasks) {
        if (!seen.has(ht.title)) {
          seen.add(ht.title);
          tasks.push({ ...ht, id: `ag-${tasks.length}` });
        }
      }
    }

    if (title.includes('화천퍼스트') || title.includes('AIDC')) {
      const aidcTasks: Omit<AgentTaskItem, 'id'>[] = [
        {
          title: '화천퍼스트 · 일진전기(Bolt-On) · 다스테크 · 동양산전 M&A 밸류체인 실사 체크리스트 및 충남 1조 엣지 데이터센터 일정표 갱신',
          agentRole: '⚡ AIDC 전력 M&A 전담 전략팀 & 하나(Hana)',
          badgeColor: 'bg-[#ECFDF5] text-[#047857]',
          category: 'AIDC M&A',
          noteId: n.id,
          noteTitle: n.title,
        },
        {
          title: '내년 3월 무출근 완전 자동화 전수 체제(AI 에이전트 위임 매뉴얼) 단계별 마일스톤 점검',
          agentRole: '👩‍💼 수석비서 하나(Hana) 총괄 오케스트레이터',
          badgeColor: 'bg-[#F3E8FF] text-[#6B21A8]',
          category: '전사 자동화',
          noteId: n.id,
          noteTitle: n.title,
        },
      ];
      for (const at of aidcTasks) {
        if (!seen.has(at.title)) {
          seen.add(at.title);
          tasks.push({ ...at, id: `ag-${tasks.length}` });
        }
      }
    }
  }

  return tasks.slice(0, 6);
}

export function buildDealCrmBoard(notes: any[]): DealCrmItem[] {
  const findLinked = (keywords: string[]) =>
    notes
      .filter((n) => {
        const text = `${n.title || ''} ${n.structuredSummary || ''} ${n.transcript || ''}`.toLowerCase();
        return keywords.some((k) => text.includes(k.toLowerCase()));
      })
      .slice(0, 4)
      .map((n) => ({
        id: n.id,
        title: n.title,
        recordedAt: n.recordedAt,
      }));

  return [
    {
      id: 'crm-aidc-hwacheon',
      track: 'aidc',
      trackLabel: '⚡ Track A · AIDC 전력·인프라 M&A (독립 트랙)',
      name: '화천퍼스트 · 일진전기 Bolt-On & 충남 1조 엣지 데이터센터',
      subtitle: '전력·수배전·액침냉각 상장사 M&A 밸류체인 (일진전기·다스테크·동양산전·이지트로닉스·나인테크)',
      statusBadge: '🔥 3자 킥오프 확정 · 실사 추진 중',
      keyPeople: ['윤종성 대표', '화룡 (총괄 파트너)', '3자 킥오프 핵심 멤버'],
      metrics: [
        '충남 1조 원 규모 엣지 AI 데이터센터 인프라',
        '내년 3월 무출근 전수 체제 완료 목표',
        '수배전·변압기·냉각 볼트온(Bolt-On) M&A',
      ],
      summaryPoints: [
        '일진전기 중심 전력 인프라 볼트온(Bolt-On) 및 다스테크·동양산전·나인테크 연계 밸류업 로드맵 가동.',
        '충남 1조 원 규모 엣지 데이터센터 전력 확보 및 단계별 SPC/PF 구조화 진행.',
        '퀀텀테크놀로지 딥테크 딜과는 이해관계 충돌 방지를 위해 100% 독립 분리 운영 원칙 준수.',
      ],
      linkedNotes: findLinked(['화천퍼스트', '일진전기', '다스테크', 'AIDC', '데이터센터']),
    },
    {
      id: 'crm-deeptech-quantum',
      track: 'deeptech',
      trackLabel: '🔬 Track B · 딥테크 원천기술 포트폴리오 (독립 분리)',
      name: '샘컴(Semcom) ↔ 퀀텀테크놀로지 이원화 사업화 엔진',
      subtitle: 'KAIST Beyond 5G/6G 초고속·저전력 OFE 광무선 전송 & 피지컬 AI 센싱 원천기술',
      statusBadge: '💎 원천특허 R&D 19억 기투입 · 100억+ 조달 추진',
      keyPeople: ['KAIST 교수진 (대주주·원천기술)', '최석진 대표 (양산·영업 총괄)', '윤주환 대표 (감사·AI BM 밸류업)'],
      metrics: [
        '샘컴 R&D 19억 원 기투입 완료',
        '퀀텀테크놀로지 상용 모듈화 100억 원+ 자금 조달',
        '데이터센터 광무선 인터커넥트 PUE 10배 포텐셜',
      ],
      summaryPoints: [
        '샘컴(원천특허 R&D 보존 모체)과 퀀텀테크놀로지(사업화·상장사 연계 디딤돌 법인) 이원화 거버넌스 확립.',
        '드론(전파교란 방지)·자율주행차(와이어링 감축)·방위산업(스텔스 통신)·스마트홈 로보틱스 4대 타겟 응용처에 AI BM 결합.',
        '코스닥 상장사 볼트온 또는 우회상장 디딤돌로 10배 기술 밸류에이션 극대화.',
      ],
      linkedNotes: findLinked(['샘컴', '퀀텀', '광무선', '반도체', 'AI 데이터센터']),
    },
    {
      id: 'crm-global-semi',
      track: 'global',
      trackLabel: '🌐 Track C · 글로벌 반도체 · AI 마켓 인텔리전스',
      name: '삼성전자·SK하이닉스 · 중국 CXMT · 대만 TSMC · NVIDIA 동향',
      subtitle: '한·중·일·대만 반도체 분업 지형도 및 빅테크 자본 투자·여론위기(舆情危机) 모니터링',
      statusBadge: '📊 실시간 글로벌 동향 추적 중',
      keyPeople: ['젠슨 황 (NVIDIA CEO)', '한·중·일·대만 반도체 생태계'],
      metrics: [
        '한국 메모리 투톱 (삼성전자·SK하이닉스 HBM 주도)',
        '중국 CXMT(장신메모리) 급성장 & 대만 NVIDIA 대규모 투자',
        '일본 반도체 핵심 소재(材料)·장비 강점 유지',
      ],
      summaryPoints: [
        '메모리(한국 삼성·SK하이닉스), 파운드리(대만 TSMC), 소재·장비(일본), 추격자(중국 CXMT) 4각 구도 교차 분석.',
        'NVIDIA 대만 자본 투자 확대 및 경영진 여론 위기(舆情危机)·주가 변동성 상시 모니터링.',
      ],
      linkedNotes: findLinked(['삼성', '하이닉스', 'CXMT', 'TSMC', 'NVIDIA', '중국어']),
    },
  ];
}

export const DEFAULT_SCHEDULED_ITEMS: ScheduledMeetingItem[] = [
  {
    id: 'sched-en-morning',
    title: '🇺🇸 아침 1:1 비즈니스 영어 회화 (AI · 반도체 · 글로벌 정세 프리토킹)',
    timeLabel: '오전 07:00',
    durationLabel: '25분',
    type: 'en',
    badge: '영어 1:1 수업',
    tutorOrPartner: '원어민 튜터 (미국/남아공/자메이카/필리핀)',
    relatedKeyword: '영어 수업',
  },
  {
    id: 'sched-aidc-meeting',
    title: '⚡ 화천퍼스트 · AIDC 전력 인프라 M&A (일진전기·다스테크) 실행 점검',
    timeLabel: '오전 10:30',
    durationLabel: '60분',
    type: 'aidc',
    badge: 'AIDC M&A 회의',
    tutorOrPartner: '화룡 & M&A 전략 파트너진',
    relatedKeyword: '화천퍼스트',
  },
  {
    id: 'sched-zh-evening',
    title: '🇨🇳 1:1 비즈니스 중국어 회화 (반도체 · AI 자동화 · 유튜브 · 일상 중문)',
    timeLabel: '오후 18:30',
    durationLabel: '60분',
    type: 'zh',
    badge: '중국어 1:1 수업',
    tutorOrPartner: '중국어 원어민 선생님',
    relatedKeyword: '중국어',
  },
  {
    id: 'sched-ja-session',
    title: '🇯🇵 1:1 일본어 프리토킹 (일본 비자·영주권 정책 · 여행 · 3회독 학습)',
    timeLabel: '오후 20:00',
    durationLabel: '30분',
    type: 'ja',
    badge: '일본어 1:1 수업',
    tutorOrPartner: '일본어 원어민 튜터',
    relatedKeyword: '일본어',
  },
  {
    id: 'sched-es-session',
    title: '🇪🇸 1:1 스페인어 실전 회화 (AI 웹·유튜브 자동화 설명 & 핵심 동사 훈련)',
    timeLabel: '오후 21:00',
    durationLabel: '30분',
    type: 'es',
    badge: '스페인어 1:1 수업',
    tutorOrPartner: '스페인어 원어민 튜터',
    relatedKeyword: '스페인어',
  },
];

export function InteractiveTranscriptView({
  transcript,
  currentAudioTime,
  hasPlayableAudio,
  onSeekAudio,
  onStatus,
}: {
  transcript: string;
  currentAudioTime: number;
  hasPlayableAudio: boolean;
  onSeekAudio: (sec: number, label?: string) => void;
  onStatus?: (msg: string) => void;
}) {
  const blocks = React.useMemo(() => parseTranscriptToBlocks(transcript), [transcript]);

  if (blocks.length === 0) {
    return (
      <div className="text-sm text-[#777777] py-4">(인식된 전사 텍스트가 없습니다)</div>
    );
  }

  return (
    <div className="space-y-3.5">
      {hasPlayableAudio && (
        <div className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569]">
          <span className="font-semibold flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-[#111827] fill-current" />
            <span>시간 버튼을 누르면 해당 위치의 실제 녹음 음성이 바로 재생됩니다</span>
          </span>
          {currentAudioTime > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#111827] text-[#FFFFFF] font-medium tabular-nums text-xs font-bold">
              🔊 재생 위치 {formatSecToMMSS(currentAudioTime)}
            </span>
          )}
        </div>
      )}

      {blocks.map((b) => {
        const isActive =
          currentAudioTime > 0 &&
          b.startSec >= 0 &&
          currentAudioTime >= b.startSec &&
          currentAudioTime < b.endSec;

        if (!b.timeStr) {
          return (
            <div
              key={b.idx}
              className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[15.5px] text-[#1E293B] whitespace-pre-wrap leading-7"
            >
              {b.body}
            </div>
          );
        }

        const isTeacher =
          b.speaker.includes('선생님') || b.speaker.includes('튜터') || b.speaker.includes('Tutor');

        return (
          <div
            key={b.idx}
            className={`p-4 rounded-xl border transition-all ${
              isActive
                ? 'bg-[#FEFCE8] border-[#EAB308] shadow-xs'
                : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSeekAudio(b.startSec, `${b.timeStr} ${b.speaker}`)}
                  className={`px-2.5 py-1 rounded-md font-medium tabular-nums text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#CA8A04] text-[#FFFFFF]'
                      : 'bg-[#F1F5F9] hover:bg-[#111827] text-[#111827] hover:text-[#FFFFFF]'
                  }`}
                  title={`${b.timeStr} 시점 원음 즉시 재생`}
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>{b.timeStr}</span>
                </button>

                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                    isTeacher
                      ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                      : 'bg-[#F1F5F9] text-[#334155]'
                  }`}
                >
                  {b.speaker}
                </span>

                {isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FEF08A] text-[#854D0E] text-xs font-bold">
                    🔊 재생 중
                  </span>
                )}
              </div>

              {b.foreignSnippet && (
                <button
                  type="button"
                  onClick={() => speakNativePhrase(b.foreignSnippet!, undefined, onStatus)}
                  className="px-2.5 py-1 rounded-md bg-[#F8FAFC] hover:bg-[#111827] text-[#475569] hover:text-[#FFFFFF] border border-[#E2E8F0] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="이 문장 원어민 발음 듣기"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>발음 듣기</span>
                </button>
              )}
            </div>

            <div className="text-[15.5px] text-[#1E293B] whitespace-pre-wrap leading-7 break-keep">
              {b.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ScheduledMeetingsSection({
  notes,
  onSelectNote,
  onStartRecordForSchedule,
  onStatus,
}: {
  notes: any[];
  onSelectNote: (note: any) => void;
  onStartRecordForSchedule: (schedTitle: string) => void;
  onStatus?: (msg: string) => void;
}) {
  const [schedules, setSchedules] = React.useState<ScheduledMeetingItem[]>(DEFAULT_SCHEDULED_ITEMS);
  const [activeSchedId, setActiveSchedId] = React.useState<string | null>(null);
  const [addingNew, setAddingNew] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newTime, setNewTime] = React.useState('오후 15:00');
  const [newType, setNewType] = React.useState<'zh' | 'en' | 'ja' | 'es' | 'aidc' | 'deeptech'>('aidc');

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('sbn_custom_schedules_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSchedules(parsed);
        }
      }
    } catch {}
  }, []);

  const handleAddSchedule = () => {
    if (!newTitle.trim()) return;
    const badgeMap = {
      zh: '중국어 1:1 수업',
      en: '영어 1:1 수업',
      ja: '일본어 1:1 수업',
      es: '스페인어 1:1 수업',
      aidc: 'AIDC M&A 회의',
      deeptech: '딥테크 전략 회의',
    };
    const kwMap = {
      zh: '중국어',
      en: '영어',
      ja: '일본어',
      es: '스페인어',
      aidc: '화천퍼스트',
      deeptech: '퀀텀',
    };
    const item: ScheduledMeetingItem = {
      id: `sched-${Date.now()}`,
      title: newTitle.trim(),
      timeLabel: newTime.trim() || '오늘',
      durationLabel: '50분',
      type: newType,
      badge: badgeMap[newType],
      tutorOrPartner: '윤종성 대표 일정',
      relatedKeyword: kwMap[newType],
    };
    const next = [item, ...schedules];
    setSchedules(next);
    setNewTitle('');
    setAddingNew(false);
    setActiveSchedId(item.id);
    try {
      localStorage.setItem('sbn_custom_schedules_v1', JSON.stringify(next));
    } catch {}
  };

  const activeSched = schedules.find((s) => s.id === activeSchedId) || null;
  const relatedNote = React.useMemo(() => {
    if (!activeSched) return null;
    return (
      notes.find((n) =>
        `${n.title || ''} ${n.categoryLabel || ''}`
          .toLowerCase()
          .includes(activeSched.relatedKeyword.toLowerCase())
      ) || notes[0]
    );
  }, [activeSched, notes]);

  const activeCheatSheet =
    activeSched && (activeSched.type === 'zh' || activeSched.type === 'en' || activeSched.type === 'ja' || activeSched.type === 'es')
      ? PRE_CLASS_CHEAT_SHEETS[activeSched.type]
      : null;

  return (
    <div className="rounded-2xl border border-[#E5E5EE] bg-[#FFFFFF] p-4 lg:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-[#111111] text-[#FFFFFF] text-xs font-bold">
            📅 예정된 회의 &amp; 다국어 수업
          </span>
          <span className="text-xs font-semibold text-[#555555]">
            일정을 클릭하면 직전 회의 요약 &amp; 수업 5분 전 외국어 치트시트가 즉시 열립니다
          </span>
        </div>

        <button
          type="button"
          onClick={() => setAddingNew(!addingNew)}
          className="px-3 py-1 rounded-full bg-[#F4F4F8] hover:bg-[#111111] text-[#111111] hover:text-[#FFFFFF] text-xs font-bold transition-colors cursor-pointer"
        >
          {addingNew ? '닫기' : '+ 일정 추가'}
        </button>
      </div>

      {addingNew && (
        <div className="p-3.5 rounded-xl bg-[#F8F8FB] border border-[#E2E2EA] flex flex-wrap items-center gap-2">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#DCDCE4] text-xs font-bold text-[#111111]"
          >
            <option value="aidc">⚡ AIDC M&A 회의</option>
            <option value="deeptech">🔬 딥테크(샘컴·퀀텀) 회의</option>
            <option value="zh">🇨🇳 중국어 수업</option>
            <option value="en">🇺🇸 영어 수업</option>
            <option value="ja">🇯🇵 일본어 수업</option>
            <option value="es">🇪🇸 스페인어 수업</option>
          </select>
          <input
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="시간 (예: 오후 16:00)"
            className="w-28 px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#DCDCE4] text-xs font-medium text-[#111111]"
          />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="회의 또는 수업 제목 입력..."
            className="flex-1 min-w-[180px] px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#DCDCE4] text-xs font-medium text-[#111111]"
          />
          <button
            type="button"
            onClick={handleAddSchedule}
            className="px-3.5 py-1.5 rounded-lg bg-[#111111] text-[#FFFFFF] text-xs font-bold cursor-pointer"
          >
            등록
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {schedules.map((item) => {
          const isSelected = activeSchedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveSchedId(isSelected ? null : item.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-[#111111] text-[#FFFFFF] border-[#111111] shadow-md'
                  : 'bg-[#FAFAFC] hover:bg-[#F3F3F7] text-[#111111] border-[#EAEAEA]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 text-[11px] font-bold mb-1">
                  <span
                    className={`px-2 py-0.5 rounded ${
                      isSelected ? 'bg-[#6B21A8] text-[#FFFFFF]' : 'bg-[#EFEFF4] text-[#444444]'
                    }`}
                  >
                    {item.badge}
                  </span>
                  <span className={isSelected ? 'text-[#E5E5EA]' : 'text-[#666666]'}>
                    {item.timeLabel}
                  </span>
                </div>
                <div className="text-xs font-bold leading-snug line-clamp-2">{item.title}</div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-current/10 text-[11px] font-semibold">
                <span className="truncate opacity-80">{item.durationLabel}</span>
                <span className="underline font-bold">
                  {isSelected ? '프리뷰 닫기 ▲' : '5분 전 프리뷰 ▼'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {activeSched && (
        <div className="mt-1 p-4 rounded-2xl bg-[#F8F8FC] border-2 border-[#111111] flex flex-col gap-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E2E2EA]">
            <div>
              <span className="text-xs font-extrabold text-[#6B21A8]">
                🎯 [수업·회의 5분 전 브리핑 프리뷰] {activeSched.timeLabel} ({activeSched.durationLabel})
              </span>
              <h4 className="text-sm font-extrabold text-[#111111] mt-0.5">{activeSched.title}</h4>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {relatedNote && (
                <button
                  type="button"
                  onClick={() => onSelectNote(relatedNote)}
                  className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#111111] text-xs font-bold text-[#111111] hover:bg-[#F3E8FF] cursor-pointer"
                >
                  📌 직전 노트 열기 ({relatedNote.title.slice(0, 18)}...)
                </button>
              )}
              <button
                type="button"
                onClick={() => onStartRecordForSchedule(activeSched.title)}
                className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-[#FFFFFF] text-xs font-bold cursor-pointer"
              >
                🎙️ 이 일정 바로 녹음 시작
              </button>
            </div>
          </div>

          {activeCheatSheet ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-7 rounded-xl bg-[#FFFFFF] border border-[#E5E5EA] p-3.5 flex flex-col gap-2.5">
                <div className="text-xs font-extrabold text-[#111111]">
                  🗣️ 오늘 선생님께 바로 말할 내 최신 근황 3선 (원어민 발음 지원)
                </div>
                {activeCheatSheet.openingTopics.map((op, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[#FAFAFC] border border-[#EFEFF4] flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-[#6B21A8]">
                        #{i + 1}. {op.topic}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakNativePhrase(op.sentence, undefined, onStatus)}
                        className="px-2 py-0.5 rounded bg-[#111111] text-[#FFFFFF] text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        원어민 발음
                      </button>
                    </div>
                    <div className="text-xs font-bold text-[#111111]">{op.sentence}</div>
                    <div className="text-[11px] text-[#555555] font-medium">{op.pronunciation}</div>
                    <div className="text-[11px] text-[#333333]">💡 {op.korean}</div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5EA] p-3.5 flex flex-col gap-2">
                <div className="text-xs font-extrabold text-[#111111]">
                  📌 직전 수업 핵심 요약 리마인더
                </div>
                {relatedNote ? (
                  <div className="space-y-1.5 text-xs text-[#222222]">
                    <div className="font-bold text-[#111111]">{relatedNote.title}</div>
                    {(relatedNote.summary || []).slice(0, 4).map((s: string, idx: number) => (
                      <div key={idx} className="leading-relaxed">
                        • {s}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#666666]">직전 수업 노트가 없습니다.</div>
                )}
              </div>
            </div>
          ) : (
            relatedNote && (
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E5E5EA] p-3.5 space-y-2 text-xs text-[#222222]">
                <div className="font-extrabold text-[#111111]">
                  📌 직전 회의 핵심 브리핑: {relatedNote.title}
                </div>
                {(relatedNote.summary || []).map((s: string, idx: number) => (
                  <div key={idx} className="leading-relaxed">
                    • {s}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function ExpansionCommandHub({
  notes,
  selectedNote,
  isProcessing,
  onSelectNoteAndSeek,
  onDispatchAgentTask,
  onStatus,
  initialTab,
}: {
  notes: any[];
  selectedNote: any;
  isProcessing: boolean;
  onSelectNoteAndSeek: (noteId: string, sec?: number, label?: string) => void;
  onDispatchAgentTask: (taskTitle: string, agentRole: string) => void;
  onStatus?: (msg: string) => void;
  initialTab?: 'vocab' | 'agents' | 'crm';
}) {
  const [activeTab, setActiveTab] = React.useState<'vocab' | 'agents' | 'crm'>(initialTab || 'vocab');
  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [langFilter, setLangFilter] = React.useState<string>('all');
  const [vocabSearch, setVocabSearch] = React.useState('');
  const [cheatSheetLang, setCheatSheetLang] = React.useState<'zh' | 'en' | 'ja' | 'es' | null>('zh');
  const [customDirective, setCustomDirective] = React.useState('');
  const [customAgentRole, setCustomAgentRole] = React.useState('👩‍💼 수석비서 하나(Hana) 총괄비서');
  const [crmTrackFilter, setCrmTrackFilter] = React.useState<'all' | 'aidc' | 'deeptech' | 'global'>('all');

  const allVocab = React.useMemo(() => {
    const base = extractMasterVocabFromNotes(notes);
    // Also include any dynamically generated aiCoaching grammarCorrections & betterAnswers across all languages!
    const extra: VocabEntry[] = [];
    for (const n of notes || []) {
      if (n?.aiCoaching && Array.isArray(n.aiCoaching.grammarCorrections)) {
        const badge = String(n.aiCoaching.langBadge || '🌐 다국어').split(' ').slice(0, 2).join(' ');
        for (let i = 0; i < n.aiCoaching.grammarCorrections.length; i++) {
          const c = n.aiCoaching.grammarCorrections[i];
          if (c?.correctedSentence) {
            extra.push({
              id: `ai-voc-${n.id}-${i}`,
              lang: String(n.aiCoaching.lang || 'other'),
              langLabel: badge,
              expression: c.correctedSentence,
              pronunciation: c.pronunciation || '',
              meaning: c.grammarPoint || '',
              myIntent: c.myWrongSentence || n.title,
              noteId: n.id,
              noteTitle: n.title,
            });
          }
        }
      }
    }
    return [...extra, ...base];
  }, [notes]);
  const filteredVocab = React.useMemo(() => {
    return allVocab.filter((v) => {
      if (langFilter !== 'all') {
        if (langFilter === 'other') {
          if (['zh', 'en', 'ja', 'es'].includes(v.lang)) return false;
        } else if (v.lang !== langFilter) {
          return false;
        }
      }
      if (vocabSearch.trim()) {
        const q = vocabSearch.toLowerCase();
        return (
          v.expression.toLowerCase().includes(q) ||
          v.meaning.toLowerCase().includes(q) ||
          v.myIntent.toLowerCase().includes(q) ||
          v.pronunciation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allVocab, langFilter, vocabSearch]);

  const detectedTasks = React.useMemo(
    () => extractAgentTasksFromNotes(selectedNote, notes),
    [selectedNote, notes]
  );

  const crmDeals = React.useMemo(() => buildDealCrmBoard(notes), [notes]);
  const filteredCrm = React.useMemo(
    () => crmDeals.filter((d) => crmTrackFilter === 'all' || d.track === crmTrackFilter),
    [crmDeals, crmTrackFilter]
  );

  return (
    <section className="rounded-2xl border border-[#E2E2EC] bg-[#FFFFFF] p-4 lg:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-4">
      {/* 상단 3대 확장 인텔리전스 탭 바 */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EFEFF4]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('vocab')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-[#111111] text-[#FFFFFF]'
                : 'bg-[#F4F4F8] text-[#333333] hover:bg-[#E5E5EE]'
            }`}
          >
            <span>📖 전 세계 다국어 마스터 사전 &amp; 5분 치트시트 ({allVocab.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('agents')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'agents'
                ? 'bg-[#111111] text-[#FFFFFF]'
                : 'bg-[#F4F4F8] text-[#333333] hover:bg-[#E5E5EE]'
            }`}
          >
            <span>🤖 AI 에이전트 작업 큐 발주 ({detectedTasks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crm')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'crm'
                ? 'bg-[#111111] text-[#FFFFFF]'
                : 'bg-[#F4F4F8] text-[#333333] hover:bg-[#E5E5EE]'
            }`}
          >
            <span>📈 AIDC · 딥테크 M&amp;A 딜 &amp; CRM 보드</span>
          </button>
        </div>

        <span className="text-[11px] font-bold text-[#6B21A8] bg-[#F3E8FF] px-2.5 py-1 rounded-full">
          ✨ 세컨브레인 노트 (SecondBrain) 인텔리전스 확장 허브
        </span>
      </div>

      {/* 탭 1: 📖 다국어 누적 마스터 사전 & 다음 수업 5분 전 치트시트 */}
      {activeTab === 'vocab' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { key: 'all', label: `전체 (${allVocab.length})` },
                  { key: 'zh', label: '🇨🇳 중국어' },
                  { key: 'en', label: '🇺🇸 영어' },
                  { key: 'ja', label: '🇯🇵 일본어' },
                  { key: 'es', label: '🇪🇸 스페인어' },
                  { key: 'fr', label: '🇫🇷 프랑스어' },
                  { key: 'de', label: '🇩🇪 독일어' },
                  { key: 'vi', label: '🇻🇳 베트남어' },
                  { key: 'other', label: '🌐 기타 모든 언어' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setLangFilter(tab.key);
                    if (tab.key === 'zh' || tab.key === 'en' || tab.key === 'ja' || tab.key === 'es') {
                      setCheatSheetLang(tab.key);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                    langFilter === tab.key
                      ? 'bg-[#6B21A8] text-[#FFFFFF]'
                      : 'bg-[#F4F4F8] text-[#333333] hover:bg-[#E5E5EA]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                placeholder="표현·병음·한국어 뜻 검색..."
                className="px-3 py-1.5 rounded-xl bg-[#F7F7FA] border border-[#DCDCE4] text-xs font-medium text-[#111111]"
              />
              <button
                type="button"
                onClick={() => setCheatSheetLang(cheatSheetLang ? null : 'zh')}
                className="px-3 py-1.5 rounded-xl bg-[#111111] text-[#FFFFFF] text-xs font-bold cursor-pointer"
              >
                {cheatSheetLang ? '5분 치트시트 접기 ▲' : '⚡ 수업 5분 전 치트시트 열기 ▼'}
              </button>
            </div>
          </div>

          {/* ⚡ 수업 5분 전 치트시트 패널 */}
          {cheatSheetLang && (
            <div className="p-4 rounded-2xl bg-[#F9F9FC] border border-[#D8B4FE] flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-extrabold text-[#111111]">
                    {PRE_CLASS_CHEAT_SHEETS[cheatSheetLang].title}
                  </h4>
                  <p className="text-xs text-[#555555]">
                    {PRE_CLASS_CHEAT_SHEETS[cheatSheetLang].subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {(['zh', 'en', 'ja', 'es'] as const).map((lk) => (
                    <button
                      key={lk}
                      type="button"
                      onClick={() => setCheatSheetLang(lk)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        cheatSheetLang === lk
                          ? 'bg-[#111111] text-[#FFFFFF]'
                          : 'bg-[#FFFFFF] border border-[#DCDCE4] text-[#333333]'
                      }`}
                    >
                      {lk === 'zh' ? '🇨🇳 중문' : lk === 'en' ? '🇺🇸 영어' : lk === 'ja' ? '🇯🇵 일문' : '🇪🇸 스페인어'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {PRE_CLASS_CHEAT_SHEETS[cheatSheetLang].openingTopics.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5E5EA] flex flex-col justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-extrabold text-[#6B21A8]">
                          근황 토픽 {idx + 1} · {item.topic}
                        </span>
                        <button
                          type="button"
                          onClick={() => speakNativePhrase(item.sentence, undefined, onStatus)}
                          className="px-2 py-0.5 rounded bg-[#111111] text-[#FFFFFF] text-[10.5px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Volume2 className="w-3 h-3" />
                          발음
                        </button>
                      </div>
                      <div className="text-xs font-extrabold text-[#111111] leading-relaxed">
                        {item.sentence}
                      </div>
                      <div className="text-[11px] text-[#555555] font-medium">
                        [{item.pronunciation}]
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-[#F0F0F4] text-[11px] font-semibold text-[#333333]">
                      💡 {item.korean}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 누적 마스터 사전 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[440px] overflow-y-auto pr-1">
            {filteredVocab.map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl bg-[#FAFAFC] hover:bg-[#FFFFFF] border border-[#EAEAEA] hover:border-[#111111] transition-all flex flex-col justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#EFEFF4] text-[#222222] text-[10.5px] font-bold">
                      {v.langLabel}
                    </span>
                    <div className="flex items-center gap-1">
                      {v.timeSec !== undefined && v.timeStr && (
                        <button
                          type="button"
                          onClick={() =>
                            onSelectNoteAndSeek(v.noteId, v.timeSec, `${v.timeStr} ${v.expression}`)
                          }
                          className="px-2 py-0.5 rounded bg-[#111111] hover:bg-[#6B21A8] text-[#FFFFFF] font-medium tabular-nums text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                          title="해당 수업 원음 위치로 즉시 이동하여 재생"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          {v.timeStr} 원음
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => speakNativePhrase(v.expression, undefined, onStatus)}
                        className="px-2 py-0.5 rounded bg-[#F3E8FF] hover:bg-[#6B21A8] text-[#6B21A8] hover:text-[#FFFFFF] text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        발음
                      </button>
                    </div>
                  </div>

                  <div className="text-sm font-extrabold text-[#111111] leading-snug pt-0.5">
                    {v.expression}
                  </div>
                  <div className="text-xs font-medium tabular-nums font-semibold text-[#6B21A8]">
                    {v.pronunciation}
                  </div>
                  <div className="text-xs font-semibold text-[#222222]">{v.meaning}</div>
                </div>

                <div className="pt-1.5 border-t border-[#EFEFF4] flex items-center justify-between text-[11px] text-[#666666]">
                  <span className="truncate">발화 의도: {v.myIntent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 탭 2: 🤖 음성 지시 → AI 에이전트 작업 큐(Task Queue) 원클릭 발주 */}
      {activeTab === 'agents' && (
        <div className="flex flex-col gap-4">
          <div className="p-3.5 rounded-xl bg-[#F8F8FC] border border-[#E2E2EA] flex flex-wrap items-center gap-2">
            <select
              value={customAgentRole}
              onChange={(e) => setCustomAgentRole(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#DCDCE4] text-xs font-bold text-[#111111]"
            >
              <option value="👩‍💼 수석비서 하나(Hana) 총괄비서">👩‍💼 수석비서 하나(Hana)</option>
              <option value="📣 CMO 아테나 · AI 마케팅 본부">📣 CMO 아테나 · 마케팅팀</option>
              <option value="🎬 유튜브 · 릴스 프로덕션 스튜디오">🎬 유튜브 · 릴스 스튜디오</option>
              <option value="⚡ AIDC 전력 M&A 전략팀">⚡ AIDC 전력 M&amp;A 전략팀</option>
              <option value="🔬 샘컴·퀀텀 딥테크 사업화팀">🔬 샘컴·퀀텀 딥테크팀</option>
              <option value="🌐 다국어 튜터링 코치">🌐 다국어 튜터링 코치</option>
            </select>

            <input
              type="text"
              value={customDirective}
              onChange={(e) => setCustomDirective(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customDirective.trim()) {
                  onDispatchAgentTask(customDirective.trim(), customAgentRole);
                  setCustomDirective('');
                }
              }}
              placeholder="예: 오늘 중국어 수업에서 나온 AI 토큰(词元) 에피소드로 릴스 기획안 만들어줘..."
              className="flex-1 min-w-[220px] px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#DCDCE4] text-xs font-medium text-[#111111]"
            />

            <button
              type="button"
              disabled={isProcessing || !customDirective.trim()}
              onClick={() => {
                if (!customDirective.trim()) return;
                onDispatchAgentTask(customDirective.trim(), customAgentRole);
                setCustomDirective('');
              }}
              className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#6B21A8] text-[#FFFFFF] text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              🚀 에이전트 즉시 발주
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {detectedTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-[#FAFAFC] border border-[#EAEAEA] hover:border-[#111111] flex flex-col justify-between gap-3 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold ${task.badgeColor}`}>
                      {task.agentRole}
                    </span>
                    <span className="text-[11px] font-semibold text-[#666666]">{task.category}</span>
                  </div>
                  <div className="text-xs font-extrabold text-[#111111] leading-relaxed">
                    {task.title}
                  </div>
                  <div className="text-[11px] text-[#666666] truncate">
                    출처 노트: {task.noteTitle}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFEFF4]">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => onDispatchAgentTask(task.title, task.agentRole)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#111111] hover:bg-[#6B21A8] text-[#FFFFFF] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
                    <span>⚡ 이 작업 에이전트에게 즉시 실행 지시</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 탭 3: 📈 AIDC · 딥테크(샘컴/퀀텀) M&A 딜 & 인물 CRM 타임라인 보드 */}
      {activeTab === 'crm' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { key: 'all', label: '전체 트랙 보기' },
                  { key: 'aidc', label: '⚡ Track A · AIDC 전력 M&A' },
                  { key: 'deeptech', label: '🔬 Track B · 딥테크(샘컴·퀀텀)' },
                  { key: 'global', label: '🌐 Track C · 글로벌 반도체·빅테크' },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setCrmTrackFilter(t.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                    crmTrackFilter === t.key
                      ? 'bg-[#111111] text-[#FFFFFF]'
                      : 'bg-[#F4F4F8] text-[#333333] hover:bg-[#E5E5EA]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#047857] bg-[#ECFDF5] px-2.5 py-1 rounded-lg">
              ★ AIDC M&amp;A 트랙 ↔ 퀀텀테크놀로지 딥테크 트랙 100% 독립 분리 원칙 적용됨
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {filteredCrm.map((deal) => (
              <div
                key={deal.id}
                className="p-4 rounded-2xl bg-[#FAFAFC] border border-[#E2E2EA] flex flex-col justify-between gap-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#111111] text-[#FFFFFF] text-[10.5px] font-bold">
                      {deal.trackLabel}
                    </span>
                    <span className="text-[11px] font-extrabold text-[#6B21A8]">
                      {deal.statusBadge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-[#111111] leading-snug">
                      {deal.name}
                    </h4>
                    <p className="text-xs text-[#555555] mt-0.5">{deal.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {deal.keyPeople.map((person, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#DCDCE4] text-[11px] font-bold text-[#222222]"
                      >
                        👤 {person}
                      </span>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#EFEFF4] space-y-1">
                    <div className="text-[11px] font-extrabold text-[#111111]">
                      📊 핵심 수치 &amp; 밸류에이션 지표
                    </div>
                    {deal.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="text-xs font-semibold text-[#047857]">
                        • {m}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-xs text-[#222222]">
                    {deal.summaryPoints.map((sp, sIdx) => (
                      <div key={sIdx} className="leading-relaxed">
                        • {sp}
                      </div>
                    ))}
                  </div>
                </div>

                {deal.linkedNotes.length > 0 && (
                  <div className="pt-2.5 border-t border-[#E5E5EE] space-y-1.5">
                    <div className="text-[11px] font-bold text-[#555555]">
                      🔗 연관 세컨브레인 회의·수업 노트 ({deal.linkedNotes.length}건):
                    </div>
                    <div className="flex flex-col gap-1">
                      {deal.linkedNotes.map((ln) => (
                        <button
                          key={ln.id}
                          type="button"
                          onClick={() => onSelectNoteAndSeek(ln.id)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-[#FFFFFF] border border-[#E2E2EA] text-left text-[11px] font-bold truncate transition-colors cursor-pointer"
                        >
                          📌 {ln.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
