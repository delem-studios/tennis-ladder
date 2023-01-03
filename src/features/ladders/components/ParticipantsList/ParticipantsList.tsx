import { EmailIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlineUser } from 'react-icons/all';

import { useParticipants } from '@/features/ladders';

export interface ParticipantsListProps {
  ladderId: string;
}

export const ParticipantsList = ({ ladderId }: ParticipantsListProps) => {
  const { data: participants } = useParticipants(ladderId);

  return (
    <VStack align="flex-start" spacing={4} width="100%" divider={<Divider />}>
      {participants?.map((participant) => (
        <Flex key={participant.id} justify="space-between" width="100%">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              icon={<AiOutlineUser fontSize="1.5rem" />}
              name={participant.expand.primaryPlayer.name}
              src={participant.expand.primaryPlayer.avatar}
            />

            <Box>
              <Heading size="sm">
                {participant.expand.primaryPlayer.name}
              </Heading>
              <Text>{participant.expand.primaryPlayer.email}</Text>
            </Box>
          </Flex>
          <HStack>
            <IconButton
              icon={<EmailIcon />}
              aria-label={`Email ${participant.expand.primaryPlayer.name}`}
              variant="ghost"
              colorScheme="blue"
            />
          </HStack>
        </Flex>
      ))}
    </VStack>
  );
};
