'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  BookOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  Edit,
  Trash2,
  Save,
  X,
  Tag,
  Clock,
  Heart,
  Star,
  Download
} from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: number;
  tags: string[];
  template?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

interface JournalTemplate {
  id: string;
  name: string;
  description: string;
  prompts: string[];
}

const journalTemplates: JournalTemplate[] = [
  {
    id: 'gratitude',
    name: 'יומן הכרת תודה',
    description: 'התמקדות בדברים החיוביים ביום',
    prompts: [
      'על מה אני מודה היום?',
      'מה היה הרגע הטוב ביותר היום?',
      'איך הרגשתי כשקרה משהו טוב?'
    ]
  },
  {
    id: 'reflection',
    name: 'רפלקציה יומית',
    description: 'חשיבה מעמיקה על האירועים והרגשות',
    prompts: [
      'מה למדתי על עצמי היום?',
      'איך התמודדתי עם אתגרים?',
      'מה הייתי עושה אחרת?'
    ]
  },
  {
    id: 'goals',
    name: 'מטרות והישגים',
    description: 'מעקב אחר התקדמות ומטרות',
    prompts: [
      'איך התקדמתי לקראת המטרות שלי?',
      'מה ההישג הקטן שלי היום?',
      'מה המטרה שלי למחר?'
    ]
  },
  {
    id: 'emotions',
    name: 'עיבוד רגשות',
    description: 'הבנה ועיבוד של רגשות מורכבים',
    prompts: [
      'איך הרגשתי היום ולמה?',
      'מה גרם לי להרגיש כך?',
      'איך אני יכול להתמודד טוב יותר עם הרגש הזה?'
    ]
  }
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'mood'>('date');
  
  // New entry form state
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 5,
    tags: [] as string[],
    template: ''
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      // Mock data for demo
      const mockEntries: JournalEntry[] = [
        {
          id: '1',
          title: 'יום מעולה בעבודה',
          content: 'היום הצלחתי לסיים פרויקט חשוב. הרגשתי מאוד מרוצה מהתוצאה...',
          mood: 8,
          tags: ['עבודה', 'הצלחה', 'גאווה'],
          template: 'reflection',
          createdAt: '2025-08-12T10:30:00Z',
          updatedAt: '2025-08-12T10:30:00Z',
          isFavorite: true
        },
        {
          id: '2',
          title: 'רגעי הכרת תודה',
          content: 'אני מודה על המשפחה שלי, על הבריאות, ועל ההזדמנויות שיש לי...',
          mood: 7,
          tags: ['הכרת תודה', 'משפחה'],
          template: 'gratitude',
          createdAt: '2025-08-11T20:15:00Z',
          updatedAt: '2025-08-11T20:15:00Z',
          isFavorite: false
        }
      ];
      
      setEntries(mockEntries);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  }; 
 const handleSaveEntry = async () => {
    try {
      const entry: JournalEntry = {
        id: editingEntry?.id || Date.now().toString(),
        title: newEntry.title || 'רשומה ללא כותרת',
        content: newEntry.content,
        mood: newEntry.mood,
        tags: newEntry.tags,
        template: newEntry.template,
        createdAt: editingEntry?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: editingEntry?.isFavorite || false
      };

      if (editingEntry) {
        setEntries(prev => prev.map(e => e.id === editingEntry.id ? entry : e));
      } else {
        setEntries(prev => [entry, ...prev]);
      }

      // Reset form
      setNewEntry({ title: '', content: '', mood: 5, tags: [], template: '' });
      setIsWriting(false);
      setEditingEntry(null);
      setSelectedTemplate('');
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || 5,
      tags: entry.tags,
      template: entry.template || ''
    });
    setIsWriting(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק רשומה זו?')) {
      setEntries(prev => prev.filter(e => e.id !== entryId));
    }
  };

  const handleToggleFavorite = (entryId: string) => {
    setEntries(prev => prev.map(e => 
      e.id === entryId ? { ...e, isFavorite: !e.isFavorite } : e
    ));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = journalTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setNewEntry(prev => ({
        ...prev,
        template: templateId,
        content: template.prompts.map(prompt => `**${prompt}**\n\n`).join('\n')
      }));
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !newEntry.tags.includes(tag)) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = !searchTerm || 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTag = !filterTag || entry.tags.includes(filterTag);
      
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'mood':
          return (b.mood || 0) - (a.mood || 0);
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              יומן אישי
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              כתיבה טיפולית ורפלקציה אישית
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setIsWriting(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              רשומה חדשה
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              ייצוא יומן
            </Button>
          </div>
        </div>   
     {/* Writing Interface */}
        {isWriting && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{editingEntry ? 'עריכת רשומה' : 'רשומה חדשה'}</span>
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setIsWriting(false);
                    setEditingEntry(null);
                    setNewEntry({ title: '', content: '', mood: 5, tags: [], template: '' });
                    setSelectedTemplate('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              {!editingEntry && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    בחר תבנית (אופציונלי)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {journalTemplates.map(template => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{template.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">כותרת</label>
                <Input
                  placeholder="כותרת הרשומה..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">תוכן</label>
                <Textarea
                  placeholder="כתוב את המחשבות שלך..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 resize-none"
                />
              </div>

              {/* Mood and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mood */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    מצב רוח ({newEntry.mood}/10) {getMoodEmoji(newEntry.mood)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, mood: Number(e.target.value) }))}
                    className="slider w-full"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">תגיות</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newEntry.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="הוסף תגית..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsWriting(false);
                    setEditingEntry(null);
                    setNewEntry({ title: '', content: '', mood: 5, tags: [], template: '' });
                    setSelectedTemplate('');
                  }}
                >
                  ביטול
                </Button>
                <Button 
                  onClick={handleSaveEntry}
                  disabled={!newEntry.content.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingEntry ? 'עדכן' : 'שמור'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}      
  {/* Search and Filters */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="חיפוש ברשומות..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="תגית" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל התגיות</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: 'date' | 'title' | 'mood') => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">תאריך</SelectItem>
                    <SelectItem value="title">כותרת</SelectItem>
                    <SelectItem value="mood">מצב רוח</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>הרשומות שלי ({filteredEntries.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">אין רשומות יומן</p>
                <p className="text-sm">התחל לכתוב כדי לתעד את המחשבות והרגשות שלך</p>
                <Button 
                  onClick={() => setIsWriting(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  כתוב רשומה ראשונה
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {entry.title}
                          </h3>
                          {entry.isFavorite && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          {entry.mood && (
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">{getMoodEmoji(entry.mood)}</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{entry.mood}/10</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                          {entry.content.substring(0, 200)}...
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(entry.updatedAt).toLocaleDateString('he-IL')}</span>
                          </div>
                          {entry.template && (
                            <Badge variant="outline" className="text-xs">
                              {journalTemplates.find(t => t.id === entry.template)?.name}
                            </Badge>
                          )}
                        </div>
                        
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFavorite(entry.id)}
                          className={entry.isFavorite ? 'text-yellow-500' : 'text-gray-400'}
                        >
                          <Star className={`w-4 h-4 ${entry.isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEntry(entry)}
                          className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Writing Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">סה"כ רשומות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{entries.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">רשומות השבוע</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">מועדפות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {entries.filter(e => e.isFavorite).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">תגיות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{allTags.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}