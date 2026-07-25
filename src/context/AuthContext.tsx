import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseEnabled } from '../services/firebaseConfig';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
});

const AUTH_PROFILE_KEY = 'cp_license_active_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(AUTH_PROFILE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser: User | null) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        localStorage.removeItem(AUTH_PROFILE_KEY);
        setLoading(false);
        return;
      }

      // Live Firestore onSnapshot listener on /users/{uid}
      if (db) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeProfile = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const userProfileData = docSnap.data() as UserProfile;
              setProfile(userProfileData);
              localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(userProfileData));
              if (userProfileData.panchayatCode) {
                localStorage.setItem('cp_active_panchayat_code', userProfileData.panchayatCode);
              }
            } else {
              setProfile(null);
              localStorage.removeItem(AUTH_PROFILE_KEY);
            }
            setLoading(false);
          },
          (err) => {
            console.warn('Profile snapshot error (permission or network):', err);
            setLoading(false);
          }
        );

        return () => unsubscribeProfile();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const loginWithGoogle = async () => {
    if (!isFirebaseEnabled || !auth || !googleProvider) {
      throw new Error('Google Authentication is not configured in .env');
    }
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn('Signout error:', err);
      }
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(AUTH_PROFILE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);