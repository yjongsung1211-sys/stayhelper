#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
전사 [1비서실 + 4본부] 에이전트 통합 관제판 & 하나(Hana) 텔레그램 보고기
사용법:
  python scripts/agent_registry.py                  # 콘솔 실시간 상태판
  python scripts/agent_registry.py --report-telegram # 하나가 대표님 텔레그램으로 보고
"""
import argparse
import json
import os
import subprocess
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
try:
    from hermes_env import TELEGRAM_BOT_TOKEN as _TG_TOKEN
except Exception:
    _TG_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", _TG_TOKEN)
TELEGRAM_CHAT_ID = "8971100274"

DIVISIONS = [
    {
        "div": "비서실 직속: 셀하나(CellHana) 운영부",
        "director": "비서실장 하나 직접 관할 (하루 최소 업무 3종 관리·재촉)",
        "staff": [
            ("셀하나 운영 전담원 (앱 :3000·수신함·큐)", "상시/매일", "next\\dist\\bin\\next"),
        ],
    },
    {
        "div": "제1본부: 커머스·웹 본부",
        "director": "커머스·웹 부장 (빌드·1:1접지·재고·결제 검수)",
        "staff": [
            ("웹 개발 담당 (Next.js :3000)", "상시", "next\\dist\\bin\\next"),
            ("재고·링크 순찰 담당", "부팅자동", "patrol_readonly.py"),
            ("DOM 순찰 담당", "온디맨드", "browser_use_auditor.py"),
            ("미국 아비트라지 담당", "온디맨드", "luxury_price_arbitrage_radar.py"),
        ],
    },
    {
        "div": "제2본부: 글로벌 미디어 본부",
        "director": "글로벌 미디어 부장 (SafeZone·0원·버퍼5일·실명0건 검수)",
        "staff": [
            ("3대 외국어 제작 담당", "온디맨드", "produce_6days_languageloop"),
            ("예약·배출 관리 담당", "온디맨드", "auto_drain_languageloop.py"),
            ("지나월드·랩투라이프 전담", "온디맨드", "audit_yt_channels.py"),
        ],
    },
    {
        "div": "제3본부: 그로스·홍보 본부",
        "director": "그로스·홍보 부장 (비낚시·스팸회피·릴스지원 검수)",
        "staff": [
            ("글로벌 커뮤니티 홍보 담당", "온디맨드", "autonomous_direct_promoter.py"),
            ("리드·트렌드·카피 담당", "온디맨드", "build_us_market_intelligence.py"),
        ],
    },
    {
        "div": "제4본부: 전략·재무·보안 본부",
        "director": "전략·재무·보안 부장 (비용0원·토큰만료·센컴/퀀텀↔AIDC분리 검수)",
        "staff": [
            ("로컬 AI 서빙 담당 (Ollama)", "부팅자동", "ollama"),
            ("로컬 AI 학습 담당 (Unsloth)", "부재중/야간", "train_unsloth_qwen.py"),
            ("재무·비용·보안 감사팀", "온디맨드", "audit_all_5_channels.py"),
            ("센컴·퀀텀 리서치팀 (트랙A)", "매일08:30", "morning_deeptech_aidc_briefing.py"),
            ("AIDC 전력 M&A팀 (트랙B)", "매일08:30", "morning_deeptech_aidc_briefing.py"),
        ],
    },
    {
        "div": "제5본부: 신사업 개발부",
        "director": "신사업 개발 부장 (리서치·벤치마킹·이해타산·일일미팅 검수)",
        "staff": [
            ("신사업 발굴·시장검증팀", "온디맨드", "auto_idea_incubator.py"),
            ("고속 MVP 프로토타이핑팀", "매일18:00", "daily_cross_division_sync.py"),
        ],
    },
    {
        "div": "제6본부: 디자인부",
        "director": "디자인 부장 (화이트블랙·바닥접지15%·SafeZone·네온0건 검수)",
        "staff": [
            ("UI/UX·브랜드 디자인팀", "온디맨드", "next\\dist\\bin\\next"),
            ("비주얼·썸네일·검수팀", "온디맨드", "browser_use_auditor.py"),
        ],
    },
]


def get_running_processes():
    ps_cmd = (
        "Get-CimInstance Win32_Process | "
        "Where-Object { $_.Name -match 'python|node|ollama' } | "
        "ForEach-Object { \"$($_.ProcessId)|||$($_.Name)|||$($_.CommandLine)\" }"
    )
    res = subprocess.run(
        ["powershell", "-NoProfile", "-Command", ps_cmd],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    procs = []
    for line in res.stdout.splitlines():
        parts = line.split("|||", 2)
        if len(parts) == 3:
            procs.append({"pid": parts[0].strip(), "name": parts[1].strip(), "cmd": parts[2].strip()})
    return procs


def send_telegram(text: str) -> bool:
    if not TELEGRAM_BOT_TOKEN:
        print("⚠️ TELEGRAM_BOT_TOKEN 미설정")
        return False
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = urllib.parse.urlencode(
        {"chat_id": TELEGRAM_CHAT_ID, "text": text, "parse_mode": "HTML"}
    ).encode("utf-8")
    req = urllib.request.Request(url, data=payload, method="POST")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.status == 200


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--report-telegram", action="store_true", help="Send summary report to CEO Telegram")
    args = parser.parse_args()

    procs = get_running_processes()
    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    print("=" * 88)
    print(f"👑 [1비서실(하나) + 4본부] 전사 에이전트 관제판  |  {now}")
    print("=" * 88)

    tg_lines = [f"👑 <b>[비서실장 하나] 전사 4본부 조직 개편 완료 및 실시간 보고</b>\n🕒 {now}\n"]
    total_run = 0
    total_staff = 0

    for d in DIVISIONS:
        print(f"\n🏢 {d['div']}  —  👔 {d['director']}")
        tg_lines.append(f"<b>▸ {d['div']}</b>\n  👔 {d['director']}")
        for s_name, mode, pattern in d["staff"]:
            total_staff += 1
            matched = [p for p in procs if pattern.lower() in (p["cmd"] + " " + p["name"]).lower()]
            if matched:
                total_run += 1
                badge = "🟢 RUN"
                pids = ",".join(p["pid"] for p in matched[:2])
            else:
                badge = "⚪ IDLE"
                pids = "-"
            print(f"   ├─ {badge:<8} | {s_name:<32} | {mode:<8} | PID: {pids}")
            if matched:
                tg_lines.append(f"  • 🟢 {s_name} ({mode})")

    skills_cnt = len(list((ROOT / ".agent" / "skills").glob("*"))) if (ROOT / ".agent" / "skills").exists() else 0
    tracker_path = ROOT / "data" / "repeat_instruction_tracker.json"
    tracked_cnt = 0
    if tracker_path.exists():
        try:
            tracked_cnt = len(json.loads(tracker_path.read_text(encoding="utf-8")).get("instructions", []))
        except Exception:
            pass

    print("\n" + "=" * 88)
    print(f"📊 요약: 가동 {total_run}/{total_staff} | 전문 스킬 {skills_cnt}개 | 반복 지시 추적 {tracked_cnt}건")
    print("=" * 88)

    if args.report_telegram:
        tg_lines.append(
            f"\n📊 <b>전사 요약</b>: 실시간 가동 {total_run}/{total_staff} · 전문 스킬 {skills_cnt}개\n"
            f"⚡ <i>앞으로 하나가 각 본부 부장을 재촉·관리하고, 2회 이상 반복 지시는 즉시 스킬화하여 텔레그램으로 보고드리겠습니다!</i>"
        )
        ok = send_telegram("\n".join(tg_lines))
        print(f"📲 텔레그램 보고 전송: {'성공' if ok else '실패'}")


if __name__ == "__main__":
    main()
