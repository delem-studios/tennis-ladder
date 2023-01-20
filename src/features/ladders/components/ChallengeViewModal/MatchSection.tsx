import {
  Center,
  Checkbox,
  Grid,
  GridItem,
  Highlight,
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
  const {
    score,
    winner,
    loser,
    retired,
    challengerSetsWon,
    challengeeSetsWon,
    setField,
    setFields,
  } = useLadderStore();

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

  useEffect(() => {
    const challengerSetsWon = score.reduce((acc, curr) => {
      const challengerGameCount = parseInt(curr[0]);
      const challengeeGameCount = parseInt(curr[1]);

      if (!challengerGameCount || !challengeeGameCount) return acc;
      if (challengerGameCount > challengeeGameCount) return acc + 1;

      return acc;
    }, 0);
    const challengeeSetsWon = score.reduce((acc, curr) => {
      const challengerGameCount = parseInt(curr[0]);
      const challengeeGameCount = parseInt(curr[1]);
      if (!challengerGameCount || !challengeeGameCount) return acc;

      if (challengerGameCount < challengeeGameCount) return acc + 1;

      return acc;
    }, 0);
    const isSetCountEqual = challengerSetsWon === challengeeSetsWon;

    if (retired) {
      const didChallengerWin = retired === 'challengee';

      const winner = didChallengerWin ? challenger.id : challengee.id;
      const loser = didChallengerWin ? challengee.id : challenger.id;

      return setFields({ challengerSetsWon, challengeeSetsWon, winner, loser });
    }

    if (isSetCountEqual) {
      setFields({
        challengerSetsWon,
        challengeeSetsWon,
        winner: null,
        loser: null,
      });
    } else {
      const didChallengerWin = challengerSetsWon > challengeeSetsWon;
      const winner = didChallengerWin ? challenger.id : challengee.id;
      const loser = didChallengerWin ? challengee.id : challenger.id;

      setFields({ challengerSetsWon, challengeeSetsWon, winner, loser });
    }
  }, [score, retired]);

  if (challenge.status !== 'accepted') return null;

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
        <GridItem colSpan={4} />
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

        <GridItem colSpan={3}>
          <Text as="b">
            <Highlight
              query={
                winner === challenger.id || loser === challenger.id
                  ? 'Challenger'
                  : ''
              }
              styles={{
                bg: winner === challenger.id ? 'green.100' : 'red.100',
              }}
            >
              Challenger
            </Highlight>
          </Text>
          <Text>{challenger.expand.primaryPlayer.name}</Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Center>
            <Text as="b">{challengerSetsWon !== 0 && challengerSetsWon}</Text>
          </Center>
        </GridItem>
        <GridItem colSpan={1}>
          <PinInput
            placeholder=""
            value={score[0][0].toString()}
            onChange={(newValue) => {
              const newScore = [...score];
              newScore[0][0] = newValue;
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
              newScore[1][0] = newValue;
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
              newScore[2][0] = newValue;
              setField('score', newScore);
            }}
          >
            <PinInputField />
          </PinInput>
        </GridItem>
        <GridItem colSpan={1}>
          <Center>
            <Checkbox
              isChecked={retired === 'challenger'}
              onChange={(e) =>
                setField('retired', e.target.checked ? 'challenger' : null)
              }
            />
          </Center>
        </GridItem>

        <GridItem colSpan={3}>
          <Text as="b">
            <Highlight
              query={
                winner === challengee.id || loser === challengee.id
                  ? 'Challengee'
                  : ''
              }
              styles={{
                bg: winner === challengee.id ? 'green.100' : 'red.100',
              }}
            >
              Challengee
            </Highlight>
          </Text>
          <Text>{challengee.expand.primaryPlayer.name}</Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Center>
            <Text as="b">{challengeeSetsWon !== 0 && challengeeSetsWon}</Text>
          </Center>
        </GridItem>
        <GridItem colSpan={1}>
          <PinInput
            placeholder=""
            value={score[0][1].toString()}
            onChange={(newValue) => {
              const newScore = [...score];
              newScore[0][1] = newValue;
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
              newScore[1][1] = newValue;
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
              newScore[2][1] = newValue;
              setField('score', newScore);
            }}
          >
            <PinInputField />
          </PinInput>
        </GridItem>
        <GridItem colSpan={1}>
          <Center>
            <Checkbox
              isChecked={retired === 'challengee'}
              onChange={(e) =>
                setField('retired', e.target.checked ? 'challengee' : null)
              }
            />
          </Center>
        </GridItem>
      </Grid>
    </Section>
  );
};
