@echo off
echo ========================================
echo   Printer Cash Drawer Service
echo   XPrinter XP 80C
echo ========================================
echo.
echo Starting service...
echo.

cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if config.js exists
if not exist "config.js" (
    echo Creating config.js from config.example.js...
    copy config.example.js config.js >nul
)

echo.
echo Service is starting...
echo Press Ctrl+C to stop the service
echo.
echo Service will run at: http://localhost:3000
echo.

REM Start the service
node index.js

pause

