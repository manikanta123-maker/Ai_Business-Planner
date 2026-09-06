@echo off
echo ===================================================
echo Setting up AI Business Architect Project
echo ===================================================

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ from https://python.org
    pause
    exit /b 1
)

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Setting up Python virtual environment...
if not exist "backend\.venv" (
    python -m venv backend\.venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)

echo [2/4] Installing backend Python dependencies...
backend\.venv\Scripts\python.exe -m pip install --upgrade pip
backend\.venv\Scripts\pip.exe install -r backend\requirements.txt

echo [3/4] Setting up backend environment configuration...
if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo Created backend\.env from template.
    echo Please open backend\.env and add your GEMINI_API_KEY / TAVILY_API_KEY!
) else (
    echo backend\.env already exists.
)

echo [4/4] Installing frontend npm dependencies...
cd frontend
call npm install
cd ..

echo ===================================================
echo Setup complete! Run start.bat to launch the application.
echo ===================================================
pause
