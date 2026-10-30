@echo off
title AIoT Smart Home Automation - Launcher
echo =========================================================================
echo AIoT-Based Adaptive Smart Home Automation Using DNN and Generative AI
echo College Capstone Software Prototype
echo =========================================================================
echo.
echo [1/3] Setting Environment Paths...
set "PATH=C:\Users\Asus\nodejs;C:\Users\Asus\AppData\Local\Programs\Python\Python314;C:\Users\Asus\AppData\Local\Programs\Python\Python314\Scripts;%PATH%"

echo [2/3] Launching FastAPI Backend on http://localhost:8000 ...
start "AIoT Backend Server (FastAPI)" cmd /c "cd /d "%~dp0backend" && start_backend.bat"

echo [3/3] Launching Vite React Frontend on http://localhost:5173 ...
start "AIoT Frontend Dashboard (Vite React)" cmd /c "cd /d "%~dp0frontend" && start_frontend.bat"

echo.
echo Waiting 4 seconds for servers to initialize...
timeout /t 4 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo =========================================================================
echo Both services are running:
echo - Frontend Dashboard: http://localhost:5173
echo - Backend API & Docs: http://localhost:8000 / http://localhost:8000/docs
echo =========================================================================
