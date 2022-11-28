import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/layout';
import React from 'react';
import { NavLink } from 'react-router-dom';

export interface LinkProps extends ChakraLinkProps {
  to: string;
  children: React.ReactNode;
}

export const Link = ({ to, children, ...rest }: LinkProps) => {
  return (
    <ChakraLink as={NavLink} to={to} {...rest}>
      {children}
    </ChakraLink>
  );
};
