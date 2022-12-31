import React from 'react';
import { useParams } from 'react-router-dom';

import { Loading, MainLayout } from '@/components';
import { LadderBySlug, useLadderBySlug } from '@/features/ladders';

interface LadderPageProps {}

export const LadderPage = ({}: LadderPageProps) => {
  const { ladderSlug } = useParams();
  const { data: ladder } = useLadderBySlug(ladderSlug as string);

  return (
    <MainLayout container>
      {!ladder ? <Loading /> : <LadderBySlug ladder={ladder} />}
    </MainLayout>
  );
};
