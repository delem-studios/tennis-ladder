import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loading, MainLayout } from '@/components';
import { useToast } from '@/hooks';

import { useLadderBySlug } from '../api';
import { LadderBySlug } from '../components';
import { useLadderStore } from '../stores';

interface LadderPageProps {}

export const LadderPage = ({}: LadderPageProps) => {
  const { ladderSlug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const ladder = useLadderBySlug(ladderSlug as string);
  const { setField } = useLadderStore();

  useEffect(() => {
    if (ladder.data) {
      setField('ladder', ladder.data);
    }

    if (ladder.error) {
      if (ladder.error.status === 404) {
        navigate('/ladders');
        toast({ title: 'Ladder does not exist.', status: 'error' });
      }
    }

    return () => {
      setField('ladder', null);
    };
  }, [ladder.data, ladder.error]);

  return (
    <MainLayout container>
      {ladder.isLoading && <Loading />}
      {ladder.data && <LadderBySlug ladder={ladder.data} />}
    </MainLayout>
  );
};
