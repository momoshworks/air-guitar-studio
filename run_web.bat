@echo off
cd /d "%~dp0"
set "PY_EXE=..\hand-tracking-studio\.venv\Scripts\python.exe"
if not exist "%PY_EXE%" set "PY_EXE=.venv\Scripts\python.exe"
if not exist "%PY_EXE%" set "PY_EXE=python"

echo Starting Air Guitar Studio on http://localhost:8080 ...
start "" http://localhost:8080
"%PY_EXE%" main.py
pause
