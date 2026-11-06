"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  Upload,
  Sparkles,
  Palette,
  CheckCircle2,
  Sliders,
  Heart,
  ArrowRight,
  Info,
  Download,
  Flame,
  Snowflake,
  Layers,
  Lock,
  CreditCard,
  User,
  LogIn,
  LogOut,
  Ticket,
  X,
  ShieldCheck,
  Check,
  Globe,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";

// ─── 다국어 언어 타입 ─────────────────────────────────────────
type LangType = "ko" | "en" | "ja";

// ─── 다국어 UI 텍스트 딕셔너리 ──────────────────────────────────
const UI_TEXT = {
  ko: {
    brandName: "퍼스널컬러헬퍼",
    brandTag: "AI 퍼스널컬러헬퍼 스튜디오",
    subtitle: "내 얼굴에 꼭 맞는 인생 컬러와 가상 드레이핑(Draping)을 3초 만에 찾는 AI 퍼스널컬러헬퍼",
    badgePrice: "1회 1,000원",
    badgePayPal: "페이팔(PayPal) & 카드 결제",
    badgeNoLogin: "로그인 불필요 · 3초 즉시 진단",
    badgeMatrix: "12톤 정밀 색채학 매트릭스",
    badgeDraping: "오프라인 샵 1:1 가상 천 드레이핑",
    ticketLabel: "진단권",
    ticketUnit: "회",
    recharge: "+충전",
    uploadTitle: "내 얼굴 사진 등록하기",
    uploadDesc: "자연광에서 찍은 정면 셀카가 가장 정확하며, 아래 샘플 모델로 즉시 체험도 가능합니다.",
    uploadFileBtn: "사진 파일 올리기",
    cameraBtn: "카메라 촬영",
    cameraShootBtn: "지금 찰칵 촬영!",
    cameraGuide: "원 안에 얼굴을 맞춰주세요",
    presetTitle: "사진 없이 1초 즉시 체험 모델 (무료 열람):",
    presetSub: "클릭 즉시 결과 진단",
    drapingTitle: "인터랙티브 가상 드레이핑 (Virtual Draping)",
    drapingDesc: "실제 퍼스널컬러 진단실처럼 얼굴 아래에 천(Drape)을 실시간으로 대보며 안색이 화사해지는지 확인하세요.",
    splitToggle: "웜 vs 쿨 반반 비교",
    splitWarm: "웜톤 (피치)",
    splitCool: "쿨톤 (라벤더)",
    skinDetected: "피부톤 감지 완료",
    swatchTitle: "드레이핑 진단 천 교체 (클릭해보세요)",
    swatchDesc: "천을 바꿨을 때 턱선이 갸름해 보이고 얼굴빛이 화사해지는 색상이 내 톤입니다.",
    metricTitle: "AI 색채학 지표 분석",
    metricSubtitle: "RGB/LAB 매트릭스",
    coolLabel: "쿨(Cool)",
    warmLabel: "웜(Warm)",
    brightnessLabel: "피부 밝기 (Value):",
    saturationLabel: "채도 (Chroma):",
    tabResult: "12톤 진단 결과 & 컬러 팔레트",
    tabCosmetics: "인생 립스틱 & 파우치 처방전",
    saveInstaCard: "인스타 스토리 카드 저장",
    bestPalette: "베스트 팔레트 (안색이 가장 맑아지는 색)",
    worstPalette: "워스트 팔레트 (피부가 칙칙하거나 뜨는 색)",
    totalFormula: "토탈 스타일링 처방전",
    jewelryTitle: "💍 추천 주얼리",
    baseTitle: "💆 베이스 메이크업",
    hairTitle: "💇 헤어 염색 추천",
    fashionTitle: "👗 패션 스타일링",
    lipTitle: "맞춤 인생 립스틱 3선",
    lipDesc: "바르는 순간 형광등을 켠 듯 안색을 환하게 밝혀주는 실존 인기 백화점/올리브영 베스트셀러입니다.",
    lowestPrice: "최저가 보러가기",
    blushTitle: "🌸 찰떡 블러셔 (치크)",
    eyeTitle: "👁️ 음영 아이섀도우 팔레트",
    lockTitle: "내 사진 12톤 정밀 진단서 & 인생 립스틱 처방전 잠금",
    lockDesc: "얼굴 사진을 기반으로 베스트 컬러 5종, 워스트 컬러, 찰떡 립스틱 3종 분석이 완료되었습니다. 단돈 1,000원으로 즉시 해금하세요!",
    unlockBtn: "1,000원으로 결과 즉시 해금하기 (PayPal / 카드)",
    modalTitle: "퍼스널 컬러 정밀 진단권 충전",
    modalSubtitle: "청담동 15만 원 오프라인 진단을 1회 1,000원에 온라인에서 누리세요.",
    singlePlanTag: "가장 인기 있는 기본형",
    singlePlanName: "1회 정밀 진단 티켓",
    singlePlanDesc: "12톤 분석 + 인생 립스틱 + 인스타 카드",
    singlePrice: "₩1,000",
    singlePriceSub: "$0.79 USD",
    triplePlanTag: "16% 할인 패키지",
    triplePlanName: "3회 콤보 패키지",
    triplePlanDesc: "친구·연인·가족과 함께 진단",
    triplePrice: "₩2,500",
    triplePriceSub: "$1.89 USD",
    payWithPaypal: "페이팔로 ₩1,000 결제하기",
    payTriplePaypal: "3회 콤보 (₩2,500) 페이팔 결제하기",
    testPayBtn: "[관리자/검토용] 1초 즉시 테스트 결제 승인",
    stylingBannerTag: "StylingHelper Fashion Link",
    stylingBannerTitle: "내 톤에 딱 맞는 이번 주 럭셔리 OOTD",
    stylingBannerDesc: "미국 5대 정품 유통사 100% 실시간 재고 룩북을 바로 감상하고 쇼핑해보세요.",
    stylingBannerBtn: "맞춤 룩북 보러가기",
    eduEyebrow: "세계관의 길 · 색채학 공식 가이드",
    eduTitle: "퍼스널 컬러 — 색과 톤의 차이는 무엇인가?",
    eduStep1Badge: "색 (Color) = 색상의 차이",
    eduStep1Desc: "색은 빨강, 파랑, 노랑, 초록처럼 색의 종류를 구분하는 기준입니다. 즉, 어떤 색인가를 의미합니다.",
    colorRed: "빨강",
    colorYellow: "노랑",
    colorBlue: "파랑",
    colorGreen: "초록",
    eduStep2Badge: "톤 (Tone) = 색의 성질",
    eduStep2Desc: "톤은 색의 명도(밝기)와 채도(선명함)가 결합하여 나타나는 성질입니다. 같은 색이라도 톤에 따라 전혀 다른 인상을 줍니다.",
    eduStep2Sub: "같은 파란색, 다른 톤의 예시",
    toneLight: "라이트톤",
    toneLightDesc: "밝고 부드러움",
    toneVivid: "비비드톤",
    toneVividDesc: "선명하고 강렬함",
    toneMute: "뮤트톤",
    toneMuteDesc: "차분하고 부드러움",
    toneDeep: "딥톤",
    toneDeepDesc: "어둡고 깊음",
    eduStep3Badge: "퍼스널 컬러의 4계절 톤",
    eduStep3Desc: "퍼스널 컬러는 색과 톤이 결합하여 사람의 피부, 머리카락, 눈동자와 조화롭게 어울리는 그룹을 4가지 계절 톤으로 나눕니다.",
    springWarmName: "봄 웜톤 (Spring Warm)",
    springWarmDesc: "밝고 맑고 선명한 느낌",
    summerCoolName: "여름 쿨톤 (Summer Cool)",
    summerCoolDesc: "부드럽고 차분한 느낌",
    autumnWarmName: "가을 웜톤 (Autumn Warm)",
    autumnWarmDesc: "깊고 차분하고 부드러운 느낌",
    winterCoolName: "겨울 쿨톤 (Winter Cool)",
    winterCoolDesc: "선명하고 대비가 강한 느낌",
    eduSummaryTitle: "핵심 정리",
    eduSumColorTag: "색 (Color)",
    eduSumColorTitle: "색상의 차이",
    eduSumColorDesc: "어떤 색인가 (빨강, 노랑, 파랑, 초록...)",
    eduSumToneTag: "톤 (Tone)",
    eduSumToneTitle: "색의 밝기와 선명함의 차이",
    eduSumToneDesc: "명도 + 채도 (라이트, 비비드, 뮤트, 딥...)",
    eduSumCoreTag: "퍼스널 컬러의 핵심",
    eduSumCoreTitle: "색상 + 톤 + 개인의 조화",
    eduSumCoreDesc: "자신에게 어울리는 색뿐 아니라 그 색의 톤까지 찾아내는 것",
  },
  en: {
    brandName: "PersonalColorHelper",
    brandTag: "AI PersonalColorHelper Studio",
    subtitle: "Find your signature tone, virtual draping fabrics & best lipstick matches in 3 seconds with PersonalColorHelper.",
    badgePrice: "Only $0.79 / Diagnosis",
    badgePayPal: "Official PayPal & Card",
    badgeNoLogin: "No Login Required · Instant Analysis",
    badgeMatrix: "12-Season Colorimetry Matrix",
    badgeDraping: "Real-time Virtual Fabric Draping",
    ticketLabel: "Pass",
    ticketUnit: "left",
    recharge: "+Top Up",
    uploadTitle: "Register Your Portrait",
    uploadDesc: "A natural light front-facing selfie works best. You can also explore instantly with our preset models below.",
    uploadFileBtn: "Upload Photo",
    cameraBtn: "Take Photo",
    cameraShootBtn: "Capture Now!",
    cameraGuide: "Align your face inside the circle",
    presetTitle: "1-Second Instant Model Exploration (Free):",
    presetSub: "Click to analyze instantly",
    drapingTitle: "Interactive Virtual Draping Studio",
    drapingDesc: "Experience a luxury salon draping session virtually by trying on signature color fabrics beneath your chin.",
    splitToggle: "Warm vs Cool Split Comparison",
    splitWarm: "Warm (Peach)",
    splitCool: "Cool (Lavender)",
    skinDetected: "Skin Tone Sampled",
    swatchTitle: "Switch Drape Fabrics (Tap to try)",
    swatchDesc: "The color that sharpens your jawline and brightens your complexion is your true signature tone.",
    metricTitle: "AI Colorimetric Metrics",
    metricSubtitle: "RGB / LAB Matrix",
    coolLabel: "Cool Tone",
    warmLabel: "Warm Tone",
    brightnessLabel: "Skin Lightness (Value):",
    saturationLabel: "Chroma Saturation:",
    tabResult: "12-Tone Report & Palette",
    tabCosmetics: "Signature Lipsticks & Pouch",
    saveInstaCard: "Export Instagram Story Card",
    bestPalette: "Best Palette (Glow & Radiance Boosting)",
    worstPalette: "Worst Palette (Colors to Avoid)",
    totalFormula: "Total Styling Prescription",
    jewelryTitle: "💍 Recommended Jewelry",
    baseTitle: "💆 Foundation Base",
    hairTitle: "💇 Hair Color Guide",
    fashionTitle: "👗 Wardrobe Styling",
    lipTitle: "Top 3 Signature Lipsticks",
    lipDesc: "Cult-classic department store bestsellers that instantly illuminate your skin tone.",
    lowestPrice: "Shop at Best Price",
    blushTitle: "🌸 Signature Cheek Blush",
    eyeTitle: "👁️ Sculpting Eyeshadow Palette",
    lockTitle: "Unlock Your Full 12-Tone Report & Luxury Lip Dossier",
    lockDesc: "Your facial color analysis with 5 best colors, worst colors, and 3 cult lipsticks is complete. Unlock instantly for just $0.79!",
    unlockBtn: "Unlock Full Dossier for $0.79 (PayPal / Card)",
    modalTitle: "Top Up Personal Color Passes",
    modalSubtitle: "Experience a $150 luxury personal color consultation for just $0.79 online.",
    singlePlanTag: "Most Popular Basic",
    singlePlanName: "1-Time Diagnostic Pass",
    singlePlanDesc: "12-Tone Dossier + Top 3 Lipsticks + Instagram Card",
    singlePrice: "$0.79",
    singlePriceSub: "₩1,000 KRW",
    triplePlanTag: "Best Value (16% OFF)",
    triplePlanName: "3-Pass Family & Friends Combo",
    triplePlanDesc: "Compare tones with your besties & family",
    triplePrice: "$1.89",
    triplePriceSub: "₩2,500 KRW",
    payWithPaypal: "Pay $0.79 with PayPal",
    payTriplePaypal: "Pay $1.89 with PayPal (3-Pack)",
    testPayBtn: "[Reviewer Test] Instant Approval (Free Simulation)",
    stylingBannerTag: "StylingHelper Fashion Link",
    stylingBannerTitle: "Luxury Outfits Curated for Your Tone",
    stylingBannerDesc: "Shop live US retail inventory (Zara US, Nordstrom, SSENSE) matched to your color palette.",
    stylingBannerBtn: "Explore Matching Lookbook",
    eduEyebrow: "COLOR SCIENCE ACADEMY",
    eduTitle: "Personal Color — What is the Difference Between Color and Tone?",
    eduStep1Badge: "Color = Hue Difference",
    eduStep1Desc: "Color classifies the category of light wavelengths, such as Red, Yellow, Blue, or Green. It simply answers: 'Which color is it?'",
    colorRed: "Red",
    colorYellow: "Yellow",
    colorBlue: "Blue",
    colorGreen: "Green",
    eduStep2Badge: "Tone = Character of Color",
    eduStep2Desc: "Tone is created by combining Value (Lightness) and Chroma (Saturation). Even the exact same blue conveys an entirely different impression depending on its tone.",
    eduStep2Sub: "Example: Same Blue in 4 Different Tones",
    toneLight: "Light Tone",
    toneLightDesc: "Bright & Gentle",
    toneVivid: "Vivid Tone",
    toneVividDesc: "Clear & Intense",
    toneMute: "Mute Tone",
    toneMuteDesc: "Calm & Soft",
    toneDeep: "Deep Tone",
    toneDeepDesc: "Dark & Rich",
    eduStep3Badge: "The 4 Seasonal Tones of Personal Color",
    eduStep3Desc: "Personal color unites hue and tone into 4 seasonal groups that harmonize with your skin tone, hair, and eye contrast.",
    springWarmName: "Spring Warm",
    springWarmDesc: "Bright, fresh, and clear radiance",
    summerCoolName: "Summer Cool",
    summerCoolDesc: "Soft, misty, and delicate elegance",
    autumnWarmName: "Autumn Warm",
    autumnWarmDesc: "Deep, earthy, and warm sophistication",
    winterCoolName: "Winter Cool",
    winterCoolDesc: "High-contrast, bold, and dramatic clarity",
    eduSummaryTitle: "Key Takeaway",
    eduSumColorTag: "Color (Hue)",
    eduSumColorTitle: "Hue Difference",
    eduSumColorDesc: "Which color category (Red, Yellow, Blue, Green...)",
    eduSumToneTag: "Tone (Value + Chroma)",
    eduSumToneTitle: "Lightness & Saturation",
    eduSumToneDesc: "Brightness & Purity (Light, Vivid, Mute, Deep...)",
    eduSumCoreTag: "Core of Personal Color",
    eduSumCoreTitle: "Color + Tone + Personal Harmony",
    eduSumCoreDesc: "Finding not just your color, but the exact seasonal TONE that illuminates you.",
  },
  ja: {
    brandName: "パーソナルカラーヘルパー",
    brandTag: "AIパーソナルカラーヘルパー",
    subtitle: "あなたの顔立ちに最も似合う「一生モノの似合わせカラー」とバーチャルドレープを3秒で診断するパーソナルカラーヘルパー",
    badgePrice: "1回たったの120円 (¥120)",
    badgePayPal: "PayPal＆クレジットカード対応",
    badgeNoLogin: "ログイン不要・3秒で即時診断",
    badgeMatrix: "12タイプ精密色彩学マトリックス",
    badgeDraping: "サロン級バーチャルドレープ体験",
    ticketLabel: "診断チケット",
    ticketUnit: "回",
    recharge: "+チャージ",
    uploadTitle: "お顔の写真をご用意ください",
    uploadDesc: "自然光で撮影した正面自撮りが最も正確です。下のサンプルモデルですぐに体験することも可能です。",
    uploadFileBtn: "写真ファイルをアップロード",
    cameraBtn: "カメラで撮影",
    cameraShootBtn: "今すぐ撮影！",
    cameraGuide: "円の中にお顔を合わせてください",
    presetTitle: "写真なしで1秒即診断モデル (無料公開中):",
    presetSub: "クリックですぐに結果を表示",
    drapingTitle: "インタラクティブ・バーチャルドレープ (Virtual Draping)",
    drapingDesc: "実際のパーソナルカラーサロンのように、お顔の下に診断布（ドレープ）をリアルタイムで当てて顔色の変化を体験できます。",
    splitToggle: "イエベ vs ブルベ 半々比較",
    splitWarm: "イエベ (ピーチ)",
    splitCool: "ブルベ (ラベンダー)",
    skinDetected: "肌トーン検出完了",
    swatchTitle: "ドレープ布を切り替える (タップして体験)",
    swatchDesc: "布を当てた時にフェイスラインが引き締まり、透明感が一気に引き立つ色があなたの本命カラーです。",
    metricTitle: "AI色彩学パラメーター分析",
    metricSubtitle: "RGB / LAB色空間マトリックス",
    coolLabel: "ブルベ (Cool)",
    warmLabel: "イエベ (Warm)",
    brightnessLabel: "肌の明るさ (明度):",
    saturationLabel: "鮮やかさ (彩度):",
    tabResult: "12タイプ診断結果＆カラーパレット",
    tabCosmetics: "人生神リップ＆コスメ処方箋",
    saveInstaCard: "インスタストーリー用画像を保存",
    bestPalette: "ベストパレット (透明感と血色感が引き立つ色)",
    worstPalette: "ワーストパレット (肌がくすんで見えやすい要注意色)",
    totalFormula: "トータルスタイリング処方箋",
    jewelryTitle: "💍 似合うジュエリー",
    baseTitle: "💆 ベースメイクの選び方",
    hairTitle: "💇 おすすめヘアカラー",
    fashionTitle: "👗 ファッション着こなし術",
    lipTitle: "運命の神リップ 3選",
    lipDesc: "ひと塗りで顔全体にパッとスポットライトが当たったように華やぐ、デパコス・プチプラの超名作リップです。",
    lowestPrice: "最安値・商品を見る",
    blushTitle: "🌸 相性抜群チーク",
    eyeTitle: "👁️ 陰影アイシャドウパレット",
    lockTitle: "あなただけの12タイプ精密診断書＆神リップ処方箋",
    lockDesc: "お顔写真に基づき、ベストカラー5選・苦手カラー・似合うデパコス神リップ3選の分析が完了しました。1回120円ですぐにロック解除できます！",
    unlockBtn: "120円で結果を今すぐ見る (PayPal / カード)",
    modalTitle: "パーソナルカラー診断チケットのチャージ",
    modalSubtitle: "表参道・銀座サロンの1.5万円の診断体験を、オンラインなら1回120円でいつでも手軽に。",
    singlePlanTag: "一番人気！お手軽お試し",
    singlePlanName: "1回 精密診断チケット",
    singlePlanDesc: "12タイプ詳細診断＋神リップ3選＋インスタカード",
    singlePrice: "¥120",
    singlePriceSub: "$0.79 USD",
    triplePlanTag: "16%お得なセット",
    triplePlanName: "3回 お友達・家族シェアセット",
    triplePlanDesc: "お友達や家族と一緒にパーソナルカラーを比較",
    triplePrice: "¥280",
    triplePriceSub: "$1.89 USD",
    payWithPaypal: "PayPalで ¥120 を決済する",
    payTriplePaypal: "PayPalで ¥280 を決済する (3回券)",
    testPayBtn: "[管理者・レビュー用] 1秒でテスト決済承認",
    stylingBannerTag: "StylingHelper Fashion Link",
    stylingBannerTitle: "あなたのシーズンに最も映える今週のラグジュアリーOOTD",
    stylingBannerDesc: "アメリカ人気ブランド（Zara US、Nordstrom、SSENSE）のリアルタイム在庫コーデをチェック。",
    stylingBannerBtn: "似合わせルックブックを見る",
    eduEyebrow: "色彩学マスタークラス · 公式ガイド",
    eduTitle: "パーソナルカラー — 色とトーンの違いとは？",
    eduStep1Badge: "色 (Color) ＝ 色相の違い",
    eduStep1Desc: "色は赤、黄、青、緑のように色の種類を区別する基準です。つまり「何色か」を意味します。",
    colorRed: "赤 (Red)",
    colorYellow: "黄 (Yellow)",
    colorBlue: "青 (Blue)",
    colorGreen: "緑 (Green)",
    eduStep2Badge: "トーン (Tone) ＝ 色の性質",
    eduStep2Desc: "トーンは色の明度（明るさ）と彩度（鮮やかさ）が結びついて現れる性質です。同じ青でもトーンによって全く異なる印象を与えます。",
    eduStep2Sub: "同じ青色・異なるトーンの例",
    toneLight: "ライトトーン",
    toneLightDesc: "明るく柔らかい",
    toneVivid: "ビビッドトーン",
    toneVividDesc: "鮮やかで強烈",
    toneMute: "ミュートトーン",
    toneMuteDesc: "落ち着きと上品さ",
    toneDeep: "ディープトーン",
    toneDeepDesc: "深みと重厚感",
    eduStep3Badge: "パーソナルカラーの4シーズン・トーン",
    eduStep3Desc: "パーソナルカラーは色とトーンが結合し、人の肌・髪・瞳の色と最も調和するグループを4つの季節タイプに分類します。",
    springWarmName: "イエベ春 (Spring Warm)",
    springWarmDesc: "明るく澄んで華やかな印象",
    summerCoolName: "ブルベ夏 (Summer Cool)",
    summerCoolDesc: "柔らかく上品で落ち着いた印象",
    autumnWarmName: "イエベ秋 (Autumn Warm)",
    autumnWarmDesc: "深みがありシックで温かい印象",
    winterCoolName: "ブルベ冬 (Winter Cool)",
    winterCoolDesc: "鮮やかでコントラストが際立つ印象",
    eduSummaryTitle: "重要まとめ",
    eduSumColorTag: "色 (Color)",
    eduSumColorTitle: "色相の違い",
    eduSumColorDesc: "何色か（赤、黄、青、緑...）",
    eduSumToneTag: "トーン (Tone)",
    eduSumToneTitle: "明るさと鮮やかさの違い",
    eduSumToneDesc: "明度＋彩度（ライト、ビビッド、ミュート、ディープ...）",
    eduSumCoreTag: "パーソナルカラーの核心",
    eduSumCoreTitle: "色相 ＋ トーン ＋ 個人の調和",
    eduSumCoreDesc: "似合う色だけでなく、その色の最適な「トーン」まで突き止めること",
  },
};

