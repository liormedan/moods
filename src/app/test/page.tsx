'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [apiStatus, setApiStatus] = useState<string>('בודק...');
  const [dbStatus, setDbStatus] = useState<string>('בודק...');

  useEffect(() => {
    // Test API connection
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApiStatus('✅ API עובד');
          setDbStatus(`✅ דאטאבייס עובד - ${data.data.userCount} משתמשים`);
        } else {
          setApiStatus('❌ API לא עובד');
          setDbStatus(`❌ דאטאבייס לא עובד: ${data.details}`);
        }
      })
      .catch((error) => {
        setApiStatus('❌ שגיאה בחיבור ל-API');
        setDbStatus(`❌ שגיאה: ${error.message}`);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">בדיקת מערכת</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">סטטוס API</h2>
            <p className="text-lg">{apiStatus}</p>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">סטטוס דאטאבייס</h2>
            <p className="text-lg">{dbStatus}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">קישורים לבדיקה</h2>
            <div className="space-y-2">
              <a
                href="/api/test"
                target="_blank"
                className="block text-blue-600 hover:text-blue-800"
              >
                🔗 API Test
              </a>
              <a
                href="/auth/signin"
                className="block text-blue-600 hover:text-blue-800"
              >
                🔗 דף התחברות
              </a>
              <a
                href="/dashboard"
                className="block text-blue-600 hover:text-blue-800"
              >
                🔗 דאשבורד (דורש התחברות)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            פרטי התחברות לדמו:
          </h3>
          <p className="text-blue-800">
            📧 אימייל: demo@example.com
            <br />
            🔑 סיסמה: demo123
          </p>
        </div>
      </div>
    </div>
  );
}
