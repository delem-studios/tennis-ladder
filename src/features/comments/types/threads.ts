import { BaseEntity } from '@/types';

export interface Thread extends BaseEntity {
  isClosed?: boolean;
}
