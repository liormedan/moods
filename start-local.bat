@echo off
chcp 65001 >nul
title Mental Health Tracker - Local Development

echo.
echo ========================================
echo    Mental Health Tracker - Local Development
echo ========================================
echo.
echo Choose launch option:
echo.
echo 1. Direct Admin Access to User Interface
echo    (No authentication, directly to dashboard)
echo.
echo 2. Authentication via Firebase Emulators
echo    (Full authentication with local data)
echo.
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto admin_direct
if "%choice%"=="2" goto firebase_auth
if "%choice%"=="3" goto exit
goto invalid_choice

:admin_direct
echo.
echo ========================================
echo    Starting Direct Admin Access
echo ========================================
echo.
echo Starting application with direct admin access...
echo Application will open in browser in a few seconds
echo.
echo Press any key to continue...
pause >nul

set NODE_ENV=development
set NEXT_PUBLIC_ADMIN_MODE=true
set NEXT_PUBLIC_SKIP_AUTH=true

echo Starting server...
npm run dev
goto end

:firebase_auth
echo.
echo ========================================
echo    Starting Firebase Emulators
echo ========================================
echo.
echo Checking Firebase CLI...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Firebase CLI not installed. Installing...
    npm install -g firebase-tools
    if %errorlevel% neq 0 (
        echo Error installing Firebase CLI
        pause
        goto end
    )
)

echo.
echo Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Java not found!
    echo.
    echo Java is required for Firebase emulators.
    echo Please install Java first:
    echo.
    echo 1. Run: .\install-java.bat
    echo 2. Or download manually from:
    echo    - Oracle: https://www.oracle.com/java/technologies/downloads/
    echo    - OpenJDK: https://adoptium.net/temurin/releases/
    echo.
    echo After installing Java, restart this script.
    echo.
    pause
    goto end
)

echo.
echo Starting Firebase emulators...
echo.
echo 1. Starting Auth Emulator on port 9099
echo 2. Starting Firestore Emulator on port 8080
echo 3. Starting Storage Emulator on port 9199
echo.

start "Firebase Emulators" cmd /k "firebase emulators:start --only auth,firestore,storage"

echo.
echo Waiting for emulators...
timeout /t 5 /nobreak >nul

echo.
echo Starting application with Firebase emulators...
echo.
echo Press any key to continue...
pause >nul

set NODE_ENV=development
set NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true
set NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL=http://localhost:9099
set NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL=http://localhost:8080
set NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_URL=http://localhost:9199

echo Starting server...
npm run dev
goto end

:invalid_choice
echo.
echo Invalid choice. Please choose 1, 2, or 3.
echo.
pause
goto start

:exit
echo.
echo Exiting...
exit /b 0

:end
echo.
echo Application launched successfully!
echo.
pause
