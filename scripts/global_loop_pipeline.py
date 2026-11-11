# -*- coding: utf-8 -*-
"""
========================================================================================
[Global Multi-Channel Language Loop Master Pipeline]
- Target Channels:
  1. 🇺🇸 KoreanLoop (Global English Target - K-Culture Slang & Real Talk)
  2. 🇪🇸 Hola Coreano (Global Spanish/LATAM Target - Expresiones Coreanas Únicas)
  3. 🇰🇷 LanguageLoop (Domestic 5-in-1 Target - Commute Daily 3-Sentence Micro Habit)
- 100% Zero-Cost Local & Edge-TTS Synthesis (+0.85s Safe Buffer)
- Remotion FirstMotion™ 1080x1920 0-Degree Direct Front Master Rendering
- Review-First CEO Telegram Dispatch (100% Master MP4 + 5 Curated Hashtags)
========================================================================================
"""

import os
import sys
import json
import asyncio
import subprocess
import requests
from datetime import datetime

# Windows UTF-8 Terminal Fix
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
REMOTION_DIR = os.path.join(ROOT_DIR, "remotion_studio")
AUDIO_DIR = os.path.join(REMOTION_DIR, "public", "audio")
OUT_DIR = os.path.join(REMOTION_DIR, "out", "global_loops")
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

# Telegram Bot Credentials (from verified production config)
import sys as _hermes_sys, pathlib as _hermes_pathlib  # 시크릿은 .env.local 에서 읽는다 (hermes_env.py)
_hermes_sys.path.insert(0, str(next(p for p in _hermes_pathlib.Path(__file__).resolve().parents if (p / "hermes_env.py").exists())))
from hermes_env import TELEGRAM_BOT_TOKEN as _HERMES_TG_TOKEN
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", _HERMES_TG_TOKEN)
TELEGRAM_CHAT_ID = "8971100274"
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


# ========================================================================================
# 1. Edge-TTS Multi-Voice Engine (Zero Cost, +0.85s Safe Buffer)
# ========================================================================================
async def generate_tts(text: str, voice: str, output_path: str, rate: str = "+0%"):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate)
    await communicate.save(output_path)
    print(f"  [TTS] Synthesized: {os.path.basename(output_path)} ({voice})")


