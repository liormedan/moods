'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { MoodEntry } from '@/components/mood';
import {
  Calendar,
  Download,
  Edit3,
  Trash2,
  Search,
  Filter,
  Plus,
  Heart,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface MoodRecord {
  id: string;
  date: string;
  moodValue: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MoodEntryPage() {
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [editingRecord, setEditingRecord] = useState<MoodRecord | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchMoodRecords();
  }, []);

  const fetchMoodRecords = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo
      const mockRecords: MoodRecord[] = [
        {
          id: '1',
          date: '2025-08-12',
          moodValue: 7,
          notes: 'יום טוב! פגישה מוצלחת בעבודה והרגשתי מאוד מרוצה.',
          createdAt: '2025-08-12T10:30:00Z',
          updatedAt: '2025-08-12T10:30:00Z'
        },
        {
          id: '2',
          date: '2025-08-11',
          moodValue: 5,
          notes: 'יום רגיל, קצת עייפות אבל בסדר.',
          createdAt: '2025-08-11T20:15:00Z',
          updatedAt: '2025-08-11T20:15:00Z'
        },
        {
          id: '3',
          date: '2025-08-10',
          moodValue: 8,
          notes: 'יום מעולה! בילוי עם חברים והרגשתי מאוד שמח.',
          createdAt: '2025-08-10T19:45:00Z',
          updatedAt: '2025-08-10T19:45:00Z'
        },
        {
          id: '4',
          date: '2025-08-09',
          moodValue: 4,
          notes: 'יום קשה, הרבה לחץ בעבודה.',
          createdAt: '2025-08-09T22:00:00Z',
          updatedAt: '2025-08-09T22:00:00Z'
        },
        {
          id: '5',
          date: '2025-08-08',
          moodValue: 6,
          notes: 'יום בסדר, אימון ספורט עזר לשפר את מצב הרוח.',
          createdAt: '2025-08-08T18:30:00Z',
          updatedAt: '2025-08-08T18:30:00Z'
        }
      ];
      
      setRecords(mockRecords);
    } catch (error) {
      console.error('Error fetching mood records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodAdded = () => {
    fetchMoodRecords();
    setShowAddForm(false);
  };

  const handleEditRecord = (record: MoodRecord) => {
    setEditingRecord(record);
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק רשומה זו?')) {
      setRecords(prev => prev.filter(r => r.id !== recordId));
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['תאריך', 'מצב רוח', 'הערות', 'נוצר בתאריך'],
      ...records.map(record => [
        record.date,
        record.moodValue.toString(),
        record.notes || '',
        format(new Date(record.createdAt), 'dd/MM/yyyy HH:mm', { locale: he })
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mood-records-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const getMoodEmoji = (value: number) => {
    if (value >= 8) return '😊';
    if (value >= 6) return '🙂';
    if (value >= 4) return '😐';
    if (value >= 2) return '😔';
    return '😢';
  };

  const getMoodColor = (value: number) => {
    if (value >= 8) return 'text-green-600 dark:text-green-400';
    if (value >= 6) return 'text-blue-600 dark:text-blue-400';
    if (value >= 4) return 'text-yellow-600 dark:text-yellow-400';
    if (value >= 2) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMoodBgColor = (value: number) => {
    if (value >= 8) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (value >= 6) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    if (value >= 4) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    if (value >= 2) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchTerm || 
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm);
    
    const recordDate = new Date(record.date);
    const now = new Date();
    
    let matchesPeriod = true;
    if (filterPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesPeriod = recordDate >= weekAgo;
    } else if (filterPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesPeriod = recordDate >= monthAgo;
    }
    
    return matchesSearch && matchesPeriod;
  });

  const averageMood = filteredRecords.length > 0 
    ? filteredRecords.reduce((sum, record) => sum + record.moodValue, 0) / filteredRecords.length
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-600" />
              תיעוד מצב רוח
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              נהל ועקוב אחר מצב הרוח שלך לאורך זמן
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              הוסף רשומה
            </Button>
            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={records.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              ייצא נתונים
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                סה"כ רשומות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {filteredRecords.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                מצב רוח ממוצע
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center gap-2 ${getMoodColor(averageMood)}`}>
                {averageMood.toFixed(1)}
                <span className="text-xl">{getMoodEmoji(averageMood)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                רשומה אחרונה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {records.length > 0 
                  ? format(new Date(records[0].date), 'dd/MM/yyyy', { locale: he })
                  : 'אין רשומות'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingRecord) && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingRecord ? 'עריכת רשומה' : 'הוספת רשומה חדשה'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MoodEntry
                initialData={editingRecord ? {
                  moodValue: editingRecord.moodValue,
                  notes: editingRecord.notes,
                  date: editingRecord.date
                } : undefined}
                isEditing={!!editingRecord}
                onSuccess={() => {
                  handleMoodAdded();
                  setEditingRecord(null);
                }}
                onError={(error) => console.error('Error saving mood entry:', error)}
              />
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingRecord(null);
                  }}
                >
                  ביטול
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">סינון וחיפוש</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">חיפוש</label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="search"
                    type="text"
                    placeholder="חפש בהערות או תאריך..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="period" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">תקופה</label>
                <select
                  id="period"
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">כל התקופות</option>
                  <option value="week">שבוע אחרון</option>
                  <option value="month">חודש אחרון</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>היסטוריית רשומות</span>
              <Badge variant="secondary">
                {filteredRecords.length} רשומות
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">טוען רשומות...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || filterPeriod !== 'all' 
                    ? 'לא נמצאו רשומות התואמות לחיפוש'
                    : 'עדיין לא הוספת רשומות מצב רוח'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getMoodBgColor(record.moodValue)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getMoodEmoji(record.moodValue)}</span>
                          <div>
                            <div className={`text-lg font-bold ${getMoodColor(record.moodValue)}`}>
                              {record.moodValue}/10
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {format(new Date(record.date), 'EEEE, dd MMMM yyyy', { locale: he })}
                            </div>
                          </div>
                        </div>
                        
                        {record.notes && (
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-md p-3 mt-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {record.notes}
                            </p>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          נוצר: {format(new Date(record.createdAt), 'dd/MM/yyyy HH:mm', { locale: he })}
                          {record.updatedAt !== record.createdAt && (
                            <span className="mr-4">
                              עודכן: {format(new Date(record.updatedAt), 'dd/MM/yyyy HH:mm', { locale: he })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mr-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRecord(record)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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
      </div>
    </DashboardLayout>
  );
}