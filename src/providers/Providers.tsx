import { ChakraProvider } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

import { Loading } from '@/components';
import { theme } from '@/config';

import { ModalsProvider } from './ModalsProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={client}>
      <ChakraProvider theme={theme}>
        <Suspense fallback={<Loading full />}>
          <BrowserRouter>
            <ModalsProvider />
            {children}
          </BrowserRouter>
        </Suspense>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
