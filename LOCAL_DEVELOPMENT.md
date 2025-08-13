# Mental Health Tracker - Local Development

Local Development Guide for Mental Health Tracker

## 🚀 Launch Options

You have two options for running the application locally:

### 1. Direct Admin Access 🎯
- **Best for**: Quick development and UI testing
- **Authentication**: No authentication - directly to dashboard
- **Data**: Mock data
- **Speed**: Fast startup without additional setup
- **Requirements**: Node.js + npm only

### 2. Firebase Emulators 🔥
- **Best for**: Full development with authentication and data
- **Authentication**: Full authentication with Firebase Auth
- **Data**: Local data with Firestore
- **Storage**: Local storage with Firebase Storage
- **Requirements**: Node.js + npm + Firebase CLI + Java

## 📁 Launch Files

### Windows Batch File
```bash
start-local.bat
```

### PowerShell Script
```powershell
.\start-local.ps1
```

## 🛠️ Usage

### Interactive Menu
```bash
# Run the file without parameters
.\start-local.bat
# or
.\start-local.ps1
```

### Direct Launch
```bash
# Direct admin access
.\start-local.ps1 -Admin

# Firebase emulators
.\start-local.ps1 -Firebase

# Show help
.\start-local.ps1 -Help
```

## 🔧 System Requirements

### Direct Admin Access
- ✅ Node.js 18+
- ✅ npm or yarn
- ❌ No additional setup required

### Firebase Emulators
- ✅ Node.js 18+
- ✅ npm or yarn
- ✅ Firebase CLI (installed automatically)
- ⚠️ **Java Runtime Environment (JRE) - Required for emulators**

## 📥 Installing Java (Required for Emulators)

**📖 For detailed Java installation instructions, see: [JAVA_INSTALLATION.md](./JAVA_INSTALLATION.md)**

### Quick Installation Steps
1. Download Java 17 or 21 from [Eclipse Temurin](https://adoptium.net/temurin/releases/) (recommended)
2. Run the .msi installer as Administrator
3. Install for all users
4. Set environment variables (see detailed guide)
5. Restart your terminal

### Verification
```bash
java -version
```

### If Java is not installed
The script will show an error message and return to the main menu.

## 📋 Launch Steps

### Direct Admin Access
1. Run the file `start-local.bat` or `start-local.ps1`
2. Choose option 1
3. Application will open in browser at `http://localhost:3000`
4. You'll be taken directly to dashboard without authentication

### Firebase Emulators
1. Run the file `start-local.bat` or `start-local.ps1`
2. Choose option 2
3. Firebase CLI will be installed automatically (if needed)
4. **If Java is not installed, you'll see an error message**
5. Emulators will start on ports:
   - Auth: `http://localhost:9099`
   - Firestore: `http://localhost:8080`
   - Storage: `http://localhost:9199`
   - Emulator UI: `http://localhost:4000`
6. Application will open with full authentication

## 🌐 Ports

| Service | Port | Description |
|---------|------|-------------|
| Next.js App | 3000 | Main application |
| Firebase Auth | 9099 | Authentication emulator |
| Firebase Firestore | 8080 | Database emulator |
| Firebase Storage | 9199 | Storage emulator |
| Emulator UI | 4000 | Emulator management interface |

## 🔍 Troubleshooting

### Firebase CLI not installed
```bash
npm install -g firebase-tools
```

### Java not installed
```bash
# Windows
# Download and install Java from Oracle or OpenJDK
# Add to PATH

# Verify installation
java -version
```

### Emulators not working
1. Check that ports 9099, 8080, 9199 are free
2. Verify Java is installed: `java -version`
3. Restart the script
4. Check Emulator UI at `http://localhost:4000`

### Permission errors
```bash
# Windows - Run as administrator
# PowerShell - Change execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Encoding issues with Hebrew
```bash
# PowerShell - Change encoding
chcp 65001
```

## 🎯 Launch Modes

### Admin Mode
- Environment variables:
  - `NEXT_PUBLIC_ADMIN_MODE=true`
  - `NEXT_PUBLIC_SKIP_AUTH=true`
- Authentication: Disabled
- Data: Mock data
- Speed: Fast

### Firebase Emulator Mode
- Environment variables:
  - `NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true`
  - `NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL=http://localhost:9099`
  - `NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL=http://localhost:8080`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_URL=http://localhost:9199`
- Authentication: Full
- Data: Local
- Speed: Medium

## 📚 Additional Resources

- [Firebase Emulator Documentation](https://firebase.google.com/docs/emulator-suite)
- [Next.js Development](https://nextjs.org/docs/getting-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Java Installation Guide](https://adoptium.net/temurin/releases/)

## 🆘 Support

If you have issues:
1. Check the main README file
2. Check Firebase Setup files
3. Ensure Java is installed (for emulators)
4. Open an issue on GitHub
5. Contact the development team

## 🚨 Important Notes

- **Admin Mode**: Suitable for quick development, not for production
- **Firebase Emulators**: Requires Java installation
- **Ports**: Ensure ports are free before launching
- **Data**: Emulators start with empty data
