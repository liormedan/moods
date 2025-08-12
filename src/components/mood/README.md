# MoodChart Component

## Overview

The `MoodChart` component is a comprehensive visualization system for displaying mood tracking data using interactive charts. It provides multiple chart types including line charts for mood trends and area charts for weekly and monthly averages.

## Features

### 🎯 Core Functionality

- **Interactive Line Chart**: Displays mood values over time with smooth transitions
- **Time Range Selection**: Choose between week, month, or 3-month views
- **Weekly Averages**: Area chart showing weekly mood averages
- **Monthly Averages**: Area chart showing monthly mood trends
- **Real-time Data**: Automatically fetches and updates data from the API
- **Responsive Design**: Adapts to different screen sizes and orientations

### 📊 Chart Types

1. **Main Mood Chart (LineChart)**
   - Shows individual mood entries over time
   - Interactive tooltips with date, mood value, and notes
   - Smooth line transitions between data points
   - Customizable styling and colors

2. **Weekly Averages (AreaChart)**
   - Displays weekly mood averages as filled areas
   - Helps identify weekly patterns and trends
   - Green color scheme for positive visualization

3. **Monthly Averages (AreaChart)**
   - Shows monthly mood trends over longer periods
   - Purple color scheme to differentiate from weekly data
   - Useful for long-term mood analysis

### 🕒 Time Range Options

- **Week**: Last 7 days of mood data
- **Month**: Last 30 days of mood data
- **3 Months**: Last 90 days of mood data

## Props

```typescript
interface MoodChartProps {
  onDataLoad?: (data: MoodDataPoint[]) => void;
  onError?: (error: string) => void;
}
```

- `onDataLoad`: Callback function called when chart data is successfully loaded
- `onError`: Callback function called when an error occurs during data loading

## Data Structure

### MoodDataPoint

```typescript
interface MoodDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  mood: number; // Mood value (1-10 scale)
  notes?: string; // Optional notes for the mood entry
}
```

### WeeklyAverage

```typescript
interface WeeklyAverage {
  weekStart: string; // Start date of the week
  average: number; // Average mood for the week
  count: number; // Number of entries in the week
}
```

### MonthlyAverage

```typescript
interface MonthlyAverage {
  month: string; // Month identifier (YYYY-MM)
  average: number; // Average mood for the month
  count: number; // Number of entries in the month
}
```

## Usage

### Basic Implementation

```tsx
import { MoodChart } from '@/components/mood';

function Dashboard() {
  return (
    <MoodChart
      onDataLoad={(data) => console.log('Data loaded:', data)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

### With Custom Callbacks

```tsx
function Dashboard() {
  const handleDataLoad = (data: MoodDataPoint[]) => {
    // Process loaded data
    console.log(`Loaded ${data.length} mood entries`);
  };

  const handleError = (error: string) => {
    // Handle errors (e.g., show notification)
    toast.error(`Failed to load chart data: ${error}`);
  };

  return <MoodChart onDataLoad={handleDataLoad} onError={handleError} />;
}
```

## API Integration

The component automatically integrates with the `/api/mood` endpoint:

- **Endpoint**: `GET /api/mood`
- **Query Parameters**:
  - `startDate`: Start date for the date range (ISO string)
  - `endDate`: End date for the date range (ISO string)
- **Authentication**: Requires valid user session
- **Response Format**: JSON with mood entries array

### Example API Call

```typescript
// For week view (last 7 days)
GET /api/mood?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-08T00:00:00.000Z
```

## Styling and Customization

### CSS Classes

- **Container**: `.mood-chart-container`
- **Chart Wrapper**: `.chart-wrapper`
- **Time Range Selector**: `.time-range-selector`
- **Loading Spinner**: `.loading-spinner`

### Color Scheme

- **Primary Line**: Blue (#3b82f6)
- **Weekly Averages**: Green (#10b981)
- **Monthly Averages**: Purple (#8b5cf6)
- **Grid Lines**: Gray with dashed pattern
- **Tooltips**: White background with blue accents

### Responsive Breakpoints

- **Mobile**: Full width, stacked charts
- **Tablet**: Optimized spacing and sizing
- **Desktop**: Side-by-side layout for better data comparison

## Error Handling

The component handles various error scenarios gracefully:

1. **API Errors**: Displays error message with retry button
2. **Network Issues**: Shows connection error and retry option
3. **Empty Data**: Displays helpful message when no data is available
4. **Authentication**: Shows login prompt for unauthenticated users

### Error States

```tsx
// API Error
<div className="error-state">
  <p>שגיאה בטעינת הנתונים: {error}</p>
  <Button onClick={retry}>נסה שוב</Button>
