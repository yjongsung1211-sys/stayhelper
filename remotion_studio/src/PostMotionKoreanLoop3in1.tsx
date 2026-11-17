import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadNotoSansKR } from "@remotion/google-fonts/NotoSansKR";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: fontKR } = loadNotoSansKR();
const { fontFamily: fontEN } = loadPoppins();

interface CardData {
  indexBadge: string;
  category: string;
  themeColor: string;
  themeBg: string;
  korean: string;
  reading: string;
  english: string;
  nuanceTitle: string;
  nuanceCatch: string;
  bullet1: string;
  bullet2: string;
  repeatText: string;
}

const CARDS: CardData[] = [
  {
    indexBadge: "1 / 3",
    category: "[Crowds & Subway]",
    themeColor: "#2563eb",
    themeBg: "#eff6ff",
    korean: "잠시만요!",
    reading: "[Jam-si-man-yo!]",
    english: '"Excuse me! / Just a second!"',
    nuanceTitle: "Crowd & Subway Nuance 🚇",
    nuanceCatch: '"Magic polite phrase when passing crowds or subway!"',
    bullet1: "• Literally means 'Just a short moment'.",
    bullet2: "• The #1 polite phrase to get through busy Seoul streets.",
    repeatText: 'Repeat: "잠시만요!" [Jam-si-man-yo!]',
  },
  {
    indexBadge: "2 / 3",
    category: "[K-Drama Slang]",
    themeColor: "#ea580c",
    themeBg: "#fff7ed",
    korean: "진짜요?!",
    reading: "[Jin-jja-yo?!]",
    english: '"Really?! / For real?!"',
    nuanceTitle: "Top #1 Reaction Slang 😲",
    nuanceCatch: '"The ultimate Korean reaction word in daily life!"',
    bullet1: "• Shows surprise, enthusiasm, and friendly reaction.",
    bullet2: "• Drop '요' ('진짜?!') when speaking to close friends.",
    repeatText: 'Repeat: "진짜요?!" [Jin-jja-yo?!]',
  },
  {
    indexBadge: "3 / 3",
    category: "[Polite Manners]",
    themeColor: "#059669",
    themeBg: "#ecfdf5",
    korean: "괜찮아요.",
    reading: "[Gwen-chan-a-yo.]",
    english: '"It\'s okay. / No, thank you."',
    nuanceTitle: "Polite Decline & Comfort 🛡️",
    nuanceCatch: '"Multipurpose comfort & polite decline formula!"',
    bullet1: "• Say this when someone apologizes to you warmly.",
    bullet2: "• Politely declines plastic bags or receipts at stores.",
    repeatText: 'Repeat: "괜찮아요." [Gwen-chan-a-yo.]',
  },
];

