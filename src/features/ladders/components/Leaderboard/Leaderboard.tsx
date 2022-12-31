import { Button } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

import { DataTable } from '@/components';
import {
  Ladder,
  Participant,
  useParticipants,
  useRules,
} from '@/features/ladders';
import { client } from '@/libs/client';
import { Expand, User } from '@/types';

const columnHelper =
  createColumnHelper<Expand<Participant, { primaryPlayer: User }>>();

export interface LeaderboardProps {
  ladder: Ladder;
}

export const Leaderboard = ({ ladder }: LeaderboardProps) => {
  const { data: participants } = useParticipants(ladder.id);
  const { data: rules } = useRules(ladder.id);

  const myId = client.authStore.model?.id;
  const myTeam = participants?.find(
    (participant) =>
      participant.primaryPlayer === myId || participant.secondaryPlayer === myId
  );
  const myRank = myTeam?.rank;

  const columns = [
    columnHelper.accessor('expand.primaryPlayer.name', {
      cell: (info) => info.getValue(),
      header: 'Name',
    }),
    columnHelper.accessor('rank', {
      cell: (info) => info.getValue(),
      header: 'Rank',
    }),
    columnHelper.display({
      header: 'Actions',
      cell: (info) => {
        const rowRank = info.row.original.rank;
        const isMe = myRank === rowRank;
        const rankDiff = rowRank && myRank && Math.abs(rowRank - myRank);
        const permittedRange = rules?.challengeRange;
        const isWithinRange =
          rankDiff && permittedRange && rankDiff <= permittedRange;

        console.log('rankDiff:', rankDiff);

        const canChallenge = !isMe && isWithinRange;

        return canChallenge && <Button>Challenge</Button>;
      },
    }),
  ];

  return <DataTable columns={columns} data={participants} />;
};
