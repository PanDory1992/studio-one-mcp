@echo off
cd /d "%~dp0"
"C:\Program Files\nodejs\node.exe" install-local.mjs
if errorlevel 1 (echo BLAD instalacji.) else (echo Gotowe: most zainstalowany. Zrestartuj Studio One i aplikacje Claude.)
pause
