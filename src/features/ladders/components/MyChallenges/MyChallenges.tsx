import {
  Box,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Highlight,
  LinkBox,
  LinkOverlay,
  Tag,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import {
  ChallengeViewModal,
  Ladder,
  useLadderStore,
  useMyChallenges,
} from '@/features/ladders';
import { client } from '@/libs/client';

export interface MyChallengesProps {
  ladder: Ladder;
}

export const MyChallenges = ({ ladder }: MyChallengesProps) => {
  const navigate = useNavigate();
  const { myParticipantId } = useLadderStore();

  const { data: challenges } = useMyChallenges({
    ladderId: ladder.id,
    myParticipantId,
  });

  return (
    <Box mt={6}>
      <ChallengeViewModal ladder={ladder} />
      <Heading size="md" mb={2}>
        Your Challenges
      </Heading>
      <HStack>
        {challenges?.map((challenge) => {
          const challenger = challenge.expand.challenger;
          const challengee = challenge.expand.challengee;

          const challengerName = challenger.expand.primaryPlayer.name;
          const challengeeName = challengee.expand.primaryPlayer.name;

          const myName = client.authStore.model?.name;

          return (
            <LinkBox key={challenge.id} cursor="pointer">
              <Card
                variant="outline"
                size="sm"
                _hover={{
                  boxShadow: '2px 3px 4px #eaeaea',
                }}
              >
                <CardHeader>
                  <LinkOverlay
                    onClick={() => {
                      navigate({
                        pathname: `/ladders/${ladder.slug}/my-challenges`,
                        search: createSearchParams({
                          challengeId: challenge.id,
                        }).toString(),
                      });
                    }}
                  >
                    <Heading size="md">
                      <Highlight
                        query={myName}
                        styles={{
                          bg: 'yellow.100',
                        }}
                      >
                        {`${challengerName} challenges ${challengeeName}`}
                      </Highlight>
                    </Heading>
                  </LinkOverlay>
                </CardHeader>
                <CardBody>
                  <Text>
                    <b>Issued: </b>
                    {dayjs(challenge.created).fromNow()}
                  </Text>
                  <Text>
                    <b>Deadline: </b>
                    {dayjs(challenge.created).add(7, 'day').fromNow()}
                  </Text>
                  <Tag
                    colorScheme={
                      challenge.status === 'completed'
                        ? 'green'
                        : challenge.status === 'accepted'
                        ? 'blue'
                        : 'orange'
                    }
                    textTransform="capitalize"
                  >
                    {challenge.status}
                  </Tag>
                </CardBody>
              </Card>
            </LinkBox>
          );
        })}
      </HStack>
    </Box>
  );
};
