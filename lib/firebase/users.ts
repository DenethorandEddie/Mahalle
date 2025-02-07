import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit as limitTo,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';
import type { User } from '../../types';

// Helper function to get document reference
const getUserDocRef = (userId: string) => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return doc(db, 'users', userId);
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(getUserDocRef(userId));
    if (!userDoc.exists()) {
      return null;
    }
    return {
      id: userDoc.id,
      ...userDoc.data()
    } as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>
) => {
  try {
    await updateDoc(getUserDocRef(userId), {
      ...data,
      lastLoginAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getUsersByActivity = async (limitCount: number = 10): Promise<User[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    const q = query(
      collection(db, 'users'),
      orderBy('lastLoginAt', 'desc'),
      limitTo(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      lastLoginAt: doc.data().lastLoginAt.toDate()
    })) as User[];
  } catch (error) {
    console.error('Error fetching users by activity:', error);
    throw error;
  }
};

export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    // Search by displayName
    const q = query(
      collection(db, 'users'),
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff'),
      limitTo(10)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      lastLoginAt: doc.data().lastLoginAt.toDate()
    })) as User[];
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}; 