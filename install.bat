@echo off
echo ========================================
echo   Installing Printer Cash Drawer Service
echo ========================================
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

echo Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Installation completed successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Edit config.js to configure your printer
    echo 2. Run start.bat to start the service
    echo.
) else (
    echo.
    echo ERROR: Installation failed!
    echo.
)

pause

