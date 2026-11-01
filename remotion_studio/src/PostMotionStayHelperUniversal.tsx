import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from 'remotion';

export interface StayActConfig {
  badge: string;
  title: string;
  highlightWord: string;
  description: string;
  fact: string;
  imagePath: string;
  videoPath?: string;
  voPath: string;
}

export interface StayHelperUniversalProps {
  hotelName: string;
  hotelSubtitle: string;
  destination: string;
  ambientAudio: string;
  acts: StayActConfig[];
  outro: {
    brand: string;
    tagline: string;
    cta: string;
    url: string;
  };
}

export const defaultStayHelperProps: StayHelperUniversalProps = {
  hotelName: 'FOUR SEASONS RESORT',
  hotelSubtitle: 'KOH SAMUI · CLIFFSIDE VILLA',
  destination: 'KOH SAMUI, THAILAND',
  ambientAudio: 'stays/stay_luxury_ambient.mp3',
  acts: [
    {
      badge: 'ACT 01 / PANORAMIC ARRIVAL',
      title: 'The Ocean Sanctuary',
      highlightWord: 'Sanctuary',
      description: 'Perched high upon lush tropical cliffs overlooking the Gulf of Thailand.',
      fact: '💡 HIGHLIGHT: CLIFFSIDE RESIDENCE & UNRIVALED GULF VISTAS',
      imagePath: 'stays/fs_kohsamui/01_cliffside_panorama.jpg',
      voPath: 'stays/fs_kohsamui/vo_1.mp3',
    },
    {
      badge: 'ACT 02 / BOTANICAL PATH',
      title: 'Lush Bamboo Sanctuary',
      highlightWord: 'Sanctuary',
      description: 'Wandering down secluded bamboo groves toward your private ocean hideaway.',
      fact: '💡 SETTING: PRIVATE TROPICAL HILLSIDE PATH TO YOUR VILLA',
      imagePath: 'stays/fs_kohsamui/02_bamboo_stroll.jpg',
      videoPath: 'stays/fs_kohsamui/kling_act2_bamboo_stroll.mp4',
      voPath: 'stays/fs_kohsamui/vo_2.mp3',
    },
    {
      badge: 'ACT 03 / SACRED HERITAGE',
      title: 'Temple of Gold',
      highlightWord: 'Gold',
      description: 'Ascending the golden dragon steps of Wat Phra Yai in handcrafted Thai silk.',
      fact: '💡 CULTURE: HISTORIC 12-METER BIG BUDDHA LANDMARK',
      imagePath: 'stays/fs_kohsamui/03_big_buddha_temple.jpg',
      voPath: 'stays/fs_kohsamui/vo_3.mp3',
    },
    {
      badge: 'ACT 04 / CLIFFSIDE INDULGENCE',
      title: 'Floating Serenity',
      highlightWord: 'Serenity',
      description: 'Floating breakfast in your infinity pool overlooking boundless turquoise waters.',
      fact: '💡 EXPERIENCE: PRIVATE INFINITY POOL FLOATING BREAKFAST',
      imagePath: 'stays/fs_kohsamui/04_infinity_pool_floating.jpg',
      voPath: 'stays/fs_kohsamui/vo_4.mp3',
    },
    {
      badge: 'ACT 05 / HOLISTIC HEALING',
      title: 'Warm Coconut Therapy',
      highlightWord: 'Therapy',
      description: 'Open-air jungle pavilion massage where warm oils dissolve away all tension.',
      fact: '💡 WELLNESS: ANCIENT SOUTHERN THAI BOTANICAL THERAPY',
      imagePath: 'stays/fs_kohsamui/05_spa_oil_massage.jpg',
      voPath: 'stays/fs_kohsamui/vo_5.mp3',
    },
    {
      badge: 'ACT 06 / GOLDEN HOUR',
      title: 'Twilight Celebration',
      highlightWord: 'Celebration',
      description: 'Sunset cocktails by the sea. Celebrate twilight in true bespoke comfort.',
      fact: '💡 SUNSET: GOLDEN HOUR OVER THE GULF OF THAILAND',
      imagePath: 'stays/fs_kohsamui/06_sunset_cocktail.jpg',
      videoPath: 'stays/fs_kohsamui/kling_act6_sunset_cocktail_smooth.mp4',
      voPath: 'stays/fs_kohsamui/vo_6.mp3',
    },
  ],
  outro: {
    brand: 'STAYHELPER',
    tagline: 'Curated Luxury Sanctuaries',
    cta: 'Reserve Your Private Villa',
    url: 'stayhelper.com · Link in Bio',
  },
};

