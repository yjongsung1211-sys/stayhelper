import os
import urllib.request
from pathlib import Path

STUDIO_DIR = Path(r"c:\Users\Administrator\Desktop\프로젝트\1인기업대표\remotion_studio")
OUTPUT_DIR = STUDIO_DIR / "output"
opt_path = OUTPUT_DIR / "opt_reel_01_anthropic_ipo.mp4"

import sys as _hermes_sys, pathlib as _hermes_pathlib  # 시크릿은 .env.local 에서 읽는다 (hermes_env.py)
_hermes_sys.path.insert(0, str(next(p for p in _hermes_pathlib.Path(__file__).resolve().parents if (p / "hermes_env.py").exists())))
from hermes_env import TELEGRAM_BOT_TOKEN as _HERMES_TG_TOKEN
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", _HERMES_TG_TOKEN)
TELEGRAM_CHAT_ID = "8971100274"
caption = (
    "🎬 <b>[AI 인텔리전스 릴스 1/4]</b>\n\n"
    "<b>앤스로픽 1.4조 달러 IPO & 클로드 Fable 5.2 1위 탈환</b>\n\n"
    "• 공모가 70~78달러 상장 로드쇼 공식 개시\n"
    "• 벤치마크 1위 탈환 Fable 5.2 (가격 20% 인하)\n\n"
    "📌 인스타그램 릴스 규격(1080x1920 9:16) 완제품 비디오입니다."
)

boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
with open(opt_path, "rb") as f:
    vid_data = f.read()

body = bytearray()
body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n{TELEGRAM_CHAT_ID}\r\n'.encode("utf-8"))
body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n{caption}\r\n'.encode("utf-8"))
body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n'.encode("utf-8"))
body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="video"; filename="{opt_path.name}"\r\nContent-Type: video/mp4\r\n\r\n'.encode("utf-8"))
body.extend(vid_data)
body.extend(f'\r\n--{boundary}--\r\n'.encode("utf-8"))

req = urllib.request.Request(
    f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendVideo",
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
)
with urllib.request.urlopen(req, timeout=120) as res:
    print("Reel 1 Retry Send Success:", res.read().decode())
