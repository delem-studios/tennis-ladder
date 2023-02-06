import { CloseIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { AiOutlineUser } from 'react-icons/all';

import { useParticipants } from '@/features/ladders';
import { formatPhoneNumber } from '@/utils/strings';

import { LadderTabContainer } from '../';
import { Ladder } from '../../types';

export interface LadderParticipantsProps {
  ladder: Ladder;
}

export const LadderParticipants = ({ ladder }: LadderParticipantsProps) => {
  const { data: participants } = useParticipants(ladder.id);
  const [search, setSearch] = useState('');

  return (
    <LadderTabContainer
      title="Participants"
      extra={
        <InputGroup>
          <Input
            value={search}
            placeholder="Search participants"
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <InputRightElement>
              <IconButton
                aria-label="Clear search"
                icon={<CloseIcon height="0.75rem" />}
                size="sm"
                variant="ghost"
                onClick={() => setSearch('')}
              />
            </InputRightElement>
          )}
        </InputGroup>
      }
    >
      <VStack align="flex-start" spacing={4} width="100%" divider={<Divider />}>
        {participants?.length === 0 && <Text>No participants yet.</Text>}
        {participants
          ?.filter((participant) => {
            if (!search) return true;
            const loweredSearch = search.toLowerCase();

            return (
              participant.expand.primaryPlayer.name
                .toLowerCase()
                .includes(loweredSearch) ||
              (participant.expand.secondaryPlayer &&
                participant.expand.secondaryPlayer.name
                  .toLowerCase()
                  .includes(loweredSearch))
            );
          })
          .map((participant) => (
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
                  <Text alignItems="center" display="flex">
                    <EmailIcon color="gray.400" mr={2} />
                    {participant.expand.primaryPlayer.email}
                  </Text>
                  <Text alignItems="center" display="flex">
                    <PhoneIcon color="gray.400" mr={2} fontSize="14px" />
                    {formatPhoneNumber(participant.expand.primaryPlayer.phone)}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          ))}
      </VStack>
    </LadderTabContainer>
  );
};
