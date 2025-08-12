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
  };
  language: {
    primary: 'hebrew' | 'english' | 'arabic';
    fallback: 'hebrew' | 'english' | 'arabic';
    autoTranslate: boolean;
  };
  performance: {
    enableCaching: boolean;
    lazyLoading: boolean;
    backgroundSync: boolean;
    dataCompression: boolean;
  };
  integrations: {
    googleCalendar: boolean;
    appleHealth: boolean;
    fitbit: boolean;
    spotify: boolean;
    weather: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    cloudBackup: boolean;
    localBackup: boolean;
    lastBackup?: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const mockSettings: AppSettings = {
      display: {
        theme: 'auto',
        fontSize: 'medium',
        compactMode: false,
        showAnimations: true,
        colorScheme: 'default',
      },
      language: {
        primary: 'hebrew',
        fallback: 'english',
        autoTranslate: false,
      },
      performance: {
        enableCaching: true,
        lazyLoading: true,
        backgroundSync: false,
        dataCompression: true,
      },
      integrations: {
        googleCalendar: false,
        appleHealth: false,
        fitbit: false,
        spotify: false,
        weather: true,
      },
      backup: {
        autoBackup: true,
        backupFrequency: 'weekly',
        cloudBackup: true,
        localBackup: false,
        lastBackup: '2025-08-10T15:30:00Z',
      },
    };

    setSettings(mockSettings);
    setLoading(false);
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

  const saveSettings = () => {
    // TODO: Implement actual settings save
    console.log('Saving settings...');
    setHasChanges(false);
  };

  const resetSettings = () => {
    loadSettings();
    setHasChanges(false);
  };

  const createBackup = () => {
    // TODO: Implement backup creation
    console.log('Creating backup...');
  };

  const restoreBackup = () => {
    // TODO: Implement backup restoration
    console.log('Restoring backup...');
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
            <Button onClick={saveSettings} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              שמור הגדרות
            </Button>
          </div>
        </div>

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

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              הגדרות שפה
            </CardTitle>
            <CardDescription>בחר את השפה המועדפת עליך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">שפה ראשית</label>
                <Select
                  value={settings.language.primary}
                  onValueChange={(value) =>
                    updateSetting('language', 'primary', value as any)
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
              <div>
                <label className="text-sm font-medium">שפה משנית</label>
                <Select
                  value={settings.language.fallback}
                  onValueChange={(value) =>
                    updateSetting('language', 'fallback', value as any)
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
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">תרגום אוטומטי</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  תרגם תוכן שאינו זמין בשפה הראשית
                </p>
              </div>
              <Switch
                checked={settings.language.autoTranslate}
                onCheckedChange={(checked) =>
                  updateSetting('language', 'autoTranslate', checked)
                }
              />
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
            <div className="flex gap-3">
              <Button variant="outline" onClick={createBackup}>
                <Download className="w-4 h-4 mr-2" />
                צור גיבוי עכשיו
              </Button>
              <Button variant="outline" onClick={restoreBackup}>
                <Upload className="w-4 h-4 mr-2" />
                שחזר מגיבוי
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
