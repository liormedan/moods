'use client';

import React, { useState, useEffect } from 'react';

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
  isEditing = false 
}: MoodEntryProps) {
  const [moodValue, setMoodValue] = useState(5);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize with initial data
  useEffect(() => {
    if (initialData) {
      setMoodValue(initialData.moodValue);
      setNotes(initialData.notes || '');
      setDate(initialData.date);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Mock submission for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(isEditing ? 'מצב הרוח עודכן בהצלחה!' : 'מצב הרוח נשמר בהצלחה!');
      onSuccess?.();
      
      // Reset form only if not editing
      if (!isEditing) {
        setMoodValue(5);
        setNotes('');
        setDate(new Date().toISOString().split('T')[0]);
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

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            תאריך
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Mood Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            איך אתה מרגיש היום?
          </label>
          
          {/* Mood Display */}
          <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
            <span className="text-4xl">{getMoodEmoji(moodValue)}</span>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getMoodColor(moodValue)}`}>
                {moodValue}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {getMoodDescription(moodValue)}
              </div>
            </div>
          </div>

          {/* Simple Slider */}
          <div className="px-2">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={moodValue}
              onChange={(e) => setMoodValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #f59e0b 25%, #eab308 50%, #3b82f6 75%, #10b981 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            הערות (אופציונלי)
          </label>
          <textarea
            id="notes"
            placeholder="איך היה היום שלך? מה השפיע על מצב הרוח שלך?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-green-700 dark:text-green-400 text-sm">{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
          ) : (
            isEditing ? 'עדכן מצב רוח' : 'שמור מצב רוח'
          )}
        </button>
      </form>
    </div>
  );
}