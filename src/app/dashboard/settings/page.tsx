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
  Settings,
  Palette,
  Globe,
  Monitor,
  Smartphone,
  Download,
  Upload,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  Bell,
  Shield,
  Database,
  Cloud,
  Zap,
  Moon,
  Sun,
  Laptop,
  Calendar,
  Heart,
  Activity,
  Music,
} from 'lucide-react';

interface AppSettings {
  display: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
    showAnimations: boolean;
    colorScheme: 'default' | 'high-contrast' | 'colorblind-friendly';
    language: 'hebrew' | 'english' | 'arabic';
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    moodReminders: boolean;
    goalDeadlines: boolean;
    weeklyReports: boolean;
    dailyCheckins: boolean;
    reminderTime: string;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  privacy: {
    shareData: boolean;
    anonymousMode: boolean;
    dataRetention: number;
    allowAnalytics: boolean;
    shareWithTherapist: boolean;
    publicProfile: boolean;
  };
  performance: {
    enableCaching: boolean;
    lazyLoading: boolean;
    backgroundSync: boolean;
    dataCompression: boolean;
    offlineMode: boolean;
    syncFrequency: 'realtime' | 'hourly' | 'daily';
  };
  integrations: {
    googleCalendar: boolean;
    appleHealth: boolean;
    fitbit: boolean;
    spotify: boolean;
    weather: boolean;
    googleFit: boolean;
    strava: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    cloudBackup: boolean;
    localBackup: boolean;
    encryptBackups: boolean;
    maxBackups: number;
    lastBackup?: string;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reduceMotion: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    voiceCommands: boolean;
  };
  advanced: {
    developerMode: boolean;
    debugMode: boolean;
    betaFeatures: boolean;
    experimentalFeatures: boolean;
    apiLogging: boolean;
    performanceMonitoring: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      if (response.ok) {
        const result = await response.json();
        setSettings(result.data);
      } else {
        console.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = <
    K extends keyof AppSettings,
    SK extends keyof AppSettings[K],
  >(
    category: K,
    subKey: SK,
    value: AppSettings[K][SK]
  ) => {
    if (settings) {
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              [category]: {
                ...prev[category],
                [subKey]: value,
              },
            }
          : null
      );
      setHasChanges(true);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setHasChanges(false);
        setMessage({ type: 'success', text: 'ההגדרות נשמרו בהצלחה!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'שגיאה בשמירת ההגדרות',
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'שגיאה בחיבור לשרת' });
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = async () => {
    if (!confirm('האם אתה בטוח שברצונך לאפס את כל ההגדרות לברירת המחדל?')) {
      return;
    }

    try {
      setMessage(null);
      const response = await fetch('/api/settings?action=reset', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSettings(result.data);
        setHasChanges(false);
        setMessage({
          type: 'success',
          text: 'ההגדרות אופסו לברירת המחדל בהצלחה!',
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'שגיאה באיפוס ההגדרות',
        });
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      setMessage({ type: 'error', text: 'שגיאה בחיבור לשרת' });
    }
  };

  const createBackup = async () => {
    try {
      setMessage(null);
      const response = await fetch('/api/settings?action=backup', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update last backup time
        if (settings) {
          setSettings({
            ...settings,
            backup: {
              ...settings.backup,
              lastBackup: result.data.timestamp,
            },
          });
        }
        setMessage({ type: 'success', text: 'גיבוי נוצר בהצלחה!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'שגיאה ביצירת גיבוי',
        });
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      setMessage({ type: 'error', text: 'שגיאה בחיבור לשרת' });
    }
  };

  const restoreBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const backupData = JSON.parse(text);

        if (backupData.settings) {
          setSettings(backupData.settings);
          setHasChanges(true);
          setMessage({ type: 'success', text: 'גיבוי שוחזר בהצלחה!' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ type: 'error', text: 'קובץ גיבוי לא תקין' });
        }
      } catch (error) {
        console.error('Error restoring backup:', error);
        setMessage({ type: 'error', text: 'שגיאה בשחזור הגיבוי' });
      }
    };
    input.click();
  };

  const exportSettings = () => {
    if (!settings) return;

    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `הגדרות_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">טוען הגדרות...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!settings) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">שגיאה בטעינת ההגדרות</p>
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
              הגדרות כלליות
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              התאם את האפליקציה לצרכים שלך
            </p>
          </div>
          <div className="flex gap-3">
            {hasChanges && (
              <Button variant="outline" onClick={resetSettings}>
                <RefreshCw className="w-4 h-4 mr-2" />
                אפס שינויים
              </Button>
            )}
            <Button onClick={saveSettings} disabled={!hasChanges || saving}>
              {saving ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'שומר...' : 'שמור הגדרות'}
            </Button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              הגדרות תצוגה
            </CardTitle>
            <CardDescription>התאם את המראה של האפליקציה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">ערכת נושא</label>
                <Select
                  value={settings.display.theme}
                  onValueChange={(value) =>
                    updateSetting('display', 'theme', value as any)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">בהיר</SelectItem>
                    <SelectItem value="dark">כהה</SelectItem>
                    <SelectItem value="auto">אוטומטי</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">גודל טקסט</label>
                <Select
                  value={settings.display.fontSize}
                  onValueChange={(value) =>
                    updateSetting('display', 'fontSize', value as any)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">קטן</SelectItem>
                    <SelectItem value="medium">בינוני</SelectItem>
                    <SelectItem value="large">גדול</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">מצב קומפקטי</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  הצג יותר תוכן במסך אחד
                </p>
              </div>
              <Switch
                checked={settings.display.compactMode}
                onCheckedChange={(checked) =>
                  updateSetting('display', 'compactMode', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">אנימציות</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  הצג אנימציות ומעברים
                </p>
              </div>
              <Switch
                checked={settings.display.showAnimations}
                onCheckedChange={(checked) =>
                  updateSetting('display', 'showAnimations', checked)
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">סכמת צבעים</label>
              <Select
                value={settings.display.colorScheme}
                onValueChange={(value) =>
                  updateSetting('display', 'colorScheme', value as any)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">ברירת מחדל</SelectItem>
                  <SelectItem value="high-contrast">ניגודיות גבוהה</SelectItem>
                  <SelectItem value="colorblind-friendly">
                    ידידותי לעיוורי צבעים
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              הגדרות התראות
            </CardTitle>
            <CardDescription>נהל את ההתראות וההודעות שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">אימייל</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    התראות באימייל
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    updateSetting('notifications', 'email', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Push</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    התראות בדפדפן
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    updateSetting('notifications', 'push', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">SMS</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    הודעות טקסט
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) =>
                    updateSetting('notifications', 'sms', checked)
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">תזכורות מצב רוח</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    תזכורת יומית לתיעוד מצב רוח
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.moodReminders}
                  onCheckedChange={(checked) =>
                    updateSetting('notifications', 'moodReminders', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">דדליינים של מטרות</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    התראות על מטרות שמתקרבות לדדליין
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.goalDeadlines}
                  onCheckedChange={(checked) =>
                    updateSetting('notifications', 'goalDeadlines', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">דוחות שבועיים</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    קבל דוח התקדמות שבועי
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    updateSetting('notifications', 'weeklyReports', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">צ'ק-אין יומי</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    תזכורת יומית לבדיקת מצב
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.dailyCheckins}
                  onCheckedChange={(checked) =>
                    updateSetting('notifications', 'dailyCheckins', checked)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">שעת תזכורת</label>
                <Input
                  type="time"
                  value={settings.notifications.reminderTime}
                  onChange={(e) =>
                    updateSetting(
                      'notifications',
                      'reminderTime',
                      e.target.value
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">שעות שקט</label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="time"
                    value={settings.notifications.quietHours.start}
                    onChange={(e) =>
                      updateSetting('notifications', 'quietHours', {
                        ...settings.notifications.quietHours,
                        start: e.target.value,
                      })
                    }
                    disabled={!settings.notifications.quietHours.enabled}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">עד</span>
                  <Input
                    type="time"
                    value={settings.notifications.quietHours.end}
                    onChange={(e) =>
                      updateSetting('notifications', 'quietHours', {
                        ...settings.notifications.quietHours,
                        end: e.target.value,
                      })
                    }
                    disabled={!settings.notifications.quietHours.enabled}
                    className="flex-1"
                  />
                  <Switch
                    checked={settings.notifications.quietHours.enabled}
                    onCheckedChange={(checked) =>
                      updateSetting('notifications', 'quietHours', {
                        ...settings.notifications.quietHours,
                        enabled: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              הגדרות פרטיות
            </CardTitle>
            <CardDescription>שלוט בפרטיות הנתונים שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">שיתוף נתונים למחקר</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    שתף נתונים אנונימיים למחקר בבריאות הנפש
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareData}
                  onCheckedChange={(checked) =>
                    updateSetting('privacy', 'shareData', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">מצב אנונימי</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    הסתר פרטים מזהים בדוחות
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.anonymousMode}
                  onCheckedChange={(checked) =>
                    updateSetting('privacy', 'anonymousMode', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">אנליטיקה</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    אפשר איסוף נתוני שימוש לשיפור האפליקציה
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.allowAnalytics}
                  onCheckedChange={(checked) =>
                    updateSetting('privacy', 'allowAnalytics', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">שיתוף עם מטפל</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    אפשר למטפל לגשת לנתונים שלך
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareWithTherapist}
                  onCheckedChange={(checked) =>
                    updateSetting('privacy', 'shareWithTherapist', checked)
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                תקופת שמירת נתונים (ימים)
              </label>
              <Input
                type="number"
                min="30"
                max="3650"
                value={settings.privacy.dataRetention}
                onChange={(e) =>
                  updateSetting(
                    'privacy',
                    'dataRetention',
                    parseInt(e.target.value)
                  )
                }
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                נתונים ימחקו אוטומטיט לאחר התקופה הזו (30-3650 ימים)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Performance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              הגדרות ביצועים
            </CardTitle>
            <CardDescription>אופטימיזציה לביצועים טובים יותר</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">אחסון במטמון</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  שמור נתונים במטמון לטעינה מהירה יותר
                </p>
              </div>
              <Switch
                checked={settings.performance.enableCaching}
                onCheckedChange={(checked) =>
                  updateSetting('performance', 'enableCaching', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">טעינה הדרגתית</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  טען תוכן רק כשנדרש
                </p>
              </div>
              <Switch
                checked={settings.performance.lazyLoading}
                onCheckedChange={(checked) =>
                  updateSetting('performance', 'lazyLoading', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">סנכרון ברקע</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  סנכרן נתונים ברקע
                </p>
              </div>
              <Switch
                checked={settings.performance.backgroundSync}
                onCheckedChange={(checked) =>
                  updateSetting('performance', 'backgroundSync', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">דחיסת נתונים</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  דחוס נתונים לחיסכון ברוחב פס
                </p>
              </div>
              <Switch
                checked={settings.performance.dataCompression}
                onCheckedChange={(checked) =>
                  updateSetting('performance', 'dataCompression', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              אינטגרציות
            </CardTitle>
            <CardDescription>
              חבר את האפליקציה לשירותים חיצוניים
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Google Calendar</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      סנכרון עם לוח השנה שלך
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.integrations.googleCalendar}
                  onCheckedChange={(checked) =>
                    updateSetting('integrations', 'googleCalendar', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Apple Health</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      סנכרון עם נתוני בריאות
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.integrations.appleHealth}
                  onCheckedChange={(checked) =>
                    updateSetting('integrations', 'appleHealth', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium">Fitbit</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      סנכרון עם מכשיר הכושר שלך
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.integrations.fitbit}
                  onCheckedChange={(checked) =>
                    updateSetting('integrations', 'fitbit', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Spotify</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      סנכרון עם המוזיקה שלך
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.integrations.spotify}
                  onCheckedChange={(checked) =>
                    updateSetting('integrations', 'spotify', checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              גיבוי ושחזור
            </CardTitle>
            <CardDescription>שמור ושחזר את הנתונים שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">גיבוי אוטומטי</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  צור גיבוי אוטומטי של הנתונים שלך
                </p>
              </div>
              <Switch
                checked={settings.backup.autoBackup}
                onCheckedChange={(checked) =>
                  updateSetting('backup', 'autoBackup', checked)
                }
              />
            </div>
            {settings.backup.autoBackup && (
              <div>
                <label className="text-sm font-medium">תדירות גיבוי</label>
                <Select
                  value={settings.backup.backupFrequency}
                  onValueChange={(value) =>
                    updateSetting('backup', 'backupFrequency', value as any)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">יומי</SelectItem>
                    <SelectItem value="weekly">שבועי</SelectItem>
                    <SelectItem value="monthly">חודשי</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">גיבוי בענן</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    שמור גיבויים בענן
                  </p>
                </div>
                <Switch
                  checked={settings.backup.cloudBackup}
                  onCheckedChange={(checked) =>
                    updateSetting('backup', 'cloudBackup', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">גיבוי מקומי</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    שמור גיבויים במכשיר שלך
                  </p>
                </div>
                <Switch
                  checked={settings.backup.localBackup}
                  onCheckedChange={(checked) =>
                    updateSetting('backup', 'localBackup', checked)
                  }
                />
              </div>
            </div>
            {settings.backup.lastBackup && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                גיבוי אחרון:{' '}
                {new Date(settings.backup.lastBackup).toLocaleString('he-IL')}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">הצפנת גיבויים</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  הצפן גיבויים לאבטחה מירבית
                </p>
              </div>
              <Switch
                checked={settings.backup.encryptBackups}
                onCheckedChange={(checked) =>
                  updateSetting('backup', 'encryptBackups', checked)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                מספר גיבויים מקסימלי
              </label>
              <Input
                type="number"
                min="1"
                max="50"
                value={settings.backup.maxBackups}
                onChange={(e) =>
                  updateSetting(
                    'backup',
                    'maxBackups',
                    parseInt(e.target.value)
                  )
                }
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                מספר הגיבויים המקסימלי לשמירה (1-50)
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={createBackup}>
                <Download className="w-4 h-4 mr-2" />
                צור גיבוי עכשיו
              </Button>
              <Button variant="outline" onClick={restoreBackup}>
                <Upload className="w-4 h-4 mr-2" />
                שחזר מגיבוי
              </Button>
              <Button variant="outline" onClick={exportSettings}>
                <Download className="w-4 h-4 mr-2" />
                ייצא הגדרות
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              הגדרות נגישות
            </CardTitle>
            <CardDescription>התאם את האפליקציה לצרכי נגישות</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">ניגודיות גבוהה</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  הגבר את הניגודיות לקריאה טובה יותר
                </p>
              </div>
              <Switch
                checked={settings.accessibility.highContrast}
                onCheckedChange={(checked) =>
                  updateSetting('accessibility', 'highContrast', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">טקסט גדול</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  הגדל את גודל הטקסט
                </p>
              </div>
              <Switch
                checked={settings.accessibility.largeText}
                onCheckedChange={(checked) =>
                  updateSetting('accessibility', 'largeText', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">הפחת תנועה</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  הפחת אנימציות ותנועות
                </p>
              </div>
              <Switch
                checked={settings.accessibility.reduceMotion}
                onCheckedChange={(checked) =>
                  updateSetting('accessibility', 'reduceMotion', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">תמיכה בקורא מסך</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  אופטימיזציה לקוראי מסך
                </p>
              </div>
              <Switch
                checked={settings.accessibility.screenReader}
                onCheckedChange={(checked) =>
                  updateSetting('accessibility', 'screenReader', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">ניווט במקלדת</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  אפשר ניווט מלא במקלדת
                </p>
              </div>
              <Switch
                checked={settings.accessibility.keyboardNavigation}
                onCheckedChange={(checked) =>
                  updateSetting('accessibility', 'keyboardNavigation', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">פקודות קוליות</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  שלוט באפליקציה בקול
                </p>
              </div>
              <Switch
                checked={settings.accessibility.voiceCommands}
                onCheckedChange={(checked) =>
                  updateSetting('accessibility', 'voiceCommands', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              הגדרות מתקדמות
            </CardTitle>
            <CardDescription>הגדרות למשתמשים מתקדמים</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">מצב מפתח</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  הצג כלי פיתוח ודיבוג
                </p>
              </div>
              <Switch
                checked={settings.advanced.developerMode}
                onCheckedChange={(checked) =>
                  updateSetting('advanced', 'developerMode', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">מצב דיבוג</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  הצג מידע דיבוג מפורט
                </p>
              </div>
              <Switch
                checked={settings.advanced.debugMode}
                onCheckedChange={(checked) =>
                  updateSetting('advanced', 'debugMode', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">תכונות בטא</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  גישה לתכונות חדשות בבדיקה
                </p>
              </div>
              <Switch
                checked={settings.advanced.betaFeatures}
                onCheckedChange={(checked) =>
                  updateSetting('advanced', 'betaFeatures', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">תכונות ניסיוניות</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  תכונות ניסיוניות שעלולות להיות לא יציבות
                </p>
              </div>
              <Switch
                checked={settings.advanced.experimentalFeatures}
                onCheckedChange={(checked) =>
                  updateSetting('advanced', 'experimentalFeatures', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">לוגים של API</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  שמור לוגים של קריאות API
                </p>
              </div>
              <Switch
                checked={settings.advanced.apiLogging}
                onCheckedChange={(checked) =>
                  updateSetting('advanced', 'apiLogging', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">מעקב ביצועים</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  עקוב אחר ביצועי האפליקציה
                </p>
              </div>
              <Switch
                checked={settings.advanced.performanceMonitoring}
                onCheckedChange={(checked) =>
                  updateSetting('advanced', 'performanceMonitoring', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              הגדרות שפה ואזור
            </CardTitle>
            <CardDescription>התאם את השפה והאזור שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">שפת ממשק</label>
              <Select
                value={settings.display.language}
                onValueChange={(value) =>
                  updateSetting('display', 'language', value as any)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hebrew">עברית</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="arabic">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                מידע על שפות
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• עברית - תמיכה מלאה בכל התכונות</li>
                <li>• אנגלית - תמיכה מלאה בכל התכונות</li>
                <li>• ערבית - תמיכה חלקית, בפיתוח</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Reset and Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              איפוס ויצוא
            </CardTitle>
            <CardDescription>נהל את ההגדרות שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={resetSettings}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                אפס לברירת מחדל
              </Button>
              <Button
                variant="outline"
                onClick={exportSettings}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                ייצא הגדרות
              </Button>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                ⚠️ אזהרה
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                איפוס ההגדרות יחזיר את כל ההגדרות לברירת המחדל. פעולה זו לא
                ניתנת לביטול.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              סטטיסטיקות הגדרות
            </CardTitle>
            <CardDescription>מידע על השימוש בהגדרות</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Object.values(settings.notifications).filter(Boolean).length}
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  התראות פעילות
                </div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Object.values(settings.integrations).filter(Boolean).length}
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  אינטגרציות מחוברות
                </div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Object.values(settings.accessibility).filter(Boolean).length}
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  תכונות נגישות
                </div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Object.values(settings.advanced).filter(Boolean).length}
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  הגדרות מתקדמות
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
