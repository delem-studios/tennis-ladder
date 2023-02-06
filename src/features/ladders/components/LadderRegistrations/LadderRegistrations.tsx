import { Button, HStack, Select } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

import { DataTable, Loading } from '@/components';
import {
  ExpandedRegistration,
  Ladder,
  LadderTabContainer,
  RegistrationStatus,
  useRegistrations,
  useUpdateRegistration,
} from '@/features/ladders';
import { useBoolean, usePagination } from '@/hooks';
import { capitalize } from '@/utils/strings';

const columnHelper = createColumnHelper<ExpandedRegistration>();

export interface LadderRegistrationsProps {
  ladder: Ladder;
}

export const LadderRegistrations = ({ ladder }: LadderRegistrationsProps) => {
  const { page, perPage } = usePagination();
  const registrations = useRegistrations({
    ladderId: ladder.id,
    page,
    perPage,
  });
  const { mutate: acceptRegistration } = useUpdateRegistration();
  const { state: isLoading, setState: setIsLoading } = useBoolean();

  const handleUpdateRegistration = (
    registration: ExpandedRegistration,
    status: RegistrationStatus
  ) => {
    setIsLoading(true);

    acceptRegistration(
      {
        ladderId: ladder.id,
        registration: {
          ...registration,
          status,
        },
      },
      {
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const columns = [
    columnHelper.accessor('expand.primaryPlayer.name', {
      cell: (info) => info.getValue(),
      header: 'Name',
    }),
    columnHelper.accessor('expand.primaryPlayer.email', {
      cell: (info) => info.getValue(),
      header: 'Email',
    }),
    columnHelper.accessor('expand.primaryPlayer.phone', {
      cell: (info) => info.getValue(),
      header: 'Phone',
    }),
    columnHelper.accessor('status', {
      cell: (info) => {
        return (
          <Select
            value={info.row.original.status}
            onChange={(e) =>
              handleUpdateRegistration(
                info.row.original,
                e.target.value as RegistrationStatus
              )
            }
            size="sm"
          >
            {['pending', 'accepted', 'rejected'].map((value) => (
              <option value={value} key={value}>
                {capitalize(value)}
              </option>
            ))}
          </Select>
        );
      },
      header: 'Actions',
    }),
  ];

  if (registrations.isLoading) return <Loading />;
  if (registrations.isError || !registrations.data)
    return <>Something went wrong.</>;

  return (
    <LadderTabContainer title="Registrations">
      <DataTable columns={columns} data={registrations.data.items} size="sm" />
    </LadderTabContainer>
  );
};