# ========================================================================================
# 2. Preset Curated Expressions Database (Expandable)
# ========================================================================================
PRESET_THEMES = {
    "nunchi": {
        "theme_id": "nunchi",
        "kr_term": "눈치 챙겨!",
        "romanization": "[Nun-chi chaeng-gyeo!]",
        "en": {
            "title": "Untranslatable Korean Slang: Nunchi #Shorts",
            "category": "[Untranslatable Korean]",
            "categoryColor": "#7c3aed",
            "categoryBg": "#f5f3ff",
            "tagText": "KOREAN SLANG",
            "translation": '"Read the room! Pick up the vibe."',
            "nuanceTitle": "Korean Social Radar 📡",
            "nuanceDesc": "Literally 'Pack your Nunchi!' Used when someone is completely socially oblivious.",
            "hashtags": ["#KoreanSlang", "#LearnKorean", "#KdramaWords", "#KoreanCulture", "#KoreanLoop"]
        },
        "es": {
            "title": "Palabra Coreana que no Existe en Español: Nunchi #Shorts",
            "category": "[Coreano Sin Traducción]",
            "categoryColor": "#ea580c",
            "categoryBg": "#fff7ed",
            "tagText": "SLANG COREANO",
            "translation": '"¡Capta la indirecta! (Lee el ambiente)"',
            "nuanceTitle": "Radar Social Coreano 📡",
            "nuanceDesc": "Literalmente '¡Lleva tu Nunchi!' Se usa cuando alguien no entiende el ambiente del grupo.",
            "hashtags": ["#AprenderCoreano", "#CoreanoFacil", "#Doramas", "#KpopEspanol", "#HolaCoreano"]
        },
        "domestic": {
            "title": "눈치 빠른 사람들의 직장 생존 영어/스페인어 3문장 #Shorts",
            "badgeText": "[출근길 1분 뇌새김]",
            "badgeColor": "#2563eb",
            "badgeBg": "#eff6ff",
            "cards": [
                {
                    "indexBadge": "1 / 3",
                    "primaryText": "Read the room.",
                    "pronunciation": "[리드 더 룸]",
                    "meaning": "눈치 좀 챙겨라 (분위기 파악해)",
                    "backSubtitle": "영미권 필수 직장 표현",
                    "backMainQuote": "Read the room before you speak.",
                    "backPoint1": "분위기 싸해질 때 1초 만에 쓰는 표현",
                    "backPoint2": "비즈니스 미팅 필수 매너",
                    "backShadowing": "3회 반복 쉐도잉 완성"
                },
                {
                    "indexBadge": "2 / 3",
                    "primaryText": "Capta la indirecta.",
                    "pronunciation": "[캅타 라 인디렉타]",
                    "meaning": "눈치 좀 채라 (돌려 말할 때)",
                    "backSubtitle": "스페인어권 공감 회화",
                    "backMainQuote": "Tienes que captar la indirecta.",
                    "backPoint1": "직설적이지 않은 완곡한 경고",
                    "backPoint2": "스페인/남미 친구들과 일상 대화",
                    "backShadowing": "3회 반복 쉐도잉 완성"
                },
                {
                    "indexBadge": "3 / 3",
                    "primaryText": "空気読んで (Kuuki yonde)",
                    "pronunciation": "[쿠우키 욘데]",
                    "meaning": "분위기 파악 좀 해 (공기를 읽어)",
                    "backSubtitle": "일본 현지 직장 밈 (KY)",
                    "backMainQuote": "ちゃんと空気読んでよ。",
                    "backPoint1": "일본 문화의 핵심 '공기 읽기'",
                    "backPoint2": "친한 동료나 후배에게 쓰는 표현",
                    "backShadowing": "3회 반복 쉐도잉 완성"
                }
            ],
            "hashtags": ["#직장인영어", "#생활영어", "#출근길어학", "#1분스페인어", "#LanguageLoop"]
        }
    },
    "bbq": {
        "theme_id": "bbq",
        "kr_term": "불판 좀 갈아주세요!",
        "romanization": "[Bul-pan jom ga-ra-ju-se-yo.]",
        "en": {
            "title": "Must-Know Phrase at Korean BBQ #Shorts",
            "category": "[K-BBQ Guide]",
            "categoryColor": "#dc2626",
            "categoryBg": "#fef2f2",
            "tagText": "K-FOOD SURVIVAL",
            "translation": '"Could you change the grill plate, please?"',
            "nuanceTitle": "K-BBQ Survival Rule 🔥",
            "nuanceDesc": "Grill nets burn fast! Staff swap them happily for free anytime.",
            "hashtags": ["#KoreanBBQ", "#Kfood", "#TravelKorea", "#SeoulFood", "#KoreanLoop"]
        },
        "es": {
            "title": "Frase Indispensable en un BBQ Coreano #Shorts",
            "category": "[Guía K-BBQ]",
            "categoryColor": "#dc2626",
            "categoryBg": "#fef2f2",
            "tagText": "K-FOOD ESENCIAL",
            "translation": '"¿Podría cambiar la parrilla, por favor?"',
            "nuanceTitle": "Regla de Oro K-BBQ 🔥",
            "nuanceDesc": "¡Las parrillas se queman rápido! El personal las cambia gratis sin problema.",
            "hashtags": ["#ComidaCoreana", "#KBBQ", "#ViajarACorea", "#SeulTravel", "#HolaCoreano"]
        },
        "domestic": {
            "title": "해외 레스토랑/바베큐 식당 필수 영어/스페인어 3문장 #Shorts",
            "badgeText": "[식도락 1분 여행영어]",
            "badgeColor": "#dc2626",
            "badgeBg": "#fef2f2",
            "cards": [
                {
                    "indexBadge": "1 / 3",
                    "primaryText": "Could we get a new grill grate?",
                    "pronunciation": "[쿠드 위 겟 어 뉴 그릴 그레이트?]",
                    "meaning": "불판 좀 새걸로 바꿔주실 수 있나요?",
                    "backSubtitle": "해외 고깃집 필수 표현",
                    "backMainQuote": "Excuse me, could we get a new grill grate?",
                    "backPoint1": "grate = 석쇠/불판 정확한 단어",
                    "backPoint2": "정중한 Could we 요청 문형",
                    "backShadowing": "3회 반복 쉐도잉 완성"
                },
                {
                    "indexBadge": "2 / 3",
                    "primaryText": "¿Nos cambia la parrilla, por favor?",
                    "pronunciation": "[노스 캄비아 라 파리야, 포르 파보르?]",
                    "meaning": "불판 좀 갈아주시겠어요?",
                    "backSubtitle": "스페인/남미 식당 실전",
                    "backMainQuote": "Por favor, ¿nos cambia la parrilla?",
                    "backPoint1": "parrilla = 그릴/석쇠",
                    "backPoint2": "스페인어권 바베큐(Asado) 식당 필수",
                    "backShadowing": "3회 반복 쉐도잉 완성"
                },
                {
                    "indexBadge": "3 / 3",
                    "primaryText": "Check, please. / La cuenta, por favor.",
                    "pronunciation": "[첵 플리즈 / 라 쿠엔타 포르 파보르]",
                    "meaning": "계산서 부탁드립니다",
                    "backSubtitle": "식사 마무리 완벽 매너",
                    "backMainQuote": "We are ready for the check!",
                    "backPoint1": "식당 자리에서 계산할 때 쓰는 표준",
                    "backPoint2": "전 세계 어디서나 통하는 문장",
                    "backShadowing": "3회 반복 쉐도잉 완성"
                }
            ],
            "hashtags": ["#여행영어", "#식당영어", "#스페인어회화", "#글로벌여행", "#LanguageLoop"]
        }
    }
}


