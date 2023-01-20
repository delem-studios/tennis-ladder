import React from 'react';

import {
  Ladder,
  LadderTabContainer,
  ParticipantsList,
} from '@/features/ladders';

export interface LadderParticipantsProps {
  ladder: Ladder;
}

export const LadderParticipants = ({ ladder }: LadderParticipantsProps) => {
  return (
    <LadderTabContainer title="Participants">
      <ParticipantsList ladderId={ladder.id} />
    </LadderTabContainer>
  );
};
