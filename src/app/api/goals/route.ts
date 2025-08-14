import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for goal
const goalSchema = z.object({
  title: z.string().min(1, 'כותרת נדרשת').max(200, 'כותרת ארוכה מדי'),
  description: z.string().max(1000, 'תיאור ארוך מדי').optional(),
  category: z.enum(['mental-health', 'physical', 'social', 'personal', 'professional']),
  targetDate: z.string().min(1, 'תאריך יעד נדרש'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  milestones: z.array(z.object({
    title: z.string().min(1, 'כותרת אבן דרך נדרשת'),
    completed: z.boolean().default(false),
    dueDate: z.string().optional(),
  })).default([]),
});

// GET /api/goals - Get goals for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await getServerSession(authOptions);
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

    // Build where clause
    const where: any = { userId: userId };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const goals = await prisma.goal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
      skip: offset,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        targetDate: true,
        progress: true,
        status: true,
        priority: true,
        milestones: true,
        createdAt: true,
        updatedAt: true,
        completedAt: true,
      },
    });

    // Parse milestones from JSON
    const formattedGoals = goals.map(goal => ({
      ...goal,
      milestones: goal.milestones ? JSON.parse(goal.milestones) : [],
    }));

    // Get total count for pagination
    const totalCount = await prisma.goal.count({ where });

    return NextResponse.json({
      data: formattedGoals,
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
    // const session = await getServerSession(authOptions);
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

    const { title, description, category, targetDate, priority, milestones } = validationResult.data;

    // Calculate initial progress and status
    const completedMilestones = milestones.filter(m => m.completed).length;
    const progress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;
    
    let status: 'not-started' | 'in-progress' | 'completed' | 'overdue' = 'not-started';
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
    const goal = await prisma.goal.create({
      data: {
        userId: userId,
        title,
        description: description || '',
        category,
        targetDate: new Date(targetDate),
        progress,
        status,
        priority,
        milestones: JSON.stringify(milestones),
        completedAt: status === 'completed' ? new Date() : null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        targetDate: true,
        progress: true,
        status: true,
        priority: true,
        milestones: true,
        createdAt: true,
        updatedAt: true,
        completedAt: true,
      },
    });

    // Parse milestones for response
    const formattedGoal = {
      ...goal,
      milestones: goal.milestones ? JSON.parse(goal.milestones) : [],
    };

    return NextResponse.json(
      {
        message: 'Goal created successfully',
        data: formattedGoal,
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
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    // Validate update data
    const validationResult = goalSchema.partial().safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Calculate progress and status if milestones are updated
    let calculatedData: any = { ...validatedData };
    
    if (validatedData.milestones) {
      const completedMilestones = validatedData.milestones.filter(m => m.completed).length;
      const progress = validatedData.milestones.length > 0 ? 
        Math.round((completedMilestones / validatedData.milestones.length) * 100) : 0;
      
      let status: 'not-started' | 'in-progress' | 'completed' | 'overdue' = 'not-started';
      if (progress === 100) {
        status = 'completed';
      } else if (progress > 0) {
        status = 'in-progress';
      }

      // Check if overdue
      const targetDate = validatedData.targetDate || (await prisma.goal.findUnique({
        where: { id },
        select: { targetDate: true }
      }))?.targetDate;
      
      if (targetDate) {
        const target = new Date(targetDate);
        const now = new Date();
        if (target < now && status !== 'completed') {
          status = 'overdue';
        }
      }

      calculatedData.progress = progress;
      calculatedData.status = status;
      calculatedData.milestones = JSON.stringify(validatedData.milestones);
      calculatedData.completedAt = status === 'completed' ? new Date() : null;
    }

    // Convert targetDate to Date object if provided
    if (calculatedData.targetDate) {
      calculatedData.targetDate = new Date(calculatedData.targetDate);
    }

    // Update goal
    const goal = await prisma.goal.update({
      where: { 
        id: id,
        userId: userId // Ensure user can only update their own goals
      },
      data: calculatedData,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        targetDate: true,
        progress: true,
        status: true,
        priority: true,
        milestones: true,
        createdAt: true,
        updatedAt: true,
        completedAt: true,
      },
    });

    // Parse milestones for response
    const formattedGoal = {
      ...goal,
      milestones: goal.milestones ? JSON.parse(goal.milestones) : [],
    };

    return NextResponse.json({
      message: 'Goal updated successfully',
      data: formattedGoal,
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
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
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    // Delete goal
    await prisma.goal.delete({
      where: { 
        id: id,
        userId: userId // Ensure user can only delete their own goals
      },
    });

    return NextResponse.json({
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}