import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useLadderStore } from '@/features/ladders';
import { client } from '@/libs/client';

export interface LogoutPageProps {}

export const LogoutPage = ({}: LogoutPageProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { reset } = useLadderStore();

  useEffect(() => {
    void queryClient.invalidateQueries();
    void queryClient.resetQueries();
    client.authStore.clear();
    navigate('/');
    reset();
  }, []);

  return null;
};
