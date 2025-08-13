@echo off
chcp 65001 >nul
title Java Installation for Firebase Emulators

echo.
echo ========================================
echo    Java Installation for Firebase Emulators
echo ========================================
echo.
echo Java is required to run Firebase emulators
echo.

REM Check if Java is already installed
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo Java is already installed on your system!
    echo.
    java -version
    echo.
    pause
    exit /b 0
)

echo Java is not installed on your system.
echo.
echo Installation options:
echo.
echo 1. Automatic download and installation (OpenJDK via winget)
echo 2. Automatic download and installation (OpenJDK via Chocolatey)
echo 3. Manual download from Oracle
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto auto_install_winget
if "%choice%"=="2" goto auto_install_chocolatey
if "%choice%"=="3" goto manual_download
if "%choice%"=="4" goto exit
goto invalid_choice

:auto_install_winget
echo.
echo ========================================
echo    Automatic Java Installation (winget)
echo ========================================
echo.
echo Starting download and installation of OpenJDK via winget...
echo.

REM Download OpenJDK using winget (Windows Package Manager)
winget install Microsoft.OpenJDK.17
if %errorlevel% equ 0 (
    echo OpenJDK installed successfully via winget!
    goto check_java
) else (
    echo.
    echo Error installing Java via winget.
    echo winget installation failed. Try option 2 (Chocolatey) or 3 (manual).
    echo.
    pause
    goto end
)

:auto_install_chocolatey
echo.
echo ========================================
echo    Automatic Java Installation (Chocolatey)
echo ========================================
echo.
echo Starting download and installation of OpenJDK via Chocolatey...
echo.

REM Check if Chocolatey is available
choco --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Chocolatey not found. Please install Chocolatey first.
    echo Visit: https://chocolatey.org/install
    echo.
    pause
    goto end
)

REM Download OpenJDK using Chocolatey
choco install openjdk17 -y >nul 2>&1
if %errorlevel% equ 0 (
    echo OpenJDK installed successfully via Chocolatey!
    goto check_java
) else (
    echo.
    echo Error installing Java via Chocolatey.
    echo Try manual installation (option 3).
    echo.
    pause
    goto end
)

:check_java
echo.
echo Searching for Java on your system...
timeout /t 3 /nobreak >nul

REM Refresh environment variables
call refreshenv >nul 2>&1

REM Check if Java is now available
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo Java is now available!
    echo.
    java -version
    echo.
    echo Java installed successfully! You can now run Firebase emulators.
    echo.
) else (
    echo.
    echo Java was installed but is not yet available. Try restarting your terminal.
    echo.
)

pause
goto end

:manual_download
echo.
echo ========================================
echo    Manual Java Download
echo ========================================
echo.
echo Open your browser to download Java:
echo.
echo 1. Oracle JDK: https://www.oracle.com/java/technologies/downloads/
echo 2. OpenJDK: https://adoptium.net/temurin/releases/
echo.
echo Download and install Java, then restart your terminal.
echo.
echo After installation, verify with: java -version
echo.
pause
goto end

:invalid_choice
echo.
echo Invalid choice. Please choose 1, 2, 3, or 4.
echo.
pause
goto start

:exit
echo.
echo Exiting...
exit /b 0

:end
echo.
echo Press any key to continue...
pause >nul
