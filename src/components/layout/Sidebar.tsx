'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import {
  Home,
  BarChart3,
  Calendar,
  Target,
  BookOpen,
  Users,
  Settings,
  HelpCircle,
  Activity,
  Brain,
  Heart,
  TrendingUp,
  FileText,
  Shield,
  Bell,
  User,
  Lightbulb,
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: 'ראשי',
    items: [
      {
        title: 'דאשבורד',
        href: '/dashboard',
        icon: Home,
        description: 'סקירה כללית של מצב הרוח והתקדמות',
      },
      {
        title: 'תיעוד מצב רוח',
        href: '/dashboard/mood-entry',
        icon: Heart,
        description: 'הזנת מצב רוח יומי',
      },
      {
        title: 'גרפים וניתוחים',
        href: '/dashboard/analytics',
        icon: BarChart3,
        description: 'מגמות ודפוסים במצב הרוח',
      },
    ],
  },
  {
    title: 'כלים טיפוליים',
    items: [
      {
        title: 'יומן אישי',
        href: '/dashboard/journal',
        icon: BookOpen,
        description: 'כתיבה טיפולית ורפלקציה',
      },
      {
        title: 'תרגילי נשימה',
        href: '/dashboard/breathing',
        icon: Activity,
        description: 'תרגילי הרגעה ומדיטציה',
      },
      {
        title: 'מטרות אישיות',
        href: '/dashboard/goals',
        icon: Target,
        description: 'הגדרת ומעקב אחר מטרות',
      },
      {
        title: 'תובנות AI',
        href: '/dashboard/insights',
        icon: Lightbulb,
        description: 'המלצות והתובנות מותאמות אישית',
      },
    ],
  },
  {
    title: 'קהילה ותמיכה',
    items: [
      {
        title: 'קבוצות תמיכה',
        href: '/dashboard/support-groups',
        icon: Users,
        description: 'התחברות עם אחרים',
      },
      {
        title: 'משאבי עזרה',
        href: '/dashboard/resources',
        icon: HelpCircle,
        description: 'מידע ומשאבים מועילים',
      },
      {
        title: 'יצירת קשר עם מטפל',
        href: '/dashboard/therapist',
        icon: Brain,
        description: 'חיבור למטפלים מקצועיים',
      },
    ],
  },
  {
    title: 'דוחות ומעקב',
    items: [
      {
        title: 'לוח שנה',
        href: '/dashboard/calendar',
        icon: Calendar,
        description: 'מעקב יומי ושבועי',
      },
      {
        title: 'דוחות התקדמות',
        href: '/dashboard/progress-reports',
        icon: FileText,
        description: 'סיכומים ודוחות מפורטים',
      },
      {
        title: 'מגמות ארוכות טווח',
        href: '/dashboard/trends',
        icon: TrendingUp,
        description: 'ניתוח מגמות לאורך זמן',
      },
    ],
  },
  {
    title: 'הגדרות',
    items: [
      {
        title: 'פרופיל אישי',
        href: '/dashboard/profile',
        icon: User,
        description: 'עריכת פרטים אישיים',
      },
      {
        title: 'התראות',
        href: '/dashboard/notifications',
        icon: Bell,
        badge: '3',
        description: 'ניהול התראות ותזכורות',
      },
      {
        title: 'פרטיות ואבטחה',
        href: '/dashboard/privacy',
        icon: Shield,
        description: 'הגדרות פרטיות ואבטחה',
      },
      {
        title: 'הגדרות כלליות',
        href: '/dashboard/settings',
        icon: Settings,
        description: 'העדפות והתאמות אישיות',
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Moods
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              מעקב בריאות נפשית
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-6">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                      )}
                      title={item.description}
                    >
                      <Icon
                        className={cn(
                          'ml-2 h-4 w-4 transition-colors',
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                        )}
                      />
                      <span className="flex-1 text-xs">{item.title}</span>
                      {item.badge && (
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {/* Theme Switcher */}
        <div className="flex justify-center">
          <ThemeSwitcher />
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                הרגש טוב היום?
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                תעד את מצב הרוח שלך
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/mood-entry"
            className="mt-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium py-1.5 px-3 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
          >
            תעד עכשיו
          </Link>
        </div>
      </div>
    </div>
  );
}
