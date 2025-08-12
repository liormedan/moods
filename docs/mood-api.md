# Mood Management API Documentation

## Overview

The Mood Management API provides comprehensive endpoints for tracking, managing, and analyzing user mood data. All endpoints require authentication and implement proper authorization to ensure users can only access their own data.

## Base URL

```
https://your-domain.com/api/mood
```

## Authentication

All endpoints require a valid NextAuth session. Include the session token in your requests.

## Endpoints

### 1. Get Mood Entries

**GET** `/api/mood`

Retrieves mood entries for the authenticated user with optional filtering and pagination.

#### Query Parameters

| Parameter | Type   | Required | Default | Description                                    |
| --------- | ------ | -------- | ------- | ---------------------------------------------- |
| `date`    | string | No       | -       | Filter by specific date (YYYY-MM-DD format)    |
| `limit`   | number | No       | 30      | Maximum number of entries to return (max: 100) |
| `offset`  | number | No       | 0       | Number of entries to skip for pagination       |

#### Response

```json
{
  "data": [
    {
      "id": "clx123abc",
      "moodValue": 8,
      "notes": "Feeling great today!",
      "date": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 30,
    "offset": 0,
    "hasMore": false
  }
}
```

#### Example Request

```bash
curl -X GET "https://your-domain.com/api/mood?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### 2. Create Mood Entry

**POST** `/api/mood`

Creates a new mood entry for the authenticated user.

#### Request Body

```json
{
  "moodValue": 8,
  "notes": "Feeling great today!",
  "date": "2024-01-15" // Optional, defaults to current date
}
```

#### Field Validation

| Field       | Type   | Required | Validation                   |
| ----------- | ------ | -------- | ---------------------------- |
| `moodValue` | number | Yes      | Integer between 1-10         |
| `notes`     | string | No       | Max 1000 characters          |
| `date`      | string | No       | ISO date string (YYYY-MM-DD) |

#### Response

```json
{
  "message": "Mood entry created successfully",
  "data": {
    "id": "clx123abc",
    "moodValue": 8,
    "notes": "Feeling great today!",
    "date": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Example Request

```bash
curl -X POST "https://your-domain.com/api/mood" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "moodValue": 8,
    "notes": "Feeling great today!"
  }'
```

### 3. Get Specific Mood Entry

**GET** `/api/mood/{id}`

Retrieves a specific mood entry by ID.

#### Path Parameters

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| `id`      | string | Yes      | Mood entry ID |

#### Response

```json
{
  "data": {
    "id": "clx123abc",
    "moodValue": 8,
    "notes": "Feeling great today!",
    "date": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Example Request

```bash
curl -X GET "https://your-domain.com/api/mood/clx123abc" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### 4. Update Mood Entry

**PUT** `/api/mood/{id}`

Updates an existing mood entry.

#### Path Parameters

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| `id`      | string | Yes      | Mood entry ID |

#### Request Body

```json
{
  "moodValue": 9, // Optional
  "notes": "Updated notes" // Optional
}
```

#### Response

```json
{
  "message": "Mood entry updated successfully",
  "data": {
    "id": "clx123abc",
    "moodValue": 9,
    "notes": "Updated notes",
    "date": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Example Request

```bash
curl -X PUT "https://your-domain.com/api/mood/clx123abc" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "moodValue": 9,
    "notes": "Updated notes"
  }'
```

### 5. Delete Mood Entry

**DELETE** `/api/mood/{id}`

Deletes a specific mood entry.

#### Path Parameters

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| `id`      | string | Yes      | Mood entry ID |

#### Response

```json
{
  "message": "Mood entry deleted successfully"
}
```

#### Example Request

```bash
curl -X DELETE "https://your-domain.com/api/mood/clx123abc" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### 6. Get Mood Statistics

**GET** `/api/mood/stats`

Retrieves comprehensive mood statistics and analytics for the authenticated user.

#### Query Parameters

| Parameter | Type   | Required | Default | Description                       |
| --------- | ------ | -------- | ------- | --------------------------------- |
| `period`  | number | No       | 30      | Number of days to analyze (1-365) |

#### Response

```json
{
  "data": {
    "period": 30,
    "totalEntries": 25,
    "averageMood": 7.2,
    "moodTrend": "improving",
    "moodDistribution": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4,
      "6": 5,
      "7": 6,
      "8": 3,
      "9": 1,
      "10": 0
    },
    "streakDays": 15,
    "recentMood": {
      "value": 8,
      "date": "2024-01-15T00:00:00.000Z"
    },
    "weeklyAverages": [
      {
        "week": "2024-01-01",
        "average": 6.8,
        "entries": 7
      }
    ],
    "insights": [
      "Your mood is generally positive. Keep it up!",
      "Your mood is trending upward - excellent progress!",
      "You're building a good habit with 15 consecutive days of tracking."
    ]
  }
}
```

#### Example Request

```bash
curl -X GET "https://your-domain.com/api/mood/stats?period=7" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### 7. Bulk Create Mood Entries

**POST** `/api/mood/bulk`

Creates multiple mood entries in a single request.

#### Request Body

```json
{
  "entries": [
    {
      "moodValue": 8,
      "date": "2024-01-01",
      "notes": "Day 1"
    },
    {
      "moodValue": 7,
      "date": "2024-01-02",
      "notes": "Day 2"
    }
  ]
}
```

#### Field Validation

| Field                 | Type   | Required | Validation                       |
| --------------------- | ------ | -------- | -------------------------------- |
| `entries`             | array  | Yes      | Array of mood entries (max: 100) |
| `entries[].moodValue` | number | Yes      | Integer between 1-10             |
| `entries[].date`      | string | Yes      | ISO date string (YYYY-MM-DD)     |
| `entries[].notes`     | string | No       | Max 1000 characters              |

#### Response

```json
{
  "message": "Successfully created 2 mood entries",
  "data": [
    {
      "id": "clx123abc",
      "moodValue": 8,
      "notes": "Day 1",
      "date": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Example Request

```bash
curl -X POST "https://your-domain.com/api/mood/bulk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "entries": [
      {"moodValue": 8, "date": "2024-01-01", "notes": "Day 1"},
      {"moodValue": 7, "date": "2024-01-02", "notes": "Day 2"}
    ]
  }'
```

### 8. Bulk Delete Mood Entries

**DELETE** `/api/mood/bulk`

Deletes multiple mood entries by date range or specific IDs.

#### Query Parameters

**Option 1: Delete by date range**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | Yes* | Start date (YYYY-MM-DD) |
| `endDate` | string | Yes* | End date (YYYY-MM-DD) |

**Option 2: Delete by specific IDs**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | string | Yes\* | Comma-separated list of entry IDs |

\*Either date range OR IDs must be provided

#### Response

```json
{
  "message": "Successfully deleted 5 mood entries",
  "deletedCount": 5
}
```

#### Example Requests

**Delete by date range:**

```bash
curl -X DELETE "https://your-domain.com/api/mood/bulk?startDate=2024-01-01&endDate=2024-01-07" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

**Delete by IDs:**

```bash
curl -X DELETE "https://your-domain.com/api/mood/bulk?ids=clx123abc,clx456def" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Error Responses

All endpoints return consistent error responses with appropriate HTTP status codes.

### Error Response Format

```json
{
  "error": "Error message description",
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes

| Status | Description           | Common Causes                                   |
| ------ | --------------------- | ----------------------------------------------- |
| 200    | Success               | Request completed successfully                  |
| 201    | Created               | Resource created successfully                   |
| 400    | Bad Request           | Invalid input data or parameters                |
| 401    | Unauthorized          | Missing or invalid authentication               |
| 403    | Forbidden             | User not authorized for this resource           |
| 404    | Not Found             | Resource not found                              |
| 409    | Conflict              | Resource already exists or constraint violation |
| 500    | Internal Server Error | Server-side error                               |

### Example Error Responses

**Validation Error (400):**

```json
{
  "error": "Invalid input",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "number",
      "inclusive": true,
      "exact": false,
      "message": "Number must be greater than or equal to 1",
      "path": ["moodValue"]
    }
  ]
}
```

**Conflict Error (409):**

```json
{
  "error": "Mood entry already exists for this date"
}
```

**Unauthorized Error (401):**

```json
{
  "error": "Unauthorized"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Default limit**: 100 requests per minute per user
- **Rate limit headers** are included in responses
- **429 Too Many Requests** is returned when limit is exceeded

## Data Models

### MoodEntry

```typescript
interface MoodEntry {
  id: string;
  userId: string;
  moodValue: number; // 1-10 scale
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### MoodStatistics

```typescript
interface MoodStatistics {
  period: number;
  totalEntries: number;
  averageMood: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  moodDistribution: Record<number, number>;
  streakDays: number;
  recentMood: {
    value: number;
    date: Date;
  };
  weeklyAverages: Array<{
    week: string;
    average: number;
    entries: number;
  }>;
  insights: string[];
}
```

## Best Practices

### 1. Error Handling

- Always check HTTP status codes
- Handle validation errors gracefully
- Implement retry logic for transient errors

### 2. Pagination

- Use pagination for large datasets
- Implement infinite scroll or "load more" functionality
- Cache paginated results when appropriate

### 3. Data Validation

- Validate input on both client and server
- Sanitize user input before sending to API
- Handle edge cases (empty strings, null values)

### 4. Performance

- Use appropriate date ranges for statistics
- Implement client-side caching for frequently accessed data
- Consider using bulk operations for multiple entries

### 5. Security

- Never expose user IDs in client-side code
- Validate all input parameters
- Implement proper session management

## Testing

The API includes comprehensive integration tests covering:

- Authentication and authorization
- Input validation
- Error handling
- Edge cases
- Bulk operations
- Statistics calculations

Run tests with:

```bash
npm test
```

## Support

For API support or questions, please refer to the project documentation or create an issue in the repository.
