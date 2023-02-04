import { Button } from '@chakra-ui/react';
import React from 'react';

import { useBoolean, useToast } from '@/hooks';
import { client } from '@/libs/client';

import { useRegisterForLadder, useRegistrationById } from '../../api';
import { Ladder } from '../../types';

export interface RegisterButtonProps {
  ladder: Ladder;
}

export const RegisterButton = ({ ladder }: RegisterButtonProps) => {
  const toast = useToast();
  const { state: loading, setState: setLoading } = useBoolean();
  const userId = client.authStore.model?.id;

  const { mutate: register } = useRegisterForLadder();
  const registration = useRegistrationById(userId);

  const isRegistered = userId && registration.isSuccess && registration.data;

  const handleRegister = () => {
    if (!userId) return;

    setLoading(true);

    register(
      { ladder: ladder.id, primaryPlayer: userId },
      {
        onSuccess: () => {
          toast({ title: 'Registered successfully!' });
        },
        onError: () => {
          toast({ title: 'Unable to register at this time.', status: 'error' });
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  if (!userId) return null;

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
