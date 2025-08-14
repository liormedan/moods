import NextAuth from 'next-auth';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const authOptions = {
  providers: [
    {
      id: 'firebase',
      name: 'Firebase',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;

          // Get additional user data from Firestore using Firebase UID
          const usersRef = collection(db, 'users');
          const userQuery = query(usersRef, where('uid', '==', user.uid));
          const userSnapshot = await getDocs(userQuery);

          let userData = null;
          if (!userSnapshot.empty) {
            userData = userSnapshot.docs[0].data();
          }

          return {
            id: user.uid, // Use Firebase UID as NextAuth ID
            email: user.email,
            name: userData?.name || user.displayName || 'User',
            image: userData?.profileImage || user.photoURL,
          };
        } catch (error) {
          console.error('Firebase authentication error:', error);
          return null;
        }
      },
    },
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
