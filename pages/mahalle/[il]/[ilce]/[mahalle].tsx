import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useToast,
  HStack,
  Icon,
  Button,
  Textarea,
  useColorModeValue,
  Flex,
  Badge,
  Skeleton,
  Stack,
  Input,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Avatar,
  FormControl,
  FormLabel,
  Switch,
  Progress,
  SimpleGrid,
  Select,
  Image,
} from '@chakra-ui/react';
import { FaStar, FaMapMarkerAlt, FaRegComment, FaReply, FaHeart, FaChevronDown, FaClock, FaFilter, FaChevronUp, FaShieldAlt, FaBus, FaVolumeMute, FaBroom, FaUsers, FaStore, FaImage, FaMapMarkedAlt, FaTree } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import {
  getCommentsByLocation,
  addComment,
  addReply,
  getRating,
  addRating,
  voteComment,
  getUserVotes,
} from '../../../../lib/firebase/comments';
import { useAuth } from '../../../../lib/hooks/useAuth';
import type { Comment, RatingData, UserData } from '../../../../types';
import { addFavoriteMahalle, removeFavoriteMahalle } from '../../../../lib/firebase/user';
import { getUser } from '../../../../lib/firebase/users';
import Head from 'next/head';
import type { User } from 'firebase/auth';
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { CloseIcon } from '@chakra-ui/icons';
import path from 'path';
import fs from 'fs';
import { IconType } from 'react-icons';
import { slugify } from '../../../../lib/utils';

const MotionBox = motion(Box);

// Types
interface Location {
  il: string;
  ilce: string;
  mahalle: string;
}

interface LocationData {
  il: string;
  ilce: string;
  mahalle: string;
}

interface ExtendedUserData extends Omit<UserData, 'favoriteMahalleler'> {
  favoriteMahalleler: LocationData[];
  showProfilePhoto?: boolean;
}

interface MahalleDetailProps {
  initialData: {
    il: string;
    ilce: string;
    mahalle: string;
  };
}

interface MahalleDetailQuery extends ParsedUrlQuery {
  il: string;
  ilce: string;
  mahalle: string;
}

interface CategoryRating {
  [key: string]: number;
  guvenlik: number;
  ulasim: number;
  temizlik: number;
  sessizlik: number;
  komsu: number;
  yesil: number;
}

const categoryIcons: { [K in keyof CategoryRating]: IconType } = {
  guvenlik: FaShieldAlt,
  ulasim: FaBus,
  temizlik: FaBroom,
  sessizlik: FaVolumeMute,
  komsu: FaUsers,
  yesil: FaTree,
};

const categoryNames: { [K in keyof CategoryRating]: string } = {
  guvenlik: 'Güvenlik',
  ulasim: 'Ulaşım',
  temizlik: 'Temizlik',
  sessizlik: 'Sessizlik',
  komsu: 'Komşuluk',
  yesil: 'Yeşil Alan',
};

interface CustomUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  showProfilePhoto?: boolean;
}

interface DataItem {
  il: string;
  ilce: string;
  mahalle: string[];
}

// URL encoding helper function
const encodePathSegment = (segment: string) => {
  return encodeURIComponent(segment).replace(/%20/g, '+');
};

