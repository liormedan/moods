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

import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Shield,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Smartphone,
  Users,
  Database,
  Key,
  History,
  Settings,
  FileText,
  Archive,
  X,
  Heart,
  Target,
} from 'lucide-react';

interface PrivacySettings {
  dataSharing: {
    shareWithResearchers: boolean;
    shareWithTherapists: boolean;
    shareAnonymously: boolean;
    allowAnalytics: boolean;
  };
  visibility: {
    profilePublic: boolean;
    showMoodHistory: boolean;
    showJournalEntries: boolean;
    showGoals: boolean;
    showActivity: boolean;
  };
  dataRetention: {
    moodEntries: number; // days
    journalEntries: number; // days
    activityLogs: number; // days
    deletedDataRetention: number; // days
  };
  security: {
    twoFactorAuth: boolean;
    biometricAuth: boolean;
    sessionTimeout: number; // minutes
    maxFailedLogins: number;
    requirePasswordChange: number; // days
  };
  notifications: {
    securityAlerts: boolean;
    dataAccessAlerts: boolean;
    privacyUpdates: boolean;
  };
}

interface AccessLog {
  id: string;
  timestamp: string;
  action: string;
  ipAddress: string;
  device: string;
  location: string;
  userAgent: string;
  success: boolean;
  details?: string;
}

interface DataExport {
  id: string;
  type: 'full' | 'mood' | 'journal' | 'goals' | 'activity';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  size?: string;
}

