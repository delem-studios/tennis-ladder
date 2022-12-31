import { Button } from '@chakra-ui/react';
import React from 'react';

import { useParticipants, useRegisterForLadder } from '@/features/ladders';
import { useBoolean, useToast } from '@/hooks';
import { client } from '@/libs/client';

export interface RegisterButtonProps {
  ladderId: string;
}

export const RegisterButton = ({ ladderId }: RegisterButtonProps) => {
  const toast = useToast();
  const { state: loading, setState: setLoading } = useBoolean();

  const { data } = useParticipants(ladderId);
  const { mutate: register } = useRegisterForLadder();

  const userId = client.authStore.model?.id;
  const isRegistered =
    userId &&
    data?.some((participant) => {
      if (userId === participant.primaryPlayer) return true;
      if (userId === participant.secondaryPlayer) return true;

      return false;
    });

  const handleRegister = () => {
    setLoading(true);

    register(ladderId, {
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
