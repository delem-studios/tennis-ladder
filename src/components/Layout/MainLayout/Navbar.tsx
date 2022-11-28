import { Link as ChakraLink } from '@chakra-ui/layout';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

const navigation = [
  {
    name: 'Home',
    to: '/home',
  },
  {
    name: 'Ladders',
    to: '/ladders',
  },
];

const StyledLink = ({
  to,
  children,
}: { children: React.ReactNode } & NavLinkProps) => {
  const activeBgc = useColorModeValue('purple.200', 'gray.500');
  const hoverBgc = useColorModeValue('purple.100', 'gray.500');

  return (
    <ChakraLink
      as={NavLink}
      to={to}
      width="100%"
      borderRadius={4}
      px={2}
      py="2px"
      mb={1}
      _activeLink={{ fontWeight: 'bold', background: activeBgc }}
      _hover={{
        background: hoverBgc,
      }}
    >
      {children}
    </ChakraLink>
  );
};

export const Navbar = () => {
  return (
    <Flex direction="column" py={4} px={5}>
      {navigation.map((nav) => (
        <StyledLink to={nav.to} key={nav.to}>
          {nav.name}
        </StyledLink>
      ))}
    </Flex>
  );
};
