import os

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. In useEffect, ensure isUnlocked starts as false
old_ue = '''      const savedTickets = localStorage.getItem("colorhelper_tickets");
      if (savedTickets !== null) {
        const count = parseInt(savedTickets, 10);
        setTickets(count);
        setIsUnlocked(count > 0);
      } else {
        setTickets(0);
        setIsUnlocked(false);
        localStorage.setItem("colorhelper_tickets", "0");
      }'''

new_ue = '''      const savedTickets = localStorage.getItem("colorhelper_tickets");
      if (savedTickets !== null) {
        const count = parseInt(savedTickets, 10);
        setTickets(count);
      } else {
        setTickets(0);
        localStorage.setItem("colorhelper_tickets", "0");
      }
      // 항상 결제 전 상태로 시작 (Step 5 마지막에서 $1 결제 후 결과 잠금 해제)
      setIsUnlocked(false);'''

text = text.replace(old_ue, new_ue)

# 2. In checkTicketAndAnalyze, don't auto-unlock on photo upload; let the user experience steps 1-5 and pay at step 5
old_cta = '''    if (tickets > 0) {
      const newBalance = tickets - 1;
      setTickets(newBalance);
      localStorage.setItem("colorhelper_tickets", newBalance.toString());
      setIsUnlocked(true);
      analyzeCanvasImage(canvas);
    } else {
      setIsUnlocked(false);
      analyzeCanvasImage(canvas);
    }'''

new_cta = '''    // 5단계 인터랙티브 체험은 먼저 진행하고, 마지막 Step 5에서 결제하여 결과를 확인하도록 설정
    setIsUnlocked(false);
    analyzeCanvasImage(canvas);'''

text = text.replace(old_cta, new_cta)

# 3. Step 5 button logic:
# When comparisonStep === 5 and !isUnlocked: strictly show the $1 payment button!
# When isUnlocked: show the unlocked report button
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

new_step5_btn = '''          {comparisonStep < 5 ? (
            <button
              onClick={() => setComparisonStep(comparisonStep + 1)}
              className="w-full max-w-[320px] py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{comparisonStep === 1 ? t.step1Btn : t.step2Btn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : !isUnlocked ? (
            <button
              onClick={() => setIsPayModalOpen(true)}
              className="w-full max-w-[340px] py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-2xl transition flex items-center justify-center gap-2 animate-pulse cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{t.step5UnlockBtn}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                const el = document.getElementById("detailed-report-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full max-w-[340px] py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-2xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>
                {lang === "ko"
                  ? "🎉 진단 결과 리포트 확인하기 ↓"
                  : lang === "ja"
                  ? "🎉 診断結果レポートを見る ↓"
                  : "🎉 View Full Diagnostic Report ↓"}
              </span>
            </button>
          )}'''

text = text.replace(old_step5_btn, new_step5_btn)

# 4. Detailed report section condition:
# ONLY show when isUnlocked is true! Before payment, it is completely hidden!
old_report_cond = '{hasStartedDiagnosis && (isUnlocked || comparisonStep === 5) && resultTone && ('
new_report_cond = '{hasStartedDiagnosis && isUnlocked && resultTone && ('

text = text.replace(old_report_cond, new_report_cond)

# 5. In executePayment, make sure isUnlocked is set and smooth-scrolls to the result
old_exec_pay = '''    setTickets((prev) => {
      const next = prev + addCount;
      localStorage.setItem("colorhelper_tickets", next.toString());
      return next;
    });

    setIsUnlocked(true);'''

new_exec_pay = '''    setTickets((prev) => {
      const next = prev + addCount;
      localStorage.setItem("colorhelper_tickets", next.toString());
      return next;
    });

    setIsUnlocked(true);
    setTimeout(() => {
      const el = document.getElementById("detailed-report-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 400);'''

text = text.replace(old_exec_pay, new_exec_pay)

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated app/page.tsx with strict Step 5 payment-before-result logic!')
