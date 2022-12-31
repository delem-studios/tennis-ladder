import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlineUser } from 'react-icons/all';

import { useParticipants } from '@/features/ladders';

export interface ParticipantsListProps {
  slug: string;
}

export const ParticipantsList = ({ slug }: ParticipantsListProps) => {
  const { data: participants } = useParticipants(slug);

  return (
    <VStack align="flex-start">
      {participants?.map((participant) => (
        <Flex
          flex="1"
          gap="4"
          alignItems="center"
          flexWrap="wrap"
          key={participant.id}
        >
          <Avatar
            icon={<AiOutlineUser fontSize="1.5rem" />}
            name={participant.expand.primaryPlayer.name}
            src={participant.expand.primaryPlayer.avatar}
          />

          <Box>
            <Heading size="sm">{participant.expand.primaryPlayer.name}</Heading>
            <Text>{participant.expand.primaryPlayer.email}</Text>
          </Box>
        </Flex>
      ))}
    </VStack>
  );
};
