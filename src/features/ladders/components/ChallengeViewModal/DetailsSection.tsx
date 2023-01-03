import { Box, HStack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';

import {
  ExpandedChallenge,
  ExpandedLeaderboard,
  useLadderStore,
} from '@/features/ladders';

import { Section } from './Section';

interface DetailsSectionProps {
  challenge: ExpandedChallenge;
  leaderboard: ExpandedLeaderboard;
}

export const DetailsSection = ({
  challenge,
  leaderboard,
}: DetailsSectionProps) => {
  const { myParticipantId, myParticipantRank } = useLadderStore();

  const challenger = challenge.expand.challenger;
  const challengee = challenge.expand.challengee;

  const isChallenger = myParticipantId === challenger.id;

  const opponent = isChallenger ? challengee : challenger;
  const myOpponentTeamId = opponent.id;
  const myOpponentIndex =
    (leaderboard?.expand.leaderboard &&
      leaderboard?.expand.leaderboard.length &&
      leaderboard?.expand.leaderboard.findIndex(
        (participant) => participant.id === myOpponentTeamId
      )) ||
    0;
  const myOpponentRank = myOpponentIndex + 1;

  return (
    <Section title="Details">
      <HStack gap={2}>
        {challenge.proposedDates.map((date, index) => (
          <Box
            key={`date-${index}`}
            bgColor="gray.100"
            p={2}
            borderRadius={4}
            flex={1}
          >
            <Text fontWeight="400" fontSize="sm">
              Proposed Date {index + 1}
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {dayjs(date).format('dddd, MMMM D')}
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {dayjs(date).format('h:mm A')}
            </Text>
          </Box>
        ))}
      </HStack>
      <Text>Status: {challenge.status}</Text>
      {myParticipantRank !== null && (
        <Box>
          <Text>Your Current Rank: {myParticipantRank}</Text>
          <Text>Your Opponent Rank: {myOpponentRank}</Text>

          <Text>
            If you win this match, your new rank would be{' '}
            <b>{Math.min(myParticipantRank, myOpponentRank)}</b>.
          </Text>
        </Box>
      )}
    </Section>
  );
};
