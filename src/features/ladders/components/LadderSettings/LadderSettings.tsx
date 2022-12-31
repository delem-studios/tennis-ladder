import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Input,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';

import { Ladder, useUpdateLadder } from '@/features/ladders';
import { useBoolean, useToast } from '@/hooks';
import { client } from '@/libs/client';

const SettingsItem = ({
  title,
  help,
  children,
}: {
  title: React.ReactNode;
  help?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Flex align="center" justify="space-between" w="100%">
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        {help && <Text color="grey">{help}</Text>}
      </Box>
      <Box>{children}</Box>
    </Flex>
  );
};

export interface LadderSettingsProps {
  ladder: Ladder;
}

export const LadderSettings = ({ ladder }: LadderSettingsProps) => {
  const toast = useToast();
  const { state: loading, setState: setLoading } = useBoolean();
  const { mutate: updateLadder } = useUpdateLadder();

  const handleUpdate = (partialUpdate: Partial<Ladder>) => {
    setLoading(true);

    const updatedLadder = { ...ladder, ...partialUpdate };

    updateLadder(updatedLadder, {
      onError: (error) => {
        toast({ title: 'Oops! Unable to update the ladder.', status: 'error' });
        console.error(error);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <Container>
      <VStack spacing={4}>
        <SettingsItem
          title="Ladder Name"
          help="Provide a suitable name for your ladder."
        >
          <Input
            defaultValue={ladder.name}
            onBlur={(e) => handleUpdate({ name: e.target.value.trim() })}
          />
        </SettingsItem>
        <SettingsItem
          title="Toggle Registration"
          help="Open or close the registration."
        >
          <Button
            disabled={ladder.isStarted}
            onClick={() =>
              handleUpdate({ isStarted: true, isRegistrationOpen: false })
            }
          >
            Start
          </Button>
        </SettingsItem>
        <SettingsItem
          title="Toggle Registration"
          help="Open or close the registration."
        >
          <Switch
            checked={ladder.isStarted ? false : ladder.isRegistrationOpen}
            onChange={(e) =>
              handleUpdate({ isRegistrationOpen: e.target.checked })
            }
            isDisabled={loading || ladder.isStarted}
          />
        </SettingsItem>
        <SettingsItem title="Start Date" help="Set the ladder start date.">
          <Input
            type="datetime-local"
            defaultValue={ladder.startDate.slice(0, 16)}
            max={dayjs(ladder.endDate).format('YYYY-MM-DDThh:mm')}
            onBlur={(e) => {
              handleUpdate({ startDate: dayjs(e.target.value).format() });
            }}
            isDisabled={loading}
          />
        </SettingsItem>
        <SettingsItem title="End Date" help="Set the ladder end date.">
          <Input
            type="datetime-local"
            defaultValue={ladder.endDate.slice(0, 16)}
            min={dayjs(ladder.startDate).format('YYYY-MM-DDThh:mm')}
            onBlur={(e) => {
              handleUpdate({ endDate: dayjs(e.target.value).format() });
            }}
            isDisabled={loading}
          />
        </SettingsItem>
      </VStack>
    </Container>
  );
};
