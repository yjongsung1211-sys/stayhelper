import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_INDEX_FILE = path.join(process.cwd(), 'data', 'vault_documents_index.json');
const VAULT_ROOT_DIR = 'C:\\Users\\Administrator\\Desktop\\1인기업_세컨브레인_Vault';

interface VaultDoc {
  id: string;
  filename: string;
  title: string;
  category: string;
  subCategory?: string;
  date: string;
  mtime: number;
  length: number;
  tags: string[];
  preview: string;
  content?: string;
}

function loadVaultDocs(): VaultDoc[] {
  try {
    if (fs.existsSync(DATA_INDEX_FILE)) {
      const raw = fs.readFileSync(DATA_INDEX_FILE, 'utf8');
      return JSON.parse(raw) as VaultDoc[];
    }
  } catch (err) {
    console.error('Failed to load vault index:', err);
  }
  return [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const category = (searchParams.get('category') || '').trim();
  const docId = searchParams.get('doc_id') || '';

  const allDocs = loadVaultDocs();

  // 1. 단일 문서 상세 조회 (리더기용)
  if (docId) {
    const found = allDocs.find((d) => d.id === docId || d.filename === docId);
    if (found) {
      // 로컬 파일이 있으면 최신 파일 직접 읽기
      try {
        const localPath = path.join(VAULT_ROOT_DIR, found.id.replace(/\//g, path.sep));
        if (fs.existsSync(localPath)) {
          const freshContent = fs.readFileSync(localPath, 'utf8');
          return NextResponse.json({ doc: { ...found, content: freshContent } });
        }
      } catch {}
      return NextResponse.json({ doc: found });
    }
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  // 2. 검색 및 카테고리 필터링
  let filtered = allDocs;

  if (category && category !== '전체' && category !== 'ALL') {
    filtered = filtered.filter((d) => d.category === category || d.subCategory === category);
  }

  if (q) {
    const tokens = q
      .replace(/[?.,!~"'()\[\]]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 1);

    filtered = filtered
      .map((doc) => {
        let score = 0;
        const hayTitle = (doc.title || '').toLowerCase();
        const hayFilename = (doc.filename || '').toLowerCase();
        const hayPreview = (doc.preview || '').toLowerCase();
        const hayTags = (doc.tags || []).join(' ').toLowerCase();

        for (const tk of tokens) {
          if (hayTitle.includes(tk)) score += 10;
          if (hayFilename.includes(tk)) score += 8;
          if (hayTags.includes(tk)) score += 6;
          if (hayPreview.includes(tk)) score += 3;
        }

        return { doc, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.doc.mtime - a.doc.mtime)
      .map((item) => {
        const { content, ...rest } = item.doc;
        return rest;
      });
  } else {
    // 검색어가 없으면 content 제외하고 최근 순으로 50개 반환
    filtered = filtered.slice(0, 60).map((d) => {
      const { content, ...rest } = d;
      return rest;
    });
  }

  // 카테고리 목록 집계
  const categoryCounts: Record<string, number> = {};
  for (const d of allDocs) {
    const cat = d.category || '기타';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  return NextResponse.json({
    total: allDocs.length,
    resultsCount: filtered.length,
    categories: categoryCounts,
    docs: filtered,
  });
}

// 3. 스마트폰 공유(Share Target) 수신 및 즉시 스크랩 저장 POST 엔드포인트
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sharedUrl = (body.url || '').trim();
    const sharedText = (body.text || '').trim();
    const sharedTitle = (body.title || '').trim();

    const targetUrl =
      sharedUrl ||
      (sharedText.match(/https?:\/\/[^\s]+/) ? sharedText.match(/https?:\/\/[^\s]+/)![0] : '');

    if (!targetUrl && !sharedText) {
      return NextResponse.json({ error: 'URL or text is required' }, { status: 400 });
    }

    // Python article_saver 호출하여 옵시디언 00_Inbox에 저장
    const { execFileSync } = await import('child_process');
    const pythonScript = path.join(process.cwd(), 'scripts', 'article_saver.py');

    let output = '';
    if (targetUrl) {
      output = execFileSync(
        'python',
        [
          '-c',
          `import sys; sys.path.append('scripts'); from article_saver import scrape_and_save_to_vault; print(scrape_and_save_to_vault('${targetUrl}', '모바일 공유하기 즉시 수신'))`,
        ],
        { cwd: process.cwd(), encoding: 'utf8', timeout: 15000 }
      );
    } else {
      // URL 없는 순수 텍스트 공유인 경우
      output = execFileSync(
        'python',
        [
          '-c',
          `import sys; sys.path.append('scripts'); from telegram_obsidian_bridge import save_telegram_memo; print(save_telegram_memo('모바일 공유: ${sharedText.replace(/'/g, "\\'")}', '윤종성 대표'))`,
        ],
        { cwd: process.cwd(), encoding: 'utf8', timeout: 15000 }
      );
    }

    // 인덱스 실시간 갱신 백그라운드 호출
    try {
      execFileSync('python', [path.join(process.cwd(), 'scripts', 'build_vault_index.py')], {
        cwd: process.cwd(),
        encoding: 'utf8',
        timeout: 8000,
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: output.trim(),
      url: targetUrl,
      title: sharedTitle,
    });
  } catch (err: any) {
    console.error('Share Target handler error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
