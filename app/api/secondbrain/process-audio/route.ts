import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import {
  isCloudEnvironment,
  transcribeWavBufferInNode,
  uploadAudioToCloudRepo,
  downloadAudioFromCloudRepo,
  callCloudFrontierAi,
  resolveUniversalLanguage,
} from '@/app/secondbrain/cloudStore';
import {
  buildLanguageCoachingData,
  formatLanguageCoachingMarkdown,
} from '@/app/secondbrain/languageCoachingEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const execFileAsync = promisify(execFile);

const FFMPEG_CANDIDATES = [
  'C:\\Users\\wushu\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe',
  'ffmpeg',
];

function getFfmpegBinary(): string {
  for (const candidate of FFMPEG_CANDIDATES) {
    if (candidate === 'ffmpeg' || fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return 'ffmpeg';
}

function formatDiarizedTranscript(raw: string): string {
  const clean = (raw || '').trim();
  if (!clean) return 'Speaker 1: (무음 또는 인식된 음성 없음)';
  if (
    /^(Speaker\s+\d+|선생님|중국어 선생님|사용자(?:\s*대표)?|Tutor|尹中盛|John|Johnson|Yong San|Tutor|Tutor)\s*:/m.test(
      clean
    ) ||
    /^\[\d{2}:\d{2}\]/m.test(clean)
  ) {
    return clean;
  }
  const lines = clean
    .split(/\n{2,}|\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length === 0) return `Speaker 1: ${clean}`;
  return lines
    .map((l) =>
      /^(Speaker\s+\d+\s*:|\[\d{2}:\d{2}\]|[#■\-|➔❌✅=]|[A-Za-z가-힣\u4e00-\u9fff\s]{1,18}:)/i.test(l)
        ? l
        : `Speaker 1: ${l}`
    )
    .join('\n\n');
}

function buildFallbackStructuredSummary(
  title: string,
  summaryList: string[],
  durationSec: number,
  rawTranscript = ''
): string {
  const bullets =
    summaryList && summaryList.length > 0
      ? summaryList.map((s) => `- ${s}`).join('\n')
      : '- 녹취 및 전사된 핵심 내용 요약.';
  const coaching = buildLanguageCoachingData({ title, transcript: rawTranscript });
  const coachingMd = coaching ? formatLanguageCoachingMarkdown(coaching) : '';
  return `# ${title}

## 1. Main Discussion & Recorded Content

${bullets}

## Key Decisions

- 녹취 및 전사된 핵심 내용을 단일 녹음 섹터로 정리하여 옵시디언(\`00_Inbox\`) 및 NoteHelper (노트헬퍼) 클라우드 허브에 보존한다.

## Action Items

- **담당자**: 전사된 녹취 요약 및 세부 사항 확인 후 후속 실행 진행. [In progress]

## Key Numbers & Metrics

- Recording duration: **${durationSec} seconds**.${coachingMd}`;
}

async function analyzeTranscriptWithAi(text: string, durationSec: number, targetLang?: string) {
  const clean = text.replace(/^\[.*?\]\s*(\[.*?\]\s*)*/g, '').trim();
  if (!clean || clean.includes('무음') || clean.includes('인식된 음성 없음')) {
    const title = `음성 녹음 (${durationSec}초)`;
    const summary = ['인식된 음성 텍스트가 없습니다. 원음 오디오를 재생하여 확인해 주세요.'];
    return {
      title,
      summary,
      structuredSummary: buildFallbackStructuredSummary(title, summary, durationSec),
      refinedTranscript: 'Speaker 1: (무음 또는 인식된 음성 없음)',
    };
  }

  // Cloud Frontier AI (Gemini / OpenAI / Cloud Gateway) + Local Ollama
  if (clean.length > 40) {
    try {
      const langMeta = resolveUniversalLanguage(targetLang || 'auto');
      const prompt = `당신은 전문 다국어 회의록 분석가 및 속기사입니다. (언어 힌트: ${langMeta.koName} / ${langMeta.nativeName})
아래 [음성 전사 원문]을 읽고 다음 JSON 형식으로만 응답하세요.
출력 JSON 필드:
1. "title": 전체 대화/녹음의 핵심 주제를 아우르는 명확한 한국어 제목
2. "diarizedTranscript": 화자별로 정리한 전문 녹취록 (원문 언어 그대로 유지, 예: "Speaker 1: ...")
3. "summary": 한국어 핵심 요약 문장 리스트 (2~4개 항목 배열)
4. "structuredSummary": 마크다운 구조 상세 요약문 (# 제목, ## 1. Main Discussion, ## Key Decisions, ## Action Items 포함)

[음성 전사 원문]
${clean}`;

      const aiJsonStr = await callCloudFrontierAi(prompt, {
        temperature: 0.15,
        maxTokens: 1400,
        jsonMode: true,
      });

      if (aiJsonStr) {
        const cleanJson = aiJsonStr.replace(/^```json\s*|\s*```$/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        const refinedTranscript = formatDiarizedTranscript(
          (parsed.diarizedTranscript || parsed.refinedTranscript || clean).trim()
        );
        const title = (parsed.title || clean.slice(0, 36)).trim();
        const summary =
          Array.isArray(parsed.summary) && parsed.summary.length > 0
            ? parsed.summary.map((s: any) => String(s).trim()).filter(Boolean)
            : [clean.slice(0, 120)];
        const baseStructured =
          parsed.structuredSummary && String(parsed.structuredSummary).includes('##')
            ? String(parsed.structuredSummary).trim()
            : buildFallbackStructuredSummary(title, summary, durationSec, clean);
        const coaching = buildLanguageCoachingData({
          title,
          transcript: clean,
          structuredSummary: baseStructured,
          targetLang,
        });
        const structuredSummary =
          coaching && !baseStructured.includes('[언어 학습 전담 AI 코칭]')
            ? `${baseStructured}${formatLanguageCoachingMarkdown(coaching)}`
            : baseStructured;
        return { title, summary, structuredSummary, refinedTranscript };
      }
    } catch {}
  }

  const sentences = clean
    .split(/(?<=[.?!다요죠함음])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const firstSentence = sentences[0] || clean;
  const title = firstSentence.slice(0, 36) + (firstSentence.length > 36 ? '...' : '');
  const summary = sentences.length > 0 ? sentences.slice(0, 4) : [clean];

  return {
    title,
    summary,
    structuredSummary: buildFallbackStructuredSummary(title, summary, durationSec, clean),
    refinedTranscript: formatDiarizedTranscript(clean),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let rawText = ((body.text as string) || '').trim();
    let audioDuration = Number(body.duration) || 10;
    const audioBase64 = (body.audioBase64 as string) || '';
    const mimeType = (body.mimeType as string) || 'audio/wav';
    const existingAudioUrl = (body.audioUrl as string) || '';
    const targetLang = (body.targetLang as string) || (body.lang as string) || 'auto';

    let savedAudioUrl = existingAudioUrl;

    // 1. 만약 기존 WAV 파일 재전사 요청(retranscribe: true)인 경우
    if (body.retranscribe && existingAudioUrl) {
      const wavFilename = path.basename(existingAudioUrl.split('?')[0]);
      const localWavPath = path.join(process.cwd(), 'public', 'recordings', wavFilename);
      const tmpWavPath = path.join('/tmp', 'recordings', wavFilename);

      let wavBuf: Buffer | null = null;
      if (fs.existsSync(localWavPath)) {
        wavBuf = fs.readFileSync(localWavPath);
      } else if (fs.existsSync(tmpWavPath)) {
        wavBuf = fs.readFileSync(tmpWavPath);
      } else {
        wavBuf = await downloadAudioFromCloudRepo(wavFilename);
      }

      if (wavBuf) {
        const sttRes = await transcribeWavBufferInNode(wavBuf, targetLang);
        if (sttRes.durationSec > 0) audioDuration = Math.round(sttRes.durationSec);
        if (sttRes.transcript && sttRes.transcript.length > rawText.length) {
          rawText = sttRes.transcript;
        }
        savedAudioUrl = `/api/secondbrain/audio/${wavFilename}`;
      }
    }

    // 2. 스마트폰/브라우저 오디오 데이터가 전달된 경우 (24/7 클라우드 & 로컬 PC 모두 지원!)
    if (audioBase64 && audioBase64.length > 100) {
      try {
        const ts = Date.now();
        const wavFilename = `mobile_rec_${ts}.wav`;
        const base64Clean = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
        const inputBuf = Buffer.from(base64Clean, 'base64');

        let wavBuffer: Buffer | null = null;
        const isAlreadyWav =
          mimeType.includes('wav') ||
          (inputBuf.length > 12 &&
            inputBuf.toString('ascii', 0, 4) === 'RIFF' &&
            inputBuf.toString('ascii', 8, 12) === 'WAVE');

        if (isAlreadyWav) {
          wavBuffer = inputBuf;
        } else if (!isCloudEnvironment()) {
          // 로컬 PC에서 비-WAV 포맷(.webm, .m4a 등)이 들어온 경우 FFmpeg 변환
          const recordingsDir = path.join(process.cwd(), 'public', 'recordings');
          fs.mkdirSync(recordingsDir, { recursive: true });
          const rawInputPath = path.join(recordingsDir, `mobile_raw_${ts}.webm`);
          const wavOutputPath = path.join(recordingsDir, wavFilename);
          fs.writeFileSync(rawInputPath, inputBuf);
          const ffmpegBin = getFfmpegBinary();
          await execFileAsync(
            ffmpegBin,
            ['-y', '-i', rawInputPath, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wavOutputPath],
            { timeout: 30000 }
          );
          try {
            fs.unlinkSync(rawInputPath);
          } catch {}
          if (fs.existsSync(wavOutputPath)) {
            wavBuffer = fs.readFileSync(wavOutputPath);
          }
        }

        if (wavBuffer && wavBuffer.length > 44) {
          // 로컬 디스크 또는 /tmp에 저장
          if (isCloudEnvironment()) {
            try {
              const tmpDir = path.join('/tmp', 'recordings');
              fs.mkdirSync(tmpDir, { recursive: true });
              fs.writeFileSync(path.join(tmpDir, wavFilename), wavBuffer);
            } catch {}
            await uploadAudioToCloudRepo(wavFilename, wavBuffer);
          } else {
            const recordingsDir = path.join(process.cwd(), 'public', 'recordings');
            fs.mkdirSync(recordingsDir, { recursive: true });
            fs.writeFileSync(path.join(recordingsDir, wavFilename), wavBuffer);
            uploadAudioToCloudRepo(wavFilename, wavBuffer).catch(() => {});
          }

          savedAudioUrl = `/api/secondbrain/audio/${wavFilename}`;

          // Pure Node.js + Cloud Frontier STT 실행 (전 세계 모든 언어 지원)
          const sttResult = await transcribeWavBufferInNode(wavBuffer, targetLang);
          if (sttResult.durationSec && sttResult.durationSec > 0) {
            audioDuration = Math.max(1, Math.round(sttResult.durationSec));
          }
          if (sttResult.transcript) {
            rawText = sttResult.transcript;
          }
        }
      } catch (convErr) {
        console.error('[Process Audio Error]', convErr);
      }
    }

    const analysis = await analyzeTranscriptWithAi(rawText, audioDuration, targetLang);

    return NextResponse.json({
      success: true,
      analysis: {
        title: analysis.title,
        summary: analysis.summary,
        structuredSummary: analysis.structuredSummary,
        transcript: analysis.refinedTranscript,
        durationSeconds: audioDuration,
        targetLang: targetLang !== 'auto' ? targetLang : undefined,
        audioUrl: savedAudioUrl || undefined,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
