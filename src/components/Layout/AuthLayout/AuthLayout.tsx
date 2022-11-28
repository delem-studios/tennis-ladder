import { Box } from '@chakra-ui/react';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <Box>{children}</Box>;
};
