import { HStack, Text } from '@chakra-ui/react';
import React from 'react';

import { LadderTabContainer, PendingChallenge } from '../';
import { useMyChallenges } from '../../api';
import { useLadderStore } from '../../stores';
import { Ladder } from '../../types';

export interface MyChallengesProps {
  ladder: Ladder;
}

export const MyChallenges = ({ ladder }: MyChallengesProps) => {
  const { myParticipantId } = useLadderStore();

  console.log('myParticipantId:', myParticipantId);

  const { data: challenges } = useMyChallenges({
    ladderId: ladder.id,
    myParticipantId,
  });

  console.log('challenges:', challenges);

  return (
    <LadderTabContainer title="Your Challenges">
      {challenges?.length === 0 && (
        <Text>You have no challenges at this time.</Text>
      )}
      <HStack>
        {challenges?.map((challenge) => (
          <PendingChallenge
            key={challenge.id}
            ladder={ladder}
            challenge={challenge}
          />
        ))}
      </HStack>
    </LadderTabContainer>
  );
};
