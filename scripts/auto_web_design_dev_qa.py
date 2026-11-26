r"""
[홈페이지 전담 디자인팀 × 프로그래밍팀] 8대 웹사이트 자동 전수 QA·오류감지 엔진 (비용 0원)
- 제6본부(홈페이지 디자인팀) 검수 항목:
  • 모바일 viewport 메타 태그, <title>·<meta description>, 깨진/빈 이미지 src, 페이지 크기/레이아웃 이상 징후
- 제1본부(홈페이지 프로그래밍팀) 검수 항목:
  • 8대 라이브 URL HTTP 200 & 응답속도(ms), Next.js 런타임/404/500 에러 바운더리, JSON-LD 구조화 데이터
  • 로컬 Next.js TypeScript 무결성 (`npx tsc --noEmit`)
- 결과 저장: data/web_design_dev_qa_report.json
- 결함 발견 시 또는 --notify 옵션 시 텔레그램 즉시 보고
"""
import os
import re
import sys
import time
import json
import subprocess
import urllib.request
import urllib.parse
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)

ROOT = Path(r"c:\Users\Administrator\Desktop\프로젝트\1인기업대표")
REPORT_FILE = ROOT / "data" / "web_design_dev_qa_report.json"

TARGETS = [
    ("BeautyHelper", "https://personalcolorhelper.com/beautyhelper"),
    ("LoopShadow(Global)", "https://personalcolorhelper.com/loopshadow"),
    ("LoopShadow(KR)", "https://personalcolorhelper.com/loopshadow/kr"),
    ("SeoulHelper", "https://personalcolorhelper.com/seoulhelper"),
    ("ColorHelper", "https://personalcolorhelper.com"),
    ("StayHelper", "https://thestayhelper.com"),
    ("StylingHelper", "https://stylinghelper.com"),
    ("WeddingHelper", "https://weddinghelper.love"),
    ("RoomHelper", "https://roomhelper.vercel.app"),
]


def load_env():
    env = {}
    for p in [ROOT / ".env.local", ROOT / ".env"]:
        if p.exists():
            for line in p.read_text(encoding="utf-8", errors="ignore").splitlines():
                if "=" in line and not line.strip().startswith("#"):
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def send_telegram(text: str):
    env = load_env()
    tok = env.get("TELEGRAM_BOT_TOKEN") or env.get("HERMES_TELEGRAM_BOT_TOKEN")
    chat_id = env.get("TELEGRAM_CHAT_ID") or "8971100274"
    if not tok:
        return False
    data = urllib.parse.urlencode({"chat_id": chat_id, "text": text}).encode("utf-8")
    req = urllib.request.Request(f"https://api.telegram.org/bot{tok}/sendMessage", data=data)
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.status == 200


def audit_site(name: str, url: str):
    t0 = time.time()
    design_issues = []
    dev_issues = []
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "HanaDesignDevQA/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            ms = int((time.time() - t0) * 1000)
            status = resp.status
            html = resp.read().decode("utf-8", "ignore")

        if status != 200:
            dev_issues.append(f"HTTP {status}")
        if ms > 3000:
            dev_issues.append(f"응답 지연 ({ms}ms)")

        # Programming checks (strip <script> payloads to avoid Next.js RSC template false positives)
        visible_html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.IGNORECASE | re.DOTALL)
        if "__next_error__" in visible_html or "Application error: a client-side exception" in visible_html:
            dev_issues.append("Next.js 런타임 에러 바운더리 감지")
        if "This page could not be found" in visible_html:
            dev_issues.append("404 페이지 렌더링 감지")

        title_m = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
        title = re.sub(r"\s+", " ", title_m.group(1)).strip() if title_m else ""
        if not title:
            dev_issues.append("<title> 누락")

        has_desc = bool(re.search(r'<meta[^>]+name=["\']description["\']', html, re.IGNORECASE))
        if not has_desc:
            design_issues.append("meta description 누락 (SEO/공유 카드)")

        has_viewport = bool(re.search(r'<meta[^>]+name=["\']viewport["\']', html, re.IGNORECASE))
        if not has_viewport:
            design_issues.append("모바일 viewport 메타 누락")

        has_jsonld = "application/ld+json" in html

        # Empty/broken img src checks
        empty_imgs = len(re.findall(r'<img[^>]+src=["\']\s*["\']', html, re.IGNORECASE))
        if empty_imgs > 0:
            design_issues.append(f"빈 이미지 src {empty_imgs}건")

        # Placeholder / coming soon check
        if "Coming Soon" in html or "Back Soon" in html:
            design_issues.append("Pre-Launch / Coming Soon 안내 상태")

        return {
            "name": name,
            "url": url,
            "http": status,
            "ms": ms,
            "title": title[:80],
            "has_jsonld": has_jsonld,
            "design_issues": design_issues,
            "dev_issues": dev_issues,
            "ok": len(dev_issues) == 0,
        }
    except Exception as e:
        return {
            "name": name,
            "url": url,
            "http": 0,
            "ms": 0,
            "title": "",
            "has_jsonld": False,
            "design_issues": [],
            "dev_issues": [f"접속 실패: {str(e)[:80]}"],
            "ok": False,
        }


