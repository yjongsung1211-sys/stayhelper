import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from 'remotion';

export const PostMotionStayHelperChedi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── MASTER 6-ACT VISUAL ASSETS ──
  const imgAct1 = staticFile('stays/chedi_andermatt/act1.jpg');
  const imgAct2 = staticFile('stays/chedi_andermatt/act2.jpg');
  const imgAct3 = staticFile('stays/chedi_andermatt/act3.jpg');
  const imgAct4 = staticFile('stays/chedi_andermatt/act4.jpg');
  const imgAct5 = staticFile('stays/chedi_andermatt/act5.jpg');
  const imgAct6 = staticFile('stays/chedi_andermatt/act6.jpg');

  // Audio Soundscape: Continuous Luxury Ambience + Permanent Christopher Male Narration
  const ambientAudio = staticFile('stays/stay_luxury_ambient.mp3');
  const vo1 = staticFile('stays/chedi_andermatt/vo_1.mp3');
  const vo2 = staticFile('stays/chedi_andermatt/vo_2.mp3');
  const vo3 = staticFile('stays/chedi_andermatt/vo_3.mp3');
  const vo4 = staticFile('stays/chedi_andermatt/vo_4.mp3');
  const vo5 = staticFile('stays/chedi_andermatt/vo_5.mp3');
  const vo6 = staticFile('stays/chedi_andermatt/vo_6.mp3');

  const t = frame / fps;

  // ── 6-ACT MASTER TIMING (Total 1050 frames = 35.0s @ 30fps) ──
  // Act 1: Alpine Arrival (Dynamic 28% Push-in Zoom + Upward Glide)
  const op1 = interpolate(frame, [0, 150, 165], [1, 1, 0], { extrapolateRight: 'clamp' });
  const scale1 = interpolate(frame, [0, 165], [1.0, 1.28], { extrapolateRight: 'clamp' });
  const translateY1 = interpolate(frame, [0, 165], [0, -25], { extrapolateRight: 'clamp' });

  // Act 2: Snow Pine Stroll (Horizontal Glide)
  const op2 = interpolate(frame, [150, 165, 310, 325], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale2 = interpolate(frame, [150, 325], [1.0, 1.06], { extrapolateRight: 'clamp' });
  const translateX2 = interpolate(frame, [150, 325], [-12, 12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Act 3: Modern Zen Chalet Interior (Upward Vertical Tilt)
  const op3 = interpolate(frame, [310, 325, 470, 485], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale3 = interpolate(frame, [310, 485], [1.0, 1.08], { extrapolateRight: 'clamp' });
  const translateY3 = interpolate(frame, [310, 485], [15, -12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Act 4: Steaming Thermal Pool (Water Buoyancy Float)
  const op4 = interpolate(frame, [470, 485, 630, 645], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale4 = interpolate(frame, [470, 645], [1.0, 1.06], { extrapolateRight: 'clamp' });
  const translateY4 = interpolate(frame, [470, 645], [-6, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const waveFloatX4 = Math.sin((frame - 470) * 0.04) * 8;

  // Act 5: Tibetan Spa Sanctuary (Diagonal Drift)
  const op5 = interpolate(frame, [630, 645, 790, 805], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale5 = interpolate(frame, [630, 805], [1.0, 1.06], { extrapolateRight: 'clamp' });
  const translateX5 = interpolate(frame, [630, 805], [-8, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY5 = interpolate(frame, [630, 805], [6, -6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Act 6: Fireside Glühwein Toast (Warm Golden Hour Push)
  const op6 = interpolate(frame, [790, 805], [0, 1], { extrapolateLeft: 'clamp' });
  const scale6 = interpolate(frame, [790, 1050], [1.0, 1.08], { extrapolateRight: 'clamp' });

  // Outro Backdrop Dimming
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

  // Typography entrance springs
  const text1Spring = 1; // Instant first-frame visibility for 0s retention
  const hl1 = interpolate(frame, [10, 36], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const text2Spring = spring({ frame: frame - 165, fps, config: { damping: 14, stiffness: 100 } });
  const hl2 = interpolate(frame, [180, 210], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const text3Spring = spring({ frame: frame - 325, fps, config: { damping: 14, stiffness: 100 } });
  const hl3 = interpolate(frame, [340, 370], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const text4Spring = spring({ frame: frame - 485, fps, config: { damping: 14, stiffness: 100 } });
  const hl4 = interpolate(frame, [500, 530], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const text5Spring = spring({ frame: frame - 645, fps, config: { damping: 14, stiffness: 100 } });
  const hl5 = interpolate(frame, [660, 690], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const text6Spring = spring({ frame: frame - 805, fps, config: { damping: 14, stiffness: 100 } });
  const hl6 = interpolate(frame, [820, 850], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const outroSpring = spring({ frame: frame - 950, fps, config: { damping: 13, stiffness: 85 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#07090e', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      {/* ── AUDIO TRACKS ── */}
      <Audio src={ambientAudio} volume={ambientVolume} />

      <Sequence from={0} durationInFrames={165}>
        <Audio src={vo1} volume={1.0} />
      </Sequence>
      <Sequence from={165} durationInFrames={160}>
        <Audio src={vo2} volume={1.0} />
      </Sequence>
      <Sequence from={325} durationInFrames={160}>
        <Audio src={vo3} volume={1.0} />
      </Sequence>
      <Sequence from={485} durationInFrames={160}>
        <Audio src={vo4} volume={1.0} />
      </Sequence>
      <Sequence from={645} durationInFrames={160}>
        <Audio src={vo5} volume={1.0} />
      </Sequence>
      <Sequence from={805} durationInFrames={245}>
        <Audio src={vo6} volume={1.0} />
      </Sequence>

      {/* ── VISUAL SCENES ── */}
      {/* Act 1: Alpine Peaks Arrival (28% Push-in Zoom) */}
      <AbsoluteFill
        style={{
          opacity: op1,
          transform: `scale(${scale1}) translateY(${translateY1}px)`,
          transformOrigin: 'center 45%',
        }}
      >
        <Img src={imgAct1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Act 2: Snow Pine Stroll (Horizontal Walkway Glide) */}
      <AbsoluteFill
        style={{
          opacity: op2,
          transform: `scale(${scale2}) translateX(${translateX2}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img src={imgAct2} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Act 3: Modern Zen Chalet Interior (Upward Vertical Tilt) */}
      <AbsoluteFill
        style={{
          opacity: op3,
          transform: `scale(${scale3}) translateY(${translateY3}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img src={imgAct3} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Act 4: Steaming Thermal Pool (Buoyancy Water Float) */}
      <AbsoluteFill
        style={{
          opacity: op4,
          transform: `scale(${scale4}) translate(${waveFloatX4}px, ${translateY4}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img src={imgAct4} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Act 5: Tibetan Spa Sanctuary (Diagonal Healing Drift) */}
      <AbsoluteFill
        style={{
          opacity: op5,
          transform: `scale(${scale5}) translate(${translateX5}px, ${translateY5}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img src={imgAct5} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Act 6: Fireside Glühwein Toast (Warm Golden Hour Push) */}
      <AbsoluteFill
        style={{
          opacity: op6,
          transform: `scale(${scale6})`,
          transformOrigin: 'center center',
        }}
      >
        <Img src={imgAct6} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* ── CINEMATIC VIGNETTE ── */}
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
            ANDERMATT, SWITZERLAND
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
            THE CHEDI ANDERMATT
          </div>
          <div style={{ fontSize: 16, letterSpacing: 3, color: 'rgba(255,255,255,0.65)' }}>
            ALPINE SANCTUARY · SWISS ALPS
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
              ACT 01 / ALPINE ARRIVAL
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              The Alpine{' '}
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
              Surrounded by monumental snow-covered peaks of the Swiss Alps.
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
              💡 HIGHLIGHT: 1,440M ELEVATION CHALET & MONUMENTAL GLACIER PEAKS
            </div>
          </div>
        )}

        {/* Act 2 */}
        {frame >= 160 && frame < 320 && (
          <div style={{ opacity: text2Spring, transform: `translateY(${(1 - text2Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 02 / SNOW PINE PATH
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Snow Pine{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Trails
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
              Strolling through quiet snow-draped pine groves toward the warm-lit chalet.
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
              💡 SETTING: PRIVATE HEATED WALKWAYS & FROSTED EVERGREEN FOREST
            </div>
          </div>
        )}

        {/* Act 3 */}
        {frame >= 320 && frame < 480 && (
          <div style={{ opacity: text3Spring, transform: `translateY(${(1 - text3Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 03 / CHALET ARCHITECTURE
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Modern Zen{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Chalet
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
              Jean-Michel Gathy’s soaring timber cathedral with glass-encased fireplaces.
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
              💡 DESIGN: ASIAN MINIMALISM MERGED WITH SWISS TIMBER GRANDEUR
            </div>
          </div>
        )}

        {/* Act 4 */}
        {frame >= 480 && frame < 640 && (
          <div style={{ opacity: text4Spring, transform: `translateY(${(1 - text4Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 04 / THERMAL POOL
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Steaming{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Thermal
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
              Submerging into 38°C heated mineral waters surrounded by pristine alpine snow.
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
              💡 WELLNESS: 35M OUTDOOR HEATED POOL WITH ALPINE PANORAMAS
            </div>
          </div>
        )}

        {/* Act 5 */}
        {frame >= 640 && frame < 800 && (
          <div style={{ opacity: text5Spring, transform: `translateY(${(1 - text5Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 05 / TIBETAN SPA
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Tibetan Spa{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Healing
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
              Rejuvenating with warm organic alpine oils and resonating bronze singing bowls.
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
              💡 SANCTUARY: 2,400 SQM MULTI-LEVEL HOLISTIC SPA & HYDROTHERAPY
            </div>
          </div>
        )}

        {/* Act 6 */}
        {frame >= 800 && frame < 950 && (
          <div style={{ opacity: text6Spring, transform: `translateY(${(1 - text6Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 06 / FIRESIDE TOAST
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Glühwein{' '}
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
              Twilight fireside toast with spiced glühwein as snow falls silently outside.
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
              💡 SUNSET: TWILIGHT BLUE HOUR BY THE ROARING STONE FIREPLACE
            </div>
          </div>
        )}
      </div>

      {/* ── OUTRO SLATE: BESPOKE GOLD BRANDING (FRAMES 950 TO 1050) ── */}
      {frame >= 940 && (
        <AbsoluteFill
          style={{
            zIndex: 45,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 80,
            textAlign: 'center',
            opacity: outroSpring,
            transform: `scale(${interpolate(outroSpring, [0, 1], [0.92, 1.0])})`,
          }}
        >
          <div
            style={{
              padding: '10px 28px',
              borderRadius: 40,
              background: 'rgba(246, 211, 101, 0.15)',
              border: '1px solid rgba(246, 211, 101, 0.4)',
              fontSize: 22,
              letterSpacing: 5,
              fontWeight: 700,
              color: '#f6d365',
              marginBottom: 35,
              textTransform: 'uppercase',
            }}
          >
            ANDERMATT · SWISS ALPS
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: 8,
              lineHeight: 1.1,
              color: '#ffffff',
              marginBottom: 15,
            }}
          >
            THE CHEDI ANDERMATT
          </div>

          <div
            style={{
              fontSize: 28,
              letterSpacing: 6,
              color: 'rgba(255,255,255,0.65)',
              textTransform: 'uppercase',
              marginBottom: 60,
            }}
          >
            SWITZERLAND
          </div>

          <div
            style={{
              padding: '20px 48px',
              borderRadius: 60,
              background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
              color: '#07090e',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 3,
              boxShadow: '0 20px 60px rgba(246, 211, 101, 0.4)',
            }}
          >
            Reserve Your Alpine Sanctuary ↗
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 90,
              fontSize: 22,
              letterSpacing: 6,
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            STAYHELPER · CURATED EDITORIAL
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
