import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Badge,
  HStack,
  Icon,
  Skeleton,
  Flex,
  Button,
  Divider,
  useToast,
  Input,
  Textarea,
  Switch,
  IconButton,
  FormControl,
  FormLabel,
  useDisclosure,
} from '@chakra-ui/react';
import { FaCamera, FaHeart, FaBell, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../lib/hooks/useAuth';
import { getUserComments, getUserNotifications, markNotificationAsRead } from '../lib/firebase/comments';
import { updateUserProfile, uploadProfilePhoto, getUserStats } from '../lib/firebase/user';
import Head from 'next/head';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { slugify } from '../lib/utils';

const HesabimPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [about, setAbout] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [showProfilePhoto, setShowProfilePhoto] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Queries
  const { data: userComments, isLoading: isLoadingComments } = useQuery(
    ['userComments', user?.uid],
    () => getUserComments(user?.uid || ''),
    { enabled: !!user }
  );

  const { data: notifications = [], isLoading: isLoadingNotifications } = useQuery(
    ['notifications', user?.uid],
    () => getUserNotifications(user?.uid || ''),
    { enabled: !!user }
  );

  const { data: userStats, isLoading: isLoadingStats } = useQuery(
    ['userStats', user?.uid],
    () => getUserStats(user?.uid || ''),
    { enabled: !!user }
  );

  // Mutations
  const updateProfileMutation = useMutation(
    (data: { displayName: string; about: string; showProfilePhoto: boolean }) =>
      updateUserProfile(user?.uid || '', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userProfile', user?.uid]);
        toast({
          title: 'Profil güncellendi',
          status: 'success',
          duration: 3000,
        });
        setEditMode(false);
      },
    }
  );

  const uploadPhotoMutation = useMutation(
    async (file: File) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return await uploadProfilePhoto(user.uid, file);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userProfile', user?.uid]);
        toast({
          title: 'Profil fotoğrafı güncellendi',
          status: 'success',
          duration: 3000,
        });
      },
    }
  );

  const markAsReadMutation = useMutation(
    (notificationId: string) => markNotificationAsRead(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications', user?.uid]);
      },
    }
  );

  // Handlers
  const handleProfileUpdate = () => {
    if (!displayName.trim()) {
      toast({
        title: 'Hata',
        description: 'İsim alanı boş bırakılamaz',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    updateProfileMutation.mutate({
      displayName: displayName.trim(),
      about: about.trim(),
      showProfilePhoto,
    });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Hata',
        description: 'Lütfen geçerli bir resim dosyası seçin.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Hata',
        description: 'Dosya boyutu 5MB\'dan küçük olmalıdır.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    uploadPhotoMutation.mutate(file);
  };

  const handleUpdateDisplayName = async () => {
    if (!user || !displayName.trim()) return;

    try {
      await updateProfile(user, {
        displayName: displayName.trim()
      });

      toast({
        title: 'İsim güncellendi',
        status: 'success',
        duration: 3000,
      });
      setIsEditingName(false);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'İsim güncellenirken bir hata oluştu',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user?.displayName]);

  useEffect(() => {
    const tab = router.query.tab;
    if (tab) {
      setTabIndex(Number(tab));
    }
  }, [router.query.tab]);

  if (loading || !user) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Head>
        <title>{user.displayName || 'Profil'} | Mahalleci</title>
      </Head>

      <Header />

      <Container maxW="container.xl" py={28}>
        <Tabs 
          variant="soft-rounded" 
          colorScheme="orange" 
          index={tabIndex}
          onChange={setTabIndex}
        >
          <TabList mb={8}>
            <Tab>Profil</Tab>
            <Tab>Yorumlarım</Tab>
            <Tab>
              Bildirimler
              {notifications.length > 0 && (
                <Badge ml={2} colorScheme="red" borderRadius="full">
                  {notifications.length}
                </Badge>
              )}
            </Tab>
            <Tab>Ayarlar</Tab>
          </TabList>

          <TabPanels>
            {/* Profil Tab */}
            <TabPanel>
              <VStack spacing={8} align="stretch">
                <Card bg={cardBg} shadow="md">
                  <CardBody>
                    <VStack spacing={6}>
                      <Box position="relative">
                        <Avatar
                          size="2xl"
                          src={user.photoURL || undefined}
                          name={user.displayName || 'Kullanıcı'}
                        />
                        <IconButton
                          aria-label="Fotoğraf değiştir"
                          icon={<FaCamera />}
                          size="sm"
                          colorScheme="orange"
                          rounded="full"
                          position="absolute"
                          bottom="0"
                          right="0"
                          onClick={() => fileInputRef.current?.click()}
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          hidden
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </Box>

                      {isEditingName ? (
                        <HStack>
                          <Input
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="İsminizi girin"
                            size="md"
                          />
                          <Button
                            colorScheme="orange"
                            size="md"
                            onClick={handleUpdateDisplayName}
                          >
                            Kaydet
                          </Button>
                          <Button
                            variant="ghost"
                            size="md"
                            onClick={() => {
                              setIsEditingName(false);
                              setDisplayName(user?.displayName || '');
                            }}
                          >
                            İptal
                          </Button>
                        </HStack>
                      ) : (
                        <HStack>
                          <Heading size="md">{user?.displayName || 'İsimsiz Kullanıcı'}</Heading>
                          <IconButton
                            aria-label="İsmi düzenle"
                            icon={<FaEdit />}
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsEditingName(true)}
                          />
                        </HStack>
                      )}
                    </VStack>
                  </CardBody>
                </Card>

                {/* İstatistikler */}
                {!isLoadingStats && userStats && (
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <Card bg={cardBg}>
                      <CardBody>
                        <VStack>
                          <Text fontSize="lg" fontWeight="bold">Yorumlar</Text>
                          <Text fontSize="2xl" color="orange.500">{userStats.totalComments}</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                    <Card bg={cardBg}>
                      <CardBody>
                        <VStack>
                          <Text fontSize="lg" fontWeight="bold">Cevaplar</Text>
                          <Text fontSize="2xl" color="orange.500">{userStats.totalReplies}</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                    <Card bg={cardBg}>
                      <CardBody>
                        <VStack>
                          <Text fontSize="lg" fontWeight="bold">Beğeniler</Text>
                          <Text fontSize="2xl" color="orange.500">{userStats.totalLikes}</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                )}
              </VStack>
            </TabPanel>

            {/* Yorumlar Tab */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {isLoadingComments ? (
                  <Skeleton height="100px" />
                ) : userComments?.length === 0 ? (
                  <Text color={mutedColor}>Henüz yorum yapmamışsınız.</Text>
                ) : (
                  userComments?.map((comment) => (
                    <Card key={comment.id} bg={cardBg}>
                      <CardBody>
                        <VStack align="stretch" spacing={3}>
                          <HStack justify="space-between">
                            <Text fontWeight="bold">{comment.text}</Text>
                            <HStack spacing={2}>
                              <Badge colorScheme="orange">{comment.rating.toFixed(1)} ⭐</Badge>
                              <Text fontSize="sm" color={mutedColor}>
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </Text>
                            </HStack>
                          </HStack>
                          <Text fontSize="sm" color={mutedColor}>
                            {comment.il} / {comment.ilce} / {comment.mahalle}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                )}
              </VStack>
            </TabPanel>

            {/* Bildirimler Tab */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {isLoadingNotifications ? (
                  <Skeleton height="100px" />
                ) : notifications.length === 0 ? (
                  <Text color={mutedColor}>Henüz bildiriminiz yok.</Text>
                ) : (
                  notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      bg={cardBg}
                      borderColor={notification.read ? borderColor : 'orange.400'}
                      borderWidth={1}
                    >
                      <CardBody>
                        <VStack align="stretch" spacing={3}>
                          <HStack justify="space-between">
                            <Text fontWeight="bold">
                              {notification.replyUserDisplayName} yorumunuza cevap yazdı
                            </Text>
                            <Text fontSize="sm" color={mutedColor}>
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </Text>
                          </HStack>
                          <Text>{notification.replyText}</Text>
                          <HStack justify="space-between">
                            <Button
                              size="sm"
                              colorScheme="orange"
                              variant="ghost"
                              onClick={() => {
                                const { il, ilce, mahalle } = notification.locationData;
                                router.push(`/mahalle/${slugify(il)}/${slugify(ilce)}/${slugify(mahalle)}`);
                              }}
                            >
                              Yoruma Git
                            </Button>
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                              >
                                Okundu İşaretle
                              </Button>
                            )}
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                )}
              </VStack>
            </TabPanel>

            {/* Ayarlar Tab */}
            <TabPanel>
              <Card bg={cardBg}>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">Profil Ayarları</Heading>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="show-profile-photo" mb="0">
                        Profil fotoğrafımı yorumlarda göster
                      </FormLabel>
                      <Switch
                        id="show-profile-photo"
                        isChecked={showProfilePhoto}
                        onChange={(e) => setShowProfilePhoto(e.target.checked)}
                        colorScheme="orange"
                      />
                    </FormControl>

                    <Divider />
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="email-notifications" mb="0">
                        E-posta bildirimleri
                      </FormLabel>
                      <Switch
                        id="email-notifications"
                        isChecked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        colorScheme="orange"
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="push-notifications" mb="0">
                        Anlık bildirimler
                      </FormLabel>
                      <Switch
                        id="push-notifications"
                        isChecked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                        colorScheme="orange"
                      />
                    </FormControl>

                    <Button
                      colorScheme="orange"
                      onClick={handleProfileUpdate}
                      isLoading={updateProfileMutation.isLoading}
                    >
                      Ayarları Kaydet
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      <Footer />
    </Box>
  );
};

export default HesabimPage; 