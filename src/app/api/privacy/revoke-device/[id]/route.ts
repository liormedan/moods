import { NextRequest, NextResponse } from 'next/server';

// POST /api/privacy/revoke-device/[id] - Revoke device access
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
          error: 'Device ID is required',
          message: 'Missing device ID',
        },
        { status: 400 }
      );
    }

    // In a real app, revoke device access in database
    console.log(`Revoking device access ${id}:`, {
      timestamp: new Date().toISOString(),
      deviceId: id,
      action: 'revoke_device_access',
    });

    // Simulate revocation delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: {
        deviceId: id,
        revoked: true,
        revokedAt: new Date().toISOString(),
      },
      message: 'Device access revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking device access:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to revoke device access',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
