import { Topbar } from './Topbar';
// import { Navbar } from './Navbar';
import { Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box height="100%" width="100%">
      {/*<Box width="250px" bgColor="purple.50">*/}
      {/*  <Heading fontWeight="black">Ladder</Heading>*/}
      {/*  <Navbar />*/}
      {/*</Box>*/}
      <Topbar />
      <Box>{children}</Box>
    </Box>
  );
};
