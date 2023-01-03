import { Box, Container } from '@chakra-ui/react';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box bgColor="white" height="100%">
      <Container>{children}</Container>
    </Box>
  );
};
