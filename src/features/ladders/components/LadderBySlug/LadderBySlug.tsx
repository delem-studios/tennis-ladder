import {
  Badge,
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
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import shallow from 'zustand/shallow';

import {
  Ladder,
  LadderDetails,
  LadderMatches,
  LadderParticipants,
  LadderSettings,
  LeaderboardView,
  MyChallenges,
  RegisterButton,
  useLadderStore,
  useLeaderboard,
} from '@/features/ladders';
import { client } from '@/libs/client';

export interface LadderBySlugProps {
  ladder: Ladder;
}

export const LadderBySlug = ({ ladder }: LadderBySlugProps) => {
  const navigate = useNavigate();
  const { tabSlug } = useParams();

  const { data: leaderboard, isLoading: isLeaderboardLoading } = useLeaderboard(
    ladder.id
  );

  const { ladderId, setFields } = useLadderStore((state) => state, shallow);

  const userId = client.authStore.model?.id;
  const isAdmin = Boolean(
    userId && ladder.organizers.some((organizer) => organizer === userId)
  );

  useEffect(() => {
    if (!leaderboard || isLeaderboardLoading) return;

    if (ladderId !== ladder.id) {
      const myId = client.authStore.model?.id;
      const myTeamIndex =
        (leaderboard?.expand.leaderboard &&
          leaderboard?.expand.leaderboard.length &&
          leaderboard?.expand.leaderboard.findIndex(
            (participant) =>
              participant.primaryPlayer === myId ||
              participant.secondaryPlayer === myId
          )) ||
        0;
      const myTeamId = leaderboard?.leaderboard[myTeamIndex];

      setFields({
        ladderId,
        myParticipantId: myTeamId,
        myParticipantRank: myTeamIndex + 1,
      });
    }
  }, [ladder.id, leaderboard]);

  const tabs = [
    {
      name: 'Ladder',
      slug: 'overview',
      Component: <LeaderboardView ladder={ladder} isAdmin={isAdmin} />,
      visible: true,
    },
    {
      name: 'My Challenges',
      slug: 'my-challenges',
      Component: <MyChallenges ladder={ladder} />,
      visible: true,
    },
    {
      name: 'Matches',
      slug: 'matches',
      Component: <LadderMatches ladder={ladder} />,
      visible: true,
    },
    {
      name: 'Participants',
      slug: 'participants',
      Component: <LadderParticipants ladder={ladder} />,
      visible: true,
    },
    {
      name: 'Details',
      slug: 'details',
      Component: <LadderDetails ladder={ladder} />,
      visible: true,
    },
    {
      name: 'Settings',
      slug: 'settings',
      Component: <LadderSettings ladder={ladder} />,
      visible: isAdmin,
    },
  ];
  const tabIndex = tabs.findIndex((tab) => tab.slug === tabSlug);

  return (
    <Box>
      <Flex justify="space-between" py={6}>
        <Heading alignItems="center" mr={4}>
          {ladder.name}
        </Heading>
        {ladder.status === 'registration' && <RegisterButton ladder={ladder} />}
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
        <Stat>
          <StatLabel>Format</StatLabel>
          <StatNumber fontSize="md" textTransform="capitalize">
            {ladder.format}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Status</StatLabel>
          <Badge
            colorScheme={
              ladder.status === 'registration'
                ? 'green'
                : ladder.status === 'running'
                ? 'blue'
                : 'gray'
            }
            textTransform="uppercase"
          >
            {ladder.status === 'registration'
              ? 'Registration Open'
              : ladder.status}
          </Badge>
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
          {tabs.map((tab) => {
            if (!tab.visible) return null;

            return <Tab key={`tab-menu-${tab.slug}`}>{tab.name}</Tab>;
          })}
        </TabList>
        <TabPanels>
          {tabs.map((tab) => {
            if (!tab.visible) return null;

            return (
              <TabPanel key={`tab-component-${tab.slug}`}>
                {tab.Component}
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
