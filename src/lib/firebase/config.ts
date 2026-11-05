import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

const env = (import.meta.env || {}) as Record<string, string | undefined>;

const firebaseConfig = {
  apiKey: env['VITE_FIREBASE_API_KEY'] || '',
  authDomain: env['VITE_FIREBASE_AUTH_DOMAIN'] || '',
  projectId: env['VITE_FIREBASE_PROJECT_ID'] || '',
  storageBucket: env['VITE_FIREBASE_STORAGE_BUCKET'] || '',
  messagingSenderId: env['VITE_FIREBASE_MESSAGING_SENDER_ID'] || '',
  appId: env['VITE_FIREBASE_APP_ID'] || '',
  measurementId: env['VITE_FIREBASE_MEASUREMENT_ID'] || '',
};

export const hasLiveFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let analytics: Analytics | undefined;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      });
    }
  }
} catch (err) {
  console.warn('Firebase initialization error:', err);
}

export { app, auth, db, storage, analytics };
