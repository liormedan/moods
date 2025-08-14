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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Bell,
  BellRing,
  BellOff,
  Mail,
  Smartphone,
  MessageSquare,
  Calendar,
  Target,
  Heart,
  Brain,
  Clock,
  Settings,
  Trash2,
  Check,
  X,
  Plus,
  Filter,
  Download,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  Users,
  BookOpen,
  Activity,
} from 'lucide-react';

interface Notification {
  id: string;
  type:
    | 'mood'
    | 'goal'
    | 'journal'
    | 'breathing'
    | 'report'
    | 'reminder'
    | 'social'
    | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationSettings {
  enabled: boolean;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  types: {
    moodReminders: boolean;
    goalDeadlines: boolean;
    journalPrompts: boolean;
    breathingReminders: boolean;
    weeklyReports: boolean;
    socialUpdates: boolean;
    systemAlerts: boolean;
    achievements: boolean;
  };
  schedule: {
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    frequency: {
      moodReminders: 'daily' | 'twice-daily' | 'weekly';
      goalCheckins: 'daily' | 'weekly' | 'monthly';
      reports: 'weekly' | 'monthly' | 'quarterly';
    };
    customTimes: {
      morningReminder: string;
      eveningReminder: string;
      weeklyReport: string;
    };
  };
  preferences: {
    sound: boolean;
    vibration: boolean;
    preview: boolean;
    groupSimilar: boolean;
    autoMarkRead: boolean;
    maxPerDay: number;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>(
    'notifications'
  );

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const result = await response.json();
        setNotifications(result.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/notifications/settings');
      if (response.ok) {
        const result = await response.json();
        setSettings(result.data);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את כל ההתראות?')) return;

    try {
      await fetch('/api/notifications/clear-all', { method: 'DELETE' });
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    try {
      await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  const testNotification = async () => {
    try {
      await fetch('/api/notifications/test', { method: 'POST' });
      // Reload notifications to show the test notification
      loadNotifications();
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  const exportNotifications = () => {
    const csvContent = [
      ['תאריך', 'סוג', 'כותרת', 'הודעה', 'עדיפות', 'נקרא'],
      ...notifications.map((notif) => [
        new Date(notif.timestamp).toLocaleDateString('he-IL'),
        getTypeLabel(notif.type),
        notif.title,
        notif.message,
        getPriorityLabel(notif.priority),
        notif.read ? 'כן' : 'לא',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `התראות_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mood':
        return <Heart className="w-4 h-4" />;
      case 'goal':
        return <Target className="w-4 h-4" />;
      case 'journal':
        return <BookOpen className="w-4 h-4" />;
      case 'breathing':
        return <Activity className="w-4 h-4" />;
      case 'report':
        return <Calendar className="w-4 h-4" />;
      case 'reminder':
        return <Clock className="w-4 h-4" />;
      case 'social':
        return <Users className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mood':
        return 'מצב רוח';
      case 'goal':
        return 'מטרות';
      case 'journal':
        return 'יומן';
      case 'breathing':
        return 'נשימה';
      case 'report':
        return 'דוחות';
      case 'reminder':
        return 'תזכורת';
      case 'social':
        return 'חברתי';
      case 'system':
        return 'מערכת';
      default:
        return 'כללי';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'דחוף';
      case 'high':
        return 'גבוה';
      case 'medium':
        return 'בינוני';
      case 'low':
        return 'נמוך';
      default:
        return 'רגיל';
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'read' && !notif.read) return false;
    if (filter === 'unread' && notif.read) return false;
    if (typeFilter !== 'all' && notif.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">טוען התראות...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Bell className="w-8 h-8" />
              התראות
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              נהל את ההתראות וההגדרות שלך
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={testNotification} variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              בדוק התראה
            </Button>
            <Button onClick={exportNotifications} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              ייצא
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            התראות ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            הגדרות
          </button>
        </div>

        {activeTab === 'notifications' ? (
          <>
            {/* Filters and Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Select
                    value={filter}
                    onValueChange={(value: any) => setFilter(value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל ההתראות</SelectItem>
                      <SelectItem value="unread">לא נקראו</SelectItem>
                      <SelectItem value="read">נקראו</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל הסוגים</SelectItem>
                      <SelectItem value="mood">מצב רוח</SelectItem>
                      <SelectItem value="goal">מטרות</SelectItem>
                      <SelectItem value="journal">יומן</SelectItem>
                      <SelectItem value="breathing">נשימה</SelectItem>
                      <SelectItem value="report">דוחות</SelectItem>
                      <SelectItem value="reminder">תזכורות</SelectItem>
                      <SelectItem value="social">חברתי</SelectItem>
                      <SelectItem value="system">מערכת</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2 mr-auto">
                    {unreadCount > 0 && (
                      <Button
                        onClick={markAllAsRead}
                        variant="outline"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        סמן הכל כנקרא
                      </Button>
                    )}
                    <Button
                      onClick={clearAllNotifications}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      מחק הכל
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      אין התראות
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {filter === 'unread'
                        ? 'כל ההתראות נקראו'
                        : 'אין התראות להצגה'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}
                        >
                          {getTypeIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4
                                className={`font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
                              >
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>
                                  {new Date(
                                    notification.timestamp
                                  ).toLocaleString('he-IL')}
                                </span>
                                <span className="flex items-center gap-1">
                                  {getTypeIcon(notification.type)}
                                  {getTypeLabel(notification.type)}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}
                                >
                                  {getPriorityLabel(notification.priority)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <Button
                                  onClick={() => markAsRead(notification.id)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                variant="ghost"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {notification.actionUrl &&
                            notification.actionText && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                              >
                                {notification.actionText}
                              </Button>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        ) : (
          settings && (
            <>
              {/* Notification Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    ערוצי התראות
                  </CardTitle>
                  <CardDescription>בחר איך תרצה לקבל התראות</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">התראות כלליות</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        הפעל או כבה את כל ההתראות
                      </p>
                    </div>
                    <Switch
                      checked={settings.enabled}
                      onCheckedChange={(checked) =>
                        updateSettings({ ...settings, enabled: checked })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">אימייל</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            התראות באימייל
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.channels.email}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            channels: { ...settings.channels, email: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <BellRing className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-medium">Push</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            התראות בדפדפן
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.channels.push}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            channels: { ...settings.channels, push: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium">SMS</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            הודעות טקסט
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.channels.sms}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            channels: { ...settings.channels, sms: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-orange-600" />
                        <div>
                          <h4 className="font-medium">באפליקציה</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            התראות בתוך האפליקציה
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.channels.inApp}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            channels: { ...settings.channels, inApp: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    סוגי התראות
                  </CardTitle>
                  <CardDescription>
                    בחר איזה סוגי התראות תרצה לקבל
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.types).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {key === 'moodReminders' && (
                          <Heart className="w-5 h-5 text-red-500" />
                        )}
                        {key === 'goalDeadlines' && (
                          <Target className="w-5 h-5 text-blue-500" />
                        )}
                        {key === 'journalPrompts' && (
                          <BookOpen className="w-5 h-5 text-green-500" />
                        )}
                        {key === 'breathingReminders' && (
                          <Activity className="w-5 h-5 text-purple-500" />
                        )}
                        {key === 'weeklyReports' && (
                          <Calendar className="w-5 h-5 text-orange-500" />
                        )}
                        {key === 'socialUpdates' && (
                          <Users className="w-5 h-5 text-pink-500" />
                        )}
                        {key === 'systemAlerts' && (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        )}
                        {key === 'achievements' && (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}
                        <div>
                          <h4 className="font-medium">
                            {key === 'moodReminders' && 'תזכורות מצב רוח'}
                            {key === 'goalDeadlines' && 'דדליינים של מטרות'}
                            {key === 'journalPrompts' && 'הנחיות יומן'}
                            {key === 'breathingReminders' && 'תזכורות נשימה'}
                            {key === 'weeklyReports' && 'דוחות שבועיים'}
                            {key === 'socialUpdates' && 'עדכונים חברתיים'}
                            {key === 'systemAlerts' && 'התראות מערכת'}
                            {key === 'achievements' && 'הישגים'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {key === 'moodReminders' &&
                              'תזכורת יומית לתיעוד מצב רוח'}
                            {key === 'goalDeadlines' &&
                              'התראות על מטרות שמתקרבות לדדליין'}
                            {key === 'journalPrompts' && 'הצעות לכתיבה ביומן'}
                            {key === 'breathingReminders' &&
                              'תזכורות לתרגילי נשימה'}
                            {key === 'weeklyReports' && 'דוח התקדמות שבועי'}
                            {key === 'socialUpdates' && 'עדכונים מקבוצות תמיכה'}
                            {key === 'systemAlerts' && 'עדכוני מערכת וגרסאות'}
                            {key === 'achievements' && 'הודעות על הישגים חדשים'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            types: { ...settings.types, [key]: checked },
                          })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Schedule Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    לוח זמנים
                  </CardTitle>
                  <CardDescription>הגדר מתי תרצה לקבל התראות</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quiet Hours */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">שעות שקט</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            זמן שבו לא תתקבלנה התראות
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.schedule.quietHours.enabled}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            schedule: {
                              ...settings.schedule,
                              quietHours: {
                                ...settings.schedule.quietHours,
                                enabled: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    {settings.schedule.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">התחלה</label>
                          <Input
                            type="time"
                            value={settings.schedule.quietHours.start}
                            onChange={(e) =>
                              updateSettings({
                                ...settings,
                                schedule: {
                                  ...settings.schedule,
                                  quietHours: {
                                    ...settings.schedule.quietHours,
                                    start: e.target.value,
                                  },
                                },
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">סיום</label>
                          <Input
                            type="time"
                            value={settings.schedule.quietHours.end}
                            onChange={(e) =>
                              updateSettings({
                                ...settings,
                                schedule: {
                                  ...settings.schedule,
                                  quietHours: {
                                    ...settings.schedule.quietHours,
                                    end: e.target.value,
                                  },
                                },
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Custom Times */}
                  <div>
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Sun className="w-5 h-5 text-yellow-500" />
                      זמנים מותאמים
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">
                          תזכורת בוקר
                        </label>
                        <Input
                          type="time"
                          value={settings.schedule.customTimes.morningReminder}
                          onChange={(e) =>
                            updateSettings({
                              ...settings,
                              schedule: {
                                ...settings.schedule,
                                customTimes: {
                                  ...settings.schedule.customTimes,
                                  morningReminder: e.target.value,
                                },
                              },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          תזכורת ערב
                        </label>
                        <Input
                          type="time"
                          value={settings.schedule.customTimes.eveningReminder}
                          onChange={(e) =>
                            updateSettings({
                              ...settings,
                              schedule: {
                                ...settings.schedule,
                                customTimes: {
                                  ...settings.schedule.customTimes,
                                  eveningReminder: e.target.value,
                                },
                              },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">דוח שבועי</label>
                        <Input
                          type="time"
                          value={settings.schedule.customTimes.weeklyReport}
                          onChange={(e) =>
                            updateSettings({
                              ...settings,
                              schedule: {
                                ...settings.schedule,
                                customTimes: {
                                  ...settings.schedule.customTimes,
                                  weeklyReport: e.target.value,
                                },
                              },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    העדפות מתקדמות
                  </CardTitle>
                  <CardDescription>התאמות נוספות להתראות</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">צליל</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            השמע צליל עם התראות
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.preferences.sound}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            preferences: {
                              ...settings.preferences,
                              sound: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-green-500" />
                        <div>
                          <h4 className="font-medium">רטט</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            רטט במכשירים ניידים
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.preferences.vibration}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            preferences: {
                              ...settings.preferences,
                              vibration: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-purple-500" />
                        <div>
                          <h4 className="font-medium">תצוגה מקדימה</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            הצג תוכן ההתראה
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.preferences.preview}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            preferences: {
                              ...settings.preferences,
                              preview: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <div>
                          <h4 className="font-medium">סימון אוטומטי כנקרא</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            סמן התראות כנקראו אוטומטית
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.preferences.autoMarkRead}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            preferences: {
                              ...settings.preferences,
                              autoMarkRead: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      מספר התראות מקסימלי ליום
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={settings.preferences.maxPerDay}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          preferences: {
                            ...settings.preferences,
                            maxPerDay: parseInt(e.target.value),
                          },
                        })
                      }
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      הגבל את מספר ההתראות ליום (1-50)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
