import { NextRequest, NextResponse } from 'next/server';

interface DataExportRequest {
  id: string;
  type: 'full' | 'partial';
  status: 'pending' | 'processing' | 'ready' | 'expired';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  expiresAt?: string;
  categories: string[];
}

// Generate demo export requests
function generateExportRequests(): DataExportRequest[] {
  const now = new Date();
  return [
    {
      id: 'export-1',
      type: 'full',
      status: 'ready',
      requestedAt: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      completedAt: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      downloadUrl: '/downloads/full-export-2024.zip',
      expiresAt: new Date(
        now.getTime() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      categories: ['mood', 'journal', 'goals', 'breathing', 'profile'],
    },
    {
      id: 'export-2',
      type: 'partial',
      status: 'processing',
      requestedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      categories: ['mood', 'journal'],
    },
    {
      id: 'export-3',
      type: 'full',
      status: 'expired',
      requestedAt: new Date(
        now.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      completedAt: new Date(
        now.getTime() - 8 * 24 * 60 * 60 * 1000
      ).toISOString(),
      expiresAt: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      categories: ['mood', 'journal', 'goals'],
    },
  ];
}

// GET /api/privacy/exports - Get export requests
export async function GET() {
  try {
    const exportRequests = generateExportRequests();

    return NextResponse.json({
      success: true,
      data: exportRequests,
      metadata: {
        total: exportRequests.length,
        ready: exportRequests.filter((r) => r.status === 'ready').length,
        processing: exportRequests.filter((r) => r.status === 'processing')
          .length,
        expired: exportRequests.filter((r) => r.status === 'expired').length,
      },
      message: 'Export requests loaded successfully',
    });
  } catch (error) {
    console.error('Error loading export requests:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load export requests',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
