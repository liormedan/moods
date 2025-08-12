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
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
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
  BellOff,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Filter,
  Search,
  Trash2,
  Edit3,
  Save,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  Heart,
  Brain,
  Target,
  BookOpen,
  Users,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'alert' | 'achievement' | 'system' | 'urgent';
  category: 'mood' | 'journal' | 'breathing' | 'goal' | 'general' | 'crisis';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
  scheduledFor?: string;
  actionUrl?: string;
  metadata?: {
    moodValue?: number;
    goalId?: string;
    streakCount?: number;
  };
}

interface NotificationSettings {
  general: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  categories: {
    mood: boolean;
    journal: boolean;
    breathing: boolean;
    goal: boolean;
    general: boolean;
    crisis: boolean;
  };
  reminders: {
    dailyMoodCheck: boolean;
    dailyJournal: boolean;
    breathingExercise: boolean;
    goalProgress: boolean;
    weeklyReview: boolean;
  };
  timing: {
    moodReminderTime: string;
    journalReminderTime: string;
    breathingReminderTime: string;
    goalReminderTime: string;
    weeklyReviewDay:
      | 'sunday'
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday';
    weeklyReviewTime: string;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'all' | 'unread' | 'urgent' | 'settings'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingSettings, setEditingSettings] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  const loadNotifications = () => {
    // Mock data for demo
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'זמן לבדיקת מצב רוח יומית',
        message:
          'הגיע הזמן לתעד את מצב הרוח שלך היום. זה עוזר לעקוב אחר המגמות שלך.',
        type: 'reminder',
        category: 'mood',
        priority: 'medium',
        isRead: false,
        isDismissed: false,
        createdAt: '2025-08-12T10:00:00Z',
        scheduledFor: '2025-08-12T10:00:00Z',
        actionUrl: '/dashboard/mood-entry',
      },
      {
        id: '2',
        title: 'כל הכבוד! השלמת 7 ימים רצופים',
        message: 'השלמת שבוע שלם של תרגול מדיטציה יומי. המשך כך!',
        type: 'achievement',
        category: 'goal',
        priority: 'high',
        isRead: false,
        isDismissed: false,
        createdAt: '2025-08-12T09:30:00Z',
        metadata: {
          goalId: 'meditation-goal',
          streakCount: 7,
        },
      },
      {
        id: '3',
        title: 'תזכורת: תרגיל נשימה',
        message: 'זמן לתרגיל נשימה מרגיע. 5 דקות שיכולות לשנות את היום שלך.',
        type: 'reminder',
        category: 'breathing',
        priority: 'medium',
        isRead: true,
        isDismissed: false,
        createdAt: '2025-08-12T08:00:00Z',
        scheduledFor: '2025-08-12T08:00:00Z',
        actionUrl: '/dashboard/breathing',
      },
      {
        id: '4',
        title: 'התראה דחופה: זיהוי דפוס מדאיג',
        message:
          'זיהינו דפוס של מצב רוח נמוך בימים האחרונים. האם תרצה לדבר עם מישהו?',
        type: 'urgent',
        category: 'crisis',
        priority: 'urgent',
        isRead: false,
        isDismissed: false,
        createdAt: '2025-08-12T07:00:00Z',
        metadata: {
          moodValue: 2,
        },
      },
      {
        id: '5',
        title: 'זמן לכתיבת יומן',
        message: 'כתיבה יומית עוזרת לעבד רגשות ולשמור על בריאות נפשית טובה.',
        type: 'reminder',
        category: 'journal',
        priority: 'low',
        isRead: true,
        isDismissed: false,
        createdAt: '2025-08-11T21:00:00Z',
        scheduledFor: '2025-08-11T21:00:00Z',
        actionUrl: '/dashboard/journal',
      },
      {
        id: '6',
        title: 'עדכון שבועי: התקדמות מטרות',
        message: 'השבוע התקדמת ב-3 מתוך 5 המטרות שלך. עבודה מצוינת!',
        type: 'system',
        category: 'goal',
        priority: 'low',
        isRead: true,
        isDismissed: false,
        createdAt: '2025-08-11T18:00:00Z',
      },
    ];

    setNotifications(mockNotifications);
  };

  const loadSettings = () => {
    const mockSettings: NotificationSettings = {
      general: {
        enabled: true,
        sound: true,
        vibration: true,
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '07:00',
        },
      },
      channels: {
        push: true,
        email: true,
        sms: false,
        inApp: true,
      },
      categories: {
        mood: true,
        journal: true,
        breathing: true,
        goal: true,
        general: true,
        crisis: true,
      },
      reminders: {
        dailyMoodCheck: true,
        dailyJournal: true,
        breathingExercise: true,
        goalProgress: true,
        weeklyReview: true,
      },
      timing: {
        moodReminderTime: '10:00',
        journalReminderTime: '21:00',
        breathingReminderTime: '08:00',
        goalReminderTime: '18:00',
        weeklyReviewDay: 'sunday',
        weeklyReviewTime: '20:00',
      },
    };

    setSettings(mockSettings);
    setLoading(false);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isDismissed: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'unread' && notif.isRead) return false;
    if (activeTab === 'urgent' && notif.priority !== 'urgent') return false;
    if (
      searchTerm &&
      !notif.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    if (filterCategory !== 'all' && notif.category !== filterCategory)
      return false;
    return !notif.isDismissed;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const urgentCount = notifications.filter(
    (n) => n.priority === 'urgent' && !n.isDismissed
  ).length;

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              התראות
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              נהל את ההתראות והתזכורות שלך
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              סמן הכל כנקרא
            </Button>
            <Button variant="outline" onClick={clearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              נקה הכל
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {notifications.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    סה"כ התראות
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {unreadCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    לא נקראו
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {urgentCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    דחופות
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {settings?.general.enabled ? 'פעיל' : 'לא פעיל'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    מצב התראות
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('all')}
                  size="sm"
                >
                  הכל ({notifications.length})
                </Button>
                <Button
                  variant={activeTab === 'unread' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('unread')}
                  size="sm"
                >
                  לא נקראו ({unreadCount})
                </Button>
                <Button
                  variant={activeTab === 'urgent' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('urgent')}
                  size="sm"
                >
                  דחופות ({urgentCount})
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('settings')}
                  size="sm"
                >
                  הגדרות
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="חיפוש בהתראות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הקטגוריות</SelectItem>
                    <SelectItem value="mood">מצב רוח</SelectItem>
                    <SelectItem value="journal">יומן</SelectItem>
                    <SelectItem value="breathing">נשימה</SelectItem>
                    <SelectItem value="goal">מטרות</SelectItem>
                    <SelectItem value="general">כללי</SelectItem>
                    <SelectItem value="crisis">משבר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Notifications List */}
        {activeTab !== 'settings' && (
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    אין התראות
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {activeTab === 'all'
                      ? 'אין התראות להצגה'
                      : activeTab === 'unread'
                        ? 'כל ההתראות נקראו'
                        : activeTab === 'urgent'
                          ? 'אין התראות דחופות'
                          : 'אין התראות'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`${!notification.isRead ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/10' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            notification.priority === 'urgent'
                              ? 'bg-red-100 dark:bg-red-900/20'
                              : notification.priority === 'high'
                                ? 'bg-orange-100 dark:bg-orange-900/20'
                                : notification.priority === 'medium'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/20'
                                  : 'bg-blue-100 dark:bg-blue-900/20'
                          }`}
                        >
                          {notification.type === 'reminder' && (
                            <Clock className="w-5 h-5 text-blue-600" />
                          )}
                          {notification.type === 'achievement' && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {notification.type === 'alert' && (
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                          )}
                          {notification.type === 'urgent' && (
                            <Zap className="w-5 h-5 text-red-600" />
                          )}
                          {notification.type === 'system' && (
                            <Settings className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            <Badge
                              variant={
                                notification.priority === 'urgent'
                                  ? 'destructive'
                                  : notification.priority === 'high'
                                    ? 'default'
                                    : notification.priority === 'medium'
                                      ? 'secondary'
                                      : 'outline'
                              }
                            >
                              {notification.priority === 'urgent'
                                ? 'דחוף'
                                : notification.priority === 'high'
                                  ? 'גבוה'
                                  : notification.priority === 'medium'
                                    ? 'בינוני'
                                    : 'נמוך'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {notification.category === 'mood'
                                ? 'מצב רוח'
                                : notification.category === 'journal'
                                  ? 'יומן'
                                  : notification.category === 'breathing'
                                    ? 'נשימה'
                                    : notification.category === 'goal'
                                      ? 'מטרות'
                                      : notification.category === 'general'
                                        ? 'כללי'
                                        : 'משבר'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString('he-IL')}
                            </span>
                            {notification.scheduledFor && (
                              <span>
                                מתוזמן ל:{' '}
                                {new Date(
                                  notification.scheduledFor
                                ).toLocaleString('he-IL')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  הגדרות כלליות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">הפעל התראות</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      הפעל או בטל את כל ההתראות
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              general: { ...prev.general, enabled: checked },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">צליל</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      הפעל צליל בהתראות
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.sound}
                    onCheckedChange={(checked) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              general: { ...prev.general, sound: checked },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">רטט</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      הפעל רטט בהתראות
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.vibration}
                    onCheckedChange={(checked) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              general: { ...prev.general, vibration: checked },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">שעות שקט</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      השתק התראות בשעות מסוימות
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.quietHours.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              general: {
                                ...prev.general,
                                quietHours: {
                                  ...prev.general.quietHours,
                                  enabled: checked,
                                },
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                {settings.general.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-4">
                    <div>
                      <label className="text-sm font-medium">משעה</label>
                      <Input
                        type="time"
                        value={settings.general.quietHours.start}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  general: {
                                    ...prev.general,
                                    quietHours: {
                                      ...prev.general.quietHours,
                                      start: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">עד שעה</label>
                      <Input
                        type="time"
                        value={settings.general.quietHours.end}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  general: {
                                    ...prev.general,
                                    quietHours: {
                                      ...prev.general.quietHours,
                                      end: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Channel Settings */}
            <Card>
              <CardHeader>
                <CardTitle>ערוצי התראה</CardTitle>
                <CardDescription>בחר איך תרצה לקבל התראות</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">התראות דחיפה</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        התראות במכשיר הנייד
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.channels.push}
                    onCheckedChange={(checked) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              channels: { ...prev.channels, push: checked },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">אימייל</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        התראות במייל
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.channels.email}
                    onCheckedChange={(checked) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              channels: { ...prev.channels, email: checked },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium">הודעות SMS</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        התראות בהודעות טקסט
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.channels.sms}
                    onCheckedChange={(checked) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              channels: { ...prev.channels, sms: checked },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium">בתוך האפליקציה</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        התראות בתוך האפליקציה
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.channels.inApp}
                    onCheckedChange={(checked) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              channels: { ...prev.channels, inApp: checked },
                            }
                          : null
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reminder Settings */}
            <Card>
              <CardHeader>
                <CardTitle>תזכורות</CardTitle>
                <CardDescription>הגדר תזכורות יומיות ושבועיות</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-red-600" />
                      <div>
                        <h4 className="font-medium">בדיקת מצב רוח יומית</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          תזכורה יומית לתעד מצב רוח
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.reminders.dailyMoodCheck}
                      onCheckedChange={(checked) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                reminders: {
                                  ...prev.reminders,
                                  dailyMoodCheck: checked,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">כתיבת יומן יומית</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          תזכורה לכתוב יומן
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.reminders.dailyJournal}
                      onCheckedChange={(checked) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                reminders: {
                                  ...prev.reminders,
                                  dailyJournal: checked,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium">תרגילי נשימה</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          תזכורה לתרגילי נשימה
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.reminders.breathingExercise}
                      onCheckedChange={(checked) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                reminders: {
                                  ...prev.reminders,
                                  breathingExercise: checked,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">מעקב מטרות</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          תזכורה לעקוב אחר מטרות
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.reminders.goalProgress}
                      onCheckedChange={(checked) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                reminders: {
                                  ...prev.reminders,
                                  goalProgress: checked,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timing Settings */}
            <Card>
              <CardHeader>
                <CardTitle>זמני תזכורות</CardTitle>
                <CardDescription>הגדר מתי לקבל תזכורות</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      זמן תזכורת מצב רוח
                    </label>
                    <Input
                      type="time"
                      value={settings.timing.moodReminderTime}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                timing: {
                                  ...prev.timing,
                                  moodReminderTime: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      זמן תזכורת יומן
                    </label>
                    <Input
                      type="time"
                      value={settings.timing.journalReminderTime}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                timing: {
                                  ...prev.timing,
                                  journalReminderTime: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      זמן תזכורת נשימה
                    </label>
                    <Input
                      type="time"
                      value={settings.timing.breathingReminderTime}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                timing: {
                                  ...prev.timing,
                                  breathingReminderTime: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      זמן תזכורת מטרות
                    </label>
                    <Input
                      type="time"
                      value={settings.timing.goalReminderTime}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                timing: {
                                  ...prev.timing,
                                  goalReminderTime: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      יום סקירה שבועית
                    </label>
                    <Select
                      value={settings.timing.weeklyReviewDay}
                      onValueChange={(value) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                timing: {
                                  ...prev.timing,
                                  weeklyReviewDay: value as any,
                                },
                              }
                            : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">ראשון</SelectItem>
                        <SelectItem value="monday">שני</SelectItem>
                        <SelectItem value="tuesday">שלישי</SelectItem>
                        <SelectItem value="wednesday">רביעי</SelectItem>
                        <SelectItem value="thursday">חמישי</SelectItem>
                        <SelectItem value="friday">שישי</SelectItem>
                        <SelectItem value="saturday">שבת</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      שעת סקירה שבועית
                    </label>
                    <Input
                      type="time"
                      value={settings.timing.weeklyReviewTime}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                timing: {
                                  ...prev.timing,
                                  weeklyReviewTime: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
