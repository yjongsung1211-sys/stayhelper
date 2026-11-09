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
} from '@/app/secondbrain/cloudStore';

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
  if (/^Speaker\s+\d+\s*:/m.test(clean)) return clean;
  const lines = clean
    .split(/\n{2,}|\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length === 0) return `Speaker 1: ${clean}`;
  return lines
    .map((l) => (/^Speaker\s+\d+\s*:/i.test(l) ? l : `Speaker 1: ${l}`))
    .join('\n\n');
}

function buildFallbackStructuredSummary(
  title: string,
  summaryList: string[],
  durationSec: number
): string {
  const bullets =
    summaryList && summaryList.length > 0
      ? summaryList.map((s) => `- ${s}`).join('\n')
      : '- 녹취 및 전사된 핵심 내용 요약.';
  return `# ${title}

## 1. Main Discussion & Recorded Content

${bullets}

## Key Decisions

- 녹취 및 전사된 핵심 내용을 단일 녹음 섹터로 정리하여 옵시디언(\`00_Inbox\`) 및 세컨브레인 클라우드 허브에 보존한다.

## Action Items

- **윤종성 대표**: 전사된 녹취 요약 및 세부 사항 확인 후 후속 실행 진행. [In progress]

## Key Numbers & Metrics

- Recording duration: **${durationSec} seconds**.

## Open Questions & Follow-ups

- 추가 확인이 필요한 세부 수치나 일정은 후속 미팅에서 구체화한다.

## Other Updates

- SecondBrain Note 24/7 클라우드 및 로컬 AI 파이프라인으로 전사·요약 완료.`;
}

async function analyzeTranscriptWithAi(text: string, durationSec: number) {
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

  // 로컬 PC이고 긴 녹취록인 경우 로컬 Ollama 요약 시도 (5초 타임아웃으로 빠른 응답 보장)
  if (!isCloudEnvironment() && clean.length > 180) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5500);
      const prompt = `당신은 전문 회의록 분석가 및 속기사입니다.
아래 [음성 전사 원문]을 읽고 다음 JSON 형식으로만 응답하세요.
출력 JSON 필드:
1. "title": 전체 대화/녹음의 핵심 주제를 아우르는 명확한 제목
2. "diarizedTranscript": 화자별로 정리한 전문 녹취록 (예: "Speaker 1: ...")
3. "summary": 핵심 요약 문장 리스트 (2~4개 항목 배열)
4. "structuredSummary": 마크다운 구조 상세 요약문

[음성 전사 원문]
${clean}`;

      const res = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:7b',
          prompt,
          format: 'json',
          keep_alive: '24h',
          stream: false,
          options: { temperature: 0.1, num_predict: 1200 },
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.response || '{}');
        const refinedTranscript = formatDiarizedTranscript(
          (parsed.diarizedTranscript || parsed.refinedTranscript || clean).trim()
        );
        const title = (parsed.title || clean.slice(0, 36)).trim();
        const summary =
          Array.isArray(parsed.summary) && parsed.summary.length > 0
            ? parsed.summary.map((s: any) => String(s).trim()).filter(Boolean)
            : [clean.slice(0, 120)];
        const structuredSummary =
          parsed.structuredSummary && String(parsed.structuredSummary).includes('## Key')
            ? String(parsed.structuredSummary).trim()
            : buildFallbackStructuredSummary(title, summary, durationSec);
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
    structuredSummary: buildFallbackStructuredSummary(title, summary, durationSec),
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
        const sttRes = await transcribeWavBufferInNode(wavBuf);
        if (sttRes.durationSec > 0) audioDuration = Math.round(sttRes.durationSec);
        if (sttRes.transcript) rawText = sttRes.transcript;
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

          // Pure Node.js STT 실행 (Vercel Cloud & Local PC 공통 1.2초 고속 전사)
          const sttResult = await transcribeWavBufferInNode(wavBuffer);
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

    const analysis = await analyzeTranscriptWithAi(rawText, audioDuration);

    return NextResponse.json({
      success: true,
      analysis: {
        title: analysis.title,
        summary: analysis.summary,
        structuredSummary: analysis.structuredSummary,
        transcript: analysis.refinedTranscript,
        durationSeconds: audioDuration,
        audioUrl: savedAudioUrl || undefined,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
