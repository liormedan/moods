import { NextRequest, NextResponse } from 'next/server';

// POST /api/support-groups/[id]/join - Join a support group
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Group ID is required',
          message: 'Missing group ID'
        },
        { status: 400 }
      );
    }

    // In a real app, add user to group in database
    console.log(`User joining group ${id}:`, {
      timestamp: new Date().toISOString(),
      groupId: id,
      action: 'join_group'
    });

    // Simulate join delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      data: {
        groupId: id,
        joined: true,
        joinedAt: new Date().toISOString(),
        memberStatus: 'active'
      },
      message: 'Successfully joined the support group'
    });
  } catch (error) {
    console.error('Error joining support group:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to join support group',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}