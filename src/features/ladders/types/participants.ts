import { Ladder } from '@/features/ladders';
import { BaseEntity, Expand, User } from '@/types';

export interface Participant extends BaseEntity {
  ladder: Ladder | string;
  rank?: number;
  primaryPlayer: User | string;
  secondaryPlayer: User | string | null;

  wins?: number;
  losses?: number;

  setsWon?: number;
  setsLost?: number;

  gamesWon?: number;
  gamesLost?: number;
}

export type ExpandedParticipant = Expand<
  Participant,
  { primaryPlayer: User; secondaryPlayer: User }
>;
