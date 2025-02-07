import { db, storage, auth } from '../firebase';
import { 
  doc, 
  updateDoc, 
  getDoc, 
  arrayUnion, 
  arrayRemove, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile as updateAuthProfile } from 'firebase/auth';

// Kullanıcı dokümanını oluştur veya güncelle
export const createOrUpdateUserDoc = async (userId: string, data: any) => {
  if (!db) throw new Error('Firestore is not initialized');
  
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Kullanıcı dokümanı yoksa oluştur
    await setDoc(userRef, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalComments: 0,
      totalReplies: 0,
      totalLikes: 0,
      favoriteMahalleler: [],
      mahalleYearsLived: {}, // Mahalle bazlı yaşam süreleri
      notificationPreferences: {
        email: true,
        push: true
      }
    });
  } else {
    // Varsa güncelle
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date()
    });
  }
};

// Kullanıcı bilgilerini güncelleme
export const updateUserProfile = async (
  userId: string,
  data: {
    displayName: string;
    about: string;
    showProfilePhoto: boolean;
  }
) => {
  if (!db) throw new Error('Firestore is not initialized');

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      displayName: data.displayName,
      about: data.about,
      showProfilePhoto: data.showProfilePhoto,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Profil fotoğrafı yükleme
export const uploadProfilePhoto = async (userId: string, file: File) => {
  if (!storage || !db || !auth?.currentUser) throw new Error('Firebase services are not initialized');

  try {
    // Güvenlik kontrolleri
    if (!file.type.startsWith('image/')) {
      throw new Error('Sadece resim dosyaları yüklenebilir.');
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Dosya boyutu 5MB\'dan küçük olmalıdır.');
    }

    // Desteklenen formatlar kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Sadece JPEG, PNG, GIF ve WEBP formatları desteklenir.');
    }

    // Yetki kontrolü
    if (auth.currentUser.uid !== userId) {
      throw new Error('Bu işlem için yetkiniz yok.');
    }

    // Benzersiz bir dosya adı oluştur
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExtension}`;
    const photoRef = ref(storage, `profile-photos/${userId}/${fileName}`);

    // Metadata ekle
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'uploadedBy': userId,
        'uploadedAt': new Date().toISOString(),
        'originalName': file.name
      },
      cacheControl: 'public,max-age=7200'
    };

    console.log('Starting photo upload with metadata:', metadata);

    // Fotoğrafı yükle
    const snapshot = await uploadBytes(photoRef, file, metadata);
    console.log('Uploaded photo successfully:', snapshot);
    
    // Download URL'i al
    const photoURL = await getDownloadURL(snapshot.ref);
    console.log('Got download URL:', photoURL);

    // Auth profilini güncelle
    await updateAuthProfile(auth.currentUser, { photoURL });
    console.log('Updated auth profile with new photo URL');

    // Kullanıcı dokümanını güncelle
    await createOrUpdateUserDoc(userId, { 
      photoURL,
      updatedAt: new Date()
    });
    console.log('Updated user document with new photo URL');

    return photoURL;
  } catch (error: any) {
    console.error('Error uploading profile photo:', error);
    
    // Daha detaylı hata mesajları
    if (error.code === 'storage/unauthorized') {
      throw new Error('Profil fotoğrafı yükleme izniniz yok. Lütfen giriş yapın.');
    } else if (error.code === 'storage/canceled') {
      throw new Error('Profil fotoğrafı yükleme işlemi iptal edildi.');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Profil fotoğrafı yüklenirken bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    }
    
    throw error;
  }
};

// Favori mahalle ekleme
export const addFavoriteMahalle = async (
  userId: string,
  mahalleData: {
    il: string;
    ilce: string;
    mahalle: string;
  }
) => {
  if (!db) throw new Error('Firestore is not initialized');
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    favoriteMahalleler: arrayUnion(mahalleData),
  });
};

// Favori mahalle çıkarma
export const removeFavoriteMahalle = async (
  userId: string,
  mahalleData: {
    il: string;
    ilce: string;
    mahalle: string;
  }
) => {
  if (!db) throw new Error('Firestore is not initialized');
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    favoriteMahalleler: arrayRemove(mahalleData),
  });
};

// Kullanıcı istatistiklerini getirme
export const getUserStats = async (userId: string) => {
  if (!db) throw new Error('Firestore is not initialized');
  
  try {
    // Kullanıcı dokümanını al
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    // Kullanıcının yorumlarını al
    const commentsQuery = query(
      collection(db, 'comments'),
      where('userId', '==', userId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    const totalComments = commentsSnapshot.size;

    // Kullanıcının aldığı toplam beğeni sayısını hesapla
    let totalLikes = 0;
    commentsSnapshot.forEach((doc) => {
      const comment = doc.data();
      if (comment.votes) {
        totalLikes += (comment.votes.upvotes || 0) - (comment.votes.downvotes || 0);
      }
    });

    // Kullanıcının cevaplarını say
    let totalReplies = 0;
    for (const commentDoc of commentsSnapshot.docs) {
      const repliesQuery = query(collection(db, 'comments', commentDoc.id, 'replies'));
      const repliesSnapshot = await getDocs(repliesQuery);
      totalReplies += repliesSnapshot.size;
    }

    // Kullanıcı dokümanını güncelle
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        totalComments,
        totalReplies,
        totalLikes,
        updatedAt: new Date()
      });
    } else {
      // Kullanıcı dokümanı yoksa oluştur
      await setDoc(userRef, {
        totalComments,
        totalReplies,
        totalLikes,
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteMahalleler: []
      });
    }

    return {
      totalComments,
      totalReplies,
      totalLikes,
      favoriteMahalleler: userDoc.exists() ? userDoc.data()?.favoriteMahalleler || [] : []
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    // Hata durumunda varsayılan değerleri döndür
    return {
      totalComments: 0,
      totalReplies: 0,
      totalLikes: 0,
      favoriteMahalleler: []
    };
  }
};

// Bildirim tercihlerini güncelleme
export const updateNotificationPreferences = async (
  userId: string,
  preferences: {
    email: boolean;
    push: boolean;
  }
) => {
  if (!db) throw new Error('Firestore is not initialized');
  await createOrUpdateUserDoc(userId, {
    notificationPreferences: preferences,
  });
};

// Mahallede yaşanılan süreyi güncelleme
export const updateMahalleYearsLived = async (
  userId: string,
  mahalleData: {
    il: string;
    ilce: string;
    mahalle: string;
  },
  yearsRange: '0-1' | '1-3' | '3-5' | '5-10' | '10+'
) => {
  if (!db) throw new Error('Firestore is not initialized');
  
  const userRef = doc(db, 'users', userId);
  const mahalleKey = `${mahalleData.il}_${mahalleData.ilce}_${mahalleData.mahalle}`;
  
  await updateDoc(userRef, {
    [`mahalleYearsLived.${mahalleKey}`]: yearsRange,
    updatedAt: new Date()
  });
};

// Mahallede yaşanılan süreyi getirme
export const getMahalleYearsLived = async (
  userId: string,
  mahalleData: {
    il: string;
    ilce: string;
    mahalle: string;
  }
) => {
  if (!db) throw new Error('Firestore is not initialized');
  
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) return null;
  
  const mahalleKey = `${mahalleData.il}_${mahalleData.ilce}_${mahalleData.mahalle}`;
  const userData = userDoc.data();
  
  return userData.mahalleYearsLived?.[mahalleKey] || null;
}; 