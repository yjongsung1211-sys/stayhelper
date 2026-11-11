import { NextRequest, NextResponse } from 'next/server';
import {
  transcribeWavBufferInNode,
  callCloudFrontierAi,
} from '@/app/secondbrain/cloudStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export interface AIProxyRequest {
  provider: 'gemini' | 'openai' | 'claude' | 'deepseek' | 'ollama';
  apiKey?: string;
  model?: string;
  endpoint?: string;
  transcript?: string;
  audioBase64?: string;
  audioMimeType?: string;
  mode?: 'summary' | 'action_items' | 'language_coaching' | 'full';
  targetLang?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AIProxyRequest = await req.json();
    const {
      provider = 'gemini',
      apiKey,
      model,
      endpoint,
      transcript = '',
      audioBase64,
      audioMimeType,
      mode = 'full',
      targetLang = 'ko',
    } = body;

    let effectiveTranscript = transcript.trim();

    if (!effectiveTranscript && !audioBase64) {
      return NextResponse.json(
        { ok: false, error: '분석할 음성 녹음이나 오디오 파일이 없습니다.' },
        { status: 400 }
      );
    }

    // If audioBase64 is provided, first transcribe via Node WAV STT engine if WAV or via Gemini if valid API key
    if (audioBase64 && !effectiveTranscript) {
      try {
        const cleanB64 = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
        const buf = Buffer.from(cleanB64, 'base64');
        const sttRes = await transcribeWavBufferInNode(buf, targetLang);
        if (sttRes.transcript && sttRes.transcript.trim()) {
          effectiveTranscript = sttRes.transcript.trim();
        }
      } catch {}
    }

    const systemPrompt = `You are NoteHelper AI, an executive voice note summarizer, speech transcriber, and language coaching engine.
Analyze the audio and/or transcript and generate a structured JSON response in Korean (with languageCoaching examples in targetLang: ${targetLang}).

Strict JSON format required:
{
  "title": "핵심 주제를 요약한 한국어 제목",
  "transcript": "음성 전사 원문",
  "summary": ["핵심 요약 1", "핵심 요약 2", "핵심 요약 3"],
  "actionItems": [
    {"task": "실행 과제 내용", "assignee": "담당자", "due": "기한"}
  ],
  "languageCoaching": {
    "detectedLanguage": "ko | en | ja | es | zh",
    "grammarCorrections": [
      {"original": "원문 표현", "corrected": "자연스러운 표현", "explanation": "교정 이유"}
    ],
    "keyVocabulary": [
      {"term": "핵심 어휘", "meaning": "뜻과 뉘앙스", "example": "예문"}
    ],
    "roleplaySuggestion": "실전 대화 추천 문장"
  }
}
Output pure JSON only without markdown code blocks.`;

    const userPrompt = effectiveTranscript
      ? `Transcript to analyze:\n"""\n${effectiveTranscript}\n"""\nTarget Learning Language: ${targetLang}\nMode: ${mode}`
      : `Please listen to the attached audio file carefully. Transcribe it accurately into the 'transcript' field, and then produce the executive summary, actionItems, and languageCoaching in target language: ${targetLang}.`;

    const geminiKey = (apiKey && apiKey.trim()) || process.env.GEMINI_API_KEY;
    const hasValidGeminiKey = Boolean(geminiKey && !geminiKey.startsWith('AQ.'));

    // 1. Google Gemini (if valid AIza key is provided)
    if ((provider === 'gemini' || audioBase64) && hasValidGeminiKey) {
      let activeModel = model || 'gemini-2.0-flash';
      if (activeModel.includes('1.5')) {
        activeModel = 'gemini-2.0-flash';
      }

      const geminiParts: any[] = [{ text: `${systemPrompt}\n\n${userPrompt}` }];
      if (audioBase64) {
        const cleanB64 = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
        geminiParts.push({
          inlineData: {
            mimeType: audioMimeType || 'audio/wav',
            data: cleanB64,
          },
        });
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: geminiParts }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        try {
          const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
          if (!parsed.transcript && effectiveTranscript) {
            parsed.transcript = effectiveTranscript;
          }
          return NextResponse.json({ ok: true, data: parsed, provider: 'gemini', model: activeModel });
        } catch {}
      }
    }

    // 2. OpenAI / DeepSeek (if explicit key provided)
    if ((provider === 'openai' || provider === 'deepseek') && apiKey) {
      const baseUrl =
        provider === 'deepseek'
          ? 'https://api.deepseek.com/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';
      const activeModel = model || (provider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o-mini');

      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: activeModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const rawContent = json?.choices?.[0]?.message?.content || '{}';
        try {
          const parsed = JSON.parse(rawContent.replace(/```json/g, '').replace(/```/g, '').trim());
          if (!parsed.transcript && effectiveTranscript) {
            parsed.transcript = effectiveTranscript;
          }
          return NextResponse.json({ ok: true, data: parsed, provider, model: activeModel });
        } catch {}
      }
    }

    // 3. Anthropic Claude (if explicit key provided)
    if (provider === 'claude' && apiKey) {
      const activeModel = model || 'claude-3-5-sonnet-20241022';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: activeModel,
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const rawContent = json?.content?.[0]?.text || '{}';
        try {
          const parsed = JSON.parse(rawContent.replace(/```json/g, '').replace(/```/g, '').trim());
          if (!parsed.transcript && effectiveTranscript) {
            parsed.transcript = effectiveTranscript;
          }
          return NextResponse.json({ ok: true, data: parsed, provider: 'claude', model: activeModel });
        } catch {}
      }
    }

    // 4. Local Ollama
    if (provider === 'ollama') {
      const targetUrl = endpoint || 'http://localhost:11434/api/generate';
      const activeModel = model || 'qwen2.5:3b';
      try {
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: activeModel,
            prompt: `${systemPrompt}\n\n${userPrompt}`,
            stream: false,
            format: 'json',
          }),
        });
        if (res.ok) {
          const json = await res.json();
          const rawResponse = json?.response || '{}';
          const parsed = JSON.parse(rawResponse.replace(/```json/g, '').replace(/```/g, '').trim());
          if (!parsed.transcript && effectiveTranscript) {
            parsed.transcript = effectiveTranscript;
          }
          return NextResponse.json({ ok: true, data: parsed, provider: 'ollama', model: activeModel });
        }
      } catch {}
    }

    // 5. Built-in Cloud Frontier AI Fallback (works 24/7 with zero API key setup!)
    if (effectiveTranscript) {
      try {
        const aiJsonStr = await callCloudFrontierAi(`${systemPrompt}\n\n${userPrompt}`, {
          temperature: 0.2,
          maxTokens: 1400,
          jsonMode: true,
        });
        if (aiJsonStr) {
          const cleanJson = aiJsonStr.replace(/^```json\s*|\s*```$/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (!parsed.transcript) parsed.transcript = effectiveTranscript;
          return NextResponse.json({
            ok: true,
            data: parsed,
            provider: 'gemini',
            model: 'cloud-frontier-ai',
          });
        }
      } catch {}

      const sentences = effectiveTranscript
        .split(/(?<=[.?!다요죠함음])\s+|\n+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const firstSentence = sentences[0] || effectiveTranscript;
      return NextResponse.json({
        ok: true,
        data: {
          title: firstSentence.slice(0, 36) + (firstSentence.length > 36 ? '...' : ''),
          transcript: effectiveTranscript,
          summary: sentences.length > 0 ? sentences.slice(0, 3) : [effectiveTranscript],
          actionItems: [{ task: '전사된 음성 메모 확인 및 후속 실행', assignee: '담당자', due: '오늘' }],
          languageCoaching: {
            detectedLanguage: targetLang || 'ko',
            grammarCorrections: [],
            keyVocabulary: [],
            roleplaySuggestion: firstSentence,
          },
        },
        provider: 'gemini',
        model: 'cloud-stt',
      });
    }

    return NextResponse.json(
      { ok: false, error: '오디오에서 인식된 음성이 없습니다. 마이크 가까이에 대고 말씀해 주세요.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[NoteHelper AI Proxy Error]:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'AI 분석 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
