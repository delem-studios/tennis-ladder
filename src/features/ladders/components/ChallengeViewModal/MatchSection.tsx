import {
  Center,
  Checkbox,
  Grid,
  GridItem,
  PinInput,
  PinInputField,
  Text,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

import { ExpandedChallenge, useLadderStore } from '@/features/ladders';

import { Section } from './Section';

interface MatchSectionProps {
  challenge: ExpandedChallenge;
}

export const MatchSection = ({ challenge }: MatchSectionProps) => {
  const { score, setField } = useLadderStore();

  const challenger = challenge.expand.challenger;
  const challengee = challenge.expand.challengee;

  useEffect(() => {
    return () => {
      setField('score', [
        ['', ''],
        ['', ''],
        ['', ''],
      ]);
    };
  }, []);

  return (
    <Section title="Submit Match Results">
      <Text color="gray">
        Please use this section to submit the scores once your match has been
        played.
      </Text>

      <Grid
        templateRows="12px 1fr 1fr"
        templateColumns="repeat(8, 1fr)"
        gap={4}
      >
        <GridItem colSpan={4}></GridItem>
        <GridItem colSpan={1}>
          <Text>Set 1</Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Text>Set 2</Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Text>Set 3</Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Text>Retired</Text>
        </GridItem>

        <GridItem colSpan={4}>
          <Text as="b">Challenger</Text>
          <Text>{challenger.expand.primaryPlayer.name}</Text>
        </GridItem>
        <GridItem colSpan={1}>
          <PinInput
            placeholder=""
            value={score[0][0].toString()}
            onChange={(newValue) => {
              const newScore = [...score];
              newScore[0][0] = parseInt(newValue);
              setField('score', newScore);
            }}
          >
            <PinInputField />
          </PinInput>
        </GridItem>
        <GridItem colSpan={1}>
          <PinInput
            placeholder=""
            value={score[1][0].toString()}
            onChange={(newValue) => {
              const newScore = [...score];
              newScore[1][0] = parseInt(newValue);
              setField('score', newScore);
            }}
          >
            <PinInputField />
          </PinInput>
        </GridItem>
        <GridItem colSpan={1}>
          <PinInput
            placeholder=""
            value={score[2][0].toString()}
            onChange={(newValue) => {
              const newScore = [...score];
              newScore[2][0] = parseInt(newValue);
              setField('score', newScore);
            }}
          >
            <PinInputField />
          </PinInput>
        </GridItem>
        <GridItem colSpan={1}>
          <Center>
            <Checkbox />
          </Center>
        </GridItem>

        <GridItem colSpan={4}>
          <Text as="b">Challengee</Text>
          <Text>{challengee.expand.primaryPlayer.name}</Text>
        </GridItem>
        <GridItem colSpan={1}>
          <PinInput
            placeholder=""
            value={score[0][1].toString()}
            onChange={(newValue) => {
              const newScore = [...score];
              newScore[0][1] = parseInt(newValue);
              setField('score', newScore);
            }}
          >
            <PinInputField />
          </PinInput>
        </GridItem>
        <GridItem colSpan={1}>
          <PinInput
            placeholder=""
            value={score[1][1].toString()}
            onChange={(newValue) => {
              const newScore = [...score];
              newScore[1][1] = parseInt(newValue);
              setField('score', newScore);
            }}
          >
            <PinInputField />
          </PinInput>
        </GridItem>
        <GridItem colSpan={1}>
          <PinInput
            placeholder=""
            value={score[2][1].toString()}
            onChange={(newValue) => {
              const newScore = [...score];
              newScore[2][1] = parseInt(newValue);
              setField('score', newScore);
            }}
          >
            <PinInputField />
          </PinInput>
        </GridItem>
        <GridItem colSpan={1}>
          <Center>
            <Checkbox />
          </Center>
        </GridItem>
      </Grid>
    </Section>
  );
};