export const PostMotionStayHelperUniversal: React.FC<StayHelperUniversalProps> = (userProps) => {
  const props = { ...defaultStayHelperProps, ...userProps };
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // ── 6-ACT MASTER TIMING (Total 1050 frames = 35.0s @ 30fps) ──
  const op1 = interpolate(frame, [0, 150, 165], [1, 1, 0], { extrapolateRight: 'clamp' });
  const scale1 = interpolate(frame, [0, 165], [1.0, 1.05], { extrapolateRight: 'clamp' });

  const op2 = interpolate(frame, [150, 165, 310, 325], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale2 = interpolate(frame, [150, 325], [1.0, 1.05], { extrapolateRight: 'clamp' });

  const op3 = interpolate(frame, [310, 325, 470, 485], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale3 = interpolate(frame, [310, 485], [1.0, 1.05], { extrapolateRight: 'clamp' });

  const op4 = interpolate(frame, [470, 485, 630, 645], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale4 = interpolate(frame, [470, 645], [1.0, 1.06], { extrapolateRight: 'clamp' });

  const op5 = interpolate(frame, [630, 645, 790, 805], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale5 = interpolate(frame, [630, 805], [1.0, 1.05], { extrapolateRight: 'clamp' });

  const op6 = interpolate(frame, [790, 805], [0, 1], { extrapolateLeft: 'clamp' });
  const scale6 = interpolate(frame, [790, 1050], [1.0, 1.08], { extrapolateRight: 'clamp' });

  const opList = [op1, op2, op3, op4, op5, op6];
  const scaleList = [scale1, scale2, scale3, scale4, scale5, scale6];

  // ── [개선 3번] 3·4·5막 유기적 카메라 동선 (Organic Drift) & 앰비언트 빛 호흡 ──
  const translateY3 = interpolate(frame, [310, 485], [12, -18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY4 = interpolate(frame, [470, 645], [-8, 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const waveFloatX4 = Math.sin((frame - 470) * 0.04) * 8;
  const causticsOpacity =
    interpolate(frame, [470, 510, 615, 645], [0, 0.24, 0.24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) *
    (0.8 + Math.sin(frame * 0.08) * 0.2);

  const translateX5 = interpolate(frame, [630, 805], [-12, 12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY5 = interpolate(frame, [630, 805], [8, -8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const spaGlowOpacity =
    interpolate(frame, [630, 670, 775, 805], [0, 0.18, 0.18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) *
    (0.85 + Math.sin(frame * 0.06) * 0.15);

  // Sunset Emotional Bloom Layer (Act 6 & Outro)
  const sunsetPulse = Math.sin((frame - 790) * 0.05);
  const sunsetBloomOpacity = interpolate(
    frame,
    [790, 840, 940, 1020],
    [0, 0.28, 0.35 + sunsetPulse * 0.04, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Outro Dimming
  const outroBackdropOpacity = interpolate(frame, [940, 975], [0, 0.82], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Deep Obsidian Outro Final Fade
  const outroFade = interpolate(frame, [1025, 1050], [0, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dynamic Audio Swell & Outro Decrescendo
  const ambientVolume = interpolate(
    frame,
    [0, 30, 780, 960, 1050],
    [0.18, 0.30, 0.32, 0.28, 0.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Top UI Opacity
  const topUiOpacity = interpolate(frame, [935, 955], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const progressBarWidth = interpolate(frame, [0, 950], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Springs for 6 Acts
  const textSprings = [
    spring({ frame: frame - 5, fps, config: { damping: 22 } }),
    spring({ frame: frame - 165, fps, config: { damping: 22 } }),
    spring({ frame: frame - 325, fps, config: { damping: 22 } }),
    spring({ frame: frame - 485, fps, config: { damping: 22 } }),
    spring({ frame: frame - 645, fps, config: { damping: 22 } }),
    spring({ frame: frame - 805, fps, config: { damping: 22 } }),
  ];

  // Outro Spring & Opacity
  const outroSpring = spring({ frame: frame - 955, fps, config: { damping: 18 } });
  const outroOpacity = interpolate(frame, [950, 970], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Highlighter Sweeps
  const hlSweeps = [
    interpolate(frame, [15, 55], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [175, 215], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [335, 375], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [495, 535], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [655, 695], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [815, 855], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  ];

  const act6TextOpacity = interpolate(
    frame,
    [800, 815, 935, 950],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── [개선 2번] 나레이션 시작점 미세 전진 ──
  const voStartFrames = [2, 162, 322, 482, 642, 792];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0c10',
        color: '#ffffff',
        fontFamily: '"Cinzel", "Playfair Display", -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* ── AUDIO SOUNDSCAPE ── */}
      <Audio src={staticFile(props.ambientAudio)} volume={ambientVolume} />

      {props.acts.map((act, idx) => (
        <Sequence key={`vo-${idx}`} from={voStartFrames[idx]}>
          <Audio src={staticFile(act.voPath)} volume={1.0} />
        </Sequence>
      ))}

      {/* ── VISUAL CANVAS: 6 MASTER EDITORIAL SCENES ── */}
      {props.acts.map((act, idx) => {
        const isVideo = Boolean(act.videoPath);
        const op = opList[idx];
        const scale = scaleList[idx];

        if (isVideo && act.videoPath) {
          const fromFrame = idx === 1 ? 160 : 790;
          const duration = idx === 1 ? 170 : 260;
          return (
            <Sequence key={`scene-${idx}`} from={fromFrame} durationInFrames={duration}>
              <AbsoluteFill
                style={{
                  opacity: op,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                }}
              >
                <OffthreadVideo
                  src={staticFile(act.videoPath)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </AbsoluteFill>
            </Sequence>
          );
        }

        let customTransform = `scale(${scale})`;
        if (idx === 2) {
          customTransform = `scale(${scale}) translateY(${translateY3}px)`;
        } else if (idx === 3) {
          customTransform = `scale(${scale}) translate(${waveFloatX4}px, ${translateY4}px)`;
        } else if (idx === 4) {
          customTransform = `scale(${scale}) translate(${translateX5}px, ${translateY5}px)`;
        }

        return (
          <AbsoluteFill
            key={`scene-${idx}`}
            style={{
              opacity: op,
              transform: customTransform,
              transformOrigin: 'center center',
            }}
          >
            <Img
              src={staticFile(act.imagePath)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </AbsoluteFill>
        );
      })}

      {/* Act 4 Caustics Shimmer Layer */}
      <AbsoluteFill
        style={{
          opacity: causticsOpacity,
          background:
            'radial-gradient(circle at 45% 65%, rgba(56, 189, 248, 0.35) 0%, rgba(45, 212, 191, 0.12) 50%, transparent 80%)',
          mixBlendMode: 'color-dodge',
          pointerEvents: 'none',
          zIndex: 25,
        }}
      />

      {/* Act 5 Spa Warm Amber Glow Layer */}
      <AbsoluteFill
        style={{
          opacity: spaGlowOpacity,
          background:
            'radial-gradient(circle at 60% 40%, rgba(245, 158, 11, 0.30) 0%, rgba(217, 119, 6, 0.10) 60%, transparent 85%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          zIndex: 25,
        }}
      />

      {/* ── LIGHTING & VIGNETTE LAYERS ── */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8,12,18,0.70) 0%, rgba(8,12,18,0.05) 24%, rgba(8,12,18,0.05) 58%, rgba(8,12,18,0.92) 84%, rgba(8,12,18,0.98) 100%)',
          pointerEvents: 'none',
          zIndex: 30,
        }}
      />

      <AbsoluteFill
        style={{
          opacity: sunsetBloomOpacity,
          background:
            'radial-gradient(circle at 65% 55%, rgba(245, 158, 11, 0.45) 0%, rgba(239, 68, 68, 0.25) 45%, transparent 80%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          zIndex: 32,
        }}
      />

      <AbsoluteFill
        style={{
          opacity: outroBackdropOpacity,
          backgroundColor: '#070a0e',
          pointerEvents: 'none',
          zIndex: 34,
        }}
      />

      <AbsoluteFill
        style={{
          opacity: outroFade,
          backgroundColor: '#05070a',
          pointerEvents: 'none',
          zIndex: 60,
        }}
      />

      {/* ── TOP MASTHEAD ── */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 55,
          right: 55,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 40,
          opacity: topUiOpacity,
        }}
      >
        <div
          style={{
            padding: '8px 18px',
            borderRadius: 30,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 215, 0, 0.35)',
            fontSize: 20,
            letterSpacing: 3,
            fontWeight: 700,
            color: '#f6d365',
            textTransform: 'uppercase',
          }}
        >
          {props.destination}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, color: '#ffffff' }}>
            {props.hotelName}
          </div>
          <div style={{ fontSize: 16, letterSpacing: 3, color: 'rgba(255,255,255,0.65)' }}>
            {props.hotelSubtitle}
          </div>
        </div>
      </div>

      {/* ── BOTTOM PROGRESS BAR ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${progressBarWidth}%`,
          height: 6,
          background: 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)',
          boxShadow: '0 0 16px rgba(246, 211, 101, 0.8)',
          zIndex: 50,
          opacity: topUiOpacity,
        }}
      />

      {/* ── BOTTOM CINEMATIC EDITORIAL CONTENT CARDS ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 75,
          left: 55,
          right: 55,
          zIndex: 40,
        }}
      >
        {props.acts.map((act, idx) => {
          const startFrame = idx === 0 ? 0 : idx * 160;
          const endFrame = idx === 5 ? 950 : (idx + 1) * 160;
          if (frame < startFrame || frame >= endFrame) return null;

          const springVal = textSprings[idx];
          const hl = hlSweeps[idx];
          const opacityVal = idx === 5 ? act6TextOpacity * springVal : springVal;

          return (
            <div
              key={`card-${idx}`}
              style={{
                opacity: opacityVal,
                transform: `translateY(${(1 - springVal) * 30}px)`,
              }}
            >
              <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
                {act.badge}
              </div>
              <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12, whiteSpace: 'pre-wrap' }}>
                {(() => {
                  if (!act.highlightWord || !act.title.includes(act.highlightWord)) {
                    return act.title;
                  }
                  const parts = act.title.split(act.highlightWord);
                  return (
                    <>
                      {parts[0]}
                      <span style={{ position: 'relative', display: 'inline-block' }}>
                        {act.highlightWord}
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 2,
                            height: '28%',
                            width: `${hl}%`,
                            backgroundColor: 'rgba(246, 211, 101, 0.45)',
                            zIndex: -1,
                          }}
                        />
                      </span>
                      {parts.slice(1).join(act.highlightWord)}
                    </>
                  );
                })()}
              </div>
              <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16 }}>
                {act.description}
              </div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '12px 26px',
                  borderRadius: 40,
                  background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                  color: '#07090e',
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                {act.fact}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LUXURY SIGNATURE BRAND OUTRO SLATE ── */}
      {frame >= 950 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 50,
            opacity: outroOpacity,
            padding: '0 60px',
          }}
        >
          <div
            style={{
              transform: `scale(${outroSpring})`,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <div style={{ width: 44, height: 1, backgroundColor: 'rgba(246, 211, 101, 0.6)' }} />
            <div style={{ fontSize: 22, color: '#f6d365' }}>✦</div>
            <div style={{ width: 44, height: 1, backgroundColor: 'rgba(246, 211, 101, 0.6)' }} />
          </div>

          <div
            style={{
              fontSize: 70,
              fontWeight: 900,
              letterSpacing: 14,
              background: 'linear-gradient(135deg, #ffffff 0%, #f6d365 55%, #fda085 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 14,
              textShadow: '0 0 36px rgba(246, 211, 101, 0.35)',
              transform: `translateY(${(1 - outroSpring) * 20}px)`,
            }}
          >
            {props.outro.brand}
          </div>

          <div
            style={{
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: 7,
              color: 'rgba(255, 255, 255, 0.82)',
              textTransform: 'uppercase',
              marginBottom: 36,
            }}
          >
            {props.outro.tagline}
          </div>

          <div
            style={{
              padding: '12px 30px',
              borderRadius: 40,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(246, 211, 101, 0.45)',
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 3,
              color: '#f6d365',
              marginBottom: 44,
            }}
          >
            {props.hotelName}
          </div>

          <div
            style={{
              padding: '18px 46px',
              borderRadius: 50,
              background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
              boxShadow: '0 10px 32px rgba(246, 211, 101, 0.35)',
              color: '#07090e',
              fontSize: 23,
              fontWeight: 900,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            {props.outro.cta}
          </div>

          <div
            style={{
              fontSize: 18,
              letterSpacing: 3,
              color: 'rgba(255, 255, 255, 0.65)',
              fontWeight: 600,
            }}
          >
            {props.outro.url}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
