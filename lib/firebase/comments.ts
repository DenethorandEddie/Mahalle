import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  setDoc,
  enableNetwork,
  disableNetwork,
  waitForPendingWrites,
  Firestore,
  CollectionReference,
  DocumentData,
  DocumentReference,
  serverTimestamp,
  limit as limitTo
} from 'firebase/firestore';
import { db, firestoreIncrement } from '../firebase';
import type { Comment, Reply, LocationData, Notification, TrendingMahalle, RatingData } from '../../types';

// Network status check
let isOnline = true;

// Network status monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    isOnline = true;
    try {
      if (db) {
        await enableNetwork(db);
        console.log('Network connection restored');
      }
    } catch (error) {
      console.error('Error enabling network:', error);
    }
  });

  window.addEventListener('offline', async () => {
    isOnline = false;
    try {
      if (db) {
        await disableNetwork(db);
        console.log('Network connection disabled');
      }
    } catch (error) {
      console.error('Error disabling network:', error);
    }
  });
}

// Helper functions to get Firestore references
const getCollectionRef = (path: string): CollectionReference<DocumentData> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  const segments = path.split('/');
  if (segments.length === 1) {
    return collection(db as Firestore, segments[0]);
  }
  if (segments.length === 3) {
    return collection(db as Firestore, segments[0], segments[1], segments[2]);
  }
  throw new Error('Invalid path format');
};

const getDocRef = (path: string): DocumentReference<DocumentData> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  const segments = path.split('/');
  if (segments.length !== 2) {
    throw new Error('Invalid path format');
  }
  return doc(db as Firestore, segments[0], segments[1]);
};

export const addComment = async (
  text: string,
  userId: string,
  locationData: LocationData,
  rating: number,
  displayName?: string,
  photoURL?: string,
  categoryRatings: { [key: string]: number } = {},
  yearsLived: '0-1' | '1-3' | '3-5' | '5-10' | '10+' = '0-1'
) => {
  if (!isOnline) {
    throw new Error('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
  }

  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    await waitForPendingWrites(db);

    // Get user document to check showProfilePhoto setting
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.exists() ? userDoc.data() : null;
    const showProfilePhoto = userData?.showProfilePhoto ?? true;

    const finalDisplayName = displayName || `Anonim${Math.floor(Math.random() * 10000)}`;

    const commentData: any = {
      text,
      userId,
      displayName: finalDisplayName,
      rating,
      createdAt: new Date(),
      categoryRatings,
      yearsLived,
      votes: {
        upvotes: 0,
        downvotes: 0,
        helpful: 0
      },
      totalScore: 0,
      showProfilePhoto,
      ...locationData,
    };

    // Sadece photoURL tanımlıysa ve showProfilePhoto true ise ekle
    if (photoURL && showProfilePhoto) {
      commentData.photoURL = photoURL;
    }

    const docRef = await addDoc(getCollectionRef('comments'), commentData);

    // Mahalle istatistiklerini güncelle
    await updateMahalleAnalytics(locationData.il, locationData.ilce, locationData.mahalle, {
      isComment: true,
      rating: rating,
      isPositiveComment: rating >= 4,
      isNegativeComment: rating <= 2
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    if (error instanceof Error) {
      throw new Error(`Yorum eklenirken bir hata oluştu: ${error.message}`);
    }
    throw new Error('Yorum eklenirken beklenmeyen bir hata oluştu.');
  }
};

export const addReply = async (
  commentId: string,
  text: string,
  displayName: string,
  photoURL?: string
) => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    await waitForPendingWrites(db);
    
    const commentDoc = await getDoc(getDocRef(`comments/${commentId}`));
    if (!commentDoc.exists()) {
      throw new Error('Yorum bulunamadı');
    }

    const commentData = commentDoc.data();

    const replyData: any = {
      text,
      displayName,
      createdAt: new Date(),
      parentCommentId: commentId,
      parentCommentUserId: commentData.userId
    };

    // Sadece photoURL tanımlıysa ekle
    if (photoURL) {
      replyData.photoURL = photoURL;
    }

    const replyRef = await addDoc(getCollectionRef(`comments/${commentId}/replies`), replyData);

    // Bildirim oluştur
    await addDoc(getCollectionRef('notifications'), {
      type: 'reply',
      userId: commentData.userId,
      read: false,
      createdAt: new Date(),
      commentId,
      replyId: replyRef.id,
      replyText: text,
      replyUserDisplayName: displayName,
      locationData: {
        il: commentData.il,
        ilce: commentData.ilce,
        mahalle: commentData.mahalle
      }
    });

    return replyRef.id;
  } catch (error) {
    console.error('Error adding reply:', error);
    if (!isOnline) {
      throw new Error('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
    }
    throw error;
  }
};

export const getCommentsByLocation = async (il: string, ilce: string, mahalle: string) => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    const q = query(
      getCollectionRef('comments'),
      where('il', '==', il),
      where('ilce', '==', ilce),
      where('mahalle', '==', mahalle),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const comment = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        categoryRatings: data.categoryRatings || {
          security: 0,
          transportation: 0,
          noise: 0,
          cleanliness: 0,
          socialLife: 0,
          accessibility: 0
        }
      } as Comment;
      
      const repliesSnapshot = await getDocs(getCollectionRef(`comments/${doc.id}/replies`));
      comment.replies = repliesSnapshot.docs.map(replyDoc => ({
        id: replyDoc.id,
        ...replyDoc.data(),
        createdAt: replyDoc.data().createdAt.toDate(),
      } as Reply));

      comments.push(comment);
    }

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    if (!isOnline) {
      throw new Error('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
    }
    throw error;
  }
};

