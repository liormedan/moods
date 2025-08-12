import { NextRequest, NextResponse } from 'next/server';
import { progressReportService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for progress report
const progressReportSchema = z.object({
  period: z.enum(['weekly', 'monthly', 'quarterly']),
  startDate: z.string().datetime('תאריך התחלה לא חוקי'),
  endDate: z.string().datetime('תאריך סיום לא חוקי'),
  summary: z.string().min(10, 'הסיכום חייב להכיל לפחות 10 תווים'),
  achievements: z.array(z.string()).min(1, 'יש לציין לפחות הישג אחד'),
  challenges: z.array(z.string()).min(1, 'יש לציין לפחות אתגר אחד'),
  nextSteps: z.array(z.string()).min(1, 'יש לציין לפחות צעד הבא אחד'),
  moodAverage: z.number().min(1).max(10, 'ממוצע מצב רוח חייב להיות בין 1 ל-10'),
  goalsProgress: z.array(z.object({
    goalId: z.string().min(1, 'מזהה מטרה נדרש'),
    progress: z.number().min(0).max(100, 'ההתקדמות חייבת להיות בין 0 ל-100'),
    notes: z.string().optional()
  })).min(1, 'יש לציין התקדמות לפחות מטרה אחת')
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const userId = getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'נדרשת התחברות' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = progressReportSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { period, startDate, endDate, summary, achievements, challenges, nextSteps, moodAverage, goalsProgress } = validationResult.data;

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return NextResponse.json(
        { error: 'תאריך ההתחלה חייב להיות לפני תאריך הסיום' },
        { status: 400 }
      );
    }

    // Prepare progress report data
    const progressReportData = {
      userId,
      period,
      startDate: start,
      endDate: end,
      summary,
      achievements,
      challenges,
      nextSteps,
      moodAverage,
      goalsProgress
    };

    // Save to Firestore
    const progressReportId = await progressReportService.create(progressReportData);

    return NextResponse.json({
      message: 'דוח התקדמות נשמר בהצלחה',
      id: progressReportId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save progress report error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת דוח ההתקדמות' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated
    const userId = getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'נדרשת התחברות' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = progressReportSchema.extend({
      id: z.string().min(1, 'מזהה דוח התקדמות נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, period, startDate, endDate, summary, achievements, challenges, nextSteps, moodAverage, goalsProgress } = validationResult.data;

    // Check if progress report exists and belongs to user
    const existingReport = await progressReportService.getById(id);
    if (!existingReport) {
      return NextResponse.json(
        { error: 'דוח התקדמות לא נמצא' },
        { status: 404 }
      );
    }

    if (existingReport.userId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך דוח זה' },
        { status: 403 }
      );
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return NextResponse.json(
        { error: 'תאריך ההתחלה חייב להיות לפני תאריך הסיום' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      period,
      startDate: start,
      endDate: end,
      summary,
      achievements,
      challenges,
      nextSteps,
      moodAverage,
      goalsProgress
    };

    // Update in Firestore
    await progressReportService.update(id, updateData);

    return NextResponse.json({
      message: 'דוח התקדמות עודכן בהצלחה'
    });

  } catch (error: any) {
    console.error('Update progress report error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון דוח ההתקדמות' },
      { status: 500 }
    );
  }
}
