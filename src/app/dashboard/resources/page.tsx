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
import {
  HelpCircle,
  BookOpen,
  Video,
  Phone,
  Globe,
  Download,
  ExternalLink,
  Search,
  Filter,
  Heart,
  Brain,
  Activity,
  Users,
  Clock,
  Star,
  Bookmark,
  Share2,
  Play,
  FileText,
  Headphones,
  Calendar,
  MapPin,
  Mail,
  MessageCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Resource {
  id: string;
  title: string;
  description: string;
  type:
    | 'article'
    | 'video'
    | 'podcast'
    | 'book'
    | 'tool'
    | 'app'
    | 'contact'
    | 'event';
  category:
    | 'anxiety'
    | 'depression'
    | 'general'
    | 'crisis'
    | 'self-help'
    | 'professional'
    | 'family'
    | 'youth';
  url?: string;
  fileUrl?: string;
  author?: string;
  duration?: string;
  rating?: number;
  tags: string[];
  isFree: boolean;
  language: 'hebrew' | 'english' | 'arabic' | 'russian';
  lastUpdated: string;
  featured: boolean;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'מדריך להתמודדות עם חרדה יומיומית',
    description:
      'מדריך מקיף עם טכניקות מעשיות להתמודדות עם חרדה, כולל תרגילי נשימה, מדיטציה וכלים קוגניטיביים.',
    type: 'article',
    category: 'anxiety',
    url: 'https://example.com/anxiety-guide',
    author: 'ד"ר יעל כהן',
    tags: ['חרדה', 'טכניקות התמודדות', 'תרגילי נשימה', 'מדיטציה'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-08-01',
    featured: true,
  },
  {
    id: '2',
    title: 'סדרת וידאו: יסודות המיינדפולנס',
    description:
      'סדרה של 10 סרטונים קצרים המסבירים ומלמדים את יסודות המיינדפולנס למתחילים.',
    type: 'video',
    category: 'general',
    url: 'https://youtube.com/playlist?list=123',
    duration: '2 שעות',
    tags: ['מיינדפולנס', 'מדיטציה', 'הרגעה', 'מתחילים'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-07-15',
    featured: true,
  },
  {
    id: '3',
    title: 'פודקאסט: בריאות הנפש בישראל',
    description:
      'פודקאסט שבועי העוסק בנושאי בריאות הנפש, עם אורחים מומחים ודיונים על נושאים אקטואליים.',
    type: 'podcast',
    category: 'general',
    url: 'https://spotify.com/show/mental-health-israel',
    duration: '45 דקות',
    tags: ['בריאות נפש', 'ישראל', 'מומחים', 'שבועי'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-08-10',
    featured: false,
  },
  {
    id: '4',
    title: 'אפליקציית מדיטציה מונחית',
    description:
      'אפליקציה עם עשרות מדיטציות מונחות בעברית, מתאימה למתחילים ומתקדמים.',
    type: 'app',
    category: 'general',
    url: 'https://play.google.com/store/apps/details?id=meditation.he',
    tags: ['מדיטציה', 'אפליקציה', 'מונחה', 'עברית'],
    isFree: false,
    language: 'hebrew',
    lastUpdated: '2025-06-20',
    featured: false,
  },
  {
    id: '5',
    title: 'קו חירום לבריאות הנפש',
    description:
      'קו חירום 24/7 המספק תמיכה מיידית במצבי משבר נפשי. צוות מקצועי זמין בכל שעה.',
    type: 'contact',
    category: 'crisis',
    url: 'tel:1201',
    tags: ['חירום', 'משבר', 'תמיכה מיידית', '24/7'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-01-01',
    featured: true,
  },
  {
    id: '6',
    title: 'ספר: "הדרך לרווחה נפשית"',
    description:
      'ספר מקיף המשלב תיאוריה מערבית עם חכמה מזרחית, כולל תרגילים מעשיים לשיפור הרווחה הנפשית.',
    type: 'book',
    category: 'self-help',
    url: 'https://example.com/book',
    author: "פרופ' דוד לוי",
    tags: ['ספר', 'רווחה נפשית', 'תרגילים', 'תיאוריה'],
    isFree: false,
    language: 'hebrew',
    lastUpdated: '2025-05-10',
    featured: false,
  },
  {
    id: '7',
    title: 'כלי מעקב מצב רוח דיגיטלי',
    description:
      'כלי אינטראקטיבי למעקב אחרי מצב הרוח, זיהוי דפוסים והמלצות מותאמות אישית.',
    type: 'tool',
    category: 'self-help',
    url: 'https://example.com/mood-tracker',
    tags: ['מעקב מצב רוח', 'דפוסים', 'המלצות', 'אינטראקטיבי'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-07-30',
    featured: false,
  },
  {
    id: '8',
    title: 'סדנה: התמודדות עם לחץ בעבודה',
    description:
      'סדנה מעשית בת 3 שעות על טכניקות להתמודדות עם לחץ בעבודה ושיפור האיזון בין עבודה לחיים.',
    type: 'event',
    category: 'professional',
    url: 'https://example.com/workshop',
    duration: '3 שעות',
    tags: ['סדנה', 'לחץ בעבודה', 'איזון', 'טכניקות'],
    isFree: false,
    language: 'hebrew',
    lastUpdated: '2025-08-05',
    featured: true,
  },
];

const categories = [
  { id: 'all', name: 'כל הקטגוריות', icon: HelpCircle },
  { id: 'anxiety', name: 'חרדה', icon: Brain },
  { id: 'depression', name: 'דיכאון', icon: Heart },
  { id: 'general', name: 'כללי', icon: HelpCircle },
  { id: 'crisis', name: 'משבר', icon: Activity },
  { id: 'self-help', name: 'עזרה עצמית', icon: BookOpen },
  { id: 'professional', name: 'מקצועי', icon: Users },
  { id: 'family', name: 'משפחה', icon: Users },
  { id: 'youth', name: 'נוער', icon: Users },
];

const types = [
  { id: 'all', name: 'כל הסוגים', icon: HelpCircle },
  { id: 'article', name: 'מאמרים', icon: FileText },
  { id: 'video', name: 'וידאו', icon: Video },
  { id: 'podcast', name: 'פודקאסט', icon: Headphones },
  { id: 'book', name: 'ספרים', icon: BookOpen },
  { id: 'tool', name: 'כלים', icon: Download },
  { id: 'app', name: 'אפליקציות', icon: Globe },
  { id: 'contact', name: 'אנשי קשר', icon: Phone },
  { id: 'event', name: 'אירועים', icon: Calendar },
];

export default function ResourcesPage() {
  const [currentResources, setCurrentResources] =
    useState<Resource[]>(resources);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);

  useEffect(() => {
    // Load bookmarked resources from localStorage
    const saved = localStorage.getItem('bookmarked-resources');
    if (saved) {
      setBookmarkedResources(JSON.parse(saved));
    }
  }, []);

  const filteredResources = currentResources.filter((resource) => {
    if (selectedCategory !== 'all' && resource.category !== selectedCategory)
      return false;
    if (selectedType !== 'all' && resource.type !== selectedType) return false;
    if (selectedLanguage !== 'all' && resource.language !== selectedLanguage)
      return false;
    if (showFreeOnly && !resource.isFree) return false;
    if (
      searchQuery &&
      !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !resource.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const toggleBookmark = (resourceId: string) => {
    const newBookmarks = bookmarkedResources.includes(resourceId)
      ? bookmarkedResources.filter((id) => id !== resourceId)
      : [...bookmarkedResources, resourceId];

    setBookmarkedResources(newBookmarks);
    localStorage.setItem('bookmarked-resources', JSON.stringify(newBookmarks));
  };

  const getTypeIcon = (type: string) => {
    const typeInfo = types.find((t) => t.id === type);
    return typeInfo ? (
      <typeInfo.icon className="w-4 h-4" />
    ) : (
      <HelpCircle className="w-4 h-4" />
    );
  };

  const getTypeText = (type: string) => {
    const typeInfo = types.find((t) => t.id === type);
    return typeInfo ? typeInfo.name : type;
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? (
      <cat.icon className="w-4 h-4" />
    ) : (
      <HelpCircle className="w-4 h-4" />
    );
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.name : category;
  };

  const getLanguageText = (language: string) => {
    switch (language) {
      case 'hebrew':
        return 'עברית';
      case 'english':
        return 'אנגלית';
      case 'arabic':
        return 'ערבית';
      case 'russian':
        return 'רוסית';
      default:
        return language;
    }
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.url) {
      if (resource.type === 'contact' && resource.url.startsWith('tel:')) {
        // Handle phone call
        window.location.href = resource.url;
      } else if (resource.url.startsWith('http')) {
        // Open external link
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const featuredResources = filteredResources.filter((r) => r.featured);
  const regularResources = filteredResources.filter((r) => !r.featured);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            משאבי עזרה ומידע 📚💡
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            אוסף מקיף של משאבים, כלים ומידע שיעזרו לך לשפר את הרווחה הנפשית
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="חפש משאבים, כלים ומידע..."
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
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">כל השפות</option>
              <option value="hebrew">עברית</option>
              <option value="english">אנגלית</option>
              <option value="arabic">ערבית</option>
              <option value="russian">רוסית</option>
            </select>

            <button
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                showFreeOnly
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{showFreeOnly ? 'רק חינמי' : 'כל המשאבים'}</span>
            </button>
          </div>
        </div>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              משאבים מומלצים ⭐
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(resource.type)}
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        >
                          מומלץ
                        </Badge>
                      </div>
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                      >
                        {bookmarkedResources.includes(resource.id) ? (
                          <Bookmark className="w-5 h-5 fill-current text-yellow-500" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(resource.category)}
                        <span className="text-gray-600 dark:text-gray-400">
                          {getCategoryName(resource.category)}
                        </span>
                      </div>
                      <Badge
                        className={
                          resource.isFree
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }
                      >
                        {resource.isFree ? 'חינמי' : 'בתשלום'}
                      </Badge>
                    </div>

                    {resource.author && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        מאת: {resource.author}
                      </div>
                    )}

                    {resource.duration && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{resource.duration}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {getLanguageText(resource.language)}
                        </Badge>
                        {resource.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {resource.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResourceClick(resource)}
                        >
                          {resource.type === 'contact' ? (
                            <Phone className="w-4 h-4 mr-1" />
                          ) : resource.type === 'video' ? (
                            <Play className="w-4 h-4 mr-1" />
                          ) : (
                            <ExternalLink className="w-4 h-4 mr-1" />
                          )}
                          {resource.type === 'contact'
                            ? 'צור קשר'
                            : resource.type === 'video'
                              ? 'צפה'
                              : 'פתח'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            כל המשאבים ({regularResources.length})
          </h3>

          {regularResources.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="py-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  לא נמצאו משאבים
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  נסה לשנות את הסינון או החיפוש
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(resource.type)}
                        <Badge variant="outline">
                          {getTypeText(resource.type)}
                        </Badge>
                      </div>
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        {bookmarkedResources.includes(resource.id) ? (
                          <Bookmark className="w-5 h-5 fill-current text-blue-500" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(resource.category)}
                        <span className="text-gray-600 dark:text-gray-400">
                          {getCategoryName(resource.category)}
                        </span>
                      </div>
                      <Badge
                        className={
                          resource.isFree
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }
                      >
                        {resource.isFree ? 'חינמי' : 'בתשלום'}
                      </Badge>
                    </div>

                    {resource.author && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        מאת: {resource.author}
                      </div>
                    )}

                    {resource.duration && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{resource.duration}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {getLanguageText(resource.language)}
                        </Badge>
                        {resource.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {resource.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResourceClick(resource)}
                        >
                          {resource.type === 'contact' ? (
                            <Phone className="w-4 h-4 mr-1" />
                          ) : resource.type === 'video' ? (
                            <Play className="w-4 h-4 mr-1" />
                          ) : (
                            <ExternalLink className="w-4 h-4 mr-1" />
                          )}
                          {resource.type === 'contact'
                            ? 'צור קשר'
                            : resource.type === 'video'
                              ? 'צפה'
                              : 'פתח'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Access Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              גישה מהירה למשאבים חשובים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-20 flex-col space-y-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => window.open('tel:1201', '_self')}
              >
                <Phone className="w-6 h-6 text-red-600" />
                <span className="text-sm">קו חירום</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-20 flex-col space-y-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => window.open('https://www.eran.org.il', '_blank')}
              >
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <span className="text-sm">ער"ן</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-20 flex-col space-y-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() =>
                  window.open('https://www.health.gov.il', '_blank')
                }
              >
                <Globe className="w-6 h-6 text-green-600" />
                <span className="text-sm">משרד הבריאות</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-20 flex-col space-y-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() =>
                  window.open('https://www.mentalhealth.org.il', '_blank')
                }
              >
                <Heart className="w-6 h-6 text-purple-600" />
                <span className="text-sm">בריאות הנפש</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              טיפים לשימוש במשאבים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bookmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  שמור משאבים
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  שמור משאבים מעניינים לשימוש עתידי עם כפתור הסימניה
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Filter className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  השתמש בסינון
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  השתמש בסינון כדי למצוא משאבים רלוונטיים לך
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  שתף עם אחרים
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  שתף משאבים מועילים עם חברים ומשפחה
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
