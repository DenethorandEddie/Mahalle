import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { AppProps } from 'next/app';
import '../styles/global.css';

// Create a client for React Query
const queryClient = new QueryClient();

// Extend Chakra UI theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#fff5e6',
      100: '#ffe0b3',
      200: '#ffcc80',
      300: '#ffb84d',
      400: '#ffa31a',
      500: '#ff8c00',
      600: '#e67300',
      700: '#cc6600',
      800: '#b35900',
      900: '#994d00',
    },
  },
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

// Prevent getInitialProps error
MyApp.getInitialProps = async ({ Component, ctx }: any) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};

export default MyApp; 