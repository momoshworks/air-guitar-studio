$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

$PyExe = Join-Path $ScriptDir "..\hand-tracking-studio\.venv\Scripts\python.exe"
if (-not (Test-Path $PyExe)) {
    $PyExe = Join-Path $ScriptDir ".venv\Scripts\python.exe"
}
if (-not (Test-Path $PyExe)) {
    $PyExe = "python"
}

Write-Host "Starting Air Guitar Studio on http://localhost:8080 ..." -ForegroundColor Cyan
Start-Process "http://localhost:8080"
& $PyExe main.py
