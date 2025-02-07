import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, connectAuthEmulator, Auth } from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  Firestore,
  increment as firestoreIncrement 
} from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator, ref } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from 'firebase/auth';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only on client side
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== 'undefined') {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Connect to emulators in development
    if (process.env.NODE_ENV === 'development') {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
      if (storage) {
        connectStorageEmulator(storage, '127.0.0.1', 9199);
      }
      console.log('Successfully connected to emulators');
    } else {
      // Production CORS configuration
      const corsConfig = {
        origin: [process.env.NEXT_PUBLIC_SITE_URL, 'https://mahalle-cursor.web.app'],
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
      };
      
      // Firebase Storage v9+ için CORS yapılandırması
      // Not: CORS yapılandırması Firebase Console üzerinden yapılmalıdır
      console.log('Production mode: CORS should be configured in Firebase Console');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

// Initialize Google provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
  login_hint: 'user@example.com'
});

// Export initialized services and utilities
export { auth, db, storage, firestoreIncrement };

// Google sign in function
export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error('Auth is not initialized');
  }
  
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Successfully signed in with Google');
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Auth state change listener
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    throw new Error('Auth is not initialized');
  }
  
  return onAuthStateChanged(auth, callback);
};

export default app;