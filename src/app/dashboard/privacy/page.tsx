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
  Shield,
  Lock,
  Eye,
  EyeOff,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Key,
  Database,
  Globe,
  Users,
  Clock,
  FileText,
  Settings,
  Smartphone,
  Monitor,
  Wifi,
  UserX,
  Share2,
  Ban,
  Activity,
  Calendar,
  MapPin,
  Camera,
  Mic,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  CreditCard,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Info,
  ExternalLink,
  RefreshCw,
  Save,
  X,
} from 'lucide-react';

interface PrivacySettings {
  dataCollection: {
    analytics: boolean;
    crashReports: boolean;
    usageStatistics: boolean;
    locationData: boolean;
    deviceInfo: boolean;
    performanceMetrics: boolean;
  };
  dataSharing: {
    anonymizedResearch: boolean;
    aggregatedStatistics: boolean;
    thirdPartyIntegrations: boolean;
    marketingPartners: boolean;
    healthcareProviders: boolean;
    emergencyContacts: boolean;
  };
  visibility: {
    profileVisibility: 'private' | 'friends' | 'public';
    activityStatus: boolean;
    lastSeen: boolean;
    moodHistory: boolean;
    goalProgress: boolean;
    journalEntries: boolean;
  };
  communications: {
    emailMarketing: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    inAppMessages: boolean;
    surveyInvitations: boolean;
    productUpdates: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    deviceTracking: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    biometricAuth: boolean;
  };
  dataRetention: {
    moodData: number;
    journalEntries: number;
    goalHistory: number;
    activityLogs: number;
    communicationHistory: number;
    autoDelete: boolean;
  };
}

interface DataExportRequest {
  id: string;
  type: 'full' | 'partial';
  status: 'pending' | 'processing' | 'ready' | 'expired';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  expiresAt?: string;
  categories: string[];
}

interface LoginActivity {
  id: string;
  timestamp: string;
  device: string;
  location: string;
  ipAddress: string;
  success: boolean;
  userAgent: string;
}

export default function PrivacyPage() {
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [exportRequests, setExportRequests] = useState<DataExportRequest[]>([]);
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'privacy' | 'security' | 'data' | 'activity'>('privacy');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadPrivacyData();
  }, []);

  const loadPrivacyData = async () => {
    try {
      setLoading(true);
      const [settingsRes, exportsRes, activityRes] = await Promise.all([
        fetch('/api/privacy/settings'),
        fetch('/api/privacy/exports'),
        fetch('/api/privacy/activity'),
      ]);

      if (settingsRes.ok) {
        const result = await settingsRes.json();
        setSettings(result.data);
      }

      if (exportsRes.ok) {
        const result = await exportsRes.json();
        setExportRequests(result.data);
      }

      if (activityRes.ok) {
        const result = await activityRes.json();
        setLoginActivity(result.data);
      }
    } catch (error) {
      console.error('Error loading privacy data:', error);
    } finally {
      setLoading(false);
    }
  };  cons
