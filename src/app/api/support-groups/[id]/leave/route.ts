import { NextRequest, NextResponse } from 'next/server';

// POST /api/support-groups/[id]/leave - Leave a support group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Group ID is required',
          message: 'Missing group ID',
        },
        { status: 400 }
      );
    }

    // In a real app, remove user from group in database
    console.log(`User leaving group ${id}:`, {
      timestamp: new Date().toISOString(),
      groupId: id,
      action: 'leave_group',
    });

    // Simulate leave delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({
      success: true,
      data: {
        groupId: id,
        joined: false,
        leftAt: new Date().toISOString(),
        memberStatus: 'inactive',
      },
      message: 'Successfully left the support group',
    });
  } catch (error) {
    console.error('Error leaving support group:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to leave support group',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
