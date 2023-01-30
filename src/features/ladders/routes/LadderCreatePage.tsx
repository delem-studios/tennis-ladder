import React from 'react';

import { MainLayout } from '@/components';

import { LadderForm } from '../components';

export interface LadderCreatePageProps {}

export const LadderCreatePage = ({}: LadderCreatePageProps) => {
  return (
    <MainLayout container>
      <LadderForm />
    </MainLayout>
  );
};
