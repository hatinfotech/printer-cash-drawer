@echo off
echo ========================================
echo   Stopping Printer Cash Drawer Service
echo ========================================
echo.

REM Kill all Node.js processes
taskkill /F /IM node.exe >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo Service stopped successfully!
) else (
    echo No running service found.
)

echo.
pause

