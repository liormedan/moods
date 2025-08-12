'use client';

import React, { useState, useEffect } from 'react';
// Temporarily disabled for demo
// import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface MoodEntryData {
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
  // Temporarily disabled for demo
  // const { data: session } = useSession();
  const session = { user: { id: 'demo-user' } }; // Mock session for demo
  const [moodValue, setMoodValue] = useState(initialData?.moodValue || 5);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if there's already an entry for today
  const [existingEntry, setExistingEntry] = useState<any>(null);

  // Only check once on mount
  useEffect(() => {
    checkExistingEntry();
  }, []); // Empty dependency array to run only once

  const checkExistingEntry = async () => {
    try {
      // Mock check for demo - assume no existing entry
      setExistingEntry(null);
    } catch (err) {
      console.error('Error checking existing entry:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Mock successful save for demo
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      setSuccess('מצב הרוח נשמר בהצלחה!');
      
      // Reset form for new entry
      setMoodValue(5);
      setNotes('');

      onSuccess?.();

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

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setError(null);
    setSuccess(null);
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

  if (!session) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            יש להתחבר כדי לתעד מצב רוח
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Selection */}
          <div className="space-y-1">
            <Label htmlFor="date" className="text-sm">תאריך</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              className="text-sm"
            />
          </div>

          {/* Mood Slider */}
          <div className="space-y-2">
            <Label className="text-sm">איך אתה מרגיש היום?</Label>
            <Slider
              value={moodValue}
              onChange={(e) => setMoodValue(Number(e.target.value))}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">{getMoodEmoji(moodValue)}</span>
              <span className="text-sm font-medium text-foreground">
                {getMoodDescription(moodValue)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label htmlFor="notes" className="text-sm">הערות (אופציונלי)</Label>
            <Textarea
              id="notes"
              placeholder="איך היה היום שלך?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="text-sm"
            />
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-700 dark:text-red-400 text-xs">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-green-700 dark:text-green-400 text-xs">{success}</p>
            </div>
          )}

          {/* Existing Entry Info */}
          {existingEntry && !isEditing && (
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-blue-700 dark:text-blue-400 text-xs">
                כבר קיים תיעוד מצב רוח לתאריך זה.
                <button
                  type="button"
                  onClick={() => {
                    setMoodValue(existingEntry.moodValue);
                    setNotes(existingEntry.notes || '');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="underline ml-1 hover:text-blue-900 dark:hover:text-blue-300"
                >
                  לחץ כאן לעריכה
                </button>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full" size="sm">
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>שומר...</span>
              </span>
            ) : existingEntry && isEditing ? (
              'עדכן מצב רוח'
            ) : (
              'שמור מצב רוח'
            )}
          </Button>
        </form>
    </div>
  );
}
