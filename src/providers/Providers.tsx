import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

import { theme } from '@/config';

import { ModalsProvider } from './ModalsProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <ModalsProvider />
          {children}
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
