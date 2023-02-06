import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import React from 'react';
import { MdCheckCircle } from 'react-icons/all';

import { MainLayout } from '@/components';

interface HomePageProps {}

export const HomePage = ({}: HomePageProps) => {
  return (
    <MainLayout>
      <Flex as="section" height={`calc(100vh)`}>
        <Flex align="center" justify="center" bgColor="blue.800" flex={2}>
          <Heading color="white">Simple Tennis Ladder Software</Heading>
        </Flex>
        <Flex align="center" justify="center" flexDir="column" flex={1}>
          <Text>Simple Features:</Text>
          <List>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Free software to create and manage tennis ladders
            </ListItem>
            <ListItem>Emails</ListItem>
          </List>
        </Flex>
      </Flex>
    </MainLayout>
  );
};
