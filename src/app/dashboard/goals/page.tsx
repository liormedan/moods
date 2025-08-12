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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'mental-health' as Goal['category'],
    targetDate: '',
    priority: 'medium' as Goal['priority'],
    milestones: [] as Milestone[],
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const saved = localStorage.getItem('goals');
    if (saved) {
      setGoals(JSON.parse(saved));
    } else {
      // Load sample goals
      const sampleGoals: Goal[] = [
        {
          id: '1',
          title: 'תרגול מדיטציה יומי',
          description: 'להתחיל לתרגל מדיטציה של 10 דקות כל בוקר',
          category: 'mental-health',
          targetDate: '2025-09-30',
          progress: 60,
          status: 'in-progress',
          priority: 'high',
          milestones: [
            { id: '1-1', title: 'התקנת אפליקציית מדיטציה', completed: true },
            { id: '1-2', title: 'תרגול ראשון של 5 דקות', completed: true },
            { id: '1-3', title: 'הגעה ל-10 דקות', completed: false },
            { id: '1-4', title: 'תרגול יומי במשך שבוע', completed: false },
          ],
          createdAt: '2025-08-01',
        },
        {
          id: '2',
          title: 'פעילות גופנית 3 פעמים בשבוע',
          description: 'להתחיל בפעילות גופנית קבועה לשיפור מצב הרוח',
          category: 'physical',
          targetDate: '2025-10-15',
          progress: 30,
          status: 'in-progress',
          priority: 'medium',
          milestones: [
            { id: '2-1', title: 'בחירת סוג פעילות', completed: true },
            { id: '2-2', title: 'פעילות ראשונה', completed: true },
            { id: '2-3', title: 'פעילות שבועית', completed: false },
            { id: '2-4', title: 'הגעה ל-3 פעמים בשבוע', completed: false },
          ],
          createdAt: '2025-08-05',
        },
        {
          id: '3',
          title: 'שיפור איכות השינה',
          description: 'להגיע ל-7-8 שעות שינה איכותית בלילה',
          category: 'mental-health',
          targetDate: '2025-09-15',
          progress: 80,
          status: 'in-progress',
          priority: 'high',
          milestones: [
            { id: '3-1', title: 'הגדרת זמן שינה קבוע', completed: true },
            { id: '3-2', title: 'יצירת שגרת ערב', completed: true },
            { id: '3-3', title: 'הפחתת מסכים לפני שינה', completed: true },
            { id: '3-4', title: 'הגעה ל-7 שעות שינה', completed: false },
          ],
          createdAt: '2025-07-20',
        },
      ];
      setGoals(sampleGoals);
      localStorage.setItem('goals', JSON.stringify(sampleGoals));
    }
  };

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) return;

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      status: 'not-started',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);

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
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, ...updates } : goal
    );
    saveGoals(updatedGoals);
  };

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    saveGoals(updatedGoals);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map((milestone) =>
          milestone.id === milestoneId
            ? { ...milestone, completed: !milestone.completed }
            : milestone
        );

        const completedCount = updatedMilestones.filter(
          (m) => m.completed
        ).length;
        const progress = Math.round(
          (completedCount / updatedMilestones.length) * 100
        );

        let status = goal.status;
        if (progress === 100) {
          status = 'completed';
        } else if (progress > 0) {
          status = 'in-progress';
        }

        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
          status,
          completedAt:
            status === 'completed'
              ? new Date().toISOString().split('T')[0]
              : undefined,
        };
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const addMilestone = (goalId: string, title: string) => {
    const milestone: Milestone = {
      id: Date.now().toString(),
      title,
      completed: false,
    };

    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        return {
          ...goal,
          milestones: [...goal.milestones, milestone],
        };
      }
      return goal;
    });
    saveGoals(updatedGoals);
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

  const filteredGoals = goals.filter((goal) => {
    if (selectedCategory !== 'all' && goal.category !== selectedCategory)
      return false;
    if (selectedStatus !== 'all' && goal.status !== selectedStatus)
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {goals.length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  סה"כ מטרות
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {completedGoals}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  הושלמו
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {inProgressGoals}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  בתהליך
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {overdueGoals}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  עבר זמנן
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Goal Button */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            הוסף מטרה חדשה
          </Button>

          {/* Filters */}
          <div className="flex items-center space-x-4">
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

        {/* Goals List */}
        <div className="space-y-6">
          {filteredGoals.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="py-12 text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  אין מטרות להצגה
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? 'נסה לשנות את הסינון או הוסף מטרה חדשה'
                    : 'התחל על ידי הוספת מטרה חדשה'}
                </p>
                {selectedCategory === 'all' && selectedStatus === 'all' && (
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
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        אבני דרך
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const title = prompt('כותרת אבן דרך חדשה:');
                          if (title) addMilestone(goal.id, title);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        הוסף אבן דרך
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <input
                            type="checkbox"
                            checked={milestone.completed}
                            onChange={() =>
                              toggleMilestone(goal.id, milestone.id)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span
                            className={`flex-1 ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}
                          >
                            {milestone.title}
                          </span>
                          {milestone.completed && (
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Tips Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              טיפים להצלחה במטרות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  הגדר מטרות SMART
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ספציפיות, מדידות, ברות השגה, רלוונטיות ומוגבלות בזמן
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  עקוב אחרי התקדמות
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  בדוק את ההתקדמות שלך באופן קבוע וחגוג הצלחות קטנות
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  היה גמיש
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  אל תפחד לשנות או להתאים מטרות בהתאם למצב החדש
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
