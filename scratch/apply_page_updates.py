import os

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add RotateCcw
text = text.replace('  Droplet,\n}', '  Droplet,\n  RotateCcw,\n}')

# 2. Add UI_TEXT fields for ko
text = text.replace(
    'step5UnlockBtn: "내 전체 결과 & 베스트 컬러 잠금 해제",',
    'step5UnlockBtn: "🔒 $1 결제하고 전체 결과 보기",\n    fullResetBtn: "완전 리셋",\n    resetSuccessMsg: "모든 사진과 진단 상태가 완전 초기화되었습니다.",\n    uploadGuidePrompt: "내 얼굴 사진을 등록하거나 아래 모델을 선택해주세요",\n    uploadGuideSub: "사진 등록 즉시 5단계 실시간 퍼스널컬러 진단이 시작됩니다.",'
)

# 2-2. Add UI_TEXT fields for en
text = text.replace(
    'step5UnlockBtn: "Unlock Full Analysis & Color Palettes",',
    'step5UnlockBtn: "🔒 Pay $1 to Unlock Full Results",\n    fullResetBtn: "Reset All",\n    resetSuccessMsg: "All photos and diagnostic states have been completely reset.",\n    uploadGuidePrompt: "Upload your portrait photo or choose a preset model below",\n    uploadGuideSub: "The 5-step interactive personal color analysis will begin immediately upon photo selection.",'
)

# 2-3. Add UI_TEXT fields for ja
text = text.replace(
    'step5UnlockBtn: "完全な診断結果とベストカラーを解除する",',
    'step5UnlockBtn: "🔒 $1で決済して診断結果を見る",\n    fullResetBtn: "完全リセット",\n    resetSuccessMsg: "全ての診断状態と写真が完全にリセットされました。",\n    uploadGuidePrompt: "お顔写真を登録するか、下のモデルを選択してください",\n    uploadGuideSub: "写真登録後、すぐに5ステップのパーソナルカラー体験がスタートします。",'
)

# 3. Bump CARD_ASSET_VER
text = text.replace('const CARD_ASSET_VER = "?v=20261107_v12";', 'const CARD_ASSET_VER = "?v=20261108_v1";')

# 4. State & Full Reset handler
state_insert = '''  const [selectedLipKey, setSelectedLipKey] = useState<string>("rose");
  const [hasStartedDiagnosis, setHasStartedDiagnosis] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);'''

text = text.replace(
'''  const [selectedLipKey, setSelectedLipKey] = useState<string>("rose");
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);''',
state_insert
)

full_reset_code = '''  const handleFullReset = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("colorhelper_tickets");
        localStorage.removeItem("colorhelper_user_photo");
      } catch (e) {}
    }
    setTickets(0);
    setIsUnlocked(false);
    setImageSrc(null);
    setUploadedUserPhoto(null);
    setIsCustomPhoto(false);
    setGeminiTransformedImage(null);
    setComparisonStep(1);
    setIsScanning(false);
    setScanProgress(0);
    setSelectedOutfitIndex(3);
    setHasStartedDiagnosis(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    alert(t.resetSuccessMsg);
  };
'''

text = text.replace(
'''  const loadPresetModel = (preset: (typeof PRESET_MODELS)[0]) => {
    applySkinTone(preset);
  };''',
full_reset_code + '''  const loadPresetModel = (preset: (typeof PRESET_MODELS)[0]) => {
    setHasStartedDiagnosis(true);
    applySkinTone(preset);
    setComparisonStep(1);
    setTimeout(() => {
      const el = document.getElementById("interactive-comparison-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };'''
)

# 5. In useEffect, don't auto-start diagnosis on initial load
text = text.replace(
'''    loadPresetModel(PRESET_MODELS[0]);
  }, []);''',
'''    applySkinTone(PRESET_MODELS[0]);
    setHasStartedDiagnosis(false);
  }, []);'''
)

# 6. In handleFileUpload and captureCamera, setHasStartedDiagnosis(true)
text = text.replace(
'''    setIsCustomPhoto(true);

    checkTicketAndAnalyze(cvs);''',
'''    setIsCustomPhoto(true);
    setHasStartedDiagnosis(true);

    checkTicketAndAnalyze(cvs);'''
)
text = text.replace(
'''      setIsCustomPhoto(true);

      const img = new Image();''',
'''      setIsCustomPhoto(true);
      setHasStartedDiagnosis(true);

      const img = new Image();'''
)

# 7. Add Full Reset button in Top Nav
nav_insert = '''          {/* 완전 리셋 버튼 */}
          <button
            onClick={handleFullReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition border border-gray-200 shadow-2xs cursor-pointer"
            title={t.fullResetBtn}
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>{t.fullResetBtn}</span>
          </button>

          {/* 잔여 진단권 & 페이팔 충전 배지 (비회원/게스트 100% 즉시 이용) */}'''

text = text.replace(
'''          {/* 잔여 진단권 & 페이팔 충전 배지 (비회원/게스트 100% 즉시 이용) */}''',
nav_insert
)

