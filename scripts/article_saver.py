import urllib.request
import re
import os
import datetime
from pathlib import Path

VAULT_INBOX = Path(r"C:\Users\Administrator\Desktop\1인기업_세컨브레인_Vault\00_Inbox")

def scrape_and_save_to_vault(url: str, raw_instruction: str = "") -> str:
    """
    모바일에서 전송된 기사 URL을 자동 스크랩하여 Obsidian 00_Inbox에 저장하고 텔레그램 브리핑 메시지를 반환합니다.
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode("utf-8", errors="replace")

        # 1. 제목 추출
        t_match = re.search(r'<h2[^>]*id=["\']title_area["\'][^>]*>(.*?)</h2>', html, re.DOTALL) or \
                  re.search(r'<title>(.*?)</title>', html, re.DOTALL)
        title = "제목 없음"
        if t_match:
            title = re.sub(r'<[^>]+>', '', t_match.group(1)).strip()
            title = re.sub(r'\s*:\s*네이버\s*뉴스.*$', '', title)

        # 2. 언론사 추출
        m_match = re.search(r'<img[^>]*class=["\']media_end_head_top_logo_img["\'][^>]*alt=["\']([^"\']+)["\']', html)
        media = m_match.group(1) if m_match else "온라인 뉴스"

        # 3. 본문 추출
        b_match = re.search(r'<article[^>]*id=["\']dic_area["\'][^>]*>(.*?)</article>', html, re.DOTALL) or \
                  re.search(r'<article[^>]*>(.*?)</article>', html, re.DOTALL) or \
                  re.search(r'<div[^>]*class=["\']article_body["\'][^>]*>(.*?)</div>', html, re.DOTALL)

        body = ""
        if b_match:
            raw_body = b_match.group(1)
            raw_body = re.sub(r'<strong[^>]*class=["\']media_end_summary["\'][^>]*>.*?</strong>', '', raw_body, flags=re.DOTALL)
            raw_body = re.sub(r'<script[^>]*>.*?</script>', '', raw_body, flags=re.DOTALL)
            raw_body = re.sub(r'<style[^>]*>.*?</style>', '', raw_body, flags=re.DOTALL)
            raw_body = re.sub(r'<[^>]+>', '\n', raw_body)
            lines = [l.strip() for l in raw_body.splitlines() if l.strip()]
            body = "\n\n".join(lines)
        else:
            body = "본문 파싱 불가 (직접 링크 참조)"

        # 4. 파일명 및 저장 경로 생성
        safe_title = re.sub(r'[\\/*?:"<>|]', '', title)[:40].strip()
        now_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{now_str}_{media}_{safe_title}.md"
        filepath = VAULT_INBOX / filename

        VAULT_INBOX.mkdir(parents=True, exist_ok=True)

        # 5. 옵시디언 마크다운 작성
        md_content = f"""# 📰 [{media}] {title}

- **원문 링크**: {url}
- **수집 일시**: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
- **요청 지시**: {raw_instruction}
- **분류**: `#기사스크랩 #AI뉴스 #데이터센터 #세컨브레인`

---

## 📌 핵심 내용 요약
- **언론사/출처**: {media}
- **기사 제목**: {title}
- **본문 분량**: {len(body):,}자

---

## 📄 기사 본문
{body}

---
*수집 엔진: 하나(Hana) 자동 웹 스크래퍼 v1.0*
"""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(md_content)

        return (
            f"📰 <b>[기사 자동 스크랩 및 저장 완료]</b>\n\n"
            f"📌 <b>제목</b>: {title}\n"
            f"🏢 <b>출처</b>: {media}\n"
            f"📁 <b>저장 위치</b>: <code>00_Inbox/{filename}</code>\n\n"
            f"💡 <i>대표님의 세컨브레인 Vault에 완벽히 동기화 보관되었습니다.</i>"
        )
    except Exception as e:
        return f"⚠️ 기사 스크랩 중 오류가 발생했습니다: {e}"

if __name__ == "__main__":
    test_url = "https://n.news.naver.com/article/023/0004008657?cds=news_my"
    print(scrape_and_save_to_vault(test_url, "기사 저장 테스트"))
