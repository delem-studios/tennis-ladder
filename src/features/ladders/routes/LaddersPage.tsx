import { Button, Heading } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '@/components/Layout';

export const LaddersPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Heading size="xl">Ladders</Heading>
      <Button onClick={() => navigate('/ladders/create')}>Create</Button>
    </MainLayout>
  );
};
