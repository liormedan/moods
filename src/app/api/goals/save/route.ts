import { NextRequest, NextResponse } from 'next/server';
import { goalService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for goal
const goalSchema = z.object({
  title: z.string().min(1, 'כותרת המטרה נדרשת'),
  description: z.string().optional(),
  category: z.enum(['mental-health', 'physical-health', 'social', 'career', 'personal']),
  targetDate: z.string().datetime().optional(), // ISO string
  progress: z.number().min(0).max(100, 'ההתקדמות חייבת להיות בין 0 ל-100'),
  status: z.enum(['active', 'completed', 'paused', 'cancelled']),
  milestones: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'כותרת אבן דרך נדרשת'),
    completed: z.boolean(),
    dueDate: z.string().datetime().optional() // ISO string
  })).optional()
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
    const validationResult = goalSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { title, description, category, targetDate, progress, status, milestones } = validationResult.data;

    // Prepare goal data
    const goalData = {
      userId,
      title,
      description: description || '',
      category,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      progress,
      status,
      milestones: milestones?.map(milestone => ({
        id: milestone.id || Math.random().toString(36).substr(2, 9),
        title: milestone.title,
        completed: milestone.completed,
        dueDate: milestone.dueDate ? new Date(milestone.dueDate) : undefined
      })) || []
    };

    // Save to Firestore
    const goalId = await goalService.create(goalData);

    return NextResponse.json({
      message: 'מטרה נשמרה בהצלחה',
      id: goalId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save goal error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת המטרה' },
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
    const validationResult = goalSchema.extend({
      id: z.string().min(1, 'מזהה מטרה נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, title, description, category, targetDate, progress, status, milestones } = validationResult.data;

    // Check if goal exists and belongs to user
    const existingGoal = await goalService.getById(id);
    if (!existingGoal) {
      return NextResponse.json(
        { error: 'מטרה לא נמצאה' },
        { status: 404 }
      );
    }

    if (existingGoal.userId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך מטרה זו' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      title,
      description: description || '',
      category,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      progress,
      status,
      milestones: milestones?.map(milestone => ({
        id: milestone.id || Math.random().toString(36).substr(2, 9),
        title: milestone.title,
        completed: milestone.completed,
        dueDate: milestone.dueDate ? new Date(milestone.dueDate) : undefined
      })) || []
    };

    // Update in Firestore
    await goalService.update(id, updateData);

    return NextResponse.json({
      message: 'מטרה עודכנה בהצלחה'
    });

  } catch (error: any) {
    console.error('Update goal error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון המטרה' },
      { status: 500 }
    );
  }
}
