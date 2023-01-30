import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Loading, MainLayout } from '@/components';

import { useLadderBySlug } from '../api';
import { LadderBySlug } from '../components';
import { useLadderStore } from '../stores';

interface LadderPageProps {}

export const LadderPage = ({}: LadderPageProps) => {
  const { ladderSlug } = useParams();
  const { data: ladder } = useLadderBySlug(ladderSlug as string);
  const { setField } = useLadderStore();

  useEffect(() => {
    if (ladder) {
      setField('ladder', ladder);
    }

    return () => {
      setField('ladder', null);
    };
  }, [ladder]);

  return (
    <MainLayout container>
      {!ladder ? <Loading /> : <LadderBySlug ladder={ladder} />}
    </MainLayout>
  );
};
