import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredConfigKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

export const isFirebaseEnabled = requiredConfigKeys.every((key) => Boolean(import.meta.env[key]));
export let firebaseInitializationError: string | null = isFirebaseEnabled
  ? null
  : 'Firebase configuration is incomplete.';

let app;
let auth: any = null;
let db: any = null;
let storage: any = null;
let googleProvider: any = null;

if (isFirebaseEnabled) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({})
    });
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    firebaseInitializationError = error instanceof Error ? error.message : 'Firebase initialization failed.';
    console.error('Firebase initialization failed:', error);
  }
}

export { auth, db, storage, googleProvider };
