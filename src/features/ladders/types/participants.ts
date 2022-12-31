import { Ladder } from '@/features/ladders';
import { BaseEntity, User } from '@/types';

export interface Participant extends BaseEntity {
  ladder: Ladder | string;
  rank?: number;
  primaryPlayer: User | string;
  secondaryPlayer: User | string | null;
}
