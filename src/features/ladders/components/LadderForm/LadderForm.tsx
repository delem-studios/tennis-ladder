import { Button, HStack, Input, Textarea, VStack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClientResponseError } from 'pocketbase';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
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
    .min(yup.ref('startDate'), ({ min }) => `Date needs to be after ${min}`),
});

export interface LadderFormFields {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface LadderFormProps {}

export const LadderForm = ({}: LadderFormProps) => {
  const toast = useToast();
  const navigate = useNavigate();
  const methods = useForm<LadderFormFields>({
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onSubmit: SubmitHandler<LadderFormFields> = async (values) => {
    console.log('Values:', values);

    try {
      await client.collection('ladders').create({ ...values });

      toast({ title: "You've successfully created a new account!" });

      navigate('/');
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
                type="date"
                {...register('startDate')}
              />
            </FormItem>
            <FormItem name="endDate" label="End Date">
              <Input
                id="endDate"
                placeholder="End Date"
                type="date"
                {...register('endDate')}
              />
            </FormItem>
          </HStack>

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
