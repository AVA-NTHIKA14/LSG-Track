import { auth, db, firebaseInitializationError, isFirebaseEnabled } from './firebaseConfig';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile, UserRole } from '../types';
import { isAuthorizedPortalRole } from './portalRoles';

const AUTH_KEY = 'cp_license_active_user';
const ACTIVE_PANCHAYAT_KEY = 'cp_active_panchayat_code';
let currentProfile: UserProfile | null = null;

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
    const user = this.getCurrentUser();
    callback(user);
    const interval = setInterval(() => {
      const currentUser = this.getCurrentUser();
      callback(currentUser);
    }, 1000);
    return () => clearInterval(interval);
  },

  async signUp(params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    panchayatCode: string;
    wardNumber?: string | number | null;
  }): Promise<UserProfile> {
    if (!isFirebaseEnabled || !auth || !db) {
      throw new Error(firebaseInitializationError || 'Firebase Authentication is not configured in .env.');
    }

    const fullEmail = params.email.includes('@') ? params.email.trim() : `${params.email.trim().toLowerCase()}@lsgtrack.gov.in`;

    const credential = await createUserWithEmailAndPassword(auth, fullEmail, params.password);
    const uid = credential.user.uid;

    const userProfile: UserProfile = {
      uid,
      id: uid,
      name: params.name.trim() || 'Grama Officer',
      email: fullEmail,
      role: params.role,
      panchayatCode: params.panchayatCode,
      panchayathId: params.panchayatCode,
      wardNumber: params.wardNumber || null,
      status: 'PENDING',
      active: true,
      createdAt: new Date().toISOString(),
      permissions: params.role === 'Secretary' || params.role === 'Administrator' 
        ? ['approve_license', 'verify_survey', 'view_reports']
        : params.role === 'Field Officer' || params.role === 'Panchayat Section Clerk'
          ? ['register_building', 'view_only']
          : ['submit_survey', 'view_only']
    };

    if (params.wardNumber) {
      userProfile.ward = String(params.wardNumber);
    }

    await setDoc(doc(db, 'users', uid), userProfile);
    await firebaseSignOut(auth);
    clearSession();
    return userProfile;
  },

  async loginWithCredentials(email: string, password: string, panchayathId: string): Promise<UserProfile | null> {
    if (!email || !password.trim()) return null;

    if (!isFirebaseEnabled || !auth || !db) {
      throw new Error(firebaseInitializationError || 'Firebase Authentication is not configured in .env.');
    }

    const fullEmail = email.includes('@') ? email.trim() : `${email.trim().toLowerCase()}@lsgtrack.gov.in`;

    const credential = await signInWithEmailAndPassword(auth, fullEmail, password);
    const profile = await getProfile(credential.user.uid);

    if (!profile) {
      await firebaseSignOut(auth);
      clearSession();
      throw new Error(`Profile document for ${fullEmail} not found in Firestore /users collection.`);
    }

    if (profile.status === 'PENDING') {
      await firebaseSignOut(auth);
      clearSession();
      throw new Error(`Account PENDING approval: ${fullEmail} registration is awaiting Panchayat Secretary approval.`);
    }

    if (profile.status === 'REJECTED') {
      await firebaseSignOut(auth);
      clearSession();
      throw new Error(`Access denied: Registration for ${fullEmail} was rejected by Secretary.`);
    }

    if (profile.active === false) {
      await firebaseSignOut(auth);
      clearSession();
      throw new Error(`Access denied: Account ${fullEmail} has been deactivated.`);
    }

    if (!isAuthorizedPortalRole(profile.role)) {
      await firebaseSignOut(auth);
      clearSession();
      throw new Error(`Access denied: Unauthorized role (${profile.role}).`);
    }

    const userTenantCode = profile.panchayathId || profile.panchayatCode;
    if (profile.role !== 'Administrator' && profile.role !== 'admin' && userTenantCode !== panchayathId) {
      await firebaseSignOut(auth);
      clearSession();
      throw new Error(`Jurisdiction Mismatch: Account belongs to Panchayat ${userTenantCode}, not selected ${panchayathId}.`);
    }

    const targetCode = (userTenantCode && userTenantCode !== 'all')
      ? userTenantCode
      : (panchayathId && panchayathId !== 'all' ? panchayathId : 'G110706');

    setCurrentProfile(profile);
    localStorage.setItem(ACTIVE_PANCHAYAT_KEY, targetCode);
    return profile;
  },

  async logout(): Promise<void> {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn('Signout error:', err);
      }
    }
    clearSession();
  },

  async sendPasswordReset(email: string): Promise<void> {
    if (!isFirebaseEnabled || !auth) {
      throw new Error(firebaseInitializationError || 'Firebase Authentication is not configured in .env.');
    }

    const normalizedEmail = email.includes('@') ? email.trim() : `${email.trim().toLowerCase()}@lsgtrack.gov.in`;
    await sendPasswordResetEmail(auth, normalizedEmail);
  },

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) return true;
    return Boolean(user.permissions?.includes('all') || user.permissions?.includes(permission));
  }
};
