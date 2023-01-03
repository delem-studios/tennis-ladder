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
  name: yup
    .string()
    .min(2, 'Must be at least 2 characters.')
    .max(100, 'Must be at most 100 characters.'),
  password: yup
    .string()
    .required('Please provide a password.')
    .min(8, 'Must be at least 8 characters.')
    .max(256, 'Must be at most 256 characters.')
    .matches(
      /^[a-zA-Z0-9!@#$%^&*()]+$/,
      'Password can only contain alphanumeric characters and the following special characters: !@#$%^&*().'
    )
    .matches(/[a-z]/, 'Password must contain at least one lowercase character.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase character.')
    .matches(/[0-9]/, 'Password must contain at least one number.')
    .matches(
      /[!@#$%^&*()]/,
      'Password must contain at least one special character.'
    ),
});

export interface RegisterFormFields {
  email: string;
  name: string;
  password: string;
}

export interface RegisterFormProps {}

export const RegisterForm = ({}: RegisterFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormFields>({
    resolver: yupResolver(schema),
  });
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormFields> = async (values) => {
    try {
      await client
        .collection('users')
        .create({ ...values, passwordConfirm: values.password });

      await client
        .collection('users')
        .authWithPassword(values.email, values.password);

      toast({ title: "You've successfully created a new account!" });

      navigate('/');
    } catch (error) {
      if (error instanceof ClientResponseError) {
        const { code, data } = error.data;

        if (code === 400) {
          const field = Object.keys(data)[0] as keyof RegisterFormFields;
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

        <FormControl isInvalid={Boolean(errors.name)}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input id="name" placeholder="Name" {...register('name')} />
          <FormErrorMessage>
            {errors.name && errors.name.message}
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
