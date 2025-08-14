import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore';
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
    const insightRef = doc(db, 'insights', id);
    const insightSnap = await getDoc(insightRef);

    if (!insightSnap.exists()) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    const insightData = insightSnap.data();
    if (insightData.userId !== (session as any).user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the insight
    const updateData = {
      ...validationResult.data,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(insightRef, updateData);

    // Get updated data
    const updatedInsightSnap = await getDoc(insightRef);
    const updatedInsightData = updatedInsightSnap.data()!;

    const updatedInsight = {
      id: updatedInsightSnap.id,
      ...updatedInsightData,
      createdAt: updatedInsightData.createdAt.toDate().toISOString(),
      updatedAt: updatedInsightData.updatedAt.toDate().toISOString(),
    };

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
    const insightRef = doc(db, 'insights', id);
    const insightSnap = await getDoc(insightRef);

    if (!insightSnap.exists()) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    const insightData = insightSnap.data();
    if (insightData.userId !== (session as any).user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the insight
    await deleteDoc(insightRef);

    return NextResponse.json({
      message: 'Insight deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting insight:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
