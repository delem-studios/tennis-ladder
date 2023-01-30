import { Text } from '@chakra-ui/react';
import React from 'react';

import { ExpandedParticipant } from '../../types';
import { Section } from './Section';

interface OpponentDetailsSectionProps {
  opponent: ExpandedParticipant;
}

export const OpponentDetailsSection = ({
  opponent,
}: OpponentDetailsSectionProps) => {
  return (
    <Section title="Opponent Details">
      <Text>
        <b>Name:</b> {opponent.expand.primaryPlayer.name}
      </Text>
      <Text as="b">Email: </Text>
      <Text as="a" href={`mailto:${opponent.expand.primaryPlayer.email}`}>
        {opponent.expand.primaryPlayer.email}
      </Text>

      <Text>
        <b>Phone:</b> {opponent.expand.primaryPlayer.phone}
      </Text>
    </Section>
  );
};
