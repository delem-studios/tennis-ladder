import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClientResponseError } from 'pocketbase';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { useToast } from '@/hooks';
import { client } from '@/libs/client';

const schema = yup.object({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Please provide your email address.'),
  password: yup
    .string()
    .required('Please provide your password.')
    .min(8, 'Must be at least 8 characters.')
    .max(256, 'Must be at most 256 characters.'),
});

export interface LoginFormFields {
  email: string;
  name: string;
  password: string;
}

export interface LoginFormProps {}

export const LoginForm = ({}: LoginFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormFields>({
    resolver: yupResolver(schema),
  });
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormFields> = async (values) => {
    try {
      await client
        .collection('users')
        .authWithPassword(values.email, values.password);

      toast({ title: "You've logged in successfully!" });

      navigate('/');
    } catch (error) {
      if (error instanceof ClientResponseError) {
        const { code, data } = error.data;

        if (code === 400) {
          toast({
            title: 'Unable to login with the provided credentials.',
            status: 'error',
          });

          const field = Object.keys(data)[0] as keyof LoginFormFields;
          const message = data[field].message;

          setError(field, { type: 'custom', message });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack>
        <FormControl isInvalid={Boolean(errors.email)}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            {...register('email')}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={Boolean(errors.password)}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
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
  );
};
