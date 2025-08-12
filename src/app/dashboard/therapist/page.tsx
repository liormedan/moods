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
  Brain,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Search,
  Filter,
  Calendar,
  Video,
  MessageCircle,
  UserCheck,
  Shield,
  Award,
  Languages,
  DollarSign,
  Clock3,
  CheckCircle,
  ExternalLink,
  Heart,
  Users,
  BookOpen,
  Activity,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Therapist {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  location: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  languages: string[];
  sessionTypes: 'in-person' | 'online' | 'hybrid';
  sessionDuration: number;
  price: {
    min: number;
    max: number;
    currency: string;
  };
  availability: {
    days: string[];
    hours: string;
    emergency: boolean;
  };
  education: string[];
  certifications: string[];
  approach: string;
  description: string;
  photo?: string;
  verified: boolean;
  acceptsInsurance: boolean;
  slidingScale: boolean;
}

const therapists: Therapist[] = [
  {
    id: '1',
    name: 'ד"ר יעל כהן',
    title: 'פסיכולוגית קלינית מומחית',
    specialization: ['חרדה', 'דיכאון', 'טראומה', 'CBT'],
    experience: 15,
    rating: 4.9,
    reviewCount: 127,
    location: 'תל אביב',
    address: 'רחוב דיזנגוף 123, תל אביב',
    phone: '03-1234567',
    email: 'yael.cohen@therapy.co.il',
    website: 'https://yael-cohen-therapy.co.il',
    languages: ['עברית', 'אנגלית'],
    sessionTypes: 'hybrid',
    sessionDuration: 50,
    price: {
      min: 300,
      max: 400,
      currency: 'ILS',
    },
    availability: {
      days: ['ראשון', 'שני', 'שלישי', 'רביעי'],
      hours: '09:00-18:00',
      emergency: true,
    },
    education: ['תואר שני בפסיכולוגיה קלינית, אוניברסיטת תל אביב'],
    certifications: ['פסיכולוגית מומחית', 'מטפלת CBT מוסמכת'],
    approach: 'טיפול קוגניטיבי-התנהגותי (CBT) משולב עם גישות נוספות',
    description:
      'מטפלת מנוסה המתמחה בטיפול בחרדה, דיכאון וטראומה. משתמשת בגישות מבוססות מחקר ומתאימה את הטיפול לצרכים האישיים של כל מטופל.',
    verified: true,
    acceptsInsurance: true,
    slidingScale: true,
  },
  {
    id: '2',
    name: 'עו"ס דוד אברהם',
    title: 'עובד סוציאלי קליני',
    specialization: ['משפחה', 'זוגות', 'ילדים ונוער', 'משברי חיים'],
    experience: 12,
    rating: 4.7,
    reviewCount: 89,
    location: 'ירושלים',
    address: 'רחוב יפו 456, ירושלים',
    phone: '02-9876543',
    email: 'david.abraham@socialwork.co.il',
    languages: ['עברית', 'ערבית'],
    sessionTypes: 'in-person',
    sessionDuration: 60,
    price: {
      min: 250,
      max: 350,
      currency: 'ILS',
    },
    availability: {
      days: ['ראשון', 'שלישי', 'חמישי'],
      hours: '16:00-20:00',
      emergency: false,
    },
    education: ['תואר שני בעבודה סוציאלית קלינית, האוניברסיטה העברית'],
    certifications: ['עובד סוציאלי קליני', 'מטפל משפחתי מוסמך'],
    approach: 'טיפול משפחתי מערכתי עם דגש על יחסים ותקשורת',
    description:
      'מטפל מנוסה המתמחה בעבודה עם משפחות, זוגות וילדים. מאמין בכוחה של המשפחה כמערכת תומכת ומשקם.',
    verified: true,
    acceptsInsurance: true,
    slidingScale: false,
  },
  {
    id: '3',
    name: 'ד"ר אחמד נסר',
    title: 'פסיכיאטר מומחה',
    specialization: ['דיכאון', 'חרדה', 'הפרעות אישיות', 'פסיכופרמקולוגיה'],
    experience: 20,
    rating: 4.8,
    reviewCount: 156,
    location: 'חיפה',
    address: 'רחוב הרצל 789, חיפה',
    phone: '04-5551234',
    email: 'ahmad.nassar@psychiatry.co.il',
    languages: ['עברית', 'ערבית', 'אנגלית'],
    sessionTypes: 'hybrid',
    sessionDuration: 45,
    price: {
      min: 400,
      max: 500,
      currency: 'ILS',
    },
    availability: {
      days: ['ראשון', 'שני', 'רביעי', 'חמישי'],
      hours: '08:00-17:00',
      emergency: true,
    },
    education: ['תואר שני ברפואה, אוניברסיטת חיפה', 'התמחות בפסיכיאטריה'],
    certifications: ['פסיכיאטר מומחה', 'מומחה בפסיכופרמקולוגיה'],
    approach: 'טיפול משולב של פסיכותרפיה ותרופות בהתאם לצורך',
    description:
      'פסיכיאטר מנוסה המתמחה בטיפול בדיכאון וחרדה. מאמין בגישה הוליסטית המשלבת טיפול נפשי ותרופתי.',
    verified: true,
    acceptsInsurance: true,
    slidingScale: false,
  },
  {
    id: '4',
    name: 'מיכל לוי',
    title: 'מטפלת באומנות',
    specialization: ['טראומה', 'ילדים ונוער', 'הבעה ויצירה', 'מיינדפולנס'],
    experience: 8,
    rating: 4.6,
    reviewCount: 67,
    location: 'באר שבע',
    address: 'רחוב העצמאות 321, באר שבע',
    phone: '08-1234567',
    email: 'michal.levy@arttherapy.co.il',
    languages: ['עברית', 'אנגלית'],
    sessionTypes: 'in-person',
    sessionDuration: 60,
    price: {
      min: 200,
      max: 300,
      currency: 'ILS',
    },
    availability: {
      days: ['שני', 'שלישי', 'חמישי'],
      hours: '14:00-19:00',
      emergency: false,
    },
    education: ['תואר שני בטיפול באומנות, אוניברסיטת בן גוריון'],
    certifications: ['מטפלת באומנות מוסמכת', 'מדריכת מיינדפולנס'],
    approach: 'טיפול באומנות משולב עם טכניקות מיינדפולנס ורגיעה',
    description:
      'מטפלת יצירתית המתמחה בעבודה עם ילדים ונוער. משתמשת באומנות ככלי לביטוי רגשי וריפוי.',
    verified: true,
    acceptsInsurance: false,
    slidingScale: true,
  },
  {
    id: '5',
    name: 'יוסי כהן',
    title: 'מטפל זוגי ומשפחתי',
    specialization: ['זוגות', 'משפחה', 'תקשורת', 'אינטימיות'],
    experience: 10,
    rating: 4.5,
    reviewCount: 78,
    location: 'רמת גן',
    address: 'רחוב ביאליק 654, רמת גן',
    phone: '03-9876543',
    email: 'yossi.cohen@couples.co.il',
    languages: ['עברית', 'אנגלית'],
    sessionTypes: 'online',
    sessionDuration: 90,
    price: {
      min: 350,
      max: 450,
      currency: 'ILS',
    },
    availability: {
      days: ['ראשון', 'שלישי', 'חמישי'],
      hours: '18:00-21:00',
      emergency: false,
    },
    education: ['תואר שני בטיפול משפחתי, אוניברסיטת בר אילן'],
    certifications: ['מטפל זוגי מוסמך', 'מטפל משפחתי מוסמך'],
    approach: 'טיפול זוגי ומשפחתי עם דגש על שיפור תקשורת ואינטימיות',
    description:
      'מטפל מנוסה המתמחה בעבודה עם זוגות ומשפחות. עובד בעיקר אונליין ומתמחה בפתרון קונפליקטים.',
    verified: true,
    acceptsInsurance: false,
    slidingScale: true,
  },
];

