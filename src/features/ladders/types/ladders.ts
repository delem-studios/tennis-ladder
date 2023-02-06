import { Organization } from '@/features/organizations';
import { BaseEntity, Expand, User } from '@/types';

export interface Ladder extends BaseEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;

  organizers: Array<string>;

  inviteUrl?: string;
  isRegistrationOpen?: boolean;
  maxParticipants: number;
  isStarted?: boolean;
  status: LadderStatus;

  startDate: string;
  endDate: string;

  format: 'singles' | 'doubles';
  organization?: Organization;

  registrationCode?: string;
}

export type ExpandedLadder = Expand<
  Ladder,
  {
    organizers: Array<User>;
  }
>;

export type LadderStatus = 'draft' | 'registration' | 'running' | 'completed';