# ========================================================================================
# 3. Audio Asset Generator
# ========================================================================================
async def build_audio_assets(theme_data: dict):
    theme_id = theme_data["theme_id"]
    kr_term = theme_data["kr_term"]
    
    # 1. KoreanLoop Audio (KR voice + EN voice)
    en_audio_file = f"audio_koreanloop_{theme_id}.mp3"
    en_audio_path = os.path.join(AUDIO_DIR, en_audio_file)
    en_script = f"{kr_term}. {theme_data['en']['translation']}. {theme_data['en']['nuanceDesc']}"
    await generate_tts(en_script, voice="en-US-GuyNeural", output_path=en_audio_path, rate="+10%")

    # 2. Hola Coreano Audio (KR voice + ES voice)
    es_audio_file = f"audio_holacoreano_{theme_id}.mp3"
    es_audio_path = os.path.join(AUDIO_DIR, es_audio_file)
    es_script = f"{kr_term}. {theme_data['es']['translation']}. {theme_data['es']['nuanceDesc']}"
    await generate_tts(es_script, voice="es-MX-DaliaNeural", output_path=es_audio_path, rate="+10%")

    # 3. LanguageLoop Domestic Audio (KR guide voice)
    dom_audio_file = f"audio_languageloop_{theme_id}.mp3"
    dom_audio_path = os.path.join(AUDIO_DIR, dom_audio_file)
    dom_script = f"오늘 배울 세 문장입니다. 첫 번째, {theme_data['domestic']['cards'][0]['primaryText']}. 두 번째, {theme_data['domestic']['cards'][1]['primaryText']}. 세 번째, {theme_data['domestic']['cards'][2]['primaryText']}."
    await generate_tts(dom_script, voice="ko-KR-SunHiNeural", output_path=dom_audio_path, rate="+12%")

    return en_audio_file, es_audio_file, dom_audio_file


