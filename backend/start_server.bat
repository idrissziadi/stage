@echo off
echo Starting Backend Server...
echo.

REM Check if we're in the backend directory
if not exist "server.js" (
    echo Error: server.js not found. Make sure you're in the backend directory.
    echo Current directory: %cd%
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo Starting server...
echo.
node server.js

pause