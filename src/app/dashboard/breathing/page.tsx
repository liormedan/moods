'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  RotateCcw,
  Timer,
  Heart,
  Activity,
  Brain,
  Target,
  Clock,
  CheckCircle,
  Info,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  cycles: number;
  category: 'relaxation' | 'energy' | 'focus' | 'sleep';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

const breathingExercises: BreathingExercise[] = [
  {
    id: 'box-breathing',
    name: 'נשימת קופסה',
    description: 'תרגיל נשימה פשוט ויעיל להרגעה וריכוז',
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 4,
    cycles: 5,
    category: 'focus',
    difficulty: 'beginner',
    benefits: ['הרגעה', 'ריכוז', 'הפחתת לחץ', 'שיפור שינה'],
  },
  {
    id: '4-7-8-breathing',
    name: 'נשימה 4-7-8',
    description: 'תרגיל נשימה טבעי להרגעה מהירה',
    inhaleTime: 4,
    holdTime: 7,
    exhaleTime: 8,
    cycles: 4,
    category: 'relaxation',
    difficulty: 'beginner',
    benefits: ['הרגעה מהירה', 'הפחתת חרדה', 'שיפור שינה', 'איזון מערכת העצבים'],
  },
  {
    id: 'alternate-nostril',
    name: 'נשימה חלופית בנחיריים',
    description: 'תרגיל נשימה יוגי לאיזון אנרגיה וריכוז',
    inhaleTime: 4,
    holdTime: 8,
    exhaleTime: 4,
    cycles: 6,
    category: 'focus',
    difficulty: 'intermediate',
    benefits: ['איזון אנרגיה', 'שיפור ריכוז', 'הרגעה', 'איזון מערכת העצבים'],
  },
  {
    id: 'deep-belly-breathing',
    name: 'נשימה עמוקה מהבטן',
    description: 'תרגיל בסיסי לנשימה נכונה והרגעה',
    inhaleTime: 5,
    holdTime: 2,
    exhaleTime: 5,
    cycles: 8,
    category: 'relaxation',
    difficulty: 'beginner',
    benefits: ['הרגעה', 'שיפור חמצון', 'הפחתת מתח', 'שיפור תפקוד ריאות'],
  },
  {
    id: 'lion-breath',
    name: 'נשימת האריה',
    description: 'תרגיל נשימה אנרגטי לשחרור מתח',
    inhaleTime: 3,
    holdTime: 1,
    exhaleTime: 6,
    cycles: 3,
    category: 'energy',
    difficulty: 'beginner',
    benefits: ['שחרור מתח', 'הגברת אנרגיה', 'שיפור ביטחון', 'שחרור רגשות'],
  },
  {
    id: 'coherent-breathing',
    name: 'נשימה קוהרנטית',
    description: 'תרגיל נשימה לאיזון מערכת העצבים',
    inhaleTime: 6,
    holdTime: 0,
    exhaleTime: 6,
    cycles: 10,
    category: 'relaxation',
    difficulty: 'intermediate',
    benefits: ['איזון מערכת העצבים', 'הפחתת לחץ', 'שיפור שינה', 'איזון לחץ דם'],
  },
];

