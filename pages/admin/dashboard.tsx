import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  Select,
  Flex,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { FaEye, FaComments, FaHeart, FaStar, FaChartLine } from 'react-icons/fa';
import { useQuery } from 'react-query';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../lib/hooks/useAuth';
import { getDashboardStats } from '../../lib/firebase/comments';
import { getTrendingMahalleler } from '../../lib/firebase/comments';
import type { TrendingMahalle } from '../../types';
import Head from 'next/head';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // İstatistikleri getir
  const { data: stats, isLoading: isLoadingStats } = useQuery(
    ['dashboardStats', timeRange],
    () => getDashboardStats(timeRange),
    {
      enabled: !!user,
      refetchInterval: 300000, // 5 dakikada bir yenile
    }
  );

  // Trend mahallelerini getir
  const { data: trendingMahalleler, isLoading: isLoadingTrending } = useQuery<TrendingMahalle[]>(
    'trendingMahalleler',
    () => getTrendingMahalleler(10),
    {
      enabled: !!user,
      refetchInterval: 300000,
    }
  );

  if (!user) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Head>
          <title>Admin Dashboard | Mahalle</title>
        </Head>
        <Header />
        <Container maxW="container.xl" py={8}>
          <Text color={textColor}>Bu sayfayı görüntülemek için yetkiniz yok.</Text>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Head>
        <title>Admin Dashboard | Mahalle</title>
      </Head>
      <Header />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Başlık ve Filtre */}
          <Flex justify="space-between" align="center">
            <Heading size="lg" color={textColor}>Admin Dashboard</Heading>
            <Select
              w="200px"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              bg={cardBg}
              borderColor={borderColor}
            >
              <option value="day">Son 24 Saat</option>
              <option value="week">Son 7 Gün</option>
              <option value="month">Son 30 Gün</option>
              <option value="year">Son 1 Yıl</option>
            </Select>
          </Flex>

          {/* Ana İstatistikler */}
          {isLoadingStats ? (
            <Flex justify="center" py={8}>
              <Spinner size="xl" color="orange.500" />
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Card bg={cardBg} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Stat>
                    <Flex align="center" mb={2}>
                      <Icon as={FaEye} color="blue.500" boxSize={5} mr={2} />
                      <StatLabel color={textColor}>Toplam Görüntülenme</StatLabel>
                    </Flex>
                    <StatNumber color={textColor} fontSize="3xl">
                      {stats?.totalViews.toLocaleString()}
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Stat>
                    <Flex align="center" mb={2}>
                      <Icon as={FaComments} color="green.500" boxSize={5} mr={2} />
                      <StatLabel color={textColor}>Toplam Yorum</StatLabel>
                    </Flex>
                    <StatNumber color={textColor} fontSize="3xl">
                      {stats?.totalComments.toLocaleString()}
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Stat>
                    <Flex align="center" mb={2}>
                      <Icon as={FaHeart} color="red.500" boxSize={5} mr={2} />
                      <StatLabel color={textColor}>Favori Sayısı</StatLabel>
                    </Flex>
                    <StatNumber color={textColor} fontSize="3xl">
                      {stats?.favoriteCount.toLocaleString()}
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Stat>
                    <Flex align="center" mb={2}>
                      <Icon as={FaStar} color="yellow.500" boxSize={5} mr={2} />
                      <StatLabel color={textColor}>Ortalama Puan</StatLabel>
                    </Flex>
                    <StatNumber color={textColor} fontSize="3xl">
                      {stats?.averageRating}
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}

          {/* Trend Mahalleler */}
          <Box>
            <Heading size="md" mb={4} color={textColor}>
              Trend Mahalleler
            </Heading>
            <Card bg={cardBg} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                {isLoadingTrending ? (
                  <Flex justify="center" py={4}>
                    <Spinner size="lg" color="orange.500" />
                  </Flex>
                ) : (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Mahalle</Th>
                        <Th>İl/İlçe</Th>
                        <Th isNumeric>Trend Skoru</Th>
                        <Th>Trend</Th>
                        <Th>Son Güncelleme</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {trendingMahalleler?.map((mahalle, index) => (
                        <Tr key={index}>
                          <Td fontWeight="medium" color={textColor}>
                            {mahalle.mahalle}
                          </Td>
                          <Td color={mutedColor}>
                            {mahalle.il} / {mahalle.ilce}
                          </Td>
                          <Td isNumeric color={textColor}>
                            {mahalle.score.toFixed(1)}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                mahalle.trend === 'up'
                                  ? 'green'
                                  : mahalle.trend === 'down'
                                  ? 'red'
                                  : 'gray'
                              }
                            >
                              {mahalle.trend === 'up'
                                ? 'Yükseliyor'
                                : mahalle.trend === 'down'
                                ? 'Düşüyor'
                                : 'Stabil'}
                            </Badge>
                          </Td>
                          <Td color={mutedColor}>
                            {new Date(mahalle.lastUpdated).toLocaleDateString('tr-TR')}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
};

export default AdminDashboard; 