# Java Installation Guide for Firebase Emulators

This guide will help you install Java on Windows to run Firebase emulators.

## 🚨 Why Java is Required

Firebase emulators (Auth, Firestore, Storage) require Java Runtime Environment (JRE) to run locally. Without Java, you cannot use the Firebase emulator option in the local development launcher.

## 📥 Installation Methods

### Method 1: Manual Download (Recommended)

#### Step 1: Choose a Java Distribution
- **Oracle JDK**: Official Oracle distribution (requires Oracle account)
- **Eclipse Temurin**: Open-source, community-supported (recommended)
- **Microsoft OpenJDK**: Microsoft's OpenJDK build
- **Azul Zulu**: Enterprise-ready OpenJDK distribution

#### Step 2: Download Java 17 or 21
**Eclipse Temurin (Recommended):**
1. Visit: https://adoptium.net/temurin/releases/
2. Select version: **17** (LTS) or **21** (LTS)
3. Select operating system: **Windows**
4. Select architecture: **x64**
5. Download the **.msi** installer

**Microsoft OpenJDK:**
1. Visit: https://docs.microsoft.com/en-us/java/openjdk/download
2. Download **Microsoft Build of OpenJDK 17** for Windows x64

#### Step 3: Install Java
1. Run the downloaded **.msi** file
2. Follow the installation wizard
3. **Important**: Install for all users (requires admin rights)
4. Use default installation path: `C:\Program Files\Java\jdk-17.x.x`

#### Step 4: Set Environment Variables
1. Open **System Properties** (Win + R, type `sysdm.cpl`)
2. Click **Environment Variables**
3. Under **System Variables**, click **New**
4. Variable name: `JAVA_HOME`
5. Variable value: `C:\Program Files\Java\jdk-17.x.x` (use your actual path)
6. Click **OK**
7. Find **Path** in System Variables, click **Edit**
8. Click **New**, add: `%JAVA_HOME%\bin`
9. Click **OK** on all dialogs

### Method 2: Using Package Managers (Advanced)

#### Windows Package Manager (winget)
```cmd
# Run as Administrator
winget install Microsoft.OpenJDK.17
```

#### Chocolatey
```cmd
# Run as Administrator
choco install openjdk17 -y
```

## ✅ Verification

After installation, verify Java is working:

```cmd
java -version
```

Expected output:
```
openjdk version "17.0.x" 2023-xx-xx
OpenJDK Runtime Environment Temurin-17.0.x+x (build 17.0.x+x)
OpenJDK 64-Bit Server VM Temurin-17.0.x+x (build 17.0.x+x, mixed mode, sharing)
```

## 🔧 Troubleshooting

### Java not found after installation
1. **Restart your terminal/command prompt**
2. **Restart your computer** (recommended)
3. Check environment variables are set correctly
4. Verify the installation path exists

### Permission denied errors
- **Run terminal as Administrator**
- **Install Java for all users** (not just current user)
- **Check antivirus software** isn't blocking installation

### Port conflicts
- Ensure ports 9099, 8080, 9199 are free
- Check no other Java applications are running
- Restart your computer if needed

### Environment variable issues
```cmd
# Check current Java path
echo %JAVA_HOME%
echo %PATH%

# Set manually in current session
set JAVA_HOME=C:\Program Files\Java\jdk-17.x.x
set PATH=%PATH%;%JAVA_HOME%\bin
```

## 🎯 After Java Installation

Once Java is installed and working:

1. **Restart your terminal/command prompt**
2. **Run the local development launcher:**
   ```cmd
   .\start-local.ps1
   ```
3. **Choose option 2: Firebase Emulators**
4. **Java check should pass**
5. **Firebase emulators will start**

## 📚 Additional Resources

- [Eclipse Temurin Downloads](https://adoptium.net/temurin/releases/)
- [Microsoft OpenJDK](https://docs.microsoft.com/en-us/java/openjdk/download)
- [Oracle JDK Downloads](https://www.oracle.com/java/technologies/downloads/)
- [Java Environment Variables Guide](https://docs.oracle.com/javase/tutorial/essential/environment/paths.html)

## 🆘 Getting Help

If you still have issues:

1. **Check the error message** in your terminal
2. **Verify Java installation** with `java -version`
3. **Check environment variables** are set correctly
4. **Restart your computer** and try again
5. **Contact support** with specific error details

## 🚀 Quick Test

After installation, test Firebase emulators:

```cmd
# Check Java
java -version

# Check Firebase CLI
firebase --version

# Start emulators manually
firebase emulators:start --only auth,firestore,storage
```

If all commands work, you're ready to use Firebase emulators in the local development launcher!
