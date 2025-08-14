import { NextRequest, NextResponse } from 'next/server';

interface PrivacySettings {
  dataCollection: {
    analytics: boolean;
    crashReports: boolean;
    usageStatistics: boolean;
    locationData: boolean;
    deviceInfo: boolean;
    performanceMetrics: boolean;
  };
  dataSharing: {
    anonymizedResearch: boolean;
    aggregatedStatistics: boolean;
    thirdPartyIntegrations: boolean;
    marketingPartners: boolean;
    healthcareProviders: boolean;
    emergencyContacts: boolean;
  };
  visibility: {
    profileVisibility: 'private' | 'friends' | 'public';
    activityStatus: boolean;
    lastSeen: boolean;
    moodHistory: boolean;
    goalProgress: boolean;
    journalEntries: boolean;
  };
  communications: {
    emailMarketing: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    inAppMessages: boolean;
    surveyInvitations: boolean;
    productUpdates: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    deviceTracking: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    biometricAuth: boolean;
  };
  dataRetention: {
    moodData: number;
    journalEntries: number;
    goalHistory: number;
    activityLogs: number;
    communicationHistory: number;
    autoDelete: boolean;
  };
}

// Default privacy settings
const defaultSettings: PrivacySettings = {
  dataCollection: {
    analytics: true,
    crashReports: true,
    usageStatistics: false,
    locationData: false,
    deviceInfo: true,
    performanceMetrics: true,
  },
  dataSharing: {
    anonymizedResearch: false,
    aggregatedStatistics: false,
    thirdPartyIntegrations: false,
    marketingPartners: false,
    healthcareProviders: false,
    emergencyContacts: true,
  },
  visibility: {
    profileVisibility: 'private',
    activityStatus: false,
    lastSeen: false,
    moodHistory: false,
    goalProgress: false,
    journalEntries: false,
  },
  communications: {
    emailMarketing: false,
    smsNotifications: true,
    pushNotifications: true,
    inAppMessages: true,
    surveyInvitations: false,
    productUpdates: true,
  },
  security: {
    twoFactorAuth: false,
    loginAlerts: true,
    deviceTracking: true,
    sessionTimeout: 60,
    passwordExpiry: 90,
    biometricAuth: false,
  },
  dataRetention: {
    moodData: 365,
    journalEntries: 730,
    goalHistory: 365,
    activityLogs: 90,
    communicationHistory: 180,
    autoDelete: true,
  },
};

// GET /api/privacy/settings - Get privacy settings
export async function GET() {
  try {
    // In a real app, fetch from database based on user ID
    // For demo, return default settings with some customizations
    const settings = {
      ...defaultSettings,
      // Add some demo customizations
      security: {
        ...defaultSettings.security,
        twoFactorAuth: true,
        loginAlerts: true,
      },
      visibility: {
        ...defaultSettings.visibility,
        profileVisibility: 'friends' as const,
        activityStatus: true,
      },
    };

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Privacy settings loaded successfully'
    });
  } catch (error) {
    console.error('Error loading privacy settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load privacy settings',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/privacy/settings - Update privacy settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate settings structure (basic validation)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid settings data',
          message: 'Settings must be a valid object'
        },
        { status: 400 }
      );
    }

    // Merge with default settings to ensure all fields are present
    const updatedSettings = {
      ...defaultSettings,
      ...body,
      dataCollection: { ...defaultSettings.dataCollection, ...body.dataCollection },
      dataSharing: { ...defaultSettings.dataSharing, ...body.dataSharing },
      visibility: { ...defaultSettings.visibility, ...body.visibility },
      communications: { ...defaultSettings.communications, ...body.communications },
      security: { ...defaultSettings.security, ...body.security },
      dataRetention: { ...defaultSettings.dataRetention, ...body.dataRetention },
    };

    // Log the settings change for demo
    console.log('Privacy settings updated:', {
      timestamp: new Date().toISOString(),
      settings: updatedSettings,
    });

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Privacy settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update privacy settings',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}