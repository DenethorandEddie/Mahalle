import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorModeValue,
  useToast,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from 'next/head';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Burada form verilerini işleyebilir veya e-posta gönderebilirsiniz
      // Şimdilik sadece bir başarı mesajı gösterelim
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş gecikme

      toast({
        title: 'Mesajınız iletildi',
        description: 'En kısa sürede size geri dönüş yapacağız.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Formu temizle
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      toast({
        title: 'Bir hata oluştu',
        description: 'Lütfen daha sonra tekrar deneyin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'E-posta',
      content: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
      href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Adres',
      content: 'İstanbul, Türkiye',
    },
  ];

  return (
    <>
      <Head>
        <title>Bize Ulaşın | {process.env.NEXT_PUBLIC_SITE_NAME}</title>
        <meta
          name="description"
          content="Mahalleci ile iletişime geçin. Sorularınız, önerileriniz ve geri bildirimleriniz için bize ulaşın."
        />
      </Head>

      <Box minH="100vh" bg={bgColor}>
        <Header />
        
        <Container maxW="container.lg" py={12}>
          <VStack spacing={12} align="stretch">
            {/* Hero Section */}
            <VStack spacing={6} textAlign="center">
              <Heading as="h1" size="2xl" color={headingColor}>
                Bize Ulaşın
              </Heading>
              <Text fontSize="xl" color={textColor} maxW="2xl" mx="auto">
                Sorularınız, önerileriniz ve geri bildirimleriniz için bizimle iletişime geçebilirsiniz. 
                Size en kısa sürede dönüş yapacağız.
              </Text>
            </VStack>

            {/* Contact Info Cards */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {contactInfo.map((info, index) => (
                <Box
                  key={index}
                  p={8}
                  bg={cardBg}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={borderColor}
                  textAlign="center"
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
                >
                  <VStack spacing={4}>
                    <Icon as={info.icon} boxSize={8} color="orange.500" />
                    <Heading size="md" color={headingColor}>
                      {info.title}
                    </Heading>
                    {info.href ? (
                      <Text
                        as="a"
                        href={info.href}
                        color={textColor}
                        _hover={{ color: 'orange.500' }}
                      >
                        {info.content}
                      </Text>
                    ) : (
                      <Text color={textColor}>{info.content}</Text>
                    )}
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>

            {/* Contact Form */}
            <Box
              as="form"
              onSubmit={handleSubmit}
              p={8}
              bg={cardBg}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
              shadow="sm"
            >
              <VStack spacing={6}>
                <Heading size="lg" color={headingColor}>
                  İletişim Formu
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                  <FormControl isRequired>
                    <FormLabel>Adınız</FormLabel>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Adınız"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>E-posta</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta adresiniz"
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel>Konu</FormLabel>
                  <Input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Mesajınızın konusu"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mesaj</FormLabel>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mesajınız"
                    rows={6}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="orange"
                  size="lg"
                  isLoading={isSubmitting}
                  loadingText="Gönderiliyor..."
                  w={{ base: 'full', md: 'auto' }}
                >
                  Gönder
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Container>

        <Footer />
      </Box>
    </>
  );
};

export default ContactPage; 