import { Select } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';

import { ExpandedChallenge, useLadderStore } from '@/features/ladders';

import { Section } from './Section';

interface ActionsSectionProps {
  challenge: ExpandedChallenge;
}

export const ActionsSection = ({ challenge }: ActionsSectionProps) => {
  const { acceptDate, setField } = useLadderStore();

  if (challenge.status !== 'pending') return null;

  return (
    <Section title="Actions">
      <Select
        value={acceptDate}
        onChange={(e) => setField('acceptDate', e.target.value)}
      >
        <option value="">Select a date</option>
        {challenge.proposedDates.map((date) => (
          <option value={date} key={date}>
            {dayjs(date).format('dddd, MMMM D, YYYY h:mm A')}
          </option>
        ))}
      </Select>
    </Section>
  );
};
