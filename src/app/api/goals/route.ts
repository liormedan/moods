import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  getDocs, 
  addDoc, 
  getCountFromServer, 
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { z } from 'zod';

// Validation schema for goal
const goalSchema = z.object({
  title: z.string().min(1, 'כותרת נדרשת').max(200, 'כותרת ארוכה מדי'),
  description: z.string().max(1000, 'תיאור ארוך מדי').optional(),
  category: z.enum([
    'mental-health',
    'physical',
    'social',
    'personal',
    'professional',
  ]),
  targetDate: z.string().min(1, 'תאריך יעד נדרש'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  milestones: z
    .array(
      z.object({
        title: z.string().min(1, 'כותרת אבן דרך נדרשת'),
        completed: z.boolean().default(false),
        dueDate: z.string().optional(),
      })
    )
    .default([]),
});

// GET /api/goals - Get goals for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build Firebase query
    let goalsQuery = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (category && category !== 'all') {
      goalsQuery = query(goalsQuery, where('category', '==', category));
    }

    if (status && status !== 'all') {
      goalsQuery = query(goalsQuery, where('status', '==', status));
    }

    // Get total count for pagination
    const countQuery = query(
      collection(db, 'goals'),
      where('userId', '==', userId)
    );
    const countSnapshot = await getCountFromServer(countQuery);
    const totalCount = countSnapshot.data().count;

    // Get goals from Firebase
    goalsQuery = query(goalsQuery, firestoreLimit(Math.min(limit, 100)));

    const goalsSnapshot = await getDocs(goalsQuery);
    const goals = goalsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description || '',
        category: data.category,
        targetDate: data.targetDate.toDate().toISOString().split('T')[0],
        progress: data.progress || 0,
        status: data.status || 'not-started',
        priority: data.priority || 'medium',
        milestones: data.milestones || [],
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
        completedAt: data.completedAt ? data.completedAt.toDate().toISOString() : null,
      };
    });

    return NextResponse.json({
      data: goals,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: NextRequest) {
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
    const validationResult = goalSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { title, description, category, targetDate, priority, milestones } =
      validationResult.data;

    // Calculate initial progress and status
    const completedMilestones = milestones.filter((m) => m.completed).length;
    const progress =
      milestones.length > 0
        ? Math.round((completedMilestones / milestones.length) * 100)
        : 0;

    let status: 'not-started' | 'in-progress' | 'completed' | 'overdue' =
      'not-started';
    if (progress === 100) {
      status = 'completed';
    } else if (progress > 0) {
      status = 'in-progress';
    }

    // Check if overdue
    const target = new Date(targetDate);
    const now = new Date();
    if (target < now && status !== 'completed') {
      status = 'overdue';
    }

    // Create new goal
    const goalData = {
      userId: userId,
      title,
      description: description || '',
      category,
      targetDate: Timestamp.fromDate(new Date(targetDate)),
      progress,
      status,
      priority,
      milestones: milestones,
      completedAt: status === 'completed' ? Timestamp.now() : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'goals'), goalData);

    const goal = {
      id: docRef.id,
      title,
      description: description || '',
      category,
      targetDate: targetDate,
      progress,
      status,
      priority,
      milestones: milestones,
      createdAt: goalData.createdAt.toDate().toISOString(),
      updatedAt: goalData.updatedAt.toDate().toISOString(),
      completedAt: goalData.completedAt ? goalData.completedAt.toDate().toISOString() : null,
    };

    return NextResponse.json(
      {
        message: 'Goal created successfully',
        data: goal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/goals - Update a goal
export async function PUT(request: NextRequest) {
  try {
    // Mock user ID for demo
    const userId = 'demo-user';

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    // Check if goal exists and belongs to user
    const goalRef = doc(db, 'goals', id);
    const goalSnap = await getDoc(goalRef);

    if (!goalSnap.exists()) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    const goalData = goalSnap.data();
    if (goalData.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update goal
    const updateDataWithTimestamp = {
      ...updateData,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(goalRef, updateDataWithTimestamp);

    // Get updated data
    const updatedGoalSnap = await getDoc(goalRef);
    const updatedGoalData = updatedGoalSnap.data()!;

    const updatedGoal = {
      id: updatedGoalSnap.id,
      ...updatedGoalData,
      targetDate: updatedGoalData.targetDate.toDate().toISOString().split('T')[0],
      createdAt: updatedGoalData.createdAt.toDate().toISOString(),
      updatedAt: updatedGoalData.updatedAt.toDate().toISOString(),
      completedAt: updatedGoalData.completedAt ? updatedGoalData.completedAt.toDate().toISOString() : null,
    };

    return NextResponse.json({
      message: 'Goal updated successfully',
      data: updatedGoal,
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/goals - Delete a goal
export async function DELETE(request: NextRequest) {
  try {
    // Mock user ID for demo
    const userId = 'demo-user';

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    // Check if goal exists and belongs to user
    const goalRef = doc(db, 'goals', id);
    const goalSnap = await getDoc(goalRef);

    if (!goalSnap.exists()) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    const goalData = goalSnap.data();
    if (goalData.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete goal
    await deleteDoc(goalRef);

    return NextResponse.json({
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
