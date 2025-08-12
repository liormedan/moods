# Mood Management API Implementation

## Overview

This directory contains the complete implementation of the Mood Management API for the Mental Health Tracker application. The API provides comprehensive endpoints for tracking, managing, and analyzing user mood data with full CRUD operations, bulk operations, and advanced analytics.

## Features Implemented

### ✅ Core CRUD Operations

- **GET** `/api/mood` - Retrieve mood entries with filtering and pagination
- **POST** `/api/mood` - Create new mood entries
- **GET** `/api/mood/[id]` - Get specific mood entry
- **PUT** `/api/mood/[id]` - Update existing mood entry
- **DELETE** `/api/mood/[id]` - Delete specific mood entry

### ✅ Advanced Features

- **GET** `/api/mood/stats` - Comprehensive mood statistics and analytics
- **POST** `/api/mood/bulk` - Bulk create multiple mood entries
- **DELETE** `/api/mood/bulk` - Bulk delete entries by date range or IDs

### ✅ Security & Validation

- Full authentication and authorization using NextAuth
- Input validation with Zod schemas
- User ownership verification for all operations
- Rate limiting protection
- SQL injection prevention via Prisma ORM

### ✅ Data Integrity

- Unique constraint enforcement (one entry per user per date)
- Transaction-based bulk operations
- Comprehensive error handling
- Input sanitization and validation

## File Structure

```
src/app/api/mood/
├── route.ts              # Main mood endpoints (GET, POST)
├── [id]/route.ts         # Individual mood entry operations
├── stats/route.ts        # Mood statistics and analytics
├── bulk/route.ts         # Bulk operations
└── README.md            # This file
```

## API Endpoints Summary

| Method | Endpoint          | Description                      | Auth Required |
| ------ | ----------------- | -------------------------------- | ------------- |
| GET    | `/api/mood`       | Get mood entries with pagination | ✅            |
| POST   | `/api/mood`       | Create new mood entry            | ✅            |
| GET    | `/api/mood/[id]`  | Get specific mood entry          | ✅            |
| PUT    | `/api/mood/[id]`  | Update mood entry                | ✅            |
| DELETE | `/api/mood/[id]`  | Delete mood entry                | ✅            |
| GET    | `/api/mood/stats` | Get mood statistics              | ✅            |
| POST   | `/api/mood/bulk`  | Bulk create entries              | ✅            |
| DELETE | `/api/mood/bulk`  | Bulk delete entries              | ✅            |

## Key Implementation Details

### 1. Authentication & Authorization

- All endpoints are protected by NextAuth middleware
- Users can only access their own mood data
- Session validation on every request

### 2. Input Validation

- Zod schemas for request validation
- Mood values restricted to 1-10 scale
- Date format validation (ISO strings)
- Notes length limits (max 1000 characters)

### 3. Database Operations

- Prisma ORM for type-safe database queries
- Optimized queries with proper indexing
- Transaction support for bulk operations
- Efficient pagination implementation

### 4. Error Handling

- Consistent error response format
- Appropriate HTTP status codes
- Detailed validation error messages
- Graceful fallbacks for edge cases

### 5. Performance Features

- Pagination support (default: 30, max: 100)
- Date-based filtering
- Efficient bulk operations
- Rate limiting protection

## Usage Examples

### Creating a Mood Entry

```typescript
const response = await fetch('/api/mood', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    moodValue: 8,
    notes: 'Feeling great today!',
    date: '2024-01-15', // Optional
  }),
});
```

### Getting Mood Statistics

```typescript
const response = await fetch('/api/mood/stats?period=30');
const stats = await response.json();
console.log(`Average mood: ${stats.data.averageMood}`);
console.log(`Trend: ${stats.data.moodTrend}`);
```

### Bulk Operations

```typescript
const response = await fetch('/api/mood/bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    entries: [
      { moodValue: 8, date: '2024-01-01', notes: 'Day 1' },
      { moodValue: 7, date: '2024-01-02', notes: 'Day 2' },
    ],
  }),
});
```

## Testing

The API includes comprehensive integration tests covering:

- **Authentication tests** - Unauthorized access handling
- **Validation tests** - Input validation and error responses
- **CRUD tests** - All basic operations
- **Bulk operation tests** - Multi-entry operations
- **Statistics tests** - Analytics calculations
- **Edge case tests** - Error conditions and constraints

Run tests with:

```bash
npm test
```

## Dependencies

- **Next.js 14** - API routes framework
- **NextAuth** - Authentication and session management
- **Prisma** - Database ORM and type safety
- **Zod** - Schema validation
- **PostgreSQL** - Database backend

## Security Considerations

1. **Authentication Required** - All endpoints require valid sessions
2. **User Isolation** - Users can only access their own data
3. **Input Validation** - All inputs are validated and sanitized
4. **Rate Limiting** - Protection against API abuse
5. **SQL Injection Protection** - Prisma ORM prevents SQL injection
6. **Data Exposure Prevention** - Sensitive fields (userId) are excluded from responses

## Performance Optimizations

1. **Efficient Queries** - Optimized database queries with proper indexing
2. **Pagination** - Large dataset handling without memory issues
3. **Bulk Operations** - Efficient handling of multiple entries
4. **Caching Ready** - Response structure supports client-side caching
5. **Rate Limiting** - Prevents server overload

## Future Enhancements

Potential improvements for future versions:

1. **Real-time Updates** - WebSocket support for live mood tracking
2. **Advanced Analytics** - Machine learning insights and predictions
3. **Export Functionality** - CSV/JSON export of mood data
4. **Reminder System** - Automated mood tracking reminders
5. **Social Features** - Anonymous mood sharing and community insights
6. **Mobile API** - Optimized endpoints for mobile applications

## Contributing

When contributing to the mood API:

1. Follow the existing code structure and patterns
2. Add comprehensive tests for new features
3. Update documentation for any API changes
4. Ensure proper error handling and validation
5. Test with various edge cases and error conditions

## Support

For questions or issues with the mood API:

1. Check the comprehensive API documentation
2. Review the integration tests for usage examples
3. Check the error logs for debugging information
4. Create an issue in the repository with detailed information

## License

This implementation is part of the Mental Health Tracker project and follows the project's licensing terms.