export const getUserNotifications = async (userId: string) => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    const q = query(
      getCollectionRef('notifications'),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    await updateDoc(getDocRef(`notifications/${notificationId}`), {
      read: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const getUserComments = async (userId: string) => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    const q = query(
      getCollectionRef('comments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];

    for (const doc of querySnapshot.docs) {
      const comment = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as Comment;
      
      const repliesSnapshot = await getDocs(getCollectionRef(`comments/${doc.id}/replies`));
      comment.replies = repliesSnapshot.docs.map(replyDoc => ({
        id: replyDoc.id,
        ...replyDoc.data(),
        createdAt: replyDoc.data().createdAt.toDate(),
      } as Reply));

      comments.push(comment);
    }

    return comments;
  } catch (error) {
    console.error('Error fetching user comments:', error);
    throw error;
  }
};

export const getRating = async (il: string, ilce: string, mahalle: string): Promise<RatingData> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  if (!il || !ilce || !mahalle) {
    return {
      average: 0,
      count: 0,
      distribution: {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0
      },
      categoryAverages: {
        guvenlik: 0,
        ulasim: 0,
        temizlik: 0,
        sessizlik: 0,
        komsu: 0,
        yesil: 0
      }
    };
  }

  try {
    const q = query(
      getCollectionRef('comments'),
      where('il', '==', il),
      where('ilce', '==', ilce),
      where('mahalle', '==', mahalle)
    );

    const querySnapshot = await getDocs(q);
    let totalRating = 0;
    let count = 0;
    const distribution = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0
    };

    const categoryTotals = {
      guvenlik: { sum: 0, count: 0 },
      ulasim: { sum: 0, count: 0 },
      temizlik: { sum: 0, count: 0 },
      sessizlik: { sum: 0, count: 0 },
      komsu: { sum: 0, count: 0 },
      yesil: { sum: 0, count: 0 }
    };

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const rating = data.rating;
      if (rating) {
        totalRating += rating;
        count++;
        const roundedRating = Math.round(rating);
        if (roundedRating >= 1 && roundedRating <= 5) {
          distribution[roundedRating.toString() as keyof typeof distribution]++;
        }
      }

      // Kategori puanlarını topla
      if (data.categoryRatings) {
        Object.entries(data.categoryRatings).forEach(([category, value]) => {
          if (category in categoryTotals && typeof value === 'number' && value > 0) {
            categoryTotals[category as keyof typeof categoryTotals].sum += value;
            categoryTotals[category as keyof typeof categoryTotals].count++;
          }
        });
      }
    });

    // Kategori ortalamalarını hesapla
    const categoryAverages = {
      guvenlik: categoryTotals.guvenlik.count > 0 ? categoryTotals.guvenlik.sum / categoryTotals.guvenlik.count : 0,
      ulasim: categoryTotals.ulasim.count > 0 ? categoryTotals.ulasim.sum / categoryTotals.ulasim.count : 0,
      temizlik: categoryTotals.temizlik.count > 0 ? categoryTotals.temizlik.sum / categoryTotals.temizlik.count : 0,
      sessizlik: categoryTotals.sessizlik.count > 0 ? categoryTotals.sessizlik.sum / categoryTotals.sessizlik.count : 0,
      komsu: categoryTotals.komsu.count > 0 ? categoryTotals.komsu.sum / categoryTotals.komsu.count : 0,
      yesil: categoryTotals.yesil.count > 0 ? categoryTotals.yesil.sum / categoryTotals.yesil.count : 0
    };

    return {
      average: count > 0 ? totalRating / count : 0,
      count,
      distribution,
      categoryAverages
    };
  } catch (error) {
    console.error('Error getting rating:', error);
    throw error;
  }
};

