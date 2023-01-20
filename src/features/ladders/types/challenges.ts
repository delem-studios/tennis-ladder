import { ExpandedParticipant, Match } from '@/features/ladders';
import { DateTime } from '@/features/miscellaneous';
import { BaseEntity, Expand } from '@/types';

export interface Challenge extends BaseEntity {
  ladder: string;
  challenger: string;
  challengee: string;
  status: 'pending' | 'accepted' | 'completed';
  match: Match;
  thread: string;
  proposedDates: Array<string>;
  acceptedDate: string;
}

export type ExpandedChallenge = Expand<
  Challenge,
  {
    challenger: ExpandedParticipant;
    challengee: ExpandedParticipant;
    proposedDates: Array<DateTime>;
  }
>;
