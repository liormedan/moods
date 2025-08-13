# Mental Health Tracker - Local Development Launcher
# Local Development Launcher for Mental Health Tracker

param(
    [switch]$Admin,
    [switch]$Firebase,
    [switch]$Help
)

# Set console encoding for Hebrew support
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Menu {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   Mental Health Tracker - Local Development" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Choose launch option:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Direct Admin Access to User Interface" -ForegroundColor Green
    Write-Host "   (No authentication, directly to dashboard)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Authentication via Firebase Emulators" -ForegroundColor Green
    Write-Host "   (Full authentication with local data)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Exit" -ForegroundColor Red
    Write-Host ""
}

function Start-AdminMode {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "    Starting Direct Admin Access" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Starting application with direct admin access..." -ForegroundColor Green
    Write-Host "Application will open in browser in a few seconds" -ForegroundColor Green
    Write-Host ""
    
    $env:NODE_ENV = "development"
    $env:NEXT_PUBLIC_ADMIN_MODE = "true"
    $env:NEXT_PUBLIC_SKIP_AUTH = "true"
    
    Write-Host "Starting server..." -ForegroundColor Yellow
    npm run dev
}

function Start-FirebaseMode {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "    Starting Firebase Emulators" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if Java is installed
    Write-Host "Checking Java..." -ForegroundColor Yellow
    try {
        $javaVersion = java -version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Java installed: $($javaVersion[0])" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Java not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Java is required for Firebase emulators." -ForegroundColor Yellow
        Write-Host "Please install Java first:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. Run: .\install-java.bat" -ForegroundColor Cyan
        Write-Host "2. Or download manually from:" -ForegroundColor Cyan
        Write-Host "   - Oracle: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor White
        Write-Host "   - OpenJDK: https://adoptium.net/temurin/releases/" -ForegroundColor White
        Write-Host ""
        Write-Host "After installing Java, restart this script." -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Press Enter to return to main menu"
        return
    }
    
    # Check if Firebase CLI is installed
    Write-Host "Checking Firebase CLI..." -ForegroundColor Yellow
    try {
        $firebaseVersion = firebase --version 2>$null
        if ($firebaseVersion) {
            Write-Host "Firebase CLI installed: $firebaseVersion" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Firebase CLI not installed. Installing..." -ForegroundColor Yellow
        npm install -g firebase-tools
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error installing Firebase CLI" -ForegroundColor Red
            Read-Host "Press Enter to continue"
            return
        }
    }
    
    Write-Host ""
    Write-Host "Starting Firebase emulators..." -ForegroundColor Green
    Write-Host ""
    Write-Host "1. Starting Auth Emulator on port 9099" -ForegroundColor Cyan
    Write-Host "2. Starting Firestore Emulator on port 8080" -ForegroundColor Cyan
    Write-Host "3. Starting Storage Emulator on port 9199" -ForegroundColor Cyan
    Write-Host ""
    
    # Start Firebase emulators in a new window
    Start-Process powershell -ArgumentList "-Command", "firebase emulators:start --only auth,firestore,storage" -WindowStyle Normal
    
    Write-Host ""
    Write-Host "Waiting for emulators..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "Starting application with Firebase emulators..." -ForegroundColor Green
    Write-Host ""
    
    $env:NODE_ENV = "development"
    $env:NEXT_PUBLIC_FIREBASE_USE_EMULATOR = "true"
    $env:NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL = "http://localhost:9099"
    $env:NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL = "http://localhost:8080"
    $env:NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_URL = "http://localhost:9199"
    
    Write-Host "Starting server..." -ForegroundColor Yellow
    npm run dev
}

function Show-Help {
    Write-Host "Mental Health Tracker - Local Development Launcher" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\start-local.ps1                    - Interactive menu" -ForegroundColor White
    Write-Host "  .\start-local.ps1 -Admin            - Direct admin access" -ForegroundColor White
    Write-Host "  .\start-local.ps1 -Firebase         - Firebase emulators" -ForegroundColor White
    Write-Host "  .\start-local.ps1 -Help             - Show this help" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\start-local.ps1 -Admin            - Start with admin access" -ForegroundColor White
    Write-Host "  .\start-local.ps1 -Firebase         - Start with Firebase" -ForegroundColor White
}

# Main execution
if ($Help) {
    Show-Help
    exit
}

if ($Admin) {
    Start-AdminMode
    exit
}

if ($Firebase) {
    Start-FirebaseMode
    exit
}

# Interactive menu
do {
    Show-Menu
    $choice = Read-Host "Enter your choice (1-3)"
    
    switch ($choice) {
        "1" { 
            Start-AdminMode
            break
        }
        "2" { 
            Start-FirebaseMode
            break
        }
        "3" { 
            Write-Host "Exiting..." -ForegroundColor Red
            exit 0
        }
        default { 
            Write-Host "Invalid choice. Please choose 1, 2, or 3." -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }
} while ($true)
