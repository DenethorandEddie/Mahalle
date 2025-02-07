export interface DataItem {
  il: string;
  ilce: string;
  mahalle: string[];
}

export interface CategoryRating {
  [key: string]: number;
  guvenlik: number;
  ulasim: number;
  temizlik: number;
  sessizlik: number;
  komsu: number;
  yesil: number;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  displayName?: string;
  photoURL?: string;
  showProfilePhoto?: boolean;
  rating: number;
  categoryRatings: CategoryRating;
  yearsLived: '0-1' | '1-3' | '3-5' | '5-10' | '10+';
  createdAt: Date;
  replies?: Reply[];
  il: string;
  ilce: string;
  mahalle: string;
  votes: {
    upvotes: number;
    downvotes: number;
    helpful: number;
  };
  totalScore: number;
  userVote?: 1 | 0 | -1;
  images?: string[];
  importantPlaces?: {
    type: 'market' | 'pharmacy' | 'school' | 'hospital' | 'park' | 'mosque' | 'other';
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  }[];
}

export interface Reply {
  id: string;
  text: string;
  userId: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  parentCommentId: string;
  parentCommentUserId: string;
}

export interface Notification {
  id: string;
  type: 'reply';
  userId: string;
  read: boolean;
  createdAt: Date;
  commentId: string;
  replyId: string;
  replyText: string;
  replyUserDisplayName: string;
  locationData: LocationData;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  about?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
  };
  favoriteMahalleler?: LocationData[];
  mahalleYearsLived?: {
    [key: string]: '0-1' | '1-3' | '3-5' | '5-10' | '10+'
  };
  totalComments?: number;
  totalReplies?: number;
  totalLikes?: number;
  showProfilePhoto?: boolean;
}

export interface LocationData {
  il: string;
  ilce: string;
  mahalle: string;
}

export interface RatingData {
  average: number;
  count: number;
  distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  categoryAverages: {
    guvenlik: number;
    ulasim: number;
    temizlik: number;
    sessizlik: number;
    komsu: number;
    yesil: number;
  };
}

export interface UserData {
  uid: string;
  email?: string;
  displayName?: string;
  favoriteMahalleler?: Array<{
    il: string;
    ilce: string;
    mahalle: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  showProfilePhoto?: boolean;
  about?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
  };
}

export interface MahalleAnalytics {
  id: string;
  il: string;
  ilce: string;
  mahalle: string;
  views: number;
  uniqueVisitors: number;
  favoriteCount: number;
  commentCount: number;
  averageRating: number;
  ratingHistory: {
    timestamp: Date;
    rating: number;
    count: number;
  }[];
  positiveCommentCount: number;
  negativeCommentCount: number;
  lastUpdated: Date;
}

export interface VisitLog {
  id: string;
  il: string;
  ilce: string;
  mahalle: string;
  timestamp: Date;
  sessionId: string;
  deviceType: string;
  duration: number;
}

export interface TrendingMahalle {
  il: string;
  ilce: string;
  mahalle: string;
  score: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
} 