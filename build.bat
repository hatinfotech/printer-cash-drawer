@echo off
echo ========================================
echo   Building Printer Service Executable
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

echo.
echo Building executable...
echo This may take a few minutes...
echo.

REM Create dist directory if it doesn't exist
if not exist "dist" mkdir dist

REM Build the executable
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Build completed successfully!
    echo ========================================
    echo.
    echo Executable file: dist\printer-service.exe
    echo.
    echo You can now distribute this .exe file
    echo without requiring Node.js installation.
    echo.
    echo To run: Double-click printer-service.exe
    echo Or run from command line: printer-service.exe
    echo.
) else (
    echo.
    echo ERROR: Build failed!
    echo.
)

pause

