// @ts-nocheck
import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  Divider,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import NextLink from 'next/link';

const Footer = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const linkColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      color={textColor}
      borderTop="1px"
      borderColor={borderColor}
    >
      <Container maxW="container.xl" py={3}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {/* Hakkımızda */}
          <Stack spacing={2} align={{ base: 'center', md: 'flex-start' }}>
            <Text fontWeight="bold" fontSize="md">
              Hakkımızda
            </Text>
            <Stack spacing={1} align={{ base: 'center', md: 'flex-start' }}>
              <Link
                as={NextLink}
                href="/about"
                color={linkColor}
                _hover={{ color: 'orange.500' }}
                fontSize="sm"
              >
                Hakkımızda
              </Link>
              <Link
                as={NextLink}
                href="/contact"
                color={linkColor}
                _hover={{ color: 'orange.500' }}
                fontSize="sm"
              >
                Bize Ulaşın
              </Link>
              <Text fontSize="sm" textAlign={{ base: 'center', md: 'left' }}>
                Mahalleci, Türkiye'nin en kapsamlı mahalle platformudur. Mahallenizi keşfedin, 
                deneyimlerinizi paylaşın ve topluluğa katılın.
              </Text>
            </Stack>
          </Stack>

          {/* Yasal */}
          <Stack spacing={2} align="center">
            <Text fontWeight="bold" fontSize="md">
              Yasal
            </Text>
            <Stack spacing={1} align="center">
              <Link
                as={NextLink}
                href="/legal/privacy-policy"
                color={linkColor}
                _hover={{ color: 'orange.500' }}
                fontSize="sm"
              >
                Gizlilik Politikası
              </Link>
              <Link
                as={NextLink}
                href="/legal/terms-of-service"
                color={linkColor}
                _hover={{ color: 'orange.500' }}
                fontSize="sm"
              >
                Kullanım Koşulları
              </Link>
              <Link
                as={NextLink}
                href="/legal/kvkk"
                color={linkColor}
                _hover={{ color: 'orange.500' }}
                fontSize="sm"
              >
                KVKK Aydınlatma Metni
              </Link>
              <Link
                as={NextLink}
                href="/legal/cookie-policy"
                color={linkColor}
                _hover={{ color: 'orange.500' }}
                fontSize="sm"
              >
                Çerez Politikası
              </Link>
            </Stack>
          </Stack>

          {/* İletişim */}
          <Stack spacing={2} align={{ base: 'center', md: 'flex-end' }}>
            <Text fontWeight="bold" fontSize="md">
              İletişim
            </Text>
            <Stack spacing={1} align={{ base: 'center', md: 'flex-end' }}>
              <Text fontSize="sm">
                E-posta: info@mahalleci.com
              </Text>
              <Text fontSize="sm">
                Adres: İstanbul, Türkiye
              </Text>
              <Link
                href="https://mahalleci.com"
                color={linkColor}
                _hover={{ color: 'orange.500' }}
                fontSize="sm"
                isExternal
              >
                www.mahalleci.com
              </Link>
            </Stack>
          </Stack>
        </SimpleGrid>

        <Divider my={3} borderColor={borderColor} />

        <Text fontSize="sm" textAlign="center">
          © {new Date().getFullYear()} Mahalleci. Tüm hakları saklıdır.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer; 