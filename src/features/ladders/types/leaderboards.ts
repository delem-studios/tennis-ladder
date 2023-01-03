import { ExpandedParticipant } from '@/features/ladders';
import { BaseEntity, Expand } from '@/types';

export interface Leaderboard extends BaseEntity {
  ladder: string;
  leaderboard: Array<string>;
}

export type ExpandedLeaderboard = Expand<
  Leaderboard,
  { leaderboard: Array<ExpandedParticipant> }
>;
