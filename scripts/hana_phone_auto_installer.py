#!/usr/bin/env python3
"""
Hana Real Android Phone Auto-Detector & Dual-APK (Antigravity_Hana.apk + NoteHelper.apk) Installer
Watches ADB for a connected Android smartphone. As soon as the device is detected and authorized,
automatically installs both signed APKs (`Antigravity_Hana.apk` and `NoteHelper.apk`), launches both apps,
interacts with them, and captures real-device screenshots.
"""
import subprocess
import time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ADB_BIN = BASE_DIR / "tools" / "platform-tools" / "adb.exe"
APK_ANTIGRAVITY = BASE_DIR / "Antigravity_Hana.apk"
APK_NOTEHELPER = BASE_DIR / "NoteHelper.apk"
OUT_DIR = Path(r"C:\Users\wushu\.gemini\antigravity\brain\4f5c7e4c-296e-4d72-88db-0ccd529be8fe")


def adb(args: list[str], timeout: int = 30) -> tuple[int, str]:
    proc = subprocess.run(
        [str(ADB_BIN)] + args,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )
    return proc.returncode, (proc.stdout + "\n" + proc.stderr).strip()


def check_device():
    code, out = adb(["devices", "-l"])
    lines = [l.strip() for l in out.splitlines()[1:] if l.strip()]
    return lines


def run_dual_apk_install_and_test():
    print("[Hana Phone Bridge] Device connected! Installing 2 APKs...")
    if APK_ANTIGRAVITY.exists():
        code, out = adb(["install", "-r", str(APK_ANTIGRAVITY)], timeout=60)
        print(f"  -> Installed Antigravity_Hana.apk ({code}): {out}")
    if APK_NOTEHELPER.exists():
        code, out = adb(["install", "-r", str(APK_NOTEHELPER)], timeout=60)
        print(f"  -> Installed NoteHelper.apk ({code}): {out}")

    # Grant audio permissions automatically via ADB so the user never gets blocked by popups
    adb(["shell", "pm", "grant", "com.yoonjongsung.antigravity", "android.permission.RECORD_AUDIO"])
    adb(["shell", "pm", "grant", "com.yoonjongsung.notehelper", "android.permission.RECORD_AUDIO"])

    print("[Hana Phone Bridge] Launching App 1: Antigravity & Hana...")
    adb(["shell", "am", "start", "-n", "com.yoonjongsung.antigravity/.MainActivity"])
    time.sleep(5)
    adb(["shell", "screencap", "-p", "/sdcard/hana_real_antigravity.png"])
    adb(["pull", "/sdcard/hana_real_antigravity.png", str(OUT_DIR / "hana_real_antigravity.png")])

    print("[Hana Phone Bridge] Launching App 2: NoteHelper...")
    adb(["shell", "am", "start", "-n", "com.yoonjongsung.notehelper/.MainActivity"])
    time.sleep(5)
    adb(["shell", "screencap", "-p", "/sdcard/hana_real_notehelper.png"])
    adb(["pull", "/sdcard/hana_real_notehelper.png", str(OUT_DIR / "hana_real_notehelper.png")])
    print("[Hana Phone Bridge] Dual-APK installation and real device test completed!")


if __name__ == "__main__":
    for _ in range(300):  # watch for 10 minutes
        devs = check_device()
        if devs and any("\tdevice" in d or " device " in d for d in devs):
            run_dual_apk_install_and_test()
            break
        time.sleep(2)
