@echo off
echo ========================================
echo   Install Printer Service as Windows Service
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

REM Check if using .exe or node
set SERVICE_EXE=
set SERVICE_PATH=

if exist "dist\printer-service.exe" (
    set SERVICE_EXE=dist\printer-service.exe
    set SERVICE_PATH=%~dp0dist
    echo Using executable: dist\printer-service.exe
) else if exist "printer-service.exe" (
    set SERVICE_EXE=%~dp0printer-service.exe
    set SERVICE_PATH=%~dp0
    echo Using executable: printer-service.exe
) else (
    REM Check if Node.js is available
    where node >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set SERVICE_EXE=node
        set SERVICE_PATH=%~dp0
        set SERVICE_ARGS=index.js
        echo Using Node.js: node index.js
    ) else (
        echo ERROR: Cannot find printer-service.exe or Node.js
        echo Please build the executable first using build.bat
        pause
        exit /b 1
    )
)

echo.
echo Checking for NSSM...
where nssm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo NSSM not found. Downloading NSSM...
    echo.
    
    REM Create temp directory
    if not exist "temp" mkdir temp
    
    REM Download NSSM (using PowerShell)
    powershell -Command "Invoke-WebRequest -Uri 'https://nssm.cc/release/nssm-2.24.zip' -OutFile 'temp\nssm.zip'"
    
    if not exist "temp\nssm.zip" (
        echo ERROR: Failed to download NSSM
        echo Please download manually from: https://nssm.cc/download
        pause
        exit /b 1
    )
    
    REM Extract NSSM
    powershell -Command "Expand-Archive -Path 'temp\nssm.zip' -DestinationPath 'temp' -Force"
    
    REM Copy NSSM to current directory
    if exist "temp\nssm-2.24\win64\nssm.exe" (
        copy "temp\nssm-2.24\win64\nssm.exe" "nssm.exe" >nul
        echo NSSM downloaded successfully
    ) else (
        echo ERROR: Failed to extract NSSM
        pause
        exit /b 1
    )
    
    REM Cleanup
    rmdir /s /q temp >nul 2>&1
)

echo.
echo Installing service...
echo Service name: PrinterCashDrawerService
echo.

REM Check if service already exists
sc query PrinterCashDrawerService >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Service already exists. Removing old service...
    nssm.exe remove PrinterCashDrawerService confirm
    timeout /t 2 >nul
)

REM Install the service
if defined SERVICE_ARGS (
    nssm.exe install PrinterCashDrawerService "%SERVICE_EXE%" "%SERVICE_ARGS%"
) else (
    nssm.exe install PrinterCashDrawerService "%SERVICE_EXE%"
)

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install service
    pause
    exit /b 1
)

REM Set working directory
nssm.exe set PrinterCashDrawerService AppDirectory "%SERVICE_PATH%"

REM Set description
nssm.exe set PrinterCashDrawerService Description "Printer and Cash Drawer Service for XPrinter XP 80C"

REM Set startup type to automatic
nssm.exe set PrinterCashDrawerService Start SERVICE_AUTO_START

REM Set output files (optional, for logging)
nssm.exe set PrinterCashDrawerService AppStdout "%SERVICE_PATH%\service.log"
nssm.exe set PrinterCashDrawerService AppStderr "%SERVICE_PATH%\service-error.log"

REM Set restart on failure
nssm.exe set PrinterCashDrawerService AppRestartDelay 5000
nssm.exe set PrinterCashDrawerService AppExit Default Restart

echo.
echo ========================================
echo   Service installed successfully!
echo ========================================
echo.
echo Service name: PrinterCashDrawerService
echo.
echo To start the service:
echo   net start PrinterCashDrawerService
echo.
echo To stop the service:
echo   net stop PrinterCashDrawerService
echo.
echo The service will start automatically on Windows boot.
echo.
echo Starting service now...
net start PrinterCashDrawerService

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Service started successfully!
    echo Service is running at: http://localhost:3000
) else (
    echo.
    echo Service installed but failed to start.
    echo Check service.log for details.
)

echo.
pause

