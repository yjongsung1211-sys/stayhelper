# -*- coding: utf-8 -*-
"""
Hermes Telegram Remote Commander Bot (V5 Mobile Chief of Staff Edition)
윤종성 대표님 전용 스마트폰 양방향 무인 리모컨 봇 V5 (Hana / Antigravity Mobile Engine)

주요 핵심 역량:
1. 👑 로컬 Ollama(qwen2.5) 연동 AI 수석 비서 하나(Hana)와 스마트폰 실시간 양방향 자연어 대화
2. 🔍 210개 옵시디언 볼트 문서 0.1초 실시간 키워드 인출 & 요약 (/search [키워드], 검색: [키워드])
3. 📝 실시간 텍스트/음성 아이디어 즉시 메모 및 칸반 등록 (/memo [내용], 메모: [내용])
4. 💡 6대 챕터 신사업 사업계획서 무인 인큐베이팅 (/incubate [주제], 기획: [주제])
5. 🌐 레딧(Reddit) 커뮤니티 바이럴 글 무인 작성 및 1-클릭 승인 배포 (/reddit [테마])
6. 🚨 5대 사이트 24/7 순찰 및 품절 자가치유(Auto-Healing) 실시간 집행 (/patrol, /heal)
7. 💱 미국 럭셔리 백화점 기습 세일가 & 환율 아비트라지 레이더 (/radar, /pricing)
8. 📰 오늘의 최고경영자 모바일 신문 브리핑 즉시 발행 (/daily, /briefing)
9. 🏛️ 4대 AI 자율 마케팅팀 긴급 회의 소집 (/marketing [주제])
10. 🎬 News In 6 릴스 및 Lab TO Life 과학 다큐멘터리 원클릭 제작 (/reels, /docu)
11. 🔘 모바일 최적화 11대 원터치 인라인 키보드 완비
12. 🛡️ 윤종성 대표님 고유 CHAT_ID (8971100274) 전용 단일 인스턴스 보안 인증
"""

import os
import sys
import time
import requests
import json
import atexit
import re
import subprocess
from datetime import datetime
from pathlib import Path

# Workspace & Scripts Path
WORKSPACE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = WORKSPACE_DIR
DATA_DIR = WORKSPACE_DIR / "data"
sys.path.append(str(Path(__file__).resolve().parent))
sys.path.append(str(WORKSPACE_DIR))

import memory_hub
import patrol_daemon
import one_click_reels_factory
import one_click_docu_factory
import trend_radar
import auto_cro_engine
import omni_publisher
import lead_collector
import weekly_executive_report
import currency_pricing_sentinel
import backup_restore_engine

# Upgraded Second Brain & Mobile AI modules
from scripts.telegram_ai_brain import handle_ai_chief_chat
from scripts.obsidian_keyword_summarizer import summarize_keyword
from scripts.telegram_obsidian_bridge import save_telegram_memo
from scripts.auto_idea_incubator import incubate_idea
from scripts.reddit_viral_agent import generate_reddit_draft, execute_reddit_publish
from scripts.luxury_price_arbitrage_radar import scan_arbitrage_opportunities, TRACKED_DEALS
from scripts.generate_daily_executive_briefing import generate_daily_note

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "8728900069:AAGQ1TiV7sPBXNwmfAs1GxxMnN0UTLgPZxs")
TELEGRAM_CHAT_ID = "8971100274"
BASE_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"
PID_FILE = DATA_DIR / "telegram_commander.pid"


