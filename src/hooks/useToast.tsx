import { useToast as useChakraToast } from '@chakra-ui/react';
import React from 'react';

interface UseToastProps {}

export const useToast = ({}: UseToastProps = {}) => {
  return useChakraToast({
    duration: 7000,
    position: 'bottom',
    status: 'success',
  });
};
