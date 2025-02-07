import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import Head from 'next/head';

const TermsOfService = () => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <>
      <Head>
        <title>Kullanım Koşulları - Mahalle</title>
        <meta
          name="description"
          content="Mahalle platformu kullanım koşulları. Platform kullanımına ilişkin kurallar ve şartlar hakkında bilgi edinin."
        />
      </Head>

      <Box bg={bgColor} color={textColor} minH="100vh" py={12}>
        <Container maxW="container.md">
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="xl" mb={6}>
              Kullanım Koşulları
            </Heading>

            <Text>
              Son güncellenme: {new Date().toLocaleDateString('tr-TR')}
            </Text>

            <VStack spacing={6} align="stretch">
              <Box>
                <Heading as="h2" size="md" mb={4}>
                  1. Kabul Edilen Şartlar
                </Heading>
                <Text>
                  Bu Kullanım Koşulları, Mahalle platformunu ("Platform") kullanımınızı düzenleyen 
                  şartları ve koşulları belirler. Platformu kullanarak bu koşulları kabul etmiş 
                  sayılırsınız.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  2. Hizmet Kullanımı
                </Heading>
                <Text>
                  Platform üzerinde aşağıdaki kurallara uymanız gerekmektedir:
                </Text>
                <Text mt={2}>
                  • Yasalara ve etik kurallara uygun davranmak
                  <br />
                  • Başkalarının haklarına saygı göstermek
                  <br />
                  • Doğru ve güncel bilgi paylaşmak
                  <br />
                  • Spam veya zararlı içerik paylaşmamak
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  3. Hesap Güvenliği
                </Heading>
                <Text>
                  Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi güvende tutmalı ve 
                  hesabınızla yapılan tüm işlemlerin sorumluluğunu üstlenmelisiniz.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  4. İçerik Politikası
                </Heading>
                <Text>
                  Platform üzerinde paylaşılan içerikler için aşağıdaki kurallar geçerlidir:
                </Text>
                <Text mt={2}>
                  • Telif haklarına uygun içerik paylaşımı
                  <br />
                  • Nefret söylemi ve ayrımcılık içeren paylaşımların yasak olması
                  <br />
                  • Yanıltıcı veya spam içeriklerin yasak olması
                  <br />
                  • Mahalle sakinlerinin mahremiyetine saygı gösterilmesi
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  5. Fikri Mülkiyet
                </Heading>
                <Text>
                  Platform üzerindeki tüm içerik, tasarım ve yazılım hakları bize aittir. 
                  Kullanıcılar tarafından paylaşılan içeriklerin hakları kullanıcılara aittir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  6. Sorumluluk Reddi
                </Heading>
                <Text>
                  Platform üzerinde paylaşılan kullanıcı içeriklerinin doğruluğu ve 
                  güvenilirliğinden sorumlu değiliz. Platform hizmetlerini "olduğu gibi" 
                  sunmaktayız.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  7. Değişiklikler
                </Heading>
                <Text>
                  Bu kullanım koşullarını önceden haber vermeksizin değiştirme hakkını 
                  saklı tutarız. Değişiklikler yayınlandıktan sonra platformu kullanmaya 
                  devam etmeniz, değişiklikleri kabul ettiğiniz anlamına gelir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  8. İletişim
                </Heading>
                <Text>
                  Bu kullanım koşulları hakkında sorularınız veya endişeleriniz varsa, 
                  lütfen info@mahalle.com adresinden bizimle iletişime geçin.
                </Text>
              </Box>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default TermsOfService; 