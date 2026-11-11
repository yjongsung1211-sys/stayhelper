#!/usr/bin/env python3
"""
Hana Zero-Typing QR Code ADB Wireless Pairing & Dual-APK Auto-Installer Daemon
Watches `adb mdns services` every 0.5s. The moment the user scans the QR code
(WIFI:T:ADB;S:studio-hana123;P:123456;;) via Android's `[QR 코드로 기기 페어링]`,
immediately pairs using password `123456`, connects to the device, installs both APKs,
and launches them on the phone screen.
"""
import subprocess
import time
from pathlib import Path

ADB_BIN = Path(r"C:\antigravity_apk_sdk\platform-tools\adb.exe")
BASE_DIR = Path(__file__).resolve().parent.parent
APK_ANTIGRAVITY = BASE_DIR / "Antigravity_Hana.apk"
APK_NOTEHELPER = BASE_DIR / "NoteHelper.apk"
OUT_DIR = Path(r"C:\Users\wushu\.gemini\antigravity\brain\4f5c7e4c-296e-4d72-88db-0ccd529be8fe")


def run_adb(args: list[str], timeout: int = 30) -> tuple[int, str]:
    proc = subprocess.run(
        [str(ADB_BIN)] + args,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )
    return proc.returncode, (proc.stdout + "\n" + proc.stderr).strip()


def main():
    print("[Hana QR Daemon] Starting ADB server...")
    run_adb(["start-server"])
    time.sleep(2)

    paired = False
    connect_addr = "192.168.1.26:32885"

    while True:
        _, mdns_out = run_adb(["mdns", "services"], timeout=5)
        pair_addr = None
        for line in mdns_out.splitlines():
            if "_adb-tls-connect._tcp" in line:
                connect_addr = line.split()[-1]
            if "_adb-tls-pairing._tcp" in line:
                pair_addr = line.split()[-1]

        if pair_addr and not paired:
            print(f"[Hana QR Daemon] Detected QR pairing service at {pair_addr}! Pairing immediately...")
            code, pout = run_adb(["pair", pair_addr, "123456"], timeout=10)
            print(f"[Hana QR Daemon] Pair result ({code}): {pout}")
            if "Successfully paired" in pout or code == 0:
                paired = True
                time.sleep(1)
                _, c_out = run_adb(["connect", connect_addr], timeout=10)
                print(f"[Hana QR Daemon] Connect result: {c_out}")

        # Also check if device is already connected
        _, dev_out = run_adb(["devices"], timeout=5)
        dev_lines = [l.strip() for l in dev_out.splitlines()[1:] if l.strip() and "\tdevice" in l]
        if dev_lines:
            print(f"[Hana QR Daemon] Device connected: {dev_lines[0]}! Installing 2 APKs...")
            if APK_ANTIGRAVITY.exists():
                _, i1 = run_adb(["install", "-r", str(APK_ANTIGRAVITY)], timeout=60)
                print(f"  -> Installed Antigravity_Hana.apk: {i1}")
            if APK_NOTEHELPER.exists():
                _, i2 = run_adb(["install", "-r", str(APK_NOTEHELPER)], timeout=60)
                print(f"  -> Installed NoteHelper.apk: {i2}")

            run_adb(["shell", "pm", "grant", "com.yoonjongsung.antigravity", "android.permission.RECORD_AUDIO"])
            run_adb(["shell", "pm", "grant", "com.yoonjongsung.notehelper", "android.permission.RECORD_AUDIO"])

            print("[Hana QR Daemon] Launching App 1: Antigravity & Hana...")
            run_adb(["shell", "am", "start", "-n", "com.yoonjongsung.antigravity/.MainActivity"])
            time.sleep(5)
            run_adb(["shell", "screencap", "-p", "/sdcard/hana_real_antigravity.png"])
            run_adb(["pull", "/sdcard/hana_real_antigravity.png", str(OUT_DIR / "hana_real_antigravity.png")])

            print("[Hana QR Daemon] Launching App 2: NoteHelper...")
            run_adb(["shell", "am", "start", "-n", "com.yoonjongsung.notehelper/.MainActivity"])
            time.sleep(5)
            run_adb(["shell", "screencap", "-p", "/sdcard/hana_real_notehelper.png"])
            run_adb(["pull", "/sdcard/hana_real_notehelper.png", str(OUT_DIR / "hana_real_notehelper.png")])

            print("[Hana QR Daemon] All done! Exiting.")
            break

        time.sleep(0.5)


if __name__ == "__main__":
    main()
