import { HomePage, LoginPage, RegisterPage } from '@/features/miscellaneous';
import { Navigate } from 'react-router-dom';

export const publicRoutes = [
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  { path: '/home', element: <HomePage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/login', element: <LoginPage /> },
];
