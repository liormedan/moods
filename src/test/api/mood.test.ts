import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { GET, POST } from '@/app/api/mood/route';
import { GET as GETById, PUT, DELETE } from '@/app/api/mood/[id]/route';
import { GET as GETStats } from '@/app/api/mood/stats/route';
import {
  POST as POSTBulk,
  DELETE as DELETEBulk,
} from '@/app/api/mood/bulk/route';

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

const { getServerSession } = require('next-auth');

describe('Mood API', () => {
  let mockUserId: string;
  let testMoodEntry: any;

  beforeEach(async () => {
    // Clear database before each test
    await prisma.moodEntry.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
      },
    });
    mockUserId = user.id;

    // Mock authenticated session
    getServerSession.mockResolvedValue({
      user: { id: mockUserId, email: 'test@example.com' },
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.moodEntry.deleteMany();
    await prisma.user.deleteMany();
    jest.clearAllMocks();
  });

  describe('GET /api/mood', () => {
    it('should return empty array when no mood entries exist', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/mood',
      });

      const response = await GET(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });

    it('should return mood entries for authenticated user', async () => {
      // Create test mood entries
      const entries = await Promise.all([
        prisma.moodEntry.create({
          data: {
            userId: mockUserId,
            moodValue: 8,
            notes: 'Great day!',
            date: new Date('2024-01-01'),
          },
        }),
        prisma.moodEntry.create({
          data: {
            userId: mockUserId,
            moodValue: 6,
            notes: 'Okay day',
            date: new Date('2024-01-02'),
          },
        }),
      ]);

      const { req } = createMocks({
        method: 'GET',
        url: '/api/mood',
      });

      const response = await GET(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.pagination.total).toBe(2);
      expect(data.data[0].moodValue).toBe(6); // Most recent first
    });

    it('should filter by date', async () => {
      // Create entries for different dates
      await prisma.moodEntry.create({
        data: {
          userId: mockUserId,
          moodValue: 8,
          date: new Date('2024-01-01'),
        },
      });

      await prisma.moodEntry.create({
        data: {
          userId: mockUserId,
          moodValue: 6,
          date: new Date('2024-01-15'),
        },
      });

      const { req } = createMocks({
        method: 'GET',
        url: '/api/mood?date=2024-01-01',
      });

      const response = await GET(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].moodValue).toBe(8);
    });

    it('should handle pagination', async () => {
      // Create 25 entries
      const entries = Array.from({ length: 25 }, (_, i) => ({
        userId: mockUserId,
        moodValue: 5 + (i % 5),
        date: new Date(2024, 0, i + 1),
      }));

      await prisma.moodEntry.createMany({ data: entries });

      const { req } = createMocks({
        method: 'GET',
        url: '/api/mood?limit=10&offset=10',
      });

      const response = await GET(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(10);
      expect(data.pagination.offset).toBe(10);
      expect(data.pagination.hasMore).toBe(true);
    });

    it('should return 401 for unauthenticated requests', async () => {
      getServerSession.mockResolvedValue(null);

      const { req } = createMocks({
        method: 'GET',
        url: '/api/mood',
      });

      const response = await GET(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('POST /api/mood', () => {
    it('should create a new mood entry', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          moodValue: 8,
          notes: 'Feeling great today!',
        },
      });

      const response = await POST(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('Mood entry created successfully');
      expect(data.data.moodValue).toBe(8);
      expect(data.data.notes).toBe('Feeling great today!');
      expect(data.data.userId).toBeUndefined(); // Should not expose userId
    });

    it('should create entry with specific date', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          moodValue: 7,
          date: '2024-01-15',
        },
      });

      const response = await POST(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(new Date(data.data.date).toISOString().split('T')[0]).toBe(
        '2024-01-15'
      );
    });

    it('should validate mood value range', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          moodValue: 11, // Invalid: should be 1-10
          notes: 'Test',
        },
      });

      const response = await POST(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid input');
    });

    it('should prevent duplicate entries for same date', async () => {
      // Create first entry
      await prisma.moodEntry.create({
        data: {
          userId: mockUserId,
          moodValue: 8,
          date: new Date('2024-01-01'),
        },
      });

      // Try to create another entry for the same date
      const { req } = createMocks({
        method: 'POST',
        body: {
          moodValue: 6,
          date: '2024-01-01',
        },
      });

      const response = await POST(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe('Mood entry already exists for this date');
    });
  });

  describe('GET /api/mood/[id]', () => {
    beforeEach(async () => {
      testMoodEntry = await prisma.moodEntry.create({
        data: {
          userId: mockUserId,
          moodValue: 8,
          notes: 'Test entry',
          date: new Date('2024-01-01'),
        },
      });
    });

    it('should return a specific mood entry', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: `/api/mood/${testMoodEntry.id}`,
      });

      const response = await GETById(req as NextRequest, {
        params: { id: testMoodEntry.id },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.id).toBe(testMoodEntry.id);
      expect(data.data.moodValue).toBe(8);
    });

    it('should return 404 for non-existent entry', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/mood/nonexistent',
      });

      const response = await GETById(req as NextRequest, {
        params: { id: 'nonexistent' },
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Mood entry not found');
    });

    it('should return 403 for entry owned by different user', async () => {
      // Create another user and entry
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@example.com',
          name: 'Other User',
          password: 'hashedpassword',
        },
      });

      const otherEntry = await prisma.moodEntry.create({
        data: {
          userId: otherUser.id,
          moodValue: 5,
          date: new Date('2024-01-01'),
        },
      });

      const { req } = createMocks({
        method: 'GET',
        url: `/api/mood/${otherEntry.id}`,
      });

      const response = await GETById(req as NextRequest, {
        params: { id: otherEntry.id },
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden');
    });
  });

  describe('PUT /api/mood/[id]', () => {
    beforeEach(async () => {
      testMoodEntry = await prisma.moodEntry.create({
        data: {
          userId: mockUserId,
          moodValue: 8,
          notes: 'Original note',
          date: new Date('2024-01-01'),
        },
      });
    });

    it('should update a mood entry', async () => {
      const { req } = createMocks({
        method: 'PUT',
        body: {
          moodValue: 9,
          notes: 'Updated note',
        },
      });

      const response = await PUT(req as NextRequest, {
        params: { id: testMoodEntry.id },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Mood entry updated successfully');
      expect(data.data.moodValue).toBe(9);
      expect(data.data.notes).toBe('Updated note');
    });

    it('should validate update data', async () => {
      const { req } = createMocks({
        method: 'PUT',
        body: {
          moodValue: 15, // Invalid: should be 1-10
        },
      });

      const response = await PUT(req as NextRequest, {
        params: { id: testMoodEntry.id },
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid input');
    });
  });

  describe('DELETE /api/mood/[id]', () => {
    beforeEach(async () => {
      testMoodEntry = await prisma.moodEntry.create({
        data: {
          userId: mockUserId,
          moodValue: 8,
          date: new Date('2024-01-01'),
        },
      });
    });

    it('should delete a mood entry', async () => {
      const { req } = createMocks({
        method: 'DELETE',
        url: `/api/mood/${testMoodEntry.id}`,
      });

      const response = await DELETE(req as NextRequest, {
        params: { id: testMoodEntry.id },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Mood entry deleted successfully');

      // Verify entry was deleted
      const deletedEntry = await prisma.moodEntry.findUnique({
        where: { id: testMoodEntry.id },
      });
      expect(deletedEntry).toBeNull();
    });
  });

  describe('GET /api/mood/stats', () => {
    beforeEach(async () => {
      // Create test entries over the last 30 days
      const entries = Array.from({ length: 20 }, (_, i) => ({
        userId: mockUserId,
        moodValue: 5 + (i % 6), // Values 5-10
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      }));

      await prisma.moodEntry.createMany({ data: entries });
    });

    it('should return mood statistics', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/mood/stats?period=30',
      });

      const response = await GETStats(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.totalEntries).toBe(20);
      expect(data.data.averageMood).toBeGreaterThan(0);
      expect(data.data.moodTrend).toBeDefined();
      expect(data.data.streakDays).toBeGreaterThan(0);
      expect(data.data.insights).toBeInstanceOf(Array);
    });

    it('should handle different periods', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/mood/stats?period=7',
      });

      const response = await GETStats(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.period).toBe(7);
    });

    it('should validate period parameter', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/mood/stats?period=400', // Invalid: > 365
      });

      const response = await GETStats(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid period');
    });
  });

  describe('POST /api/mood/bulk', () => {
    it('should create multiple mood entries', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          entries: [
            { moodValue: 8, date: '2024-01-01', notes: 'Day 1' },
            { moodValue: 7, date: '2024-01-02', notes: 'Day 2' },
            { moodValue: 9, date: '2024-01-03', notes: 'Day 3' },
          ],
        },
      });

      const response = await POSTBulk(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toContain('3 mood entries');
      expect(data.data).toHaveLength(3);
    });

    it('should prevent duplicate dates in bulk request', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          entries: [
            { moodValue: 8, date: '2024-01-01' },
            { moodValue: 7, date: '2024-01-01' }, // Duplicate date
          ],
        },
      });

      const response = await POSTBulk(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Duplicate dates found in request');
    });

    it('should limit bulk entries to 100', async () => {
      const entries = Array.from({ length: 101 }, (_, i) => ({
        moodValue: 5,
        date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
      }));

      const { req } = createMocks({
        method: 'POST',
        body: { entries },
      });

      const response = await POSTBulk(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid input');
    });
  });

  describe('DELETE /api/mood/bulk', () => {
    beforeEach(async () => {
      // Create test entries
      await prisma.moodEntry.createMany({
        data: [
          { userId: mockUserId, moodValue: 8, date: new Date('2024-01-01') },
          { userId: mockUserId, moodValue: 7, date: new Date('2024-01-02') },
          { userId: mockUserId, moodValue: 6, date: new Date('2024-01-03') },
        ],
      });
    });

    it('should delete entries by date range', async () => {
      const { req } = createMocks({
        method: 'DELETE',
        url: '/api/mood/bulk?startDate=2024-01-01&endDate=2024-01-02',
      });

      const response = await DELETEBulk(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deletedCount).toBe(2);

      // Verify remaining entry
      const remaining = await prisma.moodEntry.count({
        where: { userId: mockUserId },
      });
      expect(remaining).toBe(1);
    });

    it('should delete entries by IDs', async () => {
      const entries = await prisma.moodEntry.findMany({
        where: { userId: mockUserId },
        select: { id: true },
      });

      const ids = entries
        .slice(0, 2)
        .map((e) => e.id)
        .join(',');
      const { req } = createMocks({
        method: 'DELETE',
        url: `/api/mood/bulk?ids=${ids}`,
      });

      const response = await DELETEBulk(req as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deletedCount).toBe(2);
    });
  });
});
