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
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Shield,
  Zap,
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
  views?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all';
}

const categories = [
  {
    id: 'all',
    name: 'כל הקטגוריות',
    icon: HelpCircle,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  },
  {
    id: 'anxiety',
    name: 'חרדה',
    icon: Brain,
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  },
  {
    id: 'depression',
    name: 'דיכאון',
    icon: Heart,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    id: 'general',
    name: 'כללי',
    icon: HelpCircle,
    color:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  },
  {
    id: 'crisis',
    name: 'משבר',
    icon: AlertCircle,
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  },
  {
    id: 'self-help',
    name: 'עזרה עצמית',
    icon: Lightbulb,
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  {
    id: 'professional',
    name: 'מקצועי',
    icon: Users,
    color:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
  },
  {
    id: 'family',
    name: 'משפחה',
    icon: Users,
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
  },
  {
    id: 'youth',
    name: 'נוער',
    icon: Zap,
    color:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  },
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
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [sortBy, setSortBy] = useState<
    'featured' | 'rating' | 'views' | 'recent'
  >('featured');

  useEffect(() => {
    // Load bookmarked resources from localStorage
    const saved = localStorage.getItem('bookmarked-resources');
    if (saved) {
      setBookmarkedResources(JSON.parse(saved));
    }
    loadResources();
  }, []);

  useEffect(() => {
    loadResources();
  }, [
    selectedCategory,
    selectedType,
    selectedLanguage,
    showFreeOnly,
    searchQuery,
  ]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory !== 'all')
        params.append('category', selectedCategory);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedLanguage !== 'all')
        params.append('language', selectedLanguage);
      if (showFreeOnly) params.append('isFree', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/resources?${params}`);
      if (response.ok) {
        const result = await response.json();
        setResources(result.data || []);
        setStats(result.stats);
      } else {
        console.error('Failed to load resources');
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort resources based on selected criteria
  const sortedResources = [...resources].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'recent':
        return (
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      case 'featured':
      default:
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.views || 0) - (a.views || 0);
    }
  });

  const exportResources = () => {
    const csvContent = [
      [
        'כותרת',
        'תיאור',
        'סוג',
        'קטגוריה',
        'שפה',
        'חינמי',
        'דירוג',
        'צפיות',
        'מחבר',
      ].join(','),
      ...resources.map((resource) =>
        [
          `"${resource.title}"`,
          `"${resource.description}"`,
          getTypeText(resource.type),
          getCategoryName(resource.category),
          getLanguageText(resource.language),
          resource.isFree ? 'כן' : 'לא',
          resource.rating || 'לא דורג',
          resource.views || 0,
          `"${resource.author || 'לא צוין'}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `משאבי_עזרה_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

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

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat
      ? cat.color
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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

  const featuredResources = sortedResources.filter((r) => r.featured);
  const regularResources = sortedResources.filter((r) => !r.featured);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            משאבי עזרה ומידע 📚
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            אוסף מקיף של משאבים, כלים ומידע שיעזרו לך לשפר את הרווחה הנפשית
          </p>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.total}
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      סה"כ משאבים
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.freeResources}
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      משאבים חינמיים
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-green-500 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.featuredResources}
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      משאבים מומלצים
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {bookmarkedResources.length}
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      משאבים שמורים
                    </p>
                  </div>
                  <Bookmark className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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

          {/* Filters and Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="featured">מומלצים</option>
                <option value="rating">דירוג</option>
                <option value="views">צפיות</option>
                <option value="recent">עדכון אחרון</option>
              </select>

              <Button
                onClick={exportResources}
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                <Download className="w-4 h-4 mr-2" />
                ייצא
              </Button>
            </div>
          </div>
        </div>

        {/* Emergency Resources */}
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-300 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              משאבי חירום - זמינים 24/7
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    ער"ן - קו חירום
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    1201 - חינמי
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    נטל - קו נוער
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    1800-250-250
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <MessageCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    צ'אט חירום
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    sahar.org.il
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              משאבים מומלצים ({featuredResources.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow"
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
                        <Badge className={getCategoryColor(resource.category)}>
                          {getCategoryName(resource.category)}
                        </Badge>
                      </div>
                      <Badge
                        className={
                          resource.isFree
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
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

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResourceClick(resource)}
                        className="bg-white dark:bg-gray-800"
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              כל המשאבים ({regularResources.length})
            </h3>
            {bookmarkedResources.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const bookmarked = resources.filter((r) =>
                    bookmarkedResources.includes(r.id)
                  );
                  if (bookmarked.length > 0) {
                    setResources(bookmarked);
                  }
                }}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                הצג שמורים ({bookmarkedResources.length})
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                טוען משאבים...
              </p>
            </div>
          ) : regularResources.length === 0 ? (
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
                        <Badge className={getCategoryColor(resource.category)}>
                          {getCategoryName(resource.category)}
                        </Badge>
                      </div>
                      <Badge
                        className={
                          resource.isFree
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
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
                        {resource.views && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {resource.views.toLocaleString()} צפיות
                          </div>
                        )}
                      </div>

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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Tips and Guidelines */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              טיפים לשימוש במשאבים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      התחל בהדרגה
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      בחר משאב אחד או שניים להתחלה, אל תנסה לעשות הכל בבת אחת
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      שמור מה שעובד
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      השתמש בכפתור הסימניות כדי לשמור משאבים שמועילים לך
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      פנה לעזרה מקצועית
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      משאבים אלה אינם תחליף לטיפול מקצועי במקרה הצורך
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      שתף עם אחרים
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      משאבים מועילים יכולים לעזור גם לחברים ובני משפחה
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