export default function BreathingPage() {
  const [selectedExercise, setSelectedExercise] =
    useState<BreathingExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<
    'inhale' | 'hold' | 'exhale'
  >('inhale');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [customSettings, setCustomSettings] = useState({
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 4,
    cycles: 5,
  });
  const [showCustom, setShowCustom] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<
    Array<{
      id: string;
      exerciseName: string;
      duration: number;
      completedAt: string;
    }>
  >([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSessionHistory();
  }, []);

  const loadSessionHistory = async () => {
    try {
      const response = await fetch('/api/breathing?limit=10');
      if (response.ok) {
        const data = await response.json();
        const sessions = data.data.map((session: any) => ({
          id: session.id,
          exerciseName: session.exerciseName,
          duration: session.duration,
          completedAt: session.createdAt,
        }));
        setSessionHistory(sessions);

        // Also save to localStorage as backup
        localStorage.setItem('breathing-sessions', JSON.stringify(sessions));
      } else {
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem('breathing-sessions');
        if (saved) {
          setSessionHistory(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error('Error loading session history:', error);
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem('breathing-sessions');
      if (saved) {
        setSessionHistory(JSON.parse(saved));
      }
    }
  };

  const startExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setTotalCycles(exercise.cycles);
    setCurrentCycle(1);
    setCurrentPhase('inhale');
    setTimeLeft(exercise.inhaleTime);
    setIsActive(true);
  };

  const startCustomExercise = () => {
    const customExercise: BreathingExercise = {
      id: 'custom',
      name: 'תרגיל מותאם אישית',
      description: 'תרגיל נשימה עם הגדרות מותאמות אישית',
      ...customSettings,
      category: 'relaxation',
      difficulty: 'beginner',
      benefits: ['הרגעה', 'ריכוז', 'הפחתת לחץ'],
    };
    startExercise(customExercise);
  };

  const stopExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(0);
    setCurrentCycle(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetExercise = () => {
    if (selectedExercise) {
      setCurrentCycle(1);
      setCurrentPhase('inhale');
      setTimeLeft(selectedExercise.inhaleTime);
    }
  };

  useEffect(() => {
    if (!isActive || !selectedExercise) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (currentPhase === 'inhale') {
            if (selectedExercise.holdTime > 0) {
              setCurrentPhase('hold');
              return selectedExercise.holdTime;
            } else {
              setCurrentPhase('exhale');
              return selectedExercise.exhaleTime;
            }
          } else if (currentPhase === 'hold') {
            setCurrentPhase('exhale');
            return selectedExercise.exhaleTime;
          } else {
            // Completed exhale, move to next cycle
            if (currentCycle < totalCycles) {
              setCurrentCycle((prev) => prev + 1);
              setCurrentPhase('inhale');
              return selectedExercise.inhaleTime;
            } else {
              // Exercise completed
              setIsActive(false);
              setCurrentPhase('inhale');
              setTimeLeft(0);
              setCurrentCycle(0);

              // Save session to API
              const sessionData = {
                exerciseId: selectedExercise.id,
                exerciseName: selectedExercise.name,
                duration: calculateTotalDuration(selectedExercise),
                cycles: selectedExercise.cycles,
                inhaleTime: selectedExercise.inhaleTime,
                holdTime: selectedExercise.holdTime,
                exhaleTime: selectedExercise.exhaleTime,
                completed: true,
              };

              // Save session to API
              fetch('/api/breathing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData),
              })
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  } else {
                    console.error(
                      'Failed to save breathing session:',
                      response.status
                    );
                    throw new Error('Failed to save session');
                  }
                })
                .then((result) => {
                  const session = {
                    id: result.data.id,
                    exerciseName: result.data.exerciseName,
                    duration: result.data.duration,
                    completedAt: result.data.createdAt,
                  };
                  const newHistory = [session, ...sessionHistory];
                  setSessionHistory(newHistory);

                  // Also save to localStorage as backup
                  localStorage.setItem(
                    'breathing-sessions',
                    JSON.stringify(newHistory)
                  );
                })
                .catch((error) => {
                  console.error('Error saving breathing session:', error);
                });

              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isActive,
    selectedExercise,
    currentPhase,
    currentCycle,
    totalCycles,
    sessionHistory,
  ]);

  const calculateTotalDuration = (exercise: BreathingExercise) => {
    const cycleTime =
      exercise.inhaleTime + exercise.holdTime + exercise.exhaleTime;
    return cycleTime * exercise.cycles;
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'שאף';
      case 'hold':
        return 'החזק';
      case 'exhale':
        return 'נשוף';
      default:
        return '';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'text-blue-600 dark:text-blue-400';
      case 'hold':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'exhale':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getPhaseBackground = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'hold':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'exhale':
        return 'bg-green-50 dark:bg-green-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'relaxation':
        return <Heart className="w-4 h-4" />;
      case 'energy':
        return <Activity className="w-4 h-4" />;
      case 'focus':
        return <Brain className="w-4 h-4" />;
      case 'sleep':
        return <Clock className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            תרגילי נשימה ומדיטציה 🧘‍♀️
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            תרגילי נשימה יעילים להרגעה, ריכוז ושיפור הרווחה הנפשית
          </p>
        </div>

        {/* Active Exercise Display */}
        {isActive && selectedExercise && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {selectedExercise.name}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                תרגיל פעיל - המשך לנשום
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                {/* Current Phase Display with Animation */}
                <div className="relative">
                  <div
                    className={`p-8 rounded-full mx-auto w-48 h-48 flex items-center justify-center ${getPhaseBackground()} border-4 border-gray-200 dark:border-gray-700 transition-all duration-1000 ${
                      currentPhase === 'inhale'
                        ? 'scale-110'
                        : currentPhase === 'hold'
                          ? 'scale-105'
                          : 'scale-95'
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`text-6xl font-bold ${getPhaseColor()} mb-2 transition-colors duration-500`}
                      >
                        {timeLeft}
                      </div>
                      <div
                        className={`text-xl font-semibold ${getPhaseColor()} transition-colors duration-500`}
                      >
                        {getPhaseText()}
                      </div>
                    </div>
                  </div>

                  {/* Breathing Animation Rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`absolute rounded-full border-2 ${
                        currentPhase === 'inhale'
                          ? 'border-blue-300 dark:border-blue-600'
                          : currentPhase === 'hold'
                            ? 'border-yellow-300 dark:border-yellow-600'
                            : 'border-green-300 dark:border-green-600'
                      } transition-all duration-1000 ${
                        currentPhase === 'inhale'
                          ? 'w-56 h-56 opacity-70'
                          : currentPhase === 'hold'
                            ? 'w-52 h-52 opacity-50'
                            : 'w-44 h-44 opacity-30'
                      }`}
                    />
                    <div
                      className={`absolute rounded-full border-2 ${
                        currentPhase === 'inhale'
                          ? 'border-blue-200 dark:border-blue-700'
                          : currentPhase === 'hold'
                            ? 'border-yellow-200 dark:border-yellow-700'
                            : 'border-green-200 dark:border-green-700'
                      } transition-all duration-1000 delay-200 ${
                        currentPhase === 'inhale'
                          ? 'w-64 h-64 opacity-40'
                          : currentPhase === 'hold'
                            ? 'w-60 h-60 opacity-30'
                            : 'w-40 h-40 opacity-20'
                      }`}
                    />
                  </div>
                </div>

                {/* Guidance Text */}
                <div className="text-center mb-6">
                  <div
                    className={`text-lg font-medium ${getPhaseColor()} transition-colors duration-500`}
                  >
                    {currentPhase === 'inhale' && 'שאף לאט ועמוק דרך האף...'}
                    {currentPhase === 'hold' && 'החזק את הנשימה בעדינות...'}
                    {currentPhase === 'exhale' && 'נשוף לאט ורגוע דרך הפה...'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {currentPhase === 'inhale' &&
                      'הרגש איך הריאות שלך מתמלאות באוויר'}
                    {currentPhase === 'hold' && 'שמור על רגיעה ואל תתאמץ'}
                    {currentPhase === 'exhale' && 'שחרר את כל המתח והדאגות'}
                  </div>
                </div>

                {/* Progress Info */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {currentCycle}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      מחזור נוכחי
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {totalCycles}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      סה"כ מחזורים
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {Math.round((currentCycle / totalCycles) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      התקדמות
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={stopExercise}
                    variant="outline"
                    size="lg"
                    className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    עצור
                  </Button>
                  <Button onClick={resetExercise} variant="outline" size="lg">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    אפס
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercise Selection */}
        {!isActive && (
          <>
            {/* Custom Exercise Settings */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>תרגיל מותאם אישית</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  צור תרגיל נשימה עם הגדרות משלך
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      שאיפה (שניות)
                    </label>
                    <Slider
                      value={customSettings.inhaleTime}
                      onChange={(e) =>
                        setCustomSettings((prev) => ({
                          ...prev,
                          inhaleTime: Number(e.target.value),
                        }))
                      }
                      max={10}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {customSettings.inhaleTime}s
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      החזקה (שניות)
                    </label>
                    <Slider
                      value={customSettings.holdTime}
                      onChange={(e) =>
                        setCustomSettings((prev) => ({
                          ...prev,
                          holdTime: Number(e.target.value),
                        }))
                      }
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {customSettings.holdTime}s
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      נשיפה (שניות)
                    </label>
                    <Slider
                      value={customSettings.exhaleTime}
                      onChange={(e) =>
                        setCustomSettings((prev) => ({
                          ...prev,
                          exhaleTime: Number(e.target.value),
                        }))
                      }
                      max={10}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {customSettings.exhaleTime}s
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      מחזורים
                    </label>
                    <Slider
                      value={customSettings.cycles}
                      onChange={(e) =>
                        setCustomSettings((prev) => ({
                          ...prev,
                          cycles: Number(e.target.value),
                        }))
                      }
                      max={15}
                      min={3}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {customSettings.cycles}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={startCustomExercise}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  התחל תרגיל מותאם אישית
                </Button>
              </CardContent>
            </Card>

            {/* Predefined Exercises */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {breathingExercises.map((exercise) => (
                <Card
                  key={exercise.id}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(exercise.category)}
                        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                          {exercise.name}
                        </CardTitle>
                      </div>
                      <Badge
                        className={getDifficultyColor(exercise.difficulty)}
                      >
                        {exercise.difficulty === 'beginner'
                          ? 'מתחיל'
                          : exercise.difficulty === 'intermediate'
                            ? 'בינוני'
                            : 'מתקדם'}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {exercise.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Exercise Details */}
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                          {exercise.inhaleTime}s
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          שאיפה
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                        <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                          {exercise.holdTime}s
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          החזקה
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                        <div className="font-semibold text-green-600 dark:text-green-400">
                          {exercise.exhaleTime}s
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          נשיפה
                        </div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        יתרונות:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {exercise.benefits.map((benefit, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Start Button */}
                    <Button
                      onClick={() => startExercise(exercise)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      התחל תרגיל
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Statistics Cards */}
        {sessionHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  סה"כ תרגילים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {sessionHistory.length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  זמן כולל
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(
                    sessionHistory.reduce(
                      (sum, session) => sum + session.duration,
                      0
                    ) / 60
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  דקות
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  השבוע
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {
                    sessionHistory.filter((session) => {
                      const sessionDate = new Date(session.completedAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return sessionDate >= weekAgo;
                    }).length
                  }
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  תרגילים
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  ממוצע יומי
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {sessionHistory.length > 0
                    ? Math.round(
                        sessionHistory.reduce(
                          (sum, session) => sum + session.duration,
                          0
                        ) /
                          60 /
                          Math.max(
                            1,
                            Math.ceil(
                              (new Date().getTime() -
                                new Date(
                                  sessionHistory[
                                    sessionHistory.length - 1
                                  ].completedAt
                                ).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                      )
                    : 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  דקות
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Session History */}
        {sessionHistory.length > 0 && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span>היסטוריית תרגילים</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    התרגילים שהשלמת לאחרונה
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Export breathing sessions
                    if (sessionHistory.length === 0) {
                      alert('אין נתונים לייצוא');
                      return;
                    }

                    try {
                      const exportData = [
                        ['היסטוריית תרגילי נשימה'],
                        [''],
                        ['תאריך ייצוא', new Date().toLocaleDateString('he-IL')],
                        ['סה"כ תרגילים', sessionHistory.length.toString()],
                        [''],
                        ['תרגילים'],
                        ['תאריך', 'שם התרגיל', 'משך (שניות)', 'משך (דקות)'],
                        ...sessionHistory.map((session) => [
                          new Date(session.completedAt).toLocaleDateString(
                            'he-IL'
                          ),
                          session.exerciseName,
                          session.duration.toString(),
                          Math.round(session.duration / 60).toString(),
                        ]),
                      ];

                      const BOM = '\uFEFF';
                      const csvContent = exportData
                        .map((row) => row.map((cell) => `"${cell}"`).join(','))
                        .join('\n');

                      const blob = new Blob([BOM + csvContent], {
                        type: 'text/csv;charset=utf-8;',
                      });
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = `breathing-sessions-${new Date().toISOString().split('T')[0]}.csv`;
                      link.click();
                    } catch (error) {
                      console.error(
                        'Error exporting breathing sessions:',
                        error
                      );
                      alert('שגיאה בייצוא הנתונים. נסה שוב.');
                    }
                  }}
                  className="text-sm"
                >
                  <Timer className="w-4 h-4 mr-2" />
                  ייצוא נתונים
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessionHistory.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {session.exerciseName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.completedAt).toLocaleDateString(
                            'he-IL'
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {session.duration} שניות
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(session.duration / 60)} דקות
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              טיפים לתרגול נשימה יעיל
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>לפני התרגיל</span>
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• מצא מקום שקט ונוח</li>
                  <li>• שב בתנוחה זקופה אך רגועה</li>
                  <li>• סגור את העיניים או התמקד בנקודה אחת</li>
                  <li>• הרגע את הכתפיים והצוואר</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span>במהלך התרגיל</span>
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• התמקד בנשימה שלך</li>
                  <li>• אל תאבק במחשבות - תן להן לחלוף</li>
                  <li>• אם התבלבלת, פשוט התחל מחדש</li>
                  <li>• תרגל באופן קבוע לתוצאות טובות יותר</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