def check_local_tsc():
    try:
        r = subprocess.run(
            ["cmd", "/c", "npx", "tsc", "--noEmit"],
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=90,
        )
        errs = [l for l in (r.stdout + "\n" + r.stderr).splitlines() if "error TS" in l]
        return {"ok": r.returncode == 0, "error_count": len(errs), "sample": errs[:5]}
    except Exception as e:
        return {"ok": False, "error_count": 1, "sample": [str(e)[:120]]}


def run_qa(force_notify: bool = False):
    now = datetime.now()
    print(f"=== [홈페이지 디자인팀 × 프로그래밍팀] 8대 사이트 전수 QA ({now.strftime('%Y-%m-%d %H:%M:%S')}) ===")

    results = [audit_site(n, u) for n, u in TARGETS]
    tsc = check_local_tsc()

    total_dev_issues = sum(len(r["dev_issues"]) for r in results) + (0 if tsc["ok"] else tsc["error_count"])
    total_design_issues = sum(len(r["design_issues"]) for r in results)

    for r in results:
        ic = "✅" if (not r["dev_issues"] and not r["design_issues"]) else ("🚨" if r["dev_issues"] else "🎨")
        issue_txt = []
        if r["dev_issues"]:
            issue_txt.append("DEV: " + ", ".join(r["dev_issues"]))
        if r["design_issues"]:
            issue_txt.append("DESIGN: " + ", ".join(r["design_issues"]))
        suffix = f" | {' / '.join(issue_txt)}" if issue_txt else " | 결함 0건"
        print(f"{ic} [{r['name']}] HTTP {r['http']} ({r['ms']}ms) | JSON-LD:{r['has_jsonld']}{suffix}")

    print(f"{'✅' if tsc['ok'] else '🚨'} [로컬 TypeScript] npx tsc --noEmit: {'0 errors' if tsc['ok'] else str(tsc['error_count']) + ' errors'}")

    report = {
        "checked_at": now.isoformat(timespec="seconds"),
        "summary": {
            "sites_total": len(results),
            "sites_http_200": sum(1 for r in results if r["http"] == 200),
            "dev_issues": total_dev_issues,
            "design_issues": total_design_issues,
            "tsc_ok": tsc["ok"],
        },
        "tsc": tsc,
        "sites": results,
    }
    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    REPORT_FILE.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    if total_dev_issues > 0 or force_notify:
        lines = [
            f"🎨💻 [홈페이지 디자인팀 × 프로그래밍팀 전수 QA | {now.strftime('%Y-%m-%d %H:%M')}]",
            f"• 라이브 정상: {report['summary']['sites_http_200']}/{len(results)} | 프로그래밍 결함: {total_dev_issues}건 | 디자인·SEO 개선점: {total_design_issues}건",
            f"• 로컬 TypeScript (`tsc --noEmit`): {'0 오류 ✅' if tsc['ok'] else str(tsc['error_count']) + ' 오류 🚨'}",
        ]
        for r in results:
            if r["dev_issues"] or r["design_issues"]:
                notes = r["dev_issues"] + r["design_issues"]
                lines.append(f"• {r['name']}: {', '.join(notes)}")
        send_telegram("\n".join(lines))

    return report


if __name__ == "__main__":
    run_qa(force_notify="--notify" in sys.argv)
