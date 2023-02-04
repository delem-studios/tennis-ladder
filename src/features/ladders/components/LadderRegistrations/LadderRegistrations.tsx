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
      <DataTable columns={columns} data={registrations.data.items} />

      {/*<Grid templateColumns="repeat(3, 1fr)">*/}
      {/*  <GridItem colSpan={{ base: 3, sm: 2, md: 1 }}>*/}
      {/*    <Heading size="lg" mb={4}>*/}
      {/*      Pending*/}
      {/*    </Heading>*/}
      {/*    {registrations.data.items.map((registration) => {*/}
      {/*      const player = registration.expand.primaryPlayer;*/}

      {/*      return (*/}
      {/*        <Card key={registration.id} variant="outline">*/}
      {/*          <CardHeader>*/}
      {/*            <Heading size="md">{player.name}</Heading>*/}
      {/*          </CardHeader>*/}
      {/*          <CardBody>*/}
      {/*            <Text>*/}
      {/*              <b>Email</b>: {player.email}*/}
      {/*            </Text>*/}
      {/*            <Text>*/}
      {/*              <b>Phone</b>: {player.phone}*/}
      {/*            </Text>*/}
      {/*            <Text>*/}
      {/*              <b>Registered on</b>: {formatDate(registration.created)}*/}
      {/*            </Text>*/}
      {/*          </CardBody>*/}
      {/*          <CardFooter>*/}
      {/*            <Stack direction="row">*/}
      {/*              <Button colorScheme="blue">Accept</Button>*/}
      {/*              <Button colorScheme="red" variant="outline">*/}
      {/*                Reject*/}
      {/*              </Button>*/}
      {/*            </Stack>*/}
      {/*          </CardFooter>*/}
      {/*        </Card>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*  </GridItem>*/}
      {/*</Grid>*/}
    </LadderTabContainer>
  );
};
