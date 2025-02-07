import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from 'next/head';

const ContactPage = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Mesajınız alındı',
      description: 'En kısa sürede size dönüş yapacağız.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'E-posta',
      info: 'info@mahalleci.com',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Adres',
      info: 'İstanbul, Türkiye',
    }
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      <Head>
        <title>Bize Ulaşın | Mahalleci</title>
        <meta name="description" content="Mahalleci ile iletişime geçin. Sorularınız ve önerileriniz için bize ulaşın." />
      </Head>

      <Header />

      <Container maxW="container.xl" py={20}>
        <VStack spacing={16}>
          {/* Hero Section */}
          <VStack spacing={6} textAlign="center" maxW="container.md">
            <Heading 
              size="2xl" 
              color={headingColor}
              bgGradient="linear(to-r, orange.400, red.500)"
              bgClip="text"
            >
              Bize Ulaşın
            </Heading>
            <Text fontSize="xl" color={textColor} lineHeight="tall">
              Sorularınız, önerileriniz veya geri bildirimleriniz için
              bizimle iletişime geçebilirsiniz.
            </Text>
          </VStack>

          {/* Contact Info Grid */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} width="100%">
            {contactInfo.map((item, index) => (
              <Box
                key={index}
                p={8}
                bg={cardBg}
                borderRadius="xl"
                border="1px solid"
                borderColor={borderColor}
                textAlign="center"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  borderColor: 'orange.400',
                }}
                transition="all 0.3s"
              >
                <VStack spacing={4}>
                  <Icon as={item.icon} boxSize={8} color="orange.400" />
                  <Heading size="md" color={headingColor}>
                    {item.title}
                  </Heading>
                  <Text color={textColor}>
                    {item.info}
                  </Text>
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
            width="100%"
            maxW="container.md"
          >
            <VStack spacing={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="100%">
                <FormControl isRequired>
                  <FormLabel>İsim</FormLabel>
                  <Input placeholder="İsminiz" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>E-posta</FormLabel>
                  <Input type="email" placeholder="E-posta adresiniz" />
                </FormControl>
              </SimpleGrid>
              <FormControl isRequired>
                <FormLabel>Konu</FormLabel>
                <Input placeholder="Mesajınızın konusu" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Mesaj</FormLabel>
                <Textarea
                  placeholder="Mesajınız..."
                  rows={6}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="orange"
                size="lg"
                width={{ base: 'full', md: 'auto' }}
              >
                Gönder
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default ContactPage; 