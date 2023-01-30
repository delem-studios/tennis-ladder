import { Text } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import React from 'react';

import { DataTable } from '@/components';

import { LadderTabContainer } from '../';
import { useMatches } from '../../api';
import { ExpandedMatch, Ladder } from '../../types';

const columnHelper = createColumnHelper<ExpandedMatch>();

export interface LadderMatchesProps {
  ladder: Ladder;
}

export const LadderMatches = ({ ladder }: LadderMatchesProps) => {
  const { data: matches } = useMatches({
    ladderId: ladder.id,
    page: 1,
    perPage: 10,
  });

  const columns = [
    columnHelper.accessor('date', {
      cell: (info) => dayjs(info.getValue()).format('MMMM D, YYYY h:mm A'),
      header: 'Date',
    }),
    columnHelper.accessor('expand.winner.expand.primaryPlayer.name', {
      cell: (info) => info.getValue(),
      header: 'Winner',
    }),
    columnHelper.accessor('expand.loser.expand.primaryPlayer.name', {
      cell: (info) => info.getValue(),
      header: 'Loser',
    }),
    columnHelper.accessor('score', {
      cell: (info) => {
        const isRetired = info.row.original.isForfeit;
        const scoreString = info
          .getValue()
          .filter((set) => set[0] !== '' && set[1] !== '')
          .map((set) => set.join('-'))
          .join(', ');
        const scoreStringLength = scoreString.length;

        if (scoreStringLength === 0 && isRetired) {
          return 'Retired';
        } else if (isRetired) {
          return scoreString + ' - Retired';
        } else {
          return scoreString;
        }
      },
      header: 'Score',
    }),
  ];

  return (
    <LadderTabContainer title="Matches">
      {matches?.items.length === 0 && <Text>No matches yet.</Text>}
      {matches?.items.length ? (
        <DataTable columns={columns} data={matches?.items} />
      ) : null}
    </LadderTabContainer>
  );
};
