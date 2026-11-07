with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """            {/* ── STYLING HELPER FASHION LINK (오직 영어 버전에서만 노출 & stylinghelper.com 직행) ── */}"""

banner_code = """            {/* ── REPEAT PURCHASE BANNER: 다른 사진 $1 중복/추가 결제 유도 배너 ── */}
            <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl border border-purple-500/30">
              <div className="text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-purple-950 text-[10px] font-black uppercase tracking-wider mb-2">
                  ✨ MULTIPLE PHOTO DIAGNOSIS • $1
                </span>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  {lang === "ko" ? "다른 셀카나 친구·가족 사진도 $1에 추가 진단하기" : lang === "ja" ? "別のお写真やお友達・ご家族の写真も1回$1で追加診断" : "Diagnose Another Photo or Friend's Portrait for $1"}
                </h4>
                <p className="text-xs text-purple-200 mt-1 max-w-lg leading-relaxed">
                  {lang === "ko" ? "자연광 셀카, 풀메이크업 사진, 혹은 계절별 사진마다 퍼스널컬러 매칭률이 달라집니다. 언제든 $1에 중복 결제하여 새로운 사진을 추가 진단해보세요." : lang === "ja" ? "自然光の自撮りやメイク後の写真など、お写真ごとに診断結果を比較できます。いつでも1回$1で重複購入・追加診断が可能です。" : "Compare your undertones across different lighting, makeup, and seasons. You can purchase additional diagnoses anytime for $1 per photo."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
                <label className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-gray-100 text-purple-950 font-black text-xs shadow-xl transition cursor-pointer text-center flex items-center justify-center gap-2">
                  <span>📸 {lang === "ko" ? "새 사진 올리고 $1 진단" : lang === "ja" ? "新写真をアップして$1診断" : "Upload Photo ($1)"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
                <button
                  onClick={() => setIsPayModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-[#E07A5F] hover:from-amber-600 hover:to-[#d0694e] text-white font-black text-xs shadow-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{lang === "ko" ? "$1 추가 티켓 결제" : lang === "ja" ? "$1追加チケット購入" : "Buy $1 Pass"}</span>
                </button>
              </div>
            </div>

            {/* ── STYLING HELPER FASHION LINK (오직 영어 버전에서만 노출 & stylinghelper.com 직행) ── */}"""

if target in content:
    content = content.replace(target, banner_code)
    print("Added repeat purchase banner successfully!")
else:
    print("Could not find target!")

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
