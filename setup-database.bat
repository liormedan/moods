@echo off
echo 🚀 הגדרת מסד נתונים PostgreSQL...

echo.
echo 📦 בודק אם Docker מותקן...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker לא מותקן. אנא התקן Docker Desktop מ: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker מותקן!

echo.
echo 🐘 מפעיל PostgreSQL עם Docker...
docker-compose up -d postgres

echo.
echo ⏳ ממתין לחיבור למסד הנתונים...
timeout /t 10 /nobreak >nul

echo.
echo 🔄 מריץ Prisma migrations...
npx prisma migrate dev --name init

echo.
echo 🎯 יוצר Prisma client...
npx prisma generate

echo.
echo 🌱 מזריע נתונים ראשוניים...
npm run db:seed

echo.
echo ✅ הגדרת מסד הנתונים הושלמה בהצלחה!
echo.
echo 📊 לפתיחת Prisma Studio: npx prisma studio
echo 🌐 לפתיחת pgAdmin: http://localhost:8080 (admin@example.com / admin)
echo 🚀 להפעלת השרת: npm run dev
echo.
pause