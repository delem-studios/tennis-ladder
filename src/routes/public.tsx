import { Navigate } from 'react-router-dom';

import { lazyImport } from '@/utils/lazyImport';

const { LadderCreatePage } = lazyImport(
  () => import('@/features/ladders'),
  'LadderCreatePage'
);
const { LadderPage } = lazyImport(
  () => import('@/features/ladders'),
  'LadderPage'
);
const { LaddersPage } = lazyImport(
  () => import('@/features/ladders'),
  'LaddersPage'
);

const { HomePage } = lazyImport(
  () => import('@/features/miscellaneous'),
  'HomePage'
);
const { LoginPage } = lazyImport(
  () => import('@/features/miscellaneous'),
  'LoginPage'
);
const { LogoutPage } = lazyImport(
  () => import('@/features/miscellaneous'),
  'LogoutPage'
);
const { RegisterPage } = lazyImport(
  () => import('@/features/miscellaneous'),
  'RegisterPage'
);

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
  {
    path: '/ladders/:ladderSlug',
    element: <Navigate to="overview" />,
  },
  { path: '/ladders/:ladderSlug/:tabSlug/*', element: <LadderPage /> },
  { path: '/ladders/create', element: <LadderCreatePage /> },
];