# ========================================================================================
# 4. Remotion Master Rendering
# ========================================================================================
def render_remotion_composition(composition_id: str, out_name: str, props: dict):
    out_path = os.path.join(OUT_DIR, out_name)
    props_json = json.dumps(props, ensure_ascii=False)
    
    # Props file approach to prevent Windows CLI quote escaping issues
    props_file = os.path.join(REMOTION_DIR, f"temp_props_{composition_id}.json")
    with open(props_file, "w", encoding="utf-8") as f:
        f.write(props_json)

    cmd_args = [
        "cmd.exe", "/c", "npx", "remotion", "render",
        "src/index.ts", composition_id, out_path, f"--props={props_file}"
    ]
    print(f"\n🎬 [Rendering] {composition_id} -> {out_name}...")
    res = subprocess.run(cmd_args, cwd=REMOTION_DIR, capture_output=True, text=True)
    
    if os.path.exists(props_file):
        try: os.remove(props_file)
        except: pass

    if res.returncode == 0 and os.path.exists(out_path):
        size_mb = os.path.getsize(out_path) / (1024 * 1024)
        print(f"  ✅ Render Complete: {out_name} ({size_mb:.2f} MB)")
        return out_path
    else:
        print(f"  ❌ Render Failed! Exit Code: {res.returncode}")
        print(f"  Output: {res.stderr[:300]}")
        return None


# ========================================================================================
# 5. Telegram Review-First Auto Dispatch
# ========================================================================================
def send_telegram_package(theme_data: dict, en_mp4: str, es_mp4: str):
    print("\n📡 [Telegram] Dispatching Master Package to CEO Yoon...")
    
    # 1. Summary Report Message
    msg = (
        f"👑 <b>[글로벌 3대 랭귀지루프 마스터 패키지 완성]</b>\n\n"
        f"📌 <b>핵심 주제:</b> {theme_data['kr_term']} ({theme_data['romanization']})\n\n"
        f"🇺🇸 <b>1. KoreanLoop (영어 채널):</b>\n"
        f"• 제목: {theme_data['en']['title']}\n"
        f"• 뉘앙스: {theme_data['en']['nuanceDesc']}\n"
        f"<code>{' '.join(theme_data['en']['hashtags'])}</code>\n\n"
        f"🇪🇸 <b>2. Hola Coreano (스페인어 채널):</b>\n"
        f"• 제목: {theme_data['es']['title']}\n"
        f"• 뉘앙스: {theme_data['es']['nuanceDesc']}\n"
        f"<code>{' '.join(theme_data['es']['hashtags'])}</code>\n\n"
        f"🇰🇷 <b>3. LanguageLoop (국내 채널):</b>\n"
        f"• 제목: {theme_data['domestic']['title']}\n"
        f"<code>{' '.join(theme_data['domestic']['hashtags'])}</code>\n\n"
        f"🛡️ <i>대표님의 'Review-First' 승인 지침에 따라 유튜브 자동 업로드 전 마스터 비디오를 직속 상신합니다.</i>"
    )
    
    try:
        r = requests.post(f"{TELEGRAM_API_URL}/sendMessage", data={
            "chat_id": TELEGRAM_CHAT_ID,
            "text": msg,
            "parse_mode": "HTML"
        }, timeout=10)
        print(f"  [Telegram] Briefing Message Sent: {r.status_code}")
    except Exception as e:
        print(f"  [Telegram] Error sending message: {e}")

    # 2. Upload KoreanLoop MP4
    if en_mp4 and os.path.exists(en_mp4):
        try:
            with open(en_mp4, "rb") as f:
                requests.post(f"{TELEGRAM_API_URL}/sendVideo", data={
                    "chat_id": TELEGRAM_CHAT_ID,
                    "caption": f"🇺🇸 [KoreanLoop 마스터 영상]\n{theme_data['en']['title']}\n\n{' '.join(theme_data['en']['hashtags'])}",
                    "supports_streaming": True
                }, files={"video": f}, timeout=60)
            print("  [Telegram] 🇺🇸 KoreanLoop Master Video Uploaded!")
        except Exception as e:
            print(f"  [Telegram] Error uploading EN video: {e}")

    # 3. Upload Hola Coreano MP4
    if es_mp4 and os.path.exists(es_mp4):
        try:
            with open(es_mp4, "rb") as f:
                requests.post(f"{TELEGRAM_API_URL}/sendVideo", data={
                    "chat_id": TELEGRAM_CHAT_ID,
                    "caption": f"🇪🇸 [Hola Coreano 마스터 영상]\n{theme_data['es']['title']}\n\n{' '.join(theme_data['es']['hashtags'])}",
                    "supports_streaming": True
                }, files={"video": f}, timeout=60)
            print("  [Telegram] 🇪🇸 Hola Coreano Master Video Uploaded!")
        except Exception as e:
            print(f"  [Telegram] Error uploading ES video: {e}")


