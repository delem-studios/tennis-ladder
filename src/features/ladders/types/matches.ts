import { Participant } from '@/features/ladders';
import { BaseEntity, Expand } from '@/types';

export interface Match extends BaseEntity {
  ladder: string;
  winner: string;
  loser: string;
  score: Array<Array<string>>;
}

export type ExpandedMatch = Expand<
  Match,
  {
    winner: Participant;
    loser: Participant;
  }
>;
