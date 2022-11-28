import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {}

export const Topbar = ({}: TopbarProps) => {
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  return (
    <Box as="section">
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue('sm', 'sm-dark')}
      >
        <Box py={{ base: '4', lg: '5' }} px={4}>
          <HStack spacing="10" justify="space-between">
            <Heading fontWeight="black">Ladder</Heading>
            {isDesktop ? (
              <Flex justify="space-between" flex="1">
                <ButtonGroup variant="link" spacing="8">
                  {['Product', 'Pricing', 'Resources', 'Support'].map(
                    (item) => (
                      <Button key={item}>{item}</Button>
                    )
                  )}
                </ButtonGroup>
                <HStack spacing="3">
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Sign in
                  </Button>
                  <Button
                    colorScheme="purple"
                    onClick={() => navigate('/register')}
                  >
                    Sign up
                  </Button>
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
