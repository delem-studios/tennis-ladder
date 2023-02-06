import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { REGISTRATION_CODE_LENGTH } from '@/config';
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
  const { state: isOpen, setState: setIsOpen } = useBoolean();
  const [registrationCode, setRegistrationCode] = useState('');
  const userId = client.authStore.model?.id;

  const { mutate: register } = useRegisterForLadder();
  const registration = useRegistrationById({ ladderId: ladder.id, userId });

  const isRegistered = userId && registration.isSuccess && registration.data;

  const handleRegister = () => {
    if (!userId) return;

    setLoading(true);

    register(
      { ladder: ladder.id, primaryPlayer: userId, registrationCode },
      {
        onSuccess: () => {
          toast({ title: 'Registered successfully!' });
          setIsOpen(false);
        },
        onError: () => {
          toast({
            title: 'Registration code is not correct.',
            status: 'error',
          });
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  if (!userId) return null;

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={Boolean(isRegistered)}>
        {isRegistered ? 'Registered!' : 'Register'}
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Please provide the registration code. If you do not have the code,
              please ask the ladder organizer for the code.
            </Text>
            <Input
              placeholder="Please enter registration code."
              value={registrationCode}
              onChange={(e) => setRegistrationCode(e.target.value)}
              mt={4}
            />
          </ModalBody>
          <ModalFooter>
            <Stack direction="row">
              <Button isLoading={loading}>Cancel</Button>
              <Button
                disabled={
                  !registrationCode ||
                  registrationCode.length !== REGISTRATION_CODE_LENGTH
                }
                onClick={handleRegister}
                colorScheme="blue"
                isLoading={loading}
              >
                Register
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
