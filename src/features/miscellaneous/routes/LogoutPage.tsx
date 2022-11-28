import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { client } from '@/libs/client';

export interface LogoutPageProps {}

export const LogoutPage = ({}: LogoutPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    client.authStore.clear();
    navigate('/');
  }, []);

  return null;
};
