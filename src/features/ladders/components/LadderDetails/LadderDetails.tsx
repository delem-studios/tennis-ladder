import { Box } from '@chakra-ui/react';
import React from 'react';

import { Ladder } from '@/features/ladders';

export interface LadderDetailsProps {
  ladder: Ladder;
}

export const LadderDetails = ({ ladder }: LadderDetailsProps) => {
  return <Box>{ladder.description || 'No details have been provided.'}</Box>;
};
