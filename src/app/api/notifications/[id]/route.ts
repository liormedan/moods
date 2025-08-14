import { NextRequest, NextResponse } from 'next/server';

// DELETE /api/notifications/[id] - Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Notification ID is required',
          message: 'Missing notification ID',
        },
        { status: 400 }
      );
    }

    // In a real app, delete the notification from the database
    console.log(`Deleting notification ${id}:`, {
      timestamp: new Date().toISOString(),
      notificationId: id,
      action: 'delete',
    });

    // Simulate database delete delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: {
        id,
        deleted: true,
        deletedAt: new Date().toISOString(),
      },
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete notification',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
