'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import lessonsData from '@/data/loopshadow_kr_foreign.json';

interface KrForeignLesson {
  id: string;
  lang: string;
  bcp47: string;
  category: string;
  sentence: string;
  pronunciation: string;
  meaning: string;
  tip: string;
}

const LESSONS: KrForeignLesson[] = lessonsData as KrForeignLesson[];

function calcMatchScore(target: string, spoken: string): number {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[.,!?;:'"¿¡()[\]{}。、！？，\-]/g, '')
      .trim();
  const t = clean(target);
  const sp = clean(spoken);
  if (!t || !sp) return 0;
  if (t === sp) return 100;
  const tChars = Array.from(t.replace(/\s+/g, ''));
  const spStr = sp.replace(/\s+/g, '');
  let hits = 0;
  for (const ch of tChars) {
    if (spStr.includes(ch)) hits++;
  }
  return Math.min(99, Math.round((hits / Math.max(tChars.length, 1)) * 100));
}

export default function LoopShadowKrPage() {
  const [selectedLang, setSelectedLang] = useState<string>('전체');
  const [speed, setSpeed] = useState<number>(1.0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [listeningId, setListeningId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { spoken: string; score: number }>>({});
  const [micNote, setMicNote] = useState<string>('');

  const langs = useMemo(() => ['전체', ...Array.from(new Set(LESSONS.map((l) => l.lang)))], []);

  const langCounts = useMemo(() => {
    const map: Record<string, number> = { 전체: LESSONS.length };
    for (const l of LESSONS) {
      map[l.lang] = (map[l.lang] || 0) + 1;
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    if (selectedLang === '전체') return LESSONS;
    return LESSONS.filter((l) => l.lang === selectedLang);
  }, [selectedLang]);

  const playVoice = (lesson: KrForeignLesson, rate: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(lesson.sentence);
    utter.lang = lesson.bcp47;
    utter.rate = rate;
    utter.onstart = () => setSpeakingId(lesson.id);
    utter.onend = () => setSpeakingId(null);
    utter.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utter);
  };

  const startShadowCheck = (lesson: KrForeignLesson) => {
    if (typeof window === 'undefined') return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicNote('마이크 발음 체크는 크롬(Chrome) 또는 엣지(Edge) 브라우저에서 지원됩니다.');
      return;
    }
    setMicNote('');
    const rec = new SpeechRec();
    rec.lang = lesson.bcp47;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setListeningId(lesson.id);

    rec.onresult = (event: any) => {
      const spoken = event?.results?.[0]?.[0]?.transcript || '';
      const score = calcMatchScore(lesson.sentence, spoken);
      setResults((prev) => ({ ...prev, [lesson.id]: { spoken, score } }));
      setListeningId(null);
    };
    rec.onerror = () => {
      setListeningId(null);
      setMicNote('마이크 권한이 거부되었거나 음성이 감지되지 않았습니다. 다시 시도해 주세요.');
    };
    rec.onend = () => setListeningId(null);
    rec.start();
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950 selection:bg-neutral-900 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight text-neutral-950">루프쉐도우 KR</span>
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
              100% 영구 무료 &middot; 5개국어 실전 쉐도잉
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/loopshadow"
              className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900"
            >
              Global Korean Mode &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-neutral-100 bg-neutral-50/60">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            LANGUAGELOOP 공식 무료 쉐도잉 연습실 &middot; 자동결제 0%
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-neutral-950 md:text-5xl md:leading-[1.15]">
            출퇴근 1분, 5개국어 실전 표현을 입으로 바로 따라 말해보세요.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            비싼 연간 자동결제 앱 없이, <strong className="font-semibold text-neutral-900">랭귀지루프 엄선 {LESSONS.length}개 실전 문장</strong>을 0.75배속·원어민 속도로 듣고 마이크로 발음 일치율까지 100% 무료로 바로 체크할 수 있습니다.
          </p>

          {/* Language Filter & Speed */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {langs.map((lang) => {
                const active = selectedLang === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-neutral-950 text-white'
                        : 'border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {lang}{' '}
                    <span className={active ? 'text-neutral-300' : 'text-neutral-400'}>
                      ({langCounts[lang] || 0})
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-200 bg-white p-1">
              {[0.75, 1.0].map((r) => (
                <button
                  key={r}
                  onClick={() => setSpeed(r)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    speed === r ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {r === 0.75 ? '0.75x 천천히' : '1.0x 원어민'}
                </button>
              ))}
            </div>
          </div>

          {micNote && (
            <p className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-600">
              {micNote}
            </p>
          )}
        </div>
      </section>

      {/* Lessons */}
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filtered.map((lesson) => {
            const isPlaying = speakingId === lesson.id;
            const isListening = listeningId === lesson.id;
            const res = results[lesson.id];

            return (
              <article
                key={lesson.id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-neutral-100 px-2.5 py-0.5 text-[11px] font-bold text-neutral-700">
                      {lesson.lang} &middot; {lesson.category}
                    </span>
                    {res && (
                      <span className="rounded-full bg-neutral-950 px-2.5 py-0.5 text-[11px] font-bold text-white">
                        발음 일치 {res.score}%
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-xl font-bold tracking-tight text-neutral-950">
                    {lesson.sentence}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-neutral-500">{lesson.pronunciation}</p>
                  <p className="mt-2 text-sm font-semibold text-neutral-800">{lesson.meaning}</p>
                  <p className="mt-3 rounded-xl bg-neutral-50 px-3.5 py-2.5 text-xs leading-relaxed text-neutral-600">
                    {lesson.tip}
                  </p>

                  {res && (
                    <p className="mt-2 text-xs text-neutral-500">
                      인식된 내 발음:{' '}
                      <span className="font-semibold text-neutral-900">&ldquo;{res.spoken}&rdquo;</span>
                    </p>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
                  <button
                    onClick={() => playVoice(lesson, speed)}
                    className="flex-1 rounded-xl border border-neutral-900 bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800 cursor-pointer"
                  >
                    {isPlaying ? '재생 중...' : `원어민 듣기 (${speed}x)`}
                  </button>
                  <button
                    onClick={() => startShadowCheck(lesson)}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-xs font-semibold transition cursor-pointer ${
                      isListening
                        ? 'border-neutral-950 bg-neutral-200 text-neutral-950'
                        : 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900'
                    }`}
                  >
                    {isListening ? '듣는 중... 지금 말하세요' : '따라 말하기 (마이크)'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* 1:1 Native Tutor Partner Section */}
        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                실전 원어민 회화로 한 단계 업그레이드
              </p>
              <h3 className="mt-1 text-xl font-bold text-neutral-950">
                검증된 원어민 튜터와 1:1 화상 회화 시작하기
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                루프쉐도우 혼자 연습은 평생 100% 무료입니다. 실제 현지 원어민과 대화를 나눠보고 싶다면 건별 결제로 부담 없는 글로벌 1:1 튜터 플랫폼을 이용해 보세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.italki.com/ko"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
              >
                italki 원어민 튜터 보기 &rarr;
              </a>
              <a
                href="https://preply.com/ko"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-900 transition hover:border-neutral-900"
              >
                Preply 원어민 튜터 보기 &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* Helper Family Cross-Promo */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            HELPER 패밀리 무료 &amp; 큐레이션 서비스
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: 'BeautyHelper', desc: '퍼스널컬러별 K-뷰티 호수 & 최저가 비교', href: '/beautyhelper' },
              { name: 'PersonalColorHelper', desc: '12시즌 무료 가상 퍼스널컬러 드레이핑', href: 'https://personalcolorhelper.com' },
              { name: 'StylingHelper', desc: '미국 공식 백화점 명품 실시간 재고·할인', href: 'https://stylinghelper.com' },
              { name: 'WeddingHelper', desc: '레이크 코모·발리 해외 웨딩 화보 미리보기', href: 'https://weddinghelper.love' },
              { name: 'StayHelper', desc: '4K 럭셔리 호텔 VIP 특전·업그레이드 비교', href: 'https://www.thestayhelper.com' },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900"
              >
                <h4 className="text-sm font-bold text-neutral-950 group-hover:underline">{s.name} &rarr;</h4>
                <p className="mt-1 text-xs leading-relaxed text-neutral-600">{s.desc}</p>
              </a>
            ))}
          </div>
          <p className="mt-6 text-center text-[11px] text-neutral-400">
            안내: 루프쉐도우는 평생 무료 서비스이며, 일부 파트너 튜터 링크를 통해 소정의 제휴 수수료를 받을 수 있습니다.
          </p>
        </section>
      </main>
    </div>
  );
}
