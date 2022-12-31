import { Spinner } from '@chakra-ui/react';
import React from 'react';

export interface LoadingProps {}

export const Loading = ({}: LoadingProps) => {
  return <Spinner />;
};
