# WeddingHelper Likeness Optimization & Async Order Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform WeddingHelper into a high-converting, flawless commercial service by (1) maximizing facial likeness and zero-Westernization in 240 AI wedding scenes, and (2) implementing an instant-dopamine hybrid async delivery system where the first 3 scenes render immediately while all 240 scenes compile in the background with email/Telegram dispatch.

**Architecture:** 
- **Quality Engine (`/api/weddinghelper/visualize`)**: Multimodal prompt engineering with strict facial identity anchors, Korean porcelain glass-skin preservation, and target scene pose alignment using paid Gemini 2.5/3.1 Flash Image.
- **Async Order Pipeline (`/api/weddinghelper/order/*`)**: Serverless order creation, instant 3-scene priority burst, background worker synthesis for all 240 scenes, persistent storage in order manifests, and automated email/Telegram dispatch with a permanent order gallery link (`/gallery?orderId=...`).
- **Hybrid UI UX (`/weddinghelper/gallery`)**: Removes the 2-hour blocking wait. Shows 3 instant teaser masterpieces within 60s, a live background progress badge, a "You can safely close this tab" assurance, and an email delivery confirmation.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Google Gemini 2.5/3.1 Flash Image API, JSZip, Telegram Bot API, Resend / Nodemailer.

---

## Global Constraints

- **0-Cost Internal Tools**: Use existing Google Gemini paid key (`GEMINI_PAID_API_KEY`), existing Vercel deployment, and existing Telegram bot.
- **Aesthetic Standard**: Aman Resorts & Hermès luxury quiet elegance (`#1C1917`, `#C5A059`, `#FAF8F5`).
- **Zero Race Morphing**: 100% preservation of authentic East Asian/Korean facial bone structures, eyes, cheek dimples, and smiles. No foreign Caucasian nose bridge or European eyelid creases.
- **Mobile First Safe**: No blocking browser tabs. Customers must never be required to keep a browser window open for more than 60 seconds.

---

## Review Focus

1. **Facial Likeness Verification**: Does the synthesized output actually look like the uploaded couple, or does it look like a generic model?
2. **Mobile Tab Closure Safety**: If a user uploads photos, pays $19, and closes the tab after 40 seconds, does their order continue processing in the background and get delivered?
3. **Data Rehydration**: When a user returns to `/gallery?orderId=...` from an email or bookmarks, are all synthesized photos immediately visible without re-synthesizing?
4. **Rate Limit & Timeout Defense**: Does the background synthesizer handle Gemini transient rate limits or 504 timeouts gracefully with retries?
5. **CEO Oversight & Notification**: Does representative Yoon Jong-sung receive real-time Telegram alerts with customer email, order ID, and completed gallery link?

---

## Tasks

### Task 1: Facial Likeness & Identity Lock Benchmark Test
**Files:**
- Create: `scratch/test_likeness_benchmark.py`
- Modify: `app/api/weddinghelper/visualize/route.ts:120-180`

- [ ] Write a test script `scratch/test_likeness_benchmark.py` using a real reference photo of an Asian couple to synthesize Angle #01 (Ceremonial Altar Vows) and Angle #03 (Sunset Terrace Toast).
- [ ] Refine the multimodal system prompt in `app/api/weddinghelper/visualize/route.ts` to enforce:
  - Exact 1:1 facial biometric transfer (facial contour, eyelid crease, nose width, lips, natural smile).
  - Explicit contrast directives: "DO NOT alter eye shape or bone structure. Cleanse skin to luxury bridal porcelain finish but retain exact facial likeness."
- [ ] Execute `scratch/test_likeness_benchmark.py` and save the resulting images to disk.
- [ ] Visually verify that the synthesized faces match the reference couple with high fidelity.

---

### Task 2: Async Order Management & State Storage API
**Files:**
- Create: `app/api/weddinghelper/order/route.ts`
- Create: `lib/wedding-order-store.ts`

- [ ] Implement `lib/wedding-order-store.ts` to manage order persistence (Order ID, customer email, status, uploaded photo data, synthesized scenes dictionary, progress percentage).
- [ ] Implement `POST /api/weddinghelper/order` to create an order upon $19 VIP payment.
- [ ] Implement `GET /api/weddinghelper/order?orderId=...` to query real-time order status and retrieve synthesized photos.
- [ ] Implement `POST /api/weddinghelper/order/process` to handle batch background synthesis steps safely with error recovery.

---

### Task 3: Instant Dopamine (First 3 Scenes Priority) & Safe Async UX
**Files:**
- Modify: `app/weddinghelper/gallery/page.tsx`
- Modify: `app/weddinghelper/page.tsx`

- [ ] Update `app/weddinghelper/gallery/page.tsx`:
  - If `orderId` is present in URL or upon fresh checkout:
    - Trigger immediate priority synthesis for **Angle #01, #02, #03** (renders within 45-60 seconds).
    - Display prominent reassurance banner:
      "✨ **Your first 3 Masterpieces are unlocked!** All 240 editorial scenes are now hand-crafting in our high-speed atelier queue. **You can safely close this page anytime** — your complete 4K gallery link and ZIP will be sent to your email."
  - Add permanent bookmark / copy link button for `weddinghelper.love/gallery?orderId={id}`.
  - Add automatic polling/re-fetching so if the user keeps the tab open, scenes dynamically populate as they complete.

---

### Task 4: Automated Delivery (Email & CEO Telegram Dispatch)
**Files:**
- Create: `lib/wedding-delivery.ts`
- Modify: `app/api/weddinghelper/order/process/route.ts`

- [ ] Implement `lib/wedding-delivery.ts` to send Telegram notification to CEO Yoon Jong-sung:
  `🔔 [WeddingHelper] 240장 웨딩 화보 제작 완료! 고객: {email}, 갤러리: {url}`
- [ ] Implement customer delivery email trigger with one-click direct access to their full 240-photo gallery and ZIP download.

---

### Task 5: End-to-End Verification & Production Deployment
- [ ] Run full TypeScript compilation (`npx tsc --noEmit`).
- [ ] Run local Next.js build (`npm run build`).
- [ ] Commit and push to GitHub `main` branch.
- [ ] Verify Vercel production deployment reaches `READY`.
- [ ] Perform a live end-to-end checkout & synthesis test on `https://www.weddinghelper.love`.
- [ ] Report final results and live verification links to CEO Yoon Jong-sung.
