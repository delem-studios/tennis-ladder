import { ExpandedChallenge, ExpandedParticipant } from '@/features/ladders';
import { BaseEntity, Expand } from '@/types';

export interface Match extends BaseEntity {
  ladder: string;
  winner: string;
  loser: string;
  score: Array<Array<string>>;
  challenge: string;
  date: string;
  isForfeit: boolean;
}

export type ExpandedMatch = Expand<
  Match,
  {
    challenge: ExpandedChallenge;
    winner: ExpandedParticipant;
    loser: ExpandedParticipant;
  }
>;
