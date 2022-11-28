import { Link } from '@/components';
import { RegisterForm } from '@/features/miscellaneous';
import React from 'react';

export interface RegisterPageProps {}

export const RegisterPage = ({}: RegisterPageProps) => {
  return (
    <div>
      <Link to="/home">Go Back</Link>
      <RegisterForm />
    </div>
  );
};
