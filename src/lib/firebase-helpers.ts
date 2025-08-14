// Mock Firebase helpers - Firebase is not configured
// In a real app, you would import from './firebase' and use firebase/firestore

// Mock types
export type Timestamp = Date;
export type DocumentData = any;
export type QueryDocumentSnapshot = any;
export type Unsubscribe = () => void;

// Helper function to convert Firestore Timestamp to Date
export const timestampToDate = (timestamp: Timestamp | null): Date | null => {
  return timestamp ? new Date(timestamp) : null;
};

// Helper function to convert Date to Firestore Timestamp
export const dateToTimestamp = (date: Date): Timestamp => {
  return date;
};

// Generic CRUD operations
export class FirebaseService<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Create a new document
  async create(
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    // Mock implementation
    const mockId = Math.random().toString(36).substr(2, 9);
    console.log(
      `Mock Firebase: Creating ${this.collectionName} with ID ${mockId}`,
      data
    );
    return mockId;
  }

  // Get a document by ID
  async getById(id: string): Promise<T | null> {
    // Mock implementation
    console.log(`Mock Firebase: Getting ${this.collectionName} with ID ${id}`);
    return null;
  }

  // Update a document
  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<void> {
    // Mock implementation
    console.log(
      `Mock Firebase: Updating ${this.collectionName} with ID ${id}`,
      data
    );
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    // Mock implementation
    console.log(`Mock Firebase: Deleting ${this.collectionName} with ID ${id}`);
  }

  // Get documents with filters
  async getWhere(field: string, operator: string, value: any): Promise<T[]> {
    // Mock implementation
    console.log(
      `Mock Firebase: Getting ${this.collectionName} where ${field} ${operator} ${value}`
    );
    return [];
  }

  // Get documents with pagination
  async getPaginated(
    limit: number = 20,
    startAfter?: QueryDocumentSnapshot
  ): Promise<T[]> {
    // Mock implementation
    console.log(
      `Mock Firebase: Getting ${this.collectionName} with limit ${limit}`
    );
    return [];
  }

  // Listen to real-time updates
  onSnapshot(
    callback: (data: T[]) => void,
    errorCallback?: (error: Error) => void
  ): Unsubscribe {
    // Mock implementation
    console.log(
      `Mock Firebase: Setting up snapshot listener for ${this.collectionName}`
    );
    return () => {
      console.log(`Mock Firebase: Unsubscribing from ${this.collectionName}`);
    };
  }
}

// Export mock functions for compatibility
export const collection = (db: any, collectionName: string) => collectionName;
export const doc = (db: any, collectionName: string, id: string) =>
  `${collectionName}/${id}`;
export const getDoc = async (docRef: any) => ({
  exists: () => false,
  data: () => null,
});
export const getDocs = async (query: any) => ({ docs: [] });
export const addDoc = async (collectionRef: any, data: any) => ({
  id: Math.random().toString(36).substr(2, 9),
});
export const updateDoc = async (docRef: any, data: any) => Promise.resolve();
export const deleteDoc = async (docRef: any) => Promise.resolve();
export const query = (collectionRef: any, ...constraints: any[]) =>
  collectionRef;
export const where = (field: string, operator: string, value: any) => ({
  field,
  operator,
  value,
});
export const orderBy = (field: string, direction?: 'asc' | 'desc') => ({
  field,
  direction: direction || 'asc',
});
export const limit = (max: number) => ({ max });
export const startAfter = (snapshot: any) => ({ snapshot });
export const writeBatch = (db: any) => ({
  set: () => ({}),
  update: () => ({}),
  delete: () => ({}),
  commit: () => Promise.resolve(),
});
export const runTransaction = async (db: any, updateFunction: any) =>
  Promise.resolve();
export const onSnapshot = (query: any, callback: any, errorCallback?: any) => {
  console.log('Mock Firebase: Setting up snapshot listener');
  return () => {
    console.log('Mock Firebase: Unsubscribing from snapshot');
  };
};
