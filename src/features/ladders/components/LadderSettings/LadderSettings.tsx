import { CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AlertConfirmDialog, Loading } from '@/components';
import { useBoolean, useToast } from '@/hooks';

import { LadderTabContainer } from '../';
import {
  useDeleteLadder,
  useRules,
  useUpdateLadder,
  useUpdateRules,
} from '../../api';
import { Ladder, LadderStatus, Rules } from '../../types';

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
  const { data: rules, isLoading: isRulesLoading } = useRules(ladder.id);
  const { mutate: updateLadder } = useUpdateLadder();
  const { mutate: deleteLadder } = useDeleteLadder();
  const { mutate: updateRules } = useUpdateRules();

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

  const handleUpdateRules = (partialUpdate: Partial<Rules>) => {
    if (!rules) return;

    setLoading(true);

    updateRules(
      { ...rules, ...partialUpdate },
      {
        onError: () => {
          toast({ title: 'Unable to update rules.', status: 'error' });
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  if (isRulesLoading) return <Loading />;

  return (
    <Container p={0}>
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
              value={ladder.status}
            >
              <option value="draft">Draft</option>
              <option value="registration">Registration</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
            </Select>
          </SettingsItem>
          <SettingsItem
            title="Registration Code"
            help="Code required to register for the ladder."
          >
            <HStack>
              <Text bgColor="gray.100" px={2} fontFamily="mono">
                {ladder.registrationCode}
              </Text>
              <Tooltip label="Copy registration code to clipboard">
                <IconButton
                  aria-label="Copy registration code to clipboard"
                  icon={<CopyIcon />}
                  onClick={async () => {
                    if (!ladder.registrationCode) return;
                    await navigator.clipboard.writeText(
                      ladder.registrationCode
                    );
                    toast({ title: 'Copied to clipboard!' });
                  }}
                  size="sm"
                  variant="ghost"
                />
              </Tooltip>
            </HStack>
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

          <SettingsItem
            title="Challenge Range"
            help="The rank differential limit players can challenge."
          >
            <Input
              type="number"
              defaultValue={rules?.challengeRange}
              min={1}
              onBlur={(e) => {
                const newRange = parseInt(e.target.value);
                if (newRange < 1) return;
                handleUpdateRules({ challengeRange: newRange });
              }}
              isDisabled={loading}
            />
          </SettingsItem>
          <SettingsItem
            title="Outbound Challenge Limit"
            help="The number of outgoing challenges a participant may have at a given time."
          >
            <Input
              type="number"
              defaultValue={rules?.outboundChallengeLimit}
              min={1}
              onBlur={(e) => {
                const newValue = parseInt(e.target.value);
                if (newValue < 1) return;
                handleUpdateRules({ outboundChallengeLimit: newValue });
              }}
              isDisabled={loading}
            />
          </SettingsItem>
          <SettingsItem
            title="Inbound Challenge Limit"
            help="The number of incoming challenges a participant may have at a given time."
          >
            <Input
              type="number"
              defaultValue={rules?.inboundChallengeLimit}
              min={1}
              onBlur={(e) => {
                const newValue = parseInt(e.target.value);
                if (newValue < 1) return;
                handleUpdateRules({ inboundChallengeLimit: newValue });
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
