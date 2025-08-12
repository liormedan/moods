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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  Trash2,
  Shield,
  Activity,
  Heart,
  Brain,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Target,
  BookOpen,
  Users,
  Settings,
} from 'lucide-react';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  location?: string;
  timezone: string;
  language: 'hebrew' | 'english' | 'arabic';
  profileImage?: string;
  bio?: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      shareData: boolean;
      anonymousMode: boolean;
      dataRetention: number;
    };
  };
  createdAt: string;
  lastActive: string;
  totalMoodEntries: number;
  totalJournalEntries: number;
  totalBreathingSessions: number;
  totalGoals: number;
  completedGoals: number;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'mood' | 'journal' | 'breathing' | 'goal' | 'login' | 'settings';
  ipAddress?: string;
  device?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Partial<UserProfile>>(
    {}
  );

  useEffect(() => {
    loadProfile();
    loadActivityLogs();
  }, []);

  const loadProfile = () => {
    // Mock data for demo
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'יוסי',
      lastName: 'כהן',
      email: 'yossi.cohen@example.com',
      phone: '050-1234567',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      location: 'תל אביב, ישראל',
      timezone: 'Asia/Jerusalem',
      language: 'hebrew',
      profileImage: '/api/placeholder/150/150',
      bio: 'אני מתעניין בבריאות הנפש ומחפש דרכים לשפר את הרווחה האישית שלי.',
      preferences: {
        theme: 'auto',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          shareData: false,
          anonymousMode: false,
          dataRetention: 365,
        },
      },
      createdAt: '2024-01-01',
      lastActive: '2025-08-12T10:30:00Z',
      totalMoodEntries: 156,
      totalJournalEntries: 89,
      totalBreathingSessions: 234,
      totalGoals: 12,
      completedGoals: 8,
    };

    setProfile(mockProfile);
    setEditingProfile(mockProfile);
    setLoading(false);
  };

  const loadActivityLogs = () => {
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        action: 'התחברות למערכת',
        description: 'התחברות מוצלחת מהדפדפן',
        timestamp: '2025-08-12T10:30:00Z',
        type: 'login',
        ipAddress: '192.168.1.100',
        device: 'Chrome on Windows',
      },
      {
        id: '2',
        action: 'עדכון מצב רוח',
        description: 'הוספת רשומת מצב רוח חדשה',
        timestamp: '2025-08-12T09:15:00Z',
        type: 'mood',
      },
      {
        id: '3',
        action: 'כתיבת יומן',
        description: 'הוספת רשומה חדשה ליומן',
        timestamp: '2025-08-11T21:00:00Z',
        type: 'journal',
      },
      {
        id: '4',
        action: 'תרגיל נשימה',
        description: 'השלמת תרגיל נשימה 4-7-8',
        timestamp: '2025-08-11T20:30:00Z',
        type: 'breathing',
      },
      {
        id: '5',
        action: 'עדכון מטרה',
        description: 'עדכון התקדמות במטרה: תרגול מדיטציה יומי',
        timestamp: '2025-08-10T18:45:00Z',
        type: 'goal',
      },
    ];

    setActivityLogs(mockLogs);
  };

  const handleSave = () => {
    if (profile && editingProfile) {
      setProfile({ ...profile, ...editingProfile });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditingProfile(profile);
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log('Deleting account...');
    setShowDeleteConfirm(false);
  };

  const exportData = () => {
    // TODO: Implement data export
    console.log('Exporting data...');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">טוען פרופיל...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">שגיאה בטעינת הפרופיל</p>
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
              פרופיל אישי
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              נהל את המידע האישי וההעדפות שלך
            </p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit3 className="w-4 h-4 mr-2" />
                ערוך פרופיל
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} variant="default">
                  <Save className="w-4 h-4 mr-2" />
                  שמור
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  ביטול
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  מידע בסיסי
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      שם פרטי
                    </label>
                    {isEditing ? (
                      <Input
                        value={editingProfile.firstName || ''}
                        onChange={(e) =>
                          setEditingProfile({
                            ...editingProfile,
                            firstName: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profile.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      שם משפחה
                    </label>
                    {isEditing ? (
                      <Input
                        value={editingProfile.lastName || ''}
                        onChange={(e) =>
                          setEditingProfile({
                            ...editingProfile,
                            lastName: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profile.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      אימייל
                    </label>
                    {isEditing ? (
                      <Input
                        value={editingProfile.email || ''}
                        onChange={(e) =>
                          setEditingProfile({
                            ...editingProfile,
                            email: e.target.value,
                          })
                        }
                        type="email"
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profile.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      טלפון
                    </label>
                    {isEditing ? (
                      <Input
                        value={editingProfile.phone || ''}
                        onChange={(e) =>
                          setEditingProfile({
                            ...editingProfile,
                            phone: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profile.phone || 'לא צוין'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      תאריך לידה
                    </label>
                    {isEditing ? (
                      <Input
                        value={editingProfile.dateOfBirth || ''}
                        onChange={(e) =>
                          setEditingProfile({
                            ...editingProfile,
                            dateOfBirth: e.target.value,
                          })
                        }
                        type="date"
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profile.dateOfBirth || 'לא צוין'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      מין
                    </label>
                    {isEditing ? (
                      <Select
                        value={editingProfile.gender || ''}
                        onValueChange={(value) =>
                          setEditingProfile({
                            ...editingProfile,
                            gender: value as any,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="בחר מין" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">זכר</SelectItem>
                          <SelectItem value="female">נקבה</SelectItem>
                          <SelectItem value="other">אחר</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            מעדיף לא לציין
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profile.gender === 'male'
                          ? 'זכר'
                          : profile.gender === 'female'
                            ? 'נקבה'
                            : profile.gender === 'other'
                              ? 'אחר'
                              : profile.gender === 'prefer-not-to-say'
                                ? 'מעדיף לא לציין'
                                : 'לא צוין'}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    מיקום
                  </label>
                  {isEditing ? (
                    <Input
                      value={editingProfile.location || ''}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          location: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profile.location || 'לא צוין'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    אודות
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={editingProfile.bio || ''}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          bio: e.target.value,
                        })
                      }
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {profile.bio || 'לא צוין'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  העדפות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      שפה
                    </label>
                    {isEditing ? (
                      <Select
                        value={editingProfile.language || 'hebrew'}
                        onValueChange={(value) =>
                          setEditingProfile({
                            ...editingProfile,
                            language: value as any,
                          })
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
                    ) : (
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profile.language === 'hebrew'
                          ? 'עברית'
                          : profile.language === 'english'
                            ? 'English'
                            : 'العربية'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      ערכת נושא
                    </label>
                    {isEditing ? (
                      <Select
                        value={editingProfile.preferences?.theme || 'auto'}
                        onValueChange={(value) =>
                          setEditingProfile({
                            ...editingProfile,
                            preferences: {
                              ...editingProfile.preferences!,
                              theme: value as any,
                            },
                          })
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
                    ) : (
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profile.preferences.theme === 'light'
                          ? 'בהיר'
                          : profile.preferences.theme === 'dark'
                            ? 'כהה'
                            : 'אוטומטי'}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  סטטיסטיקות פעילות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {profile.totalMoodEntries}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      רשומות מצב רוח
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {profile.totalJournalEntries}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      רשומות יומן
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {profile.totalBreathingSessions}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      תרגילי נשימה
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {profile.completedGoals}/{profile.totalGoals}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      מטרות הושלמו
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  תמונת פרופיל
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="תמונת פרופיל"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    שנה תמונה
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>פעולות מהירות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={exportData}
                >
                  <Download className="w-4 h-4 mr-2" />
                  ייצוא נתונים
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  הגדרות פרטיות
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  הגדרות מתקדמות
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600">אזור מסוכן</CardTitle>
                <CardDescription>פעולות אלו אינן הפיכות</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  מחק חשבון
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              היסטוריית פעילות
            </CardTitle>
            <CardDescription>פעילות אחרונה במערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      {log.type === 'mood' && (
                        <Heart className="w-4 h-4 text-blue-600" />
                      )}
                      {log.type === 'journal' && (
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      )}
                      {log.type === 'breathing' && (
                        <Brain className="w-4 h-4 text-blue-600" />
                      )}
                      {log.type === 'goal' && (
                        <Target className="w-4 h-4 text-blue-600" />
                      )}
                      {log.type === 'login' && (
                        <User className="w-4 h-4 text-blue-600" />
                      )}
                      {log.type === 'settings' && (
                        <Settings className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {log.action}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {log.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleDateString('he-IL')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString('he-IL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                מחיקת חשבון
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              האם אתה בטוח שברצונך למחוק את החשבון שלך? פעולה זו איננה הפיכה וכל
              הנתונים יימחקו לצמיתות.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ביטול
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                מחק חשבון
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
