#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unit tests for Ruflo Adversarial Security Swarm
"""

import os
import sys
import unittest
from pathlib import Path

# Add scripts directory
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
from ruflo_adversarial_security_swarm import (
    RedTeamAgent,
    BlueTeamAgent,
    RufloSwarmCoordinator,
    AUDIT_RULES
)

class TestRufloSecuritySwarm(unittest.TestCase):
    def setUp(self):
        self.coordinator = RufloSwarmCoordinator()
        self.test_dir = Path("scratch/security_test_sandbox")
        self.test_dir.mkdir(parents=True, exist_ok=True)

        # Create a mock vulnerable script in sandbox
        self.vuln_file = self.test_dir / "vuln_mock.py"
        self.vuln_file.write_text(
            'TELEGRAM_BOT_TOKEN = "1234567890:AAEXAMPLEexampleEXAMPLEexampleEXAMP"\n'
            'import subprocess\n'
            'def run_cmd(user_input):\n'
            '    subprocess.run("echo " + user_input, shell=True)\n',
            encoding="utf-8"
        )

    def test_audit_rules_integrity(self):
        self.assertGreaterEqual(len(AUDIT_RULES), 5)
        for r in AUDIT_RULES:
            self.assertIn("cwe", r)
            self.assertIn("severity", r)
            self.assertIn("patterns", r)

    def test_red_team_reconnaissance(self):
        red = RedTeamAgent([self.vuln_file])
        findings = red.conduct_reconnaissance()
        self.assertGreaterEqual(len(findings), 1, "Red team should detect vulnerability in mock file")
        cwe_list = [f["cwe"] for f in findings]
        self.assertIn("CWE-798", cwe_list)

    def test_blue_team_evaluation(self):
        red = RedTeamAgent([self.vuln_file])
        raw_findings = red.conduct_reconnaissance()
        blue = BlueTeamAgent()
        evals = blue.evaluate_defenses(raw_findings)
        self.assertEqual(len(evals), len(raw_findings))
        for item in evals:
            self.assertIn("status", item)
            self.assertIn("shield_level", item)

    def test_coordinator_battle_cycle(self):
        summary = self.coordinator.run_battle(harden=False)
        self.assertIn("totalFilesAudited", summary)
        self.assertIn("defenseRate", summary)
        self.assertIn("securityScore", summary)
        self.assertIn("sovereignSeal", summary)
        self.assertGreater(summary["defenseRate"], 0.0)

        # Verify HTML report was generated
        report_path = Path("reports/security_swarm_battle_report.html")
        self.assertTrue(report_path.exists(), "HTML report must be generated")

if __name__ == "__main__":
    unittest.main()
