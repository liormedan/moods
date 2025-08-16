'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Heart,
  Calendar,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';

interface MoodEntryData {
  id?: string;
  moodValue: number;
  notes?: string;
  date: string;
}

interface MoodEntryProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  initialData?: MoodEntryData;
  isEditing?: boolean;
}

export default function MoodEntry({
  onSuccess,
  onError,
  initialData,
  isEditing = false,
}: MoodEntryProps) {
  const { session } = useAuth();
  const [moodValue, setMoodValue] = useState(5);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntryData[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Initialize with initial data
  useEffect(() => {
    if (initialData) {
      setMoodValue(initialData.moodValue);
      setNotes(initialData.notes || '');
      setDate(initialData.date);
    }
  }, [initialData]);

  // Load mood history
  useEffect(() => {
    if (!isEditing) {
      loadMoodHistory();
    }
  }, [isEditing]);

  const loadMoodHistory = async () => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch('/api/mood?limit=5', { headers });
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setMoodHistory(data);
        } else {
          console.warn('API returned non-array data:', data);
          // Fallback to empty array
          setMoodHistory([]);
        }
      } else {
        console.warn('API response not ok:', response.status);
        // Fallback to empty array
        setMoodHistory([]);
      }
    } catch (err) {
      console.error('Error loading mood history:', err);
      // Fallback to empty array
      setMoodHistory([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const moodData = {
        moodValue,
        notes: notes.trim() || undefined,
        date,
      };

      const url =
        isEditing && initialData ? `/api/mood/${initialData.id}` : '/api/mood';
      const method = isEditing ? 'PUT' : 'POST';

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(moodData),
      });

      if (!response.ok) {
        throw new Error('שגיאה בשמירת מצב הרוח');
      }

      const result = await response.json();

      setSuccess(
        isEditing ? 'מצב הרוח עודכן בהצלחה!' : 'מצב הרוח נשמר בהצלחה!'
      );
      onSuccess?.();

      // Reset form only if not editing
      if (!isEditing) {
        setMoodValue(5);
        setNotes('');
        setDate(new Date().toISOString().split('T')[0]);
        // Reload history
        loadMoodHistory();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err.message || 'שגיאה בשמירת מצב הרוח';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodEmoji = (value: number) => {
    if (value >= 8) return '😊';
    if (value >= 6) return '🙂';
    if (value >= 4) return '😐';
    if (value >= 2) return '😔';
    return '😢';
  };

  const getMoodDescription = (value: number) => {
    if (value >= 8) return 'מצוין';
    if (value >= 6) return 'טוב';
    if (value >= 4) return 'בסדר';
    if (value >= 2) return 'לא טוב';
    return 'רע מאוד';
  };

  const getMoodColor = (value: number) => {
    if (value >= 8) return 'text-green-600 dark:text-green-400';
    if (value >= 6) return 'text-blue-600 dark:text-blue-400';
    if (value >= 4) return 'text-yellow-600 dark:text-yellow-400';
    if (value >= 2) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMoodBackgroundColor = (value: number) => {
    if (value >= 8) return 'bg-green-50 dark:bg-green-900/20';
    if (value >= 6) return 'bg-blue-50 dark:bg-blue-900/20';
    if (value >= 4) return 'bg-yellow-50 dark:bg-yellow-900/20';
    if (value >= 2) return 'bg-orange-50 dark:bg-orange-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  const calculateTrend = () => {
    // Ensure moodHistory is an array and has the expected structure
    if (!Array.isArray(moodHistory) || moodHistory.length < 2) return 'stable';

    // Filter out any invalid entries
    const validEntries = moodHistory.filter(
      (item) =>
        item && typeof item === 'object' && typeof item.moodValue === 'number'
    );

    if (validEntries.length < 2) return 'stable';

    const recent = validEntries.slice(-3);
    const older = validEntries.slice(-6, -3);

    if (recent.length === 0 || older.length === 0) return 'stable';

    const recentAvg =
      recent.reduce((sum, item) => sum + item.moodValue, 0) / recent.length;
    const olderAvg =
      older.reduce((sum, item) => sum + item.moodValue, 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  };

  const trend = calculateTrend();
  const trendIcon =
    trend === 'improving'
      ? TrendingUp
      : trend === 'declining'
        ? TrendingDown
        : Activity;
  const trendColor =
    trend === 'improving'
      ? 'text-green-600'
      : trend === 'declining'
        ? 'text-red-600'
        : 'text-blue-600';

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label
            htmlFor="date"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            תאריך
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full"
            required
          />
        </div>

        {/* Mood Slider */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            איך אתה מרגיש היום?
          </Label>

          <div className="space-y-4">
            {/* Current Mood Display */}
            <div
              className={`p-6 rounded-lg text-center ${getMoodBackgroundColor(moodValue)} border-2 border-gray-200 dark:border-gray-700`}
            >
              <div className="text-6xl mb-2">{getMoodEmoji(moodValue)}</div>
              <div
                className={`text-2xl font-bold ${getMoodColor(moodValue)} mb-1`}
              >
                {moodValue}/10
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                {getMoodDescription(moodValue)}
              </div>
            </div>

            {/* Mood Slider */}
            <div className="px-4">
              <Slider
                value={moodValue}
                onChange={(e) => setMoodValue(Number(e.target.value))}
                max={10}
                min={1}
                step={1}
                className="w-full"
                showValue={false}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>רע מאוד</span>
                <span>מצוין</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label
            htmlFor="notes"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            הערות (אופציונלי)
          </Label>
          <Textarea
            id="notes"
            placeholder="איך היה היום שלך? מה השפיע על מצב הרוח שלך?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>שומר...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <Edit3 className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isEditing ? 'עדכן מצב רוח' : 'שמור מצב רוח'}</span>
            </div>
          )}
        </Button>
      </form>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200 font-medium">
              {success}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200 font-medium">
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Mood History & Trends */}
      {!isEditing && Array.isArray(moodHistory) && moodHistory.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              היסטוריה ומגמות
            </h4>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {showHistory ? 'הסתר' : 'הצג'}
            </button>
          </div>

          {/* Trend Indicator */}
          <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              מגמה כללית:
            </span>
            <div className="flex items-center space-x-1">
              {React.createElement(trendIcon, {
                className: `w-4 h-4 ${trendColor}`,
              })}
              <span className={`text-sm font-medium ${trendColor}`}>
                {trend === 'improving'
                  ? 'משתפר'
                  : trend === 'declining'
                    ? 'יורד'
                    : 'יציב'}
              </span>
            </div>
          </div>

          {/* Recent Entries */}
          {showHistory && (
            <div className="space-y-2">
              {Array.isArray(moodHistory) &&
                moodHistory
                  .slice(-5)
                  .reverse()
                  .map((entry, index) => {
                    // Ensure entry has the expected structure
                    if (
                      !entry ||
                      typeof entry !== 'object' ||
                      typeof entry.moodValue !== 'number'
                    ) {
                      return null;
                    }

                    return (
                      <Card
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800/50"
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">
                                {getMoodEmoji(entry.moodValue)}
                              </span>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`font-semibold ${getMoodColor(entry.moodValue)}`}
                                  >
                                    {entry.moodValue}/10
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {new Date(entry.date).toLocaleDateString(
                                      'he-IL'
                                    )}
                                  </Badge>
                                </div>
                                {entry.notes && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {entry.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
            </div>
          )}
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-2">
          <Heart className="w-4 h-4" />
          <span>טיפים לשיפור מצב הרוח</span>
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• תיעדו את מצב הרוח שלכם באופן קבוע כדי לזהות דפוסים</li>
          <li>• הוסיפו הערות כדי להבין מה משפיע על מצב הרוח שלכם</li>
          <li>• השתמשו בסליידר כדי לתת הערכה מדויקת</li>
          <li>• עקבו אחרי המגמות לאורך זמן</li>
        </ul>
      </div>
    </div>
  );
}
