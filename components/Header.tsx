// @ts-nocheck
import React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  HStack,
  IconButton,
  useColorMode,
  Stack,
  Badge,
  VStack,
  Text,
  useColorModeValue,
  MenuDivider,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaMoon, FaSun, FaUser, FaBell } from 'react-icons/fa';
import { useAuth } from '../lib/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getUserNotifications, markNotificationAsRead } from '../lib/firebase/comments';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, signIn, signOut } = useAuth();
  const queryClient = useQueryClient();

  const bgColor = useColorModeValue('whiteAlpha.900', 'blackAlpha.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');

  // Okunmamış bildirimleri getir
  const { data: notifications = [] } = useQuery(
    ['notifications', user?.uid],
    () => getUserNotifications(user?.uid || ''),
    {
      enabled: !!user,
      refetchInterval: 30000,
    }
  );

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={bgColor}
      css={{ backdropFilter: 'blur(10px)' }}
      zIndex={2}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h={20} alignItems="center" justifyContent="space-between">
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/logo_nobg.png"
              alt="Mahalleci"
              width={80}
              height={80}
              style={{ marginRight: '12px' }}
            />
          </Link>

          <HStack spacing={8} flex={1} justify="center">
            <Stack
              direction="row"
              spacing={8}
              display={{ base: 'none', md: 'flex' }}
              alignItems="center"
            >
              <Link 
                href="/" 
                style={{ 
                  color: colorMode === 'light' ? '#1A202C' : '#FFFFFF',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/hakkimizda" 
                style={{ 
                  color: colorMode === 'light' ? '#1A202C' : '#FFFFFF',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
              >
                Hakkımızda
              </Link>
              <Link 
                href="/bize-ulasin" 
                style={{ 
                  color: colorMode === 'light' ? '#1A202C' : '#FFFFFF',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
              >
                Bize Ulaşın
              </Link>
            </Stack>
          </HStack>

          <HStack spacing={4}>
            <IconButton
              aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              color="orange.500"
            />

            {user ? (
              <HStack spacing={2}>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Notifications"
                    icon={<FaBell />}
                    variant="ghost"
                    colorScheme="orange"
                  />
                  <MenuList>
                    {unreadNotifications.length === 0 ? (
                      <MenuItem>
                        <Text color={textColor}>Yeni bildiriminiz yok</Text>
                      </MenuItem>
                    ) : (
                      unreadNotifications.map((notification) => (
                        <MenuItem key={notification.id}>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold" fontSize="sm">
                              {notification.replyUserDisplayName} yorumunuza cevap yazdı
                            </Text>
                            <Text fontSize="xs" color={mutedColor}>
                              {notification.replyText}
                            </Text>
                          </VStack>
                        </MenuItem>
                      ))
                    )}
                    <MenuDivider />
                    <MenuItem onClick={() => router.push('/hesabim?tab=2')}>
                      <Text color={textColor}>Tüm bildirimleri görüntüle</Text>
                    </MenuItem>
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                  >
                    <Avatar
                      size="sm"
                      name={user.displayName || 'Kullanıcı'}
                      src={user.photoURL || undefined}
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => router.push('/hesabim')}>
                      Profilim
                    </MenuItem>
                    <MenuItem onClick={signOut}>Çıkış Yap</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            ) : (
              <Button
                colorScheme="orange"
                onClick={signIn}
                leftIcon={<FaUser />}
                size="sm"
              >
                Giriş Yap
              </Button>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header; 