</div>

// Empty Data
<div className="empty-state">
  <p>אין נתוני מצב רוח בטווח הזמן שנבחר</p>
  <p>נסה לבחור טווח זמן אחר או להוסיף רשומות מצב רוח</p>
</div>
```

## Performance Considerations

### Data Optimization

- **Lazy Loading**: Charts only render when data is available
- **Memoization**: Chart data is cached to prevent unnecessary re-renders
- **Debounced Updates**: Time range changes are optimized to prevent excessive API calls

### Memory Management

- **Cleanup**: Proper cleanup of chart instances and event listeners
- **Data Limits**: API responses are capped to prevent memory issues
- **Efficient Rendering**: Only visible chart elements are rendered

## Accessibility

### ARIA Labels

- **Chart Titles**: Proper heading hierarchy and labels
- **Interactive Elements**: Screen reader friendly button and select labels
- **Data Points**: Tooltips provide additional context for screen readers

### Keyboard Navigation

- **Tab Order**: Logical tab sequence through interactive elements
- **Enter/Space**: Support for keyboard activation of buttons and selects
- **Arrow Keys**: Navigation through time range options

### Screen Reader Support

- **Chart Descriptions**: Alt text and descriptions for chart content
- **Data Values**: Announcement of mood values and trends
- **Interactive Feedback**: Clear feedback for user actions

## Testing

### Unit Tests

The component includes comprehensive unit tests covering:

- **Rendering**: Component renders correctly with different states
- **Data Loading**: API integration and data transformation
- **User Interactions**: Time range selection and error handling
- **Edge Cases**: Empty data, API errors, authentication states

### Test Coverage

- **Lines**: 95%+
- **Functions**: 100%
- **Branches**: 90%+
- **Statements**: 95%+

### Running Tests

```bash
# Run all tests
npm test

# Run tests for this component only
npm test -- MoodChart.test.tsx

# Run tests in watch mode
npm test -- --watch
```

## Dependencies

### Core Dependencies

- **React**: 19.1.0+
- **Next.js**: 15.4.6+
- **Recharts**: Latest version for chart functionality
- **date-fns**: 4.1.0+ for date manipulation

### UI Dependencies

- **@radix-ui/react-select**: For time range selection
- **@/components/ui/card**: Card layout components
- **@/components/ui/button**: Button components
- **Tailwind CSS**: Utility-first styling

### Development Dependencies

- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **TypeScript**: Type safety and development experience

## Future Enhancements

### Planned Features

1. **Export Functionality**: PDF/PNG chart export
2. **Custom Time Ranges**: User-defined date ranges
3. **Chart Annotations**: Add notes and markers to charts
4. **Comparison Mode**: Compare different time periods
5. **Advanced Analytics**: Trend analysis and predictions

### Performance Improvements

1. **Virtual Scrolling**: For large datasets
2. **Web Workers**: Background data processing
3. **Service Workers**: Offline data caching
4. **Progressive Loading**: Load charts incrementally

### Accessibility Enhancements

1. **High Contrast Mode**: Better visibility options
2. **Voice Commands**: Speech-to-text for chart navigation
3. **Haptic Feedback**: Mobile device vibration support
4. **Internationalization**: Multi-language support

## Troubleshooting

### Common Issues

#### Charts Not Rendering

- Check if user is authenticated
- Verify API endpoint is accessible
- Ensure data format matches expected structure

#### Performance Issues

- Reduce data points by selecting shorter time ranges
- Check for memory leaks in development tools
- Verify chart library version compatibility

#### Styling Problems

- Ensure Tailwind CSS is properly configured
- Check for CSS conflicts with other components
- Verify responsive breakpoints are working

### Debug Mode

Enable debug logging by setting environment variable:

```bash
NEXT_PUBLIC_DEBUG_CHARTS=true
```

## Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Run tests: `npm test`

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write comprehensive tests for new features

### Pull Request Guidelines

- Include tests for new functionality
- Update documentation as needed
- Follow the existing code style
- Provide clear description of changes

## License

This component is part of the Mental Health Tracker application and follows the same licensing terms as the parent project.