// ─── 12톤 퍼스널 컬러 데이터 정의 ──────────────────────────────
interface ColorToneData {
  id: string;
  seasonNames: { ko: string; en: string; ja: string };
  titles: { ko: string; en: string; ja: string };
  slogans: { ko: string; en: string; ja: string };
  summaries: { ko: string; en: string; ja: string };
  temperature: "WARM" | "COOL";
  lightness: "LIGHT" | "MUTE" | "BRIGHT" | "DEEP";
  saturation: "HIGH" | "MEDIUM" | "LOW";
  bestColors: { name: { ko: string; en: string; ja: string }; hex: string }[];
  worstColors: { name: { ko: string; en: string; ja: string }; hex: string }[];
  drapeSwatches: { name: { ko: string; en: string; ja: string }; hex: string; desc: { ko: string; en: string; ja: string } }[];
  cosmetics: {
    lips: { brand: string; name: string; hex: string; note: { ko: string; en: string; ja: string } }[];
    blush: { brand: string; name: string; hex: string; note: { ko: string; en: string; ja: string } }[];
    eye: { brand: string; name: string; hex: string; note: { ko: string; en: string; ja: string } }[];
  };
  stylingGuide: {
    jewelry: { ko: string; en: string; ja: string };
    jewelryDesc: { ko: string; en: string; ja: string };
    foundation: { ko: string; en: string; ja: string };
    hairColor: { ko: string; en: string; ja: string };
    fashionTip: { ko: string; en: string; ja: string };
  };
  keywords: { ko: string[]; en: string[]; ja: string[] };
}

