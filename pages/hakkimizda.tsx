import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { FaUsers, FaMapMarkedAlt, FaComments, FaChartLine } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from 'next/head';

const AboutPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const features = [
    {
      icon: FaUsers,
      title: 'Topluluk Odaklı',
      description: 'Mahalle sakinlerinin deneyimlerini paylaşabileceği güvenilir bir platform.',
    },
    {
      icon: FaMapMarkedAlt,
      title: 'Kapsamlı Bilgi',
      description: 'Türkiye\'nin tüm mahallelerini kapsayan detaylı bilgi ve değerlendirmeler.',
    },
    {
      icon: FaComments,
      title: 'Gerçek Deneyimler',
      description: 'Mahalle sakinlerinden gelen gerçek yorumlar ve değerlendirmeler.',
    },
    {
      icon: FaChartLine,
      title: 'Güncel Veriler',
      description: 'Sürekli güncellenen mahalle puanları ve değerlendirmeleri.',
    },
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      <Head>
        <title>Hakkımızda | Mahalleci</title>
        <meta name="description" content="Mahalleci hakkında bilgi edinin. Türkiye'nin en kapsamlı mahalle platformu." />
      </Head>

      <Header />

      <Container maxW="container.xl" py={28}>
        <VStack spacing={16}>
          {/* Hero Section */}
          <VStack spacing={6} textAlign="center" maxW="container.md">
            <Heading 
              size="2xl" 
              color={headingColor}
              bgGradient="linear(to-r, orange.400, red.500)"
              bgClip="text"
            >
              Hakkımızda
            </Heading>
            <Text fontSize="xl" color={textColor} lineHeight="tall">
              Mahalleci, Türkiye'nin en kapsamlı mahalle platformudur. 
              Amacımız, insanların yaşayacakları mahalleyi seçerken 
              doğru ve güvenilir bilgilere ulaşmasını sağlamaktır.
            </Text>
          </VStack>

          {/* Features Grid */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            {features.map((feature, index) => (
              <Box
                key={index}
                p={8}
                bg={cardBg}
                borderRadius="xl"
                border="1px solid"
                borderColor={borderColor}
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  borderColor: 'orange.400',
                }}
                transition="all 0.3s"
              >
                <VStack align="start" spacing={4}>
                  <Flex
                    w={12}
                    h={12}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg="orange.400"
                    color="white"
                  >
                    <Icon as={feature.icon} boxSize={6} />
                  </Flex>
                  <Heading size="md" color={headingColor}>
                    {feature.title}
                  </Heading>
                  <Text color={textColor}>
                    {feature.description}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Mission Section */}
          <VStack spacing={8} maxW="container.md" textAlign="center">
            <Heading size="xl" color={headingColor}>
              Misyonumuz
            </Heading>
            <Text fontSize="lg" color={textColor} lineHeight="tall">
              İnsanların yaşayacakları mahalleyi seçerken bilinçli kararlar vermelerini sağlamak için
              güvenilir, güncel ve detaylı bilgiler sunmak. Mahalle sakinlerinin deneyimlerini
              paylaşabilecekleri şeffaf bir platform oluşturarak topluluk odaklı bir yaklaşım benimsemek.
            </Text>
          </VStack>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default AboutPage; 