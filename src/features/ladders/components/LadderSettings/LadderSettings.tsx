import {
  Box,
  Container,
  Flex,
  Input,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AlertConfirmDialog } from '@/components';
import {
  Ladder,
  LadderStatus,
  LadderTabContainer,
  useDeleteLadder,
  useUpdateLadder,
} from '@/features/ladders';
import { useBoolean, useToast } from '@/hooks';

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
  const navigate = useNavigate();
  const toast = useToast();
  const { state: loading, setState: setLoading } = useBoolean();
  const { mutate: updateLadder } = useUpdateLadder();
  const { mutate: deleteLadder } = useDeleteLadder();

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

  const handleDelete = () => {
    setLoading(true);

    deleteLadder(ladder.id, {
      onSuccess: () => {
        toast({ title: 'Ladder deleted successfully!' });
        navigate('/ladders');
      },
      onError: () => {
        toast({ title: 'Unable to delete ladder.', status: 'error' });
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <Container>
      <LadderTabContainer title="Settings">
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
            title="Ladder Status"
            help="Change the status of the ladder."
          >
            <Select
              onChange={(e) =>
                handleUpdate({ status: e.target.value as LadderStatus })
              }
            >
              <option value="draft">Draft</option>
              <option value="registration">Registration</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
            </Select>
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
          <SettingsItem title="Delete" help="Delete this ladder.">
            <AlertConfirmDialog
              header="Delete Ladder"
              buttonText="Delete"
              onConfirm={handleDelete}
            />
          </SettingsItem>
        </VStack>
      </LadderTabContainer>
    </Container>
  );
};
