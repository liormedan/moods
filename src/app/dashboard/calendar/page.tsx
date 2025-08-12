'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Heart,
  Activity,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Cloud,
  Zap,
  Wind,
  FileText,
  BookOpen,
  Music,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface CalendarEvent {
  id: string;
  date: string;
  type: 'mood' | 'activity' | 'goal' | 'reminder';
  title: string;
  description?: string;
  moodValue?: number;
  moodEmoji?: string;
  activityType?: string;
  duration?: number;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface DayData {
  date: string;
  moodValue?: number;
  moodEmoji?: string;
  activities: CalendarEvent[];
  goals: CalendarEvent[];
  reminders: CalendarEvent[];
}

const moodEmojis = ['😢', '😕', '😐', '🙂', '😊', '😄', '🤩'];
const moodColors = [
  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
];

const activityTypes = [
  {
    name: 'פעילות גופנית',
    icon: Activity,
    color: 'bg-green-100 text-green-800',
  },
  { name: 'מדיטציה', icon: Sun, color: 'bg-blue-100 text-blue-800' },
  { name: 'תרגילי נשימה', icon: Wind, color: 'bg-purple-100 text-purple-800' },
  { name: 'כתיבה', icon: FileText, color: 'bg-yellow-100 text-yellow-800' },
  { name: 'קריאה', icon: BookOpen, color: 'bg-indigo-100 text-indigo-800' },
  { name: 'מוזיקה', icon: Music, color: 'bg-pink-100 text-pink-800' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'mood' as CalendarEvent['type'],
    title: '',
    description: '',
    moodValue: 5,
    activityType: '',
    duration: 30,
    priority: 'medium' as CalendarEvent['priority'],
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const saved = localStorage.getItem('calendar-events');
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      // Load sample events
      const sampleEvents: CalendarEvent[] = [
        {
          id: '1',
          date: '2025-08-12',
          type: 'mood',
          title: 'מצב רוח טוב',
          moodValue: 6,
          moodEmoji: '😊',
        },
        {
          id: '2',
          date: '2025-08-12',
          type: 'activity',
          title: 'הליכה בפארק',
          activityType: 'פעילות גופנית',
          duration: 45,
        },
        {
          id: '3',
          date: '2025-08-13',
          type: 'goal',
          title: 'תרגול מדיטציה',
          completed: false,
          priority: 'high',
        },
        {
          id: '4',
          date: '2025-08-14',
          type: 'reminder',
          title: 'פגישה עם מטפל',
          priority: 'high',
        },
      ];
      setEvents(sampleEvents);
      localStorage.setItem('calendar-events', JSON.stringify(sampleEvents));
    }
  };

  const saveEvents = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem('calendar-events', JSON.stringify(newEvents));
  };

  const addEvent = () => {
    if (!selectedDate || !newEvent.title) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      ...newEvent,
      moodEmoji:
        newEvent.type === 'mood'
          ? moodEmojis[newEvent.moodValue - 1]
          : undefined,
    };

    const updatedEvents = [...events, event];
    saveEvents(updatedEvents);

    // Reset form
    setNewEvent({
      type: 'mood',
      title: '',
      description: '',
      moodValue: 5,
      activityType: '',
      duration: 30,
      priority: 'medium',
    });
    setShowAddEvent(false);
  };

  const toggleEventCompletion = (eventId: string) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId ? { ...event, completed: !event.completed } : event
    );
    saveEvents(updatedEvents);
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    saveEvents(updatedEvents);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add previous month days
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    // Add next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const getWeekDays = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      weekDays.push(day);
    }

    return weekDays;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter((event) => event.date === dateString);
  };

  const getMoodForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const moodEvent = events.find(
      (event) => event.date === dateString && event.type === 'mood'
    );
    return moodEvent;
  };

  const getDayEvents = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter((event) => event.date === dateString);
  };

  const getMoodColor = (moodValue: number) => {
    return moodColors[moodValue - 1] || moodColors[3];
  };

  const getActivityIcon = (activityType: string) => {
    const activity = activityTypes.find((a) => a.name === activityType);
    return activity ? (
      <activity.icon className="w-4 h-4" />
    ) : (
      <Activity className="w-4 h-4" />
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'נמוך';
      case 'medium':
        return 'בינוני';
      case 'high':
        return 'גבוה';
      default:
        return priority;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            לוח שנה 📅
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            עקוב אחרי מצב הרוח, הפעילויות והמטרות שלך לאורך זמן
          </p>
        </div>

        {/* Calendar Controls */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {currentDate.toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </h3>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  חודש
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  שבוע
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                >
                  יום
                </Button>

                <Button
                  onClick={() => setShowAddEvent(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  הוסף אירוע
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar View */}
        {viewMode === 'month' && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((day, index) => (
                  <div
                    key={index}
                    className="text-center font-medium text-gray-700 dark:text-gray-300 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  const dayEvents = getDayEvents(day.date);
                  const moodEvent = getMoodForDate(day.date);

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer transition-colors ${
                        !day.isCurrentMonth
                          ? 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                          : isToday(day.date)
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                            : isSelected(day.date)
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                              : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {day.date.getDate()}
                      </div>

                      {/* Mood Indicator */}
                      {moodEvent && (
                        <div className="mb-2">
                          <Badge
                            className={`text-xs ${getMoodColor(moodEvent.moodValue || 5)}`}
                          >
                            {moodEvent.moodEmoji} {moodEvent.moodValue}/7
                          </Badge>
                        </div>
                      )}

                      {/* Events Preview */}
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div key={event.id} className="text-xs">
                            {event.type === 'mood' && (
                              <Heart className="w-3 h-3 inline mr-1" />
                            )}
                            {event.type === 'activity' && (
                              <Activity className="w-3 h-3 inline mr-1" />
                            )}
                            {event.type === 'goal' && (
                              <Target className="w-3 h-3 inline mr-1" />
                            )}
                            {event.type === 'reminder' && (
                              <Clock className="w-3 h-3 inline mr-1" />
                            )}
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{dayEvents.length - 3} נוספים
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === 'week' && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              {/* Week Navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                  שבוע קודם
                </Button>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatDate(getWeekDays(currentDate)[0])} -{' '}
                  {formatDate(getWeekDays(currentDate)[6])}
                </h3>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                >
                  שבוע הבא
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Week Grid */}
              <div className="grid grid-cols-8 gap-1">
                {/* Time column */}
                <div className="space-y-2">
                  <div className="h-12"></div>
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={i}
                      className="h-12 text-xs text-gray-500 dark:text-gray-400 text-right pr-2"
                    >
                      {i.toString().padStart(2, '0')}:00
                    </div>
                  ))}
                </div>

                {/* Days columns */}
                {getWeekDays(currentDate).map((day, dayIndex) => {
                  const dayEvents = getDayEvents(day);
                  const moodEvent = getMoodForDate(day);

                  return (
                    <div key={dayIndex} className="space-y-2">
                      {/* Day header */}
                      <div
                        className={`h-12 flex flex-col items-center justify-center border rounded-lg ${
                          isToday(day)
                            ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {day.toLocaleDateString('he-IL', {
                            weekday: 'short',
                          })}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {day.getDate()}
                        </div>
                      </div>

                      {/* Mood indicator */}
                      {moodEvent && (
                        <div className="h-12 flex items-center justify-center">
                          <Badge
                            className={`text-xs ${getMoodColor(moodEvent.moodValue || 5)}`}
                          >
                            {moodEvent.moodEmoji} {moodEvent.moodValue}/7
                          </Badge>
                        </div>
                      )}

                      {/* Events */}
                      {Array.from({ length: 24 }, (_, hour) => {
                        const hourEvents = dayEvents.filter((event) => {
                          // Simple filtering - in real app you'd have event times
                          return event.type !== 'mood';
                        });

                        return (
                          <div
                            key={hour}
                            className="h-12 border-t border-gray-100 dark:border-gray-600"
                          >
                            {hourEvents.length > 0 && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 p-1">
                                {hourEvents[0].title}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === 'day' && selectedDate && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(selectedDate)}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getDayEvents(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {event.type === 'mood' && (
                        <Heart className="w-5 h-5 text-red-500" />
                      )}
                      {event.type === 'activity' && (
                        <Activity className="w-5 h-5 text-green-500" />
                      )}
                      {event.type === 'goal' && (
                        <Target className="w-5 h-5 text-blue-500" />
                      )}
                      {event.type === 'reminder' && (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      )}

                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {event.title}
                        </div>
                        {event.description && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {event.type === 'goal' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEventCompletion(event.id)}
                          className={
                            event.completed ? 'bg-green-100 text-green-800' : ''
                          }
                        >
                          {event.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            'סמן כהשלם'
                          )}
                        </Button>
                      )}

                      {event.priority && (
                        <Badge className={getPriorityColor(event.priority)}>
                          {getPriorityText(event.priority)}
                        </Badge>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        מחק
                      </Button>
                    </div>
                  </div>
                ))}

                {getDayEvents(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    אין אירועים ליום זה
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Event Form */}
        {showAddEvent && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>הוסף אירוע חדש</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    סוג אירוע
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        type: e.target.value as CalendarEvent['type'],
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="mood">מצב רוח</option>
                    <option value="activity">פעילות</option>
                    <option value="goal">מטרה</option>
                    <option value="reminder">תזכורת</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    כותרת
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="הכנס כותרת לאירוע"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {newEvent.type === 'mood' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    מצב רוח (1-7)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={newEvent.moodValue}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        moodValue: parseInt(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span>1</span>
                    <span>7</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-2xl">
                      {moodEmojis[newEvent.moodValue - 1]}
                    </span>
                    <span className="ml-2 text-lg font-medium">
                      {newEvent.moodValue}/7
                    </span>
                  </div>
                </div>
              )}

              {newEvent.type === 'activity' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      סוג פעילות
                    </label>
                    <select
                      value={newEvent.activityType}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          activityType: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">בחר סוג פעילות</option>
                      {activityTypes.map((activity) => (
                        <option key={activity.name} value={activity.name}>
                          {activity.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      משך (דקות)
                    </label>
                    <input
                      type="number"
                      value={newEvent.duration}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          duration: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              )}

              {(newEvent.type === 'goal' || newEvent.type === 'reminder') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    עדיפות
                  </label>
                  <select
                    value={newEvent.priority}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        priority: e.target.value as CalendarEvent['priority'],
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="low">נמוכה</option>
                    <option value="medium">בינונית</option>
                    <option value="high">גבוהה</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  תיאור (אופציונלי)
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="הוסף תיאור לאירוע..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddEvent(false)}
                >
                  ביטול
                </Button>
                <Button
                  onClick={addEvent}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  הוסף אירוע
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Summary */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>סיכום חודשי</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {events.filter((e) => e.type === 'mood').length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  תיעודי מצב רוח
                </p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {events.filter((e) => e.type === 'activity').length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  פעילויות
                </p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {
                    events.filter((e) => e.type === 'goal' && e.completed)
                      .length
                  }
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  מטרות שהושלמו
                </p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {events.filter((e) => e.type === 'reminder').length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  תזכורות
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
