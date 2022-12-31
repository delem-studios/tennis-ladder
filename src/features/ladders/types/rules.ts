import { BaseEntity } from '@/types';

export interface Rules extends BaseEntity {
  ladder: string;
  challengeRange: number;
  challengeResponseDays?: number;
}
