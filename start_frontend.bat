@echo off
title AIoT Smart Home - React Frontend
cd /d "%~dp0"
echo Starting Vite React Dev Server on http://localhost:5173 ...
set "PATH=C:\Users\Asus\nodejs;%PATH%"
npm run dev -- --host 0.0.0.0
pause
