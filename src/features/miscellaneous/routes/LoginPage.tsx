import React from 'react';

import { AuthLayout } from '@/components';
import { LoginForm } from '@/features/miscellaneous';

export interface LoginPageProps {}

export const LoginPage = ({}: LoginPageProps) => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
