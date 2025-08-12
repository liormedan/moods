# Firebase Analytics Setup

This document explains how Firebase Analytics is configured and used in the Mental Health Tracker application.

## Configuration

Firebase is configured in `src/lib/firebase.ts` with the following services:
- **Authentication** - User login/logout
- **Firestore** - Database for storing user data
- **Storage** - File storage
- **Analytics** - User behavior tracking

## Analytics Tracking Functions

The analytics utility (`src/lib/analytics.ts`) provides the following tracking functions:

### Page Tracking
- `trackPageView(pageName)` - Track when users visit specific pages

### User Actions
- `trackMoodEntry(moodValue, moodType)` - Track mood entries
- `trackTrendsAnalysis(period, metric)` - Track trends analysis usage
- `trackGoalProgress(goalId, progress, goalType)` - Track goal progress
- `trackBreathingSession(technique, duration, moodImprovement)` - Track breathing exercises
- `trackJournalEntry(entryLength, hasTags, isPrivate)` - Track journal entries

### Feature Usage
- `trackFeatureUsage(featureName, usageType)` - Track how users interact with features
- `trackUserEngagement(action, duration)` - Track user engagement patterns

### Data Actions
- `trackDataAction(action, dataType)` - Track data export, sharing, and downloads

## Usage Examples

### In React Components

```tsx
import { trackPageView, trackFeatureUsage } from '@/lib/analytics';

// Track page view when component mounts
useEffect(() => {
  trackPageView('dashboard_page');
}, []);

// Track feature usage
const handleButtonClick = () => {
  trackFeatureUsage('mood_entry', 'interact');
  // ... rest of the logic
};
```

### Tracking User Interactions

```tsx
// Track when user changes analysis period
<Select onValueChange={(value) => {
  setSelectedPeriod(value);
  trackTrendsAnalysis(value, selectedMetric);
}}>
  {/* options */}
</Select>

// Track data export
<Button onClick={() => trackDataAction('export', 'trends_data')}>
  Export Data
</Button>
```

## Analytics Dashboard

You can view the analytics data in the [Firebase Console](https://console.firebase.google.com/):
1. Go to your project (moods-76653)
2. Click on "Analytics" in the left sidebar
3. View user engagement, feature usage, and custom events

## Privacy Considerations

- All tracking is anonymous and doesn't include personal health information
- Users can opt out of analytics in their privacy settings
- Data is used only for improving the application experience

## Development vs Production

- In development, analytics events are logged to console
- In production, events are sent to Firebase Analytics
- Emulator connections are automatically handled in development mode

## Adding New Tracking

To add new tracking events:

1. Add a new function in `src/lib/analytics.ts`
2. Import and use it in your component
3. Document the event parameters and purpose

Example:
```tsx
export const trackNewFeature = (param1: string, param2: number) => {
  trackEvent('new_feature', {
    parameter1: param1,
    parameter2: param2,
    timestamp: new Date().toISOString()
  });
};
```