export const addRating = async (rating: number, locationData: LocationData) => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    const ratingRef = getDocRef(
      `ratings/${locationData.il}-${locationData.ilce}-${locationData.mahalle}`
    );
    const ratingDoc = await getDoc(ratingRef);

    if (!ratingDoc.exists()) {
      await setDoc(ratingRef, {
        totalRating: rating,
        count: 1,
        ...locationData,
      });
    } else {
      await updateDoc(ratingRef, {
        totalRating: firestoreIncrement(rating),
        count: firestoreIncrement(1),
      });
    }
  } catch (error) {
    console.error('Error adding rating:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    await deleteDoc(getDocRef(`comments/${commentId}`));
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const voteComment = async (
  commentId: string,
  userId: string,
  vote: 1 | 0 | -1
) => {
  if (!db) throw new Error('Firestore is not initialized');

  const commentRef = doc(db as Firestore, 'comments', commentId);
  const userVoteRef = doc(db as Firestore, 'commentVotes', `${commentId}_${userId}`);

  try {
    // Get current vote if exists
    const userVoteDoc = await getDoc(userVoteRef);
    const currentVote = userVoteDoc.exists() ? userVoteDoc.data().vote : 0;

    // Update vote counts
    const commentDoc = await getDoc(commentRef);
    if (!commentDoc.exists()) throw new Error('Comment not found');

    const votes = commentDoc.data().votes || { upvotes: 0, downvotes: 0 };
    
    // Remove old vote
    if (currentVote === 1) votes.upvotes--;
    if (currentVote === -1) votes.downvotes--;
    
    // Add new vote
    if (vote === 1) votes.upvotes++;
    if (vote === -1) votes.downvotes++;
    
    const totalScore = votes.upvotes - votes.downvotes;

    // Update comment
    await updateDoc(commentRef, {
      votes,
      totalScore,
    });

    // Update or delete user vote
    if (vote === 0) {
      await deleteDoc(userVoteRef);
    } else {
      await setDoc(userVoteRef, {
        vote,
        userId,
        commentId,
        timestamp: serverTimestamp(),
      });
    }

    return { votes, totalScore };
  } catch (error) {
    console.error('Error voting comment:', error);
    throw error;
  }
};

export const getUserVotes = async (userId: string, commentIds: string[]) => {
  if (!db) throw new Error('Firestore is not initialized');

  const votes: { [key: string]: 1 | 0 | -1 } = {};
  
  await Promise.all(
    commentIds.map(async (commentId) => {
      const voteRef = doc(db as Firestore, 'commentVotes', `${commentId}_${userId}`);
      const voteDoc = await getDoc(voteRef);
      votes[commentId] = voteDoc.exists() ? voteDoc.data().vote : 0;
    })
  );
  
  return votes;
};

export const updateMahalleAnalytics = async (
  il: string,
  ilce: string,
  mahalle: string,
  data: {
    isView?: boolean;
    isComment?: boolean;
    isFavorite?: boolean;
    rating?: number;
    isPositiveComment?: boolean;
    isNegativeComment?: boolean;
    sessionId?: string;
    deviceType?: string;
    duration?: number;
  }
) => {
  if (!db) throw new Error('Firestore is not initialized');

  const analyticsRef = doc(db, 'analytics', `${il}-${ilce}-${mahalle}`);
  const now = new Date();

  try {
    const docSnap = await getDoc(analyticsRef);
    const currentData = docSnap.exists() ? docSnap.data() : {
      il,
      ilce,
      mahalle,
      views: 0,
      uniqueVisitors: 0,
      favoriteCount: 0,
      commentCount: 0,
      averageRating: 0,
      ratingHistory: [],
      positiveCommentCount: 0,
      negativeCommentCount: 0,
      lastUpdated: now
    };

    const updates: any = {
      lastUpdated: now
    };

    if (data.isView) {
      updates.views = firestoreIncrement(1);
    }

    if (data.isComment) {
      updates.commentCount = firestoreIncrement(1);
    }

    if (data.isFavorite !== undefined) {
      updates.favoriteCount = firestoreIncrement(data.isFavorite ? 1 : -1);
    }

    if (data.rating) {
      const newRatingHistory = [
        ...(currentData.ratingHistory || []),
        { timestamp: now, rating: data.rating, count: 1 }
      ];
      updates.ratingHistory = newRatingHistory;
      updates.averageRating = calculateNewAverage(
        currentData.averageRating || 0,
        currentData.commentCount || 0,
        data.rating
      );
    }

    if (data.isPositiveComment) {
      updates.positiveCommentCount = firestoreIncrement(1);
    }

    if (data.isNegativeComment) {
      updates.negativeCommentCount = firestoreIncrement(1);
    }

    // Log visit if session data is provided
    if (data.sessionId && data.deviceType) {
      const visitLogRef = collection(db, 'visitLogs');
      await addDoc(visitLogRef, {
        il,
        ilce,
        mahalle,
        timestamp: now,
        sessionId: data.sessionId,
        deviceType: data.deviceType,
        duration: data.duration || 0
      });
    }

    await setDoc(analyticsRef, updates, { merge: true });
  } catch (error) {
    console.error('Error updating analytics:', error);
    throw error;
  }
};

export const getTrendingMahalleler = async (limitCount: number = 10): Promise<TrendingMahalle[]> => {
  if (!db) throw new Error('Firestore is not initialized');

  try {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(now.getMonth() - 2);

    // Önce tüm mahalleleri al
    const analyticsRef = collection(db, 'analytics');
    const analyticsSnapshot = await getDocs(analyticsRef);
    const commentsRef = collection(db, 'comments');

    const trendingData = await Promise.all(
      analyticsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const { il, ilce, mahalle } = data;

        try {
          // Son 1 aydaki yorumları al
          const lastMonthCommentsQuery = query(
            commentsRef,
            where('il', '==', il),
            where('ilce', '==', ilce),
            where('mahalle', '==', mahalle),
            where('createdAt', '>=', oneMonthAgo),
            where('createdAt', '<=', now)
          );
          const lastMonthComments = await getDocs(lastMonthCommentsQuery);

          // Önceki aydaki yorumları al
          const previousMonthCommentsQuery = query(
            commentsRef,
            where('il', '==', il),
            where('ilce', '==', ilce),
            where('mahalle', '==', mahalle),
            where('createdAt', '>=', twoMonthsAgo),
            where('createdAt', '<=', oneMonthAgo)
          );
          const previousMonthComments = await getDocs(previousMonthCommentsQuery);

          // Yorum artış oranını hesapla
          const lastMonthCommentCount = lastMonthComments.size;
          const previousMonthCommentCount = previousMonthComments.size;

          // Yorum artış oranı (0'a bölmeyi önle)
          const commentGrowthRate = previousMonthCommentCount === 0 
            ? lastMonthCommentCount > 0 ? 2 : 1  // Eğer önceki ay 0 ise ve bu ay yorum varsa 2, yoksa 1
            : lastMonthCommentCount / previousMonthCommentCount;

          // Son 1 aydaki ortalama puanı hesapla
          let lastMonthTotalRating = 0;
          lastMonthComments.forEach(doc => {
            const comment = doc.data();
            lastMonthTotalRating += comment.rating || 0;
          });
          const lastMonthAverageRating = lastMonthCommentCount > 0 
            ? lastMonthTotalRating / lastMonthCommentCount 
            : 0;

          // Önceki aydaki ortalama puanı hesapla
          let previousMonthTotalRating = 0;
          previousMonthComments.forEach(doc => {
            const comment = doc.data();
            previousMonthTotalRating += comment.rating || 0;
          });
          const previousMonthAverageRating = previousMonthCommentCount > 0 
            ? previousMonthTotalRating / previousMonthCommentCount 
            : 0;

          // Puan artış oranını hesapla
          const ratingGrowthRate = previousMonthAverageRating === 0 
            ? lastMonthAverageRating > 0 ? 2 : 1  // Eğer önceki ay 0 ise ve bu ay puan varsa 2, yoksa 1
            : lastMonthAverageRating / previousMonthAverageRating;

          // Trend skorunu hesapla
          const score = calculateTrendScore(
            commentGrowthRate,
            ratingGrowthRate,
            lastMonthCommentCount,
            data.views || 0,
            data.favoriteCount || 0
          );

          // Trend durumunu belirle
          let trend: 'up' | 'down' | 'stable';
          if (score >= 1.5) {
            trend = 'up';
          } else if (score >= 0.8) {
            trend = 'stable';
          } else {
            trend = 'down';
          }

          return {
            il,
            ilce,
            mahalle,
            score: Number(score.toFixed(2)),
            previousScore: data.previousScore || 0,
            trend,
            lastUpdated: data.lastUpdated?.toDate() || now
          } as TrendingMahalle;
        } catch (error) {
          console.error(`Error calculating trends for ${il}/${ilce}/${mahalle}:`, error);
          return null;
        }
      })
    );

    // Null değerleri filtrele ve en yüksek skora göre sırala
    return trendingData
      .filter((item): item is TrendingMahalle => item !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, limitCount);

  } catch (error) {
    console.error('Error getting trending mahalleler:', error);
    return [];
  }
};

