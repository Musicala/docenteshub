@echo off
chcp 65001 >nul
cd /d "%~dp0"

where py >nul 2>&1
if %errorlevel%==0 (
  start "Servidor local · Docentes HUB" cmd /k "title Servidor local - Docentes HUB && py -m http.server 8765 --bind 127.0.0.1"
) else (
  where python >nul 2>&1
  if errorlevel 1 goto :no_python
  start "Servidor local · Docentes HUB" cmd /k "title Servidor local - Docentes HUB && python -m http.server 8765 --bind 127.0.0.1"
)

timeout /t 2 /nobreak >nul
start "" "http://localhost:8765/"
exit /b 0

:no_python
echo No se encontro Python en este equipo.
echo Abre https://musicala.github.io/docenteshub/ para usar la version publicada.
pause
exit /b 1
