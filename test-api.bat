@echo off
echo 🧪 בודק API endpoints...

echo.
echo 📊 בודק mood stats...
curl -s http://localhost:3000/api/mood/stats

echo.
echo.
echo 💡 בודק insights...
curl -s http://localhost:3000/api/insights

echo.
echo.
echo 📝 בודק mood entries...
curl -s http://localhost:3000/api/mood

echo.
echo ✅ בדיקה הושלמה!
pause