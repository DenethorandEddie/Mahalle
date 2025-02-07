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

const CookiePolicy = () => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <>
      <Head>
        <title>Çerez Politikası - Mahalle</title>
        <meta
          name="description"
          content="Mahalle platformu çerez politikası. Web sitemizde kullanılan çerezler hakkında detaylı bilgi edinin."
        />
      </Head>

      <Box bg={bgColor} color={textColor} minH="100vh" py={12}>
        <Container maxW="container.md">
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="xl" mb={6}>
              Çerez Politikası
            </Heading>

            <Text>
              Son güncellenme: {new Date().toLocaleDateString('tr-TR')}
            </Text>

            <VStack spacing={6} align="stretch">
              <Box>
                <Heading as="h2" size="md" mb={4}>
                  1. Çerez Nedir?
                </Heading>
                <Text>
                  Çerezler (cookies), web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla 
                  cihazınıza yerleştirilen küçük metin dosyalarıdır. Bu dosyalar size daha iyi bir 
                  kullanıcı deneyimi sunmamıza yardımcı olur.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  2. Hangi Çerezleri Kullanıyoruz?
                </Heading>
                <Text>
                  Web sitemizde aşağıdaki çerez türlerini kullanmaktayız:
                </Text>
                <Text mt={2}>
                  • Zorunlu Çerezler:
                  <br />
                  Sitemizin düzgün çalışması için gerekli olan çerezlerdir.
                  <br />
                  <br />
                  • Performans Çerezleri:
                  <br />
                  Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olan çerezlerdir.
                  <br />
                  <br />
                  • İşlevsellik Çerezleri:
                  <br />
                  Kullanıcı tercihlerini hatırlamamızı sağlayan çerezlerdir.
                  <br />
                  <br />
                  • Hedefleme/Reklam Çerezleri:
                  <br />
                  Kullanıcılara özelleştirilmiş içerik sunmak için kullanılan çerezlerdir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  3. Çerezlerin Kullanım Amaçları
                </Heading>
                <Text>
                  Çerezleri aşağıdaki amaçlarla kullanmaktayız:
                </Text>
                <Text mt={2}>
                  • Oturum yönetimi ve kullanıcı kimlik doğrulaması
                  <br />
                  • Kullanıcı tercihlerinin hatırlanması
                  <br />
                  • Site trafiğinin analizi ve performans ölçümü
                  <br />
                  • Kişiselleştirilmiş içerik sunumu
                  <br />
                  • Güvenlik önlemlerinin sağlanması
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  4. Çerezleri Nasıl Kontrol Edebilirsiniz?
                </Heading>
                <Text>
                  Tarayıcınızın ayarlarını değiştirerek çerezleri kontrol edebilir veya 
                  silebilirsiniz. Çerezleri devre dışı bırakmanın bazı özelliklerin 
                  kullanılamamasına neden olabileceğini unutmayın.
                </Text>
                <Text mt={4}>
                  Popüler tarayıcılarda çerez ayarlarına erişim:
                </Text>
                <Text mt={2}>
                  • Google Chrome: Ayarlar {'>'} Gelişmiş {'>'} Gizlilik ve Güvenlik
                  <br />
                  • Mozilla Firefox: Seçenekler {'>'} Gizlilik ve Güvenlik
                  <br />
                  • Safari: Tercihler {'>'} Gizlilik
                  <br />
                  • Microsoft Edge: Ayarlar {'>'} Gizlilik ve Güvenlik
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  5. Üçüncü Taraf Çerezleri
                </Heading>
                <Text>
                  Web sitemizde üçüncü taraf hizmet sağlayıcılarının (örneğin, Google Analytics) 
                  çerezleri de bulunabilir. Bu çerezler, hizmet sağlayıcıların gizlilik 
                  politikalarına tabidir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  6. Çerez Politikası Güncellemeleri
                </Heading>
                <Text>
                  Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişiklikler olması 
                  durumunda sizi bilgilendireceğiz. Politikanın son güncellenme tarihi sayfanın 
                  üst kısmında belirtilmiştir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  7. İletişim
                </Heading>
                <Text>
                  Çerez politikamız hakkında sorularınız veya endişeleriniz varsa, 
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

export default CookiePolicy; 