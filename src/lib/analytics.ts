import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// Analytics event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      console.log('Analytics event tracking failed:', error);
    }
  }
};

// Track page views
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', { page_name: pageName });
};

// Track mood tracking interactions
export const trackMoodEntry = (moodValue: number, moodType: string) => {
  trackEvent('mood_entry', {
    mood_value: moodValue,
    mood_type: moodType,
    timestamp: new Date().toISOString()
  });
};

// Track trends analysis
export const trackTrendsAnalysis = (period: string, metric: string) => {
  trackEvent('trends_analysis', {
    analysis_period: period,
    analysis_metric: metric,
    timestamp: new Date().toISOString()
  });
};

// Track goal progress
export const trackGoalProgress = (goalId: string, progress: number, goalType: string) => {
  trackEvent('goal_progress', {
    goal_id: goalId,
    progress_percentage: progress,
    goal_type: goalType,
    timestamp: new Date().toISOString()
  });
};

// Track breathing exercises
export const trackBreathingSession = (technique: string, duration: number, moodImprovement: number) => {
  trackEvent('breathing_session', {
    technique: technique,
    duration_minutes: duration,
    mood_improvement: moodImprovement,
    timestamp: new Date().toISOString()
  });
};

// Track journal entries
export const trackJournalEntry = (entryLength: number, hasTags: boolean, isPrivate: boolean) => {
  trackEvent('journal_entry', {
    entry_length: entryLength,
    has_tags: hasTags,
    is_private: isPrivate,
    timestamp: new Date().toISOString()
  });
};

// Track insights generation
export const trackInsightGenerated = (insightType: string, confidence: number) => {
  trackEvent('insight_generated', {
    insight_type: insightType,
    confidence_score: confidence,
    timestamp: new Date().toISOString()
  });
};

// Track user engagement
export const trackUserEngagement = (action: string, duration?: number) => {
  trackEvent('user_engagement', {
    action: action,
    duration_seconds: duration,
    timestamp: new Date().toISOString()
  });
};

// Track feature usage
export const trackFeatureUsage = (featureName: string, usageType: 'view' | 'interact' | 'complete') => {
  trackEvent('feature_usage', {
    feature_name: featureName,
    usage_type: usageType,
    timestamp: new Date().toISOString()
  });
};

// Track seasonal patterns analysis
export const trackSeasonalAnalysis = (season: string, averageMood: number) => {
  trackEvent('seasonal_analysis', {
    season: season,
    average_mood: averageMood,
    timestamp: new Date().toISOString()
  });
};

// Track long-term goal milestones
export const trackMilestoneCompleted = (goalId: string, milestoneTitle: string) => {
  trackEvent('milestone_completed', {
    goal_id: goalId,
    milestone_title: milestoneTitle,
    timestamp: new Date().toISOString()
  });
};

// Track data export/sharing
export const trackDataAction = (action: 'export' | 'share' | 'download', dataType: string) => {
  trackEvent('data_action', {
    action: action,
    data_type: dataType,
    timestamp: new Date().toISOString()
  });
};

