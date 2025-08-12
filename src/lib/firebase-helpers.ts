import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  writeBatch,
  runTransaction,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  User,
  MoodEntry,
  Goal,
  JournalEntry,
  Insight,
  ProgressReport,
  BreathingSession,
  SupportGroup,
  Notification,
  Therapist,
  Resource,
  CalendarEvent
} from './firebase';

// Helper function to convert Firestore Timestamp to Date
export const timestampToDate = (timestamp: Timestamp | null): Date | null => {
  return timestamp ? timestamp.toDate() : null;
};

// Helper function to convert Date to Firestore Timestamp
export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Generic CRUD operations
export class FirebaseService<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Create a new document
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  // Get a document by ID
  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  // Update a document
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  // Get documents with filters
  async getWhere(
    field: string,
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in',
    value: any,
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number
  ): Promise<T[]> {
    let q = query(
      collection(db, this.collectionName),
      where(field, operator, value)
    );

    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  }

  // Get documents with multiple filters
  async getWhereMultiple(
    filters: Array<{ field: string; operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'; value: any }>,
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number
  ): Promise<T[]> {
    let q = query(collection(db, this.collectionName));

    filters.forEach(filter => {
      q = query(q, where(filter.field, filter.operator, filter.value));
    });

    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  }

  // Get documents with pagination
  async getPaginated(
    pageSize: number,
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    orderByField: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc'
  ): Promise<{ data: T[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean }> {
    let q = query(
      collection(db, this.collectionName),
      orderBy(orderByField, orderDirection),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    
    return {
      data: docs.map(doc => ({ id: doc.id, ...doc.data() }) as T),
      lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
      hasMore: docs.length === pageSize
    };
  }

  // Listen to real-time updates
  onSnapshot(
    callback: (data: T[]) => void,
    filters?: Array<{ field: string; operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'; value: any }>,
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc'
  ): Unsubscribe {
    let q = query(collection(db, this.collectionName));

    if (filters) {
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }

    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
      callback(data);
    });
  }
}

// Specific service instances
export const userService = new FirebaseService<User>('users');
export const moodEntryService = new FirebaseService<MoodEntry>('mood_entries');
export const goalService = new FirebaseService<Goal>('goals');
export const journalEntryService = new FirebaseService<JournalEntry>('journal_entries');
export const insightService = new FirebaseService<Insight>('insights');
export const progressReportService = new FirebaseService<ProgressReport>('progress_reports');
export const breathingSessionService = new FirebaseService<BreathingSession>('breathing_sessions');
export const supportGroupService = new FirebaseService<SupportGroup>('support_groups');
export const notificationService = new FirebaseService<Notification>('notifications');
export const therapistService = new FirebaseService<Therapist>('therapists');
export const resourceService = new FirebaseService<Resource>('resources');
export const calendarEventService = new FirebaseService<CalendarEvent>('calendar_events');

// Specialized functions for common operations
export const firebaseHelpers = {
  // User operations
  async getUserByEmail(email: string): Promise<User | null> {
    const users = await userService.getWhere('email', '==', email);
    return users.length > 0 ? users[0] : null;
  },

  // Mood operations
  async getMoodEntriesByDateRange(userId: string, startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    return await moodEntryService.getWhereMultiple([
      { field: 'userId', operator: '==', value: userId },
      { field: 'date', operator: '>=', value: dateToTimestamp(startDate) },
      { field: 'date', operator: '<=', value: dateToTimestamp(endDate) }
    ], 'date', 'desc');
  },

  // Goal operations
  async getActiveGoals(userId: string): Promise<Goal[]> {
    return await goalService.getWhereMultiple([
      { field: 'userId', operator: '==', value: userId },
      { field: 'status', operator: '==', value: 'active' }
    ], 'createdAt', 'desc');
  },

  // Journal operations
  async getJournalEntriesByTags(userId: string, tags: string[]): Promise<JournalEntry[]> {
    return await journalEntryService.getWhereMultiple([
      { field: 'userId', operator: '==', value: userId },
      { field: 'tags', operator: 'array-contains-any', value: tags }
    ], 'date', 'desc');
  },

  // Batch operations
  async batchCreate<T>(collectionName: string, documents: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    const batch = writeBatch(db);
    const ids: string[] = [];

    documents.forEach(docData => {
      const docRef = doc(collection(db, collectionName));
      batch.set(docRef, {
        ...docData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      ids.push(docRef.id);
    });

    await batch.commit();
    return ids;
  },

  // Transaction operations
  async runInTransaction<T>(updateFunction: (transaction: any) => Promise<T>): Promise<T> {
    return await runTransaction(db, updateFunction);
  }
};

export default firebaseHelpers;