export default function PrivacyPage() {
  const [privacySettings, setPrivacySettings] =
    useState<PrivacySettings | null>(null);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [dataExports, setDataExports] = useState<DataExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'settings' | 'access' | 'export' | 'security'
  >('settings');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<
    'mood' | 'journal' | 'all' | null
  >(null);

  useEffect(() => {
    loadPrivacySettings();
    loadAccessLogs();
    loadDataExports();
  }, []);

  const loadPrivacySettings = () => {
    const mockSettings: PrivacySettings = {
      dataSharing: {
        shareWithResearchers: false,
        shareWithTherapists: true,
        shareAnonymously: true,
        allowAnalytics: false,
      },
      visibility: {
        profilePublic: false,
        showMoodHistory: false,
        showJournalEntries: false,
        showGoals: false,
        showActivity: false,
      },
      dataRetention: {
        moodEntries: 2555, // 7 years
        journalEntries: 1095, // 3 years
        activityLogs: 365, // 1 year
        deletedDataRetention: 30, // 30 days
      },
      security: {
        twoFactorAuth: false,
        biometricAuth: true,
        sessionTimeout: 60, // 1 hour
        maxFailedLogins: 5,
        requirePasswordChange: 90, // 90 days
      },
      notifications: {
        securityAlerts: true,
        dataAccessAlerts: true,
        privacyUpdates: true,
      },
    };

    setPrivacySettings(mockSettings);
  };

  const loadAccessLogs = () => {
    const mockLogs: AccessLog[] = [
      {
        id: '1',
        timestamp: '2025-08-12T10:30:00Z',
        action: 'התחברות מוצלחת',
        ipAddress: '192.168.1.100',
        device: 'Chrome on Windows',
        location: 'תל אביב, ישראל',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        success: true,
      },
      {
        id: '2',
        timestamp: '2025-08-12T09:15:00Z',
        action: 'עדכון הגדרות פרטיות',
        ipAddress: '192.168.1.100',
        device: 'Chrome on Windows',
        location: 'תל אביב, ישראל',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        success: true,
        details: 'שינוי הגדרות שיתוף נתונים',
      },
      {
        id: '3',
        timestamp: '2025-08-11T21:00:00Z',
        action: 'התחברות מוצלחת',
        ipAddress: '10.0.0.50',
        device: 'Safari on iPhone',
        location: 'תל אביב, ישראל',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        success: true,
      },
      {
        id: '4',
        timestamp: '2025-08-11T18:30:00Z',
        action: 'ניסיון התחברות כושל',
        ipAddress: '203.0.113.45',
        device: 'Unknown',
        location: 'Unknown',
        userAgent: 'Mozilla/5.0 (compatible; Bot/1.0)',
        success: false,
        details: 'סיסמה שגויה',
      },
      {
        id: '5',
        timestamp: '2025-08-10T15:45:00Z',
        action: 'ייצוא נתונים',
        ipAddress: '192.168.1.100',
        device: 'Chrome on Windows',
        location: 'תל אביב, ישראל',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        success: true,
        details: 'ייצוא רשומות מצב רוח',
      },
    ];

    setAccessLogs(mockLogs);
  };

  const loadDataExports = () => {
    const mockExports: DataExport[] = [
      {
        id: '1',
        type: 'full',
        status: 'completed',
        requestedAt: '2025-08-10T15:45:00Z',
        completedAt: '2025-08-10T15:47:00Z',
        downloadUrl: '/api/export/full/123',
        size: '2.3 MB',
      },
      {
        id: '2',
        type: 'mood',
        status: 'completed',
        requestedAt: '2025-08-08T10:20:00Z',
        completedAt: '2025-08-08T10:21:00Z',
        downloadUrl: '/api/export/mood/456',
        size: '156 KB',
      },
      {
        id: '3',
        type: 'journal',
        status: 'processing',
        requestedAt: '2025-08-12T09:00:00Z',
      },
    ];

    setDataExports(mockExports);
    setLoading(false);
  };

  const requestDataExport = (type: DataExport['type']) => {
    const newExport: DataExport = {
      id: Date.now().toString(),
      type,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    setDataExports((prev) => [newExport, ...prev]);

    // Simulate processing
    setTimeout(() => {
      setDataExports((prev) =>
        prev.map((exp) =>
          exp.id === newExport.id
            ? { ...exp, status: 'processing' as const }
            : exp
        )
      );
    }, 1000);

    // Simulate completion
    setTimeout(() => {
      setDataExports((prev) =>
        prev.map((exp) =>
          exp.id === newExport.id
            ? {
                ...exp,
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                downloadUrl: `/api/export/${type}/${Date.now()}`,
                size: type === 'full' ? '2.3 MB' : '156 KB',
              }
            : exp
        )
      );
    }, 3000);
  };

  const deleteData = (type: 'mood' | 'journal' | 'all') => {
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // TODO: Implement actual data deletion
    console.log(`Deleting ${deleteType} data...`);
    setShowDeleteConfirm(false);
    setDeleteType(null);
  };

  const getStatusColor = (status: DataExport['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: DataExport['status']) => {
    switch (status) {
      case 'pending':
        return 'ממתין';
      case 'processing':
        return 'מעבד';
      case 'completed':
        return 'הושלם';
      case 'failed':
        return 'נכשל';
      default:
        return 'לא ידוע';
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              פרטיות ואבטחה
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              נהל את הפרטיות והאבטחה של הנתונים שלך
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'settings' ? 'default' : 'outline'}
                onClick={() => setActiveTab('settings')}
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                הגדרות פרטיות
              </Button>
              <Button
                variant={activeTab === 'security' ? 'default' : 'outline'}
                onClick={() => setActiveTab('security')}
                size="sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                אבטחה
              </Button>
              <Button
                variant={activeTab === 'access' ? 'default' : 'outline'}
                onClick={() => setActiveTab('access')}
                size="sm"
              >
                <History className="w-4 h-4 mr-2" />
                היסטוריית גישה
              </Button>
              <Button
                variant={activeTab === 'export' ? 'default' : 'outline'}
                onClick={() => setActiveTab('export')}
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                ייצוא נתונים
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Privacy Settings Tab */}
        {activeTab === 'settings' && privacySettings && (
          <div className="space-y-6">
            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  שיתוף נתונים
                </CardTitle>
                <CardDescription>בחר עם מי לשתף את הנתונים שלך</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">שיתוף עם חוקרים</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      אפשר לחוקרים להשתמש בנתונים שלך למחקר אנונימי
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.dataSharing.shareWithResearchers}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              dataSharing: {
                                ...prev.dataSharing,
                                shareWithResearchers: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">שיתוף עם מטפלים</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      אפשר למטפלים שלך לגשת לנתונים שלך
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.dataSharing.shareWithTherapists}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              dataSharing: {
                                ...prev.dataSharing,
                                shareWithTherapists: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">שיתוף אנונימי</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      שתף נתונים ללא זיהוי אישי
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.dataSharing.shareAnonymously}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              dataSharing: {
                                ...prev.dataSharing,
                                shareAnonymously: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">אנליטיקה</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      אפשר איסוף נתונים אנונימיים לשיפור השירות
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.dataSharing.allowAnalytics}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              dataSharing: {
                                ...prev.dataSharing,
                                allowAnalytics: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visibility Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  הגדרות נראות
                </CardTitle>
                <CardDescription>בחר מה אחרים יכולים לראות</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">פרופיל ציבורי</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      הצג את הפרופיל שלך למשתמשים אחרים
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.visibility.profilePublic}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              visibility: {
                                ...prev.visibility,
                                profilePublic: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">היסטוריית מצב רוח</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      הצג את היסטוריית מצב הרוח שלך
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.visibility.showMoodHistory}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              visibility: {
                                ...prev.visibility,
                                showMoodHistory: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">רשומות יומן</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      הצג את רשומות היומן שלך
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.visibility.showJournalEntries}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              visibility: {
                                ...prev.visibility,
                                showJournalEntries: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">מטרות</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      הצג את המטרות שלך
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.visibility.showGoals}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              visibility: {
                                ...prev.visibility,
                                showGoals: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">פעילות</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      הצג את הפעילות שלך
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.visibility.showActivity}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              visibility: {
                                ...prev.visibility,
                                showActivity: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  שמירת נתונים
                </CardTitle>
                <CardDescription>
                  הגדר כמה זמן לשמור נתונים שונים
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      רשומות מצב רוח (ימים)
                    </label>
                    <Input
                      type="number"
                      value={privacySettings.dataRetention.moodEntries}
                      onChange={(e) =>
                        setPrivacySettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                dataRetention: {
                                  ...prev.dataRetention,
                                  moodEntries: parseInt(e.target.value) || 0,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      רשומות יומן (ימים)
                    </label>
                    <Input
                      type="number"
                      value={privacySettings.dataRetention.journalEntries}
                      onChange={(e) =>
                        setPrivacySettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                dataRetention: {
                                  ...prev.dataRetention,
                                  journalEntries: parseInt(e.target.value) || 0,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      לוגי פעילות (ימים)
                    </label>
                    <Input
                      type="number"
                      value={privacySettings.dataRetention.activityLogs}
                      onChange={(e) =>
                        setPrivacySettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                dataRetention: {
                                  ...prev.dataRetention,
                                  activityLogs: parseInt(e.target.value) || 0,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      נתונים שנמחקו (ימים)
                    </label>
                    <Input
                      type="number"
                      value={privacySettings.dataRetention.deletedDataRetention}
                      onChange={(e) =>
                        setPrivacySettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                dataRetention: {
                                  ...prev.dataRetention,
                                  deletedDataRetention:
                                    parseInt(e.target.value) || 0,
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

        {/* Security Tab */}
        {activeTab === 'security' && privacySettings && (
          <div className="space-y-6">
            {/* Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  אימות זהות
                </CardTitle>
                <CardDescription>הגדרות אבטחה מתקדמות</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">אימות דו-שלבי</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      דורש קוד נוסף להתחברות
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              security: {
                                ...prev.security,
                                twoFactorAuth: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">אימות ביומטרי</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      השתמש בטביעת אצבע או פנים
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.security.biometricAuth}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              security: {
                                ...prev.security,
                                biometricAuth: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    פג תוקף סשן (דקות)
                  </label>
                  <Input
                    type="number"
                    value={privacySettings.security.sessionTimeout}
                    onChange={(e) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              security: {
                                ...prev.security,
                                sessionTimeout: parseInt(e.target.value) || 0,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    מקסימום ניסיונות התחברות כושלים
                  </label>
                  <Input
                    type="number"
                    value={privacySettings.security.maxFailedLogins}
                    onChange={(e) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              security: {
                                ...prev.security,
                                maxFailedLogins: parseInt(e.target.value) || 0,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    שינוי סיסמה נדרש (ימים)
                  </label>
                  <Input
                    type="number"
                    value={privacySettings.security.requirePasswordChange}
                    onChange={(e) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              security: {
                                ...prev.security,
                                requirePasswordChange:
                                  parseInt(e.target.value) || 0,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  התראות אבטחה
                </CardTitle>
                <CardDescription>קבל התראות על פעילות חשודה</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">התראות אבטחה</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      קבל התראות על פעילות חשודה
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.notifications.securityAlerts}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                securityAlerts: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">התראות גישה לנתונים</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      קבל התראות כשמישהו ניגש לנתונים שלך
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.notifications.dataAccessAlerts}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                dataAccessAlerts: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">עדכוני פרטיות</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      קבל עדכונים על שינויים במדיניות הפרטיות
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.notifications.privacyUpdates}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                privacyUpdates: checked,
                              },
                            }
                          : null
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Access Logs Tab */}
        {activeTab === 'access' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  היסטוריית גישה
                </CardTitle>
                <CardDescription>פעילות אחרונה בחשבון שלך</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {accessLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            log.success
                              ? 'bg-green-100 dark:bg-green-900/20'
                              : 'bg-red-100 dark:bg-red-900/20'
                          }`}
                        >
                          {log.success ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {log.action}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {log.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Smartphone className="w-3 h-3" />
                              {log.device}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(log.timestamp).toLocaleString('he-IL')}
                            </span>
                          </div>
                          {log.details && (
                            <p className="text-xs text-gray-500 mt-1">
                              {log.details}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {log.ipAddress}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  ייצוא נתונים
                </CardTitle>
                <CardDescription>
                  ייצא את הנתונים שלך בפורמטים שונים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2"
                    onClick={() => requestDataExport('full')}
                  >
                    <Archive className="w-8 h-8" />
                    <span className="font-medium">ייצוא מלא</span>
                    <span className="text-sm text-gray-600">
                      כל הנתונים שלך
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2"
                    onClick={() => requestDataExport('mood')}
                  >
                    <Heart className="w-8 h-8" />
                    <span className="font-medium">רשומות מצב רוח</span>
                    <span className="text-sm text-gray-600">
                      היסטוריית מצב רוח
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2"
                    onClick={() => requestDataExport('journal')}
                  >
                    <FileText className="w-8 h-8" />
                    <span className="font-medium">רשומות יומן</span>
                    <span className="text-sm text-gray-600">
                      כל הרשומות שלך
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2"
                    onClick={() => requestDataExport('goals')}
                  >
                    <Target className="w-8 h-8" />
                    <span className="font-medium">מטרות והישגים</span>
                    <span className="text-sm text-gray-600">מעקב מטרות</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Export History */}
            <Card>
              <CardHeader>
                <CardTitle>היסטוריית ייצוא</CardTitle>
                <CardDescription>ייצואים קודמים שלך</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataExports.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                      אין ייצואים קודמים
                    </p>
                  ) : (
                    dataExports.map((exportItem) => (
                      <div
                        key={exportItem.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Download className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              ייצוא{' '}
                              {exportItem.type === 'full'
                                ? 'מלא'
                                : exportItem.type === 'mood'
                                  ? 'מצב רוח'
                                  : exportItem.type === 'journal'
                                    ? 'יומן'
                                    : exportItem.type === 'goals'
                                      ? 'מטרות'
                                      : 'פעילות'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(exportItem.requestedAt).toLocaleString(
                                'he-IL'
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(exportItem.status)}>
                            {getStatusText(exportItem.status)}
                          </Badge>
                          {exportItem.status === 'completed' &&
                            exportItem.downloadUrl && (
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                הורד
                              </Button>
                            )}
                          {exportItem.size && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {exportItem.size}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Data Deletion */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  מחיקת נתונים
                </CardTitle>
                <CardDescription>פעולות אלו אינן הפיכות</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-orange-200 hover:border-orange-300"
                    onClick={() => deleteData('mood')}
                  >
                    <Trash2 className="w-6 h-6 text-orange-600" />
                    <span className="font-medium">מחק רשומות מצב רוח</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-orange-200 hover:border-orange-300"
                    onClick={() => deleteData('journal')}
                  >
                    <Trash2 className="w-6 h-6 text-orange-600" />
                    <span className="font-medium">מחק רשומות יומן</span>
                  </Button>
                  <Button
                    variant="destructive"
                    className="h-20 flex-col gap-2"
                    onClick={() => deleteData('all')}
                  >
                    <Trash2 className="w-6 h-6" />
                    <span className="font-medium">מחק הכל</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                מחיקת נתונים
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {deleteType === 'mood' &&
                'האם אתה בטוח שברצונך למחוק את כל רשומות מצב הרוח שלך? פעולה זו איננה הפיכה.'}
              {deleteType === 'journal' &&
                'האם אתה בטוח שברצונך למחוק את כל רשומות היומן שלך? פעולה זו איננה הפיכה.'}
              {deleteType === 'all' &&
                'האם אתה בטוח שברצונך למחוק את כל הנתונים שלך? פעולה זו איננה הפיכה וכל המידע יימחק לצמיתות.'}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ביטול
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                מחק
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
