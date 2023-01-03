import React from 'react';

import '@/libs/dayjs';
import { Providers } from '@/providers/Providers';
import { AppRoutes } from '@/routes/routes';

interface AppProps {}

export const App = ({}: AppProps) => {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
};
