import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for profile updates
const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'שם פרטי נדרש')
    .max(50, 'שם פרטי ארוך מדי')
    .optional(),
  lastName: z
    .string()
    .min(1, 'שם משפחה נדרש')
    .max(50, 'שם משפחה ארוך מדי')
    .optional(),
  phone: z
    .string()
    .regex(/^[0-9\-\+\s\(\)]*$/, 'מספר טלפון לא תקין')
    .optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  location: z.string().max(100, 'מיקום ארוך מדי').optional(),
  bio: z.string().max(500, 'תיאור ארוך מדי').optional(),
  language: z.enum(['hebrew', 'english', 'arabic']).optional(),
  timezone: z.string().optional(),
  preferences: z
    .object({
      theme: z.enum(['light', 'dark', 'auto']).optional(),
      notifications: z
        .object({
          email: z.boolean().optional(),
          push: z.boolean().optional(),
          sms: z.boolean().optional(),
        })
        .optional(),
      privacy: z
        .object({
          shareData: z.boolean().optional(),
          anonymousMode: z.boolean().optional(),
          dataRetention: z.number().min(30).max(3650).optional(), // 30 days to 10 years
        })
        .optional(),
    })
    .optional(),
});

// GET /api/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    // In a real app, fetch from database
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     // ... other fields
    //   }
    // });

    // Mock profile data
    const profile = {
      id: userId,
      firstName: 'יוסי',
      lastName: 'כהן',
      email: 'demo@example.com',
      phone: '050-1234567',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      location: 'תל אביב, ישראל',
      timezone: 'Asia/Jerusalem',
      language: 'hebrew',
      profileImage: null,
      bio: 'אני מתעניין בבריאות הנפש ומחפש דרכים לשפר את הרווחה האישית שלי.',
      preferences: {
        theme: 'auto',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          shareData: false,
          anonymousMode: false,
          dataRetention: 365,
        },
      },
      createdAt: '2024-01-01T00:00:00Z',
      lastActive: new Date().toISOString(),
    };

    // Get activity statistics
    const stats = await getActivityStats(userId);

    return NextResponse.json({
      data: {
        ...profile,
        ...stats,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    const body = await request.json();

    // Validate input
    const validationResult = profileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // In a real app, update the database
    // const updatedUser = await prisma.user.update({
    //   where: { id: userId },
    //   data: updateData,
    // });

    // For demo, just return the updated data
    const updatedProfile = {
      id: userId,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Log the activity
    await logActivity(userId, 'profile_update', 'עדכון פרטי פרופיל');

    return NextResponse.json({
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/profile - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    const { searchParams } = new URL(request.url);
    const confirmDelete = searchParams.get('confirm');

    if (confirmDelete !== 'true') {
      return NextResponse.json(
        { error: 'Confirmation required' },
        { status: 400 }
      );
    }

    // In a real app, delete all user data
    // await prisma.$transaction([
    //   prisma.moodEntry.deleteMany({ where: { userId } }),
    //   prisma.journalEntry.deleteMany({ where: { userId } }),
    //   prisma.breathingSession.deleteMany({ where: { userId } }),
    //   prisma.goal.deleteMany({ where: { userId } }),
    //   prisma.user.delete({ where: { id: userId } }),
    // ]);

    // Log the activity before deletion
    await logActivity(userId, 'account_deleted', 'מחיקת חשבון משתמש');

    return NextResponse.json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get activity statistics
async function getActivityStats(userId: string) {
  try {
    // In a real app, query the database
    // const [moodCount, journalCount, breathingCount, goalStats] = await Promise.all([
    //   prisma.moodEntry.count({ where: { userId } }),
    //   prisma.journalEntry.count({ where: { userId } }),
    //   prisma.breathingSession.count({ where: { userId } }),
    //   prisma.goal.aggregate({
    //     where: { userId },
    //     _count: { id: true },
    //     _sum: { progress: true },
    //   }),
    // ]);

    // Mock data for demo
    return {
      totalMoodEntries: 156,
      totalJournalEntries: 89,
      totalBreathingSessions: 234,
      totalGoals: 12,
      completedGoals: 8,
      averageProgress: 75,
      streakDays: 14,
      totalPoints: 2450,
    };
  } catch (error) {
    console.error('Error getting activity stats:', error);
    return {
      totalMoodEntries: 0,
      totalJournalEntries: 0,
      totalBreathingSessions: 0,
      totalGoals: 0,
      completedGoals: 0,
      averageProgress: 0,
      streakDays: 0,
      totalPoints: 0,
    };
  }
}

// Helper function to log user activity
async function logActivity(
  userId: string,
  action: string,
  description: string
) {
  try {
    // In a real app, save to database
    // await prisma.activityLog.create({
    //   data: {
    //     userId,
    //     action,
    //     description,
    //     timestamp: new Date(),
    //     ipAddress: request.ip,
    //     userAgent: request.headers.get('user-agent'),
    //   },
    // });

    console.log(
      `Activity logged: ${action} - ${description} for user ${userId}`
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}
