import { Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';

export interface LadderTabContainerProps {
  title: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

export const LadderTabContainer = ({
  title,
  extra,
  children,
}: LadderTabContainerProps) => {
  return (
    <Box mt={2}>
      <Flex>
        <Heading size="xl" mb={6} flex={1}>
          {title}
        </Heading>
        <Box ml={4}>{extra}</Box>
      </Flex>
      {children}
    </Box>
  );
};
