# 🏗️ Backend Architecture - Firebase Migration

## 📋 **Current Status**

### ✅ **Completed (Firebase)**
- `analytics` API - Mood analytics and trends
- `mood` API - CRUD for mood entries
- `mood/[id]` API - Individual mood entry management
- `mood/bulk` API - Bulk mood operations
- `mood/stats` API - Mood statistics
- `insights/[id]` API - AI insights management
- `breathing` API - Breathing exercises
- `goals` API - Goal management
- `db.ts` - Firebase configuration
- `database.ts` - Firebase types

### ❌ **Pending (Still Prisma)**
- `auth/forgot-password` API - Password reset
- `auth/register` API - User registration
- `auth/reset-password` API - Password reset
- `calendar` API - Calendar events
- `journal` API - Journal entries
- `journal/[id]` API - Individual journal entries
- `profile` API - User profile
- `reports` API - Progress reports
- `test` API - Testing endpoints
- `auth.ts` - NextAuth configuration

## 🔥 **Firebase Collections Structure**

```typescript
// Collections in Firestore
collections: {
  users: {
    id: string;
    email: string;
    name?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  },
  
  mood_entries: {
    id: string;
    userId: string;
    moodValue: number;
    notes?: string;
    date: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  },
  
  insights: {
    id: string;
    userId: string;
    type: 'recommendation' | 'warning' | 'celebration';
    title: string;
    description: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
    actionable: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  },
  
  breathing_sessions: {
    id: string;
    userId: string;
    exerciseId: string;
    exerciseName: string;
    duration: number;
    cycles: number;
    inhaleTime: number;
    holdTime: number;
    exhaleTime: number;
    completed: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  },
  
  goals: {
    id: string;
    userId: string;
    title: string;
    description?: string;
    category: 'mental-health' | 'physical' | 'social' | 'personal' | 'professional';
    targetDate: Timestamp;
    progress: number;
    status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
    priority: 'low' | 'medium' | 'high';
    milestones: Array<{
      title: string;
      completed: boolean;
      dueDate?: string;
    }>;
    completedAt?: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }
}
```

## 🚀 **Migration Strategy**

### **Phase 1: Core APIs (COMPLETED)**
- ✅ Mood management
- ✅ Analytics
- ✅ Insights
- ✅ Breathing exercises
- ✅ Goals

### **Phase 2: User Management (NEXT)**
- 🔄 Auth APIs (register, forgot-password, reset-password)
- 🔄 Profile API
- 🔄 NextAuth configuration

### **Phase 3: Content APIs**
- 🔄 Journal APIs
- 🔄 Calendar API
- 🔄 Reports API

### **Phase 4: Testing & Cleanup**
- 🔄 Test API
- 🔄 Remove Prisma dependencies
- 🔄 Update documentation

## 💡 **Key Benefits of Firebase**

1. **Serverless**: No database connection issues on Vercel
2. **Scalable**: Automatic scaling
3. **Real-time**: Live updates with Firestore
4. **Security**: Built-in authentication and security rules
5. **Cost-effective**: Pay per use model

## 🔧 **Next Steps**

1. **Fix auth.ts** - Remove Prisma dependency
2. **Migrate auth APIs** - Convert to Firebase
3. **Migrate remaining APIs** - Journal, calendar, reports
4. **Test deployment** - Verify Vercel build success
5. **Clean up** - Remove unused Prisma packages

## 📝 **Code Patterns**

### **Firebase Query Pattern**
```typescript
// Example: Get user's mood entries
const moodQuery = query(
  collection(db, 'mood_entries'),
  where('userId', '==', userId),
  orderBy('date', 'desc'),
  limit(100)
);

const snapshot = await getDocs(moodQuery);
const entries = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### **Firebase CRUD Pattern**
```typescript
// Create
const docRef = await addDoc(collection(db, 'collection_name'), data);

// Read
const docSnap = await getDoc(doc(db, 'collection_name', id));

// Update
await updateDoc(doc(db, 'collection_name', id), updateData);

// Delete
await deleteDoc(doc(db, 'collection_name', id));
```

## 🎯 **Success Criteria**

- [ ] All API routes use Firebase
- [ ] No Prisma imports remain
- [ ] Vercel deployment succeeds
- [ ] All functionality preserved
- [ ] Performance maintained or improved
