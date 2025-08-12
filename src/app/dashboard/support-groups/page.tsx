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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  MessageCircle,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Shield,
  Phone,
  Mail,
  Globe,
  Video,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Star,
  UserCheck,
  Lock,
  Unlock,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category:
    | 'anxiety'
    | 'depression'
    | 'general'
    | 'trauma'
    | 'addiction'
    | 'family';
  type: 'online' | 'in-person' | 'hybrid';
  meetingTime: string;
  meetingDay: string;
  location?: string;
  onlineLink?: string;
  facilitator: string;
  maxParticipants: number;
  currentParticipants: number;
  isPrivate: boolean;
  tags: string[];
  rating: number;
  nextMeeting: string;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

const supportGroups: SupportGroup[] = [
  {
    id: '1',
    name: 'קבוצת תמיכה לחרדה חברתית',
    description:
      'קבוצה תומכת לאנשים המתמודדים עם חרדה חברתית. נפגשים לשיתוף חוויות, טכניקות התמודדות ותמיכה הדדית.',
    category: 'anxiety',
    type: 'hybrid',
    meetingTime: '19:00-20:30',
    meetingDay: 'יום שני',
    location: 'מרכז בריאות הנפש, תל אביב',
    onlineLink: 'https://zoom.us/j/123456789',
    facilitator: 'ד"ר שרה כהן',
    maxParticipants: 15,
    currentParticipants: 12,
    isPrivate: false,
    tags: ['חרדה חברתית', 'טכניקות התמודדות', 'תמיכה הדדית'],
    rating: 4.8,
    nextMeeting: '2025-08-18',
    contactInfo: {
      phone: '03-1234567',
      email: 'anxiety-support@mentalhealth.org.il',
      website: 'https://mentalhealth.org.il/anxiety',
    },
  },
  {
    id: '2',
    name: 'קבוצת תמיכה לדיכאון',
    description:
      'קבוצה בטוחה ומכילה לאנשים המתמודדים עם דיכאון. מתמקדת בשיתוף חוויות, בניית תקווה ופיתוח אסטרטגיות התמודדות.',
    category: 'depression',
    type: 'online',
    meetingTime: '18:00-19:30',
    meetingDay: 'יום שלישי',
    onlineLink: 'https://meet.google.com/abc-defg-hij',
    facilitator: 'מיכל לוי, MSW',
    maxParticipants: 20,
    currentParticipants: 18,
    isPrivate: true,
    tags: ['דיכאון', 'תקווה', 'התמודדות', 'תמיכה'],
    rating: 4.9,
    nextMeeting: '2025-08-19',
    contactInfo: {
      email: 'depression-support@mentalhealth.org.il',
      website: 'https://mentalhealth.org.il/depression',
    },
  },
  {
    id: '3',
    name: 'קבוצת תמיכה למשפחות',
    description:
      'קבוצה למשפחות המתמודדות עם אתגרים נפשיים. מספקת תמיכה, חינוך וכלים להתמודדות עם מצבים מורכבים.',
    category: 'family',
    type: 'in-person',
    meetingTime: '20:00-21:30',
    meetingDay: 'יום רביעי',
    location: 'בית הספר לעבודה סוציאלית, ירושלים',
    facilitator: 'עו"ס דוד אברהם',
    maxParticipants: 25,
    currentParticipants: 22,
    isPrivate: false,
    tags: ['משפחה', 'תמיכה', 'חינוך', 'כלים'],
    rating: 4.7,
    nextMeeting: '2025-08-20',
    contactInfo: {
      phone: '02-9876543',
      email: 'family-support@mentalhealth.org.il',
    },
  },
  {
    id: '4',
    name: 'קבוצת מדיטציה ומיינדפולנס',
    description:
      'קבוצה המתמקדת בטכניקות מדיטציה ומיינדפולנס לשיפור הרווחה הנפשית. מתאימה למתחילים ומתקדמים.',
    category: 'general',
    type: 'hybrid',
    meetingTime: '17:00-18:00',
    meetingDay: 'יום חמישי',
    location: 'מרכז מיינדפולנס, חיפה',
    onlineLink: 'https://zoom.us/j/987654321',
    facilitator: 'יוגי ראם שרמה',
    maxParticipants: 30,
    currentParticipants: 28,
    isPrivate: false,
    tags: ['מדיטציה', 'מיינדפולנס', 'הרגעה', 'רווחה'],
    rating: 4.6,
    nextMeeting: '2025-08-21',
    contactInfo: {
      phone: '04-5551234',
      email: 'mindfulness@mentalhealth.org.il',
      website: 'https://mentalhealth.org.il/mindfulness',
    },
  },
  {
    id: '5',
    name: 'קבוצת תמיכה לטראומה',
    description:
      'קבוצה מקצועית ומתודית לאנשים המתמודדים עם טראומה. מתמקדת בעיבוד חוויות טראומטיות ובבניית חוסן.',
    category: 'trauma',
    type: 'in-person',
    meetingTime: '19:30-21:00',
    meetingDay: 'יום ראשון',
    location: 'מרכז לטיפול בטראומה, באר שבע',
    facilitator: 'ד"ר אחמד נסר',
    maxParticipants: 12,
    currentParticipants: 10,
    isPrivate: true,
    tags: ['טראומה', 'עיבוד', 'חוסן', 'מקצועי'],
    rating: 4.9,
    nextMeeting: '2025-08-24',
    contactInfo: {
      phone: '08-1234567',
      email: 'trauma-support@mentalhealth.org.il',
    },
  },
];

