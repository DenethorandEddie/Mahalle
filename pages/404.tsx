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

const NotFound = () => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <>
      <Head>
        <title>Sayfa Bulunamadı - Mahalleci</title>
        <meta
          name="description"
          content="Aradığınız sayfa bulunamadı."
        />
      </Head>

      <Box bg={bgColor} minH="100vh" py={20}>
        <Container maxW="container.md">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl" color={textColor}>
              404
            </Heading>
            <Heading size="xl">
              Sayfa Bulunamadı
            </Heading>
            <Text color={textColor} fontSize="lg">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir.
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

export default NotFound; 