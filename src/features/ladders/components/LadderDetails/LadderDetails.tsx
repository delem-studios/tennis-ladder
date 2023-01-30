import {
  Editable,
  EditablePreview,
  EditableTextarea,
  StatGroup,
  Textarea,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { Info } from '@/components';
import { useToast } from '@/hooks';

import { LadderTabContainer } from '../';
import { useRules, useUpdateRules } from '../../api';
import { Ladder } from '../../types';

export interface LadderDetailsProps {
  ladder: Ladder;
}

export const LadderDetails = ({ ladder }: LadderDetailsProps) => {
  const toast = useToast();
  const { data: rules, isSuccess } = useRules(ladder.id);
  const [details, setDetails] = useState(rules?.details || '');
  const { mutate: updateRules } = useUpdateRules();

  const handleSave = () => {
    if (!rules) return;

    updateRules(
      { ...rules, details },
      {
        onError: () => {
          toast({ title: 'Unable to update rules.', status: 'error' });
        },
      }
    );
  };

  return (
    <LadderTabContainer title="Details">
      <StatGroup gap={4} mb={6}>
        <Info
          label="Days to Respond"
          content={
            rules?.challengeResponseDays +
            ' day' +
            (rules?.challengeResponseDays === 1 ? '' : 's')
          }
        />
        <Info
          label="Challenge Range"
          content={
            rules?.challengeRange +
            ' rank' +
            (rules?.challengeRange === 1 ? '' : 's')
          }
        />
        <Info
          label="Outbound Challenge Limit"
          content={rules?.outboundChallengeLimit}
        />
        <Info
          label="Inbound Challenge Limit"
          content={rules?.inboundChallengeLimit}
        />
      </StatGroup>
      {isSuccess && (
        <Editable
          placeholder="No details have been provided."
          defaultValue={rules?.details}
        >
          <EditablePreview whiteSpace="break-spaces" />
          <Textarea
            as={EditableTextarea}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            onBlur={handleSave}
          />
        </Editable>
      )}
    </LadderTabContainer>
  );
};