const categories = [
  { id: 'all', name: 'כל הקטגוריות', color: 'bg-gray-100 text-gray-800' },
  { id: 'anxiety', name: 'חרדה', color: 'bg-red-100 text-red-800' },
  { id: 'depression', name: 'דיכאון', color: 'bg-blue-100 text-blue-800' },
  { id: 'general', name: 'כללי', color: 'bg-green-100 text-green-800' },
  { id: 'trauma', name: 'טראומה', color: 'bg-purple-100 text-purple-800' },
  { id: 'addiction', name: 'התמכרות', color: 'bg-orange-100 text-orange-800' },
  { id: 'family', name: 'משפחה', color: 'bg-pink-100 text-pink-800' },
];

export default function SupportGroupsPage() {
  const [groups, setGroups] = useState<SupportGroup[]>(supportGroups);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showJoinForm, setShowJoinForm] = useState<string | null>(null);
  const [joinRequest, setJoinRequest] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    experience: '',
  });

  const filteredGroups = groups.filter((group) => {
    if (selectedCategory !== 'all' && group.category !== selectedCategory)
      return false;
    if (selectedType !== 'all' && group.type !== selectedType) return false;
    if (
      searchQuery &&
      !group.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !group.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleJoinRequest = (groupId: string) => {
    if (!joinRequest.name || !joinRequest.email || !joinRequest.reason) return;

    // Simulate joining request
    alert('בקשת ההצטרפות נשלחה בהצלחה! נציג הקבוצה יצור איתך קשר בקרוב.');

    // Reset form
    setJoinRequest({
      name: '',
      email: '',
      phone: '',
      reason: '',
      experience: '',
    });
    setShowJoinForm(null);
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'online':
        return <Globe className="w-4 h-4" />;
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      case 'hybrid':
        return <Video className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'online':
        return 'מקוון';
      case 'in-person':
        return 'פרונטלי';
      case 'hybrid':
        return 'היברידי';
      default:
        return type;
    }
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.name : category;
  };

  const getAvailabilityStatus = (group: SupportGroup) => {
    if (group.currentParticipants >= group.maxParticipants) {
      return { text: 'מלא', color: 'bg-red-100 text-red-800' };
    } else if (group.currentParticipants >= group.maxParticipants * 0.8) {
      return { text: 'כמעט מלא', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'פנוי', color: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            קבוצות תמיכה 🤝
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            מצא קבוצת תמיכה מתאימה וקבל תמיכה מאחרים המתמודדים עם אתגרים דומים
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="חפש קבוצות תמיכה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">כל הסוגים</option>
              <option value="online">מקוון</option>
              <option value="in-person">פרונטלי</option>
              <option value="hybrid">היברידי</option>
            </select>
          </div>
        </div>

        {/* Groups List */}
        <div className="space-y-6">
          {filteredGroups.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="py-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  לא נמצאו קבוצות תמיכה
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  נסה לשנות את הסינון או החיפוש
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredGroups.map((group) => (
              <Card
                key={group.id}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                          {group.name}
                        </CardTitle>
                        <Badge className={getCategoryColor(group.category)}>
                          {getCategoryName(group.category)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="flex items-center space-x-1"
                        >
                          {getTypeIcon(group.type)}
                          <span>{getTypeText(group.type)}</span>
                        </Badge>
                        <Badge className={getAvailabilityStatus(group).color}>
                          {getAvailabilityStatus(group).text}
                        </Badge>
                        {group.isPrivate && (
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <Lock className="w-3 h-3" />
                            <span>פרטי</span>
                          </Badge>
                        )}
                      </div>

                      <CardDescription className="text-gray-600 dark:text-gray-400 text-base mb-3">
                        {group.description}
                      </CardDescription>

                      {/* Meeting Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {group.meetingDay}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {group.meetingTime}
                          </span>
                        </div>
                        {group.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {group.location}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {group.currentParticipants}/{group.maxParticipants}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {group.rating}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {group.currentParticipants} משתתפים
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Facilitator and Next Meeting */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        מנחה הקבוצה
                      </div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {group.facilitator}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        פגישה הבאה
                      </div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date(group.nextMeeting).toLocaleDateString(
                          'he-IL'
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      {group.contactInfo.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {group.contactInfo.phone}
                          </span>
                        </div>
                      )}
                      {group.contactInfo.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {group.contactInfo.email}
                          </span>
                        </div>
                      )}
                      {group.contactInfo.website && (
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <a
                            href={group.contactInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            אתר אינטרנט
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {group.onlineLink && (
                        <Button variant="outline" size="sm">
                          <Video className="w-4 h-4 mr-1" />
                          הצטרף מקוון
                        </Button>
                      )}
                      <Button
                        onClick={() => setShowJoinForm(group.id)}
                        disabled={
                          group.currentParticipants >= group.maxParticipants
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        בקש הצטרפות
                      </Button>
                    </div>
                  </div>

                  {/* Join Form */}
                  {showJoinForm === group.id && (
                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                        בקשת הצטרפות לקבוצה
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            שם מלא *
                          </label>
                          <Input
                            value={joinRequest.name}
                            onChange={(e) =>
                              setJoinRequest((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="הכנס את שמך המלא"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            אימייל *
                          </label>
                          <Input
                            type="email"
                            value={joinRequest.email}
                            onChange={(e) =>
                              setJoinRequest((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            placeholder="הכנס את כתובת האימייל שלך"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            טלפון
                          </label>
                          <Input
                            value={joinRequest.phone}
                            onChange={(e) =>
                              setJoinRequest((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="הכנס את מספר הטלפון שלך"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ניסיון קודם
                          </label>
                          <select
                            value={joinRequest.experience}
                            onChange={(e) =>
                              setJoinRequest((prev) => ({
                                ...prev,
                                experience: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">בחר אפשרות</option>
                            <option value="none">אין ניסיון</option>
                            <option value="some">קצת ניסיון</option>
                            <option value="experienced">ניסיון רב</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          סיבת ההצטרפות *
                        </label>
                        <Textarea
                          value={joinRequest.reason}
                          onChange={(e) =>
                            setJoinRequest((prev) => ({
                              ...prev,
                              reason: e.target.value,
                            }))
                          }
                          placeholder="ספר לנו למה אתה מעוניין להצטרף לקבוצה..."
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div className="flex items-center justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowJoinForm(null)}
                        >
                          ביטול
                        </Button>
                        <Button
                          onClick={() => handleJoinRequest(group.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          שלח בקשת הצטרפות
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Tips Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              טיפים להצטרפות לקבוצות תמיכה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  היה פתוח
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  פתח את הלב לשיתוף חוויות ולקבלת תמיכה מאחרים
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  שמור על פרטיות
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  מה שמושתף בקבוצה נשאר בקבוצה - שמור על סודיות
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  השתתף באופן פעיל
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  השתתף בשיחות, שאל שאלות ותן תמיכה לאחרים
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
