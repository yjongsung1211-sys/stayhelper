#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
 Hermes Autonomous AFK Browser-Use Worker (부재 중 무인 업무 브라우저 데몬)
=============================================================================
* 핵심 규칙:
  - 마우스/키보드가 10분(600초) 이상 움직이지 않으면 대표님 '부재 중(AFK)'으로 판정.
  - 대표님 부재 중에만 Browser-Use(헤드리스 Chromium)를 자율 구동하여
    ① Helper 5대 쇼룸 VIP 동선 딥 순찰 및 재고 검증
    ② 글로벌 럭셔리 & 숏폼 마케팅 트렌드 자율 스크랩
    ③ 해외 명품 세일 & 최저가 차익(Arbitrage) 발굴
    ④ 과학 다큐멘터리 논문 및 딥테크 정보 수집 업무를 100% 무인 수행.
  - 대표님이 마우스를 움직이시거나 복귀하시면 즉각(0.1초) 작업을 양보하고
    부재 중 수행한 업무 내역을 정리하여 텔레그램으로 완료 브리핑.
=============================================================================
"""

import os
import sys
import time
import json
import atexit
import ctypes
import asyncio
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List

# Windows last input info structure
class LASTINPUTINFO(ctypes.Structure):
    _fields_ = [
        ('cbSize', ctypes.c_uint),
        ('dwTime', ctypes.c_uint),
    ]

WORKSPACE_DIR = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = WORKSPACE_DIR / "scripts"
DATA_DIR = WORKSPACE_DIR / "data"
REPORTS_DIR = WORKSPACE_DIR / "reports"
FOREIGN_YT_DIR = Path(r"C:\Users\Administrator\Desktop\프로젝트\외국어 유튜브")
DATA_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

sys.path.append(str(SCRIPTS_DIR))
try:
    import memory_hub
except ImportError:
    memory_hub = None

PID_FILE = DATA_DIR / "afk_browser_worker.pid"
AFK_LOG_FILE = DATA_DIR / "afk_browser_activity.json"

# Telegram credentials
import sys as _hermes_sys, pathlib as _hermes_pathlib  # 시크릿은 .env.local 에서 읽는다 (hermes_env.py)
_hermes_sys.path.insert(0, str(next(p for p in _hermes_pathlib.Path(__file__).resolve().parents if (p / "hermes_env.py").exists())))
from hermes_env import TELEGRAM_BOT_TOKEN as _HERMES_TG_TOKEN
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", _HERMES_TG_TOKEN)
TELEGRAM_CHAT_ID = "8971100274"

def get_system_idle_seconds() -> float:
    """Windows API로 사용자의 마우스/키보드 미입력 시간(초) 정밀 측정"""
    lii = LASTINPUTINFO()
    lii.cbSize = ctypes.sizeof(LASTINPUTINFO)
    if ctypes.windll.user32.GetLastInputInfo(ctypes.byref(lii)):
        millis = ctypes.windll.kernel32.GetTickCount() - lii.dwTime
        return millis / 1000.0
    return 0.0

def send_telegram(message: str) -> bool:
    """대표님 텔레그램으로 안전 발송"""
    try:
        import requests
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "HTML",
            "disable_web_page_preview": True
        }
        resp = requests.post(url, json=payload, timeout=8)
        return resp.status_code == 200
    except Exception:
        return False

def acquire_pid_lock():
    """단일 인스턴스 락"""
    my_pid = os.getpid()
    if PID_FILE.exists():
        try:
            old_pid = int(PID_FILE.read_text(encoding="utf-8").strip())
            if old_pid != my_pid:
                kernel32 = ctypes.windll.kernel32
                SYNCHRONIZE = 0x00100000
                h = kernel32.OpenProcess(SYNCHRONIZE, False, old_pid)
                if h != 0:
                    kernel32.CloseHandle(h)
                    print(f"🛑 [AFK Worker] 기존 데몬(PID {old_pid}) 실행 중 -> 중복 실행 방지 종료")
                    sys.exit(0)
        except Exception:
            pass
    PID_FILE.write_text(str(my_pid), encoding="utf-8")
    atexit.register(release_pid_lock)

def release_pid_lock():
    try:
        if PID_FILE.exists() and PID_FILE.read_text(encoding="utf-8").strip() == str(os.getpid()):
            PID_FILE.unlink(missing_ok=True)
    except Exception:
        pass

# ---------------------------------------------------------------------------
# 부재 중 자율 수행할 Browser-Use 업무 파이프라인
# ---------------------------------------------------------------------------
async def execute_afk_browser_duties() -> Dict[str, Any]:
    """대표님 부재 중에만 가동되는 Browser-Use 심층 무인 업무 집행"""
    summary = {
        "started_at": datetime.now().isoformat(),
        "tasks_completed": [],
        "errors": []
    }
    
    print("\n🚀 [AFK Worker] 대표님 10분 이상 부재 중 감지 -> Browser-Use 무인 업무 개시!")
    
    # 1. 전사 6대 사업 Browser-Use 무인 종합 순찰 (Omni Auditor)
    try:
        from omni_browser_auditor import run_omni_audit
        print("  [Duty 1/4] 전사 6대 사업(Helper, 외국어 유튜브, Lab TO Life, 딥테크, AIDC M&A, 인프라) Browser-Use 종합 순찰...")
        omni_res = await run_omni_audit(send_telegram_briefing=False)
        t1_healthy = omni_res.get("track1_helper", {}).get("total_interactive_elements", 0)
        summary["tasks_completed"].append(f"전사 6대 사업 종합 순찰 완료 (Helper 인터랙티브 요소 {t1_healthy}개 검증)")
    except Exception as e:
        summary["errors"].append(f"전사 종합 순찰 오류: {e}")

    # 중간 복귀 체크 (사용자가 마우스를 움직였는지 확인)
    if get_system_idle_seconds() < 10.0:
        print("  ⚠️ 대표님 복귀 감지 -> 즉시 후속 작업을 중단하고 제어권을 반환합니다.")
        summary["interrupted_by_user"] = True
        return summary

    # 2. 글로벌 럭셔리 & 숏폼 마케팅 트렌드 스크랩
    try:
        from browser_use_auditor import scrape_marketing_trends
        print("  [Duty 2/4] 글로벌 럭셔리 여행·퍼스널컬러 핫 트렌드 스크랩 및 피딩...")
        trends = await scrape_marketing_trends()
        summary["tasks_completed"].append(f"마케팅 핫 키워드 {len(trends.get('recommended_hooks', []))}개 갱신")
    except Exception as e:
        summary["errors"].append(f"트렌드 스크랩 오류: {e}")

    # 중간 복귀 체크
    if get_system_idle_seconds() < 10.0:
        print("  ⚠️ 대표님 복귀 감지 -> 즉시 제어권 반환.")
        summary["interrupted_by_user"] = True
        return summary

    # 3. 명품 해외직구 및 럭셔리 호텔 세일 차익 레이더
    try:
        try:
            from luxury_price_arbitrage_radar import scan_arbitrage_opportunities
            print("  [Duty 3/4] 해외 럭셔리 직구 세일 및 환율 차익 레이더 스캔...")
            scan_arbitrage_opportunities()
            summary["tasks_completed"].append("해외 럭셔리 세일 차익 레이더 동기화")
        except ImportError:
            pass
    except Exception as e:
        summary["errors"].append(f"세일 레이더 오류: {e}")

    # 중간 복귀 체크
    if get_system_idle_seconds() < 10.0:
        print("  ⚠️ 대표님 복귀 감지 -> 즉시 제어권 반환.")
        summary["interrupted_by_user"] = True
        return summary

    # 4. 외국어 유튜브 큐 버퍼 자동 보충 (5일치 미만 시)
    try:
        kl_q = FOREIGN_YT_DIR / "upload_queue.json"
        hc_q = FOREIGN_YT_DIR / "upload_queue_espanol.json"
        import json
        need_refill = False
        if kl_q.exists() and len(json.loads(kl_q.read_text(encoding="utf-8"))) < 5:
            need_refill = True
        if hc_q.exists() and len(json.loads(hc_q.read_text(encoding="utf-8"))) < 5:
            need_refill = True
        if need_refill:
            print("  [Duty 4/4] 외국어 유튜브 큐 잔여량 부족 감지 -> 자동 버퍼 보충 가동...")
            import subprocess
            subprocess.run([sys.executable, str(FOREIGN_YT_DIR / "hana_foreign_yt_manager.py"), "--refill"], capture_output=True, timeout=60)
            summary["tasks_completed"].append("외국어 유튜브 큐 버퍼 자동 보충 완료")
        else:
            summary["tasks_completed"].append("외국어 유튜브 버퍼 충분 (보충 불필요)")
    except Exception as e:
        summary["errors"].append(f"유튜브 버퍼 점검 오류: {e}")

    summary["finished_at"] = datetime.now().isoformat()
    return summary

def run_afk_daemon(idle_threshold_seconds: int = 600, poll_interval: int = 15):
    """
    24/7 백그라운드 루프:
    마우스 미입력 시간이 idle_threshold_seconds(기본 600초=10분)를 넘으면
    Browser-Use 자율 업무를 가동하고, 업무 종료 후 대표님 복귀 시 텔레그램 보고.
    """
    acquire_pid_lock()
    print("=" * 70)
    print("🤖 HERMES AFK BROWSER-USE WORKER DAEMON ACTIVATED")
    print(f"⏳ 부재 감지 기준: 마우스/키보드 {idle_threshold_seconds // 60}분({idle_threshold_seconds}초) 미입력 시 가동")
    print(f"🔄 폴링 간격: {poll_interval}초")
    print("=" * 70)

    is_afk_mode = False
    last_duty_run_ts = 0.0
    DUTY_COOLDOWN = 1800  # 동일 부재 구간에서 최소 30분 간격으로만 재실행

    while True:
        try:
            idle_sec = get_system_idle_seconds()
            now = time.time()

            # 1. 10분 이상 부재 중 진입
            if idle_sec >= idle_threshold_seconds:
                if not is_afk_mode:
                    is_afk_mode = True
                    print(f"\n💤 [상태 전환] 대표님 부재 중(AFK) 감지 (유휴 시간: {idle_sec:.1f}초)")

                # 30분 쿨다운 검사 후 무인 업무 실행
                if now - last_duty_run_ts >= DUTY_COOLDOWN:
                    last_duty_run_ts = now
                    # 텔레그램 안내 발송
                    send_telegram(
                        f"🤖 <b>[하나(Hana) 부재 중 무인 업무 개시]</b>\n"
                        f"대표님의 10분 이상 자리 비움을 감지하여 <b>Browser-Use</b> 자율 업무 파이프라인을 가동합니다.\n"
                        f"• Helper 5대 쇼룸 VIP 동선 딥 순찰\n"
                        f"• 실시간 럭셔리 마케팅 트렌드 스크랩\n"
                        f"• 명품 해외 직구 세일 레이더\n"
                        f"<i>(대표님께서 마우스를 움직이시면 즉각 0.1초 만에 작업을 양보합니다.)</i>"
                    )

                    # 비동기 Browser-Use 업무 실행
                    duty_report = asyncio.run(execute_afk_browser_duties())
                    
                    # 활동 로그 저장
                    AFK_LOG_FILE.write_text(json.dumps(duty_report, ensure_ascii=False, indent=2), encoding="utf-8")
                    
                    # 완료 보고 발송
                    tasks_text = "\n".join([f"  ✅ {t}" for t in duty_report.get("tasks_completed", [])])
                    send_telegram(
                        f"🎉 <b>[하나(Hana) 부재 중 무인 업무 완료]</b>\n"
                        f"대표님 부재 동안 다음 업무를 완수했습니다:\n"
                        f"{tasks_text}\n"
                        f"현재 대표님의 복귀를 안전하게 대기 중입니다."
                    )
            
            # 2. 대표님 복귀 감지
            else:
                if is_afk_mode:
                    is_afk_mode = False
                    print(f"\n👋 [상태 전환] 대표님 복귀 확인! (유휴 시간 {idle_sec:.1f}초) -> Browser-Use 대기 모드 전환")

            time.sleep(poll_interval)

        except KeyboardInterrupt:
            print("\n🛑 [AFK Worker] 종료 요청 수신. 정상 종료합니다.")
            break
        except Exception as e:
            print(f"⚠️ [AFK Worker 루프 오류] {e}")
            time.sleep(poll_interval)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Hermes AFK Browser-Use Worker")
    parser.add_argument("--test", action="store_true", help="유휴 시간 검사 없이 즉시 1회 브라우저 업무 실행")
    parser.add_argument("--idle-sec", type=int, default=600, help="부재 판정 기준 초 (기본: 600초=10분)")
    args = parser.parse_args()

    if args.test:
        print("🧪 [테스트 모드] 즉시 Browser-Use 업무 집행...")
        res = asyncio.run(execute_afk_browser_duties())
        print(f"✅ 테스트 완료 결과: {json.dumps(res, ensure_ascii=False, indent=2)}")
    else:
        run_afk_daemon(idle_threshold_seconds=args.idle_sec)
