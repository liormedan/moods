import { NextRequest, NextResponse } from 'next/server';
import { insightService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for insight
const insightSchema = z.object({
  type: z.enum(['mood-pattern', 'sleep-correlation', 'activity-impact', 'goal-progress', 'trend-analysis']),
  title: z.string().min(5, 'כותרת התובנה חייבת להכיל לפחות 5 תווים'),
  description: z.string().min(20, 'תיאור התובנה חייב להכיל לפחות 20 תווים'),
  data: z.any(), // Flexible data structure
  confidence: z.number().min(0).max(1, 'רמת הביטחון חייבת להיות בין 0 ל-1')
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
    const validationResult = insightSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { type, title, description, data, confidence } = validationResult.data;

    // Prepare insight data
    const insightData = {
      userId,
      type,
      title,
      description,
      data,
      confidence
    };

    // Save to Firestore
    const insightId = await insightService.create(insightData);

    return NextResponse.json({
      message: 'תובנה נשמרה בהצלחה',
      id: insightId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save insight error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת התובנה' },
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
    const validationResult = insightSchema.extend({
      id: z.string().min(1, 'מזהה תובנה נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, type, title, description, data, confidence } = validationResult.data;

    // Check if insight exists and belongs to user
    const existingInsight = await insightService.getById(id);
    if (!existingInsight) {
      return NextResponse.json(
        { error: 'תובנה לא נמצאה' },
        { status: 404 }
      );
    }

    if (existingInsight.userId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך תובנה זו' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      type,
      title,
      description,
      data,
      confidence
    };

    // Update in Firestore
    await insightService.update(id, updateData);

    return NextResponse.json({
      message: 'תובנה עודכנה בהצלחה'
    });

  } catch (error: any) {
    console.error('Update insight error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון התובנה' },
      { status: 500 }
    );
  }
}
