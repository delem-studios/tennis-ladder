import {
  Box,
  Flex,
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
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Ladder,
  LadderChallenges,
  LadderDetails,
  LadderMatches,
  LadderSettings,
  Leaderboard,
  ParticipantsList,
  RegisterButton,
} from '@/features/ladders';

export interface LadderBySlugProps {
  ladder: Ladder;
}

export const LadderBySlug = ({ ladder }: LadderBySlugProps) => {
  const navigate = useNavigate();
  const { tabSlug } = useParams();

  const tabs = [
    {
      name: 'Ladder',
      slug: 'overview',
      Component: <Leaderboard ladder={ladder} />,
    },
    {
      name: 'Matches',
      slug: 'matches',
      Component: <LadderMatches ladder={ladder} />,
    },
    {
      name: 'Challenges',
      slug: 'challenges',
      Component: <LadderChallenges ladder={ladder} />,
    },
    {
      name: 'Participants',
      slug: 'participants',
      Component: <ParticipantsList ladderId={ladder.id} />,
    },
    {
      name: 'Details',
      slug: 'details',
      Component: <LadderDetails ladder={ladder} />,
    },
    {
      name: 'Settings',
      slug: 'settings',
      Component: <LadderSettings ladder={ladder} />,
    },
  ];
  const tabIndex = tabs.findIndex((tab) => tab.slug === tabSlug);

  return (
    <div>
      <Box>
        <Flex justify="space-between" py={6}>
          <Flex align="center">
            <Heading>{ladder.name}</Heading>
            {ladder.isRegistrationOpen && (
              <Tag ml={4} colorScheme="green">
                Registration Open
              </Tag>
            )}
          </Flex>
          <RegisterButton ladderId={ladder.id} />
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
        <Tabs
          variant="soft-rounded"
          index={tabIndex}
          py={6}
          isLazy
          onChange={(tabIndex) => {
            navigate(`/ladders/${ladder.slug}/${tabs[tabIndex].slug}`);
          }}
        >
          <TabList justifyContent="flex-start">
            {tabs.map((tab) => (
              <Tab key={`tab-menu-${tab.slug}`}>{tab.name}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabs.map((tab) => (
              <TabPanel key={`tab-component-${tab.slug}`}>
                {tab.Component}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
};
