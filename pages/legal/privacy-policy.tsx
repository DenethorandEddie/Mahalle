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

const PrivacyPolicy = () => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <>
      <Head>
        <title>Gizlilik Politikası - Mahalleci</title>
        <meta
          name="description"
          content="Mahalleci platformu gizlilik politikası. Kişisel verilerinizin nasıl işlendiği ve korunduğu hakkında bilgi edinin."
        />
      </Head>

      <Box bg={bgColor} color={textColor} minH="100vh" py={12}>
        <Container maxW="container.md">
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="xl" mb={6}>
              Gizlilik Politikası
            </Heading>

            <Text>
              Son güncellenme: {new Date().toLocaleDateString('tr-TR')}
            </Text>

            <VStack spacing={6} align="stretch">
              <Box>
                <Text>
                  Mahalleci olarak kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz. 
                  Kişisel verileriniz 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")'na uygun olarak 
                  işlenmekte ve muhafaza edilmektedir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  1. Kişisel Verilerinizin Ne Şekilde İşlenebileceği
                </Heading>
                <Text>
                  6698 sayılı KVKK uyarınca, Mahalleci ile paylaştığınız kişisel verileriniz, tamamen veya kısmen, 
                  otomatik olarak veyahut herhangi bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan 
                  yollarla elde edilerek, kaydedilerek, depolanarak, değiştirilerek, yeniden düzenlenerek, kısacası 
                  veriler üzerinde gerçekleştirilen her türlü işleme konu olarak tarafımızdan işlenebilecektir. 
                  KVKK kapsamında veriler üzerinde gerçekleştirilen her türlü işlem "kişisel verilerin işlenmesi" 
                  olarak kabul edilmektedir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  2. Kişisel Verilerinizin İşlenme Amaçları Ve Hukuki Sebepleri
                </Heading>
                <Text>
                  Paylaştığınız kişisel veriler:
                </Text>
                <Text mt={2}>
                  • Kullanıcılarımıza verdiğimiz hizmetlerin gereklerini, sözleşmenin ve teknolojinin gereklerine 
                    uygun şekilde yapabilmek, sunulan ürün ve hizmetlerimizi geliştirebilmek için;
                  <br />
                  • Kamu güvenliğine ilişkin hususlarda ve hukuki uyuşmazlıklarda, talep halinde ve mevzuat gereği 
                    savcılıklara, mahkemelere ve ilgili kamu görevlilerine bilgi verebilmek için;
                  <br />
                  • Üyelerimize geniş kapsamda çeşitli imkânlar sunabilmek veya bu imkânları sunabilecek kişi veya 
                    kurumlarla yasal çerçevede paylaşabilmek için;
                  <br />
                  • Kullanıcı deneyimini analiz etmek için,
                  <br />
                  6698 sayılı KVKK ve ilgili ikincil düzenlemelere uygun olarak işlenecektir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  3. Kişisel Verilerinizin Aktarılabileceği Üçüncü Kişi Veya Kuruluşlar
                </Heading>
                <Text>
                  Yukarıda belirtilen amaçlarla, Mahalleci ile paylaştığınız kişisel verilerinizin aktarılabileceği 
                  kişi/kuruluşlar; ana hissedarlarımız, hissedarlarımız, reklam verenler, doğrudan veya dolaylı 
                  yurt içi/yurt dışı iştiraklerimiz; başta Mahalleci altyapısını kullanan üye firmalar ve bunlarla 
                  sınırlı olmamak üzere sunulan hizmet ile ilgili kişi ve kuruluşlar olmak üzere, faaliyetlerimizi 
                  yürütmek üzere ve/veya Veri İşleyen sıfatı ile hizmet aldığımız, iş birliği yaptığımız, program 
                  ortağı kuruluşları, yurtiçi/yurtdışı kuruluşlar ve diğer 3. kişiler ve kuruluşlardır.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  4. Kişisel Verilerinizin Toplanma Şekli
                </Heading>
                <Text>
                  Kişisel verileriniz:
                </Text>
                <Text mt={2}>
                  • Mahalleci internet sitesi ve mobil uygulamalarındaki formlar ile ad, soyad, adres, telefon, 
                    iş veya özel e-posta adresi gibi bilgiler ile; kullanıcı adı ve şifresi kullanılarak giriş 
                    yapılan sayfalardaki tercihler, gerçekleştirilen işlemlerin IP kayıtları, tarayıcı tarafından 
                    toplanan çerez verileri ile gezinme süre ve detaylarını içeren veriler, konum verileri şeklinde;
                  <br />
                  • Mahalleci ile ticari ilişki kurmak, iş başvurusu yapmak, teklif vermek gibi amaçlarla, kartvizit, 
                    özgeçmiş (cv), teklif vermek ve sair yollarla kişisel verilerini paylaşan kişilerden alınan, 
                    fiziki veya sanal bir ortamda, yüz yüze ya da mesafeli, sözlü veya yazılı ya da elektronik ortamdan;
                  <br />
                  • Ayrıca farklı kanallardan dolaylı yoldan elde edilen, web sitesi, blog, yarışma, anket, oyun, 
                    kampanya ve benzeri amaçlı kullanılan (mikro) web sitelerinden ve sosyal medyadan elde edilen 
                    veriler, e-bülten okuma veya tıklama hareketleri, kamuya açık veri tabanlarının sunduğu veriler, 
                    sosyal medya platformları (Facebook, Twitter, Google, Instagram, Snapchat vs) gibi sosyal paylaşım 
                    sitelerinden paylaşıma açık profil ve verilerden;
                  <br />
                  işlenebilmekte ve toplanabilmektedir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  5. Kişisel Verilerin Saklanması Ve Korunması
                </Heading>
                <Text>
                  Mahalleci, kişisel verilerinizin barındığı sistemleri ve veri tabanlarını, KVKK'nun 12. Maddesi 
                  gereği kişisel verilerin hukuka aykırı olarak işlenmesini önlemekle, yetkisiz kişilerin erişimlerini 
                  engellemekle; muhafazalarını sağlamak amacıyla hash, şifreleme, işlem kaydı, erişim yönetimi gibi 
                  yazılımsal tedbirleri ve fiziksel güvenlik önlemleri almakla mükelleftir. Kişisel verilerin yasal 
                  olmayan yollarla başkaları tarafından elde edilmesinin öğrenilmesi halinde durum derhal, yasal 
                  düzenlemeye uygun ve yazılı olarak Kişisel Verileri Koruma Kurulu'na bildirilecektir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  6. Kişisel Verilerin Güncel Ve Doğru Tutulması
                </Heading>
                <Text>
                  KVKK'nun 4. maddesi uyarınca Mahalleci'nin kişisel verilerinizi doğru ve güncel olarak tutma 
                  yükümlülüğü bulunmaktadır. Bu kapsamda Mahalleci'nin yürürlükteki mevzuattan doğan yükümlülüklerini 
                  yerine getirebilmesi için üyelerimizin doğru ve güncel verilerini paylaşması veya web sitesi/mobil 
                  uygulama üzerinden güncellemesi gerekmektedir.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  7. KVKK Kapsamındaki Haklarınız
                </Heading>
                <Text>
                  6698 sayılı KVKK 11.maddesi uyarınca sahip olduğunuz haklar:
                </Text>
                <Text mt={2}>
                  • Kişisel veri işlenip işlenmediğini öğrenme
                  <br />
                  • Kişisel verileri işlenmişse buna ilişkin bilgi talep etme
                  <br />
                  • Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
                  <br />
                  • Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme
                  <br />
                  • Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme
                  <br />
                  • KVKK'nun 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok 
                    edilmesini isteme
                  <br />
                  • Kişisel verilerin düzeltilmesi, silinmesi, yok edilmesi halinde bu işlemlerin, kişisel verilerin 
                    aktarıldığı üçüncü kişilere de bildirilmesini isteme
                  <br />
                  • İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin 
                    kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme
                  <br />
                  • Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın 
                    giderilmesini talep etme
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={4}>
                  8. İletişim ve Başvuru Yöntemi
                </Heading>
                <Text>
                  Mahalleci tarafından atanacak Veri Sorumlusu Temsilcisi, yasal altyapı sağlandığında Veri 
                  Sorumluları Sicilinde ve bu belgenin bulunduğu internet adresinde ilan edilecektir.
                </Text>
                <Text mt={4}>
                  Kişisel Veri Sahipleri, sorularını, görüşlerini veya taleplerini info@mahalleci.com e-posta 
                  adresine yöneltebilirler.
                </Text>
                <Text mt={4}>
                  Mahalleci iletilen taleplere, gerekçeli olmak ve 30 gün içinde cevap vermek kaydıyla olumlu/olumsuz 
                  yanıtını, yazılı veya dijital ortamdan verebilir. Taleplere ilişkin gerekli işlemlerin ücretsiz 
                  olması esastır. Ancak işlemlerin bir maliyet gerektirmesi halinde, Mahalleci, ücret talebinde 
                  bulunma hakkını saklı tutar. Bu ücretler, Kişisel Verilerin Korunması Kurulu tarafından, Kişisel 
                  Verilerin korunması Kanunu'nun 13. maddesine göre belirlenen tarife üzerinden belirlenir.
                </Text>
              </Box>

              <Box>
                <Text>
                  Web sayfamızda, uygulamalarımızda ve diğer sair kanallarımızda kişisel verilerinizi paylaşarak 
                  Kişisel Veriler Politikamızı ve politikamızda yer alan işlenme, işlenme yöntemleri, verilerin 
                  aktarılması ve diğer ilgili hususlar hakkındaki şartları, Mahalleci platformu ile paylaşılan 
                  verilerin web sayfasında, uygulamalarda ve sosyal medya kanallarında kullanılmasını, bildirimlerde 
                  ve önerilerde bulunulmasını, üyelerin yararına olması şartıyla ticari anlamda üçüncü kişilerle 
                  paylaşılabileceğini ve yine bunun için kabulde bulunduğunuzu, yasal haklarınızı kullanmadan önce 
                  Mahalleci'ye başvuruda bulunacağınızı KVKK'da büyük öneme haiz, belirli bir konuya ilişkin, 
                  bilgilendirilmeye dayanan ve özgür iradeyle açıklanan rıza şeklinde tanımlanan açık bir rıza ile 
                  kabul ettiğinizi beyan etmiş olursunuz.
                </Text>
              </Box>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default PrivacyPolicy; 