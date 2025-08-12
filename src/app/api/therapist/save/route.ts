import { NextRequest, NextResponse } from 'next/server';
import { therapistService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for therapist
const therapistSchema = z.object({
  name: z.string().min(2, 'שם המטפל חייב להכיל לפחות 2 תווים'),
  specialization: z.array(z.string()).min(1, 'יש לציין לפחות התמחות אחת'),
  contactInfo: z.object({
    phone: z.string().optional(),
    email: z.string().email('כתובת אימייל לא חוקית').optional(),
    website: z.string().url('כתובת אתר לא חוקית').optional(),
    address: z.string().optional()
  }),
  notes: z.string().optional()
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
    const validationResult = therapistSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { name, specialization, contactInfo, notes } = validationResult.data;

    // Prepare therapist data
    const therapistData = {
      userId,
      name,
      specialization,
      contactInfo,
      notes: notes || ''
    };

    // Save to Firestore
    const therapistId = await therapistService.create(therapistData);

    return NextResponse.json({
      message: 'פרטי מטפל נשמרו בהצלחה',
      id: therapistId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save therapist error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת פרטי המטפל' },
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
    const validationResult = therapistSchema.extend({
      id: z.string().min(1, 'מזהה מטפל נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, name, specialization, contactInfo, notes } = validationResult.data;

    // Check if therapist exists and belongs to user
    const existingTherapist = await therapistService.getById(id);
    if (!existingTherapist) {
      return NextResponse.json(
        { error: 'פרטי מטפל לא נמצאו' },
        { status: 404 }
      );
    }

    if (existingTherapist.userId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך פרטים אלו' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      name,
      specialization,
      contactInfo,
      notes: notes || ''
    };

    // Update in Firestore
    await therapistService.update(id, updateData);

    return NextResponse.json({
      message: 'פרטי מטפל עודכנו בהצלחה'
    });

  } catch (error: any) {
    console.error('Update therapist error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון פרטי המטפל' },
      { status: 500 }
    );
  }
}
