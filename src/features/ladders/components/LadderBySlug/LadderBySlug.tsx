import {
  Badge,
  Box,
  Flex,
  HStack,
  Heading,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';

import {
  Ladder,
  LadderChallenges,
  LadderDetails,
  LadderMatches,
  LadderSettings,
  Leaderboard,
  ParticipantsList,
  RegisterButton,
  useParticipants,
} from '@/features/ladders';

export interface LadderBySlugProps {
  ladder: Ladder;
}

export const LadderBySlug = ({ ladder }: LadderBySlugProps) => {
  const { data: participants } = useParticipants(ladder.slug);

  return (
    <div>
      <Box>
        <Flex justify="space-between" py={6}>
          <Flex align="center">
            <Heading>{ladder.name}</Heading>
            {ladder.isRegistrationOpen && (
              <Badge ml={4} colorScheme="green">
                Registration Open
              </Badge>
            )}
          </Flex>
          <RegisterButton slug={ladder.slug} ladderId={ladder.id} />
        </Flex>
        <StatGroup>
          <Stat>
            <StatLabel>Start Date</StatLabel>
            <StatNumber fontSize="md">
              {dayjs(ladder.startDate).format('MMMM D, YYYY h:mm A')}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>End Date</StatLabel>
            <StatNumber fontSize="md">
              {dayjs(ladder.endDate).format('MMMM D, YYYY h:mm A')}
            </StatNumber>
          </Stat>
        </StatGroup>
        <Tabs variant="soft-rounded" py={6}>
          <TabList>
            <Tab>Ladder</Tab>
            <Tab>Matches</Tab>
            <Tab>Challenges</Tab>
            <Tab>Participants</Tab>
            <Tab>Details</Tab>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Leaderboard ladder={ladder} />
            </TabPanel>
            <TabPanel>
              <LadderMatches ladder={ladder} />
            </TabPanel>
            <TabPanel>
              <LadderChallenges ladder={ladder} />
            </TabPanel>
            <TabPanel>
              <ParticipantsList slug={ladder.slug} />
            </TabPanel>
            <TabPanel>
              <LadderDetails ladder={ladder} />
            </TabPanel>
            <TabPanel>
              <LadderSettings ladder={ladder} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
};
