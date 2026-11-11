#!/usr/bin/env python3
"""
Hana Real Android Phone Auto-Detector & Dual-App (NoteHelper + ScheduleHelper) Launcher
Watches ADB for a connected Android smartphone. As soon as the device is detected and authorized,
automatically opens both NoteHelper and ScheduleHelper in Chrome on the phone, interacts with them,
and captures real-device screenshots.
"""
import subprocess
import time
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ADB_BIN = BASE_DIR / "tools" / "platform-tools" / "adb.exe"
OUT_DIR = Path(r"C:\Users\wushu\.gemini\antigravity\brain\4f5c7e4c-296e-4d72-88db-0ccd529be8fe")


def adb(args: list[str]) -> tuple[int, str]:
    proc = subprocess.run(
        [str(ADB_BIN)] + args,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=15,
    )
    return proc.returncode, (proc.stdout + "\n" + proc.stderr).strip()


def check_device():
    code, out = adb(["devices", "-l"])
    lines = [l.strip() for l in out.splitlines()[1:] if l.strip()]
    return lines


def run_dual_app_test_on_phone():
    print("[Hana Phone Bridge] Device connected! Launching NoteHelper...")
    adb(["shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", "https://secondbrain-note.vercel.app/notehelper"])
    time.sleep(5)
    adb(["shell", "screencap", "-p", "/sdcard/hana_real_notehelper.png"])
    adb(["pull", "/sdcard/hana_real_notehelper.png", str(OUT_DIR / "hana_real_notehelper.png")])

    print("[Hana Phone Bridge] Launching ScheduleHelper...")
    adb(["shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", "https://secondbrain-note.vercel.app/schedulehelper"])
    time.sleep(5)
    adb(["shell", "screencap", "-p", "/sdcard/hana_real_schedulehelper.png"])
    adb(["pull", "/sdcard/hana_real_schedulehelper.png", str(OUT_DIR / "hana_real_schedulehelper.png")])
    print("[Hana Phone Bridge] Dual-app real device test completed!")


if __name__ == "__main__":
    for _ in range(180):  # watch for 6 minutes
        devs = check_device()
        if devs and any("\tdevice" in d or " device " in d for d in devs):
            run_dual_app_test_on_phone()
            break
        time.sleep(2)
