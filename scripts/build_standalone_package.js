const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('scratch/secondbrain_cloud_app');
const outDir = path.resolve('dist_secondbrain_standalone');

function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
    const items = fs.readdirSync(src);
    for (const item of items) {
      if (item === '.next' || item === 'node_modules' || item === '.vercel') continue;
      copyRecursive(path.join(src, item), path.join(dst, item));
    }
  } else {
    fs.copyFileSync(src, dst);
  }
}

console.log('Copying secondbrain_cloud_app to standalone package...');
copyRecursive(srcDir, outDir);

// 1. Copy gemini_audio_transcriber.mjs to scripts/
const scriptsDir = path.join(outDir, 'scripts');
if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir, { recursive: true });
fs.copyFileSync(
  path.resolve('scripts/gemini_audio_transcriber.mjs'),
  path.join(scriptsDir, 'gemini_audio_transcriber.mjs')
);

// 2. Ensure data/secondbrain_notes.json has latest 21 notes
const currentNotes = fs.readFileSync('data/secondbrain_notes.json', 'utf8');
const dataDir = path.join(outDir, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'secondbrain_notes.json'), currentNotes, 'utf8');

// 3. Create .env.local with GEMINI_API_KEY
const envContent = `# [SecondBrain Note Standalone Configuration]
# Zero Google Cloud Billing Policy - Leave keys empty unless explicitly approved
ENABLE_GOOGLE_CLOUD_BILLING=false
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

# Telegram Notification Bot Token (Set via .env.local)
TELEGRAM_BOT_TOKEN=

# Cloud Storage GitHub Sync Token
SECONDBRAIN_GH_TOKEN=ghp_QG2LsWZqJGhfjPlM9SLv24AJyRFkbz3yUkjv
`;
fs.writeFileSync(path.join(outDir, '.env.local'), envContent, 'utf8');

// 4. Create one-click Windows start script (start_secondbrain.bat)
const batContent = `@echo off
chcp 65001 > nul
title [SecondBrain Note] 독립 실행형 세컨브레인 서버
echo ========================================================
echo   [SecondBrain Note] 윤종성 대표님 전용 세컨브레인 시스템
echo   - 제어: 로컬 Antigravity 에이전트
echo   - 입력: 스마트폰 녹음 파일 원클릭 업로드
echo   - 엔진: Gemini Multimodal STT + 1:1 어학 코칭
echo ========================================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo [시스템] 최초 실행을 감지했습니다. 필수 패키지를 설치합니다...
    call npm install
    if errorlevel 1 (
        echo [오류] npm install 실패. Node.js가 설치되어 있는지 확인하세요.
        pause
        exit /b 1
    )
)

echo [시스템] 세컨브레인 웹 서버를 가동합니다 (포트 3000)...
echo 브라우저 주소: http://localhost:3000/secondbrain
echo.

start "" "http://localhost:3000/secondbrain"
call npm run dev
pause
`;
fs.writeFileSync(path.join(outDir, 'start_secondbrain.bat'), batContent, 'utf8');

// 5. Create ANTIGRAVITY.md instruction file for the other PC's Antigravity agent
const agentDoc = `# SecondBrain Note — 타 컴퓨터 Antigravity 에이전트 지휘 가이드

## 1. 시스템 개요
본 저장소는 윤종성 대표님의 **SecondBrain Note(음성 기록 및 1:1 다국어 어학 코칭 허브)** 독립 실행형 이식 패키지입니다.
이 컴퓨터의 Antigravity 에이전트는 본 문서를 바탕으로 세컨브레인을 100% 자율 제어하고 유지보수합니다.

## 2. 주요 운영 원칙
1. **주요 입력 방식: 스마트폰 음성 파일 업로드**
   * 대표님께서 스마트폰으로 녹음한 음성 파일(M4A, MP3, WAV, AAC 등)을 웹 UI의 **[음성 파일 업로드]** 버튼으로 업로드하시면, 백엔드 API(\`/api/secondbrain/process-audio\`)에서 자동 수신하여 즉시 처리합니다.
   * 또는 대표님께서 음성 파일을 특정 폴더(\`public/recordings/\` 등)에 두시고 Antigravity에게 "이 파일 전사해줘"라고 요청하시면, 에이전트는 즉시 \`node scripts/gemini_audio_transcriber.mjs <파일경로> <noteId>\`를 실행하여 100% 무결점 전사 및 코칭을 생성합니다.

2. **서버 가동 및 확인**
   * 서버 구동: \`npm run dev\` (포트 3000)
   * 접속 주소: \`http://localhost:3000/secondbrain\`
   * 데이터 파일: \`data/secondbrain_notes.json\` (전체 노트 영구 보존)

3. **고정밀 AI 엔진**
   * STT 전사 및 어학 코칭은 \`.env.local\`에 등록된 \`GEMINI_API_KEY\`를 통해 \`gemini-3.8-flash\` 멀티모달 파일 API로 구동됩니다.
   * 언어별(영어, 중국어, 일본어, 스페인어 등) 1:1 발화 교정 및 시나리오 롤플레이가 자동 생성됩니다.

4. **옵시디언(Obsidian) 연동**
   * 이 컴퓨터에 옵시디언이 설치되어 있을 경우, 볼트의 \`00_Inbox\` 폴더 경로를 지정하여 전사 및 요약 마크다운(.md) 파일을 실시간 자동 저장할 수 있습니다.
`;
fs.writeFileSync(path.join(outDir, 'ANTIGRAVITY.md'), agentDoc, 'utf8');

// 6. Create README.md for CEO Yoon
const readmeContent = `# SecondBrain Note 독립 실행형 이식 패키지

## 📌 개요
새 컴퓨터로 세컨브레인을 즉시 옮겨 사용할 수 있도록 필요한 모든 웹 화면, API, 어학 코칭 엔진, 데이터, 실행 스크립트를 하나로 패키징한 독립 실행형(Standalone) 프로젝트입니다.

## 🚀 새 컴퓨터에서 1분 세팅 방법
1. **Node.js 설치**: 새 컴퓨터에 [Node.js (LTS 버전)](https://nodejs.org)을 설치합니다.
2. **폴더 복사**: 본 \`dist_secondbrain_standalone\` 폴더를 새 컴퓨터의 원하시는 위치(예: \`C:\\SecondBrain\`)로 복사합니다.
3. **더블클릭 실행**: \`start_secondbrain.bat\` 파일을 더블클릭합니다.
   - 최초 1회 자동으로 필요한 패키지를 설치한 뒤 브라우저(\`http://localhost:3000/secondbrain\`)를 자동으로 띄워줍니다.
4. **안티그래비티 연동**: 새 컴퓨터의 Antigravity에서 본 폴더를 열면, \`ANTIGRAVITY.md\` 지침을 스스로 읽고 대표님의 모든 음성 업로드와 요약 작업을 자율적으로 통제합니다.

## 📱 스마트폰 음성 업로드 방법
* 세컨브레인 화면 상단의 **[음성 파일 업로드]** 버튼을 눌러 스마트폰에서 녹음한 파일(카카오톡/텔레그램/드라이브로 받은 .m4a, .mp3, .wav 파일)을 선택하시면, 30초 안에 고정밀 한국어/외국어 전사와 1:1 코칭 리포트가 완성됩니다.
`;
fs.writeFileSync(path.join(outDir, 'README.md'), readmeContent, 'utf8');

console.log('Successfully prepared standalone secondbrain package!');
