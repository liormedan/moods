import type { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/mood/route';
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  prisma: {
    moodEntry: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
  NextRequest: class {},
}));

describe('Mood API route', () => {
  const mockSession = { user: { id: 'user-1' } } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/mood', () => {
    it('returns mood entries for authenticated user', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      (prisma.moodEntry.findMany as jest.Mock).mockResolvedValue([
        {
          id: '1',
          moodValue: 7,
          notes: 'good',
          date: new Date('2024-01-01'),
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ]);
      (prisma.moodEntry.count as jest.Mock).mockResolvedValue(1);

      const req = { url: 'http://localhost/api/mood' } as NextRequest;
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data).toHaveLength(1);
    });

    it('returns 401 when user is not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      const req = { url: 'http://localhost/api/mood' } as NextRequest;
      const res = await GET(req);
      expect(res.status).toBe(401);
    });

    it('returns 500 on server error', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      (prisma.moodEntry.findMany as jest.Mock).mockRejectedValue(
        new Error('db error')
      );
      const req = { url: 'http://localhost/api/mood' } as NextRequest;
      const res = await GET(req);
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/mood', () => {
    it('creates a mood entry successfully', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      (prisma.moodEntry.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.moodEntry.create as jest.Mock).mockResolvedValue({
        id: '1',
        moodValue: 5,
        notes: 'ok',
        date: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      });

      const req = {
        url: 'http://localhost/api/mood',
        json: async () => ({ moodValue: 5, notes: 'ok', date: '2024-01-01' }),
      } as NextRequest;

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.data.id).toBe('1');
    });

    it('returns 400 for validation errors', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      const req = {
        url: 'http://localhost/api/mood',
        json: async () => ({ moodValue: 11 }),
      } as NextRequest;
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it('returns 401 when user is not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      const req = {
        url: 'http://localhost/api/mood',
        json: async () => ({ moodValue: 5 }),
      } as NextRequest;
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('returns 500 when prisma throws an error', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      (prisma.moodEntry.findUnique as jest.Mock).mockRejectedValue(
        new Error('db error')
      );
      const req = {
        url: 'http://localhost/api/mood',
        json: async () => ({ moodValue: 5 }),
      } as NextRequest;
      const res = await POST(req);
      expect(res.status).toBe(500);
    });
  });
});

