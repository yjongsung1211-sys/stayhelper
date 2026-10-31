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

export const PostMotionStayHelperKohSamui: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── MASTER 6-ACT VISUAL ASSETS ──
  const imgAct1 = staticFile('stays/fs_kohsamui/01_cliffside_panorama.jpg');
  const imgAct2 = staticFile('stays/fs_kohsamui/02_bamboo_stroll.jpg');
  const imgAct3 = staticFile('stays/fs_kohsamui/03_big_buddha_temple.jpg');
  const imgAct4 = staticFile('stays/fs_kohsamui/04_infinity_pool_floating.jpg');
  const imgAct5 = staticFile('stays/fs_kohsamui/05_spa_oil_massage.jpg');
  const imgAct6 = staticFile('stays/fs_kohsamui/06_sunset_cocktail.jpg');
  const videoAct2 = staticFile('stays/fs_kohsamui/kling_act2_bamboo_stroll.mp4');
  const videoAct6 = staticFile('stays/fs_kohsamui/kling_act6_sunset_cocktail_smooth.mp4');

  // Audio Soundscape: Continuous Luxury Ambience + Permanent Christopher Male Narration
  const ambientAudio = staticFile('stays/stay_luxury_ambient.mp3');
  const vo1 = staticFile('stays/fs_kohsamui/vo_1.mp3');
  const vo2 = staticFile('stays/fs_kohsamui/vo_2.mp3');
  const vo3 = staticFile('stays/fs_kohsamui/vo_3.mp3');
  const vo4 = staticFile('stays/fs_kohsamui/vo_4.mp3');
  const vo5 = staticFile('stays/fs_kohsamui/vo_5.mp3');
  const vo6 = staticFile('stays/fs_kohsamui/vo_6.mp3');

  const t = frame / fps;

  // ── 6-ACT MASTER TIMING (Total 1050 frames = 35.0s @ 30fps) ──
  const op1 = interpolate(frame, [0, 150, 165], [1, 1, 0], { extrapolateRight: 'clamp' });
  // Act 1: Dynamic Cinematic Push-in Zoom (1.0 -> 1.28) + Subtle Vertical Glide (No More Plain Static Look)
  const scale1 = interpolate(frame, [0, 165], [1.0, 1.28], { extrapolateRight: 'clamp' });
  const translateY1 = interpolate(frame, [0, 165], [0, -25], { extrapolateRight: 'clamp' });

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

  // ── 3·4·5막 유기적 카메라 동선 (색상 변형 레이어 없이 순수 모션만 유지) ──
  // Act 3: Golden Temple Upward Tilt
  const translateY3 = interpolate(frame, [310, 485], [12, -18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Act 4: Infinity Pool Buoyancy Float
  const translateY4 = interpolate(frame, [470, 645], [-8, 10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const waveFloatX4 = Math.sin((frame - 470) * 0.04) * 8;

  // Act 5: Jungle Pavilion Diagonal Drift
  const translateX5 = interpolate(frame, [630, 805], [-12, 12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY5 = interpolate(frame, [630, 805], [8, -8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Outro Backdrop Dimming (차분한 암전)
  const outroBackdropOpacity = interpolate(
    frame,
    [940, 975],
    [0, 0.82],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Deep Obsidian Outro Final Fade
  const outroFade = interpolate(frame, [1025, 1050], [0, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dynamic Audio Swell & Gentle Outro Decrescendo
  const ambientVolume = interpolate(
    frame,
    [0, 30, 780, 960, 1050],
    [0.18, 0.30, 0.32, 0.28, 0.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── SIGNATURE MOTION PHYSICS ──
  const wave1 = 8 + Math.sin(t * 7.5) * 6;
  const wave2 = 14 + Math.sin(t * 8.2 + 1) * 8;
  const wave3 = 20 + Math.sin(t * 6.8 + 2) * 10;
  const wave4 = 13 + Math.sin(t * 7.9 + 3) * 7;
  const wave5 = 9 + Math.sin(t * 6.5 + 4) * 6;

  const topUiOpacity = interpolate(frame, [935, 955], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const progressBarWidth = interpolate(frame, [0, 950], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Typography Springs
  const text1Spring = 1.0; // 1막 0초 즉시 100% 완전 노출 (커버 썸네일 규칙)
  const text2Spring = spring({ frame: frame - 165, fps, config: { damping: 22 } });
  const text3Spring = spring({ frame: frame - 325, fps, config: { damping: 22 } });
  const text4Spring = spring({ frame: frame - 485, fps, config: { damping: 22 } });
  const text5Spring = spring({ frame: frame - 645, fps, config: { damping: 22 } });
  const text6Spring = spring({ frame: frame - 805, fps, config: { damping: 22 } });

  // Outro Springs & Fade
  const outroSpring = spring({ frame: frame - 955, fps, config: { damping: 18 } });
  const outroOpacity = interpolate(frame, [950, 970], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Highlighter Sweeps
  const hl1 = 100; // 1막 100% 완독형 프리렌더
  const hl2 = interpolate(frame, [175, 215], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl3 = interpolate(frame, [335, 375], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl4 = interpolate(frame, [495, 535], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl5 = interpolate(frame, [655, 695], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl6 = interpolate(frame, [815, 855], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const act6TextOpacity = interpolate(
    frame,
    [800, 815, 935, 950],
    [0, 1, 1, 0],
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
      {/* ── AUDIO SOUNDSCAPE: Continuous Luxury Ambience & Crystal Male Voiceovers ── */}
      <Audio src={ambientAudio} volume={ambientVolume} />

      <Sequence from={2}>
        <Audio src={vo1} volume={1.0} />
      </Sequence>
      <Sequence from={162}>
        <Audio src={vo2} volume={1.0} />
      </Sequence>
      <Sequence from={322}>
        <Audio src={vo3} volume={1.0} />
      </Sequence>
      <Sequence from={482}>
        <Audio src={vo4} volume={1.0} />
      </Sequence>
      <Sequence from={642}>
        <Audio src={vo5} volume={1.0} />
      </Sequence>
      <Sequence from={792}>
        <Audio src={vo6} volume={1.0} />
      </Sequence>

      {/* ── VISUAL CANVAS: 6 MASTER EDITORIAL SCENES (100% NATURAL CLEAN COLORS) ── */}
      {/* Act 1: Hotel Cliffside Panorama (Dynamic Deep Zoom-in & Cinematic Glide) */}
      <AbsoluteFill
        style={{
          opacity: op1,
          transform: `scale(${scale1}) translateY(${translateY1}px)`,
          transformOrigin: 'center 42%',
        }}
      >
        <Img
          src={imgAct1}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Act 2: Private Bamboo Garden Walk (Kling 1.5 Pro 1080p Live Motion Video) */}
      <Sequence from={160} durationInFrames={170}>
        <AbsoluteFill
          style={{
            opacity: op2,
            transform: `scale(${scale2})`,
            transformOrigin: 'center center',
          }}
        >
          <OffthreadVideo
            src={videoAct2}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Act 3: Wat Phra Yai Golden Temple Steps (Upward Tilt) */}
      <AbsoluteFill
        style={{
          opacity: op3,
          transform: `scale(${scale3}) translateY(${translateY3}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={imgAct3}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Act 4: Infinity Pool Floating Breakfast (Buoyancy Water Float) */}
      <AbsoluteFill
        style={{
          opacity: op4,
          transform: `scale(${scale4}) translate(${waveFloatX4}px, ${translateY4}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={imgAct4}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Act 5: Jungle Pavilion Spa Oil Massage (Diagonal Drift) */}
      <AbsoluteFill
        style={{
          opacity: op5,
          transform: `scale(${scale5}) translate(${translateX5}px, ${translateY5}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={imgAct5}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Act 6: Beachfront Sunset Cocktail Finale (Kling 1.5 Pro Smooth Extended Video) */}
      <Sequence from={790} durationInFrames={260}>
        <AbsoluteFill
          style={{
            opacity: op6,
            transform: `scale(${scale6})`,
            transformOrigin: 'center center',
          }}
        >
          <OffthreadVideo
            src={videoAct6}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── UNIFIED CINEMATIC VIGNETTE (정적이고 우아한 단일 비네트, 색상 깜빡임 0건) ── */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8,12,18,0.65) 0%, rgba(8,12,18,0.02) 25%, rgba(8,12,18,0.02) 60%, rgba(8,12,18,0.90) 84%, rgba(8,12,18,0.98) 100%)',
          pointerEvents: 'none',
          zIndex: 30,
        }}
      />

      {/* Velvet Dimming Layer for Outro Slate */}
      <AbsoluteFill
        style={{
          opacity: outroBackdropOpacity,
          backgroundColor: '#070a0e',
          pointerEvents: 'none',
          zIndex: 34,
        }}
      />

      {/* Deep Obsidian Outro Final Fade to Black */}
      <AbsoluteFill
        style={{
          opacity: outroFade,
          backgroundColor: '#05070a',
          pointerEvents: 'none',
          zIndex: 60,
        }}
      />

      {/* ── TOP MASTHEAD: 5-STAR GLOBAL EDITORIAL BRANDING & AUDIO WAVE ── */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
            KOH SAMUI, THAILAND
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 26 }}>
            <div style={{ width: 3, height: wave1, backgroundColor: '#f6d365', borderRadius: 2 }} />
            <div style={{ width: 3, height: wave2, backgroundColor: '#f6d365', borderRadius: 2 }} />
            <div style={{ width: 3, height: wave3, backgroundColor: '#f6d365', borderRadius: 2 }} />
            <div style={{ width: 3, height: wave4, backgroundColor: '#f6d365', borderRadius: 2 }} />
            <div style={{ width: 3, height: wave5, backgroundColor: '#f6d365', borderRadius: 2 }} />
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, color: '#ffffff' }}>
            FOUR SEASONS RESORT
          </div>
          <div style={{ fontSize: 16, letterSpacing: 3, color: 'rgba(255,255,255,0.65)' }}>
            KOH SAMUI · CLIFFSIDE VILLA
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

      {/* ── BOTTOM CINEMATIC EDITORIAL CONTENT CARDS (ACTS 1 TO 6) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 75,
          left: 55,
          right: 55,
          zIndex: 40,
        }}
      >
        {/* Act 1 */}
        {frame >= 0 && frame < 160 && (
          <div style={{ opacity: text1Spring }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 01 / PANORAMIC ARRIVAL
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              The Ocean{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Sanctuary
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 2,
                    height: '28%',
                    width: `${hl1}%`,
                    backgroundColor: 'rgba(246, 211, 101, 0.45)',
                    zIndex: -1,
                  }}
                />
              </span>
            </div>
            <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16 }}>
              Perched high upon lush tropical cliffs overlooking the Gulf of Thailand.
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
              💡 HIGHLIGHT: CLIFFSIDE RESIDENCE & UNRIVALED GULF VISTAS
            </div>
          </div>
        )}

        {/* Act 2 */}
        {frame >= 160 && frame < 320 && (
          <div style={{ opacity: text2Spring, transform: `translateY(${(1 - text2Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 02 / BOTANICAL PATH
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Lush Bamboo{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Sanctuary
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 2,
                    height: '28%',
                    width: `${hl2}%`,
                    backgroundColor: 'rgba(246, 211, 101, 0.45)',
                    zIndex: -1,
                  }}
                />
              </span>
            </div>
            <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16 }}>
              Wandering down secluded bamboo groves toward your private ocean hideaway.
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
              💡 SETTING: PRIVATE TROPICAL HILLSIDE PATH TO YOUR VILLA
            </div>
          </div>
        )}

        {/* Act 3 */}
        {frame >= 320 && frame < 480 && (
          <div style={{ opacity: text3Spring, transform: `translateY(${(1 - text3Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 03 / SACRED HERITAGE
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Temple of{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Gold
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 2,
                    height: '28%',
                    width: `${hl3}%`,
                    backgroundColor: 'rgba(246, 211, 101, 0.45)',
                    zIndex: -1,
                  }}
                />
              </span>
            </div>
            <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16 }}>
              Ascending the golden dragon steps of Wat Phra Yai in handcrafted Thai silk.
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
              💡 CULTURE: HISTORIC 12-METER BIG BUDDHA LANDMARK
            </div>
          </div>
        )}

        {/* Act 4 */}
        {frame >= 480 && frame < 640 && (
          <div style={{ opacity: text4Spring, transform: `translateY(${(1 - text4Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 04 / CLIFFSIDE INDULGENCE
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Floating{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Serenity
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 2,
                    height: '28%',
                    width: `${hl4}%`,
                    backgroundColor: 'rgba(246, 211, 101, 0.45)',
                    zIndex: -1,
                  }}
                />
              </span>
            </div>
            <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16 }}>
              Floating breakfast in your infinity pool overlooking boundless turquoise waters.
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
              💡 EXPERIENCE: PRIVATE INFINITY POOL FLOATING BREAKFAST
            </div>
          </div>
        )}

        {/* Act 5 */}
        {frame >= 640 && frame < 800 && (
          <div style={{ opacity: text5Spring, transform: `translateY(${(1 - text5Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 05 / HOLISTIC HEALING
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Warm Coconut{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Therapy
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 2,
                    height: '28%',
                    width: `${hl5}%`,
                    backgroundColor: 'rgba(246, 211, 101, 0.45)',
                    zIndex: -1,
                  }}
                />
              </span>
            </div>
            <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16 }}>
              Open-air jungle pavilion massage where warm oils dissolve away all tension.
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
              💡 WELLNESS: ANCIENT SOUTHERN THAI BOTANICAL THERAPY
            </div>
          </div>
        )}

        {/* Act 6: Beachfront Twilight Toast */}
        {frame >= 800 && frame < 950 && (
          <div
            style={{
              opacity: act6TextOpacity * text6Spring,
              transform: `translateY(${(1 - text6Spring) * 30}px)`,
            }}
          >
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 06 / GOLDEN HOUR
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Twilight{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Celebration
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 2,
                    height: '28%',
                    width: `${hl6}%`,
                    backgroundColor: 'rgba(246, 211, 101, 0.45)',
                    zIndex: -1,
                  }}
                />
              </span>
            </div>
            <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16 }}>
              Sunset cocktails by the sea. Celebrate twilight in true bespoke comfort.
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
              💡 SUNSET: GOLDEN HOUR OVER THE GULF OF THAILAND
            </div>
          </div>
        )}
      </div>

      {/* ── LUXURY SIGNATURE BRAND OUTRO SLATE (Frame 950 ~ 1050) ── */}
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
          {/* Subtle Crest / Monogram Star */}
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

          {/* Master Brand Name: STAYHELPER */}
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
            STAYHELPER
          </div>

          {/* Subtitle */}
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
            Curated Luxury Sanctuaries
          </div>

          {/* Hotel Pill */}
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
            FOUR SEASONS RESORT KOH SAMUI
          </div>

          {/* Call to Action Capsule */}
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
            Reserve Your Private Villa
          </div>

          {/* Link in bio info */}
          <div
            style={{
              fontSize: 18,
              letterSpacing: 3,
              color: 'rgba(255, 255, 255, 0.65)',
              fontWeight: 600,
            }}
          >
            stayhelper.com · Link in Bio
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
