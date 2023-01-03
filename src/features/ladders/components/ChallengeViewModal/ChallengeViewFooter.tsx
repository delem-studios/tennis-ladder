import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  HStack,
  IconButton,
  ModalFooter,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Challenge,
  useChallengeById,
  useDeleteChallenge,
  useLadderStore,
  useUpdateChallenge,
} from '@/features/ladders';
import { useBoolean, useToast } from '@/hooks';

interface ChallengeViewFooterProps {
  isChallenger: boolean;
  handleClose: () => void;
}

export const ChallengeViewFooter = ({
  isChallenger,
  handleClose,
}: ChallengeViewFooterProps) => {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const { data: challenge } = useChallengeById({
    challengeId: searchParams.get('challengeId'),
  });
  const { acceptDate } = useLadderStore();
  const { state: isLoading, setState: setIsLoading } = useBoolean();
  const { mutate: deleteChallenge } = useDeleteChallenge();
  const { mutate: updateChallenge } = useUpdateChallenge();

  const handleUpdate = (updateFields: Partial<Challenge>) => {
    if (!challengeId || !challenge) return;

    setIsLoading(true);

    updateChallenge(
      { ...challenge, ...updateFields },
      {
        onSuccess: () => {},
        onError: () => {
          toast({ title: 'Unable to update challenge.', status: 'error' });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!challengeId) return;

    setIsLoading(true);

    deleteChallenge(challengeId, {
      onSuccess: () => {
        toast({ title: 'Challenge deleted.' });
        handleClose();
      },
      onError: () => {
        toast({ title: 'Unable to delete challenge.', status: 'error' });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  const isAccepted = challenge?.status === 'accepted';
  const isPending = challenge?.status === 'pending';

  return (
    <ModalFooter justifyContent="flex-end">
      {isChallenger && isPending && (
        <Flex flex={1}>
          <Tooltip label="Delete challenge" aria-label="Delete challenge">
            <IconButton
              aria-label="Delete this challenge"
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="ghost"
              onClick={handleDelete}
              isLoading={isLoading}
            />
          </Tooltip>
        </Flex>
      )}
      <HStack>
        <Button colorScheme="red" variant="ghost" isLoading={isLoading}>
          Decline
        </Button>
        <Tooltip
          label={
            isAccepted ? '' : acceptDate ? '' : 'Please select a date first.'
          }
        >
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            disabled={acceptDate === '' || isAccepted}
            onClick={() => handleUpdate({ status: 'accepted' })}
          >
            {isAccepted ? 'Accepted!' : 'Accept'}
          </Button>
        </Tooltip>
      </HStack>
    </ModalFooter>
  );
};
