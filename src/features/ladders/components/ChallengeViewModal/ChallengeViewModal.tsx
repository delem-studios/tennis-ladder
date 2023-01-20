import {
  Highlight,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  defaultChallengeViewModalState,
  useChallengeById,
  useLadderStore,
  useLeaderboard,
} from '@/features/ladders';
import { client } from '@/libs/client';

import { ActionsSection } from './ActionsSection';
import { ChallengeViewFooter } from './ChallengeViewFooter';
import { DetailsSection } from './DetailsSection';
import { MatchSection } from './MatchSection';
import { OpponentDetailsSection } from './OpponentDetailsSection';

export interface ChallengeViewModalProps {}

export const ChallengeViewModal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const challengeId = searchParams.get('challengeId');
  const { data: challenge } = useChallengeById({
    challengeId: searchParams.get('challengeId'),
  });
  const { ladder, myParticipantId, setFields } = useLadderStore();
  const { data: leaderboard } = useLeaderboard(ladder?.id);

  const handleClose = () => {
    navigate(`/ladders/${ladder?.slug}/my-challenges`);
    setFields(defaultChallengeViewModalState);
  };

  if (!challenge || !leaderboard) return null;

  const challenger = challenge.expand.challenger;
  const challengee = challenge.expand.challengee;

  const myName = client.authStore.model?.name;

  const challengerName = challenger.expand.primaryPlayer.name;
  const challengeeName = challengee.expand.primaryPlayer.name;

  const isChallenger = myParticipantId === challenger.id;
  const opponent = isChallenger ? challengee : challenger;

  return (
    <Modal isOpen={Boolean(challengeId)} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Highlight
            query={myName}
            styles={{
              bg: 'yellow.100',
            }}
          >
            {`${challengerName} challenges ${challengeeName}`}
          </Highlight>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DetailsSection challenge={challenge} leaderboard={leaderboard} />
          {/*<Section title="Messages">*/}
          {/*  <CommentsSection threadId={challenge.thread} />*/}
          {/*</Section>*/}

          <OpponentDetailsSection opponent={opponent} />
          <ActionsSection challenge={challenge} />
          <MatchSection challenge={challenge} />
        </ModalBody>

        <ChallengeViewFooter
          ladder={ladder}
          isChallenger={isChallenger}
          handleClose={handleClose}
        />
      </ModalContent>
    </Modal>
  );
};
