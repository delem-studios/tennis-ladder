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
import React, { Suspense, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import shallow from 'zustand/shallow';

import { Loading } from '@/components';
import { LadderRegistrations } from '@/features/ladders';
import { client } from '@/libs/client';
import { lazyImport } from '@/utils/lazyImport';

import { useLeaderboard } from '../../api';
import { useLadderStore } from '../../stores';
import { Ladder } from '../../types';

const { LadderDetails } = lazyImport(() => import('../'), 'LadderDetails');
const { LadderMatches } = lazyImport(() => import('../'), 'LadderMatches');
const { LadderParticipants } = lazyImport(
  () => import('../'),
  'LadderParticipants'
);
const { LadderSettings } = lazyImport(() => import('../'), 'LadderSettings');
const { LeaderboardView } = lazyImport(() => import('../'), 'LeaderboardView');
const { MyChallenges } = lazyImport(
  () => import('../MyChallenges'),
  'MyChallenges'
);
const { RegisterButton } = lazyImport(() => import('../'), 'RegisterButton');

export interface LadderBySlugProps {
  ladder: Ladder;
}

export const LadderBySlug = ({ ladder }: LadderBySlugProps) => {
  const navigate = useNavigate();
  const { tabSlug } = useParams();

  const { data: leaderboard, isLoading: isLeaderboardLoading } = useLeaderboard(
    ladder.id
  );

  const { ladderId, setFields, isParticipating } = useLadderStore(
    (state) => state,
    shallow
  );

  const userId = client.authStore.model?.id;
  const isAdmin = Boolean(
    userId && ladder.organizers.some((organizer) => organizer === userId)
  );

  useEffect(() => {
    if (!leaderboard || isLeaderboardLoading) return;

    if (ladderId !== ladder.id) {
      const myId = client.authStore.model?.id;
      const isParticipating = Boolean(
        leaderboard?.expand.leaderboard &&
          leaderboard?.expand.leaderboard.length &&
          leaderboard?.expand.leaderboard.some(
            (participant) =>
              participant.primaryPlayer === myId ||
              participant.secondaryPlayer === myId
          )
      );

      const myTeamIndex =
        (leaderboard?.expand.leaderboard &&
          leaderboard?.expand.leaderboard.length &&
          leaderboard?.expand.leaderboard.findIndex(
            (participant) =>
              participant.primaryPlayer === myId ||
              participant.secondaryPlayer === myId
          )) ??
        -1;

      const myTeamId = leaderboard?.leaderboard[myTeamIndex];

      setFields({
        ladderId,
        myParticipantId: myTeamId,
        myParticipantRank: myTeamIndex + 1,
        isParticipating,
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
      visible: isParticipating,
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
      name: 'Registrations',
      slug: 'registrations',
      Component: <LadderRegistrations ladder={ladder} />,
      visible: isAdmin,
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
      <Box px={4}>
        <Flex justify="space-between" py={6}>
          <Heading size="2xl" alignItems="center" mr={4}>
            {ladder.name}
          </Heading>
          {ladder.status === 'registration' && (
            <RegisterButton ladder={ladder} />
          )}
        </Flex>
        <StatGroup gap={4}>
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
      </Box>
      <Tabs
        variant="soft-rounded"
        index={tabIndex}
        py={6}
        onChange={(tabIndex) => {
          navigate(`/ladders/${ladder.slug}/${tabs[tabIndex].slug}`);
        }}
        isLazy
      >
        <TabList
          justifyContent="flex-start"
          maxWidth="100%"
          overflowX="auto"
          py={2}
        >
          {tabs.map((tab) => {
            if (!tab.visible) return null;

            return <Tab key={`tab-menu-${tab.slug}`}>{tab.name}</Tab>;
          })}
        </TabList>
        <Suspense fallback={<Loading />}>
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
        </Suspense>
      </Tabs>
    </Box>
  );
};
