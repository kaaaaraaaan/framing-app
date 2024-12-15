import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from '@firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from '@firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  district: string;
}

interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface User {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  role: string;
  city?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  signUp: (userData: UserData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  updateProfile: (profileData: ProfileData) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Set up auth state listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          set({
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: userData.role || 'user',
              city: userData.city
            },
            loading: false,
            initialized: true
          });
        } else {
          set({ user: null, loading: false, initialized: true });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        set({ user: null, loading: false, initialized: true });
      }
    } else {
      set({ user: null, loading: false, initialized: true });
    }
  });

  return {
    user: null,
    loading: true,
    error: null,
    initialized: false,

    setUser: (user) => set({ user }),

    clearError: () => set({ error: null }),

    signIn: async (email: string, password: string) => {
      try {
        set({ loading: true, error: null });
        
        const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (!userDoc.exists()) {
          throw new Error('User profile not found');
        }

        const userData = userDoc.data();
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'user',
          city: userData.city
        };

        set({ user, loading: false, error: null });
      } catch (error) {
        console.error('Login error:', error);
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to sign in',
          user: null 
        });
        throw error;
      }
    },

    signUp: async (userData: UserData) => {
      try {
        set({ loading: true, error: null });
        
        const { user: firebaseUser } = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        await updateFirebaseProfile(firebaseUser, {
          displayName: `${userData.firstName} ${userData.lastName}`
        });

        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          city: userData.city,
          district: userData.district,
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'user',
          city: userData.city
        };

        set({ user, loading: false });
      } catch (error) {
        console.error('Signup error:', error);
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to sign up',
          user: null 
        });
        throw error;
      }
    },

    signOut: async () => {
      try {
        set({ loading: true, error: null });
        await firebaseSignOut(auth);
        set({ user: null, loading: false });
      } catch (error) {
        console.error('Signout error:', error);
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to sign out' 
        });
        throw error;
      }
    },

    updateProfile: async (profileData: ProfileData) => {
      try {
        set({ loading: true, error: null });
        const { user } = get();
        
        if (!user?.id) {
          throw new Error('No user logged in');
        }

        if (auth.currentUser) {
          await updateFirebaseProfile(auth.currentUser, {
            displayName: `${profileData.firstName} ${profileData.lastName}`
          });
        }

        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          city: profileData.city,
          updatedAt: new Date().toISOString()
        });

        set({
          user: {
            ...user,
            firstName: profileData.firstName || user.firstName,
            lastName: profileData.lastName || user.lastName,
            city: profileData.city || user.city,
          },
          loading: false
        });

      } catch (error) {
        console.error('Profile update error:', error);
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to update profile'
        });
        throw error;
      }
    }
  };
});
