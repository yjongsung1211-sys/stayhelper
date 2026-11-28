'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import lessonsData from '@/data/loopshadow_global_korean.json';
import grammarData from '@/data/loopshadow_korean_grammar.json';

interface GlobalKoreanLesson {
  id: string;
  category: string;
  korean: string;
  romanization: string;
  en: string;
  es: string;
  tipEn: string;
  tipEs: string;
}

interface GrammarLesson {
  ep: number;
  pattern: string;
  titleEn: string;
  titleEs: string;
  formulaEn: string;
  formulaEs: string;
  ruleEn: string;
  ruleEs: string;
  exampleKr: string;
  exampleRom: string;
  exampleEn: string;
  exampleEs: string;
  quizPromptEn: string;
  quizPromptEs: string;
  options: string[];
  answerIndex: number;
}

const LESSONS: GlobalKoreanLesson[] = lessonsData as GlobalKoreanLesson[];
const GRAMMAR_LESSONS: GrammarLesson[] = grammarData as GrammarLesson[];

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

export default function LoopShadowGlobalPage() {
  const [uiLang, setUiLang] = useState<'en' | 'es'>('en');
  const [activeTab, setActiveTab] = useState<'shadowing' | 'grammar'>('shadowing');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [speed, setSpeed] = useState<number>(1.0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [listeningId, setListeningId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { spoken: string; score: number }>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [micNote, setMicNote] = useState<string>('');

  const grammarScore = useMemo(() => {
    return GRAMMAR_LESSONS.reduce(
      (acc, g) => acc + (quizAnswers[g.ep] === g.answerIndex ? 1 : 0),
      0
    );
  }, [quizAnswers]);

  const playText = (id: string, text: string, rate: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    utter.rate = rate;
    utter.onstart = () => setSpeakingId(id);
    utter.onend = () => setSpeakingId(null);
    utter.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utter);
  };

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(LESSONS.map((l) => l.category)))];
  }, []);

  const filtered = useMemo(() => {
    if (selectedCat === 'All') return LESSONS;
    return LESSONS.filter((l) => l.category === selectedCat);
  }, [selectedCat]);

  const playVoice = (lesson: GlobalKoreanLesson, rate: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(lesson.korean);
    utter.lang = 'ko-KR';
    utter.rate = rate;
    utter.onstart = () => setSpeakingId(lesson.id);
    utter.onend = () => setSpeakingId(null);
    utter.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utter);
  };

  const startShadowCheck = (lesson: GlobalKoreanLesson) => {
    if (typeof window === 'undefined') return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicNote(
        uiLang === 'en'
          ? 'Voice check works best in Chrome or Edge desktop/mobile browsers.'
          : 'El micrófono funciona mejor en navegadores Chrome o Edge.'
      );
      return;
    }
    setMicNote('');
    const rec = new SpeechRec();
    rec.lang = 'ko-KR';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setListeningId(lesson.id);

    rec.onresult = (event: any) => {
      const spoken = event?.results?.[0]?.[0]?.transcript || '';
      const score = calcMatchScore(lesson.korean, spoken);
      setResults((prev) => ({ ...prev, [lesson.id]: { spoken, score } }));
      setListeningId(null);
    };
    rec.onerror = () => {
      setListeningId(null);
      setMicNote(
        uiLang === 'en'
          ? 'Microphone permission denied or no speech detected. Please try again.'
          : 'No se detectó voz o falta permiso de micrófono. Inténtalo de nuevo.'
      );
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
            <span className="text-lg font-bold tracking-tight text-neutral-950">LOOPSHADOW</span>
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
              100% Free Korean Shadowing
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* EN / ES Toggle for Global Learners */}
            <div className="flex rounded-full border border-neutral-200 bg-neutral-50 p-0.5 text-[11px] font-semibold">
              <button
                onClick={() => setUiLang('en')}
                className={`rounded-full px-2.5 py-1 transition cursor-pointer ${
                  uiLang === 'en' ? 'bg-neutral-950 text-white' : 'text-neutral-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setUiLang('es')}
                className={`rounded-full px-2.5 py-1 transition cursor-pointer ${
                  uiLang === 'es' ? 'bg-neutral-950 text-white' : 'text-neutral-600'
                }`}
              >
                ES
              </button>
            </div>
            <Link
              href="/loopshadow/kr"
              className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900"
            >
              한국인 외국어 학습 &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-neutral-100 bg-neutral-50/60">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            {uiLang === 'en'
              ? 'FOR SEOUL TRAVELERS & K-CULTURE FANS · ZERO AUTO-RENEWAL TRAPS'
              : 'PARA VIAJEROS A SEÚL Y FANS DEL K-DRAMA · 100% GRATIS SIN TRAMPAS'}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-neutral-950 md:text-5xl md:leading-[1.12]">
            {uiLang === 'en'
              ? 'Speak real Seoul Korean out loud—100% free in your browser.'
              : 'Habla coreano real de Seúl en voz alta—100% gratis en tu navegador.'}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            {uiLang === 'en'
              ? `No $160/year subscription traps and zero AI lag. Practice ${LESSONS.length} essential Seoul phrases (cafes, Olive Young, taxis, K-BBQ) with native speed control and instant mic feedback.`
              : `Sin suscripciones de $160/año ni demoras. Practica ${LESSONS.length} frases esenciales de Seúl (cafés, Olive Young, taxis, K-BBQ) con voz nativa y evaluación de micrófono al instante.`}
          </p>

          {/* Mode Switcher: Shadowing vs Grammar 10-Lesson Cheat Sheet */}
          <div className="mt-7 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('shadowing')}
              className={`rounded-full px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'shadowing'
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900'
              }`}
            >
              {uiLang === 'en'
                ? `Shadowing Drills (${LESSONS.length})`
                : `Práctica Shadowing (${LESSONS.length})`}
            </button>
            <button
              onClick={() => setActiveTab('grammar')}
              className={`rounded-full px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'grammar'
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900'
              }`}
            >
              {uiLang === 'en'
                ? `Korean Grammar Cheat Sheet & Quiz (${GRAMMAR_LESSONS.length})`
                : `Gramática Coreana + Quiz (${GRAMMAR_LESSONS.length})`}
            </button>
          </div>

          {/* Filter & Speed */}
          {activeTab === 'shadowing' && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCat === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-neutral-950 text-white'
                        : 'border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {cat}
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
                  {r === 0.75 ? '0.75x Slow' : '1.0x Native'}
                </button>
              ))}
            </div>
          </div>
          )}

          {micNote && (
            <p className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-600">
              {micNote}
            </p>
          )}
        </div>
      </section>

      {/* Lessons or Grammar Cheat Sheet */}
      <main className="mx-auto max-w-6xl px-5 py-10">
        {activeTab === 'grammar' ? (
          <div>
            <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  {uiLang === 'en'
                    ? 'COMPANION TO KOREANLOOP YOUTUBE 10-EPISODE GRAMMAR SERIES'
                    : 'COMPLEMENTO DE LA SERIE DE 10 CLASES EN HOLA COREANO'}
                </p>
                <h2 className="mt-1 text-lg font-bold text-neutral-950">
                  {uiLang === 'en'
                    ? '10 Essential Korean Grammar Rules + Instant Quiz'
                    : '10 Reglas Esenciales de Gramática Coreana + Quiz'}
                </h2>
              </div>
              <div className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-bold text-white">
                {uiLang === 'en' ? 'Quiz Score' : 'Puntuación'}: {grammarScore} / {GRAMMAR_LESSONS.length}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {GRAMMAR_LESSONS.map((g) => {
                const picked = quizAnswers[g.ep];
                const isAnswered = picked !== undefined;
                const isCorrect = picked === g.answerIndex;
                const gVoiceId = `grammar-${g.ep}`;

                return (
                  <article
                    key={g.ep}
                    className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md bg-neutral-950 px-2.5 py-0.5 text-[11px] font-bold text-white">
                          EP {String(g.ep).padStart(2, '0')}
                        </span>
                        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700">
                          {uiLang === 'en' ? g.formulaEn : g.formulaEs}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-bold text-neutral-950">{g.pattern}</h3>
                      <p className="text-xs font-semibold text-neutral-500">
                        {uiLang === 'en' ? g.titleEn : g.titleEs}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-neutral-700">
                        {uiLang === 'en' ? g.ruleEn : g.ruleEs}
                      </p>

                      {/* Example Box */}
                      <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-bold text-neutral-950">{g.exampleKr}</p>
                            <p className="mt-0.5 text-[11px] text-neutral-500">{g.exampleRom}</p>
                            <p className="mt-1 text-xs font-medium text-neutral-800">
                              {uiLang === 'en' ? g.exampleEn : g.exampleEs}
                            </p>
                          </div>
                          <button
                            onClick={() => playText(gVoiceId, g.exampleKr, speed)}
                            className="shrink-0 rounded-lg bg-neutral-950 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-neutral-800 cursor-pointer"
                          >
                            {speakingId === gVoiceId
                              ? uiLang === 'en'
                                ? 'Playing...'
                                : 'Sonando...'
                              : uiLang === 'en'
                              ? 'Listen'
                              : 'Escuchar'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mini Quiz */}
                    <div className="mt-4 border-t border-neutral-100 pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        {uiLang === 'en' ? 'QUICK CHECK' : 'PRUEBA RÁPIDA'}
                      </p>
                      <p className="mt-1 text-xs font-medium text-neutral-800">
                        {uiLang === 'en' ? g.quizPromptEn : g.quizPromptEs}
                      </p>
                      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
                        {g.options.map((opt, idx) => {
                          const selected = picked === idx;
                          const correctOpt = idx === g.answerIndex;
                          let btnStyle =
                            'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900';
                          if (isAnswered && correctOpt) {
                            btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900';
                          } else if (selected && !correctOpt) {
                            btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                          }
                          return (
                            <button
                              key={opt}
                              onClick={() =>
                                setQuizAnswers((prev) => ({ ...prev, [g.ep]: idx }))
                              }
                              className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {isAnswered && (
                        <p
                          className={`mt-2 text-[11px] font-semibold ${
                            isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {isCorrect
                            ? uiLang === 'en'
                              ? 'Correct! Great instinct.'
                              : '¡Correcto! Muy bien.'
                            : uiLang === 'en'
                            ? `Almost! The natural Korean answer is "${g.options[g.answerIndex]}".`
                            : `¡Casi! La forma natural es "${g.options[g.answerIndex]}".`}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
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
                    <span className="rounded-md bg-neutral-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                      {lesson.category}
                    </span>
                    {res && (
                      <span className="rounded-full bg-neutral-950 px-2.5 py-0.5 text-[11px] font-bold text-white">
                        Match {res.score}%
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-neutral-950">
                    {lesson.korean}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-neutral-500">{lesson.romanization}</p>
                  <p className="mt-2 text-sm font-semibold text-neutral-800">
                    {uiLang === 'en' ? lesson.en : lesson.es}
                  </p>
                  <p className="mt-3 rounded-xl bg-neutral-50 px-3.5 py-2.5 text-xs leading-relaxed text-neutral-600">
                    {uiLang === 'en' ? lesson.tipEn : lesson.tipEs}
                  </p>

                  {res && (
                    <p className="mt-2 text-xs text-neutral-500">
                      {uiLang === 'en' ? 'You said:' : 'Dijiste:'}{' '}
                      <span className="font-semibold text-neutral-900">&ldquo;{res.spoken}&rdquo;</span>
                    </p>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
                  <button
                    onClick={() => playVoice(lesson, speed)}
                    className="flex-1 rounded-xl border border-neutral-900 bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800 cursor-pointer"
                  >
                    {isPlaying
                      ? uiLang === 'en'
                        ? 'Playing...'
                        : 'Reproduciendo...'
                      : uiLang === 'en'
                      ? `Listen (${speed}x)`
                      : `Escuchar (${speed}x)`}
                  </button>
                  <button
                    onClick={() => startShadowCheck(lesson)}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-xs font-semibold transition cursor-pointer ${
                      isListening
                        ? 'border-neutral-950 bg-neutral-200 text-neutral-950'
                        : 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900'
                    }`}
                  >
                    {isListening
                      ? uiLang === 'en'
                        ? 'Listening... Speak Now'
                        : 'Escuchando... Habla ahora'
                      : uiLang === 'en'
                      ? 'Shadow & Check Mic'
                      : 'Repetir y Evaluar'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        )}

        {/* Native Korean Tutors Partner CTA */}
        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                {uiLang === 'en' ? 'PRACTICE WITH REAL SEOUL TUTORS' : 'PRACTICA CON TUTORES NATIVOS DE SEÚL'}
              </p>
              <h3 className="mt-1 text-xl font-bold text-neutral-950">
                {uiLang === 'en'
                  ? 'Book 1-on-1 Korean Conversation Lessons'
                  : 'Reserva Clases 1 a 1 de Coreano Nativo'}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                {uiLang === 'en'
                  ? 'LoopShadow is 100% free forever for solo drills. Ready to talk with real native Korean teachers? Try flexible pay-per-lesson sessions.'
                  : 'LoopShadow es 100% gratis siempre. ¿Listo para conversar con profesores nativos de Corea? Prueba sesiones flexibles por clase.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.italki.com/en/teachers/korean"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
              >
                Korean Tutors on italki &rarr;
              </a>
              <a
                href="https://preply.com/en/online/korean-tutors"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-900 transition hover:border-neutral-900"
              >
                Korean Tutors on Preply &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* Helper Family Cross-Promotion Hub */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            EXPLORE THE HELPER FAMILY (SEOUL K-BEAUTY &amp; LIFESTYLE TOOLS)
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: 'SeoulHelper', desc: 'Free Seoul Trip Planner, VAT Tax-Free Calculator & 5-Star VIP Perks', href: '/seoulhelper' },
              { name: 'BeautyHelper', desc: 'K-Beauty 12-season shade & US lowest price tracker', href: '/beautyhelper' },
              { name: 'PersonalColorHelper', desc: 'Free 12-season Warm vs Cool virtual draping', href: 'https://personalcolorhelper.com' },
              { name: 'StylingHelper', desc: 'Authorized US designer bag stock & markdowns', href: 'https://stylinghelper.com' },
              { name: 'StayHelper', desc: '4K luxury hotel VIP perks & room upgrades', href: 'https://www.thestayhelper.com' },
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
            Disclosure: LoopShadow is 100% free with zero paywalls. Some tutor links may earn a partner commission at no extra cost to you.
          </p>
        </section>
      </main>
    </div>
  );
}
