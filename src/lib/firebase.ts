import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8IN0nrBl_50L9vsHRnhNeyxkrK-iI9cQ",
  authDomain: "moods-76653.firebaseapp.com",
  projectId: "moods-76653",
  storageBucket: "moods-76653.firebasestorage.app",
  messagingSenderId: "817180616983",
  appId: "1:817180616983:web:585ec7e937d4f73d3d2f52",
  measurementId: "G-FQCM4D2674"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics initialization failed:', error);
  }
}
export { analytics };

// Connect to emulators in development when explicitly enabled
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === 'true') {
  try {
    const authEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL || 'http://localhost:9099';
    const firestoreEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL || 'http://localhost:8080';
    const storageEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_URL || 'http://localhost:9199';
    
    console.log('Connecting to Firebase emulators...');
    connectAuthEmulator(auth, authEmulatorUrl.replace('http://', ''));
    connectFirestoreEmulator(db, firestoreEmulatorUrl.replace('http://', '').split(':')[0], parseInt(firestoreEmulatorUrl.split(':')[1]));
    connectStorageEmulator(storage, storageEmulatorUrl.replace('http://', '').split(':')[0], parseInt(storageEmulatorUrl.split(':')[1]));
    console.log('Firebase emulators connected successfully');
  } catch (error) {
    console.log('Firebase emulators already connected or failed to connect:', error);
  }
}

// TypeScript interfaces for Firestore documents
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: Date;
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'he' | 'en' | 'ar';
    notificationsEnabled: boolean;
    privacyLevel: 'public' | 'private' | 'friends';
    moodHistoryVisibility?: 'public' | 'private' | 'friends';
    journalVisibility?: 'public' | 'private' | 'friends';
    goalsVisibility?: 'public' | 'private' | 'friends';
    allowDataSharing?: boolean;
    allowAnalytics?: boolean;
    allowNotifications?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MoodEntry {
  id: string;
  userId: string;
  moodValue: number; // 1-10 scale
  moodType: 'happy' | 'sad' | 'anxious' | 'angry' | 'calm' | 'excited' | 'tired' | 'neutral';
  notes?: string;
  activities: string[];
  weather?: string;
  sleepHours?: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'mental-health' | 'physical-health' | 'social' | 'career' | 'personal';
  targetDate?: Date;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  milestones: {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: number; // 1-10 scale
  tags: string[];
  isPrivate: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Insight {
  id: string;
  userId: string;
  type: 'mood-pattern' | 'sleep-correlation' | 'activity-impact' | 'goal-progress' | 'trend-analysis';
  title: string;
  description: string;
  data: any;
  confidence: number; // 0-1
  createdAt: Date;
}

export interface ProgressReport {
  id: string;
  userId: string;
  period: 'weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  summary: string;
  achievements: string[];
  challenges: string[];
  nextSteps: string[];
  moodAverage: number;
  goalsProgress: {
    goalId: string;
    progress: number;
    notes?: string;
  }[];
  createdAt: Date;
}

export interface BreathingSession {
  id: string;
  userId: string;
  technique: 'box' | '4-7-8' | 'diaphragmatic' | 'alternate-nostril' | 'custom';
  duration: number; // in minutes
  breathsPerMinute?: number;
  notes?: string;
  moodBefore: number;
  moodAfter: number;
  date: Date;
  createdAt: Date;
}

export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: 'anxiety' | 'depression' | 'ptsd' | 'bipolar' | 'general' | 'grief' | 'addiction';
  isPrivate: boolean;
  maxMembers?: number;
  creatorId: string;
  admins: string[];
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reminder' | 'achievement' | 'insight' | 'goal' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

export interface Therapist {
  id: string;
  userId: string;
  name: string;
  specialization: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'book' | 'app' | 'website' | 'contact';
  url?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: 'therapy' | 'medication' | 'exercise' | 'social' | 'work' | 'personal';
  isRecurring: boolean;
  recurrencePattern?: string;
  reminders: {
    id: string;
    time: Date;
    type: 'push' | 'email' | 'sms';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export default app;
