import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Flex,
  Avatar,
  HStack,
} from '@chakra-ui/react';
import { FaUsers, FaMapMarkedAlt, FaComments, FaChartLine } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from 'next/head';

const AboutPage = () => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
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
      description: 'Türkiye\'nin tüm mahallelerini kapsayan detaylı bilgi kaynağı.',
    },
    {
      icon: FaComments,
      title: 'Gerçek Deneyimler',
      description: 'Mahalle sakinlerinden gelen doğrudan ve samimi geri bildirimler.',
    },
    {
      icon: FaChartLine,
      title: 'Güncel Veriler',
      description: 'Sürekli güncellenen mahalle değerlendirmeleri ve istatistikler.',
    },
  ];

  return (
    <>
      <Head>
        <title>Hakkımızda | {process.env.NEXT_PUBLIC_SITE_NAME}</title>
        <meta
          name="description"
          content="Mahalleci hakkında detaylı bilgi edinin. Vizyonumuz, misyonumuz ve değerlerimizi keşfedin."
        />
      </Head>

      <Box minH="100vh" bg={bgColor}>
        <Header />
        
        <Container maxW="container.lg" py={12}>
          <VStack spacing={12} align="stretch">
            {/* Hero Section */}
            <VStack spacing={6} textAlign="center">
              <Heading as="h1" size="2xl" color={headingColor}>
                Hakkımızda
              </Heading>
              <Text fontSize="xl" color={textColor} maxW="2xl" mx="auto">
                Mahalleci, Türkiye'nin en kapsamlı mahalle bilgi platformudur. 
                Amacımız, insanların yaşadıkları veya yaşamayı düşündükleri mahalleler 
                hakkında gerçek ve güncel bilgilere ulaşmalarını sağlamaktır.
              </Text>
            </VStack>

            {/* Features Grid */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  p={8}
                  bg={cardBg}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={borderColor}
                  shadow="sm"
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
                >
                  <VStack align="start" spacing={4}>
                    <Icon as={feature.icon} boxSize={8} color="orange.500" />
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

            {/* Mission & Vision */}
            <VStack spacing={8} py={8}>
              <Box textAlign="center" maxW="3xl" mx="auto">
                <Heading as="h2" size="xl" mb={6} color={headingColor}>
                  Misyonumuz
                </Heading>
                <Text fontSize="lg" color={textColor}>
                  İnsanların yaşam alanları hakkında bilinçli kararlar vermelerini sağlamak için 
                  güvenilir, güncel ve tarafsız bilgiler sunmak. Mahalle kültürünü koruyarak 
                  modern şehir yaşamına uygun çözümler geliştirmek.
                </Text>
              </Box>

              <Box textAlign="center" maxW="3xl" mx="auto">
                <Heading as="h2" size="xl" mb={6} color={headingColor}>
                  Vizyonumuz
                </Heading>
                <Text fontSize="lg" color={textColor}>
                  Türkiye'nin en güvenilir ve kapsamlı mahalle bilgi platformu olarak, 
                  insanların yaşam kalitesini artırmaya katkıda bulunmak ve mahalle 
                  kültürünün gelişimine öncülük etmek.
                </Text>
              </Box>
            </VStack>

            {/* Values */}
            <Box py={8}>
              <Heading as="h2" size="xl" mb={8} textAlign="center" color={headingColor}>
                Değerlerimiz
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                <Box
                  p={6}
                  bg={cardBg}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <VStack align="start" spacing={4}>
                    <Heading size="md" color={headingColor}>Güvenilirlik</Heading>
                    <Text color={textColor}>
                      Kullanıcılarımıza her zaman doğru ve güvenilir bilgiler sunmayı taahhüt ediyoruz.
                    </Text>
                  </VStack>
                </Box>
                <Box
                  p={6}
                  bg={cardBg}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <VStack align="start" spacing={4}>
                    <Heading size="md" color={headingColor}>Şeffaflık</Heading>
                    <Text color={textColor}>
                      Tüm süreçlerimizde açık ve şeffaf olmayı ilke ediniyoruz.
                    </Text>
                  </VStack>
                </Box>
                <Box
                  p={6}
                  bg={cardBg}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <VStack align="start" spacing={4}>
                    <Heading size="md" color={headingColor}>Topluluk Odaklılık</Heading>
                    <Text color={textColor}>
                      Kullanıcı deneyimlerini ve topluluk geri bildirimlerini merkeze alıyoruz.
                    </Text>
                  </VStack>
                </Box>
                <Box
                  p={6}
                  bg={cardBg}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <VStack align="start" spacing={4}>
                    <Heading size="md" color={headingColor}>Yenilikçilik</Heading>
                    <Text color={textColor}>
                      Sürekli gelişim ve yenilikçi çözümler üretmeye odaklanıyoruz.
                    </Text>
                  </VStack>
                </Box>
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>

        <Footer />
      </Box>
    </>
  );
};

export default AboutPage; 