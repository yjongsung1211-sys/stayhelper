import urllib.request, json

import os, sys, pathlib
sys.path.insert(0, str(next(p for p in pathlib.Path(__file__).resolve().parents if (p / "hermes_env.py").exists())))
from hermes_env import TELEGRAM_BOT_TOKEN as _HERMES_TG_TOKEN
BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", _HERMES_TG_TOKEN)
CHAT_ID = "8971100274"

msg = """📰 <b>[오늘의 글로벌 AI 종합 마감 브리핑] 2026.11.11 (수)</b>

━━━━━━━━━━━━━━━━━━━━━
🔥 <b>오늘의 3대 핵심 이슈 (1분 요약)</b>
1. <b>앤스로픽 1.4조 달러(1,900조) IPO 개시</b> & <b>Fable 5.2 1위 탈환</b> (가격 -20%)
2. <b>구글의 역습</b>: 최강 가성비 <b>Gemini 4 Carbon</b> & <b>벤츠 공장 로봇 96% 성공</b>
3. <b>업무·비주얼 대격변</b>: 회의 참석하는 <b>Claude Meetings</b> & 100번 고쳐도 얼굴 안 깨지는 <b>바이트댄스 시드림 5.5</b>

━━━━━━━━━━━━━━━━━━━━━
🇺🇸 <b>1. 미국 (US)</b>
• <b>앤스로픽 IPO 로드쇼 개시</b>: 공모가 주당 70~78달러, 기업가치 1.4조 달러. 창업자 7인 경영권 유지.
• <b>Claude Fable 5.2 출시</b>: 글로벌 벤치마크 1위 탈환, 출력 속도 30% 향상, API 가격 20% 인하.
• <b>Claude 업무 도구 대거 출시</b>: Google Meet 회의에 직접 참여해 후속 계획 수립하는 'Meetings', Whiteboards 정식 공개.
• <b>OpenAI GPT-Live 음성 에이전트</b>: 4개 스타트업의 실시간 무인 상담·통화 실전 구축 노하우 공개.
• <b>구글 Gemini 4 Carbon</b>: Fable 5.2급 최상위 성능을 40% 비용으로 구현, 장기 코딩·사이버보안 특화.
• <b>구글 Gemini Robotics 2.5</b>: 벤츠 공장 PoC에서 Apollo 2 로봇이 자동차 부품 정리 96% 성공.

━━━━━━━━━━━━━━━━━━━━━
🇨🇳 <b>2. 중국 (中国 - 简体中文)</b>
• <b>바이트댄스 '시드림 5.5' 공개</b>: 100회 연속 수정에도 캐릭터 원본 100% 유지, 100개 레이어 분리 및 투명 누끼 지원.
• <b>DeepSeek Harness 프리뷰 오픈</b>: V4 전 시리즈 런칭에 이어 독립형 Agent 개발자 테스트 본격화.

━━━━━━━━━━━━━━━━━━━━━
🇹🇼 <b>3. 대만 (台灣 - 繁體中文)</b>
• <b>AMD Venice 양산 출하</b>: TSMC 2나노 공정 및 CoWoS 지원, 鴻海(폭스콘) 등 AI 서버 ODM 수혜 폭증.
• <b>Google 차세대 TPU 2종 출시</b>: 엔비디아 GPU 독점 균열 및 대만 데이터센터 공급망 재편.

━━━━━━━━━━━━━━━━━━━━━
🇰🇷 <b>4. 대한민국 (국내)</b>
• <b>모빌린트-퀄리타스반도체 협력</b>: 초고속 IP 결합 '원칩 AI SoC' 공개, 피지컬 AI 지연 시간 단축.
• <b>딥엑스 홍대용상 수상</b>: 국산 온디바이스 NPU 원천기술로 특허기술상 최고 영예 수상.
• <b>슈가스AI-DB글로벌칩</b>: 피지컬 AI 반도체 공급망 및 해외 판로 확대 파트너십 체결.

💡 <i>자세한 분석과 시사점은 PC 대화창에 종합 리포트로 상신되었습니다.</i>"""

payload = json.dumps({
    "chat_id": CHAT_ID,
    "text": msg,
    "parse_mode": "HTML",
    "disable_web_page_preview": True
}).encode("utf-8")

req = urllib.request.Request(
    f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
    data=payload,
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req) as res:
    print("Telegram Evening Briefing Send Success!")
