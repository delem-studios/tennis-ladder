import { StarIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import React from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  ExpandedParticipant,
  Ladder,
  useCreateChallenge,
  useLadderStore,
} from '@/features/ladders';
import { useBoolean, useToast } from '@/hooks';

const schema = yup.object({
  proposedDates: yup
    .array()
    .of(
      yup.object().shape({
        value: yup
          .date()
          .nullable()
          .transform((curr, orig) => (orig === '' ? null : curr))
          .required('Please provide the proposed date.'),
      })
    )
    .required('Please')
    .min(2),
});

interface ChallengeFormFields {
  proposedDates: Array<{ value: string }>;
}

export interface ChallengeModalProps extends ButtonProps {
  ladder: Ladder;
  participant: ExpandedParticipant;
  tooltip?: string;
}

export const ChallengeModal = ({
  ladder,
  participant,
  tooltip,
  ...rest
}: ChallengeModalProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { state: isLoading, setState: setIsLoading } = useBoolean();
  const { mutate: challenge } = useCreateChallenge();
  const { myParticipantId } = useLadderStore();
  const methods = useForm<ChallengeFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      proposedDates: [{ value: '' }, { value: '' }],
    },
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { fields } = useFieldArray({
    control,
    name: 'proposedDates',
  });

  const onSubmit = (values: ChallengeFormFields) => {
    if (!myParticipantId) return;

    setIsLoading(true);

    challenge(
      {
        ladder: ladder.id,
        challenger: myParticipantId,
        challengee: participant.id,
        proposedDates: values.proposedDates.map((date) => date.value),
      },
      {
        onSuccess: () => {
          toast({ title: 'Challenge sent.' });
          onClose();
        },
        onError: () => {
          toast({
            title: 'Unable to send challenge at this time.',
            status: 'error',
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <>
      {tooltip ? (
        <Tooltip label={tooltip}>
          <Button size="sm" leftIcon={<StarIcon />} onClick={onOpen} {...rest}>
            Challenge
          </Button>
        </Tooltip>
      ) : (
        <Button size="sm" leftIcon={<StarIcon />} onClick={onOpen} {...rest}>
          Challenge
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalContent>
              <ModalHeader>Challenge</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  You are about to challenge{' '}
                  <b>{participant.expand.primaryPlayer.name}</b>.
                </Text>
                <VStack>
                  {fields.map((field, index) => (
                    <FormControl
                      key={field.id}
                      isInvalid={Boolean(
                        errors.proposedDates?.[index]?.value?.message
                      )}
                    >
                      <FormLabel
                        htmlFor={`proposedDates.${index}`}
                      >{`Proposed Date ${index + 1}`}</FormLabel>
                      <Input
                        id={`proposedDates.${index}`}
                        type="datetime-local"
                        min={dayjs().format('YYYY-MM-DDThh:mm')}
                        max={dayjs().add(7, 'days').format('YYYY-MM-DDThh:mm')}
                        {...register(`proposedDates.${index}.value`)}
                      />
                      <FormErrorMessage>
                        {errors.proposedDates?.[index]?.value?.message}
                      </FormErrorMessage>
                    </FormControl>
                  ))}
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                  Challenge
                </Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};
