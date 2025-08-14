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
  averageProgress?: number;
  streakDays?: number;
  totalPoints?: number;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type:
    | 'mood'
    | 'journal'
    | 'breathing'
    | 'goal'
    | 'login'
    | 'settings'
    | 'profile'
    | 'export';
  ipAddress?: string;
  device?: string;
  location?: string;
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

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile');
      if (response.ok) {
        const result = await response.json();
        setProfile(result.data);
        setEditingProfile(result.data);
      } else {
        console.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    try {
      const response = await fetch('/api/profile/activity?limit=10');
      if (response.ok) {
        const result = await response.json();
        setActivityLogs(result.data || []);
      } else {
        console.error('Failed to load activity logs');
      }
    } catch (error) {
      console.error('Error loading activity logs:', error);
    }
  };

  const handleSave = async () => {
    if (!profile || !editingProfile) return;

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProfile),
      });

      if (response.ok) {
        const result = await response.json();
        setProfile({ ...profile, ...editingProfile });
        setIsEditing(false);

        // Log the activity
        await fetch('/api/profile/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'עדכון פרופיל',
            description: 'עדכון פרטי פרופיל אישי',
            type: 'profile',
          }),
        });

        // Reload activity logs
        loadActivityLogs();
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditingProfile(profile);
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/profile?confirm=true', {
        method: 'DELETE',
      });

      if (response.ok) {
        // Redirect to login or show success message
        window.location.href = '/auth/signin';
      } else {
        console.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
    setShowDeleteConfirm(false);
  };

  const exportData = async () => {
    try {
      // Create CSV content with all user data
      const csvContent = [
        ['סוג נתון', 'כמות', 'תאריך עדכון אחרון'].join(','),
        [
          'רשומות מצב רוח',
          profile?.totalMoodEntries || 0,
          new Date().toLocaleDateString('he-IL'),
        ].join(','),
        [
          'רשומות יומן',
          profile?.totalJournalEntries || 0,
          new Date().toLocaleDateString('he-IL'),
        ].join(','),
        [
          'תרגילי נשימה',
          profile?.totalBreathingSessions || 0,
          new Date().toLocaleDateString('he-IL'),
        ].join(','),
        [
          'מטרות',
          profile?.totalGoals || 0,
          new Date().toLocaleDateString('he-IL'),
        ].join(','),
        [
          'מטרות הושלמו',
          profile?.completedGoals || 0,
          new Date().toLocaleDateString('he-IL'),
        ].join(','),
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `נתוני_פרופיל_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      // Log the activity
      await fetch('/api/profile/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ייצוא נתונים',
          description: 'ייצוא נתוני פרופיל לקובץ CSV',
          type: 'export',
        }),
      });

      // Reload activity logs
      loadActivityLogs();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {profile.totalMoodEntries}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      רשומות מצב רוח
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {profile.totalJournalEntries}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      רשומות יומן
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {profile.totalBreathingSessions}
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      תרגילי נשימה
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {profile.completedGoals}/{profile.totalGoals}
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">
                      מטרות הושלמו
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {profile.streakDays || 0}
                      </span>
                    </div>
                    <div className="text-xs text-yellow-700 dark:text-yellow-300">
                      ימי רצף פעילות
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {profile.averageProgress || 0}%
                      </span>
                    </div>
                    <div className="text-xs text-indigo-700 dark:text-indigo-300">
                      ממוצע התקדמות
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                      <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                        {profile.totalPoints || 0}
                      </span>
                    </div>
                    <div className="text-xs text-pink-700 dark:text-pink-300">
                      נקודות רווחה
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
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    // Navigate to privacy settings
                    window.location.href = '/dashboard/privacy';
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  הגדרות פרטיות
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    // Navigate to settings
                    window.location.href = '/dashboard/settings';
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  הגדרות מתקדמות
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    // Clear activity logs older than 30 days
                    if (
                      confirm(
                        'האם אתה בטוח שברצונך למחוק את היסטוריית הפעילות מהחודש האחרון?'
                      )
                    ) {
                      fetch('/api/profile/activity?days=30', {
                        method: 'DELETE',
                      })
                        .then(() => loadActivityLogs())
                        .catch(console.error);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  נקה היסטוריה
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>מידע חשבון</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    תאריך הצטרפות:
                  </span>
                  <span className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString('he-IL')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    פעילות אחרונה:
                  </span>
                  <span className="font-medium">
                    {new Date(profile.lastActive).toLocaleDateString('he-IL')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    אזור זמן:
                  </span>
                  <span className="font-medium">{profile.timezone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    מזהה משתמש:
                  </span>
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {profile.id}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  הישגים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.totalMoodEntries >= 100 && (
                    <div className="flex items-center gap-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          מעקב מצב רוח
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          100+ רשומות
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.completedGoals >= 5 && (
                    <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          משיג מטרות
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          5+ מטרות הושלמו
                        </p>
                      </div>
                    </div>
                  )}

                  {(profile.streakDays || 0) >= 7 && (
                    <div className="flex items-center gap-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-900 dark:text-purple-100">
                          רצף פעילות
                        </p>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          {profile.streakDays} ימים ברצף
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.totalJournalEntries >= 50 && (
                    <div className="flex items-center gap-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          כותב יומן
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                          50+ רשומות יומן
                        </p>
                      </div>
                    </div>
                  )}
                </div>
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  היסטוריית פעילות
                </CardTitle>
                <CardDescription>פעילות אחרונה במערכת</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  onChange={(e) => {
                    const type = e.target.value;
                    // Reload activity logs with filter
                    fetch(`/api/profile/activity?type=${type}&limit=10`)
                      .then((res) => res.json())
                      .then((result) => setActivityLogs(result.data || []))
                      .catch(console.error);
                  }}
                >
                  <option value="all">כל הפעילויות</option>
                  <option value="mood">מצב רוח</option>
                  <option value="journal">יומן</option>
                  <option value="breathing">תרגילי נשימה</option>
                  <option value="goal">מטרות</option>
                  <option value="login">התחברות</option>
                  <option value="settings">הגדרות</option>
                  <option value="profile">פרופיל</option>
                  <option value="export">ייצוא</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const csvContent = [
                      ['תאריך', 'שעה', 'פעולה', 'תיאור', 'סוג'].join(','),
                      ...activityLogs.map((log) =>
                        [
                          new Date(log.timestamp).toLocaleDateString('he-IL'),
                          new Date(log.timestamp).toLocaleTimeString('he-IL'),
                          `"${log.action}"`,
                          `"${log.description}"`,
                          log.type,
                        ].join(',')
                      ),
                    ].join('\n');

                    const blob = new Blob(['\uFEFF' + csvContent], {
                      type: 'text/csv;charset=utf-8;',
                    });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `היסטוריית_פעילות_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activityLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>אין פעילות להצגה</p>
                </div>
              ) : (
                activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.type === 'mood'
                            ? 'bg-red-100 dark:bg-red-900/20'
                            : log.type === 'journal'
                              ? 'bg-green-100 dark:bg-green-900/20'
                              : log.type === 'breathing'
                                ? 'bg-purple-100 dark:bg-purple-900/20'
                                : log.type === 'goal'
                                  ? 'bg-blue-100 dark:bg-blue-900/20'
                                  : log.type === 'login'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/20'
                                    : log.type === 'settings'
                                      ? 'bg-gray-100 dark:bg-gray-700'
                                      : log.type === 'profile'
                                        ? 'bg-indigo-100 dark:bg-indigo-900/20'
                                        : 'bg-orange-100 dark:bg-orange-900/20'
                        }`}
                      >
                        {log.type === 'mood' && (
                          <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                        {log.type === 'journal' && (
                          <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                        )}
                        {log.type === 'breathing' && (
                          <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        )}
                        {log.type === 'goal' && (
                          <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                        {log.type === 'login' && (
                          <User className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        )}
                        {log.type === 'settings' && (
                          <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                        {log.type === 'profile' && (
                          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                        {log.type === 'export' && (
                          <Download className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {log.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {log.description}
                        </p>
                        {log.device && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {log.device} • {log.location || 'מיקום לא ידוע'}
                          </p>
                        )}
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
                ))
              )}
            </div>
            {activityLogs.length > 0 && (
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Load more activity logs
                    fetch(
                      `/api/profile/activity?limit=20&offset=${activityLogs.length}`
                    )
                      .then((res) => res.json())
                      .then((result) => {
                        if (result.data && result.data.length > 0) {
                          setActivityLogs((prev) => [...prev, ...result.data]);
                        }
                      })
                      .catch(console.error);
                  }}
                >
                  טען עוד פעילויות
                </Button>
              </div>
            )}
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
