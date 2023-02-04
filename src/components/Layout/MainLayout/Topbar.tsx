import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { mainMenu } from '@/config';
import { client } from '@/libs/client';

import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

interface TopbarProps {}

export const Topbar = ({}: TopbarProps) => {
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const user = client.authStore.model;

  return (
    <Box as="section" bgColor="white" position="sticky" top={0} zIndex={200}>
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue('sm', 'sm-dark')}
      >
        <Box py={{ base: '3' }} px={4}>
          <HStack spacing="10" justify="space-between">
            <Logo onClick={() => navigate('/')} />
            {isDesktop ? (
              <Flex justify="space-between" flex="1">
                <ButtonGroup variant="link" spacing="8">
                  {mainMenu.map((item) => (
                    <Button
                      key={item.link}
                      onClick={() => navigate(item.link)}
                      textTransform="capitalize"
                    >
                      {item.label}
                    </Button>
                  ))}
                </ButtonGroup>
                <HStack spacing="3">
                  {user ? (
                    <>
                      <Text>Welcome, {user.name}!</Text>
                      <Button
                        variant="ghost"
                        onClick={() => navigate('/logout')}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => navigate('/login')}
                      >
                        Sign in
                      </Button>
                      <Button
                        colorScheme="purple"
                        onClick={() => navigate('/register')}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                </HStack>
              </Flex>
            ) : (
              <MobileMenu />
            )}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};
