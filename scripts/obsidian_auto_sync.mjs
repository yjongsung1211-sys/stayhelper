import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const NOTES_JSON_PATH = path.join(ROOT_DIR, 'data', 'secondbrain_notes.json');
const RECORDINGS_DIR = path.join(ROOT_DIR, 'public', 'recordings');

const VAULT_DIR = 'C:\\Users\\Administrator\\Desktop\\1인기업_세컨브레인_Vault';
const INBOX_DIR = path.join(VAULT_DIR, '00_Inbox');
const VAULT_AUDIO_DIR = path.join(INBOX_DIR, 'audio');
const HUB_MD_PATH = path.join(INBOX_DIR, '🎙️ 실물 세컨브레인 보이스 메모 허브.md');

function sanitizeFilename(title) {
  const safe = String(title || '보이스_노트')
    .replace(/[\\/:*?"<>|#\[\]^]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return safe.slice(0, 100).trim() || '보이스_노트';
}

function formatKoreanDate(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return String(isoStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  } catch {
    return String(isoStr);
  }
}

function formatDurationHuman(seconds) {
  const sec = Math.max(0, Math.round(Number(seconds) || 0));
  const hrs = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const rem = sec % 60;
  if (hrs > 0) return `${hrs}시간 ${mins}분 ${rem}초`;
  if (mins > 0) return `${mins}분 ${rem}초`;
  return `${rem}초`;
}

function detectCategorySubfolder(note) {
  const combined = `${note?.title || ''} ${(note?.tags || []).join(' ')} ${note?.source || ''} ${
    note?.transcript || ''
  }`.toLowerCase();

  if (
    combined.includes('일본어') ||
    combined.includes('japanese') ||
    /[\u3040-\u309F\u30A0-\u30FF]/.test(combined)
  ) {
    return '02_Areas/Japanese_Class';
  }
  if (
    combined.includes('중국어') ||
    combined.includes('chinese') ||
    combined.includes('중문') ||
    /[\u4E00-\u9FFF]{3,}/.test(combined)
  ) {
    return '02_Areas/Chinese_Class';
  }
  if (
    combined.includes('스페인어') ||
    combined.includes('spanish') ||
    combined.includes('español')
  ) {
    return '02_Areas/Spanish_Class';
  }
  if (combined.includes('영어 수업') || combined.includes('english')) {
    return '02_Areas/English_Class';
  }
  if (
    combined.includes('화천퍼스트') ||
    combined.includes('일진전기') ||
    combined.includes('다스테크') ||
    combined.includes('동양산전') ||
    combined.includes('나인테크') ||
    combined.includes('aidc') ||
    combined.includes('데이터센터')
  ) {
    return '01_Projects/AIDC_화천퍼스트';
  }
  if (
    combined.includes('퀀텀테크') ||
    combined.includes('샘컴') ||
    combined.includes('광무선') ||
    combined.includes('ofe')
  ) {
    return '01_Projects/퀀텀테크놀로지_샘컴';
  }
  if (
    combined.includes('스테이헬퍼') ||
    combined.includes('스타일링헬퍼') ||
    combined.includes('퍼스널컬러') ||
    combined.includes('룸헬퍼') ||
    combined.includes('웨딩헬퍼')
  ) {
    return '01_Projects/5대_Helper_플랫폼';
  }
  if (
    combined.includes('유튜브') ||
    combined.includes('쇼츠') ||
    combined.includes('다큐') ||
    combined.includes('lab to life')
  ) {
    return '01_Projects/유튜브_미디어스튜디오';
  }
  return null;
}

function extractAudioFilename(audioUrl) {
  if (!audioUrl) return null;
  const clean = String(audioUrl).split('?')[0];
  const base = path.basename(clean);
  return base || null;
}

/**
 * Ensures the transcript is formatted as Speaker-Diarized turns:
 * Speaker 1: ...
 *
 * Speaker 2: ...
 */
function ensureDiarizedTranscript(rawTranscript) {
  const text = String(rawTranscript || '').trim();
  if (!text) return 'Speaker 1: (무음 또는 인식된 음성 없음)';
  if (
    /^(Speaker\s+\d+|선생님|중국어 선생님|윤종성(?:\s*대표)?|Andy|尹中盛|John|Johnson|Yong San|Jolene|Tutor)\s*:/m.test(
      text
    ) ||
    /^\[\d{2}:\d{2}\]/m.test(text)
  ) {
    return text;
  }
  const paragraphs = text
    .split(/\n{2,}|\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length === 0) return `Speaker 1: ${text}`;
  return paragraphs
    .map((line) => {
      if (
        /^(Speaker\s+\d+\s*:|\[\d{2}:\d{2}\]|[#■\-|➔❌✅=📌]|[A-Za-z가-힣\u4e00-\u9fff\s]{1,18}:)/i.test(
          line
        )
      ) {
        return line;
      }
      return `Speaker 1: ${line}`;
    })
    .join('\n\n');
}

/**
 * Ensures every note has the comprehensive Structured Summary format:
 * # [Title]
 * ## 1. [Topic Section]
 * ## Key Decisions
 * ## Action Items
 * ## Key Numbers & Metrics
 * ## Open Questions & Follow-ups
 * ## Other Updates
 */
function ensureStructuredSummary(note) {
  if (note.structuredSummary && String(note.structuredSummary).trim().length > 20) {
    return String(note.structuredSummary).trim();
  }

  const title = note.title || 'Voice Note Discussion';
  const summaries =
    Array.isArray(note.summary) && note.summary.length > 0
      ? note.summary
      : [note.transcript || '음성 녹음 전사 요약'];

  const topicBullets = summaries.map((s) => `- ${s}`).join('\n');

  const actionItems =
    Array.isArray(note.actionItems) && note.actionItems.length > 0
      ? note.actionItems
          .map(
            (a) =>
              `- **${a.assignee || '윤종성 대표'}**: ${a.task}${
                a.completed ? ' [Completed]' : ' [In progress]'
              }`
          )
          .join('\n')
      : `- **윤종성 대표**: 전사된 녹음 내용 검토 및 후속 실행 점검. [In progress]`;

  return `# ${title}

## 1. Main Discussion & Recorded Content

${topicBullets}

## Key Decisions

- 녹취 및 전사된 핵심 내용을 세컨브레인(Obsidian)에 단일 녹음 섹터로 보존하고 후속 일정에 반영한다.

## Action Items

${actionItems}

## Key Numbers & Metrics

- Recording duration: **${note.durationSeconds || 0} seconds**.
- Participants / Speakers: **${Array.isArray(note.speakers) ? note.speakers.length : 1} speaker(s)**.

## Open Questions & Follow-ups

- 추가 확인이 필요한 세부 수치나 일정은 차기 미팅 또는 후속 메모에서 보완한다.

## Other Updates

- 본 녹음은 SecondBrain Note 하드웨어에서 전사되어 옵시디언(\`00_Inbox\`)으로 자동 동기화되었다.`;
}

export function syncNotesToObsidian() {
  try {
    if (!fs.existsSync(NOTES_JSON_PATH)) {
      return { ok: false, error: 'secondbrain_notes.json not found', syncedCount: 0 };
    }

    fs.mkdirSync(INBOX_DIR, { recursive: true });
    fs.mkdirSync(VAULT_AUDIO_DIR, { recursive: true });

    const raw = fs.readFileSync(NOTES_JSON_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    const notes = Array.isArray(parsed) ? parsed : parsed.notes || [];

    // Sort newest first
    notes.sort(
      (a, b) => new Date(b.recordedAt || 0).getTime() - new Date(a.recordedAt || 0).getTime()
    );

    const generatedFiles = new Set();
    const hubEntries = [];
    const nowIso = new Date().toISOString();

    notes.forEach((note, index) => {
      const numPrefix = String(index + 1).padStart(2, '0');
      const safeTitle = sanitizeFilename(note.title || `녹음_${numPrefix}`);
      const mdFilename = `${numPrefix}_${safeTitle}.md`;
      const mdFullPath = path.join(INBOX_DIR, mdFilename);
      generatedFiles.add(mdFilename);

      // Copy audio file into Obsidian Vault (00_Inbox/audio/) if available
      const audioFilename = extractAudioFilename(note.audioUrl);
      let vaultAudioRelPath = null;
      if (audioFilename) {
        const srcAudioPath = path.join(RECORDINGS_DIR, audioFilename);
        if (fs.existsSync(srcAudioPath)) {
          const destAudioPath = path.join(VAULT_AUDIO_DIR, audioFilename);
          try {
            const srcStat = fs.statSync(srcAudioPath);
            const destExists = fs.existsSync(destAudioPath);
            const destStat = destExists ? fs.statSync(destAudioPath) : null;
            if (!destExists || destStat.size !== srcStat.size) {
              fs.copyFileSync(srcAudioPath, destAudioPath);
            }
            vaultAudioRelPath = `00_Inbox/audio/${audioFilename}`;
          } catch (copyErr) {
            console.error('[Obsidian Sync] Audio copy error:', copyErr.message);
          }
        }
      }

      const dateStr = formatKoreanDate(note.recordedAt);
      const durationSec = note.durationSeconds || 0;
      const durationHuman = formatDurationHuman(durationSec);
      const deviceModel = note.deviceModel || 'SecondBrain Note';
      const source = note.source || 'device_hardware';
      const speakers =
        Array.isArray(note.speakers) && note.speakers.length > 0
          ? note.speakers.join(', ')
          : 'Speaker 1, Speaker 2';

      const structuredSummary = ensureStructuredSummary(note);
      const diarizedTranscript = ensureDiarizedTranscript(note.transcript);

      note.structuredSummary = structuredSummary;
      note.transcript = diarizedTranscript;

      const tags =
        Array.isArray(note.tags) && note.tags.length > 0
          ? note.tags
          : ['SecondBrain', '음성녹음', 'AI구조화요약'];

      const yamlTags = ['SecondBrain', '보이스노트', ...tags.filter((t) => t !== 'SecondBrain')]
        .map((t) => `  - "${String(t).replace(/"/g, '\\"')}"`)
        .join('\n');

      const audioEmbedBlock = vaultAudioRelPath
        ? `\n### 🔊 원본 녹음 오디오\n![[${vaultAudioRelPath}]]\n`
        : '';

      const categorySubfolder = detectCategorySubfolder(note);
      const actionOutputsObj = note.actionOutputs || {};
      const actionOutputEntries = Object.values(actionOutputsObj).filter(
        (entry) => entry && entry.content
      );
      const actionOutputsBlock =
        actionOutputEntries.length > 0
          ? `\n---\n\n## 🚀 [섹터 3] 보이스 투 액션 (Voice-to-Action) AI 파생 산출물\n\n` +
            actionOutputEntries
              .map((entry) => `### ${entry.label || 'AI 파생 문서'}\n\n${entry.content}`)
              .join('\n\n---\n\n') +
            '\n'
          : '';

      // Single unified Recording Sector markdown file
      const mdContent = `---
id: "${note.id || ''}"
title: "${String(note.title || '').replace(/"/g, '\\"')}"
recorded_at: "${dateStr}"
duration_seconds: ${durationSec}
device: "${String(deviceModel).replace(/"/g, '\\"')}"
speakers: "${String(speakers).replace(/"/g, '\\"')}"
source: "${source}"
category_folder: "${categorySubfolder || '00_Inbox'}"
${vaultAudioRelPath ? `audio_file: "${vaultAudioRelPath}"\n` : ''}tags:
${yamlTags}
---

# 🎙️ [녹음 섹터 #${numPrefix}] ${note.title || '보이스 노트'}

> [!info] 단일 녹음 통합 섹터 (Unified Recording Sector)
> - **녹음 일시**: ${dateStr}
> - **녹음 길이**: ${durationHuman}
> - **녹음 기기**: ${deviceModel}
> - **참여 화자**: ${speakers}
> - **보관 경로**: \`00_Inbox/${mdFilename}\`${
        categorySubfolder ? ` & \`${categorySubfolder}/${safeTitle}.md\`` : ''
      }
${audioEmbedBlock}
---

## 📊 [섹터 1] 노트에 녹취 후 전사한 내용 구조화 요약 (Structured Summary)

${structuredSummary}

---

## 💬 [섹터 2] 화자 분리 전문 녹취록 (Speaker-Diarized Transcript)

${diarizedTranscript}
${actionOutputsBlock}
---
*이 문서는 SecondBrain Note 녹음에 대해 [1. 구조화 심층 요약], [2. 화자 분리 녹취록], [3. 보이스 투 액션 파생 산출물]을 통합하여 옵시디언(\`00_Inbox\`${
        categorySubfolder ? ` 및 \`${categorySubfolder}\`` : ''
      })에 자동 동기화된 노트입니다.*
`;

      fs.writeFileSync(mdFullPath, mdContent, 'utf8');

      if (categorySubfolder) {
        try {
          const catDir = path.join(VAULT_DIR, categorySubfolder);
          fs.mkdirSync(catDir, { recursive: true });
          fs.writeFileSync(path.join(catDir, `${safeTitle}.md`), mdContent, 'utf8');
        } catch (catErr) {
          console.error('[Obsidian Sync] Category mirror error:', catErr.message);
        }
      }

      note.obsidianSynced = true;
      note.obsidianPath = `00_Inbox/${mdFilename}`;
      note.categoryFolder = categorySubfolder || '00_Inbox';
      note.obsidianSyncedAt = nowIso;

      hubEntries.push({
        numPrefix,
        title: note.title || '보이스 노트',
        mdFilename,
        dateStr,
        durationSec,
        durationHuman,
        deviceModel,
        speakers,
        vaultAudioRelPath,
        structuredSummary,
        diarizedTranscript,
      });
    });

    // Clean up stale numbered note files (^\d{2}_.*\.md$) in 00_Inbox
    const existingFiles = fs.readdirSync(INBOX_DIR);
    for (const file of existingFiles) {
      if (/^\d{2}_.*\.md$/i.test(file) && !generatedFiles.has(file)) {
        try {
          fs.unlinkSync(path.join(INBOX_DIR, file));
        } catch {}
      }
    }

    // Write the Hub Index Note (🎙️ 실물 세컨브레인 보이스 메모 허브.md)
    // Organized so each recording is a complete unified sector!
    const tocLines = hubEntries
      .map((item) => {
        const stem = item.mdFilename.replace(/\.md$/i, '');
        return `- **녹음 섹터 #${item.numPrefix}**: [[00_Inbox/${stem}|🎙️ ${item.title}]] *(${item.dateStr} · ${item.durationHuman})*`;
      })
      .join('\n');

    const hubSectors = hubEntries
      .map((item) => {
        const stem = item.mdFilename.replace(/\.md$/i, '');
        const audioLine = item.vaultAudioRelPath
          ? `\n### 🔊 원본 오디오 재생\n![[${item.vaultAudioRelPath}]]\n`
          : '';
        return `# 🎙️ [녹음 섹터 #${item.numPrefix}] [[00_Inbox/${stem}|${item.title}]]

> [!note] 녹음 메타데이터 (Recording #${item.numPrefix})
> - **독립 노트 바로가기**: [[00_Inbox/${stem}|📄 ${item.mdFilename} 열기]]
> - **일시**: ${item.dateStr} | **길이**: ${item.durationHuman} | **기기**: ${item.deviceModel} | **화자**: ${item.speakers}
${audioLine}
## 📊 [${item.numPrefix}-A] 구조화 심층 요약 (Structured Summary)

${item.structuredSummary}

---

## 💬 [${item.numPrefix}-B] 화자 분리 녹취록 (Speaker-Diarized Transcript)

${item.diarizedTranscript}
`;
      })
      .join('\n\n================================================================================\n\n');

    const hubContent = `---
title: "🎙️ 실물 세컨브레인 보이스 메모 허브"
updated: "${formatKoreanDate(nowIso)}"
tags:
  - SecondBrain
  - VoiceNotes
  - ObsidianAutoSync
---

# 🎙️ 세컨브레인 AI 보이스 노트 통합 섹터 허브

> [!success] 녹음별 단일 섹터 (구조화 요약 + 화자 분리 녹취록) 자동 정리 활성화됨
> SecondBrain Note로 녹취 후 전사된 모든 내용은 **[주제별 번호 요약 · Key Decisions · Action Items · Key Numbers & Metrics · Open Questions & Follow-ups · Other Updates]**와 **[Speaker 1 / Speaker 2 화자 분리 녹취록]**이 결합된 **단일 녹음 섹터**로 자동 정리됩니다.
> - **총 보관 녹음 섹터**: ${hubEntries.length}건
> - **최근 자동 동기화**: ${formatKoreanDate(nowIso)}

## 🗂️ 녹음 섹터 빠른 목차 (Recording Sectors Index)
${tocLines || '- _저장된 보이스 노트가 없습니다._'}

---

${hubSectors || '_아직 저장된 보이스 노트가 없습니다._\n'}
`;

    fs.writeFileSync(HUB_MD_PATH, hubContent, 'utf8');

    // Persist obsidianSynced metadata back to secondbrain_notes.json
    const updatedJson = Array.isArray(parsed) ? { notes } : { ...parsed, notes };
    fs.writeFileSync(NOTES_JSON_PATH, JSON.stringify(updatedJson, null, 2), 'utf8');

    return {
      ok: true,
      vaultDir: INBOX_DIR,
      syncedCount: hubEntries.length,
      files: Array.from(generatedFiles),
    };
  } catch (err) {
    console.error('[Obsidian Auto-Sync Error]', err);
    return { ok: false, error: err.message, syncedCount: 0 };
  }
}

// Allow running directly via `node scripts/obsidian_auto_sync.mjs`
if (
  process.argv[1] &&
  process.argv[1].replace(/\\/g, '/').toLowerCase().endsWith('obsidian_auto_sync.mjs')
) {
  const res = syncNotesToObsidian();
  console.log(JSON.stringify(res, null, 2));
}
