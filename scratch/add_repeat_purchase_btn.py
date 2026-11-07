with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add "다른 사진 $1 추가 진단 (중복 결제)" button next to downloadResultCard
old_btn = """                  <button
                    onClick={downloadResultCard}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-md transition"
                  >
                    <Download className="w-4 h-4" />
                    {t.saveInstaCard}
                  </button>"""

new_btn = """                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setIsPayModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-md transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{lang === "ko" ? "📸 다른 사진 추가 진단 ($1)" : lang === "ja" ? "📸 別のお写真を追加診断 ($1)" : "📸 Diagnose Another Photo ($1)"}</span>
                    </button>
                    <button
                      onClick={downloadResultCard}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-md transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      {t.saveInstaCard}
                    </button>
                  </div>"""

if old_btn in content:
    content = content.replace(old_btn, new_btn)
    print("Added duplicate/additional $1 purchase button to report header!")
else:
    print("Could not find old_btn directly.")

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
