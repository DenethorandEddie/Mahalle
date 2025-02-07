import { useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { auth, onAuthChange } from '../firebase';
import { useToast } from '@chakra-ui/react';
import { createOrUpdateUserDoc } from '../firebase/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  useEffect(() => {
    try {
      const unsubscribe = onAuthChange(async (currentUser: User | null) => {
        if (currentUser) {
          // Kullanıcı giriş yaptığında Firestore'da dokümanını oluştur/güncelle
          try {
            await createOrUpdateUserDoc(currentUser.uid, {
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            });
          } catch (error) {
            console.error('Error creating/updating user document:', error);
          }
        }
        setUser(currentUser);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred'));
      }
      setLoading(false);
    }
  }, []);

  const updateProfile = async (photoURL: string) => {
    if (!auth?.currentUser) {
      throw new Error('User is not authenticated');
    }

    try {
      await firebaseUpdateProfile(auth.currentUser, { photoURL });
      // Kullanıcı state'ini güncelle
      setUser(auth.currentUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signIn = async () => {
    if (!auth) {
      throw new Error('Auth is not initialized');
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      
      // Kullanıcı dokümanını oluştur/güncelle
      if (result.user) {
        await createOrUpdateUserDoc(result.user.uid, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        });
      }

      toast({
        title: 'Giriş başarılı',
        status: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      let errorMessage = 'Giriş yapılırken bir hata oluştu';
      
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google ile giriş şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup penceresi engellendi. Lütfen popup engelleyiciyi kapatın.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Giriş işlemi iptal edildi.';
      }

      toast({
        title: 'Hata',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) {
      throw new Error('Auth is not initialized');
    }

    try {
      await firebaseSignOut(auth);
      toast({
        title: 'Çıkış yapıldı',
        status: 'info',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Hata',
        description: 'Çıkış yapılırken bir hata oluştu',
        status: 'error',
        duration: 5000,
      });
      throw error;
    }
  };

  return { user, loading, error, signIn, signOut, updateProfile };
}; 