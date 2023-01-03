import { Heading } from '@chakra-ui/react';
import React from 'react';

import { AuthLayout } from '@/components';
import { LoginForm } from '@/features/miscellaneous';

export interface LoginPageProps {}

export const LoginPage = ({}: LoginPageProps) => {
  return (
    <AuthLayout>
      <Heading>Login</Heading>
      <LoginForm />
    </AuthLayout>
  );
};
