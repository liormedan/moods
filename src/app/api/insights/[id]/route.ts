import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for insight updates
const insightUpdateSchema = z.object({
  isRead: z.boolean().optional(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  actionable: z.boolean().optional(),
});

// PATCH /api/insights/[id] - Update specific insight
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = insightUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Check if insight exists and belongs to user
    const existingInsight = await prisma.insight.findFirst({
      where: {
        id,
        userId: (session as any).user.id,
      },
    });

    if (!existingInsight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    // Update the insight
    const updatedInsight = await prisma.insight.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json({ data: updatedInsight });
  } catch (error) {
    console.error('Error updating insight:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/insights/[id] - Delete specific insight
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if insight exists and belongs to user
    const existingInsight = await prisma.insight.findFirst({
      where: {
        id,
        userId: (session as any).user.id,
      },
    });

    if (!existingInsight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    // Delete the insight
    await prisma.insight.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Insight deleted successfully' });
  } catch (error) {
    console.error('Error deleting insight:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
