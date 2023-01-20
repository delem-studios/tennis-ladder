import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

export interface LadderTabContainerProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

export const LadderTabContainer = ({
  title,
  children,
}: LadderTabContainerProps) => {
  return (
    <Box mt={2}>
      <Heading size="lg" mb={6}>
        {title}
      </Heading>
      {children}
    </Box>
  );
};
