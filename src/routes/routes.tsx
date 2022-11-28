import React from 'react';
import { useRoutes } from 'react-router-dom';

// import { protectedRoutes } from "./protected";
import { publicRoutes } from './public';

export const AppRoutes = () => {
  // console.log("window.location.hash:", window.location.hash);
  // const auth = useAuth();

  // const commonRoutes = [{ path: "/", element: <Landing /> }];

  // const routes = auth.user ? protectedRoutes : publicRoutes;

  // const element = useRoutes([...routes, ...commonRoutes]);

  return useRoutes([...publicRoutes]);
};
