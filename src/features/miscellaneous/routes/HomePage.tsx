import { Button } from '@chakra-ui/react';
import React from 'react';

import { MainLayout } from '@/components';

interface HomePageProps {}

export const HomePage = ({}: HomePageProps) => {
  return (
    <MainLayout>
      <Button>Test Me</Button>
    </MainLayout>
  );
};
