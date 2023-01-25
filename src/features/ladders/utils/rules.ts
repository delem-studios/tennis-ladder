import { ExpandedChallenge, Rules } from '@/features/ladders';

const DEFAULT_OUTBOUND_CHALLENGE_LIMIT = 3;
const DEFAULT_INBOUND_CHALLENGE_LIMIT = 3;

export const hasOutboundChallengesRemaining = (
  rules: Rules,
  myChallenges: Array<ExpandedChallenge>,
  myParticipationId: string
) => {
  const limit =
    rules.outboundChallengeLimit || DEFAULT_OUTBOUND_CHALLENGE_LIMIT;

  const outboundChallengeCount = myChallenges.reduce((acc, curr) => {
    if (curr.challenger === myParticipationId) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return outboundChallengeCount < limit;
};

export const hasInboundChallengesRemaining = (
  rules: Rules,
  myChallenges: Array<ExpandedChallenge>,
  myParticipationId: string
) => {
  const limit = rules.inboundChallengeLimit || DEFAULT_INBOUND_CHALLENGE_LIMIT;

  const inboundChallengeCount = myChallenges.reduce((acc, curr) => {
    if (curr.challengee === myParticipationId) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return inboundChallengeCount < limit;
};
