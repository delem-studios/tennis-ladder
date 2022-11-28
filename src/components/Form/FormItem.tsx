import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import React from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';

export interface FormItemProps {
  name: string;
  label?: string;

  children: React.ReactNode;
}

export const FormItem = <T extends FieldValues>({
  name,
  children,
}: FormItemProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<any>();

  const errorString = String(errors[name]?.message);

  return (
    <FormControl isInvalid={Boolean(errors[name])}>
      <FormLabel htmlFor={name}>{name}</FormLabel>
      {children}
      <FormErrorMessage>{errorString}</FormErrorMessage>
    </FormControl>
  );
};