// Trend skoru hesaplama fonksiyonunu güncelle
const calculateTrendScore = (
  commentGrowthRate: number,
  ratingGrowthRate: number,
  currentCommentCount: number,
  viewCount: number,
  favoriteCount: number
): number => {
  // Temel ağırlıklar
  const weights = {
    commentGrowth: 0.4,    // Yorum artışı
    ratingGrowth: 0.2,     // Puan artışı
    activity: 0.2,         // Mevcut yorum sayısı
    views: 0.1,            // Görüntülenme sayısı
    favorites: 0.1         // Favori sayısı
  };

  // Aktivite skoru (logaritmik ölçek)
  const activityScore = currentCommentCount > 0 
    ? 1 + Math.log10(currentCommentCount) 
    : 1;

  // Görüntülenme skoru (logaritmik ölçek)
  const viewScore = viewCount > 0 
    ? 1 + Math.log10(viewCount) 
    : 1;

  // Favori skoru (logaritmik ölçek)
  const favoriteScore = favoriteCount > 0 
    ? 1 + Math.log10(favoriteCount) 
    : 1;

  // Toplam skor hesaplama
  return (
    (commentGrowthRate * weights.commentGrowth) +
    (ratingGrowthRate * weights.ratingGrowth) +
    (activityScore * weights.activity) +
    (viewScore * weights.views) +
    (favoriteScore * weights.favorites)
  );
};