t updateSettings = async (newSettings: PrivacySettings) => {
    try {
      setSaving(true);
      const response = await fetch('/api/privacy/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const requestDataExport = async (type: 'full' | 'partial', categories?: string[]) => {
    try {
      const response = await fetch('/api/privacy/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, categories }),
      });

      if (response.ok) {
        const result = await response.json();
        setExportRequests(prev => [result.data, ...prev]);
      }
    } catch (error) {
      console.error('Error requesting data export:', error);
    }
  };

  const deleteAccount = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו לא ניתנת לביטול!')) {
      return;
    }

    try {
      const response = await fetch('/api/privacy/delete-account', {
        method: 'DELETE',
      });

      if (response.ok) {
        // Redirect to goodbye page or login
        window.location.href = '/auth/signin?deleted=true';
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const revokeDeviceAccess = async (deviceId: string) => {
    try {
      await fetch(`/api/privacy/revoke-device/${deviceId}`, {
        method: 'POST',
      });
      // Reload activity data
      loadPrivacyData();
    } catch (error) {
      console.error('Error revoking device access:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">טוען הגדרות פרטיות...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!settings) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">שגיאה בטעינת הגדרות הפרטיות</p>
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
              <Shield className="w-8 h-8" />
              פרטיות ואבטחה
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              נהל את הפרטיות והאבטחה של הנתונים שלך
            </p>
          </div>
          <Button onClick={() => updateSettings(settings)} disabled={saving}>
            {saving ? (
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'שומר...' : 'שמור הגדרות'}
          </Button>
        </div>

        {/* Privacy Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">גבוהה</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">רמת אבטחה</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{settings.dataRetention.moodData}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ימי שמירה</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold capitalize">{settings.visibility.profileVisibility}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">נראות פרופיל</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{loginActivity.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">פעילויות אחרונות</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'privacy', label: 'פרטיות', icon: Shield },
            { id: 'security', label: 'אבטחה', icon: Lock },
            { id: 'data', label: 'נתונים', icon: Database },
            { id: 'activity', label: 'פעילות', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>  
      {/* Privacy Settings Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  איסוף נתונים
                </CardTitle>
                <CardDescription>
                  בחר איזה נתונים אנחנו יכולים לאסוף כדי לשפר את השירות
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.dataCollection).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {key === 'analytics' && 'נתוני אנליטיקה'}
                        {key === 'crashReports' && 'דוחות קריסות'}
                        {key === 'usageStatistics' && 'סטטיסטיקות שימוש'}
                        {key === 'locationData' && 'נתוני מיקום'}
                        {key === 'deviceInfo' && 'מידע על המכשיר'}
                        {key === 'performanceMetrics' && 'מדדי ביצועים'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {key === 'analytics' && 'איך אתה משתמש באפליקציה'}
                        {key === 'crashReports' && 'מידע על תקלות לתיקון'}
                        {key === 'usageStatistics' && 'דפוסי שימוש כלליים'}
                        {key === 'locationData' && 'מיקום גיאוגרפי כללי'}
                        {key === 'deviceInfo' && 'סוג מכשיר ומערכת הפעלה'}
                        {key === 'performanceMetrics' && 'מהירות וביצועי האפליקציה'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          dataCollection: { ...settings.dataCollection, [key]: checked }
                        })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  שיתוף נתונים
                </CardTitle>
                <CardDescription>
                  בחר עם מי אנחנו יכולים לשתף נתונים אנונימיים
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.dataSharing).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {key === 'anonymizedResearch' && 'מחקר אנונימי'}
                        {key === 'aggregatedStatistics' && 'סטטיסטיקות מצטברות'}
                        {key === 'thirdPartyIntegrations' && 'אינטגרציות צד שלישי'}
                        {key === 'marketingPartners' && 'שותפי שיווק'}
                        {key === 'healthcareProviders' && 'ספקי שירותי בריאות'}
                        {key === 'emergencyContacts' && 'אנשי קשר חירום'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {key === 'anonymizedResearch' && 'מחקר בבריאות נפשית ללא זיהוי אישי'}
                        {key === 'aggregatedStatistics' && 'נתונים כלליים לשיפור השירות'}
                        {key === 'thirdPartyIntegrations' && 'אפליקציות מחוברות כמו Google Fit'}
                        {key === 'marketingPartners' && 'חברות שיווק לתוכן רלוונטי'}
                        {key === 'healthcareProviders' && 'רופאים ומטפלים מורשים'}
                        {key === 'emergencyContacts' && 'במקרה חירום בלבד'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          dataSharing: { ...settings.dataSharing, [key]: checked }
                        })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Profile Visibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  נראות פרופיל
                </CardTitle>
                <CardDescription>
                  קבע מי יכול לראות את הפרופיל והפעילות שלך
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">רמת נראות כללית</label>
                  <Select
                    value={settings.visibility.profileVisibility}
                    onValueChange={(value: any) =>
                      setSettings({
                        ...settings,
                        visibility: { ...settings.visibility, profileVisibility: value }
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">פרטי - רק אני</SelectItem>
                      <SelectItem value="friends">חברים - אנשי קשר מאושרים</SelectItem>
                      <SelectItem value="public">פומבי - כל המשתמשים</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {Object.entries(settings.visibility).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {key === 'activityStatus' && 'סטטוס פעילות'}
                        {key === 'lastSeen' && 'נראה לאחרונה'}
                        {key === 'moodHistory' && 'היסטוריית מצב רוח'}
                        {key === 'goalProgress' && 'התקדמות במטרות'}
                        {key === 'journalEntries' && 'רשומות יומן'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {key === 'activityStatus' && 'האם אתה מקוון כרגע'}
                        {key === 'lastSeen' && 'מתי היית פעיל לאחרונה'}
                        {key === 'moodHistory' && 'מגמות מצב הרוח שלך'}
                        {key === 'goalProgress' && 'איך אתה מתקדם במטרות'}
                        {key === 'journalEntries' && 'תוכן היומן האישי שלך'}
                      </p>
                    </div>
                    <Switch
                      checked={value as boolean}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          visibility: { ...settings.visibility, [key]: checked }
                        })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}        {
/* Security Settings Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Authentication Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  אבטחת חשבון
                </CardTitle>
                <CardDescription>
                  הגדרות אבטחה לחשבון שלך
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">אימות דו-שלבי</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      הוסף שכבת אבטחה נוספת עם SMS או אפליקציה
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, twoFactorAuth: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">התראות התחברות</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      קבל התראה על כל התחברות חדשה
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, loginAlerts: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">מעקב מכשירים</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      עקוב אחר המכשירים המחוברים לחשבון
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.deviceTracking}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, deviceTracking: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">אימות ביומטרי</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      השתמש בטביעת אצבע או זיהוי פנים
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.biometricAuth}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, biometricAuth: checked }
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">זמן קצוב לסשן (דקות)</label>
                    <Input
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">תפוגת סיסמה (ימים)</label>
                    <Input
                      type="number"
                      min="30"
                      max="365"
                      value={settings.security.passwordExpiry}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, passwordExpiry: parseInt(e.target.value) }
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password & Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  סיסמה וגישה
                </CardTitle>
                <CardDescription>
                  נהל את הסיסמה והגישה לחשבון
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  שנה סיסמה
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  נהל מכשירים מחוברים
                </Button>
                
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  התנתק מכל המכשירים
                </Button>
              </CardContent>
            </Card>

            {/* Security Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  המלצות אבטחה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">
                        סיסמה חזקה
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        הסיסמה שלך עומדת בתקני האבטחה
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                        הפעל אימות דו-שלבי
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        הוסף שכבת אבטחה נוספת לחשבון שלך
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )} 
       {/* Data Management Tab */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  שמירת נתונים
                </CardTitle>
                <CardDescription>
                  קבע כמה זמן לשמור כל סוג של נתונים
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.dataRetention).filter(([key]) => key !== 'autoDelete').map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {key === 'moodData' && 'נתוני מצב רוח'}
                        {key === 'journalEntries' && 'רשומות יומן'}
                        {key === 'goalHistory' && 'היסטוריית מטרות'}
                        {key === 'activityLogs' && 'לוגי פעילות'}
                        {key === 'communicationHistory' && 'היסטוריית תקשורת'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        נתונים ימחקו אוטומטית לאחר התקופה הזו
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="30"
                        max="3650"
                        value={value as number}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            dataRetention: { ...settings.dataRetention, [key]: parseInt(e.target.value) }
                          })
                        }
                        className="w-20"
                      />
                      <span className="text-sm text-gray-500">ימים</span>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <h4 className="font-medium">מחיקה אוטומטית</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      מחק נתונים ישנים אוטומטית לפי ההגדרות למעלה
                    </p>
                  </div>
                  <Switch
                    checked={settings.dataRetention.autoDelete}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        dataRetention: { ...settings.dataRetention, autoDelete: checked }
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  ייצוא נתונים
                </CardTitle>
                <CardDescription>
                  הורד עותק של כל הנתונים שלך
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => requestDataExport('full')}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    ייצוא מלא
                  </Button>
                  <Button 
                    onClick={() => requestDataExport('partial', ['mood', 'journal'])}
                    variant="outline"
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    ייצוא חלקי
                  </Button>
                </div>

                {exportRequests.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">בקשות ייצוא אחרונות</h4>
                    {exportRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            ייצוא {request.type === 'full' ? 'מלא' : 'חלקי'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(request.requestedAt).toLocaleDateString('he-IL')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.status === 'ready' ? 'bg-green-100 text-green-700' :
                            request.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {request.status === 'ready' ? 'מוכן' :
                             request.status === 'processing' ? 'מעבד' :
                             request.status === 'pending' ? 'ממתין' : 'פג תוקף'}
                          </span>
                          {request.status === 'ready' && request.downloadUrl && (
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Deletion */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="w-5 h-5" />
                  מחיקת נתונים
                </CardTitle>
                <CardDescription>
                  מחק חלקים מהנתונים שלך או את כל החשבון
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    מחק נתוני מצב רוח
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    מחק רשומות יומן
                  </Button>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    מחיקת חשבון מלאה
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    פעולה זו תמחק את כל הנתונים שלך ולא ניתנת לביטול
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={deleteAccount}
                    className="w-full"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    מחק חשבון לצמיתות
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}       
 {/* Activity Log Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Recent Login Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  פעילות התחברות אחרונה
                </CardTitle>
                <CardDescription>
                  מעקב אחר כל ההתחברויות לחשבון שלך
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loginActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          activity.success 
                            ? 'bg-green-100 dark:bg-green-900/20' 
                            : 'bg-red-100 dark:bg-red-900/20'
                        }`}>
                          {activity.success ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{activity.device}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.location} • {activity.ipAddress}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString('he-IL')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activity.success 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {activity.success ? 'הצליח' : 'נכשל'}
                        </span>
                        {activity.success && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => revokeDeviceAccess(activity.id)}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Privacy Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  ציר זמן פרטיות
                </CardTitle>
                <CardDescription>
                  שינויים אחרונים בהגדרות הפרטיות שלך
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Settings className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">הגדרות פרטיות עודכנו</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        שינית את הגדרות נראות הפרופיל
                      </div>
                      <div className="text-xs text-gray-500">לפני 2 שעות</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">אימות דו-שלבי הופעל</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        הוספת שכבת אבטחה נוספת לחשבון
                      </div>
                      <div className="text-xs text-gray-500">לפני יום</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Download className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">ייצוא נתונים הושלם</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        הורדת עותק מלא של הנתונים שלך
                      </div>
                      <div className="text-xs text-gray-500">לפני 3 ימים</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Apps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  אפליקציות מחוברות
                </CardTitle>
                <CardDescription>
                  אפליקציות וסרביסים שיש להם גישה לחשבון שלך
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Google Fit</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          גישה לנתוני פעילות גופנית
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      נתק
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Google Calendar</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          סנכרון אירועים ותזכורות
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      נתק
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Privacy Policy & Legal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              מידע משפטי ופרטיות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                מדיניות פרטיות
                <ExternalLink className="w-3 h-3 mr-1" />
              </Button>
              <Button variant="outline" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                תנאי שימוש
                <ExternalLink className="w-3 h-3 mr-1" />
              </Button>
              <Button variant="outline" className="w-full">
                <Info className="w-4 h-4 mr-2" />
                זכויות המשתמש
                <ExternalLink className="w-3 h-3 mr-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}