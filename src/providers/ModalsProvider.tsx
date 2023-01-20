import React from 'react';

import { ChallengeViewModal } from '@/features/ladders';

interface ModalsProviderProps {}

export const ModalsProvider = ({}: ModalsProviderProps) => {
  return (
    <>
      <ChallengeViewModal />
    </>
  );
};
