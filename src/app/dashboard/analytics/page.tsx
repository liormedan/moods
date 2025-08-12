'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { MoodChart } from '@/components/mood';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Calendar, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            גרפים וניתוחים
          </h1>
          <p className="text-gray-600">
            נתחו את מגמות מצב הרוח שלכם וגלו דפוסים חשובים
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">ממוצע השבוע</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">7.2</div>
              <p className="text-xs text-gray-500">+0.5 מהשבוע הקודם</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">ימים טובים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-xs text-gray-500">מתוך 14 ימים</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">מגמה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">עולה</span>
              </div>
              <p className="text-xs text-gray-500">שיפור מתמשך</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">רצף נוכחי</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">5</div>
              <p className="text-xs text-gray-500">ימים ברצף</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>מגמות מצב רוח</CardTitle>
                <CardDescription>
                  גרף מפורט של מצב הרוח שלכם לאורך זמן
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoodChart />
              </CardContent>
            </Card>
          </div>

          {/* Insights Panel */}
          <div className="space-y-6">
            {/* Patterns Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  דפוסים שזוהו
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">ימי שלישי</span>
                    <Badge variant="secondary">גבוה</Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    מצב רוח טוב יותר בימי שלישי
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">בוקר</span>
                    <Badge variant="secondary">חיובי</Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    מצב רוח טוב יותר בשעות הבוקר
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">סוף שבוע</span>
                    <Badge variant="secondary">יציב</Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    מצב רוח יציב בסופי שבוע
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  סיכום שבועי
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ימים עם תיעוד</span>
                    <span className="font-medium">6/7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ממוצע שבועי</span>
                    <span className="font-medium">7.2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">יום הטוב ביותר</span>
                    <span className="font-medium">שלישי (8.5)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">שיפור מהשבוע הקודם</span>
                    <span className="font-medium text-green-600">+0.5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>תובנות נוספות</CardTitle>
              <CardDescription>
                ניתוח מעמיק של הנתונים שלכם
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">85%</div>
                  <p className="text-sm text-gray-600">מהימים היו מעל הממוצע</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">12</div>
                  <p className="text-sm text-gray-600">ימים רצופים של שיפור</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                  <p className="text-sm text-gray-600">דפוסים חיוביים זוהו</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}