// Metni baş harfleri büyük olacak şekilde formatlama
const toTitleCase = (text: string) => {
  const exceptions = ['ve', 'ile', 'veya', 'da', 'de', 'den', 'dan'];
  
  return text
    .split(/[-\s]/)
    .map((word, index) => {
      // Küçük harfle yazılması gereken bağlaçları kontrol et
      if (index !== 0 && exceptions.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      // İki harfli ilçe kısaltmalarını tamamen büyük harf yap (örn: OF)
      if (word.length === 2) {
        return word.toLocaleUpperCase('tr-TR');
      }
      // Diğer tüm kelimelerin baş harfini büyük yap
      return word.charAt(0).toLocaleUpperCase('tr-TR') + 
             word.slice(1).toLocaleLowerCase('tr-TR');
    })
    .join(' ');
};

const MahalleDetail: NextPage<MahalleDetailProps> = ({ initialData }) => {
  // Router ve query hooks
  const router = useRouter();
  const { il = initialData.il, ilce = initialData.ilce, mahalle = initialData.mahalle } = router.query as MahalleDetailQuery;
  
  // URL'leri düzgün formatlayarak kullan
  const locationString = initialData.il;  // Orijinal il adı
  const ilceString = initialData.ilce;    // Orijinal ilçe adı
  const mahalleString = initialData.mahalle;  // Orijinal mahalle adı

  // URL'i düzelt
  useEffect(() => {
    if (router.isReady && (il || ilce || mahalle)) {
      // URL için slugify kullan
      const correctPath = `/mahalle/${slugify(locationString)}/${slugify(ilceString)}/${slugify(mahalleString)}`;
      if (router.asPath !== correctPath) {
        router.replace(correctPath, undefined, { shallow: true });
      }
    }
  }, [router.isReady, il, ilce, mahalle]);

  // Context hooks
  const toast = useToast();
  const queryClient = useQueryClient();
  const { user, signIn } = useAuth();

  // Color mode hooks - tüm renk değerlerini buraya taşıyoruz
  const bgColor = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const commentBg = useColorModeValue('gray.50', 'gray.800');
  const replyBg = useColorModeValue('gray.100', 'gray.700');

  // Ref hooks
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const displayNameInputRef = useRef<HTMLInputElement>(null);

  // State hooks
  const [comment, setComment] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rating, setRating] = useState(0);
  const [showProfilePhoto, setShowProfilePhoto] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyDisplayName, setReplyDisplayName] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'votes'>('votes');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [userVotes, setUserVotes] = useState<{ [key: string]: 1 | 0 | -1 }>({});
  const [categoryRatings, setCategoryRatings] = useState<CategoryRating>({
    guvenlik: 0,
    ulasim: 0,
    temizlik: 0,
    sessizlik: 0,
    komsu: 0,
    yesil: 0,
  });
  const [yearsLived, setYearsLived] = useState<'0-1' | '1-3' | '3-5' | '5-10' | '10+' | ''>('');

  // Query hooks
  const { data: comments = [], isLoading: isLoadingComments } = useQuery<Comment[]>(
    ['comments', locationString, ilceString, mahalleString],
    () => getCommentsByLocation(locationString, ilceString, mahalleString),
    {
      enabled: Boolean(locationString && ilceString && mahalleString),
    }
  );

  const { data: ratingData } = useQuery<RatingData>(
    ['rating', locationString, ilceString, mahalleString],
    () => getRating(locationString, ilceString, mahalleString),
    {
      enabled: Boolean(locationString && ilceString && mahalleString),
    }
  );

  const { data: userData } = useQuery<ExtendedUserData>(
    ['userProfile', user?.uid || ''],
    async () => {
      const data = await getUser(user?.uid || '');
      if (!data) throw new Error('User not found');
      
      return {
        uid: user?.uid || '',
        updatedAt: new Date(),
        favoriteMahalleler: data.favoriteMahalleler || [],
        showProfilePhoto: data.showProfilePhoto,
        ...data,
      } as unknown as ExtendedUserData;
    },
    {
      enabled: !!user?.uid,
    }
  );

  // Effects - tüm useEffect hook'larını bir arada tutuyorum
  useEffect(() => {
    if (user?.uid && comments.length > 0) {
      getUserVotes(user.uid, comments.map(c => c.id))
        .then(votes => setUserVotes(votes))
        .catch(console.error);
    }
  }, [user?.uid, comments]);

  useEffect(() => {
    if (userData?.favoriteMahalleler && locationString && ilceString && mahalleString) {
      const currentLocation: LocationData = {
        il: locationString,
        ilce: ilceString,
        mahalle: mahalleString
      };
      setIsFavorite(userData.favoriteMahalleler.some(loc => 
        loc.il === currentLocation.il && 
        loc.ilce === currentLocation.ilce && 
        loc.mahalle === currentLocation.mahalle
      ));
    }
  }, [userData?.favoriteMahalleler, locationString, ilceString, mahalleString]);

  // Callbacks - tüm useCallback hook'larını bir arada tutuyorum
  const handleFavoriteClick = useCallback(async () => {
    if (!user?.uid) {
      toast({
        title: 'Giriş yapmalısınız',
        description: 'Favorilere eklemek için lütfen giriş yapın',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setFavoriteLoading(true);
    try {
      const location: Location = { 
        il: locationString, 
        ilce: ilceString, 
        mahalle: mahalleString 
      };
      
      if (isFavorite) {
        await removeFavoriteMahalle(user.uid, location);
        toast({
          title: 'Favorilerden çıkarıldı',
          description: `${mahalleString} mahallesi favorilerinizden çıkarıldı`,
          status: 'success',
          duration: 3000,
        });
      } else {
        await addFavoriteMahalle(user.uid, location);
        toast({
          title: 'Favorilere eklendi',
          description: `${mahalleString} mahallesi favorilerinize eklendi`,
          status: 'success',
          duration: 3000,
        });
      }
      setIsFavorite(!isFavorite);
      queryClient.invalidateQueries(['userProfile', user.uid]);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'İşlem sırasında bir hata oluştu',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setFavoriteLoading(false);
    }
  }, [user?.uid, isFavorite, locationString, ilceString, mahalleString, queryClient, toast]);

  // Zaman hesaplama yardımcı fonksiyonu
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + ' yıl önce';
    }
    
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' ay önce';
    }
    
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' gün önce';
    }
    
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' saat önce';
    }
    
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' dakika önce';
    }
    
    return 'az önce';
  };

  // Mutations - tüm mutation hook'larını bir arada tutuyorum
  const addCommentMutation = useMutation(
    (newComment: { 
      text: string; 
      rating: number; 
      displayName: string; 
      photoURL?: string;
      categoryRatings: CategoryRating;
      yearsLived: '0-1' | '1-3' | '3-5' | '5-10' | '10+';
      location: LocationData;
    }) => {
      return addComment(
        newComment.text,
        user?.uid || 'anonymous',
        newComment.location,
        newComment.rating,
        newComment.displayName,
        newComment.photoURL,
        newComment.categoryRatings,
        newComment.yearsLived
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', locationString, ilceString, mahalleString]);
        setComment('');
        setRating(0);
        setCategoryRatings({
          guvenlik: 0,
          ulasim: 0,
          temizlik: 0,
          sessizlik: 0,
          komsu: 0,
          yesil: 0,
        });
        setDisplayName('');
        setYearsLived('');
        setShowProfilePhoto(true);
        toast({
          title: 'Yorum eklendi',
          status: 'success',
          duration: 3000,
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Hata',
          description: error.message || 'Yorum eklenirken bir hata oluştu',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );

  const addRatingMutation = useMutation(
    (rating: number) =>
      addRating(rating, {
        il: locationString,
        ilce: ilceString,
        mahalle: mahalleString,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['rating', locationString, ilceString, mahalleString]);
        toast({
          title: 'Değerlendirme eklendi',
          status: 'success',
          duration: 3000,
        });
      },
    }
  );

  const addReplyMutation = useMutation(
    (replyData: { text: string; parentId: string; displayName: string; photoURL?: string }) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return addReply(
        replyData.parentId,
        replyData.text,
        replyData.displayName,
        replyData.photoURL
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', locationString, ilceString, mahalleString]);
        setReplyText('');
        setReplyingTo(null);
        setReplyDisplayName('');
        toast({
          title: 'Yanıt eklendi',
          status: 'success',
          duration: 3000,
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Hata',
          description: error.message || 'Yanıt eklenirken bir hata oluştu',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );

  // Memoized values
  const sortedAndFilteredComments = useMemo(() => {
    let filteredComments = [...comments];
    
    if (filterRating !== null) {
      filteredComments = filteredComments.filter(comment => comment.rating === filterRating);
    }
    
    return filteredComments.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
      } else if (sortBy === 'rating') {
        if (b.rating !== a.rating) {
          comparison = a.rating - b.rating;
        } else {
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
        }
      } else if (sortBy === 'votes') {
        const aScore = (a.votes?.upvotes || 0) - (a.votes?.downvotes || 0);
        const bScore = (b.votes?.upvotes || 0) - (b.votes?.downvotes || 0);
        if (bScore !== aScore) {
          comparison = aScore - bScore;
        } else {
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
        }
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [comments, sortBy, sortDirection, filterRating]);

  // Add this before sortedAndFilteredComments
  const handleVote = async (commentId: string, vote: 1 | 0 | -1) => {
    if (!user) return;

    try {
      await voteComment(commentId, user.uid, vote);
      queryClient.invalidateQueries(['comments', locationString, ilceString, mahalleString]);
      
      // Optimistically update UI
      setUserVotes(prev => ({
        ...prev,
        [commentId]: vote
      }));
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Oylama işlemi başarısız oldu',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !Object.values(categoryRatings).some(rating => rating > 0) || yearsLived === '') {
      toast({
        title: 'Hata',
        description: 'Lütfen bir yorum yazın, en az bir kategori için değerlendirme yapın ve kaç yıl yaşadığınızı belirtin',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const photoURL = user?.photoURL ? user.photoURL : undefined;
      addCommentMutation.mutate({
        text: comment,
        rating: Object.values(categoryRatings).reduce((a, b) => a + b, 0) / 6,
        displayName: displayName.trim() || `Anonim${Math.floor(Math.random() * 10000)}`,
        photoURL,
        categoryRatings,
        yearsLived: yearsLived as '0-1' | '1-3' | '3-5' | '5-10' | '10+',
        location: {
          il: locationString,
          ilce: ilceString,
          mahalle: mahalleString
        }
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Yorum eklenirken bir hata oluştu',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleReplySubmit = (commentId: string) => {
    if (replyText.trim()) {
      const trimmedDisplayName = replyDisplayName.trim();
      const finalDisplayName = trimmedDisplayName || `Anonim${Math.floor(Math.random() * 10000)}`;
      const photoURL = userData?.showProfilePhoto ? (user?.photoURL as string | undefined) : undefined;
      
      addReplyMutation.mutate({ 
        text: replyText.trim(),
        parentId: commentId,
        displayName: finalDisplayName,
        photoURL
      });
    }
  };

  // Rating distribution progress bars
  const RatingDistribution = ({ distribution }: { distribution: Required<RatingData>['distribution'] }) => {
    if (!distribution) {
      return null;
    }
    
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    
    return (
      <VStack spacing={2} width="100%" align="stretch">
        {[5, 4, 3, 2, 1].map((rating) => (
          <HStack key={rating} spacing={2}>
            <Text fontSize="sm" width="30px">{rating}★</Text>
            <Progress
              value={(distribution[rating.toString() as keyof typeof distribution] / total) * 100}
              size="sm"
              colorScheme="orange"
              borderRadius="full"
              width="full"
            />
            <Text fontSize="sm" width="40px">
              {distribution[rating.toString() as keyof typeof distribution] || 0}
            </Text>
          </HStack>
        ))}
      </VStack>
    );
  };

  // Category rating component
  const CategoryRating = ({ category, value, onChange }: { 
    category: keyof CategoryRating; 
    value: number; 
    onChange: (value: number) => void;
  }) => {
    const IconComponent = categoryIcons[category];
    
    return (
      <VStack spacing={1} align="start" width="full">
        <HStack spacing={2}>
          <IconComponent />
          <Text fontSize="sm" fontWeight="medium">{categoryNames[category]}</Text>
        </HStack>
        <HStack spacing={1}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              as={FaStar}
              boxSize={5}
              cursor="pointer"
              color={star <= value ? 'yellow.400' : mutedColor}
              onClick={() => onChange(star)}
              _hover={{ transform: 'scale(1.2)', color: 'yellow.400' }}
              transition="all 0.2s"
            />
          ))}
        </HStack>
      </VStack>
    );
  };

  const pageTitle = `${mahalleString} Mahallesi | ${locationString}/${ilceString} | Mahalleci`;
  const pageDescription = `${mahalleString} mahallesi hakkında yorumlar ve değerlendirmeler. ${locationString} ili, ${ilceString} ilçesi mahalle bilgileri.`;

  if (!locationString || !ilceString || !mahalleString) {
    return (
      <>
        <Head>
          <title>Sayfa Bulunamadı | Mahalleci</title>
          <meta name="description" content="Geçersiz mahalle bilgisi" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/favicon.png" />
        </Head>
        <Flex minH="100vh" align="center" justify="center">
          <VStack spacing={4}>
            <Heading>Sayfa Bulunamadı</Heading>
            <Text>Geçersiz mahalle bilgisi</Text>
            <Button onClick={() => router.push('/')}>Ana Sayfaya Dön</Button>
          </VStack>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>
      <Flex minH="100vh" direction="column" bg={bgColor}>
        <Header />
        
        {/* Hero Section */}
        <Box 
          w="full"
          bgGradient="linear(to-r, #dd6b21, #e43f3d)"
          color="white"
          py={8}
          mb={8}
          position="relative"
          _after={{
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            bgGradient: useColorModeValue(
              'linear(to-t, gray.50, transparent)',
              'linear(to-t, gray.900, transparent)'
            ),
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          <Container maxW="container.md" position="relative" zIndex={1}>
            <VStack spacing={4}>
              <Heading 
                size="xl" 
                textAlign="center"
                textShadow="0 2px 4px rgba(0,0,0,0.3)"
              >
                {toTitleCase(mahalleString)} Mahallesi
              </Heading>
              <Text 
                fontSize="lg" 
                opacity={0.9}
                textShadow="0 1px 2px rgba(0,0,0,0.2)"
              >
                {toTitleCase(locationString)} / {toTitleCase(ilceString)}
              </Text>
              
              <VStack spacing={4}>
                <HStack spacing={4} align="center">
                  {ratingData && (
                    <Box
                      bg="white"
                      py={4}
                      px={8}
                      borderRadius="xl"
                      boxShadow="xl"
                      width="100%"
                      maxW="600px"
                      mx="auto"
                      position="relative"
                      zIndex={2}
                    >
                      <VStack spacing={6}>
                        <VStack>
                          <Text 
                            fontSize="6xl" 
                            fontWeight="extrabold"
                            color="orange.600"
                            lineHeight="1"
                          >
                            {ratingData.average.toFixed(1)}
                          </Text>
                          <HStack spacing={1}>
                            {[...Array(5)].map((_, i) => (
                              <Icon
                                key={i}
                                as={FaStar}
                                color={i < Math.round(ratingData.average) ? 'orange.400' : 'gray.300'}
                                boxSize={6}
                              />
                            ))}
                          </HStack>
                          <Text fontSize="sm" color="gray.600" fontWeight="medium">
                            {ratingData.count} değerlendirme
                          </Text>
                          {user && (
                            <Button
                              leftIcon={<Icon as={FaHeart} />}
                              size="md"
                              colorScheme="red"
                              variant={isFavorite ? "solid" : "outline"}
                              onClick={handleFavoriteClick}
                              isLoading={favoriteLoading}
                              mt={4}
                              _hover={{
                                transform: 'scale(1.05)',
                              }}
                              transition="all 0.2s"
                            >
                              {isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                            </Button>
                          )}
                        </VStack>

                        <SimpleGrid columns={{ base: 2, md: 2, lg: 3 }} spacing={4} width="100%">
                          {ratingData?.categoryAverages && Object.entries(ratingData.categoryAverages).map(([category, value]) => {
                            const ratingColor = value >= 4.5 ? 'green.500' : 
                                             value >= 3.5 ? 'teal.500' : 
                                             value >= 2.5 ? 'yellow.500' : 
                                             value >= 1.5 ? 'orange.500' : 
                                             value > 0 ? 'red.500' : mutedColor;
                            return (
                              <HStack key={category} spacing={3}>
                                <Icon as={categoryIcons[category as keyof CategoryRating]} color={ratingColor} />
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm" fontWeight="medium" color="black">{categoryNames[category as keyof CategoryRating]}</Text>
                                  <HStack spacing={1}>
                                    <Text fontSize="lg" fontWeight="bold" color="black">
                                      {value.toFixed(1)}
                                    </Text>
                                    <Icon as={FaStar} color={ratingColor} boxSize={3} />
                                  </HStack>
                                </VStack>
                              </HStack>
                            );
                          })}
                        </SimpleGrid>
                      </VStack>
                    </Box>
                  )}
                </HStack>
              </VStack>
            </VStack>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxW="container.md" flex="1">
          <VStack spacing={8} align="stretch">
            {/* Değerlendirme Formu */}
            {user ? (
              <Box 
                bg={cardBg} 
                p={6} 
                borderRadius="xl" 
                shadow="lg"
                border="2px solid"
                borderColor={borderColor}
              >
                <form onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="İsminiz (opsiyonel)"
                        size="lg"
                      />
                      <Select
                        value={yearsLived}
                        onChange={(e) => setYearsLived(e.target.value as '0-1' | '1-3' | '3-5' | '5-10' | '10+')}
                        placeholder="Kaç yıl yaşadınız?"
                        size="lg"
                      >
                        <option value="0-1">0-1 yıl</option>
                        <option value="1-3">1-3 yıl</option>
                        <option value="3-5">3-5 yıl</option>
                        <option value="5-10">5-10 yıl</option>
                        <option value="10+">10+ yıl</option>
                      </Select>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} width="100%">
                      {Object.keys(categoryRatings).map((category) => (
                        <CategoryRating
                          key={category}
                          category={category as keyof CategoryRating}
                          value={categoryRatings[category as keyof CategoryRating]}
                          onChange={(value) => setCategoryRatings(prev => ({
                            ...prev,
                            [category]: value
                          }))}
                        />
                      ))}
                    </SimpleGrid>

                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Bu mahalle hakkında deneyimlerinizi paylaşın... (yaşam kalitesi, apartmanlar/siteler, komşuluk, ulaşım, market/eczane yakınlığı, gürültü, güvenlik vb.)"
                      size="lg"
                      fontSize="md"
                      rows={6}
                    />

                    <Button
                      type="submit"
                      colorScheme="orange"
                      size="lg"
                      isLoading={addCommentMutation.isLoading}
                      alignSelf="flex-end"
                    >
                      Değerlendir
                    </Button>
                  </VStack>
                </form>
              </Box>
            ) : (
              <Box 
                bg={cardBg} 
                p={6} 
                borderRadius="xl" 
                shadow="sm"
                border="1px solid"
                borderColor={borderColor}
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Text color={textColor}>Yorum yapmak için giriş yapmalısınız.</Text>
                  <Button
                    colorScheme="orange"
                    onClick={() => signIn()}
                  >
                    Giriş Yap
                  </Button>
                </VStack>
              </Box>
            )}

            {/* Değerlendirmeler */}
            <Box>
              <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  Değerlendirmeler
                </Text>
                {user && comments?.length > 0 && (
                  <HStack spacing={4}>
                    <Badge 
                      colorScheme="orange" 
                      fontSize="md" 
                      px={3} 
                      py={1} 
                      borderRadius="full"
                    >
                      {comments.length}
                    </Badge>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<Icon as={FaChevronDown} />} size="sm" variant="ghost">
                        {sortBy === 'date' ? 'Tarihe Göre' : sortBy === 'rating' ? 'Puana Göre' : 'Beğeniye Göre'} ({sortDirection === 'desc' ? 'Azalan' : 'Artan'})
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => setSortBy('votes')}>
                          <HStack>
                            <Icon as={FaChevronUp} />
                            <Text>Beğeniye Göre</Text>
                          </HStack>
                        </MenuItem>
                        <MenuItem onClick={() => setSortBy('date')}>
                          <HStack>
                            <Icon as={FaClock} />
                            <Text>Tarihe Göre</Text>
                          </HStack>
                        </MenuItem>
                        <MenuItem onClick={() => setSortBy('rating')}>
                          <HStack>
                            <Icon as={FaStar} />
                            <Text>Puana Göre</Text>
                          </HStack>
                        </MenuItem>
                        <Divider my={2} />
                        <MenuItem onClick={() => setSortDirection('desc')}>
                          <HStack>
                            <Text>Azalan</Text>
                          </HStack>
                        </MenuItem>
                        <MenuItem onClick={() => setSortDirection('asc')}>
                          <HStack>
                            <Text>Artan</Text>
                          </HStack>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                )}
              </Flex>

              {!user ? (
                <Box
                  p={6}
                  bg={cardBg}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={borderColor}
                  textAlign="center"
                >
                  <VStack spacing={4}>
                    <Text color={textColor}>Değerlendirmeleri görmek için giriş yapmalısınız.</Text>
                    <Button
                      colorScheme="orange"
                      onClick={() => signIn()}
                    >
                      Giriş Yap
                    </Button>
                  </VStack>
                </Box>
              ) : (
                <Stack spacing={4} mb={8}>
                  {isLoadingComments ? (
                    [...Array(3)].map((_, i) => (
                      <Skeleton 
                        key={i} 
                        height="120px" 
                        borderRadius="xl"
                        startColor={useColorModeValue('gray.100', 'gray.800')}
                        endColor={useColorModeValue('gray.200', 'gray.700')}
                      />
                    ))
                  ) : !sortedAndFilteredComments?.length ? (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py={12}
                      bg={cardBg}
                      borderRadius="xl"
                      border="1px dashed"
                      borderColor={borderColor}
                    >
                      <Icon as={FaRegComment} boxSize={8} color={mutedColor} mb={4} />
                      <Text color={mutedColor} fontSize="lg" textAlign="center">
                        {filterRating !== null 
                          ? `${filterRating} yıldızlı değerlendirme bulunmuyor` 
                          : 'Henüz değerlendirme yapılmamış'}
                      </Text>
                    </Flex>
                  ) : (
                    sortedAndFilteredComments.map((comment) => (
                      <MotionBox
                        key={comment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        bg={cardBg}
                        p={6}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                        transition="all 0.2s"
                        _hover={{ 
                          shadow: 'md',
                          borderColor: 'orange.400',
                        }}
                      >
                        <VStack align="stretch" spacing={4}>
                          <Flex justify="space-between" align="center">
                            <HStack spacing={4} align="flex-start">
                              <Avatar
                                size="sm"
                                name={comment.displayName}
                                src={comment.photoURL}
                                bg="orange.400"
                              />
                              <VStack align="start" spacing={1} flex={1}>
                                <HStack spacing={2} align="center">
                                  <Text 
                                    fontWeight="bold" 
                                    color="orange.500"
                                    fontSize="lg"
                                  >
                                    {comment.displayName}
                                  </Text>
                                  {comment.yearsLived && (
                                    <Text fontSize="sm" color={mutedColor}>
                                      {comment.yearsLived === '10+' ? '10+ yıl' : 
                                       `${comment.yearsLived} yıl`} yaşadı
                                    </Text>
                                  )}
                                  <HStack spacing={1}>
                                    {[...Array(5)].map((_, i) => (
                                      <Icon
                                        key={i}
                                        as={FaStar}
                                        color={i < comment.rating ? 'yellow.400' : mutedColor}
                                        boxSize={4}
                                      />
                                    ))}
                                  </HStack>
                                  <Text fontSize="sm" color={mutedColor}>
                                    {timeAgo(comment.createdAt)}
                                  </Text>
                                </HStack>
                              </VStack>
                            </HStack>
                          </Flex>
                          
                          <Text 
                            fontSize="md" 
                            color={textColor} 
                            lineHeight="tall"
                            pl={4}
                            borderLeft="3px solid"
                            borderColor="orange.400"
                          >
                            {comment.text}
                          </Text>

                          {/* Kategori puanları */}
                          {comment.categoryRatings && (
                            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2} pl={4}>
                              {Object.entries(categoryNames).map(([key, label]: [keyof CategoryRating, string]) => {
                                const rating = comment.categoryRatings[key as keyof CategoryRating] || 0;
                                const ratingColor = rating === 5 ? 'green.500' : 
                                                   rating === 4 ? 'teal.500' : 
                                                   rating === 3 ? 'yellow.500' : 
                                                   rating === 2 ? 'orange.500' : 
                                                   rating === 1 ? 'red.500' : mutedColor;
                                return (
                                  <HStack key={key} spacing={2} opacity={rating > 0 ? 1 : 0.5} bg={useColorModeValue('gray.50', 'gray.800')} p={2} borderRadius="md">
                                    <Icon as={categoryIcons[key as keyof CategoryRating]} boxSize={4} color={rating > 0 ? ratingColor : mutedColor} />
                                    <Text fontSize="sm" color={textColor} fontWeight="medium">
                                      {label}:
                                    </Text>
                                    <HStack spacing={1}>
                                      <Text fontSize="sm" fontWeight="bold" color={rating > 0 ? ratingColor : mutedColor}>
                                        {rating}
                                      </Text>
                                      <Icon as={FaStar} boxSize={3} color={rating > 0 ? ratingColor : mutedColor} />
                                    </HStack>
                                  </HStack>
                                );
                              })}
                            </SimpleGrid>
                          )}
                          
                          <HStack justify="flex-end" align="center" spacing={4}>
                            <HStack spacing={2}>
                              <IconButton
                                aria-label="Yukarı oy"
                                icon={<FaChevronUp />}
                                size="sm"
                                variant={userVotes[comment.id] === 1 ? "solid" : "ghost"}
                                colorScheme={userVotes[comment.id] === 1 ? "green" : "gray"}
                                onClick={() => handleVote(comment.id, userVotes[comment.id] === 1 ? 0 : 1)}
                              />
                              <Text fontWeight="bold" color={textColor}>
                                {(comment.votes?.upvotes || 0) - (comment.votes?.downvotes || 0)}
                              </Text>
                              <IconButton
                                aria-label="Aşağı oy"
                                icon={<FaChevronDown />}
                                size="sm"
                                variant={userVotes[comment.id] === -1 ? "solid" : "ghost"}
                                colorScheme={userVotes[comment.id] === -1 ? "red" : "gray"}
                                onClick={() => handleVote(comment.id, userVotes[comment.id] === -1 ? 0 : -1)}
                              />
                            </HStack>
                            <Button
                              leftIcon={<FaReply />}
                              size="sm"
                              variant="ghost"
                              colorScheme="orange"
                              onClick={() => setReplyingTo(comment.id)}
                              _hover={{
                                bg: 'orange.50',
                                color: 'orange.600'
                              }}
                            >
                              Cevapla
                            </Button>
                            {comment.replies && comment.replies.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                colorScheme="orange"
                                onClick={() => {
                                  if (expandedComments.includes(comment.id)) {
                                    setExpandedComments(expandedComments.filter(id => id !== comment.id));
                                  } else {
                                    setExpandedComments([...expandedComments, comment.id]);
                                  }
                                }}
                              >
                                {expandedComments.includes(comment.id) ? 'Yanıtları Gizle' : `${comment.replies.length} yanıtın tümü`}
                              </Button>
                            )}
                          </HStack>

                          {/* Cevap formu */}
                          {replyingTo === comment.id && (
                            <Box 
                              mt={2} 
                              p={4} 
                              bg={useColorModeValue('gray.50', 'gray.800')}
                              borderRadius="md"
                              borderLeft="3px solid"
                              borderColor="orange.400"
                            >
                              <VStack spacing={3}>
                                <Input
                                  value={replyDisplayName}
                                  onChange={(e) => setReplyDisplayName(e.target.value)}
                                  placeholder="İsminiz (opsiyonel)"
                                  size="sm"
                                  bg={inputBg}
                                  color={textColor}
                                  borderColor={borderColor}
                                  _hover={{ borderColor: 'orange.400' }}
                                  _focus={{ 
                                    borderColor: 'orange.400',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-orange-400)'
                                  }}
                                />
                                <Textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Cevabınızı yazın..."
                                  size="sm"
                                  bg={inputBg}
                                  color={textColor}
                                  borderColor={borderColor}
                                  _hover={{ borderColor: 'orange.400' }}
                                  _focus={{ 
                                    borderColor: 'orange.400',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-orange-400)'
                                  }}
                                />
                                <HStack spacing={2} alignSelf="flex-end">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText('');
                                      setReplyDisplayName('');
                                    }}
                                  >
                                    İptal
                                  </Button>
                                  <Button
                                    size="sm"
                                    colorScheme="orange"
                                    isLoading={addReplyMutation.isLoading}
                                    onClick={() => handleReplySubmit(comment.id)}
                                  >
                                    Gönder
                                  </Button>
                                </HStack>
                              </VStack>
                            </Box>
                          )}

                          {/* Cevaplar */}
                          {comment.replies && comment.replies.length > 0 && (
                            <VStack 
                              spacing={3} 
                              pl={4} 
                              mt={4} 
                              borderLeft="2px solid" 
                              borderColor="orange.400"
                              opacity={0.9}
                            >
                              {comment.replies
                                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                                .slice(0, expandedComments.includes(comment.id) ? undefined : 1)
                                .map((reply) => (
                                <Box
                                  key={reply.id}
                                  bg={useColorModeValue('gray.50', 'gray.800')}
                                  p={4}
                                  borderRadius="md"
                                  width="100%"
                                  _hover={{
                                    bg: useColorModeValue('gray.100', 'gray.700'),
                                    transform: 'translateX(4px)',
                                  }}
                                  transition="all 0.2s"
                                >
                                  <VStack align="stretch" spacing={2}>
                                    <Flex justify="space-between" align="center">
                                      <HStack spacing={2}>
                                        <Avatar
                                          size="xs"
                                          name={reply.displayName}
                                          src={reply.photoURL || "https://bit.ly/broken-link"}
                                          bg="orange.400"
                                        />
                                        <Text 
                                          fontSize="sm" 
                                          fontWeight="bold" 
                                          color="orange.500"
                                        >
                                          {reply.displayName}
                                        </Text>
                                        <Text fontSize="xs" color={mutedColor}>
                                          {timeAgo(reply.createdAt)}
                                        </Text>
                                      </HStack>
                                    </Flex>
                                    <Text 
                                      fontSize="sm" 
                                      color={textColor}
                                      pl={3}
                                      borderLeft="2px solid"
                                      borderColor="gray.400"
                                    >
                                      {reply.text}
                                    </Text>
                                  </VStack>
                                </Box>
                              ))}
                            </VStack>
                          )}
                        </VStack>
                      </MotionBox>
                    ))
                  )}
                </Stack>
              )}
            </Box>
          </VStack>
        </Container>
        
        <Footer />
      </Flex>
    </>
  );
};

export const getStaticPaths = async () => {
  const filePath = path.join(process.cwd(), 'data', 'data.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf8');
  const data: DataItem[] = JSON.parse(jsonData);

  // Tüm URL'leri slugify kullanarak oluştur
  const paths = data.flatMap(item => 
    item.mahalle.map((m: string) => ({
      params: {
        il: slugify(item.il),
        ilce: slugify(item.ilce),
        mahalle: slugify(m)
      }
    }))
  );

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext<MahalleDetailQuery>) => {
  if (!params) {
    return {
      notFound: true
    };
  }

  // Orijinal isimleri bulmak için data.json'u oku
  const filePath = path.join(process.cwd(), 'data', 'data.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf8');
  const data: DataItem[] = JSON.parse(jsonData);

  // URL'deki slugify edilmiş değerlere göre orijinal değerleri bul
  const location = data.find(item => 
    slugify(item.il) === params.il && 
    slugify(item.ilce) === params.ilce &&
    item.mahalle.some(m => slugify(m) === params.mahalle)
  );

  if (!location) {
    return {
      notFound: true
    };
  }

  const originalMahalle = location.mahalle.find(m => slugify(m) === params.mahalle);

  return {
    props: {
      initialData: {
        il: location.il,
        ilce: location.ilce,
        mahalle: originalMahalle || params.mahalle
      }
    }
  };
};

export default MahalleDetail; 