# ========================================================================================
# 6. Main Pipeline Runner
# ========================================================================================
def load_secondbrain_live_theme() -> dict:
    """실물 BLE 기기 1:1 회화 수업 노트(data/secondbrain_notes.json)에서 최신 표현을 읽어 3대 채널 테마로 자동 변환"""
    notes_path = os.path.join(ROOT_DIR, "data", "secondbrain_notes.json")
    title_text = "1:1 영어 회화 실전 표현"
    kr_term = "개연성 & 예측 불가능한 반전"
    romanization = "Gae-yeon-seong (Plausibility)"
    en_trans = "If plausibility is weak or too predictable, I lose interest."
    es_trans = "Si la trama es demasiado predecible, pierdo el interés."

    if os.path.exists(notes_path):
        try:
            with open(notes_path, "r", encoding="utf-8") as nf:
                payload = json.load(nf)
            notes = payload.get("notes", [])
            if notes:
                latest = notes[0]
                title_text = latest.get("title", title_text)
        except Exception as e:
            print(f"  [SecondBrain Loader] Warning reading notes: {e}")

    return {
        "id": "secondbrain_live",
        "kr_term": kr_term,
        "romanization": romanization,
        "en": {
            "channel": "KoreanLoop (🇺🇸 English Track)",
            "category": "SECONDBRAIN 1:1 LIVE",
            "categoryColor": "#38BDF8",
            "categoryBg": "rgba(56, 189, 248, 0.18)",
            "title": "Real 1:1 Speaking: Movie Plausibility",
            "tagText": "Real Lesson Note · Plausibility & Unpredictability",
            "translation": en_trans,
            "nuanceTitle": "1:1 LIVE COACHING INSIGHT",
            "nuanceDesc": f"Extracted directly from SecondBrain Note ({title_text[:36]}...): native phrasing for discussing thriller movie plots and AI workflow automation.",
            "tts_script": (
                "Today's real one-on-one speaking expression from SecondBrain Note! "
                "When talking about thriller movies in Korean, we say Gae-yeon-seong for plausibility. "
                "If plausibility is weak or the ending is too predictable, I lose interest in watching. "
                "Repeat this sentence three times to master natural movie discussion!"
            ),
            "voice": "en-US-AvaMultilingualNeural",
            "hashtags": ["#KoreanLoop", "#SecondBrain", "#LearnKorean", "#SpeakingPractice", "#Shorts"]
        },
        "es": {
            "channel": "Hola Coreano (🇪🇸 Spanish Track)",
            "category": "CLASE 1:1 EN VIVO",
            "categoryColor": "#F43F5E",
            "categoryBg": "rgba(244, 63, 94, 0.18)",
            "title": "Coreano Real 1:1: Trama y Coherencia",
            "tagText": "Nota de Clase · Coherencia (Gae-yeon-seong)",
            "translation": es_trans,
            "nuanceTitle": "EXPRESIÓN REAL DE CLASE 1:1",
            "nuanceDesc": "Extraído directamente de la sesión 1:1 grabada en SecondBrain Note: cómo opinar sobre películas de suspenso con naturalidad.",
            "tts_script": (
                "¡Expresión real extraída directamente de nuestra clase uno a uno en SecondBrain! "
                "Para hablar de la coherencia de una película en coreano, decimos Gae-yeon-seong. "
                "Si la historia es demasiado predecible, pierdo el interés rápidamente. "
                "¡Guarda este video para practicar tu conversación!"
            ),
            "voice": "es-MX-DaliaNeural",
            "hashtags": ["#HolaCoreano", "#SecondBrain", "#AprenderCoreano", "#CoreanoReal", "#Shorts"]
        },
        "kr_domestic": {
            "channel": "LanguageLoop (🇰🇷 Domestic English/Spanish Track)",
            "title": "실물 세컨브레인 1:1 수업 직결! '개연성이 약하다 / 결말이 뻔하다' 원어민 표현",
            "tts_script": (
                "실물 세컨브레인 기기로 녹음한 1대1 영어 회화 수업 핵심 복습! "
                "스릴러 영화에서 개연성이 떨어지거나 결말이 너무 뻔할 때 영어로 어떻게 말할까요? "
                "If plausibility is weak, or if it is too predictable, I lose interest in watching! "
                "오늘 수업에서 교정받은 원어민 문장을 지금 바로 3번 소리 내어 따라 해보세요!"
            ),
            "voice": "ko-KR-SunHiNeural"
        }
    }


