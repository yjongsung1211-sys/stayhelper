import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadNotoSansKR } from "@remotion/google-fonts/NotoSansKR";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const fontKR = '"Noto Sans KR", "Malgun Gothic", sans-serif';
const fontEN = '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif';

interface AllInOneProps {
  category: string;
  categoryColor: string;
  categoryBg: string;
  title: string;
  tagText: string;
  korean: string;
  romanization: string;
  english: string;
  nuanceTitle: string;
  nuanceDesc: string;
  audioFile: string;
}

export const PostMotionKoreanLoopAllInOne: React.FC<AllInOneProps> = ({
  category = "[K-BBQ Guide]",
  categoryColor = "#dc2626",
  categoryBg = "#fef2f2",
  title = "Must-Know Phrase at Korean BBQ 🥩",
  tagText = "K-FOOD SURVIVAL",
  korean = "불판 좀 갈아주세요.",
  romanization = "[Bul-pan jom ga-ra-ju-se-yo.]",
  english = '"Could you change the grill plate, please?"',
  nuanceTitle = "K-BBQ Culture Tip 🥩",
  nuanceDesc = "Swap grill nets anytime to prevent meat from burning!",
  audioFile = "audio_shorts_bbq.wav",
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // 1. 진행 바 (0 ~ 290 프레임)
  const progressBarWidth = interpolate(frame, [0, 290], [5, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. 오디오 반응형 사운드 웨이브 (미세 호흡)
  const wave1 = 14 + Math.sin(frame * 0.4) * 8;
  const wave2 = 22 + Math.sin(frame * 0.5 + 1) * 10;
  const wave3 = 16 + Math.sin(frame * 0.35 + 2) * 9;

  // 3. 미세 유기적 부유 모션 (회전 없이 완벽한 정면 0도 유지)
  const subtleScale = 1.0 + Math.sin(frame * 0.05) * 0.008;

  // 4. 쉐도잉 카운터 동적 하이라이트 (1회: 0~3.5초, 2회: 3.5~6.8초, 3회: 6.8초~10초)
  const repeatActive = frame >= 204; // 6.8초 이후

  // 5. 한글/영문 텍스트 길이에 따라 최적 폰트 크기 계산 (화면 및 카드 밖 이탈 0% 영구 보장)
  const koreanLength = (korean || "").length;
  let dynamicKoreanFontSize = 64;
  if (koreanLength > 32) {
    dynamicKoreanFontSize = 42;
  } else if (koreanLength > 24) {
    dynamicKoreanFontSize = 48;
  } else if (koreanLength > 16) {
    dynamicKoreanFontSize = 54;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `
          linear-gradient(to right, #f1f5f9 1px, transparent 1px),
          linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        fontFamily: fontEN,
        color: "#18181e",
        overflow: "hidden",
      }}
    >
      {/* 오디오 트랙 */}
      <Audio src={staticFile(audioFile)} />

      {/* 좌측 노트 빨간 마진선 */}
      <div
        style={{
          position: "absolute",
          left: 80,
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
          top: "40%",
          left: "50%",
          width: 900,
          height: 1100,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.4) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ========================================================
          1. 상단 카테고리 뱃지 & 타이틀 (0초부터 100% 완전 노출)
         ======================================================== */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 0,
          width: "100%",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "8px 28px",
            backgroundColor: categoryBg,
            border: `2px solid ${categoryColor}`,
            borderRadius: 30,
            fontSize: 28,
            fontWeight: 700,
            color: categoryColor,
            boxShadow: `0 2px 8px ${categoryColor}18`,
          }}
        >
          {category}
        </div>

        <h1
          style={{
            fontSize: 46,
            fontWeight: 800,
            color: "#18181e",
            marginTop: 20,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
      </div>

      {/* ========================================================
          2. 중앙 메인 학습 카드 (전 프레임 100% 정면 불변 유지)
         ======================================================== */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 80,
          width: width - 160, // 920px
          height: 1180,
          zIndex: 20,
          transform: `scale(${subtleScale})`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f8fafc",
            border: "3px solid #dae1eb",
            borderRadius: 32,
            padding: "45px 48px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.09)",
          }}
        >
          {/* [카드 헤더]: 뱃지 + 네이티브 오디오 파형 */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 22,
                borderBottom: "2px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  backgroundColor: categoryColor,
                  color: "#ffffff",
                  fontSize: 26,
                  fontWeight: 700,
                  padding: "8px 24px",
                  borderRadius: 14,
                }}
              >
                {tagText}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: "#eff6ff",
                  border: "1.5px solid #bfdbfe",
                  padding: "8px 20px",
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    height: 28,
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: wave1,
                      backgroundColor: "#2563eb",
                      borderRadius: 3,
                    }}
                  />
                  <div
                    style={{
                      width: 5,
                      height: wave2,
                      backgroundColor: "#2563eb",
                      borderRadius: 3,
                    }}
                  />
                  <div
                    style={{
                      width: 5,
                      height: wave3,
                      backgroundColor: "#2563eb",
                      borderRadius: 3,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#2563eb",
                  }}
                >
                  Native Seoul Voice
                </span>
              </div>
            </div>

            {/* [핵심 3단 레이아웃]: 0초부터 끝까지 100% 초대형 볼드 노출 */}
            <div
              style={{
                marginTop: 65,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 40,
              }}
            >
              {/* 1단: 대문짝 문장 + 반응형 형광펜 하이라이트 (카드 밖/화면 밖 이탈 0% 영구 보장) */}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  maxWidth: 820,
                  boxSizing: "border-box",
                  textAlign: "center",
                  padding: "4px 8px",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    zIndex: 2,
                    fontSize: dynamicKoreanFontSize,
                    fontWeight: 900,
                    fontFamily: fontKR,
                    color: "#0f172a",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.35,
                    wordBreak: "keep-all",
                    overflowWrap: "break-word",
                    backgroundColor: "rgba(254, 240, 138, 0.95)",
                    padding: "4px 18px",
                    borderRadius: 12,
                    boxDecorationBreak: "clone",
                    WebkitBoxDecorationBreak: "clone",
                    display: "inline",
                  }}
                >
                  {korean}
                </span>
              </div>

              {/* 2단: 로마자 발음 / 한국어 뜻 */}
              <div
                style={{
                  fontSize: (romanization || "").length > 28 ? 32 : 38,
                  fontWeight: 700,
                  color: "#2563eb",
                  letterSpacing: "0.01em",
                  maxWidth: 820,
                  wordBreak: "keep-all",
                  overflowWrap: "break-word",
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                {romanization}
              </div>

              {/* 3단: 영어 의미 */}
              <div
                style={{
                  fontSize: (english || "").length > 32 ? 36 : 42,
                  fontWeight: 800,
                  color: "#334155",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                  maxWidth: 820,
                  wordBreak: "keep-all",
                  overflowWrap: "break-word",
                  textAlign: "center",
                }}
              >
                {english}
              </div>
            </div>

            {/* [실전 뉘앙스 & 팁 박스]: 카드 하단에 상시 정면 배치 */}
            <div
              style={{
                marginTop: 55,
                backgroundColor: "#ffffff",
                border: "2px solid #e2e8f0",
                borderRadius: 20,
                padding: "26px 28px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: categoryColor,
                  marginBottom: 8,
                }}
              >
                {nuanceTitle}
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#1e293b",
                  lineHeight: 1.35,
                }}
              >
                {nuanceDesc}
              </div>
            </div>

            {/* 쉐도잉 따라하기 반응형 바 */}
            <div
              style={{
                marginTop: 25,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  maxWidth: 820,
                  boxSizing: "border-box",
                  backgroundColor: repeatActive ? "#dbeafe" : "#f1f5f9",
                  border: repeatActive ? "2px solid #3b82f6" : "1.5px solid #cbd5e1",
                  borderRadius: 16,
                  padding: "10px 24px",
                  fontSize: (korean || "").length > 25 ? 22 : 26,
                  fontWeight: 800,
                  color: repeatActive ? "#1d4ed8" : "#64748b",
                  fontFamily: fontKR,
                  transition: "all 0.2s ease",
                  wordBreak: "keep-all",
                  overflowWrap: "break-word",
                  textAlign: "center",
                }}
              >
                <span>Repeat: "{korean}"</span>
                {repeatActive && <span>🔥</span>}
              </div>
            </div>
          </div>

          {/* 카드 하단 프로그레스 바 */}
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 20,
                color: "#94a3b8",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              <span>Daily Korean Habit</span>
              <span>100% NATIVE ACCENT</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 14,
                backgroundColor: "#e2e8f0",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressBarWidth}%`,
                  height: "100%",
                  backgroundColor: categoryColor,
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          width: "100%",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#475569",
            letterSpacing: "0.08em",
          }}
        >
          KOREANLOOP • 3D FIRSTMOTION™
        </div>
      </div>
    </AbsoluteFill>
  );
};
