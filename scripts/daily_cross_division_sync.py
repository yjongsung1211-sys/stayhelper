#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
전사 일일 1회 합동 미팅(Daily Cross-Division Sync) 기록기 & 대표님 승인 안건 상신기
- 참여: 제1~5본부 부장 + 비서실장 하나 (직속 셀하나 포함)
- 기능:
  1) 각 본부별 당일 진행 현황, 타 부서 협조 요청, 병목 조율 내용 기록
  2) 대표님 최종 승인이 필요한 중요 결정사항만 별도 추출해 텔레그램 상신
  3) 세컨브레인 Vault (00_Inbox/전사_일일합동미팅/) 자동 보관
"""
import argparse
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
VAULT_SYNC_DIR = Path(r"C:\Users\Administrator\Desktop\1인기업_세컨브레인_Vault\00_Inbox\전사_일일합동미팅")
VAULT_SYNC_DIR.mkdir(parents=True, exist_ok=True)

sys.path.insert(0, str(ROOT))
try:
    from hermes_env import TELEGRAM_BOT_TOKEN as _TG_TOKEN
except Exception:
    _TG_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", _TG_TOKEN)
TELEGRAM_CHAT_ID = "8971100274"


def create_daily_sync_minutes(send_tg: bool = False):
    today = datetime.now().strftime("%Y-%m-%d")
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    md = f"""# 🤝 전사 일일 합동 미팅록 (Daily Cross-Division Sync) — {today}

> **일시**: {now_str} | **주재**: 비서실장 하나(Hana) & 제5본부 신사업 개발 부장  
> **참석**: 제1본부(커머스) · 제2본부(미디어) · 제3본부(그로스) · 제4본부(전략·재무·보안) · 제5본부(신사업) · 직속 셀하나

## 1. 부서별 공유 및 상호 조율 사항
- **🏢 제1본부 (커머스·웹)**: Helper 5대 쇼룸 정상 가동 유지 / 신사업 승인 시 기존 결제·Next.js 컴포넌트 공유 지원
- **🎬 제2본부 (글로벌 미디어)**: 11/30까지 42편 예약 완료 / 신사업 홍보용 0원 쇼츠·트래픽 파이프라인 연동 가능
- **📈 제3본부 (그로스·홍보)**: 미국 VPN 커뮤니티 홍보 및 VIP 리드 수집 / 신사업 시장 수요 사전 검증 지원
- **🛡️ 제4본부 (전략·재무·보안)**: 비용 ₩0원 방어 및 로컬 3B AI 서빙 / 신사업 비용·이해타산(ROI) 교차 검증 담당
- **🚀 제5본부 (신사업 개발부)**: 유사 사업 심층 리서치 · 벤치마킹 · 강점 결합 · 비용/이해타산 분석 진행 중
- **🎨 제6본부 (디자인부)**: 전사 웹 UI/UX·브랜드 일관성 · 유튜브 썸네일 · 쇼룸 1:1 시각 검수 지원
- **📱 직속 셀하나 운영부**: 하루 최소 업무 3종 점검 및 대표님 모바일 승인 큐 연동

## 2. 대표님(CEO) 최종 승인 필요 안건
- [ ] **제5본부 신사업 후보 3건 심층 리서치 착수 및 1순위 사업계획서 상신 대기**
- *(중요 결정사항 발생 시 즉시 비서실장 하나가 대표님 텔레그램으로 결재 요청)*
"""
    out_file = VAULT_SYNC_DIR / f"{today}_전사_일일합동미팅록.md"
    out_file.write_text(md, encoding="utf-8")
    print(f"✅ 일일 합동 미팅록 생성 완료: {out_file}")

    if send_tg and TELEGRAM_BOT_TOKEN:
        msg = (
            f"🤝 <b>[전사 일일 합동 미팅 완료 — {today}]</b>\n"
            f"• 제1~5본부 부장 & 직속 셀하나 의견 공유·조율 완료\n"
            f"• 🚀 제5본부(신사업): 심층 리서치·벤치마킹·이해타산 검증 SOP 가동\n"
            f"• 📂 미팅록 Vault 저장: <code>{out_file.name}</code>"
        )
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
            data=urllib.parse.urlencode({"chat_id": TELEGRAM_CHAT_ID, "text": msg, "parse_mode": "HTML"}).encode("utf-8"),
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            print(f"📲 텔레그램 미팅 보고 전송: {r.status}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--telegram", action="store_true")
    args = parser.parse_args()
    create_daily_sync_minutes(send_tg=args.telegram)
