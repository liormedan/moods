'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { MoodEntry } from '@/components/mood';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Calendar, TrendingUp } from 'lucide-react';

export default function MoodEntryPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            תיעוד מצב רוח יומי
          </h1>
          <p className="text-gray-600">
            תעדו את מצב הרוח שלכם ועקבו אחרי השינויים לאורך זמן
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mood Entry Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>איך אתם מרגישים היום?</CardTitle>
                <CardDescription>
                  בחרו את מצב הרוח שלכם בסולם של 1-10 והוסיפו הערות אם תרצו
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoodEntry />
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  טיפים לתיעוד
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <h4 className="font-medium text-gray-900 mb-2">למה חשוב לתעד?</h4>
                  <ul className="space-y-2">
                    <li>• זיהוי דפוסים במצב הרוח</li>
                    <li>• מעקב אחר התקדמות</li>
                    <li>• הבנת גורמי השפעה</li>
                    <li>• שיפור המודעות העצמית</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Consistency Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  עקביות בתיעוד
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p className="mb-3">
                    תיעוד יומי עוזר לקבל תמונה מדויקת יותר של מצב הרוח שלכם.
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-800 font-medium">
                      💡 טיפ: קבעו זמן קבוע ביום לתיעוד
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}