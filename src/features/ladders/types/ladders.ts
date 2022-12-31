import { Organization } from '@/features/organizations';
import { BaseEntity } from '@/types';

export interface Ladder extends BaseEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;

  inviteUrl?: string;
  isRegistrationOpen?: boolean;
  maxParticipants: number;

  startDate: string;
  endDate: string;

  format: 'singles' | 'doubles';
  organization?: Organization;
}
