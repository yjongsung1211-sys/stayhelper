'use client';

import React, { useState } from 'react';
import { Volume2, Play, Sparkles, CheckCircle2, HelpCircle, MessageSquare } from 'lucide-react';
import { speakNativePhrase } from './intelligenceEngines';
import {
  GrammarCorrectionItem,
  BetterResponseItem,
  BetterQuestionItem,
  ScenarioTurn,
  LanguageCoachingData,
  GLOBAL_COACHING_LANGUAGES,
  detectNoteLanguageCode,
  isLanguageStudyNote,
  buildLanguageCoachingData,
  buildUniversalFallbackCoaching,
  formatLanguageCoachingMarkdown,
} from './languageCoachingCore';

export type {
  GrammarCorrectionItem,
  BetterResponseItem,
  BetterQuestionItem,
  ScenarioTurn,
  LanguageCoachingData,
};

export {
  GLOBAL_COACHING_LANGUAGES,
  detectNoteLanguageCode,
  isLanguageStudyNote,
  buildLanguageCoachingData,
  buildUniversalFallbackCoaching,
  formatLanguageCoachingMarkdown,
};

export function LanguageStudyCoachingPanel({
  note,
  onSeekAudio,
  onStatus,
  forceShow = false,
}: {
  note: any;
  onSeekAudio?: (sec: number, label?: string) => void;
  onStatus?: (msg: string) => void;
  forceShow?: boolean;
}) {
  const detectedLang = React.useMemo(() => detectNoteLanguageCode(note), [note]);
  const [selectedLang, setSelectedLang] = useState<string>(detectedLang || 'en');
  const [customLangInput, setCustomLangInput] = useState<string>('');
  const [liveAiCoaching, setLiveAiCoaching] = useState<LanguageCoachingData | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [subTab, setSubTab] = useState<'grammar' | 'better' | 'scenario'>('grammar');
  const [isPlayingScenario, setIsPlayingScenario] = useState(false);

  React.useEffect(() => {
    const det = detectNoteLanguageCode(note);
    if (det) setSelectedLang(det);
    if (note?.aiCoaching) {
      setLiveAiCoaching(note.aiCoaching);
    } else {
      setLiveAiCoaching(null);
    }
  }, [note?.id]);

  const coaching = React.useMemo(() => {
    if (liveAiCoaching && (!selectedLang || liveAiCoaching.lang === selectedLang)) {
      return liveAiCoaching;
    }
    const built = buildLanguageCoachingData(note, selectedLang);
    if (built) return built;
    if (forceShow || detectedLang) {
      return buildUniversalFallbackCoaching(note, selectedLang || detectedLang || 'en');
    }
    return null;
  }, [note, selectedLang, liveAiCoaching, forceShow, detectedLang]);

  const handleGenerateAiCoaching = async (targetLangOverride?: string) => {
    const target = (targetLangOverride || customLangInput.trim() || selectedLang || 'en').trim();
    setIsGeneratingAi(true);
    if (onStatus) {
      onStatus(`🌐 클라우드 프론티어 AI가 [${target}] 원어민 문법 교정·대답·시나리오를 실시간 생성 중입니다...`);
    }
    try {
      const res = await fetch('/api/secondbrain/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId: note?.id,
          targetLang: target,
          title: note?.title,
          transcript: note?.transcript,
          note,
        }),
      });
      const data = await res.json();
      if (data.success && data.coaching) {
        setLiveAiCoaching(data.coaching);
        setSelectedLang(data.coaching.lang);
        if (onStatus) {
          onStatus(`✅ [${data.coaching.langBadge}] 프론티어 AI 실시간 다국어 코칭 생성이 완료되었습니다!`);
        }
      } else if (onStatus) {
        onStatus(`⚠️ 코칭 생성 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (e: any) {
      if (onStatus) {
        onStatus(`⚠️ 네트워크 오류: ${e?.message || '연결 확인 필요'}`);
      }
    } finally {
      setIsGeneratingAi(false);
    }
  };

  if (!coaching) return null;

  const handlePlayFullScenario = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlayingScenario) {
      window.speechSynthesis.cancel();
      setIsPlayingScenario(false);
      if (onStatus) onStatus('⏹️ 실전 롤플레이 시나리오 연속 재생을 중지했습니다.');
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingScenario(true);
    if (onStatus) {
      onStatus(`🎭 [${coaching.scenarioTitle}] 전체 롤플레이 시나리오 연속 발음을 시작합니다.`);
    }

    let idx = 0;
    const playNextTurn = () => {
      if (idx >= coaching.scenarioTurns.length) {
        setIsPlayingScenario(false);
        if (onStatus) onStatus('✅ 롤플레이 시나리오 전체 대화 듣기가 완료되었습니다!');
        return;
      }
      const turn = coaching.scenarioTurns[idx++];
      const utter = new SpeechSynthesisUtterance(turn.foreignText);
      utter.lang = coaching.ttsLang;
      utter.rate = 0.92;
      utter.onend = () => setTimeout(playNextTurn, 550);
      utter.onerror = () => setIsPlayingScenario(false);
      window.speechSynthesis.speak(utter);
    };
    playNextTurn();
  };

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 lg:p-6 flex flex-col gap-5">
      {/* 🌐 전 세계 모든 언어(Universal Any-Language) 선택 & 프론티어 AI 실시간 코칭 바 */}
      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold text-[#111827] flex items-center gap-1">
            🌐 다국어 AI 코칭 언어 선택 (전 세계 모든 언어 지원):
          </span>
          <select
            value={selectedLang}
            onChange={(e) => {
              const nextLang = e.target.value;
              setSelectedLang(nextLang);
              handleGenerateAiCoaching(nextLang);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-bold text-[#111827]"
          >
            {GLOBAL_COACHING_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={customLangInput}
            onChange={(e) => setCustomLangInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customLangInput.trim()) {
                handleGenerateAiCoaching(customLangInput.trim());
              }
            }}
            placeholder="직접 입력 (예: 태국어, 아랍어, 몽골어, 스웨덴어...)"
            className="w-52 px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-medium text-[#111827]"
          />
        </div>

        <button
          type="button"
          disabled={isGeneratingAi}
          onClick={() => handleGenerateAiCoaching(customLangInput.trim() || selectedLang)}
          className="px-3.5 py-1.5 rounded-xl bg-[#6B21A8] hover:bg-[#581C87] text-[#FFFFFF] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
          <span>
            {isGeneratingAi
              ? '⏳ 프론티어 AI가 다국어 코칭 생성 중...'
              : '✨ AI 실시간 다국어 코칭 생성 / 언어 변환'}
          </span>
        </button>
      </div>

      {/* 헤더 & 3단계 탭 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-lg bg-[#111827] text-[#FFFFFF] text-xs font-bold">
            {coaching.langBadge}
          </span>
          <span className="text-sm font-semibold text-[#475569]">
            수업 중 틀린 표현 교정 · 더 좋은 대답/질문 · 실전 대화 시나리오
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('grammar')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'grammar'
                ? 'bg-[#111827] text-[#FFFFFF]'
                : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#111827]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>1. 틀린 문법 교정 ({coaching.grammarCorrections.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('better')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'better'
                ? 'bg-[#111827] text-[#FFFFFF]'
                : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#111827]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>2. 더 좋은 대답 · 질문 ({coaching.betterAnswers.length + coaching.betterQuestions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('scenario')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'scenario'
                ? 'bg-[#111827] text-[#FFFFFF]'
                : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#111827]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>3. 실전 시나리오 ({coaching.scenarioTurns.length}턴)</span>
          </button>
        </div>
      </div>

      {/* 탭 1: 1. 내가 틀린 문법 & 표현 바로잡기 (Before ➔ After) */}
      {subTab === 'grammar' && (
        <div className="grid grid-cols-1 gap-4">
          {coaching.grammarCorrections.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex flex-col gap-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#1E293B] text-xs font-bold">
                    교정 포인트 #{idx + 1}
                  </span>
                  {item.timeStr && item.timeSec !== undefined && onSeekAudio && (
                    <button
                      type="button"
                      onClick={() => onSeekAudio(item.timeSec!, `${item.timeStr} 문법 교정 구간`)}
                      className="px-2.5 py-1 rounded-md bg-[#EFF6FF] hover:bg-[#1D4ED8] text-[#1D4ED8] hover:text-[#FFFFFF] font-medium tabular-nums text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      {item.timeStr} 녹음 듣기
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => speakNativePhrase(item.correctedSentence, coaching.ttsLang, onStatus)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#111827] hover:bg-[#334155] text-[#FFFFFF] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>바른 문장 발음 듣기</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#FEF2F2]/60 border border-[#FECACA]">
                  <div className="text-xs font-bold text-[#DC2626] mb-1.5">
                    ❌ 내가 한 말 (어색한 표현)
                  </div>
                  <div className="text-[15px] font-medium text-[#7F1D1D] leading-relaxed">
                    {item.myWrongSentence}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#ECFDF5]/70 border border-[#A7F3D0]">
                  <div className="text-xs font-bold text-[#047857] mb-1.5">
                    ✅ 자연스러운 원어민 표현
                  </div>
                  <div className="text-[16px] font-bold text-[#064E3B] leading-relaxed">
                    {item.correctedSentence}
                  </div>
                  <div className="text-sm font-medium tabular-nums text-[#047857] mt-1.5">
                    🗣️ {item.pronunciation}
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14.5px] text-[#334155] leading-relaxed">
                <strong className="font-bold text-[#111827]">💡 핵심 문법 설명: </strong>
                {item.grammarPoint}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 탭 2: 2. 더 좋은 대답(Better Answers) & 더 좋은 질문(Better Questions) */}
      {subTab === 'better' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 좌측: 더 좋은 대답 */}
          <div className="space-y-3.5">
            <h5 className="text-sm font-bold text-[#111827] flex items-center gap-2 pb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#111827]">🌟 더 좋은 대답</span>
              <span className="text-[#475569] font-medium">자연스럽고 품격 있는 원어민 답변</span>
            </h5>
            {coaching.betterAnswers.map((ans, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#475569]">
                    상황: {ans.situation}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakNativePhrase(ans.betterSentence, coaching.ttsLang, onStatus)}
                    className="px-3 py-1 rounded-lg bg-[#111827] hover:bg-[#334155] text-[#FFFFFF] text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    발음 듣기
                  </button>
                </div>
                <div className="text-[16px] font-bold text-[#111827] leading-relaxed">
                  &ldquo;{ans.betterSentence}&rdquo;
                </div>
                <div className="text-sm font-medium tabular-nums text-[#475569]">
                  🗣️ {ans.pronunciation}
                </div>
                <div className="text-[14.5px] font-medium text-[#1E293B]">🇰🇷 {ans.koreanMeaning}</div>
                <div className="pt-2 border-t border-[#F1F5F9] text-xs text-[#64748B] leading-relaxed">
                  📌 <strong className="text-[#334155]">표현 팁:</strong> {ans.nuanceTip}
                </div>
              </div>
            ))}
          </div>

          {/* 우측: 더 좋은 질문 */}
          <div className="space-y-3.5">
            <h5 className="text-sm font-bold text-[#111827] flex items-center gap-2 pb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#1D4ED8]">❓ 더 좋은 질문</span>
              <span className="text-[#475569] font-medium">선생님께 역질문할 때 쓰는 표현</span>
            </h5>
            {coaching.betterQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#1D4ED8]">
                    맥락: {q.context}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakNativePhrase(q.questionSentence, coaching.ttsLang, onStatus)}
                    className="px-3 py-1 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-[#FFFFFF] text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    질문 발음
                  </button>
                </div>
                <div className="text-[16px] font-bold text-[#111827] leading-relaxed">
                  &ldquo;{q.questionSentence}&rdquo;
                </div>
                <div className="text-sm font-medium tabular-nums text-[#1D4ED8]">
                  🗣️ {q.pronunciation}
                </div>
                <div className="text-[14.5px] font-medium text-[#1E293B]">🇰🇷 {q.koreanMeaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 탭 3: 3. 실전 롤플레이 대화 시나리오 */}
      {subTab === 'scenario' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h5 className="text-base font-bold text-[#111827]">
                🎭 {coaching.scenarioTitle}
              </h5>
              <p className="text-sm text-[#475569] mt-1">{coaching.scenarioContext}</p>
            </div>

            <button
              type="button"
              onClick={handlePlayFullScenario}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                isPlayingScenario
                  ? 'bg-[#DC2626] text-[#FFFFFF]'
                  : 'bg-[#111827] hover:bg-[#334155] text-[#FFFFFF]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>
                {isPlayingScenario ? '⏹️ 연속 재생 중지' : '▶️ 시나리오 전체 대화 듣기'}
              </span>
            </button>
          </div>

          <div className="space-y-3">
            {coaching.scenarioTurns.map((turn, idx) => {
              const isMe = turn.role === 'Me';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col gap-2 ${
                    isMe
                      ? 'bg-[#F8FAFC] border-[#CBD5E1] ml-0 lg:ml-8'
                      : 'bg-[#FFFFFF] border-[#E2E8F0] mr-0 lg:mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                        isMe ? 'bg-[#111827] text-[#FFFFFF]' : 'bg-[#EFF6FF] text-[#1D4ED8]'
                      }`}
                    >
                      {turn.speakerLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakNativePhrase(turn.foreignText, coaching.ttsLang, onStatus)}
                      className="px-3 py-1 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#111827] text-[#334155] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>발음 듣기</span>
                    </button>
                  </div>

                  <div className="text-[16px] font-bold text-[#111827] leading-relaxed">
                    {turn.foreignText}
                  </div>
                  <div className="text-sm font-medium tabular-nums text-[#475569]">
                    🗣️ {turn.pronunciation}
                  </div>
                  <div className="text-[14.5px] text-[#334155]">🇰🇷 {turn.koreanText}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
