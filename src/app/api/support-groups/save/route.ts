import { NextRequest, NextResponse } from 'next/server';
import { supportGroupService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for support group
const supportGroupSchema = z.object({
  name: z.string().min(3, 'שם הקבוצה חייב להכיל לפחות 3 תווים'),
  description: z.string().min(10, 'תיאור הקבוצה חייב להכיל לפחות 10 תווים'),
  category: z.enum(['anxiety', 'depression', 'ptsd', 'bipolar', 'general', 'grief', 'addiction']),
  isPrivate: z.boolean().default(false),
  maxMembers: z.number().min(2).max(100, 'מספר החברים המקסימלי חייב להיות בין 2 ל-100').optional()
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
    const validationResult = supportGroupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { name, description, category, isPrivate, maxMembers } = validationResult.data;

    // Prepare support group data
    const supportGroupData = {
      name,
      description,
      category,
      isPrivate,
      maxMembers: maxMembers || 50,
      creatorId: userId,
      admins: [userId], // Creator is automatically an admin
      members: [userId] // Creator is automatically a member
    };

    // Save to Firestore
    const supportGroupId = await supportGroupService.create(supportGroupData);

    return NextResponse.json({
      message: 'קבוצת תמיכה נוצרה בהצלחה',
      id: supportGroupId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save support group error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה ביצירת קבוצת התמיכה' },
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
    const validationResult = supportGroupSchema.extend({
      id: z.string().min(1, 'מזהה קבוצת תמיכה נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, name, description, category, isPrivate, maxMembers } = validationResult.data;

    // Check if support group exists
    const existingGroup = await supportGroupService.getById(id);
    if (!existingGroup) {
      return NextResponse.json(
        { error: 'קבוצת תמיכה לא נמצאה' },
        { status: 404 }
      );
    }

    // Check if user is admin of the group
    if (!existingGroup.admins.includes(userId) && existingGroup.creatorId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך קבוצה זו' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      name,
      description,
      category,
      isPrivate,
      maxMembers: maxMembers || 50
    };

    // Update in Firestore
    await supportGroupService.update(id, updateData);

    return NextResponse.json({
      message: 'קבוצת תמיכה עודכנה בהצלחה'
    });

  } catch (error: any) {
    console.error('Update support group error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון קבוצת התמיכה' },
      { status: 500 }
    );
  }
}

// Add member to support group
export async function PATCH(request: NextRequest) {
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
    const validationResult = z.object({
      groupId: z.string().min(1, 'מזהה קבוצה נדרש'),
      action: z.enum(['add-member', 'remove-member', 'add-admin', 'remove-admin']),
      memberId: z.string().min(1, 'מזהה חבר נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { groupId, action, memberId } = validationResult.data;

    // Check if support group exists
    const existingGroup = await supportGroupService.getById(groupId);
    if (!existingGroup) {
      return NextResponse.json(
        { error: 'קבוצת תמיכה לא נמצאה' },
        { status: 404 }
      );
    }

    // Check if user is admin of the group
    if (!existingGroup.admins.includes(userId) && existingGroup.creatorId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לבצע פעולה זו' },
        { status: 403 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'add-member':
        if (!existingGroup.members.includes(memberId)) {
          updateData.members = [...existingGroup.members, memberId];
        }
        break;
      
      case 'remove-member':
        updateData.members = existingGroup.members.filter(id => id !== memberId);
        updateData.admins = existingGroup.admins.filter(id => id !== memberId);
        break;
      
      case 'add-admin':
        if (existingGroup.members.includes(memberId) && !existingGroup.admins.includes(memberId)) {
          updateData.admins = [...existingGroup.admins, memberId];
        }
        break;
      
      case 'remove-admin':
        if (memberId !== existingGroup.creatorId) {
          updateData.admins = existingGroup.admins.filter(id => id !== memberId);
        }
        break;
    }

    if (Object.keys(updateData).length > 0) {
      // Update in Firestore
      await supportGroupService.update(groupId, updateData);
    }

    return NextResponse.json({
      message: 'פעולה בוצעה בהצלחה'
    });

  } catch (error: any) {
    console.error('Update support group members error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון חברי הקבוצה' },
      { status: 500 }
    );
  }
}