export const PostMotionKoreanLoop3in1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // 1. 전체 하단 진행 바 (0 ~ 750 프레임 전체 25초)
  const totalProgressBar = interpolate(frame, [0, 745], [5, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. 현재 카드 인덱스 판별 (각 카드당 250프레임 = 8.33초)
  const cardIndex = Math.min(Math.floor(frame / 250), 2);
  const cardData = CARDS[cardIndex];
  const localFrame = frame - cardIndex * 250; // 0 ~ 249 프레임

  // 3. 카드 스케일 & 진입 모션 (유튜브 숏폼 썸네일 최적화: 0프레임부터 Opacity 1, Scale 1로 100% 완전 노출 시작)
  const cardEnterScale = 1.0;

  // 4. 카드 퇴장 슬라이드 (235 ~ 250 로컬 프레임)
  const exitSlide = interpolate(localFrame, [235, 250], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(localFrame, [235, 250], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 5. 옐로우 형광펜 (0프레임부터 100% 노출되어 유튜브 썸네일에 완벽하게 포착)
  const highlightProgress = 100;

  // 6. 3D 입체 플립 회전 (0 ~ 110 로컬 프레임 약 3.7초 동안 완벽한 정면 0도 유지 후 스냅 회전)
  const flipProgress = interpolate(localFrame, [110, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardRotationY = flipProgress * 180;
  const cardScale = interpolate(flipProgress, [0, 0.5, 1], [1, 1.04, 1]);

  // 7. 카드 내부 단계 진행 바
  const cardLocalProgress = interpolate(localFrame, [0, 235], [5, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 8. 오디오 반응형 사운드 웨이브 바
  const wave1 = 12 + Math.sin(frame * 0.4) * 8;
  const wave2 = 18 + Math.sin(frame * 0.5 + 1) * 10;
  const wave3 = 14 + Math.sin(frame * 0.35 + 2) * 9;

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
      {/* ── [FirstMotion 쇼츠 20초 3-in-1 오디오: 3개 문장 네이티브 발음 + 쉐도잉] ── */}
      <Audio src={staticFile("audio_shorts_3in1_daily.wav")} />

      {/* 좌측 노트 빨간 마진선 (FirstMotion 시그니처) */}
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
          1. 상단 고정 헤더: 카테고리 뱃지 & 타이틀
         ======================================================== */}
      <div
        style={{
          position: "absolute",
          top: 175,
          left: 0,
          width: "100%",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* 상단 타원 뱃지 */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "8px 28px",
            backgroundColor: cardData.themeBg,
            border: `2px solid ${cardData.themeColor}`,
            borderRadius: 30,
            fontSize: 28,
            fontWeight: 700,
            color: cardData.themeColor,
            boxShadow: `0 2px 8px ${cardData.themeColor}22`,
            transition: "all 0.2s ease",
          }}
        >
          {cardData.category}
        </div>

        {/* 메인 타이틀 */}
        <h1
          style={{
            fontSize: 46,
            fontWeight: 800,
            color: "#18181e",
            marginTop: 20,
            letterSpacing: "-0.02em",
          }}
        >
          3 Phrases Koreans Say Every Day
        </h1>
      </div>

      {/* ========================================================
          2. 중앙 메인 학습 카드 (FirstMotion 3D 입체 플립 카드)
         ======================================================== */}
      <div
        style={{
          position: "absolute",
          top: 390,
          left: 80,
          width: width - 160, // 920px
          height: 1080,
          perspective: 1400,
          zIndex: 20,
          opacity: exitOpacity,
          transform: `translateY(${exitSlide}px)`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `
              scale(${cardEnterScale * cardScale})
              rotateY(${cardRotationY}deg)
            `,
          }}
        >
          {/* ----------------------------------------------------
              [카드 앞면]: 한국어 원문 & 원어민 발음 리스닝
             ---------------------------------------------------- */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              backgroundColor: "#f8fafc",
              border: "3px solid #dae1eb",
              borderRadius: 32,
              padding: "45px 50px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.09)",
            }}
          >
            {/* 카드 상단 바 */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 25,
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                {/* 1/3, 2/3, 3/3 뱃지 */}
                <div
                  style={{
                    backgroundColor: cardData.themeColor,
                    color: "#ffffff",
                    fontSize: 30,
                    fontWeight: 700,
                    padding: "10px 28px",
                    borderRadius: 16,
                  }}
                >
                  {cardData.indexBadge}
                </div>

                {/* 단계 뱃지 + 오디오 파형 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    backgroundColor: "#eff6ff",
                    border: "1.5px solid #bfdbfe",
                    padding: "8px 22px",
                    borderRadius: 16,
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
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#2563eb",
                    }}
                  >
                    Native Korean Voice
                  </span>
                </div>
              </div>

              {/* 3단 텍스트 레이아웃 */}
              <div
                style={{
                  marginTop: 90,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 55,
                }}
              >
                {/* [1단: 한국어 원문 + 옐로우 형광펜 스윕 드로잉] */}
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    padding: "4px 24px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 0,
                      width: `${highlightProgress}%`,
                      height: "85%",
                      backgroundColor: "rgba(254, 240, 138, 0.85)",
                      borderRadius: 8,
                      zIndex: 1,
                      transition: "width 0.1s linear",
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      zIndex: 2,
                      fontSize: (cardData.korean || "").length > 30 ? 42 : (cardData.korean || "").length > 20 ? 50 : 66,
                      fontWeight: 900,
                      fontFamily: fontKR,
                      color: "#18181e",
                      letterSpacing: "0.01em",
                      lineHeight: 1.3,
                      maxWidth: 820,
                      wordBreak: "keep-all",
                      overflowWrap: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {cardData.korean}
                  </div>
                </div>

                {/* [2단: 로마자 발음 표기 (Romanization)] */}
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    color: "#2563eb",
                    letterSpacing: "0.02em",
                  }}
                >
                  {cardData.reading}
                </div>

                {/* [3단: 영어 의미] */}
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    color: "#334155",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {cardData.english}
                </div>
              </div>
            </div>

            {/* 카드 개별 단계 프로그레스 바 */}
            <div style={{ marginBottom: 15 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 22,
                  color: "#94a3b8",
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                <span>Listening Stage</span>
                <span>STEP 1</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 18,
                  backgroundColor: "#e2e8f0",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${cardLocalProgress}%`,
                    height: "100%",
                    backgroundColor: cardData.themeColor,
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              [카드 뒷면]: 180도 회전 후 나타나는 실전 뉘앙스 & 쉐도잉
             ---------------------------------------------------- */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundColor: "#ffffff",
              border: `3px solid ${cardData.themeColor}55`,
              borderRadius: 32,
              padding: "45px 50px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.12)",
            }}
          >
            {/* 카드 상단 바 */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 25,
                  borderBottom: "2px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    backgroundColor: cardData.themeColor,
                    color: "#ffffff",
                    fontSize: 30,
                    fontWeight: 700,
                    padding: "10px 28px",
                    borderRadius: 16,
                  }}
                >
                  {cardData.indexBadge}
                </div>

                <div
                  style={{
                    backgroundColor: cardData.themeBg,
                    border: `1.5px solid ${cardData.themeColor}55`,
                    padding: "8px 22px",
                    borderRadius: 16,
                    fontSize: 26,
                    fontWeight: 700,
                    color: cardData.themeColor,
                  }}
                >
                  Real Culture Nuance
                </div>
              </div>

              {/* 뒷면 뉘앙스 & 가이드 콘텐츠 */}
              <div
                style={{
                  marginTop: 50,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 32,
                }}
              >
                {/* 뉘앙스 박스 */}
                <div
                  style={{
                    width: "100%",
                    backgroundColor: cardData.themeBg,
                    border: `2px dashed ${cardData.themeColor}`,
                    borderRadius: 20,
                    padding: "26px 20px",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: cardData.themeColor,
                      marginBottom: 10,
                    }}
                  >
                    {cardData.nuanceTitle}
                  </div>
                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: 800,
                      color: "#1e293b",
                      lineHeight: 1.35,
                    }}
                  >
                    {cardData.nuanceCatch}
                  </div>
                </div>

                {/* 상세 포인트 */}
                <div
                  style={{
                    textAlign: "left",
                    width: "100%",
                    padding: "0 10px",
                    fontSize: 26,
                    lineHeight: 1.6,
                    color: "#334155",
                  }}
                >
                  <div style={{ marginBottom: 10 }}>{cardData.bullet1}</div>
                  <div>{cardData.bullet2}</div>
                </div>

                {/* 쉐도잉 배지 */}
                <div
                  style={{
                    marginTop: 15,
                    backgroundColor: "#eff6ff",
                    border: "2px solid #3b82f6",
                    borderRadius: 20,
                    padding: "16px 36px",
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#1d4ed8",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    fontFamily: fontKR,
                  }}
                >
                  {cardData.repeatText}
                </div>
              </div>
            </div>

            {/* 카드 하단 프로그레스 바 */}
            <div style={{ marginBottom: 15 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 22,
                  color: "#94a3b8",
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                <span>Nuance & Shadowing</span>
                <span>STEP 2</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 18,
                  backgroundColor: "#e2e8f0",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${cardLocalProgress}%`,
                    height: "100%",
                    backgroundColor: cardData.themeColor,
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. 하단 전체 쇼츠 진행 바 (20초 전체 진행 상태)
         ======================================================== */}
      <div
        style={{
          position: "absolute",
          bottom: 170,
          left: 80,
          width: width - 160,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            fontWeight: 700,
            color: "#64748b",
            marginBottom: 8,
          }}
        >
          <span>TOTAL LESSON PROGRESS</span>
          <span>{cardIndex + 1} / 3 PHRASES</span>
        </div>
        <div
          style={{
            width: "100%",
            height: 12,
            backgroundColor: "#e2e8f0",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${totalProgressBar}%`,
              height: "100%",
              backgroundColor: "#2563eb",
              borderRadius: 6,
            }}
          />
        </div>
      </div>

      {/* ========================================================
          4. 최하단 브랜드 푸터
         ======================================================== */}
      <div
        style={{
          position: "absolute",
          bottom: 105,
          left: 0,
          width: "100%",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#64748b",
            letterSpacing: "0.08em",
          }}
        >
          KOREANLOOP • 3D FIRSTMOTION™
        </span>
      </div>
    </AbsoluteFill>
  );
};
