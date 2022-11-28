import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ChakraProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ChakraProvider>
  );
};