# 8. Conditional 5-step comparison & initial upload guide
old_step_section = '''      {/* ── 5-STEP GUIDED INTERACTIVE COMPARISON (Color Analysis App 벤치마킹) ── */}
      <div className="mb-10 p-5 sm:p-8 rounded-3xl bg-gradient-to-b from-purple-50/50 via-white to-gray-50 border border-purple-100 shadow-xl">'''

new_step_section = '''      {/* ── 5-STEP GUIDED INTERACTIVE COMPARISON (사진 등록 시 노출) ── */}
      {!hasStartedDiagnosis && (
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-purple-50/60 to-white border border-purple-100 text-center shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1.5">
            {t.uploadGuidePrompt}
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            {t.uploadGuideSub}
          </p>
        </div>
      )}

      {hasStartedDiagnosis && (
        <div id="interactive-comparison-section" className="mb-10 p-5 sm:p-8 rounded-3xl bg-gradient-to-b from-purple-50/50 via-white to-gray-50 border border-purple-100 shadow-xl animate-fade-in">'''

text = text.replace(old_step_section, new_step_section)

# 9. Close hasStartedDiagnosis div at end of 5-step comparison
old_step_end = '''          )}
        </div>
      </div>

      {/* ── STEP 3: 상세 결과 리포트 (잠금 및 결제 연동) ───────────── */}
      {resultTone && ('''

new_step_end = '''          )}
        </div>
      </div>
      )}

      {/* ── STEP 3: 상세 결과 리포트 (결제 완료 후 또는 5단계 완료 시 노출) ───────────── */}
      {hasStartedDiagnosis && (isUnlocked || comparisonStep === 5) && resultTone && ('''

text = text.replace(old_step_end, new_step_end)

# 10. Step 5 button click: If unlocked, scroll to report; if not unlocked, open pay modal
old_step5_btn = '''          {comparisonStep < 5 ? (
            <button
              onClick={() => setComparisonStep(comparisonStep + 1)}
              className="w-full max-w-[320px] py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{comparisonStep === 1 ? t.step1Btn : t.step2Btn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => setIsPaywallOpen(true)}
              className="w-full max-w-[320px] py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-2xl transition flex items-center justify-center gap-2 animate-pulse cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{t.step5UnlockBtn}</span>
            </button>
          )}'''

new_step5_btn = '''          {comparisonStep < 5 ? (
            <button
              onClick={() => setComparisonStep(comparisonStep + 1)}
              className="w-full max-w-[320px] py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{comparisonStep === 1 ? t.step1Btn : t.step2Btn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (isUnlocked) {
                  const el = document.getElementById("detailed-report-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                } else {
                  setIsPayModalOpen(true);
                }
              }}
              className="w-full max-w-[340px] py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-2xl transition flex items-center justify-center gap-2 animate-pulse cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>
                {isUnlocked
                  ? (lang === "ko" ? "진단 결과 리포트 확인하기 ↓" : lang === "ja" ? "診断結果レポートを見る ↓" : "View Full Diagnostic Report ↓")
                  : t.step5UnlockBtn}
              </span>
            </button>
          )}'''

text = text.replace(old_step5_btn, new_step5_btn)

# 11. Delete Step 5 5-swatch buttons block
old_swatch_block = '''              <div className="flex items-center justify-between gap-1.5 px-1">
              {OUTFIT_MATCH_PRESETS.map((outfit, idx) => (
                <button
                  key={outfit.id}
                  onClick={() => setSelectedOutfitIndex(idx)}
                  className={`flex flex-col items-center gap-1 p-1 rounded-2xl transition border cursor-pointer ${
                    selectedOutfitIndex === idx
                      ? "border-purple-600 bg-purple-50 ring-2 ring-purple-200 scale-105"
                      : "border-transparent hover:bg-gray-100"
                  }`}
                >
                  <span className="text-[9px] font-black text-amber-700 bg-white/90 px-1 rounded shadow-2xs">
                    🔥{outfit.match}%
                  </span>
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: outfit.hex }}
                  />
                </button>
              ))}
              </div>'''

text = text.replace(old_swatch_block, '')

# 12. Delete custom blue PayPal button in modal
old_paypal_btn_block = '''            {/* 직접 결제 및 테스트 승인 버튼 */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <button
                disabled={paymentProcessing}
                onClick={() => executePayment("single")}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0070BA] to-[#003087] hover:from-[#005ea6] hover:to-[#00256c] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {paymentProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span className="font-black italic tracking-wider">PayPal</span>
                    <span>{t.payWithPaypal}</span>
                  </>
                )}
              </button>


            </div>'''

text = text.replace(old_paypal_btn_block, '')

# Also add id to detailed report section
text = text.replace(
'<section className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-200 mb-8 relative overflow-hidden">',
'<section id="detailed-report-section" className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-200 mb-8 relative overflow-hidden">'
)

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated app/page.tsx successfully!')
