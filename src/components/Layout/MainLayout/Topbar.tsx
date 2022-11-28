import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Heading,
  IconButton,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { client } from '@/libs/client';

interface TopbarProps {}

export const Topbar = ({}: TopbarProps) => {
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const user = client.authStore.model;

  return (
    <Box as="section">
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue('sm', 'sm-dark')}
      >
        <Box py={{ base: '4', lg: '5' }} px={4}>
          <HStack spacing="10" justify="space-between">
            <Heading fontWeight="black" size="lg">
              Ladder
            </Heading>
            {isDesktop ? (
              <Flex justify="space-between" flex="1">
                <ButtonGroup variant="link" spacing="8">
                  {['ladder'].map((item) => (
                    <Button
                      key={item}
                      onClick={() => navigate(`/${item}`)}
                      textTransform="capitalize"
                    >
                      {item}
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
              <IconButton
                variant="ghost"
                icon={<FiMenu fontSize="1.25rem" />}
                aria-label="Open Menu"
              />
            )}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};
