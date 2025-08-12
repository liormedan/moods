import { NextRequest, NextResponse } from 'next/server';
import { resourceService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for resource
const resourceSchema = z.object({
  title: z.string().min(3, 'כותרת המשאב חייבת להכיל לפחות 3 תווים'),
  description: z.string().min(10, 'תיאור המשאב חייב להכיל לפחות 10 תווים'),
  type: z.enum(['article', 'video', 'book', 'app', 'website', 'contact']),
  url: z.string().url('כתובת URL לא חוקית').optional(),
  tags: z.array(z.string()).min(1, 'יש לבחור לפחות תג אחד'),
  isPublic: z.boolean().default(false)
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
    const validationResult = resourceSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { title, description, type, url, tags, isPublic } = validationResult.data;

    // Prepare resource data
    const resourceData = {
      userId,
      title,
      description,
      type,
      url: url || '',
      tags,
      isPublic
    };

    // Save to Firestore
    const resourceId = await resourceService.create(resourceData);

    return NextResponse.json({
      message: 'משאב נשמר בהצלחה',
      id: resourceId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save resource error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת המשאב' },
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
    const validationResult = resourceSchema.extend({
      id: z.string().min(1, 'מזהה משאב נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, title, description, type, url, tags, isPublic } = validationResult.data;

    // Check if resource exists and belongs to user
    const existingResource = await resourceService.getById(id);
    if (!existingResource) {
      return NextResponse.json(
        { error: 'משאב לא נמצא' },
        { status: 404 }
      );
    }

    if (existingResource.userId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך משאב זה' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      title,
      description,
      type,
      url: url || '',
      tags,
      isPublic
    };

    // Update in Firestore
    await resourceService.update(id, updateData);

    return NextResponse.json({
      message: 'משאב עודכן בהצלחה'
    });

  } catch (error: any) {
    console.error('Update resource error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון המשאב' },
      { status: 500 }
    );
  }
}
