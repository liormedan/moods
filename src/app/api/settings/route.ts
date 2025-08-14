import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for settings
const settingsSchema = z.object({
  display: z.object({
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    fontSize: z.enum(['small', 'medium', 'large']).optional(),
    compactMode: z.boolean().optional(),
    showAnimations: z.boolean().optional(),
    colorScheme: z.enum(['default', 'high-contrast', 'colorblind-friendly']).optional(),
    language: z.enum(['hebrew', 'english', 'arabic']).optional(),
  }).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    sms: z.boolean().optional(),
    moodReminders: z.boolean().optional(),
    goalDeadlines: z.boolean().optional(),
    weeklyReports: z.boolean().optional(),
    dailyCheckins: z.boolean().optional(),
    reminderTime: z.string().optional(),
    quietHours: z.object({
      enabled: z.boolean().optional(),
      start: z.string().optional(),
      end: z.string().optional(),
    }).optional(),
  }).optional(),
  privacy: z.object({
    shareData: z.boolean().optional(),
    anonymousMode: z.boolean().optional(),
    dataRetention: z.number().min(30).max(3650).optional(),
    allowAnalytics: z.boolean().optional(),
    shareWithTherapist: z.boolean().optional(),
    publicProfile: z.boolean().optional(),
  }).optional(),
  performance: z.object({
    enableCaching: z.boolean().optional(),
    lazyLoading: z.boolean().optional(),
    backgroundSync: z.boolean().optional(),
    dataCompression: z.boolean().optional(),
    offlineMode: z.boolean().optional(),
    syncFrequency: z.enum(['realtime', 'hourly', 'daily']).optional(),
  }).optional(),
  integrations: z.object({
    googleCalendar: z.boolean().optional(),
    appleHealth: z.boolean().optional(),
    fitbit: z.boolean().optional(),
    spotify: z.boolean().optional(),
    weather: z.boolean().optional(),
    googleFit: z.boolean().optional(),
    strava: z.boolean().optional(),
  }).optional(),
  backup: z.object({
    autoBackup: z.boolean().optional(),
    backupFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    cloudBackup: z.boolean().optional(),
    localBackup: z.boolean().optional(),
    encryptBackups: z.boolean().optional(),
    maxBackups: z.number().min(1).max(50).optional(),
  }).optional(),
  accessibility: z.object({
    highContrast: z.boolean().optional(),
    largeText: z.boolean().optional(),
    reduceMotion: z.boolean().optional(),
    screenReader: z.boolean().optional(),
    keyboardNavigation: z.boolean().optional(),
    voiceCommands: z.boolean().optional(),
  }).optional(),
  advanced: z.object({
    developerMode: z.boolean().optional(),
    debugMode: z.boolean().optional(),
    betaFeatures: z.boolean().optional(),
    experimentalFeatures: z.boolean().optional(),
    apiLogging: z.boolean().optional(),
    performanceMonitoring: z.boolean().optional(),
  }).optional(),
});

// Default settings
const defaultSettings = {
  display: {
    theme: 'auto' as const,
    fontSize: 'medium' as const,
    compactMode: false,
    showAnimations: true,
    colorScheme: 'default' as const,
    language: 'hebrew' as const,
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    moodReminders: true,
    goalDeadlines: true,
    weeklyReports: true,
    dailyCheckins: false,
    reminderTime: '20:00',
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
    },
  },
  privacy: {
    shareData: false,
    anonymousMode: false,
    dataRetention: 365,
    allowAnalytics: true,
    shareWithTherapist: false,
    publicProfile: false,
  },
  performance: {
    enableCaching: true,
    lazyLoading: true,
    backgroundSync: false,
    dataCompression: true,
    offlineMode: true,
    syncFrequency: 'hourly' as const,
  },
  integrations: {
    googleCalendar: false,
    appleHealth: false,
    fitbit: false,
    spotify: false,
    weather: true,
    googleFit: false,
    strava: false,
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'weekly' as const,
    cloudBackup: true,
    localBackup: false,
    encryptBackups: true,
    maxBackups: 10,
    lastBackup: new Date().toISOString(),
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    voiceCommands: false,
  },
  advanced: {
    developerMode: false,
    debugMode: false,
    betaFeatures: false,
    experimentalFeatures: false,
    apiLogging: false,
    performanceMonitoring: true,
  },
};

// GET /api/settings - Get user settings
export async function GET() {
  try {
    // For demo, return default settings with some customizations
    const settings = {
      ...defaultSettings,
      // Add some demo customizations
      display: {
        ...defaultSettings.display,
        theme: 'auto' as const,
        fontSize: 'medium' as const,
      },
      notifications: {
        ...defaultSettings.notifications,
        moodReminders: true,
        dailyCheckins: true,
      },
    };

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings loaded successfully',
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to load settings',
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = settingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid settings data',
          details: validationResult.error.issues,
          message: 'Validation failed'
        },
        { status: 400 }
      );
    }

    const settingsUpdate = validationResult.data;

    // Merge with default settings to ensure all fields are present
    const updatedSettings = mergeDeep(defaultSettings, settingsUpdate);

    // Log the settings change for demo
    console.log('Settings updated:', {
      timestamp: new Date().toISOString(),
      changes: settingsUpdate,
    });

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update settings',
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Helper function to deep merge objects
function mergeDeep(target: any, source: any): any {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// POST /api/settings - Handle settings actions (reset, backup, etc.)
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'reset') {
      // Simulate reset delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Settings reset to defaults:', {
        timestamp: new Date().toISOString(),
        action: 'reset'
      });

      return NextResponse.json({
        success: true,
        message: 'Settings reset to defaults successfully',
        data: defaultSettings,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'backup') {
      // Create backup
      const backupData = {
        id: `backup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        settings: defaultSettings, // In real app, get current settings
        version: '1.0.0',
        size: JSON.stringify(defaultSettings).length,
      };

      // Simulate backup creation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Backup created:', backupData);

      return NextResponse.json({
        success: true,
        message: 'Backup created successfully',
        data: {
          backupId: backupData.id,
          timestamp: backupData.timestamp,
          size: backupData.size,
        },
      });
    }

    if (action === 'restore') {
      // In a real app, restore from backup file
      await new Promise(resolve => setTimeout(resolve, 1500));

      return NextResponse.json({
        success: true,
        message: 'Settings restored from backup successfully',
        data: defaultSettings,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Invalid action',
        message: `Action '${action}' is not supported`
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing settings action:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process action',
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}