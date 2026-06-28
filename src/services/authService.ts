import { auth, googleProvider, db, isFirebaseEnabled } from './firebaseConfig';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile, UserRole } from '../types';
import { mockUsers } from '../data/buildingsSeed';

const AUTH_KEY = 'cp_license_active_user';

export const authService = {
  // Get active session from localStorage or Firebase
  getCurrentUser(): UserProfile | null {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Listen to Auth State changes (Firebase wrapper or local callback)
  subscribeToAuthChanges(callback: (user: UserProfile | null) => void): () => void {
    if (isFirebaseEnabled && auth) {
      return onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          // In real production, we would fetch the user role from Firestore.
          // For the prototype, we match by email to mockUsers or assign Default Data Entry
          const matched = mockUsers.find(u => u.email === fbUser.email);
          const userProfile: UserProfile = matched || {
            id: fbUser.uid,
            name: fbUser.displayName || 'External User',
            email: fbUser.email || '',
            role: 'Read Only Viewer',
            permissions: ['view_only']
          };
          localStorage.setItem(AUTH_KEY, JSON.stringify(userProfile));
          callback(userProfile);
        } else {
          localStorage.removeItem(AUTH_KEY);
          callback(null);
        }
      });
    } else {
      // Local storage listener
      const interval = setInterval(() => {
        const user = this.getCurrentUser();
        callback(user);
      }, 1000);
      return () => clearInterval(interval);
    }
  },

  // Sign In using Google (or simulate fallback)
  async signInWithGoogle(mockRole?: UserRole): Promise<UserProfile> {
    if (isFirebaseEnabled && auth && googleProvider && db) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        
        // Query Firestore to see if user has custom role/ward assigned
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);
        
        let userProfile: UserProfile;
        
        if (userSnap.exists()) {
          userProfile = userSnap.data() as UserProfile;
        } else {
          // New Google Sign-In user
          const matched = mockUsers.find(u => u.email === fbUser.email);
          userProfile = matched || {
            id: fbUser.uid,
            name: fbUser.displayName || 'External Officer',
            email: fbUser.email || '',
            role: mockRole || 'Secretary', // Default to Secretary (main authority)
            permissions: mockRole === 'Administrator' ? ['all'] : ['approve_license', 'verify_survey', 'view_reports']
          };
          
          // Persist user record in Firestore
          await setDoc(userRef, userProfile);
        }
        
        localStorage.setItem(AUTH_KEY, JSON.stringify(userProfile));
        return userProfile;
      } catch (error) {
        console.error('Google Sign-In failed:', error);
        throw error;
      }
    } else {
      // Simulation mode
      // If no mockRole provided, default to Administrator
      const roleToUse = mockRole || 'Administrator';
      const user = mockUsers.find(u => u.role === roleToUse) || mockUsers[0];
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
  },

  // Simulated Login directly by choosing a profile
  loginAsMockProfile(userId: string): UserProfile {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User profile not found');
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  // Log Out
  async logout(): Promise<void> {
    if (isFirebaseEnabled && auth) {
      await fbSignOut(auth);
    }
    localStorage.removeItem(AUTH_KEY);
  },

  // Check if current user has permission
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  }
};
