@echo off
echo ========================================
echo   Uninstall Printer Service
echo ========================================
echo.

cd /d "%~dp0"

REM Check if running as administrator
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

REM Check if service exists
sc query PrinterCashDrawerService >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Service 'PrinterCashDrawerService' is not installed.
    pause
    exit /b 0
)

echo Stopping service...
net stop PrinterCashDrawerService >nul 2>&1
timeout /t 2 >nul

echo Removing service...

REM Check for NSSM
if exist "nssm.exe" (
    nssm.exe remove PrinterCashDrawerService confirm
) else (
    REM Try to find NSSM in PATH
    where nssm >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        nssm.exe remove PrinterCashDrawerService confirm
    ) else (
        echo ERROR: NSSM not found. Cannot remove service.
        echo Please install NSSM or use Services.msc to remove manually.
        pause
        exit /b 1
    )
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Service removed successfully!
    echo ========================================
) else (
    echo.
    echo ERROR: Failed to remove service
)

echo.
pause

