import React from 'react';

import { AuthLayout, Link } from '@/components';
import { RegisterForm } from '@/features/miscellaneous';

export interface RegisterPageProps {}

export const RegisterPage = ({}: RegisterPageProps) => {
  return (
    <AuthLayout>
      <Link to="/home">Go Back</Link>
      <RegisterForm />
    </AuthLayout>
  );
};
