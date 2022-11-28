import { Navigate } from 'react-router-dom';

import { LadderCreatePage, LaddersPage } from '@/features/ladders';
import {
  HomePage,
  LoginPage,
  LogoutPage,
  RegisterPage,
} from '@/features/miscellaneous';

export const publicRoutes = [
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  { path: '/home', element: <HomePage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/logout', element: <LogoutPage /> },
  { path: '/ladders', element: <LaddersPage /> },
  { path: '/ladders/create', element: <LadderCreatePage /> },
];
