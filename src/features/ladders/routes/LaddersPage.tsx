import { Button, Flex, Heading } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable, MainLayout } from '@/components';
import { Ladder, useMyLadders } from '@/features/ladders';

const columnHelper = createColumnHelper<Ladder>();

export const LaddersPage = () => {
  const navigate = useNavigate();

  const { data } = useMyLadders();

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
    columnHelper.display({
      id: 'Actions',
      cell: (info) => (
        <Button onClick={() => navigate(`/ladders/${info.row.original.slug}`)}>
          View
        </Button>
      ),
    }),
  ];

  return (
    <MainLayout container>
      <Flex justify="space-between" align="center">
        <Heading size="xl">Ladders</Heading>
        <Button onClick={() => navigate('/ladders/create')}>Create</Button>
      </Flex>
      <DataTable data={data?.items} columns={columns} />
    </MainLayout>
  );
};