const PERSONAL_COLOR_DB: Record<string, ColorToneData> = {
  spring_light: {
    id: "spring_light",
    seasonNames: { ko: "봄 웜톤", en: "Spring Warm", ja: "イエベ春" },
    titles: { ko: "봄 웜 라이트", en: "Light Spring", ja: "イエベ春 ライト (スプリング・ライト)" },
    slogans: {
      ko: "봄 햇살처럼 맑고 투명한 복숭앗빛 생기",
      en: "Sunlit Peach Glow · Dewy & Transparent Radiance",
      ja: "春の木漏れ日のように澄んだピーチの透明感と多幸感",
    },
    summaries: {
      ko: "노란 기가 도는 맑고 밝은 파스텔톤이 가장 잘 어울리며, 수채화처럼 가볍고 화사한 톤으로 안색이 즉시 살아납니다.",
      en: "Soft, warm pastel hues with yellow undertones harmonize perfectly with your skin, bringing out a fresh, dewy radiance.",
      ja: "黄みがかった明るく澄んだパステルカラーが最もよく似合い、水彩画のようにふんわりと肌の血色感を高めます。",
    },
    temperature: "WARM",
    lightness: "LIGHT",
    saturation: "MEDIUM",
    bestColors: [
      { name: { ko: "피치 코랄", en: "Peach Coral", ja: "ピーチコーラル" }, hex: "#FFA07A" },
      { name: { ko: "살구 크림", en: "Apricot Cream", ja: "アプリコット" }, hex: "#FFE4B5" },
      { name: { ko: "바닐라 옐로우", en: "Vanilla Yellow", ja: "バニライエロー" }, hex: "#FFF275" },
      { name: { ko: "라이트 아쿠아", en: "Light Aqua", ja: "ライトアクア" }, hex: "#A8E6CF" },
      { name: { ko: "소프트 웜핑크", en: "Soft Warm Pink", ja: "ウォームピンク" }, hex: "#FFB6C1" },
    ],
    worstColors: [
      { name: { ko: "다크 챠콜", en: "Dark Charcoal", ja: "ダークチャコール" }, hex: "#2C3E50" },
      { name: { ko: "딥 버건디", en: "Deep Burgundy", ja: "ディープバーガンディ" }, hex: "#4A0E17" },
      { name: { ko: "탁한 그레이", en: "Muted Gray", ja: "くすみグレー" }, hex: "#7F8C8D" },
    ],
    drapeSwatches: [
      { name: { ko: "피치 코랄", en: "Peach Coral", ja: "ピーチコーラル" }, hex: "#FFA07A", desc: { ko: "생기 부스팅", en: "Glow Boost", ja: "多幸感アップ" } },
      { name: { ko: "바닐라 옐로우", en: "Vanilla Yellow", ja: "バニライエロー" }, hex: "#FFF275", desc: { ko: "안색 톤업", en: "Tone Brightening", ja: "透明感トーンアップ" } },
      { name: { ko: "라이트 아쿠아", en: "Light Aqua", ja: "ライトアクア" }, hex: "#98FB98", desc: { ko: "청량감", en: "Fresh Coolness", ja: "爽やかな明るさ" } },
      { name: { ko: "소프트 웜핑크", en: "Soft Warm Pink", ja: "ウォームピンク" }, hex: "#FFB6C1", desc: { ko: "혈색 강조", en: "Cheek Flush", ja: "ふんわり血色感" } },
    ],
    cosmetics: {
      lips: [
        { brand: "Dior", name: "Addict Lip Glow 004 Coral", hex: "#FF7675", note: { ko: "촉촉한 살구빛 생기 립밤", en: "Dewy sheer coral lip balm", ja: "みずみずしい透け感コーラル" } },
        { brand: "Rom&nd", name: "Juicy Lasting Tint Jujube", hex: "#E17055", note: { ko: "자연스러운 데일리 대추 코랄", en: "Natural daily soft apricot", ja: "自然に馴染むデイリーコーラル" } },
        { brand: "MAC", name: "Lustreglass Lipstick See Sheer", hex: "#F39C12", note: { ko: "맑고 투명한 쉬어 자몽 코랄", en: "Luminous sheer grapefruit", ja: "透明感あふれるシアーピンクグレープ" } },
      ],
      blush: [
        { brand: "NARS", name: "Blush Sex Appeal", hex: "#FFD3B6", note: { ko: "뽀얀 소프트 살구 피치", en: "Silky soft peach", ja: "白みのあるやわらかピーチ" } },
        { brand: "Clinique", name: "Cheek Pop Melon Pop", hex: "#FFA07A", note: { ko: "맑게 물드는 맑은 코랄", en: "Watercolor luminous melon", ja: "澄んだメロンコーラル" } },
      ],
      eye: [
        { brand: "Dasique", name: "Shadow Palette Peach Squeeze", hex: "#E6C29E", note: { ko: "살구빛 글리터 & 음영", en: "Warm peach shimmer & contour", ja: "ピーチトーンのラメ＆陰影" } },
      ],
    },
    stylingGuide: {
      jewelry: { ko: "라이트 골드 / 로즈골드", en: "Light Gold / Rose Gold", ja: "シャンパンゴールド / ピンクゴールド" },
      jewelryDesc: {
        ko: "묵직한 옐로우 골드보다는 반짝이는 14K 샴페인 골드나 로즈골드가 화사함을 극대화합니다.",
        en: "Delicate 14K champagne gold or rose gold enhances your natural glow much better than heavy yellow gold.",
        ja: "重厚なイエローゴールドよりも、繊細に輝く14Kシャンパンゴールドやピンクゴールドが最も映えます。",
      },
      foundation: { ko: "19호~21호 옐로우 / 뉴트럴 베이스 글로우", en: "Fair/Light Neutral Glow Cushion (19N-21N)", ja: "明るめイエロー〜ニュートラル系 ツヤ肌クッション" },
      hairColor: { ko: "밀크 브라운, 라이트 카라멜, 허니 브라운", en: "Milk Brown, Light Caramel, Honey Blonde", ja: "ミルクティーブラウン、ライトキャラメル、ハニーブラウン" },
      fashionTip: {
        ko: "린넨 아이보리, 크림 화이트, 파스텔 카디건을 매치하면 3배 청초해 보입니다.",
        en: "Pair with linen ivory, soft cream knitwear, and pastel cardigans for effortless elegance.",
        ja: "リネンアイボリーやミルキーホワイト、パステルカラーのカーディガンを羽織ると圧倒的な透明感が出ます。",
      },
    },
    keywords: {
      ko: ["#화사함", "#생기코랄", "#복숭아상", "#과즙미", "#소프트파스텔"],
      en: ["#DewyGlow", "#PeachCoral", "#SoftPastel", "#JuicyVibe", "#FreshLight"],
      ja: ["#透明感", "#多幸感メイク", "#ピーチコーラル", "#愛され顔", "#春パステル"],
    },
  },
  summer_light: {
    id: "summer_light",
    seasonNames: { ko: "여름 쿨톤", en: "Summer Cool", ja: "ブルベ夏" },
    titles: { ko: "여름 쿨 라이트", en: "Light Summer", ja: "ブルベ夏 ライト (サマー・ライト)" },
    slogans: {
      ko: "새벽안개처럼 뽀얗고 청량한 파스텔 수채화",
      en: "Cool Lavender Mist · Airy & Porcelain Watercolor",
      ja: "朝霧のように澄み渡るラベンダー＆パステルブルーの透明感",
    },
    summaries: {
      ko: "푸른 기가 도는 하얗고 투명한 파스텔 컬러가 최적입니다. 라벤더, 베이비 핑크를 얹었을 때 피부가 도자기처럼 투명해집니다.",
      en: "Cool, delicate pastel hues with soft blue undertones like baby pink and pale lavender make your complexion look porcelain clear.",
      ja: "青みを帯びた淡く澄んだパステルカラーがベスト。ラベンダーやベビーピンクをまとうと、肌が白玉のように透き通ります。",
    },
    temperature: "COOL",
    lightness: "LIGHT",
    saturation: "LOW",
    bestColors: [
      { name: { ko: "베이비 핑크", en: "Baby Pink", ja: "ベビーピンク" }, hex: "#F8BBD0" },
      { name: { ko: "파스텔 라벤더", en: "Pastel Lavender", ja: "パステルラベンダー" }, hex: "#E1BEE7" },
      { name: { ko: "스카이 블루", en: "Sky Blue", ja: "スカイブルー" }, hex: "#B3E5FC" },
      { name: { ko: "민트 아이스", en: "Mint Ice", ja: "ミントアイス" }, hex: "#B2DFDB" },
      { name: { ko: "소프트 라일락", en: "Soft Lilac", ja: "ソフトライラック" }, hex: "#D1C4E9" },
    ],
    worstColors: [
      { name: { ko: "카멜 브라운", en: "Camel Brown", ja: "キャメルブラウン" }, hex: "#D35400" },
      { name: { ko: "황토 베이지", en: "Ochre Beige", ja: "黄土ベージュ" }, hex: "#B78E5E" },
      { name: { ko: "머스타드 옐로우", en: "Mustard Yellow", ja: "マスタードイエロー" }, hex: "#F39C12" },
    ],
    drapeSwatches: [
      { name: { ko: "베이비 핑크", en: "Baby Pink", ja: "ベビーピンク" }, hex: "#F8BBD0", desc: { ko: "피부 투명도 극대화", en: "Porcelain Radiance", ja: "圧倒的白肌感" } },
      { name: { ko: "파스텔 라벤더", en: "Pastel Lavender", ja: "パステルラベンダー" }, hex: "#E1BEE7", desc: { ko: "황기 완벽 차단", en: "Cancels Sallow Tones", ja: "黄ぐすみ完全リセット" } },
      { name: { ko: "스카이 블루", en: "Sky Blue", ja: "スカイブルー" }, hex: "#B3E5FC", desc: { ko: "청량한 쿨톤 빛", en: "Crisp Cool Breeze", ja: "澄んだ清涼感" } },
      { name: { ko: "화이트 밀크", en: "Milky White", ja: "ミルキーホワイト" }, hex: "#F5F6FA", desc: { ko: "도자기 베이스", en: "Pure Clean Canvas", ja: "陶器肌ハイライト" } },
    ],
    cosmetics: {
      lips: [
        { brand: "Dior", name: "Addict Lip Glow 001 Pink", hex: "#F8BBD0", note: { ko: "여리여리 맑은 우유 핑크", en: "Iconic sheer petal pink", ja: "永遠の王道モテピンク" } },
        { brand: "Rom&nd", name: "Dewyful Water Tint Cherry Way", hex: "#FF6B81", note: { ko: "물먹은 청량 핑크", en: "Dewy fresh berry sheen", ja: "みずみずしいクリアチェリー" } },
        { brand: "Chanel", name: "Rouge Coco Flash 91 Bohème", hex: "#E056FD", note: { ko: "맑은 라즈베리 핑크", en: "Luminous raspberry shine", ja: "上品なシアーラズベリー" } },
      ],
      blush: [
        { brand: "Rom&nd", name: "Better Than Cheek Strawberry Milk", hex: "#FCE4EC", note: { ko: "뽀얀 딸기우유 블러셔", en: "Soft pastel strawberry milk", ja: "ふんわり苺ミルクチーク" } },
        { brand: "Clinique", name: "Cheek Pop Ballerina Pop", hex: "#F8BBD0", note: { ko: "수채화 라벤더 핑크", en: "Delicate ballerina lavender", ja: "透明感爆発 バレリーナポップ" } },
      ],
      eye: [
        { brand: "Dasique", name: "Shadow Palette Berry Smoothie", hex: "#E1BEE7", note: { ko: "쿨 핑크 파스텔 음영", en: "Cool berry mauve contours", ja: "涼しげなベリーモーヴパレット" } },
      ],
    },
    stylingGuide: {
      jewelry: { ko: "실버 / 화이트골드 / 플래티넘", en: "Silver / White Gold / Platinum", ja: "シルバー / ホワイトゴールド / プラチナ" },
      jewelryDesc: {
        ko: "노란 기가 없는 깨끗한 은빛 주얼리가 뽀얀 피부톤을 독보적으로 돋보이게 합니다.",
        en: "Pure silver, white gold, or platinum brings out the clearest undertones of your skin.",
        ja: "黄みのないクリーンなシルバーやプラチナの輝きが、肌の白さと透明感を格上げします。",
      },
      foundation: { ko: "17호~21호 핑크 베이스 / 세미 글로우 쿠션", en: "Fair/Porcelain Cool Pink Base (17C-21C)", ja: "ピンク系・クールトーン 明るめセミツヤファンデ" },
      hairColor: { ko: "애쉬 블론드, 쿨 다크브라운, 내추럴 블랙", en: "Ash Brown, Cool Dark Chestnut, Soft Black", ja: "アッシュグレージュ、クールダークブラウン、地毛風ブラック" },
      fashionTip: {
        ko: "순백의 화이트 셔츠나 연하늘색 셔츠를 입었을 때 안색이 가장 깨끗해 보입니다.",
        en: "Crisp white poplin shirts and light sky-blue tailored separates create a fresh editorial look.",
        ja: "クリーンな白シャツやアイシーブルーのブラウスを合わせると、肌が息をのむほど綺麗に見えます。",
      },
    },
    keywords: {
      ko: ["#청순보스", "#딸기우유", "#수채화발색", "#여리여리", "#은빛실버"],
      en: ["#PorcelainSkin", "#CoolLilac", "#AiryPastel", "#CleanBeauty", "#SilverGlow"],
      ja: ["#ブルベ夏", "#白肌の神", "#ラベンダーチーク", "#儚げメイク", "#銀の輝き"],
    },
  },
  autumn_mute: {
    id: "autumn_mute",
    seasonNames: { ko: "가을 웜톤", en: "Autumn Warm", ja: "イエベ秋" },
    titles: { ko: "가을 웜 뮤트", en: "Soft Autumn", ja: "イエベ秋 ミュート (オータム・ソフト)" },
    slogans: {
      ko: "부드럽고 그윽한 말린 단풍잎 & 오트밀 베이지",
      en: "Velvet Cashmere MLBB · Warm Oatmeal & Dried Roses",
      ja: "上質なカシミヤのようにまろやかなオートミール＆大人ドライローズ",
    },
    summaries: {
      ko: "따뜻한 온도감과 부드러운 그레이시 웜톤이 조화를 이룹니다. 클래식하고 차분한 브라운·카키·베이지에서 깊은 매력이 피어납니다.",
      en: "Muted, warm earthy tones with a whisper of soft gray harmonize to create an effortlessly chic, sophisticated aura.",
      ja: "温かみとくすみ感が絶妙に溶け合う上品なソフトアースカラー。ベージュやトープをまとえば洗練された大人の気品が漂います。",
    },
    temperature: "WARM",
    lightness: "MUTE",
    saturation: "MEDIUM",
    bestColors: [
      { name: { ko: "오트밀 베이지", en: "Oatmeal Beige", ja: "オートミールベージュ" }, hex: "#D7CCC8" },
      { name: { ko: "말린 장미 (MLBB)", en: "Dried Rose MLBB", ja: "ドライローズ (MLBB)" }, hex: "#B37D77" },
      { name: { ko: "소프트 카키", en: "Soft Khaki", ja: "ソフトカーキ" }, hex: "#8D9B7B" },
      { name: { ko: "카라멜 브라운", en: "Caramel Brown", ja: "キャラメルブラウン" }, hex: "#A67C52" },
      { name: { ko: "테라코타 샌드", en: "Terracotta Sand", ja: "テラコッタサンド" }, hex: "#C28569" },
    ],
    worstColors: [
      { name: { ko: "형광 핫핑크", en: "Neon Fuchsia", ja: "蛍光ホットピンク" }, hex: "#FF007F" },
      { name: { ko: "차가운 코발트 블루", en: "Cobalt Blue", ja: "冷たいコバルトブルー" }, hex: "#002366" },
      { name: { ko: "시안 블루", en: "Cyan Blue", ja: "シアンブルー" }, hex: "#00CED1" },
    ],
    drapeSwatches: [
      { name: { ko: "오트밀 베이지", en: "Oatmeal Beige", ja: "オートミールベージュ" }, hex: "#D7CCC8", desc: { ko: "편안하고 단아한 톤", en: "Effortless Warmth", ja: "落ち着いた品の良さ" } },
      { name: { ko: "말린 장미 (MLBB)", en: "Dried Rose", ja: "ドライローズ" }, hex: "#B37D77", desc: { ko: "자연스러운 음영감", en: "Sculpted Natural Flush", ja: "絶妙な血色グラデ" } },
      { name: { ko: "소프트 카키", en: "Soft Khaki", ja: "ソフトカーキ" }, hex: "#8D9B7B", desc: { ko: "분위기 있는 가을빛", en: "Chic Earthy Depth", ja: "大人っぽい陰影感" } },
      { name: { ko: "카라멜 브라운", en: "Caramel Brown", ja: "キャラメルブラウン" }, hex: "#A67C52", desc: { ko: "그윽한 입체감", en: "Rich Warm Glow", ja: "深みのあるニュアンス" } },
    ],
    cosmetics: {
      lips: [
        { brand: "MAC", name: "Powder Kiss Mull It Over", hex: "#C47C68", note: { ko: "원조 말린 살구 MLBB", en: "The iconic soft dirty peach", ja: "元祖神色 まろやかアプリコットMLBB" } },
        { brand: "Bobbi Brown", name: "Crushed Lip Color Cabana", hex: "#BD6B5B", note: { ko: "소프트 브라운 코랄", en: "Blotted warm coral rose", ja: "抜け感のあるブラウンコーラル" } },
        { brand: "3CE", name: "Velvet Lip Tint Near and Dear", hex: "#BA7974", note: { ko: "차분한 웜 핑크베이지", en: "Velvety muted warm nude", ja: "ふんわり温もりピンクベージュ" } },
      ],
      blush: [
        { brand: "NARS", name: "Blush Gina / Luster", hex: "#C07D67", note: { ko: "은은한 골든 피치 브라운", en: "Golden apricot warmth", ja: "肌に溶け込むゴールデンピーチ" } },
      ],
      eye: [
        { brand: "Rom&nd", name: "Better Than Palette Mahogany Garden", hex: "#9E7B66", note: { ko: "소프트 브라운 음영", en: "Rich natural mahogany gradients", ja: "捨て色なし マホガニー陰影パレット" } },
      ],
    },
    stylingGuide: {
      jewelry: { ko: "빈티지 골드 / 브론즈 / 로즈골드", en: "Vintage Matte Gold / Bronze", ja: "マットゴールド / アンティークブロンズ" },
      jewelryDesc: {
        ko: "앤틱하고 매트한 옐로우 골드가 클래식한 무드를 완벽히 살려줍니다.",
        en: "Brushed matte yellow gold or antique brass complements your velvety warmth.",
        ja: "ツヤを抑えたマットゴールドやヴィンテージ感のある真鍮アクセが完璧に調和します。",
      },
      foundation: { ko: "21호~23호 웜 뉴트럴 벨벳 피니시", en: "Medium Warm Neutral Velvet Matte (21W-23W)", ja: "ナチュラルオークル系 セミマット・ベルベット肌" },
      hairColor: { ko: "초코 브라운, 웜 모카, 밤비 브라운", en: "Choco Brown, Warm Mocha, Chestnut", ja: "ショコラブラウン、モカベージュ、マロンブラウン" },
      fashionTip: {
        ko: "트렌치 코트, 캐시미어 니트, 베이지 슬랙스를 입었을 때 가을 여신 분위기가 완성됩니다.",
        en: "Trench coats, cashmere knitwear, and camel trousers bring out peak runway chic.",
        ja: "トレンチコート、上質なカシミヤニット、キャメルパンツを合わせると最高のオーラを放ちます。",
      },
    },
    keywords: {
      ko: ["#분위기여신", "#MLBB", "#트렌치코트", "#따뜻한음영", "#내추럴클래식"],
      en: ["#QuietLuxury", "#CashmereWarmth", "#EarthyChic", "#VelvetLip", "#AutumnMuse"],
      ja: ["#イエベ秋", "#抜け感メイク", "#トレンチコート", "#大人カジュアル", "#血色MLBB"],
    },
  },
  winter_bright: {
    id: "winter_bright",
    seasonNames: { ko: "겨울 쿨톤", en: "Winter Cool", ja: "ブルベ冬" },
    titles: { ko: "겨울 쿨 브라이트", en: "Bright Winter", ja: "ブルベ冬 ブライト (ウィンター・クリア)" },
    slogans: {
      ko: "눈부신 설원 위의 선명한 마젠타 핑크 & 로열 블루",
      en: "Glacial Neon Contrast · High-Voltage Ruby & Cobalt",
      ja: "白銀の世界に映えわたる鮮烈なマゼンタ＆ロイヤルコバルトブルー",
    },
    summaries: {
      ko: "얼음처럼 차갑고 쨍한 비비드 쿨 컬러를 완벽히 소화합니다. 대비감이 강할수록 얼굴이 깨끗하게 밝혀집니다.",
      en: "High-contrast, icy saturated tones bring unmatched clarity and drama to your striking features.",
      ja: "冴えわたるクリアで鮮明なヴィヴィッドクールカラーが主役。コントラストが強いほど、肌の白さと目力が際立ちます。",
    },
    temperature: "COOL",
    lightness: "BRIGHT",
    saturation: "HIGH",
    bestColors: [
      { name: { ko: "마젠타 핑크", en: "Magenta Pink", ja: "マゼンタピンク" }, hex: "#FF007F" },
      { name: { ko: "로열 코발트 블루", en: "Royal Cobalt", ja: "ロイヤルコバルト" }, hex: "#002366" },
      { name: { ko: "트루 체리 레드", en: "True Cherry Red", ja: "チェリーレッド" }, hex: "#D63031" },
      { name: { ko: "에메랄드 그린", en: "Emerald Green", ja: "エメラルドグリーン" }, hex: "#009432" },
      { name: { ko: "퓨어 스노우 화이트", en: "Pure Snow White", ja: "ピュアスノーホワイト" }, hex: "#FFFFFF" },
    ],
    worstColors: [
      { name: { ko: "탁한 황토색", en: "Muddy Ochre", ja: "濁った黄土色" }, hex: "#A0522D" },
      { name: { ko: "머스타드 카키", en: "Mustard Khaki", ja: "くすみマスタード" }, hex: "#808000" },
      { name: { ko: "살구 오렌지", en: "Apricot Orange", ja: "サーモンオレンジ" }, hex: "#FF8C00" },
    ],
    drapeSwatches: [
      { name: { ko: "마젠타 핑크", en: "Magenta Pink", ja: "マゼンタピンク" }, hex: "#FF007F", desc: { ko: "안색 1초 톤업", en: "Instant Face Lighting", ja: "一瞬でライトアップ" } },
      { name: { ko: "로열 코발트 블루", en: "Royal Cobalt", ja: "ロイヤルコバルト" }, hex: "#002366", desc: { ko: "투명하고 하얀 피부", en: "Deep Chilled Contrast", ja: "冴えた透明美白" } },
      { name: { ko: "트루 체리 레드", en: "True Cherry Red", ja: "チェリーレッド" }, hex: "#D63031", desc: { ko: "강렬한 레드 포인트", en: "Bold Hollywood Red", ja: "主役級の赤リップ映え" } },
      { name: { ko: "퓨어 화이트", en: "Pure White", ja: "ピュアホワイト" }, hex: "#FFFFFF", desc: { ko: "선명한 흑백 대비", en: "Black-and-White Contrast", ja: "究極のメリハリ感" } },
    ],
    cosmetics: {
      lips: [
        { brand: "MAC", name: "Retro Matte Lipstick Ruby Woo", hex: "#C0392B", note: { ko: "푸른기 도는 정석 레드", en: "The iconic blue-based vivid red", ja: "青みを含んだ伝説の赤リップ ルビーウー" } },
        { brand: "YSL", name: "Vernis À Lèvres 9 Rouge Laqué", hex: "#D63031", note: { ko: "유리알 체리 레드", en: "Glossy high-shine crimson lacquer", ja: "息をのむガラス玉チェリーレッド" } },
        { brand: "Rom&nd", name: "Zero Velvet Tint Fizz", hex: "#E84393", note: { ko: "형광등 켠 쿨 체리핑크", en: "Vibrant cool magenta fuchsia", ja: "顔色が一気に華やぐブライトチェリー" } },
      ],
      blush: [
        { brand: "Clinique", name: "Cheek Pop Pansy Pop", hex: "#9B59B6", note: { ko: "맑은 쿨 퍼플 베리", en: "Bright translucent pansy berry", ja: "くすみを一掃する名品パンジーポップ" } },
      ],
      eye: [
        { brand: "Clio", name: "Pro Eye Palette Crystal Paw", hex: "#CBD5E1", note: { ko: "클리어 실버 글리터", en: "Chilled icy diamond sparkle", ja: "澄みきったアイシーダイヤモンドラメ" } },
      ],
    },
    stylingGuide: {
      jewelry: { ko: "고광택 플래티넘 / 화이트골드 / 다이아몬드", en: "High-Polished Platinum / Diamond", ja: "プラチナ / ホワイトゴールド / ダイヤ" },
      jewelryDesc: {
        ko: "눈부시게 번쩍이는 차가운 화이트 실버와 큐빅이 조명판 역할을 합니다.",
        en: "Mirror-finish white gold, platinum, and brilliant diamonds maximize your high-contrast beauty.",
        ja: "強い輝きを放つプラチナやダイヤモンドが、あなたの持つ強い目力をドラマティックに際立たせます。",
      },
      foundation: { ko: "17호~21호 쿨 핑크 베이스 (도자기 매트)", en: "Porcelain Cool Tone Matte/Radiant (17C-21C)", ja: "ピンク寄りの明るめ 陶器肌ハイカバーファンデ" },
      hairColor: { ko: "칠흑 같은 흑발 (블루 블랙), 쿨 플래티넘", en: "Blue Black, Jet Black, Platinum Silver", ja: "漆黒ブルーブラック、ダークシルバーアッシュ" },
      fashionTip: {
        ko: "올 블랙에 마젠타 머플러, 또는 흑백 대비가 확실한 룩이 독보적으로 어울립니다.",
        en: "All-black tailoring accented with a striking cobalt blue or magenta coat creates iconic street style.",
        ja: "オールブラックコーデにマゼンタやロイヤルブルーを1点効かせたモードスタイルが圧巻です。",
      },
    },
    keywords: {
      ko: ["#체리레드", "#흑발찰떡", "#루비우", "#선명한대비감", "#시선강탈"],
      en: ["#HighContrast", "#RubyWoo", "#IcyChic", "#JetBlack", "#BoldLips"],
      ja: ["#ブルベ冬", "#黒髪映え", "#赤リップの女王", "#モード系", "#圧倒的目力"],
    },
  },
};

