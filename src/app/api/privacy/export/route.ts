import { NextRequest, NextResponse } from 'next/server';

// POST /api/privacy/export - Request data export
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, categories } = body;

    if (!type || !['full', 'partial'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid export type',
          message: 'Export type must be "full" or "partial"',
        },
        { status: 400 }
      );
    }

    const exportRequest = {
      id: `export-${Date.now()}`,
      type,
      status: 'pending' as const,
      requestedAt: new Date().toISOString(),
      categories:
        type === 'full'
          ? [
              'mood',
              'journal',
              'goals',
              'breathing',
              'profile',
              'settings',
              'activity',
            ]
          : categories || ['mood', 'journal'],
    };

    console.log('Data export requested:', {
      timestamp: new Date().toISOString(),
      exportId: exportRequest.id,
      type: exportRequest.type,
      categories: exportRequest.categories,
    });

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      data: exportRequest,
      message: 'Data export request submitted successfully',
    });
  } catch (error) {
    console.error('Error requesting data export:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to request data export',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
