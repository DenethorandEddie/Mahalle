import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const createUser = async (
  email: string,
  password: string,
  displayName: string
) => {
  if (!auth || !db) {
    throw new Error('Firebase services are not initialized');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db as any, 'users', user.uid), {
      email: user.email,
      displayName,
      createdAt: new Date(),
      lastLoginAt: new Date()
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Auth is not initialized');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  if (!auth) {
    throw new Error('Auth is not initialized');
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    throw new Error('Auth is not initialized');
  }

  return onAuthStateChanged(auth, callback);
}; 