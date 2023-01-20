import { Text } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

import { DataTable, Loading } from '@/components';
import { ExpandedChallenge, Ladder, useChallenges } from '@/features/ladders';

const columnHelper = createColumnHelper<ExpandedChallenge>();

export interface LadderChallengesProps {
  ladder: Ladder;
}

export const LadderChallenges = ({ ladder }: LadderChallengesProps) => {
  const { data: challenges, isLoading } = useChallenges({
    page: 1,
    perPage: 10,
    ladderId: ladder.id,
  });

  const columns = [
    columnHelper.accessor('expand.challenger.expand.primaryPlayer.name', {
      cell: (info) => info.getValue(),
      header: 'Challenger',
    }),
    columnHelper.accessor('expand.challengee.expand.primaryPlayer.name', {
      cell: (info) => info.getValue(),
      header: 'Challengee',
    }),
    columnHelper.accessor('created', {
      cell: (info) => info.getValue(),
      header: 'Date Issued',
    }),
  ];

  if (isLoading) return <Loading />;
  if (!challenges || !challenges.items.length)
    return <Text>No challenges yet.</Text>;

  return <DataTable columns={columns} data={challenges.items} />;
};
