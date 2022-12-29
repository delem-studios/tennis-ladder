import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import React from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';

export interface FormItemProps {
  name: string;
  label?: string;

  children: React.ReactElement;
}

export const FormItem = <T extends FieldValues>({
  name,
  label,
  children,
}: FormItemProps) => {
  const { getFieldState } = useFormContext<T>();

  const state = getFieldState(name as any);
  const errorString = state.error?.message;

  return (
    <FormControl isInvalid={Boolean(errorString)}>
      <FormLabel htmlFor={name} textTransform="capitalize">
        {label || name}
      </FormLabel>
      {children}
      <FormErrorMessage>{errorString}</FormErrorMessage>
    </FormControl>
  );
};
