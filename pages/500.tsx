import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ServerError = () => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <>
      <Head>
        <title>Sunucu Hatası - Mahalleci</title>
        <meta
          name="description"
          content="Bir sunucu hatası oluştu."
        />
      </Head>

      <Box bg={bgColor} minH="100vh" py={20}>
        <Container maxW="container.md">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl" color={textColor}>
              500
            </Heading>
            <Heading size="xl">
              Sunucu Hatası
            </Heading>
            <Text color={textColor} fontSize="lg">
              Üzgünüz, bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.
            </Text>
            <Button
              colorScheme="orange"
              size="lg"
              onClick={() => router.push('/')}
            >
              Ana Sayfaya Dön
            </Button>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default ServerError; 