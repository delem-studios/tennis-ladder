import { Participant } from '@/features/ladders';
import { BaseEntity } from '@/types';

export interface Match extends BaseEntity {
  ladder: string;
  winner: Participant;
  loser: Participant;
}
