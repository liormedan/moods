import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  Unsubscribe
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from './firebase';

// Authentication state listener
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};

// User registration
export const registerUser = async (
  email: string,
  password: string,
  fullName: string
): Promise<UserCredential> => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, {
      displayName: fullName
    });

    // Create user document in Firestore
    const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      email: user.email!,
      fullName,
      preferences: {
        theme: 'system',
        language: 'he',
        notificationsEnabled: true,
        privacyLevel: 'private'
      }
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// User login
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

// User logout
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};

// Password reset
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Pick<User, 'fullName' | 'avatarUrl' | 'preferences'>>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update user email
export const updateUserEmail = async (newEmail: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    await updateEmail(user, newEmail);

    // Update email in Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      email: newEmail,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user email:', error);
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (newPassword: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};

// Delete user account
export const deleteUserAccount = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Delete user document from Firestore
    const userRef = doc(db, 'users', user.uid);
    await deleteDoc(userRef);

    // Delete user authentication account
    await deleteUser(user);
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (): Promise<User | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user data:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

// Get current user ID
export const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid || null;
};

// Get current user email
export const getCurrentUserEmail = (): string | null => {
  return auth.currentUser?.email || null;
};

// Authentication error messages in Hebrew
export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/user-not-found': 'משתמש לא נמצא',
    'auth/wrong-password': 'סיסמה שגויה',
    'auth/email-already-in-use': 'כתובת האימייל כבר בשימוש',
    'auth/weak-password': 'הסיסמה חייבת להכיל לפחות 6 תווים',
    'auth/invalid-email': 'כתובת אימייל לא חוקית',
    'auth/too-many-requests': 'יותר מדי ניסיונות כניסה. נסה שוב מאוחר יותר',
    'auth/network-request-failed': 'בעיית רשת. בדוק את החיבור לאינטרנט',
    'auth/user-disabled': 'החשבון הושבת',
    'auth/operation-not-allowed': 'פעולה לא מורשית',
    'auth/requires-recent-login': 'נדרשת התחברות מחדש לביצוע פעולה זו'
  };

  return errorMessages[errorCode] || 'שגיאה לא ידועה';
};

// Authentication utilities
export const authUtils = {
  // Check if user has specific preference
  hasPreference: (user: User | null, preference: keyof User['preferences'], value: any): boolean => {
    return user?.preferences?.[preference] === value;
  },

  // Check if user is admin of a support group
  isGroupAdmin: (userId: string, group: any): boolean => {
    return group?.admins?.includes(userId) || group?.creatorId === userId;
  },

  // Check if user is member of a support group
  isGroupMember: (userId: string, group: any): boolean => {
    return group?.members?.includes(userId) || group?.admins?.includes(userId) || group?.creatorId === userId;
  },

  // Check if user can view private content
  canViewPrivateContent: (currentUserId: string, contentOwnerId: string, privacyLevel: string): boolean => {
    return currentUserId === contentOwnerId || privacyLevel === 'public';
  }
};

export default {
  onAuthStateChange,
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  deleteUserAccount,
  getCurrentUserData,
  isAuthenticated,
  getCurrentUserId,
  getCurrentUserEmail,
  getAuthErrorMessage,
  authUtils
};
