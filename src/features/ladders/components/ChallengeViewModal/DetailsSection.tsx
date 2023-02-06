import { Box, HStack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';

import { useLadderStore } from '../../stores';
import { ExpandedChallenge, ExpandedLeaderboard } from '../../types';
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

  const isPending = challenge.status === 'pending';
  const isAccepted = challenge.status === 'accepted';

  return (
    <Section title="Details">
      {isPending && <ProposedDates challenge={challenge} />}
      {isAccepted && <AcceptedDate challenge={challenge} />}

      {/*<Text>Status: {challenge.status}</Text>*/}
      {myParticipantRank !== null && (
        <Box mt={2}>
          <Text>Your current rank: {myParticipantRank}</Text>
          <Text>Your opponent's rank: {myOpponentRank}</Text>

          <Text>
            If you win this match, your new rank would be{' '}
            <b>{Math.min(myParticipantRank, myOpponentRank)}</b>.
          </Text>
        </Box>
      )}
    </Section>
  );
};

const ProposedDates = ({ challenge }: { challenge: ExpandedChallenge }) => {
  return (
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
  );
};

const AcceptedDate = ({ challenge }: { challenge: ExpandedChallenge }) => {
  return (
    <HStack gap={2}>
      <Box bgColor="gray.100" p={2} borderRadius={4} flex={1}>
        <Text fontWeight="400" fontSize="sm">
          Match Date
        </Text>
        <Text fontWeight="bold" fontSize="lg">
          {dayjs(challenge.acceptedDate).format('dddd, MMMM D')}
        </Text>
        <Text fontWeight="bold" fontSize="lg">
          {dayjs(challenge.acceptedDate).format('h:mm A')}
        </Text>
      </Box>
      <Box flex={1} />
    </HStack>
  );
};
