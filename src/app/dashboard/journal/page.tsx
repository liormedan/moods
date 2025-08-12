'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search, Calendar, Heart, Star } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: number;
  date: string;
  tags: string[];
}

export default function JournalPage() {
  const [entries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'יום טוב בעבודה',
      content: 'היום היה יום מעולה בעבודה. הצלחתי לסיים את הפרויקט שעבדתי עליו השבוע והקבלתי משוב חיובי מהמנהל. מרגיש מאוד מרוצה ומוטיבציה להמשיך.',
      mood: 8,
      date: '2024-01-15',
      tags: ['עבודה', 'הצלחה', 'מוטיבציה']
    },
    {
      id: '2',
      title: 'רגעי שקט',
      content: 'בילתי את הבוקר בפארק, קראתי ספר ושתיתי קפה. לפעמים הרגעים הפשוטים הם הכי יפים. הרגשתי רגוע ומחובר לעצמי.',
      mood: 7,
      date: '2024-01-14',
      tags: ['שקט', 'טבע', 'קריאה']
    },
    {
      id: '3',
      title: 'אתגרים חדשים',
      content: 'התחלתי ללמוד משהו חדש היום. זה מאתגר אבל מרגש. יש לי הרגשה טובה לגבי המסע הזה.',
      mood: 6,
      date: '2024-01-13',
      tags: ['למידה', 'אתגר', 'צמיחה']
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 5
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-green-600 bg-green-50';
    if (mood >= 6) return 'text-blue-600 bg-blue-50';
    if (mood >= 4) return 'text-yellow-600 bg-yellow-50';
    if (mood >= 2) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            יומן אישי
          </h1>
          <p className="text-gray-600">
            כתבו על החוויות, הרגשות והמחשבות שלכם
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Entry Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  רשומה חדשה
                </CardTitle>
                <CardDescription>
                  שתפו את המחשבות והרגשות שלכם
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    כותרת
                  </label>
                  <Input
                    placeholder="כותרת לרשומה..."
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    מצב רוח (1-10)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newEntry.mood}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-2xl">{getMoodEmoji(newEntry.mood)}</span>
                    <span className="text-sm font-medium w-8">{newEntry.mood}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    תוכן
                  </label>
                  <Textarea
                    placeholder="מה קרה היום? איך אתם מרגישים?"
                    rows={6}
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  שמור רשומה
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Entries List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="חפש ברשומות..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Entries */}
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{entry.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(entry.date).toLocaleDateString('he-IL')}
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getMoodColor(entry.mood)}`}>
                            <Heart className="w-4 h-4" />
                            <span>{entry.mood}/10</span>
                            <span>{getMoodEmoji(entry.mood)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {entry.content}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'לא נמצאו רשומות' : 'אין רשומות עדיין'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? 'נסו לחפש במילים אחרות'
                      : 'התחילו לכתוב את הרשומה הראשונה שלכם'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Writing Tips */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                טיפים לכתיבה טיפולית
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">כתבו בכנות</h4>
                  <p className="text-sm text-gray-600">
                    אל תחששו לבטא את הרגשות האמיתיים שלכם
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">כתבו בקביעות</h4>
                  <p className="text-sm text-gray-600">
                    כתיבה יומית עוזרת לעבד רגשות ומחשבות
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">חפשו דפוסים</h4>
                  <p className="text-sm text-gray-600">
                    קראו רשומות ישנות כדי לזהות דפוסים
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}