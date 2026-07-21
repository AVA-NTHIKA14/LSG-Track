import { auth, googleProvider, db, isFirebaseEnabled } from './firebaseConfig';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile, UserRole } from '../types';

const AUTH_KEY = 'cp_license_active_user';
const USERS_LIST_KEY = 'cp_users';

// Initialize default root system admin for local simulation if no users exist
const initLocalUsers = () => {
  const saved = localStorage.getItem(USERS_LIST_KEY);
  let list: UserProfile[] = [];
  if (saved) {
    try {
      list = JSON.parse(saved);
    } catch {
      list = [];
    }
  }

  // Migrate any old '204902' roles to 'G110706' (Panangad)
  let needsRewrite = false;
  list = list.map(u => {
    if (u.email !== 'admin@lsgtrack.gov.in' && u.panchayathId === '204902') {
      needsRewrite = true;
      return { ...u, panchayathId: 'G110706' };
    }
    return u;
  });

  const hasAdmin = list.some(u => u.email === 'admin@lsgtrack.gov.in');
  if (!hasAdmin) {
    list.push({
      id: 'usr-admin',
      name: 'System Administrator',
      email: 'admin@lsgtrack.gov.in',
      role: 'Administrator',
      permissions: ['all'],
      panchayathId: 'all'
    });
    needsRewrite = true;
  }

  const hasSecretary = list.some(u => u.email === 'secretary@lsgtrack.gov.in');
  if (!hasSecretary) {
    list.push({
      id: 'usr-secretary',
      name: 'Panchayat Secretary',
      email: 'secretary@lsgtrack.gov.in',
      role: 'Secretary',
      permissions: ['approve_license', 'verify_survey', 'view_reports'],
      panchayathId: 'G110706'
    });
    needsRewrite = true;
  }

  const hasDeo = list.some(u => u.email === 'deo@lsgtrack.gov.in');
  if (!hasDeo) {
    list.push({
      id: 'usr-deo',
      name: 'Data Entry Operator',
      email: 'deo@lsgtrack.gov.in',
      role: 'Data Entry Operator',
      permissions: ['register_building', 'view_only'],
      panchayathId: 'G110706'
    });
    needsRewrite = true;
  }

  const hasVeo = list.some(u => u.email === 'veo@lsgtrack.gov.in');
  if (!hasVeo) {
    list.push({
      id: 'usr-veo',
      name: 'Village Extension Officer',
      email: 'veo@lsgtrack.gov.in',
      role: 'VEO',
      permissions: ['submit_survey', 'view_only'],
      panchayathId: 'G110706'
    });
    needsRewrite = true;
  }

  if (needsRewrite || !saved) {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(list));
  }
};

initLocalUsers();

export const authService = {
  // Get active session from localStorage
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

  // Listen to Auth State changes
  subscribeToAuthChanges(callback: (user: UserProfile | null) => void): () => void {
    if (isFirebaseEnabled && auth) {
      return onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          // Fetch from Firestore
          const userRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userRef);
          let userProfile: UserProfile;
          if (userSnap.exists()) {
            userProfile = userSnap.data() as UserProfile;
          } else {
            // Fallback default
            userProfile = {
              id: fbUser.uid,
              name: fbUser.displayName || 'External User',
              email: fbUser.email || '',
              role: 'Read Only Viewer',
              permissions: ['view_only'],
              panchayathId: '204902'
            };
          }
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
        
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);
        
        let userProfile: UserProfile;
        
        if (userSnap.exists()) {
          userProfile = userSnap.data() as UserProfile;
        } else {
          userProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || 'External Officer',
            email: fbUser.email || '',
            role: mockRole || 'Secretary', 
            permissions: mockRole === 'Administrator' ? ['all'] : ['approve_license', 'verify_survey', 'view_reports'],
            panchayathId: '204902' // default fallback
          };
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
      const roleToUse = mockRole || 'Administrator';
      const users = JSON.parse(localStorage.getItem(USERS_LIST_KEY) || '[]');
      const user = users.find((u: UserProfile) => u.role === roleToUse) || users[0];
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
  },

  // Simulated Login directly by credentials (mock mode)
  loginWithCredentials(email: string, panchayathId: string): UserProfile | null {
    initLocalUsers();
    const users = JSON.parse(localStorage.getItem(USERS_LIST_KEY) || '[]');
    
    // Look up user by email/username prefix
    const matched = users.find((u: UserProfile) => 
      u.email.toLowerCase() === email.toLowerCase() ||
      u.email.toLowerCase().split('@')[0] === email.toLowerCase()
    );

    if (!matched) return null;

    // Enforce panchayathId lock (unless they are System Admin)
    if (matched.role !== 'Administrator' && matched.panchayathId !== panchayathId) {
      return null;
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(matched));
    if (matched.role === 'Administrator') {
      localStorage.setItem('cp_active_panchayat_code', panchayathId);
    }
    return matched;
  },

  // Log Out
  async logout(): Promise<void> {
    if (isFirebaseEnabled && auth) {
      await fbSignOut(auth);
    }
    localStorage.removeItem(AUTH_KEY);
  },

  // Check permissions
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  },

  // Local-only management of users (mock mode)
  getLocalUsers(): UserProfile[] {
    initLocalUsers();
    return JSON.parse(localStorage.getItem(USERS_LIST_KEY) || '[]');
  },

  addLocalUser(user: UserProfile): void {
    initLocalUsers();
    const users = JSON.parse(localStorage.getItem(USERS_LIST_KEY) || '[]');
    users.push(user);
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  }
};
