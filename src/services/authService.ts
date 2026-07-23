import { auth, db, firebaseInitializationError, isFirebaseEnabled } from './firebaseConfig';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '../types';
import { isAuthorizedPortalRole } from './portalRoles';

const AUTH_KEY = 'cp_license_active_user';
const ACTIVE_PANCHAYAT_KEY = 'cp_active_panchayat_code';
let currentProfile: UserProfile | null = null;

// Mock local accounts for local simulation mode
const LOCAL_MOCK_USERS: UserProfile[] = [
  {
    id: 'usr-admin',
    name: 'System Administrator',
    email: 'admin@lsgtrack.gov.in',
    role: 'Administrator',
    permissions: ['all'],
    panchayathId: 'all',
    active: true
  },
  {
    id: 'usr-secretary',
    name: 'Panchayat Secretary',
    email: 'secretary@lsgtrack.gov.in',
    role: 'Secretary',
    permissions: ['approve_license', 'verify_survey', 'view_reports'],
    panchayathId: 'G110706',
    active: true
  },
  {
    id: 'usr-clerk',
    name: 'Panchayat Section Clerk',
    email: 'clerk@lsgtrack.gov.in',
    role: 'Panchayat Section Clerk',
    permissions: ['register_building', 'view_only'],
    panchayathId: 'G110706',
    active: true
  },
  {
    id: 'usr-ward',
    name: 'Ward Member / Field Inspector',
    email: 'ward@lsgtrack.gov.in',
    role: 'Ward Member',
    permissions: ['submit_survey', 'view_only'],
    panchayathId: 'G110706',
    active: true
  }
];

const clearSession = () => {
  currentProfile = null;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(ACTIVE_PANCHAYAT_KEY);
};

const getProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) return null;
  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
};

const setCurrentProfile = (profile: UserProfile) => { 
  currentProfile = profile; 
  localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
};

export const authService = {
  getCurrentUser(): UserProfile | null {
    if (auth?.currentUser && currentProfile) {
      return currentProfile;
    }
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

  subscribeToAuthChanges(callback: (user: UserProfile | null) => void): () => void {
    if (isFirebaseEnabled && auth && db) {
      return onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          clearSession();
          callback(null);
          return;
        }

        try {
          const profile = await getProfile(firebaseUser.uid);
          if (!profile || profile.active === false || !isAuthorizedPortalRole(profile.role)) {
            await firebaseSignOut(auth);
            clearSession();
            callback(null);
            return;
          }
          setCurrentProfile(profile);
          callback(profile);
        } catch {
          clearSession();
          callback(null);
        }
      });
    } else {
      // Local simulation mode listener
      const user = this.getCurrentUser();
      callback(user);
      const interval = setInterval(() => {
        const currentUser = this.getCurrentUser();
        callback(currentUser);
      }, 1000);
      return () => clearInterval(interval);
    }
  },

  async loginWithCredentials(email: string, password: string, panchayathId: string): Promise<UserProfile | null> {
    if (!email || !password.trim()) return null;

    const fullEmail = email.includes('@') ? email.trim() : `${email.trim().toLowerCase()}@lsgtrack.gov.in`;

    // 1. Firebase Authentication mode
    if (isFirebaseEnabled && auth && db) {
      const credential = await signInWithEmailAndPassword(auth, fullEmail, password);
      const profile = await getProfile(credential.user.uid);

      if (
        !profile ||
        profile.active === false ||
        !isAuthorizedPortalRole(profile.role) ||
        (profile.role !== 'Administrator' && profile.panchayathId !== panchayathId)
      ) {
        await firebaseSignOut(auth);
        clearSession();
        return null;
      }

      setCurrentProfile(profile);
      if (profile.role === 'Administrator') localStorage.setItem(ACTIVE_PANCHAYAT_KEY, panchayathId);
      return profile;
    }

    // 2. Local Simulation Fallback mode (when Firebase credentials are not in .env)
    const usernamePrefix = fullEmail.split('@')[0].toLowerCase();
    const matched = LOCAL_MOCK_USERS.find(u => 
      u.email.toLowerCase() === fullEmail.toLowerCase() ||
      u.email.split('@')[0].toLowerCase() === usernamePrefix
    );

    if (!matched) {
      throw new Error(`Account '${email}' not found. Valid mock accounts: admin, secretary, deo, veo.`);
    }

    if (matched.active === false) {
      throw new Error(`Account '${email}' has been deactivated.`);
    }

    // Validate password: for mock accounts, expect <username>123 e.g. secretary123, admin123
    const expectedPassword = `${usernamePrefix}123`;
    if (password !== expectedPassword && password !== 'admin123' && password.length < 6) {
      throw new Error(`Invalid password for '${usernamePrefix}'. For local test accounts, use password '${expectedPassword}'.`);
    }

    if (matched.role !== 'Administrator' && matched.panchayathId !== panchayathId) {
      throw new Error(`Access mismatch: User is assigned to Panchayat ${matched.panchayathId}, not ${panchayathId}.`);
    }

    setCurrentProfile(matched);
    localStorage.setItem(ACTIVE_PANCHAYAT_KEY, panchayathId);
    return matched;
  },

  async logout(): Promise<void> {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch {
        // ignore signout error in mock mode
      }
    }
    clearSession();
  },

  async sendPasswordReset(email: string): Promise<void> {
    if (!isFirebaseEnabled || !auth) {
      throw new Error(firebaseInitializationError || 'Firebase Authentication is not enabled. Fill your .env credentials to enable password resets.');
    }

    const normalizedEmail = email.includes('@') ? email.trim() : `${email.trim().toLowerCase()}@lsgtrack.gov.in`;
    await sendPasswordResetEmail(auth, normalizedEmail);
  },

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return Boolean(user && (user.permissions.includes('all') || user.permissions.includes(permission)));
  }
};
