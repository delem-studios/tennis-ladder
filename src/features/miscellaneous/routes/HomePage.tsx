import { MainLayout } from '@/components';
import { Button } from '@chakra-ui/react';
import React from 'react';

interface HomePageProps {}

export const HomePage = ({}: HomePageProps) => {
  return (
    <MainLayout>
      <Button>Test Me</Button>
    </MainLayout>
  );
};
