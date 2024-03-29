import React from 'react';

import { AuthLayout, Link } from '@/components';

import { RegisterForm } from '../components';

export interface RegisterPageProps {}

export const RegisterPage = ({}: RegisterPageProps) => {
  return (
    <AuthLayout>
      <Link to="/home">Go Back</Link>
      <RegisterForm />
    </AuthLayout>
  );
};
