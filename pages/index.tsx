/// <reference types="node" />
// @ts-nocheck
import React from 'react';
import type { NextPage, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Grid,
  Flex,
  Icon,
  Button,
  useBreakpointValue,
  Fade,
  useToast,
  HStack,
  Circle,
  Divider,
  chakra,
  Center,
} from '@chakra-ui/react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import { FaMapMarkerAlt, FaSearch, FaStar, FaComments, FaCity, FaUsers, FaChartBar, FaStreetView } from 'react-icons/fa';
import { useQuery } from 'react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Dropdown from '../components/Dropdown';
import Comment from '../components/Comment';
import { useLocationStore } from '../lib/store';
import { getCommentsByLocation } from '../lib/firebase/comments';
import type { DataItem } from '../types';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionCircle = motion(Circle);

// Define the type for our data
export type DataItem = {
  il: string;
  ilce: string;
  mahalle: string[];
};

// Define props for HomePage
interface HomePageProps {
  data: DataItem[];
}

const HomePage: NextPage<HomePageProps> = ({ data }) => {
  const toast = useToast();
  const { selectedIl, selectedIlce, selectedMahalle } = useLocationStore();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const headingColor = useColorModeValue('gray.900', 'white');
  const accentColor = useColorModeValue('orange.600', 'orange.300');
  const searchBoxBg = useColorModeValue('white', 'gray.800');
  const searchBoxText = useColorModeValue('gray.800', 'white');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { scrollYProgress } = useViewportScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const router = useRouter();

  const { data: comments, isLoading, error } = useQuery(
    ['comments', selectedIl, selectedIlce, selectedMahalle],
    () => getCommentsByLocation(selectedIl, selectedIlce, selectedMahalle),
    {
      enabled: Boolean(selectedIl && selectedIlce && selectedMahalle),
      onError: (err) => {
        toast({
          title: 'Hata',
          description: 'Yorumlar yüklenirken bir hata oluştu.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );

  const features = [
    {
      icon: FaCity,
      title: 'Mahalle Keşfi',
      description: 'Türkiye\'nin tüm mahallelerini keşfedin ve detaylı bilgilere ulaşın',
      color: 'blue.400',
    },
    {
      icon: FaStar,
      title: 'Değerlendirmeler',
      description: 'Mahalleler hakkında gerçek deneyimleri okuyun ve paylaşın',
      color: 'yellow.400',
    },
    {
      icon: FaUsers,
      title: 'Topluluk',
      description: 'Mahalle sakinleriyle etkileşime geçin ve deneyimlerinizi paylaşın',
      color: 'green.400',
    },
  ];

  const stats = [
    { label: 'İl', value: '81' },
    { label: 'İlçe', value: '922' },
    { label: 'Mahalle', value: '32K+' }
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={bgColor}>
      <Head>
        <title>Mahalle | Mahalleni Keşfet ve Paylaş</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#dd6b20" />
      </Head>
      <Header />
      
      {/* Hero Section */}
      <Box
        position="relative"
        minH={{ base: "90vh", md: "85vh" }}
        bgGradient={useColorModeValue(
          'linear(to-r, orange.500, red.500)',
          'linear(to-r, orange.600, red.700)'
        )}
        overflow="hidden"
        pt={{ base: 20, md: 28 }}
      >
        {/* Animated Background Shapes */}
        <Box position="absolute" top={0} left={0} right={0} bottom={0} overflow="hidden" opacity={0.1}>
          {[...Array(5)].map((_, i) => (
            <MotionCircle
              key={i}
              position="absolute"
              bg="whiteAlpha.200"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                scale: 1,
              }}
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                scale: [1, Math.random() * 1.5 + 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              w={{ base: "200px", md: "300px" }}
              h={{ base: "200px", md: "300px" }}
            />
          ))}
        </Box>

        <Container maxW="container.xl" h="100%" position="relative">
          <Grid
            templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
            gap={16}
            h="100%"
            alignItems="center"
          >
            <VStack
              spacing={8}
              align="flex-start"
              color="white"
            >
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Heading
                  fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                  fontWeight="bold"
                  lineHeight="shorter"
                  mb={6}
                  color="white"
                >
                  Mahallenizi Keşfedin
                </Heading>
                <Text 
                  fontSize={{ base: "md", sm: "lg", md: "xl" }}
                  maxW="lg"
                  mb={8}
                  color="whiteAlpha.900"
                >
                  Türkiye'nin en kapsamlı mahalle platformunda yerel deneyimleri keşfedin, 
                  paylaşın ve topluluğa katılın.
                </Text>

                {/* Stats */}
                <HStack spacing={8} mb={12}>
                  {stats.map((stat, index) => (
                    <VStack key={index} spacing={0} align="flex-start">
                      <Text fontSize="3xl" fontWeight="bold" color="white">
                        {stat.value}
                      </Text>
                      <Text fontSize="sm" color="white">
                        {stat.label}
                      </Text>
                    </VStack>
                  ))}
                </HStack>
              </MotionBox>

              <Box
                bg={searchBoxBg}
                p={8}
                borderRadius="2xl"
                boxShadow="2xl"
                width="100%"
                maxW="2xl"
                backdropFilter="blur(10px)"
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="md" color={searchBoxText} mb={2}>
                    Mahalle Ara
                  </Heading>
                  <Dropdown data={data} />
                </VStack>
              </Box>
            </VStack>

            {!isMobile && (
              <MotionFlex
                justify="center"
                align="center"
                style={{ scale }}
              >
                <Box position="relative" width="500px" height="500px" borderRadius="full" bgGradient="radial(rgba(255,255,255,0.1), transparent)">
                  <MotionBox
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    width="400px"
                    height="400px"
                  >
                    {/* Ana daire */}
                    <MotionCircle
                      size="200px"
                      bg="whiteAlpha.100"
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      initial={{ scale: 0.8, opacity: 0.3 }}
                      animate={{
                        scale: [0.8, 1, 0.8],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Dönen parçacıklar */}
                    {[...Array(12)].map((_, i) => (
                      <MotionBox
                        key={i}
                        position="absolute"
                        top="50%"
                        left="50%"
                        width="8px"
                        height="8px"
                        borderRadius="full"
                        bg="white"
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 0
                        }}
                        animate={{
                          x: Math.cos(i * 30 * (Math.PI / 180)) * 150,
                          y: Math.sin(i * 30 * (Math.PI / 180)) * 150,
                          opacity: [0, 1, 0],
                          scale: [0.5, 1.5, 0.5]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}

                    {/* Dalgalı çemberler */}
                    {[...Array(3)].map((_, i) => (
                      <MotionCircle
                        key={i}
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        width={`${200 + i * 60}px`}
                        height={`${200 + i * 60}px`}
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        initial={{ scale: 0.8, opacity: 0.2 }}
                        animate={{
                          scale: [0.8, 1, 0.8],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </MotionBox>
                </Box>
              </MotionFlex>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={24}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center" maxW="container.md" mx="auto">
              <Heading 
                size="2xl" 
                color={headingColor}
              >
                Neler Sunuyoruz?
              </Heading>
              <Text color={textColor} fontSize="lg" maxW="2xl">
                Mahallenizi daha iyi tanımanız ve komşularınızla etkileşime geçmeniz için
                ihtiyacınız olan tüm özellikler tek bir platformda.
              </Text>
            </VStack>

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={8}
              width="100%"
            >
              {features.map((feature, index) => (
                <MotionBox
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <VStack
                    p={8}
                    bg={cardBg}
                    borderRadius="2xl"
                    boxShadow="xl"
                    spacing={6}
                    height="100%"
                    position="relative"
                    overflow="hidden"
                    _hover={{
                      transform: 'translateY(-8px)',
                      boxShadow: '2xl',
                    }}
                    transition="all 0.3s"
                  >
                    <Circle
                      size="120px"
                      bg={`${feature.color}10`}
                      position="absolute"
                      top="-20px"
                      right="-20px"
                    />
                    <Flex
                      w={16}
                      h={16}
                      align="center"
                      justify="center"
                      color="white"
                      rounded="xl"
                      bg={feature.color}
                      position="relative"
                    >
                      <Icon as={feature.icon} w={8} h={8} />
                    </Flex>
                    <VStack spacing={4} align="flex-start">
                      <Heading size="md" color={headingColor}>
                        {feature.title}
                      </Heading>
                      <Text color={textColor}>
                        {feature.description}
                      </Text>
                    </VStack>
                  </VStack>
                </MotionBox>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'data.json');
    const jsonData = await fs.promises.readFile(filePath, 'utf8');
    const data: DataItem[] = JSON.parse(jsonData);
    return {
      props: { data }
    };
  } catch (error) {
    console.error('Error reading data.json:', error);
    return {
      props: { data: [] }
    };
  }
};

export default HomePage; 