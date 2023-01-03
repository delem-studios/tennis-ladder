import { Box, Container } from '@chakra-ui/react';
import React from 'react';

import { Topbar } from './Topbar';

export interface MainLayoutProps {
  container?: boolean;
  children: React.ReactNode;
}

export const MainLayout = ({ container, children }: MainLayoutProps) => {
  return (
    <Box height="100%" width="100%" overflowX="hidden">
      <Topbar />
      {container ? (
        <Container
          bgColor="white"
          minHeight="calc(100% - 64px)"
          maxW={{
            base: 'container.sm',
            sm: 'container.md',
            md: 'container.lg',
          }}
        >
          {children}
        </Container>
      ) : (
        <Box>{children}</Box>
      )}
    </Box>
  );
};
