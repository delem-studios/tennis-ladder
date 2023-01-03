import { ArrowDownIcon, ArrowUpIcon, DragHandleIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Table as ChakraTable,
  TableProps as ChakraTableProps,
  Flex,
  HStack,
  Highlight,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useRef, useState } from 'react';

import {
  ChallengeModal,
  ExpandedParticipant,
  Ladder,
  Participant,
  useLadderStore,
  useLeaderboard,
  useMyChallenges,
  useRules,
  useUpdateLeaderboard,
} from '@/features/ladders';
import { useBoolean, useToast } from '@/hooks';
import { Expand, User } from '@/types';

const columnHelper =
  createColumnHelper<Expand<Participant, { primaryPlayer: User }>>();

export interface LeaderboardProps {
  ladder: Ladder;
  isAdmin: boolean;
}

export const LeaderboardView = ({ ladder, isAdmin }: LeaderboardProps) => {
  const toast = useToast();
  const { data: leaderboard } = useLeaderboard(ladder.id);
  const { data: rules } = useRules(ladder.id);
  const { myParticipantRank, myParticipantId } = useLadderStore();
  const { data: myChallenges } = useMyChallenges({
    myParticipantId,
    ladderId: ladder.id,
  });

  const { mutate: updateLeaderboard } = useUpdateLeaderboard();

  const { state: isEditing, setState: setIsEditing } = useBoolean();
  const { state: isLoading, setState: setIsLoading } = useBoolean();
  const [proposed, setProposed] = useState<Array<ExpandedParticipant>>([]);

  const handleEdit = () => {
    if (!leaderboard) return;

    if (!isEditing) {
      setProposed(leaderboard.expand.leaderboard);
      return setIsEditing(true);
    }

    if (isEditing) {
      setIsLoading(true);
      updateLeaderboard(
        {
          ...leaderboard,
          leaderboard: proposed.map((participant) => participant.id),
        },
        {
          onSuccess: () => {
            toast({ title: 'Updated successfully!' });
            setIsEditing(false);
          },
          onError: () => {
            toast({ title: 'Unable to update at this time.', status: 'error' });
          },
          onSettled: () => {
            setIsLoading(false);
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProposed([]);
  };

  const columns = [
    columnHelper.accessor('rank', {
      cell: (info) => info.row.index + 1,
      header: 'Rank',
    }),
    columnHelper.accessor('expand.primaryPlayer.name', {
      cell: (info) => {
        const isMe =
          typeof myParticipantRank === 'number' &&
          info.row.index === myParticipantRank - 1;

        return (
          <Highlight query={isMe ? info.getValue() : ''}>
            {info.getValue()}
          </Highlight>
        );
      },
      header: 'Name',
    }),
    columnHelper.accessor('wins', {
      cell: (info) => <Box flex={1}>{info.getValue()}</Box>,
      header: 'Wins',
    }),
    columnHelper.accessor('losses', {
      cell: (info) => <Box flex={1}>{info.getValue()}</Box>,
      header: 'Losses',
    }),
    columnHelper.display({
      header: 'Actions',
      cell: (info) => {
        const rowRank = info.row.index + 1;
        const isMe =
          typeof myParticipantRank === 'number' &&
          info.row.index === myParticipantRank - 1;
        const rankDiff =
          typeof myParticipantRank === 'number' &&
          Math.abs(rowRank - myParticipantRank);
        const permittedRange = rules?.challengeRange || 3;
        const isWithinRange = rankDiff <= permittedRange;
        const alreadyChallenged = myChallenges?.some(
          (challenge) =>
            challenge.challenger === info.row.original.id ||
            challenge.challengee === info.row.original.id
        );

        const canChallenge = !isMe && isWithinRange && !alreadyChallenged;

        return (
          <HStack justify="flex-end">
            {canChallenge && !isEditing && (
              <ChallengeModal ladder={ladder} participant={info.row.original} />
            )}
            {isAdmin && isEditing && (
              <Button size="sm" leftIcon={<ArrowUpIcon />}>
                Up
              </Button>
            )}
            {isAdmin && isEditing && (
              <Button size="sm" leftIcon={<ArrowDownIcon />}>
                Down
              </Button>
            )}
          </HStack>
        );
      },
    }),
  ];

  const DataTable = <Data extends object>({
    columns,
    data,
    ...rest
  }: {
    data?: Array<Data>;
    columns: ColumnDef<Data, any>[];
  } & ChakraTableProps) => {
    const table = useReactTable({
      columns: isEditing
        ? ([
            columnHelper.display({
              header: 'Drag',
              cell: (info) => (
                <Box
                  flex={1}
                  cursor="grab"
                  draggable={isEditing}
                  onDragStart={(e) => dragStart(e, info.row.index)}
                  onDragEnter={(e) => dragEnter(e, info.row.index)}
                  onDragEnd={drop}
                >
                  <DragHandleIcon />
                </Box>
              ),
            }),
            ...columns,
          ] as ColumnDef<Data, any>[])
        : columns,
      data: data || [],
      getCoreRowModel: getCoreRowModel(),
    });
    const dragItem = useRef<null | number>(null);
    const dragOverItem = useRef<null | number>(null);

    const dragStart = (e: any, position: any) => {
      dragItem.current = position;
      console.log(e.target.innerHTML);
    };

    const dragEnter = (e: any, position: any) => {
      dragOverItem.current = position;
      console.log(e.target.innerHTML);
    };

    const drop = () => {
      if (dragItem.current === null) return;
      if (dragOverItem.current === null) return;

      const copyListItems = [...proposed];
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setProposed(copyListItems);
    };

    return (
      <ChakraTable {...rest}>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta;
                return (
                  <Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    isNumeric={meta?.isNumeric}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row, index) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = cell.column.columnDef.meta;
                return (
                  <Td key={cell.id} isNumeric={meta?.isNumeric}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    );
  };

  if (!leaderboard) return null;

  return (
    <Box>
      {isAdmin && (
        <Flex mb={4}>
          <Button onClick={handleEdit} colorScheme="blue" isLoading={isLoading}>
            {isEditing ? 'Confirm Changes' : 'Edit Rankings'}
          </Button>
          {isEditing && (
            <Button onClick={handleCancel} isLoading={isLoading}>
              Cancel
            </Button>
          )}
        </Flex>
      )}
      <DataTable
        columns={columns}
        data={isEditing ? proposed : leaderboard.expand.leaderboard}
        size="sm"
        sx={{
          'td:nth-child(1)': {
            width: '1px',
          },
          'td:last-child': {
            width: '1px',
          },
        }}
      />
    </Box>
  );
};