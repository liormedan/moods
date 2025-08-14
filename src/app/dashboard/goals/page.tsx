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
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Award,
  Lightbulb,
  Activity,
  Heart,
  Brain,
  Users,
  Download,
  Search,
  Filter,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  X,
  Save,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Goal {
  id: string;
  title: string;
  description: string;
  category:
    | 'mental-health'
    | 'physical'
    | 'social'
    | 'personal'
    | 'professional';
  targetDate: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  milestones: Milestone[];
  createdAt: string;
  completedAt?: string;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

const goalCategories = [
  {
    id: 'mental-health',
    name: 'בריאות נפשית',
    icon: Brain,
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  },
  {
    id: 'physical',
    name: 'פיזי',
    icon: Activity,
    color:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  },
  {
    id: 'social',
    name: 'חברתי',
    icon: Users,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    id: 'personal',
    name: 'אישי',
    icon: Heart,
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
  },
  {
    id: 'professional',
    name: 'מקצועי',
    icon: Target,
    color:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  },
];

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  medium:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

const statusColors = {
  'not-started':
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  'in-progress':
    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  completed:
    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'mental-health' as Goal['category'],
    targetDate: '',
    priority: 'medium' as Goal['priority'],
    milestones: [] as Milestone[],
  });
  const [newMilestone, setNewMilestone] = useState('');

  useEffect(() => {
    loadGoals();
  }, [selectedCategory, selectedStatus]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all')
        params.append('category', selectedCategory);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const response = await fetch(`/api/goals?${params}`);
      if (response.ok) {
        const result = await response.json();
        setGoals(result.data || []);
      } else {
        console.error('Failed to load goals');
        // Fallback to localStorage for demo
        const saved = localStorage.getItem('goals');
        if (saved) {
          setGoals(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error('Error loading goals:', error);
      // Fallback to localStorage for demo
      const saved = localStorage.getItem('goals');
      if (saved) {
        setGoals(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async () => {
    if (!newGoal.title || !newGoal.targetDate) return;

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal),
      });

      if (response.ok) {
        const result = await response.json();
        setGoals((prev) => [...prev, result.data]);

        // Reset form
        setNewGoal({
          title: '',
          description: '',
          category: 'mental-health',
          targetDate: '',
          priority: 'medium',
          milestones: [],
        });
        setShowAddForm(false);
      } else {
        console.error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (response.ok) {
        const result = await response.json();
        setGoals((prev) =>
          prev.map((goal) => (goal.id === id ? result.data : goal))
        );
        setEditingGoal(null);
      } else {
        console.error('Failed to update goal');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המטרה?')) return;

    try {
      const response = await fetch(`/api/goals?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGoals((prev) => prev.filter((goal) => goal.id !== id));
      } else {
        console.error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const toggleMilestone = async (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map((milestone) =>
      milestone.id === milestoneId
        ? { ...milestone, completed: !milestone.completed }
        : milestone
    );

    await updateGoal(goalId, { milestones: updatedMilestones });
  };

  const addMilestone = async (goalId: string, title: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const milestone: Milestone = {
      id: Date.now().toString(),
      title,
      completed: false,
    };

    const updatedMilestones = [...goal.milestones, milestone];
    await updateGoal(goalId, { milestones: updatedMilestones });
  };

  const exportGoals = () => {
    const csvContent = [
      [
        'כותרת',
        'תיאור',
        'קטגוריה',
        'סטטוס',
        'עדיפות',
        'התקדמות',
        'תאריך יעד',
        'תאריך יצירה',
        'תאריך השלמה',
      ].join(','),
      ...goals.map((goal) =>
        [
          `"${goal.title}"`,
          `"${goal.description}"`,
          getCategoryName(goal.category),
          getStatusText(goal.status),
          getPriorityText(goal.priority),
          `${goal.progress}%`,
          new Date(goal.targetDate).toLocaleDateString('he-IL'),
          new Date(goal.createdAt).toLocaleDateString('he-IL'),
          goal.completedAt
            ? new Date(goal.completedAt).toLocaleDateString('he-IL')
            : '',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `מטרות_אישיות_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'לא התחיל';
      case 'in-progress':
        return 'בתהליך';
      case 'completed':
        return 'הושלם';
      case 'overdue':
        return 'עבר זמנו';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'נמוך';
      case 'medium':
        return 'בינוני';
      case 'high':
        return 'גבוה';
      default:
        return priority;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = goalCategories.find((c) => c.id === category);
    return cat ? (
      <cat.icon className="w-4 h-4" />
    ) : (
      <Target className="w-4 h-4" />
    );
  };

  const getCategoryName = (category: string) => {
    const cat = goalCategories.find((c) => c.id === category);
    return cat ? cat.name : category;
  };

  const filteredGoals = goals.filter((goal) => {
    if (selectedCategory !== 'all' && goal.category !== selectedCategory)
      return false;
    if (selectedStatus !== 'all' && goal.status !== selectedStatus)
      return false;
    if (
      searchTerm &&
      !goal.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const completedGoals = goals.filter(
    (goal) => goal.status === 'completed'
  ).length;
  const inProgressGoals = goals.filter(
    (goal) => goal.status === 'in-progress'
  ).length;
  const overdueGoals = goals.filter((goal) => goal.status === 'overdue').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            מטרות אישיות 🎯
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            הגדר מטרות אישיות ועקוב אחרי ההתקדמות שלך
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {goals.length}
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    סה"כ מטרות
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {completedGoals}
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    הושלמו (
                    {goals.length > 0
                      ? Math.round((completedGoals / goals.length) * 100)
                      : 0}
                    %)
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {inProgressGoals}
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    בתהליך
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {overdueGoals}
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    עבר זמנן
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        {goals.length > 0 && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                סטטיסטיקות מתקדמות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {Math.round(
                      goals.reduce((sum, goal) => sum + goal.progress, 0) /
                        goals.length
                    )}
                    %
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ממוצע התקדמות
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {goals.reduce(
                      (sum, goal) => sum + goal.milestones.length,
                      0
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    סה"כ אבני דרך
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {goals.reduce(
                      (sum, goal) =>
                        sum + goal.milestones.filter((m) => m.completed).length,
                      0
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    אבני דרך הושלמו
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              הוסף מטרה חדשה
            </Button>

            <Button
              onClick={exportGoals}
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
            >
              <Download className="w-4 h-4 mr-2" />
              ייצא לCSV
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="חיפוש מטרות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">כל הקטגוריות</option>
              {goalCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="not-started">לא התחיל</option>
              <option value="in-progress">בתהליך</option>
              <option value="completed">הושלם</option>
              <option value="overdue">עבר זמנו</option>
            </select>
          </div>
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">
                מטרה חדשה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    כותרת המטרה
                  </label>
                  <Input
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="למשל: תרגול מדיטציה יומי"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    קטגוריה
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        category: e.target.value as Goal['category'],
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {goalCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  תיאור
                </label>
                <Textarea
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="תאר את המטרה שלך בפירוט..."
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    תאריך יעד
                  </label>
                  <Input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        targetDate: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    עדיפות
                  </label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        priority: e.target.value as Goal['priority'],
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">נמוכה</option>
                    <option value="medium">בינונית</option>
                    <option value="high">גבוהה</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  ביטול
                </Button>
                <Button
                  onClick={addGoal}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  הוסף מטרה
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Goal Form */}
        {editingGoal && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  עריכת מטרה
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingGoal(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    כותרת המטרה
                  </label>
                  <Input
                    value={editingGoal.title}
                    onChange={(e) =>
                      setEditingGoal((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    קטגוריה
                  </label>
                  <select
                    value={editingGoal.category}
                    onChange={(e) =>
                      setEditingGoal((prev) =>
                        prev
                          ? {
                              ...prev,
                              category: e.target.value as Goal['category'],
                            }
                          : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {goalCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  תיאור
                </label>
                <Textarea
                  value={editingGoal.description}
                  onChange={(e) =>
                    setEditingGoal((prev) =>
                      prev
                        ? {
                            ...prev,
                            description: e.target.value,
                          }
                        : null
                    )
                  }
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    תאריך יעד
                  </label>
                  <Input
                    type="date"
                    value={editingGoal.targetDate.split('T')[0]}
                    onChange={(e) =>
                      setEditingGoal((prev) =>
                        prev
                          ? {
                              ...prev,
                              targetDate: e.target.value,
                            }
                          : null
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    עדיפות
                  </label>
                  <select
                    value={editingGoal.priority}
                    onChange={(e) =>
                      setEditingGoal((prev) =>
                        prev
                          ? {
                              ...prev,
                              priority: e.target.value as Goal['priority'],
                            }
                          : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">נמוכה</option>
                    <option value="medium">בינונית</option>
                    <option value="high">גבוהה</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setEditingGoal(null)}>
                  ביטול
                </Button>
                <Button
                  onClick={() =>
                    editingGoal && updateGoal(editingGoal.id, editingGoal)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  שמור שינויים
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                טוען מטרות...
              </p>
            </div>
          ) : filteredGoals.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="py-12 text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  אין מטרות להצגה
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedCategory !== 'all' ||
                  selectedStatus !== 'all' ||
                  searchTerm
                    ? 'נסה לשנות את הסינון או החיפוש'
                    : 'התחל על ידי הוספת מטרה חדשה'}
                </p>
                {selectedCategory === 'all' &&
                  selectedStatus === 'all' &&
                  !searchTerm && (
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      הוסף מטרה ראשונה
                    </Button>
                  )}
              </CardContent>
            </Card>
          ) : (
            filteredGoals.map((goal) => (
              <Card
                key={goal.id}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getCategoryIcon(goal.category)}
                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                          {goal.title}
                        </CardTitle>
                        <Badge className={priorityColors[goal.priority]}>
                          {getPriorityText(goal.priority)}
                        </Badge>
                        <Badge className={statusColors[goal.status]}>
                          {getStatusText(goal.status)}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {goal.description}
                      </CardDescription>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingGoal(goal)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                        className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        התקדמות
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress value={goal.progress} className="w-full" />
                  </div>

                  {/* Goal Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        יעד:{' '}
                        {new Date(goal.targetDate).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        נוצר:{' '}
                        {new Date(goal.createdAt).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                    {goal.completedAt && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          הושלם:{' '}
                          {new Date(goal.completedAt).toLocaleDateString(
                            'he-IL'
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Milestones */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        אבני דרך
                        <Badge variant="outline" className="text-xs">
                          {goal.milestones.filter((m) => m.completed).length}/
                          {goal.milestones.length}
                        </Badge>
                      </h4>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="אבן דרך חדשה..."
                          value={newMilestone}
                          onChange={(e) => setNewMilestone(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && newMilestone.trim()) {
                              addMilestone(goal.id, newMilestone.trim());
                              setNewMilestone('');
                            }
                          }}
                          className="w-48 text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (newMilestone.trim()) {
                              addMilestone(goal.id, newMilestone.trim());
                              setNewMilestone('');
                            }
                          }}
                          disabled={!newMilestone.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {goal.milestones.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                          <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">אין אבני דרך עדיין</p>
                          <p className="text-xs">
                            הוסף אבן דרך ראשונה כדי להתחיל
                          </p>
                        </div>
                      ) : (
                        goal.milestones.map((milestone, index) => (
                          <div
                            key={milestone.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                              milestone.completed
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400 font-mono w-6">
                                {index + 1}.
                              </span>
                              <input
                                type="checkbox"
                                checked={milestone.completed}
                                onChange={() =>
                                  toggleMilestone(goal.id, milestone.id)
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                            <span
                              className={`flex-1 ${
                                milestone.completed
                                  ? 'line-through text-gray-500 dark:text-gray-400'
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}
                            >
                              {milestone.title}
                            </span>
                            {milestone.completed && (
                              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                            )}
                            {milestone.dueDate && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(milestone.dueDate).toLocaleDateString(
                                  'he-IL'
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Tips and Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tips Section */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                טיפים להצלחה במטרות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    הגדר מטרות SMART
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ספציפיות, מדידות, ברות השגה, רלוונטיות ומוגבלות בזמן
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    עקוב אחרי התקדמות
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    בדוק את ההתקדמות שלך באופן קבוע וחגוג הצלחות קטנות
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    חלק למטרות קטנות
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    פרק מטרות גדולות לאבני דרך קטנות וברות השגה
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Insights */}
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                התובנות שלך
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  הוסף מטרות כדי לקבל תובנות אישיות
                </p>
              ) : (
                <>
                  {completedGoals > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Star className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">
                          כל הכבוד! השלמת {completedGoals} מטרות
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          זה מראה על מחויבות והתמדה מרשימות
                        </p>
                      </div>
                    </div>
                  )}

                  {inProgressGoals > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          {inProgressGoals} מטרות בתהליך
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          המשך בקצב הנוכחי - אתה על הדרך הנכונה!
                        </p>
                      </div>
                    </div>
                  )}

                  {overdueGoals > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                          {overdueGoals} מטרות עברו את המועד
                        </p>
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                          שקול לעדכן תאריכים או לחלק למטרות קטנות יותר
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ממוצע ההתקדמות שלך:{' '}
                      {Math.round(
                        goals.reduce((sum, goal) => sum + goal.progress, 0) /
                          goals.length
                      )}
                      %
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