// ─── 샘플 모델 프리셋 ──────────────────────────────────────────
const PRESET_MODELS = [
  {
    id: "cool_light",
    labels: { ko: "쿨톤 모델 (청순 파스텔)", en: "Cool Tone Model (Pastel)", ja: "ブルベ夏モデル (透明感パステル)" },
    descs: { ko: "뽀얀 피부 & 핑크빛 립", en: "Porcelain Skin & Dewy Pink", ja: "白玉肌 ＆ ピュアピンク" },
    toneHint: "summer_light",
    skinHex: "#FCEFE9",
    lipHex: "#F8BBD0",
    hairHex: "#2C2C34",
    avatarBg: "from-pink-100 to-sky-100",
  },
  {
    id: "warm_mute",
    labels: { ko: "웜톤 모델 (가을 뮤트)", en: "Warm Tone Model (Soft Autumn)", ja: "イエベ秋モデル (大人ニュアンス)" },
    descs: { ko: "골든 베이지 & 살구 피치", en: "Golden Warmth & Soft Peach", ja: "まろやかベージュ ＆ アプリコット" },
    toneHint: "autumn_mute",
    skinHex: "#EED7C5",
    lipHex: "#C47C68",
    hairHex: "#4A3326",
    avatarBg: "from-amber-100 to-orange-100",
  },
  {
    id: "winter_cool",
    labels: { ko: "겨쿨 모델 (또렷한 흑발)", en: "Winter Model (High Contrast)", ja: "ブルベ冬モデル (漆黒モード)" },
    descs: { ko: "투명 도자기 & 체리 레드", en: "Clear Porcelain & Cherry Red", ja: "冴えた陶器肌 ＆ 鮮明ルビー" },
    toneHint: "winter_bright",
    skinHex: "#FDF4EE",
    lipHex: "#C0392B",
    hairHex: "#111116",
    avatarBg: "from-purple-100 to-indigo-100",
  },
];

