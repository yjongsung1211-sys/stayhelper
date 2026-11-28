import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadNotoSansKR } from "@remotion/google-fonts/NotoSansKR";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: fontKR } = loadNotoSansKR();
const { fontFamily: fontEN } = loadPoppins();

export interface EnglishLongformTemplateProps {
  categoryTitle: string;
  numberBadge?: string;
  primaryText: string;
  pronunciation: string;
  meaning: string;
  meaningColor?: string;
  vocabNotes?: string;
  rightHeaderTitle?: string;
  rightSubtitle: string;
  rightMainQuote: string;
  rightPoint: string;
  nextPreviewText: string;
  footerTitle?: string;
  lang?: "en" | "es";
  round1EndFrame?: number;
  round2EndFrame?: number;
  round3EndFrame?: number;
}

export const PostMotionEnglishLongformTemplate: React.FC<EnglishLongformTemplateProps> = ({
  categoryTitle,
  numberBadge = "01 / 15",
  primaryText,
  pronunciation,
  meaning,
  meaningColor = "#dc2626",
  vocabNotes,
  rightHeaderTitle,
  rightSubtitle,
  rightMainQuote,
  rightPoint,
  nextPreviewText,
  footerTitle = "KOREANLOOP • Real Practical Korean for Travel & Culture ✈️",
  lang = "en",
  round1EndFrame,
  round2EndFrame,
  round3EndFrame,
}) => {
  const isES = lang === "es";
  const resolvedRightHeader =
    rightHeaderTitle ||
    (isES ? "📐 Regla Gramatical y Matiz" : "💡 Real Travel Nuance & Culture");
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. 전체 요소 등장 스프링 (0 ~ 25 프레임)
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // 2. 옐로우 형광펜 스윕 드로잉 (15 ~ 55 프레임)
  const highlightProgress = interpolate(frame, [15, 55], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. 회차별 정확한 프레임 기준점
  const r1End = round1EndFrame || Math.round(durationInFrames * 0.38);
  const r2End = round2EndFrame || Math.round(durationInFrames * 0.62);
  const r3End = round3EndFrame || Math.round(durationInFrames * 0.90);

  const isRound1Done = frame >= r1End;
  const isRound2Done = frame >= r2End;
  const isRound3Done = frame >= r3End;

  // 상단 STEP 상태 동적 변경
  let currentStepBadge = isES ? "PASO 1" : "STEP 1";
  let currentStepName = isES
    ? "1ª Ronda: Escucha Coreano Estándar y Significado"
    : "1st Round: Listen to Standard Korean & Meaning";
  let stepColor = "#2563eb";
  let stepBg = "#eff6ff";
  let stepBorder = "#bfdbfe";

  if (frame >= r2End) {
    currentStepBadge = isES ? "PASO 3" : "STEP 3";
    currentStepName = isES
      ? "3ª Ronda: Repite en Voz Alta (Práctica Shadowing)"
      : "3rd Round: Repeat Out Loud (Shadowing Practice)";
    stepColor = "#16a34a";
    stepBg = "#f0fdf4";
    stepBorder = "#bbf7d0";
  } else if (frame >= r1End) {
    currentStepBadge = isES ? "PASO 2" : "STEP 2";
    currentStepName = isES
      ? "2ª Ronda: Escucha Lenta y Clara (0.85x)"
      : "2nd Round: Slow & Clear Listening (0.85x)";
    stepColor = "#ea580c";
    stepBg = "#fff7ed";
    stepBorder = "#fed7aa";
  }

  // 4. 문장 전환 모션 (마지막 35프레임 동안 위로 슬라이드 아웃)
  const transStart = Math.max(durationInFrames - 35, 60);
  const exitSlide = interpolate(frame, [transStart, durationInFrames], [0, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [transStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 다음 문장 진입 프리뷰 (마지막 25프레임)
  const nextEnterSlide = interpolate(frame, [durationInFrames - 25, durationInFrames], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nextOpacity = interpolate(frame, [durationInFrames - 25, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 5. 하단 진행 바 (0 ~ 전환 시작)
  const progressBarWidth = interpolate(frame, [0, transStart], [5, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 6. 오디오 파형 바 애니메이션
  const wave1 = 12 + Math.sin(frame * 0.4) * 8;
  const wave2 = 18 + Math.sin(frame * 0.5 + 1) * 10;
  const wave3 = 14 + Math.sin(frame * 0.35 + 2) * 9;
  const wave4 = 16 + Math.sin(frame * 0.45 + 3) * 8;

  const primaryFontSize = primaryText.length > 25 ? 48 : primaryText.length > 18 ? 54 : 62;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `
          linear-gradient(to right, #f1f5f9 1px, transparent 1px),
          linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)
        `,
        backgroundSize: "54px 54px",
        fontFamily: fontKR,
        color: "#18181e",
        overflow: "hidden",
      }}
    >
      {/* 좌측 노트 빨간 마진선 */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: "#fca5a5",
          zIndex: 1,
        }}
      />

      {/* 중앙 은은한 스튜디오 앰비언트 글로우 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 1400,
          height: 800,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.4) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* 1. 상단 헤더 영역 */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 150,
          right: 150,
          zIndex: 10,
          transform: `translateY(${(1 - enterSpring) * -20}px)`,
          opacity: enterSpring,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#1e293b",
              letterSpacing: "-0.02em",
              fontFamily: fontEN,
            }}
          >
            {categoryTitle}
          </div>

          <div
            style={{
              backgroundColor: "#ef4444",
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 800,
              padding: "8px 24px",
              borderRadius: 20,
              letterSpacing: "0.05em",
              fontFamily: fontEN,
            }}
          >
            {numberBadge}
          </div>
        </div>

        {/* 헤더 하단 레드 언더라인 */}
        <div
          style={{
            width: "100%",
            height: 3,
            backgroundColor: "#ef4444",
            borderRadius: 2,
          }}
        />
      </div>

      {/* 2. 중앙 메인 데스크 레이아웃 (16:9 와이드 퍼스트모션) */}
      <div
        style={{
          position: "absolute",
          top: 145,
          left: 150,
          right: 150,
          height: 800,
          zIndex: 20,
          display: "flex",
          gap: 36,
        }}
      >
        {/* [좌측 메인 카드] */}
        <div
          style={{
            flex: "1 1 65%",
            backgroundColor: "#f8fafc",
            border: "3px solid #dae1eb",
            borderRadius: 28,
            padding: "40px 48px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.08)",
            transform: `translateY(${exitSlide}px) scale(${enterSpring})`,
            opacity: exitOpacity,
            transition: "all 0.1s linear",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 20,
                borderBottom: "2px solid #e2e8f0",
              }}
            >
              {/* 동적 STEP 뱃지 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    backgroundColor: "#1e293b",
                    color: "#ffffff",
                    fontSize: 22,
                    fontWeight: 700,
                    padding: "6px 16px",
                    borderRadius: 10,
                    letterSpacing: "0.05em",
                    fontFamily: fontEN,
                  }}
                >
                  {currentStepBadge}
                </span>
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#475569",
                    fontFamily: fontEN,
                  }}
                >
                  {currentStepName}
                </span>
              </div>

              {/* 상태 뱃지 + 오디오 파형 바 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: stepBg,
                  border: `1.5px solid ${stepBorder}`,
                  padding: "8px 20px",
                  borderRadius: 14,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    height: 22,
                  }}
                >
                  <div style={{ width: 4, height: wave1, backgroundColor: stepColor, borderRadius: 2 }} />
                  <div style={{ width: 4, height: wave2, backgroundColor: stepColor, borderRadius: 2 }} />
                  <div style={{ width: 4, height: wave3, backgroundColor: stepColor, borderRadius: 2 }} />
                  <div style={{ width: 4, height: wave4, backgroundColor: stepColor, borderRadius: 2 }} />
                </div>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: stepColor,
                    fontFamily: fontEN,
                  }}
                >
                  {frame >= r2End
                    ? isES
                      ? "Shadowing Activo"
                      : "Shadowing Drill Active"
                    : isES
                      ? "Audio Nativo Activo"
                      : "Native Audio Playing"}
                </span>
              </div>
            </div>

            {/* 메인 텍스트 3단 레이아웃 */}
            <div
              style={{
                marginTop: 48,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 32,
              }}
            >
              {/* [1단: 한국어 원문 + 형광펜 스윕 드로잉] */}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  padding: "4px 24px",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12%",
                    left: 0,
                    width: `${highlightProgress}%`,
                    height: "80%",
                    backgroundColor: "rgba(254, 240, 138, 0.9)",
                    borderRadius: 8,
                    zIndex: 1,
                    boxShadow: "0 2px 10px rgba(253, 224, 71, 0.4)",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    fontSize: primaryFontSize,
                    fontWeight: 900,
                    color: "#18181e",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.35,
                    fontFamily: fontKR,
                  }}
                >
                  {primaryText}
                </div>
              </div>

              {/* [2단: 로마자 발음 표기] */}
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: "#2563eb",
                  letterSpacing: "0.01em",
                  fontFamily: fontEN,
                  backgroundColor: "#eff6ff",
                  padding: "8px 24px",
                  borderRadius: 14,
                  border: "1.5px solid #dbeafe",
                  display: "inline-block",
                }}
              >
                {pronunciation}
              </div>

              {/* [3단: 영어 의미] */}
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: meaningColor,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.35,
                  maxWidth: "92%",
                  fontFamily: fontEN,
                }}
              >
                {meaning}
              </div>

              {/* [보충 단어/어휘 힌트] */}
              {vocabNotes && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "12px 28px",
                    backgroundColor: "#fef3c7",
                    border: "2px solid #f59e0b",
                    borderRadius: 16,
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#92400e",
                    textAlign: "center",
                    lineHeight: 1.5,
                    maxWidth: "94%",
                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.1)",
                    fontFamily: fontEN,
                  }}
                  dangerouslySetInnerHTML={{ __html: vocabNotes }}
                />
              )}
            </div>
          </div>

          {/* 하단 진행 바 */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 20,
                color: "#94a3b8",
                fontWeight: 600,
                marginBottom: 8,
                fontFamily: fontEN,
              }}
            >
              <span>{currentStepName}</span>
              <span>{numberBadge}</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 16,
                backgroundColor: "#e2e8f0",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressBarWidth}%`,
                  height: "100%",
                  backgroundColor: stepColor,
                  borderRadius: 8,
                  transition: "background-color 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* [우측 뉘앙스 & 쉐도잉 가이드 카드] */}
        <div
          style={{
            flex: "1 1 35%",
            backgroundColor: "#ffffff",
            border: "3px solid #fed7aa",
            borderRadius: 28,
            padding: "36px 36px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.1)",
            transform: `translateY(${exitSlide}px) scale(${enterSpring})`,
            opacity: exitOpacity,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#c2410c",
                paddingBottom: 16,
                borderBottom: "2px solid #ffedd5",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: fontEN,
              }}
            >
              <span>{resolvedRightHeader}</span>
            </div>

            <div
              style={{
                marginTop: 24,
                backgroundColor: "#fff7ed",
                border: "2px dashed #fb923c",
                borderRadius: 20,
                padding: "24px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#c2410c",
                  marginBottom: 8,
                  fontFamily: fontEN,
                }}
              >
                {rightSubtitle}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#9a3412",
                  lineHeight: 1.35,
                  wordBreak: "keep-all",
                  fontFamily: fontEN,
                }}
                dangerouslySetInnerHTML={{ __html: rightMainQuote }}
              />
            </div>

            <div
              style={{
                marginTop: 22,
                fontSize: 21,
                lineHeight: 1.6,
                color: "#334155",
                wordBreak: "keep-all",
                fontFamily: fontEN,
              }}
              dangerouslySetInnerHTML={{ __html: rightPoint }}
            />
          </div>

          {/* 3회 쉐도잉 동적 카운터 */}
          <div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: "#475569",
                marginBottom: 12,
                textAlign: "center",
                fontFamily: fontEN,
              }}
            >
              {isES ? "Práctica de Shadowing en 3 Pasos" : "3-Step Repeat Shadowing Drill"}
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
              }}
            >
              {/* Round 1 */}
              <div
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 14,
                  textAlign: "center",
                  backgroundColor: isRound1Done ? "#2563eb" : frame < r1End ? "#eff6ff" : "#f1f5f9",
                  color: isRound1Done ? "#ffffff" : frame < r1End ? "#1d4ed8" : "#94a3b8",
                  fontSize: 18,
                  fontWeight: 800,
                  border: `2px solid ${isRound1Done ? "#1d4ed8" : frame < r1End ? "#93c5fd" : "#e2e8f0"}`,
                  transition: "all 0.25s ease-in-out",
                  fontFamily: fontEN,
                }}
              >
                {isRound1Done ? (isES ? "✓ Ronda 1" : "✓ Round 1") : (isES ? "1. Normal" : "1. Standard")}
              </div>

              {/* Round 2 */}
              <div
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 14,
                  textAlign: "center",
                  backgroundColor: isRound2Done ? "#ea580c" : (frame >= r1End && frame < r2End) ? "#fff7ed" : "#f1f5f9",
                  color: isRound2Done ? "#ffffff" : (frame >= r1End && frame < r2End) ? "#c2410c" : "#94a3b8",
                  fontSize: 18,
                  fontWeight: 800,
                  border: `2px solid ${isRound2Done ? "#c2410c" : (frame >= r1End && frame < r2End) ? "#fdba74" : "#e2e8f0"}`,
                  transition: "all 0.25s ease-in-out",
                  fontFamily: fontEN,
                }}
              >
                {isRound2Done ? (isES ? "✓ Ronda 2" : "✓ Round 2") : (isES ? "2. Lento (0.85x)" : "2. Slow (0.85x)")}
              </div>

              {/* Round 3 */}
              <div
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 14,
                  textAlign: "center",
                  backgroundColor: isRound3Done ? "#16a34a" : (frame >= r2End && frame < r3End) ? "#f0fdf4" : "#f1f5f9",
                  color: isRound3Done ? "#ffffff" : (frame >= r2End && frame < r3End) ? "#15803d" : "#94a3b8",
                  fontSize: 18,
                  fontWeight: 800,
                  border: `2px solid ${isRound3Done ? "#15803d" : (frame >= r2End && frame < r3End) ? "#86efac" : "#e2e8f0"}`,
                  transition: "all 0.25s ease-in-out",
                  fontFamily: fontEN,
                }}
              >
                {isRound3Done ? (isES ? "✓ Ronda 3" : "✓ Round 3") : "3. Shadowing"}
              </div>
            </div>
          </div>
        </div>

        {/* 다음 문장 전환 시 슬라이드되어 올라오는 프리뷰 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#f8fafc",
            border: "3px solid #3b82f6",
            borderRadius: 28,
            padding: "40px 48px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
            transform: `translateY(${nextEnterSlide}px)`,
            opacity: nextOpacity,
            pointerEvents: "none",
            zIndex: 30,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                fontSize: 24,
                fontWeight: 800,
                padding: "8px 24px",
                borderRadius: 16,
                border: "2px solid #bfdbfe",
                fontFamily: fontEN,
              }}
            >
              {isES ? "SIGUIENTE EJEMPLO" : "NEXT EXAMPLE"}
            </span>
            <div
              style={{
                marginTop: 25,
                fontSize: 48,
                fontWeight: 800,
                color: "#1e293b",
                wordBreak: "keep-all",
                fontFamily: fontEN,
              }}
            >
              {nextPreviewText}
            </div>
          </div>
        </div>
      </div>

      {/* 3. 하단 브랜드 푸터 */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 150,
          right: 150,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
          opacity: enterSpring,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#64748b",
            fontFamily: fontEN,
          }}
        >
          {footerTitle}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#94a3b8",
            fontFamily: fontEN,
          }}
        >
          {isES
            ? "¡Suscríbete y dale Like para dominar la gramática coreana! 🇰🇷"
            : "Subscribe & Click Like to Master Real Korean! 🇰🇷"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
