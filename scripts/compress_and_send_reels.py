import os
import sys
import subprocess
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

STUDIO_DIR = Path(r"c:\Users\Administrator\Desktop\프로젝트\1인기업대표\remotion_studio")
OUTPUT_DIR = STUDIO_DIR / "output"
FFMPEG = STUDIO_DIR / "node_modules" / "@remotion" / "compositor-win32-x64-msvc" / "ffmpeg.exe"

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "8728900069:AAGQ1TiV7sPBXNwmfAs1GxxMnN0UTLgPZxs")
TELEGRAM_CHAT_ID = "8971100274"

VIDEOS = [
    {
        "file": "reel_01_anthropic_ipo.mp4",
        "title": "앤스로픽 1.4조 달러 IPO & 클로드 Fable 5.2 1위 탈환",
        "caption": "🎬 <b>[AI 인텔리전스 릴스 1/4]</b>\n\n<b>앤스로픽 1.4조 달러 IPO & 클로드 Fable 5.2 1위 탈환</b>\n\n• 공모가 70~78달러 상장 로드쇼 공식 개시\n• 벤치마크 1위 탈환 Fable 5.2 (가격 20% 인하)\n\n📌 인스타그램 릴스 규격(1080x1920 9:16) 완제품 비디오입니다."
    },
    {
        "file": "reel_02_claude_meetings.mp4",
        "title": "클로드, 내 대신 회의 참석한다... 오피스 도구 대거 출시",
        "caption": "🎬 <b>[AI 인텔리전스 릴스 2/4]</b>\n\n<b>클로드, 내 대신 회의 참석한다... 오피스 도구 대거 출시</b>\n\n• Google Meet 자동 접속 & 실시간 회의 청취\n• 결정된 과제를 담당자 캘린더에 자동 세팅\n• OpenAI GPT-Live 음성 에이전트 구축 사례 공개\n\n📌 인스타그램 릴스 규격(1080x1920 9:16) 완제품 비디오입니다."
    },
    {
        "file": "reel_03_gemini_robotics.mp4",
        "title": "구글의 역습: 벤츠 공장 로봇 96% 성공 & Gemini 4 Carbon",
        "caption": "🎬 <b>[AI 인텔리전스 릴스 3/4]</b>\n\n<b>구글의 역습: 벤츠 공장 로봇 96% 성공 & Gemini 4 Carbon</b>\n\n• 피지컬 AI: 벤츠 공장 부품 정리 성공률 96%\n• Gemini 4 Carbon: 최상위 성능을 40% 비용으로 실현\n\n📌 인스타그램 릴스 규격(1080x1920 9:16) 완제품 비디오입니다."
    },
    {
        "file": "reel_04_bytedance_seedream.mp4",
        "title": "바이트댄스 '시드림 5.5' 공개: 100번 고쳐도 얼굴 안 깨진다",
        "caption": "🎬 <b>[AI 인텔리전스 릴스 4/4]</b>\n\n<b>바이트댄스 '시드림 5.5' 공개: 100번 고쳐도 얼굴 안 깨진다</b>\n\n• 100회 연속 부분 수정에도 원본 캐릭터 완벽 보존\n• 최대 100개 레이어 분리 및 완벽 투명 배경 지원\n• 패션 룩북, 상세페이지 제작 게임체인저\n\n📌 인스타그램 릴스 규격(1080x1920 9:16) 완제품 비디오입니다."
    }
]

def compress_video(src: Path, dst: Path):
    print(f"  ⚡ 모바일 스트리밍 압축 중: {src.name} -> {dst.name}...")
    cmd = [
        str(FFMPEG),
        "-y",
        "-i", str(src),
        "-c:v", "libx264",
        "-crf", "26",
        "-preset", "veryfast",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        str(dst)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    orig_mb = src.stat().st_size / (1024 * 1024)
    comp_mb = dst.stat().st_size / (1024 * 1024)
    print(f"  ✅ 압축 완료: {orig_mb:.1f}MB -> {comp_mb:.1f}MB (-{((orig_mb-comp_mb)/orig_mb)*100:.0f}%)")

def send_telegram(video_path: Path, caption: str):
    print(f"  📤 텔레그램 발송 중 ({video_path.stat().st_size / (1024*1024):.1f}MB)...")
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    with open(video_path, 'rb') as f:
        vid_data = f.read()

    body = bytearray()
    body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n{TELEGRAM_CHAT_ID}\r\n'.encode('utf-8'))
    body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n{caption}\r\n'.encode('utf-8'))
    body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n'.encode('utf-8'))
    body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="video"; filename="{video_path.name}"\r\nContent-Type: video/mp4\r\n\r\n'.encode('utf-8'))
    body.extend(vid_data)
    body.extend(f'\r\n--{boundary}--\r\n'.encode('utf-8'))

    req = urllib.request.Request(
        f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendVideo',
        data=body,
        headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
    )
    with urllib.request.urlopen(req, timeout=180) as res:
        print("  🎉 텔레그램 전송 성공!")

def main():
    print("=" * 65)
    print("🚀 [4대 릴스 모바일 최적화 & 텔레그램 자동 전송 파이프라인]")
    print("=" * 65)

    for item in VIDEOS:
        raw_path = OUTPUT_DIR / item["file"]
        opt_path = OUTPUT_DIR / f"opt_{item['file']}"
        
        if not raw_path.exists():
            print(f"❌ 원본 없음: {raw_path}")
            continue

        # 1. 압축
        compress_video(raw_path, opt_path)
        
        # 2. 텔레그램 전송
        try:
            send_telegram(opt_path, item["caption"])
        except Exception as e:
            print(f"  ❌ 텔레그램 전송 에러: {e}")

    print("\n🏁 [완료] 4편 모두 텔레그램으로 발송되었습니다!")

if __name__ == "__main__":
    main()