export default function ColorHelperPage() {
  // ── 언어 상태 (기본 한국어, 쿼리/스토리지 지원) ─────────────────
  const [lang, setLang] = useState<LangType>("ko");
  const t = UI_TEXT[lang];

  // ── State ───────────────────────────────────────────────────
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);
  const [resultTone, setResultTone] = useState<ColorToneData | null>(null);
  const [activeTab, setActiveTab] = useState<"result" | "cosmetics">("result");

  // 진단 티켓 관리 (비회원/게스트 100% 지원)
  const [tickets, setTickets] = useState<number>(0);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 페이팔 결제 플랜 & SDK 상태
  const [selectedPlan, setSelectedPlan] = useState<"single" | "triple">("single");
  const selectedPlanRef = useRef<"single" | "triple">("single");
  const [paypalSdkReady, setPaypalSdkReady] = useState(false);

  // 결제 진행 상태
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState<string | null>(null);

  // 드레이핑 상태
  const [selectedDrapeHex, setSelectedDrapeHex] = useState<string>("#FFA07A");
  const [selectedDrapeName, setSelectedDrapeName] = useState<string>("피치 코랄");
  const [splitView, setSplitView] = useState(false);
  const [splitSliderPos, setSplitSliderPos] = useState(50);

  // 샘플링 포인트 & 수치
  const [skinPoint] = useState<{ x: number; y: number }>({ x: 50, y: 52 });
  const [sampledColors, setSampledColors] = useState<{
    skin: string;
    lip: string;
    hair: string;
    warmScore: number;
    brightness: number;
    saturation: number;
  }>({
    skin: "#F5DFD5",
    lip: "#DE7E8A",
    hair: "#3B2E2A",
    warmScore: 55,
    brightness: 72,
    saturation: 48,
  });

  // 웹캠 제어
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── 언어 URL 쿼리 & 로컬 스토리지 & 브라우저 언어 스마트 자동 감지 ───────
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qLang = urlParams.get("lang") as LangType | null;
      if (qLang && ["ko", "en", "ja"].includes(qLang)) {
        setLang(qLang);
      } else {
        const savedLang = localStorage.getItem("colorhelper_lang") as LangType | null;
        if (savedLang && ["ko", "en", "ja"].includes(savedLang)) {
          setLang(savedLang);
        } else {
          // 브라우저 언어 스마트 자동 감지 (한국어: ko, 일본어: ja, 그 외 전 세계 글로벌: en)
          const browserLang = (navigator.language || (navigator as any).userLanguage || "").toLowerCase();
          if (browserLang.startsWith("ko")) {
            setLang("ko");
          } else if (browserLang.startsWith("ja")) {
            setLang("ja");
          } else {
            setLang("en");
          }
        }
      }

      const savedTickets = localStorage.getItem("colorhelper_tickets");
      if (savedTickets !== null) {
        const count = parseInt(savedTickets, 10);
        setTickets(count);
        setIsUnlocked(count > 0);
      } else {
        setTickets(0);
        setIsUnlocked(false);
        localStorage.setItem("colorhelper_tickets", "0");
      }
    } catch (e) {}

    loadPresetModel(PRESET_MODELS[0]);
  }, []);

  const switchLanguage = (newLang: LangType) => {
    setLang(newLang);
    try {
      localStorage.setItem("colorhelper_lang", newLang);
      const url = new URL(window.location.href);
      url.searchParams.set("lang", newLang);
      window.history.replaceState({}, "", url.toString());
    } catch (e) {}
  };

  // ── 샘플 모델 로드 ──────────────────────────────────────────
  const loadPresetModel = (preset: (typeof PRESET_MODELS)[0]) => {
    setIsCustomPhoto(false);
    setIsUnlocked(tickets > 0);

    const cvs = document.createElement("canvas");
    cvs.width = 600;
    cvs.height = 750;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 0, 750);
    grad.addColorStop(0, "#F7F5F3");
    grad.addColorStop(1, "#E8E2DD");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 750);

    ctx.fillStyle = preset.hairHex;
    ctx.beginPath();
    ctx.ellipse(300, 360, 200, 260, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = preset.skinHex;
    ctx.fillRect(250, 450, 100, 180);

    ctx.beginPath();
    ctx.ellipse(300, 360, 140, 180, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = preset.hairHex;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(245, 305, 30, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(355, 305, 30, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    ctx.fillStyle = "#2D3436";
    ctx.beginPath();
    ctx.ellipse(245, 335, 18, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(355, 335, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    const cheekGrad1 = ctx.createRadialGradient(230, 400, 5, 230, 400, 45);
    cheekGrad1.addColorStop(0, preset.lipHex + "55");
    cheekGrad1.addColorStop(1, preset.skinHex + "00");
    ctx.fillStyle = cheekGrad1;
    ctx.beginPath();
    ctx.arc(230, 400, 45, 0, Math.PI * 2);
    ctx.fill();

    const cheekGrad2 = ctx.createRadialGradient(370, 400, 5, 370, 400, 45);
    cheekGrad2.addColorStop(0, preset.lipHex + "55");
    cheekGrad2.addColorStop(1, preset.skinHex + "00");
    ctx.fillStyle = cheekGrad2;
    ctx.beginPath();
    ctx.arc(370, 400, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = preset.lipHex;
    ctx.beginPath();
    ctx.ellipse(300, 460, 38, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    const dataUrl = cvs.toDataURL("image/png");
    setImageSrc(dataUrl);

    triggerDiagnosis(preset.toneHint, {
      skin: preset.skinHex,
      lip: preset.lipHex,
      hair: preset.hairHex,
    });
  };

  // ── 웹캠 시작 & 캡처 ─────────────────────────────────────────
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 960 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      alert("카메라 사용이 불가합니다. 사진 파일 업로드를 이용해주세요.");
      setCameraActive(false);
    }
  };

  const captureCamera = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const cvs = document.createElement("canvas");
    cvs.width = v.videoWidth || 640;
    cvs.height = v.videoHeight || 800;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, cvs.width, cvs.height);
    const dataUrl = cvs.toDataURL("image/jpeg", 0.95);

    const stream = v.srcObject as MediaStream;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setCameraActive(false);
    setImageSrc(dataUrl);
    setIsCustomPhoto(true);

    checkTicketAndAnalyze(cvs);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setImageSrc(url);
      setIsCustomPhoto(true);

      const img = new Image();
      img.onload = () => {
        const cvs = document.createElement("canvas");
        cvs.width = img.width;
        cvs.height = img.height;
        const ctx = cvs.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          checkTicketAndAnalyze(cvs);
        }
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const checkTicketAndAnalyze = (canvas: HTMLCanvasElement) => {
    if (tickets > 0) {
      const newBalance = tickets - 1;
      setTickets(newBalance);
      localStorage.setItem("colorhelper_tickets", newBalance.toString());
      setIsUnlocked(true);
      analyzeCanvasImage(canvas);
    } else {
      setIsUnlocked(false);
      analyzeCanvasImage(canvas);
      setIsPayModalOpen(true);
    }
  };

  const analyzeCanvasImage = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    const skinX = Math.floor(w * (skinPoint.x / 100));
    const skinY = Math.floor(h * (skinPoint.y / 100));
    const skinPixel = ctx.getImageData(skinX, skinY, 1, 1).data;

    const rgbToHex = (r: number, g: number, b: number) =>
      "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

    const skinHex = rgbToHex(skinPixel[0], skinPixel[1], skinPixel[2]);
    const r = skinPixel[0];
    const g = skinPixel[1];
    const b = skinPixel[2];

    const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : Math.round(((max - min) / max) * 100);

    const yellowDiff = r - b;
    const warmScore = Math.min(100, Math.max(0, Math.round(50 + yellowDiff * 0.4)));

    setSampledColors((prev) => ({
      ...prev,
      skin: skinHex,
      warmScore,
      brightness: Math.round((brightness / 255) * 100),
      saturation,
    }));

    let matchedToneKey = "summer_light";
    if (warmScore >= 52) {
      matchedToneKey = brightness >= 65 ? (saturation >= 45 ? "spring_bright" : "spring_light") : (saturation >= 40 ? "autumn_deep" : "autumn_mute");
    } else {
      matchedToneKey = brightness >= 65 ? "summer_light" : "winter_bright";
    }

    triggerDiagnosis(matchedToneKey, { skin: skinHex, lip: "#DE7E8A", hair: "#3B2E2A" });
  };

  const triggerDiagnosis = (toneKey: string, colors?: { skin: string; lip: string; hair: string }) => {
    const tone = PERSONAL_COLOR_DB[toneKey] || PERSONAL_COLOR_DB.spring_light;
    setResultTone(tone);
    setSelectedDrapeHex(tone.drapeSwatches[0].hex);
    setSelectedDrapeName(tone.drapeSwatches[0].name[lang]);

    if (colors) {
      setSampledColors((prev) => ({
        ...prev,
        skin: colors.skin,
        lip: colors.lip,
        hair: colors.hair,
      }));
    }
  };

  // 페이팔 결제 플랜 변경 동기화
  useEffect(() => {
    selectedPlanRef.current = selectedPlan;
  }, [selectedPlan]);

  // ── 페이팔 공식 JS SDK 실시간 로드 & 스마트 버튼 마운트 ───────────
  useEffect(() => {
    if (!isPayModalOpen) return;

    let isMounted = true;
    const currency = lang === "ja" ? "JPY" : "USD";
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";
    const scriptId = "paypal-sdk-script";

    const renderPayPalButtons = () => {
      if (!isMounted) return;
      const container = document.getElementById("paypal-button-container");
      if (!container) return;
      container.innerHTML = "";

      if ((window as any).paypal?.Buttons) {
        try {
          (window as any).paypal.Buttons({
            style: {
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
              height: 44,
            },
            createOrder: (_data: any, actions: any) => {
              const currentPlan = selectedPlanRef.current;
              const val = currentPlan === "single"
                ? (lang === "ja" ? "120" : "0.79")
                : (lang === "ja" ? "280" : "1.89");
              return actions.order.create({
                purchase_units: [
                  {
                    description:
                      currentPlan === "single"
                        ? "PersonalColorHelper 1-Pass Diagnostic Ticket"
                        : "PersonalColorHelper 3-Pass Diagnostic Pack",
                    amount: {
                      currency_code: currency,
                      value: val,
                    },
                  },
                ],
              });
            },
            onApprove: async (_data: any, actions: any) => {
              try {
                setPaymentProcessing(true);
                const details = await actions.order.capture();
                await executePayment(selectedPlanRef.current, details);
              } catch (e) {
                console.error("PayPal capture error:", e);
                await executePayment(selectedPlanRef.current);
              }
            },
            onError: (err: any) => {
              console.error("PayPal Button error:", err);
            },
          }).render("#paypal-button-container");
          setPaypalSdkReady(true);
        } catch (e) {
          console.error("PayPal render error:", e);
        }
      }
    };

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement;
    if (existingScript) {
      if ((window as any).paypal) {
        renderPayPalButtons();
      } else {
        existingScript.addEventListener("load", renderPayPalButtons);
      }
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
      script.async = true;
      script.onload = () => {
        if (isMounted) renderPayPalButtons();
      };
      document.body.appendChild(script);
    }

    return () => {
      isMounted = false;
    };
  }, [isPayModalOpen, lang]);

  // ── 결제 승인 & 진단권 즉시 충전 처리 ───────────────────────────
  const executePayment = async (planType: "single" | "triple", details?: any) => {
    setPaymentProcessing(true);
    const amount = planType === "single" ? (lang === "ja" ? 120 : lang === "en" ? 0.79 : 1000) : (lang === "ja" ? 280 : lang === "en" ? 1.89 : 2500);
    const addTickets = planType === "single" ? 1 : 3;

    try {
      const res = await fetch("/api/checkout/colorhelper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: details?.id || `PAYPAL_${Date.now()}`,
          payerEmail: details?.payer?.email_address || "guest@personalcolorhelper.com",
          amount,
          currency: lang === "ja" ? "JPY" : lang === "en" ? "USD" : "KRW",
          ticketType: planType,
          paymentMethod: "paypal",
        }),
      });

      const data = await res.json();
      if (data.success) {
        const newBalance = tickets + addTickets;
        setTickets(newBalance);
        localStorage.setItem("colorhelper_tickets", newBalance.toString());
        setIsUnlocked(true);
        setIsPayModalOpen(false);
        setPaymentSuccessNotice(
          lang === "ko"
            ? `결제 승인 완료! ${addTickets}회 진단권이 충전되어 즉시 해금되었습니다.`
            : lang === "ja"
            ? `決済が完了しました！診断チケット（${addTickets}回分）が付与され、診断書が閲覧可能になりました。`
            : `Payment approved! ${addTickets} passes added to your account.`
        );
        setTimeout(() => setPaymentSuccessNotice(null), 4500);
      }
    } catch (err) {
      alert("Payment processing error. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // ── 인스타 스토리 카드 다운로드 (다국어 완벽 지원) ───────────────
  const downloadResultCard = () => {
    if (!resultTone) return;
    if (!isUnlocked) {
      setIsPayModalOpen(true);
      return;
    }

    const cvs = document.createElement("canvas");
    cvs.width = 1080;
    cvs.height = 1920;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, "#1A1715");
    bgGrad.addColorStop(0.5, "#2C2623");
    bgGrad.addColorStop(1, "#12100E");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    const ambient = ctx.createRadialGradient(540, 500, 50, 540, 500, 600);
    ambient.addColorStop(0, selectedDrapeHex + "44");
    ambient.addColorStop(1, "transparent");
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.fillStyle = "#E0A96D";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PERSONAL COLOR HELPER · DOSSIER", 540, 160);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 76px sans-serif";
    ctx.fillText(resultTone.titles[lang], 540, 270);

    ctx.fillStyle = "#E5D9D0";
    ctx.font = "32px sans-serif";
    ctx.fillText(`"${resultTone.slogans[lang]}"`, 540, 360);

    // 베스트 컬러 박스
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(100, 480, 880, 380, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(lang === "ja" ? "🎨 ベストパレット" : lang === "en" ? "🎨 BEST PALETTE" : "🎨 베스트 팔레트", 150, 550);

    resultTone.bestColors.forEach((col, idx) => {
      const chipX = 150 + idx * 160;
      const chipY = 600;
      ctx.fillStyle = col.hex;
      ctx.beginPath();
      ctx.roundRect(chipX, chipY, 120, 150, 20);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "22px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(col.name[lang], chipX + 60, chipY + 190);
    });

    // 뷰티 & 주얼리 박스
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.roundRect(100, 910, 880, 560, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("💄 BEAUTY & STYLING FORMULA", 150, 980);

    ctx.font = "28px sans-serif";
    ctx.fillStyle = "#E0A96D";
    ctx.fillText(lang === "ja" ? "✨ 神リップ:" : lang === "en" ? "✨ Signature Lips:" : "✨ 인생 립스틱:", 150, 1050);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(resultTone.cosmetics.lips.map((l) => `${l.brand} ${l.name}`).join(" · "), 360, 1050);

    ctx.fillStyle = "#E0A96D";
    ctx.fillText(lang === "ja" ? "💍 ジュエリー:" : lang === "en" ? "💍 Best Jewelry:" : "💍 베스트 주얼리:", 150, 1130);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(resultTone.stylingGuide.jewelry[lang], 360, 1130);

    ctx.fillStyle = "#E0A96D";
    ctx.fillText(lang === "ja" ? "💇 ヘアカラー:" : lang === "en" ? "💇 Hair Guide:" : "💇 헤어 컬러:", 150, 1210);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(resultTone.stylingGuide.hairColor[lang], 360, 1210);

    ctx.fillStyle = "#E0A96D";
    ctx.fillText(lang === "ja" ? "👗 着こなし術:" : lang === "en" ? "👗 Style Note:" : "👗 스타일링 팁:", 150, 1290);
    ctx.fillStyle = "#D6C7BE";
    ctx.fillText(resultTone.stylingGuide.fashionTip[lang], 360, 1290);

    ctx.fillStyle = "#888888";
    ctx.font = "26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PersonalColorHelper · Find Your True Tone & Perfect Palette", 540, 1800);

    const link = document.createElement("a");
    link.download = `PersonalColorHelper_${resultTone.id}_${lang}.png`;
    link.href = cvs.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* ── TOP NAV BAR: 언어 전환기, 구글 로그인, 잔여 티켓 ─────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-200/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E07A5F] to-amber-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
            PCH
          </div>
          <span className="font-extrabold text-base tracking-tight text-[#1E1B18]">
            {t.brandName}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
            {t.badgePrice}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* 다국어 전환 탭 [KO | EN | JA] */}
          <div className="inline-flex p-1 rounded-xl bg-gray-100 border border-gray-200 text-xs font-bold text-gray-600">
            <button
              onClick={() => switchLanguage("ko")}
              className={`px-2.5 py-1 rounded-lg transition ${
                lang === "ko" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
              }`}
            >
              🇰🇷 한국어
            </button>
            <button
              onClick={() => switchLanguage("en")}
              className={`px-2.5 py-1 rounded-lg transition ${
                lang === "en" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
              }`}
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => switchLanguage("ja")}
              className={`px-2.5 py-1 rounded-lg transition ${
                lang === "ja" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
              }`}
            >
              🇯🇵 日本語
            </button>
          </div>

          {/* 잔여 진단권 & 페이팔 충전 배지 (비회원/게스트 100% 즉시 이용) */}
          <button
            onClick={() => setIsPayModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-900 text-xs font-bold hover:shadow-md transition"
            title="PayPal & Card Top Up"
          >
            <Ticket className="w-4 h-4 text-[#E07A5F]" />
            <span className="hidden sm:inline">{t.ticketLabel}:</span>
            <span className="text-[#E07A5F] font-black">{tickets}{t.ticketUnit}</span>
            <span className="text-[10px] bg-[#E07A5F] text-white px-2 py-0.5 rounded-full font-bold ml-1">{t.recharge}</span>
          </button>
        </div>
      </div>

      {paymentSuccessNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{paymentSuccessNotice}</span>
        </div>
      )}

      {/* ── HEADER ────────────────────────────────────────── */}
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E07A5F]/10 border border-[#E07A5F]/20 text-[#E07A5F] text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          {t.brandTag}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1E1B18] mb-3">
          {lang === "ko" ? (
            <>
              퍼스널컬러<span className="text-[#E07A5F]">헬퍼</span>
            </>
          ) : lang === "ja" ? (
            <>
              パーソナルカラー<span className="text-[#E07A5F]">ヘルパー</span>
            </>
          ) : (
            <>
              PERSONAL COLOR <span className="text-[#E07A5F]">HELPER</span>
            </>
          )}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs font-medium text-gray-500">
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t.badgePrice}
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t.badgePayPal}
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t.badgeNoLogin}
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t.badgeMatrix}
          </span>
        </div>
      </header>

      {/* ── STEP 1: 사진 등록 & 1초 프리셋 모델 선택 ──────────────── */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-200/90 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 mb-7 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-100 to-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center shadow-inner flex-shrink-0">
              <Camera className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
                {t.uploadTitle}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg leading-relaxed">{t.uploadDesc}</p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs sm:text-sm border border-gray-300 shadow-sm hover:shadow transition"
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              <span>{t.uploadFileBtn}</span>
            </button>

            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-[#E07A5F] hover:from-amber-600 hover:to-[#D0694E] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t.cameraBtn}</span>
              </button>
            ) : (
              <button
                onClick={captureCamera}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition animate-pulse"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t.cameraShootBtn}</span>
              </button>
            )}
          </div>
        </div>

        {cameraActive && (
          <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden bg-black mb-6 border-4 border-[#E07A5F]">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
            <div className="absolute inset-0 border-2 border-dashed border-white/60 rounded-full m-8 pointer-events-none flex items-center justify-center">
              <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">{t.cameraGuide}</span>
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {t.presetTitle}
            </span>
            <span className="text-[11px] text-gray-400">{t.presetSub}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_MODELS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPresetModel(preset)}
                className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:border-[#E07A5F] hover:bg-[#FFFBF9] transition text-left group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${preset.avatarBg} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: preset.lipHex }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-900 group-hover:text-[#E07A5F] truncate">
                    {preset.labels[lang]}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">{preset.descs[lang]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEP 2: 가상 드레이핑 스튜디오 ─────────────────────────── */}
      {imageSrc && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#E07A5F]" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t.drapingTitle}</h2>
            </div>

            <button
              onClick={() => setSplitView(!splitView)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition flex items-center gap-1.5 ${
                splitView ? "bg-[#E07A5F] text-white border-[#E07A5F]" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {t.splitToggle} ({splitView ? "ON" : "OFF"})
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-6">{t.drapingDesc}</p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* 좌측: 실시간 캔버스 뷰어 */}
            <div className="md:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-gray-100">
                <div className="relative w-full h-[70%] overflow-hidden bg-neutral-900">
                  <img src={imageSrc} alt="Facial Canvas" className="w-full h-full object-cover object-top" />
                  <div
                    className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg pointer-events-none"
                    style={{ left: `${skinPoint.x}%`, top: `${skinPoint.y}%`, backgroundColor: sampledColors.skin }}
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sampledColors.skin }} />
                    {t.skinDetected}
                  </div>
                </div>

                <div className="relative w-full h-[30%] overflow-hidden flex shadow-inner transition-colors duration-300">
                  {!splitView ? (
                    <div
                      className="w-full h-full flex items-center justify-center p-3 relative transition-all duration-300"
                      style={{ backgroundColor: selectedDrapeHex }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/20 pointer-events-none" />
                      <span className="relative z-10 text-xs font-extrabold px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white shadow-sm">
                        {selectedDrapeName}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex relative">
                      <div
                        className="h-full flex items-center justify-center text-center relative"
                        style={{ width: `${splitSliderPos}%`, backgroundColor: "#FFA07A" }}
                      >
                        <span className="text-[11px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full">
                          {t.splitWarm}
                        </span>
                      </div>
                      <div className="h-full flex-1 flex items-center justify-center text-center relative" style={{ backgroundColor: "#A594B3" }}>
                        <span className="text-[11px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full">
                          {t.splitCool}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {splitView && (
                <div className="w-full max-w-[340px] mt-3">
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>{t.splitWarm}</span>
                    <span>{t.splitCool}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={splitSliderPos}
                    onChange={(e) => setSplitSliderPos(Number(e.target.value))}
                    className="w-full accent-[#E07A5F]"
                  />
                </div>
              )}
            </div>

            {/* 우측: 드레이핑 컬러 스와치 & 피부 지표 */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#E07A5F]" />
                  {t.swatchTitle}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{t.swatchDesc}</p>

                {resultTone && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {resultTone.drapeSwatches.map((swatch) => (
                      <button
                        key={swatch.name[lang]}
                        onClick={() => {
                          setSelectedDrapeHex(swatch.hex);
                          setSelectedDrapeName(swatch.name[lang]);
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                          selectedDrapeHex === swatch.hex
                            ? "border-gray-900 ring-2 ring-gray-900 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: swatch.hex }} />
                        <span className="text-[11px] font-bold text-gray-900 truncate w-full text-center">
                          {swatch.name[lang]}
                        </span>
                        <span className="text-[9px] text-gray-500">{swatch.desc[lang]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 지표 분석 박스 */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                <div className="text-xs font-bold text-gray-800 flex items-center justify-between">
                  <span>{t.metricTitle}</span>
                  <span className="text-[11px] font-normal text-gray-500">{t.metricSubtitle}</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="flex items-center gap-1"><Snowflake className="w-3 h-3 text-sky-500" /> {t.coolLabel}</span>
                    <span className="font-bold text-gray-800">
                      {sampledColors.warmScore >= 50 ? `Warm (${sampledColors.warmScore}%)` : `Cool (${100 - sampledColors.warmScore}%)`}
                    </span>
                    <span className="flex items-center gap-1">{t.warmLabel} <Flame className="w-3 h-3 text-amber-500" /></span>
                  </div>
                  <div className="h-2 rounded-full bg-gradient-to-r from-sky-400 via-purple-300 to-amber-500 overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 w-2.5 bg-black rounded-full shadow -ml-1 border border-white" style={{ left: `${sampledColors.warmScore}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 text-xs">
                  <div>
                    <span className="text-gray-500">{t.brightnessLabel}</span>
                    <span className="ml-1.5 font-bold text-gray-900">{sampledColors.brightness}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t.saturationLabel}</span>
                    <span className="ml-1.5 font-bold text-gray-900">{sampledColors.saturation}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION: 색과 톤의 차이는 무엇인가? (색채학 공식 마스터클래스) ─── */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-200/90 mb-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-[11px] font-bold tracking-wider uppercase mb-2">
            <span>{t.eduEyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            퍼스널 컬러 — <span className="text-rose-500">색</span>과 <span className="text-sky-600">톤</span>의 차이는 무엇인가?
          </h2>
        </div>

        <div className="space-y-6">
          {/* 1. 색 (Color) = 색상의 차이 */}
          <div className="p-6 rounded-3xl bg-[#FFF8F8] border border-rose-200/90 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                    1
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    <span className="text-rose-600">색 (Color)</span> = 색상의 차이
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  {t.eduStep1Desc}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full md:w-auto">
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EF4444] shadow-md mx-auto mb-1 border border-black/10" />
                  <span className="text-[11px] font-bold text-gray-800">{t.colorRed}</span>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FACC15] shadow-md mx-auto mb-1 border border-black/10" />
                  <span className="text-[11px] font-bold text-gray-800">{t.colorYellow}</span>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#2563EB] shadow-md mx-auto mb-1 border border-black/10" />
                  <span className="text-[11px] font-bold text-gray-800">{t.colorBlue}</span>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#10B981] shadow-md mx-auto mb-1 border border-black/10" />
                  <span className="text-[11px] font-bold text-gray-800">{t.colorGreen}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 톤 (Tone) = 색의 성질 */}
          <div className="p-6 rounded-3xl bg-[#F0F7FF] border border-sky-200/90 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                    2
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    <span className="text-sky-600">톤 (Tone)</span> = 색의 성질
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  {t.eduStep2Desc}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-sky-900 block mb-2 text-center lg:text-right">
                  {t.eduStep2Sub}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  <div className="p-3 rounded-2xl bg-[#BAE6FD] text-center border border-sky-300/60 shadow-sm">
                    <div className="text-xs font-black text-sky-950 mb-0.5">{t.toneLight}</div>
                    <div className="text-[10px] text-sky-900/80 font-semibold">{t.toneLightDesc}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#2563EB] text-center shadow-md text-white border border-blue-600">
                    <div className="text-xs font-black mb-0.5">{t.toneVivid}</div>
                    <div className="text-[10px] text-blue-100 font-semibold">{t.toneVividDesc}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#64748B] text-center shadow-sm text-white border border-slate-600">
                    <div className="text-xs font-black mb-0.5">{t.toneMute}</div>
                    <div className="text-[10px] text-slate-200 font-semibold">{t.toneMuteDesc}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#0F2537] text-center shadow-md text-white border border-black/40">
                    <div className="text-xs font-black mb-0.5">{t.toneDeep}</div>
                    <div className="text-[10px] text-gray-300 font-semibold">{t.toneDeepDesc}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 퍼스널 컬러의 4계절 톤 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFDF7] border border-amber-200/90 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                3
              </span>
              <h3 className="text-base sm:text-lg font-black text-gray-900">
                {t.eduStep3Badge}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-6">
              {t.eduStep3Desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 봄 웜톤 */}
              <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-rose-100 flex flex-col items-center text-center">
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black mb-3">
                  {t.springWarmName}
                </span>
                <div className="grid grid-cols-4 gap-1.5 mb-3 w-full max-w-[200px]">
                  {["#FFF7ED", "#FFEDD5", "#C27837", "#6B3B1A", "#FDA4AF", "#FB923C", "#EF4444", "#A3E635"].map((hex) => (
                    <div key={hex} className="aspect-square rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: hex }} />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-gray-700">{t.springWarmDesc}</span>
              </div>

              {/* 여름 쿨톤 */}
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-sky-100 flex flex-col items-center text-center">
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black mb-3">
                  {t.summerCoolName}
                </span>
                <div className="grid grid-cols-4 gap-1.5 mb-3 w-full max-w-[200px]">
                  {["#F8FAFC", "#FCE7F3", "#E2E8F0", "#94A3B8", "#475569", "#1E293B", "#F43F5E", "#818CF8"].map((hex) => (
                    <div key={hex} className="aspect-square rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: hex }} />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-gray-700">{t.summerCoolDesc}</span>
              </div>

              {/* 가을 웜톤 */}
              <div className="p-5 rounded-2xl bg-[#FFFDF5] border border-amber-100 flex flex-col items-center text-center">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black mb-3">
                  {t.autumnWarmName}
                </span>
                <div className="grid grid-cols-4 gap-1.5 mb-3 w-full max-w-[200px]">
                  {["#F5EBE0", "#D97706", "#B45309", "#78350F", "#E07A5F", "#9A3412", "#4D5C2C", "#701A75"].map((hex) => (
                    <div key={hex} className="aspect-square rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: hex }} />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-gray-700">{t.autumnWarmDesc}</span>
              </div>

              {/* 겨울 쿨톤 */}
              <div className="p-5 rounded-2xl bg-[#F5F7FB] border border-indigo-100 flex flex-col items-center text-center">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black mb-3">
                  {t.winterCoolName}
                </span>
                <div className="grid grid-cols-4 gap-1.5 mb-3 w-full max-w-[200px]">
                  {["#0F172A", "#1E1B4B", "#312E81", "#FDF2F8", "#BE185D", "#2563EB", "#831843", "#581C87"].map((hex) => (
                    <div key={hex} className="aspect-square rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: hex }} />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-gray-700">{t.winterCoolDesc}</span>
              </div>
            </div>
          </div>

          {/* 4. 핵심 정리 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-emerald-50/80 border-2 border-emerald-300 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-emerald-950">
                {t.eduSummaryTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold inline-block mb-1.5">
                  {t.eduSumColorTag}
                </span>
                <h4 className="text-sm font-black text-gray-900 mb-1">{t.eduSumColorTitle}</h4>
                <p className="text-xs text-gray-500 font-medium">{t.eduSumColorDesc}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#FACC15]" />
                  <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
                  <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span className="text-[10px] text-gray-400">...</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold inline-block mb-1.5">
                  {t.eduSumToneTag}
                </span>
                <h4 className="text-sm font-black text-gray-900 mb-1">{t.eduSumToneTitle}</h4>
                <p className="text-xs text-gray-500 font-medium">{t.eduSumToneDesc}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="w-3 h-3 rounded-full bg-[#BAE6FD]" />
                  <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
                  <span className="w-3 h-3 rounded-full bg-[#64748B]" />
                  <span className="w-3 h-3 rounded-full bg-[#0F2537]" />
                  <span className="text-[10px] text-gray-400">...</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500 shadow-md relative overflow-hidden">
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black inline-block mb-1.5 shadow-sm">
                  {t.eduSumCoreTag}
                </span>
                <h4 className="text-sm font-black text-emerald-950 mb-1">{t.eduSumCoreTitle}</h4>
                <p className="text-xs text-emerald-800 font-bold leading-relaxed">{t.eduSumCoreDesc}</p>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-extrabold text-emerald-700">
                  <span>✨ 12톤 정밀 AI 진단 추천</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STEP 3: 상세 결과 리포트 (잠금 및 결제 연동) ───────────── */}
      {resultTone && (
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-200 mb-8 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none -mr-20 -mt-20"
            style={{ backgroundColor: selectedDrapeHex }}
          />

          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-8">
            <button
              onClick={() => setActiveTab("result")}
              className={`text-sm font-bold pb-2 px-3 border-b-2 transition ${
                activeTab === "result" ? "border-[#E07A5F] text-[#E07A5F]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.tabResult}
            </button>
            <button
              onClick={() => setActiveTab("cosmetics")}
              className={`text-sm font-bold pb-2 px-3 border-b-2 transition ${
                activeTab === "cosmetics" ? "border-[#E07A5F] text-[#E07A5F]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.tabCosmetics}
            </button>
          </div>

          {/* 결제 전 잠금 오버레이 */}
          {!isUnlocked && (
            <div className="relative my-4 p-8 rounded-2xl bg-gradient-to-b from-gray-900/95 to-black text-white text-center shadow-2xl z-20 border border-amber-500/30">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-4 shadow-lg">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold mb-2">{t.lockTitle}</h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mb-6 leading-relaxed">{t.lockDesc}</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsPayModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E07A5F] hover:from-amber-600 hover:to-[#D0694E] text-white font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {t.unlockBtn}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PayPal 256-bit Encrypted</span>
                <span>•</span>
                <span>Export High-Res Card</span>
              </div>
            </div>
          )}

          <div className={!isUnlocked ? "filter blur-md pointer-events-none select-none opacity-40" : ""}>
            {activeTab === "result" ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 uppercase tracking-wider bg-gray-100 border-gray-300 text-gray-800">
                      {resultTone.seasonNames[lang]}
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                      {resultTone.titles[lang]}
                    </h3>
                  </div>

                  <button
                    onClick={downloadResultCard}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-md transition"
                  >
                    <Download className="w-4 h-4" />
                    {t.saveInstaCard}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFBF9] border border-[#E07A5F]/20 mb-8">
                  <p className="text-base sm:text-lg font-bold text-[#E07A5F] mb-1.5">
                    "{resultTone.slogans[lang]}"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {resultTone.summaries[lang]}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {resultTone.keywords[lang].map((kw) => (
                      <span key={kw} className="text-[11px] font-semibold text-gray-600 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 베스트 & 워스트 팔레트 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                    <div className="text-xs font-extrabold text-emerald-800 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t.bestPalette}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {resultTone.bestColors.map((col) => (
                        <div key={col.name[lang]} className="flex flex-col items-center">
                          <div className="w-full aspect-square rounded-xl shadow-sm border border-black/10 transition transform hover:scale-105" style={{ backgroundColor: col.hex }} />
                          <span className="text-[10px] font-medium text-gray-700 mt-1 truncate w-full text-center">
                            {col.name[lang]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200">
                    <div className="text-xs font-extrabold text-rose-800 mb-3 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-rose-600" />
                      {t.worstPalette}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {resultTone.worstColors.map((col) => (
                        <div key={col.name[lang]} className="flex flex-col items-center">
                          <div className="w-full aspect-square rounded-xl shadow-sm border border-black/10" style={{ backgroundColor: col.hex }} />
                          <span className="text-[10px] font-medium text-gray-700 mt-1 truncate w-full text-center">
                            {col.name[lang]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 토탈 스타일링 가이드 */}
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#E07A5F]" />
                    {t.totalFormula}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900 block mb-1">{t.jewelryTitle}</span>
                      <span className="text-gray-700 font-semibold text-[#E07A5F]">{resultTone.stylingGuide.jewelry[lang]}</span>
                      <p className="text-gray-500 mt-1">{resultTone.stylingGuide.jewelryDesc[lang]}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900 block mb-1">{t.baseTitle}</span>
                      <span className="text-gray-700 font-medium">{resultTone.stylingGuide.foundation[lang]}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900 block mb-1">{t.hairTitle}</span>
                      <span className="text-gray-700 font-medium">{resultTone.stylingGuide.hairColor[lang]}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900 block mb-1">{t.fashionTitle}</span>
                      <span className="text-gray-700 font-medium">{resultTone.stylingGuide.fashionTip[lang]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    {resultTone.titles[lang]} {t.lipTitle}
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">{t.lipDesc}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {resultTone.cosmetics.lips.map((lip) => (
                      <div key={lip.name} className="p-4 rounded-2xl border border-gray-200 hover:border-[#E07A5F] transition bg-white flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{lip.brand}</span>
                            <div className="w-5 h-5 rounded-full border shadow-sm" style={{ backgroundColor: lip.hex }} />
                          </div>
                          <div className="text-xs font-bold text-gray-900 mb-1">{lip.name}</div>
                          <p className="text-[11px] text-gray-500">{lip.note[lang]}</p>
                        </div>

                        <button
                          onClick={() => {
                            const query = `${lip.brand} ${lip.name}`;
                            const url =
                              lang === "ja"
                                ? `https://www.google.co.jp/search?q=${encodeURIComponent(query + " @cosme")}`
                                : lang === "en"
                                ? `https://www.google.com/search?q=${encodeURIComponent(query + " Sephora")}`
                                : `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(query)}`;
                            window.open(url, "_blank");
                          }}
                          className="mt-3 w-full py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 text-[11px] font-bold border border-gray-200 transition flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#E07A5F]" />
                          {t.lowestPrice}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <span className="text-xs font-bold text-gray-900 block mb-2">{t.blushTitle}</span>
                    {resultTone.cosmetics.blush.map((b) => (
                      <div key={b.name} className="flex items-center gap-2 text-xs text-gray-700 py-1">
                        <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: b.hex }} />
                        <span className="font-semibold text-gray-900">{b.brand}</span>
                        <span className="text-gray-600 truncate">{b.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <span className="text-xs font-bold text-gray-900 block mb-2">{t.eyeTitle}</span>
                    {resultTone.cosmetics.eye.map((e) => (
                      <div key={e.name} className="flex items-center gap-2 text-xs text-gray-700 py-1">
                        <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: e.hex }} />
                        <span className="font-semibold text-gray-900">{e.brand}</span>
                        <span className="text-gray-600 truncate">{e.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STYLING HELPER FASHION LINK (오직 영어 버전에서만 노출 & stylinghelper.com 직행) ── */}
            {lang === "en" && (
              <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#1A1715] to-[#2C2623] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#E07A5F] text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                    StylingHelper Fashion Match
                  </div>
                  <h4 className="text-base sm:text-lg font-bold">Luxury Outfits Curated for Your Tone</h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Explore live US designer inventory (Nordstrom, SSENSE, Zara US) styled to complement your 12-season palette.
                  </p>
                </div>

                <a
                  href="https://stylinghelper.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-900 text-xs font-extrabold transition shadow-md whitespace-nowrap"
                >
                  Explore StylingHelper
                  <ArrowRight className="w-4 h-4 text-[#E07A5F]" />
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="text-center text-xs text-gray-400 pt-6 pb-12 border-t border-gray-200">
        <p className="font-semibold text-gray-600 mb-1">
          퍼스널컬러헬퍼 (PersonalColorHelper) · AI Personal Color System
        </p>
        <p>© 2026 FirstMotion Co., Ltd. All rights reserved. (Seoul · Tokyo · New York)</p>
      </footer>

      {/* ── MODAL 1: 구글 로그인 모달 ─────────────────────────────── */}
      

      {/* ── MODAL 2: 페이팔 & 카드 즉시 결제 모달 ────────────────── */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsPayModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Ticket className="w-6 h-6 text-[#E07A5F]" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">{t.modalTitle}</h3>
              <p className="text-xs text-gray-500 mt-1">{t.modalSubtitle}</p>
            </div>

            {/* 결제 상품 플랜 선택 */}
            <div className="space-y-3 mb-5">
              <div
                onClick={() => setSelectedPlan("single")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition relative flex items-center justify-between ${
                  selectedPlan === "single"
                    ? "border-[#E07A5F] bg-[#FFFBF9] shadow-md ring-2 ring-[#E07A5F]/20"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      selectedPlan === "single"
                        ? "border-[#E07A5F] bg-[#E07A5F]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedPlan === "single" && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#E07A5F]">{t.singlePlanTag}</div>
                    <div className="text-sm font-extrabold text-gray-900">{t.singlePlanName}</div>
                    <div className="text-[11px] text-gray-500">{t.singlePlanDesc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-gray-900">{t.singlePrice}</div>
                  <div className="text-[10px] text-gray-400 font-semibold">{t.singlePriceSub}</div>
                </div>
              </div>

              <div
                onClick={() => setSelectedPlan("triple")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition relative flex items-center justify-between ${
                  selectedPlan === "triple"
                    ? "border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      selectedPlan === "triple"
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedPlan === "triple" && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-600">{t.triplePlanTag}</div>
                    <div className="text-sm font-extrabold text-gray-900">{t.triplePlanName}</div>
                    <div className="text-[11px] text-gray-500">{t.triplePlanDesc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-gray-900">{t.triplePrice}</div>
                  <div className="text-[10px] text-gray-400 font-semibold">{t.triplePriceSub}</div>
                </div>
              </div>
            </div>

            {/* 공식 페이팔 스마트 버튼 마운트 영역 */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mb-2 px-1">
                <span>공식 페이팔 & 신용/체크카드 결제</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL
                </span>
              </div>
              <div id="paypal-button-container" className="min-h-[96px] w-full" />
            </div>

            {/* 직접 결제 및 테스트 승인 버튼 */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <button
                disabled={paymentProcessing}
                onClick={() => executePayment(selectedPlan)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0070BA] to-[#003087] hover:from-[#005ea6] hover:to-[#00256c] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                {paymentProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span className="font-black italic tracking-wider">PayPal</span>
                    <span>
                      {selectedPlan === "single" ? t.payWithPaypal : t.payTriplePaypal}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => executePayment(selectedPlan)}
                className="w-full py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium text-[11px] border border-gray-200 transition flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                {t.testPayBtn}
              </button>
            </div>

            {/* 지원 결제 수단 & 신뢰 배지 */}
            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-semibold mb-1">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">PayPal</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">Visa</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">Mastercard</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">AMEX</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">JCB</span>
              </div>
              <p className="text-[10px] text-gray-400">
                Official PayPal Checkout • Zero Login Required • Instant Unlock
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
