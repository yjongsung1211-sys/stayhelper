#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unit tests for SecondBrain Local DSP Diarizer
"""

import os
import sys
import unittest
import numpy as np
import scipy.io.wavfile as wavfile
from pathlib import Path

# Add scripts directory
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
from secondbrain_dsp_diarizer import SecondBrainDSPAudioDiarizer

class TestSecondBrainDSPAudioDiarizer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.diarizer = SecondBrainDSPAudioDiarizer(sample_rate=16000)
        cls.test_wav_path = "scratch/test_synth_dialogue.wav"
        os.makedirs("scratch", exist_ok=True)

        # Generate a synthetic multi-speaker audio with two distinctly pitched sine waves (Speaker 1: 180Hz, Speaker 2: 320Hz)
        sr = 16000
        t1 = np.linspace(0, 2.0, int(sr * 2.0), endpoint=False)
        t2 = np.linspace(0, 2.5, int(sr * 2.5), endpoint=False)
        silence = np.zeros(int(sr * 0.5), dtype=np.float32)

        # Voice 1: Base 180Hz + harmonics
        voice1 = (0.5 * np.sin(2 * np.pi * 180 * t1) + 0.25 * np.sin(2 * np.pi * 360 * t1)).astype(np.float32)
        # Voice 2: Base 320Hz + harmonics
        voice2 = (0.5 * np.sin(2 * np.pi * 320 * t2) + 0.25 * np.sin(2 * np.pi * 640 * t2)).astype(np.float32)

        audio_all = np.concatenate([voice1, silence, voice2, silence, voice1])
        wavfile.write(cls.test_wav_path, sr, (audio_all * 32767).astype(np.int16))

    def test_audio_normalization(self):
        audio = self.diarizer.load_and_normalize(self.test_wav_path)
        self.assertIsInstance(audio, np.ndarray)
        self.assertGreater(len(audio), 0)
        self.assertLessEqual(np.max(np.abs(audio)), 1.0)

    def test_vad_detection(self):
        audio = self.diarizer.load_and_normalize(self.test_wav_path)
        segments = self.diarizer.voice_activity_detection(audio)
        self.assertGreaterEqual(len(segments), 2, "VAD should detect multiple speech bursts")
        for start_t, end_t in segments:
            self.assertLess(start_t, end_t)

    def test_voiceprint_embedding_dimension(self):
        audio = self.diarizer.load_and_normalize(self.test_wav_path)
        chunk = audio[: self.diarizer.sample_rate]
        emb = self.diarizer.extract_voiceprint_embedding(chunk)
        self.assertIsInstance(emb, np.ndarray)
        self.assertAlmostEqual(float(np.linalg.norm(emb)), 1.0, places=3, msg="Embedding must be L2 normalized")

    def test_full_diarization_pipeline(self):
        res = self.diarizer.diarize(self.test_wav_path, num_speakers=2)
        self.assertIn("speakersCount", res)
        self.assertIn("turns", res)
        self.assertIn("speakerBreakdown", res)
        self.assertGreaterEqual(res["speakersCount"], 2)
        self.assertGreaterEqual(res["turnsCount"], 2)

        # Markdown export test
        md = self.diarizer.format_diarized_markdown(res, "테스트 미팅")
        self.assertIn("화자별 발화 지분", md)
        self.assertIn("시간대별 발화 타임라인", md)

if __name__ == "__main__":
    unittest.main()
