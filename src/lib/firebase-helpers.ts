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
  writeBatch,
  runTransaction,
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Firebase service class for CRUD operations
export class FirebaseService<T extends DocumentData> {
  constructor(private collectionName: string) {}

  // Create a new document
  async create(data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`✅ Firebase: Created ${this.collectionName} with ID ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error(`❌ Firebase: Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get a document by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as T;
        console.log(`✅ Firebase: Retrieved ${this.collectionName} with ID ${id}`);
        return { ...data, id: docSnap.id } as T;
      } else {
        console.log(`ℹ️ Firebase: ${this.collectionName} with ID ${id} not found`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Firebase: Error getting ${this.collectionName} with ID ${id}:`, error);
      throw error;
    }
  }

  // Update a document
  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
      console.log(`✅ Firebase: Updated ${this.collectionName} with ID ${id}`);
    } catch (error) {
      console.error(`❌ Firebase: Error updating ${this.collectionName} with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log(`✅ Firebase: Deleted ${this.collectionName} with ID ${id}`);
    } catch (error) {
      console.error(`❌ Firebase: Error deleting ${this.collectionName} with ID ${id}:`, error);
      throw error;
    }
  }

  // Query documents with filters
  async query(filters: Array<{ field: string; operator: any; value: any }> = []): Promise<T[]> {
    try {
      let q: any = collection(db, this.collectionName);
      
      // Apply filters
      filters.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });
      
      const querySnapshot = await getDocs(q);
      const results: T[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as T;
        results.push({ ...data, id: doc.id } as T);
      });
      
      console.log(`✅ Firebase: Retrieved ${results.length} ${this.collectionName} documents`);
      return results;
    } catch (error) {
      console.error(`❌ Firebase: Error querying ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get documents with pagination
  async getWithPagination(limitCount: number = 10, lastDoc?: QueryDocumentSnapshot): Promise<T[]> {
    try {
      let q: any = collection(db, this.collectionName);
      q = query(q, orderBy('createdAt', 'desc'), limit(limitCount));
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const results: T[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as T;
        results.push({ ...data, id: doc.id } as T);
      });
      
      console.log(`✅ Firebase: Retrieved ${results.length} ${this.collectionName} documents with pagination`);
      return results;
    } catch (error) {
      console.error(`❌ Firebase: Error getting ${this.collectionName} with pagination:`, error);
      throw error;
    }
  }

  // Set up real-time listener
  onSnapshot(callback: (docs: T[]) => void): Unsubscribe {
    try {
      const q: any = collection(db, this.collectionName);
      return onSnapshot(q, (querySnapshot: any) => {
        const results: T[] = [];
        querySnapshot.forEach((doc: any) => {
          const data = doc.data() as T;
          results.push({ ...data, id: doc.id } as T);
        });
        callback(results);
      });
    } catch (error) {
      console.error(`❌ Firebase: Error setting up snapshot listener for ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Batch operations
  async batchUpdate(updates: Array<{ id: string; data: Partial<T> }>): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      updates.forEach(({ id, data }) => {
        const docRef = doc(db, this.collectionName, id);
        batch.update(docRef, {
          ...data,
          updatedAt: Timestamp.now(),
        });
      });
      
      await batch.commit();
      console.log(`✅ Firebase: Batch updated ${updates.length} ${this.collectionName} documents`);
    } catch (error) {
      console.error(`❌ Firebase: Error batch updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Transaction operations
  async runTransaction<TResult>(
    updateFunction: (transaction: any) => Promise<TResult>
  ): Promise<TResult> {
    try {
      return await runTransaction(db, updateFunction);
    } catch (error) {
      console.error(`❌ Firebase: Error running transaction for ${this.collectionName}:`, error);
      throw error;
    }
  }
}

// Export Firebase types
export type { DocumentData, QueryDocumentSnapshot, Unsubscribe, Timestamp };

// Export Firebase service
export default FirebaseService;
