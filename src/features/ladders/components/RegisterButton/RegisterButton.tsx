import { Button } from '@chakra-ui/react';
import React from 'react';

import {
  Ladder,
  useParticipants,
  useRegisterForLadder,
} from '@/features/ladders';
import { useBoolean, useToast } from '@/hooks';
import { client } from '@/libs/client';

export interface RegisterButtonProps {
  ladder: Ladder;
}

export const RegisterButton = ({ ladder }: RegisterButtonProps) => {
  const toast = useToast();
  const { state: loading, setState: setLoading } = useBoolean();

  const { data: participants } = useParticipants(ladder.id);
  const { mutate: register } = useRegisterForLadder();

  const userId = client.authStore.model?.id;
  const isRegistered =
    userId &&
    participants?.some((participant) => {
      if (userId === participant.primaryPlayer) return true;
      if (userId === participant.secondaryPlayer) return true;

      return false;
    });

  const handleRegister = () => {
    setLoading(true);

    register(ladder.id, {
      onSuccess: () => {
        toast({ title: 'Registered successfully!' });
      },
      onError: () => {
        toast({ title: 'Unable to register at this time.', status: 'error' });
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <Button
      onClick={handleRegister}
      isLoading={loading}
      disabled={Boolean(isRegistered)}
    >
      {isRegistered ? 'Registered!' : 'Register'}
    </Button>
  );
};
