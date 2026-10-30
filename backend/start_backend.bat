@echo off
title AIoT Smart Home - Backend Server
cd /d "%~dp0"
echo Starting FastAPI Backend Server on http://localhost:8000 ...
set "PATH=C:\Users\Asus\AppData\Local\Programs\Python\Python314;C:\Users\Asus\AppData\Local\Programs\Python\Python314\Scripts;%PATH%"
python -m uvicorn main:app --reload --port 8000 --host 0.0.0.0
pause
