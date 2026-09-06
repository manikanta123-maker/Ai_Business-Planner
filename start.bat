@echo off
echo ====================================================
echo Starting AI Business Architect Development Servers
echo ====================================================

if not exist "backend\.venv\Scripts\python.exe" (
    echo [!] Backend virtual environment not found.
    echo Running setup.bat first...
    call setup.bat
)

if not exist "frontend\node_modules" (
    echo [!] Frontend dependencies not found.
    echo Running npm install in frontend...
    cd frontend && call npm install && cd ..
)

:: Start FastAPI Backend
echo [1/3] Starting FastAPI Backend on port 8000...
start "AI Business Backend" cmd /k "cd /d \"%~dp0backend\" && .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --reload --port 8000"

:: Start Next.js Frontend
echo [2/3] Starting Next.js Frontend on port 3000...
start "AI Business Frontend" cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

:: Wait for boot and launch browser
echo [3/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo Launching application in browser...
start http://localhost:3000

echo ----------------------------------------------------
echo AI Business Architect is now running!
echo Backend API Docs:  http://localhost:8000/docs
echo Frontend Web App:  http://localhost:3000
echo ----------------------------------------------------
