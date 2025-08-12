# Insights API Implementation

## Overview

This directory contains the complete implementation of the Insights API for the Mental Health Tracker application. The API provides intelligent insights and recommendations based on user mood data analysis, with advanced trend detection and personalized suggestions.

## Features Implemented

### ✅ Core API Endpoints

- **GET** `/api/insights` - Retrieve insights with filtering and pagination
- **POST** `/api/insights` - Create manual insights or generate insights from mood data
- **PATCH** `/api/insights/[id]` - Update specific insight (e.g., mark as read)
- **DELETE** `/api/insights/[id]` - Delete specific insight

### ✅ Intelligent Insight Generation

- **Trend Analysis**: Identifies improving, declining, or stable mood patterns
- **Streak Detection**: Tracks consecutive days of mood tracking
- **Pattern Recognition**: Analyzes mood distribution and identifies imbalances
- **Contextual Recommendations**: Provides personalized suggestions based on mood data

### ✅ Insight Types

- **Recommendation**: Actionable suggestions for improving mood
- **Warning**: Alerts for concerning patterns or low mood
- **Celebration**: Recognition of positive trends and achievements
- **Pattern**: Identification of recurring mood patterns
- **Milestone**: Acknowledgment of tracking consistency

### ✅ Priority System

- **High**: Critical warnings requiring immediate attention
- **Medium**: Important recommendations and patterns
- **Low**: Positive feedback and celebrations

### ✅ Security & Validation

- Full authentication and authorization using NextAuth
- Input validation with Zod schemas
- User ownership verification for all operations
- Comprehensive error handling

## File Structure

```
src/app/api/insights/
├── route.ts              # Main insights endpoints (GET, POST)
├── [id]/route.ts         # Individual insight operations (PATCH, DELETE)
└── README.md            # This file
```

## API Endpoints Summary

| Method | Endpoint             | Description                 | Auth Required |
| ------ | -------------------- | --------------------------- | ------------- |
| GET    | `/api/insights`      | Get insights with filtering | ✅            |
| POST   | `/api/insights`      | Create or generate insights | ✅            |
| PATCH  | `/api/insights/[id]` | Update insight              | ✅            |
| DELETE | `/api/insights/[id]` | Delete insight              | ✅            |

## API Usage Examples

### Get Insights

```typescript
// Get all insights
const response = await fetch('/api/insights');

// Get unread insights only
const response = await fetch('/api/insights?unreadOnly=true');

// Filter by type
const response = await fetch('/api/insights?type=warning');

// Pagination
const response = await fetch('/api/insights?limit=10&offset=0');
```

### Generate Insights

```typescript
// Generate insights from mood data
const response = await fetch('/api/insights', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'generate' }),
});
```

### Create Manual Insight

```typescript
// Create a custom insight
const response = await fetch('/api/insights', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'recommendation',
    title: 'פעילות מומלצת',
    description: 'נסה לצאת לטיול קצר בחוץ',
    priority: 'medium',
    actionable: true,
  }),
});
```

### Update Insight

```typescript
// Mark insight as read
const response = await fetch('/api/insights/insight-id', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ isRead: true }),
});
```

## Insight Generation Algorithm

### 1. Trend Analysis

- Compares first and last week averages
- Identifies improving (>1 point increase), declining (>1 point decrease), or stable trends

### 2. Streak Calculation

- Counts consecutive days with mood entries
- Recognizes consistency milestones (7+ days)

### 3. Mood Distribution Analysis

- Analyzes frequency of high (8-10) vs. low (1-3) mood values
- Identifies imbalances requiring attention

### 4. Contextual Rules

- **Low Average Mood (≤3)**: High priority warning with professional help suggestions
- **Declining Trend**: Medium priority warning with actionable recommendations
- **Improving Trend**: Low priority celebration and encouragement
- **High Streak**: Milestone recognition for consistency
- **High Average Mood (≥8)**: Celebration of positive state

## Data Models

### Insight

```typescript
interface Insight {
  id: string;
  userId: string;
  type: 'recommendation' | 'warning' | 'celebration' | 'pattern' | 'milestone';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  expiresAt?: Date;
  isRead: boolean;
  createdAt: Date;
}
```

### Insight Generation Context

```typescript
interface InsightGenerationContext {
  userId: string;
  recentMoodEntries: Array<{
    moodValue: number;
    date: Date;
    notes?: string;
  }>;
  moodStatistics: {
    averageMood: number;
    trend: 'improving' | 'declining' | 'stable';
    streakDays: number;
  };
}
```

## Error Handling

### HTTP Status Codes

| Status | Description           | Common Causes                     |
| ------ | --------------------- | --------------------------------- |
| 200    | Success               | Valid request                     |
| 201    | Created               | New insight created               |
| 400    | Bad Request           | Invalid input or validation error |
| 401    | Unauthorized          | Missing or invalid authentication |
| 404    | Not Found             | Insight not found                 |
| 500    | Internal Server Error | Server-side error                 |

### Example Error Responses

**Validation Error (400):**

```json
{
  "error": "Invalid input",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "String must contain at least 1 character(s)",
      "path": ["title"]
    }
  ]
}
```

**Not Found Error (404):**

```json
{
  "error": "Insight not found"
}
```

## Best Practices

### 1. Insight Generation

- Generate insights periodically (e.g., daily/weekly)
- Avoid duplicate insights for the same patterns
- Consider user preferences and history

### 2. Priority Assignment

- Use high priority sparingly for critical warnings
- Medium priority for actionable recommendations
- Low priority for positive feedback and celebrations

### 3. Content Guidelines

- Keep titles concise and actionable
- Provide specific, helpful descriptions
- Use appropriate tone for each insight type

### 4. Performance

- Implement caching for frequently accessed insights
- Use pagination for large insight collections
- Consider insight expiration for time-sensitive content

## Integration with Frontend

The Insights API integrates seamlessly with the `InsightsPanel` component, providing:

- Real-time insight updates
- Interactive filtering and sorting
- Mark as read functionality
- Help resource suggestions for critical warnings
- Responsive design for all device types

## Testing

Comprehensive test coverage includes:

- **Unit Tests**: Algorithm logic and data processing
- **Component Tests**: UI interactions and state management
- **API Tests**: Endpoint functionality and error handling
- **Integration Tests**: End-to-end user workflows

Run tests with:

```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm test -- --testPathPattern=insights  # Run insights-specific tests
```

## Future Enhancements

- **Machine Learning**: Advanced pattern recognition
- **Personalization**: User-specific insight preferences
- **External Integrations**: Weather, calendar, and activity data
- **Proactive Alerts**: Push notifications for critical insights
- **Insight Analytics**: Track insight effectiveness and user engagement

