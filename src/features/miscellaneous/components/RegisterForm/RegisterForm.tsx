import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email().required(),
  firstName: yup
    .string()
    .min(2, 'Must be at least 2 characters.')
    .max(100, 'Must be at most 100 characters.'),
  lastName: yup.string().min(2, 'Must be at least 2 characters.'),
  password: yup
    .string()
    .required('Please provide a password.')
    .min(8, 'Must be at least 8 characters.')
    .max(256, 'Must be at most 256 characters.')
    .matches(
      /^[a-zA-Z0-9!@#$%^&*()]$/,
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
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterFormProps {}

export const RegisterForm = ({}: RegisterFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormFields>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<RegisterFormFields> = (values) => {
    console.log('Values:', values);
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

        <FormControl isInvalid={Boolean(errors.firstName)}>
          <FormLabel htmlFor="firstName">First Name</FormLabel>
          <Input
            id="firstName"
            placeholder="First name"
            {...register('firstName')}
          />
          <FormErrorMessage>
            {errors.firstName && errors.firstName.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={Boolean(errors.lastName)}>
          <FormLabel htmlFor="lastName">Last Name</FormLabel>
          <Input
            id="lastName"
            placeholder="Last name"
            {...register('lastName')}
          />
          <FormErrorMessage>
            {errors.lastName && errors.lastName.message}
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