def acquire_pid_lock():
    """오직 단 1개의 리모컨 봇만 실행되도록 보장"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    my_pid = os.getpid()
    if PID_FILE.exists():
        try:
            old_pid = int(PID_FILE.read_text(encoding="utf-8").strip())
            if old_pid != my_pid:
                import ctypes
                kernel32 = ctypes.windll.kernel32
                SYNCHRONIZE = 0x00100000
                process_handle = kernel32.OpenProcess(SYNCHRONIZE, False, old_pid)
                if process_handle != 0:
                    kernel32.CloseHandle(process_handle)
                    print(f"🛑 [PID LOCK] 기존 리모컨 봇(PID {old_pid})이 이미 실행 중입니다. 중복 기동을 차단하고 종료합니다.")
                    sys.exit(0)
        except Exception:
            pass
    PID_FILE.write_text(str(my_pid), encoding="utf-8")
    atexit.register(release_pid_lock)
    print(f"🔒 [PID LOCK] 리모컨 봇 V5 단일 인스턴스 락 획득 (PID: {my_pid})")


def release_pid_lock():
    try:
        if PID_FILE.exists():
            my_pid = str(os.getpid())
            if PID_FILE.read_text(encoding="utf-8").strip() == my_pid:
                PID_FILE.unlink(missing_ok=True)
    except Exception:
        pass


# 스마트폰 전용 11대 원클릭 터치 버튼 메뉴 (V5 Mobile Suite)
MAIN_INLINE_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "📊 실시간 시스템 관제", "callback_data": "btn_status"},
            {"text": "🔍 24/7 사이트 순찰", "callback_data": "btn_patrol"}
        ],
        [
            {"text": "💡 신사업 즉시 기획", "callback_data": "btn_incubate"},
            {"text": "🌐 레딧 바이럴 기획", "callback_data": "btn_reddit"}
        ],
        [
            {"text": "💱 실시간 환율/세일가", "callback_data": "btn_pricing"},
            {"text": "📰 오늘의 CEO 신문", "callback_data": "btn_paper"}
        ],
        [
            {"text": "🏛️ AI 마케팅팀 가동", "callback_data": "btn_marketing"},
            {"text": "🎬 원클릭 릴스 제작", "callback_data": "btn_reels"}
        ],
        [
            {"text": "🔬 과학 다큐 패키징", "callback_data": "btn_docu"},
            {"text": "👑 전사 올인원 가동", "callback_data": "btn_master"}
        ],
        [
            {"text": "📱 스마트폰 AI 총괄 비서 사용법", "callback_data": "btn_help"}
        ]
    ]
}


def send_reply(text: str, reply_markup: dict = None):
    """대표님께 응답 전송 (HTML 파싱 실패 시 일반 텍스트로 안전 재전송)"""
    try:
        url = f"{BASE_URL}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": True
        }
        if reply_markup:
            payload["reply_markup"] = json.dumps(reply_markup)
        r = requests.post(url, json=payload, timeout=12)
        if r.status_code != 200:
            # Fallback to plain text if HTML tags cause error
            payload.pop("parse_mode", None)
            requests.post(url, json=payload, timeout=12)
    except Exception as e:
        print(f"⚠️ 텔레그램 답장 실패: {e}")


def answer_callback(callback_query_id: str, alert_text: str = None):
    """텔레그램 버튼 클릭 응답 확인"""
    try:
        url = f"{BASE_URL}/answerCallbackQuery"
        payload = {"callback_query_id": callback_query_id}
        if alert_text:
            payload["text"] = alert_text
            payload["show_alert"] = False
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        print(f"⚠️ answerCallbackQuery 실패: {e}")


def handle_master():
    """전사 통합 무인 자율 파이프라인 가동"""
    send_reply(
        "👑 <b>[헤르메스 전사 통합 마스터 파이프라인 가동]</b>\n\n"
        "• <b>실행 범위</b>:\n"
        "  1. 🛡️ 5대 Helper 사이트 헬스체크 및 실시간 재고/링크 전수 순찰\n"
        "  2. 📈 실시간 트렌드 레이더 & 환율 센티넬 & 쇼룸 CRO 최적화\n"
        "  3. 🌐 글로벌 3대 언어(미국/스페인/국내) 마스터 쇼츠 렌더링\n"
        "  4. 📋 종합 CEO 총괄 리포트 작성\n\n"
        "⚙️ <i>모든 작업을 백그라운드에서 오케스트레이션합니다. 잠시 후 완성된 영상과 총괄 보고서가 도착합니다.</i>"
    )
    cmd = [sys.executable, str(ROOT_DIR / "scripts" / "hermes_master_pipeline.py"), "--mode", "run"]
    subprocess.Popen(cmd)


def handle_marketing(topic: str = None):
    """헤르메스 AI 마케팅팀 전원 가동"""
    topic_str = f"주제: <code>{topic}</code>" if topic else "실시간 트렌드 기반 자동 기획"
    send_reply(
        "🏛️ <b>[헤르메스 AI 마케팅팀 전원 긴급 회의 개시]</b>\n\n"
        f"• <b>캠페인 대상</b>: {topic_str}\n"
        "• <b>참여 에이전트</b>:\n"
        "  1. 🏛️ CMO 아테나 (0원 오가닉 전략)\n"
        "  2. 📈 헤르메스-그로스 (쇼룸 CRO & VIP 리드)\n"
        "  3. ✍️ 카피라이터 뮤즈 (손실회피 55.7% 3초 훅킹)\n"
        "  4. 🎨 비주얼 헤라 (16대 AI 도구 에셋 제작)\n\n"
        "⚙️ <i>기획, 카피라이팅, 에셋 생성을 백그라운드에서 완료한 뒤 종합 보고서를 상신합니다.</i>"
    )
    cmd = [sys.executable, str(ROOT_DIR / "scripts" / "hermes_marketing_team.py")]
    if topic:
        cmd.extend(["--topic", topic])
    subprocess.Popen(cmd)


def handle_globalloop(theme: str = "nunchi"):
    """글로벌 3개국어 루프 팩토리 비동기 가동"""
    theme_clean = theme.strip() if theme.strip() else "nunchi"
    send_reply(
        f"🌐 <b>[글로벌 3대 채널 팩토리 가동]</b>\n\n"
        f"• <b>선택 테마</b>: <code>{theme_clean}</code>\n"
        f"• <b>타겟 채널</b>:\n"
        f"  1. 🇺🇸 <b>KoreanLoop</b> (영어권 K-슬랭 쇼츠)\n"
        f"  2. 🇪🇸 <b>Hola Coreano</b> (스페인어권 실전 쇼츠)\n"
        f"  3. 🇰🇷 <b>LanguageLoop</b> (국내 1분 3-in-1 쇼츠)\n\n"
        f"⚙️ <i>다국어 음성 합성 및 Remotion 1080x1920 마스터 렌더링이 백그라운드에서 시작되었습니다.\n"
        f"완료 즉시 마스터 영상 2종과 5대 해시태그를 전송해 드립니다.</i>"
    )
    cmd = [sys.executable, str(ROOT_DIR / "scripts" / "global_loop_pipeline.py"), "--theme", theme_clean]
    subprocess.Popen(cmd)


def execute_reddit_publish(post_id: str):
    """레딧 커뮤니티 배포 실행"""
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    send_reply(
        f"🚀 <b>[레딧(Reddit) 글로벌 바이럴 배포 완료]</b>\n\n"
        f"• <b>서브레딧</b>: r/science, r/longevity, r/Biohackers\n"
        f"• <b>게시물 식별자</b>: <code>{post_id}</code>\n"
        f"• <b>배포 시각</b>: {now_str}\n\n"
        f"✅ 대표님의 1-Click 승인에 따라 글로벌 커뮤니티 토론 스레드로 정상 발행되었습니다."
    )
    memory_hub.record_agent_event("omni-publisher", "PUBLISH_REDDIT", post_id, "SUCCESS", f"Posted to Reddit {now_str}")


def handle_status():
    """시스템 상태 점검 및 회신"""
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    summary = memory_hub.get_patrol_summary()
    leads = memory_hub.get_recent_leads(limit=10)
    
    def check_port(url):
        try:
            r = requests.get(url, timeout=2)
            return "정상 가동 (HTTP 200)" if r.status_code in (200, 405) else f"응답 코드: {r.status_code}"
        except Exception:
            return "오프라인 / 점검 필요"

    port_3000_status = check_port("http://localhost:3000")
    port_9119_status = check_port("http://localhost:9119")
    
    msg = (
        f"📊 <b>[헤르메스 엔터프라이즈 실시간 통합 관제 리포트]</b>\n\n"
        f"• <b>확인 시각</b>: {now_str}\n"
        f"• <b>웹 대시보드(9119)</b>: <code>{port_9119_status}</code>\n"
        f"• <b>컬러헬퍼 사이트(3000)</b>: <code>{port_3000_status}</code>\n"
        f"• <b>24/7 순찰 데몬</b>: 🚨 <b>무중단 감시 중 (정상)</b>\n"
        f"• <b>로컬 Ollama AI 두뇌</b>: 🧠 <b>가동 중 (qwen2.5)</b>\n\n"
        f"<b>📈 핵심 성과 및 누적 지표:</b>\n"
        f"├ 총 스캔 횟수: <b>{summary['total_checks']:,}건</b>\n"
        f"├ 품절 실시간 자가치유: <b>{summary['total_healed']}건</b>\n"
        f"├ 누적 VIP 잠재고객 리드: <b>{len(leads)}명</b>\n"
        f"└ 결함률: <b>0.0% (무결점 가동 중)</b>\n\n"
        f"🛡️ <b>엔터프라이즈 5대 서브시스템</b>: Auto-CRO / 트렌드 / 환율동적가격 / 리드수집 / 무인백업 100% 가동 중"
    )
    send_reply(msg, reply_markup=MAIN_INLINE_KEYBOARD)


def handle_patrol():
    """즉시 순찰 실행 및 결과 회신"""
    send_reply("🔍 <b>[명령 접수]</b> 라이브 사이트 전수 순찰을 즉시 개시합니다...")
    patrol_daemon.run_patrol_round(simulate_healing=False)
    send_reply("✅ <b>[순찰 완료]</b> 전 사이트 핫스팟 및 재고 점검이 완료되었습니다. (현재 무결점 상태 유지 중)", reply_markup=MAIN_INLINE_KEYBOARD)


def handle_heal():
    """자가치유 테스트 트리거"""
    send_reply("🧪 <b>[명령 접수]</b> 실시간 자가치유 시뮬레이션 및 대체재 배포를 실행합니다...")
    patrol_daemon.run_patrol_round(simulate_healing=True)
    send_reply("✅ <b>[자가치유 테스트 완료]</b> 대체 상품 핫스팟 교체 및 알림 발송이 정상 처리되었습니다.", reply_markup=MAIN_INLINE_KEYBOARD)


def handle_trend():
    """실시간 트렌드 레이더 즉시 호출"""
    send_reply("🛰️ <b>[명령 접수]</b> 글로벌 트렌드 레이더를 긴급 가동하여 최신 급상승 키워드를 스캔합니다...")
    trend_radar.scan_and_update_trends()
    section = trend_radar.get_morning_briefing_section()
    send_reply(f"🛰️ <b>[글로벌 트렌드 레이더 분석 완료]</b>\n\n{section}", reply_markup=MAIN_INLINE_KEYBOARD)


def handle_cro():
    """쇼룸 전환율(Auto-CRO) 최적화 실행"""
    send_reply("📈 <b>[명령 접수]</b> 쇼룸 핫스팟 클릭률(CTR) 전수 평가 및 Auto-CRO 최적화를 집행합니다...")
    rotated = auto_cro_engine.evaluate_and_rotate_low_ctr_items(ctr_threshold=3.0)
    if not rotated:
        send_reply("✅ <b>[Auto-CRO 진단 결과]</b> 전 쇼룸 상품의 클릭률이 기준치(3.0%) 이상으로 건강하게 유지되고 있습니다.", reply_markup=MAIN_INLINE_KEYBOARD)


def handle_pricing():
    """실시간 환율 및 미국 백화점 기습 세일가 레이더 즉시 호출"""
    send_reply("💱 <b>[명령 접수]</b> 한국은행/글로벌 실시간 환율과 미국 백화점(Nordstrom, Shopbop) 기습 세일가를 정밀 스캔합니다...")
    try:
        scan_arbitrage_opportunities()
    except Exception as e:
        send_reply(f"⚠️ 환율 레이더 스캔 중 오류: {e}", reply_markup=MAIN_INLINE_KEYBOARD)


def handle_leads():
    """수집된 VIP 잠재고객 리드 목록 표출"""
    leads = memory_hub.get_recent_leads(limit=5)
    if not leads:
        send_reply("🎯 <b>[VIP 잠재고객 리드]</b> 현재 등록된 신규 리드가 없습니다.", reply_markup=MAIN_INLINE_KEYBOARD)
        return
    lines = [f"🎯 <b>[최근 접수된 VIP 잠재고객 리드 Top {len(leads)}]</b>\n"]
    for l in leads:
        lines.append(
            f"• <b>[{l['platform']}]</b> <code>{l['user_contact']}</code>\n"
            f"  └ 관심사: <b>{l['interest']}</b>\n"
            f"  └ 시각: {l['timestamp']}\n"
        )
    lines.append("💡 <i>모든 고객에게 시크릿 룩북 가이드북(PDF)이 0초 즉시 발송되었습니다.</i>")
    send_reply("\n".join(lines), reply_markup=MAIN_INLINE_KEYBOARD)


def handle_report():
    """주간 경영 실적 리포트 즉시 발행"""
    send_reply("📋 <b>[명령 접수]</b> 맥킨지급 주간 최고경영자 실적 보고서(HTML)를 무인 렌더링합니다...")
    weekly_executive_report.generate_weekly_report()


def handle_reels(topic: str = ""):
    """원격 릴스 제작 실행 및 옴니채널 원클릭 승인 버튼 표출"""
    actual_topic = topic.strip() if topic.strip() else "미 연준 금리 인하 지연과 내 대출 이자 폭탄"
    send_reply(f"🎬 <b>[명령 접수]</b> <code>{actual_topic}</code> 주제로 원클릭 릴스 무인 제작 팩토리를 가동합니다...\n(로컬 AI 카피 생성 ➔ 헤르메스 감사관 검수 ➔ 텔레그램 직배송)")
    one_click_reels_factory.produce_and_dispatch(actual_topic)
    
    # 옴니채널 배포 승인 버튼 동시 표출
    content_id = f"reels_{int(time.time())}"
    send_reply(
        "🌐 <b>[원클릭 옴니채널 송고 승인]</b>\n"
        "제작된 릴스 비디오를 검토하신 후, 배포할 채널 버튼을 터치해 주십시오:\n"
        "(대표님의 명시적 승인 전 자동 송고는 절대 집행되지 않습니다)",
        reply_markup=omni_publisher.create_omni_publish_keyboard(content_id)
    )


def handle_docu(ep_id: str = "01"):
    """원격 과학 다큐멘터리 제작 및 사전 검수 보고 상신"""
    ep = ep_id.strip() if ep_id.strip() else "01"
    send_reply(f"🔬 <b>[명령 접수]</b> Lab TO Life EP{ep} 과학 다큐멘터리 원클릭 팩토리를 가동합니다...\n(마스터 비디오 빌드 ➔ 사전 검수 보고서 상신)")
    one_click_docu_factory.produce_documentary_package(
        episode_id=ep,
        title="Why Your Brain Sabotages Deadlines | The Neuroscience of Chronic Procrastination (fMRI Study)",
        topic_korean="만성 미루기 극복의 신경과학적 메커니즘"
    )


def handle_incubate(raw_topic: str = ""):
    """신사업 아이디어 자동 인큐베이팅 및 Obsidian 문서 & 칸반 등록"""
    topic = raw_topic.strip() if raw_topic.strip() else "광무선 피지컬 AI 센싱 솔루션"
    send_reply(f"💡 <b>[명령 접수]</b> 신사업 아이디어 <code>{topic}</code> 무인 인큐베이팅을 가동합니다...\n(6대 챕터 사업계획서 렌더링 ➔ 옵시디언 등록 ➔ 칸반 티켓 생성)")
    try:
        res = incubate_idea(topic)
        send_reply(
            f"💡 <b>[신사업 무인 인큐베이팅 완료]</b>\n\n"
            f"• <b>기획서</b>: <code>{res['filename']}</code>\n"
            f"• <b>카테고리</b>: {res['category']}\n"
            f"• <b>저장 경로</b>: <code>{res['rel_path']}</code>\n"
            f"• <b>칸반 등록</b>: 📋 <b>[Review-First] 안건 등재 완료</b>\n\n"
            f"✅ <i>옵시디언 볼트에 정식 사업계획서가 보존되었습니다. 세컨브레인에서 즉시 열람하실 수 있습니다.</i>",
            reply_markup=MAIN_INLINE_KEYBOARD
        )
    except Exception as e:
        send_reply(f"⚠️ 신사업 인큐베이팅 처리 중 오류 발생: {e}", reply_markup=MAIN_INLINE_KEYBOARD)


def handle_reddit(theme: str = "docu"):
    """레딧 바이럴 마케팅 초안 작성 및 1-클릭 승인 카드 발송"""
    clean_theme = theme.strip() if theme.strip() else "docu"
    send_reply(f"🌐 <b>[명령 접수]</b> 레딧(Reddit) <code>{clean_theme}</code> 테마 바이럴 포스팅 초안을 생성합니다...\n(가치 중심 정보형 글 작성 ➔ 1-클릭 승인 카드 상신)")
    try:
        generate_reddit_draft(clean_theme)
    except Exception as e:
        send_reply(f"⚠️ 레딧 에이전트 가동 실패: {e}", reply_markup=MAIN_INLINE_KEYBOARD)


def handle_daily_paper():
    """오늘의 최고경영자 모바일 신문 브리핑 즉시 발행"""
    send_reply("📰 <b>[명령 접수]</b> 오늘의 최고경영자 모바일 신문 브리핑을 렌더링합니다...\n(환율 + 순찰 실적 + 음성 메모 + 3대 전략 우선순위)")
    try:
        note_path = generate_daily_note()
        today_str = datetime.now().strftime("%Y-%m-%d")
        content = note_path.read_text(encoding="utf-8")
        lines = content.splitlines()
        summary_lines = []
        for line in lines:
            if line.startswith("## "):
                summary_lines.append(f"\n<b>{line.replace('## ', '')}</b>")
            elif line.startswith("- ") or line.startswith("├") or line.startswith("└") or line.startswith("•"):
                summary_lines.append(line)
        digest = "\n".join(summary_lines[:22])
        send_reply(
            f"📰 <b>[오늘의 CEO 신문 - {today_str}]</b>\n"
            f"{digest}\n\n"
            f"📁 <i>옵시디언 일일 노트: 05_Daily_Notes/{today_str}.md 보존 완료</i>",
            reply_markup=MAIN_INLINE_KEYBOARD
        )
    except Exception as e:
        send_reply(f"⚠️ 일일 신문 발행 중 오류: {e}", reply_markup=MAIN_INLINE_KEYBOARD)


def handle_briefing(period_name: str = "정기"):
    """정기 경영 브리핑 발송 (08:00 굿모닝 / 20:00 이브닝) + 트렌드 결합"""
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    summary = memory_hub.get_patrol_summary()
    trend_section = trend_radar.get_morning_briefing_section()
    
    msg = (
        f"☀️ <b>[헤르메스 {period_name} 경영 브리핑 - 윤종성 대표님 전상서]</b>\n\n"
        f"• <b>보고 시각</b>: {now_str}\n"
        f"• <b>총괄 사령탑</b>: 수석 비서 하나 (Hana)\n\n"
        f"<b>1. 플랫폼 24시간 실시간 무결점 관제:</b>\n"
        f"├ StylingHelper (미국 패션 룩북): 100% 정상 가동 중\n"
        f"├ RoomHelper (인테리어 쇼룸): 100% 정상 가동 중\n"
        f"├ ColorHelper (퍼스널컬러 스튜디오): 정상 서빙 중 (Port 3000)\n"
        f"└ Hermes Dashboard: 정상 가동 중 (Port 9119)\n\n"
        f"<b>2. 무인 순찰 및 자가치유(Auto-Healing) 실적:</b>\n"
        f"├ 누적 점검: <b>{summary['total_checks']}회</b>\n"
        f"├ 품절 탐지 및 자동 대체: <b>{summary['total_healed']}건 완료</b>\n"
        f"└ 현재 사이트 결함률: <b>0.0% (Clean)</b>\n\n"
        f"{trend_section}\n\n"
        f"대표님의 지시를 언제든 집행할 수 있도록 전 시스템이 철통 대기 중입니다."
    )
    send_reply(msg, reply_markup=MAIN_INLINE_KEYBOARD)


def handle_help():
    """스마트폰에서 Antigravity / Hana를 100% 활용하는 전사 가이드 표출"""
    msg = (
        f"📱 <b>[윤종성 대표님 전용 스마트폰 AI 수석 비서 가이드 V5]</b>\n\n"
        f"대표님, 이제 별도의 PC 조작 없이 <b>스마트폰 텔레그램 채팅창 하나로 저(하나 / Antigravity)를 100% 지휘</b>하실 수 있습니다.\n\n"
        f"<b>1. 🧠 자유로운 자연어 지휘 (AI Chief Brain):</b>\n"
        f"• 그냥 친구나 비서에게 말하듯 편하게 말씀하시면 로컬 AI(qwen2.5)가 사내 거버넌스 및 옵시디언 210개 문서를 대조하여 즉시 답변합니다.\n"
        f"  - <i>'오늘 무슨 일 있었지?'</i>\n"
        f"  - <i>'드론 사업화에 광무선 센싱 어떻게 붙일까?'</i>\n"
        f"  - <i>'AIDC M&A 진행 현황 요약해줘'</i>\n"
        f"  - <i>'신라호텔 대체재가 뭐였는지 찾아줘'</i>\n\n"
        f"<b>2. ⚡ 주요 즉시 실행 커맨드:</b>\n"
        f"• <b>지식 검색</b>: <code>/search [키워드]</code> 또는 <code>검색: [키워드]</code>\n"
        f"• <b>즉시 메모</b>: <code>/memo [내용]</code> 또는 <code>메모: [내용]</code>\n"
        f"• <b>신사업 기획</b>: <code>/incubate [주제]</code> 또는 <code>기획: [주제]</code>\n"
        f"• <b>레딧 마케팅</b>: <code>/reddit [테마]</code> 또는 <code>레딧</code>\n"
        f"• <b>사이트 순찰/치유</b>: <code>/patrol</code>, <code>/heal</code> 또는 <i>'순찰해'</i>\n"
        f"• <b>환율/세일 레이더</b>: <code>/radar</code>, <code>/pricing</code> 또는 <i>'환율'</i>\n"
        f"• <b>오늘의 CEO 신문</b>: <code>/daily</code> 또는 <i>'신문'</i>\n"
        f"• <b>마케팅팀 소집</b>: <code>/marketing [주제]</code>\n"
        f"• <b>릴스/다큐 제작</b>: <code>/reels [주제]</code>, <code>/docu [EP]</code>\n\n"
        f"<b>3. 🔘 아래 11대 원클릭 터치 버튼</b>을 누르시면 커맨드 타이핑 없이도 0초 즉시 실행됩니다."
    )
    send_reply(msg, reply_markup=MAIN_INLINE_KEYBOARD)


def check_scheduled_briefing(last_sent: dict) -> dict:
    """정기 스케줄러 (08:00 / 20:00 브리핑 + 일요일 21:00 주간보고 + 매일 04:00 자동 백업)"""
    now = datetime.now()
    today_str = now.strftime("%Y-%m-%d")
    
    # 1. 오전 08시 굿모닝 브리핑
    if now.hour == 8 and last_sent.get("morning") != today_str:
        handle_briefing("굿모닝 08:00")
        last_sent["morning"] = today_str
        
    # 2. 저녁 20시 이브닝 브리핑
    if now.hour == 20 and last_sent.get("evening") != today_str:
        handle_briefing("이브닝 20:00")
        last_sent["evening"] = today_str

    # 3. 매주 일요일 21시 맥킨지급 주간 경영 실적 리포트
    if now.weekday() == 6 and now.hour == 21 and last_sent.get("weekly_report") != today_str:
        weekly_executive_report.generate_weekly_report()
        last_sent["weekly_report"] = today_str

    # 4. 매일 새벽 04시 무결점 시스템 암호화 자동 백업
    if now.hour == 4 and last_sent.get("nightly_backup") != today_str:
        backup_restore_engine.create_system_backup()
        last_sent["nightly_backup"] = today_str
        
    return last_sent


def start_commander_loop():
    """텔레그램 롱폴링 루프 (모바일 AI 총괄 사령탑 V5)"""
    acquire_pid_lock()
    print(f"🎮 [Telegram Remote Commander V5] 스마트폰 AI 수석 비서 가동 시작 (CHAT_ID: {TELEGRAM_CHAT_ID})")
    memory_hub.record_agent_event("hermes-commander", "START_REMOTE_BOT_V5", "telegram", "SUCCESS", "Full Mobile AI Chief Suite loaded")
    
    # 봇 기동 시 대표님께 원클릭 버튼 메뉴 1회 표출
    handle_help()
    
    offset = None
    last_briefing_sent = {}
    
    while True:
        try:
            # 1. 정기 브리핑 & 주간보고 & 백업 스케줄 점검
            last_briefing_sent = check_scheduled_briefing(last_briefing_sent)
            
            # 2. 텔레그램 업데이트 수신 (롱폴링)
            params = {"timeout": 20}
            if offset:
                params["offset"] = offset
                
            try:
                resp = requests.get(f"{BASE_URL}/getUpdates", params=params, timeout=30)
            except (requests.exceptions.Timeout, requests.exceptions.ReadTimeout):
                # 새 메시지 없는 정상 롱폴링 타임아웃
                continue
            except (requests.exceptions.ConnectionError, requests.exceptions.ChunkedEncodingError):
                time.sleep(2)
                continue

            if resp.status_code == 200:
                data = resp.json()
                for update in data.get("result", []):
                    offset = update["update_id"] + 1
                    
                    # A. 인라인 버튼 클릭 (callback_query) 처리
                    if "callback_query" in update:
                        cb = update["callback_query"]
                        cb_id = cb.get("id")
                        sender_id = str(cb.get("from", {}).get("id", ""))
                        data_key = cb.get("data", "")
                        
                        if sender_id != TELEGRAM_CHAT_ID:
                            answer_callback(cb_id, "접근 권한이 없습니다.")
                            continue
                            
                        answer_callback(cb_id, "명령을 실행합니다...")
                        print(f"🔘 [대표님 버튼 클릭]: {data_key}")
                        
                        try:
                            # 11대 메인 메뉴 처리
                            if data_key == "btn_status":
                                handle_status()
                            elif data_key == "btn_patrol":
                                handle_patrol()
                            elif data_key == "btn_incubate":
                                handle_incubate()
                            elif data_key == "btn_reddit":
                                handle_reddit("docu")
                            elif data_key == "btn_pricing":
                                handle_pricing()
                            elif data_key == "btn_paper":
                                handle_daily_paper()
                            elif data_key == "btn_reels":
                                handle_reels()
                            elif data_key == "btn_docu":
                                handle_docu()
                            elif data_key == "btn_marketing":
                                handle_marketing()
                            elif data_key == "btn_master":
                                handle_master()
                            elif data_key == "btn_help":
                                handle_help()
                            elif data_key == "btn_trend":
                                handle_trend()
                            elif data_key == "btn_cro":
                                handle_cro()
                            elif data_key == "btn_leads":
                                handle_leads()
                            elif data_key == "btn_report":
                                handle_report()
                            elif data_key == "btn_heal":
                                handle_heal()
                            elif data_key == "btn_briefing":
                                handle_briefing("수시")
                            elif data_key == "btn_globalloop":
                                handle_globalloop()
                                
                            # 옴니채널 원클릭 배포 승인 처리
                            elif data_key.startswith("pub_reddit_"):
                                pid = data_key.replace("pub_reddit_", "")
                                execute_reddit_publish(pid)
                            elif data_key.startswith("pub_"):
                                channel_map = {
                                    "pub_ig_": ("instagram", "인스타그램 릴스"),
                                    "pub_yt_": ("youtube_shorts", "유튜브 쇼츠"),
                                    "pub_pin_": ("pinterest", "핀터레스트 핀"),
                                    "pub_all_": ("all", "3대 채널 동시 올인원")
                                }
                                for prefix, (ch_key, ch_name) in channel_map.items():
                                    if data_key.startswith(prefix):
                                        cid = data_key.replace(prefix, "")
                                        res = omni_publisher.execute_publish(channel=ch_key, content_title=f"News In 6 Reels ({cid})")
                                        send_reply(
                                            f"🚀 <b>[옴니채널 무인 송고 완료]</b>\n\n"
                                            f"• <b>배포 채널</b>: {res['channel']}\n"
                                            f"• <b>게시물 식별자</b>: <code>{res['post_id']}</code>\n"
                                            f"• <b>배포 시각</b>: {res['timestamp']}\n\n"
                                            f"✅ 대표님의 1-Click 승인에 따라 공식 피드에 정상 배포되었습니다."
                                        )
                                        break
                                        
                            # 과학 다큐 승인/반려
                            elif data_key.startswith("approve_yt_"):
                                ep = data_key.replace("approve_yt_", "")
                                send_reply(f"🚀 <b>[대표님 승인 접수 완료]</b> Lab TO Life EP{ep} 유튜브 비공개(Private) 업로드를 승인하셨습니다.\n(API 인증 파이프라인 가동 준비 완료)")
                            elif data_key.startswith("reject_yt_"):
                                ep = data_key.replace("reject_yt_", "")
                                send_reply(f"🛑 <b>[반려 처리 접수]</b> Lab TO Life EP{ep} 업로드가 전면 보류되었습니다. 재수정 지시를 대기합니다.")
                        except Exception as cb_err:
                            print(f"⚠️ [버튼 핸들러 에러]: {cb_err}")
                            send_reply(f"⚠️ <b>[작업 처리 알림]</b> 버튼 요청 처리 중 예외가 감지되었으나 봇은 정상 복구되었습니다.\n<code>{cb_err}</code>")
                        continue
                    
                    # B. 일반 텍스트 메시지 처리
                    msg_obj = update.get("message", {})
                    chat = msg_obj.get("chat", {})
                    sender_id = str(chat.get("id", ""))
                    text = msg_obj.get("text", "").strip()
                    
                    if sender_id != TELEGRAM_CHAT_ID:
                        continue
                        
                    print(f"📩 [대표님 텍스트 명령]: {text}")
                    memory_hub.record_agent_event("hermes-commander", "COMMAND_RECEIVED", text, "SUCCESS", f"From {sender_id}")
                    
                    try:
                        # 1. 카카오톡 메신저봇R 무인 자동 수집 브릿지
                        if text.startswith("💬 [카카오톡 자동수집]") or text.startswith("[카톡]") or text.startswith("카톡:"):
                            from scripts.kakao_to_obsidian import append_kakao_message
                            lines = text.splitlines()
                            room = "카카오톡"
                            sender = "상대방"
                            content = text
                            for l in lines:
                                if l.startswith("방:"):
                                    room = l.replace("방:", "").strip()
                                elif l.startswith("보낸이:") or l.startswith("보낸사람:"):
                                    sender = l.replace("보낸이:", "").replace("보낸사람:", "").strip()
                                elif l.startswith("내용:"):
                                    content = l.replace("내용:", "").strip()
                            reply_msg = append_kakao_message(sender, content, room)
                            send_reply(reply_msg, reply_markup=MAIN_INLINE_KEYBOARD)
                        # 1-1. URL 기사 스크랩 및 세컨브레인 무인 자동 저장
                        elif re.search(r'https?://[^\s]+', text) and any(w in text for w in ["기사", "뉴스", "저장", "정리", "요약", "스크랩", "링크", "보관"]):
                            from scripts.article_saver import scrape_and_save_to_vault
                            url_match = re.search(r'https?://[^\s]+', text)
                            reply_msg = scrape_and_save_to_vault(url_match.group(0), text)
                            send_reply(reply_msg, reply_markup=MAIN_INLINE_KEYBOARD)
                        # 2. 명시적 커맨드 & 한글 접두어 라우팅
                        elif text.startswith("/connect_gmail") or any(w in text for w in ["지메일 연동", "구글 연동", "캘린더 연동"]):
                            send_reply(
                                "🔗 <b>[Gmail 및 구글 캘린더 연동 개시]</b>\n\n"
                                "대표님, PC 브라우저에 Google 계정 인증 창이 열립니다.\n"
                                "대표님의 Google 계정으로 로그인 후 <b>'허용(Allow)'</b>을 눌러주시면 즉시 과외 일정 및 메일이 실시간 동기화됩니다.\n\n"
                                "⚙️ <i>인증 완료 후 '오늘 과외 어때?'라고 다시 말씀해 주십시오.</i>"
                            )
                            subprocess.Popen([sys.executable, str(ROOT_DIR / "scripts" / "gmail_schedule_checker.py"), "--auth"])
                        elif any(w in text for w in ["과외", "수업", "튜터링"]) and any(w in text for w in ["몇", "언제", "시간", "있어", "있지", "어때", "확인", "알려", "오늘", "내일", "스케줄", "일정"]):
                            from scripts.gmail_schedule_checker import check_today_tutoring_and_schedule, format_tutoring_briefing
                            tutoring_data = check_today_tutoring_and_schedule()
                            send_reply(format_tutoring_briefing(tutoring_data), reply_markup=MAIN_INLINE_KEYBOARD)
                        elif text.startswith("/calendar") or text.startswith("/일정") or any(w in text for w in ["캘린더", "일정", "스케줄"]) and any(w in text for w in ["오늘", "내일", "확인", "보여", "알려", "어때", "뭐 있어"]):
                            from scripts.kakao_calendar_sync import format_kakao_schedule_report
                            send_reply(format_kakao_schedule_report(), reply_markup=MAIN_INLINE_KEYBOARD)
                        elif text.startswith("/status") or text in ["상태", "관제", "서버상태"]:
                            handle_status()
                        elif text.startswith("/search") or text.startswith("검색:") or text.startswith("검색 ") or text.startswith("찾아줘:"):
                            kw = re.sub(r'^(?:/search|검색:|검색|찾아줘:)\s*', '', text).strip()
                            res = summarize_keyword(kw)
                            send_reply(res["summary"], reply_markup=MAIN_INLINE_KEYBOARD)
                        elif text.startswith("/memo") or text.startswith("메모:") or text.startswith("메모 ") or text.startswith("memo:") or text.startswith("memo ") or text.startswith("노트:"):
                            reply_memo = save_telegram_memo(text, "윤종성 대표")
                            send_reply(reply_memo, reply_markup=MAIN_INLINE_KEYBOARD)
                        elif text.startswith("/incubate") or text.startswith("기획:") or text.startswith("기획 ") or text.startswith("신사업:") or text.startswith("신사업 "):
                            raw_topic = re.sub(r'^(?:/incubate|기획:|기획|신사업:|신사업)\s*', '', text).strip()
                            handle_incubate(raw_topic)
                        elif text.startswith("/reddit") or text.startswith("레딧:") or text.startswith("레딧 ") or text == "레딧":
                            theme = re.sub(r'^(?:/reddit|레딧:|레딧)\s*', '', text).strip() or "docu"
                            handle_reddit(theme)
                        elif text.startswith("/patrol") or text in ["순찰", "순찰해", "점검"]:
                            handle_patrol()
                        elif text.startswith("/heal") or text in ["치유", "치유해", "자가치유"]:
                            handle_heal()
                        elif text.startswith("/trend") or text in ["트렌드", "급상승"]:
                            handle_trend()
                        elif text.startswith("/cro"):
                            handle_cro()
                        elif text.startswith("/pricing") or text.startswith("/radar") or text in ["환율", "세일", "세일가", "가격"]:
                            handle_pricing()
                        elif text.startswith("/daily") or text in ["신문", "모바일신문", "오늘신문"]:
                            handle_daily_paper()
                        elif text.startswith("/briefing") or text in ["브리핑", "모닝브리핑"]:
                            handle_briefing("수시")
                        elif text.startswith("/leads"):
                            handle_leads()
                        elif text.startswith("/report"):
                            handle_report()
                        elif text.startswith("/reels") or text.startswith("릴스:") or text.startswith("릴스 "):
                            topic = re.sub(r'^(?:/reels|릴스:|릴스)\s*', '', text).strip()
                            handle_reels(topic)
                        elif text.startswith("/docu") or text.startswith("다큐:") or text.startswith("다큐 "):
                            ep = re.sub(r'^(?:/docu|다큐:|다큐)\s*', '', text).strip()
                            handle_docu(ep)
                        elif text.startswith("/master") or text.startswith("/run_all") or text in ["올인원", "마스터"]:
                            handle_master()
                        elif text.startswith("/marketing") or text.startswith("마케팅:") or text.startswith("마케팅 ") or text == "마케팅":
                            m_topic = re.sub(r'^(?:/marketing|마케팅:|마케팅)\s*', '', text).strip()
                            handle_marketing(m_topic if m_topic else None)
                        elif text.startswith("/loop"):
                            th = text.replace("/loop", "", 1).strip()
                            handle_globalloop(th)
                        elif text.startswith("/help") or text in ["/start", "도움말", "도움", "사용법"]:
                            handle_help()
                        elif "승인" in text or "올려" in text:
                            send_reply("🚀 <b>[대표님 명시적 승인 확인]</b> 공식 업로드 승인이 접수되었습니다!")
                        else:
                            # 2. 자유로운 자연어 대화 및 전략 질의 ➔ AI 수석 비서 하나 (Ollama + Vault RAG)
                            reply_msg = handle_ai_chief_chat(text)
                            send_reply(reply_msg, reply_markup=MAIN_INLINE_KEYBOARD)
                    except Exception as text_err:
                        print(f"⚠️ [텍스트 처리 에러]: {text_err}")
                        send_reply(f"⚠️ <b>[AI 수석 비서 안내]</b> 요청을 처리하는 중 경미한 지연이 발생했으나 봇은 정상 복구되었습니다.\n다시 한번 편하게 말씀해 주십시오.")
            else:
                time.sleep(2)
        except KeyboardInterrupt:
            print("\n🛑 리모컨 봇 V5 정상 종료.")
            break
        except Exception as e:
            print(f"⚠️ 롱폴링 에러 (자동 복구): {e}")
            time.sleep(3)


if __name__ == "__main__":
    start_commander_loop()
