import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

export interface InfoProps {
  label: ReactNode;
  content: ReactNode;
}

export const Info = ({ label, content }: InfoProps) => {
  return (
    <Stat>
      <StatLabel>{label}</StatLabel>
      <StatNumber fontSize="md">{content}</StatNumber>
    </Stat>
  );
};