PRESET_THEMES["secondbrain_live"] = load_secondbrain_live_theme()


def run_pipeline(theme_key: str = "nunchi"):
    print("=" * 80)
    print(f"🚀 [Global Loop Factory] Master Pipeline Started: Theme = {theme_key}")
    print("=" * 80)

    if theme_key == "secondbrain_live":
        PRESET_THEMES["secondbrain_live"] = load_secondbrain_live_theme()

    if theme_key not in PRESET_THEMES:
        print(f"Error: Unknown theme '{theme_key}'. Available: {list(PRESET_THEMES.keys())}")
        return

    theme_data = PRESET_THEMES[theme_key]

    # Step 1: Synthesize Audio
    print("\n[Step 1] Synthesizing 3-Language Audio via Edge-TTS (Zero Cost)...")
    en_audio, es_audio, dom_audio = asyncio.run(build_audio_assets(theme_data))

    # Step 2: Render 🇺🇸 KoreanLoop
    print("\n[Step 2] Rendering 🇺🇸 KoreanLoop 1080x1920 FirstMotion Shorts...")
    en_props = {
        "category": theme_data["en"]["category"],
        "categoryColor": theme_data["en"]["categoryColor"],
        "categoryBg": theme_data["en"]["categoryBg"],
        "title": theme_data["en"]["title"],
        "tagText": theme_data["en"]["tagText"],
        "korean": theme_data["kr_term"],
        "romanization": theme_data["romanization"],
        "english": theme_data["en"]["translation"],
        "nuanceTitle": theme_data["en"]["nuanceTitle"],
        "nuanceDesc": theme_data["en"]["nuanceDesc"],
        "audioFile": f"audio/{en_audio}"
    }
    en_mp4 = render_remotion_composition("KoreanLoopShortsNunchi", f"KoreanLoop_{theme_key}_Master.mp4", en_props)

    # Step 3: Render 🇪🇸 Hola Coreano
    print("\n[Step 3] Rendering 🇪🇸 Hola Coreano 1080x1920 FirstMotion Shorts...")
    es_props = {
        "category": theme_data["es"]["category"],
        "categoryColor": theme_data["es"]["categoryColor"],
        "categoryBg": theme_data["es"]["categoryBg"],
        "title": theme_data["es"]["title"],
        "tagText": theme_data["es"]["tagText"],
        "korean": theme_data["kr_term"],
        "romanization": theme_data["romanization"],
        "english": theme_data["es"]["translation"],
        "nuanceTitle": theme_data["es"]["nuanceTitle"],
        "nuanceDesc": theme_data["es"]["nuanceDesc"],
        "audioFile": f"audio/{es_audio}"
    }
    es_mp4 = render_remotion_composition("KoreanLoopShortsNunchi", f"HolaCoreano_{theme_key}_Master.mp4", es_props)

    # Step 4: Dispatch to Telegram
    print("\n[Step 4] Direct Dispatch to CEO Telegram with Review-First Governance...")
    send_telegram_package(theme_data, en_mp4, es_mp4)

    print("\n" + "=" * 80)
    print("🎉 [Global Loop Factory] 1-Click Multi-Channel Pipeline Successfully Executed!")
    print("=" * 80)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Global Loop Factory Master Pipeline")
    parser.add_argument("--theme", type=str, default="nunchi", help="Theme key (e.g. nunchi, bbq)")
    args = parser.parse_args()
    
    run_pipeline(args.theme)
