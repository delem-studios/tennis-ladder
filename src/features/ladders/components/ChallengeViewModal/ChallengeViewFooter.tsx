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
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useBoolean, useToast } from '@/hooks';

import {
  useChallengeById,
  useCreateMatch,
  useDeleteChallenge,
  useUpdateChallenge,
} from '../../api';
import { useLadderStore } from '../../stores';
import { Challenge, Ladder } from '../../types';

interface ChallengeViewFooterProps {
  isChallenger: boolean;
  handleClose: () => void;
  ladder?: Ladder | null;
}

export const ChallengeViewFooter = ({
  isChallenger,
  handleClose,
  ladder,
}: ChallengeViewFooterProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const { data: challenge } = useChallengeById({
    challengeId: searchParams.get('challengeId'),
  });
  const { acceptDate, score, winner, loser, retired } = useLadderStore();
  const { state: isLoading, setState: setIsLoading } = useBoolean();
  const { mutate: deleteChallenge } = useDeleteChallenge();
  const { mutate: updateChallenge } = useUpdateChallenge();
  const { mutate: createMatch } = useCreateMatch();

  const handleUpdate = (updateFields: Partial<Challenge>) => {
    if (!challengeId || !challenge) return;

    setIsLoading(true);

    updateChallenge(
      { ...challenge, ...updateFields },
      {
        onSuccess: () => {
          toast({ title: 'Challenge updated!' });
        },
        onError: () => {
          toast({ title: 'Unable to update challenge.', status: 'error' });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const handleSubmitMatch = () => {
    if (!challengeId || !challenge || !winner || !loser || !ladder) return;

    setIsLoading(true);

    const didChallengerWin = winner === challenge.challenger;

    let submitScore: Array<Array<string>>;
    if (!didChallengerWin) {
      submitScore = score.map((set) => [set[1], set[0]]);
    } else {
      submitScore = score;
    }

    createMatch(
      {
        score: submitScore,
        winner,
        loser,
        ladder: ladder.id,
        challenge: challenge.id,
        date: challenge.acceptedDate,
        isForfeit: Boolean(retired),
      },
      {
        onSuccess: () => {
          navigate(`/ladders/${ladder.slug}/my-challenges`);
          toast({ title: 'Match submitted. Thank you!' });
        },
        onError: () => {
          toast({ title: 'Unable to submit scores.', status: 'error' });
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
        {isPending && !isChallenger && (
          <Button colorScheme="red" variant="ghost" isLoading={isLoading}>
            Decline
          </Button>
        )}
        {isPending && !isChallenger && (
          <Tooltip label={acceptDate ? '' : 'Please select a date first.'}>
            <Button
              colorScheme="blue"
              isLoading={isLoading}
              disabled={acceptDate === ''}
              onClick={() =>
                handleUpdate({ status: 'accepted', acceptedDate: acceptDate })
              }
            >
              Accept
            </Button>
          </Tooltip>
        )}
        {isAccepted && (
          <Tooltip
            label={!winner || !loser ? 'Please record the scores first.' : ''}
          >
            <Button
              colorScheme="blue"
              isLoading={isLoading}
              onClick={handleSubmitMatch}
              disabled={!winner || !loser}
            >
              Submit
            </Button>
          </Tooltip>
        )}
      </HStack>
    </ModalFooter>
  );
};
