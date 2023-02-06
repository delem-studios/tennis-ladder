import { Button, HStack, StatGroup, Textarea } from '@chakra-ui/react';
import ChakraReactMarkdown from 'chakra-ui-markdown-renderer';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Info } from '@/components';
import { useLadderStore } from '@/features/ladders';
import { useBoolean, useToast } from '@/hooks';

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
  const { isAdmin } = useLadderStore();
  const { state: isEditing, setState: setIsEditing } = useBoolean();

  const handleSave = () => {
    if (!rules) return;

    updateRules(
      { ...rules, details },
      {
        onSuccess: () => {
          toast({ title: 'Details updated!' });
          setIsEditing(false);
        },
        onError: () => {
          toast({ title: 'Unable to update rules.', status: 'error' });
        },
      }
    );
  };

  const handleCancel = () => {
    setDetails(rules?.details || '');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setDetails(rules?.details || '');
    setIsEditing(true);
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
      <ReactMarkdown
        components={ChakraReactMarkdown()}
        children={rules?.details || 'No details have been provided.'}
        skipHtml
      />
      {isAdmin && !isEditing && (
        <Button onClick={handleEdit} my={4}>
          Edit
        </Button>
      )}
      {isEditing && (
        <HStack my={4}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} colorScheme="blue">
            Confirm
          </Button>
        </HStack>
      )}
      {isEditing && (
        <Textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={10}
        />
      )}
    </LadderTabContainer>
  );
};
