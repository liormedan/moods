import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, AuthenticatedUser } from '@/lib/auth-middleware';

export const GET = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
    try {
      console.log('🔍 Fetching insights for user:', user.email);

      // Get insights for the authenticated user only
      const insights = await prisma.insight.findMany({
        where: {
          userId: user.id,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      console.log('💡 Insights found:', insights.length);

      // Transform to match expected format
      const transformedInsights = insights.map((insight) => ({
        id: insight.id,
        title: insight.title,
        content: insight.description,
        type: insight.type,
        date: insight.createdAt.toISOString(),
        read: insight.isRead,
        priority: insight.priority,
        actionable: insight.actionable,
      }));

      return NextResponse.json({
        success: true,
        data: transformedInsights,
      });
    } catch (error) {
      console.error('❌ Insights fetch error:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  }
);

export const POST = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
    try {
      const body = await request.json();
      const { title, content, type, priority, actionable, expiresAt } = body;

      // Validate required fields
      if (!title || !content || !type) {
        return NextResponse.json(
          { error: 'Title, content, and type are required' },
          { status: 400 }
        );
      }

      // Create insight for the authenticated user
      const insight = await prisma.insight.create({
        data: {
          userId: user.id,
          title,
          description: content,
          type,
          priority: priority || 'medium',
          actionable: actionable || false,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });

      console.log('✅ Insight created for user:', user.email);

      return NextResponse.json({
        success: true,
        data: insight,
      });
    } catch (error) {
      console.error('❌ Insight creation error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);
