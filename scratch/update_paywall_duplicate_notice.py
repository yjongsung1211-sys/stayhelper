with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Paywall text to encourage repeated / duplicate purchases ($1 per photo)
old_paywall_desc = """                <p className="text-[11px] text-gray-400 mt-1">
                  {lang === "ko" ? "12톤 퍼스널컬러 + 인생 립·헤어·의상 풀 진단" : lang === "ja" ? "12タイプパーソナルカラー＋リップ・ヘア・衣装フル診断" : "12-Season Personal Color + Full Makeup & Styling Diagnostic"}
                </p>"""

new_paywall_desc = """                <p className="text-[11px] text-gray-400 mt-1">
                  {lang === "ko" ? "12톤 퍼스널컬러 + 인생 립·헤어·의상 풀 진단" : lang === "ja" ? "12タイプパーソナルカラー＋リップ・ヘア・衣装フル診断" : "12-Season Personal Color + Full Makeup & Styling Diagnostic"}
                </p>
                <div className="mt-2.5 pt-2 border-t border-purple-500/30 text-[10px] text-amber-300 font-bold">
                  {lang === "ko" ? "※ 사진 1장당 1회 정밀 진단 ($1) • 다른 사진이나 친구 사진도 언제든 $1에 중복 결제 가능" : lang === "ja" ? "※ 写真1枚につき1回精密診断 ($1) • 別のお写真もいつでも1回$1で重複購入・追加診断可能" : "※ $1 per photo diagnosis • Multiple photos or friends can be diagnosed anytime ($1 each)"}
                </div>"""

if old_paywall_desc in content:
    content = content.replace(old_paywall_desc, new_paywall_desc)
    print("Updated paywall description with repeated payment notice!")
else:
    print("Could not find old_paywall_desc directly, checking...")

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
