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

const KVKK = () => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <>
      <Head>
        <title>KVKK Aydınlatma Metni - Mahalle</title>
        <meta
          name="description"
          content="Mahalle platformu KVKK aydınlatma metni. Kişisel verilerinizin işlenmesi hakkında detaylı bilgi edinin."
        />
      </Head>

      <Box bg={bgColor} color={textColor} minH="100vh" py={12}>
        <Container maxW="container.md">
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="xl" mb={6}>
              KVKK Aydınlatma Metni
            </Heading>

            <Text>
              Son güncellenme: {new Date().toLocaleDateString('tr-TR')}
            </Text>

            <VStack spacing={6} align="stretch">
              <Box>
                <Heading as="h2" size="md" mb={4}>
                  1. Veri Sorumlusu
                </Heading>
                <Text>
                  6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel 
                  verileriniz; veri sorumlusu olarak Mahalle platformu ("Platform") tarafından 
                  aşağıda açıklanan kapsamda işlenebilecektir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  2. Kişisel Verilerin İşlenme Amacı
                </Heading>
                <Text>
                  Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                </Text>
                <Text mt={2}>
                  • Platformun sunduğu hizmetlerin sağlanması ve geliştirilmesi
                  <br />
                  • Kullanıcı deneyiminin iyileştirilmesi
                  <br />
                  • Platform güvenliğinin sağlanması
                  <br />
                  • Yasal yükümlülüklerin yerine getirilmesi
                  <br />
                  • İletişim faaliyetlerinin yürütülmesi
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  3. İşlenen Kişisel Veri Kategorileri
                </Heading>
                <Text>
                  Platform tarafından işlenen kişisel veriler aşağıdaki kategorilerde yer almaktadır:
                </Text>
                <Text mt={2}>
                  • Kimlik Bilgileri: Ad, soyad
                  <br />
                  • İletişim Bilgileri: E-posta adresi
                  <br />
                  • Kullanıcı İşlem Bilgileri: Yorumlar, değerlendirmeler, favori mahalleler
                  <br />
                  • İşlem Güvenliği Bilgileri: IP adresi, tarayıcı bilgileri
                  <br />
                  • Konum Bilgileri: Seçilen il, ilçe ve mahalle bilgileri
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  4. Kişisel Verilerin Aktarılması
                </Heading>
                <Text>
                  Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi 
                  doğrultusunda, aşağıdaki taraflara aktarılabilecektir:
                </Text>
                <Text mt={2}>
                  • Yasal yükümlülüklerimiz kapsamında kamu kurum ve kuruluşlarına
                  <br />
                  • Hizmet aldığımız tedarikçilere
                  <br />
                  • Platform güvenliğinin sağlanması amacıyla hizmet sağlayıcılara
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi
                </Heading>
                <Text>
                  Kişisel verileriniz, Platform üzerinden elektronik ortamda otomatik yollarla 
                  toplanmaktadır. Toplama işlemi, KVKK'nın 5. ve 6. maddelerinde belirtilen 
                  hukuki sebeplere dayanmaktadır.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  6. KVKK Kapsamındaki Haklarınız
                </Heading>
                <Text>
                  KVKK'nın 11. maddesi uyarınca sahip olduğunuz haklar:
                </Text>
                <Text mt={2}>
                  • Kişisel verilerinizin işlenip işlenmediğini öğrenme
                  <br />
                  • Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme
                  <br />
                  • Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp 
                    kullanılmadığını öğrenme
                  <br />
                  • Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü 
                    kişileri bilme
                  <br />
                  • Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların 
                    düzeltilmesini isteme
                  <br />
                  • KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin 
                    silinmesini veya yok edilmesini isteme
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  7. İletişim
                </Heading>
                <Text>
                  KVKK kapsamındaki haklarınızı kullanmak için veya sorularınız için 
                  info@mahalle.com adresinden bizimle iletişime geçebilirsiniz.
                </Text>
              </Box>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default KVKK; 