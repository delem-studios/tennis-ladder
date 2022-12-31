import { Container } from '@chakra-ui/react';
import React from 'react';

import { MainLayout } from '@/components';
import { LadderForm } from '@/features/ladders';

export interface LadderCreatePageProps {}

export const LadderCreatePage = ({}: LadderCreatePageProps) => {
  return (
    <MainLayout container>
      <LadderForm />
    </MainLayout>
  );
};
