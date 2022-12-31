import {
  Button,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { ClientResponseError } from 'pocketbase';
import React from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { FormItem } from '@/components';
import { useToast } from '@/hooks';
import { client } from '@/libs/client';

const schema = yup.object({
  name: yup
    .string()
    .required('Please provide a name for your ladder.')
    .min(2, 'Must be at least 2 characters.')
    .max(100, 'Must be at most 100 characters.'),
  description: yup.string().max(10000, 'Must be at most 10000 characters.'),
  maxParticipants: yup
    .number()
    .min(2, 'Must be greater than 1.')
    .max(200, 'Must be at most 200 participants.'),
  startDate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .required('Please provide the start date.'),
  endDate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .required('Please provide the start date.')
    .min(yup.ref('startDate'), 'End date must be after the start date.'),
  format: yup
    .string()
    .oneOf(['singles', 'doubles'])
    .required('Please provide the format.'),
});

export interface LadderFormFields {
  name: string;
  description: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  format: 'singles' | 'doubles';
}

export interface LadderFormProps {}

export const LadderForm = ({}: LadderFormProps) => {
  const toast = useToast();
  const navigate = useNavigate();
  const methods = useForm<LadderFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: dayjs().toISOString().slice(0, 16),
      endDate: dayjs().add(7, 'day').toISOString().slice(0, 16),
      maxParticipants: 100,
      format: 'singles',
    },
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onSubmit: SubmitHandler<LadderFormFields> = async (values) => {
    console.log('Values:', values);

    try {
      const slug = values.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      await client
        .collection('ladders')
        .create({ ...values, slug, organizers: [client.authStore.model?.id] });

      toast({ title: "You've successfully created a new ladder!" });

      navigate('/ladders');
    } catch (error) {
      if (error instanceof ClientResponseError) {
        const { code, data } = error.data;

        if (code === 400) {
          const field = Object.keys(data)[0] as keyof LadderFormFields;
          const message = data[field].message;

          setError(field, { type: 'custom', message });
        }
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack alignItems="flex-start">
          <FormItem name="name">
            <Input id="name" placeholder="Name" {...register('name')} />
          </FormItem>
          <FormItem name="description">
            <Textarea
              id="description"
              placeholder="Description"
              {...register('description')}
            />
          </FormItem>
          <HStack align="flex-start">
            <FormItem name="startDate" label="Start Date">
              <Input
                id="startDate"
                placeholder="Start Date"
                type="datetime-local"
                {...register('startDate')}
              />
            </FormItem>
            <FormItem name="endDate" label="End Date">
              <Input
                id="endDate"
                placeholder="End Date"
                type="datetime-local"
                {...register('endDate')}
              />
            </FormItem>
          </HStack>
          <FormItem name="maxParticipants" label="Maximum Participants">
            <NumberInput>
              <NumberInputField
                id="maxParticipants"
                {...register('maxParticipants')}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormItem>

          <FormItem name="format" label="Format">
            <Controller
              name="format"
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroup onChange={onChange} value={value}>
                  <Stack>
                    <Radio value="singles">Singles</Radio>
                    <Radio value="doubles">Doubles</Radio>
                  </Stack>
                </RadioGroup>
              )}
            />
          </FormItem>

          <Button
            mt={4}
            colorScheme="purple"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </VStack>
      </form>
    </FormProvider>
  );
};
