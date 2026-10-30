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

export const PostMotionStayHelperBulgari: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── MASTER ASSETS (Pure 9:16 Ultra-HD & Verified Characters) ──
  const imgArrivalAerial = staticFile('stays/bulgari_pure_01_arrival_aerial.jpg'); // Act 1: 전경 에어리얼
  const imgBedroomSuite = staticFile('stays/bulgari_pure_02_bedroom_honeymoon.jpg'); // Act 2: 장미하트 & 수건백조 샴페인 스위트룸
  const imgPool = staticFile('stays/bulgari_pure_03_pool_swimming_couple.jpg'); // Act 3: 에메랄드 풀 남녀 동반 수영
  const videoMarina = staticFile('stays/bulgari_kling_03_marina.mp4'); // Act 4: 마리나 슈퍼요트
  const videoToastKling = staticFile('stays/kling_916_04_toast.mp4'); // Act 5: 유료 Kling 1.5 Pro 순정 9:16 와인 건배 비디오
  const videoSunsetKling = staticFile('stays/kling_916_05_sunset.mp4'); // Act 6: 유료 Kling 1.5 Pro 순정 9:16 선셋 난간 피날레 비디오

  // Audio Soundscape
  const ambientAudio = staticFile('stays/stay_luxury_ambient.mp3');
  const vo1 = staticFile('stays/bulgari_master_vo_1.mp3');
  const vo2 = staticFile('stays/bulgari_master_vo_2.mp3');
  const vo3 = staticFile('stays/bulgari_master_vo_3.mp3');
  const vo4 = staticFile('stays/bulgari_master_vo_4.mp3');
  const vo5 = staticFile('stays/bulgari_master_vo_5.mp3');
  const vo6 = staticFile('stays/bulgari_master_vo_6.mp3');

  const t = frame / fps;

  // ── 6-ACT MASTER TIMING (900 frames / 30.0s) ──
  const op1 = interpolate(frame, [0, 115, 130], [1, 1, 0], { extrapolateRight: 'clamp' });
  const scale1 = interpolate(frame, [0, 125], [1.0, 1.28], { extrapolateRight: 'clamp' });
  const translateY1 = interpolate(frame, [0, 125], [0, 45], { extrapolateRight: 'clamp' });

  const op2 = interpolate(frame, [115, 130, 255, 270], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale2 = interpolate(frame, [120, 270], [1.0, 1.06], { extrapolateRight: 'clamp' });

  const op3 = interpolate(frame, [255, 270, 405, 420], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale3 = interpolate(frame, [260, 420], [1.0, 1.06], { extrapolateRight: 'clamp' });

  const op4 = interpolate(frame, [405, 420, 555, 570], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale4 = interpolate(frame, [410, 570], [1.0, 1.06], { extrapolateRight: 'clamp' });

  const op5 = interpolate(frame, [555, 570, 630, 645], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale5 = interpolate(frame, [560, 645], [1.0, 1.04], { extrapolateRight: 'clamp' });

  const op6 = interpolate(frame, [630, 645], [0, 1], { extrapolateLeft: 'clamp' });
  const scale6 = interpolate(frame, [635, 900], [1.0, 1.06], { extrapolateRight: 'clamp' });

  // ── FIRSTMOTION™ SIGNATURE MOTION PHYSICS ──
  const wave1 = 8 + Math.sin(t * 7.5) * 6;
  const wave2 = 14 + Math.sin(t * 8.2 + 1) * 8;
  const wave3 = 20 + Math.sin(t * 6.8 + 2) * 10;
  const wave4 = 13 + Math.sin(t * 7.9 + 3) * 7;
  const wave5 = 9 + Math.sin(t * 6.5 + 4) * 6;

  const progressBarWidth = interpolate(frame, [0, 890], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Hotspot Springs
  const pin1Spring = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 120 } });
  const pin2Spring = spring({ frame: frame - 140, fps, config: { damping: 14, stiffness: 120 } });
  const pin3Spring = spring({ frame: frame - 280, fps, config: { damping: 14, stiffness: 120 } });
  const pin4Spring = spring({ frame: frame - 430, fps, config: { damping: 14, stiffness: 120 } });
  const pin5Spring = spring({ frame: frame - 575, fps, config: { damping: 14, stiffness: 120 } });
  const pin6Spring = spring({ frame: frame - 655, fps, config: { damping: 14, stiffness: 120 } });

  // Typography Springs
  const text1Spring = spring({ frame: frame - 5, fps, config: { damping: 22 } });
  const text2Spring = spring({ frame: frame - 130, fps, config: { damping: 22 } });
  const text3Spring = spring({ frame: frame - 270, fps, config: { damping: 22 } });
  const text4Spring = spring({ frame: frame - 420, fps, config: { damping: 22 } });
  const text5Spring = spring({ frame: frame - 565, fps, config: { damping: 22 } });
  const text6Spring = spring({ frame: frame - 645, fps, config: { damping: 22 } });

  // Highlighter Sweeps
  const hl1 = interpolate(frame, [15, 45], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl2 = interpolate(frame, [145, 185], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl3 = interpolate(frame, [285, 325], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl4 = interpolate(frame, [435, 475], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl5 = interpolate(frame, [575, 610], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl6 = interpolate(frame, [655, 695], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0c10',
        color: '#ffffff',
        fontFamily: '"Cinzel", "Playfair Display", -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* ── AUDIO SOUNDSCAPE: Continuous 100% Unclipped Natural Voiceovers ── */}
      <Audio src={ambientAudio} volume={0.30} />

      <Sequence from={10}>
        <Audio src={vo1} volume={1.0} />
      </Sequence>
      <Sequence from={140}>
        <Audio src={vo2} volume={1.0} />
      </Sequence>
      <Sequence from={280}>
        <Audio src={vo3} volume={1.0} />
      </Sequence>
      <Sequence from={425}>
        <Audio src={vo4} volume={1.0} />
      </Sequence>
      <Sequence from={565}>
        <Audio src={vo5} volume={1.0} />
      </Sequence>
      <Sequence from={665}>
        <Audio src={vo6} volume={1.0} />
      </Sequence>

      {/* ── BACKGROUND LAYERS (6-Act Harmonized Framing) ── */}
      {/* Act 1: Grand Island Aerial Panorama */}
      <Sequence from={0} durationInFrames={135}>
        <div style={{ position: 'absolute', inset: 0, opacity: op1, transform: `scale(${scale1}) translateY(${translateY1}px)` }}>
          <Img src={imgArrivalAerial} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </Sequence>

      {/* Act 2: Oceanfront Master Bedroom Suite */}
      <Sequence from={115} durationInFrames={160}>
        <div style={{ position: 'absolute', inset: 0, opacity: op2, transform: `scale(${scale2})` }}>
          <Img src={imgBedroomSuite} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </Sequence>

      {/* Act 3: Emerald Mosaic Infinity Pool (Trip.com #1) */}
      <Sequence from={255} durationInFrames={170}>
        <div style={{ position: 'absolute', inset: 0, opacity: op3, transform: `scale(${scale3})` }}>
          <Img src={imgPool} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </Sequence>

      {/* Act 4: Superyacht Marina */}
      <Sequence from={405} durationInFrames={170}>
        <div style={{ position: 'absolute', inset: 0, opacity: op4, transform: `scale(${scale4})` }}>
          <OffthreadVideo src={videoMarina} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </Sequence>

      {/* Act 5: 남녀 주인공 와인 건배 (유료 Kling 1.5 Pro 순정 9:16 비디오) */}
      <Sequence from={555} durationInFrames={95}>
        <div style={{ position: 'absolute', inset: 0, opacity: op5, transform: `scale(${scale5})` }}>
          <OffthreadVideo
            src={videoToastKling}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </Sequence>

      {/* Act 6: 남녀 주인공 선셋 피날레 (유료 Kling 1.5 Pro 순정 9:16 비디오) */}
      <Sequence from={630} durationInFrames={270}>
        <div style={{ position: 'absolute', inset: 0, opacity: op6, transform: `scale(${scale6})` }}>
          <OffthreadVideo
            src={videoSunsetKling}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </Sequence>

      {/* ── CINEMATIC AMBIENT VIGNETTE ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7,9,14,0.70) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 65%, rgba(5,7,11,0.92) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── TOP HEADER BAR: FIRSTMOTION™ LUXURY METADATA ── */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 50,
          right: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 40,
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
            DUBAI, UAE
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
            BULGARI RESORT
          </div>
          <div style={{ fontSize: 13, letterSpacing: 2, color: 'rgba(255,255,255,0.65)' }}>
            JUMEIRA BAY ISLAND
          </div>
        </div>
      </div>

      {/* ── BOTTOM NARRATIVE & METADATA CARD (100% English) ── */}
      <div style={{ position: 'absolute', bottom: 110, left: 50, right: 50, zIndex: 50 }}>
        {frame >= 0 && frame < 125 && (
          <div style={{ opacity: text1Spring, transform: `translateY(${(1 - text1Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 01 / THE SANCTUARY
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              A Private Island{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Paradise
                <span style={{ position: 'absolute', left: 0, bottom: 2, height: '28%', width: `${hl1}%`, backgroundColor: 'rgba(246, 211, 101, 0.45)', zIndex: -1 }} />
              </span>
            </div>
            <div style={{ display: 'inline-block', padding: '12px 26px', borderRadius: 40, background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#07090e', fontSize: 24, fontWeight: 800 }}>
              💡 SECLUDED: PRIVATE CAUSEWAY ACCESS ON JUMEIRA BAY
            </div>
          </div>
        )}

        {frame >= 125 && frame < 265 && (
          <div style={{ opacity: text2Spring, transform: `translateY(${(1 - text2Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 02 / THE PRIVATE SUITE
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Italian Craftsmanship &{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Ocean Vistas
                <span style={{ position: 'absolute', left: 0, bottom: 2, height: '28%', width: `${hl2}%`, backgroundColor: 'rgba(246, 211, 101, 0.45)', zIndex: -1 }} />
              </span>
            </div>
            <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16 }}>
              Bespoke master suite with private terrace opening to endless azure horizons
            </div>
            <div style={{ display: 'inline-block', padding: '12px 26px', borderRadius: 40, background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#07090e', fontSize: 24, fontWeight: 800 }}>
              💡 DESIGN: ANTONIO CITTERIO SIGNATURE INTERIOR
            </div>
          </div>
        )}

        {frame >= 265 && frame < 415 && (
          <div style={{ opacity: text3Spring, transform: `translateY(${(1 - text3Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 03 / ICONIC POOLSIDE
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Emerald Mosaic{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Infinity Pool
                <span style={{ position: 'absolute', left: 0, bottom: 2, height: '28%', width: `${hl3}%`, backgroundColor: 'rgba(246, 211, 101, 0.45)', zIndex: -1 }} />
              </span>
            </div>
            <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16 }}>
              Where turquoise waters merge seamlessly with private oceanfront cabanas
            </div>
            <div style={{ display: 'inline-block', padding: '12px 26px', borderRadius: 40, background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#07090e', fontSize: 24, fontWeight: 800 }}>
              💡 TRIP.COM #1: THE ULTIMATE CABANA RETREAT
            </div>
          </div>
        )}

        {frame >= 415 && frame < 560 && (
          <div style={{ opacity: text4Spring, transform: `translateY(${(1 - text4Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 04 / PRIVATE YACHT CLUB
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              46-Berth{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Superyacht Marina
                <span style={{ position: 'absolute', left: 0, bottom: 2, height: '28%', width: `${hl4}%`, backgroundColor: 'rgba(246, 211, 101, 0.45)', zIndex: -1 }} />
              </span>
            </div>
            <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16 }}>
              World-first Bulgari yacht club with private charter departures from your door
            </div>
            <div style={{ display: 'inline-block', padding: '12px 26px', borderRadius: 40, background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#07090e', fontSize: 24, fontWeight: 800 }}>
              💡 CHARTER: BESPOKE SUNSET CRUISE ON THE GULF
            </div>
          </div>
        )}

        {frame >= 560 && frame < 645 && (
          <div style={{ opacity: text5Spring, transform: `translateY(${(1 - text5Spring) * 30}px)` }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              ACT 05 / THE CELEBRATION
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 }}>
              Golden Hour{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                Champagne Toast
                <span style={{ position: 'absolute', left: 0, bottom: 2, height: '28%', width: `${hl5}%`, backgroundColor: 'rgba(246, 211, 101, 0.45)', zIndex: -1 }} />
              </span>
            </div>
            <div style={{ display: 'inline-block', padding: '12px 26px', borderRadius: 40, background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#07090e', fontSize: 24, fontWeight: 800 }}>
              💡 MOMENT: CELEBRATING LIFE ON THE WATER
            </div>
          </div>
        )}

        {frame >= 645 && (
          <div style={{ opacity: text6Spring, transform: `translateY(${(1 - text6Spring) * 20}px)`, textAlign: 'center' }}>
            <div style={{ fontSize: 20, letterSpacing: 6, color: '#f6d365', fontWeight: 700, marginBottom: 8 }}>
              EXCLUSIVE CURATION · STAYHELPER
            </div>
            <div style={{ fontSize: 46, fontWeight: 900, color: '#ffffff', marginBottom: 10 }}>
              BULGARI RESORT DUBAI
            </div>
            <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>
              Reserve your bespoke luxury escape on Jumeira Bay
            </div>
            <div
              style={{
                display: 'inline-block',
                padding: '22px 48px',
                borderRadius: 50,
                background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                boxShadow: '0 12px 40px rgba(246, 211, 101, 0.45)',
                color: '#07090e',
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: 2,
              }}
            >
              Let's Book Your Stay ↗
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM GLOBAL PROGRESS BAR ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${progressBarWidth}%`,
          height: 6,
          background: 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)',
          zIndex: 60,
        }}
      />
    </AbsoluteFill>
  );
};