const specializations = [
  'חרדה',
  'דיכאון',
  'טראומה',
  'CBT',
  'משפחה',
  'זוגות',
  'ילדים ונוער',
  'משברי חיים',
  'הפרעות אישיות',
  'פסיכופרמקולוגיה',
  'הבעה ויצירה',
  'מיינדפולנס',
  'תקשורת',
  'אינטימיות',
];

const locations = ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'רמת גן'];

export default function TherapistPage() {
  const [currentTherapists, setCurrentTherapists] =
    useState<Therapist[]>(therapists);
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedSessionType, setSelectedSessionType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    preferredTime: '',
    insurance: false,
  });

  const filteredTherapists = currentTherapists.filter((therapist) => {
    if (
      selectedSpecialization !== 'all' &&
      !therapist.specialization.includes(selectedSpecialization)
    )
      return false;
    if (selectedLocation !== 'all' && therapist.location !== selectedLocation)
      return false;
    if (
      selectedSessionType !== 'all' &&
      therapist.sessionTypes !== selectedSessionType
    )
      return false;
    if (
      searchQuery &&
      !therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !therapist.specialization.some((spec) =>
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const handleContactSubmit = (therapistId: string) => {
    if (!contactForm.name || !contactForm.email || !contactForm.reason) return;

    // Simulate contact submission
    alert('בקשת הקשר נשלחה בהצלחה! המטפל יצור איתך קשר בקרוב.');

    // Reset form
    setContactForm({
      name: '',
      email: '',
      phone: '',
      reason: '',
      preferredTime: '',
      insurance: false,
    });
    setShowContactForm(null);
  };

  const getSessionTypeText = (type: string) => {
    switch (type) {
      case 'in-person':
        return 'פרונטלי';
      case 'online':
        return 'מקוון';
      case 'hybrid':
        return 'היברידי';
      default:
        return type;
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      case 'online':
        return <Video className="w-4 h-4" />;
      case 'hybrid':
        return <Users className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getPriceRange = (therapist: Therapist) => {
    const { min, max, currency } = therapist.price;
    if (min === max) {
      return `${min} ${currency}`;
    }
    return `${min}-${max} ${currency}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            יצירת קשר עם מטפלים מקצועיים 🧠💙
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            מצא מטפל מקצועי מתאים וקבל טיפול מותאם אישית לרווחה הנפשית שלך
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="חפש מטפלים לפי שם או התמחות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">כל ההתמחויות</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">כל המיקומים</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <select
              value={selectedSessionType}
              onChange={(e) => setSelectedSessionType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">כל סוגי הפגישות</option>
              <option value="in-person">פרונטלי</option>
              <option value="online">מקוון</option>
              <option value="hybrid">היברידי</option>
            </select>
          </div>
        </div>

        {/* Therapists List */}
        <div className="space-y-6">
          {filteredTherapists.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="py-12 text-center">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  לא נמצאו מטפלים
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  נסה לשנות את הסינון או החיפוש
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTherapists.map((therapist) => (
              <Card
                key={therapist.id}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                            {therapist.name}
                          </CardTitle>
                          {therapist.verified && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              מאומת
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {therapist.rating}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({therapist.reviewCount} ביקורות)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4" />
                          <span>{therapist.title}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock3 className="w-4 h-4" />
                          <span>{therapist.experience} שנות ניסיון</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{therapist.location}</span>
                        </div>
                      </div>

                      <CardDescription className="text-gray-600 dark:text-gray-400 text-base mb-3">
                        {therapist.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Specializations */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      התמחויות:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specialization.map((spec, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        סוג פגישה
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        {getSessionTypeIcon(therapist.sessionTypes)}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getSessionTypeText(therapist.sessionTypes)}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        משך פגישה
                      </div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {therapist.sessionDuration} דקות
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        מחיר
                      </div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {getPriceRange(therapist)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        שפות
                      </div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {therapist.languages.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      זמינות:
                    </h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {therapist.availability.days.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {therapist.availability.hours}
                        </span>
                      </div>
                      {therapist.availability.emergency && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          זמין לחירום
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Education & Certifications */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      השכלה והסמכות:
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {therapist.education.map((edu, index) => (
                        <div key={index}>• {edu}</div>
                      ))}
                      {therapist.certifications.map((cert, index) => (
                        <div key={index}>• {cert}</div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center space-x-4 text-sm">
                    {therapist.acceptsInsurance && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        <Shield className="w-3 h-3 mr-1" />
                        מקבל ביטוח
                      </Badge>
                    )}
                    {therapist.slidingScale && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <DollarSign className="w-3 h-3 mr-1" />
                        מחיר מותאם
                      </Badge>
                    )}
                  </div>

                  {/* Contact Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-4 text-sm">
                      {therapist.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {therapist.phone}
                          </span>
                        </div>
                      )}
                      {therapist.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {therapist.email}
                          </span>
                        </div>
                      )}
                      {therapist.website && (
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                          <a
                            href={therapist.website}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`tel:${therapist.phone}`, '_self')
                        }
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        התקשר
                      </Button>
                      <Button
                        onClick={() => setShowContactForm(therapist.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        צור קשר
                      </Button>
                    </div>
                  </div>

                  {/* Contact Form */}
                  {showContactForm === therapist.id && (
                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                        טופס יצירת קשר עם {therapist.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            שם מלא *
                          </label>
                          <Input
                            value={contactForm.name}
                            onChange={(e) =>
                              setContactForm((prev) => ({
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
                            value={contactForm.email}
                            onChange={(e) =>
                              setContactForm((prev) => ({
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
                            value={contactForm.phone}
                            onChange={(e) =>
                              setContactForm((prev) => ({
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
                            זמן מועדף
                          </label>
                          <Input
                            value={contactForm.preferredTime}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                preferredTime: e.target.value,
                              }))
                            }
                            placeholder="למשל: בוקר, צהריים, ערב"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          סיבת הפנייה *
                        </label>
                        <Textarea
                          value={contactForm.reason}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              reason: e.target.value,
                            }))
                          }
                          placeholder="ספר לנו על הסיבה לפנייה שלך..."
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div className="flex items-center space-x-3 mb-4">
                        <input
                          type="checkbox"
                          id={`insurance-${therapist.id}`}
                          checked={contactForm.insurance}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              insurance: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor={`insurance-${therapist.id}`}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          יש לי ביטוח בריאות פרטי
                        </label>
                      </div>

                      <div className="flex items-center justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowContactForm(null)}
                        >
                          ביטול
                        </Button>
                        <Button
                          onClick={() => handleContactSubmit(therapist.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          שלח בקשת קשר
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
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              טיפים לבחירת מטפל מתאים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  בדוק התאמה
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ודא שהמטפל מתמחה בנושאים שמעניינים אותך ויש לו ניסיון רלוונטי
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  תחושת נוחות
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  חשוב שתרגיש בנוח עם המטפל ותוכל לפתח איתו יחסי אמון
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  גישה טיפולית
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  למד על הגישה הטיפולית של המטפל ודרך העבודה שלו
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
