import {
  ArrowDownIcon,
  ArrowUpIcon,
  DragHandleIcon,
  StarIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Table as ChakraTable,
  TableProps as ChakraTableProps,
  Flex,
  HStack,
  Tbody,
  Td,
  Text,
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

import { useBoolean, useToast } from '@/hooks';
import { Expand, User } from '@/types';

import { ChallengeModal, LadderTabContainer } from '../';
import {
  useLeaderboard,
  useMyChallenges,
  useRules,
  useUpdateLeaderboard,
} from '../../api';
import { useLadderStore } from '../../stores';
import { ExpandedParticipant, Ladder, Participant } from '../../types';
import { hasOutboundChallengesRemaining } from '../../utils';

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

  const handleUp = (index: number) => {
    setProposed(moveParticipantUp(proposed, index));
  };

  const handleDown = (index: number) => {
    setProposed(moveParticipantDown(proposed, index));
  };

  const columns = [
    columnHelper.accessor('rank', {
      cell: (info) => info.row.index + 1,
      header: 'Rank',
    }),
    columnHelper.accessor('expand.primaryPlayer.name', {
      cell: (info) => {
        const isMe = info.row.original.id === myParticipantId;

        return isMe ? (
          <Text fontWeight="bold">{info.getValue()}</Text>
        ) : (
          info.getValue()
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
        if (!rules || !myChallenges || !myParticipantId) return;

        const rowRank = info.row.index + 1;

        const isMe = info.row.original.id === myParticipantId;
        const rankDiff =
          typeof myParticipantRank === 'number' &&
          Math.abs(rowRank - myParticipantRank);
        const permittedRange = rules?.challengeRange || 3;
        const isWithinRange = rankDiff <= permittedRange;
        const alreadyChallenged =
          !isMe &&
          myChallenges?.some(
            (challenge) =>
              challenge.challenger === info.row.original.id ||
              challenge.challengee === info.row.original.id
          );
        const isOutboundChallengesRemaining = hasOutboundChallengesRemaining(
          rules,
          myChallenges,
          myParticipantId
        );

        const canChallenge =
          myParticipantId && !isMe && isWithinRange && !alreadyChallenged;
        const isLadderRunning = ladder.status === 'running';

        return (
          <HStack justify="flex-end">
            {alreadyChallenged && !isEditing && (
              <Button size="sm" leftIcon={<StarIcon />} disabled={true}>
                Challenged!
              </Button>
            )}
            {isLadderRunning && canChallenge && !isEditing && (
              <ChallengeModal
                ladder={ladder}
                participant={info.row.original}
                disabled={!isOutboundChallengesRemaining}
                tooltip={
                  !isOutboundChallengesRemaining
                    ? 'No more outbound challenges remaining.'
                    : ''
                }
              />
            )}
            {isAdmin && isEditing && (
              <Button
                size="sm"
                leftIcon={<ArrowUpIcon />}
                onClick={() => handleUp(info.row.index)}
              >
                Up
              </Button>
            )}
            {isAdmin && isEditing && (
              <Button
                size="sm"
                leftIcon={<ArrowDownIcon />}
                onClick={() => handleDown(info.row.index)}
              >
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
      <Box overflowX="auto">
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
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const meta: any = cell.column.columnDef.meta;
                  return (
                    <Td key={cell.id} isNumeric={meta?.isNumeric}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </ChakraTable>
      </Box>
    );
  };

  if (!leaderboard) return null;

  return (
    <LadderTabContainer title="Ladder">
      <Box>
        {isAdmin && (
          <HStack mb={4}>
            <Button
              onClick={handleEdit}
              colorScheme="blue"
              isLoading={isLoading}
            >
              {isEditing ? 'Confirm Changes' : 'Edit Rankings'}
            </Button>
            {isEditing && (
              <Button onClick={handleCancel} isLoading={isLoading}>
                Cancel
              </Button>
            )}
          </HStack>
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
    </LadderTabContainer>
  );
};

const moveParticipantUp = (
  currentBoard: ExpandedParticipant[],
  index: number
) => {
  if (index === 0) return currentBoard;

  const participantToMoveDown = currentBoard[index - 1];

  const copyBoard = [...currentBoard];
  copyBoard.splice(index - 1, 1);
  copyBoard.splice(index, 0, participantToMoveDown);

  return copyBoard;
};

const moveParticipantDown = (
  currentBoard: ExpandedParticipant[],
  index: number
) => {
  if (index === currentBoard.length - 1) return currentBoard;

  const participantToMoveUp = currentBoard[index + 1];

  const copyBoard = [...currentBoard];
  copyBoard.splice(index + 1, 1);
  copyBoard.splice(index, 0, participantToMoveUp);

  return copyBoard;
};