// Helper function to calculate new average
const calculateNewAverage = (currentAverage: number, currentCount: number, newValue: number): number => {
  const newCount = currentCount + 1;
  return ((currentAverage * currentCount) + newValue) / newCount;
};

export const getDashboardStats = async (timeRange: 'day' | 'week' | 'month' | 'year') => {
  if (!db) throw new Error('Firestore is not initialized');

  try {
    const now = new Date();
    let startDate = new Date();

    // Calculate start date based on time range
    switch (timeRange) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get comments for rating calculation within time range
    const commentsRef = collection(db, 'comments');
    const commentsQuery = query(
      commentsRef,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', now)
    );
    const commentsSnapshot = await getDocs(commentsQuery);

    // Get all comments for total count
    const allCommentsQuery = query(commentsRef);
    const allCommentsSnapshot = await getDocs(allCommentsQuery);

    // Get active users within time range
    const usersRef = collection(db, 'users');
    const usersQuery = query(
      usersRef,
      where('lastLoginAt', '>=', startDate)
    );
    const usersSnapshot = await getDocs(usersQuery);

    // Get visit logs for total views
    const visitLogsRef = collection(db, 'visitLogs');
    const visitLogsSnapshot = await getDocs(visitLogsRef);
    const totalViews = visitLogsSnapshot.size;

    // Get all users to count total favorites
    const allUsersRef = collection(db, 'users');
    const allUsersSnapshot = await getDocs(allUsersRef);
    let totalFavorites = 0;
    
    allUsersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.favoriteMahalleler) {
        totalFavorites += userData.favoriteMahalleler.length;
      }
    });

    // Calculate average rating from comments within time range
    let totalRating = 0;
    let ratingCount = 0;
    commentsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.rating) {
        totalRating += data.rating;
        ratingCount++;
      }
    });

    return {
      totalViews,
      activeUsers: usersSnapshot.size,
      averageRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '0.0',
      totalComments: allCommentsSnapshot.size,
      favoriteCount: totalFavorites,
      trendingCount: 0 // Bu değer ayrıca hesaplanacak
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}; 