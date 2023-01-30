import React from 'react';

import { LadderTabContainer, ParticipantsList } from '../';
import { Ladder } from '../../types';

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
