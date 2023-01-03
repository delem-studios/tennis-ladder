import { Box, BoxProps, Divider, Heading } from '@chakra-ui/react';
import React from 'react';

export const Section = ({
  title,
  divider,
  children,
  ...rest
}: {
  title: string;
  divider?: boolean;
  children: React.ReactNode;
} & BoxProps) => (
  <Box mb={6} {...rest}>
    <Heading size="md" mb={2}>
      {title}
    </Heading>
    {children}
    {divider && <Divider pt={2} />}
  </Box>
);
