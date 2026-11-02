import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
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
  durationInFrames?: number;
  voDurationFrames?: number;
  startFrame?: number;
}

export interface StayHelperUniversalProps {
  hotelName: string;
  hotelSubtitle: string;
  destination: string;
  ambientAudio: string;
  totalDurationInFrames?: number;
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

  // ── DYNAMIC ACT TIMELINE CALCULATION ──
  // Compute start frames and durations dynamically if not explicitly specified
  let currentStart = 0;
  const computedActs = props.acts.map((act) => {
    const voDurFrames = act.voDurationFrames || 180;
    // Default duration is VO duration + 26 frames (+0.85s safety buffer per GEMINI.md)
    const duration = act.durationInFrames || (voDurFrames + 26);
    const start = act.startFrame !== undefined ? act.startFrame : currentStart;
    currentStart = start + duration;
    return {
      ...act,
      startFrame: start,
      durationInFrames: duration,
      voDurationFrames: voDurFrames,
    };
  });

  const outroDuration = 70;
  const totalFrames = props.totalDurationInFrames || (currentStart + outroDuration);
  const outroStartFrame = Math.max(0, totalFrames - outroDuration);

  // Top UI Masthead Opacity (fades during outro)
  const topUiOpacity = interpolate(frame, [outroStartFrame - 15, outroStartFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Global Progress Bar Width (0% to 100%)
  const progressBarWidth = interpolate(frame, [0, totalFrames - 10], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Outro Backdrop Dimming
  const outroBackdropOpacity = interpolate(frame, [outroStartFrame, outroStartFrame + 25], [0, 0.88], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Outro Final Fade
  const outroFade = interpolate(frame, [totalFrames - 20, totalFrames], [0, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Outro Spring & Opacity
  const outroSpring = spring({ frame: frame - outroStartFrame - 5, fps, config: { damping: 18 } });
  const outroOpacity = interpolate(frame, [outroStartFrame, outroStartFrame + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ambient Audio Volume Curve (soft background bed with decrescendo at end)
  const ambientVolume = interpolate(
    frame,
    [0, 30, outroStartFrame - 30, totalFrames],
    [0.18, 0.28, 0.25, 0.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0c10',
        color: '#ffffff',
        fontFamily: '"Cinzel", "Playfair Display", -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* ── AMBIENT BACKGROUND AUDIO TRACK ── */}
      <Audio src={staticFile(props.ambientAudio)} volume={ambientVolume} />

      {/* ── ACT SEQUENCES (STRICT BOUNDARIES: ZERO AUDIO OVERLAPS) ── */}
      {computedActs.map((act, idx) => {
        const isFirstAct = idx === 0;
        const isLastAct = idx === computedActs.length - 1;

        return (
          <Sequence
            key={`act-${idx}`}
            from={act.startFrame}
            durationInFrames={act.durationInFrames}
          >
            <ActVisualAndAudio
              act={act}
              actIndex={idx}
              isFirstAct={isFirstAct}
              isLastAct={isLastAct}
              fps={fps}
            />
          </Sequence>
        );
      })}

      {/* ── LIGHTING & EDITORIAL VIGNETTE ── */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8,12,18,0.70) 0%, rgba(8,12,18,0.05) 24%, rgba(8,12,18,0.05) 58%, rgba(8,12,18,0.92) 84%, rgba(8,12,18,0.98) 100%)',
          pointerEvents: 'none',
          zIndex: 30,
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

      {/* ── OUTRO DIMMING LAYER ── */}
      <AbsoluteFill
        style={{
          opacity: outroBackdropOpacity,
          backgroundColor: '#070a0e',
          pointerEvents: 'none',
          zIndex: 45,
        }}
      />

      {/* ── OUTRO FINAL BLACK FADE ── */}
      <AbsoluteFill
        style={{
          opacity: outroFade,
          backgroundColor: '#05070a',
          pointerEvents: 'none',
          zIndex: 60,
        }}
      />

      {/* ── LUXURY SIGNATURE BRAND OUTRO SLATE ── */}
      {frame >= outroStartFrame && (
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

// ── INTERNAL COMPONENT: SINGLE ACT VISUAL & AUDIO ──
interface ActVisualAndAudioProps {
  act: StayActConfig & { startFrame: number; durationInFrames: number; voDurationFrames: number };
  actIndex: number;
  isFirstAct: boolean;
  isLastAct: boolean;
  fps: number;
}

const ActVisualAndAudio: React.FC<ActVisualAndAudioProps> = ({
  act,
  actIndex,
  isFirstAct,
  isLastAct,
  fps,
}) => {
  const f = useCurrentFrame();
  const dur = act.durationInFrames;

  // ── [요구사항 1: 나레이션 100% 끊김/겹침 방지] ──
  // Voiceover starts at local frame 2 and strictly cuts off at voDurationFrames.
  // The remaining 26 frames (+0.85s) of the act are guaranteed pure silence.

  // ── [요구사항 2: 빠른 줌인/줌아웃 카메라 효과] ──
  // Alternating Zoom:
  // Even acts (0, 2, 4 -> Act 1, 3, 5): Snappy Zoom-IN (1.00 -> 1.13 in 60f, then gentle float to 1.16)
  // Odd acts (1, 3, 5 -> Act 2, 4, 6): Snappy Zoom-OUT (1.18 -> 1.05 in 60f, then gentle settle to 1.02)
  const isZoomIn = actIndex % 2 === 0;

  // Snappy punch in the first 60 frames (~2.0s)
  const fastPunch = interpolate(f, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const scale = isZoomIn
    ? 1.00 + fastPunch * 0.12 + (f / dur) * 0.04
    : 1.18 - fastPunch * 0.12 - (f / dur) * 0.04;

  // Subtle organic camera drifts per act
  let translateX = 0;
  let translateY = 0;
  if (actIndex === 0) {
    translateY = interpolate(f, [0, dur], [10, -10], { extrapolateRight: 'clamp' });
  } else if (actIndex === 1) {
    translateX = interpolate(f, [0, dur], [-10, 10], { extrapolateRight: 'clamp' });
  } else if (actIndex === 2) {
    translateY = interpolate(f, [0, dur], [12, -14], { extrapolateRight: 'clamp' });
  } else if (actIndex === 3) {
    translateY = interpolate(f, [0, dur], [-6, 8], { extrapolateRight: 'clamp' }) + Math.sin(f * 0.06) * 5;
  } else if (actIndex === 4) {
    translateX = interpolate(f, [0, dur], [-10, 10], { extrapolateRight: 'clamp' });
    translateY = interpolate(f, [0, dur], [6, -6], { extrapolateRight: 'clamp' });
  } else if (actIndex === 5) {
    translateY = interpolate(f, [0, dur], [8, -8], { extrapolateRight: 'clamp' });
  }

  // Crossfade Opacity:
  // Slide 1: Starts at Opacity 1.0 immediately (GEMINI.md Rule: instant thumbnail visibility)
  // Slides 2-6: Fade in smoothly over first 12 frames
  // All slides fade out smoothly over final 12 frames (except last act which is dimmed by outro)
  const fadeIn = isFirstAct ? 1 : interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = isLastAct ? 1 : interpolate(f, [dur - 12, dur], [1, 0], { extrapolateLeft: 'clamp' });
  const actOpacity = Math.min(fadeIn, fadeOut);

  // Typography Spring and Highlighter Sweep
  // Slide 1 text starts at spring=1, hl=100% immediately for instant thumbnail reading!
  const textSpring = isFirstAct
    ? 1
    : spring({ frame: f - 4, fps, config: { damping: 22 } });

  const hlSweep = isFirstAct
    ? 100
    : interpolate(f, [10, 42], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const isVideo = Boolean(act.videoPath);

  return (
    <AbsoluteFill style={{ opacity: actOpacity }}>
      {/* ── VOICEOVER AUDIO: STRICT SEQUENCE DURATION (ZERO OVERLAP) ── */}
      <Sequence from={2} durationInFrames={act.voDurationFrames}>
        <Audio src={staticFile(act.voPath)} volume={1.0} />
      </Sequence>

      {/* ── VISUAL MEDIA: SNAPPY ZOOM-IN / ZOOM-OUT ── */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: 'center center',
        }}
      >
        {isVideo && act.videoPath ? (
          <OffthreadVideo
            src={staticFile(act.videoPath)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Img
            src={staticFile(act.imagePath)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </AbsoluteFill>

      {/* ── ACT 4 CAUSTICS AMBIENT WATER SHIMMER ── */}
      {actIndex === 3 && (
        <AbsoluteFill
          style={{
            opacity:
              interpolate(f, [0, 25, dur - 25, dur], [0, 0.26, 0.26, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }) * (0.8 + Math.sin(f * 0.08) * 0.2),
            background:
              'radial-gradient(circle at 45% 65%, rgba(56, 189, 248, 0.35) 0%, rgba(45, 212, 191, 0.12) 50%, transparent 80%)',
            mixBlendMode: 'color-dodge',
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />
      )}

      {/* ── ACT 5 SPA AMBER WELLNESS GLOW ── */}
      {actIndex === 4 && (
        <AbsoluteFill
          style={{
            opacity:
              interpolate(f, [0, 25, dur - 25, dur], [0, 0.20, 0.20, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }) * (0.85 + Math.sin(f * 0.06) * 0.15),
            background:
              'radial-gradient(circle at 60% 40%, rgba(245, 158, 11, 0.30) 0%, rgba(217, 119, 6, 0.10) 60%, transparent 85%)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />
      )}

      {/* ── ACT 6 SUNSET WARMTH BLOOM ── */}
      {actIndex === 5 && (
        <AbsoluteFill
          style={{
            opacity: interpolate(f, [0, 30, dur - 20, dur], [0, 0.32, 0.35, 0.15], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            background:
              'radial-gradient(circle at 65% 55%, rgba(245, 158, 11, 0.45) 0%, rgba(239, 68, 68, 0.25) 45%, transparent 80%)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 32,
          }}
        />
      )}

      {/* ── EDITORIAL CONTENT CARD (STYLE B 46px DUAL FLOATING CHIP) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 75,
          left: 55,
          right: 55,
          zIndex: 40,
          opacity: textSpring,
          transform: `translateY(${(1 - textSpring) * 28}px)`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 4,
            color: '#f6d365',
            fontWeight: 700,
            marginBottom: 8,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {act.badge}
        </div>

        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.15,
            color: '#ffffff',
            marginBottom: 12,
            whiteSpace: 'pre-wrap',
            textShadow: '0 3px 18px rgba(0,0,0,0.9)',
          }}
        >
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
                      width: `${hlSweep}%`,
                      backgroundColor: 'rgba(246, 211, 101, 0.55)',
                      zIndex: -1,
                    }}
                  />
                </span>
                {parts.slice(1).join(act.highlightWord)}
              </>
            );
          })()}
        </div>

        <div
          style={{
            fontSize: 23,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.4,
            marginBottom: 16,
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}
        >
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
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          }}
        >
          {act.fact}
        </div>
      </div>
    </AbsoluteFill>
  );
};
