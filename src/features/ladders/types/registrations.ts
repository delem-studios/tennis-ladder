import { BaseEntity, Expand, User } from '@/types';

export interface Registration extends BaseEntity {
  ladder: string;

  primaryPlayer: string;
  secondaryPlayer?: string;

  status?: RegistrationStatus;
}

export type RegistrationStatus = 'pending' | 'accepted' | 'rejected';

export type ExpandedRegistration = Expand<
  Registration,
  {
    primaryPlayer: User;
    secondaryPlayer?: User;
  }
>;
