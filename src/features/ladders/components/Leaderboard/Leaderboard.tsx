import { Button } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

import { DataTable } from '@/components';
import { Ladder, useParticipants } from '@/features/ladders';

const columnHelper = createColumnHelper<Ladder>();

export interface LeaderboardProps {
  ladder: Ladder;
}

export const Leaderboard = ({ ladder }: LeaderboardProps) => {
  const { data } = useParticipants(ladder.slug);

  const columns = [
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
      header: 'Name',
    }),
    columnHelper.accessor('description', {
      cell: (info) => info.getValue(),
      header: 'Description',
    }),
    columnHelper.accessor('isRegistrationOpen', {
      cell: (info) => (info.getValue() ? 'Open' : 'Closed'),
      header: 'Registration',
    }),
  ];

  return <DataTable columns={columns} />;
};
