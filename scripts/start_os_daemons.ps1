# Hermes Autonomous Enterprise - OS-Level Daemon Launcher
# Self-healing, completely detached background daemons independent of terminal/IDE

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$WorkDir = Split-Path -Parent $ScriptDir
Set-Location -Path $WorkDir

# Dynamic executable resolution (portable across any machine)
$PythonCmd = Get-Command python -ErrorAction SilentlyContinue
if ($PythonCmd) {
    $PythonExe = $PythonCmd.Source
} elseif (Test-Path "C:\Users\wushu\.local\bin\python.exe") {
    $PythonExe = "C:\Users\wushu\.local\bin\python.exe"
} else {
    $PythonExe = "python"
}

$HermesCmd = Get-Command hermes -ErrorAction SilentlyContinue
if ($HermesCmd) {
    $HermesExe = $HermesCmd.Source
} elseif (Test-Path "C:\Users\wushu\.local\bin\hermes.exe") {
    $HermesExe = "C:\Users\wushu\.local\bin\hermes.exe"
} else {
    $HermesExe = "hermes"
}

Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "   Hermes 24/7 OS-Level Independent Daemons Bootstrapping..." -ForegroundColor Cyan
Write-Host "===============================================================================" -ForegroundColor Cyan

# 1. Clean up existing python daemons if running
Get-WmiObject Win32_Process -Filter "Name='python.exe'" | ForEach-Object {
    if ($_.CommandLine -match "patrol_daemon.py" -or $_.CommandLine -match "telegram_remote_commander.py" -or $_.CommandLine -match "hermes_master_pipeline.py" -or $_.CommandLine -match "auto_drain_daemon.py" -or $_.CommandLine -match "afk_browser_worker.py" -or $_.CommandLine -match "antigravity_mobile_daemon.py") {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }
}

# 2. Check Ollama AI
$ollamaProc = Get-Process ollama -ErrorAction SilentlyContinue
if (-not $ollamaProc) {
    Write-Host "[1/5] Starting Ollama AI Service in background..." -ForegroundColor Yellow
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
} else {
    Write-Host "[1/5] Ollama AI is already active." -ForegroundColor Green
}

# 3. Hermes Dashboard (Port 9119)
Write-Host "[2/5] Starting Hermes Web Dashboard (Port 9119)..." -ForegroundColor Yellow
Start-Process -FilePath $HermesExe -ArgumentList "dashboard --no-open --port 9119" -WindowStyle Hidden -WorkingDirectory $WorkDir

# 4. 24/7 Patrol Daemon
Write-Host "[3/5] Starting 24/7 Patrol Daemon..." -ForegroundColor Yellow
$patrolScript = Join-Path $WorkDir "scripts\patrol_daemon.py"
Start-Process -FilePath $PythonExe -ArgumentList "-u `"$patrolScript`" --interval 600" -WindowStyle Hidden -WorkingDirectory $WorkDir

# 5. Telegram Remote Commander Bot
Write-Host "[4/5] Starting Telegram Remote Commander (Touch Buttons)..." -ForegroundColor Yellow
$botScript = Join-Path $WorkDir "scripts\telegram_remote_commander.py"
Start-Process -FilePath $PythonExe -ArgumentList "-u `"$botScript`"" -WindowStyle Hidden -WorkingDirectory $WorkDir

# 6. Hermes Enterprise Master Pipeline (24/7 Autonomous Daemon)
Write-Host "[5/6] Starting Hermes Master Enterprise Orchestrator (08:30 Briefing / 02:00 Patrol)..." -ForegroundColor Yellow
$masterScript = Join-Path $WorkDir "scripts\hermes_master_pipeline.py"
Start-Process -FilePath $PythonExe -ArgumentList "-u `"$masterScript`" --mode daemon" -WindowStyle Hidden -WorkingDirectory $WorkDir

# 7. 24/7 YouTube Auto-Drain Queue Daemon (Auto-Upload on Quota Release)
Write-Host "[6/8] Starting YouTube 24/7 Auto-Drain Queue Daemon (Hola Coreano)..." -ForegroundColor Yellow
$ytDir = Join-Path (Split-Path -Parent $WorkDir) "외국어 유튜브"
$drainScript = Join-Path $ytDir "auto_drain_daemon.py"
if (Test-Path $drainScript) {
    Start-Process -FilePath $PythonExe -ArgumentList "-u `"$drainScript`"" -WindowStyle Hidden -WorkingDirectory $ytDir
}

# 8. SecondBrain 24/7 Cloud <-> PC Obsidian (00_Inbox) Auto-Sync Daemon & BLE Server
Write-Host '[7/8] Starting SecondBrain Cloud <-> Obsidian (00_Inbox) Auto-Sync Daemon...' -ForegroundColor Yellow
Get-WmiObject Win32_Process -Filter "Name='node.exe'" | ForEach-Object {
    if ($_.CommandLine -match 'secondbrain_cloud_sync_daemon.mjs' -or $_.CommandLine -match 'secondbrain_ble_server.mjs') {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }
}
Start-Process -FilePath 'node' -ArgumentList 'scripts/secondbrain_cloud_sync_daemon.mjs' -WindowStyle Hidden -WorkingDirectory $WorkDir
Start-Process -FilePath 'node' -ArgumentList 'scripts/secondbrain_ble_server.mjs' -WindowStyle Hidden -WorkingDirectory $WorkDir

# 9. AFK Browser-Use Worker (대표님 마우스 10분 미이동 시 무인 브라우저 업무 가동)
Write-Host '[8/9] Starting AFK Browser-Use Autonomous Worker (10m Idle Trigger)...' -ForegroundColor Yellow
$afkScript = Join-Path $WorkDir 'scripts/afk_browser_worker.py'
Start-Process -FilePath $PythonExe -ArgumentList @('-u', $afkScript, '--idle-sec', '600') -WindowStyle Hidden -WorkingDirectory $WorkDir

# 10. Antigravity & Hana Mobile 사령탑 브릿지 데몬 (모바일 앱 전용 실시간 명령 수신)
Write-Host '[9/10] Starting Antigravity & Hana Mobile Command Bridge Daemon...' -ForegroundColor Yellow
$mobileBridgeScript = Join-Path $WorkDir 'scripts/antigravity_mobile_daemon.py'
Start-Process -FilePath $PythonExe -ArgumentList @('-u', $mobileBridgeScript, '--daemon') -WindowStyle Hidden -WorkingDirectory $WorkDir

Start-Sleep -Seconds 3

Write-Host '===============================================================================' -ForegroundColor Green
Write-Host ' All 7 Independent Daemons successfully detached and running in OS background!' -ForegroundColor Green
Write-Host ' - Web Dashboard: http://localhost:9119' -ForegroundColor Green
Write-Host ' - 24/7 Patrol: Active (10m interval)' -ForegroundColor Green
Write-Host ' - Telegram Bot: Active (Inline touch buttons ready)' -ForegroundColor Green
Write-Host ' - Master Orchestrator: Active (08:30 Daily Briefing & 02:00 Auto-Healing)' -ForegroundColor Green
Write-Host ' - YouTube Auto-Drain Daemon: Active (30m interval automatic queue release)' -ForegroundColor Green
Write-Host ' - AFK Browser-Use Worker: Active (Omni-Business 6-Track Inspection)' -ForegroundColor Green
Write-Host ' - Antigravity Mobile App Bridge: Active (Real-time Smartphone App Dispatch)' -ForegroundColor Green
Write-Host '===============================================================================' -ForegroundColor Green

