import { Heading } from '@chakra-ui/react';
import React from 'react';

export const Logo = (props: { onClick: () => void }) => {
  return (
    <Heading as="button" onClick={props.onClick} fontWeight="black" size="lg">
      TLadder
    </Heading>
  );
};
