import { Providers } from '@/providers/Providers';
import { AppRoutes } from '@/routes/routes';
import React from 'react';

interface AppProps {}

export const App = ({}: AppProps) => {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
};
