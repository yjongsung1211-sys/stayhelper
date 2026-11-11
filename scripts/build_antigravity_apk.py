#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Zero-Gradle Fast Android APK Compiler for Antigravity & Hana Mobile App
Uses pure ASCII staging directory (C:/antigravity_apk_sdk) so Windows native C++ tools
(aapt2.exe, zipalign.exe) never fail on Korean directory names.
Outputs:
  - public/antigravity-hana.apk
  - Antigravity_Hana.apk
"""

import os
import sys
import shutil
import zipfile
import urllib.request
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
LEGACY_SDK_DIR = BASE_DIR / "tools" / "android-sdk"
SDK_DIR = Path("C:/antigravity_apk_sdk")
BUILD_WORK_DIR = SDK_DIR / "build_work"

JDK_URL = "https://aka.ms/download-jdk/microsoft-jdk-17.0.13-windows-x64.zip"
BUILD_TOOLS_URL = "https://dl.google.com/android/repository/build-tools_r34-windows.zip"
PLATFORM_URL = "https://dl.google.com/android/repository/platform-34-ext7_r02.zip"


def migrate_if_needed():
    SDK_DIR.mkdir(parents=True, exist_ok=True)
    if LEGACY_SDK_DIR.exists():
        for item in ["jdk", "build-tools", "platform"]:
            src = LEGACY_SDK_DIR / item
            dst = SDK_DIR / item
            if src.exists() and not dst.exists():
                print(f"[*] Moving {item} to ASCII path {dst} ...")
                shutil.move(str(src), str(dst))


def download_and_extract(url: str, dest_zip: Path, extract_to: Path):
    extract_to.mkdir(parents=True, exist_ok=True)
    if not dest_zip.exists():
        print(f"[*] Downloading {url} ...")
        urllib.request.urlretrieve(url, str(dest_zip))
    print(f"[*] Extracting {dest_zip.name} ...")
    with zipfile.ZipFile(dest_zip, "r") as zf:
        zf.extractall(extract_to)


def ensure_toolchain() -> dict:
    migrate_if_needed()

    # 1. Portable JDK 17
    jdk_root = SDK_DIR / "jdk"
    javac_matches = list(jdk_root.rglob("javac.exe")) if jdk_root.exists() else []
    if not javac_matches:
        download_and_extract(JDK_URL, SDK_DIR / "jdk17.zip", jdk_root)
        javac_matches = list(jdk_root.rglob("javac.exe"))
    if not javac_matches:
        raise RuntimeError("javac.exe not found after extracting JDK")
    jdk_bin = javac_matches[0].parent

    # 2. Android Build-Tools 34
    bt_root = SDK_DIR / "build-tools"
    aapt2_matches = list(bt_root.rglob("aapt2.exe")) if bt_root.exists() else []
    if not aapt2_matches:
        download_and_extract(BUILD_TOOLS_URL, SDK_DIR / "build-tools.zip", bt_root)
        aapt2_matches = list(bt_root.rglob("aapt2.exe"))
    if not aapt2_matches:
        raise RuntimeError("aapt2.exe not found after extracting build-tools")
    bt_dir = aapt2_matches[0].parent

    # 3. Android Platform 34 (android.jar)
    plat_root = SDK_DIR / "platform"
    jar_matches = list(plat_root.rglob("android.jar")) if plat_root.exists() else []
    if not jar_matches:
        download_and_extract(PLATFORM_URL, SDK_DIR / "platform34.zip", plat_root)
        jar_matches = list(plat_root.rglob("android.jar"))
    if not jar_matches:
        raise RuntimeError("android.jar not found after extracting platform")
    android_jar = jar_matches[0]

    return {
        "java": jdk_bin / "java.exe",
        "javac": jdk_bin / "javac.exe",
        "keytool": jdk_bin / "keytool.exe",
        "aapt2": bt_dir / "aapt2.exe",
        "zipalign": bt_dir / "zipalign.exe",
        "d8_jar": bt_dir / "lib" / "d8.jar",
        "apksigner_jar": bt_dir / "lib" / "apksigner.jar",
        "android_jar": android_jar,
    }


def run_cmd(cmd: list, cwd: Path = SDK_DIR):
    cmd_str = [str(c) for c in cmd]
    proc = subprocess.run(cmd_str, cwd=str(cwd), capture_output=True, text=True, encoding="utf-8", errors="replace")
    if proc.returncode != 0:
        raise RuntimeError(f"Command failed ({proc.returncode}): {' '.join(cmd_str)}\nSTDOUT: {proc.stdout}\nSTDERR: {proc.stderr}")
    return proc.stdout


def build_apk():
    tools = ensure_toolchain()
    if BUILD_WORK_DIR.exists():
        shutil.rmtree(BUILD_WORK_DIR)
    BUILD_WORK_DIR.mkdir(parents=True, exist_ok=True)

    # Copy Manifest and Java source into ASCII staging directory
    manifest_src = BASE_DIR / "android" / "app" / "src" / "main" / "AndroidManifest.xml"
    java_src = BASE_DIR / "android" / "app" / "src" / "main" / "java" / "com" / "yoonjongsung" / "antigravity" / "MainActivity.java"

    staged_manifest = BUILD_WORK_DIR / "AndroidManifest.xml"
    staged_java_dir = BUILD_WORK_DIR / "src" / "com" / "yoonjongsung" / "antigravity"
    staged_java_dir.mkdir(parents=True, exist_ok=True)
    staged_java = staged_java_dir / "MainActivity.java"

    shutil.copy2(manifest_src, staged_manifest)
    shutil.copy2(java_src, staged_java)

    # Prepare res directory with dedicated Antigravity app icon
    res_dir = BUILD_WORK_DIR / "res"
    drawable_dir = res_dir / "drawable"
    drawable_dir.mkdir(parents=True, exist_ok=True)
    ag_icon_src = BASE_DIR / "public" / "antigravity-192.png"
    nh_icon_src = BASE_DIR / "public" / "notehelper-192.png"
    if ag_icon_src.exists():
        shutil.copy2(ag_icon_src, drawable_dir / "ic_launcher.png")
    elif nh_icon_src.exists():
        shutil.copy2(nh_icon_src, drawable_dir / "ic_launcher.png")

    # 1. Compile resources with aapt2
    compiled_res_zip = BUILD_WORK_DIR / "compiled_res.zip"
    run_cmd([
        tools["aapt2"],
        "compile",
        "--dir", res_dir,
        "-o", compiled_res_zip,
    ])

    # 2. Link resources & manifest into unsigned APK + generate R.java
    unsigned_apk = BUILD_WORK_DIR / "unsigned.apk"
    r_java_dir = BUILD_WORK_DIR / "gen"
    r_java_dir.mkdir(parents=True, exist_ok=True)

    run_cmd([
        tools["aapt2"],
        "link",
        "-o", unsigned_apk,
        "-I", tools["android_jar"],
        "--manifest", staged_manifest,
        "--java", r_java_dir,
        "--auto-add-overlay",
        compiled_res_zip,
    ])

    # 3. Compile Java sources with javac (target 11 for d8 compatibility)
    classes_dir = BUILD_WORK_DIR / "classes"
    classes_dir.mkdir(parents=True, exist_ok=True)
    java_files = [staged_java] + list(r_java_dir.rglob("*.java"))
    run_cmd([
        tools["javac"],
        "-source", "11",
        "-target", "11",
        "-encoding", "UTF-8",
        "-cp", tools["android_jar"],
        "-d", classes_dir,
        *java_files,
    ])

    # 4. Convert .class files to classes.dex using d8
    class_files = list(classes_dir.rglob("*.class"))
    run_cmd([
        tools["java"],
        "-cp", tools["d8_jar"],
        "com.android.tools.r8.D8",
        "--lib", tools["android_jar"],
        "--min-api", "26",
        "--output", BUILD_WORK_DIR,
        *class_files,
    ])

    dex_file = BUILD_WORK_DIR / "classes.dex"
    if not dex_file.exists():
        raise RuntimeError("classes.dex was not generated by D8")

    # 5. Add classes.dex into unsigned.apk
    with zipfile.ZipFile(unsigned_apk, "a", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.write(dex_file, "classes.dex")

    # 6. Zipalign the APK
    aligned_apk = BUILD_WORK_DIR / "aligned.apk"
    run_cmd([
        tools["zipalign"],
        "-f",
        "-p", "4",
        unsigned_apk,
        aligned_apk,
    ])

    # 7. Create keystore if needed & sign APK with apksigner (v1 + v2 + v3)
    keystore = SDK_DIR / "antigravity-release.keystore"
    if not keystore.exists():
        run_cmd([
            tools["keytool"],
            "-genkeypair",
            "-v",
            "-keystore", keystore,
            "-alias", "antigravity",
            "-keyalg", "RSA",
            "-keysize", "2048",
            "-validity", "10000",
            "-storepass", "antigravity2026",
            "-keypass", "antigravity2026",
            "-dname", "CN=Yoon Jong-seong, OU=Antigravity AI, O=1PersonEnterprise, L=Seoul, S=Seoul, C=KR",
        ])

    signed_staged_apk = BUILD_WORK_DIR / "Antigravity_Hana_Signed.apk"
    run_cmd([
        tools["java"],
        "-jar", tools["apksigner_jar"],
        "sign",
        "--ks", keystore,
        "--ks-key-alias", "antigravity",
        "--ks-pass", "pass:antigravity2026",
        "--key-pass", "pass:antigravity2026",
        "--out", signed_staged_apk,
        aligned_apk,
    ])

    public_apk = BASE_DIR / "public" / "antigravity-hana.apk"
    root_apk = BASE_DIR / "Antigravity_Hana.apk"
    shutil.copy2(signed_staged_apk, public_apk)
    shutil.copy2(signed_staged_apk, root_apk)

    size_kb = round(public_apk.stat().st_size / 1024, 1)
    print(f"[+] SUCCESS! Signed Android APK built: {public_apk} ({size_kb} KB)")
    print(f"[+] Root copy saved at: {root_apk}")

    # Also build NoteHelper dedicated APK (com.yoonjongsung.notehelper)
    nh_work = SDK_DIR / "build_work_nh"
    if nh_work.exists():
        shutil.rmtree(nh_work)
    nh_work.mkdir(parents=True, exist_ok=True)

    nh_manifest = nh_work / "AndroidManifest.xml"
    nh_manifest_txt = manifest_src.read_text(encoding="utf-8")
    nh_manifest_txt = nh_manifest_txt.replace("com.yoonjongsung.antigravity", "com.yoonjongsung.notehelper")
    nh_manifest_txt = nh_manifest_txt.replace('android:label="Antigravity &amp; Hana"', 'android:label="NoteHelper (노트헬퍼)"')
    nh_manifest.write_text(nh_manifest_txt, encoding="utf-8")

    nh_java_dir = nh_work / "src" / "com" / "yoonjongsung" / "notehelper"
    nh_java_dir.mkdir(parents=True, exist_ok=True)
    nh_java = nh_java_dir / "MainActivity.java"
    nh_java_txt = java_src.read_text(encoding="utf-8")
    nh_java_txt = nh_java_txt.replace("package com.yoonjongsung.antigravity;", "package com.yoonjongsung.notehelper;")
    nh_java_txt = nh_java_txt.replace(
        "https://secondbrain-note.vercel.app/antigravity",
        "https://secondbrain-note.vercel.app/notehelper",
    ).replace(
        "https://thestayhelper.vercel.app/antigravity",
        "https://secondbrain-note.vercel.app/notehelper",
    ).replace(
        'target.contains("/notehelper") || target.contains("/secondbrain")',
        'target.contains("/antigravity")'
    ).replace(
        'url.contains("/notehelper") || url.contains("/secondbrain")',
        'url.contains("/antigravity")'
    )
    nh_java.write_text(nh_java_txt, encoding="utf-8")

    nh_res = nh_work / "res" / "drawable"
    nh_res.mkdir(parents=True, exist_ok=True)
    if nh_icon_src.exists():
        shutil.copy2(nh_icon_src, nh_res / "ic_launcher.png")

    nh_comp = nh_work / "compiled_res.zip"
    run_cmd([tools["aapt2"], "compile", "--dir", nh_work / "res", "-o", nh_comp])

    nh_unsigned = nh_work / "unsigned.apk"
    nh_r = nh_work / "gen"
    nh_r.mkdir(parents=True, exist_ok=True)
    run_cmd([
        tools["aapt2"], "link", "-o", nh_unsigned, "-I", tools["android_jar"],
        "--manifest", nh_manifest, "--java", nh_r, "--auto-add-overlay", nh_comp
    ])

    nh_classes = nh_work / "classes"
    nh_classes.mkdir(parents=True, exist_ok=True)
    run_cmd([
        tools["javac"], "-source", "11", "-target", "11", "-encoding", "UTF-8",
        "-cp", tools["android_jar"], "-d", nh_classes, nh_java, *list(nh_r.rglob("*.java"))
    ])

    run_cmd([
        tools["java"], "-cp", tools["d8_jar"], "com.android.tools.r8.D8",
        "--lib", tools["android_jar"], "--min-api", "26", "--output", nh_work,
        *list(nh_classes.rglob("*.class"))
    ])

    with zipfile.ZipFile(nh_unsigned, "a", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.write(nh_work / "classes.dex", "classes.dex")

    nh_aligned = nh_work / "aligned.apk"
    run_cmd([tools["zipalign"], "-f", "-p", "4", nh_unsigned, nh_aligned])

    nh_signed = nh_work / "NoteHelper_Signed.apk"
    run_cmd([
        tools["java"], "-jar", tools["apksigner_jar"], "sign",
        "--ks", keystore, "--ks-key-alias", "antigravity",
        "--ks-pass", "pass:antigravity2026", "--key-pass", "pass:antigravity2026",
        "--out", nh_signed, nh_aligned
    ])

    nh_pub = BASE_DIR / "public" / "notehelper.apk"
    nh_root = BASE_DIR / "NoteHelper.apk"
    shutil.copy2(nh_signed, nh_pub)
    shutil.copy2(nh_signed, nh_root)
    print(f"[+] SUCCESS! Signed NoteHelper APK built: {nh_pub} ({round(nh_pub.stat().st_size / 1024, 1)} KB)")


if __name__ == "__main__":
    build_apk()
